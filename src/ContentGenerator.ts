import { getSharedCSS } from "./LISSHost";
import { LHost, ShadowCfg } from "./types";
import { _element2tagname, isDOMContentLoaded, isShadowSupported, waitDOMContentLoaded } from "./utils";

type HTML = DocumentFragment|HTMLElement|string;
type CSS  = string|CSSStyleSheet|HTMLStyleElement;

export type ContentGenerator_Opts = {
    html   ?: DocumentFragment|HTMLElement|string,
    css    ?: CSS | readonly CSS[],
    shadow ?: ShadowCfg|null
}

export type ContentGeneratorCstr = { new(opts: ContentGenerator_Opts): ContentGenerator };

const alreadyDeclaredCSS = new Set();
const sharedCSS = getSharedCSS(); // from LISSHost...

export default class ContentGenerator {

    #stylesheets: CSSStyleSheet[];
    #template   : HTMLTemplateElement;
    #shadow     : ShadowCfg|null;

    constructor({
        html,
        css    = [],
        shadow = null,
    }: ContentGenerator_Opts = {}) {

        this.#shadow   = shadow;
        this.#template = this.prepareHTML(html);
    
        this.#stylesheets = this.prepareCSS(css);

        this.#isReady   = isDOMContentLoaded();
        this.#whenReady = waitDOMContentLoaded();

        //TODO: other deps...
    }

    #whenReady: Promise<unknown>;
    #isReady  : boolean = false;

    get isReady() {
        return this.#isReady;
    }

    async whenReady() {

        if( this.#isReady )
            return;

        return await this.#whenReady;
        //TODO: deps.
        //TODO: CSS/HTML resources...

        // if( _content instanceof Response ) // from a fetch...
        // _content = await _content.text();
        // + cf at the end...
    }

    generate<Host extends LHost>(host: Host): HTMLElement|ShadowRoot {

        //TODO: wait parents/children depending on option...     

        const target = this.initShadow(host);

        this.injectCSS(target, this.#stylesheets);

        const content = this.#template.content.cloneNode(true);
        if( host.shadowMode !== ShadowCfg.NONE || target.childNodes.length === 0 )
            target.replaceChildren(content);

        if( target instanceof ShadowRoot && target.childNodes.length === 0)
			target.append( document.createElement('slot') );

        customElements.upgrade(host);

        return target;
    }

    protected initShadow<Host extends LHost>(host: Host) {

        const canHaveShadow = isShadowSupported(host);
        if( this.#shadow !== null && this.#shadow !== ShadowCfg.NONE && ! canHaveShadow )
            throw new Error(`Host element ${_element2tagname(host)} does not support ShadowRoot`);

        let mode = this.#shadow;
        if( mode === null )
            mode = canHaveShadow ? ShadowCfg.SEMIOPEN : ShadowCfg.NONE;

        host.shadowMode = mode;

        if( mode === ShadowCfg.SEMIOPEN)
            mode = ShadowCfg.OPEN; // TODO: set to X.

        let target: Host|ShadowRoot = host;
        if( mode !== ShadowCfg.NONE)
            target = host.attachShadow({mode});

        return target;
    }

    protected prepareCSS(css: CSS|readonly CSS[]) {
        if( ! Array.isArray(css) )
            css = [css];

        return css.map(e => this.processCSS(e) );
    }

    protected processCSS(css: CSS) {

        if(css instanceof CSSStyleSheet)
            return css;
        if( css instanceof HTMLStyleElement)
            return css.sheet!;
    
        if( typeof css === "string" ) {
            let style = new CSSStyleSheet();
            style.replaceSync(css); // replace() if issues
            return style;
        }
    
        throw new Error("Should not occur");
    }

    protected prepareHTML(html?: HTML) {
    
        const template = document.createElement('template');

        if(html === undefined)
            return template;

        // str2html
        if(typeof html === 'string') {
            const str = html.trim();

            template.innerHTML = str;
            return template;
        }

        if( html instanceof HTMLElement )
            html = html.cloneNode(true) as HTMLElement;

        template.append(html);
        return template;
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

// idem HTML...
/* if( c instanceof Promise || c instanceof Response) {

        all_deps.push( (async () => {

            c = await c;
            if( c instanceof Response )
                c = await c.text();

            stylesheets[idx] = process_css(c);

        })());

        return null as unknown as CSSStyleSheet;
    }
*/