import { LISSControlerCstr, LISSHostCstr } from "types";
import { getHostCstrSync, isDefined, whenDefined } from "./DEFINED";

type Param<T extends LISSControlerCstr> = string|T|LISSHostCstr<T>|InstanceType<LISSHostCstr<T>>|HTMLElement;

export function isReady<T extends LISSControlerCstr>(elem: Param<T>): boolean {
    
    if( ! isDefined(elem) )
        return false;
    
    const hostCstr = getHostCstrSync(elem);

    return hostCstr.isDepsResolved;
}

export async function whenReady<T extends LISSControlerCstr>(elem: Param<T>): Promise<T> {
    
    const hostCstr = await whenDefined(elem);
    await hostCstr.whenDepsResolved;

    return hostCstr.Controler as T;
}

export function getControlerCstr<T extends LISSControlerCstr>(elem: Param<T>): Promise<T> {
    // we can't force a ready.
    return whenReady(elem) as Promise<T>;
}

export function getControlerCstrSync<T extends LISSControlerCstr>(elem: Param<T>): T {
    
    if( ! isReady(elem) )
        throw new Error("Element not ready !");

    return getHostCstrSync(elem).Controler as T;
}