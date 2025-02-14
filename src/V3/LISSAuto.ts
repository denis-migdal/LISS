import ContentGenerator from "V2/ContentGenerator";
import { DEFAULT_CDIR, encodeHTML, KnownTags } from "V2/helpers/LISSAuto";
import { define } from "V2/LifeCycle/DEFINED";
import LISSv3 from "V3";

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

	return await defineWebComponent(tagname, files);
}



//TODO: rename from files ?
async function defineWebComponent(tagname: string, files: Record<string, any>) {

    let klass = LISSv3({
        content_generator: LISSAuto_ContentGenerator,
        ...files
    });

    define(tagname, klass);

    return klass;
}

const regex = /\$\{(.+?)\}/g;

export class LISSAuto_ContentGenerator extends ContentGenerator {

    protected override prepareHTML(html?: DocumentFragment | HTMLElement | string) {
        
        this.data = null;

        if( typeof html === 'string' ) {

            this.data = html;
            return null;
            /*
            html = html.replaceAll(/\$\{([\w]+)\}/g, (_, name: string) => {
                return `<liss value="${name}"></liss>`;
            });*/

            //TODO: ${} in attr
                // - detect start ${ + end }
                // - register elem + attr name
                // - replace. 
        }
        
        return super.prepareHTML(html);
    }

    override fillContent(shadow: ShadowRoot) {
        
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        if( this.data !== null) {
            const str = (this.data as string).replace(regex, (_, match) => {
                const value = shadow.host.getAttribute(match);
                if( value === null)
                    return ''; 
                return encodeHTML(value);
            });
            super.setTemplate( super.prepareHTML(str)! );
        }

        super.fillContent(shadow);

        /*
        // html magic values could be optimized...
        const values = content.querySelectorAll('liss[value]');
        for(let value of values)
            value.textContent = host.getAttribute(value.getAttribute('value')!)
        */
    }
}


declare global {
    var LISSContext: {
        fetch?: Record<string, string>
    }
}

// in auto-mode use ServiceWorker to hide 404 error messages.
// if playground files, use them.
export async function _fetchText(uri: string|URL, hide404: boolean = false) {

    const fetchContext = globalThis.LISSContext.fetch;
    if( fetchContext !== undefined ) {
        const file = fetchContext[uri.toString()];
        if(file !== undefined )
            return file;
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