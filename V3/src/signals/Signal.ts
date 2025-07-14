import SignalWithSource from "./SignalWithSource";

export default class Signal<T> extends SignalWithSource<T,T> {

    override get value(): T|null {
        return this._listener.value as T|null;
    }

    override set value( value: T|null) {
        this._listener.value = value;
    }
}