import { DEFAULT_CDIR, KnownTags } from "V2/helpers/LISSAuto";
import define from "V3/utils/define";
import LISSv3 from "V3";
import AutoContentGenerator from "V3/ContentGenerators/AutoContentGenerator";

type importComponents_OptsV3<T extends HTMLElement> = {
	cdir   ?: string|null
};

export async function importComponentV3<T extends HTMLElement = HTMLElement>(
	tagname: string,
	{
		cdir    = DEFAULT_CDIR,
		// brython = null
	}: importComponents_OptsV3<T> = {}
) {

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
        klass = LISSv3({
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