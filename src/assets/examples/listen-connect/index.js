export default class extends LISS() {
    constructor() {
        super();

        // simulate some changes
        setTimeout(() => {
            const t = this.host.parentElement;
            this.host.remove();
            t.append(this.host);
        }, 0);
    }

    connectedCallback() {
        this.content.append(`+${this.isConnected},`);
    }
    disconnectedCallback() {
        this.content.append(`-${this.isConnected},`);
    }
}