import type { LISSControler } from "../types";

import { initialize, initializeSync } from "../state";
import { html } from "../utils";


export async function liss<T extends LISSControler>(str: readonly string[], ...args: any[]) {

    const elem = html(str, ...args);

    if( elem instanceof DocumentFragment )
      throw new Error(`Multiple HTMLElement given!`);

    return await initialize<T>(elem);
}

export function lissSync<T extends LISSControler>(str: readonly string[], ...args: any[]) {

    const elem = html(str, ...args);

    if( elem instanceof DocumentFragment )
      throw new Error(`Multiple HTMLElement given!`);

    return initializeSync<T>(elem);
}