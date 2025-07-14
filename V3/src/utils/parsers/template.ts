import { isTemplateString, Template } from "./types";

export type HTML  = DocumentFragment|HTMLElement|string;

export default function template( ...raw:Template<HTML>): DocumentFragment {

    let elem: HTML = raw[0] as any;

    if( isTemplateString(raw) ) {
        
        const str = raw[0];

        let string = str[0];
        for(let i = 1; i < raw.length; ++i) {
            string += raw[i];
            string += str[i];
        }

        elem = string;
    }

    if( elem instanceof DocumentFragment )
        return elem.cloneNode(true) as DocumentFragment;

    // must use template as DocumentFragment doesn't have .innerHTML
    let template = document.createElement('template');

    if(typeof elem === 'string')
        template.innerHTML = elem.trim();
    else {
        if( elem instanceof HTMLElement)
            // prevents issue if elem is latter updated.
            elem = elem.cloneNode(true) as HTMLElement;
        
        template.append( elem );
    }

    //if( template.content.childNodes.length === 1 && template.content.firstChild!.nodeType !== Node.TEXT_NODE)
    //  return template.content.firstChild! as unknown as T;
    
    return template.content!;
}