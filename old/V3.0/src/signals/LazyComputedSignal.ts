import IndirectSignal from "./IndirectSignal";
import ROSignal from "./ROSignal";

export default class LazyComputedSignal<T = unknown, U = unknown> extends IndirectSignal<T, U> {
    
    constructor(source: null|ROSignal<T> = null, compute: null|((source: ROSignal<T>) => U|null) = null) {
        
        super(source);

        this.#compute = compute;
    }

    #compute: null|((sources: ROSignal<T>) => U|null);

    get computeFct() {
        return this.#compute;
    }
    set computeFct(compute: null|((sources: ROSignal<T>) => U|null)) {

        if( this.#compute === compute )
            return;

        this.#compute = compute;
        this.trigger();
    }

    #cachedValue: null|U = null;

    override get value() {

        if( this._valueRead === true )
            return this.#cachedValue;

        this.ack();

        if( this.source === null || this.#compute === null)
            return this.#cachedValue = null;

        return this.#cachedValue = this.#compute(this.source);
    }
}