import { AbstractSignal, Signal } from "../signals";
import { Cstr } from "../utils/types";


export type Output<T> = Omit<AbstractSignal<T>, "trigger">;

export function getOutput<T>(target: Element): Output<T> {

    if( ! ("_output" in target) )
        // @ts-ignore
        target.output = new Signal<T>(); // will shadow output getter

    // @ts-ignore
    return target.output;
}

export default function WithOutput<OUT, T extends HTMLElement = HTMLElement>(
                            base : Cstr<T>
                        ) {

    // @ts-ignore
    return class LISSOutput extends base {

        protected readonly _output: Signal<OUT>;

        constructor() {
            super();

            // @ts-ignore
            if( this.output !== undefined ) {
                // @ts-ignore
                this._output = this.output;
                // @ts-ignore
                delete this.output; // un-shadow getter.
            } else {
                this._output = new Signal<OUT>();
            }
        }

        get output(): AbstractSignal<OUT> {
            return this._output;
        }
    }
}