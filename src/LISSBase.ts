import { LHostCstr, type Class, type Constructor, type LISS_Opts } from "./types";
import type { LISSState } from "./state";

import { buildLISSHost, setCstrBase } from "./LISSHost";
import { _element2tagname} from "./utils";
import ContentGenerator from "./ContentGenerator";

let __cstr_host  : any = null;

export function setCstrHost(_: any) {
	__cstr_host = _;
}

export function LISS<
	ExtendsCtr extends Constructor<Class>  = Constructor<Class>,
	// HTML Base
	HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>
>(args: Partial<LISS_Opts<ExtendsCtr, HostCstr>> = {}) {

	let {
		/* extends is a JS reserved keyword. */
		extends: _extends = Object      as unknown as ExtendsCtr,
		host              = HTMLElement as unknown as HostCstr,
	
		content_generator = ContentGenerator,
	} = args;
	
	class LISSBase extends _extends {

		constructor(...args: any[]) { // required by TS, we don't use it...

			super(...args);

			// h4ck, okay because JS is monothreaded.
			if( __cstr_host === null ) {
				setCstrBase(this);
				__cstr_host = new (this.constructor as any).Host(...args);
			}
			this.#host = __cstr_host;
			__cstr_host = null;
		}

		//TODO: do I really need to expose such structure here ?
		static get state(): LISSState {
			return this.Host.state;
		}

		get state(): LISSState {
			return this.#host.state;
		}

		//TODO: get the real type ?
		protected get content(): InstanceType<HostCstr>|ShadowRoot {

			try {
				this.#host.content!;
			} catch(e) {
				console.warn(e);
			}

			return this.#host.content!;
		}

		static observedAttributes: string[] = [];
		attributeChangedCallback(name: string, oldValue: string|null, newValue: string|null) {}

		protected connectedCallback() {}
		protected disconnectedCallback() {}
		public get isConnected() {
			return this.host.isConnected;
		}

		readonly #host: InstanceType<LHostCstr<HostCstr>>;
		public get host(): InstanceType<HostCstr> {
			return this.#host;
		}

		protected static _Host: LHostCstr<HostCstr>;
		static get Host() {
			if( this._Host === undefined) {
				// @ts-ignore: fuck off.
				this._Host = buildLISSHost( this,
											host,
											content_generator,
											args);
			}
			return this._Host;
		}
	}

	return LISSBase;
}