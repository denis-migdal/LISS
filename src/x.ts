class SignalEvent {

    #callbacks = new Set<(pthis: SignalEvent) => void>();

    listen(callback: (pthis: SignalEvent) => void) {
        this.#callbacks.add(callback);

        return this;
    }
    unlisten(callback: (pthis: SignalEvent) => void) {
        this.#callbacks.delete(callback);

        return this;
    }

    trigger() {
        for(let callback of this.#callbacks)
            callback(this);

        return this;
    }
}

export class ROSignal<T> extends SignalEvent {

    constructor(initialValue?: T|null) {
        super();
        this._value = initialValue ?? null;
    }

    protected _value: T|null = null;

    hasValue() {
        return this._value !== null;
    }
    get value() {
        return this._value;
    }
}

export class Signal<T> extends ROSignal<T> {

    override get value() {
        return super.value;
    }

    override set value(value: T|null) {

        // do not trigger if value didn't changed.
        if( value === this._value)
            return;

        this._value    = value;
        this.trigger();

        return;
    }

    clear() {
        this.value = null;

        return this;
    }
}

export class SignalEventMerger extends SignalEvent {
    
    #callback = () => {
        this.trigger();
    }

    constructor(...sources: SignalEvent[]) {
        super();

        for(let source of sources)
            this.add(source);
    }

    add(signal: SignalEvent) {
        signal.listen(this.#callback);

        return this;
    }
    remove(signal: SignalEvent) {
        signal.unlisten(this.#callback);

        return this;
    }
}

export class LazyComputedSignal<T extends ROSignal<unknown> = ROSignal<unknown>, U = unknown> extends ROSignal<U> {
    
    #source: T;

    #compute: (sources: T) => U|null;
    #cached  = false;

    addComputation( callback: (sources: T, previous: (sources: T) => U|null) => U|null) {
        const previous = this.#compute;
        this.#compute = (sources: T) => callback(sources, previous);
    }

    override get value() {
        if(this.#cached !== true)
            this._value = this.#compute(this.#source);

        return this._value;
    }

    constructor(source: T, compute: (source: T) => U|null) {
        super();

        this.#compute = compute;
        this.#source = source;

        console.warn("src", this.#source);

        this.#source.listen( () => {
                
            // lazy computation...
            this.#cached = false;
            /* const value = compute(this.#sources);

            // do not trigger if value didn't changed.
            if( this._value === value )
                return;
            this._value = value;*/
            this.trigger();
        });
    }
}

type ThrottledMethodCstr = {
    new(pthis: ThrottledSignalEvent): ThrottledMethod
}

class ThrottledMethod {

    protected readonly _event: ThrottledSignalEvent;

    protected _blocked = false;
    protected _waiting = false;

    protected _started = false;

    constructor(event: ThrottledSignalEvent) {
        this._event = event;
    }

    block(blocked = true) {

        this._blocked = blocked;

        if( this._waiting && ! blocked ) {
            this._started = true;
            this._waiting = false;
            this.startTriggerProcess();
        }
    }

    startTriggerProcess() {
        this.trigger();
    }

    trigger() {
        // update is canceled until the next unblock.
        if(this._blocked) {
            this._waiting = true;
            this._started = false;
            return;
        }

        // perform the update
        this._started = false;
        this._event.trigger();
    }

    requestTrigger() {
        if( this._started ) {
            return;
        }
        if( this._blocked ) {
            this._waiting = true;
            return;
        }
        this._started = true;
        this._waiting = false;
        this.startTriggerProcess();
    }
}

class AnimationFrameThrottledMethod extends ThrottledMethod {


    readonly #callback = () => {
        this.trigger();
    }

    override startTriggerProcess(): void {
        requestAnimationFrame( this.#callback );
    }
}

class ThrottledSignalEvent extends SignalEvent {

    #throttledMethod: ThrottledMethod;

    constructor(event: SignalEvent, throttledMethod: ThrottledMethodCstr = AnimationFrameThrottledMethod) {
        super();

        this.#throttledMethod = new throttledMethod(this);

        event.listen(() => {
            this.#throttledMethod.requestTrigger();
        });
    }

    changeThrottledMethod() {
        throw new Error("not implemented");
    }
    blockSignal(blocked = true) {
        this.#throttledMethod.block(blocked);
    }
}