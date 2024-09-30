import type { LISSBase, LISSBaseCstr, LISSHost, LISSHostCstr } from "./types";

import { _element2tagname } from "./utils";

// Go to state DEFINED
export function define<T extends LISSBaseCstr>(
    tagname       : string,
    ComponentClass: T|LISSHostCstr<T>) {

    // could be better.
    if( "Base" in ComponentClass) {
        ComponentClass = ComponentClass.Base as T;
    }
    
    const Class  = ComponentClass.LISSCfg.host;
    let htmltag  = _element2tagname(Class)??undefined;

    const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);

    const opts = htmltag === undefined ? {}
                : {extends: htmltag};

    customElements.define(tagname, LISSclass, opts);
};

export async function whenDefined(tagname: string ) {
	return await customElements.whenDefined(tagname);
}

export async function whenAllDefined(tagnames: readonly string[]) : Promise<void> {
	await Promise.all( tagnames.map( t => customElements.whenDefined(t) ) )
}

export function isDefined(name: string) {
	return customElements.get(name) !== undefined;
}

export function getName( element: Element|LISSBase|LISSBaseCstr|LISSHost<LISSBase>|LISSHostCstr<LISSBase> ): string {

	if( "Host" in element.constructor)
		element = element.constructor.Host as LISSHostCstr<LISSBase>;
	if( "Host" in element)
		element = element.Host;
	if( "Base" in element.constructor)
		element = element.constructor as LISSHostCstr<LISSBase>;

	if( "Base" in element) {
		const name = customElements.getName( element );
		if(name === null)
			throw new Error("not defined!");

		return name;
	}

	if( ! (element instanceof Element) )
		throw new Error('???');

	const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
	
	if( ! name.includes('-') )
		throw new Error(`Element ${name} is not a WebComponent`);

	return name;
}

export function getHostCstr<T extends LISSHostCstr<LISSBase>>(name: string): T {
	return customElements.get(name) as T;
}

export function getBaseCstr<T extends LISSBaseCstr>(name: string): T {
	return getHostCstr<LISSHostCstr<T>>(name).Base as T;
}