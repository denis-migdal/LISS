import LISS from "@LISS/src";
import {hl} from "../hl";

import whenDOMContentLoaded from "@LISS/src/utils/DOM/whenDOMContentLoaded";

// @ts-ignore
import css  from "!!raw-loader!./index.css";
// @ts-ignore
import theme from "!!raw-loader!../Tomorrow.css";


//TODO: Signal<T> for value...
export class Script extends LISS({
    css: [css, theme]
})<string> {

    #code    : string;
    #codeLang: string;
    
    constructor(code?: string, codeLang?: string) {
        super();

        this.#code     = code     ?? this.host.textContent!;
        this.#codeLang = codeLang ?? this.host.getAttribute("code-lang")!;
    }

    protected override onUpdate() {

        let code   = this.#code;
        const lang = this.#codeLang;

        if(code[0] === '\n') {

            this.host.classList.toggle("block", true);

            const offset = code.search(/[\S]/);
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

LISS.define("code-script", Script);

whenDOMContentLoaded().then( () => {

    for(let script of document.querySelectorAll('script[type^="c-"]') ) {

        const code = new Script(script.textContent!,
                                script.getAttribute("type")!.slice(2))

        script.replaceWith(code);
    }
});