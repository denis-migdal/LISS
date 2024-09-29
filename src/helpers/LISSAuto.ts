import { ShadowCfg } from "types";
import LISS from "../LISSBase";

import {define} from "../state";
import { html } from "./build";

export class LISS_Auto extends LISS({
	attrs: ["src", "sw"],
	shadow: ShadowCfg.NONE,
	css: `:host { display: none; }`
}) {

	readonly #known_tag = new Set<string>();
	readonly #directory: string;
	readonly #sw: Promise<void>;

	constructor() {

		super();

		this.#sw = new Promise( async (resolve) => {
			
			await navigator.serviceWorker.register(this.attrs.sw ?? "/sw.js", {scope: "/"});

			if( navigator.serviceWorker.controller ) {
				resolve();
				return;
			}

			navigator.serviceWorker.addEventListener('controllerchange', () => {
				resolve();
			});
		});


		const src = this.attrs.src;
		if(src === null)
			throw new Error("src attribute is missing.");
		this.#directory = src[0] === '.'
								? `${window.location.pathname}${src}`
								: src;

		new MutationObserver( (mutations) => {

			for(let mutation of mutations)
				for(let addition of mutation.addedNodes)
					if(addition instanceof Element)
						this.#addTag(addition.tagName)

		}).observe( document, { childList:true, subtree:true });


		for( let elem of document.querySelectorAll("*") )
			this.#addTag(elem.tagName);
	}


    protected resources() {
		return [
			"index.js",
			"index.html",
			"index.css"
		];
    }

	protected defineWebComponent(tagname: string, files: Record<string, any>, opts: Partial<{content: string, css: string}>) {

		const js = files["index.js"];
		const content = files["index.html"];

		let klass: null| ReturnType<typeof LISS> = null;
		if( js !== undefined )
			klass = js(opts);
		else if( content !== undefined ) {

			(opts as any).content_factory = (str: string) => {

				const content = html`${str}`;

				let spans = content.querySelectorAll('span[value]');

				return (_a: unknown, _b:unknown, elem: HTMLElement) => {

					// can be optimized...
					for(let span of spans)
						span.textContent = elem.getAttribute(span.getAttribute('value')!)

					return content.cloneNode(true);
				};

			};

			klass = class WebComponent extends LISS(opts) {};
		}

		if(klass === null)
			throw new Error(`Missing files for WebComponent ${tagname}.`);

		return define(tagname, klass);
	}

	async #addTag(tagname: string) {

		tagname = tagname.toLowerCase();

		if( tagname === 'liss-auto' || tagname === 'bliss-auto' || ! tagname.includes('-') || this.#known_tag.has( tagname ) )
			return;

		this.#known_tag.add(tagname);

		await this.#sw; // ensure SW is installed.

		const filenames = this.resources();
		const resources = await Promise.all( filenames.map( file => file.endsWith('.js')
													? _import   (`${this.#directory}/${tagname}/${file}`, true)
													: _fetchText(`${this.#directory}/${tagname}/${file}`, true) ) );

		const files: Record<string, any> = {};
		for(let i = 0; i < filenames.length; ++i)
			if( resources[i] !== undefined)
				files[filenames[i]] = resources[i];

		const content = files["index.html"];
		const css     = files["index.css"];

		const opts: Partial<{content: string, css: string}> = {
			...content !== undefined && {content},
			...css     !== undefined && {css},
		};

		return this.defineWebComponent(tagname, files, opts);
		
	}
}
define("liss-auto", LISS_Auto);

//TODO: fix...
export interface Components {
	"liss-auto": LISS_Auto
};

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