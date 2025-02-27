import Signal     from "@LISS/src/signals/Signal";
import ROSignal   from "@LISS/src/signals/ROSignal";
import LISSUpdate from "./LISSUpdate";
import getPropertyInitialValue from "@LISS/src/utils/DOM/getPropertyInitialValue";

export default class LISSSignal<T> extends LISSUpdate {

    #signal = new Signal<T>();

    #callback = () => this.requestUpdate();

    constructor(value: null|T|ROSignal<T> = null) {
        super();

        if( value === null ) {
            this.#signal.source = getPropertyInitialValue(this, "source", null)
            this.#signal.value  = getPropertyInitialValue(this, "value" , null)
        } else if( value instanceof ROSignal)
            this.#signal.source = value;
        else
            this.#signal.value  = value,

        this.#signal.listen( this.#callback );
    }

    set source(source: ROSignal<T>|null) {
        this.#signal.source = source;
    }
    get source() {
        return this.#signal.source;
    }

    set value(value: T|null) {
        this.#signal.value = value;
    }
    get value() {
        return this.#signal.value;
    }
}