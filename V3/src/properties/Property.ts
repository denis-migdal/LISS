import ParsedSignal, { ParserAlgo } from "../signals/ParsedSignal";
import PrioritySignal from "../signals/PrioritySignal";
import ROSignal       from "../signals/ROSignal";
import Signal         from "../signals/Signal";

export type PropertyFullDescription<T> = {
    parser: ParserAlgo<T>,
    fixed?: T,
    default?: T
};

export default class Property<T = unknown> {

    readonly signal: ROSignal<T>;

    #HTML_valueSignal  : ParsedSignal<T>;
    #HTML_defaultSignal: ParsedSignal<T>;

    #JS_valueSignal   = new Signal<T>();
    #JS_defaultSignal = new Signal<T>();

    #dataSignal       = new Signal<T>(); // how to get from data ?
                                         // or split (? dble priority ?)

    constructor(args: PropertyFullDescription<T>) {

        this.#HTML_valueSignal   = new ParsedSignal<T>(args.parser);
        this.#HTML_defaultSignal = new ParsedSignal<T>(args.parser);

        if( args.fixed !== undefined) {
            this.signal = new Signal(args.fixed); // should be RO.
            return;
        }

        const sources: ROSignal<T>[] = [
            this.#HTML_valueSignal,
            this.  #JS_valueSignal,
            this.      #dataSignal,
            this.  #JS_defaultSignal,
            this.#HTML_defaultSignal,
        ];

        if( args.default !== undefined )
            sources.push( new Signal(args.default) );

        this.signal = new PrioritySignal<T>(...sources);
    }

    set JS_value(value: T|null) {
        console.warn('set', value);
        console.trace();
        this.#JS_valueSignal.value = value;
    }
    set JS_default(value: T|null) {
        this.#JS_defaultSignal.value = value;
    }
    set HTML_value(value: string|null) {
        this.#HTML_valueSignal.rawString = value;
    }
    set HTML_default(value: string|null) {
        this.#HTML_defaultSignal.rawString = value;
    }
}