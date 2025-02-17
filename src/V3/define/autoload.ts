import { KnownTags } from "V2/helpers/LISSAuto";
import define from "V3/define/define";
import LISS from "V3";
import AutoContentGenerator from "V3/ContentGenerators/AutoContentGenerator";
import isPageLoaded from "V3/utils/DOM/isPageLoaded";
import whenPageLoaded from "V3/utils/DOM/whenPageLoaded";

const script =  document.querySelector<HTMLElement>('script:is([liss-auto],[liss-cdir],[liss-sw])');

export const LISS_MODE    = script?.getAttribute('liss-mode') ?? null;
export const DEFAULT_CDIR = script?.getAttribute('liss-cdir') ?? null;

// TODO: default ?
const SW_PATH             = script?.getAttribute('liss-sw') ?? null;

if(LISS_MODE === "auto-load" && DEFAULT_CDIR !== null) {
    if( ! isPageLoaded() )
        await whenPageLoaded();
    autoload(DEFAULT_CDIR);
}


export function autoload(cdir: string) {

    const SW: Promise<void> = new Promise( async (resolve) => {

        if( SW_PATH === null ) {
            console.warn("You are using LISS Auto mode without sw.js.");
            resolve();
            return;
        }
        
        try {
            await navigator.serviceWorker.register(SW_PATH, {scope: "/"});
        } catch(e) {
            console.warn("Registration of ServiceWorker failed");
            console.error(e);
            resolve();
        }

        if( navigator.serviceWorker.controller ) {
            resolve();
            return;
        }

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            resolve();
        });
    });

    if( cdir[cdir.length-1] !== '/')
        cdir += '/';

    //const brython = script.getAttribute("brython");

    // observe for new injected tags.
    new MutationObserver( (mutations) => {
        for(let mutation of mutations)
            for(let addition of mutation.addedNodes)
                if(addition instanceof HTMLUnknownElement)
                    addTag(addition)

    }).observe( document, { childList:true, subtree:true });

    for( let elem of document.querySelectorAll<HTMLElement>("*:not(:defined)") )
        addTag( elem );

    async function addTag(tag: HTMLElement) {

        await SW; // ensure SW is installed.

        const tagname = tag.tagName.toLowerCase();

        if( ! tagname.includes('-') || KnownTags.has( tagname ) )
            return;

        loadComponent(tagname, {
            //brython,
            cdir
        });		
    }
}

/*****/

type importComponents_Opts = {
	cdir   ?: string|null
};

type Cstr<T> = (...args: any[]) => T;

export async function loadComponent<T extends HTMLElement = HTMLElement>(
	tagname: string,
	{
		cdir    = DEFAULT_CDIR,
		// brython = null
	}: importComponents_Opts = {}
): Promise<Cstr<T>> {

	KnownTags.add(tagname);

	const compo_dir = `${cdir}${tagname}/`;

	const files: Record<string,string|undefined> = {};

	// strats : JS -> Bry -> HTML+CSS (cf script attr).

    files["js"] = await _fetchText(`${compo_dir}index.js`, true);

    if( files["js"] === undefined) {
        // try/catch ?
        const promises = [
            _fetchText(`${compo_dir}index.html`, true)!,
            _fetchText(`${compo_dir}index.css` , true)!
        ];
        [files["html"], files["css" ]] = await Promise.all(promises);
    }

	return await defineWebComponent(tagname, files);
}

async function execute(code: string, type: "js") {

    let result;

    if( type === "js" ) {
        const file = new Blob([code], { type: 'application/javascript' });
        const url  = URL.createObjectURL(file);

        result = (await import(/* webpackIgnore: true */ url));
        
        URL.revokeObjectURL(url);
    }

    return result;
}

//TODO: rename from files ?
async function defineWebComponent(tagname: string,
                                  files: Record<string, any>
                                ) {
    
    let klass;
    if( "js" in files ) {
        klass = (await execute(files["js"], "js")).default;
    }

    if( klass === undefined )
        klass = LISS({
            content_generator: AutoContentGenerator,
            ...files
        });

    define(tagname, klass);

    return klass;
}

declare global {
    var LISSContext: {
        fetch?: {
            cwd  : string,
            files: Record<string, string>
        }
    }
}

// in auto-mode use ServiceWorker to hide 404 error messages.
// if playground files, use them.
export async function _fetchText(uri: string|URL, hide404: boolean = false) {

    const fetchContext = globalThis.LISSContext.fetch;
    if( fetchContext !== undefined ) {
        const path = new URL(uri, fetchContext.cwd );
        const value = fetchContext.files[path.toString()];
        if( value === "" )
            return undefined;
        if( value !== undefined)
            return value;
    }

    const options = hide404
                        ? {headers:{"liss-auto": "true"}}
                        : {};


    const response = await fetch(uri, options);
    if(response.status !== 200 )
        return undefined;

    if( hide404 && response.headers.get("status")! === "404" )
        return undefined;

    const answer = await response.text();

    if(answer === "")
        return undefined;

    return answer
}

// @ts-ignore
globalThis.require = async function(url: string) {
    //TODO: non playground...
    return await _fetchText(url);
}