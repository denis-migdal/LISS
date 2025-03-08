import ROSignal from "./ROSignal";

export type ParserAlgo<T> = (src:string) => T;

const IS_VALUE_REGEX = /^\&[_\w]+$/;

export default class ParsedSignal<T> extends ROSignal<T> {

    #parser: ParserAlgo<T>;
    #source: null|Record<string, ROSignal<any>>;
    #value: null|T = null;

    constructor(source: null|Record<string, ROSignal<any>>, parser: ParserAlgo<T>) {
        super();

        this.#source = source;
        this.#parser = parser;
    }

    #parsed   = true;
    #computed = true;

    #str: string|null = null;
    #names: null| (string[])     = null;
    #fct  : null| ((values:null|Record<string, any>) => T) = null;

    private callback = () => {
        this.#computed = false;
        this.trigger();
    }

    set parser(parser: ParserAlgo<T>) {
        this.#parser = parser;
        this.#parsed = false;

        this.trigger();
    }

    set rawString(str: string|null) {

        if( str === this.#str )
            return;

        this.#parsed = false;
        this.#str    = str;

        this.trigger();
    }
    
    #parse(str: string): T {

        if( this.#names !== null)
            for(let name of this.#names)
                this.#source![name].unlisten(this.callback);

        this.#names = null;
        this.#fct   = null;

        str = str.trim();

        if( IS_VALUE_REGEX.test(str) ) {

            const name = str.slice(1);
            this.#names = [name];
            this.#fct   = (args) => {
                return args![name].value;
            };
        } else {

            const end = str.indexOf("}) => ");
            if( end !== -1 && str.startsWith("({") ) {

                const args = str.slice(1, end+1);

                let fcts: string;
                if( str[str.length-1] === "}" && str[end+6] === "{")
                    fcts = str.slice(end+6+1, -1);
                else
                    fcts = "return " + str.slice(end+6);

                this.#names = str.slice(2, end).split(",").map(e => e.trim());
                this.#fct = new Function(args, fcts) as any;
            }
        }

        if(this.#fct !== null) {

            for(let name of this.#names!)
                this.#source![name].listen( this.callback );

            this.#computed = true;
            return this.#fct(this.#source);
        }

        return this.#parser(str);
    }

    get value() {

        if( this.#parsed === false ) {

            this.#value = null;

            // trigger without ack ignored
            if( this.#str !== null && this.#str !== "") {
                const result = this.#parse(this.#str);
                console.warn(result, this.#str);
                if( result !== undefined ) {
                    console.warn("r", result);
                    this.#value    = result;
                }
            }

            this.#computed = true;
            this.#parsed   = true;
        }

        if( ! this.#computed )
            this.#value = this.#fct!(this.#source)

        this.ack();

        return this.#value;
    }
}