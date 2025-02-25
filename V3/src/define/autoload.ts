import define, { WaitingDefine } from "@LISS/src/define/define";
import LISS from "@LISS/src";
import AutoContentGenerator from "@LISS/src/ContentGenerators/AutoContentGenerator";
import isPageLoaded   from "@LISS/src/utils/DOM/isPageLoaded";
import whenPageLoaded from "@LISS/src/utils/DOM/whenPageLoaded";
import fetchText      from "@LISS/src/utils/network/fetchText";
import execute        from "@LISS/src/utils/execute";

const script =  document.querySelector<HTMLElement>('script:is([liss-auto],[liss-cdir],[liss-sw],[liss-files])');

function parseLISSFiles(files: string|null|undefined) {
    if( ! files )
        return ["js", "bry", "html+css"]
    return files.split(",");
}

export const LISS_MODE    = script?.getAttribute('liss-mode') ?? null;
export const LISS_FILES   = parseLISSFiles( script?.getAttribute('liss-files') );
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

        if( SW_PATH === null || SW_PATH === "") {
            console.info("You are using LISS Auto mode without sw.js.");
            return resolve();
        }
        
        try {
            await navigator.serviceWorker.register(SW_PATH, {scope: "/V3/assets/"});
        } catch(e) {
            console.warn("Registration of ServiceWorker failed");
            console.error(e);
            return resolve();
        }

        if( navigator.serviceWorker.controller )
            return resolve();

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


async function tryFile( compo_dir: string,
                        ext: string,
                        target:Record<string,string>): Promise<boolean> {

    // special value...
    if( ext === "html+css") {
        const promises = [
            fetchText(`${compo_dir}index.html`, true)!,
            fetchText(`${compo_dir}index.css` , true)!
        ];

        let result = await Promise.all(promises);

        if( result[0] === undefined)
            return false;

        target["html"] = result[0];
        if( result[1] !== undefined)
            target["css" ] = result[1];

        return true;
    }

    const result = await fetchText(`${compo_dir}index.${ext}`, true);

    if( result === undefined )
        return false;

    target[ext] = result;

    return true;
}

export async function loadComponent<T extends HTMLElement = HTMLElement>(
	tagname: string,
	{
		cdir    = DEFAULT_CDIR,
		// brython = null
	}: loadComponent_Opts = {}
): Promise<Cstr<T>> {

	WaitingDefine.add(tagname);

    let true_tagdir = globalThis.LISSContext?.override_tags?.[tagname] ?? tagname;     

	const compo_dir = `${cdir}${true_tagdir}/`;

    const files: Record<string,string> = {};
    let found = false;
    for(let file of LISS_FILES)
        if( found = await tryFile(compo_dir, file, files) )
            break;

    if( ! found )
        throw new Error(`No files found for webcomponent ${tagname}`)

	return await defineWebComponent(tagname, files, compo_dir);
}

//TODO: rename from files ?
async function defineWebComponent(tagname: string,
                                  files: Record<string, any>,
                                  origin : string,
                                ) {
    
    let klass;
    if( files["js"]  !== undefined )
        klass = (await execute<any>(files["js"], "js", origin)).default;
    if( files["bry"] !== undefined )
        klass = (await execute<any>(files["bry"], "bry", origin)).default;

    if( klass === undefined )
        klass = LISS({
            content_generator: AutoContentGenerator,
            ...files
        });

    define(tagname, klass);

    return klass;
}