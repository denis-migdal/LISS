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
/* harmony import */ var LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! LISSHost */ "./src/LISSHost.ts");
/* harmony import */ var types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! types */ "./src/types.ts");
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils.ts");



const alreadyDeclaredCSS = new Set();
const sharedCSS = (0,LISSHost__WEBPACK_IMPORTED_MODULE_0__.getSharedCSS)(); // from LISSHost...
class ContentGenerator {
    #stylesheets;
    #template;
    #shadow;
    constructor({ html, css = [], shadow = null } = {}){
        this.#shadow = shadow;
        this.#template = this.prepareHTML(html);
        this.#stylesheets = this.prepareCSS(css);
        this.#isReady = (0,utils__WEBPACK_IMPORTED_MODULE_2__.isDOMContentLoaded)();
        this.#whenReady = (0,utils__WEBPACK_IMPORTED_MODULE_2__.waitDOMContentLoaded)();
    //TODO: other deps...
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
        customElements.upgrade(host);
        //TODO: wait parents/children depending on option...     
        const target = this.initShadow(host);
        this.injectCSS(target, this.#stylesheets);
        const content = this.#template.content.cloneNode(true);
        target.replaceChildren(content);
        if (target instanceof ShadowRoot && target.childNodes.length === 0) target.append(document.createElement('slot'));
        return target;
    }
    initShadow(host) {
        const canHaveShadow = (0,utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host);
        if (this.#shadow !== null && this.#shadow !== types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE && !canHaveShadow) throw new Error(`Host element ${(0,utils__WEBPACK_IMPORTED_MODULE_2__._element2tagname)(host)} does not support ShadowRoot`);
        let mode = this.#shadow;
        if (mode === null) mode = canHaveShadow ? types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.SEMIOPEN : types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE;
        host.shadowMode = mode;
        if (mode === types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.SEMIOPEN) mode = types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.OPEN; // TODO: set to X.
        let target = host;
        if (mode !== types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE) target = host.attachShadow({
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
/* harmony import */ var ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ContentGenerator */ "./src/ContentGenerator.ts");


let __cstr_host = null;
function setCstrHost(_) {
    __cstr_host = _;
}
function LISS(args = {}) {
    let { /* extends is a JS reserved keyword. */ extends: _extends = Object, host = HTMLElement, content_generator = ContentGenerator__WEBPACK_IMPORTED_MODULE_1__["default"] } = args;
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
                this.#base = new Liss(...this.#params);
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
/* harmony import */ var customRegistery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");


_extends__WEBPACK_IMPORTED_MODULE_1__["default"].define = customRegistery__WEBPACK_IMPORTED_MODULE_0__.define;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenDefined = customRegistery__WEBPACK_IMPORTED_MODULE_0__.whenDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenAllDefined = customRegistery__WEBPACK_IMPORTED_MODULE_0__.whenAllDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].isDefined = customRegistery__WEBPACK_IMPORTED_MODULE_0__.isDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getName = customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getHostCstr = customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getBaseCstr = customRegistery__WEBPACK_IMPORTED_MODULE_0__.getBaseCstr;


/***/ }),

/***/ "./src/core/state.ts":
/*!***************************!*\
  !*** ./src/core/state.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! state */ "./src/state.ts");
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");


_extends__WEBPACK_IMPORTED_MODULE_1__["default"].DEFINED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].DEFINED, _extends__WEBPACK_IMPORTED_MODULE_1__["default"].READY = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].READY;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].UPGRADED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].UPGRADED;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].INITIALIZED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].INITIALIZED;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getState = state__WEBPACK_IMPORTED_MODULE_0__.getState;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].upgrade = state__WEBPACK_IMPORTED_MODULE_0__.upgrade;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].initialize = state__WEBPACK_IMPORTED_MODULE_0__.initialize;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].upgradeSync = state__WEBPACK_IMPORTED_MODULE_0__.upgradeSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].initializeSync = state__WEBPACK_IMPORTED_MODULE_0__.initializeSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenUpgraded = state__WEBPACK_IMPORTED_MODULE_0__.whenUpgraded;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenInitialized = state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized;


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
    // could be better.
    if ("Base" in ComponentClass) ComponentClass = ComponentClass.Base;
    const Class = ComponentClass.Host.Cfg.host;
    let htmltag = (0,_utils__WEBPACK_IMPORTED_MODULE_0__._element2tagname)(Class) ?? undefined;
    const LISSclass = ComponentClass.Host;
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
    customElements.define(tagname, LISSclass, opts);
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
/* harmony import */ var LISSHost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! LISSHost */ "./src/LISSHost.ts");


// used for plugins.
class ILISS {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISS);
function LISS(opts) {
    if (opts.extends !== undefined && "Host" in opts.extends) return _extends(opts);
    return (0,_LISSBase__WEBPACK_IMPORTED_MODULE_0__.LISS)(opts);
}
function _extends(opts) {
    if (opts.extends === undefined) throw new Error('please provide a LISSBase!');
    const cfg = opts.extends.Host.Cfg;
    opts = Object.assign({}, opts, cfg);
    class ExtendedLISS extends opts.extends {
        constructor(...args){
            super(...args);
        }
        static _Host;
        // TS is stupid, requires explicit return type
        static get Host() {
            if (this._Host === undefined) // @ts-ignore fuck off
            this._Host = (0,LISSHost__WEBPACK_IMPORTED_MODULE_1__.buildLISSHost)(this, opts.host, opts.content_generator, opts);
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
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _customRegistery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var ContentGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ContentGenerator */ "./src/ContentGenerator.ts");



// should be improved (but how ?)
const script = document.querySelector('script[autodir]');
if (script !== null) {
    const RESSOURCES = [
        "index.js",
        "index.bry",
        "index.html",
        "index.css"
    ];
    const KnownTags = new Set();
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
        const tagname = (tag.getAttribute('is') ?? tag.tagName).toLowerCase();
        if (!tagname.includes('-') || KnownTags.has(tagname)) return;
        KnownTags.add(tagname);
        await SW; // ensure SW is installed.
        const filenames = RESSOURCES;
        const resources = await Promise.all(filenames.map((file)=>{
            const file_path = `${components_dir}${tagname}/${file}`;
            return file.endsWith('.js') ? _import(file_path, true) : _fetchText(file_path, true);
        }));
        const files = {};
        for(let i = 0; i < filenames.length; ++i)if (resources[i] !== undefined) files[filenames[i]] = resources[i];
        const html = files["index.html"];
        const css = files["index.css"];
        let host = HTMLElement;
        if (tag.hasAttribute('is')) host = tag.constructor;
        return defineWebComponent(tagname, files, {
            html,
            css,
            host
        });
    }
    function defineWebComponent(tagname, files, opts) {
        const js = files["index.js"];
        let klass = null;
        if (js !== undefined) klass = js(opts);
        else if (opts.html !== undefined) {
            klass = (0,_LISSBase__WEBPACK_IMPORTED_MODULE_0__.LISS)({
                ...opts,
                content_generator: LISSAuto_ContentGenerator
            });
        }
        if (klass === null) throw new Error(`Missing files for WebComponent ${tagname}.`);
        return (0,_customRegistery__WEBPACK_IMPORTED_MODULE_1__.define)(tagname, klass);
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
}
class LISSAuto_ContentGenerator extends ContentGenerator__WEBPACK_IMPORTED_MODULE_2__["default"] {
    prepareHTML(html) {
        if (typeof html === 'string') {
            html = html.replaceAll(/\$\{([\w]+)\}/g, (_, name)=>{
                return `<liss value="${name}"></liss>`;
            });
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        //let str = (content as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
        //TODO: ${} in attr
        // - detect start ${ + end }
        // - register elem + attr name
        // - replace. 
        }
        return super.prepareHTML(html);
    }
    generate(host) {
        const content = super.generate(host);
        // html magic values.
        // can be optimized...
        const values = content.querySelectorAll('liss[value]');
        for (let value of values)value.textContent = host.getAttribute(value.getAttribute('value'));
        // css prop.
        const css_attrs = host.getAttributeNames().filter((e)=>e.startsWith('css-'));
        for (let css_attr of css_attrs)host.style.setProperty(`--${css_attr.slice('css-'.length)}`, host.getAttribute(css_attr));
        return content;
    }
}


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
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! utils */ "./src/utils.ts");


async function liss(str, ...args) {
    const elem = (0,utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return await (0,_state__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
}
function lissSync(str, ...args) {
    const elem = (0,utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
} /*
type BUILD_OPTIONS<T extends LISSBase> = Partial<{
    params    : Partial<T["params"]>,
    content	  : string|Node|readonly Node[],
    id 		    : string,
    classes	  : readonly string[],
    cssvars   : Readonly<Record<string, string>>,
    attrs 	  : Readonly<Record<string, string|boolean>>,
    data 	    : Readonly<Record<string, string|boolean>>,
    listeners : Readonly<Record<string, (ev: Event) => void>>
}> & ({
  initialize: false,
  parent: Element
}|{
  initialize?: true,
  parent?: Element
});

//async function build<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Promise<Components[T]>;

async function build<T extends LISSBase>(tagname: string, options?: BUILD_OPTIONS<T>): Promise<T>;
async function build<T extends LISSBase>(tagname: string, {
              params    = {},
              initialize= true,
              content   = [],
              parent    = undefined,
              id 		  = undefined,
              classes   = [],
              cssvars   = {},
              attrs     = {},
              data 	  = {},
              listeners = {}
              }: BUILD_OPTIONS<T> = {}): Promise<T> {

  if( ! initialize && parent === null)
    throw new Error("A parent must be given if initialize is false");

  let CustomClass = await customElements.whenDefined(tagname);
  let elem = new CustomClass(params) as LISSHost<T>;

  // Fix issue #2
  if( elem.tagName.toLowerCase() !== tagname )
  elem.setAttribute("is", tagname);

  if( id !== undefined )
  elem.id = id;

  if( classes.length > 0)
  elem.classList.add(...classes);

  for(let name in cssvars)
  elem.style.setProperty(`--${name}`, cssvars[name]);

  for(let name in attrs) {

  let value = attrs[name];
  if( typeof value === "boolean")
  elem.toggleAttribute(name, value);
  else
  elem.setAttribute(name, value);
  }

  for(let name in data) {

  let value = data[name];
  if( value === false)
  delete elem.dataset[name];
  else if(value === true)
  elem.dataset[name] = "";
  else
  elem.dataset[name] = value;
  }

  if( ! Array.isArray(content) )
  content = [content as any];
  elem.replaceChildren(...content);

  for(let name in listeners)
  elem.addEventListener(name, listeners[name]);

  if( parent !== undefined )
  parent.append(elem);

  if( ! elem.isInit && initialize )
  return await LISS.initialize(elem);

  return await LISS.getLISS(elem);
}
LISS.build = build;


function buildSync<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Components[T];
function buildSync<T extends LISSBase<any,any,any,any>>(tagname: string, options?: BUILD_OPTIONS<T>): T;
function buildSync<T extends LISSBase<any,any,any,any>>(tagname: string, {
params    = {},
initialize= true,
content   = [],
parent    = undefined,
id 		  = undefined,
classes   = [],
cssvars   = {},
attrs     = {},
data 	  = {},
listeners = {}
}: BUILD_OPTIONS<T> = {}): T {

if( ! initialize && parent === null)
throw new Error("A parent must be given if initialize is false");

let CustomClass = customElements.get(tagname);
if(CustomClass === undefined)
throw new Error(`${tagname} not defined`);
let elem = new CustomClass(params) as LISSHost<T>;

//TODO: factorize...

// Fix issue #2
if( elem.tagName.toLowerCase() !== tagname )
elem.setAttribute("is", tagname);

if( id !== undefined )
elem.id = id;

if( classes.length > 0)
elem.classList.add(...classes);

for(let name in cssvars)
elem.style.setProperty(`--${name}`, cssvars[name]);

for(let name in attrs) {

let value = attrs[name];
if( typeof value === "boolean")
elem.toggleAttribute(name, value);
else
elem.setAttribute(name, value);
}

for(let name in data) {

let value = data[name];
if( value === false)
delete elem.dataset[name];
else if(value === true)
elem.dataset[name] = "";
else
elem.dataset[name] = value;
}

if( ! Array.isArray(content) )
content = [content as any];
elem.replaceChildren(...content);

for(let name in listeners)
elem.addEventListener(name, listeners[name]);

if( parent !== undefined )
parent.append(elem);

if( ! elem.isInit && initialize )
LISS.initializeSync(elem);

return LISS.getLISSSync(elem);
}
LISS.buildSync = buildSync;
*/ 


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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxNQUFNLEtBQUssS0FBS3NCLFNBQVMzQixPQUFPLENBQUNrUSxVQUFVLENBQUVDLFFBQVEsS0FBS0MsS0FBS0MsU0FBUyxFQUN0RyxPQUFPMU8sU0FBUzNCLE9BQU8sQ0FBQ2tRLFVBQVU7SUFFcEMsT0FBT3ZPLFNBQVMzQixPQUFPO0FBQzNCOzs7Ozs7O1NDMUhBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFFUDtBQUNVO0FBRStCO0FBRS9ELGFBQWE7QUFFYixpQkFBaUI7QUFDakIsc0JBQXNCO0FBQ3VDO0FBQzNCO0FBRUE7QUFFYTtBQUN1QztBQUN6RDtBQUM3QixpRUFBZW9ELGdEQUFJQSxFQUFDO0FBRXBCLGFBQWE7QUFDc0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY29yZS9jdXN0b21SZWdpc3RlcnkudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9jb3JlL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY3VzdG9tUmVnaXN0ZXJ5LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFNoYXJlZENTUyB9IGZyb20gXCJMSVNTSG9zdFwiO1xuaW1wb3J0IHsgTEhvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCJ0eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCBpc1NoYWRvd1N1cHBvcnRlZCwgd2FpdERPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwidXRpbHNcIjtcblxudHlwZSBIVE1MID0gRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmc7XG50eXBlIENTUyAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7XG4gICAgaHRtbCAgID86IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nLFxuICAgIGNzcyAgICA/OiBDU1MgfCByZWFkb25seSBDU1NbXSxcbiAgICBzaGFkb3cgPzogU2hhZG93Q2ZnfG51bGxcbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvckNzdHIgPSB7IG5ldyhvcHRzOiBDb250ZW50R2VuZXJhdG9yX09wdHMpOiBDb250ZW50R2VuZXJhdG9yIH07XG5cbmNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcbmNvbnN0IHNoYXJlZENTUyA9IGdldFNoYXJlZENTUygpOyAvLyBmcm9tIExJU1NIb3N0Li4uXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgI3N0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W107XG4gICAgI3RlbXBsYXRlICAgOiBIVE1MVGVtcGxhdGVFbGVtZW50O1xuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGh0bWwsXG4gICAgICAgIGNzcyAgICA9IFtdLFxuICAgICAgICBzaGFkb3cgPSBudWxsLFxuICAgIH06IENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4jc2hhZG93ICAgPSBzaGFkb3c7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGhpcy5wcmVwYXJlSFRNTChodG1sKTtcbiAgICBcbiAgICAgICAgdGhpcy4jc3R5bGVzaGVldHMgPSB0aGlzLnByZXBhcmVDU1MoY3NzKTtcblxuICAgICAgICB0aGlzLiNpc1JlYWR5ICAgPSBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgdGhpcy4jd2hlblJlYWR5ID0gd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcblxuICAgICAgICAvL1RPRE86IG90aGVyIGRlcHMuLi5cbiAgICB9XG5cbiAgICAjd2hlblJlYWR5OiBQcm9taXNlPHVua25vd24+O1xuICAgICNpc1JlYWR5ICA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZWFkeTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuI2lzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiN3aGVuUmVhZHk7XG4gICAgICAgIC8vVE9ETzogZGVwcy5cbiAgICAgICAgLy9UT0RPOiBDU1MvSFRNTCByZXNvdXJjZXMuLi5cblxuICAgICAgICAvLyBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuICAgICAgICAvLyBfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcbiAgICAgICAgLy8gKyBjZiBhdCB0aGUgZW5kLi4uXG4gICAgfVxuXG4gICAgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBMSG9zdCk6IEhUTUxFbGVtZW50fFNoYWRvd1Jvb3Qge1xuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoaG9zdCk7XG4gICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi4gICAgIFxuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaW5pdFNoYWRvdyhob3N0KTtcblxuICAgICAgICB0aGlzLmluamVjdENTUyh0YXJnZXQsIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy4jdGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIHRhcmdldC5yZXBsYWNlQ2hpbGRyZW4oY29udGVudCk7XG5cbiAgICAgICAgaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgJiYgdGFyZ2V0LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKVxuXHRcdFx0dGFyZ2V0LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFNoYWRvdzxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpIHtcblxuICAgICAgICBjb25zdCBjYW5IYXZlU2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCk7XG4gICAgICAgIGlmKCB0aGlzLiNzaGFkb3cgIT09IG51bGwgJiYgdGhpcy4jc2hhZG93ICE9PSBTaGFkb3dDZmcuTk9ORSAmJiAhIGNhbkhhdmVTaGFkb3cgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgICAgICBsZXQgbW9kZSA9IHRoaXMuI3NoYWRvdztcbiAgICAgICAgaWYoIG1vZGUgPT09IG51bGwgKVxuICAgICAgICAgICAgbW9kZSA9IGNhbkhhdmVTaGFkb3cgPyBTaGFkb3dDZmcuU0VNSU9QRU4gOiBTaGFkb3dDZmcuTk9ORTtcblxuICAgICAgICBob3N0LnNoYWRvd01vZGUgPSBtb2RlO1xuXG4gICAgICAgIGlmKCBtb2RlID09PSBTaGFkb3dDZmcuU0VNSU9QRU4pXG4gICAgICAgICAgICBtb2RlID0gU2hhZG93Q2ZnLk9QRU47IC8vIFRPRE86IHNldCB0byBYLlxuXG4gICAgICAgIGxldCB0YXJnZXQ6IEhvc3R8U2hhZG93Um9vdCA9IGhvc3Q7XG4gICAgICAgIGlmKCBtb2RlICE9PSBTaGFkb3dDZmcuTk9ORSlcbiAgICAgICAgICAgIHRhcmdldCA9IGhvc3QuYXR0YWNoU2hhZG93KHttb2RlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUNTUyhjc3M6IENTU3xyZWFkb25seSBDU1NbXSkge1xuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgcmV0dXJuIGNzcy5tYXAoZSA9PiB0aGlzLnByb2Nlc3NDU1MoZSkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NTUyhjc3M6IENTUykge1xuXG4gICAgICAgIGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG4gICAgICAgICAgICByZXR1cm4gY3NzO1xuICAgICAgICBpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBjc3Muc2hlZXQhO1xuICAgIFxuICAgICAgICBpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1clwiKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUhUTUwoaHRtbD86IEhUTUwpIHtcbiAgICBcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgICAgIGlmKGh0bWwgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcblxuICAgICAgICAvLyBzdHIyaHRtbFxuICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGh0bWwudHJpbSgpO1xuXG4gICAgICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggaHRtbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IClcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICB0ZW1wbGF0ZS5hcHBlbmQoaHRtbCk7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBpbmplY3RDU1M8SG9zdCBleHRlbmRzIExIb3N0Pih0YXJnZXQ6IFNoYWRvd1Jvb3R8SG9zdCwgc3R5bGVzaGVldHM6IGFueVtdKSB7XG5cbiAgICAgICAgaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTLCAuLi5zdHlsZXNoZWV0cyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjc3NzZWxlY3RvciA9IHRhcmdldC5DU1NTZWxlY3RvcjsgLy9UT0RPLi4uXG5cbiAgICAgICAgaWYoIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpIClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuICAgICAgICBsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG4gICAgICAgIGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG4gICAgICAgICAgICBmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG4gICAgICAgICAgICAgICAgaHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG4gICAgICAgIGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuICAgIH1cbn1cblxuLy8gaWRlbSBIVE1MLi4uXG4vKiBpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgYyA9IGF3YWl0IGM7XG4gICAgICAgICAgICBpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcbiAgICAgICAgICAgICAgICBjID0gYXdhaXQgYy50ZXh0KCk7XG5cbiAgICAgICAgICAgIHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuICAgICAgICB9KSgpKTtcblxuICAgICAgICByZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG4gICAgfVxuKi8iLCJpbXBvcnQgeyBMSG9zdENzdHIsIHR5cGUgQ2xhc3MsIHR5cGUgQ29uc3RydWN0b3IsIHR5cGUgTElTU19PcHRzIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgTElTU1N0YXRlIH0gZnJvbSBcInN0YXRlXCI7XG5cbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QsIHNldENzdHJCYXNlIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkLCBodG1sIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yLCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiQ29udGVudEdlbmVyYXRvclwiO1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0Ly8gSFRNTCBCYXNlXG5cdEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4oYXJnczogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PiA9IHt9KSB7XG5cblx0bGV0IHtcblx0XHQvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cblx0XHRleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCAgICAgIGFzIHVua25vd24gYXMgRXh0ZW5kc0N0cixcblx0XHRob3N0ICAgICAgICAgICAgICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdFxuXHRcdGNvbnRlbnRfZ2VuZXJhdG9yID0gQ29udGVudEdlbmVyYXRvcixcblx0fSA9IGFyZ3M7XG5cdFxuXHRjbGFzcyBMSVNTQmFzZSBleHRlbmRzIF9leHRlbmRzIHtcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKSB7XG5cdFx0XHRcdHNldENzdHJCYXNlKHRoaXMpO1xuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3QoLi4uYXJncyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBkbyBJIHJlYWxseSBuZWVkIHRvIGV4cG9zZSBzdWNoIHN0cnVjdHVyZSBoZXJlID9cblx0XHRzdGF0aWMgZ2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5Ib3N0LnN0YXRlO1xuXHRcdH1cblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5jb250ZW50ITtcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7fVxuXG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ob3N0LmlzQ29ubmVjdGVkO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBJbnN0YW5jZVR5cGU8TEhvc3RDc3RyPEhvc3RDc3RyPj47XG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBfSG9zdDogTEhvc3RDc3RyPEhvc3RDc3RyPjtcblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmU6IGZ1Y2sgb2ZmLlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCggdGhpcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRob3N0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlO1xufSIsImltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgU2hhZG93Q2ZnLCB0eXBlIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIkNvbnRlbnRHZW5lcmF0b3JcIjtcblxuLy8gTElTU0hvc3QgbXVzdCBiZSBidWlsZCBpbiBkZWZpbmUgYXMgaXQgbmVlZCB0byBiZSBhYmxlIHRvIGJ1aWxkXG4vLyB0aGUgZGVmaW5lZCBzdWJjbGFzcy5cblxubGV0IGlkID0gMDtcblxuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFyZWRDU1MoKSB7XG5cdHJldHVybiBzaGFyZWRDU1M7XG59XG5cbmxldCBfX2NzdHJfYmFzZSAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckJhc2UoXzogYW55KSB7XG5cdF9fY3N0cl9iYXNlID0gXztcbn1cblxudHlwZSBpbmZlckhvc3RDc3RyPFQ+ID0gVCBleHRlbmRzIExJU1NCYXNlQ3N0cjxpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LCBpbmZlciBCIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA/IEIgOiBuZXZlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XHRUIGV4dGVuZHMgTElTU0Jhc2VDc3RyLCBVIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gaW5mZXJIb3N0Q3N0cjxUPiA+KFxuXHRcdFx0XHRcdFx0XHRMaXNzOiBULFxuXHRcdFx0XHRcdFx0XHQvLyBjYW4ndCBkZWR1Y2UgOiBjYXVzZSB0eXBlIGRlZHVjdGlvbiBpc3N1ZXMuLi5cblx0XHRcdFx0XHRcdFx0aG9zdENzdHI6IFUsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHI6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuXHRcdFx0XHRcdFx0XHRhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG5cdFx0XHRcdFx0XHQpIHtcblxuXHRjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcl9jc3RyKGFyZ3MpO1xuXG5cdHR5cGUgSG9zdENzdHIgPSBVO1xuICAgIHR5cGUgSG9zdCAgICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdGNsYXNzIExJU1NIb3N0IGV4dGVuZHMgaG9zdENzdHIge1xuXG5cdFx0c3RhdGljIHJlYWRvbmx5IENmZyA9IHtcblx0XHRcdGhvc3QgICAgICAgICAgICAgOiBob3N0Q3N0cixcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBjb250ZW50X2dlbmVyYXRvcl9jc3RyLFxuXHRcdFx0YXJnc1xuXHRcdH1cblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdCNwYXJhbXM6IGFueVtdO1xuXHRcdGluaXRpYWxpemUoLi4ucGFyYW1zOiBhbnlbXSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRpZiggcGFyYW1zLmxlbmd0aCAhPT0gMCApIHtcblx0XHRcdFx0aWYoIHRoaXMuI3BhcmFtcy5sZW5ndGggIT09IDAgKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ3N0ciBwYXJhbXMgaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZCAhJyk7XG5cdFx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdHRoaXMuI2Jhc2UuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290ID0gdGhpcyBhcyBIb3N0O1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgYXR0YWNoU2hhZG93KGluaXQ6IFNoYWRvd1Jvb3RJbml0KTogU2hhZG93Um9vdCB7XG5cdFx0XHRjb25zdCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3coaW5pdCk7XG5cblx0XHRcdC8vIEB0cy1pZ25vcmUgY2xvc2VkIElTIGFzc2lnbmFibGUgdG8gc2hhZG93TW9kZS4uLlxuXHRcdFx0dGhpcy5zaGFkb3dNb2RlID0gaW5pdC5tb2RlO1xuXG5cdFx0XHR0aGlzLiNjb250ZW50ID0gc2hhZG93O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc2hhZG93O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2hhZG93TW9kZSAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKC4uLnBhcmFtczogYW55W10pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGNvbnN0IGJhc2UgPSBfX2NzdHJfYmFzZTtcblx0XHRcdF9fY3N0cl9iYXNlID0gbnVsbDtcblxuXHRcdFx0aWYoIGJhc2UgIT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy4jYmFzZSA9IGJhc2U7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdGlmKHRoaXMuYmFzZSAhPT0gbnVsbClcblx0XHRcdFx0dGhpcy5iYXNlLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApIHtcblx0XHRcdFx0dGhpcy5iYXNlIS5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuc3RhdGUuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCB0aGlzLnN0YXRlLmlzUmVhZHk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gTGlzcy5vYnNlcnZlZEF0dHJpYnV0ZXM7XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKHRoaXMuI2Jhc2UpXG5cdFx0XHRcdHRoaXMuI2Jhc2UuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0c2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGwgPSBudWxsO1xuXG5cdFx0b3ZlcnJpZGUgZ2V0IHNoYWRvd1Jvb3QoKSB7XG5cdFx0XHRpZih0aGlzLnNoYWRvd01vZGUgPT09IFNoYWRvd0NmZy5TRU1JT1BFTilcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRyZXR1cm4gc3VwZXIuc2hhZG93Um9vdDtcblx0XHR9XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cblx0XHRcdC8vIG5vIG5lZWRzIHRvIHNldCB0aGlzLiNjb250ZW50IChhbHJlYWR5IGhvc3Qgb3Igc2V0IHdoZW4gYXR0YWNoU2hhZG93KVxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3IuZ2VuZXJhdGUodGhpcyk7XG5cblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblxuXHRcdFx0aWYoIHRoaXMuI2Jhc2UgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdFx0XHRcdHRoaXMuI2Jhc2UgPSBuZXcgTGlzcyguLi50aGlzLiNwYXJhbXMpIGFzIEluc3RhbmNlVHlwZTxUPjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuYmFzZSk7XG5cblx0XHRcdHJldHVybiB0aGlzLmJhc2U7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBMSVNTSG9zdDtcbn1cblxuXG4iLCJcbmltcG9ydCB7IGRlZmluZSwgZ2V0QmFzZUNzdHIsIGdldEhvc3RDc3RyLCBnZXROYW1lLCBpc0RlZmluZWQsIHdoZW5BbGxEZWZpbmVkLCB3aGVuRGVmaW5lZCB9IGZyb20gXCJjdXN0b21SZWdpc3RlcnlcIjtcblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0d2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG5cdFx0Z2V0SG9zdENzdHIgICAgOiB0eXBlb2YgZ2V0SG9zdENzdHI7XG5cdFx0Z2V0QmFzZUNzdHIgICAgOiB0eXBlb2YgZ2V0QmFzZUNzdHI7XG4gICAgfVxufVxuXG5MSVNTLmRlZmluZSAgICAgICAgID0gZGVmaW5lO1xuTElTUy53aGVuRGVmaW5lZCAgICA9IHdoZW5EZWZpbmVkO1xuTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lO1xuTElTUy5nZXRIb3N0Q3N0ciAgICA9IGdldEhvc3RDc3RyO1xuTElTUy5nZXRCYXNlQ3N0ciAgICA9IGdldEJhc2VDc3RyOyIsIlxuaW1wb3J0IHsgREVGSU5FRCwgZ2V0U3RhdGUsIGluaXRpYWxpemUsIElOSVRJQUxJWkVELCBpbml0aWFsaXplU3luYywgUkVBRFksIHVwZ3JhZGUsIFVQR1JBREVELCB1cGdyYWRlU3luYywgd2hlbkluaXRpYWxpemVkLCB3aGVuVXBncmFkZWQgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBERUZJTkVEICAgIDogdHlwZW9mIERFRklORUQsXG4gICAgICAgIFJFQURZICAgICAgOiB0eXBlb2YgUkVBRFk7XG4gICAgICAgIFVQR1JBREVEICAgOiB0eXBlb2YgVVBHUkFERUQ7XG4gICAgICAgIElOSVRJQUxJWkVEOiB0eXBlb2YgSU5JVElBTElaRUQ7XG4gICAgICAgIGdldFN0YXRlICAgICAgIDogdHlwZW9mIGdldFN0YXRlO1xuICAgICAgICB1cGdyYWRlICAgICAgICA6IHR5cGVvZiB1cGdyYWRlO1xuICAgICAgICBpbml0aWFsaXplICAgICA6IHR5cGVvZiBpbml0aWFsaXplO1xuICAgICAgICB1cGdyYWRlU3luYyAgICA6IHR5cGVvZiB1cGdyYWRlU3luYztcbiAgICAgICAgaW5pdGlhbGl6ZVN5bmMgOiB0eXBlb2YgaW5pdGlhbGl6ZVN5bmM7XG4gICAgICAgIHdoZW5VcGdyYWRlZCAgIDogdHlwZW9mIHdoZW5VcGdyYWRlZDtcbiAgICAgICAgd2hlbkluaXRpYWxpemVkOiB0eXBlb2Ygd2hlbkluaXRpYWxpemVkO1xuICAgIH1cbn1cblxuTElTUy5ERUZJTkVEICAgID0gTElTUy5ERUZJTkVELFxuTElTUy5SRUFEWSAgICAgID0gTElTUy5SRUFEWTtcbkxJU1MuVVBHUkFERUQgICA9IExJU1MuVVBHUkFERUQ7XG5MSVNTLklOSVRJQUxJWkVEPSBMSVNTLklOSVRJQUxJWkVEO1xuXG5MSVNTLmdldFN0YXRlICAgICAgID0gZ2V0U3RhdGU7XG5MSVNTLnVwZ3JhZGUgICAgICAgID0gdXBncmFkZTtcbkxJU1MuaW5pdGlhbGl6ZSAgICAgPSBpbml0aWFsaXplO1xuTElTUy51cGdyYWRlU3luYyAgICA9IHVwZ3JhZGVTeW5jO1xuTElTUy5pbml0aWFsaXplU3luYyA9IGluaXRpYWxpemVTeW5jO1xuTElTUy53aGVuVXBncmFkZWQgICA9IHdoZW5VcGdyYWRlZDtcbkxJU1Mud2hlbkluaXRpYWxpemVkPSB3aGVuSW5pdGlhbGl6ZWQ7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCB4OiBhbnk7XG5cbi8vIEdvIHRvIHN0YXRlIERFRklORURcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD4pIHtcblxuICAgIC8vIGNvdWxkIGJlIGJldHRlci5cbiAgICBpZiggXCJCYXNlXCIgaW4gQ29tcG9uZW50Q2xhc3MpXG4gICAgICAgIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQmFzZSBhcyBUO1xuICAgIFxuICAgIGNvbnN0IENsYXNzICA9IENvbXBvbmVudENsYXNzLkhvc3QuQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKHRhZ25hbWU6IHN0cmluZyApIHtcblx0cmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKG5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NCYXNlfExJU1NCYXNlQ3N0cnxMSVNTSG9zdDxMSVNTQmFzZT58TElTU0hvc3RDc3RyPExJU1NCYXNlPiApOiBzdHJpbmcge1xuXG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50LmNvbnN0cnVjdG9yKVxuXHRcdGVsZW1lbnQgPSBlbGVtZW50LmNvbnN0cnVjdG9yLkhvc3QgYXMgTElTU0hvc3RDc3RyPExJU1NCYXNlPjtcblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQpXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGVsZW1lbnQgPSBlbGVtZW50Lkhvc3Q7XG5cdGlmKCBcIkJhc2VcIiBpbiBlbGVtZW50LmNvbnN0cnVjdG9yKVxuXHRcdGVsZW1lbnQgPSBlbGVtZW50LmNvbnN0cnVjdG9yIGFzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT47XG5cblx0aWYoIFwiQmFzZVwiIGluIGVsZW1lbnQpIHtcblx0XHRjb25zdCBuYW1lID0gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZSggZWxlbWVudCApO1xuXHRcdGlmKG5hbWUgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJub3QgZGVmaW5lZCFcIik7XG5cblx0XHRyZXR1cm4gbmFtZTtcblx0fVxuXG5cdGlmKCAhIChlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkgKVxuXHRcdHRocm93IG5ldyBFcnJvcignPz8/Jyk7XG5cblx0Y29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcblx0aWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuXHRyZXR1cm4gbmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+PihuYW1lOiBzdHJpbmcpOiBUIHtcblx0cmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChuYW1lKSBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFzZUNzdHI8VCBleHRlbmRzIExJU1NCYXNlQ3N0cj4obmFtZTogc3RyaW5nKTogVCB7XG5cdHJldHVybiBnZXRIb3N0Q3N0cjxMSVNTSG9zdENzdHI8VD4+KG5hbWUpLkJhc2UgYXMgVDtcbn0iLCJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0IH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7TElTUyBhcyBfTElTU30gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiTElTU0hvc3RcIjtcblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyLFxuICAgICAgICBIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4ob3B0czogUGFydGlhbDxMSVNTX09wdHM8QmFzZUNzdHIsIEhvc3RDc3RyPj4pOiBMSVNTQmFzZUNzdHI8QmFzZUNzdHIsIEhvc3RDc3RyPlxuLy8gTElTU0Jhc2Ugc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTKG9wdHM6IGFueSk6IExJU1NCYXNlQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NCYXNlQ3N0clxuICAgICAgICByZXR1cm4gX2V4dGVuZHMob3B0cyk7XG5cbiAgICByZXR1cm4gX0xJU1Mob3B0cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZXh0ZW5kczxcbiAgICAgICAgQmFzZUNzdHIgZXh0ZW5kcyBMSVNTQmFzZUNzdHIsXG4gICAgICAgIC8vVE9ETzogY29uc3RyYWludCBvbiBIVE1MRWxlbWVudC4uLlxuICAgICAgICBIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4ob3B0czogUGFydGlhbDxMSVNTX09wdHM8QmFzZUNzdHIsIEhvc3RDc3RyPj4pOiBMSVNTQmFzZUNzdHI8QmFzZUNzdHIsIEhvc3RDc3RyPiB7XG5cbiAgICBpZiggb3B0cy5leHRlbmRzID09PSB1bmRlZmluZWQpIC8vIGg0Y2tcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBhIExJU1NCYXNlIScpO1xuXG4gICAgY29uc3QgY2ZnID0gb3B0cy5leHRlbmRzLkhvc3QuQ2ZnO1xuICAgIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzLCBjZmcpO1xuXG4gICAgY2xhc3MgRXh0ZW5kZWRMSVNTIGV4dGVuZHMgb3B0cy5leHRlbmRzISB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICB9XG5cblx0XHRwcm90ZWN0ZWQgc3RhdGljIG92ZXJyaWRlIF9Ib3N0OiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+O1xuXG4gICAgICAgIC8vIFRTIGlzIHN0dXBpZCwgcmVxdWlyZXMgZXhwbGljaXQgcmV0dXJuIHR5cGVcblx0XHRzdGF0aWMgb3ZlcnJpZGUgZ2V0IEhvc3QoKTogTElTU0hvc3Q8RXh0ZW5kZWRMSVNTPiB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgZnVjayBvZmZcblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QodGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmhvc3QhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuY29udGVudF9nZW5lcmF0b3IhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1MgYXMgdW5rbm93biBhcyBMSVNTQmFzZUNzdHI8QmFzZUNzdHIsIEhvc3RDc3RyPjtcbn0iLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciwgTEhvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTfSBmcm9tIFwiLi4vTElTU0Jhc2VcIjtcblxuaW1wb3J0IHtkZWZpbmV9IGZyb20gXCIuLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCJDb250ZW50R2VuZXJhdG9yXCI7XG5cbi8vIHNob3VsZCBiZSBpbXByb3ZlZCAoYnV0IGhvdyA/KVxuY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2F1dG9kaXJdJyk7XG5pZiggc2NyaXB0ICE9PSBudWxsICkge1xuXG5cdGNvbnN0IFJFU1NPVVJDRVMgPSBbXG5cdFx0XCJpbmRleC5qc1wiLFxuXHRcdFwiaW5kZXguYnJ5XCIsXG5cdFx0XCJpbmRleC5odG1sXCIsXG5cdFx0XCJpbmRleC5jc3NcIlxuXHRdO1xuXG5cdGNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cblx0XHRjb25zdCBzd19wYXRoID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKTtcblxuXHRcdGlmKCBzd19wYXRoID09PSBudWxsICkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHN3X3BhdGgsIHtzY29wZTogXCIvXCJ9KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0bGV0IGNvbXBvbmVudHNfZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpITtcblx0Lypcblx0aWYoIGNvbXBvbmVudHNfZGlyWzBdID09PSAnLicpIHtcblx0XHRjb21wb25lbnRzX2RpciA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIGNvbXBvbmVudHNfZGlyOyAvLyBnZXR0aW5nIGFuIGFic29sdXRlIHBhdGguXG5cdH1cblx0Ki9cblx0aWYoIGNvbXBvbmVudHNfZGlyW2NvbXBvbmVudHNfZGlyLmxlbmd0aC0xXSAhPT0gJy8nKVxuXHRcdGNvbXBvbmVudHNfZGlyICs9ICcvJztcblxuXHQvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdFx0XHRcdGFkZFRhZyhhZGRpdGlvbilcblxuXHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqXCIpIClcblx0XHRhZGRUYWcoIGVsZW0gKTtcblxuXG5cdGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRjb25zdCB0YWduYW1lID0gKCB0YWcuZ2V0QXR0cmlidXRlKCdpcycpID8/IHRhZy50YWdOYW1lICkudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmKCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCBLbm93blRhZ3MuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0S25vd25UYWdzLmFkZCh0YWduYW1lKTtcblxuXHRcdGF3YWl0IFNXOyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG5cdFx0Y29uc3QgZmlsZW5hbWVzID0gUkVTU09VUkNFUztcblx0XHRjb25zdCByZXNvdXJjZXMgPSBhd2FpdCBQcm9taXNlLmFsbCggZmlsZW5hbWVzLm1hcCggZmlsZSA9PiB7XG5cdFx0XHRjb25zdCBmaWxlX3BhdGggPSBgJHtjb21wb25lbnRzX2Rpcn0ke3RhZ25hbWV9LyR7ZmlsZX1gO1xuXHRcdFx0cmV0dXJuIGZpbGUuZW5kc1dpdGgoJy5qcycpID8gX2ltcG9ydCAgIChmaWxlX3BhdGgsIHRydWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDogX2ZldGNoVGV4dChmaWxlX3BhdGgsIHRydWUpO1xuXHRcdH0pKTtcblxuXHRcdGNvbnN0IGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGZpbGVuYW1lcy5sZW5ndGg7ICsraSlcblx0XHRcdGlmKCByZXNvdXJjZXNbaV0gIT09IHVuZGVmaW5lZClcblx0XHRcdFx0ZmlsZXNbZmlsZW5hbWVzW2ldXSA9IHJlc291cmNlc1tpXTtcblxuXHRcdGNvbnN0IGh0bWwgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cdFx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0cmV0dXJuIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcywge2h0bWwsIGNzcywgaG9zdH0pO1xuXHRcdFxuXHR9XG5cblxuXHRmdW5jdGlvbiBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZTogc3RyaW5nLCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55Piwgb3B0czoge2h0bWw6IHN0cmluZywgY3NzOiBzdHJpbmcsIGhvc3Q6IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pn0pIHtcblxuXHRcdGNvbnN0IGpzICAgICAgPSBmaWxlc1tcImluZGV4LmpzXCJdO1xuXG5cdFx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdFx0aWYoIGpzICE9PSB1bmRlZmluZWQgKVxuXHRcdFx0a2xhc3MgPSBqcyhvcHRzKTtcblx0XHRlbHNlIGlmKCBvcHRzLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGtsYXNzID0gTElTUyh7XG5cdFx0XHRcdC4uLm9wdHMsXG5cdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZihrbGFzcyA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0XHRyZXR1cm4gZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblx0fVxuXG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vID09PT09PT09PT09PT09PSBMSVNTIGludGVybmFsIHRvb2xzID09PT09PT09PT09PVxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRhc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0XHRjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuXHRcdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHRcdDoge307XG5cblxuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcblx0XHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdFx0aWYoIGlzTGlzc0F1dG8gJiYgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJzdGF0dXNcIikhID09PSBcIjQwNFwiIClcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0XHRyZXR1cm4gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXHR9XG5cdGFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdFx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdFx0aWYoaXNMaXNzQXV0byAmJiBhd2FpdCBfZmV0Y2hUZXh0KHVyaSwgaXNMaXNzQXV0bykgPT09IHVuZGVmaW5lZCApXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJpKSkuZGVmYXVsdDtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuXHRwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcGFyZUhUTUwoaHRtbD86IERvY3VtZW50RnJhZ21lbnQgfCBIVE1MRWxlbWVudCB8IHN0cmluZyk6IEhUTUxUZW1wbGF0ZUVsZW1lbnQge1xuXHRcdFxuXHRcdGlmKCB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHJldHVybiBgPGxpc3MgdmFsdWU9XCIke25hbWV9XCI+PC9saXNzPmA7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdFx0Ly9sZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IHRoaXMuZ2V0QXR0cmlidXRlKG1hdGNoKT8/JycpXG5cblx0XHRcdC8vVE9ETzogJHt9IGluIGF0dHJcblx0XHRcdFx0Ly8gLSBkZXRlY3Qgc3RhcnQgJHsgKyBlbmQgfVxuXHRcdFx0XHQvLyAtIHJlZ2lzdGVyIGVsZW0gKyBhdHRyIG5hbWVcblx0XHRcdFx0Ly8gLSByZXBsYWNlLiBcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHN1cGVyLnByZXBhcmVIVE1MKGh0bWwpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnQgfCBTaGFkb3dSb290IHtcblx0XHRcblx0XHRjb25zdCBjb250ZW50ID0gc3VwZXIuZ2VuZXJhdGUoaG9zdCk7XG5cblx0XHQvLyBodG1sIG1hZ2ljIHZhbHVlcy5cblx0XHQvLyBjYW4gYmUgb3B0aW1pemVkLi4uXG5cdFx0Y29uc3QgdmFsdWVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXHRcdGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuXHRcdFx0dmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXG5cdFx0Ly8gY3NzIHByb3AuXG5cdFx0Y29uc3QgY3NzX2F0dHJzID0gaG9zdC5nZXRBdHRyaWJ1dGVOYW1lcygpLmZpbHRlciggZSA9PiBlLnN0YXJ0c1dpdGgoJ2Nzcy0nKSk7XG5cdFx0Zm9yKGxldCBjc3NfYXR0ciBvZiBjc3NfYXR0cnMpXG5cdFx0XHRob3N0LnN0eWxlLnNldFByb3BlcnR5KGAtLSR7Y3NzX2F0dHIuc2xpY2UoJ2Nzcy0nLmxlbmd0aCl9YCwgaG9zdC5nZXRBdHRyaWJ1dGUoY3NzX2F0dHIpKTtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59IiwiaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCIuLi9zdGF0ZVwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCJ1dGlsc1wiO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufVxuXG4vKlxudHlwZSBCVUlMRF9PUFRJT05TPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBQYXJ0aWFsPHtcbiAgICBwYXJhbXMgICAgOiBQYXJ0aWFsPFRbXCJwYXJhbXNcIl0+LFxuICAgIGNvbnRlbnRcdCAgOiBzdHJpbmd8Tm9kZXxyZWFkb25seSBOb2RlW10sXG4gICAgaWQgXHRcdCAgICA6IHN0cmluZyxcbiAgICBjbGFzc2VzXHQgIDogcmVhZG9ubHkgc3RyaW5nW10sXG4gICAgY3NzdmFycyAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4sXG4gICAgYXR0cnMgXHQgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBkYXRhIFx0ICAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBsaXN0ZW5lcnMgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCAoZXY6IEV2ZW50KSA9PiB2b2lkPj5cbn0+ICYgKHtcbiAgaW5pdGlhbGl6ZTogZmFsc2UsXG4gIHBhcmVudDogRWxlbWVudFxufXx7XG4gIGluaXRpYWxpemU/OiB0cnVlLFxuICBwYXJlbnQ/OiBFbGVtZW50XG59KTtcblxuLy9hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBQcm9taXNlPENvbXBvbmVudHNbVF0+O1xuXG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPih0YWduYW1lOiBzdHJpbmcsIHtcbiAgICAgICAgICAgICAgcGFyYW1zICAgID0ge30sXG4gICAgICAgICAgICAgIGluaXRpYWxpemU9IHRydWUsXG4gICAgICAgICAgICAgIGNvbnRlbnQgICA9IFtdLFxuICAgICAgICAgICAgICBwYXJlbnQgICAgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGlkIFx0XHQgID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBjbGFzc2VzICAgPSBbXSxcbiAgICAgICAgICAgICAgY3NzdmFycyAgID0ge30sXG4gICAgICAgICAgICAgIGF0dHJzICAgICA9IHt9LFxuICAgICAgICAgICAgICBkYXRhIFx0ICA9IHt9LFxuICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSB7fVxuICAgICAgICAgICAgICB9OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBQcm9taXNlPFQ+IHtcblxuICBpZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbiAgbGV0IEN1c3RvbUNsYXNzID0gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG4gIGxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbiAgLy8gRml4IGlzc3VlICMyXG4gIGlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG4gIGVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbiAgaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuICBlbGVtLmlkID0gaWQ7XG5cbiAgaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuICBlbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuICBmb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxuICBsZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbiAgaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG4gIGVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgZWxzZVxuICBlbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH1cblxuICBmb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG4gIGxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG4gIGlmKCB2YWx1ZSA9PT0gZmFsc2UpXG4gIGRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG4gIGVsc2UgaWYodmFsdWUgPT09IHRydWUpXG4gIGVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG4gIGVsc2VcbiAgZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBpZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbiAgY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG4gIGVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG4gIGlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG4gIHBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbiAgaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG4gIHJldHVybiBhd2FpdCBMSVNTLmluaXRpYWxpemUoZWxlbSk7XG5cbiAgcmV0dXJuIGF3YWl0IExJU1MuZ2V0TElTUyhlbGVtKTtcbn1cbkxJU1MuYnVpbGQgPSBidWlsZDtcblxuXG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogQ29tcG9uZW50c1tUXTtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFQ7XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywge1xucGFyYW1zICAgID0ge30sXG5pbml0aWFsaXplPSB0cnVlLFxuY29udGVudCAgID0gW10sXG5wYXJlbnQgICAgPSB1bmRlZmluZWQsXG5pZCBcdFx0ICA9IHVuZGVmaW5lZCxcbmNsYXNzZXMgICA9IFtdLFxuY3NzdmFycyAgID0ge30sXG5hdHRycyAgICAgPSB7fSxcbmRhdGEgXHQgID0ge30sXG5saXN0ZW5lcnMgPSB7fVxufTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogVCB7XG5cbmlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxudGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG5sZXQgQ3VzdG9tQ2xhc3MgPSBjdXN0b21FbGVtZW50cy5nZXQodGFnbmFtZSk7XG5pZihDdXN0b21DbGFzcyA9PT0gdW5kZWZpbmVkKVxudGhyb3cgbmV3IEVycm9yKGAke3RhZ25hbWV9IG5vdCBkZWZpbmVkYCk7XG5sZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4vL1RPRE86IGZhY3Rvcml6ZS4uLlxuXG4vLyBGaXggaXNzdWUgIzJcbmlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG5lbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG5pZiggaWQgIT09IHVuZGVmaW5lZCApXG5lbGVtLmlkID0gaWQ7XG5cbmlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG5lbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbmZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbmZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG5sZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbmlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuZWxzZVxuZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufVxuXG5mb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG5sZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuaWYoIHZhbHVlID09PSBmYWxzZSlcbmRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG5lbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbmVsc2VcbmVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xufVxuXG5pZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbmNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbmZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG5lbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbnBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbmlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxuTElTUy5pbml0aWFsaXplU3luYyhlbGVtKTtcblxucmV0dXJuIExJU1MuZ2V0TElTU1N5bmMoZWxlbSk7XG59XG5MSVNTLmJ1aWxkU3luYyA9IGJ1aWxkU3luYztcbiovIiwiXG5pbXBvcnQgeyBDb25zdHJ1Y3RvciB9IGZyb20gXCJ0eXBlc1wiO1xuXG50eXBlIExpc3RlbmVyRmN0PFQgZXh0ZW5kcyBFdmVudD4gPSAoZXY6IFQpID0+IHZvaWQ7XG50eXBlIExpc3RlbmVyT2JqPFQgZXh0ZW5kcyBFdmVudD4gPSB7IGhhbmRsZUV2ZW50OiBMaXN0ZW5lckZjdDxUPiB9O1xudHlwZSBMaXN0ZW5lcjxUIGV4dGVuZHMgRXZlbnQ+ID0gTGlzdGVuZXJGY3Q8VD58TGlzdGVuZXJPYmo8VD47XG5cbmV4cG9ydCBjbGFzcyBFdmVudFRhcmdldDI8RXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgRXZlbnQ+PiBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcblxuXHRvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgY2FsbGJhY2s6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIG9wdGlvbnM/OiBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyB8IGJvb2xlYW4pOiB2b2lkIHtcblx0XHRcblx0XHQvL0B0cy1pZ25vcmVcblx0XHRyZXR1cm4gc3VwZXIuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cdH1cblxuXHRvdmVycmlkZSBkaXNwYXRjaEV2ZW50PFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KGV2ZW50OiBFdmVudHNbVF0pOiBib29sZWFuIHtcblx0XHRyZXR1cm4gc3VwZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH1cblxuXHRvdmVycmlkZSByZW1vdmVFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IGxpc3RlbmVyOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgb3B0aW9ucz86IGJvb2xlYW58QWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkIHtcblxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHN1cGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21FdmVudDI8VCBleHRlbmRzIHN0cmluZywgQXJncz4gZXh0ZW5kcyBDdXN0b21FdmVudDxBcmdzPiB7XG5cblx0Y29uc3RydWN0b3IodHlwZTogVCwgYXJnczogQXJncykge1xuXHRcdHN1cGVyKHR5cGUsIHtkZXRhaWw6IGFyZ3N9KTtcblx0fVxuXG5cdG92ZXJyaWRlIGdldCB0eXBlKCk6IFQgeyByZXR1cm4gc3VwZXIudHlwZSBhcyBUOyB9XG59XG5cbnR5cGUgSW5zdGFuY2VzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+PiA9IHtcblx0W0sgaW4ga2V5b2YgVF06IEluc3RhbmNlVHlwZTxUW0tdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gV2l0aEV2ZW50czxUIGV4dGVuZHMgb2JqZWN0LCBFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+ID4oZXY6IENvbnN0cnVjdG9yPFQ+LCBfZXZlbnRzOiBFdmVudHMpIHtcblxuXHR0eXBlIEV2dHMgPSBJbnN0YW5jZXM8RXZlbnRzPjtcblxuXHRpZiggISAoZXYgaW5zdGFuY2VvZiBFdmVudFRhcmdldCkgKVxuXHRcdHJldHVybiBldiBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG5cblx0Ly8gaXMgYWxzbyBhIG1peGluXG5cdC8vIEB0cy1pZ25vcmVcblx0Y2xhc3MgRXZlbnRUYXJnZXRNaXhpbnMgZXh0ZW5kcyBldiB7XG5cblx0XHQjZXYgPSBuZXcgRXZlbnRUYXJnZXQyPEV2dHM+KCk7XG5cblx0XHRhZGRFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5hZGRFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRyZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5yZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRkaXNwYXRjaEV2ZW50KC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5kaXNwYXRjaEV2ZW50KC4uLmFyZ3MpO1xuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIEV2ZW50VGFyZ2V0TWl4aW5zIGFzIHVua25vd24gYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIFNoYWRvd1Jvb3QgdG9vbHMgPT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50TWF0Y2hlcyhldjogRXZlbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcblxuXHRsZXQgZWxlbWVudHMgPSBldi5jb21wb3NlZFBhdGgoKS5zbGljZSgwLC0yKS5maWx0ZXIoZSA9PiAhIChlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgKS5yZXZlcnNlKCkgYXMgSFRNTEVsZW1lbnRbXTtcblxuXHRmb3IobGV0IGVsZW0gb2YgZWxlbWVudHMgKVxuXHRcdGlmKGVsZW0ubWF0Y2hlcyhzZWxlY3RvcikgKVxuXHRcdFx0cmV0dXJuIGVsZW07IFxuXG5cdHJldHVybiBudWxsO1xufSIsIlxuaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGluaXRpYWxpemVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQgfSBmcm9tIFwiLi4vc3RhdGVcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudHMge307XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgLy8gYXN5bmNcbiAgICAgICAgcXMgOiB0eXBlb2YgcXM7XG4gICAgICAgIHFzbzogdHlwZW9mIHFzbztcbiAgICAgICAgcXNhOiB0eXBlb2YgcXNhO1xuICAgICAgICBxc2M6IHR5cGVvZiBxc2M7XG5cbiAgICAgICAgLy8gc3luY1xuICAgICAgICBxc1N5bmMgOiB0eXBlb2YgcXNTeW5jO1xuICAgICAgICBxc2FTeW5jOiB0eXBlb2YgcXNhU3luYztcbiAgICAgICAgcXNjU3luYzogdHlwZW9mIHFzY1N5bmM7XG5cblx0XHRjbG9zZXN0OiB0eXBlb2YgY2xvc2VzdDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3Nfc2VsZWN0b3IobmFtZT86IHN0cmluZykge1xuXHRpZihuYW1lID09PSB1bmRlZmluZWQpIC8vIGp1c3QgYW4gaDRja1xuXHRcdHJldHVybiBcIlwiO1xuXHRyZXR1cm4gYDppcygke25hbWV9LCBbaXM9XCIke25hbWV9XCJdKWA7XG59XG5cbmZ1bmN0aW9uIF9idWlsZFFTKHNlbGVjdG9yOiBzdHJpbmcsIHRhZ25hbWVfb3JfcGFyZW50Pzogc3RyaW5nIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LCBwYXJlbnQ6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cdFxuXHRpZiggdGFnbmFtZV9vcl9wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGFnbmFtZV9vcl9wYXJlbnQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cGFyZW50ID0gdGFnbmFtZV9vcl9wYXJlbnQ7XG5cdFx0dGFnbmFtZV9vcl9wYXJlbnQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRyZXR1cm4gW2Ake3NlbGVjdG9yfSR7bGlzc19zZWxlY3Rvcih0YWduYW1lX29yX3BhcmVudCBhcyBzdHJpbmd8dW5kZWZpbmVkKX1gLCBwYXJlbnRdIGFzIGNvbnN0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxczxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0bGV0IHJlc3VsdCA9IGF3YWl0IHFzbzxUPihzZWxlY3RvciwgcGFyZW50KTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gcmVzdWx0IVxufVxuXG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VFtdPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXVtdID47XG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPFQ+PiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRwcm9taXNlc1tpZHgrK10gPSB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPihyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG59XG5cbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUW107XG5mdW5jdGlvbiBxc2FTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dW107XG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogVDtcbmZ1bmN0aW9uIHFzY1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KHJlc3VsdCk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjbG9zZXN0PEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50KSB7XG5cblx0d2hpbGUodHJ1ZSkge1xuXHRcdHZhciByZXN1bHQgPSBlbGVtZW50LmNsb3Nlc3Q8RT4oc2VsZWN0b3IpO1xuXG5cdFx0aWYoIHJlc3VsdCAhPT0gbnVsbClcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuXHRcdGlmKCAhIChcImhvc3RcIiBpbiByb290KSApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGVsZW1lbnQgPSAocm9vdCBhcyBTaGFkb3dSb290KS5ob3N0O1xuXHR9XG59XG5cblxuLy8gYXN5bmNcbkxJU1MucXMgID0gcXM7XG5MSVNTLnFzbyA9IHFzbztcbkxJU1MucXNhID0gcXNhO1xuTElTUy5xc2MgPSBxc2M7XG5cbi8vIHN5bmNcbkxJU1MucXNTeW5jICA9IHFzU3luYztcbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG5MSVNTLmNsb3Nlc3QgPSBjbG9zZXN0OyIsImltcG9ydCB0eXBlIHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IGdldEhvc3RDc3RyLCBnZXROYW1lIH0gZnJvbSBcIi4vY3VzdG9tUmVnaXN0ZXJ5XCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZW51bSBTdGF0ZSB7XG4gICAgTk9ORSA9IDAsXG5cbiAgICAvLyBjbGFzc1xuICAgIERFRklORUQgPSAxIDw8IDAsXG4gICAgUkVBRFkgICA9IDEgPDwgMSxcblxuICAgIC8vIGluc3RhbmNlXG4gICAgVVBHUkFERUQgICAgPSAxIDw8IDIsXG4gICAgSU5JVElBTElaRUQgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCBjb25zdCBERUZJTkVEICAgICA9IFN0YXRlLkRFRklORUQ7XG5leHBvcnQgY29uc3QgUkVBRFkgICAgICAgPSBTdGF0ZS5SRUFEWTtcbmV4cG9ydCBjb25zdCBVUEdSQURFRCAgICA9IFN0YXRlLlVQR1JBREVEO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVEID0gU3RhdGUuSU5JVElBTElaRUQ7XG5cbmV4cG9ydCBjbGFzcyBMSVNTU3RhdGUge1xuXG4gICAgI2VsZW06IEhUTUxFbGVtZW50fG51bGw7XG5cbiAgICAvLyBpZiBudWxsIDogY2xhc3Mgc3RhdGUsIGVsc2UgaW5zdGFuY2Ugc3RhdGVcbiAgICBjb25zdHJ1Y3RvcihlbGVtOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbCkge1xuICAgICAgICB0aGlzLiNlbGVtID0gZWxlbTtcbiAgICB9XG5cbiAgICBzdGF0aWMgREVGSU5FRCAgICAgPSBERUZJTkVEO1xuICAgIHN0YXRpYyBSRUFEWSAgICAgICA9IFJFQURZO1xuICAgIHN0YXRpYyBVUEdSQURFRCAgICA9IFVQR1JBREVEO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFRCA9IElOSVRJQUxJWkVEO1xuXG4gICAgaXMoc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgICAgICYmICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSAgICAgICAmJiAhIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEICAgICYmICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgJiYgISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBsZXQgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxhbnk+PigpO1xuICAgIFxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkRlZmluZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5SZWFkeSgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblVwZ3JhZGVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuSW5pdGlhbGl6ZWQoKSApO1xuICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IERFRklORUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNEZWZpbmVkKCkge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KCBnZXROYW1lKHRoaXMuI2VsZW0pICkgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBSRUFEWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1JlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyKGdldE5hbWUoZWxlbSkpO1xuXG4gICAgICAgIGlmKCAhIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gSG9zdC5pc0RlcHNSZXNvbHZlZDtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTsgLy8gY291bGQgYmUgcmVhZHkgYmVmb3JlIGRlZmluZWQsIGJ1dCB3ZWxsLi4uXG5cbiAgICAgICAgYXdhaXQgd2hlbkRPTUNvbnRlbnRMb2FkZWQ7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuRGVwc1Jlc29sdmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gVVBHUkFERUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNVcGdyYWRlZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgY29uc3QgaG9zdCA9IGdldEhvc3RDc3RyKGdldE5hbWUoZWxlbSkpO1xuICAgICAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIGhvc3Q7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTtcbiAgICBcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBob3N0KVxuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICBcbiAgICAgICAgLy8gaDRja1xuICAgIFxuICAgICAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgXG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcblxuICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBJTklUSUFMSVpFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0luaXRpYWxpemVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIFwiaXNJbml0aWFsaXplZFwiIGluIGVsZW0gJiYgZWxlbS5pc0luaXRpYWxpemVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPigpIHtcbiAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuVXBncmFkZWQoKTtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZDtcblxuICAgICAgICByZXR1cm4gKGVsZW0gYXMgTElTU0hvc3Q8VD4pLmJhc2UgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gQ09OVkVSU0lPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICB2YWx1ZU9mKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBsZXQgc3RhdGU6IFN0YXRlID0gMDtcbiAgICBcbiAgICAgICAgaWYoIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IERFRklORUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgc3RhdGUgfD0gUkVBRFk7XG4gICAgICAgIGlmKCB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gVVBHUkFERUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gSU5JVElBTElaRUQ7XG4gICAgXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMudmFsdWVPZigpO1xuICAgICAgICBsZXQgaXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIkRFRklORURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJSRUFEWVwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIlVQR1JBREVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiSU5JVElBTElaRURcIik7XG4gICAgXG4gICAgICAgIHJldHVybiBpcy5qb2luKCd8Jyk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUoZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiggXCJzdGF0ZVwiIGluIGVsZW0pXG4gICAgICAgIHJldHVybiBlbGVtLnN0YXRlIGFzIExJU1NTdGF0ZTtcbiAgICBcbiAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5zdGF0ZSA9IG5ldyBMSVNTU3RhdGUoZWxlbSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PSBTdGF0ZSBtb2RpZmllcnMgKG1vdmU/KSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gR28gdG8gc3RhdGUgVVBHUkFERURcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGdyYWRlPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuRGVmaW5lZCgpO1xuXG4gICAgcmV0dXJuIHVwZ3JhZGVTeW5jPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBncmFkZVN5bmM8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFQge1xuICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcbiAgICBcbiAgICBpZiggISBzdGF0ZS5pc0RlZmluZWQgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IGRlZmluZWQhJyk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyKGdldE5hbWUoZWxlbSkpO1xuXG4gICAgaWYoICEgKGVsZW0gaW5zdGFuY2VvZiBIb3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBkaWRuJ3QgdXBncmFkZSFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIFQ7XG59XG5cbi8vIEdvIHRvIHN0YXRlIElOSVRJQUxJWkVEXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58YW55W10gPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UgKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuUmVhZHkoKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IFtdIDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZSguLi5wYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58YW55W10gPSBmYWxzZSk6IFQge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UpXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBzdGF0ZS5pc1JlYWR5IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IFtdIDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZSguLi5wYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PSBleHRlcm5hbCBXSEVOID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCB1cGdyYWRlKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlblVwZ3JhZGVkPFQ+KCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IsIHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCJDb250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwic3RhdGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCcsXG4gICAgU0VNSU9QRU49ICdzZW1pLW9wZW4nXG59O1xuXG4vL1RPRE86IGltcGxlbWVudCA/XG5leHBvcnQgZW51bSBMaWZlQ3ljbGUge1xuICAgIERFRkFVTFQgICAgICAgICAgICAgICAgICAgPSAwLFxuXHQvLyBub3QgaW1wbGVtZW50ZWQgeWV0XG4gICAgSU5JVF9BRlRFUl9DSElMRFJFTiAgICAgICA9IDEgPDwgMSxcbiAgICBJTklUX0FGVEVSX1BBUkVOVCAgICAgICAgID0gMSA8PCAyLFxuICAgIC8vIHF1aWQgcGFyYW1zL2F0dHJzID9cbiAgICBSRUNSRUFURV9BRlRFUl9DT05ORUNUSU9OID0gMSA8PCAzLCAvKiByZXF1aXJlcyByZWJ1aWxkIGNvbnRlbnQgKyBkZXN0cm95L2Rpc3Bvc2Ugd2hlbiByZW1vdmVkIGZyb20gRE9NICovXG4gICAgLyogc2xlZXAgd2hlbiBkaXNjbyA6IHlvdSBuZWVkIHRvIGltcGxlbWVudCBpdCB5b3Vyc2VsZiAqL1xufVxuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSB7XG4gICAgICAgIGV4dGVuZHM6IEV4dGVuZHNDdHIsIC8vIEpTIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsICAgLy8gSFRNTCBIb3N0XG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbn0gJiBDb250ZW50R2VuZXJhdG9yX09wdHM7XG5cbi8vIExJU1NCYXNlXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IEluc3RhbmNlVHlwZTxMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VCBleHRlbmRzIExJU1NCYXNlPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZTxcbiAgICAgICAgICAgIGluZmVyIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgID4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLEhvc3RDc3RyPiA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0ciA9IExJU1NCYXNlPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NCYXNlID8gTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHIgPSBMSVNTQmFzZT4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjtcblxuLy8gbGlnaHRlciBMSVNTSG9zdCBkZWYgdG8gYXZvaWQgdHlwZSBpc3N1ZXMuLi5cbmV4cG9ydCB0eXBlIExIb3N0PEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA9IHtcblxuICAgIHN0YXRlICA6IExJU1NTdGF0ZTtcbiAgICBjb250ZW50OiBTaGFkb3dSb290fEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICBzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIENTU1NlbGVjdG9yOiBzdHJpbmc7XG5cbn0gJiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5leHBvcnQgdHlwZSBMSG9zdENzdHI8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuICAgIG5ldyguLi5hcmdzOiBhbnkpOiBMSG9zdDxIb3N0Q3N0cj47XG5cbiAgICBDZmc6IHtcbiAgICAgICAgaG9zdCAgICAgICAgICAgICA6IEhvc3RDc3RyLFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG4gICAgICAgIGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcbiAgICB9XG5cbiAgICBzdGF0ZSAgOiBMSVNTU3RhdGU7XG5cbn0gJiBIb3N0Q3N0cjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cbiAgICBpZiggQ2xhc3MgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgQ2xhc3MgPSBDbGFzcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgSFRNTEVsZW1lbnQ7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cbiAgICBsZXQgY3Vyc29yID0gQ2xhc3M7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdoaWxlIChjdXJzb3IuX19wcm90b19fICE9PSBIVE1MRWxlbWVudClcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjdXJzb3IgPSBjdXJzb3IuX19wcm90b19fO1xuXG4gICAgLy8gZGlyZWN0bHkgaW5oZXJpdCBIVE1MRWxlbWVudFxuICAgIGlmKCAhIGN1cnNvci5uYW1lLnN0YXJ0c1dpdGgoJ0hUTUwnKSAmJiAhIGN1cnNvci5uYW1lLmVuZHNXaXRoKCdFbGVtZW50JykgKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGh0bWx0YWcgPSBjdXJzb3IubmFtZS5zbGljZSg0LCAtNyk7XG5cblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IEhUTUxFbGVtZW50IHwgdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgY29uc3Qgd2hlbkRPTUNvbnRlbnRMb2FkZWQgPSB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdERPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuLypcbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlclxuKi9cblxuLy8gbW92ZWQgaGVyZSBpbnN0ZWFkIG9mIGJ1aWxkIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwcy5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbmltcG9ydCBcIi4vY29yZS9zdGF0ZVwiO1xuaW1wb3J0IFwiLi9jb3JlL2N1c3RvbVJlZ2lzdGVyeVwiO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vL1RPRE86IEJMSVNTXG5cbi8vVE9ETzogZXZlbnRzLnRzXG4vL1RPRE86IGdsb2JhbENTU1J1bGVzXG5leHBvcnQge0xJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL2hlbHBlcnMvTElTU0F1dG9cIjtcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge1NoYWRvd0NmZ30gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHtsaXNzLCBsaXNzU3luY30gZnJvbSBcIi4vaGVscGVycy9idWlsZFwiO1xuZXhwb3J0IHtldmVudE1hdGNoZXMsIFdpdGhFdmVudHMsIEV2ZW50VGFyZ2V0MiwgQ3VzdG9tRXZlbnQyfSBmcm9tICcuL2hlbHBlcnMvZXZlbnRzJztcbmV4cG9ydCB7aHRtbH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7XG5cbi8vIGZvciBkZWJ1Zy5cbmV4cG9ydCB7X2V4dGVuZHN9IGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IHsgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjsiXSwibmFtZXMiOlsiZ2V0U2hhcmVkQ1NTIiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzRE9NQ29udGVudExvYWRlZCIsImlzU2hhZG93U3VwcG9ydGVkIiwid2FpdERPTUNvbnRlbnRMb2FkZWQiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJzaGFyZWRDU1MiLCJDb250ZW50R2VuZXJhdG9yIiwiY29uc3RydWN0b3IiLCJodG1sIiwiY3NzIiwic2hhZG93IiwicHJlcGFyZUhUTUwiLCJwcmVwYXJlQ1NTIiwiaXNSZWFkeSIsIndoZW5SZWFkeSIsImdlbmVyYXRlIiwiaG9zdCIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsInRhcmdldCIsImluaXRTaGFkb3ciLCJpbmplY3RDU1MiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwicmVwbGFjZUNoaWxkcmVuIiwiU2hhZG93Um9vdCIsImNoaWxkTm9kZXMiLCJsZW5ndGgiLCJhcHBlbmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjYW5IYXZlU2hhZG93IiwiTk9ORSIsIkVycm9yIiwibW9kZSIsIlNFTUlPUEVOIiwic2hhZG93TW9kZSIsIk9QRU4iLCJhdHRhY2hTaGFkb3ciLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJlIiwicHJvY2Vzc0NTUyIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwidGVtcGxhdGUiLCJ1bmRlZmluZWQiLCJzdHIiLCJ0cmltIiwiaW5uZXJIVE1MIiwiSFRNTEVsZW1lbnQiLCJzdHlsZXNoZWV0cyIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsInB1c2giLCJjc3NzZWxlY3RvciIsIkNTU1NlbGVjdG9yIiwiaGFzIiwic2V0QXR0cmlidXRlIiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJyZXBsYWNlIiwiaGVhZCIsImFkZCIsImJ1aWxkTElTU0hvc3QiLCJzZXRDc3RyQmFzZSIsIl9fY3N0cl9ob3N0Iiwic2V0Q3N0ckhvc3QiLCJfIiwiTElTUyIsImFyZ3MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJjb250ZW50X2dlbmVyYXRvciIsIkxJU1NCYXNlIiwiSG9zdCIsInN0YXRlIiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwibmFtZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJjb25uZWN0ZWRDYWxsYmFjayIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiaXNDb25uZWN0ZWQiLCJfSG9zdCIsIkxJU1NTdGF0ZSIsImlkIiwiX19jc3RyX2Jhc2UiLCJMaXNzIiwiaG9zdENzdHIiLCJjb250ZW50X2dlbmVyYXRvcl9jc3RyIiwiTElTU0hvc3QiLCJDZmciLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJCYXNlIiwiYmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwicGFyYW1zIiwiaW5pdCIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInByb21pc2UiLCJyZXNvbHZlIiwiUHJvbWlzZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsInNoYWRvd1Jvb3QiLCJkZWZpbmUiLCJnZXRCYXNlQ3N0ciIsImdldEhvc3RDc3RyIiwiZ2V0TmFtZSIsImlzRGVmaW5lZCIsIndoZW5BbGxEZWZpbmVkIiwid2hlbkRlZmluZWQiLCJnZXRTdGF0ZSIsImluaXRpYWxpemVTeW5jIiwidXBncmFkZVN5bmMiLCJ3aGVuVXBncmFkZWQiLCJERUZJTkVEIiwiUkVBRFkiLCJVUEdSQURFRCIsIklOSVRJQUxJWkVEIiwieCIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsIkNsYXNzIiwiaHRtbHRhZyIsIkxJU1NjbGFzcyIsIm9wdHMiLCJ0YWduYW1lcyIsImFsbCIsInQiLCJnZXQiLCJlbGVtZW50IiwiRWxlbWVudCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJfTElTUyIsIklMSVNTIiwiY2ZnIiwiYXNzaWduIiwiRXh0ZW5kZWRMSVNTIiwic2NyaXB0IiwiUkVTU09VUkNFUyIsIktub3duVGFncyIsIlNXIiwic3dfcGF0aCIsImNvbnNvbGUiLCJ3YXJuIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic2NvcGUiLCJlcnJvciIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50c19kaXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJhZGRUYWciLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImVsZW0iLCJ0YWciLCJmaWxlbmFtZXMiLCJyZXNvdXJjZXMiLCJmaWxlIiwiZmlsZV9wYXRoIiwiZW5kc1dpdGgiLCJfaW1wb3J0IiwiX2ZldGNoVGV4dCIsImZpbGVzIiwiaSIsImRlZmluZVdlYkNvbXBvbmVudCIsImpzIiwia2xhc3MiLCJMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yIiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsInRleHQiLCJkZWZhdWx0IiwibG9nIiwicmVwbGFjZUFsbCIsInZhbHVlcyIsInZhbHVlIiwidGV4dENvbnRlbnQiLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImZpbHRlciIsInN0YXJ0c1dpdGgiLCJjc3NfYXR0ciIsInNldFByb3BlcnR5Iiwic2xpY2UiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJ0eXBlIiwiY2FsbGJhY2siLCJkaXNwYXRjaEV2ZW50IiwiZXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJDdXN0b21FdmVudDIiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIldpdGhFdmVudHMiLCJldiIsIl9ldmVudHMiLCJFdmVudFRhcmdldE1peGlucyIsImV2ZW50TWF0Y2hlcyIsInNlbGVjdG9yIiwiZWxlbWVudHMiLCJjb21wb3NlZFBhdGgiLCJyZXZlcnNlIiwibWF0Y2hlcyIsImxpc3Nfc2VsZWN0b3IiLCJfYnVpbGRRUyIsInRhZ25hbWVfb3JfcGFyZW50IiwicGFyZW50IiwicXMiLCJyZXN1bHQiLCJxc28iLCJxc2EiLCJpZHgiLCJwcm9taXNlcyIsInFzYyIsInJlcyIsImNsb3Nlc3QiLCJxc1N5bmMiLCJxc2FTeW5jIiwicXNjU3luYyIsInJvb3QiLCJnZXRSb290Tm9kZSIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiU3RhdGUiLCJpcyIsImlzVXBncmFkZWQiLCJ3aGVuIiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJzdHJpY3QiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZm9yY2UiLCJMaWZlQ3ljbGUiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiY3Vyc29yIiwiX19wcm90b19fIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImZpcnN0Q2hpbGQiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiXSwic291cmNlUm9vdCI6IiJ9