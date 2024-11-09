
import LISS from '../../../';

class MyComponent extends LISS({attrs: ["e"]}) {

    // Initialize your WebComponent
    constructor() {
        super();

        // Use this.content to initialize your component's content
        this.content.append('Hello World ;)');

        console.log('State (initial)', {
            // Use this.content to access your component's content:
            Content: this.content,
            // Use this.host to access the component's host:
            Host   : this.host, // <my-component></my-component>
            // Use this.attrs to efficiently access the component's host's attributes:
            Attributes: {...this.attrs},
            // Use this.params to access the component parameters.
            Parameters: this.params
        });
    }
}

// define the "my-component" component.
LISS.define('my-component', MyComponent);