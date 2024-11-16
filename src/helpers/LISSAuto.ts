import { Constructor, LHost, ShadowCfg } from "../types";
import {LISS} from "../LISSBase";

import {define} from "../customRegistery";
import ContentGenerator from "../ContentGenerator";

// should be improved (but how ?)
const script = document.querySelector('script[autodir]');
if( script !== null ) {

	const RESSOURCES = [
		"index.js",
		"index.bry",
		"index.html",
		"index.css"
	];

	const KnownTags = new Set<string>();

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

		const tagname = ( tag.getAttribute('is') ?? tag.tagName ).toLowerCase();

		if( ! tagname.includes('-') || KnownTags.has( tagname ) )
			return;

		KnownTags.add(tagname);

		await SW; // ensure SW is installed.

		const filenames = RESSOURCES;
		const resources = await Promise.all( filenames.map( file => {
			const file_path = `${components_dir}${tagname}/${file}`;
			return file.endsWith('.js') ? _import   (file_path, true)
										: _fetchText(file_path, true);
		}));

		const files: Record<string, any> = {};
		for(let i = 0; i < filenames.length; ++i)
			if( resources[i] !== undefined)
				files[filenames[i]] = resources[i];

		const html = files["index.html"];
		const css  = files["index.css"];

		let host = HTMLElement;
		if( tag.hasAttribute('is') )
			host = tag.constructor as Constructor<HTMLElement>

		return defineWebComponent(tagname, files, {html, css, host});
		
	}


	function defineWebComponent(tagname: string, files: Record<string, any>, opts: {html: string, css: string, host: Constructor<HTMLElement>}) {

		const js      = files["index.js"];

		let klass: null| ReturnType<typeof LISS> = null;
		if( js !== undefined )
			klass = js(opts);
		else if( opts.html !== undefined ) {
			klass = LISS({
				...opts,
				content_generator: LISSAuto_ContentGenerator
			});
		}

		if(klass === null)
			throw new Error(`Missing files for WebComponent ${tagname}.`);

		return define(tagname, klass);
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
}

export class LISSAuto_ContentGenerator extends ContentGenerator {

	protected override prepareHTML(html?: DocumentFragment | HTMLElement | string): HTMLTemplateElement {
		
		if( typeof html === 'string' ) {
			html = html.replaceAll(/\$\{([\w]+)\}/g, (_, name: string) => {
				return `<liss value="${name}"></liss>`;
			});

			// https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
			//let str = (content as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')

			//TODO: ${} in attr
				// - detect start ${ + end }
				// - register elem + attr name
				// - replace. 
		}
		
		return super.prepareHTML(html);
	}

	override generate<Host extends LHost>(host: Host): HTMLElement | ShadowRoot {
		
		const content = super.generate(host);

		// html magic values.
		// can be optimized...
		const values = content.querySelectorAll('liss[value]');
		for(let value of values)
			value.textContent = host.getAttribute(value.getAttribute('value')!)

		// css prop.
		const css_attrs = host.getAttributeNames().filter( e => e.startsWith('css-'));
		for(let css_attr of css_attrs)
			host.style.setProperty(`--${css_attr.slice('css-'.length)}`, host.getAttribute(css_attr));

		return content;
	}
}