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

/***/ "./src/helpers/LISSAuto.ts":
/*!*********************************!*\
  !*** ./src/helpers/LISSAuto.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LISS_Auto: () => (/* binding */ LISS_Auto)
/* harmony export */ });
/* harmony import */ var types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! types */ "./src/types.ts");
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state */ "./src/state.ts");



class LISS_Auto extends (0,_LISSBase__WEBPACK_IMPORTED_MODULE_1__["default"])({
    attrs: [
        "src",
        "sw"
    ],
    shadow: types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.NONE,
    css: `:host { display: none; }`
}) {
    #known_tag = new Set();
    #directory;
    #sw;
    constructor(){
        super();
        this.#sw = new Promise(async (resolve)=>{
            await navigator.serviceWorker.register(this.attrs.sw ?? "/sw.js", {
                scope: "/"
            });
            if (navigator.serviceWorker.controller) {
                resolve();
                return;
            }
            navigator.serviceWorker.addEventListener('controllerchange', ()=>{
                resolve();
            });
        });
        const src = this.attrs.src;
        if (src === null) throw new Error("src attribute is missing.");
        this.#directory = src[0] === '.' ? `${window.location.pathname}${src}` : src;
        new MutationObserver((mutations)=>{
            for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition instanceof Element) this.#addTag(addition.tagName);
        }).observe(document, {
            childList: true,
            subtree: true
        });
        for (let elem of document.querySelectorAll("*"))this.#addTag(elem.tagName);
    }
    resources() {
        return [
            "index.js",
            "index.html",
            "index.css"
        ];
    }
    defineWebComponent(tagname, files, opts) {
        const js = files["index.js"];
        const content = files["index.html"];
        let klass = null;
        if (js !== undefined) klass = js(opts);
        else if (content !== undefined) klass = class WebComponent extends (0,_LISSBase__WEBPACK_IMPORTED_MODULE_1__["default"])(opts) {
        };
        console.warn(tagname, files);
        if (klass === null) throw new Error(`Missing files for WebComponent ${tagname}.`);
        return (0,_state__WEBPACK_IMPORTED_MODULE_2__.define)(tagname, klass);
    }
    async #addTag(tagname) {
        tagname = tagname.toLowerCase();
        if (tagname === 'liss-auto' || tagname === 'bliss-auto' || !tagname.includes('-') || this.#known_tag.has(tagname)) return;
        this.#known_tag.add(tagname);
        await this.#sw; // ensure SW is installed.
        const filenames = this.resources();
        const resources = await Promise.all(filenames.map((file)=>file.endsWith('.js') ? _import(`${this.#directory}/${tagname}/${file}`, true) : _fetchText(`${this.#directory}/${tagname}/${file}`, true)));
        const files = {};
        for(let i = 0; i < filenames.length; ++i)if (resources[i] !== undefined) files[filenames[i]] = resources[i];
        const content = files["index.html"];
        const css = files["index.css"];
        const opts = {
            ...content !== undefined && {
                content
            },
            ...css !== undefined && {
                css
            }
        };
        return this.defineWebComponent(tagname, files, opts);
    }
}
(0,_state__WEBPACK_IMPORTED_MODULE_2__.define)("liss-auto", LISS_Auto);
async function fetchResource(resource) {
    resource = await resource;
    if (!(resource instanceof Response)) resource = await fetch(resource);
    return await resource.text();
}
async function _fetchText(uri, isLissAuto = false) {
    const options = isLissAuto ? {
        headers: {
            "liss-auto": "true"
        }
    } : {};
    const response = await fetch(uri, options);
    if (response.status !== 200) return undefined;
    if (isLissAuto && response.headers.get("status") === "404") return undefined;
    return await response.text();
}
async function _import(uri, isLissAuto = false) {
    // test for the module existance.
    if (isLissAuto && await _fetchText(uri, isLissAuto) === undefined) return undefined;
    try {
        return (await import(/* webpackIgnore: true */ uri)).default;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}


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
/*!***********************************************!*\
  !*** ./src/pages/examples/liss-auto/index.ts ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/LISSAuto */ "./src/helpers/LISSAuto.ts");


})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./src/pages/examples/liss-auto/index.html ***!
  \*************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "pages/examples/liss-auto/index.html");
})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUF3QyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9MSVNTQXV0by50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2xpc3MtYXV0by9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2xpc3MtYXV0by9pbmRleC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiTElTU0hvc3RcIjtcbmltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgQ1NTX1NvdXJjZSwgSFRNTF9Tb3VyY2UsIExpZmVDeWNsZSwgTElTU19PcHRzLCBTaGFkb3dDZmcgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNTaGFkb3dTdXBwb3J0ZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgTElTU1N0YXRlIH0gZnJvbSBcInN0YXRlXCI7XG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUztcblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG5cdC8vIEhUTUwgQmFzZVxuXHRIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuXHRBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXIsIC8vc3RyaW5nLFxuPih7XG5cbiAgICAvLyBKUyBCYXNlXG4gICAgZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3RyLCAvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cbiAgICBwYXJhbXMgICAgICAgICAgICA9IHt9ICAgICBhcyB1bmtub3duIGFzIFBhcmFtcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGRlcHMgICA9IFtdLFxuICAgIGxpZmVfY3ljbGUgPSAgTGlmZUN5Y2xlLkRFRkFVTFQsXG5cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBob3N0ICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdG9ic2VydmVkQXR0cmlidXRlcyA9IFtdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG4gICAgYXR0cnMgPSBvYnNlcnZlZEF0dHJpYnV0ZXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBjb250ZW50LFxuICAgIGNzcyxcbiAgICBzaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSA/IFNoYWRvd0NmZy5DTE9TRSA6IFNoYWRvd0NmZy5OT05FXG59OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+ID0ge30pIHtcblxuICAgIGlmKCBzaGFkb3cgIT09IFNoYWRvd0NmZy5PUEVOICYmICEgaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgY29uc3QgYWxsX2RlcHMgPSBbLi4uZGVwc107XG5cbiAgICAvLyBjb250ZW50IHByb2Nlc3NpbmdcbiAgICBpZiggY29udGVudCBpbnN0YW5jZW9mIFByb21pc2UgfHwgY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkge1xuICAgICAgICBcblx0XHRsZXQgX2NvbnRlbnQ6IEhUTUxfU291cmNlfHVuZGVmaW5lZCA9IGNvbnRlbnQ7XG5cdFx0Y29udGVudCA9IG51bGwgYXMgdW5rbm93biBhcyBzdHJpbmc7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudDtcbiAgICAgICAgICAgIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG5cdFx0XHRcdF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuXG4gICAgICAgICAgICBMSVNTQmFzZS5MSVNTQ2ZnLmNvbnRlbnQgPSBwcm9jZXNzX2NvbnRlbnQoX2NvbnRlbnQpO1xuICAgICAgICB9KSgpICk7XG5cbiAgICB9IGVsc2Uge1xuXHRcdGNvbnRlbnQgPSBwcm9jZXNzX2NvbnRlbnQoY29udGVudCk7XG5cdH1cblxuXHQvLyBDU1MgcHJvY2Vzc2luZ1xuXHRsZXQgc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXSA9IFtdO1xuXHRpZiggY3NzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuXHRcdFx0Ly8gQHRzLWlnbm9yZSA6IHRvZG86IExJU1NPcHRzID0+IHNob3VsZCBub3QgYmUgYSBnZW5lcmljID9cblx0XHRcdGNzcyA9IFtjc3NdO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHN0eWxlc2hlZXRzID0gY3NzLm1hcCggKGM6IENTU19Tb3VyY2UsIGlkeDogbnVtYmVyKSA9PiB7XG5cblx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuXHRcdFx0XHRhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdFx0YyA9IGF3YWl0IGM7XG5cdFx0XHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG5cdFx0XHRcdFx0XHRjID0gYXdhaXQgYy50ZXh0KCk7XG5cblx0XHRcdFx0XHRzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cblx0XHRcdFx0fSkoKSk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvY2Vzc19jc3MoYyk7XG5cdFx0fSk7XG5cdH1cblxuXHR0eXBlIExJU1NIb3N0PFQ+ID0gYW55OyAvL1RPRE8uLi5cblx0dHlwZSBMSG9zdCA9IExJU1NIb3N0PExJU1NCYXNlPjsgLy88LSBjb25maWcgaW5zdGVhZCBvZiBMSVNTQmFzZSA/XG5cblx0Y2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBfZXh0ZW5kcyB7XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsIClcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KHt9LCB0aGlzKTtcblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogYW55OyAvLyBwcmV2ZW50cyBpc3N1ZSAjMS4uLlxuXG5cdFx0Ly8gTElTUyBDb25maWdzXG5cdFx0c3RhdGljIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudCxcblx0XHRcdHN0eWxlc2hlZXRzLFxuXHRcdFx0c2hhZG93LFxuXHRcdH07XG5cblx0XHRnZXQgc3RhdGUoKTogTElTU1N0YXRlIHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0LnN0YXRlO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblx0XHQvL1RPRE86IGdldCB0aGUgcmVhbCB0eXBlID9cblx0XHRwcm90ZWN0ZWQgZ2V0IGNvbnRlbnQoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0Ly8gYXR0cnNcblx0XHRwcm90ZWN0ZWQgZ2V0IGF0dHJzKCk6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBzZXRBdHRyRGVmYXVsdCggYXR0cjogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5zZXRBdHRyRGVmYXVsdChhdHRyLCB2YWx1ZSk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkF0dHJDaGFuZ2VkKF9uYW1lOiBBdHRycyxcblx0XHRcdF9vbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0X25ld1ZhbHVlOiBzdHJpbmcpOiB2b2lkfGZhbHNlIHt9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG5cdFx0cHJvdGVjdGVkIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBbQXR0cnMsIHN0cmluZywgc3RyaW5nXSkge1xuXHRcdFx0dGhpcy5vbkF0dHJDaGFuZ2VkKC4uLmFyZ3MpO1xuXHRcdH1cblxuXHRcdC8vIHBhcmFtZXRlcnNcblx0XHRwdWJsaWMgZ2V0IHBhcmFtcygpOiBSZWFkb25seTxQYXJhbXM+IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkucGFyYW1zO1xuXHRcdH1cblx0XHRwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxQYXJhbXM+KSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKCAodGhpcy4jaG9zdCBhcyBMSG9zdCkucGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cblx0XHQvLyBET01cblx0XHRwdWJsaWMgZ2V0IGlzSW5ET00oKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmlzQ29ubmVjdGVkO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01Db25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTURpc2Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXRcblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmlzSW5ET007XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzdGF0aWMgX0hvc3Q6IExJU1NIb3N0PExJU1NCYXNlPjtcblxuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzX2Nzcyhjc3M6IHN0cmluZ3xDU1NTdHlsZVNoZWV0fEhUTUxTdHlsZUVsZW1lbnQpIHtcblxuXHRpZihjc3MgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KVxuXHRcdHJldHVybiBjc3M7XG5cdGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuXHRcdHJldHVybiBjc3Muc2hlZXQhO1xuXG5cdGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cdGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuXHRcdHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7IC8vIHJlcGxhY2UoKSBpZiBpc3N1ZXNcblx0XHRyZXR1cm4gc3R5bGU7XG5cdH1cblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3Vyc1wiKTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19jb250ZW50KGNvbnRlbnQ6IHN0cmluZ3xIVE1MVGVtcGxhdGVFbGVtZW50fHVuZGVmaW5lZCkge1xuXG4gICAgaWYoY29udGVudCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgaWYoY29udGVudCBpbnN0YW5jZW9mIEhUTUxUZW1wbGF0ZUVsZW1lbnQpXG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50LmlubmVySFRNTDtcblxuICAgIGNvbnRlbnQgPSBjb250ZW50LnRyaW0oKTtcbiAgICBpZiggY29udGVudC5sZW5ndGggPT09IDAgKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG59IiwiaW1wb3J0IHsgTElTU1N0YXRlLCB1cGdyYWRlU3luYyB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuaW1wb3J0IHsgTElTU19PcHRzLCBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgQ29tcG9zZUNvbnN0cnVjdG9yLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdhaXRET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IGlkID0gMDtcblxudHlwZSBpbmZlckxJU1M8VD4gPSBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPGluZmVyIEEsIGluZmVyIEIsIGluZmVyIEMsIGluZmVyIEQ+ID8gW0EsQixDLERdIDogbmV2ZXI7XG5cbi8vVE9ETzogc2hhZG93IHV0aWxzID9cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFxuICAgICAgICAgICAgICAgICAgICAgICAgVCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oTGlzczogVCkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRycyxcblx0XHRjb250ZW50LFxuXHRcdHN0eWxlc2hlZXRzLFxuXHRcdHNoYWRvdyxcblx0fSA9IExpc3MuTElTU0NmZztcblxuXHR0eXBlIFAgPSBpbmZlckxJU1M8VD47XG5cdC8vdHlwZSBFeHRlbmRzQ3N0ciA9IFBbMF07XG5cdHR5cGUgUGFyYW1zICAgICAgPSBQWzFdO1xuXHR0eXBlIEhvc3RDc3RyICAgID0gUFsyXTtcblx0dHlwZSBBdHRycyAgICAgICA9IFBbM107XG5cbiAgICB0eXBlIEhvc3QgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICAvLyBhdHRycyBwcm94eVxuXHRjb25zdCBHRVQgPSBTeW1ib2woJ2dldCcpO1xuXHRjb25zdCBTRVQgPSBTeW1ib2woJ3NldCcpO1xuXG5cdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoIGF0dHJzLm1hcChuID0+IFtuLCB7XG5cblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKTogc3RyaW5nfG51bGwgICAgICB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW0dFVF0obik7IH0sXG5cdFx0c2V0OiBmdW5jdGlvbih2YWx1ZTogc3RyaW5nfG51bGwpIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbU0VUXShuLCB2YWx1ZSk7IH1cblx0fV0pICk7XG5cblx0Y2xhc3MgQXR0cmlidXRlcyB7XG4gICAgICAgIFt4OiBzdHJpbmddOiBzdHJpbmd8bnVsbDtcblxuICAgICAgICAjZGF0YSAgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI2RlZmF1bHRzIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNzZXR0ZXIgICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkO1xuXG4gICAgICAgIFtHRVRdKG5hbWU6IEF0dHJzKSB7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI2RhdGFbbmFtZV0gPz8gdGhpcy4jZGVmYXVsdHNbbmFtZV0gPz8gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgW1NFVF0obmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCl7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI3NldHRlcihuYW1lLCB2YWx1ZSk7IC8vIHJlcXVpcmVkIHRvIGdldCBhIGNsZWFuIG9iamVjdCB3aGVuIGRvaW5nIHsuLi5hdHRyc31cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGEgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcblx0XHRcdFx0XHRkZWZhdWx0czogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG4gICAgICAgIFx0XHRcdHNldHRlciAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZCkge1xuXG4gICAgICAgIFx0dGhpcy4jZGF0YSAgICAgPSBkYXRhO1xuXHRcdFx0dGhpcy4jZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgXHR0aGlzLiNzZXR0ZXIgPSBzZXR0ZXI7XG5cbiAgICAgICAgXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXHR9XG5cblx0Y29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3Qgd2FpdFJlYWR5ID0gbmV3IFByb21pc2U8dm9pZD4oIGFzeW5jIChyKSA9PiB7XG5cbiAgICAgICAgYXdhaXQgd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXG4gICAgICAgIGlzUmVhZHkgPSB0cnVlO1xuXG4gICAgICAgIHIoKTtcbiAgICB9KTtcblxuICAgIC8vIE5vIGRlcHMgYW5kIERPTSBhbHJlYWR5IGxvYWRlZC5cbiAgICBsZXQgaXNSZWFkeSA9IExpc3MuTElTU0NmZy5kZXBzLmxlbmd0aCA9PSAwICYmIGlzRE9NQ29udGVudExvYWRlZCgpO1xuXG5cdGNvbnN0IHBhcmFtcyA9IExpc3MuTElTU0NmZy5wYXJhbXM7IC8vT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5MSVNTQ2ZnLnBhcmFtcywgX3BhcmFtcyk7XG5cblx0Ly9cblxuXHRjb25zdCB3aGVuRGVwc1Jlc29sdmVkID0gUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXHRsZXQgaXNEZXBzUmVzb2x2ZWQgPSBmYWxzZTtcblx0KCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRpc0RlcHNSZXNvbHZlZCA9IHRydWU7XG5cdH0pKCk7XG5cblx0Y2xhc3MgTElTU0hvc3RCYXNlIGV4dGVuZHMgKGhvc3QgYXMgbmV3ICgpID0+IEhUTUxFbGVtZW50KSB7XG5cblx0XHQvLyBhZG9wdCBzdGF0ZSBpZiBhbHJlYWR5IGNyZWF0ZWQuXG5cdFx0cmVhZG9ubHkgc3RhdGUgPSAodGhpcyBhcyBhbnkpLnN0YXRlID8/IG5ldyBMSVNTU3RhdGUodGhpcyk7XG5cblx0XHQvLyA9PT09PT09PT09PT0gREVQRU5ERU5DSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdHN0YXRpYyByZWFkb25seSB3aGVuRGVwc1Jlc29sdmVkID0gd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGlzRGVwc1Jlc29sdmVkO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0c3RhdGljIEJhc2UgPSBMaXNzO1xuXG5cdFx0I2Jhc2U6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgYmFzZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNiYXNlO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2UgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHRpbml0aWFsaXplKHBhcmFtczogUGFydGlhbDxQYXJhbXM+ID0ge30pIHtcblxuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgKCB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNEZXBzUmVzb2x2ZWQgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY2llcyBoYXNuJ3QgYmVlbiBsb2FkZWQgIVwiKTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLiNwYXJhbXMsIHBhcmFtcyk7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuaXNDb25uZWN0ZWQgKVxuXHRcdFx0XHQodGhpcy4jYmFzZSBhcyBhbnkpLm9uRE9NQ29ubmVjdGVkKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNiYXNlO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHJlYWRvbmx5ICNwYXJhbXM6IFBhcmFtcyA9IHBhcmFtcztcblxuXHRcdGdldCBwYXJhbXMoKTogUGFyYW1zIHtcblx0XHRcdHJldHVybiB0aGlzLiNwYXJhbXM7XG5cdFx0fVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPExJU1NfT3B0c1tcInBhcmFtc1wiXT4pIHtcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHRoaXMuYmFzZSEudXBkYXRlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIC8vIHdpbCBiZSBnaXZlbiB0byBjb25zdHJ1Y3Rvci4uLlxuXHRcdFx0T2JqZWN0LmFzc2lnbiggdGhpcy4jcGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cdFx0Ly8gPT09PT09PT09PT09PT0gQXR0cmlidXRlcyA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjYXR0cnNfZmxhZyA9IGZhbHNlO1xuXG5cdFx0I2F0dHJpYnV0ZXMgICAgICAgICA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRyaWJ1dGVzRGVmYXVsdHMgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cnMgPSBuZXcgQXR0cmlidXRlcyhcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXMsXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHMsXG5cdFx0XHQobmFtZTogQXR0cnMsIHZhbHVlOnN0cmluZ3xudWxsKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSB0cnVlOyAvLyBkbyBub3QgdHJpZ2dlciBvbkF0dHJzQ2hhbmdlZC5cblx0XHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdCkgYXMgdW5rbm93biBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblxuXHRcdHNldEF0dHJEZWZhdWx0KG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0ZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Z2V0IGF0dHJzKCk6IFJlYWRvbmx5PFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+PiB7XG5cblx0XHRcdHJldHVybiB0aGlzLiNhdHRycztcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBDb250ZW50ID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNjb250ZW50OiBIb3N0fFNoYWRvd1Jvb3R8bnVsbCA9IG51bGw7XG5cblx0XHRnZXQgY29udGVudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250ZW50O1xuXHRcdH1cblxuXHRcdGdldFBhcnQobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cdFx0Z2V0UGFydHMobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0IGhhc1NoYWRvdygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBzaGFkb3cgIT09ICdub25lJztcblx0XHR9XG5cblx0XHQvKioqIENTUyAqKiovXG5cblx0XHRnZXQgQ1NTU2VsZWN0b3IoKSB7XG5cblx0XHRcdGlmKHRoaXMuaGFzU2hhZG93IHx8ICEgdGhpcy5oYXNBdHRyaWJ1dGUoXCJpc1wiKSApXG5cdFx0XHRcdHJldHVybiB0aGlzLnRhZ05hbWU7XG5cblx0XHRcdHJldHVybiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gSW1wbCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHRjb25zdHJ1Y3RvcihwYXJhbXM6IHt9LCBiYXNlPzogSW5zdGFuY2VUeXBlPFQ+KSB7XG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGlmKCBiYXNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy4jYmFzZSA9IGJhc2U7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdCh0aGlzLmJhc2UhIGFzIGFueSkub25ET01EaXNjb25uZWN0ZWQoKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmJhc2UhLm9uRE9NQ29ubmVjdGVkKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5zdGF0ZS5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCggYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdGF3YWl0IHRoaXMuc3RhdGUuaXNSZWFkeTtcblxuXHRcdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHR9KSgpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblx0XHRcdFxuXHRcdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzKTtcblxuICAgICAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLlxuXHRcdFx0XG5cdFx0XHQvLyBzaGFkb3dcblx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9zdDtcblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJykge1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6IHNoYWRvd30pO1xuXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYXR0cnNcblx0XHRcdGZvcihsZXQgb2JzIG9mIGF0dHJzISlcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tvYnMgYXMgQXR0cnNdID0gdGhpcy5nZXRBdHRyaWJ1dGUob2JzKTtcblxuXHRcdFx0Ly8gY3NzXG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUyk7XG5cdFx0XHRpZiggc3R5bGVzaGVldHMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaCguLi5zdHlsZXNoZWV0cyk7XG5cdFx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdFx0Y29uc3QgY3Nzc2VsZWN0b3IgPSB0aGlzLkNTU1NlbGVjdG9yO1xuXG5cdFx0XHRcdFx0Ly8gaWYgbm90IHlldCBpbnNlcnRlZCA6XG5cdFx0XHRcdFx0aWYoICEgYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cblx0XHRcdFx0XHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG5cdFx0XHRcdFx0XHRsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcblx0XHRcdFx0XHRcdFx0XHRodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuXG5cdFx0XHRcdFx0XHRhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY29udGVudFxuXHRcdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0bGV0IHRlbXBsYXRlX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0XHRcdC8vbGV0IHN0ciA9IChjb250ZW50IGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiB0aGlzLmdldEF0dHJpYnV0ZShtYXRjaCk/PycnKVxuXHQgICAgXHRcdGxldCBzdHIgPSAoY29udGVudCBhcyBzdHJpbmcpO1xuXHRcdFx0XHR0ZW1wbGF0ZV9lbGVtLmlubmVySFRNTCA9IHN0cjtcblx0ICAgIFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCguLi50ZW1wbGF0ZV9lbGVtLmNvbnRlbnQuY2hpbGROb2Rlcyk7XG5cdCAgICBcdH1cblxuXHQgICAgXHQvLyBidWlsZFxuXG5cdCAgICBcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0ICAgIFx0bGV0IG9iaiA9IHRoaXMuYmFzZSA9PT0gbnVsbCA/IG5ldyBMaXNzKCkgOiB0aGlzLmJhc2U7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSBvYmogYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXG5cdFx0XHQvLyBkZWZhdWx0IHNsb3Rcblx0XHRcdGlmKCB0aGlzLmhhc1NoYWRvdyAmJiB0aGlzLiNjb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwIClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIodGhpcy5iYXNlKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuYmFzZTtcblx0XHR9XG5cblxuXG5cdFx0Ly8gYXR0cnNcblxuXHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBhdHRycztcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSAgICA6IEF0dHJzLFxuXHRcdFx0XHRcdFx0XHRcdCBvbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRcdCBuZXdWYWx1ZTogc3RyaW5nKSB7XG5cblx0XHRcdGlmKHRoaXMuI2F0dHJzX2ZsYWcpIHtcblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSBuZXdWYWx1ZTtcblx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0aWYoICh0aGlzLmJhc2UhIGFzIGFueSkub25BdHRyQ2hhbmdlZChuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLiNhdHRyc1tuYW1lXSA9IG9sZFZhbHVlOyAvLyByZXZlcnQgdGhlIGNoYW5nZS5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0QmFzZSBhcyBDb21wb3NlQ29uc3RydWN0b3I8dHlwZW9mIExJU1NIb3N0QmFzZSwgdHlwZW9mIGhvc3Q+O1xufVxuXG5cbiIsImltcG9ydCB7IFNoYWRvd0NmZyB9IGZyb20gXCJ0eXBlc1wiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL0xJU1NCYXNlXCI7XG5cbmltcG9ydCB7ZGVmaW5lfSBmcm9tIFwiLi4vc3RhdGVcIjtcblxuZXhwb3J0IGNsYXNzIExJU1NfQXV0byBleHRlbmRzIExJU1Moe1xuXHRhdHRyczogW1wic3JjXCIsIFwic3dcIl0sXG5cdHNoYWRvdzogU2hhZG93Q2ZnLk5PTkUsXG5cdGNzczogYDpob3N0IHsgZGlzcGxheTogbm9uZTsgfWBcbn0pIHtcblxuXHRyZWFkb25seSAja25vd25fdGFnID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cdHJlYWRvbmx5ICNkaXJlY3Rvcnk6IHN0cmluZztcblx0cmVhZG9ubHkgI3N3OiBQcm9taXNlPHZvaWQ+O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuI3N3ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cdFx0XHRcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHRoaXMuYXR0cnMuc3cgPz8gXCIvc3cuanNcIiwge3Njb3BlOiBcIi9cIn0pO1xuXG5cdFx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cblx0XHRjb25zdCBzcmMgPSB0aGlzLmF0dHJzLnNyYztcblx0XHRpZihzcmMgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzcmMgYXR0cmlidXRlIGlzIG1pc3NpbmcuXCIpO1xuXHRcdHRoaXMuI2RpcmVjdG9yeSA9IHNyY1swXSA9PT0gJy4nXG5cdFx0XHRcdFx0XHRcdFx0PyBgJHt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9JHtzcmN9YFxuXHRcdFx0XHRcdFx0XHRcdDogc3JjO1xuXG5cdFx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXG5cdFx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEVsZW1lbnQpXG5cdFx0XHRcdFx0XHR0aGlzLiNhZGRUYWcoYWRkaXRpb24udGFnTmFtZSlcblxuXHRcdH0pLm9ic2VydmUoIGRvY3VtZW50LCB7IGNoaWxkTGlzdDp0cnVlLCBzdWJ0cmVlOnRydWUgfSk7XG5cblxuXHRcdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipcIikgKVxuXHRcdFx0dGhpcy4jYWRkVGFnKGVsZW0udGFnTmFtZSk7XG5cdH1cblxuXG4gICAgcHJvdGVjdGVkIHJlc291cmNlcygpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0XCJpbmRleC5qc1wiLFxuXHRcdFx0XCJpbmRleC5odG1sXCIsXG5cdFx0XHRcImluZGV4LmNzc1wiXG5cdFx0XTtcbiAgICB9XG5cblx0cHJvdGVjdGVkIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nfT4pIHtcblxuXHRcdGNvbnN0IGpzID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXG5cdFx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdFx0aWYoIGpzICE9PSB1bmRlZmluZWQgKVxuXHRcdFx0a2xhc3MgPSBqcyhvcHRzKTtcblx0XHRlbHNlIGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQgKVxuXHRcdFx0a2xhc3MgPSBjbGFzcyBXZWJDb21wb25lbnQgZXh0ZW5kcyBMSVNTKG9wdHMpIHt9O1xuXG5cdFx0Y29uc29sZS53YXJuKHRhZ25hbWUsIGZpbGVzKTtcblxuXHRcdGlmKGtsYXNzID09PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGZpbGVzIGZvciBXZWJDb21wb25lbnQgJHt0YWduYW1lfS5gKTtcblxuXHRcdHJldHVybiBkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXHR9XG5cblx0YXN5bmMgI2FkZFRhZyh0YWduYW1lOiBzdHJpbmcpIHtcblxuXHRcdHRhZ25hbWUgPSB0YWduYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiggdGFnbmFtZSA9PT0gJ2xpc3MtYXV0bycgfHwgdGFnbmFtZSA9PT0gJ2JsaXNzLWF1dG8nIHx8ICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IHRoaXMuI2tub3duX3RhZy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLiNrbm93bl90YWcuYWRkKHRhZ25hbWUpO1xuXG5cdFx0YXdhaXQgdGhpcy4jc3c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cblx0XHRjb25zdCBmaWxlbmFtZXMgPSB0aGlzLnJlc291cmNlcygpO1xuXHRcdGNvbnN0IHJlc291cmNlcyA9IGF3YWl0IFByb21pc2UuYWxsKCBmaWxlbmFtZXMubWFwKCBmaWxlID0+IGZpbGUuZW5kc1dpdGgoJy5qcycpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdD8gX2ltcG9ydCAgIChgJHt0aGlzLiNkaXJlY3Rvcnl9LyR7dGFnbmFtZX0vJHtmaWxlfWAsIHRydWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDogX2ZldGNoVGV4dChgJHt0aGlzLiNkaXJlY3Rvcnl9LyR7dGFnbmFtZX0vJHtmaWxlfWAsIHRydWUpICkgKTtcblxuXHRcdGNvbnN0IGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGZpbGVuYW1lcy5sZW5ndGg7ICsraSlcblx0XHRcdGlmKCByZXNvdXJjZXNbaV0gIT09IHVuZGVmaW5lZClcblx0XHRcdFx0ZmlsZXNbZmlsZW5hbWVzW2ldXSA9IHJlc291cmNlc1tpXTtcblxuXHRcdGNvbnN0IGNvbnRlbnQgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cdFx0Y29uc3QgY3NzICAgICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdFx0Y29uc3Qgb3B0czogUGFydGlhbDx7Y29udGVudDogc3RyaW5nLCBjc3M6IHN0cmluZ30+ID0ge1xuXHRcdFx0Li4uY29udGVudCAhPT0gdW5kZWZpbmVkICYmIHtjb250ZW50fSxcblx0XHRcdC4uLmNzcyAgICAgIT09IHVuZGVmaW5lZCAmJiB7Y3NzfSxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoaXMuZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWUsIGZpbGVzLCBvcHRzKTtcblx0XHRcblx0fVxufVxuZGVmaW5lKFwibGlzcy1hdXRvXCIsIExJU1NfQXV0byk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50cyB7XG5cdFwibGlzcy1hdXRvXCI6IExJU1NfQXV0b1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBpbnRlcm5hbCB0b29scyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG50eXBlIFJlc291cmNlID0gVVJMfFJlc3BvbnNlO1xuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFJlc291cmNlKHJlc291cmNlOiBSZXNvdXJjZXxQcm9taXNlPFJlc291cmNlPikge1xuXG5cdHJlc291cmNlID0gYXdhaXQgcmVzb3VyY2U7XG5cblx0aWYoICEgKHJlc291cmNlIGluc3RhbmNlb2YgUmVzcG9uc2UpIClcblx0XHRyZXNvdXJjZSA9IGF3YWl0IGZldGNoKHJlc291cmNlKTtcblxuXHRyZXR1cm4gYXdhaXQgcmVzb3VyY2UudGV4dCgpO1xufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaFRleHQodXJpOiBzdHJpbmd8VVJMLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHRjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuXHRcdFx0XHRcdFx0PyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuXHRcdFx0XHRcdFx0OiB7fTtcblxuXG5cdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcblx0aWYocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0aWYoIGlzTGlzc0F1dG8gJiYgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJzdGF0dXNcIikhID09PSBcIjQwNFwiIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG59XG5hc3luYyBmdW5jdGlvbiBfaW1wb3J0KHVyaTogc3RyaW5nLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHQvLyB0ZXN0IGZvciB0aGUgbW9kdWxlIGV4aXN0YW5jZS5cblx0aWYoaXNMaXNzQXV0byAmJiBhd2FpdCBfZmV0Y2hUZXh0KHVyaSwgaXNMaXNzQXV0bykgPT09IHVuZGVmaW5lZCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHR0cnkge1xuXHRcdHJldHVybiAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJpKSkuZGVmYXVsdDtcblx0fSBjYXRjaChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxufSIsImltcG9ydCB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwidHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwidXRpbHNcIjtcblxuZW51bSBTdGF0ZSB7XG4gICAgTk9ORSA9IDAsXG5cbiAgICAvLyBjbGFzc1xuICAgIERFRklORUQgPSAxIDw8IDAsXG4gICAgUkVBRFkgICA9IDEgPDwgMSxcblxuICAgIC8vIGluc3RhbmNlXG4gICAgVVBHUkFERUQgICAgPSAxIDw8IDIsXG4gICAgSU5JVElBTElaRUQgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCBjb25zdCBERUZJTkVEICAgICA9IFN0YXRlLkRFRklORUQ7XG5leHBvcnQgY29uc3QgUkVBRFkgICAgICAgPSBTdGF0ZS5SRUFEWTtcbmV4cG9ydCBjb25zdCBVUEdSQURFRCAgICA9IFN0YXRlLlVQR1JBREVEO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVEID0gU3RhdGUuSU5JVElBTElaRUQ7XG5cbmV4cG9ydCBjbGFzcyBMSVNTU3RhdGUge1xuXG4gICAgI2VsZW06IEhUTUxFbGVtZW50fG51bGw7XG5cbiAgICAvLyBpZiBudWxsIDogY2xhc3Mgc3RhdGUsIGVsc2UgaW5zdGFuY2Ugc3RhdGVcbiAgICBjb25zdHJ1Y3RvcihlbGVtOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbCkge1xuICAgICAgICB0aGlzLiNlbGVtID0gZWxlbTtcbiAgICB9XG5cbiAgICBzdGF0aWMgREVGSU5FRCAgICAgPSBERUZJTkVEO1xuICAgIHN0YXRpYyBSRUFEWSAgICAgICA9IFJFQURZO1xuICAgIHN0YXRpYyBVUEdSQURFRCAgICA9IFVQR1JBREVEO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFRCA9IElOSVRJQUxJWkVEO1xuXG4gICAgaXMoc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgICAgICYmICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSAgICAgICAmJiAhIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEICAgICYmICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgJiYgISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBsZXQgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxhbnk+PigpO1xuICAgIFxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkRlZmluZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5SZWFkeSgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblVwZ3JhZGVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuSW5pdGlhbGl6ZWQoKSApO1xuICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IERFRklORUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNEZWZpbmVkKCkge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KCBnZXROYW1lKHRoaXMuI2VsZW0pICkgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBSRUFEWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1JlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG4gICAgICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgaG9zdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpO1xuICAgIFxuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIGhvc3QpXG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIFxuICAgICAgICAvLyBoNGNrXG4gICAgXG4gICAgICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgICAgICBcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuICAgIFxuICAgICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IElOSVRJQUxJWkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gXCJpc0luaXRpYWxpemVkXCIgaW4gZWxlbSAmJiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuYmFzZSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBDT05WRVJTSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhbHVlT2YoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZTogU3RhdGUgPSAwO1xuICAgIFxuICAgICAgICBpZiggdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gREVGSU5FRDtcbiAgICAgICAgaWYoIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICBzdGF0ZSB8PSBSRUFEWTtcbiAgICAgICAgaWYoIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBVUEdSQURFRDtcbiAgICAgICAgaWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcbiAgICBcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiREVGSU5FRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgaXMucHVzaChcIlJFQURZXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJJTklUSUFMSVpFRFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGlzLmpvaW4oJ3wnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmKCBcInN0YXRlXCIgaW4gZWxlbSlcbiAgICAgICAgcmV0dXJuIGVsZW0uc3RhdGUgYXMgTElTU1N0YXRlO1xuICAgIFxuICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLnN0YXRlID0gbmV3IExJU1NTdGF0ZShlbGVtKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IFN0YXRlIG1vZGlmaWVycyAobW92ZT8pID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHbyB0byBzdGF0ZSBERUZJTkVEXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+KSB7XG5cbiAgICAvLyBjb3VsZCBiZSBiZXR0ZXIuXG4gICAgaWYoIFwiQmFzZVwiIGluIENvbXBvbmVudENsYXNzKSB7XG4gICAgICAgIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQmFzZSBhcyBUO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7IC8vYnVpbGRMSVNTSG9zdDxUPihDb21wb25lbnRDbGFzcywgcGFyYW1zKTtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG4vLyBHbyB0byBzdGF0ZSBVUEdSQURFRFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZ3JhZGU8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5EZWZpbmVkKCk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgKGVsZW0gaW5zdGFuY2VvZiBIb3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBkaWRuJ3QgdXBncmFkZSFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIFQ7XG59XG5cbi8vIEdvIHRvIHN0YXRlIElOSVRJQUxJWkVEXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSApXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5SZWFkeSgpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBUIHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgc3RhdGUuaXNSZWFkeSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT0gZXh0ZXJuYWwgV0hFTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlbkluaXRpYWxpemVkPFQ+KCk7XG59XG5cbi8vIFByaXZhdGUgZm9yIG5vdy5cblxuZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBcbiAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShlbGVtKTtcbiAgICBjb25zdCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KCBuYW1lICk7XG4gICAgaWYoIGhvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IG5vdCB5ZXQgZGVmaW5lZCFgKTtcbiAgICByZXR1cm4gaG9zdCBhcyBUO1xufVxuXG4vL1RPRE86IG1vdmUgMiByZWdpc3RlcnkuLi5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50ICk6IHN0cmluZyB7XG5cblx0Y29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcblx0aWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuXHRyZXR1cm4gbmFtZTtcbn0iLCJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIkxJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50O1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnXG59O1xuXG4vL1RPRE86IGltcGxlbWVudFxuZXhwb3J0IGVudW0gTGlmZUN5Y2xlIHtcbiAgICBERUZBVUxUICAgICAgICAgICAgICAgICAgID0gMCxcblx0Ly8gbm90IGltcGxlbWVudGVkIHlldFxuICAgIElOSVRfQUZURVJfQ0hJTERSRU4gICAgICAgPSAxIDw8IDEsXG4gICAgSU5JVF9BRlRFUl9QQVJFTlQgICAgICAgICA9IDEgPDwgMixcbiAgICAvLyBxdWlkIHBhcmFtcy9hdHRycyA/XG4gICAgUkVDUkVBVEVfQUZURVJfQ09OTkVDVElPTiA9IDEgPDwgMywgLyogcmVxdWlyZXMgcmVidWlsZCBjb250ZW50ICsgZGVzdHJveS9kaXNwb3NlIHdoZW4gcmVtb3ZlZCBmcm9tIERPTSAqL1xuICAgIC8qIHNsZWVwIHdoZW4gZGlzY28gOiB5b3UgbmVlZCB0byBpbXBsZW1lbnQgaXQgeW91cnNlbGYgKi9cbn1cblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmcsXG4gICAgPiA9IHtcbiAgICAgICAgLy8gSlMgQmFzZVxuICAgICAgICBleHRlbmRzICAgOiBFeHRlbmRzQ3RyLFxuICAgICAgICBwYXJhbXMgICAgOiBQYXJhbXMsXG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGRlcHMgICAgICA6IHJlYWRvbmx5IFByb21pc2U8YW55PltdLFxuICAgICAgICBsaWZlX2N5Y2xlOiBMaWZlQ3ljbGUsIFxuXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0cixcbiAgICAgICAgYXR0cnMgIDogcmVhZG9ubHkgQXR0cnNbXSxcbiAgICAgICAgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiByZWFkb25seSBBdHRyc1tdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXRcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgY29udGVudD86IEhUTUxfU291cmNlLFxuICAgICAgICBjc3MgICAgIDogQ1NTX1NvdXJjZSB8IHJlYWRvbmx5IENTU19Tb3VyY2VbXSxcbiAgICAgICAgc2hhZG93ICA6IFNoYWRvd0NmZ1xufVxuXG4vLyBMSVNTQmFzZVxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZUNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBJbnN0YW5jZVR5cGU8TElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBUIGV4dGVuZHMgTElTU0Jhc2U8XG4gICAgICAgICAgICBpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgQixcbiAgICAgICAgICAgIGluZmVyIEMsXG4gICAgICAgICAgICBpbmZlciBEPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0Jhc2VDc3RyPEEsQixDLEQ+IDogbmV2ZXI7XG5cblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0Jhc2UgPyBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgSFRNTENMQVNTX1JFR0VYID0gIC9IVE1MKFxcdyspRWxlbWVudC87XG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cdFxuXHRsZXQgaHRtbHRhZyA9IEhUTUxDTEFTU19SRUdFWC5leGVjKENsYXNzLm5hbWUpIVsxXTtcblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IHR5cGVvZiBIVE1MRWxlbWVudCkge1xuXHRyZXR1cm4gQ0FOX0hBVkVfU0hBRE9XLmluY2x1ZGVzKCBfZWxlbWVudDJ0YWduYW1lKHRhZykgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn1cblxuZXhwb3J0IGNvbnN0IHdoZW5ET01Db250ZW50TG9hZGVkID0gd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn1cblxuLy8gZm9yIG1peGlucy5cbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlciIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjsiLCJpbXBvcnQgJy4uLy4uLy4uL2hlbHBlcnMvTElTU0F1dG8nOyIsImV4cG9ydCBkZWZhdWx0IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJwYWdlcy9leGFtcGxlcy9saXNzLWF1dG8vaW5kZXguaHRtbFwiOyJdLCJuYW1lcyI6WyJidWlsZExJU1NIb3N0IiwiTGlmZUN5Y2xlIiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzU2hhZG93U3VwcG9ydGVkIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJJTElTUyIsIkxJU1MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJwYXJhbXMiLCJkZXBzIiwibGlmZV9jeWNsZSIsIkRFRkFVTFQiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnQiLCJjc3MiLCJzaGFkb3ciLCJDTE9TRSIsIk5PTkUiLCJPUEVOIiwiRXJyb3IiLCJhbGxfZGVwcyIsIlByb21pc2UiLCJSZXNwb25zZSIsIl9jb250ZW50IiwicHVzaCIsInRleHQiLCJMSVNTQmFzZSIsIkxJU1NDZmciLCJwcm9jZXNzX2NvbnRlbnQiLCJzdHlsZXNoZWV0cyIsInVuZGVmaW5lZCIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImMiLCJpZHgiLCJwcm9jZXNzX2NzcyIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkhvc3QiLCJzdGF0ZSIsInNldEF0dHJEZWZhdWx0IiwiYXR0ciIsInZhbHVlIiwib25BdHRyQ2hhbmdlZCIsIl9uYW1lIiwiX29sZFZhbHVlIiwiX25ld1ZhbHVlIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwidXBkYXRlUGFyYW1zIiwiYXNzaWduIiwiaXNJbkRPTSIsImlzQ29ubmVjdGVkIiwib25ET01Db25uZWN0ZWQiLCJjb25uZWN0ZWRDYWxsYmFjayIsIm9uRE9NRGlzY29ubmVjdGVkIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJfSG9zdCIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiSFRNTFRlbXBsYXRlRWxlbWVudCIsImlubmVySFRNTCIsInRyaW0iLCJsZW5ndGgiLCJMSVNTU3RhdGUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImlkIiwic2hhcmVkQ1NTIiwiTGlzcyIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwid2FpdFJlYWR5IiwiciIsImFsbCIsImlzUmVhZHkiLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJMSVNTSG9zdEJhc2UiLCJCYXNlIiwiYmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwiaW5pdCIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiQ1NTU2VsZWN0b3IiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicHJvbWlzZSIsInJlc29sdmUiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJhdHRhY2hTaGFkb3ciLCJtb2RlIiwib2JzIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwiY3Nzc2VsZWN0b3IiLCJoYXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsInJlcGxhY2UiLCJoZWFkIiwiYXBwZW5kIiwiYWRkIiwidGVtcGxhdGVfZWxlbSIsInN0ciIsImNoaWxkTm9kZXMiLCJvYmoiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiZGVmaW5lIiwiTElTU19BdXRvIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic3ciLCJzY29wZSIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwic3JjIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtdXRhdGlvbiIsImFkZGl0aW9uIiwiYWRkZWROb2RlcyIsIkVsZW1lbnQiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImVsZW0iLCJyZXNvdXJjZXMiLCJkZWZpbmVXZWJDb21wb25lbnQiLCJ0YWduYW1lIiwiZmlsZXMiLCJvcHRzIiwianMiLCJrbGFzcyIsIldlYkNvbXBvbmVudCIsImNvbnNvbGUiLCJ3YXJuIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImZpbGVuYW1lcyIsImZpbGUiLCJlbmRzV2l0aCIsIl9pbXBvcnQiLCJfZmV0Y2hUZXh0IiwiaSIsImZldGNoUmVzb3VyY2UiLCJyZXNvdXJjZSIsImZldGNoIiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJkZWZhdWx0IiwiZSIsImxvZyIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiU3RhdGUiLCJERUZJTkVEIiwiUkVBRFkiLCJVUEdSQURFRCIsIklOSVRJQUxJWkVEIiwiaXMiLCJpc0RlZmluZWQiLCJpc1VwZ3JhZGVkIiwid2hlbiIsInByb21pc2VzIiwid2hlbkRlZmluZWQiLCJ3aGVuUmVhZHkiLCJ3aGVuVXBncmFkZWQiLCJnZXROYW1lIiwiZ2V0SG9zdENzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJnZXRTdGF0ZSIsIkNvbXBvbmVudENsYXNzIiwiQ2xhc3MiLCJodG1sdGFnIiwiTElTU2NsYXNzIiwic3RyaWN0IiwidXBncmFkZVN5bmMiLCJpbml0aWFsaXplU3luYyIsImZvcmNlIiwiZWxlbWVudCIsIkhUTUxDTEFTU19SRUdFWCIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJleGVjIiwiQ0FOX0hBVkVfU0hBRE9XIiwidGFnIiwicmVhZHlTdGF0ZSJdLCJzb3VyY2VSb290IjoiIn0=