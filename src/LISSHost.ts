import { setCstrHost } from "LISSBase";
import { LISS_Opts, LISSReturnType } from "types";
import { isDOMContentLoaded, waitDOMContentLoaded } from "utils";

let id = 0;

export function buildLISSHost<Opts extends LISS_Opts,
                       T extends LISSReturnType<Opts>>(Liss: T, _params: Partial<Opts["params"]> = {}) {
	const {
		host,
		attrs,
		content,
		stylesheets,
		shadow,
	} = Liss.LISSCfg;

    type Params = Opts["params"];
    type Attrs  = Opts["attrs"][number];
    type Host   = InstanceType<Opts["host"]>;

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

	// @ts-ignore : because TS is stupid.
	class LISSHostBase extends host {

		readonly #params: Params;

		readonly #id = ++id; // for debug

		constructor(params: Partial<Params> = {}) {
			super();
			this.#params = Object.assign({}, Liss.LISSCfg.params, _params, params);

			this.#waitInit = new Promise( (resolve) => {
				/*if(this.isInit) - not possible
					return resolve(this.#API!);*/
				this.#resolve = resolve;
			});
		}

		/**** public API *************/

        static get waitReady() {
            return waitReady;
        }
        static get isReady() {
            return isReady;
        }

        get waitReady() {
            return LISSHostBase.waitReady;
        }
        get isReady() {
            return LISSHostBase.isReady;
        }

		get isInit() {
			return this.#API !== null;
		}
		initialize(params: Partial<Params> = {}) {

			if( this.isInit )
				throw new Error('Element already initialized!');
            if( ! this.isReady )
                throw new Error("Dependencies hasn't been loaded !");

			Object.assign(this.#params, params);

			const api = this.init();

			if( this.#isInDOM )
				(api as any).onDOMConnected();

			return api;
		}

		get LISSSync() {
			if( ! this.isInit )
				throw new Error('Accessing API before WebComponent initialization!');
			return this.#API!;
		}
		get LISS() {
			return this.#waitInit;
		}

		/*** init ***/
		#waitInit: Promise<InstanceType<T>>;
		#resolve: ((u: InstanceType<T>) => void) | null = null;
		#API: InstanceType<T> | null = null;

		#isInDOM = false; // could also use isConnected...
		get isInDOM() {
			return this.#isInDOM;
		}

		disconnectedCallback() {
			this.#isInDOM = false;
			(this.#API! as any).onDOMDisconnected();
		}

		connectedCallback() {

			this.#isInDOM = true;
	
			if( ! this.isInit ) {// TODO: if option init each time...
				if( ! this.isReady ) {
                    (async ()=>{
                        await this.waitReady;
                        if( this.isInDOM)
                            (this.#API! as any).onDOMConnected();
                    })();
                    return;
                }
                this.init();
            }

			(this.#API! as any).onDOMConnected();
		}

		private init() {
			
			customElements.upgrade(this);

            //TODO: wait parents/children depending on option...
			
			// shadow
			this.#content = this as unknown as Host;
			if( shadow !== 'none') {
				this.#content = this.attachShadow({mode: shadow});

				//@ts-ignore
				this.#content.addEventListener('click', onClickEvent);
				//@ts-ignore
				this.#content.addEventListener('dblclick', onClickEvent);
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
				let str = (content as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
	    		template_elem.innerHTML = str;
	    		this.#content.append(...template_elem.content.childNodes);
	    	}

	    	// build

	    	// h4ck, okay because JS is monothreaded.
			setCstrHost(this);

	    	let obj = new Liss();

			this.#API = obj as InstanceType<T>;

			// default slot
			if( this.hasShadow && this.#content.childNodes.length === 0 )
				this.#content.append( document.createElement('slot') );

			if( this.#resolve !== null)
				this.#resolve(this.#API);

			return this.#API;
		}

		get params(): Params {
			return this.#params;
		}
        
        public updateParams(params: Partial<LISS_Opts["params"]>) {
			if( this.isInit )
				return this.#API!.updateParams(params);

            // wil be given to constructor...
			Object.assign( this.#params, params );
		}


		/*** content ***/
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

		/*** attrs ***/
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

		static observedAttributes = attrs;
		attributeChangedCallback(name    : Attrs,
								 oldValue: string,
								 newValue: string) {

			if(this.#attrs_flag) {
				this.#attrs_flag = false;
				return;
			}

			this.#attributes[name] = newValue;
			if( ! this.isInit )
				return;

			if( (this.#API! as any).onAttrChanged(name, oldValue, newValue) === false) {
				this.#attrs[name] = oldValue; // revert the change.
			}
		}
	};

	return LISSHostBase;
}