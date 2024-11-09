
import { ShadowCfg } from 'types';
import LISS from '../../../';
import { eventMatches } from 'helpers/events';

document.addEventListener('click', (ev: Event) => {
    console.warn(ev);
    console.log(ev.composed);
    console.log(ev.composedPath());
    console.log(eventMatches(ev, "span") );
});

class MyComponentA extends LISS({shadow: ShadowCfg.OPEN}) {

    // Initialize your WebComponent
    constructor() {
        super();

        // Use this.content to initialize your component's content
        const span = document.createElement('span');
        span.textContent = '[Open]';
        this.content.append(span);
    }
}
class MyComponentB extends LISS({shadow: ShadowCfg.CLOSE}) {

    // Initialize your WebComponent
    constructor() {
        super();

        // Use this.content to initialize your component's content
        const span = document.createElement('span');
        span.textContent = '[Close]';
        this.content.append(span);
    }
}
class MyComponentC extends LISS({shadow: ShadowCfg.SEMIOPEN}) {

    // Initialize your WebComponent
    constructor() {
        super();

        // Use this.content to initialize your component's content
        const span = document.createElement('span');
        span.textContent = '[SemiOpen]';
        this.content.append(span);
    }
}

// define the "my-component" component.
LISS.define('my-component-open', MyComponentA);
LISS.define('my-component-close', MyComponentB);
LISS.define('my-component-semiopen', MyComponentC);