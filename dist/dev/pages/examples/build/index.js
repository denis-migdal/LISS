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
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


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
        await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.waitDOMContentLoaded)();
        await Promise.all(Liss.LISSCfg.deps);
        isReady = true;
        r();
    });
    // No deps and DOM already loaded.
    let isReady = Liss.LISSCfg.deps.length == 0 && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isDOMContentLoaded)();
    const params = Liss.LISSCfg.params; //Object.assign({}, Liss.LISSCfg.params, _params);
    //
    const whenDepsResolved = Promise.all(Liss.LISSCfg.deps);
    let isDepsResolved = false;
    (async ()=>{
        await whenDepsResolved;
        isDepsResolved = true;
    })();
    class LISSHostBase extends host {
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
            (0,_LISSBase__WEBPACK_IMPORTED_MODULE_0__.setCstrHost)(this);
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
    const host = await (0,state__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
    return host.LISSSync; //TODO better ?
}
function lissSync(str, ...args) {
    const elem = html(str, ...args);
    const host = (0,state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
    return host.LISSSync; //TODO better ?
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
/* harmony export */   isState: () => (/* binding */ isState),
/* harmony export */   state2str: () => (/* binding */ state2str),
/* harmony export */   upgrade: () => (/* binding */ upgrade),
/* harmony export */   upgradeSync: () => (/* binding */ upgradeSync),
/* harmony export */   whenState: () => (/* binding */ whenState)
/* harmony export */ });
/* harmony import */ var define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! define */ "./src/define.ts");
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! utils */ "./src/utils.ts");


var LISSState;
(function(LISSState) {
    LISSState[LISSState["NONE"] = 0] = "NONE";
    // class
    LISSState[LISSState["DEFINED"] = 1] = "DEFINED";
    LISSState[LISSState["READY"] = 2] = "READY";
    // instance
    LISSState[LISSState["UPGRADED"] = 4] = "UPGRADED";
    LISSState[LISSState["INITIALIZED"] = 8] = "INITIALIZED";
})(LISSState || (LISSState = {}));
const DEFINED = 1;
const READY = 2;
const UPGRADED = 4;
const INITIALIZED = 8;
//TODO: add to LISS...
//TODO: add to API ?
//TODO: HTMLElement or Host class or Base class or X.
function state2str(state) {
    let is = new Array();
    if (state & DEFINED) is.push("DEFINED");
    if (state & READY) is.push("READY");
    if (state & UPGRADED) is.push("UPGRADED");
    if (state & INITIALIZED) is.push("INITIALIZED");
    return is.join('|');
}
function getState(elem) {
    let state = 0;
    if (isDefined(elem)) state |= DEFINED;
    if (isReady(elem)) state |= READY;
    if (isUpgraded(elem)) state |= UPGRADED;
    if (isInitialized(elem)) state |= INITIALIZED;
    return state;
}
function isState(elem, state) {
    if (state & DEFINED && !isDefined(elem)) return false;
    if (state & READY && !isReady(elem)) return false;
    if (state & UPGRADED && !isUpgraded(elem)) return false;
    if (state & INITIALIZED && !isInitialized(elem)) return false;
    return true;
}
async function whenState(elem, state) {
    let promises = new Array();
    if (state & DEFINED) promises.push(whenDefined(elem));
    if (state & READY) promises.push(whenReady(elem));
    if (state & UPGRADED) promises.push(whenUpgraded(elem));
    if (state & INITIALIZED) promises.push(whenInitialized(elem));
    await Promise.all(promises);
}
// ================== DEFINED ==============================
// go to state define.
function define(tagname, ComponentClass) {
    const Class = ComponentClass.LISSCfg.host;
    let htmltag = (0,utils__WEBPACK_IMPORTED_MODULE_1__._element2tagname)(Class) ?? undefined;
    const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
    customElements.define(tagname, LISSclass, opts);
}
function isDefined(elem) {
    return customElements.get((0,define__WEBPACK_IMPORTED_MODULE_0__.getName)(elem)) !== undefined;
}
async function whenDefined(elem) {
    await customElements.whenDefined((0,define__WEBPACK_IMPORTED_MODULE_0__.getName)(elem));
}
// ================== getHostCstr from HTMLElement ==========================
async function getHostCstr(elem) {
    await whenDefined(elem);
    const name = (0,define__WEBPACK_IMPORTED_MODULE_0__.getName)(elem);
    return customElements.get(name); //TODO registry function ?
}
function getHostCstrSync(elem) {
    const name = (0,define__WEBPACK_IMPORTED_MODULE_0__.getName)(elem);
    const host = customElements.get(name);
    if (host === undefined) throw new Error(`${name} not yet defined!`);
    return host;
}
// ================== getHost from HTMLElement ==========================
async function getHost(elem) {
    await whenUpgraded(elem);
    return elem;
}
function getHostSync(elem) {
    if (!isUpgraded(elem)) throw new Error(`Element not upgraded!`);
    return elem;
}
// ================== READY ==============================
function isReady(elem) {
    if (!isDefined(elem)) return false;
    const Host = getHostCstrSync(elem);
    if (!(0,utils__WEBPACK_IMPORTED_MODULE_1__.isDOMContentLoaded)()) return false;
    return Host.isDepsResolved;
}
async function whenReady(elem) {
    const host = await getHostCstr(elem);
    await utils__WEBPACK_IMPORTED_MODULE_1__.whenDOMContentLoaded;
    await host.whenDepsResolved;
}
// ================== UPGRADED ==============================
async function upgrade(elem) {
    await whenDefined(elem);
    return upgradeSync(elem);
}
function upgradeSync(elem) {
    if (!isDefined(elem)) throw new Error('Element not defined!');
    customElements.upgrade(elem);
    const Host = getHostCstrSync(elem);
    if (!(elem instanceof Host)) throw new Error(`Element didn't upgrade!`);
    return elem;
}
function isUpgraded(elem) {
    if (!isDefined(elem)) return false;
    const host = getHostCstrSync(elem);
    return elem instanceof host;
}
async function whenUpgraded(elem) {
    await whenDefined(elem);
    const host = await getHostCstr(elem);
    if (elem instanceof host) return;
    // h4ck
    if ("_whenUpgraded" in elem) {
        await elem._whenUpgraded;
        return;
    }
    const { promise, resolve } = Promise.withResolvers();
    elem._whenUpgraded = promise;
    elem._whenUpgradedResolve = resolve;
    await promise;
}
// ================== INITIALIZED ==============================
async function initialize(elem) {
    const host = await upgrade(elem);
    await whenReady(elem);
    host.initialize();
    return host;
}
function initializeSync(elem) {
    const host = upgradeSync(elem);
    if (!isReady(elem)) throw new Error("Element not ready !");
    host.initialize();
    return host;
}
function isInitialized(elem) {
    if (!isUpgraded(elem)) return false;
    const host = getHostSync(elem);
    return host.isInitialized;
}
async function whenInitialized(elem) {
    await (await getHost(elem)).whenInitialized;
    return;
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
    console.warn("host", (0,state__WEBPACK_IMPORTED_MODULE_2__.state2str)((0,state__WEBPACK_IMPORTED_MODULE_2__.getState)(compo)));
}{
    let compo = new MyComponentB();
    document.body.append(compo.host);
    console.warn("base", (0,state__WEBPACK_IMPORTED_MODULE_2__.state2str)((0,state__WEBPACK_IMPORTED_MODULE_2__.getState)(compo.host)));
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFRQSxDQUFDMkI7QUFDNUMsQ0FDQTtJQUNJLElBQUlBLFFBQVEsSUFBSUw7SUFDaEJuRyxTQUFTdUcsSUFBSSxDQUFDOUYsTUFBTSxDQUFDK0YsTUFBTXBOLElBQUk7SUFFL0I0RixRQUFRQyxJQUFJLENBQUMsUUFBUXdGLGdEQUFTQSxDQUFDSSwrQ0FBUUEsQ0FBQzJCLE1BQU1wTixJQUFJO0FBQ3RELEM7Ozs7Ozs7Ozs7QUNyREE7Ozs7Ozs7Ozs7Ozs7QUNBQSxpRUFBZSxxQkFBdUIsb0NBQW9DLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NCYXNlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0hvc3QudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9kZWZpbmUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9zdGF0ZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9wYWdlcy9leGFtcGxlcy9idWlsZC9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2J1aWxkL2luZGV4LmNzcyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2J1aWxkL2luZGV4Lmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCJMSVNTSG9zdFwiO1xuaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBDU1NfU291cmNlLCBIVE1MX1NvdXJjZSwgTGlmZUN5Y2xlLCBMSVNTX09wdHMsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc1NoYWRvd1N1cHBvcnRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUztcblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG5cdC8vIEhUTUwgQmFzZVxuXHRIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuXHRBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXIsIC8vc3RyaW5nLFxuPih7XG5cbiAgICAvLyBKUyBCYXNlXG4gICAgZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3RyLCAvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cbiAgICBwYXJhbXMgICAgICAgICAgICA9IHt9ICAgICBhcyB1bmtub3duIGFzIFBhcmFtcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGRlcHMgICA9IFtdLFxuICAgIGxpZmVfY3ljbGUgPSAgTGlmZUN5Y2xlLkRFRkFVTFQsXG5cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBob3N0ICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdG9ic2VydmVkQXR0cmlidXRlcyA9IFtdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG4gICAgYXR0cnMgPSBvYnNlcnZlZEF0dHJpYnV0ZXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBjb250ZW50LFxuICAgIGNzcyxcbiAgICBzaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSA/IFNoYWRvd0NmZy5DTE9TRSA6IFNoYWRvd0NmZy5OT05FXG59OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+ID0ge30pIHtcblxuICAgIGlmKCBzaGFkb3cgIT09IFNoYWRvd0NmZy5PUEVOICYmICEgaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgY29uc3QgYWxsX2RlcHMgPSBbLi4uZGVwc107XG5cbiAgICAvLyBjb250ZW50IHByb2Nlc3NpbmdcbiAgICBpZiggY29udGVudCBpbnN0YW5jZW9mIFByb21pc2UgfHwgY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkge1xuICAgICAgICBcblx0XHRsZXQgX2NvbnRlbnQ6IEhUTUxfU291cmNlfHVuZGVmaW5lZCA9IGNvbnRlbnQ7XG5cdFx0Y29udGVudCA9IG51bGwgYXMgdW5rbm93biBhcyBzdHJpbmc7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudDtcbiAgICAgICAgICAgIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG5cdFx0XHRcdF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuXG4gICAgICAgICAgICBMSVNTQmFzZS5MSVNTQ2ZnLmNvbnRlbnQgPSBwcm9jZXNzX2NvbnRlbnQoX2NvbnRlbnQpO1xuICAgICAgICB9KSgpICk7XG5cbiAgICB9IGVsc2Uge1xuXHRcdGNvbnRlbnQgPSBwcm9jZXNzX2NvbnRlbnQoY29udGVudCk7XG5cdH1cblxuXHQvLyBDU1MgcHJvY2Vzc2luZ1xuXHRsZXQgc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXSA9IFtdO1xuXHRpZiggY3NzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuXHRcdFx0Ly8gQHRzLWlnbm9yZSA6IHRvZG86IExJU1NPcHRzID0+IHNob3VsZCBub3QgYmUgYSBnZW5lcmljID9cblx0XHRcdGNzcyA9IFtjc3NdO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHN0eWxlc2hlZXRzID0gY3NzLm1hcCggKGM6IENTU19Tb3VyY2UsIGlkeDogbnVtYmVyKSA9PiB7XG5cblx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuXHRcdFx0XHRhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdFx0YyA9IGF3YWl0IGM7XG5cdFx0XHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG5cdFx0XHRcdFx0XHRjID0gYXdhaXQgYy50ZXh0KCk7XG5cblx0XHRcdFx0XHRzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cblx0XHRcdFx0fSkoKSk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvY2Vzc19jc3MoYyk7XG5cdFx0fSk7XG5cdH1cblxuXHR0eXBlIExJU1NIb3N0PFQ+ID0gYW55OyAvL1RPRE8uLi5cblx0dHlwZSBMSG9zdCA9IExJU1NIb3N0PExJU1NCYXNlPjsgLy88LSBjb25maWcgaW5zdGVhZCBvZiBMSVNTQmFzZSA/XG5cblx0Y2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBfZXh0ZW5kcyB7XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsIClcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KHt9LCB0aGlzKTtcblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogYW55OyAvLyBwcmV2ZW50cyBpc3N1ZSAjMS4uLlxuXG5cdFx0Ly8gTElTUyBDb25maWdzXG5cdFx0c3RhdGljIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudCxcblx0XHRcdHN0eWxlc2hlZXRzLFxuXHRcdFx0c2hhZG93LFxuXHRcdH07XG5cblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdC8vIGF0dHJzXG5cdFx0cHJvdGVjdGVkIGdldCBhdHRycygpOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgc2V0QXR0ckRlZmF1bHQoIGF0dHI6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuc2V0QXR0ckRlZmF1bHQoYXR0ciwgdmFsdWUpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25BdHRyQ2hhbmdlZChfbmFtZTogQXR0cnMsXG5cdFx0XHRfb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdF9uZXdWYWx1ZTogc3RyaW5nKTogdm9pZHxmYWxzZSB7fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0LlxuXHRcdHByb3RlY3RlZCBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogW0F0dHJzLCBzdHJpbmcsIHN0cmluZ10pIHtcblx0XHRcdHRoaXMub25BdHRyQ2hhbmdlZCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHQvLyBwYXJhbWV0ZXJzXG5cdFx0cHVibGljIGdldCBwYXJhbXMoKTogUmVhZG9ubHk8UGFyYW1zPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcztcblx0XHR9XG5cdFx0cHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPikge1xuXHRcdFx0T2JqZWN0LmFzc2lnbiggKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXG5cdFx0Ly8gRE9NXG5cdFx0cHVibGljIGdldCBpc0luRE9NKCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5pc0luRE9NO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01Db25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTURpc2Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXRcblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmlzSW5ET007XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzdGF0aWMgX0hvc3Q6IExJU1NIb3N0PExJU1NCYXNlPjtcblxuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlOyAgICBcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19jc3MoY3NzOiBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50KSB7XG5cblx0aWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcblx0XHRyZXR1cm4gY3NzO1xuXHRpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcblx0XHRyZXR1cm4gY3NzLnNoZWV0ITtcblxuXHRsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXHRpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG5cdFx0cmV0dXJuIHN0eWxlO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY29udGVudChjb250ZW50OiBzdHJpbmd8SFRNTFRlbXBsYXRlRWxlbWVudHx1bmRlZmluZWQpIHtcblxuICAgIGlmKGNvbnRlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGlmKGNvbnRlbnQgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KVxuICAgICAgICBjb250ZW50ID0gY29udGVudC5pbm5lckhUTUw7XG5cbiAgICBjb250ZW50ID0gY29udGVudC50cmltKCk7XG4gICAgaWYoIGNvbnRlbnQubGVuZ3RoID09PSAwIClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBjb250ZW50O1xufSIsImltcG9ydCB7IHVwZ3JhZGVTeW5jIH0gZnJvbSBcInN0YXRlXCI7XG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5pbXBvcnQgeyBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBpc0RPTUNvbnRlbnRMb2FkZWQsIHdhaXRET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IGlkID0gMDtcblxudHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXJcblxudHlwZSBpbmZlckxJU1M8VD4gPSBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPGluZmVyIEEsIGluZmVyIEIsIGluZmVyIEMsIGluZmVyIEQ+ID8gW0EsQixDLERdIDogbmV2ZXI7XG5cbi8vVE9ETzogc2hhZG93IHV0aWxzID9cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFxuICAgICAgICAgICAgICAgICAgICAgICAgVCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oTGlzczogVCkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRycyxcblx0XHRjb250ZW50LFxuXHRcdHN0eWxlc2hlZXRzLFxuXHRcdHNoYWRvdyxcblx0fSA9IExpc3MuTElTU0NmZztcblxuXHR0eXBlIFAgPSBpbmZlckxJU1M8VD47XG5cdC8vdHlwZSBFeHRlbmRzQ3N0ciA9IFBbMF07XG5cdHR5cGUgUGFyYW1zICAgICAgPSBQWzFdO1xuXHR0eXBlIEhvc3RDc3RyICAgID0gUFsyXTtcblx0dHlwZSBBdHRycyAgICAgICA9IFBbM107XG5cbiAgICB0eXBlIEhvc3QgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICAvLyBhdHRycyBwcm94eVxuXHRjb25zdCBHRVQgPSBTeW1ib2woJ2dldCcpO1xuXHRjb25zdCBTRVQgPSBTeW1ib2woJ3NldCcpO1xuXG5cdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoIGF0dHJzLm1hcChuID0+IFtuLCB7XG5cblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKTogc3RyaW5nfG51bGwgICAgICB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW0dFVF0obik7IH0sXG5cdFx0c2V0OiBmdW5jdGlvbih2YWx1ZTogc3RyaW5nfG51bGwpIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbU0VUXShuLCB2YWx1ZSk7IH1cblx0fV0pICk7XG5cblx0Y2xhc3MgQXR0cmlidXRlcyB7XG4gICAgICAgIFt4OiBzdHJpbmddOiBzdHJpbmd8bnVsbDtcblxuICAgICAgICAjZGF0YSAgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI2RlZmF1bHRzIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNzZXR0ZXIgICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkO1xuXG4gICAgICAgIFtHRVRdKG5hbWU6IEF0dHJzKSB7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI2RhdGFbbmFtZV0gPz8gdGhpcy4jZGVmYXVsdHNbbmFtZV0gPz8gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgW1NFVF0obmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCl7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI3NldHRlcihuYW1lLCB2YWx1ZSk7IC8vIHJlcXVpcmVkIHRvIGdldCBhIGNsZWFuIG9iamVjdCB3aGVuIGRvaW5nIHsuLi5hdHRyc31cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGEgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcblx0XHRcdFx0XHRkZWZhdWx0czogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG4gICAgICAgIFx0XHRcdHNldHRlciAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZCkge1xuXG4gICAgICAgIFx0dGhpcy4jZGF0YSAgICAgPSBkYXRhO1xuXHRcdFx0dGhpcy4jZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgXHR0aGlzLiNzZXR0ZXIgPSBzZXR0ZXI7XG5cbiAgICAgICAgXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXHR9XG5cblx0Y29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3Qgd2FpdFJlYWR5ID0gbmV3IFByb21pc2U8dm9pZD4oIGFzeW5jIChyKSA9PiB7XG5cbiAgICAgICAgYXdhaXQgd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXG4gICAgICAgIGlzUmVhZHkgPSB0cnVlO1xuXG4gICAgICAgIHIoKTtcbiAgICB9KTtcblxuICAgIC8vIE5vIGRlcHMgYW5kIERPTSBhbHJlYWR5IGxvYWRlZC5cbiAgICBsZXQgaXNSZWFkeSA9IExpc3MuTElTU0NmZy5kZXBzLmxlbmd0aCA9PSAwICYmIGlzRE9NQ29udGVudExvYWRlZCgpO1xuXG5cdGNvbnN0IHBhcmFtcyA9IExpc3MuTElTU0NmZy5wYXJhbXM7IC8vT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5MSVNTQ2ZnLnBhcmFtcywgX3BhcmFtcyk7XG5cblx0Ly9cblxuXHRjb25zdCB3aGVuRGVwc1Jlc29sdmVkID0gUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXHRsZXQgaXNEZXBzUmVzb2x2ZWQgPSBmYWxzZTtcblx0KCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRpc0RlcHNSZXNvbHZlZCA9IHRydWU7XG5cdH0pKCk7XG5cblx0Y2xhc3MgTElTU0hvc3RCYXNlIGV4dGVuZHMgKGhvc3QgYXMgbmV3ICgpID0+IEhUTUxFbGVtZW50KSB7XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IHdoZW5EZXBzUmVzb2x2ZWQ7XG5cdFx0c3RhdGljIGdldCBpc0RlcHNSZXNvbHZlZCgpIHtcblx0XHRcdHJldHVybiBpc0RlcHNSZXNvbHZlZDtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNBUEkgIT09IG51bGw7XG5cdFx0fVxuXHRcdGdldCB3aGVuSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jd2FpdEluaXQ7IC8vIFRPRE86IGJldHRlci4uLlxuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zID0gcGFyYW1zOyAvLyBkbyBJIG5lZWQgaXQgYXMgbWVtYmVyID8/P1xuXHRcdHJlYWRvbmx5ICNpZCA9ICsraWQ7IC8vIGZvciBkZWJ1Z1xuXG5cdFx0Y29uc3RydWN0b3IocGFyYW1zOiB7fSwgYmFzZT86IEluc3RhbmNlVHlwZTxUPikge1xuXHRcdFx0c3VwZXIoKTtcblxuXHRcdFx0aWYoIGJhc2UgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRcdHRoaXMuI0FQSSA9IGJhc2U7XG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiN3YWl0SW5pdCA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSkgPT4ge1xuXHRcdFx0XHRpZih0aGlzLmlzSW5pdClcblx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSh0aGlzLiNBUEkhKTtcblx0XHRcdFx0dGhpcy4jcmVzb2x2ZSA9ICguLi5hcmdzKSA9PiB7IGNvbnNvbGUud2FybigncmVzb2x2ZWQ/Jyk7IHJlc29sdmUoLi4uYXJncykgfTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvKioqKiBwdWJsaWMgQVBJICoqKioqKioqKioqKiovXG5cbiAgICAgICAgc3RhdGljIGdldCB3YWl0UmVhZHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2FpdFJlYWR5O1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgaXNSZWFkeSgpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1JlYWR5O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHdhaXRSZWFkeSgpIHtcbiAgICAgICAgICAgIHJldHVybiBMSVNTSG9zdEJhc2Uud2FpdFJlYWR5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIExJU1NIb3N0QmFzZS5pc1JlYWR5O1xuICAgICAgICB9XG5cblx0XHRnZXQgaXNJbml0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI0FQSSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0aW5pdGlhbGl6ZShwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPiA9IHt9KSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHRjb25zdCBhcGkgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuI2lzSW5ET00gKVxuXHRcdFx0XHQoYXBpIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIGFwaTtcblx0XHR9XG5cblx0XHRnZXQgTElTU1N5bmMoKSB7XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignQWNjZXNzaW5nIEFQSSBiZWZvcmUgV2ViQ29tcG9uZW50IGluaXRpYWxpemF0aW9uIScpO1xuXHRcdFx0cmV0dXJuIHRoaXMuI0FQSSE7XG5cdFx0fVxuXHRcdGdldCBMSVNTKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3dhaXRJbml0O1xuXHRcdH1cblxuXHRcdC8qKiogaW5pdCAqKiovXG5cdFx0I3dhaXRJbml0OiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3Jlc29sdmU6ICgodTogSW5zdGFuY2VUeXBlPFQ+KSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXHRcdCNBUEk6IEluc3RhbmNlVHlwZTxUPiB8IG51bGwgPSBudWxsO1xuXG5cdFx0I2lzSW5ET00gPSBmYWxzZTsgLy8gY291bGQgYWxzbyB1c2UgaXNDb25uZWN0ZWQuLi5cblx0XHRnZXQgaXNJbkRPTSgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNpc0luRE9NO1xuXHRcdH1cblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0dGhpcy4jaXNJbkRPTSA9IGZhbHNlO1xuXHRcdFx0KHRoaXMuI0FQSSEgYXMgYW55KS5vbkRPTURpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHR0aGlzLiNpc0luRE9NID0gdHJ1ZTtcblx0XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdCApIHsvLyBUT0RPOiBpZiBvcHRpb24gaW5pdCBlYWNoIHRpbWUuLi5cblx0XHRcdFx0aWYoICEgdGhpcy5pc1JlYWR5ICkge1xuICAgICAgICAgICAgICAgICAgICAoYXN5bmMgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMud2FpdFJlYWR5O1xuXHRcdFx0XHRcdFx0dGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5pc0luRE9NKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLiNBUEkhIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIH1cblxuXHRcdFx0KHRoaXMuI0FQSSEgYXMgYW55KS5vbkRPTUNvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblx0XHRcdFxuXHRcdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzKTtcblxuICAgICAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLlxuXHRcdFx0XG5cdFx0XHQvLyBzaGFkb3dcblx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9zdDtcblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJykge1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6IHNoYWRvd30pO1xuXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYXR0cnNcblx0XHRcdGZvcihsZXQgb2JzIG9mIGF0dHJzISlcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tvYnMgYXMgQXR0cnNdID0gdGhpcy5nZXRBdHRyaWJ1dGUob2JzKTtcblxuXHRcdFx0Ly8gY3NzXG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUyk7XG5cdFx0XHRpZiggc3R5bGVzaGVldHMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaCguLi5zdHlsZXNoZWV0cyk7XG5cdFx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdFx0Y29uc3QgY3Nzc2VsZWN0b3IgPSB0aGlzLkNTU1NlbGVjdG9yO1xuXG5cdFx0XHRcdFx0Ly8gaWYgbm90IHlldCBpbnNlcnRlZCA6XG5cdFx0XHRcdFx0aWYoICEgYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cblx0XHRcdFx0XHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG5cdFx0XHRcdFx0XHRsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcblx0XHRcdFx0XHRcdFx0XHRodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuXG5cdFx0XHRcdFx0XHRhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY29udGVudFxuXHRcdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdFx0XHRsZXQgdGVtcGxhdGVfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cdFx0XHRcdGxldCBzdHIgPSAoY29udGVudCBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gdGhpcy5nZXRBdHRyaWJ1dGUobWF0Y2gpPz8nJylcblx0ICAgIFx0XHR0ZW1wbGF0ZV9lbGVtLmlubmVySFRNTCA9IHN0cjtcblx0ICAgIFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCguLi50ZW1wbGF0ZV9lbGVtLmNvbnRlbnQuY2hpbGROb2Rlcyk7XG5cdCAgICBcdH1cblxuXHQgICAgXHQvLyBidWlsZFxuXG5cdCAgICBcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0ICAgIFx0bGV0IG9iaiA9IHRoaXMuI0FQSSA9PT0gbnVsbCA/IG5ldyBMaXNzKCkgOiB0aGlzLiNBUEk7XG5cblx0XHRcdHRoaXMuI0FQSSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdGlmKCB0aGlzLiNyZXNvbHZlICE9PSBudWxsKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihcInJlc29sdmVkXCIsIHRoaXMuI0FQSSk7XG5cdFx0XHRcdHRoaXMuI3Jlc29sdmUodGhpcy4jQVBJKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuI0FQSTtcblx0XHR9XG5cblx0XHRnZXQgcGFyYW1zKCk6IFBhcmFtcyB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jcGFyYW1zO1xuXHRcdH1cblxuICAgICAgICBwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxMSVNTX09wdHNbXCJwYXJhbXNcIl0+KSB7XG5cdFx0XHRpZiggdGhpcy5pc0luaXQgKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHRoaXMuI0FQSSEudXBkYXRlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIC8vIHdpbCBiZSBnaXZlbiB0byBjb25zdHJ1Y3Rvci4uLlxuXHRcdFx0T2JqZWN0LmFzc2lnbiggdGhpcy4jcGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cblxuXHRcdC8qKiogY29udGVudCAqKiovXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvKioqIGF0dHJzICoqKi9cblx0XHQjYXR0cnNfZmxhZyA9IGZhbHNlO1xuXG5cdFx0I2F0dHJpYnV0ZXMgICAgICAgICA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRyaWJ1dGVzRGVmYXVsdHMgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cnMgPSBuZXcgQXR0cmlidXRlcyhcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXMsXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHMsXG5cdFx0XHQobmFtZTogQXR0cnMsIHZhbHVlOnN0cmluZ3xudWxsKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSB0cnVlOyAvLyBkbyBub3QgdHJpZ2dlciBvbkF0dHJzQ2hhbmdlZC5cblx0XHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdCkgYXMgdW5rbm93biBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblxuXHRcdHNldEF0dHJEZWZhdWx0KG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0ZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Z2V0IGF0dHJzKCk6IFJlYWRvbmx5PFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+PiB7XG5cblx0XHRcdHJldHVybiB0aGlzLiNhdHRycztcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYXR0cnM7XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUgICAgOiBBdHRycyxcblx0XHRcdFx0XHRcdFx0XHQgb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHQgbmV3VmFsdWU6IHN0cmluZykge1xuXG5cdFx0XHRpZih0aGlzLiNhdHRyc19mbGFnKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gbmV3VmFsdWU7XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdCApXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0aWYoICh0aGlzLiNBUEkhIGFzIGFueSkub25BdHRyQ2hhbmdlZChuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLiNhdHRyc1tuYW1lXSA9IG9sZFZhbHVlOyAvLyByZXZlcnQgdGhlIGNoYW5nZS5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0QmFzZSBhcyBDb21wb3NlQ29uc3RydWN0b3I8dHlwZW9mIExJU1NIb3N0QmFzZSwgdHlwZW9mIGhvc3Q+O1xufVxuXG5cbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgZGVmaW5lID09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IExJU1MgZnJvbSBcIkxJU1NCYXNlXCI7XG5pbXBvcnQgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuL0xJU1NCYXNlXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZSAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuXHRcdGlzRGVmaW5lZCAgICAgIDogdHlwZW9mIGlzRGVmaW5lZDtcblx0XHRnZXROYW1lICAgICAgICA6IHR5cGVvZiBnZXROYW1lO1xuXG5cdFx0Z2V0TElTUyAgICA6IHR5cGVvZiBnZXRMSVNTO1xuXHRcdGdldExJU1NTeW5jOiB0eXBlb2YgZ2V0TElTU1N5bmM7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuXHRcdFx0XHRcdFx0XHR0YWduYW1lICAgICAgIDogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRDb21wb25lbnRDbGFzczogVCkge1xuXHRjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG5cdGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cblx0Y29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXHRcblx0Y29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG5cdFx0XHRcdFx0XHRcdFx0XHQgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblx0XG5cdGNvbnNvbGUud2FybihcImRlZmluZWRcIiwgdGFnbmFtZSwgTElTU2NsYXNzLCBvcHRzKTtcblxuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgTElTU2NsYXNzLCBvcHRzKTtcbn07XG5cblxuYXN5bmMgZnVuY3Rpb24gd2hlbkRlZmluZWQodGFnbmFtZTogc3RyaW5nLCBjYWxsYmFjaz86ICgpID0+IHZvaWQgKSA6IFByb21pc2U8dm9pZD4ge1xuXG5cdGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xuXG5cdGlmKCBjYWxsYmFjayAhPT0gdW5kZWZpbmVkKVxuXHRcdGNhbGxiYWNrKCk7XG5cblx0cmV0dXJuO1xufVxuYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdLCBjYWxsYmFjaz86ICgpID0+IHZvaWQgKSA6IFByb21pc2U8dm9pZD4ge1xuXG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG5cblx0aWYoIGNhbGxiYWNrICE9PSB1bmRlZmluZWQpXG5cdFx0Y2FsbGJhY2soKTtcblxufVxuXG5mdW5jdGlvbiBpc0RlZmluZWQobmFtZTogc3RyaW5nKSB7XG5cdHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQobmFtZSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnQgKTogc3RyaW5nIHtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufVxuXG5MSVNTLmRlZmluZSAgICAgICAgID0gZGVmaW5lO1xuTElTUy53aGVuRGVmaW5lZCAgICA9IHdoZW5EZWZpbmVkO1xuTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmFzeW5jIGZ1bmN0aW9uIGdldExJU1M8VCBleHRlbmRzIExJU1NCYXNlPiggZWxlbWVudDogRWxlbWVudCApOiBQcm9taXNlPFQ+IHtcblxuXHRhd2FpdCBMSVNTLndoZW5EZWZpbmVkKCBMSVNTLmdldE5hbWUoZWxlbWVudCkgKTtcblxuXHRjdXN0b21FbGVtZW50cy51cGdyYWRlKCBlbGVtZW50ICk7XG5cblx0Y29uc29sZS53YXJuKFwiZ2V0TElTU1wiLCBlbGVtZW50LCBlbGVtZW50LmNvbnN0cnVjdG9yLm5hbWUgKTtcblxuXHRyZXR1cm4gYXdhaXQgKGVsZW1lbnQgYXMgTElTU0hvc3Q8VD4pLkxJU1MgYXMgVDsgLy8gZW5zdXJlIGluaXRpYWxpemVkLlxufVxuZnVuY3Rpb24gZ2V0TElTU1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPiggZWxlbWVudDogRWxlbWVudCApOiBUIHtcblxuXHRjb25zdCBuYW1lID0gTElTUy5nZXROYW1lKGVsZW1lbnQpO1xuXHRpZiggISBMSVNTLmlzRGVmaW5lZCggbmFtZSApIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gaGFzbid0IGJlZW4gZGVmaW5lZCB5ZXQuYCk7XG5cblx0bGV0IGhvc3QgPSBlbGVtZW50IGFzIExJU1NIb3N0PFQ+O1xuXG5cdGlmKCAhIGhvc3QuaXNJbml0IClcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YW5jZSBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXQuXCIpO1xuXG5cdHJldHVybiBob3N0LkxJU1NTeW5jIGFzIFQ7XG59XG5cbkxJU1MuZ2V0TElTUyAgICAgPSBnZXRMSVNTO1xuTElTUy5nZXRMSVNTU3luYyA9IGdldExJU1NTeW5jOyIsImltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcInN0YXRlXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vaW5kZXhcIjtcbmltcG9ydCB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwidHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0cmluZyA9IHN0cmluZy50cmltKCk7IC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHJpbmc7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkISBhcyBUO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzczxUIGV4dGVuZHMgTElTU0Jhc2U+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IGluaXRpYWxpemU8TElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbSk7XG5cbiAgICByZXR1cm4gaG9zdC5MSVNTU3luYyBhcyBUOyAvL1RPRE8gYmV0dGVyID9cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBjb25zdCBob3N0ID0gaW5pdGlhbGl6ZVN5bmM8TElTU0hvc3Q8TElTU0Jhc2U+PihlbGVtKTtcblxuICAgIHJldHVybiBob3N0LkxJU1NTeW5jIGFzIFQ7IC8vVE9ETyBiZXR0ZXIgP1xufVxuXG5cbnR5cGUgQlVJTERfT1BUSU9OUzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4gPSBQYXJ0aWFsPHtcbiAgICBwYXJhbXMgICAgOiBQYXJ0aWFsPGluZmVyUGFyYW1zPFQ+PixcbiAgICBjb250ZW50XHQgIDogc3RyaW5nfE5vZGV8cmVhZG9ubHkgTm9kZVtdLFxuICBpZCBcdFx0ICA6IHN0cmluZyxcbiAgICBjbGFzc2VzXHQgIDogcmVhZG9ubHkgc3RyaW5nW10sXG4gICAgY3NzdmFycyAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4sXG4gICAgYXR0cnMgXHQgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBkYXRhIFx0ICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG4gICAgbGlzdGVuZXJzIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgKGV2OiBFdmVudCkgPT4gdm9pZD4+XG59PiAmICh7XG4gIGluaXRpYWxpemU6IGZhbHNlLFxuICBwYXJlbnQ6IEVsZW1lbnRcbn18e1xuICBpbml0aWFsaXplPzogdHJ1ZSxcbiAgcGFyZW50PzogRWxlbWVudFxufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IFByb21pc2U8Q29tcG9uZW50c1tUXT47XG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCB7XG5wYXJhbXMgICAgPSB7fSxcbmluaXRpYWxpemU9IHRydWUsXG5jb250ZW50ICAgPSBbXSxcbnBhcmVudCAgICA9IHVuZGVmaW5lZCxcbmlkIFx0XHQgID0gdW5kZWZpbmVkLFxuY2xhc3NlcyAgID0gW10sXG5jc3N2YXJzICAgPSB7fSxcbmF0dHJzICAgICA9IHt9LFxuZGF0YSBcdCAgPSB7fSxcbmxpc3RlbmVycyA9IHt9XG59OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBQcm9taXNlPFQ+IHtcblxuaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG50aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbmxldCBDdXN0b21DbGFzcyA9IGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xubGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuLy8gRml4IGlzc3VlICMyXG5pZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuZWxlbS5pZCA9IGlkO1xuXG5pZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG5mb3IobGV0IG5hbWUgaW4gY3NzdmFycylcbmVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG5mb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxubGV0IHZhbHVlID0gYXR0cnNbbmFtZV07XG5pZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbmVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbmVsc2VcbmVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbn1cblxuZm9yKGxldCBuYW1lIGluIGRhdGEpIHtcblxubGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbmlmKCB2YWx1ZSA9PT0gZmFsc2UpXG5kZWxldGUgZWxlbS5kYXRhc2V0W25hbWVdO1xuZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbmVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG5lbHNlXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbn1cblxuaWYoICEgQXJyYXkuaXNBcnJheShjb250ZW50KSApXG5jb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbmVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG5mb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbmlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG5wYXJlbnQuYXBwZW5kKGVsZW0pO1xuXG5pZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbnJldHVybiBhd2FpdCBMSVNTLmluaXRpYWxpemUoZWxlbSk7XG5cbnJldHVybiBhd2FpdCBMSVNTLmdldExJU1MoZWxlbSk7XG59XG5MSVNTLmJ1aWxkID0gYnVpbGQ7XG5cblxuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IENvbXBvbmVudHNbVF07XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBUO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIHtcbnBhcmFtcyAgICA9IHt9LFxuaW5pdGlhbGl6ZT0gdHJ1ZSxcbmNvbnRlbnQgICA9IFtdLFxucGFyZW50ICAgID0gdW5kZWZpbmVkLFxuaWQgXHRcdCAgPSB1bmRlZmluZWQsXG5jbGFzc2VzICAgPSBbXSxcbmNzc3ZhcnMgICA9IHt9LFxuYXR0cnMgICAgID0ge30sXG5kYXRhIFx0ICA9IHt9LFxubGlzdGVuZXJzID0ge31cbn06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFQge1xuXG5pZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbnRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxubGV0IEN1c3RvbUNsYXNzID0gY3VzdG9tRWxlbWVudHMuZ2V0KHRhZ25hbWUpO1xuaWYoQ3VzdG9tQ2xhc3MgPT09IHVuZGVmaW5lZClcbnRocm93IG5ldyBFcnJvcihgJHt0YWduYW1lfSBub3QgZGVmaW5lZGApO1xubGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuLy9UT0RPOiBmYWN0b3JpemUuLi5cblxuLy8gRml4IGlzc3VlICMyXG5pZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuZWxlbS5pZCA9IGlkO1xuXG5pZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG5mb3IobGV0IG5hbWUgaW4gY3NzdmFycylcbmVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG5mb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxubGV0IHZhbHVlID0gYXR0cnNbbmFtZV07XG5pZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbmVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbmVsc2VcbmVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbn1cblxuZm9yKGxldCBuYW1lIGluIGRhdGEpIHtcblxubGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbmlmKCB2YWx1ZSA9PT0gZmFsc2UpXG5kZWxldGUgZWxlbS5kYXRhc2V0W25hbWVdO1xuZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbmVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG5lbHNlXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbn1cblxuaWYoICEgQXJyYXkuaXNBcnJheShjb250ZW50KSApXG5jb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbmVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG5mb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbmlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG5wYXJlbnQuYXBwZW5kKGVsZW0pO1xuXG5pZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbkxJU1MuaW5pdGlhbGl6ZVN5bmMoZWxlbSk7XG5cbnJldHVybiBMSVNTLmdldExJU1NTeW5jKGVsZW0pO1xufVxuTElTUy5idWlsZFN5bmMgPSBidWlsZFN5bmM7XG4iLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5pbXBvcnQgXCIuL2RlZmluZVwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IExJU1M7IiwiaW1wb3J0IHsgZ2V0TmFtZSB9IGZyb20gXCJkZWZpbmVcIjtcbmltcG9ydCB7IExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCJ0eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCJ1dGlsc1wiO1xuXG5leHBvcnQgZW51bSBMSVNTU3RhdGUge1xuICAgIE5PTkUgPSAwLFxuXG4gICAgLy8gY2xhc3NcbiAgICBERUZJTkVEID0gMSA8PCAwLFxuICAgIFJFQURZICAgPSAxIDw8IDEsXG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIFVQR1JBREVEICAgID0gMSA8PCAyLFxuICAgIElOSVRJQUxJWkVEID0gMSA8PCAzLFxufVxuXG5leHBvcnQgY29uc3QgREVGSU5FRCAgICAgPSBMSVNTU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IExJU1NTdGF0ZS5SRUFEWTtcbmV4cG9ydCBjb25zdCBVUEdSQURFRCAgICA9IExJU1NTdGF0ZS5VUEdSQURFRDtcbmV4cG9ydCBjb25zdCBJTklUSUFMSVpFRCA9IExJU1NTdGF0ZS5JTklUSUFMSVpFRDtcblxuLy9UT0RPOiBhZGQgdG8gTElTUy4uLlxuLy9UT0RPOiBhZGQgdG8gQVBJID9cbi8vVE9ETzogSFRNTEVsZW1lbnQgb3IgSG9zdCBjbGFzcyBvciBCYXNlIGNsYXNzIG9yIFguXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGF0ZTJzdHIoc3RhdGU6IExJU1NTdGF0ZSkge1xuICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgaXMucHVzaChcIkRFRklORURcIik7XG4gICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICBpcy5wdXNoKFwiUkVBRFlcIik7XG4gICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICBpcy5wdXNoKFwiSU5JVElBTElaRURcIik7XG5cbiAgICByZXR1cm4gaXMuam9pbignfCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUoZWxlbTogSFRNTEVsZW1lbnQpOiBMSVNTU3RhdGUge1xuXG4gICAgbGV0IHN0YXRlOiBMSVNTU3RhdGUgPSAwO1xuXG4gICAgaWYoIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHN0YXRlIHw9IERFRklORUQ7XG4gICAgaWYoIGlzUmVhZHkgIChlbGVtKSApXG4gICAgICAgIHN0YXRlIHw9IFJFQURZO1xuICAgIGlmKCBpc1VwZ3JhZGVkKGVsZW0pIClcbiAgICAgICAgc3RhdGUgfD0gVVBHUkFERUQ7XG4gICAgaWYoIGlzSW5pdGlhbGl6ZWQoZWxlbSkgKVxuICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcblxuICAgIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhdGUoZWxlbTogSFRNTEVsZW1lbnQsIHN0YXRlOiBMSVNTU3RhdGUpIHtcblxuICAgIGlmKCBzdGF0ZSAmIERFRklORUQgICYmICEgaXNEZWZpbmVkIChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiggc3RhdGUgJiBSRUFEWSAgICAmJiAhIGlzUmVhZHkgICAoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYoIHN0YXRlICYgVVBHUkFERUQgJiYgISBpc1VwZ3JhZGVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEICYmICEgaXNJbml0aWFsaXplZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblN0YXRlKGVsZW06IEhUTUxFbGVtZW50LCBzdGF0ZTogTElTU1N0YXRlKSB7XG4gICAgbGV0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8dm9pZD4+KCk7XG5cbiAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgcHJvbWlzZXMucHVzaCggd2hlbkRlZmluZWQgKGVsZW0pICk7XG4gICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICBwcm9taXNlcy5wdXNoKCB3aGVuUmVhZHkgICAoZWxlbSkgKTtcbiAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgIHByb21pc2VzLnB1c2goIHdoZW5VcGdyYWRlZChlbGVtKSApO1xuICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgcHJvbWlzZXMucHVzaCggd2hlbkluaXRpYWxpemVkKGVsZW0pICk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PSBERUZJTkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBnbyB0byBzdGF0ZSBkZWZpbmUuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFQpIHtcbiAgICAgICAgXG4gICAgY29uc3QgQ2xhc3MgID0gQ29tcG9uZW50Q2xhc3MuTElTU0NmZy5ob3N0O1xuICAgIGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cbiAgICBjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuZnVuY3Rpb24gaXNEZWZpbmVkKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldCggZ2V0TmFtZShlbGVtKSApICE9PSB1bmRlZmluZWQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoIGdldE5hbWUoZWxlbSkgKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IGdldEhvc3RDc3RyIGZyb20gSFRNTEVsZW1lbnQgPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIFxuICAgIGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuXG4gICAgY29uc3QgbmFtZSA9IGdldE5hbWUoZWxlbSk7XG5cbiAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KCBuYW1lICkhIGFzIFQ7IC8vVE9ETyByZWdpc3RyeSBmdW5jdGlvbiA/XG59XG5mdW5jdGlvbiBnZXRIb3N0Q3N0clN5bmM8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIFxuICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKGVsZW0pO1xuICAgIGNvbnN0IGhvc3QgPSBjdXN0b21FbGVtZW50cy5nZXQoIG5hbWUgKTtcbiAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gbm90IHlldCBkZWZpbmVkIWApO1xuICAgIHJldHVybiBob3N0IGFzIFQ7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PSBnZXRIb3N0IGZyb20gSFRNTEVsZW1lbnQgPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBcbiAgICBhd2FpdCB3aGVuVXBncmFkZWQoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBUO1xufVxuZnVuY3Rpb24gZ2V0SG9zdFN5bmM8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgXG4gICAgaWYoICEgaXNVcGdyYWRlZChlbGVtKSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBub3QgdXBncmFkZWQhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBUO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gUkVBRFkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGlzUmVhZHkoZWxlbTogSFRNTEVsZW1lbnQpIHtcblxuICAgIGlmKCAhIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBIb3N0LmlzRGVwc1Jlc29sdmVkO1xufVxuXG5hc3luYyBmdW5jdGlvbiB3aGVuUmVhZHkoZWxlbTogSFRNTEVsZW1lbnQpIHtcblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCBnZXRIb3N0Q3N0cihlbGVtKTtcblxuICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgYXdhaXQgaG9zdC53aGVuRGVwc1Jlc29sdmVkO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gVVBHUkFERUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGdyYWRlPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCk6IFByb21pc2U8VD4ge1xuXG4gICAgYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQpOiBUIHtcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IGRlZmluZWQhJyk7XG5cbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIChlbGVtIGluc3RhbmNlb2YgSG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgZGlkbid0IHVwZ3JhZGUhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBUO1xufVxuXG5mdW5jdGlvbiBpc1VwZ3JhZGVkKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgaG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcbiAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIGhvc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZChlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIFxuICAgIGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCBnZXRIb3N0Q3N0cihlbGVtKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgaG9zdClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgLy8gaDRja1xuXG4gICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgXG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gSU5JVElBTElaRUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtIDogSFRNTEVsZW1lbnQpIHtcbiAgICBcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcblxuICAgIGF3YWl0IHdoZW5SZWFkeShlbGVtKTtcblxuICAgIGhvc3QuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGhvc3QgYXMgVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbSA6IEhUTUxFbGVtZW50KSB7XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBpc1JlYWR5KGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGhvc3QuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGhvc3QgYXMgVDtcbn1cblxuZnVuY3Rpb24gaXNJbml0aWFsaXplZChlbGVtOiBIVE1MRWxlbWVudCkge1xuXG4gICAgaWYoICEgaXNVcGdyYWRlZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0U3luYyhlbGVtKTtcblxuICAgIHJldHVybiBob3N0LmlzSW5pdGlhbGl6ZWQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHdoZW5Jbml0aWFsaXplZChlbGVtOiBIVE1MRWxlbWVudCkge1xuXG4gICAgYXdhaXQgKGF3YWl0IGdldEhvc3QoZWxlbSkpLndoZW5Jbml0aWFsaXplZDtcblxuICAgIHJldHVybjtcbn0iLCJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIkxJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50O1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnXG59O1xuXG4vL1RPRE86IGltcGxlbWVudFxuZXhwb3J0IGVudW0gTGlmZUN5Y2xlIHtcbiAgICBERUZBVUxUICAgICAgICAgICAgICAgICAgID0gMCxcblx0Ly8gbm90IGltcGxlbWVudGVkIHlldFxuICAgIElOSVRfQUZURVJfQ0hJTERSRU4gICAgICAgPSAxIDw8IDEsXG4gICAgSU5JVF9BRlRFUl9QQVJFTlQgICAgICAgICA9IDEgPDwgMixcbiAgICAvLyBxdWlkIHBhcmFtcy9hdHRycyA/XG4gICAgUkVDUkVBVEVfQUZURVJfQ09OTkVDVElPTiA9IDEgPDwgMywgLyogcmVxdWlyZXMgcmVidWlsZCBjb250ZW50ICsgZGVzdHJveS9kaXNwb3NlIHdoZW4gcmVtb3ZlZCBmcm9tIERPTSAqL1xuICAgIC8qIHNsZWVwIHdoZW4gZGlzY28gOiB5b3UgbmVlZCB0byBpbXBsZW1lbnQgaXQgeW91cnNlbGYgKi9cbn1cblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmcsXG4gICAgPiA9IHtcbiAgICAgICAgLy8gSlMgQmFzZVxuICAgICAgICBleHRlbmRzICAgOiBFeHRlbmRzQ3RyLFxuICAgICAgICBwYXJhbXMgICAgOiBQYXJhbXMsXG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGRlcHMgICAgICA6IHJlYWRvbmx5IFByb21pc2U8YW55PltdLFxuICAgICAgICBsaWZlX2N5Y2xlOiBMaWZlQ3ljbGUsIFxuXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0cixcbiAgICAgICAgYXR0cnMgIDogcmVhZG9ubHkgQXR0cnNbXSxcbiAgICAgICAgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiByZWFkb25seSBBdHRyc1tdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXRcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgY29udGVudD86IEhUTUxfU291cmNlLFxuICAgICAgICBjc3MgICAgIDogQ1NTX1NvdXJjZSB8IHJlYWRvbmx5IENTU19Tb3VyY2VbXSxcbiAgICAgICAgc2hhZG93ICA6IFNoYWRvd0NmZ1xufVxuXG4vLyBMSVNTQmFzZVxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZUNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBJbnN0YW5jZVR5cGU8TElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBUIGV4dGVuZHMgTElTU0Jhc2U8XG4gICAgICAgICAgICBpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgQixcbiAgICAgICAgICAgIGluZmVyIEMsXG4gICAgICAgICAgICBpbmZlciBEPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0Jhc2VDc3RyPEEsQixDLEQ+IDogbmV2ZXI7XG5cblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0Jhc2UgPyBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgSFRNTENMQVNTX1JFR0VYID0gIC9IVE1MKFxcdyspRWxlbWVudC87XG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cdFxuXHRsZXQgaHRtbHRhZyA9IEhUTUxDTEFTU19SRUdFWC5leGVjKENsYXNzLm5hbWUpIVsxXTtcblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IHR5cGVvZiBIVE1MRWxlbWVudCkge1xuXHRyZXR1cm4gQ0FOX0hBVkVfU0hBRE9XLmluY2x1ZGVzKCBfZWxlbWVudDJ0YWduYW1lKHRhZykgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn1cblxuZXhwb3J0IGNvbnN0IHdoZW5ET01Db250ZW50TG9hZGVkID0gd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7IiwiXG5pbXBvcnQgeyBodG1sLCBsaXNzIH0gZnJvbSAnaGVscGVycy9idWlsZCc7XG5pbXBvcnQgTElTUyBmcm9tICcuLi8uLi8uLi8nO1xuaW1wb3J0IHsgU2hhZG93Q2ZnIH0gZnJvbSAndHlwZXMnO1xuaW1wb3J0IHsgZ2V0U3RhdGUsIHN0YXRlMnN0ciB9IGZyb20gJ3N0YXRlJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBNeUNvbXBvbmVudEEgZXh0ZW5kcyBMSVNTKCkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50LnJlcGxhY2VDaGlsZHJlbihodG1sYDxiPmh0bWxcXGBcXGAgOiBPSzwvYj5gKTtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lKCdteS1jb21wb25lbnQtYScsIE15Q29tcG9uZW50QSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY2xhc3MgTXlDb21wb25lbnRCIGV4dGVuZHMgTElTUyh7XG4gICAgY29udGVudDogXCJsaXNzYGBcIlxufSkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdFwiKTtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lKCdteS1jb21wb25lbnQtYicsIE15Q29tcG9uZW50Qik7XG5cbmFzeW5jIGZ1bmN0aW9uIGZvbygpIHtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IGF3YWl0IGxpc3NgPG15LWNvbXBvbmVudC1iPjwvbXktY29tcG9uZW50LWI+YDtcbiAgICBcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChjb21wb25lbnQuaG9zdCk7XG59XG5cbmZvbygpO1xuXG57XG4gICAgbGV0IGNvbXBvID0gbmV3IE15Q29tcG9uZW50Qi5Ib3N0KCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoY29tcG8pO1xuXG4gICAgY29uc29sZS53YXJuKFwiaG9zdFwiLCBzdGF0ZTJzdHIoZ2V0U3RhdGUoY29tcG8pKSApO1xufVxue1xuICAgIGxldCBjb21wbyA9IG5ldyBNeUNvbXBvbmVudEIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChjb21wby5ob3N0KTtcblxuICAgIGNvbnNvbGUud2FybihcImJhc2VcIiwgc3RhdGUyc3RyKGdldFN0YXRlKGNvbXBvLmhvc3QpKSApO1xufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInBhZ2VzL2V4YW1wbGVzL2J1aWxkL2luZGV4Lmh0bWxcIjsiXSwibmFtZXMiOlsiYnVpbGRMSVNTSG9zdCIsIkxpZmVDeWNsZSIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc1NoYWRvd1N1cHBvcnRlZCIsIl9fY3N0cl9ob3N0Iiwic2V0Q3N0ckhvc3QiLCJfIiwiSUxJU1MiLCJMSVNTIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwicGFyYW1zIiwiZGVwcyIsImxpZmVfY3ljbGUiLCJERUZBVUxUIiwiaG9zdCIsIkhUTUxFbGVtZW50Iiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cnMiLCJjb250ZW50IiwiY3NzIiwic2hhZG93IiwiQ0xPU0UiLCJOT05FIiwiT1BFTiIsIkVycm9yIiwiYWxsX2RlcHMiLCJQcm9taXNlIiwiUmVzcG9uc2UiLCJfY29udGVudCIsInB1c2giLCJ0ZXh0IiwiTElTU0Jhc2UiLCJMSVNTQ2ZnIiwicHJvY2Vzc19jb250ZW50Iiwic3R5bGVzaGVldHMiLCJ1bmRlZmluZWQiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJjIiwiaWR4IiwicHJvY2Vzc19jc3MiLCJjb25zdHJ1Y3RvciIsImFyZ3MiLCJIb3N0Iiwic2V0QXR0ckRlZmF1bHQiLCJhdHRyIiwidmFsdWUiLCJvbkF0dHJDaGFuZ2VkIiwiX25hbWUiLCJfb2xkVmFsdWUiLCJfbmV3VmFsdWUiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJ1cGRhdGVQYXJhbXMiLCJhc3NpZ24iLCJpc0luRE9NIiwib25ET01Db25uZWN0ZWQiLCJjb25uZWN0ZWRDYWxsYmFjayIsIm9uRE9NRGlzY29ubmVjdGVkIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJpc0Nvbm5lY3RlZCIsIl9Ib3N0IiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwidHJpbSIsImxlbmd0aCIsImlzRE9NQ29udGVudExvYWRlZCIsIndhaXRET01Db250ZW50TG9hZGVkIiwiaWQiLCJzaGFyZWRDU1MiLCJMaXNzIiwiR0VUIiwiU3ltYm9sIiwiU0VUIiwicHJvcGVydGllcyIsImZyb21FbnRyaWVzIiwibiIsImVudW1lcmFibGUiLCJnZXQiLCJzZXQiLCJBdHRyaWJ1dGVzIiwibmFtZSIsImRhdGEiLCJkZWZhdWx0cyIsInNldHRlciIsImRlZmluZVByb3BlcnRpZXMiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJ3YWl0UmVhZHkiLCJyIiwiYWxsIiwiaXNSZWFkeSIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkxJU1NIb3N0QmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJiYXNlIiwiaW5pdCIsInJlc29sdmUiLCJpc0luaXQiLCJjb25zb2xlIiwid2FybiIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiaW5pdGlhbGl6ZSIsImFwaSIsIkxJU1NTeW5jIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwiYXR0YWNoU2hhZG93IiwibW9kZSIsIm9icyIsImdldEF0dHJpYnV0ZSIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsImNzc3NlbGVjdG9yIiwiQ1NTU2VsZWN0b3IiLCJoYXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsInJlcGxhY2UiLCJoZWFkIiwiYXBwZW5kIiwiYWRkIiwidGVtcGxhdGVfZWxlbSIsInN0ciIsIm1hdGNoIiwiY2hpbGROb2RlcyIsIm9iaiIsImhhc1NoYWRvdyIsImdldFBhcnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsInJlbW92ZUF0dHJpYnV0ZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJDbGFzcyIsImh0bWx0YWciLCJMSVNTY2xhc3MiLCJvcHRzIiwid2hlbkRlZmluZWQiLCJjYWxsYmFjayIsIndoZW5BbGxEZWZpbmVkIiwidGFnbmFtZXMiLCJ0IiwiaXNEZWZpbmVkIiwiZ2V0TmFtZSIsImVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZ2V0TElTUyIsImdldExJU1NTeW5jIiwiaW5pdGlhbGl6ZVN5bmMiLCJodG1sIiwic3RyaW5nIiwiaSIsInRlbXBsYXRlIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJsaXNzIiwiZWxlbSIsImxpc3NTeW5jIiwiYnVpbGQiLCJwYXJlbnQiLCJjbGFzc2VzIiwiY3NzdmFycyIsImxpc3RlbmVycyIsIkN1c3RvbUNsYXNzIiwiY2xhc3NMaXN0Iiwic2V0UHJvcGVydHkiLCJ0b2dnbGVBdHRyaWJ1dGUiLCJkYXRhc2V0IiwicmVwbGFjZUNoaWxkcmVuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJ1aWxkU3luYyIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiTElTU1N0YXRlIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsInN0YXRlMnN0ciIsInN0YXRlIiwiaXMiLCJqb2luIiwiZ2V0U3RhdGUiLCJpc1VwZ3JhZGVkIiwiaXNTdGF0ZSIsIndoZW5TdGF0ZSIsInByb21pc2VzIiwid2hlblJlYWR5Iiwid2hlblVwZ3JhZGVkIiwiZ2V0SG9zdENzdHIiLCJnZXRIb3N0Q3N0clN5bmMiLCJnZXRIb3N0IiwiZ2V0SG9zdFN5bmMiLCJ1cGdyYWRlU3luYyIsIl93aGVuVXBncmFkZWQiLCJwcm9taXNlIiwid2l0aFJlc29sdmVycyIsIkhUTUxDTEFTU19SRUdFWCIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJleGVjIiwiQ0FOX0hBVkVfU0hBRE9XIiwidGFnIiwicmVhZHlTdGF0ZSIsIk15Q29tcG9uZW50QSIsIk15Q29tcG9uZW50QiIsImxvZyIsImZvbyIsImNvbXBvbmVudCIsImJvZHkiLCJjb21wbyJdLCJzb3VyY2VSb290IjoiIn0=