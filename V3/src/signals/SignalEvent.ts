
export default class SignalEvent {

    #callbacks = new Array<(pthis: SignalEvent) => void>();

    listen(callback: (pthis: SignalEvent) => void) {
        this.#callbacks.push(callback);

        return this;
    }
    unlisten(callback: (pthis: SignalEvent) => void) {

        // do not guarantee order ?
        const idx = this.#callbacks.lastIndexOf(callback);
        if( idx === -1 )
            return this;

        if( idx !== this.#callbacks.length - 1 )
            this.#callbacks[idx] = this.#callbacks[this.#callbacks.length-1];

        --this.#callbacks.length;

        return this;
    }

    protected trigger() {

        for(let callback of this.#callbacks)
            callback(this);

        return this;
    }
}