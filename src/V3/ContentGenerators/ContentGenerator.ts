import { isRessourceReady, Ressource, waitRessource } from "V3/utils/network/ressource";
import { ShadowCfg } from "V2/types";
import { isDOMContentLoaded, whenDOMContentLoaded } from "V2/utils";
import template, { HTML } from "V3/utils/parsers/template";
import style   , {CSS}    from "V3/utils/parsers/style";

type STYLE = CSS | readonly CSS[];

export type ContentGenerator_Opts = {
    html   ?: Ressource<HTML>,
    css    ?: Ressource<STYLE>,
    shadow ?: ShadowCfg|null
}

const sharedCSS = new CSSStyleSheet();
//const sharedCSS = getSharedCSS(); // from LISSHost...

export default class ContentGenerator {

    protected data: any;

    #shadow     : ShadowCfg|null;

    constructor({
        html,
        css    = [],
        shadow = null,
    }: ContentGenerator_Opts = {}) {

        this.#shadow   = shadow;

        const isReady = isRessourceReady<HTML> (html)
                     && isRessourceReady<STYLE>(css)
                     && isDOMContentLoaded();

        if( isReady )
            this.prepare(html, css);

        const whenReady: Promise<[HTML|undefined, STYLE|undefined, unknown]> = Promise.all([
            waitRessource<HTML |undefined>(html),
            waitRessource<STYLE|undefined>(css),
            whenDOMContentLoaded()
        ]);

        whenReady.then( (args) => this.prepare(args[0], args[1]) );

        this.isReady   = isReady;
        this.whenReady = whenReady;
    }

    /** ready ***/

    readonly whenReady: Promise<unknown>;
    readonly isReady  : boolean = false;

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

    /*** Generate contents ***/

    initContent(target: HTMLElement, mode:"open"|"closed"|null) {

        let content: ShadowRoot|HTMLElement = target;
        if( mode !== null) {
            content = target.attachShadow({mode});
            content.adoptedStyleSheets.push(sharedCSS, ...this.stylesheets);
        }
        //TODO: CSS for no shadow ???
        
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
}