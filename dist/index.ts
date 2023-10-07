// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
	null, 'article', 'aside', 'blockquote', 'body', 'div',
	'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
	'nav', 'p', 'section', 'span'
	
];

export default function LISS<T extends typeof HTMLElement = typeof HTMLElement>(
							inherit: T|null = null,
							 observedAttributes: readonly string[] = [],
							 dependancies: readonly string[] = []): T {

	if(inherit === null)
		inherit = HTMLElement as T;

	let hasShadow = CAN_HAVE_SHADOW.includes( element2tagname(inherit) );


	//@ts-ignore cf https://github.com/microsoft/TypeScript/issues/37142
	class ImplLISS extends inherit {

		#isShadowOpen: boolean;
		#isInit = false;

		constructor(isShadowOpen: boolean = false) {
			super();
			this.#isShadowOpen = isShadowOpen;
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

		protected assertInit() {
			if(this.#isInit)
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

			this.init();

			this.#isInit = true;
		}

		protected init(){}

		static observedAttributes = observedAttributes;

		attributeChangedCallback(name: string,
								 oldValue: string,
								 newValue: string) {
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
    'UList': ['ul'],
    'TableCaption': ['caption'],
    'TableCell': ['th', 'td'],
    'TableCol': ['col', 'colgroup'],
    'TableRow': ['tr'],
    'TableSection': ['thead', 'tbody', 'tfoot'],
    'Quote': ['q'],
    'Paragraph': ['p'],
    'OList': ['ol'],
    'Mod': ['ins', 'del'],
    'Media': ['video', 'audio'],
    'Image': ['img'],
    'Heading': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    'Directory': ['dir'],
    'DList': ['dl'],
    'Anchor': ['a']
  };

function element2tagname(Class: typeof HTMLElement) {

	if( Class === HTMLElement )
		return null;
	
	let htmltag = HTMLCLASS_REGEX.exec(Class.name)![1];
	return elementNameLookupTable[htmltag] ?? htmltag.toLowerCase()
}


LISS.define = function(tagname: string,
						CustomClass: CustomElementConstructor,
						{dependancies, withCstrParams}: {withCstrParams?:any, dependancies?: string[]} = {}) {

	dependancies??=[];


	let Class = CustomClass;
	while( Class.name !== 'ImplLISS' )
		Class = Object.getPrototypeOf(Class);

	let ImplLISSClass: any = Class;

	Class = Object.getPrototypeOf(Class);

	let htmltag = element2tagname(Class)??undefined;

	if( withCstrParams !== undefined) {
		class WithCstrParams extends CustomClass {
            constructor() {
                super(...withCstrParams)
            }
         }

         CustomClass = WithCstrParams;
	}

	let args = [tagname, CustomClass, htmltag, [...dependancies, ...ImplLISSClass.dependancies()]] as const;

	if(document.readyState === "interactive")
		define(...args)
	else
		TO_DEFINE.push(args);
};

LISS.createElement = async function <T extends HTMLElement = HTMLElement>(tagname: string, ...args: any[]): Promise<T> {
			
	let CustomClass = await customElements.whenDefined(tagname);

	//if(CustomClass === undefined)
	//	throw new Error(`Tag "${tagname}" is not defined (yet)!`)

	return new CustomClass(...args) as T;	
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