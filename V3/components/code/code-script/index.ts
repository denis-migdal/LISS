import {LISS, WithBare, WithContent} from "@LISS/src/extensions";
import DOMContentLoaded from "@LISS/src/utils/FutureEvents/DOMContentLoaded";
import define from "@LISS/src/define";
import { hl } from "../hl";

// @ts-ignore
import css   from "!!raw-loader!./index.css";
// @ts-ignore
import theme from "!!raw-loader!../Tomorrow.css";

export function unindent(code: string) {
    const offset = code.search(/[\S]/);
    const indent = code.slice(1, offset);

    code = code.replaceAll("\n" + indent, "\n");

    const end = code.lastIndexOf('\n');
    code = code.slice(1, end);

    return code;
}

export function keepSpaces(code: string) {
    code = code.replaceAll('\n', '<br/>\n');
    code = code.replaceAll('  ', '&nbsp;&nbsp;');

    return code;
}

export default class Script extends LISS({ css: [theme, css] },
                            WithBare, WithContent) {

    constructor(code?: string, codeLang?: string) {
        super();

        code     ??= this.host.textContent!;
        codeLang ??= this.host.getAttribute("code-lang") ?? "text";

        if(code[0] === '\n') {
            this.host.classList.toggle("block", true);

            code = unindent(code);
        }

        // ...
        const replaced: string[] = [];
        code = code.replaceAll(/\<h\>(.*?)\<\/h\>/g, (_, match) => {
            replaced.push(match);
            return `__${replaced.length-1}__`
        });
    
        if(codeLang === "html") {
            code = code.replace("<xbody>", "</body>");
            code = code.replace("<xscript>", "</script>");
        }

        code = hl(code, codeLang);

        code = code.replaceAll(/__([\d]*)__/g, (_, match) => {

            let content = replaced[+match];
            content = content.replaceAll(/(\$[\w_]*)/g, (_, match) => {
                return `<var>${match}</var>`
            });

            return `<h>${content}</h>`;
        });

        this.content.innerHTML = keepSpaces(code); // due to stupid FF bug.
        // use a div for FF ?
    }
}

define('code-script', Script);


DOMContentLoaded.then( () => {

    for(let script of document.querySelectorAll('script[type^="c-"]') ) {

        const code = new Script(script.textContent!,
                                script.getAttribute("type")!.slice(2))

        script.replaceWith(code);
    }
});