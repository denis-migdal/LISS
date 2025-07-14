/**
    - (un)listen
    - trigger (protected)
*/
export default class SignalEvent {

    #callbacks = new Array<() => void>();

    listen(callback: () => void) {
        this.#callbacks.push(callback);
    }

    unlisten(callback: () => void) {

        // do not guarantee order ?
        const idx = this.#callbacks.lastIndexOf(callback);
        if( idx === -1 )
            return;

        if( idx !== this.#callbacks.length - 1 )
            this.#callbacks[idx] = this.#callbacks[this.#callbacks.length-1];

        --this.#callbacks.length;
    }

    protected trigger() {
        for(let i = 0; i < this.#callbacks.length; ++i)
            this.#callbacks[i]();
    }
}