import { isTemplateString, Template } from "./types";

const template = document.createElement("template");
const df = template.content;

export default function html<T extends HTMLElement>(...raw: Template<string>): T {
    
    let elem: string = raw[0] as any;

    if( isTemplateString(raw) ) {
        
        const str = raw[0];

        let string = str[0];
        for(let i = 1; i < raw.length; ++i) {
            string += raw[i];
            string += str[i];
        }

        elem = string;
    }

    template.innerHTML = elem;

    if( df.childNodes.length !== 1)
        throw new Error("Error");

    return df.firstChild as T;
}