
// ================================================
// =============== LISS QuerySelectors ============
// ================================================

import type { LISSBase, LISSHost } from "types";
import LISS from "index";

interface Components {};

declare module "../LISSBase" {
    interface ILISS {
        // async
        qs : typeof qs;
        qso: typeof qso;
        qsa: typeof qsa;
        qsc: typeof qsc;

        // sync
        qsSync : typeof qsSync;
        qsaSync: typeof qsaSync;
        qscSync: typeof qscSync;
    }
}

function liss_selector(name?: string) {
	if(name === undefined) // just an h4ck
		return "";
	return `:is(${name}, [is="${name}"])`;
}

function _buildQS(selector: string, tagname_or_parent?: string | Element|DocumentFragment|Document, parent: Element|DocumentFragment|Document = document) {
	
	if( tagname_or_parent !== undefined && typeof tagname_or_parent !== 'string') {
		parent = tagname_or_parent;
		tagname_or_parent = undefined;
	}

	return [`${selector}${liss_selector(tagname_or_parent as string|undefined)}`, parent] as const;
}

async function qs<T extends LISSBase>(selector: string,
						parent  ?: Element|DocumentFragment|Document): Promise<T>;
async function qs<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Promise< Components[N] >;
async function qs<T extends LISSBase>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	let result = await LISS.qso<T>(selector, parent);
	if(result === null)
		throw new Error(`Element ${selector} not found`);

	return result!
}

async function qso<T extends LISSBase>(selector: string,
						parent  ?: Element|DocumentFragment|Document): Promise<T>;
async function qso<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Promise< Components[N] >;
async function qso<T extends LISSBase>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	const element = parent.querySelector<LISSHost<T>>(selector);
	if( element === null )
		return null;

	return await LISS.getLISS( element );
}
LISS.qso = qso

async function qsa<T extends LISSBase>(selector: string,
						parent  ?: Element|DocumentFragment|Document): Promise<T[]>;
async function qsa<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Promise< Components[N][] >;
async function qsa<T extends LISSBase>(	selector: string,
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

async function qsc<T extends LISSBase>(selector: string,
						element  : Element): Promise<T>;
async function qsc<N extends keyof Components>(selector: string,
						tagname  : N,
						element  : Element): Promise< Components[N] >;
async function qsc<T extends LISSBase>(	selector: string,
						tagname_or_parent?: keyof Components | Element,
						element  ?: Element) {

	const res = _buildQS(selector, tagname_or_parent, element);
	
	const result = (res[1] as unknown as Element).closest<LISSHost<T>>(res[0]);
	if(result === null)
		return null;

	return await LISS.getLISS(result);
}
LISS.qsc = qsc;

function qsSync<T extends LISSBase>(selector: string,
						parent  ?: Element|DocumentFragment|Document): T;
function qsSync<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Components[N];
function qsSync<T extends LISSBase>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	const element = parent.querySelector<LISSHost<T>>(selector);

	if( element === null )
		throw new Error(`Element ${selector} not found`);

	return LISS.getLISSSync( element );
}
LISS.qsSync = qsSync;

function qsaSync<T extends LISSBase>(selector: string,
						parent  ?: Element|DocumentFragment|Document): T[];
function qsaSync<N extends keyof Components>(selector: string,
						tagname  : N,
						parent  ?: Element|DocumentFragment|Document): Components[N][];
function qsaSync<T extends LISSBase>(	selector: string,
						tagname_or_parent?: keyof Components | Element|DocumentFragment|Document,
						parent  : Element|DocumentFragment|Document = document) {

	[selector, parent] = _buildQS(selector, tagname_or_parent, parent);

	const elements = parent.querySelectorAll<LISSHost<T>>(selector);

	let idx = 0;
	const result = new Array<T>( elements.length );
	for(let element of elements)
		result[idx++] = LISS.getLISSSync<T>( element );

	return result;
}
LISS.qsaSync = qsaSync;

function qscSync<T extends LISSBase>(selector: string,
						element  : Element): T;
function qscSync<N extends keyof Components>(selector: string,
						tagname  : N,
						element  : Element): Components[N];
function qscSync<T extends LISSBase>(	selector: string,
						tagname_or_parent?: keyof Components | Element,
						element  ?: Element) {

	const res = _buildQS(selector, tagname_or_parent, element);
	
	const result = (res[1] as unknown as Element).closest<LISSHost<T>>(res[0]);
	if(result === null)
		return null;

	return LISS.getLISSSync(result);
}

// async
LISS.qs  = qs;
LISS.qso = qso;
LISS.qsa = qsa;
LISS.qsc = qsc;

// sync
LISS.qsSync  = qsSync;
LISS.qsaSync = qsaSync;
LISS.qscSync = qscSync;




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
