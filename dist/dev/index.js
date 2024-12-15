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
        this.#whenReady = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.whenDOMContentLoaded)();
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
/* harmony import */ var _LISSControler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSControler */ "./src/LISSControler.ts");
/* harmony import */ var LifeCycle_states__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! LifeCycle/states */ "./src/LifeCycle/states.ts");


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
        //TODO: get real TS type ?
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
        #internals = this.attachInternals();
        #states = this.#internals.states;
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
            this.#states.add(LifeCycle_states__WEBPACK_IMPORTED_MODULE_1__.States.LISS_UPGRADED);
            content_generator.whenReady().then(()=>{
                this.#states.add(LifeCycle_states__WEBPACK_IMPORTED_MODULE_1__.States.LISS_READY);
            });
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
            // TODO: instance deps
            if (content_generator.isReady) {
                this.initialize(); // automatically calls onDOMConnected
                return;
            }
            (async ()=>{
                await content_generator.whenReady();
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
                (0,_LISSControler__WEBPACK_IMPORTED_MODULE_0__.setCstrHost)(this);
                this.#controler = new LISSHost.Controler(...this.#params);
            }
            this.#states.add(LifeCycle_states__WEBPACK_IMPORTED_MODULE_1__.States.LISS_INITIALIZED);
            this.#whenInitialized_resolver(this.controler);
            return this.controler;
        }
    }
    ;
    return LISSHost;
}


/***/ }),

/***/ "./src/LifeCycle/DEFINED.ts":
/*!**********************************!*\
  !*** ./src/LifeCycle/DEFINED.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   define: () => (/* binding */ define),
/* harmony export */   getHostCstr: () => (/* binding */ getHostCstr),
/* harmony export */   getHostCstrSync: () => (/* binding */ getHostCstrSync),
/* harmony export */   getName: () => (/* binding */ getName),
/* harmony export */   isDefined: () => (/* binding */ isDefined),
/* harmony export */   whenDefined: () => (/* binding */ whenDefined)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");

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
    console.warn("define", tagname);
    customElements.define(tagname, Host, opts);
}
function getName(element) {
    // instance
    if ("host" in element) element = element.host;
    if (element instanceof Element) {
        const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
        if (!name.includes('-')) throw new Error(`${name} is not a WebComponent`);
        return name;
    }
    // cstr
    if ("Host" in element) element = element.Host;
    const name = customElements.getName(element);
    if (name === null) throw new Error("Element is not defined!");
    return name;
}
function isDefined(elem) {
    if (elem instanceof HTMLElement) elem = getName(elem);
    if (typeof elem === "string") return customElements.get(elem) !== undefined;
    if ("Host" in elem) elem = elem.Host;
    return customElements.getName(elem) !== null;
}
async function whenDefined(elem) {
    if (elem instanceof HTMLElement) elem = getName(elem);
    if (typeof elem === "string") {
        await customElements.whenDefined(elem);
        return customElements.get(elem);
    }
    // TODO: listen define...
    throw new Error("Not implemented yet");
}
/*
// TODO: implement
export async function whenAllDefined(tagnames: readonly string[]) : Promise<void> {
	await Promise.all( tagnames.map( t => customElements.whenDefined(t) ) )
}
*/ function getHostCstr(elem) {
    // we can't force a define.
    return whenDefined(elem);
}
function getHostCstrSync(elem) {
    if (elem instanceof HTMLElement) elem = getName(elem);
    if (typeof elem === "string") {
        let host = customElements.get(elem);
        if (host === undefined) throw new Error(`${elem} not defined yet!`);
        return host;
    }
    if ("Host" in elem) elem = elem.Host;
    if (customElements.getName(elem) === null) throw new Error(`${elem} not defined yet!`);
    return elem;
}


/***/ }),

/***/ "./src/LifeCycle/INITIALIZED.ts":
/*!**************************************!*\
  !*** ./src/LifeCycle/INITIALIZED.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getControler: () => (/* binding */ getControler),
/* harmony export */   getControlerSync: () => (/* binding */ getControlerSync),
/* harmony export */   initialize: () => (/* binding */ initialize),
/* harmony export */   initializeSync: () => (/* binding */ initializeSync),
/* harmony export */   isInitialized: () => (/* binding */ isInitialized),
/* harmony export */   whenInitialized: () => (/* binding */ whenInitialized)
/* harmony export */ });
/* harmony import */ var _UPGRADED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UPGRADED */ "./src/LifeCycle/UPGRADED.ts");
/* harmony import */ var _READY__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./READY */ "./src/LifeCycle/READY.ts");


function isInitialized(elem) {
    if (!(0,_UPGRADED__WEBPACK_IMPORTED_MODULE_0__.isUpgraded)(elem)) return false;
    return elem.isInitialized;
}
async function whenInitialized(elem) {
    const host = await (0,_UPGRADED__WEBPACK_IMPORTED_MODULE_0__.whenUpgraded)(elem);
    return await host.whenInitialized;
}
async function getControler(elem) {
    const host = await (0,_UPGRADED__WEBPACK_IMPORTED_MODULE_0__.upgrade)(elem);
    await (0,_READY__WEBPACK_IMPORTED_MODULE_1__.whenReady)(host);
    //TODO: initializeSync vs initialize ?
    return host.initialize();
}
function getControlerSync(elem) {
    const host = (0,_UPGRADED__WEBPACK_IMPORTED_MODULE_0__.upgradeSync)(elem);
    if (!(0,_READY__WEBPACK_IMPORTED_MODULE_1__.isReady)(host)) throw new Error("Dependancies not ready !");
    return host.initialize();
}
const initialize = getControler;
const initializeSync = getControlerSync;


/***/ }),

/***/ "./src/LifeCycle/READY.ts":
/*!********************************!*\
  !*** ./src/LifeCycle/READY.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getControlerCstr: () => (/* binding */ getControlerCstr),
/* harmony export */   getControlerCstrSync: () => (/* binding */ getControlerCstrSync),
/* harmony export */   isReady: () => (/* binding */ isReady),
/* harmony export */   whenReady: () => (/* binding */ whenReady)
/* harmony export */ });
/* harmony import */ var _DEFINED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DEFINED */ "./src/LifeCycle/DEFINED.ts");

function isReady(elem) {
    if (!(0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.isDefined)(elem)) return false;
    const hostCstr = (0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.getHostCstrSync)(elem);
    return hostCstr.isDepsResolved;
}
async function whenReady(elem) {
    const hostCstr = await (0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.whenDefined)(elem);
    await hostCstr.whenDepsResolved;
    return hostCstr.Controler;
}
function getControlerCstr(elem) {
    // we can't force a ready.
    return whenReady(elem);
}
function getControlerCstrSync(elem) {
    if (!isReady(elem)) throw new Error("Element not ready !");
    return (0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.getHostCstrSync)(elem).Controler;
}


/***/ }),

/***/ "./src/LifeCycle/UPGRADED.ts":
/*!***********************************!*\
  !*** ./src/LifeCycle/UPGRADED.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHost: () => (/* binding */ getHost),
/* harmony export */   getHostSync: () => (/* binding */ getHostSync),
/* harmony export */   isUpgraded: () => (/* binding */ isUpgraded),
/* harmony export */   upgrade: () => (/* binding */ upgrade),
/* harmony export */   upgradeSync: () => (/* binding */ upgradeSync),
/* harmony export */   whenUpgraded: () => (/* binding */ whenUpgraded)
/* harmony export */ });
/* harmony import */ var _DEFINED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DEFINED */ "./src/LifeCycle/DEFINED.ts");

//TODO: upgrade function...
function isUpgraded(elem) {
    if (!(0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.isDefined)(elem)) return false;
    const Host = (0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.getHostCstrSync)(elem);
    return elem instanceof Host;
}
async function whenUpgraded(elem) {
    const Host = await (0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.whenDefined)(elem);
    // already upgraded
    if (elem instanceof Host) return elem;
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
async function getHost(elem) {
    await (0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.whenDefined)(elem);
    if (elem.ownerDocument !== document) document.adoptNode(elem);
    customElements.upgrade(elem);
    return elem;
}
function getHostSync(elem) {
    if (!(0,_DEFINED__WEBPACK_IMPORTED_MODULE_0__.isDefined)(elem)) throw new Error("Element not defined !");
    if (elem.ownerDocument !== document) document.adoptNode(elem);
    customElements.upgrade(elem);
    return elem;
}
const upgrade = getHost;
const upgradeSync = getHostSync;


/***/ }),

/***/ "./src/LifeCycle/states.ts":
/*!*********************************!*\
  !*** ./src/LifeCycle/states.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   States: () => (/* binding */ States)
/* harmony export */ });
var States = /*#__PURE__*/ function(States) {
    States["LISS_DEFINED"] = "LISS_DEFINED";
    States["LISS_UPGRADED"] = "LISS_UPGRADED";
    States["LISS_READY"] = "LISS_READY";
    States["LISS_INITIALIZED"] = "LISS_INITIALIZED";
    return States;
}({});


/***/ }),

/***/ "./src/core/LifeCycle.ts":
/*!*******************************!*\
  !*** ./src/core/LifeCycle.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");
/* harmony import */ var _LifeCycle_states_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LifeCycle/states.ts */ "./src/LifeCycle/states.ts");
/* harmony import */ var _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LifeCycle/DEFINED */ "./src/LifeCycle/DEFINED.ts");
/* harmony import */ var _LifeCycle_READY__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../LifeCycle/READY */ "./src/LifeCycle/READY.ts");
/* harmony import */ var _LifeCycle_UPGRADED__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../LifeCycle/UPGRADED */ "./src/LifeCycle/UPGRADED.ts");
/* harmony import */ var _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../LifeCycle/INITIALIZED */ "./src/LifeCycle/INITIALIZED.ts");


_extends__WEBPACK_IMPORTED_MODULE_0__["default"].States = _LifeCycle_states_ts__WEBPACK_IMPORTED_MODULE_1__.States;

_extends__WEBPACK_IMPORTED_MODULE_0__["default"].define = _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.define;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getName = _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.getName;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].isDefined = _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.isDefined;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].whenDefined = _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.whenDefined;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getHostCstr = _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.getHostCstr;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getHostCstrSync = _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.getHostCstrSync;
//LISS.whenAllDefined = whenAllDefined;

_extends__WEBPACK_IMPORTED_MODULE_0__["default"].isReady = _LifeCycle_READY__WEBPACK_IMPORTED_MODULE_3__.isReady;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].whenReady = _LifeCycle_READY__WEBPACK_IMPORTED_MODULE_3__.whenReady;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getControlerCstr = _LifeCycle_READY__WEBPACK_IMPORTED_MODULE_3__.getControlerCstr;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getControlerCstrSync = _LifeCycle_READY__WEBPACK_IMPORTED_MODULE_3__.getControlerCstrSync;

_extends__WEBPACK_IMPORTED_MODULE_0__["default"].isUpgraded = _LifeCycle_UPGRADED__WEBPACK_IMPORTED_MODULE_4__.isUpgraded;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].whenUpgraded = _LifeCycle_UPGRADED__WEBPACK_IMPORTED_MODULE_4__.whenUpgraded;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].upgrade = _LifeCycle_UPGRADED__WEBPACK_IMPORTED_MODULE_4__.upgrade;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].upgradeSync = _LifeCycle_UPGRADED__WEBPACK_IMPORTED_MODULE_4__.upgradeSync;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getHost = _LifeCycle_UPGRADED__WEBPACK_IMPORTED_MODULE_4__.getHost;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getHostSync = _LifeCycle_UPGRADED__WEBPACK_IMPORTED_MODULE_4__.getHostSync;

_extends__WEBPACK_IMPORTED_MODULE_0__["default"].isInitialized = _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_5__.isInitialized;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].whenInitialized = _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_5__.whenInitialized;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].initialize = _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_5__.initialize;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].initializeSync = _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_5__.initializeSync;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getControler = _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_5__.getControler;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getControlerSync = _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_5__.getControlerSync;


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
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ContentGenerator */ "./src/ContentGenerator.ts");
/* harmony import */ var LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! LifeCycle/DEFINED */ "./src/LifeCycle/DEFINED.ts");



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
    (0,LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.define)(tagname, klass);
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
class LISSAuto_ContentGenerator extends _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__["default"] {
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
/* harmony import */ var LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! LifeCycle/INITIALIZED */ "./src/LifeCycle/INITIALIZED.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");


async function liss(str, ...args) {
    const elem = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return await (0,LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
}
function lissSync(str, ...args) {
    const elem = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return (0,LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
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
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");
/* harmony import */ var LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! LifeCycle/INITIALIZED */ "./src/LifeCycle/INITIALIZED.ts");


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
    return await (0,LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(element);
}
async function qsa(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const promises = new Array(elements.length);
    for (let element of elements)promises[idx++] = (0,LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(element);
    return await Promise.all(promises);
}
async function qsc(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return await (0,LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(result);
}
function qsSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null) throw new Error(`Element ${selector} not found`);
    return (0,LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(element);
}
function qsaSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const result = new Array(elements.length);
    for (let element of elements)result[idx++] = (0,LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(element);
    return result;
}
function qscSync(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return (0,LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(result);
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
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].qs = qs;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].qso = qso;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].qsa = qsa;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].qsc = qsc;
// sync
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].qsSync = qsSync;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].qsaSync = qsaSync;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].qscSync = qscSync;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].closest = closest;


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShadowCfg: () => (/* binding */ ShadowCfg)
/* harmony export */ });
var ShadowCfg = /*#__PURE__*/ function(ShadowCfg) {
    ShadowCfg["NONE"] = "none";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
    return ShadowCfg;
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
async function whenDOMContentLoaded() {
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
/* harmony export */   ContentGenerator: () => (/* reexport safe */ _ContentGenerator__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   CustomEvent2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_7__.CustomEvent2),
/* harmony export */   EventTarget2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_7__.EventTarget2),
/* harmony export */   LISSAuto_ContentGenerator: () => (/* reexport safe */ _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_3__.LISSAuto_ContentGenerator),
/* harmony export */   ShadowCfg: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_5__.ShadowCfg),
/* harmony export */   WithEvents: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_7__.WithEvents),
/* harmony export */   _extends: () => (/* reexport safe */ _extends__WEBPACK_IMPORTED_MODULE_0__._extends),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   eventMatches: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_7__.eventMatches),
/* harmony export */   html: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_8__.html),
/* harmony export */   liss: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_6__.liss),
/* harmony export */   lissSync: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_6__.lissSync)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extends */ "./src/extends.ts");
/* harmony import */ var _core_LifeCycle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/LifeCycle */ "./src/core/LifeCycle.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ContentGenerator */ "./src/ContentGenerator.ts");
/* harmony import */ var _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/LISSAuto */ "./src/helpers/LISSAuto.ts");
/* harmony import */ var _helpers_querySelectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/querySelectors */ "./src/helpers/querySelectors.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _helpers_build__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/build */ "./src/helpers/build.ts");
/* harmony import */ var _helpers_events__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers/events */ "./src/helpers/events.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQyxNQUFNLEtBQUssS0FBS2IsU0FBU1EsT0FBTyxDQUFDOFEsVUFBVSxDQUFFQyxRQUFRLEtBQUtDLEtBQUtDLFNBQVMsRUFDdEcsT0FBT3pSLFNBQVNRLE9BQU8sQ0FBQzhRLFVBQVU7SUFFcEMsT0FBT3RSLFNBQVNRLE9BQU87QUFDM0I7Ozs7Ozs7U0N4SEE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFFSDtBQUVxQztBQUUvRCxpQkFBaUI7QUFDakIsc0JBQXNCO0FBQ3VDO0FBQzNCO0FBRUE7QUFFYTtBQUN1QztBQUN6RDtBQUM3QixpRUFBZW9ELGdEQUFJQSxFQUFDO0FBRXBCLGFBQWE7QUFDc0I7QUFFbkMsbUNBQW1DO0FBQ25DLGFBQWE7QUFDYjhOLFdBQVc5TixJQUFJLEdBQUdBLGdEQUFJQSIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NDb250cm9sZXIudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xpZmVDeWNsZS9ERUZJTkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTGlmZUN5Y2xlL0lOSVRJQUxJWkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTGlmZUN5Y2xlL1JFQURZLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTGlmZUN5Y2xlL1VQR1JBREVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTGlmZUN5Y2xlL3N0YXRlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2NvcmUvTGlmZUN5Y2xlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTaGFyZWRDU1MgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgTEhvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIGlzU2hhZG93U3VwcG9ydGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbnR5cGUgSFRNTCA9IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nO1xudHlwZSBDU1MgID0gc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudDtcblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge1xuICAgIGh0bWwgICA/OiBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZyxcbiAgICBjc3MgICAgPzogQ1NTIHwgcmVhZG9ubHkgQ1NTW10sXG4gICAgc2hhZG93ID86IFNoYWRvd0NmZ3xudWxsXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JDc3RyID0geyBuZXcob3B0czogQ29udGVudEdlbmVyYXRvcl9PcHRzKTogQ29udGVudEdlbmVyYXRvciB9O1xuXG5jb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgICNzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdO1xuICAgICN0ZW1wbGF0ZSAgIDogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsO1xuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgZGF0YTogYW55O1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRoaXMucHJlcGFyZUhUTUwoaHRtbCk7XG4gICAgXG4gICAgICAgIHRoaXMuI3N0eWxlc2hlZXRzID0gdGhpcy5wcmVwYXJlQ1NTKGNzcyk7XG5cbiAgICAgICAgdGhpcy4jaXNSZWFkeSAgID0gaXNET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIHRoaXMuI3doZW5SZWFkeSA9IHdoZW5ET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgLy9UT0RPOiBvdGhlciBkZXBzLi4uXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFRlbXBsYXRlKHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgI3doZW5SZWFkeTogUHJvbWlzZTx1bmtub3duPjtcbiAgICAjaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lzUmVhZHk7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKCB0aGlzLiNpc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy4jd2hlblJlYWR5O1xuICAgICAgICAvL1RPRE86IGRlcHMuXG4gICAgICAgIC8vVE9ETzogQ1NTL0hUTUwgcmVzb3VyY2VzLi4uXG5cbiAgICAgICAgLy8gaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cbiAgICAgICAgLy8gX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG4gICAgICAgIC8vICsgY2YgYXQgdGhlIGVuZC4uLlxuICAgIH1cblxuICAgIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50fFNoYWRvd1Jvb3Qge1xuXG4gICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi4gICAgIFxuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaW5pdFNoYWRvdyhob3N0KTtcblxuICAgICAgICB0aGlzLmluamVjdENTUyh0YXJnZXQsIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy4jdGVtcGxhdGUhLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBpZiggaG9zdC5zaGFkb3dNb2RlICE9PSBTaGFkb3dDZmcuTk9ORSB8fCB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuICAgICAgICAgICAgdGFyZ2V0LnJlcGxhY2VDaGlsZHJlbihjb250ZW50KTtcblxuICAgICAgICBpZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCAmJiB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApXG5cdFx0XHR0YXJnZXQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGhvc3QpO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTaGFkb3c8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KSB7XG5cbiAgICAgICAgY29uc3QgY2FuSGF2ZVNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpO1xuICAgICAgICBpZiggdGhpcy4jc2hhZG93ICE9PSBudWxsICYmIHRoaXMuI3NoYWRvdyAhPT0gU2hhZG93Q2ZnLk5PTkUgJiYgISBjYW5IYXZlU2hhZG93IClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICAgICAgbGV0IG1vZGUgPSB0aGlzLiNzaGFkb3c7XG4gICAgICAgIGlmKCBtb2RlID09PSBudWxsIClcbiAgICAgICAgICAgIG1vZGUgPSBjYW5IYXZlU2hhZG93ID8gU2hhZG93Q2ZnLk9QRU4gOiBTaGFkb3dDZmcuTk9ORTtcblxuICAgICAgICBob3N0LnNoYWRvd01vZGUgPSBtb2RlO1xuXG4gICAgICAgIGxldCB0YXJnZXQ6IEhvc3R8U2hhZG93Um9vdCA9IGhvc3Q7XG4gICAgICAgIGlmKCBtb2RlICE9PSBTaGFkb3dDZmcuTk9ORSlcbiAgICAgICAgICAgIHRhcmdldCA9IGhvc3QuYXR0YWNoU2hhZG93KHttb2RlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUNTUyhjc3M6IENTU3xyZWFkb25seSBDU1NbXSkge1xuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgcmV0dXJuIGNzcy5tYXAoZSA9PiB0aGlzLnByb2Nlc3NDU1MoZSkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NTUyhjc3M6IENTUykge1xuXG4gICAgICAgIGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG4gICAgICAgICAgICByZXR1cm4gY3NzO1xuICAgICAgICBpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBjc3Muc2hlZXQhO1xuICAgIFxuICAgICAgICBpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1clwiKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUhUTUwoaHRtbD86IEhUTUwpOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGwge1xuICAgIFxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgaWYoaHRtbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgIC8vIHN0cjJodG1sXG4gICAgICAgIGlmKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gaHRtbC50cmltKCk7XG5cbiAgICAgICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBodG1sIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKVxuICAgICAgICAgICAgaHRtbCA9IGh0bWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIHRlbXBsYXRlLmFwcGVuZChodG1sKTtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIGluamVjdENTUzxIb3N0IGV4dGVuZHMgTEhvc3Q+KHRhcmdldDogU2hhZG93Um9vdHxIb3N0LCBzdHlsZXNoZWV0czogYW55W10pIHtcblxuICAgICAgICBpZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCApIHtcbiAgICAgICAgICAgIHRhcmdldC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MsIC4uLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNzc3NlbGVjdG9yID0gdGFyZ2V0LkNTU1NlbGVjdG9yOyAvL1RPRE8uLi5cblxuICAgICAgICBpZiggYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG4gICAgICAgIGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcbiAgICAgICAgZm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcbiAgICAgICAgICAgIGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcbiAgICAgICAgICAgICAgICBodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcbiAgICAgICAgYWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG4gICAgfVxufVxuXG4vLyBpZGVtIEhUTUwuLi5cbi8qIGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBjID0gYXdhaXQgYztcbiAgICAgICAgICAgIGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuICAgICAgICAgICAgICAgIGMgPSBhd2FpdCBjLnRleHQoKTtcblxuICAgICAgICAgICAgc3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG4gICAgICAgIH0pKCkpO1xuXG4gICAgICAgIHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcbiAgICB9XG4qLyIsImltcG9ydCB7IExIb3N0Q3N0ciwgdHlwZSBDbGFzcywgdHlwZSBDb25zdHJ1Y3RvciwgdHlwZSBMSVNTX09wdHMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBidWlsZExJU1NIb3N0LCBzZXRDc3RyQ29udHJvbGVyIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWV9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8qKioqL1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0Ly8gbm9uLXZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBob3N0OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdC8vIHZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBpc0Nvbm5lY3RlZCAgOmJvb2xlYW47XG59O1xuXHQvLyArIHByb3RlY3RlZFxuXHRcdC8vIHJlYWRvbmx5IC5jb250ZW50OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Q7XG5cdC8vIHZhbmlsbGEgSlNcblx0XHQvLyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCk6IHZvaWQ7XG5cdFx0Ly8gY29ubmVjdGVkQ2FsbGJhY2sgICAoKTogdm9pZDtcblx0XHQvLyBkaXNjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkO1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiB7XG5cdG5ldygpOiBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW107XG59XG5cdC8vICsgXCJwcml2YXRlXCJcblx0XHQvLyByZWFkb25seSBIb3N0OiBIb3N0Q3N0clxuXG5leHBvcnQgdHlwZSBDb250cm9sZXI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEluc3RhbmNlVHlwZTxFeHRlbmRzQ3N0cj47XG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4gJiBFeHRlbmRzQ3N0cjtcblxuLyoqKiovXG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPihhcmdzOiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+PiA9IHt9KSB7XG5cblx0bGV0IHtcblx0XHQvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cblx0XHRleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCAgICAgIGFzIHVua25vd24gYXMgRXh0ZW5kc0NzdHIsXG5cdFx0aG9zdCAgICAgICAgICAgICAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRcblx0XHRjb250ZW50X2dlbmVyYXRvciA9IENvbnRlbnRHZW5lcmF0b3IsXG5cdH0gPSBhcmdzO1xuXHRcblx0Y2xhc3MgTElTU0NvbnRyb2xlciBleHRlbmRzIF9leHRlbmRzIGltcGxlbWVudHMgSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+e1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0c2V0Q3N0ckNvbnRyb2xlcih0aGlzKTtcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KC4uLmFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3QuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge31cblxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaG9zdC5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogSW5zdGFuY2VUeXBlPExIb3N0Q3N0cjxIb3N0Q3N0cj4+O1xuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgX0hvc3Q6IExIb3N0Q3N0cjxIb3N0Q3N0cj47XG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlOiBmdWNrIG9mZi5cblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QoIHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aG9zdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcmdzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQ29udHJvbGVyIHNhdGlzZmllcyBDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG59IiwiaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBTaGFkb3dDZmcsIHR5cGUgTElTU0NvbnRyb2xlckNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tIFwiTGlmZUN5Y2xlL3N0YXRlc1wiO1xuXG4vLyBMSVNTSG9zdCBtdXN0IGJlIGJ1aWxkIGluIGRlZmluZSBhcyBpdCBuZWVkIHRvIGJlIGFibGUgdG8gYnVpbGRcbi8vIHRoZSBkZWZpbmVkIHN1YmNsYXNzLlxuXG5sZXQgaWQgPSAwO1xuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZENTUygpIHtcblx0cmV0dXJuIHNoYXJlZENTUztcbn1cblxubGV0IF9fY3N0cl9jb250cm9sZXIgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJDb250cm9sZXIoXzogYW55KSB7XG5cdF9fY3N0cl9jb250cm9sZXIgPSBfO1xufVxuXG50eXBlIGluZmVySG9zdENzdHI8VD4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI8aW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiwgaW5mZXIgQiBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPyBCIDogbmV2ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFx0VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLCBVIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gaW5mZXJIb3N0Q3N0cjxUPiA+KFxuXHRcdFx0XHRcdFx0XHRMaXNzOiBULFxuXHRcdFx0XHRcdFx0XHQvLyBjYW4ndCBkZWR1Y2UgOiBjYXVzZSB0eXBlIGRlZHVjdGlvbiBpc3N1ZXMuLi5cblx0XHRcdFx0XHRcdFx0aG9zdENzdHI6IFUsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHI6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuXHRcdFx0XHRcdFx0XHRhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG5cdFx0XHRcdFx0XHQpIHtcblxuXHRjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcl9jc3RyKGFyZ3MpO1xuXG5cdHR5cGUgSG9zdENzdHIgPSBVO1xuICAgIHR5cGUgSG9zdCAgICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdGNsYXNzIExJU1NIb3N0IGV4dGVuZHMgaG9zdENzdHIge1xuXG5cdFx0c3RhdGljIHJlYWRvbmx5IENmZyA9IHtcblx0XHRcdGhvc3QgICAgICAgICAgICAgOiBob3N0Q3N0cixcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBjb250ZW50X2dlbmVyYXRvcl9jc3RyLFxuXHRcdFx0YXJnc1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQ29udHJvbGVyID0gTGlzcztcblxuXHRcdCNjb250cm9sZXI6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgY29udHJvbGVyKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXIgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHQvL1RPRE86IGdldCByZWFsIFRTIHR5cGUgP1xuXHRcdCNwYXJhbXM6IGFueVtdO1xuXHRcdGluaXRpYWxpemUoLi4ucGFyYW1zOiBhbnlbXSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRpZiggcGFyYW1zLmxlbmd0aCAhPT0gMCApIHtcblx0XHRcdFx0aWYoIHRoaXMuI3BhcmFtcy5sZW5ndGggIT09IDAgKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ3N0ciBwYXJhbXMgaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZCAhJyk7XG5cdFx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jY29udHJvbGVyID0gdGhpcy5pbml0KCk7XG5cblx0XHRcdGlmKCB0aGlzLmlzQ29ubmVjdGVkIClcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXI7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjaW50ZXJuYWxzID0gdGhpcy5hdHRhY2hJbnRlcm5hbHMoKTtcblx0XHQjc3RhdGVzICAgID0gdGhpcy4jaW50ZXJuYWxzLnN0YXRlcztcblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290ID0gdGhpcyBhcyBIb3N0O1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgYXR0YWNoU2hhZG93KGluaXQ6IFNoYWRvd1Jvb3RJbml0KTogU2hhZG93Um9vdCB7XG5cdFx0XHRjb25zdCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3coaW5pdCk7XG5cblx0XHRcdC8vIEB0cy1pZ25vcmUgY2xvc2VkIElTIGFzc2lnbmFibGUgdG8gc2hhZG93TW9kZS4uLlxuXHRcdFx0dGhpcy5zaGFkb3dNb2RlID0gaW5pdC5tb2RlO1xuXG5cdFx0XHR0aGlzLiNjb250ZW50ID0gc2hhZG93O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc2hhZG93O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2hhZG93TW9kZSAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKC4uLnBhcmFtczogYW55W10pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdHRoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfVVBHUkFERUQpO1xuXHRcdFx0Y29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdHRoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfUkVBRFkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGNvbnN0IGNvbnRyb2xlciA9IF9fY3N0cl9jb250cm9sZXI7XG5cdFx0XHRfX2NzdHJfY29udHJvbGVyID0gbnVsbDtcblxuXHRcdFx0aWYoIGNvbnRyb2xlciAhPT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBjb250cm9sZXI7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdGlmKHRoaXMuY29udHJvbGVyICE9PSBudWxsKVxuXHRcdFx0XHR0aGlzLmNvbnRyb2xlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuY29udHJvbGVyIS5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGluc3RhbmNlIGRlcHNcblx0XHRcdGlmKCBjb250ZW50X2dlbmVyYXRvci5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCggYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdGF3YWl0IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gTElTU0hvc3QuQ29udHJvbGVyLm9ic2VydmVkQXR0cmlidXRlcztcblx0XHR9XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKHRoaXMuI2NvbnRyb2xlcilcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXHRcdH1cblxuXHRcdHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsID0gbnVsbDtcblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblxuXHRcdFx0Ly8gbm8gbmVlZHMgdG8gc2V0IHRoaXMuI2NvbnRlbnQgKGFscmVhZHkgaG9zdCBvciBzZXQgd2hlbiBhdHRhY2hTaGFkb3cpXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvci5nZW5lcmF0ZSh0aGlzKTtcblxuXHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXG5cdFx0XHRpZiggdGhpcy4jY29udHJvbGVyID09PSBudWxsKSB7XG5cdFx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBuZXcgTElTU0hvc3QuQ29udHJvbGVyKC4uLnRoaXMuI3BhcmFtcykgYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX0lOSVRJQUxJWkVEKTtcblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuY29udHJvbGVyKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29udHJvbGVyO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3Q7XG59XG5cblxuIiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwidHlwZXNcIjtcblxuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPikge1xuXG5cdGxldCBIb3N0OiBMSVNTSG9zdENzdHI8VD4gPSBDb21wb25lbnRDbGFzcyBhcyBhbnk7XG5cblx0Ly8gQnJ5dGhvbiBjbGFzc1xuXHRsZXQgYnJ5X2NsYXNzOiBhbnkgPSBudWxsO1xuXHRpZiggXCIkaXNfY2xhc3NcIiBpbiBDb21wb25lbnRDbGFzcyApIHtcblxuXHRcdGJyeV9jbGFzcyA9IENvbXBvbmVudENsYXNzO1xuXG5cdFx0Q29tcG9uZW50Q2xhc3MgPSBicnlfY2xhc3MuX19iYXNlc19fLmZpbHRlciggKGU6IGFueSkgPT4gZS5fX25hbWVfXyA9PT0gXCJXcmFwcGVyXCIpWzBdLl9qc19rbGFzcy4kanNfZnVuYztcblx0XHQoQ29tcG9uZW50Q2xhc3MgYXMgYW55KS5Ib3N0LkNvbnRyb2xlciA9IGNsYXNzIHtcblxuXHRcdFx0I2JyeTogYW55O1xuXG5cdFx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHRoaXMuI2JyeSA9IF9fQlJZVEhPTl9fLiRjYWxsKGJyeV9jbGFzcywgWzAsMCwwXSkoLi4uYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdCNjYWxsKG5hbWU6IHN0cmluZywgYXJnczogYW55W10pIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gX19CUllUSE9OX18uJGNhbGwoX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgbmFtZSwgWzAsMCwwXSksIFswLDAsMF0pKC4uLmFyZ3MpXG5cdFx0XHR9XG5cblx0XHRcdGdldCBob3N0KCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBfX0JSWVRIT05fXy4kZ2V0YXR0cl9wZXA2NTcodGhpcy4jYnJ5LCBcImhvc3RcIiwgWzAsMCwwXSlcblx0XHRcdH1cblxuXHRcdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGJyeV9jbGFzc1tcIm9ic2VydmVkQXR0cmlidXRlc1wiXTtcblxuXHRcdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImNvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJkaXNjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiggXCJIb3N0XCIgaW4gQ29tcG9uZW50Q2xhc3MgKVxuXHRcdEhvc3QgPSBDb21wb25lbnRDbGFzcy5Ib3N0IGFzIGFueTtcbiAgICBcbiAgICBjb25zdCBDbGFzcyAgPSBIb3N0LkNmZy5ob3N0O1xuICAgIGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGNvbnNvbGUud2FybihcImRlZmluZVwiLCB0YWduYW1lKTtcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgSG9zdCwgb3B0cyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudHxMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyfExJU1NIb3N0PExJU1NDb250cm9sZXI+fExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPiApOiBzdHJpbmcge1xuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBpZiggXCJob3N0XCIgaW4gZWxlbWVudClcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuaG9zdDtcbiAgICBpZiggZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBcbiAgICAgICAgaWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICAvLyBjc3RyXG5cblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQpXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lkhvc3QgYXMgdW5rbm93biBhcyBMSVNTSG9zdENzdHI8TElTU0NvbnRyb2xlcj47XG5cbiAgICBjb25zdCBuYW1lID0gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZSggZWxlbWVudCApO1xuICAgIGlmKG5hbWUgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgaXMgbm90IGRlZmluZWQhXCIpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVmaW5lZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pICE9PSB1bmRlZmluZWQ7XG5cbiAgICBpZiggXCJIb3N0XCIgaW4gZWxlbSlcbiAgICAgICAgZWxlbSA9IGVsZW0uSG9zdCBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtIGFzIGFueSkgIT09IG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdENzdHI8VD4+IHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoZWxlbSk7XG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSkgYXMgTElTU0hvc3RDc3RyPFQ+O1xuICAgIH1cblxuICAgIC8vIFRPRE86IGxpc3RlbiBkZWZpbmUuLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufVxuXG4vKlxuLy8gVE9ETzogaW1wbGVtZW50XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0Q3N0cjxUPj4ge1xuICAgIC8vIHdlIGNhbid0IGZvcmNlIGEgZGVmaW5lLlxuICAgIHJldHVybiB3aGVuRGVmaW5lZChlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RDc3RyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogTElTU0hvc3RDc3RyPFQ+IHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpIHtcblxuICAgICAgICBsZXQgaG9zdCA9IGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKTtcbiAgICAgICAgaWYoIGhvc3QgPT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZWxlbX0gbm90IGRlZmluZWQgeWV0IWApO1xuXG4gICAgICAgIHJldHVybiBob3N0IGFzIHVua25vd24gYXMgTElTU0hvc3RDc3RyPFQ+O1xuICAgIH1cblxuICAgIGlmKCBcIkhvc3RcIiBpbiBlbGVtKVxuICAgICAgICBlbGVtID0gZWxlbS5Ib3N0IGFzIHVua25vd24gYXMgVDtcblxuICAgIGlmKCBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0gYXMgYW55KSA9PT0gbnVsbCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlbGVtfSBub3QgZGVmaW5lZCB5ZXQhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdENzdHI8VD47XG59IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0IH0gZnJvbSBcInR5cGVzXCI7XG5pbXBvcnQgeyBnZXRIb3N0Q3N0clN5bmMsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi9ERUZJTkVEXCI7XG5pbXBvcnQgeyBpc1VwZ3JhZGVkLCB1cGdyYWRlLCB1cGdyYWRlU3luYywgd2hlblVwZ3JhZGVkIH0gZnJvbSBcIi4vVVBHUkFERURcIjtcbmltcG9ydCB7IGlzUmVhZHksIHdoZW5SZWFkeSB9IGZyb20gXCIuL1JFQURZXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gTElTU0hvc3Q8VD58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCAhIGlzVXBncmFkZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gZWxlbS5pc0luaXRpYWxpemVkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB3aGVuVXBncmFkZWQoZWxlbSk7XG5cbiAgICByZXR1cm4gYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQgYXMgVDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbnRyb2xlcjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuICAgIGF3YWl0IHdoZW5SZWFkeShob3N0KTtcblxuICAgIC8vVE9ETzogaW5pdGlhbGl6ZVN5bmMgdnMgaW5pdGlhbGl6ZSA/XG4gICAgcmV0dXJuIGhvc3QuaW5pdGlhbGl6ZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBUIHtcbiAgICBcbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG4gICAgaWYoICEgaXNSZWFkeShob3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGFuY2llcyBub3QgcmVhZHkgIVwiKVxuXG4gICAgcmV0dXJuIGhvc3QuaW5pdGlhbGl6ZSgpO1xufVxuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZSAgICAgPSBnZXRDb250cm9sZXI7XG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZVN5bmMgPSBnZXRDb250cm9sZXJTeW5jOyIsImltcG9ydCB7IExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdENzdHIgfSBmcm9tIFwidHlwZXNcIjtcbmltcG9ydCB7IGdldEhvc3RDc3RyU3luYywgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCB9IGZyb20gXCIuL0RFRklORURcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+ID0gc3RyaW5nfFR8TElTU0hvc3RDc3RyPFQ+fEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+fEhUTUxFbGVtZW50O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWFkeTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgIGNvbnN0IGhvc3RDc3RyID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgcmV0dXJuIGhvc3RDc3RyLmlzRGVwc1Jlc29sdmVkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblJlYWR5PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBob3N0Q3N0ciA9IGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuICAgIGF3YWl0IGhvc3RDc3RyLndoZW5EZXBzUmVzb2x2ZWQ7XG5cbiAgICByZXR1cm4gaG9zdENzdHIuQ29udHJvbGVyIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICAvLyB3ZSBjYW4ndCBmb3JjZSBhIHJlYWR5LlxuICAgIHJldHVybiB3aGVuUmVhZHkoZWxlbSkgYXMgUHJvbWlzZTxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlckNzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBUIHtcbiAgICBcbiAgICBpZiggISBpc1JlYWR5KGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIHJldHVybiBnZXRIb3N0Q3N0clN5bmMoZWxlbSkuQ29udHJvbGVyIGFzIFQ7XG59IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0IH0gZnJvbSBcInR5cGVzXCI7XG5pbXBvcnQgeyBnZXRIb3N0Q3N0clN5bmMsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi9ERUZJTkVEXCI7XG5cbnR5cGUgUGFyYW08X1QgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IEhUTUxFbGVtZW50O1xuXG4vL1RPRE86IHVwZ3JhZGUgZnVuY3Rpb24uLi5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVXBncmFkZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+fExJU1NIb3N0PFQ+KTogZWxlbSBpcyBMSVNTSG9zdDxUPiB7XG5cbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBIb3N0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3Q8VD4+IHtcbiAgICBcbiAgICBjb25zdCBIb3N0ID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICAvLyBhbHJlYWR5IHVwZ3JhZGVkXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIb3N0KVxuICAgICAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcblxuICAgIC8vIGg0Y2tcblxuICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG4gICAgfVxuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgXG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRIb3N0PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3Q8VD4+IHtcbiAgICBcbiAgICBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IExJU1NIb3N0PFQ+IHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCBkZWZpbmVkICFcIik7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBjb25zdCB1cGdyYWRlICAgICA9IGdldEhvc3Q7XG5leHBvcnQgY29uc3QgdXBncmFkZVN5bmMgPSBnZXRIb3N0U3luYyIsImV4cG9ydCBlbnVtIFN0YXRlcyB7XG4gICAgTElTU19ERUZJTkVEICAgICA9IFwiTElTU19ERUZJTkVEXCIsXG4gICAgTElTU19VUEdSQURFRCAgICA9IFwiTElTU19VUEdSQURFRFwiLFxuICAgIExJU1NfUkVBRFkgICAgICAgPSBcIkxJU1NfUkVBRFlcIixcbiAgICBMSVNTX0lOSVRJQUxJWkVEID0gXCJMSVNTX0lOSVRJQUxJWkVEXCJcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5cbmltcG9ydCB7U3RhdGVzfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL3N0YXRlcy50c1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgU3RhdGVzICAgICAgICAgOiB0eXBlb2YgU3RhdGVzXG5cdFx0Ly8gd2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLlN0YXRlcyA9IFN0YXRlcztcblxuXG5pbXBvcnQge2RlZmluZSwgZ2V0TmFtZSwgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCwgZ2V0SG9zdENzdHIsIGdldEhvc3RDc3RyU3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9ERUZJTkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0Z2V0SG9zdENzdHIgICAgOiB0eXBlb2YgZ2V0SG9zdENzdHI7XG5cdFx0Z2V0SG9zdENzdHJTeW5jOiB0eXBlb2YgZ2V0SG9zdENzdHJTeW5jO1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgICAgICAgICA9IGRlZmluZTtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1Mud2hlbkRlZmluZWQgICAgPSB3aGVuRGVmaW5lZDtcbkxJU1MuZ2V0SG9zdENzdHIgICAgPSBnZXRIb3N0Q3N0cjtcbkxJU1MuZ2V0SG9zdENzdHJTeW5jPSBnZXRIb3N0Q3N0clN5bmM7XG5cbi8vTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuXG5pbXBvcnQge2lzUmVhZHksIHdoZW5SZWFkeSwgZ2V0Q29udHJvbGVyQ3N0ciwgZ2V0Q29udHJvbGVyQ3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvUkVBRFlcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNSZWFkeSAgICAgIDogdHlwZW9mIGlzUmVhZHk7XG5cdFx0d2hlblJlYWR5ICAgIDogdHlwZW9mIHdoZW5SZWFkeTtcblx0XHRnZXRDb250cm9sZXJDc3RyICAgIDogdHlwZW9mIGdldENvbnRyb2xlckNzdHI7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0clN5bmM6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyU3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNSZWFkeSAgICAgICAgICAgICA9IGlzUmVhZHk7XG5MSVNTLndoZW5SZWFkeSAgICAgICAgICAgPSB3aGVuUmVhZHk7XG5MSVNTLmdldENvbnRyb2xlckNzdHIgICAgPSBnZXRDb250cm9sZXJDc3RyO1xuTElTUy5nZXRDb250cm9sZXJDc3RyU3luYz0gZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG5cblxuXG5pbXBvcnQge2lzVXBncmFkZWQsIHdoZW5VcGdyYWRlZCwgdXBncmFkZSwgdXBncmFkZVN5bmMsIGdldEhvc3QsIGdldEhvc3RTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1VQR1JBREVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzVXBncmFkZWQgIDogdHlwZW9mIGlzVXBncmFkZWQ7XG5cdFx0d2hlblVwZ3JhZGVkOiB0eXBlb2Ygd2hlblVwZ3JhZGVkO1xuXHRcdHVwZ3JhZGUgICAgIDogdHlwZW9mIHVwZ3JhZGU7XG5cdFx0dXBncmFkZVN5bmMgOiB0eXBlb2YgdXBncmFkZVN5bmM7XG5cdFx0Z2V0SG9zdCAgICAgOiB0eXBlb2YgZ2V0SG9zdDtcblx0XHRnZXRIb3N0U3luYyA6IHR5cGVvZiBnZXRIb3N0U3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNVcGdyYWRlZCAgPSBpc1VwZ3JhZGVkO1xuTElTUy53aGVuVXBncmFkZWQ9IHdoZW5VcGdyYWRlZDtcbkxJU1MudXBncmFkZSAgICAgPSB1cGdyYWRlO1xuTElTUy51cGdyYWRlU3luYyA9IHVwZ3JhZGVTeW5jO1xuTElTUy5nZXRIb3N0ICAgICA9IGdldEhvc3Q7XG5MSVNTLmdldEhvc3RTeW5jID0gZ2V0SG9zdFN5bmM7XG5cblxuaW1wb3J0IHtpc0luaXRpYWxpemVkLCB3aGVuSW5pdGlhbGl6ZWQsIGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jLCBnZXRDb250cm9sZXIsIGdldENvbnRyb2xlclN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNJbml0aWFsaXplZCAgICA6IHR5cGVvZiBpc0luaXRpYWxpemVkO1xuXHRcdHdoZW5Jbml0aWFsaXplZCAgOiB0eXBlb2Ygd2hlbkluaXRpYWxpemVkO1xuXHRcdGluaXRpYWxpemUgICAgICAgOiB0eXBlb2YgaW5pdGlhbGl6ZTtcblx0XHRpbml0aWFsaXplU3luYyAgIDogdHlwZW9mIGluaXRpYWxpemVTeW5jO1xuXHRcdGdldENvbnRyb2xlciAgICAgOiB0eXBlb2YgZ2V0Q29udHJvbGVyO1xuXHRcdGdldENvbnRyb2xlclN5bmMgOiB0eXBlb2YgZ2V0Q29udHJvbGVyU3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNJbml0aWFsaXplZCAgICA9IGlzSW5pdGlhbGl6ZWQ7XG5MSVNTLndoZW5Jbml0aWFsaXplZCAgPSB3aGVuSW5pdGlhbGl6ZWQ7XG5MSVNTLmluaXRpYWxpemUgICAgICAgPSBpbml0aWFsaXplO1xuTElTUy5pbml0aWFsaXplU3luYyAgID0gaW5pdGlhbGl6ZVN5bmM7XG5MSVNTLmdldENvbnRyb2xlciAgICAgPSBnZXRDb250cm9sZXI7XG5MSVNTLmdldENvbnRyb2xlclN5bmMgPSBnZXRDb250cm9sZXJTeW5jOyIsImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge0xJU1MgYXMgX0xJU1N9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuXG4vLyB1c2VkIGZvciBwbHVnaW5zLlxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbi8vIGV4dGVuZHMgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgIE9wdHMgZXh0ZW5kcyBMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj5cbiAgICA+KG9wdHM6IHtleHRlbmRzOiBFeHRlbmRzQ3N0cn0gJiBQYXJ0aWFsPE9wdHM+KTogUmV0dXJuVHlwZTx0eXBlb2YgX2V4dGVuZHM8RXh0ZW5kc0NzdHIsIE9wdHM+PlxuLy8gTElTU0NvbnRyb2xlciBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICA+KG9wdHM/OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+KTogTElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+XG5leHBvcnQgZnVuY3Rpb24gTElTUyhvcHRzOiBhbnkgPSB7fSk6IExJU1NDb250cm9sZXJDc3RyXG57XG4gICAgaWYoIG9wdHMuZXh0ZW5kcyAhPT0gdW5kZWZpbmVkICYmIFwiSG9zdFwiIGluIG9wdHMuZXh0ZW5kcyApIC8vIHdlIGFzc3VtZSB0aGlzIGlzIGEgTElTU0NvbnRyb2xlckNzdHJcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKG9wdHMpO1xuXG4gICAgcmV0dXJuIF9MSVNTKG9wdHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2V4dGVuZHM8XG4gICAgICAgIEV4dGVuZHNDc3RyIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsXG4gICAgICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgICAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPikge1xuXG4gICAgaWYoIG9wdHMuZXh0ZW5kcyA9PT0gdW5kZWZpbmVkKSAvLyBoNGNrXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYSBMSVNTQ29udHJvbGVyIScpO1xuXG4gICAgY29uc3QgY2ZnID0gb3B0cy5leHRlbmRzLkhvc3QuQ2ZnO1xuICAgIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzLCBjZmcsIGNmZy5hcmdzKTtcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyEge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgfVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBvdmVycmlkZSBfSG9zdDogTElTU0hvc3Q8RXh0ZW5kZWRMSVNTPjtcblxuICAgICAgICAvLyBUUyBpcyBzdHVwaWQsIHJlcXVpcmVzIGV4cGxpY2l0IHJldHVybiB0eXBlXG5cdFx0c3RhdGljIG92ZXJyaWRlIGdldCBIb3N0KCk6IExJU1NIb3N0PEV4dGVuZGVkTElTUz4ge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIGZ1Y2sgb2ZmXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5ob3N0ISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbnRlbnRfZ2VuZXJhdG9yISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG4gICAgfVxuXG4gICAgcmV0dXJuIEV4dGVuZGVkTElTUztcbn0iLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciwgTEhvc3QsIExJU1NDb250cm9sZXJDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSBcIkxpZmVDeWNsZS9ERUZJTkVEXCI7XG5cbi8vIHNob3VsZCBiZSBpbXByb3ZlZCAoYnV0IGhvdyA/KVxuY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2F1dG9kaXJdJyk7XG5cbmNvbnN0IFJFU1NPVVJDRVMgPSBbXG5cdFwiaW5kZXguanNcIixcblx0XCJpbmRleC5icnlcIixcblx0XCJpbmRleC5odG1sXCIsXG5cdFwiaW5kZXguY3NzXCJcbl07XG5cbmNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5sZXQgX2NkaXI6IG51bGx8c3RyaW5nO1xuXG5pZiggc2NyaXB0ICE9PSBudWxsICkge1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cblx0XHRjb25zdCBzd19wYXRoID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKTtcblxuXHRcdGlmKCBzd19wYXRoID09PSBudWxsICkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHN3X3BhdGgsIHtzY29wZTogXCIvXCJ9KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0X2NkaXIgPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdhdXRvZGlyJykhO1xuXHRjb25zb2xlLndhcm4oX2NkaXIpO1xuXHRpZiggX2NkaXJbX2NkaXIubGVuZ3RoLTFdICE9PSAnLycpXG5cdFx0X2NkaXIgKz0gJy8nO1xuXG5cdGNvbnN0IGJyeXRob24gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwiYnJ5dGhvblwiKTtcblxuXHQvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdFx0XHRcdGFkZFRhZyhhZGRpdGlvbilcblxuXHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqXCIpIClcblx0XHRhZGRUYWcoIGVsZW0gKTtcblxuXG5cdGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IHRhZ25hbWUgPSAoIHRhZy5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gdGFnLnRhZ05hbWUgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0aWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGNkaXI6IF9jZGlyLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1x0XHRcblx0fVxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiB7aHRtbDogc3RyaW5nLCBjc3M6IHN0cmluZywgaG9zdDogQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+fSkge1xuXG5cdGNvbnN0IGNfanMgICAgICA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cblx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdGlmKCBjX2pzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NfanNdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcblx0XHRjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuXHRcdGNvbnN0IG9sZHJlcSA9IExJU1MucmVxdWlyZTtcblxuXHRcdExJU1MucmVxdWlyZSA9IGZ1bmN0aW9uKHVybDogVVJMfHN0cmluZykge1xuXG5cdFx0XHRpZiggdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiAmJiB1cmwuc3RhcnRzV2l0aCgnLi8nKSApIHtcblx0XHRcdFx0Y29uc3QgZmlsZW5hbWUgPSB1cmwuc2xpY2UoMik7XG5cdFx0XHRcdGlmKCBmaWxlbmFtZSBpbiBmaWxlcylcblx0XHRcdFx0XHRyZXR1cm4gZmlsZXNbZmlsZW5hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb2xkcmVxKHVybCk7XG5cdFx0fVxuXG5cdFx0a2xhc3MgPSAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJsKSkuZGVmYXVsdDtcblxuXHRcdExJU1MucmVxdWlyZSA9IG9sZHJlcTtcblx0fVxuXHRlbHNlIGlmKCBvcHRzLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGtsYXNzID0gTElTUyh7XG5cdFx0XHQuLi5vcHRzLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3Jcblx0XHR9KTtcblx0fVxuXG5cdGlmKGtsYXNzID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0ZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuXHRyZXR1cm4ga2xhc3M7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgaW50ZXJuYWwgdG9vbHMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdGNvbnN0IG9wdGlvbnMgPSBpc0xpc3NBdXRvXG5cdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHQ6IHt9O1xuXG5cblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuXHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRpZiggaXNMaXNzQXV0byAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0Y29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG5cdGlmKGFuc3dlciA9PT0gXCJcIilcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhbnN3ZXJcbn1cbmFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdC8vIHRlc3QgZm9yIHRoZSBtb2R1bGUgZXhpc3RhbmNlLlxuXHRpZihpc0xpc3NBdXRvICYmIGF3YWl0IF9mZXRjaFRleHQodXJpLCBpc0xpc3NBdXRvKSA9PT0gdW5kZWZpbmVkIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmkpKS5kZWZhdWx0O1xuXHR9IGNhdGNoKGUpIHtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59XG5cblxuY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5mdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn1cblxuZXhwb3J0IGNsYXNzIExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuXHRwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcGFyZUhUTUwoaHRtbD86IERvY3VtZW50RnJhZ21lbnQgfCBIVE1MRWxlbWVudCB8IHN0cmluZykge1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IG51bGw7XG5cblx0XHRpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuXG5cdFx0XHR0aGlzLmRhdGEgPSBodG1sO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHQvKlxuXHRcdFx0aHRtbCA9IGh0bWwucmVwbGFjZUFsbCgvXFwkXFx7KFtcXHddKylcXH0vZywgKF8sIG5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYDxsaXNzIHZhbHVlPVwiJHtuYW1lfVwiPjwvbGlzcz5gO1xuXHRcdFx0fSk7Ki9cblxuXHRcdFx0Ly9UT0RPOiAke30gaW4gYXR0clxuXHRcdFx0XHQvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG5cdFx0XHRcdC8vIC0gcmVnaXN0ZXIgZWxlbSArIGF0dHIgbmFtZVxuXHRcdFx0XHQvLyAtIHJlcGxhY2UuIFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gc3VwZXIucHJlcGFyZUhUTUwoaHRtbCk7XG5cdH1cblxuXHRvdmVycmlkZSBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudCB8IFNoYWRvd1Jvb3Qge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKGhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbnRlbnQgPSBzdXBlci5nZW5lcmF0ZShob3N0KTtcblxuXHRcdC8qXG5cdFx0Ly8gaHRtbCBtYWdpYyB2YWx1ZXMuXG5cdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdFx0Ly8gY3NzIHByb3AuXG5cdFx0Y29uc3QgY3NzX2F0dHJzID0gaG9zdC5nZXRBdHRyaWJ1dGVOYW1lcygpLmZpbHRlciggZSA9PiBlLnN0YXJ0c1dpdGgoJ2Nzcy0nKSk7XG5cdFx0Zm9yKGxldCBjc3NfYXR0ciBvZiBjc3NfYXR0cnMpXG5cdFx0XHRob3N0LnN0eWxlLnNldFByb3BlcnR5KGAtLSR7Y3NzX2F0dHIuc2xpY2UoJ2Nzcy0nLmxlbmd0aCl9YCwgaG9zdC5nZXRBdHRyaWJ1dGUoY3NzX2F0dHIpKTtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBpbXBvcnRDb21wb25lbnRzIDogdHlwZW9mIGltcG9ydENvbXBvbmVudHM7XG4gICAgICAgIGltcG9ydENvbXBvbmVudCAgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50O1xuICAgICAgICByZXF1aXJlICAgICAgICAgIDogdHlwZW9mIHJlcXVpcmU7XG4gICAgfVxufVxuXG50eXBlIGltcG9ydENvbXBvbmVudHNfT3B0czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGwsXG5cdGJyeXRob24/OiBzdHJpbmd8bnVsbCxcblx0aG9zdCAgID86IENvbnN0cnVjdG9yPFQ+XG59O1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0XHRcdFx0XHRcdGNvbXBvbmVudHM6IHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjZGlyICAgID0gX2NkaXIsXG5cdFx0XHRcdFx0XHRcdGJyeXRob24gPSBudWxsLFxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudFxuXHRcdFx0XHRcdFx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+KSB7XG5cblx0Y29uc3QgcmVzdWx0czogUmVjb3JkPHN0cmluZywgTElTU0NvbnRyb2xlckNzdHI+ID0ge307XG5cblx0Zm9yKGxldCB0YWduYW1lIG9mIGNvbXBvbmVudHMpIHtcblxuXHRcdHJlc3VsdHNbdGFnbmFtZV0gPSBhd2FpdCBpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0Y2Rpcixcblx0XHRcdGJyeXRob24sXG5cdFx0XHRob3N0XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuY29uc3QgYnJ5X3dyYXBwZXIgPSBgZGVmIHdyYXBqcyhqc19rbGFzcyk6XG5cbiAgICBjbGFzcyBXcmFwcGVyOlxuXG4gICAgICAgIF9qc19rbGFzcyA9IGpzX2tsYXNzXG4gICAgICAgIF9qcyA9IE5vbmVcblxuICAgICAgICBkZWYgX19pbml0X18oc2VsZiwgKmFyZ3MpOlxuICAgICAgICAgICAgc2VsZi5fanMgPSBqc19rbGFzcy5uZXcoKmFyZ3MpXG5cbiAgICAgICAgZGVmIF9fZ2V0YXR0cl9fKHNlbGYsIG5hbWU6IHN0cik6XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fanNbbmFtZV07XG5cbiAgICAgICAgZGVmIF9fc2V0YXR0cl9fKHNlbGYsIG5hbWU6IHN0ciwgdmFsdWUpOlxuICAgICAgICAgICAgaWYgbmFtZSA9PSBcIl9qc1wiOlxuICAgICAgICAgICAgICAgIHN1cGVyKCkuX19zZXRhdHRyX18obmFtZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBzZWxmLl9qc1tuYW1lXSA9IHZhbHVlXG5cbiAgICByZXR1cm4gV3JhcHBlclxuXG5gO1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gX2NkaXIsXG5cdFx0YnJ5dGhvbiA9IG51bGwsXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudCxcblx0XHRmaWxlcyAgID0gbnVsbFxuXHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4gJiB7ZmlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fG51bGx9ID0ge31cbikge1xuXG5cdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RhZ25hbWV9L2A7XG5cblx0aWYoIGZpbGVzID09PSBudWxsICkge1xuXHRcdGZpbGVzID0ge307XG5cblx0XHRjb25zdCBmaWxlID0gYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgPyAnaW5kZXguYnJ5JyA6ICdpbmRleC5qcyc7XG5cblx0XHRmaWxlc1tmaWxlXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn0ke2ZpbGV9YCwgdHJ1ZSkpITtcblx0fVxuXG5cdGlmKCBicnl0aG9uID09PSBcInRydWVcIiAmJiBmaWxlc1snaW5kZXguYnJ5J10gIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0Y29uc3QgY29kZSA9IGJyeV93cmFwcGVyICsgZmlsZXNbXCJpbmRleC5icnlcIl07XG5cblx0XHRmaWxlc1snaW5kZXguanMnXSA9XG5gY29uc3QgJEIgPSBnbG9iYWxUaGlzLl9fQlJZVEhPTl9fO1xuXG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHtjb2RlfVxcYCwgXCJfXCIpO1xuXG5jb25zdCBtb2R1bGUgPSAkQi5pbXBvcnRlZFtcIl9cIl07XG5leHBvcnQgZGVmYXVsdCBtb2R1bGUuV2ViQ29tcG9uZW50O1xuXG5gO1xuXHR9XG5cblx0Y29uc3QgaHRtbCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIHtodG1sLCBjc3MsIGhvc3R9KTtcbn1cblxuZnVuY3Rpb24gcmVxdWlyZSh1cmw6IFVSTHxzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPnxzdHJpbmcge1xuXHRyZXR1cm4gZmV0Y2godXJsKTtcbn1cblxuXG5MSVNTLmltcG9ydENvbXBvbmVudHMgPSBpbXBvcnRDb21wb25lbnRzO1xuTElTUy5pbXBvcnRDb21wb25lbnQgID0gaW1wb3J0Q29tcG9uZW50O1xuTElTUy5yZXF1aXJlICA9IHJlcXVpcmU7IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwiTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn0iLCJcbmltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbnR5cGUgTGlzdGVuZXJGY3Q8VCBleHRlbmRzIEV2ZW50PiA9IChldjogVCkgPT4gdm9pZDtcbnR5cGUgTGlzdGVuZXJPYmo8VCBleHRlbmRzIEV2ZW50PiA9IHsgaGFuZGxlRXZlbnQ6IExpc3RlbmVyRmN0PFQ+IH07XG50eXBlIExpc3RlbmVyPFQgZXh0ZW5kcyBFdmVudD4gPSBMaXN0ZW5lckZjdDxUPnxMaXN0ZW5lck9iajxUPjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50VGFyZ2V0MjxFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBFdmVudD4+IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuXG5cdG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBjYWxsYmFjazogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgb3B0aW9ucz86IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhbik6IHZvaWQge1xuXHRcdFxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblx0fVxuXG5cdG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQ8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4oZXZlbnQ6IEV2ZW50c1tUXSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBzdXBlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fVxuXG5cdG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGlzdGVuZXI6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQge1xuXG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0c3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbUV2ZW50MjxUIGV4dGVuZHMgc3RyaW5nLCBBcmdzPiBleHRlbmRzIEN1c3RvbUV2ZW50PEFyZ3M+IHtcblxuXHRjb25zdHJ1Y3Rvcih0eXBlOiBULCBhcmdzOiBBcmdzKSB7XG5cdFx0c3VwZXIodHlwZSwge2RldGFpbDogYXJnc30pO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2V0IHR5cGUoKTogVCB7IHJldHVybiBzdXBlci50eXBlIGFzIFQ7IH1cbn1cblxudHlwZSBJbnN0YW5jZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4+ID0ge1xuXHRbSyBpbiBrZXlvZiBUXTogSW5zdGFuY2VUeXBlPFRbS10+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXaXRoRXZlbnRzPFQgZXh0ZW5kcyBvYmplY3QsIEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4gPihldjogQ29uc3RydWN0b3I8VD4sIF9ldmVudHM6IEV2ZW50cykge1xuXG5cdHR5cGUgRXZ0cyA9IEluc3RhbmNlczxFdmVudHM+O1xuXG5cdGlmKCAhIChldiBpbnN0YW5jZW9mIEV2ZW50VGFyZ2V0KSApXG5cdFx0cmV0dXJuIGV2IGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+PjtcblxuXHQvLyBpcyBhbHNvIGEgbWl4aW5cblx0Ly8gQHRzLWlnbm9yZVxuXHRjbGFzcyBFdmVudFRhcmdldE1peGlucyBleHRlbmRzIGV2IHtcblxuXHRcdCNldiA9IG5ldyBFdmVudFRhcmdldDI8RXZ0cz4oKTtcblxuXHRcdGFkZEV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmFkZEV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdGRpc3BhdGNoRXZlbnQoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmRpc3BhdGNoRXZlbnQoLi4uYXJncyk7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gRXZlbnRUYXJnZXRNaXhpbnMgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgU2hhZG93Um9vdCB0b29scyA9PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRNYXRjaGVzKGV2OiBFdmVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXG5cdGxldCBlbGVtZW50cyA9IGV2LmNvbXBvc2VkUGF0aCgpLnNsaWNlKDAsLTIpLmZpbHRlcihlID0+ICEgKGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSApLnJldmVyc2UoKSBhcyBIVE1MRWxlbWVudFtdO1xuXG5cdGZvcihsZXQgZWxlbSBvZiBlbGVtZW50cyApXG5cdFx0aWYoZWxlbS5tYXRjaGVzKHNlbGVjdG9yKSApXG5cdFx0XHRyZXR1cm4gZWxlbTsgXG5cblx0cmV0dXJuIG51bGw7XG59IiwiXG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRzIHt9O1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN5bmMsIHdoZW5Jbml0aWFsaXplZCB9IGZyb20gXCJMaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICAvLyBhc3luY1xuICAgICAgICBxcyA6IHR5cGVvZiBxcztcbiAgICAgICAgcXNvOiB0eXBlb2YgcXNvO1xuICAgICAgICBxc2E6IHR5cGVvZiBxc2E7XG4gICAgICAgIHFzYzogdHlwZW9mIHFzYztcblxuICAgICAgICAvLyBzeW5jXG4gICAgICAgIHFzU3luYyA6IHR5cGVvZiBxc1N5bmM7XG4gICAgICAgIHFzYVN5bmM6IHR5cGVvZiBxc2FTeW5jO1xuICAgICAgICBxc2NTeW5jOiB0eXBlb2YgcXNjU3luYztcblxuXHRcdGNsb3Nlc3Q6IHR5cGVvZiBjbG9zZXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzc19zZWxlY3RvcihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtsaXNzX3NlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0bGV0IHJlc3VsdCA9IGF3YWl0IHFzbzxUPihzZWxlY3RvciwgcGFyZW50KTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gcmVzdWx0IVxufVxuXG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc288TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VFtdPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXVtdID47XG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8VD4+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHByb21pc2VzW2lkeCsrXSA9IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc2M8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPihyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUW107XG5mdW5jdGlvbiBxc2FTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dW107XG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cmVzdWx0W2lkeCsrXSA9IGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFQ7XG5mdW5jdGlvbiBxc2NTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KHJlc3VsdCk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjbG9zZXN0PEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50KSB7XG5cblx0d2hpbGUodHJ1ZSkge1xuXHRcdHZhciByZXN1bHQgPSBlbGVtZW50LmNsb3Nlc3Q8RT4oc2VsZWN0b3IpO1xuXG5cdFx0aWYoIHJlc3VsdCAhPT0gbnVsbClcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuXHRcdGlmKCAhIChcImhvc3RcIiBpbiByb290KSApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGVsZW1lbnQgPSAocm9vdCBhcyBTaGFkb3dSb290KS5ob3N0O1xuXHR9XG59XG5cblxuLy8gYXN5bmNcbkxJU1MucXMgID0gcXM7XG5MSVNTLnFzbyA9IHFzbztcbkxJU1MucXNhID0gcXNhO1xuTElTUy5xc2MgPSBxc2M7XG5cbi8vIHN5bmNcbkxJU1MucXNTeW5jICA9IHFzU3luYztcbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG5MSVNTLmNsb3Nlc3QgPSBjbG9zZXN0OyIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJ1xufTtcblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0ge1xuICAgICAgICBleHRlbmRzOiBFeHRlbmRzQ3RyLCAvLyBKUyBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLCAgIC8vIEhUTUwgSG9zdFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG59ICYgQ29udGVudEdlbmVyYXRvcl9PcHRzO1xuXG4vL1RPRE86IHJld3JpdGUuLi5cbi8vIExJU1NDb250cm9sZXJcblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlckNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IEluc3RhbmNlVHlwZTxMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gVCBleHRlbmRzIExJU1NDb250cm9sZXI8XG4gICAgICAgICAgICBpbmZlciBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgICAgICA+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLEhvc3RDc3RyPiA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NDb250cm9sZXIgPyBMSVNTQ29udHJvbGVyMkxJU1NDb250cm9sZXJDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyID0gTElTU0NvbnRyb2xlcj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjtcblxuLy8gbGlnaHRlciBMSVNTSG9zdCBkZWYgdG8gYXZvaWQgdHlwZSBpc3N1ZXMuLi5cbmV4cG9ydCB0eXBlIExIb3N0PEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA9IHtcblxuICAgIGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgQ1NTU2VsZWN0b3I6IHN0cmluZztcblxufSAmIEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbmV4cG9ydCB0eXBlIExIb3N0Q3N0cjxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG4gICAgbmV3KC4uLmFyZ3M6IGFueSk6IExIb3N0PEhvc3RDc3RyPjtcblxuICAgIENmZzoge1xuICAgICAgICBob3N0ICAgICAgICAgICAgIDogSG9zdENzdHIsXG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbiAgICAgICAgYXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuICAgIH1cblxufSAmIEhvc3RDc3RyOyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGlmKCBDbGFzcyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBDbGFzcyA9IENsYXNzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBIVE1MRWxlbWVudDtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblxuICAgIGxldCBjdXJzb3IgPSBDbGFzcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2hpbGUgKGN1cnNvci5fX3Byb3RvX18gIT09IEhUTUxFbGVtZW50KVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5fX3Byb3RvX187XG5cbiAgICAvLyBkaXJlY3RseSBpbmhlcml0IEhUTUxFbGVtZW50XG4gICAgaWYoICEgY3Vyc29yLm5hbWUuc3RhcnRzV2l0aCgnSFRNTCcpICYmICEgY3Vyc29yLm5hbWUuZW5kc1dpdGgoJ0VsZW1lbnQnKSApXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaHRtbHRhZyA9IGN1cnNvci5uYW1lLnNsaWNlKDQsIC03KTtcblxuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG4vKlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG4qL1xuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL0xpZmVDeWNsZVwiO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vL1RPRE86IGV2ZW50cy50c1xuLy9UT0RPOiBnbG9iYWxDU1NSdWxlc1xuZXhwb3J0IHtMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5pbXBvcnQgXCIuL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnNcIjtcblxuZXhwb3J0IHtTaGFkb3dDZmd9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB7bGlzcywgbGlzc1N5bmN9IGZyb20gXCIuL2hlbHBlcnMvYnVpbGRcIjtcbmV4cG9ydCB7ZXZlbnRNYXRjaGVzLCBXaXRoRXZlbnRzLCBFdmVudFRhcmdldDIsIEN1c3RvbUV2ZW50Mn0gZnJvbSAnLi9oZWxwZXJzL2V2ZW50cyc7XG5leHBvcnQge2h0bWx9IGZyb20gXCIuL3V0aWxzXCI7XG5leHBvcnQgZGVmYXVsdCBMSVNTO1xuXG4vLyBmb3IgZGVidWcuXG5leHBvcnQge19leHRlbmRzfSBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbi8vIHJlcXVpcmVkIGZvciBhdXRvIG1vZGUgaXQgc2VlbXMuXG4vLyBAdHMtaWdub3JlXG5nbG9iYWxUaGlzLkxJU1MgPSBMSVNTOyJdLCJuYW1lcyI6WyJnZXRTaGFyZWRDU1MiLCJTaGFkb3dDZmciLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNET01Db250ZW50TG9hZGVkIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsInNoYXJlZENTUyIsIkNvbnRlbnRHZW5lcmF0b3IiLCJkYXRhIiwiY29uc3RydWN0b3IiLCJodG1sIiwiY3NzIiwic2hhZG93IiwicHJlcGFyZUhUTUwiLCJwcmVwYXJlQ1NTIiwic2V0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsImlzUmVhZHkiLCJ3aGVuUmVhZHkiLCJnZW5lcmF0ZSIsImhvc3QiLCJ0YXJnZXQiLCJpbml0U2hhZG93IiwiaW5qZWN0Q1NTIiwiY29udGVudCIsImNsb25lTm9kZSIsInNoYWRvd01vZGUiLCJOT05FIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsInJlcGxhY2VDaGlsZHJlbiIsIlNoYWRvd1Jvb3QiLCJhcHBlbmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJjYW5IYXZlU2hhZG93IiwiRXJyb3IiLCJtb2RlIiwiT1BFTiIsImF0dGFjaFNoYWRvdyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImUiLCJwcm9jZXNzQ1NTIiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJ1bmRlZmluZWQiLCJzdHIiLCJ0cmltIiwiaW5uZXJIVE1MIiwiSFRNTEVsZW1lbnQiLCJzdHlsZXNoZWV0cyIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsInB1c2giLCJjc3NzZWxlY3RvciIsIkNTU1NlbGVjdG9yIiwiaGFzIiwic2V0QXR0cmlidXRlIiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJyZXBsYWNlIiwiaGVhZCIsImFkZCIsImJ1aWxkTElTU0hvc3QiLCJzZXRDc3RyQ29udHJvbGVyIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJMSVNTIiwiYXJncyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsImNvbnRlbnRfZ2VuZXJhdG9yIiwiTElTU0NvbnRyb2xlciIsIkhvc3QiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJuYW1lIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImNvbm5lY3RlZENhbGxiYWNrIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJpc0Nvbm5lY3RlZCIsIl9Ib3N0IiwiU3RhdGVzIiwiaWQiLCJfX2NzdHJfY29udHJvbGVyIiwiTGlzcyIsImhvc3RDc3RyIiwiY29udGVudF9nZW5lcmF0b3JfY3N0ciIsIkxJU1NIb3N0IiwiQ2ZnIiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiQ29udHJvbGVyIiwiY29udHJvbGVyIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJwYXJhbXMiLCJpbml0IiwiYXR0YWNoSW50ZXJuYWxzIiwic3RhdGVzIiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwiTElTU19VUEdSQURFRCIsInRoZW4iLCJMSVNTX1JFQURZIiwicHJvbWlzZSIsInJlc29sdmUiLCJQcm9taXNlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiTElTU19JTklUSUFMSVpFRCIsImRlZmluZSIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsImJyeV9jbGFzcyIsIl9fYmFzZXNfXyIsImZpbHRlciIsIl9fbmFtZV9fIiwiX2pzX2tsYXNzIiwiJGpzX2Z1bmMiLCJfX0JSWVRIT05fXyIsIiRjYWxsIiwiJGdldGF0dHJfcGVwNjU3IiwiQ2xhc3MiLCJodG1sdGFnIiwib3B0cyIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0TmFtZSIsImVsZW1lbnQiLCJFbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImlzRGVmaW5lZCIsImVsZW0iLCJnZXQiLCJ3aGVuRGVmaW5lZCIsImdldEhvc3RDc3RyIiwiZ2V0SG9zdENzdHJTeW5jIiwiaXNVcGdyYWRlZCIsInVwZ3JhZGVTeW5jIiwid2hlblVwZ3JhZGVkIiwiZ2V0Q29udHJvbGVyIiwiZ2V0Q29udHJvbGVyU3luYyIsImluaXRpYWxpemVTeW5jIiwiZ2V0Q29udHJvbGVyQ3N0ciIsImdldENvbnRyb2xlckNzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsImdldEhvc3QiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZ2V0SG9zdFN5bmMiLCJfTElTUyIsIklMSVNTIiwiY2ZnIiwiYXNzaWduIiwiRXh0ZW5kZWRMSVNTIiwic2NyaXB0IiwiUkVTU09VUkNFUyIsIktub3duVGFncyIsIl9jZGlyIiwiU1ciLCJzd19wYXRoIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic2NvcGUiLCJlcnJvciIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiYnJ5dGhvbiIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtdXRhdGlvbiIsImFkZGl0aW9uIiwiYWRkZWROb2RlcyIsImFkZFRhZyIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwidGFnIiwiaW1wb3J0Q29tcG9uZW50IiwiY2RpciIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwiY19qcyIsImtsYXNzIiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwib2xkcmVxIiwicmVxdWlyZSIsInN0YXJ0c1dpdGgiLCJmaWxlbmFtZSIsInNsaWNlIiwiZGVmYXVsdCIsIkxJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IiLCJfZmV0Y2hUZXh0IiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImFuc3dlciIsInRleHQiLCJfaW1wb3J0IiwibG9nIiwiY29udmVydGVyIiwiZW5jb2RlSFRNTCIsInRleHRDb250ZW50IiwibWF0Y2giLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImNzc19hdHRyIiwic2V0UHJvcGVydHkiLCJpbXBvcnRDb21wb25lbnRzIiwiY29tcG9uZW50cyIsInJlc3VsdHMiLCJicnlfd3JhcHBlciIsImNvbXBvX2RpciIsImNvZGUiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsImlkeCIsInByb21pc2VzIiwiYWxsIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwiZ2xvYmFsVGhpcyJdLCJzb3VyY2VSb290IjoiIn0=