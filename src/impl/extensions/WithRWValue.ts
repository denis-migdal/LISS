import { AbstractSignal, Signal } from "../signals";
import WithInput , { getInput , Input  } from "./WithInput";
import WithOutput, { getOutput, Output } from "./WithOutput";

import { Cstr } from "../utils/types";
import { With } from ".";

class InputOutputMerger<T> implements Input<T>, Output<T> {
    
    #input : Input<T>;
    #output: Output<T>;

    constructor(input: Input<T>, output: Output<T>) {
        this.#input  = input;
        this.#output = output;
    }

    listen(callback: () => void) {
        this.#output.listen(callback);
    }
    unlisten(callback: () => void) {
        this.#output.unlisten(callback);
    }

    get source() {
        return this.#input.source;
    }
    set source(src: AbstractSignal<T>|null) {
        this.#input.source = src;
    }

    set value(value: T|null) {
        this.#input.value = value;
    }
    get value() {
        return this.#output.value;
    }
}

export function getValue<T>(target: Element): Signal<T> {

    if( ! ("_value" in target) ) {
        // @ts-ignore
        target.value = new InputOutputMerger<T>(getInput <T>(target),
                                                getOutput<T>(target));
        // will shadow value getter
    }

    // @ts-ignore
    return target.value;
}

export default function WithRWValue<V, T extends HTMLElement = HTMLElement>(
                            base : Cstr<T>
                        ) {

    // @ts-ignore
    return class LISSRWValue extends With(WithInput<V>, WithOutput<V>)(base, {}) {

        protected readonly _value: Input<V> & Output<V>;

        get value() {
            return this._value;
        }

        constructor() {
            super();

            if( this.value !== undefined ) {
                // @ts-ignore
                this._value = this.value;
                // @ts-ignore
                delete this.value; // un-shadow getter.
            } else {
                this._value = new InputOutputMerger<V>(this.input, this.output);
            }
        }
    }
}