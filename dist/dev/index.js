/******/ var __webpack_modules__ = ({

/***/ "./src/LISSBase.ts":
/*!*************************!*\
  !*** ./src/LISSBase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CONTENT_FACTORY: () => (/* binding */ DEFAULT_CONTENT_FACTORY),
/* harmony export */   ILISS: () => (/* binding */ ILISS),
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setCstrHost: () => (/* binding */ setCstrHost)
/* harmony export */ });
/* harmony import */ var LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! LISSHost */ "./src/LISSHost.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var helpers_build__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! helpers/build */ "./src/helpers/build.ts");




let __cstr_host = null;
function setCstrHost(_) {
    __cstr_host = _;
}
function DEFAULT_CONTENT_FACTORY(content) {
    if (typeof content === "string") {
        content = content.trim();
        if (content.length === 0) content = undefined;
        if (content !== undefined) content = (0,helpers_build__WEBPACK_IMPORTED_MODULE_3__.html)`${content}`;
    // TODO LISSAuto parser...
    // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
    //let str = (content as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
    }
    if (content instanceof HTMLTemplateElement) content = content.content;
    return ()=>content?.cloneNode(true);
}
class ILISS {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISS);
function LISS({ // JS Base
extends: _extends = Object, /* extends is a JS reserved keyword. */ params = {}, // non-generic
deps = [], life_cycle = _types__WEBPACK_IMPORTED_MODULE_1__.LifeCycle.DEFAULT, // HTML Base
host = HTMLElement, observedAttributes = [], attrs = observedAttributes, // non-generic
content, content_factory: _content_factory = DEFAULT_CONTENT_FACTORY, css, shadow = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host) ? _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.CLOSE : _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE } = {}) {
    if (shadow !== _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.OPEN && !(0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host)) throw new Error(`Host element ${(0,_utils__WEBPACK_IMPORTED_MODULE_2__._element2tagname)(host)} does not support ShadowRoot`);
    const all_deps = [
        ...deps
    ];
    let content_factory;
    // content processing
    if (content instanceof Promise || content instanceof Response) {
        let _content = content;
        content = null;
        all_deps.push((async ()=>{
            _content = await _content;
            if (_content instanceof Response) _content = await _content.text();
            LISSBase.LISSCfg.content_factory = _content_factory(_content);
        })());
    } else {
        content_factory = _content_factory(content);
    }
    // CSS processing
    let stylesheets = [];
    if (css !== undefined) {
        if (!Array.isArray(css)) // @ts-ignore : todo: LISSOpts => should not be a generic ?
        css = [
            css
        ];
        // @ts-ignore
        stylesheets = css.map((c, idx)=>{
            if (c instanceof Promise || c instanceof Response) {
                all_deps.push((async ()=>{
                    c = await c;
                    if (c instanceof Response) c = await c.text();
                    stylesheets[idx] = process_css(c);
                })());
                return null;
            }
            return process_css(c);
        });
    }
    class LISSBase extends _extends {
        constructor(...args){
            super(...args);
            // h4ck, okay because JS is monothreaded.
            if (__cstr_host === null) __cstr_host = new this.constructor.Host({}, this);
            this.#host = __cstr_host;
            __cstr_host = null;
        }
        #host;
        // LISS Configs
        static LISSCfg = {
            host,
            deps,
            attrs,
            params,
            content_factory,
            stylesheets,
            shadow
        };
        get state() {
            return this.#host.state;
        }
        get host() {
            return this.#host;
        }
        //TODO: get the real type ?
        get content() {
            return this.#host.content;
        }
        // attrs
        get attrs() {
            return this.#host.attrs;
        }
        setAttrDefault(attr, value) {
            return this.#host.setAttrDefault(attr, value);
        }
        onAttrChanged(_name, _oldValue, _newValue) {}
        // for vanilla compat.
        get observedAttributes() {
            return this.attrs;
        }
        attributeChangedCallback(...args) {
            this.onAttrChanged(...args);
        }
        // parameters
        get params() {
            return this.#host.params;
        }
        updateParams(params) {
            Object.assign(this.#host.params, params);
        }
        // DOM
        get isInDOM() {
            return this.#host.isConnected;
        }
        onDOMConnected() {
            this.connectedCallback();
        }
        onDOMDisconnected() {
            this.disconnectedCallback();
        }
        // for vanilla compat
        connectedCallback() {}
        disconnectedCallback() {}
        get isConnected() {
            return this.isInDOM;
        }
        static _Host;
        static get Host() {
            if (this._Host === undefined) this._Host = (0,LISSHost__WEBPACK_IMPORTED_MODULE_0__.buildLISSHost)(this); //TODO: fix type error (why???)
            return this._Host;
        }
    }
    return LISSBase;
}
function process_css(css) {
    if (css instanceof CSSStyleSheet) return css;
    if (css instanceof HTMLStyleElement) return css.sheet;
    let style = new CSSStyleSheet();
    if (typeof css === "string") {
        style.replaceSync(css); // replace() if issues
        return style;
    }
    throw new Error("Should not occurs");
}


/***/ }),

/***/ "./src/LISSHost.ts":
/*!*************************!*\
  !*** ./src/LISSHost.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildLISSHost: () => (/* binding */ buildLISSHost)
/* harmony export */ });
/* harmony import */ var state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! state */ "./src/state.ts");
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



let id = 0;
//TODO: shadow utils ?
const sharedCSS = new CSSStyleSheet();
function buildLISSHost(Liss) {
    const { host, attrs, content_factory, stylesheets, shadow } = Liss.LISSCfg;
    // attrs proxy
    const GET = Symbol('get');
    const SET = Symbol('set');
    const properties = Object.fromEntries(attrs.map((n)=>[
            n,
            {
                enumerable: true,
                get: function() {
                    return this[GET](n);
                },
                set: function(value) {
                    return this[SET](n, value);
                }
            }
        ]));
    class Attributes {
        #data;
        #defaults;
        #setter;
        [GET](name) {
            return this.#data[name] ?? this.#defaults[name] ?? null;
        }
        [SET](name, value) {
            return this.#setter(name, value); // required to get a clean object when doing {...attrs}
        }
        constructor(data, defaults, setter){
            this.#data = data;
            this.#defaults = defaults;
            this.#setter = setter;
            Object.defineProperties(this, properties);
        }
    }
    const alreadyDeclaredCSS = new Set();
    const waitReady = new Promise(async (r)=>{
        await (0,_utils__WEBPACK_IMPORTED_MODULE_2__.waitDOMContentLoaded)();
        await Promise.all(Liss.LISSCfg.deps);
        isReady = true;
        r();
    });
    // No deps and DOM already loaded.
    let isReady = Liss.LISSCfg.deps.length == 0 && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isDOMContentLoaded)();
    const params = Liss.LISSCfg.params; //Object.assign({}, Liss.LISSCfg.params, _params);
    //
    const whenDepsResolved = Promise.all(Liss.LISSCfg.deps);
    let isDepsResolved = false;
    (async ()=>{
        await whenDepsResolved;
        isDepsResolved = true;
    })();
    class LISSHostBase extends host {
        // adopt state if already created.
        state = this.state ?? new state__WEBPACK_IMPORTED_MODULE_0__.LISSState(this);
        // ============ DEPENDENCIES ==================================
        static whenDepsResolved = whenDepsResolved;
        static get isDepsResolved() {
            return isDepsResolved;
        }
        // ============ INITIALIZATION ==================================
        static Base = Liss;
        #base = null;
        get base() {
            return this.#base;
        }
        get isInitialized() {
            return this.#base !== null;
        }
        whenInitialized;
        #whenInitialized_resolver;
        initialize(params = {}) {
            if (this.isInitialized) throw new Error('Element already initialized!');
            if (!this.constructor.isDepsResolved) throw new Error("Dependencies hasn't been loaded !");
            Object.assign(this.#params, params);
            this.#base = this.init();
            if (this.isConnected) this.#base.onDOMConnected();
            return this.#base;
        }
        // =================================
        #params = params;
        get params() {
            return this.#params;
        }
        updateParams(params) {
            if (this.isInitialized) // @ts-ignore
            return this.base.updateParams(params);
            // wil be given to constructor...
            Object.assign(this.#params, params);
        }
        // ============== Attributes ===================
        #attrs_flag = false;
        #attributes = {};
        #attributesDefaults = {};
        #attrs = new Attributes(this.#attributes, this.#attributesDefaults, (name, value)=>{
            this.#attributes[name] = value;
            this.#attrs_flag = true; // do not trigger onAttrsChanged.
            if (value === null) this.removeAttribute(name);
            else this.setAttribute(name, value);
        });
        setAttrDefault(name, value) {
            if (value === null) delete this.#attributesDefaults[name];
            else this.#attributesDefaults[name] = value;
        }
        get attrs() {
            return this.#attrs;
        }
        // ============== Content ===================
        #content = null;
        get content() {
            return this.#content;
        }
        getPart(name) {
            return this.hasShadow ? this.#content?.querySelector(`::part(${name})`) : this.#content?.querySelector(`[part="${name}"]`);
        }
        getParts(name) {
            return this.hasShadow ? this.#content?.querySelectorAll(`::part(${name})`) : this.#content?.querySelectorAll(`[part="${name}"]`);
        }
        get hasShadow() {
            return shadow !== 'none';
        }
        /*** CSS ***/ get CSSSelector() {
            if (this.hasShadow || !this.hasAttribute("is")) return this.tagName;
            return `${this.tagName}[is="${this.getAttribute("is")}"]`;
        }
        // ============== Impl ===================
        constructor(params, base){
            super();
            Object.assign(this.#params, params);
            let { promise, resolve } = Promise.withResolvers();
            this.whenInitialized = promise;
            this.#whenInitialized_resolver = resolve;
            if (base !== undefined) {
                this.#base = base;
                this.init(); // call the resolver
            }
            if ("_whenUpgradedResolve" in this) this._whenUpgradedResolve();
        }
        // ====================== DOM ===========================		
        disconnectedCallback() {
            this.base.onDOMDisconnected();
        }
        connectedCallback() {
            // TODO: life cycle options
            if (this.isInitialized) {
                this.base.onDOMConnected();
                return;
            }
            // TODO: life cycle options
            if (this.state.isReady) {
                this.initialize(); // automatically calls onDOMConnected
                return;
            }
            (async ()=>{
                await this.state.isReady;
                if (!this.isInitialized) this.initialize();
            })();
        }
        init() {
            customElements.upgrade(this);
            //TODO: wait parents/children depending on option...
            // shadow
            this.#content = this;
            if (shadow !== 'none') {
                this.#content = this.attachShadow({
                    mode: shadow
                });
            //@ts-ignore
            //this.#content.addEventListener('click', onClickEvent);
            //@ts-ignore
            //this.#content.addEventListener('dblclick', onClickEvent);
            }
            // attrs
            for (let obs of attrs)this.#attributes[obs] = this.getAttribute(obs);
            // css
            if (shadow !== 'none') this.#content.adoptedStyleSheets.push(sharedCSS);
            if (stylesheets.length) {
                if (shadow !== 'none') this.#content.adoptedStyleSheets.push(...stylesheets);
                else {
                    const cssselector = this.CSSSelector;
                    // if not yet inserted :
                    if (!alreadyDeclaredCSS.has(cssselector)) {
                        let style = document.createElement('style');
                        style.setAttribute('for', cssselector);
                        let html_stylesheets = "";
                        for (let style of stylesheets)for (let rule of style.cssRules)html_stylesheets += rule.cssText + '\n';
                        style.innerHTML = html_stylesheets.replace(':host', `:is(${cssselector})`);
                        document.head.append(style);
                        alreadyDeclaredCSS.add(cssselector);
                    }
                }
            }
            // content
            const content = content_factory(this.attrs, this.params);
            if (content !== undefined) this.#content.append(content);
            // build
            // h4ck, okay because JS is monothreaded.
            (0,_LISSBase__WEBPACK_IMPORTED_MODULE_1__.setCstrHost)(this);
            let obj = this.base === null ? new Liss() : this.base;
            this.#base = obj;
            // default slot
            if (this.hasShadow && this.#content.childNodes.length === 0) this.#content.append(document.createElement('slot'));
            this.#whenInitialized_resolver(this.base);
            return this.base;
        }
        // attrs
        static observedAttributes = attrs;
        attributeChangedCallback(name, oldValue, newValue) {
            if (this.#attrs_flag) {
                this.#attrs_flag = false;
                return;
            }
            this.#attributes[name] = newValue;
            if (!this.isInitialized) return;
            if (this.base.onAttrChanged(name, oldValue, newValue) === false) {
                this.#attrs[name] = oldValue; // revert the change.
            }
        }
    }
    ;
    return LISSHostBase;
}


/***/ }),

/***/ "./src/helpers/build.ts":
/*!******************************!*\
  !*** ./src/helpers/build.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* binding */ html),
/* harmony export */   liss: () => (/* binding */ liss),
/* harmony export */   lissSync: () => (/* binding */ lissSync)
/* harmony export */ });
/* harmony import */ var state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! state */ "./src/state.ts");

function html(str, ...args) {
    let string = str[0];
    for(let i = 0; i < args.length; ++i){
        string += `${args[i]}`;
        string += `${str[i + 1]}`;
    //TODO: more pre-processes
    }
    // using template prevents CustomElements upgrade...
    let template = document.createElement('template');
    // Never return a text node of whitespace as the result
    template.innerHTML = string.trim();
    if (template.content.children.length === 1) return template.content.firstChild;
    return template.content;
}
async function liss(str, ...args) {
    const elem = html(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return await (0,state__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
}
function lissSync(str, ...args) {
    const elem = html(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return (0,state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
}
 //async function build<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Promise<Components[T]>;
 /*
async function build<T extends LISSBase>(tagname: string, options?: BUILD_OPTIONS<T>): Promise<T>;
async function build<T extends LISSBase>(tagname: string, {
              params    = {},
              initialize= true,
              content   = [],
              parent    = undefined,
              id 		  = undefined,
              classes   = [],
              cssvars   = {},
              attrs     = {},
              data 	  = {},
              listeners = {}
              }: BUILD_OPTIONS<T> = {}): Promise<T> {

  if( ! initialize && parent === null)
    throw new Error("A parent must be given if initialize is false");

  let CustomClass = await customElements.whenDefined(tagname);
  let elem = new CustomClass(params) as LISSHost<T>;

  // Fix issue #2
  if( elem.tagName.toLowerCase() !== tagname )
  elem.setAttribute("is", tagname);

  if( id !== undefined )
  elem.id = id;

  if( classes.length > 0)
  elem.classList.add(...classes);

  for(let name in cssvars)
  elem.style.setProperty(`--${name}`, cssvars[name]);

  for(let name in attrs) {

  let value = attrs[name];
  if( typeof value === "boolean")
  elem.toggleAttribute(name, value);
  else
  elem.setAttribute(name, value);
  }

  for(let name in data) {

  let value = data[name];
  if( value === false)
  delete elem.dataset[name];
  else if(value === true)
  elem.dataset[name] = "";
  else
  elem.dataset[name] = value;
  }

  if( ! Array.isArray(content) )
  content = [content as any];
  elem.replaceChildren(...content);

  for(let name in listeners)
  elem.addEventListener(name, listeners[name]);

  if( parent !== undefined )
  parent.append(elem);

  if( ! elem.isInit && initialize )
  return await LISS.initialize(elem);

  return await LISS.getLISS(elem);
}
LISS.build = build;


function buildSync<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Components[T];
function buildSync<T extends LISSBase<any,any,any,any>>(tagname: string, options?: BUILD_OPTIONS<T>): T;
function buildSync<T extends LISSBase<any,any,any,any>>(tagname: string, {
params    = {},
initialize= true,
content   = [],
parent    = undefined,
id 		  = undefined,
classes   = [],
cssvars   = {},
attrs     = {},
data 	  = {},
listeners = {}
}: BUILD_OPTIONS<T> = {}): T {

if( ! initialize && parent === null)
throw new Error("A parent must be given if initialize is false");

let CustomClass = customElements.get(tagname);
if(CustomClass === undefined)
throw new Error(`${tagname} not defined`);
let elem = new CustomClass(params) as LISSHost<T>;

//TODO: factorize...

// Fix issue #2
if( elem.tagName.toLowerCase() !== tagname )
elem.setAttribute("is", tagname);

if( id !== undefined )
elem.id = id;

if( classes.length > 0)
elem.classList.add(...classes);

for(let name in cssvars)
elem.style.setProperty(`--${name}`, cssvars[name]);

for(let name in attrs) {

let value = attrs[name];
if( typeof value === "boolean")
elem.toggleAttribute(name, value);
else
elem.setAttribute(name, value);
}

for(let name in data) {

let value = data[name];
if( value === false)
delete elem.dataset[name];
else if(value === true)
elem.dataset[name] = "";
else
elem.dataset[name] = value;
}

if( ! Array.isArray(content) )
content = [content as any];
elem.replaceChildren(...content);

for(let name in listeners)
elem.addEventListener(name, listeners[name]);

if( parent !== undefined )
parent.append(elem);

if( ! elem.isInit && initialize )
LISS.initializeSync(elem);

return LISS.getLISSSync(elem);
}
LISS.buildSync = buildSync;
*/ 

/***/ }),

/***/ "./src/state.ts":
/*!**********************!*\
  !*** ./src/state.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFINED: () => (/* binding */ DEFINED),
/* harmony export */   INITIALIZED: () => (/* binding */ INITIALIZED),
/* harmony export */   LISSState: () => (/* binding */ LISSState),
/* harmony export */   READY: () => (/* binding */ READY),
/* harmony export */   UPGRADED: () => (/* binding */ UPGRADED),
/* harmony export */   define: () => (/* binding */ define),
/* harmony export */   getName: () => (/* binding */ getName),
/* harmony export */   getState: () => (/* binding */ getState),
/* harmony export */   initialize: () => (/* binding */ initialize),
/* harmony export */   initializeSync: () => (/* binding */ initializeSync),
/* harmony export */   upgrade: () => (/* binding */ upgrade),
/* harmony export */   upgradeSync: () => (/* binding */ upgradeSync),
/* harmony export */   whenInitialized: () => (/* binding */ whenInitialized),
/* harmony export */   whenUpgraded: () => (/* binding */ whenUpgraded)
/* harmony export */ });
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! utils */ "./src/utils.ts");

var State;
(function(State) {
    State[State["NONE"] = 0] = "NONE";
    // class
    State[State["DEFINED"] = 1] = "DEFINED";
    State[State["READY"] = 2] = "READY";
    // instance
    State[State["UPGRADED"] = 4] = "UPGRADED";
    State[State["INITIALIZED"] = 8] = "INITIALIZED";
})(State || (State = {}));
const DEFINED = 1;
const READY = 2;
const UPGRADED = 4;
const INITIALIZED = 8;
class LISSState {
    #elem;
    // if null : class state, else instance state
    constructor(elem = null){
        this.#elem = elem;
    }
    static DEFINED = DEFINED;
    static READY = READY;
    static UPGRADED = UPGRADED;
    static INITIALIZED = INITIALIZED;
    is(state) {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        if (state & DEFINED && !this.isDefined) return false;
        if (state & READY && !this.isReady) return false;
        if (state & UPGRADED && !this.isUpgraded) return false;
        if (state & INITIALIZED && !this.isInitialized) return false;
        return true;
    }
    async when(state) {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        let promises = new Array();
        if (state & DEFINED) promises.push(this.whenDefined());
        if (state & READY) promises.push(this.whenReady());
        if (state & UPGRADED) promises.push(this.whenUpgraded());
        if (state & INITIALIZED) promises.push(this.whenInitialized());
        await Promise.all(promises);
    }
    // ================== DEFINED ==============================
    get isDefined() {
        if (this.#elem === null) throw new Error('not implemented');
        return customElements.get(getName(this.#elem)) !== undefined;
    }
    async whenDefined() {
        if (this.#elem === null) throw new Error('not implemented');
        return await customElements.whenDefined(getName(this.#elem));
    }
    // ================== READY ==============================
    get isReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const Host = getHostCstrSync(elem);
        if (!(0,utils__WEBPACK_IMPORTED_MODULE_0__.isDOMContentLoaded)()) return false;
        return Host.isDepsResolved;
    }
    async whenReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        const host = await this.whenDefined(); // could be ready before defined, but well...
        await utils__WEBPACK_IMPORTED_MODULE_0__.whenDOMContentLoaded;
        await host.whenDepsResolved;
    }
    // ================== UPGRADED ==============================
    get isUpgraded() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const host = getHostCstrSync(elem);
        return elem instanceof host;
    }
    async whenUpgraded() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        const host = await this.whenDefined();
        if (elem instanceof host) return elem;
        // h4ck
        if ("_whenUpgraded" in elem) {
            await elem._whenUpgraded;
            return elem;
        }
        const { promise, resolve } = Promise.withResolvers();
        elem._whenUpgraded = promise;
        elem._whenUpgradedResolve = resolve;
        await promise;
        return elem;
    }
    // ================== INITIALIZED ==============================
    get isInitialized() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        if (!this.isUpgraded) return false;
        return "isInitialized" in elem && elem.isInitialized;
    }
    async whenInitialized() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        const host = await this.whenUpgraded();
        await host.whenInitialized;
        return elem.base;
    }
    // ================== CONVERSIONS ==============================
    valueOf() {
        if (this.#elem === null) throw new Error("not supported yet");
        let state = 0;
        if (this.isDefined) state |= DEFINED;
        if (this.isReady) state |= READY;
        if (this.isUpgraded) state |= UPGRADED;
        if (this.isInitialized) state |= INITIALIZED;
        return state;
    }
    toString() {
        const state = this.valueOf();
        let is = new Array();
        if (state & DEFINED) is.push("DEFINED");
        if (state & READY) is.push("READY");
        if (state & UPGRADED) is.push("UPGRADED");
        if (state & INITIALIZED) is.push("INITIALIZED");
        return is.join('|');
    }
}
function getState(elem) {
    if ("state" in elem) return elem.state;
    return elem.state = new LISSState(elem);
}
// ================== State modifiers (move?) ==============================
// Go to state DEFINED
function define(tagname, ComponentClass) {
    // could be better.
    if ("Base" in ComponentClass) {
        ComponentClass = ComponentClass.Base;
    }
    const Class = ComponentClass.LISSCfg.host;
    let htmltag = (0,utils__WEBPACK_IMPORTED_MODULE_0__._element2tagname)(Class) ?? undefined;
    const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
    customElements.define(tagname, LISSclass, opts);
}
// Go to state UPGRADED
async function upgrade(elem, strict = false) {
    const state = getState(elem);
    if (state.isUpgraded && strict) throw new Error(`Already upgraded!`);
    await state.whenDefined();
    return upgradeSync(elem);
}
function upgradeSync(elem, strict = false) {
    const state = getState(elem);
    if (state.isUpgraded && strict) throw new Error(`Already upgraded!`);
    if (!state.isDefined) throw new Error('Element not defined!');
    if (elem.ownerDocument !== document) document.adoptNode(elem);
    customElements.upgrade(elem);
    const Host = getHostCstrSync(elem);
    if (!(elem instanceof Host)) throw new Error(`Element didn't upgrade!`);
    return elem;
}
// Go to state INITIALIZED
async function initialize(elem, strict = false) {
    const state = getState(elem);
    if (state.isInitialized) {
        if (strict === false) return elem.base;
        throw new Error(`Already initialized!`);
    }
    const host = await upgrade(elem);
    await state.whenReady();
    let params = typeof strict === "boolean" ? {} : strict;
    host.initialize(params);
    return host.base;
}
function initializeSync(elem, strict = false) {
    const state = getState(elem);
    if (state.isInitialized) {
        if (strict === false) return elem.base;
        throw new Error(`Already initialized!`);
    }
    const host = upgradeSync(elem);
    if (!state.isReady) throw new Error("Element not ready !");
    let params = typeof strict === "boolean" ? {} : strict;
    host.initialize(params);
    return host.base;
}
// ====================== external WHEN ======================================
async function whenUpgraded(elem, force = false, strict = false) {
    const state = getState(elem);
    if (force) return await upgrade(elem, strict);
    return await state.whenUpgraded();
}
async function whenInitialized(elem, force = false, strict = false) {
    const state = getState(elem);
    if (force) return await initialize(elem, strict);
    return await state.whenInitialized();
}
// Private for now.
function getHostCstrSync(elem) {
    const name = getName(elem);
    const host = customElements.get(name);
    if (host === undefined) throw new Error(`${name} not yet defined!`);
    return host;
}
//TODO: move 2 registery...
function getName(element) {
    const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name.includes('-')) throw new Error(`Element ${name} is not a WebComponent`);
    return name;
}


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LifeCycle: () => (/* binding */ LifeCycle),
/* harmony export */   ShadowCfg: () => (/* binding */ ShadowCfg)
/* harmony export */ });
var ShadowCfg;
(function(ShadowCfg) {
    ShadowCfg["NONE"] = "none";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
})(ShadowCfg || (ShadowCfg = {}));
var LifeCycle;
(function(LifeCycle) {
    LifeCycle[LifeCycle["DEFAULT"] = 0] = "DEFAULT";
    // not implemented yet
    LifeCycle[LifeCycle["INIT_AFTER_CHILDREN"] = 2] = "INIT_AFTER_CHILDREN";
    LifeCycle[LifeCycle["INIT_AFTER_PARENT"] = 4] = "INIT_AFTER_PARENT";
    // quid params/attrs ?
    LifeCycle[LifeCycle["RECREATE_AFTER_CONNECTION"] = 8] = "RECREATE_AFTER_CONNECTION";
})(LifeCycle || (LifeCycle = {}));


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _element2tagname: () => (/* binding */ _element2tagname),
/* harmony export */   isDOMContentLoaded: () => (/* binding */ isDOMContentLoaded),
/* harmony export */   isShadowSupported: () => (/* binding */ isShadowSupported),
/* harmony export */   waitDOMContentLoaded: () => (/* binding */ waitDOMContentLoaded),
/* harmony export */   whenDOMContentLoaded: () => (/* binding */ whenDOMContentLoaded)
/* harmony export */ });
// functions required by LISS.
// fix Array.isArray
// cf https://github.com/microsoft/TypeScript/issues/17002#issuecomment-2366749050
// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
const HTMLCLASS_REGEX = /HTML(\w+)Element/;
const elementNameLookupTable = {
    'UList': 'ul',
    'TableCaption': 'caption',
    'TableCell': 'td',
    'TableCol': 'col',
    'TableRow': 'tr',
    'TableSection': 'tbody',
    'Quote': 'q',
    'Paragraph': 'p',
    'OList': 'ol',
    'Mod': 'ins',
    'Media': 'video',
    'Image': 'img',
    'Heading': 'h1',
    'Directory': 'dir',
    'DList': 'dl',
    'Anchor': 'a'
};
function _element2tagname(Class) {
    if (Class === HTMLElement) return null;
    let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
    return elementNameLookupTable[htmltag] ?? htmltag.toLowerCase();
}
// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
    null,
    'article',
    'aside',
    'blockquote',
    'body',
    'div',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'main',
    'nav',
    'p',
    'section',
    'span'
];
function isShadowSupported(tag) {
    return CAN_HAVE_SHADOW.includes(_element2tagname(tag));
}
function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete";
}
const whenDOMContentLoaded = waitDOMContentLoaded();
async function waitDOMContentLoaded() {
    if (isDOMContentLoaded()) return;
    const { promise, resolve } = Promise.withResolvers();
    document.addEventListener('DOMContentLoaded', ()=>{
        resolve();
    }, true);
    await promise;
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");

//import "./define";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"]);

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFRUyxXQUFXO0FBQ3JHO0FBRUEsd0VBQXdFO0FBQ3hFLE1BQU1LLGtCQUFrQjtJQUN2QjtJQUFNO0lBQVc7SUFBUztJQUFjO0lBQVE7SUFDaEQ7SUFBVTtJQUFNO0lBQU07SUFBTTtJQUFNO0lBQU07SUFBTTtJQUFVO0lBQ3hEO0lBQU87SUFBSztJQUFXO0NBRXZCO0FBQ00sU0FBU3RNLGtCQUFrQnVNLEdBQXVCO0lBQ3hELE9BQU9ELGdCQUFnQkosUUFBUSxDQUFFbk0saUJBQWlCd007QUFDbkQ7QUFFTyxTQUFTNUg7SUFDWixPQUFPMEQsU0FBU21FLFVBQVUsS0FBSyxpQkFBaUJuRSxTQUFTbUUsVUFBVSxLQUFLO0FBQzVFO0FBRU8sTUFBTXpDLHVCQUF1Qm5GLHVCQUF1QjtBQUVwRCxlQUFlQTtJQUNsQixJQUFJRCxzQkFDQTtJQUVKLE1BQU0sRUFBQzhDLE9BQU8sRUFBRUMsT0FBTyxFQUFDLEdBQUd4RixRQUFReUYsYUFBYTtJQUVuRFUsU0FBU29FLGdCQUFnQixDQUFDLG9CQUFvQjtRQUM3Qy9FO0lBQ0QsR0FBRztJQUVBLE1BQU1EO0FBQ1Y7Ozs7Ozs7U0NoRkE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOOEI7QUFFOUIsb0JBQW9CO0FBR3BCLGlFQUFlNUcsaURBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NCYXNlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0hvc3QudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiTElTU0hvc3RcIjtcbmltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgQ29udGVudEZhY3RvcnksIENTU19Tb3VyY2UsIEhUTUxfUmVzb3VyY2UsIEhUTUxfU291cmNlLCBMaWZlQ3ljbGUsIExJU1NfT3B0cywgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCJoZWxwZXJzL2J1aWxkXCI7XG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERFRkFVTFRfQ09OVEVOVF9GQUNUT1JZKGNvbnRlbnQ/OiBFeGNsdWRlPEhUTUxfUmVzb3VyY2UsIFJlc3BvbnNlPikge1xuXG5cdGlmKCB0eXBlb2YgY29udGVudCA9PT0gXCJzdHJpbmdcIikge1xuXG5cdFx0Y29udGVudCA9IGNvbnRlbnQudHJpbSgpO1xuXHRcdGlmKCBjb250ZW50Lmxlbmd0aCA9PT0gMCApXG5cdFx0XHRjb250ZW50ID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdGNvbnRlbnQgPSBodG1sYCR7Y29udGVudH1gO1xuXG5cdFx0Ly8gVE9ETyBMSVNTQXV0byBwYXJzZXIuLi5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0Ly9sZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IHRoaXMuZ2V0QXR0cmlidXRlKG1hdGNoKT8/JycpXG5cdH1cblxuXHRpZiggY29udGVudCBpbnN0YW5jZW9mIEhUTUxUZW1wbGF0ZUVsZW1lbnQpXG5cdFx0Y29udGVudCA9IGNvbnRlbnQuY29udGVudDtcblxuXHRyZXR1cm4gKCkgPT4gY29udGVudD8uY2xvbmVOb2RlKHRydWUpO1xufVxuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cblxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cblx0Ly8gSFRNTCBCYXNlXG5cdEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG5cdEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlciwgLy9zdHJpbmcsXG4+KHtcblxuICAgIC8vIEpTIEJhc2VcbiAgICBleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCBhcyB1bmtub3duIGFzIEV4dGVuZHNDdHIsIC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuICAgIHBhcmFtcyAgICAgICAgICAgID0ge30gICAgIGFzIHVua25vd24gYXMgUGFyYW1zLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgZGVwcyAgID0gW10sXG4gICAgbGlmZV9jeWNsZSA9ICBMaWZlQ3ljbGUuREVGQVVMVCxcblxuICAgIC8vIEhUTUwgQmFzZVxuICAgIGhvc3QgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0b2JzZXJ2ZWRBdHRyaWJ1dGVzID0gW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cbiAgICBhdHRycyA9IG9ic2VydmVkQXR0cmlidXRlcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGNvbnRlbnQsXG5cdGNvbnRlbnRfZmFjdG9yeTogX2NvbnRlbnRfZmFjdG9yeSA9IERFRkFVTFRfQ09OVEVOVF9GQUNUT1JZLFxuICAgIGNzcyxcbiAgICBzaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSA/IFNoYWRvd0NmZy5DTE9TRSA6IFNoYWRvd0NmZy5OT05FXG59OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+ID0ge30pIHtcblxuICAgIGlmKCBzaGFkb3cgIT09IFNoYWRvd0NmZy5PUEVOICYmICEgaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgY29uc3QgYWxsX2RlcHMgPSBbLi4uZGVwc107XG5cblx0bGV0IGNvbnRlbnRfZmFjdG9yeTogQ29udGVudEZhY3Rvcnk8QXR0cnMsIFBhcmFtcz47XG5cbiAgICAvLyBjb250ZW50IHByb2Nlc3NpbmdcbiAgICBpZiggY29udGVudCBpbnN0YW5jZW9mIFByb21pc2UgfHwgY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkge1xuICAgICAgICBcblx0XHRsZXQgX2NvbnRlbnQ6IEhUTUxfU291cmNlfHVuZGVmaW5lZCA9IGNvbnRlbnQ7XG5cdFx0Y29udGVudCA9IG51bGwgYXMgdW5rbm93biBhcyBzdHJpbmc7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudDtcbiAgICAgICAgICAgIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG5cdFx0XHRcdF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuXG4gICAgICAgICAgICBMSVNTQmFzZS5MSVNTQ2ZnLmNvbnRlbnRfZmFjdG9yeSA9IF9jb250ZW50X2ZhY3RvcnkoX2NvbnRlbnQpO1xuICAgICAgICB9KSgpICk7XG5cbiAgICB9IGVsc2Uge1xuXHRcdGNvbnRlbnRfZmFjdG9yeSA9IF9jb250ZW50X2ZhY3RvcnkoY29udGVudCk7XG5cdH1cblxuXHQvLyBDU1MgcHJvY2Vzc2luZ1xuXHRsZXQgc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXSA9IFtdO1xuXHRpZiggY3NzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuXHRcdFx0Ly8gQHRzLWlnbm9yZSA6IHRvZG86IExJU1NPcHRzID0+IHNob3VsZCBub3QgYmUgYSBnZW5lcmljID9cblx0XHRcdGNzcyA9IFtjc3NdO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHN0eWxlc2hlZXRzID0gY3NzLm1hcCggKGM6IENTU19Tb3VyY2UsIGlkeDogbnVtYmVyKSA9PiB7XG5cblx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuXHRcdFx0XHRhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdFx0YyA9IGF3YWl0IGM7XG5cdFx0XHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG5cdFx0XHRcdFx0XHRjID0gYXdhaXQgYy50ZXh0KCk7XG5cblx0XHRcdFx0XHRzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cblx0XHRcdFx0fSkoKSk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvY2Vzc19jc3MoYyk7XG5cdFx0fSk7XG5cdH1cblxuXHR0eXBlIExJU1NIb3N0PFQ+ID0gYW55OyAvL1RPRE8uLi5cblx0dHlwZSBMSG9zdCA9IExJU1NIb3N0PExJU1NCYXNlPjsgLy88LSBjb25maWcgaW5zdGVhZCBvZiBMSVNTQmFzZSA/XG5cblx0Y2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBfZXh0ZW5kcyB7XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsIClcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KHt9LCB0aGlzKTtcblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogYW55OyAvLyBwcmV2ZW50cyBpc3N1ZSAjMS4uLlxuXG5cdFx0Ly8gTElTUyBDb25maWdzXG5cdFx0c3RhdGljIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5jb250ZW50ITtcblx0XHR9XG5cblx0XHQvLyBhdHRyc1xuXHRcdHByb3RlY3RlZCBnZXQgYXR0cnMoKTogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIHNldEF0dHJEZWZhdWx0KCBhdHRyOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnNldEF0dHJEZWZhdWx0KGF0dHIsIHZhbHVlKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uQXR0ckNoYW5nZWQoX25hbWU6IEF0dHJzLFxuXHRcdFx0X29sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRfbmV3VmFsdWU6IHN0cmluZyk6IHZvaWR8ZmFsc2Uge31cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cblx0XHRwcm90ZWN0ZWQgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IFtBdHRycywgc3RyaW5nLCBzdHJpbmddKSB7XG5cdFx0XHR0aGlzLm9uQXR0ckNoYW5nZWQoLi4uYXJncyk7XG5cdFx0fVxuXG5cdFx0Ly8gcGFyYW1ldGVyc1xuXHRcdHB1YmxpYyBnZXQgcGFyYW1zKCk6IFJlYWRvbmx5PFBhcmFtcz4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXM7XG5cdFx0fVxuXHRcdHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4pIHtcblx0XHRcdE9iamVjdC5hc3NpZ24oICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblxuXHRcdC8vIERPTVxuXHRcdHB1YmxpYyBnZXQgaXNJbkRPTSgpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuaXNDb25uZWN0ZWQ7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTUNvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NRGlzY29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaXNJbkRPTTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHN0YXRpYyBfSG9zdDogTElTU0hvc3Q8TElTU0Jhc2U+O1xuXG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QodGhpcyBhcyBhbnkpOyAvL1RPRE86IGZpeCB0eXBlIGVycm9yICh3aHk/Pz8pXG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gTElTU0Jhc2U7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY3NzKGNzczogc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudCkge1xuXG5cdGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG5cdFx0cmV0dXJuIGNzcztcblx0aWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG5cdFx0cmV0dXJuIGNzcy5zaGVldCE7XG5cblx0bGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0aWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0c3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuXHRcdHJldHVybiBzdHlsZTtcblx0fVxuXG5cdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJzXCIpO1xufSIsImltcG9ydCB7IExJU1NTdGF0ZSwgdXBncmFkZVN5bmMgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IExJU1NfT3B0cywgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IENvbXBvc2VDb25zdHJ1Y3RvciwgaXNET01Db250ZW50TG9hZGVkLCB3YWl0RE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCBpZCA9IDA7XG5cbnR5cGUgaW5mZXJMSVNTPFQ+ID0gVCBleHRlbmRzIExJU1NCYXNlQ3N0cjxpbmZlciBBLCBpbmZlciBCLCBpbmZlciBDLCBpbmZlciBEPiA/IFtBLEIsQyxEXSA6IG5ldmVyO1xuXG4vL1RPRE86IHNoYWRvdyB1dGlscyA/XG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMSVNTSG9zdDxcbiAgICAgICAgICAgICAgICAgICAgICAgIFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KExpc3M6IFQpIHtcblx0Y29uc3Qge1xuXHRcdGhvc3QsXG5cdFx0YXR0cnMsXG5cdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdHN0eWxlc2hlZXRzLFxuXHRcdHNoYWRvdyxcblx0fSA9IExpc3MuTElTU0NmZztcblxuXHR0eXBlIFAgPSBpbmZlckxJU1M8VD47XG5cdC8vdHlwZSBFeHRlbmRzQ3N0ciA9IFBbMF07XG5cdHR5cGUgUGFyYW1zICAgICAgPSBQWzFdO1xuXHR0eXBlIEhvc3RDc3RyICAgID0gUFsyXTtcblx0dHlwZSBBdHRycyAgICAgICA9IFBbM107XG5cbiAgICB0eXBlIEhvc3QgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICAvLyBhdHRycyBwcm94eVxuXHRjb25zdCBHRVQgPSBTeW1ib2woJ2dldCcpO1xuXHRjb25zdCBTRVQgPSBTeW1ib2woJ3NldCcpO1xuXG5cdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoIGF0dHJzLm1hcChuID0+IFtuLCB7XG5cblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKTogc3RyaW5nfG51bGwgICAgICB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW0dFVF0obik7IH0sXG5cdFx0c2V0OiBmdW5jdGlvbih2YWx1ZTogc3RyaW5nfG51bGwpIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbU0VUXShuLCB2YWx1ZSk7IH1cblx0fV0pICk7XG5cblx0Y2xhc3MgQXR0cmlidXRlcyB7XG4gICAgICAgIFt4OiBzdHJpbmddOiBzdHJpbmd8bnVsbDtcblxuICAgICAgICAjZGF0YSAgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI2RlZmF1bHRzIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNzZXR0ZXIgICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkO1xuXG4gICAgICAgIFtHRVRdKG5hbWU6IEF0dHJzKSB7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI2RhdGFbbmFtZV0gPz8gdGhpcy4jZGVmYXVsdHNbbmFtZV0gPz8gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgW1NFVF0obmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCl7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI3NldHRlcihuYW1lLCB2YWx1ZSk7IC8vIHJlcXVpcmVkIHRvIGdldCBhIGNsZWFuIG9iamVjdCB3aGVuIGRvaW5nIHsuLi5hdHRyc31cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGEgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcblx0XHRcdFx0XHRkZWZhdWx0czogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG4gICAgICAgIFx0XHRcdHNldHRlciAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZCkge1xuXG4gICAgICAgIFx0dGhpcy4jZGF0YSAgICAgPSBkYXRhO1xuXHRcdFx0dGhpcy4jZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgXHR0aGlzLiNzZXR0ZXIgPSBzZXR0ZXI7XG5cbiAgICAgICAgXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXHR9XG5cblx0Y29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3Qgd2FpdFJlYWR5ID0gbmV3IFByb21pc2U8dm9pZD4oIGFzeW5jIChyKSA9PiB7XG5cbiAgICAgICAgYXdhaXQgd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXG4gICAgICAgIGlzUmVhZHkgPSB0cnVlO1xuXG4gICAgICAgIHIoKTtcbiAgICB9KTtcblxuICAgIC8vIE5vIGRlcHMgYW5kIERPTSBhbHJlYWR5IGxvYWRlZC5cbiAgICBsZXQgaXNSZWFkeSA9IExpc3MuTElTU0NmZy5kZXBzLmxlbmd0aCA9PSAwICYmIGlzRE9NQ29udGVudExvYWRlZCgpO1xuXG5cdGNvbnN0IHBhcmFtcyA9IExpc3MuTElTU0NmZy5wYXJhbXM7IC8vT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5MSVNTQ2ZnLnBhcmFtcywgX3BhcmFtcyk7XG5cblx0Ly9cblxuXHRjb25zdCB3aGVuRGVwc1Jlc29sdmVkID0gUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXHRsZXQgaXNEZXBzUmVzb2x2ZWQgPSBmYWxzZTtcblx0KCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRpc0RlcHNSZXNvbHZlZCA9IHRydWU7XG5cdH0pKCk7XG5cblx0Y2xhc3MgTElTU0hvc3RCYXNlIGV4dGVuZHMgKGhvc3QgYXMgbmV3ICgpID0+IEhUTUxFbGVtZW50KSB7XG5cblx0XHQvLyBhZG9wdCBzdGF0ZSBpZiBhbHJlYWR5IGNyZWF0ZWQuXG5cdFx0cmVhZG9ubHkgc3RhdGUgPSAodGhpcyBhcyBhbnkpLnN0YXRlID8/IG5ldyBMSVNTU3RhdGUodGhpcyk7XG5cblx0XHQvLyA9PT09PT09PT09PT0gREVQRU5ERU5DSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdHN0YXRpYyByZWFkb25seSB3aGVuRGVwc1Jlc29sdmVkID0gd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGlzRGVwc1Jlc29sdmVkO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0c3RhdGljIEJhc2UgPSBMaXNzO1xuXG5cdFx0I2Jhc2U6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgYmFzZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNiYXNlO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2UgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHRpbml0aWFsaXplKHBhcmFtczogUGFydGlhbDxQYXJhbXM+ID0ge30pIHtcblxuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgKCB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNEZXBzUmVzb2x2ZWQgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY2llcyBoYXNuJ3QgYmVlbiBsb2FkZWQgIVwiKTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLiNwYXJhbXMsIHBhcmFtcyk7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuaXNDb25uZWN0ZWQgKVxuXHRcdFx0XHQodGhpcy4jYmFzZSBhcyBhbnkpLm9uRE9NQ29ubmVjdGVkKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNiYXNlO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHJlYWRvbmx5ICNwYXJhbXM6IFBhcmFtcyA9IHBhcmFtcztcblxuXHRcdGdldCBwYXJhbXMoKTogUGFyYW1zIHtcblx0XHRcdHJldHVybiB0aGlzLiNwYXJhbXM7XG5cdFx0fVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPExJU1NfT3B0c1tcInBhcmFtc1wiXT4pIHtcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHRoaXMuYmFzZSEudXBkYXRlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIC8vIHdpbCBiZSBnaXZlbiB0byBjb25zdHJ1Y3Rvci4uLlxuXHRcdFx0T2JqZWN0LmFzc2lnbiggdGhpcy4jcGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cdFx0Ly8gPT09PT09PT09PT09PT0gQXR0cmlidXRlcyA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjYXR0cnNfZmxhZyA9IGZhbHNlO1xuXG5cdFx0I2F0dHJpYnV0ZXMgICAgICAgICA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRyaWJ1dGVzRGVmYXVsdHMgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cnMgPSBuZXcgQXR0cmlidXRlcyhcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXMsXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHMsXG5cdFx0XHQobmFtZTogQXR0cnMsIHZhbHVlOnN0cmluZ3xudWxsKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSB0cnVlOyAvLyBkbyBub3QgdHJpZ2dlciBvbkF0dHJzQ2hhbmdlZC5cblx0XHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdCkgYXMgdW5rbm93biBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblxuXHRcdHNldEF0dHJEZWZhdWx0KG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0ZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Z2V0IGF0dHJzKCk6IFJlYWRvbmx5PFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+PiB7XG5cblx0XHRcdHJldHVybiB0aGlzLiNhdHRycztcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBDb250ZW50ID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNjb250ZW50OiBIb3N0fFNoYWRvd1Jvb3R8bnVsbCA9IG51bGw7XG5cblx0XHRnZXQgY29udGVudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250ZW50O1xuXHRcdH1cblxuXHRcdGdldFBhcnQobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cdFx0Z2V0UGFydHMobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0IGhhc1NoYWRvdygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBzaGFkb3cgIT09ICdub25lJztcblx0XHR9XG5cblx0XHQvKioqIENTUyAqKiovXG5cblx0XHRnZXQgQ1NTU2VsZWN0b3IoKSB7XG5cblx0XHRcdGlmKHRoaXMuaGFzU2hhZG93IHx8ICEgdGhpcy5oYXNBdHRyaWJ1dGUoXCJpc1wiKSApXG5cdFx0XHRcdHJldHVybiB0aGlzLnRhZ05hbWU7XG5cblx0XHRcdHJldHVybiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gSW1wbCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHRjb25zdHJ1Y3RvcihwYXJhbXM6IHt9LCBiYXNlPzogSW5zdGFuY2VUeXBlPFQ+KSB7XG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGlmKCBiYXNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy4jYmFzZSA9IGJhc2U7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdCh0aGlzLmJhc2UhIGFzIGFueSkub25ET01EaXNjb25uZWN0ZWQoKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmJhc2UhLm9uRE9NQ29ubmVjdGVkKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5zdGF0ZS5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCggYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdGF3YWl0IHRoaXMuc3RhdGUuaXNSZWFkeTtcblxuXHRcdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHR9KSgpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblx0XHRcdFxuXHRcdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzKTtcblxuICAgICAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLlxuXHRcdFx0XG5cdFx0XHQvLyBzaGFkb3dcblx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9zdDtcblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJykge1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6IHNoYWRvd30pO1xuXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYXR0cnNcblx0XHRcdGZvcihsZXQgb2JzIG9mIGF0dHJzISlcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tvYnMgYXMgQXR0cnNdID0gdGhpcy5nZXRBdHRyaWJ1dGUob2JzKTtcblxuXHRcdFx0Ly8gY3NzXG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUyk7XG5cdFx0XHRpZiggc3R5bGVzaGVldHMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaCguLi5zdHlsZXNoZWV0cyk7XG5cdFx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdFx0Y29uc3QgY3Nzc2VsZWN0b3IgPSB0aGlzLkNTU1NlbGVjdG9yO1xuXG5cdFx0XHRcdFx0Ly8gaWYgbm90IHlldCBpbnNlcnRlZCA6XG5cdFx0XHRcdFx0aWYoICEgYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cblx0XHRcdFx0XHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG5cdFx0XHRcdFx0XHRsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcblx0XHRcdFx0XHRcdFx0XHRodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuXG5cdFx0XHRcdFx0XHRhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY29udGVudFxuXHRcdFx0Y29uc3QgY29udGVudCA9IGNvbnRlbnRfZmFjdG9yeSh0aGlzLmF0dHJzLCB0aGlzLnBhcmFtcyk7XG5cdFx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggY29udGVudCApO1xuXG5cdCAgICBcdC8vIGJ1aWxkXG5cblx0ICAgIFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHQgICAgXHRsZXQgb2JqID0gdGhpcy5iYXNlID09PSBudWxsID8gbmV3IExpc3MoKSA6IHRoaXMuYmFzZTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmJhc2UpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlO1xuXHRcdH1cblxuXG5cblx0XHQvLyBhdHRyc1xuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGF0dHJzO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lICAgIDogQXR0cnMsXG5cdFx0XHRcdFx0XHRcdFx0IG9sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdFx0IG5ld1ZhbHVlOiBzdHJpbmcpIHtcblxuXHRcdFx0aWYodGhpcy4jYXR0cnNfZmxhZykge1xuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IG5ld1ZhbHVlO1xuXHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRpZiggKHRoaXMuYmFzZSEgYXMgYW55KS5vbkF0dHJDaGFuZ2VkKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzW25hbWVdID0gb2xkVmFsdWU7IC8vIHJldmVydCB0aGUgY2hhbmdlLlxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3RCYXNlIGFzIENvbXBvc2VDb25zdHJ1Y3Rvcjx0eXBlb2YgTElTU0hvc3RCYXNlLCB0eXBlb2YgaG9zdD47XG59XG5cblxuIiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9pbmRleFwiO1xuaW1wb3J0IHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCJ0eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudD4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiBUIHtcbiAgICBcbiAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN0cmluZyArPSBgJHthcmdzW2ldfWA7XG4gICAgICAgIHN0cmluZyArPSBgJHtzdHJbaSsxXX1gO1xuICAgICAgICAvL1RPRE86IG1vcmUgcHJlLXByb2Nlc3Nlc1xuICAgIH1cblxuICAgIC8vIHVzaW5nIHRlbXBsYXRlIHByZXZlbnRzIEN1c3RvbUVsZW1lbnRzIHVwZ3JhZGUuLi5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHJpbmcudHJpbSgpO1xuXG4gICAgaWYoIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoID09PSAxKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oZWxlbSk7XG59XG5cblxudHlwZSBCVUlMRF9PUFRJT05TPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBQYXJ0aWFsPHtcbiAgICBwYXJhbXMgICAgOiBQYXJ0aWFsPFRbXCJwYXJhbXNcIl0+LFxuICAgIGNvbnRlbnRcdCAgOiBzdHJpbmd8Tm9kZXxyZWFkb25seSBOb2RlW10sXG4gICAgaWQgXHRcdCAgICA6IHN0cmluZyxcbiAgICBjbGFzc2VzXHQgIDogcmVhZG9ubHkgc3RyaW5nW10sXG4gICAgY3NzdmFycyAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4sXG4gICAgYXR0cnMgXHQgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBkYXRhIFx0ICAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBsaXN0ZW5lcnMgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCAoZXY6IEV2ZW50KSA9PiB2b2lkPj5cbn0+ICYgKHtcbiAgaW5pdGlhbGl6ZTogZmFsc2UsXG4gIHBhcmVudDogRWxlbWVudFxufXx7XG4gIGluaXRpYWxpemU/OiB0cnVlLFxuICBwYXJlbnQ/OiBFbGVtZW50XG59KTtcblxuLy9hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBQcm9taXNlPENvbXBvbmVudHNbVF0+O1xuLypcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZT4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U+KHRhZ25hbWU6IHN0cmluZywge1xuICAgICAgICAgICAgICBwYXJhbXMgICAgPSB7fSxcbiAgICAgICAgICAgICAgaW5pdGlhbGl6ZT0gdHJ1ZSxcbiAgICAgICAgICAgICAgY29udGVudCAgID0gW10sXG4gICAgICAgICAgICAgIHBhcmVudCAgICA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgaWQgXHRcdCAgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGNsYXNzZXMgICA9IFtdLFxuICAgICAgICAgICAgICBjc3N2YXJzICAgPSB7fSxcbiAgICAgICAgICAgICAgYXR0cnMgICAgID0ge30sXG4gICAgICAgICAgICAgIGRhdGEgXHQgID0ge30sXG4gICAgICAgICAgICAgIGxpc3RlbmVycyA9IHt9XG4gICAgICAgICAgICAgIH06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFByb21pc2U8VD4ge1xuXG4gIGlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxuICBsZXQgQ3VzdG9tQ2xhc3MgPSBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcbiAgbGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuICAvLyBGaXggaXNzdWUgIzJcbiAgaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbiAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuICBpZiggaWQgIT09IHVuZGVmaW5lZCApXG4gIGVsZW0uaWQgPSBpZDtcblxuICBpZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuICBlbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG4gIGVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG4gIGxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuICBpZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbiAgZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICBlbHNlXG4gIGVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxuXG4gIGZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbiAgbGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbiAgaWYoIHZhbHVlID09PSBmYWxzZSlcbiAgZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbiAgZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbiAgZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbiAgZWxzZVxuICBlbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuICBjb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbiAgZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbiAgaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbiAgcGFyZW50LmFwcGVuZChlbGVtKTtcblxuICBpZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbiAgcmV0dXJuIGF3YWl0IExJU1MuaW5pdGlhbGl6ZShlbGVtKTtcblxuICByZXR1cm4gYXdhaXQgTElTUy5nZXRMSVNTKGVsZW0pO1xufVxuTElTUy5idWlsZCA9IGJ1aWxkO1xuXG5cbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBDb21wb25lbnRzW1RdO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogVDtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCB7XG5wYXJhbXMgICAgPSB7fSxcbmluaXRpYWxpemU9IHRydWUsXG5jb250ZW50ICAgPSBbXSxcbnBhcmVudCAgICA9IHVuZGVmaW5lZCxcbmlkIFx0XHQgID0gdW5kZWZpbmVkLFxuY2xhc3NlcyAgID0gW10sXG5jc3N2YXJzICAgPSB7fSxcbmF0dHJzICAgICA9IHt9LFxuZGF0YSBcdCAgPSB7fSxcbmxpc3RlbmVycyA9IHt9XG59OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBUIHtcblxuaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG50aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbmxldCBDdXN0b21DbGFzcyA9IGN1c3RvbUVsZW1lbnRzLmdldCh0YWduYW1lKTtcbmlmKEN1c3RvbUNsYXNzID09PSB1bmRlZmluZWQpXG50aHJvdyBuZXcgRXJyb3IoYCR7dGFnbmFtZX0gbm90IGRlZmluZWRgKTtcbmxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbi8vVE9ETzogZmFjdG9yaXplLi4uXG5cbi8vIEZpeCBpc3N1ZSAjMlxuaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbmVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbmlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbmVsZW0uaWQgPSBpZDtcblxuaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbmVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG5lbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbmxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG5lbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5lbHNlXG5lbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59XG5cbmZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbmxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG5pZiggdmFsdWUgPT09IGZhbHNlKVxuZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbmVsc2UgaWYodmFsdWUgPT09IHRydWUpXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuZWxzZVxuZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG59XG5cbmlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG5lbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG5pZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxucGFyZW50LmFwcGVuZChlbGVtKTtcblxuaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG5MSVNTLmluaXRpYWxpemVTeW5jKGVsZW0pO1xuXG5yZXR1cm4gTElTUy5nZXRMSVNTU3luYyhlbGVtKTtcbn1cbkxJU1MuYnVpbGRTeW5jID0gYnVpbGRTeW5jO1xuKi8iLCJpbXBvcnQgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcInR5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcInV0aWxzXCI7XG5cbmVudW0gU3RhdGUge1xuICAgIE5PTkUgPSAwLFxuXG4gICAgLy8gY2xhc3NcbiAgICBERUZJTkVEID0gMSA8PCAwLFxuICAgIFJFQURZICAgPSAxIDw8IDEsXG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIFVQR1JBREVEICAgID0gMSA8PCAyLFxuICAgIElOSVRJQUxJWkVEID0gMSA8PCAzLFxufVxuXG5leHBvcnQgY29uc3QgREVGSU5FRCAgICAgPSBTdGF0ZS5ERUZJTkVEO1xuZXhwb3J0IGNvbnN0IFJFQURZICAgICAgID0gU3RhdGUuUkVBRFk7XG5leHBvcnQgY29uc3QgVVBHUkFERUQgICAgPSBTdGF0ZS5VUEdSQURFRDtcbmV4cG9ydCBjb25zdCBJTklUSUFMSVpFRCA9IFN0YXRlLklOSVRJQUxJWkVEO1xuXG5leHBvcnQgY2xhc3MgTElTU1N0YXRlIHtcblxuICAgICNlbGVtOiBIVE1MRWxlbWVudHxudWxsO1xuXG4gICAgLy8gaWYgbnVsbCA6IGNsYXNzIHN0YXRlLCBlbHNlIGluc3RhbmNlIHN0YXRlXG4gICAgY29uc3RydWN0b3IoZWxlbTogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGwpIHtcbiAgICAgICAgdGhpcy4jZWxlbSA9IGVsZW07XG4gICAgfVxuXG4gICAgc3RhdGljIERFRklORUQgICAgID0gREVGSU5FRDtcbiAgICBzdGF0aWMgUkVBRFkgICAgICAgPSBSRUFEWTtcbiAgICBzdGF0aWMgVVBHUkFERUQgICAgPSBVUEdSQURFRDtcbiAgICBzdGF0aWMgSU5JVElBTElaRUQgPSBJTklUSUFMSVpFRDtcblxuICAgIGlzKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEICAgICAmJiAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgICAgICAgJiYgISB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCAgICAmJiAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEICYmICEgdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlbihzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgbGV0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8YW55Pj4oKTtcbiAgICBcbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5EZWZpbmVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuUmVhZHkoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5VcGdyYWRlZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkluaXRpYWxpemVkKCkgKTtcbiAgICBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBERUZJTkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzRGVmaW5lZCgpIHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKCBnZXROYW1lKHRoaXMuI2VsZW0pICkgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gUkVBRFkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICAgICAgaWYoICEgaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBIb3N0LmlzRGVwc1Jlc29sdmVkO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW5SZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpOyAvLyBjb3VsZCBiZSByZWFkeSBiZWZvcmUgZGVmaW5lZCwgYnV0IHdlbGwuLi5cblxuICAgICAgICBhd2FpdCB3aGVuRE9NQ29udGVudExvYWRlZDtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5EZXBzUmVzb2x2ZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vID09PT09PT09PT09PT09PT09PSBVUEdSQURFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1VwZ3JhZGVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICBjb25zdCBob3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuICAgICAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIGhvc3Q7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTtcbiAgICBcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBob3N0KVxuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICBcbiAgICAgICAgLy8gaDRja1xuICAgIFxuICAgICAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgXG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcblxuICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBJTklUSUFMSVpFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0luaXRpYWxpemVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIFwiaXNJbml0aWFsaXplZFwiIGluIGVsZW0gJiYgZWxlbS5pc0luaXRpYWxpemVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPigpIHtcbiAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuVXBncmFkZWQoKTtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZDtcblxuICAgICAgICByZXR1cm4gKGVsZW0gYXMgTElTU0hvc3Q8VD4pLmJhc2UgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gQ09OVkVSU0lPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICB2YWx1ZU9mKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBsZXQgc3RhdGU6IFN0YXRlID0gMDtcbiAgICBcbiAgICAgICAgaWYoIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IERFRklORUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgc3RhdGUgfD0gUkVBRFk7XG4gICAgICAgIGlmKCB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gVVBHUkFERUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gSU5JVElBTElaRUQ7XG4gICAgXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMudmFsdWVPZigpO1xuICAgICAgICBsZXQgaXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIkRFRklORURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJSRUFEWVwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIlVQR1JBREVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiSU5JVElBTElaRURcIik7XG4gICAgXG4gICAgICAgIHJldHVybiBpcy5qb2luKCd8Jyk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUoZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiggXCJzdGF0ZVwiIGluIGVsZW0pXG4gICAgICAgIHJldHVybiBlbGVtLnN0YXRlIGFzIExJU1NTdGF0ZTtcbiAgICBcbiAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5zdGF0ZSA9IG5ldyBMSVNTU3RhdGUoZWxlbSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PSBTdGF0ZSBtb2RpZmllcnMgKG1vdmU/KSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gR28gdG8gc3RhdGUgREVGSU5FRFxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPikge1xuXG4gICAgLy8gY291bGQgYmUgYmV0dGVyLlxuICAgIGlmKCBcIkJhc2VcIiBpbiBDb21wb25lbnRDbGFzcykge1xuICAgICAgICBDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzLkJhc2UgYXMgVDtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgQ2xhc3MgID0gQ29tcG9uZW50Q2xhc3MuTElTU0NmZy5ob3N0O1xuICAgIGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cbiAgICBjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuLy8gR28gdG8gc3RhdGUgVVBHUkFERURcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGdyYWRlPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuRGVmaW5lZCgpO1xuXG4gICAgcmV0dXJuIHVwZ3JhZGVTeW5jPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBncmFkZVN5bmM8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFQge1xuICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcbiAgICBcbiAgICBpZiggISBzdGF0ZS5pc0RlZmluZWQgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IGRlZmluZWQhJyk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIChlbGVtIGluc3RhbmNlb2YgSG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgZGlkbid0IHVwZ3JhZGUhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBUO1xufVxuXG4vLyBHbyB0byBzdGF0ZSBJTklUSUFMSVpFRFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZTxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufFRbXCJwYXJhbXNcIl0gPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UgKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuUmVhZHkoKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IHt9IDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZShwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogVCB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSlcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIHN0YXRlLmlzUmVhZHkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09IGV4dGVybmFsIFdIRU4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVwZ3JhZGUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuVXBncmFkZWQ8VD4oKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5Jbml0aWFsaXplZDxUPigpO1xufVxuXG4vLyBQcml2YXRlIGZvciBub3cuXG5cbmZ1bmN0aW9uIGdldEhvc3RDc3RyU3luYzxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgXG4gICAgY29uc3QgbmFtZSA9IGdldE5hbWUoZWxlbSk7XG4gICAgY29uc3QgaG9zdCA9IGN1c3RvbUVsZW1lbnRzLmdldCggbmFtZSApO1xuICAgIGlmKCBob3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfSBub3QgeWV0IGRlZmluZWQhYCk7XG4gICAgcmV0dXJuIGhvc3QgYXMgVDtcbn1cblxuLy9UT0RPOiBtb3ZlIDIgcmVnaXN0ZXJ5Li4uXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudCApOiBzdHJpbmcge1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59IiwiaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCJMSVNTSG9zdFwiO1xuaW1wb3J0IHsgTElTUyB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3Mge31cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7IG5ldyguLi5hcmdzOmFueVtdKTogVH07XG5cbmV4cG9ydCB0eXBlIENTU19SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MU3R5bGVFbGVtZW50fENTU1N0eWxlU2hlZXQ7XG5leHBvcnQgdHlwZSBDU1NfU291cmNlICAgPSBDU1NfUmVzb3VyY2UgfCBQcm9taXNlPENTU19SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIEhUTUxfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFRlbXBsYXRlRWxlbWVudHxOb2RlO1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnXG59O1xuXG4vL1RPRE86IGltcGxlbWVudFxuZXhwb3J0IGVudW0gTGlmZUN5Y2xlIHtcbiAgICBERUZBVUxUICAgICAgICAgICAgICAgICAgID0gMCxcblx0Ly8gbm90IGltcGxlbWVudGVkIHlldFxuICAgIElOSVRfQUZURVJfQ0hJTERSRU4gICAgICAgPSAxIDw8IDEsXG4gICAgSU5JVF9BRlRFUl9QQVJFTlQgICAgICAgICA9IDEgPDwgMixcbiAgICAvLyBxdWlkIHBhcmFtcy9hdHRycyA/XG4gICAgUkVDUkVBVEVfQUZURVJfQ09OTkVDVElPTiA9IDEgPDwgMywgLyogcmVxdWlyZXMgcmVidWlsZCBjb250ZW50ICsgZGVzdHJveS9kaXNwb3NlIHdoZW4gcmVtb3ZlZCBmcm9tIERPTSAqL1xuICAgIC8qIHNsZWVwIHdoZW4gZGlzY28gOiB5b3UgbmVlZCB0byBpbXBsZW1lbnQgaXQgeW91cnNlbGYgKi9cbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEZhY3Rvcnk8QXR0cnMgZXh0ZW5kcyBzdHJpbmcsIFBhcmFtcyBleHRlbmRzIFJlY29yZDxzdHJpbmcsYW55Pj4gPSAoIChhdHRyczogUmVjb3JkPEF0dHJzLCBudWxsfHN0cmluZz4sIHBhcmFtczogUGFyYW1zKSA9PiBOb2RlfHVuZGVmaW5lZCApO1xuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZyxcbiAgICA+ID0ge1xuICAgICAgICAvLyBKUyBCYXNlXG4gICAgICAgIGV4dGVuZHMgICA6IEV4dGVuZHNDdHIsXG4gICAgICAgIHBhcmFtcyAgICA6IFBhcmFtcyxcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgZGVwcyAgICAgIDogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W10sXG4gICAgICAgIGxpZmVfY3ljbGU6IExpZmVDeWNsZSwgXG5cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLFxuICAgICAgICBhdHRycyAgOiByZWFkb25seSBBdHRyc1tdLFxuICAgICAgICBvYnNlcnZlZEF0dHJpYnV0ZXM6IHJlYWRvbmx5IEF0dHJzW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBjb250ZW50PzogSFRNTF9Tb3VyY2UsXG4gICAgICAgIGNvbnRlbnRfZmFjdG9yeTogKGNvbnRlbnQ/OiBFeGNsdWRlPEhUTUxfUmVzb3VyY2UsIFJlc3BvbnNlPikgPT4gQ29udGVudEZhY3Rvcnk8QXR0cnMsIFBhcmFtcz4sXG4gICAgICAgIGNzcyAgICAgOiBDU1NfU291cmNlIHwgcmVhZG9ubHkgQ1NTX1NvdXJjZVtdLFxuICAgICAgICBzaGFkb3cgIDogU2hhZG93Q2ZnXG59XG5cbi8vIExJU1NCYXNlXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IEluc3RhbmNlVHlwZTxMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VCBleHRlbmRzIExJU1NCYXNlPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZTxcbiAgICAgICAgICAgIGluZmVyIEEgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBCLFxuICAgICAgICAgICAgaW5mZXIgQyxcbiAgICAgICAgICAgIGluZmVyIEQ+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQmFzZUNzdHI8QSxCLEMsRD4gOiBuZXZlcjtcblxuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQmFzZSA/IExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+OyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBIVE1MQ0xBU1NfUkVHRVggPSAgL0hUTUwoXFx3KylFbGVtZW50LztcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblx0XG5cdGxldCBodG1sdGFnID0gSFRNTENMQVNTX1JFR0VYLmV4ZWMoQ2xhc3MubmFtZSkhWzFdO1xuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgY29uc3Qgd2hlbkRPTUNvbnRlbnRMb2FkZWQgPSB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdERPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG4vL2ltcG9ydCBcIi4vZGVmaW5lXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgTElTUzsiXSwibmFtZXMiOlsiYnVpbGRMSVNTSG9zdCIsIkxpZmVDeWNsZSIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc1NoYWRvd1N1cHBvcnRlZCIsImh0bWwiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkRFRkFVTFRfQ09OVEVOVF9GQUNUT1JZIiwiY29udGVudCIsInRyaW0iLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiY2xvbmVOb2RlIiwiSUxJU1MiLCJMSVNTIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwicGFyYW1zIiwiZGVwcyIsImxpZmVfY3ljbGUiLCJERUZBVUxUIiwiaG9zdCIsIkhUTUxFbGVtZW50Iiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cnMiLCJjb250ZW50X2ZhY3RvcnkiLCJfY29udGVudF9mYWN0b3J5IiwiY3NzIiwic2hhZG93IiwiQ0xPU0UiLCJOT05FIiwiT1BFTiIsIkVycm9yIiwiYWxsX2RlcHMiLCJQcm9taXNlIiwiUmVzcG9uc2UiLCJfY29udGVudCIsInB1c2giLCJ0ZXh0IiwiTElTU0Jhc2UiLCJMSVNTQ2ZnIiwic3R5bGVzaGVldHMiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJjIiwiaWR4IiwicHJvY2Vzc19jc3MiLCJjb25zdHJ1Y3RvciIsImFyZ3MiLCJIb3N0Iiwic3RhdGUiLCJzZXRBdHRyRGVmYXVsdCIsImF0dHIiLCJ2YWx1ZSIsIm9uQXR0ckNoYW5nZWQiLCJfbmFtZSIsIl9vbGRWYWx1ZSIsIl9uZXdWYWx1ZSIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsInVwZGF0ZVBhcmFtcyIsImFzc2lnbiIsImlzSW5ET00iLCJpc0Nvbm5lY3RlZCIsIm9uRE9NQ29ubmVjdGVkIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJvbkRPTURpc2Nvbm5lY3RlZCIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiX0hvc3QiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsIkxJU1NTdGF0ZSIsImlzRE9NQ29udGVudExvYWRlZCIsIndhaXRET01Db250ZW50TG9hZGVkIiwiaWQiLCJzaGFyZWRDU1MiLCJMaXNzIiwiR0VUIiwiU3ltYm9sIiwiU0VUIiwicHJvcGVydGllcyIsImZyb21FbnRyaWVzIiwibiIsImVudW1lcmFibGUiLCJnZXQiLCJzZXQiLCJBdHRyaWJ1dGVzIiwibmFtZSIsImRhdGEiLCJkZWZhdWx0cyIsInNldHRlciIsImRlZmluZVByb3BlcnRpZXMiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJ3YWl0UmVhZHkiLCJyIiwiYWxsIiwiaXNSZWFkeSIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkxJU1NIb3N0QmFzZSIsIkJhc2UiLCJiYXNlIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJpbml0IiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJDU1NTZWxlY3RvciIsImhhc0F0dHJpYnV0ZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJwcm9taXNlIiwicmVzb2x2ZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImF0dGFjaFNoYWRvdyIsIm1vZGUiLCJvYnMiLCJhZG9wdGVkU3R5bGVTaGVldHMiLCJjc3NzZWxlY3RvciIsImhhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwiaW5uZXJIVE1MIiwicmVwbGFjZSIsImhlYWQiLCJhcHBlbmQiLCJhZGQiLCJvYmoiLCJjaGlsZE5vZGVzIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImluaXRpYWxpemVTeW5jIiwic3RyIiwic3RyaW5nIiwiaSIsInRlbXBsYXRlIiwiY2hpbGRyZW4iLCJmaXJzdENoaWxkIiwibGlzcyIsImVsZW0iLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsIlN0YXRlIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsImlzIiwiaXNEZWZpbmVkIiwiaXNVcGdyYWRlZCIsIndoZW4iLCJwcm9taXNlcyIsIndoZW5EZWZpbmVkIiwid2hlblJlYWR5Iiwid2hlblVwZ3JhZGVkIiwiZ2V0TmFtZSIsImdldEhvc3RDc3RyU3luYyIsIl93aGVuVXBncmFkZWQiLCJ2YWx1ZU9mIiwidG9TdHJpbmciLCJqb2luIiwiZ2V0U3RhdGUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJDbGFzcyIsImh0bWx0YWciLCJMSVNTY2xhc3MiLCJvcHRzIiwic3RyaWN0IiwidXBncmFkZVN5bmMiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZm9yY2UiLCJlbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsIkhUTUxDTEFTU19SRUdFWCIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJleGVjIiwiQ0FOX0hBVkVfU0hBRE9XIiwidGFnIiwicmVhZHlTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiXSwic291cmNlUm9vdCI6IiJ9