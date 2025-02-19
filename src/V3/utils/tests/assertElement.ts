export default function assertElement(tagname: string, shadow_html: string|null = null, css: Record<string, any> = {}) {
    
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

import LISS from "V3/LISS";

declare module "V3/LISS" {
    interface ILISS {
        assertElement    : typeof assertElement;
    }
}

LISS.assertElement = assertElement;
