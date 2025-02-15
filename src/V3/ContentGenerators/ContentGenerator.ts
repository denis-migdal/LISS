import { isRessourceReady, Ressource, waitRessource } from "V3/utils/ressource";
import { getSharedCSS } from "V2/LISSHost";
import { LHost, ShadowCfg } from "V2/types";
import { _element2tagname, isDOMContentLoaded, isShadowSupported, whenDOMContentLoaded } from "V2/utils";
import template, { HTML } from "V3/utils/template";
import style   , {CSS}    from "V3/utils/style";

type STYLE = CSS | readonly CSS[];

export type ContentGenerator_Opts = {
    html   ?: Ressource<HTML>,
    css    ?: Ressource<STYLE>,
    shadow ?: ShadowCfg|null
}

const alreadyDeclaredCSS = new Set();
const sharedCSS = getSharedCSS(); // from LISSHost...

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
            this.prepareHTML(html);
        if( css  !== undefined )
            this.prepareCSS (css);
    }

    protected prepareHTML(html: HTML) {
        this.template = template(html);
    }
    protected prepareCSS(css: STYLE) {

        if( ! Array.isArray(css) )
            css = [css];

        this.stylesheets = css.map(e => style(e) );
    }

    /*** Generate contents ***/

    // fill / generate / init / inject

    fillContent(shadow: ShadowRoot) {
        this.injectCSS(shadow, this.stylesheets);

        if( this.template !== null)
            shadow.append( this.template.cloneNode(true) );

        customElements.upgrade(shadow);
    }

    generate<Host extends LHost>(host: Host): HTMLElement|ShadowRoot {

        //TODO: wait parents/children depending on option...     

        const target = this.initShadow(host);

        this.injectCSS(target, this.stylesheets);

        const content = this.template!.cloneNode(true);
        if( host.shadowMode !== ShadowCfg.NONE || target.childNodes.length === 0 )
            target.replaceChildren(content);

        //if( target instanceof ShadowRoot && target.childNodes.length === 0)
		//	target.append( document.createElement('slot') );

        customElements.upgrade(host);

        return target;
    }

    protected initShadow<Host extends LHost>(host: Host) {

        const canHaveShadow = isShadowSupported(host);
        if( this.#shadow !== null && this.#shadow !== ShadowCfg.NONE && ! canHaveShadow )
            throw new Error(`Host element ${_element2tagname(host)} does not support ShadowRoot`);

        let mode = this.#shadow;
        if( mode === null )
            mode = canHaveShadow ? ShadowCfg.OPEN : ShadowCfg.NONE;

        host.shadowMode = mode;

        let target: Host|ShadowRoot = host;
        if( mode !== ShadowCfg.NONE)
            target = host.attachShadow({mode});

        return target;
    }

    injectCSS<Host extends LHost>(target: ShadowRoot|Host, stylesheets: any[]) {

        if( target instanceof ShadowRoot ) {
            target.adoptedStyleSheets.push(sharedCSS, ...stylesheets);
            return;
        }

        const cssselector = target.CSSSelector; //TODO...

        if( alreadyDeclaredCSS.has(cssselector) )
            return;
            
        let style = document.createElement('style');
        style.setAttribute('for', cssselector);

        let html_stylesheets = "";
        for(let style of stylesheets)
            for(let rule of style.cssRules)
                html_stylesheets += rule.cssText + '\n';

        style.innerHTML = html_stylesheets.replace(':host', `:is(${cssselector})`);

        document.head.append(style);
        alreadyDeclaredCSS.add(cssselector);
    }
}