import { Constructor, LHost, LISSBase, LISSBaseCstr } from "../types";
import LISS from "../extends";

import {define} from "../customRegistery";
import ContentGenerator from "../ContentGenerator";

// should be improved (but how ?)
const script = document.querySelector('script[autodir]');

const RESSOURCES = [
	"index.js",
	"index.bry",
	"index.html",
	"index.css"
];

const KnownTags = new Set<string>();

if( script !== null ) {

	const SW: Promise<void> = new Promise( async (resolve) => {

		const sw_path = script.getAttribute('sw');

		if( sw_path === null ) {
			console.warn("You are using LISS Auto mode without sw.js.");
			resolve();
			return;
		}
		
		try {
			await navigator.serviceWorker.register(sw_path, {scope: "/"});
		} catch(e) {
			console.warn("Registration of ServiceWorker failed");
			console.error(e);
			resolve();
		}

		if( navigator.serviceWorker.controller ) {
			resolve();
			return;
		}

		navigator.serviceWorker.addEventListener('controllerchange', () => {
			resolve();
		});
	});

	let components_dir = script.getAttribute('autodir')!;
	/*
	if( components_dir[0] === '.') {
		components_dir = window.location.pathname + components_dir; // getting an absolute path.
	}
	*/
	if( components_dir[components_dir.length-1] !== '/')
		components_dir += '/';

	// observe for new injected tags.
	new MutationObserver( (mutations) => {

		for(let mutation of mutations)
			for(let addition of mutation.addedNodes)
				if(addition instanceof HTMLElement)
					addTag(addition)

	}).observe( document, { childList:true, subtree:true });

	for( let elem of document.querySelectorAll<HTMLElement>("*") )
		addTag( elem );


	async function addTag(tag: HTMLElement) {

		await SW; // ensure SW is installed.

		const tagname = ( tag.getAttribute('is') ?? tag.tagName ).toLowerCase();

		let host = HTMLElement;
		if( tag.hasAttribute('is') )
			host = tag.constructor as Constructor<HTMLElement>

		if( ! tagname.includes('-') || KnownTags.has( tagname ) )
			return;

		importComponent(tagname, {
			//TODO: is Brython...
			cdir: components_dir, //TODO
			host
		});		
	}
}


async function defineWebComponent(tagname: string, files: Record<string, any>, opts: {html: string, css: string, host: Constructor<HTMLElement>}) {

	const c_js      = files["index.js"];

	let klass: null| ReturnType<typeof LISS> = null;
	if( c_js !== undefined ) {

		const file = new Blob([c_js], { type: 'application/javascript' });
		const url  = URL.createObjectURL(file);

		const oldreq = LISS.require;

		LISS.require = function(url: URL|string) {

			if( typeof url === "string" && url.startsWith('./') ) {
				const filename = url.slice(2);
				if( filename in files)
					return files[filename];
			}

			return oldreq(url);
		}

		klass = (await import(/* webpackIgnore: true */ url)).default;

		LISS.require = oldreq;
	}
	else if( opts.html !== undefined ) {
		klass = LISS({
			...opts,
			content_generator: LISSAuto_ContentGenerator
		});
	}

	if(klass === null)
		throw new Error(`Missing files for WebComponent ${tagname}.`);

	define(tagname, klass);

	return klass;
}

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
		return (await import(/* webpackIgnore: true */ uri)).default;
	} catch(e) {
		console.log(e);
		return undefined;
	}
}


const converter = document.createElement('span');

function encodeHTML(text: string) {
	converter.textContent = text;
	return converter.innerHTML;
}

export class LISSAuto_ContentGenerator extends ContentGenerator {

	protected override prepareHTML(html?: DocumentFragment | HTMLElement | string) {
		
		this.data = null;

		if( typeof html === 'string' ) {

			this.data = html;
			return null;
			/*
			html = html.replaceAll(/\$\{([\w]+)\}/g, (_, name: string) => {
				return `<liss value="${name}"></liss>`;
			});*/

			//TODO: ${} in attr
				// - detect start ${ + end }
				// - register elem + attr name
				// - replace. 
		}
		
		return super.prepareHTML(html);
	}

	override generate<Host extends LHost>(host: Host): HTMLElement | ShadowRoot {
		
		// https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
		if( this.data !== null) {
			const str = (this.data as string).replace(/\$\{(.+?)\}/g, (_, match) => encodeHTML(host.getAttribute(match) ?? '' ));
			super.setTemplate( super.prepareHTML(str)! );
		}

		const content = super.generate(host);

		/*
		// html magic values.
		// can be optimized...
		const values = content.querySelectorAll('liss[value]');
		for(let value of values)
			value.textContent = host.getAttribute(value.getAttribute('value')!)
		*/

		// css prop.
		const css_attrs = host.getAttributeNames().filter( e => e.startsWith('css-'));
		for(let css_attr of css_attrs)
			host.style.setProperty(`--${css_attr.slice('css-'.length)}`, host.getAttribute(css_attr));

		return content;
	}
}

declare module "../extends" {
    interface ILISS {
        importComponents : typeof importComponents;
        importComponent  : typeof importComponent;
        require          : typeof require;
    }
}

type importComponents_Opts<T extends HTMLElement> = {
	cdir   ?: string|null,
	brython?: boolean,
	host   ?: Constructor<T>
};

async function importComponents<T extends HTMLElement = HTMLElement>(
						components: string[],
						{
							cdir    = null,
							brython = false,
							// @ts-ignore
							host    = HTMLElement
						}: importComponents_Opts<T>) {

	const results: Record<string, LISSBaseCstr> = {};

	for(let tagname of components) {

		results[tagname] = await importComponent(tagname, {
			cdir,
			brython,
			host
		});
	}

	return results;
}

const bry_wrapper = `def wrapjs(js_klass):

    class Wrapper:

        _js_klass = js_klass
        _js = None

        def __init__(self, *args):
            self._js = js_klass.new(*args)

        def __getattr__(self, name: str):
            return self._js[name];

        def __setattr__(self, name: str, value):
            if name == "_js":
                super().__setattr__(name, value)
                return
            self._js[name] = value

    return Wrapper

`;

async function importComponent<T extends HTMLElement = HTMLElement>(
	tagname: string,
	{
		cdir    = null,
		brython = false,
		// @ts-ignore
		host    = HTMLElement,
		files   = {}
	}: importComponents_Opts<T> & {files?: Record<string, string>}
) {

	KnownTags.add(tagname);

	const compo_dir = `${cdir}${tagname}/`;

	if( brython ) {
		if( ! ("index.bry" in files) )
			files['index.bry'] = (await _fetchText(`${compo_dir}index.bry`, true))!;

		const code = bry_wrapper + files["index.bry"];

		files['index.js'] =
`const $B = globalThis.__BRYTHON__;
const result = $B.runPythonSource(\`${code}\`);

const imported = [...Object.values(__BRYTHON__.imported)];
const last = imported[imported.length-1];

export default last.WebComponent;

`;
	} else {
		if( ! ("index.js" in files) )
			files['index.js'] = (await _fetchText(`${compo_dir}index.js`, true))!;
	}

	const html = files["index.html"];
	const css  = files["index.css"];

	return await defineWebComponent(tagname, files, {html, css, host});
}

function require(url: URL|string): Promise<Response>|string {
	return fetch(url);
}


LISS.importComponents = importComponents;
LISS.importComponent  = importComponent;
LISS.require  = require;