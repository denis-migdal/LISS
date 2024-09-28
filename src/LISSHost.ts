import { LISSState, upgradeSync } from "state";
import { setCstrHost } from "./LISSBase";
import { LISS_Opts, LISSBaseCstr } from "./types";
import { isDOMContentLoaded, waitDOMContentLoaded } from "./utils";

let id = 0;

type ComposeConstructor<T, U> = 
    [T, U] extends [new (a: infer O1) => infer R1,new (a: infer O2) => infer R2] ? {
        new (o: O1 & O2): R1 & R2
    } & Pick<T, keyof T> & Pick<U, keyof U> : never

type inferLISS<T> = T extends LISSBaseCstr<infer A, infer B, infer C, infer D> ? [A,B,C,D] : never;

//TODO: shadow utils ?
const sharedCSS = new CSSStyleSheet();

export function buildLISSHost<
                        T extends LISSBaseCstr>(Liss: T) {
	const {
		host,
		attrs,
		content,
		stylesheets,
		shadow,
	} = Liss.LISSCfg;

	type P = inferLISS<T>;
	//type ExtendsCstr = P[0];
	type Params      = P[1];
	type HostCstr    = P[2];
	type Attrs       = P[3];

    type Host   = InstanceType<HostCstr>;

    // attrs proxy
	const GET = Symbol('get');
	const SET = Symbol('set');

	const properties = Object.fromEntries( attrs.map(n => [n, {

		enumerable: true,
		get: function(): string|null      { return (this as unknown as Attributes)[GET](n); },
		set: function(value: string|null) { return (this as unknown as Attributes)[SET](n, value); }
	}]) );

	class Attributes {
        [x: string]: string|null;

        #data     : Record<Attrs, string|null>;
        #defaults : Record<Attrs, string|null>;
        #setter   : (name: Attrs, value: string|null) => void;

        [GET](name: Attrs) {
        	return this.#data[name] ?? this.#defaults[name] ?? null;
        };
        [SET](name: Attrs, value: string|null){
        	return this.#setter(name, value); // required to get a clean object when doing {...attrs}
        }

        constructor(data    : Record<Attrs, string|null>,
					defaults: Record<Attrs, string|null>,
        			setter  : (name: Attrs, value: string|null) => void) {

        	this.#data     = data;
			this.#defaults = defaults;
        	this.#setter = setter;

        	Object.defineProperties(this, properties);
        }
	}

	const alreadyDeclaredCSS = new Set();

    const waitReady = new Promise<void>( async (r) => {

        await waitDOMContentLoaded();
        await Promise.all(Liss.LISSCfg.deps);

        isReady = true;

        r();
    });

    // No deps and DOM already loaded.
    let isReady = Liss.LISSCfg.deps.length == 0 && isDOMContentLoaded();

	const params = Liss.LISSCfg.params; //Object.assign({}, Liss.LISSCfg.params, _params);

	//

	const whenDepsResolved = Promise.all(Liss.LISSCfg.deps);
	let isDepsResolved = false;
	( async () => {
		await whenDepsResolved;
		isDepsResolved = true;
	})();

	class LISSHostBase extends (host as new () => HTMLElement) {

		// adopt state if already created.
		readonly state = (this as any).state ?? new LISSState(this);

		// ============ DEPENDENCIES ==================================

		static readonly whenDepsResolved = whenDepsResolved;
		static get isDepsResolved() {
			return isDepsResolved;
		}

		// ============ INITIALIZATION ==================================
		static Base = Liss;

		#base: any|null = null;
		get base() {
			return this.#base;
		}

		get isInitialized() {
			return this.#base !== null;
		}
		readonly whenInitialized: Promise<InstanceType<T>>;
		#whenInitialized_resolver;

		initialize(params: Partial<Params> = {}) {

			if( this.isInitialized )
				throw new Error('Element already initialized!');
            if( ! ( this.constructor as any).isDepsResolved )
                throw new Error("Dependencies hasn't been loaded !");

			Object.assign(this.#params, params);

			const base = this.init();

			if( this.isConnected )
				(base as any).onDOMConnected();

			return this.#base = base;
		}

		// =================================
		readonly #params: Params = params;

		get params(): Params {
			return this.#params;
		}

        public updateParams(params: Partial<LISS_Opts["params"]>) {
			if( this.isInitialized )
                // @ts-ignore
				return this.base!.updateParams(params);

            // wil be given to constructor...
			Object.assign( this.#params, params );
		}
		// ============== Attributes ===================

		#attrs_flag = false;

		#attributes         = {} as Record<Attrs, string|null>;
		#attributesDefaults = {} as Record<Attrs, string|null>;
		#attrs = new Attributes(
			this.#attributes,
			this.#attributesDefaults,
			(name: Attrs, value:string|null) => {

				this.#attributes[name] = value;

				this.#attrs_flag = true; // do not trigger onAttrsChanged.
				if( value === null)
					this.removeAttribute(name);
				else
					this.setAttribute(name, value);
			}
		) as unknown as Record<Attrs, string|null>;

		setAttrDefault(name: Attrs, value: string|null) {
			if( value === null)
				delete this.#attributesDefaults[name];
			else
				this.#attributesDefaults[name] = value;
		}

		get attrs(): Readonly<Record<Attrs, string|null>> {

			return this.#attrs;
		}

		// ============== Content ===================

		#content: Host|ShadowRoot|null = null;

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

		protected get hasShadow(): boolean {
			return shadow !== 'none';
		}

		/*** CSS ***/

		get CSSSelector() {

			if(this.hasShadow || ! this.hasAttribute("is") )
				return this.tagName;

			return `${this.tagName}[is="${this.getAttribute("is")}"]`;
		}

		// ============== Impl ===================

		constructor(params: {}, base?: InstanceType<T>) {
			super();

			Object.assign(this.#params, params);

			let {promise, resolve} = Promise.withResolvers<InstanceType<T>>();

			this.whenInitialized = promise;
			this.#whenInitialized_resolver = resolve;

			if( base !== undefined) {
				this.#base = base;
				this.init(); // call the resolver
			}

			if( "_whenUpgradedResolve" in this)
				(this._whenUpgradedResolve as any)();
		}

		// ====================== DOM ===========================		

		disconnectedCallback() {
			(this.base! as any).onDOMDisconnected();
		}

		connectedCallback() {

			// TODO: life cycle options
			if( this.isInitialized ) {
				this.base!.onDOMConnected();
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

		private init() {
			
			customElements.upgrade(this);

            //TODO: wait parents/children depending on option...
			
			// shadow
			this.#content = this as unknown as Host;
			if( shadow !== 'none') {
				this.#content = this.attachShadow({mode: shadow});

				//@ts-ignore
				//this.#content.addEventListener('click', onClickEvent);
				//@ts-ignore
				//this.#content.addEventListener('dblclick', onClickEvent);
			}

			// attrs
			for(let obs of attrs!)
				this.#attributes[obs as Attrs] = this.getAttribute(obs);

			// css
			if( shadow !== 'none')
				(this.#content as ShadowRoot).adoptedStyleSheets.push(sharedCSS);
			if( stylesheets.length ) {

				if( shadow !== 'none')
					(this.#content as ShadowRoot).adoptedStyleSheets.push(...stylesheets);
				else {

					const cssselector = this.CSSSelector;

					// if not yet inserted :
					if( ! alreadyDeclaredCSS.has(cssselector) ) {
						
						let style = document.createElement('style');

						style.setAttribute('for', cssselector);

						let html_stylesheets = "";

						for(let style of stylesheets)
							for(let rule of style.cssRules)
								html_stylesheets += rule.cssText + '\n';

						style.innerHTML = html_stylesheets.replace(':host', `:is(${cssselector})`);

						document.head.append(style);

						alreadyDeclaredCSS.add(cssselector);
					}
				}
			}

			// content
			if( content !== undefined ) {
				let template_elem = document.createElement('template');
				// https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
				//let str = (content as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
	    		let str = (content as string);
				template_elem.innerHTML = str;
	    		this.#content.append(...template_elem.content.childNodes);
	    	}

	    	// build

	    	// h4ck, okay because JS is monothreaded.
			setCstrHost(this);
	    	let obj = this.base === null ? new Liss() : this.base;

			this.#base = obj as InstanceType<T>;

			// default slot
			if( this.hasShadow && this.#content.childNodes.length === 0 )
				this.#content.append( document.createElement('slot') );

			this.#whenInitialized_resolver(this.base);

			return this.base;
		}



		// attrs

		static observedAttributes = attrs;
		attributeChangedCallback(name    : Attrs,
								 oldValue: string,
								 newValue: string) {

			if(this.#attrs_flag) {
				this.#attrs_flag = false;
				return;
			}

			this.#attributes[name] = newValue;
			if( ! this.isInitialized )
				return;

			if( (this.base! as any).onAttrChanged(name, oldValue, newValue) === false) {
				this.#attrs[name] = oldValue; // revert the change.
			}
		}
	};

	return LISSHostBase as ComposeConstructor<typeof LISSHostBase, typeof host>;
}


