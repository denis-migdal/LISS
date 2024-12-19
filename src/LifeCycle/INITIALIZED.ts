import { LISSControler, LISSControlerCstr, LISSHost } from "../types";
import { isUpgraded, upgrade, upgradeSync, whenUpgraded } from "./UPGRADED";
import { isReady, whenReady } from "./READY";

type Param<T extends LISSControler> = LISSHost<T>|HTMLElement;

export function isInitialized<T extends LISSControler>(elem: Param<T>): boolean {
    
    if( ! isUpgraded(elem) )
        return false;

    return elem.isInitialized;
}

export async function whenInitialized<T extends LISSControler>(elem: Param<T>): Promise<T> {
    
    const host = await whenUpgraded(elem);

    return await host.whenInitialized as T;
}

export async function getControler<T extends LISSControler>(elem: Param<T>): Promise<T> {

    const host = await upgrade(elem);
    await whenReady(host);

    //TODO: initializeSync vs initialize ?
    return host.initialize();
}

export function getControlerSync<T extends LISSControler>(elem: Param<T>): T {
    
    const host = upgradeSync(elem);
    if( ! isReady(host) )
        throw new Error("Dependancies not ready !")

    return host.initialize();
}

export const initialize     = getControler;
export const initializeSync = getControlerSync;