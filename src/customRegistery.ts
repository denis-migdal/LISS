import type { LISSControler, LISSControlerCstr, LISSHost, LISSHostCstr } from "./types";

import { _element2tagname } from "./utils";

// Go to state DEFINED
export function define<T extends LISSControlerCstr>(
    tagname       : string,
    ComponentClass: T|LISSHostCstr<T>) {

	let Host: LISSHostCstr<T> = ComponentClass as any;

	// Brython class
	let bry_class: any = null;
	if( "$is_class" in ComponentClass ) {

		bry_class = ComponentClass;

		ComponentClass = bry_class.__bases__.filter( (e: any) => e.__name__ === "Wrapper")[0]._js_klass.$js_func;
		(ComponentClass as any).Host.Controler = class {

			#bry: any;

			constructor(...args: any[]) {

				console.warn("?", args);

				// @ts-ignore
				this.#bry = __BRYTHON__.$call(bry_class, [0,0,0])(...args);
			}

			#call(name: string, args: any[]) {
				// @ts-ignore
				return __BRYTHON__.$call(__BRYTHON__.$getattr_pep657(this.#bry, name, [0,0,0]), [0,0,0])(...args)
			}

			get host() {
				// @ts-ignore
				return __BRYTHON__.$getattr_pep657(this.#bry, "host", [0,0,0])
			}

			static observedAttributes = bry_class["observedAttributes"];

			attributeChangedCallback(...args: any[]) {
				return this.#call("attributeChangedCallback", args);
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

export function getName( element: Element|LISSControler|LISSControlerCstr|LISSHost<LISSControler>|LISSHostCstr<LISSControler> ): string {

	if( "Host" in element.constructor)
		element = element.constructor.Host as LISSHostCstr<LISSControler>;
	if( "Host" in element)
		// @ts-ignore
		element = element.Host;
	if( "Controler" in element.constructor)
		element = element.constructor as LISSHostCstr<LISSControler>;

	if( "Controler" in element) {
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

export function getHostCstr<T extends LISSHostCstr<LISSControler>>(name: string): T {
	return customElements.get(name) as T;
}

export function getControlerCstr<T extends LISSControlerCstr>(name: string): T {
	return getHostCstr<LISSHostCstr<T>>(name).Controler as T;
}