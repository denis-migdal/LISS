export default class extends LISS() {
    constructor() {
        super();

        // simulate some changes
        setTimeout(() => {
            this.host.setAttribute("a", "1");
            this.host.setAttribute("a", "2");
        }, 0);
    }

    static observedAttributes = ["a"];

    attributeChangedCallback(name, _, value) {
        this.content.append(`${name}=${value},`);
    }
}