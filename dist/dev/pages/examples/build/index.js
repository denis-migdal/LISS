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
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../index */ "./src/index.ts");


function html(str, ...args) {
    let string = str[0];
    for(let i = 0; i < args.length; ++i){
        string += `${args[i]}`;
        string += `${str[i + 1]}`;
    //TODO: more pre-processes
    }
    // using template prevents CustomElements upgrade...
    let template = document.createElement('div');
    string = string.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = string;
    return template.firstElementChild;
}
async function liss(str, ...args) {
    const elem = html(str, ...args);
    return await (0,state__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
}
function lissSync(str, ...args) {
    const elem = html(str, ...args);
    return (0,state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
}
async function build(tagname, { params = {}, initialize = true, content = [], parent = undefined, id = undefined, classes = [], cssvars = {}, attrs = {}, data = {}, listeners = {} } = {}) {
    if (!initialize && parent === null) throw new Error("A parent must be given if initialize is false");
    let CustomClass = await customElements.whenDefined(tagname);
    let elem = new CustomClass(params);
    // Fix issue #2
    if (elem.tagName.toLowerCase() !== tagname) elem.setAttribute("is", tagname);
    if (id !== undefined) elem.id = id;
    if (classes.length > 0) elem.classList.add(...classes);
    for(let name in cssvars)elem.style.setProperty(`--${name}`, cssvars[name]);
    for(let name in attrs){
        let value = attrs[name];
        if (typeof value === "boolean") elem.toggleAttribute(name, value);
        else elem.setAttribute(name, value);
    }
    for(let name in data){
        let value = data[name];
        if (value === false) delete elem.dataset[name];
        else if (value === true) elem.dataset[name] = "";
        else elem.dataset[name] = value;
    }
    if (!Array.isArray(content)) content = [
        content
    ];
    elem.replaceChildren(...content);
    for(let name in listeners)elem.addEventListener(name, listeners[name]);
    if (parent !== undefined) parent.append(elem);
    if (!elem.isInit && initialize) return await _index__WEBPACK_IMPORTED_MODULE_1__["default"].initialize(elem);
    return await _index__WEBPACK_IMPORTED_MODULE_1__["default"].getLISS(elem);
}
_index__WEBPACK_IMPORTED_MODULE_1__["default"].build = build;
function buildSync(tagname, { params = {}, initialize = true, content = [], parent = undefined, id = undefined, classes = [], cssvars = {}, attrs = {}, data = {}, listeners = {} } = {}) {
    if (!initialize && parent === null) throw new Error("A parent must be given if initialize is false");
    let CustomClass = customElements.get(tagname);
    if (CustomClass === undefined) throw new Error(`${tagname} not defined`);
    let elem = new CustomClass(params);
    //TODO: factorize...
    // Fix issue #2
    if (elem.tagName.toLowerCase() !== tagname) elem.setAttribute("is", tagname);
    if (id !== undefined) elem.id = id;
    if (classes.length > 0) elem.classList.add(...classes);
    for(let name in cssvars)elem.style.setProperty(`--${name}`, cssvars[name]);
    for(let name in attrs){
        let value = attrs[name];
        if (typeof value === "boolean") elem.toggleAttribute(name, value);
        else elem.setAttribute(name, value);
    }
    for(let name in data){
        let value = data[name];
        if (value === false) delete elem.dataset[name];
        else if (value === true) elem.dataset[name] = "";
        else elem.dataset[name] = value;
    }
    if (!Array.isArray(content)) content = [
        content
    ];
    elem.replaceChildren(...content);
    for(let name in listeners)elem.addEventListener(name, listeners[name]);
    if (parent !== undefined) parent.append(elem);
    if (!elem.isInit && initialize) _index__WEBPACK_IMPORTED_MODULE_1__["default"].initializeSync(elem);
    return _index__WEBPACK_IMPORTED_MODULE_1__["default"].getLISSSync(elem);
}
_index__WEBPACK_IMPORTED_MODULE_1__["default"].buildSync = buildSync;


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
___WEBPACK_IMPORTED_MODULE_1__["default"].define('my-component-a', MyComponentA);
// =============================================================
class MyComponentB extends (0,___WEBPACK_IMPORTED_MODULE_1__["default"])({
    content: "liss``"
}) {
    constructor(){
        console.log("init");
        super();
    }
}
___WEBPACK_IMPORTED_MODULE_1__["default"].define('my-component-b', MyComponentB);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBSSxDQUFDbkYsTUFBTSxDQUFDa0YsVUFBVS9NLElBQUk7QUFDdkM7QUFFQThNO0FBRUE7SUFDSSxJQUFJRyxRQUFRLElBQUlOLGFBQWE3SyxJQUFJO0lBQ2pDdUYsU0FBUzJGLElBQUksQ0FBQ25GLE1BQU0sQ0FBQ29GO0lBRXJCTCxRQUFRTSxJQUFJLENBQUMsUUFBUWxCLCtDQUFRQSxDQUFDaUI7QUFDbEMsQ0FDQTtJQUNJLElBQUlBLFFBQVEsSUFBSU47SUFDaEJ0RixTQUFTMkYsSUFBSSxDQUFDbkYsTUFBTSxDQUFDb0YsTUFBTWpOLElBQUk7SUFFL0I0TSxRQUFRTSxJQUFJLENBQUMsUUFBUWxCLCtDQUFRQSxDQUFDaUIsTUFBTWpOLElBQUk7QUFDNUMsQzs7Ozs7Ozs7OztBQ3BEQTs7Ozs7Ozs7Ozs7OztBQ0FBLGlFQUFlLHFCQUF1QixvQ0FBb0MsRSIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2RlZmluZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvYnVpbGQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2J1aWxkL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguY3NzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIkxJU1NIb3N0XCI7XG5pbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIENTU19Tb3VyY2UsIEhUTUxfU291cmNlLCBMaWZlQ3ljbGUsIExJU1NfT3B0cywgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCJzdGF0ZVwiO1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuXG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4oe1xuXG4gICAgLy8gSlMgQmFzZVxuICAgIGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0IGFzIHVua25vd24gYXMgRXh0ZW5kc0N0ciwgLyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG4gICAgcGFyYW1zICAgICAgICAgICAgPSB7fSAgICAgYXMgdW5rbm93biBhcyBQYXJhbXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBkZXBzICAgPSBbXSxcbiAgICBsaWZlX2N5Y2xlID0gIExpZmVDeWNsZS5ERUZBVUxULFxuXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgaG9zdCAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRvYnNlcnZlZEF0dHJpYnV0ZXMgPSBbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0LlxuICAgIGF0dHJzID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgY29udGVudCxcbiAgICBjc3MsXG4gICAgc2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgPyBTaGFkb3dDZmcuQ0xPU0UgOiBTaGFkb3dDZmcuTk9ORVxufTogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PiA9IHt9KSB7XG5cbiAgICBpZiggc2hhZG93ICE9PSBTaGFkb3dDZmcuT1BFTiAmJiAhIGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgIGNvbnN0IGFsbF9kZXBzID0gWy4uLmRlcHNdO1xuXG4gICAgLy8gY29udGVudCBwcm9jZXNzaW5nXG4gICAgaWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGNvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIHtcbiAgICAgICAgXG5cdFx0bGV0IF9jb250ZW50OiBIVE1MX1NvdXJjZXx1bmRlZmluZWQgPSBjb250ZW50O1xuXHRcdGNvbnRlbnQgPSBudWxsIGFzIHVua25vd24gYXMgc3RyaW5nO1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQ7XG4gICAgICAgICAgICBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuXHRcdFx0XHRfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcblxuICAgICAgICAgICAgTElTU0Jhc2UuTElTU0NmZy5jb250ZW50ID0gcHJvY2Vzc19jb250ZW50KF9jb250ZW50KTtcbiAgICAgICAgfSkoKSApO1xuXG4gICAgfSBlbHNlIHtcblx0XHRjb250ZW50ID0gcHJvY2Vzc19jb250ZW50KGNvbnRlbnQpO1xuXHR9XG5cblx0Ly8gQ1NTIHByb2Nlc3Npbmdcblx0bGV0IHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gPSBbXTtcblx0aWYoIGNzcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0aWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiB0b2RvOiBMSVNTT3B0cyA9PiBzaG91bGQgbm90IGJlIGEgZ2VuZXJpYyA/XG5cdFx0XHRjc3MgPSBbY3NzXTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRzdHlsZXNoZWV0cyA9IGNzcy5tYXAoIChjOiBDU1NfU291cmNlLCBpZHg6IG51bWJlcikgPT4ge1xuXG5cdFx0XHRpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cblx0XHRcdFx0YWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRcdGMgPSBhd2FpdCBjO1xuXHRcdFx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuXHRcdFx0XHRcdFx0YyA9IGF3YWl0IGMudGV4dCgpO1xuXG5cdFx0XHRcdFx0c3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG5cdFx0XHRcdH0pKCkpO1xuXG5cdFx0XHRcdHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb2Nlc3NfY3NzKGMpO1xuXHRcdH0pO1xuXHR9XG5cblx0dHlwZSBMSVNTSG9zdDxUPiA9IGFueTsgLy9UT0RPLi4uXG5cdHR5cGUgTEhvc3QgPSBMSVNTSG9zdDxMSVNTQmFzZT47IC8vPC0gY29uZmlnIGluc3RlYWQgb2YgTElTU0Jhc2UgP1xuXG5cdGNsYXNzIExJU1NCYXNlIGV4dGVuZHMgX2V4dGVuZHMge1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApXG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCh7fSwgdGhpcyk7XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IGFueTsgLy8gcHJldmVudHMgaXNzdWUgIzEuLi5cblxuXHRcdC8vIExJU1MgQ29uZmlnc1xuXHRcdHN0YXRpYyByZWFkb25seSBMSVNTQ2ZnID0ge1xuXHRcdFx0aG9zdCxcblx0XHRcdGRlcHMsXG5cdFx0XHRhdHRycyxcblx0XHRcdHBhcmFtcyxcblx0XHRcdGNvbnRlbnQsXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG5cdFx0Z2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5zdGF0ZTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdC8vIGF0dHJzXG5cdFx0cHJvdGVjdGVkIGdldCBhdHRycygpOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgc2V0QXR0ckRlZmF1bHQoIGF0dHI6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuc2V0QXR0ckRlZmF1bHQoYXR0ciwgdmFsdWUpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25BdHRyQ2hhbmdlZChfbmFtZTogQXR0cnMsXG5cdFx0XHRfb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdF9uZXdWYWx1ZTogc3RyaW5nKTogdm9pZHxmYWxzZSB7fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0LlxuXHRcdHByb3RlY3RlZCBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogW0F0dHJzLCBzdHJpbmcsIHN0cmluZ10pIHtcblx0XHRcdHRoaXMub25BdHRyQ2hhbmdlZCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHQvLyBwYXJhbWV0ZXJzXG5cdFx0cHVibGljIGdldCBwYXJhbXMoKTogUmVhZG9ubHk8UGFyYW1zPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcztcblx0XHR9XG5cdFx0cHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPikge1xuXHRcdFx0T2JqZWN0LmFzc2lnbiggKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXG5cdFx0Ly8gRE9NXG5cdFx0cHVibGljIGdldCBpc0luRE9NKCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NQ29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01EaXNjb25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0XG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0luRE9NO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgc3RhdGljIF9Ib3N0OiBMSVNTSG9zdDxMSVNTQmFzZT47XG5cblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzKTtcblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQmFzZTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19jc3MoY3NzOiBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50KSB7XG5cblx0aWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcblx0XHRyZXR1cm4gY3NzO1xuXHRpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcblx0XHRyZXR1cm4gY3NzLnNoZWV0ITtcblxuXHRsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXHRpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG5cdFx0cmV0dXJuIHN0eWxlO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY29udGVudChjb250ZW50OiBzdHJpbmd8SFRNTFRlbXBsYXRlRWxlbWVudHx1bmRlZmluZWQpIHtcblxuICAgIGlmKGNvbnRlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGlmKGNvbnRlbnQgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KVxuICAgICAgICBjb250ZW50ID0gY29udGVudC5pbm5lckhUTUw7XG5cbiAgICBjb250ZW50ID0gY29udGVudC50cmltKCk7XG4gICAgaWYoIGNvbnRlbnQubGVuZ3RoID09PSAwIClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBjb250ZW50O1xufSIsImltcG9ydCB7IExJU1NTdGF0ZSwgdXBncmFkZVN5bmMgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IExJU1NfT3B0cywgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IENvbXBvc2VDb25zdHJ1Y3RvciwgaXNET01Db250ZW50TG9hZGVkLCB3YWl0RE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCBpZCA9IDA7XG5cbnR5cGUgaW5mZXJMSVNTPFQ+ID0gVCBleHRlbmRzIExJU1NCYXNlQ3N0cjxpbmZlciBBLCBpbmZlciBCLCBpbmZlciBDLCBpbmZlciBEPiA/IFtBLEIsQyxEXSA6IG5ldmVyO1xuXG4vL1RPRE86IHNoYWRvdyB1dGlscyA/XG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMSVNTSG9zdDxcbiAgICAgICAgICAgICAgICAgICAgICAgIFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KExpc3M6IFQpIHtcblx0Y29uc3Qge1xuXHRcdGhvc3QsXG5cdFx0YXR0cnMsXG5cdFx0Y29udGVudCxcblx0XHRzdHlsZXNoZWV0cyxcblx0XHRzaGFkb3csXG5cdH0gPSBMaXNzLkxJU1NDZmc7XG5cblx0dHlwZSBQID0gaW5mZXJMSVNTPFQ+O1xuXHQvL3R5cGUgRXh0ZW5kc0NzdHIgPSBQWzBdO1xuXHR0eXBlIFBhcmFtcyAgICAgID0gUFsxXTtcblx0dHlwZSBIb3N0Q3N0ciAgICA9IFBbMl07XG5cdHR5cGUgQXR0cnMgICAgICAgPSBQWzNdO1xuXG4gICAgdHlwZSBIb3N0ICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG4gICAgLy8gYXR0cnMgcHJveHlcblx0Y29uc3QgR0VUID0gU3ltYm9sKCdnZXQnKTtcblx0Y29uc3QgU0VUID0gU3ltYm9sKCdzZXQnKTtcblxuXHRjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmZyb21FbnRyaWVzKCBhdHRycy5tYXAobiA9PiBbbiwge1xuXG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCk6IHN0cmluZ3xudWxsICAgICAgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtHRVRdKG4pOyB9LFxuXHRcdHNldDogZnVuY3Rpb24odmFsdWU6IHN0cmluZ3xudWxsKSB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW1NFVF0obiwgdmFsdWUpOyB9XG5cdH1dKSApO1xuXG5cdGNsYXNzIEF0dHJpYnV0ZXMge1xuICAgICAgICBbeDogc3RyaW5nXTogc3RyaW5nfG51bGw7XG5cbiAgICAgICAgI2RhdGEgICAgIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNkZWZhdWx0cyA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjc2V0dGVyICAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZDtcblxuICAgICAgICBbR0VUXShuYW1lOiBBdHRycykge1xuICAgICAgICBcdHJldHVybiB0aGlzLiNkYXRhW25hbWVdID8/IHRoaXMuI2RlZmF1bHRzW25hbWVdID8/IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIFtTRVRdKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpe1xuICAgICAgICBcdHJldHVybiB0aGlzLiNzZXR0ZXIobmFtZSwgdmFsdWUpOyAvLyByZXF1aXJlZCB0byBnZXQgYSBjbGVhbiBvYmplY3Qgd2hlbiBkb2luZyB7Li4uYXR0cnN9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihkYXRhICAgIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG5cdFx0XHRcdFx0ZGVmYXVsdHM6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuICAgICAgICBcdFx0XHRzZXR0ZXIgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQpIHtcblxuICAgICAgICBcdHRoaXMuI2RhdGEgICAgID0gZGF0YTtcblx0XHRcdHRoaXMuI2RlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgICAgIFx0dGhpcy4jc2V0dGVyID0gc2V0dGVyO1xuXG4gICAgICAgIFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblx0fVxuXG5cdGNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcblxuICAgIGNvbnN0IHdhaXRSZWFkeSA9IG5ldyBQcm9taXNlPHZvaWQ+KCBhc3luYyAocikgPT4ge1xuXG4gICAgICAgIGF3YWl0IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKExpc3MuTElTU0NmZy5kZXBzKTtcblxuICAgICAgICBpc1JlYWR5ID0gdHJ1ZTtcblxuICAgICAgICByKCk7XG4gICAgfSk7XG5cbiAgICAvLyBObyBkZXBzIGFuZCBET00gYWxyZWFkeSBsb2FkZWQuXG4gICAgbGV0IGlzUmVhZHkgPSBMaXNzLkxJU1NDZmcuZGVwcy5sZW5ndGggPT0gMCAmJiBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcblxuXHRjb25zdCBwYXJhbXMgPSBMaXNzLkxJU1NDZmcucGFyYW1zOyAvL09iamVjdC5hc3NpZ24oe30sIExpc3MuTElTU0NmZy5wYXJhbXMsIF9wYXJhbXMpO1xuXG5cdC8vXG5cblx0Y29uc3Qgd2hlbkRlcHNSZXNvbHZlZCA9IFByb21pc2UuYWxsKExpc3MuTElTU0NmZy5kZXBzKTtcblx0bGV0IGlzRGVwc1Jlc29sdmVkID0gZmFsc2U7XG5cdCggYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IHdoZW5EZXBzUmVzb2x2ZWQ7XG5cdFx0aXNEZXBzUmVzb2x2ZWQgPSB0cnVlO1xuXHR9KSgpO1xuXG5cdGNsYXNzIExJU1NIb3N0QmFzZSBleHRlbmRzIChob3N0IGFzIG5ldyAoKSA9PiBIVE1MRWxlbWVudCkge1xuXG5cdFx0Ly8gYWRvcHQgc3RhdGUgaWYgYWxyZWFkeSBjcmVhdGVkLlxuXHRcdHJlYWRvbmx5IHN0YXRlID0gKHRoaXMgYXMgYW55KS5zdGF0ZSA/PyBuZXcgTElTU1N0YXRlKHRoaXMpO1xuXG5cdFx0Ly8gPT09PT09PT09PT09IERFUEVOREVOQ0lFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IHdoZW5EZXBzUmVzb2x2ZWQ7XG5cdFx0c3RhdGljIGdldCBpc0RlcHNSZXNvbHZlZCgpIHtcblx0XHRcdHJldHVybiBpc0RlcHNSZXNvbHZlZDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHN0YXRpYyBCYXNlID0gTGlzcztcblxuXHRcdCNiYXNlOiBhbnl8bnVsbCA9IG51bGw7XG5cdFx0Z2V0IGJhc2UoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZTtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNiYXNlICE9PSBudWxsO1xuXHRcdH1cblx0XHRyZWFkb25seSB3aGVuSW5pdGlhbGl6ZWQ6IFByb21pc2U8SW5zdGFuY2VUeXBlPFQ+Pjtcblx0XHQjd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyO1xuXG5cdFx0aW5pdGlhbGl6ZShwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPiA9IHt9KSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgYWxyZWFkeSBpbml0aWFsaXplZCEnKTtcbiAgICAgICAgICAgIGlmKCAhICggdGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzRGVwc1Jlc29sdmVkIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHR0aGlzLiNiYXNlID0gdGhpcy5pbml0KCk7XG5cblx0XHRcdGlmKCB0aGlzLmlzQ29ubmVjdGVkIClcblx0XHRcdFx0KHRoaXMuI2Jhc2UgYXMgYW55KS5vbkRPTUNvbm5lY3RlZCgpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRyZWFkb25seSAjcGFyYW1zOiBQYXJhbXMgPSBwYXJhbXM7XG5cblx0XHRnZXQgcGFyYW1zKCk6IFBhcmFtcyB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jcGFyYW1zO1xuXHRcdH1cblxuICAgICAgICBwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxMSVNTX09wdHNbXCJwYXJhbXNcIl0+KSB7XG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiB0aGlzLmJhc2UhLnVwZGF0ZVBhcmFtcyhwYXJhbXMpO1xuXG4gICAgICAgICAgICAvLyB3aWwgYmUgZ2l2ZW4gdG8gY29uc3RydWN0b3IuLi5cblx0XHRcdE9iamVjdC5hc3NpZ24oIHRoaXMuI3BhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXHRcdC8vID09PT09PT09PT09PT09IEF0dHJpYnV0ZXMgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2F0dHJzX2ZsYWcgPSBmYWxzZTtcblxuXHRcdCNhdHRyaWJ1dGVzICAgICAgICAgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cmlidXRlc0RlZmF1bHRzID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJzID0gbmV3IEF0dHJpYnV0ZXMoXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzLFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzLFxuXHRcdFx0KG5hbWU6IEF0dHJzLCB2YWx1ZTpzdHJpbmd8bnVsbCkgPT4ge1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gdHJ1ZTsgLy8gZG8gbm90IHRyaWdnZXIgb25BdHRyc0NoYW5nZWQuXG5cdFx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHQpIGFzIHVua25vd24gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cblx0XHRzZXRBdHRyRGVmYXVsdChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV07XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdGdldCBhdHRycygpOiBSZWFkb25seTxSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPj4ge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jYXR0cnM7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290fG51bGwgPSBudWxsO1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldCBoYXNTaGFkb3coKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gc2hhZG93ICE9PSAnbm9uZSc7XG5cdFx0fVxuXG5cdFx0LyoqKiBDU1MgKioqL1xuXG5cdFx0Z2V0IENTU1NlbGVjdG9yKCkge1xuXG5cdFx0XHRpZih0aGlzLmhhc1NoYWRvdyB8fCAhIHRoaXMuaGFzQXR0cmlidXRlKFwiaXNcIikgKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdOYW1lO1xuXG5cdFx0XHRyZXR1cm4gYCR7dGhpcy50YWdOYW1lfVtpcz1cIiR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJpc1wiKX1cIl1gO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IEltcGwgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Y29uc3RydWN0b3IocGFyYW1zOiB7fSwgYmFzZT86IEluc3RhbmNlVHlwZTxUPikge1xuXHRcdFx0c3VwZXIoKTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLiNwYXJhbXMsIHBhcmFtcyk7XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRpZiggYmFzZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuI2Jhc2UgPSBiYXNlO1xuXHRcdFx0XHR0aGlzLmluaXQoKTsgLy8gY2FsbCB0aGUgcmVzb2x2ZXJcblx0XHRcdH1cblxuXHRcdFx0aWYoIFwiX3doZW5VcGdyYWRlZFJlc29sdmVcIiBpbiB0aGlzKVxuXHRcdFx0XHQodGhpcy5fd2hlblVwZ3JhZGVkUmVzb2x2ZSBhcyBhbnkpKCk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PSBET00gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHRcdFxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHQodGhpcy5iYXNlISBhcyBhbnkpLm9uRE9NRGlzY29ubmVjdGVkKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApIHtcblx0XHRcdFx0dGhpcy5iYXNlIS5vbkRPTUNvbm5lY3RlZCgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuc3RhdGUuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCB0aGlzLnN0YXRlLmlzUmVhZHk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cdFx0XHRcblx0XHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGhpcyk7XG5cbiAgICAgICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi5cblx0XHRcdFxuXHRcdFx0Ly8gc2hhZG93XG5cdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcyBhcyB1bmtub3duIGFzIEhvc3Q7XG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpIHtcblx0XHRcdFx0dGhpcy4jY29udGVudCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiBzaGFkb3d9KTtcblxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGF0dHJzXG5cdFx0XHRmb3IobGV0IG9icyBvZiBhdHRycyEpXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbb2JzIGFzIEF0dHJzXSA9IHRoaXMuZ2V0QXR0cmlidXRlKG9icyk7XG5cblx0XHRcdC8vIGNzc1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MpO1xuXHRcdFx0aWYoIHN0eWxlc2hlZXRzLmxlbmd0aCApIHtcblxuXHRcdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goLi4uc3R5bGVzaGVldHMpO1xuXHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdGNvbnN0IGNzc3NlbGVjdG9yID0gdGhpcy5DU1NTZWxlY3RvcjtcblxuXHRcdFx0XHRcdC8vIGlmIG5vdCB5ZXQgaW5zZXJ0ZWQgOlxuXHRcdFx0XHRcdGlmKCAhIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpICkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuXHRcdFx0XHRcdFx0bGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuXG5cdFx0XHRcdFx0XHRmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG5cdFx0XHRcdFx0XHRcdFx0aHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuXHRcdFx0XHRcdFx0c3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cblx0XHRcdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcblxuXHRcdFx0XHRcdFx0YWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbnRlbnRcblx0XHRcdGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGxldCB0ZW1wbGF0ZV9lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdFx0XHQvL2xldCBzdHIgPSAoY29udGVudCBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gdGhpcy5nZXRBdHRyaWJ1dGUobWF0Y2gpPz8nJylcblx0ICAgIFx0XHRsZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKTtcblx0XHRcdFx0dGVtcGxhdGVfZWxlbS5pbm5lckhUTUwgPSBzdHI7XG5cdCAgICBcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoLi4udGVtcGxhdGVfZWxlbS5jb250ZW50LmNoaWxkTm9kZXMpO1xuXHQgICAgXHR9XG5cblx0ICAgIFx0Ly8gYnVpbGRcblxuXHQgICAgXHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdCAgICBcdGxldCBvYmogPSB0aGlzLmJhc2UgPT09IG51bGwgPyBuZXcgTGlzcygpIDogdGhpcy5iYXNlO1xuXG5cdFx0XHR0aGlzLiNiYXNlID0gb2JqIGFzIEluc3RhbmNlVHlwZTxUPjtcblxuXHRcdFx0Ly8gZGVmYXVsdCBzbG90XG5cdFx0XHRpZiggdGhpcy5oYXNTaGFkb3cgJiYgdGhpcy4jY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuYmFzZSk7XG5cblx0XHRcdHJldHVybiB0aGlzLmJhc2U7XG5cdFx0fVxuXG5cblxuXHRcdC8vIGF0dHJzXG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYXR0cnM7XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUgICAgOiBBdHRycyxcblx0XHRcdFx0XHRcdFx0XHQgb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHQgbmV3VmFsdWU6IHN0cmluZykge1xuXG5cdFx0XHRpZih0aGlzLiNhdHRyc19mbGFnKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gbmV3VmFsdWU7XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdGlmKCAodGhpcy5iYXNlISBhcyBhbnkpLm9uQXR0ckNoYW5nZWQobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0dGhpcy4jYXR0cnNbbmFtZV0gPSBvbGRWYWx1ZTsgLy8gcmV2ZXJ0IHRoZSBjaGFuZ2UuXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBMSVNTSG9zdEJhc2UgYXMgQ29tcG9zZUNvbnN0cnVjdG9yPHR5cGVvZiBMSVNTSG9zdEJhc2UsIHR5cGVvZiBob3N0Pjtcbn1cblxuXG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIGRlZmluZSA9PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vVE9ETyByZW1vdmUuLi5cblxuaW1wb3J0IExJU1MgZnJvbSBcIkxJU1NCYXNlXCI7XG5pbXBvcnQgeyBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi9MSVNTQmFzZVwiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgIDogdHlwZW9mIGRlZmluZTtcblx0XHR3aGVuRGVmaW5lZCAgICA6IHR5cGVvZiB3aGVuRGVmaW5lZDtcblx0XHR3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oXG5cdFx0XHRcdFx0XHRcdHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdENvbXBvbmVudENsYXNzOiBUKSB7XG5cdGNvbnN0IENsYXNzICA9IENvbXBvbmVudENsYXNzLkxJU1NDZmcuaG9zdDtcblx0bGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuXHRjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cdFxuXHRjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cblx0XHRcdFx0XHRcdFx0XHRcdCAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXHRcblx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG5cbmFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKHRhZ25hbWU6IHN0cmluZywgY2FsbGJhY2s/OiAoKSA9PiB2b2lkICkgOiBQcm9taXNlPHZvaWQ+IHtcblxuXHRhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcblxuXHRpZiggY2FsbGJhY2sgIT09IHVuZGVmaW5lZClcblx0XHRjYWxsYmFjaygpO1xuXG5cdHJldHVybjtcbn1cbmFzeW5jIGZ1bmN0aW9uIHdoZW5BbGxEZWZpbmVkKHRhZ25hbWVzOiByZWFkb25seSBzdHJpbmdbXSwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkICkgOiBQcm9taXNlPHZvaWQ+IHtcblxuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxuXG5cdGlmKCBjYWxsYmFjayAhPT0gdW5kZWZpbmVkKVxuXHRcdGNhbGxiYWNrKCk7XG5cbn1cblxuZnVuY3Rpb24gaXNEZWZpbmVkKG5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50ICk6IHN0cmluZyB7XG5cblx0Y29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcblx0aWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuXHRyZXR1cm4gbmFtZTtcbn1cblxuTElTUy5kZWZpbmUgICAgICAgICA9IGRlZmluZTtcbkxJU1Mud2hlbkRlZmluZWQgICAgPSB3aGVuRGVmaW5lZDtcbkxJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTsiLCJpbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2luZGV4XCI7XG5pbXBvcnQgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcInR5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiBUIHtcbiAgICBcbiAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN0cmluZyArPSBgJHthcmdzW2ldfWA7XG4gICAgICAgIHN0cmluZyArPSBgJHtzdHJbaSsxXX1gO1xuICAgICAgICAvL1RPRE86IG1vcmUgcHJlLXByb2Nlc3Nlc1xuICAgIH1cblxuICAgIC8vIHVzaW5nIHRlbXBsYXRlIHByZXZlbnRzIEN1c3RvbUVsZW1lbnRzIHVwZ3JhZGUuLi5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdHJpbmcgPSBzdHJpbmcudHJpbSgpOyAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nO1xuICAgIHJldHVybiB0ZW1wbGF0ZS5maXJzdEVsZW1lbnRDaGlsZCEgYXMgVDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn1cblxuXG50eXBlIEJVSUxEX09QVElPTlM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+ID0gUGFydGlhbDx7XG4gICAgcGFyYW1zICAgIDogUGFydGlhbDxpbmZlclBhcmFtczxUPj4sXG4gICAgY29udGVudFx0ICA6IHN0cmluZ3xOb2RlfHJlYWRvbmx5IE5vZGVbXSxcbiAgaWQgXHRcdCAgOiBzdHJpbmcsXG4gICAgY2xhc3Nlc1x0ICA6IHJlYWRvbmx5IHN0cmluZ1tdLFxuICAgIGNzc3ZhcnMgICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+LFxuICAgIGF0dHJzIFx0ICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG4gICAgZGF0YSBcdCAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGxpc3RlbmVycyA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIChldjogRXZlbnQpID0+IHZvaWQ+PlxufT4gJiAoe1xuICBpbml0aWFsaXplOiBmYWxzZSxcbiAgcGFyZW50OiBFbGVtZW50XG59fHtcbiAgaW5pdGlhbGl6ZT86IHRydWUsXG4gIHBhcmVudD86IEVsZW1lbnRcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBQcm9taXNlPENvbXBvbmVudHNbVF0+O1xuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywge1xucGFyYW1zICAgID0ge30sXG5pbml0aWFsaXplPSB0cnVlLFxuY29udGVudCAgID0gW10sXG5wYXJlbnQgICAgPSB1bmRlZmluZWQsXG5pZCBcdFx0ICA9IHVuZGVmaW5lZCxcbmNsYXNzZXMgICA9IFtdLFxuY3NzdmFycyAgID0ge30sXG5hdHRycyAgICAgPSB7fSxcbmRhdGEgXHQgID0ge30sXG5saXN0ZW5lcnMgPSB7fVxufTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogUHJvbWlzZTxUPiB7XG5cbmlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxudGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG5sZXQgQ3VzdG9tQ2xhc3MgPSBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcbmxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbi8vIEZpeCBpc3N1ZSAjMlxuaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbmVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbmlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbmVsZW0uaWQgPSBpZDtcblxuaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbmVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG5lbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbmxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG5lbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5lbHNlXG5lbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59XG5cbmZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbmxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG5pZiggdmFsdWUgPT09IGZhbHNlKVxuZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbmVsc2UgaWYodmFsdWUgPT09IHRydWUpXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuZWxzZVxuZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG59XG5cbmlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG5lbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG5pZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxucGFyZW50LmFwcGVuZChlbGVtKTtcblxuaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG5yZXR1cm4gYXdhaXQgTElTUy5pbml0aWFsaXplKGVsZW0pO1xuXG5yZXR1cm4gYXdhaXQgTElTUy5nZXRMSVNTKGVsZW0pO1xufVxuTElTUy5idWlsZCA9IGJ1aWxkO1xuXG5cbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBDb21wb25lbnRzW1RdO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogVDtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCB7XG5wYXJhbXMgICAgPSB7fSxcbmluaXRpYWxpemU9IHRydWUsXG5jb250ZW50ICAgPSBbXSxcbnBhcmVudCAgICA9IHVuZGVmaW5lZCxcbmlkIFx0XHQgID0gdW5kZWZpbmVkLFxuY2xhc3NlcyAgID0gW10sXG5jc3N2YXJzICAgPSB7fSxcbmF0dHJzICAgICA9IHt9LFxuZGF0YSBcdCAgPSB7fSxcbmxpc3RlbmVycyA9IHt9XG59OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBUIHtcblxuaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG50aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbmxldCBDdXN0b21DbGFzcyA9IGN1c3RvbUVsZW1lbnRzLmdldCh0YWduYW1lKTtcbmlmKEN1c3RvbUNsYXNzID09PSB1bmRlZmluZWQpXG50aHJvdyBuZXcgRXJyb3IoYCR7dGFnbmFtZX0gbm90IGRlZmluZWRgKTtcbmxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbi8vVE9ETzogZmFjdG9yaXplLi4uXG5cbi8vIEZpeCBpc3N1ZSAjMlxuaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbmVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbmlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbmVsZW0uaWQgPSBpZDtcblxuaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbmVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG5lbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbmxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG5lbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5lbHNlXG5lbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59XG5cbmZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbmxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG5pZiggdmFsdWUgPT09IGZhbHNlKVxuZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbmVsc2UgaWYodmFsdWUgPT09IHRydWUpXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuZWxzZVxuZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG59XG5cbmlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG5lbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG5pZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxucGFyZW50LmFwcGVuZChlbGVtKTtcblxuaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG5MSVNTLmluaXRpYWxpemVTeW5jKGVsZW0pO1xuXG5yZXR1cm4gTElTUy5nZXRMSVNTU3luYyhlbGVtKTtcbn1cbkxJU1MuYnVpbGRTeW5jID0gYnVpbGRTeW5jO1xuIiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuaW1wb3J0IFwiLi9kZWZpbmVcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBMSVNTOyIsImltcG9ydCB7IGdldE5hbWUgfSBmcm9tIFwiZGVmaW5lXCI7XG5pbXBvcnQgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcInR5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcInV0aWxzXCI7XG5cbmVudW0gU3RhdGUge1xuICAgIE5PTkUgPSAwLFxuXG4gICAgLy8gY2xhc3NcbiAgICBERUZJTkVEID0gMSA8PCAwLFxuICAgIFJFQURZICAgPSAxIDw8IDEsXG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIFVQR1JBREVEICAgID0gMSA8PCAyLFxuICAgIElOSVRJQUxJWkVEID0gMSA8PCAzLFxufVxuXG5leHBvcnQgY29uc3QgREVGSU5FRCAgICAgPSBTdGF0ZS5ERUZJTkVEO1xuZXhwb3J0IGNvbnN0IFJFQURZICAgICAgID0gU3RhdGUuUkVBRFk7XG5leHBvcnQgY29uc3QgVVBHUkFERUQgICAgPSBTdGF0ZS5VUEdSQURFRDtcbmV4cG9ydCBjb25zdCBJTklUSUFMSVpFRCA9IFN0YXRlLklOSVRJQUxJWkVEO1xuXG5leHBvcnQgY2xhc3MgTElTU1N0YXRlIHtcblxuICAgICNlbGVtOiBIVE1MRWxlbWVudHxudWxsO1xuXG4gICAgLy8gaWYgbnVsbCA6IGNsYXNzIHN0YXRlLCBlbHNlIGluc3RhbmNlIHN0YXRlXG4gICAgY29uc3RydWN0b3IoZWxlbTogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGwpIHtcbiAgICAgICAgdGhpcy4jZWxlbSA9IGVsZW07XG4gICAgfVxuXG4gICAgc3RhdGljIERFRklORUQgICAgID0gREVGSU5FRDtcbiAgICBzdGF0aWMgUkVBRFkgICAgICAgPSBSRUFEWTtcbiAgICBzdGF0aWMgVVBHUkFERUQgICAgPSBVUEdSQURFRDtcbiAgICBzdGF0aWMgSU5JVElBTElaRUQgPSBJTklUSUFMSVpFRDtcblxuICAgIGlzKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEICAgICAmJiAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgICAgICAgJiYgISB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCAgICAmJiAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEICYmICEgdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlbihzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgbGV0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8YW55Pj4oKTtcbiAgICBcbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5EZWZpbmVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuUmVhZHkoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5VcGdyYWRlZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkluaXRpYWxpemVkKCkgKTtcbiAgICBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBERUZJTkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzRGVmaW5lZCgpIHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKCBnZXROYW1lKHRoaXMuI2VsZW0pICkgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gUkVBRFkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICAgICAgaWYoICEgaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBIb3N0LmlzRGVwc1Jlc29sdmVkO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW5SZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpOyAvLyBjb3VsZCBiZSByZWFkeSBiZWZvcmUgZGVmaW5lZCwgYnV0IHdlbGwuLi5cblxuICAgICAgICBhd2FpdCB3aGVuRE9NQ29udGVudExvYWRlZDtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5EZXBzUmVzb2x2ZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vID09PT09PT09PT09PT09PT09PSBVUEdSQURFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1VwZ3JhZGVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICBjb25zdCBob3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuICAgICAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIGhvc3Q7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTtcbiAgICBcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBob3N0KVxuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICBcbiAgICAgICAgLy8gaDRja1xuICAgIFxuICAgICAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgXG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcblxuICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBJTklUSUFMSVpFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0luaXRpYWxpemVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIFwiaXNJbml0aWFsaXplZFwiIGluIGVsZW0gJiYgZWxlbS5pc0luaXRpYWxpemVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPigpIHtcbiAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuVXBncmFkZWQoKTtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZDtcblxuICAgICAgICByZXR1cm4gKGVsZW0gYXMgTElTU0hvc3Q8VD4pLmJhc2UgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gQ09OVkVSU0lPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICB2YWx1ZU9mKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBsZXQgc3RhdGU6IFN0YXRlID0gMDtcbiAgICBcbiAgICAgICAgaWYoIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IERFRklORUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgc3RhdGUgfD0gUkVBRFk7XG4gICAgICAgIGlmKCB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gVVBHUkFERUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gSU5JVElBTElaRUQ7XG4gICAgXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMudmFsdWVPZigpO1xuICAgICAgICBsZXQgaXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIkRFRklORURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJSRUFEWVwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIlVQR1JBREVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiSU5JVElBTElaRURcIik7XG4gICAgXG4gICAgICAgIHJldHVybiBpcy5qb2luKCd8Jyk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUoZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiggXCJzdGF0ZVwiIGluIGVsZW0pXG4gICAgICAgIHJldHVybiBlbGVtLnN0YXRlIGFzIExJU1NTdGF0ZTtcbiAgICBcbiAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5zdGF0ZSA9IG5ldyBMSVNTU3RhdGUoZWxlbSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PSBTdGF0ZSBtb2RpZmllcnMgKG1vdmU/KSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gR28gdG8gc3RhdGUgREVGSU5FRFxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPikge1xuXG4gICAgLy8gY291bGQgYmUgYmV0dGVyLlxuICAgIGlmKCBcIkJhc2VcIiBpbiBDb21wb25lbnRDbGFzcykge1xuICAgICAgICBDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzLkJhc2UgYXMgVDtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgQ2xhc3MgID0gQ29tcG9uZW50Q2xhc3MuTElTU0NmZy5ob3N0O1xuICAgIGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cbiAgICBjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuLy8gR28gdG8gc3RhdGUgVVBHUkFERURcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGdyYWRlPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuRGVmaW5lZCgpO1xuXG4gICAgcmV0dXJuIHVwZ3JhZGVTeW5jPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBncmFkZVN5bmM8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFQge1xuICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcbiAgICBcbiAgICBpZiggISBzdGF0ZS5pc0RlZmluZWQgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IGRlZmluZWQhJyk7XG5cbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIChlbGVtIGluc3RhbmNlb2YgSG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgZGlkbid0IHVwZ3JhZGUhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBUO1xufVxuXG4vLyBHbyB0byBzdGF0ZSBJTklUSUFMSVpFRFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZTxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufFRbXCJwYXJhbXNcIl0gPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UgKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuUmVhZHkoKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IHt9IDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZShwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogVCB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSlcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIHN0YXRlLmlzUmVhZHkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09IGV4dGVybmFsIFdIRU4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVwZ3JhZGUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuVXBncmFkZWQ8VD4oKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5Jbml0aWFsaXplZDxUPigpO1xufVxuXG4vLyBQcml2YXRlIGZvciBub3cuXG5cbmZ1bmN0aW9uIGdldEhvc3RDc3RyU3luYzxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgXG4gICAgY29uc3QgbmFtZSA9IGdldE5hbWUoZWxlbSk7XG4gICAgY29uc3QgaG9zdCA9IGN1c3RvbUVsZW1lbnRzLmdldCggbmFtZSApO1xuICAgIGlmKCBob3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfSBub3QgeWV0IGRlZmluZWQhYCk7XG4gICAgcmV0dXJuIGhvc3QgYXMgVDtcbn0iLCJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIkxJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50O1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnXG59O1xuXG4vL1RPRE86IGltcGxlbWVudFxuZXhwb3J0IGVudW0gTGlmZUN5Y2xlIHtcbiAgICBERUZBVUxUICAgICAgICAgICAgICAgICAgID0gMCxcblx0Ly8gbm90IGltcGxlbWVudGVkIHlldFxuICAgIElOSVRfQUZURVJfQ0hJTERSRU4gICAgICAgPSAxIDw8IDEsXG4gICAgSU5JVF9BRlRFUl9QQVJFTlQgICAgICAgICA9IDEgPDwgMixcbiAgICAvLyBxdWlkIHBhcmFtcy9hdHRycyA/XG4gICAgUkVDUkVBVEVfQUZURVJfQ09OTkVDVElPTiA9IDEgPDwgMywgLyogcmVxdWlyZXMgcmVidWlsZCBjb250ZW50ICsgZGVzdHJveS9kaXNwb3NlIHdoZW4gcmVtb3ZlZCBmcm9tIERPTSAqL1xuICAgIC8qIHNsZWVwIHdoZW4gZGlzY28gOiB5b3UgbmVlZCB0byBpbXBsZW1lbnQgaXQgeW91cnNlbGYgKi9cbn1cblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmcsXG4gICAgPiA9IHtcbiAgICAgICAgLy8gSlMgQmFzZVxuICAgICAgICBleHRlbmRzICAgOiBFeHRlbmRzQ3RyLFxuICAgICAgICBwYXJhbXMgICAgOiBQYXJhbXMsXG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGRlcHMgICAgICA6IHJlYWRvbmx5IFByb21pc2U8YW55PltdLFxuICAgICAgICBsaWZlX2N5Y2xlOiBMaWZlQ3ljbGUsIFxuXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0cixcbiAgICAgICAgYXR0cnMgIDogcmVhZG9ubHkgQXR0cnNbXSxcbiAgICAgICAgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiByZWFkb25seSBBdHRyc1tdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXRcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgY29udGVudD86IEhUTUxfU291cmNlLFxuICAgICAgICBjc3MgICAgIDogQ1NTX1NvdXJjZSB8IHJlYWRvbmx5IENTU19Tb3VyY2VbXSxcbiAgICAgICAgc2hhZG93ICA6IFNoYWRvd0NmZ1xufVxuXG4vLyBMSVNTQmFzZVxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZUNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBJbnN0YW5jZVR5cGU8TElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBUIGV4dGVuZHMgTElTU0Jhc2U8XG4gICAgICAgICAgICBpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgQixcbiAgICAgICAgICAgIGluZmVyIEMsXG4gICAgICAgICAgICBpbmZlciBEPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0Jhc2VDc3RyPEEsQixDLEQ+IDogbmV2ZXI7XG5cblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0Jhc2UgPyBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgSFRNTENMQVNTX1JFR0VYID0gIC9IVE1MKFxcdyspRWxlbWVudC87XG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cdFxuXHRsZXQgaHRtbHRhZyA9IEhUTUxDTEFTU19SRUdFWC5leGVjKENsYXNzLm5hbWUpIVsxXTtcblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IHR5cGVvZiBIVE1MRWxlbWVudCkge1xuXHRyZXR1cm4gQ0FOX0hBVkVfU0hBRE9XLmluY2x1ZGVzKCBfZWxlbWVudDJ0YWduYW1lKHRhZykgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn1cblxuZXhwb3J0IGNvbnN0IHdoZW5ET01Db250ZW50TG9hZGVkID0gd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn1cblxuLy8gZm9yIG1peGlucy5cbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlciIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjsiLCJcbmltcG9ydCB7IGh0bWwsIGxpc3MgfSBmcm9tICdoZWxwZXJzL2J1aWxkJztcbmltcG9ydCBMSVNTIGZyb20gJy4uLy4uLy4uLyc7XG5pbXBvcnQgeyBnZXRTdGF0ZSB9IGZyb20gJ3N0YXRlJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBNeUNvbXBvbmVudEEgZXh0ZW5kcyBMSVNTKCkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50LnJlcGxhY2VDaGlsZHJlbihodG1sYDxiPmh0bWxcXGBcXGAgOiBPSzwvYj5gKTtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lKCdteS1jb21wb25lbnQtYScsIE15Q29tcG9uZW50QSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY2xhc3MgTXlDb21wb25lbnRCIGV4dGVuZHMgTElTUyh7XG4gICAgY29udGVudDogXCJsaXNzYGBcIlxufSkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdFwiKTtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lKCdteS1jb21wb25lbnQtYicsIE15Q29tcG9uZW50Qik7XG5cbmFzeW5jIGZ1bmN0aW9uIGZvbygpIHtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IGF3YWl0IGxpc3NgPG15LWNvbXBvbmVudC1iPjwvbXktY29tcG9uZW50LWI+YDtcbiAgICBcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChjb21wb25lbnQuaG9zdCk7XG59XG5cbmZvbygpO1xuXG57XG4gICAgbGV0IGNvbXBvID0gbmV3IE15Q29tcG9uZW50Qi5Ib3N0KCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoY29tcG8pO1xuXG4gICAgY29uc29sZS53YXJuKFwiaG9zdFwiLCBnZXRTdGF0ZShjb21wbykgKTtcbn1cbntcbiAgICBsZXQgY29tcG8gPSBuZXcgTXlDb21wb25lbnRCKCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoY29tcG8uaG9zdCk7XG5cbiAgICBjb25zb2xlLndhcm4oXCJiYXNlXCIsIGdldFN0YXRlKGNvbXBvLmhvc3QpICk7XG59XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwicGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguaHRtbFwiOyJdLCJuYW1lcyI6WyJidWlsZExJU1NIb3N0IiwiTGlmZUN5Y2xlIiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzU2hhZG93U3VwcG9ydGVkIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJJTElTUyIsIkxJU1MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJwYXJhbXMiLCJkZXBzIiwibGlmZV9jeWNsZSIsIkRFRkFVTFQiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnQiLCJjc3MiLCJzaGFkb3ciLCJDTE9TRSIsIk5PTkUiLCJPUEVOIiwiRXJyb3IiLCJhbGxfZGVwcyIsIlByb21pc2UiLCJSZXNwb25zZSIsIl9jb250ZW50IiwicHVzaCIsInRleHQiLCJMSVNTQmFzZSIsIkxJU1NDZmciLCJwcm9jZXNzX2NvbnRlbnQiLCJzdHlsZXNoZWV0cyIsInVuZGVmaW5lZCIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImMiLCJpZHgiLCJwcm9jZXNzX2NzcyIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkhvc3QiLCJzdGF0ZSIsInNldEF0dHJEZWZhdWx0IiwiYXR0ciIsInZhbHVlIiwib25BdHRyQ2hhbmdlZCIsIl9uYW1lIiwiX29sZFZhbHVlIiwiX25ld1ZhbHVlIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwidXBkYXRlUGFyYW1zIiwiYXNzaWduIiwiaXNJbkRPTSIsImlzQ29ubmVjdGVkIiwib25ET01Db25uZWN0ZWQiLCJjb25uZWN0ZWRDYWxsYmFjayIsIm9uRE9NRGlzY29ubmVjdGVkIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJfSG9zdCIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiSFRNTFRlbXBsYXRlRWxlbWVudCIsImlubmVySFRNTCIsInRyaW0iLCJsZW5ndGgiLCJMSVNTU3RhdGUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImlkIiwic2hhcmVkQ1NTIiwiTGlzcyIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwid2FpdFJlYWR5IiwiciIsImFsbCIsImlzUmVhZHkiLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJMSVNTSG9zdEJhc2UiLCJCYXNlIiwiYmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwiaW5pdCIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiQ1NTU2VsZWN0b3IiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicHJvbWlzZSIsInJlc29sdmUiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJhdHRhY2hTaGFkb3ciLCJtb2RlIiwib2JzIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwiY3Nzc2VsZWN0b3IiLCJoYXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsInJlcGxhY2UiLCJoZWFkIiwiYXBwZW5kIiwiYWRkIiwidGVtcGxhdGVfZWxlbSIsInN0ciIsImNoaWxkTm9kZXMiLCJvYmoiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiZGVmaW5lIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiQ2xhc3MiLCJodG1sdGFnIiwiTElTU2NsYXNzIiwib3B0cyIsIndoZW5EZWZpbmVkIiwiY2FsbGJhY2siLCJ3aGVuQWxsRGVmaW5lZCIsInRhZ25hbWVzIiwidCIsImlzRGVmaW5lZCIsImdldE5hbWUiLCJlbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImluaXRpYWxpemVTeW5jIiwiaHRtbCIsInN0cmluZyIsImkiLCJ0ZW1wbGF0ZSIsImZpcnN0RWxlbWVudENoaWxkIiwibGlzcyIsImVsZW0iLCJsaXNzU3luYyIsImJ1aWxkIiwicGFyZW50IiwiY2xhc3NlcyIsImNzc3ZhcnMiLCJsaXN0ZW5lcnMiLCJDdXN0b21DbGFzcyIsImNsYXNzTGlzdCIsInNldFByb3BlcnR5IiwidG9nZ2xlQXR0cmlidXRlIiwiZGF0YXNldCIsInJlcGxhY2VDaGlsZHJlbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc0luaXQiLCJnZXRMSVNTIiwiYnVpbGRTeW5jIiwiZ2V0TElTU1N5bmMiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsIlN0YXRlIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsImlzIiwiaXNVcGdyYWRlZCIsIndoZW4iLCJwcm9taXNlcyIsIndoZW5SZWFkeSIsIndoZW5VcGdyYWRlZCIsImdldEhvc3RDc3RyU3luYyIsIl93aGVuVXBncmFkZWQiLCJ2YWx1ZU9mIiwidG9TdHJpbmciLCJqb2luIiwiZ2V0U3RhdGUiLCJzdHJpY3QiLCJ1cGdyYWRlU3luYyIsImZvcmNlIiwiSFRNTENMQVNTX1JFR0VYIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImV4ZWMiLCJDQU5fSEFWRV9TSEFET1ciLCJ0YWciLCJyZWFkeVN0YXRlIiwiTXlDb21wb25lbnRBIiwiTXlDb21wb25lbnRCIiwiY29uc29sZSIsImxvZyIsImZvbyIsImNvbXBvbmVudCIsImJvZHkiLCJjb21wbyIsIndhcm4iXSwic291cmNlUm9vdCI6IiJ9