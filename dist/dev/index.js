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
        for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition instanceof HTMLUnknownElement) addTag(addition);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBQ3RHO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EsR0FBRztVQUNIO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxHQUFHO1VBQ0g7VUFDQSxFQUFFO1VBQ0Y7VUFDQTs7Ozs7VUNoRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7O1NFTkE7U0FDQTtTQUNBO1NBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MSVNTQ29udHJvbGVyLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTElTU0hvc3QudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MaWZlQ3ljbGUvREVGSU5FRC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xpZmVDeWNsZS9JTklUSUFMSVpFRC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xpZmVDeWNsZS9SRUFEWS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xpZmVDeWNsZS9VUEdSQURFRC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xpZmVDeWNsZS9zdGF0ZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9jb3JlL0xpZmVDeWNsZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2V4dGVuZHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL0xJU1NBdXRvLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9idWlsZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvZXZlbnRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9xdWVyeVNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0NvbnRlbnRHZW5lcmF0b3JzL0F1dG9Db250ZW50R2VuZXJhdG9yLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvQ29udGVudEdlbmVyYXRvcnMvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0xJU1MudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9MSVNTL0xJU1NCYXNlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvTElTUy9MSVNTRnVsbC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2RlZmluZS9hdXRvbG9hZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL2RlZmluZS9kZWZpbmUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9kZWZpbmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9kZWZpbmUvaXNEZWZpbmVkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvZGVmaW5lL3doZW5EZWZpbmVkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9ET00vaXNQYWdlTG9hZGVkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvRE9NL3doZW5QYWdlTG9hZGVkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvZW5jb2RlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvZXhlY3V0ZS9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL2V4ZWN1dGUvanMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9uZXR3b3JrL2ZldGNoVGV4dC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL25ldHdvcmsvcmVxdWlyZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL25ldHdvcmsvcmVzc291cmNlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvcGFyc2Vycy9odG1sLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvdXRpbHMvcGFyc2Vycy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3BhcnNlcnMvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9wYXJzZXJzL3RlbXBsYXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9hc3luYyBtb2R1bGUiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2hhcmVkQ1NTIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IExIb3N0LCBTaGFkb3dDZmcgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCBpc1NoYWRvd1N1cHBvcnRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG50eXBlIEhUTUwgPSBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZztcbnR5cGUgQ1NTICA9IHN0cmluZ3xDU1NTdHlsZVNoZWV0fEhUTUxTdHlsZUVsZW1lbnQ7XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHtcbiAgICBodG1sICAgPzogRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmcsXG4gICAgY3NzICAgID86IENTUyB8IHJlYWRvbmx5IENTU1tdLFxuICAgIHNoYWRvdyA/OiBTaGFkb3dDZmd8bnVsbFxufVxuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yQ3N0ciA9IHsgbmV3KG9wdHM6IENvbnRlbnRHZW5lcmF0b3JfT3B0cyk6IENvbnRlbnRHZW5lcmF0b3IgfTtcblxuY29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuY29uc3Qgc2hhcmVkQ1NTID0gZ2V0U2hhcmVkQ1NTKCk7IC8vIGZyb20gTElTU0hvc3QuLi5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudEdlbmVyYXRvciB7XG5cbiAgICAjc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXTtcbiAgICAjdGVtcGxhdGUgICA6IEhUTUxUZW1wbGF0ZUVsZW1lbnR8bnVsbDtcbiAgICAjc2hhZG93ICAgICA6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgcHJvdGVjdGVkIGRhdGE6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgaHRtbCxcbiAgICAgICAgY3NzICAgID0gW10sXG4gICAgICAgIHNoYWRvdyA9IG51bGwsXG4gICAgfTogQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge30pIHtcblxuICAgICAgICB0aGlzLiNzaGFkb3cgICA9IHNoYWRvdztcbiAgICAgICAgdGhpcy4jdGVtcGxhdGUgPSB0aGlzLnByZXBhcmVIVE1MKGh0bWwpO1xuICAgIFxuICAgICAgICB0aGlzLiNzdHlsZXNoZWV0cyA9IHRoaXMucHJlcGFyZUNTUyhjc3MpO1xuXG4gICAgICAgIHRoaXMuI2lzUmVhZHkgICA9IGlzRE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICB0aGlzLiN3aGVuUmVhZHkgPSB3aGVuRE9NQ29udGVudExvYWRlZCgpO1xuXG4gICAgICAgIC8vVE9ETzogb3RoZXIgZGVwcy4uLlxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRUZW1wbGF0ZSh0ZW1wbGF0ZTogSFRNTFRlbXBsYXRlRWxlbWVudCkge1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cblxuICAgICN3aGVuUmVhZHk6IFByb21pc2U8dW5rbm93bj47XG4gICAgI2lzUmVhZHkgIDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNpc1JlYWR5O1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW5SZWFkeSgpIHtcblxuICAgICAgICBpZiggdGhpcy4jaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuI3doZW5SZWFkeTtcbiAgICAgICAgLy9UT0RPOiBkZXBzLlxuICAgICAgICAvL1RPRE86IENTUy9IVE1MIHJlc291cmNlcy4uLlxuXG4gICAgICAgIC8vIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG4gICAgICAgIC8vIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuICAgICAgICAvLyArIGNmIGF0IHRoZSBlbmQuLi5cbiAgICB9XG5cbiAgICBmaWxsQ29udGVudChzaGFkb3c6IFNoYWRvd1Jvb3QpIHtcbiAgICAgICAgdGhpcy5pbmplY3RDU1Moc2hhZG93LCB0aGlzLiNzdHlsZXNoZWV0cyk7XG5cbiAgICAgICAgc2hhZG93LmFwcGVuZCggdGhpcy4jdGVtcGxhdGUhLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpICk7XG5cbiAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShzaGFkb3cpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50fFNoYWRvd1Jvb3Qge1xuXG4gICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi4gICAgIFxuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaW5pdFNoYWRvdyhob3N0KTtcblxuICAgICAgICB0aGlzLmluamVjdENTUyh0YXJnZXQsIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy4jdGVtcGxhdGUhLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBpZiggaG9zdC5zaGFkb3dNb2RlICE9PSBTaGFkb3dDZmcuTk9ORSB8fCB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuICAgICAgICAgICAgdGFyZ2V0LnJlcGxhY2VDaGlsZHJlbihjb250ZW50KTtcblxuICAgICAgICAvL2lmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICYmIHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMClcblx0XHQvL1x0dGFyZ2V0LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cbiAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShob3N0KTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0U2hhZG93PEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCkge1xuXG4gICAgICAgIGNvbnN0IGNhbkhhdmVTaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KTtcbiAgICAgICAgaWYoIHRoaXMuI3NoYWRvdyAhPT0gbnVsbCAmJiB0aGlzLiNzaGFkb3cgIT09IFNoYWRvd0NmZy5OT05FICYmICEgY2FuSGF2ZVNoYWRvdyApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgICAgIGxldCBtb2RlID0gdGhpcy4jc2hhZG93O1xuICAgICAgICBpZiggbW9kZSA9PT0gbnVsbCApXG4gICAgICAgICAgICBtb2RlID0gY2FuSGF2ZVNoYWRvdyA/IFNoYWRvd0NmZy5PUEVOIDogU2hhZG93Q2ZnLk5PTkU7XG5cbiAgICAgICAgaG9zdC5zaGFkb3dNb2RlID0gbW9kZTtcblxuICAgICAgICBsZXQgdGFyZ2V0OiBIb3N0fFNoYWRvd1Jvb3QgPSBob3N0O1xuICAgICAgICBpZiggbW9kZSAhPT0gU2hhZG93Q2ZnLk5PTkUpXG4gICAgICAgICAgICB0YXJnZXQgPSBob3N0LmF0dGFjaFNoYWRvdyh7bW9kZX0pO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVDU1MoY3NzOiBDU1N8cmVhZG9ubHkgQ1NTW10pIHtcbiAgICAgICAgaWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcbiAgICAgICAgICAgIGNzcyA9IFtjc3NdO1xuXG4gICAgICAgIHJldHVybiBjc3MubWFwKGUgPT4gdGhpcy5wcm9jZXNzQ1NTKGUpICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NDU1MoY3NzOiBDU1MpIHtcblxuICAgICAgICBpZihjc3MgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KVxuICAgICAgICAgICAgcmV0dXJuIGNzcztcbiAgICAgICAgaWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG4gICAgICAgICAgICByZXR1cm4gY3NzLnNoZWV0ITtcbiAgICBcbiAgICAgICAgaWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICAgICAgICAgICAgc3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJcIik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVIVE1MKGh0bWw/OiBIVE1MKTogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsIHtcbiAgICBcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgICAgIGlmKGh0bWwgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcblxuICAgICAgICAvLyBzdHIyaHRtbFxuICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGh0bWwudHJpbSgpO1xuXG4gICAgICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggaHRtbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IClcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICB0ZW1wbGF0ZS5hcHBlbmQoaHRtbCk7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBpbmplY3RDU1M8SG9zdCBleHRlbmRzIExIb3N0Pih0YXJnZXQ6IFNoYWRvd1Jvb3R8SG9zdCwgc3R5bGVzaGVldHM6IGFueVtdKSB7XG5cbiAgICAgICAgaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTLCAuLi5zdHlsZXNoZWV0cyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjc3NzZWxlY3RvciA9IHRhcmdldC5DU1NTZWxlY3RvcjsgLy9UT0RPLi4uXG5cbiAgICAgICAgaWYoIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpIClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuICAgICAgICBsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG4gICAgICAgIGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG4gICAgICAgICAgICBmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG4gICAgICAgICAgICAgICAgaHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG4gICAgICAgIGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuICAgIH1cbn1cblxuLy8gaWRlbSBIVE1MLi4uXG4vKiBpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgYyA9IGF3YWl0IGM7XG4gICAgICAgICAgICBpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcbiAgICAgICAgICAgICAgICBjID0gYXdhaXQgYy50ZXh0KCk7XG5cbiAgICAgICAgICAgIHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuICAgICAgICB9KSgpKTtcblxuICAgICAgICByZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG4gICAgfVxuKi8iLCJpbXBvcnQgeyBMSG9zdENzdHIsIHR5cGUgQ2xhc3MsIHR5cGUgQ29uc3RydWN0b3IsIHR5cGUgTElTU19PcHRzIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCwgc2V0Q3N0ckNvbnRyb2xlciB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vKioqKi9cblxuaW50ZXJmYWNlIElDb250cm9sZXI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiB7XG5cdC8vIG5vbi12YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgaG9zdDogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuXHQvLyB2YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgaXNDb25uZWN0ZWQgIDpib29sZWFuO1xufTtcblx0Ly8gKyBwcm90ZWN0ZWRcblx0XHQvLyByZWFkb25seSAuY29udGVudDogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290O1xuXHQvLyB2YW5pbGxhIEpTXG5cdFx0Ly8gYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpOiB2b2lkO1xuXHRcdC8vIGNvbm5lY3RlZENhbGxiYWNrICAgKCk6IHZvaWQ7XG5cdFx0Ly8gZGlzY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZDtcblxuaW50ZXJmYWNlIElDb250cm9sZXJDc3RyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4ge1xuXHRuZXcoKTogSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+O1xuXG5cdC8vIHZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBvYnNlcnZlZEF0dHJpYnV0ZXM6IHN0cmluZ1tdO1xufVxuXHQvLyArIFwicHJpdmF0ZVwiXG5cdFx0Ly8gcmVhZG9ubHkgSG9zdDogSG9zdENzdHJcblxuZXhwb3J0IHR5cGUgQ29udHJvbGVyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4gPSBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4gJiBJbnN0YW5jZVR5cGU8RXh0ZW5kc0NzdHI+O1xuXG5leHBvcnQgdHlwZSBDb250cm9sZXJDc3RyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4gPSBJQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+ICYgRXh0ZW5kc0NzdHI7XG5cbi8qKioqL1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4oYXJnczogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPj4gPSB7fSkge1xuXG5cdGxldCB7XG5cdFx0LyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG5cdFx0ZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgICAgICBhcyB1bmtub3duIGFzIEV4dGVuZHNDc3RyLFxuXHRcdGhvc3QgICAgICAgICAgICAgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0XG5cdFx0Y29udGVudF9nZW5lcmF0b3IgPSBDb250ZW50R2VuZXJhdG9yLFxuXHR9ID0gYXJncztcblx0XG5cdGNsYXNzIExJU1NDb250cm9sZXIgZXh0ZW5kcyBfZXh0ZW5kcyBpbXBsZW1lbnRzIElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPntcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKSB7XG5cdFx0XHRcdHNldENzdHJDb250cm9sZXIodGhpcyk7XG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCguLi5hcmdzKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHQvL1RPRE86IGdldCB0aGUgcmVhbCB0eXBlID9cblx0XHRwcm90ZWN0ZWQgZ2V0IGNvbnRlbnQoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0LmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW107XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHt9XG5cblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmhvc3QuaXNDb25uZWN0ZWQ7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IEluc3RhbmNlVHlwZTxMSG9zdENzdHI8SG9zdENzdHI+Pjtcblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgc3RhdGljIF9Ib3N0OiBMSG9zdENzdHI8SG9zdENzdHI+O1xuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZTogZnVjayBvZmYuXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KCB0aGlzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhvc3QsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udGVudF9nZW5lcmF0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJncyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gTElTU0NvbnRyb2xlciBzYXRpc2ZpZXMgQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+O1xufSIsImltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgU2hhZG93Q2ZnLCB0eXBlIExJU1NDb250cm9sZXJDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSBcIi4vTGlmZUN5Y2xlL3N0YXRlc1wiO1xuXG4vLyBMSVNTSG9zdCBtdXN0IGJlIGJ1aWxkIGluIGRlZmluZSBhcyBpdCBuZWVkIHRvIGJlIGFibGUgdG8gYnVpbGRcbi8vIHRoZSBkZWZpbmVkIHN1YmNsYXNzLlxuXG5sZXQgaWQgPSAwO1xuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZENTUygpIHtcblx0cmV0dXJuIHNoYXJlZENTUztcbn1cblxubGV0IF9fY3N0cl9jb250cm9sZXIgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJDb250cm9sZXIoXzogYW55KSB7XG5cdF9fY3N0cl9jb250cm9sZXIgPSBfO1xufVxuXG50eXBlIGluZmVySG9zdENzdHI8VD4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI8aW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiwgaW5mZXIgQiBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPyBCIDogbmV2ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFx0VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLCBVIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gaW5mZXJIb3N0Q3N0cjxUPiA+KFxuXHRcdFx0XHRcdFx0XHRMaXNzOiBULFxuXHRcdFx0XHRcdFx0XHQvLyBjYW4ndCBkZWR1Y2UgOiBjYXVzZSB0eXBlIGRlZHVjdGlvbiBpc3N1ZXMuLi5cblx0XHRcdFx0XHRcdFx0aG9zdENzdHI6IFUsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHI6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuXHRcdFx0XHRcdFx0XHRhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG5cdFx0XHRcdFx0XHQpIHtcblxuXHRjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcl9jc3RyKGFyZ3MpO1xuXG5cdHR5cGUgSG9zdENzdHIgPSBVO1xuICAgIHR5cGUgSG9zdCAgICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdGNsYXNzIExJU1NIb3N0IGV4dGVuZHMgaG9zdENzdHIge1xuXG5cdFx0c3RhdGljIHJlYWRvbmx5IENmZyA9IHtcblx0XHRcdGhvc3QgICAgICAgICAgICAgOiBob3N0Q3N0cixcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBjb250ZW50X2dlbmVyYXRvcl9jc3RyLFxuXHRcdFx0YXJnc1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQ29udHJvbGVyID0gTGlzcztcblxuXHRcdCNjb250cm9sZXI6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgY29udHJvbGVyKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXIgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHQvL1RPRE86IGdldCByZWFsIFRTIHR5cGUgP1xuXHRcdCNwYXJhbXM6IGFueVtdO1xuXHRcdGluaXRpYWxpemUoLi4ucGFyYW1zOiBhbnlbXSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRpZiggcGFyYW1zLmxlbmd0aCAhPT0gMCApIHtcblx0XHRcdFx0aWYoIHRoaXMuI3BhcmFtcy5sZW5ndGggIT09IDAgKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ3N0ciBwYXJhbXMgaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZCAhJyk7XG5cdFx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jY29udHJvbGVyID0gdGhpcy5pbml0KCk7XG5cblx0XHRcdGlmKCB0aGlzLmlzQ29ubmVjdGVkIClcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXI7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQvLyNpbnRlcm5hbHMgPSB0aGlzLmF0dGFjaEludGVybmFscygpO1xuXHRcdC8vI3N0YXRlcyAgICA9IHRoaXMuI2ludGVybmFscy5zdGF0ZXM7XG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdCA9IHRoaXMgYXMgSG9zdDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdG92ZXJyaWRlIGF0dGFjaFNoYWRvdyhpbml0OiBTaGFkb3dSb290SW5pdCk6IFNoYWRvd1Jvb3Qge1xuXHRcdFx0Y29uc3Qgc2hhZG93ID0gc3VwZXIuYXR0YWNoU2hhZG93KGluaXQpO1xuXG5cdFx0XHQvLyBAdHMtaWdub3JlIGNsb3NlZCBJUyBhc3NpZ25hYmxlIHRvIHNoYWRvd01vZGUuLi5cblx0XHRcdHRoaXMuc2hhZG93TW9kZSA9IGluaXQubW9kZTtcblxuXHRcdFx0dGhpcy4jY29udGVudCA9IHNoYWRvdztcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHNoYWRvdztcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0IGhhc1NoYWRvdygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLnNoYWRvd01vZGUgIT09ICdub25lJztcblx0XHR9XG5cblx0XHQvKioqIENTUyAqKiovXG5cblx0XHRnZXQgQ1NTU2VsZWN0b3IoKSB7XG5cblx0XHRcdGlmKHRoaXMuaGFzU2hhZG93IHx8ICEgdGhpcy5oYXNBdHRyaWJ1dGUoXCJpc1wiKSApXG5cdFx0XHRcdHJldHVybiB0aGlzLnRhZ05hbWU7XG5cblx0XHRcdHJldHVybiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gSW1wbCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHRjb25zdHJ1Y3RvciguLi5wYXJhbXM6IGFueVtdKSB7XG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfVVBHUkFERUQpO1xuXHRcdFx0Y29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19SRUFEWSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy4jcGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0Y29uc3QgY29udHJvbGVyID0gX19jc3RyX2NvbnRyb2xlcjtcblx0XHRcdF9fY3N0cl9jb250cm9sZXIgPSBudWxsO1xuXG5cdFx0XHRpZiggY29udHJvbGVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IGNvbnRyb2xlcjtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0aWYodGhpcy5jb250cm9sZXIgIT09IG51bGwpXG5cdFx0XHRcdHRoaXMuY29udHJvbGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApIHtcblx0XHRcdFx0dGhpcy5jb250cm9sZXIhLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogaW5zdGFuY2UgZGVwc1xuXHRcdFx0aWYoIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgY29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiBMSVNTSG9zdC5Db250cm9sZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuXHRcdH1cblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYodGhpcy4jY29udHJvbGVyKVxuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0c2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGwgPSBudWxsO1xuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXG5cdFx0XHQvLyBubyBuZWVkcyB0byBzZXQgdGhpcy4jY29udGVudCAoYWxyZWFkeSBob3N0IG9yIHNldCB3aGVuIGF0dGFjaFNoYWRvdylcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLmdlbmVyYXRlKHRoaXMpO1xuXG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cblx0XHRcdGlmKCB0aGlzLiNjb250cm9sZXIgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IG5ldyBMSVNTSG9zdC5Db250cm9sZXIoLi4udGhpcy4jcGFyYW1zKSBhcyBJbnN0YW5jZVR5cGU8VD47XG5cdFx0XHR9XG5cblx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19JTklUSUFMSVpFRCk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmNvbnRyb2xlcik7XG5cblx0XHRcdHJldHVybiB0aGlzLmNvbnRyb2xlcjtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0O1xufVxuXG5cbiIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+ID0gc3RyaW5nfFR8TElTU0hvc3RDc3RyPFQ+fEhUTUxFbGVtZW50O1xuXG4vLyBUT0RPLi4uXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD58YW55KSB7XG5cblx0bGV0IEhvc3Q6IExJU1NIb3N0Q3N0cjxUPiA9IENvbXBvbmVudENsYXNzIGFzIGFueTtcblxuXHQvLyBCcnl0aG9uIGNsYXNzXG5cdGxldCBicnlfY2xhc3M6IGFueSA9IG51bGw7XG5cdGlmKCBcIiRpc19jbGFzc1wiIGluIENvbXBvbmVudENsYXNzICkge1xuXG5cdFx0YnJ5X2NsYXNzID0gQ29tcG9uZW50Q2xhc3M7XG5cblx0XHRDb21wb25lbnRDbGFzcyA9IGJyeV9jbGFzcy5fX2Jhc2VzX18uZmlsdGVyKCAoZTogYW55KSA9PiBlLl9fbmFtZV9fID09PSBcIldyYXBwZXJcIilbMF0uX2pzX2tsYXNzLiRqc19mdW5jO1xuXHRcdChDb21wb25lbnRDbGFzcyBhcyBhbnkpLkhvc3QuQ29udHJvbGVyID0gY2xhc3Mge1xuXG5cdFx0XHQjYnJ5OiBhbnk7XG5cblx0XHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0dGhpcy4jYnJ5ID0gX19CUllUSE9OX18uJGNhbGwoYnJ5X2NsYXNzLCBbMCwwLDBdKSguLi5hcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0I2NhbGwobmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBfX0JSWVRIT05fXy4kY2FsbChfX0JSWVRIT05fXy4kZ2V0YXR0cl9wZXA2NTcodGhpcy4jYnJ5LCBuYW1lLCBbMCwwLDBdKSwgWzAsMCwwXSkoLi4uYXJncylcblx0XHRcdH1cblxuXHRcdFx0Z2V0IGhvc3QoKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIFwiaG9zdFwiLCBbMCwwLDBdKVxuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYnJ5X2NsYXNzW1wib2JzZXJ2ZWRBdHRyaWJ1dGVzXCJdO1xuXG5cdFx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmKCBcIkhvc3RcIiBpbiBDb21wb25lbnRDbGFzcyApXG5cdFx0SG9zdCA9IENvbXBvbmVudENsYXNzLkhvc3QgYXMgYW55O1xuXG4gICAgbGV0IGh0bWx0YWcgPSB1bmRlZmluZWQ7XG4gICAgaWYoIFwiQ2ZnXCIgaW4gSG9zdCkge1xuICAgICAgICBjb25zdCBDbGFzcyAgPSBIb3N0LkNmZy5ob3N0O1xuICAgICAgICBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG4gICAgICAgICAgICAgICAgOiB7ZXh0ZW5kczogaHRtbHRhZ307XG5cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgSG9zdCwgb3B0cyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudHxMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyfExJU1NIb3N0PExJU1NDb250cm9sZXI+fExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPiApOiBzdHJpbmcge1xuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBpZiggXCJob3N0XCIgaW4gZWxlbWVudClcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuaG9zdDtcbiAgICBpZiggZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBcbiAgICAgICAgaWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICAvLyBjc3RyXG5cblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQpXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lkhvc3QgYXMgdW5rbm93biBhcyBMSVNTSG9zdENzdHI8TElTU0NvbnRyb2xlcj47XG5cbiAgICBjb25zdCBuYW1lID0gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZSggZWxlbWVudCApO1xuICAgIGlmKG5hbWUgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgaXMgbm90IGRlZmluZWQhXCIpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVmaW5lZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pICE9PSB1bmRlZmluZWQ7XG5cbiAgICBpZiggXCJIb3N0XCIgaW4gZWxlbSlcbiAgICAgICAgZWxlbSA9IGVsZW0uSG9zdCBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtIGFzIGFueSkgIT09IG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdENzdHI8VD4+IHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoZWxlbSk7XG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSkgYXMgTElTU0hvc3RDc3RyPFQ+O1xuICAgIH1cblxuICAgIC8vIFRPRE86IGxpc3RlbiBkZWZpbmUuLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufVxuXG4vKlxuLy8gVE9ETzogaW1wbGVtZW50XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0Q3N0cjxUPj4ge1xuICAgIC8vIHdlIGNhbid0IGZvcmNlIGEgZGVmaW5lLlxuICAgIHJldHVybiB3aGVuRGVmaW5lZChlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RDc3RyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogTElTU0hvc3RDc3RyPFQ+IHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpIHtcblxuICAgICAgICBsZXQgaG9zdCA9IGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKTtcbiAgICAgICAgaWYoIGhvc3QgPT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZWxlbX0gbm90IGRlZmluZWQgeWV0IWApO1xuXG4gICAgICAgIHJldHVybiBob3N0IGFzIHVua25vd24gYXMgTElTU0hvc3RDc3RyPFQ+O1xuICAgIH1cblxuICAgIGlmKCBcIkhvc3RcIiBpbiBlbGVtKVxuICAgICAgICBlbGVtID0gZWxlbS5Ib3N0IGFzIHVua25vd24gYXMgVDtcblxuICAgIGlmKCBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0gYXMgYW55KSA9PT0gbnVsbCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlbGVtfSBub3QgZGVmaW5lZCB5ZXQhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdENzdHI8VD47XG59IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpc1VwZ3JhZGVkLCB1cGdyYWRlLCB1cGdyYWRlU3luYywgd2hlblVwZ3JhZGVkIH0gZnJvbSBcIi4vVVBHUkFERURcIjtcbmltcG9ydCB7IGlzUmVhZHksIHdoZW5SZWFkeSB9IGZyb20gXCIuL1JFQURZXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gTElTU0hvc3Q8VD58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCAhIGlzVXBncmFkZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gZWxlbS5pc0luaXRpYWxpemVkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB3aGVuVXBncmFkZWQoZWxlbSk7XG5cbiAgICByZXR1cm4gYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQgYXMgVDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbnRyb2xlcjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuICAgIGF3YWl0IHdoZW5SZWFkeShob3N0KTtcblxuICAgIC8vVE9ETzogaW5pdGlhbGl6ZVN5bmMgdnMgaW5pdGlhbGl6ZSA/XG4gICAgaWYoICEgaG9zdC5pc0luaXRpYWxpemVkIClcbiAgICAgICAgcmV0dXJuIGhvc3QuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGhvc3QuY29udHJvbGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBUIHtcbiAgICBcbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG4gICAgaWYoICEgaXNSZWFkeShob3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGFuY2llcyBub3QgcmVhZHkgIVwiKVxuXG4gICAgaWYoICEgaG9zdC5pc0luaXRpYWxpemVkIClcbiAgICAgICAgcmV0dXJuIGhvc3QuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIGhvc3QuY29udHJvbGVyO1xufVxuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZSAgICAgPSBnZXRDb250cm9sZXI7XG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZVN5bmMgPSBnZXRDb250cm9sZXJTeW5jOyIsImltcG9ydCB7IExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGdldEhvc3RDc3RyU3luYywgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCB9IGZyb20gXCIuL0RFRklORURcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+ID0gc3RyaW5nfFR8TElTU0hvc3RDc3RyPFQ+fEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+fEhUTUxFbGVtZW50O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWFkeTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgIGNvbnN0IGhvc3RDc3RyID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgcmV0dXJuIGhvc3RDc3RyLmlzRGVwc1Jlc29sdmVkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblJlYWR5PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBob3N0Q3N0ciA9IGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuICAgIGF3YWl0IGhvc3RDc3RyLndoZW5EZXBzUmVzb2x2ZWQ7XG5cbiAgICByZXR1cm4gaG9zdENzdHIuQ29udHJvbGVyIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICAvLyB3ZSBjYW4ndCBmb3JjZSBhIHJlYWR5LlxuICAgIHJldHVybiB3aGVuUmVhZHkoZWxlbSkgYXMgUHJvbWlzZTxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlckNzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBUIHtcbiAgICBcbiAgICBpZiggISBpc1JlYWR5KGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIHJldHVybiBnZXRIb3N0Q3N0clN5bmMoZWxlbSkuQ29udHJvbGVyIGFzIFQ7XG59IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGdldEhvc3RDc3RyU3luYywgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCB9IGZyb20gXCIuL0RFRklORURcIjtcblxudHlwZSBQYXJhbTxfVCBleHRlbmRzIExJU1NDb250cm9sZXI+ID0gSFRNTEVsZW1lbnQ7XG5cbi8vVE9ETzogdXBncmFkZSBmdW5jdGlvbi4uLlxuXG5leHBvcnQgZnVuY3Rpb24gaXNVcGdyYWRlZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD58TElTU0hvc3Q8VD4pOiBlbGVtIGlzIExJU1NIb3N0PFQ+IHtcblxuICAgIGlmKCAhIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIEhvc3Q7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdDxUPj4ge1xuICAgIFxuICAgIGNvbnN0IEhvc3QgPSBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcblxuICAgIC8vIGFscmVhZHkgdXBncmFkZWRcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhvc3QpXG4gICAgICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xuXG4gICAgLy8gaDRja1xuXG4gICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbiAgICB9XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICBcbiAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWQgICAgICAgID0gcHJvbWlzZTtcbiAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcblxuICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEhvc3Q8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdDxUPj4ge1xuICAgIFxuICAgIGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdFN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogTElTU0hvc3Q8VD4ge1xuICAgIFxuICAgIGlmKCAhIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IGRlZmluZWQgIVwiKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbn1cblxuZXhwb3J0IGNvbnN0IHVwZ3JhZGUgICAgID0gZ2V0SG9zdDtcbmV4cG9ydCBjb25zdCB1cGdyYWRlU3luYyA9IGdldEhvc3RTeW5jIiwiZXhwb3J0IGVudW0gU3RhdGVzIHtcbiAgICBMSVNTX0RFRklORUQgICAgID0gXCJMSVNTX0RFRklORURcIixcbiAgICBMSVNTX1VQR1JBREVEICAgID0gXCJMSVNTX1VQR1JBREVEXCIsXG4gICAgTElTU19SRUFEWSAgICAgICA9IFwiTElTU19SRUFEWVwiLFxuICAgIExJU1NfSU5JVElBTElaRUQgPSBcIkxJU1NfSU5JVElBTElaRURcIlxufSIsImltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5cblxuaW1wb3J0IHtTdGF0ZXN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvc3RhdGVzLnRzXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBTdGF0ZXMgICAgICAgICA6IHR5cGVvZiBTdGF0ZXNcblx0XHQvLyB3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcbiAgICB9XG59XG5cbkxJU1MuU3RhdGVzID0gU3RhdGVzO1xuXG5cbmltcG9ydCB7ZGVmaW5lLCBnZXROYW1lLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkLCBnZXRIb3N0Q3N0ciwgZ2V0SG9zdENzdHJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0RFRklORURcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZSAgICAgICAgIDogdHlwZW9mIGRlZmluZTtcblx0XHRnZXROYW1lICAgICAgICA6IHR5cGVvZiBnZXROYW1lO1xuXHRcdGlzRGVmaW5lZCAgICAgIDogdHlwZW9mIGlzRGVmaW5lZDtcblx0XHR3aGVuRGVmaW5lZCAgICA6IHR5cGVvZiB3aGVuRGVmaW5lZDtcblx0XHRnZXRIb3N0Q3N0ciAgICA6IHR5cGVvZiBnZXRIb3N0Q3N0cjtcblx0XHRnZXRIb3N0Q3N0clN5bmM6IHR5cGVvZiBnZXRIb3N0Q3N0clN5bmM7XG5cdFx0Ly8gd2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLmRlZmluZSAgICAgICAgID0gZGVmaW5lO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy53aGVuRGVmaW5lZCAgICA9IHdoZW5EZWZpbmVkO1xuTElTUy5nZXRIb3N0Q3N0ciAgICA9IGdldEhvc3RDc3RyO1xuTElTUy5nZXRIb3N0Q3N0clN5bmM9IGdldEhvc3RDc3RyU3luYztcblxuLy9MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5cbmltcG9ydCB7aXNSZWFkeSwgd2hlblJlYWR5LCBnZXRDb250cm9sZXJDc3RyLCBnZXRDb250cm9sZXJDc3RyU3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9SRUFEWVwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc1JlYWR5ICAgICAgOiB0eXBlb2YgaXNSZWFkeTtcblx0XHR3aGVuUmVhZHkgICAgOiB0eXBlb2Ygd2hlblJlYWR5O1xuXHRcdGdldENvbnRyb2xlckNzdHIgICAgOiB0eXBlb2YgZ2V0Q29udHJvbGVyQ3N0cjtcblx0XHRnZXRDb250cm9sZXJDc3RyU3luYzogdHlwZW9mIGdldENvbnRyb2xlckNzdHJTeW5jO1xuICAgIH1cbn1cblxuTElTUy5pc1JlYWR5ICAgICAgICAgICAgID0gaXNSZWFkeTtcbkxJU1Mud2hlblJlYWR5ICAgICAgICAgICA9IHdoZW5SZWFkeTtcbkxJU1MuZ2V0Q29udHJvbGVyQ3N0ciAgICA9IGdldENvbnRyb2xlckNzdHI7XG5MSVNTLmdldENvbnRyb2xlckNzdHJTeW5jPSBnZXRDb250cm9sZXJDc3RyU3luYztcblxuXG5cbmltcG9ydCB7aXNVcGdyYWRlZCwgd2hlblVwZ3JhZGVkLCB1cGdyYWRlLCB1cGdyYWRlU3luYywgZ2V0SG9zdCwgZ2V0SG9zdFN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvVVBHUkFERURcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNVcGdyYWRlZCAgOiB0eXBlb2YgaXNVcGdyYWRlZDtcblx0XHR3aGVuVXBncmFkZWQ6IHR5cGVvZiB3aGVuVXBncmFkZWQ7XG5cdFx0dXBncmFkZSAgICAgOiB0eXBlb2YgdXBncmFkZTtcblx0XHR1cGdyYWRlU3luYyA6IHR5cGVvZiB1cGdyYWRlU3luYztcblx0XHRnZXRIb3N0ICAgICA6IHR5cGVvZiBnZXRIb3N0O1xuXHRcdGdldEhvc3RTeW5jIDogdHlwZW9mIGdldEhvc3RTeW5jO1xuICAgIH1cbn1cblxuTElTUy5pc1VwZ3JhZGVkICA9IGlzVXBncmFkZWQ7XG5MSVNTLndoZW5VcGdyYWRlZD0gd2hlblVwZ3JhZGVkO1xuTElTUy51cGdyYWRlICAgICA9IHVwZ3JhZGU7XG5MSVNTLnVwZ3JhZGVTeW5jID0gdXBncmFkZVN5bmM7XG5MSVNTLmdldEhvc3QgICAgID0gZ2V0SG9zdDtcbkxJU1MuZ2V0SG9zdFN5bmMgPSBnZXRIb3N0U3luYztcblxuXG5pbXBvcnQge2lzSW5pdGlhbGl6ZWQsIHdoZW5Jbml0aWFsaXplZCwgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMsIGdldENvbnRyb2xlciwgZ2V0Q29udHJvbGVyU3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9JTklUSUFMSVpFRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc0luaXRpYWxpemVkICAgIDogdHlwZW9mIGlzSW5pdGlhbGl6ZWQ7XG5cdFx0d2hlbkluaXRpYWxpemVkICA6IHR5cGVvZiB3aGVuSW5pdGlhbGl6ZWQ7XG5cdFx0aW5pdGlhbGl6ZSAgICAgICA6IHR5cGVvZiBpbml0aWFsaXplO1xuXHRcdGluaXRpYWxpemVTeW5jICAgOiB0eXBlb2YgaW5pdGlhbGl6ZVN5bmM7XG5cdFx0Z2V0Q29udHJvbGVyICAgICA6IHR5cGVvZiBnZXRDb250cm9sZXI7XG5cdFx0Z2V0Q29udHJvbGVyU3luYyA6IHR5cGVvZiBnZXRDb250cm9sZXJTeW5jO1xuICAgIH1cbn1cblxuTElTUy5pc0luaXRpYWxpemVkICAgID0gaXNJbml0aWFsaXplZDtcbkxJU1Mud2hlbkluaXRpYWxpemVkICA9IHdoZW5Jbml0aWFsaXplZDtcbkxJU1MuaW5pdGlhbGl6ZSAgICAgICA9IGluaXRpYWxpemU7XG5MSVNTLmluaXRpYWxpemVTeW5jICAgPSBpbml0aWFsaXplU3luYztcbkxJU1MuZ2V0Q29udHJvbGVyICAgICA9IGdldENvbnRyb2xlcjtcbkxJU1MuZ2V0Q29udHJvbGVyU3luYyA9IGdldENvbnRyb2xlclN5bmM7IiwiaW1wb3J0IHR5cGUgeyBDbGFzcywgQ29uc3RydWN0b3IsIExJU1NfT3B0cywgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0IH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7TElTUyBhcyBfTElTU30gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5cbi8vIHVzZWQgZm9yIHBsdWdpbnMuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUztcblxuLy8gZXh0ZW5kcyBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgIEV4dGVuZHNDc3RyIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsXG4gICAgLy90b2RvOiBjb25zdHJhaW5zdHMgb24gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pOiBSZXR1cm5UeXBlPHR5cGVvZiBfZXh0ZW5kczxFeHRlbmRzQ3N0ciwgT3B0cz4+XG4vLyBMSVNTQ29udHJvbGVyIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgID4ob3B0cz86IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj4pOiBMSVNTQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTKG9wdHM6IGFueSA9IHt9KTogTElTU0NvbnRyb2xlckNzdHJcbntcbiAgICBpZiggb3B0cy5leHRlbmRzICE9PSB1bmRlZmluZWQgJiYgXCJIb3N0XCIgaW4gb3B0cy5leHRlbmRzICkgLy8gd2UgYXNzdW1lIHRoaXMgaXMgYSBMSVNTQ29udHJvbGVyQ3N0clxuICAgICAgICByZXR1cm4gX2V4dGVuZHMob3B0cyk7XG5cbiAgICByZXR1cm4gX0xJU1Mob3B0cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZXh0ZW5kczxcbiAgICAgICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAgICAgLy90b2RvOiBjb25zdHJhaW5zdHMgb24gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgIE9wdHMgZXh0ZW5kcyBMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj5cbiAgICA+KG9wdHM6IHtleHRlbmRzOiBFeHRlbmRzQ3N0cn0gJiBQYXJ0aWFsPE9wdHM+KSB7XG5cbiAgICBpZiggb3B0cy5leHRlbmRzID09PSB1bmRlZmluZWQpIC8vIGg0Y2tcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBhIExJU1NDb250cm9sZXIhJyk7XG5cbiAgICBjb25zdCBjZmcgPSBvcHRzLmV4dGVuZHMuSG9zdC5DZmc7XG4gICAgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIGNmZywgY2ZnLmFyZ3MsIG9wdHMpO1xuXG4gICAgY2xhc3MgRXh0ZW5kZWRMSVNTIGV4dGVuZHMgb3B0cy5leHRlbmRzISB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICB9XG5cblx0XHRwcm90ZWN0ZWQgc3RhdGljIG92ZXJyaWRlIF9Ib3N0OiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+O1xuXG4gICAgICAgIC8vIFRTIGlzIHN0dXBpZCwgcmVxdWlyZXMgZXhwbGljaXQgcmV0dXJuIHR5cGVcblx0XHRzdGF0aWMgb3ZlcnJpZGUgZ2V0IEhvc3QoKTogTElTU0hvc3Q8RXh0ZW5kZWRMSVNTPiB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgZnVjayBvZmZcblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QodGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmhvc3QhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuY29udGVudF9nZW5lcmF0b3IhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzKTtcblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cbiAgICB9XG5cbiAgICByZXR1cm4gRXh0ZW5kZWRMSVNTO1xufSIsImltcG9ydCB7IENvbnN0cnVjdG9yLCBMSG9zdCwgTElTU0NvbnRyb2xlckNzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5cbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBkZWZpbmUgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0RFRklORURcIjtcblxuZXhwb3J0IGNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5sZXQgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ3NjcmlwdFthdXRvZGlyXScpO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DRElSID0gc2NyaXB0Py5nZXRBdHRyaWJ1dGUoJ2F1dG9kaXInKSA/PyBudWxsO1xuXG5pZihzY3JpcHQgIT09IG51bGwpXG5cdGF1dG9sb2FkKHNjcmlwdClcblxuXG5mdW5jdGlvbiBhdXRvbG9hZChzY3JpcHQ6IEhUTUxFbGVtZW50KSB7XG5cblx0bGV0IGNkaXI6IG51bGx8c3RyaW5nID0gREVGQVVMVF9DRElSO1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cblx0XHRjb25zdCBzd19wYXRoID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKTtcblxuXHRcdGlmKCBzd19wYXRoID09PSBudWxsICkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHN3X3BhdGgsIHtzY29wZTogXCIvXCJ9KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0Y2RpciA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ2F1dG9kaXInKSE7XG5cblx0aWYoIGNkaXJbY2Rpci5sZW5ndGgtMV0gIT09ICcvJylcblx0XHRjZGlyICs9ICcvJztcblxuXHRjb25zdCBicnl0aG9uID0gc2NyaXB0LmdldEF0dHJpYnV0ZShcImJyeXRob25cIik7XG5cblx0Ly8gb2JzZXJ2ZSBmb3IgbmV3IGluamVjdGVkIHRhZ3MuXG5cdG5ldyBNdXRhdGlvbk9ic2VydmVyKCAobXV0YXRpb25zKSA9PiB7XG5cdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXG5cdFx0XHRmb3IobGV0IGFkZGl0aW9uIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpXG5cdFx0XHRcdGlmKGFkZGl0aW9uIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG5cdFx0XHRcdFx0YWRkVGFnKGFkZGl0aW9uKVxuXG5cdH0pLm9ic2VydmUoIGRvY3VtZW50LCB7IGNoaWxkTGlzdDp0cnVlLCBzdWJ0cmVlOnRydWUgfSk7XG5cblx0Zm9yKCBsZXQgZWxlbSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIipcIikgKVxuXHRcdGFkZFRhZyggZWxlbSApO1xuXG5cdGFzeW5jIGZ1bmN0aW9uIGFkZFRhZyh0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IHRhZ25hbWUgPSAoIHRhZy5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gdGFnLnRhZ05hbWUgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0aWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGNkaXIsXG5cdFx0XHRob3N0XG5cdFx0fSk7XHRcdFxuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiB7aHRtbDogc3RyaW5nLCBjc3M6IHN0cmluZywgaG9zdDogQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+fSkge1xuXG5cdGNvbnN0IGNfanMgICAgICA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cdG9wdHMuaHRtbCAgICAgPz89IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblxuXHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0aWYoIGNfanMgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGNvbnN0IGZpbGUgPSBuZXcgQmxvYihbY19qc10sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pO1xuXHRcdGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG5cdFx0Y29uc3Qgb2xkcmVxID0gTElTUy5yZXF1aXJlO1xuXG5cdFx0TElTUy5yZXF1aXJlID0gZnVuY3Rpb24odXJsOiBVUkx8c3RyaW5nKSB7XG5cblx0XHRcdGlmKCB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiICYmIHVybC5zdGFydHNXaXRoKCcuLycpICkge1xuXHRcdFx0XHRjb25zdCBmaWxlbmFtZSA9IHVybC5zbGljZSgyKTtcblx0XHRcdFx0aWYoIGZpbGVuYW1lIGluIGZpbGVzKVxuXHRcdFx0XHRcdHJldHVybiBmaWxlc1tmaWxlbmFtZV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvbGRyZXEodXJsKTtcblx0XHR9XG5cblx0XHRrbGFzcyA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKS5kZWZhdWx0O1xuXG5cdFx0TElTUy5yZXF1aXJlID0gb2xkcmVxO1xuXHR9XG5cdGVsc2UgaWYoIG9wdHMuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0a2xhc3MgPSBMSVNTKHtcblx0XHRcdC4uLm9wdHMsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogTElTU0F1dG9fQ29udGVudEdlbmVyYXRvclxuXHRcdH0pO1xuXHR9XG5cblx0aWYoIGtsYXNzID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuXG5cdGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cblx0cmV0dXJuIGtsYXNzO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIGludGVybmFsIHRvb2xzID09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRjb25zdCBhbnN3ZXIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cblx0aWYoYW5zd2VyID09PSBcIlwiKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIGFuc3dlclxufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn1cblxuXG5jb25zdCBjb252ZXJ0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn1cblxuZXhwb3J0IGNsYXNzIExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuXHRwcm90ZWN0ZWQgb3ZlcnJpZGUgcHJlcGFyZUhUTUwoaHRtbD86IERvY3VtZW50RnJhZ21lbnQgfCBIVE1MRWxlbWVudCB8IHN0cmluZykge1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IG51bGw7XG5cblx0XHRpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuXG5cdFx0XHR0aGlzLmRhdGEgPSBodG1sO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHQvKlxuXHRcdFx0aHRtbCA9IGh0bWwucmVwbGFjZUFsbCgvXFwkXFx7KFtcXHddKylcXH0vZywgKF8sIG5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYDxsaXNzIHZhbHVlPVwiJHtuYW1lfVwiPjwvbGlzcz5gO1xuXHRcdFx0fSk7Ki9cblxuXHRcdFx0Ly9UT0RPOiAke30gaW4gYXR0clxuXHRcdFx0XHQvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG5cdFx0XHRcdC8vIC0gcmVnaXN0ZXIgZWxlbSArIGF0dHIgbmFtZVxuXHRcdFx0XHQvLyAtIHJlcGxhY2UuIFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gc3VwZXIucHJlcGFyZUhUTUwoaHRtbCk7XG5cdH1cblxuXHRvdmVycmlkZSBmaWxsQ29udGVudChzaGFkb3c6IFNoYWRvd1Jvb3QpIHtcblx0XHRcblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0aWYoIHRoaXMuZGF0YSAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3Qgc3RyID0gKHRoaXMuZGF0YSBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gZW5jb2RlSFRNTChzaGFkb3cuaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpID8/ICcnICkpO1xuXHRcdFx0c3VwZXIuc2V0VGVtcGxhdGUoIHN1cGVyLnByZXBhcmVIVE1MKHN0cikhICk7XG5cdFx0fVxuXG5cdFx0c3VwZXIuZmlsbENvbnRlbnQoc2hhZG93KTtcblxuXHRcdC8qXG5cdFx0Ly8gaHRtbCBtYWdpYyB2YWx1ZXMgY291bGQgYmUgb3B0aW1pemVkLi4uXG5cdFx0Y29uc3QgdmFsdWVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXHRcdGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuXHRcdFx0dmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXHRcdCovXG5cblx0fVxuXG5cdG92ZXJyaWRlIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50IHwgU2hhZG93Um9vdCB7XG5cdFx0XG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdGlmKCB0aGlzLmRhdGEgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHN0ciA9ICh0aGlzLmRhdGEgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IGVuY29kZUhUTUwoaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpID8/ICcnICkpO1xuXHRcdFx0c3VwZXIuc2V0VGVtcGxhdGUoIHN1cGVyLnByZXBhcmVIVE1MKHN0cikhICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29udGVudCA9IHN1cGVyLmdlbmVyYXRlKGhvc3QpO1xuXG5cdFx0Lypcblx0XHQvLyBodG1sIG1hZ2ljIHZhbHVlcy5cblx0XHQvLyBjYW4gYmUgb3B0aW1pemVkLi4uXG5cdFx0Y29uc3QgdmFsdWVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXHRcdGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuXHRcdFx0dmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXHRcdCovXG5cblx0XHQvLyBjc3MgcHJvcC5cblx0XHRjb25zdCBjc3NfYXR0cnMgPSBob3N0LmdldEF0dHJpYnV0ZU5hbWVzKCkuZmlsdGVyKCBlID0+IGUuc3RhcnRzV2l0aCgnY3NzLScpKTtcblx0XHRmb3IobGV0IGNzc19hdHRyIG9mIGNzc19hdHRycylcblx0XHRcdGhvc3Quc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtjc3NfYXR0ci5zbGljZSgnY3NzLScubGVuZ3RoKX1gLCBob3N0LmdldEF0dHJpYnV0ZShjc3NfYXR0cikpO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGltcG9ydENvbXBvbmVudHMgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50cztcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50ICA6IHR5cGVvZiBpbXBvcnRDb21wb25lbnQ7XG4gICAgICAgIHJlcXVpcmUgICAgICAgICAgOiB0eXBlb2YgcmVxdWlyZTtcbiAgICB9XG59XG5cbnR5cGUgaW1wb3J0Q29tcG9uZW50c19PcHRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSB7XG5cdGNkaXIgICA/OiBzdHJpbmd8bnVsbCxcblx0YnJ5dGhvbj86IHN0cmluZ3xudWxsLFxuXHRob3N0ICAgPzogQ29uc3RydWN0b3I8VD5cbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudHM8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHRcdFx0XHRcdFx0Y29tcG9uZW50czogc3RyaW5nW10sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0XHRcdFx0XHRcdGJyeXRob24gPSBudWxsLFxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudFxuXHRcdFx0XHRcdFx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+KSB7XG5cblx0Y29uc3QgcmVzdWx0czogUmVjb3JkPHN0cmluZywgTElTU0NvbnRyb2xlckNzdHI+ID0ge307XG5cblx0Zm9yKGxldCB0YWduYW1lIG9mIGNvbXBvbmVudHMpIHtcblxuXHRcdHJlc3VsdHNbdGFnbmFtZV0gPSBhd2FpdCBpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0Y2Rpcixcblx0XHRcdGJyeXRob24sXG5cdFx0XHRob3N0XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuY29uc3QgYnJ5X3dyYXBwZXIgPSBgZnJvbSBicm93c2VyIGltcG9ydCBzZWxmXG5cbmRlZiB3cmFwanMoanNfa2xhc3MpOlxuXG5cdGNsYXNzIFdyYXBwZXI6XG5cblx0XHRfanNfa2xhc3MgPSBqc19rbGFzc1xuXHRcdF9qcyA9IE5vbmVcblxuXHRcdGRlZiBfX2luaXRfXyh0aGlzLCAqYXJncyk6XG5cdFx0XHR0aGlzLl9qcyA9IGpzX2tsYXNzLm5ldygqYXJncylcblxuXHRcdGRlZiBfX2dldGF0dHJfXyh0aGlzLCBuYW1lOiBzdHIpOlxuXHRcdFx0cmV0dXJuIHRoaXMuX2pzW25hbWVdO1xuXG5cdFx0ZGVmIF9fc2V0YXR0cl9fKHRoaXMsIG5hbWU6IHN0ciwgdmFsdWUpOlxuXHRcdFx0aWYgbmFtZSA9PSBcIl9qc1wiOlxuXHRcdFx0XHRzdXBlcigpLl9fc2V0YXR0cl9fKG5hbWUsIHZhbHVlKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHRoaXMuX2pzW25hbWVdID0gdmFsdWVcblx0XG5cdHJldHVybiBXcmFwcGVyXG5cbnNlbGYud3JhcGpzID0gd3JhcGpzXG5gO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdHRhZ25hbWU6IHN0cmluZyxcblx0e1xuXHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0YnJ5dGhvbiA9IG51bGwsXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGhvc3QgICAgPSBIVE1MRWxlbWVudCxcblx0XHRmaWxlcyAgID0gbnVsbFxuXHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4gJiB7ZmlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fG51bGx9ID0ge31cbikge1xuXG5cdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RhZ25hbWV9L2A7XG5cblx0aWYoIGZpbGVzID09PSBudWxsICkge1xuXHRcdGZpbGVzID0ge307XG5cblx0XHRjb25zdCBmaWxlID0gYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgPyAnaW5kZXguYnJ5JyA6ICdpbmRleC5qcyc7XG5cblx0XHRmaWxlc1tmaWxlXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn0ke2ZpbGV9YCwgdHJ1ZSkpITtcblxuXHRcdC8vVE9ETyEhIVxuXHRcdHRyeSB7XG5cdFx0XHRmaWxlc1tcImluZGV4Lmh0bWxcIl0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguaHRtbGAsIHRydWUpKSE7XG5cdFx0fSBjYXRjaChlKSB7XG5cblx0XHR9XG5cdFx0dHJ5IHtcblx0XHRcdGZpbGVzW1wiaW5kZXguY3NzXCIgXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5jc3NgICwgdHJ1ZSkpITtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFxuXHRcdH1cblx0fVxuXG5cdGlmKCBicnl0aG9uID09PSBcInRydWVcIiAmJiBmaWxlc1snaW5kZXguYnJ5J10gIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0Y29uc3QgY29kZSA9IGZpbGVzW1wiaW5kZXguYnJ5XCJdO1xuXG5cdFx0ZmlsZXNbJ2luZGV4LmpzJ10gPVxuYGNvbnN0ICRCID0gZ2xvYmFsVGhpcy5fX0JSWVRIT05fXztcblxuJEIucnVuUHl0aG9uU291cmNlKFxcYCR7YnJ5X3dyYXBwZXJ9XFxgLCBcIl9cIik7XG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHtjb2RlfVxcYCwgXCJfXCIpO1xuXG5jb25zdCBtb2R1bGUgPSAkQi5pbXBvcnRlZFtcIl9cIl07XG5leHBvcnQgZGVmYXVsdCBtb2R1bGUuV2ViQ29tcG9uZW50O1xuXG5gO1xuXHR9XG5cblx0Y29uc3QgaHRtbCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0Y29uc3QgY3NzICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIHtodG1sLCBjc3MsIGhvc3R9KTtcbn1cblxuZnVuY3Rpb24gcmVxdWlyZSh1cmw6IFVSTHxzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPnxzdHJpbmcge1xuXHRyZXR1cm4gZmV0Y2godXJsKTtcbn1cblxuXG5MSVNTLmltcG9ydENvbXBvbmVudHMgPSBpbXBvcnRDb21wb25lbnRzO1xuTElTUy5pbXBvcnRDb21wb25lbnQgID0gaW1wb3J0Q29tcG9uZW50O1xuTElTUy5yZXF1aXJlICA9IHJlcXVpcmU7IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn0iLCJcbmltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbnR5cGUgTGlzdGVuZXJGY3Q8VCBleHRlbmRzIEV2ZW50PiA9IChldjogVCkgPT4gdm9pZDtcbnR5cGUgTGlzdGVuZXJPYmo8VCBleHRlbmRzIEV2ZW50PiA9IHsgaGFuZGxlRXZlbnQ6IExpc3RlbmVyRmN0PFQ+IH07XG50eXBlIExpc3RlbmVyPFQgZXh0ZW5kcyBFdmVudD4gPSBMaXN0ZW5lckZjdDxUPnxMaXN0ZW5lck9iajxUPjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50VGFyZ2V0MjxFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBFdmVudD4+IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuXG5cdG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBjYWxsYmFjazogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgb3B0aW9ucz86IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhbik6IHZvaWQge1xuXHRcdFxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblx0fVxuXG5cdG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQ8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4oZXZlbnQ6IEV2ZW50c1tUXSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBzdXBlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fVxuXG5cdG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGlzdGVuZXI6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQge1xuXG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0c3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbUV2ZW50MjxUIGV4dGVuZHMgc3RyaW5nLCBBcmdzPiBleHRlbmRzIEN1c3RvbUV2ZW50PEFyZ3M+IHtcblxuXHRjb25zdHJ1Y3Rvcih0eXBlOiBULCBhcmdzOiBBcmdzKSB7XG5cdFx0c3VwZXIodHlwZSwge2RldGFpbDogYXJnc30pO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2V0IHR5cGUoKTogVCB7IHJldHVybiBzdXBlci50eXBlIGFzIFQ7IH1cbn1cblxudHlwZSBJbnN0YW5jZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4+ID0ge1xuXHRbSyBpbiBrZXlvZiBUXTogSW5zdGFuY2VUeXBlPFRbS10+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXaXRoRXZlbnRzPFQgZXh0ZW5kcyBvYmplY3QsIEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4gPihldjogQ29uc3RydWN0b3I8VD4sIF9ldmVudHM6IEV2ZW50cykge1xuXG5cdHR5cGUgRXZ0cyA9IEluc3RhbmNlczxFdmVudHM+O1xuXG5cdGlmKCAhIChldiBpbnN0YW5jZW9mIEV2ZW50VGFyZ2V0KSApXG5cdFx0cmV0dXJuIGV2IGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+PjtcblxuXHQvLyBpcyBhbHNvIGEgbWl4aW5cblx0Ly8gQHRzLWlnbm9yZVxuXHRjbGFzcyBFdmVudFRhcmdldE1peGlucyBleHRlbmRzIGV2IHtcblxuXHRcdCNldiA9IG5ldyBFdmVudFRhcmdldDI8RXZ0cz4oKTtcblxuXHRcdGFkZEV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmFkZEV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdGRpc3BhdGNoRXZlbnQoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmRpc3BhdGNoRXZlbnQoLi4uYXJncyk7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gRXZlbnRUYXJnZXRNaXhpbnMgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgU2hhZG93Um9vdCB0b29scyA9PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRNYXRjaGVzKGV2OiBFdmVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXG5cdGxldCBlbGVtZW50cyA9IGV2LmNvbXBvc2VkUGF0aCgpLnNsaWNlKDAsLTIpLmZpbHRlcihlID0+ICEgKGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSApLnJldmVyc2UoKSBhcyBIVE1MRWxlbWVudFtdO1xuXG5cdGZvcihsZXQgZWxlbSBvZiBlbGVtZW50cyApXG5cdFx0aWYoZWxlbS5tYXRjaGVzKHNlbGVjdG9yKSApXG5cdFx0XHRyZXR1cm4gZWxlbTsgXG5cblx0cmV0dXJuIG51bGw7XG59IiwiXG5pbXBvcnQgdHlwZSB7IExJU1NDb250cm9sZXIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRzIHt9O1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN5bmMsIHdoZW5Jbml0aWFsaXplZCB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICAvLyBhc3luY1xuICAgICAgICBxcyA6IHR5cGVvZiBxcztcbiAgICAgICAgcXNvOiB0eXBlb2YgcXNvO1xuICAgICAgICBxc2E6IHR5cGVvZiBxc2E7XG4gICAgICAgIHFzYzogdHlwZW9mIHFzYztcblxuICAgICAgICAvLyBzeW5jXG4gICAgICAgIHFzU3luYyA6IHR5cGVvZiBxc1N5bmM7XG4gICAgICAgIHFzYVN5bmM6IHR5cGVvZiBxc2FTeW5jO1xuICAgICAgICBxc2NTeW5jOiB0eXBlb2YgcXNjU3luYztcblxuXHRcdGNsb3Nlc3Q6IHR5cGVvZiBjbG9zZXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzc19zZWxlY3RvcihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtsaXNzX3NlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0bGV0IHJlc3VsdCA9IGF3YWl0IHFzbzxUPihzZWxlY3RvciwgcGFyZW50KTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gcmVzdWx0IVxufVxuXG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc288TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VFtdPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXVtdID47XG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8VD4+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHByb21pc2VzW2lkeCsrXSA9IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc2M8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPihyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUW107XG5mdW5jdGlvbiBxc2FTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dW107XG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cmVzdWx0W2lkeCsrXSA9IGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFQ7XG5mdW5jdGlvbiBxc2NTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KHJlc3VsdCk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjbG9zZXN0PEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50KSB7XG5cblx0d2hpbGUodHJ1ZSkge1xuXHRcdHZhciByZXN1bHQgPSBlbGVtZW50LmNsb3Nlc3Q8RT4oc2VsZWN0b3IpO1xuXG5cdFx0aWYoIHJlc3VsdCAhPT0gbnVsbClcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuXHRcdGlmKCAhIChcImhvc3RcIiBpbiByb290KSApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGVsZW1lbnQgPSAocm9vdCBhcyBTaGFkb3dSb290KS5ob3N0O1xuXHR9XG59XG5cblxuLy8gYXN5bmNcbkxJU1MucXMgID0gcXM7XG5MSVNTLnFzbyA9IHFzbztcbkxJU1MucXNhID0gcXNhO1xuTElTUy5xc2MgPSBxc2M7XG5cbi8vIHN5bmNcbkxJU1MucXNTeW5jICA9IHFzU3luYztcbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG5MSVNTLmNsb3Nlc3QgPSBjbG9zZXN0OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL0xpZmVDeWNsZVwiO1xuXG5leHBvcnQge2RlZmF1bHQgYXMgQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vL1RPRE86IGV2ZW50cy50c1xuLy9UT0RPOiBnbG9iYWxDU1NSdWxlc1xuZXhwb3J0IHtMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5pbXBvcnQgXCIuL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnNcIjtcblxuZXhwb3J0IHtTaGFkb3dDZmd9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB7bGlzcywgbGlzc1N5bmN9IGZyb20gXCIuL2hlbHBlcnMvYnVpbGRcIjtcbmV4cG9ydCB7ZXZlbnRNYXRjaGVzLCBXaXRoRXZlbnRzLCBFdmVudFRhcmdldDIsIEN1c3RvbUV2ZW50Mn0gZnJvbSAnLi9oZWxwZXJzL2V2ZW50cyc7XG5leHBvcnQge2h0bWx9IGZyb20gXCIuL3V0aWxzXCI7XG5leHBvcnQgZGVmYXVsdCBMSVNTO1xuXG4vLyBmb3IgZGVidWcuXG5leHBvcnQge19leHRlbmRzfSBmcm9tIFwiLi9leHRlbmRzXCI7IiwiaW1wb3J0IHR5cGUgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB0eXBlIHsgTElTUyB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3Mge31cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7IG5ldyguLi5hcmdzOmFueVtdKTogVH07XG5cbmV4cG9ydCB0eXBlIENTU19SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MU3R5bGVFbGVtZW50fENTU1N0eWxlU2hlZXQ7XG5leHBvcnQgdHlwZSBDU1NfU291cmNlICAgPSBDU1NfUmVzb3VyY2UgfCBQcm9taXNlPENTU19SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIEhUTUxfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFRlbXBsYXRlRWxlbWVudHxOb2RlO1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnXG59O1xuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSB7XG4gICAgICAgIGV4dGVuZHM6IEV4dGVuZHNDdHIsIC8vIEpTIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsICAgLy8gSFRNTCBIb3N0XG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbn0gJiBDb250ZW50R2VuZXJhdG9yX09wdHM7XG5cbi8vVE9ETzogcmV3cml0ZS4uLlxuLy8gTElTU0NvbnRyb2xlclxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gSW5zdGFuY2VUeXBlPExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgICAgIGluZmVyIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgID4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsSG9zdENzdHI+IDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlciA/IExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+O1xuXG4vLyBsaWdodGVyIExJU1NIb3N0IGRlZiB0byBhdm9pZCB0eXBlIGlzc3Vlcy4uLlxuZXhwb3J0IHR5cGUgTEhvc3Q8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuXG4gICAgY29udGVudDogU2hhZG93Um9vdHxJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG4gICAgc2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBDU1NTZWxlY3Rvcjogc3RyaW5nO1xuXG59ICYgSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuZXhwb3J0IHR5cGUgTEhvc3RDc3RyPEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA9IHtcbiAgICBuZXcoLi4uYXJnczogYW55KTogTEhvc3Q8SG9zdENzdHI+O1xuXG4gICAgQ2ZnOiB7XG4gICAgICAgIGhvc3QgICAgICAgICAgICAgOiBIb3N0Q3N0cixcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuICAgICAgICBhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG4gICAgfVxuXG59ICYgSG9zdENzdHI7IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IEhUTUxFbGVtZW50IHwgdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG4gICAgaWYoIENsYXNzIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIENsYXNzID0gQ2xhc3MuY29uc3RydWN0b3IgYXMgdHlwZW9mIEhUTUxFbGVtZW50O1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXG4gICAgbGV0IGN1cnNvciA9IENsYXNzO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB3aGlsZSAoY3Vyc29yLl9fcHJvdG9fXyAhPT0gSFRNTEVsZW1lbnQpXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY3Vyc29yID0gY3Vyc29yLl9fcHJvdG9fXztcblxuICAgIC8vIGRpcmVjdGx5IGluaGVyaXQgSFRNTEVsZW1lbnRcbiAgICBpZiggISBjdXJzb3IubmFtZS5zdGFydHNXaXRoKCdIVE1MJykgJiYgISBjdXJzb3IubmFtZS5lbmRzV2l0aCgnRWxlbWVudCcpIClcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBodG1sdGFnID0gY3Vyc29yLm5hbWUuc2xpY2UoNCwgLTcpO1xuXG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCkge1xuXHRyZXR1cm4gQ0FOX0hBVkVfU0hBRE9XLmluY2x1ZGVzKCBfZWxlbWVudDJ0YWduYW1lKHRhZykgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5ET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn1cblxuLy8gZm9yIG1peGlucy5cbi8qXG5leHBvcnQgdHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXJcbiovXG5cbi8vIG1vdmVkIGhlcmUgaW5zdGVhZCBvZiBidWlsZCB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHMuXG5leHBvcnQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudD4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiBUIHtcbiAgICBcbiAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN0cmluZyArPSBgJHthcmdzW2ldfWA7XG4gICAgICAgIHN0cmluZyArPSBgJHtzdHJbaSsxXX1gO1xuICAgICAgICAvL1RPRE86IG1vcmUgcHJlLXByb2Nlc3Nlc1xuICAgIH1cblxuICAgIC8vIHVzaW5nIHRlbXBsYXRlIHByZXZlbnRzIEN1c3RvbUVsZW1lbnRzIHVwZ3JhZGUuLi5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHJpbmcudHJpbSgpO1xuXG4gICAgaWYoIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEgJiYgdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpXG4gICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkISBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudCEgYXMgdW5rbm93biBhcyBUO1xufSIsImltcG9ydCB0ZW1wbGF0ZSwgeyBIVE1MIH0gZnJvbSBcIlYzL3V0aWxzL3BhcnNlcnMvdGVtcGxhdGVcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCBlbmNvZGVIVE1MIGZyb20gXCJWMy91dGlscy9lbmNvZGVcIjtcblxuY29uc3QgcmVnZXggPSAvXFwkXFx7KC4rPylcXH0vZztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBwcmVwYXJlVGVtcGxhdGUoaHRtbDogSFRNTCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcblxuICAgICAgICBpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gaHRtbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8bGlzcyB2YWx1ZT1cIiR7bmFtZX1cIj48L2xpc3M+YDtcbiAgICAgICAgICAgIH0pOyovXG5cbiAgICAgICAgICAgIC8vVE9ETzogJHt9IGluIGF0dHJcbiAgICAgICAgICAgICAgICAvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG4gICAgICAgICAgICAgICAgLy8gLSByZWdpc3RlciBlbGVtICsgYXR0ciBuYW1lXG4gICAgICAgICAgICAgICAgLy8gLSByZXBsYWNlLiBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3VwZXIucHJlcGFyZVRlbXBsYXRlKGh0bWwpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuICAgICAgICBcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuICAgICAgICBpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZShyZWdleCwgKF8sIG1hdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzaGFkb3cuaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpO1xuICAgICAgICAgICAgICAgIGlmKCB2YWx1ZSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnOyBcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlSFRNTCh2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3VwZXIucHJlcGFyZVRlbXBsYXRlKHN0cik7XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci5maWxsQ29udGVudChzaGFkb3cpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIC8vIGh0bWwgbWFnaWMgdmFsdWVzIGNvdWxkIGJlIG9wdGltaXplZC4uLlxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG4gICAgICAgIGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuICAgICAgICAgICAgdmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuICAgICAgICAqL1xuICAgIH1cbn0iLCJpbXBvcnQgeyBpc1Jlc3NvdXJjZVJlYWR5LCBSZXNzb3VyY2UsIHdhaXRSZXNzb3VyY2UgfSBmcm9tIFwiVjMvdXRpbHMvbmV0d29yay9yZXNzb3VyY2VcIjtcbmltcG9ydCB7IFNoYWRvd0NmZyB9IGZyb20gXCJWMi90eXBlc1wiO1xuaW1wb3J0IHsgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCJWMi91dGlsc1wiO1xuaW1wb3J0IHRlbXBsYXRlLCB7IEhUTUwgfSBmcm9tIFwiVjMvdXRpbHMvcGFyc2Vycy90ZW1wbGF0ZVwiO1xuaW1wb3J0IHN0eWxlICAgLCB7Q1NTfSAgICBmcm9tIFwiVjMvdXRpbHMvcGFyc2Vycy9zdHlsZVwiO1xuXG50eXBlIFNUWUxFID0gQ1NTIHwgcmVhZG9ubHkgQ1NTW107XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHtcbiAgICBodG1sICAgPzogUmVzc291cmNlPEhUTUw+LFxuICAgIGNzcyAgICA/OiBSZXNzb3VyY2U8U1RZTEU+LFxuICAgIHNoYWRvdyA/OiBTaGFkb3dDZmd8bnVsbFxufVxuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuLy9jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG5cbiAgICAjc2hhZG93ICAgICA6IFNoYWRvd0NmZ3xudWxsO1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuXG4gICAgICAgIGNvbnN0IGlzUmVhZHkgPSBpc1Jlc3NvdXJjZVJlYWR5PEhUTUw+IChodG1sKVxuICAgICAgICAgICAgICAgICAgICAgJiYgaXNSZXNzb3VyY2VSZWFkeTxTVFlMRT4oY3NzKVxuICAgICAgICAgICAgICAgICAgICAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgaWYoIGlzUmVhZHkgKVxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlKGh0bWwsIGNzcyk7XG5cbiAgICAgICAgY29uc3Qgd2hlblJlYWR5OiBQcm9taXNlPFtIVE1MfHVuZGVmaW5lZCwgU1RZTEV8dW5kZWZpbmVkLCB1bmtub3duXT4gPSBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB3YWl0UmVzc291cmNlPEhUTUwgfHVuZGVmaW5lZD4oaHRtbCksXG4gICAgICAgICAgICB3YWl0UmVzc291cmNlPFNUWUxFfHVuZGVmaW5lZD4oY3NzKSxcbiAgICAgICAgICAgIHdoZW5ET01Db250ZW50TG9hZGVkKClcbiAgICAgICAgXSk7XG5cbiAgICAgICAgd2hlblJlYWR5LnRoZW4oIChhcmdzKSA9PiB0aGlzLnByZXBhcmUoYXJnc1swXSwgYXJnc1sxXSkgKTtcblxuICAgICAgICB0aGlzLmlzUmVhZHkgICA9IGlzUmVhZHk7XG4gICAgICAgIHRoaXMud2hlblJlYWR5ID0gd2hlblJlYWR5O1xuICAgIH1cblxuICAgIC8qKiByZWFkeSAqKiovXG5cbiAgICByZWFkb25seSB3aGVuUmVhZHk6IFByb21pc2U8dW5rbm93bj47XG4gICAgcmVhZG9ubHkgaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogcHJvY2VzcyByZXNzb3VyY2VzICoqL1xuXG4gICAgcHJvdGVjdGVkIHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gICAgICAgPSBbXTtcbiAgICBwcm90ZWN0ZWQgdGVtcGxhdGUgICA6IERvY3VtZW50RnJhZ21lbnR8bnVsbCA9IG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZShodG1sOiBIVE1MfHVuZGVmaW5lZCwgY3NzOiBTVFlMRXx1bmRlZmluZWQpIHtcbiAgICAgICAgaWYoIGh0bWwgIT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVUZW1wbGF0ZShodG1sKTtcbiAgICAgICAgaWYoIGNzcyAgIT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVTdHlsZSAgIChjc3MpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlVGVtcGxhdGUoaHRtbDogSFRNTCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGUoaHRtbCk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBwcmVwYXJlU3R5bGUoY3NzOiBTVFlMRSkge1xuXG4gICAgICAgIGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG4gICAgICAgICAgICBjc3MgPSBbY3NzXTtcblxuICAgICAgICB0aGlzLnN0eWxlc2hlZXRzID0gY3NzLm1hcChlID0+IHN0eWxlKGUpICk7XG4gICAgfVxuXG4gICAgLyoqKiBHZW5lcmF0ZSBjb250ZW50cyAqKiovXG5cbiAgICBpbml0Q29udGVudCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBtb2RlOlwib3BlblwifFwiY2xvc2VkXCJ8bnVsbCkge1xuXG4gICAgICAgIGxldCBjb250ZW50OiBTaGFkb3dSb290fEhUTUxFbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICBpZiggbW9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGVudCA9IHRhcmdldC5hdHRhY2hTaGFkb3coe21vZGV9KTtcbiAgICAgICAgICAgIGNvbnRlbnQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTLCAuLi50aGlzLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgfVxuICAgICAgICAvL1RPRE86IENTUyBmb3Igbm8gc2hhZG93ID8/P1xuICAgICAgICBcbiAgICAgICAgdGhpcy5maWxsQ29udGVudChjb250ZW50KTtcblxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBmaWxsQ29udGVudCh0YXJnZXQ6IFNoYWRvd1Jvb3R8SFRNTEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICBcbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGUgIT09IG51bGwpXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKCB0aGlzLmNyZWF0ZUNvbnRlbnQoKSApO1xuXG4gICAgICAgIC8vVE9ETy4uLlxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKHRhcmdldCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUhLmNsb25lTm9kZSh0cnVlKTtcbiAgICB9XG59IiwiaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIlYzL0NvbnRlbnRHZW5lcmF0b3JzL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCBMSVNTRnVsbCBmcm9tIFwiLi9MSVNTL0xJU1NGdWxsXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsVmFsdWU8RSBleHRlbmRzIEhUTUxFbGVtZW50LCBOIGV4dGVuZHMga2V5b2YgRT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZTogRSwgbmFtZTogTik6IHVuZGVmaW5lZHxFW05dXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5pdGlhbFZhbHVlPEUgZXh0ZW5kcyBIVE1MRWxlbWVudCwgTiBleHRlbmRzIGtleW9mIEUsIEQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGU6IEUsIG5hbWU6IE4sIGRlZmF1bHRWYWx1ZTogRCkgOiBEfEVbTl1cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsVmFsdWU8RSBleHRlbmRzIEhUTUxFbGVtZW50LCBOIGV4dGVuZHMga2V5b2YgRSwgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZTogRSwgbmFtZTogTiwgZGVmYXVsdFZhbHVlPzogRCk6IHVuZGVmaW5lZHxEfEVbTl0ge1xuXG4gICAgaWYoICEgT2JqZWN0Lmhhc093bihlLCBuYW1lKSApXG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgICBjb25zdCAgXyA9IGVbbmFtZV07XG4gICAgZGVsZXRlICAgICBlW25hbWVdO1xuICAgIHJldHVybiBfO1xufVxuXG50eXBlIENzdHI8VD4gPSBuZXcoLi4uYXJnczphbnlbXSkgPT4gVFxudHlwZSBMSVNTdjNfT3B0czxUIGV4dGVuZHMgQ3N0cjxDb250ZW50R2VuZXJhdG9yPiA+ID0ge1xuICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBULFxufSAmIENvbnN0cnVjdG9yUGFyYW1ldGVyczxUPlswXTtcblxuLy8gIGJ1aWxkZXJcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID0gQ3N0cjxDb250ZW50R2VuZXJhdG9yPj4ob3B0czogUGFydGlhbDxMSVNTdjNfT3B0czxUPj4gPSB7fSkge1xuICAgIFxuICAgIGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gb3B0cy5jb250ZW50X2dlbmVyYXRvciA/PyBDb250ZW50R2VuZXJhdG9yO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBnZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3IgPSBuZXcgY29udGVudF9nZW5lcmF0b3Iob3B0cyk7XG4gICAgXG4gICAgcmV0dXJuIGNsYXNzIF9MSVNTIGV4dGVuZHMgTElTU0Z1bGwge1xuXG4gICAgICAgIC8vIFRPRE86IG5vIGNvbnRlbnQgaWYuLi4gPz8/XG4gICAgICAgIC8vIG92ZXJyaWRlIGF0dGFjaFNoYWRvdyAgPz8/XG4gICAgICAgIHN0YXRpYyBvdmVycmlkZSByZWFkb25seSBTSEFET1dfTU9ERSAgICAgICA9IFwib3BlblwiO1xuICAgICAgICBzdGF0aWMgb3ZlcnJpZGUgcmVhZG9ubHkgQ09OVEVOVF9HRU5FUkFUT1IgPSBnZW5lcmF0b3I7XG5cbiAgICB9XG59XG5cbi8vIHVzZWQgZm9yIHBsdWdpbnMuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUzsiLCJpbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiVjMvQ29udGVudEdlbmVyYXRvcnMvQ29udGVudEdlbmVyYXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMSVNTQmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuXG4gICAgLypwcm90ZWN0ZWQgZ2V0SW5pdGlhbFZhbHVlPE4gZXh0ZW5kcyBrZXlvZiB0aGlzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lOiBOKTogdW5kZWZpbmVkfHRoaXNbTl1cbiAgICBwcm90ZWN0ZWQgZ2V0SW5pdGlhbFZhbHVlPE4gZXh0ZW5kcyBrZXlvZiB0aGlzLCBEPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lOiBOLCBkZWZhdWx0VmFsdWU6IEQpIDogRHx0aGlzW05dXG4gICAgcHJvdGVjdGVkIGdldEluaXRpYWxWYWx1ZTxOIGV4dGVuZHMga2V5b2YgdGhpcywgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZTogTiwgZGVmYXVsdFZhbHVlPzogRCk6IHVuZGVmaW5lZHxEfHRoaXNbTl0ge1xuICAgICAgICByZXR1cm4gZ2V0SW5pdGlhbFZhbHVlKHRoaXMsIG5hbWUsIGRlZmF1bHRWYWx1ZSk7XG4gICAgfSovXG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgU0hBRE9XX01PREUgICAgICA6IFwib3BlblwifFwiY2xvc2VkXCJ8bnVsbCA9IG51bGw7XG4gICAgLy8gVE9ETzogc3RhdGljIGNhY2hlIGdldHRlciArIHVzZSBzdGF0aWMgSFRNTC9DU1MuXG4gICAgc3RhdGljIHJlYWRvbmx5IENPTlRFTlRfR0VORVJBVE9SOiBDb250ZW50R2VuZXJhdG9yfG51bGwgPSBudWxsO1xuXG4gICAgcmVhZG9ubHkgY29udGVudCAgOiBTaGFkb3dSb290fEhUTUxFbGVtZW50ICAgICAgICA9IHRoaXM7XG4gICAgcmVhZG9ubHkgaG9zdCAgICAgOiBIVE1MRWxlbWVudCAgICAgICAgICAgICAgICAgICA9IHRoaXM7XG4gICAgcmVhZG9ubHkgY29udHJvbGVyOiBPbWl0PHRoaXMsIGtleW9mIEhUTUxFbGVtZW50PiA9IHRoaXM7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zdCBrbGFzcyA9IHRoaXMuY29uc3RydWN0b3IgYXMgdHlwZW9mIExJU1NCYXNlO1xuXG4gICAgICAgIGlmKCBrbGFzcy5DT05URU5UX0dFTkVSQVRPUiAhPT0gbnVsbCApXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBrbGFzcy5DT05URU5UX0dFTkVSQVRPUi5pbml0Q29udGVudCh0aGlzLCBrbGFzcy5TSEFET1dfTU9ERSk7XG4gICAgfVxuXG5cbiAgICAvLyBkZWZpbmUgZm9yIGF1dG8tY29tcGxldGUuXG4gICAgc3RhdGljIG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGR2YWw6IHN0cmluZ3xudWxsLCBuZXd2YWw6IHN0cmluZ3xudWxsKXt9XG59IiwiZXhwb3J0IHtkZWZhdWx0IGFzIGRlZmF1bHR9IGZyb20gXCIuL0xJU1NCYXNlXCI7IiwiaW1wb3J0IGRlZmluZSwgeyBXYWl0aW5nRGVmaW5lIH0gZnJvbSBcIlYzL2RlZmluZS9kZWZpbmVcIjtcbmltcG9ydCBMSVNTIGZyb20gXCJWM1wiO1xuaW1wb3J0IEF1dG9Db250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9BdXRvQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IGlzUGFnZUxvYWRlZCBmcm9tIFwiVjMvdXRpbHMvRE9NL2lzUGFnZUxvYWRlZFwiO1xuaW1wb3J0IHdoZW5QYWdlTG9hZGVkIGZyb20gXCJWMy91dGlscy9ET00vd2hlblBhZ2VMb2FkZWRcIjtcbmltcG9ydCBmZXRjaFRleHQgZnJvbSBcIlYzL3V0aWxzL25ldHdvcmsvZmV0Y2hUZXh0XCI7XG5pbXBvcnQgZXhlY3V0ZSBmcm9tIFwiVjMvdXRpbHMvZXhlY3V0ZVwiO1xuXG5jb25zdCBzY3JpcHQgPSAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ3NjcmlwdDppcyhbbGlzcy1hdXRvXSxbbGlzcy1jZGlyXSxbbGlzcy1zd10pJyk7XG5cbmV4cG9ydCBjb25zdCBMSVNTX01PREUgICAgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnbGlzcy1tb2RlJykgPz8gbnVsbDtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NESVIgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnbGlzcy1jZGlyJykgPz8gbnVsbDtcblxuLy8gVE9ETzogZGVmYXVsdCA/XG5jb25zdCBTV19QQVRIICAgICAgICAgICAgID0gc2NyaXB0Py5nZXRBdHRyaWJ1dGUoJ2xpc3Mtc3cnKSA/PyBudWxsO1xuXG5pZihMSVNTX01PREUgPT09IFwiYXV0by1sb2FkXCIgJiYgREVGQVVMVF9DRElSICE9PSBudWxsKSB7XG4gICAgaWYoICEgaXNQYWdlTG9hZGVkKCkgKVxuICAgICAgICBhd2FpdCB3aGVuUGFnZUxvYWRlZCgpO1xuICAgIGF1dG9sb2FkKERFRkFVTFRfQ0RJUik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvbG9hZChjZGlyOiBzdHJpbmcpIHtcblxuICAgIGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cbiAgICAgICAgaWYoIFNXX1BBVEggPT09IG51bGwgKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJZb3UgYXJlIHVzaW5nIExJU1MgQXV0byBtb2RlIHdpdGhvdXQgc3cuanMuXCIpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoU1dfUEFUSCwge3Njb3BlOiBcIi9cIn0pO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYoIGNkaXJbY2Rpci5sZW5ndGgtMV0gIT09ICcvJylcbiAgICAgICAgY2RpciArPSAnLyc7XG5cbiAgICAvL2NvbnN0IGJyeXRob24gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwiYnJ5dGhvblwiKTtcblxuICAgIC8vIG9ic2VydmUgZm9yIG5ldyBpbmplY3RlZCB0YWdzLlxuICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKCAobXV0YXRpb25zKSA9PiB7XG4gICAgICAgIGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuICAgICAgICAgICAgZm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuICAgICAgICAgICAgICAgIGlmKGFkZGl0aW9uIGluc3RhbmNlb2YgSFRNTFVua25vd25FbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICBhZGRUYWcoYWRkaXRpb24pXG5cbiAgICB9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG4gICAgZm9yKCBsZXQgZWxlbSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIjpub3QoOmRlZmluZWQpXCIpIClcbiAgICAgICAgYWRkVGFnKCBlbGVtICk7XG5cbiAgICBhc3luYyBmdW5jdGlvbiBhZGRUYWcodGFnOiBIVE1MRWxlbWVudCkge1xuXG4gICAgICAgIGF3YWl0IFNXOyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG4gICAgICAgIGNvbnN0IHRhZ25hbWUgPSB0YWcudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGlmKCAgV2FpdGluZ0RlZmluZS5oYXModGFnbmFtZSlcbiAgICAgICAgIHx8IGN1c3RvbUVsZW1lbnRzLmdldCh0YWduYW1lKSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxvYWRDb21wb25lbnQodGFnbmFtZSwge1xuICAgICAgICAgICAgLy9icnl0aG9uLFxuICAgICAgICAgICAgY2RpclxuICAgICAgICB9KTtcdFx0XG4gICAgfVxufVxuXG4vKioqKiovXG5cbnR5cGUgbG9hZENvbXBvbmVudF9PcHRzID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGxcbn07XG5cbnR5cGUgQ3N0cjxUPiA9ICguLi5hcmdzOiBhbnlbXSkgPT4gVDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdC8vIGJyeXRob24gPSBudWxsXG5cdH06IGxvYWRDb21wb25lbnRfT3B0cyA9IHt9XG4pOiBQcm9taXNlPENzdHI8VD4+IHtcblxuXHRXYWl0aW5nRGVmaW5lLmFkZCh0YWduYW1lKTtcblxuXHRjb25zdCBjb21wb19kaXIgPSBgJHtjZGlyfSR7dGFnbmFtZX0vYDtcblxuXHRjb25zdCBmaWxlczogUmVjb3JkPHN0cmluZyxzdHJpbmd8dW5kZWZpbmVkPiA9IHt9O1xuXG5cdC8vIHN0cmF0cyA6IEpTIC0+IEJyeSAtPiBIVE1MK0NTUyAoY2Ygc2NyaXB0IGF0dHIpLlxuXG4gICAgZmlsZXNbXCJqc1wiXSA9IGF3YWl0IGZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguanNgLCB0cnVlKTtcblxuICAgIGlmKCBmaWxlc1tcImpzXCJdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gdHJ5L2NhdGNoID9cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXG4gICAgICAgICAgICBmZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4Lmh0bWxgLCB0cnVlKSEsXG4gICAgICAgICAgICBmZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4LmNzc2AgLCB0cnVlKSFcbiAgICAgICAgXTtcbiAgICAgICAgW2ZpbGVzW1wiaHRtbFwiXSwgZmlsZXNbXCJjc3NcIiBdXSA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cblx0cmV0dXJuIGF3YWl0IGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcyk7XG59XG5cbi8vVE9ETzogcmVuYW1lIGZyb20gZmlsZXMgP1xuYXN5bmMgZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogUmVjb3JkPHN0cmluZywgYW55PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICBcbiAgICBsZXQga2xhc3M7XG4gICAgaWYoIFwianNcIiBpbiBmaWxlcyApXG4gICAgICAgIGtsYXNzID0gKGF3YWl0IGV4ZWN1dGU8YW55PihmaWxlc1tcImpzXCJdLCBcImpzXCIpKS5kZWZhdWx0O1xuXG4gICAgaWYoIGtsYXNzID09PSB1bmRlZmluZWQgKVxuICAgICAgICBrbGFzcyA9IExJU1Moe1xuICAgICAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IEF1dG9Db250ZW50R2VuZXJhdG9yLFxuICAgICAgICAgICAgLi4uZmlsZXNcbiAgICAgICAgfSk7XG5cbiAgICBkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXG4gICAgcmV0dXJuIGtsYXNzO1xufSIsImltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCJWMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBfd2hlbkRlZmluZWRQcm9taXNlcyB9IGZyb20gXCIuL3doZW5EZWZpbmVkXCI7XG5cbmV4cG9ydCBjb25zdCBXYWl0aW5nRGVmaW5lID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGRlZmluZSh0YWduYW1lOiBzdHJpbmcsIEtsYXNzOiBuZXcoLi4uYXJnczphbnlbXSkgPT4gSFRNTEVsZW1lbnQpIHtcblxuICAgIC8vVE9ETzogUHl0aG9uIGNsYXNzLi4uXG5cbiAgICAvL1RPRE86IHR5cGUgc2FmZVxuICAgIGlmKCBcIkNPTlRFTlRfR0VORVJBVE9SXCIgaW4gS2xhc3MgKSB7XG4gICAgICAgIGNvbnN0IGdlbmVyYXRvciA9IEtsYXNzLkNPTlRFTlRfR0VORVJBVE9SIGFzIENvbnRlbnRHZW5lcmF0b3I7XG5cbiAgICAgICAgaWYoICEgZ2VuZXJhdG9yLmlzUmVhZHkgKSB7XG4gICAgICAgICAgICBXYWl0aW5nRGVmaW5lLmFkZCh0YWduYW1lKTtcbiAgICAgICAgICAgIGF3YWl0IGdlbmVyYXRvci53aGVuUmVhZHk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBXYWl0aW5nRGVmaW5lLmRlbGV0ZSh0YWduYW1lKTtcbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgS2xhc3MpO1xuXG4gICAgY29uc3QgcCA9IF93aGVuRGVmaW5lZFByb21pc2VzLmdldChLbGFzcyk7XG4gICAgaWYoIHAgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIHAucmVzb2x2ZSgpO1xufVxuXG5pbXBvcnQgTElTUyBmcm9tIFwiVjMvTElTU1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIlYzL0xJU1NcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lOiB0eXBlb2YgZGVmaW5lO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgPSBkZWZpbmU7IiwiaW1wb3J0IGRlZmluZSAgICAgIGZyb20gXCIuL2RlZmluZVwiO1xuaW1wb3J0IGlzRGVmaW5lZCAgIGZyb20gXCIuL2lzRGVmaW5lZFwiO1xuaW1wb3J0IHdoZW5EZWZpbmVkIGZyb20gXCIuL3doZW5EZWZpbmVkXCI7XG5cbmltcG9ydCBMSVNTIGZyb20gXCJWMy9MSVNTXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiVjMvTElTU1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgOiB0eXBlb2YgZGVmaW5lO1xuICAgICAgICBpc0RlZmluZWQ6IHR5cGVvZiBpc0RlZmluZWQ7XG4gICAgICAgIHdoZW5EZWZpbmVkICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLmRlZmluZSAgICAgID0gZGVmaW5lO1xuTElTUy5pc0RlZmluZWQgICA9IGlzRGVmaW5lZDtcbkxJU1Mud2hlbkRlZmluZWQgPSB3aGVuRGVmaW5lZDtcblxuZXhwb3J0IHtkZWZpbmUsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWR9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzRGVmaW5lZChlbGVtOiBzdHJpbmd8KG5ldyguLi5hcmdzOmFueVtdKT0+SFRNTEVsZW1lbnQpKTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pICE9PSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtKSAhPT0gbnVsbDtcbn0iLCJ0eXBlIENzdHI8VD4gPSBuZXcoLi4uYXJnczphbnlbXSk9PiBUO1xuXG5leHBvcnQgY29uc3QgX3doZW5EZWZpbmVkUHJvbWlzZXMgPSBuZXcgV2Vha01hcDxDc3RyPEhUTUxFbGVtZW50PiwgUHJvbWlzZVdpdGhSZXNvbHZlcnM8dm9pZD4+KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oZWxlbTogc3RyaW5nfENzdHI8VD4pOiBQcm9taXNlPENzdHI8VD4+IHtcbiAgICBcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlbGVtKSBhcyBDc3RyPFQ+O1xuXG4gICAgaWYoIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSkgIT09IG51bGwpXG4gICAgICAgIHJldHVybiBlbGVtIGFzIENzdHI8VD47XG5cbiAgICBsZXQgcCA9IF93aGVuRGVmaW5lZFByb21pc2VzLmdldChlbGVtKTtcbiAgICBpZiggcCA9PT0gdW5kZWZpbmVkICl7XG4gICAgICAgIHAgPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgX3doZW5EZWZpbmVkUHJvbWlzZXMuc2V0KGVsZW0sIHApO1xuICAgIH1cblxuICAgIGF3YWl0IHAucHJvbWlzZTtcbiAgICByZXR1cm4gZWxlbTtcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9MSVNTXCI7XG5cbi8vIEhFUkUuLi5cblxuaW1wb3J0IFwiLi9kZWZpbmVcIjtcbmltcG9ydCBcIi4vZGVmaW5lL2F1dG9sb2FkXCI7XG5cbmltcG9ydCBcIi4vdXRpbHMvcGFyc2Vyc1wiO1xuaW1wb3J0IFwiLi91dGlscy9uZXR3b3JrL3JlcXVpcmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgTElTUzsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1BhZ2VMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIlxufVxuXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn0qLyIsImltcG9ydCBpc1BhZ2VMb2FkZWQgZnJvbSBcIi4vaXNQYWdlTG9hZGVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdoZW5ET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc1BhZ2VMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlc29sdmUgYXMgYW55LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8qXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufSovIiwiY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbmNvZGVIVE1MKHRleHQ6IHN0cmluZykge1xuXHRjb252ZXJ0ZXIudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRyZXR1cm4gY29udmVydGVyLmlubmVySFRNTDtcbn0iLCJpbXBvcnQgZXhlY3V0ZUpTIGZyb20gXCIuL2pzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGU8VD4oY29kZTogc3RyaW5nLCB0eXBlOiBcImpzXCIpOiBQcm9taXNlPFQ+IHtcblxuICAgIGlmKCB0eXBlID09PSBcImpzXCIgKVxuICAgICAgICByZXR1cm4gYXdhaXQgZXhlY3V0ZUpTPFQ+KGNvZGUpO1xuXG4gICAgdGhyb3cgbmV3IEVycm9yKCcnKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBleGVjdXRlSlM8VD4oY29kZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NvZGVdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcbiAgICBjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKTtcbiAgICBcbiAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG5cbiAgICByZXR1cm4gcmVzdWx0IGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBpbiBhdXRvLW1vZGUgdXNlIFNlcnZpY2VXb3JrZXIgdG8gaGlkZSA0MDQgZXJyb3IgbWVzc2FnZXMuXG4vLyBpZiBwbGF5Z3JvdW5kIGZpbGVzLCB1c2UgdGhlbS5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGhpZGU0MDQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuXG4gICAgY29uc3QgZmV0Y2hDb250ZXh0ID0gZ2xvYmFsVGhpcy5MSVNTQ29udGV4dC5mZXRjaDtcbiAgICBpZiggZmV0Y2hDb250ZXh0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBuZXcgVVJMKHVyaSwgZmV0Y2hDb250ZXh0LmN3ZCApO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGZldGNoQ29udGV4dC5maWxlc1twYXRoLnRvU3RyaW5nKCldO1xuICAgICAgICBpZiggdmFsdWUgPT09IFwiXCIgKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgaWYoIHZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IGhpZGU0MDRcbiAgICAgICAgICAgICAgICAgICAgICAgID8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDoge307XG5cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcbiAgICBpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBpZiggaGlkZTQwNCAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG4gICAgaWYoYW5zd2VyID09PSBcIlwiKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIGFuc3dlclxufVxuXG5cblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIHZhciBMSVNTQ29udGV4dDoge1xuICAgICAgICBmZXRjaD86IHtcbiAgICAgICAgICAgIGN3ZCAgOiBzdHJpbmcsXG4gICAgICAgICAgICBmaWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBmZXRjaFRleHQgZnJvbSBcIi4vZmV0Y2hUZXh0XCI7XG5cbi8vIEB0cy1pZ25vcmVcbmdsb2JhbFRoaXMucmVxdWlyZSA9IGFzeW5jIGZ1bmN0aW9uKHVybDogc3RyaW5nKSB7XG4gICAgLy9UT0RPOiBub24gcGxheWdyb3VuZC4uLlxuICAgIHJldHVybiBhd2FpdCBmZXRjaFRleHQodXJsKTtcbn0iLCJleHBvcnQgdHlwZSBSZXNzb3VyY2U8VD4gPVxuICAgICAgVFxuICAgIHwgUHJvbWlzZTxUPlxuICAgIHwgKFQgZXh0ZW5kcyBzdHJpbmcgICAgICAgICA/IFByb21pc2U8UmVzcG9uc2U+IHwgUmVzcG9uc2UgOiBuZXZlcilcbiAgICB8IChUIGV4dGVuZHMgQXJyYXk8aW5mZXIgRT4gPyBSZXNzb3VyY2U8RT5bXSAgICAgICAgICAgICAgIDogbmV2ZXIpO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXNzb3VyY2VSZWFkeTxUPihyZXM6IFJlc3NvdXJjZTxUPnx1bmRlZmluZWQpOiByZXMgaXMgVHx1bmRlZmluZWQge1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkocmVzKSApXG4gICAgICAgIHJldHVybiByZXMuZXZlcnkoIGUgPT4gaXNSZXNzb3VyY2VSZWFkeShlKSApO1xuXG4gICAgcmV0dXJuIHJlcyA9PT0gdW5kZWZpbmVkIHx8ICEocmVzIGluc3RhbmNlb2YgUHJvbWlzZSB8fCByZXMgaW5zdGFuY2VvZiBSZXNwb25zZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0UmVzc291cmNlPFQ+KHJlczogUmVzc291cmNlPFQ+KTogUHJvbWlzZTxUPiB7XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShyZXMpIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHJlcy5tYXAoIGUgPT4gd2FpdFJlc3NvdXJjZShlKSkpIGFzIFQ7XG5cbiAgICBpZiggcmVzIGluc3RhbmNlb2YgUHJvbWlzZSlcbiAgICAgICAgcmVzID0gYXdhaXQgcmVzO1xuXG4gICAgaWYoIHJlcyBpbnN0YW5jZW9mIFJlc3BvbnNlKVxuICAgICAgICByZXMgPSBhd2FpdCByZXMudGV4dCgpIGFzIFQ7XG5cbiAgICByZXR1cm4gcmVzIGFzIFQ7XG59IiwiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKTtcbmNvbnN0IGRmID0gdGVtcGxhdGUuY29udGVudDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KC4uLnJhdzogVGVtcGxhdGU8c3RyaW5nPik6IFQge1xuICAgIFxuICAgIGxldCBlbGVtID0gcmF3WzBdO1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkoZWxlbSkgKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHIgPSByYXdbMF0gYXMgVGVtcGxhdGVTdHJpbmdzQXJyYXk7XG5cbiAgICAgICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHJhdy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgc3RyaW5nICs9IHJhd1tpXTtcbiAgICAgICAgICAgIHN0cmluZyArPSBzdHJbaV07XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtID0gc3RyaW5nO1xuICAgIH1cblxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGVsZW07XG5cbiAgICBpZiggZGYuY2hpbGROb2Rlcy5sZW5ndGggIT09IDEpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yXCIpO1xuXG4gICAgcmV0dXJuIGRmLmZpcnN0Q2hpbGQgYXMgVDtcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiVjMvTElTU1wiO1xuXG5pbXBvcnQgaHRtbCAgICAgZnJvbSBcIi4vaHRtbFwiXG5pbXBvcnQgdGVtcGxhdGUgZnJvbSBcIi4vdGVtcGxhdGVcIjtcbmltcG9ydCBzdHlsZSAgICBmcm9tIFwiLi9zdHlsZVwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIlYzL0xJU1NcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgaHRtbCAgICA6IHR5cGVvZiBodG1sO1xuICAgICAgICB0ZW1wbGF0ZTogdHlwZW9mIHRlbXBsYXRlO1xuICAgICAgICBzdHlsZSAgIDogdHlwZW9mIHN0eWxlO1xuICAgIH1cbn1cblxuTElTUy5zdHlsZSAgICA9IHN0eWxlO1xuTElTUy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuTElTUy5odG1sICAgICA9IGh0bWw7XG5cbmV4cG9ydCB7c3R5bGUsIHRlbXBsYXRlLCBodG1sfTsiLCJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIENTUyAgID0gc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3R5bGUoLi4ucmF3OiBUZW1wbGF0ZTxDU1M+KTogQ1NTU3R5bGVTaGVldCB7XG5cbiAgICBsZXQgZWxlbSA9IHJhd1swXTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldCApXG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgcmV0dXJuIGVsZW0uc2hlZXQhO1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkoZWxlbSkgKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHIgPSByYXdbMF0gYXMgVGVtcGxhdGVTdHJpbmdzQXJyYXk7XG5cbiAgICAgICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHJhdy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgc3RyaW5nICs9IHJhd1tpXTtcbiAgICAgICAgICAgIHN0cmluZyArPSBzdHJbaV07XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtID0gc3RyaW5nO1xuICAgIH1cblxuICAgIGlmKCB0eXBlb2YgZWxlbSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLndhcm4oZWxlbSk7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICAgIHN0eWxlLnJlcGxhY2VTeW5jKGVsZW0pO1xuICAgIHJldHVybiBzdHlsZTtcbn0iLCJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEhUTUwgID0gRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKCAuLi5yYXc6VGVtcGxhdGU8SFRNTD4pOiBEb2N1bWVudEZyYWdtZW50IHtcblxuICAgIGxldCBlbGVtID0gcmF3WzBdO1xuXG4gICAgaWYoIEFycmF5LmlzQXJyYXkoZWxlbSkgKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHIgPSByYXdbMF0gYXMgVGVtcGxhdGVTdHJpbmdzQXJyYXk7XG5cbiAgICAgICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHJhdy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgc3RyaW5nICs9IHJhd1tpXTtcbiAgICAgICAgICAgIHN0cmluZyArPSBzdHJbaV07XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtID0gc3RyaW5nO1xuICAgIH1cblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICAgIHJldHVybiBlbGVtLmNsb25lTm9kZSh0cnVlKSBhcyBEb2N1bWVudEZyYWdtZW50O1xuXG4gICAgLy8gbXVzdCB1c2UgdGVtcGxhdGUgYXMgRG9jdW1lbnRGcmFnbWVudCBkb2Vzbid0IGhhdmUgLmlubmVySFRNTFxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgICBpZih0eXBlb2YgZWxlbSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGVsZW0udHJpbSgpO1xuICAgIGVsc2Uge1xuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICAgICAgLy8gcHJldmVudHMgaXNzdWUgaWYgZWxlbSBpcyBsYXR0ZXIgdXBkYXRlZC5cbiAgICAgICAgICAgIGVsZW0gPSBlbGVtLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgXG4gICAgICAgIHRlbXBsYXRlLmFwcGVuZCggZWxlbSApO1xuICAgIH1cblxuICAgIC8vaWYoIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEgJiYgdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpXG4gICAgLy8gIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcbiAgICBcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudCE7XG59IiwiZXhwb3J0IHtkZWZhdWx0IGFzIFYyfSBmcm9tIFwiVjJcIjtcbmV4cG9ydCB7ZGVmYXVsdCBhcyBWM30gZnJvbSBcIlYzXCI7XG5cbmltcG9ydCBMSVNTIGZyb20gXCJWM1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUztcblxuLy8gQHRzLWlnbm9yZVxuZ2xvYmFsVGhpcy5MSVNTID0gTElTUzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwidmFyIHdlYnBhY2tRdWV1ZXMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIHF1ZXVlc1wiKSA6IFwiX193ZWJwYWNrX3F1ZXVlc19fXCI7XG52YXIgd2VicGFja0V4cG9ydHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGV4cG9ydHNcIikgOiBcIl9fd2VicGFja19leHBvcnRzX19cIjtcbnZhciB3ZWJwYWNrRXJyb3IgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGVycm9yXCIpIDogXCJfX3dlYnBhY2tfZXJyb3JfX1wiO1xudmFyIHJlc29sdmVRdWV1ZSA9IChxdWV1ZSkgPT4ge1xuXHRpZihxdWV1ZSAmJiBxdWV1ZS5kIDwgMSkge1xuXHRcdHF1ZXVlLmQgPSAxO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tKSk7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0gPyBmbi5yKysgOiBmbigpKSk7XG5cdH1cbn1cbnZhciB3cmFwRGVwcyA9IChkZXBzKSA9PiAoZGVwcy5tYXAoKGRlcCkgPT4ge1xuXHRpZihkZXAgIT09IG51bGwgJiYgdHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmKGRlcFt3ZWJwYWNrUXVldWVzXSkgcmV0dXJuIGRlcDtcblx0XHRpZihkZXAudGhlbikge1xuXHRcdFx0dmFyIHF1ZXVlID0gW107XG5cdFx0XHRxdWV1ZS5kID0gMDtcblx0XHRcdGRlcC50aGVuKChyKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXhwb3J0c10gPSByO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSwgKGUpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFcnJvcl0gPSBlO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgb2JqID0ge307XG5cdFx0XHRvYmpbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChmbihxdWV1ZSkpO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9XG5cdH1cblx0dmFyIHJldCA9IHt9O1xuXHRyZXRbd2VicGFja1F1ZXVlc10gPSB4ID0+IHt9O1xuXHRyZXRbd2VicGFja0V4cG9ydHNdID0gZGVwO1xuXHRyZXR1cm4gcmV0O1xufSkpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5hID0gKG1vZHVsZSwgYm9keSwgaGFzQXdhaXQpID0+IHtcblx0dmFyIHF1ZXVlO1xuXHRoYXNBd2FpdCAmJiAoKHF1ZXVlID0gW10pLmQgPSAtMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiBxdWV1ZS5kIDwgMCAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbImdldFNoYXJlZENTUyIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJpc1NoYWRvd1N1cHBvcnRlZCIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwic2hhcmVkQ1NTIiwiQ29udGVudEdlbmVyYXRvciIsImRhdGEiLCJjb25zdHJ1Y3RvciIsImh0bWwiLCJjc3MiLCJzaGFkb3ciLCJwcmVwYXJlSFRNTCIsInByZXBhcmVDU1MiLCJzZXRUZW1wbGF0ZSIsInRlbXBsYXRlIiwiaXNSZWFkeSIsIndoZW5SZWFkeSIsImZpbGxDb250ZW50IiwiaW5qZWN0Q1NTIiwiYXBwZW5kIiwiY29udGVudCIsImNsb25lTm9kZSIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImdlbmVyYXRlIiwiaG9zdCIsInRhcmdldCIsImluaXRTaGFkb3ciLCJzaGFkb3dNb2RlIiwiTk9ORSIsImNoaWxkTm9kZXMiLCJsZW5ndGgiLCJyZXBsYWNlQ2hpbGRyZW4iLCJjYW5IYXZlU2hhZG93IiwiRXJyb3IiLCJtb2RlIiwiT1BFTiIsImF0dGFjaFNoYWRvdyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImUiLCJwcm9jZXNzQ1NTIiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ1bmRlZmluZWQiLCJzdHIiLCJ0cmltIiwiaW5uZXJIVE1MIiwiSFRNTEVsZW1lbnQiLCJzdHlsZXNoZWV0cyIsIlNoYWRvd1Jvb3QiLCJhZG9wdGVkU3R5bGVTaGVldHMiLCJwdXNoIiwiY3Nzc2VsZWN0b3IiLCJDU1NTZWxlY3RvciIsImhhcyIsInNldEF0dHJpYnV0ZSIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwicmVwbGFjZSIsImhlYWQiLCJhZGQiLCJidWlsZExJU1NIb3N0Iiwic2V0Q3N0ckNvbnRyb2xlciIsIl9fY3N0cl9ob3N0Iiwic2V0Q3N0ckhvc3QiLCJfIiwiTElTUyIsImFyZ3MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJjb250ZW50X2dlbmVyYXRvciIsIkxJU1NDb250cm9sZXIiLCJIb3N0Iiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwibmFtZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJjb25uZWN0ZWRDYWxsYmFjayIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiaXNDb25uZWN0ZWQiLCJfSG9zdCIsImlkIiwiX19jc3RyX2NvbnRyb2xlciIsIkxpc3MiLCJob3N0Q3N0ciIsImNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIiLCJMSVNTSG9zdCIsIkNmZyIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkNvbnRyb2xlciIsImNvbnRyb2xlciIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwicGFyYW1zIiwiaW5pdCIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInRoZW4iLCJwcm9taXNlIiwicmVzb2x2ZSIsIlByb21pc2UiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJicnlfY2xhc3MiLCJfX2Jhc2VzX18iLCJmaWx0ZXIiLCJfX25hbWVfXyIsIl9qc19rbGFzcyIsIiRqc19mdW5jIiwiX19CUllUSE9OX18iLCIkY2FsbCIsIiRnZXRhdHRyX3BlcDY1NyIsImh0bWx0YWciLCJDbGFzcyIsIm9wdHMiLCJnZXROYW1lIiwiZWxlbWVudCIsIkVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiaXNEZWZpbmVkIiwiZWxlbSIsImdldCIsIndoZW5EZWZpbmVkIiwiZ2V0SG9zdENzdHIiLCJnZXRIb3N0Q3N0clN5bmMiLCJpc1VwZ3JhZGVkIiwidXBncmFkZVN5bmMiLCJ3aGVuVXBncmFkZWQiLCJnZXRDb250cm9sZXIiLCJnZXRDb250cm9sZXJTeW5jIiwiaW5pdGlhbGl6ZVN5bmMiLCJnZXRDb250cm9sZXJDc3RyIiwiZ2V0Q29udHJvbGVyQ3N0clN5bmMiLCJfd2hlblVwZ3JhZGVkIiwiZ2V0SG9zdCIsIm93bmVyRG9jdW1lbnQiLCJhZG9wdE5vZGUiLCJnZXRIb3N0U3luYyIsIlN0YXRlcyIsIl9MSVNTIiwiSUxJU1MiLCJjZmciLCJhc3NpZ24iLCJFeHRlbmRlZExJU1MiLCJLbm93blRhZ3MiLCJzY3JpcHQiLCJERUZBVUxUX0NESVIiLCJhdXRvbG9hZCIsImNkaXIiLCJTVyIsInN3X3BhdGgiLCJjb25zb2xlIiwid2FybiIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInNjb3BlIiwiZXJyb3IiLCJjb250cm9sbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJyeXRob24iLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJhZGRUYWciLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsInRhZyIsImltcG9ydENvbXBvbmVudCIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwiY19qcyIsImtsYXNzIiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwib2xkcmVxIiwicmVxdWlyZSIsInN0YXJ0c1dpdGgiLCJmaWxlbmFtZSIsInNsaWNlIiwiZGVmYXVsdCIsIkxJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IiLCJfZmV0Y2hUZXh0IiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImFuc3dlciIsInRleHQiLCJfaW1wb3J0IiwibG9nIiwiY29udmVydGVyIiwiZW5jb2RlSFRNTCIsInRleHRDb250ZW50IiwibWF0Y2giLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImNzc19hdHRyIiwic2V0UHJvcGVydHkiLCJpbXBvcnRDb21wb25lbnRzIiwiY29tcG9uZW50cyIsInJlc3VsdHMiLCJicnlfd3JhcHBlciIsImNvbXBvX2RpciIsImNvZGUiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsImlkeCIsInByb21pc2VzIiwiYWxsIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwicmVnZXgiLCJBdXRvQ29udGVudEdlbmVyYXRvciIsInByZXBhcmVUZW1wbGF0ZSIsInZhbHVlIiwiaXNSZXNzb3VyY2VSZWFkeSIsIndhaXRSZXNzb3VyY2UiLCJwcmVwYXJlIiwicHJlcGFyZVN0eWxlIiwiaW5pdENvbnRlbnQiLCJjcmVhdGVDb250ZW50IiwiTElTU0Z1bGwiLCJnZXRJbml0aWFsVmFsdWUiLCJkZWZhdWx0VmFsdWUiLCJoYXNPd24iLCJnZW5lcmF0b3IiLCJTSEFET1dfTU9ERSIsIkNPTlRFTlRfR0VORVJBVE9SIiwiTElTU0Jhc2UiLCJvbGR2YWwiLCJuZXd2YWwiLCJXYWl0aW5nRGVmaW5lIiwiaXNQYWdlTG9hZGVkIiwid2hlblBhZ2VMb2FkZWQiLCJmZXRjaFRleHQiLCJleGVjdXRlIiwiTElTU19NT0RFIiwiU1dfUEFUSCIsIkhUTUxVbmtub3duRWxlbWVudCIsImxvYWRDb21wb25lbnQiLCJfd2hlbkRlZmluZWRQcm9taXNlcyIsIktsYXNzIiwiZGVsZXRlIiwicCIsIldlYWtNYXAiLCJzZXQiLCJleGVjdXRlSlMiLCJyZXZva2VPYmplY3RVUkwiLCJoaWRlNDA0IiwiZmV0Y2hDb250ZXh0IiwiZ2xvYmFsVGhpcyIsIkxJU1NDb250ZXh0IiwicGF0aCIsImN3ZCIsInRvU3RyaW5nIiwiZXZlcnkiLCJSZXNwb25zZSIsImRmIiwicmF3IiwidHJhY2UiLCJWMiIsIlYzIl0sInNvdXJjZVJvb3QiOiIifQ==