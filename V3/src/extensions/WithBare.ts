import type {Cstr} from ".";

type Future = {
    is  : boolean,
    when: Promise<void>
}

type WithBare_Opts = {
    initWhen?: Future
}

//TODO: DOMLoaded

export default function WithBare<T extends HTMLElement>(base : Cstr<T>,
                                            {
                                                initWhen = DOMLoaded
                                            }: WithBare_Opts = {}) {

    // @ts-ignore
    return class LISSBare extends base {
        
        // @ts-ignore
        readonly host     : T = this;
        readonly controler: Omit<this, keyof T
            |"host"|"controler"|"attributeChangedCallback"> = this;

        static get isReady() {
            return initWhen.is
        }
        static get whenReady() {
            return initWhen.when
        }
        
        // defined for auto-completion.
        static observedAttributes: string[] = [];
        attributeChangedCallback(name  : string,
                                 oldval: string|null,
                                 newval: string|null){}
    }
}