// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
	null, 'article', 'aside', 'blockquote', 'body', 'div',
	'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
	'nav', 'p', 'section', 'span'
	
];

type API<T, U> = Omit<T, keyof U | "API" | "attributeChangedCallback" | "connectedCallback" | "disconnectedCallback" | "adoptedCallback">

export type LISSOptions = {
	observedAttributes ?: readonly string[],
	dependancies?: readonly string[],
	template?: string|HTMLTemplateElement,
	css?: readonly (string|HTMLStyleElement|CSSStyleSheet)[] | (string|HTMLStyleElement|CSSStyleSheet)
};

type Constructor<T> = new () => T;

export default function LISS<T extends HTMLElement = HTMLElement>(
							 inherit: Constructor<T>|null = null,
							{observedAttributes, dependancies, template, css}: LISSOptions = {}) {

	inherit ??= HTMLElement as Constructor<T>;
	observedAttributes ??= [];
	dependancies ??= [];

	let hasShadow = CAN_HAVE_SHADOW.includes( element2tagname(inherit) );


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

	let alreadyDeclaredCSS = new Set();


	//@ts-ignore cf https://github.com/microsoft/TypeScript/issues/37142
	class ImplLISS extends inherit {

		#isShadowOpen: boolean;
		#isInit = false;
		#attributes: Record<string, string|null> = {};

		constructor(isShadowOpen: boolean = false) {
			super();
			this.#isShadowOpen = isShadowOpen;
		}

		get API(): API<ImplLISS, T> {
			return this;
		}

		get CSSSelector() {
			return this.hasShadow
					? this.tagName
					: `${this.tagName}[is="${this.getAttribute("is")}"]`;
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

		#content: HTMLElement|ShadowRoot|null = null;

		protected get content() {

			if(this.#content === null)
				throw new Error('Access to content before initialization !');

			return this.#content;
		}

		protected get hasShadow(): boolean {
			return hasShadow;
		}

		protected get self() {

			if(this.#content === null)
				throw new Error('Access to self before initialization !');

			return this;
		}

		protected get attrs(): Readonly<Record<string, string|null>> {

			if(this.#content === null)
				throw new Error('Access to attributes before initialization !');

			return this.#attributes;
		}

		protected assertInit() {
			if(this.#isInit === false )
				throw new Error('Web Component is not initialized !');

		}

		static dependancies() {
			return dependancies;
		}

		connectedCallback() {
			if(this.#content === null)
				this.#init();
		}

		#init() {
			customElements.upgrade(this);
			
			this.#content = this;
			if( hasShadow )
				this.#content = this.attachShadow({mode: this.#isShadowOpen ? 'open' : 'closed'})

			for(let obs of observedAttributes!)
				this.#attributes[obs] = this.getAttribute(obs);

			if( css !== undefined ) {

				if(hasShadow) {
					(this.#content as ShadowRoot).adoptedStyleSheets.push(...shadow_stylesheets)
				} else {

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

			}

			if( template !== undefined ) {
				let template_elem = document.createElement('template');
				let str = (template as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
	    		template_elem.innerHTML = str;
	    		this.#content.append(...template_elem.content.childNodes);
	    	}

			this.init();

			if( this.hasShadow && this.#content.childNodes.length === 0 )
				this.#content.append( document.createElement('slot') );

			this.#isInit = true;
		}

		protected init(){}

		static observedAttributes = observedAttributes;

		attributeChangedCallback(name: string,
								 oldValue: string,
								 newValue: string) {
			this.#attributes[name] = newValue;
			if( ! this.#isInit )
				return;
			this.onAttrChanged(name, oldValue, newValue);
		}

		onAttrChanged(	_name: string,
						_oldValue: string,
						_newValue: string) {

		}
	}

	return ImplLISS;
}


type DEFINE_DATA = readonly [string, CustomElementConstructor, string|undefined, readonly string[]];
let TO_DEFINE: DEFINE_DATA[] = [];

document.addEventListener('DOMContentLoaded', () => {

	for(let args of TO_DEFINE)
		define(...args)
}, true);

async function define(...args: DEFINE_DATA) {

	for(let dep of args[3])
		await customElements.whenDefined(dep);

	customElements.define(args[0], args[1], {extends: args[2]});
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


LISS.define = function(tagname: string,
						CustomClass: CustomElementConstructor,
						{dependancies, withCstrParams}: {withCstrParams?: Readonly<Record<string, any>>, dependancies?: string[]} = {}) {

	dependancies??=[];


	let Class = CustomClass;
	while( Class.name !== 'ImplLISS' )
		Class = Object.getPrototypeOf(Class);

	let ImplLISSClass: any = Class;

	Class = Object.getPrototypeOf(Class);

	let htmltag = element2tagname(Class)??undefined;

	if( withCstrParams !== undefined) {
		class WithCstrParams extends CustomClass {
            constructor(params = {}) {
                super(Object.assign({}, withCstrParams, params) );
            }
         }

         CustomClass = WithCstrParams;
	}

	let args = [tagname, CustomClass, htmltag, [...dependancies, ...ImplLISSClass.dependancies()]] as const;

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