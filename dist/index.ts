export default function LISS<T extends typeof HTMLElement = typeof HTMLElement>(
							inherit: T|null = null,
							 _:null = null,
							 dependancies: readonly string[] = []): T {

	if(inherit === null)
		inherit = HTMLElement as T;

	//@ts-ignore cf https://github.com/microsoft/TypeScript/issues/37142
	class ImplLISS extends inherit {

		#content: Element|null = null;

		protected get content() {

			if(this.#content === null)
				throw new Error('Access to content before initialization !');

			return this.#content;
		}

		protected get self() {

			if(this.#content === null)
				throw new Error('Access to self before initialization !');

			return this;
		}

		protected assertInit() {
			if(this.#content === null)
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
			
			this.#content = this; //TODO: shadow

			this.init();
		}

		protected init(){}
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


LISS.define = function(tagname: string,
						CustomClass: CustomElementConstructor,
						{dependancies, withCstrParams}: {withCstrParams?:any, dependancies?: string[]} = {}) {

	dependancies??=[];


	let Class = CustomClass;
	while( Class.name !== 'ImplLISS' )
		Class = Object.getPrototypeOf(Class);

	let ImplLISSClass: any = Class;

	Class = Object.getPrototypeOf(Class);

	let htmltag: string|undefined = undefined;
	if( Class !== HTMLElement ) {
		htmltag = HTMLCLASS_REGEX.exec(Class.name)![1];
		htmltag = elementNameLookupTable[htmltag] ?? htmltag.toLowerCase()
	}

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