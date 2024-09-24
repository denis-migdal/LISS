import { HTML_Source, LifeCycle, LISS_Opts, ShadowCfg } from "types";
import { _element2tagname, isShadowSupported } from "utils";

let __cstr_host  : any = null;

export function setCstrHost(_: any) {
	__cstr_host = _;
}

export function LISS<Opts extends LISS_Opts>({

    // JS Base
    extends: _extends = Object, /* extends is a JS reserved keyword. */
    params = {},
    // non-generic
    deps   = [],
    life_cycle =  LifeCycle.DEFAULT,

    // HTML Base
    host  = HTMLElement,
	observedAttributes = [], // for vanilla compat.
    attrs = observedAttributes,
    // non-generic
    content,
    css,
    shadow = isShadowSupported(host) ? ShadowCfg.CLOSE : ShadowCfg.NONE
}: Opts) {

    if( shadow !== ShadowCfg.OPEN && ! isShadowSupported(host) )
        throw new Error(`Host element ${_element2tagname(host)} does not support ShadowRoot`);

    const all_deps = [...deps];

    // content processing
    if( content instanceof Promise || content instanceof Response ) {
        
		let _content: HTML_Source|undefined = content;
		content = null as unknown as string;

        all_deps.push( (async () => {

            _content = await _content;
            if( _content instanceof Response ) // from a fetch...
				_content = await _content.text();

            LISSBase.LISSCfg.content = process_content(_content);
        })() );

    } else {
		content = process_content(content);
	}

	// CSS processing
	let stylesheets: CSSStyleSheet[] = [];
	if( css !== undefined ) {

		if( ! Array.isArray(css) )
			css = [css];

		stylesheets = css.map( (c, idx) => {

			if( c instanceof Promise || c instanceof Response) {

				all_deps.push( (async () => {

					c = await c;
					if( c instanceof Response )
						c = await c.text();

					stylesheets[idx] = process_css(c);

				})());

				return null as unknown as CSSStyleSheet;
			}

			return process_css(c);
		});
	}

	type LISSHost<T> = any; //TODO...
	type LHost = LISSHost<LISSBase>; //<- config instead of LISSBase ?

	// @ts-ignore
	class LISSBase extends _extends {

		readonly #host: any; // prevents issue #1...

		// LISS Configs
		static readonly LISSCfg = {
			host,
			deps,
			attrs,
			params,
			content,
			stylesheets,
			shadow,
		};

		constructor() {

			super();

			// h4ck, okay because JS is monothreaded.
			if( __cstr_host === null )
				throw new Error("Please do not directly call this constructor");
			this.#host = __cstr_host;
			__cstr_host = null;
		}

		public get host(): LISS_Opts["host"] {
			return this.#host;
		}
		protected get content() {
			return (this.#host as LHost).content!;
		}

		// attrs
		protected get attrs() {
			return (this.#host as LHost).attrs;
		}
		protected setAttrDefault( attr: LISS_Opts["attrs"], value: string|null) {
			return (this.#host as LHost).setAttrDefault(attr, value);
		}
		protected onAttrChanged(_name: string,
			_oldValue: string,
			_newValue: string): void|false {}

		// for vanilla compat.
		protected get observedAttributes() {
			return this.attrs;
		}
		protected attributeChangedCallback(...args: [string, string, string]) {
			this.onAttrChanged(...args);
		}

		// parameters
		public get params(): Readonly<LISS_Opts["params"]> {
			return (this.#host as LHost).params;
		}
		public updateParams(params: Partial<LISS_Opts["params"]>) {
			Object.assign( (this.#host as LHost).params, params );
		}

		// DOM
		public get isInDOM() {
			return (this.#host as LHost).isInDOM;
		}
		protected onDOMConnected() {
			this.connectedCallback();
		}
		protected onDOMDisconnected() {
			this.disconnectedCallback();
		}

		// for vanilla compat
		protected connectedCallback() {}
		protected disconnectedCallback() {}
		public get isConnected() {
			return this.isInDOM;
		}
	}

	return LISSBase;    
}

function process_css(css: string|CSSStyleSheet|HTMLStyleElement) {

	if(css instanceof CSSStyleSheet)
		return css;
	if( css instanceof HTMLStyleElement)
		return css.sheet!;

	let style = new CSSStyleSheet();
	if( typeof css === "string" ) {
		style.replaceSync(css); // replace() if issues
		return style;
	}

	throw new Error("Should not occurs");
}

function process_content(content: string|HTMLTemplateElement|undefined) {

    if(content === undefined)
        return undefined;

    if(content instanceof HTMLTemplateElement)
        content = content.innerHTML;

    content = content.trim();
    if( content.length === 0 )
        return undefined;

    return content;
}