import Signal     from "@LISS/src/signals/Signal";
import ROSignal   from "@LISS/src/signals/ROSignal";
import LISSUpdate from "./LISSUpdate";
import getPropertyInitialValue from "@LISS/src/utils/DOM/getPropertyInitialValue";

export function getSignal<T extends any = unknown>(obj: HTMLElement, defaultVal: T|null = null) {
    let signal: Signal<T> = (obj as any).signal;

    if( signal === undefined )
        signal = (obj as any).signal = new Signal<T>(defaultVal);

    return signal;
}

export default class LISSSignal<T> extends LISSUpdate {

    readonly signal: Signal<T>;

    #callback = () => this.requestUpdate();

    constructor(value_or_signal: null|T|ROSignal<T> = null) {
        super();

        this.signal = getPropertyInitialValue(this, "signal") ?? new Signal<T>();

        if( value_or_signal !== null ) { // value given by the constructor

            if( value_or_signal instanceof ROSignal)
                this.signal.source = value_or_signal;
            else
                this.signal.value  = value_or_signal;

        }
        
        this.signal.listen( this.#callback );
    }
}