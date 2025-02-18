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
    const compo_dir = `${cdir}${tagname}/`;
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
    return await defineWebComponent(tagname, files);
}
//TODO: rename from files ?
async function defineWebComponent(tagname, files) {
    let klass;
    if ("js" in files) klass = (await (0,V3_utils_execute__WEBPACK_IMPORTED_MODULE_6__["default"])(files["js"], "js")).default;
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

async function execute(code, type) {
    if (type === "js") return await (0,_js__WEBPACK_IMPORTED_MODULE_0__["default"])(code);
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
async function executeJS(code) {
    const file = new Blob([
        code
    ], {
        type: 'application/javascript'
    });
    const url = URL.createObjectURL(file);
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
    const fetchContext = globalThis.LISSContext.fetch;
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
    //TODO: non playground...
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0o7VUFDQTtVQUNBLElBQUk7VUFDSjtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxDQUFDO1VBQ0Q7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLEVBQUU7VUFDRjtVQUNBLHNHQUFzRztVQUN0RztVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLEdBQUc7VUFDSDtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EsR0FBRztVQUNIO1VBQ0EsRUFBRTtVQUNGO1VBQ0E7Ozs7O1VDaEVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7OztTRU5BO1NBQ0E7U0FDQTtTQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9Db250ZW50R2VuZXJhdG9yLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTElTU0NvbnRyb2xlci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL0RFRklORUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvSU5JVElBTElaRUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvUkVBRFkudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvVVBHUkFERUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvc3RhdGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvY29yZS9MaWZlQ3ljbGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9leHRlbmRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9MSVNTQXV0by50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvYnVpbGQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL2V2ZW50cy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL3R5cGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9Db250ZW50R2VuZXJhdG9ycy9BdXRvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0NvbnRlbnRHZW5lcmF0b3JzL0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9MSVNTLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvTElTUy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0xJU1MvTElTU0Z1bGwudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9kZWZpbmUvYXV0b2xvYWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9kZWZpbmUvZGVmaW5lLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL2lzRGVmaW5lZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2RlZmluZS93aGVuRGVmaW5lZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvRE9NL2lzUGFnZUxvYWRlZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL0RPTS93aGVuUGFnZUxvYWRlZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL2VuY29kZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL2V4ZWN1dGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9leGVjdXRlL2pzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvbmV0d29yay9mZXRjaFRleHQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9uZXR3b3JrL3JlcXVpcmUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9uZXR3b3JrL3Jlc3NvdXJjZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3BhcnNlcnMvaHRtbC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3BhcnNlcnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9wYXJzZXJzL3N0eWxlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvcGFyc2Vycy90ZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvYXN5bmMgbW9kdWxlIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFNoYXJlZENTUyB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSG9zdCwgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgaXNTaGFkb3dTdXBwb3J0ZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxudHlwZSBIVE1MID0gRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmc7XG50eXBlIENTUyAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7XG4gICAgaHRtbCAgID86IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nLFxuICAgIGNzcyAgICA/OiBDU1MgfCByZWFkb25seSBDU1NbXSxcbiAgICBzaGFkb3cgPzogU2hhZG93Q2ZnfG51bGxcbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvckNzdHIgPSB7IG5ldyhvcHRzOiBDb250ZW50R2VuZXJhdG9yX09wdHMpOiBDb250ZW50R2VuZXJhdG9yIH07XG5cbmNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcbmNvbnN0IHNoYXJlZENTUyA9IGdldFNoYXJlZENTUygpOyAvLyBmcm9tIExJU1NIb3N0Li4uXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgI3N0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W107XG4gICAgI3RlbXBsYXRlICAgOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGw7XG4gICAgI3NoYWRvdyAgICAgOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGh0bWwsXG4gICAgICAgIGNzcyAgICA9IFtdLFxuICAgICAgICBzaGFkb3cgPSBudWxsLFxuICAgIH06IENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4jc2hhZG93ICAgPSBzaGFkb3c7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGhpcy5wcmVwYXJlSFRNTChodG1sKTtcbiAgICBcbiAgICAgICAgdGhpcy4jc3R5bGVzaGVldHMgPSB0aGlzLnByZXBhcmVDU1MoY3NzKTtcblxuICAgICAgICB0aGlzLiNpc1JlYWR5ICAgPSBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgdGhpcy4jd2hlblJlYWR5ID0gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKTtcblxuICAgICAgICAvL1RPRE86IG90aGVyIGRlcHMuLi5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0VGVtcGxhdGUodGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jdGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAjd2hlblJlYWR5OiBQcm9taXNlPHVua25vd24+O1xuICAgICNpc1JlYWR5ICA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZWFkeTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuI2lzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiN3aGVuUmVhZHk7XG4gICAgICAgIC8vVE9ETzogZGVwcy5cbiAgICAgICAgLy9UT0RPOiBDU1MvSFRNTCByZXNvdXJjZXMuLi5cblxuICAgICAgICAvLyBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuICAgICAgICAvLyBfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcbiAgICAgICAgLy8gKyBjZiBhdCB0aGUgZW5kLi4uXG4gICAgfVxuXG4gICAgZmlsbENvbnRlbnQoc2hhZG93OiBTaGFkb3dSb290KSB7XG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHNoYWRvdywgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIHNoYWRvdy5hcHBlbmQoIHRoaXMuI3RlbXBsYXRlIS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSApO1xuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc2hhZG93KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudHxTaGFkb3dSb290IHtcblxuICAgICAgICAvL1RPRE86IHdhaXQgcGFyZW50cy9jaGlsZHJlbiBkZXBlbmRpbmcgb24gb3B0aW9uLi4uICAgICBcblxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmluaXRTaGFkb3coaG9zdCk7XG5cbiAgICAgICAgdGhpcy5pbmplY3RDU1ModGFyZ2V0LCB0aGlzLiNzdHlsZXNoZWV0cyk7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuI3RlbXBsYXRlIS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgaWYoIGhvc3Quc2hhZG93TW9kZSAhPT0gU2hhZG93Q2ZnLk5PTkUgfHwgdGFyZ2V0LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwIClcbiAgICAgICAgICAgIHRhcmdldC5yZXBsYWNlQ2hpbGRyZW4oY29udGVudCk7XG5cbiAgICAgICAgLy9pZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCAmJiB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApXG5cdFx0Ly9cdHRhcmdldC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoaG9zdCk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFNoYWRvdzxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpIHtcblxuICAgICAgICBjb25zdCBjYW5IYXZlU2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCk7XG4gICAgICAgIGlmKCB0aGlzLiNzaGFkb3cgIT09IG51bGwgJiYgdGhpcy4jc2hhZG93ICE9PSBTaGFkb3dDZmcuTk9ORSAmJiAhIGNhbkhhdmVTaGFkb3cgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgICAgICBsZXQgbW9kZSA9IHRoaXMuI3NoYWRvdztcbiAgICAgICAgaWYoIG1vZGUgPT09IG51bGwgKVxuICAgICAgICAgICAgbW9kZSA9IGNhbkhhdmVTaGFkb3cgPyBTaGFkb3dDZmcuT1BFTiA6IFNoYWRvd0NmZy5OT05FO1xuXG4gICAgICAgIGhvc3Quc2hhZG93TW9kZSA9IG1vZGU7XG5cbiAgICAgICAgbGV0IHRhcmdldDogSG9zdHxTaGFkb3dSb290ID0gaG9zdDtcbiAgICAgICAgaWYoIG1vZGUgIT09IFNoYWRvd0NmZy5OT05FKVxuICAgICAgICAgICAgdGFyZ2V0ID0gaG9zdC5hdHRhY2hTaGFkb3coe21vZGV9KTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlQ1NTKGNzczogQ1NTfHJlYWRvbmx5IENTU1tdKSB7XG4gICAgICAgIGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG4gICAgICAgICAgICBjc3MgPSBbY3NzXTtcblxuICAgICAgICByZXR1cm4gY3NzLm1hcChlID0+IHRoaXMucHJvY2Vzc0NTUyhlKSApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcm9jZXNzQ1NTKGNzczogQ1NTKSB7XG5cbiAgICAgICAgaWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcbiAgICAgICAgICAgIHJldHVybiBjc3M7XG4gICAgICAgIGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuICAgICAgICAgICAgcmV0dXJuIGNzcy5zaGVldCE7XG4gICAgXG4gICAgICAgIGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICAgICAgICAgIHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7IC8vIHJlcGxhY2UoKSBpZiBpc3N1ZXNcbiAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3VyXCIpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlSFRNTChodG1sPzogSFRNTCk6IEhUTUxUZW1wbGF0ZUVsZW1lbnR8bnVsbCB7XG4gICAgXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblxuICAgICAgICBpZihodG1sID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG5cbiAgICAgICAgLy8gc3RyMmh0bWxcbiAgICAgICAgaWYodHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zdCBzdHIgPSBodG1sLnRyaW0oKTtcblxuICAgICAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIGh0bWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCApXG4gICAgICAgICAgICBodG1sID0gaHRtbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgdGVtcGxhdGUuYXBwZW5kKGh0bWwpO1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaW5qZWN0Q1NTPEhvc3QgZXh0ZW5kcyBMSG9zdD4odGFyZ2V0OiBTaGFkb3dSb290fEhvc3QsIHN0eWxlc2hlZXRzOiBhbnlbXSkge1xuXG4gICAgICAgIGlmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICkge1xuICAgICAgICAgICAgdGFyZ2V0LmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUywgLi4uc3R5bGVzaGVldHMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3Nzc2VsZWN0b3IgPSB0YXJnZXQuQ1NTU2VsZWN0b3I7IC8vVE9ETy4uLlxuXG4gICAgICAgIGlmKCBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cbiAgICAgICAgbGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuICAgICAgICBmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuICAgICAgICAgICAgZm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuICAgICAgICAgICAgICAgIGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuICAgICAgICBhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcbiAgICB9XG59XG5cbi8vIGlkZW0gSFRNTC4uLlxuLyogaWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIGMgPSBhd2FpdCBjO1xuICAgICAgICAgICAgaWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG4gICAgICAgICAgICAgICAgYyA9IGF3YWl0IGMudGV4dCgpO1xuXG4gICAgICAgICAgICBzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cbiAgICAgICAgfSkoKSk7XG5cbiAgICAgICAgcmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuICAgIH1cbiovIiwiaW1wb3J0IHsgTEhvc3RDc3RyLCB0eXBlIENsYXNzLCB0eXBlIENvbnN0cnVjdG9yLCB0eXBlIExJU1NfT3B0cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QsIHNldENzdHJDb250cm9sZXIgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZX0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLyoqKiovXG5cbmludGVyZmFjZSBJQ29udHJvbGVyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4ge1xuXHQvLyBub24tdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IGhvc3Q6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IGlzQ29ubmVjdGVkICA6Ym9vbGVhbjtcbn07XG5cdC8vICsgcHJvdGVjdGVkXG5cdFx0Ly8gcmVhZG9ubHkgLmNvbnRlbnQ6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdDtcblx0Ly8gdmFuaWxsYSBKU1xuXHRcdC8vIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKTogdm9pZDtcblx0XHQvLyBjb25uZWN0ZWRDYWxsYmFjayAgICgpOiB2b2lkO1xuXHRcdC8vIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQ7XG5cbmludGVyZmFjZSBJQ29udHJvbGVyQ3N0cjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0bmV3KCk6IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPjtcblxuXHQvLyB2YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXTtcbn1cblx0Ly8gKyBcInByaXZhdGVcIlxuXHRcdC8vIHJlYWRvbmx5IEhvc3Q6IEhvc3RDc3RyXG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+ID0gSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+ICYgSW5zdGFuY2VUeXBlPEV4dGVuZHNDc3RyPjtcblxuZXhwb3J0IHR5cGUgQ29udHJvbGVyQ3N0cjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+ID0gSUNvbnRyb2xlckNzdHI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEV4dGVuZHNDc3RyO1xuXG4vKioqKi9cblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+KGFyZ3M6IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4+ID0ge30pIHtcblxuXHRsZXQge1xuXHRcdC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuXHRcdGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0ICAgICAgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3N0cixcblx0XHRob3N0ICAgICAgICAgICAgICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdFxuXHRcdGNvbnRlbnRfZ2VuZXJhdG9yID0gQ29udGVudEdlbmVyYXRvcixcblx0fSA9IGFyZ3M7XG5cdFxuXHRjbGFzcyBMSVNTQ29udHJvbGVyIGV4dGVuZHMgX2V4dGVuZHMgaW1wbGVtZW50cyBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj57XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsICkge1xuXHRcdFx0XHRzZXRDc3RyQ29udHJvbGVyKHRoaXMpO1xuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3QoLi4uYXJncyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5jb250ZW50ITtcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7fVxuXG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ob3N0LmlzQ29ubmVjdGVkO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBJbnN0YW5jZVR5cGU8TEhvc3RDc3RyPEhvc3RDc3RyPj47XG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBfSG9zdDogTEhvc3RDc3RyPEhvc3RDc3RyPjtcblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmU6IGZ1Y2sgb2ZmLlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCggdGhpcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRob3N0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NDb250cm9sZXIgc2F0aXNmaWVzIENvbnRyb2xlckNzdHI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPjtcbn0iLCJpbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIFNoYWRvd0NmZywgdHlwZSBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCB7IFN0YXRlcyB9IGZyb20gXCIuL0xpZmVDeWNsZS9zdGF0ZXNcIjtcblxuLy8gTElTU0hvc3QgbXVzdCBiZSBidWlsZCBpbiBkZWZpbmUgYXMgaXQgbmVlZCB0byBiZSBhYmxlIHRvIGJ1aWxkXG4vLyB0aGUgZGVmaW5lZCBzdWJjbGFzcy5cblxubGV0IGlkID0gMDtcblxuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFyZWRDU1MoKSB7XG5cdHJldHVybiBzaGFyZWRDU1M7XG59XG5cbmxldCBfX2NzdHJfY29udHJvbGVyICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RyQ29udHJvbGVyKF86IGFueSkge1xuXHRfX2NzdHJfY29udHJvbGVyID0gXztcbn1cblxudHlwZSBpbmZlckhvc3RDc3RyPFQ+ID0gVCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPGluZmVyIEEgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sIGluZmVyIEIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID8gQiA6IG5ldmVyO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMSVNTSG9zdDxcdFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0ciwgVSBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IGluZmVySG9zdENzdHI8VD4gPihcblx0XHRcdFx0XHRcdFx0TGlzczogVCxcblx0XHRcdFx0XHRcdFx0Ly8gY2FuJ3QgZGVkdWNlIDogY2F1c2UgdHlwZSBkZWR1Y3Rpb24gaXNzdWVzLi4uXG5cdFx0XHRcdFx0XHRcdGhvc3RDc3RyOiBVLFxuXHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcl9jc3RyOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcblx0XHRcdFx0XHRcdFx0YXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuXHRcdFx0XHRcdFx0KSB7XG5cblx0Y29uc3QgY29udGVudF9nZW5lcmF0b3IgPSBuZXcgY29udGVudF9nZW5lcmF0b3JfY3N0cihhcmdzKTtcblxuXHR0eXBlIEhvc3RDc3RyID0gVTtcbiAgICB0eXBlIEhvc3QgICAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuXHRjbGFzcyBMSVNTSG9zdCBleHRlbmRzIGhvc3RDc3RyIHtcblxuXHRcdHN0YXRpYyByZWFkb25seSBDZmcgPSB7XG5cdFx0XHRob3N0ICAgICAgICAgICAgIDogaG9zdENzdHIsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogY29udGVudF9nZW5lcmF0b3JfY3N0cixcblx0XHRcdGFyZ3Ncblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gREVQRU5ERU5DSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdHN0YXRpYyByZWFkb25seSB3aGVuRGVwc1Jlc29sdmVkID0gY29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCk7XG5cdFx0c3RhdGljIGdldCBpc0RlcHNSZXNvbHZlZCgpIHtcblx0XHRcdHJldHVybiBjb250ZW50X2dlbmVyYXRvci5pc1JlYWR5O1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0c3RhdGljIENvbnRyb2xlciA9IExpc3M7XG5cblx0XHQjY29udHJvbGVyOiBhbnl8bnVsbCA9IG51bGw7XG5cdFx0Z2V0IGNvbnRyb2xlcigpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXI7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyICE9PSBudWxsO1xuXHRcdH1cblx0XHRyZWFkb25seSB3aGVuSW5pdGlhbGl6ZWQ6IFByb21pc2U8SW5zdGFuY2VUeXBlPFQ+Pjtcblx0XHQjd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyO1xuXG5cdFx0Ly9UT0RPOiBnZXQgcmVhbCBUUyB0eXBlID9cblx0XHQjcGFyYW1zOiBhbnlbXTtcblx0XHRpbml0aWFsaXplKC4uLnBhcmFtczogYW55W10pIHtcblxuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgKCB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNEZXBzUmVzb2x2ZWQgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY2llcyBoYXNuJ3QgYmVlbiBsb2FkZWQgIVwiKTtcblxuXHRcdFx0aWYoIHBhcmFtcy5sZW5ndGggIT09IDAgKSB7XG5cdFx0XHRcdGlmKCB0aGlzLiNwYXJhbXMubGVuZ3RoICE9PSAwIClcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NzdHIgcGFyYW1zIGhhcyBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgIScpO1xuXHRcdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Ly8jaW50ZXJuYWxzID0gdGhpcy5hdHRhY2hJbnRlcm5hbHMoKTtcblx0XHQvLyNzdGF0ZXMgICAgPSB0aGlzLiNpbnRlcm5hbHMuc3RhdGVzO1xuXHRcdCNjb250ZW50OiBIb3N0fFNoYWRvd1Jvb3QgPSB0aGlzIGFzIEhvc3Q7XG5cblx0XHRnZXQgY29udGVudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250ZW50O1xuXHRcdH1cblxuXHRcdGdldFBhcnQobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cdFx0Z2V0UGFydHMobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cblx0XHRvdmVycmlkZSBhdHRhY2hTaGFkb3coaW5pdDogU2hhZG93Um9vdEluaXQpOiBTaGFkb3dSb290IHtcblx0XHRcdGNvbnN0IHNoYWRvdyA9IHN1cGVyLmF0dGFjaFNoYWRvdyhpbml0KTtcblxuXHRcdFx0Ly8gQHRzLWlnbm9yZSBjbG9zZWQgSVMgYXNzaWduYWJsZSB0byBzaGFkb3dNb2RlLi4uXG5cdFx0XHR0aGlzLnNoYWRvd01vZGUgPSBpbml0Lm1vZGU7XG5cblx0XHRcdHRoaXMuI2NvbnRlbnQgPSBzaGFkb3c7XG5cdFx0XHRcblx0XHRcdHJldHVybiBzaGFkb3c7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldCBoYXNTaGFkb3coKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zaGFkb3dNb2RlICE9PSAnbm9uZSc7XG5cdFx0fVxuXG5cdFx0LyoqKiBDU1MgKioqL1xuXG5cdFx0Z2V0IENTU1NlbGVjdG9yKCkge1xuXG5cdFx0XHRpZih0aGlzLmhhc1NoYWRvdyB8fCAhIHRoaXMuaGFzQXR0cmlidXRlKFwiaXNcIikgKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdOYW1lO1xuXG5cdFx0XHRyZXR1cm4gYCR7dGhpcy50YWdOYW1lfVtpcz1cIiR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJpc1wiKX1cIl1gO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IEltcGwgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Y29uc3RydWN0b3IoLi4ucGFyYW1zOiBhbnlbXSkge1xuXHRcdFx0c3VwZXIoKTtcblxuXHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX1VQR1JBREVEKTtcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfUkVBRFkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGNvbnN0IGNvbnRyb2xlciA9IF9fY3N0cl9jb250cm9sZXI7XG5cdFx0XHRfX2NzdHJfY29udHJvbGVyID0gbnVsbDtcblxuXHRcdFx0aWYoIGNvbnRyb2xlciAhPT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBjb250cm9sZXI7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdGlmKHRoaXMuY29udHJvbGVyICE9PSBudWxsKVxuXHRcdFx0XHR0aGlzLmNvbnRyb2xlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuY29udHJvbGVyIS5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGluc3RhbmNlIGRlcHNcblx0XHRcdGlmKCBjb250ZW50X2dlbmVyYXRvci5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCggYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdGF3YWl0IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gTElTU0hvc3QuQ29udHJvbGVyLm9ic2VydmVkQXR0cmlidXRlcztcblx0XHR9XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKHRoaXMuI2NvbnRyb2xlcilcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXHRcdH1cblxuXHRcdHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsID0gbnVsbDtcblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblxuXHRcdFx0Ly8gbm8gbmVlZHMgdG8gc2V0IHRoaXMuI2NvbnRlbnQgKGFscmVhZHkgaG9zdCBvciBzZXQgd2hlbiBhdHRhY2hTaGFkb3cpXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvci5nZW5lcmF0ZSh0aGlzKTtcblxuXHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXG5cdFx0XHRpZiggdGhpcy4jY29udHJvbGVyID09PSBudWxsKSB7XG5cdFx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBuZXcgTElTU0hvc3QuQ29udHJvbGVyKC4uLnRoaXMuI3BhcmFtcykgYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXHRcdFx0fVxuXG5cdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfSU5JVElBTElaRUQpO1xuXG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIodGhpcy5jb250cm9sZXIpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb250cm9sZXI7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBMSVNTSG9zdDtcbn1cblxuXG4iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPiA9IHN0cmluZ3xUfExJU1NIb3N0Q3N0cjxUPnxIVE1MRWxlbWVudDtcblxuLy8gVE9ETy4uLlxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+fGFueSkge1xuXG5cdGxldCBIb3N0OiBMSVNTSG9zdENzdHI8VD4gPSBDb21wb25lbnRDbGFzcyBhcyBhbnk7XG5cblx0Ly8gQnJ5dGhvbiBjbGFzc1xuXHRsZXQgYnJ5X2NsYXNzOiBhbnkgPSBudWxsO1xuXHRpZiggXCIkaXNfY2xhc3NcIiBpbiBDb21wb25lbnRDbGFzcyApIHtcblxuXHRcdGJyeV9jbGFzcyA9IENvbXBvbmVudENsYXNzO1xuXG5cdFx0Q29tcG9uZW50Q2xhc3MgPSBicnlfY2xhc3MuX19iYXNlc19fLmZpbHRlciggKGU6IGFueSkgPT4gZS5fX25hbWVfXyA9PT0gXCJXcmFwcGVyXCIpWzBdLl9qc19rbGFzcy4kanNfZnVuYztcblx0XHQoQ29tcG9uZW50Q2xhc3MgYXMgYW55KS5Ib3N0LkNvbnRyb2xlciA9IGNsYXNzIHtcblxuXHRcdFx0I2JyeTogYW55O1xuXG5cdFx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHRoaXMuI2JyeSA9IF9fQlJZVEhPTl9fLiRjYWxsKGJyeV9jbGFzcywgWzAsMCwwXSkoLi4uYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdCNjYWxsKG5hbWU6IHN0cmluZywgYXJnczogYW55W10pIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gX19CUllUSE9OX18uJGNhbGwoX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgbmFtZSwgWzAsMCwwXSksIFswLDAsMF0pKC4uLmFyZ3MpXG5cdFx0XHR9XG5cblx0XHRcdGdldCBob3N0KCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBfX0JSWVRIT05fXy4kZ2V0YXR0cl9wZXA2NTcodGhpcy4jYnJ5LCBcImhvc3RcIiwgWzAsMCwwXSlcblx0XHRcdH1cblxuXHRcdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGJyeV9jbGFzc1tcIm9ic2VydmVkQXR0cmlidXRlc1wiXTtcblxuXHRcdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImNvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJkaXNjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiggXCJIb3N0XCIgaW4gQ29tcG9uZW50Q2xhc3MgKVxuXHRcdEhvc3QgPSBDb21wb25lbnRDbGFzcy5Ib3N0IGFzIGFueTtcblxuICAgIGxldCBodG1sdGFnID0gdW5kZWZpbmVkO1xuICAgIGlmKCBcIkNmZ1wiIGluIEhvc3QpIHtcbiAgICAgICAgY29uc3QgQ2xhc3MgID0gSG9zdC5DZmcuaG9zdDtcbiAgICAgICAgaHRtbHRhZyAgPSBfZWxlbWVudDJ0YWduYW1lKENsYXNzKT8/dW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIEhvc3QsIG9wdHMpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnR8TElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0cnxMSVNTSG9zdDxMSVNTQ29udHJvbGVyPnxMSVNTSG9zdENzdHI8TElTU0NvbnRyb2xlcj4gKTogc3RyaW5nIHtcblxuICAgIC8vIGluc3RhbmNlXG4gICAgaWYoIFwiaG9zdFwiIGluIGVsZW1lbnQpXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lmhvc3Q7XG4gICAgaWYoIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgXG4gICAgICAgIGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLy8gY3N0clxuXG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50KVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5Ib3N0IGFzIHVua25vd24gYXMgTElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+O1xuXG4gICAgY29uc3QgbmFtZSA9IGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoIGVsZW1lbnQgKTtcbiAgICBpZihuYW1lID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IGlzIG5vdCBkZWZpbmVkIVwiKTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgaWYoIFwiSG9zdFwiIGluIGVsZW0pXG4gICAgICAgIGVsZW0gPSBlbGVtLkhvc3QgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSBhcyBhbnkpICE9PSBudWxsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3RDc3RyPFQ+PiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKGVsZW0pO1xuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pIGFzIExJU1NIb3N0Q3N0cjxUPjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBsaXN0ZW4gZGVmaW5lLi4uXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn1cblxuLypcbi8vIFRPRE86IGltcGxlbWVudFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5BbGxEZWZpbmVkKHRhZ25hbWVzOiByZWFkb25seSBzdHJpbmdbXSkgOiBQcm9taXNlPHZvaWQ+IHtcblx0YXdhaXQgUHJvbWlzZS5hbGwoIHRhZ25hbWVzLm1hcCggdCA9PiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0KSApIClcbn1cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdENzdHI8VD4+IHtcbiAgICAvLyB3ZSBjYW4ndCBmb3JjZSBhIGRlZmluZS5cbiAgICByZXR1cm4gd2hlbkRlZmluZWQoZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0clN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IExJU1NIb3N0Q3N0cjxUPiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKSB7XG5cbiAgICAgICAgbGV0IGhvc3QgPSBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSk7XG4gICAgICAgIGlmKCBob3N0ID09PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2VsZW19IG5vdCBkZWZpbmVkIHlldCFgKTtcblxuICAgICAgICByZXR1cm4gaG9zdCBhcyB1bmtub3duIGFzIExJU1NIb3N0Q3N0cjxUPjtcbiAgICB9XG5cbiAgICBpZiggXCJIb3N0XCIgaW4gZWxlbSlcbiAgICAgICAgZWxlbSA9IGVsZW0uSG9zdCBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICBpZiggY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtIGFzIGFueSkgPT09IG51bGwgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZWxlbX0gbm90IGRlZmluZWQgeWV0IWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3RDc3RyPFQ+O1xufSIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgaXNVcGdyYWRlZCwgdXBncmFkZSwgdXBncmFkZVN5bmMsIHdoZW5VcGdyYWRlZCB9IGZyb20gXCIuL1VQR1JBREVEXCI7XG5pbXBvcnQgeyBpc1JlYWR5LCB3aGVuUmVhZHkgfSBmcm9tIFwiLi9SRUFEWVwiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IExJU1NIb3N0PFQ+fEhUTUxFbGVtZW50O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggISBpc1VwZ3JhZGVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIGVsZW0uaXNJbml0aWFsaXplZDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgd2hlblVwZ3JhZGVkKGVsZW0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkIGFzIFQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb250cm9sZXI8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcbiAgICBhd2FpdCB3aGVuUmVhZHkoaG9zdCk7XG5cbiAgICAvL1RPRE86IGluaXRpYWxpemVTeW5jIHZzIGluaXRpYWxpemUgP1xuICAgIGlmKCAhIGhvc3QuaXNJbml0aWFsaXplZCApXG4gICAgICAgIHJldHVybiBob3N0LmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBob3N0LmNvbnRyb2xlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlclN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogVCB7XG4gICAgXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuICAgIGlmKCAhIGlzUmVhZHkoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRhbmNpZXMgbm90IHJlYWR5ICFcIilcblxuICAgIGlmKCAhIGhvc3QuaXNJbml0aWFsaXplZCApXG4gICAgICAgIHJldHVybiBob3N0LmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBob3N0LmNvbnRyb2xlcjtcbn1cblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemUgICAgID0gZ2V0Q29udHJvbGVyO1xuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVTeW5jID0gZ2V0Q29udHJvbGVyU3luYzsiLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRIb3N0Q3N0clN5bmMsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi9ERUZJTkVEXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPiA9IHN0cmluZ3xUfExJU1NIb3N0Q3N0cjxUPnxJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhZHk8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCAhIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICBjb25zdCBob3N0Q3N0ciA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIHJldHVybiBob3N0Q3N0ci5pc0RlcHNSZXNvbHZlZDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5SZWFkeTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3QgaG9zdENzdHIgPSBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcbiAgICBhd2FpdCBob3N0Q3N0ci53aGVuRGVwc1Jlc29sdmVkO1xuXG4gICAgcmV0dXJuIGhvc3RDc3RyLkNvbnRyb2xlciBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgLy8gd2UgY2FuJ3QgZm9yY2UgYSByZWFkeS5cbiAgICByZXR1cm4gd2hlblJlYWR5KGVsZW0pIGFzIFByb21pc2U8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJDc3RyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogVCB7XG4gICAgXG4gICAgaWYoICEgaXNSZWFkeShlbGVtKSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICByZXR1cm4gZ2V0SG9zdENzdHJTeW5jKGVsZW0pLkNvbnRyb2xlciBhcyBUO1xufSIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRIb3N0Q3N0clN5bmMsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi9ERUZJTkVEXCI7XG5cbnR5cGUgUGFyYW08X1QgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IEhUTUxFbGVtZW50O1xuXG4vL1RPRE86IHVwZ3JhZGUgZnVuY3Rpb24uLi5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVXBncmFkZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+fExJU1NIb3N0PFQ+KTogZWxlbSBpcyBMSVNTSG9zdDxUPiB7XG5cbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBIb3N0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3Q8VD4+IHtcbiAgICBcbiAgICBjb25zdCBIb3N0ID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICAvLyBhbHJlYWR5IHVwZ3JhZGVkXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIb3N0KVxuICAgICAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcblxuICAgIC8vIGg0Y2tcblxuICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG4gICAgfVxuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgXG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRIb3N0PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3Q8VD4+IHtcbiAgICBcbiAgICBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IExJU1NIb3N0PFQ+IHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCBkZWZpbmVkICFcIik7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBjb25zdCB1cGdyYWRlICAgICA9IGdldEhvc3Q7XG5leHBvcnQgY29uc3QgdXBncmFkZVN5bmMgPSBnZXRIb3N0U3luYyIsImV4cG9ydCBlbnVtIFN0YXRlcyB7XG4gICAgTElTU19ERUZJTkVEICAgICA9IFwiTElTU19ERUZJTkVEXCIsXG4gICAgTElTU19VUEdSQURFRCAgICA9IFwiTElTU19VUEdSQURFRFwiLFxuICAgIExJU1NfUkVBRFkgICAgICAgPSBcIkxJU1NfUkVBRFlcIixcbiAgICBMSVNTX0lOSVRJQUxJWkVEID0gXCJMSVNTX0lOSVRJQUxJWkVEXCJcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5cbmltcG9ydCB7U3RhdGVzfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL3N0YXRlcy50c1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgU3RhdGVzICAgICAgICAgOiB0eXBlb2YgU3RhdGVzXG5cdFx0Ly8gd2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLlN0YXRlcyA9IFN0YXRlcztcblxuXG5pbXBvcnQge2RlZmluZSwgZ2V0TmFtZSwgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCwgZ2V0SG9zdENzdHIsIGdldEhvc3RDc3RyU3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9ERUZJTkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0Z2V0SG9zdENzdHIgICAgOiB0eXBlb2YgZ2V0SG9zdENzdHI7XG5cdFx0Z2V0SG9zdENzdHJTeW5jOiB0eXBlb2YgZ2V0SG9zdENzdHJTeW5jO1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgICAgICAgICA9IGRlZmluZTtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1Mud2hlbkRlZmluZWQgICAgPSB3aGVuRGVmaW5lZDtcbkxJU1MuZ2V0SG9zdENzdHIgICAgPSBnZXRIb3N0Q3N0cjtcbkxJU1MuZ2V0SG9zdENzdHJTeW5jPSBnZXRIb3N0Q3N0clN5bmM7XG5cbi8vTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuXG5pbXBvcnQge2lzUmVhZHksIHdoZW5SZWFkeSwgZ2V0Q29udHJvbGVyQ3N0ciwgZ2V0Q29udHJvbGVyQ3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvUkVBRFlcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNSZWFkeSAgICAgIDogdHlwZW9mIGlzUmVhZHk7XG5cdFx0d2hlblJlYWR5ICAgIDogdHlwZW9mIHdoZW5SZWFkeTtcblx0XHRnZXRDb250cm9sZXJDc3RyICAgIDogdHlwZW9mIGdldENvbnRyb2xlckNzdHI7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0clN5bmM6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyU3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNSZWFkeSAgICAgICAgICAgICA9IGlzUmVhZHk7XG5MSVNTLndoZW5SZWFkeSAgICAgICAgICAgPSB3aGVuUmVhZHk7XG5MSVNTLmdldENvbnRyb2xlckNzdHIgICAgPSBnZXRDb250cm9sZXJDc3RyO1xuTElTUy5nZXRDb250cm9sZXJDc3RyU3luYz0gZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG5cblxuXG5pbXBvcnQge2lzVXBncmFkZWQsIHdoZW5VcGdyYWRlZCwgdXBncmFkZSwgdXBncmFkZVN5bmMsIGdldEhvc3QsIGdldEhvc3RTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1VQR1JBREVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzVXBncmFkZWQgIDogdHlwZW9mIGlzVXBncmFkZWQ7XG5cdFx0d2hlblVwZ3JhZGVkOiB0eXBlb2Ygd2hlblVwZ3JhZGVkO1xuXHRcdHVwZ3JhZGUgICAgIDogdHlwZW9mIHVwZ3JhZGU7XG5cdFx0dXBncmFkZVN5bmMgOiB0eXBlb2YgdXBncmFkZVN5bmM7XG5cdFx0Z2V0SG9zdCAgICAgOiB0eXBlb2YgZ2V0SG9zdDtcblx0XHRnZXRIb3N0U3luYyA6IHR5cGVvZiBnZXRIb3N0U3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNVcGdyYWRlZCAgPSBpc1VwZ3JhZGVkO1xuTElTUy53aGVuVXBncmFkZWQ9IHdoZW5VcGdyYWRlZDtcbkxJU1MudXBncmFkZSAgICAgPSB1cGdyYWRlO1xuTElTUy51cGdyYWRlU3luYyA9IHVwZ3JhZGVTeW5jO1xuTElTUy5nZXRIb3N0ICAgICA9IGdldEhvc3Q7XG5MSVNTLmdldEhvc3RTeW5jID0gZ2V0SG9zdFN5bmM7XG5cblxuaW1wb3J0IHtpc0luaXRpYWxpemVkLCB3aGVuSW5pdGlhbGl6ZWQsIGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jLCBnZXRDb250cm9sZXIsIGdldENvbnRyb2xlclN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNJbml0aWFsaXplZCAgICA6IHR5cGVvZiBpc0luaXRpYWxpemVkO1xuXHRcdHdoZW5Jbml0aWFsaXplZCAgOiB0eXBlb2Ygd2hlbkluaXRpYWxpemVkO1xuXHRcdGluaXRpYWxpemUgICAgICAgOiB0eXBlb2YgaW5pdGlhbGl6ZTtcblx0XHRpbml0aWFsaXplU3luYyAgIDogdHlwZW9mIGluaXRpYWxpemVTeW5jO1xuXHRcdGdldENvbnRyb2xlciAgICAgOiB0eXBlb2YgZ2V0Q29udHJvbGVyO1xuXHRcdGdldENvbnRyb2xlclN5bmMgOiB0eXBlb2YgZ2V0Q29udHJvbGVyU3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNJbml0aWFsaXplZCAgICA9IGlzSW5pdGlhbGl6ZWQ7XG5MSVNTLndoZW5Jbml0aWFsaXplZCAgPSB3aGVuSW5pdGlhbGl6ZWQ7XG5MSVNTLmluaXRpYWxpemUgICAgICAgPSBpbml0aWFsaXplO1xuTElTUy5pbml0aWFsaXplU3luYyAgID0gaW5pdGlhbGl6ZVN5bmM7XG5MSVNTLmdldENvbnRyb2xlciAgICAgPSBnZXRDb250cm9sZXI7XG5MSVNTLmdldENvbnRyb2xlclN5bmMgPSBnZXRDb250cm9sZXJTeW5jOyIsImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge0xJU1MgYXMgX0xJU1N9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuXG4vLyB1c2VkIGZvciBwbHVnaW5zLlxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbi8vIGV4dGVuZHMgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgIE9wdHMgZXh0ZW5kcyBMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj5cbiAgICA+KG9wdHM6IHtleHRlbmRzOiBFeHRlbmRzQ3N0cn0gJiBQYXJ0aWFsPE9wdHM+KTogUmV0dXJuVHlwZTx0eXBlb2YgX2V4dGVuZHM8RXh0ZW5kc0NzdHIsIE9wdHM+PlxuLy8gTElTU0NvbnRyb2xlciBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICA+KG9wdHM/OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+KTogTElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+XG5leHBvcnQgZnVuY3Rpb24gTElTUyhvcHRzOiBhbnkgPSB7fSk6IExJU1NDb250cm9sZXJDc3RyXG57XG4gICAgaWYoIG9wdHMuZXh0ZW5kcyAhPT0gdW5kZWZpbmVkICYmIFwiSG9zdFwiIGluIG9wdHMuZXh0ZW5kcyApIC8vIHdlIGFzc3VtZSB0aGlzIGlzIGEgTElTU0NvbnRyb2xlckNzdHJcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKG9wdHMpO1xuXG4gICAgcmV0dXJuIF9MSVNTKG9wdHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2V4dGVuZHM8XG4gICAgICAgIEV4dGVuZHNDc3RyIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsXG4gICAgICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgICAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPikge1xuXG4gICAgaWYoIG9wdHMuZXh0ZW5kcyA9PT0gdW5kZWZpbmVkKSAvLyBoNGNrXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYSBMSVNTQ29udHJvbGVyIScpO1xuXG4gICAgY29uc3QgY2ZnID0gb3B0cy5leHRlbmRzLkhvc3QuQ2ZnO1xuICAgIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBjZmcsIGNmZy5hcmdzLCBvcHRzKTtcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyEge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgfVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBvdmVycmlkZSBfSG9zdDogTElTU0hvc3Q8RXh0ZW5kZWRMSVNTPjtcblxuICAgICAgICAvLyBUUyBpcyBzdHVwaWQsIHJlcXVpcmVzIGV4cGxpY2l0IHJldHVybiB0eXBlXG5cdFx0c3RhdGljIG92ZXJyaWRlIGdldCBIb3N0KCk6IExJU1NIb3N0PEV4dGVuZGVkTElTUz4ge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIGZ1Y2sgb2ZmXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5ob3N0ISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbnRlbnRfZ2VuZXJhdG9yISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG4gICAgfVxuXG4gICAgcmV0dXJuIEV4dGVuZGVkTElTUztcbn0iLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciwgTEhvc3QsIExJU1NDb250cm9sZXJDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9ERUZJTkVEXCI7XG5cbmV4cG9ydCBjb25zdCBLbm93blRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxubGV0IHNjcmlwdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdzY3JpcHRbYXV0b2Rpcl0nKTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ0RJUiA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdhdXRvZGlyJykgPz8gbnVsbDtcblxuaWYoc2NyaXB0ICE9PSBudWxsKVxuXHRhdXRvbG9hZChzY3JpcHQpXG5cblxuZnVuY3Rpb24gYXV0b2xvYWQoc2NyaXB0OiBIVE1MRWxlbWVudCkge1xuXG5cdGxldCBjZGlyOiBudWxsfHN0cmluZyA9IERFRkFVTFRfQ0RJUjtcblxuXHRjb25zdCBTVzogUHJvbWlzZTx2b2lkPiA9IG5ldyBQcm9taXNlKCBhc3luYyAocmVzb2x2ZSkgPT4ge1xuXG5cdFx0Y29uc3Qgc3dfcGF0aCA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ3N3Jyk7XG5cblx0XHRpZiggc3dfcGF0aCA9PT0gbnVsbCApIHtcblx0XHRcdGNvbnNvbGUud2FybihcIllvdSBhcmUgdXNpbmcgTElTUyBBdXRvIG1vZGUgd2l0aG91dCBzdy5qcy5cIik7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdHRyeSB7XG5cdFx0XHRhd2FpdCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3Rlcihzd19wYXRoLCB7c2NvcGU6IFwiL1wifSk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJSZWdpc3RyYXRpb24gb2YgU2VydmljZVdvcmtlciBmYWlsZWRcIik7XG5cdFx0XHRjb25zb2xlLmVycm9yKGUpO1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH1cblxuXHRcdGlmKCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICkge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGNkaXIgPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdhdXRvZGlyJykhO1xuXG5cdGlmKCBjZGlyW2NkaXIubGVuZ3RoLTFdICE9PSAnLycpXG5cdFx0Y2RpciArPSAnLyc7XG5cblx0Y29uc3QgYnJ5dGhvbiA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJicnl0aG9uXCIpO1xuXG5cdC8vIG9ic2VydmUgZm9yIG5ldyBpbmplY3RlZCB0YWdzLlxuXHRuZXcgTXV0YXRpb25PYnNlcnZlciggKG11dGF0aW9ucykgPT4ge1xuXHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdFx0XHRcdGFkZFRhZyhhZGRpdGlvbilcblxuXHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqXCIpIClcblx0XHRhZGRUYWcoIGVsZW0gKTtcblxuXHRhc3luYyBmdW5jdGlvbiBhZGRUYWcodGFnOiBIVE1MRWxlbWVudCkge1xuXG5cdFx0YXdhaXQgU1c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cblx0XHRjb25zdCB0YWduYW1lID0gKCB0YWcuZ2V0QXR0cmlidXRlKCdpcycpID8/IHRhZy50YWdOYW1lICkudG9Mb3dlckNhc2UoKTtcblxuXHRcdGxldCBob3N0ID0gSFRNTEVsZW1lbnQ7XG5cdFx0aWYoIHRhZy5oYXNBdHRyaWJ1dGUoJ2lzJykgKVxuXHRcdFx0aG9zdCA9IHRhZy5jb25zdHJ1Y3RvciBhcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cblxuXHRcdGlmKCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCBLbm93blRhZ3MuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdGJyeXRob24sXG5cdFx0XHRjZGlyLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1x0XHRcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZTogc3RyaW5nLCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55Piwgb3B0czoge2h0bWw6IHN0cmluZywgY3NzOiBzdHJpbmcsIGhvc3Q6IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pn0pIHtcblxuXHRjb25zdCBjX2pzICAgICAgPSBmaWxlc1tcImluZGV4LmpzXCJdO1xuXHRvcHRzLmh0bWwgICAgID8/PSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cblx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdGlmKCBjX2pzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NfanNdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcblx0XHRjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuXHRcdGNvbnN0IG9sZHJlcSA9IExJU1MucmVxdWlyZTtcblxuXHRcdExJU1MucmVxdWlyZSA9IGZ1bmN0aW9uKHVybDogVVJMfHN0cmluZykge1xuXG5cdFx0XHRpZiggdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiAmJiB1cmwuc3RhcnRzV2l0aCgnLi8nKSApIHtcblx0XHRcdFx0Y29uc3QgZmlsZW5hbWUgPSB1cmwuc2xpY2UoMik7XG5cdFx0XHRcdGlmKCBmaWxlbmFtZSBpbiBmaWxlcylcblx0XHRcdFx0XHRyZXR1cm4gZmlsZXNbZmlsZW5hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb2xkcmVxKHVybCk7XG5cdFx0fVxuXG5cdFx0a2xhc3MgPSAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJsKSkuZGVmYXVsdDtcblxuXHRcdExJU1MucmVxdWlyZSA9IG9sZHJlcTtcblx0fVxuXHRlbHNlIGlmKCBvcHRzLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGtsYXNzID0gTElTUyh7XG5cdFx0XHQuLi5vcHRzLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3Jcblx0XHR9KTtcblx0fVxuXG5cdGlmKCBrbGFzcyA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGZpbGVzIGZvciBXZWJDb21wb25lbnQgJHt0YWduYW1lfS5gKTtcblxuXHRkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXG5cdHJldHVybiBrbGFzcztcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBpbnRlcm5hbCB0b29scyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2ZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdGNvbnN0IG9wdGlvbnMgPSBpc0xpc3NBdXRvXG5cdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHQ6IHt9O1xuXG5cblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuXHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRpZiggaXNMaXNzQXV0byAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0Y29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG5cdGlmKGFuc3dlciA9PT0gXCJcIilcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhbnN3ZXJcbn1cbmFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdC8vIHRlc3QgZm9yIHRoZSBtb2R1bGUgZXhpc3RhbmNlLlxuXHRpZihpc0xpc3NBdXRvICYmIGF3YWl0IF9mZXRjaFRleHQodXJpLCBpc0xpc3NBdXRvKSA9PT0gdW5kZWZpbmVkIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmkpKS5kZWZhdWx0O1xuXHR9IGNhdGNoKGUpIHtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59XG5cblxuY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlSFRNTCh0ZXh0OiBzdHJpbmcpIHtcblx0Y29udmVydGVyLnRleHRDb250ZW50ID0gdGV4dDtcblx0cmV0dXJuIGNvbnZlcnRlci5pbm5lckhUTUw7XG59XG5cbmV4cG9ydCBjbGFzcyBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yIGV4dGVuZHMgQ29udGVudEdlbmVyYXRvciB7XG5cblx0cHJvdGVjdGVkIG92ZXJyaWRlIHByZXBhcmVIVE1MKGh0bWw/OiBEb2N1bWVudEZyYWdtZW50IHwgSFRNTEVsZW1lbnQgfCBzdHJpbmcpIHtcblx0XHRcblx0XHR0aGlzLmRhdGEgPSBudWxsO1xuXG5cdFx0aWYoIHR5cGVvZiBodG1sID09PSAnc3RyaW5nJyApIHtcblxuXHRcdFx0dGhpcy5kYXRhID0gaHRtbDtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0Lypcblx0XHRcdGh0bWwgPSBodG1sLnJlcGxhY2VBbGwoL1xcJFxceyhbXFx3XSspXFx9L2csIChfLCBuYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0cmV0dXJuIGA8bGlzcyB2YWx1ZT1cIiR7bmFtZX1cIj48L2xpc3M+YDtcblx0XHRcdH0pOyovXG5cblx0XHRcdC8vVE9ETzogJHt9IGluIGF0dHJcblx0XHRcdFx0Ly8gLSBkZXRlY3Qgc3RhcnQgJHsgKyBlbmQgfVxuXHRcdFx0XHQvLyAtIHJlZ2lzdGVyIGVsZW0gKyBhdHRyIG5hbWVcblx0XHRcdFx0Ly8gLSByZXBsYWNlLiBcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHN1cGVyLnByZXBhcmVIVE1MKGh0bWwpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZmlsbENvbnRlbnQoc2hhZG93OiBTaGFkb3dSb290KSB7XG5cdFx0XG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdGlmKCB0aGlzLmRhdGEgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHN0ciA9ICh0aGlzLmRhdGEgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IGVuY29kZUhUTUwoc2hhZG93Lmhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdHN1cGVyLmZpbGxDb250ZW50KHNoYWRvdyk7XG5cblx0XHQvKlxuXHRcdC8vIGh0bWwgbWFnaWMgdmFsdWVzIGNvdWxkIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdH1cblxuXHRvdmVycmlkZSBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudCB8IFNoYWRvd1Jvb3Qge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKGhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbnRlbnQgPSBzdXBlci5nZW5lcmF0ZShob3N0KTtcblxuXHRcdC8qXG5cdFx0Ly8gaHRtbCBtYWdpYyB2YWx1ZXMuXG5cdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdFx0Ly8gY3NzIHByb3AuXG5cdFx0Y29uc3QgY3NzX2F0dHJzID0gaG9zdC5nZXRBdHRyaWJ1dGVOYW1lcygpLmZpbHRlciggZSA9PiBlLnN0YXJ0c1dpdGgoJ2Nzcy0nKSk7XG5cdFx0Zm9yKGxldCBjc3NfYXR0ciBvZiBjc3NfYXR0cnMpXG5cdFx0XHRob3N0LnN0eWxlLnNldFByb3BlcnR5KGAtLSR7Y3NzX2F0dHIuc2xpY2UoJ2Nzcy0nLmxlbmd0aCl9YCwgaG9zdC5nZXRBdHRyaWJ1dGUoY3NzX2F0dHIpKTtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBpbXBvcnRDb21wb25lbnRzIDogdHlwZW9mIGltcG9ydENvbXBvbmVudHM7XG4gICAgICAgIGltcG9ydENvbXBvbmVudCAgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50O1xuICAgICAgICByZXF1aXJlICAgICAgICAgIDogdHlwZW9mIHJlcXVpcmU7XG4gICAgfVxufVxuXG50eXBlIGltcG9ydENvbXBvbmVudHNfT3B0czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGwsXG5cdGJyeXRob24/OiBzdHJpbmd8bnVsbCxcblx0aG9zdCAgID86IENvbnN0cnVjdG9yPFQ+XG59O1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0XHRcdFx0XHRcdGNvbXBvbmVudHM6IHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdFx0XHRcdFx0XHRicnl0aG9uID0gbnVsbCxcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnRcblx0XHRcdFx0XHRcdH06IGltcG9ydENvbXBvbmVudHNfT3B0czxUPikge1xuXG5cdGNvbnN0IHJlc3VsdHM6IFJlY29yZDxzdHJpbmcsIExJU1NDb250cm9sZXJDc3RyPiA9IHt9O1xuXG5cdGZvcihsZXQgdGFnbmFtZSBvZiBjb21wb25lbnRzKSB7XG5cblx0XHRyZXN1bHRzW3RhZ25hbWVdID0gYXdhaXQgaW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdGNkaXIsXG5cdFx0XHRicnl0aG9uLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmNvbnN0IGJyeV93cmFwcGVyID0gYGZyb20gYnJvd3NlciBpbXBvcnQgc2VsZlxuXG5kZWYgd3JhcGpzKGpzX2tsYXNzKTpcblxuXHRjbGFzcyBXcmFwcGVyOlxuXG5cdFx0X2pzX2tsYXNzID0ganNfa2xhc3Ncblx0XHRfanMgPSBOb25lXG5cblx0XHRkZWYgX19pbml0X18odGhpcywgKmFyZ3MpOlxuXHRcdFx0dGhpcy5fanMgPSBqc19rbGFzcy5uZXcoKmFyZ3MpXG5cblx0XHRkZWYgX19nZXRhdHRyX18odGhpcywgbmFtZTogc3RyKTpcblx0XHRcdHJldHVybiB0aGlzLl9qc1tuYW1lXTtcblxuXHRcdGRlZiBfX3NldGF0dHJfXyh0aGlzLCBuYW1lOiBzdHIsIHZhbHVlKTpcblx0XHRcdGlmIG5hbWUgPT0gXCJfanNcIjpcblx0XHRcdFx0c3VwZXIoKS5fX3NldGF0dHJfXyhuYW1lLCB2YWx1ZSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR0aGlzLl9qc1tuYW1lXSA9IHZhbHVlXG5cdFxuXHRyZXR1cm4gV3JhcHBlclxuXG5zZWxmLndyYXBqcyA9IHdyYXBqc1xuYDtcblxuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdGJyeXRob24gPSBudWxsLFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnQsXG5cdFx0ZmlsZXMgICA9IG51bGxcblx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+ICYge2ZpbGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPnxudWxsfSA9IHt9XG4pIHtcblxuXHRLbm93blRhZ3MuYWRkKHRhZ25hbWUpO1xuXG5cdGNvbnN0IGNvbXBvX2RpciA9IGAke2NkaXJ9JHt0YWduYW1lfS9gO1xuXG5cdGlmKCBmaWxlcyA9PT0gbnVsbCApIHtcblx0XHRmaWxlcyA9IHt9O1xuXG5cdFx0Y29uc3QgZmlsZSA9IGJyeXRob24gPT09IFwidHJ1ZVwiID8gJ2luZGV4LmJyeScgOiAnaW5kZXguanMnO1xuXG5cdFx0ZmlsZXNbZmlsZV0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9JHtmaWxlfWAsIHRydWUpKSE7XG5cblx0XHQvL1RPRE8hISFcblx0XHR0cnkge1xuXHRcdFx0ZmlsZXNbXCJpbmRleC5odG1sXCJdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4Lmh0bWxgLCB0cnVlKSkhO1xuXHRcdH0gY2F0Y2goZSkge1xuXG5cdFx0fVxuXHRcdHRyeSB7XG5cdFx0XHRmaWxlc1tcImluZGV4LmNzc1wiIF0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguY3NzYCAsIHRydWUpKSE7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHRpZiggYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgJiYgZmlsZXNbJ2luZGV4LmJyeSddICE9PSB1bmRlZmluZWQpIHtcblxuXHRcdGNvbnN0IGNvZGUgPSBmaWxlc1tcImluZGV4LmJyeVwiXTtcblxuXHRcdGZpbGVzWydpbmRleC5qcyddID1cbmBjb25zdCAkQiA9IGdsb2JhbFRoaXMuX19CUllUSE9OX187XG5cbiRCLnJ1blB5dGhvblNvdXJjZShcXGAke2JyeV93cmFwcGVyfVxcYCwgXCJfXCIpO1xuJEIucnVuUHl0aG9uU291cmNlKFxcYCR7Y29kZX1cXGAsIFwiX1wiKTtcblxuY29uc3QgbW9kdWxlID0gJEIuaW1wb3J0ZWRbXCJfXCJdO1xuZXhwb3J0IGRlZmF1bHQgbW9kdWxlLldlYkNvbXBvbmVudDtcblxuYDtcblx0fVxuXG5cdGNvbnN0IGh0bWwgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cdGNvbnN0IGNzcyAgPSBmaWxlc1tcImluZGV4LmNzc1wiXTtcblxuXHRyZXR1cm4gYXdhaXQgZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWUsIGZpbGVzLCB7aHRtbCwgY3NzLCBob3N0fSk7XG59XG5cbmZ1bmN0aW9uIHJlcXVpcmUodXJsOiBVUkx8c3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT58c3RyaW5nIHtcblx0cmV0dXJuIGZldGNoKHVybCk7XG59XG5cblxuTElTUy5pbXBvcnRDb21wb25lbnRzID0gaW1wb3J0Q29tcG9uZW50cztcbkxJU1MuaW1wb3J0Q29tcG9uZW50ICA9IGltcG9ydENvbXBvbmVudDtcbkxJU1MucmVxdWlyZSAgPSByZXF1aXJlOyIsImltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9JTklUSUFMSVpFRFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oZWxlbSk7XG59IiwiXG5pbXBvcnQgeyBDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG50eXBlIExpc3RlbmVyRmN0PFQgZXh0ZW5kcyBFdmVudD4gPSAoZXY6IFQpID0+IHZvaWQ7XG50eXBlIExpc3RlbmVyT2JqPFQgZXh0ZW5kcyBFdmVudD4gPSB7IGhhbmRsZUV2ZW50OiBMaXN0ZW5lckZjdDxUPiB9O1xudHlwZSBMaXN0ZW5lcjxUIGV4dGVuZHMgRXZlbnQ+ID0gTGlzdGVuZXJGY3Q8VD58TGlzdGVuZXJPYmo8VD47XG5cbmV4cG9ydCBjbGFzcyBFdmVudFRhcmdldDI8RXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgRXZlbnQ+PiBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcblxuXHRvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgY2FsbGJhY2s6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIG9wdGlvbnM/OiBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyB8IGJvb2xlYW4pOiB2b2lkIHtcblx0XHRcblx0XHQvL0B0cy1pZ25vcmVcblx0XHRyZXR1cm4gc3VwZXIuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cdH1cblxuXHRvdmVycmlkZSBkaXNwYXRjaEV2ZW50PFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KGV2ZW50OiBFdmVudHNbVF0pOiBib29sZWFuIHtcblx0XHRyZXR1cm4gc3VwZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH1cblxuXHRvdmVycmlkZSByZW1vdmVFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IGxpc3RlbmVyOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgb3B0aW9ucz86IGJvb2xlYW58QWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkIHtcblxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHN1cGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21FdmVudDI8VCBleHRlbmRzIHN0cmluZywgQXJncz4gZXh0ZW5kcyBDdXN0b21FdmVudDxBcmdzPiB7XG5cblx0Y29uc3RydWN0b3IodHlwZTogVCwgYXJnczogQXJncykge1xuXHRcdHN1cGVyKHR5cGUsIHtkZXRhaWw6IGFyZ3N9KTtcblx0fVxuXG5cdG92ZXJyaWRlIGdldCB0eXBlKCk6IFQgeyByZXR1cm4gc3VwZXIudHlwZSBhcyBUOyB9XG59XG5cbnR5cGUgSW5zdGFuY2VzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+PiA9IHtcblx0W0sgaW4ga2V5b2YgVF06IEluc3RhbmNlVHlwZTxUW0tdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gV2l0aEV2ZW50czxUIGV4dGVuZHMgb2JqZWN0LCBFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+ID4oZXY6IENvbnN0cnVjdG9yPFQ+LCBfZXZlbnRzOiBFdmVudHMpIHtcblxuXHR0eXBlIEV2dHMgPSBJbnN0YW5jZXM8RXZlbnRzPjtcblxuXHRpZiggISAoZXYgaW5zdGFuY2VvZiBFdmVudFRhcmdldCkgKVxuXHRcdHJldHVybiBldiBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG5cblx0Ly8gaXMgYWxzbyBhIG1peGluXG5cdC8vIEB0cy1pZ25vcmVcblx0Y2xhc3MgRXZlbnRUYXJnZXRNaXhpbnMgZXh0ZW5kcyBldiB7XG5cblx0XHQjZXYgPSBuZXcgRXZlbnRUYXJnZXQyPEV2dHM+KCk7XG5cblx0XHRhZGRFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5hZGRFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRyZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5yZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRkaXNwYXRjaEV2ZW50KC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5kaXNwYXRjaEV2ZW50KC4uLmFyZ3MpO1xuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIEV2ZW50VGFyZ2V0TWl4aW5zIGFzIHVua25vd24gYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIFNoYWRvd1Jvb3QgdG9vbHMgPT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50TWF0Y2hlcyhldjogRXZlbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcblxuXHRsZXQgZWxlbWVudHMgPSBldi5jb21wb3NlZFBhdGgoKS5zbGljZSgwLC0yKS5maWx0ZXIoZSA9PiAhIChlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgKS5yZXZlcnNlKCkgYXMgSFRNTEVsZW1lbnRbXTtcblxuXHRmb3IobGV0IGVsZW0gb2YgZWxlbWVudHMgKVxuXHRcdGlmKGVsZW0ubWF0Y2hlcyhzZWxlY3RvcikgKVxuXHRcdFx0cmV0dXJuIGVsZW07IFxuXG5cdHJldHVybiBudWxsO1xufSIsIlxuaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50cyB7fTtcblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmltcG9ydCB7IGluaXRpYWxpemVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgLy8gYXN5bmNcbiAgICAgICAgcXMgOiB0eXBlb2YgcXM7XG4gICAgICAgIHFzbzogdHlwZW9mIHFzbztcbiAgICAgICAgcXNhOiB0eXBlb2YgcXNhO1xuICAgICAgICBxc2M6IHR5cGVvZiBxc2M7XG5cbiAgICAgICAgLy8gc3luY1xuICAgICAgICBxc1N5bmMgOiB0eXBlb2YgcXNTeW5jO1xuICAgICAgICBxc2FTeW5jOiB0eXBlb2YgcXNhU3luYztcbiAgICAgICAgcXNjU3luYzogdHlwZW9mIHFzY1N5bmM7XG5cblx0XHRjbG9zZXN0OiB0eXBlb2YgY2xvc2VzdDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3Nfc2VsZWN0b3IobmFtZT86IHN0cmluZykge1xuXHRpZihuYW1lID09PSB1bmRlZmluZWQpIC8vIGp1c3QgYW4gaDRja1xuXHRcdHJldHVybiBcIlwiO1xuXHRyZXR1cm4gYDppcygke25hbWV9LCBbaXM9XCIke25hbWV9XCJdKWA7XG59XG5cbmZ1bmN0aW9uIF9idWlsZFFTKHNlbGVjdG9yOiBzdHJpbmcsIHRhZ25hbWVfb3JfcGFyZW50Pzogc3RyaW5nIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LCBwYXJlbnQ6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cdFxuXHRpZiggdGFnbmFtZV9vcl9wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGFnbmFtZV9vcl9wYXJlbnQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cGFyZW50ID0gdGFnbmFtZV9vcl9wYXJlbnQ7XG5cdFx0dGFnbmFtZV9vcl9wYXJlbnQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRyZXR1cm4gW2Ake3NlbGVjdG9yfSR7bGlzc19zZWxlY3Rvcih0YWduYW1lX29yX3BhcmVudCBhcyBzdHJpbmd8dW5kZWZpbmVkKX1gLCBwYXJlbnRdIGFzIGNvbnN0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGxldCByZXN1bHQgPSBhd2FpdCBxc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFRbXT47XG5hc3luYyBmdW5jdGlvbiBxc2E8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl1bXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPFQ+PiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRwcm9taXNlc1tpZHgrK10gPSB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4ocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPihyZXN1bHQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2xvc2VzdDxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCkge1xuXG5cdHdoaWxlKHRydWUpIHtcblx0XHR2YXIgcmVzdWx0ID0gZWxlbWVudC5jbG9zZXN0PEU+KHNlbGVjdG9yKTtcblxuXHRcdGlmKCByZXN1bHQgIT09IG51bGwpXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcblx0XHRpZiggISAoXCJob3N0XCIgaW4gcm9vdCkgKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRlbGVtZW50ID0gKHJvb3QgYXMgU2hhZG93Um9vdCkuaG9zdDtcblx0fVxufVxuXG5cbi8vIGFzeW5jXG5MSVNTLnFzICA9IHFzO1xuTElTUy5xc28gPSBxc287XG5MSVNTLnFzYSA9IHFzYTtcbkxJU1MucXNjID0gcXNjO1xuXG4vLyBzeW5jXG5MSVNTLnFzU3luYyAgPSBxc1N5bmM7XG5MSVNTLnFzYVN5bmMgPSBxc2FTeW5jO1xuTElTUy5xc2NTeW5jID0gcXNjU3luYztcblxuTElTUy5jbG9zZXN0ID0gY2xvc2VzdDsiLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbmltcG9ydCBcIi4vY29yZS9MaWZlQ3ljbGVcIjtcblxuZXhwb3J0IHtkZWZhdWx0IGFzIENvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLy9UT0RPOiBldmVudHMudHNcbi8vVE9ETzogZ2xvYmFsQ1NTUnVsZXNcbmV4cG9ydCB7TElTU0F1dG9fQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vaGVscGVycy9MSVNTQXV0b1wiO1xuaW1wb3J0IFwiLi9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzXCI7XG5cbmV4cG9ydCB7U2hhZG93Q2ZnfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQge2xpc3MsIGxpc3NTeW5jfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5leHBvcnQge2V2ZW50TWF0Y2hlcywgV2l0aEV2ZW50cywgRXZlbnRUYXJnZXQyLCBDdXN0b21FdmVudDJ9IGZyb20gJy4vaGVscGVycy9ldmVudHMnO1xuZXhwb3J0IHtodG1sfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUztcblxuLy8gZm9yIGRlYnVnLlxuZXhwb3J0IHtfZXh0ZW5kc30gZnJvbSBcIi4vZXh0ZW5kc1wiOyIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJ1xufTtcblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0ge1xuICAgICAgICBleHRlbmRzOiBFeHRlbmRzQ3RyLCAvLyBKUyBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLCAgIC8vIEhUTUwgSG9zdFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG59ICYgQ29udGVudEdlbmVyYXRvcl9PcHRzO1xuXG4vL1RPRE86IHJld3JpdGUuLi5cbi8vIExJU1NDb250cm9sZXJcblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlckNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IEluc3RhbmNlVHlwZTxMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gVCBleHRlbmRzIExJU1NDb250cm9sZXI8XG4gICAgICAgICAgICBpbmZlciBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgICAgICA+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLEhvc3RDc3RyPiA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NDb250cm9sZXIgPyBMSVNTQ29udHJvbGVyMkxJU1NDb250cm9sZXJDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyID0gTElTU0NvbnRyb2xlcj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjtcblxuLy8gbGlnaHRlciBMSVNTSG9zdCBkZWYgdG8gYXZvaWQgdHlwZSBpc3N1ZXMuLi5cbmV4cG9ydCB0eXBlIExIb3N0PEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA9IHtcblxuICAgIGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgQ1NTU2VsZWN0b3I6IHN0cmluZztcblxufSAmIEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbmV4cG9ydCB0eXBlIExIb3N0Q3N0cjxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG4gICAgbmV3KC4uLmFyZ3M6IGFueSk6IExIb3N0PEhvc3RDc3RyPjtcblxuICAgIENmZzoge1xuICAgICAgICBob3N0ICAgICAgICAgICAgIDogSG9zdENzdHIsXG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbiAgICAgICAgYXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuICAgIH1cblxufSAmIEhvc3RDc3RyOyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGlmKCBDbGFzcyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBDbGFzcyA9IENsYXNzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBIVE1MRWxlbWVudDtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblxuICAgIGxldCBjdXJzb3IgPSBDbGFzcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2hpbGUgKGN1cnNvci5fX3Byb3RvX18gIT09IEhUTUxFbGVtZW50KVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5fX3Byb3RvX187XG5cbiAgICAvLyBkaXJlY3RseSBpbmhlcml0IEhUTUxFbGVtZW50XG4gICAgaWYoICEgY3Vyc29yLm5hbWUuc3RhcnRzV2l0aCgnSFRNTCcpICYmICEgY3Vyc29yLm5hbWUuZW5kc1dpdGgoJ0VsZW1lbnQnKSApXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaHRtbHRhZyA9IGN1cnNvci5uYW1lLnNsaWNlKDQsIC03KTtcblxuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG4vKlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG4qL1xuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCJpbXBvcnQgdGVtcGxhdGUsIHsgSFRNTCB9IGZyb20gXCJWMy91dGlscy9wYXJzZXJzL3RlbXBsYXRlXCI7XG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgZW5jb2RlSFRNTCBmcm9tIFwiVjMvdXRpbHMvZW5jb2RlXCI7XG5cbmNvbnN0IHJlZ2V4ID0gL1xcJFxceyguKz8pXFx9L2c7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9Db250ZW50R2VuZXJhdG9yIGV4dGVuZHMgQ29udGVudEdlbmVyYXRvciB7XG5cbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcGFyZVRlbXBsYXRlKGh0bWw6IEhUTUwpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XG5cbiAgICAgICAgaWYoIHR5cGVvZiBodG1sID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGh0bWw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZUFsbCgvXFwkXFx7KFtcXHddKylcXH0vZywgKF8sIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBgPGxpc3MgdmFsdWU9XCIke25hbWV9XCI+PC9saXNzPmA7XG4gICAgICAgICAgICB9KTsqL1xuXG4gICAgICAgICAgICAvL1RPRE86ICR7fSBpbiBhdHRyXG4gICAgICAgICAgICAgICAgLy8gLSBkZXRlY3Qgc3RhcnQgJHsgKyBlbmQgfVxuICAgICAgICAgICAgICAgIC8vIC0gcmVnaXN0ZXIgZWxlbSArIGF0dHIgbmFtZVxuICAgICAgICAgICAgICAgIC8vIC0gcmVwbGFjZS4gXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN1cGVyLnByZXBhcmVUZW1wbGF0ZShodG1sKTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSBmaWxsQ29udGVudChzaGFkb3c6IFNoYWRvd1Jvb3QpIHtcbiAgICAgICAgXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcbiAgICAgICAgaWYoIHRoaXMuZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gKHRoaXMuZGF0YSBhcyBzdHJpbmcpLnJlcGxhY2UocmVnZXgsIChfLCBtYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2hhZG93Lmhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKTtcbiAgICAgICAgICAgICAgICBpZiggdmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJzsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZUhUTUwodmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN1cGVyLnByZXBhcmVUZW1wbGF0ZShzdHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIuZmlsbENvbnRlbnQoc2hhZG93KTtcblxuICAgICAgICAvKlxuICAgICAgICAvLyBodG1sIG1hZ2ljIHZhbHVlcyBjb3VsZCBiZSBvcHRpbWl6ZWQuLi5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuICAgICAgICBmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcbiAgICAgICAgICAgIHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcbiAgICAgICAgKi9cbiAgICB9XG59IiwiaW1wb3J0IHsgaXNSZXNzb3VyY2VSZWFkeSwgUmVzc291cmNlLCB3YWl0UmVzc291cmNlIH0gZnJvbSBcIlYzL3V0aWxzL25ldHdvcmsvcmVzc291cmNlXCI7XG5pbXBvcnQgeyBTaGFkb3dDZmcgfSBmcm9tIFwiVjIvdHlwZXNcIjtcbmltcG9ydCB7IGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiVjIvdXRpbHNcIjtcbmltcG9ydCB0ZW1wbGF0ZSwgeyBIVE1MIH0gZnJvbSBcIlYzL3V0aWxzL3BhcnNlcnMvdGVtcGxhdGVcIjtcbmltcG9ydCBzdHlsZSAgICwge0NTU30gICAgZnJvbSBcIlYzL3V0aWxzL3BhcnNlcnMvc3R5bGVcIjtcblxudHlwZSBTVFlMRSA9IENTUyB8IHJlYWRvbmx5IENTU1tdO1xuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7XG4gICAgaHRtbCAgID86IFJlc3NvdXJjZTxIVE1MPixcbiAgICBjc3MgICAgPzogUmVzc291cmNlPFNUWUxFPixcbiAgICBzaGFkb3cgPzogU2hhZG93Q2ZnfG51bGxcbn1cblxuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbi8vY29uc3Qgc2hhcmVkQ1NTID0gZ2V0U2hhcmVkQ1NTKCk7IC8vIGZyb20gTElTU0hvc3QuLi5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudEdlbmVyYXRvciB7XG5cbiAgICBwcm90ZWN0ZWQgZGF0YTogYW55O1xuXG4gICAgI3NoYWRvdyAgICAgOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgaHRtbCxcbiAgICAgICAgY3NzICAgID0gW10sXG4gICAgICAgIHNoYWRvdyA9IG51bGwsXG4gICAgfTogQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge30pIHtcblxuICAgICAgICB0aGlzLiNzaGFkb3cgICA9IHNoYWRvdztcblxuICAgICAgICBjb25zdCBpc1JlYWR5ID0gaXNSZXNzb3VyY2VSZWFkeTxIVE1MPiAoaHRtbClcbiAgICAgICAgICAgICAgICAgICAgICYmIGlzUmVzc291cmNlUmVhZHk8U1RZTEU+KGNzcylcbiAgICAgICAgICAgICAgICAgICAgICYmIGlzRE9NQ29udGVudExvYWRlZCgpO1xuXG4gICAgICAgIGlmKCBpc1JlYWR5IClcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZShodG1sLCBjc3MpO1xuXG4gICAgICAgIGNvbnN0IHdoZW5SZWFkeTogUHJvbWlzZTxbSFRNTHx1bmRlZmluZWQsIFNUWUxFfHVuZGVmaW5lZCwgdW5rbm93bl0+ID0gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgd2FpdFJlc3NvdXJjZTxIVE1MIHx1bmRlZmluZWQ+KGh0bWwpLFxuICAgICAgICAgICAgd2FpdFJlc3NvdXJjZTxTVFlMRXx1bmRlZmluZWQ+KGNzcyksXG4gICAgICAgICAgICB3aGVuRE9NQ29udGVudExvYWRlZCgpXG4gICAgICAgIF0pO1xuXG4gICAgICAgIHdoZW5SZWFkeS50aGVuKCAoYXJncykgPT4gdGhpcy5wcmVwYXJlKGFyZ3NbMF0sIGFyZ3NbMV0pICk7XG5cbiAgICAgICAgdGhpcy5pc1JlYWR5ICAgPSBpc1JlYWR5O1xuICAgICAgICB0aGlzLndoZW5SZWFkeSA9IHdoZW5SZWFkeTtcbiAgICB9XG5cbiAgICAvKiogcmVhZHkgKioqL1xuXG4gICAgcmVhZG9ubHkgd2hlblJlYWR5OiBQcm9taXNlPHVua25vd24+O1xuICAgIHJlYWRvbmx5IGlzUmVhZHkgIDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqIHByb2Nlc3MgcmVzc291cmNlcyAqKi9cblxuICAgIHByb3RlY3RlZCBzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdICAgICAgID0gW107XG4gICAgcHJvdGVjdGVkIHRlbXBsYXRlICAgOiBEb2N1bWVudEZyYWdtZW50fG51bGwgPSBudWxsO1xuXG4gICAgcHJvdGVjdGVkIHByZXBhcmUoaHRtbDogSFRNTHx1bmRlZmluZWQsIGNzczogU1RZTEV8dW5kZWZpbmVkKSB7XG4gICAgICAgIGlmKCBodG1sICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlVGVtcGxhdGUoaHRtbCk7XG4gICAgICAgIGlmKCBjc3MgICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlU3R5bGUgICAoY3NzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZVRlbXBsYXRlKGh0bWw6IEhUTUwpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlKGh0bWwpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZVN0eWxlKGNzczogU1RZTEUpIHtcblxuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgdGhpcy5zdHlsZXNoZWV0cyA9IGNzcy5tYXAoZSA9PiBzdHlsZShlKSApO1xuICAgIH1cblxuICAgIC8qKiogR2VuZXJhdGUgY29udGVudHMgKioqL1xuXG4gICAgaW5pdENvbnRlbnQodGFyZ2V0OiBIVE1MRWxlbWVudCwgbW9kZTpcIm9wZW5cInxcImNsb3NlZFwifG51bGwpIHtcblxuICAgICAgICBsZXQgY29udGVudDogU2hhZG93Um9vdHxIVE1MRWxlbWVudCA9IHRhcmdldDtcbiAgICAgICAgaWYoIG1vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSB0YXJnZXQuYXR0YWNoU2hhZG93KHttb2RlfSk7XG4gICAgICAgICAgICBjb250ZW50LmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUywgLi4udGhpcy5zdHlsZXNoZWV0cyk7XG4gICAgICAgIH1cbiAgICAgICAgLy9UT0RPOiBDU1MgZm9yIG5vIHNoYWRvdyA/Pz9cbiAgICAgICAgXG4gICAgICAgIHRoaXMuZmlsbENvbnRlbnQoY29udGVudCk7XG5cbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgZmlsbENvbnRlbnQodGFyZ2V0OiBTaGFkb3dSb290fEhUTUxFbGVtZW50fERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgXG4gICAgICAgIGlmKCB0aGlzLnRlbXBsYXRlICE9PSBudWxsKVxuICAgICAgICAgICAgdGFyZ2V0LnJlcGxhY2VDaGlsZHJlbiggdGhpcy5jcmVhdGVDb250ZW50KCkgKTtcblxuICAgICAgICAvL1RPRE8uLi5cbiAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZSh0YXJnZXQpO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlIS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgfVxufSIsImltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgTElTU0Z1bGwgZnJvbSBcIi4vTElTUy9MSVNTRnVsbFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5pdGlhbFZhbHVlPEUgZXh0ZW5kcyBIVE1MRWxlbWVudCwgTiBleHRlbmRzIGtleW9mIEU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGU6IEUsIG5hbWU6IE4pOiB1bmRlZmluZWR8RVtOXVxuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxWYWx1ZTxFIGV4dGVuZHMgSFRNTEVsZW1lbnQsIE4gZXh0ZW5kcyBrZXlvZiBFLCBEPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlOiBFLCBuYW1lOiBOLCBkZWZhdWx0VmFsdWU6IEQpIDogRHxFW05dXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5pdGlhbFZhbHVlPEUgZXh0ZW5kcyBIVE1MRWxlbWVudCwgTiBleHRlbmRzIGtleW9mIEUsIEQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGU6IEUsIG5hbWU6IE4sIGRlZmF1bHRWYWx1ZT86IEQpOiB1bmRlZmluZWR8RHxFW05dIHtcblxuICAgIGlmKCAhIE9iamVjdC5oYXNPd24oZSwgbmFtZSkgKVxuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgY29uc3QgIF8gPSBlW25hbWVdO1xuICAgIGRlbGV0ZSAgICAgZVtuYW1lXTtcbiAgICByZXR1cm4gXztcbn1cblxudHlwZSBDc3RyPFQ+ID0gbmV3KC4uLmFyZ3M6YW55W10pID0+IFRcbnR5cGUgTElTU3YzX09wdHM8VCBleHRlbmRzIENzdHI8Q29udGVudEdlbmVyYXRvcj4gPiA9IHtcbiAgICBjb250ZW50X2dlbmVyYXRvcjogVCxcbn0gJiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD5bMF07XG5cbi8vICBidWlsZGVyXG5leHBvcnQgZnVuY3Rpb24gTElTUzxUIGV4dGVuZHMgQ3N0cjxDb250ZW50R2VuZXJhdG9yPiA9IENzdHI8Q29udGVudEdlbmVyYXRvcj4+KG9wdHM6IFBhcnRpYWw8TElTU3YzX09wdHM8VD4+ID0ge30pIHtcbiAgICBcbiAgICBjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG9wdHMuY29udGVudF9nZW5lcmF0b3IgPz8gQ29udGVudEdlbmVyYXRvcjtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yID0gbmV3IGNvbnRlbnRfZ2VuZXJhdG9yKG9wdHMpO1xuICAgIFxuICAgIHJldHVybiBjbGFzcyBfTElTUyBleHRlbmRzIExJU1NGdWxsIHtcblxuICAgICAgICAvLyBUT0RPOiBubyBjb250ZW50IGlmLi4uID8/P1xuICAgICAgICAvLyBvdmVycmlkZSBhdHRhY2hTaGFkb3cgID8/P1xuICAgICAgICBzdGF0aWMgb3ZlcnJpZGUgcmVhZG9ubHkgU0hBRE9XX01PREUgICAgICAgPSBcIm9wZW5cIjtcbiAgICAgICAgc3RhdGljIG92ZXJyaWRlIHJlYWRvbmx5IENPTlRFTlRfR0VORVJBVE9SID0gZ2VuZXJhdG9yO1xuXG4gICAgfVxufVxuXG4vLyB1c2VkIGZvciBwbHVnaW5zLlxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7IiwiaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIlYzL0NvbnRlbnRHZW5lcmF0b3JzL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cblxuICAgIC8qcHJvdGVjdGVkIGdldEluaXRpYWxWYWx1ZTxOIGV4dGVuZHMga2V5b2YgdGhpcz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZTogTik6IHVuZGVmaW5lZHx0aGlzW05dXG4gICAgcHJvdGVjdGVkIGdldEluaXRpYWxWYWx1ZTxOIGV4dGVuZHMga2V5b2YgdGhpcywgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZTogTiwgZGVmYXVsdFZhbHVlOiBEKSA6IER8dGhpc1tOXVxuICAgIHByb3RlY3RlZCBnZXRJbml0aWFsVmFsdWU8TiBleHRlbmRzIGtleW9mIHRoaXMsIEQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWU6IE4sIGRlZmF1bHRWYWx1ZT86IEQpOiB1bmRlZmluZWR8RHx0aGlzW05dIHtcbiAgICAgICAgcmV0dXJuIGdldEluaXRpYWxWYWx1ZSh0aGlzLCBuYW1lLCBkZWZhdWx0VmFsdWUpO1xuICAgIH0qL1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IFNIQURPV19NT0RFICAgICAgOiBcIm9wZW5cInxcImNsb3NlZFwifG51bGwgPSBudWxsO1xuICAgIC8vIFRPRE86IHN0YXRpYyBjYWNoZSBnZXR0ZXIgKyB1c2Ugc3RhdGljIEhUTUwvQ1NTLlxuICAgIHN0YXRpYyByZWFkb25seSBDT05URU5UX0dFTkVSQVRPUjogQ29udGVudEdlbmVyYXRvcnxudWxsID0gbnVsbDtcblxuICAgIHJlYWRvbmx5IGNvbnRlbnQgIDogU2hhZG93Um9vdHxIVE1MRWxlbWVudCAgICAgICAgPSB0aGlzO1xuICAgIHJlYWRvbmx5IGhvc3QgICAgIDogSFRNTEVsZW1lbnQgICAgICAgICAgICAgICAgICAgPSB0aGlzO1xuICAgIHJlYWRvbmx5IGNvbnRyb2xlcjogT21pdDx0aGlzLCBrZXlvZiBIVE1MRWxlbWVudD4gPSB0aGlzO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3Qga2xhc3MgPSB0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBMSVNTQmFzZTtcblxuICAgICAgICBpZigga2xhc3MuQ09OVEVOVF9HRU5FUkFUT1IgIT09IG51bGwgKVxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0ga2xhc3MuQ09OVEVOVF9HRU5FUkFUT1IuaW5pdENvbnRlbnQodGhpcywga2xhc3MuU0hBRE9XX01PREUpO1xuICAgIH1cblxuXG4gICAgLy8gZGVmaW5lIGZvciBhdXRvLWNvbXBsZXRlLlxuICAgIHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW107XG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkdmFsOiBzdHJpbmd8bnVsbCwgbmV3dmFsOiBzdHJpbmd8bnVsbCl7fVxufSIsImV4cG9ydCB7ZGVmYXVsdCBhcyBkZWZhdWx0fSBmcm9tIFwiLi9MSVNTQmFzZVwiOyIsImltcG9ydCBkZWZpbmUsIHsgV2FpdGluZ0RlZmluZSB9IGZyb20gXCJWMy9kZWZpbmUvZGVmaW5lXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiVjNcIjtcbmltcG9ydCBBdXRvQ29udGVudEdlbmVyYXRvciBmcm9tIFwiVjMvQ29udGVudEdlbmVyYXRvcnMvQXV0b0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCBpc1BhZ2VMb2FkZWQgZnJvbSBcIlYzL3V0aWxzL0RPTS9pc1BhZ2VMb2FkZWRcIjtcbmltcG9ydCB3aGVuUGFnZUxvYWRlZCBmcm9tIFwiVjMvdXRpbHMvRE9NL3doZW5QYWdlTG9hZGVkXCI7XG5pbXBvcnQgZmV0Y2hUZXh0IGZyb20gXCJWMy91dGlscy9uZXR3b3JrL2ZldGNoVGV4dFwiO1xuaW1wb3J0IGV4ZWN1dGUgZnJvbSBcIlYzL3V0aWxzL2V4ZWN1dGVcIjtcblxuY29uc3Qgc2NyaXB0ID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdzY3JpcHQ6aXMoW2xpc3MtYXV0b10sW2xpc3MtY2Rpcl0sW2xpc3Mtc3ddKScpO1xuXG5leHBvcnQgY29uc3QgTElTU19NT0RFICAgID0gc2NyaXB0Py5nZXRBdHRyaWJ1dGUoJ2xpc3MtbW9kZScpID8/IG51bGw7XG5leHBvcnQgY29uc3QgREVGQVVMVF9DRElSID0gc2NyaXB0Py5nZXRBdHRyaWJ1dGUoJ2xpc3MtY2RpcicpID8/IG51bGw7XG5cbi8vIFRPRE86IGRlZmF1bHQgP1xuY29uc3QgU1dfUEFUSCAgICAgICAgICAgICA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdsaXNzLXN3JykgPz8gbnVsbDtcblxuaWYoTElTU19NT0RFID09PSBcImF1dG8tbG9hZFwiICYmIERFRkFVTFRfQ0RJUiAhPT0gbnVsbCkge1xuICAgIGlmKCAhIGlzUGFnZUxvYWRlZCgpIClcbiAgICAgICAgYXdhaXQgd2hlblBhZ2VMb2FkZWQoKTtcbiAgICBhdXRvbG9hZChERUZBVUxUX0NESVIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXV0b2xvYWQoY2Rpcjogc3RyaW5nKSB7XG5cbiAgICBjb25zdCBTVzogUHJvbWlzZTx2b2lkPiA9IG5ldyBQcm9taXNlKCBhc3luYyAocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgIGlmKCBTV19QQVRIID09PSBudWxsICkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKFNXX1BBVEgsIHtzY29wZTogXCIvXCJ9KTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZWdpc3RyYXRpb24gb2YgU2VydmljZVdvcmtlciBmYWlsZWRcIik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmKCBjZGlyW2NkaXIubGVuZ3RoLTFdICE9PSAnLycpXG4gICAgICAgIGNkaXIgKz0gJy8nO1xuXG4gICAgLy9jb25zdCBicnl0aG9uID0gc2NyaXB0LmdldEF0dHJpYnV0ZShcImJyeXRob25cIik7XG5cbiAgICAvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cbiAgICBuZXcgTXV0YXRpb25PYnNlcnZlciggKG11dGF0aW9ucykgPT4ge1xuICAgICAgICBmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcbiAgICAgICAgICAgIGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2RlcylcbiAgICAgICAgICAgICAgICBpZiggYWRkaXRpb24uY29uc3RydWN0b3IubmFtZSA9PT0gXCJIVE1MRWxlbWVudFwiIClcbiAgICAgICAgICAgICAgICAvLyBjZiBodHRwczovL2dpdGh1Yi5jb20vV0lDRy93ZWJjb21wb25lbnRzL2lzc3Vlcy8xMDk3I2lzc3VlY29tbWVudC0yNjY1MDkyMzE1XG4gICAgICAgICAgICAgICAgLy8gaWYoYWRkaXRpb24gaW5zdGFuY2VvZiBIVE1MVW5rbm93bkVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGFkZFRhZyhhZGRpdGlvbiBhcyBIVE1MRWxlbWVudClcblxuICAgIH0pLm9ic2VydmUoIGRvY3VtZW50LCB7IGNoaWxkTGlzdDp0cnVlLCBzdWJ0cmVlOnRydWUgfSk7XG5cbiAgICBmb3IoIGxldCBlbGVtIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiOm5vdCg6ZGVmaW5lZClcIikgKVxuICAgICAgICBhZGRUYWcoIGVsZW0gKTtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cbiAgICAgICAgYXdhaXQgU1c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cbiAgICAgICAgY29uc3QgdGFnbmFtZSA9IHRhZy50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgaWYoICBXYWl0aW5nRGVmaW5lLmhhcyh0YWduYW1lKVxuICAgICAgICAgICAgLy8gY291bGQgYmUgZGVmaW5lZCwgYnV0IG5vdCB5ZXQgdXBncmFkZWRcbiAgICAgICAgIHx8IGN1c3RvbUVsZW1lbnRzLmdldCh0YWduYW1lKSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxvYWRDb21wb25lbnQodGFnbmFtZSwge1xuICAgICAgICAgICAgLy9icnl0aG9uLFxuICAgICAgICAgICAgY2RpclxuICAgICAgICB9KTtcdFx0XG4gICAgfVxufVxuXG4vKioqKiovXG5cbnR5cGUgbG9hZENvbXBvbmVudF9PcHRzID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGxcbn07XG5cbnR5cGUgQ3N0cjxUPiA9ICguLi5hcmdzOiBhbnlbXSkgPT4gVDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdC8vIGJyeXRob24gPSBudWxsXG5cdH06IGxvYWRDb21wb25lbnRfT3B0cyA9IHt9XG4pOiBQcm9taXNlPENzdHI8VD4+IHtcblxuXHRXYWl0aW5nRGVmaW5lLmFkZCh0YWduYW1lKTtcblxuXHRjb25zdCBjb21wb19kaXIgPSBgJHtjZGlyfSR7dGFnbmFtZX0vYDtcblxuXHRjb25zdCBmaWxlczogUmVjb3JkPHN0cmluZyxzdHJpbmd8dW5kZWZpbmVkPiA9IHt9O1xuXG5cdC8vIHN0cmF0cyA6IEpTIC0+IEJyeSAtPiBIVE1MK0NTUyAoY2Ygc2NyaXB0IGF0dHIpLlxuXG4gICAgZmlsZXNbXCJqc1wiXSA9IGF3YWl0IGZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguanNgLCB0cnVlKTtcblxuICAgIGlmKCBmaWxlc1tcImpzXCJdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gdHJ5L2NhdGNoID9cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXG4gICAgICAgICAgICBmZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4Lmh0bWxgLCB0cnVlKSEsXG4gICAgICAgICAgICBmZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4LmNzc2AgLCB0cnVlKSFcbiAgICAgICAgXTtcbiAgICAgICAgW2ZpbGVzW1wiaHRtbFwiXSwgZmlsZXNbXCJjc3NcIiBdXSA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cblx0cmV0dXJuIGF3YWl0IGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcyk7XG59XG5cbi8vVE9ETzogcmVuYW1lIGZyb20gZmlsZXMgP1xuYXN5bmMgZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogUmVjb3JkPHN0cmluZywgYW55PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICBcbiAgICBsZXQga2xhc3M7XG4gICAgaWYoIFwianNcIiBpbiBmaWxlcyApXG4gICAgICAgIGtsYXNzID0gKGF3YWl0IGV4ZWN1dGU8YW55PihmaWxlc1tcImpzXCJdLCBcImpzXCIpKS5kZWZhdWx0O1xuXG4gICAgaWYoIGtsYXNzID09PSB1bmRlZmluZWQgKVxuICAgICAgICBrbGFzcyA9IExJU1Moe1xuICAgICAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IEF1dG9Db250ZW50R2VuZXJhdG9yLFxuICAgICAgICAgICAgLi4uZmlsZXNcbiAgICAgICAgfSk7XG5cbiAgICBkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXG4gICAgcmV0dXJuIGtsYXNzO1xufSIsImltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBfd2hlbkRlZmluZWRQcm9taXNlcyB9IGZyb20gXCIuL3doZW5EZWZpbmVkXCI7XG5cbmV4cG9ydCBjb25zdCBXYWl0aW5nRGVmaW5lID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGRlZmluZSh0YWduYW1lOiBzdHJpbmcsIEtsYXNzOiBuZXcoLi4uYXJnczphbnlbXSkgPT4gSFRNTEVsZW1lbnQpIHtcblxuICAgIC8vVE9ETzogUHl0aG9uIGNsYXNzLi4uXG5cbiAgICAvL1RPRE86IHR5cGUgc2FmZVxuICAgIGlmKCBcIkNPTlRFTlRfR0VORVJBVE9SXCIgaW4gS2xhc3MgKSB7XG4gICAgICAgIGNvbnN0IGdlbmVyYXRvciA9IEtsYXNzLkNPTlRFTlRfR0VORVJBVE9SIGFzIENvbnRlbnRHZW5lcmF0b3I7XG5cbiAgICAgICAgaWYoICEgZ2VuZXJhdG9yLmlzUmVhZHkgKSB7XG4gICAgICAgICAgICBXYWl0aW5nRGVmaW5lLmFkZCh0YWduYW1lKTtcbiAgICAgICAgICAgIGF3YWl0IGdlbmVyYXRvci53aGVuUmVhZHk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBXYWl0aW5nRGVmaW5lLmRlbGV0ZSh0YWduYW1lKTtcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgS2xhc3MpO1xuXG4gICAgY29uc3QgcCA9IF93aGVuRGVmaW5lZFByb21pc2VzLmdldChLbGFzcyk7XG4gICAgaWYoIHAgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIHAucmVzb2x2ZSgpO1xufVxuXG5pbXBvcnQgTElTUyBmcm9tIFwiVjMvTElTU1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIlYzL0xJU1NcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lOiB0eXBlb2YgZGVmaW5lO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgPSBkZWZpbmU7IiwiaW1wb3J0IGRlZmluZSAgICAgIGZyb20gXCIuL2RlZmluZVwiO1xuaW1wb3J0IGlzRGVmaW5lZCAgIGZyb20gXCIuL2lzRGVmaW5lZFwiO1xuaW1wb3J0IHdoZW5EZWZpbmVkIGZyb20gXCIuL3doZW5EZWZpbmVkXCI7XG5cbmltcG9ydCBMSVNTIGZyb20gXCJWMy9MSVNTXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiVjMvTElTU1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgOiB0eXBlb2YgZGVmaW5lO1xuICAgICAgICBpc0RlZmluZWQ6IHR5cGVvZiBpc0RlZmluZWQ7XG4gICAgICAgIHdoZW5EZWZpbmVkICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLmRlZmluZSAgICAgID0gZGVmaW5lO1xuTElTUy5pc0RlZmluZWQgICA9IGlzRGVmaW5lZDtcbkxJU1Mud2hlbkRlZmluZWQgPSB3aGVuRGVmaW5lZDtcblxuZXhwb3J0IHtkZWZpbmUsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWR9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzRGVmaW5lZChlbGVtOiBzdHJpbmd8KG5ldyguLi5hcmdzOmFueVtdKT0+SFRNTEVsZW1lbnQpKTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pICE9PSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtKSAhPT0gbnVsbDtcbn0iLCJ0eXBlIENzdHI8VD4gPSBuZXcoLi4uYXJnczphbnlbXSk9PiBUO1xuXG5leHBvcnQgY29uc3QgX3doZW5EZWZpbmVkUHJvbWlzZXMgPSBuZXcgV2Vha01hcDxDc3RyPEhUTUxFbGVtZW50PiwgUHJvbWlzZVdpdGhSZXNvbHZlcnM8dm9pZD4+KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oZWxlbTogc3RyaW5nfENzdHI8VD4pOiBQcm9taXNlPENzdHI8VD4+IHtcbiAgICBcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlbGVtKSBhcyBDc3RyPFQ+O1xuXG4gICAgaWYoIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSkgIT09IG51bGwpXG4gICAgICAgIHJldHVybiBlbGVtIGFzIENzdHI8VD47XG5cbiAgICBsZXQgcCA9IF93aGVuRGVmaW5lZFByb21pc2VzLmdldChlbGVtKTtcbiAgICBpZiggcCA9PT0gdW5kZWZpbmVkICl7XG4gICAgICAgIHAgPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgX3doZW5EZWZpbmVkUHJvbWlzZXMuc2V0KGVsZW0sIHApO1xuICAgIH1cblxuICAgIGF3YWl0IHAucHJvbWlzZTtcbiAgICByZXR1cm4gZWxlbTtcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9MSVNTXCI7XG5cbi8vIEhFUkUuLi5cblxuaW1wb3J0IFwiLi9kZWZpbmVcIjtcbmltcG9ydCBcIi4vZGVmaW5lL2F1dG9sb2FkXCI7XG5cbmltcG9ydCBcIi4vdXRpbHMvcGFyc2Vyc1wiO1xuaW1wb3J0IFwiLi91dGlscy9uZXR3b3JrL3JlcXVpcmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgTElTUzsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1BhZ2VMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIlxufVxuXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn0qLyIsImltcG9ydCBpc1BhZ2VMb2FkZWQgZnJvbSBcIi4vaXNQYWdlTG9hZGVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdoZW5ET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc1BhZ2VMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlc29sdmUgYXMgYW55LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8qXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufSovIiwiY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn0iLCJpbXBvcnQgZXhlY3V0ZUpTIGZyb20gXCIuL2pzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGU8VD4oY29kZTogc3RyaW5nLCB0eXBlOiBcImpzXCIpOiBQcm9taXNlPFQ+IHtcblxuICAgIGlmKCB0eXBlID09PSBcImpzXCIgKVxuICAgICAgICByZXR1cm4gYXdhaXQgZXhlY3V0ZUpTPFQ+KGNvZGUpO1xuXG4gICAgdGhyb3cgbmV3IEVycm9yKCcnKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBleGVjdXRlSlM8VD4oY29kZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NvZGVdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcbiAgICBjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKTtcbiAgICBcbiAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG5cbiAgICByZXR1cm4gcmVzdWx0IGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBpbiBhdXRvLW1vZGUgdXNlIFNlcnZpY2VXb3JrZXIgdG8gaGlkZSA0MDQgZXJyb3IgbWVzc2FnZXMuXG4vLyBpZiBwbGF5Z3JvdW5kIGZpbGVzLCB1c2UgdGhlbS5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGhpZGU0MDQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuXG4gICAgY29uc3QgZmV0Y2hDb250ZXh0ID0gZ2xvYmFsVGhpcy5MSVNTQ29udGV4dC5mZXRjaDtcbiAgICBpZiggZmV0Y2hDb250ZXh0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBuZXcgVVJMKHVyaSwgZmV0Y2hDb250ZXh0LmN3ZCApO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGZldGNoQ29udGV4dC5maWxlc1twYXRoLnRvU3RyaW5nKCldO1xuICAgICAgICBpZiggdmFsdWUgPT09IFwiXCIgKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgaWYoIHZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IGhpZGU0MDRcbiAgICAgICAgICAgICAgICAgICAgICAgID8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDoge307XG5cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcbiAgICBpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBpZiggaGlkZTQwNCAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG4gICAgaWYoYW5zd2VyID09PSBcIlwiKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGFuc3dlclxufVxuXG5cblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIHZhciBMSVNTQ29udGV4dDoge1xuICAgICAgICBmZXRjaD86IHtcbiAgICAgICAgICAgIGN3ZCAgOiBzdHJpbmcsXG4gICAgICAgICAgICBmaWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBmZXRjaFRleHQgZnJvbSBcIi4vZmV0Y2hUZXh0XCI7XG5cbi8vIEB0cy1pZ25vcmVcbmdsb2JhbFRoaXMucmVxdWlyZSA9IGFzeW5jIGZ1bmN0aW9uKHVybDogc3RyaW5nKSB7XG4gICAgLy9UT0RPOiBub24gcGxheWdyb3VuZC4uLlxuICAgIHJldHVybiBhd2FpdCBmZXRjaFRleHQodXJsKTtcbn0iLCJleHBvcnQgdHlwZSBSZXNzb3VyY2U8VD4gPVxuICAgICAgVFxuICAgIHwgUHJvbWlzZTxUPlxuICAgIHwgKFQgZXh0ZW5kcyBzdHJpbmcgICAgICAgICA/IFByb21pc2U8UmVzcG9uc2U+IHwgUmVzcG9uc2UgOiBuZXZlcilcbiAgICB8IChUIGV4dGVuZHMgQXJyYXk8aW5mZXIgRT4gPyBSZXNzb3VyY2U8RT5bXSAgICAgICAgICAgICAgIDogbmV2ZXIpO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXNzb3VyY2VSZWFkeTxUPihyZXM6IFJlc3NvdXJjZTxUPnx1bmRlZmluZWQpOiByZXMgaXMgVHx1bmRlZmluZWQge1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkocmVzKSApXG4gICAgICAgIHJldHVybiByZXMuZXZlcnkoIGUgPT4gaXNSZXNzb3VyY2VSZWFkeShlKSApO1xuXG4gICAgcmV0dXJuIHJlcyA9PT0gdW5kZWZpbmVkIHx8ICEocmVzIGluc3RhbmNlb2YgUHJvbWlzZSB8fCByZXMgaW5zdGFuY2VvZiBSZXNwb25zZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0UmVzc291cmNlPFQ+KHJlczogUmVzc291cmNlPFQ+KTogUHJvbWlzZTxUPiB7XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShyZXMpIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHJlcy5tYXAoIGUgPT4gd2FpdFJlc3NvdXJjZShlKSkpIGFzIFQ7XG5cbiAgICBpZiggcmVzIGluc3RhbmNlb2YgUHJvbWlzZSlcbiAgICAgICAgcmVzID0gYXdhaXQgcmVzO1xuXG4gICAgaWYoIHJlcyBpbnN0YW5jZW9mIFJlc3BvbnNlKVxuICAgICAgICByZXMgPSBhd2FpdCByZXMudGV4dCgpIGFzIFQ7XG5cbiAgICByZXR1cm4gcmVzIGFzIFQ7XG59IiwiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKTtcbmNvbnN0IGRmID0gdGVtcGxhdGUuY29udGVudDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KC4uLnJhdzogVGVtcGxhdGU8c3RyaW5nPik6IFQge1xuICAgIFxuICAgIGxldCBlbGVtID0gcmF3WzBdO1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkoZWxlbSkgKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHIgPSByYXdbMF0gYXMgVGVtcGxhdGVTdHJpbmdzQXJyYXk7XG5cbiAgICAgICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHJhdy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgc3RyaW5nICs9IHJhd1tpXTtcbiAgICAgICAgICAgIHN0cmluZyArPSBzdHJbaV07XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtID0gc3RyaW5nO1xuICAgIH1cblxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGVsZW07XG5cbiAgICBpZiggZGYuY2hpbGROb2Rlcy5sZW5ndGggIT09IDEpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yXCIpO1xuXG4gICAgcmV0dXJuIGRmLmZpcnN0Q2hpbGQgYXMgVDtcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiVjMvTElTU1wiO1xuXG5pbXBvcnQgaHRtbCAgICAgZnJvbSBcIi4vaHRtbFwiXG5pbXBvcnQgdGVtcGxhdGUgZnJvbSBcIi4vdGVtcGxhdGVcIjtcbmltcG9ydCBzdHlsZSAgICBmcm9tIFwiLi9zdHlsZVwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIlYzL0xJU1NcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgaHRtbCAgICA6IHR5cGVvZiBodG1sO1xuICAgICAgICB0ZW1wbGF0ZTogdHlwZW9mIHRlbXBsYXRlO1xuICAgICAgICBzdHlsZSAgIDogdHlwZW9mIHN0eWxlO1xuICAgIH1cbn1cblxuTElTUy5zdHlsZSAgICA9IHN0eWxlO1xuTElTUy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuTElTUy5odG1sICAgICA9IGh0bWw7XG5cbmV4cG9ydCB7c3R5bGUsIHRlbXBsYXRlLCBodG1sfTsiLCJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIENTUyAgID0gc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3R5bGUoLi4ucmF3OiBUZW1wbGF0ZTxDU1M+KTogQ1NTU3R5bGVTaGVldCB7XG5cbiAgICBsZXQgZWxlbSA9IHJhd1swXTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldCApXG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgcmV0dXJuIGVsZW0uc2hlZXQhO1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkoZWxlbSkgKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHIgPSByYXdbMF0gYXMgVGVtcGxhdGVTdHJpbmdzQXJyYXk7XG5cbiAgICAgICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHJhdy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgc3RyaW5nICs9IHJhd1tpXTtcbiAgICAgICAgICAgIHN0cmluZyArPSBzdHJbaV07XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtID0gc3RyaW5nO1xuICAgIH1cblxuICAgIGlmKCB0eXBlb2YgZWxlbSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLndhcm4oZWxlbSk7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICAgIHN0eWxlLnJlcGxhY2VTeW5jKGVsZW0pO1xuICAgIHJldHVybiBzdHlsZTtcbn0iLCJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEhUTUwgID0gRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKCAuLi5yYXc6VGVtcGxhdGU8SFRNTD4pOiBEb2N1bWVudEZyYWdtZW50IHtcblxuICAgIGxldCBlbGVtID0gcmF3WzBdO1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkoZWxlbSkgKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHIgPSByYXdbMF0gYXMgVGVtcGxhdGVTdHJpbmdzQXJyYXk7XG5cbiAgICAgICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHJhdy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgc3RyaW5nICs9IHJhd1tpXTtcbiAgICAgICAgICAgIHN0cmluZyArPSBzdHJbaV07XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtID0gc3RyaW5nO1xuICAgIH1cblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICAgIHJldHVybiBlbGVtLmNsb25lTm9kZSh0cnVlKSBhcyBEb2N1bWVudEZyYWdtZW50O1xuXG4gICAgLy8gbXVzdCB1c2UgdGVtcGxhdGUgYXMgRG9jdW1lbnRGcmFnbWVudCBkb2Vzbid0IGhhdmUgLmlubmVySFRNTFxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgICBpZih0eXBlb2YgZWxlbSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGVsZW0udHJpbSgpO1xuICAgIGVsc2Uge1xuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICAgICAgLy8gcHJldmVudHMgaXNzdWUgaWYgZWxlbSBpcyBsYXR0ZXIgdXBkYXRlZC5cbiAgICAgICAgICAgIGVsZW0gPSBlbGVtLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgXG4gICAgICAgIHRlbXBsYXRlLmFwcGVuZCggZWxlbSApO1xuICAgIH1cblxuICAgIC8vaWYoIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEgJiYgdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpXG4gICAgLy8gIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcbiAgICBcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudCE7XG59IiwiZXhwb3J0IHtkZWZhdWx0IGFzIFYyfSBmcm9tIFwiVjJcIjtcbmV4cG9ydCB7ZGVmYXVsdCBhcyBWM30gZnJvbSBcIlYzXCI7XG5cbmltcG9ydCBMSVNTIGZyb20gXCJWM1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUztcblxuLy8gQHRzLWlnbm9yZVxuZ2xvYmFsVGhpcy5MSVNTID0gTElTUzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwidmFyIHdlYnBhY2tRdWV1ZXMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIHF1ZXVlc1wiKSA6IFwiX193ZWJwYWNrX3F1ZXVlc19fXCI7XG52YXIgd2VicGFja0V4cG9ydHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGV4cG9ydHNcIikgOiBcIl9fd2VicGFja19leHBvcnRzX19cIjtcbnZhciB3ZWJwYWNrRXJyb3IgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGVycm9yXCIpIDogXCJfX3dlYnBhY2tfZXJyb3JfX1wiO1xudmFyIHJlc29sdmVRdWV1ZSA9IChxdWV1ZSkgPT4ge1xuXHRpZihxdWV1ZSAmJiBxdWV1ZS5kIDwgMSkge1xuXHRcdHF1ZXVlLmQgPSAxO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tKSk7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0gPyBmbi5yKysgOiBmbigpKSk7XG5cdH1cbn1cbnZhciB3cmFwRGVwcyA9IChkZXBzKSA9PiAoZGVwcy5tYXAoKGRlcCkgPT4ge1xuXHRpZihkZXAgIT09IG51bGwgJiYgdHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmKGRlcFt3ZWJwYWNrUXVldWVzXSkgcmV0dXJuIGRlcDtcblx0XHRpZihkZXAudGhlbikge1xuXHRcdFx0dmFyIHF1ZXVlID0gW107XG5cdFx0XHRxdWV1ZS5kID0gMDtcblx0XHRcdGRlcC50aGVuKChyKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXhwb3J0c10gPSByO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSwgKGUpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFcnJvcl0gPSBlO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgb2JqID0ge307XG5cdFx0XHRvYmpbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChmbihxdWV1ZSkpO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9XG5cdH1cblx0dmFyIHJldCA9IHt9O1xuXHRyZXRbd2VicGFja1F1ZXVlc10gPSB4ID0+IHt9O1xuXHRyZXRbd2VicGFja0V4cG9ydHNdID0gZGVwO1xuXHRyZXR1cm4gcmV0O1xufSkpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5hID0gKG1vZHVsZSwgYm9keSwgaGFzQXdhaXQpID0+IHtcblx0dmFyIHF1ZXVlO1xuXHRoYXNBd2FpdCAmJiAoKHF1ZXVlID0gW10pLmQgPSAtMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiBxdWV1ZS5kIDwgMCAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImdldFNoYXJlZENTUyIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJpc1NoYWRvd1N1cHBvcnRlZCIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwic2hhcmVkQ1NTIiwiQ29udGVudEdlbmVyYXRvciIsImRhdGEiLCJjb25zdHJ1Y3RvciIsImh0bWwiLCJjc3MiLCJzaGFkb3ciLCJwcmVwYXJlSFRNTCIsInByZXBhcmVDU1MiLCJzZXRUZW1wbGF0ZSIsInRlbXBsYXRlIiwiaXNSZWFkeSIsIndoZW5SZWFkeSIsImZpbGxDb250ZW50IiwiaW5qZWN0Q1NTIiwiYXBwZW5kIiwiY29udGVudCIsImNsb25lTm9kZSIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImdlbmVyYXRlIiwiaG9zdCIsInRhcmdldCIsImluaXRTaGFkb3ciLCJzaGFkb3dNb2RlIiwiTk9ORSIsImNoaWxkTm9kZXMiLCJsZW5ndGgiLCJyZXBsYWNlQ2hpbGRyZW4iLCJjYW5IYXZlU2hhZG93IiwiRXJyb3IiLCJtb2RlIiwiT1BFTiIsImF0dGFjaFNoYWRvdyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImUiLCJwcm9jZXNzQ1NTIiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ1bmRlZmluZWQiLCJzdHIiLCJ0cmltIiwiaW5uZXJIVE1MIiwiSFRNTEVsZW1lbnQiLCJzdHlsZXNoZWV0cyIsIlNoYWRvd1Jvb3QiLCJhZG9wdGVkU3R5bGVTaGVldHMiLCJwdXNoIiwiY3Nzc2VsZWN0b3IiLCJDU1NTZWxlY3RvciIsImhhcyIsInNldEF0dHJpYnV0ZSIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwicmVwbGFjZSIsImhlYWQiLCJhZGQiLCJidWlsZExJU1NIb3N0Iiwic2V0Q3N0ckNvbnRyb2xlciIsIl9fY3N0cl9ob3N0Iiwic2V0Q3N0ckhvc3QiLCJfIiwiTElTUyIsImFyZ3MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJjb250ZW50X2dlbmVyYXRvciIsIkxJU1NDb250cm9sZXIiLCJIb3N0Iiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwibmFtZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJjb25uZWN0ZWRDYWxsYmFjayIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiaXNDb25uZWN0ZWQiLCJfSG9zdCIsImlkIiwiX19jc3RyX2NvbnRyb2xlciIsIkxpc3MiLCJob3N0Q3N0ciIsImNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIiLCJMSVNTSG9zdCIsIkNmZyIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkNvbnRyb2xlciIsImNvbnRyb2xlciIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwicGFyYW1zIiwiaW5pdCIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInRoZW4iLCJwcm9taXNlIiwicmVzb2x2ZSIsIlByb21pc2UiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJicnlfY2xhc3MiLCJfX2Jhc2VzX18iLCJmaWx0ZXIiLCJfX25hbWVfXyIsIl9qc19rbGFzcyIsIiRqc19mdW5jIiwiX19CUllUSE9OX18iLCIkY2FsbCIsIiRnZXRhdHRyX3BlcDY1NyIsImh0bWx0YWciLCJDbGFzcyIsIm9wdHMiLCJnZXROYW1lIiwiZWxlbWVudCIsIkVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiaXNEZWZpbmVkIiwiZWxlbSIsImdldCIsIndoZW5EZWZpbmVkIiwiZ2V0SG9zdENzdHIiLCJnZXRIb3N0Q3N0clN5bmMiLCJpc1VwZ3JhZGVkIiwidXBncmFkZVN5bmMiLCJ3aGVuVXBncmFkZWQiLCJnZXRDb250cm9sZXIiLCJnZXRDb250cm9sZXJTeW5jIiwiaW5pdGlhbGl6ZVN5bmMiLCJnZXRDb250cm9sZXJDc3RyIiwiZ2V0Q29udHJvbGVyQ3N0clN5bmMiLCJfd2hlblVwZ3JhZGVkIiwiZ2V0SG9zdCIsIm93bmVyRG9jdW1lbnQiLCJhZG9wdE5vZGUiLCJnZXRIb3N0U3luYyIsIlN0YXRlcyIsIl9MSVNTIiwiSUxJU1MiLCJjZmciLCJhc3NpZ24iLCJFeHRlbmRlZExJU1MiLCJLbm93blRhZ3MiLCJzY3JpcHQiLCJERUZBVUxUX0NESVIiLCJhdXRvbG9hZCIsImNkaXIiLCJTVyIsInN3X3BhdGgiLCJjb25zb2xlIiwid2FybiIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInNjb3BlIiwiZXJyb3IiLCJjb250cm9sbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJyeXRob24iLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJhZGRUYWciLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsInRhZyIsImltcG9ydENvbXBvbmVudCIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwiY19qcyIsImtsYXNzIiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwib2xkcmVxIiwicmVxdWlyZSIsInN0YXJ0c1dpdGgiLCJmaWxlbmFtZSIsInNsaWNlIiwiZGVmYXVsdCIsIkxJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IiLCJfZmV0Y2hUZXh0IiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImFuc3dlciIsInRleHQiLCJfaW1wb3J0IiwibG9nIiwiY29udmVydGVyIiwiZW5jb2RlSFRNTCIsInRleHRDb250ZW50IiwibWF0Y2giLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImNzc19hdHRyIiwic2V0UHJvcGVydHkiLCJpbXBvcnRDb21wb25lbnRzIiwiY29tcG9uZW50cyIsInJlc3VsdHMiLCJicnlfd3JhcHBlciIsImNvbXBvX2RpciIsImNvZGUiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsImlkeCIsInByb21pc2VzIiwiYWxsIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwicmVnZXgiLCJBdXRvQ29udGVudEdlbmVyYXRvciIsInByZXBhcmVUZW1wbGF0ZSIsInZhbHVlIiwiaXNSZXNzb3VyY2VSZWFkeSIsIndhaXRSZXNzb3VyY2UiLCJwcmVwYXJlIiwicHJlcGFyZVN0eWxlIiwiaW5pdENvbnRlbnQiLCJjcmVhdGVDb250ZW50IiwiTElTU0Z1bGwiLCJnZXRJbml0aWFsVmFsdWUiLCJkZWZhdWx0VmFsdWUiLCJoYXNPd24iLCJnZW5lcmF0b3IiLCJTSEFET1dfTU9ERSIsIkNPTlRFTlRfR0VORVJBVE9SIiwiTElTU0Jhc2UiLCJvbGR2YWwiLCJuZXd2YWwiLCJXYWl0aW5nRGVmaW5lIiwiaXNQYWdlTG9hZGVkIiwid2hlblBhZ2VMb2FkZWQiLCJmZXRjaFRleHQiLCJleGVjdXRlIiwiTElTU19NT0RFIiwiU1dfUEFUSCIsImxvYWRDb21wb25lbnQiLCJfd2hlbkRlZmluZWRQcm9taXNlcyIsIktsYXNzIiwiZGVsZXRlIiwicCIsIldlYWtNYXAiLCJzZXQiLCJleGVjdXRlSlMiLCJyZXZva2VPYmplY3RVUkwiLCJoaWRlNDA0IiwiZmV0Y2hDb250ZXh0IiwiZ2xvYmFsVGhpcyIsIkxJU1NDb250ZXh0IiwicGF0aCIsImN3ZCIsInRvU3RyaW5nIiwiZXZlcnkiLCJSZXNwb25zZSIsImRmIiwicmF3IiwidHJhY2UiLCJWMiIsIlYzIl0sInNvdXJjZVJvb3QiOiIifQ==