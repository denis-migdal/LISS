/**
    - (un)listen
    - trigger (protected)
*/
export default class SignalEvent {
    #callbacks = new Array();
    listen(callback) {
        this.#callbacks.push(callback);
    }
    unlisten(callback) {
        // do not guarantee order ?
        const idx = this.#callbacks.lastIndexOf(callback);
        if (idx === -1)
            return;
        if (idx !== this.#callbacks.length - 1)
            this.#callbacks[idx] = this.#callbacks[this.#callbacks.length - 1];
        --this.#callbacks.length;
    }
    trigger() {
        for (let i = 0; i < this.#callbacks.length; ++i)
            this.#callbacks[i]();
    }
}
//# sourceMappingURL=SignalEvent.js.map