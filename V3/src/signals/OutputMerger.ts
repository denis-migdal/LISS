import { Output } from "../extensions/WithOutput";
import AbstractSignal from "./AbstractSignal";
import SignalEventListener from "./SignalEventListener";

type OA2TA<T extends Output<unknown>[]> = T extends [Output<infer A>, ...infer B]
    ? B extends Output<unknown>[]
        ? [A, ...OA2TA<B>]
        : never
    : T extends Output<infer C>[]
        ? C[]
        : [];

export default class OutputMerger<S extends Output<unknown>[],
                                  T extends unknown[] = OA2TA<S>> extends AbstractSignal<T> {

    #listener = new SignalEventListener(null, () => this.trigger() );
    #signals: S;

    constructor(...signals: S) {
        super();

        this.#signals = signals;

        for(let i = 0; i < signals.length; ++i)
            // @ts-ignore
            signals[i].listen( () => this.#listener.trigger() );
    }

    #value: T|null = null;

    get value() {
        if(this.#listener.pending) {
            this.#value = this.#signals.map( s => s.value ) as any;
            this.#listener.ack();
        }
        return this.#value;
    }
}