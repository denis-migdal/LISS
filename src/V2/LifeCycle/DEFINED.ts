import { LISSControler, LISSControlerCstr, LISSHost, LISSHostCstr } from "../types";

import { _element2tagname } from "../utils";

type Param<T extends LISSControlerCstr> = string|T|LISSHostCstr<T>|HTMLElement;

// TODO...
export function define<T extends LISSControlerCstr>(
    tagname       : string,
    ComponentClass: T|LISSHostCstr<T>|any) {

	let Host: LISSHostCstr<T> = ComponentClass as any;

	// Brython class
	let bry_class: any = null;
	if( "$is_class" in ComponentClass ) {

		bry_class = ComponentClass;

		ComponentClass = bry_class.__bases__.filter( (e: any) => e.__name__ === "Wrapper")[0]._js_klass.$js_func;
		(ComponentClass as any).Host.Controler = class {

			#bry: any;

			constructor(...args: any[]) {
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

    let htmltag = undefined;
    if( "Cfg" in Host) {
        const Class  = Host.Cfg.host;
        htmltag  = _element2tagname(Class)??undefined;
    }

    const opts = htmltag === undefined ? {}
                : {extends: htmltag};

    customElements.define(tagname, Host, opts);
};

export function getName( element: Element|LISSControler|LISSControlerCstr|LISSHost<LISSControler>|LISSHostCstr<LISSControler> ): string {

    // instance
    if( "host" in element)
        element = element.host;
    if( element instanceof Element) {
        const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
        
        if( ! name.includes('-') )
            throw new Error(`${name} is not a WebComponent`);

        return name;
    }

    // cstr

	if( "Host" in element)
        element = element.Host as unknown as LISSHostCstr<LISSControler>;

    const name = customElements.getName( element );
    if(name === null)
        throw new Error("Element is not defined!");

    return name;
}


export function isDefined<T extends LISSControlerCstr>(elem: Param<T>): boolean {
    
    if( elem instanceof HTMLElement)
        elem = getName(elem);
    if( typeof elem === "string")
        return customElements.get(elem) !== undefined;

    if( "Host" in elem)
        elem = elem.Host as unknown as T;

    return customElements.getName(elem as any) !== null;
}

export async function whenDefined<T extends LISSControlerCstr>(elem: Param<T>): Promise<LISSHostCstr<T>> {
    
    if( elem instanceof HTMLElement)
        elem = getName(elem);
    if( typeof elem === "string") {
        await customElements.whenDefined(elem);
        return customElements.get(elem) as LISSHostCstr<T>;
    }

    // TODO: listen define...
    throw new Error("Not implemented yet");
}

/*
// TODO: implement
export async function whenAllDefined(tagnames: readonly string[]) : Promise<void> {
	await Promise.all( tagnames.map( t => customElements.whenDefined(t) ) )
}
*/

export function getHostCstr<T extends LISSControlerCstr>(elem: Param<T>): Promise<LISSHostCstr<T>> {
    // we can't force a define.
    return whenDefined(elem);
}

export function getHostCstrSync<T extends LISSControlerCstr>(elem: Param<T>): LISSHostCstr<T> {
    
    if( elem instanceof HTMLElement)
        elem = getName(elem);
    if( typeof elem === "string") {

        let host = customElements.get(elem);
        if( host === undefined )
            throw new Error(`${elem} not defined yet!`);

        return host as unknown as LISSHostCstr<T>;
    }

    if( "Host" in elem)
        elem = elem.Host as unknown as T;

    if( customElements.getName(elem as any) === null )
        throw new Error(`${elem} not defined yet!`);

    return elem as LISSHostCstr<T>;
}