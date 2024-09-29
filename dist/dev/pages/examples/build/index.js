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
  !*** ./src/pages/examples/build/index.ts ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var helpers_build__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! helpers/build */ "./src/helpers/build.ts");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../ */ "./src/index.ts");
/* harmony import */ var state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! state */ "./src/state.ts");



// =============================================================
class MyComponentA extends (0,___WEBPACK_IMPORTED_MODULE_1__["default"])() {
    constructor(){
        super();
        this.content.replaceChildren((0,helpers_build__WEBPACK_IMPORTED_MODULE_0__.html)`<b>html\`\` : OK</b>`);
    }
}
(0,state__WEBPACK_IMPORTED_MODULE_2__.define)('my-component-a', MyComponentA);
// =============================================================
class MyComponentB extends (0,___WEBPACK_IMPORTED_MODULE_1__["default"])({
    content: "liss``"
}) {
    constructor(){
        console.log("init");
        super();
    }
}
(0,state__WEBPACK_IMPORTED_MODULE_2__.define)('my-component-b', MyComponentB);
async function foo() {
    const component = await (0,helpers_build__WEBPACK_IMPORTED_MODULE_0__.liss)`<my-component-b></my-component-b>`;
    document.body.append(component.host);
}
foo();
{
    let compo = new MyComponentB.Host();
    document.body.append(compo);
    console.warn("host", (0,state__WEBPACK_IMPORTED_MODULE_2__.getState)(compo));
}{
    let compo = new MyComponentB();
    document.body.append(compo.host);
    console.warn("base", (0,state__WEBPACK_IMPORTED_MODULE_2__.getState)(compo.host));
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!********************************************!*\
  !*** ./src/pages/examples/build/index.css ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************!*\
  !*** ./src/pages/examples/build/index.html ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "pages/examples/build/index.html");
})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TkE7Ozs7Ozs7Ozs7Ozs7OztBQ0MyQztBQUNkO0FBQ1k7QUFFekMsZ0VBQWdFO0FBRWhFLE1BQU1vRixxQkFBcUI5TCw2Q0FBSUE7SUFFM0JpQyxhQUFjO1FBQ1YsS0FBSztRQUVMLElBQUksQ0FBQ3hDLE9BQU8sQ0FBQ3NNLGVBQWUsQ0FBQzNNLG1EQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDM0Q7QUFDSjtBQUVBbUwsNkNBQU1BLENBQUMsa0JBQWtCdUI7QUFFekIsZ0VBQWdFO0FBRWhFLE1BQU1FLHFCQUFxQmhNLDZDQUFJQSxDQUFDO0lBQzVCUCxTQUFTO0FBQ2I7SUFFSXdDLGFBQWM7UUFDVmdLLFFBQVFDLEdBQUcsQ0FBQztRQUNaLEtBQUs7SUFDVDtBQUNKO0FBRUEzQiw2Q0FBTUEsQ0FBQyxrQkFBa0J5QjtBQUV6QixlQUFlRztJQUVYLE1BQU1DLFlBQVksTUFBTXRELG1EQUFJLENBQUMsaUNBQWlDLENBQUM7SUFFL0R4QixTQUFTK0UsSUFBSSxDQUFDdEUsTUFBTSxDQUFDcUUsVUFBVTlMLElBQUk7QUFDdkM7QUFFQTZMO0FBRUE7SUFDSSxJQUFJRyxRQUFRLElBQUlOLGFBQWE3SixJQUFJO0lBQ2pDbUYsU0FBUytFLElBQUksQ0FBQ3RFLE1BQU0sQ0FBQ3VFO0lBRXJCTCxRQUFRTSxJQUFJLENBQUMsUUFBUWpDLCtDQUFRQSxDQUFDZ0M7QUFDbEMsQ0FDQTtJQUNJLElBQUlBLFFBQVEsSUFBSU47SUFDaEIxRSxTQUFTK0UsSUFBSSxDQUFDdEUsTUFBTSxDQUFDdUUsTUFBTWhNLElBQUk7SUFFL0IyTCxRQUFRTSxJQUFJLENBQUMsUUFBUWpDLCtDQUFRQSxDQUFDZ0MsTUFBTWhNLElBQUk7QUFDNUMsQzs7Ozs7Ozs7OztBQ3BEQTs7Ozs7Ozs7Ozs7OztBQ0FBLGlFQUFlLHFCQUF1QixvQ0FBb0MsRSIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvYnVpbGQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2J1aWxkL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguY3NzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIkxJU1NIb3N0XCI7XG5pbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIENvbnRlbnRGYWN0b3J5LCBDU1NfU291cmNlLCBIVE1MX1Jlc291cmNlLCBIVE1MX1NvdXJjZSwgTGlmZUN5Y2xlLCBMSVNTX09wdHMsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc1NoYWRvd1N1cHBvcnRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiaGVscGVycy9idWlsZFwiO1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBERUZBVUxUX0NPTlRFTlRfRkFDVE9SWShjb250ZW50PzogRXhjbHVkZTxIVE1MX1Jlc291cmNlLCBSZXNwb25zZT4pIHtcblxuXHRpZiggdHlwZW9mIGNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcblxuXHRcdGNvbnRlbnQgPSBjb250ZW50LnRyaW0oKTtcblx0XHRpZiggY29udGVudC5sZW5ndGggPT09IDAgKVxuXHRcdFx0Y29udGVudCA9IHVuZGVmaW5lZDtcblxuXHRcdGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHRjb250ZW50ID0gaHRtbGAke2NvbnRlbnR9YDtcblxuXHRcdC8vIFRPRE8gTElTU0F1dG8gcGFyc2VyLi4uXG5cdFx0Ly8gb25seSBpZiBubyBKUy4uLlxuXHRcdC8vIHRvbGVyYXRlIG5vbi1vcHRpIChlYXNpZXIgPykgb3Igc3Bhblt2YWx1ZV0gP1xuXHRcdFx0Ly8gPT4gcmVjb3JkIGVsZW1lbnQgd2l0aCB0YXJnZXQuLi5cblx0XHRcdC8vID0+IGNsb25lKGF0dHJzLCBwYXJhbXMpID0+IGZvciBlYWNoIHNwYW4gcmVwbGFjZSB0aGVuIGNsb25lLlxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHQvL2xldCBzdHIgPSAoY29udGVudCBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gdGhpcy5nZXRBdHRyaWJ1dGUobWF0Y2gpPz8nJylcblx0fVxuXG5cdGlmKCBjb250ZW50IGluc3RhbmNlb2YgSFRNTFRlbXBsYXRlRWxlbWVudClcblx0XHRjb250ZW50ID0gY29udGVudC5jb250ZW50O1xuXG5cdHJldHVybiAoKSA9PiBjb250ZW50Py5jbG9uZU5vZGUodHJ1ZSk7XG59XG5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuXG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4oe1xuXG4gICAgLy8gSlMgQmFzZVxuICAgIGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0IGFzIHVua25vd24gYXMgRXh0ZW5kc0N0ciwgLyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG4gICAgcGFyYW1zICAgICAgICAgICAgPSB7fSAgICAgYXMgdW5rbm93biBhcyBQYXJhbXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBkZXBzICAgPSBbXSxcblxuICAgIC8vIEhUTUwgQmFzZVxuICAgIGhvc3QgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0b2JzZXJ2ZWRBdHRyaWJ1dGVzID0gW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cbiAgICBhdHRycyA9IG9ic2VydmVkQXR0cmlidXRlcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGNvbnRlbnQsXG5cdGNvbnRlbnRfZmFjdG9yeTogX2NvbnRlbnRfZmFjdG9yeSA9IERFRkFVTFRfQ09OVEVOVF9GQUNUT1JZLFxuICAgIGNzcyxcbiAgICBzaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSA/IFNoYWRvd0NmZy5DTE9TRSA6IFNoYWRvd0NmZy5OT05FXG59OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+ID0ge30pIHtcblxuICAgIGlmKCBzaGFkb3cgIT09IFNoYWRvd0NmZy5PUEVOICYmICEgaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgY29uc3QgYWxsX2RlcHMgPSBbLi4uZGVwc107XG5cblx0bGV0IGNvbnRlbnRfZmFjdG9yeTogQ29udGVudEZhY3Rvcnk8QXR0cnMsIFBhcmFtcz47XG5cbiAgICAvLyBjb250ZW50IHByb2Nlc3NpbmdcbiAgICBpZiggY29udGVudCBpbnN0YW5jZW9mIFByb21pc2UgfHwgY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkge1xuICAgICAgICBcblx0XHRsZXQgX2NvbnRlbnQ6IEhUTUxfU291cmNlfHVuZGVmaW5lZCA9IGNvbnRlbnQ7XG5cdFx0Y29udGVudCA9IG51bGwgYXMgdW5rbm93biBhcyBzdHJpbmc7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudDtcbiAgICAgICAgICAgIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG5cdFx0XHRcdF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuXG4gICAgICAgICAgICBMSVNTQmFzZS5MSVNTQ2ZnLmNvbnRlbnRfZmFjdG9yeSA9IF9jb250ZW50X2ZhY3RvcnkoX2NvbnRlbnQpO1xuICAgICAgICB9KSgpICk7XG5cbiAgICB9IGVsc2Uge1xuXHRcdGNvbnRlbnRfZmFjdG9yeSA9IF9jb250ZW50X2ZhY3RvcnkoY29udGVudCk7XG5cdH1cblxuXHQvLyBDU1MgcHJvY2Vzc2luZ1xuXHRsZXQgc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXSA9IFtdO1xuXHRpZiggY3NzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuXHRcdFx0Ly8gQHRzLWlnbm9yZSA6IHRvZG86IExJU1NPcHRzID0+IHNob3VsZCBub3QgYmUgYSBnZW5lcmljID9cblx0XHRcdGNzcyA9IFtjc3NdO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHN0eWxlc2hlZXRzID0gY3NzLm1hcCggKGM6IENTU19Tb3VyY2UsIGlkeDogbnVtYmVyKSA9PiB7XG5cblx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuXHRcdFx0XHRhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdFx0YyA9IGF3YWl0IGM7XG5cdFx0XHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG5cdFx0XHRcdFx0XHRjID0gYXdhaXQgYy50ZXh0KCk7XG5cblx0XHRcdFx0XHRzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cblx0XHRcdFx0fSkoKSk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvY2Vzc19jc3MoYyk7XG5cdFx0fSk7XG5cdH1cblxuXHR0eXBlIExJU1NIb3N0PFQ+ID0gYW55OyAvL1RPRE8uLi5cblx0dHlwZSBMSG9zdCA9IExJU1NIb3N0PExJU1NCYXNlPjsgLy88LSBjb25maWcgaW5zdGVhZCBvZiBMSVNTQmFzZSA/XG5cblx0Y2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBfZXh0ZW5kcyB7XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsIClcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KHt9LCB0aGlzKTtcblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogYW55OyAvLyBwcmV2ZW50cyBpc3N1ZSAjMS4uLlxuXG5cdFx0Ly8gTElTUyBDb25maWdzXG5cdFx0c3RhdGljIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5jb250ZW50ITtcblx0XHR9XG5cblx0XHQvLyBhdHRyc1xuXHRcdHByb3RlY3RlZCBnZXQgYXR0cnMoKTogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIHNldEF0dHJEZWZhdWx0KCBhdHRyOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnNldEF0dHJEZWZhdWx0KGF0dHIsIHZhbHVlKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uQXR0ckNoYW5nZWQoX25hbWU6IEF0dHJzLFxuXHRcdFx0X29sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRfbmV3VmFsdWU6IHN0cmluZyk6IHZvaWR8ZmFsc2Uge31cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cblx0XHRwcm90ZWN0ZWQgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IFtBdHRycywgc3RyaW5nLCBzdHJpbmddKSB7XG5cdFx0XHR0aGlzLm9uQXR0ckNoYW5nZWQoLi4uYXJncyk7XG5cdFx0fVxuXG5cdFx0Ly8gcGFyYW1ldGVyc1xuXHRcdHB1YmxpYyBnZXQgcGFyYW1zKCk6IFJlYWRvbmx5PFBhcmFtcz4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXM7XG5cdFx0fVxuXHRcdHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4pIHtcblx0XHRcdE9iamVjdC5hc3NpZ24oICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblxuXHRcdC8vIERPTVxuXHRcdHB1YmxpYyBnZXQgaXNJbkRPTSgpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuaXNDb25uZWN0ZWQ7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTUNvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NRGlzY29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaXNJbkRPTTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHN0YXRpYyBfSG9zdDogTElTU0hvc3Q8TElTU0Jhc2U+O1xuXG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QodGhpcyBhcyBhbnkpOyAvL1RPRE86IGZpeCB0eXBlIGVycm9yICh3aHk/Pz8pXG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gTElTU0Jhc2U7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY3NzKGNzczogc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudCkge1xuXG5cdGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG5cdFx0cmV0dXJuIGNzcztcblx0aWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG5cdFx0cmV0dXJuIGNzcy5zaGVldCE7XG5cblx0bGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0aWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0c3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuXHRcdHJldHVybiBzdHlsZTtcblx0fVxuXG5cdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJzXCIpO1xufSIsImltcG9ydCB7IExJU1NTdGF0ZSwgdXBncmFkZVN5bmMgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IExJU1NfT3B0cywgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IENvbXBvc2VDb25zdHJ1Y3RvciwgaXNET01Db250ZW50TG9hZGVkLCB3YWl0RE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCBpZCA9IDA7XG5cbnR5cGUgaW5mZXJMSVNTPFQ+ID0gVCBleHRlbmRzIExJU1NCYXNlQ3N0cjxpbmZlciBBLCBpbmZlciBCLCBpbmZlciBDLCBpbmZlciBEPiA/IFtBLEIsQyxEXSA6IG5ldmVyO1xuXG4vL1RPRE86IHNoYWRvdyB1dGlscyA/XG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMSVNTSG9zdDxcbiAgICAgICAgICAgICAgICAgICAgICAgIFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KExpc3M6IFQpIHtcblx0Y29uc3Qge1xuXHRcdGhvc3QsXG5cdFx0YXR0cnMsXG5cdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdHN0eWxlc2hlZXRzLFxuXHRcdHNoYWRvdyxcblx0fSA9IExpc3MuTElTU0NmZztcblxuXHR0eXBlIFAgPSBpbmZlckxJU1M8VD47XG5cdC8vdHlwZSBFeHRlbmRzQ3N0ciA9IFBbMF07XG5cdHR5cGUgUGFyYW1zICAgICAgPSBQWzFdO1xuXHR0eXBlIEhvc3RDc3RyICAgID0gUFsyXTtcblx0dHlwZSBBdHRycyAgICAgICA9IFBbM107XG5cbiAgICB0eXBlIEhvc3QgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICAvLyBhdHRycyBwcm94eVxuXHRjb25zdCBHRVQgPSBTeW1ib2woJ2dldCcpO1xuXHRjb25zdCBTRVQgPSBTeW1ib2woJ3NldCcpO1xuXG5cdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoIGF0dHJzLm1hcChuID0+IFtuLCB7XG5cblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKTogc3RyaW5nfG51bGwgICAgICB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW0dFVF0obik7IH0sXG5cdFx0c2V0OiBmdW5jdGlvbih2YWx1ZTogc3RyaW5nfG51bGwpIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbU0VUXShuLCB2YWx1ZSk7IH1cblx0fV0pICk7XG5cblx0Y2xhc3MgQXR0cmlidXRlcyB7XG4gICAgICAgIFt4OiBzdHJpbmddOiBzdHJpbmd8bnVsbDtcblxuICAgICAgICAjZGF0YSAgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI2RlZmF1bHRzIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNzZXR0ZXIgICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkO1xuXG4gICAgICAgIFtHRVRdKG5hbWU6IEF0dHJzKSB7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI2RhdGFbbmFtZV0gPz8gdGhpcy4jZGVmYXVsdHNbbmFtZV0gPz8gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgW1NFVF0obmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCl7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI3NldHRlcihuYW1lLCB2YWx1ZSk7IC8vIHJlcXVpcmVkIHRvIGdldCBhIGNsZWFuIG9iamVjdCB3aGVuIGRvaW5nIHsuLi5hdHRyc31cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGEgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcblx0XHRcdFx0XHRkZWZhdWx0czogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG4gICAgICAgIFx0XHRcdHNldHRlciAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZCkge1xuXG4gICAgICAgIFx0dGhpcy4jZGF0YSAgICAgPSBkYXRhO1xuXHRcdFx0dGhpcy4jZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgXHR0aGlzLiNzZXR0ZXIgPSBzZXR0ZXI7XG5cbiAgICAgICAgXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXHR9XG5cblx0Y29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3Qgd2FpdFJlYWR5ID0gbmV3IFByb21pc2U8dm9pZD4oIGFzeW5jIChyKSA9PiB7XG5cbiAgICAgICAgYXdhaXQgd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXG4gICAgICAgIGlzUmVhZHkgPSB0cnVlO1xuXG4gICAgICAgIHIoKTtcbiAgICB9KTtcblxuICAgIC8vIE5vIGRlcHMgYW5kIERPTSBhbHJlYWR5IGxvYWRlZC5cbiAgICBsZXQgaXNSZWFkeSA9IExpc3MuTElTU0NmZy5kZXBzLmxlbmd0aCA9PSAwICYmIGlzRE9NQ29udGVudExvYWRlZCgpO1xuXG5cdGNvbnN0IHBhcmFtcyA9IExpc3MuTElTU0NmZy5wYXJhbXM7IC8vT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5MSVNTQ2ZnLnBhcmFtcywgX3BhcmFtcyk7XG5cblx0Ly9cblxuXHRjb25zdCB3aGVuRGVwc1Jlc29sdmVkID0gUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXHRsZXQgaXNEZXBzUmVzb2x2ZWQgPSBmYWxzZTtcblx0KCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRpc0RlcHNSZXNvbHZlZCA9IHRydWU7XG5cdH0pKCk7XG5cblx0Y2xhc3MgTElTU0hvc3RCYXNlIGV4dGVuZHMgKGhvc3QgYXMgbmV3ICgpID0+IEhUTUxFbGVtZW50KSB7XG5cblx0XHQvLyBhZG9wdCBzdGF0ZSBpZiBhbHJlYWR5IGNyZWF0ZWQuXG5cdFx0cmVhZG9ubHkgc3RhdGUgPSAodGhpcyBhcyBhbnkpLnN0YXRlID8/IG5ldyBMSVNTU3RhdGUodGhpcyk7XG5cblx0XHQvLyA9PT09PT09PT09PT0gREVQRU5ERU5DSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdHN0YXRpYyByZWFkb25seSB3aGVuRGVwc1Jlc29sdmVkID0gd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGlzRGVwc1Jlc29sdmVkO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0c3RhdGljIEJhc2UgPSBMaXNzO1xuXG5cdFx0I2Jhc2U6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgYmFzZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNiYXNlO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2UgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHRpbml0aWFsaXplKHBhcmFtczogUGFydGlhbDxQYXJhbXM+ID0ge30pIHtcblxuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgKCB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNEZXBzUmVzb2x2ZWQgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY2llcyBoYXNuJ3QgYmVlbiBsb2FkZWQgIVwiKTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLiNwYXJhbXMsIHBhcmFtcyk7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuaXNDb25uZWN0ZWQgKVxuXHRcdFx0XHQodGhpcy4jYmFzZSBhcyBhbnkpLm9uRE9NQ29ubmVjdGVkKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNiYXNlO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHJlYWRvbmx5ICNwYXJhbXM6IFBhcmFtcyA9IHBhcmFtcztcblxuXHRcdGdldCBwYXJhbXMoKTogUGFyYW1zIHtcblx0XHRcdHJldHVybiB0aGlzLiNwYXJhbXM7XG5cdFx0fVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPExJU1NfT3B0c1tcInBhcmFtc1wiXT4pIHtcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHRoaXMuYmFzZSEudXBkYXRlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIC8vIHdpbCBiZSBnaXZlbiB0byBjb25zdHJ1Y3Rvci4uLlxuXHRcdFx0T2JqZWN0LmFzc2lnbiggdGhpcy4jcGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cdFx0Ly8gPT09PT09PT09PT09PT0gQXR0cmlidXRlcyA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjYXR0cnNfZmxhZyA9IGZhbHNlO1xuXG5cdFx0I2F0dHJpYnV0ZXMgICAgICAgICA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRyaWJ1dGVzRGVmYXVsdHMgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cnMgPSBuZXcgQXR0cmlidXRlcyhcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXMsXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHMsXG5cdFx0XHQobmFtZTogQXR0cnMsIHZhbHVlOnN0cmluZ3xudWxsKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSB0cnVlOyAvLyBkbyBub3QgdHJpZ2dlciBvbkF0dHJzQ2hhbmdlZC5cblx0XHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdCkgYXMgdW5rbm93biBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblxuXHRcdHNldEF0dHJEZWZhdWx0KG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0ZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Z2V0IGF0dHJzKCk6IFJlYWRvbmx5PFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+PiB7XG5cblx0XHRcdHJldHVybiB0aGlzLiNhdHRycztcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBDb250ZW50ID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNjb250ZW50OiBIb3N0fFNoYWRvd1Jvb3R8bnVsbCA9IG51bGw7XG5cblx0XHRnZXQgY29udGVudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250ZW50O1xuXHRcdH1cblxuXHRcdGdldFBhcnQobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cdFx0Z2V0UGFydHMobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0IGhhc1NoYWRvdygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBzaGFkb3cgIT09ICdub25lJztcblx0XHR9XG5cblx0XHQvKioqIENTUyAqKiovXG5cblx0XHRnZXQgQ1NTU2VsZWN0b3IoKSB7XG5cblx0XHRcdGlmKHRoaXMuaGFzU2hhZG93IHx8ICEgdGhpcy5oYXNBdHRyaWJ1dGUoXCJpc1wiKSApXG5cdFx0XHRcdHJldHVybiB0aGlzLnRhZ05hbWU7XG5cblx0XHRcdHJldHVybiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gSW1wbCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHRjb25zdHJ1Y3RvcihwYXJhbXM6IHt9LCBiYXNlPzogSW5zdGFuY2VUeXBlPFQ+KSB7XG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGlmKCBiYXNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy4jYmFzZSA9IGJhc2U7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdCh0aGlzLmJhc2UhIGFzIGFueSkub25ET01EaXNjb25uZWN0ZWQoKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmJhc2UhLm9uRE9NQ29ubmVjdGVkKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5zdGF0ZS5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCggYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdGF3YWl0IHRoaXMuc3RhdGUuaXNSZWFkeTtcblxuXHRcdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHR9KSgpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblx0XHRcdFxuXHRcdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzKTtcblxuICAgICAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLlxuXHRcdFx0XG5cdFx0XHQvLyBzaGFkb3dcblx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9zdDtcblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJykge1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6IHNoYWRvd30pO1xuXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYXR0cnNcblx0XHRcdGZvcihsZXQgb2JzIG9mIGF0dHJzISlcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tvYnMgYXMgQXR0cnNdID0gdGhpcy5nZXRBdHRyaWJ1dGUob2JzKTtcblxuXHRcdFx0Ly8gY3NzXG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUyk7XG5cdFx0XHRpZiggc3R5bGVzaGVldHMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaCguLi5zdHlsZXNoZWV0cyk7XG5cdFx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdFx0Y29uc3QgY3Nzc2VsZWN0b3IgPSB0aGlzLkNTU1NlbGVjdG9yO1xuXG5cdFx0XHRcdFx0Ly8gaWYgbm90IHlldCBpbnNlcnRlZCA6XG5cdFx0XHRcdFx0aWYoICEgYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cblx0XHRcdFx0XHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG5cdFx0XHRcdFx0XHRsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcblx0XHRcdFx0XHRcdFx0XHRodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuXG5cdFx0XHRcdFx0XHRhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY29udGVudFxuXHRcdFx0Y29uc3QgY29udGVudCA9IGNvbnRlbnRfZmFjdG9yeSh0aGlzLmF0dHJzLCB0aGlzLnBhcmFtcywgdGhpcyk7XG5cdFx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggY29udGVudCApO1xuXG5cdCAgICBcdC8vIGJ1aWxkXG5cblx0ICAgIFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHQgICAgXHRsZXQgb2JqID0gdGhpcy5iYXNlID09PSBudWxsID8gbmV3IExpc3MoKSA6IHRoaXMuYmFzZTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmJhc2UpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlO1xuXHRcdH1cblxuXG5cblx0XHQvLyBhdHRyc1xuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGF0dHJzO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lICAgIDogQXR0cnMsXG5cdFx0XHRcdFx0XHRcdFx0IG9sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdFx0IG5ld1ZhbHVlOiBzdHJpbmcpIHtcblxuXHRcdFx0aWYodGhpcy4jYXR0cnNfZmxhZykge1xuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IG5ld1ZhbHVlO1xuXHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRpZiggKHRoaXMuYmFzZSEgYXMgYW55KS5vbkF0dHJDaGFuZ2VkKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzW25hbWVdID0gb2xkVmFsdWU7IC8vIHJldmVydCB0aGUgY2hhbmdlLlxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3RCYXNlIGFzIENvbXBvc2VDb25zdHJ1Y3Rvcjx0eXBlb2YgTElTU0hvc3RCYXNlLCB0eXBlb2YgaG9zdD47XG59XG5cblxuIiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9pbmRleFwiO1xuaW1wb3J0IHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCJ0eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudD4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiBUIHtcbiAgICBcbiAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN0cmluZyArPSBgJHthcmdzW2ldfWA7XG4gICAgICAgIHN0cmluZyArPSBgJHtzdHJbaSsxXX1gO1xuICAgICAgICAvL1RPRE86IG1vcmUgcHJlLXByb2Nlc3Nlc1xuICAgIH1cblxuICAgIC8vIHVzaW5nIHRlbXBsYXRlIHByZXZlbnRzIEN1c3RvbUVsZW1lbnRzIHVwZ3JhZGUuLi5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHJpbmcudHJpbSgpO1xuXG4gICAgaWYoIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEgJiYgdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpXG4gICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkISBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudCEgYXMgdW5rbm93biBhcyBUO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzczxUIGV4dGVuZHMgTElTU0Jhc2U+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn1cblxuXG50eXBlIEJVSUxEX09QVElPTlM8VCBleHRlbmRzIExJU1NCYXNlPiA9IFBhcnRpYWw8e1xuICAgIHBhcmFtcyAgICA6IFBhcnRpYWw8VFtcInBhcmFtc1wiXT4sXG4gICAgY29udGVudFx0ICA6IHN0cmluZ3xOb2RlfHJlYWRvbmx5IE5vZGVbXSxcbiAgICBpZCBcdFx0ICAgIDogc3RyaW5nLFxuICAgIGNsYXNzZXNcdCAgOiByZWFkb25seSBzdHJpbmdbXSxcbiAgICBjc3N2YXJzICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PixcbiAgICBhdHRycyBcdCAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGRhdGEgXHQgICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGxpc3RlbmVycyA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIChldjogRXZlbnQpID0+IHZvaWQ+PlxufT4gJiAoe1xuICBpbml0aWFsaXplOiBmYWxzZSxcbiAgcGFyZW50OiBFbGVtZW50XG59fHtcbiAgaW5pdGlhbGl6ZT86IHRydWUsXG4gIHBhcmVudD86IEVsZW1lbnRcbn0pO1xuXG4vL2FzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IFByb21pc2U8Q29tcG9uZW50c1tUXT47XG4vKlxuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZT4odGFnbmFtZTogc3RyaW5nLCB7XG4gICAgICAgICAgICAgIHBhcmFtcyAgICA9IHt9LFxuICAgICAgICAgICAgICBpbml0aWFsaXplPSB0cnVlLFxuICAgICAgICAgICAgICBjb250ZW50ICAgPSBbXSxcbiAgICAgICAgICAgICAgcGFyZW50ICAgID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBpZCBcdFx0ICA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgY2xhc3NlcyAgID0gW10sXG4gICAgICAgICAgICAgIGNzc3ZhcnMgICA9IHt9LFxuICAgICAgICAgICAgICBhdHRycyAgICAgPSB7fSxcbiAgICAgICAgICAgICAgZGF0YSBcdCAgPSB7fSxcbiAgICAgICAgICAgICAgbGlzdGVuZXJzID0ge31cbiAgICAgICAgICAgICAgfTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogUHJvbWlzZTxUPiB7XG5cbiAgaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG4gIGxldCBDdXN0b21DbGFzcyA9IGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xuICBsZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4gIC8vIEZpeCBpc3N1ZSAjMlxuICBpZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuICBlbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG4gIGlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbiAgZWxlbS5pZCA9IGlkO1xuXG4gIGlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG4gIGVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuICBmb3IobGV0IG5hbWUgaW4gY3NzdmFycylcbiAgZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbiAgbGV0IHZhbHVlID0gYXR0cnNbbmFtZV07XG4gIGlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuICBlbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIGVsc2VcbiAgZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgZm9yKGxldCBuYW1lIGluIGRhdGEpIHtcblxuICBsZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuICBpZiggdmFsdWUgPT09IGZhbHNlKVxuICBkZWxldGUgZWxlbS5kYXRhc2V0W25hbWVdO1xuICBlbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuICBlbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuICBlbHNlXG4gIGVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgaWYoICEgQXJyYXkuaXNBcnJheShjb250ZW50KSApXG4gIGNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuICBlbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuICBmb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuICBpZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxuICBwYXJlbnQuYXBwZW5kKGVsZW0pO1xuXG4gIGlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxuICByZXR1cm4gYXdhaXQgTElTUy5pbml0aWFsaXplKGVsZW0pO1xuXG4gIHJldHVybiBhd2FpdCBMSVNTLmdldExJU1MoZWxlbSk7XG59XG5MSVNTLmJ1aWxkID0gYnVpbGQ7XG5cblxuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IENvbXBvbmVudHNbVF07XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBUO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIHtcbnBhcmFtcyAgICA9IHt9LFxuaW5pdGlhbGl6ZT0gdHJ1ZSxcbmNvbnRlbnQgICA9IFtdLFxucGFyZW50ICAgID0gdW5kZWZpbmVkLFxuaWQgXHRcdCAgPSB1bmRlZmluZWQsXG5jbGFzc2VzICAgPSBbXSxcbmNzc3ZhcnMgICA9IHt9LFxuYXR0cnMgICAgID0ge30sXG5kYXRhIFx0ICA9IHt9LFxubGlzdGVuZXJzID0ge31cbn06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFQge1xuXG5pZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbnRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxubGV0IEN1c3RvbUNsYXNzID0gY3VzdG9tRWxlbWVudHMuZ2V0KHRhZ25hbWUpO1xuaWYoQ3VzdG9tQ2xhc3MgPT09IHVuZGVmaW5lZClcbnRocm93IG5ldyBFcnJvcihgJHt0YWduYW1lfSBub3QgZGVmaW5lZGApO1xubGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuLy9UT0RPOiBmYWN0b3JpemUuLi5cblxuLy8gRml4IGlzc3VlICMyXG5pZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuZWxlbS5pZCA9IGlkO1xuXG5pZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG5mb3IobGV0IG5hbWUgaW4gY3NzdmFycylcbmVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG5mb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxubGV0IHZhbHVlID0gYXR0cnNbbmFtZV07XG5pZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbmVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbmVsc2VcbmVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbn1cblxuZm9yKGxldCBuYW1lIGluIGRhdGEpIHtcblxubGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbmlmKCB2YWx1ZSA9PT0gZmFsc2UpXG5kZWxldGUgZWxlbS5kYXRhc2V0W25hbWVdO1xuZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbmVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG5lbHNlXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbn1cblxuaWYoICEgQXJyYXkuaXNBcnJheShjb250ZW50KSApXG5jb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbmVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG5mb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbmlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG5wYXJlbnQuYXBwZW5kKGVsZW0pO1xuXG5pZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbkxJU1MuaW5pdGlhbGl6ZVN5bmMoZWxlbSk7XG5cbnJldHVybiBMSVNTLmdldExJU1NTeW5jKGVsZW0pO1xufVxuTElTUy5idWlsZFN5bmMgPSBidWlsZFN5bmM7XG4qLyIsImltcG9ydCBMSVNTIGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbi8vaW1wb3J0IFwiLi9kZWZpbmVcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBMSVNTOyIsImltcG9ydCB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwidHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwidXRpbHNcIjtcblxuZW51bSBTdGF0ZSB7XG4gICAgTk9ORSA9IDAsXG5cbiAgICAvLyBjbGFzc1xuICAgIERFRklORUQgPSAxIDw8IDAsXG4gICAgUkVBRFkgICA9IDEgPDwgMSxcblxuICAgIC8vIGluc3RhbmNlXG4gICAgVVBHUkFERUQgICAgPSAxIDw8IDIsXG4gICAgSU5JVElBTElaRUQgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCBjb25zdCBERUZJTkVEICAgICA9IFN0YXRlLkRFRklORUQ7XG5leHBvcnQgY29uc3QgUkVBRFkgICAgICAgPSBTdGF0ZS5SRUFEWTtcbmV4cG9ydCBjb25zdCBVUEdSQURFRCAgICA9IFN0YXRlLlVQR1JBREVEO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVEID0gU3RhdGUuSU5JVElBTElaRUQ7XG5cbmV4cG9ydCBjbGFzcyBMSVNTU3RhdGUge1xuXG4gICAgI2VsZW06IEhUTUxFbGVtZW50fG51bGw7XG5cbiAgICAvLyBpZiBudWxsIDogY2xhc3Mgc3RhdGUsIGVsc2UgaW5zdGFuY2Ugc3RhdGVcbiAgICBjb25zdHJ1Y3RvcihlbGVtOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbCkge1xuICAgICAgICB0aGlzLiNlbGVtID0gZWxlbTtcbiAgICB9XG5cbiAgICBzdGF0aWMgREVGSU5FRCAgICAgPSBERUZJTkVEO1xuICAgIHN0YXRpYyBSRUFEWSAgICAgICA9IFJFQURZO1xuICAgIHN0YXRpYyBVUEdSQURFRCAgICA9IFVQR1JBREVEO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFRCA9IElOSVRJQUxJWkVEO1xuXG4gICAgaXMoc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgICAgICYmICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSAgICAgICAmJiAhIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEICAgICYmICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgJiYgISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBsZXQgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxhbnk+PigpO1xuICAgIFxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkRlZmluZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5SZWFkeSgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblVwZ3JhZGVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuSW5pdGlhbGl6ZWQoKSApO1xuICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IERFRklORUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNEZWZpbmVkKCkge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KCBnZXROYW1lKHRoaXMuI2VsZW0pICkgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBSRUFEWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1JlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG4gICAgICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgaG9zdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpO1xuICAgIFxuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIGhvc3QpXG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIFxuICAgICAgICAvLyBoNGNrXG4gICAgXG4gICAgICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgICAgICBcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuICAgIFxuICAgICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IElOSVRJQUxJWkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gXCJpc0luaXRpYWxpemVkXCIgaW4gZWxlbSAmJiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuYmFzZSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBDT05WRVJTSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhbHVlT2YoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZTogU3RhdGUgPSAwO1xuICAgIFxuICAgICAgICBpZiggdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gREVGSU5FRDtcbiAgICAgICAgaWYoIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICBzdGF0ZSB8PSBSRUFEWTtcbiAgICAgICAgaWYoIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBVUEdSQURFRDtcbiAgICAgICAgaWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcbiAgICBcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiREVGSU5FRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgaXMucHVzaChcIlJFQURZXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJJTklUSUFMSVpFRFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGlzLmpvaW4oJ3wnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmKCBcInN0YXRlXCIgaW4gZWxlbSlcbiAgICAgICAgcmV0dXJuIGVsZW0uc3RhdGUgYXMgTElTU1N0YXRlO1xuICAgIFxuICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLnN0YXRlID0gbmV3IExJU1NTdGF0ZShlbGVtKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IFN0YXRlIG1vZGlmaWVycyAobW92ZT8pID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHbyB0byBzdGF0ZSBERUZJTkVEXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+KSB7XG5cbiAgICAvLyBjb3VsZCBiZSBiZXR0ZXIuXG4gICAgaWYoIFwiQmFzZVwiIGluIENvbXBvbmVudENsYXNzKSB7XG4gICAgICAgIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQmFzZSBhcyBUO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7IC8vYnVpbGRMSVNTSG9zdDxUPihDb21wb25lbnRDbGFzcywgcGFyYW1zKTtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG4vLyBHbyB0byBzdGF0ZSBVUEdSQURFRFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZ3JhZGU8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5EZWZpbmVkKCk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgKGVsZW0gaW5zdGFuY2VvZiBIb3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBkaWRuJ3QgdXBncmFkZSFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIFQ7XG59XG5cbi8vIEdvIHRvIHN0YXRlIElOSVRJQUxJWkVEXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSApXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5SZWFkeSgpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBUIHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgc3RhdGUuaXNSZWFkeSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT0gZXh0ZXJuYWwgV0hFTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlbkluaXRpYWxpemVkPFQ+KCk7XG59XG5cbi8vIFByaXZhdGUgZm9yIG5vdy5cblxuZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBcbiAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShlbGVtKTtcbiAgICBjb25zdCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KCBuYW1lICk7XG4gICAgaWYoIGhvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IG5vdCB5ZXQgZGVmaW5lZCFgKTtcbiAgICByZXR1cm4gaG9zdCBhcyBUO1xufVxuXG4vL1RPRE86IG1vdmUgMiByZWdpc3RlcnkuLi5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50ICk6IHN0cmluZyB7XG5cblx0Y29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcblx0aWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuXHRyZXR1cm4gbmFtZTtcbn0iLCJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIkxJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50XG5leHBvcnQgZW51bSBMaWZlQ3ljbGUge1xuICAgIERFRkFVTFQgICAgICAgICAgICAgICAgICAgPSAwLFxuXHQvLyBub3QgaW1wbGVtZW50ZWQgeWV0XG4gICAgSU5JVF9BRlRFUl9DSElMRFJFTiAgICAgICA9IDEgPDwgMSxcbiAgICBJTklUX0FGVEVSX1BBUkVOVCAgICAgICAgID0gMSA8PCAyLFxuICAgIC8vIHF1aWQgcGFyYW1zL2F0dHJzID9cbiAgICBSRUNSRUFURV9BRlRFUl9DT05ORUNUSU9OID0gMSA8PCAzLCAvKiByZXF1aXJlcyByZWJ1aWxkIGNvbnRlbnQgKyBkZXN0cm95L2Rpc3Bvc2Ugd2hlbiByZW1vdmVkIGZyb20gRE9NICovXG4gICAgLyogc2xlZXAgd2hlbiBkaXNjbyA6IHlvdSBuZWVkIHRvIGltcGxlbWVudCBpdCB5b3Vyc2VsZiAqL1xufVxuXG5leHBvcnQgdHlwZSBDb250ZW50RmFjdG9yeTxBdHRycyBleHRlbmRzIHN0cmluZywgUGFyYW1zIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+PiA9ICggKGF0dHJzOiBSZWNvcmQ8QXR0cnMsIG51bGx8c3RyaW5nPiwgcGFyYW1zOiBQYXJhbXMsIGVsZW06SFRNTEVsZW1lbnQpID0+IE5vZGV8dW5kZWZpbmVkICk7XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nLFxuICAgID4gPSB7XG4gICAgICAgIC8vIEpTIEJhc2VcbiAgICAgICAgZXh0ZW5kcyAgIDogRXh0ZW5kc0N0cixcbiAgICAgICAgcGFyYW1zICAgIDogUGFyYW1zLFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBkZXBzICAgICAgOiByZWFkb25seSBQcm9taXNlPGFueT5bXSxcblxuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsXG4gICAgICAgIGF0dHJzICA6IHJlYWRvbmx5IEF0dHJzW10sXG4gICAgICAgIG9ic2VydmVkQXR0cmlidXRlczogcmVhZG9ubHkgQXR0cnNbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0XG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGNvbnRlbnQ/OiBIVE1MX1NvdXJjZSxcbiAgICAgICAgY29udGVudF9mYWN0b3J5OiAoY29udGVudD86IEV4Y2x1ZGU8SFRNTF9SZXNvdXJjZSwgUmVzcG9uc2U+KSA9PiBDb250ZW50RmFjdG9yeTxBdHRycywgUGFyYW1zPixcbiAgICAgICAgY3NzICAgICA6IENTU19Tb3VyY2UgfCByZWFkb25seSBDU1NfU291cmNlW10sXG4gICAgICAgIHNoYWRvdyAgOiBTaGFkb3dDZmdcbn1cblxuLy8gTElTU0Jhc2VcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2VDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2U8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gSW5zdGFuY2VUeXBlPExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gVCBleHRlbmRzIExJU1NCYXNlPFxuICAgICAgICAgICAgaW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEIsXG4gICAgICAgICAgICBpbmZlciBDLFxuICAgICAgICAgICAgaW5mZXIgRD4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NCYXNlQ3N0cjxBLEIsQyxEPiA6IG5ldmVyO1xuXG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NCYXNlID8gTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IEhUTUxDTEFTU19SRUdFWCA9ICAvSFRNTChcXHcrKUVsZW1lbnQvO1xuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXHRcblx0bGV0IGh0bWx0YWcgPSBIVE1MQ0xBU1NfUkVHRVguZXhlYyhDbGFzcy5uYW1lKSFbMV07XG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG5leHBvcnQgdHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXIiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7IiwiXG5pbXBvcnQgeyBodG1sLCBsaXNzIH0gZnJvbSAnaGVscGVycy9idWlsZCc7XG5pbXBvcnQgTElTUyBmcm9tICcuLi8uLi8uLi8nO1xuaW1wb3J0IHsgZGVmaW5lLCBnZXRTdGF0ZSB9IGZyb20gJ3N0YXRlJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBNeUNvbXBvbmVudEEgZXh0ZW5kcyBMSVNTKCkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50LnJlcGxhY2VDaGlsZHJlbihodG1sYDxiPmh0bWxcXGBcXGAgOiBPSzwvYj5gKTtcbiAgICB9XG59XG5cbmRlZmluZSgnbXktY29tcG9uZW50LWEnLCBNeUNvbXBvbmVudEEpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNsYXNzIE15Q29tcG9uZW50QiBleHRlbmRzIExJU1Moe1xuICAgIGNvbnRlbnQ6IFwibGlzc2BgXCJcbn0pIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImluaXRcIik7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxufVxuXG5kZWZpbmUoJ215LWNvbXBvbmVudC1iJywgTXlDb21wb25lbnRCKTtcblxuYXN5bmMgZnVuY3Rpb24gZm9vKCkge1xuXG4gICAgY29uc3QgY29tcG9uZW50ID0gYXdhaXQgbGlzc2A8bXktY29tcG9uZW50LWI+PC9teS1jb21wb25lbnQtYj5gO1xuICAgIFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGNvbXBvbmVudC5ob3N0KTtcbn1cblxuZm9vKCk7XG5cbntcbiAgICBsZXQgY29tcG8gPSBuZXcgTXlDb21wb25lbnRCLkhvc3QoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChjb21wbyk7XG5cbiAgICBjb25zb2xlLndhcm4oXCJob3N0XCIsIGdldFN0YXRlKGNvbXBvKSApO1xufVxue1xuICAgIGxldCBjb21wbyA9IG5ldyBNeUNvbXBvbmVudEIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChjb21wby5ob3N0KTtcblxuICAgIGNvbnNvbGUud2FybihcImJhc2VcIiwgZ2V0U3RhdGUoY29tcG8uaG9zdCkgKTtcbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImV4cG9ydCBkZWZhdWx0IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJwYWdlcy9leGFtcGxlcy9idWlsZC9pbmRleC5odG1sXCI7Il0sIm5hbWVzIjpbImJ1aWxkTElTU0hvc3QiLCJTaGFkb3dDZmciLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJodG1sIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJERUZBVUxUX0NPTlRFTlRfRkFDVE9SWSIsImNvbnRlbnQiLCJ0cmltIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiSFRNTFRlbXBsYXRlRWxlbWVudCIsImNsb25lTm9kZSIsIklMSVNTIiwiTElTUyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsInBhcmFtcyIsImRlcHMiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnRfZmFjdG9yeSIsIl9jb250ZW50X2ZhY3RvcnkiLCJjc3MiLCJzaGFkb3ciLCJDTE9TRSIsIk5PTkUiLCJPUEVOIiwiRXJyb3IiLCJhbGxfZGVwcyIsIlByb21pc2UiLCJSZXNwb25zZSIsIl9jb250ZW50IiwicHVzaCIsInRleHQiLCJMSVNTQmFzZSIsIkxJU1NDZmciLCJzdHlsZXNoZWV0cyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImMiLCJpZHgiLCJwcm9jZXNzX2NzcyIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkhvc3QiLCJzdGF0ZSIsInNldEF0dHJEZWZhdWx0IiwiYXR0ciIsInZhbHVlIiwib25BdHRyQ2hhbmdlZCIsIl9uYW1lIiwiX29sZFZhbHVlIiwiX25ld1ZhbHVlIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwidXBkYXRlUGFyYW1zIiwiYXNzaWduIiwiaXNJbkRPTSIsImlzQ29ubmVjdGVkIiwib25ET01Db25uZWN0ZWQiLCJjb25uZWN0ZWRDYWxsYmFjayIsIm9uRE9NRGlzY29ubmVjdGVkIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJfSG9zdCIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiTElTU1N0YXRlIiwiaXNET01Db250ZW50TG9hZGVkIiwid2FpdERPTUNvbnRlbnRMb2FkZWQiLCJpZCIsInNoYXJlZENTUyIsIkxpc3MiLCJHRVQiLCJTeW1ib2wiLCJTRVQiLCJwcm9wZXJ0aWVzIiwiZnJvbUVudHJpZXMiLCJuIiwiZW51bWVyYWJsZSIsImdldCIsInNldCIsIkF0dHJpYnV0ZXMiLCJuYW1lIiwiZGF0YSIsImRlZmF1bHRzIiwic2V0dGVyIiwiZGVmaW5lUHJvcGVydGllcyIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsIndhaXRSZWFkeSIsInIiLCJhbGwiLCJpc1JlYWR5Iiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiTElTU0hvc3RCYXNlIiwiQmFzZSIsImJhc2UiLCJpc0luaXRpYWxpemVkIiwid2hlbkluaXRpYWxpemVkIiwiaW5pdGlhbGl6ZSIsImluaXQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJnZXRQYXJ0IiwiaGFzU2hhZG93IiwicXVlcnlTZWxlY3RvciIsImdldFBhcnRzIiwicXVlcnlTZWxlY3RvckFsbCIsIkNTU1NlbGVjdG9yIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInByb21pc2UiLCJyZXNvbHZlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwiYXR0YWNoU2hhZG93IiwibW9kZSIsIm9icyIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsImNzc3NlbGVjdG9yIiwiaGFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJpbm5lckhUTUwiLCJyZXBsYWNlIiwiaGVhZCIsImFwcGVuZCIsImFkZCIsIm9iaiIsImNoaWxkTm9kZXMiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiaW5pdGlhbGl6ZVN5bmMiLCJzdHIiLCJzdHJpbmciLCJpIiwidGVtcGxhdGUiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibGlzcyIsImVsZW0iLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsIlN0YXRlIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsImlzIiwiaXNEZWZpbmVkIiwiaXNVcGdyYWRlZCIsIndoZW4iLCJwcm9taXNlcyIsIndoZW5EZWZpbmVkIiwid2hlblJlYWR5Iiwid2hlblVwZ3JhZGVkIiwiZ2V0TmFtZSIsImdldEhvc3RDc3RyU3luYyIsIl93aGVuVXBncmFkZWQiLCJ2YWx1ZU9mIiwidG9TdHJpbmciLCJqb2luIiwiZ2V0U3RhdGUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJDbGFzcyIsImh0bWx0YWciLCJMSVNTY2xhc3MiLCJvcHRzIiwic3RyaWN0IiwidXBncmFkZVN5bmMiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZm9yY2UiLCJlbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsIkxpZmVDeWNsZSIsIkhUTUxDTEFTU19SRUdFWCIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJleGVjIiwiQ0FOX0hBVkVfU0hBRE9XIiwidGFnIiwicmVhZHlTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJNeUNvbXBvbmVudEEiLCJyZXBsYWNlQ2hpbGRyZW4iLCJNeUNvbXBvbmVudEIiLCJjb25zb2xlIiwibG9nIiwiZm9vIiwiY29tcG9uZW50IiwiYm9keSIsImNvbXBvIiwid2FybiJdLCJzb3VyY2VSb290IjoiIn0=