import LISS from "./extends";

import "./core/state";
import "./core/customRegistery";

export {default as ContentGenerator} from "./ContentGenerator";

//TODO: BLISS

//TODO: events.ts
//TODO: globalCSSRules
export {LISSAuto_ContentGenerator} from "./helpers/LISSAuto";
import "./helpers/querySelectors";

export {ShadowCfg} from "./types";

export {liss, lissSync} from "./helpers/build";
export {eventMatches, WithEvents, EventTarget2, CustomEvent2} from './helpers/events';
export {html} from "./utils";
export default LISS;

// for debug.
export {_extends} from "./extends";

import { ShadowCfg } from "./types";