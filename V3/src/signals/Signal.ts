import IndirectSignal from "./IndirectSignal";
import ROSignal from "./ROSignal";

export default class Signal<T> extends IndirectSignal<T> {

    protected _value: T|null = null;

    constructor(value: T|null = null, source: ROSignal<T>|null = null) {
        super(source);
        this._value = value;
    }

    override set source(source: ROSignal<T>|null) {

        if( source !== null )
            this._value = null;

        super.source = source; // may trigger if source change
    }

    override get source() {
        return super.source;
    }

    override get value() {

        if( this.source !== null)
            return super.value;

        this.ack();
        return this._value;
    }

    override set value(value: T|null) {

        const oldValue = this._value;
        this._value = value;

        if( this.source !== null ) {
            this.source = null; // will trigger
            return;
        }

        // trigger only if value changed
        if( value !== oldValue)
            this.trigger();

        return;
    }
}