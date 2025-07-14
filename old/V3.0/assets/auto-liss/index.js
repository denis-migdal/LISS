export default class extends LISS({
    html: require("./index.html"),
    css : require("./index.css" ),
//  content_generator: LISS.generators.Auto
}) {
    constructor() {
        super();

        this.content.append("!");
    }
}