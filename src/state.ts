import { getName } from "define";
import { LISSBaseCstr, LISSHost, LISSHostCstr } from "types";
import { isDOMContentLoaded, whenDOMContentLoaded } from "utils";

export enum LISSState {
    NONE = 0,

    // class
    DEFINED = 1 << 0,
    READY   = 1 << 1,

    // instance
    UPGRADED    = 1 << 2,
    INITIALIZED = 1 << 3,
}

export const DEFINED     = LISSState.DEFINED;
export const READY       = LISSState.READY;
export const UPGRADED    = LISSState.UPGRADED;
export const INITIALIZED = LISSState.INITIALIZED;

//TODO: add to LISS...
//TODO: add to API ?
//TODO: HTMLElement or Host class or Base class or X.

export function getState(elem: HTMLElement): LISSState {

    let state: LISSState = 0;

    if( isDefined(elem) )
        state |= DEFINED;
    if( isReady  (elem) )
        state |= READY;
    if( isUpgraded(elem) )
        state |= UPGRADED;
    if( isInitialized(elem) )
        state |= INITIALIZED;

    return state;
}

export function isState(elem: HTMLElement, state: LISSState) {

    if( state & DEFINED  && ! isDefined (elem) )
        return false;
    if( state & READY    && ! isReady   (elem) )
        return false;
    if( state & UPGRADED && ! isUpgraded(elem) )
        return false;
    if( state & INITIALIZED && ! isInitialized(elem) )
        return false;

    return true;
}

export async function whenState(elem: HTMLElement, state: LISSState) {
    let promises = new Array<Promise<void>>();

    if( state & DEFINED )
        promises.push( whenDefined (elem) );
    if( state & READY )
        promises.push( whenReady   (elem) );
    if( state & UPGRADED )
        promises.push( whenUpgraded(elem) );
    if( state & INITIALIZED )
        promises.push( whenInitialized(elem) );

    await Promise.all(promises);
}

// ================== DEFINED ==============================

function isDefined(elem: HTMLElement) {
    return customElements.get( getName(elem) ) !== undefined;
}

async function whenDefined(elem: HTMLElement) {
    await customElements.whenDefined( getName(elem) );
}

// ================== getHostCstr from HTMLElement ==========================

async function getHostCstr<T extends LISSHostCstr<LISSBaseCstr>>(elem: HTMLElement) {
    
    await whenDefined(elem);

    const name = getName(elem);

    return customElements.get( name )! as T; //TODO registry function ?
}
function getHostCstrSync<T extends LISSHostCstr<LISSBaseCstr>>(elem: HTMLElement) {
    
    const name = getName(elem);
    const host = customElements.get( name );
    if( host === undefined)
        throw new Error(`${name} not yet defined!`);
    return host as T;
}

// ================== getHost from HTMLElement ==========================

async function getHost<T extends LISSHost<LISSBaseCstr>>(elem: HTMLElement) {
    
    await whenUpgraded(elem);

    return elem as T;
}
function getHostSync<T extends LISSHost<LISSBaseCstr>>(elem: HTMLElement) {
    
    if( ! isUpgraded(elem) )
        throw new Error(`Element not upgraded!`);

    return elem as T;
}

// ================== READY ==============================

function isReady(elem: HTMLElement) {

    if( ! isDefined(elem) )
        return false;

    const Host = getHostCstrSync(elem);

    if( ! isDOMContentLoaded() )
        return false;

    return Host.isDepsResolved;
}

async function whenReady(elem: HTMLElement) {

    const host = await getHostCstr(elem);

    await whenDOMContentLoaded;

    await host.whenDepsResolved;
}

// ================== UPGRADED ==============================

function isUpgraded(elem: HTMLElement) {
    if( ! isDefined(elem) )
        return false;

    const host = getHostCstrSync(elem);
    return elem instanceof host;
}

async function whenUpgraded(elem: HTMLElement) {
    
    await whenDefined(elem);
    const host = await getHostCstr(elem);

    if( elem instanceof host)
        return;

    // h4ck

    if( "_whenUpgraded" in elem) {
        await elem._whenUpgraded;
        return;
    }

    const {promise, resolve} = Promise.withResolvers<void>();
    
    (elem as any)._whenUpgraded        = promise;
    (elem as any)._whenUpgradedResolve = resolve;

    await promise;
}

// ================== INITIALIZED ==============================


function isInitialized(elem: HTMLElement) {

    if( ! isUpgraded(elem) )
        return false;

    const host = getHostSync(elem);

    return host.isInitialized;
}

async function whenInitialized(elem: HTMLElement) {

    await (await getHost(elem)).whenInitialized;

    return;
}