// ================================================
// =============== LISS define ====================
// ================================================

import LISS from "LISSBase";
import { LISSBase, LISSBaseCstr, LISSHost } from "./types";
import { _element2tagname } from "./utils";

declare module "./LISSBase" {
    interface ILISS {
        define     : typeof define;
		whenDefined    : typeof whenDefined;
		whenAllDefined : typeof whenAllDefined;
		isDefined      : typeof isDefined;
		getName        : typeof getName;

		getLISS    : typeof getLISS;
		getLISSSync: typeof getLISSSync;
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
	
	console.warn("defined", tagname, LISSclass, opts);

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

// ==========================================================

async function getLISS<T extends LISSBase>( element: Element ): Promise<T> {

	await LISS.whenDefined( LISS.getName(element) );

	customElements.upgrade( element );

	console.warn("getLISS", element, element.constructor.name );

	return await (element as LISSHost<T>).LISS as T; // ensure initialized.
}
function getLISSSync<T extends LISSBase>( element: Element ): T {

	const name = LISS.getName(element);
	if( ! LISS.isDefined( name ) )
		throw new Error(`${name} hasn't been defined yet.`);

	let host = element as LISSHost<T>;

	if( ! host.isInit )
		throw new Error("Instance hasn't been initialized yet.");

	return host.LISSSync as T;
}

LISS.getLISS     = getLISS;
LISS.getLISSSync = getLISSSync;