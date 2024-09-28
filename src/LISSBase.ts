import { buildLISSHost } from "LISSHost";
import { Class, Constructor, CSS_Source, HTML_Source, LifeCycle, LISS_Opts, ShadowCfg } from "./types";
import { _element2tagname, isShadowSupported } from "./utils";
import { LISSState } from "state";

let __cstr_host  : any = null;

export function setCstrHost(_: any) {
	__cstr_host = _;
}

export class ILISS {}

export default LISS as typeof LISS & ILISS;

export function LISS<
	ExtendsCtr extends Constructor<Class>  = Constructor<Class>,
	Params     extends Record<string, any> = {}, //Record<string, unknown>, /* RO ? */
	// HTML Base
	HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>,
	Attrs      extends string                   = never, //string,
>({

    // JS Base
    extends: _extends = Object as unknown as ExtendsCtr, /* extends is a JS reserved keyword. */
    params            = {}     as unknown as Params,
    // non-generic
    deps   = [],
    life_cycle =  LifeCycle.DEFAULT,

    // HTML Base
    host  = HTMLElement as unknown as HostCstr,
	observedAttributes = [], // for vanilla compat.
    attrs = observedAttributes,
    // non-generic
    content,
    css,
    shadow = isShadowSupported(host) ? ShadowCfg.CLOSE : ShadowCfg.NONE
}: Partial<LISS_Opts<ExtendsCtr, Params, HostCstr, Attrs>> = {}) {

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
			// @ts-ignore : todo: LISSOpts => should not be a generic ?
			css = [css];

		// @ts-ignore
		stylesheets = css.map( (c: CSS_Source, idx: number) => {

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

	class LISSBase extends _extends {

		constructor(...args: any[]) { // required by TS, we don't use it...

			super(...args);

			// h4ck, okay because JS is monothreaded.
			if( __cstr_host === null )
				__cstr_host = new (this.constructor as any).Host({}, this);
			this.#host = __cstr_host;
			__cstr_host = null;
		}

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

		get state(): LISSState {
			return this.#host.state;
		}

		public get host(): InstanceType<HostCstr> {
			return this.#host;
		}
		//TODO: get the real type ?
		protected get content(): InstanceType<HostCstr>|ShadowRoot {
			return (this.#host as LHost).content!;
		}

		// attrs
		protected get attrs(): Record<Attrs, string|null> {
			return (this.#host as LHost).attrs;
		}
		protected setAttrDefault( attr: Attrs, value: string|null) {
			return (this.#host as LHost).setAttrDefault(attr, value);
		}
		protected onAttrChanged(_name: Attrs,
			_oldValue: string,
			_newValue: string): void|false {}

		// for vanilla compat.
		protected get observedAttributes() {
			return this.attrs;
		}
		protected attributeChangedCallback(...args: [Attrs, string, string]) {
			this.onAttrChanged(...args);
		}

		// parameters
		public get params(): Readonly<Params> {
			return (this.#host as LHost).params;
		}
		public updateParams(params: Partial<Params>) {
			Object.assign( (this.#host as LHost).params, params );
		}

		// DOM
		public get isInDOM(): boolean {
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

		private static _Host: LISSHost<LISSBase>;

		static get Host() {
			if( this._Host === undefined)
				this._Host = buildLISSHost(this);
			return this._Host;
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