import { Template } from "./types";

export type CSS   = string|CSSStyleSheet|HTMLStyleElement;

export default function style(...raw: Template<CSS>): CSSStyleSheet {

    let elem = raw[0];

    if( elem instanceof CSSStyleSheet )
        return elem;
    if( elem instanceof HTMLStyleElement)
        return elem.sheet!;

    if( Array.isArray(elem) ) {
        
        const str = raw[0] as TemplateStringsArray;

        let string = str[0];
        for(let i = 1; i < raw.length; ++i) {
            string += raw[i];
            string += str[i];
        }

        elem = string;
    }

    if( typeof elem !== "string") {
        console.warn(elem);
        console.trace();
        throw new Error("Should not occurs");
    }

    const style = new CSSStyleSheet();
    style.replaceSync(elem);
    return style;
}