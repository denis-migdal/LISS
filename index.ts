// A better implementation of LISS, more secure.
// => Now initialization possible directly in constructor
// ==> Ensure no access before initialization is possible.
// ==> API() directly generated.
// ==> fixes TS "readonly" and unitialized members.
// => now host...

// TODO: whenInit promise.


// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
	null, 'article', 'aside', 'blockquote', 'body', 'div',
	'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
	'nav', 'p', 'section', 'span'
	
];

export type LISSOptions = {
	observedAttributes ?: readonly string[],
	dependancies?: readonly string[],
	template?: string|HTMLTemplateElement,
	css?: readonly (string|HTMLStyleElement|CSSStyleSheet)[] | (string|HTMLStyleElement|CSSStyleSheet),
	shadowOpen?:  boolean
};

type Constructor<T> = new () => T;

export default function LISS<T extends HTMLElement = HTMLElement>(
							 inherit: Constructor<T>|null = null,
							{observedAttributes, dependancies, template, css, shadowOpen}: LISSOptions = {}) {

	const inheritClass = inherit ?? HTMLElement as Constructor<T>;
	observedAttributes ??= [];
	dependancies ??= [];

	const hasShadow = CAN_HAVE_SHADOW.includes( element2tagname(inheritClass) );
	const isShadowOpen = (shadowOpen ?? false) && hasShadow;

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
	if( ! hasShadow && css !== undefined) {

		for(let style of shadow_stylesheets)
			for(let rule of style.cssRules)
				html_stylesheets += rule.cssText + '\n';
	}

	class ImplLISS {

		readonly #htmltag: InstanceType<ILISSTag<T, typeof ImplLISS>>;

		constructor(htmltag  : InstanceType<ILISSTag<T, typeof ImplLISS>>,
					_options?: Readonly<Record<string, any>>) {
			this.#htmltag = htmltag;
		}

		protected get host(): T {
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
			hasShadow,
			isShadowOpen,
			html_stylesheets,
			shadow_stylesheets,
			template
		};

		protected onAttrChanged(_name: string,
								_oldValue: string,
								_newValue: string) {}
	}

	return ImplLISS;
}

type ILISS<T extends HTMLElement> = ReturnType<typeof LISS<T>>;
type ILISSTag<T extends HTMLElement, U> = U extends ILISS<T> ? ReturnType<typeof buildImplLISSTag<T,U>> : never;

export type inferILISSHTMLElement<Type>  = Type extends ReturnType<typeof LISS<infer X extends HTMLElement>> ? X : never;
export type LissHTMLTagOf< Type > = InstanceType< ILISSTag< inferILISSHTMLElement<Type>, Type> >;

function buildImplLISSTag<T extends HTMLElement, U extends ILISS<T>>(Liss: U,
																	withCstrParams: Readonly<Record<string, any>>) {
	
	const tagclass 			 = Liss.Parameters.tagclass;
	const observedAttributes = Liss.Parameters.observedAttributes;
	const hasShadow			 = Liss.Parameters.hasShadow;
	const isShadowOpen		 = Liss.Parameters.isShadowOpen;
	const html_stylesheets	 = Liss.Parameters.html_stylesheets;
	const shadow_stylesheets = Liss.Parameters.shadow_stylesheets;
	const template  		 = Liss.Parameters.template;

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
			if( ! this.isInit )
				this.#init();
		}

		#init() {

			customElements.upgrade(this);
			
			// shadow
			this.#content = this;
			if( hasShadow )
				this.#content = this.attachShadow({mode: isShadowOpen ? 'open' : 'closed'})

			// attrs
			for(let obs of observedAttributes!)
				this.#attributes[obs] = this.getAttribute(obs);

			// css
			if( hasShadow && shadow_stylesheets.length )
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
	    	const options = Object.assign({}, withCstrParams, this.#options);
			this.#API = new Liss(this, options) as InstanceType<U>;

			// default slot
			if( this.hasShadow && this.#content.childNodes.length === 0 )
				this.#content.append( document.createElement('slot') );
		}

		get isInit() {
			return this.#API !== null;
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
			return hasShadow;
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


type DEFINE_DATA = readonly [string, ILISS<any>,
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
					   T extends ILISS<U>>(tagname: string,
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