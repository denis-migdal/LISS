import { AbstractSignal, Signal } from "../signals";
import { Cstr } from "../utils/types";

export interface Input<T> {
    set value(v: T|null); // external mustn't be allowed to read the value
                          // (would generate an ack)
    source: AbstractSignal<T>|null;
}

export function getInput<T>(target: Element): Input<T> {

    if( ! ("_input" in target) )
        // @ts-ignore
        target.input = new Signal<T>(); // will shadow input getter

    // @ts-ignore
    return target.input;
}

export default function WithInput<IN, T extends HTMLElement = HTMLElement>(
                            base : Cstr<T>
                        ) {

    // @ts-ignore
    return class LISSInput extends base {

        protected readonly _input: Signal<IN>;

        get input(): Input<IN> {
            return this._input;
        }

        constructor() {
            super();

            if( this.input !== undefined ) {
                // @ts-ignore
                this._input = this.input;
                // @ts-ignore
                delete this.input; // un-shadow getter.
            } else {
                this._input = new Signal<IN>();
            }
        }
    }
}