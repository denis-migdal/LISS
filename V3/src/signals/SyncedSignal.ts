import AbstractSignal from "./AbstractSignal";
import Signal from "./Signal";

export default class SyncedSignal<T> extends AbstractSignal<T> {
    
    #src: Signal<T>|null = null;

    #callback = () => this.trigger();

    get source() {
        return this.#src;
    }

    set source(src: Signal<T>|null) {
        if(src === this.#src)
            return;

        if( this.#src !== null )
            this.#src.unlisten( this.#callback );

        this.#src = src;

        if( this.#src !== null)
            this.#src.listen( this.#callback ) 

        this.trigger();
    }

    get value() {
        if( this.#src === null)
            return null;

        return this.#src.value;
    }

    set value(val: T|null) {
        this.#src!.value = val; // may be error prone
    }
}