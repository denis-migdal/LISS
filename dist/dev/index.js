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
/* harmony export */   defineWebComponentV3: () => (/* binding */ defineWebComponentV3)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/V2/extends.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ContentGenerator */ "./src/V2/ContentGenerator.ts");
/* harmony import */ var _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LifeCycle/DEFINED */ "./src/V2/LifeCycle/DEFINED.ts");
/* harmony import */ var V3___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/ */ "./src/V3/index.ts");
/* harmony import */ var V3_LISSAuto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! V3/LISSAuto */ "./src/V3/LISSAuto.ts");





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
        (0,V3_LISSAuto__WEBPACK_IMPORTED_MODULE_4__.importComponentV3)(tagname, {
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

/***/ "./src/V3/LISSAuto.ts":
/*!****************************!*\
  !*** ./src/V3/LISSAuto.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _fetchText: () => (/* binding */ _fetchText),
/* harmony export */   importComponentV3: () => (/* binding */ importComponentV3)
/* harmony export */ });
/* harmony import */ var V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V2/helpers/LISSAuto */ "./src/V2/helpers/LISSAuto.ts");

async function importComponentV3(tagname, { cdir = V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CDIR } = {}) {
    V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__.KnownTags.add(tagname);
    const compo_dir = `${cdir}${tagname}/`;
    const files = {};
    // strats : JS -> Bry -> HTML+CSS (cf script attr).
    // try/catch ?
    const promises = [
        _fetchText(`${compo_dir}index.html`, true),
        _fetchText(`${compo_dir}index.css`, true)
    ];
    [files["html"], files["css"]] = await Promise.all(promises);
    return await (0,V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__.defineWebComponentV3)(tagname, files);
}
// in auto-mode use ServiceWorker to hide 404 error messages.
// if playground files, use them.
async function _fetchText(uri, isLissAuto = false) {
    const fetchContext = globalThis.LISSContext.fetch;
    if (fetchContext !== undefined) {
        const file = fetchContext[uri.toString()];
        if (file !== undefined) return file;
    }
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
*/ //TODO: dev log : parfois dossiers bien major rewrite ou API vers //
// example : playground v3 (?)
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJN0UsT0FBb0I7UUFDcEIsT0FBTyxJQUFJO0lBQ2Y7QUFDSjtBQU9BLFdBQVc7QUFDSSxTQUFTOEksT0FBa0UvQixPQUFnQyxDQUFDLENBQUM7SUFFeEgsTUFBTXhELG9CQUFvQndELEtBQUt4RCxpQkFBaUIsSUFBSTNFLDREQUFnQkE7SUFDcEUsYUFBYTtJQUNiLE1BQU0wUyxhQUErQixJQUFJL04sa0JBQWtCd0Q7SUFFM0QsT0FBTyxNQUFNMEIsY0FBYzJJO1FBQ3ZCdFMsWUFBWXVTLFlBQVlDLFVBQVUsQ0FBRTtZQUNoQyxLQUFLLENBQUNEO1FBQ1Y7SUFDSjtBQUNKOzs7Ozs7O1NDaklBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05zQjtBQUNBO0FBRWYsTUFBTW5PLE9BQU87SUFDaEJxTyxFQUFFQSw2Q0FBQUE7SUFDRkMsRUFBRUEsNkNBQUFBO0FBQ04sRUFBQztBQUNELGlFQUFlRCwyQ0FBRUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvVjIvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xJU1NDb250cm9sZXIudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xpZmVDeWNsZS9ERUZJTkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL0lOSVRJQUxJWkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL1JFQURZLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL1VQR1JBREVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL3N0YXRlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2NvcmUvTGlmZUN5Y2xlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTaGFyZWRDU1MgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgTEhvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIGlzU2hhZG93U3VwcG9ydGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbnR5cGUgSFRNTCA9IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nO1xudHlwZSBDU1MgID0gc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudDtcblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge1xuICAgIGh0bWwgICA/OiBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZyxcbiAgICBjc3MgICAgPzogQ1NTIHwgcmVhZG9ubHkgQ1NTW10sXG4gICAgc2hhZG93ID86IFNoYWRvd0NmZ3xudWxsXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRHZW5lcmF0b3JDc3RyID0geyBuZXcob3B0czogQ29udGVudEdlbmVyYXRvcl9PcHRzKTogQ29udGVudEdlbmVyYXRvciB9O1xuXG5jb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5jb25zdCBzaGFyZWRDU1MgPSBnZXRTaGFyZWRDU1MoKTsgLy8gZnJvbSBMSVNTSG9zdC4uLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgICNzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdO1xuICAgICN0ZW1wbGF0ZSAgIDogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsO1xuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgZGF0YTogYW55O1xuXG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBodG1sLFxuICAgICAgICBjc3MgICAgPSBbXSxcbiAgICAgICAgc2hhZG93ID0gbnVsbCxcbiAgICB9OiBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7fSkge1xuXG4gICAgICAgIHRoaXMuI3NoYWRvdyAgID0gc2hhZG93O1xuICAgICAgICB0aGlzLiN0ZW1wbGF0ZSA9IHRoaXMucHJlcGFyZUhUTUwoaHRtbCk7XG4gICAgXG4gICAgICAgIHRoaXMuI3N0eWxlc2hlZXRzID0gdGhpcy5wcmVwYXJlQ1NTKGNzcyk7XG5cbiAgICAgICAgdGhpcy4jaXNSZWFkeSAgID0gaXNET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIHRoaXMuI3doZW5SZWFkeSA9IHdoZW5ET01Db250ZW50TG9hZGVkKCk7XG5cbiAgICAgICAgLy9UT0RPOiBvdGhlciBkZXBzLi4uXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFRlbXBsYXRlKHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgI3doZW5SZWFkeTogUHJvbWlzZTx1bmtub3duPjtcbiAgICAjaXNSZWFkeSAgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lzUmVhZHk7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKCB0aGlzLiNpc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy4jd2hlblJlYWR5O1xuICAgICAgICAvL1RPRE86IGRlcHMuXG4gICAgICAgIC8vVE9ETzogQ1NTL0hUTUwgcmVzb3VyY2VzLi4uXG5cbiAgICAgICAgLy8gaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cbiAgICAgICAgLy8gX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG4gICAgICAgIC8vICsgY2YgYXQgdGhlIGVuZC4uLlxuICAgIH1cblxuICAgIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuICAgICAgICB0aGlzLmluamVjdENTUyhzaGFkb3csIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBzaGFkb3cuYXBwZW5kKCB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKHNoYWRvdyk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGU8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KTogSFRNTEVsZW1lbnR8U2hhZG93Um9vdCB7XG5cbiAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLiAgICAgXG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pbml0U2hhZG93KGhvc3QpO1xuXG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHRhcmdldCwgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGlmKCBob3N0LnNoYWRvd01vZGUgIT09IFNoYWRvd0NmZy5OT05FIHx8IHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG4gICAgICAgICAgICB0YXJnZXQucmVwbGFjZUNoaWxkcmVuKGNvbnRlbnQpO1xuXG4gICAgICAgIC8vaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgJiYgdGFyZ2V0LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKVxuXHRcdC8vXHR0YXJnZXQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuICAgICAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGhvc3QpO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTaGFkb3c8SG9zdCBleHRlbmRzIExIb3N0Pihob3N0OiBIb3N0KSB7XG5cbiAgICAgICAgY29uc3QgY2FuSGF2ZVNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpO1xuICAgICAgICBpZiggdGhpcy4jc2hhZG93ICE9PSBudWxsICYmIHRoaXMuI3NoYWRvdyAhPT0gU2hhZG93Q2ZnLk5PTkUgJiYgISBjYW5IYXZlU2hhZG93IClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICAgICAgbGV0IG1vZGUgPSB0aGlzLiNzaGFkb3c7XG4gICAgICAgIGlmKCBtb2RlID09PSBudWxsIClcbiAgICAgICAgICAgIG1vZGUgPSBjYW5IYXZlU2hhZG93ID8gU2hhZG93Q2ZnLk9QRU4gOiBTaGFkb3dDZmcuTk9ORTtcblxuICAgICAgICBob3N0LnNoYWRvd01vZGUgPSBtb2RlO1xuXG4gICAgICAgIGxldCB0YXJnZXQ6IEhvc3R8U2hhZG93Um9vdCA9IGhvc3Q7XG4gICAgICAgIGlmKCBtb2RlICE9PSBTaGFkb3dDZmcuTk9ORSlcbiAgICAgICAgICAgIHRhcmdldCA9IGhvc3QuYXR0YWNoU2hhZG93KHttb2RlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUNTUyhjc3M6IENTU3xyZWFkb25seSBDU1NbXSkge1xuICAgICAgICBpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuICAgICAgICAgICAgY3NzID0gW2Nzc107XG5cbiAgICAgICAgcmV0dXJuIGNzcy5tYXAoZSA9PiB0aGlzLnByb2Nlc3NDU1MoZSkgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJvY2Vzc0NTUyhjc3M6IENTUykge1xuXG4gICAgICAgIGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG4gICAgICAgICAgICByZXR1cm4gY3NzO1xuICAgICAgICBpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBjc3Muc2hlZXQhO1xuICAgIFxuICAgICAgICBpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1clwiKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcHJlcGFyZUhUTUwoaHRtbD86IEhUTUwpOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGwge1xuICAgIFxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgaWYoaHRtbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgIC8vIHN0cjJodG1sXG4gICAgICAgIGlmKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gaHRtbC50cmltKCk7XG5cbiAgICAgICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBodG1sIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKVxuICAgICAgICAgICAgaHRtbCA9IGh0bWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIHRlbXBsYXRlLmFwcGVuZChodG1sKTtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIGluamVjdENTUzxIb3N0IGV4dGVuZHMgTEhvc3Q+KHRhcmdldDogU2hhZG93Um9vdHxIb3N0LCBzdHlsZXNoZWV0czogYW55W10pIHtcblxuICAgICAgICBpZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCApIHtcbiAgICAgICAgICAgIHRhcmdldC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MsIC4uLnN0eWxlc2hlZXRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNzc3NlbGVjdG9yID0gdGFyZ2V0LkNTU1NlbGVjdG9yOyAvL1RPRE8uLi5cblxuICAgICAgICBpZiggYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG4gICAgICAgIGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcbiAgICAgICAgZm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcbiAgICAgICAgICAgIGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcbiAgICAgICAgICAgICAgICBodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcbiAgICAgICAgYWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG4gICAgfVxufVxuXG4vLyBpZGVtIEhUTUwuLi5cbi8qIGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBjID0gYXdhaXQgYztcbiAgICAgICAgICAgIGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuICAgICAgICAgICAgICAgIGMgPSBhd2FpdCBjLnRleHQoKTtcblxuICAgICAgICAgICAgc3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG4gICAgICAgIH0pKCkpO1xuXG4gICAgICAgIHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcbiAgICB9XG4qLyIsImltcG9ydCB7IExIb3N0Q3N0ciwgdHlwZSBDbGFzcywgdHlwZSBDb25zdHJ1Y3RvciwgdHlwZSBMSVNTX09wdHMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBidWlsZExJU1NIb3N0LCBzZXRDc3RyQ29udHJvbGVyIH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWV9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8qKioqL1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0Ly8gbm9uLXZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBob3N0OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdC8vIHZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBpc0Nvbm5lY3RlZCAgOmJvb2xlYW47XG59O1xuXHQvLyArIHByb3RlY3RlZFxuXHRcdC8vIHJlYWRvbmx5IC5jb250ZW50OiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Q7XG5cdC8vIHZhbmlsbGEgSlNcblx0XHQvLyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCk6IHZvaWQ7XG5cdFx0Ly8gY29ubmVjdGVkQ2FsbGJhY2sgICAoKTogdm9pZDtcblx0XHQvLyBkaXNjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkO1xuXG5pbnRlcmZhY2UgSUNvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiB7XG5cdG5ldygpOiBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW107XG59XG5cdC8vICsgXCJwcml2YXRlXCJcblx0XHQvLyByZWFkb25seSBIb3N0OiBIb3N0Q3N0clxuXG5leHBvcnQgdHlwZSBDb250cm9sZXI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEluc3RhbmNlVHlwZTxFeHRlbmRzQ3N0cj47XG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlckNzdHI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiA9IElDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4gJiBFeHRlbmRzQ3N0cjtcblxuLyoqKiovXG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPihhcmdzOiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+PiA9IHt9KSB7XG5cblx0bGV0IHtcblx0XHQvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cblx0XHRleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCAgICAgIGFzIHVua25vd24gYXMgRXh0ZW5kc0NzdHIsXG5cdFx0aG9zdCAgICAgICAgICAgICAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRcblx0XHRjb250ZW50X2dlbmVyYXRvciA9IENvbnRlbnRHZW5lcmF0b3IsXG5cdH0gPSBhcmdzO1xuXHRcblx0Y2xhc3MgTElTU0NvbnRyb2xlciBleHRlbmRzIF9leHRlbmRzIGltcGxlbWVudHMgSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+e1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0c2V0Q3N0ckNvbnRyb2xlcih0aGlzKTtcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KC4uLmFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3QuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlczogc3RyaW5nW10gPSBbXTtcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge31cblxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaG9zdC5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogSW5zdGFuY2VUeXBlPExIb3N0Q3N0cjxIb3N0Q3N0cj4+O1xuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgX0hvc3Q6IExIb3N0Q3N0cjxIb3N0Q3N0cj47XG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlOiBmdWNrIG9mZi5cblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QoIHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aG9zdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcmdzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQ29udHJvbGVyIHNhdGlzZmllcyBDb250cm9sZXJDc3RyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj47XG59IiwiaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBTaGFkb3dDZmcsIHR5cGUgTElTU0NvbnRyb2xlckNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tIFwiLi9MaWZlQ3ljbGUvc3RhdGVzXCI7XG5cbi8vIExJU1NIb3N0IG11c3QgYmUgYnVpbGQgaW4gZGVmaW5lIGFzIGl0IG5lZWQgdG8gYmUgYWJsZSB0byBidWlsZFxuLy8gdGhlIGRlZmluZWQgc3ViY2xhc3MuXG5cbmxldCBpZCA9IDA7XG5cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcmVkQ1NTKCkge1xuXHRyZXR1cm4gc2hhcmVkQ1NTO1xufVxuXG5sZXQgX19jc3RyX2NvbnRyb2xlciAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckNvbnRyb2xlcihfOiBhbnkpIHtcblx0X19jc3RyX2NvbnRyb2xlciA9IF87XG59XG5cbnR5cGUgaW5mZXJIb3N0Q3N0cjxUPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cjxpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LCBpbmZlciBCIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA/IEIgOiBuZXZlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XHRUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsIFUgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBpbmZlckhvc3RDc3RyPFQ+ID4oXG5cdFx0XHRcdFx0XHRcdExpc3M6IFQsXG5cdFx0XHRcdFx0XHRcdC8vIGNhbid0IGRlZHVjZSA6IGNhdXNlIHR5cGUgZGVkdWN0aW9uIGlzc3Vlcy4uLlxuXHRcdFx0XHRcdFx0XHRob3N0Q3N0cjogVSxcblx0XHRcdFx0XHRcdFx0Y29udGVudF9nZW5lcmF0b3JfY3N0cjogQ29udGVudEdlbmVyYXRvckNzdHIsXG5cdFx0XHRcdFx0XHRcdGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcblx0XHRcdFx0XHRcdCkge1xuXG5cdGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gbmV3IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIoYXJncyk7XG5cblx0dHlwZSBIb3N0Q3N0ciA9IFU7XG4gICAgdHlwZSBIb3N0ICAgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Y2xhc3MgTElTU0hvc3QgZXh0ZW5kcyBob3N0Q3N0ciB7XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgQ2ZnID0ge1xuXHRcdFx0aG9zdCAgICAgICAgICAgICA6IGhvc3RDc3RyLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIsXG5cdFx0XHRhcmdzXG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IERFUEVOREVOQ0lFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHN0YXRpYyBDb250cm9sZXIgPSBMaXNzO1xuXG5cdFx0I2NvbnRyb2xlcjogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBjb250cm9sZXIoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlciAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdC8vVE9ETzogZ2V0IHJlYWwgVFMgdHlwZSA/XG5cdFx0I3BhcmFtczogYW55W107XG5cdFx0aW5pdGlhbGl6ZSguLi5wYXJhbXM6IGFueVtdKSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgYWxyZWFkeSBpbml0aWFsaXplZCEnKTtcbiAgICAgICAgICAgIGlmKCAhICggdGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzRGVwc1Jlc29sdmVkIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdGlmKCBwYXJhbXMubGVuZ3RoICE9PSAwICkge1xuXHRcdFx0XHRpZiggdGhpcy4jcGFyYW1zLmxlbmd0aCAhPT0gMCApXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDc3RyIHBhcmFtcyBoYXMgYWxyZWFkeSBiZWVuIHByb3ZpZGVkICEnKTtcblx0XHRcdFx0dGhpcy4jcGFyYW1zID0gcGFyYW1zO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNjb250cm9sZXIgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuaXNDb25uZWN0ZWQgKVxuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBDb250ZW50ID09PT09PT09PT09PT09PT09PT1cblxuXHRcdC8vI2ludGVybmFscyA9IHRoaXMuYXR0YWNoSW50ZXJuYWxzKCk7XG5cdFx0Ly8jc3RhdGVzICAgID0gdGhpcy4jaW50ZXJuYWxzLnN0YXRlcztcblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290ID0gdGhpcyBhcyBIb3N0O1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgYXR0YWNoU2hhZG93KGluaXQ6IFNoYWRvd1Jvb3RJbml0KTogU2hhZG93Um9vdCB7XG5cdFx0XHRjb25zdCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3coaW5pdCk7XG5cblx0XHRcdC8vIEB0cy1pZ25vcmUgY2xvc2VkIElTIGFzc2lnbmFibGUgdG8gc2hhZG93TW9kZS4uLlxuXHRcdFx0dGhpcy5zaGFkb3dNb2RlID0gaW5pdC5tb2RlO1xuXG5cdFx0XHR0aGlzLiNjb250ZW50ID0gc2hhZG93O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc2hhZG93O1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2hhZG93TW9kZSAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKC4uLnBhcmFtczogYW55W10pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19VUEdSQURFRCk7XG5cdFx0XHRjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKS50aGVuKCgpID0+IHtcblx0XHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX1JFQURZKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRjb25zdCBjb250cm9sZXIgPSBfX2NzdHJfY29udHJvbGVyO1xuXHRcdFx0X19jc3RyX2NvbnRyb2xlciA9IG51bGw7XG5cblx0XHRcdGlmKCBjb250cm9sZXIgIT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gY29udHJvbGVyO1xuXHRcdFx0XHR0aGlzLmluaXQoKTsgLy8gY2FsbCB0aGUgcmVzb2x2ZXJcblx0XHRcdH1cblxuXHRcdFx0aWYoIFwiX3doZW5VcGdyYWRlZFJlc29sdmVcIiBpbiB0aGlzKVxuXHRcdFx0XHQodGhpcy5fd2hlblVwZ3JhZGVkUmVzb2x2ZSBhcyBhbnkpKCk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PSBET00gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHRcdFxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRpZih0aGlzLmNvbnRyb2xlciAhPT0gbnVsbClcblx0XHRcdFx0dGhpcy5jb250cm9sZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmNvbnRyb2xlciEuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBpbnN0YW5jZSBkZXBzXG5cdFx0XHRpZiggY29udGVudF9nZW5lcmF0b3IuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblxuXHRcdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHR9KSgpO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIExJU1NIb3N0LkNvbnRyb2xlci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG5cdFx0fVxuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZih0aGlzLiNjb250cm9sZXIpXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblx0XHR9XG5cblx0XHRzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbCA9IG51bGw7XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cblx0XHRcdC8vIG5vIG5lZWRzIHRvIHNldCB0aGlzLiNjb250ZW50IChhbHJlYWR5IGhvc3Qgb3Igc2V0IHdoZW4gYXR0YWNoU2hhZG93KVxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3IuZ2VuZXJhdGUodGhpcyk7XG5cblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblxuXHRcdFx0aWYoIHRoaXMuI2NvbnRyb2xlciA9PT0gbnVsbCkge1xuXHRcdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyID0gbmV3IExJU1NIb3N0LkNvbnRyb2xlciguLi50aGlzLiNwYXJhbXMpIGFzIEluc3RhbmNlVHlwZTxUPjtcblx0XHRcdH1cblxuXHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX0lOSVRJQUxJWkVEKTtcblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuY29udHJvbGVyKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29udHJvbGVyO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3Q7XG59XG5cblxuIiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlciwgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SFRNTEVsZW1lbnQ7XG5cbi8vIFRPRE8uLi5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPnxhbnkpIHtcblxuXHRsZXQgSG9zdDogTElTU0hvc3RDc3RyPFQ+ID0gQ29tcG9uZW50Q2xhc3MgYXMgYW55O1xuXG5cdC8vIEJyeXRob24gY2xhc3Ncblx0bGV0IGJyeV9jbGFzczogYW55ID0gbnVsbDtcblx0aWYoIFwiJGlzX2NsYXNzXCIgaW4gQ29tcG9uZW50Q2xhc3MgKSB7XG5cblx0XHRicnlfY2xhc3MgPSBDb21wb25lbnRDbGFzcztcblxuXHRcdENvbXBvbmVudENsYXNzID0gYnJ5X2NsYXNzLl9fYmFzZXNfXy5maWx0ZXIoIChlOiBhbnkpID0+IGUuX19uYW1lX18gPT09IFwiV3JhcHBlclwiKVswXS5fanNfa2xhc3MuJGpzX2Z1bmM7XG5cdFx0KENvbXBvbmVudENsYXNzIGFzIGFueSkuSG9zdC5Db250cm9sZXIgPSBjbGFzcyB7XG5cblx0XHRcdCNicnk6IGFueTtcblxuXHRcdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHR0aGlzLiNicnkgPSBfX0JSWVRIT05fXy4kY2FsbChicnlfY2xhc3MsIFswLDAsMF0pKC4uLmFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHQjY2FsbChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRjYWxsKF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIG5hbWUsIFswLDAsMF0pLCBbMCwwLDBdKSguLi5hcmdzKVxuXHRcdFx0fVxuXG5cdFx0XHRnZXQgaG9zdCgpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgXCJob3N0XCIsIFswLDAsMF0pXG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBicnlfY2xhc3NbXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIl07XG5cblx0XHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0Y29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblx0XHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiZGlzY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYoIFwiSG9zdFwiIGluIENvbXBvbmVudENsYXNzIClcblx0XHRIb3N0ID0gQ29tcG9uZW50Q2xhc3MuSG9zdCBhcyBhbnk7XG5cbiAgICBsZXQgaHRtbHRhZyA9IHVuZGVmaW5lZDtcbiAgICBpZiggXCJDZmdcIiBpbiBIb3N0KSB7XG4gICAgICAgIGNvbnN0IENsYXNzICA9IEhvc3QuQ2ZnLmhvc3Q7XG4gICAgICAgIGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBIb3N0LCBvcHRzKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHJ8TElTU0hvc3Q8TElTU0NvbnRyb2xlcj58TElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+ICk6IHN0cmluZyB7XG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIGlmKCBcImhvc3RcIiBpbiBlbGVtZW50KVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5ob3N0O1xuICAgIGlmKCBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICBjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICBpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8vIGNzdHJcblxuXHRpZiggXCJIb3N0XCIgaW4gZWxlbWVudClcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuSG9zdCBhcyB1bmtub3duIGFzIExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPjtcblxuICAgIGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG4gICAgaWYobmFtZSA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBpcyBub3QgZGVmaW5lZCFcIik7XG5cbiAgICByZXR1cm4gbmFtZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSkgIT09IHVuZGVmaW5lZDtcblxuICAgIGlmKCBcIkhvc3RcIiBpbiBlbGVtKVxuICAgICAgICBlbGVtID0gZWxlbS5Ib3N0IGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0gYXMgYW55KSAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0Q3N0cjxUPj4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlbGVtKTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbGlzdGVuIGRlZmluZS4uLlxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59XG5cbi8qXG4vLyBUT0RPOiBpbXBsZW1lbnRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10pIDogUHJvbWlzZTx2b2lkPiB7XG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG59XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3RDc3RyPFQ+PiB7XG4gICAgLy8gd2UgY2FuJ3QgZm9yY2UgYSBkZWZpbmUuXG4gICAgcmV0dXJuIHdoZW5EZWZpbmVkKGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdENzdHI8VD4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuXG4gICAgICAgIGxldCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pO1xuICAgICAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlbGVtfSBub3QgZGVmaW5lZCB5ZXQhYCk7XG5cbiAgICAgICAgcmV0dXJuIGhvc3QgYXMgdW5rbm93biBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgaWYoIFwiSG9zdFwiIGluIGVsZW0pXG4gICAgICAgIGVsZW0gPSBlbGVtLkhvc3QgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgaWYoIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSBhcyBhbnkpID09PSBudWxsIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2VsZW19IG5vdCBkZWZpbmVkIHlldCFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0Q3N0cjxUPjtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCB3aGVuVXBncmFkZWQgfSBmcm9tIFwiLi9VUEdSQURFRFwiO1xuaW1wb3J0IHsgaXNSZWFkeSwgd2hlblJlYWR5IH0gZnJvbSBcIi4vUkVBRFlcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBMSVNTSG9zdDxUPnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoICEgaXNVcGdyYWRlZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHdoZW5VcGdyYWRlZChlbGVtKTtcblxuICAgIHJldHVybiBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZCBhcyBUO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29udHJvbGVyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG4gICAgYXdhaXQgd2hlblJlYWR5KGhvc3QpO1xuXG4gICAgLy9UT0RPOiBpbml0aWFsaXplU3luYyB2cyBpbml0aWFsaXplID9cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcbiAgICBpZiggISBpc1JlYWR5KGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kYW5jaWVzIG5vdCByZWFkeSAhXCIpXG5cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplICAgICA9IGdldENvbnRyb2xlcjtcbmV4cG9ydCBjb25zdCBpbml0aWFsaXplU3luYyA9IGdldENvbnRyb2xlclN5bmM7IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlYWR5PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgY29uc3QgaG9zdENzdHIgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICByZXR1cm4gaG9zdENzdHIuaXNEZXBzUmVzb2x2ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuUmVhZHk8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IGhvc3RDc3RyID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG4gICAgYXdhaXQgaG9zdENzdHIud2hlbkRlcHNSZXNvbHZlZDtcblxuICAgIHJldHVybiBob3N0Q3N0ci5Db250cm9sZXIgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIC8vIHdlIGNhbid0IGZvcmNlIGEgcmVhZHkuXG4gICAgcmV0dXJuIHdoZW5SZWFkeShlbGVtKSBhcyBQcm9taXNlPFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0clN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGlmKCAhIGlzUmVhZHkoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgcmV0dXJuIGdldEhvc3RDc3RyU3luYyhlbGVtKS5Db250cm9sZXIgYXMgVDtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPF9UIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBIVE1MRWxlbWVudDtcblxuLy9UT0RPOiB1cGdyYWRlIGZ1bmN0aW9uLi4uXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPnxMSVNTSG9zdDxUPik6IGVsZW0gaXMgTElTU0hvc3Q8VD4ge1xuXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgSG9zdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgY29uc3QgSG9zdCA9IGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuXG4gICAgLy8gYWxyZWFkeSB1cGdyYWRlZFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSG9zdClcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG5cbiAgICAvLyBoNGNrXG5cbiAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xuICAgIH1cblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgIFxuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0U3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdDxUPiB7XG4gICAgXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgZGVmaW5lZCAhXCIpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgY29uc3QgdXBncmFkZSAgICAgPSBnZXRIb3N0O1xuZXhwb3J0IGNvbnN0IHVwZ3JhZGVTeW5jID0gZ2V0SG9zdFN5bmMiLCJleHBvcnQgZW51bSBTdGF0ZXMge1xuICAgIExJU1NfREVGSU5FRCAgICAgPSBcIkxJU1NfREVGSU5FRFwiLFxuICAgIExJU1NfVVBHUkFERUQgICAgPSBcIkxJU1NfVVBHUkFERURcIixcbiAgICBMSVNTX1JFQURZICAgICAgID0gXCJMSVNTX1JFQURZXCIsXG4gICAgTElTU19JTklUSUFMSVpFRCA9IFwiTElTU19JTklUSUFMSVpFRFwiXG59IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuXG5pbXBvcnQge1N0YXRlc30gZnJvbSBcIi4uL0xpZmVDeWNsZS9zdGF0ZXMudHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIFN0YXRlcyAgICAgICAgIDogdHlwZW9mIFN0YXRlc1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5TdGF0ZXMgPSBTdGF0ZXM7XG5cblxuaW1wb3J0IHtkZWZpbmUsIGdldE5hbWUsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQsIGdldEhvc3RDc3RyLCBnZXRIb3N0Q3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdGdldEhvc3RDc3RyICAgIDogdHlwZW9mIGdldEhvc3RDc3RyO1xuXHRcdGdldEhvc3RDc3RyU3luYzogdHlwZW9mIGdldEhvc3RDc3RyU3luYztcblx0XHQvLyB3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldEhvc3RDc3RyU3luYz0gZ2V0SG9zdENzdHJTeW5jO1xuXG4vL0xJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcblxuaW1wb3J0IHtpc1JlYWR5LCB3aGVuUmVhZHksIGdldENvbnRyb2xlckNzdHIsIGdldENvbnRyb2xlckNzdHJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1JFQURZXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzUmVhZHkgICAgICA6IHR5cGVvZiBpc1JlYWR5O1xuXHRcdHdoZW5SZWFkeSAgICA6IHR5cGVvZiB3aGVuUmVhZHk7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0ciAgICA6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyO1xuXHRcdGdldENvbnRyb2xlckNzdHJTeW5jOiB0eXBlb2YgZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzUmVhZHkgICAgICAgICAgICAgPSBpc1JlYWR5O1xuTElTUy53aGVuUmVhZHkgICAgICAgICAgID0gd2hlblJlYWR5O1xuTElTUy5nZXRDb250cm9sZXJDc3RyICAgID0gZ2V0Q29udHJvbGVyQ3N0cjtcbkxJU1MuZ2V0Q29udHJvbGVyQ3N0clN5bmM9IGdldENvbnRyb2xlckNzdHJTeW5jO1xuXG5cblxuaW1wb3J0IHtpc1VwZ3JhZGVkLCB3aGVuVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCBnZXRIb3N0LCBnZXRIb3N0U3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9VUEdSQURFRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc1VwZ3JhZGVkICA6IHR5cGVvZiBpc1VwZ3JhZGVkO1xuXHRcdHdoZW5VcGdyYWRlZDogdHlwZW9mIHdoZW5VcGdyYWRlZDtcblx0XHR1cGdyYWRlICAgICA6IHR5cGVvZiB1cGdyYWRlO1xuXHRcdHVwZ3JhZGVTeW5jIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuXHRcdGdldEhvc3QgICAgIDogdHlwZW9mIGdldEhvc3Q7XG5cdFx0Z2V0SG9zdFN5bmMgOiB0eXBlb2YgZ2V0SG9zdFN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzVXBncmFkZWQgID0gaXNVcGdyYWRlZDtcbkxJU1Mud2hlblVwZ3JhZGVkPSB3aGVuVXBncmFkZWQ7XG5MSVNTLnVwZ3JhZGUgICAgID0gdXBncmFkZTtcbkxJU1MudXBncmFkZVN5bmMgPSB1cGdyYWRlU3luYztcbkxJU1MuZ2V0SG9zdCAgICAgPSBnZXRIb3N0O1xuTElTUy5nZXRIb3N0U3luYyA9IGdldEhvc3RTeW5jO1xuXG5cbmltcG9ydCB7aXNJbml0aWFsaXplZCwgd2hlbkluaXRpYWxpemVkLCBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYywgZ2V0Q29udHJvbGVyLCBnZXRDb250cm9sZXJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzSW5pdGlhbGl6ZWQgICAgOiB0eXBlb2YgaXNJbml0aWFsaXplZDtcblx0XHR3aGVuSW5pdGlhbGl6ZWQgIDogdHlwZW9mIHdoZW5Jbml0aWFsaXplZDtcblx0XHRpbml0aWFsaXplICAgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG5cdFx0aW5pdGlhbGl6ZVN5bmMgICA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcblx0XHRnZXRDb250cm9sZXIgICAgIDogdHlwZW9mIGdldENvbnRyb2xlcjtcblx0XHRnZXRDb250cm9sZXJTeW5jIDogdHlwZW9mIGdldENvbnRyb2xlclN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzSW5pdGlhbGl6ZWQgICAgPSBpc0luaXRpYWxpemVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQgID0gd2hlbkluaXRpYWxpemVkO1xuTElTUy5pbml0aWFsaXplICAgICAgID0gaW5pdGlhbGl6ZTtcbkxJU1MuaW5pdGlhbGl6ZVN5bmMgICA9IGluaXRpYWxpemVTeW5jO1xuTElTUy5nZXRDb250cm9sZXIgICAgID0gZ2V0Q29udHJvbGVyO1xuTElTUy5nZXRDb250cm9sZXJTeW5jID0gZ2V0Q29udHJvbGVyU3luYzsiLCJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPik6IFJldHVyblR5cGU8dHlwZW9mIF9leHRlbmRzPEV4dGVuZHNDc3RyLCBPcHRzPj5cbi8vIExJU1NDb250cm9sZXIgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPlxuZXhwb3J0IGZ1bmN0aW9uIExJU1Mob3B0czogYW55ID0ge30pOiBMSVNTQ29udHJvbGVyQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NDb250cm9sZXJDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRlbmRzPFxuICAgICAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgICAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pIHtcblxuICAgIGlmKCBvcHRzLmV4dGVuZHMgPT09IHVuZGVmaW5lZCkgLy8gaDRja1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGEgTElTU0NvbnRyb2xlciEnKTtcblxuICAgIGNvbnN0IGNmZyA9IG9wdHMuZXh0ZW5kcy5Ib3N0LkNmZztcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgY2ZnLCBjZmcuYXJncywgb3B0cyk7XG5cbiAgICBjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBvcHRzLmV4dGVuZHMhIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgb3ZlcnJpZGUgX0hvc3Q6IExJU1NIb3N0PEV4dGVuZGVkTElTUz47XG5cbiAgICAgICAgLy8gVFMgaXMgc3R1cGlkLCByZXF1aXJlcyBleHBsaWNpdCByZXR1cm4gdHlwZVxuXHRcdHN0YXRpYyBvdmVycmlkZSBnZXQgSG9zdCgpOiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+IHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBmdWNrIG9mZlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuaG9zdCEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250ZW50X2dlbmVyYXRvciEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59IiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIExIb3N0LCBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4uL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCB7IGRlZmluZSB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuaW1wb3J0IExJU1N2MyBmcm9tIFwiVjMvXCI7XG5pbXBvcnQgeyBpbXBvcnRDb21wb25lbnRWMyB9IGZyb20gXCJWMy9MSVNTQXV0b1wiO1xuXG5leHBvcnQgY29uc3QgS25vd25UYWdzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbmxldCBzY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pignc2NyaXB0W2F1dG9kaXJdJyk7XG5pZiggc2NyaXB0ID09PSBudWxsKVxuXHRzY3JpcHQgPSAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ3NjcmlwdFtsaXNzLW1vZGU9XCJhdXRvLWxvYWRcIl0nKTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ0RJUiA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdhdXRvZGlyJykgPz8gc2NyaXB0Py5nZXRBdHRyaWJ1dGUoJ2xpc3MtY2RpcicpID8/IG51bGw7XG5cbmlmKHNjcmlwdCAhPT0gbnVsbClcblx0YXV0b2xvYWQoc2NyaXB0KVxuXG5cbmZ1bmN0aW9uIGF1dG9sb2FkKHNjcmlwdDogSFRNTEVsZW1lbnQpIHtcblxuXHRsZXQgY2RpcjogbnVsbHxzdHJpbmcgPSBERUZBVUxUX0NESVI7XG5cblx0Y29uc3QgU1c6IFByb21pc2U8dm9pZD4gPSBuZXcgUHJvbWlzZSggYXN5bmMgKHJlc29sdmUpID0+IHtcblxuXHRcdGNvbnN0IHN3X3BhdGggPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdzdycpO1xuXG5cdFx0aWYoIHN3X3BhdGggPT09IG51bGwgKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJZb3UgYXJlIHVzaW5nIExJU1MgQXV0byBtb2RlIHdpdGhvdXQgc3cuanMuXCIpO1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc3dfcGF0aCwge3Njb3BlOiBcIi9cIn0pO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiUmVnaXN0cmF0aW9uIG9mIFNlcnZpY2VXb3JrZXIgZmFpbGVkXCIpO1xuXHRcdFx0Y29uc29sZS5lcnJvcihlKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9XG5cblx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRjZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpITtcblxuXHRsZXQgYWRkVGFnID0gYWRkVGFnVjI7XG5cblx0aWYoIGNkaXIgPT09IG51bGwpIHtcblx0XHRjZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnbGlzcy1jZGlyJykhO1xuXHRcdGFkZFRhZyA9IGFkZFRhZ1YzO1xuXHR9XG5cblxuXG5cdGlmKCBjZGlyW2NkaXIubGVuZ3RoLTFdICE9PSAnLycpXG5cdFx0Y2RpciArPSAnLyc7XG5cblx0Y29uc3QgYnJ5dGhvbiA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJicnl0aG9uXCIpO1xuXG5cdC8vIG9ic2VydmUgZm9yIG5ldyBpbmplY3RlZCB0YWdzLlxuXHRuZXcgTXV0YXRpb25PYnNlcnZlciggKG11dGF0aW9ucykgPT4ge1xuXHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuXHRcdFx0XHRcdGFkZFRhZyhhZGRpdGlvbilcblxuXHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIqXCIpIClcblx0XHRhZGRUYWcoIGVsZW0gKTtcblxuXHRhc3luYyBmdW5jdGlvbiBhZGRUYWdWMih0YWc6IEhUTUxFbGVtZW50KSB7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IHRhZ25hbWUgPSAoIHRhZy5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gdGFnLnRhZ05hbWUgKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0bGV0IGhvc3QgPSBIVE1MRWxlbWVudDtcblx0XHRpZiggdGFnLmhhc0F0dHJpYnV0ZSgnaXMnKSApXG5cdFx0XHRob3N0ID0gdGFnLmNvbnN0cnVjdG9yIGFzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuXG5cdFx0aWYoICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IEtub3duVGFncy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpbXBvcnRDb21wb25lbnQodGFnbmFtZSwge1xuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGNkaXIsXG5cdFx0XHRob3N0XG5cdFx0fSk7XHRcdFxuXHR9XG5cblx0YXN5bmMgZnVuY3Rpb24gYWRkVGFnVjModGFnOiBIVE1MRWxlbWVudCkge1xuXG5cdFx0YXdhaXQgU1c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cblx0XHRjb25zdCB0YWduYW1lID0gdGFnLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmKCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCBLbm93blRhZ3MuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aW1wb3J0Q29tcG9uZW50VjModGFnbmFtZSwge1xuXHRcdFx0Ly9icnl0aG9uLFxuXHRcdFx0Y2RpclxuXHRcdH0pO1x0XHRcblx0fVxufVxuXG4vL1RPRE86IHJlbmFtZSBmcm9tIGZpbGVzID9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWZpbmVXZWJDb21wb25lbnRWMyh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG5cblx0bGV0IGtsYXNzID0gTElTU3YzKHtcblx0XHRjb250ZW50X2dlbmVyYXRvcjogTElTU0F1dG9fQ29udGVudEdlbmVyYXRvcixcblx0XHQuLi5maWxlc1xuXHR9KTtcblxuXHQvLyB0b2RvIGJyeS4uLiBcblx0Ly9UT0RPOiB0YWduYW1lIGluIHYzXG5cblx0Ly8gVE9ETy4uLi5cblx0Lypcblx0Y29uc3QgY19qcyAgICAgID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdGlmKCBjX2pzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NfanNdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcblx0XHRjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuXHRcdGNvbnN0IG9sZHJlcSA9IExJU1MucmVxdWlyZTtcblxuXHRcdExJU1MucmVxdWlyZSA9IGZ1bmN0aW9uKHVybDogVVJMfHN0cmluZykge1xuXG5cdFx0XHRpZiggdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiAmJiB1cmwuc3RhcnRzV2l0aCgnLi8nKSApIHtcblx0XHRcdFx0Y29uc3QgZmlsZW5hbWUgPSB1cmwuc2xpY2UoMik7XG5cdFx0XHRcdGlmKCBmaWxlbmFtZSBpbiBmaWxlcylcblx0XHRcdFx0XHRyZXR1cm4gZmlsZXNbZmlsZW5hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb2xkcmVxKHVybCk7XG5cdFx0fVxuXG5cdFx0a2xhc3MgPSAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8vKiB1cmwpKS5kZWZhdWx0O1xuXG5cdFx0TElTUy5yZXF1aXJlID0gb2xkcmVxO1xuXHR9XG5cdGVsc2UgaWYoIG9wdHMuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0a2xhc3MgPSBMSVNTKHtcblx0XHRcdC4uLm9wdHMsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogTElTU0F1dG9fQ29udGVudEdlbmVyYXRvclxuXHRcdH0pO1xuXHR9XG5cblx0aWYoa2xhc3MgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGZpbGVzIGZvciBXZWJDb21wb25lbnQgJHt0YWduYW1lfS5gKTtcbiovXG5cblx0ZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuXHRyZXR1cm4ga2xhc3M7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiB7aHRtbDogc3RyaW5nLCBjc3M6IHN0cmluZywgaG9zdDogQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+fSkge1xuXG5cdGNvbnN0IGNfanMgICAgICA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cdG9wdHMuaHRtbCAgICAgPz89IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblxuXHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0aWYoIGNfanMgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGNvbnN0IGZpbGUgPSBuZXcgQmxvYihbY19qc10sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pO1xuXHRcdGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG5cdFx0Y29uc3Qgb2xkcmVxID0gTElTUy5yZXF1aXJlO1xuXG5cdFx0TElTUy5yZXF1aXJlID0gZnVuY3Rpb24odXJsOiBVUkx8c3RyaW5nKSB7XG5cblx0XHRcdGlmKCB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiICYmIHVybC5zdGFydHNXaXRoKCcuLycpICkge1xuXHRcdFx0XHRjb25zdCBmaWxlbmFtZSA9IHVybC5zbGljZSgyKTtcblx0XHRcdFx0aWYoIGZpbGVuYW1lIGluIGZpbGVzKVxuXHRcdFx0XHRcdHJldHVybiBmaWxlc1tmaWxlbmFtZV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvbGRyZXEodXJsKTtcblx0XHR9XG5cblx0XHRrbGFzcyA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKS5kZWZhdWx0O1xuXG5cdFx0TElTUy5yZXF1aXJlID0gb2xkcmVxO1xuXHR9XG5cdGVsc2UgaWYoIG9wdHMuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0a2xhc3MgPSBMSVNTKHtcblx0XHRcdC4uLm9wdHMsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogTElTU0F1dG9fQ29udGVudEdlbmVyYXRvclxuXHRcdH0pO1xuXHR9XG5cblx0aWYoIGtsYXNzID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuXG5cdGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cblx0cmV0dXJuIGtsYXNzO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIGludGVybmFsIHRvb2xzID09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRjb25zdCBhbnN3ZXIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cblx0aWYoYW5zd2VyID09PSBcIlwiKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIGFuc3dlclxufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn1cblxuXG5jb25zdCBjb252ZXJ0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbmZ1bmN0aW9uIGVuY29kZUhUTUwodGV4dDogc3RyaW5nKSB7XG5cdGNvbnZlcnRlci50ZXh0Q29udGVudCA9IHRleHQ7XG5cdHJldHVybiBjb252ZXJ0ZXIuaW5uZXJIVE1MO1xufVxuXG5leHBvcnQgY2xhc3MgTElTU0F1dG9fQ29udGVudEdlbmVyYXRvciBleHRlbmRzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG5cdHByb3RlY3RlZCBvdmVycmlkZSBwcmVwYXJlSFRNTChodG1sPzogRG9jdW1lbnRGcmFnbWVudCB8IEhUTUxFbGVtZW50IHwgc3RyaW5nKSB7XG5cdFx0XG5cdFx0dGhpcy5kYXRhID0gbnVsbDtcblxuXHRcdGlmKCB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycgKSB7XG5cblx0XHRcdHRoaXMuZGF0YSA9IGh0bWw7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdC8qXG5cdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHJldHVybiBgPGxpc3MgdmFsdWU9XCIke25hbWV9XCI+PC9saXNzPmA7XG5cdFx0XHR9KTsqL1xuXG5cdFx0XHQvL1RPRE86ICR7fSBpbiBhdHRyXG5cdFx0XHRcdC8vIC0gZGV0ZWN0IHN0YXJ0ICR7ICsgZW5kIH1cblx0XHRcdFx0Ly8gLSByZWdpc3RlciBlbGVtICsgYXR0ciBuYW1lXG5cdFx0XHRcdC8vIC0gcmVwbGFjZS4gXG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBzdXBlci5wcmVwYXJlSFRNTChodG1sKTtcblx0fVxuXG5cdG92ZXJyaWRlIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKGhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdHN1cGVyLmZpbGxDb250ZW50KHNoYWRvdyk7XG5cblx0XHQvKlxuXHRcdC8vIGh0bWwgbWFnaWMgdmFsdWVzIGNvdWxkIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdH1cblxuXHRvdmVycmlkZSBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudCB8IFNoYWRvd1Jvb3Qge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKGhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbnRlbnQgPSBzdXBlci5nZW5lcmF0ZShob3N0KTtcblxuXHRcdC8qXG5cdFx0Ly8gaHRtbCBtYWdpYyB2YWx1ZXMuXG5cdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdFx0Ly8gY3NzIHByb3AuXG5cdFx0Y29uc3QgY3NzX2F0dHJzID0gaG9zdC5nZXRBdHRyaWJ1dGVOYW1lcygpLmZpbHRlciggZSA9PiBlLnN0YXJ0c1dpdGgoJ2Nzcy0nKSk7XG5cdFx0Zm9yKGxldCBjc3NfYXR0ciBvZiBjc3NfYXR0cnMpXG5cdFx0XHRob3N0LnN0eWxlLnNldFByb3BlcnR5KGAtLSR7Y3NzX2F0dHIuc2xpY2UoJ2Nzcy0nLmxlbmd0aCl9YCwgaG9zdC5nZXRBdHRyaWJ1dGUoY3NzX2F0dHIpKTtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBpbXBvcnRDb21wb25lbnRzIDogdHlwZW9mIGltcG9ydENvbXBvbmVudHM7XG4gICAgICAgIGltcG9ydENvbXBvbmVudCAgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50O1xuICAgICAgICByZXF1aXJlICAgICAgICAgIDogdHlwZW9mIHJlcXVpcmU7XG4gICAgfVxufVxuXG50eXBlIGltcG9ydENvbXBvbmVudHNfT3B0czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGwsXG5cdGJyeXRob24/OiBzdHJpbmd8bnVsbCxcblx0aG9zdCAgID86IENvbnN0cnVjdG9yPFQ+XG59O1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0XHRcdFx0XHRcdGNvbXBvbmVudHM6IHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdFx0XHRcdFx0XHRicnl0aG9uID0gbnVsbCxcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnRcblx0XHRcdFx0XHRcdH06IGltcG9ydENvbXBvbmVudHNfT3B0czxUPikge1xuXG5cdGNvbnN0IHJlc3VsdHM6IFJlY29yZDxzdHJpbmcsIExJU1NDb250cm9sZXJDc3RyPiA9IHt9O1xuXG5cdGZvcihsZXQgdGFnbmFtZSBvZiBjb21wb25lbnRzKSB7XG5cblx0XHRyZXN1bHRzW3RhZ25hbWVdID0gYXdhaXQgaW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdGNkaXIsXG5cdFx0XHRicnl0aG9uLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmNvbnN0IGJyeV93cmFwcGVyID0gYGZyb20gYnJvd3NlciBpbXBvcnQgc2VsZlxuXG5kZWYgd3JhcGpzKGpzX2tsYXNzKTpcblxuXHRjbGFzcyBXcmFwcGVyOlxuXG5cdFx0X2pzX2tsYXNzID0ganNfa2xhc3Ncblx0XHRfanMgPSBOb25lXG5cblx0XHRkZWYgX19pbml0X18odGhpcywgKmFyZ3MpOlxuXHRcdFx0dGhpcy5fanMgPSBqc19rbGFzcy5uZXcoKmFyZ3MpXG5cblx0XHRkZWYgX19nZXRhdHRyX18odGhpcywgbmFtZTogc3RyKTpcblx0XHRcdHJldHVybiB0aGlzLl9qc1tuYW1lXTtcblxuXHRcdGRlZiBfX3NldGF0dHJfXyh0aGlzLCBuYW1lOiBzdHIsIHZhbHVlKTpcblx0XHRcdGlmIG5hbWUgPT0gXCJfanNcIjpcblx0XHRcdFx0c3VwZXIoKS5fX3NldGF0dHJfXyhuYW1lLCB2YWx1ZSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR0aGlzLl9qc1tuYW1lXSA9IHZhbHVlXG5cdFxuXHRyZXR1cm4gV3JhcHBlclxuXG5zZWxmLndyYXBqcyA9IHdyYXBqc1xuYDtcblxuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdGJyeXRob24gPSBudWxsLFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnQsXG5cdFx0ZmlsZXMgICA9IG51bGxcblx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+ICYge2ZpbGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPnxudWxsfSA9IHt9XG4pIHtcblxuXHRLbm93blRhZ3MuYWRkKHRhZ25hbWUpO1xuXG5cdGNvbnN0IGNvbXBvX2RpciA9IGAke2NkaXJ9JHt0YWduYW1lfS9gO1xuXG5cdGlmKCBmaWxlcyA9PT0gbnVsbCApIHtcblx0XHRmaWxlcyA9IHt9O1xuXG5cdFx0Y29uc3QgZmlsZSA9IGJyeXRob24gPT09IFwidHJ1ZVwiID8gJ2luZGV4LmJyeScgOiAnaW5kZXguanMnO1xuXG5cdFx0ZmlsZXNbZmlsZV0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9JHtmaWxlfWAsIHRydWUpKSE7XG5cblx0XHQvL1RPRE8hISFcblx0XHR0cnkge1xuXHRcdFx0ZmlsZXNbXCJpbmRleC5odG1sXCJdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4Lmh0bWxgLCB0cnVlKSkhO1xuXHRcdH0gY2F0Y2goZSkge1xuXG5cdFx0fVxuXHRcdHRyeSB7XG5cdFx0XHRmaWxlc1tcImluZGV4LmNzc1wiIF0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguY3NzYCAsIHRydWUpKSE7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHRpZiggYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgJiYgZmlsZXNbJ2luZGV4LmJyeSddICE9PSB1bmRlZmluZWQpIHtcblxuXHRcdGNvbnN0IGNvZGUgPSBmaWxlc1tcImluZGV4LmJyeVwiXTtcblxuXHRcdGZpbGVzWydpbmRleC5qcyddID1cbmBjb25zdCAkQiA9IGdsb2JhbFRoaXMuX19CUllUSE9OX187XG5cbiRCLnJ1blB5dGhvblNvdXJjZShcXGAke2JyeV93cmFwcGVyfVxcYCwgXCJfXCIpO1xuJEIucnVuUHl0aG9uU291cmNlKFxcYCR7Y29kZX1cXGAsIFwiX1wiKTtcblxuY29uc3QgbW9kdWxlID0gJEIuaW1wb3J0ZWRbXCJfXCJdO1xuZXhwb3J0IGRlZmF1bHQgbW9kdWxlLldlYkNvbXBvbmVudDtcblxuYDtcblx0fVxuXG5cdGNvbnN0IGh0bWwgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cdGNvbnN0IGNzcyAgPSBmaWxlc1tcImluZGV4LmNzc1wiXTtcblxuXHRyZXR1cm4gYXdhaXQgZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWUsIGZpbGVzLCB7aHRtbCwgY3NzLCBob3N0fSk7XG59XG5cbmZ1bmN0aW9uIHJlcXVpcmUodXJsOiBVUkx8c3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT58c3RyaW5nIHtcblx0cmV0dXJuIGZldGNoKHVybCk7XG59XG5cblxuTElTUy5pbXBvcnRDb21wb25lbnRzID0gaW1wb3J0Q29tcG9uZW50cztcbkxJU1MuaW1wb3J0Q29tcG9uZW50ICA9IGltcG9ydENvbXBvbmVudDtcbkxJU1MucmVxdWlyZSAgPSByZXF1aXJlOyIsImltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9JTklUSUFMSVpFRFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oZWxlbSk7XG59IiwiXG5pbXBvcnQgeyBDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG50eXBlIExpc3RlbmVyRmN0PFQgZXh0ZW5kcyBFdmVudD4gPSAoZXY6IFQpID0+IHZvaWQ7XG50eXBlIExpc3RlbmVyT2JqPFQgZXh0ZW5kcyBFdmVudD4gPSB7IGhhbmRsZUV2ZW50OiBMaXN0ZW5lckZjdDxUPiB9O1xudHlwZSBMaXN0ZW5lcjxUIGV4dGVuZHMgRXZlbnQ+ID0gTGlzdGVuZXJGY3Q8VD58TGlzdGVuZXJPYmo8VD47XG5cbmV4cG9ydCBjbGFzcyBFdmVudFRhcmdldDI8RXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgRXZlbnQ+PiBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcblxuXHRvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgY2FsbGJhY2s6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIG9wdGlvbnM/OiBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyB8IGJvb2xlYW4pOiB2b2lkIHtcblx0XHRcblx0XHQvL0B0cy1pZ25vcmVcblx0XHRyZXR1cm4gc3VwZXIuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cdH1cblxuXHRvdmVycmlkZSBkaXNwYXRjaEV2ZW50PFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KGV2ZW50OiBFdmVudHNbVF0pOiBib29sZWFuIHtcblx0XHRyZXR1cm4gc3VwZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH1cblxuXHRvdmVycmlkZSByZW1vdmVFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IGxpc3RlbmVyOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgb3B0aW9ucz86IGJvb2xlYW58QWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkIHtcblxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHN1cGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21FdmVudDI8VCBleHRlbmRzIHN0cmluZywgQXJncz4gZXh0ZW5kcyBDdXN0b21FdmVudDxBcmdzPiB7XG5cblx0Y29uc3RydWN0b3IodHlwZTogVCwgYXJnczogQXJncykge1xuXHRcdHN1cGVyKHR5cGUsIHtkZXRhaWw6IGFyZ3N9KTtcblx0fVxuXG5cdG92ZXJyaWRlIGdldCB0eXBlKCk6IFQgeyByZXR1cm4gc3VwZXIudHlwZSBhcyBUOyB9XG59XG5cbnR5cGUgSW5zdGFuY2VzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+PiA9IHtcblx0W0sgaW4ga2V5b2YgVF06IEluc3RhbmNlVHlwZTxUW0tdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gV2l0aEV2ZW50czxUIGV4dGVuZHMgb2JqZWN0LCBFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+ID4oZXY6IENvbnN0cnVjdG9yPFQ+LCBfZXZlbnRzOiBFdmVudHMpIHtcblxuXHR0eXBlIEV2dHMgPSBJbnN0YW5jZXM8RXZlbnRzPjtcblxuXHRpZiggISAoZXYgaW5zdGFuY2VvZiBFdmVudFRhcmdldCkgKVxuXHRcdHJldHVybiBldiBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG5cblx0Ly8gaXMgYWxzbyBhIG1peGluXG5cdC8vIEB0cy1pZ25vcmVcblx0Y2xhc3MgRXZlbnRUYXJnZXRNaXhpbnMgZXh0ZW5kcyBldiB7XG5cblx0XHQjZXYgPSBuZXcgRXZlbnRUYXJnZXQyPEV2dHM+KCk7XG5cblx0XHRhZGRFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5hZGRFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRyZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5yZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRkaXNwYXRjaEV2ZW50KC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5kaXNwYXRjaEV2ZW50KC4uLmFyZ3MpO1xuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIEV2ZW50VGFyZ2V0TWl4aW5zIGFzIHVua25vd24gYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIFNoYWRvd1Jvb3QgdG9vbHMgPT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50TWF0Y2hlcyhldjogRXZlbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcblxuXHRsZXQgZWxlbWVudHMgPSBldi5jb21wb3NlZFBhdGgoKS5zbGljZSgwLC0yKS5maWx0ZXIoZSA9PiAhIChlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgKS5yZXZlcnNlKCkgYXMgSFRNTEVsZW1lbnRbXTtcblxuXHRmb3IobGV0IGVsZW0gb2YgZWxlbWVudHMgKVxuXHRcdGlmKGVsZW0ubWF0Y2hlcyhzZWxlY3RvcikgKVxuXHRcdFx0cmV0dXJuIGVsZW07IFxuXG5cdHJldHVybiBudWxsO1xufSIsIlxuaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50cyB7fTtcblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmltcG9ydCB7IGluaXRpYWxpemVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgLy8gYXN5bmNcbiAgICAgICAgcXMgOiB0eXBlb2YgcXM7XG4gICAgICAgIHFzbzogdHlwZW9mIHFzbztcbiAgICAgICAgcXNhOiB0eXBlb2YgcXNhO1xuICAgICAgICBxc2M6IHR5cGVvZiBxc2M7XG5cbiAgICAgICAgLy8gc3luY1xuICAgICAgICBxc1N5bmMgOiB0eXBlb2YgcXNTeW5jO1xuICAgICAgICBxc2FTeW5jOiB0eXBlb2YgcXNhU3luYztcbiAgICAgICAgcXNjU3luYzogdHlwZW9mIHFzY1N5bmM7XG5cblx0XHRjbG9zZXN0OiB0eXBlb2YgY2xvc2VzdDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3Nfc2VsZWN0b3IobmFtZT86IHN0cmluZykge1xuXHRpZihuYW1lID09PSB1bmRlZmluZWQpIC8vIGp1c3QgYW4gaDRja1xuXHRcdHJldHVybiBcIlwiO1xuXHRyZXR1cm4gYDppcygke25hbWV9LCBbaXM9XCIke25hbWV9XCJdKWA7XG59XG5cbmZ1bmN0aW9uIF9idWlsZFFTKHNlbGVjdG9yOiBzdHJpbmcsIHRhZ25hbWVfb3JfcGFyZW50Pzogc3RyaW5nIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LCBwYXJlbnQ6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cdFxuXHRpZiggdGFnbmFtZV9vcl9wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGFnbmFtZV9vcl9wYXJlbnQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cGFyZW50ID0gdGFnbmFtZV9vcl9wYXJlbnQ7XG5cdFx0dGFnbmFtZV9vcl9wYXJlbnQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRyZXR1cm4gW2Ake3NlbGVjdG9yfSR7bGlzc19zZWxlY3Rvcih0YWduYW1lX29yX3BhcmVudCBhcyBzdHJpbmd8dW5kZWZpbmVkKX1gLCBwYXJlbnRdIGFzIGNvbnN0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGxldCByZXN1bHQgPSBhd2FpdCBxc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFRbXT47XG5hc3luYyBmdW5jdGlvbiBxc2E8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl1bXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPFQ+PiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRwcm9taXNlc1tpZHgrK10gPSB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4ocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPihyZXN1bHQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2xvc2VzdDxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCkge1xuXG5cdHdoaWxlKHRydWUpIHtcblx0XHR2YXIgcmVzdWx0ID0gZWxlbWVudC5jbG9zZXN0PEU+KHNlbGVjdG9yKTtcblxuXHRcdGlmKCByZXN1bHQgIT09IG51bGwpXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcblx0XHRpZiggISAoXCJob3N0XCIgaW4gcm9vdCkgKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRlbGVtZW50ID0gKHJvb3QgYXMgU2hhZG93Um9vdCkuaG9zdDtcblx0fVxufVxuXG5cbi8vIGFzeW5jXG5MSVNTLnFzICA9IHFzO1xuTElTUy5xc28gPSBxc287XG5MSVNTLnFzYSA9IHFzYTtcbkxJU1MucXNjID0gcXNjO1xuXG4vLyBzeW5jXG5MSVNTLnFzU3luYyAgPSBxc1N5bmM7XG5MSVNTLnFzYVN5bmMgPSBxc2FTeW5jO1xuTElTUy5xc2NTeW5jID0gcXNjU3luYztcblxuTElTUy5jbG9zZXN0ID0gY2xvc2VzdDsiLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbmltcG9ydCBcIi4vY29yZS9MaWZlQ3ljbGVcIjtcblxuZXhwb3J0IHtkZWZhdWx0IGFzIENvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLy9UT0RPOiBldmVudHMudHNcbi8vVE9ETzogZ2xvYmFsQ1NTUnVsZXNcbmV4cG9ydCB7TElTU0F1dG9fQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vaGVscGVycy9MSVNTQXV0b1wiO1xuaW1wb3J0IFwiLi9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzXCI7XG5cbmV4cG9ydCB7U2hhZG93Q2ZnfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQge2xpc3MsIGxpc3NTeW5jfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5leHBvcnQge2V2ZW50TWF0Y2hlcywgV2l0aEV2ZW50cywgRXZlbnRUYXJnZXQyLCBDdXN0b21FdmVudDJ9IGZyb20gJy4vaGVscGVycy9ldmVudHMnO1xuZXhwb3J0IHtodG1sfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUztcblxuLy8gZm9yIGRlYnVnLlxuZXhwb3J0IHtfZXh0ZW5kc30gZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG4vLyByZXF1aXJlZCBmb3IgYXV0byBtb2RlIGl0IHNlZW1zLlxuLy8gQHRzLWlnbm9yZVxuZ2xvYmFsVGhpcy5MSVNTID0gTElTUzsiLCJpbXBvcnQgdHlwZSB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IHtcbiAgICAgICAgZXh0ZW5kczogRXh0ZW5kc0N0ciwgLy8gSlMgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0ciwgICAvLyBIVE1MIEhvc3RcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxufSAmIENvbnRlbnRHZW5lcmF0b3JfT3B0cztcblxuLy9UT0RPOiByZXdyaXRlLi4uXG4vLyBMSVNTQ29udHJvbGVyXG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXJDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBJbnN0YW5jZVR5cGU8TElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyMkxJU1NDb250cm9sZXJDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPFxuICAgICAgICAgICAgaW5mZXIgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0cixIb3N0Q3N0cj4gOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyID0gTElTU0NvbnRyb2xlcj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyID8gTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47XG5cbi8vIGxpZ2h0ZXIgTElTU0hvc3QgZGVmIHRvIGF2b2lkIHR5cGUgaXNzdWVzLi4uXG5leHBvcnQgdHlwZSBMSG9zdDxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG5cbiAgICBjb250ZW50OiBTaGFkb3dSb290fEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICBzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIENTU1NlbGVjdG9yOiBzdHJpbmc7XG5cbn0gJiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5leHBvcnQgdHlwZSBMSG9zdENzdHI8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuICAgIG5ldyguLi5hcmdzOiBhbnkpOiBMSG9zdDxIb3N0Q3N0cj47XG5cbiAgICBDZmc6IHtcbiAgICAgICAgaG9zdCAgICAgICAgICAgICA6IEhvc3RDc3RyLFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG4gICAgICAgIGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcbiAgICB9XG5cbn0gJiBIb3N0Q3N0cjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cbiAgICBpZiggQ2xhc3MgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgQ2xhc3MgPSBDbGFzcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgSFRNTEVsZW1lbnQ7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cbiAgICBsZXQgY3Vyc29yID0gQ2xhc3M7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdoaWxlIChjdXJzb3IuX19wcm90b19fICE9PSBIVE1MRWxlbWVudClcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjdXJzb3IgPSBjdXJzb3IuX19wcm90b19fO1xuXG4gICAgLy8gZGlyZWN0bHkgaW5oZXJpdCBIVE1MRWxlbWVudFxuICAgIGlmKCAhIGN1cnNvci5uYW1lLnN0YXJ0c1dpdGgoJ0hUTUwnKSAmJiAhIGN1cnNvci5uYW1lLmVuZHNXaXRoKCdFbGVtZW50JykgKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGh0bWx0YWcgPSBjdXJzb3IubmFtZS5zbGljZSg0LCAtNyk7XG5cblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IEhUTUxFbGVtZW50IHwgdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuLypcbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlclxuKi9cblxuLy8gbW92ZWQgaGVyZSBpbnN0ZWFkIG9mIGJ1aWxkIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwcy5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59IiwiaW1wb3J0IHsgREVGQVVMVF9DRElSLCBkZWZpbmVXZWJDb21wb25lbnRWMywgS25vd25UYWdzIH0gZnJvbSBcIlYyL2hlbHBlcnMvTElTU0F1dG9cIjtcblxudHlwZSBpbXBvcnRDb21wb25lbnRzX09wdHNWMzxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGxcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnRWMzxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdHRhZ25hbWU6IHN0cmluZyxcblx0e1xuXHRcdGNkaXIgICAgPSBERUZBVUxUX0NESVIsXG5cdFx0Ly8gYnJ5dGhvbiA9IG51bGxcblx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzVjM8VD4gPSB7fVxuKSB7XG5cblx0S25vd25UYWdzLmFkZCh0YWduYW1lKTtcblxuXHRjb25zdCBjb21wb19kaXIgPSBgJHtjZGlyfSR7dGFnbmFtZX0vYDtcblxuXHRjb25zdCBmaWxlczogUmVjb3JkPHN0cmluZyxzdHJpbmd8dW5kZWZpbmVkPiA9IHt9O1xuXG5cdC8vIHN0cmF0cyA6IEpTIC0+IEJyeSAtPiBIVE1MK0NTUyAoY2Ygc2NyaXB0IGF0dHIpLlxuXG5cdC8vIHRyeS9jYXRjaCA/XG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXG4gICAgICAgIF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4Lmh0bWxgLCB0cnVlKSEsXG4gICAgICAgIF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4LmNzc2AgLCB0cnVlKSFcbiAgICBdO1xuXHRbZmlsZXNbXCJodG1sXCJdLCBmaWxlc1tcImNzc1wiIF1dID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnRWMyh0YWduYW1lLCBmaWxlcyk7XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICB2YXIgTElTU0NvbnRleHQ6IHtcbiAgICAgICAgZmV0Y2g/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XG4gICAgfVxufVxuXG4vLyBpbiBhdXRvLW1vZGUgdXNlIFNlcnZpY2VXb3JrZXIgdG8gaGlkZSA0MDQgZXJyb3IgbWVzc2FnZXMuXG4vLyBpZiBwbGF5Z3JvdW5kIGZpbGVzLCB1c2UgdGhlbS5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cbiAgICBjb25zdCBmZXRjaENvbnRleHQgPSBnbG9iYWxUaGlzLkxJU1NDb250ZXh0LmZldGNoO1xuICAgIGlmKCBmZXRjaENvbnRleHQgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IGZldGNoQ29udGV4dFt1cmkudG9TdHJpbmcoKV07XG4gICAgICAgIGlmKGZpbGUgIT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuICAgICAgICAgICAgICAgICAgICAgICAgPyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7fTtcblxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuICAgIGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cbiAgICBpZihhbnN3ZXIgPT09IFwiXCIpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gYW5zd2VyXG59IiwiLypcbiAxLiBvdmVycmlkZSBmZXRjaC9pbXBvcnQvd2hhdGV2ZXJcbiAgICAtPiBleHBsaXF1ZXIgbGUgZm9uY3Rpb25uZW1lbnQgKHNpbm9uIGplIHZhaXMgbSd5IHBlcmRyZSlcbiAgICAtPiB2MyBkaXJlY3RvcnkgP1xuICAgICAgICAtPiBzb3VyY2VzIGluc2lkZSA/XG4gMi4gQ1NTXG4gMy4gSFRNTCBpbiBmY3QgYXR0clxuIDQuIEZjdCBpbnRlcm5lXG4gNS4gQ29uc2VpbHNcbiA2LiBKUy4uLiBcbiA3LiBwdXJlIEpTICg/KVxuKi9cblxuLy9UT0RPOiBkZXYgbG9nIDogcGFyZm9pcyBkb3NzaWVycyBiaWVuIG1ham9yIHJld3JpdGUgb3UgQVBJIHZlcnMgLy9cblxuLy8gZXhhbXBsZSA6IHBsYXlncm91bmQgdjMgKD8pXG4gICAgLy8gbGlzcy12ZXJzaW9uPVwidjNcIlxuICAgIC8vIGxpc3MtdjM9XCJhdXRvXCIgKGMnZXN0IGxhIHYzIHF1J2lsIGZhdXQgdXRpbGlzZXIpXG4vLyB1bml0IHRlc3QgZGUgbCdleGVtcGxlIGFqb3V0w6lcbi8vID0+IGNvbnRpbnVlIG90aGVyIGV4YW1wbGVzXG5cbi8vIFRPRE86IGluIHBsYXlncm91bmQgYnJ5dGhvbiBzcmMgb25seSBpZiBicnl0aG9uXG4vLyBUT0RPOiByZW1vdmUgdjIgKGF1dG9kaXIpICsgdjIgZmN0c1xuXG4vLyBET0NTXG4gICAgLy8gZG9jL2ZyL2F1dG8ubWRcbiAgICAvLyBDdHJsZXIvTGlmZUN5Y2xlXG4gICAgLy8gZG9jL2VuIChvYnMgPylcbiAgICAvLyBSRUFETUUubWRcblxuLy8gVE9ETzogYXV0by1tb2RlIChhbGwgd2l0aCBhdXRvLi4uKVxuICAgIC8vIFRPRE86IHRydWUgYXV0by1tb2RlIGluIHRlc3RzIChjaGFuZ2UgQnJ5dGhvbi4uLilcbiAgICAgICAgLy8gdGVzdHYzXG4gICAgICAgICAgICAvLyBkZWZhdWx0IEhUTUwgaW4gdGVzdCBpZiAobnVsbCkuLi5cbiAgICAgICAgICAgIC8vIGxpa2UgcGxheWdyb3VuZCAoPykgPT4gZGlmZmVyZW50IGZpbGUgZm9yIGNsZWFuZXIgY29kZSA/XG4gICAgLy8gZmlsZXM9XCJqcyx0cyxicnksaHRtbFwiIC0gZGVmYXVsdCAoaHRtbCtjc3MranMpID9cbiAgICAgICAgLy8gb3ZlcnJpZGUgZmV0Y2ggKG9mYykgW3N3IG92ZXJyaWRlID9dXG4gICAgICAgIC8vIGJ1aWxkIGRlZmF1bHQganMgKHdpdGggJHt9KSBzdXBwb3J0XG5cbi8vIGRvY3MgKCsgZXhhbXBsZXMgcGxheWdyb3VuZC90ZXN0cyAvLyBCcnkvSlMpLlxuICAgIC8vIG5vbi1hdXRvIGZpcnN0LlxuICAgICAgICAvLyBleHRlbmRzIChMSVNTIEJhc2UpXG4gICAgICAgIC8vIExJU1Moe30pIG9wdHMuXG4gICAgICAgIC8vIGRlZmluZS5cbiAgICAgICAgLy8gQVBJLi4uIGZvciBiZXR0ZXIgc3VnZ2VzdGlvbnMuXG4gICAgICAgIC8vIHJ1bGVzLi4uXG5cbi8vIFRPRE86IGNvbnRlbnRHZW5lcmF0b3Jcbi8vIFRPRE86IGRvY3MgKG9mYylcblxuLy8gVE9ETzogdXRpbHMgKyBzaWduYWxzICsgRE9NQ29udGVudExvYWRlZCBiZWZvcmUuLi4gKyB1cGdyYWRlIGNoaWxkcmVuIGluIGNzdHIgP1xuICAgIC8vIGJ1aWxkXG4gICAgLy8gcmVtb3ZlIGV2ZW50cyArIHFzID9cbiAgICAvLyBUT0RPOiBzdGF0ZSAoaW50ZXJuYWwgc3RhdGUpXG4gICAgLy8gVE9ETzogYmxpc3NcbiAgICAvLyBUT0RPOiBjc3MtLVtwcm9wX25hbWVdLlxuICAgIC8vIFRPRE86IHNoYXJlZENTU1xuXG4vLyBUT0RPOiB1cGdyYWRlXG4gICAgLy8gVE9ETzogZ2V0IHVwZ3JhZGVkID9cbiAgICAvLyBUT0RPOiB1cGdyYWRlICsrID4gZGVmaW5pdGlvbiBvcmRlciBpZiBpbnNpZGUgY2hpbGQgYW5kIGF2YWlsYWJsZS5cbiAgICAvLyBUT0RPOiBkZWZpbmVkIDogdmlzaWJpbGl0eTogaGlkZGVuIHVudGlsIGRlZmluZWQgP1xuICAgICAgICAvLyBUT0RPOiBsb2FkZXIgY3VzdG9tRWxlbWVudCAocmVwbGFjZVdpdGggPylcblxuXG4vLyBUT0RPOiBwbGF5Z3JvdW5kXG4gICAgLy8gVE9ETzogZmFjdWx0YXRpdmUgSFRNTCBpbiBlZGl0b3IvcGxheWdyb3VuZFxuICAgIC8vIFRPRE86IHNob3cgZXJyb3IuLi5cbiAgICAvLyBUT0RPOiBkZWJvdW5jZS90aHJvdHRsZSBlZGl0b3IuLi5cblxuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4uL1YyL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLy8gT25seSBleHRlbmRzIEhUTUxFbGVtZW50LCBlbHNlIGlzc3VlcyA6XG4gICAgLy8gbm90IHN1cHBvcnRlZCBieSBhbGwgYnJvd3NlcnMuXG4gICAgLy8gbWF5IG5vdCBzdXBwb3J0IHNoYWRvd1Jvb3QgLT4gdGhlbiBpbml0IGNhbiBiZSB0cm91Ymxlc29tZS5cbiAgICAvLyBiZSBjYXJlZnVsIHdoZW4gdHJ5aW5nIHRvIGJ1aWxkIDogY3JlYXRlRWxlbWVudCBjYWxsIGNzdHIuXG4gICAgLy8gaWYgcG9zc2libGUsIGRvIG5vdCBleHBlY3QgY29udGVudCAoYXR0ciBnb29kID8gbm8gY2hpbGRyZW4gPylcblxuLy8gV2FpdCBET00gQ29udGVudExvYWRlZCwgZWxzZSB3aWxsIGxhY2sgY2hpbGRyZW4gKGUuZy4gYmxvY2tpbmcgc2NyaXB0KVxuLy8gVXBncmFkZSBvcmRlciBpcyBkZWYgb3JkZXIgPT4gZG8gbm90IGRlcGVuZCBmYXRoZXIvY2hpbGRyZW4uXG4gICAgLy8gZmF0aGVyIHNob3VsZCB1cGdyYWRlIGNoaWxkcmVuID8gKGFzIGl0IGxpc3RlbiBpdHMgY2hpbGRyZW4pID9cbiAgICAgICAgLy8gKGNhbid0IGxpc3RlbiBjaGlsZHJlbiBmYXRoZXIpXG4gICAgICAgIC8vIHVwZ3JhZGUgZmN0XG4gICAgICAgIC8vIGNoaWxkcmVuIGNhbid0IGFzc3VtZSBoZSBpcyBpbiBhIChjb21wYXRpYmxlKSBmYXRoZXIuXG4gICAgICAgICAgICAvLyBhdHRhY2goKS9kZXRhY2goKSAvLyBvbkF0dGFjaCgpIC8gb25EZXRhY2goKVxuICAgICAgICAgICAgICAgIC8vIGFkZCA/XG5cbi8vIGRlZmVyL2FmdGVyIERPTUNvbnRlbnRMb2FkZWQgZm9yIHF1ZXJ5aW5nIERPTVxuLy8gV1RGIGZvciBjdXN0b20gZWxlbWVudHM/Pz9cblxuY2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGVudDogU2hhZG93Um9vdDtcblxuICAgIGNvbnN0cnVjdG9yKGdlbmVyYXRvcj86IENvbnRlbnRHZW5lcmF0b3IpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogXCJvcGVuXCJ9KTtcbiAgICAgICAgaWYoZ2VuZXJhdG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBnZW5lcmF0b3IuZmlsbENvbnRlbnQodGhpcy5jb250ZW50KTtcbiAgICB9XG5cbiAgICAvLyBmb3IgYmV0dGVyIHN1Z2dlc3Rpb25zXG4gICAgZ2V0IGNvbnRyb2xlcigpOiBPbWl0PHRoaXMsIGtleW9mIEhUTUxFbGVtZW50PiB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldCBob3N0KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG50eXBlIENzdHI8VD4gPSBuZXcoLi4uYXJnczphbnlbXSkgPT4gVFxudHlwZSBMSVNTdjNfT3B0czxUIGV4dGVuZHMgQ3N0cjxDb250ZW50R2VuZXJhdG9yPiA+ID0ge1xuICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBULFxufSAmIENvbnN0cnVjdG9yUGFyYW1ldGVyczxUPlswXTtcblxuLy8gIGJ1aWxkZXJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExJU1N2MzxUIGV4dGVuZHMgQ3N0cjxDb250ZW50R2VuZXJhdG9yPiA9IENzdHI8Q29udGVudEdlbmVyYXRvcj4+KG9wdHM6IFBhcnRpYWw8TElTU3YzX09wdHM8VD4+ID0ge30pIHtcbiAgICBcbiAgICBjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG9wdHMuY29udGVudF9nZW5lcmF0b3IgPz8gQ29udGVudEdlbmVyYXRvcjtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgX2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcihvcHRzKTtcbiAgICBcbiAgICByZXR1cm4gY2xhc3MgX0xJU1MgZXh0ZW5kcyBMSVNTQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGdlbmVyYXRvciA9IF9nZW5lcmF0b3IpIHtcbiAgICAgICAgICAgIHN1cGVyKGdlbmVyYXRvcik7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgdjIgZnJvbSBcIi4vVjJcIjtcbmltcG9ydCB2MyBmcm9tIFwiLi9WM1wiO1xuXG5leHBvcnQgY29uc3QgTElTUyA9IHtcbiAgICB2MixcbiAgICB2M1xufVxuZXhwb3J0IGRlZmF1bHQgdjI7Il0sIm5hbWVzIjpbImdldFNoYXJlZENTUyIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJpc1NoYWRvd1N1cHBvcnRlZCIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwic2hhcmVkQ1NTIiwiQ29udGVudEdlbmVyYXRvciIsImRhdGEiLCJjb25zdHJ1Y3RvciIsImh0bWwiLCJjc3MiLCJzaGFkb3ciLCJwcmVwYXJlSFRNTCIsInByZXBhcmVDU1MiLCJzZXRUZW1wbGF0ZSIsInRlbXBsYXRlIiwiaXNSZWFkeSIsIndoZW5SZWFkeSIsImZpbGxDb250ZW50IiwiaW5qZWN0Q1NTIiwiYXBwZW5kIiwiY29udGVudCIsImNsb25lTm9kZSIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImdlbmVyYXRlIiwiaG9zdCIsInRhcmdldCIsImluaXRTaGFkb3ciLCJzaGFkb3dNb2RlIiwiTk9ORSIsImNoaWxkTm9kZXMiLCJsZW5ndGgiLCJyZXBsYWNlQ2hpbGRyZW4iLCJjYW5IYXZlU2hhZG93IiwiRXJyb3IiLCJtb2RlIiwiT1BFTiIsImF0dGFjaFNoYWRvdyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImUiLCJwcm9jZXNzQ1NTIiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ1bmRlZmluZWQiLCJzdHIiLCJ0cmltIiwiaW5uZXJIVE1MIiwiSFRNTEVsZW1lbnQiLCJzdHlsZXNoZWV0cyIsIlNoYWRvd1Jvb3QiLCJhZG9wdGVkU3R5bGVTaGVldHMiLCJwdXNoIiwiY3Nzc2VsZWN0b3IiLCJDU1NTZWxlY3RvciIsImhhcyIsInNldEF0dHJpYnV0ZSIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwicmVwbGFjZSIsImhlYWQiLCJhZGQiLCJidWlsZExJU1NIb3N0Iiwic2V0Q3N0ckNvbnRyb2xlciIsIl9fY3N0cl9ob3N0Iiwic2V0Q3N0ckhvc3QiLCJfIiwiTElTUyIsImFyZ3MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJjb250ZW50X2dlbmVyYXRvciIsIkxJU1NDb250cm9sZXIiLCJIb3N0Iiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwibmFtZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJjb25uZWN0ZWRDYWxsYmFjayIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiaXNDb25uZWN0ZWQiLCJfSG9zdCIsImlkIiwiX19jc3RyX2NvbnRyb2xlciIsIkxpc3MiLCJob3N0Q3N0ciIsImNvbnRlbnRfZ2VuZXJhdG9yX2NzdHIiLCJMSVNTSG9zdCIsIkNmZyIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkNvbnRyb2xlciIsImNvbnRyb2xlciIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwicGFyYW1zIiwiaW5pdCIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInRoZW4iLCJwcm9taXNlIiwicmVzb2x2ZSIsIlByb21pc2UiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJicnlfY2xhc3MiLCJfX2Jhc2VzX18iLCJmaWx0ZXIiLCJfX25hbWVfXyIsIl9qc19rbGFzcyIsIiRqc19mdW5jIiwiX19CUllUSE9OX18iLCIkY2FsbCIsIiRnZXRhdHRyX3BlcDY1NyIsImh0bWx0YWciLCJDbGFzcyIsIm9wdHMiLCJnZXROYW1lIiwiZWxlbWVudCIsIkVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiaXNEZWZpbmVkIiwiZWxlbSIsImdldCIsIndoZW5EZWZpbmVkIiwiZ2V0SG9zdENzdHIiLCJnZXRIb3N0Q3N0clN5bmMiLCJpc1VwZ3JhZGVkIiwidXBncmFkZVN5bmMiLCJ3aGVuVXBncmFkZWQiLCJnZXRDb250cm9sZXIiLCJnZXRDb250cm9sZXJTeW5jIiwiaW5pdGlhbGl6ZVN5bmMiLCJnZXRDb250cm9sZXJDc3RyIiwiZ2V0Q29udHJvbGVyQ3N0clN5bmMiLCJfd2hlblVwZ3JhZGVkIiwiZ2V0SG9zdCIsIm93bmVyRG9jdW1lbnQiLCJhZG9wdE5vZGUiLCJnZXRIb3N0U3luYyIsIlN0YXRlcyIsIl9MSVNTIiwiSUxJU1MiLCJjZmciLCJhc3NpZ24iLCJFeHRlbmRlZExJU1MiLCJMSVNTdjMiLCJpbXBvcnRDb21wb25lbnRWMyIsIktub3duVGFncyIsInNjcmlwdCIsIkRFRkFVTFRfQ0RJUiIsImF1dG9sb2FkIiwiY2RpciIsIlNXIiwic3dfcGF0aCIsImNvbnNvbGUiLCJ3YXJuIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic2NvcGUiLCJlcnJvciIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiYWRkVGFnIiwiYWRkVGFnVjIiLCJhZGRUYWdWMyIsImJyeXRob24iLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsInRhZyIsImltcG9ydENvbXBvbmVudCIsImRlZmluZVdlYkNvbXBvbmVudFYzIiwiZmlsZXMiLCJrbGFzcyIsIkxJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IiLCJkZWZpbmVXZWJDb21wb25lbnQiLCJjX2pzIiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwib2xkcmVxIiwicmVxdWlyZSIsInN0YXJ0c1dpdGgiLCJmaWxlbmFtZSIsInNsaWNlIiwiZGVmYXVsdCIsIl9mZXRjaFRleHQiLCJ1cmkiLCJpc0xpc3NBdXRvIiwib3B0aW9ucyIsImhlYWRlcnMiLCJyZXNwb25zZSIsImZldGNoIiwic3RhdHVzIiwiYW5zd2VyIiwidGV4dCIsIl9pbXBvcnQiLCJsb2ciLCJjb252ZXJ0ZXIiLCJlbmNvZGVIVE1MIiwidGV4dENvbnRlbnQiLCJtYXRjaCIsImNzc19hdHRycyIsImdldEF0dHJpYnV0ZU5hbWVzIiwiY3NzX2F0dHIiLCJzZXRQcm9wZXJ0eSIsImltcG9ydENvbXBvbmVudHMiLCJjb21wb25lbnRzIiwicmVzdWx0cyIsImJyeV93cmFwcGVyIiwiY29tcG9fZGlyIiwiY29kZSIsImxpc3MiLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJFdmVudFRhcmdldDIiLCJFdmVudFRhcmdldCIsImNhbGxiYWNrIiwiZGlzcGF0Y2hFdmVudCIsImV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxpc3RlbmVyIiwiQ3VzdG9tRXZlbnQyIiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJXaXRoRXZlbnRzIiwiZXYiLCJfZXZlbnRzIiwiRXZlbnRUYXJnZXRNaXhpbnMiLCJldmVudE1hdGNoZXMiLCJzZWxlY3RvciIsImVsZW1lbnRzIiwiY29tcG9zZWRQYXRoIiwicmV2ZXJzZSIsIm1hdGNoZXMiLCJsaXNzX3NlbGVjdG9yIiwiX2J1aWxkUVMiLCJ0YWduYW1lX29yX3BhcmVudCIsInBhcmVudCIsInFzIiwicmVzdWx0IiwicXNvIiwicXNhIiwiaWR4IiwicHJvbWlzZXMiLCJhbGwiLCJxc2MiLCJyZXMiLCJjbG9zZXN0IiwicXNTeW5jIiwicXNhU3luYyIsInFzY1N5bmMiLCJyb290IiwiZ2V0Um9vdE5vZGUiLCJnbG9iYWxUaGlzIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwiZmV0Y2hDb250ZXh0IiwiTElTU0NvbnRleHQiLCJ0b1N0cmluZyIsIkxJU1NCYXNlIiwiZ2VuZXJhdG9yIiwiX2dlbmVyYXRvciIsInYyIiwidjMiXSwic291cmNlUm9vdCI6IiJ9