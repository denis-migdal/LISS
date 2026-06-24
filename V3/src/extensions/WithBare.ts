import FutureEvent from "../utils/FutureEvents";
import DOMContentLoaded from "../utils/FutureEvents/DOMContentLoaded";
import { Cstr } from "../utils/types";

type WithBare_Opts = {
    defineAfter?: FutureEvent<void>
}

export default function WithBare<T extends HTMLElement>(base : Cstr<T>,
                                            {
                                                defineAfter = DOMContentLoaded
                                            }: WithBare_Opts = {}) {

    // @ts-ignore
    return class LISSBare extends base {
        
        // required for define()

        static get defineAfter() {
            return defineAfter;
        }

        // small helper

        // @ts-ignore
        readonly host     : T = this;
        readonly controler: Omit<this, keyof T
            |"host"|"controler"|"attributeChangedCallback"> = this;

        // defined for auto-completion.
        static observedAttributes: string[] = [];
        attributeChangedCallback(_name  : string,
                                 _oldval: string|null,
                                 _newval: string|null){}
    }
}