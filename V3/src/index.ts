import LISS from "src/LISS";

import "src/define";
import "src/define/autoload";

import "src/utils/parsers";
import "src/utils/network/require";

import "src/utils/tests/assertElement";

declare module "src/LISS" {
    interface ILISS {
        VERSION: string
    }
}

LISS.VERSION = "V3";

export default LISS;

// @ts-ignore
globalThis.LISS = LISS;