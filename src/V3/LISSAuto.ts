import { DEFAULT_CDIR, defineWebComponentV3, KnownTags } from "V2/helpers/LISSAuto";

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

	// try/catch ?
    const promises = [
        _fetchText(`${compo_dir}index.html`, true)!,
        _fetchText(`${compo_dir}index.css` , true)!
    ];
	[files["html"], files["css" ]] = await Promise.all(promises);

	return await defineWebComponentV3(tagname, files);
}

declare global {
    var LISSContext: {
        fetch?: Record<string, string>
    }
}

// in auto-mode use ServiceWorker to hide 404 error messages.
// if playground files, use them.
export async function _fetchText(uri: string|URL, isLissAuto: boolean = false) {

    const fetchContext = globalThis.LISSContext.fetch;
    if( fetchContext !== undefined ) {
        const file = fetchContext[uri.toString()];
        if(file !== undefined )
            return file;
    }

    const options = isLissAuto
                        ? {headers:{"liss-auto": "true"}}
                        : {};


    const response = await fetch(uri, options);
    if(response.status !== 200 )
        return undefined;

    if( isLissAuto && response.headers.get("status")! === "404" )
        return undefined;

    const answer = await response.text();

    if(answer === "")
        return undefined;

    return answer
}