// ================================================
// =============== LISS exported types ============
// ================================================

export type CSS_Source = string|URL|HTMLStyleElement|CSSStyleSheet;

export type LISSOptions<T extends HTMLElement, U extends Class> = {

	htmlclass?: Constructor<T>|null,
	inherit  ?: Constructor<U>|null,

	dependancies?: readonly Promise<any>[],
	attributes  ?: readonly string[],

	content?: string|URL|HTMLTemplateElement,
	css    ?: readonly CSS_Source[] | CSS_Source,
	shadow ?:  ShadowCfg,
};

export enum ShadowCfg {
	NONE = 0,
	OPEN = 'open', 
	CLOSE= 'closed'
};

// ================================================
// =============== LISS Class =====================
// ================================================

type Constructor<T> = new () => T;
interface Class {}

export default function LISS<T extends HTMLElement = HTMLElement, U extends Class = Class>(
							{   attributes,
								htmlclass = null,
								inherit   = null,
								dependancies,
								content,
								css,
								shadow}: LISSOptions<T, U> = {}) {

	const inheritClass    = htmlclass ?? HTMLElement as Constructor<T>;
	const inheritObjClass = inherit   ?? Object      as unknown as Constructor<U>;

	attributes ??= [];
	const deps = [...dependancies ?? []];

	const canHasShadow = CAN_HAVE_SHADOW.includes( _element2tagname(inheritClass) );
	shadow ??= canHasShadow ? ShadowCfg.CLOSE : ShadowCfg.NONE;

	if( ! canHasShadow && shadow !== ShadowCfg.NONE) {
		console.warn('This element does not support ShadowRoot');
		shadow = ShadowCfg.NONE;
	}

	const cwd = _getCallerDir();

	if( content !== undefined ) {

		if(content instanceof HTMLTemplateElement) {

			content = content.innerHTML;
			content = (content as string).trim(); // Never return a text node of whitespace as the result
			if(content === '')
				content = undefined;

		} else if( content instanceof URL || content.startsWith('./') ) {

			if( typeof content === 'string' )
				content = `${cwd}/${content}`;

			deps.push( new Promise( async (resolve) => {

				content = await _fetchText(content as URL|string);

				resolve( LISSBase.Parameters.content = content );
			}) );
		}
	}

	let stylesheets: readonly CSSStyleSheet[] = [];
	if( css !== undefined ) {

		if( ! Array.isArray(css) )
			css = [css as CSS_Source];

		stylesheets = (css as CSS_Source[]).map( (c, idx) => {

			if(c instanceof CSSStyleSheet)
				return c;

			if( c instanceof HTMLStyleElement)
				return c.sheet!;

			let style = new CSSStyleSheet();

			if( ! (c instanceof URL) && ! c.startsWith('./') ) {
				style.replace(c);
				return style;
			}

			if( typeof c === 'string' )
				c = `${cwd}/${c}`;

			deps.push( new Promise<void>( async (resolve) => {

				const text = await _fetchText(c as string|URL);

				stylesheets[idx].replace(text!);

				resolve();
			}));

			return style;
		});
	}


	// @ts-ignore
	class LISSBase extends inheritObjClass {

		readonly #htmltag: LISSTagClassType<typeof LISSBase>;

		constructor(htmltag  :  any,
					_options?: Readonly<Record<string, any>>) {
			super();
			this.#htmltag = htmltag as LISSTagClassType<typeof LISSBase>;
		}

		public get host(): T {
			return this.#htmltag as unknown as T; // because TS stupid.
		}
		protected get content() {
			return this.#htmltag.content!;
		}
		protected get attrs() {
			return this.#htmltag.attrs;
		}

		static readonly Parameters = {
			tagclass: inheritClass,
			attributes: attributes!,
			dependancies: deps,
			shadow,
			stylesheets,
			content,
		};

		protected onAttrChanged(_name: string,
								_oldValue: string,
								_newValue: string): void|false {}
	}

	return LISSBase;
}


// ================================================
// =============== LISS type helpers ==============
// ================================================

// TODO remove ???
// Super confus...

type LISSClassTypeType<T extends HTMLElement, SuperClass extends Class> = ReturnType<typeof LISS<T, SuperClass>>;
//type LISSClassType    <T extends HTMLElement> = InstanceType<LISSClassTypeType<T>>;

//type inferElemFromLISSClass<LISSClass>     = LISSClass extends LISSClassType<infer X extends HTMLElement> ? X : never;
type inferLISSClassTypeTypeFromLISSClass<LISSClass> = Constructor<LISSClass> & {Parameters: any};

// i.e. we need to give them "typeof LISS".
type LISSTagClassTypeType<LISSClassType>  = LISSClassType extends LISSClassTypeType<infer T extends HTMLElement, infer SC extends Class> ? ReturnType<typeof buildLISSHost<T, SC, LISSClassType>> : never;
type LISSTagClassType<LISSClassType>      = InstanceType<LISSTagClassTypeType<LISSClassType>>;

export type LISSHost<LISSClass> = LISSTagClassType<inferLISSClassTypeTypeFromLISSClass<LISSClass>>;


// ================================================
// =============== LISSHost class =================
// ================================================

function buildLISSHost<T extends HTMLElement, SuperClass extends Class, U extends LISSClassTypeType<T, SuperClass>>(Liss: U,
																			 withCstrParams: Readonly<Record<string, any>> = {}) {
	
	const tagclass 	  = Liss.Parameters.tagclass;
	const attributes  = Liss.Parameters.attributes;
	const shadow	  = Liss.Parameters.shadow;
	const stylesheets = Liss.Parameters.stylesheets;
	const template    = Liss.Parameters.content;

	const alreadyDeclaredCSS = new Set();

	const GET = Symbol('get');
	const SET = Symbol('set');

	const properties = Object.fromEntries( attributes.map(n => [n, {

		enumerable: true,
		get: function(): string      { return this[GET](n); },
		set: function(value: string) { return this[SET](n, value); }
	}]) );

	class Attrs implements Record<string, string|null> {
        [x: string]: string|null;

        #data  : Record<string, string|null>;
        #setter: (name: string, value: string|null) => void;

        [GET](name: string) {
        	return this.#data[name];
        };
        [SET](name: string, value: string|null){
        	return this.#setter(name, value); // required to get a clean object when doing {...attrs}
        }

        constructor(data: Record<string, string|null>,
        			setter: (name: string, value: string|null) => void) {

        	this.#data   = data;
        	this.#setter = setter;

        	Object.defineProperties(this, properties);
        }
	}


	//Object.defineProperties(Attrs.prototype, properties);

	// @ts-ignore : because TS is stupid.
	class LISSHostBase extends tagclass {

		readonly #options?: Readonly<Record<string, any>>;

		constructor(options?: Readonly<Record<string, any>>) {
			super();
			this.#options = options;
		}

		/*** init ***/
		#API: InstanceType<U> | null = null;

		connectedCallback() {
			if( ! this.isInit && ! this.hasAttribute('delay-liss-init') )
				this.force_init();
		}

		private force_init(options: Readonly<Record<string, any>>|undefined = this.#options) {
			
			if( this.isInit )
				throw new Error('Webcomponent already initialized!');

			customElements.upgrade(this);
			
			// shadow
			this.#content = this;
			if( shadow ) {
				this.#content = this.attachShadow({mode: shadow})
			}

			// attrs
			for(let obs of attributes!)
				this.#attributes[obs] = this.getAttribute(obs);

			// css
			if( stylesheets.length ) {

				if( shadow )
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

						style.innerHTML = html_stylesheets.replace(':host', cssselector);

						document.head.append(style);

						alreadyDeclaredCSS.add(cssselector);
					}
				}
			}

			// template
			if( template !== undefined ) {
				let template_elem = document.createElement('template');
				let str = (template as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
	    		template_elem.innerHTML = str;
	    		this.#content.append(...template_elem.content.childNodes);
	    	}

	    	// build
	    	options = Object.assign({}, options, withCstrParams);
			this.#API = new Liss(this, options) as InstanceType<U>;

			// default slot
			if( this.hasShadow && this.#content.childNodes.length === 0 )
				this.#content.append( document.createElement('slot') );
		}

		get isInit() {
			return this.#API !== null;
		}

		get API() {
			if( ! this.isInit )
				throw new Error('Accessing API before WebComponent initialization!');
			return this.#API!;
		}

		/*** content ***/
		#content: HTMLElement|ShadowRoot|null = null;

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
			return !!shadow;
		}

		/*** CSS ***/

		get CSSSelector() {
			return this.hasShadow
					? this.tagName
					: `${this.tagName}[is="${this.getAttribute("is")}"]`;
		}

		/*** attrs ***/
		#attrs_flag = false;

		#attributes: Record<string, string|null> = {};
		#attrs = new Attrs(
			this.#attributes,
			(name: string, value:string|null) => {

				this.#attributes[name] = value;

				this.#attrs_flag = true; // do not trigger onAttrsChanged.
				if( value === null)
					this.removeAttribute(name);
				else
					this.setAttribute(name, value);
			}
		);

		get attrs(): Readonly<Record<string, string|null>> {

			return this.#attrs;
		}

		static observedAttributes = attributes;
		attributeChangedCallback(name: string,
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


type DEFINE_DATA = readonly [string,						// tagname
							 LISSClassTypeType<any, any>,   // class
							 string|undefined,				// inherit HTML Element
							 readonly Promise<any>[],		// deps
							 Readonly<Record<string, any>>];// parameters.
let TO_DEFINE: DEFINE_DATA[] = [];

document.addEventListener('DOMContentLoaded', () => {

	for(let args of TO_DEFINE)
		define(...args)
}, true);

async function define(...args: DEFINE_DATA) {

	await Promise.all(args[3]);

	const LISSclass = buildLISSHost(args[1], args[4]);

	customElements.define(args[0], LISSclass, {extends: args[2]});
}

LISS.define = function<U extends HTMLElement,
					   CL extends Class,
					   T extends LISSClassTypeType<U, CL>>(
					   	tagname: string,
						CustomClass: T,
						{dependancies, withCstrParams}: {withCstrParams?: Readonly<Record<string, any>>, dependancies?: string[]} = {}) {

	dependancies??=[];

	const Class = CustomClass.Parameters.tagclass;
	let LISSBase: any = CustomClass;
	let htmltag = _element2tagname(Class)??undefined;

	withCstrParams ??= {};

	let args = [tagname, CustomClass, htmltag, [...dependancies, ...LISSBase.Parameters.dependancies], withCstrParams] as const;

	if(document.readyState === "interactive" || document.readyState === "complete")
		define(...args)
	else
		TO_DEFINE.push(args);
};

// ================================================
// =============== LISS helpers ===================
// ================================================

//TODO remove ?
LISS.createElement = async function <T extends HTMLElement = HTMLElement>(tagname: string, args: Readonly<Record<string, any>>): Promise<T> {

	let CustomClass = await customElements.whenDefined(tagname);

	//if(CustomClass === undefined)
	//	throw new Error(`Tag "${tagname}" is not defined (yet)!`)

	return new CustomClass(args) as T;	
}

type BUILD_OPTIONS = Partial<{
					  	withCstrParams: Readonly<Record<string, any>>,
						init 	 : boolean,
					  	content	 : string|Node|readonly Node[],
					  	parent   : HTMLElement,
						id 		 : string,
					  	classes	 : readonly string[],
					  	cssvars  : Readonly<Record<string, string>>,
					  	attrs 	 : Readonly<Record<string, string|boolean>>,
					  	data 	 : Readonly<Record<string, string|boolean>>,
					  	listeners: Readonly<Record<string, (ev: Event) => void>>
					}>;
LISS.buildElement = async function <T extends HTMLElement = HTMLElement>(tagname: string, {
		withCstrParams = {},
		init 	  = true,
		content   = [],
		parent    = undefined,
		id 		  = undefined,
		classes   = [],
		cssvars   = {},
		attrs     = {},
		data 	  = {},
		listeners = {}
	}: BUILD_OPTIONS = {}): Promise<T> {

	let elem = await LISS.createElement(tagname, withCstrParams)

	if( id !== undefined )
		elem.id = id;

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

	if(init)
		(elem as any).connectedCallback(); //force init ?

	if( parent !== undefined )
		parent.append(elem);

	return elem as T;
}

LISS.qs = function<T>(	selector: string,
						parent  : Element|DocumentFragment|Document = document) {

	let result = LISS.qso<T>(selector, parent);
	if(result === null)
		throw new Error(`Element ${selector} not found`);

	return result!
}

LISS.qso = function<T>(	selector: string,
						parent  : Element|DocumentFragment|Document = document) {

	if(selector === '')
		return null;

	return parent.querySelector<LISSHost<T>>(selector);
}
LISS.qsa = function<T>(	selector: string,
						parent  : Element|DocumentFragment|Document = document) {
	

	if(selector === '')
		return [];

	return [...parent.querySelectorAll<LISSHost<T>>(selector)];
}

LISS.closest = function<T>(selector:string, currentElement: Element) {
	return currentElement.closest<LISSHost<T>>(selector);
}

LISS.whenDefined = async function<T extends CustomElementConstructor = CustomElementConstructor>(tagname: string, callback?: (cstr: T) => void ) : Promise<T> {

	let cstr = await customElements.whenDefined(tagname) as T;

	if( callback !== undefined)
		callback(cstr);

	return cstr;
}
LISS.whenAllDefined = async function<T extends CustomElementConstructor = CustomElementConstructor>(tagnames: readonly string[], callback?: () => void ) : Promise<void> {

	await Promise.all( tagnames.map( t => customElements.whenDefined(t) as Promise<T>) )

	if( callback !== undefined)
		callback();

}

// ================================================
// =============== LISS Auto ======================
// ================================================

class LISS_Auto extends LISS({attributes: ["src"]}) {

	readonly #known_tag = new Set<string>();
	readonly #directory: string;
	readonly #sw: Promise<void>;

	constructor(htmltag: any) {
		super(htmltag);

		// remove 404 errors.
		// 
		//const cwd = _getCallerDir(1);
		//this.#sw = navigator.serviceWorker.register(`${cwd}/sw.js`, { scope: location.pathname });
		// Because FF stupid.
		
		this.#sw = new Promise( async (resolve) => {
			let sw = await navigator.serviceWorker.register(`./sw.js`);

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

	async #addTag(tagname: string) {

		tagname = tagname.toLowerCase();

		if( tagname === 'liss-auto' || ! tagname.includes('-') || this.#known_tag.has( tagname ) )
			return;

		this.#known_tag.add(tagname);

		await this.#sw; // ensure SW is installed.

		const results = await Promise.all([
			_import(`${this.#directory}/${tagname}/index.js`, true), // current page...
			_fetchText(`${this.#directory}/${tagname}/index.html`, true), // TODO better
			_fetchText(`${this.#directory}/${tagname}/index.css`, true),
		]);

		const js	  = results[0];
		const content = results[1];
		const css     = results[2];

		if( js === undefined ) { // no JS

			if( content === undefined )
				throw new Error(`No JS or HTML files found for WebComponent ${tagname}.`);

			class WebComponent extends LISS({
				content,
				css
			}) {}

			return LISS.define(tagname, WebComponent);
		}

		return LISS.define(tagname, js({content, css}) );
	}
}
LISS.define("liss-auto", LISS_Auto);


// ================================================
// =============== LISS internal tools ============
// ================================================

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
		return (await import(uri)).default;
	} catch(e) {
		console.log(e);
		return undefined;
	}
}


// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
	null, 'article', 'aside', 'blockquote', 'body', 'div',
	'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
	'nav', 'p', 'section', 'span'
	
];

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

// cf https://stackoverflow.com/questions/13227489/how-can-one-get-the-file-path-of-the-caller-function-in-node-js
function _getCallerDir(depth = 2) {

	const line = new Error().stack!.split('\n')[depth];

	let beg = line.indexOf('@') + 1;
	let end = line.lastIndexOf('/') + 1;

	return line.slice(beg, end);
}