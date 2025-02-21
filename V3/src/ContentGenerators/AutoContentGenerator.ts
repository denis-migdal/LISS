import { HTML } from "src/utils/parsers/template";
import ContentGenerator from "./ContentGenerator";
import encodeHTML from "src/utils/encode";

const regex = /\$\{(.+?)\}/g;

export default class AutoContentGenerator extends ContentGenerator {

    protected override prepareTemplate(html: HTML) {
        
        this.data = null;

        if( typeof html === 'string' ) {
            this.data = html;
            return;
            /*
            html = html.replaceAll(/\$\{([\w]+)\}/g, (_, name: string) => {
                return `<liss value="${name}"></liss>`;
            });*/

            //TODO: ${} in attr
                // - detect start ${ + end }
                // - register elem + attr name
                // - replace. 
        }
        
        super.prepareTemplate(html);
    }

    override fillContent(shadow: ShadowRoot) {
        
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        if( this.data !== null) {
            const str = (this.data as string).replace(regex, (_, match) => {
                const value = shadow.host.getAttribute(match);
                if( value === null)
                    return ''; 
                return encodeHTML(value);
            });

            super.prepareTemplate(str);
        }

        super.fillContent(shadow);

        /*
        // html magic values could be optimized...
        const values = content.querySelectorAll('liss[value]');
        for(let value of values)
            value.textContent = host.getAttribute(value.getAttribute('value')!)
        */
    }
}