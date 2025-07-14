import AbstractSignal      from "./AbstractSignal";
import SignalEventListener, { SignalEventListenerOpts } from "./SignalEventListener";

/**
 * - value (RW)
 * - /!\ #value is for explicitly set value.
 * - /!\ callback can be set after...
 */
export default class SignalListener<T> extends SignalEventListener {

    constructor(src      : AbstractSignal<T>|null = null,
                // undefined is replaced by SignalEventListener defaut value.
                callback?: () => void,
                opts     : Partial<SignalEventListenerOpts> = {}) {

        super(src, callback, opts);
    }

    #value: T|null = null;

    override get source(): AbstractSignal<T>|null {
        return super.source as AbstractSignal<T>|null;
    }
    override set source(src: AbstractSignal<T>|null) {

        if( src === super.source )
            return;

        this.#value = null;
        super.source = src; // will properly trigger.
    }

    get value() {
        
        this.ack();

        if( this.source === null )
            return this.#value;

        return this.source.value;
    }
    set value(value: T|null) {

        if( value === this.#value )
            return;

        this.#value = value;
        
        // need to explicitly trigger.
        this.setSourceWithoutTrigger(null);
        this.trigger();
    }
}