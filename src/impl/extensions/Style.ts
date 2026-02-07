import { createExtension } from "@MWL/mixins/mixer";
import { Cstr }            from "@MWL/types/Cstr";
import { getShadowRoot }   from "./Content";

export function WithStyle<B extends Cstr<HTMLElement>>(base  : B,
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

// register extension to LISSBase
import { Mixin  } from "@MWL/mixins/types";
import { WithExt, registerLISSExtension} from "./Base";

declare module "./Base" {
    interface LISSExt<B   extends Cstr    = Cstr<HTMLElement>,
                    Acc extends Mixin[] = []
                    > {

        WithStyle: WithExt<B, Acc, typeof Style>
    }
}
registerLISSExtension(Style);