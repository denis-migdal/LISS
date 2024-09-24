import { LISS as _LISS } from "./LISSBase";

import {define} from "./define";

interface ILISS {
    define: typeof define;
}

const LISS = _LISS as typeof _LISS & ILISS;

LISS.define = define;

export default LISS;