export const NULL_CALLBACK = () => { };
/**
   - callback (cstor)
   - src (RW)
   - trigger
   - opts
       - pending/ack
       - once
*/
export default class SignalEventListener {
    constructor(src = null, callback = NULL_CALLBACK, { ack = false, once = false } = {}) {
        this.#callback = callback;
        this.#opts = { ack, once };
        if (src !== null)
            this.source = src;
    }
    #opts;
    #callback;
    // event...
    #pending = false;
    get pending() {
        return this.#pending;
    }
    ack() {
        this.#pending = false;
    }
    #signalCallback = () => { this.trigger(); };
    trigger() {
        if (this.#opts.ack && this.#pending)
            return;
        // can't do it after callback();
        if (this.#opts.once) {
            this.#src.unlisten(this.#signalCallback);
            this.#src = null;
        }
        this.#pending = true;
        this.#callback();
    }
    // source...
    #src = null;
    get source() {
        return this.#src;
    }
    set source(src) {
        if (src === this.#src)
            return;
        this.setSourceWithoutTrigger(src);
        this.trigger();
    }
    // used for subclasses...
    setSourceWithoutTrigger(src) {
        if (this.#src !== null)
            this.#src.unlisten(this.#signalCallback);
        this.#src = src;
        if (this.#src !== null)
            this.#src.listen(this.#signalCallback);
    }
}
//# sourceMappingURL=SignalEventListener.js.map