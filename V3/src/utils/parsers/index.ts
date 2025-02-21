import LISS from "src/LISS";

import html     from "./html"
import template from "./template";
import style    from "./style";

declare module "src/LISS" {
    interface ILISS {
        html    : typeof html;
        template: typeof template;
        style   : typeof style;
    }
}

LISS.style    = style;
LISS.template = template;
LISS.html     = html;

export {style, template, html};