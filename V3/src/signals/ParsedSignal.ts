import ROSignal from "./ROSignal";
import Signal from "./Signal";

export type ParserAlgo<T> = (src:string, target: Signal<T>) => void;

export default class ParsedSignal<T> extends ROSignal<T> {

    #signal = new Signal<T>();
    #parser: ParserAlgo<T>;

    constructor(parser: ParserAlgo<T>) {
        super();

        this.#parser = parser;

        this.#signal.listen( () => {
            // is the condition necessary (?)
            if( this._valueRead === true)
                this.trigger(); // exposes signal's events to the outside
        });
    }

    #parsed = true;
    #str: string|null = null; 

    set rawString(str: string|null) {

        if( str === this.#str )
            return;

        this.#parsed = false;
        this.#str    = str;

        this.trigger();
    }

    get value() {

        if( this.#parsed === false ) {

            // trigger without ack ignored
            if( this.#str === null)
                this.#signal.value = null;
            else {
                const result = this.#parser(this.#str, this.#signal);
                if( result !== undefined )
                    this.#signal.value = result;
            }

            this.#parsed = true;
        }

        this.ack();

        return this.#signal.value;
    }
}