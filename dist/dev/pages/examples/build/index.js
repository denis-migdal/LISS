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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixvQ0FBb0MsRSIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2RlZmluZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvYnVpbGQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2J1aWxkL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguY3NzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIkxJU1NIb3N0XCI7XG5pbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIENTU19Tb3VyY2UsIEhUTUxfU291cmNlLCBMaWZlQ3ljbGUsIExJU1NfT3B0cywgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCJzdGF0ZVwiO1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuXG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4oe1xuXG4gICAgLy8gSlMgQmFzZVxuICAgIGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0IGFzIHVua25vd24gYXMgRXh0ZW5kc0N0ciwgLyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG4gICAgcGFyYW1zICAgICAgICAgICAgPSB7fSAgICAgYXMgdW5rbm93biBhcyBQYXJhbXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBkZXBzICAgPSBbXSxcbiAgICBsaWZlX2N5Y2xlID0gIExpZmVDeWNsZS5ERUZBVUxULFxuXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgaG9zdCAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRvYnNlcnZlZEF0dHJpYnV0ZXMgPSBbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0LlxuICAgIGF0dHJzID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgY29udGVudCxcbiAgICBjc3MsXG4gICAgc2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgPyBTaGFkb3dDZmcuQ0xPU0UgOiBTaGFkb3dDZmcuTk9ORVxufTogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PiA9IHt9KSB7XG5cbiAgICBpZiggc2hhZG93ICE9PSBTaGFkb3dDZmcuT1BFTiAmJiAhIGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgIGNvbnN0IGFsbF9kZXBzID0gWy4uLmRlcHNdO1xuXG4gICAgLy8gY29udGVudCBwcm9jZXNzaW5nXG4gICAgaWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGNvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIHtcbiAgICAgICAgXG5cdFx0bGV0IF9jb250ZW50OiBIVE1MX1NvdXJjZXx1bmRlZmluZWQgPSBjb250ZW50O1xuXHRcdGNvbnRlbnQgPSBudWxsIGFzIHVua25vd24gYXMgc3RyaW5nO1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQ7XG4gICAgICAgICAgICBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuXHRcdFx0XHRfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcblxuICAgICAgICAgICAgTElTU0Jhc2UuTElTU0NmZy5jb250ZW50ID0gcHJvY2Vzc19jb250ZW50KF9jb250ZW50KTtcbiAgICAgICAgfSkoKSApO1xuXG4gICAgfSBlbHNlIHtcblx0XHRjb250ZW50ID0gcHJvY2Vzc19jb250ZW50KGNvbnRlbnQpO1xuXHR9XG5cblx0Ly8gQ1NTIHByb2Nlc3Npbmdcblx0bGV0IHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gPSBbXTtcblx0aWYoIGNzcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0aWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiB0b2RvOiBMSVNTT3B0cyA9PiBzaG91bGQgbm90IGJlIGEgZ2VuZXJpYyA/XG5cdFx0XHRjc3MgPSBbY3NzXTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRzdHlsZXNoZWV0cyA9IGNzcy5tYXAoIChjOiBDU1NfU291cmNlLCBpZHg6IG51bWJlcikgPT4ge1xuXG5cdFx0XHRpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cblx0XHRcdFx0YWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRcdGMgPSBhd2FpdCBjO1xuXHRcdFx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuXHRcdFx0XHRcdFx0YyA9IGF3YWl0IGMudGV4dCgpO1xuXG5cdFx0XHRcdFx0c3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG5cdFx0XHRcdH0pKCkpO1xuXG5cdFx0XHRcdHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb2Nlc3NfY3NzKGMpO1xuXHRcdH0pO1xuXHR9XG5cblx0dHlwZSBMSVNTSG9zdDxUPiA9IGFueTsgLy9UT0RPLi4uXG5cdHR5cGUgTEhvc3QgPSBMSVNTSG9zdDxMSVNTQmFzZT47IC8vPC0gY29uZmlnIGluc3RlYWQgb2YgTElTU0Jhc2UgP1xuXG5cdGNsYXNzIExJU1NCYXNlIGV4dGVuZHMgX2V4dGVuZHMge1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApXG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCh7fSwgdGhpcyk7XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IGFueTsgLy8gcHJldmVudHMgaXNzdWUgIzEuLi5cblxuXHRcdC8vIExJU1MgQ29uZmlnc1xuXHRcdHN0YXRpYyByZWFkb25seSBMSVNTQ2ZnID0ge1xuXHRcdFx0aG9zdCxcblx0XHRcdGRlcHMsXG5cdFx0XHRhdHRycyxcblx0XHRcdHBhcmFtcyxcblx0XHRcdGNvbnRlbnQsXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG5cdFx0Z2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5zdGF0ZTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdC8vIGF0dHJzXG5cdFx0cHJvdGVjdGVkIGdldCBhdHRycygpOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgc2V0QXR0ckRlZmF1bHQoIGF0dHI6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuc2V0QXR0ckRlZmF1bHQoYXR0ciwgdmFsdWUpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25BdHRyQ2hhbmdlZChfbmFtZTogQXR0cnMsXG5cdFx0XHRfb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdF9uZXdWYWx1ZTogc3RyaW5nKTogdm9pZHxmYWxzZSB7fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0LlxuXHRcdHByb3RlY3RlZCBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogW0F0dHJzLCBzdHJpbmcsIHN0cmluZ10pIHtcblx0XHRcdHRoaXMub25BdHRyQ2hhbmdlZCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHQvLyBwYXJhbWV0ZXJzXG5cdFx0cHVibGljIGdldCBwYXJhbXMoKTogUmVhZG9ubHk8UGFyYW1zPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcztcblx0XHR9XG5cdFx0cHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPikge1xuXHRcdFx0T2JqZWN0LmFzc2lnbiggKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXG5cdFx0Ly8gRE9NXG5cdFx0cHVibGljIGdldCBpc0luRE9NKCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5pc0luRE9NO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01Db25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTURpc2Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXRcblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmlzSW5ET007XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzdGF0aWMgX0hvc3Q6IExJU1NIb3N0PExJU1NCYXNlPjtcblxuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlOyAgICBcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19jc3MoY3NzOiBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50KSB7XG5cblx0aWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcblx0XHRyZXR1cm4gY3NzO1xuXHRpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcblx0XHRyZXR1cm4gY3NzLnNoZWV0ITtcblxuXHRsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXHRpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG5cdFx0cmV0dXJuIHN0eWxlO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY29udGVudChjb250ZW50OiBzdHJpbmd8SFRNTFRlbXBsYXRlRWxlbWVudHx1bmRlZmluZWQpIHtcblxuICAgIGlmKGNvbnRlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGlmKGNvbnRlbnQgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KVxuICAgICAgICBjb250ZW50ID0gY29udGVudC5pbm5lckhUTUw7XG5cbiAgICBjb250ZW50ID0gY29udGVudC50cmltKCk7XG4gICAgaWYoIGNvbnRlbnQubGVuZ3RoID09PSAwIClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBjb250ZW50O1xufSIsImltcG9ydCB7IExJU1NTdGF0ZSwgdXBncmFkZVN5bmMgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IExJU1NfT3B0cywgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzRE9NQ29udGVudExvYWRlZCwgd2FpdERPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgaWQgPSAwO1xuXG50eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlclxuXG50eXBlIGluZmVyTElTUzxUPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8aW5mZXIgQSwgaW5mZXIgQiwgaW5mZXIgQywgaW5mZXIgRD4gPyBbQSxCLEMsRF0gOiBuZXZlcjtcblxuLy9UT0RPOiBzaGFkb3cgdXRpbHMgP1xuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XG4gICAgICAgICAgICAgICAgICAgICAgICBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihMaXNzOiBUKSB7XG5cdGNvbnN0IHtcblx0XHRob3N0LFxuXHRcdGF0dHJzLFxuXHRcdGNvbnRlbnQsXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5MSVNTQ2ZnO1xuXG5cdHR5cGUgUCA9IGluZmVyTElTUzxUPjtcblx0Ly90eXBlIEV4dGVuZHNDc3RyID0gUFswXTtcblx0dHlwZSBQYXJhbXMgICAgICA9IFBbMV07XG5cdHR5cGUgSG9zdENzdHIgICAgPSBQWzJdO1xuXHR0eXBlIEF0dHJzICAgICAgID0gUFszXTtcblxuICAgIHR5cGUgSG9zdCAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIC8vIGF0dHJzIHByb3h5XG5cdGNvbnN0IEdFVCA9IFN5bWJvbCgnZ2V0Jyk7XG5cdGNvbnN0IFNFVCA9IFN5bWJvbCgnc2V0Jyk7XG5cblx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5mcm9tRW50cmllcyggYXR0cnMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHRjb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCB3YWl0UmVhZHkgPSBuZXcgUHJvbWlzZTx2b2lkPiggYXN5bmMgKHIpID0+IHtcblxuICAgICAgICBhd2FpdCB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG5cbiAgICAgICAgcigpO1xuICAgIH0pO1xuXG4gICAgLy8gTm8gZGVwcyBhbmQgRE9NIGFscmVhZHkgbG9hZGVkLlxuICAgIGxldCBpc1JlYWR5ID0gTGlzcy5MSVNTQ2ZnLmRlcHMubGVuZ3RoID09IDAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cblx0Y29uc3QgcGFyYW1zID0gTGlzcy5MSVNTQ2ZnLnBhcmFtczsgLy9PYmplY3QuYXNzaWduKHt9LCBMaXNzLkxJU1NDZmcucGFyYW1zLCBfcGFyYW1zKTtcblxuXHQvL1xuXG5cdGNvbnN0IHdoZW5EZXBzUmVzb2x2ZWQgPSBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cdGxldCBpc0RlcHNSZXNvbHZlZCA9IGZhbHNlO1xuXHQoIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdGlzRGVwc1Jlc29sdmVkID0gdHJ1ZTtcblx0fSkoKTtcblxuXHRjbGFzcyBMSVNTSG9zdEJhc2UgZXh0ZW5kcyAoaG9zdCBhcyBuZXcgKCkgPT4gSFRNTEVsZW1lbnQpIHtcblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gaXNEZXBzUmVzb2x2ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0Y29uc3QgYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdChiYXNlIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2UgPSBiYXNlO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHJlYWRvbmx5ICNwYXJhbXM6IFBhcmFtcyA9IHBhcmFtcztcblxuXHRcdGdldCBwYXJhbXMoKTogUGFyYW1zIHtcblx0XHRcdHJldHVybiB0aGlzLiNwYXJhbXM7XG5cdFx0fVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPExJU1NfT3B0c1tcInBhcmFtc1wiXT4pIHtcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHRoaXMuYmFzZSEudXBkYXRlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIC8vIHdpbCBiZSBnaXZlbiB0byBjb25zdHJ1Y3Rvci4uLlxuXHRcdFx0T2JqZWN0LmFzc2lnbiggdGhpcy4jcGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cdFx0Ly8gPT09PT09PT09PT09PT0gQXR0cmlidXRlcyA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjYXR0cnNfZmxhZyA9IGZhbHNlO1xuXG5cdFx0I2F0dHJpYnV0ZXMgICAgICAgICA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRyaWJ1dGVzRGVmYXVsdHMgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cnMgPSBuZXcgQXR0cmlidXRlcyhcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXMsXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHMsXG5cdFx0XHQobmFtZTogQXR0cnMsIHZhbHVlOnN0cmluZ3xudWxsKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSB0cnVlOyAvLyBkbyBub3QgdHJpZ2dlciBvbkF0dHJzQ2hhbmdlZC5cblx0XHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdCkgYXMgdW5rbm93biBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblxuXHRcdHNldEF0dHJEZWZhdWx0KG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0ZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Z2V0IGF0dHJzKCk6IFJlYWRvbmx5PFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+PiB7XG5cblx0XHRcdHJldHVybiB0aGlzLiNhdHRycztcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKHBhcmFtczoge30sIGJhc2U/OiBJbnN0YW5jZVR5cGU8VD4pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdGlmKCBiYXNlICE9PSB1bmRlZmluZWQpe1xuXHRcdFx0XHR0aGlzLiNiYXNlID0gYmFzZTtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmVzb2x2ZSh0aGlzLmJhc2UpO1xuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdCh0aGlzLmJhc2UhIGFzIGFueSkub25ET01EaXNjb25uZWN0ZWQoKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmJhc2UhLm9uRE9NQ29ubmVjdGVkKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5zdGF0ZS5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCB0aGlzLnN0YXRlLmlzUmVhZHk7XG5cblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXHRcdFx0XG5cdFx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHRoaXMpO1xuXG4gICAgICAgICAgICAvL1RPRE86IHdhaXQgcGFyZW50cy9jaGlsZHJlbiBkZXBlbmRpbmcgb24gb3B0aW9uLi4uXG5cdFx0XHRcblx0XHRcdC8vIHNoYWRvd1xuXHRcdFx0dGhpcy4jY29udGVudCA9IHRoaXMgYXMgdW5rbm93biBhcyBIb3N0O1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKSB7XG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogc2hhZG93fSk7XG5cblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhdHRyc1xuXHRcdFx0Zm9yKGxldCBvYnMgb2YgYXR0cnMhKVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW29icyBhcyBBdHRyc10gPSB0aGlzLmdldEF0dHJpYnV0ZShvYnMpO1xuXG5cdFx0XHQvLyBjc3Ncblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTKTtcblx0XHRcdGlmKCBzdHlsZXNoZWV0cy5sZW5ndGggKSB7XG5cblx0XHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKC4uLnN0eWxlc2hlZXRzKTtcblx0XHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0XHRjb25zdCBjc3NzZWxlY3RvciA9IHRoaXMuQ1NTU2VsZWN0b3I7XG5cblx0XHRcdFx0XHQvLyBpZiBub3QgeWV0IGluc2VydGVkIDpcblx0XHRcdFx0XHRpZiggISBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0bGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuXHRcdFx0XHRcdFx0c3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cblx0XHRcdFx0XHRcdGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0Zm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuXHRcdFx0XHRcdFx0XHRcdGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cblx0XHRcdFx0XHRcdHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG5cblx0XHRcdFx0XHRcdGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb250ZW50XG5cdFx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRsZXQgdGVtcGxhdGVfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRcdFx0Ly9sZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IHRoaXMuZ2V0QXR0cmlidXRlKG1hdGNoKT8/JycpXG5cdCAgICBcdFx0bGV0IHN0ciA9IChjb250ZW50IGFzIHN0cmluZyk7XG5cdFx0XHRcdHRlbXBsYXRlX2VsZW0uaW5uZXJIVE1MID0gc3RyO1xuXHQgICAgXHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKC4uLnRlbXBsYXRlX2VsZW0uY29udGVudC5jaGlsZE5vZGVzKTtcblx0ICAgIFx0fVxuXG5cdCAgICBcdC8vIGJ1aWxkXG5cblx0ICAgIFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHQgICAgXHRsZXQgb2JqID0gdGhpcy5iYXNlID09PSBudWxsID8gbmV3IExpc3MoKSA6IHRoaXMuYmFzZTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmJhc2UpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlO1xuXHRcdH1cblxuXHRcdC8qKiogY29udGVudCAqKiovXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyBhdHRyc1xuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGF0dHJzO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lICAgIDogQXR0cnMsXG5cdFx0XHRcdFx0XHRcdFx0IG9sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdFx0IG5ld1ZhbHVlOiBzdHJpbmcpIHtcblxuXHRcdFx0aWYodGhpcy4jYXR0cnNfZmxhZykge1xuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IG5ld1ZhbHVlO1xuXHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRpZiggKHRoaXMuYmFzZSEgYXMgYW55KS5vbkF0dHJDaGFuZ2VkKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzW25hbWVdID0gb2xkVmFsdWU7IC8vIHJldmVydCB0aGUgY2hhbmdlLlxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3RCYXNlIGFzIENvbXBvc2VDb25zdHJ1Y3Rvcjx0eXBlb2YgTElTU0hvc3RCYXNlLCB0eXBlb2YgaG9zdD47XG59XG5cblxuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBkZWZpbmUgPT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vL1RPRE8gcmVtb3ZlLi4uXG5cbmltcG9ydCBMSVNTIGZyb20gXCJMSVNTQmFzZVwiO1xuaW1wb3J0IHsgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4vTElTU0Jhc2VcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0d2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuXHRcdFx0XHRcdFx0XHR0YWduYW1lICAgICAgIDogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRDb21wb25lbnRDbGFzczogVCkge1xuXHRjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG5cdGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cblx0Y29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXHRcblx0Y29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG5cdFx0XHRcdFx0XHRcdFx0XHQgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblx0XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuXG5hc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZCh0YWduYW1lOiBzdHJpbmcsIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG5cblx0aWYoIGNhbGxiYWNrICE9PSB1bmRlZmluZWQpXG5cdFx0Y2FsbGJhY2soKTtcblxuXHRyZXR1cm47XG59XG5hc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10sIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgUHJvbWlzZS5hbGwoIHRhZ25hbWVzLm1hcCggdCA9PiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0KSApIClcblxuXHRpZiggY2FsbGJhY2sgIT09IHVuZGVmaW5lZClcblx0XHRjYWxsYmFjaygpO1xuXG59XG5cbmZ1bmN0aW9uIGlzRGVmaW5lZChuYW1lOiBzdHJpbmcpIHtcblx0cmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChuYW1lKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudCApOiBzdHJpbmcge1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9pbmRleFwiO1xuaW1wb3J0IHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCJ0eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3RyaW5nID0gc3RyaW5nLnRyaW0oKTsgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZztcbiAgICByZXR1cm4gdGVtcGxhdGUuZmlyc3RFbGVtZW50Q2hpbGQhIGFzIFQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oZWxlbSk7XG59XG5cblxudHlwZSBCVUlMRF9PUFRJT05TPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+PiA9IFBhcnRpYWw8e1xuICAgIHBhcmFtcyAgICA6IFBhcnRpYWw8aW5mZXJQYXJhbXM8VD4+LFxuICAgIGNvbnRlbnRcdCAgOiBzdHJpbmd8Tm9kZXxyZWFkb25seSBOb2RlW10sXG4gIGlkIFx0XHQgIDogc3RyaW5nLFxuICAgIGNsYXNzZXNcdCAgOiByZWFkb25seSBzdHJpbmdbXSxcbiAgICBjc3N2YXJzICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PixcbiAgICBhdHRycyBcdCAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGRhdGEgXHQgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBsaXN0ZW5lcnMgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCAoZXY6IEV2ZW50KSA9PiB2b2lkPj5cbn0+ICYgKHtcbiAgaW5pdGlhbGl6ZTogZmFsc2UsXG4gIHBhcmVudDogRWxlbWVudFxufXx7XG4gIGluaXRpYWxpemU/OiB0cnVlLFxuICBwYXJlbnQ/OiBFbGVtZW50XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogUHJvbWlzZTxDb21wb25lbnRzW1RdPjtcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIHtcbnBhcmFtcyAgICA9IHt9LFxuaW5pdGlhbGl6ZT0gdHJ1ZSxcbmNvbnRlbnQgICA9IFtdLFxucGFyZW50ICAgID0gdW5kZWZpbmVkLFxuaWQgXHRcdCAgPSB1bmRlZmluZWQsXG5jbGFzc2VzICAgPSBbXSxcbmNzc3ZhcnMgICA9IHt9LFxuYXR0cnMgICAgID0ge30sXG5kYXRhIFx0ICA9IHt9LFxubGlzdGVuZXJzID0ge31cbn06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFByb21pc2U8VD4ge1xuXG5pZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbnRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxubGV0IEN1c3RvbUNsYXNzID0gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG5sZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4vLyBGaXggaXNzdWUgIzJcbmlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG5lbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG5pZiggaWQgIT09IHVuZGVmaW5lZCApXG5lbGVtLmlkID0gaWQ7XG5cbmlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG5lbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbmZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbmZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG5sZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbmlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuZWxzZVxuZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufVxuXG5mb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG5sZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuaWYoIHZhbHVlID09PSBmYWxzZSlcbmRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG5lbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbmVsc2VcbmVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xufVxuXG5pZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbmNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbmZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG5lbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbnBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbmlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxucmV0dXJuIGF3YWl0IExJU1MuaW5pdGlhbGl6ZShlbGVtKTtcblxucmV0dXJuIGF3YWl0IExJU1MuZ2V0TElTUyhlbGVtKTtcbn1cbkxJU1MuYnVpbGQgPSBidWlsZDtcblxuXG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogQ29tcG9uZW50c1tUXTtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFQ7XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywge1xucGFyYW1zICAgID0ge30sXG5pbml0aWFsaXplPSB0cnVlLFxuY29udGVudCAgID0gW10sXG5wYXJlbnQgICAgPSB1bmRlZmluZWQsXG5pZCBcdFx0ICA9IHVuZGVmaW5lZCxcbmNsYXNzZXMgICA9IFtdLFxuY3NzdmFycyAgID0ge30sXG5hdHRycyAgICAgPSB7fSxcbmRhdGEgXHQgID0ge30sXG5saXN0ZW5lcnMgPSB7fVxufTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogVCB7XG5cbmlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxudGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG5sZXQgQ3VzdG9tQ2xhc3MgPSBjdXN0b21FbGVtZW50cy5nZXQodGFnbmFtZSk7XG5pZihDdXN0b21DbGFzcyA9PT0gdW5kZWZpbmVkKVxudGhyb3cgbmV3IEVycm9yKGAke3RhZ25hbWV9IG5vdCBkZWZpbmVkYCk7XG5sZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4vL1RPRE86IGZhY3Rvcml6ZS4uLlxuXG4vLyBGaXggaXNzdWUgIzJcbmlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG5lbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG5pZiggaWQgIT09IHVuZGVmaW5lZCApXG5lbGVtLmlkID0gaWQ7XG5cbmlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG5lbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbmZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbmZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG5sZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbmlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuZWxzZVxuZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufVxuXG5mb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG5sZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuaWYoIHZhbHVlID09PSBmYWxzZSlcbmRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG5lbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbmVsc2VcbmVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xufVxuXG5pZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbmNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbmZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG5lbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbnBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbmlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxuTElTUy5pbml0aWFsaXplU3luYyhlbGVtKTtcblxucmV0dXJuIExJU1MuZ2V0TElTU1N5bmMoZWxlbSk7XG59XG5MSVNTLmJ1aWxkU3luYyA9IGJ1aWxkU3luYztcbiIsImltcG9ydCBMSVNTIGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmltcG9ydCBcIi4vZGVmaW5lXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgTElTUzsiLCJpbXBvcnQgeyBnZXROYW1lIH0gZnJvbSBcImRlZmluZVwiO1xuaW1wb3J0IHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCJ0eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCJ1dGlsc1wiO1xuXG5lbnVtIFN0YXRlIHtcbiAgICBOT05FID0gMCxcblxuICAgIC8vIGNsYXNzXG4gICAgREVGSU5FRCA9IDEgPDwgMCxcbiAgICBSRUFEWSAgID0gMSA8PCAxLFxuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBVUEdSQURFRCAgICA9IDEgPDwgMixcbiAgICBJTklUSUFMSVpFRCA9IDEgPDwgMyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRklORUQgICAgID0gU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IFN0YXRlLlJFQURZO1xuZXhwb3J0IGNvbnN0IFVQR1JBREVEICAgID0gU3RhdGUuVVBHUkFERUQ7XG5leHBvcnQgY29uc3QgSU5JVElBTElaRUQgPSBTdGF0ZS5JTklUSUFMSVpFRDtcblxuZXhwb3J0IGNsYXNzIExJU1NTdGF0ZSB7XG5cbiAgICAjZWxlbTogSFRNTEVsZW1lbnR8bnVsbDtcblxuICAgIC8vIGlmIG51bGwgOiBjbGFzcyBzdGF0ZSwgZWxzZSBpbnN0YW5jZSBzdGF0ZVxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEhUTUxFbGVtZW50fG51bGwgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuI2VsZW0gPSBlbGVtO1xuICAgIH1cblxuICAgIHN0YXRpYyBERUZJTkVEICAgICA9IERFRklORUQ7XG4gICAgc3RhdGljIFJFQURZICAgICAgID0gUkVBRFk7XG4gICAgc3RhdGljIFVQR1JBREVEICAgID0gVVBHUkFERUQ7XG4gICAgc3RhdGljIElOSVRJQUxJWkVEID0gSU5JVElBTElaRUQ7XG5cbiAgICBpcyhzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCAgICAgJiYgISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZICAgICAgICYmICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgICAgJiYgISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCAmJiAhIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW4oc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGxldCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPGFueT4+KCk7XG4gICAgXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuRGVmaW5lZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblJlYWR5KCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuVXBncmFkZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5Jbml0aWFsaXplZCgpICk7XG4gICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gREVGSU5FRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0RlZmluZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFJFQURZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgICAgIGlmKCAhIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gSG9zdC5pc0RlcHNSZXNvbHZlZDtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTsgLy8gY291bGQgYmUgcmVhZHkgYmVmb3JlIGRlZmluZWQsIGJ1dCB3ZWxsLi4uXG5cbiAgICAgICAgYXdhaXQgd2hlbkRPTUNvbnRlbnRMb2FkZWQ7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuRGVwc1Jlc29sdmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gVVBHUkFERUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNVcGdyYWRlZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgY29uc3QgaG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcbiAgICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBob3N0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7XG4gICAgXG4gICAgICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgaG9zdClcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgXG4gICAgICAgIC8vIGg0Y2tcbiAgICBcbiAgICAgICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgICAgIFxuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWQgICAgICAgID0gcHJvbWlzZTtcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgXG4gICAgICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gSU5JVElBTElaRUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNJbml0aWFsaXplZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiBcImlzSW5pdGlhbGl6ZWRcIiBpbiBlbGVtICYmIGVsZW0uaXNJbml0aWFsaXplZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oKSB7XG4gICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlblVwZ3JhZGVkKCk7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQ7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtIGFzIExJU1NIb3N0PFQ+KS5iYXNlIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IENPTlZFUlNJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFsdWVPZigpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgbGV0IHN0YXRlOiBTdGF0ZSA9IDA7XG4gICAgXG4gICAgICAgIGlmKCB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBERUZJTkVEO1xuICAgICAgICBpZiggdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHN0YXRlIHw9IFJFQURZO1xuICAgICAgICBpZiggdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IFVQR1JBREVEO1xuICAgICAgICBpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IElOSVRJQUxJWkVEO1xuICAgIFxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IGlzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJERUZJTkVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBpcy5wdXNoKFwiUkVBRFlcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJVUEdSQURFRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIklOSVRJQUxJWkVEXCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gaXMuam9pbignfCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYoIFwic3RhdGVcIiBpbiBlbGVtKVxuICAgICAgICByZXR1cm4gZWxlbS5zdGF0ZSBhcyBMSVNTU3RhdGU7XG4gICAgXG4gICAgcmV0dXJuIChlbGVtIGFzIGFueSkuc3RhdGUgPSBuZXcgTElTU1N0YXRlKGVsZW0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gU3RhdGUgbW9kaWZpZXJzIChtb3ZlPykgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdvIHRvIHN0YXRlIERFRklORURcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD4pIHtcblxuICAgIC8vIGNvdWxkIGJlIGJldHRlci5cbiAgICBpZiggXCJCYXNlXCIgaW4gQ29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgQ29tcG9uZW50Q2xhc3MgPSBDb21wb25lbnRDbGFzcy5CYXNlIGFzIFQ7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IENsYXNzICA9IENvbXBvbmVudENsYXNzLkxJU1NDZmcuaG9zdDtcbiAgICBsZXQgaHRtbHRhZyAgPSBfZWxlbWVudDJ0YWduYW1lKENsYXNzKT8/dW5kZWZpbmVkO1xuXG4gICAgY29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXG4gICAgY29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG4gICAgICAgICAgICAgICAgOiB7ZXh0ZW5kczogaHRtbHRhZ307XG5cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgTElTU2NsYXNzLCBvcHRzKTtcbn07XG5cbi8vIEdvIHRvIHN0YXRlIFVQR1JBREVEXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBncmFkZTxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlbkRlZmluZWQoKTtcblxuICAgIHJldHVybiB1cGdyYWRlU3luYzxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZ3JhZGVTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBUIHtcbiAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG4gICAgXG4gICAgaWYoICEgc3RhdGUuaXNEZWZpbmVkIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IG5vdCBkZWZpbmVkIScpO1xuXG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICBpZiggISAoZWxlbSBpbnN0YW5jZW9mIEhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGRpZG4ndCB1cGdyYWRlIWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgVDtcbn1cblxuLy8gR28gdG8gc3RhdGUgSU5JVElBTElaRURcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemU8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdCA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlblJlYWR5KCk7XG5cbiAgICBob3N0LmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPik6IFQge1xuXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgaG9zdC5zdGF0ZS5pc1JlYWR5IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGhvc3QuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PSBleHRlcm5hbCBXSEVOID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCB1cGdyYWRlKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlblVwZ3JhZGVkPFQ+KCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cblxuLy8gUHJpdmF0ZSBmb3Igbm93LlxuXG5mdW5jdGlvbiBnZXRIb3N0Q3N0clN5bmM8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIFxuICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKGVsZW0pO1xuICAgIGNvbnN0IGhvc3QgPSBjdXN0b21FbGVtZW50cy5nZXQoIG5hbWUgKTtcbiAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gbm90IHlldCBkZWZpbmVkIWApO1xuICAgIHJldHVybiBob3N0IGFzIFQ7XG59IiwiaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCJMSVNTSG9zdFwiO1xuaW1wb3J0IHsgTElTUyB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3Mge31cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7IG5ldyguLi5hcmdzOmFueVtdKTogVH07XG5cbmV4cG9ydCB0eXBlIENTU19SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MU3R5bGVFbGVtZW50fENTU1N0eWxlU2hlZXQ7XG5leHBvcnQgdHlwZSBDU1NfU291cmNlICAgPSBDU1NfUmVzb3VyY2UgfCBQcm9taXNlPENTU19SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIEhUTUxfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFRlbXBsYXRlRWxlbWVudDtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJ1xufTtcblxuLy9UT0RPOiBpbXBsZW1lbnRcbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nLFxuICAgID4gPSB7XG4gICAgICAgIC8vIEpTIEJhc2VcbiAgICAgICAgZXh0ZW5kcyAgIDogRXh0ZW5kc0N0cixcbiAgICAgICAgcGFyYW1zICAgIDogUGFyYW1zLFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBkZXBzICAgICAgOiByZWFkb25seSBQcm9taXNlPGFueT5bXSxcbiAgICAgICAgbGlmZV9jeWNsZTogTGlmZUN5Y2xlLCBcblxuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsXG4gICAgICAgIGF0dHJzICA6IHJlYWRvbmx5IEF0dHJzW10sXG4gICAgICAgIG9ic2VydmVkQXR0cmlidXRlczogcmVhZG9ubHkgQXR0cnNbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0XG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGNvbnRlbnQ/OiBIVE1MX1NvdXJjZSxcbiAgICAgICAgY3NzICAgICA6IENTU19Tb3VyY2UgfCByZWFkb25seSBDU1NfU291cmNlW10sXG4gICAgICAgIHNoYWRvdyAgOiBTaGFkb3dDZmdcbn1cblxuLy8gTElTU0Jhc2VcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2VDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2U8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gSW5zdGFuY2VUeXBlPExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gVCBleHRlbmRzIExJU1NCYXNlPFxuICAgICAgICAgICAgaW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEIsXG4gICAgICAgICAgICBpbmZlciBDLFxuICAgICAgICAgICAgaW5mZXIgRD4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NCYXNlQ3N0cjxBLEIsQyxEPiA6IG5ldmVyO1xuXG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NCYXNlID8gTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IEhUTUxDTEFTU19SRUdFWCA9ICAvSFRNTChcXHcrKUVsZW1lbnQvO1xuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXHRcblx0bGV0IGh0bWx0YWcgPSBIVE1MQ0xBU1NfUkVHRVguZXhlYyhDbGFzcy5uYW1lKSFbMV07XG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIlxuaW1wb3J0IHsgaHRtbCwgbGlzcyB9IGZyb20gJ2hlbHBlcnMvYnVpbGQnO1xuaW1wb3J0IExJU1MgZnJvbSAnLi4vLi4vLi4vJztcbmltcG9ydCB7IGdldFN0YXRlIH0gZnJvbSAnc3RhdGUnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNsYXNzIE15Q29tcG9uZW50QSBleHRlbmRzIExJU1MoKSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQucmVwbGFjZUNoaWxkcmVuKGh0bWxgPGI+aHRtbFxcYFxcYCA6IE9LPC9iPmApO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUoJ215LWNvbXBvbmVudC1hJywgTXlDb21wb25lbnRBKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBNeUNvbXBvbmVudEIgZXh0ZW5kcyBMSVNTKHtcbiAgICBjb250ZW50OiBcImxpc3NgYFwiXG59KSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbml0XCIpO1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUoJ215LWNvbXBvbmVudC1iJywgTXlDb21wb25lbnRCKTtcblxuYXN5bmMgZnVuY3Rpb24gZm9vKCkge1xuXG4gICAgY29uc3QgY29tcG9uZW50ID0gYXdhaXQgbGlzc2A8bXktY29tcG9uZW50LWI+PC9teS1jb21wb25lbnQtYj5gO1xuICAgIFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGNvbXBvbmVudC5ob3N0KTtcbn1cblxuZm9vKCk7XG5cbntcbiAgICBsZXQgY29tcG8gPSBuZXcgTXlDb21wb25lbnRCLkhvc3QoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChjb21wbyk7XG5cbiAgICBjb25zb2xlLndhcm4oXCJob3N0XCIsIGdldFN0YXRlKGNvbXBvKSApO1xufVxue1xuICAgIGxldCBjb21wbyA9IG5ldyBNeUNvbXBvbmVudEIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChjb21wby5ob3N0KTtcblxuICAgIGNvbnNvbGUud2FybihcImJhc2VcIiwgZ2V0U3RhdGUoY29tcG8uaG9zdCkgKTtcbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImV4cG9ydCBkZWZhdWx0IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJwYWdlcy9leGFtcGxlcy9idWlsZC9pbmRleC5odG1sXCI7Il0sIm5hbWVzIjpbImJ1aWxkTElTU0hvc3QiLCJMaWZlQ3ljbGUiLCJTaGFkb3dDZmciLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIklMSVNTIiwiTElTUyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsInBhcmFtcyIsImRlcHMiLCJsaWZlX2N5Y2xlIiwiREVGQVVMVCIsImhvc3QiLCJIVE1MRWxlbWVudCIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJzIiwiY29udGVudCIsImNzcyIsInNoYWRvdyIsIkNMT1NFIiwiTk9ORSIsIk9QRU4iLCJFcnJvciIsImFsbF9kZXBzIiwiUHJvbWlzZSIsIlJlc3BvbnNlIiwiX2NvbnRlbnQiLCJwdXNoIiwidGV4dCIsIkxJU1NCYXNlIiwiTElTU0NmZyIsInByb2Nlc3NfY29udGVudCIsInN0eWxlc2hlZXRzIiwidW5kZWZpbmVkIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiYyIsImlkeCIsInByb2Nlc3NfY3NzIiwiY29uc3RydWN0b3IiLCJhcmdzIiwiSG9zdCIsInN0YXRlIiwic2V0QXR0ckRlZmF1bHQiLCJhdHRyIiwidmFsdWUiLCJvbkF0dHJDaGFuZ2VkIiwiX25hbWUiLCJfb2xkVmFsdWUiLCJfbmV3VmFsdWUiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJ1cGRhdGVQYXJhbXMiLCJhc3NpZ24iLCJpc0luRE9NIiwib25ET01Db25uZWN0ZWQiLCJjb25uZWN0ZWRDYWxsYmFjayIsIm9uRE9NRGlzY29ubmVjdGVkIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJpc0Nvbm5lY3RlZCIsIl9Ib3N0IiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwidHJpbSIsImxlbmd0aCIsIkxJU1NTdGF0ZSIsImlzRE9NQ29udGVudExvYWRlZCIsIndhaXRET01Db250ZW50TG9hZGVkIiwiaWQiLCJzaGFyZWRDU1MiLCJMaXNzIiwiR0VUIiwiU3ltYm9sIiwiU0VUIiwicHJvcGVydGllcyIsImZyb21FbnRyaWVzIiwibiIsImVudW1lcmFibGUiLCJnZXQiLCJzZXQiLCJBdHRyaWJ1dGVzIiwibmFtZSIsImRhdGEiLCJkZWZhdWx0cyIsInNldHRlciIsImRlZmluZVByb3BlcnRpZXMiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJ3YWl0UmVhZHkiLCJyIiwiYWxsIiwiaXNSZWFkeSIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkxJU1NIb3N0QmFzZSIsIkJhc2UiLCJiYXNlIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJpbml0IiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwicHJvbWlzZSIsInJlc29sdmUiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJhdHRhY2hTaGFkb3ciLCJtb2RlIiwib2JzIiwiZ2V0QXR0cmlidXRlIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwiY3Nzc2VsZWN0b3IiLCJDU1NTZWxlY3RvciIsImhhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwicmVwbGFjZSIsImhlYWQiLCJhcHBlbmQiLCJhZGQiLCJ0ZW1wbGF0ZV9lbGVtIiwic3RyIiwiY2hpbGROb2RlcyIsIm9iaiIsImhhc1NoYWRvdyIsImdldFBhcnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJDbGFzcyIsImh0bWx0YWciLCJMSVNTY2xhc3MiLCJvcHRzIiwid2hlbkRlZmluZWQiLCJjYWxsYmFjayIsIndoZW5BbGxEZWZpbmVkIiwidGFnbmFtZXMiLCJ0IiwiaXNEZWZpbmVkIiwiZ2V0TmFtZSIsImVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiaW5pdGlhbGl6ZVN5bmMiLCJodG1sIiwic3RyaW5nIiwiaSIsInRlbXBsYXRlIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJsaXNzIiwiZWxlbSIsImxpc3NTeW5jIiwiYnVpbGQiLCJwYXJlbnQiLCJjbGFzc2VzIiwiY3NzdmFycyIsImxpc3RlbmVycyIsIkN1c3RvbUNsYXNzIiwiY2xhc3NMaXN0Iiwic2V0UHJvcGVydHkiLCJ0b2dnbGVBdHRyaWJ1dGUiLCJkYXRhc2V0IiwicmVwbGFjZUNoaWxkcmVuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImlzSW5pdCIsImdldExJU1MiLCJidWlsZFN5bmMiLCJnZXRMSVNTU3luYyIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiU3RhdGUiLCJERUZJTkVEIiwiUkVBRFkiLCJVUEdSQURFRCIsIklOSVRJQUxJWkVEIiwiaXMiLCJpc1VwZ3JhZGVkIiwid2hlbiIsInByb21pc2VzIiwid2hlblJlYWR5Iiwid2hlblVwZ3JhZGVkIiwiZ2V0SG9zdENzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJnZXRTdGF0ZSIsInN0cmljdCIsInVwZ3JhZGVTeW5jIiwiZm9yY2UiLCJIVE1MQ0xBU1NfUkVHRVgiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiZXhlYyIsIkNBTl9IQVZFX1NIQURPVyIsInRhZyIsInJlYWR5U3RhdGUiLCJNeUNvbXBvbmVudEEiLCJNeUNvbXBvbmVudEIiLCJjb25zb2xlIiwibG9nIiwiZm9vIiwiY29tcG9uZW50IiwiYm9keSIsImNvbXBvIiwid2FybiJdLCJzb3VyY2VSb290IjoiIn0=