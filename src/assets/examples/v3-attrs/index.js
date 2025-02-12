export default class extends LISS.LISSv3({
    css : `:host([a="42"]){ background: red; }`
}) {
    constructor() {
        super();

        this.host.setAttribute("a", "42");
        const attr = this.host.getAttribute("a");
        this.content.replaceChildren(attr);
    }
}