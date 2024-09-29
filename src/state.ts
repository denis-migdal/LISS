import { LISSBase, LISSBaseCstr, LISSHost, LISSHostCstr } from "types";
import { _element2tagname, isDOMContentLoaded, whenDOMContentLoaded } from "utils";

enum State {
    NONE = 0,

    // class
    DEFINED = 1 << 0,
    READY   = 1 << 1,

    // instance
    UPGRADED    = 1 << 2,
    INITIALIZED = 1 << 3,
}

export const DEFINED     = State.DEFINED;
export const READY       = State.READY;
export const UPGRADED    = State.UPGRADED;
export const INITIALIZED = State.INITIALIZED;

export class LISSState {

    #elem: HTMLElement|null;

    // if null : class state, else instance state
    constructor(elem: HTMLElement|null = null) {
        this.#elem = elem;
    }

    static DEFINED     = DEFINED;
    static READY       = READY;
    static UPGRADED    = UPGRADED;
    static INITIALIZED = INITIALIZED;

    is(state: State) {

        if(this.#elem === null)
            throw new Error("not supported yet");

        const elem = this.#elem;

        if( state & DEFINED     && ! this.isDefined )
            return false;
        if( state & READY       && ! this.isReady )
            return false;
        if( state & UPGRADED    && ! this.isUpgraded )
            return false;
        if( state & INITIALIZED && ! this.isInitialized )
            return false;
    
        return true;
    }

    async when(state: State) {

        if(this.#elem === null)
            throw new Error("not supported yet");

        const elem = this.#elem;

        let promises = new Array<Promise<any>>();
    
        if( state & DEFINED )
            promises.push( this.whenDefined() );
        if( state & READY )
            promises.push( this.whenReady() );
        if( state & UPGRADED )
            promises.push( this.whenUpgraded() );
        if( state & INITIALIZED )
            promises.push( this.whenInitialized() );
    
        await Promise.all(promises);
    }

    // ================== DEFINED ==============================

    get isDefined() {
        if(this.#elem === null)
            throw new Error('not implemented');

        return customElements.get( getName(this.#elem) ) !== undefined;
    }
    
    async whenDefined<T extends LISSHostCstr<LISSBase>>(): Promise<T> {
        if(this.#elem === null)
            throw new Error('not implemented');

        return await customElements.whenDefined( getName(this.#elem) ) as T;
    }

    // ================== READY ==============================

    get isReady() {

        if(this.#elem === null)
            throw new Error('not implemented');
        const elem = this.#elem;

        if( ! this.isDefined )
            return false;

        const Host = getHostCstrSync(elem);

        if( ! isDOMContentLoaded() )
            return false;

        return Host.isDepsResolved;
    }

    async whenReady() {

        if(this.#elem === null)
            throw new Error('not implemented');

        const elem = this.#elem;

        const host = await this.whenDefined(); // could be ready before defined, but well...

        await whenDOMContentLoaded;

        await host.whenDepsResolved;
    }
    
    // ================== UPGRADED ==============================

    get isUpgraded() {

        if(this.#elem === null)
            throw new Error("not supported yet");
        const elem = this.#elem;

        if( ! this.isDefined )
            return false;
    
        const host = getHostCstrSync(elem);
        return elem instanceof host;
    }
    
    async whenUpgraded<T extends LISSHost<LISSBaseCstr>>(): Promise<T> {
        
        if(this.#elem === null)
            throw new Error("not supported yet");

        const elem = this.#elem;

        const host = await this.whenDefined();
    
        if( elem instanceof host)
            return elem as T;
    
        // h4ck
    
        if( "_whenUpgraded" in elem) {
            await elem._whenUpgraded;
            return elem as T;
        }
    
        const {promise, resolve} = Promise.withResolvers<void>();
        
        (elem as any)._whenUpgraded        = promise;
        (elem as any)._whenUpgradedResolve = resolve;
    
        await promise;

        return elem as T;
    }

    // ================== INITIALIZED ==============================

    get isInitialized() {

        if(this.#elem === null)
            throw new Error("not supported yet");
        const elem = this.#elem;

        if( ! this.isUpgraded )
            return false;
    
        return "isInitialized" in elem && elem.isInitialized;
    }
    
    async whenInitialized<T extends LISSBase>() {
    
        if(this.#elem === null)
            throw new Error("not supported yet");
        const elem = this.#elem;

        const host = await this.whenUpgraded();

        await host.whenInitialized;

        return (elem as LISSHost<T>).base as T;
    }

    // ================== CONVERSIONS ==============================

    valueOf() {

        if(this.#elem === null)
            throw new Error("not supported yet");

        let state: State = 0;
    
        if( this.isDefined )
            state |= DEFINED;
        if( this.isReady )
            state |= READY;
        if( this.isUpgraded )
            state |= UPGRADED;
        if( this.isInitialized )
            state |= INITIALIZED;
    
        return state;
    }

    toString() {

        const state = this.valueOf();
        let is = new Array<string>();

        if( state & DEFINED )
            is.push("DEFINED");
        if( state & READY )
            is.push("READY");
        if( state & UPGRADED )
            is.push("UPGRADED");
        if( state & INITIALIZED )
            is.push("INITIALIZED");
    
        return is.join('|');
    }
}

export function getState(elem: HTMLElement) {
    if( "state" in elem)
        return elem.state as LISSState;
    
    return (elem as any).state = new LISSState(elem);
}

// ================== State modifiers (move?) ==============================

// Go to state DEFINED
export function define<T extends LISSBaseCstr>(
    tagname       : string,
    ComponentClass: T|LISSHostCstr<T>) {

    // could be better.
    if( "Base" in ComponentClass) {
        ComponentClass = ComponentClass.Base as T;
    }
    
    const Class  = ComponentClass.LISSCfg.host;
    let htmltag  = _element2tagname(Class)??undefined;

    const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);

    const opts = htmltag === undefined ? {}
                : {extends: htmltag};

    customElements.define(tagname, LISSclass, opts);
};

// Go to state UPGRADED
export async function upgrade<T extends LISSHost<LISSBaseCstr>>(elem: HTMLElement, strict = false): Promise<T> {

    const state = getState(elem);

    if( state.isUpgraded && strict )
        throw new Error(`Already upgraded!`);

    await state.whenDefined();

    return upgradeSync<T>(elem);
}

export function upgradeSync<T extends LISSHost<LISSBaseCstr>>(elem: HTMLElement, strict = false): T {
   
    const state = getState(elem);

    if( state.isUpgraded && strict )
        throw new Error(`Already upgraded!`);
    
    if( ! state.isDefined )
        throw new Error('Element not defined!');

    if( elem.ownerDocument !== document )
        document.adoptNode(elem);
    customElements.upgrade(elem);

    const Host = getHostCstrSync(elem);

    if( ! (elem instanceof Host) )
        throw new Error(`Element didn't upgrade!`);

    return elem as T;
}

// Go to state INITIALIZED

export async function initialize<T extends LISSBase>(elem : HTMLElement|LISSHost<T>, strict: boolean|T["params"] = false): Promise<T> {
    
    const state = getState(elem);

    if( state.isInitialized ) {
        if( strict === false )
            return (elem as any).base as T;
        throw new Error(`Already initialized!`);
    }

    const host = await upgrade(elem);

    await state.whenReady();

    let params = typeof strict === "boolean" ? {} : strict;
    host.initialize(params);

    return host.base as T;
}
export function initializeSync<T extends LISSBase>(elem : HTMLElement|LISSHost<T>, strict: boolean|T["params"] = false): T {

    const state = getState(elem);
    if( state.isInitialized ) {
        if( strict === false)
            return (elem as any).base as T;
        throw new Error(`Already initialized!`);
    }

    const host = upgradeSync(elem);

    if( ! state.isReady )
        throw new Error("Element not ready !");

    let params = typeof strict === "boolean" ? {} : strict;
    host.initialize(params);

    return host.base as T;
}
// ====================== external WHEN ======================================

export async function whenUpgraded<T extends LISSHost<LISSBaseCstr>>(elem: HTMLElement, force=false, strict=false): Promise<T> {
    
    const state = getState(elem);

    if( force )
        return await upgrade(elem, strict);

    return await state.whenUpgraded<T>();
}

export async function whenInitialized<T extends LISSBase>(elem : HTMLElement|LISSHost<T>, force=false, strict=false): Promise<T> {
    
    const state = getState(elem);

    if( force )
        return await initialize(elem, strict);

    return await state.whenInitialized<T>();
}

// Private for now.

function getHostCstrSync<T extends LISSHostCstr<LISSBaseCstr>>(elem: HTMLElement) {
    
    const name = getName(elem);
    const host = customElements.get( name );
    if( host === undefined)
        throw new Error(`${name} not yet defined!`);
    return host as T;
}

//TODO: move 2 registery...
export function getName( element: Element ): string {

	const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
	
	if( ! name.includes('-') )
		throw new Error(`Element ${name} is not a WebComponent`);

	return name;
}