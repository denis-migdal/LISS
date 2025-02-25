import ContentGenerator from "@LISS/src/ContentGenerators/ContentGenerator";
import { _whenDefinedPromises } from "./whenDefined";

export const WaitingDefine = new Set<string>();

export default async function define(tagname: string, Klass: new(...args:any[]) => HTMLElement) {
    
    if( "$is_class" in Klass )
        Klass = WrapPythonClass(Klass);

    //TODO: type safe
    if( "CONTENT_GENERATOR" in Klass ) {
        const generator = Klass.CONTENT_GENERATOR as ContentGenerator;

        if( ! generator.isReady ) {
            WaitingDefine.add(tagname);
            await generator.whenReady;
        }
    }

    WaitingDefine.delete(tagname);
    customElements.define(tagname, Klass);

    const p = _whenDefinedPromises.get(Klass);
    if( p !== undefined )
        p.resolve();
}


function WrapPythonClass(Klass: new(...args:any[]) => HTMLElement) {

    const JSKlass = (Klass as any).__bases__.filter( (e: any) => e.__name__ === "Wrapper")[0]._js_klass.$js_func as new(...args:any[]) => HTMLElement;

    // @ts-ignore
    const symbol = __BRYTHON__.PYOBJ;

    // make it a proxy ?
    return class _Wrapper extends JSKlass {
        #bry: any;

        // should always be built before end of brython init...
        constructor(bry: any = null) {
            super();

            if( bry === null ) {
                // @ts-ignore
                globalThis.brython_wrapper_js = this;
                // @ts-ignore
                bry = __BRYTHON__.$call(Klass, [0,0,0])();
                // @ts-ignore
                globalThis.brython_wrapper_js = null;
            }
            this.#bry = bry;

            // @ts-ignore
            this[symbol] = bry;
        }

        #call(name: string, ...args: any[]) {
            // @ts-ignore
            return __BRYTHON__.$call(__BRYTHON__.$getattr_pep657(this.#bry, name, [0,0,0]), [0,0,0])(...args)
        }

        /*
        get host() {
            // @ts-ignore
            return __BRYTHON__.$getattr_pep657(this.#bry, "host", [0,0,0])
        }*/

        static observedAttributes = (Klass as any)["observedAttributes"];

        attributeChangedCallback(...args: any[]) {
            return this.#call("attributeChangedCallback", ...args);
        }
/*
        connectedCallback(...args: any[]) {
            return this.#call("connectedCallback", args);
        }
        disconnectedCallback(...args: any[]) {
            return this.#call("disconnectedCallback", args);
        }*/
    }
}


import LISS from "@LISS/src/LISS";

declare module "@LISS/src/LISS" {
    interface ILISS {
        define: typeof define;
    }
}

LISS.define = define;