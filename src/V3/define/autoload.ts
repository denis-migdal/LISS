import define, { WaitingDefine } from "V3/define/define";
import LISS from "V3";
import AutoContentGenerator from "V3/ContentGenerators/AutoContentGenerator";
import isPageLoaded from "V3/utils/DOM/isPageLoaded";
import whenPageLoaded from "V3/utils/DOM/whenPageLoaded";
import fetchText from "V3/utils/network/fetchText";
import execute from "V3/utils/execute";

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
                if( addition.constructor.name === "HTMLElement" )
                // cf https://github.com/WICG/webcomponents/issues/1097#issuecomment-2665092315
                // if(addition instanceof HTMLUnknownElement)
                    addTag(addition as HTMLElement)

    }).observe( document, { childList:true, subtree:true });

    for( let elem of document.querySelectorAll<HTMLElement>(":not(:defined)") )
        addTag( elem );

    async function addTag(tag: HTMLElement) {

        await SW; // ensure SW is installed.

        const tagname = tag.tagName.toLowerCase();

        if(  WaitingDefine.has(tagname)
            // could be defined, but not yet upgraded
         || customElements.get(tagname) !== undefined)
            return;

        loadComponent(tagname, {
            //brython,
            cdir
        });		
    }
}

/*****/

type loadComponent_Opts = {
	cdir   ?: string|null
};

type Cstr<T> = (...args: any[]) => T;

export async function loadComponent<T extends HTMLElement = HTMLElement>(
	tagname: string,
	{
		cdir    = DEFAULT_CDIR,
		// brython = null
	}: loadComponent_Opts = {}
): Promise<Cstr<T>> {

	WaitingDefine.add(tagname);

	const compo_dir = `${cdir}${tagname}/`;

	const files: Record<string,string|undefined> = {};

	// strats : JS -> Bry -> HTML+CSS (cf script attr).

    files["js"] = await fetchText(`${compo_dir}index.js`, true);

    if( files["js"] === undefined) {
        // try/catch ?
        const promises = [
            fetchText(`${compo_dir}index.html`, true)!,
            fetchText(`${compo_dir}index.css` , true)!
        ];

        [files["html"], files["css" ]] = await Promise.all(promises);
    }

	return await defineWebComponent(tagname, files, compo_dir);
}

//TODO: rename from files ?
async function defineWebComponent(tagname: string,
                                  files: Record<string, any>,
                                  origin : string,
                                ) {
    
    let klass;
    if( "js" in files )
        klass = (await execute<any>(files["js"], "js", origin)).default;

    if( klass === undefined )
        klass = LISS({
            content_generator: AutoContentGenerator,
            ...files
        });

    define(tagname, klass);

    return klass;
}