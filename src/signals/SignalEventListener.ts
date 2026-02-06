import SignalEvent from "./SignalEvent";

export type SignalEventListenerOpts = {
    ack : boolean,
    once: boolean
};

export const NULL_CALLBACK = () => {};

/**
   - callback (cstor)
   - src (RW)
   - trigger
   - opts
       - pending/ack
       - once
*/
export default class SignalEventListener {

    constructor(src     : SignalEvent|null = null,
                callback: (() => void)     = NULL_CALLBACK,
                {
                    ack  = false,
                    once = false
                }: Partial<SignalEventListenerOpts> = {}) {

        this.#callback = callback;
        this.#opts = { ack, once };

        if( src !== null)
            this.source = src;
    }

    #opts: SignalEventListenerOpts;

    #callback: () => void;

    // event...

    #pending = false;

    get pending() {
        return this.#pending;
    }

    ack() {
        this.#pending = false;
    }

    #signalCallback = () => { this.trigger() }
    protected trigger() {

        if( this.#opts.ack && this.#pending )
            return;

        // can't do it after callback();
        if( this.#opts.once ) {
            this.#src!.unlisten(this.#signalCallback);
            this.#src = null;
        }

        this.#pending = true;
        this.#callback();
    }

    // source...

    #src: SignalEvent|null = null;

    get source() {
        return this.#src;
    }

    set source(src: SignalEvent|null) {
        
        if( src === this.#src )
            return;

        this.setSourceWithoutTrigger(src);
        this.trigger();
    }

    // used for subclasses...
    protected setSourceWithoutTrigger(src: SignalEvent|null) {
        
        if( this.#src !== null)
            this.#src.unlisten(this.#signalCallback)

        this.#src = src;

        if( this.#src !== null )
            this.#src.listen(this.#signalCallback);
    }
}