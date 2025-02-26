import SignalEvent from "./SignalEvent";

export default abstract class ROSignal<T> extends SignalEvent {

    protected _valueRead = false;

    override listen(callback: (pthis: SignalEvent) => void) {
        
        super.listen(callback);

        callback(this); // initial callback (when signal Data)

        return this;
    }

    abstract readonly value: T|null;

    protected override trigger(): this {
        
        // no needs to trigger if previous value wasn't read.
        if( ! this._valueRead )
            return this;

        this._valueRead = false;
        super.trigger();

        return this;
    }

    ack() {
        this._valueRead = true;
    }
}