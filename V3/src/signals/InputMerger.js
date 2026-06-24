import AbstractSignal from "./AbstractSignal";
import SignalListener from "./SignalListener";
class InternalSignal extends AbstractSignal {
    #idx;
    #listener;
    constructor(listener, idx) {
        super();
        this.#idx = idx;
        this.#listener = listener;
    }
    get value() {
        const val = this.#listener.value;
        // undefined should NOT occurs...
        if (val === null || val === undefined)
            return null;
        return val[this.#idx];
    }
    trigger() {
        super.trigger();
    }
}
export default class InputMerger {
    #listener = new SignalListener(null, () => {
        for (let i = 0; i < this.#signals.length; ++i)
            this.#signals[i].trigger();
    });
    get source() {
        return this.#listener.source;
    }
    set source(src) {
        this.#listener.source = src;
    }
    set value(val) {
        this.#listener.value = val;
    }
    #signals;
    constructor(...signals) {
        this.#signals = new Array(signals.length);
        for (let i = 0; i < signals.length; ++i) {
            this.#signals[i] = new InternalSignal(this.#listener, i);
            signals[i].source = this.#signals[i];
        }
    }
}
//# sourceMappingURL=InputMerger.js.map