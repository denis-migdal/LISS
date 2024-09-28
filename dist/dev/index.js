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
            if (content !== undefined) {
                let template_elem = document.createElement('template');
                // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
                //let str = (content as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
                let str = content;
                template_elem.innerHTML = str;
                this.#content.append(...template_elem.content.childNodes);
            }
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
//TODO remove...


function define(tagname, ComponentClass) {
    const Class = ComponentClass.LISSCfg.host;
    let htmltag = (0,_utils__WEBPACK_IMPORTED_MODULE_1__._element2tagname)(Class) ?? undefined;
    const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
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
/* harmony import */ var _define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./define */ "./src/define.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"]);

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUM4QyxPQUFPLEVBQUVDLE9BQU8sRUFBQyxHQUFHOUYsUUFBUStGLGFBQWE7SUFFbkRVLFNBQVM4RCxnQkFBZ0IsQ0FBQyxvQkFBb0I7UUFDN0N6RTtJQUNELEdBQUc7SUFFQSxNQUFNRDtBQUNWOzs7Ozs7O1NDaEZBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7OztBQ044QjtBQUVaO0FBR2xCLGlFQUFlakgsaURBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NCYXNlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0hvc3QudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9kZWZpbmUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9zdGF0ZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xJU1MvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCJMSVNTSG9zdFwiO1xuaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBDU1NfU291cmNlLCBIVE1MX1NvdXJjZSwgTGlmZUN5Y2xlLCBMSVNTX09wdHMsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc1NoYWRvd1N1cHBvcnRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwic3RhdGVcIjtcblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cblxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cblx0Ly8gSFRNTCBCYXNlXG5cdEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG5cdEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlciwgLy9zdHJpbmcsXG4+KHtcblxuICAgIC8vIEpTIEJhc2VcbiAgICBleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCBhcyB1bmtub3duIGFzIEV4dGVuZHNDdHIsIC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuICAgIHBhcmFtcyAgICAgICAgICAgID0ge30gICAgIGFzIHVua25vd24gYXMgUGFyYW1zLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgZGVwcyAgID0gW10sXG4gICAgbGlmZV9jeWNsZSA9ICBMaWZlQ3ljbGUuREVGQVVMVCxcblxuICAgIC8vIEhUTUwgQmFzZVxuICAgIGhvc3QgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0b2JzZXJ2ZWRBdHRyaWJ1dGVzID0gW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cbiAgICBhdHRycyA9IG9ic2VydmVkQXR0cmlidXRlcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGNvbnRlbnQsXG4gICAgY3NzLFxuICAgIHNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpID8gU2hhZG93Q2ZnLkNMT1NFIDogU2hhZG93Q2ZnLk5PTkVcbn06IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4gPSB7fSkge1xuXG4gICAgaWYoIHNoYWRvdyAhPT0gU2hhZG93Q2ZnLk9QRU4gJiYgISBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICBjb25zdCBhbGxfZGVwcyA9IFsuLi5kZXBzXTtcblxuICAgIC8vIGNvbnRlbnQgcHJvY2Vzc2luZ1xuICAgIGlmKCBjb250ZW50IGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSB7XG4gICAgICAgIFxuXHRcdGxldCBfY29udGVudDogSFRNTF9Tb3VyY2V8dW5kZWZpbmVkID0gY29udGVudDtcblx0XHRjb250ZW50ID0gbnVsbCBhcyB1bmtub3duIGFzIHN0cmluZztcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBfY29udGVudCA9IGF3YWl0IF9jb250ZW50O1xuICAgICAgICAgICAgaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cblx0XHRcdFx0X2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG5cbiAgICAgICAgICAgIExJU1NCYXNlLkxJU1NDZmcuY29udGVudCA9IHByb2Nlc3NfY29udGVudChfY29udGVudCk7XG4gICAgICAgIH0pKCkgKTtcblxuICAgIH0gZWxzZSB7XG5cdFx0Y29udGVudCA9IHByb2Nlc3NfY29udGVudChjb250ZW50KTtcblx0fVxuXG5cdC8vIENTUyBwcm9jZXNzaW5nXG5cdGxldCBzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdID0gW107XG5cdGlmKCBjc3MgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG5cdFx0XHQvLyBAdHMtaWdub3JlIDogdG9kbzogTElTU09wdHMgPT4gc2hvdWxkIG5vdCBiZSBhIGdlbmVyaWMgP1xuXHRcdFx0Y3NzID0gW2Nzc107XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0c3R5bGVzaGVldHMgPSBjc3MubWFwKCAoYzogQ1NTX1NvdXJjZSwgaWR4OiBudW1iZXIpID0+IHtcblxuXHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG5cdFx0XHRcdGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0XHRjID0gYXdhaXQgYztcblx0XHRcdFx0XHRpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcblx0XHRcdFx0XHRcdGMgPSBhd2FpdCBjLnRleHQoKTtcblxuXHRcdFx0XHRcdHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuXHRcdFx0XHR9KSgpKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcm9jZXNzX2NzcyhjKTtcblx0XHR9KTtcblx0fVxuXG5cdHR5cGUgTElTU0hvc3Q8VD4gPSBhbnk7IC8vVE9ETy4uLlxuXHR0eXBlIExIb3N0ID0gTElTU0hvc3Q8TElTU0Jhc2U+OyAvLzwtIGNvbmZpZyBpbnN0ZWFkIG9mIExJU1NCYXNlID9cblxuXHRjbGFzcyBMSVNTQmFzZSBleHRlbmRzIF9leHRlbmRzIHtcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKVxuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3Qoe30sIHRoaXMpO1xuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBhbnk7IC8vIHByZXZlbnRzIGlzc3VlICMxLi4uXG5cblx0XHQvLyBMSVNTIENvbmZpZ3Ncblx0XHRzdGF0aWMgcmVhZG9ubHkgTElTU0NmZyA9IHtcblx0XHRcdGhvc3QsXG5cdFx0XHRkZXBzLFxuXHRcdFx0YXR0cnMsXG5cdFx0XHRwYXJhbXMsXG5cdFx0XHRjb250ZW50LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5jb250ZW50ITtcblx0XHR9XG5cblx0XHQvLyBhdHRyc1xuXHRcdHByb3RlY3RlZCBnZXQgYXR0cnMoKTogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIHNldEF0dHJEZWZhdWx0KCBhdHRyOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnNldEF0dHJEZWZhdWx0KGF0dHIsIHZhbHVlKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uQXR0ckNoYW5nZWQoX25hbWU6IEF0dHJzLFxuXHRcdFx0X29sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRfbmV3VmFsdWU6IHN0cmluZyk6IHZvaWR8ZmFsc2Uge31cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cblx0XHRwcm90ZWN0ZWQgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IFtBdHRycywgc3RyaW5nLCBzdHJpbmddKSB7XG5cdFx0XHR0aGlzLm9uQXR0ckNoYW5nZWQoLi4uYXJncyk7XG5cdFx0fVxuXG5cdFx0Ly8gcGFyYW1ldGVyc1xuXHRcdHB1YmxpYyBnZXQgcGFyYW1zKCk6IFJlYWRvbmx5PFBhcmFtcz4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXM7XG5cdFx0fVxuXHRcdHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4pIHtcblx0XHRcdE9iamVjdC5hc3NpZ24oICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblxuXHRcdC8vIERPTVxuXHRcdHB1YmxpYyBnZXQgaXNJbkRPTSgpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuaXNDb25uZWN0ZWQ7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTUNvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NRGlzY29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaXNJbkRPTTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHN0YXRpYyBfSG9zdDogTElTU0hvc3Q8TElTU0Jhc2U+O1xuXG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QodGhpcyk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gTElTU0Jhc2U7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY3NzKGNzczogc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudCkge1xuXG5cdGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG5cdFx0cmV0dXJuIGNzcztcblx0aWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG5cdFx0cmV0dXJuIGNzcy5zaGVldCE7XG5cblx0bGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0aWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0c3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuXHRcdHJldHVybiBzdHlsZTtcblx0fVxuXG5cdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJzXCIpO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzX2NvbnRlbnQoY29udGVudDogc3RyaW5nfEhUTUxUZW1wbGF0ZUVsZW1lbnR8dW5kZWZpbmVkKSB7XG5cbiAgICBpZihjb250ZW50ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBpZihjb250ZW50IGluc3RhbmNlb2YgSFRNTFRlbXBsYXRlRWxlbWVudClcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQuaW5uZXJIVE1MO1xuXG4gICAgY29udGVudCA9IGNvbnRlbnQudHJpbSgpO1xuICAgIGlmKCBjb250ZW50Lmxlbmd0aCA9PT0gMCApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gY29udGVudDtcbn0iLCJpbXBvcnQgeyBMSVNTU3RhdGUsIHVwZ3JhZGVTeW5jIH0gZnJvbSBcInN0YXRlXCI7XG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5pbXBvcnQgeyBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBDb21wb3NlQ29uc3RydWN0b3IsIGlzRE9NQ29udGVudExvYWRlZCwgd2FpdERPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgaWQgPSAwO1xuXG50eXBlIGluZmVyTElTUzxUPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8aW5mZXIgQSwgaW5mZXIgQiwgaW5mZXIgQywgaW5mZXIgRD4gPyBbQSxCLEMsRF0gOiBuZXZlcjtcblxuLy9UT0RPOiBzaGFkb3cgdXRpbHMgP1xuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XG4gICAgICAgICAgICAgICAgICAgICAgICBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihMaXNzOiBUKSB7XG5cdGNvbnN0IHtcblx0XHRob3N0LFxuXHRcdGF0dHJzLFxuXHRcdGNvbnRlbnQsXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5MSVNTQ2ZnO1xuXG5cdHR5cGUgUCA9IGluZmVyTElTUzxUPjtcblx0Ly90eXBlIEV4dGVuZHNDc3RyID0gUFswXTtcblx0dHlwZSBQYXJhbXMgICAgICA9IFBbMV07XG5cdHR5cGUgSG9zdENzdHIgICAgPSBQWzJdO1xuXHR0eXBlIEF0dHJzICAgICAgID0gUFszXTtcblxuICAgIHR5cGUgSG9zdCAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIC8vIGF0dHJzIHByb3h5XG5cdGNvbnN0IEdFVCA9IFN5bWJvbCgnZ2V0Jyk7XG5cdGNvbnN0IFNFVCA9IFN5bWJvbCgnc2V0Jyk7XG5cblx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5mcm9tRW50cmllcyggYXR0cnMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHRjb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCB3YWl0UmVhZHkgPSBuZXcgUHJvbWlzZTx2b2lkPiggYXN5bmMgKHIpID0+IHtcblxuICAgICAgICBhd2FpdCB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG5cbiAgICAgICAgcigpO1xuICAgIH0pO1xuXG4gICAgLy8gTm8gZGVwcyBhbmQgRE9NIGFscmVhZHkgbG9hZGVkLlxuICAgIGxldCBpc1JlYWR5ID0gTGlzcy5MSVNTQ2ZnLmRlcHMubGVuZ3RoID09IDAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cblx0Y29uc3QgcGFyYW1zID0gTGlzcy5MSVNTQ2ZnLnBhcmFtczsgLy9PYmplY3QuYXNzaWduKHt9LCBMaXNzLkxJU1NDZmcucGFyYW1zLCBfcGFyYW1zKTtcblxuXHQvL1xuXG5cdGNvbnN0IHdoZW5EZXBzUmVzb2x2ZWQgPSBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cdGxldCBpc0RlcHNSZXNvbHZlZCA9IGZhbHNlO1xuXHQoIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdGlzRGVwc1Jlc29sdmVkID0gdHJ1ZTtcblx0fSkoKTtcblxuXHRjbGFzcyBMSVNTSG9zdEJhc2UgZXh0ZW5kcyAoaG9zdCBhcyBuZXcgKCkgPT4gSFRNTEVsZW1lbnQpIHtcblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gaXNEZXBzUmVzb2x2ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdCh0aGlzLiNiYXNlIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0Z2V0IHBhcmFtcygpOiBQYXJhbXMge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3BhcmFtcztcblx0XHR9XG5cbiAgICAgICAgcHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8TElTU19PcHRzW1wicGFyYW1zXCJdPikge1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5iYXNlIS51cGRhdGVQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgLy8gd2lsIGJlIGdpdmVuIHRvIGNvbnN0cnVjdG9yLi4uXG5cdFx0XHRPYmplY3QuYXNzaWduKCB0aGlzLiNwYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblx0XHQvLyA9PT09PT09PT09PT09PSBBdHRyaWJ1dGVzID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNhdHRyc19mbGFnID0gZmFsc2U7XG5cblx0XHQjYXR0cmlidXRlcyAgICAgICAgID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJpYnV0ZXNEZWZhdWx0cyA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRycyA9IG5ldyBBdHRyaWJ1dGVzKFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlcyxcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0cyxcblx0XHRcdChuYW1lOiBBdHRycywgdmFsdWU6c3RyaW5nfG51bGwpID0+IHtcblxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG5cblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IHRydWU7IC8vIGRvIG5vdCB0cmlnZ2VyIG9uQXR0cnNDaGFuZ2VkLlxuXHRcdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0KSBhcyB1bmtub3duIGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXG5cdFx0c2V0QXR0ckRlZmF1bHQobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRkZWxldGUgdGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRnZXQgYXR0cnMoKTogUmVhZG9ubHk8UmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4+IHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2F0dHJzO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKHBhcmFtczoge30sIGJhc2U/OiBJbnN0YW5jZVR5cGU8VD4pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0aWYoIGJhc2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLiNiYXNlID0gYmFzZTtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0KHRoaXMuYmFzZSEgYXMgYW55KS5vbkRPTURpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuYmFzZSEub25ET01Db25uZWN0ZWQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLnN0YXRlLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgdGhpcy5zdGF0ZS5pc1JlYWR5O1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXHRcdFx0XG5cdFx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHRoaXMpO1xuXG4gICAgICAgICAgICAvL1RPRE86IHdhaXQgcGFyZW50cy9jaGlsZHJlbiBkZXBlbmRpbmcgb24gb3B0aW9uLi4uXG5cdFx0XHRcblx0XHRcdC8vIHNoYWRvd1xuXHRcdFx0dGhpcy4jY29udGVudCA9IHRoaXMgYXMgdW5rbm93biBhcyBIb3N0O1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKSB7XG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogc2hhZG93fSk7XG5cblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhdHRyc1xuXHRcdFx0Zm9yKGxldCBvYnMgb2YgYXR0cnMhKVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW29icyBhcyBBdHRyc10gPSB0aGlzLmdldEF0dHJpYnV0ZShvYnMpO1xuXG5cdFx0XHQvLyBjc3Ncblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTKTtcblx0XHRcdGlmKCBzdHlsZXNoZWV0cy5sZW5ndGggKSB7XG5cblx0XHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKC4uLnN0eWxlc2hlZXRzKTtcblx0XHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0XHRjb25zdCBjc3NzZWxlY3RvciA9IHRoaXMuQ1NTU2VsZWN0b3I7XG5cblx0XHRcdFx0XHQvLyBpZiBub3QgeWV0IGluc2VydGVkIDpcblx0XHRcdFx0XHRpZiggISBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0bGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuXHRcdFx0XHRcdFx0c3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cblx0XHRcdFx0XHRcdGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0Zm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuXHRcdFx0XHRcdFx0XHRcdGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cblx0XHRcdFx0XHRcdHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG5cblx0XHRcdFx0XHRcdGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb250ZW50XG5cdFx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRsZXQgdGVtcGxhdGVfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRcdFx0Ly9sZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IHRoaXMuZ2V0QXR0cmlidXRlKG1hdGNoKT8/JycpXG5cdCAgICBcdFx0bGV0IHN0ciA9IChjb250ZW50IGFzIHN0cmluZyk7XG5cdFx0XHRcdHRlbXBsYXRlX2VsZW0uaW5uZXJIVE1MID0gc3RyO1xuXHQgICAgXHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKC4uLnRlbXBsYXRlX2VsZW0uY29udGVudC5jaGlsZE5vZGVzKTtcblx0ICAgIFx0fVxuXG5cdCAgICBcdC8vIGJ1aWxkXG5cblx0ICAgIFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHQgICAgXHRsZXQgb2JqID0gdGhpcy5iYXNlID09PSBudWxsID8gbmV3IExpc3MoKSA6IHRoaXMuYmFzZTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmJhc2UpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlO1xuXHRcdH1cblxuXG5cblx0XHQvLyBhdHRyc1xuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGF0dHJzO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lICAgIDogQXR0cnMsXG5cdFx0XHRcdFx0XHRcdFx0IG9sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdFx0IG5ld1ZhbHVlOiBzdHJpbmcpIHtcblxuXHRcdFx0aWYodGhpcy4jYXR0cnNfZmxhZykge1xuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IG5ld1ZhbHVlO1xuXHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRpZiggKHRoaXMuYmFzZSEgYXMgYW55KS5vbkF0dHJDaGFuZ2VkKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzW25hbWVdID0gb2xkVmFsdWU7IC8vIHJldmVydCB0aGUgY2hhbmdlLlxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3RCYXNlIGFzIENvbXBvc2VDb25zdHJ1Y3Rvcjx0eXBlb2YgTElTU0hvc3RCYXNlLCB0eXBlb2YgaG9zdD47XG59XG5cblxuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBkZWZpbmUgPT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vL1RPRE8gcmVtb3ZlLi4uXG5cbmltcG9ydCBMSVNTIGZyb20gXCJMSVNTQmFzZVwiO1xuaW1wb3J0IHsgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4vTElTU0Jhc2VcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0d2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuXHRcdFx0XHRcdFx0XHR0YWduYW1lICAgICAgIDogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRDb21wb25lbnRDbGFzczogVCkge1xuXHRjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG5cdGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cblx0Y29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXHRcblx0Y29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG5cdFx0XHRcdFx0XHRcdFx0XHQgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblx0XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuXG5hc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZCh0YWduYW1lOiBzdHJpbmcsIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG5cblx0aWYoIGNhbGxiYWNrICE9PSB1bmRlZmluZWQpXG5cdFx0Y2FsbGJhY2soKTtcblxuXHRyZXR1cm47XG59XG5hc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10sIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgUHJvbWlzZS5hbGwoIHRhZ25hbWVzLm1hcCggdCA9PiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0KSApIClcblxuXHRpZiggY2FsbGJhY2sgIT09IHVuZGVmaW5lZClcblx0XHRjYWxsYmFjaygpO1xuXG59XG5cbmZ1bmN0aW9uIGlzRGVmaW5lZChuYW1lOiBzdHJpbmcpIHtcblx0cmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChuYW1lKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudCApOiBzdHJpbmcge1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7IiwiaW1wb3J0IHsgZ2V0TmFtZSB9IGZyb20gXCJkZWZpbmVcIjtcbmltcG9ydCB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwidHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwidXRpbHNcIjtcblxuZW51bSBTdGF0ZSB7XG4gICAgTk9ORSA9IDAsXG5cbiAgICAvLyBjbGFzc1xuICAgIERFRklORUQgPSAxIDw8IDAsXG4gICAgUkVBRFkgICA9IDEgPDwgMSxcblxuICAgIC8vIGluc3RhbmNlXG4gICAgVVBHUkFERUQgICAgPSAxIDw8IDIsXG4gICAgSU5JVElBTElaRUQgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCBjb25zdCBERUZJTkVEICAgICA9IFN0YXRlLkRFRklORUQ7XG5leHBvcnQgY29uc3QgUkVBRFkgICAgICAgPSBTdGF0ZS5SRUFEWTtcbmV4cG9ydCBjb25zdCBVUEdSQURFRCAgICA9IFN0YXRlLlVQR1JBREVEO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVEID0gU3RhdGUuSU5JVElBTElaRUQ7XG5cbmV4cG9ydCBjbGFzcyBMSVNTU3RhdGUge1xuXG4gICAgI2VsZW06IEhUTUxFbGVtZW50fG51bGw7XG5cbiAgICAvLyBpZiBudWxsIDogY2xhc3Mgc3RhdGUsIGVsc2UgaW5zdGFuY2Ugc3RhdGVcbiAgICBjb25zdHJ1Y3RvcihlbGVtOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbCkge1xuICAgICAgICB0aGlzLiNlbGVtID0gZWxlbTtcbiAgICB9XG5cbiAgICBzdGF0aWMgREVGSU5FRCAgICAgPSBERUZJTkVEO1xuICAgIHN0YXRpYyBSRUFEWSAgICAgICA9IFJFQURZO1xuICAgIHN0YXRpYyBVUEdSQURFRCAgICA9IFVQR1JBREVEO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFRCA9IElOSVRJQUxJWkVEO1xuXG4gICAgaXMoc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgICAgICYmICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSAgICAgICAmJiAhIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEICAgICYmICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgJiYgISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBsZXQgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxhbnk+PigpO1xuICAgIFxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkRlZmluZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5SZWFkeSgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblVwZ3JhZGVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuSW5pdGlhbGl6ZWQoKSApO1xuICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IERFRklORUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNEZWZpbmVkKCkge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KCBnZXROYW1lKHRoaXMuI2VsZW0pICkgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBSRUFEWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1JlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG4gICAgICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgaG9zdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpO1xuICAgIFxuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIGhvc3QpXG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIFxuICAgICAgICAvLyBoNGNrXG4gICAgXG4gICAgICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgICAgICBcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuICAgIFxuICAgICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IElOSVRJQUxJWkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gXCJpc0luaXRpYWxpemVkXCIgaW4gZWxlbSAmJiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuYmFzZSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBDT05WRVJTSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhbHVlT2YoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZTogU3RhdGUgPSAwO1xuICAgIFxuICAgICAgICBpZiggdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gREVGSU5FRDtcbiAgICAgICAgaWYoIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICBzdGF0ZSB8PSBSRUFEWTtcbiAgICAgICAgaWYoIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBVUEdSQURFRDtcbiAgICAgICAgaWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcbiAgICBcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiREVGSU5FRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgaXMucHVzaChcIlJFQURZXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJJTklUSUFMSVpFRFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGlzLmpvaW4oJ3wnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmKCBcInN0YXRlXCIgaW4gZWxlbSlcbiAgICAgICAgcmV0dXJuIGVsZW0uc3RhdGUgYXMgTElTU1N0YXRlO1xuICAgIFxuICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLnN0YXRlID0gbmV3IExJU1NTdGF0ZShlbGVtKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IFN0YXRlIG1vZGlmaWVycyAobW92ZT8pID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHbyB0byBzdGF0ZSBERUZJTkVEXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+KSB7XG5cbiAgICAvLyBjb3VsZCBiZSBiZXR0ZXIuXG4gICAgaWYoIFwiQmFzZVwiIGluIENvbXBvbmVudENsYXNzKSB7XG4gICAgICAgIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQmFzZSBhcyBUO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7IC8vYnVpbGRMSVNTSG9zdDxUPihDb21wb25lbnRDbGFzcywgcGFyYW1zKTtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG4vLyBHbyB0byBzdGF0ZSBVUEdSQURFRFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZ3JhZGU8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5EZWZpbmVkKCk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgKGVsZW0gaW5zdGFuY2VvZiBIb3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBkaWRuJ3QgdXBncmFkZSFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIFQ7XG59XG5cbi8vIEdvIHRvIHN0YXRlIElOSVRJQUxJWkVEXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSApXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5SZWFkeSgpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBUIHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgc3RhdGUuaXNSZWFkeSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT0gZXh0ZXJuYWwgV0hFTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlbkluaXRpYWxpemVkPFQ+KCk7XG59XG5cbi8vIFByaXZhdGUgZm9yIG5vdy5cblxuZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBcbiAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShlbGVtKTtcbiAgICBjb25zdCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KCBuYW1lICk7XG4gICAgaWYoIGhvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IG5vdCB5ZXQgZGVmaW5lZCFgKTtcbiAgICByZXR1cm4gaG9zdCBhcyBUO1xufSIsImltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiTElTU0hvc3RcIjtcbmltcG9ydCB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50XG5leHBvcnQgZW51bSBMaWZlQ3ljbGUge1xuICAgIERFRkFVTFQgICAgICAgICAgICAgICAgICAgPSAwLFxuXHQvLyBub3QgaW1wbGVtZW50ZWQgeWV0XG4gICAgSU5JVF9BRlRFUl9DSElMRFJFTiAgICAgICA9IDEgPDwgMSxcbiAgICBJTklUX0FGVEVSX1BBUkVOVCAgICAgICAgID0gMSA8PCAyLFxuICAgIC8vIHF1aWQgcGFyYW1zL2F0dHJzID9cbiAgICBSRUNSRUFURV9BRlRFUl9DT05ORUNUSU9OID0gMSA8PCAzLCAvKiByZXF1aXJlcyByZWJ1aWxkIGNvbnRlbnQgKyBkZXN0cm95L2Rpc3Bvc2Ugd2hlbiByZW1vdmVkIGZyb20gRE9NICovXG4gICAgLyogc2xlZXAgd2hlbiBkaXNjbyA6IHlvdSBuZWVkIHRvIGltcGxlbWVudCBpdCB5b3Vyc2VsZiAqL1xufVxuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZyxcbiAgICA+ID0ge1xuICAgICAgICAvLyBKUyBCYXNlXG4gICAgICAgIGV4dGVuZHMgICA6IEV4dGVuZHNDdHIsXG4gICAgICAgIHBhcmFtcyAgICA6IFBhcmFtcyxcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgZGVwcyAgICAgIDogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W10sXG4gICAgICAgIGxpZmVfY3ljbGU6IExpZmVDeWNsZSwgXG5cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLFxuICAgICAgICBhdHRycyAgOiByZWFkb25seSBBdHRyc1tdLFxuICAgICAgICBvYnNlcnZlZEF0dHJpYnV0ZXM6IHJlYWRvbmx5IEF0dHJzW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBjb250ZW50PzogSFRNTF9Tb3VyY2UsXG4gICAgICAgIGNzcyAgICAgOiBDU1NfU291cmNlIHwgcmVhZG9ubHkgQ1NTX1NvdXJjZVtdLFxuICAgICAgICBzaGFkb3cgIDogU2hhZG93Q2ZnXG59XG5cbi8vIExJU1NCYXNlXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IEluc3RhbmNlVHlwZTxMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VCBleHRlbmRzIExJU1NCYXNlPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZTxcbiAgICAgICAgICAgIGluZmVyIEEgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBCLFxuICAgICAgICAgICAgaW5mZXIgQyxcbiAgICAgICAgICAgIGluZmVyIEQ+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQmFzZUNzdHI8QSxCLEMsRD4gOiBuZXZlcjtcblxuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQmFzZSA/IExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+OyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBIVE1MQ0xBU1NfUkVHRVggPSAgL0hUTUwoXFx3KylFbGVtZW50LztcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblx0XG5cdGxldCBodG1sdGFnID0gSFRNTENMQVNTX1JFR0VYLmV4ZWMoQ2xhc3MubmFtZSkhWzFdO1xuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgY29uc3Qgd2hlbkRPTUNvbnRlbnRMb2FkZWQgPSB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdERPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5pbXBvcnQgXCIuL2RlZmluZVwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IExJU1M7Il0sIm5hbWVzIjpbImJ1aWxkTElTU0hvc3QiLCJMaWZlQ3ljbGUiLCJTaGFkb3dDZmciLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIklMSVNTIiwiTElTUyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsInBhcmFtcyIsImRlcHMiLCJsaWZlX2N5Y2xlIiwiREVGQVVMVCIsImhvc3QiLCJIVE1MRWxlbWVudCIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJzIiwiY29udGVudCIsImNzcyIsInNoYWRvdyIsIkNMT1NFIiwiTk9ORSIsIk9QRU4iLCJFcnJvciIsImFsbF9kZXBzIiwiUHJvbWlzZSIsIlJlc3BvbnNlIiwiX2NvbnRlbnQiLCJwdXNoIiwidGV4dCIsIkxJU1NCYXNlIiwiTElTU0NmZyIsInByb2Nlc3NfY29udGVudCIsInN0eWxlc2hlZXRzIiwidW5kZWZpbmVkIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiYyIsImlkeCIsInByb2Nlc3NfY3NzIiwiY29uc3RydWN0b3IiLCJhcmdzIiwiSG9zdCIsInN0YXRlIiwic2V0QXR0ckRlZmF1bHQiLCJhdHRyIiwidmFsdWUiLCJvbkF0dHJDaGFuZ2VkIiwiX25hbWUiLCJfb2xkVmFsdWUiLCJfbmV3VmFsdWUiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJ1cGRhdGVQYXJhbXMiLCJhc3NpZ24iLCJpc0luRE9NIiwiaXNDb25uZWN0ZWQiLCJvbkRPTUNvbm5lY3RlZCIsImNvbm5lY3RlZENhbGxiYWNrIiwib25ET01EaXNjb25uZWN0ZWQiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsIl9Ib3N0IiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwidHJpbSIsImxlbmd0aCIsIkxJU1NTdGF0ZSIsImlzRE9NQ29udGVudExvYWRlZCIsIndhaXRET01Db250ZW50TG9hZGVkIiwiaWQiLCJzaGFyZWRDU1MiLCJMaXNzIiwiR0VUIiwiU3ltYm9sIiwiU0VUIiwicHJvcGVydGllcyIsImZyb21FbnRyaWVzIiwibiIsImVudW1lcmFibGUiLCJnZXQiLCJzZXQiLCJBdHRyaWJ1dGVzIiwibmFtZSIsImRhdGEiLCJkZWZhdWx0cyIsInNldHRlciIsImRlZmluZVByb3BlcnRpZXMiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJ3YWl0UmVhZHkiLCJyIiwiYWxsIiwiaXNSZWFkeSIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkxJU1NIb3N0QmFzZSIsIkJhc2UiLCJiYXNlIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJpbml0IiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJDU1NTZWxlY3RvciIsImhhc0F0dHJpYnV0ZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJwcm9taXNlIiwicmVzb2x2ZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImF0dGFjaFNoYWRvdyIsIm1vZGUiLCJvYnMiLCJhZG9wdGVkU3R5bGVTaGVldHMiLCJjc3NzZWxlY3RvciIsImhhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwicmVwbGFjZSIsImhlYWQiLCJhcHBlbmQiLCJhZGQiLCJ0ZW1wbGF0ZV9lbGVtIiwic3RyIiwiY2hpbGROb2RlcyIsIm9iaiIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJDbGFzcyIsImh0bWx0YWciLCJMSVNTY2xhc3MiLCJvcHRzIiwid2hlbkRlZmluZWQiLCJjYWxsYmFjayIsIndoZW5BbGxEZWZpbmVkIiwidGFnbmFtZXMiLCJ0IiwiaXNEZWZpbmVkIiwiZ2V0TmFtZSIsImVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwid2hlbkRPTUNvbnRlbnRMb2FkZWQiLCJTdGF0ZSIsIkRFRklORUQiLCJSRUFEWSIsIlVQR1JBREVEIiwiSU5JVElBTElaRUQiLCJlbGVtIiwiaXMiLCJpc1VwZ3JhZGVkIiwid2hlbiIsInByb21pc2VzIiwid2hlblJlYWR5Iiwid2hlblVwZ3JhZGVkIiwiZ2V0SG9zdENzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJnZXRTdGF0ZSIsInN0cmljdCIsInVwZ3JhZGVTeW5jIiwiaW5pdGlhbGl6ZVN5bmMiLCJmb3JjZSIsIkhUTUxDTEFTU19SRUdFWCIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJleGVjIiwiQ0FOX0hBVkVfU0hBRE9XIiwidGFnIiwicmVhZHlTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiXSwic291cmNlUm9vdCI6IiJ9