import define      from "./define";
import isDefined   from "./isDefined";
import whenDefined from "./whenDefined";

import LISS from "V3/LISS";

declare module "V3/LISS" {
    interface ILISS {
        define    : typeof define;
        isDefined: typeof isDefined;
        whenDefined   : typeof whenDefined;
    }
}

LISS.define      = define;
LISS.isDefined   = isDefined;
LISS.whenDefined = whenDefined;

export {define, isDefined, whenDefined};