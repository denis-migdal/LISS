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
    // only if no JS...
    // tolerate non-opti (easier ?) or span[value] ?
    // => record element with target...
    // => clone(attrs, params) => for each span replace then clone.
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
deps = [], // HTML Base
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
            const content = content_factory(this.attrs, this.params, this);
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
    if (template.content.childNodes.length === 1 && template.content.firstChild.nodeType !== Node.TEXT_NODE) return template.content.firstChild;
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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");

//import "./define";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"]);


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
/******/ /* webpack/runtime/publicPath */
/******/ (() => {
/******/ 	__webpack_require__.p = "";
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*******************************************!*\
  !*** ./src/pages/examples/basic/index.ts ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../ */ "./src/index.ts");

class MyComponent extends (0,___WEBPACK_IMPORTED_MODULE_0__["default"])({
    attrs: [
        "e"
    ]
}) {
    // Initialize your WebComponent
    constructor(){
        super();
        // Use this.content to initialize your component's content
        this.content.append('Hello World ;)');
        console.log('State (initial)', {
            // Use this.content to access your component's content:
            Content: this.content,
            // Use this.host to access the component's host:
            Host: this.host,
            // Use this.attrs to efficiently access the component's host's attributes:
            Attributes: {
                ...this.attrs
            },
            // Use this.params to access the component parameters.
            Parameters: this.params
        });
    }
}
// define the "my-component" component.
___WEBPACK_IMPORTED_MODULE_0__["default"].define('my-component', MyComponent);

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!********************************************!*\
  !*** ./src/pages/examples/basic/index.css ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************!*\
  !*** ./src/pages/examples/basic/index.html ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "pages/examples/basic/index.html");
})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TkE7Ozs7Ozs7Ozs7Ozs7QUNDNkI7QUFFN0IsTUFBTW9GLG9CQUFvQjlMLDZDQUFJQSxDQUFDO0lBQUNTLE9BQU87UUFBQztLQUFJO0FBQUE7SUFFeEMsK0JBQStCO0lBQy9Cd0IsYUFBYztRQUNWLEtBQUs7UUFFTCwwREFBMEQ7UUFDMUQsSUFBSSxDQUFDeEMsT0FBTyxDQUFDc0ksTUFBTSxDQUFDO1FBRXBCZ0UsUUFBUUMsR0FBRyxDQUFDLG1CQUFtQjtZQUMzQix1REFBdUQ7WUFDdkRDLFNBQVMsSUFBSSxDQUFDeE0sT0FBTztZQUNyQixnREFBZ0Q7WUFDaEQwQyxNQUFTLElBQUksQ0FBQzdCLElBQUk7WUFDbEIsMEVBQTBFO1lBQzFFb0UsWUFBWTtnQkFBQyxHQUFHLElBQUksQ0FBQ2pFLEtBQUs7WUFBQTtZQUMxQixzREFBc0Q7WUFDdER5TCxZQUFZLElBQUksQ0FBQzlMLE1BQU07UUFDM0I7SUFDSjtBQUNKO0FBRUEsdUNBQXVDO0FBQ3ZDSix5Q0FBSUEsQ0FBQ3VLLE1BQU0sQ0FBQyxnQkFBZ0J1Qjs7Ozs7Ozs7Ozs7QUMxQjVCOzs7Ozs7Ozs7Ozs7O0FDQUEsaUVBQWUscUJBQXVCLG9DQUFvQyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9idWlsZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYmFzaWMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9wYWdlcy9leGFtcGxlcy9iYXNpYy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9wYWdlcy9leGFtcGxlcy9iYXNpYy9pbmRleC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiTElTU0hvc3RcIjtcbmltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgQ29udGVudEZhY3RvcnksIENTU19Tb3VyY2UsIEhUTUxfUmVzb3VyY2UsIEhUTUxfU291cmNlLCBMaWZlQ3ljbGUsIExJU1NfT3B0cywgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCJoZWxwZXJzL2J1aWxkXCI7XG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERFRkFVTFRfQ09OVEVOVF9GQUNUT1JZKGNvbnRlbnQ/OiBFeGNsdWRlPEhUTUxfUmVzb3VyY2UsIFJlc3BvbnNlPikge1xuXG5cdGlmKCB0eXBlb2YgY29udGVudCA9PT0gXCJzdHJpbmdcIikge1xuXG5cdFx0Y29udGVudCA9IGNvbnRlbnQudHJpbSgpO1xuXHRcdGlmKCBjb250ZW50Lmxlbmd0aCA9PT0gMCApXG5cdFx0XHRjb250ZW50ID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdGNvbnRlbnQgPSBodG1sYCR7Y29udGVudH1gO1xuXG5cdFx0Ly8gVE9ETyBMSVNTQXV0byBwYXJzZXIuLi5cblx0XHQvLyBvbmx5IGlmIG5vIEpTLi4uXG5cdFx0Ly8gdG9sZXJhdGUgbm9uLW9wdGkgKGVhc2llciA/KSBvciBzcGFuW3ZhbHVlXSA/XG5cdFx0XHQvLyA9PiByZWNvcmQgZWxlbWVudCB3aXRoIHRhcmdldC4uLlxuXHRcdFx0Ly8gPT4gY2xvbmUoYXR0cnMsIHBhcmFtcykgPT4gZm9yIGVhY2ggc3BhbiByZXBsYWNlIHRoZW4gY2xvbmUuXG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdC8vbGV0IHN0ciA9IChjb250ZW50IGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiB0aGlzLmdldEF0dHJpYnV0ZShtYXRjaCk/PycnKVxuXHR9XG5cblx0aWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KVxuXHRcdGNvbnRlbnQgPSBjb250ZW50LmNvbnRlbnQ7XG5cblx0cmV0dXJuICgpID0+IGNvbnRlbnQ/LmNsb25lTm9kZSh0cnVlKTtcbn1cblxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUztcblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG5cdC8vIEhUTUwgQmFzZVxuXHRIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuXHRBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXIsIC8vc3RyaW5nLFxuPih7XG5cbiAgICAvLyBKUyBCYXNlXG4gICAgZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3RyLCAvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cbiAgICBwYXJhbXMgICAgICAgICAgICA9IHt9ICAgICBhcyB1bmtub3duIGFzIFBhcmFtcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGRlcHMgICA9IFtdLFxuXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgaG9zdCAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRvYnNlcnZlZEF0dHJpYnV0ZXMgPSBbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0LlxuICAgIGF0dHJzID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgY29udGVudCxcblx0Y29udGVudF9mYWN0b3J5OiBfY29udGVudF9mYWN0b3J5ID0gREVGQVVMVF9DT05URU5UX0ZBQ1RPUlksXG4gICAgY3NzLFxuICAgIHNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpID8gU2hhZG93Q2ZnLkNMT1NFIDogU2hhZG93Q2ZnLk5PTkVcbn06IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4gPSB7fSkge1xuXG4gICAgaWYoIHNoYWRvdyAhPT0gU2hhZG93Q2ZnLk9QRU4gJiYgISBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICBjb25zdCBhbGxfZGVwcyA9IFsuLi5kZXBzXTtcblxuXHRsZXQgY29udGVudF9mYWN0b3J5OiBDb250ZW50RmFjdG9yeTxBdHRycywgUGFyYW1zPjtcblxuICAgIC8vIGNvbnRlbnQgcHJvY2Vzc2luZ1xuICAgIGlmKCBjb250ZW50IGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSB7XG4gICAgICAgIFxuXHRcdGxldCBfY29udGVudDogSFRNTF9Tb3VyY2V8dW5kZWZpbmVkID0gY29udGVudDtcblx0XHRjb250ZW50ID0gbnVsbCBhcyB1bmtub3duIGFzIHN0cmluZztcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBfY29udGVudCA9IGF3YWl0IF9jb250ZW50O1xuICAgICAgICAgICAgaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cblx0XHRcdFx0X2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG5cbiAgICAgICAgICAgIExJU1NCYXNlLkxJU1NDZmcuY29udGVudF9mYWN0b3J5ID0gX2NvbnRlbnRfZmFjdG9yeShfY29udGVudCk7XG4gICAgICAgIH0pKCkgKTtcblxuICAgIH0gZWxzZSB7XG5cdFx0Y29udGVudF9mYWN0b3J5ID0gX2NvbnRlbnRfZmFjdG9yeShjb250ZW50KTtcblx0fVxuXG5cdC8vIENTUyBwcm9jZXNzaW5nXG5cdGxldCBzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdID0gW107XG5cdGlmKCBjc3MgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG5cdFx0XHQvLyBAdHMtaWdub3JlIDogdG9kbzogTElTU09wdHMgPT4gc2hvdWxkIG5vdCBiZSBhIGdlbmVyaWMgP1xuXHRcdFx0Y3NzID0gW2Nzc107XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0c3R5bGVzaGVldHMgPSBjc3MubWFwKCAoYzogQ1NTX1NvdXJjZSwgaWR4OiBudW1iZXIpID0+IHtcblxuXHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG5cdFx0XHRcdGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0XHRjID0gYXdhaXQgYztcblx0XHRcdFx0XHRpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcblx0XHRcdFx0XHRcdGMgPSBhd2FpdCBjLnRleHQoKTtcblxuXHRcdFx0XHRcdHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuXHRcdFx0XHR9KSgpKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcm9jZXNzX2NzcyhjKTtcblx0XHR9KTtcblx0fVxuXG5cdHR5cGUgTElTU0hvc3Q8VD4gPSBhbnk7IC8vVE9ETy4uLlxuXHR0eXBlIExIb3N0ID0gTElTU0hvc3Q8TElTU0Jhc2U+OyAvLzwtIGNvbmZpZyBpbnN0ZWFkIG9mIExJU1NCYXNlID9cblxuXHRjbGFzcyBMSVNTQmFzZSBleHRlbmRzIF9leHRlbmRzIHtcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKVxuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3Qoe30sIHRoaXMpO1xuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBhbnk7IC8vIHByZXZlbnRzIGlzc3VlICMxLi4uXG5cblx0XHQvLyBMSVNTIENvbmZpZ3Ncblx0XHRzdGF0aWMgcmVhZG9ubHkgTElTU0NmZyA9IHtcblx0XHRcdGhvc3QsXG5cdFx0XHRkZXBzLFxuXHRcdFx0YXR0cnMsXG5cdFx0XHRwYXJhbXMsXG5cdFx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG5cdFx0Z2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5zdGF0ZTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdC8vIGF0dHJzXG5cdFx0cHJvdGVjdGVkIGdldCBhdHRycygpOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgc2V0QXR0ckRlZmF1bHQoIGF0dHI6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuc2V0QXR0ckRlZmF1bHQoYXR0ciwgdmFsdWUpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25BdHRyQ2hhbmdlZChfbmFtZTogQXR0cnMsXG5cdFx0XHRfb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdF9uZXdWYWx1ZTogc3RyaW5nKTogdm9pZHxmYWxzZSB7fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0LlxuXHRcdHByb3RlY3RlZCBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogW0F0dHJzLCBzdHJpbmcsIHN0cmluZ10pIHtcblx0XHRcdHRoaXMub25BdHRyQ2hhbmdlZCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHQvLyBwYXJhbWV0ZXJzXG5cdFx0cHVibGljIGdldCBwYXJhbXMoKTogUmVhZG9ubHk8UGFyYW1zPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcztcblx0XHR9XG5cdFx0cHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPikge1xuXHRcdFx0T2JqZWN0LmFzc2lnbiggKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXG5cdFx0Ly8gRE9NXG5cdFx0cHVibGljIGdldCBpc0luRE9NKCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NQ29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01EaXNjb25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0XG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0luRE9NO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgc3RhdGljIF9Ib3N0OiBMSVNTSG9zdDxMSVNTQmFzZT47XG5cblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzIGFzIGFueSk7IC8vVE9ETzogZml4IHR5cGUgZXJyb3IgKHdoeT8/Pylcblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQmFzZTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19jc3MoY3NzOiBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50KSB7XG5cblx0aWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcblx0XHRyZXR1cm4gY3NzO1xuXHRpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcblx0XHRyZXR1cm4gY3NzLnNoZWV0ITtcblxuXHRsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXHRpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG5cdFx0cmV0dXJuIHN0eWxlO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG59IiwiaW1wb3J0IHsgTElTU1N0YXRlLCB1cGdyYWRlU3luYyB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuaW1wb3J0IHsgTElTU19PcHRzLCBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgQ29tcG9zZUNvbnN0cnVjdG9yLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdhaXRET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IGlkID0gMDtcblxudHlwZSBpbmZlckxJU1M8VD4gPSBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPGluZmVyIEEsIGluZmVyIEIsIGluZmVyIEMsIGluZmVyIEQ+ID8gW0EsQixDLERdIDogbmV2ZXI7XG5cbi8vVE9ETzogc2hhZG93IHV0aWxzID9cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFxuICAgICAgICAgICAgICAgICAgICAgICAgVCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oTGlzczogVCkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRycyxcblx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5MSVNTQ2ZnO1xuXG5cdHR5cGUgUCA9IGluZmVyTElTUzxUPjtcblx0Ly90eXBlIEV4dGVuZHNDc3RyID0gUFswXTtcblx0dHlwZSBQYXJhbXMgICAgICA9IFBbMV07XG5cdHR5cGUgSG9zdENzdHIgICAgPSBQWzJdO1xuXHR0eXBlIEF0dHJzICAgICAgID0gUFszXTtcblxuICAgIHR5cGUgSG9zdCAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIC8vIGF0dHJzIHByb3h5XG5cdGNvbnN0IEdFVCA9IFN5bWJvbCgnZ2V0Jyk7XG5cdGNvbnN0IFNFVCA9IFN5bWJvbCgnc2V0Jyk7XG5cblx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5mcm9tRW50cmllcyggYXR0cnMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHRjb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCB3YWl0UmVhZHkgPSBuZXcgUHJvbWlzZTx2b2lkPiggYXN5bmMgKHIpID0+IHtcblxuICAgICAgICBhd2FpdCB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG5cbiAgICAgICAgcigpO1xuICAgIH0pO1xuXG4gICAgLy8gTm8gZGVwcyBhbmQgRE9NIGFscmVhZHkgbG9hZGVkLlxuICAgIGxldCBpc1JlYWR5ID0gTGlzcy5MSVNTQ2ZnLmRlcHMubGVuZ3RoID09IDAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cblx0Y29uc3QgcGFyYW1zID0gTGlzcy5MSVNTQ2ZnLnBhcmFtczsgLy9PYmplY3QuYXNzaWduKHt9LCBMaXNzLkxJU1NDZmcucGFyYW1zLCBfcGFyYW1zKTtcblxuXHQvL1xuXG5cdGNvbnN0IHdoZW5EZXBzUmVzb2x2ZWQgPSBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cdGxldCBpc0RlcHNSZXNvbHZlZCA9IGZhbHNlO1xuXHQoIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdGlzRGVwc1Jlc29sdmVkID0gdHJ1ZTtcblx0fSkoKTtcblxuXHRjbGFzcyBMSVNTSG9zdEJhc2UgZXh0ZW5kcyAoaG9zdCBhcyBuZXcgKCkgPT4gSFRNTEVsZW1lbnQpIHtcblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gaXNEZXBzUmVzb2x2ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdCh0aGlzLiNiYXNlIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0Z2V0IHBhcmFtcygpOiBQYXJhbXMge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3BhcmFtcztcblx0XHR9XG5cbiAgICAgICAgcHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8TElTU19PcHRzW1wicGFyYW1zXCJdPikge1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5iYXNlIS51cGRhdGVQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgLy8gd2lsIGJlIGdpdmVuIHRvIGNvbnN0cnVjdG9yLi4uXG5cdFx0XHRPYmplY3QuYXNzaWduKCB0aGlzLiNwYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblx0XHQvLyA9PT09PT09PT09PT09PSBBdHRyaWJ1dGVzID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNhdHRyc19mbGFnID0gZmFsc2U7XG5cblx0XHQjYXR0cmlidXRlcyAgICAgICAgID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJpYnV0ZXNEZWZhdWx0cyA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRycyA9IG5ldyBBdHRyaWJ1dGVzKFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlcyxcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0cyxcblx0XHRcdChuYW1lOiBBdHRycywgdmFsdWU6c3RyaW5nfG51bGwpID0+IHtcblxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG5cblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IHRydWU7IC8vIGRvIG5vdCB0cmlnZ2VyIG9uQXR0cnNDaGFuZ2VkLlxuXHRcdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0KSBhcyB1bmtub3duIGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXG5cdFx0c2V0QXR0ckRlZmF1bHQobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRkZWxldGUgdGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRnZXQgYXR0cnMoKTogUmVhZG9ubHk8UmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4+IHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2F0dHJzO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKHBhcmFtczoge30sIGJhc2U/OiBJbnN0YW5jZVR5cGU8VD4pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0aWYoIGJhc2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLiNiYXNlID0gYmFzZTtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0KHRoaXMuYmFzZSEgYXMgYW55KS5vbkRPTURpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuYmFzZSEub25ET01Db25uZWN0ZWQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLnN0YXRlLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgdGhpcy5zdGF0ZS5pc1JlYWR5O1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXHRcdFx0XG5cdFx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHRoaXMpO1xuXG4gICAgICAgICAgICAvL1RPRE86IHdhaXQgcGFyZW50cy9jaGlsZHJlbiBkZXBlbmRpbmcgb24gb3B0aW9uLi4uXG5cdFx0XHRcblx0XHRcdC8vIHNoYWRvd1xuXHRcdFx0dGhpcy4jY29udGVudCA9IHRoaXMgYXMgdW5rbm93biBhcyBIb3N0O1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKSB7XG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogc2hhZG93fSk7XG5cblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhdHRyc1xuXHRcdFx0Zm9yKGxldCBvYnMgb2YgYXR0cnMhKVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW29icyBhcyBBdHRyc10gPSB0aGlzLmdldEF0dHJpYnV0ZShvYnMpO1xuXG5cdFx0XHQvLyBjc3Ncblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTKTtcblx0XHRcdGlmKCBzdHlsZXNoZWV0cy5sZW5ndGggKSB7XG5cblx0XHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKC4uLnN0eWxlc2hlZXRzKTtcblx0XHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0XHRjb25zdCBjc3NzZWxlY3RvciA9IHRoaXMuQ1NTU2VsZWN0b3I7XG5cblx0XHRcdFx0XHQvLyBpZiBub3QgeWV0IGluc2VydGVkIDpcblx0XHRcdFx0XHRpZiggISBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0bGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuXHRcdFx0XHRcdFx0c3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cblx0XHRcdFx0XHRcdGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0Zm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuXHRcdFx0XHRcdFx0XHRcdGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cblx0XHRcdFx0XHRcdHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG5cblx0XHRcdFx0XHRcdGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb250ZW50XG5cdFx0XHRjb25zdCBjb250ZW50ID0gY29udGVudF9mYWN0b3J5KHRoaXMuYXR0cnMsIHRoaXMucGFyYW1zLCB0aGlzKTtcblx0XHRcdGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKCBjb250ZW50ICk7XG5cblx0ICAgIFx0Ly8gYnVpbGRcblxuXHQgICAgXHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdCAgICBcdGxldCBvYmogPSB0aGlzLmJhc2UgPT09IG51bGwgPyBuZXcgTGlzcygpIDogdGhpcy5iYXNlO1xuXG5cdFx0XHR0aGlzLiNiYXNlID0gb2JqIGFzIEluc3RhbmNlVHlwZTxUPjtcblxuXHRcdFx0Ly8gZGVmYXVsdCBzbG90XG5cdFx0XHRpZiggdGhpcy5oYXNTaGFkb3cgJiYgdGhpcy4jY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuYmFzZSk7XG5cblx0XHRcdHJldHVybiB0aGlzLmJhc2U7XG5cdFx0fVxuXG5cblxuXHRcdC8vIGF0dHJzXG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYXR0cnM7XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUgICAgOiBBdHRycyxcblx0XHRcdFx0XHRcdFx0XHQgb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHQgbmV3VmFsdWU6IHN0cmluZykge1xuXG5cdFx0XHRpZih0aGlzLiNhdHRyc19mbGFnKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gbmV3VmFsdWU7XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdGlmKCAodGhpcy5iYXNlISBhcyBhbnkpLm9uQXR0ckNoYW5nZWQobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0dGhpcy4jYXR0cnNbbmFtZV0gPSBvbGRWYWx1ZTsgLy8gcmV2ZXJ0IHRoZSBjaGFuZ2UuXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBMSVNTSG9zdEJhc2UgYXMgQ29tcG9zZUNvbnN0cnVjdG9yPHR5cGVvZiBMSVNTSG9zdEJhc2UsIHR5cGVvZiBob3N0Pjtcbn1cblxuXG4iLCJpbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2luZGV4XCI7XG5pbXBvcnQgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcInR5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufVxuXG5cbnR5cGUgQlVJTERfT1BUSU9OUzxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gUGFydGlhbDx7XG4gICAgcGFyYW1zICAgIDogUGFydGlhbDxUW1wicGFyYW1zXCJdPixcbiAgICBjb250ZW50XHQgIDogc3RyaW5nfE5vZGV8cmVhZG9ubHkgTm9kZVtdLFxuICAgIGlkIFx0XHQgICAgOiBzdHJpbmcsXG4gICAgY2xhc3Nlc1x0ICA6IHJlYWRvbmx5IHN0cmluZ1tdLFxuICAgIGNzc3ZhcnMgICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+LFxuICAgIGF0dHJzIFx0ICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG4gICAgZGF0YSBcdCAgICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG4gICAgbGlzdGVuZXJzIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgKGV2OiBFdmVudCkgPT4gdm9pZD4+XG59PiAmICh7XG4gIGluaXRpYWxpemU6IGZhbHNlLFxuICBwYXJlbnQ6IEVsZW1lbnRcbn18e1xuICBpbml0aWFsaXplPzogdHJ1ZSxcbiAgcGFyZW50PzogRWxlbWVudFxufSk7XG5cbi8vYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogUHJvbWlzZTxDb21wb25lbnRzW1RdPjtcbi8qXG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPih0YWduYW1lOiBzdHJpbmcsIHtcbiAgICAgICAgICAgICAgcGFyYW1zICAgID0ge30sXG4gICAgICAgICAgICAgIGluaXRpYWxpemU9IHRydWUsXG4gICAgICAgICAgICAgIGNvbnRlbnQgICA9IFtdLFxuICAgICAgICAgICAgICBwYXJlbnQgICAgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGlkIFx0XHQgID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBjbGFzc2VzICAgPSBbXSxcbiAgICAgICAgICAgICAgY3NzdmFycyAgID0ge30sXG4gICAgICAgICAgICAgIGF0dHJzICAgICA9IHt9LFxuICAgICAgICAgICAgICBkYXRhIFx0ICA9IHt9LFxuICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSB7fVxuICAgICAgICAgICAgICB9OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBQcm9taXNlPFQ+IHtcblxuICBpZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbiAgbGV0IEN1c3RvbUNsYXNzID0gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG4gIGxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbiAgLy8gRml4IGlzc3VlICMyXG4gIGlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG4gIGVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbiAgaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuICBlbGVtLmlkID0gaWQ7XG5cbiAgaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuICBlbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuICBmb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxuICBsZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbiAgaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG4gIGVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgZWxzZVxuICBlbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH1cblxuICBmb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG4gIGxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG4gIGlmKCB2YWx1ZSA9PT0gZmFsc2UpXG4gIGRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG4gIGVsc2UgaWYodmFsdWUgPT09IHRydWUpXG4gIGVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG4gIGVsc2VcbiAgZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBpZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbiAgY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG4gIGVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG4gIGlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG4gIHBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbiAgaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG4gIHJldHVybiBhd2FpdCBMSVNTLmluaXRpYWxpemUoZWxlbSk7XG5cbiAgcmV0dXJuIGF3YWl0IExJU1MuZ2V0TElTUyhlbGVtKTtcbn1cbkxJU1MuYnVpbGQgPSBidWlsZDtcblxuXG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogQ29tcG9uZW50c1tUXTtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFQ7XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywge1xucGFyYW1zICAgID0ge30sXG5pbml0aWFsaXplPSB0cnVlLFxuY29udGVudCAgID0gW10sXG5wYXJlbnQgICAgPSB1bmRlZmluZWQsXG5pZCBcdFx0ICA9IHVuZGVmaW5lZCxcbmNsYXNzZXMgICA9IFtdLFxuY3NzdmFycyAgID0ge30sXG5hdHRycyAgICAgPSB7fSxcbmRhdGEgXHQgID0ge30sXG5saXN0ZW5lcnMgPSB7fVxufTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogVCB7XG5cbmlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxudGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG5sZXQgQ3VzdG9tQ2xhc3MgPSBjdXN0b21FbGVtZW50cy5nZXQodGFnbmFtZSk7XG5pZihDdXN0b21DbGFzcyA9PT0gdW5kZWZpbmVkKVxudGhyb3cgbmV3IEVycm9yKGAke3RhZ25hbWV9IG5vdCBkZWZpbmVkYCk7XG5sZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4vL1RPRE86IGZhY3Rvcml6ZS4uLlxuXG4vLyBGaXggaXNzdWUgIzJcbmlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG5lbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG5pZiggaWQgIT09IHVuZGVmaW5lZCApXG5lbGVtLmlkID0gaWQ7XG5cbmlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG5lbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbmZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbmZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG5sZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbmlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuZWxzZVxuZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufVxuXG5mb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG5sZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuaWYoIHZhbHVlID09PSBmYWxzZSlcbmRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG5lbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbmVsc2VcbmVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xufVxuXG5pZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbmNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbmZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG5lbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbnBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbmlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxuTElTUy5pbml0aWFsaXplU3luYyhlbGVtKTtcblxucmV0dXJuIExJU1MuZ2V0TElTU1N5bmMoZWxlbSk7XG59XG5MSVNTLmJ1aWxkU3luYyA9IGJ1aWxkU3luYztcbiovIiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuLy9pbXBvcnQgXCIuL2RlZmluZVwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IExJU1M7IiwiaW1wb3J0IHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCJ0eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCJ1dGlsc1wiO1xuXG5lbnVtIFN0YXRlIHtcbiAgICBOT05FID0gMCxcblxuICAgIC8vIGNsYXNzXG4gICAgREVGSU5FRCA9IDEgPDwgMCxcbiAgICBSRUFEWSAgID0gMSA8PCAxLFxuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBVUEdSQURFRCAgICA9IDEgPDwgMixcbiAgICBJTklUSUFMSVpFRCA9IDEgPDwgMyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRklORUQgICAgID0gU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IFN0YXRlLlJFQURZO1xuZXhwb3J0IGNvbnN0IFVQR1JBREVEICAgID0gU3RhdGUuVVBHUkFERUQ7XG5leHBvcnQgY29uc3QgSU5JVElBTElaRUQgPSBTdGF0ZS5JTklUSUFMSVpFRDtcblxuZXhwb3J0IGNsYXNzIExJU1NTdGF0ZSB7XG5cbiAgICAjZWxlbTogSFRNTEVsZW1lbnR8bnVsbDtcblxuICAgIC8vIGlmIG51bGwgOiBjbGFzcyBzdGF0ZSwgZWxzZSBpbnN0YW5jZSBzdGF0ZVxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEhUTUxFbGVtZW50fG51bGwgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuI2VsZW0gPSBlbGVtO1xuICAgIH1cblxuICAgIHN0YXRpYyBERUZJTkVEICAgICA9IERFRklORUQ7XG4gICAgc3RhdGljIFJFQURZICAgICAgID0gUkVBRFk7XG4gICAgc3RhdGljIFVQR1JBREVEICAgID0gVVBHUkFERUQ7XG4gICAgc3RhdGljIElOSVRJQUxJWkVEID0gSU5JVElBTElaRUQ7XG5cbiAgICBpcyhzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCAgICAgJiYgISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZICAgICAgICYmICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgICAgJiYgISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCAmJiAhIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW4oc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGxldCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPGFueT4+KCk7XG4gICAgXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuRGVmaW5lZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblJlYWR5KCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuVXBncmFkZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5Jbml0aWFsaXplZCgpICk7XG4gICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gREVGSU5FRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0RlZmluZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFJFQURZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgICAgIGlmKCAhIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gSG9zdC5pc0RlcHNSZXNvbHZlZDtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTsgLy8gY291bGQgYmUgcmVhZHkgYmVmb3JlIGRlZmluZWQsIGJ1dCB3ZWxsLi4uXG5cbiAgICAgICAgYXdhaXQgd2hlbkRPTUNvbnRlbnRMb2FkZWQ7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuRGVwc1Jlc29sdmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gVVBHUkFERUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNVcGdyYWRlZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgY29uc3QgaG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcbiAgICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBob3N0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7XG4gICAgXG4gICAgICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgaG9zdClcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgXG4gICAgICAgIC8vIGg0Y2tcbiAgICBcbiAgICAgICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgICAgIFxuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWQgICAgICAgID0gcHJvbWlzZTtcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgXG4gICAgICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gSU5JVElBTElaRUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNJbml0aWFsaXplZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiBcImlzSW5pdGlhbGl6ZWRcIiBpbiBlbGVtICYmIGVsZW0uaXNJbml0aWFsaXplZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oKSB7XG4gICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlblVwZ3JhZGVkKCk7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQ7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtIGFzIExJU1NIb3N0PFQ+KS5iYXNlIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IENPTlZFUlNJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFsdWVPZigpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgbGV0IHN0YXRlOiBTdGF0ZSA9IDA7XG4gICAgXG4gICAgICAgIGlmKCB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBERUZJTkVEO1xuICAgICAgICBpZiggdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHN0YXRlIHw9IFJFQURZO1xuICAgICAgICBpZiggdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IFVQR1JBREVEO1xuICAgICAgICBpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IElOSVRJQUxJWkVEO1xuICAgIFxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IGlzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJERUZJTkVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBpcy5wdXNoKFwiUkVBRFlcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJVUEdSQURFRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIklOSVRJQUxJWkVEXCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gaXMuam9pbignfCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYoIFwic3RhdGVcIiBpbiBlbGVtKVxuICAgICAgICByZXR1cm4gZWxlbS5zdGF0ZSBhcyBMSVNTU3RhdGU7XG4gICAgXG4gICAgcmV0dXJuIChlbGVtIGFzIGFueSkuc3RhdGUgPSBuZXcgTElTU1N0YXRlKGVsZW0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gU3RhdGUgbW9kaWZpZXJzIChtb3ZlPykgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdvIHRvIHN0YXRlIERFRklORURcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD4pIHtcblxuICAgIC8vIGNvdWxkIGJlIGJldHRlci5cbiAgICBpZiggXCJCYXNlXCIgaW4gQ29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgQ29tcG9uZW50Q2xhc3MgPSBDb21wb25lbnRDbGFzcy5CYXNlIGFzIFQ7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IENsYXNzICA9IENvbXBvbmVudENsYXNzLkxJU1NDZmcuaG9zdDtcbiAgICBsZXQgaHRtbHRhZyAgPSBfZWxlbWVudDJ0YWduYW1lKENsYXNzKT8/dW5kZWZpbmVkO1xuXG4gICAgY29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXG4gICAgY29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG4gICAgICAgICAgICAgICAgOiB7ZXh0ZW5kczogaHRtbHRhZ307XG5cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgTElTU2NsYXNzLCBvcHRzKTtcbn07XG5cbi8vIEdvIHRvIHN0YXRlIFVQR1JBREVEXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBncmFkZTxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlbkRlZmluZWQoKTtcblxuICAgIHJldHVybiB1cGdyYWRlU3luYzxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZ3JhZGVTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBUIHtcbiAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG4gICAgXG4gICAgaWYoICEgc3RhdGUuaXNEZWZpbmVkIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IG5vdCBkZWZpbmVkIScpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICBpZiggISAoZWxlbSBpbnN0YW5jZW9mIEhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGRpZG4ndCB1cGdyYWRlIWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgVDtcbn1cblxuLy8gR28gdG8gc3RhdGUgSU5JVElBTElaRURcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemU8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlIClcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlblJlYWR5KCk7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufFRbXCJwYXJhbXNcIl0gPSBmYWxzZSk6IFQge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UpXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBzdGF0ZS5pc1JlYWR5IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IHt9IDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZShwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PSBleHRlcm5hbCBXSEVOID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCB1cGdyYWRlKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlblVwZ3JhZGVkPFQ+KCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cblxuLy8gUHJpdmF0ZSBmb3Igbm93LlxuXG5mdW5jdGlvbiBnZXRIb3N0Q3N0clN5bmM8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIFxuICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKGVsZW0pO1xuICAgIGNvbnN0IGhvc3QgPSBjdXN0b21FbGVtZW50cy5nZXQoIG5hbWUgKTtcbiAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gbm90IHlldCBkZWZpbmVkIWApO1xuICAgIHJldHVybiBob3N0IGFzIFQ7XG59XG5cbi8vVE9ETzogbW92ZSAyIHJlZ2lzdGVyeS4uLlxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnQgKTogc3RyaW5nIHtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufSIsImltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiTElTU0hvc3RcIjtcbmltcG9ydCB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJ1xufTtcblxuLy9UT0RPOiBpbXBsZW1lbnRcbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRGYWN0b3J5PEF0dHJzIGV4dGVuZHMgc3RyaW5nLCBQYXJhbXMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4+ID0gKCAoYXR0cnM6IFJlY29yZDxBdHRycywgbnVsbHxzdHJpbmc+LCBwYXJhbXM6IFBhcmFtcywgZWxlbTpIVE1MRWxlbWVudCkgPT4gTm9kZXx1bmRlZmluZWQgKTtcblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmcsXG4gICAgPiA9IHtcbiAgICAgICAgLy8gSlMgQmFzZVxuICAgICAgICBleHRlbmRzICAgOiBFeHRlbmRzQ3RyLFxuICAgICAgICBwYXJhbXMgICAgOiBQYXJhbXMsXG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGRlcHMgICAgICA6IHJlYWRvbmx5IFByb21pc2U8YW55PltdLFxuXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0cixcbiAgICAgICAgYXR0cnMgIDogcmVhZG9ubHkgQXR0cnNbXSxcbiAgICAgICAgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiByZWFkb25seSBBdHRyc1tdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXRcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgY29udGVudD86IEhUTUxfU291cmNlLFxuICAgICAgICBjb250ZW50X2ZhY3Rvcnk6IChjb250ZW50PzogRXhjbHVkZTxIVE1MX1Jlc291cmNlLCBSZXNwb25zZT4pID0+IENvbnRlbnRGYWN0b3J5PEF0dHJzLCBQYXJhbXM+LFxuICAgICAgICBjc3MgICAgIDogQ1NTX1NvdXJjZSB8IHJlYWRvbmx5IENTU19Tb3VyY2VbXSxcbiAgICAgICAgc2hhZG93ICA6IFNoYWRvd0NmZ1xufVxuXG4vLyBMSVNTQmFzZVxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZUNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBJbnN0YW5jZVR5cGU8TElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBUIGV4dGVuZHMgTElTU0Jhc2U8XG4gICAgICAgICAgICBpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgQixcbiAgICAgICAgICAgIGluZmVyIEMsXG4gICAgICAgICAgICBpbmZlciBEPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0Jhc2VDc3RyPEEsQixDLEQ+IDogbmV2ZXI7XG5cblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0Jhc2UgPyBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgSFRNTENMQVNTX1JFR0VYID0gIC9IVE1MKFxcdyspRWxlbWVudC87XG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cdFxuXHRsZXQgaHRtbHRhZyA9IEhUTUxDTEFTU19SRUdFWC5leGVjKENsYXNzLm5hbWUpIVsxXTtcblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IHR5cGVvZiBIVE1MRWxlbWVudCkge1xuXHRyZXR1cm4gQ0FOX0hBVkVfU0hBRE9XLmluY2x1ZGVzKCBfZWxlbWVudDJ0YWduYW1lKHRhZykgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn1cblxuZXhwb3J0IGNvbnN0IHdoZW5ET01Db250ZW50TG9hZGVkID0gd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn1cblxuLy8gZm9yIG1peGlucy5cbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlciIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjsiLCJcbmltcG9ydCBMSVNTIGZyb20gJy4uLy4uLy4uLyc7XG5cbmNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgTElTUyh7YXR0cnM6IFtcImVcIl19KSB7XG5cbiAgICAvLyBJbml0aWFsaXplIHlvdXIgV2ViQ29tcG9uZW50XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLy8gVXNlIHRoaXMuY29udGVudCB0byBpbml0aWFsaXplIHlvdXIgY29tcG9uZW50J3MgY29udGVudFxuICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kKCdIZWxsbyBXb3JsZCA7KScpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdTdGF0ZSAoaW5pdGlhbCknLCB7XG4gICAgICAgICAgICAvLyBVc2UgdGhpcy5jb250ZW50IHRvIGFjY2VzcyB5b3VyIGNvbXBvbmVudCdzIGNvbnRlbnQ6XG4gICAgICAgICAgICBDb250ZW50OiB0aGlzLmNvbnRlbnQsXG4gICAgICAgICAgICAvLyBVc2UgdGhpcy5ob3N0IHRvIGFjY2VzcyB0aGUgY29tcG9uZW50J3MgaG9zdDpcbiAgICAgICAgICAgIEhvc3QgICA6IHRoaXMuaG9zdCwgLy8gPG15LWNvbXBvbmVudD48L215LWNvbXBvbmVudD5cbiAgICAgICAgICAgIC8vIFVzZSB0aGlzLmF0dHJzIHRvIGVmZmljaWVudGx5IGFjY2VzcyB0aGUgY29tcG9uZW50J3MgaG9zdCdzIGF0dHJpYnV0ZXM6XG4gICAgICAgICAgICBBdHRyaWJ1dGVzOiB7Li4udGhpcy5hdHRyc30sXG4gICAgICAgICAgICAvLyBVc2UgdGhpcy5wYXJhbXMgdG8gYWNjZXNzIHRoZSBjb21wb25lbnQgcGFyYW1ldGVycy5cbiAgICAgICAgICAgIFBhcmFtZXRlcnM6IHRoaXMucGFyYW1zXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLy8gZGVmaW5lIHRoZSBcIm15LWNvbXBvbmVudFwiIGNvbXBvbmVudC5cbkxJU1MuZGVmaW5lKCdteS1jb21wb25lbnQnLCBNeUNvbXBvbmVudCk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInBhZ2VzL2V4YW1wbGVzL2Jhc2ljL2luZGV4Lmh0bWxcIjsiXSwibmFtZXMiOlsiYnVpbGRMSVNTSG9zdCIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc1NoYWRvd1N1cHBvcnRlZCIsImh0bWwiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkRFRkFVTFRfQ09OVEVOVF9GQUNUT1JZIiwiY29udGVudCIsInRyaW0iLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiY2xvbmVOb2RlIiwiSUxJU1MiLCJMSVNTIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwicGFyYW1zIiwiZGVwcyIsImhvc3QiLCJIVE1MRWxlbWVudCIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJzIiwiY29udGVudF9mYWN0b3J5IiwiX2NvbnRlbnRfZmFjdG9yeSIsImNzcyIsInNoYWRvdyIsIkNMT1NFIiwiTk9ORSIsIk9QRU4iLCJFcnJvciIsImFsbF9kZXBzIiwiUHJvbWlzZSIsIlJlc3BvbnNlIiwiX2NvbnRlbnQiLCJwdXNoIiwidGV4dCIsIkxJU1NCYXNlIiwiTElTU0NmZyIsInN0eWxlc2hlZXRzIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiYyIsImlkeCIsInByb2Nlc3NfY3NzIiwiY29uc3RydWN0b3IiLCJhcmdzIiwiSG9zdCIsInN0YXRlIiwic2V0QXR0ckRlZmF1bHQiLCJhdHRyIiwidmFsdWUiLCJvbkF0dHJDaGFuZ2VkIiwiX25hbWUiLCJfb2xkVmFsdWUiLCJfbmV3VmFsdWUiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJ1cGRhdGVQYXJhbXMiLCJhc3NpZ24iLCJpc0luRE9NIiwiaXNDb25uZWN0ZWQiLCJvbkRPTUNvbm5lY3RlZCIsImNvbm5lY3RlZENhbGxiYWNrIiwib25ET01EaXNjb25uZWN0ZWQiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsIl9Ib3N0IiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJMSVNTU3RhdGUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImlkIiwic2hhcmVkQ1NTIiwiTGlzcyIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwid2FpdFJlYWR5IiwiciIsImFsbCIsImlzUmVhZHkiLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJMSVNTSG9zdEJhc2UiLCJCYXNlIiwiYmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwiaW5pdCIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiQ1NTU2VsZWN0b3IiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicHJvbWlzZSIsInJlc29sdmUiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJhdHRhY2hTaGFkb3ciLCJtb2RlIiwib2JzIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwiY3Nzc2VsZWN0b3IiLCJoYXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsImlubmVySFRNTCIsInJlcGxhY2UiLCJoZWFkIiwiYXBwZW5kIiwiYWRkIiwib2JqIiwiY2hpbGROb2RlcyIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJpbml0aWFsaXplU3luYyIsInN0ciIsInN0cmluZyIsImkiLCJ0ZW1wbGF0ZSIsImZpcnN0Q2hpbGQiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJsaXNzIiwiZWxlbSIsIkRvY3VtZW50RnJhZ21lbnQiLCJsaXNzU3luYyIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiU3RhdGUiLCJERUZJTkVEIiwiUkVBRFkiLCJVUEdSQURFRCIsIklOSVRJQUxJWkVEIiwiaXMiLCJpc0RlZmluZWQiLCJpc1VwZ3JhZGVkIiwid2hlbiIsInByb21pc2VzIiwid2hlbkRlZmluZWQiLCJ3aGVuUmVhZHkiLCJ3aGVuVXBncmFkZWQiLCJnZXROYW1lIiwiZ2V0SG9zdENzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJnZXRTdGF0ZSIsImRlZmluZSIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsIkNsYXNzIiwiaHRtbHRhZyIsIkxJU1NjbGFzcyIsIm9wdHMiLCJzdHJpY3QiLCJ1cGdyYWRlU3luYyIsIm93bmVyRG9jdW1lbnQiLCJhZG9wdE5vZGUiLCJmb3JjZSIsImVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiTGlmZUN5Y2xlIiwiSFRNTENMQVNTX1JFR0VYIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImV4ZWMiLCJDQU5fSEFWRV9TSEFET1ciLCJ0YWciLCJyZWFkeVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIk15Q29tcG9uZW50IiwiY29uc29sZSIsImxvZyIsIkNvbnRlbnQiLCJQYXJhbWV0ZXJzIl0sInNvdXJjZVJvb3QiOiIifQ==