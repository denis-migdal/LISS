export default class extends LISS({
    html: require("./index.html"),
    css : require("./index.css" ),
}) {
    constructor() {
        super();

        this.content.append("!");
    }
}