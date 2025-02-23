import { Signal } from "@LISS/src/signals/Signal";
import ROSignal   from "@LISS/src/signals/ROSignal";
import LISSUpdate from "./LISSUpdate";
import getPropertyInitialValue from "@LISS/src/utils/DOM/getPropertyInitialValue";

//TODO: getter ?

export default class LISSSignal<T> extends LISSUpdate {

    #signal = new Signal<T>();

    #callback = () => this.requestUpdate();

    constructor(value: null|T = null, signal: null|ROSignal<T> = null) {
        super();

        value  ??= getPropertyInitialValue(this, "value" , null);
        signal ??= getPropertyInitialValue(this, "source", null)

        if( value  !== null)
            this.#signal.value = value;
        if( signal !== null)
            this.#signal.source = signal;

        this.#signal.listen( this.#callback );
    }

    set source(source: ROSignal<T>|null) {
        this.#signal.source = source;
    }
    set value(value: T|null) {
        this.#signal.value = value;
    }

}