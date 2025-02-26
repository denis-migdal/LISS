import ROSignal from "./ROSignal";

export default class IndirectSignal<T = unknown, U = T> extends ROSignal<U> {

    #source: ROSignal<T>|null = null;

    constructor(source: ROSignal<T>|null = null) {
        super();

        this.#source = source;
        this.#source?.listen( this._callback );
    }

    protected _callback = () => this.trigger();

    get source(): ROSignal<T>|null {
        return this.#source;
    }

    set source(source: ROSignal<T>|null) {

        if( this.#source === source ) // nop
            return;

        if( this.#source !== null)
            this.#source.unlisten(this._callback);

        this.#source = source;

        if( this.#source !== null)
           this.#source.listen(this._callback);
        else
            this._callback();
    }

    override get value(): U|null {

        this.ack();

        if( this.#source === null)
            return null;
        return this.#source.value as U|null;
    }
}