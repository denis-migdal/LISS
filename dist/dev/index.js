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
        //if( target instanceof ShadowRoot && target.childNodes.length === 0)
        //	target.append( document.createElement('slot') );
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
        //#internals = this.attachInternals();
        //#states    = this.#internals.states;
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
            //this.#states.add(States.LISS_UPGRADED);
            content_generator.whenReady().then(()=>{
            //this.#states.add(States.LISS_READY);
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
            //this.#states.add(States.LISS_INITIALIZED);
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
    if (!host.isInitialized) return host.initialize();
    return host.controler;
}
function getControlerSync(elem) {
    const host = (0,_UPGRADED__WEBPACK_IMPORTED_MODULE_0__.upgradeSync)(elem);
    if (!(0,_READY__WEBPACK_IMPORTED_MODULE_1__.isReady)(host)) throw new Error("Dependancies not ready !");
    if (!host.isInitialized) return host.initialize();
    return host.controler;
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
    opts = Object.assign({}, cfg, cfg.args, opts);
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
/* harmony import */ var _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LifeCycle/DEFINED */ "./src/LifeCycle/DEFINED.ts");



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
    opts.html ??= files["index.html"];
    console.warn(opts, files);
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
    (0,_LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.define)(tagname, klass);
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
    console.warn("import", tagname, files);
    if (files === null) {
        files = {};
        const file = brython === "true" ? 'index.bry' : 'index.js';
        files[file] = await _fetchText(`${compo_dir}${file}`, true);
        //TODO!!!
        try {
            files["index.html"] = await _fetchText(`${compo_dir}index.html`, true);
        } catch (e) {}
        try {
            files["index.css"] = await _fetchText(`${compo_dir}index.css`, true);
        } catch (e) {}
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
/* harmony import */ var _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../LifeCycle/INITIALIZED */ "./src/LifeCycle/INITIALIZED.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");


async function liss(str, ...args) {
    const elem = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return await (0,_LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
}
function lissSync(str, ...args) {
    const elem = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return (0,_LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
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
/* harmony import */ var _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LifeCycle/INITIALIZED */ "./src/LifeCycle/INITIALIZED.ts");


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
    return await (0,_LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(element);
}
async function qsa(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const promises = new Array(elements.length);
    for (let element of elements)promises[idx++] = (0,_LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(element);
    return await Promise.all(promises);
}
async function qsc(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return await (0,_LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(result);
}
function qsSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null) throw new Error(`Element ${selector} not found`);
    return (0,_LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(element);
}
function qsaSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const result = new Array(elements.length);
    for (let element of elements)result[idx++] = (0,_LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(element);
    return result;
}
function qscSync(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return (0,_LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(result);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cEQsSUFBSWhSLFdBQVdnQyxTQUFTQyxhQUFhLENBQUM7SUFDdEMsdURBQXVEO0lBQ3ZEakMsU0FBU3FDLFNBQVMsR0FBRzBPLE9BQU8zTyxJQUFJO0lBRWhDLElBQUlwQyxTQUFTUSxPQUFPLENBQUNJLFVBQVUsQ0FBQ0MsTUFBTSxLQUFLLEtBQUtiLFNBQVNRLE9BQU8sQ0FBQ3lRLFVBQVUsQ0FBRUMsUUFBUSxLQUFLQyxLQUFLQyxTQUFTLEVBQ3RHLE9BQU9wUixTQUFTUSxPQUFPLENBQUN5USxVQUFVO0lBRXBDLE9BQU9qUixTQUFTUSxPQUFPO0FBQzNCOzs7Ozs7O1NDeEhBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZCO0FBRUg7QUFFcUM7QUFFL0QsaUJBQWlCO0FBQ2pCLHNCQUFzQjtBQUN1QztBQUMzQjtBQUVBO0FBRWE7QUFDdUM7QUFDekQ7QUFDN0IsaUVBQWVvRCxnREFBSUEsRUFBQztBQUVwQixhQUFhO0FBQ3NCO0FBRW5DLG1DQUFtQztBQUNuQyxhQUFhO0FBQ2J5TixXQUFXek4sSUFBSSxHQUFHQSxnREFBSUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQ29udHJvbGVyLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0hvc3QudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MaWZlQ3ljbGUvREVGSU5FRC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xpZmVDeWNsZS9JTklUSUFMSVpFRC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xpZmVDeWNsZS9SRUFEWS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xpZmVDeWNsZS9VUEdSQURFRC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xpZmVDeWNsZS9zdGF0ZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9jb3JlL0xpZmVDeWNsZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2V4dGVuZHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL0xJU1NBdXRvLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9idWlsZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvZXZlbnRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9xdWVyeVNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xJU1MvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2hhcmVkQ1NTIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IExIb3N0LCBTaGFkb3dDZmcgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCBpc1NoYWRvd1N1cHBvcnRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG50eXBlIEhUTUwgPSBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZztcbnR5cGUgQ1NTICA9IHN0cmluZ3xDU1NTdHlsZVNoZWV0fEhUTUxTdHlsZUVsZW1lbnQ7XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHtcbiAgICBodG1sICAgPzogRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmcsXG4gICAgY3NzICAgID86IENTUyB8IHJlYWRvbmx5IENTU1tdLFxuICAgIHNoYWRvdyA/OiBTaGFkb3dDZmd8bnVsbFxufVxuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yQ3N0ciA9IHsgbmV3KG9wdHM6IENvbnRlbnRHZW5lcmF0b3JfT3B0cyk6IENvbnRlbnRHZW5lcmF0b3IgfTtcblxuY29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuY29uc3Qgc2hhcmVkQ1NTID0gZ2V0U2hhcmVkQ1NTKCk7IC8vIGZyb20gTElTU0hvc3QuLi5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudEdlbmVyYXRvciB7XG5cbiAgICAjc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXTtcbiAgICAjdGVtcGxhdGUgICA6IEhUTUxUZW1wbGF0ZUVsZW1lbnR8bnVsbDtcbiAgICAjc2hhZG93ICAgICA6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgcHJvdGVjdGVkIGRhdGE6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgaHRtbCxcbiAgICAgICAgY3NzICAgID0gW10sXG4gICAgICAgIHNoYWRvdyA9IG51bGwsXG4gICAgfTogQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge30pIHtcblxuICAgICAgICB0aGlzLiNzaGFkb3cgICA9IHNoYWRvdztcbiAgICAgICAgdGhpcy4jdGVtcGxhdGUgPSB0aGlzLnByZXBhcmVIVE1MKGh0bWwpO1xuICAgIFxuICAgICAgICB0aGlzLiNzdHlsZXNoZWV0cyA9IHRoaXMucHJlcGFyZUNTUyhjc3MpO1xuXG4gICAgICAgIHRoaXMuI2lzUmVhZHkgICA9IGlzRE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICB0aGlzLiN3aGVuUmVhZHkgPSB3aGVuRE9NQ29udGVudExvYWRlZCgpO1xuXG4gICAgICAgIC8vVE9ETzogb3RoZXIgZGVwcy4uLlxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRUZW1wbGF0ZSh0ZW1wbGF0ZTogSFRNTFRlbXBsYXRlRWxlbWVudCkge1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cblxuICAgICN3aGVuUmVhZHk6IFByb21pc2U8dW5rbm93bj47XG4gICAgI2lzUmVhZHkgIDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNpc1JlYWR5O1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW5SZWFkeSgpIHtcblxuICAgICAgICBpZiggdGhpcy4jaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuI3doZW5SZWFkeTtcbiAgICAgICAgLy9UT0RPOiBkZXBzLlxuICAgICAgICAvL1RPRE86IENTUy9IVE1MIHJlc291cmNlcy4uLlxuXG4gICAgICAgIC8vIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG4gICAgICAgIC8vIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuICAgICAgICAvLyArIGNmIGF0IHRoZSBlbmQuLi5cbiAgICB9XG5cbiAgICBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudHxTaGFkb3dSb290IHtcblxuICAgICAgICAvL1RPRE86IHdhaXQgcGFyZW50cy9jaGlsZHJlbiBkZXBlbmRpbmcgb24gb3B0aW9uLi4uICAgICBcblxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmluaXRTaGFkb3coaG9zdCk7XG5cbiAgICAgICAgdGhpcy5pbmplY3RDU1ModGFyZ2V0LCB0aGlzLiNzdHlsZXNoZWV0cyk7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuI3RlbXBsYXRlIS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgaWYoIGhvc3Quc2hhZG93TW9kZSAhPT0gU2hhZG93Q2ZnLk5PTkUgfHwgdGFyZ2V0LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwIClcbiAgICAgICAgICAgIHRhcmdldC5yZXBsYWNlQ2hpbGRyZW4oY29udGVudCk7XG5cbiAgICAgICAgLy9pZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCAmJiB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApXG5cdFx0Ly9cdHRhcmdldC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoaG9zdCk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFNoYWRvdzxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpIHtcblxuICAgICAgICBjb25zdCBjYW5IYXZlU2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCk7XG4gICAgICAgIGlmKCB0aGlzLiNzaGFkb3cgIT09IG51bGwgJiYgdGhpcy4jc2hhZG93ICE9PSBTaGFkb3dDZmcuTk9ORSAmJiAhIGNhbkhhdmVTaGFkb3cgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgICAgICBsZXQgbW9kZSA9IHRoaXMuI3NoYWRvdztcbiAgICAgICAgaWYoIG1vZGUgPT09IG51bGwgKVxuICAgICAgICAgICAgbW9kZSA9IGNhbkhhdmVTaGFkb3cgPyBTaGFkb3dDZmcuT1BFTiA6IFNoYWRvd0NmZy5OT05FO1xuXG4gICAgICAgIGhvc3Quc2hhZG93TW9kZSA9IG1vZGU7XG5cbiAgICAgICAgbGV0IHRhcmdldDogSG9zdHxTaGFkb3dSb290ID0gaG9zdDtcbiAgICAgICAgaWYoIG1vZGUgIT09IFNoYWRvd0NmZy5OT05FKVxuICAgICAgICAgICAgdGFyZ2V0ID0gaG9zdC5hdHRhY2hTaGFkb3coe21vZGV9KTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlQ1NTKGNzczogQ1NTfHJlYWRvbmx5IENTU1tdKSB7XG4gICAgICAgIGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG4gICAgICAgICAgICBjc3MgPSBbY3NzXTtcblxuICAgICAgICByZXR1cm4gY3NzLm1hcChlID0+IHRoaXMucHJvY2Vzc0NTUyhlKSApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcm9jZXNzQ1NTKGNzczogQ1NTKSB7XG5cbiAgICAgICAgaWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcbiAgICAgICAgICAgIHJldHVybiBjc3M7XG4gICAgICAgIGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuICAgICAgICAgICAgcmV0dXJuIGNzcy5zaGVldCE7XG4gICAgXG4gICAgICAgIGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICAgICAgICAgIHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7IC8vIHJlcGxhY2UoKSBpZiBpc3N1ZXNcbiAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3VyXCIpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlSFRNTChodG1sPzogSFRNTCk6IEhUTUxUZW1wbGF0ZUVsZW1lbnR8bnVsbCB7XG4gICAgXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblxuICAgICAgICBpZihodG1sID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG5cbiAgICAgICAgLy8gc3RyMmh0bWxcbiAgICAgICAgaWYodHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zdCBzdHIgPSBodG1sLnRyaW0oKTtcblxuICAgICAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIGh0bWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCApXG4gICAgICAgICAgICBodG1sID0gaHRtbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgdGVtcGxhdGUuYXBwZW5kKGh0bWwpO1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaW5qZWN0Q1NTPEhvc3QgZXh0ZW5kcyBMSG9zdD4odGFyZ2V0OiBTaGFkb3dSb290fEhvc3QsIHN0eWxlc2hlZXRzOiBhbnlbXSkge1xuXG4gICAgICAgIGlmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICkge1xuICAgICAgICAgICAgdGFyZ2V0LmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUywgLi4uc3R5bGVzaGVldHMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3Nzc2VsZWN0b3IgPSB0YXJnZXQuQ1NTU2VsZWN0b3I7IC8vVE9ETy4uLlxuXG4gICAgICAgIGlmKCBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cbiAgICAgICAgbGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuICAgICAgICBmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuICAgICAgICAgICAgZm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuICAgICAgICAgICAgICAgIGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuICAgICAgICBhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcbiAgICB9XG59XG5cbi8vIGlkZW0gSFRNTC4uLlxuLyogaWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIGMgPSBhd2FpdCBjO1xuICAgICAgICAgICAgaWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG4gICAgICAgICAgICAgICAgYyA9IGF3YWl0IGMudGV4dCgpO1xuXG4gICAgICAgICAgICBzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cbiAgICAgICAgfSkoKSk7XG5cbiAgICAgICAgcmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuICAgIH1cbiovIiwiaW1wb3J0IHsgTEhvc3RDc3RyLCB0eXBlIENsYXNzLCB0eXBlIENvbnN0cnVjdG9yLCB0eXBlIExJU1NfT3B0cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QsIHNldENzdHJDb250cm9sZXIgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZX0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLyoqKiovXG5cbmludGVyZmFjZSBJQ29udHJvbGVyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4ge1xuXHQvLyBub24tdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IGhvc3Q6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IGlzQ29ubmVjdGVkICA6Ym9vbGVhbjtcbn07XG5cdC8vICsgcHJvdGVjdGVkXG5cdFx0Ly8gcmVhZG9ubHkgLmNvbnRlbnQ6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdDtcblx0Ly8gdmFuaWxsYSBKU1xuXHRcdC8vIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKTogdm9pZDtcblx0XHQvLyBjb25uZWN0ZWRDYWxsYmFjayAgICgpOiB2b2lkO1xuXHRcdC8vIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQ7XG5cbmludGVyZmFjZSBJQ29udHJvbGVyQ3N0cjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0bmV3KCk6IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPjtcblxuXHQvLyB2YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXTtcbn1cblx0Ly8gKyBcInByaXZhdGVcIlxuXHRcdC8vIHJlYWRvbmx5IEhvc3Q6IEhvc3RDc3RyXG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+ID0gSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+ICYgSW5zdGFuY2VUeXBlPEV4dGVuZHNDc3RyPjtcblxuZXhwb3J0IHR5cGUgQ29udHJvbGVyQ3N0cjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+ID0gSUNvbnRyb2xlckNzdHI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEV4dGVuZHNDc3RyO1xuXG4vKioqKi9cblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+KGFyZ3M6IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4+ID0ge30pIHtcblxuXHRsZXQge1xuXHRcdC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuXHRcdGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0ICAgICAgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3N0cixcblx0XHRob3N0ICAgICAgICAgICAgICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdFxuXHRcdGNvbnRlbnRfZ2VuZXJhdG9yID0gQ29udGVudEdlbmVyYXRvcixcblx0fSA9IGFyZ3M7XG5cdFxuXHRjbGFzcyBMSVNTQ29udHJvbGVyIGV4dGVuZHMgX2V4dGVuZHMgaW1wbGVtZW50cyBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj57XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsICkge1xuXHRcdFx0XHRzZXRDc3RyQ29udHJvbGVyKHRoaXMpO1xuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3QoLi4uYXJncyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5jb250ZW50ITtcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7fVxuXG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ob3N0LmlzQ29ubmVjdGVkO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBJbnN0YW5jZVR5cGU8TEhvc3RDc3RyPEhvc3RDc3RyPj47XG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBfSG9zdDogTEhvc3RDc3RyPEhvc3RDc3RyPjtcblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmU6IGZ1Y2sgb2ZmLlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCggdGhpcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRob3N0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NDb250cm9sZXIgc2F0aXNmaWVzIENvbnRyb2xlckNzdHI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPjtcbn0iLCJpbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIFNoYWRvd0NmZywgdHlwZSBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCB7IFN0YXRlcyB9IGZyb20gXCIuL0xpZmVDeWNsZS9zdGF0ZXNcIjtcblxuLy8gTElTU0hvc3QgbXVzdCBiZSBidWlsZCBpbiBkZWZpbmUgYXMgaXQgbmVlZCB0byBiZSBhYmxlIHRvIGJ1aWxkXG4vLyB0aGUgZGVmaW5lZCBzdWJjbGFzcy5cblxubGV0IGlkID0gMDtcblxuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFyZWRDU1MoKSB7XG5cdHJldHVybiBzaGFyZWRDU1M7XG59XG5cbmxldCBfX2NzdHJfY29udHJvbGVyICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RyQ29udHJvbGVyKF86IGFueSkge1xuXHRfX2NzdHJfY29udHJvbGVyID0gXztcbn1cblxudHlwZSBpbmZlckhvc3RDc3RyPFQ+ID0gVCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPGluZmVyIEEgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sIGluZmVyIEIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID8gQiA6IG5ldmVyO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMSVNTSG9zdDxcdFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0ciwgVSBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IGluZmVySG9zdENzdHI8VD4gPihcblx0XHRcdFx0XHRcdFx0TGlzczogVCxcblx0XHRcdFx0XHRcdFx0Ly8gY2FuJ3QgZGVkdWNlIDogY2F1c2UgdHlwZSBkZWR1Y3Rpb24gaXNzdWVzLi4uXG5cdFx0XHRcdFx0XHRcdGhvc3RDc3RyOiBVLFxuXHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcl9jc3RyOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcblx0XHRcdFx0XHRcdFx0YXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuXHRcdFx0XHRcdFx0KSB7XG5cblx0Y29uc3QgY29udGVudF9nZW5lcmF0b3IgPSBuZXcgY29udGVudF9nZW5lcmF0b3JfY3N0cihhcmdzKTtcblxuXHR0eXBlIEhvc3RDc3RyID0gVTtcbiAgICB0eXBlIEhvc3QgICAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuXHRjbGFzcyBMSVNTSG9zdCBleHRlbmRzIGhvc3RDc3RyIHtcblxuXHRcdHN0YXRpYyByZWFkb25seSBDZmcgPSB7XG5cdFx0XHRob3N0ICAgICAgICAgICAgIDogaG9zdENzdHIsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogY29udGVudF9nZW5lcmF0b3JfY3N0cixcblx0XHRcdGFyZ3Ncblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gREVQRU5ERU5DSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdHN0YXRpYyByZWFkb25seSB3aGVuRGVwc1Jlc29sdmVkID0gY29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCk7XG5cdFx0c3RhdGljIGdldCBpc0RlcHNSZXNvbHZlZCgpIHtcblx0XHRcdHJldHVybiBjb250ZW50X2dlbmVyYXRvci5pc1JlYWR5O1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0c3RhdGljIENvbnRyb2xlciA9IExpc3M7XG5cblx0XHQjY29udHJvbGVyOiBhbnl8bnVsbCA9IG51bGw7XG5cdFx0Z2V0IGNvbnRyb2xlcigpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXI7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyICE9PSBudWxsO1xuXHRcdH1cblx0XHRyZWFkb25seSB3aGVuSW5pdGlhbGl6ZWQ6IFByb21pc2U8SW5zdGFuY2VUeXBlPFQ+Pjtcblx0XHQjd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyO1xuXG5cdFx0Ly9UT0RPOiBnZXQgcmVhbCBUUyB0eXBlID9cblx0XHQjcGFyYW1zOiBhbnlbXTtcblx0XHRpbml0aWFsaXplKC4uLnBhcmFtczogYW55W10pIHtcblxuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgKCB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNEZXBzUmVzb2x2ZWQgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY2llcyBoYXNuJ3QgYmVlbiBsb2FkZWQgIVwiKTtcblxuXHRcdFx0aWYoIHBhcmFtcy5sZW5ndGggIT09IDAgKSB7XG5cdFx0XHRcdGlmKCB0aGlzLiNwYXJhbXMubGVuZ3RoICE9PSAwIClcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NzdHIgcGFyYW1zIGhhcyBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgIScpO1xuXHRcdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Ly8jaW50ZXJuYWxzID0gdGhpcy5hdHRhY2hJbnRlcm5hbHMoKTtcblx0XHQvLyNzdGF0ZXMgICAgPSB0aGlzLiNpbnRlcm5hbHMuc3RhdGVzO1xuXHRcdCNjb250ZW50OiBIb3N0fFNoYWRvd1Jvb3QgPSB0aGlzIGFzIEhvc3Q7XG5cblx0XHRnZXQgY29udGVudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250ZW50O1xuXHRcdH1cblxuXHRcdGdldFBhcnQobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cdFx0Z2V0UGFydHMobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cblx0XHRvdmVycmlkZSBhdHRhY2hTaGFkb3coaW5pdDogU2hhZG93Um9vdEluaXQpOiBTaGFkb3dSb290IHtcblx0XHRcdGNvbnN0IHNoYWRvdyA9IHN1cGVyLmF0dGFjaFNoYWRvdyhpbml0KTtcblxuXHRcdFx0Ly8gQHRzLWlnbm9yZSBjbG9zZWQgSVMgYXNzaWduYWJsZSB0byBzaGFkb3dNb2RlLi4uXG5cdFx0XHR0aGlzLnNoYWRvd01vZGUgPSBpbml0Lm1vZGU7XG5cblx0XHRcdHRoaXMuI2NvbnRlbnQgPSBzaGFkb3c7XG5cdFx0XHRcblx0XHRcdHJldHVybiBzaGFkb3c7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldCBoYXNTaGFkb3coKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zaGFkb3dNb2RlICE9PSAnbm9uZSc7XG5cdFx0fVxuXG5cdFx0LyoqKiBDU1MgKioqL1xuXG5cdFx0Z2V0IENTU1NlbGVjdG9yKCkge1xuXG5cdFx0XHRpZih0aGlzLmhhc1NoYWRvdyB8fCAhIHRoaXMuaGFzQXR0cmlidXRlKFwiaXNcIikgKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdOYW1lO1xuXG5cdFx0XHRyZXR1cm4gYCR7dGhpcy50YWdOYW1lfVtpcz1cIiR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJpc1wiKX1cIl1gO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IEltcGwgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Y29uc3RydWN0b3IoLi4ucGFyYW1zOiBhbnlbXSkge1xuXHRcdFx0c3VwZXIoKTtcblxuXHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX1VQR1JBREVEKTtcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfUkVBRFkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGNvbnN0IGNvbnRyb2xlciA9IF9fY3N0cl9jb250cm9sZXI7XG5cdFx0XHRfX2NzdHJfY29udHJvbGVyID0gbnVsbDtcblxuXHRcdFx0aWYoIGNvbnRyb2xlciAhPT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBjb250cm9sZXI7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdGlmKHRoaXMuY29udHJvbGVyICE9PSBudWxsKVxuXHRcdFx0XHR0aGlzLmNvbnRyb2xlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuY29udHJvbGVyIS5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGluc3RhbmNlIGRlcHNcblx0XHRcdGlmKCBjb250ZW50X2dlbmVyYXRvci5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCggYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdGF3YWl0IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gTElTU0hvc3QuQ29udHJvbGVyLm9ic2VydmVkQXR0cmlidXRlcztcblx0XHR9XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKHRoaXMuI2NvbnRyb2xlcilcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXHRcdH1cblxuXHRcdHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsID0gbnVsbDtcblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblxuXHRcdFx0Ly8gbm8gbmVlZHMgdG8gc2V0IHRoaXMuI2NvbnRlbnQgKGFscmVhZHkgaG9zdCBvciBzZXQgd2hlbiBhdHRhY2hTaGFkb3cpXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvci5nZW5lcmF0ZSh0aGlzKTtcblxuXHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXG5cdFx0XHRpZiggdGhpcy4jY29udHJvbGVyID09PSBudWxsKSB7XG5cdFx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBuZXcgTElTU0hvc3QuQ29udHJvbGVyKC4uLnRoaXMuI3BhcmFtcykgYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXHRcdFx0fVxuXG5cdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfSU5JVElBTElaRUQpO1xuXG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIodGhpcy5jb250cm9sZXIpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb250cm9sZXI7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBMSVNTSG9zdDtcbn1cblxuXG4iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPiA9IHN0cmluZ3xUfExJU1NIb3N0Q3N0cjxUPnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+KSB7XG5cblx0bGV0IEhvc3Q6IExJU1NIb3N0Q3N0cjxUPiA9IENvbXBvbmVudENsYXNzIGFzIGFueTtcblxuXHQvLyBCcnl0aG9uIGNsYXNzXG5cdGxldCBicnlfY2xhc3M6IGFueSA9IG51bGw7XG5cdGlmKCBcIiRpc19jbGFzc1wiIGluIENvbXBvbmVudENsYXNzICkge1xuXG5cdFx0YnJ5X2NsYXNzID0gQ29tcG9uZW50Q2xhc3M7XG5cblx0XHRDb21wb25lbnRDbGFzcyA9IGJyeV9jbGFzcy5fX2Jhc2VzX18uZmlsdGVyKCAoZTogYW55KSA9PiBlLl9fbmFtZV9fID09PSBcIldyYXBwZXJcIilbMF0uX2pzX2tsYXNzLiRqc19mdW5jO1xuXHRcdChDb21wb25lbnRDbGFzcyBhcyBhbnkpLkhvc3QuQ29udHJvbGVyID0gY2xhc3Mge1xuXG5cdFx0XHQjYnJ5OiBhbnk7XG5cblx0XHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0dGhpcy4jYnJ5ID0gX19CUllUSE9OX18uJGNhbGwoYnJ5X2NsYXNzLCBbMCwwLDBdKSguLi5hcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0I2NhbGwobmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBfX0JSWVRIT05fXy4kY2FsbChfX0JSWVRIT05fXy4kZ2V0YXR0cl9wZXA2NTcodGhpcy4jYnJ5LCBuYW1lLCBbMCwwLDBdKSwgWzAsMCwwXSkoLi4uYXJncylcblx0XHRcdH1cblxuXHRcdFx0Z2V0IGhvc3QoKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIFwiaG9zdFwiLCBbMCwwLDBdKVxuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYnJ5X2NsYXNzW1wib2JzZXJ2ZWRBdHRyaWJ1dGVzXCJdO1xuXG5cdFx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmKCBcIkhvc3RcIiBpbiBDb21wb25lbnRDbGFzcyApXG5cdFx0SG9zdCA9IENvbXBvbmVudENsYXNzLkhvc3QgYXMgYW55O1xuICAgIFxuICAgIGNvbnN0IENsYXNzICA9IEhvc3QuQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIEhvc3QsIG9wdHMpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnR8TElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0cnxMSVNTSG9zdDxMSVNTQ29udHJvbGVyPnxMSVNTSG9zdENzdHI8TElTU0NvbnRyb2xlcj4gKTogc3RyaW5nIHtcblxuICAgIC8vIGluc3RhbmNlXG4gICAgaWYoIFwiaG9zdFwiIGluIGVsZW1lbnQpXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lmhvc3Q7XG4gICAgaWYoIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgXG4gICAgICAgIGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLy8gY3N0clxuXG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50KVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5Ib3N0IGFzIHVua25vd24gYXMgTElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+O1xuXG4gICAgY29uc3QgbmFtZSA9IGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoIGVsZW1lbnQgKTtcbiAgICBpZihuYW1lID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IGlzIG5vdCBkZWZpbmVkIVwiKTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgaWYoIFwiSG9zdFwiIGluIGVsZW0pXG4gICAgICAgIGVsZW0gPSBlbGVtLkhvc3QgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSBhcyBhbnkpICE9PSBudWxsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3RDc3RyPFQ+PiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKGVsZW0pO1xuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pIGFzIExJU1NIb3N0Q3N0cjxUPjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBsaXN0ZW4gZGVmaW5lLi4uXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn1cblxuLypcbi8vIFRPRE86IGltcGxlbWVudFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5BbGxEZWZpbmVkKHRhZ25hbWVzOiByZWFkb25seSBzdHJpbmdbXSkgOiBQcm9taXNlPHZvaWQ+IHtcblx0YXdhaXQgUHJvbWlzZS5hbGwoIHRhZ25hbWVzLm1hcCggdCA9PiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0KSApIClcbn1cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdENzdHI8VD4+IHtcbiAgICAvLyB3ZSBjYW4ndCBmb3JjZSBhIGRlZmluZS5cbiAgICByZXR1cm4gd2hlbkRlZmluZWQoZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0clN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IExJU1NIb3N0Q3N0cjxUPiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKSB7XG5cbiAgICAgICAgbGV0IGhvc3QgPSBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSk7XG4gICAgICAgIGlmKCBob3N0ID09PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2VsZW19IG5vdCBkZWZpbmVkIHlldCFgKTtcblxuICAgICAgICByZXR1cm4gaG9zdCBhcyB1bmtub3duIGFzIExJU1NIb3N0Q3N0cjxUPjtcbiAgICB9XG5cbiAgICBpZiggXCJIb3N0XCIgaW4gZWxlbSlcbiAgICAgICAgZWxlbSA9IGVsZW0uSG9zdCBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICBpZiggY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtIGFzIGFueSkgPT09IG51bGwgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZWxlbX0gbm90IGRlZmluZWQgeWV0IWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3RDc3RyPFQ+O1xufSIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgaXNVcGdyYWRlZCwgdXBncmFkZSwgdXBncmFkZVN5bmMsIHdoZW5VcGdyYWRlZCB9IGZyb20gXCIuL1VQR1JBREVEXCI7XG5pbXBvcnQgeyBpc1JlYWR5LCB3aGVuUmVhZHkgfSBmcm9tIFwiLi9SRUFEWVwiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IExJU1NIb3N0PFQ+fEhUTUxFbGVtZW50O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggISBpc1VwZ3JhZGVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIGVsZW0uaXNJbml0aWFsaXplZDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgd2hlblVwZ3JhZGVkKGVsZW0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkIGFzIFQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb250cm9sZXI8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcbiAgICBhd2FpdCB3aGVuUmVhZHkoaG9zdCk7XG5cbiAgICAvL1RPRE86IGluaXRpYWxpemVTeW5jIHZzIGluaXRpYWxpemUgP1xuICAgIGlmKCAhIGhvc3QuaXNJbml0aWFsaXplZCApXG4gICAgICAgIHJldHVybiBob3N0LmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBob3N0LmNvbnRyb2xlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlclN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogVCB7XG4gICAgXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuICAgIGlmKCAhIGlzUmVhZHkoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRhbmNpZXMgbm90IHJlYWR5ICFcIilcblxuICAgIGlmKCAhIGhvc3QuaXNJbml0aWFsaXplZCApXG4gICAgICAgIHJldHVybiBob3N0LmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBob3N0LmNvbnRyb2xlcjtcbn1cblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemUgICAgID0gZ2V0Q29udHJvbGVyO1xuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVTeW5jID0gZ2V0Q29udHJvbGVyU3luYzsiLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRIb3N0Q3N0clN5bmMsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi9ERUZJTkVEXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPiA9IHN0cmluZ3xUfExJU1NIb3N0Q3N0cjxUPnxJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhZHk8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCAhIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICBjb25zdCBob3N0Q3N0ciA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIHJldHVybiBob3N0Q3N0ci5pc0RlcHNSZXNvbHZlZDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5SZWFkeTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3QgaG9zdENzdHIgPSBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcbiAgICBhd2FpdCBob3N0Q3N0ci53aGVuRGVwc1Jlc29sdmVkO1xuXG4gICAgcmV0dXJuIGhvc3RDc3RyLkNvbnRyb2xlciBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgLy8gd2UgY2FuJ3QgZm9yY2UgYSByZWFkeS5cbiAgICByZXR1cm4gd2hlblJlYWR5KGVsZW0pIGFzIFByb21pc2U8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJDc3RyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogVCB7XG4gICAgXG4gICAgaWYoICEgaXNSZWFkeShlbGVtKSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICByZXR1cm4gZ2V0SG9zdENzdHJTeW5jKGVsZW0pLkNvbnRyb2xlciBhcyBUO1xufSIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRIb3N0Q3N0clN5bmMsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi9ERUZJTkVEXCI7XG5cbnR5cGUgUGFyYW08X1QgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IEhUTUxFbGVtZW50O1xuXG4vL1RPRE86IHVwZ3JhZGUgZnVuY3Rpb24uLi5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVXBncmFkZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+fExJU1NIb3N0PFQ+KTogZWxlbSBpcyBMSVNTSG9zdDxUPiB7XG5cbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBIb3N0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3Q8VD4+IHtcbiAgICBcbiAgICBjb25zdCBIb3N0ID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICAvLyBhbHJlYWR5IHVwZ3JhZGVkXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIb3N0KVxuICAgICAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcblxuICAgIC8vIGg0Y2tcblxuICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG4gICAgfVxuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgXG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRIb3N0PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3Q8VD4+IHtcbiAgICBcbiAgICBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IExJU1NIb3N0PFQ+IHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCBkZWZpbmVkICFcIik7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBjb25zdCB1cGdyYWRlICAgICA9IGdldEhvc3Q7XG5leHBvcnQgY29uc3QgdXBncmFkZVN5bmMgPSBnZXRIb3N0U3luYyIsImV4cG9ydCBlbnVtIFN0YXRlcyB7XG4gICAgTElTU19ERUZJTkVEICAgICA9IFwiTElTU19ERUZJTkVEXCIsXG4gICAgTElTU19VUEdSQURFRCAgICA9IFwiTElTU19VUEdSQURFRFwiLFxuICAgIExJU1NfUkVBRFkgICAgICAgPSBcIkxJU1NfUkVBRFlcIixcbiAgICBMSVNTX0lOSVRJQUxJWkVEID0gXCJMSVNTX0lOSVRJQUxJWkVEXCJcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5cbmltcG9ydCB7U3RhdGVzfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL3N0YXRlcy50c1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgU3RhdGVzICAgICAgICAgOiB0eXBlb2YgU3RhdGVzXG5cdFx0Ly8gd2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLlN0YXRlcyA9IFN0YXRlcztcblxuXG5pbXBvcnQge2RlZmluZSwgZ2V0TmFtZSwgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCwgZ2V0SG9zdENzdHIsIGdldEhvc3RDc3RyU3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9ERUZJTkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0Z2V0SG9zdENzdHIgICAgOiB0eXBlb2YgZ2V0SG9zdENzdHI7XG5cdFx0Z2V0SG9zdENzdHJTeW5jOiB0eXBlb2YgZ2V0SG9zdENzdHJTeW5jO1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgICAgICAgICA9IGRlZmluZTtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1Mud2hlbkRlZmluZWQgICAgPSB3aGVuRGVmaW5lZDtcbkxJU1MuZ2V0SG9zdENzdHIgICAgPSBnZXRIb3N0Q3N0cjtcbkxJU1MuZ2V0SG9zdENzdHJTeW5jPSBnZXRIb3N0Q3N0clN5bmM7XG5cbi8vTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuXG5pbXBvcnQge2lzUmVhZHksIHdoZW5SZWFkeSwgZ2V0Q29udHJvbGVyQ3N0ciwgZ2V0Q29udHJvbGVyQ3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvUkVBRFlcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNSZWFkeSAgICAgIDogdHlwZW9mIGlzUmVhZHk7XG5cdFx0d2hlblJlYWR5ICAgIDogdHlwZW9mIHdoZW5SZWFkeTtcblx0XHRnZXRDb250cm9sZXJDc3RyICAgIDogdHlwZW9mIGdldENvbnRyb2xlckNzdHI7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0clN5bmM6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyU3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNSZWFkeSAgICAgICAgICAgICA9IGlzUmVhZHk7XG5MSVNTLndoZW5SZWFkeSAgICAgICAgICAgPSB3aGVuUmVhZHk7XG5MSVNTLmdldENvbnRyb2xlckNzdHIgICAgPSBnZXRDb250cm9sZXJDc3RyO1xuTElTUy5nZXRDb250cm9sZXJDc3RyU3luYz0gZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG5cblxuXG5pbXBvcnQge2lzVXBncmFkZWQsIHdoZW5VcGdyYWRlZCwgdXBncmFkZSwgdXBncmFkZVN5bmMsIGdldEhvc3QsIGdldEhvc3RTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1VQR1JBREVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzVXBncmFkZWQgIDogdHlwZW9mIGlzVXBncmFkZWQ7XG5cdFx0d2hlblVwZ3JhZGVkOiB0eXBlb2Ygd2hlblVwZ3JhZGVkO1xuXHRcdHVwZ3JhZGUgICAgIDogdHlwZW9mIHVwZ3JhZGU7XG5cdFx0dXBncmFkZVN5bmMgOiB0eXBlb2YgdXBncmFkZVN5bmM7XG5cdFx0Z2V0SG9zdCAgICAgOiB0eXBlb2YgZ2V0SG9zdDtcblx0XHRnZXRIb3N0U3luYyA6IHR5cGVvZiBnZXRIb3N0U3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNVcGdyYWRlZCAgPSBpc1VwZ3JhZGVkO1xuTElTUy53aGVuVXBncmFkZWQ9IHdoZW5VcGdyYWRlZDtcbkxJU1MudXBncmFkZSAgICAgPSB1cGdyYWRlO1xuTElTUy51cGdyYWRlU3luYyA9IHVwZ3JhZGVTeW5jO1xuTElTUy5nZXRIb3N0ICAgICA9IGdldEhvc3Q7XG5MSVNTLmdldEhvc3RTeW5jID0gZ2V0SG9zdFN5bmM7XG5cblxuaW1wb3J0IHtpc0luaXRpYWxpemVkLCB3aGVuSW5pdGlhbGl6ZWQsIGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jLCBnZXRDb250cm9sZXIsIGdldENvbnRyb2xlclN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNJbml0aWFsaXplZCAgICA6IHR5cGVvZiBpc0luaXRpYWxpemVkO1xuXHRcdHdoZW5Jbml0aWFsaXplZCAgOiB0eXBlb2Ygd2hlbkluaXRpYWxpemVkO1xuXHRcdGluaXRpYWxpemUgICAgICAgOiB0eXBlb2YgaW5pdGlhbGl6ZTtcblx0XHRpbml0aWFsaXplU3luYyAgIDogdHlwZW9mIGluaXRpYWxpemVTeW5jO1xuXHRcdGdldENvbnRyb2xlciAgICAgOiB0eXBlb2YgZ2V0Q29udHJvbGVyO1xuXHRcdGdldENvbnRyb2xlclN5bmMgOiB0eXBlb2YgZ2V0Q29udHJvbGVyU3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNJbml0aWFsaXplZCAgICA9IGlzSW5pdGlhbGl6ZWQ7XG5MSVNTLndoZW5Jbml0aWFsaXplZCAgPSB3aGVuSW5pdGlhbGl6ZWQ7XG5MSVNTLmluaXRpYWxpemUgICAgICAgPSBpbml0aWFsaXplO1xuTElTUy5pbml0aWFsaXplU3luYyAgID0gaW5pdGlhbGl6ZVN5bmM7XG5MSVNTLmdldENvbnRyb2xlciAgICAgPSBnZXRDb250cm9sZXI7XG5MSVNTLmdldENvbnRyb2xlclN5bmMgPSBnZXRDb250cm9sZXJTeW5jOyIsImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge0xJU1MgYXMgX0xJU1N9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuXG4vLyB1c2VkIGZvciBwbHVnaW5zLlxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbi8vIGV4dGVuZHMgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgIE9wdHMgZXh0ZW5kcyBMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj5cbiAgICA+KG9wdHM6IHtleHRlbmRzOiBFeHRlbmRzQ3N0cn0gJiBQYXJ0aWFsPE9wdHM+KTogUmV0dXJuVHlwZTx0eXBlb2YgX2V4dGVuZHM8RXh0ZW5kc0NzdHIsIE9wdHM+PlxuLy8gTElTU0NvbnRyb2xlciBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICA+KG9wdHM/OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+KTogTElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+XG5leHBvcnQgZnVuY3Rpb24gTElTUyhvcHRzOiBhbnkgPSB7fSk6IExJU1NDb250cm9sZXJDc3RyXG57XG4gICAgaWYoIG9wdHMuZXh0ZW5kcyAhPT0gdW5kZWZpbmVkICYmIFwiSG9zdFwiIGluIG9wdHMuZXh0ZW5kcyApIC8vIHdlIGFzc3VtZSB0aGlzIGlzIGEgTElTU0NvbnRyb2xlckNzdHJcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKG9wdHMpO1xuXG4gICAgcmV0dXJuIF9MSVNTKG9wdHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2V4dGVuZHM8XG4gICAgICAgIEV4dGVuZHNDc3RyIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsXG4gICAgICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgICAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPikge1xuXG4gICAgaWYoIG9wdHMuZXh0ZW5kcyA9PT0gdW5kZWZpbmVkKSAvLyBoNGNrXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYSBMSVNTQ29udHJvbGVyIScpO1xuXG4gICAgY29uc3QgY2ZnID0gb3B0cy5leHRlbmRzLkhvc3QuQ2ZnO1xuICAgIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBjZmcsIGNmZy5hcmdzLCBvcHRzKTtcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyEge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgfVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBvdmVycmlkZSBfSG9zdDogTElTU0hvc3Q8RXh0ZW5kZWRMSVNTPjtcblxuICAgICAgICAvLyBUUyBpcyBzdHVwaWQsIHJlcXVpcmVzIGV4cGxpY2l0IHJldHVybiB0eXBlXG5cdFx0c3RhdGljIG92ZXJyaWRlIGdldCBIb3N0KCk6IExJU1NIb3N0PEV4dGVuZGVkTElTUz4ge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIGZ1Y2sgb2ZmXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5ob3N0ISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbnRlbnRfZ2VuZXJhdG9yISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG4gICAgfVxuXG4gICAgcmV0dXJuIEV4dGVuZGVkTElTUztcbn0iLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciwgTEhvc3QsIExJU1NDb250cm9sZXJDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9ERUZJTkVEXCI7XG5cbi8vIHNob3VsZCBiZSBpbXByb3ZlZCAoYnV0IGhvdyA/KVxuY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2F1dG9kaXJdJyk7XG5cbmNvbnN0IFJFU1NPVVJDRVMgPSBbXG5cdFwiaW5kZXguanNcIixcblx0XCJpbmRleC5icnlcIixcblx0XCJpbmRleC5odG1sXCIsXG5cdFwiaW5kZXguY3NzXCJcbl07XG5cbmNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5sZXQgX2NkaXI6IG51bGx8c3RyaW5nO1xuXG5pZiggc2NyaXB0ICE9PSBudWxsICkge1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cblx0XHRjb25zdCBzd19wYXRoID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKTtcblxuXHRcdGlmKCBzd19wYXRoID09PSBudWxsICkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHN3X3BhdGgsIHtzY29wZTogXCIvXCJ9KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0X2NkaXIgPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdhdXRvZGlyJykhO1xuXHRjb25zb2xlLndhcm4oX2NkaXIpO1xuXHRpZiggX2NkaXJbX2NkaXIubGVuZ3RoLTFdICE9PSAnLycpXG5cdFx0X2NkaXIgKz0gJy8nO1xuXG5cdGNvbnN0IGJyeXRob24gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwiYnJ5dGhvblwiKTtcblxuXHQvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdFx0XHRcdGFkZFRhZyhhZGRpdGlvbilcblxuXHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqXCIpIClcblx0XHRhZGRUYWcoIGVsZW0gKTtcblxuXG5cdGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IHRhZ25hbWUgPSAoIHRhZy5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gdGFnLnRhZ05hbWUgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0aWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGNkaXI6IF9jZGlyLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1x0XHRcblx0fVxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiB7aHRtbDogc3RyaW5nLCBjc3M6IHN0cmluZywgaG9zdDogQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+fSkge1xuXG5cdGNvbnN0IGNfanMgICAgICA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cdG9wdHMuaHRtbCAgICAgPz89IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblxuXHRjb25zb2xlLndhcm4ob3B0cywgZmlsZXMpO1xuXG5cdGxldCBrbGFzczogbnVsbHwgUmV0dXJuVHlwZTx0eXBlb2YgTElTUz4gPSBudWxsO1xuXHRpZiggY19qcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0Y29uc3QgZmlsZSA9IG5ldyBCbG9iKFtjX2pzXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG5cdFx0Y29uc3QgdXJsICA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG5cblx0XHRjb25zdCBvbGRyZXEgPSBMSVNTLnJlcXVpcmU7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBmdW5jdGlvbih1cmw6IFVSTHxzdHJpbmcpIHtcblxuXHRcdFx0aWYoIHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgJiYgdXJsLnN0YXJ0c1dpdGgoJy4vJykgKSB7XG5cdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gdXJsLnNsaWNlKDIpO1xuXHRcdFx0XHRpZiggZmlsZW5hbWUgaW4gZmlsZXMpXG5cdFx0XHRcdFx0cmV0dXJuIGZpbGVzW2ZpbGVuYW1lXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9sZHJlcSh1cmwpO1xuXHRcdH1cblxuXHRcdGtsYXNzID0gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVybCkpLmRlZmF1bHQ7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBvbGRyZXE7XG5cdH1cblx0ZWxzZSBpZiggb3B0cy5odG1sICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRrbGFzcyA9IExJU1Moe1xuXHRcdFx0Li4ub3B0cyxcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yXG5cdFx0fSk7XG5cdH1cblxuXHRpZihrbGFzcyA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuXG5cdGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cblx0cmV0dXJuIGtsYXNzO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIGludGVybmFsIHRvb2xzID09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaFRleHQodXJpOiBzdHJpbmd8VVJMLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHRjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuXHRcdFx0XHRcdFx0PyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuXHRcdFx0XHRcdFx0OiB7fTtcblxuXG5cdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcblx0aWYocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0aWYoIGlzTGlzc0F1dG8gJiYgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJzdGF0dXNcIikhID09PSBcIjQwNFwiIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGNvbnN0IGFuc3dlciA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcblxuXHRpZihhbnN3ZXIgPT09IFwiXCIpXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gYW5zd2VyXG59XG5hc3luYyBmdW5jdGlvbiBfaW1wb3J0KHVyaTogc3RyaW5nLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHQvLyB0ZXN0IGZvciB0aGUgbW9kdWxlIGV4aXN0YW5jZS5cblx0aWYoaXNMaXNzQXV0byAmJiBhd2FpdCBfZmV0Y2hUZXh0KHVyaSwgaXNMaXNzQXV0bykgPT09IHVuZGVmaW5lZCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHR0cnkge1xuXHRcdHJldHVybiAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJpKSkuZGVmYXVsdDtcblx0fSBjYXRjaChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxufVxuXG5cbmNvbnN0IGNvbnZlcnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuZnVuY3Rpb24gZW5jb2RlSFRNTCh0ZXh0OiBzdHJpbmcpIHtcblx0Y29udmVydGVyLnRleHRDb250ZW50ID0gdGV4dDtcblx0cmV0dXJuIGNvbnZlcnRlci5pbm5lckhUTUw7XG59XG5cbmV4cG9ydCBjbGFzcyBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yIGV4dGVuZHMgQ29udGVudEdlbmVyYXRvciB7XG5cblx0cHJvdGVjdGVkIG92ZXJyaWRlIHByZXBhcmVIVE1MKGh0bWw/OiBEb2N1bWVudEZyYWdtZW50IHwgSFRNTEVsZW1lbnQgfCBzdHJpbmcpIHtcblx0XHRcblx0XHR0aGlzLmRhdGEgPSBudWxsO1xuXG5cdFx0aWYoIHR5cGVvZiBodG1sID09PSAnc3RyaW5nJyApIHtcblxuXHRcdFx0dGhpcy5kYXRhID0gaHRtbDtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0Lypcblx0XHRcdGh0bWwgPSBodG1sLnJlcGxhY2VBbGwoL1xcJFxceyhbXFx3XSspXFx9L2csIChfLCBuYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0cmV0dXJuIGA8bGlzcyB2YWx1ZT1cIiR7bmFtZX1cIj48L2xpc3M+YDtcblx0XHRcdH0pOyovXG5cblx0XHRcdC8vVE9ETzogJHt9IGluIGF0dHJcblx0XHRcdFx0Ly8gLSBkZXRlY3Qgc3RhcnQgJHsgKyBlbmQgfVxuXHRcdFx0XHQvLyAtIHJlZ2lzdGVyIGVsZW0gKyBhdHRyIG5hbWVcblx0XHRcdFx0Ly8gLSByZXBsYWNlLiBcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHN1cGVyLnByZXBhcmVIVE1MKGh0bWwpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnQgfCBTaGFkb3dSb290IHtcblx0XHRcblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0aWYoIHRoaXMuZGF0YSAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3Qgc3RyID0gKHRoaXMuZGF0YSBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gZW5jb2RlSFRNTChob3N0LmdldEF0dHJpYnV0ZShtYXRjaCkgPz8gJycgKSk7XG5cdFx0XHRzdXBlci5zZXRUZW1wbGF0ZSggc3VwZXIucHJlcGFyZUhUTUwoc3RyKSEgKTtcblx0XHR9XG5cblx0XHRjb25zdCBjb250ZW50ID0gc3VwZXIuZ2VuZXJhdGUoaG9zdCk7XG5cblx0XHQvKlxuXHRcdC8vIGh0bWwgbWFnaWMgdmFsdWVzLlxuXHRcdC8vIGNhbiBiZSBvcHRpbWl6ZWQuLi5cblx0XHRjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cdFx0Zm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG5cdFx0XHR2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cdFx0Ki9cblxuXHRcdC8vIGNzcyBwcm9wLlxuXHRcdGNvbnN0IGNzc19hdHRycyA9IGhvc3QuZ2V0QXR0cmlidXRlTmFtZXMoKS5maWx0ZXIoIGUgPT4gZS5zdGFydHNXaXRoKCdjc3MtJykpO1xuXHRcdGZvcihsZXQgY3NzX2F0dHIgb2YgY3NzX2F0dHJzKVxuXHRcdFx0aG9zdC5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke2Nzc19hdHRyLnNsaWNlKCdjc3MtJy5sZW5ndGgpfWAsIGhvc3QuZ2V0QXR0cmlidXRlKGNzc19hdHRyKSk7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50cyA6IHR5cGVvZiBpbXBvcnRDb21wb25lbnRzO1xuICAgICAgICBpbXBvcnRDb21wb25lbnQgIDogdHlwZW9mIGltcG9ydENvbXBvbmVudDtcbiAgICAgICAgcmVxdWlyZSAgICAgICAgICA6IHR5cGVvZiByZXF1aXJlO1xuICAgIH1cbn1cblxudHlwZSBpbXBvcnRDb21wb25lbnRzX09wdHM8VCBleHRlbmRzIEhUTUxFbGVtZW50PiA9IHtcblx0Y2RpciAgID86IHN0cmluZ3xudWxsLFxuXHRicnl0aG9uPzogc3RyaW5nfG51bGwsXG5cdGhvc3QgICA/OiBDb25zdHJ1Y3RvcjxUPlxufTtcblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdFx0XHRcdFx0XHRjb21wb25lbnRzOiBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y2RpciAgICA9IF9jZGlyLFxuXHRcdFx0XHRcdFx0XHRicnl0aG9uID0gbnVsbCxcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnRcblx0XHRcdFx0XHRcdH06IGltcG9ydENvbXBvbmVudHNfT3B0czxUPikge1xuXG5cdGNvbnN0IHJlc3VsdHM6IFJlY29yZDxzdHJpbmcsIExJU1NDb250cm9sZXJDc3RyPiA9IHt9O1xuXG5cdGZvcihsZXQgdGFnbmFtZSBvZiBjb21wb25lbnRzKSB7XG5cblx0XHRyZXN1bHRzW3RhZ25hbWVdID0gYXdhaXQgaW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdGNkaXIsXG5cdFx0XHRicnl0aG9uLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmNvbnN0IGJyeV93cmFwcGVyID0gYGRlZiB3cmFwanMoanNfa2xhc3MpOlxuXG4gICAgY2xhc3MgV3JhcHBlcjpcblxuICAgICAgICBfanNfa2xhc3MgPSBqc19rbGFzc1xuICAgICAgICBfanMgPSBOb25lXG5cbiAgICAgICAgZGVmIF9faW5pdF9fKHNlbGYsICphcmdzKTpcbiAgICAgICAgICAgIHNlbGYuX2pzID0ganNfa2xhc3MubmV3KCphcmdzKVxuXG4gICAgICAgIGRlZiBfX2dldGF0dHJfXyhzZWxmLCBuYW1lOiBzdHIpOlxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2pzW25hbWVdO1xuXG4gICAgICAgIGRlZiBfX3NldGF0dHJfXyhzZWxmLCBuYW1lOiBzdHIsIHZhbHVlKTpcbiAgICAgICAgICAgIGlmIG5hbWUgPT0gXCJfanNcIjpcbiAgICAgICAgICAgICAgICBzdXBlcigpLl9fc2V0YXR0cl9fKG5hbWUsIHZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgc2VsZi5fanNbbmFtZV0gPSB2YWx1ZVxuXG4gICAgcmV0dXJuIFdyYXBwZXJcblxuYDtcblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50PFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0dGFnbmFtZTogc3RyaW5nLFxuXHR7XG5cdFx0Y2RpciAgICA9IF9jZGlyLFxuXHRcdGJyeXRob24gPSBudWxsLFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnQsXG5cdFx0ZmlsZXMgICA9IG51bGxcblx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+ICYge2ZpbGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPnxudWxsfSA9IHt9XG4pIHtcblxuXHRLbm93blRhZ3MuYWRkKHRhZ25hbWUpO1xuXG5cdGNvbnN0IGNvbXBvX2RpciA9IGAke2NkaXJ9JHt0YWduYW1lfS9gO1xuXG5cdGNvbnNvbGUud2FybihcImltcG9ydFwiLCB0YWduYW1lLCBmaWxlcyk7XG5cblx0aWYoIGZpbGVzID09PSBudWxsICkge1xuXHRcdGZpbGVzID0ge307XG5cblx0XHRjb25zdCBmaWxlID0gYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgPyAnaW5kZXguYnJ5JyA6ICdpbmRleC5qcyc7XG5cblx0XHRmaWxlc1tmaWxlXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn0ke2ZpbGV9YCwgdHJ1ZSkpITtcblxuXHRcdC8vVE9ETyEhIVxuXHRcdHRyeSB7XG5cdFx0XHRmaWxlc1tcImluZGV4Lmh0bWxcIl0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguaHRtbGAsIHRydWUpKSE7XG5cdFx0fSBjYXRjaChlKSB7XG5cblx0XHR9XG5cdFx0dHJ5IHtcblx0XHRcdGZpbGVzW1wiaW5kZXguY3NzXCIgXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5jc3NgICwgdHJ1ZSkpITtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFxuXHRcdH1cblx0fVxuXG5cdGlmKCBicnl0aG9uID09PSBcInRydWVcIiAmJiBmaWxlc1snaW5kZXguYnJ5J10gIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0Y29uc3QgY29kZSA9IGJyeV93cmFwcGVyICsgZmlsZXNbXCJpbmRleC5icnlcIl07XG5cblx0XHRmaWxlc1snaW5kZXguanMnXSA9XG5gY29uc3QgJEIgPSBnbG9iYWxUaGlzLl9fQlJZVEhPTl9fO1xuXG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHtjb2RlfVxcYCwgXCJfXCIpO1xuXG5jb25zdCBtb2R1bGUgPSAkQi5pbXBvcnRlZFtcIl9cIl07XG5leHBvcnQgZGVmYXVsdCBtb2R1bGUuV2ViQ29tcG9uZW50O1xuXG5gO1xuXHR9XG5cblx0Y29uc3QgaHRtbCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIHtodG1sLCBjc3MsIGhvc3R9KTtcbn1cblxuZnVuY3Rpb24gcmVxdWlyZSh1cmw6IFVSTHxzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPnxzdHJpbmcge1xuXHRyZXR1cm4gZmV0Y2godXJsKTtcbn1cblxuXG5MSVNTLmltcG9ydENvbXBvbmVudHMgPSBpbXBvcnRDb21wb25lbnRzO1xuTElTUy5pbXBvcnRDb21wb25lbnQgID0gaW1wb3J0Q29tcG9uZW50O1xuTElTUy5yZXF1aXJlICA9IHJlcXVpcmU7IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn0iLCJcbmltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbnR5cGUgTGlzdGVuZXJGY3Q8VCBleHRlbmRzIEV2ZW50PiA9IChldjogVCkgPT4gdm9pZDtcbnR5cGUgTGlzdGVuZXJPYmo8VCBleHRlbmRzIEV2ZW50PiA9IHsgaGFuZGxlRXZlbnQ6IExpc3RlbmVyRmN0PFQ+IH07XG50eXBlIExpc3RlbmVyPFQgZXh0ZW5kcyBFdmVudD4gPSBMaXN0ZW5lckZjdDxUPnxMaXN0ZW5lck9iajxUPjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50VGFyZ2V0MjxFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBFdmVudD4+IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuXG5cdG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBjYWxsYmFjazogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgb3B0aW9ucz86IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhbik6IHZvaWQge1xuXHRcdFxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblx0fVxuXG5cdG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQ8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4oZXZlbnQ6IEV2ZW50c1tUXSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBzdXBlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fVxuXG5cdG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGlzdGVuZXI6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQge1xuXG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0c3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbUV2ZW50MjxUIGV4dGVuZHMgc3RyaW5nLCBBcmdzPiBleHRlbmRzIEN1c3RvbUV2ZW50PEFyZ3M+IHtcblxuXHRjb25zdHJ1Y3Rvcih0eXBlOiBULCBhcmdzOiBBcmdzKSB7XG5cdFx0c3VwZXIodHlwZSwge2RldGFpbDogYXJnc30pO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2V0IHR5cGUoKTogVCB7IHJldHVybiBzdXBlci50eXBlIGFzIFQ7IH1cbn1cblxudHlwZSBJbnN0YW5jZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4+ID0ge1xuXHRbSyBpbiBrZXlvZiBUXTogSW5zdGFuY2VUeXBlPFRbS10+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXaXRoRXZlbnRzPFQgZXh0ZW5kcyBvYmplY3QsIEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4gPihldjogQ29uc3RydWN0b3I8VD4sIF9ldmVudHM6IEV2ZW50cykge1xuXG5cdHR5cGUgRXZ0cyA9IEluc3RhbmNlczxFdmVudHM+O1xuXG5cdGlmKCAhIChldiBpbnN0YW5jZW9mIEV2ZW50VGFyZ2V0KSApXG5cdFx0cmV0dXJuIGV2IGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+PjtcblxuXHQvLyBpcyBhbHNvIGEgbWl4aW5cblx0Ly8gQHRzLWlnbm9yZVxuXHRjbGFzcyBFdmVudFRhcmdldE1peGlucyBleHRlbmRzIGV2IHtcblxuXHRcdCNldiA9IG5ldyBFdmVudFRhcmdldDI8RXZ0cz4oKTtcblxuXHRcdGFkZEV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmFkZEV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdGRpc3BhdGNoRXZlbnQoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmRpc3BhdGNoRXZlbnQoLi4uYXJncyk7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gRXZlbnRUYXJnZXRNaXhpbnMgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgU2hhZG93Um9vdCB0b29scyA9PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRNYXRjaGVzKGV2OiBFdmVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXG5cdGxldCBlbGVtZW50cyA9IGV2LmNvbXBvc2VkUGF0aCgpLnNsaWNlKDAsLTIpLmZpbHRlcihlID0+ICEgKGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSApLnJldmVyc2UoKSBhcyBIVE1MRWxlbWVudFtdO1xuXG5cdGZvcihsZXQgZWxlbSBvZiBlbGVtZW50cyApXG5cdFx0aWYoZWxlbS5tYXRjaGVzKHNlbGVjdG9yKSApXG5cdFx0XHRyZXR1cm4gZWxlbTsgXG5cblx0cmV0dXJuIG51bGw7XG59IiwiXG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRzIHt9O1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN5bmMsIHdoZW5Jbml0aWFsaXplZCB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICAvLyBhc3luY1xuICAgICAgICBxcyA6IHR5cGVvZiBxcztcbiAgICAgICAgcXNvOiB0eXBlb2YgcXNvO1xuICAgICAgICBxc2E6IHR5cGVvZiBxc2E7XG4gICAgICAgIHFzYzogdHlwZW9mIHFzYztcblxuICAgICAgICAvLyBzeW5jXG4gICAgICAgIHFzU3luYyA6IHR5cGVvZiBxc1N5bmM7XG4gICAgICAgIHFzYVN5bmM6IHR5cGVvZiBxc2FTeW5jO1xuICAgICAgICBxc2NTeW5jOiB0eXBlb2YgcXNjU3luYztcblxuXHRcdGNsb3Nlc3Q6IHR5cGVvZiBjbG9zZXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzc19zZWxlY3RvcihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtsaXNzX3NlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0bGV0IHJlc3VsdCA9IGF3YWl0IHFzbzxUPihzZWxlY3RvciwgcGFyZW50KTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gcmVzdWx0IVxufVxuXG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc288TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VFtdPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXVtdID47XG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8VD4+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHByb21pc2VzW2lkeCsrXSA9IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc2M8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPihyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUW107XG5mdW5jdGlvbiBxc2FTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dW107XG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cmVzdWx0W2lkeCsrXSA9IGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFQ7XG5mdW5jdGlvbiBxc2NTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KHJlc3VsdCk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjbG9zZXN0PEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50KSB7XG5cblx0d2hpbGUodHJ1ZSkge1xuXHRcdHZhciByZXN1bHQgPSBlbGVtZW50LmNsb3Nlc3Q8RT4oc2VsZWN0b3IpO1xuXG5cdFx0aWYoIHJlc3VsdCAhPT0gbnVsbClcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuXHRcdGlmKCAhIChcImhvc3RcIiBpbiByb290KSApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGVsZW1lbnQgPSAocm9vdCBhcyBTaGFkb3dSb290KS5ob3N0O1xuXHR9XG59XG5cblxuLy8gYXN5bmNcbkxJU1MucXMgID0gcXM7XG5MSVNTLnFzbyA9IHFzbztcbkxJU1MucXNhID0gcXNhO1xuTElTUy5xc2MgPSBxc2M7XG5cbi8vIHN5bmNcbkxJU1MucXNTeW5jICA9IHFzU3luYztcbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG5MSVNTLmNsb3Nlc3QgPSBjbG9zZXN0OyIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJ1xufTtcblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0ge1xuICAgICAgICBleHRlbmRzOiBFeHRlbmRzQ3RyLCAvLyBKUyBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLCAgIC8vIEhUTUwgSG9zdFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG59ICYgQ29udGVudEdlbmVyYXRvcl9PcHRzO1xuXG4vL1RPRE86IHJld3JpdGUuLi5cbi8vIExJU1NDb250cm9sZXJcblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlckNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IEluc3RhbmNlVHlwZTxMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gVCBleHRlbmRzIExJU1NDb250cm9sZXI8XG4gICAgICAgICAgICBpbmZlciBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgICAgICA+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLEhvc3RDc3RyPiA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NDb250cm9sZXIgPyBMSVNTQ29udHJvbGVyMkxJU1NDb250cm9sZXJDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyID0gTElTU0NvbnRyb2xlcj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjtcblxuLy8gbGlnaHRlciBMSVNTSG9zdCBkZWYgdG8gYXZvaWQgdHlwZSBpc3N1ZXMuLi5cbmV4cG9ydCB0eXBlIExIb3N0PEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA9IHtcblxuICAgIGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgQ1NTU2VsZWN0b3I6IHN0cmluZztcblxufSAmIEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbmV4cG9ydCB0eXBlIExIb3N0Q3N0cjxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG4gICAgbmV3KC4uLmFyZ3M6IGFueSk6IExIb3N0PEhvc3RDc3RyPjtcblxuICAgIENmZzoge1xuICAgICAgICBob3N0ICAgICAgICAgICAgIDogSG9zdENzdHIsXG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbiAgICAgICAgYXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuICAgIH1cblxufSAmIEhvc3RDc3RyOyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGlmKCBDbGFzcyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBDbGFzcyA9IENsYXNzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBIVE1MRWxlbWVudDtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblxuICAgIGxldCBjdXJzb3IgPSBDbGFzcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2hpbGUgKGN1cnNvci5fX3Byb3RvX18gIT09IEhUTUxFbGVtZW50KVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5fX3Byb3RvX187XG5cbiAgICAvLyBkaXJlY3RseSBpbmhlcml0IEhUTUxFbGVtZW50XG4gICAgaWYoICEgY3Vyc29yLm5hbWUuc3RhcnRzV2l0aCgnSFRNTCcpICYmICEgY3Vyc29yLm5hbWUuZW5kc1dpdGgoJ0VsZW1lbnQnKSApXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaHRtbHRhZyA9IGN1cnNvci5uYW1lLnNsaWNlKDQsIC03KTtcblxuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG4vKlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG4qL1xuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL0xpZmVDeWNsZVwiO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vL1RPRE86IGV2ZW50cy50c1xuLy9UT0RPOiBnbG9iYWxDU1NSdWxlc1xuZXhwb3J0IHtMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5pbXBvcnQgXCIuL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnNcIjtcblxuZXhwb3J0IHtTaGFkb3dDZmd9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB7bGlzcywgbGlzc1N5bmN9IGZyb20gXCIuL2hlbHBlcnMvYnVpbGRcIjtcbmV4cG9ydCB7ZXZlbnRNYXRjaGVzLCBXaXRoRXZlbnRzLCBFdmVudFRhcmdldDIsIEN1c3RvbUV2ZW50Mn0gZnJvbSAnLi9oZWxwZXJzL2V2ZW50cyc7XG5leHBvcnQge2h0bWx9IGZyb20gXCIuL3V0aWxzXCI7XG5leHBvcnQgZGVmYXVsdCBMSVNTO1xuXG4vLyBmb3IgZGVidWcuXG5leHBvcnQge19leHRlbmRzfSBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbi8vIHJlcXVpcmVkIGZvciBhdXRvIG1vZGUgaXQgc2VlbXMuXG4vLyBAdHMtaWdub3JlXG5nbG9iYWxUaGlzLkxJU1MgPSBMSVNTOyJdLCJuYW1lcyI6WyJnZXRTaGFyZWRDU1MiLCJTaGFkb3dDZmciLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNET01Db250ZW50TG9hZGVkIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsInNoYXJlZENTUyIsIkNvbnRlbnRHZW5lcmF0b3IiLCJkYXRhIiwiY29uc3RydWN0b3IiLCJodG1sIiwiY3NzIiwic2hhZG93IiwicHJlcGFyZUhUTUwiLCJwcmVwYXJlQ1NTIiwic2V0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsImlzUmVhZHkiLCJ3aGVuUmVhZHkiLCJnZW5lcmF0ZSIsImhvc3QiLCJ0YXJnZXQiLCJpbml0U2hhZG93IiwiaW5qZWN0Q1NTIiwiY29udGVudCIsImNsb25lTm9kZSIsInNoYWRvd01vZGUiLCJOT05FIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsInJlcGxhY2VDaGlsZHJlbiIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImNhbkhhdmVTaGFkb3ciLCJFcnJvciIsIm1vZGUiLCJPUEVOIiwiYXR0YWNoU2hhZG93IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZSIsInByb2Nlc3NDU1MiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInVuZGVmaW5lZCIsInN0ciIsInRyaW0iLCJpbm5lckhUTUwiLCJIVE1MRWxlbWVudCIsImFwcGVuZCIsInN0eWxlc2hlZXRzIiwiU2hhZG93Um9vdCIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsInB1c2giLCJjc3NzZWxlY3RvciIsIkNTU1NlbGVjdG9yIiwiaGFzIiwic2V0QXR0cmlidXRlIiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJyZXBsYWNlIiwiaGVhZCIsImFkZCIsImJ1aWxkTElTU0hvc3QiLCJzZXRDc3RyQ29udHJvbGVyIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJMSVNTIiwiYXJncyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsImNvbnRlbnRfZ2VuZXJhdG9yIiwiTElTU0NvbnRyb2xlciIsIkhvc3QiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJuYW1lIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImNvbm5lY3RlZENhbGxiYWNrIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJpc0Nvbm5lY3RlZCIsIl9Ib3N0IiwiaWQiLCJfX2NzdHJfY29udHJvbGVyIiwiTGlzcyIsImhvc3RDc3RyIiwiY29udGVudF9nZW5lcmF0b3JfY3N0ciIsIkxJU1NIb3N0IiwiQ2ZnIiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiQ29udHJvbGVyIiwiY29udHJvbGVyIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJwYXJhbXMiLCJpbml0IiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwidGhlbiIsInByb21pc2UiLCJyZXNvbHZlIiwiUHJvbWlzZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsImRlZmluZSIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsImJyeV9jbGFzcyIsIl9fYmFzZXNfXyIsImZpbHRlciIsIl9fbmFtZV9fIiwiX2pzX2tsYXNzIiwiJGpzX2Z1bmMiLCJfX0JSWVRIT05fXyIsIiRjYWxsIiwiJGdldGF0dHJfcGVwNjU3IiwiQ2xhc3MiLCJodG1sdGFnIiwib3B0cyIsImdldE5hbWUiLCJlbGVtZW50IiwiRWxlbWVudCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJpc0RlZmluZWQiLCJlbGVtIiwiZ2V0Iiwid2hlbkRlZmluZWQiLCJnZXRIb3N0Q3N0ciIsImdldEhvc3RDc3RyU3luYyIsImlzVXBncmFkZWQiLCJ1cGdyYWRlU3luYyIsIndoZW5VcGdyYWRlZCIsImdldENvbnRyb2xlciIsImdldENvbnRyb2xlclN5bmMiLCJpbml0aWFsaXplU3luYyIsImdldENvbnRyb2xlckNzdHIiLCJnZXRDb250cm9sZXJDc3RyU3luYyIsIl93aGVuVXBncmFkZWQiLCJnZXRIb3N0Iiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImdldEhvc3RTeW5jIiwiU3RhdGVzIiwiX0xJU1MiLCJJTElTUyIsImNmZyIsImFzc2lnbiIsIkV4dGVuZGVkTElTUyIsInNjcmlwdCIsIlJFU1NPVVJDRVMiLCJLbm93blRhZ3MiLCJfY2RpciIsIlNXIiwic3dfcGF0aCIsImNvbnNvbGUiLCJ3YXJuIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic2NvcGUiLCJlcnJvciIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiYnJ5dGhvbiIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtdXRhdGlvbiIsImFkZGl0aW9uIiwiYWRkZWROb2RlcyIsImFkZFRhZyIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwidGFnIiwiaW1wb3J0Q29tcG9uZW50IiwiY2RpciIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwiY19qcyIsImtsYXNzIiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwib2xkcmVxIiwicmVxdWlyZSIsInN0YXJ0c1dpdGgiLCJmaWxlbmFtZSIsInNsaWNlIiwiZGVmYXVsdCIsIkxJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IiLCJfZmV0Y2hUZXh0IiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImFuc3dlciIsInRleHQiLCJfaW1wb3J0IiwibG9nIiwiY29udmVydGVyIiwiZW5jb2RlSFRNTCIsInRleHRDb250ZW50IiwibWF0Y2giLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImNzc19hdHRyIiwic2V0UHJvcGVydHkiLCJpbXBvcnRDb21wb25lbnRzIiwiY29tcG9uZW50cyIsInJlc3VsdHMiLCJicnlfd3JhcHBlciIsImNvbXBvX2RpciIsImNvZGUiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsImlkeCIsInByb21pc2VzIiwiYWxsIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwiZ2xvYmFsVGhpcyJdLCJzb3VyY2VSb290IjoiIn0=