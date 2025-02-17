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
var States = /*#__PURE__*/ function(States) {
    States["LISS_DEFINED"] = "LISS_DEFINED";
    States["LISS_UPGRADED"] = "LISS_UPGRADED";
    States["LISS_READY"] = "LISS_READY";
    States["LISS_INITIALIZED"] = "LISS_INITIALIZED";
    return States;
}({});


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
var ShadowCfg = /*#__PURE__*/ function(ShadowCfg) {
    ShadowCfg["NONE"] = "none";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
    return ShadowCfg;
}({});


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
/* harmony import */ var V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V3/utils/ressource */ "./src/V3/utils/ressource.ts");
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
        const isReady = (0,V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(html) && (0,V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(css) && (0,V2_utils__WEBPACK_IMPORTED_MODULE_1__.isDOMContentLoaded)();
        if (isReady) this.prepare(html, css);
        const whenReady = Promise.all([
            (0,V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(html),
            (0,V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(css),
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
/* harmony export */   LISSv3: () => (/* binding */ LISSv3),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getInitialValue: () => (/* binding */ getInitialValue)
/* harmony export */ });
/* harmony import */ var V3_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V3/ContentGenerators/ContentGenerator */ "./src/V3/ContentGenerators/ContentGenerator.ts");
/* harmony import */ var _LISS_LISSFull__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISS/LISSFull */ "./src/V3/LISS/LISSFull.ts");
// example : playground v3 (?)
// liss-version="v3"
// liss-v3="auto" (c'est la v3 qu'il faut utiliser)
// TODO: in playground brython src only if brython
// TODO: remove v2 (autodir) + v2 fcts
// DOCS
// README.md
// TODO: auto-mode (all with auto...)
// TODO: true auto-mode in tests (change Brython...)
// testv3
// default HTML in test if (null)...
// like playground (?) => different file for cleaner code ?
// files="js,ts,bry,html" - default (html+css+js) ?
// docs (+ examples playground/tests // Bry/JS).
// non-auto first.
// extends (LISS Base)
// LISS({}) opts.
// define.
// API... for better suggestions.
// rules...
// TODO: contentGenerator
// TODO: docs (ofc)
// TODO: utils + signals + DOMContentLoaded before... + upgrade children in cstr ?
// build
// remove events + qs ?
// TODO: state (internal state)
// TODO: bliss
// TODO: sharedCSS
// TODO: upgrade
// TODO: get upgraded ?
// TODO: upgrade ++ > definition order if inside child and available.
// TODO: defined : visibility: hidden until defined ?
// TODO: loader customElement (replaceWith ?)
// TODO: playground
// TODO: facultative HTML in editor/playground
// TODO: show error...
// TODO: debounce/throttle editor...


function getInitialValue(e, name, defaultValue) {
    if (!Object.hasOwn(e, name)) return defaultValue;
    const _ = e[name];
    delete e[name];
    return _;
}
//  builder
function LISSv3(opts = {}) {
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISSv3);


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
/* harmony export */   _fetchText: () => (/* binding */ _fetchText),
/* harmony export */   autoload: () => (/* binding */ autoload),
/* harmony export */   loadComponent: () => (/* binding */ loadComponent)
/* harmony export */ });
/* harmony import */ var V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V2/helpers/LISSAuto */ "./src/V2/helpers/LISSAuto.ts");
/* harmony import */ var V3_define_define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V3/define/define */ "./src/V3/define/define.ts");
/* harmony import */ var V3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! V3 */ "./src/V3/index.ts");
/* harmony import */ var V3_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/ContentGenerators/AutoContentGenerator */ "./src/V3/ContentGenerators/AutoContentGenerator.ts");
/* harmony import */ var V3_utils_DOM_isPageLoaded__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! V3/utils/DOM/isPageLoaded */ "./src/V3/utils/DOM/isPageLoaded.ts");
/* harmony import */ var V3_utils_DOM_whenPageLoaded__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! V3/utils/DOM/whenPageLoaded */ "./src/V3/utils/DOM/whenPageLoaded.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([V3__WEBPACK_IMPORTED_MODULE_2__]);
V3__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






const script = document.querySelector('script:is([liss-auto],[liss-cdir],[liss-sw])');
const LISS_MODE = script?.getAttribute('liss-mode') ?? null;
const DEFAULT_CDIR = script?.getAttribute('liss-cdir') ?? null;
// TODO: default ?
const SW_PATH = script?.getAttribute('liss-sw') ?? null;
if (LISS_MODE === "auto-load" && DEFAULT_CDIR !== null) {
    if (!(0,V3_utils_DOM_isPageLoaded__WEBPACK_IMPORTED_MODULE_4__["default"])()) await (0,V3_utils_DOM_whenPageLoaded__WEBPACK_IMPORTED_MODULE_5__["default"])();
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
        for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition instanceof HTMLUnknownElement) addTag(addition);
    }).observe(document, {
        childList: true,
        subtree: true
    });
    for (let elem of document.querySelectorAll("*:not(:defined)"))addTag(elem);
    async function addTag(tag) {
        await SW; // ensure SW is installed.
        const tagname = tag.tagName.toLowerCase();
        if (!tagname.includes('-') || V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__.KnownTags.has(tagname)) return;
        loadComponent(tagname, {
            //brython,
            cdir
        });
    }
}
async function loadComponent(tagname, { cdir = DEFAULT_CDIR } = {}) {
    V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__.KnownTags.add(tagname);
    const compo_dir = `${cdir}${tagname}/`;
    const files = {};
    // strats : JS -> Bry -> HTML+CSS (cf script attr).
    files["js"] = await _fetchText(`${compo_dir}index.js`, true);
    if (files["js"] === undefined) {
        // try/catch ?
        const promises = [
            _fetchText(`${compo_dir}index.html`, true),
            _fetchText(`${compo_dir}index.css`, true)
        ];
        [files["html"], files["css"]] = await Promise.all(promises);
    }
    return await defineWebComponent(tagname, files);
}
async function execute(code, type) {
    let result;
    if (type === "js") {
        const file = new Blob([
            code
        ], {
            type: 'application/javascript'
        });
        const url = URL.createObjectURL(file);
        result = await import(/* webpackIgnore: true */ url);
        URL.revokeObjectURL(url);
    }
    return result;
}
//TODO: rename from files ?
async function defineWebComponent(tagname, files) {
    let klass;
    if ("js" in files) {
        klass = (await execute(files["js"], "js")).default;
    }
    if (klass === undefined) klass = (0,V3__WEBPACK_IMPORTED_MODULE_2__["default"])({
        content_generator: V3_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_3__["default"],
        ...files
    });
    (0,V3_define_define__WEBPACK_IMPORTED_MODULE_1__["default"])(tagname, klass);
    return klass;
}
// in auto-mode use ServiceWorker to hide 404 error messages.
// if playground files, use them.
async function _fetchText(uri, hide404 = false) {
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
// @ts-ignore
globalThis.require = async function(url) {
    //TODO: non playground...
    return await _fetchText(url);
};

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
            WaitingDefine.delete(tagname);
        }
    }
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
/* harmony import */ var _utils_parsers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/parsers */ "./src/V3/utils/parsers/index.ts");
/* harmony import */ var _define_autoload__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./define/autoload */ "./src/V3/define/autoload.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_define_autoload__WEBPACK_IMPORTED_MODULE_3__]);
_define_autoload__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

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

/***/ "./src/V3/utils/ressource.ts":
/*!***********************************!*\
  !*** ./src/V3/utils/ressource.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRessourceReady: () => (/* binding */ isRessourceReady),
/* harmony export */   waitRessource: () => (/* binding */ waitRessource)
/* harmony export */ });
function isRessourceReady(res) {
    if (Array.isArray(res)) return res.every((e)=>isRessourceReady(res[e]));
    return res === undefined || !(res instanceof Promise || res instanceof Response);
}
async function waitRessource(res) {
    if (Array.isArray(res)) return await Promise.all(res.map((e)=>waitRessource(e)));
    if (res instanceof Promise) res = await res;
    if (res instanceof Response) res = await res.text();
    return res;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EsSUFBSTtVQUNKO1VBQ0E7VUFDQSxJQUFJO1VBQ0o7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EsQ0FBQztVQUNEO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxFQUFFO1VBQ0Y7VUFDQSxzR0FBc0c7VUFDdEc7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxHQUFHO1VBQ0g7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLEdBQUc7VUFDSDtVQUNBLEVBQUU7VUFDRjtVQUNBOzs7OztVQ2hFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7U0VOQTtTQUNBO1NBQ0E7U0FDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvVjIvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xJU1NDb250cm9sZXIudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xpZmVDeWNsZS9ERUZJTkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL0lOSVRJQUxJWkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL1JFQURZLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL1VQR1JBREVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL3N0YXRlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2NvcmUvTGlmZUN5Y2xlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvQ29udGVudEdlbmVyYXRvcnMvQXV0b0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvTElTUy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0xJU1MvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9MSVNTL0xJU1NGdWxsLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL2F1dG9sb2FkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL2RlZmluZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2RlZmluZS9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2RlZmluZS9pc0RlZmluZWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9kZWZpbmUvd2hlbkRlZmluZWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL0RPTS9pc1BhZ2VMb2FkZWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9ET00vd2hlblBhZ2VMb2FkZWQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9lbmNvZGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9wYXJzZXJzL2h0bWwudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9wYXJzZXJzL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvcGFyc2Vycy9zdHlsZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3BhcnNlcnMvdGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9yZXNzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2FzeW5jIG1vZHVsZSIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xJU1Mvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTaGFyZWRDU1MgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgTEhvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIGlzU2hhZG93U3VwcG9ydGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbnR5cGUgSFRNTCA9IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nO1xudHlwZSBDU1MgID0gc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudDtcblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge1xuICAgIGh0bWwgICA/OiBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZyxcbiAgICBjc3MgICAgPzogQ1NTIHwgcmVhZG9ubHkgQ1NTW10sXG4gICAgc2hhZG93ID86IFNoYWRvd0NmZ3xudWxsXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JDc3RyID0geyBuZXcob3B0czogQ29udGVudEdlbmVyYXRvcl9PcHRzKTogQ29udGVudEdlbmVyYXRvciB9O1xuXG5jb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgICNzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdO1xuICAgICN0ZW1wbGF0ZSAgIDogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsO1xuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgZGF0YTogYW55O1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRoaXMucHJlcGFyZUhUTUwoaHRtbCk7XG4gICAgXG4gICAgICAgIHRoaXMuI3N0eWxlc2hlZXRzID0gdGhpcy5wcmVwYXJlQ1NTKGNzcyk7XG5cbiAgICAgICAgdGhpcy4jaXNSZWFkeSAgID0gaXNET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIHRoaXMuI3doZW5SZWFkeSA9IHdoZW5ET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgLy9UT0RPOiBvdGhlciBkZXBzLi4uXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFRlbXBsYXRlKHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgI3doZW5SZWFkeTogUHJvbWlzZTx1bmtub3duPjtcbiAgICAjaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lzUmVhZHk7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKCB0aGlzLiNpc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy4jd2hlblJlYWR5O1xuICAgICAgICAvL1RPRE86IGRlcHMuXG4gICAgICAgIC8vVE9ETzogQ1NTL0hUTUwgcmVzb3VyY2VzLi4uXG5cbiAgICAgICAgLy8gaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cbiAgICAgICAgLy8gX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG4gICAgICAgIC8vICsgY2YgYXQgdGhlIGVuZC4uLlxuICAgIH1cblxuICAgIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuICAgICAgICB0aGlzLmluamVjdENTUyhzaGFkb3csIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBzaGFkb3cuYXBwZW5kKCB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKHNoYWRvdyk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnR8U2hhZG93Um9vdCB7XG5cbiAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLiAgICAgXG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pbml0U2hhZG93KGhvc3QpO1xuXG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHRhcmdldCwgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGlmKCBob3N0LnNoYWRvd01vZGUgIT09IFNoYWRvd0NmZy5OT05FIHx8IHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKGNvbnRlbnQpO1xuXG4gICAgICAgIC8vaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgJiYgdGFyZ2V0LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKVxuXHRcdC8vXHR0YXJnZXQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGhvc3QpO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTaGFkb3c8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KSB7XG5cbiAgICAgICAgY29uc3QgY2FuSGF2ZVNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpO1xuICAgICAgICBpZiggdGhpcy4jc2hhZG93ICE9PSBudWxsICYmIHRoaXMuI3NoYWRvdyAhPT0gU2hhZG93Q2ZnLk5PTkUgJiYgISBjYW5IYXZlU2hhZG93IClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICAgICAgbGV0IG1vZGUgPSB0aGlzLiNzaGFkb3c7XG4gICAgICAgIGlmKCBtb2RlID09PSBudWxsIClcbiAgICAgICAgICAgIG1vZGUgPSBjYW5IYXZlU2hhZG93ID8gU2hhZG93Q2ZnLk9QRU4gOiBTaGFkb3dDZmcuTk9ORTtcblxuICAgICAgICBob3N0LnNoYWRvd01vZGUgPSBtb2RlO1xuXG4gICAgICAgIGxldCB0YXJnZXQ6IEhvc3R8U2hhZG93Um9vdCA9IGhvc3Q7XG4gICAgICAgIGlmKCBtb2RlICE9PSBTaGFkb3dDZmcuTk9ORSlcbiAgICAgICAgICAgIHRhcmdldCA9IGhvc3QuYXR0YWNoU2hhZG93KHttb2RlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUNTUyhjc3M6IENTU3xyZWFkb25seSBDU1NbXSkge1xuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgcmV0dXJuIGNzcy5tYXAoZSA9PiB0aGlzLnByb2Nlc3NDU1MoZSkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NTUyhjc3M6IENTUykge1xuXG4gICAgICAgIGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG4gICAgICAgICAgICByZXR1cm4gY3NzO1xuICAgICAgICBpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBjc3Muc2hlZXQhO1xuICAgIFxuICAgICAgICBpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1clwiKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUhUTUwoaHRtbD86IEhUTUwpOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGwge1xuICAgIFxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgaWYoaHRtbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgIC8vIHN0cjJodG1sXG4gICAgICAgIGlmKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gaHRtbC50cmltKCk7XG5cbiAgICAgICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBodG1sIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKVxuICAgICAgICAgICAgaHRtbCA9IGh0bWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIHRlbXBsYXRlLmFwcGVuZChodG1sKTtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIGluamVjdENTUzxIb3N0IGV4dGVuZHMgTEhvc3Q+KHRhcmdldDogU2hhZG93Um9vdHxIb3N0LCBzdHlsZXNoZWV0czogYW55W10pIHtcblxuICAgICAgICBpZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCApIHtcbiAgICAgICAgICAgIHRhcmdldC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MsIC4uLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNzc3NlbGVjdG9yID0gdGFyZ2V0LkNTU1NlbGVjdG9yOyAvL1RPRE8uLi5cblxuICAgICAgICBpZiggYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG4gICAgICAgIGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcbiAgICAgICAgZm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcbiAgICAgICAgICAgIGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcbiAgICAgICAgICAgICAgICBodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcbiAgICAgICAgYWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG4gICAgfVxufVxuXG4vLyBpZGVtIEhUTUwuLi5cbi8qIGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBjID0gYXdhaXQgYztcbiAgICAgICAgICAgIGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuICAgICAgICAgICAgICAgIGMgPSBhd2FpdCBjLnRleHQoKTtcblxuICAgICAgICAgICAgc3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG4gICAgICAgIH0pKCkpO1xuXG4gICAgICAgIHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcbiAgICB9XG4qLyIsImltcG9ydCB7IExIb3N0Q3N0ciwgdHlwZSBDbGFzcywgdHlwZSBDb25zdHJ1Y3RvciwgdHlwZSBMSVNTX09wdHMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBidWlsZExJU1NIb3N0LCBzZXRDc3RyQ29udHJvbGVyIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWV9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8qKioqL1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0Ly8gbm9uLXZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBob3N0OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdC8vIHZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBpc0Nvbm5lY3RlZCAgOmJvb2xlYW47XG59O1xuXHQvLyArIHByb3RlY3RlZFxuXHRcdC8vIHJlYWRvbmx5IC5jb250ZW50OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Q7XG5cdC8vIHZhbmlsbGEgSlNcblx0XHQvLyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCk6IHZvaWQ7XG5cdFx0Ly8gY29ubmVjdGVkQ2FsbGJhY2sgICAoKTogdm9pZDtcblx0XHQvLyBkaXNjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkO1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiB7XG5cdG5ldygpOiBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW107XG59XG5cdC8vICsgXCJwcml2YXRlXCJcblx0XHQvLyByZWFkb25seSBIb3N0OiBIb3N0Q3N0clxuXG5leHBvcnQgdHlwZSBDb250cm9sZXI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEluc3RhbmNlVHlwZTxFeHRlbmRzQ3N0cj47XG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4gJiBFeHRlbmRzQ3N0cjtcblxuLyoqKiovXG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPihhcmdzOiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+PiA9IHt9KSB7XG5cblx0bGV0IHtcblx0XHQvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cblx0XHRleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCAgICAgIGFzIHVua25vd24gYXMgRXh0ZW5kc0NzdHIsXG5cdFx0aG9zdCAgICAgICAgICAgICAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRcblx0XHRjb250ZW50X2dlbmVyYXRvciA9IENvbnRlbnRHZW5lcmF0b3IsXG5cdH0gPSBhcmdzO1xuXHRcblx0Y2xhc3MgTElTU0NvbnRyb2xlciBleHRlbmRzIF9leHRlbmRzIGltcGxlbWVudHMgSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+e1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0c2V0Q3N0ckNvbnRyb2xlcih0aGlzKTtcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KC4uLmFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3QuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge31cblxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaG9zdC5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogSW5zdGFuY2VUeXBlPExIb3N0Q3N0cjxIb3N0Q3N0cj4+O1xuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgX0hvc3Q6IExIb3N0Q3N0cjxIb3N0Q3N0cj47XG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlOiBmdWNrIG9mZi5cblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QoIHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aG9zdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcmdzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQ29udHJvbGVyIHNhdGlzZmllcyBDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG59IiwiaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBTaGFkb3dDZmcsIHR5cGUgTElTU0NvbnRyb2xlckNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tIFwiLi9MaWZlQ3ljbGUvc3RhdGVzXCI7XG5cbi8vIExJU1NIb3N0IG11c3QgYmUgYnVpbGQgaW4gZGVmaW5lIGFzIGl0IG5lZWQgdG8gYmUgYWJsZSB0byBidWlsZFxuLy8gdGhlIGRlZmluZWQgc3ViY2xhc3MuXG5cbmxldCBpZCA9IDA7XG5cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcmVkQ1NTKCkge1xuXHRyZXR1cm4gc2hhcmVkQ1NTO1xufVxuXG5sZXQgX19jc3RyX2NvbnRyb2xlciAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckNvbnRyb2xlcihfOiBhbnkpIHtcblx0X19jc3RyX2NvbnRyb2xlciA9IF87XG59XG5cbnR5cGUgaW5mZXJIb3N0Q3N0cjxUPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cjxpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LCBpbmZlciBCIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA/IEIgOiBuZXZlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XHRUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsIFUgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBpbmZlckhvc3RDc3RyPFQ+ID4oXG5cdFx0XHRcdFx0XHRcdExpc3M6IFQsXG5cdFx0XHRcdFx0XHRcdC8vIGNhbid0IGRlZHVjZSA6IGNhdXNlIHR5cGUgZGVkdWN0aW9uIGlzc3Vlcy4uLlxuXHRcdFx0XHRcdFx0XHRob3N0Q3N0cjogVSxcblx0XHRcdFx0XHRcdFx0Y29udGVudF9nZW5lcmF0b3JfY3N0cjogQ29udGVudEdlbmVyYXRvckNzdHIsXG5cdFx0XHRcdFx0XHRcdGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcblx0XHRcdFx0XHRcdCkge1xuXG5cdGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gbmV3IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIoYXJncyk7XG5cblx0dHlwZSBIb3N0Q3N0ciA9IFU7XG4gICAgdHlwZSBIb3N0ICAgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Y2xhc3MgTElTU0hvc3QgZXh0ZW5kcyBob3N0Q3N0ciB7XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgQ2ZnID0ge1xuXHRcdFx0aG9zdCAgICAgICAgICAgICA6IGhvc3RDc3RyLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIsXG5cdFx0XHRhcmdzXG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IERFUEVOREVOQ0lFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHN0YXRpYyBDb250cm9sZXIgPSBMaXNzO1xuXG5cdFx0I2NvbnRyb2xlcjogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBjb250cm9sZXIoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlciAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdC8vVE9ETzogZ2V0IHJlYWwgVFMgdHlwZSA/XG5cdFx0I3BhcmFtczogYW55W107XG5cdFx0aW5pdGlhbGl6ZSguLi5wYXJhbXM6IGFueVtdKSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgYWxyZWFkeSBpbml0aWFsaXplZCEnKTtcbiAgICAgICAgICAgIGlmKCAhICggdGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzRGVwc1Jlc29sdmVkIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdGlmKCBwYXJhbXMubGVuZ3RoICE9PSAwICkge1xuXHRcdFx0XHRpZiggdGhpcy4jcGFyYW1zLmxlbmd0aCAhPT0gMCApXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDc3RyIHBhcmFtcyBoYXMgYWxyZWFkeSBiZWVuIHByb3ZpZGVkICEnKTtcblx0XHRcdFx0dGhpcy4jcGFyYW1zID0gcGFyYW1zO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNjb250cm9sZXIgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuaXNDb25uZWN0ZWQgKVxuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBDb250ZW50ID09PT09PT09PT09PT09PT09PT1cblxuXHRcdC8vI2ludGVybmFscyA9IHRoaXMuYXR0YWNoSW50ZXJuYWxzKCk7XG5cdFx0Ly8jc3RhdGVzICAgID0gdGhpcy4jaW50ZXJuYWxzLnN0YXRlcztcblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290ID0gdGhpcyBhcyBIb3N0O1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgYXR0YWNoU2hhZG93KGluaXQ6IFNoYWRvd1Jvb3RJbml0KTogU2hhZG93Um9vdCB7XG5cdFx0XHRjb25zdCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3coaW5pdCk7XG5cblx0XHRcdC8vIEB0cy1pZ25vcmUgY2xvc2VkIElTIGFzc2lnbmFibGUgdG8gc2hhZG93TW9kZS4uLlxuXHRcdFx0dGhpcy5zaGFkb3dNb2RlID0gaW5pdC5tb2RlO1xuXG5cdFx0XHR0aGlzLiNjb250ZW50ID0gc2hhZG93O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc2hhZG93O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2hhZG93TW9kZSAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKC4uLnBhcmFtczogYW55W10pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19VUEdSQURFRCk7XG5cdFx0XHRjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKS50aGVuKCgpID0+IHtcblx0XHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX1JFQURZKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRjb25zdCBjb250cm9sZXIgPSBfX2NzdHJfY29udHJvbGVyO1xuXHRcdFx0X19jc3RyX2NvbnRyb2xlciA9IG51bGw7XG5cblx0XHRcdGlmKCBjb250cm9sZXIgIT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gY29udHJvbGVyO1xuXHRcdFx0XHR0aGlzLmluaXQoKTsgLy8gY2FsbCB0aGUgcmVzb2x2ZXJcblx0XHRcdH1cblxuXHRcdFx0aWYoIFwiX3doZW5VcGdyYWRlZFJlc29sdmVcIiBpbiB0aGlzKVxuXHRcdFx0XHQodGhpcy5fd2hlblVwZ3JhZGVkUmVzb2x2ZSBhcyBhbnkpKCk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PSBET00gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHRcdFxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRpZih0aGlzLmNvbnRyb2xlciAhPT0gbnVsbClcblx0XHRcdFx0dGhpcy5jb250cm9sZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmNvbnRyb2xlciEuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBpbnN0YW5jZSBkZXBzXG5cdFx0XHRpZiggY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblxuXHRcdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHR9KSgpO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIExJU1NIb3N0LkNvbnRyb2xlci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG5cdFx0fVxuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZih0aGlzLiNjb250cm9sZXIpXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblx0XHR9XG5cblx0XHRzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbCA9IG51bGw7XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cblx0XHRcdC8vIG5vIG5lZWRzIHRvIHNldCB0aGlzLiNjb250ZW50IChhbHJlYWR5IGhvc3Qgb3Igc2V0IHdoZW4gYXR0YWNoU2hhZG93KVxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3IuZ2VuZXJhdGUodGhpcyk7XG5cblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblxuXHRcdFx0aWYoIHRoaXMuI2NvbnRyb2xlciA9PT0gbnVsbCkge1xuXHRcdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gbmV3IExJU1NIb3N0LkNvbnRyb2xlciguLi50aGlzLiNwYXJhbXMpIGFzIEluc3RhbmNlVHlwZTxUPjtcblx0XHRcdH1cblxuXHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX0lOSVRJQUxJWkVEKTtcblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuY29udHJvbGVyKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29udHJvbGVyO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3Q7XG59XG5cblxuIiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SFRNTEVsZW1lbnQ7XG5cbi8vIFRPRE8uLi5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPnxhbnkpIHtcblxuXHRsZXQgSG9zdDogTElTU0hvc3RDc3RyPFQ+ID0gQ29tcG9uZW50Q2xhc3MgYXMgYW55O1xuXG5cdC8vIEJyeXRob24gY2xhc3Ncblx0bGV0IGJyeV9jbGFzczogYW55ID0gbnVsbDtcblx0aWYoIFwiJGlzX2NsYXNzXCIgaW4gQ29tcG9uZW50Q2xhc3MgKSB7XG5cblx0XHRicnlfY2xhc3MgPSBDb21wb25lbnRDbGFzcztcblxuXHRcdENvbXBvbmVudENsYXNzID0gYnJ5X2NsYXNzLl9fYmFzZXNfXy5maWx0ZXIoIChlOiBhbnkpID0+IGUuX19uYW1lX18gPT09IFwiV3JhcHBlclwiKVswXS5fanNfa2xhc3MuJGpzX2Z1bmM7XG5cdFx0KENvbXBvbmVudENsYXNzIGFzIGFueSkuSG9zdC5Db250cm9sZXIgPSBjbGFzcyB7XG5cblx0XHRcdCNicnk6IGFueTtcblxuXHRcdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHR0aGlzLiNicnkgPSBfX0JSWVRIT05fXy4kY2FsbChicnlfY2xhc3MsIFswLDAsMF0pKC4uLmFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHQjY2FsbChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRjYWxsKF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIG5hbWUsIFswLDAsMF0pLCBbMCwwLDBdKSguLi5hcmdzKVxuXHRcdFx0fVxuXG5cdFx0XHRnZXQgaG9zdCgpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgXCJob3N0XCIsIFswLDAsMF0pXG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBicnlfY2xhc3NbXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIl07XG5cblx0XHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0Y29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblx0XHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiZGlzY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYoIFwiSG9zdFwiIGluIENvbXBvbmVudENsYXNzIClcblx0XHRIb3N0ID0gQ29tcG9uZW50Q2xhc3MuSG9zdCBhcyBhbnk7XG5cbiAgICBsZXQgaHRtbHRhZyA9IHVuZGVmaW5lZDtcbiAgICBpZiggXCJDZmdcIiBpbiBIb3N0KSB7XG4gICAgICAgIGNvbnN0IENsYXNzICA9IEhvc3QuQ2ZnLmhvc3Q7XG4gICAgICAgIGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBIb3N0LCBvcHRzKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHJ8TElTU0hvc3Q8TElTU0NvbnRyb2xlcj58TElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+ICk6IHN0cmluZyB7XG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIGlmKCBcImhvc3RcIiBpbiBlbGVtZW50KVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5ob3N0O1xuICAgIGlmKCBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICBjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICBpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8vIGNzdHJcblxuXHRpZiggXCJIb3N0XCIgaW4gZWxlbWVudClcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuSG9zdCBhcyB1bmtub3duIGFzIExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPjtcblxuICAgIGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG4gICAgaWYobmFtZSA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBpcyBub3QgZGVmaW5lZCFcIik7XG5cbiAgICByZXR1cm4gbmFtZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSkgIT09IHVuZGVmaW5lZDtcblxuICAgIGlmKCBcIkhvc3RcIiBpbiBlbGVtKVxuICAgICAgICBlbGVtID0gZWxlbS5Ib3N0IGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0gYXMgYW55KSAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0Q3N0cjxUPj4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlbGVtKTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbGlzdGVuIGRlZmluZS4uLlxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59XG5cbi8qXG4vLyBUT0RPOiBpbXBsZW1lbnRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10pIDogUHJvbWlzZTx2b2lkPiB7XG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG59XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3RDc3RyPFQ+PiB7XG4gICAgLy8gd2UgY2FuJ3QgZm9yY2UgYSBkZWZpbmUuXG4gICAgcmV0dXJuIHdoZW5EZWZpbmVkKGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdENzdHI8VD4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuXG4gICAgICAgIGxldCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pO1xuICAgICAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlbGVtfSBub3QgZGVmaW5lZCB5ZXQhYCk7XG5cbiAgICAgICAgcmV0dXJuIGhvc3QgYXMgdW5rbm93biBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgaWYoIFwiSG9zdFwiIGluIGVsZW0pXG4gICAgICAgIGVsZW0gPSBlbGVtLkhvc3QgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgaWYoIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSBhcyBhbnkpID09PSBudWxsIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2VsZW19IG5vdCBkZWZpbmVkIHlldCFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0Q3N0cjxUPjtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCB3aGVuVXBncmFkZWQgfSBmcm9tIFwiLi9VUEdSQURFRFwiO1xuaW1wb3J0IHsgaXNSZWFkeSwgd2hlblJlYWR5IH0gZnJvbSBcIi4vUkVBRFlcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBMSVNTSG9zdDxUPnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoICEgaXNVcGdyYWRlZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHdoZW5VcGdyYWRlZChlbGVtKTtcblxuICAgIHJldHVybiBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZCBhcyBUO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29udHJvbGVyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG4gICAgYXdhaXQgd2hlblJlYWR5KGhvc3QpO1xuXG4gICAgLy9UT0RPOiBpbml0aWFsaXplU3luYyB2cyBpbml0aWFsaXplID9cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcbiAgICBpZiggISBpc1JlYWR5KGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kYW5jaWVzIG5vdCByZWFkeSAhXCIpXG5cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplICAgICA9IGdldENvbnRyb2xlcjtcbmV4cG9ydCBjb25zdCBpbml0aWFsaXplU3luYyA9IGdldENvbnRyb2xlclN5bmM7IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlYWR5PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgY29uc3QgaG9zdENzdHIgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICByZXR1cm4gaG9zdENzdHIuaXNEZXBzUmVzb2x2ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuUmVhZHk8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IGhvc3RDc3RyID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG4gICAgYXdhaXQgaG9zdENzdHIud2hlbkRlcHNSZXNvbHZlZDtcblxuICAgIHJldHVybiBob3N0Q3N0ci5Db250cm9sZXIgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIC8vIHdlIGNhbid0IGZvcmNlIGEgcmVhZHkuXG4gICAgcmV0dXJuIHdoZW5SZWFkeShlbGVtKSBhcyBQcm9taXNlPFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0clN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGlmKCAhIGlzUmVhZHkoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgcmV0dXJuIGdldEhvc3RDc3RyU3luYyhlbGVtKS5Db250cm9sZXIgYXMgVDtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPF9UIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBIVE1MRWxlbWVudDtcblxuLy9UT0RPOiB1cGdyYWRlIGZ1bmN0aW9uLi4uXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPnxMSVNTSG9zdDxUPik6IGVsZW0gaXMgTElTU0hvc3Q8VD4ge1xuXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgSG9zdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgY29uc3QgSG9zdCA9IGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuXG4gICAgLy8gYWxyZWFkeSB1cGdyYWRlZFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSG9zdClcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG5cbiAgICAvLyBoNGNrXG5cbiAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xuICAgIH1cblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgIFxuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0U3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdDxUPiB7XG4gICAgXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgZGVmaW5lZCAhXCIpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgY29uc3QgdXBncmFkZSAgICAgPSBnZXRIb3N0O1xuZXhwb3J0IGNvbnN0IHVwZ3JhZGVTeW5jID0gZ2V0SG9zdFN5bmMiLCJleHBvcnQgZW51bSBTdGF0ZXMge1xuICAgIExJU1NfREVGSU5FRCAgICAgPSBcIkxJU1NfREVGSU5FRFwiLFxuICAgIExJU1NfVVBHUkFERUQgICAgPSBcIkxJU1NfVVBHUkFERURcIixcbiAgICBMSVNTX1JFQURZICAgICAgID0gXCJMSVNTX1JFQURZXCIsXG4gICAgTElTU19JTklUSUFMSVpFRCA9IFwiTElTU19JTklUSUFMSVpFRFwiXG59IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuXG5pbXBvcnQge1N0YXRlc30gZnJvbSBcIi4uL0xpZmVDeWNsZS9zdGF0ZXMudHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIFN0YXRlcyAgICAgICAgIDogdHlwZW9mIFN0YXRlc1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5TdGF0ZXMgPSBTdGF0ZXM7XG5cblxuaW1wb3J0IHtkZWZpbmUsIGdldE5hbWUsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQsIGdldEhvc3RDc3RyLCBnZXRIb3N0Q3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdGdldEhvc3RDc3RyICAgIDogdHlwZW9mIGdldEhvc3RDc3RyO1xuXHRcdGdldEhvc3RDc3RyU3luYzogdHlwZW9mIGdldEhvc3RDc3RyU3luYztcblx0XHQvLyB3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldEhvc3RDc3RyU3luYz0gZ2V0SG9zdENzdHJTeW5jO1xuXG4vL0xJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcblxuaW1wb3J0IHtpc1JlYWR5LCB3aGVuUmVhZHksIGdldENvbnRyb2xlckNzdHIsIGdldENvbnRyb2xlckNzdHJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1JFQURZXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzUmVhZHkgICAgICA6IHR5cGVvZiBpc1JlYWR5O1xuXHRcdHdoZW5SZWFkeSAgICA6IHR5cGVvZiB3aGVuUmVhZHk7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0ciAgICA6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyO1xuXHRcdGdldENvbnRyb2xlckNzdHJTeW5jOiB0eXBlb2YgZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzUmVhZHkgICAgICAgICAgICAgPSBpc1JlYWR5O1xuTElTUy53aGVuUmVhZHkgICAgICAgICAgID0gd2hlblJlYWR5O1xuTElTUy5nZXRDb250cm9sZXJDc3RyICAgID0gZ2V0Q29udHJvbGVyQ3N0cjtcbkxJU1MuZ2V0Q29udHJvbGVyQ3N0clN5bmM9IGdldENvbnRyb2xlckNzdHJTeW5jO1xuXG5cblxuaW1wb3J0IHtpc1VwZ3JhZGVkLCB3aGVuVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCBnZXRIb3N0LCBnZXRIb3N0U3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9VUEdSQURFRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc1VwZ3JhZGVkICA6IHR5cGVvZiBpc1VwZ3JhZGVkO1xuXHRcdHdoZW5VcGdyYWRlZDogdHlwZW9mIHdoZW5VcGdyYWRlZDtcblx0XHR1cGdyYWRlICAgICA6IHR5cGVvZiB1cGdyYWRlO1xuXHRcdHVwZ3JhZGVTeW5jIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuXHRcdGdldEhvc3QgICAgIDogdHlwZW9mIGdldEhvc3Q7XG5cdFx0Z2V0SG9zdFN5bmMgOiB0eXBlb2YgZ2V0SG9zdFN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzVXBncmFkZWQgID0gaXNVcGdyYWRlZDtcbkxJU1Mud2hlblVwZ3JhZGVkPSB3aGVuVXBncmFkZWQ7XG5MSVNTLnVwZ3JhZGUgICAgID0gdXBncmFkZTtcbkxJU1MudXBncmFkZVN5bmMgPSB1cGdyYWRlU3luYztcbkxJU1MuZ2V0SG9zdCAgICAgPSBnZXRIb3N0O1xuTElTUy5nZXRIb3N0U3luYyA9IGdldEhvc3RTeW5jO1xuXG5cbmltcG9ydCB7aXNJbml0aWFsaXplZCwgd2hlbkluaXRpYWxpemVkLCBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYywgZ2V0Q29udHJvbGVyLCBnZXRDb250cm9sZXJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzSW5pdGlhbGl6ZWQgICAgOiB0eXBlb2YgaXNJbml0aWFsaXplZDtcblx0XHR3aGVuSW5pdGlhbGl6ZWQgIDogdHlwZW9mIHdoZW5Jbml0aWFsaXplZDtcblx0XHRpbml0aWFsaXplICAgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG5cdFx0aW5pdGlhbGl6ZVN5bmMgICA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcblx0XHRnZXRDb250cm9sZXIgICAgIDogdHlwZW9mIGdldENvbnRyb2xlcjtcblx0XHRnZXRDb250cm9sZXJTeW5jIDogdHlwZW9mIGdldENvbnRyb2xlclN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzSW5pdGlhbGl6ZWQgICAgPSBpc0luaXRpYWxpemVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQgID0gd2hlbkluaXRpYWxpemVkO1xuTElTUy5pbml0aWFsaXplICAgICAgID0gaW5pdGlhbGl6ZTtcbkxJU1MuaW5pdGlhbGl6ZVN5bmMgICA9IGluaXRpYWxpemVTeW5jO1xuTElTUy5nZXRDb250cm9sZXIgICAgID0gZ2V0Q29udHJvbGVyO1xuTElTUy5nZXRDb250cm9sZXJTeW5jID0gZ2V0Q29udHJvbGVyU3luYzsiLCJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPik6IFJldHVyblR5cGU8dHlwZW9mIF9leHRlbmRzPEV4dGVuZHNDc3RyLCBPcHRzPj5cbi8vIExJU1NDb250cm9sZXIgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPlxuZXhwb3J0IGZ1bmN0aW9uIExJU1Mob3B0czogYW55ID0ge30pOiBMSVNTQ29udHJvbGVyQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NDb250cm9sZXJDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRlbmRzPFxuICAgICAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgICAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pIHtcblxuICAgIGlmKCBvcHRzLmV4dGVuZHMgPT09IHVuZGVmaW5lZCkgLy8gaDRja1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGEgTElTU0NvbnRyb2xlciEnKTtcblxuICAgIGNvbnN0IGNmZyA9IG9wdHMuZXh0ZW5kcy5Ib3N0LkNmZztcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgY2ZnLCBjZmcuYXJncywgb3B0cyk7XG5cbiAgICBjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBvcHRzLmV4dGVuZHMhIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgb3ZlcnJpZGUgX0hvc3Q6IExJU1NIb3N0PEV4dGVuZGVkTElTUz47XG5cbiAgICAgICAgLy8gVFMgaXMgc3R1cGlkLCByZXF1aXJlcyBleHBsaWNpdCByZXR1cm4gdHlwZVxuXHRcdHN0YXRpYyBvdmVycmlkZSBnZXQgSG9zdCgpOiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+IHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBmdWNrIG9mZlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuaG9zdCEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250ZW50X2dlbmVyYXRvciEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59IiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIExIb3N0LCBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4uL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCB7IGRlZmluZSB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuXG5leHBvcnQgY29uc3QgS25vd25UYWdzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbmxldCBzY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pignc2NyaXB0W2F1dG9kaXJdJyk7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0NESVIgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpID8/IG51bGw7XG5cbmlmKHNjcmlwdCAhPT0gbnVsbClcblx0YXV0b2xvYWQoc2NyaXB0KVxuXG5cbmZ1bmN0aW9uIGF1dG9sb2FkKHNjcmlwdDogSFRNTEVsZW1lbnQpIHtcblxuXHRsZXQgY2RpcjogbnVsbHxzdHJpbmcgPSBERUZBVUxUX0NESVI7XG5cblx0Y29uc3QgU1c6IFByb21pc2U8dm9pZD4gPSBuZXcgUHJvbWlzZSggYXN5bmMgKHJlc29sdmUpID0+IHtcblxuXHRcdGNvbnN0IHN3X3BhdGggPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdzdycpO1xuXG5cdFx0aWYoIHN3X3BhdGggPT09IG51bGwgKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJZb3UgYXJlIHVzaW5nIExJU1MgQXV0byBtb2RlIHdpdGhvdXQgc3cuanMuXCIpO1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc3dfcGF0aCwge3Njb3BlOiBcIi9cIn0pO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiUmVnaXN0cmF0aW9uIG9mIFNlcnZpY2VXb3JrZXIgZmFpbGVkXCIpO1xuXHRcdFx0Y29uc29sZS5lcnJvcihlKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9XG5cblx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRjZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpITtcblxuXHRpZiggY2RpcltjZGlyLmxlbmd0aC0xXSAhPT0gJy8nKVxuXHRcdGNkaXIgKz0gJy8nO1xuXG5cdGNvbnN0IGJyeXRob24gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwiYnJ5dGhvblwiKTtcblxuXHQvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcblx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0aWYoYWRkaXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcblx0XHRcdFx0XHRhZGRUYWcoYWRkaXRpb24pXG5cblx0fSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuXHRmb3IoIGxldCBlbGVtIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiKlwiKSApXG5cdFx0YWRkVGFnKCBlbGVtICk7XG5cblx0YXN5bmMgZnVuY3Rpb24gYWRkVGFnKHRhZzogSFRNTEVsZW1lbnQpIHtcblxuXHRcdGF3YWl0IFNXOyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG5cdFx0Y29uc3QgdGFnbmFtZSA9ICggdGFnLmdldEF0dHJpYnV0ZSgnaXMnKSA/PyB0YWcudGFnTmFtZSApLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRsZXQgaG9zdCA9IEhUTUxFbGVtZW50O1xuXHRcdGlmKCB0YWcuaGFzQXR0cmlidXRlKCdpcycpIClcblx0XHRcdGhvc3QgPSB0YWcuY29uc3RydWN0b3IgYXMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG5cblx0XHRpZiggISB0YWduYW1lLmluY2x1ZGVzKCctJykgfHwgS25vd25UYWdzLmhhcyggdGFnbmFtZSApIClcblx0XHRcdHJldHVybjtcblxuXHRcdGltcG9ydENvbXBvbmVudCh0YWduYW1lLCB7XG5cdFx0XHRicnl0aG9uLFxuXHRcdFx0Y2Rpcixcblx0XHRcdGhvc3Rcblx0XHR9KTtcdFx0XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZywgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9wdHM6IHtodG1sOiBzdHJpbmcsIGNzczogc3RyaW5nLCBob3N0OiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD59KSB7XG5cblx0Y29uc3QgY19qcyAgICAgID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0b3B0cy5odG1sICAgICA/Pz0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXG5cdGxldCBrbGFzczogbnVsbHwgUmV0dXJuVHlwZTx0eXBlb2YgTElTUz4gPSBudWxsO1xuXHRpZiggY19qcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0Y29uc3QgZmlsZSA9IG5ldyBCbG9iKFtjX2pzXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG5cdFx0Y29uc3QgdXJsICA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG5cblx0XHRjb25zdCBvbGRyZXEgPSBMSVNTLnJlcXVpcmU7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBmdW5jdGlvbih1cmw6IFVSTHxzdHJpbmcpIHtcblxuXHRcdFx0aWYoIHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgJiYgdXJsLnN0YXJ0c1dpdGgoJy4vJykgKSB7XG5cdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gdXJsLnNsaWNlKDIpO1xuXHRcdFx0XHRpZiggZmlsZW5hbWUgaW4gZmlsZXMpXG5cdFx0XHRcdFx0cmV0dXJuIGZpbGVzW2ZpbGVuYW1lXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9sZHJlcSh1cmwpO1xuXHRcdH1cblxuXHRcdGtsYXNzID0gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVybCkpLmRlZmF1bHQ7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBvbGRyZXE7XG5cdH1cblx0ZWxzZSBpZiggb3B0cy5odG1sICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRrbGFzcyA9IExJU1Moe1xuXHRcdFx0Li4ub3B0cyxcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yXG5cdFx0fSk7XG5cdH1cblxuXHRpZigga2xhc3MgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0ZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuXHRyZXR1cm4ga2xhc3M7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgaW50ZXJuYWwgdG9vbHMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9mZXRjaFRleHQodXJpOiBzdHJpbmd8VVJMLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHRjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuXHRcdFx0XHRcdFx0PyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuXHRcdFx0XHRcdFx0OiB7fTtcblxuXG5cdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcblx0aWYocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0aWYoIGlzTGlzc0F1dG8gJiYgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJzdGF0dXNcIikhID09PSBcIjQwNFwiIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGNvbnN0IGFuc3dlciA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcblxuXHRpZihhbnN3ZXIgPT09IFwiXCIpXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gYW5zd2VyXG59XG5hc3luYyBmdW5jdGlvbiBfaW1wb3J0KHVyaTogc3RyaW5nLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHQvLyB0ZXN0IGZvciB0aGUgbW9kdWxlIGV4aXN0YW5jZS5cblx0aWYoaXNMaXNzQXV0byAmJiBhd2FpdCBfZmV0Y2hUZXh0KHVyaSwgaXNMaXNzQXV0bykgPT09IHVuZGVmaW5lZCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHR0cnkge1xuXHRcdHJldHVybiAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJpKSkuZGVmYXVsdDtcblx0fSBjYXRjaChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxufVxuXG5cbmNvbnN0IGNvbnZlcnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZUhUTUwodGV4dDogc3RyaW5nKSB7XG5cdGNvbnZlcnRlci50ZXh0Q29udGVudCA9IHRleHQ7XG5cdHJldHVybiBjb252ZXJ0ZXIuaW5uZXJIVE1MO1xufVxuXG5leHBvcnQgY2xhc3MgTElTU0F1dG9fQ29udGVudEdlbmVyYXRvciBleHRlbmRzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG5cdHByb3RlY3RlZCBvdmVycmlkZSBwcmVwYXJlSFRNTChodG1sPzogRG9jdW1lbnRGcmFnbWVudCB8IEhUTUxFbGVtZW50IHwgc3RyaW5nKSB7XG5cdFx0XG5cdFx0dGhpcy5kYXRhID0gbnVsbDtcblxuXHRcdGlmKCB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycgKSB7XG5cblx0XHRcdHRoaXMuZGF0YSA9IGh0bWw7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdC8qXG5cdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHJldHVybiBgPGxpc3MgdmFsdWU9XCIke25hbWV9XCI+PC9saXNzPmA7XG5cdFx0XHR9KTsqL1xuXG5cdFx0XHQvL1RPRE86ICR7fSBpbiBhdHRyXG5cdFx0XHRcdC8vIC0gZGV0ZWN0IHN0YXJ0ICR7ICsgZW5kIH1cblx0XHRcdFx0Ly8gLSByZWdpc3RlciBlbGVtICsgYXR0ciBuYW1lXG5cdFx0XHRcdC8vIC0gcmVwbGFjZS4gXG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBzdXBlci5wcmVwYXJlSFRNTChodG1sKTtcblx0fVxuXG5cdG92ZXJyaWRlIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKHNoYWRvdy5ob3N0LmdldEF0dHJpYnV0ZShtYXRjaCkgPz8gJycgKSk7XG5cdFx0XHRzdXBlci5zZXRUZW1wbGF0ZSggc3VwZXIucHJlcGFyZUhUTUwoc3RyKSEgKTtcblx0XHR9XG5cblx0XHRzdXBlci5maWxsQ29udGVudChzaGFkb3cpO1xuXG5cdFx0Lypcblx0XHQvLyBodG1sIG1hZ2ljIHZhbHVlcyBjb3VsZCBiZSBvcHRpbWl6ZWQuLi5cblx0XHRjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cdFx0Zm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG5cdFx0XHR2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cdFx0Ki9cblxuXHR9XG5cblx0b3ZlcnJpZGUgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnQgfCBTaGFkb3dSb290IHtcblx0XHRcblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0aWYoIHRoaXMuZGF0YSAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3Qgc3RyID0gKHRoaXMuZGF0YSBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gZW5jb2RlSFRNTChob3N0LmdldEF0dHJpYnV0ZShtYXRjaCkgPz8gJycgKSk7XG5cdFx0XHRzdXBlci5zZXRUZW1wbGF0ZSggc3VwZXIucHJlcGFyZUhUTUwoc3RyKSEgKTtcblx0XHR9XG5cblx0XHRjb25zdCBjb250ZW50ID0gc3VwZXIuZ2VuZXJhdGUoaG9zdCk7XG5cblx0XHQvKlxuXHRcdC8vIGh0bWwgbWFnaWMgdmFsdWVzLlxuXHRcdC8vIGNhbiBiZSBvcHRpbWl6ZWQuLi5cblx0XHRjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cdFx0Zm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG5cdFx0XHR2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cdFx0Ki9cblxuXHRcdC8vIGNzcyBwcm9wLlxuXHRcdGNvbnN0IGNzc19hdHRycyA9IGhvc3QuZ2V0QXR0cmlidXRlTmFtZXMoKS5maWx0ZXIoIGUgPT4gZS5zdGFydHNXaXRoKCdjc3MtJykpO1xuXHRcdGZvcihsZXQgY3NzX2F0dHIgb2YgY3NzX2F0dHJzKVxuXHRcdFx0aG9zdC5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke2Nzc19hdHRyLnNsaWNlKCdjc3MtJy5sZW5ndGgpfWAsIGhvc3QuZ2V0QXR0cmlidXRlKGNzc19hdHRyKSk7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50cyA6IHR5cGVvZiBpbXBvcnRDb21wb25lbnRzO1xuICAgICAgICBpbXBvcnRDb21wb25lbnQgIDogdHlwZW9mIGltcG9ydENvbXBvbmVudDtcbiAgICAgICAgcmVxdWlyZSAgICAgICAgICA6IHR5cGVvZiByZXF1aXJlO1xuICAgIH1cbn1cblxudHlwZSBpbXBvcnRDb21wb25lbnRzX09wdHM8VCBleHRlbmRzIEhUTUxFbGVtZW50PiA9IHtcblx0Y2RpciAgID86IHN0cmluZ3xudWxsLFxuXHRicnl0aG9uPzogc3RyaW5nfG51bGwsXG5cdGhvc3QgICA/OiBDb25zdHJ1Y3RvcjxUPlxufTtcblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdFx0XHRcdFx0XHRjb21wb25lbnRzOiBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y2RpciAgICA9IERFRkFVTFRfQ0RJUixcblx0XHRcdFx0XHRcdFx0YnJ5dGhvbiA9IG51bGwsXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0aG9zdCAgICA9IEhUTUxFbGVtZW50XG5cdFx0XHRcdFx0XHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4pIHtcblxuXHRjb25zdCByZXN1bHRzOiBSZWNvcmQ8c3RyaW5nLCBMSVNTQ29udHJvbGVyQ3N0cj4gPSB7fTtcblxuXHRmb3IobGV0IHRhZ25hbWUgb2YgY29tcG9uZW50cykge1xuXG5cdFx0cmVzdWx0c1t0YWduYW1lXSA9IGF3YWl0IGltcG9ydENvbXBvbmVudCh0YWduYW1lLCB7XG5cdFx0XHRjZGlyLFxuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGhvc3Rcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiByZXN1bHRzO1xufVxuXG5jb25zdCBicnlfd3JhcHBlciA9IGBmcm9tIGJyb3dzZXIgaW1wb3J0IHNlbGZcblxuZGVmIHdyYXBqcyhqc19rbGFzcyk6XG5cblx0Y2xhc3MgV3JhcHBlcjpcblxuXHRcdF9qc19rbGFzcyA9IGpzX2tsYXNzXG5cdFx0X2pzID0gTm9uZVxuXG5cdFx0ZGVmIF9faW5pdF9fKHRoaXMsICphcmdzKTpcblx0XHRcdHRoaXMuX2pzID0ganNfa2xhc3MubmV3KCphcmdzKVxuXG5cdFx0ZGVmIF9fZ2V0YXR0cl9fKHRoaXMsIG5hbWU6IHN0cik6XG5cdFx0XHRyZXR1cm4gdGhpcy5fanNbbmFtZV07XG5cblx0XHRkZWYgX19zZXRhdHRyX18odGhpcywgbmFtZTogc3RyLCB2YWx1ZSk6XG5cdFx0XHRpZiBuYW1lID09IFwiX2pzXCI6XG5cdFx0XHRcdHN1cGVyKCkuX19zZXRhdHRyX18obmFtZSwgdmFsdWUpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0dGhpcy5fanNbbmFtZV0gPSB2YWx1ZVxuXHRcblx0cmV0dXJuIFdyYXBwZXJcblxuc2VsZi53cmFwanMgPSB3cmFwanNcbmA7XG5cblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50PFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0dGFnbmFtZTogc3RyaW5nLFxuXHR7XG5cdFx0Y2RpciAgICA9IERFRkFVTFRfQ0RJUixcblx0XHRicnl0aG9uID0gbnVsbCxcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0aG9zdCAgICA9IEhUTUxFbGVtZW50LFxuXHRcdGZpbGVzICAgPSBudWxsXG5cdH06IGltcG9ydENvbXBvbmVudHNfT3B0czxUPiAmIHtmaWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz58bnVsbH0gPSB7fVxuKSB7XG5cblx0S25vd25UYWdzLmFkZCh0YWduYW1lKTtcblxuXHRjb25zdCBjb21wb19kaXIgPSBgJHtjZGlyfSR7dGFnbmFtZX0vYDtcblxuXHRpZiggZmlsZXMgPT09IG51bGwgKSB7XG5cdFx0ZmlsZXMgPSB7fTtcblxuXHRcdGNvbnN0IGZpbGUgPSBicnl0aG9uID09PSBcInRydWVcIiA/ICdpbmRleC5icnknIDogJ2luZGV4LmpzJztcblxuXHRcdGZpbGVzW2ZpbGVdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfSR7ZmlsZX1gLCB0cnVlKSkhO1xuXG5cdFx0Ly9UT0RPISEhXG5cdFx0dHJ5IHtcblx0XHRcdGZpbGVzW1wiaW5kZXguaHRtbFwiXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5odG1sYCwgdHJ1ZSkpITtcblx0XHR9IGNhdGNoKGUpIHtcblxuXHRcdH1cblx0XHR0cnkge1xuXHRcdFx0ZmlsZXNbXCJpbmRleC5jc3NcIiBdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4LmNzc2AgLCB0cnVlKSkhO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XG5cdFx0fVxuXHR9XG5cblx0aWYoIGJyeXRob24gPT09IFwidHJ1ZVwiICYmIGZpbGVzWydpbmRleC5icnknXSAhPT0gdW5kZWZpbmVkKSB7XG5cblx0XHRjb25zdCBjb2RlID0gZmlsZXNbXCJpbmRleC5icnlcIl07XG5cblx0XHRmaWxlc1snaW5kZXguanMnXSA9XG5gY29uc3QgJEIgPSBnbG9iYWxUaGlzLl9fQlJZVEhPTl9fO1xuXG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHticnlfd3JhcHBlcn1cXGAsIFwiX1wiKTtcbiRCLnJ1blB5dGhvblNvdXJjZShcXGAke2NvZGV9XFxgLCBcIl9cIik7XG5cbmNvbnN0IG1vZHVsZSA9ICRCLmltcG9ydGVkW1wiX1wiXTtcbmV4cG9ydCBkZWZhdWx0IG1vZHVsZS5XZWJDb21wb25lbnQ7XG5cbmA7XG5cdH1cblxuXHRjb25zdCBodG1sID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXHRjb25zdCBjc3MgID0gZmlsZXNbXCJpbmRleC5jc3NcIl07XG5cblx0cmV0dXJuIGF3YWl0IGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcywge2h0bWwsIGNzcywgaG9zdH0pO1xufVxuXG5mdW5jdGlvbiByZXF1aXJlKHVybDogVVJMfHN0cmluZyk6IFByb21pc2U8UmVzcG9uc2U+fHN0cmluZyB7XG5cdHJldHVybiBmZXRjaCh1cmwpO1xufVxuXG5cbkxJU1MuaW1wb3J0Q29tcG9uZW50cyA9IGltcG9ydENvbXBvbmVudHM7XG5MSVNTLmltcG9ydENvbXBvbmVudCAgPSBpbXBvcnRDb21wb25lbnQ7XG5MSVNTLnJlcXVpcmUgID0gcmVxdWlyZTsiLCJpbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcbmltcG9ydCB0eXBlIHsgTElTU0NvbnRyb2xlciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufSIsIlxuaW1wb3J0IHsgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxudHlwZSBMaXN0ZW5lckZjdDxUIGV4dGVuZHMgRXZlbnQ+ID0gKGV2OiBUKSA9PiB2b2lkO1xudHlwZSBMaXN0ZW5lck9iajxUIGV4dGVuZHMgRXZlbnQ+ID0geyBoYW5kbGVFdmVudDogTGlzdGVuZXJGY3Q8VD4gfTtcbnR5cGUgTGlzdGVuZXI8VCBleHRlbmRzIEV2ZW50PiA9IExpc3RlbmVyRmN0PFQ+fExpc3RlbmVyT2JqPFQ+O1xuXG5leHBvcnQgY2xhc3MgRXZlbnRUYXJnZXQyPEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEV2ZW50Pj4gZXh0ZW5kcyBFdmVudFRhcmdldCB7XG5cblx0b3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGNhbGxiYWNrOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBvcHRpb25zPzogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuKTogdm9pZCB7XG5cdFx0XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0cmV0dXJuIHN1cGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZGlzcGF0Y2hFdmVudDxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+PihldmVudDogRXZlbnRzW1RdKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHN1cGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG5cblx0b3ZlcnJpZGUgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsaXN0ZW5lcjogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG9wdGlvbnM/OiBib29sZWFufEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZCB7XG5cblx0XHQvL0B0cy1pZ25vcmVcblx0XHRzdXBlci5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXZlbnQyPFQgZXh0ZW5kcyBzdHJpbmcsIEFyZ3M+IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8QXJncz4ge1xuXG5cdGNvbnN0cnVjdG9yKHR5cGU6IFQsIGFyZ3M6IEFyZ3MpIHtcblx0XHRzdXBlcih0eXBlLCB7ZGV0YWlsOiBhcmdzfSk7XG5cdH1cblxuXHRvdmVycmlkZSBnZXQgdHlwZSgpOiBUIHsgcmV0dXJuIHN1cGVyLnR5cGUgYXMgVDsgfVxufVxuXG50eXBlIEluc3RhbmNlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+Pj4gPSB7XG5cdFtLIGluIGtleW9mIFRdOiBJbnN0YW5jZVR5cGU8VFtLXT5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdpdGhFdmVudHM8VCBleHRlbmRzIG9iamVjdCwgRXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+PiA+KGV2OiBDb25zdHJ1Y3RvcjxUPiwgX2V2ZW50czogRXZlbnRzKSB7XG5cblx0dHlwZSBFdnRzID0gSW5zdGFuY2VzPEV2ZW50cz47XG5cblx0aWYoICEgKGV2IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQpIClcblx0XHRyZXR1cm4gZXYgYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xuXG5cdC8vIGlzIGFsc28gYSBtaXhpblxuXHQvLyBAdHMtaWdub3JlXG5cdGNsYXNzIEV2ZW50VGFyZ2V0TWl4aW5zIGV4dGVuZHMgZXYge1xuXG5cdFx0I2V2ID0gbmV3IEV2ZW50VGFyZ2V0MjxFdnRzPigpO1xuXG5cdFx0YWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hFdmVudCguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuZGlzcGF0Y2hFdmVudCguLi5hcmdzKTtcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiBFdmVudFRhcmdldE1peGlucyBhcyB1bmtub3duIGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+Pjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBTaGFkb3dSb290IHRvb2xzID09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBldmVudE1hdGNoZXMoZXY6IEV2ZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cblx0bGV0IGVsZW1lbnRzID0gZXYuY29tcG9zZWRQYXRoKCkuc2xpY2UoMCwtMikuZmlsdGVyKGUgPT4gISAoZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpICkucmV2ZXJzZSgpIGFzIEhUTUxFbGVtZW50W107XG5cblx0Zm9yKGxldCBlbGVtIG9mIGVsZW1lbnRzIClcblx0XHRpZihlbGVtLm1hdGNoZXMoc2VsZWN0b3IpIClcblx0XHRcdHJldHVybiBlbGVtOyBcblxuXHRyZXR1cm4gbnVsbDtcbn0iLCJcbmltcG9ydCB0eXBlIHsgTElTU0NvbnRyb2xlciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudHMge307XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplU3luYywgd2hlbkluaXRpYWxpemVkIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9JTklUSUFMSVpFRFwiO1xuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIC8vIGFzeW5jXG4gICAgICAgIHFzIDogdHlwZW9mIHFzO1xuICAgICAgICBxc286IHR5cGVvZiBxc287XG4gICAgICAgIHFzYTogdHlwZW9mIHFzYTtcbiAgICAgICAgcXNjOiB0eXBlb2YgcXNjO1xuXG4gICAgICAgIC8vIHN5bmNcbiAgICAgICAgcXNTeW5jIDogdHlwZW9mIHFzU3luYztcbiAgICAgICAgcXNhU3luYzogdHlwZW9mIHFzYVN5bmM7XG4gICAgICAgIHFzY1N5bmM6IHR5cGVvZiBxc2NTeW5jO1xuXG5cdFx0Y2xvc2VzdDogdHlwZW9mIGNsb3Nlc3Q7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsaXNzX3NlbGVjdG9yKG5hbWU/OiBzdHJpbmcpIHtcblx0aWYobmFtZSA9PT0gdW5kZWZpbmVkKSAvLyBqdXN0IGFuIGg0Y2tcblx0XHRyZXR1cm4gXCJcIjtcblx0cmV0dXJuIGA6aXMoJHtuYW1lfSwgW2lzPVwiJHtuYW1lfVwiXSlgO1xufVxuXG5mdW5jdGlvbiBfYnVpbGRRUyhzZWxlY3Rvcjogc3RyaW5nLCB0YWduYW1lX29yX3BhcmVudD86IHN0cmluZyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCwgcGFyZW50OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXHRcblx0aWYoIHRhZ25hbWVfb3JfcGFyZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRhZ25hbWVfb3JfcGFyZW50ICE9PSAnc3RyaW5nJykge1xuXHRcdHBhcmVudCA9IHRhZ25hbWVfb3JfcGFyZW50O1xuXHRcdHRhZ25hbWVfb3JfcGFyZW50ID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cmV0dXJuIFtgJHtzZWxlY3Rvcn0ke2xpc3Nfc2VsZWN0b3IodGFnbmFtZV9vcl9wYXJlbnQgYXMgc3RyaW5nfHVuZGVmaW5lZCl9YCwgcGFyZW50XSBhcyBjb25zdDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxczxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRsZXQgcmVzdWx0ID0gYXdhaXQgcXNvPFQ+KHNlbGVjdG9yLCBwYXJlbnQpO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiByZXN1bHQhXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUW10+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dW10gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxUPj4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cHJvbWlzZXNbaWR4KytdID0gd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVDtcbmZ1bmN0aW9uIHFzU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG59XG5cbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFRbXTtcbmZ1bmN0aW9uIHFzYVN5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl1bXTtcbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTxUPiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRyZXN1bHRbaWR4KytdID0gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogVDtcbmZ1bmN0aW9uIHFzY1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4ocmVzdWx0KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNsb3Nlc3Q8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcblxuXHR3aGlsZSh0cnVlKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGVsZW1lbnQuY2xvc2VzdDxFPihzZWxlY3Rvcik7XG5cblx0XHRpZiggcmVzdWx0ICE9PSBudWxsKVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblxuXHRcdGNvbnN0IHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG5cdFx0aWYoICEgKFwiaG9zdFwiIGluIHJvb3QpIClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0ZWxlbWVudCA9IChyb290IGFzIFNoYWRvd1Jvb3QpLmhvc3Q7XG5cdH1cbn1cblxuXG4vLyBhc3luY1xuTElTUy5xcyAgPSBxcztcbkxJU1MucXNvID0gcXNvO1xuTElTUy5xc2EgPSBxc2E7XG5MSVNTLnFzYyA9IHFzYztcblxuLy8gc3luY1xuTElTUy5xc1N5bmMgID0gcXNTeW5jO1xuTElTUy5xc2FTeW5jID0gcXNhU3luYztcbkxJU1MucXNjU3luYyA9IHFzY1N5bmM7XG5cbkxJU1MuY2xvc2VzdCA9IGNsb3Nlc3Q7IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgXCIuL2NvcmUvTGlmZUN5Y2xlXCI7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vVE9ETzogZXZlbnRzLnRzXG4vL1RPRE86IGdsb2JhbENTU1J1bGVzXG5leHBvcnQge0xJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL2hlbHBlcnMvTElTU0F1dG9cIjtcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge1NoYWRvd0NmZ30gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHtsaXNzLCBsaXNzU3luY30gZnJvbSBcIi4vaGVscGVycy9idWlsZFwiO1xuZXhwb3J0IHtldmVudE1hdGNoZXMsIFdpdGhFdmVudHMsIEV2ZW50VGFyZ2V0MiwgQ3VzdG9tRXZlbnQyfSBmcm9tICcuL2hlbHBlcnMvZXZlbnRzJztcbmV4cG9ydCB7aHRtbH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7XG5cbi8vIGZvciBkZWJ1Zy5cbmV4cG9ydCB7X2V4dGVuZHN9IGZyb20gXCIuL2V4dGVuZHNcIjsiLCJpbXBvcnQgdHlwZSB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IHtcbiAgICAgICAgZXh0ZW5kczogRXh0ZW5kc0N0ciwgLy8gSlMgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0ciwgICAvLyBIVE1MIEhvc3RcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxufSAmIENvbnRlbnRHZW5lcmF0b3JfT3B0cztcblxuLy9UT0RPOiByZXdyaXRlLi4uXG4vLyBMSVNTQ29udHJvbGVyXG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXJDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBJbnN0YW5jZVR5cGU8TElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyMkxJU1NDb250cm9sZXJDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPFxuICAgICAgICAgICAgaW5mZXIgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0cixIb3N0Q3N0cj4gOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyID0gTElTU0NvbnRyb2xlcj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyID8gTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47XG5cbi8vIGxpZ2h0ZXIgTElTU0hvc3QgZGVmIHRvIGF2b2lkIHR5cGUgaXNzdWVzLi4uXG5leHBvcnQgdHlwZSBMSG9zdDxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG5cbiAgICBjb250ZW50OiBTaGFkb3dSb290fEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICBzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIENTU1NlbGVjdG9yOiBzdHJpbmc7XG5cbn0gJiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5leHBvcnQgdHlwZSBMSG9zdENzdHI8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuICAgIG5ldyguLi5hcmdzOiBhbnkpOiBMSG9zdDxIb3N0Q3N0cj47XG5cbiAgICBDZmc6IHtcbiAgICAgICAgaG9zdCAgICAgICAgICAgICA6IEhvc3RDc3RyLFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG4gICAgICAgIGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcbiAgICB9XG5cbn0gJiBIb3N0Q3N0cjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cbiAgICBpZiggQ2xhc3MgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgQ2xhc3MgPSBDbGFzcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgSFRNTEVsZW1lbnQ7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cbiAgICBsZXQgY3Vyc29yID0gQ2xhc3M7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdoaWxlIChjdXJzb3IuX19wcm90b19fICE9PSBIVE1MRWxlbWVudClcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjdXJzb3IgPSBjdXJzb3IuX19wcm90b19fO1xuXG4gICAgLy8gZGlyZWN0bHkgaW5oZXJpdCBIVE1MRWxlbWVudFxuICAgIGlmKCAhIGN1cnNvci5uYW1lLnN0YXJ0c1dpdGgoJ0hUTUwnKSAmJiAhIGN1cnNvci5uYW1lLmVuZHNXaXRoKCdFbGVtZW50JykgKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGh0bWx0YWcgPSBjdXJzb3IubmFtZS5zbGljZSg0LCAtNyk7XG5cblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IEhUTUxFbGVtZW50IHwgdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuLypcbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlclxuKi9cblxuLy8gbW92ZWQgaGVyZSBpbnN0ZWFkIG9mIGJ1aWxkIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwcy5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59IiwiaW1wb3J0IHRlbXBsYXRlLCB7IEhUTUwgfSBmcm9tIFwiVjMvdXRpbHMvcGFyc2Vycy90ZW1wbGF0ZVwiO1xuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IGVuY29kZUhUTUwgZnJvbSBcIlYzL3V0aWxzL2VuY29kZVwiO1xuXG5jb25zdCByZWdleCA9IC9cXCRcXHsoLis/KVxcfS9nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvQ29udGVudEdlbmVyYXRvciBleHRlbmRzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIHByZXBhcmVUZW1wbGF0ZShodG1sOiBIVE1MKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xuXG4gICAgICAgIGlmKCB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBodG1sO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2VBbGwoL1xcJFxceyhbXFx3XSspXFx9L2csIChfLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxsaXNzIHZhbHVlPVwiJHtuYW1lfVwiPjwvbGlzcz5gO1xuICAgICAgICAgICAgfSk7Ki9cblxuICAgICAgICAgICAgLy9UT0RPOiAke30gaW4gYXR0clxuICAgICAgICAgICAgICAgIC8vIC0gZGV0ZWN0IHN0YXJ0ICR7ICsgZW5kIH1cbiAgICAgICAgICAgICAgICAvLyAtIHJlZ2lzdGVyIGVsZW0gKyBhdHRyIG5hbWVcbiAgICAgICAgICAgICAgICAvLyAtIHJlcGxhY2UuIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzdXBlci5wcmVwYXJlVGVtcGxhdGUoaHRtbCk7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgZmlsbENvbnRlbnQoc2hhZG93OiBTaGFkb3dSb290KSB7XG4gICAgICAgIFxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG4gICAgICAgIGlmKCB0aGlzLmRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9ICh0aGlzLmRhdGEgYXMgc3RyaW5nKS5yZXBsYWNlKHJlZ2V4LCAoXywgbWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNoYWRvdy5ob3N0LmdldEF0dHJpYnV0ZShtYXRjaCk7XG4gICAgICAgICAgICAgICAgaWYoIHZhbHVlID09PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7IFxuICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGVIVE1MKHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdXBlci5wcmVwYXJlVGVtcGxhdGUoc3RyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyLmZpbGxDb250ZW50KHNoYWRvdyk7XG5cbiAgICAgICAgLypcbiAgICAgICAgLy8gaHRtbCBtYWdpYyB2YWx1ZXMgY291bGQgYmUgb3B0aW1pemVkLi4uXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcbiAgICAgICAgZm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG4gICAgICAgICAgICB2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG4gICAgICAgICovXG4gICAgfVxufSIsImltcG9ydCB7IGlzUmVzc291cmNlUmVhZHksIFJlc3NvdXJjZSwgd2FpdFJlc3NvdXJjZSB9IGZyb20gXCJWMy91dGlscy9yZXNzb3VyY2VcIjtcbmltcG9ydCB7IFNoYWRvd0NmZyB9IGZyb20gXCJWMi90eXBlc1wiO1xuaW1wb3J0IHsgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCJWMi91dGlsc1wiO1xuaW1wb3J0IHRlbXBsYXRlLCB7IEhUTUwgfSBmcm9tIFwiVjMvdXRpbHMvcGFyc2Vycy90ZW1wbGF0ZVwiO1xuaW1wb3J0IHN0eWxlICAgLCB7Q1NTfSAgICBmcm9tIFwiVjMvdXRpbHMvcGFyc2Vycy9zdHlsZVwiO1xuXG50eXBlIFNUWUxFID0gQ1NTIHwgcmVhZG9ubHkgQ1NTW107XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHtcbiAgICBodG1sICAgPzogUmVzc291cmNlPEhUTUw+LFxuICAgIGNzcyAgICA/OiBSZXNzb3VyY2U8U1RZTEU+LFxuICAgIHNoYWRvdyA/OiBTaGFkb3dDZmd8bnVsbFxufVxuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuLy9jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG5cbiAgICAjc2hhZG93ICAgICA6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuXG4gICAgICAgIGNvbnN0IGlzUmVhZHkgPSBpc1Jlc3NvdXJjZVJlYWR5PEhUTUw+IChodG1sKVxuICAgICAgICAgICAgICAgICAgICAgJiYgaXNSZXNzb3VyY2VSZWFkeTxTVFlMRT4oY3NzKVxuICAgICAgICAgICAgICAgICAgICAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgaWYoIGlzUmVhZHkgKVxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlKGh0bWwsIGNzcyk7XG5cbiAgICAgICAgY29uc3Qgd2hlblJlYWR5OiBQcm9taXNlPFtIVE1MfHVuZGVmaW5lZCwgU1RZTEV8dW5kZWZpbmVkLCB1bmtub3duXT4gPSBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB3YWl0UmVzc291cmNlPEhUTUwgfHVuZGVmaW5lZD4oaHRtbCksXG4gICAgICAgICAgICB3YWl0UmVzc291cmNlPFNUWUxFfHVuZGVmaW5lZD4oY3NzKSxcbiAgICAgICAgICAgIHdoZW5ET01Db250ZW50TG9hZGVkKClcbiAgICAgICAgXSk7XG5cbiAgICAgICAgd2hlblJlYWR5LnRoZW4oIChhcmdzKSA9PiB0aGlzLnByZXBhcmUoYXJnc1swXSwgYXJnc1sxXSkgKTtcblxuICAgICAgICB0aGlzLmlzUmVhZHkgICA9IGlzUmVhZHk7XG4gICAgICAgIHRoaXMud2hlblJlYWR5ID0gd2hlblJlYWR5O1xuICAgIH1cblxuICAgIC8qKiByZWFkeSAqKiovXG5cbiAgICByZWFkb25seSB3aGVuUmVhZHk6IFByb21pc2U8dW5rbm93bj47XG4gICAgcmVhZG9ubHkgaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogcHJvY2VzcyByZXNzb3VyY2VzICoqL1xuXG4gICAgcHJvdGVjdGVkIHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gICAgICAgPSBbXTtcbiAgICBwcm90ZWN0ZWQgdGVtcGxhdGUgICA6IERvY3VtZW50RnJhZ21lbnR8bnVsbCA9IG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZShodG1sOiBIVE1MfHVuZGVmaW5lZCwgY3NzOiBTVFlMRXx1bmRlZmluZWQpIHtcbiAgICAgICAgaWYoIGh0bWwgIT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVUZW1wbGF0ZShodG1sKTtcbiAgICAgICAgaWYoIGNzcyAgIT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVTdHlsZSAgIChjc3MpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlVGVtcGxhdGUoaHRtbDogSFRNTCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGUoaHRtbCk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBwcmVwYXJlU3R5bGUoY3NzOiBTVFlMRSkge1xuXG4gICAgICAgIGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG4gICAgICAgICAgICBjc3MgPSBbY3NzXTtcblxuICAgICAgICB0aGlzLnN0eWxlc2hlZXRzID0gY3NzLm1hcChlID0+IHN0eWxlKGUpICk7XG4gICAgfVxuXG4gICAgLyoqKiBHZW5lcmF0ZSBjb250ZW50cyAqKiovXG5cbiAgICBpbml0Q29udGVudCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBtb2RlOlwib3BlblwifFwiY2xvc2VkXCJ8bnVsbCkge1xuXG4gICAgICAgIGxldCBjb250ZW50OiBTaGFkb3dSb290fEhUTUxFbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICBpZiggbW9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGVudCA9IHRhcmdldC5hdHRhY2hTaGFkb3coe21vZGV9KTtcbiAgICAgICAgICAgIGNvbnRlbnQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTLCAuLi50aGlzLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgfVxuICAgICAgICAvL1RPRE86IENTUyBmb3Igbm8gc2hhZG93ID8/P1xuICAgICAgICBcbiAgICAgICAgdGhpcy5maWxsQ29udGVudChjb250ZW50KTtcblxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBmaWxsQ29udGVudCh0YXJnZXQ6IFNoYWRvd1Jvb3R8SFRNTEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICBcbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGUgIT09IG51bGwpXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKCB0aGlzLmNyZWF0ZUNvbnRlbnQoKSApO1xuXG4gICAgICAgIC8vVE9ETy4uLlxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKHRhcmdldCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUhLmNsb25lTm9kZSh0cnVlKTtcbiAgICB9XG59IiwiLy8gZXhhbXBsZSA6IHBsYXlncm91bmQgdjMgKD8pXG4gICAgLy8gbGlzcy12ZXJzaW9uPVwidjNcIlxuICAgIC8vIGxpc3MtdjM9XCJhdXRvXCIgKGMnZXN0IGxhIHYzIHF1J2lsIGZhdXQgdXRpbGlzZXIpXG5cbi8vIFRPRE86IGluIHBsYXlncm91bmQgYnJ5dGhvbiBzcmMgb25seSBpZiBicnl0aG9uXG4vLyBUT0RPOiByZW1vdmUgdjIgKGF1dG9kaXIpICsgdjIgZmN0c1xuXG4vLyBET0NTXG4gICAgLy8gUkVBRE1FLm1kXG5cbi8vIFRPRE86IGF1dG8tbW9kZSAoYWxsIHdpdGggYXV0by4uLilcbiAgICAvLyBUT0RPOiB0cnVlIGF1dG8tbW9kZSBpbiB0ZXN0cyAoY2hhbmdlIEJyeXRob24uLi4pXG4gICAgICAgIC8vIHRlc3R2M1xuICAgICAgICAgICAgLy8gZGVmYXVsdCBIVE1MIGluIHRlc3QgaWYgKG51bGwpLi4uXG4gICAgICAgICAgICAvLyBsaWtlIHBsYXlncm91bmQgKD8pID0+IGRpZmZlcmVudCBmaWxlIGZvciBjbGVhbmVyIGNvZGUgP1xuICAgIC8vIGZpbGVzPVwianMsdHMsYnJ5LGh0bWxcIiAtIGRlZmF1bHQgKGh0bWwrY3NzK2pzKSA/XG5cbi8vIGRvY3MgKCsgZXhhbXBsZXMgcGxheWdyb3VuZC90ZXN0cyAvLyBCcnkvSlMpLlxuICAgIC8vIG5vbi1hdXRvIGZpcnN0LlxuICAgICAgICAvLyBleHRlbmRzIChMSVNTIEJhc2UpXG4gICAgICAgIC8vIExJU1Moe30pIG9wdHMuXG4gICAgICAgIC8vIGRlZmluZS5cbiAgICAgICAgLy8gQVBJLi4uIGZvciBiZXR0ZXIgc3VnZ2VzdGlvbnMuXG4gICAgICAgIC8vIHJ1bGVzLi4uXG5cbi8vIFRPRE86IGNvbnRlbnRHZW5lcmF0b3Jcbi8vIFRPRE86IGRvY3MgKG9mYylcblxuLy8gVE9ETzogdXRpbHMgKyBzaWduYWxzICsgRE9NQ29udGVudExvYWRlZCBiZWZvcmUuLi4gKyB1cGdyYWRlIGNoaWxkcmVuIGluIGNzdHIgP1xuICAgIC8vIGJ1aWxkXG4gICAgLy8gcmVtb3ZlIGV2ZW50cyArIHFzID9cbiAgICAvLyBUT0RPOiBzdGF0ZSAoaW50ZXJuYWwgc3RhdGUpXG4gICAgLy8gVE9ETzogYmxpc3NcbiAgICAvLyBUT0RPOiBzaGFyZWRDU1NcblxuLy8gVE9ETzogdXBncmFkZVxuICAgIC8vIFRPRE86IGdldCB1cGdyYWRlZCA/XG4gICAgLy8gVE9ETzogdXBncmFkZSArKyA+IGRlZmluaXRpb24gb3JkZXIgaWYgaW5zaWRlIGNoaWxkIGFuZCBhdmFpbGFibGUuXG4gICAgLy8gVE9ETzogZGVmaW5lZCA6IHZpc2liaWxpdHk6IGhpZGRlbiB1bnRpbCBkZWZpbmVkID9cbiAgICAgICAgLy8gVE9ETzogbG9hZGVyIGN1c3RvbUVsZW1lbnQgKHJlcGxhY2VXaXRoID8pXG5cblxuLy8gVE9ETzogcGxheWdyb3VuZFxuICAgIC8vIFRPRE86IGZhY3VsdGF0aXZlIEhUTUwgaW4gZWRpdG9yL3BsYXlncm91bmRcbiAgICAvLyBUT0RPOiBzaG93IGVycm9yLi4uXG4gICAgLy8gVE9ETzogZGVib3VuY2UvdGhyb3R0bGUgZWRpdG9yLi4uXG5cbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgTElTU0Z1bGwgZnJvbSBcIi4vTElTUy9MSVNTRnVsbFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5pdGlhbFZhbHVlPEUgZXh0ZW5kcyBIVE1MRWxlbWVudCwgTiBleHRlbmRzIGtleW9mIEU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGU6IEUsIG5hbWU6IE4pOiB1bmRlZmluZWR8RVtOXVxuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxWYWx1ZTxFIGV4dGVuZHMgSFRNTEVsZW1lbnQsIE4gZXh0ZW5kcyBrZXlvZiBFLCBEPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlOiBFLCBuYW1lOiBOLCBkZWZhdWx0VmFsdWU6IEQpIDogRHxFW05dXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5pdGlhbFZhbHVlPEUgZXh0ZW5kcyBIVE1MRWxlbWVudCwgTiBleHRlbmRzIGtleW9mIEUsIEQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGU6IEUsIG5hbWU6IE4sIGRlZmF1bHRWYWx1ZT86IEQpOiB1bmRlZmluZWR8RHxFW05dIHtcblxuICAgIGlmKCAhIE9iamVjdC5oYXNPd24oZSwgbmFtZSkgKVxuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgY29uc3QgIF8gPSBlW25hbWVdO1xuICAgIGRlbGV0ZSAgICAgZVtuYW1lXTtcbiAgICByZXR1cm4gXztcbn1cblxudHlwZSBDc3RyPFQ+ID0gbmV3KC4uLmFyZ3M6YW55W10pID0+IFRcbnR5cGUgTElTU3YzX09wdHM8VCBleHRlbmRzIENzdHI8Q29udGVudEdlbmVyYXRvcj4gPiA9IHtcbiAgICBjb250ZW50X2dlbmVyYXRvcjogVCxcbn0gJiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD5bMF07XG5cbi8vICBidWlsZGVyXG5leHBvcnQgZnVuY3Rpb24gTElTU3YzPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID0gQ3N0cjxDb250ZW50R2VuZXJhdG9yPj4ob3B0czogUGFydGlhbDxMSVNTdjNfT3B0czxUPj4gPSB7fSkge1xuICAgIFxuICAgIGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gb3B0cy5jb250ZW50X2dlbmVyYXRvciA/PyBDb250ZW50R2VuZXJhdG9yO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBnZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3IgPSBuZXcgY29udGVudF9nZW5lcmF0b3Iob3B0cyk7XG4gICAgXG4gICAgcmV0dXJuIGNsYXNzIF9MSVNTIGV4dGVuZHMgTElTU0Z1bGwge1xuXG4gICAgICAgIC8vIFRPRE86IG5vIGNvbnRlbnQgaWYuLi4gPz8/XG4gICAgICAgIC8vIG92ZXJyaWRlIGF0dGFjaFNoYWRvdyAgPz8/XG4gICAgICAgIHN0YXRpYyBvdmVycmlkZSByZWFkb25seSBTSEFET1dfTU9ERSAgICAgICA9IFwib3BlblwiO1xuICAgICAgICBzdGF0aWMgb3ZlcnJpZGUgcmVhZG9ubHkgQ09OVEVOVF9HRU5FUkFUT1IgPSBnZW5lcmF0b3I7XG5cbiAgICB9XG59XG5cbi8vIHVzZWQgZm9yIHBsdWdpbnMuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cbmV4cG9ydCBkZWZhdWx0IExJU1N2MyBhcyB0eXBlb2YgTElTU3YzICYgSUxJU1M7IiwiaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIlYzL0NvbnRlbnRHZW5lcmF0b3JzL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cblxuICAgIC8qcHJvdGVjdGVkIGdldEluaXRpYWxWYWx1ZTxOIGV4dGVuZHMga2V5b2YgdGhpcz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZTogTik6IHVuZGVmaW5lZHx0aGlzW05dXG4gICAgcHJvdGVjdGVkIGdldEluaXRpYWxWYWx1ZTxOIGV4dGVuZHMga2V5b2YgdGhpcywgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZTogTiwgZGVmYXVsdFZhbHVlOiBEKSA6IER8dGhpc1tOXVxuICAgIHByb3RlY3RlZCBnZXRJbml0aWFsVmFsdWU8TiBleHRlbmRzIGtleW9mIHRoaXMsIEQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWU6IE4sIGRlZmF1bHRWYWx1ZT86IEQpOiB1bmRlZmluZWR8RHx0aGlzW05dIHtcbiAgICAgICAgcmV0dXJuIGdldEluaXRpYWxWYWx1ZSh0aGlzLCBuYW1lLCBkZWZhdWx0VmFsdWUpO1xuICAgIH0qL1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IFNIQURPV19NT0RFICAgICAgOiBcIm9wZW5cInxcImNsb3NlZFwifG51bGwgPSBudWxsO1xuICAgIC8vIFRPRE86IHN0YXRpYyBjYWNoZSBnZXR0ZXIgKyB1c2Ugc3RhdGljIEhUTUwvQ1NTLlxuICAgIHN0YXRpYyByZWFkb25seSBDT05URU5UX0dFTkVSQVRPUjogQ29udGVudEdlbmVyYXRvcnxudWxsID0gbnVsbDtcblxuICAgIHJlYWRvbmx5IGNvbnRlbnQgIDogU2hhZG93Um9vdHxIVE1MRWxlbWVudCAgICAgICAgPSB0aGlzO1xuICAgIHJlYWRvbmx5IGhvc3QgICAgIDogSFRNTEVsZW1lbnQgICAgICAgICAgICAgICAgICAgPSB0aGlzO1xuICAgIHJlYWRvbmx5IGNvbnRyb2xlcjogT21pdDx0aGlzLCBrZXlvZiBIVE1MRWxlbWVudD4gPSB0aGlzO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3Qga2xhc3MgPSB0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBMSVNTQmFzZTtcblxuICAgICAgICBpZigga2xhc3MuQ09OVEVOVF9HRU5FUkFUT1IgIT09IG51bGwgKVxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0ga2xhc3MuQ09OVEVOVF9HRU5FUkFUT1IuaW5pdENvbnRlbnQodGhpcywga2xhc3MuU0hBRE9XX01PREUpO1xuICAgIH1cblxuXG4gICAgLy8gZGVmaW5lIGZvciBhdXRvLWNvbXBsZXRlLlxuICAgIHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW107XG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkdmFsOiBzdHJpbmd8bnVsbCwgbmV3dmFsOiBzdHJpbmd8bnVsbCl7fVxufSIsImV4cG9ydCB7ZGVmYXVsdCBhcyBkZWZhdWx0fSBmcm9tIFwiLi9MSVNTQmFzZVwiOyIsImltcG9ydCB7IEtub3duVGFncyB9IGZyb20gXCJWMi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5pbXBvcnQgZGVmaW5lIGZyb20gXCJWMy9kZWZpbmUvZGVmaW5lXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiVjNcIjtcbmltcG9ydCBBdXRvQ29udGVudEdlbmVyYXRvciBmcm9tIFwiVjMvQ29udGVudEdlbmVyYXRvcnMvQXV0b0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCBpc1BhZ2VMb2FkZWQgZnJvbSBcIlYzL3V0aWxzL0RPTS9pc1BhZ2VMb2FkZWRcIjtcbmltcG9ydCB3aGVuUGFnZUxvYWRlZCBmcm9tIFwiVjMvdXRpbHMvRE9NL3doZW5QYWdlTG9hZGVkXCI7XG5cbmNvbnN0IHNjcmlwdCA9ICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pignc2NyaXB0OmlzKFtsaXNzLWF1dG9dLFtsaXNzLWNkaXJdLFtsaXNzLXN3XSknKTtcblxuZXhwb3J0IGNvbnN0IExJU1NfTU9ERSAgICA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdsaXNzLW1vZGUnKSA/PyBudWxsO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ0RJUiA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdsaXNzLWNkaXInKSA/PyBudWxsO1xuXG4vLyBUT0RPOiBkZWZhdWx0ID9cbmNvbnN0IFNXX1BBVEggICAgICAgICAgICAgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnbGlzcy1zdycpID8/IG51bGw7XG5cbmlmKExJU1NfTU9ERSA9PT0gXCJhdXRvLWxvYWRcIiAmJiBERUZBVUxUX0NESVIgIT09IG51bGwpIHtcbiAgICBpZiggISBpc1BhZ2VMb2FkZWQoKSApXG4gICAgICAgIGF3YWl0IHdoZW5QYWdlTG9hZGVkKCk7XG4gICAgYXV0b2xvYWQoREVGQVVMVF9DRElSKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYXV0b2xvYWQoY2Rpcjogc3RyaW5nKSB7XG5cbiAgICBjb25zdCBTVzogUHJvbWlzZTx2b2lkPiA9IG5ldyBQcm9taXNlKCBhc3luYyAocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgIGlmKCBTV19QQVRIID09PSBudWxsICkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKFNXX1BBVEgsIHtzY29wZTogXCIvXCJ9KTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZWdpc3RyYXRpb24gb2YgU2VydmljZVdvcmtlciBmYWlsZWRcIik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmKCBjZGlyW2NkaXIubGVuZ3RoLTFdICE9PSAnLycpXG4gICAgICAgIGNkaXIgKz0gJy8nO1xuXG4gICAgLy9jb25zdCBicnl0aG9uID0gc2NyaXB0LmdldEF0dHJpYnV0ZShcImJyeXRob25cIik7XG5cbiAgICAvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cbiAgICBuZXcgTXV0YXRpb25PYnNlcnZlciggKG11dGF0aW9ucykgPT4ge1xuICAgICAgICBmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcbiAgICAgICAgICAgIGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2RlcylcbiAgICAgICAgICAgICAgICBpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxVbmtub3duRWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgYWRkVGFnKGFkZGl0aW9uKVxuXG4gICAgfSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuICAgIGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqOm5vdCg6ZGVmaW5lZClcIikgKVxuICAgICAgICBhZGRUYWcoIGVsZW0gKTtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cbiAgICAgICAgYXdhaXQgU1c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cbiAgICAgICAgY29uc3QgdGFnbmFtZSA9IHRhZy50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgaWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbG9hZENvbXBvbmVudCh0YWduYW1lLCB7XG4gICAgICAgICAgICAvL2JyeXRob24sXG4gICAgICAgICAgICBjZGlyXG4gICAgICAgIH0pO1x0XHRcbiAgICB9XG59XG5cbi8qKioqKi9cblxudHlwZSBpbXBvcnRDb21wb25lbnRzX09wdHMgPSB7XG5cdGNkaXIgICA/OiBzdHJpbmd8bnVsbFxufTtcblxudHlwZSBDc3RyPFQ+ID0gKC4uLmFyZ3M6IGFueVtdKSA9PiBUO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdHRhZ25hbWU6IHN0cmluZyxcblx0e1xuXHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0Ly8gYnJ5dGhvbiA9IG51bGxcblx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzID0ge31cbik6IFByb21pc2U8Q3N0cjxUPj4ge1xuXG5cdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RhZ25hbWV9L2A7XG5cblx0Y29uc3QgZmlsZXM6IFJlY29yZDxzdHJpbmcsc3RyaW5nfHVuZGVmaW5lZD4gPSB7fTtcblxuXHQvLyBzdHJhdHMgOiBKUyAtPiBCcnkgLT4gSFRNTCtDU1MgKGNmIHNjcmlwdCBhdHRyKS5cblxuICAgIGZpbGVzW1wianNcIl0gPSBhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5qc2AsIHRydWUpO1xuXG4gICAgaWYoIGZpbGVzW1wianNcIl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyB0cnkvY2F0Y2ggP1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtcbiAgICAgICAgICAgIF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4Lmh0bWxgLCB0cnVlKSEsXG4gICAgICAgICAgICBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5jc3NgICwgdHJ1ZSkhXG4gICAgICAgIF07XG4gICAgICAgIFtmaWxlc1tcImh0bWxcIl0sIGZpbGVzW1wiY3NzXCIgXV0gPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlKGNvZGU6IHN0cmluZywgdHlwZTogXCJqc1wiKSB7XG5cbiAgICBsZXQgcmVzdWx0O1xuXG4gICAgaWYoIHR5cGUgPT09IFwianNcIiApIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IG5ldyBCbG9iKFtjb2RlXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG4gICAgICAgIGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG4gICAgICAgIHJlc3VsdCA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKTtcbiAgICAgICAgXG4gICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vL1RPRE86IHJlbmFtZSBmcm9tIGZpbGVzID9cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgXG4gICAgbGV0IGtsYXNzO1xuICAgIGlmKCBcImpzXCIgaW4gZmlsZXMgKSB7XG4gICAgICAgIGtsYXNzID0gKGF3YWl0IGV4ZWN1dGUoZmlsZXNbXCJqc1wiXSwgXCJqc1wiKSkuZGVmYXVsdDtcbiAgICB9XG5cbiAgICBpZigga2xhc3MgPT09IHVuZGVmaW5lZCApXG4gICAgICAgIGtsYXNzID0gTElTUyh7XG4gICAgICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQXV0b0NvbnRlbnRHZW5lcmF0b3IsXG4gICAgICAgICAgICAuLi5maWxlc1xuICAgICAgICB9KTtcblxuICAgIGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cbiAgICByZXR1cm4ga2xhc3M7XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICB2YXIgTElTU0NvbnRleHQ6IHtcbiAgICAgICAgZmV0Y2g/OiB7XG4gICAgICAgICAgICBjd2QgIDogc3RyaW5nLFxuICAgICAgICAgICAgZmlsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gaW4gYXV0by1tb2RlIHVzZSBTZXJ2aWNlV29ya2VyIHRvIGhpZGUgNDA0IGVycm9yIG1lc3NhZ2VzLlxuLy8gaWYgcGxheWdyb3VuZCBmaWxlcywgdXNlIHRoZW0uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2ZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGhpZGU0MDQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuXG4gICAgY29uc3QgZmV0Y2hDb250ZXh0ID0gZ2xvYmFsVGhpcy5MSVNTQ29udGV4dC5mZXRjaDtcbiAgICBpZiggZmV0Y2hDb250ZXh0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBuZXcgVVJMKHVyaSwgZmV0Y2hDb250ZXh0LmN3ZCApO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGZldGNoQ29udGV4dC5maWxlc1twYXRoLnRvU3RyaW5nKCldO1xuICAgICAgICBpZiggdmFsdWUgPT09IFwiXCIgKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgaWYoIHZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IGhpZGU0MDRcbiAgICAgICAgICAgICAgICAgICAgICAgID8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDoge307XG5cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcbiAgICBpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBpZiggaGlkZTQwNCAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG4gICAgaWYoYW5zd2VyID09PSBcIlwiKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGFuc3dlclxufVxuXG4vLyBAdHMtaWdub3JlXG5nbG9iYWxUaGlzLnJlcXVpcmUgPSBhc3luYyBmdW5jdGlvbih1cmw6IHN0cmluZykge1xuICAgIC8vVE9ETzogbm9uIHBsYXlncm91bmQuLi5cbiAgICByZXR1cm4gYXdhaXQgX2ZldGNoVGV4dCh1cmwpO1xufSIsImltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBfd2hlbkRlZmluZWRQcm9taXNlcyB9IGZyb20gXCIuL3doZW5EZWZpbmVkXCI7XG5cbmNvbnN0IFdhaXRpbmdEZWZpbmUgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZGVmaW5lKHRhZ25hbWU6IHN0cmluZywgS2xhc3M6IG5ldyguLi5hcmdzOmFueVtdKSA9PiBIVE1MRWxlbWVudCkge1xuXG4gICAgLy9UT0RPOiBQeXRob24gY2xhc3MuLi5cblxuICAgIC8vVE9ETzogdHlwZSBzYWZlXG4gICAgaWYoIFwiQ09OVEVOVF9HRU5FUkFUT1JcIiBpbiBLbGFzcyApIHtcbiAgICAgICAgY29uc3QgZ2VuZXJhdG9yID0gS2xhc3MuQ09OVEVOVF9HRU5FUkFUT1IgYXMgQ29udGVudEdlbmVyYXRvcjtcblxuICAgICAgICBpZiggISBnZW5lcmF0b3IuaXNSZWFkeSApIHtcbiAgICAgICAgICAgIFdhaXRpbmdEZWZpbmUuYWRkKHRhZ25hbWUpO1xuICAgICAgICAgICAgYXdhaXQgZ2VuZXJhdG9yLndoZW5SZWFkeTtcbiAgICAgICAgICAgIFdhaXRpbmdEZWZpbmUuZGVsZXRlKHRhZ25hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIEtsYXNzKTtcblxuICAgIGNvbnN0IHAgPSBfd2hlbkRlZmluZWRQcm9taXNlcy5nZXQoS2xhc3MpO1xuICAgIGlmKCBwICE9PSB1bmRlZmluZWQgKVxuICAgICAgICBwLnJlc29sdmUoKTtcbn1cblxuaW1wb3J0IExJU1MgZnJvbSBcIlYzL0xJU1NcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCJWMy9MSVNTXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZTogdHlwZW9mIGRlZmluZTtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lID0gZGVmaW5lOyIsImltcG9ydCBkZWZpbmUgICAgICBmcm9tIFwiLi9kZWZpbmVcIjtcbmltcG9ydCBpc0RlZmluZWQgICBmcm9tIFwiLi9pc0RlZmluZWRcIjtcbmltcG9ydCB3aGVuRGVmaW5lZCBmcm9tIFwiLi93aGVuRGVmaW5lZFwiO1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiVjMvTElTU1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIlYzL0xJU1NcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgIDogdHlwZW9mIGRlZmluZTtcbiAgICAgICAgaXNEZWZpbmVkOiB0eXBlb2YgaXNEZWZpbmVkO1xuICAgICAgICB3aGVuRGVmaW5lZCAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgICAgICA9IGRlZmluZTtcbkxJU1MuaXNEZWZpbmVkICAgPSBpc0RlZmluZWQ7XG5MSVNTLndoZW5EZWZpbmVkID0gd2hlbkRlZmluZWQ7XG5cbmV4cG9ydCB7ZGVmaW5lLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkfTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0RlZmluZWQoZWxlbTogc3RyaW5nfChuZXcoLi4uYXJnczphbnlbXSk9PkhUTUxFbGVtZW50KSk6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSkgIT09IG51bGw7XG59IiwidHlwZSBDc3RyPFQ+ID0gbmV3KC4uLmFyZ3M6YW55W10pPT4gVDtcblxuZXhwb3J0IGNvbnN0IF93aGVuRGVmaW5lZFByb21pc2VzID0gbmV3IFdlYWtNYXA8Q3N0cjxIVE1MRWxlbWVudD4sIFByb21pc2VXaXRoUmVzb2x2ZXJzPHZvaWQ+PigpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KGVsZW06IHN0cmluZ3xDc3RyPFQ+KTogUHJvbWlzZTxDc3RyPFQ+PiB7XG4gICAgXG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoZWxlbSkgYXMgQ3N0cjxUPjtcblxuICAgIGlmKCBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0pICE9PSBudWxsKVxuICAgICAgICByZXR1cm4gZWxlbSBhcyBDc3RyPFQ+O1xuXG4gICAgbGV0IHAgPSBfd2hlbkRlZmluZWRQcm9taXNlcy5nZXQoZWxlbSk7XG4gICAgaWYoIHAgPT09IHVuZGVmaW5lZCApe1xuICAgICAgICBwID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgICAgIF93aGVuRGVmaW5lZFByb21pc2VzLnNldChlbGVtLCBwKTtcbiAgICB9XG5cbiAgICBhd2FpdCBwLnByb21pc2U7XG4gICAgcmV0dXJuIGVsZW07XG59IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vTElTU1wiO1xuXG4vLyBIRVJFLi4uXG5cbmltcG9ydCBcIi4vZGVmaW5lXCI7XG5pbXBvcnQgXCIuL3V0aWxzL3BhcnNlcnNcIjtcblxuaW1wb3J0IFwiLi9kZWZpbmUvYXV0b2xvYWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgTElTUzsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1BhZ2VMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIlxufVxuXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn0qLyIsImltcG9ydCBpc1BhZ2VMb2FkZWQgZnJvbSBcIi4vaXNQYWdlTG9hZGVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdoZW5ET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc1BhZ2VMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlc29sdmUgYXMgYW55LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8qXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufSovIiwiY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn0iLCJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuY29uc3QgZGYgPSB0ZW1wbGF0ZS5jb250ZW50O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oLi4ucmF3OiBUZW1wbGF0ZTxzdHJpbmc+KTogVCB7XG4gICAgXG4gICAgbGV0IGVsZW0gPSByYXdbMF07XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShlbGVtKSApIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0ciA9IHJhd1swXSBhcyBUZW1wbGF0ZVN0cmluZ3NBcnJheTtcblxuICAgICAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgcmF3Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gcmF3W2ldO1xuICAgICAgICAgICAgc3RyaW5nICs9IHN0cltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW0gPSBzdHJpbmc7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gZWxlbTtcblxuICAgIGlmKCBkZi5jaGlsZE5vZGVzLmxlbmd0aCAhPT0gMSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3JcIik7XG5cbiAgICByZXR1cm4gZGYuZmlyc3RDaGlsZCBhcyBUO1xufSIsImltcG9ydCBMSVNTIGZyb20gXCJWMy9MSVNTXCI7XG5cbmltcG9ydCBodG1sICAgICBmcm9tIFwiLi9odG1sXCJcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tIFwiLi90ZW1wbGF0ZVwiO1xuaW1wb3J0IHN0eWxlICAgIGZyb20gXCIuL3N0eWxlXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiVjMvTElTU1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBodG1sICAgIDogdHlwZW9mIGh0bWw7XG4gICAgICAgIHRlbXBsYXRlOiB0eXBlb2YgdGVtcGxhdGU7XG4gICAgICAgIHN0eWxlICAgOiB0eXBlb2Ygc3R5bGU7XG4gICAgfVxufVxuXG5MSVNTLnN0eWxlICAgID0gc3R5bGU7XG5MSVNTLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5MSVNTLmh0bWwgICAgID0gaHRtbDtcblxuZXhwb3J0IHtzdHlsZSwgdGVtcGxhdGUsIGh0bWx9OyIsImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgQ1NTICAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHlsZSguLi5yYXc6IFRlbXBsYXRlPENTUz4pOiBDU1NTdHlsZVNoZWV0IHtcblxuICAgIGxldCBlbGVtID0gcmF3WzBdO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0IClcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuICAgICAgICByZXR1cm4gZWxlbS5zaGVldCE7XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShlbGVtKSApIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0ciA9IHJhd1swXSBhcyBUZW1wbGF0ZVN0cmluZ3NBcnJheTtcblxuICAgICAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgcmF3Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gcmF3W2ldO1xuICAgICAgICAgICAgc3RyaW5nICs9IHN0cltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW0gPSBzdHJpbmc7XG4gICAgfVxuXG4gICAgaWYoIHR5cGVvZiBlbGVtICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlbGVtKTtcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3Vyc1wiKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgc3R5bGUucmVwbGFjZVN5bmMoZWxlbSk7XG4gICAgcmV0dXJuIHN0eWxlO1xufSIsImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgSFRNTCAgPSBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUoIC4uLnJhdzpUZW1wbGF0ZTxIVE1MPik6IERvY3VtZW50RnJhZ21lbnQge1xuXG4gICAgbGV0IGVsZW0gPSByYXdbMF07XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShlbGVtKSApIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0ciA9IHJhd1swXSBhcyBUZW1wbGF0ZVN0cmluZ3NBcnJheTtcblxuICAgICAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgcmF3Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gcmF3W2ldO1xuICAgICAgICAgICAgc3RyaW5nICs9IHN0cltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW0gPSBzdHJpbmc7XG4gICAgfVxuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgICAgcmV0dXJuIGVsZW0uY2xvbmVOb2RlKHRydWUpIGFzIERvY3VtZW50RnJhZ21lbnQ7XG5cbiAgICAvLyBtdXN0IHVzZSB0ZW1wbGF0ZSBhcyBEb2N1bWVudEZyYWdtZW50IGRvZXNuJ3QgaGF2ZSAuaW5uZXJIVE1MXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblxuICAgIGlmKHR5cGVvZiBlbGVtID09PSAnc3RyaW5nJylcbiAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gZWxlbS50cmltKCk7XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgICAvLyBwcmV2ZW50cyBpc3N1ZSBpZiBlbGVtIGlzIGxhdHRlciB1cGRhdGVkLlxuICAgICAgICAgICAgZWxlbSA9IGVsZW0uY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBcbiAgICAgICAgdGVtcGxhdGUuYXBwZW5kKCBlbGVtICk7XG4gICAgfVxuXG4gICAgLy9pZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAvLyAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuICAgIFxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ITtcbn0iLCJleHBvcnQgdHlwZSBSZXNzb3VyY2U8VD4gPVxuICAgICAgVFxuICAgIHwgUHJvbWlzZTxUPlxuICAgIHwgKFQgZXh0ZW5kcyBzdHJpbmcgICAgICAgICA/IFByb21pc2U8UmVzcG9uc2U+IHwgUmVzcG9uc2UgOiBuZXZlcilcbiAgICB8IChUIGV4dGVuZHMgQXJyYXk8aW5mZXIgRT4gPyBSZXNzb3VyY2U8RT5bXSAgICAgICAgICAgICAgIDogbmV2ZXIpO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXNzb3VyY2VSZWFkeTxUPihyZXM6IFJlc3NvdXJjZTxUPnx1bmRlZmluZWQpOiByZXMgaXMgVHx1bmRlZmluZWQge1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkocmVzKSApXG4gICAgICAgIHJldHVybiByZXMuZXZlcnkoIGUgPT4gaXNSZXNzb3VyY2VSZWFkeShyZXNbZV0pICk7XG5cbiAgICByZXR1cm4gcmVzID09PSB1bmRlZmluZWQgfHwgIShyZXMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHJlcyBpbnN0YW5jZW9mIFJlc3BvbnNlKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRSZXNzb3VyY2U8VD4ocmVzOiBSZXNzb3VyY2U8VD4pOiBQcm9taXNlPFQ+IHtcblxuICAgIGlmKCBBcnJheS5pc0FycmF5KHJlcykgKVxuICAgICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocmVzLm1hcCggZSA9PiB3YWl0UmVzc291cmNlKGUpKSkgYXMgVDtcblxuICAgIGlmKCByZXMgaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgICAgICByZXMgPSBhd2FpdCByZXM7XG5cbiAgICBpZiggcmVzIGluc3RhbmNlb2YgUmVzcG9uc2UpXG4gICAgICAgIHJlcyA9IGF3YWl0IHJlcy50ZXh0KCkgYXMgVDtcblxuICAgIHJldHVybiByZXMgYXMgVDtcbn0iLCJleHBvcnQge2RlZmF1bHQgYXMgVjJ9IGZyb20gXCJWMlwiO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFYzfSBmcm9tIFwiVjNcIjtcblxuaW1wb3J0IExJU1MgZnJvbSBcIlYzXCI7XG5leHBvcnQgZGVmYXVsdCBMSVNTO1xuXG4vLyBAdHMtaWdub3JlXG5nbG9iYWxUaGlzLkxJU1MgPSBMSVNTOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJ2YXIgd2VicGFja1F1ZXVlcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgcXVldWVzXCIpIDogXCJfX3dlYnBhY2tfcXVldWVzX19cIjtcbnZhciB3ZWJwYWNrRXhwb3J0cyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXhwb3J0c1wiKSA6IFwiX193ZWJwYWNrX2V4cG9ydHNfX1wiO1xudmFyIHdlYnBhY2tFcnJvciA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXJyb3JcIikgOiBcIl9fd2VicGFja19lcnJvcl9fXCI7XG52YXIgcmVzb2x2ZVF1ZXVlID0gKHF1ZXVlKSA9PiB7XG5cdGlmKHF1ZXVlICYmIHF1ZXVlLmQgPCAxKSB7XG5cdFx0cXVldWUuZCA9IDE7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0pKTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSA/IGZuLnIrKyA6IGZuKCkpKTtcblx0fVxufVxudmFyIHdyYXBEZXBzID0gKGRlcHMpID0+IChkZXBzLm1hcCgoZGVwKSA9PiB7XG5cdGlmKGRlcCAhPT0gbnVsbCAmJiB0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYoZGVwW3dlYnBhY2tRdWV1ZXNdKSByZXR1cm4gZGVwO1xuXHRcdGlmKGRlcC50aGVuKSB7XG5cdFx0XHR2YXIgcXVldWUgPSBbXTtcblx0XHRcdHF1ZXVlLmQgPSAwO1xuXHRcdFx0ZGVwLnRoZW4oKHIpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFeHBvcnRzXSA9IHI7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9LCAoZSkgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0Vycm9yXSA9IGU7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBvYmogPSB7fTtcblx0XHRcdG9ialt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKGZuKHF1ZXVlKSk7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fVxuXHR2YXIgcmV0ID0ge307XG5cdHJldFt3ZWJwYWNrUXVldWVzXSA9IHggPT4ge307XG5cdHJldFt3ZWJwYWNrRXhwb3J0c10gPSBkZXA7XG5cdHJldHVybiByZXQ7XG59KSk7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmEgPSAobW9kdWxlLCBib2R5LCBoYXNBd2FpdCkgPT4ge1xuXHR2YXIgcXVldWU7XG5cdGhhc0F3YWl0ICYmICgocXVldWUgPSBbXSkuZCA9IC0xKTtcblx0dmFyIGRlcFF1ZXVlcyA9IG5ldyBTZXQoKTtcblx0dmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cztcblx0dmFyIGN1cnJlbnREZXBzO1xuXHR2YXIgb3V0ZXJSZXNvbHZlO1xuXHR2YXIgcmVqZWN0O1xuXHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcblx0XHRyZWplY3QgPSByZWo7XG5cdFx0b3V0ZXJSZXNvbHZlID0gcmVzb2x2ZTtcblx0fSk7XG5cdHByb21pc2Vbd2VicGFja0V4cG9ydHNdID0gZXhwb3J0cztcblx0cHJvbWlzZVt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKHF1ZXVlICYmIGZuKHF1ZXVlKSwgZGVwUXVldWVzLmZvckVhY2goZm4pLCBwcm9taXNlW1wiY2F0Y2hcIl0oeCA9PiB7fSkpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IHByb21pc2U7XG5cdGJvZHkoKGRlcHMpID0+IHtcblx0XHRjdXJyZW50RGVwcyA9IHdyYXBEZXBzKGRlcHMpO1xuXHRcdHZhciBmbjtcblx0XHR2YXIgZ2V0UmVzdWx0ID0gKCkgPT4gKGN1cnJlbnREZXBzLm1hcCgoZCkgPT4ge1xuXHRcdFx0aWYoZFt3ZWJwYWNrRXJyb3JdKSB0aHJvdyBkW3dlYnBhY2tFcnJvcl07XG5cdFx0XHRyZXR1cm4gZFt3ZWJwYWNrRXhwb3J0c107XG5cdFx0fSkpXG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0Zm4gPSAoKSA9PiAocmVzb2x2ZShnZXRSZXN1bHQpKTtcblx0XHRcdGZuLnIgPSAwO1xuXHRcdFx0dmFyIGZuUXVldWUgPSAocSkgPT4gKHEgIT09IHF1ZXVlICYmICFkZXBRdWV1ZXMuaGFzKHEpICYmIChkZXBRdWV1ZXMuYWRkKHEpLCBxICYmICFxLmQgJiYgKGZuLnIrKywgcS5wdXNoKGZuKSkpKTtcblx0XHRcdGN1cnJlbnREZXBzLm1hcCgoZGVwKSA9PiAoZGVwW3dlYnBhY2tRdWV1ZXNdKGZuUXVldWUpKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZuLnIgPyBwcm9taXNlIDogZ2V0UmVzdWx0KCk7XG5cdH0sIChlcnIpID0+ICgoZXJyID8gcmVqZWN0KHByb21pc2Vbd2VicGFja0Vycm9yXSA9IGVycikgOiBvdXRlclJlc29sdmUoZXhwb3J0cykpLCByZXNvbHZlUXVldWUocXVldWUpKSk7XG5cdHF1ZXVlICYmIHF1ZXVlLmQgPCAwICYmIChxdWV1ZS5kID0gMCk7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOlsiZ2V0U2hhcmVkQ1NTIiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzRE9NQ29udGVudExvYWRlZCIsImlzU2hhZG93U3VwcG9ydGVkIiwid2hlbkRPTUNvbnRlbnRMb2FkZWQiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJzaGFyZWRDU1MiLCJDb250ZW50R2VuZXJhdG9yIiwiZGF0YSIsImNvbnN0cnVjdG9yIiwiaHRtbCIsImNzcyIsInNoYWRvdyIsInByZXBhcmVIVE1MIiwicHJlcGFyZUNTUyIsInNldFRlbXBsYXRlIiwidGVtcGxhdGUiLCJpc1JlYWR5Iiwid2hlblJlYWR5IiwiZmlsbENvbnRlbnQiLCJpbmplY3RDU1MiLCJhcHBlbmQiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwiZ2VuZXJhdGUiLCJob3N0IiwidGFyZ2V0IiwiaW5pdFNoYWRvdyIsInNoYWRvd01vZGUiLCJOT05FIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsInJlcGxhY2VDaGlsZHJlbiIsImNhbkhhdmVTaGFkb3ciLCJFcnJvciIsIm1vZGUiLCJPUEVOIiwiYXR0YWNoU2hhZG93IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZSIsInByb2Nlc3NDU1MiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInVuZGVmaW5lZCIsInN0ciIsInRyaW0iLCJpbm5lckhUTUwiLCJIVE1MRWxlbWVudCIsInN0eWxlc2hlZXRzIiwiU2hhZG93Um9vdCIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsInB1c2giLCJjc3NzZWxlY3RvciIsIkNTU1NlbGVjdG9yIiwiaGFzIiwic2V0QXR0cmlidXRlIiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJyZXBsYWNlIiwiaGVhZCIsImFkZCIsImJ1aWxkTElTU0hvc3QiLCJzZXRDc3RyQ29udHJvbGVyIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJMSVNTIiwiYXJncyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsImNvbnRlbnRfZ2VuZXJhdG9yIiwiTElTU0NvbnRyb2xlciIsIkhvc3QiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJuYW1lIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImNvbm5lY3RlZENhbGxiYWNrIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJpc0Nvbm5lY3RlZCIsIl9Ib3N0IiwiaWQiLCJfX2NzdHJfY29udHJvbGVyIiwiTGlzcyIsImhvc3RDc3RyIiwiY29udGVudF9nZW5lcmF0b3JfY3N0ciIsIkxJU1NIb3N0IiwiQ2ZnIiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiQ29udHJvbGVyIiwiY29udHJvbGVyIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJwYXJhbXMiLCJpbml0IiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwidGhlbiIsInByb21pc2UiLCJyZXNvbHZlIiwiUHJvbWlzZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsImRlZmluZSIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsImJyeV9jbGFzcyIsIl9fYmFzZXNfXyIsImZpbHRlciIsIl9fbmFtZV9fIiwiX2pzX2tsYXNzIiwiJGpzX2Z1bmMiLCJfX0JSWVRIT05fXyIsIiRjYWxsIiwiJGdldGF0dHJfcGVwNjU3IiwiaHRtbHRhZyIsIkNsYXNzIiwib3B0cyIsImdldE5hbWUiLCJlbGVtZW50IiwiRWxlbWVudCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJpc0RlZmluZWQiLCJlbGVtIiwiZ2V0Iiwid2hlbkRlZmluZWQiLCJnZXRIb3N0Q3N0ciIsImdldEhvc3RDc3RyU3luYyIsImlzVXBncmFkZWQiLCJ1cGdyYWRlU3luYyIsIndoZW5VcGdyYWRlZCIsImdldENvbnRyb2xlciIsImdldENvbnRyb2xlclN5bmMiLCJpbml0aWFsaXplU3luYyIsImdldENvbnRyb2xlckNzdHIiLCJnZXRDb250cm9sZXJDc3RyU3luYyIsIl93aGVuVXBncmFkZWQiLCJnZXRIb3N0Iiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImdldEhvc3RTeW5jIiwiU3RhdGVzIiwiX0xJU1MiLCJJTElTUyIsImNmZyIsImFzc2lnbiIsIkV4dGVuZGVkTElTUyIsIktub3duVGFncyIsInNjcmlwdCIsIkRFRkFVTFRfQ0RJUiIsImF1dG9sb2FkIiwiY2RpciIsIlNXIiwic3dfcGF0aCIsImNvbnNvbGUiLCJ3YXJuIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic2NvcGUiLCJlcnJvciIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiYnJ5dGhvbiIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtdXRhdGlvbiIsImFkZGl0aW9uIiwiYWRkZWROb2RlcyIsImFkZFRhZyIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwidGFnIiwiaW1wb3J0Q29tcG9uZW50IiwiZGVmaW5lV2ViQ29tcG9uZW50IiwiZmlsZXMiLCJjX2pzIiwia2xhc3MiLCJmaWxlIiwiQmxvYiIsInR5cGUiLCJ1cmwiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJvbGRyZXEiLCJyZXF1aXJlIiwic3RhcnRzV2l0aCIsImZpbGVuYW1lIiwic2xpY2UiLCJkZWZhdWx0IiwiTElTU0F1dG9fQ29udGVudEdlbmVyYXRvciIsIl9mZXRjaFRleHQiLCJ1cmkiLCJpc0xpc3NBdXRvIiwib3B0aW9ucyIsImhlYWRlcnMiLCJyZXNwb25zZSIsImZldGNoIiwic3RhdHVzIiwiYW5zd2VyIiwidGV4dCIsIl9pbXBvcnQiLCJsb2ciLCJjb252ZXJ0ZXIiLCJlbmNvZGVIVE1MIiwidGV4dENvbnRlbnQiLCJtYXRjaCIsImNzc19hdHRycyIsImdldEF0dHJpYnV0ZU5hbWVzIiwiY3NzX2F0dHIiLCJzZXRQcm9wZXJ0eSIsImltcG9ydENvbXBvbmVudHMiLCJjb21wb25lbnRzIiwicmVzdWx0cyIsImJyeV93cmFwcGVyIiwiY29tcG9fZGlyIiwiY29kZSIsImxpc3MiLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJFdmVudFRhcmdldDIiLCJFdmVudFRhcmdldCIsImNhbGxiYWNrIiwiZGlzcGF0Y2hFdmVudCIsImV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxpc3RlbmVyIiwiQ3VzdG9tRXZlbnQyIiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJXaXRoRXZlbnRzIiwiZXYiLCJfZXZlbnRzIiwiRXZlbnRUYXJnZXRNaXhpbnMiLCJldmVudE1hdGNoZXMiLCJzZWxlY3RvciIsImVsZW1lbnRzIiwiY29tcG9zZWRQYXRoIiwicmV2ZXJzZSIsIm1hdGNoZXMiLCJsaXNzX3NlbGVjdG9yIiwiX2J1aWxkUVMiLCJ0YWduYW1lX29yX3BhcmVudCIsInBhcmVudCIsInFzIiwicmVzdWx0IiwicXNvIiwicXNhIiwiaWR4IiwicHJvbWlzZXMiLCJhbGwiLCJxc2MiLCJyZXMiLCJjbG9zZXN0IiwicXNTeW5jIiwicXNhU3luYyIsInFzY1N5bmMiLCJyb290IiwiZ2V0Um9vdE5vZGUiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiY3Vyc29yIiwiX19wcm90b19fIiwiZW5kc1dpdGgiLCJDQU5fSEFWRV9TSEFET1ciLCJyZWFkeVN0YXRlIiwic3RyaW5nIiwiaSIsImZpcnN0Q2hpbGQiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJyZWdleCIsIkF1dG9Db250ZW50R2VuZXJhdG9yIiwicHJlcGFyZVRlbXBsYXRlIiwidmFsdWUiLCJpc1Jlc3NvdXJjZVJlYWR5Iiwid2FpdFJlc3NvdXJjZSIsInByZXBhcmUiLCJwcmVwYXJlU3R5bGUiLCJpbml0Q29udGVudCIsImNyZWF0ZUNvbnRlbnQiLCJMSVNTRnVsbCIsImdldEluaXRpYWxWYWx1ZSIsImRlZmF1bHRWYWx1ZSIsImhhc093biIsIkxJU1N2MyIsImdlbmVyYXRvciIsIlNIQURPV19NT0RFIiwiQ09OVEVOVF9HRU5FUkFUT1IiLCJMSVNTQmFzZSIsIm9sZHZhbCIsIm5ld3ZhbCIsImlzUGFnZUxvYWRlZCIsIndoZW5QYWdlTG9hZGVkIiwiTElTU19NT0RFIiwiU1dfUEFUSCIsIkhUTUxVbmtub3duRWxlbWVudCIsImxvYWRDb21wb25lbnQiLCJleGVjdXRlIiwicmV2b2tlT2JqZWN0VVJMIiwiaGlkZTQwNCIsImZldGNoQ29udGV4dCIsImdsb2JhbFRoaXMiLCJMSVNTQ29udGV4dCIsInBhdGgiLCJjd2QiLCJ0b1N0cmluZyIsIl93aGVuRGVmaW5lZFByb21pc2VzIiwiV2FpdGluZ0RlZmluZSIsIktsYXNzIiwiZGVsZXRlIiwicCIsIldlYWtNYXAiLCJzZXQiLCJkZiIsInJhdyIsInRyYWNlIiwiZXZlcnkiLCJSZXNwb25zZSIsIlYyIiwiVjMiXSwic291cmNlUm9vdCI6IiJ9