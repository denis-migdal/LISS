import AbstractSignal   from "./AbstractSignal";
import SignalWithSource from "./SignalWithSource";

export default class LazyComputedSignal<IN, OUT> extends SignalWithSource<IN, OUT> {

    #value: OUT|null = null;
    #cmp  : (v: IN|null) => OUT|null;

    constructor( src: AbstractSignal<IN>, cmp: (v: IN|null) => OUT|null) {
        super();
        this.#cmp = cmp;
        this._listener.source = src;
    }

    override get value(): OUT|null {

        if( this._listener.pending )
            this.#value = this.#cmp(this._listener.value);

        return this.#value;
    }
}