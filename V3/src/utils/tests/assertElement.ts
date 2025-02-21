import whenDefined from "src/define/whenDefined";

type Options = {
    shadow_html?: string,
    css        ?: Record<string, Record<string, string>>
}

function waitFrame() {
    const { promise, resolve} = Promise.withResolvers<void>();

    requestAnimationFrame( () => resolve() );

    return promise;
}

export default async function assertElement(tagname: string, opts: Options = {}) {
    
    const shadow_html = opts.shadow_html ?? null;
    const css         = opts.css         ?? {};


    await whenDefined(tagname);

    //for(let i = 0; i < 1; ++i)
    //    await waitFrame();

    const elem = document.querySelector(tagname);

    if( elem === null )
        throw new Error("Component not found");

    //TODO: await LISS.whenInitialized(elem); ?

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

        let sub_elems: NodeListOf<HTMLElement>|HTMLElement[];
        if( selector === "")
            sub_elems = [elem as HTMLElement];
        else
            sub_elems = (((elem as any).content ?? elem.shadowRoot ?? elem) as ShadowRoot|HTMLElement).querySelectorAll<HTMLElement>(selector);
    
        if( sub_elems.length === 0)
            throw new Error(`Elements "${selector}" not found`);

        for( let sub_elem of sub_elems ) {

            // compare style : https://stackoverflow.com/questions/59342928/getcomputedstyle-only-the-changes-from-default
            //  ^ get all elements, find matching qs, compare
            // pseudo class  : https://stackoverflow.com/questions/32091848/template-queryselector-using-scope-pseudo-class-works-with-document-but-not

            const css = getComputedStyle(sub_elem)
            for(let propname in expected) {
                const val = css.getPropertyValue(propname);
                if( val !== expected[propname] ) {
                        throw new Error(
        `CSS mismatch
        Expected:${expected}
        Got: ${css}`);
                }
            }
        }
    }
}

import LISS from "src/LISS";

declare module "src/LISS" {
    interface ILISS {
        assertElement    : typeof assertElement;
    }
}

LISS.assertElement = assertElement;
