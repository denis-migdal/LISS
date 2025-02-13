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
/* harmony export */   LISSAuto_ContentGenerator: () => (/* binding */ LISSAuto_ContentGenerator)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/V2/extends.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ContentGenerator */ "./src/V2/ContentGenerator.ts");
/* harmony import */ var _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LifeCycle/DEFINED */ "./src/V2/LifeCycle/DEFINED.ts");
/* harmony import */ var V3___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/ */ "./src/V3/index.ts");




const KnownTags = new Set();
let script = document.querySelector('script[autodir]');
if (script === null) script = document.querySelector('script[liss-mode="auto-load"]');
const DEFAULT_CDIR = script?.getAttribute('autodir') ?? script?.getAttribute('liss-cdir') ?? null;
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
    let addTag = addTagV2;
    if (cdir === null) {
        cdir = script.getAttribute('liss-cdir');
        addTag = addTagV3;
    }
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
    async function addTagV2(tag) {
        await SW; // ensure SW is installed.
        const tagname = (tag.getAttribute('is') ?? tag.tagName).toLowerCase();
        let host1 = HTMLElement;
        if (tag.hasAttribute('is')) host1 = tag.constructor;
        if (!tagname.includes('-') || KnownTags.has(tagname)) return;
        importComponent(tagname, {
            brython,
            cdir,
            host: host1
        });
    }
    async function addTagV3(tag) {
        await SW; // ensure SW is installed.
        const tagname = tag.tagName.toLowerCase();
        if (!tagname.includes('-') || KnownTags.has(tagname)) return;
        importComponentV3(tagname, {
            //brython,
            cdir
        });
    }
}
//TODO: rename from files ?
async function defineWebComponentV3(tagname, files) {
    let klass = (0,V3___WEBPACK_IMPORTED_MODULE_3__["default"])({
        content_generator: LISSAuto_ContentGenerator,
        ...files
    });
    // todo bry... 
    //TODO: tagname in v3
    // TODO....
    /*
	const c_js      = files["index.js"];
	let klass: null| ReturnType<typeof LISS> = null;
	if( c_js !== undefined ) {

		const file = new Blob([c_js], { type: 'application/javascript' });
		const url  = URL.createObjectURL(file);

		const oldreq = LISS.require;

		LISS.require = function(url: URL|string) {

			if( typeof url === "string" && url.startsWith('./') ) {
				const filename = url.slice(2);
				if( filename in files)
					return files[filename];
			}

			return oldreq(url);
		}

		klass = (await import(/* webpackIgnore: true */ /* url)).default;

		LISS.require = oldreq;
	}
	else if( opts.html !== undefined ) {

		klass = LISS({
			...opts,
			content_generator: LISSAuto_ContentGenerator
		});
	}

	if(klass === null)
		throw new Error(`Missing files for WebComponent ${tagname}.`);
*/ (0,_LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__.define)(tagname, klass);
    return klass;
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
            const str = this.data.replace(/\$\{(.+?)\}/g, (_, match)=>encodeHTML(host.getAttribute(match) ?? ''));
            super.setTemplate(super.prepareHTML(str));
        }
        super.fillContent(shadow);
    /*
		// html magic values could be optimized...
		const values = content.querySelectorAll('liss[value]');
		for(let value of values)
			value.textContent = host.getAttribute(value.getAttribute('value')!)
		*/ }
    generate(host1) {
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        if (this.data !== null) {
            const str = this.data.replace(/\$\{(.+?)\}/g, (_, match)=>encodeHTML(host1.getAttribute(match) ?? ''));
            super.setTemplate(super.prepareHTML(str));
        }
        const content = super.generate(host1);
        /*
		// html magic values.
		// can be optimized...
		const values = content.querySelectorAll('liss[value]');
		for(let value of values)
			value.textContent = host.getAttribute(value.getAttribute('value')!)
		*/ // css prop.
        const css_attrs = host1.getAttributeNames().filter((e)=>e.startsWith('css-'));
        for (let css_attr of css_attrs)host1.style.setProperty(`--${css_attr.slice('css-'.length)}`, host1.getAttribute(css_attr));
        return content;
    }
}
async function importComponents(components, { cdir = DEFAULT_CDIR, brython = null, // @ts-ignore
host: host1 = HTMLElement }) {
    const results = {};
    for (let tagname of components){
        results[tagname] = await importComponent(tagname, {
            cdir,
            brython,
            host: host1
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
async function importComponentV3(tagname, { cdir = DEFAULT_CDIR } = {}) {
    KnownTags.add(tagname);
    const compo_dir = `${cdir}${tagname}/`;
    const files = {};
    const ext = "html";
    files[ext] = await _fetchText(`${compo_dir}index.${ext}`, true);
    // try/catch ?
    // strats : JS -> Bry -> HTML+CSS.
    return await defineWebComponentV3(tagname, files);
}
async function importComponent(tagname, { cdir = DEFAULT_CDIR, brython = null, // @ts-ignore
host: host1 = HTMLElement, files = null } = {}) {
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
        host: host1
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

// required for auto mode it seems.
// @ts-ignore
globalThis.LISS = _extends__WEBPACK_IMPORTED_MODULE_0__["default"];


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

/***/ "./src/V3/index.ts":
/*!*************************!*\
  !*** ./src/V3/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSv3)
/* harmony export */ });
/* harmony import */ var _V2_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../V2/ContentGenerator */ "./src/V2/ContentGenerator.ts");
/*
 1. override fetch/import/whatever
    -> expliquer le fonctionnement (sinon je vais m'y perdre)
    -> v3 directory ?
        -> sources inside ?
 2. CSS
 3. HTML in fct attr
 4. Fct interne
 5. Conseils
 6. JS... 
 7. pure JS (?)
*/ // example : playground v3 (?)
// liss-version="v3"
// liss-v3="auto" (c'est la v3 qu'il faut utiliser)
// unit test de l'exemple ajouté
// => continue other examples
// TODO: in playground brython src only if brython
// TODO: remove v2 (autodir) + v2 fcts
// DOCS
// doc/fr/auto.md
// Ctrler/LifeCycle
// doc/en (obs ?)
// README.md
// TODO: auto-mode (all with auto...)
// TODO: true auto-mode in tests (change Brython...)
// testv3
// default HTML in test if (null)...
// like playground (?) => different file for cleaner code ?
// files="js,ts,bry,html" - default (html+css+js) ?
// override fetch (ofc) [sw override ?]
// build default js (with ${}) support
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
// TODO: css--[prop_name].
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

// Only extends HTMLElement, else issues :
// not supported by all browsers.
// may not support shadowRoot -> then init can be troublesome.
// be careful when trying to build : createElement call cstr.
// if possible, do not expect content (attr good ? no children ?)
// Wait DOM ContentLoaded, else will lack children (e.g. blocking script)
// Upgrade order is def order => do not depend father/children.
// father should upgrade children ? (as it listen its children) ?
// (can't listen children father)
// upgrade fct
// children can't assume he is in a (compatible) father.
// attach()/detach() // onAttach() / onDetach()
// add ?
// defer/after DOMContentLoaded for querying DOM
// WTF for custom elements???
class LISSBase extends HTMLElement {
    content;
    constructor(generator){
        super();
        this.content = this.attachShadow({
            mode: "open"
        });
        if (generator !== undefined) generator.fillContent(this.content);
    }
    // for better suggestions
    get controler() {
        return this;
    }
    get host() {
        return this;
    }
}
//  builder
function LISSv3(opts = {}) {
    const content_generator = opts.content_generator ?? _V2_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__["default"];
    // @ts-ignore
    const _generator = new content_generator(opts);
    return class _LISS extends LISSBase {
        constructor(generator = _generator){
            super(generator);
        }
    };
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
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _V2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./V2 */ "./src/V2/index.ts");
/* harmony import */ var _V3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./V3 */ "./src/V3/index.ts");


const LISS = {
    v2: _V2__WEBPACK_IMPORTED_MODULE_0__["default"],
    v3: _V3__WEBPACK_IMPORTED_MODULE_1__["default"]
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_V2__WEBPACK_IMPORTED_MODULE_0__["default"]);

})();

var __webpack_exports__LISS = __webpack_exports__.LISS;
var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__LISS as LISS, __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZXJhdG9yLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTElTU0NvbnRyb2xlci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL0RFRklORUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvSU5JVElBTElaRUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvUkVBRFkudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvVVBHUkFERUQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvc3RhdGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvY29yZS9MaWZlQ3ljbGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9leHRlbmRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9MSVNTQXV0by50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvYnVpbGQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL2V2ZW50cy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL3R5cGVzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTaGFyZWRDU1MgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgTEhvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIGlzU2hhZG93U3VwcG9ydGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbnR5cGUgSFRNTCA9IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nO1xudHlwZSBDU1MgID0gc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudDtcblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge1xuICAgIGh0bWwgICA/OiBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZyxcbiAgICBjc3MgICAgPzogQ1NTIHwgcmVhZG9ubHkgQ1NTW10sXG4gICAgc2hhZG93ID86IFNoYWRvd0NmZ3xudWxsXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JDc3RyID0geyBuZXcob3B0czogQ29udGVudEdlbmVyYXRvcl9PcHRzKTogQ29udGVudEdlbmVyYXRvciB9O1xuXG5jb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgICNzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdO1xuICAgICN0ZW1wbGF0ZSAgIDogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsO1xuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgZGF0YTogYW55O1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRoaXMucHJlcGFyZUhUTUwoaHRtbCk7XG4gICAgXG4gICAgICAgIHRoaXMuI3N0eWxlc2hlZXRzID0gdGhpcy5wcmVwYXJlQ1NTKGNzcyk7XG5cbiAgICAgICAgdGhpcy4jaXNSZWFkeSAgID0gaXNET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIHRoaXMuI3doZW5SZWFkeSA9IHdoZW5ET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgLy9UT0RPOiBvdGhlciBkZXBzLi4uXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFRlbXBsYXRlKHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgI3doZW5SZWFkeTogUHJvbWlzZTx1bmtub3duPjtcbiAgICAjaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lzUmVhZHk7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKCB0aGlzLiNpc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy4jd2hlblJlYWR5O1xuICAgICAgICAvL1RPRE86IGRlcHMuXG4gICAgICAgIC8vVE9ETzogQ1NTL0hUTUwgcmVzb3VyY2VzLi4uXG5cbiAgICAgICAgLy8gaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cbiAgICAgICAgLy8gX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG4gICAgICAgIC8vICsgY2YgYXQgdGhlIGVuZC4uLlxuICAgIH1cblxuICAgIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuICAgICAgICB0aGlzLmluamVjdENTUyhzaGFkb3csIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBzaGFkb3cuYXBwZW5kKCB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKHNoYWRvdyk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnR8U2hhZG93Um9vdCB7XG5cbiAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLiAgICAgXG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pbml0U2hhZG93KGhvc3QpO1xuXG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHRhcmdldCwgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGlmKCBob3N0LnNoYWRvd01vZGUgIT09IFNoYWRvd0NmZy5OT05FIHx8IHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKGNvbnRlbnQpO1xuXG4gICAgICAgIC8vaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgJiYgdGFyZ2V0LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKVxuXHRcdC8vXHR0YXJnZXQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGhvc3QpO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTaGFkb3c8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KSB7XG5cbiAgICAgICAgY29uc3QgY2FuSGF2ZVNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpO1xuICAgICAgICBpZiggdGhpcy4jc2hhZG93ICE9PSBudWxsICYmIHRoaXMuI3NoYWRvdyAhPT0gU2hhZG93Q2ZnLk5PTkUgJiYgISBjYW5IYXZlU2hhZG93IClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICAgICAgbGV0IG1vZGUgPSB0aGlzLiNzaGFkb3c7XG4gICAgICAgIGlmKCBtb2RlID09PSBudWxsIClcbiAgICAgICAgICAgIG1vZGUgPSBjYW5IYXZlU2hhZG93ID8gU2hhZG93Q2ZnLk9QRU4gOiBTaGFkb3dDZmcuTk9ORTtcblxuICAgICAgICBob3N0LnNoYWRvd01vZGUgPSBtb2RlO1xuXG4gICAgICAgIGxldCB0YXJnZXQ6IEhvc3R8U2hhZG93Um9vdCA9IGhvc3Q7XG4gICAgICAgIGlmKCBtb2RlICE9PSBTaGFkb3dDZmcuTk9ORSlcbiAgICAgICAgICAgIHRhcmdldCA9IGhvc3QuYXR0YWNoU2hhZG93KHttb2RlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUNTUyhjc3M6IENTU3xyZWFkb25seSBDU1NbXSkge1xuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgcmV0dXJuIGNzcy5tYXAoZSA9PiB0aGlzLnByb2Nlc3NDU1MoZSkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NTUyhjc3M6IENTUykge1xuXG4gICAgICAgIGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG4gICAgICAgICAgICByZXR1cm4gY3NzO1xuICAgICAgICBpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBjc3Muc2hlZXQhO1xuICAgIFxuICAgICAgICBpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1clwiKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUhUTUwoaHRtbD86IEhUTUwpOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGwge1xuICAgIFxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgaWYoaHRtbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgIC8vIHN0cjJodG1sXG4gICAgICAgIGlmKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gaHRtbC50cmltKCk7XG5cbiAgICAgICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBodG1sIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKVxuICAgICAgICAgICAgaHRtbCA9IGh0bWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIHRlbXBsYXRlLmFwcGVuZChodG1sKTtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIGluamVjdENTUzxIb3N0IGV4dGVuZHMgTEhvc3Q+KHRhcmdldDogU2hhZG93Um9vdHxIb3N0LCBzdHlsZXNoZWV0czogYW55W10pIHtcblxuICAgICAgICBpZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCApIHtcbiAgICAgICAgICAgIHRhcmdldC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MsIC4uLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNzc3NlbGVjdG9yID0gdGFyZ2V0LkNTU1NlbGVjdG9yOyAvL1RPRE8uLi5cblxuICAgICAgICBpZiggYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG4gICAgICAgIGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcbiAgICAgICAgZm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcbiAgICAgICAgICAgIGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcbiAgICAgICAgICAgICAgICBodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcbiAgICAgICAgYWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG4gICAgfVxufVxuXG4vLyBpZGVtIEhUTUwuLi5cbi8qIGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBjID0gYXdhaXQgYztcbiAgICAgICAgICAgIGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuICAgICAgICAgICAgICAgIGMgPSBhd2FpdCBjLnRleHQoKTtcblxuICAgICAgICAgICAgc3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG4gICAgICAgIH0pKCkpO1xuXG4gICAgICAgIHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcbiAgICB9XG4qLyIsImltcG9ydCB7IExIb3N0Q3N0ciwgdHlwZSBDbGFzcywgdHlwZSBDb25zdHJ1Y3RvciwgdHlwZSBMSVNTX09wdHMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBidWlsZExJU1NIb3N0LCBzZXRDc3RyQ29udHJvbGVyIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWV9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8qKioqL1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0Ly8gbm9uLXZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBob3N0OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdC8vIHZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBpc0Nvbm5lY3RlZCAgOmJvb2xlYW47XG59O1xuXHQvLyArIHByb3RlY3RlZFxuXHRcdC8vIHJlYWRvbmx5IC5jb250ZW50OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Q7XG5cdC8vIHZhbmlsbGEgSlNcblx0XHQvLyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCk6IHZvaWQ7XG5cdFx0Ly8gY29ubmVjdGVkQ2FsbGJhY2sgICAoKTogdm9pZDtcblx0XHQvLyBkaXNjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkO1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiB7XG5cdG5ldygpOiBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW107XG59XG5cdC8vICsgXCJwcml2YXRlXCJcblx0XHQvLyByZWFkb25seSBIb3N0OiBIb3N0Q3N0clxuXG5leHBvcnQgdHlwZSBDb250cm9sZXI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEluc3RhbmNlVHlwZTxFeHRlbmRzQ3N0cj47XG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4gJiBFeHRlbmRzQ3N0cjtcblxuLyoqKiovXG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPihhcmdzOiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+PiA9IHt9KSB7XG5cblx0bGV0IHtcblx0XHQvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cblx0XHRleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCAgICAgIGFzIHVua25vd24gYXMgRXh0ZW5kc0NzdHIsXG5cdFx0aG9zdCAgICAgICAgICAgICAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRcblx0XHRjb250ZW50X2dlbmVyYXRvciA9IENvbnRlbnRHZW5lcmF0b3IsXG5cdH0gPSBhcmdzO1xuXHRcblx0Y2xhc3MgTElTU0NvbnRyb2xlciBleHRlbmRzIF9leHRlbmRzIGltcGxlbWVudHMgSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+e1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0c2V0Q3N0ckNvbnRyb2xlcih0aGlzKTtcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KC4uLmFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3QuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge31cblxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaG9zdC5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogSW5zdGFuY2VUeXBlPExIb3N0Q3N0cjxIb3N0Q3N0cj4+O1xuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgX0hvc3Q6IExIb3N0Q3N0cjxIb3N0Q3N0cj47XG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlOiBmdWNrIG9mZi5cblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QoIHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aG9zdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcmdzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQ29udHJvbGVyIHNhdGlzZmllcyBDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG59IiwiaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBTaGFkb3dDZmcsIHR5cGUgTElTU0NvbnRyb2xlckNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tIFwiLi9MaWZlQ3ljbGUvc3RhdGVzXCI7XG5cbi8vIExJU1NIb3N0IG11c3QgYmUgYnVpbGQgaW4gZGVmaW5lIGFzIGl0IG5lZWQgdG8gYmUgYWJsZSB0byBidWlsZFxuLy8gdGhlIGRlZmluZWQgc3ViY2xhc3MuXG5cbmxldCBpZCA9IDA7XG5cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcmVkQ1NTKCkge1xuXHRyZXR1cm4gc2hhcmVkQ1NTO1xufVxuXG5sZXQgX19jc3RyX2NvbnRyb2xlciAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckNvbnRyb2xlcihfOiBhbnkpIHtcblx0X19jc3RyX2NvbnRyb2xlciA9IF87XG59XG5cbnR5cGUgaW5mZXJIb3N0Q3N0cjxUPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cjxpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LCBpbmZlciBCIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA/IEIgOiBuZXZlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XHRUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsIFUgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBpbmZlckhvc3RDc3RyPFQ+ID4oXG5cdFx0XHRcdFx0XHRcdExpc3M6IFQsXG5cdFx0XHRcdFx0XHRcdC8vIGNhbid0IGRlZHVjZSA6IGNhdXNlIHR5cGUgZGVkdWN0aW9uIGlzc3Vlcy4uLlxuXHRcdFx0XHRcdFx0XHRob3N0Q3N0cjogVSxcblx0XHRcdFx0XHRcdFx0Y29udGVudF9nZW5lcmF0b3JfY3N0cjogQ29udGVudEdlbmVyYXRvckNzdHIsXG5cdFx0XHRcdFx0XHRcdGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcblx0XHRcdFx0XHRcdCkge1xuXG5cdGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gbmV3IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIoYXJncyk7XG5cblx0dHlwZSBIb3N0Q3N0ciA9IFU7XG4gICAgdHlwZSBIb3N0ICAgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Y2xhc3MgTElTU0hvc3QgZXh0ZW5kcyBob3N0Q3N0ciB7XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgQ2ZnID0ge1xuXHRcdFx0aG9zdCAgICAgICAgICAgICA6IGhvc3RDc3RyLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIsXG5cdFx0XHRhcmdzXG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IERFUEVOREVOQ0lFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHN0YXRpYyBDb250cm9sZXIgPSBMaXNzO1xuXG5cdFx0I2NvbnRyb2xlcjogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBjb250cm9sZXIoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlciAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdC8vVE9ETzogZ2V0IHJlYWwgVFMgdHlwZSA/XG5cdFx0I3BhcmFtczogYW55W107XG5cdFx0aW5pdGlhbGl6ZSguLi5wYXJhbXM6IGFueVtdKSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgYWxyZWFkeSBpbml0aWFsaXplZCEnKTtcbiAgICAgICAgICAgIGlmKCAhICggdGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzRGVwc1Jlc29sdmVkIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdGlmKCBwYXJhbXMubGVuZ3RoICE9PSAwICkge1xuXHRcdFx0XHRpZiggdGhpcy4jcGFyYW1zLmxlbmd0aCAhPT0gMCApXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDc3RyIHBhcmFtcyBoYXMgYWxyZWFkeSBiZWVuIHByb3ZpZGVkICEnKTtcblx0XHRcdFx0dGhpcy4jcGFyYW1zID0gcGFyYW1zO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNjb250cm9sZXIgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuaXNDb25uZWN0ZWQgKVxuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBDb250ZW50ID09PT09PT09PT09PT09PT09PT1cblxuXHRcdC8vI2ludGVybmFscyA9IHRoaXMuYXR0YWNoSW50ZXJuYWxzKCk7XG5cdFx0Ly8jc3RhdGVzICAgID0gdGhpcy4jaW50ZXJuYWxzLnN0YXRlcztcblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290ID0gdGhpcyBhcyBIb3N0O1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgYXR0YWNoU2hhZG93KGluaXQ6IFNoYWRvd1Jvb3RJbml0KTogU2hhZG93Um9vdCB7XG5cdFx0XHRjb25zdCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3coaW5pdCk7XG5cblx0XHRcdC8vIEB0cy1pZ25vcmUgY2xvc2VkIElTIGFzc2lnbmFibGUgdG8gc2hhZG93TW9kZS4uLlxuXHRcdFx0dGhpcy5zaGFkb3dNb2RlID0gaW5pdC5tb2RlO1xuXG5cdFx0XHR0aGlzLiNjb250ZW50ID0gc2hhZG93O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc2hhZG93O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2hhZG93TW9kZSAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKC4uLnBhcmFtczogYW55W10pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19VUEdSQURFRCk7XG5cdFx0XHRjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKS50aGVuKCgpID0+IHtcblx0XHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX1JFQURZKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRjb25zdCBjb250cm9sZXIgPSBfX2NzdHJfY29udHJvbGVyO1xuXHRcdFx0X19jc3RyX2NvbnRyb2xlciA9IG51bGw7XG5cblx0XHRcdGlmKCBjb250cm9sZXIgIT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gY29udHJvbGVyO1xuXHRcdFx0XHR0aGlzLmluaXQoKTsgLy8gY2FsbCB0aGUgcmVzb2x2ZXJcblx0XHRcdH1cblxuXHRcdFx0aWYoIFwiX3doZW5VcGdyYWRlZFJlc29sdmVcIiBpbiB0aGlzKVxuXHRcdFx0XHQodGhpcy5fd2hlblVwZ3JhZGVkUmVzb2x2ZSBhcyBhbnkpKCk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PSBET00gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHRcdFxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRpZih0aGlzLmNvbnRyb2xlciAhPT0gbnVsbClcblx0XHRcdFx0dGhpcy5jb250cm9sZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmNvbnRyb2xlciEuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBpbnN0YW5jZSBkZXBzXG5cdFx0XHRpZiggY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblxuXHRcdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHR9KSgpO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIExJU1NIb3N0LkNvbnRyb2xlci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG5cdFx0fVxuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZih0aGlzLiNjb250cm9sZXIpXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblx0XHR9XG5cblx0XHRzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbCA9IG51bGw7XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cblx0XHRcdC8vIG5vIG5lZWRzIHRvIHNldCB0aGlzLiNjb250ZW50IChhbHJlYWR5IGhvc3Qgb3Igc2V0IHdoZW4gYXR0YWNoU2hhZG93KVxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3IuZ2VuZXJhdGUodGhpcyk7XG5cblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblxuXHRcdFx0aWYoIHRoaXMuI2NvbnRyb2xlciA9PT0gbnVsbCkge1xuXHRcdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gbmV3IExJU1NIb3N0LkNvbnRyb2xlciguLi50aGlzLiNwYXJhbXMpIGFzIEluc3RhbmNlVHlwZTxUPjtcblx0XHRcdH1cblxuXHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX0lOSVRJQUxJWkVEKTtcblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuY29udHJvbGVyKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29udHJvbGVyO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3Q7XG59XG5cblxuIiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SFRNTEVsZW1lbnQ7XG5cbi8vIFRPRE8uLi5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPnxhbnkpIHtcblxuXHRsZXQgSG9zdDogTElTU0hvc3RDc3RyPFQ+ID0gQ29tcG9uZW50Q2xhc3MgYXMgYW55O1xuXG5cdC8vIEJyeXRob24gY2xhc3Ncblx0bGV0IGJyeV9jbGFzczogYW55ID0gbnVsbDtcblx0aWYoIFwiJGlzX2NsYXNzXCIgaW4gQ29tcG9uZW50Q2xhc3MgKSB7XG5cblx0XHRicnlfY2xhc3MgPSBDb21wb25lbnRDbGFzcztcblxuXHRcdENvbXBvbmVudENsYXNzID0gYnJ5X2NsYXNzLl9fYmFzZXNfXy5maWx0ZXIoIChlOiBhbnkpID0+IGUuX19uYW1lX18gPT09IFwiV3JhcHBlclwiKVswXS5fanNfa2xhc3MuJGpzX2Z1bmM7XG5cdFx0KENvbXBvbmVudENsYXNzIGFzIGFueSkuSG9zdC5Db250cm9sZXIgPSBjbGFzcyB7XG5cblx0XHRcdCNicnk6IGFueTtcblxuXHRcdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHR0aGlzLiNicnkgPSBfX0JSWVRIT05fXy4kY2FsbChicnlfY2xhc3MsIFswLDAsMF0pKC4uLmFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHQjY2FsbChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRjYWxsKF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIG5hbWUsIFswLDAsMF0pLCBbMCwwLDBdKSguLi5hcmdzKVxuXHRcdFx0fVxuXG5cdFx0XHRnZXQgaG9zdCgpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgXCJob3N0XCIsIFswLDAsMF0pXG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBicnlfY2xhc3NbXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIl07XG5cblx0XHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0Y29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblx0XHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiZGlzY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYoIFwiSG9zdFwiIGluIENvbXBvbmVudENsYXNzIClcblx0XHRIb3N0ID0gQ29tcG9uZW50Q2xhc3MuSG9zdCBhcyBhbnk7XG5cbiAgICBsZXQgaHRtbHRhZyA9IHVuZGVmaW5lZDtcbiAgICBpZiggXCJDZmdcIiBpbiBIb3N0KSB7XG4gICAgICAgIGNvbnN0IENsYXNzICA9IEhvc3QuQ2ZnLmhvc3Q7XG4gICAgICAgIGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBIb3N0LCBvcHRzKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHJ8TElTU0hvc3Q8TElTU0NvbnRyb2xlcj58TElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+ICk6IHN0cmluZyB7XG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIGlmKCBcImhvc3RcIiBpbiBlbGVtZW50KVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5ob3N0O1xuICAgIGlmKCBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICBjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICBpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8vIGNzdHJcblxuXHRpZiggXCJIb3N0XCIgaW4gZWxlbWVudClcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuSG9zdCBhcyB1bmtub3duIGFzIExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPjtcblxuICAgIGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG4gICAgaWYobmFtZSA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBpcyBub3QgZGVmaW5lZCFcIik7XG5cbiAgICByZXR1cm4gbmFtZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSkgIT09IHVuZGVmaW5lZDtcblxuICAgIGlmKCBcIkhvc3RcIiBpbiBlbGVtKVxuICAgICAgICBlbGVtID0gZWxlbS5Ib3N0IGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0gYXMgYW55KSAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0Q3N0cjxUPj4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlbGVtKTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbGlzdGVuIGRlZmluZS4uLlxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59XG5cbi8qXG4vLyBUT0RPOiBpbXBsZW1lbnRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10pIDogUHJvbWlzZTx2b2lkPiB7XG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG59XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3RDc3RyPFQ+PiB7XG4gICAgLy8gd2UgY2FuJ3QgZm9yY2UgYSBkZWZpbmUuXG4gICAgcmV0dXJuIHdoZW5EZWZpbmVkKGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdENzdHI8VD4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuXG4gICAgICAgIGxldCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pO1xuICAgICAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlbGVtfSBub3QgZGVmaW5lZCB5ZXQhYCk7XG5cbiAgICAgICAgcmV0dXJuIGhvc3QgYXMgdW5rbm93biBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgaWYoIFwiSG9zdFwiIGluIGVsZW0pXG4gICAgICAgIGVsZW0gPSBlbGVtLkhvc3QgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgaWYoIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSBhcyBhbnkpID09PSBudWxsIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2VsZW19IG5vdCBkZWZpbmVkIHlldCFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0Q3N0cjxUPjtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCB3aGVuVXBncmFkZWQgfSBmcm9tIFwiLi9VUEdSQURFRFwiO1xuaW1wb3J0IHsgaXNSZWFkeSwgd2hlblJlYWR5IH0gZnJvbSBcIi4vUkVBRFlcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBMSVNTSG9zdDxUPnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoICEgaXNVcGdyYWRlZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHdoZW5VcGdyYWRlZChlbGVtKTtcblxuICAgIHJldHVybiBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZCBhcyBUO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29udHJvbGVyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG4gICAgYXdhaXQgd2hlblJlYWR5KGhvc3QpO1xuXG4gICAgLy9UT0RPOiBpbml0aWFsaXplU3luYyB2cyBpbml0aWFsaXplID9cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcbiAgICBpZiggISBpc1JlYWR5KGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kYW5jaWVzIG5vdCByZWFkeSAhXCIpXG5cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplICAgICA9IGdldENvbnRyb2xlcjtcbmV4cG9ydCBjb25zdCBpbml0aWFsaXplU3luYyA9IGdldENvbnRyb2xlclN5bmM7IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlYWR5PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgY29uc3QgaG9zdENzdHIgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICByZXR1cm4gaG9zdENzdHIuaXNEZXBzUmVzb2x2ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuUmVhZHk8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IGhvc3RDc3RyID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG4gICAgYXdhaXQgaG9zdENzdHIud2hlbkRlcHNSZXNvbHZlZDtcblxuICAgIHJldHVybiBob3N0Q3N0ci5Db250cm9sZXIgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIC8vIHdlIGNhbid0IGZvcmNlIGEgcmVhZHkuXG4gICAgcmV0dXJuIHdoZW5SZWFkeShlbGVtKSBhcyBQcm9taXNlPFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0clN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGlmKCAhIGlzUmVhZHkoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgcmV0dXJuIGdldEhvc3RDc3RyU3luYyhlbGVtKS5Db250cm9sZXIgYXMgVDtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPF9UIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBIVE1MRWxlbWVudDtcblxuLy9UT0RPOiB1cGdyYWRlIGZ1bmN0aW9uLi4uXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPnxMSVNTSG9zdDxUPik6IGVsZW0gaXMgTElTU0hvc3Q8VD4ge1xuXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgSG9zdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgY29uc3QgSG9zdCA9IGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuXG4gICAgLy8gYWxyZWFkeSB1cGdyYWRlZFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSG9zdClcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG5cbiAgICAvLyBoNGNrXG5cbiAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xuICAgIH1cblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgIFxuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0U3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdDxUPiB7XG4gICAgXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgZGVmaW5lZCAhXCIpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgY29uc3QgdXBncmFkZSAgICAgPSBnZXRIb3N0O1xuZXhwb3J0IGNvbnN0IHVwZ3JhZGVTeW5jID0gZ2V0SG9zdFN5bmMiLCJleHBvcnQgZW51bSBTdGF0ZXMge1xuICAgIExJU1NfREVGSU5FRCAgICAgPSBcIkxJU1NfREVGSU5FRFwiLFxuICAgIExJU1NfVVBHUkFERUQgICAgPSBcIkxJU1NfVVBHUkFERURcIixcbiAgICBMSVNTX1JFQURZICAgICAgID0gXCJMSVNTX1JFQURZXCIsXG4gICAgTElTU19JTklUSUFMSVpFRCA9IFwiTElTU19JTklUSUFMSVpFRFwiXG59IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuXG5pbXBvcnQge1N0YXRlc30gZnJvbSBcIi4uL0xpZmVDeWNsZS9zdGF0ZXMudHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIFN0YXRlcyAgICAgICAgIDogdHlwZW9mIFN0YXRlc1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5TdGF0ZXMgPSBTdGF0ZXM7XG5cblxuaW1wb3J0IHtkZWZpbmUsIGdldE5hbWUsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQsIGdldEhvc3RDc3RyLCBnZXRIb3N0Q3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdGdldEhvc3RDc3RyICAgIDogdHlwZW9mIGdldEhvc3RDc3RyO1xuXHRcdGdldEhvc3RDc3RyU3luYzogdHlwZW9mIGdldEhvc3RDc3RyU3luYztcblx0XHQvLyB3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldEhvc3RDc3RyU3luYz0gZ2V0SG9zdENzdHJTeW5jO1xuXG4vL0xJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcblxuaW1wb3J0IHtpc1JlYWR5LCB3aGVuUmVhZHksIGdldENvbnRyb2xlckNzdHIsIGdldENvbnRyb2xlckNzdHJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1JFQURZXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzUmVhZHkgICAgICA6IHR5cGVvZiBpc1JlYWR5O1xuXHRcdHdoZW5SZWFkeSAgICA6IHR5cGVvZiB3aGVuUmVhZHk7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0ciAgICA6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyO1xuXHRcdGdldENvbnRyb2xlckNzdHJTeW5jOiB0eXBlb2YgZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzUmVhZHkgICAgICAgICAgICAgPSBpc1JlYWR5O1xuTElTUy53aGVuUmVhZHkgICAgICAgICAgID0gd2hlblJlYWR5O1xuTElTUy5nZXRDb250cm9sZXJDc3RyICAgID0gZ2V0Q29udHJvbGVyQ3N0cjtcbkxJU1MuZ2V0Q29udHJvbGVyQ3N0clN5bmM9IGdldENvbnRyb2xlckNzdHJTeW5jO1xuXG5cblxuaW1wb3J0IHtpc1VwZ3JhZGVkLCB3aGVuVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCBnZXRIb3N0LCBnZXRIb3N0U3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9VUEdSQURFRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc1VwZ3JhZGVkICA6IHR5cGVvZiBpc1VwZ3JhZGVkO1xuXHRcdHdoZW5VcGdyYWRlZDogdHlwZW9mIHdoZW5VcGdyYWRlZDtcblx0XHR1cGdyYWRlICAgICA6IHR5cGVvZiB1cGdyYWRlO1xuXHRcdHVwZ3JhZGVTeW5jIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuXHRcdGdldEhvc3QgICAgIDogdHlwZW9mIGdldEhvc3Q7XG5cdFx0Z2V0SG9zdFN5bmMgOiB0eXBlb2YgZ2V0SG9zdFN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzVXBncmFkZWQgID0gaXNVcGdyYWRlZDtcbkxJU1Mud2hlblVwZ3JhZGVkPSB3aGVuVXBncmFkZWQ7XG5MSVNTLnVwZ3JhZGUgICAgID0gdXBncmFkZTtcbkxJU1MudXBncmFkZVN5bmMgPSB1cGdyYWRlU3luYztcbkxJU1MuZ2V0SG9zdCAgICAgPSBnZXRIb3N0O1xuTElTUy5nZXRIb3N0U3luYyA9IGdldEhvc3RTeW5jO1xuXG5cbmltcG9ydCB7aXNJbml0aWFsaXplZCwgd2hlbkluaXRpYWxpemVkLCBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYywgZ2V0Q29udHJvbGVyLCBnZXRDb250cm9sZXJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzSW5pdGlhbGl6ZWQgICAgOiB0eXBlb2YgaXNJbml0aWFsaXplZDtcblx0XHR3aGVuSW5pdGlhbGl6ZWQgIDogdHlwZW9mIHdoZW5Jbml0aWFsaXplZDtcblx0XHRpbml0aWFsaXplICAgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG5cdFx0aW5pdGlhbGl6ZVN5bmMgICA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcblx0XHRnZXRDb250cm9sZXIgICAgIDogdHlwZW9mIGdldENvbnRyb2xlcjtcblx0XHRnZXRDb250cm9sZXJTeW5jIDogdHlwZW9mIGdldENvbnRyb2xlclN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzSW5pdGlhbGl6ZWQgICAgPSBpc0luaXRpYWxpemVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQgID0gd2hlbkluaXRpYWxpemVkO1xuTElTUy5pbml0aWFsaXplICAgICAgID0gaW5pdGlhbGl6ZTtcbkxJU1MuaW5pdGlhbGl6ZVN5bmMgICA9IGluaXRpYWxpemVTeW5jO1xuTElTUy5nZXRDb250cm9sZXIgICAgID0gZ2V0Q29udHJvbGVyO1xuTElTUy5nZXRDb250cm9sZXJTeW5jID0gZ2V0Q29udHJvbGVyU3luYzsiLCJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPik6IFJldHVyblR5cGU8dHlwZW9mIF9leHRlbmRzPEV4dGVuZHNDc3RyLCBPcHRzPj5cbi8vIExJU1NDb250cm9sZXIgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPlxuZXhwb3J0IGZ1bmN0aW9uIExJU1Mob3B0czogYW55ID0ge30pOiBMSVNTQ29udHJvbGVyQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NDb250cm9sZXJDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRlbmRzPFxuICAgICAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgICAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pIHtcblxuICAgIGlmKCBvcHRzLmV4dGVuZHMgPT09IHVuZGVmaW5lZCkgLy8gaDRja1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGEgTElTU0NvbnRyb2xlciEnKTtcblxuICAgIGNvbnN0IGNmZyA9IG9wdHMuZXh0ZW5kcy5Ib3N0LkNmZztcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgY2ZnLCBjZmcuYXJncywgb3B0cyk7XG5cbiAgICBjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBvcHRzLmV4dGVuZHMhIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgb3ZlcnJpZGUgX0hvc3Q6IExJU1NIb3N0PEV4dGVuZGVkTElTUz47XG5cbiAgICAgICAgLy8gVFMgaXMgc3R1cGlkLCByZXF1aXJlcyBleHBsaWNpdCByZXR1cm4gdHlwZVxuXHRcdHN0YXRpYyBvdmVycmlkZSBnZXQgSG9zdCgpOiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+IHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBmdWNrIG9mZlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuaG9zdCEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250ZW50X2dlbmVyYXRvciEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59IiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIExIb3N0LCBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4uL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCB7IGRlZmluZSB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuaW1wb3J0IExJU1N2MyBmcm9tIFwiVjMvXCI7XG5cbmNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5sZXQgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ3NjcmlwdFthdXRvZGlyXScpO1xuaWYoIHNjcmlwdCA9PT0gbnVsbClcblx0c2NyaXB0ID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdzY3JpcHRbbGlzcy1tb2RlPVwiYXV0by1sb2FkXCJdJyk7XG5cbmNvbnN0IERFRkFVTFRfQ0RJUiA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdhdXRvZGlyJykgPz8gc2NyaXB0Py5nZXRBdHRyaWJ1dGUoJ2xpc3MtY2RpcicpID8/IG51bGw7XG5cbmlmKHNjcmlwdCAhPT0gbnVsbClcblx0YXV0b2xvYWQoc2NyaXB0KVxuXG5cbmZ1bmN0aW9uIGF1dG9sb2FkKHNjcmlwdDogSFRNTEVsZW1lbnQpIHtcblxuXHRsZXQgY2RpcjogbnVsbHxzdHJpbmcgPSBERUZBVUxUX0NESVI7XG5cblx0Y29uc3QgU1c6IFByb21pc2U8dm9pZD4gPSBuZXcgUHJvbWlzZSggYXN5bmMgKHJlc29sdmUpID0+IHtcblxuXHRcdGNvbnN0IHN3X3BhdGggPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdzdycpO1xuXG5cdFx0aWYoIHN3X3BhdGggPT09IG51bGwgKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJZb3UgYXJlIHVzaW5nIExJU1MgQXV0byBtb2RlIHdpdGhvdXQgc3cuanMuXCIpO1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc3dfcGF0aCwge3Njb3BlOiBcIi9cIn0pO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiUmVnaXN0cmF0aW9uIG9mIFNlcnZpY2VXb3JrZXIgZmFpbGVkXCIpO1xuXHRcdFx0Y29uc29sZS5lcnJvcihlKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9XG5cblx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRjZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpITtcblxuXHRsZXQgYWRkVGFnID0gYWRkVGFnVjI7XG5cblx0aWYoIGNkaXIgPT09IG51bGwpIHtcblx0XHRjZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnbGlzcy1jZGlyJykhO1xuXHRcdGFkZFRhZyA9IGFkZFRhZ1YzO1xuXHR9XG5cblxuXG5cdGlmKCBjZGlyW2NkaXIubGVuZ3RoLTFdICE9PSAnLycpXG5cdFx0Y2RpciArPSAnLyc7XG5cblx0Y29uc3QgYnJ5dGhvbiA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJicnl0aG9uXCIpO1xuXG5cdC8vIG9ic2VydmUgZm9yIG5ldyBpbmplY3RlZCB0YWdzLlxuXHRuZXcgTXV0YXRpb25PYnNlcnZlciggKG11dGF0aW9ucykgPT4ge1xuXHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdFx0XHRcdGFkZFRhZyhhZGRpdGlvbilcblxuXHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqXCIpIClcblx0XHRhZGRUYWcoIGVsZW0gKTtcblxuXHRhc3luYyBmdW5jdGlvbiBhZGRUYWdWMih0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IHRhZ25hbWUgPSAoIHRhZy5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gdGFnLnRhZ05hbWUgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0aWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGNkaXIsXG5cdFx0XHRob3N0XG5cdFx0fSk7XHRcdFxuXHR9XG5cblx0YXN5bmMgZnVuY3Rpb24gYWRkVGFnVjModGFnOiBIVE1MRWxlbWVudCkge1xuXG5cdFx0YXdhaXQgU1c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cblx0XHRjb25zdCB0YWduYW1lID0gdGFnLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmKCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCBLbm93blRhZ3MuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aW1wb3J0Q29tcG9uZW50VjModGFnbmFtZSwge1xuXHRcdFx0Ly9icnl0aG9uLFxuXHRcdFx0Y2RpclxuXHRcdH0pO1x0XHRcblx0fVxufVxuXG4vL1RPRE86IHJlbmFtZSBmcm9tIGZpbGVzID9cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudFYzKHRhZ25hbWU6IHN0cmluZywgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcblxuXHRsZXQga2xhc3MgPSBMSVNTdjMoe1xuXHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yLFxuXHRcdC4uLmZpbGVzXG5cdH0pO1xuXG5cdC8vIHRvZG8gYnJ5Li4uIFxuXHQvL1RPRE86IHRhZ25hbWUgaW4gdjNcblxuXHQvLyBUT0RPLi4uLlxuXHQvKlxuXHRjb25zdCBjX2pzICAgICAgPSBmaWxlc1tcImluZGV4LmpzXCJdO1xuXHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0aWYoIGNfanMgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGNvbnN0IGZpbGUgPSBuZXcgQmxvYihbY19qc10sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pO1xuXHRcdGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG5cdFx0Y29uc3Qgb2xkcmVxID0gTElTUy5yZXF1aXJlO1xuXG5cdFx0TElTUy5yZXF1aXJlID0gZnVuY3Rpb24odXJsOiBVUkx8c3RyaW5nKSB7XG5cblx0XHRcdGlmKCB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiICYmIHVybC5zdGFydHNXaXRoKCcuLycpICkge1xuXHRcdFx0XHRjb25zdCBmaWxlbmFtZSA9IHVybC5zbGljZSgyKTtcblx0XHRcdFx0aWYoIGZpbGVuYW1lIGluIGZpbGVzKVxuXHRcdFx0XHRcdHJldHVybiBmaWxlc1tmaWxlbmFtZV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvbGRyZXEodXJsKTtcblx0XHR9XG5cblx0XHRrbGFzcyA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLy8qIHVybCkpLmRlZmF1bHQ7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBvbGRyZXE7XG5cdH1cblx0ZWxzZSBpZiggb3B0cy5odG1sICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRrbGFzcyA9IExJU1Moe1xuXHRcdFx0Li4ub3B0cyxcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yXG5cdFx0fSk7XG5cdH1cblxuXHRpZihrbGFzcyA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuKi9cblxuXHRkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXG5cdHJldHVybiBrbGFzcztcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZywgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9wdHM6IHtodG1sOiBzdHJpbmcsIGNzczogc3RyaW5nLCBob3N0OiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD59KSB7XG5cblx0Y29uc3QgY19qcyAgICAgID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0b3B0cy5odG1sICAgICA/Pz0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXG5cdGxldCBrbGFzczogbnVsbHwgUmV0dXJuVHlwZTx0eXBlb2YgTElTUz4gPSBudWxsO1xuXHRpZiggY19qcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0Y29uc3QgZmlsZSA9IG5ldyBCbG9iKFtjX2pzXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG5cdFx0Y29uc3QgdXJsICA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG5cblx0XHRjb25zdCBvbGRyZXEgPSBMSVNTLnJlcXVpcmU7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBmdW5jdGlvbih1cmw6IFVSTHxzdHJpbmcpIHtcblxuXHRcdFx0aWYoIHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgJiYgdXJsLnN0YXJ0c1dpdGgoJy4vJykgKSB7XG5cdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gdXJsLnNsaWNlKDIpO1xuXHRcdFx0XHRpZiggZmlsZW5hbWUgaW4gZmlsZXMpXG5cdFx0XHRcdFx0cmV0dXJuIGZpbGVzW2ZpbGVuYW1lXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9sZHJlcSh1cmwpO1xuXHRcdH1cblxuXHRcdGtsYXNzID0gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVybCkpLmRlZmF1bHQ7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBvbGRyZXE7XG5cdH1cblx0ZWxzZSBpZiggb3B0cy5odG1sICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRrbGFzcyA9IExJU1Moe1xuXHRcdFx0Li4ub3B0cyxcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yXG5cdFx0fSk7XG5cdH1cblxuXHRpZigga2xhc3MgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0ZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuXHRyZXR1cm4ga2xhc3M7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgaW50ZXJuYWwgdG9vbHMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdGNvbnN0IG9wdGlvbnMgPSBpc0xpc3NBdXRvXG5cdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHQ6IHt9O1xuXG5cblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuXHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRpZiggaXNMaXNzQXV0byAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0Y29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG5cdGlmKGFuc3dlciA9PT0gXCJcIilcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhbnN3ZXJcbn1cbmFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdC8vIHRlc3QgZm9yIHRoZSBtb2R1bGUgZXhpc3RhbmNlLlxuXHRpZihpc0xpc3NBdXRvICYmIGF3YWl0IF9mZXRjaFRleHQodXJpLCBpc0xpc3NBdXRvKSA9PT0gdW5kZWZpbmVkIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmkpKS5kZWZhdWx0O1xuXHR9IGNhdGNoKGUpIHtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59XG5cblxuY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5mdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn1cblxuZXhwb3J0IGNsYXNzIExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuXHRwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcGFyZUhUTUwoaHRtbD86IERvY3VtZW50RnJhZ21lbnQgfCBIVE1MRWxlbWVudCB8IHN0cmluZykge1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IG51bGw7XG5cblx0XHRpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuXG5cdFx0XHR0aGlzLmRhdGEgPSBodG1sO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHQvKlxuXHRcdFx0aHRtbCA9IGh0bWwucmVwbGFjZUFsbCgvXFwkXFx7KFtcXHddKylcXH0vZywgKF8sIG5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYDxsaXNzIHZhbHVlPVwiJHtuYW1lfVwiPjwvbGlzcz5gO1xuXHRcdFx0fSk7Ki9cblxuXHRcdFx0Ly9UT0RPOiAke30gaW4gYXR0clxuXHRcdFx0XHQvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG5cdFx0XHRcdC8vIC0gcmVnaXN0ZXIgZWxlbSArIGF0dHIgbmFtZVxuXHRcdFx0XHQvLyAtIHJlcGxhY2UuIFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gc3VwZXIucHJlcGFyZUhUTUwoaHRtbCk7XG5cdH1cblxuXHRvdmVycmlkZSBmaWxsQ29udGVudChzaGFkb3c6IFNoYWRvd1Jvb3QpIHtcblx0XHRcblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0aWYoIHRoaXMuZGF0YSAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3Qgc3RyID0gKHRoaXMuZGF0YSBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gZW5jb2RlSFRNTChob3N0LmdldEF0dHJpYnV0ZShtYXRjaCkgPz8gJycgKSk7XG5cdFx0XHRzdXBlci5zZXRUZW1wbGF0ZSggc3VwZXIucHJlcGFyZUhUTUwoc3RyKSEgKTtcblx0XHR9XG5cblx0XHRzdXBlci5maWxsQ29udGVudChzaGFkb3cpO1xuXG5cdFx0Lypcblx0XHQvLyBodG1sIG1hZ2ljIHZhbHVlcyBjb3VsZCBiZSBvcHRpbWl6ZWQuLi5cblx0XHRjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cdFx0Zm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG5cdFx0XHR2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cdFx0Ki9cblxuXHR9XG5cblx0b3ZlcnJpZGUgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnQgfCBTaGFkb3dSb290IHtcblx0XHRcblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0aWYoIHRoaXMuZGF0YSAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3Qgc3RyID0gKHRoaXMuZGF0YSBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gZW5jb2RlSFRNTChob3N0LmdldEF0dHJpYnV0ZShtYXRjaCkgPz8gJycgKSk7XG5cdFx0XHRzdXBlci5zZXRUZW1wbGF0ZSggc3VwZXIucHJlcGFyZUhUTUwoc3RyKSEgKTtcblx0XHR9XG5cblx0XHRjb25zdCBjb250ZW50ID0gc3VwZXIuZ2VuZXJhdGUoaG9zdCk7XG5cblx0XHQvKlxuXHRcdC8vIGh0bWwgbWFnaWMgdmFsdWVzLlxuXHRcdC8vIGNhbiBiZSBvcHRpbWl6ZWQuLi5cblx0XHRjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cdFx0Zm9yKGxldCB2YWx1ZSBvZiB2YWx1ZXMpXG5cdFx0XHR2YWx1ZS50ZXh0Q29udGVudCA9IGhvc3QuZ2V0QXR0cmlidXRlKHZhbHVlLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cdFx0Ki9cblxuXHRcdC8vIGNzcyBwcm9wLlxuXHRcdGNvbnN0IGNzc19hdHRycyA9IGhvc3QuZ2V0QXR0cmlidXRlTmFtZXMoKS5maWx0ZXIoIGUgPT4gZS5zdGFydHNXaXRoKCdjc3MtJykpO1xuXHRcdGZvcihsZXQgY3NzX2F0dHIgb2YgY3NzX2F0dHJzKVxuXHRcdFx0aG9zdC5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke2Nzc19hdHRyLnNsaWNlKCdjc3MtJy5sZW5ndGgpfWAsIGhvc3QuZ2V0QXR0cmlidXRlKGNzc19hdHRyKSk7XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50cyA6IHR5cGVvZiBpbXBvcnRDb21wb25lbnRzO1xuICAgICAgICBpbXBvcnRDb21wb25lbnQgIDogdHlwZW9mIGltcG9ydENvbXBvbmVudDtcbiAgICAgICAgcmVxdWlyZSAgICAgICAgICA6IHR5cGVvZiByZXF1aXJlO1xuICAgIH1cbn1cblxudHlwZSBpbXBvcnRDb21wb25lbnRzX09wdHNWMzxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGxcbn07XG5cbnR5cGUgaW1wb3J0Q29tcG9uZW50c19PcHRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSB7XG5cdGNkaXIgICA/OiBzdHJpbmd8bnVsbCxcblx0YnJ5dGhvbj86IHN0cmluZ3xudWxsLFxuXHRob3N0ICAgPzogQ29uc3RydWN0b3I8VD5cbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudHM8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHRcdFx0XHRcdFx0Y29tcG9uZW50czogc3RyaW5nW10sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0XHRcdFx0XHRcdGJyeXRob24gPSBudWxsLFxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudFxuXHRcdFx0XHRcdFx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+KSB7XG5cblx0Y29uc3QgcmVzdWx0czogUmVjb3JkPHN0cmluZywgTElTU0NvbnRyb2xlckNzdHI+ID0ge307XG5cblx0Zm9yKGxldCB0YWduYW1lIG9mIGNvbXBvbmVudHMpIHtcblxuXHRcdHJlc3VsdHNbdGFnbmFtZV0gPSBhd2FpdCBpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0Y2Rpcixcblx0XHRcdGJyeXRob24sXG5cdFx0XHRob3N0XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuY29uc3QgYnJ5X3dyYXBwZXIgPSBgZnJvbSBicm93c2VyIGltcG9ydCBzZWxmXG5cbmRlZiB3cmFwanMoanNfa2xhc3MpOlxuXG5cdGNsYXNzIFdyYXBwZXI6XG5cblx0XHRfanNfa2xhc3MgPSBqc19rbGFzc1xuXHRcdF9qcyA9IE5vbmVcblxuXHRcdGRlZiBfX2luaXRfXyh0aGlzLCAqYXJncyk6XG5cdFx0XHR0aGlzLl9qcyA9IGpzX2tsYXNzLm5ldygqYXJncylcblxuXHRcdGRlZiBfX2dldGF0dHJfXyh0aGlzLCBuYW1lOiBzdHIpOlxuXHRcdFx0cmV0dXJuIHRoaXMuX2pzW25hbWVdO1xuXG5cdFx0ZGVmIF9fc2V0YXR0cl9fKHRoaXMsIG5hbWU6IHN0ciwgdmFsdWUpOlxuXHRcdFx0aWYgbmFtZSA9PSBcIl9qc1wiOlxuXHRcdFx0XHRzdXBlcigpLl9fc2V0YXR0cl9fKG5hbWUsIHZhbHVlKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHRoaXMuX2pzW25hbWVdID0gdmFsdWVcblx0XG5cdHJldHVybiBXcmFwcGVyXG5cbnNlbGYud3JhcGpzID0gd3JhcGpzXG5gO1xuXG5cblxuYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50VjM8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdC8vIGJyeXRob24gPSBudWxsXG5cdH06IGltcG9ydENvbXBvbmVudHNfT3B0c1YzPFQ+ID0ge31cbikge1xuXG5cdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RhZ25hbWV9L2A7XG5cblx0Y29uc3QgZmlsZXM6IFJlY29yZDxzdHJpbmcsc3RyaW5nPiA9IHt9O1xuXG5cdGNvbnN0IGV4dCA9IFwiaHRtbFwiO1xuXG5cdGZpbGVzW2V4dF0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguJHtleHR9YCwgdHJ1ZSkpITtcblx0Ly8gdHJ5L2NhdGNoID9cblx0Ly8gc3RyYXRzIDogSlMgLT4gQnJ5IC0+IEhUTUwrQ1NTLlxuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnRWMyh0YWduYW1lLCBmaWxlcyk7XG59XG5cblxuXG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdHRhZ25hbWU6IHN0cmluZyxcblx0e1xuXHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0YnJ5dGhvbiA9IG51bGwsXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudCxcblx0XHRmaWxlcyAgID0gbnVsbFxuXHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4gJiB7ZmlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fG51bGx9ID0ge31cbikge1xuXG5cdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RhZ25hbWV9L2A7XG5cblx0aWYoIGZpbGVzID09PSBudWxsICkge1xuXHRcdGZpbGVzID0ge307XG5cblx0XHRjb25zdCBmaWxlID0gYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgPyAnaW5kZXguYnJ5JyA6ICdpbmRleC5qcyc7XG5cblx0XHRmaWxlc1tmaWxlXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn0ke2ZpbGV9YCwgdHJ1ZSkpITtcblxuXHRcdC8vVE9ETyEhIVxuXHRcdHRyeSB7XG5cdFx0XHRmaWxlc1tcImluZGV4Lmh0bWxcIl0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguaHRtbGAsIHRydWUpKSE7XG5cdFx0fSBjYXRjaChlKSB7XG5cblx0XHR9XG5cdFx0dHJ5IHtcblx0XHRcdGZpbGVzW1wiaW5kZXguY3NzXCIgXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5jc3NgICwgdHJ1ZSkpITtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFxuXHRcdH1cblx0fVxuXG5cdGlmKCBicnl0aG9uID09PSBcInRydWVcIiAmJiBmaWxlc1snaW5kZXguYnJ5J10gIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0Y29uc3QgY29kZSA9IGZpbGVzW1wiaW5kZXguYnJ5XCJdO1xuXG5cdFx0ZmlsZXNbJ2luZGV4LmpzJ10gPVxuYGNvbnN0ICRCID0gZ2xvYmFsVGhpcy5fX0JSWVRIT05fXztcblxuJEIucnVuUHl0aG9uU291cmNlKFxcYCR7YnJ5X3dyYXBwZXJ9XFxgLCBcIl9cIik7XG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHtjb2RlfVxcYCwgXCJfXCIpO1xuXG5jb25zdCBtb2R1bGUgPSAkQi5pbXBvcnRlZFtcIl9cIl07XG5leHBvcnQgZGVmYXVsdCBtb2R1bGUuV2ViQ29tcG9uZW50O1xuXG5gO1xuXHR9XG5cblx0Y29uc3QgaHRtbCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIHtodG1sLCBjc3MsIGhvc3R9KTtcbn1cblxuZnVuY3Rpb24gcmVxdWlyZSh1cmw6IFVSTHxzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPnxzdHJpbmcge1xuXHRyZXR1cm4gZmV0Y2godXJsKTtcbn1cblxuXG5MSVNTLmltcG9ydENvbXBvbmVudHMgPSBpbXBvcnRDb21wb25lbnRzO1xuTElTUy5pbXBvcnRDb21wb25lbnQgID0gaW1wb3J0Q29tcG9uZW50O1xuTElTUy5yZXF1aXJlICA9IHJlcXVpcmU7IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn0iLCJcbmltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbnR5cGUgTGlzdGVuZXJGY3Q8VCBleHRlbmRzIEV2ZW50PiA9IChldjogVCkgPT4gdm9pZDtcbnR5cGUgTGlzdGVuZXJPYmo8VCBleHRlbmRzIEV2ZW50PiA9IHsgaGFuZGxlRXZlbnQ6IExpc3RlbmVyRmN0PFQ+IH07XG50eXBlIExpc3RlbmVyPFQgZXh0ZW5kcyBFdmVudD4gPSBMaXN0ZW5lckZjdDxUPnxMaXN0ZW5lck9iajxUPjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50VGFyZ2V0MjxFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBFdmVudD4+IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuXG5cdG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBjYWxsYmFjazogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgb3B0aW9ucz86IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhbik6IHZvaWQge1xuXHRcdFxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblx0fVxuXG5cdG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQ8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4oZXZlbnQ6IEV2ZW50c1tUXSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBzdXBlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fVxuXG5cdG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGlzdGVuZXI6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQge1xuXG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0c3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbUV2ZW50MjxUIGV4dGVuZHMgc3RyaW5nLCBBcmdzPiBleHRlbmRzIEN1c3RvbUV2ZW50PEFyZ3M+IHtcblxuXHRjb25zdHJ1Y3Rvcih0eXBlOiBULCBhcmdzOiBBcmdzKSB7XG5cdFx0c3VwZXIodHlwZSwge2RldGFpbDogYXJnc30pO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2V0IHR5cGUoKTogVCB7IHJldHVybiBzdXBlci50eXBlIGFzIFQ7IH1cbn1cblxudHlwZSBJbnN0YW5jZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4+ID0ge1xuXHRbSyBpbiBrZXlvZiBUXTogSW5zdGFuY2VUeXBlPFRbS10+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXaXRoRXZlbnRzPFQgZXh0ZW5kcyBvYmplY3QsIEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4gPihldjogQ29uc3RydWN0b3I8VD4sIF9ldmVudHM6IEV2ZW50cykge1xuXG5cdHR5cGUgRXZ0cyA9IEluc3RhbmNlczxFdmVudHM+O1xuXG5cdGlmKCAhIChldiBpbnN0YW5jZW9mIEV2ZW50VGFyZ2V0KSApXG5cdFx0cmV0dXJuIGV2IGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+PjtcblxuXHQvLyBpcyBhbHNvIGEgbWl4aW5cblx0Ly8gQHRzLWlnbm9yZVxuXHRjbGFzcyBFdmVudFRhcmdldE1peGlucyBleHRlbmRzIGV2IHtcblxuXHRcdCNldiA9IG5ldyBFdmVudFRhcmdldDI8RXZ0cz4oKTtcblxuXHRcdGFkZEV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmFkZEV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdGRpc3BhdGNoRXZlbnQoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmRpc3BhdGNoRXZlbnQoLi4uYXJncyk7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gRXZlbnRUYXJnZXRNaXhpbnMgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgU2hhZG93Um9vdCB0b29scyA9PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRNYXRjaGVzKGV2OiBFdmVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXG5cdGxldCBlbGVtZW50cyA9IGV2LmNvbXBvc2VkUGF0aCgpLnNsaWNlKDAsLTIpLmZpbHRlcihlID0+ICEgKGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSApLnJldmVyc2UoKSBhcyBIVE1MRWxlbWVudFtdO1xuXG5cdGZvcihsZXQgZWxlbSBvZiBlbGVtZW50cyApXG5cdFx0aWYoZWxlbS5tYXRjaGVzKHNlbGVjdG9yKSApXG5cdFx0XHRyZXR1cm4gZWxlbTsgXG5cblx0cmV0dXJuIG51bGw7XG59IiwiXG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRzIHt9O1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN5bmMsIHdoZW5Jbml0aWFsaXplZCB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICAvLyBhc3luY1xuICAgICAgICBxcyA6IHR5cGVvZiBxcztcbiAgICAgICAgcXNvOiB0eXBlb2YgcXNvO1xuICAgICAgICBxc2E6IHR5cGVvZiBxc2E7XG4gICAgICAgIHFzYzogdHlwZW9mIHFzYztcblxuICAgICAgICAvLyBzeW5jXG4gICAgICAgIHFzU3luYyA6IHR5cGVvZiBxc1N5bmM7XG4gICAgICAgIHFzYVN5bmM6IHR5cGVvZiBxc2FTeW5jO1xuICAgICAgICBxc2NTeW5jOiB0eXBlb2YgcXNjU3luYztcblxuXHRcdGNsb3Nlc3Q6IHR5cGVvZiBjbG9zZXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzc19zZWxlY3RvcihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtsaXNzX3NlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0bGV0IHJlc3VsdCA9IGF3YWl0IHFzbzxUPihzZWxlY3RvciwgcGFyZW50KTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gcmVzdWx0IVxufVxuXG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc288TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VFtdPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXVtdID47XG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8VD4+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHByb21pc2VzW2lkeCsrXSA9IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc2M8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPihyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUW107XG5mdW5jdGlvbiBxc2FTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dW107XG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cmVzdWx0W2lkeCsrXSA9IGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFQ7XG5mdW5jdGlvbiBxc2NTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KHJlc3VsdCk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjbG9zZXN0PEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50KSB7XG5cblx0d2hpbGUodHJ1ZSkge1xuXHRcdHZhciByZXN1bHQgPSBlbGVtZW50LmNsb3Nlc3Q8RT4oc2VsZWN0b3IpO1xuXG5cdFx0aWYoIHJlc3VsdCAhPT0gbnVsbClcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuXHRcdGlmKCAhIChcImhvc3RcIiBpbiByb290KSApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGVsZW1lbnQgPSAocm9vdCBhcyBTaGFkb3dSb290KS5ob3N0O1xuXHR9XG59XG5cblxuLy8gYXN5bmNcbkxJU1MucXMgID0gcXM7XG5MSVNTLnFzbyA9IHFzbztcbkxJU1MucXNhID0gcXNhO1xuTElTUy5xc2MgPSBxc2M7XG5cbi8vIHN5bmNcbkxJU1MucXNTeW5jICA9IHFzU3luYztcbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG5MSVNTLmNsb3Nlc3QgPSBjbG9zZXN0OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL0xpZmVDeWNsZVwiO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vL1RPRE86IGV2ZW50cy50c1xuLy9UT0RPOiBnbG9iYWxDU1NSdWxlc1xuZXhwb3J0IHtMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5pbXBvcnQgXCIuL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnNcIjtcblxuZXhwb3J0IHtTaGFkb3dDZmd9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB7bGlzcywgbGlzc1N5bmN9IGZyb20gXCIuL2hlbHBlcnMvYnVpbGRcIjtcbmV4cG9ydCB7ZXZlbnRNYXRjaGVzLCBXaXRoRXZlbnRzLCBFdmVudFRhcmdldDIsIEN1c3RvbUV2ZW50Mn0gZnJvbSAnLi9oZWxwZXJzL2V2ZW50cyc7XG5leHBvcnQge2h0bWx9IGZyb20gXCIuL3V0aWxzXCI7XG5leHBvcnQgZGVmYXVsdCBMSVNTO1xuXG4vLyBmb3IgZGVidWcuXG5leHBvcnQge19leHRlbmRzfSBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbi8vIHJlcXVpcmVkIGZvciBhdXRvIG1vZGUgaXQgc2VlbXMuXG4vLyBAdHMtaWdub3JlXG5nbG9iYWxUaGlzLkxJU1MgPSBMSVNTOyIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJ1xufTtcblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0ge1xuICAgICAgICBleHRlbmRzOiBFeHRlbmRzQ3RyLCAvLyBKUyBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLCAgIC8vIEhUTUwgSG9zdFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG59ICYgQ29udGVudEdlbmVyYXRvcl9PcHRzO1xuXG4vL1RPRE86IHJld3JpdGUuLi5cbi8vIExJU1NDb250cm9sZXJcblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlckNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IEluc3RhbmNlVHlwZTxMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gVCBleHRlbmRzIExJU1NDb250cm9sZXI8XG4gICAgICAgICAgICBpbmZlciBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgICAgICA+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLEhvc3RDc3RyPiA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NDb250cm9sZXIgPyBMSVNTQ29udHJvbGVyMkxJU1NDb250cm9sZXJDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyID0gTElTU0NvbnRyb2xlcj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjtcblxuLy8gbGlnaHRlciBMSVNTSG9zdCBkZWYgdG8gYXZvaWQgdHlwZSBpc3N1ZXMuLi5cbmV4cG9ydCB0eXBlIExIb3N0PEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA9IHtcblxuICAgIGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgQ1NTU2VsZWN0b3I6IHN0cmluZztcblxufSAmIEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbmV4cG9ydCB0eXBlIExIb3N0Q3N0cjxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG4gICAgbmV3KC4uLmFyZ3M6IGFueSk6IExIb3N0PEhvc3RDc3RyPjtcblxuICAgIENmZzoge1xuICAgICAgICBob3N0ICAgICAgICAgICAgIDogSG9zdENzdHIsXG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbiAgICAgICAgYXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuICAgIH1cblxufSAmIEhvc3RDc3RyOyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGlmKCBDbGFzcyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBDbGFzcyA9IENsYXNzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBIVE1MRWxlbWVudDtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblxuICAgIGxldCBjdXJzb3IgPSBDbGFzcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2hpbGUgKGN1cnNvci5fX3Byb3RvX18gIT09IEhUTUxFbGVtZW50KVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGN1cnNvciA9IGN1cnNvci5fX3Byb3RvX187XG5cbiAgICAvLyBkaXJlY3RseSBpbmhlcml0IEhUTUxFbGVtZW50XG4gICAgaWYoICEgY3Vyc29yLm5hbWUuc3RhcnRzV2l0aCgnSFRNTCcpICYmICEgY3Vyc29yLm5hbWUuZW5kc1dpdGgoJ0VsZW1lbnQnKSApXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaHRtbHRhZyA9IGN1cnNvci5uYW1lLnNsaWNlKDQsIC03KTtcblxuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG4vKlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG4qL1xuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCIvKlxuIDEuIG92ZXJyaWRlIGZldGNoL2ltcG9ydC93aGF0ZXZlclxuICAgIC0+IGV4cGxpcXVlciBsZSBmb25jdGlvbm5lbWVudCAoc2lub24gamUgdmFpcyBtJ3kgcGVyZHJlKVxuICAgIC0+IHYzIGRpcmVjdG9yeSA/XG4gICAgICAgIC0+IHNvdXJjZXMgaW5zaWRlID9cbiAyLiBDU1NcbiAzLiBIVE1MIGluIGZjdCBhdHRyXG4gNC4gRmN0IGludGVybmVcbiA1LiBDb25zZWlsc1xuIDYuIEpTLi4uIFxuIDcuIHB1cmUgSlMgKD8pXG4qL1xuXG4vLyBleGFtcGxlIDogcGxheWdyb3VuZCB2MyAoPylcbiAgICAvLyBsaXNzLXZlcnNpb249XCJ2M1wiXG4gICAgLy8gbGlzcy12Mz1cImF1dG9cIiAoYydlc3QgbGEgdjMgcXUnaWwgZmF1dCB1dGlsaXNlcilcbi8vIHVuaXQgdGVzdCBkZSBsJ2V4ZW1wbGUgYWpvdXTDqVxuLy8gPT4gY29udGludWUgb3RoZXIgZXhhbXBsZXNcblxuLy8gVE9ETzogaW4gcGxheWdyb3VuZCBicnl0aG9uIHNyYyBvbmx5IGlmIGJyeXRob25cbi8vIFRPRE86IHJlbW92ZSB2MiAoYXV0b2RpcikgKyB2MiBmY3RzXG5cbi8vIERPQ1NcbiAgICAvLyBkb2MvZnIvYXV0by5tZFxuICAgIC8vIEN0cmxlci9MaWZlQ3ljbGVcbiAgICAvLyBkb2MvZW4gKG9icyA/KVxuICAgIC8vIFJFQURNRS5tZFxuXG4vLyBUT0RPOiBhdXRvLW1vZGUgKGFsbCB3aXRoIGF1dG8uLi4pXG4gICAgLy8gVE9ETzogdHJ1ZSBhdXRvLW1vZGUgaW4gdGVzdHMgKGNoYW5nZSBCcnl0aG9uLi4uKVxuICAgICAgICAvLyB0ZXN0djNcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgSFRNTCBpbiB0ZXN0IGlmIChudWxsKS4uLlxuICAgICAgICAgICAgLy8gbGlrZSBwbGF5Z3JvdW5kICg/KSA9PiBkaWZmZXJlbnQgZmlsZSBmb3IgY2xlYW5lciBjb2RlID9cbiAgICAvLyBmaWxlcz1cImpzLHRzLGJyeSxodG1sXCIgLSBkZWZhdWx0IChodG1sK2NzcytqcykgP1xuICAgICAgICAvLyBvdmVycmlkZSBmZXRjaCAob2ZjKSBbc3cgb3ZlcnJpZGUgP11cbiAgICAgICAgLy8gYnVpbGQgZGVmYXVsdCBqcyAod2l0aCAke30pIHN1cHBvcnRcblxuLy8gZG9jcyAoKyBleGFtcGxlcyBwbGF5Z3JvdW5kL3Rlc3RzIC8vIEJyeS9KUykuXG4gICAgLy8gbm9uLWF1dG8gZmlyc3QuXG4gICAgICAgIC8vIGV4dGVuZHMgKExJU1MgQmFzZSlcbiAgICAgICAgLy8gTElTUyh7fSkgb3B0cy5cbiAgICAgICAgLy8gZGVmaW5lLlxuICAgICAgICAvLyBBUEkuLi4gZm9yIGJldHRlciBzdWdnZXN0aW9ucy5cbiAgICAgICAgLy8gcnVsZXMuLi5cblxuLy8gVE9ETzogY29udGVudEdlbmVyYXRvclxuLy8gVE9ETzogZG9jcyAob2ZjKVxuXG4vLyBUT0RPOiB1dGlscyArIHNpZ25hbHMgKyBET01Db250ZW50TG9hZGVkIGJlZm9yZS4uLiArIHVwZ3JhZGUgY2hpbGRyZW4gaW4gY3N0ciA/XG4gICAgLy8gYnVpbGRcbiAgICAvLyByZW1vdmUgZXZlbnRzICsgcXMgP1xuICAgIC8vIFRPRE86IHN0YXRlIChpbnRlcm5hbCBzdGF0ZSlcbiAgICAvLyBUT0RPOiBibGlzc1xuICAgIC8vIFRPRE86IGNzcy0tW3Byb3BfbmFtZV0uXG4gICAgLy8gVE9ETzogc2hhcmVkQ1NTXG5cbi8vIFRPRE86IHVwZ3JhZGVcbiAgICAvLyBUT0RPOiBnZXQgdXBncmFkZWQgP1xuICAgIC8vIFRPRE86IHVwZ3JhZGUgKysgPiBkZWZpbml0aW9uIG9yZGVyIGlmIGluc2lkZSBjaGlsZCBhbmQgYXZhaWxhYmxlLlxuICAgIC8vIFRPRE86IGRlZmluZWQgOiB2aXNpYmlsaXR5OiBoaWRkZW4gdW50aWwgZGVmaW5lZCA/XG4gICAgICAgIC8vIFRPRE86IGxvYWRlciBjdXN0b21FbGVtZW50IChyZXBsYWNlV2l0aCA/KVxuXG5cbi8vIFRPRE86IHBsYXlncm91bmRcbiAgICAvLyBUT0RPOiBmYWN1bHRhdGl2ZSBIVE1MIGluIGVkaXRvci9wbGF5Z3JvdW5kXG4gICAgLy8gVE9ETzogc2hvdyBlcnJvci4uLlxuICAgIC8vIFRPRE86IGRlYm91bmNlL3Rocm90dGxlIGVkaXRvci4uLlxuXG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi4vVjIvQ29udGVudEdlbmVyYXRvclwiO1xuXG4vLyBPbmx5IGV4dGVuZHMgSFRNTEVsZW1lbnQsIGVsc2UgaXNzdWVzIDpcbiAgICAvLyBub3Qgc3VwcG9ydGVkIGJ5IGFsbCBicm93c2Vycy5cbiAgICAvLyBtYXkgbm90IHN1cHBvcnQgc2hhZG93Um9vdCAtPiB0aGVuIGluaXQgY2FuIGJlIHRyb3VibGVzb21lLlxuICAgIC8vIGJlIGNhcmVmdWwgd2hlbiB0cnlpbmcgdG8gYnVpbGQgOiBjcmVhdGVFbGVtZW50IGNhbGwgY3N0ci5cbiAgICAvLyBpZiBwb3NzaWJsZSwgZG8gbm90IGV4cGVjdCBjb250ZW50IChhdHRyIGdvb2QgPyBubyBjaGlsZHJlbiA/KVxuXG4vLyBXYWl0IERPTSBDb250ZW50TG9hZGVkLCBlbHNlIHdpbGwgbGFjayBjaGlsZHJlbiAoZS5nLiBibG9ja2luZyBzY3JpcHQpXG4vLyBVcGdyYWRlIG9yZGVyIGlzIGRlZiBvcmRlciA9PiBkbyBub3QgZGVwZW5kIGZhdGhlci9jaGlsZHJlbi5cbiAgICAvLyBmYXRoZXIgc2hvdWxkIHVwZ3JhZGUgY2hpbGRyZW4gPyAoYXMgaXQgbGlzdGVuIGl0cyBjaGlsZHJlbikgP1xuICAgICAgICAvLyAoY2FuJ3QgbGlzdGVuIGNoaWxkcmVuIGZhdGhlcilcbiAgICAgICAgLy8gdXBncmFkZSBmY3RcbiAgICAgICAgLy8gY2hpbGRyZW4gY2FuJ3QgYXNzdW1lIGhlIGlzIGluIGEgKGNvbXBhdGlibGUpIGZhdGhlci5cbiAgICAgICAgICAgIC8vIGF0dGFjaCgpL2RldGFjaCgpIC8vIG9uQXR0YWNoKCkgLyBvbkRldGFjaCgpXG4gICAgICAgICAgICAgICAgLy8gYWRkID9cblxuLy8gZGVmZXIvYWZ0ZXIgRE9NQ29udGVudExvYWRlZCBmb3IgcXVlcnlpbmcgRE9NXG4vLyBXVEYgZm9yIGN1c3RvbSBlbGVtZW50cz8/P1xuXG5jbGFzcyBMSVNTQmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSBjb250ZW50OiBTaGFkb3dSb290O1xuXG4gICAgY29uc3RydWN0b3IoZ2VuZXJhdG9yPzogQ29udGVudEdlbmVyYXRvcikge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiBcIm9wZW5cIn0pO1xuICAgICAgICBpZihnZW5lcmF0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGdlbmVyYXRvci5maWxsQ29udGVudCh0aGlzLmNvbnRlbnQpO1xuICAgIH1cblxuICAgIC8vIGZvciBiZXR0ZXIgc3VnZ2VzdGlvbnNcbiAgICBnZXQgY29udHJvbGVyKCk6IE9taXQ8dGhpcywga2V5b2YgSFRNTEVsZW1lbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IGhvc3QoKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbnR5cGUgQ3N0cjxUPiA9IG5ldyguLi5hcmdzOmFueVtdKSA9PiBUXG50eXBlIExJU1N2M19PcHRzPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID4gPSB7XG4gICAgY29udGVudF9nZW5lcmF0b3I6IFQsXG59ICYgQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+WzBdO1xuXG4vLyAgYnVpbGRlclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTElTU3YzPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID0gQ3N0cjxDb250ZW50R2VuZXJhdG9yPj4ob3B0czogUGFydGlhbDxMSVNTdjNfT3B0czxUPj4gPSB7fSkge1xuICAgIFxuICAgIGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gb3B0cy5jb250ZW50X2dlbmVyYXRvciA/PyBDb250ZW50R2VuZXJhdG9yO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yID0gbmV3IGNvbnRlbnRfZ2VuZXJhdG9yKG9wdHMpO1xuICAgIFxuICAgIHJldHVybiBjbGFzcyBfTElTUyBleHRlbmRzIExJU1NCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoZ2VuZXJhdG9yID0gX2dlbmVyYXRvcikge1xuICAgICAgICAgICAgc3VwZXIoZ2VuZXJhdG9yKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB2MiBmcm9tIFwiLi9WMlwiO1xuaW1wb3J0IHYzIGZyb20gXCIuL1YzXCI7XG5cbmV4cG9ydCBjb25zdCBMSVNTID0ge1xuICAgIHYyLFxuICAgIHYzXG59XG5leHBvcnQgZGVmYXVsdCB2MjsiXSwibmFtZXMiOlsiZ2V0U2hhcmVkQ1NTIiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzRE9NQ29udGVudExvYWRlZCIsImlzU2hhZG93U3VwcG9ydGVkIiwid2hlbkRPTUNvbnRlbnRMb2FkZWQiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJzaGFyZWRDU1MiLCJDb250ZW50R2VuZXJhdG9yIiwiZGF0YSIsImNvbnN0cnVjdG9yIiwiaHRtbCIsImNzcyIsInNoYWRvdyIsInByZXBhcmVIVE1MIiwicHJlcGFyZUNTUyIsInNldFRlbXBsYXRlIiwidGVtcGxhdGUiLCJpc1JlYWR5Iiwid2hlblJlYWR5IiwiZmlsbENvbnRlbnQiLCJpbmplY3RDU1MiLCJhcHBlbmQiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwiZ2VuZXJhdGUiLCJob3N0IiwidGFyZ2V0IiwiaW5pdFNoYWRvdyIsInNoYWRvd01vZGUiLCJOT05FIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsInJlcGxhY2VDaGlsZHJlbiIsImNhbkhhdmVTaGFkb3ciLCJFcnJvciIsIm1vZGUiLCJPUEVOIiwiYXR0YWNoU2hhZG93IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZSIsInByb2Nlc3NDU1MiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInVuZGVmaW5lZCIsInN0ciIsInRyaW0iLCJpbm5lckhUTUwiLCJIVE1MRWxlbWVudCIsInN0eWxlc2hlZXRzIiwiU2hhZG93Um9vdCIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsInB1c2giLCJjc3NzZWxlY3RvciIsIkNTU1NlbGVjdG9yIiwiaGFzIiwic2V0QXR0cmlidXRlIiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJyZXBsYWNlIiwiaGVhZCIsImFkZCIsImJ1aWxkTElTU0hvc3QiLCJzZXRDc3RyQ29udHJvbGVyIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJMSVNTIiwiYXJncyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsImNvbnRlbnRfZ2VuZXJhdG9yIiwiTElTU0NvbnRyb2xlciIsIkhvc3QiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJuYW1lIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImNvbm5lY3RlZENhbGxiYWNrIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJpc0Nvbm5lY3RlZCIsIl9Ib3N0IiwiaWQiLCJfX2NzdHJfY29udHJvbGVyIiwiTGlzcyIsImhvc3RDc3RyIiwiY29udGVudF9nZW5lcmF0b3JfY3N0ciIsIkxJU1NIb3N0IiwiQ2ZnIiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiQ29udHJvbGVyIiwiY29udHJvbGVyIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJwYXJhbXMiLCJpbml0IiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwidGhlbiIsInByb21pc2UiLCJyZXNvbHZlIiwiUHJvbWlzZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsImRlZmluZSIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsImJyeV9jbGFzcyIsIl9fYmFzZXNfXyIsImZpbHRlciIsIl9fbmFtZV9fIiwiX2pzX2tsYXNzIiwiJGpzX2Z1bmMiLCJfX0JSWVRIT05fXyIsIiRjYWxsIiwiJGdldGF0dHJfcGVwNjU3IiwiaHRtbHRhZyIsIkNsYXNzIiwib3B0cyIsImdldE5hbWUiLCJlbGVtZW50IiwiRWxlbWVudCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJpc0RlZmluZWQiLCJlbGVtIiwiZ2V0Iiwid2hlbkRlZmluZWQiLCJnZXRIb3N0Q3N0ciIsImdldEhvc3RDc3RyU3luYyIsImlzVXBncmFkZWQiLCJ1cGdyYWRlU3luYyIsIndoZW5VcGdyYWRlZCIsImdldENvbnRyb2xlciIsImdldENvbnRyb2xlclN5bmMiLCJpbml0aWFsaXplU3luYyIsImdldENvbnRyb2xlckNzdHIiLCJnZXRDb250cm9sZXJDc3RyU3luYyIsIl93aGVuVXBncmFkZWQiLCJnZXRIb3N0Iiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImdldEhvc3RTeW5jIiwiU3RhdGVzIiwiX0xJU1MiLCJJTElTUyIsImNmZyIsImFzc2lnbiIsIkV4dGVuZGVkTElTUyIsIkxJU1N2MyIsIktub3duVGFncyIsInNjcmlwdCIsIkRFRkFVTFRfQ0RJUiIsImF1dG9sb2FkIiwiY2RpciIsIlNXIiwic3dfcGF0aCIsImNvbnNvbGUiLCJ3YXJuIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic2NvcGUiLCJlcnJvciIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiYWRkVGFnIiwiYWRkVGFnVjIiLCJhZGRUYWdWMyIsImJyeXRob24iLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsInRhZyIsImltcG9ydENvbXBvbmVudCIsImltcG9ydENvbXBvbmVudFYzIiwiZGVmaW5lV2ViQ29tcG9uZW50VjMiLCJmaWxlcyIsImtsYXNzIiwiTElTU0F1dG9fQ29udGVudEdlbmVyYXRvciIsImRlZmluZVdlYkNvbXBvbmVudCIsImNfanMiLCJmaWxlIiwiQmxvYiIsInR5cGUiLCJ1cmwiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJvbGRyZXEiLCJyZXF1aXJlIiwic3RhcnRzV2l0aCIsImZpbGVuYW1lIiwic2xpY2UiLCJkZWZhdWx0IiwiX2ZldGNoVGV4dCIsInVyaSIsImlzTGlzc0F1dG8iLCJvcHRpb25zIiwiaGVhZGVycyIsInJlc3BvbnNlIiwiZmV0Y2giLCJzdGF0dXMiLCJhbnN3ZXIiLCJ0ZXh0IiwiX2ltcG9ydCIsImxvZyIsImNvbnZlcnRlciIsImVuY29kZUhUTUwiLCJ0ZXh0Q29udGVudCIsIm1hdGNoIiwiY3NzX2F0dHJzIiwiZ2V0QXR0cmlidXRlTmFtZXMiLCJjc3NfYXR0ciIsInNldFByb3BlcnR5IiwiaW1wb3J0Q29tcG9uZW50cyIsImNvbXBvbmVudHMiLCJyZXN1bHRzIiwiYnJ5X3dyYXBwZXIiLCJjb21wb19kaXIiLCJleHQiLCJjb2RlIiwibGlzcyIsIkRvY3VtZW50RnJhZ21lbnQiLCJsaXNzU3luYyIsIkV2ZW50VGFyZ2V0MiIsIkV2ZW50VGFyZ2V0IiwiY2FsbGJhY2siLCJkaXNwYXRjaEV2ZW50IiwiZXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJDdXN0b21FdmVudDIiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIldpdGhFdmVudHMiLCJldiIsIl9ldmVudHMiLCJFdmVudFRhcmdldE1peGlucyIsImV2ZW50TWF0Y2hlcyIsInNlbGVjdG9yIiwiZWxlbWVudHMiLCJjb21wb3NlZFBhdGgiLCJyZXZlcnNlIiwibWF0Y2hlcyIsImxpc3Nfc2VsZWN0b3IiLCJfYnVpbGRRUyIsInRhZ25hbWVfb3JfcGFyZW50IiwicGFyZW50IiwicXMiLCJyZXN1bHQiLCJxc28iLCJxc2EiLCJpZHgiLCJwcm9taXNlcyIsImFsbCIsInFzYyIsInJlcyIsImNsb3Nlc3QiLCJxc1N5bmMiLCJxc2FTeW5jIiwicXNjU3luYyIsInJvb3QiLCJnZXRSb290Tm9kZSIsImdsb2JhbFRoaXMiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiY3Vyc29yIiwiX19wcm90b19fIiwiZW5kc1dpdGgiLCJDQU5fSEFWRV9TSEFET1ciLCJyZWFkeVN0YXRlIiwic3RyaW5nIiwiaSIsImZpcnN0Q2hpbGQiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJMSVNTQmFzZSIsImdlbmVyYXRvciIsIl9nZW5lcmF0b3IiLCJ2MiIsInYzIl0sInNvdXJjZVJvb3QiOiIifQ==