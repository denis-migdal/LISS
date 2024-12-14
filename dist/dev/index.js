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
        if (mode === null) mode = canHaveShadow ? _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.OPEN : _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE;
        host.shadowMode = mode;
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

/***/ "./src/LISSControler.ts":
/*!******************************!*\
  !*** ./src/LISSControler.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   setCstrHost: () => (/* binding */ setCstrHost)
/* harmony export */ });
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSHost */ "./src/LISSHost.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContentGenerator */ "./src/ContentGenerator.ts");


/****/ let __cstr_host = null;
function setCstrHost(_) {
    __cstr_host = _;
}
function LISS(args = {}) {
    let { /* extends is a JS reserved keyword. */ extends: _extends = Object, host = HTMLElement, content_generator = _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__["default"] } = args;
    class LISSControler extends _extends {
        constructor(...args){
            super(...args);
            // h4ck, okay because JS is monothreaded.
            if (__cstr_host === null) {
                (0,_LISSHost__WEBPACK_IMPORTED_MODULE_0__.setCstrControler)(this);
                __cstr_host = new this.constructor.Host(...args);
            }
            this.#host = __cstr_host;
            __cstr_host = null;
        }
        //TODO: get the real type ?
        get content() {
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
        // for debug purposes ?
        static get state() {
            return this.Host.state;
        }
        get state() {
            return this.#host.state;
        }
    }
    return LISSControler;
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
/* harmony export */   setCstrControler: () => (/* binding */ setCstrControler)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./src/state.ts");
/* harmony import */ var _LISSControler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSControler */ "./src/LISSControler.ts");


// LISSHost must be build in define as it need to be able to build
// the defined subclass.
let id = 0;
const sharedCSS = new CSSStyleSheet();
function getSharedCSS() {
    return sharedCSS;
}
let __cstr_controler = null;
function setCstrControler(_) {
    __cstr_controler = _;
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
        state = this.state ?? new _state__WEBPACK_IMPORTED_MODULE_0__.LISSState(this);
        // ============ DEPENDENCIES ==================================
        static whenDepsResolved = content_generator.whenReady();
        static get isDepsResolved() {
            return content_generator.isReady;
        }
        // ============ INITIALIZATION ==================================
        static Controler = Liss;
        #controler = null;
        get controler() {
            return this.#controler;
        }
        get isInitialized() {
            return this.#controler !== null;
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
            this.#controler = this.init();
            if (this.isConnected) this.#controler.connectedCallback();
            return this.#controler;
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
            const controler = __cstr_controler;
            __cstr_controler = null;
            if (controler !== null) {
                this.#controler = controler;
                this.init(); // call the resolver
            }
            if ("_whenUpgradedResolve" in this) this._whenUpgradedResolve();
        }
        // ====================== DOM ===========================		
        disconnectedCallback() {
            if (this.controler !== null) this.controler.disconnectedCallback();
        }
        connectedCallback() {
            // TODO: life cycle options
            if (this.isInitialized) {
                this.controler.connectedCallback();
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
        static get observedAttributes() {
            return LISSHost.Controler.observedAttributes;
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (this.#controler) this.#controler.attributeChangedCallback(name, oldValue, newValue);
        }
        shadowMode = null;
        init() {
            // no needs to set this.#content (already host or set when attachShadow)
            content_generator.generate(this);
            //@ts-ignore
            //this.#content.addEventListener('click', onClickEvent);
            //@ts-ignore
            //this.#content.addEventListener('dblclick', onClickEvent);
            if (this.#controler === null) {
                // h4ck, okay because JS is monothreaded.
                (0,_LISSControler__WEBPACK_IMPORTED_MODULE_1__.setCstrHost)(this);
                this.#controler = new LISSHost.Controler(...this.#params);
            }
            this.#whenInitialized_resolver(this.controler);
            return this.controler;
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
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getControlerCstr = _customRegistery__WEBPACK_IMPORTED_MODULE_0__.getControlerCstr;


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
/* harmony export */   getControlerCstr: () => (/* binding */ getControlerCstr),
/* harmony export */   getHostCstr: () => (/* binding */ getHostCstr),
/* harmony export */   getName: () => (/* binding */ getName),
/* harmony export */   isDefined: () => (/* binding */ isDefined),
/* harmony export */   whenAllDefined: () => (/* binding */ whenAllDefined),
/* harmony export */   whenDefined: () => (/* binding */ whenDefined)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

// Go to state DEFINED
function define(tagname, ComponentClass) {
    let Host = ComponentClass;
    // Brython class
    let bry_class = null;
    if ("$is_class" in ComponentClass) {
        bry_class = ComponentClass;
        ComponentClass = bry_class.__bases__.filter((e)=>e.__name__ === "Wrapper")[0]._js_klass.$js_func;
        ComponentClass.Host.Controler = class {
            #bry;
            constructor(...args){
                console.warn("?", args);
                // @ts-ignore
                this.#bry = __BRYTHON__.$call(bry_class, [
                    0,
                    0,
                    0
                ])(...args);
            }
            #call(name, args) {
                // @ts-ignore
                return __BRYTHON__.$call(__BRYTHON__.$getattr_pep657(this.#bry, name, [
                    0,
                    0,
                    0
                ]), [
                    0,
                    0,
                    0
                ])(...args);
            }
            get host() {
                // @ts-ignore
                return __BRYTHON__.$getattr_pep657(this.#bry, "host", [
                    0,
                    0,
                    0
                ]);
            }
            static observedAttributes = bry_class["observedAttributes"];
            attributeChangedCallback(...args) {
                return this.#call("attributeChangedCallback", args);
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
    if ("Controler" in element.constructor) element = element.constructor;
    if ("Controler" in element) {
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
function getControlerCstr(name) {
    return getHostCstr(name).Controler;
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
/* harmony import */ var _LISSControler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSControler */ "./src/LISSControler.ts");
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSHost */ "./src/LISSHost.ts");


// used for plugins.
class ILISS {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISS);
function LISS(opts = {}) {
    if (opts.extends !== undefined && "Host" in opts.extends) return _extends(opts);
    return (0,_LISSControler__WEBPACK_IMPORTED_MODULE_0__.LISS)(opts);
}
function _extends(opts) {
    if (opts.extends === undefined) throw new Error('please provide a LISSControler!');
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
let _cdir;
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
    _cdir = script.getAttribute('autodir');
    console.warn(_cdir);
    if (_cdir[_cdir.length - 1] !== '/') _cdir += '/';
    const brython = script.getAttribute("brython");
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
            brython,
            cdir: _cdir,
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
async function importComponents(components, { cdir = _cdir, brython = null, // @ts-ignore
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
async function importComponent(tagname, { cdir = _cdir, brython = null, // @ts-ignore
host = HTMLElement, files = null } = {}) {
    KnownTags.add(tagname);
    const compo_dir = `${cdir}${tagname}/`;
    if (files === null) {
        files = {};
        const file = brython === "true" ? 'index.bry' : 'index.js';
        files[file] = await _fetchText(`${compo_dir}${file}`, true);
    }
    if (brython === "true" && files['index.bry'] !== undefined) {
        const code = bry_wrapper + files["index.bry"];
        files['index.js'] = `const $B = globalThis.__BRYTHON__;

$B.runPythonSource(\`${code}\`, "_");

const module = $B.imported["_"];
export default module.WebComponent;

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


var State = /*#__PURE__*/ function(State) {
    State[State["NONE"] = 0] = "NONE";
    // class
    State[State["DEFINED"] = 1] = "DEFINED";
    State[State["READY"] = 2] = "READY";
    // instance
    State[State["UPGRADED"] = 4] = "UPGRADED";
    State[State["INITIALIZED"] = 8] = "INITIALIZED";
    return State;
}(State || {});
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
        return elem.controler;
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
        if (strict === false) return elem.controler;
        throw new Error(`Already initialized!`);
    }
    const host = await upgrade(elem);
    await state.whenReady();
    let params = typeof strict === "boolean" ? [] : strict;
    host.initialize(...params);
    return host.controler;
}
function initializeSync(elem, strict = false) {
    const state = getState(elem);
    if (state.isInitialized) {
        if (strict === false) return elem.controler;
        throw new Error(`Already initialized!`);
    }
    const host = upgradeSync(elem);
    if (!state.isReady) throw new Error("Element not ready !");
    let params = typeof strict === "boolean" ? [] : strict;
    host.initialize(...params);
    return host.controler;
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
var ShadowCfg = /*#__PURE__*/ function(ShadowCfg) {
    ShadowCfg["NONE"] = "none";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
    return ShadowCfg;
}({});
//TODO: implement ?
var LifeCycle = /*#__PURE__*/ function(LifeCycle) {
    LifeCycle[LifeCycle["DEFAULT"] = 0] = "DEFAULT";
    // not implemented yet
    LifeCycle[LifeCycle["INIT_AFTER_CHILDREN"] = 2] = "INIT_AFTER_CHILDREN";
    LifeCycle[LifeCycle["INIT_AFTER_PARENT"] = 4] = "INIT_AFTER_PARENT";
    // quid params/attrs ?
    LifeCycle[LifeCycle["RECREATE_AFTER_CONNECTION"] = 8] = "RECREATE_AFTER_CONNECTION";
    return LifeCycle;
}({});


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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
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




//TODO: events.ts
//TODO: globalCSSRules






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_extends__WEBPACK_IMPORTED_MODULE_0__["default"]);
// for debug.

// required for auto mode it seems.
// @ts-ignore
globalThis.LISS = _extends__WEBPACK_IMPORTED_MODULE_0__["default"];

})();

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRzlOLElBQUksQ0FBQytOLEVBQUUsRUFBRTtRQUN0QkQsVUFBVSxHQUFHdFAsR0FBRyxDQUFDdVAsSUFBRSxFQUFFLEVBQUU7SUFDdkIsMEJBQTBCO0lBQzlCO0lBRUEsb0RBQW9EO0lBQ3BELElBQUk1UixXQUFXaUIsU0FBU0MsYUFBYSxDQUFDO0lBQ3RDLHVEQUF1RDtJQUN2RGxCLFNBQVN1QyxTQUFTLEdBQUdvUCxPQUFPclAsSUFBSTtJQUVoQyxJQUFJdEMsU0FBU1EsT0FBTyxDQUFDSSxVQUFVLENBQUNDLE1BQU0sS0FBSyxLQUFLYixTQUFTUSxPQUFPLENBQUNxUixVQUFVLENBQUVDLFFBQVEsS0FBS0MsS0FBS0MsU0FBUyxFQUN0RyxPQUFPaFMsU0FBU1EsT0FBTyxDQUFDcVIsVUFBVTtJQUVwQyxPQUFPN1IsU0FBU1EsT0FBTztBQUMzQjs7Ozs7OztTQzFIQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFFUDtBQUNVO0FBRStCO0FBRS9ELGlCQUFpQjtBQUNqQixzQkFBc0I7QUFDdUM7QUFDM0I7QUFFQTtBQUVhO0FBQ3VDO0FBQ3pEO0FBQzdCLGlFQUFlb0QsZ0RBQUlBLEVBQUM7QUFFcEIsYUFBYTtBQUNzQjtBQUVuQyxtQ0FBbUM7QUFDbkMsYUFBYTtBQUNicU8sV0FBV3JPLElBQUksR0FBR0EsZ0RBQUlBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9Db250ZW50R2VuZXJhdG9yLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0NvbnRyb2xlci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY29yZS9jdXN0b21SZWdpc3RlcnkudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9jb3JlL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY3VzdG9tUmVnaXN0ZXJ5LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFNoYXJlZENTUyB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSG9zdCwgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgaXNTaGFkb3dTdXBwb3J0ZWQsIHdhaXRET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxudHlwZSBIVE1MID0gRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmc7XG50eXBlIENTUyAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7XG4gICAgaHRtbCAgID86IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nLFxuICAgIGNzcyAgICA/OiBDU1MgfCByZWFkb25seSBDU1NbXSxcbiAgICBzaGFkb3cgPzogU2hhZG93Q2ZnfG51bGxcbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvckNzdHIgPSB7IG5ldyhvcHRzOiBDb250ZW50R2VuZXJhdG9yX09wdHMpOiBDb250ZW50R2VuZXJhdG9yIH07XG5cbmNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcbmNvbnN0IHNoYXJlZENTUyA9IGdldFNoYXJlZENTUygpOyAvLyBmcm9tIExJU1NIb3N0Li4uXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgI3N0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W107XG4gICAgI3RlbXBsYXRlICAgOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGw7XG4gICAgI3NoYWRvdyAgICAgOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGh0bWwsXG4gICAgICAgIGNzcyAgICA9IFtdLFxuICAgICAgICBzaGFkb3cgPSBudWxsLFxuICAgIH06IENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4jc2hhZG93ICAgPSBzaGFkb3c7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGhpcy5wcmVwYXJlSFRNTChodG1sKTtcbiAgICBcbiAgICAgICAgdGhpcy4jc3R5bGVzaGVldHMgPSB0aGlzLnByZXBhcmVDU1MoY3NzKTtcblxuICAgICAgICB0aGlzLiNpc1JlYWR5ICAgPSBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgdGhpcy4jd2hlblJlYWR5ID0gd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcblxuICAgICAgICAvL1RPRE86IG90aGVyIGRlcHMuLi5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0VGVtcGxhdGUodGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jdGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAjd2hlblJlYWR5OiBQcm9taXNlPHVua25vd24+O1xuICAgICNpc1JlYWR5ICA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZWFkeTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuI2lzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiN3aGVuUmVhZHk7XG4gICAgICAgIC8vVE9ETzogZGVwcy5cbiAgICAgICAgLy9UT0RPOiBDU1MvSFRNTCByZXNvdXJjZXMuLi5cblxuICAgICAgICAvLyBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuICAgICAgICAvLyBfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcbiAgICAgICAgLy8gKyBjZiBhdCB0aGUgZW5kLi4uXG4gICAgfVxuXG4gICAgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnR8U2hhZG93Um9vdCB7XG5cbiAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLiAgICAgXG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pbml0U2hhZG93KGhvc3QpO1xuXG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHRhcmdldCwgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGlmKCBob3N0LnNoYWRvd01vZGUgIT09IFNoYWRvd0NmZy5OT05FIHx8IHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKGNvbnRlbnQpO1xuXG4gICAgICAgIGlmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICYmIHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMClcblx0XHRcdHRhcmdldC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoaG9zdCk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFNoYWRvdzxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpIHtcblxuICAgICAgICBjb25zdCBjYW5IYXZlU2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCk7XG4gICAgICAgIGlmKCB0aGlzLiNzaGFkb3cgIT09IG51bGwgJiYgdGhpcy4jc2hhZG93ICE9PSBTaGFkb3dDZmcuTk9ORSAmJiAhIGNhbkhhdmVTaGFkb3cgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgICAgICBsZXQgbW9kZSA9IHRoaXMuI3NoYWRvdztcbiAgICAgICAgaWYoIG1vZGUgPT09IG51bGwgKVxuICAgICAgICAgICAgbW9kZSA9IGNhbkhhdmVTaGFkb3cgPyBTaGFkb3dDZmcuT1BFTiA6IFNoYWRvd0NmZy5OT05FO1xuXG4gICAgICAgIGhvc3Quc2hhZG93TW9kZSA9IG1vZGU7XG5cbiAgICAgICAgbGV0IHRhcmdldDogSG9zdHxTaGFkb3dSb290ID0gaG9zdDtcbiAgICAgICAgaWYoIG1vZGUgIT09IFNoYWRvd0NmZy5OT05FKVxuICAgICAgICAgICAgdGFyZ2V0ID0gaG9zdC5hdHRhY2hTaGFkb3coe21vZGV9KTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlQ1NTKGNzczogQ1NTfHJlYWRvbmx5IENTU1tdKSB7XG4gICAgICAgIGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG4gICAgICAgICAgICBjc3MgPSBbY3NzXTtcblxuICAgICAgICByZXR1cm4gY3NzLm1hcChlID0+IHRoaXMucHJvY2Vzc0NTUyhlKSApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcm9jZXNzQ1NTKGNzczogQ1NTKSB7XG5cbiAgICAgICAgaWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcbiAgICAgICAgICAgIHJldHVybiBjc3M7XG4gICAgICAgIGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuICAgICAgICAgICAgcmV0dXJuIGNzcy5zaGVldCE7XG4gICAgXG4gICAgICAgIGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICAgICAgICAgIHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7IC8vIHJlcGxhY2UoKSBpZiBpc3N1ZXNcbiAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3VyXCIpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlSFRNTChodG1sPzogSFRNTCk6IEhUTUxUZW1wbGF0ZUVsZW1lbnR8bnVsbCB7XG4gICAgXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblxuICAgICAgICBpZihodG1sID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG5cbiAgICAgICAgLy8gc3RyMmh0bWxcbiAgICAgICAgaWYodHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zdCBzdHIgPSBodG1sLnRyaW0oKTtcblxuICAgICAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIGh0bWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCApXG4gICAgICAgICAgICBodG1sID0gaHRtbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgdGVtcGxhdGUuYXBwZW5kKGh0bWwpO1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaW5qZWN0Q1NTPEhvc3QgZXh0ZW5kcyBMSG9zdD4odGFyZ2V0OiBTaGFkb3dSb290fEhvc3QsIHN0eWxlc2hlZXRzOiBhbnlbXSkge1xuXG4gICAgICAgIGlmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICkge1xuICAgICAgICAgICAgdGFyZ2V0LmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUywgLi4uc3R5bGVzaGVldHMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3Nzc2VsZWN0b3IgPSB0YXJnZXQuQ1NTU2VsZWN0b3I7IC8vVE9ETy4uLlxuXG4gICAgICAgIGlmKCBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cbiAgICAgICAgbGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuICAgICAgICBmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuICAgICAgICAgICAgZm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuICAgICAgICAgICAgICAgIGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuICAgICAgICBhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcbiAgICB9XG59XG5cbi8vIGlkZW0gSFRNTC4uLlxuLyogaWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIGMgPSBhd2FpdCBjO1xuICAgICAgICAgICAgaWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG4gICAgICAgICAgICAgICAgYyA9IGF3YWl0IGMudGV4dCgpO1xuXG4gICAgICAgICAgICBzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cbiAgICAgICAgfSkoKSk7XG5cbiAgICAgICAgcmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuICAgIH1cbiovIiwiaW1wb3J0IHsgTEhvc3RDc3RyLCB0eXBlIENsYXNzLCB0eXBlIENvbnN0cnVjdG9yLCB0eXBlIExJU1NfT3B0cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IExJU1NTdGF0ZSB9IGZyb20gXCIuL3N0YXRlXCI7XG5cbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QsIHNldENzdHJDb250cm9sZXIgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZX0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLyoqKiovXG5cbmludGVyZmFjZSBJQ29udHJvbGVyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4ge1xuXHQvLyBub24tdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IGhvc3Q6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IGlzQ29ubmVjdGVkICA6Ym9vbGVhbjtcbn07XG5cdC8vICsgcHJvdGVjdGVkXG5cdFx0Ly8gcmVhZG9ubHkgLmNvbnRlbnQ6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdDtcblx0Ly8gdmFuaWxsYSBKU1xuXHRcdC8vIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKTogdm9pZDtcblx0XHQvLyBjb25uZWN0ZWRDYWxsYmFjayAgICgpOiB2b2lkO1xuXHRcdC8vIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQ7XG5cbmludGVyZmFjZSBJQ29udHJvbGVyQ3N0cjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0bmV3KCk6IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPjtcblxuXHQvLyB2YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXTtcbn1cblx0Ly8gKyBcInByaXZhdGVcIlxuXHRcdC8vIHJlYWRvbmx5IEhvc3Q6IEhvc3RDc3RyXG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+ID0gSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+ICYgSW5zdGFuY2VUeXBlPEV4dGVuZHNDc3RyPjtcblxuZXhwb3J0IHR5cGUgQ29udHJvbGVyQ3N0cjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+ID0gSUNvbnRyb2xlckNzdHI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEV4dGVuZHNDc3RyO1xuXG4vKioqKi9cblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+KGFyZ3M6IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4+ID0ge30pIHtcblxuXHRsZXQge1xuXHRcdC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuXHRcdGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0ICAgICAgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3N0cixcblx0XHRob3N0ICAgICAgICAgICAgICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdFxuXHRcdGNvbnRlbnRfZ2VuZXJhdG9yID0gQ29udGVudEdlbmVyYXRvcixcblx0fSA9IGFyZ3M7XG5cdFxuXHRjbGFzcyBMSVNTQ29udHJvbGVyIGV4dGVuZHMgX2V4dGVuZHMgaW1wbGVtZW50cyBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj57XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsICkge1xuXHRcdFx0XHRzZXRDc3RyQ29udHJvbGVyKHRoaXMpO1xuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3QoLi4uYXJncyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5jb250ZW50ITtcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7fVxuXG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ob3N0LmlzQ29ubmVjdGVkO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBJbnN0YW5jZVR5cGU8TEhvc3RDc3RyPEhvc3RDc3RyPj47XG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBfSG9zdDogTEhvc3RDc3RyPEhvc3RDc3RyPjtcblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmU6IGZ1Y2sgb2ZmLlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCggdGhpcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRob3N0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXG5cdFx0Ly8gZm9yIGRlYnVnIHB1cnBvc2VzID9cblx0XHRzdGF0aWMgZ2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5Ib3N0LnN0YXRlO1xuXHRcdH1cblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NDb250cm9sZXIgc2F0aXNmaWVzIENvbnRyb2xlckNzdHI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPjtcbn0iLCJpbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIFNoYWRvd0NmZywgdHlwZSBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vIExJU1NIb3N0IG11c3QgYmUgYnVpbGQgaW4gZGVmaW5lIGFzIGl0IG5lZWQgdG8gYmUgYWJsZSB0byBidWlsZFxuLy8gdGhlIGRlZmluZWQgc3ViY2xhc3MuXG5cbmxldCBpZCA9IDA7XG5cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcmVkQ1NTKCkge1xuXHRyZXR1cm4gc2hhcmVkQ1NTO1xufVxuXG5sZXQgX19jc3RyX2NvbnRyb2xlciAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckNvbnRyb2xlcihfOiBhbnkpIHtcblx0X19jc3RyX2NvbnRyb2xlciA9IF87XG59XG5cbnR5cGUgaW5mZXJIb3N0Q3N0cjxUPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cjxpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LCBpbmZlciBCIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA/IEIgOiBuZXZlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XHRUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsIFUgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBpbmZlckhvc3RDc3RyPFQ+ID4oXG5cdFx0XHRcdFx0XHRcdExpc3M6IFQsXG5cdFx0XHRcdFx0XHRcdC8vIGNhbid0IGRlZHVjZSA6IGNhdXNlIHR5cGUgZGVkdWN0aW9uIGlzc3Vlcy4uLlxuXHRcdFx0XHRcdFx0XHRob3N0Q3N0cjogVSxcblx0XHRcdFx0XHRcdFx0Y29udGVudF9nZW5lcmF0b3JfY3N0cjogQ29udGVudEdlbmVyYXRvckNzdHIsXG5cdFx0XHRcdFx0XHRcdGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcblx0XHRcdFx0XHRcdCkge1xuXG5cdGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gbmV3IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIoYXJncyk7XG5cblx0dHlwZSBIb3N0Q3N0ciA9IFU7XG4gICAgdHlwZSBIb3N0ICAgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Y2xhc3MgTElTU0hvc3QgZXh0ZW5kcyBob3N0Q3N0ciB7XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgQ2ZnID0ge1xuXHRcdFx0aG9zdCAgICAgICAgICAgICA6IGhvc3RDc3RyLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIsXG5cdFx0XHRhcmdzXG5cdFx0fVxuXG5cdFx0Ly8gYWRvcHQgc3RhdGUgaWYgYWxyZWFkeSBjcmVhdGVkLlxuXHRcdHJlYWRvbmx5IHN0YXRlID0gKHRoaXMgYXMgYW55KS5zdGF0ZSA/PyBuZXcgTElTU1N0YXRlKHRoaXMpO1xuXG5cdFx0Ly8gPT09PT09PT09PT09IERFUEVOREVOQ0lFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHN0YXRpYyBDb250cm9sZXIgPSBMaXNzO1xuXG5cdFx0I2NvbnRyb2xlcjogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBjb250cm9sZXIoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlciAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdCNwYXJhbXM6IGFueVtdO1xuXHRcdGluaXRpYWxpemUoLi4ucGFyYW1zOiBhbnlbXSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRpZiggcGFyYW1zLmxlbmd0aCAhPT0gMCApIHtcblx0XHRcdFx0aWYoIHRoaXMuI3BhcmFtcy5sZW5ndGggIT09IDAgKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ3N0ciBwYXJhbXMgaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZCAhJyk7XG5cdFx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jY29udHJvbGVyID0gdGhpcy5pbml0KCk7XG5cblx0XHRcdGlmKCB0aGlzLmlzQ29ubmVjdGVkIClcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXI7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290ID0gdGhpcyBhcyBIb3N0O1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgYXR0YWNoU2hhZG93KGluaXQ6IFNoYWRvd1Jvb3RJbml0KTogU2hhZG93Um9vdCB7XG5cdFx0XHRjb25zdCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3coaW5pdCk7XG5cblx0XHRcdC8vIEB0cy1pZ25vcmUgY2xvc2VkIElTIGFzc2lnbmFibGUgdG8gc2hhZG93TW9kZS4uLlxuXHRcdFx0dGhpcy5zaGFkb3dNb2RlID0gaW5pdC5tb2RlO1xuXG5cdFx0XHR0aGlzLiNjb250ZW50ID0gc2hhZG93O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc2hhZG93O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2hhZG93TW9kZSAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKC4uLnBhcmFtczogYW55W10pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGNvbnN0IGNvbnRyb2xlciA9IF9fY3N0cl9jb250cm9sZXI7XG5cdFx0XHRfX2NzdHJfY29udHJvbGVyID0gbnVsbDtcblxuXHRcdFx0aWYoIGNvbnRyb2xlciAhPT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBjb250cm9sZXI7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdGlmKHRoaXMuY29udHJvbGVyICE9PSBudWxsKVxuXHRcdFx0XHR0aGlzLmNvbnRyb2xlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuY29udHJvbGVyIS5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuc3RhdGUuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCB0aGlzLnN0YXRlLmlzUmVhZHk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiBMSVNTSG9zdC5Db250cm9sZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuXHRcdH1cblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYodGhpcy4jY29udHJvbGVyKVxuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0c2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGwgPSBudWxsO1xuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXG5cdFx0XHQvLyBubyBuZWVkcyB0byBzZXQgdGhpcy4jY29udGVudCAoYWxyZWFkeSBob3N0IG9yIHNldCB3aGVuIGF0dGFjaFNoYWRvdylcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLmdlbmVyYXRlKHRoaXMpO1xuXG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cblx0XHRcdGlmKCB0aGlzLiNjb250cm9sZXIgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IG5ldyBMSVNTSG9zdC5Db250cm9sZXIoLi4udGhpcy4jcGFyYW1zKSBhcyBJbnN0YW5jZVR5cGU8VD47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmNvbnRyb2xlcik7XG5cblx0XHRcdHJldHVybiB0aGlzLmNvbnRyb2xlcjtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0O1xufVxuXG5cbiIsIlxuaW1wb3J0IHsgZGVmaW5lLCBnZXRDb250cm9sZXJDc3RyLCBnZXRIb3N0Q3N0ciwgZ2V0TmFtZSwgaXNEZWZpbmVkLCB3aGVuQWxsRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi4vY3VzdG9tUmVnaXN0ZXJ5XCI7XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuXHRcdGlzRGVmaW5lZCAgICAgIDogdHlwZW9mIGlzRGVmaW5lZDtcblx0XHRnZXROYW1lICAgICAgICA6IHR5cGVvZiBnZXROYW1lO1xuXHRcdGdldEhvc3RDc3RyICAgIDogdHlwZW9mIGdldEhvc3RDc3RyO1xuXHRcdGdldENvbnRyb2xlckNzdHIgICAgOiB0eXBlb2YgZ2V0Q29udHJvbGVyQ3N0cjtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldENvbnRyb2xlckNzdHIgICAgPSBnZXRDb250cm9sZXJDc3RyOyIsIlxuaW1wb3J0IHsgREVGSU5FRCwgZ2V0U3RhdGUsIGluaXRpYWxpemUsIElOSVRJQUxJWkVELCBpbml0aWFsaXplU3luYywgUkVBRFksIHVwZ3JhZGUsIFVQR1JBREVELCB1cGdyYWRlU3luYywgd2hlbkluaXRpYWxpemVkLCB3aGVuVXBncmFkZWQgfSBmcm9tIFwiLi4vc3RhdGVcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBERUZJTkVEICAgIDogdHlwZW9mIERFRklORUQsXG4gICAgICAgIFJFQURZICAgICAgOiB0eXBlb2YgUkVBRFk7XG4gICAgICAgIFVQR1JBREVEICAgOiB0eXBlb2YgVVBHUkFERUQ7XG4gICAgICAgIElOSVRJQUxJWkVEOiB0eXBlb2YgSU5JVElBTElaRUQ7XG4gICAgICAgIGdldFN0YXRlICAgICAgIDogdHlwZW9mIGdldFN0YXRlO1xuICAgICAgICB1cGdyYWRlICAgICAgICA6IHR5cGVvZiB1cGdyYWRlO1xuICAgICAgICBpbml0aWFsaXplICAgICA6IHR5cGVvZiBpbml0aWFsaXplO1xuICAgICAgICB1cGdyYWRlU3luYyAgICA6IHR5cGVvZiB1cGdyYWRlU3luYztcbiAgICAgICAgaW5pdGlhbGl6ZVN5bmMgOiB0eXBlb2YgaW5pdGlhbGl6ZVN5bmM7XG4gICAgICAgIHdoZW5VcGdyYWRlZCAgIDogdHlwZW9mIHdoZW5VcGdyYWRlZDtcbiAgICAgICAgd2hlbkluaXRpYWxpemVkOiB0eXBlb2Ygd2hlbkluaXRpYWxpemVkO1xuICAgIH1cbn1cblxuTElTUy5ERUZJTkVEICAgID0gTElTUy5ERUZJTkVELFxuTElTUy5SRUFEWSAgICAgID0gTElTUy5SRUFEWTtcbkxJU1MuVVBHUkFERUQgICA9IExJU1MuVVBHUkFERUQ7XG5MSVNTLklOSVRJQUxJWkVEPSBMSVNTLklOSVRJQUxJWkVEO1xuXG5MSVNTLmdldFN0YXRlICAgICAgID0gZ2V0U3RhdGU7XG5MSVNTLnVwZ3JhZGUgICAgICAgID0gdXBncmFkZTtcbkxJU1MuaW5pdGlhbGl6ZSAgICAgPSBpbml0aWFsaXplO1xuTElTUy51cGdyYWRlU3luYyAgICA9IHVwZ3JhZGVTeW5jO1xuTElTUy5pbml0aWFsaXplU3luYyA9IGluaXRpYWxpemVTeW5jO1xuTElTUy53aGVuVXBncmFkZWQgICA9IHdoZW5VcGdyYWRlZDtcbkxJU1Mud2hlbkluaXRpYWxpemVkPSB3aGVuSW5pdGlhbGl6ZWQ7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG4vLyBHbyB0byBzdGF0ZSBERUZJTkVEXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD4pIHtcblxuXHRsZXQgSG9zdDogTElTU0hvc3RDc3RyPFQ+ID0gQ29tcG9uZW50Q2xhc3MgYXMgYW55O1xuXG5cdC8vIEJyeXRob24gY2xhc3Ncblx0bGV0IGJyeV9jbGFzczogYW55ID0gbnVsbDtcblx0aWYoIFwiJGlzX2NsYXNzXCIgaW4gQ29tcG9uZW50Q2xhc3MgKSB7XG5cblx0XHRicnlfY2xhc3MgPSBDb21wb25lbnRDbGFzcztcblxuXHRcdENvbXBvbmVudENsYXNzID0gYnJ5X2NsYXNzLl9fYmFzZXNfXy5maWx0ZXIoIChlOiBhbnkpID0+IGUuX19uYW1lX18gPT09IFwiV3JhcHBlclwiKVswXS5fanNfa2xhc3MuJGpzX2Z1bmM7XG5cdFx0KENvbXBvbmVudENsYXNzIGFzIGFueSkuSG9zdC5Db250cm9sZXIgPSBjbGFzcyB7XG5cblx0XHRcdCNicnk6IGFueTtcblxuXHRcdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oXCI/XCIsIGFyZ3MpO1xuXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0dGhpcy4jYnJ5ID0gX19CUllUSE9OX18uJGNhbGwoYnJ5X2NsYXNzLCBbMCwwLDBdKSguLi5hcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0I2NhbGwobmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBfX0JSWVRIT05fXy4kY2FsbChfX0JSWVRIT05fXy4kZ2V0YXR0cl9wZXA2NTcodGhpcy4jYnJ5LCBuYW1lLCBbMCwwLDBdKSwgWzAsMCwwXSkoLi4uYXJncylcblx0XHRcdH1cblxuXHRcdFx0Z2V0IGhvc3QoKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIFwiaG9zdFwiLCBbMCwwLDBdKVxuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYnJ5X2NsYXNzW1wib2JzZXJ2ZWRBdHRyaWJ1dGVzXCJdO1xuXG5cdFx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmKCBcIkhvc3RcIiBpbiBDb21wb25lbnRDbGFzcyApXG5cdFx0SG9zdCA9IENvbXBvbmVudENsYXNzLkhvc3QgYXMgYW55O1xuICAgIFxuICAgIGNvbnN0IENsYXNzICA9IEhvc3QuQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIEhvc3QsIG9wdHMpO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKHRhZ25hbWU6IHN0cmluZyApIHtcblx0cmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKG5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHJ8TElTU0hvc3Q8TElTU0NvbnRyb2xlcj58TElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+ICk6IHN0cmluZyB7XG5cblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQuY29uc3RydWN0b3IpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuY29uc3RydWN0b3IuSG9zdCBhcyBMSVNTSG9zdENzdHI8TElTU0NvbnRyb2xlcj47XG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50KVxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRlbGVtZW50ID0gZWxlbWVudC5Ib3N0O1xuXHRpZiggXCJDb250cm9sZXJcIiBpbiBlbGVtZW50LmNvbnN0cnVjdG9yKVxuXHRcdGVsZW1lbnQgPSBlbGVtZW50LmNvbnN0cnVjdG9yIGFzIExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPjtcblxuXHRpZiggXCJDb250cm9sZXJcIiBpbiBlbGVtZW50KSB7XG5cdFx0Y29uc3QgbmFtZSA9IGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoIGVsZW1lbnQgKTtcblx0XHRpZihuYW1lID09PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm90IGRlZmluZWQhXCIpO1xuXG5cdFx0cmV0dXJuIG5hbWU7XG5cdH1cblxuXHRpZiggISAoZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoJz8/PycpO1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+PihuYW1lOiBzdHJpbmcpOiBUIHtcblx0cmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChuYW1lKSBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KG5hbWU6IHN0cmluZyk6IFQge1xuXHRyZXR1cm4gZ2V0SG9zdENzdHI8TElTU0hvc3RDc3RyPFQ+PihuYW1lKS5Db250cm9sZXIgYXMgVDtcbn0iLCJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPik6IFJldHVyblR5cGU8dHlwZW9mIF9leHRlbmRzPEV4dGVuZHNDc3RyLCBPcHRzPj5cbi8vIExJU1NDb250cm9sZXIgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPlxuZXhwb3J0IGZ1bmN0aW9uIExJU1Mob3B0czogYW55ID0ge30pOiBMSVNTQ29udHJvbGVyQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NDb250cm9sZXJDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRlbmRzPFxuICAgICAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgICAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pIHtcblxuICAgIGlmKCBvcHRzLmV4dGVuZHMgPT09IHVuZGVmaW5lZCkgLy8gaDRja1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGEgTElTU0NvbnRyb2xlciEnKTtcblxuICAgIGNvbnN0IGNmZyA9IG9wdHMuZXh0ZW5kcy5Ib3N0LkNmZztcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0cywgY2ZnLCBjZmcuYXJncyk7XG5cbiAgICBjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBvcHRzLmV4dGVuZHMhIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgb3ZlcnJpZGUgX0hvc3Q6IExJU1NIb3N0PEV4dGVuZGVkTElTUz47XG5cbiAgICAgICAgLy8gVFMgaXMgc3R1cGlkLCByZXF1aXJlcyBleHBsaWNpdCByZXR1cm4gdHlwZVxuXHRcdHN0YXRpYyBvdmVycmlkZSBnZXQgSG9zdCgpOiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+IHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBmdWNrIG9mZlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuaG9zdCEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250ZW50X2dlbmVyYXRvciEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59IiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIExIb3N0LCBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuaW1wb3J0IHtkZWZpbmV9IGZyb20gXCIuLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vIHNob3VsZCBiZSBpbXByb3ZlZCAoYnV0IGhvdyA/KVxuY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2F1dG9kaXJdJyk7XG5cbmNvbnN0IFJFU1NPVVJDRVMgPSBbXG5cdFwiaW5kZXguanNcIixcblx0XCJpbmRleC5icnlcIixcblx0XCJpbmRleC5odG1sXCIsXG5cdFwiaW5kZXguY3NzXCJcbl07XG5cbmNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5sZXQgX2NkaXI6IG51bGx8c3RyaW5nO1xuXG5pZiggc2NyaXB0ICE9PSBudWxsICkge1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cblx0XHRjb25zdCBzd19wYXRoID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKTtcblxuXHRcdGlmKCBzd19wYXRoID09PSBudWxsICkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHN3X3BhdGgsIHtzY29wZTogXCIvXCJ9KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0X2NkaXIgPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdhdXRvZGlyJykhO1xuXHRjb25zb2xlLndhcm4oX2NkaXIpO1xuXHRpZiggX2NkaXJbX2NkaXIubGVuZ3RoLTFdICE9PSAnLycpXG5cdFx0X2NkaXIgKz0gJy8nO1xuXG5cdGNvbnN0IGJyeXRob24gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwiYnJ5dGhvblwiKTtcblxuXHQvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdFx0XHRcdGFkZFRhZyhhZGRpdGlvbilcblxuXHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqXCIpIClcblx0XHRhZGRUYWcoIGVsZW0gKTtcblxuXG5cdGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IHRhZ25hbWUgPSAoIHRhZy5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gdGFnLnRhZ05hbWUgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0aWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGNkaXI6IF9jZGlyLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1x0XHRcblx0fVxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiB7aHRtbDogc3RyaW5nLCBjc3M6IHN0cmluZywgaG9zdDogQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+fSkge1xuXG5cdGNvbnN0IGNfanMgICAgICA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cblx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdGlmKCBjX2pzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NfanNdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcblx0XHRjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuXHRcdGNvbnN0IG9sZHJlcSA9IExJU1MucmVxdWlyZTtcblxuXHRcdExJU1MucmVxdWlyZSA9IGZ1bmN0aW9uKHVybDogVVJMfHN0cmluZykge1xuXG5cdFx0XHRpZiggdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiAmJiB1cmwuc3RhcnRzV2l0aCgnLi8nKSApIHtcblx0XHRcdFx0Y29uc3QgZmlsZW5hbWUgPSB1cmwuc2xpY2UoMik7XG5cdFx0XHRcdGlmKCBmaWxlbmFtZSBpbiBmaWxlcylcblx0XHRcdFx0XHRyZXR1cm4gZmlsZXNbZmlsZW5hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb2xkcmVxKHVybCk7XG5cdFx0fVxuXG5cdFx0a2xhc3MgPSAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJsKSkuZGVmYXVsdDtcblxuXHRcdExJU1MucmVxdWlyZSA9IG9sZHJlcTtcblx0fVxuXHRlbHNlIGlmKCBvcHRzLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGtsYXNzID0gTElTUyh7XG5cdFx0XHQuLi5vcHRzLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3Jcblx0XHR9KTtcblx0fVxuXG5cdGlmKGtsYXNzID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0ZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuXHRyZXR1cm4ga2xhc3M7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgaW50ZXJuYWwgdG9vbHMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdGNvbnN0IG9wdGlvbnMgPSBpc0xpc3NBdXRvXG5cdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHQ6IHt9O1xuXG5cblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuXHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRpZiggaXNMaXNzQXV0byAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0Y29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG5cdGlmKGFuc3dlciA9PT0gXCJcIilcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhbnN3ZXJcbn1cbmFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdC8vIHRlc3QgZm9yIHRoZSBtb2R1bGUgZXhpc3RhbmNlLlxuXHRpZihpc0xpc3NBdXRvICYmIGF3YWl0IF9mZXRjaFRleHQodXJpLCBpc0xpc3NBdXRvKSA9PT0gdW5kZWZpbmVkIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmkpKS5kZWZhdWx0O1xuXHR9IGNhdGNoKGUpIHtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59XG5cblxuY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5mdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn1cblxuZXhwb3J0IGNsYXNzIExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuXHRwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcGFyZUhUTUwoaHRtbD86IERvY3VtZW50RnJhZ21lbnQgfCBIVE1MRWxlbWVudCB8IHN0cmluZykge1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IG51bGw7XG5cblx0XHRpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuXG5cdFx0XHR0aGlzLmRhdGEgPSBodG1sO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHQvKlxuXHRcdFx0aHRtbCA9IGh0bWwucmVwbGFjZUFsbCgvXFwkXFx7KFtcXHddKylcXH0vZywgKF8sIG5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYDxsaXNzIHZhbHVlPVwiJHtuYW1lfVwiPjwvbGlzcz5gO1xuXHRcdFx0fSk7Ki9cblxuXHRcdFx0Ly9UT0RPOiAke30gaW4gYXR0clxuXHRcdFx0XHQvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG5cdFx0XHRcdC8vIC0gcmVnaXN0ZXIgZWxlbSArIGF0dHIgbmFtZVxuXHRcdFx0XHQvLyAtIHJlcGxhY2UuIFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gc3VwZXIucHJlcGFyZUhUTUwoaHRtbCk7XG5cdH1cblxuXHRvdmVycmlkZSBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudCB8IFNoYWRvd1Jvb3Qge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKGhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbnRlbnQgPSBzdXBlci5nZW5lcmF0ZShob3N0KTtcblxuXHRcdC8qXG5cdFx0Ly8gaHRtbCBtYWdpYyB2YWx1ZXMuXG5cdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdFx0Ly8gY3NzIHByb3AuXG5cdFx0Y29uc3QgY3NzX2F0dHJzID0gaG9zdC5nZXRBdHRyaWJ1dGVOYW1lcygpLmZpbHRlciggZSA9PiBlLnN0YXJ0c1dpdGgoJ2Nzcy0nKSk7XG5cdFx0Zm9yKGxldCBjc3NfYXR0ciBvZiBjc3NfYXR0cnMpXG5cdFx0XHRob3N0LnN0eWxlLnNldFByb3BlcnR5KGAtLSR7Y3NzX2F0dHIuc2xpY2UoJ2Nzcy0nLmxlbmd0aCl9YCwgaG9zdC5nZXRBdHRyaWJ1dGUoY3NzX2F0dHIpKTtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBpbXBvcnRDb21wb25lbnRzIDogdHlwZW9mIGltcG9ydENvbXBvbmVudHM7XG4gICAgICAgIGltcG9ydENvbXBvbmVudCAgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50O1xuICAgICAgICByZXF1aXJlICAgICAgICAgIDogdHlwZW9mIHJlcXVpcmU7XG4gICAgfVxufVxuXG50eXBlIGltcG9ydENvbXBvbmVudHNfT3B0czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGwsXG5cdGJyeXRob24/OiBzdHJpbmd8bnVsbCxcblx0aG9zdCAgID86IENvbnN0cnVjdG9yPFQ+XG59O1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0XHRcdFx0XHRcdGNvbXBvbmVudHM6IHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjZGlyICAgID0gX2NkaXIsXG5cdFx0XHRcdFx0XHRcdGJyeXRob24gPSBudWxsLFxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudFxuXHRcdFx0XHRcdFx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+KSB7XG5cblx0Y29uc3QgcmVzdWx0czogUmVjb3JkPHN0cmluZywgTElTU0NvbnRyb2xlckNzdHI+ID0ge307XG5cblx0Zm9yKGxldCB0YWduYW1lIG9mIGNvbXBvbmVudHMpIHtcblxuXHRcdHJlc3VsdHNbdGFnbmFtZV0gPSBhd2FpdCBpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0Y2Rpcixcblx0XHRcdGJyeXRob24sXG5cdFx0XHRob3N0XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuY29uc3QgYnJ5X3dyYXBwZXIgPSBgZGVmIHdyYXBqcyhqc19rbGFzcyk6XG5cbiAgICBjbGFzcyBXcmFwcGVyOlxuXG4gICAgICAgIF9qc19rbGFzcyA9IGpzX2tsYXNzXG4gICAgICAgIF9qcyA9IE5vbmVcblxuICAgICAgICBkZWYgX19pbml0X18oc2VsZiwgKmFyZ3MpOlxuICAgICAgICAgICAgc2VsZi5fanMgPSBqc19rbGFzcy5uZXcoKmFyZ3MpXG5cbiAgICAgICAgZGVmIF9fZ2V0YXR0cl9fKHNlbGYsIG5hbWU6IHN0cik6XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fanNbbmFtZV07XG5cbiAgICAgICAgZGVmIF9fc2V0YXR0cl9fKHNlbGYsIG5hbWU6IHN0ciwgdmFsdWUpOlxuICAgICAgICAgICAgaWYgbmFtZSA9PSBcIl9qc1wiOlxuICAgICAgICAgICAgICAgIHN1cGVyKCkuX19zZXRhdHRyX18obmFtZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBzZWxmLl9qc1tuYW1lXSA9IHZhbHVlXG5cbiAgICByZXR1cm4gV3JhcHBlclxuXG5gO1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gX2NkaXIsXG5cdFx0YnJ5dGhvbiA9IG51bGwsXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudCxcblx0XHRmaWxlcyAgID0gbnVsbFxuXHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4gJiB7ZmlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fG51bGx9ID0ge31cbikge1xuXG5cdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RhZ25hbWV9L2A7XG5cblx0aWYoIGZpbGVzID09PSBudWxsICkge1xuXHRcdGZpbGVzID0ge307XG5cblx0XHRjb25zdCBmaWxlID0gYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgPyAnaW5kZXguYnJ5JyA6ICdpbmRleC5qcyc7XG5cblx0XHRmaWxlc1tmaWxlXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn0ke2ZpbGV9YCwgdHJ1ZSkpITtcblx0fVxuXG5cdGlmKCBicnl0aG9uID09PSBcInRydWVcIiAmJiBmaWxlc1snaW5kZXguYnJ5J10gIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0Y29uc3QgY29kZSA9IGJyeV93cmFwcGVyICsgZmlsZXNbXCJpbmRleC5icnlcIl07XG5cblx0XHRmaWxlc1snaW5kZXguanMnXSA9XG5gY29uc3QgJEIgPSBnbG9iYWxUaGlzLl9fQlJZVEhPTl9fO1xuXG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHtjb2RlfVxcYCwgXCJfXCIpO1xuXG5jb25zdCBtb2R1bGUgPSAkQi5pbXBvcnRlZFtcIl9cIl07XG5leHBvcnQgZGVmYXVsdCBtb2R1bGUuV2ViQ29tcG9uZW50O1xuXG5gO1xuXHR9XG5cblx0Y29uc3QgaHRtbCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIHtodG1sLCBjc3MsIGhvc3R9KTtcbn1cblxuZnVuY3Rpb24gcmVxdWlyZSh1cmw6IFVSTHxzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPnxzdHJpbmcge1xuXHRyZXR1cm4gZmV0Y2godXJsKTtcbn1cblxuXG5MSVNTLmltcG9ydENvbXBvbmVudHMgPSBpbXBvcnRDb21wb25lbnRzO1xuTElTUy5pbXBvcnRDb21wb25lbnQgID0gaW1wb3J0Q29tcG9uZW50O1xuTElTUy5yZXF1aXJlICA9IHJlcXVpcmU7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcIi4uL3N0YXRlXCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufSIsIlxuaW1wb3J0IHsgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxudHlwZSBMaXN0ZW5lckZjdDxUIGV4dGVuZHMgRXZlbnQ+ID0gKGV2OiBUKSA9PiB2b2lkO1xudHlwZSBMaXN0ZW5lck9iajxUIGV4dGVuZHMgRXZlbnQ+ID0geyBoYW5kbGVFdmVudDogTGlzdGVuZXJGY3Q8VD4gfTtcbnR5cGUgTGlzdGVuZXI8VCBleHRlbmRzIEV2ZW50PiA9IExpc3RlbmVyRmN0PFQ+fExpc3RlbmVyT2JqPFQ+O1xuXG5leHBvcnQgY2xhc3MgRXZlbnRUYXJnZXQyPEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEV2ZW50Pj4gZXh0ZW5kcyBFdmVudFRhcmdldCB7XG5cblx0b3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGNhbGxiYWNrOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBvcHRpb25zPzogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuKTogdm9pZCB7XG5cdFx0XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0cmV0dXJuIHN1cGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZGlzcGF0Y2hFdmVudDxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+PihldmVudDogRXZlbnRzW1RdKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHN1cGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG5cblx0b3ZlcnJpZGUgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsaXN0ZW5lcjogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG9wdGlvbnM/OiBib29sZWFufEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZCB7XG5cblx0XHQvL0B0cy1pZ25vcmVcblx0XHRzdXBlci5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXZlbnQyPFQgZXh0ZW5kcyBzdHJpbmcsIEFyZ3M+IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8QXJncz4ge1xuXG5cdGNvbnN0cnVjdG9yKHR5cGU6IFQsIGFyZ3M6IEFyZ3MpIHtcblx0XHRzdXBlcih0eXBlLCB7ZGV0YWlsOiBhcmdzfSk7XG5cdH1cblxuXHRvdmVycmlkZSBnZXQgdHlwZSgpOiBUIHsgcmV0dXJuIHN1cGVyLnR5cGUgYXMgVDsgfVxufVxuXG50eXBlIEluc3RhbmNlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+Pj4gPSB7XG5cdFtLIGluIGtleW9mIFRdOiBJbnN0YW5jZVR5cGU8VFtLXT5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdpdGhFdmVudHM8VCBleHRlbmRzIG9iamVjdCwgRXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+PiA+KGV2OiBDb25zdHJ1Y3RvcjxUPiwgX2V2ZW50czogRXZlbnRzKSB7XG5cblx0dHlwZSBFdnRzID0gSW5zdGFuY2VzPEV2ZW50cz47XG5cblx0aWYoICEgKGV2IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQpIClcblx0XHRyZXR1cm4gZXYgYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xuXG5cdC8vIGlzIGFsc28gYSBtaXhpblxuXHQvLyBAdHMtaWdub3JlXG5cdGNsYXNzIEV2ZW50VGFyZ2V0TWl4aW5zIGV4dGVuZHMgZXYge1xuXG5cdFx0I2V2ID0gbmV3IEV2ZW50VGFyZ2V0MjxFdnRzPigpO1xuXG5cdFx0YWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hFdmVudCguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuZGlzcGF0Y2hFdmVudCguLi5hcmdzKTtcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiBFdmVudFRhcmdldE1peGlucyBhcyB1bmtub3duIGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+Pjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBTaGFkb3dSb290IHRvb2xzID09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBldmVudE1hdGNoZXMoZXY6IEV2ZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cblx0bGV0IGVsZW1lbnRzID0gZXYuY29tcG9zZWRQYXRoKCkuc2xpY2UoMCwtMikuZmlsdGVyKGUgPT4gISAoZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpICkucmV2ZXJzZSgpIGFzIEhUTUxFbGVtZW50W107XG5cblx0Zm9yKGxldCBlbGVtIG9mIGVsZW1lbnRzIClcblx0XHRpZihlbGVtLm1hdGNoZXMoc2VsZWN0b3IpIClcblx0XHRcdHJldHVybiBlbGVtOyBcblxuXHRyZXR1cm4gbnVsbDtcbn0iLCJcbmltcG9ydCB0eXBlIHsgTElTU0NvbnRyb2xlciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGluaXRpYWxpemVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQgfSBmcm9tIFwiLi4vc3RhdGVcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudHMge307XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgLy8gYXN5bmNcbiAgICAgICAgcXMgOiB0eXBlb2YgcXM7XG4gICAgICAgIHFzbzogdHlwZW9mIHFzbztcbiAgICAgICAgcXNhOiB0eXBlb2YgcXNhO1xuICAgICAgICBxc2M6IHR5cGVvZiBxc2M7XG5cbiAgICAgICAgLy8gc3luY1xuICAgICAgICBxc1N5bmMgOiB0eXBlb2YgcXNTeW5jO1xuICAgICAgICBxc2FTeW5jOiB0eXBlb2YgcXNhU3luYztcbiAgICAgICAgcXNjU3luYzogdHlwZW9mIHFzY1N5bmM7XG5cblx0XHRjbG9zZXN0OiB0eXBlb2YgY2xvc2VzdDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3Nfc2VsZWN0b3IobmFtZT86IHN0cmluZykge1xuXHRpZihuYW1lID09PSB1bmRlZmluZWQpIC8vIGp1c3QgYW4gaDRja1xuXHRcdHJldHVybiBcIlwiO1xuXHRyZXR1cm4gYDppcygke25hbWV9LCBbaXM9XCIke25hbWV9XCJdKWA7XG59XG5cbmZ1bmN0aW9uIF9idWlsZFFTKHNlbGVjdG9yOiBzdHJpbmcsIHRhZ25hbWVfb3JfcGFyZW50Pzogc3RyaW5nIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LCBwYXJlbnQ6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cdFxuXHRpZiggdGFnbmFtZV9vcl9wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGFnbmFtZV9vcl9wYXJlbnQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cGFyZW50ID0gdGFnbmFtZV9vcl9wYXJlbnQ7XG5cdFx0dGFnbmFtZV9vcl9wYXJlbnQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRyZXR1cm4gW2Ake3NlbGVjdG9yfSR7bGlzc19zZWxlY3Rvcih0YWduYW1lX29yX3BhcmVudCBhcyBzdHJpbmd8dW5kZWZpbmVkKX1gLCBwYXJlbnRdIGFzIGNvbnN0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGxldCByZXN1bHQgPSBhd2FpdCBxc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFRbXT47XG5hc3luYyBmdW5jdGlvbiBxc2E8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl1bXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPFQ+PiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRwcm9taXNlc1tpZHgrK10gPSB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4ocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPihyZXN1bHQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2xvc2VzdDxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCkge1xuXG5cdHdoaWxlKHRydWUpIHtcblx0XHR2YXIgcmVzdWx0ID0gZWxlbWVudC5jbG9zZXN0PEU+KHNlbGVjdG9yKTtcblxuXHRcdGlmKCByZXN1bHQgIT09IG51bGwpXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcblx0XHRpZiggISAoXCJob3N0XCIgaW4gcm9vdCkgKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRlbGVtZW50ID0gKHJvb3QgYXMgU2hhZG93Um9vdCkuaG9zdDtcblx0fVxufVxuXG5cbi8vIGFzeW5jXG5MSVNTLnFzICA9IHFzO1xuTElTUy5xc28gPSBxc287XG5MSVNTLnFzYSA9IHFzYTtcbkxJU1MucXNjID0gcXNjO1xuXG4vLyBzeW5jXG5MSVNTLnFzU3luYyAgPSBxc1N5bmM7XG5MSVNTLnFzYVN5bmMgPSBxc2FTeW5jO1xuTElTUy5xc2NTeW5jID0gcXNjU3luYztcblxuTElTUy5jbG9zZXN0ID0gY2xvc2VzdDsiLCJpbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgZ2V0SG9zdENzdHIsIGdldE5hbWUgfSBmcm9tIFwiLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5lbnVtIFN0YXRlIHtcbiAgICBOT05FID0gMCxcblxuICAgIC8vIGNsYXNzXG4gICAgREVGSU5FRCA9IDEgPDwgMCxcbiAgICBSRUFEWSAgID0gMSA8PCAxLFxuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBVUEdSQURFRCAgICA9IDEgPDwgMixcbiAgICBJTklUSUFMSVpFRCA9IDEgPDwgMyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRklORUQgICAgID0gU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IFN0YXRlLlJFQURZO1xuZXhwb3J0IGNvbnN0IFVQR1JBREVEICAgID0gU3RhdGUuVVBHUkFERUQ7XG5leHBvcnQgY29uc3QgSU5JVElBTElaRUQgPSBTdGF0ZS5JTklUSUFMSVpFRDtcblxuZXhwb3J0IGNsYXNzIExJU1NTdGF0ZSB7XG5cbiAgICAjZWxlbTogSFRNTEVsZW1lbnR8bnVsbDtcblxuICAgIC8vIGlmIG51bGwgOiBjbGFzcyBzdGF0ZSwgZWxzZSBpbnN0YW5jZSBzdGF0ZVxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEhUTUxFbGVtZW50fG51bGwgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuI2VsZW0gPSBlbGVtO1xuICAgIH1cblxuICAgIHN0YXRpYyBERUZJTkVEICAgICA9IERFRklORUQ7XG4gICAgc3RhdGljIFJFQURZICAgICAgID0gUkVBRFk7XG4gICAgc3RhdGljIFVQR1JBREVEICAgID0gVVBHUkFERUQ7XG4gICAgc3RhdGljIElOSVRJQUxJWkVEID0gSU5JVElBTElaRUQ7XG5cbiAgICBpcyhzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCAgICAgJiYgISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZICAgICAgICYmICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgICAgJiYgISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCAmJiAhIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW4oc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGxldCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPGFueT4+KCk7XG4gICAgXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuRGVmaW5lZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblJlYWR5KCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuVXBncmFkZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5Jbml0aWFsaXplZCgpICk7XG4gICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gREVGSU5FRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0RlZmluZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKCBnZXROYW1lKHRoaXMuI2VsZW0pICkgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gUkVBRFkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcbiAgICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBob3N0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NDb250cm9sZXJDc3RyPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTtcbiAgICBcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBob3N0KVxuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICBcbiAgICAgICAgLy8gaDRja1xuICAgIFxuICAgICAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgXG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcblxuICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBJTklUSUFMSVpFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0luaXRpYWxpemVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIFwiaXNJbml0aWFsaXplZFwiIGluIGVsZW0gJiYgZWxlbS5pc0luaXRpYWxpemVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuY29udHJvbGVyIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IENPTlZFUlNJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFsdWVPZigpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgbGV0IHN0YXRlOiBTdGF0ZSA9IDA7XG4gICAgXG4gICAgICAgIGlmKCB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBERUZJTkVEO1xuICAgICAgICBpZiggdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHN0YXRlIHw9IFJFQURZO1xuICAgICAgICBpZiggdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IFVQR1JBREVEO1xuICAgICAgICBpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IElOSVRJQUxJWkVEO1xuICAgIFxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IGlzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJERUZJTkVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBpcy5wdXNoKFwiUkVBRFlcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJVUEdSQURFRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIklOSVRJQUxJWkVEXCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gaXMuam9pbignfCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYoIFwic3RhdGVcIiBpbiBlbGVtKVxuICAgICAgICByZXR1cm4gZWxlbS5zdGF0ZSBhcyBMSVNTU3RhdGU7XG4gICAgXG4gICAgcmV0dXJuIChlbGVtIGFzIGFueSkuc3RhdGUgPSBuZXcgTElTU1N0YXRlKGVsZW0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gU3RhdGUgbW9kaWZpZXJzIChtb3ZlPykgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdvIHRvIHN0YXRlIFVQR1JBREVEXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBncmFkZTxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0NvbnRyb2xlckNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuRGVmaW5lZCgpO1xuXG4gICAgcmV0dXJuIHVwZ3JhZGVTeW5jPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBncmFkZVN5bmM8VCBleHRlbmRzIExJU1NIb3N0PExJU1NDb250cm9sZXJDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHIoZ2V0TmFtZShlbGVtKSk7XG5cbiAgICBpZiggISAoZWxlbSBpbnN0YW5jZW9mIEhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGRpZG4ndCB1cGdyYWRlIWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgVDtcbn1cblxuLy8gR28gdG8gc3RhdGUgSU5JVElBTElaRURcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemU8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufGFueVtdID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlIClcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmNvbnRyb2xlciBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuUmVhZHkoKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IFtdIDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZSguLi5wYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuY29udHJvbGVyIGFzIFQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufGFueVtdID0gZmFsc2UpOiBUIHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuY29udHJvbGVyIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBzdGF0ZS5pc1JlYWR5IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IFtdIDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZSguLi5wYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuY29udHJvbGVyIGFzIFQ7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09IGV4dGVybmFsIFdIRU4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0NvbnRyb2xlckNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgTElTU1N0YXRlIH0gZnJvbSBcIi4vc3RhdGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50ID9cbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IHtcbiAgICAgICAgZXh0ZW5kczogRXh0ZW5kc0N0ciwgLy8gSlMgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0ciwgICAvLyBIVE1MIEhvc3RcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxufSAmIENvbnRlbnRHZW5lcmF0b3JfT3B0cztcblxuLy8gTElTU0NvbnRyb2xlclxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gSW5zdGFuY2VUeXBlPExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgICAgIGluZmVyIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgID4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsSG9zdENzdHI+IDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlciA/IExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+O1xuXG4vLyBsaWdodGVyIExJU1NIb3N0IGRlZiB0byBhdm9pZCB0eXBlIGlzc3Vlcy4uLlxuZXhwb3J0IHR5cGUgTEhvc3Q8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuXG4gICAgc3RhdGUgIDogTElTU1N0YXRlO1xuICAgIGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgQ1NTU2VsZWN0b3I6IHN0cmluZztcblxufSAmIEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbmV4cG9ydCB0eXBlIExIb3N0Q3N0cjxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG4gICAgbmV3KC4uLmFyZ3M6IGFueSk6IExIb3N0PEhvc3RDc3RyPjtcblxuICAgIENmZzoge1xuICAgICAgICBob3N0ICAgICAgICAgICAgIDogSG9zdENzdHIsXG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbiAgICAgICAgYXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuICAgIH1cblxuICAgIHN0YXRlICA6IExJU1NTdGF0ZTtcblxufSAmIEhvc3RDc3RyOyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGlmKCBDbGFzcyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBDbGFzcyA9IENsYXNzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBIVE1MRWxlbWVudDtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblxuICAgIGxldCBjdXJzb3IgPSBDbGFzcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2hpbGUgKGN1cnNvci5fX3Byb3RvX18gIT09IEhUTUxFbGVtZW50KVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5fX3Byb3RvX187XG5cbiAgICAvLyBkaXJlY3RseSBpbmhlcml0IEhUTUxFbGVtZW50XG4gICAgaWYoICEgY3Vyc29yLm5hbWUuc3RhcnRzV2l0aCgnSFRNTCcpICYmICEgY3Vyc29yLm5hbWUuZW5kc1dpdGgoJ0VsZW1lbnQnKSApXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaHRtbHRhZyA9IGN1cnNvci5uYW1lLnNsaWNlKDQsIC03KTtcblxuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG4vKlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG4qL1xuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL3N0YXRlXCI7XG5pbXBvcnQgXCIuL2NvcmUvY3VzdG9tUmVnaXN0ZXJ5XCI7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vVE9ETzogZXZlbnRzLnRzXG4vL1RPRE86IGdsb2JhbENTU1J1bGVzXG5leHBvcnQge0xJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL2hlbHBlcnMvTElTU0F1dG9cIjtcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge1NoYWRvd0NmZ30gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHtsaXNzLCBsaXNzU3luY30gZnJvbSBcIi4vaGVscGVycy9idWlsZFwiO1xuZXhwb3J0IHtldmVudE1hdGNoZXMsIFdpdGhFdmVudHMsIEV2ZW50VGFyZ2V0MiwgQ3VzdG9tRXZlbnQyfSBmcm9tICcuL2hlbHBlcnMvZXZlbnRzJztcbmV4cG9ydCB7aHRtbH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7XG5cbi8vIGZvciBkZWJ1Zy5cbmV4cG9ydCB7X2V4dGVuZHN9IGZyb20gXCIuL2V4dGVuZHNcIjtcblxuLy8gcmVxdWlyZWQgZm9yIGF1dG8gbW9kZSBpdCBzZWVtcy5cbi8vIEB0cy1pZ25vcmVcbmdsb2JhbFRoaXMuTElTUyA9IExJU1M7Il0sIm5hbWVzIjpbImdldFNoYXJlZENTUyIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJpc1NoYWRvd1N1cHBvcnRlZCIsIndhaXRET01Db250ZW50TG9hZGVkIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwic2hhcmVkQ1NTIiwiQ29udGVudEdlbmVyYXRvciIsImRhdGEiLCJjb25zdHJ1Y3RvciIsImh0bWwiLCJjc3MiLCJzaGFkb3ciLCJwcmVwYXJlSFRNTCIsInByZXBhcmVDU1MiLCJzZXRUZW1wbGF0ZSIsInRlbXBsYXRlIiwiaXNSZWFkeSIsIndoZW5SZWFkeSIsImdlbmVyYXRlIiwiaG9zdCIsInRhcmdldCIsImluaXRTaGFkb3ciLCJpbmplY3RDU1MiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwic2hhZG93TW9kZSIsIk5PTkUiLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwicmVwbGFjZUNoaWxkcmVuIiwiU2hhZG93Um9vdCIsImFwcGVuZCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImNhbkhhdmVTaGFkb3ciLCJFcnJvciIsIm1vZGUiLCJPUEVOIiwiYXR0YWNoU2hhZG93IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZSIsInByb2Nlc3NDU1MiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsInVuZGVmaW5lZCIsInN0ciIsInRyaW0iLCJpbm5lckhUTUwiLCJIVE1MRWxlbWVudCIsInN0eWxlc2hlZXRzIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwicHVzaCIsImNzc3NlbGVjdG9yIiwiQ1NTU2VsZWN0b3IiLCJoYXMiLCJzZXRBdHRyaWJ1dGUiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsInJlcGxhY2UiLCJoZWFkIiwiYWRkIiwiYnVpbGRMSVNTSG9zdCIsInNldENzdHJDb250cm9sZXIiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkxJU1MiLCJhcmdzIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwiY29udGVudF9nZW5lcmF0b3IiLCJMSVNTQ29udHJvbGVyIiwiSG9zdCIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsIm5hbWUiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImlzQ29ubmVjdGVkIiwiX0hvc3QiLCJzdGF0ZSIsIkxJU1NTdGF0ZSIsImlkIiwiX19jc3RyX2NvbnRyb2xlciIsIkxpc3MiLCJob3N0Q3N0ciIsImNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIiLCJMSVNTSG9zdCIsIkNmZyIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkNvbnRyb2xlciIsImNvbnRyb2xlciIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwicGFyYW1zIiwiaW5pdCIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInByb21pc2UiLCJyZXNvbHZlIiwiUHJvbWlzZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsImRlZmluZSIsImdldENvbnRyb2xlckNzdHIiLCJnZXRIb3N0Q3N0ciIsImdldE5hbWUiLCJpc0RlZmluZWQiLCJ3aGVuQWxsRGVmaW5lZCIsIndoZW5EZWZpbmVkIiwiZ2V0U3RhdGUiLCJpbml0aWFsaXplU3luYyIsInVwZ3JhZGVTeW5jIiwid2hlblVwZ3JhZGVkIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsImJyeV9jbGFzcyIsIl9fYmFzZXNfXyIsImZpbHRlciIsIl9fbmFtZV9fIiwiX2pzX2tsYXNzIiwiJGpzX2Z1bmMiLCJjb25zb2xlIiwid2FybiIsIl9fQlJZVEhPTl9fIiwiJGNhbGwiLCIkZ2V0YXR0cl9wZXA2NTciLCJDbGFzcyIsImh0bWx0YWciLCJvcHRzIiwidGFnbmFtZXMiLCJhbGwiLCJ0IiwiZ2V0IiwiZWxlbWVudCIsIkVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiX0xJU1MiLCJJTElTUyIsImNmZyIsImFzc2lnbiIsIkV4dGVuZGVkTElTUyIsInNjcmlwdCIsIlJFU1NPVVJDRVMiLCJLbm93blRhZ3MiLCJfY2RpciIsIlNXIiwic3dfcGF0aCIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInNjb3BlIiwiZXJyb3IiLCJjb250cm9sbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJyeXRob24iLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJhZGRUYWciLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImVsZW0iLCJ0YWciLCJpbXBvcnRDb21wb25lbnQiLCJjZGlyIiwiZGVmaW5lV2ViQ29tcG9uZW50IiwiZmlsZXMiLCJjX2pzIiwia2xhc3MiLCJmaWxlIiwiQmxvYiIsInR5cGUiLCJ1cmwiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJvbGRyZXEiLCJyZXF1aXJlIiwic3RhcnRzV2l0aCIsImZpbGVuYW1lIiwic2xpY2UiLCJkZWZhdWx0IiwiTElTU0F1dG9fQ29udGVudEdlbmVyYXRvciIsIl9mZXRjaFRleHQiLCJ1cmkiLCJpc0xpc3NBdXRvIiwib3B0aW9ucyIsImhlYWRlcnMiLCJyZXNwb25zZSIsImZldGNoIiwic3RhdHVzIiwiYW5zd2VyIiwidGV4dCIsIl9pbXBvcnQiLCJsb2ciLCJjb252ZXJ0ZXIiLCJlbmNvZGVIVE1MIiwidGV4dENvbnRlbnQiLCJtYXRjaCIsImNzc19hdHRycyIsImdldEF0dHJpYnV0ZU5hbWVzIiwiY3NzX2F0dHIiLCJzZXRQcm9wZXJ0eSIsImltcG9ydENvbXBvbmVudHMiLCJjb21wb25lbnRzIiwicmVzdWx0cyIsImJyeV93cmFwcGVyIiwiY29tcG9fZGlyIiwiY29kZSIsImxpc3MiLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJFdmVudFRhcmdldDIiLCJFdmVudFRhcmdldCIsImNhbGxiYWNrIiwiZGlzcGF0Y2hFdmVudCIsImV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxpc3RlbmVyIiwiQ3VzdG9tRXZlbnQyIiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJXaXRoRXZlbnRzIiwiZXYiLCJfZXZlbnRzIiwiRXZlbnRUYXJnZXRNaXhpbnMiLCJldmVudE1hdGNoZXMiLCJzZWxlY3RvciIsImVsZW1lbnRzIiwiY29tcG9zZWRQYXRoIiwicmV2ZXJzZSIsIm1hdGNoZXMiLCJsaXNzX3NlbGVjdG9yIiwiX2J1aWxkUVMiLCJ0YWduYW1lX29yX3BhcmVudCIsInBhcmVudCIsInFzIiwicmVzdWx0IiwicXNvIiwicXNhIiwiaWR4IiwicHJvbWlzZXMiLCJxc2MiLCJyZXMiLCJjbG9zZXN0IiwicXNTeW5jIiwicXNhU3luYyIsInFzY1N5bmMiLCJyb290IiwiZ2V0Um9vdE5vZGUiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsIlN0YXRlIiwiaXMiLCJpc1VwZ3JhZGVkIiwid2hlbiIsIl93aGVuVXBncmFkZWQiLCJ2YWx1ZU9mIiwidG9TdHJpbmciLCJqb2luIiwic3RyaWN0Iiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImZvcmNlIiwiTGlmZUN5Y2xlIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwiZ2xvYmFsVGhpcyJdLCJzb3VyY2VSb290IjoiIn0=