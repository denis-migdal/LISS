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

export async function waitDOMContentLoaded() {
    if( isDOMContentLoaded() )
        return;

    const {promise, resolve} = Promise.withResolvers<void>()

	document.addEventListener('DOMContentLoaded', () => {
		resolve();
	}, true);

    await promise;
}