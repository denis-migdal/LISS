import type { LISSBase, LISSBaseCstr, LISSHost, LISSHostCstr } from "./types";

import { _element2tagname } from "./utils";

// Go to state DEFINED
export function define<T extends LISSBaseCstr>(
    tagname       : string,
    ComponentClass: T|LISSHostCstr<T>) {

	let Host: LISSHostCstr<T> = ComponentClass as any;

	// Brython class
	let bry_class: any = null;
	if( "$is_class" in ComponentClass ) {

		bry_class = ComponentClass;

		ComponentClass = bry_class.__bases__.filter( (e: any) => e.__name__ === "Wrapper")[0]._js_klass.$js_func;
		(ComponentClass as any).Host.Base = class {

			#bry: any;

			constructor() {
				// @ts-ignore
				this.#bry = __BRYTHON__.$call(bry_class, [0,0,0])()
			}

			#call(name: string, args: any[]) {
				// @ts-ignore
				__BRYTHON__.$call(__BRYTHON__.$getattr_pep657(this.#bry, name, [0,0,0]), [0,0,0])(...args)
			}

			connectedCallback(...args: any[]) {
				return this.#call("connectedCallback", args);
			}
			disconnectedCallback(...args: any[]) {
				return this.#call("disconnectedCallback", args);
			}

		}
	}

	if( "Host" in ComponentClass )
		Host = ComponentClass.Host as any;
    
    const Class  = Host.Cfg.host;
    let htmltag  = _element2tagname(Class)??undefined;

    const opts = htmltag === undefined ? {}
                : {extends: htmltag};

    customElements.define(tagname, Host, opts);
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
		// @ts-ignore
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