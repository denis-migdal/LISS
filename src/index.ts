import LISS from "./extends";

import "./core/LifeCycle";

export {default as ContentGenerator} from "./ContentGenerator";

//TODO: events.ts
//TODO: globalCSSRules
export {LISSAuto_ContentGenerator} from "./helpers/LISSAuto";
import "./helpers/querySelectors";

export {ShadowCfg} from "./types";

export {liss, lissSync} from "./helpers/build";
export {eventMatches, WithEvents, EventTarget2, CustomEvent2} from './helpers/events';
export {html} from "./utils";
export default LISS;

import {LISSv3} from "./V3";
// @ts-ignore
LISS.LISSv3 = LISSv3;


// for debug.
export {_extends} from "./extends";

// required for auto mode it seems.
// @ts-ignore
globalThis.LISS = LISS;