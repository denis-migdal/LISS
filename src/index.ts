import LISS from "./extends";

import "./core/state";
import "./core/customRegistery";

//TODO: BLISS

//TODO: events.ts
//TODO: globalCSSRules
import "./helpers/LISSAuto";
import "./helpers/querySelectors";

export {ShadowCfg} from "./types";

export {liss, lissSync} from "./helpers/build";
export {eventMatches, WithEvents, EventTarget2, CustomEvent2} from './helpers/events';
export {LISSParams} from "./helpers/LISSParams";
export {html} from "./utils";
export default LISS;