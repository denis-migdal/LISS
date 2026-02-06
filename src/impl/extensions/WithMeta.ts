import { Signal } from "../signals";
import { Input } from "./WithInput";
import { Cstr } from "../utils/types";

// configure how the component is printed.
// RO only. If RW, then this is an input/output.

export type Meta<T> = Input<T>;

export function getMeta<T>(target: Element): Meta<T> {

    if( ! ("_meta" in target) )
        // @ts-ignore
        target.meta = new Signal<T>(); // will shadow input getter

    // @ts-ignore
    return target.meta;
}

export default function WithMeta<IN, T extends HTMLElement = HTMLElement>(
                            base : Cstr<T>
                        ) {

    // @ts-ignore
    return class LISSMeta extends base {

        protected readonly _meta: Signal<IN>;

        get meta(): Input<IN> {
            return this._meta;
        }

        constructor() {
            super();

            if( this.meta !== undefined ) {
                // @ts-ignore
                this._meta = this.meta;
                // @ts-ignore
                delete this.meta; // un-shadow getter.
            } else {
                this._meta = new Signal<IN>();
            }
        }
    }
}