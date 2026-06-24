import SignalWithSource from "./SignalWithSource";
export default class LazyComputedSignal extends SignalWithSource {
    #value = null;
    #cmp;
    constructor(src, cmp) {
        super();
        this.#cmp = cmp;
        this._listener.source = src;
    }
    get value() {
        if (this._listener.pending)
            this.#value = this.#cmp(this._listener.value);
        return this.#value;
    }
}
//# sourceMappingURL=LazyComputedSignal.js.map