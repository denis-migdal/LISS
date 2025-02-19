type Options = {
    shadow_html?: string,
    css        ?: Record<string, string>
}

export default async function assertElement(tagname: string, opts: Options = {}) {
    
    const shadow_html = opts.shadow_html ?? null;
    const css         = opts.css         ?? {};


    await whenDefined(tagname);

    const elem = document.querySelector(tagname);

    if( elem === null )
        throw new Error("Component not found");

    //TODO: ...
    //await LISS.whenInitialized(elem);

    if( elem.tagName.toLowerCase() !== tagname )
        throw new Error(
`Wrong tagname.
Expected: ${tagname}
Got: ${elem.tagName.toLowerCase()}`);

    if( elem.constructor.name === "HTMLElement")
        throw new Error(`Element not upgraded!`);

    if( shadow_html !== elem.shadowRoot ) {
        if( shadow_html === null || elem.shadowRoot === null )
            throw new Error(`ShadowRoot missing or unexpected.`);
        if( shadow_html !== elem.shadowRoot.innerHTML )
            throw new Error(
`HTML content mismatched.
Expected: ${shadow_html}
Got: ${elem.shadowRoot.innerHTML}`);
    }

    for(let selector in css ) {
        const expected = css[selector];
        const sub_elems = ((elem as any).content as ShadowRoot|HTMLElement).querySelectorAll(selector);
        for( let sub_elem of sub_elems ) {
            const css = window.getComputedStyle(sub_elem).cssText;
            if(css !== expected)
                throw new Error(
`CSS mismatch
Expected:${expected}
Got: ${css}`);

        }
    }
}

import { whenDefined } from "V2/LifeCycle/DEFINED";
import LISS from "V3/LISS";

declare module "V3/LISS" {
    interface ILISS {
        assertElement    : typeof assertElement;
    }
}

LISS.assertElement = assertElement;
