// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
	null, 'article', 'aside', 'blockquote', 'body', 'div',
	'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
	'nav', 'p', 'section', 'span'
	
];

export type LISSOptions<T extends HTMLElement, U extends Class> = {
	observedAttributes ?: readonly string[],
	htmlclass?: Constructor<T>|null,
	inherit  ?: Constructor<U>|null,
	dependancies?: readonly string[],
	template?: string|HTMLTemplateElement,
	css?: readonly (string|HTMLStyleElement|CSSStyleSheet)[] | (string|HTMLStyleElement|CSSStyleSheet),
	shadow?:  ShadowCfg,
	delayedInit?: boolean
};

type Constructor<T> = new () => T;

interface Class {}

export enum ShadowCfg {
	NONE = 0,
	OPEN = 'open', 
	CLOSE= 'closed'
};

export default function LISS<T extends HTMLElement = HTMLElement, U extends Class = Class>(
							{   observedAttributes,
								htmlclass = null,
								inherit   = null,
								dependancies,
								template,
								delayedInit = false,
								css,
								shadow}: LISSOptions<T, U> = {}) {

	const inheritClass    = htmlclass ?? HTMLElement as Constructor<T>;
	const inheritObjClass = inherit   ?? Object      as unknown as Constructor<U>;

	observedAttributes ??= [];
	dependancies ??= [];

	const canHasShadow = CAN_HAVE_SHADOW.includes( element2tagname(inheritClass) );
	shadow ??= canHasShadow ? ShadowCfg.CLOSE : ShadowCfg.NONE;

	if( ! canHasShadow && shadow !== ShadowCfg.NONE) {
		console.warn('This element does not support ShadowRoot');
		shadow = ShadowCfg.NONE;
	}

	if( template !== undefined ) {

		if( typeof template === 'string' && template[0] === '#')
			template = document.querySelector<HTMLTemplateElement>(template)!;

		if(template instanceof HTMLTemplateElement)
			template = template.innerHTML;

		template = (template as string).trim(); // Never return a text node of whitespace as the result
		if(template === '')
			template = undefined;
	}

	let shadow_stylesheets: readonly CSSStyleSheet[] = [];
	if( css !== undefined ) {

		if( ! Array.isArray(css) )
			css = [css as any];

		shadow_stylesheets = css.map( c => {

			if(c instanceof CSSStyleSheet)
				return c;

			if( typeof c === 'string' && c[0] === '#' )
				c = document.querySelector<HTMLStyleElement>(c)!;

			if( c instanceof HTMLStyleElement)
				return c.sheet!;

			let style = new CSSStyleSheet()
			style.replaceSync(c);

			return style;
		});
	}
	let html_stylesheets = "";
	if( ! shadow && css !== undefined) {

		for(let style of shadow_stylesheets)
			for(let rule of style.cssRules)
				html_stylesheets += rule.cssText + '\n';
	}

	// @ts-ignore
	class ImplLISS extends inheritObjClass {

		readonly #htmltag: LISSTagClassType<typeof ImplLISS>;

		constructor(htmltag  :  any,
					_options?: Readonly<Record<string, any>>) {
			super();
			this.#htmltag = htmltag as LISSTagClassType<typeof ImplLISS>;
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
			observedAttributes,
			dependancies,
			shadow,
			html_stylesheets,
			shadow_stylesheets,
			template,
			delayedInit,
		};

		protected onAttrChanged(_name: string,
								_oldValue: string,
								_newValue: string) {}
	}

	return ImplLISS;
}

type LISSClassTypeType<T extends HTMLElement, SuperClass extends Class> = ReturnType<typeof LISS<T, SuperClass>>;
//type LISSClassType    <T extends HTMLElement> = InstanceType<LISSClassTypeType<T>>;

//type inferElemFromLISSClass<LISSClass>     = LISSClass extends LISSClassType<infer X extends HTMLElement> ? X : never;
type inferLISSClassTypeTypeFromLISSClass<LISSClass> = Constructor<LISSClass> & {Parameters: any};

// i.e. we need to give them "typeof LISS".
type LISSTagClassTypeType<LISSClassType>  = LISSClassType extends LISSClassTypeType<infer T extends HTMLElement, infer SC extends Class> ? ReturnType<typeof buildImplLISSTag<T, SC, LISSClassType>> : never;
type LISSTagClassType<LISSClassType>      = InstanceType<LISSTagClassTypeType<LISSClassType>>;

type inferLISSTagClassTypeFROMLISSClass<LISSClass> = LISSTagClassType<inferLISSClassTypeTypeFromLISSClass<LISSClass>>;

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

	return parent.querySelector<inferLISSTagClassTypeFROMLISSClass<T>>(selector);
}
LISS.qsa = function<T>(	selector: string,
						parent  : Element|DocumentFragment|Document = document) {
	

	if(selector === '')
		return [];

	return [...parent.querySelectorAll<inferLISSTagClassTypeFROMLISSClass<T>>(selector)];
}

LISS.closest = function<T>(selector:string, currentElement: Element) {
	return currentElement.closest<inferLISSTagClassTypeFROMLISSClass<T>>(selector);
}

function buildImplLISSTag<T extends HTMLElement, SuperClass extends Class, U extends LISSClassTypeType<T, SuperClass>>(Liss: U,
																			 withCstrParams: Readonly<Record<string, any>> = {}) {
	
	const tagclass 			 = Liss.Parameters.tagclass;
	const observedAttributes = Liss.Parameters.observedAttributes;
	const shadow			 = Liss.Parameters.shadow;
	const html_stylesheets	 = Liss.Parameters.html_stylesheets;
	const shadow_stylesheets = Liss.Parameters.shadow_stylesheets;
	const template  		 = Liss.Parameters.template;
	const delayedInit		 = Liss.Parameters.delayedInit;

	const alreadyDeclaredCSS = new Set();

	// @ts-ignore : because TS is stupid.
	class ImplLISSTag extends tagclass {

		readonly #options?: Readonly<Record<string, any>>;
		constructor(options?: Readonly<Record<string, any>>) {
			super();
			this.#options = options;
		}

		/*** init ***/
		#API: InstanceType<U> | null = null;

		connectedCallback() {
			if( ! this.isInit && ! delayedInit && ! this.hasAttribute('delay-liss-init') )
				this.force_init();
		}

		force_init(options: Readonly<Record<string, any>>|undefined = this.#options) {
			
			if( this.isInit )
				throw new Error('Webcomponent already initialized!');

			customElements.upgrade(this);
			
			// shadow
			this.#content = this;
			if( shadow ) {
				this.#content = this.attachShadow({mode: shadow})
			}

			// attrs
			for(let obs of observedAttributes!)
				this.#attributes[obs] = this.getAttribute(obs);

			// css
			if( shadow && shadow_stylesheets.length )
				(this.#content as ShadowRoot).adoptedStyleSheets.push(...shadow_stylesheets);
			if( html_stylesheets !== "") {

				const cssselector = this.CSSSelector;

				// if not yet inserted :
				if( ! alreadyDeclaredCSS.has(cssselector) ) {
					
					let style = document.createElement('style');

					style.setAttribute('for', cssselector);
					style.innerHTML = html_stylesheets.replace(':host', cssselector);

					document.head.append(style);


					alreadyDeclaredCSS.add(cssselector);
					//throw new Error('not yet implemented');
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
		#attributes: Record<string, string|null> = {};
		get attrs(): Readonly<Record<string, string|null>> {
			return this.#attributes;
		}

		static observedAttributes = observedAttributes;
		attributeChangedCallback(name: string,
								 oldValue: string,
								 newValue: string) {
			this.#attributes[name] = newValue;
			if( ! this.isInit )
				return;

			(this.#API! as any).onAttrChanged(name, oldValue, newValue);
		}
	};

	return ImplLISSTag;
}


type DEFINE_DATA = readonly [string, LISSClassTypeType<any, any>,
							 string|undefined,
							 readonly string[],
							 Readonly<Record<string, any>>];
let TO_DEFINE: DEFINE_DATA[] = [];

document.addEventListener('DOMContentLoaded', () => {

	for(let args of TO_DEFINE)
		define(...args)
}, true);

async function define(...args: DEFINE_DATA) {

	for(let dep of args[3])
		await customElements.whenDefined(dep);

	const LISSclass = buildImplLISSTag(args[1], args[4]);

	customElements.define(args[0], LISSclass, {extends: args[2]});
}



const HTMLCLASS_REGEX =  /HTML(\w+)Element/;
// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
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

function element2tagname(Class: typeof HTMLElement): string|null {

	if( Class === HTMLElement )
		return null;
	
	let htmltag = HTMLCLASS_REGEX.exec(Class.name)![1];
	return elementNameLookupTable[htmltag as keyof typeof elementNameLookupTable] ?? htmltag.toLowerCase()
}


LISS.define = function<U extends HTMLElement,
					   CL extends Class,
					   T extends LISSClassTypeType<U, CL>>(
					   	tagname: string,
						CustomClass: T,
						{dependancies, withCstrParams}: {withCstrParams?: Readonly<Record<string, any>>, dependancies?: string[]} = {}) {

	dependancies??=[];

	const Class = CustomClass.Parameters.tagclass;
	let ImplLISSClass: any = CustomClass;
	let htmltag = element2tagname(Class)??undefined;

	withCstrParams ??= {};

	let args = [tagname, CustomClass, htmltag, [...dependancies, ...ImplLISSClass.Parameters.dependancies], withCstrParams] as const;

	if(document.readyState === "interactive" || document.readyState === "complete")
		define(...args)
	else
		TO_DEFINE.push(args);
};

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