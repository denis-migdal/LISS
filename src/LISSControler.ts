import { LHostCstr, type Class, type Constructor, type LISS_Opts } from "./types";
import type { LISSState } from "./state";

import { buildLISSHost, setCstrControler } from "./LISSHost";
import { _element2tagname} from "./utils";
import ContentGenerator from "./ContentGenerator";

/****/

interface IControler<
	ExtendsCstr extends Constructor<Class>       = Constructor<Class>,
	HostCstr    extends Constructor<HTMLElement> = Constructor<HTMLElement>
> {
	// non-vanilla JS
		readonly host: InstanceType<HostCstr>;

	// vanilla JS
		readonly isConnected  :boolean;
};
	// + protected
		// readonly .content: InstanceType<HostCstr>|ShadowRoot;
	// vanilla JS
		// attributeChangedCallback(name: string, oldValue: string|null, newValue: string|null): void;
		// connectedCallback   (): void;
		// disconnectedCallback(): void;

interface IControlerCstr<
	ExtendsCstr extends Constructor<Class>       = Constructor<Class>,
	HostCstr    extends Constructor<HTMLElement> = Constructor<HTMLElement>
> {
	new(): IControler<ExtendsCstr, HostCstr>;

	// vanilla JS
		readonly observedAttributes: string[];
}
	// + "private"
		// readonly Host: HostCstr

export type Controler<
	ExtendsCstr extends Constructor<Class>       = Constructor<Class>,
	HostCstr    extends Constructor<HTMLElement> = Constructor<HTMLElement>
> = IControler<ExtendsCstr, HostCstr> & InstanceType<ExtendsCstr>;

export type ControlerCstr<
	ExtendsCstr extends Constructor<Class>       = Constructor<Class>,
	HostCstr    extends Constructor<HTMLElement> = Constructor<HTMLElement>
> = IControlerCstr<ExtendsCstr, HostCstr> & ExtendsCstr;

/****/

let __cstr_host  : any = null;

export function setCstrHost(_: any) {
	__cstr_host = _;
}

export function LISS<
	ExtendsCstr extends Constructor<Class>       = Constructor<Class>,
	HostCstr    extends Constructor<HTMLElement> = Constructor<HTMLElement>
>(args: Partial<LISS_Opts<ExtendsCstr, HostCstr>> = {}) {

	let {
		/* extends is a JS reserved keyword. */
		extends: _extends = Object      as unknown as ExtendsCstr,
		host              = HTMLElement as unknown as HostCstr,
	
		content_generator = ContentGenerator,
	} = args;
	
	class LISSControler extends _extends implements IControler<ExtendsCstr, HostCstr>{

		constructor(...args: any[]) { // required by TS, we don't use it...

			super(...args);

			// h4ck, okay because JS is monothreaded.
			if( __cstr_host === null ) {
				setCstrControler(this);
				__cstr_host = new (this.constructor as any).Host(...args);
			}
			this.#host = __cstr_host;
			__cstr_host = null;
		}

		//TODO: get the real type ?
		protected get content(): InstanceType<HostCstr>|ShadowRoot {
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

		// for debug purposes ?
		static get state(): LISSState {
			return this.Host.state;
		}

		get state(): LISSState {
			return this.#host.state;
		}
	}

	return LISSControler satisfies ControlerCstr<ExtendsCstr, HostCstr>;
}