
export default class SignalEvent {

    #callbacks = new Set<(pthis: SignalEvent) => void>();

    listen(callback: (pthis: SignalEvent) => void) {
        this.#callbacks.add(callback);

        return this;
    }
    unlisten(callback: (pthis: SignalEvent) => void) {
        this.#callbacks.delete(callback);

        return this;
    }

    protected trigger() {

        for(let callback of this.#callbacks)
            callback(this);

        return this;
    }
}