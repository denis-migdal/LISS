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


let __cstr_host = null;
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
        static observedAttributes = Liss.observedAttributes;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEtBQUtDLFNBQVMsRUFDdEcsT0FBT2hTLFNBQVNRLE9BQU8sQ0FBQ3FSLFVBQVU7SUFFcEMsT0FBTzdSLFNBQVNRLE9BQU87QUFDM0I7Ozs7Ozs7U0MxSEE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZCO0FBRVA7QUFDVTtBQUUrQjtBQUUvRCxpQkFBaUI7QUFDakIsc0JBQXNCO0FBQ3VDO0FBQzNCO0FBRUE7QUFFYTtBQUN1QztBQUN6RDtBQUM3QixpRUFBZW9ELGdEQUFJQSxFQUFDO0FBRXBCLGFBQWE7QUFDc0I7QUFFbkMsbUNBQW1DO0FBQ25DLGFBQWE7QUFDYnFPLFdBQVdyTyxJQUFJLEdBQUdBLGdEQUFJQSIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NDb250cm9sZXIudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2NvcmUvY3VzdG9tUmVnaXN0ZXJ5LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY29yZS9zdGF0ZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2N1c3RvbVJlZ2lzdGVyeS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2V4dGVuZHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL0xJU1NBdXRvLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9idWlsZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvZXZlbnRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9xdWVyeVNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTaGFyZWRDU1MgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgTEhvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIGlzU2hhZG93U3VwcG9ydGVkLCB3YWl0RE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbnR5cGUgSFRNTCA9IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nO1xudHlwZSBDU1MgID0gc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudDtcblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge1xuICAgIGh0bWwgICA/OiBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZyxcbiAgICBjc3MgICAgPzogQ1NTIHwgcmVhZG9ubHkgQ1NTW10sXG4gICAgc2hhZG93ID86IFNoYWRvd0NmZ3xudWxsXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JDc3RyID0geyBuZXcob3B0czogQ29udGVudEdlbmVyYXRvcl9PcHRzKTogQ29udGVudEdlbmVyYXRvciB9O1xuXG5jb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgICNzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdO1xuICAgICN0ZW1wbGF0ZSAgIDogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsO1xuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgZGF0YTogYW55O1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRoaXMucHJlcGFyZUhUTUwoaHRtbCk7XG4gICAgXG4gICAgICAgIHRoaXMuI3N0eWxlc2hlZXRzID0gdGhpcy5wcmVwYXJlQ1NTKGNzcyk7XG5cbiAgICAgICAgdGhpcy4jaXNSZWFkeSAgID0gaXNET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIHRoaXMuI3doZW5SZWFkeSA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgLy9UT0RPOiBvdGhlciBkZXBzLi4uXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFRlbXBsYXRlKHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgI3doZW5SZWFkeTogUHJvbWlzZTx1bmtub3duPjtcbiAgICAjaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lzUmVhZHk7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKCB0aGlzLiNpc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy4jd2hlblJlYWR5O1xuICAgICAgICAvL1RPRE86IGRlcHMuXG4gICAgICAgIC8vVE9ETzogQ1NTL0hUTUwgcmVzb3VyY2VzLi4uXG5cbiAgICAgICAgLy8gaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cbiAgICAgICAgLy8gX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG4gICAgICAgIC8vICsgY2YgYXQgdGhlIGVuZC4uLlxuICAgIH1cblxuICAgIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50fFNoYWRvd1Jvb3Qge1xuXG4gICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi4gICAgIFxuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaW5pdFNoYWRvdyhob3N0KTtcblxuICAgICAgICB0aGlzLmluamVjdENTUyh0YXJnZXQsIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy4jdGVtcGxhdGUhLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBpZiggaG9zdC5zaGFkb3dNb2RlICE9PSBTaGFkb3dDZmcuTk9ORSB8fCB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuICAgICAgICAgICAgdGFyZ2V0LnJlcGxhY2VDaGlsZHJlbihjb250ZW50KTtcblxuICAgICAgICBpZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCAmJiB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApXG5cdFx0XHR0YXJnZXQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGhvc3QpO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTaGFkb3c8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KSB7XG5cbiAgICAgICAgY29uc3QgY2FuSGF2ZVNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpO1xuICAgICAgICBpZiggdGhpcy4jc2hhZG93ICE9PSBudWxsICYmIHRoaXMuI3NoYWRvdyAhPT0gU2hhZG93Q2ZnLk5PTkUgJiYgISBjYW5IYXZlU2hhZG93IClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICAgICAgbGV0IG1vZGUgPSB0aGlzLiNzaGFkb3c7XG4gICAgICAgIGlmKCBtb2RlID09PSBudWxsIClcbiAgICAgICAgICAgIG1vZGUgPSBjYW5IYXZlU2hhZG93ID8gU2hhZG93Q2ZnLk9QRU4gOiBTaGFkb3dDZmcuTk9ORTtcblxuICAgICAgICBob3N0LnNoYWRvd01vZGUgPSBtb2RlO1xuXG4gICAgICAgIGxldCB0YXJnZXQ6IEhvc3R8U2hhZG93Um9vdCA9IGhvc3Q7XG4gICAgICAgIGlmKCBtb2RlICE9PSBTaGFkb3dDZmcuTk9ORSlcbiAgICAgICAgICAgIHRhcmdldCA9IGhvc3QuYXR0YWNoU2hhZG93KHttb2RlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUNTUyhjc3M6IENTU3xyZWFkb25seSBDU1NbXSkge1xuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgcmV0dXJuIGNzcy5tYXAoZSA9PiB0aGlzLnByb2Nlc3NDU1MoZSkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NTUyhjc3M6IENTUykge1xuXG4gICAgICAgIGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG4gICAgICAgICAgICByZXR1cm4gY3NzO1xuICAgICAgICBpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBjc3Muc2hlZXQhO1xuICAgIFxuICAgICAgICBpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1clwiKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUhUTUwoaHRtbD86IEhUTUwpOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGwge1xuICAgIFxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgaWYoaHRtbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgIC8vIHN0cjJodG1sXG4gICAgICAgIGlmKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gaHRtbC50cmltKCk7XG5cbiAgICAgICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBodG1sIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKVxuICAgICAgICAgICAgaHRtbCA9IGh0bWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIHRlbXBsYXRlLmFwcGVuZChodG1sKTtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIGluamVjdENTUzxIb3N0IGV4dGVuZHMgTEhvc3Q+KHRhcmdldDogU2hhZG93Um9vdHxIb3N0LCBzdHlsZXNoZWV0czogYW55W10pIHtcblxuICAgICAgICBpZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCApIHtcbiAgICAgICAgICAgIHRhcmdldC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MsIC4uLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNzc3NlbGVjdG9yID0gdGFyZ2V0LkNTU1NlbGVjdG9yOyAvL1RPRE8uLi5cblxuICAgICAgICBpZiggYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG4gICAgICAgIGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcbiAgICAgICAgZm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcbiAgICAgICAgICAgIGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcbiAgICAgICAgICAgICAgICBodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcbiAgICAgICAgYWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG4gICAgfVxufVxuXG4vLyBpZGVtIEhUTUwuLi5cbi8qIGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBjID0gYXdhaXQgYztcbiAgICAgICAgICAgIGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuICAgICAgICAgICAgICAgIGMgPSBhd2FpdCBjLnRleHQoKTtcblxuICAgICAgICAgICAgc3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG4gICAgICAgIH0pKCkpO1xuXG4gICAgICAgIHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcbiAgICB9XG4qLyIsImltcG9ydCB7IExIb3N0Q3N0ciwgdHlwZSBDbGFzcywgdHlwZSBDb25zdHJ1Y3RvciwgdHlwZSBMSVNTX09wdHMgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBMSVNTU3RhdGUgfSBmcm9tIFwiLi9zdGF0ZVwiO1xuXG5pbXBvcnQgeyBidWlsZExJU1NIb3N0LCBzZXRDc3RyQ29udHJvbGVyIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWV9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPihhcmdzOiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+ID0ge30pIHtcblxuXHRsZXQge1xuXHRcdC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuXHRcdGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0ICAgICAgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3RyLFxuXHRcdGhvc3QgICAgICAgICAgICAgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0XG5cdFx0Y29udGVudF9nZW5lcmF0b3IgPSBDb250ZW50R2VuZXJhdG9yLFxuXHR9ID0gYXJncztcblx0XG5cdGNsYXNzIExJU1NDb250cm9sZXIgZXh0ZW5kcyBfZXh0ZW5kcyB7XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsICkge1xuXHRcdFx0XHRzZXRDc3RyQ29udHJvbGVyKHRoaXMpO1xuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3QoLi4uYXJncyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBkbyBJIHJlYWxseSBuZWVkIHRvIGV4cG9zZSBzdWNoIHN0cnVjdHVyZSBoZXJlID9cblx0XHRzdGF0aWMgZ2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5Ib3N0LnN0YXRlO1xuXHRcdH1cblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdHRoaXMuI2hvc3QuY29udGVudCE7XG5cdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5jb250ZW50ITtcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7fVxuXG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ob3N0LmlzQ29ubmVjdGVkO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBJbnN0YW5jZVR5cGU8TEhvc3RDc3RyPEhvc3RDc3RyPj47XG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBfSG9zdDogTEhvc3RDc3RyPEhvc3RDc3RyPjtcblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmU6IGZ1Y2sgb2ZmLlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCggdGhpcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRob3N0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NDb250cm9sZXI7XG59IiwiaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBTaGFkb3dDZmcsIHR5cGUgTElTU0NvbnRyb2xlckNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwiLi9zdGF0ZVwiO1xuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vLyBMSVNTSG9zdCBtdXN0IGJlIGJ1aWxkIGluIGRlZmluZSBhcyBpdCBuZWVkIHRvIGJlIGFibGUgdG8gYnVpbGRcbi8vIHRoZSBkZWZpbmVkIHN1YmNsYXNzLlxuXG5sZXQgaWQgPSAwO1xuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZENTUygpIHtcblx0cmV0dXJuIHNoYXJlZENTUztcbn1cblxubGV0IF9fY3N0cl9jb250cm9sZXIgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJDb250cm9sZXIoXzogYW55KSB7XG5cdF9fY3N0cl9jb250cm9sZXIgPSBfO1xufVxuXG50eXBlIGluZmVySG9zdENzdHI8VD4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI8aW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiwgaW5mZXIgQiBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPyBCIDogbmV2ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFx0VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLCBVIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gaW5mZXJIb3N0Q3N0cjxUPiA+KFxuXHRcdFx0XHRcdFx0XHRMaXNzOiBULFxuXHRcdFx0XHRcdFx0XHQvLyBjYW4ndCBkZWR1Y2UgOiBjYXVzZSB0eXBlIGRlZHVjdGlvbiBpc3N1ZXMuLi5cblx0XHRcdFx0XHRcdFx0aG9zdENzdHI6IFUsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHI6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuXHRcdFx0XHRcdFx0XHRhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG5cdFx0XHRcdFx0XHQpIHtcblxuXHRjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcl9jc3RyKGFyZ3MpO1xuXG5cdHR5cGUgSG9zdENzdHIgPSBVO1xuICAgIHR5cGUgSG9zdCAgICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdGNsYXNzIExJU1NIb3N0IGV4dGVuZHMgaG9zdENzdHIge1xuXG5cdFx0c3RhdGljIHJlYWRvbmx5IENmZyA9IHtcblx0XHRcdGhvc3QgICAgICAgICAgICAgOiBob3N0Q3N0cixcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBjb250ZW50X2dlbmVyYXRvcl9jc3RyLFxuXHRcdFx0YXJnc1xuXHRcdH1cblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQ29udHJvbGVyID0gTGlzcztcblxuXHRcdCNjb250cm9sZXI6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgY29udHJvbGVyKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXIgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHQjcGFyYW1zOiBhbnlbXTtcblx0XHRpbml0aWFsaXplKC4uLnBhcmFtczogYW55W10pIHtcblxuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgKCB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNEZXBzUmVzb2x2ZWQgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY2llcyBoYXNuJ3QgYmVlbiBsb2FkZWQgIVwiKTtcblxuXHRcdFx0aWYoIHBhcmFtcy5sZW5ndGggIT09IDAgKSB7XG5cdFx0XHRcdGlmKCB0aGlzLiNwYXJhbXMubGVuZ3RoICE9PSAwIClcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NzdHIgcGFyYW1zIGhhcyBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgIScpO1xuXHRcdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdCA9IHRoaXMgYXMgSG9zdDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdG92ZXJyaWRlIGF0dGFjaFNoYWRvdyhpbml0OiBTaGFkb3dSb290SW5pdCk6IFNoYWRvd1Jvb3Qge1xuXHRcdFx0Y29uc3Qgc2hhZG93ID0gc3VwZXIuYXR0YWNoU2hhZG93KGluaXQpO1xuXG5cdFx0XHQvLyBAdHMtaWdub3JlIGNsb3NlZCBJUyBhc3NpZ25hYmxlIHRvIHNoYWRvd01vZGUuLi5cblx0XHRcdHRoaXMuc2hhZG93TW9kZSA9IGluaXQubW9kZTtcblxuXHRcdFx0dGhpcy4jY29udGVudCA9IHNoYWRvdztcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHNoYWRvdztcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0IGhhc1NoYWRvdygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLnNoYWRvd01vZGUgIT09ICdub25lJztcblx0XHR9XG5cblx0XHQvKioqIENTUyAqKiovXG5cblx0XHRnZXQgQ1NTU2VsZWN0b3IoKSB7XG5cblx0XHRcdGlmKHRoaXMuaGFzU2hhZG93IHx8ICEgdGhpcy5oYXNBdHRyaWJ1dGUoXCJpc1wiKSApXG5cdFx0XHRcdHJldHVybiB0aGlzLnRhZ05hbWU7XG5cblx0XHRcdHJldHVybiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gSW1wbCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHRjb25zdHJ1Y3RvciguLi5wYXJhbXM6IGFueVtdKSB7XG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRjb25zdCBjb250cm9sZXIgPSBfX2NzdHJfY29udHJvbGVyO1xuXHRcdFx0X19jc3RyX2NvbnRyb2xlciA9IG51bGw7XG5cblx0XHRcdGlmKCBjb250cm9sZXIgIT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gY29udHJvbGVyO1xuXHRcdFx0XHR0aGlzLmluaXQoKTsgLy8gY2FsbCB0aGUgcmVzb2x2ZXJcblx0XHRcdH1cblxuXHRcdFx0aWYoIFwiX3doZW5VcGdyYWRlZFJlc29sdmVcIiBpbiB0aGlzKVxuXHRcdFx0XHQodGhpcy5fd2hlblVwZ3JhZGVkUmVzb2x2ZSBhcyBhbnkpKCk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PSBET00gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHRcdFxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRpZih0aGlzLmNvbnRyb2xlciAhPT0gbnVsbClcblx0XHRcdFx0dGhpcy5jb250cm9sZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmNvbnRyb2xlciEuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLnN0YXRlLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgdGhpcy5zdGF0ZS5pc1JlYWR5O1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IExpc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZih0aGlzLiNjb250cm9sZXIpXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblx0XHR9XG5cblx0XHRzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbCA9IG51bGw7XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cblx0XHRcdC8vIG5vIG5lZWRzIHRvIHNldCB0aGlzLiNjb250ZW50IChhbHJlYWR5IGhvc3Qgb3Igc2V0IHdoZW4gYXR0YWNoU2hhZG93KVxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3IuZ2VuZXJhdGUodGhpcyk7XG5cblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblxuXHRcdFx0aWYoIHRoaXMuI2NvbnRyb2xlciA9PT0gbnVsbCkge1xuXHRcdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gbmV3IExJU1NIb3N0LkNvbnRyb2xlciguLi50aGlzLiNwYXJhbXMpIGFzIEluc3RhbmNlVHlwZTxUPjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuY29udHJvbGVyKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29udHJvbGVyO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3Q7XG59XG5cblxuIiwiXG5pbXBvcnQgeyBkZWZpbmUsIGdldENvbnRyb2xlckNzdHIsIGdldEhvc3RDc3RyLCBnZXROYW1lLCBpc0RlZmluZWQsIHdoZW5BbGxEZWZpbmVkLCB3aGVuRGVmaW5lZCB9IGZyb20gXCIuLi9jdXN0b21SZWdpc3RlcnlcIjtcblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0d2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG5cdFx0Z2V0SG9zdENzdHIgICAgOiB0eXBlb2YgZ2V0SG9zdENzdHI7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0ciAgICA6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgICAgICAgICA9IGRlZmluZTtcbkxJU1Mud2hlbkRlZmluZWQgICAgPSB3aGVuRGVmaW5lZDtcbkxJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTtcbkxJU1MuZ2V0SG9zdENzdHIgICAgPSBnZXRIb3N0Q3N0cjtcbkxJU1MuZ2V0Q29udHJvbGVyQ3N0ciAgICA9IGdldENvbnRyb2xlckNzdHI7IiwiXG5pbXBvcnQgeyBERUZJTkVELCBnZXRTdGF0ZSwgaW5pdGlhbGl6ZSwgSU5JVElBTElaRUQsIGluaXRpYWxpemVTeW5jLCBSRUFEWSwgdXBncmFkZSwgVVBHUkFERUQsIHVwZ3JhZGVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQsIHdoZW5VcGdyYWRlZCB9IGZyb20gXCIuLi9zdGF0ZVwiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIERFRklORUQgICAgOiB0eXBlb2YgREVGSU5FRCxcbiAgICAgICAgUkVBRFkgICAgICA6IHR5cGVvZiBSRUFEWTtcbiAgICAgICAgVVBHUkFERUQgICA6IHR5cGVvZiBVUEdSQURFRDtcbiAgICAgICAgSU5JVElBTElaRUQ6IHR5cGVvZiBJTklUSUFMSVpFRDtcbiAgICAgICAgZ2V0U3RhdGUgICAgICAgOiB0eXBlb2YgZ2V0U3RhdGU7XG4gICAgICAgIHVwZ3JhZGUgICAgICAgIDogdHlwZW9mIHVwZ3JhZGU7XG4gICAgICAgIGluaXRpYWxpemUgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG4gICAgICAgIHVwZ3JhZGVTeW5jICAgIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuICAgICAgICBpbml0aWFsaXplU3luYyA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcbiAgICAgICAgd2hlblVwZ3JhZGVkICAgOiB0eXBlb2Ygd2hlblVwZ3JhZGVkO1xuICAgICAgICB3aGVuSW5pdGlhbGl6ZWQ6IHR5cGVvZiB3aGVuSW5pdGlhbGl6ZWQ7XG4gICAgfVxufVxuXG5MSVNTLkRFRklORUQgICAgPSBMSVNTLkRFRklORUQsXG5MSVNTLlJFQURZICAgICAgPSBMSVNTLlJFQURZO1xuTElTUy5VUEdSQURFRCAgID0gTElTUy5VUEdSQURFRDtcbkxJU1MuSU5JVElBTElaRUQ9IExJU1MuSU5JVElBTElaRUQ7XG5cbkxJU1MuZ2V0U3RhdGUgICAgICAgPSBnZXRTdGF0ZTtcbkxJU1MudXBncmFkZSAgICAgICAgPSB1cGdyYWRlO1xuTElTUy5pbml0aWFsaXplICAgICA9IGluaXRpYWxpemU7XG5MSVNTLnVwZ3JhZGVTeW5jICAgID0gdXBncmFkZVN5bmM7XG5MSVNTLmluaXRpYWxpemVTeW5jID0gaW5pdGlhbGl6ZVN5bmM7XG5MSVNTLndoZW5VcGdyYWRlZCAgID0gd2hlblVwZ3JhZGVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQ9IHdoZW5Jbml0aWFsaXplZDsiLCJpbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbi8vIEdvIHRvIHN0YXRlIERFRklORURcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPikge1xuXG5cdGxldCBIb3N0OiBMSVNTSG9zdENzdHI8VD4gPSBDb21wb25lbnRDbGFzcyBhcyBhbnk7XG5cblx0Ly8gQnJ5dGhvbiBjbGFzc1xuXHRsZXQgYnJ5X2NsYXNzOiBhbnkgPSBudWxsO1xuXHRpZiggXCIkaXNfY2xhc3NcIiBpbiBDb21wb25lbnRDbGFzcyApIHtcblxuXHRcdGJyeV9jbGFzcyA9IENvbXBvbmVudENsYXNzO1xuXG5cdFx0Q29tcG9uZW50Q2xhc3MgPSBicnlfY2xhc3MuX19iYXNlc19fLmZpbHRlciggKGU6IGFueSkgPT4gZS5fX25hbWVfXyA9PT0gXCJXcmFwcGVyXCIpWzBdLl9qc19rbGFzcy4kanNfZnVuYztcblx0XHQoQ29tcG9uZW50Q2xhc3MgYXMgYW55KS5Ib3N0LkNvbnRyb2xlciA9IGNsYXNzIHtcblxuXHRcdFx0I2JyeTogYW55O1xuXG5cdFx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHR0aGlzLiNicnkgPSBfX0JSWVRIT05fXy4kY2FsbChicnlfY2xhc3MsIFswLDAsMF0pKClcblx0XHRcdH1cblxuXHRcdFx0I2NhbGwobmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdF9fQlJZVEhPTl9fLiRjYWxsKF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIG5hbWUsIFswLDAsMF0pLCBbMCwwLDBdKSguLi5hcmdzKVxuXHRcdFx0fVxuXG5cdFx0XHRjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImNvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJkaXNjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fVxuXG5cdGlmKCBcIkhvc3RcIiBpbiBDb21wb25lbnRDbGFzcyApXG5cdFx0SG9zdCA9IENvbXBvbmVudENsYXNzLkhvc3QgYXMgYW55O1xuICAgIFxuICAgIGNvbnN0IENsYXNzICA9IEhvc3QuQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIEhvc3QsIG9wdHMpO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKHRhZ25hbWU6IHN0cmluZyApIHtcblx0cmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKG5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHJ8TElTU0hvc3Q8TElTU0NvbnRyb2xlcj58TElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+ICk6IHN0cmluZyB7XG5cblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQuY29uc3RydWN0b3IpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuY29uc3RydWN0b3IuSG9zdCBhcyBMSVNTSG9zdENzdHI8TElTU0NvbnRyb2xlcj47XG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50KVxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRlbGVtZW50ID0gZWxlbWVudC5Ib3N0O1xuXHRpZiggXCJDb250cm9sZXJcIiBpbiBlbGVtZW50LmNvbnN0cnVjdG9yKVxuXHRcdGVsZW1lbnQgPSBlbGVtZW50LmNvbnN0cnVjdG9yIGFzIExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPjtcblxuXHRpZiggXCJDb250cm9sZXJcIiBpbiBlbGVtZW50KSB7XG5cdFx0Y29uc3QgbmFtZSA9IGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoIGVsZW1lbnQgKTtcblx0XHRpZihuYW1lID09PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm90IGRlZmluZWQhXCIpO1xuXG5cdFx0cmV0dXJuIG5hbWU7XG5cdH1cblxuXHRpZiggISAoZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoJz8/PycpO1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+PihuYW1lOiBzdHJpbmcpOiBUIHtcblx0cmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChuYW1lKSBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KG5hbWU6IHN0cmluZyk6IFQge1xuXHRyZXR1cm4gZ2V0SG9zdENzdHI8TElTU0hvc3RDc3RyPFQ+PihuYW1lKS5Db250cm9sZXIgYXMgVDtcbn0iLCJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPik6IFJldHVyblR5cGU8dHlwZW9mIF9leHRlbmRzPEV4dGVuZHNDc3RyLCBPcHRzPj5cbi8vIExJU1NDb250cm9sZXIgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPlxuZXhwb3J0IGZ1bmN0aW9uIExJU1Mob3B0czogYW55ID0ge30pOiBMSVNTQ29udHJvbGVyQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NDb250cm9sZXJDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRlbmRzPFxuICAgICAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgICAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pIHtcblxuICAgIGlmKCBvcHRzLmV4dGVuZHMgPT09IHVuZGVmaW5lZCkgLy8gaDRja1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGEgTElTU0NvbnRyb2xlciEnKTtcblxuICAgIGNvbnN0IGNmZyA9IG9wdHMuZXh0ZW5kcy5Ib3N0LkNmZztcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0cywgY2ZnLCBjZmcuYXJncyk7XG5cbiAgICBjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBvcHRzLmV4dGVuZHMhIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgb3ZlcnJpZGUgX0hvc3Q6IExJU1NIb3N0PEV4dGVuZGVkTElTUz47XG5cbiAgICAgICAgLy8gVFMgaXMgc3R1cGlkLCByZXF1aXJlcyBleHBsaWNpdCByZXR1cm4gdHlwZVxuXHRcdHN0YXRpYyBvdmVycmlkZSBnZXQgSG9zdCgpOiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+IHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBmdWNrIG9mZlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuaG9zdCEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250ZW50X2dlbmVyYXRvciEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59IiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIExIb3N0LCBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuaW1wb3J0IHtkZWZpbmV9IGZyb20gXCIuLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vIHNob3VsZCBiZSBpbXByb3ZlZCAoYnV0IGhvdyA/KVxuY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2F1dG9kaXJdJyk7XG5cbmNvbnN0IFJFU1NPVVJDRVMgPSBbXG5cdFwiaW5kZXguanNcIixcblx0XCJpbmRleC5icnlcIixcblx0XCJpbmRleC5odG1sXCIsXG5cdFwiaW5kZXguY3NzXCJcbl07XG5cbmNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5pZiggc2NyaXB0ICE9PSBudWxsICkge1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cblx0XHRjb25zdCBzd19wYXRoID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKTtcblxuXHRcdGlmKCBzd19wYXRoID09PSBudWxsICkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHN3X3BhdGgsIHtzY29wZTogXCIvXCJ9KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0bGV0IGNvbXBvbmVudHNfZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpITtcblx0Lypcblx0aWYoIGNvbXBvbmVudHNfZGlyWzBdID09PSAnLicpIHtcblx0XHRjb21wb25lbnRzX2RpciA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIGNvbXBvbmVudHNfZGlyOyAvLyBnZXR0aW5nIGFuIGFic29sdXRlIHBhdGguXG5cdH1cblx0Ki9cblx0aWYoIGNvbXBvbmVudHNfZGlyW2NvbXBvbmVudHNfZGlyLmxlbmd0aC0xXSAhPT0gJy8nKVxuXHRcdGNvbXBvbmVudHNfZGlyICs9ICcvJztcblxuXHQvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdFx0XHRcdGFkZFRhZyhhZGRpdGlvbilcblxuXHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqXCIpIClcblx0XHRhZGRUYWcoIGVsZW0gKTtcblxuXG5cdGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IHRhZ25hbWUgPSAoIHRhZy5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gdGFnLnRhZ05hbWUgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0aWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0Ly9UT0RPOiBpcyBCcnl0aG9uLi4uXG5cdFx0XHRjZGlyOiBjb21wb25lbnRzX2RpciwgLy9UT0RPXG5cdFx0XHRob3N0XG5cdFx0fSk7XHRcdFxuXHR9XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZywgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9wdHM6IHtodG1sOiBzdHJpbmcsIGNzczogc3RyaW5nLCBob3N0OiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD59KSB7XG5cblx0Y29uc3QgY19qcyAgICAgID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblxuXHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0aWYoIGNfanMgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGNvbnN0IGZpbGUgPSBuZXcgQmxvYihbY19qc10sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pO1xuXHRcdGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG5cdFx0Y29uc3Qgb2xkcmVxID0gTElTUy5yZXF1aXJlO1xuXG5cdFx0TElTUy5yZXF1aXJlID0gZnVuY3Rpb24odXJsOiBVUkx8c3RyaW5nKSB7XG5cblx0XHRcdGlmKCB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiICYmIHVybC5zdGFydHNXaXRoKCcuLycpICkge1xuXHRcdFx0XHRjb25zdCBmaWxlbmFtZSA9IHVybC5zbGljZSgyKTtcblx0XHRcdFx0aWYoIGZpbGVuYW1lIGluIGZpbGVzKVxuXHRcdFx0XHRcdHJldHVybiBmaWxlc1tmaWxlbmFtZV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvbGRyZXEodXJsKTtcblx0XHR9XG5cblx0XHRrbGFzcyA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKS5kZWZhdWx0O1xuXG5cdFx0TElTUy5yZXF1aXJlID0gb2xkcmVxO1xuXHR9XG5cdGVsc2UgaWYoIG9wdHMuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0a2xhc3MgPSBMSVNTKHtcblx0XHRcdC4uLm9wdHMsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogTElTU0F1dG9fQ29udGVudEdlbmVyYXRvclxuXHRcdH0pO1xuXHR9XG5cblx0aWYoa2xhc3MgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGZpbGVzIGZvciBXZWJDb21wb25lbnQgJHt0YWduYW1lfS5gKTtcblxuXHRkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXG5cdHJldHVybiBrbGFzcztcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBpbnRlcm5hbCB0b29scyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRjb25zdCBhbnN3ZXIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cblx0aWYoYW5zd2VyID09PSBcIlwiKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIGFuc3dlclxufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn1cblxuXG5jb25zdCBjb252ZXJ0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbmZ1bmN0aW9uIGVuY29kZUhUTUwodGV4dDogc3RyaW5nKSB7XG5cdGNvbnZlcnRlci50ZXh0Q29udGVudCA9IHRleHQ7XG5cdHJldHVybiBjb252ZXJ0ZXIuaW5uZXJIVE1MO1xufVxuXG5leHBvcnQgY2xhc3MgTElTU0F1dG9fQ29udGVudEdlbmVyYXRvciBleHRlbmRzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG5cdHByb3RlY3RlZCBvdmVycmlkZSBwcmVwYXJlSFRNTChodG1sPzogRG9jdW1lbnRGcmFnbWVudCB8IEhUTUxFbGVtZW50IHwgc3RyaW5nKSB7XG5cdFx0XG5cdFx0dGhpcy5kYXRhID0gbnVsbDtcblxuXHRcdGlmKCB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycgKSB7XG5cblx0XHRcdHRoaXMuZGF0YSA9IGh0bWw7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdC8qXG5cdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHJldHVybiBgPGxpc3MgdmFsdWU9XCIke25hbWV9XCI+PC9saXNzPmA7XG5cdFx0XHR9KTsqL1xuXG5cdFx0XHQvL1RPRE86ICR7fSBpbiBhdHRyXG5cdFx0XHRcdC8vIC0gZGV0ZWN0IHN0YXJ0ICR7ICsgZW5kIH1cblx0XHRcdFx0Ly8gLSByZWdpc3RlciBlbGVtICsgYXR0ciBuYW1lXG5cdFx0XHRcdC8vIC0gcmVwbGFjZS4gXG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBzdXBlci5wcmVwYXJlSFRNTChodG1sKTtcblx0fVxuXG5cdG92ZXJyaWRlIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50IHwgU2hhZG93Um9vdCB7XG5cdFx0XG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdGlmKCB0aGlzLmRhdGEgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHN0ciA9ICh0aGlzLmRhdGEgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IGVuY29kZUhUTUwoaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpID8/ICcnICkpO1xuXHRcdFx0c3VwZXIuc2V0VGVtcGxhdGUoIHN1cGVyLnByZXBhcmVIVE1MKHN0cikhICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29udGVudCA9IHN1cGVyLmdlbmVyYXRlKGhvc3QpO1xuXG5cdFx0Lypcblx0XHQvLyBodG1sIG1hZ2ljIHZhbHVlcy5cblx0XHQvLyBjYW4gYmUgb3B0aW1pemVkLi4uXG5cdFx0Y29uc3QgdmFsdWVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXHRcdGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuXHRcdFx0dmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXHRcdCovXG5cblx0XHQvLyBjc3MgcHJvcC5cblx0XHRjb25zdCBjc3NfYXR0cnMgPSBob3N0LmdldEF0dHJpYnV0ZU5hbWVzKCkuZmlsdGVyKCBlID0+IGUuc3RhcnRzV2l0aCgnY3NzLScpKTtcblx0XHRmb3IobGV0IGNzc19hdHRyIG9mIGNzc19hdHRycylcblx0XHRcdGhvc3Quc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtjc3NfYXR0ci5zbGljZSgnY3NzLScubGVuZ3RoKX1gLCBob3N0LmdldEF0dHJpYnV0ZShjc3NfYXR0cikpO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGltcG9ydENvbXBvbmVudHMgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50cztcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50ICA6IHR5cGVvZiBpbXBvcnRDb21wb25lbnQ7XG4gICAgICAgIHJlcXVpcmUgICAgICAgICAgOiB0eXBlb2YgcmVxdWlyZTtcbiAgICB9XG59XG5cbnR5cGUgaW1wb3J0Q29tcG9uZW50c19PcHRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSB7XG5cdGNkaXIgICA/OiBzdHJpbmd8bnVsbCxcblx0YnJ5dGhvbj86IGJvb2xlYW4sXG5cdGhvc3QgICA/OiBDb25zdHJ1Y3RvcjxUPlxufTtcblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdFx0XHRcdFx0XHRjb21wb25lbnRzOiBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y2RpciAgICA9IG51bGwsXG5cdFx0XHRcdFx0XHRcdGJyeXRob24gPSBmYWxzZSxcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnRcblx0XHRcdFx0XHRcdH06IGltcG9ydENvbXBvbmVudHNfT3B0czxUPikge1xuXG5cdGNvbnN0IHJlc3VsdHM6IFJlY29yZDxzdHJpbmcsIExJU1NDb250cm9sZXJDc3RyPiA9IHt9O1xuXG5cdGZvcihsZXQgdGFnbmFtZSBvZiBjb21wb25lbnRzKSB7XG5cblx0XHRyZXN1bHRzW3RhZ25hbWVdID0gYXdhaXQgaW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdGNkaXIsXG5cdFx0XHRicnl0aG9uLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmNvbnN0IGJyeV93cmFwcGVyID0gYGRlZiB3cmFwanMoanNfa2xhc3MpOlxuXG4gICAgY2xhc3MgV3JhcHBlcjpcblxuICAgICAgICBfanNfa2xhc3MgPSBqc19rbGFzc1xuICAgICAgICBfanMgPSBOb25lXG5cbiAgICAgICAgZGVmIF9faW5pdF9fKHNlbGYsICphcmdzKTpcbiAgICAgICAgICAgIHNlbGYuX2pzID0ganNfa2xhc3MubmV3KCphcmdzKVxuXG4gICAgICAgIGRlZiBfX2dldGF0dHJfXyhzZWxmLCBuYW1lOiBzdHIpOlxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2pzW25hbWVdO1xuXG4gICAgICAgIGRlZiBfX3NldGF0dHJfXyhzZWxmLCBuYW1lOiBzdHIsIHZhbHVlKTpcbiAgICAgICAgICAgIGlmIG5hbWUgPT0gXCJfanNcIjpcbiAgICAgICAgICAgICAgICBzdXBlcigpLl9fc2V0YXR0cl9fKG5hbWUsIHZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgc2VsZi5fanNbbmFtZV0gPSB2YWx1ZVxuXG4gICAgcmV0dXJuIFdyYXBwZXJcblxuYDtcblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50PFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0dGFnbmFtZTogc3RyaW5nLFxuXHR7XG5cdFx0Y2RpciAgICA9IG51bGwsXG5cdFx0YnJ5dGhvbiA9IGZhbHNlLFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnQsXG5cdFx0ZmlsZXMgICA9IG51bGxcblx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+ICYge2ZpbGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPnxudWxsfVxuKSB7XG5cblx0S25vd25UYWdzLmFkZCh0YWduYW1lKTtcblxuXHRjb25zdCBjb21wb19kaXIgPSBgJHtjZGlyfSR7dGFnbmFtZX0vYDtcblxuXHRpZiggZmlsZXMgPT09IG51bGwgKSB7XG5cdFx0ZmlsZXMgPSB7fTtcblxuXHRcdGNvbnN0IGZpbGUgPSBicnl0aG9uID8gJ2luZGV4LmJyeScgOiAnaW5kZXguanMnO1xuXG5cdFx0ZmlsZXNbZmlsZV0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9JHtmaWxlfWAsIHRydWUpKSE7XG5cdH1cblxuXHRpZiggYnJ5dGhvbiAmJiBmaWxlc1snaW5kZXguYnJ5J10gIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0Y29uc3QgY29kZSA9IGJyeV93cmFwcGVyICsgZmlsZXNbXCJpbmRleC5icnlcIl07XG5cblx0XHRmaWxlc1snaW5kZXguanMnXSA9XG5gY29uc3QgJEIgPSBnbG9iYWxUaGlzLl9fQlJZVEhPTl9fO1xuXG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHtjb2RlfVxcYCwgXCJfXCIpO1xuXG5jb25zdCBtb2R1bGUgPSAkQi5pbXBvcnRlZFtcIl9cIl07XG5leHBvcnQgZGVmYXVsdCBtb2R1bGUuV2ViQ29tcG9uZW50O1xuXG5gO1xuXHR9XG5cblx0Y29uc3QgaHRtbCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIHtodG1sLCBjc3MsIGhvc3R9KTtcbn1cblxuZnVuY3Rpb24gcmVxdWlyZSh1cmw6IFVSTHxzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPnxzdHJpbmcge1xuXHRyZXR1cm4gZmV0Y2godXJsKTtcbn1cblxuXG5MSVNTLmltcG9ydENvbXBvbmVudHMgPSBpbXBvcnRDb21wb25lbnRzO1xuTElTUy5pbXBvcnRDb21wb25lbnQgID0gaW1wb3J0Q29tcG9uZW50O1xuTElTUy5yZXF1aXJlICA9IHJlcXVpcmU7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcIi4uL3N0YXRlXCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufSIsIlxuaW1wb3J0IHsgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxudHlwZSBMaXN0ZW5lckZjdDxUIGV4dGVuZHMgRXZlbnQ+ID0gKGV2OiBUKSA9PiB2b2lkO1xudHlwZSBMaXN0ZW5lck9iajxUIGV4dGVuZHMgRXZlbnQ+ID0geyBoYW5kbGVFdmVudDogTGlzdGVuZXJGY3Q8VD4gfTtcbnR5cGUgTGlzdGVuZXI8VCBleHRlbmRzIEV2ZW50PiA9IExpc3RlbmVyRmN0PFQ+fExpc3RlbmVyT2JqPFQ+O1xuXG5leHBvcnQgY2xhc3MgRXZlbnRUYXJnZXQyPEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEV2ZW50Pj4gZXh0ZW5kcyBFdmVudFRhcmdldCB7XG5cblx0b3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGNhbGxiYWNrOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBvcHRpb25zPzogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuKTogdm9pZCB7XG5cdFx0XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0cmV0dXJuIHN1cGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZGlzcGF0Y2hFdmVudDxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+PihldmVudDogRXZlbnRzW1RdKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHN1cGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG5cblx0b3ZlcnJpZGUgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsaXN0ZW5lcjogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG9wdGlvbnM/OiBib29sZWFufEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZCB7XG5cblx0XHQvL0B0cy1pZ25vcmVcblx0XHRzdXBlci5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXZlbnQyPFQgZXh0ZW5kcyBzdHJpbmcsIEFyZ3M+IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8QXJncz4ge1xuXG5cdGNvbnN0cnVjdG9yKHR5cGU6IFQsIGFyZ3M6IEFyZ3MpIHtcblx0XHRzdXBlcih0eXBlLCB7ZGV0YWlsOiBhcmdzfSk7XG5cdH1cblxuXHRvdmVycmlkZSBnZXQgdHlwZSgpOiBUIHsgcmV0dXJuIHN1cGVyLnR5cGUgYXMgVDsgfVxufVxuXG50eXBlIEluc3RhbmNlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+Pj4gPSB7XG5cdFtLIGluIGtleW9mIFRdOiBJbnN0YW5jZVR5cGU8VFtLXT5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdpdGhFdmVudHM8VCBleHRlbmRzIG9iamVjdCwgRXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+PiA+KGV2OiBDb25zdHJ1Y3RvcjxUPiwgX2V2ZW50czogRXZlbnRzKSB7XG5cblx0dHlwZSBFdnRzID0gSW5zdGFuY2VzPEV2ZW50cz47XG5cblx0aWYoICEgKGV2IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQpIClcblx0XHRyZXR1cm4gZXYgYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xuXG5cdC8vIGlzIGFsc28gYSBtaXhpblxuXHQvLyBAdHMtaWdub3JlXG5cdGNsYXNzIEV2ZW50VGFyZ2V0TWl4aW5zIGV4dGVuZHMgZXYge1xuXG5cdFx0I2V2ID0gbmV3IEV2ZW50VGFyZ2V0MjxFdnRzPigpO1xuXG5cdFx0YWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hFdmVudCguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuZGlzcGF0Y2hFdmVudCguLi5hcmdzKTtcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiBFdmVudFRhcmdldE1peGlucyBhcyB1bmtub3duIGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+Pjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBTaGFkb3dSb290IHRvb2xzID09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBldmVudE1hdGNoZXMoZXY6IEV2ZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cblx0bGV0IGVsZW1lbnRzID0gZXYuY29tcG9zZWRQYXRoKCkuc2xpY2UoMCwtMikuZmlsdGVyKGUgPT4gISAoZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpICkucmV2ZXJzZSgpIGFzIEhUTUxFbGVtZW50W107XG5cblx0Zm9yKGxldCBlbGVtIG9mIGVsZW1lbnRzIClcblx0XHRpZihlbGVtLm1hdGNoZXMoc2VsZWN0b3IpIClcblx0XHRcdHJldHVybiBlbGVtOyBcblxuXHRyZXR1cm4gbnVsbDtcbn0iLCJcbmltcG9ydCB0eXBlIHsgTElTU0NvbnRyb2xlciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGluaXRpYWxpemVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQgfSBmcm9tIFwiLi4vc3RhdGVcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudHMge307XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgLy8gYXN5bmNcbiAgICAgICAgcXMgOiB0eXBlb2YgcXM7XG4gICAgICAgIHFzbzogdHlwZW9mIHFzbztcbiAgICAgICAgcXNhOiB0eXBlb2YgcXNhO1xuICAgICAgICBxc2M6IHR5cGVvZiBxc2M7XG5cbiAgICAgICAgLy8gc3luY1xuICAgICAgICBxc1N5bmMgOiB0eXBlb2YgcXNTeW5jO1xuICAgICAgICBxc2FTeW5jOiB0eXBlb2YgcXNhU3luYztcbiAgICAgICAgcXNjU3luYzogdHlwZW9mIHFzY1N5bmM7XG5cblx0XHRjbG9zZXN0OiB0eXBlb2YgY2xvc2VzdDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3Nfc2VsZWN0b3IobmFtZT86IHN0cmluZykge1xuXHRpZihuYW1lID09PSB1bmRlZmluZWQpIC8vIGp1c3QgYW4gaDRja1xuXHRcdHJldHVybiBcIlwiO1xuXHRyZXR1cm4gYDppcygke25hbWV9LCBbaXM9XCIke25hbWV9XCJdKWA7XG59XG5cbmZ1bmN0aW9uIF9idWlsZFFTKHNlbGVjdG9yOiBzdHJpbmcsIHRhZ25hbWVfb3JfcGFyZW50Pzogc3RyaW5nIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LCBwYXJlbnQ6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cdFxuXHRpZiggdGFnbmFtZV9vcl9wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGFnbmFtZV9vcl9wYXJlbnQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cGFyZW50ID0gdGFnbmFtZV9vcl9wYXJlbnQ7XG5cdFx0dGFnbmFtZV9vcl9wYXJlbnQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRyZXR1cm4gW2Ake3NlbGVjdG9yfSR7bGlzc19zZWxlY3Rvcih0YWduYW1lX29yX3BhcmVudCBhcyBzdHJpbmd8dW5kZWZpbmVkKX1gLCBwYXJlbnRdIGFzIGNvbnN0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGxldCByZXN1bHQgPSBhd2FpdCBxc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFRbXT47XG5hc3luYyBmdW5jdGlvbiBxc2E8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl1bXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPFQ+PiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRwcm9taXNlc1tpZHgrK10gPSB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4ocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPihyZXN1bHQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2xvc2VzdDxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCkge1xuXG5cdHdoaWxlKHRydWUpIHtcblx0XHR2YXIgcmVzdWx0ID0gZWxlbWVudC5jbG9zZXN0PEU+KHNlbGVjdG9yKTtcblxuXHRcdGlmKCByZXN1bHQgIT09IG51bGwpXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcblx0XHRpZiggISAoXCJob3N0XCIgaW4gcm9vdCkgKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRlbGVtZW50ID0gKHJvb3QgYXMgU2hhZG93Um9vdCkuaG9zdDtcblx0fVxufVxuXG5cbi8vIGFzeW5jXG5MSVNTLnFzICA9IHFzO1xuTElTUy5xc28gPSBxc287XG5MSVNTLnFzYSA9IHFzYTtcbkxJU1MucXNjID0gcXNjO1xuXG4vLyBzeW5jXG5MSVNTLnFzU3luYyAgPSBxc1N5bmM7XG5MSVNTLnFzYVN5bmMgPSBxc2FTeW5jO1xuTElTUy5xc2NTeW5jID0gcXNjU3luYztcblxuTElTUy5jbG9zZXN0ID0gY2xvc2VzdDsiLCJpbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgZ2V0SG9zdENzdHIsIGdldE5hbWUgfSBmcm9tIFwiLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5lbnVtIFN0YXRlIHtcbiAgICBOT05FID0gMCxcblxuICAgIC8vIGNsYXNzXG4gICAgREVGSU5FRCA9IDEgPDwgMCxcbiAgICBSRUFEWSAgID0gMSA8PCAxLFxuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBVUEdSQURFRCAgICA9IDEgPDwgMixcbiAgICBJTklUSUFMSVpFRCA9IDEgPDwgMyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRklORUQgICAgID0gU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IFN0YXRlLlJFQURZO1xuZXhwb3J0IGNvbnN0IFVQR1JBREVEICAgID0gU3RhdGUuVVBHUkFERUQ7XG5leHBvcnQgY29uc3QgSU5JVElBTElaRUQgPSBTdGF0ZS5JTklUSUFMSVpFRDtcblxuZXhwb3J0IGNsYXNzIExJU1NTdGF0ZSB7XG5cbiAgICAjZWxlbTogSFRNTEVsZW1lbnR8bnVsbDtcblxuICAgIC8vIGlmIG51bGwgOiBjbGFzcyBzdGF0ZSwgZWxzZSBpbnN0YW5jZSBzdGF0ZVxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEhUTUxFbGVtZW50fG51bGwgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuI2VsZW0gPSBlbGVtO1xuICAgIH1cblxuICAgIHN0YXRpYyBERUZJTkVEICAgICA9IERFRklORUQ7XG4gICAgc3RhdGljIFJFQURZICAgICAgID0gUkVBRFk7XG4gICAgc3RhdGljIFVQR1JBREVEICAgID0gVVBHUkFERUQ7XG4gICAgc3RhdGljIElOSVRJQUxJWkVEID0gSU5JVElBTElaRUQ7XG5cbiAgICBpcyhzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCAgICAgJiYgISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZICAgICAgICYmICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgICAgJiYgISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCAmJiAhIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW4oc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGxldCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPGFueT4+KCk7XG4gICAgXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuRGVmaW5lZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblJlYWR5KCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuVXBncmFkZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5Jbml0aWFsaXplZCgpICk7XG4gICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gREVGSU5FRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0RlZmluZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKCBnZXROYW1lKHRoaXMuI2VsZW0pICkgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gUkVBRFkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcbiAgICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBob3N0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NDb250cm9sZXJDc3RyPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTtcbiAgICBcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBob3N0KVxuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICBcbiAgICAgICAgLy8gaDRja1xuICAgIFxuICAgICAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgXG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcblxuICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBJTklUSUFMSVpFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0luaXRpYWxpemVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIFwiaXNJbml0aWFsaXplZFwiIGluIGVsZW0gJiYgZWxlbS5pc0luaXRpYWxpemVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuY29udHJvbGVyIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IENPTlZFUlNJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFsdWVPZigpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgbGV0IHN0YXRlOiBTdGF0ZSA9IDA7XG4gICAgXG4gICAgICAgIGlmKCB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBERUZJTkVEO1xuICAgICAgICBpZiggdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHN0YXRlIHw9IFJFQURZO1xuICAgICAgICBpZiggdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IFVQR1JBREVEO1xuICAgICAgICBpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IElOSVRJQUxJWkVEO1xuICAgIFxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IGlzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJERUZJTkVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBpcy5wdXNoKFwiUkVBRFlcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJVUEdSQURFRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIklOSVRJQUxJWkVEXCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gaXMuam9pbignfCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYoIFwic3RhdGVcIiBpbiBlbGVtKVxuICAgICAgICByZXR1cm4gZWxlbS5zdGF0ZSBhcyBMSVNTU3RhdGU7XG4gICAgXG4gICAgcmV0dXJuIChlbGVtIGFzIGFueSkuc3RhdGUgPSBuZXcgTElTU1N0YXRlKGVsZW0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gU3RhdGUgbW9kaWZpZXJzIChtb3ZlPykgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdvIHRvIHN0YXRlIFVQR1JBREVEXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBncmFkZTxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0NvbnRyb2xlckNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuRGVmaW5lZCgpO1xuXG4gICAgcmV0dXJuIHVwZ3JhZGVTeW5jPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBncmFkZVN5bmM8VCBleHRlbmRzIExJU1NIb3N0PExJU1NDb250cm9sZXJDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHIoZ2V0TmFtZShlbGVtKSk7XG5cbiAgICBpZiggISAoZWxlbSBpbnN0YW5jZW9mIEhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGRpZG4ndCB1cGdyYWRlIWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgVDtcbn1cblxuLy8gR28gdG8gc3RhdGUgSU5JVElBTElaRURcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemU8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufGFueVtdID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlIClcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmNvbnRyb2xlciBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuUmVhZHkoKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IFtdIDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZSguLi5wYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuY29udHJvbGVyIGFzIFQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufGFueVtdID0gZmFsc2UpOiBUIHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuY29udHJvbGVyIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBzdGF0ZS5pc1JlYWR5IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IFtdIDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZSguLi5wYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuY29udHJvbGVyIGFzIFQ7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09IGV4dGVybmFsIFdIRU4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0NvbnRyb2xlckNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgTElTU1N0YXRlIH0gZnJvbSBcIi4vc3RhdGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50ID9cbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IHtcbiAgICAgICAgZXh0ZW5kczogRXh0ZW5kc0N0ciwgLy8gSlMgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0ciwgICAvLyBIVE1MIEhvc3RcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxufSAmIENvbnRlbnRHZW5lcmF0b3JfT3B0cztcblxuLy8gTElTU0NvbnRyb2xlclxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gSW5zdGFuY2VUeXBlPExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgICAgIGluZmVyIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgID4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsSG9zdENzdHI+IDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlciA/IExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+O1xuXG4vLyBsaWdodGVyIExJU1NIb3N0IGRlZiB0byBhdm9pZCB0eXBlIGlzc3Vlcy4uLlxuZXhwb3J0IHR5cGUgTEhvc3Q8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuXG4gICAgc3RhdGUgIDogTElTU1N0YXRlO1xuICAgIGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgQ1NTU2VsZWN0b3I6IHN0cmluZztcblxufSAmIEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbmV4cG9ydCB0eXBlIExIb3N0Q3N0cjxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG4gICAgbmV3KC4uLmFyZ3M6IGFueSk6IExIb3N0PEhvc3RDc3RyPjtcblxuICAgIENmZzoge1xuICAgICAgICBob3N0ICAgICAgICAgICAgIDogSG9zdENzdHIsXG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbiAgICAgICAgYXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuICAgIH1cblxuICAgIHN0YXRlICA6IExJU1NTdGF0ZTtcblxufSAmIEhvc3RDc3RyOyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGlmKCBDbGFzcyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBDbGFzcyA9IENsYXNzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBIVE1MRWxlbWVudDtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblxuICAgIGxldCBjdXJzb3IgPSBDbGFzcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2hpbGUgKGN1cnNvci5fX3Byb3RvX18gIT09IEhUTUxFbGVtZW50KVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5fX3Byb3RvX187XG5cbiAgICAvLyBkaXJlY3RseSBpbmhlcml0IEhUTUxFbGVtZW50XG4gICAgaWYoICEgY3Vyc29yLm5hbWUuc3RhcnRzV2l0aCgnSFRNTCcpICYmICEgY3Vyc29yLm5hbWUuZW5kc1dpdGgoJ0VsZW1lbnQnKSApXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaHRtbHRhZyA9IGN1cnNvci5uYW1lLnNsaWNlKDQsIC03KTtcblxuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG4vKlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG4qL1xuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL3N0YXRlXCI7XG5pbXBvcnQgXCIuL2NvcmUvY3VzdG9tUmVnaXN0ZXJ5XCI7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vVE9ETzogZXZlbnRzLnRzXG4vL1RPRE86IGdsb2JhbENTU1J1bGVzXG5leHBvcnQge0xJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL2hlbHBlcnMvTElTU0F1dG9cIjtcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge1NoYWRvd0NmZ30gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHtsaXNzLCBsaXNzU3luY30gZnJvbSBcIi4vaGVscGVycy9idWlsZFwiO1xuZXhwb3J0IHtldmVudE1hdGNoZXMsIFdpdGhFdmVudHMsIEV2ZW50VGFyZ2V0MiwgQ3VzdG9tRXZlbnQyfSBmcm9tICcuL2hlbHBlcnMvZXZlbnRzJztcbmV4cG9ydCB7aHRtbH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7XG5cbi8vIGZvciBkZWJ1Zy5cbmV4cG9ydCB7X2V4dGVuZHN9IGZyb20gXCIuL2V4dGVuZHNcIjtcblxuLy8gcmVxdWlyZWQgZm9yIGF1dG8gbW9kZSBpdCBzZWVtcy5cbi8vIEB0cy1pZ25vcmVcbmdsb2JhbFRoaXMuTElTUyA9IExJU1M7Il0sIm5hbWVzIjpbImdldFNoYXJlZENTUyIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJpc1NoYWRvd1N1cHBvcnRlZCIsIndhaXRET01Db250ZW50TG9hZGVkIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwic2hhcmVkQ1NTIiwiQ29udGVudEdlbmVyYXRvciIsImRhdGEiLCJjb25zdHJ1Y3RvciIsImh0bWwiLCJjc3MiLCJzaGFkb3ciLCJwcmVwYXJlSFRNTCIsInByZXBhcmVDU1MiLCJzZXRUZW1wbGF0ZSIsInRlbXBsYXRlIiwiaXNSZWFkeSIsIndoZW5SZWFkeSIsImdlbmVyYXRlIiwiaG9zdCIsInRhcmdldCIsImluaXRTaGFkb3ciLCJpbmplY3RDU1MiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwic2hhZG93TW9kZSIsIk5PTkUiLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwicmVwbGFjZUNoaWxkcmVuIiwiU2hhZG93Um9vdCIsImFwcGVuZCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImNhbkhhdmVTaGFkb3ciLCJFcnJvciIsIm1vZGUiLCJPUEVOIiwiYXR0YWNoU2hhZG93IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZSIsInByb2Nlc3NDU1MiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsInVuZGVmaW5lZCIsInN0ciIsInRyaW0iLCJpbm5lckhUTUwiLCJIVE1MRWxlbWVudCIsInN0eWxlc2hlZXRzIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwicHVzaCIsImNzc3NlbGVjdG9yIiwiQ1NTU2VsZWN0b3IiLCJoYXMiLCJzZXRBdHRyaWJ1dGUiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsInJlcGxhY2UiLCJoZWFkIiwiYWRkIiwiYnVpbGRMSVNTSG9zdCIsInNldENzdHJDb250cm9sZXIiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkxJU1MiLCJhcmdzIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwiY29udGVudF9nZW5lcmF0b3IiLCJMSVNTQ29udHJvbGVyIiwiSG9zdCIsInN0YXRlIiwiY29uc29sZSIsIndhcm4iLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJuYW1lIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImNvbm5lY3RlZENhbGxiYWNrIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJpc0Nvbm5lY3RlZCIsIl9Ib3N0IiwiTElTU1N0YXRlIiwiaWQiLCJfX2NzdHJfY29udHJvbGVyIiwiTGlzcyIsImhvc3RDc3RyIiwiY29udGVudF9nZW5lcmF0b3JfY3N0ciIsIkxJU1NIb3N0IiwiQ2ZnIiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiQ29udHJvbGVyIiwiY29udHJvbGVyIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJwYXJhbXMiLCJpbml0IiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicHJvbWlzZSIsInJlc29sdmUiLCJQcm9taXNlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiZGVmaW5lIiwiZ2V0Q29udHJvbGVyQ3N0ciIsImdldEhvc3RDc3RyIiwiZ2V0TmFtZSIsImlzRGVmaW5lZCIsIndoZW5BbGxEZWZpbmVkIiwid2hlbkRlZmluZWQiLCJnZXRTdGF0ZSIsImluaXRpYWxpemVTeW5jIiwidXBncmFkZVN5bmMiLCJ3aGVuVXBncmFkZWQiLCJERUZJTkVEIiwiUkVBRFkiLCJVUEdSQURFRCIsIklOSVRJQUxJWkVEIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiYnJ5X2NsYXNzIiwiX19iYXNlc19fIiwiZmlsdGVyIiwiX19uYW1lX18iLCJfanNfa2xhc3MiLCIkanNfZnVuYyIsIl9fQlJZVEhPTl9fIiwiJGNhbGwiLCIkZ2V0YXR0cl9wZXA2NTciLCJDbGFzcyIsImh0bWx0YWciLCJvcHRzIiwidGFnbmFtZXMiLCJhbGwiLCJ0IiwiZ2V0IiwiZWxlbWVudCIsIkVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiX0xJU1MiLCJJTElTUyIsImNmZyIsImFzc2lnbiIsIkV4dGVuZGVkTElTUyIsInNjcmlwdCIsIlJFU1NPVVJDRVMiLCJLbm93blRhZ3MiLCJTVyIsInN3X3BhdGgiLCJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwicmVnaXN0ZXIiLCJzY29wZSIsImVycm9yIiwiY29udHJvbGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnRzX2RpciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtdXRhdGlvbiIsImFkZGl0aW9uIiwiYWRkZWROb2RlcyIsImFkZFRhZyIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiZWxlbSIsInRhZyIsImltcG9ydENvbXBvbmVudCIsImNkaXIiLCJkZWZpbmVXZWJDb21wb25lbnQiLCJmaWxlcyIsImNfanMiLCJrbGFzcyIsImZpbGUiLCJCbG9iIiwidHlwZSIsInVybCIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsIm9sZHJlcSIsInJlcXVpcmUiLCJzdGFydHNXaXRoIiwiZmlsZW5hbWUiLCJzbGljZSIsImRlZmF1bHQiLCJMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yIiwiX2ZldGNoVGV4dCIsInVyaSIsImlzTGlzc0F1dG8iLCJvcHRpb25zIiwiaGVhZGVycyIsInJlc3BvbnNlIiwiZmV0Y2giLCJzdGF0dXMiLCJhbnN3ZXIiLCJ0ZXh0IiwiX2ltcG9ydCIsImxvZyIsImNvbnZlcnRlciIsImVuY29kZUhUTUwiLCJ0ZXh0Q29udGVudCIsIm1hdGNoIiwiY3NzX2F0dHJzIiwiZ2V0QXR0cmlidXRlTmFtZXMiLCJjc3NfYXR0ciIsInNldFByb3BlcnR5IiwiaW1wb3J0Q29tcG9uZW50cyIsImNvbXBvbmVudHMiLCJicnl0aG9uIiwicmVzdWx0cyIsImJyeV93cmFwcGVyIiwiY29tcG9fZGlyIiwiY29kZSIsImxpc3MiLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJFdmVudFRhcmdldDIiLCJFdmVudFRhcmdldCIsImNhbGxiYWNrIiwiZGlzcGF0Y2hFdmVudCIsImV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxpc3RlbmVyIiwiQ3VzdG9tRXZlbnQyIiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJXaXRoRXZlbnRzIiwiZXYiLCJfZXZlbnRzIiwiRXZlbnRUYXJnZXRNaXhpbnMiLCJldmVudE1hdGNoZXMiLCJzZWxlY3RvciIsImVsZW1lbnRzIiwiY29tcG9zZWRQYXRoIiwicmV2ZXJzZSIsIm1hdGNoZXMiLCJsaXNzX3NlbGVjdG9yIiwiX2J1aWxkUVMiLCJ0YWduYW1lX29yX3BhcmVudCIsInBhcmVudCIsInFzIiwicmVzdWx0IiwicXNvIiwicXNhIiwiaWR4IiwicHJvbWlzZXMiLCJxc2MiLCJyZXMiLCJjbG9zZXN0IiwicXNTeW5jIiwicXNhU3luYyIsInFzY1N5bmMiLCJyb290IiwiZ2V0Um9vdE5vZGUiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsIlN0YXRlIiwiaXMiLCJpc1VwZ3JhZGVkIiwid2hlbiIsIl93aGVuVXBncmFkZWQiLCJ2YWx1ZU9mIiwidG9TdHJpbmciLCJqb2luIiwic3RyaWN0Iiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImZvcmNlIiwiTGlmZUN5Y2xlIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwiZ2xvYmFsVGhpcyJdLCJzb3VyY2VSb290IjoiIn0=