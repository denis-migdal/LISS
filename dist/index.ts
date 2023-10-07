export default function LISS<T extends typeof HTMLElement = typeof HTMLElement>(
							inherit: T|null = null,
							 _:null = null,
							 dependancies: readonly string[] = []): T {

	if(inherit === null)
		inherit = HTMLElement as T;

	//@ts-ignore cf https://github.com/microsoft/TypeScript/issues/37142
	class ImplLISS extends inherit {


		static dependancies() {
			return dependancies;
		}
	}

	return ImplLISS;
}


type DEFINE_DATA = readonly [string, CustomElementConstructor, string|undefined, readonly string[]];
let TO_DEFINE: DEFINE_DATA[] = [];

document.addEventListener('DOMContentLoaded', () => {

	for(let args of TO_DEFINE)
		define(...args)
});

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


LISS.define = function(tagname: string, CustomClass: CustomElementConstructor, dependancies: string[] = []) {

	let Class = CustomClass;
	while( Class.name !== 'ImplLISS' )
		Class = Object.getPrototypeOf(Class);

	let ImplLISSClass: any = Class;

	Class = Object.getPrototypeOf(Class);

	let htmltag = undefined;
	if( Class !== HTMLElement ) {
		let htmltag = HTMLCLASS_REGEX.exec(Class.name)![1];
		htmltag = elementNameLookupTable[htmltag] ?? htmltag.toLowerCase()
	}

	let args = [tagname, CustomClass, htmltag, [...dependancies, ...ImplLISSClass.dependancies()]] as const;

	if(document.readyState === "interactive")
		define(...args)
	else
		TO_DEFINE.push(args);
};