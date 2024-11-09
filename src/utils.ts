// functions required by LISS.

// fix Array.isArray
// cf https://github.com/microsoft/TypeScript/issues/17002#issuecomment-2366749050

type X<T> = Exclude<unknown,T> extends never    ? T[]                   // any/unknown => any[]/unknown
        : T extends readonly unknown[]          ? T                     // unknown[] - obvious case
        : T extends Iterable<infer U>           ?       readonly U[]    // Iterable<U> might be an Array<U>
        :          unknown[] extends T          ?          unknown[]    // something that could be an array - no ways to get the real type ?
        : readonly unknown[] extends T          ? readonly unknown[]    // something that could be an array - no ways to get the real type ?
        :              any[] extends T          ?              any[]    // something that could be an array - no ways to get the real type ?
        : readonly     any[] extends T          ? readonly     any[]    // something that could be an array - no ways to get the real type ?
                                                : never;

// required for any/unknown + Iterable<U>
type X2<T> = Exclude<unknown,T> extends never ? unknown : unknown;

declare global {
    interface ArrayConstructor {
        isArray<T>(a: T|X2<T>): a is X<T>;
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
export function _element2tagname(Class: typeof HTMLElement): string|null {

    console.warn('C', Class);

	if( Class === HTMLElement )
		return null;
	
	let htmltag = HTMLCLASS_REGEX.exec(Class.name)![1];
	return elementNameLookupTable[htmltag as keyof typeof elementNameLookupTable] ?? htmltag.toLowerCase()
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
	null, 'article', 'aside', 'blockquote', 'body', 'div',
	'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
	'nav', 'p', 'section', 'span'
	
];
export function isShadowSupported(tag: typeof HTMLElement) {
	return CAN_HAVE_SHADOW.includes( _element2tagname(tag) );
}

export function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete";
}

export const whenDOMContentLoaded = waitDOMContentLoaded();

export async function waitDOMContentLoaded() {
    if( isDOMContentLoaded() )
        return;

    const {promise, resolve} = Promise.withResolvers<void>()

	document.addEventListener('DOMContentLoaded', () => {
		resolve();
	}, true);

    await promise;
}

// for mixins.
export type ComposeConstructor<T, U> = 
    [T, U] extends [new (a: infer O1) => infer R1,new (a: infer O2) => infer R2] ? {
        new (o: O1 & O2): R1 & R2
    } & Pick<T, keyof T> & Pick<U, keyof U> : never


// moved here instead of build to prevent circular deps.
export function html<T extends DocumentFragment|HTMLElement>(str: readonly string[], ...args: any[]): T {
    
    let string = str[0];
    for(let i = 0; i < args.length; ++i) {
        string += `${args[i]}`;
        string += `${str[i+1]}`;
        //TODO: more pre-processes
    }

    // using template prevents CustomElements upgrade...
    let template = document.createElement('template');
    // Never return a text node of whitespace as the result
    template.innerHTML = string.trim();

    if( template.content.childNodes.length === 1 && template.content.firstChild!.nodeType !== Node.TEXT_NODE)
      return template.content.firstChild! as unknown as T;

    return template.content! as unknown as T;
}