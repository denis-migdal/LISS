import LISS from "V3";
import {hl} from "pages/V3/skeleton/components/hl";

// @ts-ignore
import css  from "!!raw-loader!./scripts.css";
// @ts-ignore
import theme from "!!raw-loader!pages/V3/skeleton/components/theme/Tomorrow.css";
import { whenDOMContentLoaded } from "V2/utils";
import createElement from "V3/utils/createElement";


export class Scripts extends LISS({
    css: [css, theme]
}) {

    constructor() {
        super();

        console.warn("!!", this.host);

        let code = this.host.textContent!;
        const lang = this.host.getAttribute("code-lang")!;

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
            return `__${replaced.length-1}__`
        });

        if(lang === "html") {
            code = code.replace("<xbody>", "</body>");
            code = code.replace("<xscript>", "</script>");
        }

        code = hl(code, lang);

        code = code.replaceAll(/__([\d]*)__/g, (_, match) => {

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

    const code = createElement("code-script");

    code.setAttribute("code-lang", script.getAttribute("type")!.slice(2));
    code.textContent = script.textContent;

    document.adoptNode(code);
    customElements.upgrade(code);

    console.warn("adopted+upgrade");

    script.replaceWith(code);

}