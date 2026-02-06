import { createExtension } from "@MWL/mixins/mixer";
import { Cstr }            from "@MWL/types/Cstr";
import { getShadowRoot }   from "./Content";

export function WithStyle(base     : Cstr<HTMLElement>,
                          ...styles: CSSStyleSheet[]
                        ) {

    return class Mixed extends base {

        // enables overriding.
        protected static  styles = styles;

        constructor(...args: any[]) {
            super(...args);

            const root = getShadowRoot(this);

            const styles: CSSStyleSheet[] = (this.constructor as any).styles;
            root.adoptedStyleSheets.push(...styles);
        }
    }
}

const Style = createExtension(WithStyle);
export default Style;