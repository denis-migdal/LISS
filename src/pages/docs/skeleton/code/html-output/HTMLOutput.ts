import { whenDOMContentLoaded } from "../../../../../V2/utils";
import LISS from "../../../../../index";


export class HTMLOutput extends LISS() {

    constructor() {
        super();
        this.content.innerHTML = this.host.textContent!;
    }
}

LISS.define("html-output", HTMLOutput);

await whenDOMContentLoaded;

for(let script of document.querySelectorAll('script[type="html-output"]') ) {

    const code = new HTMLOutput.Host();
    code.textContent = script.textContent;

    script.replaceWith(code);
}