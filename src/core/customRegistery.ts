
import { define, getBaseCstr, getHostCstr, getName, isDefined, whenAllDefined, whenDefined } from "../customRegistery";

import LISS from "../extends";
declare module "../extends" {
    interface ILISS {
        define         : typeof define;
		whenDefined    : typeof whenDefined;
		whenAllDefined : typeof whenAllDefined;
		isDefined      : typeof isDefined;
		getName        : typeof getName;
		getHostCstr    : typeof getHostCstr;
		getBaseCstr    : typeof getBaseCstr;
    }
}

LISS.define         = define;
LISS.whenDefined    = whenDefined;
LISS.whenAllDefined = whenAllDefined;
LISS.isDefined      = isDefined;
LISS.getName        = getName;
LISS.getHostCstr    = getHostCstr;
LISS.getBaseCstr    = getBaseCstr;