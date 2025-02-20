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
/* harmony export */   "default": () => (/* reexport safe */ _LISSUpdate_ts__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _LISSUpdate_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSUpdate.ts */ "./src/V3/LISS/LISSUpdate.ts");



/***/ }),

/***/ "./src/V3/LISS/LISSUpdate.ts":
/*!***********************************!*\
  !*** ./src/V3/LISS/LISSUpdate.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSUpdate)
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./src/V3/LISS/LISSBase.ts");

class LISSUpdate extends _LISSBase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(){
        super();
        observer.observe(this);
    }
    #requestID = null;
    #updateRequested = false;
    #isVisible = false;
    static processIntersectionObserver(entries) {
        for(let i = 0; i < entries.length; ++i){
            const target = entries[i].target;
            const isVisible = entries[i].isIntersecting;
            target.#isVisible = isVisible;
            if (!isVisible && target.#requestID !== null) cancelAnimationFrame(target.#requestID);
            if (isVisible && target.#updateRequested && target.#requestID === null) target.#scheduleUpdate();
        }
    }
    #scheduleUpdate() {
        this.#requestID = requestAnimationFrame(()=>{
            this.#requestID = null;
            this.#updateRequested = false;
            this.onUpdate();
        });
    }
    requestUpdate() {
        if (this.#updateRequested) return;
        this.#updateRequested = true;
        if (!this.#isVisible) return;
        this.#scheduleUpdate();
    }
    onUpdate() {}
}
const observer = new IntersectionObserver(LISSUpdate.processIntersectionObserver);


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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cGFjazovL0xJU1MvLi9zcmMvVjIvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xJU1NDb250cm9sZXIudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xpZmVDeWNsZS9ERUZJTkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL0lOSVRJQUxJWkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL1JFQURZLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL1VQR1JBREVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL3N0YXRlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2NvcmUvTGlmZUN5Y2xlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvQ29udGVudEdlbmVyYXRvcnMvQXV0b0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvTElTUy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0xJU1MvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9MSVNTL0xJU1NGdWxsLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvTElTUy9MSVNTVXBkYXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL2F1dG9sb2FkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL2RlZmluZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2RlZmluZS9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2RlZmluZS9pc0RlZmluZWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9kZWZpbmUvd2hlbkRlZmluZWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL0RPTS9pc1BhZ2VMb2FkZWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9ET00vd2hlblBhZ2VMb2FkZWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9lbmNvZGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9leGVjdXRlL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvZXhlY3V0ZS9qcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL25ldHdvcmsvZmV0Y2hUZXh0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvbmV0d29yay9yZXF1aXJlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvbmV0d29yay9yZXNzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9wYXJzZXJzL2h0bWwudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9wYXJzZXJzL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvcGFyc2Vycy9zdHlsZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3BhcnNlcnMvdGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy90ZXN0cy9hc3NlcnRFbGVtZW50LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9hc3luYyBtb2R1bGUiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2hhcmVkQ1NTIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IExIb3N0LCBTaGFkb3dDZmcgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCBpc1NoYWRvd1N1cHBvcnRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG50eXBlIEhUTUwgPSBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZztcbnR5cGUgQ1NTICA9IHN0cmluZ3xDU1NTdHlsZVNoZWV0fEhUTUxTdHlsZUVsZW1lbnQ7XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHtcbiAgICBodG1sICAgPzogRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmcsXG4gICAgY3NzICAgID86IENTUyB8IHJlYWRvbmx5IENTU1tdLFxuICAgIHNoYWRvdyA/OiBTaGFkb3dDZmd8bnVsbFxufVxuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yQ3N0ciA9IHsgbmV3KG9wdHM6IENvbnRlbnRHZW5lcmF0b3JfT3B0cyk6IENvbnRlbnRHZW5lcmF0b3IgfTtcblxuY29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuY29uc3Qgc2hhcmVkQ1NTID0gZ2V0U2hhcmVkQ1NTKCk7IC8vIGZyb20gTElTU0hvc3QuLi5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudEdlbmVyYXRvciB7XG5cbiAgICAjc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXTtcbiAgICAjdGVtcGxhdGUgICA6IEhUTUxUZW1wbGF0ZUVsZW1lbnR8bnVsbDtcbiAgICAjc2hhZG93ICAgICA6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgcHJvdGVjdGVkIGRhdGE6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgaHRtbCxcbiAgICAgICAgY3NzICAgID0gW10sXG4gICAgICAgIHNoYWRvdyA9IG51bGwsXG4gICAgfTogQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge30pIHtcblxuICAgICAgICB0aGlzLiNzaGFkb3cgICA9IHNoYWRvdztcbiAgICAgICAgdGhpcy4jdGVtcGxhdGUgPSB0aGlzLnByZXBhcmVIVE1MKGh0bWwpO1xuICAgIFxuICAgICAgICB0aGlzLiNzdHlsZXNoZWV0cyA9IHRoaXMucHJlcGFyZUNTUyhjc3MpO1xuXG4gICAgICAgIHRoaXMuI2lzUmVhZHkgICA9IGlzRE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICB0aGlzLiN3aGVuUmVhZHkgPSB3aGVuRE9NQ29udGVudExvYWRlZCgpO1xuXG4gICAgICAgIC8vVE9ETzogb3RoZXIgZGVwcy4uLlxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRUZW1wbGF0ZSh0ZW1wbGF0ZTogSFRNTFRlbXBsYXRlRWxlbWVudCkge1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cblxuICAgICN3aGVuUmVhZHk6IFByb21pc2U8dW5rbm93bj47XG4gICAgI2lzUmVhZHkgIDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNpc1JlYWR5O1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW5SZWFkeSgpIHtcblxuICAgICAgICBpZiggdGhpcy4jaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuI3doZW5SZWFkeTtcbiAgICAgICAgLy9UT0RPOiBkZXBzLlxuICAgICAgICAvL1RPRE86IENTUy9IVE1MIHJlc291cmNlcy4uLlxuXG4gICAgICAgIC8vIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG4gICAgICAgIC8vIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuICAgICAgICAvLyArIGNmIGF0IHRoZSBlbmQuLi5cbiAgICB9XG5cbiAgICBmaWxsQ29udGVudChzaGFkb3c6IFNoYWRvd1Jvb3QpIHtcbiAgICAgICAgdGhpcy5pbmplY3RDU1Moc2hhZG93LCB0aGlzLiNzdHlsZXNoZWV0cyk7XG5cbiAgICAgICAgc2hhZG93LmFwcGVuZCggdGhpcy4jdGVtcGxhdGUhLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpICk7XG5cbiAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShzaGFkb3cpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50fFNoYWRvd1Jvb3Qge1xuXG4gICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi4gICAgIFxuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaW5pdFNoYWRvdyhob3N0KTtcblxuICAgICAgICB0aGlzLmluamVjdENTUyh0YXJnZXQsIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy4jdGVtcGxhdGUhLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBpZiggaG9zdC5zaGFkb3dNb2RlICE9PSBTaGFkb3dDZmcuTk9ORSB8fCB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuICAgICAgICAgICAgdGFyZ2V0LnJlcGxhY2VDaGlsZHJlbihjb250ZW50KTtcblxuICAgICAgICAvL2lmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICYmIHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMClcblx0XHQvL1x0dGFyZ2V0LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cbiAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShob3N0KTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0U2hhZG93PEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCkge1xuXG4gICAgICAgIGNvbnN0IGNhbkhhdmVTaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KTtcbiAgICAgICAgaWYoIHRoaXMuI3NoYWRvdyAhPT0gbnVsbCAmJiB0aGlzLiNzaGFkb3cgIT09IFNoYWRvd0NmZy5OT05FICYmICEgY2FuSGF2ZVNoYWRvdyApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgICAgIGxldCBtb2RlID0gdGhpcy4jc2hhZG93O1xuICAgICAgICBpZiggbW9kZSA9PT0gbnVsbCApXG4gICAgICAgICAgICBtb2RlID0gY2FuSGF2ZVNoYWRvdyA/IFNoYWRvd0NmZy5PUEVOIDogU2hhZG93Q2ZnLk5PTkU7XG5cbiAgICAgICAgaG9zdC5zaGFkb3dNb2RlID0gbW9kZTtcblxuICAgICAgICBsZXQgdGFyZ2V0OiBIb3N0fFNoYWRvd1Jvb3QgPSBob3N0O1xuICAgICAgICBpZiggbW9kZSAhPT0gU2hhZG93Q2ZnLk5PTkUpXG4gICAgICAgICAgICB0YXJnZXQgPSBob3N0LmF0dGFjaFNoYWRvdyh7bW9kZX0pO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVDU1MoY3NzOiBDU1N8cmVhZG9ubHkgQ1NTW10pIHtcbiAgICAgICAgaWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcbiAgICAgICAgICAgIGNzcyA9IFtjc3NdO1xuXG4gICAgICAgIHJldHVybiBjc3MubWFwKGUgPT4gdGhpcy5wcm9jZXNzQ1NTKGUpICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NDU1MoY3NzOiBDU1MpIHtcblxuICAgICAgICBpZihjc3MgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KVxuICAgICAgICAgICAgcmV0dXJuIGNzcztcbiAgICAgICAgaWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG4gICAgICAgICAgICByZXR1cm4gY3NzLnNoZWV0ITtcbiAgICBcbiAgICAgICAgaWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICAgICAgICAgICAgc3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJcIik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVIVE1MKGh0bWw/OiBIVE1MKTogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsIHtcbiAgICBcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgICAgIGlmKGh0bWwgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcblxuICAgICAgICAvLyBzdHIyaHRtbFxuICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGh0bWwudHJpbSgpO1xuXG4gICAgICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggaHRtbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IClcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICB0ZW1wbGF0ZS5hcHBlbmQoaHRtbCk7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBpbmplY3RDU1M8SG9zdCBleHRlbmRzIExIb3N0Pih0YXJnZXQ6IFNoYWRvd1Jvb3R8SG9zdCwgc3R5bGVzaGVldHM6IGFueVtdKSB7XG5cbiAgICAgICAgaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTLCAuLi5zdHlsZXNoZWV0cyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjc3NzZWxlY3RvciA9IHRhcmdldC5DU1NTZWxlY3RvcjsgLy9UT0RPLi4uXG5cbiAgICAgICAgaWYoIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpIClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuICAgICAgICBsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG4gICAgICAgIGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG4gICAgICAgICAgICBmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG4gICAgICAgICAgICAgICAgaHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG4gICAgICAgIGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuICAgIH1cbn1cblxuLy8gaWRlbSBIVE1MLi4uXG4vKiBpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgYyA9IGF3YWl0IGM7XG4gICAgICAgICAgICBpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcbiAgICAgICAgICAgICAgICBjID0gYXdhaXQgYy50ZXh0KCk7XG5cbiAgICAgICAgICAgIHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuICAgICAgICB9KSgpKTtcblxuICAgICAgICByZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG4gICAgfVxuKi8iLCJpbXBvcnQgeyBMSG9zdENzdHIsIHR5cGUgQ2xhc3MsIHR5cGUgQ29uc3RydWN0b3IsIHR5cGUgTElTU19PcHRzIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCwgc2V0Q3N0ckNvbnRyb2xlciB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vKioqKi9cblxuaW50ZXJmYWNlIElDb250cm9sZXI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiB7XG5cdC8vIG5vbi12YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgaG9zdDogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuXHQvLyB2YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgaXNDb25uZWN0ZWQgIDpib29sZWFuO1xufTtcblx0Ly8gKyBwcm90ZWN0ZWRcblx0XHQvLyByZWFkb25seSAuY29udGVudDogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290O1xuXHQvLyB2YW5pbGxhIEpTXG5cdFx0Ly8gYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpOiB2b2lkO1xuXHRcdC8vIGNvbm5lY3RlZENhbGxiYWNrICAgKCk6IHZvaWQ7XG5cdFx0Ly8gZGlzY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZDtcblxuaW50ZXJmYWNlIElDb250cm9sZXJDc3RyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4ge1xuXHRuZXcoKTogSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+O1xuXG5cdC8vIHZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBvYnNlcnZlZEF0dHJpYnV0ZXM6IHN0cmluZ1tdO1xufVxuXHQvLyArIFwicHJpdmF0ZVwiXG5cdFx0Ly8gcmVhZG9ubHkgSG9zdDogSG9zdENzdHJcblxuZXhwb3J0IHR5cGUgQ29udHJvbGVyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4gPSBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4gJiBJbnN0YW5jZVR5cGU8RXh0ZW5kc0NzdHI+O1xuXG5leHBvcnQgdHlwZSBDb250cm9sZXJDc3RyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4gPSBJQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+ICYgRXh0ZW5kc0NzdHI7XG5cbi8qKioqL1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4oYXJnczogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPj4gPSB7fSkge1xuXG5cdGxldCB7XG5cdFx0LyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG5cdFx0ZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgICAgICBhcyB1bmtub3duIGFzIEV4dGVuZHNDc3RyLFxuXHRcdGhvc3QgICAgICAgICAgICAgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0XG5cdFx0Y29udGVudF9nZW5lcmF0b3IgPSBDb250ZW50R2VuZXJhdG9yLFxuXHR9ID0gYXJncztcblx0XG5cdGNsYXNzIExJU1NDb250cm9sZXIgZXh0ZW5kcyBfZXh0ZW5kcyBpbXBsZW1lbnRzIElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPntcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKSB7XG5cdFx0XHRcdHNldENzdHJDb250cm9sZXIodGhpcyk7XG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCguLi5hcmdzKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHQvL1RPRE86IGdldCB0aGUgcmVhbCB0eXBlID9cblx0XHRwcm90ZWN0ZWQgZ2V0IGNvbnRlbnQoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0LmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW107XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHt9XG5cblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmhvc3QuaXNDb25uZWN0ZWQ7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IEluc3RhbmNlVHlwZTxMSG9zdENzdHI8SG9zdENzdHI+Pjtcblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgc3RhdGljIF9Ib3N0OiBMSG9zdENzdHI8SG9zdENzdHI+O1xuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZTogZnVjayBvZmYuXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KCB0aGlzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhvc3QsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udGVudF9nZW5lcmF0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJncyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gTElTU0NvbnRyb2xlciBzYXRpc2ZpZXMgQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+O1xufSIsImltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgU2hhZG93Q2ZnLCB0eXBlIExJU1NDb250cm9sZXJDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSBcIi4vTGlmZUN5Y2xlL3N0YXRlc1wiO1xuXG4vLyBMSVNTSG9zdCBtdXN0IGJlIGJ1aWxkIGluIGRlZmluZSBhcyBpdCBuZWVkIHRvIGJlIGFibGUgdG8gYnVpbGRcbi8vIHRoZSBkZWZpbmVkIHN1YmNsYXNzLlxuXG5sZXQgaWQgPSAwO1xuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZENTUygpIHtcblx0cmV0dXJuIHNoYXJlZENTUztcbn1cblxubGV0IF9fY3N0cl9jb250cm9sZXIgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJDb250cm9sZXIoXzogYW55KSB7XG5cdF9fY3N0cl9jb250cm9sZXIgPSBfO1xufVxuXG50eXBlIGluZmVySG9zdENzdHI8VD4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI8aW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiwgaW5mZXIgQiBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPyBCIDogbmV2ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFx0VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLCBVIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gaW5mZXJIb3N0Q3N0cjxUPiA+KFxuXHRcdFx0XHRcdFx0XHRMaXNzOiBULFxuXHRcdFx0XHRcdFx0XHQvLyBjYW4ndCBkZWR1Y2UgOiBjYXVzZSB0eXBlIGRlZHVjdGlvbiBpc3N1ZXMuLi5cblx0XHRcdFx0XHRcdFx0aG9zdENzdHI6IFUsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHI6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuXHRcdFx0XHRcdFx0XHRhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG5cdFx0XHRcdFx0XHQpIHtcblxuXHRjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcl9jc3RyKGFyZ3MpO1xuXG5cdHR5cGUgSG9zdENzdHIgPSBVO1xuICAgIHR5cGUgSG9zdCAgICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdGNsYXNzIExJU1NIb3N0IGV4dGVuZHMgaG9zdENzdHIge1xuXG5cdFx0c3RhdGljIHJlYWRvbmx5IENmZyA9IHtcblx0XHRcdGhvc3QgICAgICAgICAgICAgOiBob3N0Q3N0cixcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBjb250ZW50X2dlbmVyYXRvcl9jc3RyLFxuXHRcdFx0YXJnc1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQ29udHJvbGVyID0gTGlzcztcblxuXHRcdCNjb250cm9sZXI6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgY29udHJvbGVyKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXIgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHQvL1RPRE86IGdldCByZWFsIFRTIHR5cGUgP1xuXHRcdCNwYXJhbXM6IGFueVtdO1xuXHRcdGluaXRpYWxpemUoLi4ucGFyYW1zOiBhbnlbXSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRpZiggcGFyYW1zLmxlbmd0aCAhPT0gMCApIHtcblx0XHRcdFx0aWYoIHRoaXMuI3BhcmFtcy5sZW5ndGggIT09IDAgKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ3N0ciBwYXJhbXMgaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZCAhJyk7XG5cdFx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jY29udHJvbGVyID0gdGhpcy5pbml0KCk7XG5cblx0XHRcdGlmKCB0aGlzLmlzQ29ubmVjdGVkIClcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXI7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQvLyNpbnRlcm5hbHMgPSB0aGlzLmF0dGFjaEludGVybmFscygpO1xuXHRcdC8vI3N0YXRlcyAgICA9IHRoaXMuI2ludGVybmFscy5zdGF0ZXM7XG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdCA9IHRoaXMgYXMgSG9zdDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdG92ZXJyaWRlIGF0dGFjaFNoYWRvdyhpbml0OiBTaGFkb3dSb290SW5pdCk6IFNoYWRvd1Jvb3Qge1xuXHRcdFx0Y29uc3Qgc2hhZG93ID0gc3VwZXIuYXR0YWNoU2hhZG93KGluaXQpO1xuXG5cdFx0XHQvLyBAdHMtaWdub3JlIGNsb3NlZCBJUyBhc3NpZ25hYmxlIHRvIHNoYWRvd01vZGUuLi5cblx0XHRcdHRoaXMuc2hhZG93TW9kZSA9IGluaXQubW9kZTtcblxuXHRcdFx0dGhpcy4jY29udGVudCA9IHNoYWRvdztcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHNoYWRvdztcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0IGhhc1NoYWRvdygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLnNoYWRvd01vZGUgIT09ICdub25lJztcblx0XHR9XG5cblx0XHQvKioqIENTUyAqKiovXG5cblx0XHRnZXQgQ1NTU2VsZWN0b3IoKSB7XG5cblx0XHRcdGlmKHRoaXMuaGFzU2hhZG93IHx8ICEgdGhpcy5oYXNBdHRyaWJ1dGUoXCJpc1wiKSApXG5cdFx0XHRcdHJldHVybiB0aGlzLnRhZ05hbWU7XG5cblx0XHRcdHJldHVybiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gSW1wbCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHRjb25zdHJ1Y3RvciguLi5wYXJhbXM6IGFueVtdKSB7XG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfVVBHUkFERUQpO1xuXHRcdFx0Y29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19SRUFEWSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy4jcGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0Y29uc3QgY29udHJvbGVyID0gX19jc3RyX2NvbnRyb2xlcjtcblx0XHRcdF9fY3N0cl9jb250cm9sZXIgPSBudWxsO1xuXG5cdFx0XHRpZiggY29udHJvbGVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IGNvbnRyb2xlcjtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0aWYodGhpcy5jb250cm9sZXIgIT09IG51bGwpXG5cdFx0XHRcdHRoaXMuY29udHJvbGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApIHtcblx0XHRcdFx0dGhpcy5jb250cm9sZXIhLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogaW5zdGFuY2UgZGVwc1xuXHRcdFx0aWYoIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgY29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiBMSVNTSG9zdC5Db250cm9sZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuXHRcdH1cblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYodGhpcy4jY29udHJvbGVyKVxuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0c2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGwgPSBudWxsO1xuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXG5cdFx0XHQvLyBubyBuZWVkcyB0byBzZXQgdGhpcy4jY29udGVudCAoYWxyZWFkeSBob3N0IG9yIHNldCB3aGVuIGF0dGFjaFNoYWRvdylcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLmdlbmVyYXRlKHRoaXMpO1xuXG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cblx0XHRcdGlmKCB0aGlzLiNjb250cm9sZXIgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IG5ldyBMSVNTSG9zdC5Db250cm9sZXIoLi4udGhpcy4jcGFyYW1zKSBhcyBJbnN0YW5jZVR5cGU8VD47XG5cdFx0XHR9XG5cblx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19JTklUSUFMSVpFRCk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmNvbnRyb2xlcik7XG5cblx0XHRcdHJldHVybiB0aGlzLmNvbnRyb2xlcjtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0O1xufVxuXG5cbiIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+ID0gc3RyaW5nfFR8TElTU0hvc3RDc3RyPFQ+fEhUTUxFbGVtZW50O1xuXG4vLyBUT0RPLi4uXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD58YW55KSB7XG5cblx0bGV0IEhvc3Q6IExJU1NIb3N0Q3N0cjxUPiA9IENvbXBvbmVudENsYXNzIGFzIGFueTtcblxuXHQvLyBCcnl0aG9uIGNsYXNzXG5cdGxldCBicnlfY2xhc3M6IGFueSA9IG51bGw7XG5cdGlmKCBcIiRpc19jbGFzc1wiIGluIENvbXBvbmVudENsYXNzICkge1xuXG5cdFx0YnJ5X2NsYXNzID0gQ29tcG9uZW50Q2xhc3M7XG5cblx0XHRDb21wb25lbnRDbGFzcyA9IGJyeV9jbGFzcy5fX2Jhc2VzX18uZmlsdGVyKCAoZTogYW55KSA9PiBlLl9fbmFtZV9fID09PSBcIldyYXBwZXJcIilbMF0uX2pzX2tsYXNzLiRqc19mdW5jO1xuXHRcdChDb21wb25lbnRDbGFzcyBhcyBhbnkpLkhvc3QuQ29udHJvbGVyID0gY2xhc3Mge1xuXG5cdFx0XHQjYnJ5OiBhbnk7XG5cblx0XHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0dGhpcy4jYnJ5ID0gX19CUllUSE9OX18uJGNhbGwoYnJ5X2NsYXNzLCBbMCwwLDBdKSguLi5hcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0I2NhbGwobmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBfX0JSWVRIT05fXy4kY2FsbChfX0JSWVRIT05fXy4kZ2V0YXR0cl9wZXA2NTcodGhpcy4jYnJ5LCBuYW1lLCBbMCwwLDBdKSwgWzAsMCwwXSkoLi4uYXJncylcblx0XHRcdH1cblxuXHRcdFx0Z2V0IGhvc3QoKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIFwiaG9zdFwiLCBbMCwwLDBdKVxuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYnJ5X2NsYXNzW1wib2JzZXJ2ZWRBdHRyaWJ1dGVzXCJdO1xuXG5cdFx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmKCBcIkhvc3RcIiBpbiBDb21wb25lbnRDbGFzcyApXG5cdFx0SG9zdCA9IENvbXBvbmVudENsYXNzLkhvc3QgYXMgYW55O1xuXG4gICAgbGV0IGh0bWx0YWcgPSB1bmRlZmluZWQ7XG4gICAgaWYoIFwiQ2ZnXCIgaW4gSG9zdCkge1xuICAgICAgICBjb25zdCBDbGFzcyAgPSBIb3N0LkNmZy5ob3N0O1xuICAgICAgICBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG4gICAgICAgICAgICAgICAgOiB7ZXh0ZW5kczogaHRtbHRhZ307XG5cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgSG9zdCwgb3B0cyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudHxMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyfExJU1NIb3N0PExJU1NDb250cm9sZXI+fExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPiApOiBzdHJpbmcge1xuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBpZiggXCJob3N0XCIgaW4gZWxlbWVudClcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuaG9zdDtcbiAgICBpZiggZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBcbiAgICAgICAgaWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICAvLyBjc3RyXG5cblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQpXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lkhvc3QgYXMgdW5rbm93biBhcyBMSVNTSG9zdENzdHI8TElTU0NvbnRyb2xlcj47XG5cbiAgICBjb25zdCBuYW1lID0gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZSggZWxlbWVudCApO1xuICAgIGlmKG5hbWUgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgaXMgbm90IGRlZmluZWQhXCIpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVmaW5lZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pICE9PSB1bmRlZmluZWQ7XG5cbiAgICBpZiggXCJIb3N0XCIgaW4gZWxlbSlcbiAgICAgICAgZWxlbSA9IGVsZW0uSG9zdCBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtIGFzIGFueSkgIT09IG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdENzdHI8VD4+IHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoZWxlbSk7XG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSkgYXMgTElTU0hvc3RDc3RyPFQ+O1xuICAgIH1cblxuICAgIC8vIFRPRE86IGxpc3RlbiBkZWZpbmUuLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufVxuXG4vKlxuLy8gVE9ETzogaW1wbGVtZW50XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0Q3N0cjxUPj4ge1xuICAgIC8vIHdlIGNhbid0IGZvcmNlIGEgZGVmaW5lLlxuICAgIHJldHVybiB3aGVuRGVmaW5lZChlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RDc3RyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogTElTU0hvc3RDc3RyPFQ+IHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpIHtcblxuICAgICAgICBsZXQgaG9zdCA9IGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKTtcbiAgICAgICAgaWYoIGhvc3QgPT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZWxlbX0gbm90IGRlZmluZWQgeWV0IWApO1xuXG4gICAgICAgIHJldHVybiBob3N0IGFzIHVua25vd24gYXMgTElTU0hvc3RDc3RyPFQ+O1xuICAgIH1cblxuICAgIGlmKCBcIkhvc3RcIiBpbiBlbGVtKVxuICAgICAgICBlbGVtID0gZWxlbS5Ib3N0IGFzIHVua25vd24gYXMgVDtcblxuICAgIGlmKCBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0gYXMgYW55KSA9PT0gbnVsbCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlbGVtfSBub3QgZGVmaW5lZCB5ZXQhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdENzdHI8VD47XG59IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpc1VwZ3JhZGVkLCB1cGdyYWRlLCB1cGdyYWRlU3luYywgd2hlblVwZ3JhZGVkIH0gZnJvbSBcIi4vVVBHUkFERURcIjtcbmltcG9ydCB7IGlzUmVhZHksIHdoZW5SZWFkeSB9IGZyb20gXCIuL1JFQURZXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gTElTU0hvc3Q8VD58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCAhIGlzVXBncmFkZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gZWxlbS5pc0luaXRpYWxpemVkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB3aGVuVXBncmFkZWQoZWxlbSk7XG5cbiAgICByZXR1cm4gYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQgYXMgVDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbnRyb2xlcjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuICAgIGF3YWl0IHdoZW5SZWFkeShob3N0KTtcblxuICAgIC8vVE9ETzogaW5pdGlhbGl6ZVN5bmMgdnMgaW5pdGlhbGl6ZSA/XG4gICAgaWYoICEgaG9zdC5pc0luaXRpYWxpemVkIClcbiAgICAgICAgcmV0dXJuIGhvc3QuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGhvc3QuY29udHJvbGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBUIHtcbiAgICBcbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG4gICAgaWYoICEgaXNSZWFkeShob3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGFuY2llcyBub3QgcmVhZHkgIVwiKVxuXG4gICAgaWYoICEgaG9zdC5pc0luaXRpYWxpemVkIClcbiAgICAgICAgcmV0dXJuIGhvc3QuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGhvc3QuY29udHJvbGVyO1xufVxuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZSAgICAgPSBnZXRDb250cm9sZXI7XG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZVN5bmMgPSBnZXRDb250cm9sZXJTeW5jOyIsImltcG9ydCB7IExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGdldEhvc3RDc3RyU3luYywgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCB9IGZyb20gXCIuL0RFRklORURcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+ID0gc3RyaW5nfFR8TElTU0hvc3RDc3RyPFQ+fEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+fEhUTUxFbGVtZW50O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWFkeTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgIGNvbnN0IGhvc3RDc3RyID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgcmV0dXJuIGhvc3RDc3RyLmlzRGVwc1Jlc29sdmVkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblJlYWR5PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBob3N0Q3N0ciA9IGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuICAgIGF3YWl0IGhvc3RDc3RyLndoZW5EZXBzUmVzb2x2ZWQ7XG5cbiAgICByZXR1cm4gaG9zdENzdHIuQ29udHJvbGVyIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICAvLyB3ZSBjYW4ndCBmb3JjZSBhIHJlYWR5LlxuICAgIHJldHVybiB3aGVuUmVhZHkoZWxlbSkgYXMgUHJvbWlzZTxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlckNzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBUIHtcbiAgICBcbiAgICBpZiggISBpc1JlYWR5KGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIHJldHVybiBnZXRIb3N0Q3N0clN5bmMoZWxlbSkuQ29udHJvbGVyIGFzIFQ7XG59IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGdldEhvc3RDc3RyU3luYywgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCB9IGZyb20gXCIuL0RFRklORURcIjtcblxudHlwZSBQYXJhbTxfVCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gSFRNTEVsZW1lbnQ7XG5cbi8vVE9ETzogdXBncmFkZSBmdW5jdGlvbi4uLlxuXG5leHBvcnQgZnVuY3Rpb24gaXNVcGdyYWRlZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD58TElTU0hvc3Q8VD4pOiBlbGVtIGlzIExJU1NIb3N0PFQ+IHtcblxuICAgIGlmKCAhIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIEhvc3Q7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdDxUPj4ge1xuICAgIFxuICAgIGNvbnN0IEhvc3QgPSBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcblxuICAgIC8vIGFscmVhZHkgdXBncmFkZWRcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhvc3QpXG4gICAgICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xuXG4gICAgLy8gaDRja1xuXG4gICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbiAgICB9XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICBcbiAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWQgICAgICAgID0gcHJvbWlzZTtcbiAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcblxuICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEhvc3Q8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdDxUPj4ge1xuICAgIFxuICAgIGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdFN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogTElTU0hvc3Q8VD4ge1xuICAgIFxuICAgIGlmKCAhIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IGRlZmluZWQgIVwiKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbn1cblxuZXhwb3J0IGNvbnN0IHVwZ3JhZGUgICAgID0gZ2V0SG9zdDtcbmV4cG9ydCBjb25zdCB1cGdyYWRlU3luYyA9IGdldEhvc3RTeW5jIiwiZXhwb3J0IGVudW0gU3RhdGVzIHtcbiAgICBMSVNTX0RFRklORUQgICAgID0gXCJMSVNTX0RFRklORURcIixcbiAgICBMSVNTX1VQR1JBREVEICAgID0gXCJMSVNTX1VQR1JBREVEXCIsXG4gICAgTElTU19SRUFEWSAgICAgICA9IFwiTElTU19SRUFEWVwiLFxuICAgIExJU1NfSU5JVElBTElaRUQgPSBcIkxJU1NfSU5JVElBTElaRURcIlxufSIsImltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5cblxuaW1wb3J0IHtTdGF0ZXN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvc3RhdGVzLnRzXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBTdGF0ZXMgICAgICAgICA6IHR5cGVvZiBTdGF0ZXNcblx0XHQvLyB3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcbiAgICB9XG59XG5cbkxJU1MuU3RhdGVzID0gU3RhdGVzO1xuXG5cbmltcG9ydCB7ZGVmaW5lLCBnZXROYW1lLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkLCBnZXRIb3N0Q3N0ciwgZ2V0SG9zdENzdHJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0RFRklORURcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZSAgICAgICAgIDogdHlwZW9mIGRlZmluZTtcblx0XHRnZXROYW1lICAgICAgICA6IHR5cGVvZiBnZXROYW1lO1xuXHRcdGlzRGVmaW5lZCAgICAgIDogdHlwZW9mIGlzRGVmaW5lZDtcblx0XHR3aGVuRGVmaW5lZCAgICA6IHR5cGVvZiB3aGVuRGVmaW5lZDtcblx0XHRnZXRIb3N0Q3N0ciAgICA6IHR5cGVvZiBnZXRIb3N0Q3N0cjtcblx0XHRnZXRIb3N0Q3N0clN5bmM6IHR5cGVvZiBnZXRIb3N0Q3N0clN5bmM7XG5cdFx0Ly8gd2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLmRlZmluZSAgICAgICAgID0gZGVmaW5lO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy53aGVuRGVmaW5lZCAgICA9IHdoZW5EZWZpbmVkO1xuTElTUy5nZXRIb3N0Q3N0ciAgICA9IGdldEhvc3RDc3RyO1xuTElTUy5nZXRIb3N0Q3N0clN5bmM9IGdldEhvc3RDc3RyU3luYztcblxuLy9MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5cbmltcG9ydCB7aXNSZWFkeSwgd2hlblJlYWR5LCBnZXRDb250cm9sZXJDc3RyLCBnZXRDb250cm9sZXJDc3RyU3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9SRUFEWVwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc1JlYWR5ICAgICAgOiB0eXBlb2YgaXNSZWFkeTtcblx0XHR3aGVuUmVhZHkgICAgOiB0eXBlb2Ygd2hlblJlYWR5O1xuXHRcdGdldENvbnRyb2xlckNzdHIgICAgOiB0eXBlb2YgZ2V0Q29udHJvbGVyQ3N0cjtcblx0XHRnZXRDb250cm9sZXJDc3RyU3luYzogdHlwZW9mIGdldENvbnRyb2xlckNzdHJTeW5jO1xuICAgIH1cbn1cblxuTElTUy5pc1JlYWR5ICAgICAgICAgICAgID0gaXNSZWFkeTtcbkxJU1Mud2hlblJlYWR5ICAgICAgICAgICA9IHdoZW5SZWFkeTtcbkxJU1MuZ2V0Q29udHJvbGVyQ3N0ciAgICA9IGdldENvbnRyb2xlckNzdHI7XG5MSVNTLmdldENvbnRyb2xlckNzdHJTeW5jPSBnZXRDb250cm9sZXJDc3RyU3luYztcblxuXG5cbmltcG9ydCB7aXNVcGdyYWRlZCwgd2hlblVwZ3JhZGVkLCB1cGdyYWRlLCB1cGdyYWRlU3luYywgZ2V0SG9zdCwgZ2V0SG9zdFN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvVVBHUkFERURcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNVcGdyYWRlZCAgOiB0eXBlb2YgaXNVcGdyYWRlZDtcblx0XHR3aGVuVXBncmFkZWQ6IHR5cGVvZiB3aGVuVXBncmFkZWQ7XG5cdFx0dXBncmFkZSAgICAgOiB0eXBlb2YgdXBncmFkZTtcblx0XHR1cGdyYWRlU3luYyA6IHR5cGVvZiB1cGdyYWRlU3luYztcblx0XHRnZXRIb3N0ICAgICA6IHR5cGVvZiBnZXRIb3N0O1xuXHRcdGdldEhvc3RTeW5jIDogdHlwZW9mIGdldEhvc3RTeW5jO1xuICAgIH1cbn1cblxuTElTUy5pc1VwZ3JhZGVkICA9IGlzVXBncmFkZWQ7XG5MSVNTLndoZW5VcGdyYWRlZD0gd2hlblVwZ3JhZGVkO1xuTElTUy51cGdyYWRlICAgICA9IHVwZ3JhZGU7XG5MSVNTLnVwZ3JhZGVTeW5jID0gdXBncmFkZVN5bmM7XG5MSVNTLmdldEhvc3QgICAgID0gZ2V0SG9zdDtcbkxJU1MuZ2V0SG9zdFN5bmMgPSBnZXRIb3N0U3luYztcblxuXG5pbXBvcnQge2lzSW5pdGlhbGl6ZWQsIHdoZW5Jbml0aWFsaXplZCwgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMsIGdldENvbnRyb2xlciwgZ2V0Q29udHJvbGVyU3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9JTklUSUFMSVpFRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc0luaXRpYWxpemVkICAgIDogdHlwZW9mIGlzSW5pdGlhbGl6ZWQ7XG5cdFx0d2hlbkluaXRpYWxpemVkICA6IHR5cGVvZiB3aGVuSW5pdGlhbGl6ZWQ7XG5cdFx0aW5pdGlhbGl6ZSAgICAgICA6IHR5cGVvZiBpbml0aWFsaXplO1xuXHRcdGluaXRpYWxpemVTeW5jICAgOiB0eXBlb2YgaW5pdGlhbGl6ZVN5bmM7XG5cdFx0Z2V0Q29udHJvbGVyICAgICA6IHR5cGVvZiBnZXRDb250cm9sZXI7XG5cdFx0Z2V0Q29udHJvbGVyU3luYyA6IHR5cGVvZiBnZXRDb250cm9sZXJTeW5jO1xuICAgIH1cbn1cblxuTElTUy5pc0luaXRpYWxpemVkICAgID0gaXNJbml0aWFsaXplZDtcbkxJU1Mud2hlbkluaXRpYWxpemVkICA9IHdoZW5Jbml0aWFsaXplZDtcbkxJU1MuaW5pdGlhbGl6ZSAgICAgICA9IGluaXRpYWxpemU7XG5MSVNTLmluaXRpYWxpemVTeW5jICAgPSBpbml0aWFsaXplU3luYztcbkxJU1MuZ2V0Q29udHJvbGVyICAgICA9IGdldENvbnRyb2xlcjtcbkxJU1MuZ2V0Q29udHJvbGVyU3luYyA9IGdldENvbnRyb2xlclN5bmM7IiwiaW1wb3J0IHR5cGUgeyBDbGFzcywgQ29uc3RydWN0b3IsIExJU1NfT3B0cywgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0IH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7TElTUyBhcyBfTElTU30gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5cbi8vIHVzZWQgZm9yIHBsdWdpbnMuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUztcblxuLy8gZXh0ZW5kcyBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgIEV4dGVuZHNDc3RyIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsXG4gICAgLy90b2RvOiBjb25zdHJhaW5zdHMgb24gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pOiBSZXR1cm5UeXBlPHR5cGVvZiBfZXh0ZW5kczxFeHRlbmRzQ3N0ciwgT3B0cz4+XG4vLyBMSVNTQ29udHJvbGVyIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgID4ob3B0cz86IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj4pOiBMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTKG9wdHM6IGFueSA9IHt9KTogTElTU0NvbnRyb2xlckNzdHJcbntcbiAgICBpZiggb3B0cy5leHRlbmRzICE9PSB1bmRlZmluZWQgJiYgXCJIb3N0XCIgaW4gb3B0cy5leHRlbmRzICkgLy8gd2UgYXNzdW1lIHRoaXMgaXMgYSBMSVNTQ29udHJvbGVyQ3N0clxuICAgICAgICByZXR1cm4gX2V4dGVuZHMob3B0cyk7XG5cbiAgICByZXR1cm4gX0xJU1Mob3B0cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZXh0ZW5kczxcbiAgICAgICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAgICAgLy90b2RvOiBjb25zdHJhaW5zdHMgb24gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgIE9wdHMgZXh0ZW5kcyBMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj5cbiAgICA+KG9wdHM6IHtleHRlbmRzOiBFeHRlbmRzQ3N0cn0gJiBQYXJ0aWFsPE9wdHM+KSB7XG5cbiAgICBpZiggb3B0cy5leHRlbmRzID09PSB1bmRlZmluZWQpIC8vIGg0Y2tcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBhIExJU1NDb250cm9sZXIhJyk7XG5cbiAgICBjb25zdCBjZmcgPSBvcHRzLmV4dGVuZHMuSG9zdC5DZmc7XG4gICAgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIGNmZywgY2ZnLmFyZ3MsIG9wdHMpO1xuXG4gICAgY2xhc3MgRXh0ZW5kZWRMSVNTIGV4dGVuZHMgb3B0cy5leHRlbmRzISB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICB9XG5cblx0XHRwcm90ZWN0ZWQgc3RhdGljIG92ZXJyaWRlIF9Ib3N0OiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+O1xuXG4gICAgICAgIC8vIFRTIGlzIHN0dXBpZCwgcmVxdWlyZXMgZXhwbGljaXQgcmV0dXJuIHR5cGVcblx0XHRzdGF0aWMgb3ZlcnJpZGUgZ2V0IEhvc3QoKTogTElTU0hvc3Q8RXh0ZW5kZWRMSVNTPiB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgZnVjayBvZmZcblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QodGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmhvc3QhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuY29udGVudF9nZW5lcmF0b3IhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzKTtcblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cbiAgICB9XG5cbiAgICByZXR1cm4gRXh0ZW5kZWRMSVNTO1xufSIsImltcG9ydCB7IENvbnN0cnVjdG9yLCBMSG9zdCwgTElTU0NvbnRyb2xlckNzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5cbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBkZWZpbmUgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0RFRklORURcIjtcblxuZXhwb3J0IGNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5sZXQgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ3NjcmlwdFthdXRvZGlyXScpO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DRElSID0gc2NyaXB0Py5nZXRBdHRyaWJ1dGUoJ2F1dG9kaXInKSA/PyBudWxsO1xuXG5pZihzY3JpcHQgIT09IG51bGwpXG5cdGF1dG9sb2FkKHNjcmlwdClcblxuXG5mdW5jdGlvbiBhdXRvbG9hZChzY3JpcHQ6IEhUTUxFbGVtZW50KSB7XG5cblx0bGV0IGNkaXI6IG51bGx8c3RyaW5nID0gREVGQVVMVF9DRElSO1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cblx0XHRjb25zdCBzd19wYXRoID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKTtcblxuXHRcdGlmKCBzd19wYXRoID09PSBudWxsICkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHN3X3BhdGgsIHtzY29wZTogXCIvXCJ9KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0Y2RpciA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ2F1dG9kaXInKSE7XG5cblx0aWYoIGNkaXJbY2Rpci5sZW5ndGgtMV0gIT09ICcvJylcblx0XHRjZGlyICs9ICcvJztcblxuXHRjb25zdCBicnl0aG9uID0gc2NyaXB0LmdldEF0dHJpYnV0ZShcImJyeXRob25cIik7XG5cblx0Ly8gb2JzZXJ2ZSBmb3IgbmV3IGluamVjdGVkIHRhZ3MuXG5cdG5ldyBNdXRhdGlvbk9ic2VydmVyKCAobXV0YXRpb25zKSA9PiB7XG5cdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXG5cdFx0XHRmb3IobGV0IGFkZGl0aW9uIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpXG5cdFx0XHRcdGlmKGFkZGl0aW9uIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG5cdFx0XHRcdFx0YWRkVGFnKGFkZGl0aW9uKVxuXG5cdH0pLm9ic2VydmUoIGRvY3VtZW50LCB7IGNoaWxkTGlzdDp0cnVlLCBzdWJ0cmVlOnRydWUgfSk7XG5cblx0Zm9yKCBsZXQgZWxlbSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIipcIikgKVxuXHRcdGFkZFRhZyggZWxlbSApO1xuXG5cdGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IHRhZ25hbWUgPSAoIHRhZy5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gdGFnLnRhZ05hbWUgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0aWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGNkaXIsXG5cdFx0XHRob3N0XG5cdFx0fSk7XHRcdFxuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiB7aHRtbDogc3RyaW5nLCBjc3M6IHN0cmluZywgaG9zdDogQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+fSkge1xuXG5cdGNvbnN0IGNfanMgICAgICA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cdG9wdHMuaHRtbCAgICAgPz89IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblxuXHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0aWYoIGNfanMgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGNvbnN0IGZpbGUgPSBuZXcgQmxvYihbY19qc10sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pO1xuXHRcdGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG5cdFx0Y29uc3Qgb2xkcmVxID0gTElTUy5yZXF1aXJlO1xuXG5cdFx0TElTUy5yZXF1aXJlID0gZnVuY3Rpb24odXJsOiBVUkx8c3RyaW5nKSB7XG5cblx0XHRcdGlmKCB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiICYmIHVybC5zdGFydHNXaXRoKCcuLycpICkge1xuXHRcdFx0XHRjb25zdCBmaWxlbmFtZSA9IHVybC5zbGljZSgyKTtcblx0XHRcdFx0aWYoIGZpbGVuYW1lIGluIGZpbGVzKVxuXHRcdFx0XHRcdHJldHVybiBmaWxlc1tmaWxlbmFtZV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvbGRyZXEodXJsKTtcblx0XHR9XG5cblx0XHRrbGFzcyA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKS5kZWZhdWx0O1xuXG5cdFx0TElTUy5yZXF1aXJlID0gb2xkcmVxO1xuXHR9XG5cdGVsc2UgaWYoIG9wdHMuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0a2xhc3MgPSBMSVNTKHtcblx0XHRcdC4uLm9wdHMsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogTElTU0F1dG9fQ29udGVudEdlbmVyYXRvclxuXHRcdH0pO1xuXHR9XG5cblx0aWYoIGtsYXNzID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuXG5cdGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cblx0cmV0dXJuIGtsYXNzO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIGludGVybmFsIHRvb2xzID09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRjb25zdCBhbnN3ZXIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cblx0aWYoYW5zd2VyID09PSBcIlwiKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIGFuc3dlclxufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn1cblxuXG5jb25zdCBjb252ZXJ0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn1cblxuZXhwb3J0IGNsYXNzIExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuXHRwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcGFyZUhUTUwoaHRtbD86IERvY3VtZW50RnJhZ21lbnQgfCBIVE1MRWxlbWVudCB8IHN0cmluZykge1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IG51bGw7XG5cblx0XHRpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuXG5cdFx0XHR0aGlzLmRhdGEgPSBodG1sO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHQvKlxuXHRcdFx0aHRtbCA9IGh0bWwucmVwbGFjZUFsbCgvXFwkXFx7KFtcXHddKylcXH0vZywgKF8sIG5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYDxsaXNzIHZhbHVlPVwiJHtuYW1lfVwiPjwvbGlzcz5gO1xuXHRcdFx0fSk7Ki9cblxuXHRcdFx0Ly9UT0RPOiAke30gaW4gYXR0clxuXHRcdFx0XHQvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG5cdFx0XHRcdC8vIC0gcmVnaXN0ZXIgZWxlbSArIGF0dHIgbmFtZVxuXHRcdFx0XHQvLyAtIHJlcGxhY2UuIFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gc3VwZXIucHJlcGFyZUhUTUwoaHRtbCk7XG5cdH1cblxuXHRvdmVycmlkZSBmaWxsQ29udGVudChzaGFkb3c6IFNoYWRvd1Jvb3QpIHtcblx0XHRcblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0aWYoIHRoaXMuZGF0YSAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3Qgc3RyID0gKHRoaXMuZGF0YSBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gZW5jb2RlSFRNTChzaGFkb3cuaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpID8/ICcnICkpO1xuXHRcdFx0c3VwZXIuc2V0VGVtcGxhdGUoIHN1cGVyLnByZXBhcmVIVE1MKHN0cikhICk7XG5cdFx0fVxuXG5cdFx0c3VwZXIuZmlsbENvbnRlbnQoc2hhZG93KTtcblxuXHRcdC8qXG5cdFx0Ly8gaHRtbCBtYWdpYyB2YWx1ZXMgY291bGQgYmUgb3B0aW1pemVkLi4uXG5cdFx0Y29uc3QgdmFsdWVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXHRcdGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuXHRcdFx0dmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXHRcdCovXG5cblx0fVxuXG5cdG92ZXJyaWRlIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50IHwgU2hhZG93Um9vdCB7XG5cdFx0XG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdGlmKCB0aGlzLmRhdGEgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHN0ciA9ICh0aGlzLmRhdGEgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IGVuY29kZUhUTUwoaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpID8/ICcnICkpO1xuXHRcdFx0c3VwZXIuc2V0VGVtcGxhdGUoIHN1cGVyLnByZXBhcmVIVE1MKHN0cikhICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29udGVudCA9IHN1cGVyLmdlbmVyYXRlKGhvc3QpO1xuXG5cdFx0Lypcblx0XHQvLyBodG1sIG1hZ2ljIHZhbHVlcy5cblx0XHQvLyBjYW4gYmUgb3B0aW1pemVkLi4uXG5cdFx0Y29uc3QgdmFsdWVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXHRcdGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuXHRcdFx0dmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXHRcdCovXG5cblx0XHQvLyBjc3MgcHJvcC5cblx0XHRjb25zdCBjc3NfYXR0cnMgPSBob3N0LmdldEF0dHJpYnV0ZU5hbWVzKCkuZmlsdGVyKCBlID0+IGUuc3RhcnRzV2l0aCgnY3NzLScpKTtcblx0XHRmb3IobGV0IGNzc19hdHRyIG9mIGNzc19hdHRycylcblx0XHRcdGhvc3Quc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtjc3NfYXR0ci5zbGljZSgnY3NzLScubGVuZ3RoKX1gLCBob3N0LmdldEF0dHJpYnV0ZShjc3NfYXR0cikpO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGltcG9ydENvbXBvbmVudHMgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50cztcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50ICA6IHR5cGVvZiBpbXBvcnRDb21wb25lbnQ7XG4gICAgICAgIHJlcXVpcmUgICAgICAgICAgOiB0eXBlb2YgcmVxdWlyZTtcbiAgICB9XG59XG5cbnR5cGUgaW1wb3J0Q29tcG9uZW50c19PcHRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSB7XG5cdGNkaXIgICA/OiBzdHJpbmd8bnVsbCxcblx0YnJ5dGhvbj86IHN0cmluZ3xudWxsLFxuXHRob3N0ICAgPzogQ29uc3RydWN0b3I8VD5cbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudHM8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHRcdFx0XHRcdFx0Y29tcG9uZW50czogc3RyaW5nW10sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0XHRcdFx0XHRcdGJyeXRob24gPSBudWxsLFxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudFxuXHRcdFx0XHRcdFx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+KSB7XG5cblx0Y29uc3QgcmVzdWx0czogUmVjb3JkPHN0cmluZywgTElTU0NvbnRyb2xlckNzdHI+ID0ge307XG5cblx0Zm9yKGxldCB0YWduYW1lIG9mIGNvbXBvbmVudHMpIHtcblxuXHRcdHJlc3VsdHNbdGFnbmFtZV0gPSBhd2FpdCBpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0Y2Rpcixcblx0XHRcdGJyeXRob24sXG5cdFx0XHRob3N0XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuY29uc3QgYnJ5X3dyYXBwZXIgPSBgZnJvbSBicm93c2VyIGltcG9ydCBzZWxmXG5cbmRlZiB3cmFwanMoanNfa2xhc3MpOlxuXG5cdGNsYXNzIFdyYXBwZXI6XG5cblx0XHRfanNfa2xhc3MgPSBqc19rbGFzc1xuXHRcdF9qcyA9IE5vbmVcblxuXHRcdGRlZiBfX2luaXRfXyh0aGlzLCAqYXJncyk6XG5cdFx0XHR0aGlzLl9qcyA9IGpzX2tsYXNzLm5ldygqYXJncylcblxuXHRcdGRlZiBfX2dldGF0dHJfXyh0aGlzLCBuYW1lOiBzdHIpOlxuXHRcdFx0cmV0dXJuIHRoaXMuX2pzW25hbWVdO1xuXG5cdFx0ZGVmIF9fc2V0YXR0cl9fKHRoaXMsIG5hbWU6IHN0ciwgdmFsdWUpOlxuXHRcdFx0aWYgbmFtZSA9PSBcIl9qc1wiOlxuXHRcdFx0XHRzdXBlcigpLl9fc2V0YXR0cl9fKG5hbWUsIHZhbHVlKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHRoaXMuX2pzW25hbWVdID0gdmFsdWVcblx0XG5cdHJldHVybiBXcmFwcGVyXG5cbnNlbGYud3JhcGpzID0gd3JhcGpzXG5gO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdHRhZ25hbWU6IHN0cmluZyxcblx0e1xuXHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0YnJ5dGhvbiA9IG51bGwsXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudCxcblx0XHRmaWxlcyAgID0gbnVsbFxuXHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4gJiB7ZmlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fG51bGx9ID0ge31cbikge1xuXG5cdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RhZ25hbWV9L2A7XG5cblx0aWYoIGZpbGVzID09PSBudWxsICkge1xuXHRcdGZpbGVzID0ge307XG5cblx0XHRjb25zdCBmaWxlID0gYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgPyAnaW5kZXguYnJ5JyA6ICdpbmRleC5qcyc7XG5cblx0XHRmaWxlc1tmaWxlXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn0ke2ZpbGV9YCwgdHJ1ZSkpITtcblxuXHRcdC8vVE9ETyEhIVxuXHRcdHRyeSB7XG5cdFx0XHRmaWxlc1tcImluZGV4Lmh0bWxcIl0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguaHRtbGAsIHRydWUpKSE7XG5cdFx0fSBjYXRjaChlKSB7XG5cblx0XHR9XG5cdFx0dHJ5IHtcblx0XHRcdGZpbGVzW1wiaW5kZXguY3NzXCIgXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5jc3NgICwgdHJ1ZSkpITtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFxuXHRcdH1cblx0fVxuXG5cdGlmKCBicnl0aG9uID09PSBcInRydWVcIiAmJiBmaWxlc1snaW5kZXguYnJ5J10gIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0Y29uc3QgY29kZSA9IGZpbGVzW1wiaW5kZXguYnJ5XCJdO1xuXG5cdFx0ZmlsZXNbJ2luZGV4LmpzJ10gPVxuYGNvbnN0ICRCID0gZ2xvYmFsVGhpcy5fX0JSWVRIT05fXztcblxuJEIucnVuUHl0aG9uU291cmNlKFxcYCR7YnJ5X3dyYXBwZXJ9XFxgLCBcIl9cIik7XG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHtjb2RlfVxcYCwgXCJfXCIpO1xuXG5jb25zdCBtb2R1bGUgPSAkQi5pbXBvcnRlZFtcIl9cIl07XG5leHBvcnQgZGVmYXVsdCBtb2R1bGUuV2ViQ29tcG9uZW50O1xuXG5gO1xuXHR9XG5cblx0Y29uc3QgaHRtbCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIHtodG1sLCBjc3MsIGhvc3R9KTtcbn1cblxuZnVuY3Rpb24gcmVxdWlyZSh1cmw6IFVSTHxzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPnxzdHJpbmcge1xuXHRyZXR1cm4gZmV0Y2godXJsKTtcbn1cblxuXG5MSVNTLmltcG9ydENvbXBvbmVudHMgPSBpbXBvcnRDb21wb25lbnRzO1xuTElTUy5pbXBvcnRDb21wb25lbnQgID0gaW1wb3J0Q29tcG9uZW50O1xuTElTUy5yZXF1aXJlICA9IHJlcXVpcmU7IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn0iLCJcbmltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbnR5cGUgTGlzdGVuZXJGY3Q8VCBleHRlbmRzIEV2ZW50PiA9IChldjogVCkgPT4gdm9pZDtcbnR5cGUgTGlzdGVuZXJPYmo8VCBleHRlbmRzIEV2ZW50PiA9IHsgaGFuZGxlRXZlbnQ6IExpc3RlbmVyRmN0PFQ+IH07XG50eXBlIExpc3RlbmVyPFQgZXh0ZW5kcyBFdmVudD4gPSBMaXN0ZW5lckZjdDxUPnxMaXN0ZW5lck9iajxUPjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50VGFyZ2V0MjxFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBFdmVudD4+IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuXG5cdG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBjYWxsYmFjazogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgb3B0aW9ucz86IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhbik6IHZvaWQge1xuXHRcdFxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblx0fVxuXG5cdG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQ8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4oZXZlbnQ6IEV2ZW50c1tUXSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBzdXBlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fVxuXG5cdG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGlzdGVuZXI6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQge1xuXG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0c3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbUV2ZW50MjxUIGV4dGVuZHMgc3RyaW5nLCBBcmdzPiBleHRlbmRzIEN1c3RvbUV2ZW50PEFyZ3M+IHtcblxuXHRjb25zdHJ1Y3Rvcih0eXBlOiBULCBhcmdzOiBBcmdzKSB7XG5cdFx0c3VwZXIodHlwZSwge2RldGFpbDogYXJnc30pO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2V0IHR5cGUoKTogVCB7IHJldHVybiBzdXBlci50eXBlIGFzIFQ7IH1cbn1cblxudHlwZSBJbnN0YW5jZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4+ID0ge1xuXHRbSyBpbiBrZXlvZiBUXTogSW5zdGFuY2VUeXBlPFRbS10+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXaXRoRXZlbnRzPFQgZXh0ZW5kcyBvYmplY3QsIEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4gPihldjogQ29uc3RydWN0b3I8VD4sIF9ldmVudHM6IEV2ZW50cykge1xuXG5cdHR5cGUgRXZ0cyA9IEluc3RhbmNlczxFdmVudHM+O1xuXG5cdGlmKCAhIChldiBpbnN0YW5jZW9mIEV2ZW50VGFyZ2V0KSApXG5cdFx0cmV0dXJuIGV2IGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+PjtcblxuXHQvLyBpcyBhbHNvIGEgbWl4aW5cblx0Ly8gQHRzLWlnbm9yZVxuXHRjbGFzcyBFdmVudFRhcmdldE1peGlucyBleHRlbmRzIGV2IHtcblxuXHRcdCNldiA9IG5ldyBFdmVudFRhcmdldDI8RXZ0cz4oKTtcblxuXHRcdGFkZEV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmFkZEV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdGRpc3BhdGNoRXZlbnQoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmRpc3BhdGNoRXZlbnQoLi4uYXJncyk7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gRXZlbnRUYXJnZXRNaXhpbnMgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgU2hhZG93Um9vdCB0b29scyA9PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRNYXRjaGVzKGV2OiBFdmVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXG5cdGxldCBlbGVtZW50cyA9IGV2LmNvbXBvc2VkUGF0aCgpLnNsaWNlKDAsLTIpLmZpbHRlcihlID0+ICEgKGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSApLnJldmVyc2UoKSBhcyBIVE1MRWxlbWVudFtdO1xuXG5cdGZvcihsZXQgZWxlbSBvZiBlbGVtZW50cyApXG5cdFx0aWYoZWxlbS5tYXRjaGVzKHNlbGVjdG9yKSApXG5cdFx0XHRyZXR1cm4gZWxlbTsgXG5cblx0cmV0dXJuIG51bGw7XG59IiwiXG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRzIHt9O1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN5bmMsIHdoZW5Jbml0aWFsaXplZCB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICAvLyBhc3luY1xuICAgICAgICBxcyA6IHR5cGVvZiBxcztcbiAgICAgICAgcXNvOiB0eXBlb2YgcXNvO1xuICAgICAgICBxc2E6IHR5cGVvZiBxc2E7XG4gICAgICAgIHFzYzogdHlwZW9mIHFzYztcblxuICAgICAgICAvLyBzeW5jXG4gICAgICAgIHFzU3luYyA6IHR5cGVvZiBxc1N5bmM7XG4gICAgICAgIHFzYVN5bmM6IHR5cGVvZiBxc2FTeW5jO1xuICAgICAgICBxc2NTeW5jOiB0eXBlb2YgcXNjU3luYztcblxuXHRcdGNsb3Nlc3Q6IHR5cGVvZiBjbG9zZXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzc19zZWxlY3RvcihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtsaXNzX3NlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0bGV0IHJlc3VsdCA9IGF3YWl0IHFzbzxUPihzZWxlY3RvciwgcGFyZW50KTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gcmVzdWx0IVxufVxuXG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc288TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VFtdPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXVtdID47XG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8VD4+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHByb21pc2VzW2lkeCsrXSA9IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc2M8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPihyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUW107XG5mdW5jdGlvbiBxc2FTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dW107XG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cmVzdWx0W2lkeCsrXSA9IGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFQ7XG5mdW5jdGlvbiBxc2NTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KHJlc3VsdCk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjbG9zZXN0PEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50KSB7XG5cblx0d2hpbGUodHJ1ZSkge1xuXHRcdHZhciByZXN1bHQgPSBlbGVtZW50LmNsb3Nlc3Q8RT4oc2VsZWN0b3IpO1xuXG5cdFx0aWYoIHJlc3VsdCAhPT0gbnVsbClcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuXHRcdGlmKCAhIChcImhvc3RcIiBpbiByb290KSApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGVsZW1lbnQgPSAocm9vdCBhcyBTaGFkb3dSb290KS5ob3N0O1xuXHR9XG59XG5cblxuLy8gYXN5bmNcbkxJU1MucXMgID0gcXM7XG5MSVNTLnFzbyA9IHFzbztcbkxJU1MucXNhID0gcXNhO1xuTElTUy5xc2MgPSBxc2M7XG5cbi8vIHN5bmNcbkxJU1MucXNTeW5jICA9IHFzU3luYztcbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG5MSVNTLmNsb3Nlc3QgPSBjbG9zZXN0OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL0xpZmVDeWNsZVwiO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vL1RPRE86IGV2ZW50cy50c1xuLy9UT0RPOiBnbG9iYWxDU1NSdWxlc1xuZXhwb3J0IHtMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5pbXBvcnQgXCIuL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnNcIjtcblxuZXhwb3J0IHtTaGFkb3dDZmd9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB7bGlzcywgbGlzc1N5bmN9IGZyb20gXCIuL2hlbHBlcnMvYnVpbGRcIjtcbmV4cG9ydCB7ZXZlbnRNYXRjaGVzLCBXaXRoRXZlbnRzLCBFdmVudFRhcmdldDIsIEN1c3RvbUV2ZW50Mn0gZnJvbSAnLi9oZWxwZXJzL2V2ZW50cyc7XG5leHBvcnQge2h0bWx9IGZyb20gXCIuL3V0aWxzXCI7XG5leHBvcnQgZGVmYXVsdCBMSVNTO1xuXG4vLyBmb3IgZGVidWcuXG5leHBvcnQge19leHRlbmRzfSBmcm9tIFwiLi9leHRlbmRzXCI7IiwiaW1wb3J0IHR5cGUgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB0eXBlIHsgTElTUyB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3Mge31cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7IG5ldyguLi5hcmdzOmFueVtdKTogVH07XG5cbmV4cG9ydCB0eXBlIENTU19SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MU3R5bGVFbGVtZW50fENTU1N0eWxlU2hlZXQ7XG5leHBvcnQgdHlwZSBDU1NfU291cmNlICAgPSBDU1NfUmVzb3VyY2UgfCBQcm9taXNlPENTU19SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIEhUTUxfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFRlbXBsYXRlRWxlbWVudHxOb2RlO1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnXG59O1xuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSB7XG4gICAgICAgIGV4dGVuZHM6IEV4dGVuZHNDdHIsIC8vIEpTIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsICAgLy8gSFRNTCBIb3N0XG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbn0gJiBDb250ZW50R2VuZXJhdG9yX09wdHM7XG5cbi8vVE9ETzogcmV3cml0ZS4uLlxuLy8gTElTU0NvbnRyb2xlclxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gSW5zdGFuY2VUeXBlPExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgICAgIGluZmVyIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgID4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsSG9zdENzdHI+IDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlciA/IExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+O1xuXG4vLyBsaWdodGVyIExJU1NIb3N0IGRlZiB0byBhdm9pZCB0eXBlIGlzc3Vlcy4uLlxuZXhwb3J0IHR5cGUgTEhvc3Q8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuXG4gICAgY29udGVudDogU2hhZG93Um9vdHxJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG4gICAgc2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBDU1NTZWxlY3Rvcjogc3RyaW5nO1xuXG59ICYgSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuZXhwb3J0IHR5cGUgTEhvc3RDc3RyPEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA9IHtcbiAgICBuZXcoLi4uYXJnczogYW55KTogTEhvc3Q8SG9zdENzdHI+O1xuXG4gICAgQ2ZnOiB7XG4gICAgICAgIGhvc3QgICAgICAgICAgICAgOiBIb3N0Q3N0cixcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuICAgICAgICBhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG4gICAgfVxuXG59ICYgSG9zdENzdHI7IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IEhUTUxFbGVtZW50IHwgdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG4gICAgaWYoIENsYXNzIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIENsYXNzID0gQ2xhc3MuY29uc3RydWN0b3IgYXMgdHlwZW9mIEhUTUxFbGVtZW50O1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXG4gICAgbGV0IGN1cnNvciA9IENsYXNzO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB3aGlsZSAoY3Vyc29yLl9fcHJvdG9fXyAhPT0gSFRNTEVsZW1lbnQpXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY3Vyc29yID0gY3Vyc29yLl9fcHJvdG9fXztcblxuICAgIC8vIGRpcmVjdGx5IGluaGVyaXQgSFRNTEVsZW1lbnRcbiAgICBpZiggISBjdXJzb3IubmFtZS5zdGFydHNXaXRoKCdIVE1MJykgJiYgISBjdXJzb3IubmFtZS5lbmRzV2l0aCgnRWxlbWVudCcpIClcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBodG1sdGFnID0gY3Vyc29yLm5hbWUuc2xpY2UoNCwgLTcpO1xuXG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCkge1xuXHRyZXR1cm4gQ0FOX0hBVkVfU0hBRE9XLmluY2x1ZGVzKCBfZWxlbWVudDJ0YWduYW1lKHRhZykgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5ET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn1cblxuLy8gZm9yIG1peGlucy5cbi8qXG5leHBvcnQgdHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXJcbiovXG5cbi8vIG1vdmVkIGhlcmUgaW5zdGVhZCBvZiBidWlsZCB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHMuXG5leHBvcnQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudD4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiBUIHtcbiAgICBcbiAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN0cmluZyArPSBgJHthcmdzW2ldfWA7XG4gICAgICAgIHN0cmluZyArPSBgJHtzdHJbaSsxXX1gO1xuICAgICAgICAvL1RPRE86IG1vcmUgcHJlLXByb2Nlc3Nlc1xuICAgIH1cblxuICAgIC8vIHVzaW5nIHRlbXBsYXRlIHByZXZlbnRzIEN1c3RvbUVsZW1lbnRzIHVwZ3JhZGUuLi5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHJpbmcudHJpbSgpO1xuXG4gICAgaWYoIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEgJiYgdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpXG4gICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkISBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudCEgYXMgdW5rbm93biBhcyBUO1xufSIsImltcG9ydCB0ZW1wbGF0ZSwgeyBIVE1MIH0gZnJvbSBcIlYzL3V0aWxzL3BhcnNlcnMvdGVtcGxhdGVcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCBlbmNvZGVIVE1MIGZyb20gXCJWMy91dGlscy9lbmNvZGVcIjtcblxuY29uc3QgcmVnZXggPSAvXFwkXFx7KC4rPylcXH0vZztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBwcmVwYXJlVGVtcGxhdGUoaHRtbDogSFRNTCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcblxuICAgICAgICBpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gaHRtbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8bGlzcyB2YWx1ZT1cIiR7bmFtZX1cIj48L2xpc3M+YDtcbiAgICAgICAgICAgIH0pOyovXG5cbiAgICAgICAgICAgIC8vVE9ETzogJHt9IGluIGF0dHJcbiAgICAgICAgICAgICAgICAvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG4gICAgICAgICAgICAgICAgLy8gLSByZWdpc3RlciBlbGVtICsgYXR0ciBuYW1lXG4gICAgICAgICAgICAgICAgLy8gLSByZXBsYWNlLiBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3VwZXIucHJlcGFyZVRlbXBsYXRlKGh0bWwpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuICAgICAgICBcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuICAgICAgICBpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZShyZWdleCwgKF8sIG1hdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzaGFkb3cuaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpO1xuICAgICAgICAgICAgICAgIGlmKCB2YWx1ZSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnOyBcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlSFRNTCh2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3VwZXIucHJlcGFyZVRlbXBsYXRlKHN0cik7XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci5maWxsQ29udGVudChzaGFkb3cpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIC8vIGh0bWwgbWFnaWMgdmFsdWVzIGNvdWxkIGJlIG9wdGltaXplZC4uLlxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG4gICAgICAgIGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuICAgICAgICAgICAgdmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuICAgICAgICAqL1xuICAgIH1cbn0iLCJpbXBvcnQgeyBpc1Jlc3NvdXJjZVJlYWR5LCBSZXNzb3VyY2UsIHdhaXRSZXNzb3VyY2UgfSBmcm9tIFwiVjMvdXRpbHMvbmV0d29yay9yZXNzb3VyY2VcIjtcbmltcG9ydCB7IFNoYWRvd0NmZyB9IGZyb20gXCJWMi90eXBlc1wiO1xuaW1wb3J0IHsgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCJWMi91dGlsc1wiO1xuaW1wb3J0IHRlbXBsYXRlLCB7IEhUTUwgfSBmcm9tIFwiVjMvdXRpbHMvcGFyc2Vycy90ZW1wbGF0ZVwiO1xuaW1wb3J0IHN0eWxlICAgLCB7Q1NTfSAgICBmcm9tIFwiVjMvdXRpbHMvcGFyc2Vycy9zdHlsZVwiO1xuXG50eXBlIFNUWUxFID0gQ1NTIHwgcmVhZG9ubHkgQ1NTW107XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHtcbiAgICBodG1sICAgPzogUmVzc291cmNlPEhUTUw+LFxuICAgIGNzcyAgICA/OiBSZXNzb3VyY2U8U1RZTEU+LFxuICAgIHNoYWRvdyA/OiBTaGFkb3dDZmd8bnVsbFxufVxuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuLy9jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG5cbiAgICAjc2hhZG93ICAgICA6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuXG4gICAgICAgIGNvbnN0IGlzUmVhZHkgPSBpc1Jlc3NvdXJjZVJlYWR5PEhUTUw+IChodG1sKVxuICAgICAgICAgICAgICAgICAgICAgJiYgaXNSZXNzb3VyY2VSZWFkeTxTVFlMRT4oY3NzKVxuICAgICAgICAgICAgICAgICAgICAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgaWYoIGlzUmVhZHkgKVxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlKGh0bWwsIGNzcyk7XG5cbiAgICAgICAgY29uc3Qgd2hlblJlYWR5OiBQcm9taXNlPFtIVE1MfHVuZGVmaW5lZCwgU1RZTEV8dW5kZWZpbmVkLCB1bmtub3duXT4gPSBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB3YWl0UmVzc291cmNlPEhUTUwgfHVuZGVmaW5lZD4oaHRtbCksXG4gICAgICAgICAgICB3YWl0UmVzc291cmNlPFNUWUxFfHVuZGVmaW5lZD4oY3NzKSxcbiAgICAgICAgICAgIHdoZW5ET01Db250ZW50TG9hZGVkKClcbiAgICAgICAgXSk7XG5cbiAgICAgICAgd2hlblJlYWR5LnRoZW4oIChhcmdzKSA9PiB0aGlzLnByZXBhcmUoYXJnc1swXSwgYXJnc1sxXSkgKTtcblxuICAgICAgICB0aGlzLmlzUmVhZHkgICA9IGlzUmVhZHk7XG4gICAgICAgIHRoaXMud2hlblJlYWR5ID0gd2hlblJlYWR5O1xuICAgIH1cblxuICAgIC8qKiByZWFkeSAqKiovXG5cbiAgICByZWFkb25seSB3aGVuUmVhZHk6IFByb21pc2U8dW5rbm93bj47XG4gICAgcmVhZG9ubHkgaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogcHJvY2VzcyByZXNzb3VyY2VzICoqL1xuXG4gICAgcHJvdGVjdGVkIHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gICAgICAgPSBbXTtcbiAgICBwcm90ZWN0ZWQgdGVtcGxhdGUgICA6IERvY3VtZW50RnJhZ21lbnR8bnVsbCA9IG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZShodG1sOiBIVE1MfHVuZGVmaW5lZCwgY3NzOiBTVFlMRXx1bmRlZmluZWQpIHtcbiAgICAgICAgaWYoIGh0bWwgIT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVUZW1wbGF0ZShodG1sKTtcbiAgICAgICAgaWYoIGNzcyAgIT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVTdHlsZSAgIChjc3MpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlVGVtcGxhdGUoaHRtbDogSFRNTCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGUoaHRtbCk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBwcmVwYXJlU3R5bGUoY3NzOiBTVFlMRSkge1xuXG4gICAgICAgIGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG4gICAgICAgICAgICBjc3MgPSBbY3NzXTtcblxuICAgICAgICB0aGlzLnN0eWxlc2hlZXRzID0gY3NzLm1hcChlID0+IHN0eWxlKGUpICk7XG4gICAgfVxuXG4gICAgLyoqKiBHZW5lcmF0ZSBjb250ZW50cyAqKiovXG5cbiAgICBpbml0Q29udGVudCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBtb2RlOlwib3BlblwifFwiY2xvc2VkXCJ8bnVsbCkge1xuXG4gICAgICAgIGxldCBjb250ZW50OiBTaGFkb3dSb290fEhUTUxFbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICBpZiggbW9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGVudCA9IHRhcmdldC5hdHRhY2hTaGFkb3coe21vZGV9KTtcbiAgICAgICAgICAgIGNvbnRlbnQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTLCAuLi50aGlzLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgfVxuICAgICAgICAvL1RPRE86IENTUyBmb3Igbm8gc2hhZG93ID8/P1xuICAgICAgICBcbiAgICAgICAgdGhpcy5maWxsQ29udGVudChjb250ZW50KTtcblxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBmaWxsQ29udGVudCh0YXJnZXQ6IFNoYWRvd1Jvb3R8SFRNTEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICBcbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGUgIT09IG51bGwpXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKCB0aGlzLmNyZWF0ZUNvbnRlbnQoKSApO1xuXG4gICAgICAgIC8vVE9ETy4uLlxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKHRhcmdldCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUhLmNsb25lTm9kZSh0cnVlKTtcbiAgICB9XG59IiwiaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIlYzL0NvbnRlbnRHZW5lcmF0b3JzL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCBMSVNTRnVsbCBmcm9tIFwiLi9MSVNTL0xJU1NGdWxsXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsVmFsdWU8RSBleHRlbmRzIEhUTUxFbGVtZW50LCBOIGV4dGVuZHMga2V5b2YgRT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZTogRSwgbmFtZTogTik6IHVuZGVmaW5lZHxFW05dXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5pdGlhbFZhbHVlPEUgZXh0ZW5kcyBIVE1MRWxlbWVudCwgTiBleHRlbmRzIGtleW9mIEUsIEQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGU6IEUsIG5hbWU6IE4sIGRlZmF1bHRWYWx1ZTogRCkgOiBEfEVbTl1cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsVmFsdWU8RSBleHRlbmRzIEhUTUxFbGVtZW50LCBOIGV4dGVuZHMga2V5b2YgRSwgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZTogRSwgbmFtZTogTiwgZGVmYXVsdFZhbHVlPzogRCk6IHVuZGVmaW5lZHxEfEVbTl0ge1xuXG4gICAgaWYoICEgT2JqZWN0Lmhhc093bihlLCBuYW1lKSApXG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgICBjb25zdCAgXyA9IGVbbmFtZV07XG4gICAgZGVsZXRlICAgICBlW25hbWVdO1xuICAgIHJldHVybiBfO1xufVxuXG50eXBlIENzdHI8VD4gPSBuZXcoLi4uYXJnczphbnlbXSkgPT4gVFxudHlwZSBMSVNTdjNfT3B0czxUIGV4dGVuZHMgQ3N0cjxDb250ZW50R2VuZXJhdG9yPiA+ID0ge1xuICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBULFxufSAmIENvbnN0cnVjdG9yUGFyYW1ldGVyczxUPlswXTtcblxuLy8gIGJ1aWxkZXJcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID0gQ3N0cjxDb250ZW50R2VuZXJhdG9yPj4ob3B0czogUGFydGlhbDxMSVNTdjNfT3B0czxUPj4gPSB7fSkge1xuICAgIFxuICAgIGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gb3B0cy5jb250ZW50X2dlbmVyYXRvciA/PyBDb250ZW50R2VuZXJhdG9yO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBnZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3IgPSBuZXcgY29udGVudF9nZW5lcmF0b3Iob3B0cyk7XG4gICAgXG4gICAgcmV0dXJuIGNsYXNzIF9MSVNTIGV4dGVuZHMgTElTU0Z1bGwge1xuXG4gICAgICAgIC8vIFRPRE86IG5vIGNvbnRlbnQgaWYuLi4gPz8/XG4gICAgICAgIC8vIG92ZXJyaWRlIGF0dGFjaFNoYWRvdyAgPz8/XG4gICAgICAgIHN0YXRpYyBvdmVycmlkZSByZWFkb25seSBTSEFET1dfTU9ERSAgICAgICA9IFwib3BlblwiO1xuICAgICAgICBzdGF0aWMgb3ZlcnJpZGUgcmVhZG9ubHkgQ09OVEVOVF9HRU5FUkFUT1IgPSBnZW5lcmF0b3I7XG5cbiAgICB9XG59XG5cbi8vIHVzZWQgZm9yIHBsdWdpbnMuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUzsiLCJpbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiVjMvQ29udGVudEdlbmVyYXRvcnMvQ29udGVudEdlbmVyYXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMSVNTQmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuXG4gICAgLypwcm90ZWN0ZWQgZ2V0SW5pdGlhbFZhbHVlPE4gZXh0ZW5kcyBrZXlvZiB0aGlzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lOiBOKTogdW5kZWZpbmVkfHRoaXNbTl1cbiAgICBwcm90ZWN0ZWQgZ2V0SW5pdGlhbFZhbHVlPE4gZXh0ZW5kcyBrZXlvZiB0aGlzLCBEPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lOiBOLCBkZWZhdWx0VmFsdWU6IEQpIDogRHx0aGlzW05dXG4gICAgcHJvdGVjdGVkIGdldEluaXRpYWxWYWx1ZTxOIGV4dGVuZHMga2V5b2YgdGhpcywgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZTogTiwgZGVmYXVsdFZhbHVlPzogRCk6IHVuZGVmaW5lZHxEfHRoaXNbTl0ge1xuICAgICAgICByZXR1cm4gZ2V0SW5pdGlhbFZhbHVlKHRoaXMsIG5hbWUsIGRlZmF1bHRWYWx1ZSk7XG4gICAgfSovXG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgU0hBRE9XX01PREUgICAgICA6IFwib3BlblwifFwiY2xvc2VkXCJ8bnVsbCA9IG51bGw7XG4gICAgLy8gVE9ETzogc3RhdGljIGNhY2hlIGdldHRlciArIHVzZSBzdGF0aWMgSFRNTC9DU1MuXG4gICAgc3RhdGljIHJlYWRvbmx5IENPTlRFTlRfR0VORVJBVE9SOiBDb250ZW50R2VuZXJhdG9yfG51bGwgPSBudWxsO1xuXG4gICAgcmVhZG9ubHkgY29udGVudCAgOiBTaGFkb3dSb290fEhUTUxFbGVtZW50ICAgICAgICA9IHRoaXM7XG4gICAgcmVhZG9ubHkgaG9zdCAgICAgOiBIVE1MRWxlbWVudCAgICAgICAgICAgICAgICAgICA9IHRoaXM7XG4gICAgcmVhZG9ubHkgY29udHJvbGVyOiBPbWl0PHRoaXMsIGtleW9mIEhUTUxFbGVtZW50PiA9IHRoaXM7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zdCBrbGFzcyA9IHRoaXMuY29uc3RydWN0b3IgYXMgdHlwZW9mIExJU1NCYXNlO1xuXG4gICAgICAgIGlmKCBrbGFzcy5DT05URU5UX0dFTkVSQVRPUiAhPT0gbnVsbCApXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBrbGFzcy5DT05URU5UX0dFTkVSQVRPUi5pbml0Q29udGVudCh0aGlzLCBrbGFzcy5TSEFET1dfTU9ERSk7XG4gICAgfVxuXG5cbiAgICAvLyBkZWZpbmUgZm9yIGF1dG8tY29tcGxldGUuXG4gICAgc3RhdGljIG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGR2YWw6IHN0cmluZ3xudWxsLCBuZXd2YWw6IHN0cmluZ3xudWxsKXt9XG59IiwiZXhwb3J0IHtkZWZhdWx0IGFzIGRlZmF1bHR9IGZyb20gXCIuL0xJU1NVcGRhdGUudHNcIjsiLCJpbXBvcnQgTElTU0Jhc2UgZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTElTU1VwZGF0ZSBleHRlbmRzIExJU1NCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcyk7XG4gICAgfVxuXG4gICAgI3JlcXVlc3RJRDogbnVsbHxudW1iZXIgPSBudWxsO1xuICAgICN1cGRhdGVSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICAjaXNWaXNpYmxlICAgICAgID0gZmFsc2U7XG5cbiAgICBzdGF0aWMgcHJvY2Vzc0ludGVyc2VjdGlvbk9ic2VydmVyKGVudHJpZXM6IEludGVyc2VjdGlvbk9ic2VydmVyRW50cnlbXSkge1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCAgICAgPSBlbnRyaWVzW2ldLnRhcmdldCBhcyBMSVNTVXBkYXRlO1xuICAgICAgICAgICAgY29uc3QgaXNWaXNpYmxlICA9IGVudHJpZXNbaV0uaXNJbnRlcnNlY3Rpbmc7XG5cbiAgICAgICAgICAgIHRhcmdldC4jaXNWaXNpYmxlID0gaXNWaXNpYmxlO1xuXG4gICAgICAgICAgICBpZiggISBpc1Zpc2libGUgJiYgdGFyZ2V0LiNyZXF1ZXN0SUQgIT09IG51bGwpXG4gICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGFyZ2V0LiNyZXF1ZXN0SUQpO1xuXG4gICAgICAgICAgICBpZiggaXNWaXNpYmxlICYmIHRhcmdldC4jdXBkYXRlUmVxdWVzdGVkICYmIHRhcmdldC4jcmVxdWVzdElEID09PSBudWxsIClcbiAgICAgICAgICAgICAgICB0YXJnZXQuI3NjaGVkdWxlVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAjc2NoZWR1bGVVcGRhdGUoKSB7XG4gICAgICAgIHRoaXMuI3JlcXVlc3RJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jcmVxdWVzdElEICAgICAgID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuI3VwZGF0ZVJlcXVlc3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXF1ZXN0VXBkYXRlKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLiN1cGRhdGVSZXF1ZXN0ZWQgKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuI3VwZGF0ZVJlcXVlc3RlZCA9IHRydWU7XG5cbiAgICAgICAgaWYoICEgdGhpcy4jaXNWaXNpYmxlIClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLiNzY2hlZHVsZVVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblVwZGF0ZSgpIHtcblxuICAgIH1cbn1cblxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoIExJU1NVcGRhdGUucHJvY2Vzc0ludGVyc2VjdGlvbk9ic2VydmVyICk7IiwiaW1wb3J0IGRlZmluZSwgeyBXYWl0aW5nRGVmaW5lIH0gZnJvbSBcIlYzL2RlZmluZS9kZWZpbmVcIjtcbmltcG9ydCBMSVNTIGZyb20gXCJWM1wiO1xuaW1wb3J0IEF1dG9Db250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9BdXRvQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IGlzUGFnZUxvYWRlZCBmcm9tIFwiVjMvdXRpbHMvRE9NL2lzUGFnZUxvYWRlZFwiO1xuaW1wb3J0IHdoZW5QYWdlTG9hZGVkIGZyb20gXCJWMy91dGlscy9ET00vd2hlblBhZ2VMb2FkZWRcIjtcbmltcG9ydCBmZXRjaFRleHQgZnJvbSBcIlYzL3V0aWxzL25ldHdvcmsvZmV0Y2hUZXh0XCI7XG5pbXBvcnQgZXhlY3V0ZSBmcm9tIFwiVjMvdXRpbHMvZXhlY3V0ZVwiO1xuXG5jb25zdCBzY3JpcHQgPSAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ3NjcmlwdDppcyhbbGlzcy1hdXRvXSxbbGlzcy1jZGlyXSxbbGlzcy1zd10pJyk7XG5cbmV4cG9ydCBjb25zdCBMSVNTX01PREUgICAgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnbGlzcy1tb2RlJykgPz8gbnVsbDtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NESVIgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnbGlzcy1jZGlyJykgPz8gbnVsbDtcblxuLy8gVE9ETzogZGVmYXVsdCA/XG5jb25zdCBTV19QQVRIICAgICAgICAgICAgID0gc2NyaXB0Py5nZXRBdHRyaWJ1dGUoJ2xpc3Mtc3cnKSA/PyBudWxsO1xuXG5pZihMSVNTX01PREUgPT09IFwiYXV0by1sb2FkXCIgJiYgREVGQVVMVF9DRElSICE9PSBudWxsKSB7XG4gICAgaWYoICEgaXNQYWdlTG9hZGVkKCkgKVxuICAgICAgICBhd2FpdCB3aGVuUGFnZUxvYWRlZCgpO1xuICAgIGF1dG9sb2FkKERFRkFVTFRfQ0RJUik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvbG9hZChjZGlyOiBzdHJpbmcpIHtcblxuICAgIGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgaWYoIFNXX1BBVEggPT09IG51bGwgKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJZb3UgYXJlIHVzaW5nIExJU1MgQXV0byBtb2RlIHdpdGhvdXQgc3cuanMuXCIpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoU1dfUEFUSCwge3Njb3BlOiBcIi9cIn0pO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYoIGNkaXJbY2Rpci5sZW5ndGgtMV0gIT09ICcvJylcbiAgICAgICAgY2RpciArPSAnLyc7XG5cbiAgICAvL2NvbnN0IGJyeXRob24gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwiYnJ5dGhvblwiKTtcblxuICAgIC8vIG9ic2VydmUgZm9yIG5ldyBpbmplY3RlZCB0YWdzLlxuICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKCAobXV0YXRpb25zKSA9PiB7XG4gICAgICAgIGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuICAgICAgICAgICAgZm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuICAgICAgICAgICAgICAgIGlmKCBhZGRpdGlvbi5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkhUTUxFbGVtZW50XCIgKVxuICAgICAgICAgICAgICAgIC8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9XSUNHL3dlYmNvbXBvbmVudHMvaXNzdWVzLzEwOTcjaXNzdWVjb21tZW50LTI2NjUwOTIzMTVcbiAgICAgICAgICAgICAgICAvLyBpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxVbmtub3duRWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgYWRkVGFnKGFkZGl0aW9uIGFzIEhUTUxFbGVtZW50KVxuXG4gICAgfSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuICAgIGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCI6bm90KDpkZWZpbmVkKVwiKSApXG4gICAgICAgIGFkZFRhZyggZWxlbSApO1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gYWRkVGFnKHRhZzogSFRNTEVsZW1lbnQpIHtcblxuICAgICAgICBhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuICAgICAgICBjb25zdCB0YWduYW1lID0gdGFnLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiggIFdhaXRpbmdEZWZpbmUuaGFzKHRhZ25hbWUpXG4gICAgICAgICAgICAvLyBjb3VsZCBiZSBkZWZpbmVkLCBidXQgbm90IHlldCB1cGdyYWRlZFxuICAgICAgICAgfHwgY3VzdG9tRWxlbWVudHMuZ2V0KHRhZ25hbWUpICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbG9hZENvbXBvbmVudCh0YWduYW1lLCB7XG4gICAgICAgICAgICAvL2JyeXRob24sXG4gICAgICAgICAgICBjZGlyXG4gICAgICAgIH0pO1x0XHRcbiAgICB9XG59XG5cbi8qKioqKi9cblxudHlwZSBsb2FkQ29tcG9uZW50X09wdHMgPSB7XG5cdGNkaXIgICA/OiBzdHJpbmd8bnVsbFxufTtcblxudHlwZSBDc3RyPFQ+ID0gKC4uLmFyZ3M6IGFueVtdKSA9PiBUO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdHRhZ25hbWU6IHN0cmluZyxcblx0e1xuXHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0Ly8gYnJ5dGhvbiA9IG51bGxcblx0fTogbG9hZENvbXBvbmVudF9PcHRzID0ge31cbik6IFByb21pc2U8Q3N0cjxUPj4ge1xuXG5cdFdhaXRpbmdEZWZpbmUuYWRkKHRhZ25hbWUpO1xuXG4gICAgbGV0IHRydWVfdGFnZGlyID0gTElTU0NvbnRleHQ/Lm92ZXJyaWRlX3RhZ3M/Llt0YWduYW1lXSA/PyB0YWduYW1lOyAgICAgXG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RydWVfdGFnZGlyfS9gO1xuXG5cdGNvbnN0IGZpbGVzOiBSZWNvcmQ8c3RyaW5nLHN0cmluZ3x1bmRlZmluZWQ+ID0ge307XG5cblx0Ly8gc3RyYXRzIDogSlMgLT4gQnJ5IC0+IEhUTUwrQ1NTIChjZiBzY3JpcHQgYXR0cikuXG5cbiAgICBmaWxlc1tcImpzXCJdID0gYXdhaXQgZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5qc2AsIHRydWUpO1xuXG4gICAgaWYoIGZpbGVzW1wianNcIl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyB0cnkvY2F0Y2ggP1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtcbiAgICAgICAgICAgIGZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguaHRtbGAsIHRydWUpISxcbiAgICAgICAgICAgIGZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguY3NzYCAsIHRydWUpIVxuICAgICAgICBdO1xuXG4gICAgICAgIFtmaWxlc1tcImh0bWxcIl0sIGZpbGVzW1wiY3NzXCIgXV0gPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIGNvbXBvX2Rpcik7XG59XG5cbi8vVE9ETzogcmVuYW1lIGZyb20gZmlsZXMgP1xuYXN5bmMgZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogUmVjb3JkPHN0cmluZywgYW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW4gOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgIFxuICAgIGxldCBrbGFzcztcbiAgICBpZiggXCJqc1wiIGluIGZpbGVzIClcbiAgICAgICAga2xhc3MgPSAoYXdhaXQgZXhlY3V0ZTxhbnk+KGZpbGVzW1wianNcIl0sIFwianNcIiwgb3JpZ2luKSkuZGVmYXVsdDtcblxuICAgIGlmKCBrbGFzcyA9PT0gdW5kZWZpbmVkIClcbiAgICAgICAga2xhc3MgPSBMSVNTKHtcbiAgICAgICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBBdXRvQ29udGVudEdlbmVyYXRvcixcbiAgICAgICAgICAgIC4uLmZpbGVzXG4gICAgICAgIH0pO1xuXG4gICAgZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuICAgIHJldHVybiBrbGFzcztcbn0iLCJpbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiVjMvQ29udGVudEdlbmVyYXRvcnMvQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgX3doZW5EZWZpbmVkUHJvbWlzZXMgfSBmcm9tIFwiLi93aGVuRGVmaW5lZFwiO1xuXG5leHBvcnQgY29uc3QgV2FpdGluZ0RlZmluZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBkZWZpbmUodGFnbmFtZTogc3RyaW5nLCBLbGFzczogbmV3KC4uLmFyZ3M6YW55W10pID0+IEhUTUxFbGVtZW50KSB7XG5cbiAgICAvL1RPRE86IFB5dGhvbiBjbGFzcy4uLlxuXG4gICAgLy9UT0RPOiB0eXBlIHNhZmVcbiAgICBpZiggXCJDT05URU5UX0dFTkVSQVRPUlwiIGluIEtsYXNzICkge1xuICAgICAgICBjb25zdCBnZW5lcmF0b3IgPSBLbGFzcy5DT05URU5UX0dFTkVSQVRPUiBhcyBDb250ZW50R2VuZXJhdG9yO1xuXG4gICAgICAgIGlmKCAhIGdlbmVyYXRvci5pc1JlYWR5ICkge1xuICAgICAgICAgICAgV2FpdGluZ0RlZmluZS5hZGQodGFnbmFtZSk7XG4gICAgICAgICAgICBhd2FpdCBnZW5lcmF0b3Iud2hlblJlYWR5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgV2FpdGluZ0RlZmluZS5kZWxldGUodGFnbmFtZSk7XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIEtsYXNzKTtcblxuICAgIGNvbnN0IHAgPSBfd2hlbkRlZmluZWRQcm9taXNlcy5nZXQoS2xhc3MpO1xuICAgIGlmKCBwICE9PSB1bmRlZmluZWQgKVxuICAgICAgICBwLnJlc29sdmUoKTtcbn1cblxuaW1wb3J0IExJU1MgZnJvbSBcIlYzL0xJU1NcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCJWMy9MSVNTXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZTogdHlwZW9mIGRlZmluZTtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lID0gZGVmaW5lOyIsImltcG9ydCBkZWZpbmUgICAgICBmcm9tIFwiLi9kZWZpbmVcIjtcbmltcG9ydCBpc0RlZmluZWQgICBmcm9tIFwiLi9pc0RlZmluZWRcIjtcbmltcG9ydCB3aGVuRGVmaW5lZCBmcm9tIFwiLi93aGVuRGVmaW5lZFwiO1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiVjMvTElTU1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIlYzL0xJU1NcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgIDogdHlwZW9mIGRlZmluZTtcbiAgICAgICAgaXNEZWZpbmVkOiB0eXBlb2YgaXNEZWZpbmVkO1xuICAgICAgICB3aGVuRGVmaW5lZCAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgICAgICA9IGRlZmluZTtcbkxJU1MuaXNEZWZpbmVkICAgPSBpc0RlZmluZWQ7XG5MSVNTLndoZW5EZWZpbmVkID0gd2hlbkRlZmluZWQ7XG5cbmV4cG9ydCB7ZGVmaW5lLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkfTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0RlZmluZWQoZWxlbTogc3RyaW5nfChuZXcoLi4uYXJnczphbnlbXSk9PkhUTUxFbGVtZW50KSk6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSkgIT09IG51bGw7XG59IiwidHlwZSBDc3RyPFQ+ID0gbmV3KC4uLmFyZ3M6YW55W10pPT4gVDtcblxuZXhwb3J0IGNvbnN0IF93aGVuRGVmaW5lZFByb21pc2VzID0gbmV3IFdlYWtNYXA8Q3N0cjxIVE1MRWxlbWVudD4sIFByb21pc2VXaXRoUmVzb2x2ZXJzPHZvaWQ+PigpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KGVsZW06IHN0cmluZ3xDc3RyPFQ+KTogUHJvbWlzZTxDc3RyPFQ+PiB7XG4gICAgXG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoZWxlbSkgYXMgQ3N0cjxUPjtcblxuICAgIGlmKCBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0pICE9PSBudWxsKVxuICAgICAgICByZXR1cm4gZWxlbSBhcyBDc3RyPFQ+O1xuXG4gICAgbGV0IHAgPSBfd2hlbkRlZmluZWRQcm9taXNlcy5nZXQoZWxlbSk7XG4gICAgaWYoIHAgPT09IHVuZGVmaW5lZCApe1xuICAgICAgICBwID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgICAgIF93aGVuRGVmaW5lZFByb21pc2VzLnNldChlbGVtLCBwKTtcbiAgICB9XG5cbiAgICBhd2FpdCBwLnByb21pc2U7XG4gICAgcmV0dXJuIGVsZW07XG59IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vTElTU1wiO1xuXG4vLyBIRVJFLi4uXG5cbmltcG9ydCBcIi4vZGVmaW5lXCI7XG5pbXBvcnQgXCIuL2RlZmluZS9hdXRvbG9hZFwiO1xuXG5pbXBvcnQgXCIuL3V0aWxzL3BhcnNlcnNcIjtcbmltcG9ydCBcIi4vdXRpbHMvbmV0d29yay9yZXF1aXJlXCI7XG5cbmltcG9ydCBcIi4vdXRpbHMvdGVzdHMvYXNzZXJ0RWxlbWVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBMSVNTOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzUGFnZUxvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiXG59XG5cbi8qXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufSovIiwiaW1wb3J0IGlzUGFnZUxvYWRlZCBmcm9tIFwiLi9pc1BhZ2VMb2FkZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzUGFnZUxvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcmVzb2x2ZSBhcyBhbnksIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn1cblxuLypcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59Ki8iLCJjb25zdCBjb252ZXJ0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuY29kZUhUTUwodGV4dDogc3RyaW5nKSB7XG5cdGNvbnZlcnRlci50ZXh0Q29udGVudCA9IHRleHQ7XG5cdHJldHVybiBjb252ZXJ0ZXIuaW5uZXJIVE1MO1xufSIsImltcG9ydCBleGVjdXRlSlMgZnJvbSBcIi4vanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZTxUPihjb2RlOiBzdHJpbmcsIHR5cGU6IFwianNcIiwgb3JpZ2luOiBzdHJpbmcpOiBQcm9taXNlPFQ+IHtcblxuICAgIGlmKCB0eXBlID09PSBcImpzXCIgKVxuICAgICAgICByZXR1cm4gYXdhaXQgZXhlY3V0ZUpTPFQ+KGNvZGUsIG9yaWdpbik7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJycpO1xufSIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVKUzxUPihjb2RlOiBzdHJpbmcsIG9yaWdpbjogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NvZGVdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcbiAgICBjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuICAgIGNvbnN0IGlkID0gdXJsLnNsaWNlKHVybC5sYXN0SW5kZXhPZignLycpICsgMSApO1xuICAgICgoZ2xvYmFsVGhpcy5MSVNTQ29udGV4dCA/Pz17fSkuZXhlY3V0ZSA/Pz0ge3VybF9tYXA6IHt9fSkudXJsX21hcFtpZF0gPSBvcmlnaW47XG5cbiAgICBjb25zdCByZXN1bHQgPSAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJsKSk7XG4gICAgXG4gICAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuXG4gICAgcmV0dXJuIHJlc3VsdCBhcyB1bmtub3duIGFzIFQ7XG59XG5cblxuZGVjbGFyZSBnbG9iYWwge1xuXG4gICAgaW50ZXJmYWNlIExJU1NDb250ZXh0IHtcbiAgICAgICAgZXhlY3V0ZT86IHtcbiAgICAgICAgICAgIHVybF9tYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBMSVNTQ29udGV4dDogTElTU0NvbnRleHQ7XG4gICAgXG59IiwiLy8gaW4gYXV0by1tb2RlIHVzZSBTZXJ2aWNlV29ya2VyIHRvIGhpZGUgNDA0IGVycm9yIG1lc3NhZ2VzLlxuLy8gaWYgcGxheWdyb3VuZCBmaWxlcywgdXNlIHRoZW0uXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBmZXRjaFRleHQodXJpOiBzdHJpbmd8VVJMLCBoaWRlNDA0OiBib29sZWFuID0gZmFsc2UpIHtcblxuICAgIGNvbnN0IGZldGNoQ29udGV4dCA9IGdsb2JhbFRoaXMuTElTU0NvbnRleHQ/LmZldGNoO1xuICAgIGlmKCBmZXRjaENvbnRleHQgIT09IHVuZGVmaW5lZCApIHsgLy8gZm9yIHRoZSBwbGF5Z3JvdW5kXG4gICAgICAgIGNvbnN0IHBhdGggPSBuZXcgVVJMKHVyaSwgZmV0Y2hDb250ZXh0LmN3ZCApO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGZldGNoQ29udGV4dC5maWxlc1twYXRoLnRvU3RyaW5nKCldO1xuICAgICAgICBpZiggdmFsdWUgPT09IFwiXCIgKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgaWYoIHZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IGhpZGU0MDRcbiAgICAgICAgICAgICAgICAgICAgICAgID8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDoge307XG5cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcbiAgICBpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBpZiggaGlkZTQwNCAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG4gICAgaWYoYW5zd2VyID09PSBcIlwiKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGFuc3dlclxufVxuXG5cblxuZGVjbGFyZSBnbG9iYWwge1xuXG4gICAgaW50ZXJmYWNlIExJU1NDb250ZXh0IHtcbiAgICAgICAgZmV0Y2g/OiB7XG4gICAgICAgICAgICBjd2QgIDogc3RyaW5nLFxuICAgICAgICAgICAgZmlsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBMSVNTQ29udGV4dDogTElTU0NvbnRleHQ7XG59IiwiaW1wb3J0IHsgTElTUyB9IGZyb20gXCJWMi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgZmV0Y2hUZXh0IGZyb20gXCIuL2ZldGNoVGV4dFwiO1xuXG4vLyBAdHMtaWdub3JlXG5nbG9iYWxUaGlzLnJlcXVpcmUgPSBhc3luYyBmdW5jdGlvbih1cmw6IHN0cmluZykge1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgRXJyb3IoKS5zdGFjayE7XG5cbiAgICBsZXQgY2FsbGVyOiBzdHJpbmc7XG4gICAgaWYoIHN0YWNrLnN0YXJ0c1dpdGgoXCJFcnJvclwiKSApIHsgICAvLyBDaHJvbWUgP1xuICAgICAgICBjYWxsZXIgPSBzdGFjay5zcGxpdCgnXFxuJylbMSsxXS5zbGljZSg3KTtcbiAgICB9IGVsc2UgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGRiA/XG4gICAgICAgIGNhbGxlciA9IHN0YWNrLnNwbGl0KCdcXG4nKVsxXS5zbGljZSgxKTtcbiAgICB9XG5cbiAgICBpZiggY2FsbGVyLnN0YXJ0c1dpdGgoJ2Jsb2I6JykgKSB7XG5cbiAgICAgICAgY2FsbGVyID0gY2FsbGVyLnNsaWNlKGNhbGxlci5sYXN0SW5kZXhPZignLycpICsgMSApO1xuICAgICAgICBjYWxsZXIgPSBjYWxsZXIuc2xpY2UoMCwgY2FsbGVyLmluZGV4T2YoJzonKSk7XG5cbiAgICAgICAgdXJsID0gTElTU0NvbnRleHQuZXhlY3V0ZSEudXJsX21hcFtjYWxsZXJdICsgdXJsO1xuICAgICAgICBcbiAgICAgICAgLy9UT0RPOiByZXdyaXRlIFVSTC4uLlxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybiggY2FsbGVyICk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInJlcXVpcmUgZnJvbSBub24tYmxvYiBpbXBvcnQsIHVuaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmV2ZXJpZnkgcGxheWdyb3VuZFxuXG4gICAgcmV0dXJuIGF3YWl0IGZldGNoVGV4dCh1cmwpO1xufSIsImV4cG9ydCB0eXBlIFJlc3NvdXJjZTxUPiA9XG4gICAgICBUXG4gICAgfCBQcm9taXNlPFQ+XG4gICAgfCAoVCBleHRlbmRzIHN0cmluZyAgICAgICAgID8gUHJvbWlzZTxSZXNwb25zZT4gfCBSZXNwb25zZSA6IG5ldmVyKVxuICAgIHwgKFQgZXh0ZW5kcyBBcnJheTxpbmZlciBFPiA/IFJlc3NvdXJjZTxFPltdICAgICAgICAgICAgICAgOiBuZXZlcik7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Jlc3NvdXJjZVJlYWR5PFQ+KHJlczogUmVzc291cmNlPFQ+fHVuZGVmaW5lZCk6IHJlcyBpcyBUfHVuZGVmaW5lZCB7XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShyZXMpIClcbiAgICAgICAgcmV0dXJuIHJlcy5ldmVyeSggZSA9PiBpc1Jlc3NvdXJjZVJlYWR5KGUpICk7XG5cbiAgICByZXR1cm4gcmVzID09PSB1bmRlZmluZWQgfHwgIShyZXMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHJlcyBpbnN0YW5jZW9mIFJlc3BvbnNlKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRSZXNzb3VyY2U8VD4ocmVzOiBSZXNzb3VyY2U8VD4pOiBQcm9taXNlPFQ+IHtcblxuICAgIGlmKCBBcnJheS5pc0FycmF5KHJlcykgKVxuICAgICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocmVzLm1hcCggZSA9PiB3YWl0UmVzc291cmNlKGUpKSkgYXMgVDtcblxuICAgIGlmKCByZXMgaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgICAgICByZXMgPSBhd2FpdCByZXM7XG5cbiAgICBpZiggcmVzIGluc3RhbmNlb2YgUmVzcG9uc2UpXG4gICAgICAgIHJlcyA9IGF3YWl0IHJlcy50ZXh0KCkgYXMgVDtcblxuICAgIHJldHVybiByZXMgYXMgVDtcbn0iLCJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuY29uc3QgZGYgPSB0ZW1wbGF0ZS5jb250ZW50O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oLi4ucmF3OiBUZW1wbGF0ZTxzdHJpbmc+KTogVCB7XG4gICAgXG4gICAgbGV0IGVsZW0gPSByYXdbMF07XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShlbGVtKSApIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0ciA9IHJhd1swXSBhcyBUZW1wbGF0ZVN0cmluZ3NBcnJheTtcblxuICAgICAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgcmF3Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gcmF3W2ldO1xuICAgICAgICAgICAgc3RyaW5nICs9IHN0cltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW0gPSBzdHJpbmc7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gZWxlbTtcblxuICAgIGlmKCBkZi5jaGlsZE5vZGVzLmxlbmd0aCAhPT0gMSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3JcIik7XG5cbiAgICByZXR1cm4gZGYuZmlyc3RDaGlsZCBhcyBUO1xufSIsImltcG9ydCBMSVNTIGZyb20gXCJWMy9MSVNTXCI7XG5cbmltcG9ydCBodG1sICAgICBmcm9tIFwiLi9odG1sXCJcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tIFwiLi90ZW1wbGF0ZVwiO1xuaW1wb3J0IHN0eWxlICAgIGZyb20gXCIuL3N0eWxlXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiVjMvTElTU1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBodG1sICAgIDogdHlwZW9mIGh0bWw7XG4gICAgICAgIHRlbXBsYXRlOiB0eXBlb2YgdGVtcGxhdGU7XG4gICAgICAgIHN0eWxlICAgOiB0eXBlb2Ygc3R5bGU7XG4gICAgfVxufVxuXG5MSVNTLnN0eWxlICAgID0gc3R5bGU7XG5MSVNTLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5MSVNTLmh0bWwgICAgID0gaHRtbDtcblxuZXhwb3J0IHtzdHlsZSwgdGVtcGxhdGUsIGh0bWx9OyIsImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgQ1NTICAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHlsZSguLi5yYXc6IFRlbXBsYXRlPENTUz4pOiBDU1NTdHlsZVNoZWV0IHtcblxuICAgIGxldCBlbGVtID0gcmF3WzBdO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0IClcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuICAgICAgICByZXR1cm4gZWxlbS5zaGVldCE7XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShlbGVtKSApIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0ciA9IHJhd1swXSBhcyBUZW1wbGF0ZVN0cmluZ3NBcnJheTtcblxuICAgICAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgcmF3Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gcmF3W2ldO1xuICAgICAgICAgICAgc3RyaW5nICs9IHN0cltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW0gPSBzdHJpbmc7XG4gICAgfVxuXG4gICAgaWYoIHR5cGVvZiBlbGVtICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlbGVtKTtcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3Vyc1wiKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgc3R5bGUucmVwbGFjZVN5bmMoZWxlbSk7XG4gICAgcmV0dXJuIHN0eWxlO1xufSIsImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgSFRNTCAgPSBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUoIC4uLnJhdzpUZW1wbGF0ZTxIVE1MPik6IERvY3VtZW50RnJhZ21lbnQge1xuXG4gICAgbGV0IGVsZW0gPSByYXdbMF07XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShlbGVtKSApIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0ciA9IHJhd1swXSBhcyBUZW1wbGF0ZVN0cmluZ3NBcnJheTtcblxuICAgICAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgcmF3Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gcmF3W2ldO1xuICAgICAgICAgICAgc3RyaW5nICs9IHN0cltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW0gPSBzdHJpbmc7XG4gICAgfVxuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgICAgcmV0dXJuIGVsZW0uY2xvbmVOb2RlKHRydWUpIGFzIERvY3VtZW50RnJhZ21lbnQ7XG5cbiAgICAvLyBtdXN0IHVzZSB0ZW1wbGF0ZSBhcyBEb2N1bWVudEZyYWdtZW50IGRvZXNuJ3QgaGF2ZSAuaW5uZXJIVE1MXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblxuICAgIGlmKHR5cGVvZiBlbGVtID09PSAnc3RyaW5nJylcbiAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gZWxlbS50cmltKCk7XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgICAvLyBwcmV2ZW50cyBpc3N1ZSBpZiBlbGVtIGlzIGxhdHRlciB1cGRhdGVkLlxuICAgICAgICAgICAgZWxlbSA9IGVsZW0uY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBcbiAgICAgICAgdGVtcGxhdGUuYXBwZW5kKCBlbGVtICk7XG4gICAgfVxuXG4gICAgLy9pZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAvLyAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuICAgIFxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ITtcbn0iLCJ0eXBlIE9wdGlvbnMgPSB7XG4gICAgc2hhZG93X2h0bWw/OiBzdHJpbmcsXG4gICAgY3NzICAgICAgICA/OiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PlxufVxuXG5mdW5jdGlvbiB3YWl0RnJhbWUoKSB7XG4gICAgY29uc3QgeyBwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCAoKSA9PiByZXNvbHZlKCkgKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhc3NlcnRFbGVtZW50KHRhZ25hbWU6IHN0cmluZywgb3B0czogT3B0aW9ucyA9IHt9KSB7XG4gICAgXG4gICAgY29uc3Qgc2hhZG93X2h0bWwgPSBvcHRzLnNoYWRvd19odG1sID8/IG51bGw7XG4gICAgY29uc3QgY3NzICAgICAgICAgPSBvcHRzLmNzcyAgICAgICAgID8/IHt9O1xuXG5cbiAgICBhd2FpdCB3aGVuRGVmaW5lZCh0YWduYW1lKTtcblxuICAgIC8vZm9yKGxldCBpID0gMDsgaSA8IDE7ICsraSlcbiAgICAvLyAgICBhd2FpdCB3YWl0RnJhbWUoKTtcblxuICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhZ25hbWUpO1xuXG4gICAgaWYoIGVsZW0gPT09IG51bGwgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgbm90IGZvdW5kXCIpO1xuXG4gICAgLy9UT0RPOiAuLi5cbiAgICAvL2F3YWl0IExJU1Mud2hlbkluaXRpYWxpemVkKGVsZW0pO1xuXG4gICAgaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuYFdyb25nIHRhZ25hbWUuXG5FeHBlY3RlZDogJHt0YWduYW1lfVxuR290OiAke2VsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpfWApO1xuXG4gICAgaWYoIGVsZW0uY29uc3RydWN0b3IubmFtZSA9PT0gXCJIVE1MRWxlbWVudFwiKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgbm90IHVwZ3JhZGVkIWApO1xuXG4gICAgaWYoIHNoYWRvd19odG1sICE9PSBlbGVtLnNoYWRvd1Jvb3QgKSB7XG4gICAgICAgIGlmKCBzaGFkb3dfaHRtbCA9PT0gbnVsbCB8fCBlbGVtLnNoYWRvd1Jvb3QgPT09IG51bGwgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaGFkb3dSb290IG1pc3Npbmcgb3IgdW5leHBlY3RlZC5gKTtcbiAgICAgICAgaWYoIHNoYWRvd19odG1sICE9PSBlbGVtLnNoYWRvd1Jvb3QuaW5uZXJIVE1MIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbmBIVE1MIGNvbnRlbnQgbWlzbWF0Y2hlZC5cbkV4cGVjdGVkOiAke3NoYWRvd19odG1sfVxuR290OiAke2VsZW0uc2hhZG93Um9vdC5pbm5lckhUTUx9YCk7XG4gICAgfVxuXG4gICAgZm9yKGxldCBzZWxlY3RvciBpbiBjc3MgKSB7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkID0gY3NzW3NlbGVjdG9yXTtcblxuICAgICAgICBsZXQgc3ViX2VsZW1zOiBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PnxIVE1MRWxlbWVudFtdO1xuICAgICAgICBpZiggc2VsZWN0b3IgPT09IFwiXCIpXG4gICAgICAgICAgICBzdWJfZWxlbXMgPSBbZWxlbSBhcyBIVE1MRWxlbWVudF07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN1Yl9lbGVtcyA9ICgoKGVsZW0gYXMgYW55KS5jb250ZW50ID8/IGVsZW0uc2hhZG93Um9vdCA/PyBlbGVtKSBhcyBTaGFkb3dSb290fEhUTUxFbGVtZW50KS5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihzZWxlY3Rvcik7XG4gICAgXG4gICAgICAgIGlmKCBzdWJfZWxlbXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50cyBcIiR7c2VsZWN0b3J9XCIgbm90IGZvdW5kYCk7XG5cbiAgICAgICAgZm9yKCBsZXQgc3ViX2VsZW0gb2Ygc3ViX2VsZW1zICkge1xuXG4gICAgICAgICAgICAvLyBjb21wYXJlIHN0eWxlIDogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTkzNDI5MjgvZ2V0Y29tcHV0ZWRzdHlsZS1vbmx5LXRoZS1jaGFuZ2VzLWZyb20tZGVmYXVsdFxuICAgICAgICAgICAgLy8gIF4gZ2V0IGFsbCBlbGVtZW50cywgZmluZCBtYXRjaGluZyBxcywgY29tcGFyZVxuICAgICAgICAgICAgLy8gcHNldWRvIGNsYXNzICA6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMDkxODQ4L3RlbXBsYXRlLXF1ZXJ5c2VsZWN0b3ItdXNpbmctc2NvcGUtcHNldWRvLWNsYXNzLXdvcmtzLXdpdGgtZG9jdW1lbnQtYnV0LW5vdFxuXG4gICAgICAgICAgICBjb25zdCBjc3MgPSBnZXRDb21wdXRlZFN0eWxlKHN1Yl9lbGVtKVxuICAgICAgICAgICAgZm9yKGxldCBwcm9wbmFtZSBpbiBleHBlY3RlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IGNzcy5nZXRQcm9wZXJ0eVZhbHVlKHByb3BuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiggdmFsICE9PSBleHBlY3RlZFtwcm9wbmFtZV0gKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBDU1MgbWlzbWF0Y2hcbiAgICAgICAgRXhwZWN0ZWQ6JHtleHBlY3RlZH1cbiAgICAgICAgR290OiAke2Nzc31gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmltcG9ydCB7IHdoZW5EZWZpbmVkIH0gZnJvbSBcIlYyL0xpZmVDeWNsZS9ERUZJTkVEXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiVjMvTElTU1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIlYzL0xJU1NcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgYXNzZXJ0RWxlbWVudCAgICA6IHR5cGVvZiBhc3NlcnRFbGVtZW50O1xuICAgIH1cbn1cblxuTElTUy5hc3NlcnRFbGVtZW50ID0gYXNzZXJ0RWxlbWVudDtcbiIsImV4cG9ydCB7ZGVmYXVsdCBhcyBWMn0gZnJvbSBcIlYyXCI7XG5leHBvcnQge2RlZmF1bHQgYXMgVjN9IGZyb20gXCJWM1wiO1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiVjNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7XG5cbi8vIEB0cy1pZ25vcmVcbmdsb2JhbFRoaXMuTElTUyA9IExJU1M7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrUXVldWVzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBxdWV1ZXNcIikgOiBcIl9fd2VicGFja19xdWV1ZXNfX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWUgJiYgcXVldWUuZCA8IDEpIHtcblx0XHRxdWV1ZS5kID0gMTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSkpO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tID8gZm4ucisrIDogZm4oKSkpO1xuXHR9XG59XG52YXIgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0cXVldWUuZCA9IDA7XG5cdFx0XHRkZXAudGhlbigocikgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0V4cG9ydHNdID0gcjtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0sIChlKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXJyb3JdID0gZTtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gLTEpO1xuXHR2YXIgZGVwUXVldWVzID0gbmV3IFNldCgpO1xuXHR2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xuXHR2YXIgY3VycmVudERlcHM7XG5cdHZhciBvdXRlclJlc29sdmU7XG5cdHZhciByZWplY3Q7XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuXHRcdHJlamVjdCA9IHJlajtcblx0XHRvdXRlclJlc29sdmUgPSByZXNvbHZlO1xuXHR9KTtcblx0cHJvbWlzZVt3ZWJwYWNrRXhwb3J0c10gPSBleHBvcnRzO1xuXHRwcm9taXNlW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAocXVldWUgJiYgZm4ocXVldWUpLCBkZXBRdWV1ZXMuZm9yRWFjaChmbiksIHByb21pc2VbXCJjYXRjaFwiXSh4ID0+IHt9KSk7XG5cdG1vZHVsZS5leHBvcnRzID0gcHJvbWlzZTtcblx0Ym9keSgoZGVwcykgPT4ge1xuXHRcdGN1cnJlbnREZXBzID0gd3JhcERlcHMoZGVwcyk7XG5cdFx0dmFyIGZuO1xuXHRcdHZhciBnZXRSZXN1bHQgPSAoKSA9PiAoY3VycmVudERlcHMubWFwKChkKSA9PiB7XG5cdFx0XHRpZihkW3dlYnBhY2tFcnJvcl0pIHRocm93IGRbd2VicGFja0Vycm9yXTtcblx0XHRcdHJldHVybiBkW3dlYnBhY2tFeHBvcnRzXTtcblx0XHR9KSlcblx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRmbiA9ICgpID0+IChyZXNvbHZlKGdldFJlc3VsdCkpO1xuXHRcdFx0Zm4uciA9IDA7XG5cdFx0XHR2YXIgZm5RdWV1ZSA9IChxKSA9PiAocSAhPT0gcXVldWUgJiYgIWRlcFF1ZXVlcy5oYXMocSkgJiYgKGRlcFF1ZXVlcy5hZGQocSksIHEgJiYgIXEuZCAmJiAoZm4ucisrLCBxLnB1c2goZm4pKSkpO1xuXHRcdFx0Y3VycmVudERlcHMubWFwKChkZXApID0+IChkZXBbd2VicGFja1F1ZXVlc10oZm5RdWV1ZSkpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZm4uciA/IHByb21pc2UgOiBnZXRSZXN1bHQoKTtcblx0fSwgKGVycikgPT4gKChlcnIgPyByZWplY3QocHJvbWlzZVt3ZWJwYWNrRXJyb3JdID0gZXJyKSA6IG91dGVyUmVzb2x2ZShleHBvcnRzKSksIHJlc29sdmVRdWV1ZShxdWV1ZSkpKTtcblx0cXVldWUgJiYgcXVldWUuZCA8IDAgJiYgKHF1ZXVlLmQgPSAwKTtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJnZXRTaGFyZWRDU1MiLCJTaGFkb3dDZmciLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNET01Db250ZW50TG9hZGVkIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsInNoYXJlZENTUyIsIkNvbnRlbnRHZW5lcmF0b3IiLCJkYXRhIiwiY29uc3RydWN0b3IiLCJodG1sIiwiY3NzIiwic2hhZG93IiwicHJlcGFyZUhUTUwiLCJwcmVwYXJlQ1NTIiwic2V0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsImlzUmVhZHkiLCJ3aGVuUmVhZHkiLCJmaWxsQ29udGVudCIsImluamVjdENTUyIsImFwcGVuZCIsImNvbnRlbnQiLCJjbG9uZU5vZGUiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJnZW5lcmF0ZSIsImhvc3QiLCJ0YXJnZXQiLCJpbml0U2hhZG93Iiwic2hhZG93TW9kZSIsIk5PTkUiLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwicmVwbGFjZUNoaWxkcmVuIiwiY2FuSGF2ZVNoYWRvdyIsIkVycm9yIiwibW9kZSIsIk9QRU4iLCJhdHRhY2hTaGFkb3ciLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJlIiwicHJvY2Vzc0NTUyIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidW5kZWZpbmVkIiwic3RyIiwidHJpbSIsImlubmVySFRNTCIsIkhUTUxFbGVtZW50Iiwic3R5bGVzaGVldHMiLCJTaGFkb3dSb290IiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwicHVzaCIsImNzc3NlbGVjdG9yIiwiQ1NTU2VsZWN0b3IiLCJoYXMiLCJzZXRBdHRyaWJ1dGUiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsInJlcGxhY2UiLCJoZWFkIiwiYWRkIiwiYnVpbGRMSVNTSG9zdCIsInNldENzdHJDb250cm9sZXIiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkxJU1MiLCJhcmdzIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwiY29udGVudF9nZW5lcmF0b3IiLCJMSVNTQ29udHJvbGVyIiwiSG9zdCIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsIm5hbWUiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImlzQ29ubmVjdGVkIiwiX0hvc3QiLCJpZCIsIl9fY3N0cl9jb250cm9sZXIiLCJMaXNzIiwiaG9zdENzdHIiLCJjb250ZW50X2dlbmVyYXRvcl9jc3RyIiwiTElTU0hvc3QiLCJDZmciLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJDb250cm9sZXIiLCJjb250cm9sZXIiLCJpc0luaXRpYWxpemVkIiwid2hlbkluaXRpYWxpemVkIiwiaW5pdGlhbGl6ZSIsInBhcmFtcyIsImluaXQiLCJnZXRQYXJ0IiwiaGFzU2hhZG93IiwicXVlcnlTZWxlY3RvciIsImdldFBhcnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImhhc0F0dHJpYnV0ZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJ0aGVuIiwicHJvbWlzZSIsInJlc29sdmUiLCJQcm9taXNlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiZGVmaW5lIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiYnJ5X2NsYXNzIiwiX19iYXNlc19fIiwiZmlsdGVyIiwiX19uYW1lX18iLCJfanNfa2xhc3MiLCIkanNfZnVuYyIsIl9fQlJZVEhPTl9fIiwiJGNhbGwiLCIkZ2V0YXR0cl9wZXA2NTciLCJodG1sdGFnIiwiQ2xhc3MiLCJvcHRzIiwiZ2V0TmFtZSIsImVsZW1lbnQiLCJFbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImlzRGVmaW5lZCIsImVsZW0iLCJnZXQiLCJ3aGVuRGVmaW5lZCIsImdldEhvc3RDc3RyIiwiZ2V0SG9zdENzdHJTeW5jIiwiaXNVcGdyYWRlZCIsInVwZ3JhZGVTeW5jIiwid2hlblVwZ3JhZGVkIiwiZ2V0Q29udHJvbGVyIiwiZ2V0Q29udHJvbGVyU3luYyIsImluaXRpYWxpemVTeW5jIiwiZ2V0Q29udHJvbGVyQ3N0ciIsImdldENvbnRyb2xlckNzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsImdldEhvc3QiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZ2V0SG9zdFN5bmMiLCJTdGF0ZXMiLCJfTElTUyIsIklMSVNTIiwiY2ZnIiwiYXNzaWduIiwiRXh0ZW5kZWRMSVNTIiwiS25vd25UYWdzIiwic2NyaXB0IiwiREVGQVVMVF9DRElSIiwiYXV0b2xvYWQiLCJjZGlyIiwiU1ciLCJzd19wYXRoIiwiY29uc29sZSIsIndhcm4iLCJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwicmVnaXN0ZXIiLCJzY29wZSIsImVycm9yIiwiY29udHJvbGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJicnl0aG9uIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkaXRpb24iLCJhZGRlZE5vZGVzIiwiYWRkVGFnIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJ0YWciLCJpbXBvcnRDb21wb25lbnQiLCJkZWZpbmVXZWJDb21wb25lbnQiLCJmaWxlcyIsImNfanMiLCJrbGFzcyIsImZpbGUiLCJCbG9iIiwidHlwZSIsInVybCIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsIm9sZHJlcSIsInJlcXVpcmUiLCJzdGFydHNXaXRoIiwiZmlsZW5hbWUiLCJzbGljZSIsImRlZmF1bHQiLCJMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yIiwiX2ZldGNoVGV4dCIsInVyaSIsImlzTGlzc0F1dG8iLCJvcHRpb25zIiwiaGVhZGVycyIsInJlc3BvbnNlIiwiZmV0Y2giLCJzdGF0dXMiLCJhbnN3ZXIiLCJ0ZXh0IiwiX2ltcG9ydCIsImxvZyIsImNvbnZlcnRlciIsImVuY29kZUhUTUwiLCJ0ZXh0Q29udGVudCIsIm1hdGNoIiwiY3NzX2F0dHJzIiwiZ2V0QXR0cmlidXRlTmFtZXMiLCJjc3NfYXR0ciIsInNldFByb3BlcnR5IiwiaW1wb3J0Q29tcG9uZW50cyIsImNvbXBvbmVudHMiLCJyZXN1bHRzIiwiYnJ5X3dyYXBwZXIiLCJjb21wb19kaXIiLCJjb2RlIiwibGlzcyIsIkRvY3VtZW50RnJhZ21lbnQiLCJsaXNzU3luYyIsIkV2ZW50VGFyZ2V0MiIsIkV2ZW50VGFyZ2V0IiwiY2FsbGJhY2siLCJkaXNwYXRjaEV2ZW50IiwiZXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJDdXN0b21FdmVudDIiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIldpdGhFdmVudHMiLCJldiIsIl9ldmVudHMiLCJFdmVudFRhcmdldE1peGlucyIsImV2ZW50TWF0Y2hlcyIsInNlbGVjdG9yIiwiZWxlbWVudHMiLCJjb21wb3NlZFBhdGgiLCJyZXZlcnNlIiwibWF0Y2hlcyIsImxpc3Nfc2VsZWN0b3IiLCJfYnVpbGRRUyIsInRhZ25hbWVfb3JfcGFyZW50IiwicGFyZW50IiwicXMiLCJyZXN1bHQiLCJxc28iLCJxc2EiLCJpZHgiLCJwcm9taXNlcyIsImFsbCIsInFzYyIsInJlcyIsImNsb3Nlc3QiLCJxc1N5bmMiLCJxc2FTeW5jIiwicXNjU3luYyIsInJvb3QiLCJnZXRSb290Tm9kZSIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJjdXJzb3IiLCJfX3Byb3RvX18iLCJlbmRzV2l0aCIsIkNBTl9IQVZFX1NIQURPVyIsInJlYWR5U3RhdGUiLCJzdHJpbmciLCJpIiwiZmlyc3RDaGlsZCIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsInJlZ2V4IiwiQXV0b0NvbnRlbnRHZW5lcmF0b3IiLCJwcmVwYXJlVGVtcGxhdGUiLCJ2YWx1ZSIsImlzUmVzc291cmNlUmVhZHkiLCJ3YWl0UmVzc291cmNlIiwicHJlcGFyZSIsInByZXBhcmVTdHlsZSIsImluaXRDb250ZW50IiwiY3JlYXRlQ29udGVudCIsIkxJU1NGdWxsIiwiZ2V0SW5pdGlhbFZhbHVlIiwiZGVmYXVsdFZhbHVlIiwiaGFzT3duIiwiZ2VuZXJhdG9yIiwiU0hBRE9XX01PREUiLCJDT05URU5UX0dFTkVSQVRPUiIsIkxJU1NCYXNlIiwib2xkdmFsIiwibmV3dmFsIiwiTElTU1VwZGF0ZSIsIm9ic2VydmVyIiwicHJvY2Vzc0ludGVyc2VjdGlvbk9ic2VydmVyIiwiZW50cmllcyIsImlzVmlzaWJsZSIsImlzSW50ZXJzZWN0aW5nIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJvblVwZGF0ZSIsInJlcXVlc3RVcGRhdGUiLCJJbnRlcnNlY3Rpb25PYnNlcnZlciIsIldhaXRpbmdEZWZpbmUiLCJpc1BhZ2VMb2FkZWQiLCJ3aGVuUGFnZUxvYWRlZCIsImZldGNoVGV4dCIsImV4ZWN1dGUiLCJMSVNTX01PREUiLCJTV19QQVRIIiwibG9hZENvbXBvbmVudCIsInRydWVfdGFnZGlyIiwiTElTU0NvbnRleHQiLCJvdmVycmlkZV90YWdzIiwib3JpZ2luIiwiX3doZW5EZWZpbmVkUHJvbWlzZXMiLCJLbGFzcyIsImRlbGV0ZSIsInAiLCJXZWFrTWFwIiwic2V0IiwiZXhlY3V0ZUpTIiwibGFzdEluZGV4T2YiLCJnbG9iYWxUaGlzIiwidXJsX21hcCIsInJldm9rZU9iamVjdFVSTCIsImhpZGU0MDQiLCJmZXRjaENvbnRleHQiLCJwYXRoIiwiY3dkIiwidG9TdHJpbmciLCJzdGFjayIsImNhbGxlciIsInNwbGl0IiwiaW5kZXhPZiIsImV2ZXJ5IiwiUmVzcG9uc2UiLCJkZiIsInJhdyIsInRyYWNlIiwid2FpdEZyYW1lIiwiYXNzZXJ0RWxlbWVudCIsInNoYWRvd19odG1sIiwic2hhZG93Um9vdCIsImV4cGVjdGVkIiwic3ViX2VsZW1zIiwic3ViX2VsZW0iLCJnZXRDb21wdXRlZFN0eWxlIiwicHJvcG5hbWUiLCJ2YWwiLCJnZXRQcm9wZXJ0eVZhbHVlIiwiVjIiLCJWMyJdLCJzb3VyY2VSb290IjoiIn0=