
import { html, liss } from 'helpers/build';
import LISS from '../../../';
import { ShadowCfg } from 'types';

// =============================================================

class MyComponentA extends LISS() {

    constructor() {
        super();

        this.content.replaceChildren(html`<b>html\`\` : OK</b>`);
    }
}

LISS.define('my-component-a', MyComponentA);

// =============================================================

class MyComponentB extends LISS({
    content: "liss``"
}) {

    constructor() {
        console.log("init");
        super();
    }
}

LISS.define('my-component-b', MyComponentB);

async function foo() {

    const promise = liss`<my-component-b></my-component-b>`;

    console.warn(promise);
    
    const component = await promise;

    console.warn(promise);

    console.log("append", component);
    document.body.append(component.host);
}

foo();