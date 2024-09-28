// ================================================
// =============== LISS define ====================
// ================================================

//TODO remove...

import LISS from "LISSBase";
import { LISSBaseCstr } from "./types";
import { _element2tagname } from "./utils";

declare module "./LISSBase" {
    interface ILISS {
        define     : typeof define;
		whenDefined    : typeof whenDefined;
		whenAllDefined : typeof whenAllDefined;
		isDefined      : typeof isDefined;
		getName        : typeof getName;
    }
}

export function define<T extends LISSBaseCstr>(
							tagname       : string,
							ComponentClass: T) {
	const Class  = ComponentClass.LISSCfg.host;
	let htmltag  = _element2tagname(Class)??undefined;

	const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);
	
	const opts = htmltag === undefined ? {}
									   : {extends: htmltag};
	
	customElements.define(tagname, LISSclass, opts);
};


async function whenDefined(tagname: string, callback?: () => void ) : Promise<void> {

	await customElements.whenDefined(tagname);

	if( callback !== undefined)
		callback();

	return;
}
async function whenAllDefined(tagnames: readonly string[], callback?: () => void ) : Promise<void> {

	await Promise.all( tagnames.map( t => customElements.whenDefined(t) ) )

	if( callback !== undefined)
		callback();

}

function isDefined(name: string) {
	return customElements.get(name);
}


export function getName( element: Element ): string {

	const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
	
	if( ! name.includes('-') )
		throw new Error(`Element ${name} is not a WebComponent`);

	return name;
}

LISS.define         = define;
LISS.whenDefined    = whenDefined;
LISS.whenAllDefined = whenAllDefined;
LISS.isDefined      = isDefined;
LISS.getName        = getName;