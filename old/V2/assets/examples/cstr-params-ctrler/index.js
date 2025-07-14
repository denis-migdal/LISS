export default class extends LISS() {
    constructor(value="HTML") {
        super();
        this.content.replaceChildren(value);
    }
}