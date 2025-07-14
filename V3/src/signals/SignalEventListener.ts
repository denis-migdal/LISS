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

    #src: SignalEvent|null = null;
    #callback: () => void;
    #signalCallback = () => { this.trigger() }
    #pending = false;

    set callback(callback: () => void) {
        this.#callback = callback;
        // avoid immediate call to prevent issue.
        //if( this.#pending ) // there is a value in waiting
        //    this.#callback();
    }

    get pending() {
        return this.#pending;
    }

    ack() {
        this.#pending = false;
    }

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

    get source() {
        return this.#src;
    }

    // used for subclasses...
    protected setSourceWithoutTrigger(src: SignalEvent|null) {
        
        if( this.#src !== null)
            this.#src.unlisten(this.#signalCallback)

        this.#src = src;

        if( this.#src !== null )
            this.#src.listen(this.#signalCallback);
    }

    set source(src: SignalEvent|null) {
        
        if( src === this.#src )
            return;

        this.setSourceWithoutTrigger(src);
        this.trigger();
    }
}