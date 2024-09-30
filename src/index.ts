import LISS from "./extends";

import "./core/state";
import "./core/customRegistery";

//TODO: globalCSSRules
//TODO: BLISS
//TODO: LISSParams
//TODO: others...


import "./helpers/querySelectors";
import "./helpers/LISSAuto";

export {liss, lissSync} from "./helpers/build";
export {html} from "./utils";
export default LISS;