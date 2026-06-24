import SignalEventListener from "./SignalEventListener";
/**
 * - value (RW)
 * - /!\ #value is for explicitly set value.
 * - /!\ callback can be set after...
 */
export default class SignalListener extends SignalEventListener {
    constructor(src = null, 
    // undefined is replaced by SignalEventListener defaut value.
    callback, opts = {}) {
        super(src, callback, opts);
    }
    #value = null;
    get source() {
        return super.source;
    }
    set source(src) {
        if (src === super.source)
            return;
        this.#value = null;
        super.source = src; // will properly trigger.
    }
    get value() {
        this.ack();
        if (this.source === null)
            return this.#value;
        return this.source.value;
    }
    set value(value) {
        if (value === this.#value)
            return;
        this.#value = value;
        // need to explicitly trigger.
        this.setSourceWithoutTrigger(null);
        this.trigger();
    }
}
//# sourceMappingURL=SignalListener.js.map