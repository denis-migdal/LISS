/******/ var __webpack_modules__ = ({

/***/ "./src/V2/ContentGenerator.ts":
/*!************************************!*\
  !*** ./src/V2/ContentGenerator.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContentGenerator)
/* harmony export */ });
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSHost */ "./src/V2/LISSHost.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/V2/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/V2/utils.ts");



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
    fillContent(shadow) {
        this.injectCSS(shadow, this.#stylesheets);
        shadow.append(this.#template.content.cloneNode(true));
        customElements.upgrade(shadow);
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

/***/ "./src/V2/LISSControler.ts":
/*!*********************************!*\
  !*** ./src/V2/LISSControler.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   setCstrHost: () => (/* binding */ setCstrHost)
/* harmony export */ });
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSHost */ "./src/V2/LISSHost.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContentGenerator */ "./src/V2/ContentGenerator.ts");


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

/***/ "./src/V2/LISSHost.ts":
/*!****************************!*\
  !*** ./src/V2/LISSHost.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildLISSHost: () => (/* binding */ buildLISSHost),
/* harmony export */   getSharedCSS: () => (/* binding */ getSharedCSS),
/* harmony export */   setCstrControler: () => (/* binding */ setCstrControler)
/* harmony export */ });
/* harmony import */ var _LISSControler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSControler */ "./src/V2/LISSControler.ts");

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

/***/ "./src/V2/LifeCycle/DEFINED.ts":
/*!*************************************!*\
  !*** ./src/V2/LifeCycle/DEFINED.ts ***!
  \*************************************/
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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/V2/utils.ts");

// TODO...
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
    let htmltag = undefined;
    if ("Cfg" in Host) {
        const Class = Host.Cfg.host;
        htmltag = (0,_utils__WEBPACK_IMPORTED_MODULE_0__._element2tagname)(Class) ?? undefined;
    }
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

/***/ "./src/V2/LifeCycle/INITIALIZED.ts":
/*!*****************************************!*\
  !*** ./src/V2/LifeCycle/INITIALIZED.ts ***!
  \*****************************************/
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
/* harmony import */ var _UPGRADED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UPGRADED */ "./src/V2/LifeCycle/UPGRADED.ts");
/* harmony import */ var _READY__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./READY */ "./src/V2/LifeCycle/READY.ts");


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

/***/ "./src/V2/LifeCycle/READY.ts":
/*!***********************************!*\
  !*** ./src/V2/LifeCycle/READY.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getControlerCstr: () => (/* binding */ getControlerCstr),
/* harmony export */   getControlerCstrSync: () => (/* binding */ getControlerCstrSync),
/* harmony export */   isReady: () => (/* binding */ isReady),
/* harmony export */   whenReady: () => (/* binding */ whenReady)
/* harmony export */ });
/* harmony import */ var _DEFINED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DEFINED */ "./src/V2/LifeCycle/DEFINED.ts");

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

/***/ "./src/V2/LifeCycle/UPGRADED.ts":
/*!**************************************!*\
  !*** ./src/V2/LifeCycle/UPGRADED.ts ***!
  \**************************************/
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
/* harmony import */ var _DEFINED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DEFINED */ "./src/V2/LifeCycle/DEFINED.ts");

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

/***/ "./src/V2/LifeCycle/states.ts":
/*!************************************!*\
  !*** ./src/V2/LifeCycle/states.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   States: () => (/* binding */ States)
/* harmony export */ });
var States;
(function(States) {
    States["LISS_DEFINED"] = "LISS_DEFINED";
    States["LISS_UPGRADED"] = "LISS_UPGRADED";
    States["LISS_READY"] = "LISS_READY";
    States["LISS_INITIALIZED"] = "LISS_INITIALIZED";
})(States || (States = {}));


/***/ }),

/***/ "./src/V2/core/LifeCycle.ts":
/*!**********************************!*\
  !*** ./src/V2/core/LifeCycle.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/V2/extends.ts");
/* harmony import */ var _LifeCycle_states_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LifeCycle/states.ts */ "./src/V2/LifeCycle/states.ts");
/* harmony import */ var _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LifeCycle/DEFINED */ "./src/V2/LifeCycle/DEFINED.ts");
/* harmony import */ var _LifeCycle_READY__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../LifeCycle/READY */ "./src/V2/LifeCycle/READY.ts");
/* harmony import */ var _LifeCycle_UPGRADED__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../LifeCycle/UPGRADED */ "./src/V2/LifeCycle/UPGRADED.ts");
/* harmony import */ var _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../LifeCycle/INITIALIZED */ "./src/V2/LifeCycle/INITIALIZED.ts");


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

/***/ "./src/V2/extends.ts":
/*!***************************!*\
  !*** ./src/V2/extends.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ILISS: () => (/* binding */ ILISS),
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   _extends: () => (/* binding */ _extends),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _LISSControler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSControler */ "./src/V2/LISSControler.ts");
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSHost */ "./src/V2/LISSHost.ts");


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

/***/ "./src/V2/helpers/LISSAuto.ts":
/*!************************************!*\
  !*** ./src/V2/helpers/LISSAuto.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CDIR: () => (/* binding */ DEFAULT_CDIR),
/* harmony export */   KnownTags: () => (/* binding */ KnownTags),
/* harmony export */   LISSAuto_ContentGenerator: () => (/* binding */ LISSAuto_ContentGenerator),
/* harmony export */   _fetchText: () => (/* binding */ _fetchText),
/* harmony export */   encodeHTML: () => (/* binding */ encodeHTML)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/V2/extends.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ContentGenerator */ "./src/V2/ContentGenerator.ts");
/* harmony import */ var _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LifeCycle/DEFINED */ "./src/V2/LifeCycle/DEFINED.ts");



const KnownTags = new Set();
let script = document.querySelector('script[autodir]');
const DEFAULT_CDIR = script?.getAttribute('autodir') ?? null;
if (script !== null) autoload(script);
function autoload(script) {
    let cdir = DEFAULT_CDIR;
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
    cdir = script.getAttribute('autodir');
    if (cdir[cdir.length - 1] !== '/') cdir += '/';
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
            cdir,
            host
        });
    }
}
async function defineWebComponent(tagname, files, opts) {
    const c_js = files["index.js"];
    opts.html ??= files["index.html"];
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
    fillContent(shadow) {
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        if (this.data !== null) {
            const str = this.data.replace(/\$\{(.+?)\}/g, (_, match)=>encodeHTML(shadow.host.getAttribute(match) ?? ''));
            super.setTemplate(super.prepareHTML(str));
        }
        super.fillContent(shadow);
    /*
		// html magic values could be optimized...
		const values = content.querySelectorAll('liss[value]');
		for(let value of values)
			value.textContent = host.getAttribute(value.getAttribute('value')!)
		*/ }
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
async function importComponents(components, { cdir = DEFAULT_CDIR, brython = null, // @ts-ignore
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
const bry_wrapper = `from browser import self

def wrapjs(js_klass):

	class Wrapper:

		_js_klass = js_klass
		_js = None

		def __init__(this, *args):
			this._js = js_klass.new(*args)

		def __getattr__(this, name: str):
			return this._js[name];

		def __setattr__(this, name: str, value):
			if name == "_js":
				super().__setattr__(name, value)
				return
			this._js[name] = value
	
	return Wrapper

self.wrapjs = wrapjs
`;
async function importComponent(tagname, { cdir = DEFAULT_CDIR, brython = null, // @ts-ignore
host = HTMLElement, files = null } = {}) {
    KnownTags.add(tagname);
    const compo_dir = `${cdir}${tagname}/`;
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
        const code = files["index.bry"];
        files['index.js'] = `const $B = globalThis.__BRYTHON__;

$B.runPythonSource(\`${bry_wrapper}\`, "_");
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

/***/ "./src/V2/helpers/build.ts":
/*!*********************************!*\
  !*** ./src/V2/helpers/build.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   liss: () => (/* binding */ liss),
/* harmony export */   lissSync: () => (/* binding */ lissSync)
/* harmony export */ });
/* harmony import */ var _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../LifeCycle/INITIALIZED */ "./src/V2/LifeCycle/INITIALIZED.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/V2/utils.ts");


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

/***/ "./src/V2/helpers/events.ts":
/*!**********************************!*\
  !*** ./src/V2/helpers/events.ts ***!
  \**********************************/
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

/***/ "./src/V2/helpers/querySelectors.ts":
/*!******************************************!*\
  !*** ./src/V2/helpers/querySelectors.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/V2/extends.ts");
/* harmony import */ var _LifeCycle_INITIALIZED__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LifeCycle/INITIALIZED */ "./src/V2/LifeCycle/INITIALIZED.ts");


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

/***/ "./src/V2/index.ts":
/*!*************************!*\
  !*** ./src/V2/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extends */ "./src/V2/extends.ts");
/* harmony import */ var _core_LifeCycle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/LifeCycle */ "./src/V2/core/LifeCycle.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ContentGenerator */ "./src/V2/ContentGenerator.ts");
/* harmony import */ var _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/LISSAuto */ "./src/V2/helpers/LISSAuto.ts");
/* harmony import */ var _helpers_querySelectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/querySelectors */ "./src/V2/helpers/querySelectors.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types */ "./src/V2/types.ts");
/* harmony import */ var _helpers_build__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/build */ "./src/V2/helpers/build.ts");
/* harmony import */ var _helpers_events__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers/events */ "./src/V2/helpers/events.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils */ "./src/V2/utils.ts");



//TODO: events.ts
//TODO: globalCSSRules






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_extends__WEBPACK_IMPORTED_MODULE_0__["default"]);
// for debug.



/***/ }),

/***/ "./src/V2/types.ts":
/*!*************************!*\
  !*** ./src/V2/types.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShadowCfg: () => (/* binding */ ShadowCfg)
/* harmony export */ });
var ShadowCfg;
(function(ShadowCfg) {
    ShadowCfg["NONE"] = "none";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
})(ShadowCfg || (ShadowCfg = {}));


/***/ }),

/***/ "./src/V2/utils.ts":
/*!*************************!*\
  !*** ./src/V2/utils.ts ***!
  \*************************/
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


/***/ }),

/***/ "./src/V3/ContentGenerators/AutoContentGenerator.ts":
/*!**********************************************************!*\
  !*** ./src/V3/ContentGenerators/AutoContentGenerator.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AutoContentGenerator)
/* harmony export */ });
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContentGenerator */ "./src/V3/ContentGenerators/ContentGenerator.ts");
/* harmony import */ var V3_utils_encode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V3/utils/encode */ "./src/V3/utils/encode.ts");


const regex = /\$\{(.+?)\}/g;
class AutoContentGenerator extends _ContentGenerator__WEBPACK_IMPORTED_MODULE_0__["default"] {
    prepareTemplate(html) {
        this.data = null;
        if (typeof html === 'string') {
            this.data = html;
            return;
        /*
            html = html.replaceAll(/\$\{([\w]+)\}/g, (_, name: string) => {
                return `<liss value="${name}"></liss>`;
            });*/ //TODO: ${} in attr
        // - detect start ${ + end }
        // - register elem + attr name
        // - replace. 
        }
        super.prepareTemplate(html);
    }
    fillContent(shadow) {
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        if (this.data !== null) {
            const str = this.data.replace(regex, (_, match)=>{
                const value = shadow.host.getAttribute(match);
                if (value === null) return '';
                return (0,V3_utils_encode__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
            });
            super.prepareTemplate(str);
        }
        super.fillContent(shadow);
    /*
        // html magic values could be optimized...
        const values = content.querySelectorAll('liss[value]');
        for(let value of values)
            value.textContent = host.getAttribute(value.getAttribute('value')!)
        */ }
}


/***/ }),

/***/ "./src/V3/ContentGenerators/ContentGenerator.ts":
/*!******************************************************!*\
  !*** ./src/V3/ContentGenerators/ContentGenerator.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContentGenerator)
/* harmony export */ });
/* harmony import */ var V3_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V3/utils/network/ressource */ "./src/V3/utils/network/ressource.ts");
/* harmony import */ var V2_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V2/utils */ "./src/V2/utils.ts");
/* harmony import */ var V3_utils_parsers_template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! V3/utils/parsers/template */ "./src/V3/utils/parsers/template.ts");
/* harmony import */ var V3_utils_parsers_style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/utils/parsers/style */ "./src/V3/utils/parsers/style.ts");




const sharedCSS = new CSSStyleSheet();
//const sharedCSS = getSharedCSS(); // from LISSHost...
class ContentGenerator {
    data;
    #shadow;
    constructor({ html, css = [], shadow = null } = {}){
        this.#shadow = shadow;
        const isReady = (0,V3_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(html) && (0,V3_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(css) && (0,V2_utils__WEBPACK_IMPORTED_MODULE_1__.isDOMContentLoaded)();
        if (isReady) this.prepare(html, css);
        const whenReady = Promise.all([
            (0,V3_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(html),
            (0,V3_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(css),
            (0,V2_utils__WEBPACK_IMPORTED_MODULE_1__.whenDOMContentLoaded)()
        ]);
        whenReady.then((args)=>this.prepare(args[0], args[1]));
        this.isReady = isReady;
        this.whenReady = whenReady;
    }
    /** ready ***/ whenReady;
    isReady = false;
    /** process ressources **/ stylesheets = [];
    template = null;
    prepare(html, css) {
        if (html !== undefined) this.prepareTemplate(html);
        if (css !== undefined) this.prepareStyle(css);
    }
    prepareTemplate(html) {
        this.template = (0,V3_utils_parsers_template__WEBPACK_IMPORTED_MODULE_2__["default"])(html);
    }
    prepareStyle(css) {
        if (!Array.isArray(css)) css = [
            css
        ];
        this.stylesheets = css.map((e)=>(0,V3_utils_parsers_style__WEBPACK_IMPORTED_MODULE_3__["default"])(e));
    }
    /*** Generate contents ***/ initContent(target, mode) {
        let content = target;
        if (mode !== null) {
            content = target.attachShadow({
                mode
            });
            content.adoptedStyleSheets.push(sharedCSS, ...this.stylesheets);
        }
        //TODO: CSS for no shadow ???
        this.fillContent(content);
        return content;
    }
    fillContent(target) {
        if (this.template !== null) target.replaceChildren(this.createContent());
        //TODO...
        customElements.upgrade(target);
    }
    createContent() {
        return this.template.cloneNode(true);
    }
}


/***/ }),

/***/ "./src/V3/LISS.ts":
/*!************************!*\
  !*** ./src/V3/LISS.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ILISS: () => (/* binding */ ILISS),
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getInitialValue: () => (/* binding */ getInitialValue)
/* harmony export */ });
/* harmony import */ var V3_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V3/ContentGenerators/ContentGenerator */ "./src/V3/ContentGenerators/ContentGenerator.ts");
/* harmony import */ var _LISS_LISSFull__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISS/LISSFull */ "./src/V3/LISS/LISSFull.ts");


function getInitialValue(e, name, defaultValue) {
    if (!Object.hasOwn(e, name)) return defaultValue;
    const _ = e[name];
    delete e[name];
    return _;
}
//  builder
function LISS(opts = {}) {
    const content_generator = opts.content_generator ?? V3_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__["default"];
    // @ts-ignore
    const generator = new content_generator(opts);
    return class _LISS extends _LISS_LISSFull__WEBPACK_IMPORTED_MODULE_1__["default"] {
        // TODO: no content if... ???
        // override attachShadow  ???
        static SHADOW_MODE = "open";
        static CONTENT_GENERATOR = generator;
    };
}
// used for plugins.
class ILISS {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISS);


/***/ }),

/***/ "./src/V3/LISS/LISSBase.ts":
/*!*********************************!*\
  !*** ./src/V3/LISS/LISSBase.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSBase)
/* harmony export */ });
class LISSBase extends HTMLElement {
    /*protected getInitialValue<N extends keyof this>
                            (name: N): undefined|this[N]
    protected getInitialValue<N extends keyof this, D>
                            (name: N, defaultValue: D) : D|this[N]
    protected getInitialValue<N extends keyof this, D>
                            (name: N, defaultValue?: D): undefined|D|this[N] {
        return getInitialValue(this, name, defaultValue);
    }*/ static SHADOW_MODE = null;
    // TODO: static cache getter + use static HTML/CSS.
    static CONTENT_GENERATOR = null;
    content = this;
    host = this;
    controler = this;
    constructor(){
        super();
        const klass = this.constructor;
        if (klass.CONTENT_GENERATOR !== null) this.content = klass.CONTENT_GENERATOR.initContent(this, klass.SHADOW_MODE);
    }
    // define for auto-complete.
    static observedAttributes = [];
    attributeChangedCallback(name, oldval, newval) {}
}


/***/ }),

/***/ "./src/V3/LISS/LISSFull.ts":
/*!*********************************!*\
  !*** ./src/V3/LISS/LISSFull.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./src/V3/LISS/LISSBase.ts");



/***/ }),

/***/ "./src/V3/define/autoload.ts":
/*!***********************************!*\
  !*** ./src/V3/define/autoload.ts ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CDIR: () => (/* binding */ DEFAULT_CDIR),
/* harmony export */   LISS_MODE: () => (/* binding */ LISS_MODE),
/* harmony export */   autoload: () => (/* binding */ autoload),
/* harmony export */   loadComponent: () => (/* binding */ loadComponent)
/* harmony export */ });
/* harmony import */ var V3_define_define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V3/define/define */ "./src/V3/define/define.ts");
/* harmony import */ var V3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V3 */ "./src/V3/index.ts");
/* harmony import */ var V3_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! V3/ContentGenerators/AutoContentGenerator */ "./src/V3/ContentGenerators/AutoContentGenerator.ts");
/* harmony import */ var V3_utils_DOM_isPageLoaded__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/utils/DOM/isPageLoaded */ "./src/V3/utils/DOM/isPageLoaded.ts");
/* harmony import */ var V3_utils_DOM_whenPageLoaded__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! V3/utils/DOM/whenPageLoaded */ "./src/V3/utils/DOM/whenPageLoaded.ts");
/* harmony import */ var V3_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! V3/utils/network/fetchText */ "./src/V3/utils/network/fetchText.ts");
/* harmony import */ var V3_utils_execute__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! V3/utils/execute */ "./src/V3/utils/execute/index.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([V3__WEBPACK_IMPORTED_MODULE_1__]);
V3__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







const script = document.querySelector('script:is([liss-auto],[liss-cdir],[liss-sw])');
const LISS_MODE = script?.getAttribute('liss-mode') ?? null;
const DEFAULT_CDIR = script?.getAttribute('liss-cdir') ?? null;
// TODO: default ?
const SW_PATH = script?.getAttribute('liss-sw') ?? null;
if (LISS_MODE === "auto-load" && DEFAULT_CDIR !== null) {
    if (!(0,V3_utils_DOM_isPageLoaded__WEBPACK_IMPORTED_MODULE_3__["default"])()) await (0,V3_utils_DOM_whenPageLoaded__WEBPACK_IMPORTED_MODULE_4__["default"])();
    autoload(DEFAULT_CDIR);
}
function autoload(cdir) {
    const SW = new Promise(async (resolve)=>{
        if (SW_PATH === null) {
            console.warn("You are using LISS Auto mode without sw.js.");
            resolve();
            return;
        }
        try {
            await navigator.serviceWorker.register(SW_PATH, {
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
    if (cdir[cdir.length - 1] !== '/') cdir += '/';
    //const brython = script.getAttribute("brython");
    // observe for new injected tags.
    new MutationObserver((mutations)=>{
        for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition.constructor.name === "HTMLElement") // cf https://github.com/WICG/webcomponents/issues/1097#issuecomment-2665092315
        // if(addition instanceof HTMLUnknownElement)
        addTag(addition);
    }).observe(document, {
        childList: true,
        subtree: true
    });
    for (let elem of document.querySelectorAll(":not(:defined)"))addTag(elem);
    async function addTag(tag) {
        await SW; // ensure SW is installed.
        const tagname = tag.tagName.toLowerCase();
        if (V3_define_define__WEBPACK_IMPORTED_MODULE_0__.WaitingDefine.has(tagname) || customElements.get(tagname) !== undefined) return;
        loadComponent(tagname, {
            //brython,
            cdir
        });
    }
}
async function loadComponent(tagname, { cdir = DEFAULT_CDIR } = {}) {
    V3_define_define__WEBPACK_IMPORTED_MODULE_0__.WaitingDefine.add(tagname);
    let true_tagdir = LISSContext?.override_tags?.[tagname] ?? tagname;
    const compo_dir = `${cdir}${true_tagdir}/`;
    const files = {};
    // strats : JS -> Bry -> HTML+CSS (cf script attr).
    files["js"] = await (0,V3_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.js`, true);
    if (files["js"] === undefined) {
        // try/catch ?
        const promises = [
            (0,V3_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.html`, true),
            (0,V3_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.css`, true)
        ];
        [files["html"], files["css"]] = await Promise.all(promises);
    }
    return await defineWebComponent(tagname, files, compo_dir);
}
//TODO: rename from files ?
async function defineWebComponent(tagname, files, origin) {
    let klass;
    if ("js" in files) klass = (await (0,V3_utils_execute__WEBPACK_IMPORTED_MODULE_6__["default"])(files["js"], "js", origin)).default;
    if (klass === undefined) klass = (0,V3__WEBPACK_IMPORTED_MODULE_1__["default"])({
        content_generator: V3_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_2__["default"],
        ...files
    });
    (0,V3_define_define__WEBPACK_IMPORTED_MODULE_0__["default"])(tagname, klass);
    return klass;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/V3/define/define.ts":
/*!*********************************!*\
  !*** ./src/V3/define/define.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WaitingDefine: () => (/* binding */ WaitingDefine),
/* harmony export */   "default": () => (/* binding */ define)
/* harmony export */ });
/* harmony import */ var _whenDefined__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./whenDefined */ "./src/V3/define/whenDefined.ts");
/* harmony import */ var V3_LISS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V3/LISS */ "./src/V3/LISS.ts");

const WaitingDefine = new Set();
async function define(tagname, Klass) {
    //TODO: Python class...
    //TODO: type safe
    if ("CONTENT_GENERATOR" in Klass) {
        const generator = Klass.CONTENT_GENERATOR;
        if (!generator.isReady) {
            WaitingDefine.add(tagname);
            await generator.whenReady;
        }
    }
    WaitingDefine.delete(tagname);
    customElements.define(tagname, Klass);
    const p = _whenDefined__WEBPACK_IMPORTED_MODULE_0__._whenDefinedPromises.get(Klass);
    if (p !== undefined) p.resolve();
}

V3_LISS__WEBPACK_IMPORTED_MODULE_1__["default"].define = define;


/***/ }),

/***/ "./src/V3/define/index.ts":
/*!********************************!*\
  !*** ./src/V3/define/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   define: () => (/* reexport safe */ _define__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   isDefined: () => (/* reexport safe */ _isDefined__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   whenDefined: () => (/* reexport safe */ _whenDefined__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./define */ "./src/V3/define/define.ts");
/* harmony import */ var _isDefined__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isDefined */ "./src/V3/define/isDefined.ts");
/* harmony import */ var _whenDefined__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./whenDefined */ "./src/V3/define/whenDefined.ts");
/* harmony import */ var V3_LISS__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/LISS */ "./src/V3/LISS.ts");




V3_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].define = _define__WEBPACK_IMPORTED_MODULE_0__["default"];
V3_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].isDefined = _isDefined__WEBPACK_IMPORTED_MODULE_1__["default"];
V3_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].whenDefined = _whenDefined__WEBPACK_IMPORTED_MODULE_2__["default"];



/***/ }),

/***/ "./src/V3/define/isDefined.ts":
/*!************************************!*\
  !*** ./src/V3/define/isDefined.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isDefined)
/* harmony export */ });
function isDefined(elem) {
    if (typeof elem === "string") return customElements.get(elem) !== undefined;
    return customElements.getName(elem) !== null;
}


/***/ }),

/***/ "./src/V3/define/whenDefined.ts":
/*!**************************************!*\
  !*** ./src/V3/define/whenDefined.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _whenDefinedPromises: () => (/* binding */ _whenDefinedPromises),
/* harmony export */   "default": () => (/* binding */ whenDefined)
/* harmony export */ });
const _whenDefinedPromises = new WeakMap();
async function whenDefined(elem) {
    if (typeof elem === "string") return await customElements.whenDefined(elem);
    if (customElements.getName(elem) !== null) return elem;
    let p = _whenDefinedPromises.get(elem);
    if (p === undefined) {
        p = Promise.withResolvers();
        _whenDefinedPromises.set(elem, p);
    }
    await p.promise;
    return elem;
}


/***/ }),

/***/ "./src/V3/index.ts":
/*!*************************!*\
  !*** ./src/V3/index.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _LISS__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISS */ "./src/V3/LISS.ts");
/* harmony import */ var _define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./define */ "./src/V3/define/index.ts");
/* harmony import */ var _define_autoload__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./define/autoload */ "./src/V3/define/autoload.ts");
/* harmony import */ var _utils_parsers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/parsers */ "./src/V3/utils/parsers/index.ts");
/* harmony import */ var _utils_network_require__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/network/require */ "./src/V3/utils/network/require.ts");
/* harmony import */ var _utils_tests_assertElement__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/tests/assertElement */ "./src/V3/utils/tests/assertElement.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_define_autoload__WEBPACK_IMPORTED_MODULE_2__]);
_define_autoload__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

// HERE...





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_LISS__WEBPACK_IMPORTED_MODULE_0__["default"]);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./src/V3/utils/DOM/isPageLoaded.ts":
/*!******************************************!*\
  !*** ./src/V3/utils/DOM/isPageLoaded.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isPageLoaded)
/* harmony export */ });
function isPageLoaded() {
    return document.readyState === "complete";
} /*
export function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete";
}*/ 


/***/ }),

/***/ "./src/V3/utils/DOM/whenPageLoaded.ts":
/*!********************************************!*\
  !*** ./src/V3/utils/DOM/whenPageLoaded.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ whenDOMContentLoaded)
/* harmony export */ });
/* harmony import */ var _isPageLoaded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isPageLoaded */ "./src/V3/utils/DOM/isPageLoaded.ts");

async function whenDOMContentLoaded() {
    if ((0,_isPageLoaded__WEBPACK_IMPORTED_MODULE_0__["default"])()) return;
    const { promise, resolve } = Promise.withResolvers();
    document.addEventListener('load', resolve, true);
    await promise;
} /*
export async function whenDOMContentLoaded() {
    if( isDOMContentLoaded() )
        return;

    const {promise, resolve} = Promise.withResolvers<void>()

	document.addEventListener('DOMContentLoaded', () => {
		resolve();
	}, true);

    await promise;
}*/ 


/***/ }),

/***/ "./src/V3/utils/encode.ts":
/*!********************************!*\
  !*** ./src/V3/utils/encode.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ encodeHTML)
/* harmony export */ });
const converter = document.createElement('span');
function encodeHTML(text) {
    converter.textContent = text;
    return converter.innerHTML;
}


/***/ }),

/***/ "./src/V3/utils/execute/index.ts":
/*!***************************************!*\
  !*** ./src/V3/utils/execute/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ execute)
/* harmony export */ });
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js */ "./src/V3/utils/execute/js.ts");

async function execute(code, type, origin) {
    if (type === "js") return await (0,_js__WEBPACK_IMPORTED_MODULE_0__["default"])(code, origin);
    throw new Error('');
}


/***/ }),

/***/ "./src/V3/utils/execute/js.ts":
/*!************************************!*\
  !*** ./src/V3/utils/execute/js.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ executeJS)
/* harmony export */ });
async function executeJS(code, origin) {
    const file = new Blob([
        code
    ], {
        type: 'application/javascript'
    });
    const url = URL.createObjectURL(file);
    const id = url.slice(url.lastIndexOf('/') + 1);
    ((globalThis.LISSContext ??= {}).execute ??= {
        url_map: {}
    }).url_map[id] = origin;
    const result = await import(/* webpackIgnore: true */ url);
    URL.revokeObjectURL(url);
    return result;
}


/***/ }),

/***/ "./src/V3/utils/network/fetchText.ts":
/*!*******************************************!*\
  !*** ./src/V3/utils/network/fetchText.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ fetchText)
/* harmony export */ });
// in auto-mode use ServiceWorker to hide 404 error messages.
// if playground files, use them.
async function fetchText(uri, hide404 = false) {
    const fetchContext = globalThis.LISSContext?.fetch;
    if (fetchContext !== undefined) {
        const path = new URL(uri, fetchContext.cwd);
        const value = fetchContext.files[path.toString()];
        if (value === "") return undefined;
        if (value !== undefined) return value;
    }
    const options = hide404 ? {
        headers: {
            "liss-auto": "true"
        }
    } : {};
    const response = await fetch(uri, options);
    if (response.status !== 200) return undefined;
    if (hide404 && response.headers.get("status") === "404") return undefined;
    const answer = await response.text();
    if (answer === "") return undefined;
    return answer;
}


/***/ }),

/***/ "./src/V3/utils/network/require.ts":
/*!*****************************************!*\
  !*** ./src/V3/utils/network/require.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fetchText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetchText */ "./src/V3/utils/network/fetchText.ts");

// @ts-ignore
globalThis.require = async function(url) {
    const stack = new Error().stack;
    let caller;
    if (stack.startsWith("Error")) {
        caller = stack.split('\n')[1 + 1].slice(7);
    } else {
        caller = stack.split('\n')[1].slice(1);
    }
    if (caller.startsWith('blob:')) {
        caller = caller.slice(caller.lastIndexOf('/') + 1);
        caller = caller.slice(0, caller.indexOf(':'));
        url = LISSContext.execute.url_map[caller] + url;
    //TODO: rewrite URL...
    } else {
        console.warn(caller);
        throw new Error("require from non-blob import, unimplemented");
    }
    // TODO: reverify playground
    return await (0,_fetchText__WEBPACK_IMPORTED_MODULE_0__["default"])(url);
};


/***/ }),

/***/ "./src/V3/utils/network/ressource.ts":
/*!*******************************************!*\
  !*** ./src/V3/utils/network/ressource.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRessourceReady: () => (/* binding */ isRessourceReady),
/* harmony export */   waitRessource: () => (/* binding */ waitRessource)
/* harmony export */ });
function isRessourceReady(res) {
    if (Array.isArray(res)) return res.every((e)=>isRessourceReady(e));
    return res === undefined || !(res instanceof Promise || res instanceof Response);
}
async function waitRessource(res) {
    if (Array.isArray(res)) return await Promise.all(res.map((e)=>waitRessource(e)));
    if (res instanceof Promise) res = await res;
    if (res instanceof Response) res = await res.text();
    return res;
}


/***/ }),

/***/ "./src/V3/utils/parsers/html.ts":
/*!**************************************!*\
  !*** ./src/V3/utils/parsers/html.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ html)
/* harmony export */ });
const template = document.createElement("template");
const df = template.content;
function html(...raw) {
    let elem = raw[0];
    if (Array.isArray(elem)) {
        const str = raw[0];
        let string = str[0];
        for(let i = 1; i < raw.length; ++i){
            string += raw[i];
            string += str[i];
        }
        elem = string;
    }
    template.innerHTML = elem;
    if (df.childNodes.length !== 1) throw new Error("Error");
    return df.firstChild;
}


/***/ }),

/***/ "./src/V3/utils/parsers/index.ts":
/*!***************************************!*\
  !*** ./src/V3/utils/parsers/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   style: () => (/* reexport safe */ _style__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   template: () => (/* reexport safe */ _template__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var V3_LISS__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V3/LISS */ "./src/V3/LISS.ts");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./html */ "./src/V3/utils/parsers/html.ts");
/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./template */ "./src/V3/utils/parsers/template.ts");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style */ "./src/V3/utils/parsers/style.ts");




V3_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].style = _style__WEBPACK_IMPORTED_MODULE_3__["default"];
V3_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].template = _template__WEBPACK_IMPORTED_MODULE_2__["default"];
V3_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].html = _html__WEBPACK_IMPORTED_MODULE_1__["default"];



/***/ }),

/***/ "./src/V3/utils/parsers/style.ts":
/*!***************************************!*\
  !*** ./src/V3/utils/parsers/style.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ style)
/* harmony export */ });
function style(...raw) {
    let elem = raw[0];
    if (elem instanceof CSSStyleSheet) return elem;
    if (elem instanceof HTMLStyleElement) return elem.sheet;
    if (Array.isArray(elem)) {
        const str = raw[0];
        let string = str[0];
        for(let i = 1; i < raw.length; ++i){
            string += raw[i];
            string += str[i];
        }
        elem = string;
    }
    if (typeof elem !== "string") {
        console.warn(elem);
        console.trace();
        throw new Error("Should not occurs");
    }
    const style1 = new CSSStyleSheet();
    style1.replaceSync(elem);
    return style1;
}


/***/ }),

/***/ "./src/V3/utils/parsers/template.ts":
/*!******************************************!*\
  !*** ./src/V3/utils/parsers/template.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ template)
/* harmony export */ });
function template(...raw) {
    let elem = raw[0];
    if (Array.isArray(elem)) {
        const str = raw[0];
        let string = str[0];
        for(let i = 1; i < raw.length; ++i){
            string += raw[i];
            string += str[i];
        }
        elem = string;
    }
    if (elem instanceof DocumentFragment) return elem.cloneNode(true);
    // must use template as DocumentFragment doesn't have .innerHTML
    let template1 = document.createElement('template');
    if (typeof elem === 'string') template1.innerHTML = elem.trim();
    else {
        if (elem instanceof HTMLElement) // prevents issue if elem is latter updated.
        elem = elem.cloneNode(true);
        template1.append(elem);
    }
    //if( template.content.childNodes.length === 1 && template.content.firstChild!.nodeType !== Node.TEXT_NODE)
    //  return template.content.firstChild! as unknown as T;
    return template1.content;
}


/***/ }),

/***/ "./src/V3/utils/tests/assertElement.ts":
/*!*********************************************!*\
  !*** ./src/V3/utils/tests/assertElement.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ assertElement)
/* harmony export */ });
/* harmony import */ var V2_LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V2/LifeCycle/DEFINED */ "./src/V2/LifeCycle/DEFINED.ts");
/* harmony import */ var V3_LISS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V3/LISS */ "./src/V3/LISS.ts");
function waitFrame() {
    const { promise, resolve } = Promise.withResolvers();
    requestAnimationFrame(()=>resolve());
    return promise;
}
async function assertElement(tagname, opts = {}) {
    const shadow_html = opts.shadow_html ?? null;
    const css = opts.css ?? {};
    await (0,V2_LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_0__.whenDefined)(tagname);
    //for(let i = 0; i < 1; ++i)
    //    await waitFrame();
    const elem = document.querySelector(tagname);
    if (elem === null) throw new Error("Component not found");
    //TODO: ...
    //await LISS.whenInitialized(elem);
    if (elem.tagName.toLowerCase() !== tagname) throw new Error(`Wrong tagname.
Expected: ${tagname}
Got: ${elem.tagName.toLowerCase()}`);
    if (elem.constructor.name === "HTMLElement") throw new Error(`Element not upgraded!`);
    if (shadow_html !== elem.shadowRoot) {
        if (shadow_html === null || elem.shadowRoot === null) throw new Error(`ShadowRoot missing or unexpected.`);
        if (shadow_html !== elem.shadowRoot.innerHTML) throw new Error(`HTML content mismatched.
Expected: ${shadow_html}
Got: ${elem.shadowRoot.innerHTML}`);
    }
    for(let selector in css){
        const expected = css[selector];
        let sub_elems;
        if (selector === "") sub_elems = [
            elem
        ];
        else sub_elems = (elem.content ?? elem.shadowRoot ?? elem).querySelectorAll(selector);
        if (sub_elems.length === 0) throw new Error(`Elements "${selector}" not found`);
        for (let sub_elem of sub_elems){
            // compare style : https://stackoverflow.com/questions/59342928/getcomputedstyle-only-the-changes-from-default
            //  ^ get all elements, find matching qs, compare
            // pseudo class  : https://stackoverflow.com/questions/32091848/template-queryselector-using-scope-pseudo-class-works-with-document-but-not
            const css = getComputedStyle(sub_elem);
            for(let propname in expected){
                const val = css.getPropertyValue(propname);
                if (val !== expected[propname]) {
                    throw new Error(`CSS mismatch
        Expected:${expected}
        Got: ${css}`);
                }
            }
        }
    }
}


V3_LISS__WEBPACK_IMPORTED_MODULE_1__["default"].assertElement = assertElement;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V2: () => (/* reexport safe */ V2__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   V3: () => (/* reexport safe */ V3__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var V2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V2 */ "./src/V2/index.ts");
/* harmony import */ var V3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V3 */ "./src/V3/index.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([V3__WEBPACK_IMPORTED_MODULE_1__]);
V3__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (V3__WEBPACK_IMPORTED_MODULE_1__["default"]);
// @ts-ignore
globalThis.LISS = V3__WEBPACK_IMPORTED_MODULE_1__["default"];

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && queue.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && queue.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
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
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ var __webpack_exports__V2 = __webpack_exports__.V2;
/******/ var __webpack_exports__V3 = __webpack_exports__.V3;
/******/ var __webpack_exports__default = __webpack_exports__["default"];
/******/ export { __webpack_exports__V2 as V2, __webpack_exports__V3 as V3, __webpack_exports__default as default };
/******/ 

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7U0FDQTtTQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9Db250ZW50R2VuZXJhdG9yLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTElTU0NvbnRyb2xlci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL0RFRklORUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvSU5JVElBTElaRUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvUkVBRFkudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvVVBHUkFERUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvc3RhdGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvY29yZS9MaWZlQ3ljbGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9leHRlbmRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9MSVNTQXV0by50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvYnVpbGQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL2V2ZW50cy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL3R5cGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9Db250ZW50R2VuZXJhdG9ycy9BdXRvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0NvbnRlbnRHZW5lcmF0b3JzL0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9MSVNTLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvTElTUy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0xJU1MvTElTU0Z1bGwudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9kZWZpbmUvYXV0b2xvYWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9kZWZpbmUvZGVmaW5lLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL2lzRGVmaW5lZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2RlZmluZS93aGVuRGVmaW5lZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvRE9NL2lzUGFnZUxvYWRlZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL0RPTS93aGVuUGFnZUxvYWRlZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL2VuY29kZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL2V4ZWN1dGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9leGVjdXRlL2pzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvbmV0d29yay9mZXRjaFRleHQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9uZXR3b3JrL3JlcXVpcmUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9uZXR3b3JrL3Jlc3NvdXJjZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3BhcnNlcnMvaHRtbC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3BhcnNlcnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9wYXJzZXJzL3N0eWxlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvcGFyc2Vycy90ZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3Rlc3RzL2Fzc2VydEVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2FzeW5jIG1vZHVsZSIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xJU1Mvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTaGFyZWRDU1MgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgTEhvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIGlzU2hhZG93U3VwcG9ydGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbnR5cGUgSFRNTCA9IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nO1xudHlwZSBDU1MgID0gc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudDtcblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge1xuICAgIGh0bWwgICA/OiBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZyxcbiAgICBjc3MgICAgPzogQ1NTIHwgcmVhZG9ubHkgQ1NTW10sXG4gICAgc2hhZG93ID86IFNoYWRvd0NmZ3xudWxsXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JDc3RyID0geyBuZXcob3B0czogQ29udGVudEdlbmVyYXRvcl9PcHRzKTogQ29udGVudEdlbmVyYXRvciB9O1xuXG5jb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgICNzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdO1xuICAgICN0ZW1wbGF0ZSAgIDogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsO1xuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgZGF0YTogYW55O1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRoaXMucHJlcGFyZUhUTUwoaHRtbCk7XG4gICAgXG4gICAgICAgIHRoaXMuI3N0eWxlc2hlZXRzID0gdGhpcy5wcmVwYXJlQ1NTKGNzcyk7XG5cbiAgICAgICAgdGhpcy4jaXNSZWFkeSAgID0gaXNET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIHRoaXMuI3doZW5SZWFkeSA9IHdoZW5ET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgLy9UT0RPOiBvdGhlciBkZXBzLi4uXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFRlbXBsYXRlKHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgI3doZW5SZWFkeTogUHJvbWlzZTx1bmtub3duPjtcbiAgICAjaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lzUmVhZHk7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKCB0aGlzLiNpc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy4jd2hlblJlYWR5O1xuICAgICAgICAvL1RPRE86IGRlcHMuXG4gICAgICAgIC8vVE9ETzogQ1NTL0hUTUwgcmVzb3VyY2VzLi4uXG5cbiAgICAgICAgLy8gaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cbiAgICAgICAgLy8gX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG4gICAgICAgIC8vICsgY2YgYXQgdGhlIGVuZC4uLlxuICAgIH1cblxuICAgIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuICAgICAgICB0aGlzLmluamVjdENTUyhzaGFkb3csIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBzaGFkb3cuYXBwZW5kKCB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKHNoYWRvdyk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnR8U2hhZG93Um9vdCB7XG5cbiAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLiAgICAgXG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pbml0U2hhZG93KGhvc3QpO1xuXG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHRhcmdldCwgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGlmKCBob3N0LnNoYWRvd01vZGUgIT09IFNoYWRvd0NmZy5OT05FIHx8IHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKGNvbnRlbnQpO1xuXG4gICAgICAgIC8vaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgJiYgdGFyZ2V0LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKVxuXHRcdC8vXHR0YXJnZXQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGhvc3QpO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTaGFkb3c8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KSB7XG5cbiAgICAgICAgY29uc3QgY2FuSGF2ZVNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpO1xuICAgICAgICBpZiggdGhpcy4jc2hhZG93ICE9PSBudWxsICYmIHRoaXMuI3NoYWRvdyAhPT0gU2hhZG93Q2ZnLk5PTkUgJiYgISBjYW5IYXZlU2hhZG93IClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICAgICAgbGV0IG1vZGUgPSB0aGlzLiNzaGFkb3c7XG4gICAgICAgIGlmKCBtb2RlID09PSBudWxsIClcbiAgICAgICAgICAgIG1vZGUgPSBjYW5IYXZlU2hhZG93ID8gU2hhZG93Q2ZnLk9QRU4gOiBTaGFkb3dDZmcuTk9ORTtcblxuICAgICAgICBob3N0LnNoYWRvd01vZGUgPSBtb2RlO1xuXG4gICAgICAgIGxldCB0YXJnZXQ6IEhvc3R8U2hhZG93Um9vdCA9IGhvc3Q7XG4gICAgICAgIGlmKCBtb2RlICE9PSBTaGFkb3dDZmcuTk9ORSlcbiAgICAgICAgICAgIHRhcmdldCA9IGhvc3QuYXR0YWNoU2hhZG93KHttb2RlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUNTUyhjc3M6IENTU3xyZWFkb25seSBDU1NbXSkge1xuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgcmV0dXJuIGNzcy5tYXAoZSA9PiB0aGlzLnByb2Nlc3NDU1MoZSkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NTUyhjc3M6IENTUykge1xuXG4gICAgICAgIGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG4gICAgICAgICAgICByZXR1cm4gY3NzO1xuICAgICAgICBpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBjc3Muc2hlZXQhO1xuICAgIFxuICAgICAgICBpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1clwiKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUhUTUwoaHRtbD86IEhUTUwpOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGwge1xuICAgIFxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgaWYoaHRtbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgIC8vIHN0cjJodG1sXG4gICAgICAgIGlmKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gaHRtbC50cmltKCk7XG5cbiAgICAgICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBodG1sIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKVxuICAgICAgICAgICAgaHRtbCA9IGh0bWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIHRlbXBsYXRlLmFwcGVuZChodG1sKTtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIGluamVjdENTUzxIb3N0IGV4dGVuZHMgTEhvc3Q+KHRhcmdldDogU2hhZG93Um9vdHxIb3N0LCBzdHlsZXNoZWV0czogYW55W10pIHtcblxuICAgICAgICBpZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCApIHtcbiAgICAgICAgICAgIHRhcmdldC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MsIC4uLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNzc3NlbGVjdG9yID0gdGFyZ2V0LkNTU1NlbGVjdG9yOyAvL1RPRE8uLi5cblxuICAgICAgICBpZiggYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG4gICAgICAgIGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcbiAgICAgICAgZm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcbiAgICAgICAgICAgIGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcbiAgICAgICAgICAgICAgICBodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcbiAgICAgICAgYWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG4gICAgfVxufVxuXG4vLyBpZGVtIEhUTUwuLi5cbi8qIGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBjID0gYXdhaXQgYztcbiAgICAgICAgICAgIGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuICAgICAgICAgICAgICAgIGMgPSBhd2FpdCBjLnRleHQoKTtcblxuICAgICAgICAgICAgc3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG4gICAgICAgIH0pKCkpO1xuXG4gICAgICAgIHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcbiAgICB9XG4qLyIsImltcG9ydCB7IExIb3N0Q3N0ciwgdHlwZSBDbGFzcywgdHlwZSBDb25zdHJ1Y3RvciwgdHlwZSBMSVNTX09wdHMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBidWlsZExJU1NIb3N0LCBzZXRDc3RyQ29udHJvbGVyIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWV9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8qKioqL1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0Ly8gbm9uLXZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBob3N0OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdC8vIHZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBpc0Nvbm5lY3RlZCAgOmJvb2xlYW47XG59O1xuXHQvLyArIHByb3RlY3RlZFxuXHRcdC8vIHJlYWRvbmx5IC5jb250ZW50OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Q7XG5cdC8vIHZhbmlsbGEgSlNcblx0XHQvLyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCk6IHZvaWQ7XG5cdFx0Ly8gY29ubmVjdGVkQ2FsbGJhY2sgICAoKTogdm9pZDtcblx0XHQvLyBkaXNjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkO1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiB7XG5cdG5ldygpOiBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW107XG59XG5cdC8vICsgXCJwcml2YXRlXCJcblx0XHQvLyByZWFkb25seSBIb3N0OiBIb3N0Q3N0clxuXG5leHBvcnQgdHlwZSBDb250cm9sZXI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEluc3RhbmNlVHlwZTxFeHRlbmRzQ3N0cj47XG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4gJiBFeHRlbmRzQ3N0cjtcblxuLyoqKiovXG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPihhcmdzOiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+PiA9IHt9KSB7XG5cblx0bGV0IHtcblx0XHQvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cblx0XHRleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCAgICAgIGFzIHVua25vd24gYXMgRXh0ZW5kc0NzdHIsXG5cdFx0aG9zdCAgICAgICAgICAgICAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRcblx0XHRjb250ZW50X2dlbmVyYXRvciA9IENvbnRlbnRHZW5lcmF0b3IsXG5cdH0gPSBhcmdzO1xuXHRcblx0Y2xhc3MgTElTU0NvbnRyb2xlciBleHRlbmRzIF9leHRlbmRzIGltcGxlbWVudHMgSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+e1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0c2V0Q3N0ckNvbnRyb2xlcih0aGlzKTtcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KC4uLmFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3QuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge31cblxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaG9zdC5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogSW5zdGFuY2VUeXBlPExIb3N0Q3N0cjxIb3N0Q3N0cj4+O1xuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgX0hvc3Q6IExIb3N0Q3N0cjxIb3N0Q3N0cj47XG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlOiBmdWNrIG9mZi5cblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QoIHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aG9zdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcmdzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQ29udHJvbGVyIHNhdGlzZmllcyBDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG59IiwiaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBTaGFkb3dDZmcsIHR5cGUgTElTU0NvbnRyb2xlckNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tIFwiLi9MaWZlQ3ljbGUvc3RhdGVzXCI7XG5cbi8vIExJU1NIb3N0IG11c3QgYmUgYnVpbGQgaW4gZGVmaW5lIGFzIGl0IG5lZWQgdG8gYmUgYWJsZSB0byBidWlsZFxuLy8gdGhlIGRlZmluZWQgc3ViY2xhc3MuXG5cbmxldCBpZCA9IDA7XG5cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcmVkQ1NTKCkge1xuXHRyZXR1cm4gc2hhcmVkQ1NTO1xufVxuXG5sZXQgX19jc3RyX2NvbnRyb2xlciAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckNvbnRyb2xlcihfOiBhbnkpIHtcblx0X19jc3RyX2NvbnRyb2xlciA9IF87XG59XG5cbnR5cGUgaW5mZXJIb3N0Q3N0cjxUPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cjxpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LCBpbmZlciBCIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA/IEIgOiBuZXZlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XHRUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsIFUgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBpbmZlckhvc3RDc3RyPFQ+ID4oXG5cdFx0XHRcdFx0XHRcdExpc3M6IFQsXG5cdFx0XHRcdFx0XHRcdC8vIGNhbid0IGRlZHVjZSA6IGNhdXNlIHR5cGUgZGVkdWN0aW9uIGlzc3Vlcy4uLlxuXHRcdFx0XHRcdFx0XHRob3N0Q3N0cjogVSxcblx0XHRcdFx0XHRcdFx0Y29udGVudF9nZW5lcmF0b3JfY3N0cjogQ29udGVudEdlbmVyYXRvckNzdHIsXG5cdFx0XHRcdFx0XHRcdGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcblx0XHRcdFx0XHRcdCkge1xuXG5cdGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gbmV3IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIoYXJncyk7XG5cblx0dHlwZSBIb3N0Q3N0ciA9IFU7XG4gICAgdHlwZSBIb3N0ICAgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Y2xhc3MgTElTU0hvc3QgZXh0ZW5kcyBob3N0Q3N0ciB7XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgQ2ZnID0ge1xuXHRcdFx0aG9zdCAgICAgICAgICAgICA6IGhvc3RDc3RyLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIsXG5cdFx0XHRhcmdzXG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IERFUEVOREVOQ0lFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHN0YXRpYyBDb250cm9sZXIgPSBMaXNzO1xuXG5cdFx0I2NvbnRyb2xlcjogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBjb250cm9sZXIoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlciAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdC8vVE9ETzogZ2V0IHJlYWwgVFMgdHlwZSA/XG5cdFx0I3BhcmFtczogYW55W107XG5cdFx0aW5pdGlhbGl6ZSguLi5wYXJhbXM6IGFueVtdKSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgYWxyZWFkeSBpbml0aWFsaXplZCEnKTtcbiAgICAgICAgICAgIGlmKCAhICggdGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzRGVwc1Jlc29sdmVkIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdGlmKCBwYXJhbXMubGVuZ3RoICE9PSAwICkge1xuXHRcdFx0XHRpZiggdGhpcy4jcGFyYW1zLmxlbmd0aCAhPT0gMCApXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDc3RyIHBhcmFtcyBoYXMgYWxyZWFkeSBiZWVuIHByb3ZpZGVkICEnKTtcblx0XHRcdFx0dGhpcy4jcGFyYW1zID0gcGFyYW1zO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNjb250cm9sZXIgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuaXNDb25uZWN0ZWQgKVxuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBDb250ZW50ID09PT09PT09PT09PT09PT09PT1cblxuXHRcdC8vI2ludGVybmFscyA9IHRoaXMuYXR0YWNoSW50ZXJuYWxzKCk7XG5cdFx0Ly8jc3RhdGVzICAgID0gdGhpcy4jaW50ZXJuYWxzLnN0YXRlcztcblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290ID0gdGhpcyBhcyBIb3N0O1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgYXR0YWNoU2hhZG93KGluaXQ6IFNoYWRvd1Jvb3RJbml0KTogU2hhZG93Um9vdCB7XG5cdFx0XHRjb25zdCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3coaW5pdCk7XG5cblx0XHRcdC8vIEB0cy1pZ25vcmUgY2xvc2VkIElTIGFzc2lnbmFibGUgdG8gc2hhZG93TW9kZS4uLlxuXHRcdFx0dGhpcy5zaGFkb3dNb2RlID0gaW5pdC5tb2RlO1xuXG5cdFx0XHR0aGlzLiNjb250ZW50ID0gc2hhZG93O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc2hhZG93O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2hhZG93TW9kZSAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKC4uLnBhcmFtczogYW55W10pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19VUEdSQURFRCk7XG5cdFx0XHRjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKS50aGVuKCgpID0+IHtcblx0XHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX1JFQURZKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRjb25zdCBjb250cm9sZXIgPSBfX2NzdHJfY29udHJvbGVyO1xuXHRcdFx0X19jc3RyX2NvbnRyb2xlciA9IG51bGw7XG5cblx0XHRcdGlmKCBjb250cm9sZXIgIT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gY29udHJvbGVyO1xuXHRcdFx0XHR0aGlzLmluaXQoKTsgLy8gY2FsbCB0aGUgcmVzb2x2ZXJcblx0XHRcdH1cblxuXHRcdFx0aWYoIFwiX3doZW5VcGdyYWRlZFJlc29sdmVcIiBpbiB0aGlzKVxuXHRcdFx0XHQodGhpcy5fd2hlblVwZ3JhZGVkUmVzb2x2ZSBhcyBhbnkpKCk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PSBET00gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHRcdFxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRpZih0aGlzLmNvbnRyb2xlciAhPT0gbnVsbClcblx0XHRcdFx0dGhpcy5jb250cm9sZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmNvbnRyb2xlciEuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBpbnN0YW5jZSBkZXBzXG5cdFx0XHRpZiggY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblxuXHRcdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHR9KSgpO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIExJU1NIb3N0LkNvbnRyb2xlci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG5cdFx0fVxuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZih0aGlzLiNjb250cm9sZXIpXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblx0XHR9XG5cblx0XHRzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbCA9IG51bGw7XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cblx0XHRcdC8vIG5vIG5lZWRzIHRvIHNldCB0aGlzLiNjb250ZW50IChhbHJlYWR5IGhvc3Qgb3Igc2V0IHdoZW4gYXR0YWNoU2hhZG93KVxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3IuZ2VuZXJhdGUodGhpcyk7XG5cblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblxuXHRcdFx0aWYoIHRoaXMuI2NvbnRyb2xlciA9PT0gbnVsbCkge1xuXHRcdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gbmV3IExJU1NIb3N0LkNvbnRyb2xlciguLi50aGlzLiNwYXJhbXMpIGFzIEluc3RhbmNlVHlwZTxUPjtcblx0XHRcdH1cblxuXHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX0lOSVRJQUxJWkVEKTtcblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuY29udHJvbGVyKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29udHJvbGVyO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3Q7XG59XG5cblxuIiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SFRNTEVsZW1lbnQ7XG5cbi8vIFRPRE8uLi5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPnxhbnkpIHtcblxuXHRsZXQgSG9zdDogTElTU0hvc3RDc3RyPFQ+ID0gQ29tcG9uZW50Q2xhc3MgYXMgYW55O1xuXG5cdC8vIEJyeXRob24gY2xhc3Ncblx0bGV0IGJyeV9jbGFzczogYW55ID0gbnVsbDtcblx0aWYoIFwiJGlzX2NsYXNzXCIgaW4gQ29tcG9uZW50Q2xhc3MgKSB7XG5cblx0XHRicnlfY2xhc3MgPSBDb21wb25lbnRDbGFzcztcblxuXHRcdENvbXBvbmVudENsYXNzID0gYnJ5X2NsYXNzLl9fYmFzZXNfXy5maWx0ZXIoIChlOiBhbnkpID0+IGUuX19uYW1lX18gPT09IFwiV3JhcHBlclwiKVswXS5fanNfa2xhc3MuJGpzX2Z1bmM7XG5cdFx0KENvbXBvbmVudENsYXNzIGFzIGFueSkuSG9zdC5Db250cm9sZXIgPSBjbGFzcyB7XG5cblx0XHRcdCNicnk6IGFueTtcblxuXHRcdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHR0aGlzLiNicnkgPSBfX0JSWVRIT05fXy4kY2FsbChicnlfY2xhc3MsIFswLDAsMF0pKC4uLmFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHQjY2FsbChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRjYWxsKF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIG5hbWUsIFswLDAsMF0pLCBbMCwwLDBdKSguLi5hcmdzKVxuXHRcdFx0fVxuXG5cdFx0XHRnZXQgaG9zdCgpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgXCJob3N0XCIsIFswLDAsMF0pXG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBicnlfY2xhc3NbXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIl07XG5cblx0XHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0Y29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblx0XHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiZGlzY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYoIFwiSG9zdFwiIGluIENvbXBvbmVudENsYXNzIClcblx0XHRIb3N0ID0gQ29tcG9uZW50Q2xhc3MuSG9zdCBhcyBhbnk7XG5cbiAgICBsZXQgaHRtbHRhZyA9IHVuZGVmaW5lZDtcbiAgICBpZiggXCJDZmdcIiBpbiBIb3N0KSB7XG4gICAgICAgIGNvbnN0IENsYXNzICA9IEhvc3QuQ2ZnLmhvc3Q7XG4gICAgICAgIGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBIb3N0LCBvcHRzKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHJ8TElTU0hvc3Q8TElTU0NvbnRyb2xlcj58TElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+ICk6IHN0cmluZyB7XG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIGlmKCBcImhvc3RcIiBpbiBlbGVtZW50KVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5ob3N0O1xuICAgIGlmKCBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICBjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICBpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8vIGNzdHJcblxuXHRpZiggXCJIb3N0XCIgaW4gZWxlbWVudClcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuSG9zdCBhcyB1bmtub3duIGFzIExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPjtcblxuICAgIGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG4gICAgaWYobmFtZSA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBpcyBub3QgZGVmaW5lZCFcIik7XG5cbiAgICByZXR1cm4gbmFtZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSkgIT09IHVuZGVmaW5lZDtcblxuICAgIGlmKCBcIkhvc3RcIiBpbiBlbGVtKVxuICAgICAgICBlbGVtID0gZWxlbS5Ib3N0IGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0gYXMgYW55KSAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0Q3N0cjxUPj4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlbGVtKTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbGlzdGVuIGRlZmluZS4uLlxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59XG5cbi8qXG4vLyBUT0RPOiBpbXBsZW1lbnRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10pIDogUHJvbWlzZTx2b2lkPiB7XG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG59XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3RDc3RyPFQ+PiB7XG4gICAgLy8gd2UgY2FuJ3QgZm9yY2UgYSBkZWZpbmUuXG4gICAgcmV0dXJuIHdoZW5EZWZpbmVkKGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdENzdHI8VD4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuXG4gICAgICAgIGxldCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pO1xuICAgICAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlbGVtfSBub3QgZGVmaW5lZCB5ZXQhYCk7XG5cbiAgICAgICAgcmV0dXJuIGhvc3QgYXMgdW5rbm93biBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgaWYoIFwiSG9zdFwiIGluIGVsZW0pXG4gICAgICAgIGVsZW0gPSBlbGVtLkhvc3QgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgaWYoIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSBhcyBhbnkpID09PSBudWxsIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2VsZW19IG5vdCBkZWZpbmVkIHlldCFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0Q3N0cjxUPjtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCB3aGVuVXBncmFkZWQgfSBmcm9tIFwiLi9VUEdSQURFRFwiO1xuaW1wb3J0IHsgaXNSZWFkeSwgd2hlblJlYWR5IH0gZnJvbSBcIi4vUkVBRFlcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBMSVNTSG9zdDxUPnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoICEgaXNVcGdyYWRlZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHdoZW5VcGdyYWRlZChlbGVtKTtcblxuICAgIHJldHVybiBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZCBhcyBUO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29udHJvbGVyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG4gICAgYXdhaXQgd2hlblJlYWR5KGhvc3QpO1xuXG4gICAgLy9UT0RPOiBpbml0aWFsaXplU3luYyB2cyBpbml0aWFsaXplID9cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcbiAgICBpZiggISBpc1JlYWR5KGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kYW5jaWVzIG5vdCByZWFkeSAhXCIpXG5cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplICAgICA9IGdldENvbnRyb2xlcjtcbmV4cG9ydCBjb25zdCBpbml0aWFsaXplU3luYyA9IGdldENvbnRyb2xlclN5bmM7IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlYWR5PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgY29uc3QgaG9zdENzdHIgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICByZXR1cm4gaG9zdENzdHIuaXNEZXBzUmVzb2x2ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuUmVhZHk8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IGhvc3RDc3RyID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG4gICAgYXdhaXQgaG9zdENzdHIud2hlbkRlcHNSZXNvbHZlZDtcblxuICAgIHJldHVybiBob3N0Q3N0ci5Db250cm9sZXIgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIC8vIHdlIGNhbid0IGZvcmNlIGEgcmVhZHkuXG4gICAgcmV0dXJuIHdoZW5SZWFkeShlbGVtKSBhcyBQcm9taXNlPFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0clN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGlmKCAhIGlzUmVhZHkoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgcmV0dXJuIGdldEhvc3RDc3RyU3luYyhlbGVtKS5Db250cm9sZXIgYXMgVDtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPF9UIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBIVE1MRWxlbWVudDtcblxuLy9UT0RPOiB1cGdyYWRlIGZ1bmN0aW9uLi4uXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPnxMSVNTSG9zdDxUPik6IGVsZW0gaXMgTElTU0hvc3Q8VD4ge1xuXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgSG9zdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgY29uc3QgSG9zdCA9IGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuXG4gICAgLy8gYWxyZWFkeSB1cGdyYWRlZFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSG9zdClcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG5cbiAgICAvLyBoNGNrXG5cbiAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xuICAgIH1cblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgIFxuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0U3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdDxUPiB7XG4gICAgXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgZGVmaW5lZCAhXCIpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgY29uc3QgdXBncmFkZSAgICAgPSBnZXRIb3N0O1xuZXhwb3J0IGNvbnN0IHVwZ3JhZGVTeW5jID0gZ2V0SG9zdFN5bmMiLCJleHBvcnQgZW51bSBTdGF0ZXMge1xuICAgIExJU1NfREVGSU5FRCAgICAgPSBcIkxJU1NfREVGSU5FRFwiLFxuICAgIExJU1NfVVBHUkFERUQgICAgPSBcIkxJU1NfVVBHUkFERURcIixcbiAgICBMSVNTX1JFQURZICAgICAgID0gXCJMSVNTX1JFQURZXCIsXG4gICAgTElTU19JTklUSUFMSVpFRCA9IFwiTElTU19JTklUSUFMSVpFRFwiXG59IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuXG5pbXBvcnQge1N0YXRlc30gZnJvbSBcIi4uL0xpZmVDeWNsZS9zdGF0ZXMudHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIFN0YXRlcyAgICAgICAgIDogdHlwZW9mIFN0YXRlc1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5TdGF0ZXMgPSBTdGF0ZXM7XG5cblxuaW1wb3J0IHtkZWZpbmUsIGdldE5hbWUsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQsIGdldEhvc3RDc3RyLCBnZXRIb3N0Q3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdGdldEhvc3RDc3RyICAgIDogdHlwZW9mIGdldEhvc3RDc3RyO1xuXHRcdGdldEhvc3RDc3RyU3luYzogdHlwZW9mIGdldEhvc3RDc3RyU3luYztcblx0XHQvLyB3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldEhvc3RDc3RyU3luYz0gZ2V0SG9zdENzdHJTeW5jO1xuXG4vL0xJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcblxuaW1wb3J0IHtpc1JlYWR5LCB3aGVuUmVhZHksIGdldENvbnRyb2xlckNzdHIsIGdldENvbnRyb2xlckNzdHJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1JFQURZXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzUmVhZHkgICAgICA6IHR5cGVvZiBpc1JlYWR5O1xuXHRcdHdoZW5SZWFkeSAgICA6IHR5cGVvZiB3aGVuUmVhZHk7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0ciAgICA6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyO1xuXHRcdGdldENvbnRyb2xlckNzdHJTeW5jOiB0eXBlb2YgZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzUmVhZHkgICAgICAgICAgICAgPSBpc1JlYWR5O1xuTElTUy53aGVuUmVhZHkgICAgICAgICAgID0gd2hlblJlYWR5O1xuTElTUy5nZXRDb250cm9sZXJDc3RyICAgID0gZ2V0Q29udHJvbGVyQ3N0cjtcbkxJU1MuZ2V0Q29udHJvbGVyQ3N0clN5bmM9IGdldENvbnRyb2xlckNzdHJTeW5jO1xuXG5cblxuaW1wb3J0IHtpc1VwZ3JhZGVkLCB3aGVuVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCBnZXRIb3N0LCBnZXRIb3N0U3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9VUEdSQURFRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc1VwZ3JhZGVkICA6IHR5cGVvZiBpc1VwZ3JhZGVkO1xuXHRcdHdoZW5VcGdyYWRlZDogdHlwZW9mIHdoZW5VcGdyYWRlZDtcblx0XHR1cGdyYWRlICAgICA6IHR5cGVvZiB1cGdyYWRlO1xuXHRcdHVwZ3JhZGVTeW5jIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuXHRcdGdldEhvc3QgICAgIDogdHlwZW9mIGdldEhvc3Q7XG5cdFx0Z2V0SG9zdFN5bmMgOiB0eXBlb2YgZ2V0SG9zdFN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzVXBncmFkZWQgID0gaXNVcGdyYWRlZDtcbkxJU1Mud2hlblVwZ3JhZGVkPSB3aGVuVXBncmFkZWQ7XG5MSVNTLnVwZ3JhZGUgICAgID0gdXBncmFkZTtcbkxJU1MudXBncmFkZVN5bmMgPSB1cGdyYWRlU3luYztcbkxJU1MuZ2V0SG9zdCAgICAgPSBnZXRIb3N0O1xuTElTUy5nZXRIb3N0U3luYyA9IGdldEhvc3RTeW5jO1xuXG5cbmltcG9ydCB7aXNJbml0aWFsaXplZCwgd2hlbkluaXRpYWxpemVkLCBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYywgZ2V0Q29udHJvbGVyLCBnZXRDb250cm9sZXJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzSW5pdGlhbGl6ZWQgICAgOiB0eXBlb2YgaXNJbml0aWFsaXplZDtcblx0XHR3aGVuSW5pdGlhbGl6ZWQgIDogdHlwZW9mIHdoZW5Jbml0aWFsaXplZDtcblx0XHRpbml0aWFsaXplICAgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG5cdFx0aW5pdGlhbGl6ZVN5bmMgICA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcblx0XHRnZXRDb250cm9sZXIgICAgIDogdHlwZW9mIGdldENvbnRyb2xlcjtcblx0XHRnZXRDb250cm9sZXJTeW5jIDogdHlwZW9mIGdldENvbnRyb2xlclN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzSW5pdGlhbGl6ZWQgICAgPSBpc0luaXRpYWxpemVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQgID0gd2hlbkluaXRpYWxpemVkO1xuTElTUy5pbml0aWFsaXplICAgICAgID0gaW5pdGlhbGl6ZTtcbkxJU1MuaW5pdGlhbGl6ZVN5bmMgICA9IGluaXRpYWxpemVTeW5jO1xuTElTUy5nZXRDb250cm9sZXIgICAgID0gZ2V0Q29udHJvbGVyO1xuTElTUy5nZXRDb250cm9sZXJTeW5jID0gZ2V0Q29udHJvbGVyU3luYzsiLCJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPik6IFJldHVyblR5cGU8dHlwZW9mIF9leHRlbmRzPEV4dGVuZHNDc3RyLCBPcHRzPj5cbi8vIExJU1NDb250cm9sZXIgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPlxuZXhwb3J0IGZ1bmN0aW9uIExJU1Mob3B0czogYW55ID0ge30pOiBMSVNTQ29udHJvbGVyQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NDb250cm9sZXJDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRlbmRzPFxuICAgICAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgICAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pIHtcblxuICAgIGlmKCBvcHRzLmV4dGVuZHMgPT09IHVuZGVmaW5lZCkgLy8gaDRja1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGEgTElTU0NvbnRyb2xlciEnKTtcblxuICAgIGNvbnN0IGNmZyA9IG9wdHMuZXh0ZW5kcy5Ib3N0LkNmZztcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgY2ZnLCBjZmcuYXJncywgb3B0cyk7XG5cbiAgICBjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBvcHRzLmV4dGVuZHMhIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgb3ZlcnJpZGUgX0hvc3Q6IExJU1NIb3N0PEV4dGVuZGVkTElTUz47XG5cbiAgICAgICAgLy8gVFMgaXMgc3R1cGlkLCByZXF1aXJlcyBleHBsaWNpdCByZXR1cm4gdHlwZVxuXHRcdHN0YXRpYyBvdmVycmlkZSBnZXQgSG9zdCgpOiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+IHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBmdWNrIG9mZlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuaG9zdCEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250ZW50X2dlbmVyYXRvciEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59IiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIExIb3N0LCBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4uL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCB7IGRlZmluZSB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuXG5leHBvcnQgY29uc3QgS25vd25UYWdzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbmxldCBzY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pignc2NyaXB0W2F1dG9kaXJdJyk7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0NESVIgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpID8/IG51bGw7XG5cbmlmKHNjcmlwdCAhPT0gbnVsbClcblx0YXV0b2xvYWQoc2NyaXB0KVxuXG5cbmZ1bmN0aW9uIGF1dG9sb2FkKHNjcmlwdDogSFRNTEVsZW1lbnQpIHtcblxuXHRsZXQgY2RpcjogbnVsbHxzdHJpbmcgPSBERUZBVUxUX0NESVI7XG5cblx0Y29uc3QgU1c6IFByb21pc2U8dm9pZD4gPSBuZXcgUHJvbWlzZSggYXN5bmMgKHJlc29sdmUpID0+IHtcblxuXHRcdGNvbnN0IHN3X3BhdGggPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdzdycpO1xuXG5cdFx0aWYoIHN3X3BhdGggPT09IG51bGwgKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJZb3UgYXJlIHVzaW5nIExJU1MgQXV0byBtb2RlIHdpdGhvdXQgc3cuanMuXCIpO1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc3dfcGF0aCwge3Njb3BlOiBcIi9cIn0pO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiUmVnaXN0cmF0aW9uIG9mIFNlcnZpY2VXb3JrZXIgZmFpbGVkXCIpO1xuXHRcdFx0Y29uc29sZS5lcnJvcihlKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9XG5cblx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRjZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpITtcblxuXHRpZiggY2RpcltjZGlyLmxlbmd0aC0xXSAhPT0gJy8nKVxuXHRcdGNkaXIgKz0gJy8nO1xuXG5cdGNvbnN0IGJyeXRob24gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwiYnJ5dGhvblwiKTtcblxuXHQvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcblx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0aWYoYWRkaXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcblx0XHRcdFx0XHRhZGRUYWcoYWRkaXRpb24pXG5cblx0fSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuXHRmb3IoIGxldCBlbGVtIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiKlwiKSApXG5cdFx0YWRkVGFnKCBlbGVtICk7XG5cblx0YXN5bmMgZnVuY3Rpb24gYWRkVGFnKHRhZzogSFRNTEVsZW1lbnQpIHtcblxuXHRcdGF3YWl0IFNXOyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG5cdFx0Y29uc3QgdGFnbmFtZSA9ICggdGFnLmdldEF0dHJpYnV0ZSgnaXMnKSA/PyB0YWcudGFnTmFtZSApLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRsZXQgaG9zdCA9IEhUTUxFbGVtZW50O1xuXHRcdGlmKCB0YWcuaGFzQXR0cmlidXRlKCdpcycpIClcblx0XHRcdGhvc3QgPSB0YWcuY29uc3RydWN0b3IgYXMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG5cblx0XHRpZiggISB0YWduYW1lLmluY2x1ZGVzKCctJykgfHwgS25vd25UYWdzLmhhcyggdGFnbmFtZSApIClcblx0XHRcdHJldHVybjtcblxuXHRcdGltcG9ydENvbXBvbmVudCh0YWduYW1lLCB7XG5cdFx0XHRicnl0aG9uLFxuXHRcdFx0Y2Rpcixcblx0XHRcdGhvc3Rcblx0XHR9KTtcdFx0XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZywgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9wdHM6IHtodG1sOiBzdHJpbmcsIGNzczogc3RyaW5nLCBob3N0OiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD59KSB7XG5cblx0Y29uc3QgY19qcyAgICAgID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0b3B0cy5odG1sICAgICA/Pz0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXG5cdGxldCBrbGFzczogbnVsbHwgUmV0dXJuVHlwZTx0eXBlb2YgTElTUz4gPSBudWxsO1xuXHRpZiggY19qcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0Y29uc3QgZmlsZSA9IG5ldyBCbG9iKFtjX2pzXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG5cdFx0Y29uc3QgdXJsICA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG5cblx0XHRjb25zdCBvbGRyZXEgPSBMSVNTLnJlcXVpcmU7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBmdW5jdGlvbih1cmw6IFVSTHxzdHJpbmcpIHtcblxuXHRcdFx0aWYoIHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgJiYgdXJsLnN0YXJ0c1dpdGgoJy4vJykgKSB7XG5cdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gdXJsLnNsaWNlKDIpO1xuXHRcdFx0XHRpZiggZmlsZW5hbWUgaW4gZmlsZXMpXG5cdFx0XHRcdFx0cmV0dXJuIGZpbGVzW2ZpbGVuYW1lXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9sZHJlcSh1cmwpO1xuXHRcdH1cblxuXHRcdGtsYXNzID0gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVybCkpLmRlZmF1bHQ7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBvbGRyZXE7XG5cdH1cblx0ZWxzZSBpZiggb3B0cy5odG1sICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRrbGFzcyA9IExJU1Moe1xuXHRcdFx0Li4ub3B0cyxcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yXG5cdFx0fSk7XG5cdH1cblxuXHRpZigga2xhc3MgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0ZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuXHRyZXR1cm4ga2xhc3M7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgaW50ZXJuYWwgdG9vbHMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9mZXRjaFRleHQodXJpOiBzdHJpbmd8VVJMLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHRjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuXHRcdFx0XHRcdFx0PyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuXHRcdFx0XHRcdFx0OiB7fTtcblxuXG5cdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcblx0aWYocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0aWYoIGlzTGlzc0F1dG8gJiYgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJzdGF0dXNcIikhID09PSBcIjQwNFwiIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGNvbnN0IGFuc3dlciA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcblxuXHRpZihhbnN3ZXIgPT09IFwiXCIpXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gYW5zd2VyXG59XG5hc3luYyBmdW5jdGlvbiBfaW1wb3J0KHVyaTogc3RyaW5nLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHQvLyB0ZXN0IGZvciB0aGUgbW9kdWxlIGV4aXN0YW5jZS5cblx0aWYoaXNMaXNzQXV0byAmJiBhd2FpdCBfZmV0Y2hUZXh0KHVyaSwgaXNMaXNzQXV0bykgPT09IHVuZGVmaW5lZCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHR0cnkge1xuXHRcdHJldHVybiAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJpKSkuZGVmYXVsdDtcblx0fSBjYXRjaChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxufVxuXG5cbmNvbnN0IGNvbnZlcnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZUhUTUwodGV4dDogc3RyaW5nKSB7XG5cdGNvbnZlcnRlci50ZXh0Q29udGVudCA9IHRleHQ7XG5cdHJldHVybiBjb252ZXJ0ZXIuaW5uZXJIVE1MO1xufVxuXG5leHBvcnQgY2xhc3MgTElTU0F1dG9fQ29udGVudEdlbmVyYXRvciBleHRlbmRzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG5cdHByb3RlY3RlZCBvdmVycmlkZSBwcmVwYXJlSFRNTChodG1sPzogRG9jdW1lbnRGcmFnbWVudCB8IEhUTUxFbGVtZW50IHwgc3RyaW5nKSB7XG5cdFx0XG5cdFx0dGhpcy5kYXRhID0gbnVsbDtcblxuXHRcdGlmKCB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycgKSB7XG5cblx0XHRcdHRoaXMuZGF0YSA9IGh0bWw7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdC8qXG5cdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHJldHVybiBgPGxpc3MgdmFsdWU9XCIke25hbWV9XCI+PC9saXNzPmA7XG5cdFx0XHR9KTsqL1xuXG5cdFx0XHQvL1RPRE86ICR7fSBpbiBhdHRyXG5cdFx0XHRcdC8vIC0gZGV0ZWN0IHN0YXJ0ICR7ICsgZW5kIH1cblx0XHRcdFx0Ly8gLSByZWdpc3RlciBlbGVtICsgYXR0ciBuYW1lXG5cdFx0XHRcdC8vIC0gcmVwbGFjZS4gXG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBzdXBlci5wcmVwYXJlSFRNTChodG1sKTtcblx0fVxuXG5cdG92ZXJyaWRlIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKHNoYWRvdy5ob3N0LmdldEF0dHJpYnV0ZShtYXRjaCkgPz8gJycgKSk7XG5cdFx0XHRzdXBlci5zZXRUZW1wbGF0ZSggc3VwZXIucHJlcGFyZUhUTUwoc3RyKSEgKTtcblx0XHR9XG5cblx0XHRzdXBlci5maWxsQ29udGVudChzaGFkb3cpO1xuXG5cdFx0Lypcblx0XHQvLyBodG1sIG1hZ2ljIHZhbHVlcyBjb3VsZCBiZSBvcHRpbWl6ZWQuLi5cblx0XHRjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cdFx0Zm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG5cdFx0XHR2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cdFx0Ki9cblxuXHR9XG5cblx0b3ZlcnJpZGUgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnQgfCBTaGFkb3dSb290IHtcblx0XHRcblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0aWYoIHRoaXMuZGF0YSAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3Qgc3RyID0gKHRoaXMuZGF0YSBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gZW5jb2RlSFRNTChob3N0LmdldEF0dHJpYnV0ZShtYXRjaCkgPz8gJycgKSk7XG5cdFx0XHRzdXBlci5zZXRUZW1wbGF0ZSggc3VwZXIucHJlcGFyZUhUTUwoc3RyKSEgKTtcblx0XHR9XG5cblx0XHRjb25zdCBjb250ZW50ID0gc3VwZXIuZ2VuZXJhdGUoaG9zdCk7XG5cblx0XHQvKlxuXHRcdC8vIGh0bWwgbWFnaWMgdmFsdWVzLlxuXHRcdC8vIGNhbiBiZSBvcHRpbWl6ZWQuLi5cblx0XHRjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cdFx0Zm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG5cdFx0XHR2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cdFx0Ki9cblxuXHRcdC8vIGNzcyBwcm9wLlxuXHRcdGNvbnN0IGNzc19hdHRycyA9IGhvc3QuZ2V0QXR0cmlidXRlTmFtZXMoKS5maWx0ZXIoIGUgPT4gZS5zdGFydHNXaXRoKCdjc3MtJykpO1xuXHRcdGZvcihsZXQgY3NzX2F0dHIgb2YgY3NzX2F0dHJzKVxuXHRcdFx0aG9zdC5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke2Nzc19hdHRyLnNsaWNlKCdjc3MtJy5sZW5ndGgpfWAsIGhvc3QuZ2V0QXR0cmlidXRlKGNzc19hdHRyKSk7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50cyA6IHR5cGVvZiBpbXBvcnRDb21wb25lbnRzO1xuICAgICAgICBpbXBvcnRDb21wb25lbnQgIDogdHlwZW9mIGltcG9ydENvbXBvbmVudDtcbiAgICAgICAgcmVxdWlyZSAgICAgICAgICA6IHR5cGVvZiByZXF1aXJlO1xuICAgIH1cbn1cblxudHlwZSBpbXBvcnRDb21wb25lbnRzX09wdHM8VCBleHRlbmRzIEhUTUxFbGVtZW50PiA9IHtcblx0Y2RpciAgID86IHN0cmluZ3xudWxsLFxuXHRicnl0aG9uPzogc3RyaW5nfG51bGwsXG5cdGhvc3QgICA/OiBDb25zdHJ1Y3RvcjxUPlxufTtcblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdFx0XHRcdFx0XHRjb21wb25lbnRzOiBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y2RpciAgICA9IERFRkFVTFRfQ0RJUixcblx0XHRcdFx0XHRcdFx0YnJ5dGhvbiA9IG51bGwsXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0aG9zdCAgICA9IEhUTUxFbGVtZW50XG5cdFx0XHRcdFx0XHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4pIHtcblxuXHRjb25zdCByZXN1bHRzOiBSZWNvcmQ8c3RyaW5nLCBMSVNTQ29udHJvbGVyQ3N0cj4gPSB7fTtcblxuXHRmb3IobGV0IHRhZ25hbWUgb2YgY29tcG9uZW50cykge1xuXG5cdFx0cmVzdWx0c1t0YWduYW1lXSA9IGF3YWl0IGltcG9ydENvbXBvbmVudCh0YWduYW1lLCB7XG5cdFx0XHRjZGlyLFxuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGhvc3Rcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiByZXN1bHRzO1xufVxuXG5jb25zdCBicnlfd3JhcHBlciA9IGBmcm9tIGJyb3dzZXIgaW1wb3J0IHNlbGZcblxuZGVmIHdyYXBqcyhqc19rbGFzcyk6XG5cblx0Y2xhc3MgV3JhcHBlcjpcblxuXHRcdF9qc19rbGFzcyA9IGpzX2tsYXNzXG5cdFx0X2pzID0gTm9uZVxuXG5cdFx0ZGVmIF9faW5pdF9fKHRoaXMsICphcmdzKTpcblx0XHRcdHRoaXMuX2pzID0ganNfa2xhc3MubmV3KCphcmdzKVxuXG5cdFx0ZGVmIF9fZ2V0YXR0cl9fKHRoaXMsIG5hbWU6IHN0cik6XG5cdFx0XHRyZXR1cm4gdGhpcy5fanNbbmFtZV07XG5cblx0XHRkZWYgX19zZXRhdHRyX18odGhpcywgbmFtZTogc3RyLCB2YWx1ZSk6XG5cdFx0XHRpZiBuYW1lID09IFwiX2pzXCI6XG5cdFx0XHRcdHN1cGVyKCkuX19zZXRhdHRyX18obmFtZSwgdmFsdWUpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0dGhpcy5fanNbbmFtZV0gPSB2YWx1ZVxuXHRcblx0cmV0dXJuIFdyYXBwZXJcblxuc2VsZi53cmFwanMgPSB3cmFwanNcbmA7XG5cblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50PFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0dGFnbmFtZTogc3RyaW5nLFxuXHR7XG5cdFx0Y2RpciAgICA9IERFRkFVTFRfQ0RJUixcblx0XHRicnl0aG9uID0gbnVsbCxcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0aG9zdCAgICA9IEhUTUxFbGVtZW50LFxuXHRcdGZpbGVzICAgPSBudWxsXG5cdH06IGltcG9ydENvbXBvbmVudHNfT3B0czxUPiAmIHtmaWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz58bnVsbH0gPSB7fVxuKSB7XG5cblx0S25vd25UYWdzLmFkZCh0YWduYW1lKTtcblxuXHRjb25zdCBjb21wb19kaXIgPSBgJHtjZGlyfSR7dGFnbmFtZX0vYDtcblxuXHRpZiggZmlsZXMgPT09IG51bGwgKSB7XG5cdFx0ZmlsZXMgPSB7fTtcblxuXHRcdGNvbnN0IGZpbGUgPSBicnl0aG9uID09PSBcInRydWVcIiA/ICdpbmRleC5icnknIDogJ2luZGV4LmpzJztcblxuXHRcdGZpbGVzW2ZpbGVdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfSR7ZmlsZX1gLCB0cnVlKSkhO1xuXG5cdFx0Ly9UT0RPISEhXG5cdFx0dHJ5IHtcblx0XHRcdGZpbGVzW1wiaW5kZXguaHRtbFwiXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5odG1sYCwgdHJ1ZSkpITtcblx0XHR9IGNhdGNoKGUpIHtcblxuXHRcdH1cblx0XHR0cnkge1xuXHRcdFx0ZmlsZXNbXCJpbmRleC5jc3NcIiBdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4LmNzc2AgLCB0cnVlKSkhO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XG5cdFx0fVxuXHR9XG5cblx0aWYoIGJyeXRob24gPT09IFwidHJ1ZVwiICYmIGZpbGVzWydpbmRleC5icnknXSAhPT0gdW5kZWZpbmVkKSB7XG5cblx0XHRjb25zdCBjb2RlID0gZmlsZXNbXCJpbmRleC5icnlcIl07XG5cblx0XHRmaWxlc1snaW5kZXguanMnXSA9XG5gY29uc3QgJEIgPSBnbG9iYWxUaGlzLl9fQlJZVEhPTl9fO1xuXG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHticnlfd3JhcHBlcn1cXGAsIFwiX1wiKTtcbiRCLnJ1blB5dGhvblNvdXJjZShcXGAke2NvZGV9XFxgLCBcIl9cIik7XG5cbmNvbnN0IG1vZHVsZSA9ICRCLmltcG9ydGVkW1wiX1wiXTtcbmV4cG9ydCBkZWZhdWx0IG1vZHVsZS5XZWJDb21wb25lbnQ7XG5cbmA7XG5cdH1cblxuXHRjb25zdCBodG1sID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXHRjb25zdCBjc3MgID0gZmlsZXNbXCJpbmRleC5jc3NcIl07XG5cblx0cmV0dXJuIGF3YWl0IGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcywge2h0bWwsIGNzcywgaG9zdH0pO1xufVxuXG5mdW5jdGlvbiByZXF1aXJlKHVybDogVVJMfHN0cmluZyk6IFByb21pc2U8UmVzcG9uc2U+fHN0cmluZyB7XG5cdHJldHVybiBmZXRjaCh1cmwpO1xufVxuXG5cbkxJU1MuaW1wb3J0Q29tcG9uZW50cyA9IGltcG9ydENvbXBvbmVudHM7XG5MSVNTLmltcG9ydENvbXBvbmVudCAgPSBpbXBvcnRDb21wb25lbnQ7XG5MSVNTLnJlcXVpcmUgID0gcmVxdWlyZTsiLCJpbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcbmltcG9ydCB0eXBlIHsgTElTU0NvbnRyb2xlciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufSIsIlxuaW1wb3J0IHsgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxudHlwZSBMaXN0ZW5lckZjdDxUIGV4dGVuZHMgRXZlbnQ+ID0gKGV2OiBUKSA9PiB2b2lkO1xudHlwZSBMaXN0ZW5lck9iajxUIGV4dGVuZHMgRXZlbnQ+ID0geyBoYW5kbGVFdmVudDogTGlzdGVuZXJGY3Q8VD4gfTtcbnR5cGUgTGlzdGVuZXI8VCBleHRlbmRzIEV2ZW50PiA9IExpc3RlbmVyRmN0PFQ+fExpc3RlbmVyT2JqPFQ+O1xuXG5leHBvcnQgY2xhc3MgRXZlbnRUYXJnZXQyPEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEV2ZW50Pj4gZXh0ZW5kcyBFdmVudFRhcmdldCB7XG5cblx0b3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGNhbGxiYWNrOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBvcHRpb25zPzogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuKTogdm9pZCB7XG5cdFx0XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0cmV0dXJuIHN1cGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZGlzcGF0Y2hFdmVudDxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+PihldmVudDogRXZlbnRzW1RdKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHN1cGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG5cblx0b3ZlcnJpZGUgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsaXN0ZW5lcjogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG9wdGlvbnM/OiBib29sZWFufEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZCB7XG5cblx0XHQvL0B0cy1pZ25vcmVcblx0XHRzdXBlci5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXZlbnQyPFQgZXh0ZW5kcyBzdHJpbmcsIEFyZ3M+IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8QXJncz4ge1xuXG5cdGNvbnN0cnVjdG9yKHR5cGU6IFQsIGFyZ3M6IEFyZ3MpIHtcblx0XHRzdXBlcih0eXBlLCB7ZGV0YWlsOiBhcmdzfSk7XG5cdH1cblxuXHRvdmVycmlkZSBnZXQgdHlwZSgpOiBUIHsgcmV0dXJuIHN1cGVyLnR5cGUgYXMgVDsgfVxufVxuXG50eXBlIEluc3RhbmNlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+Pj4gPSB7XG5cdFtLIGluIGtleW9mIFRdOiBJbnN0YW5jZVR5cGU8VFtLXT5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdpdGhFdmVudHM8VCBleHRlbmRzIG9iamVjdCwgRXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+PiA+KGV2OiBDb25zdHJ1Y3RvcjxUPiwgX2V2ZW50czogRXZlbnRzKSB7XG5cblx0dHlwZSBFdnRzID0gSW5zdGFuY2VzPEV2ZW50cz47XG5cblx0aWYoICEgKGV2IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQpIClcblx0XHRyZXR1cm4gZXYgYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xuXG5cdC8vIGlzIGFsc28gYSBtaXhpblxuXHQvLyBAdHMtaWdub3JlXG5cdGNsYXNzIEV2ZW50VGFyZ2V0TWl4aW5zIGV4dGVuZHMgZXYge1xuXG5cdFx0I2V2ID0gbmV3IEV2ZW50VGFyZ2V0MjxFdnRzPigpO1xuXG5cdFx0YWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hFdmVudCguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuZGlzcGF0Y2hFdmVudCguLi5hcmdzKTtcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiBFdmVudFRhcmdldE1peGlucyBhcyB1bmtub3duIGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+Pjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBTaGFkb3dSb290IHRvb2xzID09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBldmVudE1hdGNoZXMoZXY6IEV2ZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cblx0bGV0IGVsZW1lbnRzID0gZXYuY29tcG9zZWRQYXRoKCkuc2xpY2UoMCwtMikuZmlsdGVyKGUgPT4gISAoZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpICkucmV2ZXJzZSgpIGFzIEhUTUxFbGVtZW50W107XG5cblx0Zm9yKGxldCBlbGVtIG9mIGVsZW1lbnRzIClcblx0XHRpZihlbGVtLm1hdGNoZXMoc2VsZWN0b3IpIClcblx0XHRcdHJldHVybiBlbGVtOyBcblxuXHRyZXR1cm4gbnVsbDtcbn0iLCJcbmltcG9ydCB0eXBlIHsgTElTU0NvbnRyb2xlciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudHMge307XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplU3luYywgd2hlbkluaXRpYWxpemVkIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9JTklUSUFMSVpFRFwiO1xuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIC8vIGFzeW5jXG4gICAgICAgIHFzIDogdHlwZW9mIHFzO1xuICAgICAgICBxc286IHR5cGVvZiBxc287XG4gICAgICAgIHFzYTogdHlwZW9mIHFzYTtcbiAgICAgICAgcXNjOiB0eXBlb2YgcXNjO1xuXG4gICAgICAgIC8vIHN5bmNcbiAgICAgICAgcXNTeW5jIDogdHlwZW9mIHFzU3luYztcbiAgICAgICAgcXNhU3luYzogdHlwZW9mIHFzYVN5bmM7XG4gICAgICAgIHFzY1N5bmM6IHR5cGVvZiBxc2NTeW5jO1xuXG5cdFx0Y2xvc2VzdDogdHlwZW9mIGNsb3Nlc3Q7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsaXNzX3NlbGVjdG9yKG5hbWU/OiBzdHJpbmcpIHtcblx0aWYobmFtZSA9PT0gdW5kZWZpbmVkKSAvLyBqdXN0IGFuIGg0Y2tcblx0XHRyZXR1cm4gXCJcIjtcblx0cmV0dXJuIGA6aXMoJHtuYW1lfSwgW2lzPVwiJHtuYW1lfVwiXSlgO1xufVxuXG5mdW5jdGlvbiBfYnVpbGRRUyhzZWxlY3Rvcjogc3RyaW5nLCB0YWduYW1lX29yX3BhcmVudD86IHN0cmluZyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCwgcGFyZW50OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXHRcblx0aWYoIHRhZ25hbWVfb3JfcGFyZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRhZ25hbWVfb3JfcGFyZW50ICE9PSAnc3RyaW5nJykge1xuXHRcdHBhcmVudCA9IHRhZ25hbWVfb3JfcGFyZW50O1xuXHRcdHRhZ25hbWVfb3JfcGFyZW50ID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cmV0dXJuIFtgJHtzZWxlY3Rvcn0ke2xpc3Nfc2VsZWN0b3IodGFnbmFtZV9vcl9wYXJlbnQgYXMgc3RyaW5nfHVuZGVmaW5lZCl9YCwgcGFyZW50XSBhcyBjb25zdDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxczxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRsZXQgcmVzdWx0ID0gYXdhaXQgcXNvPFQ+KHNlbGVjdG9yLCBwYXJlbnQpO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiByZXN1bHQhXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUW10+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dW10gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxUPj4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cHJvbWlzZXNbaWR4KytdID0gd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVDtcbmZ1bmN0aW9uIHFzU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG59XG5cbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFRbXTtcbmZ1bmN0aW9uIHFzYVN5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl1bXTtcbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTxUPiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRyZXN1bHRbaWR4KytdID0gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogVDtcbmZ1bmN0aW9uIHFzY1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4ocmVzdWx0KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNsb3Nlc3Q8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcblxuXHR3aGlsZSh0cnVlKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGVsZW1lbnQuY2xvc2VzdDxFPihzZWxlY3Rvcik7XG5cblx0XHRpZiggcmVzdWx0ICE9PSBudWxsKVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblxuXHRcdGNvbnN0IHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG5cdFx0aWYoICEgKFwiaG9zdFwiIGluIHJvb3QpIClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0ZWxlbWVudCA9IChyb290IGFzIFNoYWRvd1Jvb3QpLmhvc3Q7XG5cdH1cbn1cblxuXG4vLyBhc3luY1xuTElTUy5xcyAgPSBxcztcbkxJU1MucXNvID0gcXNvO1xuTElTUy5xc2EgPSBxc2E7XG5MSVNTLnFzYyA9IHFzYztcblxuLy8gc3luY1xuTElTUy5xc1N5bmMgID0gcXNTeW5jO1xuTElTUy5xc2FTeW5jID0gcXNhU3luYztcbkxJU1MucXNjU3luYyA9IHFzY1N5bmM7XG5cbkxJU1MuY2xvc2VzdCA9IGNsb3Nlc3Q7IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgXCIuL2NvcmUvTGlmZUN5Y2xlXCI7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vVE9ETzogZXZlbnRzLnRzXG4vL1RPRE86IGdsb2JhbENTU1J1bGVzXG5leHBvcnQge0xJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL2hlbHBlcnMvTElTU0F1dG9cIjtcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge1NoYWRvd0NmZ30gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHtsaXNzLCBsaXNzU3luY30gZnJvbSBcIi4vaGVscGVycy9idWlsZFwiO1xuZXhwb3J0IHtldmVudE1hdGNoZXMsIFdpdGhFdmVudHMsIEV2ZW50VGFyZ2V0MiwgQ3VzdG9tRXZlbnQyfSBmcm9tICcuL2hlbHBlcnMvZXZlbnRzJztcbmV4cG9ydCB7aHRtbH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7XG5cbi8vIGZvciBkZWJ1Zy5cbmV4cG9ydCB7X2V4dGVuZHN9IGZyb20gXCIuL2V4dGVuZHNcIjsiLCJpbXBvcnQgdHlwZSB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IHtcbiAgICAgICAgZXh0ZW5kczogRXh0ZW5kc0N0ciwgLy8gSlMgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0ciwgICAvLyBIVE1MIEhvc3RcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxufSAmIENvbnRlbnRHZW5lcmF0b3JfT3B0cztcblxuLy9UT0RPOiByZXdyaXRlLi4uXG4vLyBMSVNTQ29udHJvbGVyXG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXJDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBJbnN0YW5jZVR5cGU8TElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyMkxJU1NDb250cm9sZXJDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPFxuICAgICAgICAgICAgaW5mZXIgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0cixIb3N0Q3N0cj4gOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyID0gTElTU0NvbnRyb2xlcj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyID8gTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47XG5cbi8vIGxpZ2h0ZXIgTElTU0hvc3QgZGVmIHRvIGF2b2lkIHR5cGUgaXNzdWVzLi4uXG5leHBvcnQgdHlwZSBMSG9zdDxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG5cbiAgICBjb250ZW50OiBTaGFkb3dSb290fEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICBzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIENTU1NlbGVjdG9yOiBzdHJpbmc7XG5cbn0gJiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5leHBvcnQgdHlwZSBMSG9zdENzdHI8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuICAgIG5ldyguLi5hcmdzOiBhbnkpOiBMSG9zdDxIb3N0Q3N0cj47XG5cbiAgICBDZmc6IHtcbiAgICAgICAgaG9zdCAgICAgICAgICAgICA6IEhvc3RDc3RyLFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG4gICAgICAgIGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcbiAgICB9XG5cbn0gJiBIb3N0Q3N0cjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cbiAgICBpZiggQ2xhc3MgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgQ2xhc3MgPSBDbGFzcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgSFRNTEVsZW1lbnQ7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cbiAgICBsZXQgY3Vyc29yID0gQ2xhc3M7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdoaWxlIChjdXJzb3IuX19wcm90b19fICE9PSBIVE1MRWxlbWVudClcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjdXJzb3IgPSBjdXJzb3IuX19wcm90b19fO1xuXG4gICAgLy8gZGlyZWN0bHkgaW5oZXJpdCBIVE1MRWxlbWVudFxuICAgIGlmKCAhIGN1cnNvci5uYW1lLnN0YXJ0c1dpdGgoJ0hUTUwnKSAmJiAhIGN1cnNvci5uYW1lLmVuZHNXaXRoKCdFbGVtZW50JykgKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGh0bWx0YWcgPSBjdXJzb3IubmFtZS5zbGljZSg0LCAtNyk7XG5cblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IEhUTUxFbGVtZW50IHwgdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuLypcbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlclxuKi9cblxuLy8gbW92ZWQgaGVyZSBpbnN0ZWFkIG9mIGJ1aWxkIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwcy5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59IiwiaW1wb3J0IHRlbXBsYXRlLCB7IEhUTUwgfSBmcm9tIFwiVjMvdXRpbHMvcGFyc2Vycy90ZW1wbGF0ZVwiO1xuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IGVuY29kZUhUTUwgZnJvbSBcIlYzL3V0aWxzL2VuY29kZVwiO1xuXG5jb25zdCByZWdleCA9IC9cXCRcXHsoLis/KVxcfS9nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvQ29udGVudEdlbmVyYXRvciBleHRlbmRzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIHByZXBhcmVUZW1wbGF0ZShodG1sOiBIVE1MKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xuXG4gICAgICAgIGlmKCB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBodG1sO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2VBbGwoL1xcJFxceyhbXFx3XSspXFx9L2csIChfLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxsaXNzIHZhbHVlPVwiJHtuYW1lfVwiPjwvbGlzcz5gO1xuICAgICAgICAgICAgfSk7Ki9cblxuICAgICAgICAgICAgLy9UT0RPOiAke30gaW4gYXR0clxuICAgICAgICAgICAgICAgIC8vIC0gZGV0ZWN0IHN0YXJ0ICR7ICsgZW5kIH1cbiAgICAgICAgICAgICAgICAvLyAtIHJlZ2lzdGVyIGVsZW0gKyBhdHRyIG5hbWVcbiAgICAgICAgICAgICAgICAvLyAtIHJlcGxhY2UuIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzdXBlci5wcmVwYXJlVGVtcGxhdGUoaHRtbCk7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgZmlsbENvbnRlbnQoc2hhZG93OiBTaGFkb3dSb290KSB7XG4gICAgICAgIFxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG4gICAgICAgIGlmKCB0aGlzLmRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9ICh0aGlzLmRhdGEgYXMgc3RyaW5nKS5yZXBsYWNlKHJlZ2V4LCAoXywgbWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNoYWRvdy5ob3N0LmdldEF0dHJpYnV0ZShtYXRjaCk7XG4gICAgICAgICAgICAgICAgaWYoIHZhbHVlID09PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7IFxuICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGVIVE1MKHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdXBlci5wcmVwYXJlVGVtcGxhdGUoc3RyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyLmZpbGxDb250ZW50KHNoYWRvdyk7XG5cbiAgICAgICAgLypcbiAgICAgICAgLy8gaHRtbCBtYWdpYyB2YWx1ZXMgY291bGQgYmUgb3B0aW1pemVkLi4uXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcbiAgICAgICAgZm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG4gICAgICAgICAgICB2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG4gICAgICAgICovXG4gICAgfVxufSIsImltcG9ydCB7IGlzUmVzc291cmNlUmVhZHksIFJlc3NvdXJjZSwgd2FpdFJlc3NvdXJjZSB9IGZyb20gXCJWMy91dGlscy9uZXR3b3JrL3Jlc3NvdXJjZVwiO1xuaW1wb3J0IHsgU2hhZG93Q2ZnIH0gZnJvbSBcIlYyL3R5cGVzXCI7XG5pbXBvcnQgeyBpc0RPTUNvbnRlbnRMb2FkZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIlYyL3V0aWxzXCI7XG5pbXBvcnQgdGVtcGxhdGUsIHsgSFRNTCB9IGZyb20gXCJWMy91dGlscy9wYXJzZXJzL3RlbXBsYXRlXCI7XG5pbXBvcnQgc3R5bGUgICAsIHtDU1N9ICAgIGZyb20gXCJWMy91dGlscy9wYXJzZXJzL3N0eWxlXCI7XG5cbnR5cGUgU1RZTEUgPSBDU1MgfCByZWFkb25seSBDU1NbXTtcblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge1xuICAgIGh0bWwgICA/OiBSZXNzb3VyY2U8SFRNTD4sXG4gICAgY3NzICAgID86IFJlc3NvdXJjZTxTVFlMRT4sXG4gICAgc2hhZG93ID86IFNoYWRvd0NmZ3xudWxsXG59XG5cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4vL2NvbnN0IHNoYXJlZENTUyA9IGdldFNoYXJlZENTUygpOyAvLyBmcm9tIExJU1NIb3N0Li4uXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgcHJvdGVjdGVkIGRhdGE6IGFueTtcblxuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGh0bWwsXG4gICAgICAgIGNzcyAgICA9IFtdLFxuICAgICAgICBzaGFkb3cgPSBudWxsLFxuICAgIH06IENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4jc2hhZG93ICAgPSBzaGFkb3c7XG5cbiAgICAgICAgY29uc3QgaXNSZWFkeSA9IGlzUmVzc291cmNlUmVhZHk8SFRNTD4gKGh0bWwpXG4gICAgICAgICAgICAgICAgICAgICAmJiBpc1Jlc3NvdXJjZVJlYWR5PFNUWUxFPihjc3MpXG4gICAgICAgICAgICAgICAgICAgICAmJiBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcblxuICAgICAgICBpZiggaXNSZWFkeSApXG4gICAgICAgICAgICB0aGlzLnByZXBhcmUoaHRtbCwgY3NzKTtcblxuICAgICAgICBjb25zdCB3aGVuUmVhZHk6IFByb21pc2U8W0hUTUx8dW5kZWZpbmVkLCBTVFlMRXx1bmRlZmluZWQsIHVua25vd25dPiA9IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHdhaXRSZXNzb3VyY2U8SFRNTCB8dW5kZWZpbmVkPihodG1sKSxcbiAgICAgICAgICAgIHdhaXRSZXNzb3VyY2U8U1RZTEV8dW5kZWZpbmVkPihjc3MpLFxuICAgICAgICAgICAgd2hlbkRPTUNvbnRlbnRMb2FkZWQoKVxuICAgICAgICBdKTtcblxuICAgICAgICB3aGVuUmVhZHkudGhlbiggKGFyZ3MpID0+IHRoaXMucHJlcGFyZShhcmdzWzBdLCBhcmdzWzFdKSApO1xuXG4gICAgICAgIHRoaXMuaXNSZWFkeSAgID0gaXNSZWFkeTtcbiAgICAgICAgdGhpcy53aGVuUmVhZHkgPSB3aGVuUmVhZHk7XG4gICAgfVxuXG4gICAgLyoqIHJlYWR5ICoqKi9cblxuICAgIHJlYWRvbmx5IHdoZW5SZWFkeTogUHJvbWlzZTx1bmtub3duPjtcbiAgICByZWFkb25seSBpc1JlYWR5ICA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBwcm9jZXNzIHJlc3NvdXJjZXMgKiovXG5cbiAgICBwcm90ZWN0ZWQgc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXSAgICAgICA9IFtdO1xuICAgIHByb3RlY3RlZCB0ZW1wbGF0ZSAgIDogRG9jdW1lbnRGcmFnbWVudHxudWxsID0gbnVsbDtcblxuICAgIHByb3RlY3RlZCBwcmVwYXJlKGh0bWw6IEhUTUx8dW5kZWZpbmVkLCBjc3M6IFNUWUxFfHVuZGVmaW5lZCkge1xuICAgICAgICBpZiggaHRtbCAhPT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZVRlbXBsYXRlKGh0bWwpO1xuICAgICAgICBpZiggY3NzICAhPT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZVN0eWxlICAgKGNzcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVUZW1wbGF0ZShodG1sOiBIVE1MKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZShodG1sKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHByZXBhcmVTdHlsZShjc3M6IFNUWUxFKSB7XG5cbiAgICAgICAgaWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcbiAgICAgICAgICAgIGNzcyA9IFtjc3NdO1xuXG4gICAgICAgIHRoaXMuc3R5bGVzaGVldHMgPSBjc3MubWFwKGUgPT4gc3R5bGUoZSkgKTtcbiAgICB9XG5cbiAgICAvKioqIEdlbmVyYXRlIGNvbnRlbnRzICoqKi9cblxuICAgIGluaXRDb250ZW50KHRhcmdldDogSFRNTEVsZW1lbnQsIG1vZGU6XCJvcGVuXCJ8XCJjbG9zZWRcInxudWxsKSB7XG5cbiAgICAgICAgbGV0IGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SFRNTEVsZW1lbnQgPSB0YXJnZXQ7XG4gICAgICAgIGlmKCBtb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gdGFyZ2V0LmF0dGFjaFNoYWRvdyh7bW9kZX0pO1xuICAgICAgICAgICAgY29udGVudC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MsIC4uLnRoaXMuc3R5bGVzaGVldHMpO1xuICAgICAgICB9XG4gICAgICAgIC8vVE9ETzogQ1NTIGZvciBubyBzaGFkb3cgPz8/XG4gICAgICAgIFxuICAgICAgICB0aGlzLmZpbGxDb250ZW50KGNvbnRlbnQpO1xuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGZpbGxDb250ZW50KHRhcmdldDogU2hhZG93Um9vdHxIVE1MRWxlbWVudHxEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIFxuICAgICAgICBpZiggdGhpcy50ZW1wbGF0ZSAhPT0gbnVsbClcbiAgICAgICAgICAgIHRhcmdldC5yZXBsYWNlQ2hpbGRyZW4oIHRoaXMuY3JlYXRlQ29udGVudCgpICk7XG5cbiAgICAgICAgLy9UT0RPLi4uXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGFyZ2V0KTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb250ZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZSEuY2xvbmVOb2RlKHRydWUpO1xuICAgIH1cbn0iLCJpbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiVjMvQ29udGVudEdlbmVyYXRvcnMvQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IExJU1NGdWxsIGZyb20gXCIuL0xJU1MvTElTU0Z1bGxcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxWYWx1ZTxFIGV4dGVuZHMgSFRNTEVsZW1lbnQsIE4gZXh0ZW5kcyBrZXlvZiBFPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlOiBFLCBuYW1lOiBOKTogdW5kZWZpbmVkfEVbTl1cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsVmFsdWU8RSBleHRlbmRzIEhUTUxFbGVtZW50LCBOIGV4dGVuZHMga2V5b2YgRSwgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZTogRSwgbmFtZTogTiwgZGVmYXVsdFZhbHVlOiBEKSA6IER8RVtOXVxuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxWYWx1ZTxFIGV4dGVuZHMgSFRNTEVsZW1lbnQsIE4gZXh0ZW5kcyBrZXlvZiBFLCBEPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlOiBFLCBuYW1lOiBOLCBkZWZhdWx0VmFsdWU/OiBEKTogdW5kZWZpbmVkfER8RVtOXSB7XG5cbiAgICBpZiggISBPYmplY3QuaGFzT3duKGUsIG5hbWUpIClcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIGNvbnN0ICBfID0gZVtuYW1lXTtcbiAgICBkZWxldGUgICAgIGVbbmFtZV07XG4gICAgcmV0dXJuIF87XG59XG5cbnR5cGUgQ3N0cjxUPiA9IG5ldyguLi5hcmdzOmFueVtdKSA9PiBUXG50eXBlIExJU1N2M19PcHRzPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID4gPSB7XG4gICAgY29udGVudF9nZW5lcmF0b3I6IFQsXG59ICYgQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+WzBdO1xuXG4vLyAgYnVpbGRlclxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8VCBleHRlbmRzIENzdHI8Q29udGVudEdlbmVyYXRvcj4gPSBDc3RyPENvbnRlbnRHZW5lcmF0b3I+PihvcHRzOiBQYXJ0aWFsPExJU1N2M19PcHRzPFQ+PiA9IHt9KSB7XG4gICAgXG4gICAgY29uc3QgY29udGVudF9nZW5lcmF0b3IgPSBvcHRzLmNvbnRlbnRfZ2VuZXJhdG9yID8/IENvbnRlbnRHZW5lcmF0b3I7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGdlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcihvcHRzKTtcbiAgICBcbiAgICByZXR1cm4gY2xhc3MgX0xJU1MgZXh0ZW5kcyBMSVNTRnVsbCB7XG5cbiAgICAgICAgLy8gVE9ETzogbm8gY29udGVudCBpZi4uLiA/Pz9cbiAgICAgICAgLy8gb3ZlcnJpZGUgYXR0YWNoU2hhZG93ICA/Pz9cbiAgICAgICAgc3RhdGljIG92ZXJyaWRlIHJlYWRvbmx5IFNIQURPV19NT0RFICAgICAgID0gXCJvcGVuXCI7XG4gICAgICAgIHN0YXRpYyBvdmVycmlkZSByZWFkb25seSBDT05URU5UX0dFTkVSQVRPUiA9IGdlbmVyYXRvcjtcblxuICAgIH1cbn1cblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTOyIsImltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExJU1NCYXNlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG5cbiAgICAvKnByb3RlY3RlZCBnZXRJbml0aWFsVmFsdWU8TiBleHRlbmRzIGtleW9mIHRoaXM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWU6IE4pOiB1bmRlZmluZWR8dGhpc1tOXVxuICAgIHByb3RlY3RlZCBnZXRJbml0aWFsVmFsdWU8TiBleHRlbmRzIGtleW9mIHRoaXMsIEQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWU6IE4sIGRlZmF1bHRWYWx1ZTogRCkgOiBEfHRoaXNbTl1cbiAgICBwcm90ZWN0ZWQgZ2V0SW5pdGlhbFZhbHVlPE4gZXh0ZW5kcyBrZXlvZiB0aGlzLCBEPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lOiBOLCBkZWZhdWx0VmFsdWU/OiBEKTogdW5kZWZpbmVkfER8dGhpc1tOXSB7XG4gICAgICAgIHJldHVybiBnZXRJbml0aWFsVmFsdWUodGhpcywgbmFtZSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9Ki9cblxuICAgIHN0YXRpYyByZWFkb25seSBTSEFET1dfTU9ERSAgICAgIDogXCJvcGVuXCJ8XCJjbG9zZWRcInxudWxsID0gbnVsbDtcbiAgICAvLyBUT0RPOiBzdGF0aWMgY2FjaGUgZ2V0dGVyICsgdXNlIHN0YXRpYyBIVE1ML0NTUy5cbiAgICBzdGF0aWMgcmVhZG9ubHkgQ09OVEVOVF9HRU5FUkFUT1I6IENvbnRlbnRHZW5lcmF0b3J8bnVsbCA9IG51bGw7XG5cbiAgICByZWFkb25seSBjb250ZW50ICA6IFNoYWRvd1Jvb3R8SFRNTEVsZW1lbnQgICAgICAgID0gdGhpcztcbiAgICByZWFkb25seSBob3N0ICAgICA6IEhUTUxFbGVtZW50ICAgICAgICAgICAgICAgICAgID0gdGhpcztcbiAgICByZWFkb25seSBjb250cm9sZXI6IE9taXQ8dGhpcywga2V5b2YgSFRNTEVsZW1lbnQ+ID0gdGhpcztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGNvbnN0IGtsYXNzID0gdGhpcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgTElTU0Jhc2U7XG5cbiAgICAgICAgaWYoIGtsYXNzLkNPTlRFTlRfR0VORVJBVE9SICE9PSBudWxsIClcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IGtsYXNzLkNPTlRFTlRfR0VORVJBVE9SLmluaXRDb250ZW50KHRoaXMsIGtsYXNzLlNIQURPV19NT0RFKTtcbiAgICB9XG5cblxuICAgIC8vIGRlZmluZSBmb3IgYXV0by1jb21wbGV0ZS5cbiAgICBzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZHZhbDogc3RyaW5nfG51bGwsIG5ld3ZhbDogc3RyaW5nfG51bGwpe31cbn0iLCJleHBvcnQge2RlZmF1bHQgYXMgZGVmYXVsdH0gZnJvbSBcIi4vTElTU0Jhc2VcIjsiLCJpbXBvcnQgZGVmaW5lLCB7IFdhaXRpbmdEZWZpbmUgfSBmcm9tIFwiVjMvZGVmaW5lL2RlZmluZVwiO1xuaW1wb3J0IExJU1MgZnJvbSBcIlYzXCI7XG5pbXBvcnQgQXV0b0NvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIlYzL0NvbnRlbnRHZW5lcmF0b3JzL0F1dG9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgaXNQYWdlTG9hZGVkIGZyb20gXCJWMy91dGlscy9ET00vaXNQYWdlTG9hZGVkXCI7XG5pbXBvcnQgd2hlblBhZ2VMb2FkZWQgZnJvbSBcIlYzL3V0aWxzL0RPTS93aGVuUGFnZUxvYWRlZFwiO1xuaW1wb3J0IGZldGNoVGV4dCBmcm9tIFwiVjMvdXRpbHMvbmV0d29yay9mZXRjaFRleHRcIjtcbmltcG9ydCBleGVjdXRlIGZyb20gXCJWMy91dGlscy9leGVjdXRlXCI7XG5cbmNvbnN0IHNjcmlwdCA9ICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pignc2NyaXB0OmlzKFtsaXNzLWF1dG9dLFtsaXNzLWNkaXJdLFtsaXNzLXN3XSknKTtcblxuZXhwb3J0IGNvbnN0IExJU1NfTU9ERSAgICA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdsaXNzLW1vZGUnKSA/PyBudWxsO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ0RJUiA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdsaXNzLWNkaXInKSA/PyBudWxsO1xuXG4vLyBUT0RPOiBkZWZhdWx0ID9cbmNvbnN0IFNXX1BBVEggICAgICAgICAgICAgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnbGlzcy1zdycpID8/IG51bGw7XG5cbmlmKExJU1NfTU9ERSA9PT0gXCJhdXRvLWxvYWRcIiAmJiBERUZBVUxUX0NESVIgIT09IG51bGwpIHtcbiAgICBpZiggISBpc1BhZ2VMb2FkZWQoKSApXG4gICAgICAgIGF3YWl0IHdoZW5QYWdlTG9hZGVkKCk7XG4gICAgYXV0b2xvYWQoREVGQVVMVF9DRElSKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9sb2FkKGNkaXI6IHN0cmluZykge1xuXG4gICAgY29uc3QgU1c6IFByb21pc2U8dm9pZD4gPSBuZXcgUHJvbWlzZSggYXN5bmMgKHJlc29sdmUpID0+IHtcblxuICAgICAgICBpZiggU1dfUEFUSCA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIllvdSBhcmUgdXNpbmcgTElTUyBBdXRvIG1vZGUgd2l0aG91dCBzdy5qcy5cIik7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihTV19QQVRILCB7c2NvcGU6IFwiL1wifSk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUmVnaXN0cmF0aW9uIG9mIFNlcnZpY2VXb3JrZXIgZmFpbGVkXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiggY2RpcltjZGlyLmxlbmd0aC0xXSAhPT0gJy8nKVxuICAgICAgICBjZGlyICs9ICcvJztcblxuICAgIC8vY29uc3QgYnJ5dGhvbiA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJicnl0aG9uXCIpO1xuXG4gICAgLy8gb2JzZXJ2ZSBmb3IgbmV3IGluamVjdGVkIHRhZ3MuXG4gICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgZm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXG4gICAgICAgICAgICBmb3IobGV0IGFkZGl0aW9uIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpXG4gICAgICAgICAgICAgICAgaWYoIGFkZGl0aW9uLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiSFRNTEVsZW1lbnRcIiApXG4gICAgICAgICAgICAgICAgLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL1dJQ0cvd2ViY29tcG9uZW50cy9pc3N1ZXMvMTA5NyNpc3N1ZWNvbW1lbnQtMjY2NTA5MjMxNVxuICAgICAgICAgICAgICAgIC8vIGlmKGFkZGl0aW9uIGluc3RhbmNlb2YgSFRNTFVua25vd25FbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICBhZGRUYWcoYWRkaXRpb24gYXMgSFRNTEVsZW1lbnQpXG5cbiAgICB9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG4gICAgZm9yKCBsZXQgZWxlbSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIjpub3QoOmRlZmluZWQpXCIpIClcbiAgICAgICAgYWRkVGFnKCBlbGVtICk7XG5cbiAgICBhc3luYyBmdW5jdGlvbiBhZGRUYWcodGFnOiBIVE1MRWxlbWVudCkge1xuXG4gICAgICAgIGF3YWl0IFNXOyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG4gICAgICAgIGNvbnN0IHRhZ25hbWUgPSB0YWcudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGlmKCAgV2FpdGluZ0RlZmluZS5oYXModGFnbmFtZSlcbiAgICAgICAgICAgIC8vIGNvdWxkIGJlIGRlZmluZWQsIGJ1dCBub3QgeWV0IHVwZ3JhZGVkXG4gICAgICAgICB8fCBjdXN0b21FbGVtZW50cy5nZXQodGFnbmFtZSkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsb2FkQ29tcG9uZW50KHRhZ25hbWUsIHtcbiAgICAgICAgICAgIC8vYnJ5dGhvbixcbiAgICAgICAgICAgIGNkaXJcbiAgICAgICAgfSk7XHRcdFxuICAgIH1cbn1cblxuLyoqKioqL1xuXG50eXBlIGxvYWRDb21wb25lbnRfT3B0cyA9IHtcblx0Y2RpciAgID86IHN0cmluZ3xudWxsXG59O1xuXG50eXBlIENzdHI8VD4gPSAoLi4uYXJnczogYW55W10pID0+IFQ7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkQ29tcG9uZW50PFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0dGFnbmFtZTogc3RyaW5nLFxuXHR7XG5cdFx0Y2RpciAgICA9IERFRkFVTFRfQ0RJUixcblx0XHQvLyBicnl0aG9uID0gbnVsbFxuXHR9OiBsb2FkQ29tcG9uZW50X09wdHMgPSB7fVxuKTogUHJvbWlzZTxDc3RyPFQ+PiB7XG5cblx0V2FpdGluZ0RlZmluZS5hZGQodGFnbmFtZSk7XG5cbiAgICBsZXQgdHJ1ZV90YWdkaXIgPSBMSVNTQ29udGV4dD8ub3ZlcnJpZGVfdGFncz8uW3RhZ25hbWVdID8/IHRhZ25hbWU7ICAgICBcblxuXHRjb25zdCBjb21wb19kaXIgPSBgJHtjZGlyfSR7dHJ1ZV90YWdkaXJ9L2A7XG5cblx0Y29uc3QgZmlsZXM6IFJlY29yZDxzdHJpbmcsc3RyaW5nfHVuZGVmaW5lZD4gPSB7fTtcblxuXHQvLyBzdHJhdHMgOiBKUyAtPiBCcnkgLT4gSFRNTCtDU1MgKGNmIHNjcmlwdCBhdHRyKS5cblxuICAgIGZpbGVzW1wianNcIl0gPSBhd2FpdCBmZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4LmpzYCwgdHJ1ZSk7XG5cbiAgICBpZiggZmlsZXNbXCJqc1wiXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIHRyeS9jYXRjaCA/XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW1xuICAgICAgICAgICAgZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5odG1sYCwgdHJ1ZSkhLFxuICAgICAgICAgICAgZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5jc3NgICwgdHJ1ZSkhXG4gICAgICAgIF07XG5cbiAgICAgICAgW2ZpbGVzW1wiaHRtbFwiXSwgZmlsZXNbXCJjc3NcIiBdXSA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cblx0cmV0dXJuIGF3YWl0IGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcywgY29tcG9fZGlyKTtcbn1cblxuLy9UT0RPOiByZW5hbWUgZnJvbSBmaWxlcyA/XG5hc3luYyBmdW5jdGlvbiBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbiA6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgXG4gICAgbGV0IGtsYXNzO1xuICAgIGlmKCBcImpzXCIgaW4gZmlsZXMgKVxuICAgICAgICBrbGFzcyA9IChhd2FpdCBleGVjdXRlPGFueT4oZmlsZXNbXCJqc1wiXSwgXCJqc1wiLCBvcmlnaW4pKS5kZWZhdWx0O1xuXG4gICAgaWYoIGtsYXNzID09PSB1bmRlZmluZWQgKVxuICAgICAgICBrbGFzcyA9IExJU1Moe1xuICAgICAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IEF1dG9Db250ZW50R2VuZXJhdG9yLFxuICAgICAgICAgICAgLi4uZmlsZXNcbiAgICAgICAgfSk7XG5cbiAgICBkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXG4gICAgcmV0dXJuIGtsYXNzO1xufSIsImltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBfd2hlbkRlZmluZWRQcm9taXNlcyB9IGZyb20gXCIuL3doZW5EZWZpbmVkXCI7XG5cbmV4cG9ydCBjb25zdCBXYWl0aW5nRGVmaW5lID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGRlZmluZSh0YWduYW1lOiBzdHJpbmcsIEtsYXNzOiBuZXcoLi4uYXJnczphbnlbXSkgPT4gSFRNTEVsZW1lbnQpIHtcblxuICAgIC8vVE9ETzogUHl0aG9uIGNsYXNzLi4uXG5cbiAgICAvL1RPRE86IHR5cGUgc2FmZVxuICAgIGlmKCBcIkNPTlRFTlRfR0VORVJBVE9SXCIgaW4gS2xhc3MgKSB7XG4gICAgICAgIGNvbnN0IGdlbmVyYXRvciA9IEtsYXNzLkNPTlRFTlRfR0VORVJBVE9SIGFzIENvbnRlbnRHZW5lcmF0b3I7XG5cbiAgICAgICAgaWYoICEgZ2VuZXJhdG9yLmlzUmVhZHkgKSB7XG4gICAgICAgICAgICBXYWl0aW5nRGVmaW5lLmFkZCh0YWduYW1lKTtcbiAgICAgICAgICAgIGF3YWl0IGdlbmVyYXRvci53aGVuUmVhZHk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBXYWl0aW5nRGVmaW5lLmRlbGV0ZSh0YWduYW1lKTtcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgS2xhc3MpO1xuXG4gICAgY29uc3QgcCA9IF93aGVuRGVmaW5lZFByb21pc2VzLmdldChLbGFzcyk7XG4gICAgaWYoIHAgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIHAucmVzb2x2ZSgpO1xufVxuXG5pbXBvcnQgTElTUyBmcm9tIFwiVjMvTElTU1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIlYzL0xJU1NcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lOiB0eXBlb2YgZGVmaW5lO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgPSBkZWZpbmU7IiwiaW1wb3J0IGRlZmluZSAgICAgIGZyb20gXCIuL2RlZmluZVwiO1xuaW1wb3J0IGlzRGVmaW5lZCAgIGZyb20gXCIuL2lzRGVmaW5lZFwiO1xuaW1wb3J0IHdoZW5EZWZpbmVkIGZyb20gXCIuL3doZW5EZWZpbmVkXCI7XG5cbmltcG9ydCBMSVNTIGZyb20gXCJWMy9MSVNTXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiVjMvTElTU1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgOiB0eXBlb2YgZGVmaW5lO1xuICAgICAgICBpc0RlZmluZWQ6IHR5cGVvZiBpc0RlZmluZWQ7XG4gICAgICAgIHdoZW5EZWZpbmVkICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLmRlZmluZSAgICAgID0gZGVmaW5lO1xuTElTUy5pc0RlZmluZWQgICA9IGlzRGVmaW5lZDtcbkxJU1Mud2hlbkRlZmluZWQgPSB3aGVuRGVmaW5lZDtcblxuZXhwb3J0IHtkZWZpbmUsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWR9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzRGVmaW5lZChlbGVtOiBzdHJpbmd8KG5ldyguLi5hcmdzOmFueVtdKT0+SFRNTEVsZW1lbnQpKTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pICE9PSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtKSAhPT0gbnVsbDtcbn0iLCJ0eXBlIENzdHI8VD4gPSBuZXcoLi4uYXJnczphbnlbXSk9PiBUO1xuXG5leHBvcnQgY29uc3QgX3doZW5EZWZpbmVkUHJvbWlzZXMgPSBuZXcgV2Vha01hcDxDc3RyPEhUTUxFbGVtZW50PiwgUHJvbWlzZVdpdGhSZXNvbHZlcnM8dm9pZD4+KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oZWxlbTogc3RyaW5nfENzdHI8VD4pOiBQcm9taXNlPENzdHI8VD4+IHtcbiAgICBcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlbGVtKSBhcyBDc3RyPFQ+O1xuXG4gICAgaWYoIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSkgIT09IG51bGwpXG4gICAgICAgIHJldHVybiBlbGVtIGFzIENzdHI8VD47XG5cbiAgICBsZXQgcCA9IF93aGVuRGVmaW5lZFByb21pc2VzLmdldChlbGVtKTtcbiAgICBpZiggcCA9PT0gdW5kZWZpbmVkICl7XG4gICAgICAgIHAgPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgX3doZW5EZWZpbmVkUHJvbWlzZXMuc2V0KGVsZW0sIHApO1xuICAgIH1cblxuICAgIGF3YWl0IHAucHJvbWlzZTtcbiAgICByZXR1cm4gZWxlbTtcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9MSVNTXCI7XG5cbi8vIEhFUkUuLi5cblxuaW1wb3J0IFwiLi9kZWZpbmVcIjtcbmltcG9ydCBcIi4vZGVmaW5lL2F1dG9sb2FkXCI7XG5cbmltcG9ydCBcIi4vdXRpbHMvcGFyc2Vyc1wiO1xuaW1wb3J0IFwiLi91dGlscy9uZXR3b3JrL3JlcXVpcmVcIjtcblxuaW1wb3J0IFwiLi91dGlscy90ZXN0cy9hc3NlcnRFbGVtZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IExJU1M7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNQYWdlTG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCJcbn1cblxuLypcbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59Ki8iLCJpbXBvcnQgaXNQYWdlTG9hZGVkIGZyb20gXCIuL2lzUGFnZUxvYWRlZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3aGVuRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNQYWdlTG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCByZXNvbHZlIGFzIGFueSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5ET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn0qLyIsImNvbnN0IGNvbnZlcnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5jb2RlSFRNTCh0ZXh0OiBzdHJpbmcpIHtcblx0Y29udmVydGVyLnRleHRDb250ZW50ID0gdGV4dDtcblx0cmV0dXJuIGNvbnZlcnRlci5pbm5lckhUTUw7XG59IiwiaW1wb3J0IGV4ZWN1dGVKUyBmcm9tIFwiLi9qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBleGVjdXRlPFQ+KGNvZGU6IHN0cmluZywgdHlwZTogXCJqc1wiLCBvcmlnaW46IHN0cmluZyk6IFByb21pc2U8VD4ge1xuXG4gICAgaWYoIHR5cGUgPT09IFwianNcIiApXG4gICAgICAgIHJldHVybiBhd2FpdCBleGVjdXRlSlM8VD4oY29kZSwgb3JpZ2luKTtcblxuICAgIHRocm93IG5ldyBFcnJvcignJyk7XG59IiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUpTPFQ+KGNvZGU6IHN0cmluZywgb3JpZ2luOiBzdHJpbmcpOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IGZpbGUgPSBuZXcgQmxvYihbY29kZV0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pO1xuICAgIGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG4gICAgY29uc3QgaWQgPSB1cmwuc2xpY2UodXJsLmxhc3RJbmRleE9mKCcvJykgKyAxICk7XG4gICAgKChnbG9iYWxUaGlzLkxJU1NDb250ZXh0ID8/PXt9KS5leGVjdXRlID8/PSB7dXJsX21hcDoge319KS51cmxfbWFwW2lkXSA9IG9yaWdpbjtcblxuICAgIGNvbnN0IHJlc3VsdCA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKTtcbiAgICBcbiAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG5cbiAgICByZXR1cm4gcmVzdWx0IGFzIHVua25vd24gYXMgVDtcbn1cblxuXG5kZWNsYXJlIGdsb2JhbCB7XG5cbiAgICBpbnRlcmZhY2UgTElTU0NvbnRleHQge1xuICAgICAgICBleGVjdXRlPzoge1xuICAgICAgICAgICAgdXJsX21hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIExJU1NDb250ZXh0OiBMSVNTQ29udGV4dDtcbiAgICBcbn0iLCIvLyBpbiBhdXRvLW1vZGUgdXNlIFNlcnZpY2VXb3JrZXIgdG8gaGlkZSA0MDQgZXJyb3IgbWVzc2FnZXMuXG4vLyBpZiBwbGF5Z3JvdW5kIGZpbGVzLCB1c2UgdGhlbS5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGhpZGU0MDQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuXG4gICAgY29uc3QgZmV0Y2hDb250ZXh0ID0gZ2xvYmFsVGhpcy5MSVNTQ29udGV4dD8uZmV0Y2g7XG4gICAgaWYoIGZldGNoQ29udGV4dCAhPT0gdW5kZWZpbmVkICkgeyAvLyBmb3IgdGhlIHBsYXlncm91bmRcbiAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBVUkwodXJpLCBmZXRjaENvbnRleHQuY3dkICk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZmV0Y2hDb250ZXh0LmZpbGVzW3BhdGgudG9TdHJpbmcoKV07XG4gICAgICAgIGlmKCB2YWx1ZSA9PT0gXCJcIiApXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBpZiggdmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gaGlkZTQwNFxuICAgICAgICAgICAgICAgICAgICAgICAgPyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7fTtcblxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuICAgIGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGlmKCBoaWRlNDA0ICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cbiAgICBpZihhbnN3ZXIgPT09IFwiXCIpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gYW5zd2VyXG59XG5cblxuXG5kZWNsYXJlIGdsb2JhbCB7XG5cbiAgICBpbnRlcmZhY2UgTElTU0NvbnRleHQge1xuICAgICAgICBmZXRjaD86IHtcbiAgICAgICAgICAgIGN3ZCAgOiBzdHJpbmcsXG4gICAgICAgICAgICBmaWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIExJU1NDb250ZXh0OiBMSVNTQ29udGV4dDtcbn0iLCJpbXBvcnQgeyBMSVNTIH0gZnJvbSBcIlYyL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCBmZXRjaFRleHQgZnJvbSBcIi4vZmV0Y2hUZXh0XCI7XG5cbi8vIEB0cy1pZ25vcmVcbmdsb2JhbFRoaXMucmVxdWlyZSA9IGFzeW5jIGZ1bmN0aW9uKHVybDogc3RyaW5nKSB7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrITtcblxuICAgIGxldCBjYWxsZXI6IHN0cmluZztcbiAgICBpZiggc3RhY2suc3RhcnRzV2l0aChcIkVycm9yXCIpICkgeyAgIC8vIENocm9tZSA/XG4gICAgICAgIGNhbGxlciA9IHN0YWNrLnNwbGl0KCdcXG4nKVsxKzFdLnNsaWNlKDcpO1xuICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZGID9cbiAgICAgICAgY2FsbGVyID0gc3RhY2suc3BsaXQoJ1xcbicpWzFdLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIGlmKCBjYWxsZXIuc3RhcnRzV2l0aCgnYmxvYjonKSApIHtcblxuICAgICAgICBjYWxsZXIgPSBjYWxsZXIuc2xpY2UoY2FsbGVyLmxhc3RJbmRleE9mKCcvJykgKyAxICk7XG4gICAgICAgIGNhbGxlciA9IGNhbGxlci5zbGljZSgwLCBjYWxsZXIuaW5kZXhPZignOicpKTtcblxuICAgICAgICB1cmwgPSBMSVNTQ29udGV4dC5leGVjdXRlIS51cmxfbWFwW2NhbGxlcl0gKyB1cmw7XG4gICAgICAgIFxuICAgICAgICAvL1RPRE86IHJld3JpdGUgVVJMLi4uXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCBjYWxsZXIgKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVxdWlyZSBmcm9tIG5vbi1ibG9iIGltcG9ydCwgdW5pbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiByZXZlcmlmeSBwbGF5Z3JvdW5kXG5cbiAgICByZXR1cm4gYXdhaXQgZmV0Y2hUZXh0KHVybCk7XG59IiwiZXhwb3J0IHR5cGUgUmVzc291cmNlPFQ+ID1cbiAgICAgIFRcbiAgICB8IFByb21pc2U8VD5cbiAgICB8IChUIGV4dGVuZHMgc3RyaW5nICAgICAgICAgPyBQcm9taXNlPFJlc3BvbnNlPiB8IFJlc3BvbnNlIDogbmV2ZXIpXG4gICAgfCAoVCBleHRlbmRzIEFycmF5PGluZmVyIEU+ID8gUmVzc291cmNlPEU+W10gICAgICAgICAgICAgICA6IG5ldmVyKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVzc291cmNlUmVhZHk8VD4ocmVzOiBSZXNzb3VyY2U8VD58dW5kZWZpbmVkKTogcmVzIGlzIFR8dW5kZWZpbmVkIHtcblxuICAgIGlmKCBBcnJheS5pc0FycmF5KHJlcykgKVxuICAgICAgICByZXR1cm4gcmVzLmV2ZXJ5KCBlID0+IGlzUmVzc291cmNlUmVhZHkoZSkgKTtcblxuICAgIHJldHVybiByZXMgPT09IHVuZGVmaW5lZCB8fCAhKHJlcyBpbnN0YW5jZW9mIFByb21pc2UgfHwgcmVzIGluc3RhbmNlb2YgUmVzcG9uc2UpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdFJlc3NvdXJjZTxUPihyZXM6IFJlc3NvdXJjZTxUPik6IFByb21pc2U8VD4ge1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkocmVzKSApXG4gICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChyZXMubWFwKCBlID0+IHdhaXRSZXNzb3VyY2UoZSkpKSBhcyBUO1xuXG4gICAgaWYoIHJlcyBpbnN0YW5jZW9mIFByb21pc2UpXG4gICAgICAgIHJlcyA9IGF3YWl0IHJlcztcblxuICAgIGlmKCByZXMgaW5zdGFuY2VvZiBSZXNwb25zZSlcbiAgICAgICAgcmVzID0gYXdhaXQgcmVzLnRleHQoKSBhcyBUO1xuXG4gICAgcmV0dXJuIHJlcyBhcyBUO1xufSIsImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIik7XG5jb25zdCBkZiA9IHRlbXBsYXRlLmNvbnRlbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIEhUTUxFbGVtZW50PiguLi5yYXc6IFRlbXBsYXRlPHN0cmluZz4pOiBUIHtcbiAgICBcbiAgICBsZXQgZWxlbSA9IHJhd1swXTtcblxuICAgIGlmKCBBcnJheS5pc0FycmF5KGVsZW0pICkge1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgc3RyID0gcmF3WzBdIGFzIFRlbXBsYXRlU3RyaW5nc0FycmF5O1xuXG4gICAgICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPCByYXcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSByYXdbaV07XG4gICAgICAgICAgICBzdHJpbmcgKz0gc3RyW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbSA9IHN0cmluZztcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBlbGVtO1xuXG4gICAgaWYoIGRmLmNoaWxkTm9kZXMubGVuZ3RoICE9PSAxKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvclwiKTtcblxuICAgIHJldHVybiBkZi5maXJzdENoaWxkIGFzIFQ7XG59IiwiaW1wb3J0IExJU1MgZnJvbSBcIlYzL0xJU1NcIjtcblxuaW1wb3J0IGh0bWwgICAgIGZyb20gXCIuL2h0bWxcIlxuaW1wb3J0IHRlbXBsYXRlIGZyb20gXCIuL3RlbXBsYXRlXCI7XG5pbXBvcnQgc3R5bGUgICAgZnJvbSBcIi4vc3R5bGVcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCJWMy9MSVNTXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGh0bWwgICAgOiB0eXBlb2YgaHRtbDtcbiAgICAgICAgdGVtcGxhdGU6IHR5cGVvZiB0ZW1wbGF0ZTtcbiAgICAgICAgc3R5bGUgICA6IHR5cGVvZiBzdHlsZTtcbiAgICB9XG59XG5cbkxJU1Muc3R5bGUgICAgPSBzdHlsZTtcbkxJU1MudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbkxJU1MuaHRtbCAgICAgPSBodG1sO1xuXG5leHBvcnQge3N0eWxlLCB0ZW1wbGF0ZSwgaHRtbH07IiwiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgdHlwZSBDU1MgICA9IHN0cmluZ3xDU1NTdHlsZVNoZWV0fEhUTUxTdHlsZUVsZW1lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0eWxlKC4uLnJhdzogVGVtcGxhdGU8Q1NTPik6IENTU1N0eWxlU2hlZXQge1xuXG4gICAgbGV0IGVsZW0gPSByYXdbMF07XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQgKVxuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG4gICAgICAgIHJldHVybiBlbGVtLnNoZWV0ITtcblxuICAgIGlmKCBBcnJheS5pc0FycmF5KGVsZW0pICkge1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgc3RyID0gcmF3WzBdIGFzIFRlbXBsYXRlU3RyaW5nc0FycmF5O1xuXG4gICAgICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPCByYXcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSByYXdbaV07XG4gICAgICAgICAgICBzdHJpbmcgKz0gc3RyW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbSA9IHN0cmluZztcbiAgICB9XG5cbiAgICBpZiggdHlwZW9mIGVsZW0gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGVsZW0pO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJzXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICBzdHlsZS5yZXBsYWNlU3luYyhlbGVtKTtcbiAgICByZXR1cm4gc3R5bGU7XG59IiwiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgdHlwZSBIVE1MICA9IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0ZW1wbGF0ZSggLi4ucmF3OlRlbXBsYXRlPEhUTUw+KTogRG9jdW1lbnRGcmFnbWVudCB7XG5cbiAgICBsZXQgZWxlbSA9IHJhd1swXTtcblxuICAgIGlmKCBBcnJheS5pc0FycmF5KGVsZW0pICkge1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgc3RyID0gcmF3WzBdIGFzIFRlbXBsYXRlU3RyaW5nc0FycmF5O1xuXG4gICAgICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPCByYXcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSByYXdbaV07XG4gICAgICAgICAgICBzdHJpbmcgKz0gc3RyW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbSA9IHN0cmluZztcbiAgICB9XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgICByZXR1cm4gZWxlbS5jbG9uZU5vZGUodHJ1ZSkgYXMgRG9jdW1lbnRGcmFnbWVudDtcblxuICAgIC8vIG11c3QgdXNlIHRlbXBsYXRlIGFzIERvY3VtZW50RnJhZ21lbnQgZG9lc24ndCBoYXZlIC5pbm5lckhUTUxcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgaWYodHlwZW9mIGVsZW0gPT09ICdzdHJpbmcnKVxuICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBlbGVtLnRyaW0oKTtcbiAgICBlbHNlIHtcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgICAgIC8vIHByZXZlbnRzIGlzc3VlIGlmIGVsZW0gaXMgbGF0dGVyIHVwZGF0ZWQuXG4gICAgICAgICAgICBlbGVtID0gZWxlbS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIFxuICAgICAgICB0ZW1wbGF0ZS5hcHBlbmQoIGVsZW0gKTtcbiAgICB9XG5cbiAgICAvL2lmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgIC8vICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkISBhcyB1bmtub3duIGFzIFQ7XG4gICAgXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhO1xufSIsInR5cGUgT3B0aW9ucyA9IHtcbiAgICBzaGFkb3dfaHRtbD86IHN0cmluZyxcbiAgICBjc3MgICAgICAgID86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+XG59XG5cbmZ1bmN0aW9uIHdhaXRGcmFtZSgpIHtcbiAgICBjb25zdCB7IHByb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoICgpID0+IHJlc29sdmUoKSApO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGFzc2VydEVsZW1lbnQodGFnbmFtZTogc3RyaW5nLCBvcHRzOiBPcHRpb25zID0ge30pIHtcbiAgICBcbiAgICBjb25zdCBzaGFkb3dfaHRtbCA9IG9wdHMuc2hhZG93X2h0bWwgPz8gbnVsbDtcbiAgICBjb25zdCBjc3MgICAgICAgICA9IG9wdHMuY3NzICAgICAgICAgPz8ge307XG5cblxuICAgIGF3YWl0IHdoZW5EZWZpbmVkKHRhZ25hbWUpO1xuXG4gICAgLy9mb3IobGV0IGkgPSAwOyBpIDwgMTsgKytpKVxuICAgIC8vICAgIGF3YWl0IHdhaXRGcmFtZSgpO1xuXG4gICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFnbmFtZSk7XG5cbiAgICBpZiggZWxlbSA9PT0gbnVsbCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBub3QgZm91bmRcIik7XG5cbiAgICAvL1RPRE86IC4uLlxuICAgIC8vYXdhaXQgTElTUy53aGVuSW5pdGlhbGl6ZWQoZWxlbSk7XG5cbiAgICBpZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG5gV3JvbmcgdGFnbmFtZS5cbkV4cGVjdGVkOiAke3RhZ25hbWV9XG5Hb3Q6ICR7ZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCl9YCk7XG5cbiAgICBpZiggZWxlbS5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkhUTUxFbGVtZW50XCIpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBub3QgdXBncmFkZWQhYCk7XG5cbiAgICBpZiggc2hhZG93X2h0bWwgIT09IGVsZW0uc2hhZG93Um9vdCApIHtcbiAgICAgICAgaWYoIHNoYWRvd19odG1sID09PSBudWxsIHx8IGVsZW0uc2hhZG93Um9vdCA9PT0gbnVsbCApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNoYWRvd1Jvb3QgbWlzc2luZyBvciB1bmV4cGVjdGVkLmApO1xuICAgICAgICBpZiggc2hhZG93X2h0bWwgIT09IGVsZW0uc2hhZG93Um9vdC5pbm5lckhUTUwgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuYEhUTUwgY29udGVudCBtaXNtYXRjaGVkLlxuRXhwZWN0ZWQ6ICR7c2hhZG93X2h0bWx9XG5Hb3Q6ICR7ZWxlbS5zaGFkb3dSb290LmlubmVySFRNTH1gKTtcbiAgICB9XG5cbiAgICBmb3IobGV0IHNlbGVjdG9yIGluIGNzcyApIHtcbiAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBjc3Nbc2VsZWN0b3JdO1xuXG4gICAgICAgIGxldCBzdWJfZWxlbXM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+fEhUTUxFbGVtZW50W107XG4gICAgICAgIGlmKCBzZWxlY3RvciA9PT0gXCJcIilcbiAgICAgICAgICAgIHN1Yl9lbGVtcyA9IFtlbGVtIGFzIEhUTUxFbGVtZW50XTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3ViX2VsZW1zID0gKCgoZWxlbSBhcyBhbnkpLmNvbnRlbnQgPz8gZWxlbS5zaGFkb3dSb290ID8/IGVsZW0pIGFzIFNoYWRvd1Jvb3R8SFRNTEVsZW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KHNlbGVjdG9yKTtcbiAgICBcbiAgICAgICAgaWYoIHN1Yl9lbGVtcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnRzIFwiJHtzZWxlY3Rvcn1cIiBub3QgZm91bmRgKTtcblxuICAgICAgICBmb3IoIGxldCBzdWJfZWxlbSBvZiBzdWJfZWxlbXMgKSB7XG5cbiAgICAgICAgICAgIC8vIGNvbXBhcmUgc3R5bGUgOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81OTM0MjkyOC9nZXRjb21wdXRlZHN0eWxlLW9ubHktdGhlLWNoYW5nZXMtZnJvbS1kZWZhdWx0XG4gICAgICAgICAgICAvLyAgXiBnZXQgYWxsIGVsZW1lbnRzLCBmaW5kIG1hdGNoaW5nIHFzLCBjb21wYXJlXG4gICAgICAgICAgICAvLyBwc2V1ZG8gY2xhc3MgIDogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzIwOTE4NDgvdGVtcGxhdGUtcXVlcnlzZWxlY3Rvci11c2luZy1zY29wZS1wc2V1ZG8tY2xhc3Mtd29ya3Mtd2l0aC1kb2N1bWVudC1idXQtbm90XG5cbiAgICAgICAgICAgIGNvbnN0IGNzcyA9IGdldENvbXB1dGVkU3R5bGUoc3ViX2VsZW0pXG4gICAgICAgICAgICBmb3IobGV0IHByb3BuYW1lIGluIGV4cGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsID0gY3NzLmdldFByb3BlcnR5VmFsdWUocHJvcG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmKCB2YWwgIT09IGV4cGVjdGVkW3Byb3BuYW1lXSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYENTUyBtaXNtYXRjaFxuICAgICAgICBFeHBlY3RlZDoke2V4cGVjdGVkfVxuICAgICAgICBHb3Q6ICR7Y3NzfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuaW1wb3J0IHsgd2hlbkRlZmluZWQgfSBmcm9tIFwiVjIvTGlmZUN5Y2xlL0RFRklORURcIjtcbmltcG9ydCBMSVNTIGZyb20gXCJWMy9MSVNTXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiVjMvTElTU1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBhc3NlcnRFbGVtZW50ICAgIDogdHlwZW9mIGFzc2VydEVsZW1lbnQ7XG4gICAgfVxufVxuXG5MSVNTLmFzc2VydEVsZW1lbnQgPSBhc3NlcnRFbGVtZW50O1xuIiwiZXhwb3J0IHtkZWZhdWx0IGFzIFYyfSBmcm9tIFwiVjJcIjtcbmV4cG9ydCB7ZGVmYXVsdCBhcyBWM30gZnJvbSBcIlYzXCI7XG5cbmltcG9ydCBMSVNTIGZyb20gXCJWM1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUztcblxuLy8gQHRzLWlnbm9yZVxuZ2xvYmFsVGhpcy5MSVNTID0gTElTUzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwidmFyIHdlYnBhY2tRdWV1ZXMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIHF1ZXVlc1wiKSA6IFwiX193ZWJwYWNrX3F1ZXVlc19fXCI7XG52YXIgd2VicGFja0V4cG9ydHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGV4cG9ydHNcIikgOiBcIl9fd2VicGFja19leHBvcnRzX19cIjtcbnZhciB3ZWJwYWNrRXJyb3IgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGVycm9yXCIpIDogXCJfX3dlYnBhY2tfZXJyb3JfX1wiO1xudmFyIHJlc29sdmVRdWV1ZSA9IChxdWV1ZSkgPT4ge1xuXHRpZihxdWV1ZSAmJiBxdWV1ZS5kIDwgMSkge1xuXHRcdHF1ZXVlLmQgPSAxO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tKSk7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0gPyBmbi5yKysgOiBmbigpKSk7XG5cdH1cbn1cbnZhciB3cmFwRGVwcyA9IChkZXBzKSA9PiAoZGVwcy5tYXAoKGRlcCkgPT4ge1xuXHRpZihkZXAgIT09IG51bGwgJiYgdHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmKGRlcFt3ZWJwYWNrUXVldWVzXSkgcmV0dXJuIGRlcDtcblx0XHRpZihkZXAudGhlbikge1xuXHRcdFx0dmFyIHF1ZXVlID0gW107XG5cdFx0XHRxdWV1ZS5kID0gMDtcblx0XHRcdGRlcC50aGVuKChyKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXhwb3J0c10gPSByO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSwgKGUpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFcnJvcl0gPSBlO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgb2JqID0ge307XG5cdFx0XHRvYmpbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChmbihxdWV1ZSkpO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9XG5cdH1cblx0dmFyIHJldCA9IHt9O1xuXHRyZXRbd2VicGFja1F1ZXVlc10gPSB4ID0+IHt9O1xuXHRyZXRbd2VicGFja0V4cG9ydHNdID0gZGVwO1xuXHRyZXR1cm4gcmV0O1xufSkpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5hID0gKG1vZHVsZSwgYm9keSwgaGFzQXdhaXQpID0+IHtcblx0dmFyIHF1ZXVlO1xuXHRoYXNBd2FpdCAmJiAoKHF1ZXVlID0gW10pLmQgPSAtMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiBxdWV1ZS5kIDwgMCAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImdldFNoYXJlZENTUyIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJpc1NoYWRvd1N1cHBvcnRlZCIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwic2hhcmVkQ1NTIiwiQ29udGVudEdlbmVyYXRvciIsImRhdGEiLCJjb25zdHJ1Y3RvciIsImh0bWwiLCJjc3MiLCJzaGFkb3ciLCJwcmVwYXJlSFRNTCIsInByZXBhcmVDU1MiLCJzZXRUZW1wbGF0ZSIsInRlbXBsYXRlIiwiaXNSZWFkeSIsIndoZW5SZWFkeSIsImZpbGxDb250ZW50IiwiaW5qZWN0Q1NTIiwiYXBwZW5kIiwiY29udGVudCIsImNsb25lTm9kZSIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImdlbmVyYXRlIiwiaG9zdCIsInRhcmdldCIsImluaXRTaGFkb3ciLCJzaGFkb3dNb2RlIiwiTk9ORSIsImNoaWxkTm9kZXMiLCJsZW5ndGgiLCJyZXBsYWNlQ2hpbGRyZW4iLCJjYW5IYXZlU2hhZG93IiwiRXJyb3IiLCJtb2RlIiwiT1BFTiIsImF0dGFjaFNoYWRvdyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImUiLCJwcm9jZXNzQ1NTIiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ1bmRlZmluZWQiLCJzdHIiLCJ0cmltIiwiaW5uZXJIVE1MIiwiSFRNTEVsZW1lbnQiLCJzdHlsZXNoZWV0cyIsIlNoYWRvd1Jvb3QiLCJhZG9wdGVkU3R5bGVTaGVldHMiLCJwdXNoIiwiY3Nzc2VsZWN0b3IiLCJDU1NTZWxlY3RvciIsImhhcyIsInNldEF0dHJpYnV0ZSIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwicmVwbGFjZSIsImhlYWQiLCJhZGQiLCJidWlsZExJU1NIb3N0Iiwic2V0Q3N0ckNvbnRyb2xlciIsIl9fY3N0cl9ob3N0Iiwic2V0Q3N0ckhvc3QiLCJfIiwiTElTUyIsImFyZ3MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJjb250ZW50X2dlbmVyYXRvciIsIkxJU1NDb250cm9sZXIiLCJIb3N0Iiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwibmFtZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJjb25uZWN0ZWRDYWxsYmFjayIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiaXNDb25uZWN0ZWQiLCJfSG9zdCIsImlkIiwiX19jc3RyX2NvbnRyb2xlciIsIkxpc3MiLCJob3N0Q3N0ciIsImNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIiLCJMSVNTSG9zdCIsIkNmZyIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkNvbnRyb2xlciIsImNvbnRyb2xlciIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwicGFyYW1zIiwiaW5pdCIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInRoZW4iLCJwcm9taXNlIiwicmVzb2x2ZSIsIlByb21pc2UiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJicnlfY2xhc3MiLCJfX2Jhc2VzX18iLCJmaWx0ZXIiLCJfX25hbWVfXyIsIl9qc19rbGFzcyIsIiRqc19mdW5jIiwiX19CUllUSE9OX18iLCIkY2FsbCIsIiRnZXRhdHRyX3BlcDY1NyIsImh0bWx0YWciLCJDbGFzcyIsIm9wdHMiLCJnZXROYW1lIiwiZWxlbWVudCIsIkVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiaXNEZWZpbmVkIiwiZWxlbSIsImdldCIsIndoZW5EZWZpbmVkIiwiZ2V0SG9zdENzdHIiLCJnZXRIb3N0Q3N0clN5bmMiLCJpc1VwZ3JhZGVkIiwidXBncmFkZVN5bmMiLCJ3aGVuVXBncmFkZWQiLCJnZXRDb250cm9sZXIiLCJnZXRDb250cm9sZXJTeW5jIiwiaW5pdGlhbGl6ZVN5bmMiLCJnZXRDb250cm9sZXJDc3RyIiwiZ2V0Q29udHJvbGVyQ3N0clN5bmMiLCJfd2hlblVwZ3JhZGVkIiwiZ2V0SG9zdCIsIm93bmVyRG9jdW1lbnQiLCJhZG9wdE5vZGUiLCJnZXRIb3N0U3luYyIsIlN0YXRlcyIsIl9MSVNTIiwiSUxJU1MiLCJjZmciLCJhc3NpZ24iLCJFeHRlbmRlZExJU1MiLCJLbm93blRhZ3MiLCJzY3JpcHQiLCJERUZBVUxUX0NESVIiLCJhdXRvbG9hZCIsImNkaXIiLCJTVyIsInN3X3BhdGgiLCJjb25zb2xlIiwid2FybiIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInNjb3BlIiwiZXJyb3IiLCJjb250cm9sbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJyeXRob24iLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJhZGRUYWciLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsInRhZyIsImltcG9ydENvbXBvbmVudCIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwiY19qcyIsImtsYXNzIiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwib2xkcmVxIiwicmVxdWlyZSIsInN0YXJ0c1dpdGgiLCJmaWxlbmFtZSIsInNsaWNlIiwiZGVmYXVsdCIsIkxJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IiLCJfZmV0Y2hUZXh0IiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImFuc3dlciIsInRleHQiLCJfaW1wb3J0IiwibG9nIiwiY29udmVydGVyIiwiZW5jb2RlSFRNTCIsInRleHRDb250ZW50IiwibWF0Y2giLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImNzc19hdHRyIiwic2V0UHJvcGVydHkiLCJpbXBvcnRDb21wb25lbnRzIiwiY29tcG9uZW50cyIsInJlc3VsdHMiLCJicnlfd3JhcHBlciIsImNvbXBvX2RpciIsImNvZGUiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsImlkeCIsInByb21pc2VzIiwiYWxsIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwicmVnZXgiLCJBdXRvQ29udGVudEdlbmVyYXRvciIsInByZXBhcmVUZW1wbGF0ZSIsInZhbHVlIiwiaXNSZXNzb3VyY2VSZWFkeSIsIndhaXRSZXNzb3VyY2UiLCJwcmVwYXJlIiwicHJlcGFyZVN0eWxlIiwiaW5pdENvbnRlbnQiLCJjcmVhdGVDb250ZW50IiwiTElTU0Z1bGwiLCJnZXRJbml0aWFsVmFsdWUiLCJkZWZhdWx0VmFsdWUiLCJoYXNPd24iLCJnZW5lcmF0b3IiLCJTSEFET1dfTU9ERSIsIkNPTlRFTlRfR0VORVJBVE9SIiwiTElTU0Jhc2UiLCJvbGR2YWwiLCJuZXd2YWwiLCJXYWl0aW5nRGVmaW5lIiwiaXNQYWdlTG9hZGVkIiwid2hlblBhZ2VMb2FkZWQiLCJmZXRjaFRleHQiLCJleGVjdXRlIiwiTElTU19NT0RFIiwiU1dfUEFUSCIsImxvYWRDb21wb25lbnQiLCJ0cnVlX3RhZ2RpciIsIkxJU1NDb250ZXh0Iiwib3ZlcnJpZGVfdGFncyIsIm9yaWdpbiIsIl93aGVuRGVmaW5lZFByb21pc2VzIiwiS2xhc3MiLCJkZWxldGUiLCJwIiwiV2Vha01hcCIsInNldCIsImV4ZWN1dGVKUyIsImxhc3RJbmRleE9mIiwiZ2xvYmFsVGhpcyIsInVybF9tYXAiLCJyZXZva2VPYmplY3RVUkwiLCJoaWRlNDA0IiwiZmV0Y2hDb250ZXh0IiwicGF0aCIsImN3ZCIsInRvU3RyaW5nIiwic3RhY2siLCJjYWxsZXIiLCJzcGxpdCIsImluZGV4T2YiLCJldmVyeSIsIlJlc3BvbnNlIiwiZGYiLCJyYXciLCJ0cmFjZSIsIndhaXRGcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImFzc2VydEVsZW1lbnQiLCJzaGFkb3dfaHRtbCIsInNoYWRvd1Jvb3QiLCJleHBlY3RlZCIsInN1Yl9lbGVtcyIsInN1Yl9lbGVtIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsInByb3BuYW1lIiwidmFsIiwiZ2V0UHJvcGVydHlWYWx1ZSIsIlYyIiwiVjMiXSwic291cmNlUm9vdCI6IiJ9