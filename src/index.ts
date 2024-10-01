import LISS from "./extends";

import "./core/state";
import "./core/customRegistery";

//TODO: BLISS

//TODO: events.ts
//TODO: globalCSSRules
import "./helpers/LISSAuto";
//TODO: LISSParams
import "./helpers/querySelectors";

export {eventMatches, WithEvents, EventTarget2, CustomEvent2} from './helpers/events';
export {liss, lissSync} from "./helpers/build";
export {html} from "./utils";
export default LISS;