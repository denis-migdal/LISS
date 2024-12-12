import LISS from "../../../../../index";
import {hl} from "../hl";

// @ts-ignore
import css  from "!!raw-loader!./scripts.css";
// @ts-ignore
import theme from "!!raw-loader!../themes/Tomorrow.css";
import { whenDOMContentLoaded } from "utils";


export class Scripts extends LISS({
    css: [css, theme]
}) {

    constructor() {
        super();

        let code = this.host.textContent!;

        if(code[0] === '\n') {

            this.host.classList.toggle("block", true);


            const offset = code.search(/[\S]/) - 1;
            const indent = code.slice(1, offset);

            code = code.replaceAll("\n" + indent, "\n");

            const end = code.lastIndexOf('\n');
            code = code.slice(1, end);
        }

        // TODO: get position then reinject ?
        const replaced: string[] = [];
        code = code.replaceAll(/\<h\>(.*?)\<\/h\>/g, (_, match) => {
            replaced.push(match);
            return ` __${replaced.length-1}__ `
        });

        code = hl(code, 
            this.host.getAttribute("lang")!);

        code = code.replaceAll(/ __([\d]*)__ /g, (_, match) => {

            let content = replaced[+match];
            content = content.replaceAll(/(\$[\w_]*)/g, (_, match) => {
                return `<var>${match}</var>`
            });

            return `<h>${content}</h>`;
        });

        this.content.innerHTML = code;
    }

}

LISS.define("code-script", Scripts);

await whenDOMContentLoaded;

for(let script of document.querySelectorAll('script[type^="c-"]') ) {

    const code = new Scripts.Host();

    code.setAttribute("lang", script.getAttribute("type")!.slice(2));
    code.textContent = script.textContent;

    script.replaceWith(code);

}