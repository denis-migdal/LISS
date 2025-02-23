import LISS from "@LISS/src/LISS";

import "@LISS/src/define";
import "@LISS/src/define/autoload";

import "@LISS/src/utils/parsers";
import "@LISS/src/utils/network/require";

import "@LISS/src/utils/tests/assertElement";

declare module "@LISS/src/LISS" {
    interface ILISS {
        VERSION: string
    }
}

LISS.VERSION = "V3";

export default LISS;

// @ts-ignore
globalThis.LISS = LISS;