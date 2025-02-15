import v2 from "./V2";
import v3 from "./V3";

// @ts-ignore
v2.v3 = v3;

import style      from "./V3/utils/style";
import template   from "./V3/utils/template";
import generators from "./V3/ContentGenerators/AutoContentGenerator";

// @ts-ignore
v2.template = template;
// @ts-ignore
v2.style    = style;
// @ts-ignore
v2.generators = generators

export default v2;