export default class FutureEvent<T = unknown> implements Promise<T> {

    #p          : Promise<T>;
    #isFulfilled: null|(() => boolean);
    #done       : boolean = false;

    constructor(p: Promise<T>, isFulfilled: null|(() => boolean) = null) {
        this.#p = p;
        this.#isFulfilled = isFulfilled;

        if( this.#isFulfilled === null)
            p.then( () => this.#done = true);
    }

    get isDone() {

        if( this.#isFulfilled !== null && this.#done === false )
            this.#done = this.#isFulfilled();

        return this.#done;
    }

    // proxy promise

    get [Symbol.toStringTag](): string {
        return this.#p[Symbol.toStringTag];
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, _onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2> {
        return this.#p.then(onfulfilled);
    }

    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult> {
        return this.#p.catch(onrejected);
    }

    finally(onfinally?: (() => void) | null | undefined): Promise<T> {
        return this.#p.finally(onfinally);
    }
}