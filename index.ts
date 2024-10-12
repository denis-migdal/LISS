// ================================================
// =============== LISS exported types ============
// ================================================

/*
type S<A,B> = {
	A: A,
	B: B
};
type LH = S<unknown,unknown>;

type inferA<T> = T extends S<infer A, any> ? A : never;

function foo<T extends LH>(t: T): inferA<T> {
	return t.A as inferA<T>;
}

let X = {
	A: 32,
	B: "str"
};

let c = foo(X);
*/

export type CSS_Resource = string|Response|HTMLStyleElement|CSSStyleSheet;
export type CSS_Source   = CSS_Resource | Promise<CSS_Resource>;

export type HTML_Resource = string|Response|HTMLTemplateElement;
export type HTML_Source   = HTML_Resource | Promise<HTML_Resource>;

export type LISSOptions<Extends    extends Class,
						Host       extends HTMLElement,
						Attrs      extends string,
						Parameters extends Record<string, any>> = {

	extends?: Constructor<Extends>,
	host   ?: Constructor<Host>,

	dependencies?: readonly Promise<any>[],
	attributes  ?: readonly Attrs[],
	params      ?: Readonly<Parameters>,

	content?: HTML_Source,
	css    ?:  CSS_Source | readonly CSS_Source[],
	shadow ?:  ShadowCfg,
};

export enum ShadowCfg {
	NONE = 'none',
	OPEN = 'open', 
	CLOSE= 'closed'
};

// ================================================
// =============== LISS Class =====================
// ================================================

let __cstr_host  : any = null;

type Constructor<T> = new () => T;
interface Class {}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
	null, 'article', 'aside', 'blockquote', 'body', 'div',
	'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
	'nav', 'p', 'section', 'span'
	
];
function _canHasShadow(tag: typeof HTMLElement) {
	return CAN_HAVE_SHADOW.includes( _element2tagname(tag) );
}

type Resource = URL|Response;


export default function LISS<Extends    extends Class              = Class,
							 Host       extends HTMLElement        = HTMLElement,
							 Attrs      extends string             = never,
							 Parameters extends Record<string,any> = {}>({
								extends     : p_extends,
								host        : p_host,
								dependencies: p_deps,
							    attributes  : p_attrs,
							    params,
								content,
								css,
								shadow      : p_shadow,
							}: LISSOptions<Extends, Host, Attrs, Parameters> = {}) {

	//TODO merge prop if extends LISS...

	const host        = p_host    ?? HTMLElement as Constructor<Host>;
	const _extends    = p_extends ?? Object      as unknown as Constructor<Extends>;
	const attributes  = p_attrs   ?? [];
	const dependencies= p_deps    ? [...p_deps] : [];
	const canHasShadow= _canHasShadow(host);
	const shadow      = p_shadow  ?? (canHasShadow ? ShadowCfg.CLOSE : ShadowCfg.NONE);

	if( ! canHasShadow && shadow !== ShadowCfg.NONE)
		throw new Error(`Host element ${_element2tagname(host)} does not support ShadowRoot`);

	// CONTENT processing
	if( content !== undefined ) {

		dependencies.push( ( async () => {

			content = await content;

			if(content instanceof HTMLTemplateElement)
			content = content.innerHTML;

			if( typeof content === "string") {

				content = content.trim(); // Never return a text node of whitespace as the result
				if(content === '')
					content = undefined;

			}
			if( content instanceof Response )
				content = await content.text();

			return LISSBase.Parameters.content = content;
		})() );
	}

	// CSS processing
	let stylesheets: readonly CSSStyleSheet[] = [];
	if( css !== undefined ) {

		if( ! Array.isArray(css) )
			css = [css as CSS_Source];

		stylesheets = new Array<CSSStyleSheet>(css.length);

		const fetch_css = (async (css: CSS_Source) => {
			css = await css;
			if(css instanceof CSSStyleSheet)
				return css;
			if( css instanceof HTMLStyleElement)
				return css.sheet!;

			let style = new CSSStyleSheet();
			if( typeof css === "string" ) {
				await style.replace(css);
				return style;
			}

			//if( css instanceof Response )
			await style.replace(await css.text());
			return style;
		});

		dependencies.push( ...css.map( async (css, idx) =>  (stylesheets as any)[idx] = await fetch_css(css) ) );
	}

	type LHost = LISSHost<LISSBase>;

	// @ts-ignore
	class LISSBase extends _extends {

		readonly #host: any; // prevents issue #1...

		constructor() {

			super();

			// h4ck, okay because JS is monothreaded.
			if( __cstr_host === null )
				throw new Error("Please do not directly call this constructor");
			this.#host = __cstr_host;
			__cstr_host = null;
		}

		public get host(): Host {
			return this.#host;
		}
		protected get attrs() {
			return (this.#host as LHost).attrs;
		}
		protected setAttrDefault( attr: Attrs, value: string|null) {
			return (this.#host as LHost).setAttrDefault(attr, value);

		}
		public get params(): Readonly<Parameters> {
			return (this.#host as LHost).params;
		}
		public setParam<T extends keyof Parameters>(name: T, value: Parameters[T]) {
			(this.#host as LHost).params[name] = value;
		}
		protected get content() {
			return (this.#host as LHost).content!;
		}

		static readonly Parameters = {
			host,
			dependencies,
			attributes,
			params,
			content,
			stylesheets,
			shadow,
		};

		protected onAttrChanged(_name: string,
								_oldValue: string,
								_newValue: string): void|false {}

		public get isInDOM() {
			return (this.#host as LHost).isInDOM;
		}
		protected onDOMConnected() {}
		protected onDOMDisconnected() {}
	}

	return LISSBase;
}

//TODO: other options...
function extendsLISS<Extends extends Class,
	Host    extends HTMLElement,
	Attrs1   extends string,
	Attrs2   extends string,
	Params  extends Record<string,any>,
	T extends LISSReturnType<Extends, Host, Attrs1, Params>>(Liss: T,
		parameters: {
			shadow      ?: ShadowCfg,
			attributes  ?: readonly Attrs2[],
			dependencies?: readonly Promise<any>[]
		}) {

	const attributes   = [...Liss.Parameters.attributes  , ...parameters.attributes  ??[]];
	const dependencies = [...Liss.Parameters.dependencies, ...parameters.dependencies??[]];

	const params = Object.assign({}, Liss.Parameters, {
		attributes,
		dependencies
	});
	if( parameters.shadow !== undefined)
		params.shadow = parameters.shadow;

	// @ts-ignore : because TS stupid
	class ExtendedLISS extends Liss {
		constructor(...t: any[]) {
			// @ts-ignore : because TS stupid
			super(...t);
		}

		protected override get attrs() {
			return super.attrs as Record<Attrs2|Attrs1, string|null>;
		}

		static override Parameters = params;
	}

	return ExtendedLISS;
}
LISS.extendsLISS = extendsLISS;

// ================================================
// =============== LISS type helpers ==============
// ================================================

type buildLISSHostReturnType<T>  = T extends LISSReturnType<infer Extends extends Class,
															infer Host    extends HTMLElement,
															infer Attrs   extends string,
															infer Params  extends Record<string,any>>
															? ReturnType<typeof buildLISSHost<Extends, Host, Attrs, Params, T>> : never;

export type LISSReturnType<
	Extends extends Class,
	Host    extends HTMLElement,
	Attrs   extends string,
	Params  extends Record<string,any>> = ReturnType<typeof LISS<Extends, Host, Attrs, Params>>;
export type LISSBase<Extends extends Class,
					 Host    extends HTMLElement,
					 Attrs   extends string,
					 Params  extends Record<string,any>> = InstanceType<LISSReturnType<Extends, Host, Attrs, Params>>;
export type LISSHost<LISS extends LISSBase<any,any,any,any> > = InstanceType<buildLISSHostReturnType<Constructor<LISS> & {Parameters: any}>>;

// ================================================
// =============== LISSHost class =================
// ================================================

let id = 0;

function buildLISSHost<Extends extends Class,
					   Host    extends HTMLElement,
					   Attrs   extends string,
					   Params  extends Record<string,any>,
					   T extends LISSReturnType<Extends, Host, Attrs, Params>>(Liss: T, _params: Partial<Params> = {}) {
	const {
		host,
		attributes,
		content,
		stylesheets,
		shadow,
	} = Liss.Parameters;

	const alreadyDeclaredCSS = new Set();

	const GET = Symbol('get');
	const SET = Symbol('set');

	const properties = Object.fromEntries( attributes.map(n => [n, {

		enumerable: true,
		get: function(): string|null      { return (this as unknown as Attributes)[GET](n); },
		set: function(value: string|null) { return (this as unknown as Attributes)[SET](n, value); }
	}]) );

	class Attributes {
        [x: string]: string|null;

        #data     : Record<Attrs, string|null>;
        #defaults : Record<Attrs, string|null>;
        #setter   : (name: Attrs, value: string|null) => void;

        [GET](name: Attrs) {
        	return this.#data[name] ?? this.#defaults[name] ?? null;
        };
        [SET](name: Attrs, value: string|null){
        	return this.#setter(name, value); // required to get a clean object when doing {...attrs}
        }

        constructor(data    : Record<Attrs, string|null>,
					defaults: Record<Attrs, string|null>,
        			setter  : (name: Attrs, value: string|null) => void) {

        	this.#data     = data;
			this.#defaults = defaults;
        	this.#setter = setter;

        	Object.defineProperties(this, properties);
        }
	}

	// @ts-ignore : because TS is stupid.
	class LISSHostBase extends host {

		readonly #params: Params;

		readonly #id = ++id; // for debug

		constructor(params: Partial<Params> = {}) {
			super();
			this.#params = Object.assign({}, Liss.Parameters.params, _params, params);

			this.#waitInit = new Promise( (resolve) => {
				if(this.isInit)
					return resolve(this.#API!);
				this.#resolve = resolve;
			});
		}

		/**** public API *************/

		get isInit() {
			return this.#API !== null;
		}
		initialize(params: Partial<Params> = {}) {

			if( this.isInit )
				throw new Error('Element already initialized!');

			Object.assign(this.#params, params);

			const api = this.init();

			if( this.#isInDOM )
				(api as any).onDOMConnected();

			return api;
		}

		get LISSSync() {
			if( ! this.isInit )
				throw new Error('Accessing API before WebComponent initialization!');
			return this.#API!;
		}
		get LISS() {
			return this.#waitInit;
		}

		/*** init ***/
		#waitInit: Promise<InstanceType<T>>;
		#resolve: ((u: InstanceType<T>) => void) | null = null;
		#API: InstanceType<T> | null = null;

		#isInDOM = false;
		get isInDOM() {
			return this.#isInDOM;
		}

		disconnectedCallback() {
			this.#isInDOM = false;
			(this.#API! as any).onDOMDisconnected();
		}

		connectedCallback() {

			this.#isInDOM = true;
	
			if( ! this.isInit )
				this.init();

			(this.#API! as any).onDOMConnected();
		}

		private init() {
			
			customElements.upgrade(this);
			
			// shadow
			this.#content = this as unknown as Host;
			if( shadow !== 'none') {
				this.#content = this.attachShadow({mode: shadow});

				//@ts-ignore
				this.#content.addEventListener('click', onClickEvent);
				//@ts-ignore
				this.#content.addEventListener('dblclick', onClickEvent);
			}

			// attrs
			for(let obs of attributes!)
				this.#attributes[obs] = this.getAttribute(obs);

			// css
			if( shadow !== 'none')
				(this.#content as ShadowRoot).adoptedStyleSheets.push(sharedCSS);
			if( stylesheets.length ) {

				if( shadow !== 'none')
					(this.#content as ShadowRoot).adoptedStyleSheets.push(...stylesheets);
				else {

					const cssselector = this.CSSSelector;

					// if not yet inserted :
					if( ! alreadyDeclaredCSS.has(cssselector) ) {
						
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
			}

			// content
			if( content !== undefined ) {
				let template_elem = document.createElement('template');
				let str = (content as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
	    		template_elem.innerHTML = str;
	    		this.#content.append(...template_elem.content.childNodes);
	    	}

	    	// build

	    	// h4ck, okay because JS is monothreaded.
			__cstr_host   = this;

	    	let obj = new Liss();

	    	/*if( obj instanceof Promise)
	    		obj = await obj;*/

			this.#API = obj as InstanceType<T>;

			// default slot
			if( this.hasShadow && this.#content.childNodes.length === 0 )
				this.#content.append( document.createElement('slot') );

			if( this.#resolve !== null)
				this.#resolve(this.#API);

			return this.#API;
		}

		get params(): Params {
			return this.#params;
		}
		public setParam<T extends keyof Params>(name: T, value: Params[T]) {
			if( this.isInit )
				return this.#API!.setParam(name, value);

			this.#params[name] = value; // will be given to constructor.
		}


		/*** content ***/
		#content: Host|ShadowRoot|null = null;

		get content() {
			return this.#content;
		}

		getPart(name: string) {
			return this.hasShadow
					? this.#content?.querySelector(`::part(${name})`)
					: this.#content?.querySelector(`[part="${name}"]`);
		}
		getParts(name: string) {
			return this.hasShadow
					? this.#content?.querySelectorAll(`::part(${name})`)
					: this.#content?.querySelectorAll(`[part="${name}"]`);
		}

		protected get hasShadow(): boolean {
			return shadow !== 'none';
		}

		/*** CSS ***/

		get CSSSelector() {

			if(this.hasShadow || ! this.hasAttribute("is") )
				return this.tagName;

			return `${this.tagName}[is="${this.getAttribute("is")}"]`;
		}

		/*** attrs ***/
		#attrs_flag = false;

		#attributes         = {} as Record<Attrs, string|null>;
		#attributesDefaults = {} as Record<Attrs, string|null>;
		#attrs = new Attributes(
			this.#attributes,
			this.#attributesDefaults,
			(name: Attrs, value:string|null) => {

				this.#attributes[name] = value;

				this.#attrs_flag = true; // do not trigger onAttrsChanged.
				if( value === null)
					this.removeAttribute(name);
				else
					this.setAttribute(name, value);
			}
		) as unknown as Record<Attrs, string|null>;

		setAttrDefault(name: Attrs, value: string|null) {
			if( value === null)
				delete this.#attributesDefaults[name];
			else
				this.#attributesDefaults[name] = value;
		}

		get attrs(): Readonly<Record<Attrs, string|null>> {

			return this.#attrs;
		}

		static observedAttributes = attributes;
		attributeChangedCallback(name    : Attrs,
								 oldValue: string,
								 newValue: string) {

			if(this.#attrs_flag) {
				this.#attrs_flag = false;
				return;
			}

			this.#attributes[name] = newValue;
			if( ! this.isInit )
				return;

			if( (this.#API! as any).onAttrChanged(name, oldValue, newValue) === false) {
				this.#attrs[name] = oldValue; // revert the change.
			}
		}
	};

	return LISSHostBase;
}

// ================================================
// =============== LISS define ====================
// ================================================

const _DOMContentLoaded = new Promise<void>( (resolve) => {

	if(document.readyState === "interactive" || document.readyState === "complete")
		return resolve();

	document.addEventListener('DOMContentLoaded', () => {
		resolve();
	}, true);
});

LISS.define = async function<Extends extends Class,
							 Host    extends HTMLElement,
						     Attrs   extends string,
						     Params  extends Record<string,any>,
						   	 T extends LISSReturnType<Extends, Host, Attrs, Params>>(
						   	tagname: string,
							ComponentClass: T,
							{dependencies, params}: {params?: Partial<Params>, dependencies?: readonly Promise<string>[]} = {}) {

	dependencies??=[];
	params      ??= {};

	const Class = ComponentClass.Parameters.host;
	let LISSBase: any = ComponentClass;
	let htmltag = _element2tagname(Class)??undefined;

	await Promise.all([_DOMContentLoaded, ...dependencies, ...LISSBase.Parameters.dependencies]);

	const LISSclass = buildLISSHost<Extends, Host, Attrs, Params, T>(ComponentClass, params);
	
	const opts = htmltag === undefined ? {}
									   : {extends: htmltag};
	
	customElements.define(tagname, LISSclass, opts);
};

// ================================================
// =============== LISS ShadowRoot tools ==========
// ================================================

const sharedCSS = new CSSStyleSheet();
document.adoptedStyleSheets.push(sharedCSS);

LISS.insertGlobalCSSRules = function(css: string|HTMLStyleElement) {

	let css_style!: CSSStyleSheet;

	if( css instanceof HTMLStyleElement )
		css_style = css.sheet!;
	if( typeof css === "string") {
		css_style = new CSSStyleSheet();
		css_style.replaceSync(css);
	}

	for(let rule of css_style.cssRules)
		sharedCSS.insertRule(rule.cssText);
}

type DelegatedHandler = [string, (ev: MouseEvent) => void];
const DELEGATED_EVENTS = {
	"click": [] as DelegatedHandler[],
	"dblclick": [] as DelegatedHandler[]
};

const ALREADY_PROCESSED = Symbol();

function onClickEvent(ev: MouseEvent) {

	if( (ev as any)[ALREADY_PROCESSED] === true )
		return;
	(ev as any)[ALREADY_PROCESSED] = true;

	const handlers = DELEGATED_EVENTS[ev.type as keyof typeof DELEGATED_EVENTS];

	for(let elem of ev.composedPath() ) {
	
		if( elem instanceof ShadowRoot || elem === document || elem === window )
			continue;

		var target = elem as Element;

		for(let [selector, handler] of handlers) {
			if( target.matches(selector) )
				handler(ev);
		}
	}
}

LISS.insertGlobalDelegatedListener = function(event_name: keyof typeof DELEGATED_EVENTS, selector: string, handler: (ev: MouseEvent) => void ) {
	DELEGATED_EVENTS[event_name].push([selector, handler])
}

document.addEventListener('click', onClickEvent);
document.addEventListener('dblclick', onClickEvent);

LISS.closest = function closest<E extends Element>(selector: string, element: Element) {

	while(true) {
		var result = element.closest<E>(selector);

		if( result !== null)
			return result;

		const root = element.getRootNode();
		if( ! ("host" in root) )
			return null;

		element = (root as ShadowRoot).host;
	}
}

// ================================================
// =============== LISS helpers ===================
// ================================================

type inferParams<T> = T extends LISSBase<any,any,any, infer P extends Record<string,any>> ? P : never;

type BUILD_OPTIONS<T extends LISSBase<any,any,any,any>> = Partial<{
					  	params    : Partial<inferParams<T>>,
					  	content	  : string|Node|readonly Node[],
						id 		  : string,
					  	classes	  : readonly string[],
					  	cssvars   : Readonly<Record<string, string>>,
					  	attrs 	  : Readonly<Record<string, string|boolean>>,
					  	data 	  : Readonly<Record<string, string|boolean>>,
					  	listeners : Readonly<Record<string, (ev: Event) => void>>
					}> & ({
						initialize: false,
						parent: Element
					}|{
						initialize?: true,
						parent?: Element
					});

async function build<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Promise<Components[T]>;
async function build<T extends LISSBase<any,any,any,any>>(tagname: string, options?: BUILD_OPTIONS<T>): Promise<T>;
async function build<T extends LISSBase<any,any,any,any>>(tagname: string, {
		params    = {},
		initialize= true,
		content   = [],
		parent    = undefined,
		id 		  = undefined,
		classes   = [],
		cssvars   = {},
		attrs     = {},
		data 	  = {},
		listeners = {}
	}: BUILD_OPTIONS<T> = {}): Promise<T> {

	if( ! initialize && parent === null)
		throw new Error("A parent must be given if initialize is false");

	let CustomClass = await customElements.whenDefined(tagname);
	let elem = new CustomClass(params) as LISSHost<T>;

	// Fix issue #2
	if( elem.tagName.toLowerCase() !== tagname )
		elem.setAttribute("is", tagname);

	if( id !== undefined )
		elem.id = id;

	if( classes.length > 0)
		elem.classList.add(...classes);

	for(let name in cssvars)
		elem.style.setProperty(`--${name}`, cssvars[name]);

	for(let name in attrs) {

		let value = attrs[name];
		if( typeof value === "boolean")
			elem.toggleAttribute(name, value);
		else
			elem.setAttribute(name, value);
	}

	for(let name in data) {

		let value = data[name];
		if( value === false)
			delete elem.dataset[name];
		else if(value === true)
			elem.dataset[name] = "";
		else
			elem.dataset[name] = value;
	}

	if( ! Array.isArray(content) )
		content = [content as any];
	elem.replaceChildren(...content);

	for(let name in listeners)
		elem.addEventListener(name, listeners[name]);

	if( parent !== undefined )
		parent.append(elem);

	if( ! elem.isInit && initialize )
		return await LISS.initialize(elem);

	return await LISS.getLISS(elem);
}
LISS.build = build;


function buildSync<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Components[T];
function buildSync<T extends LISSBase<any,any,any,any>>(tagname: string, options?: BUILD_OPTIONS<T>): T;
function buildSync<T extends LISSBase<any,any,any,any>>(tagname: string, {
		params    = {},
		initialize= true,
		content   = [],
		parent    = undefined,
		id 		  = undefined,
		classes   = [],
		cssvars   = {},
		attrs     = {},
		data 	  = {},
		listeners = {}
	}: BUILD_OPTIONS<T> = {}): T {

	if( ! initialize && parent === null)
		throw new Error("A parent must be given if initialize is false");

	let CustomClass = customElements.get(tagname);
	if(CustomClass === undefined)
		throw new Error(`${tagname} not defined`);
	let elem = new CustomClass(params) as LISSHost<T>;

	//TODO: factorize...

	// Fix issue #2
	if( elem.tagName.toLowerCase() !== tagname )
		elem.setAttribute("is", tagname);

	if( id !== undefined )
		elem.id = id;

	if( classes.length > 0)
		elem.classList.add(...classes);

	for(let name in cssvars)
		elem.style.setProperty(`--${name}`, cssvars[name]);

	for(let name in attrs) {

		let value = attrs[name];
		if( typeof value === "boolean")
			elem.toggleAttribute(name, value);
		else
			elem.setAttribute(name, value);
	}

	for(let name in data) {

		let value = data[name];
		if( value === false)
			delete elem.dataset[name];
		else if(value === true)
			elem.dataset[name] = "";
		else
			elem.dataset[name] = value;
	}

	if( ! Array.isArray(content) )
		content = [content as any];
	elem.replaceChildren(...content);

	for(let name in listeners)
		elem.addEventListener(name, listeners[name]);

	if( parent !== undefined )
		parent.append(elem);

	if( ! elem.isInit && initialize )
		LISS.initializeSync(elem);

	return LISS.getLISSSync(elem);
}
LISS.buildSync = buildSync;

LISS.whenDefined    = async function(tagname: string, callback?: () => void ) : Promise<void> {

	await customElements.whenDefined(tagname);

	if( callback !== undefined)
		callback();

	return;
}
LISS.whenAllDefined = async function(tagnames: readonly string[], callback?: () => void ) : Promise<void> {

	await Promise.all( tagnames.map( t => customElements.whenDefined(t) ) )

	if( callback !== undefined)
		callback();

}

LISS.isDefined = function(name: string) {
	return customElements.get(name);
}

LISS.selector = function(name?: string) {
	if(name === undefined) // just an h4ck
		return "";
	return `:is(${name}, [is="${name}"])`;
}

LISS.getLISS    = async function<T extends LISSBase<any,any,any,any>>( element: Element ) {

	await LISS.whenDefined( LISS.getName(element) );

	return (element as LISSHost<T>).LISS; // ensure initialized.
}
LISS.getLISSSync= function<T extends LISSBase<any,any,any,any>>( element: Element ) {

	const name = LISS.getName(element);
	if( ! LISS.isDefined( name ) )
		throw new Error(`${name} hasn't been defined yet.`);

	let host = element as LISSHost<T>;

	if( ! host.isInit )
		throw new Error("Instance hasn't been initialized yet.");

	return host.LISSSync;
}
LISS.initialize = async function<T extends LISSBase<any,any,any,any>>( element: Element) {

	await LISS.whenDefined( LISS.getName(element) );

	return await (element as LISSHost<T>).initialize(); // ensure initialization.
}

LISS.initializeSync = function<T extends LISSBase<any,any,any,any>>( element: Element) {

	const name = LISS.getName(element);
	if( ! LISS.isDefined(name) )
		throw new Error(`${name} not defined`);

	return (element as LISSHost<T>).initialize(); // ensure initialization.
}

LISS.getName = function( element: Element ): string {

	const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
	
	if( ! name.includes('-') )
		throw new Error(`Element ${name} is not a WebComponent`);

	return name;
}

function _buildQS(selector: string, tagname_or_parent?: string | Element|DocumentFragment|Document, parent: Element|DocumentFragment|Document = document) {
	
	if( tagname_or_parent !== undefined && typeof tagname_or_parent !== 'string') {
		parent = tagname_or_parent;
		tagname_or_parent = undefined;
	}

	return [`${selector}${LISS.selector(tagname_or_parent as string|undefined)}`, parent] as const;
}

// ================================================
// =============== LISS QuerySelectors ============
// ================================================

async function qs<T extends LISSBase<any,any,any,any>>(selector: string,
						parent  ?: Element|DocumentFragment|Document): Promise<T>;
async function qs<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Promise< Components[N] >;
async function qs<T extends LISSBase<any,any,any,any>>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	let result = await LISS.qso<T>(selector, parent);
	if(result === null)
		throw new Error(`Element ${selector} not found`);

	return result!
}
LISS.qs  = qs

async function qso<T extends LISSBase<any,any,any,any>>(selector: string,
						parent  ?: Element|DocumentFragment|Document): Promise<T>;
async function qso<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Promise< Components[N] >;
async function qso<T extends LISSBase<any,any,any,any>>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	const element = parent.querySelector<LISSHost<T>>(selector);
	if( element === null )
		return null;

	return await LISS.getLISS( element );
}
LISS.qso = qso

async function qsa<T extends LISSBase<any,any,any,any>>(selector: string,
						parent  ?: Element|DocumentFragment|Document): Promise<T[]>;
async function qsa<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Promise< Components[N][] >;
async function qsa<T extends LISSBase<any,any,any,any>>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	const elements = parent.querySelectorAll<LISSHost<T>>(selector);

	let idx = 0;
	const promises = new Array<Promise<T>>( elements.length );
	for(let element of elements)
		promises[idx++] = LISS.getLISS( element );

	return await Promise.all(promises);
}
LISS.qsa = qsa;

async function qsc<T extends LISSBase<any,any,any,any>>(selector: string,
						element  : Element): Promise<T>;
async function qsc<N extends keyof Components>(selector: string,
						tagname  : N,
						element  : Element): Promise< Components[N] >;
async function qsc<T extends LISSBase<any,any,any,any>>(	selector: string,
						tagname_or_parent?: keyof Components | Element,
						element  ?: Element) {

	const res = _buildQS(selector, tagname_or_parent, element);
	
	const result = (res[1] as unknown as Element).closest<LISSHost<T>>(res[0]);
	if(result === null)
		return null;

	return await LISS.getLISS(result);
}
LISS.qsc = qsc;

function qsSync<T extends LISSBase<any,any,any,any>>(selector: string,
						parent  ?: Element|DocumentFragment|Document): T;
function qsSync<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Components[N];
function qsSync<T extends LISSBase<any,any,any,any>>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	const element = parent.querySelector<LISSHost<T>>(selector);

	if( element === null )
		throw new Error(`Element ${selector} not found`);

	return LISS.getLISSSync( element );
}
LISS.qsSync = qsSync;

function qsaSync<T extends LISSBase<any,any,any,any>>(selector: string,
						parent  ?: Element|DocumentFragment|Document): T[];
function qsaSync<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Components[N][];
function qsaSync<T extends LISSBase<any,any,any,any>>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	const elements = parent.querySelectorAll<LISSHost<T>>(selector);

	let idx = 0;
	const result = new Array<T>( elements.length );
	for(let element of elements)
		result[idx++] = LISS.getLISSSync( element );

	return result;
}
LISS.qsaSync = qsaSync;

function qscSync<T extends LISSBase<any,any,any,any>>(selector: string,
						element  : Element): T;
function qscSync<N extends keyof Components>(selector: string,
						tagname  : N,
						element  : Element): Components[N];
function qscSync<T extends LISSBase<any,any,any,any>>(	selector: string,
						tagname_or_parent?: keyof Components | Element,
						element  ?: Element) {

	const res = _buildQS(selector, tagname_or_parent, element);
	
	const result = (res[1] as unknown as Element).closest<LISSHost<T>>(res[0]);
	if(result === null)
		return null;

	return LISS.getLISSSync(result);
}
LISS.qscSync = qscSync;

// ================================================
// =============== LISS Auto ======================
// ================================================

export class LISS_Auto extends LISS({attributes: ["src"]}) {

	readonly #known_tag = new Set<string>();
	readonly #directory: string;
	readonly #sw: Promise<void>;

	constructor() {

		super();

		this.#sw = new Promise( async (resolve) => {
			
			await navigator.serviceWorker.register(`./sw.js`);

			if( navigator.serviceWorker.controller )
				resolve();

			navigator.serviceWorker.addEventListener('controllerchange', () => {
				resolve();
			});
		});


		const src = this.attrs.src;
		if(src === null)
			throw new Error("src attribute is missing.");
		this.#directory = src[0] === '.'
								? `${window.location.pathname}/${src}`
								: src;

		new MutationObserver( (mutations) => {

			for(let mutation of mutations)
				for(let addition of mutation.addedNodes)
					if(addition instanceof Element)
						this.#addTag(addition.tagName)

		}).observe( document, { childList:true, subtree:true });


		for( let elem of document.querySelectorAll("*") )
			this.#addTag(elem.tagName);
	}


    protected resources() {
		return [
			"index.js",
			"index.html",
			"index.css"
		];
    }

	protected defineWebComponent(tagname: string, files: Record<string, any>, opts: Partial<{content: string, css: string}>) {

		const js = files["index.js"];
		const content = files["index.html"];

		let klass: null| ReturnType<typeof LISS> = null;
		if( js !== undefined )
			klass = js(opts);
		else if( content !== undefined )
			klass = class WebComponent extends LISS(opts) {};

		if(klass === null)
			throw new Error(`Missing files for WebComponent ${tagname}.`);

		return LISS.define(tagname, klass);
	}

	async #addTag(tagname: string) {

		tagname = tagname.toLowerCase();

		if( tagname === 'liss-auto' || tagname === 'bliss-auto' || ! tagname.includes('-') || this.#known_tag.has( tagname ) )
			return;

		this.#known_tag.add(tagname);

		await this.#sw; // ensure SW is installed.

		const filenames = this.resources();
		const resources = await Promise.all( filenames.map( file => file.endsWith('.js')
													? _import   (`${this.#directory}/${tagname}/${file}`, true)
													: _fetchText(`${this.#directory}/${tagname}/${file}`, true) ) );

		const files: Record<string, any> = {};
		for(let i = 0; i < filenames.length; ++i)
			if( resources[i] !== undefined)
				files[filenames[i]] = resources[i];

		const content = files["index.html"];
		const css     = files["index.css"];

		const opts: Partial<{content: string, css: string}> = {
			...content !== undefined && {content},
			...css     !== undefined && {css},
		};

		return this.defineWebComponent(tagname, files, opts);
		
	}
}
LISS.define("liss-auto", LISS_Auto);

export interface Components {
	"liss-auto": LISS_Auto
};
/*
 * declare module '$LISS' {
 * 		interface Components {
 * 			"name": class
 * 		}
 * }
 */

// ================================================
// =============== LISS EventsTarget ==============
// ================================================

type CstEvent<Event extends string, Args> = CustomEvent<Args> & {type: Event};

export interface EventsTarget<Events extends Record<string, any>>{

	addEventListener<Event extends Exclude<keyof Events, symbol|number>>(type: Event,
												 listener: null| ((ev: CstEvent<Event, Events[Event]>) => void),
												 options?: boolean|AddEventListenerOptions): void;

	dispatchEvent<Event extends Exclude<keyof Events, symbol|number>>(event: CstEvent<Event, Events[Event]>): boolean;

	removeEventListener<Event extends Exclude<keyof Events, symbol|number>>(type: Event,
													listener: null| ((ev: CstEvent<Event, Events[Event]>) => void),
													options?: boolean|AddEventListenerOptions): void;
}

export class CstmEvent<Event extends string, Args> extends CustomEvent<Args> {

	override get type(): Event { return super.type as Event; }

	constructor(type: Event, args: Args) {
		super(type, {detail: args});
	}
}

export type EventsTargetCstr<Events extends Record<string,any>> = Constructor<EventsTarget<Events>>;


// ================================================
// =============== LISS internal tools ============
// ================================================

async function fetchResource(resource: Resource|Promise<Resource>) {

	resource = await resource;

	if( ! (resource instanceof Response) )
		resource = await fetch(resource);

	return await resource.text();
}


async function _fetchText(uri: string|URL, isLissAuto: boolean = false) {

	const options = isLissAuto
						? {headers:{"liss-auto": "true"}}
						: {};


	const response = await fetch(uri, options);
	if(response.status !== 200 )
		return undefined;

	if( isLissAuto && response.headers.get("status")! === "404" )
		return undefined;

	return await response.text();
}
async function _import(uri: string, isLissAuto: boolean = false) {

	// test for the module existance.
	if(isLissAuto && await _fetchText(uri, isLissAuto) === undefined )
		return undefined;

	try {
		return (await import(/* webpackIgnore: true */ uri)).default;
	} catch(e) {
		console.log(e);
		return undefined;
	}
}

// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
const HTMLCLASS_REGEX =  /HTML(\w+)Element/;
const elementNameLookupTable = {
    'UList': 'ul',
    'TableCaption': 'caption',
    'TableCell': 'td', // th
    'TableCol': 'col',  //'colgroup',
    'TableRow': 'tr',
    'TableSection': 'tbody', //['thead', 'tbody', 'tfoot'],
    'Quote': 'q',
    'Paragraph': 'p',
    'OList': 'ol',
    'Mod': 'ins', //, 'del'],
    'Media': 'video',// 'audio'],
    'Image': 'img',
    'Heading': 'h1', //, 'h2', 'h3', 'h4', 'h5', 'h6'],
    'Directory': 'dir',
    'DList': 'dl',
    'Anchor': 'a'
  };
function _element2tagname(Class: typeof HTMLElement): string|null {

	if( Class === HTMLElement )
		return null;
	
	let htmltag = HTMLCLASS_REGEX.exec(Class.name)![1];
	return elementNameLookupTable[htmltag as keyof typeof elementNameLookupTable] ?? htmltag.toLowerCase()
}