import AbstractSignal from "./AbstractSignal";
export default class SyncedSignal extends AbstractSignal {
    #src = null;
    #callback = () => this.trigger();
    get source() {
        return this.#src;
    }
    set source(src) {
        if (src === this.#src)
            return;
        if (this.#src !== null)
            this.#src.unlisten(this.#callback);
        this.#src = src;
        if (this.#src !== null)
            this.#src.listen(this.#callback);
        this.trigger();
    }
    get value() {
        if (this.#src === null)
            return null;
        return this.#src.value;
    }
    set value(val) {
        this.#src.value = val; // may be error prone
    }
}
//# sourceMappingURL=SyncedSignal.js.map