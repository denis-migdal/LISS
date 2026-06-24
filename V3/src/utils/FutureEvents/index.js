export default class FutureEvent {
    #p;
    #isFulfilled;
    #done = false;
    constructor(p, isFulfilled = null) {
        this.#p = p;
        this.#isFulfilled = isFulfilled;
        if (this.#isFulfilled === null)
            p.then(() => this.#done = true);
    }
    get isDone() {
        if (this.#isFulfilled !== null && this.#done === false)
            this.#done = this.#isFulfilled();
        return this.#done;
    }
    // proxy promise
    get [Symbol.toStringTag]() {
        return this.#p[Symbol.toStringTag];
    }
    then(onfulfilled, onrejected) {
        return this.#p.then(onfulfilled);
    }
    catch(onrejected) {
        return this.#p.catch(onrejected);
    }
    finally(onfinally) {
        return this.#p.finally(onfinally);
    }
}
//# sourceMappingURL=index.js.map