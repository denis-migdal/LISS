import template, { HTML }   from "@LISS/src/utils/parsers/template";
import style   , {CSS}      from "@LISS/src/utils/parsers/style";
import { Cstr } from "../utils/types";

type STYLE = CSS | CSS[];
type SHADOW_MODE = "open"|"closed"|null;

export type ContentGenerator_Opts = {
    html?: HTML,
    css ?: STYLE
}
// TODO Ressource<>
// import { isRessourceReady, Ressource, waitRessource } from "@LISS/src/utils/network/ressource"
// + readyness

const sharedCSS = new CSSStyleSheet(); // TODO: static prop ?

export class ContentGenerator {

    // TODO: for now we assume this is ready... (cf Ressource)
    constructor({html, css}: ContentGenerator_Opts) {
        this.prepare(html, css);
    }

    /** init content :
        - createContent : build the HTML
        - fillContent   : replace the HTML (uses createContent)
        - initContent   : initialize DOM (create shadow root + uses fillContent + CSS)
    **/

    initContent(target: HTMLElement, mode: SHADOW_MODE) {

        let content: ShadowRoot|HTMLElement = target;
        if( mode !== null) {
            content = target.attachShadow({mode});
            content.adoptedStyleSheets.push(sharedCSS, ...this.stylesheets);
        }
        
        this.fillContent(content);

        return content;
    }

    fillContent(target: ShadowRoot|HTMLElement|DocumentFragment) {
        
        if( this.template !== null)
            target.replaceChildren( this.createContent() );

        //TODO...
        customElements.upgrade(target);
    }

    createContent() {
        return this.template!.cloneNode(true);
    }

    /** process ressources **/
    
    protected stylesheets: CSSStyleSheet[]       = [];
    protected template   : DocumentFragment|null = null;

    protected prepare(html: HTML|undefined, css: STYLE|undefined) {
        if( html !== undefined )
            this.prepareTemplate(html);
        if( css  !== undefined )
            this.prepareStyle   (css);
    }

    protected prepareTemplate(html: HTML) {
        this.template = template(html);
    }
    protected prepareStyle(css: STYLE) {

        if( ! Array.isArray(css) )
            css = [css];

        this.stylesheets = css.map(e => style(e) );
    }
}

type WithContent_Opts<G extends typeof ContentGenerator> = {
    generator?: G,
    mode     ?: SHADOW_MODE,
} & NoInfer<ConstructorParameters<G>[0]>;

export default function WithContent<T extends HTMLElement, G extends typeof ContentGenerator>(base : Cstr<T>, {
                                        generator = ContentGenerator as G,
                                        mode      = "open",
                                        ...generator_opts
                                    }: WithContent_Opts<G> = {}) {

    // @ts-ignore
    const gen = new generator(generator_opts);

    // @ts-ignore
    return class LISSContent extends base {

        protected generator = gen;

        readonly content  : ShadowRoot|HTMLElement = gen.initContent(this, mode);
    }
}