//import LISS from "LISS";

const html = await require("./index.html");
const css  = await require("./index.css" );

export default class Klass extends LISS.v3({
    html, css
}) {
    constructor() {
        super();

        this.content.append("!");
    }
}