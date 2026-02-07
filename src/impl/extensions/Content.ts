import { createExtension } from "@MWL/mixins/mixer";
import { Cstr }            from "@MWL/types/Cstr";

type Clonable = {cloneNode(deep?: boolean): Node};

export function WithContent<B extends Cstr<HTMLElement>>(base: B,
                                                     template: Clonable
                                                ) {

    return class Mixed extends base {

        // enables overriding.
        protected static  template = template;

        protected readonly content = fillContent(this);
    }
}

const Content = createExtension(WithContent);
export default Content;

function fillContent(target: HTMLElement) {

    const template: Clonable = (target.constructor as any).template

    const root    = getShadowRoot(target);
    const content = template.cloneNode(true);

    root.replaceChildren(content);
    customElements.upgrade(root);

    return root;
}

export function getShadowRoot(target: HTMLElement) {
    return target.shadowRoot ?? target.attachShadow({ mode: 'open' });
}