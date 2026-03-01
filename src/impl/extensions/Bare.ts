import { createExtension } from "@MWL/extensions/core/mixins/mixer";
import { Cstr }            from "@MWL/types/Cstr";

export function WithBare<B extends Cstr<HTMLElement>>(base: B) {

    return class Mixed extends base {

        // to clean up auto-completion + make intends more explicit.
        readonly host: HTMLElement = this;
        readonly api : Omit<this, keyof HTMLElement
                                        |"host"
                                        |"api"
                                        |"attributeChangedCallback"> = this;

        // for auto-completion.
        static observedAttributes: string[] = [];
        attributeChangedCallback(name  : string,
                                 oldval: string|null,
                                 newval: string|null){}
    }
}

const Bare = createExtension(WithBare);
export default Bare;