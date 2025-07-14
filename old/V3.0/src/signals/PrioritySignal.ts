import ROSignal from "./ROSignal";

export default class PrioritySignal<T> extends ROSignal<T> {

    #signals: ROSignal<T>[];
    #current_priority = 0;

    #defaultValue: T|null = null;

    constructor(defaultValue: T|null, ...signals: ROSignal<T>[]) {
        super();

        this.#signals      = signals;
        this.#defaultValue = defaultValue;

        // listen will trigger, all but 0th ignored.
        for(let i = signals.length - 1; i >= 0 ; --i)
            signals[i].listen( () => {
                if( i <= this.#current_priority )
                    this.trigger();
            });
    }

    override get value(): T|null {

        this.ack();

        let i;
        let val = null;

        for( i = 0 ; i < this.#signals.length; ++i) {
            val = this.#signals[i].value;
            if( val !== null)
                break;
        }

        this.#current_priority = i;

        if(val === null)
            val = this.#defaultValue;
        
        return val;
    }

}