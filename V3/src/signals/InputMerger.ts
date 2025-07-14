import { Input } from "../extensions/WithInput";
import AbstractSignal from "./AbstractSignal";
import SignalListener from "./SignalListener";

type IA2TA<T extends Input<unknown>[]> = T extends [Input<infer A>, ...infer B]
    ? B extends Input<unknown>[]
        ? [A, ...IA2TA<B>]
        : never
    : T extends Input<infer C>[]
        ? C[]
        : [];

class InternalSignal<T> extends AbstractSignal<T> {
    
    #idx     : number;
    #listener: SignalListener<T[]>;

    constructor(listener: SignalListener<T[]>, idx: number) {
        super();

        this.#idx      = idx;
        this.#listener = listener;
    }

    get value() {
        const val = this.#listener.value;
        if( val === null)
            return null;

        return val[this.#idx];
    }

    public override trigger() {
        super.trigger();
    }
}

export default class InputMerger<S extends Input<unknown>[] = Input<unknown>[],
                                 T extends unknown[]        = IA2TA<S>
                                > implements Input<T> {

    #listener = new SignalListener<T>(null, () => {
        for(let i = 0; i < this.#signals.length; ++i)
            this.#signals[i].trigger();
    });

    get source() {
        return this.#listener.source;
    }
    set source(src: AbstractSignal<T>|null) {
        this.#listener.source = src;
    }
    set value(val: T|null) {
        this.#listener.value = val;
    }

    #signals: InternalSignal<T[number]>[];

    constructor(...signals: S) {

        this.#signals = new Array<InternalSignal<T[number]>>(signals.length);

        for(let i = 0; i < signals.length; ++i) {
            this.#signals[i] = new InternalSignal(this.#listener, i);
            signals[i].source = this.#signals[i];
        }
    }
}