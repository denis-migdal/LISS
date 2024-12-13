import { Class, Constructor, ShadowCfg, type LISSControlerCstr } from "./types";

import { LISSState } from "./state";
import { setCstrHost } from "./LISSControler";
import { ContentGenerator_Opts, ContentGeneratorCstr } from "./ContentGenerator";

// LISSHost must be build in define as it need to be able to build
// the defined subclass.

let id = 0;

const sharedCSS = new CSSStyleSheet();
export function getSharedCSS() {
	return sharedCSS;
}

let __cstr_controler  : any = null;

export function setCstrControler(_: any) {
	__cstr_controler = _;
}

type inferHostCstr<T> = T extends LISSControlerCstr<infer A extends Constructor<Class>, infer B extends Constructor<HTMLElement>> ? B : never;

export function buildLISSHost<	T extends LISSControlerCstr, U extends Constructor<HTMLElement> = inferHostCstr<T> >(
							Liss: T,
							// can't deduce : cause type deduction issues...
							hostCstr: U,
							content_generator_cstr: ContentGeneratorCstr,
							args             : ContentGenerator_Opts
						) {

	const content_generator = new content_generator_cstr(args);

	type HostCstr = U;
    type Host     = InstanceType<HostCstr>;

	class LISSHost extends hostCstr {

		static readonly Cfg = {
			host             : hostCstr,
			content_generator: content_generator_cstr,
			args
		}

		// adopt state if already created.
		readonly state = (this as any).state ?? new LISSState(this);

		// ============ DEPENDENCIES ==================================

		static readonly whenDepsResolved = content_generator.whenReady();
		static get isDepsResolved() {
			return content_generator.isReady;
		}

		// ============ INITIALIZATION ==================================
		static Controler = Liss;

		#controler: any|null = null;
		get controler() {
			return this.#controler;
		}

		get isInitialized() {
			return this.#controler !== null;
		}
		readonly whenInitialized: Promise<InstanceType<T>>;
		#whenInitialized_resolver;

		#params: any[];
		initialize(...params: any[]) {

			if( this.isInitialized )
				throw new Error('Element already initialized!');
            if( ! ( this.constructor as any).isDepsResolved )
                throw new Error("Dependencies hasn't been loaded !");

			if( params.length !== 0 ) {
				if( this.#params.length !== 0 )
					throw new Error('Cstr params has already been provided !');
				this.#params = params;
			}

			this.#controler = this.init();

			if( this.isConnected )
				this.#controler.connectedCallback();

			return this.#controler;
		}

		// ============== Content ===================

		#content: Host|ShadowRoot = this as Host;

		get content() {
			return this.#content;
		}

		getPart(name: string) {
			return this.hasShadow
					? this.#content?.querySelector(`::part(${name})`)
					: this.#content?.querySelector(`[part="${name}"]`);
		}
		getParts(name: string) {
			return this.hasShadow
					? this.#content?.querySelectorAll(`::part(${name})`)
					: this.#content?.querySelectorAll(`[part="${name}"]`);
		}

		override attachShadow(init: ShadowRootInit): ShadowRoot {
			const shadow = super.attachShadow(init);

			// @ts-ignore closed IS assignable to shadowMode...
			this.shadowMode = init.mode;

			this.#content = shadow;
			
			return shadow;
		}

		protected get hasShadow(): boolean {
			return this.shadowMode !== 'none';
		}

		/*** CSS ***/

		get CSSSelector() {

			if(this.hasShadow || ! this.hasAttribute("is") )
				return this.tagName;

			return `${this.tagName}[is="${this.getAttribute("is")}"]`;
		}

		// ============== Impl ===================

		constructor(...params: any[]) {
			super();

			this.#params = params;

			let {promise, resolve} = Promise.withResolvers<InstanceType<T>>();

			this.whenInitialized = promise;
			this.#whenInitialized_resolver = resolve;

			const controler = __cstr_controler;
			__cstr_controler = null;

			if( controler !== null) {
				this.#controler = controler;
				this.init(); // call the resolver
			}

			if( "_whenUpgradedResolve" in this)
				(this._whenUpgradedResolve as any)();
		}

		// ====================== DOM ===========================		

		disconnectedCallback() {
			if(this.controler !== null)
				this.controler.disconnectedCallback();
		}

		connectedCallback() {

			// TODO: life cycle options
			if( this.isInitialized ) {
				this.controler!.connectedCallback();
				return;
			}

			// TODO: life cycle options
			if( this.state.isReady ) {
				this.initialize(); // automatically calls onDOMConnected
				return;
			}

			( async () => {

				await this.state.isReady;

				if( ! this.isInitialized )
					this.initialize();

			})();
		}

		static observedAttributes = Liss.observedAttributes;
		attributeChangedCallback(name: string, oldValue: string|null, newValue: string|null) {
			if(this.#controler)
				this.#controler.attributeChangedCallback(name, oldValue, newValue);
		}

		shadowMode: ShadowCfg|null = null;

		private init() {

			// no needs to set this.#content (already host or set when attachShadow)
			content_generator.generate(this);

			//@ts-ignore
			//this.#content.addEventListener('click', onClickEvent);
			//@ts-ignore
			//this.#content.addEventListener('dblclick', onClickEvent);

			if( this.#controler === null) {
				// h4ck, okay because JS is monothreaded.
				setCstrHost(this);
				this.#controler = new LISSHost.Controler(...this.#params) as InstanceType<T>;
			}

			this.#whenInitialized_resolver(this.controler);

			return this.controler;
		}
	};

	return LISSHost;
}


