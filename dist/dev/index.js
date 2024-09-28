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
            const base = this.init();
            if (this.isConnected) base.onDOMConnected();
            return this.#base = base;
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
        // ============== Impl ===================
        constructor(params, base){
            super();
            if (base !== undefined) {
                this.#base = base;
                this.initialize();
            }
            let { promise, resolve } = Promise.withResolvers();
            this.whenInitialized = promise;
            this.#whenInitialized_resolver = resolve;
            if (this.isInitialized) resolve(this.base);
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
            }
            (async ()=>{
                await this.state.isReady;
                this.initialize();
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
    if (state.isUpgraded && strict) throw new Error(`Already upgraded!`);
    const host = await upgrade(elem);
    await state.whenReady();
    host.initialize();
    return host.base;
}
function initializeSync(elem) {
    const host = upgradeSync(elem);
    if (!host.state.isReady) throw new Error("Element not ready !");
    host.initialize();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7O0FDTjhCO0FBRVo7QUFHbEIsaUVBQWV4RyxpREFBSUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2RlZmluZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIkxJU1NIb3N0XCI7XG5pbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIENTU19Tb3VyY2UsIEhUTUxfU291cmNlLCBMaWZlQ3ljbGUsIExJU1NfT3B0cywgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCJzdGF0ZVwiO1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuXG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4oe1xuXG4gICAgLy8gSlMgQmFzZVxuICAgIGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0IGFzIHVua25vd24gYXMgRXh0ZW5kc0N0ciwgLyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG4gICAgcGFyYW1zICAgICAgICAgICAgPSB7fSAgICAgYXMgdW5rbm93biBhcyBQYXJhbXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBkZXBzICAgPSBbXSxcbiAgICBsaWZlX2N5Y2xlID0gIExpZmVDeWNsZS5ERUZBVUxULFxuXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgaG9zdCAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRvYnNlcnZlZEF0dHJpYnV0ZXMgPSBbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0LlxuICAgIGF0dHJzID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgY29udGVudCxcbiAgICBjc3MsXG4gICAgc2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgPyBTaGFkb3dDZmcuQ0xPU0UgOiBTaGFkb3dDZmcuTk9ORVxufTogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PiA9IHt9KSB7XG5cbiAgICBpZiggc2hhZG93ICE9PSBTaGFkb3dDZmcuT1BFTiAmJiAhIGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgIGNvbnN0IGFsbF9kZXBzID0gWy4uLmRlcHNdO1xuXG4gICAgLy8gY29udGVudCBwcm9jZXNzaW5nXG4gICAgaWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGNvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIHtcbiAgICAgICAgXG5cdFx0bGV0IF9jb250ZW50OiBIVE1MX1NvdXJjZXx1bmRlZmluZWQgPSBjb250ZW50O1xuXHRcdGNvbnRlbnQgPSBudWxsIGFzIHVua25vd24gYXMgc3RyaW5nO1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQ7XG4gICAgICAgICAgICBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuXHRcdFx0XHRfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcblxuICAgICAgICAgICAgTElTU0Jhc2UuTElTU0NmZy5jb250ZW50ID0gcHJvY2Vzc19jb250ZW50KF9jb250ZW50KTtcbiAgICAgICAgfSkoKSApO1xuXG4gICAgfSBlbHNlIHtcblx0XHRjb250ZW50ID0gcHJvY2Vzc19jb250ZW50KGNvbnRlbnQpO1xuXHR9XG5cblx0Ly8gQ1NTIHByb2Nlc3Npbmdcblx0bGV0IHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gPSBbXTtcblx0aWYoIGNzcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0aWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiB0b2RvOiBMSVNTT3B0cyA9PiBzaG91bGQgbm90IGJlIGEgZ2VuZXJpYyA/XG5cdFx0XHRjc3MgPSBbY3NzXTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRzdHlsZXNoZWV0cyA9IGNzcy5tYXAoIChjOiBDU1NfU291cmNlLCBpZHg6IG51bWJlcikgPT4ge1xuXG5cdFx0XHRpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cblx0XHRcdFx0YWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRcdGMgPSBhd2FpdCBjO1xuXHRcdFx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuXHRcdFx0XHRcdFx0YyA9IGF3YWl0IGMudGV4dCgpO1xuXG5cdFx0XHRcdFx0c3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG5cdFx0XHRcdH0pKCkpO1xuXG5cdFx0XHRcdHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb2Nlc3NfY3NzKGMpO1xuXHRcdH0pO1xuXHR9XG5cblx0dHlwZSBMSVNTSG9zdDxUPiA9IGFueTsgLy9UT0RPLi4uXG5cdHR5cGUgTEhvc3QgPSBMSVNTSG9zdDxMSVNTQmFzZT47IC8vPC0gY29uZmlnIGluc3RlYWQgb2YgTElTU0Jhc2UgP1xuXG5cdGNsYXNzIExJU1NCYXNlIGV4dGVuZHMgX2V4dGVuZHMge1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApXG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCh7fSwgdGhpcyk7XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IGFueTsgLy8gcHJldmVudHMgaXNzdWUgIzEuLi5cblxuXHRcdC8vIExJU1MgQ29uZmlnc1xuXHRcdHN0YXRpYyByZWFkb25seSBMSVNTQ2ZnID0ge1xuXHRcdFx0aG9zdCxcblx0XHRcdGRlcHMsXG5cdFx0XHRhdHRycyxcblx0XHRcdHBhcmFtcyxcblx0XHRcdGNvbnRlbnQsXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG5cdFx0Z2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5zdGF0ZTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdC8vIGF0dHJzXG5cdFx0cHJvdGVjdGVkIGdldCBhdHRycygpOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgc2V0QXR0ckRlZmF1bHQoIGF0dHI6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuc2V0QXR0ckRlZmF1bHQoYXR0ciwgdmFsdWUpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25BdHRyQ2hhbmdlZChfbmFtZTogQXR0cnMsXG5cdFx0XHRfb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdF9uZXdWYWx1ZTogc3RyaW5nKTogdm9pZHxmYWxzZSB7fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0LlxuXHRcdHByb3RlY3RlZCBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogW0F0dHJzLCBzdHJpbmcsIHN0cmluZ10pIHtcblx0XHRcdHRoaXMub25BdHRyQ2hhbmdlZCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHQvLyBwYXJhbWV0ZXJzXG5cdFx0cHVibGljIGdldCBwYXJhbXMoKTogUmVhZG9ubHk8UGFyYW1zPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcztcblx0XHR9XG5cdFx0cHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPikge1xuXHRcdFx0T2JqZWN0LmFzc2lnbiggKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXG5cdFx0Ly8gRE9NXG5cdFx0cHVibGljIGdldCBpc0luRE9NKCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5pc0luRE9NO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01Db25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTURpc2Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXRcblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmlzSW5ET007XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzdGF0aWMgX0hvc3Q6IExJU1NIb3N0PExJU1NCYXNlPjtcblxuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlOyAgICBcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19jc3MoY3NzOiBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50KSB7XG5cblx0aWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcblx0XHRyZXR1cm4gY3NzO1xuXHRpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcblx0XHRyZXR1cm4gY3NzLnNoZWV0ITtcblxuXHRsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXHRpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG5cdFx0cmV0dXJuIHN0eWxlO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY29udGVudChjb250ZW50OiBzdHJpbmd8SFRNTFRlbXBsYXRlRWxlbWVudHx1bmRlZmluZWQpIHtcblxuICAgIGlmKGNvbnRlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGlmKGNvbnRlbnQgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KVxuICAgICAgICBjb250ZW50ID0gY29udGVudC5pbm5lckhUTUw7XG5cbiAgICBjb250ZW50ID0gY29udGVudC50cmltKCk7XG4gICAgaWYoIGNvbnRlbnQubGVuZ3RoID09PSAwIClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBjb250ZW50O1xufSIsImltcG9ydCB7IExJU1NTdGF0ZSwgdXBncmFkZVN5bmMgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IExJU1NfT3B0cywgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzRE9NQ29udGVudExvYWRlZCwgd2FpdERPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgaWQgPSAwO1xuXG50eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlclxuXG50eXBlIGluZmVyTElTUzxUPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8aW5mZXIgQSwgaW5mZXIgQiwgaW5mZXIgQywgaW5mZXIgRD4gPyBbQSxCLEMsRF0gOiBuZXZlcjtcblxuLy9UT0RPOiBzaGFkb3cgdXRpbHMgP1xuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XG4gICAgICAgICAgICAgICAgICAgICAgICBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihMaXNzOiBUKSB7XG5cdGNvbnN0IHtcblx0XHRob3N0LFxuXHRcdGF0dHJzLFxuXHRcdGNvbnRlbnQsXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5MSVNTQ2ZnO1xuXG5cdHR5cGUgUCA9IGluZmVyTElTUzxUPjtcblx0Ly90eXBlIEV4dGVuZHNDc3RyID0gUFswXTtcblx0dHlwZSBQYXJhbXMgICAgICA9IFBbMV07XG5cdHR5cGUgSG9zdENzdHIgICAgPSBQWzJdO1xuXHR0eXBlIEF0dHJzICAgICAgID0gUFszXTtcblxuICAgIHR5cGUgSG9zdCAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIC8vIGF0dHJzIHByb3h5XG5cdGNvbnN0IEdFVCA9IFN5bWJvbCgnZ2V0Jyk7XG5cdGNvbnN0IFNFVCA9IFN5bWJvbCgnc2V0Jyk7XG5cblx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5mcm9tRW50cmllcyggYXR0cnMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHRjb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCB3YWl0UmVhZHkgPSBuZXcgUHJvbWlzZTx2b2lkPiggYXN5bmMgKHIpID0+IHtcblxuICAgICAgICBhd2FpdCB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG5cbiAgICAgICAgcigpO1xuICAgIH0pO1xuXG4gICAgLy8gTm8gZGVwcyBhbmQgRE9NIGFscmVhZHkgbG9hZGVkLlxuICAgIGxldCBpc1JlYWR5ID0gTGlzcy5MSVNTQ2ZnLmRlcHMubGVuZ3RoID09IDAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cblx0Y29uc3QgcGFyYW1zID0gTGlzcy5MSVNTQ2ZnLnBhcmFtczsgLy9PYmplY3QuYXNzaWduKHt9LCBMaXNzLkxJU1NDZmcucGFyYW1zLCBfcGFyYW1zKTtcblxuXHQvL1xuXG5cdGNvbnN0IHdoZW5EZXBzUmVzb2x2ZWQgPSBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cdGxldCBpc0RlcHNSZXNvbHZlZCA9IGZhbHNlO1xuXHQoIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdGlzRGVwc1Jlc29sdmVkID0gdHJ1ZTtcblx0fSkoKTtcblxuXHRjbGFzcyBMSVNTSG9zdEJhc2UgZXh0ZW5kcyAoaG9zdCBhcyBuZXcgKCkgPT4gSFRNTEVsZW1lbnQpIHtcblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gaXNEZXBzUmVzb2x2ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0Y29uc3QgYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdChiYXNlIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2UgPSBiYXNlO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHJlYWRvbmx5ICNwYXJhbXM6IFBhcmFtcyA9IHBhcmFtcztcblxuXHRcdGdldCBwYXJhbXMoKTogUGFyYW1zIHtcblx0XHRcdHJldHVybiB0aGlzLiNwYXJhbXM7XG5cdFx0fVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPExJU1NfT3B0c1tcInBhcmFtc1wiXT4pIHtcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHRoaXMuYmFzZSEudXBkYXRlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIC8vIHdpbCBiZSBnaXZlbiB0byBjb25zdHJ1Y3Rvci4uLlxuXHRcdFx0T2JqZWN0LmFzc2lnbiggdGhpcy4jcGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cdFx0Ly8gPT09PT09PT09PT09PT0gQXR0cmlidXRlcyA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjYXR0cnNfZmxhZyA9IGZhbHNlO1xuXG5cdFx0I2F0dHJpYnV0ZXMgICAgICAgICA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRyaWJ1dGVzRGVmYXVsdHMgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cnMgPSBuZXcgQXR0cmlidXRlcyhcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXMsXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHMsXG5cdFx0XHQobmFtZTogQXR0cnMsIHZhbHVlOnN0cmluZ3xudWxsKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSB0cnVlOyAvLyBkbyBub3QgdHJpZ2dlciBvbkF0dHJzQ2hhbmdlZC5cblx0XHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdCkgYXMgdW5rbm93biBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblxuXHRcdHNldEF0dHJEZWZhdWx0KG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0ZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Z2V0IGF0dHJzKCk6IFJlYWRvbmx5PFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+PiB7XG5cblx0XHRcdHJldHVybiB0aGlzLiNhdHRycztcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKHBhcmFtczoge30sIGJhc2U/OiBJbnN0YW5jZVR5cGU8VD4pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdGlmKCBiYXNlICE9PSB1bmRlZmluZWQpe1xuXHRcdFx0XHR0aGlzLiNiYXNlID0gYmFzZTtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmVzb2x2ZSh0aGlzLmJhc2UpO1xuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdCh0aGlzLmJhc2UhIGFzIGFueSkub25ET01EaXNjb25uZWN0ZWQoKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmJhc2UhLm9uRE9NQ29ubmVjdGVkKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5zdGF0ZS5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCB0aGlzLnN0YXRlLmlzUmVhZHk7XG5cblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXHRcdFx0XG5cdFx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHRoaXMpO1xuXG4gICAgICAgICAgICAvL1RPRE86IHdhaXQgcGFyZW50cy9jaGlsZHJlbiBkZXBlbmRpbmcgb24gb3B0aW9uLi4uXG5cdFx0XHRcblx0XHRcdC8vIHNoYWRvd1xuXHRcdFx0dGhpcy4jY29udGVudCA9IHRoaXMgYXMgdW5rbm93biBhcyBIb3N0O1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKSB7XG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogc2hhZG93fSk7XG5cblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhdHRyc1xuXHRcdFx0Zm9yKGxldCBvYnMgb2YgYXR0cnMhKVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW29icyBhcyBBdHRyc10gPSB0aGlzLmdldEF0dHJpYnV0ZShvYnMpO1xuXG5cdFx0XHQvLyBjc3Ncblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTKTtcblx0XHRcdGlmKCBzdHlsZXNoZWV0cy5sZW5ndGggKSB7XG5cblx0XHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKC4uLnN0eWxlc2hlZXRzKTtcblx0XHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0XHRjb25zdCBjc3NzZWxlY3RvciA9IHRoaXMuQ1NTU2VsZWN0b3I7XG5cblx0XHRcdFx0XHQvLyBpZiBub3QgeWV0IGluc2VydGVkIDpcblx0XHRcdFx0XHRpZiggISBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0bGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuXHRcdFx0XHRcdFx0c3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cblx0XHRcdFx0XHRcdGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0Zm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuXHRcdFx0XHRcdFx0XHRcdGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cblx0XHRcdFx0XHRcdHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG5cblx0XHRcdFx0XHRcdGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb250ZW50XG5cdFx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRsZXQgdGVtcGxhdGVfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRcdFx0Ly9sZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IHRoaXMuZ2V0QXR0cmlidXRlKG1hdGNoKT8/JycpXG5cdCAgICBcdFx0bGV0IHN0ciA9IChjb250ZW50IGFzIHN0cmluZyk7XG5cdFx0XHRcdHRlbXBsYXRlX2VsZW0uaW5uZXJIVE1MID0gc3RyO1xuXHQgICAgXHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKC4uLnRlbXBsYXRlX2VsZW0uY29udGVudC5jaGlsZE5vZGVzKTtcblx0ICAgIFx0fVxuXG5cdCAgICBcdC8vIGJ1aWxkXG5cblx0ICAgIFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHQgICAgXHRsZXQgb2JqID0gdGhpcy5iYXNlID09PSBudWxsID8gbmV3IExpc3MoKSA6IHRoaXMuYmFzZTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmJhc2UpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlO1xuXHRcdH1cblxuXHRcdC8qKiogY29udGVudCAqKiovXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyBhdHRyc1xuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGF0dHJzO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lICAgIDogQXR0cnMsXG5cdFx0XHRcdFx0XHRcdFx0IG9sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdFx0IG5ld1ZhbHVlOiBzdHJpbmcpIHtcblxuXHRcdFx0aWYodGhpcy4jYXR0cnNfZmxhZykge1xuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IG5ld1ZhbHVlO1xuXHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRpZiggKHRoaXMuYmFzZSEgYXMgYW55KS5vbkF0dHJDaGFuZ2VkKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzW25hbWVdID0gb2xkVmFsdWU7IC8vIHJldmVydCB0aGUgY2hhbmdlLlxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3RCYXNlIGFzIENvbXBvc2VDb25zdHJ1Y3Rvcjx0eXBlb2YgTElTU0hvc3RCYXNlLCB0eXBlb2YgaG9zdD47XG59XG5cblxuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBkZWZpbmUgPT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vL1RPRE8gcmVtb3ZlLi4uXG5cbmltcG9ydCBMSVNTIGZyb20gXCJMSVNTQmFzZVwiO1xuaW1wb3J0IHsgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4vTElTU0Jhc2VcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0d2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuXHRcdFx0XHRcdFx0XHR0YWduYW1lICAgICAgIDogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRDb21wb25lbnRDbGFzczogVCkge1xuXHRjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG5cdGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cblx0Y29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXHRcblx0Y29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG5cdFx0XHRcdFx0XHRcdFx0XHQgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblx0XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuXG5hc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZCh0YWduYW1lOiBzdHJpbmcsIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG5cblx0aWYoIGNhbGxiYWNrICE9PSB1bmRlZmluZWQpXG5cdFx0Y2FsbGJhY2soKTtcblxuXHRyZXR1cm47XG59XG5hc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10sIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgUHJvbWlzZS5hbGwoIHRhZ25hbWVzLm1hcCggdCA9PiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0KSApIClcblxuXHRpZiggY2FsbGJhY2sgIT09IHVuZGVmaW5lZClcblx0XHRjYWxsYmFjaygpO1xuXG59XG5cbmZ1bmN0aW9uIGlzRGVmaW5lZChuYW1lOiBzdHJpbmcpIHtcblx0cmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChuYW1lKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudCApOiBzdHJpbmcge1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7IiwiaW1wb3J0IHsgZ2V0TmFtZSB9IGZyb20gXCJkZWZpbmVcIjtcbmltcG9ydCB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwidHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwidXRpbHNcIjtcblxuZW51bSBTdGF0ZSB7XG4gICAgTk9ORSA9IDAsXG5cbiAgICAvLyBjbGFzc1xuICAgIERFRklORUQgPSAxIDw8IDAsXG4gICAgUkVBRFkgICA9IDEgPDwgMSxcblxuICAgIC8vIGluc3RhbmNlXG4gICAgVVBHUkFERUQgICAgPSAxIDw8IDIsXG4gICAgSU5JVElBTElaRUQgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCBjb25zdCBERUZJTkVEICAgICA9IFN0YXRlLkRFRklORUQ7XG5leHBvcnQgY29uc3QgUkVBRFkgICAgICAgPSBTdGF0ZS5SRUFEWTtcbmV4cG9ydCBjb25zdCBVUEdSQURFRCAgICA9IFN0YXRlLlVQR1JBREVEO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVEID0gU3RhdGUuSU5JVElBTElaRUQ7XG5cbmV4cG9ydCBjbGFzcyBMSVNTU3RhdGUge1xuXG4gICAgI2VsZW06IEhUTUxFbGVtZW50fG51bGw7XG5cbiAgICAvLyBpZiBudWxsIDogY2xhc3Mgc3RhdGUsIGVsc2UgaW5zdGFuY2Ugc3RhdGVcbiAgICBjb25zdHJ1Y3RvcihlbGVtOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbCkge1xuICAgICAgICB0aGlzLiNlbGVtID0gZWxlbTtcbiAgICB9XG5cbiAgICBzdGF0aWMgREVGSU5FRCAgICAgPSBERUZJTkVEO1xuICAgIHN0YXRpYyBSRUFEWSAgICAgICA9IFJFQURZO1xuICAgIHN0YXRpYyBVUEdSQURFRCAgICA9IFVQR1JBREVEO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFRCA9IElOSVRJQUxJWkVEO1xuXG4gICAgaXMoc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgICAgICYmICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSAgICAgICAmJiAhIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEICAgICYmICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgJiYgISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBsZXQgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxhbnk+PigpO1xuICAgIFxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkRlZmluZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5SZWFkeSgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblVwZ3JhZGVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuSW5pdGlhbGl6ZWQoKSApO1xuICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IERFRklORUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNEZWZpbmVkKCkge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KCBnZXROYW1lKHRoaXMuI2VsZW0pICkgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBSRUFEWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1JlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG4gICAgICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgaG9zdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpO1xuICAgIFxuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIGhvc3QpXG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIFxuICAgICAgICAvLyBoNGNrXG4gICAgXG4gICAgICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgICAgICBcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuICAgIFxuICAgICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IElOSVRJQUxJWkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gXCJpc0luaXRpYWxpemVkXCIgaW4gZWxlbSAmJiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuYmFzZSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBDT05WRVJTSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhbHVlT2YoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZTogU3RhdGUgPSAwO1xuICAgIFxuICAgICAgICBpZiggdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gREVGSU5FRDtcbiAgICAgICAgaWYoIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICBzdGF0ZSB8PSBSRUFEWTtcbiAgICAgICAgaWYoIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBVUEdSQURFRDtcbiAgICAgICAgaWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcbiAgICBcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiREVGSU5FRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgaXMucHVzaChcIlJFQURZXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJJTklUSUFMSVpFRFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGlzLmpvaW4oJ3wnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmKCBcInN0YXRlXCIgaW4gZWxlbSlcbiAgICAgICAgcmV0dXJuIGVsZW0uc3RhdGUgYXMgTElTU1N0YXRlO1xuICAgIFxuICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLnN0YXRlID0gbmV3IExJU1NTdGF0ZShlbGVtKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IFN0YXRlIG1vZGlmaWVycyAobW92ZT8pID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHbyB0byBzdGF0ZSBERUZJTkVEXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+KSB7XG5cbiAgICAvLyBjb3VsZCBiZSBiZXR0ZXIuXG4gICAgaWYoIFwiQmFzZVwiIGluIENvbXBvbmVudENsYXNzKSB7XG4gICAgICAgIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQmFzZSBhcyBUO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7IC8vYnVpbGRMSVNTSG9zdDxUPihDb21wb25lbnRDbGFzcywgcGFyYW1zKTtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG4vLyBHbyB0byBzdGF0ZSBVUEdSQURFRFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZ3JhZGU8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5EZWZpbmVkKCk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgKGVsZW0gaW5zdGFuY2VvZiBIb3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBkaWRuJ3QgdXBncmFkZSFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIFQ7XG59XG5cbi8vIEdvIHRvIHN0YXRlIElOSVRJQUxJWkVEXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5SZWFkeSgpO1xuXG4gICAgaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4pOiBUIHtcblxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIGhvc3Quc3RhdGUuaXNSZWFkeSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICBob3N0LmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT0gZXh0ZXJuYWwgV0hFTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlbkluaXRpYWxpemVkPFQ+KCk7XG59XG5cbi8vIFByaXZhdGUgZm9yIG5vdy5cblxuZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBcbiAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShlbGVtKTtcbiAgICBjb25zdCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KCBuYW1lICk7XG4gICAgaWYoIGhvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IG5vdCB5ZXQgZGVmaW5lZCFgKTtcbiAgICByZXR1cm4gaG9zdCBhcyBUO1xufSIsImltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiTElTU0hvc3RcIjtcbmltcG9ydCB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50XG5leHBvcnQgZW51bSBMaWZlQ3ljbGUge1xuICAgIERFRkFVTFQgICAgICAgICAgICAgICAgICAgPSAwLFxuXHQvLyBub3QgaW1wbGVtZW50ZWQgeWV0XG4gICAgSU5JVF9BRlRFUl9DSElMRFJFTiAgICAgICA9IDEgPDwgMSxcbiAgICBJTklUX0FGVEVSX1BBUkVOVCAgICAgICAgID0gMSA8PCAyLFxuICAgIC8vIHF1aWQgcGFyYW1zL2F0dHJzID9cbiAgICBSRUNSRUFURV9BRlRFUl9DT05ORUNUSU9OID0gMSA8PCAzLCAvKiByZXF1aXJlcyByZWJ1aWxkIGNvbnRlbnQgKyBkZXN0cm95L2Rpc3Bvc2Ugd2hlbiByZW1vdmVkIGZyb20gRE9NICovXG4gICAgLyogc2xlZXAgd2hlbiBkaXNjbyA6IHlvdSBuZWVkIHRvIGltcGxlbWVudCBpdCB5b3Vyc2VsZiAqL1xufVxuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZyxcbiAgICA+ID0ge1xuICAgICAgICAvLyBKUyBCYXNlXG4gICAgICAgIGV4dGVuZHMgICA6IEV4dGVuZHNDdHIsXG4gICAgICAgIHBhcmFtcyAgICA6IFBhcmFtcyxcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgZGVwcyAgICAgIDogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W10sXG4gICAgICAgIGxpZmVfY3ljbGU6IExpZmVDeWNsZSwgXG5cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLFxuICAgICAgICBhdHRycyAgOiByZWFkb25seSBBdHRyc1tdLFxuICAgICAgICBvYnNlcnZlZEF0dHJpYnV0ZXM6IHJlYWRvbmx5IEF0dHJzW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBjb250ZW50PzogSFRNTF9Tb3VyY2UsXG4gICAgICAgIGNzcyAgICAgOiBDU1NfU291cmNlIHwgcmVhZG9ubHkgQ1NTX1NvdXJjZVtdLFxuICAgICAgICBzaGFkb3cgIDogU2hhZG93Q2ZnXG59XG5cbi8vIExJU1NCYXNlXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IEluc3RhbmNlVHlwZTxMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VCBleHRlbmRzIExJU1NCYXNlPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZTxcbiAgICAgICAgICAgIGluZmVyIEEgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBCLFxuICAgICAgICAgICAgaW5mZXIgQyxcbiAgICAgICAgICAgIGluZmVyIEQ+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQmFzZUNzdHI8QSxCLEMsRD4gOiBuZXZlcjtcblxuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQmFzZSA/IExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+OyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBIVE1MQ0xBU1NfUkVHRVggPSAgL0hUTUwoXFx3KylFbGVtZW50LztcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblx0XG5cdGxldCBodG1sdGFnID0gSFRNTENMQVNTX1JFR0VYLmV4ZWMoQ2xhc3MubmFtZSkhWzFdO1xuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgY29uc3Qgd2hlbkRPTUNvbnRlbnRMb2FkZWQgPSB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdERPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuaW1wb3J0IFwiLi9kZWZpbmVcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBMSVNTOyJdLCJuYW1lcyI6WyJidWlsZExJU1NIb3N0IiwiTGlmZUN5Y2xlIiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzU2hhZG93U3VwcG9ydGVkIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJJTElTUyIsIkxJU1MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJwYXJhbXMiLCJkZXBzIiwibGlmZV9jeWNsZSIsIkRFRkFVTFQiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnQiLCJjc3MiLCJzaGFkb3ciLCJDTE9TRSIsIk5PTkUiLCJPUEVOIiwiRXJyb3IiLCJhbGxfZGVwcyIsIlByb21pc2UiLCJSZXNwb25zZSIsIl9jb250ZW50IiwicHVzaCIsInRleHQiLCJMSVNTQmFzZSIsIkxJU1NDZmciLCJwcm9jZXNzX2NvbnRlbnQiLCJzdHlsZXNoZWV0cyIsInVuZGVmaW5lZCIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImMiLCJpZHgiLCJwcm9jZXNzX2NzcyIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkhvc3QiLCJzdGF0ZSIsInNldEF0dHJEZWZhdWx0IiwiYXR0ciIsInZhbHVlIiwib25BdHRyQ2hhbmdlZCIsIl9uYW1lIiwiX29sZFZhbHVlIiwiX25ld1ZhbHVlIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwidXBkYXRlUGFyYW1zIiwiYXNzaWduIiwiaXNJbkRPTSIsIm9uRE9NQ29ubmVjdGVkIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJvbkRPTURpc2Nvbm5lY3RlZCIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiaXNDb25uZWN0ZWQiLCJfSG9zdCIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiSFRNTFRlbXBsYXRlRWxlbWVudCIsImlubmVySFRNTCIsInRyaW0iLCJsZW5ndGgiLCJMSVNTU3RhdGUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImlkIiwic2hhcmVkQ1NTIiwiTGlzcyIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwid2FpdFJlYWR5IiwiciIsImFsbCIsImlzUmVhZHkiLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJMSVNTSG9zdEJhc2UiLCJCYXNlIiwiYmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwiaW5pdCIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInByb21pc2UiLCJyZXNvbHZlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwiYXR0YWNoU2hhZG93IiwibW9kZSIsIm9icyIsImdldEF0dHJpYnV0ZSIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsImNzc3NlbGVjdG9yIiwiQ1NTU2VsZWN0b3IiLCJoYXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsInJlcGxhY2UiLCJoZWFkIiwiYXBwZW5kIiwiYWRkIiwidGVtcGxhdGVfZWxlbSIsInN0ciIsImNoaWxkTm9kZXMiLCJvYmoiLCJoYXNTaGFkb3ciLCJnZXRQYXJ0IiwicXVlcnlTZWxlY3RvciIsImdldFBhcnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImhhc0F0dHJpYnV0ZSIsInRhZ05hbWUiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiZGVmaW5lIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiQ2xhc3MiLCJodG1sdGFnIiwiTElTU2NsYXNzIiwib3B0cyIsIndoZW5EZWZpbmVkIiwiY2FsbGJhY2siLCJ3aGVuQWxsRGVmaW5lZCIsInRhZ25hbWVzIiwidCIsImlzRGVmaW5lZCIsImdldE5hbWUiLCJlbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiU3RhdGUiLCJERUZJTkVEIiwiUkVBRFkiLCJVUEdSQURFRCIsIklOSVRJQUxJWkVEIiwiZWxlbSIsImlzIiwiaXNVcGdyYWRlZCIsIndoZW4iLCJwcm9taXNlcyIsIndoZW5SZWFkeSIsIndoZW5VcGdyYWRlZCIsImdldEhvc3RDc3RyU3luYyIsIl93aGVuVXBncmFkZWQiLCJ2YWx1ZU9mIiwidG9TdHJpbmciLCJqb2luIiwiZ2V0U3RhdGUiLCJzdHJpY3QiLCJ1cGdyYWRlU3luYyIsImluaXRpYWxpemVTeW5jIiwiZm9yY2UiLCJIVE1MQ0xBU1NfUkVHRVgiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiZXhlYyIsIkNBTl9IQVZFX1NIQURPVyIsInRhZyIsInJlYWR5U3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIl0sInNvdXJjZVJvb3QiOiIifQ==