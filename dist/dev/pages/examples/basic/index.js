/******/ var __webpack_modules__ = ({

/***/ "./src/LISSBase.ts":
/*!*************************!*\
  !*** ./src/LISSBase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ILISS: () => (/* binding */ ILISS),
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setCstrHost: () => (/* binding */ setCstrHost)
/* harmony export */ });
/* harmony import */ var LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! LISSHost */ "./src/LISSHost.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



let __cstr_host = null;
function setCstrHost(_) {
    __cstr_host = _;
}
class ILISS {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISS);
function LISS({ // JS Base
extends: _extends = Object, /* extends is a JS reserved keyword. */ params = {}, // non-generic
deps = [], life_cycle = _types__WEBPACK_IMPORTED_MODULE_1__.LifeCycle.DEFAULT, // HTML Base
host = HTMLElement, observedAttributes = [], attrs = observedAttributes, // non-generic
content, css, shadow = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host) ? _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.CLOSE : _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE } = {}) {
    if (shadow !== _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.OPEN && !(0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host)) throw new Error(`Host element ${(0,_utils__WEBPACK_IMPORTED_MODULE_2__._element2tagname)(host)} does not support ShadowRoot`);
    const all_deps = [
        ...deps
    ];
    // content processing
    if (content instanceof Promise || content instanceof Response) {
        let _content = content;
        content = null;
        all_deps.push((async ()=>{
            _content = await _content;
            if (_content instanceof Response) _content = await _content.text();
            LISSBase.LISSCfg.content = process_content(_content);
        })());
    } else {
        content = process_content(content);
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
            content,
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
            return this.#host.isInDOM;
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
            if (this._Host === undefined) this._Host = (0,LISSHost__WEBPACK_IMPORTED_MODULE_0__.buildLISSHost)(this);
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
function process_content(content) {
    if (content === undefined) return undefined;
    if (content instanceof HTMLTemplateElement) content = content.innerHTML;
    content = content.trim();
    if (content.length === 0) return undefined;
    return content;
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
    const { host, attrs, content, stylesheets, shadow } = Liss.LISSCfg;
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
        static Base = Liss;
        // adopt state if already created.
        state = this.state ?? new state__WEBPACK_IMPORTED_MODULE_0__.LISSState(this);
        static whenDepsResolved = whenDepsResolved;
        static get isDepsResolved() {
            return isDepsResolved;
        }
        get isInitialized() {
            return this.#API !== null;
        }
        get whenInitialized() {
            return this.#waitInit; // TODO: better...
        }
        // =================================
        #params = params;
        #id = ++id;
        constructor(params, base){
            super();
            if (base !== undefined) {
                this.#API = base;
                this.init();
            }
            this.#waitInit = new Promise((resolve)=>{
                if (this.isInit) return resolve(this.#API);
                this.#resolve = (...args)=>{
                    console.warn('resolved?');
                    resolve(...args);
                };
            });
            if ("_whenUpgradedResolve" in this) this._whenUpgradedResolve();
        }
        /**** public API *************/ static get waitReady() {
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
        initialize(params = {}) {
            if (this.isInit) throw new Error('Element already initialized!');
            if (!this.isReady) throw new Error("Dependencies hasn't been loaded !");
            Object.assign(this.#params, params);
            const api = this.init();
            if (this.#isInDOM) api.onDOMConnected();
            return api;
        }
        get LISSSync() {
            if (!this.isInit) throw new Error('Accessing API before WebComponent initialization!');
            return this.#API;
        }
        get LISS() {
            return this.#waitInit;
        }
        /*** init ***/ #waitInit;
        #resolve = null;
        #API = null;
        #isInDOM = false;
        get isInDOM() {
            return this.#isInDOM;
        }
        disconnectedCallback() {
            this.#isInDOM = false;
            this.#API.onDOMDisconnected();
        }
        connectedCallback() {
            this.#isInDOM = true;
            if (!this.isInit) {
                if (!this.isReady) {
                    (async ()=>{
                        await this.waitReady;
                        this.init();
                        if (this.isInDOM) this.#API.onDOMConnected();
                    })();
                    return;
                }
                this.init();
            }
            this.#API.onDOMConnected();
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
            if (content !== undefined) {
                // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
                let template_elem = document.createElement('template');
                let str = content.replace(/\$\{(.+?)\}/g, (_, match)=>this.getAttribute(match) ?? '');
                template_elem.innerHTML = str;
                this.#content.append(...template_elem.content.childNodes);
            }
            // build
            // h4ck, okay because JS is monothreaded.
            (0,_LISSBase__WEBPACK_IMPORTED_MODULE_1__.setCstrHost)(this);
            let obj = this.#API === null ? new Liss() : this.#API;
            this.#API = obj;
            // default slot
            if (this.hasShadow && this.#content.childNodes.length === 0) this.#content.append(document.createElement('slot'));
            if (this.#resolve !== null) {
                console.warn("resolved", this.#API);
                this.#resolve(this.#API);
            }
            return this.#API;
        }
        get params() {
            return this.#params;
        }
        updateParams(params) {
            if (this.isInit) // @ts-ignore
            return this.#API.updateParams(params);
            // wil be given to constructor...
            Object.assign(this.#params, params);
        }
        /*** content ***/ #content = null;
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
        /*** attrs ***/ #attrs_flag = false;
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
        static observedAttributes = attrs;
        attributeChangedCallback(name, oldValue, newValue) {
            if (this.#attrs_flag) {
                this.#attrs_flag = false;
                return;
            }
            this.#attributes[name] = newValue;
            if (!this.isInit) return;
            if (this.#API.onAttrChanged(name, oldValue, newValue) === false) {
                this.#attrs[name] = oldValue; // revert the change.
            }
        }
    }
    ;
    return LISSHostBase;
}


/***/ }),

/***/ "./src/define.ts":
/*!***********************!*\
  !*** ./src/define.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   define: () => (/* binding */ define),
/* harmony export */   getName: () => (/* binding */ getName)
/* harmony export */ });
/* harmony import */ var LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
// ================================================
// =============== LISS define ====================
// ================================================


function define(tagname, ComponentClass) {
    const Class = ComponentClass.LISSCfg.host;
    let htmltag = (0,_utils__WEBPACK_IMPORTED_MODULE_1__._element2tagname)(Class) ?? undefined;
    const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
    console.warn("defined", tagname, LISSclass, opts);
    customElements.define(tagname, LISSclass, opts);
}
async function whenDefined(tagname, callback) {
    await customElements.whenDefined(tagname);
    if (callback !== undefined) callback();
    return;
}
async function whenAllDefined(tagnames, callback) {
    await Promise.all(tagnames.map((t)=>customElements.whenDefined(t)));
    if (callback !== undefined) callback();
}
function isDefined(name) {
    return customElements.get(name);
}
function getName(element) {
    const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name.includes('-')) throw new Error(`Element ${name} is not a WebComponent`);
    return name;
}
LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].define = define;
LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].whenDefined = whenDefined;
LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].whenAllDefined = whenAllDefined;
LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].isDefined = isDefined;
LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].getName = getName;
// ==========================================================
async function getLISS(element) {
    await LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].whenDefined(LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].getName(element));
    customElements.upgrade(element);
    console.warn("getLISS", element, element.constructor.name);
    return await element.LISS; // ensure initialized.
}
function getLISSSync(element) {
    const name = LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].getName(element);
    if (!LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].isDefined(name)) throw new Error(`${name} hasn't been defined yet.`);
    let host = element;
    if (!host.isInit) throw new Error("Instance hasn't been initialized yet.");
    return host.LISSSync;
}
LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].getLISS = getLISS;
LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"].getLISSSync = getLISSSync;


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
/* harmony import */ var _define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./define */ "./src/define.ts");


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
/* harmony export */   getState: () => (/* binding */ getState),
/* harmony export */   initialize: () => (/* binding */ initialize),
/* harmony export */   initializeSync: () => (/* binding */ initializeSync),
/* harmony export */   upgrade: () => (/* binding */ upgrade),
/* harmony export */   upgradeSync: () => (/* binding */ upgradeSync),
/* harmony export */   whenInitialized: () => (/* binding */ whenInitialized),
/* harmony export */   whenUpgraded: () => (/* binding */ whenUpgraded)
/* harmony export */ });
/* harmony import */ var define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! define */ "./src/define.ts");
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! utils */ "./src/utils.ts");


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
        return customElements.get((0,define__WEBPACK_IMPORTED_MODULE_0__.getName)(this.#elem)) !== undefined;
    }
    async whenDefined() {
        if (this.#elem === null) throw new Error('not implemented');
        return await customElements.whenDefined((0,define__WEBPACK_IMPORTED_MODULE_0__.getName)(this.#elem));
    }
    // ================== READY ==============================
    get isReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const Host = getHostCstrSync(elem);
        if (!(0,utils__WEBPACK_IMPORTED_MODULE_1__.isDOMContentLoaded)()) return false;
        return Host.isDepsResolved;
    }
    async whenReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        const host = await this.whenDefined(); // could be ready before defined, but well...
        await utils__WEBPACK_IMPORTED_MODULE_1__.whenDOMContentLoaded;
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
        return elem.LISSSync;
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
    let htmltag = (0,utils__WEBPACK_IMPORTED_MODULE_1__._element2tagname)(Class) ?? undefined;
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
    customElements.upgrade(elem);
    const Host = getHostCstrSync(elem);
    if (!(elem instanceof Host)) throw new Error(`Element didn't upgrade!`);
    return elem;
}
// Go to state INITIALIZED
async function initialize(elem, strict = false) {
    const state = getState(elem);
    if (state.isUpgraded && strict) throw new Error(`Already upgraded!`);
    const host = await upgrade(elem);
    await state.whenReady();
    host.initialize();
    return host.LISSSync;
}
function initializeSync(elem) {
    const host = upgradeSync(elem);
    if (!host.state.isReady) throw new Error("Element not ready !");
    host.initialize();
    return host.LISSSync;
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
    const name = (0,define__WEBPACK_IMPORTED_MODULE_0__.getName)(elem);
    const host = customElements.get(name);
    if (host === undefined) throw new Error(`${name} not yet defined!`);
    return host;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZGVmaW5lLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9zdGF0ZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9wYWdlcy9leGFtcGxlcy9iYXNpYy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2Jhc2ljL2luZGV4LmNzcyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2Jhc2ljL2luZGV4Lmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCJMSVNTSG9zdFwiO1xuaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBDU1NfU291cmNlLCBIVE1MX1NvdXJjZSwgTGlmZUN5Y2xlLCBMSVNTX09wdHMsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc1NoYWRvd1N1cHBvcnRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwic3RhdGVcIjtcblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cblxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cblx0Ly8gSFRNTCBCYXNlXG5cdEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG5cdEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlciwgLy9zdHJpbmcsXG4+KHtcblxuICAgIC8vIEpTIEJhc2VcbiAgICBleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCBhcyB1bmtub3duIGFzIEV4dGVuZHNDdHIsIC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuICAgIHBhcmFtcyAgICAgICAgICAgID0ge30gICAgIGFzIHVua25vd24gYXMgUGFyYW1zLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgZGVwcyAgID0gW10sXG4gICAgbGlmZV9jeWNsZSA9ICBMaWZlQ3ljbGUuREVGQVVMVCxcblxuICAgIC8vIEhUTUwgQmFzZVxuICAgIGhvc3QgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0b2JzZXJ2ZWRBdHRyaWJ1dGVzID0gW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cbiAgICBhdHRycyA9IG9ic2VydmVkQXR0cmlidXRlcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGNvbnRlbnQsXG4gICAgY3NzLFxuICAgIHNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpID8gU2hhZG93Q2ZnLkNMT1NFIDogU2hhZG93Q2ZnLk5PTkVcbn06IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4gPSB7fSkge1xuXG4gICAgaWYoIHNoYWRvdyAhPT0gU2hhZG93Q2ZnLk9QRU4gJiYgISBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICBjb25zdCBhbGxfZGVwcyA9IFsuLi5kZXBzXTtcblxuICAgIC8vIGNvbnRlbnQgcHJvY2Vzc2luZ1xuICAgIGlmKCBjb250ZW50IGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSB7XG4gICAgICAgIFxuXHRcdGxldCBfY29udGVudDogSFRNTF9Tb3VyY2V8dW5kZWZpbmVkID0gY29udGVudDtcblx0XHRjb250ZW50ID0gbnVsbCBhcyB1bmtub3duIGFzIHN0cmluZztcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBfY29udGVudCA9IGF3YWl0IF9jb250ZW50O1xuICAgICAgICAgICAgaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cblx0XHRcdFx0X2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG5cbiAgICAgICAgICAgIExJU1NCYXNlLkxJU1NDZmcuY29udGVudCA9IHByb2Nlc3NfY29udGVudChfY29udGVudCk7XG4gICAgICAgIH0pKCkgKTtcblxuICAgIH0gZWxzZSB7XG5cdFx0Y29udGVudCA9IHByb2Nlc3NfY29udGVudChjb250ZW50KTtcblx0fVxuXG5cdC8vIENTUyBwcm9jZXNzaW5nXG5cdGxldCBzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdID0gW107XG5cdGlmKCBjc3MgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG5cdFx0XHQvLyBAdHMtaWdub3JlIDogdG9kbzogTElTU09wdHMgPT4gc2hvdWxkIG5vdCBiZSBhIGdlbmVyaWMgP1xuXHRcdFx0Y3NzID0gW2Nzc107XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0c3R5bGVzaGVldHMgPSBjc3MubWFwKCAoYzogQ1NTX1NvdXJjZSwgaWR4OiBudW1iZXIpID0+IHtcblxuXHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG5cdFx0XHRcdGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0XHRjID0gYXdhaXQgYztcblx0XHRcdFx0XHRpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcblx0XHRcdFx0XHRcdGMgPSBhd2FpdCBjLnRleHQoKTtcblxuXHRcdFx0XHRcdHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuXHRcdFx0XHR9KSgpKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcm9jZXNzX2NzcyhjKTtcblx0XHR9KTtcblx0fVxuXG5cdHR5cGUgTElTU0hvc3Q8VD4gPSBhbnk7IC8vVE9ETy4uLlxuXHR0eXBlIExIb3N0ID0gTElTU0hvc3Q8TElTU0Jhc2U+OyAvLzwtIGNvbmZpZyBpbnN0ZWFkIG9mIExJU1NCYXNlID9cblxuXHRjbGFzcyBMSVNTQmFzZSBleHRlbmRzIF9leHRlbmRzIHtcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKVxuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3Qoe30sIHRoaXMpO1xuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBhbnk7IC8vIHByZXZlbnRzIGlzc3VlICMxLi4uXG5cblx0XHQvLyBMSVNTIENvbmZpZ3Ncblx0XHRzdGF0aWMgcmVhZG9ubHkgTElTU0NmZyA9IHtcblx0XHRcdGhvc3QsXG5cdFx0XHRkZXBzLFxuXHRcdFx0YXR0cnMsXG5cdFx0XHRwYXJhbXMsXG5cdFx0XHRjb250ZW50LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5jb250ZW50ITtcblx0XHR9XG5cblx0XHQvLyBhdHRyc1xuXHRcdHByb3RlY3RlZCBnZXQgYXR0cnMoKTogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIHNldEF0dHJEZWZhdWx0KCBhdHRyOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnNldEF0dHJEZWZhdWx0KGF0dHIsIHZhbHVlKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uQXR0ckNoYW5nZWQoX25hbWU6IEF0dHJzLFxuXHRcdFx0X29sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRfbmV3VmFsdWU6IHN0cmluZyk6IHZvaWR8ZmFsc2Uge31cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cblx0XHRwcm90ZWN0ZWQgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IFtBdHRycywgc3RyaW5nLCBzdHJpbmddKSB7XG5cdFx0XHR0aGlzLm9uQXR0ckNoYW5nZWQoLi4uYXJncyk7XG5cdFx0fVxuXG5cdFx0Ly8gcGFyYW1ldGVyc1xuXHRcdHB1YmxpYyBnZXQgcGFyYW1zKCk6IFJlYWRvbmx5PFBhcmFtcz4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXM7XG5cdFx0fVxuXHRcdHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4pIHtcblx0XHRcdE9iamVjdC5hc3NpZ24oICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblxuXHRcdC8vIERPTVxuXHRcdHB1YmxpYyBnZXQgaXNJbkRPTSgpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuaXNJbkRPTTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NQ29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01EaXNjb25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0XG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0luRE9NO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgc3RhdGljIF9Ib3N0OiBMSVNTSG9zdDxMSVNTQmFzZT47XG5cblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzKTtcblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQmFzZTsgICAgXG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY3NzKGNzczogc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudCkge1xuXG5cdGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG5cdFx0cmV0dXJuIGNzcztcblx0aWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG5cdFx0cmV0dXJuIGNzcy5zaGVldCE7XG5cblx0bGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0aWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0c3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuXHRcdHJldHVybiBzdHlsZTtcblx0fVxuXG5cdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJzXCIpO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzX2NvbnRlbnQoY29udGVudDogc3RyaW5nfEhUTUxUZW1wbGF0ZUVsZW1lbnR8dW5kZWZpbmVkKSB7XG5cbiAgICBpZihjb250ZW50ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBpZihjb250ZW50IGluc3RhbmNlb2YgSFRNTFRlbXBsYXRlRWxlbWVudClcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQuaW5uZXJIVE1MO1xuXG4gICAgY29udGVudCA9IGNvbnRlbnQudHJpbSgpO1xuICAgIGlmKCBjb250ZW50Lmxlbmd0aCA9PT0gMCApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gY29udGVudDtcbn0iLCJpbXBvcnQgeyBMSVNTU3RhdGUsIHVwZ3JhZGVTeW5jIH0gZnJvbSBcInN0YXRlXCI7XG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5pbXBvcnQgeyBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBpc0RPTUNvbnRlbnRMb2FkZWQsIHdhaXRET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IGlkID0gMDtcblxudHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXJcblxudHlwZSBpbmZlckxJU1M8VD4gPSBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPGluZmVyIEEsIGluZmVyIEIsIGluZmVyIEMsIGluZmVyIEQ+ID8gW0EsQixDLERdIDogbmV2ZXI7XG5cbi8vVE9ETzogc2hhZG93IHV0aWxzID9cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFxuICAgICAgICAgICAgICAgICAgICAgICAgVCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oTGlzczogVCkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRycyxcblx0XHRjb250ZW50LFxuXHRcdHN0eWxlc2hlZXRzLFxuXHRcdHNoYWRvdyxcblx0fSA9IExpc3MuTElTU0NmZztcblxuXHR0eXBlIFAgPSBpbmZlckxJU1M8VD47XG5cdC8vdHlwZSBFeHRlbmRzQ3N0ciA9IFBbMF07XG5cdHR5cGUgUGFyYW1zICAgICAgPSBQWzFdO1xuXHR0eXBlIEhvc3RDc3RyICAgID0gUFsyXTtcblx0dHlwZSBBdHRycyAgICAgICA9IFBbM107XG5cbiAgICB0eXBlIEhvc3QgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICAvLyBhdHRycyBwcm94eVxuXHRjb25zdCBHRVQgPSBTeW1ib2woJ2dldCcpO1xuXHRjb25zdCBTRVQgPSBTeW1ib2woJ3NldCcpO1xuXG5cdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoIGF0dHJzLm1hcChuID0+IFtuLCB7XG5cblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKTogc3RyaW5nfG51bGwgICAgICB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW0dFVF0obik7IH0sXG5cdFx0c2V0OiBmdW5jdGlvbih2YWx1ZTogc3RyaW5nfG51bGwpIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbU0VUXShuLCB2YWx1ZSk7IH1cblx0fV0pICk7XG5cblx0Y2xhc3MgQXR0cmlidXRlcyB7XG4gICAgICAgIFt4OiBzdHJpbmddOiBzdHJpbmd8bnVsbDtcblxuICAgICAgICAjZGF0YSAgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI2RlZmF1bHRzIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNzZXR0ZXIgICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkO1xuXG4gICAgICAgIFtHRVRdKG5hbWU6IEF0dHJzKSB7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI2RhdGFbbmFtZV0gPz8gdGhpcy4jZGVmYXVsdHNbbmFtZV0gPz8gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgW1NFVF0obmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCl7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI3NldHRlcihuYW1lLCB2YWx1ZSk7IC8vIHJlcXVpcmVkIHRvIGdldCBhIGNsZWFuIG9iamVjdCB3aGVuIGRvaW5nIHsuLi5hdHRyc31cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGEgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcblx0XHRcdFx0XHRkZWZhdWx0czogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG4gICAgICAgIFx0XHRcdHNldHRlciAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZCkge1xuXG4gICAgICAgIFx0dGhpcy4jZGF0YSAgICAgPSBkYXRhO1xuXHRcdFx0dGhpcy4jZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgXHR0aGlzLiNzZXR0ZXIgPSBzZXR0ZXI7XG5cbiAgICAgICAgXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXHR9XG5cblx0Y29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3Qgd2FpdFJlYWR5ID0gbmV3IFByb21pc2U8dm9pZD4oIGFzeW5jIChyKSA9PiB7XG5cbiAgICAgICAgYXdhaXQgd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXG4gICAgICAgIGlzUmVhZHkgPSB0cnVlO1xuXG4gICAgICAgIHIoKTtcbiAgICB9KTtcblxuICAgIC8vIE5vIGRlcHMgYW5kIERPTSBhbHJlYWR5IGxvYWRlZC5cbiAgICBsZXQgaXNSZWFkeSA9IExpc3MuTElTU0NmZy5kZXBzLmxlbmd0aCA9PSAwICYmIGlzRE9NQ29udGVudExvYWRlZCgpO1xuXG5cdGNvbnN0IHBhcmFtcyA9IExpc3MuTElTU0NmZy5wYXJhbXM7IC8vT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5MSVNTQ2ZnLnBhcmFtcywgX3BhcmFtcyk7XG5cblx0Ly9cblxuXHRjb25zdCB3aGVuRGVwc1Jlc29sdmVkID0gUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXHRsZXQgaXNEZXBzUmVzb2x2ZWQgPSBmYWxzZTtcblx0KCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRpc0RlcHNSZXNvbHZlZCA9IHRydWU7XG5cdH0pKCk7XG5cblx0Y2xhc3MgTElTU0hvc3RCYXNlIGV4dGVuZHMgKGhvc3QgYXMgbmV3ICgpID0+IEhUTUxFbGVtZW50KSB7XG5cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQvLyBhZG9wdCBzdGF0ZSBpZiBhbHJlYWR5IGNyZWF0ZWQuXG5cdFx0cmVhZG9ubHkgc3RhdGUgPSAodGhpcyBhcyBhbnkpLnN0YXRlID8/IG5ldyBMSVNTU3RhdGUodGhpcyk7XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IHdoZW5EZXBzUmVzb2x2ZWQ7XG5cdFx0c3RhdGljIGdldCBpc0RlcHNSZXNvbHZlZCgpIHtcblx0XHRcdHJldHVybiBpc0RlcHNSZXNvbHZlZDtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNBUEkgIT09IG51bGw7XG5cdFx0fVxuXHRcdGdldCB3aGVuSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jd2FpdEluaXQ7IC8vIFRPRE86IGJldHRlci4uLlxuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zID0gcGFyYW1zOyAvLyBkbyBJIG5lZWQgaXQgYXMgbWVtYmVyID8/P1xuXHRcdHJlYWRvbmx5ICNpZCA9ICsraWQ7IC8vIGZvciBkZWJ1Z1xuXG5cdFx0Y29uc3RydWN0b3IocGFyYW1zOiB7fSwgYmFzZT86IEluc3RhbmNlVHlwZTxUPikge1xuXHRcdFx0c3VwZXIoKTtcblxuXHRcdFx0aWYoIGJhc2UgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRcdHRoaXMuI0FQSSA9IGJhc2U7XG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiN3YWl0SW5pdCA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSkgPT4ge1xuXHRcdFx0XHRpZih0aGlzLmlzSW5pdClcblx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSh0aGlzLiNBUEkhKTtcblx0XHRcdFx0dGhpcy4jcmVzb2x2ZSA9ICguLi5hcmdzKSA9PiB7IGNvbnNvbGUud2FybigncmVzb2x2ZWQ/Jyk7IHJlc29sdmUoLi4uYXJncykgfTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvKioqKiBwdWJsaWMgQVBJICoqKioqKioqKioqKiovXG5cbiAgICAgICAgc3RhdGljIGdldCB3YWl0UmVhZHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2FpdFJlYWR5O1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgaXNSZWFkeSgpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1JlYWR5O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHdhaXRSZWFkeSgpIHtcbiAgICAgICAgICAgIHJldHVybiBMSVNTSG9zdEJhc2Uud2FpdFJlYWR5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIExJU1NIb3N0QmFzZS5pc1JlYWR5O1xuICAgICAgICB9XG5cblx0XHRnZXQgaXNJbml0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI0FQSSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0aW5pdGlhbGl6ZShwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPiA9IHt9KSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHRjb25zdCBhcGkgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuI2lzSW5ET00gKVxuXHRcdFx0XHQoYXBpIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIGFwaTtcblx0XHR9XG5cblx0XHRnZXQgTElTU1N5bmMoKSB7XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignQWNjZXNzaW5nIEFQSSBiZWZvcmUgV2ViQ29tcG9uZW50IGluaXRpYWxpemF0aW9uIScpO1xuXHRcdFx0cmV0dXJuIHRoaXMuI0FQSSE7XG5cdFx0fVxuXHRcdGdldCBMSVNTKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3dhaXRJbml0O1xuXHRcdH1cblxuXHRcdC8qKiogaW5pdCAqKiovXG5cdFx0I3dhaXRJbml0OiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3Jlc29sdmU6ICgodTogSW5zdGFuY2VUeXBlPFQ+KSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXHRcdCNBUEk6IEluc3RhbmNlVHlwZTxUPiB8IG51bGwgPSBudWxsO1xuXG5cdFx0I2lzSW5ET00gPSBmYWxzZTsgLy8gY291bGQgYWxzbyB1c2UgaXNDb25uZWN0ZWQuLi5cblx0XHRnZXQgaXNJbkRPTSgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNpc0luRE9NO1xuXHRcdH1cblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0dGhpcy4jaXNJbkRPTSA9IGZhbHNlO1xuXHRcdFx0KHRoaXMuI0FQSSEgYXMgYW55KS5vbkRPTURpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHR0aGlzLiNpc0luRE9NID0gdHJ1ZTtcblx0XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdCApIHsvLyBUT0RPOiBpZiBvcHRpb24gaW5pdCBlYWNoIHRpbWUuLi5cblx0XHRcdFx0aWYoICEgdGhpcy5pc1JlYWR5ICkge1xuICAgICAgICAgICAgICAgICAgICAoYXN5bmMgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMud2FpdFJlYWR5O1xuXHRcdFx0XHRcdFx0dGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5pc0luRE9NKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLiNBUEkhIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIH1cblxuXHRcdFx0KHRoaXMuI0FQSSEgYXMgYW55KS5vbkRPTUNvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblx0XHRcdFxuXHRcdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzKTtcblxuICAgICAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLlxuXHRcdFx0XG5cdFx0XHQvLyBzaGFkb3dcblx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9zdDtcblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJykge1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6IHNoYWRvd30pO1xuXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYXR0cnNcblx0XHRcdGZvcihsZXQgb2JzIG9mIGF0dHJzISlcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tvYnMgYXMgQXR0cnNdID0gdGhpcy5nZXRBdHRyaWJ1dGUob2JzKTtcblxuXHRcdFx0Ly8gY3NzXG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUyk7XG5cdFx0XHRpZiggc3R5bGVzaGVldHMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaCguLi5zdHlsZXNoZWV0cyk7XG5cdFx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdFx0Y29uc3QgY3Nzc2VsZWN0b3IgPSB0aGlzLkNTU1NlbGVjdG9yO1xuXG5cdFx0XHRcdFx0Ly8gaWYgbm90IHlldCBpbnNlcnRlZCA6XG5cdFx0XHRcdFx0aWYoICEgYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cblx0XHRcdFx0XHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG5cdFx0XHRcdFx0XHRsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcblx0XHRcdFx0XHRcdFx0XHRodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuXG5cdFx0XHRcdFx0XHRhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY29udGVudFxuXHRcdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdFx0XHRsZXQgdGVtcGxhdGVfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cdFx0XHRcdGxldCBzdHIgPSAoY29udGVudCBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gdGhpcy5nZXRBdHRyaWJ1dGUobWF0Y2gpPz8nJylcblx0ICAgIFx0XHR0ZW1wbGF0ZV9lbGVtLmlubmVySFRNTCA9IHN0cjtcblx0ICAgIFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCguLi50ZW1wbGF0ZV9lbGVtLmNvbnRlbnQuY2hpbGROb2Rlcyk7XG5cdCAgICBcdH1cblxuXHQgICAgXHQvLyBidWlsZFxuXG5cdCAgICBcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0ICAgIFx0bGV0IG9iaiA9IHRoaXMuI0FQSSA9PT0gbnVsbCA/IG5ldyBMaXNzKCkgOiB0aGlzLiNBUEk7XG5cblx0XHRcdHRoaXMuI0FQSSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdGlmKCB0aGlzLiNyZXNvbHZlICE9PSBudWxsKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihcInJlc29sdmVkXCIsIHRoaXMuI0FQSSk7XG5cdFx0XHRcdHRoaXMuI3Jlc29sdmUodGhpcy4jQVBJKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuI0FQSTtcblx0XHR9XG5cblx0XHRnZXQgcGFyYW1zKCk6IFBhcmFtcyB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jcGFyYW1zO1xuXHRcdH1cblxuICAgICAgICBwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxMSVNTX09wdHNbXCJwYXJhbXNcIl0+KSB7XG5cdFx0XHRpZiggdGhpcy5pc0luaXQgKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHRoaXMuI0FQSSEudXBkYXRlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIC8vIHdpbCBiZSBnaXZlbiB0byBjb25zdHJ1Y3Rvci4uLlxuXHRcdFx0T2JqZWN0LmFzc2lnbiggdGhpcy4jcGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cblxuXHRcdC8qKiogY29udGVudCAqKiovXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvKioqIGF0dHJzICoqKi9cblx0XHQjYXR0cnNfZmxhZyA9IGZhbHNlO1xuXG5cdFx0I2F0dHJpYnV0ZXMgICAgICAgICA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRyaWJ1dGVzRGVmYXVsdHMgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cnMgPSBuZXcgQXR0cmlidXRlcyhcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXMsXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHMsXG5cdFx0XHQobmFtZTogQXR0cnMsIHZhbHVlOnN0cmluZ3xudWxsKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSB0cnVlOyAvLyBkbyBub3QgdHJpZ2dlciBvbkF0dHJzQ2hhbmdlZC5cblx0XHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdCkgYXMgdW5rbm93biBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblxuXHRcdHNldEF0dHJEZWZhdWx0KG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0ZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Z2V0IGF0dHJzKCk6IFJlYWRvbmx5PFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+PiB7XG5cblx0XHRcdHJldHVybiB0aGlzLiNhdHRycztcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYXR0cnM7XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUgICAgOiBBdHRycyxcblx0XHRcdFx0XHRcdFx0XHQgb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHQgbmV3VmFsdWU6IHN0cmluZykge1xuXG5cdFx0XHRpZih0aGlzLiNhdHRyc19mbGFnKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gbmV3VmFsdWU7XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdCApXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0aWYoICh0aGlzLiNBUEkhIGFzIGFueSkub25BdHRyQ2hhbmdlZChuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLiNhdHRyc1tuYW1lXSA9IG9sZFZhbHVlOyAvLyByZXZlcnQgdGhlIGNoYW5nZS5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0QmFzZSBhcyBDb21wb3NlQ29uc3RydWN0b3I8dHlwZW9mIExJU1NIb3N0QmFzZSwgdHlwZW9mIGhvc3Q+O1xufVxuXG5cbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgZGVmaW5lID09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IExJU1MgZnJvbSBcIkxJU1NCYXNlXCI7XG5pbXBvcnQgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuL0xJU1NCYXNlXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZSAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuXHRcdGlzRGVmaW5lZCAgICAgIDogdHlwZW9mIGlzRGVmaW5lZDtcblx0XHRnZXROYW1lICAgICAgICA6IHR5cGVvZiBnZXROYW1lO1xuXG5cdFx0Z2V0TElTUyAgICA6IHR5cGVvZiBnZXRMSVNTO1xuXHRcdGdldExJU1NTeW5jOiB0eXBlb2YgZ2V0TElTU1N5bmM7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuXHRcdFx0XHRcdFx0XHR0YWduYW1lICAgICAgIDogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRDb21wb25lbnRDbGFzczogVCkge1xuXHRjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG5cdGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cblx0Y29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXHRcblx0Y29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG5cdFx0XHRcdFx0XHRcdFx0XHQgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblx0XG5cdGNvbnNvbGUud2FybihcImRlZmluZWRcIiwgdGFnbmFtZSwgTElTU2NsYXNzLCBvcHRzKTtcblxuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgTElTU2NsYXNzLCBvcHRzKTtcbn07XG5cblxuYXN5bmMgZnVuY3Rpb24gd2hlbkRlZmluZWQodGFnbmFtZTogc3RyaW5nLCBjYWxsYmFjaz86ICgpID0+IHZvaWQgKSA6IFByb21pc2U8dm9pZD4ge1xuXG5cdGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xuXG5cdGlmKCBjYWxsYmFjayAhPT0gdW5kZWZpbmVkKVxuXHRcdGNhbGxiYWNrKCk7XG5cblx0cmV0dXJuO1xufVxuYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdLCBjYWxsYmFjaz86ICgpID0+IHZvaWQgKSA6IFByb21pc2U8dm9pZD4ge1xuXG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG5cblx0aWYoIGNhbGxiYWNrICE9PSB1bmRlZmluZWQpXG5cdFx0Y2FsbGJhY2soKTtcblxufVxuXG5mdW5jdGlvbiBpc0RlZmluZWQobmFtZTogc3RyaW5nKSB7XG5cdHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQobmFtZSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnQgKTogc3RyaW5nIHtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufVxuXG5MSVNTLmRlZmluZSAgICAgICAgID0gZGVmaW5lO1xuTElTUy53aGVuRGVmaW5lZCAgICA9IHdoZW5EZWZpbmVkO1xuTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmFzeW5jIGZ1bmN0aW9uIGdldExJU1M8VCBleHRlbmRzIExJU1NCYXNlPiggZWxlbWVudDogRWxlbWVudCApOiBQcm9taXNlPFQ+IHtcblxuXHRhd2FpdCBMSVNTLndoZW5EZWZpbmVkKCBMSVNTLmdldE5hbWUoZWxlbWVudCkgKTtcblxuXHRjdXN0b21FbGVtZW50cy51cGdyYWRlKCBlbGVtZW50ICk7XG5cblx0Y29uc29sZS53YXJuKFwiZ2V0TElTU1wiLCBlbGVtZW50LCBlbGVtZW50LmNvbnN0cnVjdG9yLm5hbWUgKTtcblxuXHRyZXR1cm4gYXdhaXQgKGVsZW1lbnQgYXMgTElTU0hvc3Q8VD4pLkxJU1MgYXMgVDsgLy8gZW5zdXJlIGluaXRpYWxpemVkLlxufVxuZnVuY3Rpb24gZ2V0TElTU1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPiggZWxlbWVudDogRWxlbWVudCApOiBUIHtcblxuXHRjb25zdCBuYW1lID0gTElTUy5nZXROYW1lKGVsZW1lbnQpO1xuXHRpZiggISBMSVNTLmlzRGVmaW5lZCggbmFtZSApIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gaGFzbid0IGJlZW4gZGVmaW5lZCB5ZXQuYCk7XG5cblx0bGV0IGhvc3QgPSBlbGVtZW50IGFzIExJU1NIb3N0PFQ+O1xuXG5cdGlmKCAhIGhvc3QuaXNJbml0IClcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YW5jZSBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXQuXCIpO1xuXG5cdHJldHVybiBob3N0LkxJU1NTeW5jIGFzIFQ7XG59XG5cbkxJU1MuZ2V0TElTUyAgICAgPSBnZXRMSVNTO1xuTElTUy5nZXRMSVNTU3luYyA9IGdldExJU1NTeW5jOyIsImltcG9ydCBMSVNTIGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmltcG9ydCBcIi4vZGVmaW5lXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgTElTUzsiLCJpbXBvcnQgeyBnZXROYW1lIH0gZnJvbSBcImRlZmluZVwiO1xuaW1wb3J0IHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCJ0eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCJ1dGlsc1wiO1xuXG5lbnVtIFN0YXRlIHtcbiAgICBOT05FID0gMCxcblxuICAgIC8vIGNsYXNzXG4gICAgREVGSU5FRCA9IDEgPDwgMCxcbiAgICBSRUFEWSAgID0gMSA8PCAxLFxuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBVUEdSQURFRCAgICA9IDEgPDwgMixcbiAgICBJTklUSUFMSVpFRCA9IDEgPDwgMyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRklORUQgICAgID0gU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IFN0YXRlLlJFQURZO1xuZXhwb3J0IGNvbnN0IFVQR1JBREVEICAgID0gU3RhdGUuVVBHUkFERUQ7XG5leHBvcnQgY29uc3QgSU5JVElBTElaRUQgPSBTdGF0ZS5JTklUSUFMSVpFRDtcblxuZXhwb3J0IGNsYXNzIExJU1NTdGF0ZSB7XG5cbiAgICAjZWxlbTogSFRNTEVsZW1lbnR8bnVsbDtcblxuICAgIC8vIGlmIG51bGwgOiBjbGFzcyBzdGF0ZSwgZWxzZSBpbnN0YW5jZSBzdGF0ZVxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEhUTUxFbGVtZW50fG51bGwgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuI2VsZW0gPSBlbGVtO1xuICAgIH1cblxuICAgIHN0YXRpYyBERUZJTkVEICAgICA9IERFRklORUQ7XG4gICAgc3RhdGljIFJFQURZICAgICAgID0gUkVBRFk7XG4gICAgc3RhdGljIFVQR1JBREVEICAgID0gVVBHUkFERUQ7XG4gICAgc3RhdGljIElOSVRJQUxJWkVEID0gSU5JVElBTElaRUQ7XG5cbiAgICBpcyhzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCAgICAgJiYgISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZICAgICAgICYmICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgICAgJiYgISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCAmJiAhIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW4oc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGxldCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPGFueT4+KCk7XG4gICAgXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuRGVmaW5lZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblJlYWR5KCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuVXBncmFkZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5Jbml0aWFsaXplZCgpICk7XG4gICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gREVGSU5FRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0RlZmluZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFJFQURZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgICAgIGlmKCAhIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gSG9zdC5pc0RlcHNSZXNvbHZlZDtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTsgLy8gY291bGQgYmUgcmVhZHkgYmVmb3JlIGRlZmluZWQsIGJ1dCB3ZWxsLi4uXG5cbiAgICAgICAgYXdhaXQgd2hlbkRPTUNvbnRlbnRMb2FkZWQ7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuRGVwc1Jlc29sdmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gVVBHUkFERUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNVcGdyYWRlZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgY29uc3QgaG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcbiAgICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBob3N0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7XG4gICAgXG4gICAgICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgaG9zdClcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgXG4gICAgICAgIC8vIGg0Y2tcbiAgICBcbiAgICAgICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgICAgIFxuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWQgICAgICAgID0gcHJvbWlzZTtcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgXG4gICAgICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gSU5JVElBTElaRUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNJbml0aWFsaXplZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiBcImlzSW5pdGlhbGl6ZWRcIiBpbiBlbGVtICYmIGVsZW0uaXNJbml0aWFsaXplZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oKSB7XG4gICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlblVwZ3JhZGVkKCk7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQ7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtIGFzIExJU1NIb3N0PFQ+KS5MSVNTU3luYyBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBDT05WRVJTSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhbHVlT2YoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZTogU3RhdGUgPSAwO1xuICAgIFxuICAgICAgICBpZiggdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gREVGSU5FRDtcbiAgICAgICAgaWYoIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICBzdGF0ZSB8PSBSRUFEWTtcbiAgICAgICAgaWYoIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBVUEdSQURFRDtcbiAgICAgICAgaWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcbiAgICBcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiREVGSU5FRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgaXMucHVzaChcIlJFQURZXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJJTklUSUFMSVpFRFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGlzLmpvaW4oJ3wnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmKCBcInN0YXRlXCIgaW4gZWxlbSlcbiAgICAgICAgcmV0dXJuIGVsZW0uc3RhdGUgYXMgTElTU1N0YXRlO1xuICAgIFxuICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLnN0YXRlID0gbmV3IExJU1NTdGF0ZShlbGVtKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IFN0YXRlIG1vZGlmaWVycyAobW92ZT8pID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHbyB0byBzdGF0ZSBERUZJTkVEXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+KSB7XG5cbiAgICAvLyBjb3VsZCBiZSBiZXR0ZXIuXG4gICAgaWYoIFwiQmFzZVwiIGluIENvbXBvbmVudENsYXNzKSB7XG4gICAgICAgIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQmFzZSBhcyBUO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7IC8vYnVpbGRMSVNTSG9zdDxUPihDb21wb25lbnRDbGFzcywgcGFyYW1zKTtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG4vLyBHbyB0byBzdGF0ZSBVUEdSQURFRFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZ3JhZGU8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5EZWZpbmVkKCk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgKGVsZW0gaW5zdGFuY2VvZiBIb3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBkaWRuJ3QgdXBncmFkZSFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIFQ7XG59XG5cbi8vIEdvIHRvIHN0YXRlIElOSVRJQUxJWkVEXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5SZWFkeSgpO1xuXG4gICAgaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5MSVNTU3luYyBhcyBUO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+KTogVCB7XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBob3N0LnN0YXRlLmlzUmVhZHkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5MSVNTU3luYyBhcyBUO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PSBleHRlcm5hbCBXSEVOID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCB1cGdyYWRlKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlblVwZ3JhZGVkPFQ+KCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cblxuLy8gUHJpdmF0ZSBmb3Igbm93LlxuXG5mdW5jdGlvbiBnZXRIb3N0Q3N0clN5bmM8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIFxuICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKGVsZW0pO1xuICAgIGNvbnN0IGhvc3QgPSBjdXN0b21FbGVtZW50cy5nZXQoIG5hbWUgKTtcbiAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gbm90IHlldCBkZWZpbmVkIWApO1xuICAgIHJldHVybiBob3N0IGFzIFQ7XG59IiwiaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCJMSVNTSG9zdFwiO1xuaW1wb3J0IHsgTElTUyB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3Mge31cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7IG5ldyguLi5hcmdzOmFueVtdKTogVH07XG5cbmV4cG9ydCB0eXBlIENTU19SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MU3R5bGVFbGVtZW50fENTU1N0eWxlU2hlZXQ7XG5leHBvcnQgdHlwZSBDU1NfU291cmNlICAgPSBDU1NfUmVzb3VyY2UgfCBQcm9taXNlPENTU19SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIEhUTUxfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFRlbXBsYXRlRWxlbWVudDtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJ1xufTtcblxuLy9UT0RPOiBpbXBsZW1lbnRcbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nLFxuICAgID4gPSB7XG4gICAgICAgIC8vIEpTIEJhc2VcbiAgICAgICAgZXh0ZW5kcyAgIDogRXh0ZW5kc0N0cixcbiAgICAgICAgcGFyYW1zICAgIDogUGFyYW1zLFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBkZXBzICAgICAgOiByZWFkb25seSBQcm9taXNlPGFueT5bXSxcbiAgICAgICAgbGlmZV9jeWNsZTogTGlmZUN5Y2xlLCBcblxuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsXG4gICAgICAgIGF0dHJzICA6IHJlYWRvbmx5IEF0dHJzW10sXG4gICAgICAgIG9ic2VydmVkQXR0cmlidXRlczogcmVhZG9ubHkgQXR0cnNbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0XG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGNvbnRlbnQ/OiBIVE1MX1NvdXJjZSxcbiAgICAgICAgY3NzICAgICA6IENTU19Tb3VyY2UgfCByZWFkb25seSBDU1NfU291cmNlW10sXG4gICAgICAgIHNoYWRvdyAgOiBTaGFkb3dDZmdcbn1cblxuLy8gTElTU0Jhc2VcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2VDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2U8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gSW5zdGFuY2VUeXBlPExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gVCBleHRlbmRzIExJU1NCYXNlPFxuICAgICAgICAgICAgaW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEIsXG4gICAgICAgICAgICBpbmZlciBDLFxuICAgICAgICAgICAgaW5mZXIgRD4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NCYXNlQ3N0cjxBLEIsQyxEPiA6IG5ldmVyO1xuXG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NCYXNlID8gTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IEhUTUxDTEFTU19SRUdFWCA9ICAvSFRNTChcXHcrKUVsZW1lbnQvO1xuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXHRcblx0bGV0IGh0bWx0YWcgPSBIVE1MQ0xBU1NfUkVHRVguZXhlYyhDbGFzcy5uYW1lKSFbMV07XG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIlxuaW1wb3J0IExJU1MgZnJvbSAnLi4vLi4vLi4vJztcblxuY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBMSVNTKHthdHRyczogW1wiZVwiXX0pIHtcblxuICAgIC8vIEluaXRpYWxpemUgeW91ciBXZWJDb21wb25lbnRcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAvLyBVc2UgdGhpcy5jb250ZW50IHRvIGluaXRpYWxpemUgeW91ciBjb21wb25lbnQncyBjb250ZW50XG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmQoJ0hlbGxvIFdvcmxkIDspJyk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ1N0YXRlIChpbml0aWFsKScsIHtcbiAgICAgICAgICAgIC8vIFVzZSB0aGlzLmNvbnRlbnQgdG8gYWNjZXNzIHlvdXIgY29tcG9uZW50J3MgY29udGVudDpcbiAgICAgICAgICAgIENvbnRlbnQ6IHRoaXMuY29udGVudCxcbiAgICAgICAgICAgIC8vIFVzZSB0aGlzLmhvc3QgdG8gYWNjZXNzIHRoZSBjb21wb25lbnQncyBob3N0OlxuICAgICAgICAgICAgSG9zdCAgIDogdGhpcy5ob3N0LCAvLyA8bXktY29tcG9uZW50PjwvbXktY29tcG9uZW50PlxuICAgICAgICAgICAgLy8gVXNlIHRoaXMuYXR0cnMgdG8gZWZmaWNpZW50bHkgYWNjZXNzIHRoZSBjb21wb25lbnQncyBob3N0J3MgYXR0cmlidXRlczpcbiAgICAgICAgICAgIEF0dHJpYnV0ZXM6IHsuLi50aGlzLmF0dHJzfSxcbiAgICAgICAgICAgIC8vIFVzZSB0aGlzLnBhcmFtcyB0byBhY2Nlc3MgdGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgUGFyYW1ldGVyczogdGhpcy5wYXJhbXNcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vLyBkZWZpbmUgdGhlIFwibXktY29tcG9uZW50XCIgY29tcG9uZW50LlxuTElTUy5kZWZpbmUoJ215LWNvbXBvbmVudCcsIE15Q29tcG9uZW50KTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwicGFnZXMvZXhhbXBsZXMvYmFzaWMvaW5kZXguaHRtbFwiOyJdLCJuYW1lcyI6WyJidWlsZExJU1NIb3N0IiwiTGlmZUN5Y2xlIiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzU2hhZG93U3VwcG9ydGVkIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJJTElTUyIsIkxJU1MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJwYXJhbXMiLCJkZXBzIiwibGlmZV9jeWNsZSIsIkRFRkFVTFQiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnQiLCJjc3MiLCJzaGFkb3ciLCJDTE9TRSIsIk5PTkUiLCJPUEVOIiwiRXJyb3IiLCJhbGxfZGVwcyIsIlByb21pc2UiLCJSZXNwb25zZSIsIl9jb250ZW50IiwicHVzaCIsInRleHQiLCJMSVNTQmFzZSIsIkxJU1NDZmciLCJwcm9jZXNzX2NvbnRlbnQiLCJzdHlsZXNoZWV0cyIsInVuZGVmaW5lZCIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImMiLCJpZHgiLCJwcm9jZXNzX2NzcyIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkhvc3QiLCJzdGF0ZSIsInNldEF0dHJEZWZhdWx0IiwiYXR0ciIsInZhbHVlIiwib25BdHRyQ2hhbmdlZCIsIl9uYW1lIiwiX29sZFZhbHVlIiwiX25ld1ZhbHVlIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwidXBkYXRlUGFyYW1zIiwiYXNzaWduIiwiaXNJbkRPTSIsIm9uRE9NQ29ubmVjdGVkIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJvbkRPTURpc2Nvbm5lY3RlZCIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiaXNDb25uZWN0ZWQiLCJfSG9zdCIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiSFRNTFRlbXBsYXRlRWxlbWVudCIsImlubmVySFRNTCIsInRyaW0iLCJsZW5ndGgiLCJMSVNTU3RhdGUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImlkIiwic2hhcmVkQ1NTIiwiTGlzcyIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwid2FpdFJlYWR5IiwiciIsImFsbCIsImlzUmVhZHkiLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJMSVNTSG9zdEJhc2UiLCJCYXNlIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImJhc2UiLCJpbml0IiwicmVzb2x2ZSIsImlzSW5pdCIsImNvbnNvbGUiLCJ3YXJuIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJpbml0aWFsaXplIiwiYXBpIiwiTElTU1N5bmMiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJhdHRhY2hTaGFkb3ciLCJtb2RlIiwib2JzIiwiZ2V0QXR0cmlidXRlIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwiY3Nzc2VsZWN0b3IiLCJDU1NTZWxlY3RvciIsImhhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwicmVwbGFjZSIsImhlYWQiLCJhcHBlbmQiLCJhZGQiLCJ0ZW1wbGF0ZV9lbGVtIiwic3RyIiwibWF0Y2giLCJjaGlsZE5vZGVzIiwib2JqIiwiaGFzU2hhZG93IiwiZ2V0UGFydCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwicmVtb3ZlQXR0cmlidXRlIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImRlZmluZSIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsIkNsYXNzIiwiaHRtbHRhZyIsIkxJU1NjbGFzcyIsIm9wdHMiLCJ3aGVuRGVmaW5lZCIsImNhbGxiYWNrIiwid2hlbkFsbERlZmluZWQiLCJ0YWduYW1lcyIsInQiLCJpc0RlZmluZWQiLCJnZXROYW1lIiwiZWxlbWVudCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJnZXRMSVNTIiwiZ2V0TElTU1N5bmMiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsIlN0YXRlIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsImVsZW0iLCJpcyIsImlzVXBncmFkZWQiLCJ3aGVuIiwicHJvbWlzZXMiLCJ3aGVuUmVhZHkiLCJ3aGVuVXBncmFkZWQiLCJnZXRIb3N0Q3N0clN5bmMiLCJfd2hlblVwZ3JhZGVkIiwicHJvbWlzZSIsIndpdGhSZXNvbHZlcnMiLCJ2YWx1ZU9mIiwidG9TdHJpbmciLCJqb2luIiwiZ2V0U3RhdGUiLCJzdHJpY3QiLCJ1cGdyYWRlU3luYyIsImluaXRpYWxpemVTeW5jIiwiZm9yY2UiLCJIVE1MQ0xBU1NfUkVHRVgiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiZXhlYyIsIkNBTl9IQVZFX1NIQURPVyIsInRhZyIsInJlYWR5U3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiTXlDb21wb25lbnQiLCJsb2ciLCJDb250ZW50IiwiUGFyYW1ldGVycyJdLCJzb3VyY2VSb290IjoiIn0=