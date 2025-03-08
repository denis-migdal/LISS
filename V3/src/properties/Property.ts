import ParsedSignal, { ParserAlgo } from "../signals/ParsedSignal";
import PrioritySignal from "../signals/PrioritySignal";
import ROSignal       from "../signals/ROSignal";
import Signal         from "../signals/Signal";
import { names } from "./callback";

export type PropertyFullDescription<T> = {
    parser  : ParserAlgo<T>,
    fixed  ?: T,
    default?: T
};

export default class Property<T = unknown> {

    readonly signal: ROSignal<T>;

    #HTML_valueSignal  : null|ParsedSignal<T> = null;
    #HTML_defaultSignal: null|ParsedSignal<T> = null;

    #JS_signal: null|Signal<T> = null;

    #source: null|Record<string, ROSignal<any>> = null;

    constructor(source: null|Record<string, ROSignal<any>>, args: PropertyFullDescription<T>) {

        if( args.fixed !== undefined) {
            this.signal = new Signal(args.fixed); // should be RO.
            return;
        }

        this.#source = source;

        this.#HTML_valueSignal   = new ParsedSignal<T>(source, args.parser);
        this.#HTML_defaultSignal = new ParsedSignal<T>(source, args.parser);
        this.#JS_signal          = new Signal<T>();

        const sources: ROSignal<T>[] = [
            this.#HTML_valueSignal,
            this.  #JS_signal,
            this.#HTML_defaultSignal,
        ];

        const defVal: T|null = args.default ?? null;
        this.signal = new PrioritySignal<T>(defVal, ...sources);
    }

    set parser(parser: ParserAlgo<any>) {
        this.#HTML_valueSignal  !.parser = parser;
        this.#HTML_defaultSignal!.parser = parser;
    }

    set JS_value(value: T|null) {

        if( value !== null) {
            const argnames: string[] = (value as any)[names];
            if( argnames !== undefined ) {

                const fcts = value as (values:null|Record<string, any>) => T;

                //TODO: unlisten if removed... - requires a callback...
                for(let name of argnames)
                    this.#source![name].listen( () => {
                        // TODO: LCS...
                        this.#JS_signal!.value = fcts(this.#source);
                    });

                return;
            }
        }

        this.#JS_signal!.value = value;
    }
    set HTML_value(value: string|null) {
        this.#HTML_valueSignal!.rawString = value;
    }
    set HTML_default(value: string|null) {
        this.#HTML_defaultSignal!.rawString = value;
    }
}