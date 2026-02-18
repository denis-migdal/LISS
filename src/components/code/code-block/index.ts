import DOMContentLoaded from "@LISS/utils/FutureEvents/DOMContentLoaded";
import define from "@LISS/impl/define";
import { hl } from "../hl";

import { LISSBase } from "@LISS/impl/extensions";
import style from "@LISS/utils/parsers/style";
import template from "@LISS/utils/parsers/template";

export function unindent(code: string) {
    const offset = code.search(/[\S]/);
    const indent = code.slice(1, offset);

    code = code.replaceAll("\n" + indent, "\n");

    const end = code.lastIndexOf('\n');
    code = code.slice(1, end);

    return code;
}

export function keepSpaces(code: string) {
    code = code.replaceAll('\n', '<br/>\n')
               .replaceAll('  ', '&nbsp;&nbsp;')
               .replaceAll('> ', '>&nbsp;')
               .replaceAll(' <', '&nbsp;<')
               .replaceAll('\n ', '\n&nbsp;');

    return code;
}

export function raw2html(code: string, codeLang: string) {

    const replaced: string[] = [];
    code = code.replaceAll(/\<h\>(.*?)\<\/h\>/g, (_, match) => {
        replaced.push(match);
        return `__${replaced.length-1}__`
    });

    code = hl(code, codeLang);

    code = code.replaceAll(/__([\d]*)__/g, (_, match) => {

        let content = replaced[+match];
        content = content.replaceAll(/(\$[\w_]*)/g, (_, match) => {
            return `<var>${match}</var>`
        });

        return `<h>${content}</h>`;
    });

    return keepSpaces(code); // due to stupid FF bug.
}

const CSS   = require("!!raw-loader!./index.css").default;
const THEME = require("!!raw-loader!../Tomorrow.css").default;
const HTML  = "";

export default class CodeBlock extends LISSBase
                                      .WithContent( template(HTML) )
                                      .WithStyle(style(CSS), style(THEME) ) {

    constructor(code?: string, codeLang?: string) {
        super();

        if( code === undefined )
            code = this.host.textContent!;
        else {
            this.host.textContent = code;
        }

        codeLang ??= this.host.getAttribute("code-lang") ?? "text";

        if(code[0] === '\n') {
            this.host.classList.toggle("block", true);
            code = unindent(code);
        }

        if(codeLang === "html") {
            code = code.replace("<xbody>", "</body>");
            code = code.replace("<xscript>", "</script>");
        }

        this.content.innerHTML = raw2html(code, codeLang);
    }
}

define(CodeBlock);

DOMContentLoaded.then( () => {

    for(let script of document.querySelectorAll('script[type^="c-"]') ) {

        const code = new CodeBlock(script.textContent!,
                                script.getAttribute("type")!.slice(2))

        const attrs = script.attributes;
        for(let attr of attrs)
            code.setAttribute(attr.name, attr.value);

        script.replaceWith(code);
    }
});