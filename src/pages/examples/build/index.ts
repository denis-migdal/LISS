
import { html, liss } from 'helpers/build';
import LISS from '../../../';
import { getState } from 'state';

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

    const component = await liss`<my-component-b></my-component-b>`;
    
    document.body.append(component.host);
}

foo();

{
    let compo = new MyComponentB.Host();
    document.body.append(compo);

    console.warn("host", getState(compo) );
}
{
    let compo = new MyComponentB();
    document.body.append(compo.host);

    console.warn("base", getState(compo.host) );
}
