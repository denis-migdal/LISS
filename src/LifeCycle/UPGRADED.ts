import { LISSControler, LISSHost } from "../types";
import { getHostCstrSync, isDefined, whenDefined } from "./DEFINED";

type Param<_T extends LISSControler> = HTMLElement;

//TODO: upgrade function...

export function isUpgraded<T extends LISSControler>(elem: Param<T>|LISSHost<T>): elem is LISSHost<T> {

    if( ! isDefined(elem) )
        return false;

    const Host = getHostCstrSync(elem);

    return elem instanceof Host;
}

export async function whenUpgraded<T extends LISSControler>(elem: Param<T>): Promise<LISSHost<T>> {
    
    const Host = await whenDefined(elem);

    // already upgraded
    if( elem instanceof Host)
        return elem as LISSHost<T>;

    // h4ck

    if( "_whenUpgraded" in elem) {
        await elem._whenUpgraded;
        return elem as LISSHost<T>;
    }

    const {promise, resolve} = Promise.withResolvers<void>();
    
    (elem as any)._whenUpgraded        = promise;
    (elem as any)._whenUpgradedResolve = resolve;

    await promise;

    return elem as LISSHost<T>;
}

export async function getHost<T extends LISSControler>(elem: Param<T>): Promise<LISSHost<T>> {
    
    await whenDefined(elem);

    if( elem.ownerDocument !== document )
        document.adoptNode(elem);
    customElements.upgrade(elem);

    return elem as LISSHost<T>;
}

export function getHostSync<T extends LISSControler>(elem: Param<T>): LISSHost<T> {
    
    if( ! isDefined(elem) )
        throw new Error("Element not defined !");

    if( elem.ownerDocument !== document )
        document.adoptNode(elem);
    customElements.upgrade(elem);

    return elem as LISSHost<T>;
}

export const upgrade     = getHost;
export const upgradeSync = getHostSync