import { LISS as __LISS } from "./LISSBase";

import {define} from "./define";

interface ILISS {
    define: typeof define;
}

const _LISS = __LISS as typeof __LISS & ILISS;

_LISS.define = define;

export const LISS = _LISS;