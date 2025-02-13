// SignalEvent
// ^ ROSignal<T>
// ^ Signal<T>

// SignalEventMerger : notify if event from several sources (can be added/removed)
// IndirectSignal
// ^ LazyComputedSignal : transform value (one signal)
    

// SignalManager

// ThrottledSignalEvent
// ThrottledMethod
// ^ AnimationFrameThrottledMethod

export class SignalEvent {

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

export class IndirectSignal<T = unknown, U = T> extends ROSignal<U> {

    #source: ROSignal<T>|null = null;

    constructor(source: ROSignal<T>|null = null, callback?: ()=> void) {
        super();

        this.#source = source;
        if(callback !== undefined)
            this._callback = callback;

        this.#source?.listen( this._callback );
    }

    protected _callback = () => {
        this.trigger();
    };


    get source(): ROSignal<T>|null {
        return this.#source;
    }

    set source(source: ROSignal<T>|null) {

        if( this.#source === source )
            return;

        if( this.#source !== null)
            this.#source.unlisten(this._callback);
        this.#source = source;
        if( this.#source !== null)
           this.#source.listen(this._callback);

        this._callback();
    }

    override hasValue(): boolean {
        return this.#source !== null && this.#source.hasValue();
    }

    override get value(): U|null {
        if( this.#source === null)
            return null;
        return this.#source.value as U|null;
    }
}

export class LazyComputedSignal<T = unknown, U = unknown> extends IndirectSignal<T, U> {
    
    constructor(source: ROSignal<T>, compute: (source: ROSignal<T>) => U|null) {
        super(source);

        this.#compute = compute;
    }

    #compute: (sources: ROSignal<T>) => U|null;

    changeComputeFunction(cmp: (sources: ROSignal<T>) => U|null) {
        if( this.#compute === cmp )
            return;
        this.#compute = cmp;
        this._callback();
    }

    #cached  = false;

    override get value() {

        if( this.source === null)
            return null;

        if(this.#cached !== true)
            this._value = this.#compute(this.source);

        return this._value;
    }

    protected override _callback = () => {
        // lazy computation...
        this.#cached = false;
        this.trigger();
    };
}

export class SignalManager extends ROSignal<SignalManager> {

    #signals: Record<string, IndirectSignal<any>> = {};

    constructor() {
        super();
        this._value = this;
    }

    init<T>(name: string): IndirectSignal<T> {
        const signal = this.#signals[name] = new IndirectSignal<T>();
        signal.listen( () => this.trigger() );

        return signal;
    }

    get<T>(name: string): IndirectSignal<T> {

        let signal = this.#signals[name];
        if( signal === undefined )
            signal = this.init(name);

        return signal;
    }

    set(name: string, signal: ROSignal<any>) {
        const _signal = this.get(name);
        _signal.source = signal;
    }

    names(): readonly string[] {
        return Object.keys(this.#signals);
    }

    clear(name: string) {
        const _signal = this.get(name);
        _signal.source = null;
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

export class ThrottledSignalEvent extends SignalEvent {

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