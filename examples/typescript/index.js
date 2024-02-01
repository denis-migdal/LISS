// tsc examples/typescript/index.ts --strict --target esnext --module esnext
import LISS, { CstmEvent } from '../../index.js';
class MyComponent extends LISS({
    extends: EventTarget,
    params: {
        foo: 42
    }
}) {
    constructor() {
        super();
        this.content.append('Hello World ;)');
    }
    faa() {
        return this.params.foo;
    }
}
// define the "my-component" component.
LISS.define('my-component', MyComponent); // TS error 2345 in editor, but not in tsc --check.
{
    const component = await LISS.build('my-component', { params: { foo: 43 }, parent: document.body });
    let foo = component.faa();
    console.log('foo:', foo);
}
{
    const component = await LISS.qs('', 'my-component');
    let foo = component.faa();
    console.log('foo:', foo);
    component.addEventListener('foo', (ev) => {
        foo = ev.detail;
        console.log('Event', foo);
    });
}
{
    const component = await LISS.qs('my-component');
    let foo = component.faa();
    console.log('foo:', foo);
    component.dispatchEvent(new CstmEvent('foo', 33));
}
