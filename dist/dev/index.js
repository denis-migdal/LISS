/******/ var __webpack_modules__ = ({

/***/ "./src/ContentGenerator.ts":
/*!*********************************!*\
  !*** ./src/ContentGenerator.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContentGenerator)
/* harmony export */ });
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSHost */ "./src/LISSHost.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



const alreadyDeclaredCSS = new Set();
const sharedCSS = (0,_LISSHost__WEBPACK_IMPORTED_MODULE_0__.getSharedCSS)(); // from LISSHost...
class ContentGenerator {
    #stylesheets;
    #template;
    #shadow;
    data;
    constructor({ html, css = [], shadow = null } = {}){
        this.#shadow = shadow;
        this.#template = this.prepareHTML(html);
        this.#stylesheets = this.prepareCSS(css);
        this.#isReady = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isDOMContentLoaded)();
        this.#whenReady = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.waitDOMContentLoaded)();
    //TODO: other deps...
    }
    setTemplate(template) {
        this.#template = template;
    }
    #whenReady;
    #isReady = false;
    get isReady() {
        return this.#isReady;
    }
    async whenReady() {
        if (this.#isReady) return;
        return await this.#whenReady;
    //TODO: deps.
    //TODO: CSS/HTML resources...
    // if( _content instanceof Response ) // from a fetch...
    // _content = await _content.text();
    // + cf at the end...
    }
    generate(host) {
        //TODO: wait parents/children depending on option...     
        const target = this.initShadow(host);
        this.injectCSS(target, this.#stylesheets);
        const content = this.#template.content.cloneNode(true);
        if (host.shadowMode !== _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE || target.childNodes.length === 0) target.replaceChildren(content);
        if (target instanceof ShadowRoot && target.childNodes.length === 0) target.append(document.createElement('slot'));
        customElements.upgrade(host);
        return target;
    }
    initShadow(host) {
        const canHaveShadow = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host);
        if (this.#shadow !== null && this.#shadow !== _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE && !canHaveShadow) throw new Error(`Host element ${(0,_utils__WEBPACK_IMPORTED_MODULE_2__._element2tagname)(host)} does not support ShadowRoot`);
        let mode = this.#shadow;
        if (mode === null) mode = canHaveShadow ? _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.SEMIOPEN : _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE;
        host.shadowMode = mode;
        if (mode === _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.SEMIOPEN) mode = _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.OPEN; // TODO: set to X.
        let target = host;
        if (mode !== _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE) target = host.attachShadow({
            mode
        });
        return target;
    }
    prepareCSS(css) {
        if (!Array.isArray(css)) css = [
            css
        ];
        return css.map((e)=>this.processCSS(e));
    }
    processCSS(css) {
        if (css instanceof CSSStyleSheet) return css;
        if (css instanceof HTMLStyleElement) return css.sheet;
        if (typeof css === "string") {
            let style = new CSSStyleSheet();
            style.replaceSync(css); // replace() if issues
            return style;
        }
        console.warn(css);
        throw new Error("Should not occur");
    }
    prepareHTML(html) {
        const template = document.createElement('template');
        if (html === undefined) return template;
        // str2html
        if (typeof html === 'string') {
            const str = html.trim();
            template.innerHTML = str;
            return template;
        }
        if (html instanceof HTMLElement) html = html.cloneNode(true);
        template.append(html);
        return template;
    }
    injectCSS(target, stylesheets) {
        if (target instanceof ShadowRoot) {
            target.adoptedStyleSheets.push(sharedCSS, ...stylesheets);
            return;
        }
        const cssselector = target.CSSSelector; //TODO...
        if (alreadyDeclaredCSS.has(cssselector)) return;
        let style = document.createElement('style');
        style.setAttribute('for', cssselector);
        let html_stylesheets = "";
        for (let style of stylesheets)for (let rule of style.cssRules)html_stylesheets += rule.cssText + '\n';
        style.innerHTML = html_stylesheets.replace(':host', `:is(${cssselector})`);
        document.head.append(style);
        alreadyDeclaredCSS.add(cssselector);
    }
} // idem HTML...
 /* if( c instanceof Promise || c instanceof Response) {

        all_deps.push( (async () => {

            c = await c;
            if( c instanceof Response )
                c = await c.text();

            stylesheets[idx] = process_css(c);

        })());

        return null as unknown as CSSStyleSheet;
    }
*/ 


/***/ }),

/***/ "./src/LISSBase.ts":
/*!*************************!*\
  !*** ./src/LISSBase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   setCstrHost: () => (/* binding */ setCstrHost)
/* harmony export */ });
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSHost */ "./src/LISSHost.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContentGenerator */ "./src/ContentGenerator.ts");


let __cstr_host = null;
function setCstrHost(_) {
    __cstr_host = _;
}
function LISS(args = {}) {
    let { /* extends is a JS reserved keyword. */ extends: _extends = Object, host = HTMLElement, content_generator = _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__["default"] } = args;
    class LISSBase extends _extends {
        constructor(...args){
            super(...args);
            // h4ck, okay because JS is monothreaded.
            if (__cstr_host === null) {
                (0,_LISSHost__WEBPACK_IMPORTED_MODULE_0__.setCstrBase)(this);
                __cstr_host = new this.constructor.Host(...args);
            }
            this.#host = __cstr_host;
            __cstr_host = null;
        }
        //TODO: do I really need to expose such structure here ?
        static get state() {
            return this.Host.state;
        }
        get state() {
            return this.#host.state;
        }
        //TODO: get the real type ?
        get content() {
            try {
                this.#host.content;
            } catch (e) {
                console.warn(e);
            }
            return this.#host.content;
        }
        static observedAttributes = [];
        attributeChangedCallback(name, oldValue, newValue) {}
        connectedCallback() {}
        disconnectedCallback() {}
        get isConnected() {
            return this.host.isConnected;
        }
        #host;
        get host() {
            return this.#host;
        }
        static _Host;
        static get Host() {
            if (this._Host === undefined) {
                // @ts-ignore: fuck off.
                this._Host = (0,_LISSHost__WEBPACK_IMPORTED_MODULE_0__.buildLISSHost)(this, host, content_generator, args);
            }
            return this._Host;
        }
    }
    return LISSBase;
}


/***/ }),

/***/ "./src/LISSHost.ts":
/*!*************************!*\
  !*** ./src/LISSHost.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildLISSHost: () => (/* binding */ buildLISSHost),
/* harmony export */   getSharedCSS: () => (/* binding */ getSharedCSS),
/* harmony export */   setCstrBase: () => (/* binding */ setCstrBase)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/state.ts");
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");



// LISSHost must be build in define as it need to be able to build
// the defined subclass.
let id = 0;
const sharedCSS = new CSSStyleSheet();
function getSharedCSS() {
    return sharedCSS;
}
let __cstr_base = null;
function setCstrBase(_) {
    __cstr_base = _;
}
function buildLISSHost(Liss, // can't deduce : cause type deduction issues...
hostCstr, content_generator_cstr, args) {
    const content_generator = new content_generator_cstr(args);
    class LISSHost extends hostCstr {
        static Cfg = {
            host: hostCstr,
            content_generator: content_generator_cstr,
            args
        };
        // adopt state if already created.
        state = this.state ?? new _state__WEBPACK_IMPORTED_MODULE_1__.LISSState(this);
        // ============ DEPENDENCIES ==================================
        static whenDepsResolved = content_generator.whenReady();
        static get isDepsResolved() {
            return content_generator.isReady;
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
        #params;
        initialize(...params) {
            if (this.isInitialized) throw new Error('Element already initialized!');
            if (!this.constructor.isDepsResolved) throw new Error("Dependencies hasn't been loaded !");
            if (params.length !== 0) {
                if (this.#params.length !== 0) throw new Error('Cstr params has already been provided !');
                this.#params = params;
            }
            this.#base = this.init();
            if (this.isConnected) this.#base.connectedCallback();
            return this.#base;
        }
        // ============== Content ===================
        #content = this;
        get content() {
            return this.#content;
        }
        getPart(name) {
            return this.hasShadow ? this.#content?.querySelector(`::part(${name})`) : this.#content?.querySelector(`[part="${name}"]`);
        }
        getParts(name) {
            return this.hasShadow ? this.#content?.querySelectorAll(`::part(${name})`) : this.#content?.querySelectorAll(`[part="${name}"]`);
        }
        attachShadow(init) {
            const shadow = super.attachShadow(init);
            // @ts-ignore closed IS assignable to shadowMode...
            this.shadowMode = init.mode;
            this.#content = shadow;
            return shadow;
        }
        get hasShadow() {
            return this.shadowMode !== 'none';
        }
        /*** CSS ***/ get CSSSelector() {
            if (this.hasShadow || !this.hasAttribute("is")) return this.tagName;
            return `${this.tagName}[is="${this.getAttribute("is")}"]`;
        }
        // ============== Impl ===================
        constructor(...params){
            super();
            this.#params = params;
            let { promise, resolve } = Promise.withResolvers();
            this.whenInitialized = promise;
            this.#whenInitialized_resolver = resolve;
            const base = __cstr_base;
            __cstr_base = null;
            if (base !== null) {
                this.#base = base;
                this.init(); // call the resolver
            }
            if ("_whenUpgradedResolve" in this) this._whenUpgradedResolve();
        }
        // ====================== DOM ===========================		
        disconnectedCallback() {
            if (this.base !== null) this.base.disconnectedCallback();
        }
        connectedCallback() {
            // TODO: life cycle options
            if (this.isInitialized) {
                this.base.connectedCallback();
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
        static observedAttributes = Liss.observedAttributes;
        attributeChangedCallback(name, oldValue, newValue) {
            if (this.#base) this.#base.attributeChangedCallback(name, oldValue, newValue);
        }
        shadowMode = null;
        get shadowRoot() {
            if (this.shadowMode === _types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.SEMIOPEN) return null;
            return super.shadowRoot;
        }
        init() {
            // no needs to set this.#content (already host or set when attachShadow)
            content_generator.generate(this);
            //@ts-ignore
            //this.#content.addEventListener('click', onClickEvent);
            //@ts-ignore
            //this.#content.addEventListener('dblclick', onClickEvent);
            if (this.#base === null) {
                // h4ck, okay because JS is monothreaded.
                (0,_LISSBase__WEBPACK_IMPORTED_MODULE_2__.setCstrHost)(this);
                this.#base = new LISSHost.Base(...this.#params);
            }
            this.#whenInitialized_resolver(this.base);
            return this.base;
        }
    }
    ;
    return LISSHost;
}


/***/ }),

/***/ "./src/core/customRegistery.ts":
/*!*************************************!*\
  !*** ./src/core/customRegistery.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _customRegistery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");


_extends__WEBPACK_IMPORTED_MODULE_1__["default"].define = _customRegistery__WEBPACK_IMPORTED_MODULE_0__.define;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenDefined = _customRegistery__WEBPACK_IMPORTED_MODULE_0__.whenDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenAllDefined = _customRegistery__WEBPACK_IMPORTED_MODULE_0__.whenAllDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].isDefined = _customRegistery__WEBPACK_IMPORTED_MODULE_0__.isDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getName = _customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getHostCstr = _customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getBaseCstr = _customRegistery__WEBPACK_IMPORTED_MODULE_0__.getBaseCstr;


/***/ }),

/***/ "./src/core/state.ts":
/*!***************************!*\
  !*** ./src/core/state.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./src/state.ts");
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");


_extends__WEBPACK_IMPORTED_MODULE_1__["default"].DEFINED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].DEFINED, _extends__WEBPACK_IMPORTED_MODULE_1__["default"].READY = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].READY;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].UPGRADED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].UPGRADED;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].INITIALIZED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].INITIALIZED;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getState = _state__WEBPACK_IMPORTED_MODULE_0__.getState;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].upgrade = _state__WEBPACK_IMPORTED_MODULE_0__.upgrade;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].initialize = _state__WEBPACK_IMPORTED_MODULE_0__.initialize;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].upgradeSync = _state__WEBPACK_IMPORTED_MODULE_0__.upgradeSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].initializeSync = _state__WEBPACK_IMPORTED_MODULE_0__.initializeSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenUpgraded = _state__WEBPACK_IMPORTED_MODULE_0__.whenUpgraded;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenInitialized = _state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized;


/***/ }),

/***/ "./src/customRegistery.ts":
/*!********************************!*\
  !*** ./src/customRegistery.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   define: () => (/* binding */ define),
/* harmony export */   getBaseCstr: () => (/* binding */ getBaseCstr),
/* harmony export */   getHostCstr: () => (/* binding */ getHostCstr),
/* harmony export */   getName: () => (/* binding */ getName),
/* harmony export */   isDefined: () => (/* binding */ isDefined),
/* harmony export */   whenAllDefined: () => (/* binding */ whenAllDefined),
/* harmony export */   whenDefined: () => (/* binding */ whenDefined)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

let x;
// Go to state DEFINED
function define(tagname, ComponentClass) {
    let Host = ComponentClass;
    // Brython class
    let bry_class = null;
    if ("$is_class" in ComponentClass) {
        bry_class = ComponentClass;
        ComponentClass = bry_class.__bases__.filter((e)=>e.__name__ === "Wrapper")[0]._js_klass.$js_func;
        ComponentClass.Host.Base = class {
            #bry;
            constructor(){
                // @ts-ignore
                this.#bry = __BRYTHON__.$call(bry_class, [
                    0,
                    0,
                    0
                ])();
            }
            #call(name, args) {
                // @ts-ignore
                __BRYTHON__.$call(__BRYTHON__.$getattr_pep657(this.#bry, name, [
                    0,
                    0,
                    0
                ]), [
                    0,
                    0,
                    0
                ])(...args);
            }
            connectedCallback(...args) {
                return this.#call("connectedCallback", args);
            }
            disconnectedCallback(...args) {
                return this.#call("disconnectedCallback", args);
            }
        };
    }
    if ("Host" in ComponentClass) Host = ComponentClass.Host;
    const Class = Host.Cfg.host;
    let htmltag = (0,_utils__WEBPACK_IMPORTED_MODULE_0__._element2tagname)(Class) ?? undefined;
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
    customElements.define(tagname, Host, opts);
}
async function whenDefined(tagname) {
    return await customElements.whenDefined(tagname);
}
async function whenAllDefined(tagnames) {
    await Promise.all(tagnames.map((t)=>customElements.whenDefined(t)));
}
function isDefined(name) {
    return customElements.get(name) !== undefined;
}
function getName(element) {
    if ("Host" in element.constructor) element = element.constructor.Host;
    if ("Host" in element) // @ts-ignore
    element = element.Host;
    if ("Base" in element.constructor) element = element.constructor;
    if ("Base" in element) {
        const name = customElements.getName(element);
        if (name === null) throw new Error("not defined!");
        return name;
    }
    if (!(element instanceof Element)) throw new Error('???');
    const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name.includes('-')) throw new Error(`Element ${name} is not a WebComponent`);
    return name;
}
function getHostCstr(name) {
    return customElements.get(name);
}
function getBaseCstr(name) {
    return getHostCstr(name).Base;
}


/***/ }),

/***/ "./src/extends.ts":
/*!************************!*\
  !*** ./src/extends.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ILISS: () => (/* binding */ ILISS),
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   _extends: () => (/* binding */ _extends),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSHost */ "./src/LISSHost.ts");


// used for plugins.
class ILISS {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISS);
function LISS(opts = {}) {
    if (opts.extends !== undefined && "Host" in opts.extends) return _extends(opts);
    return (0,_LISSBase__WEBPACK_IMPORTED_MODULE_0__.LISS)(opts);
}
function _extends(opts) {
    if (opts.extends === undefined) throw new Error('please provide a LISSBase!');
    const cfg = opts.extends.Host.Cfg;
    opts = Object.assign({}, opts, cfg, cfg.args);
    class ExtendedLISS extends opts.extends {
        constructor(...args){
            super(...args);
        }
        static _Host;
        // TS is stupid, requires explicit return type
        static get Host() {
            if (this._Host === undefined) // @ts-ignore fuck off
            this._Host = (0,_LISSHost__WEBPACK_IMPORTED_MODULE_1__.buildLISSHost)(this, opts.host, opts.content_generator, // @ts-ignore
            opts);
            return this._Host;
        }
    }
    return ExtendedLISS;
}


/***/ }),

/***/ "./src/helpers/LISSAuto.ts":
/*!*********************************!*\
  !*** ./src/helpers/LISSAuto.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LISSAuto_ContentGenerator: () => (/* binding */ LISSAuto_ContentGenerator)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");
/* harmony import */ var _customRegistery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ContentGenerator */ "./src/ContentGenerator.ts");



// should be improved (but how ?)
const script = document.querySelector('script[autodir]');
const RESSOURCES = [
    "index.js",
    "index.bry",
    "index.html",
    "index.css"
];
const KnownTags = new Set();
if (script !== null) {
    const SW = new Promise(async (resolve)=>{
        const sw_path = script.getAttribute('sw');
        if (sw_path === null) {
            console.warn("You are using LISS Auto mode without sw.js.");
            resolve();
            return;
        }
        try {
            await navigator.serviceWorker.register(sw_path, {
                scope: "/"
            });
        } catch (e) {
            console.warn("Registration of ServiceWorker failed");
            console.error(e);
            resolve();
        }
        if (navigator.serviceWorker.controller) {
            resolve();
            return;
        }
        navigator.serviceWorker.addEventListener('controllerchange', ()=>{
            resolve();
        });
    });
    let components_dir = script.getAttribute('autodir');
    /*
	if( components_dir[0] === '.') {
		components_dir = window.location.pathname + components_dir; // getting an absolute path.
	}
	*/ if (components_dir[components_dir.length - 1] !== '/') components_dir += '/';
    // observe for new injected tags.
    new MutationObserver((mutations)=>{
        for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition instanceof HTMLElement) addTag(addition);
    }).observe(document, {
        childList: true,
        subtree: true
    });
    for (let elem of document.querySelectorAll("*"))addTag(elem);
    async function addTag(tag) {
        await SW; // ensure SW is installed.
        const tagname = (tag.getAttribute('is') ?? tag.tagName).toLowerCase();
        let host = HTMLElement;
        if (tag.hasAttribute('is')) host = tag.constructor;
        if (!tagname.includes('-') || KnownTags.has(tagname)) return;
        importComponent(tagname, {
            //TODO: is Brython...
            cdir: components_dir,
            host
        });
    }
}
async function defineWebComponent(tagname, files, opts) {
    const c_js = files["index.js"];
    let klass = null;
    if (c_js !== undefined) {
        const file = new Blob([
            c_js
        ], {
            type: 'application/javascript'
        });
        const url = URL.createObjectURL(file);
        const oldreq = _extends__WEBPACK_IMPORTED_MODULE_0__["default"].require;
        _extends__WEBPACK_IMPORTED_MODULE_0__["default"].require = function(url) {
            if (typeof url === "string" && url.startsWith('./')) {
                const filename = url.slice(2);
                if (filename in files) return files[filename];
            }
            return oldreq(url);
        };
        klass = (await import(/* webpackIgnore: true */ url)).default;
        _extends__WEBPACK_IMPORTED_MODULE_0__["default"].require = oldreq;
    } else if (opts.html !== undefined) {
        klass = (0,_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
            ...opts,
            content_generator: LISSAuto_ContentGenerator
        });
    }
    if (klass === null) throw new Error(`Missing files for WebComponent ${tagname}.`);
    (0,_customRegistery__WEBPACK_IMPORTED_MODULE_1__.define)(tagname, klass);
    return klass;
}
// ================================================
// =============== LISS internal tools ============
// ================================================
async function _fetchText(uri, isLissAuto = false) {
    const options = isLissAuto ? {
        headers: {
            "liss-auto": "true"
        }
    } : {};
    const response = await fetch(uri, options);
    if (response.status !== 200) return undefined;
    if (isLissAuto && response.headers.get("status") === "404") return undefined;
    const answer = await response.text();
    if (answer === "") return undefined;
    return answer;
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
const converter = document.createElement('span');
function encodeHTML(text) {
    converter.textContent = text;
    return converter.innerHTML;
}
class LISSAuto_ContentGenerator extends _ContentGenerator__WEBPACK_IMPORTED_MODULE_2__["default"] {
    prepareHTML(html) {
        this.data = null;
        if (typeof html === 'string') {
            this.data = html;
            return null;
        /*
			html = html.replaceAll(/\$\{([\w]+)\}/g, (_, name: string) => {
				return `<liss value="${name}"></liss>`;
			});*/ //TODO: ${} in attr
        // - detect start ${ + end }
        // - register elem + attr name
        // - replace. 
        }
        return super.prepareHTML(html);
    }
    generate(host) {
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        if (this.data !== null) {
            const str = this.data.replace(/\$\{(.+?)\}/g, (_, match)=>encodeHTML(host.getAttribute(match) ?? ''));
            super.setTemplate(super.prepareHTML(str));
        }
        const content = super.generate(host);
        /*
		// html magic values.
		// can be optimized...
		const values = content.querySelectorAll('liss[value]');
		for(let value of values)
			value.textContent = host.getAttribute(value.getAttribute('value')!)
		*/ // css prop.
        const css_attrs = host.getAttributeNames().filter((e)=>e.startsWith('css-'));
        for (let css_attr of css_attrs)host.style.setProperty(`--${css_attr.slice('css-'.length)}`, host.getAttribute(css_attr));
        return content;
    }
}
async function importComponents(components, { cdir = null, brython = false, // @ts-ignore
host = HTMLElement }) {
    const results = {};
    for (let tagname of components){
        results[tagname] = await importComponent(tagname, {
            cdir,
            brython,
            host
        });
    }
    return results;
}
const bry_wrapper = `def wrapjs(js_klass):

    class Wrapper:

        _js_klass = js_klass
        _js = None

        def __init__(self, *args):
            self._js = js_klass.new(*args)

        def __getattr__(self, name: str):
            return self._js[name];

        def __setattr__(self, name: str, value):
            if name == "_js":
                super().__setattr__(name, value)
                return
            self._js[name] = value

    return Wrapper

`;
async function importComponent(tagname, { cdir = null, brython = false, // @ts-ignore
host = HTMLElement, files = null }) {
    KnownTags.add(tagname);
    const compo_dir = `${cdir}${tagname}/`;
    if (files === null) {
        files = {};
        const file = brython ? 'index.bry' : 'index.js';
        files[file] = await _fetchText(`${compo_dir}${file}`, true);
    }
    if (brython && files['index.bry'] !== undefined) {
        const code = bry_wrapper + files["index.bry"];
        files['index.js'] = `const $B = globalThis.__BRYTHON__;
const result = $B.runPythonSource(\`${code}\`);

const imported = [...Object.values(__BRYTHON__.imported)];
const last = imported[imported.length-1];

export default last.WebComponent;

`;
    }
    const html = files["index.html"];
    const css = files["index.css"];
    return await defineWebComponent(tagname, files, {
        html,
        css,
        host
    });
}
function require(url) {
    return fetch(url);
}
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].importComponents = importComponents;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].importComponent = importComponent;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].require = require;


/***/ }),

/***/ "./src/helpers/build.ts":
/*!******************************!*\
  !*** ./src/helpers/build.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   liss: () => (/* binding */ liss),
/* harmony export */   lissSync: () => (/* binding */ lissSync)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./src/state.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");


async function liss(str, ...args) {
    const elem = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return await (0,_state__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
}
function lissSync(str, ...args) {
    const elem = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
}


/***/ }),

/***/ "./src/helpers/events.ts":
/*!*******************************!*\
  !*** ./src/helpers/events.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomEvent2: () => (/* binding */ CustomEvent2),
/* harmony export */   EventTarget2: () => (/* binding */ EventTarget2),
/* harmony export */   WithEvents: () => (/* binding */ WithEvents),
/* harmony export */   eventMatches: () => (/* binding */ eventMatches)
/* harmony export */ });
class EventTarget2 extends EventTarget {
    addEventListener(type, callback, options) {
        //@ts-ignore
        return super.addEventListener(type, callback, options);
    }
    dispatchEvent(event) {
        return super.dispatchEvent(event);
    }
    removeEventListener(type, listener, options) {
        //@ts-ignore
        super.removeEventListener(type, listener, options);
    }
}
class CustomEvent2 extends CustomEvent {
    constructor(type, args){
        super(type, {
            detail: args
        });
    }
    get type() {
        return super.type;
    }
}
function WithEvents(ev, _events) {
    if (!(ev instanceof EventTarget)) return ev;
    // is also a mixin
    // @ts-ignore
    class EventTargetMixins extends ev {
        #ev = new EventTarget2();
        addEventListener(...args) {
            // @ts-ignore
            return this.#ev.addEventListener(...args);
        }
        removeEventListener(...args) {
            // @ts-ignore
            return this.#ev.removeEventListener(...args);
        }
        dispatchEvent(...args) {
            // @ts-ignore
            return this.#ev.dispatchEvent(...args);
        }
    }
    return EventTargetMixins;
}
// ================================================
// =============== LISS ShadowRoot tools ==========
// ================================================
function eventMatches(ev, selector) {
    let elements = ev.composedPath().slice(0, -2).filter((e)=>!(e instanceof ShadowRoot)).reverse();
    for (let elem of elements)if (elem.matches(selector)) return elem;
    return null;
}


/***/ }),

/***/ "./src/helpers/querySelectors.ts":
/*!***************************************!*\
  !*** ./src/helpers/querySelectors.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./src/state.ts");
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");


function liss_selector(name) {
    if (name === undefined) return "";
    return `:is(${name}, [is="${name}"])`;
}
function _buildQS(selector, tagname_or_parent, parent = document) {
    if (tagname_or_parent !== undefined && typeof tagname_or_parent !== 'string') {
        parent = tagname_or_parent;
        tagname_or_parent = undefined;
    }
    return [
        `${selector}${liss_selector(tagname_or_parent)}`,
        parent
    ];
}
async function qs(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    let result = await qso(selector, parent);
    if (result === null) throw new Error(`Element ${selector} not found`);
    return result;
}
async function qso(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null) return null;
    return await (0,_state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized)(element);
}
async function qsa(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const promises = new Array(elements.length);
    for (let element of elements)promises[idx++] = (0,_state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized)(element);
    return await Promise.all(promises);
}
async function qsc(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return await (0,_state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized)(result);
}
function qsSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null) throw new Error(`Element ${selector} not found`);
    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(element);
}
function qsaSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const result = new Array(elements.length);
    for (let element of elements)result[idx++] = (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(element);
    return result;
}
function qscSync(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(result);
}
// ==================
function closest(selector, element) {
    while(true){
        var result = element.closest(selector);
        if (result !== null) return result;
        const root = element.getRootNode();
        if (!("host" in root)) return null;
        element = root.host;
    }
}
// async
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qs = qs;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qso = qso;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qsa = qsa;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qsc = qsc;
// sync
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qsSync = qsSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qsaSync = qsaSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qscSync = qscSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].closest = closest;


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
/* harmony export */   getState: () => (/* binding */ getState),
/* harmony export */   initialize: () => (/* binding */ initialize),
/* harmony export */   initializeSync: () => (/* binding */ initializeSync),
/* harmony export */   upgrade: () => (/* binding */ upgrade),
/* harmony export */   upgradeSync: () => (/* binding */ upgradeSync),
/* harmony export */   whenInitialized: () => (/* binding */ whenInitialized),
/* harmony export */   whenUpgraded: () => (/* binding */ whenUpgraded)
/* harmony export */ });
/* harmony import */ var _customRegistery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


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
        return customElements.get((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(this.#elem)) !== undefined;
    }
    async whenDefined() {
        if (this.#elem === null) throw new Error('not implemented');
        return await customElements.whenDefined((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(this.#elem));
    }
    // ================== READY ==============================
    get isReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const Host = (0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr)((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(elem));
        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.isDOMContentLoaded)()) return false;
        return Host.isDepsResolved;
    }
    async whenReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        const host = await this.whenDefined(); // could be ready before defined, but well...
        await _utils__WEBPACK_IMPORTED_MODULE_1__.whenDOMContentLoaded;
        await host.whenDepsResolved;
    }
    // ================== UPGRADED ==============================
    get isUpgraded() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const host = (0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr)((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(elem));
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
    const Host = (0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr)((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(elem));
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
    let params = typeof strict === "boolean" ? [] : strict;
    host.initialize(...params);
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
    let params = typeof strict === "boolean" ? [] : strict;
    host.initialize(...params);
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
    ShadowCfg["SEMIOPEN"] = "semi-open";
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
/* harmony export */   html: () => (/* binding */ html),
/* harmony export */   isDOMContentLoaded: () => (/* binding */ isDOMContentLoaded),
/* harmony export */   isShadowSupported: () => (/* binding */ isShadowSupported),
/* harmony export */   waitDOMContentLoaded: () => (/* binding */ waitDOMContentLoaded),
/* harmony export */   whenDOMContentLoaded: () => (/* binding */ whenDOMContentLoaded)
/* harmony export */ });
// functions required by LISS.
// fix Array.isArray
// cf https://github.com/microsoft/TypeScript/issues/17002#issuecomment-2366749050
// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
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
    if (Class instanceof HTMLElement) Class = Class.constructor;
    if (Class === HTMLElement) return null;
    let cursor = Class;
    // @ts-ignore
    while(cursor.__proto__ !== HTMLElement)// @ts-ignore
    cursor = cursor.__proto__;
    // directly inherit HTMLElement
    if (!cursor.name.startsWith('HTML') && !cursor.name.endsWith('Element')) return null;
    const htmltag = cursor.name.slice(4, -7);
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
// for mixins.
/*
export type ComposeConstructor<T, U> = 
    [T, U] extends [new (a: infer O1) => infer R1,new (a: infer O2) => infer R2] ? {
        new (o: O1 & O2): R1 & R2
    } & Pick<T, keyof T> & Pick<U, keyof U> : never
*/ // moved here instead of build to prevent circular deps.
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
/* harmony export */   ContentGenerator: () => (/* reexport safe */ _ContentGenerator__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   CustomEvent2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_8__.CustomEvent2),
/* harmony export */   EventTarget2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_8__.EventTarget2),
/* harmony export */   LISSAuto_ContentGenerator: () => (/* reexport safe */ _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_4__.LISSAuto_ContentGenerator),
/* harmony export */   ShadowCfg: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_6__.ShadowCfg),
/* harmony export */   WithEvents: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_8__.WithEvents),
/* harmony export */   _extends: () => (/* reexport safe */ _extends__WEBPACK_IMPORTED_MODULE_0__._extends),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   eventMatches: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_8__.eventMatches),
/* harmony export */   html: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_9__.html),
/* harmony export */   liss: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_7__.liss),
/* harmony export */   lissSync: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_7__.lissSync)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extends */ "./src/extends.ts");
/* harmony import */ var _core_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/state */ "./src/core/state.ts");
/* harmony import */ var _core_customRegistery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/customRegistery */ "./src/core/customRegistery.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ContentGenerator */ "./src/ContentGenerator.ts");
/* harmony import */ var _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/LISSAuto */ "./src/helpers/LISSAuto.ts");
/* harmony import */ var _helpers_querySelectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers/querySelectors */ "./src/helpers/querySelectors.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _helpers_build__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers/build */ "./src/helpers/build.ts");
/* harmony import */ var _helpers_events__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./helpers/events */ "./src/helpers/events.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");




//TODO: BLISS
//TODO: events.ts
//TODO: globalCSSRules






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_extends__WEBPACK_IMPORTED_MODULE_0__["default"]);
// for debug.


var __webpack_exports__ContentGenerator = __webpack_exports__.ContentGenerator;
var __webpack_exports__CustomEvent2 = __webpack_exports__.CustomEvent2;
var __webpack_exports__EventTarget2 = __webpack_exports__.EventTarget2;
var __webpack_exports__LISSAuto_ContentGenerator = __webpack_exports__.LISSAuto_ContentGenerator;
var __webpack_exports__ShadowCfg = __webpack_exports__.ShadowCfg;
var __webpack_exports__WithEvents = __webpack_exports__.WithEvents;
var __webpack_exports___extends = __webpack_exports__._extends;
var __webpack_exports__default = __webpack_exports__["default"];
var __webpack_exports__eventMatches = __webpack_exports__.eventMatches;
var __webpack_exports__html = __webpack_exports__.html;
var __webpack_exports__liss = __webpack_exports__.liss;
var __webpack_exports__lissSync = __webpack_exports__.lissSync;
export { __webpack_exports__ContentGenerator as ContentGenerator, __webpack_exports__CustomEvent2 as CustomEvent2, __webpack_exports__EventTarget2 as EventTarget2, __webpack_exports__LISSAuto_ContentGenerator as LISSAuto_ContentGenerator, __webpack_exports__ShadowCfg as ShadowCfg, __webpack_exports__WithEvents as WithEvents, __webpack_exports___extends as _extends, __webpack_exports__default as default, __webpack_exports__eventMatches as eventMatches, __webpack_exports__html as html, __webpack_exports__liss as liss, __webpack_exports__lissSync as lissSync };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFVBQVUsQ0FBQyxFQUFFdFAsR0FBRyxDQUFDdVAsSUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2QiwwQkFBMEI7SUFDOUI7SUFFQSxvREFBb0Q7SUFDcEQsSUFBSS9SLFdBQVdpQixTQUFTQyxhQUFhLENBQUM7SUFDdEMsdURBQXVEO0lBQ3ZEbEIsU0FBUzBDLFNBQVMsR0FBR29QLE9BQU9yUCxJQUFJO0lBRWhDLElBQUl6QyxTQUFTUSxPQUFPLENBQUNJLFVBQVUsQ0FBQ0MsTUFBTSxLQUFLLEtBQUtiLFNBQVNRLE9BQU8sQ0FBQ3dSLFVBQVUsQ0FBRUMsUUFBUSxLQUFLQyxLQUFLQyxTQUFTLEVBQ3RHLE9BQU9uUyxTQUFTUSxPQUFPLENBQUN3UixVQUFVO0lBRXBDLE9BQU9oUyxTQUFTUSxPQUFPO0FBQzNCOzs7Ozs7O1NDMUhBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFFUDtBQUNVO0FBRStCO0FBRS9ELGFBQWE7QUFFYixpQkFBaUI7QUFDakIsc0JBQXNCO0FBQ3VDO0FBQzNCO0FBRUE7QUFFYTtBQUN1QztBQUN6RDtBQUM3QixpRUFBZXVELGdEQUFJQSxFQUFDO0FBRXBCLGFBQWE7QUFDc0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY29yZS9jdXN0b21SZWdpc3RlcnkudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9jb3JlL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY3VzdG9tUmVnaXN0ZXJ5LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFNoYXJlZENTUyB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSG9zdCwgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgaXNTaGFkb3dTdXBwb3J0ZWQsIHdhaXRET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxudHlwZSBIVE1MID0gRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmc7XG50eXBlIENTUyAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7XG4gICAgaHRtbCAgID86IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nLFxuICAgIGNzcyAgICA/OiBDU1MgfCByZWFkb25seSBDU1NbXSxcbiAgICBzaGFkb3cgPzogU2hhZG93Q2ZnfG51bGxcbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvckNzdHIgPSB7IG5ldyhvcHRzOiBDb250ZW50R2VuZXJhdG9yX09wdHMpOiBDb250ZW50R2VuZXJhdG9yIH07XG5cbmNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcbmNvbnN0IHNoYXJlZENTUyA9IGdldFNoYXJlZENTUygpOyAvLyBmcm9tIExJU1NIb3N0Li4uXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgI3N0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W107XG4gICAgI3RlbXBsYXRlICAgOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGw7XG4gICAgI3NoYWRvdyAgICAgOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGh0bWwsXG4gICAgICAgIGNzcyAgICA9IFtdLFxuICAgICAgICBzaGFkb3cgPSBudWxsLFxuICAgIH06IENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4jc2hhZG93ICAgPSBzaGFkb3c7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGhpcy5wcmVwYXJlSFRNTChodG1sKTtcbiAgICBcbiAgICAgICAgdGhpcy4jc3R5bGVzaGVldHMgPSB0aGlzLnByZXBhcmVDU1MoY3NzKTtcblxuICAgICAgICB0aGlzLiNpc1JlYWR5ICAgPSBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgdGhpcy4jd2hlblJlYWR5ID0gd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcblxuICAgICAgICAvL1RPRE86IG90aGVyIGRlcHMuLi5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0VGVtcGxhdGUodGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jdGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAjd2hlblJlYWR5OiBQcm9taXNlPHVua25vd24+O1xuICAgICNpc1JlYWR5ICA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZWFkeTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuI2lzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiN3aGVuUmVhZHk7XG4gICAgICAgIC8vVE9ETzogZGVwcy5cbiAgICAgICAgLy9UT0RPOiBDU1MvSFRNTCByZXNvdXJjZXMuLi5cblxuICAgICAgICAvLyBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuICAgICAgICAvLyBfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcbiAgICAgICAgLy8gKyBjZiBhdCB0aGUgZW5kLi4uXG4gICAgfVxuXG4gICAgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnR8U2hhZG93Um9vdCB7XG5cbiAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLiAgICAgXG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pbml0U2hhZG93KGhvc3QpO1xuXG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHRhcmdldCwgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGlmKCBob3N0LnNoYWRvd01vZGUgIT09IFNoYWRvd0NmZy5OT05FIHx8IHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKGNvbnRlbnQpO1xuXG4gICAgICAgIGlmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICYmIHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMClcblx0XHRcdHRhcmdldC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoaG9zdCk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFNoYWRvdzxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpIHtcblxuICAgICAgICBjb25zdCBjYW5IYXZlU2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCk7XG4gICAgICAgIGlmKCB0aGlzLiNzaGFkb3cgIT09IG51bGwgJiYgdGhpcy4jc2hhZG93ICE9PSBTaGFkb3dDZmcuTk9ORSAmJiAhIGNhbkhhdmVTaGFkb3cgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgICAgICBsZXQgbW9kZSA9IHRoaXMuI3NoYWRvdztcbiAgICAgICAgaWYoIG1vZGUgPT09IG51bGwgKVxuICAgICAgICAgICAgbW9kZSA9IGNhbkhhdmVTaGFkb3cgPyBTaGFkb3dDZmcuU0VNSU9QRU4gOiBTaGFkb3dDZmcuTk9ORTtcblxuICAgICAgICBob3N0LnNoYWRvd01vZGUgPSBtb2RlO1xuXG4gICAgICAgIGlmKCBtb2RlID09PSBTaGFkb3dDZmcuU0VNSU9QRU4pXG4gICAgICAgICAgICBtb2RlID0gU2hhZG93Q2ZnLk9QRU47IC8vIFRPRE86IHNldCB0byBYLlxuXG4gICAgICAgIGxldCB0YXJnZXQ6IEhvc3R8U2hhZG93Um9vdCA9IGhvc3Q7XG4gICAgICAgIGlmKCBtb2RlICE9PSBTaGFkb3dDZmcuTk9ORSlcbiAgICAgICAgICAgIHRhcmdldCA9IGhvc3QuYXR0YWNoU2hhZG93KHttb2RlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUNTUyhjc3M6IENTU3xyZWFkb25seSBDU1NbXSkge1xuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgcmV0dXJuIGNzcy5tYXAoZSA9PiB0aGlzLnByb2Nlc3NDU1MoZSkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NTUyhjc3M6IENTUykge1xuXG4gICAgICAgIGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG4gICAgICAgICAgICByZXR1cm4gY3NzO1xuICAgICAgICBpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBjc3Muc2hlZXQhO1xuICAgIFxuICAgICAgICBpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY29uc29sZS53YXJuKGNzcyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJcIik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVIVE1MKGh0bWw/OiBIVE1MKTogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsIHtcbiAgICBcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgICAgIGlmKGh0bWwgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcblxuICAgICAgICAvLyBzdHIyaHRtbFxuICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGh0bWwudHJpbSgpO1xuXG4gICAgICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggaHRtbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IClcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICB0ZW1wbGF0ZS5hcHBlbmQoaHRtbCk7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBpbmplY3RDU1M8SG9zdCBleHRlbmRzIExIb3N0Pih0YXJnZXQ6IFNoYWRvd1Jvb3R8SG9zdCwgc3R5bGVzaGVldHM6IGFueVtdKSB7XG5cbiAgICAgICAgaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTLCAuLi5zdHlsZXNoZWV0cyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjc3NzZWxlY3RvciA9IHRhcmdldC5DU1NTZWxlY3RvcjsgLy9UT0RPLi4uXG5cbiAgICAgICAgaWYoIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpIClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuICAgICAgICBsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG4gICAgICAgIGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG4gICAgICAgICAgICBmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG4gICAgICAgICAgICAgICAgaHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG4gICAgICAgIGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuICAgIH1cbn1cblxuLy8gaWRlbSBIVE1MLi4uXG4vKiBpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgYyA9IGF3YWl0IGM7XG4gICAgICAgICAgICBpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcbiAgICAgICAgICAgICAgICBjID0gYXdhaXQgYy50ZXh0KCk7XG5cbiAgICAgICAgICAgIHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuICAgICAgICB9KSgpKTtcblxuICAgICAgICByZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG4gICAgfVxuKi8iLCJpbXBvcnQgeyBMSG9zdENzdHIsIHR5cGUgQ2xhc3MsIHR5cGUgQ29uc3RydWN0b3IsIHR5cGUgTElTU19PcHRzIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgTElTU1N0YXRlIH0gZnJvbSBcIi4vc3RhdGVcIjtcblxuaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCwgc2V0Q3N0ckJhc2UgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZX0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdC8vIEhUTUwgQmFzZVxuXHRIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+KGFyZ3M6IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj4gPSB7fSkge1xuXG5cdGxldCB7XG5cdFx0LyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG5cdFx0ZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgICAgICBhcyB1bmtub3duIGFzIEV4dGVuZHNDdHIsXG5cdFx0aG9zdCAgICAgICAgICAgICAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRcblx0XHRjb250ZW50X2dlbmVyYXRvciA9IENvbnRlbnRHZW5lcmF0b3IsXG5cdH0gPSBhcmdzO1xuXHRcblx0Y2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBfZXh0ZW5kcyB7XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsICkge1xuXHRcdFx0XHRzZXRDc3RyQmFzZSh0aGlzKTtcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KC4uLmFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogZG8gSSByZWFsbHkgbmVlZCB0byBleHBvc2Ugc3VjaCBzdHJ1Y3R1cmUgaGVyZSA/XG5cdFx0c3RhdGljIGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuSG9zdC5zdGF0ZTtcblx0XHR9XG5cblx0XHRnZXQgc3RhdGUoKTogTElTU1N0YXRlIHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0LnN0YXRlO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR0aGlzLiNob3N0LmNvbnRlbnQhO1xuXHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3QuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge31cblxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaG9zdC5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogSW5zdGFuY2VUeXBlPExIb3N0Q3N0cjxIb3N0Q3N0cj4+O1xuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgX0hvc3Q6IExIb3N0Q3N0cjxIb3N0Q3N0cj47XG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlOiBmdWNrIG9mZi5cblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QoIHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aG9zdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcmdzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQmFzZTtcbn0iLCJpbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIFNoYWRvd0NmZywgdHlwZSBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwiLi9zdGF0ZVwiO1xuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuaW1wb3J0IHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLy8gTElTU0hvc3QgbXVzdCBiZSBidWlsZCBpbiBkZWZpbmUgYXMgaXQgbmVlZCB0byBiZSBhYmxlIHRvIGJ1aWxkXG4vLyB0aGUgZGVmaW5lZCBzdWJjbGFzcy5cblxubGV0IGlkID0gMDtcblxuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFyZWRDU1MoKSB7XG5cdHJldHVybiBzaGFyZWRDU1M7XG59XG5cbmxldCBfX2NzdHJfYmFzZSAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckJhc2UoXzogYW55KSB7XG5cdF9fY3N0cl9iYXNlID0gXztcbn1cblxudHlwZSBpbmZlckhvc3RDc3RyPFQ+ID0gVCBleHRlbmRzIExJU1NCYXNlQ3N0cjxpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LCBpbmZlciBCIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA/IEIgOiBuZXZlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XHRUIGV4dGVuZHMgTElTU0Jhc2VDc3RyLCBVIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gaW5mZXJIb3N0Q3N0cjxUPiA+KFxuXHRcdFx0XHRcdFx0XHRMaXNzOiBULFxuXHRcdFx0XHRcdFx0XHQvLyBjYW4ndCBkZWR1Y2UgOiBjYXVzZSB0eXBlIGRlZHVjdGlvbiBpc3N1ZXMuLi5cblx0XHRcdFx0XHRcdFx0aG9zdENzdHI6IFUsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHI6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuXHRcdFx0XHRcdFx0XHRhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG5cdFx0XHRcdFx0XHQpIHtcblxuXHRjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcl9jc3RyKGFyZ3MpO1xuXG5cdHR5cGUgSG9zdENzdHIgPSBVO1xuICAgIHR5cGUgSG9zdCAgICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdGNsYXNzIExJU1NIb3N0IGV4dGVuZHMgaG9zdENzdHIge1xuXG5cdFx0c3RhdGljIHJlYWRvbmx5IENmZyA9IHtcblx0XHRcdGhvc3QgICAgICAgICAgICAgOiBob3N0Q3N0cixcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBjb250ZW50X2dlbmVyYXRvcl9jc3RyLFxuXHRcdFx0YXJnc1xuXHRcdH1cblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdCNwYXJhbXM6IGFueVtdO1xuXHRcdGluaXRpYWxpemUoLi4ucGFyYW1zOiBhbnlbXSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRpZiggcGFyYW1zLmxlbmd0aCAhPT0gMCApIHtcblx0XHRcdFx0aWYoIHRoaXMuI3BhcmFtcy5sZW5ndGggIT09IDAgKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ3N0ciBwYXJhbXMgaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZCAhJyk7XG5cdFx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdHRoaXMuI2Jhc2UuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290ID0gdGhpcyBhcyBIb3N0O1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgYXR0YWNoU2hhZG93KGluaXQ6IFNoYWRvd1Jvb3RJbml0KTogU2hhZG93Um9vdCB7XG5cdFx0XHRjb25zdCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3coaW5pdCk7XG5cblx0XHRcdC8vIEB0cy1pZ25vcmUgY2xvc2VkIElTIGFzc2lnbmFibGUgdG8gc2hhZG93TW9kZS4uLlxuXHRcdFx0dGhpcy5zaGFkb3dNb2RlID0gaW5pdC5tb2RlO1xuXG5cdFx0XHR0aGlzLiNjb250ZW50ID0gc2hhZG93O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc2hhZG93O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2hhZG93TW9kZSAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKC4uLnBhcmFtczogYW55W10pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGNvbnN0IGJhc2UgPSBfX2NzdHJfYmFzZTtcblx0XHRcdF9fY3N0cl9iYXNlID0gbnVsbDtcblxuXHRcdFx0aWYoIGJhc2UgIT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy4jYmFzZSA9IGJhc2U7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdGlmKHRoaXMuYmFzZSAhPT0gbnVsbClcblx0XHRcdFx0dGhpcy5iYXNlLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApIHtcblx0XHRcdFx0dGhpcy5iYXNlIS5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuc3RhdGUuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCB0aGlzLnN0YXRlLmlzUmVhZHk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gTGlzcy5vYnNlcnZlZEF0dHJpYnV0ZXM7XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKHRoaXMuI2Jhc2UpXG5cdFx0XHRcdHRoaXMuI2Jhc2UuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0c2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGwgPSBudWxsO1xuXG5cdFx0b3ZlcnJpZGUgZ2V0IHNoYWRvd1Jvb3QoKSB7XG5cdFx0XHRpZih0aGlzLnNoYWRvd01vZGUgPT09IFNoYWRvd0NmZy5TRU1JT1BFTilcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRyZXR1cm4gc3VwZXIuc2hhZG93Um9vdDtcblx0XHR9XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cblx0XHRcdC8vIG5vIG5lZWRzIHRvIHNldCB0aGlzLiNjb250ZW50IChhbHJlYWR5IGhvc3Qgb3Igc2V0IHdoZW4gYXR0YWNoU2hhZG93KVxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3IuZ2VuZXJhdGUodGhpcyk7XG5cblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblxuXHRcdFx0aWYoIHRoaXMuI2Jhc2UgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdFx0XHRcdHRoaXMuI2Jhc2UgPSBuZXcgTElTU0hvc3QuQmFzZSguLi50aGlzLiNwYXJhbXMpIGFzIEluc3RhbmNlVHlwZTxUPjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuYmFzZSk7XG5cblx0XHRcdHJldHVybiB0aGlzLmJhc2U7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBMSVNTSG9zdDtcbn1cblxuXG4iLCJcbmltcG9ydCB7IGRlZmluZSwgZ2V0QmFzZUNzdHIsIGdldEhvc3RDc3RyLCBnZXROYW1lLCBpc0RlZmluZWQsIHdoZW5BbGxEZWZpbmVkLCB3aGVuRGVmaW5lZCB9IGZyb20gXCIuLi9jdXN0b21SZWdpc3RlcnlcIjtcblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0d2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG5cdFx0Z2V0SG9zdENzdHIgICAgOiB0eXBlb2YgZ2V0SG9zdENzdHI7XG5cdFx0Z2V0QmFzZUNzdHIgICAgOiB0eXBlb2YgZ2V0QmFzZUNzdHI7XG4gICAgfVxufVxuXG5MSVNTLmRlZmluZSAgICAgICAgID0gZGVmaW5lO1xuTElTUy53aGVuRGVmaW5lZCAgICA9IHdoZW5EZWZpbmVkO1xuTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lO1xuTElTUy5nZXRIb3N0Q3N0ciAgICA9IGdldEhvc3RDc3RyO1xuTElTUy5nZXRCYXNlQ3N0ciAgICA9IGdldEJhc2VDc3RyOyIsIlxuaW1wb3J0IHsgREVGSU5FRCwgZ2V0U3RhdGUsIGluaXRpYWxpemUsIElOSVRJQUxJWkVELCBpbml0aWFsaXplU3luYywgUkVBRFksIHVwZ3JhZGUsIFVQR1JBREVELCB1cGdyYWRlU3luYywgd2hlbkluaXRpYWxpemVkLCB3aGVuVXBncmFkZWQgfSBmcm9tIFwiLi4vc3RhdGVcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBERUZJTkVEICAgIDogdHlwZW9mIERFRklORUQsXG4gICAgICAgIFJFQURZICAgICAgOiB0eXBlb2YgUkVBRFk7XG4gICAgICAgIFVQR1JBREVEICAgOiB0eXBlb2YgVVBHUkFERUQ7XG4gICAgICAgIElOSVRJQUxJWkVEOiB0eXBlb2YgSU5JVElBTElaRUQ7XG4gICAgICAgIGdldFN0YXRlICAgICAgIDogdHlwZW9mIGdldFN0YXRlO1xuICAgICAgICB1cGdyYWRlICAgICAgICA6IHR5cGVvZiB1cGdyYWRlO1xuICAgICAgICBpbml0aWFsaXplICAgICA6IHR5cGVvZiBpbml0aWFsaXplO1xuICAgICAgICB1cGdyYWRlU3luYyAgICA6IHR5cGVvZiB1cGdyYWRlU3luYztcbiAgICAgICAgaW5pdGlhbGl6ZVN5bmMgOiB0eXBlb2YgaW5pdGlhbGl6ZVN5bmM7XG4gICAgICAgIHdoZW5VcGdyYWRlZCAgIDogdHlwZW9mIHdoZW5VcGdyYWRlZDtcbiAgICAgICAgd2hlbkluaXRpYWxpemVkOiB0eXBlb2Ygd2hlbkluaXRpYWxpemVkO1xuICAgIH1cbn1cblxuTElTUy5ERUZJTkVEICAgID0gTElTUy5ERUZJTkVELFxuTElTUy5SRUFEWSAgICAgID0gTElTUy5SRUFEWTtcbkxJU1MuVVBHUkFERUQgICA9IExJU1MuVVBHUkFERUQ7XG5MSVNTLklOSVRJQUxJWkVEPSBMSVNTLklOSVRJQUxJWkVEO1xuXG5MSVNTLmdldFN0YXRlICAgICAgID0gZ2V0U3RhdGU7XG5MSVNTLnVwZ3JhZGUgICAgICAgID0gdXBncmFkZTtcbkxJU1MuaW5pdGlhbGl6ZSAgICAgPSBpbml0aWFsaXplO1xuTElTUy51cGdyYWRlU3luYyAgICA9IHVwZ3JhZGVTeW5jO1xuTElTUy5pbml0aWFsaXplU3luYyA9IGluaXRpYWxpemVTeW5jO1xuTElTUy53aGVuVXBncmFkZWQgICA9IHdoZW5VcGdyYWRlZDtcbkxJU1Mud2hlbkluaXRpYWxpemVkPSB3aGVuSW5pdGlhbGl6ZWQ7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCB4OiBhbnk7XG5cbi8vIEdvIHRvIHN0YXRlIERFRklORURcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD4pIHtcblxuXHRsZXQgSG9zdDogTElTU0hvc3RDc3RyPFQ+ID0gQ29tcG9uZW50Q2xhc3MgYXMgYW55O1xuXG5cdC8vIEJyeXRob24gY2xhc3Ncblx0bGV0IGJyeV9jbGFzczogYW55ID0gbnVsbDtcblx0aWYoIFwiJGlzX2NsYXNzXCIgaW4gQ29tcG9uZW50Q2xhc3MgKSB7XG5cblx0XHRicnlfY2xhc3MgPSBDb21wb25lbnRDbGFzcztcblxuXHRcdENvbXBvbmVudENsYXNzID0gYnJ5X2NsYXNzLl9fYmFzZXNfXy5maWx0ZXIoIChlOiBhbnkpID0+IGUuX19uYW1lX18gPT09IFwiV3JhcHBlclwiKVswXS5fanNfa2xhc3MuJGpzX2Z1bmM7XG5cdFx0KENvbXBvbmVudENsYXNzIGFzIGFueSkuSG9zdC5CYXNlID0gY2xhc3Mge1xuXG5cdFx0XHQjYnJ5OiBhbnk7XG5cblx0XHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHRoaXMuI2JyeSA9IF9fQlJZVEhPTl9fLiRjYWxsKGJyeV9jbGFzcywgWzAsMCwwXSkoKVxuXHRcdFx0fVxuXG5cdFx0XHQjY2FsbChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0X19CUllUSE9OX18uJGNhbGwoX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgbmFtZSwgWzAsMCwwXSksIFswLDAsMF0pKC4uLmFyZ3MpXG5cdFx0XHR9XG5cblx0XHRcdGNvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG5cblx0aWYoIFwiSG9zdFwiIGluIENvbXBvbmVudENsYXNzIClcblx0XHRIb3N0ID0gQ29tcG9uZW50Q2xhc3MuSG9zdCBhcyBhbnk7XG4gICAgXG4gICAgY29uc3QgQ2xhc3MgID0gSG9zdC5DZmcuaG9zdDtcbiAgICBsZXQgaHRtbHRhZyAgPSBfZWxlbWVudDJ0YWduYW1lKENsYXNzKT8/dW5kZWZpbmVkO1xuXG4gICAgY29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG4gICAgICAgICAgICAgICAgOiB7ZXh0ZW5kczogaHRtbHRhZ307XG5cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgSG9zdCwgb3B0cyk7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRlZmluZWQodGFnbmFtZTogc3RyaW5nICkge1xuXHRyZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10pIDogUHJvbWlzZTx2b2lkPiB7XG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQobmFtZTogc3RyaW5nKSB7XG5cdHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQobmFtZSkgIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnR8TElTU0Jhc2V8TElTU0Jhc2VDc3RyfExJU1NIb3N0PExJU1NCYXNlPnxMSVNTSG9zdENzdHI8TElTU0Jhc2U+ICk6IHN0cmluZyB7XG5cblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQuY29uc3RydWN0b3IpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuY29uc3RydWN0b3IuSG9zdCBhcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+O1xuXHRpZiggXCJIb3N0XCIgaW4gZWxlbWVudClcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuSG9zdDtcblx0aWYoIFwiQmFzZVwiIGluIGVsZW1lbnQuY29uc3RydWN0b3IpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuY29uc3RydWN0b3IgYXMgTElTU0hvc3RDc3RyPExJU1NCYXNlPjtcblxuXHRpZiggXCJCYXNlXCIgaW4gZWxlbWVudCkge1xuXHRcdGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG5cdFx0aWYobmFtZSA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vdCBkZWZpbmVkIVwiKTtcblxuXHRcdHJldHVybiBuYW1lO1xuXHR9XG5cblx0aWYoICEgKGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKCc/Pz8nKTtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KG5hbWU6IHN0cmluZyk6IFQge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihuYW1lOiBzdHJpbmcpOiBUIHtcblx0cmV0dXJuIGdldEhvc3RDc3RyPExJU1NIb3N0Q3N0cjxUPj4obmFtZSkuQmFzZSBhcyBUO1xufSIsImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5cbi8vIHVzZWQgZm9yIHBsdWdpbnMuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUztcblxuLy8gZXh0ZW5kcyBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgIEV4dGVuZHNDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyLFxuICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgIE9wdHMgZXh0ZW5kcyBMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj5cbiAgICA+KG9wdHM6IHtleHRlbmRzOiBFeHRlbmRzQ3N0cn0gJiBQYXJ0aWFsPE9wdHM+KTogUmV0dXJuVHlwZTx0eXBlb2YgX2V4dGVuZHM8RXh0ZW5kc0NzdHIsIE9wdHM+PlxuLy8gTElTU0Jhc2Ugc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTKG9wdHM6IGFueSA9IHt9KTogTElTU0Jhc2VDc3RyXG57XG4gICAgaWYoIG9wdHMuZXh0ZW5kcyAhPT0gdW5kZWZpbmVkICYmIFwiSG9zdFwiIGluIG9wdHMuZXh0ZW5kcyApIC8vIHdlIGFzc3VtZSB0aGlzIGlzIGEgTElTU0Jhc2VDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRlbmRzPFxuICAgICAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NCYXNlQ3N0cixcbiAgICAgICAgLy90b2RvOiBjb25zdHJhaW5zdHMgb24gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgIE9wdHMgZXh0ZW5kcyBMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj5cbiAgICA+KG9wdHM6IHtleHRlbmRzOiBFeHRlbmRzQ3N0cn0gJiBQYXJ0aWFsPE9wdHM+KSB7XG5cbiAgICBpZiggb3B0cy5leHRlbmRzID09PSB1bmRlZmluZWQpIC8vIGg0Y2tcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBhIExJU1NCYXNlIScpO1xuXG4gICAgY29uc3QgY2ZnID0gb3B0cy5leHRlbmRzLkhvc3QuQ2ZnO1xuICAgIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzLCBjZmcsIGNmZy5hcmdzKTtcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyEge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgfVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBvdmVycmlkZSBfSG9zdDogTElTU0hvc3Q8RXh0ZW5kZWRMSVNTPjtcblxuICAgICAgICAvLyBUUyBpcyBzdHVwaWQsIHJlcXVpcmVzIGV4cGxpY2l0IHJldHVybiB0eXBlXG5cdFx0c3RhdGljIG92ZXJyaWRlIGdldCBIb3N0KCk6IExJU1NIb3N0PEV4dGVuZGVkTElTUz4ge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIGZ1Y2sgb2ZmXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5ob3N0ISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbnRlbnRfZ2VuZXJhdG9yISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG4gICAgfVxuXG4gICAgcmV0dXJuIEV4dGVuZGVkTElTUztcbn0iLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciwgTEhvc3QsIExJU1NCYXNlLCBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5cbmltcG9ydCB7ZGVmaW5lfSBmcm9tIFwiLi4vY3VzdG9tUmVnaXN0ZXJ5XCI7XG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vLyBzaG91bGQgYmUgaW1wcm92ZWQgKGJ1dCBob3cgPylcbmNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFthdXRvZGlyXScpO1xuXG5jb25zdCBSRVNTT1VSQ0VTID0gW1xuXHRcImluZGV4LmpzXCIsXG5cdFwiaW5kZXguYnJ5XCIsXG5cdFwiaW5kZXguaHRtbFwiLFxuXHRcImluZGV4LmNzc1wiXG5dO1xuXG5jb25zdCBLbm93blRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuaWYoIHNjcmlwdCAhPT0gbnVsbCApIHtcblxuXHRjb25zdCBTVzogUHJvbWlzZTx2b2lkPiA9IG5ldyBQcm9taXNlKCBhc3luYyAocmVzb2x2ZSkgPT4ge1xuXG5cdFx0Y29uc3Qgc3dfcGF0aCA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ3N3Jyk7XG5cblx0XHRpZiggc3dfcGF0aCA9PT0gbnVsbCApIHtcblx0XHRcdGNvbnNvbGUud2FybihcIllvdSBhcmUgdXNpbmcgTElTUyBBdXRvIG1vZGUgd2l0aG91dCBzdy5qcy5cIik7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdHRyeSB7XG5cdFx0XHRhd2FpdCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3Rlcihzd19wYXRoLCB7c2NvcGU6IFwiL1wifSk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJSZWdpc3RyYXRpb24gb2YgU2VydmljZVdvcmtlciBmYWlsZWRcIik7XG5cdFx0XHRjb25zb2xlLmVycm9yKGUpO1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH1cblxuXHRcdGlmKCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICkge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGxldCBjb21wb25lbnRzX2RpciA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ2F1dG9kaXInKSE7XG5cdC8qXG5cdGlmKCBjb21wb25lbnRzX2RpclswXSA9PT0gJy4nKSB7XG5cdFx0Y29tcG9uZW50c19kaXIgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBjb21wb25lbnRzX2RpcjsgLy8gZ2V0dGluZyBhbiBhYnNvbHV0ZSBwYXRoLlxuXHR9XG5cdCovXG5cdGlmKCBjb21wb25lbnRzX2Rpcltjb21wb25lbnRzX2Rpci5sZW5ndGgtMV0gIT09ICcvJylcblx0XHRjb21wb25lbnRzX2RpciArPSAnLyc7XG5cblx0Ly8gb2JzZXJ2ZSBmb3IgbmV3IGluamVjdGVkIHRhZ3MuXG5cdG5ldyBNdXRhdGlvbk9ic2VydmVyKCAobXV0YXRpb25zKSA9PiB7XG5cblx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcblx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0aWYoYWRkaXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcblx0XHRcdFx0XHRhZGRUYWcoYWRkaXRpb24pXG5cblx0fSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuXHRmb3IoIGxldCBlbGVtIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiKlwiKSApXG5cdFx0YWRkVGFnKCBlbGVtICk7XG5cblxuXHRhc3luYyBmdW5jdGlvbiBhZGRUYWcodGFnOiBIVE1MRWxlbWVudCkge1xuXG5cdFx0YXdhaXQgU1c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cblx0XHRjb25zdCB0YWduYW1lID0gKCB0YWcuZ2V0QXR0cmlidXRlKCdpcycpID8/IHRhZy50YWdOYW1lICkudG9Mb3dlckNhc2UoKTtcblxuXHRcdGxldCBob3N0ID0gSFRNTEVsZW1lbnQ7XG5cdFx0aWYoIHRhZy5oYXNBdHRyaWJ1dGUoJ2lzJykgKVxuXHRcdFx0aG9zdCA9IHRhZy5jb25zdHJ1Y3RvciBhcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cblxuXHRcdGlmKCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCBLbm93blRhZ3MuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdC8vVE9ETzogaXMgQnJ5dGhvbi4uLlxuXHRcdFx0Y2RpcjogY29tcG9uZW50c19kaXIsIC8vVE9ET1xuXHRcdFx0aG9zdFxuXHRcdH0pO1x0XHRcblx0fVxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiB7aHRtbDogc3RyaW5nLCBjc3M6IHN0cmluZywgaG9zdDogQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+fSkge1xuXG5cdGNvbnN0IGNfanMgICAgICA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cblx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdGlmKCBjX2pzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NfanNdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcblx0XHRjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuXHRcdGNvbnN0IG9sZHJlcSA9IExJU1MucmVxdWlyZTtcblxuXHRcdExJU1MucmVxdWlyZSA9IGZ1bmN0aW9uKHVybDogVVJMfHN0cmluZykge1xuXG5cdFx0XHRpZiggdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiAmJiB1cmwuc3RhcnRzV2l0aCgnLi8nKSApIHtcblx0XHRcdFx0Y29uc3QgZmlsZW5hbWUgPSB1cmwuc2xpY2UoMik7XG5cdFx0XHRcdGlmKCBmaWxlbmFtZSBpbiBmaWxlcylcblx0XHRcdFx0XHRyZXR1cm4gZmlsZXNbZmlsZW5hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb2xkcmVxKHVybCk7XG5cdFx0fVxuXG5cdFx0a2xhc3MgPSAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJsKSkuZGVmYXVsdDtcblxuXHRcdExJU1MucmVxdWlyZSA9IG9sZHJlcTtcblx0fVxuXHRlbHNlIGlmKCBvcHRzLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGtsYXNzID0gTElTUyh7XG5cdFx0XHQuLi5vcHRzLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3Jcblx0XHR9KTtcblx0fVxuXG5cdGlmKGtsYXNzID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0ZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuXHRyZXR1cm4ga2xhc3M7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgaW50ZXJuYWwgdG9vbHMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdGNvbnN0IG9wdGlvbnMgPSBpc0xpc3NBdXRvXG5cdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHQ6IHt9O1xuXG5cblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuXHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRpZiggaXNMaXNzQXV0byAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0Y29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG5cdGlmKGFuc3dlciA9PT0gXCJcIilcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhbnN3ZXJcbn1cbmFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdC8vIHRlc3QgZm9yIHRoZSBtb2R1bGUgZXhpc3RhbmNlLlxuXHRpZihpc0xpc3NBdXRvICYmIGF3YWl0IF9mZXRjaFRleHQodXJpLCBpc0xpc3NBdXRvKSA9PT0gdW5kZWZpbmVkIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmkpKS5kZWZhdWx0O1xuXHR9IGNhdGNoKGUpIHtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59XG5cblxuY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5mdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn1cblxuZXhwb3J0IGNsYXNzIExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuXHRwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcGFyZUhUTUwoaHRtbD86IERvY3VtZW50RnJhZ21lbnQgfCBIVE1MRWxlbWVudCB8IHN0cmluZykge1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IG51bGw7XG5cblx0XHRpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuXG5cdFx0XHR0aGlzLmRhdGEgPSBodG1sO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHQvKlxuXHRcdFx0aHRtbCA9IGh0bWwucmVwbGFjZUFsbCgvXFwkXFx7KFtcXHddKylcXH0vZywgKF8sIG5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYDxsaXNzIHZhbHVlPVwiJHtuYW1lfVwiPjwvbGlzcz5gO1xuXHRcdFx0fSk7Ki9cblxuXHRcdFx0Ly9UT0RPOiAke30gaW4gYXR0clxuXHRcdFx0XHQvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG5cdFx0XHRcdC8vIC0gcmVnaXN0ZXIgZWxlbSArIGF0dHIgbmFtZVxuXHRcdFx0XHQvLyAtIHJlcGxhY2UuIFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gc3VwZXIucHJlcGFyZUhUTUwoaHRtbCk7XG5cdH1cblxuXHRvdmVycmlkZSBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudCB8IFNoYWRvd1Jvb3Qge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKGhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbnRlbnQgPSBzdXBlci5nZW5lcmF0ZShob3N0KTtcblxuXHRcdC8qXG5cdFx0Ly8gaHRtbCBtYWdpYyB2YWx1ZXMuXG5cdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdFx0Ly8gY3NzIHByb3AuXG5cdFx0Y29uc3QgY3NzX2F0dHJzID0gaG9zdC5nZXRBdHRyaWJ1dGVOYW1lcygpLmZpbHRlciggZSA9PiBlLnN0YXJ0c1dpdGgoJ2Nzcy0nKSk7XG5cdFx0Zm9yKGxldCBjc3NfYXR0ciBvZiBjc3NfYXR0cnMpXG5cdFx0XHRob3N0LnN0eWxlLnNldFByb3BlcnR5KGAtLSR7Y3NzX2F0dHIuc2xpY2UoJ2Nzcy0nLmxlbmd0aCl9YCwgaG9zdC5nZXRBdHRyaWJ1dGUoY3NzX2F0dHIpKTtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBpbXBvcnRDb21wb25lbnRzIDogdHlwZW9mIGltcG9ydENvbXBvbmVudHM7XG4gICAgICAgIGltcG9ydENvbXBvbmVudCAgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50O1xuICAgICAgICByZXF1aXJlICAgICAgICAgIDogdHlwZW9mIHJlcXVpcmU7XG4gICAgfVxufVxuXG50eXBlIGltcG9ydENvbXBvbmVudHNfT3B0czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGwsXG5cdGJyeXRob24/OiBib29sZWFuLFxuXHRob3N0ICAgPzogQ29uc3RydWN0b3I8VD5cbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudHM8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHRcdFx0XHRcdFx0Y29tcG9uZW50czogc3RyaW5nW10sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNkaXIgICAgPSBudWxsLFxuXHRcdFx0XHRcdFx0XHRicnl0aG9uID0gZmFsc2UsXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0aG9zdCAgICA9IEhUTUxFbGVtZW50XG5cdFx0XHRcdFx0XHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4pIHtcblxuXHRjb25zdCByZXN1bHRzOiBSZWNvcmQ8c3RyaW5nLCBMSVNTQmFzZUNzdHI+ID0ge307XG5cblx0Zm9yKGxldCB0YWduYW1lIG9mIGNvbXBvbmVudHMpIHtcblxuXHRcdHJlc3VsdHNbdGFnbmFtZV0gPSBhd2FpdCBpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0Y2Rpcixcblx0XHRcdGJyeXRob24sXG5cdFx0XHRob3N0XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuY29uc3QgYnJ5X3dyYXBwZXIgPSBgZGVmIHdyYXBqcyhqc19rbGFzcyk6XG5cbiAgICBjbGFzcyBXcmFwcGVyOlxuXG4gICAgICAgIF9qc19rbGFzcyA9IGpzX2tsYXNzXG4gICAgICAgIF9qcyA9IE5vbmVcblxuICAgICAgICBkZWYgX19pbml0X18oc2VsZiwgKmFyZ3MpOlxuICAgICAgICAgICAgc2VsZi5fanMgPSBqc19rbGFzcy5uZXcoKmFyZ3MpXG5cbiAgICAgICAgZGVmIF9fZ2V0YXR0cl9fKHNlbGYsIG5hbWU6IHN0cik6XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fanNbbmFtZV07XG5cbiAgICAgICAgZGVmIF9fc2V0YXR0cl9fKHNlbGYsIG5hbWU6IHN0ciwgdmFsdWUpOlxuICAgICAgICAgICAgaWYgbmFtZSA9PSBcIl9qc1wiOlxuICAgICAgICAgICAgICAgIHN1cGVyKCkuX19zZXRhdHRyX18obmFtZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBzZWxmLl9qc1tuYW1lXSA9IHZhbHVlXG5cbiAgICByZXR1cm4gV3JhcHBlclxuXG5gO1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gbnVsbCxcblx0XHRicnl0aG9uID0gZmFsc2UsXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudCxcblx0XHRmaWxlcyAgID0gbnVsbFxuXHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4gJiB7ZmlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fG51bGx9XG4pIHtcblxuXHRLbm93blRhZ3MuYWRkKHRhZ25hbWUpO1xuXG5cdGNvbnN0IGNvbXBvX2RpciA9IGAke2NkaXJ9JHt0YWduYW1lfS9gO1xuXG5cdGlmKCBmaWxlcyA9PT0gbnVsbCApIHtcblx0XHRmaWxlcyA9IHt9O1xuXG5cdFx0Y29uc3QgZmlsZSA9IGJyeXRob24gPyAnaW5kZXguYnJ5JyA6ICdpbmRleC5qcyc7XG5cblx0XHRmaWxlc1tmaWxlXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn0ke2ZpbGV9YCwgdHJ1ZSkpITtcblx0fVxuXG5cdGlmKCBicnl0aG9uICYmIGZpbGVzWydpbmRleC5icnknXSAhPT0gdW5kZWZpbmVkKSB7XG5cblx0XHRjb25zdCBjb2RlID0gYnJ5X3dyYXBwZXIgKyBmaWxlc1tcImluZGV4LmJyeVwiXTtcblxuXHRcdGZpbGVzWydpbmRleC5qcyddID1cbmBjb25zdCAkQiA9IGdsb2JhbFRoaXMuX19CUllUSE9OX187XG5jb25zdCByZXN1bHQgPSAkQi5ydW5QeXRob25Tb3VyY2UoXFxgJHtjb2RlfVxcYCk7XG5cbmNvbnN0IGltcG9ydGVkID0gWy4uLk9iamVjdC52YWx1ZXMoX19CUllUSE9OX18uaW1wb3J0ZWQpXTtcbmNvbnN0IGxhc3QgPSBpbXBvcnRlZFtpbXBvcnRlZC5sZW5ndGgtMV07XG5cbmV4cG9ydCBkZWZhdWx0IGxhc3QuV2ViQ29tcG9uZW50O1xuXG5gO1xuXHR9XG5cblx0Y29uc3QgaHRtbCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIHtodG1sLCBjc3MsIGhvc3R9KTtcbn1cblxuZnVuY3Rpb24gcmVxdWlyZSh1cmw6IFVSTHxzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPnxzdHJpbmcge1xuXHRyZXR1cm4gZmV0Y2godXJsKTtcbn1cblxuXG5MSVNTLmltcG9ydENvbXBvbmVudHMgPSBpbXBvcnRDb21wb25lbnRzO1xuTElTUy5pbXBvcnRDb21wb25lbnQgID0gaW1wb3J0Q29tcG9uZW50O1xuTElTUy5yZXF1aXJlICA9IHJlcXVpcmU7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCIuLi9zdGF0ZVwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufSIsIlxuaW1wb3J0IHsgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxudHlwZSBMaXN0ZW5lckZjdDxUIGV4dGVuZHMgRXZlbnQ+ID0gKGV2OiBUKSA9PiB2b2lkO1xudHlwZSBMaXN0ZW5lck9iajxUIGV4dGVuZHMgRXZlbnQ+ID0geyBoYW5kbGVFdmVudDogTGlzdGVuZXJGY3Q8VD4gfTtcbnR5cGUgTGlzdGVuZXI8VCBleHRlbmRzIEV2ZW50PiA9IExpc3RlbmVyRmN0PFQ+fExpc3RlbmVyT2JqPFQ+O1xuXG5leHBvcnQgY2xhc3MgRXZlbnRUYXJnZXQyPEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEV2ZW50Pj4gZXh0ZW5kcyBFdmVudFRhcmdldCB7XG5cblx0b3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGNhbGxiYWNrOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBvcHRpb25zPzogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuKTogdm9pZCB7XG5cdFx0XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0cmV0dXJuIHN1cGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZGlzcGF0Y2hFdmVudDxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+PihldmVudDogRXZlbnRzW1RdKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHN1cGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG5cblx0b3ZlcnJpZGUgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsaXN0ZW5lcjogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG9wdGlvbnM/OiBib29sZWFufEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZCB7XG5cblx0XHQvL0B0cy1pZ25vcmVcblx0XHRzdXBlci5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXZlbnQyPFQgZXh0ZW5kcyBzdHJpbmcsIEFyZ3M+IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8QXJncz4ge1xuXG5cdGNvbnN0cnVjdG9yKHR5cGU6IFQsIGFyZ3M6IEFyZ3MpIHtcblx0XHRzdXBlcih0eXBlLCB7ZGV0YWlsOiBhcmdzfSk7XG5cdH1cblxuXHRvdmVycmlkZSBnZXQgdHlwZSgpOiBUIHsgcmV0dXJuIHN1cGVyLnR5cGUgYXMgVDsgfVxufVxuXG50eXBlIEluc3RhbmNlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+Pj4gPSB7XG5cdFtLIGluIGtleW9mIFRdOiBJbnN0YW5jZVR5cGU8VFtLXT5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdpdGhFdmVudHM8VCBleHRlbmRzIG9iamVjdCwgRXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+PiA+KGV2OiBDb25zdHJ1Y3RvcjxUPiwgX2V2ZW50czogRXZlbnRzKSB7XG5cblx0dHlwZSBFdnRzID0gSW5zdGFuY2VzPEV2ZW50cz47XG5cblx0aWYoICEgKGV2IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQpIClcblx0XHRyZXR1cm4gZXYgYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xuXG5cdC8vIGlzIGFsc28gYSBtaXhpblxuXHQvLyBAdHMtaWdub3JlXG5cdGNsYXNzIEV2ZW50VGFyZ2V0TWl4aW5zIGV4dGVuZHMgZXYge1xuXG5cdFx0I2V2ID0gbmV3IEV2ZW50VGFyZ2V0MjxFdnRzPigpO1xuXG5cdFx0YWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hFdmVudCguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuZGlzcGF0Y2hFdmVudCguLi5hcmdzKTtcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiBFdmVudFRhcmdldE1peGlucyBhcyB1bmtub3duIGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+Pjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBTaGFkb3dSb290IHRvb2xzID09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBldmVudE1hdGNoZXMoZXY6IEV2ZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cblx0bGV0IGVsZW1lbnRzID0gZXYuY29tcG9zZWRQYXRoKCkuc2xpY2UoMCwtMikuZmlsdGVyKGUgPT4gISAoZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpICkucmV2ZXJzZSgpIGFzIEhUTUxFbGVtZW50W107XG5cblx0Zm9yKGxldCBlbGVtIG9mIGVsZW1lbnRzIClcblx0XHRpZihlbGVtLm1hdGNoZXMoc2VsZWN0b3IpIClcblx0XHRcdHJldHVybiBlbGVtOyBcblxuXHRyZXR1cm4gbnVsbDtcbn0iLCJcbmltcG9ydCB0eXBlIHsgTElTU0Jhc2UsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplU3luYywgd2hlbkluaXRpYWxpemVkIH0gZnJvbSBcIi4uL3N0YXRlXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRzIHt9O1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIC8vIGFzeW5jXG4gICAgICAgIHFzIDogdHlwZW9mIHFzO1xuICAgICAgICBxc286IHR5cGVvZiBxc287XG4gICAgICAgIHFzYTogdHlwZW9mIHFzYTtcbiAgICAgICAgcXNjOiB0eXBlb2YgcXNjO1xuXG4gICAgICAgIC8vIHN5bmNcbiAgICAgICAgcXNTeW5jIDogdHlwZW9mIHFzU3luYztcbiAgICAgICAgcXNhU3luYzogdHlwZW9mIHFzYVN5bmM7XG4gICAgICAgIHFzY1N5bmM6IHR5cGVvZiBxc2NTeW5jO1xuXG5cdFx0Y2xvc2VzdDogdHlwZW9mIGNsb3Nlc3Q7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsaXNzX3NlbGVjdG9yKG5hbWU/OiBzdHJpbmcpIHtcblx0aWYobmFtZSA9PT0gdW5kZWZpbmVkKSAvLyBqdXN0IGFuIGg0Y2tcblx0XHRyZXR1cm4gXCJcIjtcblx0cmV0dXJuIGA6aXMoJHtuYW1lfSwgW2lzPVwiJHtuYW1lfVwiXSlgO1xufVxuXG5mdW5jdGlvbiBfYnVpbGRRUyhzZWxlY3Rvcjogc3RyaW5nLCB0YWduYW1lX29yX3BhcmVudD86IHN0cmluZyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCwgcGFyZW50OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXHRcblx0aWYoIHRhZ25hbWVfb3JfcGFyZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRhZ25hbWVfb3JfcGFyZW50ICE9PSAnc3RyaW5nJykge1xuXHRcdHBhcmVudCA9IHRhZ25hbWVfb3JfcGFyZW50O1xuXHRcdHRhZ25hbWVfb3JfcGFyZW50ID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cmV0dXJuIFtgJHtzZWxlY3Rvcn0ke2xpc3Nfc2VsZWN0b3IodGFnbmFtZV9vcl9wYXJlbnQgYXMgc3RyaW5nfHVuZGVmaW5lZCl9YCwgcGFyZW50XSBhcyBjb25zdDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGxldCByZXN1bHQgPSBhd2FpdCBxc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFRbXT47XG5hc3luYyBmdW5jdGlvbiBxc2E8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl1bXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxUPj4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cHJvbWlzZXNbaWR4KytdID0gd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc2M8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4ocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVDtcbmZ1bmN0aW9uIHFzU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTxUPiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRyZXN1bHRbaWR4KytdID0gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFQ7XG5mdW5jdGlvbiBxc2NTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPihyZXN1bHQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2xvc2VzdDxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCkge1xuXG5cdHdoaWxlKHRydWUpIHtcblx0XHR2YXIgcmVzdWx0ID0gZWxlbWVudC5jbG9zZXN0PEU+KHNlbGVjdG9yKTtcblxuXHRcdGlmKCByZXN1bHQgIT09IG51bGwpXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcblx0XHRpZiggISAoXCJob3N0XCIgaW4gcm9vdCkgKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRlbGVtZW50ID0gKHJvb3QgYXMgU2hhZG93Um9vdCkuaG9zdDtcblx0fVxufVxuXG5cbi8vIGFzeW5jXG5MSVNTLnFzICA9IHFzO1xuTElTUy5xc28gPSBxc287XG5MSVNTLnFzYSA9IHFzYTtcbkxJU1MucXNjID0gcXNjO1xuXG4vLyBzeW5jXG5MSVNTLnFzU3luYyAgPSBxc1N5bmM7XG5MSVNTLnFzYVN5bmMgPSBxc2FTeW5jO1xuTElTUy5xc2NTeW5jID0gcXNjU3luYztcblxuTElTUy5jbG9zZXN0ID0gY2xvc2VzdDsiLCJpbXBvcnQgdHlwZSB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBnZXRIb3N0Q3N0ciwgZ2V0TmFtZSB9IGZyb20gXCIuL2N1c3RvbVJlZ2lzdGVyeVwiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmVudW0gU3RhdGUge1xuICAgIE5PTkUgPSAwLFxuXG4gICAgLy8gY2xhc3NcbiAgICBERUZJTkVEID0gMSA8PCAwLFxuICAgIFJFQURZICAgPSAxIDw8IDEsXG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIFVQR1JBREVEICAgID0gMSA8PCAyLFxuICAgIElOSVRJQUxJWkVEID0gMSA8PCAzLFxufVxuXG5leHBvcnQgY29uc3QgREVGSU5FRCAgICAgPSBTdGF0ZS5ERUZJTkVEO1xuZXhwb3J0IGNvbnN0IFJFQURZICAgICAgID0gU3RhdGUuUkVBRFk7XG5leHBvcnQgY29uc3QgVVBHUkFERUQgICAgPSBTdGF0ZS5VUEdSQURFRDtcbmV4cG9ydCBjb25zdCBJTklUSUFMSVpFRCA9IFN0YXRlLklOSVRJQUxJWkVEO1xuXG5leHBvcnQgY2xhc3MgTElTU1N0YXRlIHtcblxuICAgICNlbGVtOiBIVE1MRWxlbWVudHxudWxsO1xuXG4gICAgLy8gaWYgbnVsbCA6IGNsYXNzIHN0YXRlLCBlbHNlIGluc3RhbmNlIHN0YXRlXG4gICAgY29uc3RydWN0b3IoZWxlbTogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGwpIHtcbiAgICAgICAgdGhpcy4jZWxlbSA9IGVsZW07XG4gICAgfVxuXG4gICAgc3RhdGljIERFRklORUQgICAgID0gREVGSU5FRDtcbiAgICBzdGF0aWMgUkVBRFkgICAgICAgPSBSRUFEWTtcbiAgICBzdGF0aWMgVVBHUkFERUQgICAgPSBVUEdSQURFRDtcbiAgICBzdGF0aWMgSU5JVElBTElaRUQgPSBJTklUSUFMSVpFRDtcblxuICAgIGlzKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEICAgICAmJiAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgICAgICAgJiYgISB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCAgICAmJiAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEICYmICEgdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlbihzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgbGV0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8YW55Pj4oKTtcbiAgICBcbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5EZWZpbmVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuUmVhZHkoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5VcGdyYWRlZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkluaXRpYWxpemVkKCkgKTtcbiAgICBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBERUZJTkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzRGVmaW5lZCgpIHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKCBnZXROYW1lKHRoaXMuI2VsZW0pICkgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gUkVBRFkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcbiAgICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBob3N0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7XG4gICAgXG4gICAgICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgaG9zdClcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgXG4gICAgICAgIC8vIGg0Y2tcbiAgICBcbiAgICAgICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgICAgIFxuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWQgICAgICAgID0gcHJvbWlzZTtcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgXG4gICAgICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gSU5JVElBTElaRUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNJbml0aWFsaXplZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiBcImlzSW5pdGlhbGl6ZWRcIiBpbiBlbGVtICYmIGVsZW0uaXNJbml0aWFsaXplZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oKSB7XG4gICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlblVwZ3JhZGVkKCk7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQ7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtIGFzIExJU1NIb3N0PFQ+KS5iYXNlIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IENPTlZFUlNJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFsdWVPZigpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgbGV0IHN0YXRlOiBTdGF0ZSA9IDA7XG4gICAgXG4gICAgICAgIGlmKCB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBERUZJTkVEO1xuICAgICAgICBpZiggdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHN0YXRlIHw9IFJFQURZO1xuICAgICAgICBpZiggdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IFVQR1JBREVEO1xuICAgICAgICBpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IElOSVRJQUxJWkVEO1xuICAgIFxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IGlzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJERUZJTkVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBpcy5wdXNoKFwiUkVBRFlcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJVUEdSQURFRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIklOSVRJQUxJWkVEXCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gaXMuam9pbignfCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYoIFwic3RhdGVcIiBpbiBlbGVtKVxuICAgICAgICByZXR1cm4gZWxlbS5zdGF0ZSBhcyBMSVNTU3RhdGU7XG4gICAgXG4gICAgcmV0dXJuIChlbGVtIGFzIGFueSkuc3RhdGUgPSBuZXcgTElTU1N0YXRlKGVsZW0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gU3RhdGUgbW9kaWZpZXJzIChtb3ZlPykgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdvIHRvIHN0YXRlIFVQR1JBREVEXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBncmFkZTxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlbkRlZmluZWQoKTtcblxuICAgIHJldHVybiB1cGdyYWRlU3luYzxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZ3JhZGVTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBUIHtcbiAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG4gICAgXG4gICAgaWYoICEgc3RhdGUuaXNEZWZpbmVkIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IG5vdCBkZWZpbmVkIScpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcblxuICAgIGlmKCAhIChlbGVtIGluc3RhbmNlb2YgSG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgZGlkbid0IHVwZ3JhZGUhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBUO1xufVxuXG4vLyBHbyB0byBzdGF0ZSBJTklUSUFMSVpFRFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZTxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufGFueVtdID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlIClcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlblJlYWR5KCk7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyBbXSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUoLi4ucGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufGFueVtdID0gZmFsc2UpOiBUIHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgc3RhdGUuaXNSZWFkeSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyBbXSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUoLi4ucGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT0gZXh0ZXJuYWwgV0hFTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlbkluaXRpYWxpemVkPFQ+KCk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwiLi9zdGF0ZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJyxcbiAgICBTRU1JT1BFTj0gJ3NlbWktb3Blbidcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50ID9cbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IHtcbiAgICAgICAgZXh0ZW5kczogRXh0ZW5kc0N0ciwgLy8gSlMgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0ciwgICAvLyBIVE1MIEhvc3RcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxufSAmIENvbnRlbnRHZW5lcmF0b3JfT3B0cztcblxuLy8gTElTU0Jhc2VcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2VDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2U8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gSW5zdGFuY2VUeXBlPExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gVCBleHRlbmRzIExJU1NCYXNlPFxuICAgICAgICAgICAgaW5mZXIgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsSG9zdENzdHI+IDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyID0gTElTU0Jhc2U+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0Jhc2UgPyBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0ciA9IExJU1NCYXNlPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+O1xuXG4vLyBsaWdodGVyIExJU1NIb3N0IGRlZiB0byBhdm9pZCB0eXBlIGlzc3Vlcy4uLlxuZXhwb3J0IHR5cGUgTEhvc3Q8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuXG4gICAgc3RhdGUgIDogTElTU1N0YXRlO1xuICAgIGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgQ1NTU2VsZWN0b3I6IHN0cmluZztcblxufSAmIEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbmV4cG9ydCB0eXBlIExIb3N0Q3N0cjxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG4gICAgbmV3KC4uLmFyZ3M6IGFueSk6IExIb3N0PEhvc3RDc3RyPjtcblxuICAgIENmZzoge1xuICAgICAgICBob3N0ICAgICAgICAgICAgIDogSG9zdENzdHIsXG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbiAgICAgICAgYXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuICAgIH1cblxuICAgIHN0YXRlICA6IExJU1NTdGF0ZTtcblxufSAmIEhvc3RDc3RyOyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGlmKCBDbGFzcyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBDbGFzcyA9IENsYXNzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBIVE1MRWxlbWVudDtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblxuICAgIGxldCBjdXJzb3IgPSBDbGFzcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2hpbGUgKGN1cnNvci5fX3Byb3RvX18gIT09IEhUTUxFbGVtZW50KVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5fX3Byb3RvX187XG5cbiAgICAvLyBkaXJlY3RseSBpbmhlcml0IEhUTUxFbGVtZW50XG4gICAgaWYoICEgY3Vyc29yLm5hbWUuc3RhcnRzV2l0aCgnSFRNTCcpICYmICEgY3Vyc29yLm5hbWUuZW5kc1dpdGgoJ0VsZW1lbnQnKSApXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaHRtbHRhZyA9IGN1cnNvci5uYW1lLnNsaWNlKDQsIC03KTtcblxuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG4vKlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG4qL1xuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL3N0YXRlXCI7XG5pbXBvcnQgXCIuL2NvcmUvY3VzdG9tUmVnaXN0ZXJ5XCI7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vVE9ETzogQkxJU1NcblxuLy9UT0RPOiBldmVudHMudHNcbi8vVE9ETzogZ2xvYmFsQ1NTUnVsZXNcbmV4cG9ydCB7TElTU0F1dG9fQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vaGVscGVycy9MSVNTQXV0b1wiO1xuaW1wb3J0IFwiLi9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzXCI7XG5cbmV4cG9ydCB7U2hhZG93Q2ZnfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQge2xpc3MsIGxpc3NTeW5jfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5leHBvcnQge2V2ZW50TWF0Y2hlcywgV2l0aEV2ZW50cywgRXZlbnRUYXJnZXQyLCBDdXN0b21FdmVudDJ9IGZyb20gJy4vaGVscGVycy9ldmVudHMnO1xuZXhwb3J0IHtodG1sfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUztcblxuLy8gZm9yIGRlYnVnLlxuZXhwb3J0IHtfZXh0ZW5kc30gZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgeyBTaGFkb3dDZmcgfSBmcm9tIFwiLi90eXBlc1wiOyJdLCJuYW1lcyI6WyJnZXRTaGFyZWRDU1MiLCJTaGFkb3dDZmciLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNET01Db250ZW50TG9hZGVkIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsInNoYXJlZENTUyIsIkNvbnRlbnRHZW5lcmF0b3IiLCJkYXRhIiwiY29uc3RydWN0b3IiLCJodG1sIiwiY3NzIiwic2hhZG93IiwicHJlcGFyZUhUTUwiLCJwcmVwYXJlQ1NTIiwic2V0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsImlzUmVhZHkiLCJ3aGVuUmVhZHkiLCJnZW5lcmF0ZSIsImhvc3QiLCJ0YXJnZXQiLCJpbml0U2hhZG93IiwiaW5qZWN0Q1NTIiwiY29udGVudCIsImNsb25lTm9kZSIsInNoYWRvd01vZGUiLCJOT05FIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsInJlcGxhY2VDaGlsZHJlbiIsIlNoYWRvd1Jvb3QiLCJhcHBlbmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJjYW5IYXZlU2hhZG93IiwiRXJyb3IiLCJtb2RlIiwiU0VNSU9QRU4iLCJPUEVOIiwiYXR0YWNoU2hhZG93IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZSIsInByb2Nlc3NDU1MiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsImNvbnNvbGUiLCJ3YXJuIiwidW5kZWZpbmVkIiwic3RyIiwidHJpbSIsImlubmVySFRNTCIsIkhUTUxFbGVtZW50Iiwic3R5bGVzaGVldHMiLCJhZG9wdGVkU3R5bGVTaGVldHMiLCJwdXNoIiwiY3Nzc2VsZWN0b3IiLCJDU1NTZWxlY3RvciIsImhhcyIsInNldEF0dHJpYnV0ZSIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwicmVwbGFjZSIsImhlYWQiLCJhZGQiLCJidWlsZExJU1NIb3N0Iiwic2V0Q3N0ckJhc2UiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkxJU1MiLCJhcmdzIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwiY29udGVudF9nZW5lcmF0b3IiLCJMSVNTQmFzZSIsIkhvc3QiLCJzdGF0ZSIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsIm5hbWUiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImlzQ29ubmVjdGVkIiwiX0hvc3QiLCJMSVNTU3RhdGUiLCJpZCIsIl9fY3N0cl9iYXNlIiwiTGlzcyIsImhvc3RDc3RyIiwiY29udGVudF9nZW5lcmF0b3JfY3N0ciIsIkxJU1NIb3N0IiwiQ2ZnIiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiQmFzZSIsImJhc2UiLCJpc0luaXRpYWxpemVkIiwid2hlbkluaXRpYWxpemVkIiwiaW5pdGlhbGl6ZSIsInBhcmFtcyIsImluaXQiLCJnZXRQYXJ0IiwiaGFzU2hhZG93IiwicXVlcnlTZWxlY3RvciIsImdldFBhcnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImhhc0F0dHJpYnV0ZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJwcm9taXNlIiwicmVzb2x2ZSIsIlByb21pc2UiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJzaGFkb3dSb290IiwiZGVmaW5lIiwiZ2V0QmFzZUNzdHIiLCJnZXRIb3N0Q3N0ciIsImdldE5hbWUiLCJpc0RlZmluZWQiLCJ3aGVuQWxsRGVmaW5lZCIsIndoZW5EZWZpbmVkIiwiZ2V0U3RhdGUiLCJpbml0aWFsaXplU3luYyIsInVwZ3JhZGVTeW5jIiwid2hlblVwZ3JhZGVkIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsIngiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJicnlfY2xhc3MiLCJfX2Jhc2VzX18iLCJmaWx0ZXIiLCJfX25hbWVfXyIsIl9qc19rbGFzcyIsIiRqc19mdW5jIiwiX19CUllUSE9OX18iLCIkY2FsbCIsIiRnZXRhdHRyX3BlcDY1NyIsIkNsYXNzIiwiaHRtbHRhZyIsIm9wdHMiLCJ0YWduYW1lcyIsImFsbCIsInQiLCJnZXQiLCJlbGVtZW50IiwiRWxlbWVudCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJfTElTUyIsIklMSVNTIiwiY2ZnIiwiYXNzaWduIiwiRXh0ZW5kZWRMSVNTIiwic2NyaXB0IiwiUkVTU09VUkNFUyIsIktub3duVGFncyIsIlNXIiwic3dfcGF0aCIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInNjb3BlIiwiZXJyb3IiLCJjb250cm9sbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbXBvbmVudHNfZGlyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkaXRpb24iLCJhZGRlZE5vZGVzIiwiYWRkVGFnIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtIiwidGFnIiwiaW1wb3J0Q29tcG9uZW50IiwiY2RpciIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwiY19qcyIsImtsYXNzIiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwib2xkcmVxIiwicmVxdWlyZSIsInN0YXJ0c1dpdGgiLCJmaWxlbmFtZSIsInNsaWNlIiwiZGVmYXVsdCIsIkxJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IiLCJfZmV0Y2hUZXh0IiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImFuc3dlciIsInRleHQiLCJfaW1wb3J0IiwibG9nIiwiY29udmVydGVyIiwiZW5jb2RlSFRNTCIsInRleHRDb250ZW50IiwibWF0Y2giLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImNzc19hdHRyIiwic2V0UHJvcGVydHkiLCJpbXBvcnRDb21wb25lbnRzIiwiY29tcG9uZW50cyIsImJyeXRob24iLCJyZXN1bHRzIiwiYnJ5X3dyYXBwZXIiLCJjb21wb19kaXIiLCJjb2RlIiwibGlzcyIsIkRvY3VtZW50RnJhZ21lbnQiLCJsaXNzU3luYyIsIkV2ZW50VGFyZ2V0MiIsIkV2ZW50VGFyZ2V0IiwiY2FsbGJhY2siLCJkaXNwYXRjaEV2ZW50IiwiZXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJDdXN0b21FdmVudDIiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIldpdGhFdmVudHMiLCJldiIsIl9ldmVudHMiLCJFdmVudFRhcmdldE1peGlucyIsImV2ZW50TWF0Y2hlcyIsInNlbGVjdG9yIiwiZWxlbWVudHMiLCJjb21wb3NlZFBhdGgiLCJyZXZlcnNlIiwibWF0Y2hlcyIsImxpc3Nfc2VsZWN0b3IiLCJfYnVpbGRRUyIsInRhZ25hbWVfb3JfcGFyZW50IiwicGFyZW50IiwicXMiLCJyZXN1bHQiLCJxc28iLCJxc2EiLCJpZHgiLCJwcm9taXNlcyIsInFzYyIsInJlcyIsImNsb3Nlc3QiLCJxc1N5bmMiLCJxc2FTeW5jIiwicXNjU3luYyIsInJvb3QiLCJnZXRSb290Tm9kZSIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiU3RhdGUiLCJpcyIsImlzVXBncmFkZWQiLCJ3aGVuIiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJzdHJpY3QiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZm9yY2UiLCJMaWZlQ3ljbGUiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiY3Vyc29yIiwiX19wcm90b19fIiwiZW5kc1dpdGgiLCJDQU5fSEFWRV9TSEFET1ciLCJyZWFkeVN0YXRlIiwic3RyaW5nIiwiaSIsImZpcnN0Q2hpbGQiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiXSwic291cmNlUm9vdCI6IiJ9