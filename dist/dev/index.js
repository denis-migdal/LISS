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
/* harmony export */   defineWebComponentV3: () => (/* binding */ defineWebComponentV3),
/* harmony export */   encodeHTML: () => (/* binding */ encodeHTML)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/V2/extends.ts");
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ContentGenerator */ "./src/V2/ContentGenerator.ts");
/* harmony import */ var _LifeCycle_DEFINED__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LifeCycle/DEFINED */ "./src/V2/LifeCycle/DEFINED.ts");
/* harmony import */ var V3___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/ */ "./src/V3/index.ts");
/* harmony import */ var V3_LISS_LISSAuto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! V3/LISS/LISSAuto */ "./src/V3/LISS/LISSAuto.ts");





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
        let host = HTMLElement;
        if (tag.hasAttribute('is')) host = tag.constructor;
        if (!tagname.includes('-') || KnownTags.has(tagname)) return;
        importComponent(tagname, {
            brython,
            cdir,
            host
        });
    }
    async function addTagV3(tag) {
        await SW; // ensure SW is installed.
        const tagname = tag.tagName.toLowerCase();
        if (!tagname.includes('-') || KnownTags.has(tagname)) return;
        (0,V3_LISS_LISSAuto__WEBPACK_IMPORTED_MODULE_4__.importComponentV3)(tagname, {
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
/* harmony import */ var V2_LISSHost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V2/LISSHost */ "./src/V2/LISSHost.ts");
/* harmony import */ var V2_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! V2/utils */ "./src/V2/utils.ts");
/* harmony import */ var V3_utils_template__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/utils/template */ "./src/V3/utils/template.ts");
/* harmony import */ var V3_utils_style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! V3/utils/style */ "./src/V3/utils/style.ts");





const sharedCSS = (0,V2_LISSHost__WEBPACK_IMPORTED_MODULE_1__.getSharedCSS)(); // from LISSHost...
class ContentGenerator {
    data;
    #shadow;
    constructor({ html, css = [], shadow = null } = {}){
        this.#shadow = shadow;
        const isReady = (0,V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(html) && (0,V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(css) && (0,V2_utils__WEBPACK_IMPORTED_MODULE_2__.isDOMContentLoaded)();
        if (isReady) this.prepare(html, css);
        const whenReady = Promise.all([
            (0,V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(html),
            (0,V3_utils_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(css),
            (0,V2_utils__WEBPACK_IMPORTED_MODULE_2__.whenDOMContentLoaded)()
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
        this.template = (0,V3_utils_template__WEBPACK_IMPORTED_MODULE_3__["default"])(html);
    }
    prepareStyle(css) {
        if (!Array.isArray(css)) css = [
            css
        ];
        this.stylesheets = css.map((e)=>(0,V3_utils_style__WEBPACK_IMPORTED_MODULE_4__["default"])(e));
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

/***/ "./src/V3/LISS/LISSAuto.ts":
/*!*********************************!*\
  !*** ./src/V3/LISS/LISSAuto.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _fetchText: () => (/* binding */ _fetchText),
/* harmony export */   importComponentV3: () => (/* binding */ importComponentV3)
/* harmony export */ });
/* harmony import */ var V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! V2/helpers/LISSAuto */ "./src/V2/helpers/LISSAuto.ts");
/* harmony import */ var V3_utils_define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! V3/utils/define */ "./src/V3/utils/define.ts");
/* harmony import */ var V3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! V3 */ "./src/V3/index.ts");
/* harmony import */ var V3_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! V3/ContentGenerators/AutoContentGenerator */ "./src/V3/ContentGenerators/AutoContentGenerator.ts");




async function importComponentV3(tagname, { cdir = V2_helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CDIR } = {}) {
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
    (0,V3_utils_define__WEBPACK_IMPORTED_MODULE_1__["default"])(tagname, klass);
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
        if (klass.CONTENT_GENERATOR !== null) {
            this.content = klass.CONTENT_GENERATOR.initContent(this, klass.SHADOW_MODE);
            console.warn(this.tagName);
        }
    }
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

/***/ "./src/V3/index.ts":
/*!*************************!*\
  !*** ./src/V3/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSv3),
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


/***/ }),

/***/ "./src/V3/utils/define.ts":
/*!********************************!*\
  !*** ./src/V3/utils/define.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ define)
/* harmony export */ });
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
}


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

/***/ "./src/V3/utils/style.ts":
/*!*******************************!*\
  !*** ./src/V3/utils/style.ts ***!
  \*******************************/
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

/***/ "./src/V3/utils/template.ts":
/*!**********************************!*\
  !*** ./src/V3/utils/template.ts ***!
  \**********************************/
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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _V2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./V2 */ "./src/V2/index.ts");
/* harmony import */ var _V3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./V3 */ "./src/V3/index.ts");
/* harmony import */ var _V3_utils_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./V3/utils/style */ "./src/V3/utils/style.ts");
/* harmony import */ var _V3_utils_template__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./V3/utils/template */ "./src/V3/utils/template.ts");
/* harmony import */ var _V3_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./V3/ContentGenerators/AutoContentGenerator */ "./src/V3/ContentGenerators/AutoContentGenerator.ts");


// @ts-ignore
_V2__WEBPACK_IMPORTED_MODULE_0__["default"].v3 = _V3__WEBPACK_IMPORTED_MODULE_1__["default"];



// @ts-ignore
_V2__WEBPACK_IMPORTED_MODULE_0__["default"].template = _V3_utils_template__WEBPACK_IMPORTED_MODULE_3__["default"];
// @ts-ignore
_V2__WEBPACK_IMPORTED_MODULE_0__["default"].style = _V3_utils_style__WEBPACK_IMPORTED_MODULE_2__["default"];
// @ts-ignore
_V2__WEBPACK_IMPORTED_MODULE_0__["default"].generators = _V3_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_4__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_V2__WEBPACK_IMPORTED_MODULE_0__["default"]);

})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUxQlAsVUFBU0ssTUFBTSxDQUFFNEg7SUFDckI7SUFFQSwyR0FBMkc7SUFDM0csd0RBQXdEO0lBRXhELE9BQU9qSSxVQUFTTSxPQUFPO0FBQzNCOzs7Ozs7O1NDekNBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnNCO0FBQ0E7QUFFdEIsYUFBYTtBQUNidVQsMkNBQUVBLENBQUNDLEVBQUUsR0FBR0EsMkNBQUVBO0FBRWdDO0FBQ0c7QUFDd0I7QUFFckUsYUFBYTtBQUNiRCwyQ0FBRUEsQ0FBQzdULFFBQVEsR0FBR0EsMERBQVFBO0FBQ3RCLGFBQWE7QUFDYjZULDJDQUFFQSxDQUFDN1IsS0FBSyxHQUFNQSx1REFBS0E7QUFDbkIsYUFBYTtBQUNiNlIsMkNBQUVBLENBQUNFLFVBQVUsR0FBR0Esa0ZBQVVBO0FBRTFCLGlFQUFlRiwyQ0FBRUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvVjIvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xJU1NDb250cm9sZXIudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL0xpZmVDeWNsZS9ERUZJTkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL0lOSVRJQUxJWkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL1JFQURZLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL1VQR1JBREVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvTGlmZUN5Y2xlL3N0YXRlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2NvcmUvTGlmZUN5Y2xlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMi90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YyL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvQ29udGVudEdlbmVyYXRvcnMvQXV0b0NvbnRlbnRHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9Db250ZW50R2VuZXJhdG9ycy9Db250ZW50R2VuZXJhdG9yLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvTElTUy9MSVNTQXV0by50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL0xJU1MvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy9MSVNTL0xJU1NGdWxsLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvVjMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9kZWZpbmUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9lbmNvZGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9yZXNzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9WMy91dGlscy9zdHlsZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzL3V0aWxzL3RlbXBsYXRlLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFNoYXJlZENTUyB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSG9zdCwgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgaXNTaGFkb3dTdXBwb3J0ZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxudHlwZSBIVE1MID0gRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmc7XG50eXBlIENTUyAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7XG4gICAgaHRtbCAgID86IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nLFxuICAgIGNzcyAgICA/OiBDU1MgfCByZWFkb25seSBDU1NbXSxcbiAgICBzaGFkb3cgPzogU2hhZG93Q2ZnfG51bGxcbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvckNzdHIgPSB7IG5ldyhvcHRzOiBDb250ZW50R2VuZXJhdG9yX09wdHMpOiBDb250ZW50R2VuZXJhdG9yIH07XG5cbmNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcbmNvbnN0IHNoYXJlZENTUyA9IGdldFNoYXJlZENTUygpOyAvLyBmcm9tIExJU1NIb3N0Li4uXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgI3N0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W107XG4gICAgI3RlbXBsYXRlICAgOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGw7XG4gICAgI3NoYWRvdyAgICAgOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGh0bWwsXG4gICAgICAgIGNzcyAgICA9IFtdLFxuICAgICAgICBzaGFkb3cgPSBudWxsLFxuICAgIH06IENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4jc2hhZG93ICAgPSBzaGFkb3c7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGhpcy5wcmVwYXJlSFRNTChodG1sKTtcbiAgICBcbiAgICAgICAgdGhpcy4jc3R5bGVzaGVldHMgPSB0aGlzLnByZXBhcmVDU1MoY3NzKTtcblxuICAgICAgICB0aGlzLiNpc1JlYWR5ICAgPSBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgdGhpcy4jd2hlblJlYWR5ID0gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKTtcblxuICAgICAgICAvL1RPRE86IG90aGVyIGRlcHMuLi5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0VGVtcGxhdGUodGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jdGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAjd2hlblJlYWR5OiBQcm9taXNlPHVua25vd24+O1xuICAgICNpc1JlYWR5ICA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZWFkeTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuI2lzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiN3aGVuUmVhZHk7XG4gICAgICAgIC8vVE9ETzogZGVwcy5cbiAgICAgICAgLy9UT0RPOiBDU1MvSFRNTCByZXNvdXJjZXMuLi5cblxuICAgICAgICAvLyBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuICAgICAgICAvLyBfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcbiAgICAgICAgLy8gKyBjZiBhdCB0aGUgZW5kLi4uXG4gICAgfVxuXG4gICAgZmlsbENvbnRlbnQoc2hhZG93OiBTaGFkb3dSb290KSB7XG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHNoYWRvdywgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIHNoYWRvdy5hcHBlbmQoIHRoaXMuI3RlbXBsYXRlIS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSApO1xuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc2hhZG93KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudHxTaGFkb3dSb290IHtcblxuICAgICAgICAvL1RPRE86IHdhaXQgcGFyZW50cy9jaGlsZHJlbiBkZXBlbmRpbmcgb24gb3B0aW9uLi4uICAgICBcblxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmluaXRTaGFkb3coaG9zdCk7XG5cbiAgICAgICAgdGhpcy5pbmplY3RDU1ModGFyZ2V0LCB0aGlzLiNzdHlsZXNoZWV0cyk7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuI3RlbXBsYXRlIS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgaWYoIGhvc3Quc2hhZG93TW9kZSAhPT0gU2hhZG93Q2ZnLk5PTkUgfHwgdGFyZ2V0LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwIClcbiAgICAgICAgICAgIHRhcmdldC5yZXBsYWNlQ2hpbGRyZW4oY29udGVudCk7XG5cbiAgICAgICAgLy9pZiggdGFyZ2V0IGluc3RhbmNlb2YgU2hhZG93Um9vdCAmJiB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApXG5cdFx0Ly9cdHRhcmdldC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoaG9zdCk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFNoYWRvdzxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpIHtcblxuICAgICAgICBjb25zdCBjYW5IYXZlU2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCk7XG4gICAgICAgIGlmKCB0aGlzLiNzaGFkb3cgIT09IG51bGwgJiYgdGhpcy4jc2hhZG93ICE9PSBTaGFkb3dDZmcuTk9ORSAmJiAhIGNhbkhhdmVTaGFkb3cgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgICAgICBsZXQgbW9kZSA9IHRoaXMuI3NoYWRvdztcbiAgICAgICAgaWYoIG1vZGUgPT09IG51bGwgKVxuICAgICAgICAgICAgbW9kZSA9IGNhbkhhdmVTaGFkb3cgPyBTaGFkb3dDZmcuT1BFTiA6IFNoYWRvd0NmZy5OT05FO1xuXG4gICAgICAgIGhvc3Quc2hhZG93TW9kZSA9IG1vZGU7XG5cbiAgICAgICAgbGV0IHRhcmdldDogSG9zdHxTaGFkb3dSb290ID0gaG9zdDtcbiAgICAgICAgaWYoIG1vZGUgIT09IFNoYWRvd0NmZy5OT05FKVxuICAgICAgICAgICAgdGFyZ2V0ID0gaG9zdC5hdHRhY2hTaGFkb3coe21vZGV9KTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlQ1NTKGNzczogQ1NTfHJlYWRvbmx5IENTU1tdKSB7XG4gICAgICAgIGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG4gICAgICAgICAgICBjc3MgPSBbY3NzXTtcblxuICAgICAgICByZXR1cm4gY3NzLm1hcChlID0+IHRoaXMucHJvY2Vzc0NTUyhlKSApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcm9jZXNzQ1NTKGNzczogQ1NTKSB7XG5cbiAgICAgICAgaWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcbiAgICAgICAgICAgIHJldHVybiBjc3M7XG4gICAgICAgIGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuICAgICAgICAgICAgcmV0dXJuIGNzcy5zaGVldCE7XG4gICAgXG4gICAgICAgIGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICAgICAgICAgIHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7IC8vIHJlcGxhY2UoKSBpZiBpc3N1ZXNcbiAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3VyXCIpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwcmVwYXJlSFRNTChodG1sPzogSFRNTCk6IEhUTUxUZW1wbGF0ZUVsZW1lbnR8bnVsbCB7XG4gICAgXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblxuICAgICAgICBpZihodG1sID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG5cbiAgICAgICAgLy8gc3RyMmh0bWxcbiAgICAgICAgaWYodHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zdCBzdHIgPSBodG1sLnRyaW0oKTtcblxuICAgICAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIGh0bWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCApXG4gICAgICAgICAgICBodG1sID0gaHRtbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgdGVtcGxhdGUuYXBwZW5kKGh0bWwpO1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaW5qZWN0Q1NTPEhvc3QgZXh0ZW5kcyBMSG9zdD4odGFyZ2V0OiBTaGFkb3dSb290fEhvc3QsIHN0eWxlc2hlZXRzOiBhbnlbXSkge1xuXG4gICAgICAgIGlmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICkge1xuICAgICAgICAgICAgdGFyZ2V0LmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUywgLi4uc3R5bGVzaGVldHMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3Nzc2VsZWN0b3IgPSB0YXJnZXQuQ1NTU2VsZWN0b3I7IC8vVE9ETy4uLlxuXG4gICAgICAgIGlmKCBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cbiAgICAgICAgbGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuICAgICAgICBmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuICAgICAgICAgICAgZm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuICAgICAgICAgICAgICAgIGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuICAgICAgICBhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcbiAgICB9XG59XG5cbi8vIGlkZW0gSFRNTC4uLlxuLyogaWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIGMgPSBhd2FpdCBjO1xuICAgICAgICAgICAgaWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG4gICAgICAgICAgICAgICAgYyA9IGF3YWl0IGMudGV4dCgpO1xuXG4gICAgICAgICAgICBzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cbiAgICAgICAgfSkoKSk7XG5cbiAgICAgICAgcmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuICAgIH1cbiovIiwiaW1wb3J0IHsgTEhvc3RDc3RyLCB0eXBlIENsYXNzLCB0eXBlIENvbnN0cnVjdG9yLCB0eXBlIExJU1NfT3B0cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QsIHNldENzdHJDb250cm9sZXIgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZX0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLyoqKiovXG5cbmludGVyZmFjZSBJQ29udHJvbGVyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4ge1xuXHQvLyBub24tdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IGhvc3Q6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cblx0Ly8gdmFuaWxsYSBKU1xuXHRcdHJlYWRvbmx5IGlzQ29ubmVjdGVkICA6Ym9vbGVhbjtcbn07XG5cdC8vICsgcHJvdGVjdGVkXG5cdFx0Ly8gcmVhZG9ubHkgLmNvbnRlbnQ6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdDtcblx0Ly8gdmFuaWxsYSBKU1xuXHRcdC8vIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKTogdm9pZDtcblx0XHQvLyBjb25uZWN0ZWRDYWxsYmFjayAgICgpOiB2b2lkO1xuXHRcdC8vIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQ7XG5cbmludGVyZmFjZSBJQ29udHJvbGVyQ3N0cjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+IHtcblx0bmV3KCk6IElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPjtcblxuXHQvLyB2YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXTtcbn1cblx0Ly8gKyBcInByaXZhdGVcIlxuXHRcdC8vIHJlYWRvbmx5IEhvc3Q6IEhvc3RDc3RyXG5cbmV4cG9ydCB0eXBlIENvbnRyb2xlcjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+ID0gSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+ICYgSW5zdGFuY2VUeXBlPEV4dGVuZHNDc3RyPjtcblxuZXhwb3J0IHR5cGUgQ29udHJvbGVyQ3N0cjxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+ID0gSUNvbnRyb2xlckNzdHI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPiAmIEV4dGVuZHNDc3RyO1xuXG4vKioqKi9cblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0NzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdEhvc3RDc3RyICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4+KGFyZ3M6IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4+ID0ge30pIHtcblxuXHRsZXQge1xuXHRcdC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuXHRcdGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0ICAgICAgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3N0cixcblx0XHRob3N0ICAgICAgICAgICAgICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdFxuXHRcdGNvbnRlbnRfZ2VuZXJhdG9yID0gQ29udGVudEdlbmVyYXRvcixcblx0fSA9IGFyZ3M7XG5cdFxuXHRjbGFzcyBMSVNTQ29udHJvbGVyIGV4dGVuZHMgX2V4dGVuZHMgaW1wbGVtZW50cyBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj57XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsICkge1xuXHRcdFx0XHRzZXRDc3RyQ29udHJvbGVyKHRoaXMpO1xuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3QoLi4uYXJncyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5jb250ZW50ITtcblx0XHR9XG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmd8bnVsbCwgbmV3VmFsdWU6IHN0cmluZ3xudWxsKSB7fVxuXG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ob3N0LmlzQ29ubmVjdGVkO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBJbnN0YW5jZVR5cGU8TEhvc3RDc3RyPEhvc3RDc3RyPj47XG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBfSG9zdDogTEhvc3RDc3RyPEhvc3RDc3RyPjtcblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmU6IGZ1Y2sgb2ZmLlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCggdGhpcyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRob3N0LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NDb250cm9sZXIgc2F0aXNmaWVzIENvbnRyb2xlckNzdHI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPjtcbn0iLCJpbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIFNoYWRvd0NmZywgdHlwZSBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCB7IFN0YXRlcyB9IGZyb20gXCIuL0xpZmVDeWNsZS9zdGF0ZXNcIjtcblxuLy8gTElTU0hvc3QgbXVzdCBiZSBidWlsZCBpbiBkZWZpbmUgYXMgaXQgbmVlZCB0byBiZSBhYmxlIHRvIGJ1aWxkXG4vLyB0aGUgZGVmaW5lZCBzdWJjbGFzcy5cblxubGV0IGlkID0gMDtcblxuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFyZWRDU1MoKSB7XG5cdHJldHVybiBzaGFyZWRDU1M7XG59XG5cbmxldCBfX2NzdHJfY29udHJvbGVyICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RyQ29udHJvbGVyKF86IGFueSkge1xuXHRfX2NzdHJfY29udHJvbGVyID0gXztcbn1cblxudHlwZSBpbmZlckhvc3RDc3RyPFQ+ID0gVCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPGluZmVyIEEgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sIGluZmVyIEIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID8gQiA6IG5ldmVyO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMSVNTSG9zdDxcdFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0ciwgVSBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IGluZmVySG9zdENzdHI8VD4gPihcblx0XHRcdFx0XHRcdFx0TGlzczogVCxcblx0XHRcdFx0XHRcdFx0Ly8gY2FuJ3QgZGVkdWNlIDogY2F1c2UgdHlwZSBkZWR1Y3Rpb24gaXNzdWVzLi4uXG5cdFx0XHRcdFx0XHRcdGhvc3RDc3RyOiBVLFxuXHRcdFx0XHRcdFx0XHRjb250ZW50X2dlbmVyYXRvcl9jc3RyOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcblx0XHRcdFx0XHRcdFx0YXJncyAgICAgICAgICAgICA6IENvbnRlbnRHZW5lcmF0b3JfT3B0c1xuXHRcdFx0XHRcdFx0KSB7XG5cblx0Y29uc3QgY29udGVudF9nZW5lcmF0b3IgPSBuZXcgY29udGVudF9nZW5lcmF0b3JfY3N0cihhcmdzKTtcblxuXHR0eXBlIEhvc3RDc3RyID0gVTtcbiAgICB0eXBlIEhvc3QgICAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuXHRjbGFzcyBMSVNTSG9zdCBleHRlbmRzIGhvc3RDc3RyIHtcblxuXHRcdHN0YXRpYyByZWFkb25seSBDZmcgPSB7XG5cdFx0XHRob3N0ICAgICAgICAgICAgIDogaG9zdENzdHIsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogY29udGVudF9nZW5lcmF0b3JfY3N0cixcblx0XHRcdGFyZ3Ncblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gREVQRU5ERU5DSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdHN0YXRpYyByZWFkb25seSB3aGVuRGVwc1Jlc29sdmVkID0gY29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCk7XG5cdFx0c3RhdGljIGdldCBpc0RlcHNSZXNvbHZlZCgpIHtcblx0XHRcdHJldHVybiBjb250ZW50X2dlbmVyYXRvci5pc1JlYWR5O1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0c3RhdGljIENvbnRyb2xlciA9IExpc3M7XG5cblx0XHQjY29udHJvbGVyOiBhbnl8bnVsbCA9IG51bGw7XG5cdFx0Z2V0IGNvbnRyb2xlcigpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXI7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyICE9PSBudWxsO1xuXHRcdH1cblx0XHRyZWFkb25seSB3aGVuSW5pdGlhbGl6ZWQ6IFByb21pc2U8SW5zdGFuY2VUeXBlPFQ+Pjtcblx0XHQjd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyO1xuXG5cdFx0Ly9UT0RPOiBnZXQgcmVhbCBUUyB0eXBlID9cblx0XHQjcGFyYW1zOiBhbnlbXTtcblx0XHRpbml0aWFsaXplKC4uLnBhcmFtczogYW55W10pIHtcblxuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgKCB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNEZXBzUmVzb2x2ZWQgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY2llcyBoYXNuJ3QgYmVlbiBsb2FkZWQgIVwiKTtcblxuXHRcdFx0aWYoIHBhcmFtcy5sZW5ndGggIT09IDAgKSB7XG5cdFx0XHRcdGlmKCB0aGlzLiNwYXJhbXMubGVuZ3RoICE9PSAwIClcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NzdHIgcGFyYW1zIGhhcyBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgIScpO1xuXHRcdFx0XHR0aGlzLiNwYXJhbXMgPSBwYXJhbXM7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udHJvbGVyO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Ly8jaW50ZXJuYWxzID0gdGhpcy5hdHRhY2hJbnRlcm5hbHMoKTtcblx0XHQvLyNzdGF0ZXMgICAgPSB0aGlzLiNpbnRlcm5hbHMuc3RhdGVzO1xuXHRcdCNjb250ZW50OiBIb3N0fFNoYWRvd1Jvb3QgPSB0aGlzIGFzIEhvc3Q7XG5cblx0XHRnZXQgY29udGVudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250ZW50O1xuXHRcdH1cblxuXHRcdGdldFBhcnQobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cdFx0Z2V0UGFydHMobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cblx0XHRvdmVycmlkZSBhdHRhY2hTaGFkb3coaW5pdDogU2hhZG93Um9vdEluaXQpOiBTaGFkb3dSb290IHtcblx0XHRcdGNvbnN0IHNoYWRvdyA9IHN1cGVyLmF0dGFjaFNoYWRvdyhpbml0KTtcblxuXHRcdFx0Ly8gQHRzLWlnbm9yZSBjbG9zZWQgSVMgYXNzaWduYWJsZSB0byBzaGFkb3dNb2RlLi4uXG5cdFx0XHR0aGlzLnNoYWRvd01vZGUgPSBpbml0Lm1vZGU7XG5cblx0XHRcdHRoaXMuI2NvbnRlbnQgPSBzaGFkb3c7XG5cdFx0XHRcblx0XHRcdHJldHVybiBzaGFkb3c7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldCBoYXNTaGFkb3coKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zaGFkb3dNb2RlICE9PSAnbm9uZSc7XG5cdFx0fVxuXG5cdFx0LyoqKiBDU1MgKioqL1xuXG5cdFx0Z2V0IENTU1NlbGVjdG9yKCkge1xuXG5cdFx0XHRpZih0aGlzLmhhc1NoYWRvdyB8fCAhIHRoaXMuaGFzQXR0cmlidXRlKFwiaXNcIikgKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdOYW1lO1xuXG5cdFx0XHRyZXR1cm4gYCR7dGhpcy50YWdOYW1lfVtpcz1cIiR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJpc1wiKX1cIl1gO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IEltcGwgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Y29uc3RydWN0b3IoLi4ucGFyYW1zOiBhbnlbXSkge1xuXHRcdFx0c3VwZXIoKTtcblxuXHRcdFx0Ly90aGlzLiNzdGF0ZXMuYWRkKFN0YXRlcy5MSVNTX1VQR1JBREVEKTtcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfUkVBRFkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGNvbnN0IGNvbnRyb2xlciA9IF9fY3N0cl9jb250cm9sZXI7XG5cdFx0XHRfX2NzdHJfY29udHJvbGVyID0gbnVsbDtcblxuXHRcdFx0aWYoIGNvbnRyb2xlciAhPT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBjb250cm9sZXI7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdGlmKHRoaXMuY29udHJvbGVyICE9PSBudWxsKVxuXHRcdFx0XHR0aGlzLmNvbnRyb2xlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuY29udHJvbGVyIS5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGluc3RhbmNlIGRlcHNcblx0XHRcdGlmKCBjb250ZW50X2dlbmVyYXRvci5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCggYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdGF3YWl0IGNvbnRlbnRfZ2VuZXJhdG9yLndoZW5SZWFkeSgpO1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gTElTU0hvc3QuQ29udHJvbGVyLm9ic2VydmVkQXR0cmlidXRlcztcblx0XHR9XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKHRoaXMuI2NvbnRyb2xlcilcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXHRcdH1cblxuXHRcdHNoYWRvd01vZGU6IFNoYWRvd0NmZ3xudWxsID0gbnVsbDtcblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblxuXHRcdFx0Ly8gbm8gbmVlZHMgdG8gc2V0IHRoaXMuI2NvbnRlbnQgKGFscmVhZHkgaG9zdCBvciBzZXQgd2hlbiBhdHRhY2hTaGFkb3cpXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvci5nZW5lcmF0ZSh0aGlzKTtcblxuXHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXG5cdFx0XHRpZiggdGhpcy4jY29udHJvbGVyID09PSBudWxsKSB7XG5cdFx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIgPSBuZXcgTElTU0hvc3QuQ29udHJvbGVyKC4uLnRoaXMuI3BhcmFtcykgYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXHRcdFx0fVxuXG5cdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfSU5JVElBTElaRUQpO1xuXG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIodGhpcy5jb250cm9sZXIpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb250cm9sZXI7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBMSVNTSG9zdDtcbn1cblxuXG4iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPiA9IHN0cmluZ3xUfExJU1NIb3N0Q3N0cjxUPnxIVE1MRWxlbWVudDtcblxuLy8gVE9ETy4uLlxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+fGFueSkge1xuXG5cdGxldCBIb3N0OiBMSVNTSG9zdENzdHI8VD4gPSBDb21wb25lbnRDbGFzcyBhcyBhbnk7XG5cblx0Ly8gQnJ5dGhvbiBjbGFzc1xuXHRsZXQgYnJ5X2NsYXNzOiBhbnkgPSBudWxsO1xuXHRpZiggXCIkaXNfY2xhc3NcIiBpbiBDb21wb25lbnRDbGFzcyApIHtcblxuXHRcdGJyeV9jbGFzcyA9IENvbXBvbmVudENsYXNzO1xuXG5cdFx0Q29tcG9uZW50Q2xhc3MgPSBicnlfY2xhc3MuX19iYXNlc19fLmZpbHRlciggKGU6IGFueSkgPT4gZS5fX25hbWVfXyA9PT0gXCJXcmFwcGVyXCIpWzBdLl9qc19rbGFzcy4kanNfZnVuYztcblx0XHQoQ29tcG9uZW50Q2xhc3MgYXMgYW55KS5Ib3N0LkNvbnRyb2xlciA9IGNsYXNzIHtcblxuXHRcdFx0I2JyeTogYW55O1xuXG5cdFx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHRoaXMuI2JyeSA9IF9fQlJZVEhPTl9fLiRjYWxsKGJyeV9jbGFzcywgWzAsMCwwXSkoLi4uYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdCNjYWxsKG5hbWU6IHN0cmluZywgYXJnczogYW55W10pIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gX19CUllUSE9OX18uJGNhbGwoX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgbmFtZSwgWzAsMCwwXSksIFswLDAsMF0pKC4uLmFyZ3MpXG5cdFx0XHR9XG5cblx0XHRcdGdldCBob3N0KCkge1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBfX0JSWVRIT05fXy4kZ2V0YXR0cl9wZXA2NTcodGhpcy4jYnJ5LCBcImhvc3RcIiwgWzAsMCwwXSlcblx0XHRcdH1cblxuXHRcdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGJyeV9jbGFzc1tcIm9ic2VydmVkQXR0cmlidXRlc1wiXTtcblxuXHRcdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25uZWN0ZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImNvbm5lY3RlZENhbGxiYWNrXCIsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJkaXNjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiggXCJIb3N0XCIgaW4gQ29tcG9uZW50Q2xhc3MgKVxuXHRcdEhvc3QgPSBDb21wb25lbnRDbGFzcy5Ib3N0IGFzIGFueTtcblxuICAgIGxldCBodG1sdGFnID0gdW5kZWZpbmVkO1xuICAgIGlmKCBcIkNmZ1wiIGluIEhvc3QpIHtcbiAgICAgICAgY29uc3QgQ2xhc3MgID0gSG9zdC5DZmcuaG9zdDtcbiAgICAgICAgaHRtbHRhZyAgPSBfZWxlbWVudDJ0YWduYW1lKENsYXNzKT8/dW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIEhvc3QsIG9wdHMpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnR8TElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0cnxMSVNTSG9zdDxMSVNTQ29udHJvbGVyPnxMSVNTSG9zdENzdHI8TElTU0NvbnRyb2xlcj4gKTogc3RyaW5nIHtcblxuICAgIC8vIGluc3RhbmNlXG4gICAgaWYoIFwiaG9zdFwiIGluIGVsZW1lbnQpXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lmhvc3Q7XG4gICAgaWYoIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgXG4gICAgICAgIGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLy8gY3N0clxuXG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50KVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5Ib3N0IGFzIHVua25vd24gYXMgTElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+O1xuXG4gICAgY29uc3QgbmFtZSA9IGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoIGVsZW1lbnQgKTtcbiAgICBpZihuYW1lID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IGlzIG5vdCBkZWZpbmVkIVwiKTtcblxuICAgIHJldHVybiBuYW1lO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgaWYoIFwiSG9zdFwiIGluIGVsZW0pXG4gICAgICAgIGVsZW0gPSBlbGVtLkhvc3QgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSBhcyBhbnkpICE9PSBudWxsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3RDc3RyPFQ+PiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKGVsZW0pO1xuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pIGFzIExJU1NIb3N0Q3N0cjxUPjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBsaXN0ZW4gZGVmaW5lLi4uXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn1cblxuLypcbi8vIFRPRE86IGltcGxlbWVudFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5BbGxEZWZpbmVkKHRhZ25hbWVzOiByZWFkb25seSBzdHJpbmdbXSkgOiBQcm9taXNlPHZvaWQ+IHtcblx0YXdhaXQgUHJvbWlzZS5hbGwoIHRhZ25hbWVzLm1hcCggdCA9PiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0KSApIClcbn1cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxMSVNTSG9zdENzdHI8VD4+IHtcbiAgICAvLyB3ZSBjYW4ndCBmb3JjZSBhIGRlZmluZS5cbiAgICByZXR1cm4gd2hlbkRlZmluZWQoZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0clN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IExJU1NIb3N0Q3N0cjxUPiB7XG4gICAgXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgZWxlbSA9IGdldE5hbWUoZWxlbSk7XG4gICAgaWYoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiKSB7XG5cbiAgICAgICAgbGV0IGhvc3QgPSBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSk7XG4gICAgICAgIGlmKCBob3N0ID09PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2VsZW19IG5vdCBkZWZpbmVkIHlldCFgKTtcblxuICAgICAgICByZXR1cm4gaG9zdCBhcyB1bmtub3duIGFzIExJU1NIb3N0Q3N0cjxUPjtcbiAgICB9XG5cbiAgICBpZiggXCJIb3N0XCIgaW4gZWxlbSlcbiAgICAgICAgZWxlbSA9IGVsZW0uSG9zdCBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICBpZiggY3VzdG9tRWxlbWVudHMuZ2V0TmFtZShlbGVtIGFzIGFueSkgPT09IG51bGwgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZWxlbX0gbm90IGRlZmluZWQgeWV0IWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3RDc3RyPFQ+O1xufSIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgaXNVcGdyYWRlZCwgdXBncmFkZSwgdXBncmFkZVN5bmMsIHdoZW5VcGdyYWRlZCB9IGZyb20gXCIuL1VQR1JBREVEXCI7XG5pbXBvcnQgeyBpc1JlYWR5LCB3aGVuUmVhZHkgfSBmcm9tIFwiLi9SRUFEWVwiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IExJU1NIb3N0PFQ+fEhUTUxFbGVtZW50O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggISBpc1VwZ3JhZGVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIGVsZW0uaXNJbml0aWFsaXplZDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgd2hlblVwZ3JhZGVkKGVsZW0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkIGFzIFQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb250cm9sZXI8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcbiAgICBhd2FpdCB3aGVuUmVhZHkoaG9zdCk7XG5cbiAgICAvL1RPRE86IGluaXRpYWxpemVTeW5jIHZzIGluaXRpYWxpemUgP1xuICAgIGlmKCAhIGhvc3QuaXNJbml0aWFsaXplZCApXG4gICAgICAgIHJldHVybiBob3N0LmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBob3N0LmNvbnRyb2xlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlclN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogVCB7XG4gICAgXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuICAgIGlmKCAhIGlzUmVhZHkoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRhbmNpZXMgbm90IHJlYWR5ICFcIilcblxuICAgIGlmKCAhIGhvc3QuaXNJbml0aWFsaXplZCApXG4gICAgICAgIHJldHVybiBob3N0LmluaXRpYWxpemUoKTtcblxuICAgIHJldHVybiBob3N0LmNvbnRyb2xlcjtcbn1cblxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemUgICAgID0gZ2V0Q29udHJvbGVyO1xuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVTeW5jID0gZ2V0Q29udHJvbGVyU3luYzsiLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRIb3N0Q3N0clN5bmMsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi9ERUZJTkVEXCI7XG5cbnR5cGUgUGFyYW08VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPiA9IHN0cmluZ3xUfExJU1NIb3N0Q3N0cjxUPnxJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhZHk8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IGJvb2xlYW4ge1xuICAgIFxuICAgIGlmKCAhIGlzRGVmaW5lZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICBjb25zdCBob3N0Q3N0ciA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIHJldHVybiBob3N0Q3N0ci5pc0RlcHNSZXNvbHZlZDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5SZWFkeTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3QgaG9zdENzdHIgPSBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcbiAgICBhd2FpdCBob3N0Q3N0ci53aGVuRGVwc1Jlc29sdmVkO1xuXG4gICAgcmV0dXJuIGhvc3RDc3RyLkNvbnRyb2xlciBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgLy8gd2UgY2FuJ3QgZm9yY2UgYSByZWFkeS5cbiAgICByZXR1cm4gd2hlblJlYWR5KGVsZW0pIGFzIFByb21pc2U8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJDc3RyU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+KGVsZW06IFBhcmFtPFQ+KTogVCB7XG4gICAgXG4gICAgaWYoICEgaXNSZWFkeShlbGVtKSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICByZXR1cm4gZ2V0SG9zdENzdHJTeW5jKGVsZW0pLkNvbnRyb2xlciBhcyBUO1xufSIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRIb3N0Q3N0clN5bmMsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiLi9ERUZJTkVEXCI7XG5cbnR5cGUgUGFyYW08X1QgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IEhUTUxFbGVtZW50O1xuXG4vL1RPRE86IHVwZ3JhZGUgZnVuY3Rpb24uLi5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVXBncmFkZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+fExJU1NIb3N0PFQ+KTogZWxlbSBpcyBMSVNTSG9zdDxUPiB7XG5cbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBIb3N0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3Q8VD4+IHtcbiAgICBcbiAgICBjb25zdCBIb3N0ID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICAvLyBhbHJlYWR5IHVwZ3JhZGVkXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIb3N0KVxuICAgICAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcblxuICAgIC8vIGg0Y2tcblxuICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG4gICAgfVxuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgXG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRIb3N0PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3Q8VD4+IHtcbiAgICBcbiAgICBhd2FpdCB3aGVuRGVmaW5lZChlbGVtKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBMSVNTSG9zdDxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvc3RTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IExJU1NIb3N0PFQ+IHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCBkZWZpbmVkICFcIik7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBjb25zdCB1cGdyYWRlICAgICA9IGdldEhvc3Q7XG5leHBvcnQgY29uc3QgdXBncmFkZVN5bmMgPSBnZXRIb3N0U3luYyIsImV4cG9ydCBlbnVtIFN0YXRlcyB7XG4gICAgTElTU19ERUZJTkVEICAgICA9IFwiTElTU19ERUZJTkVEXCIsXG4gICAgTElTU19VUEdSQURFRCAgICA9IFwiTElTU19VUEdSQURFRFwiLFxuICAgIExJU1NfUkVBRFkgICAgICAgPSBcIkxJU1NfUkVBRFlcIixcbiAgICBMSVNTX0lOSVRJQUxJWkVEID0gXCJMSVNTX0lOSVRJQUxJWkVEXCJcbn0iLCJpbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5cbmltcG9ydCB7U3RhdGVzfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL3N0YXRlcy50c1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgU3RhdGVzICAgICAgICAgOiB0eXBlb2YgU3RhdGVzXG5cdFx0Ly8gd2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG4gICAgfVxufVxuXG5MSVNTLlN0YXRlcyA9IFN0YXRlcztcblxuXG5pbXBvcnQge2RlZmluZSwgZ2V0TmFtZSwgaXNEZWZpbmVkLCB3aGVuRGVmaW5lZCwgZ2V0SG9zdENzdHIsIGdldEhvc3RDc3RyU3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9ERUZJTkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0Z2V0SG9zdENzdHIgICAgOiB0eXBlb2YgZ2V0SG9zdENzdHI7XG5cdFx0Z2V0SG9zdENzdHJTeW5jOiB0eXBlb2YgZ2V0SG9zdENzdHJTeW5jO1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgICAgICAgICA9IGRlZmluZTtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1Mud2hlbkRlZmluZWQgICAgPSB3aGVuRGVmaW5lZDtcbkxJU1MuZ2V0SG9zdENzdHIgICAgPSBnZXRIb3N0Q3N0cjtcbkxJU1MuZ2V0SG9zdENzdHJTeW5jPSBnZXRIb3N0Q3N0clN5bmM7XG5cbi8vTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuXG5pbXBvcnQge2lzUmVhZHksIHdoZW5SZWFkeSwgZ2V0Q29udHJvbGVyQ3N0ciwgZ2V0Q29udHJvbGVyQ3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvUkVBRFlcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNSZWFkeSAgICAgIDogdHlwZW9mIGlzUmVhZHk7XG5cdFx0d2hlblJlYWR5ICAgIDogdHlwZW9mIHdoZW5SZWFkeTtcblx0XHRnZXRDb250cm9sZXJDc3RyICAgIDogdHlwZW9mIGdldENvbnRyb2xlckNzdHI7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0clN5bmM6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyU3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNSZWFkeSAgICAgICAgICAgICA9IGlzUmVhZHk7XG5MSVNTLndoZW5SZWFkeSAgICAgICAgICAgPSB3aGVuUmVhZHk7XG5MSVNTLmdldENvbnRyb2xlckNzdHIgICAgPSBnZXRDb250cm9sZXJDc3RyO1xuTElTUy5nZXRDb250cm9sZXJDc3RyU3luYz0gZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG5cblxuXG5pbXBvcnQge2lzVXBncmFkZWQsIHdoZW5VcGdyYWRlZCwgdXBncmFkZSwgdXBncmFkZVN5bmMsIGdldEhvc3QsIGdldEhvc3RTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1VQR1JBREVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzVXBncmFkZWQgIDogdHlwZW9mIGlzVXBncmFkZWQ7XG5cdFx0d2hlblVwZ3JhZGVkOiB0eXBlb2Ygd2hlblVwZ3JhZGVkO1xuXHRcdHVwZ3JhZGUgICAgIDogdHlwZW9mIHVwZ3JhZGU7XG5cdFx0dXBncmFkZVN5bmMgOiB0eXBlb2YgdXBncmFkZVN5bmM7XG5cdFx0Z2V0SG9zdCAgICAgOiB0eXBlb2YgZ2V0SG9zdDtcblx0XHRnZXRIb3N0U3luYyA6IHR5cGVvZiBnZXRIb3N0U3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNVcGdyYWRlZCAgPSBpc1VwZ3JhZGVkO1xuTElTUy53aGVuVXBncmFkZWQ9IHdoZW5VcGdyYWRlZDtcbkxJU1MudXBncmFkZSAgICAgPSB1cGdyYWRlO1xuTElTUy51cGdyYWRlU3luYyA9IHVwZ3JhZGVTeW5jO1xuTElTUy5nZXRIb3N0ICAgICA9IGdldEhvc3Q7XG5MSVNTLmdldEhvc3RTeW5jID0gZ2V0SG9zdFN5bmM7XG5cblxuaW1wb3J0IHtpc0luaXRpYWxpemVkLCB3aGVuSW5pdGlhbGl6ZWQsIGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jLCBnZXRDb250cm9sZXIsIGdldENvbnRyb2xlclN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG5cdFx0aXNJbml0aWFsaXplZCAgICA6IHR5cGVvZiBpc0luaXRpYWxpemVkO1xuXHRcdHdoZW5Jbml0aWFsaXplZCAgOiB0eXBlb2Ygd2hlbkluaXRpYWxpemVkO1xuXHRcdGluaXRpYWxpemUgICAgICAgOiB0eXBlb2YgaW5pdGlhbGl6ZTtcblx0XHRpbml0aWFsaXplU3luYyAgIDogdHlwZW9mIGluaXRpYWxpemVTeW5jO1xuXHRcdGdldENvbnRyb2xlciAgICAgOiB0eXBlb2YgZ2V0Q29udHJvbGVyO1xuXHRcdGdldENvbnRyb2xlclN5bmMgOiB0eXBlb2YgZ2V0Q29udHJvbGVyU3luYztcbiAgICB9XG59XG5cbkxJU1MuaXNJbml0aWFsaXplZCAgICA9IGlzSW5pdGlhbGl6ZWQ7XG5MSVNTLndoZW5Jbml0aWFsaXplZCAgPSB3aGVuSW5pdGlhbGl6ZWQ7XG5MSVNTLmluaXRpYWxpemUgICAgICAgPSBpbml0aWFsaXplO1xuTElTUy5pbml0aWFsaXplU3luYyAgID0gaW5pdGlhbGl6ZVN5bmM7XG5MSVNTLmdldENvbnRyb2xlciAgICAgPSBnZXRDb250cm9sZXI7XG5MSVNTLmdldENvbnRyb2xlclN5bmMgPSBnZXRDb250cm9sZXJTeW5jOyIsImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge0xJU1MgYXMgX0xJU1N9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuXG4vLyB1c2VkIGZvciBwbHVnaW5zLlxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbi8vIGV4dGVuZHMgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgIE9wdHMgZXh0ZW5kcyBMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj5cbiAgICA+KG9wdHM6IHtleHRlbmRzOiBFeHRlbmRzQ3N0cn0gJiBQYXJ0aWFsPE9wdHM+KTogUmV0dXJuVHlwZTx0eXBlb2YgX2V4dGVuZHM8RXh0ZW5kc0NzdHIsIE9wdHM+PlxuLy8gTElTU0NvbnRyb2xlciBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICA+KG9wdHM/OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBIb3N0Q3N0cj4+KTogTElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+XG5leHBvcnQgZnVuY3Rpb24gTElTUyhvcHRzOiBhbnkgPSB7fSk6IExJU1NDb250cm9sZXJDc3RyXG57XG4gICAgaWYoIG9wdHMuZXh0ZW5kcyAhPT0gdW5kZWZpbmVkICYmIFwiSG9zdFwiIGluIG9wdHMuZXh0ZW5kcyApIC8vIHdlIGFzc3VtZSB0aGlzIGlzIGEgTElTU0NvbnRyb2xlckNzdHJcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKG9wdHMpO1xuXG4gICAgcmV0dXJuIF9MSVNTKG9wdHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2V4dGVuZHM8XG4gICAgICAgIEV4dGVuZHNDc3RyIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHIsXG4gICAgICAgIC8vdG9kbzogY29uc3RyYWluc3RzIG9uIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgICAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPikge1xuXG4gICAgaWYoIG9wdHMuZXh0ZW5kcyA9PT0gdW5kZWZpbmVkKSAvLyBoNGNrXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYSBMSVNTQ29udHJvbGVyIScpO1xuXG4gICAgY29uc3QgY2ZnID0gb3B0cy5leHRlbmRzLkhvc3QuQ2ZnO1xuICAgIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBjZmcsIGNmZy5hcmdzLCBvcHRzKTtcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyEge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgfVxuXG5cdFx0cHJvdGVjdGVkIHN0YXRpYyBvdmVycmlkZSBfSG9zdDogTElTU0hvc3Q8RXh0ZW5kZWRMSVNTPjtcblxuICAgICAgICAvLyBUUyBpcyBzdHVwaWQsIHJlcXVpcmVzIGV4cGxpY2l0IHJldHVybiB0eXBlXG5cdFx0c3RhdGljIG92ZXJyaWRlIGdldCBIb3N0KCk6IExJU1NIb3N0PEV4dGVuZGVkTElTUz4ge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIGZ1Y2sgb2ZmXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5ob3N0ISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbnRlbnRfZ2VuZXJhdG9yISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG4gICAgfVxuXG4gICAgcmV0dXJuIEV4dGVuZGVkTElTUztcbn0iLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciwgTEhvc3QsIExJU1NDb250cm9sZXJDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiLi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9ERUZJTkVEXCI7XG5pbXBvcnQgTElTU3YzIGZyb20gXCJWMy9cIjtcbmltcG9ydCB7IGltcG9ydENvbXBvbmVudFYzIH0gZnJvbSBcIlYzL0xJU1MvTElTU0F1dG9cIjtcblxuZXhwb3J0IGNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5sZXQgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ3NjcmlwdFthdXRvZGlyXScpO1xuaWYoIHNjcmlwdCA9PT0gbnVsbClcblx0c2NyaXB0ID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdzY3JpcHRbbGlzcy1tb2RlPVwiYXV0by1sb2FkXCJdJyk7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0NESVIgPSBzY3JpcHQ/LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpID8/IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdsaXNzLWNkaXInKSA/PyBudWxsO1xuXG5pZihzY3JpcHQgIT09IG51bGwpXG5cdGF1dG9sb2FkKHNjcmlwdClcblxuXG5mdW5jdGlvbiBhdXRvbG9hZChzY3JpcHQ6IEhUTUxFbGVtZW50KSB7XG5cblx0bGV0IGNkaXI6IG51bGx8c3RyaW5nID0gREVGQVVMVF9DRElSO1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cblx0XHRjb25zdCBzd19wYXRoID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKTtcblxuXHRcdGlmKCBzd19wYXRoID09PSBudWxsICkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBMSVNTIEF1dG8gbW9kZSB3aXRob3V0IHN3LmpzLlwiKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHN3X3BhdGgsIHtzY29wZTogXCIvXCJ9KTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihcIlJlZ2lzdHJhdGlvbiBvZiBTZXJ2aWNlV29ya2VyIGZhaWxlZFwiKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0Y2RpciA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ2F1dG9kaXInKSE7XG5cblx0bGV0IGFkZFRhZyA9IGFkZFRhZ1YyO1xuXG5cdGlmKCBjZGlyID09PSBudWxsKSB7XG5cdFx0Y2RpciA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ2xpc3MtY2RpcicpITtcblx0XHRhZGRUYWcgPSBhZGRUYWdWMztcblx0fVxuXG5cblxuXHRpZiggY2RpcltjZGlyLmxlbmd0aC0xXSAhPT0gJy8nKVxuXHRcdGNkaXIgKz0gJy8nO1xuXG5cdGNvbnN0IGJyeXRob24gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKFwiYnJ5dGhvblwiKTtcblxuXHQvLyBvYnNlcnZlIGZvciBuZXcgaW5qZWN0ZWQgdGFncy5cblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcblx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0aWYoYWRkaXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcblx0XHRcdFx0XHRhZGRUYWcoYWRkaXRpb24pXG5cblx0fSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuXHRmb3IoIGxldCBlbGVtIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiKlwiKSApXG5cdFx0YWRkVGFnKCBlbGVtICk7XG5cblx0YXN5bmMgZnVuY3Rpb24gYWRkVGFnVjIodGFnOiBIVE1MRWxlbWVudCkge1xuXG5cdFx0YXdhaXQgU1c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cblx0XHRjb25zdCB0YWduYW1lID0gKCB0YWcuZ2V0QXR0cmlidXRlKCdpcycpID8/IHRhZy50YWdOYW1lICkudG9Mb3dlckNhc2UoKTtcblxuXHRcdGxldCBob3N0ID0gSFRNTEVsZW1lbnQ7XG5cdFx0aWYoIHRhZy5oYXNBdHRyaWJ1dGUoJ2lzJykgKVxuXHRcdFx0aG9zdCA9IHRhZy5jb25zdHJ1Y3RvciBhcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cblxuXHRcdGlmKCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCBLbm93blRhZ3MuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdGJyeXRob24sXG5cdFx0XHRjZGlyLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1x0XHRcblx0fVxuXG5cdGFzeW5jIGZ1bmN0aW9uIGFkZFRhZ1YzKHRhZzogSFRNTEVsZW1lbnQpIHtcblxuXHRcdGF3YWl0IFNXOyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG5cdFx0Y29uc3QgdGFnbmFtZSA9IHRhZy50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiggISB0YWduYW1lLmluY2x1ZGVzKCctJykgfHwgS25vd25UYWdzLmhhcyggdGFnbmFtZSApIClcblx0XHRcdHJldHVybjtcblxuXHRcdGltcG9ydENvbXBvbmVudFYzKHRhZ25hbWUsIHtcblx0XHRcdC8vYnJ5dGhvbixcblx0XHRcdGNkaXJcblx0XHR9KTtcdFx0XG5cdH1cbn1cblxuLy9UT0RPOiByZW5hbWUgZnJvbSBmaWxlcyA/XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50VjModGFnbmFtZTogc3RyaW5nLCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55Pikge1xuXG5cdGxldCBrbGFzcyA9IExJU1N2Myh7XG5cdFx0Y29udGVudF9nZW5lcmF0b3I6IExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IsXG5cdFx0Li4uZmlsZXNcblx0fSk7XG5cblx0Ly8gdG9kbyBicnkuLi4gXG5cdC8vVE9ETzogdGFnbmFtZSBpbiB2M1xuXG5cdC8vIFRPRE8uLi4uXG5cdC8qXG5cdGNvbnN0IGNfanMgICAgICA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cdGxldCBrbGFzczogbnVsbHwgUmV0dXJuVHlwZTx0eXBlb2YgTElTUz4gPSBudWxsO1xuXHRpZiggY19qcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0Y29uc3QgZmlsZSA9IG5ldyBCbG9iKFtjX2pzXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG5cdFx0Y29uc3QgdXJsICA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG5cblx0XHRjb25zdCBvbGRyZXEgPSBMSVNTLnJlcXVpcmU7XG5cblx0XHRMSVNTLnJlcXVpcmUgPSBmdW5jdGlvbih1cmw6IFVSTHxzdHJpbmcpIHtcblxuXHRcdFx0aWYoIHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgJiYgdXJsLnN0YXJ0c1dpdGgoJy4vJykgKSB7XG5cdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gdXJsLnNsaWNlKDIpO1xuXHRcdFx0XHRpZiggZmlsZW5hbWUgaW4gZmlsZXMpXG5cdFx0XHRcdFx0cmV0dXJuIGZpbGVzW2ZpbGVuYW1lXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9sZHJlcSh1cmwpO1xuXHRcdH1cblxuXHRcdGtsYXNzID0gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovLyogdXJsKSkuZGVmYXVsdDtcblxuXHRcdExJU1MucmVxdWlyZSA9IG9sZHJlcTtcblx0fVxuXHRlbHNlIGlmKCBvcHRzLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGtsYXNzID0gTElTUyh7XG5cdFx0XHQuLi5vcHRzLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3Jcblx0XHR9KTtcblx0fVxuXG5cdGlmKGtsYXNzID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG4qL1xuXG5cdGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cblx0cmV0dXJuIGtsYXNzO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZTogc3RyaW5nLCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55Piwgb3B0czoge2h0bWw6IHN0cmluZywgY3NzOiBzdHJpbmcsIGhvc3Q6IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pn0pIHtcblxuXHRjb25zdCBjX2pzICAgICAgPSBmaWxlc1tcImluZGV4LmpzXCJdO1xuXHRvcHRzLmh0bWwgICAgID8/PSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cblx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdGlmKCBjX2pzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRjb25zdCBmaWxlID0gbmV3IEJsb2IoW2NfanNdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcblx0XHRjb25zdCB1cmwgID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcblxuXHRcdGNvbnN0IG9sZHJlcSA9IExJU1MucmVxdWlyZTtcblxuXHRcdExJU1MucmVxdWlyZSA9IGZ1bmN0aW9uKHVybDogVVJMfHN0cmluZykge1xuXG5cdFx0XHRpZiggdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiAmJiB1cmwuc3RhcnRzV2l0aCgnLi8nKSApIHtcblx0XHRcdFx0Y29uc3QgZmlsZW5hbWUgPSB1cmwuc2xpY2UoMik7XG5cdFx0XHRcdGlmKCBmaWxlbmFtZSBpbiBmaWxlcylcblx0XHRcdFx0XHRyZXR1cm4gZmlsZXNbZmlsZW5hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb2xkcmVxKHVybCk7XG5cdFx0fVxuXG5cdFx0a2xhc3MgPSAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJsKSkuZGVmYXVsdDtcblxuXHRcdExJU1MucmVxdWlyZSA9IG9sZHJlcTtcblx0fVxuXHRlbHNlIGlmKCBvcHRzLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGtsYXNzID0gTElTUyh7XG5cdFx0XHQuLi5vcHRzLFxuXHRcdFx0Y29udGVudF9nZW5lcmF0b3I6IExJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3Jcblx0XHR9KTtcblx0fVxuXG5cdGlmKCBrbGFzcyA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGZpbGVzIGZvciBXZWJDb21wb25lbnQgJHt0YWduYW1lfS5gKTtcblxuXHRkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXG5cdHJldHVybiBrbGFzcztcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBpbnRlcm5hbCB0b29scyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2ZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdGNvbnN0IG9wdGlvbnMgPSBpc0xpc3NBdXRvXG5cdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHQ6IHt9O1xuXG5cblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuXHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRpZiggaXNMaXNzQXV0byAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0Y29uc3QgYW5zd2VyID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG5cdGlmKGFuc3dlciA9PT0gXCJcIilcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhbnN3ZXJcbn1cbmFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdC8vIHRlc3QgZm9yIHRoZSBtb2R1bGUgZXhpc3RhbmNlLlxuXHRpZihpc0xpc3NBdXRvICYmIGF3YWl0IF9mZXRjaFRleHQodXJpLCBpc0xpc3NBdXRvKSA9PT0gdW5kZWZpbmVkIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmkpKS5kZWZhdWx0O1xuXHR9IGNhdGNoKGUpIHtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59XG5cblxuY29uc3QgY29udmVydGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlSFRNTCh0ZXh0OiBzdHJpbmcpIHtcblx0Y29udmVydGVyLnRleHRDb250ZW50ID0gdGV4dDtcblx0cmV0dXJuIGNvbnZlcnRlci5pbm5lckhUTUw7XG59XG5cbmV4cG9ydCBjbGFzcyBMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yIGV4dGVuZHMgQ29udGVudEdlbmVyYXRvciB7XG5cblx0cHJvdGVjdGVkIG92ZXJyaWRlIHByZXBhcmVIVE1MKGh0bWw/OiBEb2N1bWVudEZyYWdtZW50IHwgSFRNTEVsZW1lbnQgfCBzdHJpbmcpIHtcblx0XHRcblx0XHR0aGlzLmRhdGEgPSBudWxsO1xuXG5cdFx0aWYoIHR5cGVvZiBodG1sID09PSAnc3RyaW5nJyApIHtcblxuXHRcdFx0dGhpcy5kYXRhID0gaHRtbDtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0Lypcblx0XHRcdGh0bWwgPSBodG1sLnJlcGxhY2VBbGwoL1xcJFxceyhbXFx3XSspXFx9L2csIChfLCBuYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0cmV0dXJuIGA8bGlzcyB2YWx1ZT1cIiR7bmFtZX1cIj48L2xpc3M+YDtcblx0XHRcdH0pOyovXG5cblx0XHRcdC8vVE9ETzogJHt9IGluIGF0dHJcblx0XHRcdFx0Ly8gLSBkZXRlY3Qgc3RhcnQgJHsgKyBlbmQgfVxuXHRcdFx0XHQvLyAtIHJlZ2lzdGVyIGVsZW0gKyBhdHRyIG5hbWVcblx0XHRcdFx0Ly8gLSByZXBsYWNlLiBcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHN1cGVyLnByZXBhcmVIVE1MKGh0bWwpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZmlsbENvbnRlbnQoc2hhZG93OiBTaGFkb3dSb290KSB7XG5cdFx0XG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdGlmKCB0aGlzLmRhdGEgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHN0ciA9ICh0aGlzLmRhdGEgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IGVuY29kZUhUTUwoc2hhZG93Lmhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdHN1cGVyLmZpbGxDb250ZW50KHNoYWRvdyk7XG5cblx0XHQvKlxuXHRcdC8vIGh0bWwgbWFnaWMgdmFsdWVzIGNvdWxkIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdH1cblxuXHRvdmVycmlkZSBnZW5lcmF0ZTxIb3N0IGV4dGVuZHMgTEhvc3Q+KGhvc3Q6IEhvc3QpOiBIVE1MRWxlbWVudCB8IFNoYWRvd1Jvb3Qge1xuXHRcdFxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHRpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiBlbmNvZGVIVE1MKGhvc3QuZ2V0QXR0cmlidXRlKG1hdGNoKSA/PyAnJyApKTtcblx0XHRcdHN1cGVyLnNldFRlbXBsYXRlKCBzdXBlci5wcmVwYXJlSFRNTChzdHIpISApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbnRlbnQgPSBzdXBlci5nZW5lcmF0ZShob3N0KTtcblxuXHRcdC8qXG5cdFx0Ly8gaHRtbCBtYWdpYyB2YWx1ZXMuXG5cdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdGNvbnN0IHZhbHVlcyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblx0XHRmb3IobGV0IHZhbHVlIG9mIHZhbHVlcylcblx0XHRcdHZhbHVlLnRleHRDb250ZW50ID0gaG9zdC5nZXRBdHRyaWJ1dGUodmFsdWUuZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblx0XHQqL1xuXG5cdFx0Ly8gY3NzIHByb3AuXG5cdFx0Y29uc3QgY3NzX2F0dHJzID0gaG9zdC5nZXRBdHRyaWJ1dGVOYW1lcygpLmZpbHRlciggZSA9PiBlLnN0YXJ0c1dpdGgoJ2Nzcy0nKSk7XG5cdFx0Zm9yKGxldCBjc3NfYXR0ciBvZiBjc3NfYXR0cnMpXG5cdFx0XHRob3N0LnN0eWxlLnNldFByb3BlcnR5KGAtLSR7Y3NzX2F0dHIuc2xpY2UoJ2Nzcy0nLmxlbmd0aCl9YCwgaG9zdC5nZXRBdHRyaWJ1dGUoY3NzX2F0dHIpKTtcblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG59XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBpbXBvcnRDb21wb25lbnRzIDogdHlwZW9mIGltcG9ydENvbXBvbmVudHM7XG4gICAgICAgIGltcG9ydENvbXBvbmVudCAgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50O1xuICAgICAgICByZXF1aXJlICAgICAgICAgIDogdHlwZW9mIHJlcXVpcmU7XG4gICAgfVxufVxuXG50eXBlIGltcG9ydENvbXBvbmVudHNfT3B0czxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0ge1xuXHRjZGlyICAgPzogc3RyaW5nfG51bGwsXG5cdGJyeXRob24/OiBzdHJpbmd8bnVsbCxcblx0aG9zdCAgID86IENvbnN0cnVjdG9yPFQ+XG59O1xuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50Pihcblx0XHRcdFx0XHRcdGNvbXBvbmVudHM6IHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdFx0XHRcdFx0XHRicnl0aG9uID0gbnVsbCxcblx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnRcblx0XHRcdFx0XHRcdH06IGltcG9ydENvbXBvbmVudHNfT3B0czxUPikge1xuXG5cdGNvbnN0IHJlc3VsdHM6IFJlY29yZDxzdHJpbmcsIExJU1NDb250cm9sZXJDc3RyPiA9IHt9O1xuXG5cdGZvcihsZXQgdGFnbmFtZSBvZiBjb21wb25lbnRzKSB7XG5cblx0XHRyZXN1bHRzW3RhZ25hbWVdID0gYXdhaXQgaW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdGNkaXIsXG5cdFx0XHRicnl0aG9uLFxuXHRcdFx0aG9zdFxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmNvbnN0IGJyeV93cmFwcGVyID0gYGZyb20gYnJvd3NlciBpbXBvcnQgc2VsZlxuXG5kZWYgd3JhcGpzKGpzX2tsYXNzKTpcblxuXHRjbGFzcyBXcmFwcGVyOlxuXG5cdFx0X2pzX2tsYXNzID0ganNfa2xhc3Ncblx0XHRfanMgPSBOb25lXG5cblx0XHRkZWYgX19pbml0X18odGhpcywgKmFyZ3MpOlxuXHRcdFx0dGhpcy5fanMgPSBqc19rbGFzcy5uZXcoKmFyZ3MpXG5cblx0XHRkZWYgX19nZXRhdHRyX18odGhpcywgbmFtZTogc3RyKTpcblx0XHRcdHJldHVybiB0aGlzLl9qc1tuYW1lXTtcblxuXHRcdGRlZiBfX3NldGF0dHJfXyh0aGlzLCBuYW1lOiBzdHIsIHZhbHVlKTpcblx0XHRcdGlmIG5hbWUgPT0gXCJfanNcIjpcblx0XHRcdFx0c3VwZXIoKS5fX3NldGF0dHJfXyhuYW1lLCB2YWx1ZSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR0aGlzLl9qc1tuYW1lXSA9IHZhbHVlXG5cdFxuXHRyZXR1cm4gV3JhcHBlclxuXG5zZWxmLndyYXBqcyA9IHdyYXBqc1xuYDtcblxuXG5hc3luYyBmdW5jdGlvbiBpbXBvcnRDb21wb25lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdGJyeXRob24gPSBudWxsLFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRob3N0ICAgID0gSFRNTEVsZW1lbnQsXG5cdFx0ZmlsZXMgICA9IG51bGxcblx0fTogaW1wb3J0Q29tcG9uZW50c19PcHRzPFQ+ICYge2ZpbGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPnxudWxsfSA9IHt9XG4pIHtcblxuXHRLbm93blRhZ3MuYWRkKHRhZ25hbWUpO1xuXG5cdGNvbnN0IGNvbXBvX2RpciA9IGAke2NkaXJ9JHt0YWduYW1lfS9gO1xuXG5cdGlmKCBmaWxlcyA9PT0gbnVsbCApIHtcblx0XHRmaWxlcyA9IHt9O1xuXG5cdFx0Y29uc3QgZmlsZSA9IGJyeXRob24gPT09IFwidHJ1ZVwiID8gJ2luZGV4LmJyeScgOiAnaW5kZXguanMnO1xuXG5cdFx0ZmlsZXNbZmlsZV0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9JHtmaWxlfWAsIHRydWUpKSE7XG5cblx0XHQvL1RPRE8hISFcblx0XHR0cnkge1xuXHRcdFx0ZmlsZXNbXCJpbmRleC5odG1sXCJdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4Lmh0bWxgLCB0cnVlKSkhO1xuXHRcdH0gY2F0Y2goZSkge1xuXG5cdFx0fVxuXHRcdHRyeSB7XG5cdFx0XHRmaWxlc1tcImluZGV4LmNzc1wiIF0gPSAoYXdhaXQgX2ZldGNoVGV4dChgJHtjb21wb19kaXJ9aW5kZXguY3NzYCAsIHRydWUpKSE7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHRpZiggYnJ5dGhvbiA9PT0gXCJ0cnVlXCIgJiYgZmlsZXNbJ2luZGV4LmJyeSddICE9PSB1bmRlZmluZWQpIHtcblxuXHRcdGNvbnN0IGNvZGUgPSBmaWxlc1tcImluZGV4LmJyeVwiXTtcblxuXHRcdGZpbGVzWydpbmRleC5qcyddID1cbmBjb25zdCAkQiA9IGdsb2JhbFRoaXMuX19CUllUSE9OX187XG5cbiRCLnJ1blB5dGhvblNvdXJjZShcXGAke2JyeV93cmFwcGVyfVxcYCwgXCJfXCIpO1xuJEIucnVuUHl0aG9uU291cmNlKFxcYCR7Y29kZX1cXGAsIFwiX1wiKTtcblxuY29uc3QgbW9kdWxlID0gJEIuaW1wb3J0ZWRbXCJfXCJdO1xuZXhwb3J0IGRlZmF1bHQgbW9kdWxlLldlYkNvbXBvbmVudDtcblxuYDtcblx0fVxuXG5cdGNvbnN0IGh0bWwgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cdGNvbnN0IGNzcyAgPSBmaWxlc1tcImluZGV4LmNzc1wiXTtcblxuXHRyZXR1cm4gYXdhaXQgZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWUsIGZpbGVzLCB7aHRtbCwgY3NzLCBob3N0fSk7XG59XG5cbmZ1bmN0aW9uIHJlcXVpcmUodXJsOiBVUkx8c3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT58c3RyaW5nIHtcblx0cmV0dXJuIGZldGNoKHVybCk7XG59XG5cblxuTElTUy5pbXBvcnRDb21wb25lbnRzID0gaW1wb3J0Q29tcG9uZW50cztcbkxJU1MuaW1wb3J0Q29tcG9uZW50ICA9IGltcG9ydENvbXBvbmVudDtcbkxJU1MucmVxdWlyZSAgPSByZXF1aXJlOyIsImltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9JTklUSUFMSVpFRFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oZWxlbSk7XG59IiwiXG5pbXBvcnQgeyBDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG50eXBlIExpc3RlbmVyRmN0PFQgZXh0ZW5kcyBFdmVudD4gPSAoZXY6IFQpID0+IHZvaWQ7XG50eXBlIExpc3RlbmVyT2JqPFQgZXh0ZW5kcyBFdmVudD4gPSB7IGhhbmRsZUV2ZW50OiBMaXN0ZW5lckZjdDxUPiB9O1xudHlwZSBMaXN0ZW5lcjxUIGV4dGVuZHMgRXZlbnQ+ID0gTGlzdGVuZXJGY3Q8VD58TGlzdGVuZXJPYmo8VD47XG5cbmV4cG9ydCBjbGFzcyBFdmVudFRhcmdldDI8RXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgRXZlbnQ+PiBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcblxuXHRvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgY2FsbGJhY2s6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIG9wdGlvbnM/OiBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyB8IGJvb2xlYW4pOiB2b2lkIHtcblx0XHRcblx0XHQvL0B0cy1pZ25vcmVcblx0XHRyZXR1cm4gc3VwZXIuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cdH1cblxuXHRvdmVycmlkZSBkaXNwYXRjaEV2ZW50PFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KGV2ZW50OiBFdmVudHNbVF0pOiBib29sZWFuIHtcblx0XHRyZXR1cm4gc3VwZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH1cblxuXHRvdmVycmlkZSByZW1vdmVFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IGxpc3RlbmVyOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgb3B0aW9ucz86IGJvb2xlYW58QWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkIHtcblxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHN1cGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21FdmVudDI8VCBleHRlbmRzIHN0cmluZywgQXJncz4gZXh0ZW5kcyBDdXN0b21FdmVudDxBcmdzPiB7XG5cblx0Y29uc3RydWN0b3IodHlwZTogVCwgYXJnczogQXJncykge1xuXHRcdHN1cGVyKHR5cGUsIHtkZXRhaWw6IGFyZ3N9KTtcblx0fVxuXG5cdG92ZXJyaWRlIGdldCB0eXBlKCk6IFQgeyByZXR1cm4gc3VwZXIudHlwZSBhcyBUOyB9XG59XG5cbnR5cGUgSW5zdGFuY2VzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+PiA9IHtcblx0W0sgaW4ga2V5b2YgVF06IEluc3RhbmNlVHlwZTxUW0tdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gV2l0aEV2ZW50czxUIGV4dGVuZHMgb2JqZWN0LCBFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+ID4oZXY6IENvbnN0cnVjdG9yPFQ+LCBfZXZlbnRzOiBFdmVudHMpIHtcblxuXHR0eXBlIEV2dHMgPSBJbnN0YW5jZXM8RXZlbnRzPjtcblxuXHRpZiggISAoZXYgaW5zdGFuY2VvZiBFdmVudFRhcmdldCkgKVxuXHRcdHJldHVybiBldiBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG5cblx0Ly8gaXMgYWxzbyBhIG1peGluXG5cdC8vIEB0cy1pZ25vcmVcblx0Y2xhc3MgRXZlbnRUYXJnZXRNaXhpbnMgZXh0ZW5kcyBldiB7XG5cblx0XHQjZXYgPSBuZXcgRXZlbnRUYXJnZXQyPEV2dHM+KCk7XG5cblx0XHRhZGRFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5hZGRFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRyZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5yZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRkaXNwYXRjaEV2ZW50KC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5kaXNwYXRjaEV2ZW50KC4uLmFyZ3MpO1xuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIEV2ZW50VGFyZ2V0TWl4aW5zIGFzIHVua25vd24gYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIFNoYWRvd1Jvb3QgdG9vbHMgPT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50TWF0Y2hlcyhldjogRXZlbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcblxuXHRsZXQgZWxlbWVudHMgPSBldi5jb21wb3NlZFBhdGgoKS5zbGljZSgwLC0yKS5maWx0ZXIoZSA9PiAhIChlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgKS5yZXZlcnNlKCkgYXMgSFRNTEVsZW1lbnRbXTtcblxuXHRmb3IobGV0IGVsZW0gb2YgZWxlbWVudHMgKVxuXHRcdGlmKGVsZW0ubWF0Y2hlcyhzZWxlY3RvcikgKVxuXHRcdFx0cmV0dXJuIGVsZW07IFxuXG5cdHJldHVybiBudWxsO1xufSIsIlxuaW1wb3J0IHR5cGUgeyBMSVNTQ29udHJvbGVyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50cyB7fTtcblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmltcG9ydCB7IGluaXRpYWxpemVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQgfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgLy8gYXN5bmNcbiAgICAgICAgcXMgOiB0eXBlb2YgcXM7XG4gICAgICAgIHFzbzogdHlwZW9mIHFzbztcbiAgICAgICAgcXNhOiB0eXBlb2YgcXNhO1xuICAgICAgICBxc2M6IHR5cGVvZiBxc2M7XG5cbiAgICAgICAgLy8gc3luY1xuICAgICAgICBxc1N5bmMgOiB0eXBlb2YgcXNTeW5jO1xuICAgICAgICBxc2FTeW5jOiB0eXBlb2YgcXNhU3luYztcbiAgICAgICAgcXNjU3luYzogdHlwZW9mIHFzY1N5bmM7XG5cblx0XHRjbG9zZXN0OiB0eXBlb2YgY2xvc2VzdDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3Nfc2VsZWN0b3IobmFtZT86IHN0cmluZykge1xuXHRpZihuYW1lID09PSB1bmRlZmluZWQpIC8vIGp1c3QgYW4gaDRja1xuXHRcdHJldHVybiBcIlwiO1xuXHRyZXR1cm4gYDppcygke25hbWV9LCBbaXM9XCIke25hbWV9XCJdKWA7XG59XG5cbmZ1bmN0aW9uIF9idWlsZFFTKHNlbGVjdG9yOiBzdHJpbmcsIHRhZ25hbWVfb3JfcGFyZW50Pzogc3RyaW5nIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LCBwYXJlbnQ6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cdFxuXHRpZiggdGFnbmFtZV9vcl9wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGFnbmFtZV9vcl9wYXJlbnQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cGFyZW50ID0gdGFnbmFtZV9vcl9wYXJlbnQ7XG5cdFx0dGFnbmFtZV9vcl9wYXJlbnQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRyZXR1cm4gW2Ake3NlbGVjdG9yfSR7bGlzc19zZWxlY3Rvcih0YWduYW1lX29yX3BhcmVudCBhcyBzdHJpbmd8dW5kZWZpbmVkKX1gLCBwYXJlbnRdIGFzIGNvbnN0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGxldCByZXN1bHQgPSBhd2FpdCBxc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFRbXT47XG5hc3luYyBmdW5jdGlvbiBxc2E8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl1bXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPFQ+PiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRwcm9taXNlc1tpZHgrK10gPSB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4ocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPihyZXN1bHQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2xvc2VzdDxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCkge1xuXG5cdHdoaWxlKHRydWUpIHtcblx0XHR2YXIgcmVzdWx0ID0gZWxlbWVudC5jbG9zZXN0PEU+KHNlbGVjdG9yKTtcblxuXHRcdGlmKCByZXN1bHQgIT09IG51bGwpXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcblx0XHRpZiggISAoXCJob3N0XCIgaW4gcm9vdCkgKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRlbGVtZW50ID0gKHJvb3QgYXMgU2hhZG93Um9vdCkuaG9zdDtcblx0fVxufVxuXG5cbi8vIGFzeW5jXG5MSVNTLnFzICA9IHFzO1xuTElTUy5xc28gPSBxc287XG5MSVNTLnFzYSA9IHFzYTtcbkxJU1MucXNjID0gcXNjO1xuXG4vLyBzeW5jXG5MSVNTLnFzU3luYyAgPSBxc1N5bmM7XG5MSVNTLnFzYVN5bmMgPSBxc2FTeW5jO1xuTElTUy5xc2NTeW5jID0gcXNjU3luYztcblxuTElTUy5jbG9zZXN0ID0gY2xvc2VzdDsiLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbmltcG9ydCBcIi4vY29yZS9MaWZlQ3ljbGVcIjtcblxuZXhwb3J0IHtkZWZhdWx0IGFzIENvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuLy9UT0RPOiBldmVudHMudHNcbi8vVE9ETzogZ2xvYmFsQ1NTUnVsZXNcbmV4cG9ydCB7TElTU0F1dG9fQ29udGVudEdlbmVyYXRvcn0gZnJvbSBcIi4vaGVscGVycy9MSVNTQXV0b1wiO1xuaW1wb3J0IFwiLi9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzXCI7XG5cbmV4cG9ydCB7U2hhZG93Q2ZnfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQge2xpc3MsIGxpc3NTeW5jfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5leHBvcnQge2V2ZW50TWF0Y2hlcywgV2l0aEV2ZW50cywgRXZlbnRUYXJnZXQyLCBDdXN0b21FdmVudDJ9IGZyb20gJy4vaGVscGVycy9ldmVudHMnO1xuZXhwb3J0IHtodG1sfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUztcblxuLy8gZm9yIGRlYnVnLlxuZXhwb3J0IHtfZXh0ZW5kc30gZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG4vLyByZXF1aXJlZCBmb3IgYXV0byBtb2RlIGl0IHNlZW1zLlxuLy8gQHRzLWlnbm9yZVxuZ2xvYmFsVGhpcy5MSVNTID0gTElTUzsiLCJpbXBvcnQgdHlwZSB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0NvbnRyb2xlclwiO1xuaW1wb3J0IHsgQ29udGVudEdlbmVyYXRvcl9PcHRzLCBDb250ZW50R2VuZXJhdG9yQ3N0ciB9IGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IHtcbiAgICAgICAgZXh0ZW5kczogRXh0ZW5kc0N0ciwgLy8gSlMgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0ciwgICAvLyBIVE1MIEhvc3RcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxufSAmIENvbnRlbnRHZW5lcmF0b3JfT3B0cztcblxuLy9UT0RPOiByZXdyaXRlLi4uXG4vLyBMSVNTQ29udHJvbGVyXG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXJDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgPiA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBJbnN0YW5jZVR5cGU8TElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0ciwgSG9zdENzdHI+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyMkxJU1NDb250cm9sZXJDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPiA9IFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPFxuICAgICAgICAgICAgaW5mZXIgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0NvbnRyb2xlckNzdHI8RXh0ZW5kc0N0cixIb3N0Q3N0cj4gOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyfExJU1NDb250cm9sZXJDc3RyID0gTElTU0NvbnRyb2xlcj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyID8gTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47XG5cbi8vIGxpZ2h0ZXIgTElTU0hvc3QgZGVmIHRvIGF2b2lkIHR5cGUgaXNzdWVzLi4uXG5leHBvcnQgdHlwZSBMSG9zdDxIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPSB7XG5cbiAgICBjb250ZW50OiBTaGFkb3dSb290fEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICBzaGFkb3dNb2RlOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIENTU1NlbGVjdG9yOiBzdHJpbmc7XG5cbn0gJiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5leHBvcnQgdHlwZSBMSG9zdENzdHI8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuICAgIG5ldyguLi5hcmdzOiBhbnkpOiBMSG9zdDxIb3N0Q3N0cj47XG5cbiAgICBDZmc6IHtcbiAgICAgICAgaG9zdCAgICAgICAgICAgICA6IEhvc3RDc3RyLFxuICAgICAgICBjb250ZW50X2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvckNzdHIsXG4gICAgICAgIGFyZ3MgICAgICAgICAgICAgOiBDb250ZW50R2VuZXJhdG9yX09wdHNcbiAgICB9XG5cbn0gJiBIb3N0Q3N0cjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogSFRNTEVsZW1lbnQgfCB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cbiAgICBpZiggQ2xhc3MgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgQ2xhc3MgPSBDbGFzcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgSFRNTEVsZW1lbnQ7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cbiAgICBsZXQgY3Vyc29yID0gQ2xhc3M7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdoaWxlIChjdXJzb3IuX19wcm90b19fICE9PSBIVE1MRWxlbWVudClcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjdXJzb3IgPSBjdXJzb3IuX19wcm90b19fO1xuXG4gICAgLy8gZGlyZWN0bHkgaW5oZXJpdCBIVE1MRWxlbWVudFxuICAgIGlmKCAhIGN1cnNvci5uYW1lLnN0YXJ0c1dpdGgoJ0hUTUwnKSAmJiAhIGN1cnNvci5uYW1lLmVuZHNXaXRoKCdFbGVtZW50JykgKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGh0bWx0YWcgPSBjdXJzb3IubmFtZS5zbGljZSg0LCAtNyk7XG5cblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IEhUTUxFbGVtZW50IHwgdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuLypcbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlclxuKi9cblxuLy8gbW92ZWQgaGVyZSBpbnN0ZWFkIG9mIGJ1aWxkIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwcy5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59IiwiaW1wb3J0IHRlbXBsYXRlLCB7IEhUTUwgfSBmcm9tIFwiVjMvdXRpbHMvdGVtcGxhdGVcIjtcbmltcG9ydCBDb250ZW50R2VuZXJhdG9yIGZyb20gXCIuL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCBlbmNvZGVIVE1MIGZyb20gXCJWMy91dGlscy9lbmNvZGVcIjtcblxuY29uc3QgcmVnZXggPSAvXFwkXFx7KC4rPylcXH0vZztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b0NvbnRlbnRHZW5lcmF0b3IgZXh0ZW5kcyBDb250ZW50R2VuZXJhdG9yIHtcblxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBwcmVwYXJlVGVtcGxhdGUoaHRtbDogSFRNTCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcblxuICAgICAgICBpZiggdHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gaHRtbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8bGlzcyB2YWx1ZT1cIiR7bmFtZX1cIj48L2xpc3M+YDtcbiAgICAgICAgICAgIH0pOyovXG5cbiAgICAgICAgICAgIC8vVE9ETzogJHt9IGluIGF0dHJcbiAgICAgICAgICAgICAgICAvLyAtIGRldGVjdCBzdGFydCAkeyArIGVuZCB9XG4gICAgICAgICAgICAgICAgLy8gLSByZWdpc3RlciBlbGVtICsgYXR0ciBuYW1lXG4gICAgICAgICAgICAgICAgLy8gLSByZXBsYWNlLiBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3VwZXIucHJlcGFyZVRlbXBsYXRlKGh0bWwpO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGZpbGxDb250ZW50KHNoYWRvdzogU2hhZG93Um9vdCkge1xuICAgICAgICBcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuICAgICAgICBpZiggdGhpcy5kYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBzdHIgPSAodGhpcy5kYXRhIGFzIHN0cmluZykucmVwbGFjZShyZWdleCwgKF8sIG1hdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzaGFkb3cuaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpO1xuICAgICAgICAgICAgICAgIGlmKCB2YWx1ZSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnOyBcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlSFRNTCh2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3VwZXIucHJlcGFyZVRlbXBsYXRlKHN0cik7XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci5maWxsQ29udGVudChzaGFkb3cpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIC8vIGh0bWwgbWFnaWMgdmFsdWVzIGNvdWxkIGJlIG9wdGltaXplZC4uLlxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG4gICAgICAgIGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuICAgICAgICAgICAgdmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuICAgICAgICAqL1xuICAgIH1cbn0iLCJpbXBvcnQgeyBpc1Jlc3NvdXJjZVJlYWR5LCBSZXNzb3VyY2UsIHdhaXRSZXNzb3VyY2UgfSBmcm9tIFwiVjMvdXRpbHMvcmVzc291cmNlXCI7XG5pbXBvcnQgeyBnZXRTaGFyZWRDU1MgfSBmcm9tIFwiVjIvTElTU0hvc3RcIjtcbmltcG9ydCB7IFNoYWRvd0NmZyB9IGZyb20gXCJWMi90eXBlc1wiO1xuaW1wb3J0IHsgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCJWMi91dGlsc1wiO1xuaW1wb3J0IHRlbXBsYXRlLCB7IEhUTUwgfSBmcm9tIFwiVjMvdXRpbHMvdGVtcGxhdGVcIjtcbmltcG9ydCBzdHlsZSAgICwge0NTU30gICAgZnJvbSBcIlYzL3V0aWxzL3N0eWxlXCI7XG5cbnR5cGUgU1RZTEUgPSBDU1MgfCByZWFkb25seSBDU1NbXTtcblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvcl9PcHRzID0ge1xuICAgIGh0bWwgICA/OiBSZXNzb3VyY2U8SFRNTD4sXG4gICAgY3NzICAgID86IFJlc3NvdXJjZTxTVFlMRT4sXG4gICAgc2hhZG93ID86IFNoYWRvd0NmZ3xudWxsXG59XG5cbmNvbnN0IHNoYXJlZENTUyA9IGdldFNoYXJlZENTUygpOyAvLyBmcm9tIExJU1NIb3N0Li4uXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgcHJvdGVjdGVkIGRhdGE6IGFueTtcblxuICAgICNzaGFkb3cgICAgIDogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGh0bWwsXG4gICAgICAgIGNzcyAgICA9IFtdLFxuICAgICAgICBzaGFkb3cgPSBudWxsLFxuICAgIH06IENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4jc2hhZG93ICAgPSBzaGFkb3c7XG5cbiAgICAgICAgY29uc3QgaXNSZWFkeSA9IGlzUmVzc291cmNlUmVhZHk8SFRNTD4gKGh0bWwpXG4gICAgICAgICAgICAgICAgICAgICAmJiBpc1Jlc3NvdXJjZVJlYWR5PFNUWUxFPihjc3MpXG4gICAgICAgICAgICAgICAgICAgICAmJiBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcblxuICAgICAgICBpZiggaXNSZWFkeSApXG4gICAgICAgICAgICB0aGlzLnByZXBhcmUoaHRtbCwgY3NzKTtcblxuICAgICAgICBjb25zdCB3aGVuUmVhZHk6IFByb21pc2U8W0hUTUx8dW5kZWZpbmVkLCBTVFlMRXx1bmRlZmluZWQsIHVua25vd25dPiA9IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHdhaXRSZXNzb3VyY2U8SFRNTCB8dW5kZWZpbmVkPihodG1sKSxcbiAgICAgICAgICAgIHdhaXRSZXNzb3VyY2U8U1RZTEV8dW5kZWZpbmVkPihjc3MpLFxuICAgICAgICAgICAgd2hlbkRPTUNvbnRlbnRMb2FkZWQoKVxuICAgICAgICBdKTtcblxuICAgICAgICB3aGVuUmVhZHkudGhlbiggKGFyZ3MpID0+IHRoaXMucHJlcGFyZShhcmdzWzBdLCBhcmdzWzFdKSApO1xuXG4gICAgICAgIHRoaXMuaXNSZWFkeSAgID0gaXNSZWFkeTtcbiAgICAgICAgdGhpcy53aGVuUmVhZHkgPSB3aGVuUmVhZHk7XG4gICAgfVxuXG4gICAgLyoqIHJlYWR5ICoqKi9cblxuICAgIHJlYWRvbmx5IHdoZW5SZWFkeTogUHJvbWlzZTx1bmtub3duPjtcbiAgICByZWFkb25seSBpc1JlYWR5ICA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBwcm9jZXNzIHJlc3NvdXJjZXMgKiovXG5cbiAgICBwcm90ZWN0ZWQgc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXSAgICAgICA9IFtdO1xuICAgIHByb3RlY3RlZCB0ZW1wbGF0ZSAgIDogRG9jdW1lbnRGcmFnbWVudHxudWxsID0gbnVsbDtcblxuICAgIHByb3RlY3RlZCBwcmVwYXJlKGh0bWw6IEhUTUx8dW5kZWZpbmVkLCBjc3M6IFNUWUxFfHVuZGVmaW5lZCkge1xuICAgICAgICBpZiggaHRtbCAhPT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZVRlbXBsYXRlKGh0bWwpO1xuICAgICAgICBpZiggY3NzICAhPT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZVN0eWxlICAgKGNzcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVUZW1wbGF0ZShodG1sOiBIVE1MKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZShodG1sKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHByZXBhcmVTdHlsZShjc3M6IFNUWUxFKSB7XG5cbiAgICAgICAgaWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcbiAgICAgICAgICAgIGNzcyA9IFtjc3NdO1xuXG4gICAgICAgIHRoaXMuc3R5bGVzaGVldHMgPSBjc3MubWFwKGUgPT4gc3R5bGUoZSkgKTtcbiAgICB9XG5cbiAgICAvKioqIEdlbmVyYXRlIGNvbnRlbnRzICoqKi9cblxuICAgIGluaXRDb250ZW50KHRhcmdldDogSFRNTEVsZW1lbnQsIG1vZGU6XCJvcGVuXCJ8XCJjbG9zZWRcInxudWxsKSB7XG5cbiAgICAgICAgbGV0IGNvbnRlbnQ6IFNoYWRvd1Jvb3R8SFRNTEVsZW1lbnQgPSB0YXJnZXQ7XG4gICAgICAgIGlmKCBtb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gdGFyZ2V0LmF0dGFjaFNoYWRvdyh7bW9kZX0pO1xuICAgICAgICAgICAgY29udGVudC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MsIC4uLnRoaXMuc3R5bGVzaGVldHMpO1xuICAgICAgICB9XG4gICAgICAgIC8vVE9ETzogQ1NTIGZvciBubyBzaGFkb3cgPz8/XG4gICAgICAgIFxuICAgICAgICB0aGlzLmZpbGxDb250ZW50KGNvbnRlbnQpO1xuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGZpbGxDb250ZW50KHRhcmdldDogU2hhZG93Um9vdHxIVE1MRWxlbWVudHxEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIFxuICAgICAgICBpZiggdGhpcy50ZW1wbGF0ZSAhPT0gbnVsbClcbiAgICAgICAgICAgIHRhcmdldC5yZXBsYWNlQ2hpbGRyZW4oIHRoaXMuY3JlYXRlQ29udGVudCgpICk7XG5cbiAgICAgICAgLy9UT0RPLi4uXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGFyZ2V0KTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb250ZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZSEuY2xvbmVOb2RlKHRydWUpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBERUZBVUxUX0NESVIsIEtub3duVGFncyB9IGZyb20gXCJWMi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5pbXBvcnQgZGVmaW5lIGZyb20gXCJWMy91dGlscy9kZWZpbmVcIjtcbmltcG9ydCBMSVNTdjMgZnJvbSBcIlYzXCI7XG5pbXBvcnQgQXV0b0NvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIlYzL0NvbnRlbnRHZW5lcmF0b3JzL0F1dG9Db250ZW50R2VuZXJhdG9yXCI7XG5cbnR5cGUgaW1wb3J0Q29tcG9uZW50c19PcHRzVjM8VCBleHRlbmRzIEhUTUxFbGVtZW50PiA9IHtcblx0Y2RpciAgID86IHN0cmluZ3xudWxsXG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW1wb3J0Q29tcG9uZW50VjM8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHR0YWduYW1lOiBzdHJpbmcsXG5cdHtcblx0XHRjZGlyICAgID0gREVGQVVMVF9DRElSLFxuXHRcdC8vIGJyeXRob24gPSBudWxsXG5cdH06IGltcG9ydENvbXBvbmVudHNfT3B0c1YzPFQ+ID0ge31cbikge1xuXG5cdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0Y29uc3QgY29tcG9fZGlyID0gYCR7Y2Rpcn0ke3RhZ25hbWV9L2A7XG5cblx0Y29uc3QgZmlsZXM6IFJlY29yZDxzdHJpbmcsc3RyaW5nfHVuZGVmaW5lZD4gPSB7fTtcblxuXHQvLyBzdHJhdHMgOiBKUyAtPiBCcnkgLT4gSFRNTCtDU1MgKGNmIHNjcmlwdCBhdHRyKS5cblxuICAgIGZpbGVzW1wianNcIl0gPSBhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5qc2AsIHRydWUpO1xuXG4gICAgaWYoIGZpbGVzW1wianNcIl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyB0cnkvY2F0Y2ggP1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtcbiAgICAgICAgICAgIF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4Lmh0bWxgLCB0cnVlKSEsXG4gICAgICAgICAgICBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5jc3NgICwgdHJ1ZSkhXG4gICAgICAgIF07XG4gICAgICAgIFtmaWxlc1tcImh0bWxcIl0sIGZpbGVzW1wiY3NzXCIgXV0gPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG5cdHJldHVybiBhd2FpdCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlKGNvZGU6IHN0cmluZywgdHlwZTogXCJqc1wiKSB7XG5cbiAgICBsZXQgcmVzdWx0O1xuXG4gICAgaWYoIHR5cGUgPT09IFwianNcIiApIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IG5ldyBCbG9iKFtjb2RlXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG4gICAgICAgIGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG4gICAgICAgIHJlc3VsdCA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKTtcbiAgICAgICAgXG4gICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vL1RPRE86IHJlbmFtZSBmcm9tIGZpbGVzID9cbmFzeW5jIGZ1bmN0aW9uIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgXG4gICAgbGV0IGtsYXNzO1xuICAgIGlmKCBcImpzXCIgaW4gZmlsZXMgKSB7XG4gICAgICAgIGtsYXNzID0gKGF3YWl0IGV4ZWN1dGUoZmlsZXNbXCJqc1wiXSwgXCJqc1wiKSkuZGVmYXVsdDtcbiAgICB9XG5cbiAgICBpZigga2xhc3MgPT09IHVuZGVmaW5lZCApXG4gICAgICAgIGtsYXNzID0gTElTU3YzKHtcbiAgICAgICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBBdXRvQ29udGVudEdlbmVyYXRvcixcbiAgICAgICAgICAgIC4uLmZpbGVzXG4gICAgICAgIH0pO1xuXG4gICAgZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblxuICAgIHJldHVybiBrbGFzcztcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIHZhciBMSVNTQ29udGV4dDoge1xuICAgICAgICBmZXRjaD86IHtcbiAgICAgICAgICAgIGN3ZCAgOiBzdHJpbmcsXG4gICAgICAgICAgICBmaWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBpbiBhdXRvLW1vZGUgdXNlIFNlcnZpY2VXb3JrZXIgdG8gaGlkZSA0MDQgZXJyb3IgbWVzc2FnZXMuXG4vLyBpZiBwbGF5Z3JvdW5kIGZpbGVzLCB1c2UgdGhlbS5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaGlkZTQwNDogYm9vbGVhbiA9IGZhbHNlKSB7XG5cbiAgICBjb25zdCBmZXRjaENvbnRleHQgPSBnbG9iYWxUaGlzLkxJU1NDb250ZXh0LmZldGNoO1xuICAgIGlmKCBmZXRjaENvbnRleHQgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBVUkwodXJpLCBmZXRjaENvbnRleHQuY3dkICk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZmV0Y2hDb250ZXh0LmZpbGVzW3BhdGgudG9TdHJpbmcoKV07XG4gICAgICAgIGlmKCB2YWx1ZSA9PT0gXCJcIiApXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBpZiggdmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gaGlkZTQwNFxuICAgICAgICAgICAgICAgICAgICAgICAgPyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7fTtcblxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuICAgIGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGlmKCBoaWRlNDA0ICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cbiAgICBpZihhbnN3ZXIgPT09IFwiXCIpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gYW5zd2VyXG59XG5cbi8vIEB0cy1pZ25vcmVcbmdsb2JhbFRoaXMucmVxdWlyZSA9IGFzeW5jIGZ1bmN0aW9uKHVybDogc3RyaW5nKSB7XG4gICAgLy9UT0RPOiBub24gcGxheWdyb3VuZC4uLlxuICAgIHJldHVybiBhd2FpdCBfZmV0Y2hUZXh0KHVybCk7XG59IiwiaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIlYzL0NvbnRlbnRHZW5lcmF0b3JzL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cblxuICAgIC8qcHJvdGVjdGVkIGdldEluaXRpYWxWYWx1ZTxOIGV4dGVuZHMga2V5b2YgdGhpcz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZTogTik6IHVuZGVmaW5lZHx0aGlzW05dXG4gICAgcHJvdGVjdGVkIGdldEluaXRpYWxWYWx1ZTxOIGV4dGVuZHMga2V5b2YgdGhpcywgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZTogTiwgZGVmYXVsdFZhbHVlOiBEKSA6IER8dGhpc1tOXVxuICAgIHByb3RlY3RlZCBnZXRJbml0aWFsVmFsdWU8TiBleHRlbmRzIGtleW9mIHRoaXMsIEQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWU6IE4sIGRlZmF1bHRWYWx1ZT86IEQpOiB1bmRlZmluZWR8RHx0aGlzW05dIHtcbiAgICAgICAgcmV0dXJuIGdldEluaXRpYWxWYWx1ZSh0aGlzLCBuYW1lLCBkZWZhdWx0VmFsdWUpO1xuICAgIH0qL1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IFNIQURPV19NT0RFICAgICAgOiBcIm9wZW5cInxcImNsb3NlZFwifG51bGwgPSBudWxsO1xuICAgIC8vIFRPRE86IHN0YXRpYyBjYWNoZSBnZXR0ZXIgKyB1c2Ugc3RhdGljIEhUTUwvQ1NTLlxuICAgIHN0YXRpYyByZWFkb25seSBDT05URU5UX0dFTkVSQVRPUjogQ29udGVudEdlbmVyYXRvcnxudWxsID0gbnVsbDtcblxuICAgIHJlYWRvbmx5IGNvbnRlbnQgIDogU2hhZG93Um9vdHxIVE1MRWxlbWVudCAgICAgICAgPSB0aGlzO1xuICAgIHJlYWRvbmx5IGhvc3QgICAgIDogSFRNTEVsZW1lbnQgICAgICAgICAgICAgICAgICAgPSB0aGlzO1xuICAgIHJlYWRvbmx5IGNvbnRyb2xlcjogT21pdDx0aGlzLCBrZXlvZiBIVE1MRWxlbWVudD4gPSB0aGlzO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3Qga2xhc3MgPSB0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBMSVNTQmFzZTtcblxuICAgICAgICBpZigga2xhc3MuQ09OVEVOVF9HRU5FUkFUT1IgIT09IG51bGwgKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBrbGFzcy5DT05URU5UX0dFTkVSQVRPUi5pbml0Q29udGVudCh0aGlzLCBrbGFzcy5TSEFET1dfTU9ERSk7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4odGhpcy50YWdOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQge2RlZmF1bHQgYXMgZGVmYXVsdH0gZnJvbSBcIi4vTElTU0Jhc2VcIjsiLCIvLyBleGFtcGxlIDogcGxheWdyb3VuZCB2MyAoPylcbiAgICAvLyBsaXNzLXZlcnNpb249XCJ2M1wiXG4gICAgLy8gbGlzcy12Mz1cImF1dG9cIiAoYydlc3QgbGEgdjMgcXUnaWwgZmF1dCB1dGlsaXNlcilcblxuLy8gVE9ETzogaW4gcGxheWdyb3VuZCBicnl0aG9uIHNyYyBvbmx5IGlmIGJyeXRob25cbi8vIFRPRE86IHJlbW92ZSB2MiAoYXV0b2RpcikgKyB2MiBmY3RzXG5cbi8vIERPQ1NcbiAgICAvLyBkb2MvZnIvYXV0by5tZFxuICAgIC8vIEN0cmxlci9MaWZlQ3ljbGVcbiAgICAvLyBkb2MvZW4gKG9icyA/KVxuICAgIC8vIFJFQURNRS5tZFxuXG4vLyBUT0RPOiBhdXRvLW1vZGUgKGFsbCB3aXRoIGF1dG8uLi4pXG4gICAgLy8gVE9ETzogdHJ1ZSBhdXRvLW1vZGUgaW4gdGVzdHMgKGNoYW5nZSBCcnl0aG9uLi4uKVxuICAgICAgICAvLyB0ZXN0djNcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgSFRNTCBpbiB0ZXN0IGlmIChudWxsKS4uLlxuICAgICAgICAgICAgLy8gbGlrZSBwbGF5Z3JvdW5kICg/KSA9PiBkaWZmZXJlbnQgZmlsZSBmb3IgY2xlYW5lciBjb2RlID9cbiAgICAvLyBmaWxlcz1cImpzLHRzLGJyeSxodG1sXCIgLSBkZWZhdWx0IChodG1sK2NzcytqcykgP1xuXG4vLyBkb2NzICgrIGV4YW1wbGVzIHBsYXlncm91bmQvdGVzdHMgLy8gQnJ5L0pTKS5cbiAgICAvLyBub24tYXV0byBmaXJzdC5cbiAgICAgICAgLy8gZXh0ZW5kcyAoTElTUyBCYXNlKVxuICAgICAgICAvLyBMSVNTKHt9KSBvcHRzLlxuICAgICAgICAvLyBkZWZpbmUuXG4gICAgICAgIC8vIEFQSS4uLiBmb3IgYmV0dGVyIHN1Z2dlc3Rpb25zLlxuICAgICAgICAvLyBydWxlcy4uLlxuXG4vLyBUT0RPOiBjb250ZW50R2VuZXJhdG9yXG4vLyBUT0RPOiBkb2NzIChvZmMpXG5cbi8vIFRPRE86IHV0aWxzICsgc2lnbmFscyArIERPTUNvbnRlbnRMb2FkZWQgYmVmb3JlLi4uICsgdXBncmFkZSBjaGlsZHJlbiBpbiBjc3RyID9cbiAgICAvLyBidWlsZFxuICAgIC8vIHJlbW92ZSBldmVudHMgKyBxcyA/XG4gICAgLy8gVE9ETzogc3RhdGUgKGludGVybmFsIHN0YXRlKVxuICAgIC8vIFRPRE86IGJsaXNzXG4gICAgLy8gVE9ETzogc2hhcmVkQ1NTXG5cbi8vIFRPRE86IHVwZ3JhZGVcbiAgICAvLyBUT0RPOiBnZXQgdXBncmFkZWQgP1xuICAgIC8vIFRPRE86IHVwZ3JhZGUgKysgPiBkZWZpbml0aW9uIG9yZGVyIGlmIGluc2lkZSBjaGlsZCBhbmQgYXZhaWxhYmxlLlxuICAgIC8vIFRPRE86IGRlZmluZWQgOiB2aXNpYmlsaXR5OiBoaWRkZW4gdW50aWwgZGVmaW5lZCA/XG4gICAgICAgIC8vIFRPRE86IGxvYWRlciBjdXN0b21FbGVtZW50IChyZXBsYWNlV2l0aCA/KVxuXG5cbi8vIFRPRE86IHBsYXlncm91bmRcbiAgICAvLyBUT0RPOiBmYWN1bHRhdGl2ZSBIVE1MIGluIGVkaXRvci9wbGF5Z3JvdW5kXG4gICAgLy8gVE9ETzogc2hvdyBlcnJvci4uLlxuICAgIC8vIFRPRE86IGRlYm91bmNlL3Rocm90dGxlIGVkaXRvci4uLlxuXG5pbXBvcnQgQ29udGVudEdlbmVyYXRvciBmcm9tIFwiVjMvQ29udGVudEdlbmVyYXRvcnMvQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IExJU1NGdWxsIGZyb20gXCIuL0xJU1MvTElTU0Z1bGxcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxWYWx1ZTxFIGV4dGVuZHMgSFRNTEVsZW1lbnQsIE4gZXh0ZW5kcyBrZXlvZiBFPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlOiBFLCBuYW1lOiBOKTogdW5kZWZpbmVkfEVbTl1cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsVmFsdWU8RSBleHRlbmRzIEhUTUxFbGVtZW50LCBOIGV4dGVuZHMga2V5b2YgRSwgRD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZTogRSwgbmFtZTogTiwgZGVmYXVsdFZhbHVlOiBEKSA6IER8RVtOXVxuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxWYWx1ZTxFIGV4dGVuZHMgSFRNTEVsZW1lbnQsIE4gZXh0ZW5kcyBrZXlvZiBFLCBEPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlOiBFLCBuYW1lOiBOLCBkZWZhdWx0VmFsdWU/OiBEKTogdW5kZWZpbmVkfER8RVtOXSB7XG5cbiAgICBpZiggISBPYmplY3QuaGFzT3duKGUsIG5hbWUpIClcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIGNvbnN0ICBfID0gZVtuYW1lXTtcbiAgICBkZWxldGUgICAgIGVbbmFtZV07XG4gICAgcmV0dXJuIF87XG59XG5cbnR5cGUgQ3N0cjxUPiA9IG5ldyguLi5hcmdzOmFueVtdKSA9PiBUXG50eXBlIExJU1N2M19PcHRzPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID4gPSB7XG4gICAgY29udGVudF9nZW5lcmF0b3I6IFQsXG59ICYgQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+WzBdO1xuXG4vLyAgYnVpbGRlclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTElTU3YzPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID0gQ3N0cjxDb250ZW50R2VuZXJhdG9yPj4ob3B0czogUGFydGlhbDxMSVNTdjNfT3B0czxUPj4gPSB7fSkge1xuICAgIFxuICAgIGNvbnN0IGNvbnRlbnRfZ2VuZXJhdG9yID0gb3B0cy5jb250ZW50X2dlbmVyYXRvciA/PyBDb250ZW50R2VuZXJhdG9yO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBnZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3IgPSBuZXcgY29udGVudF9nZW5lcmF0b3Iob3B0cyk7XG4gICAgXG4gICAgcmV0dXJuIGNsYXNzIF9MSVNTIGV4dGVuZHMgTElTU0Z1bGwge1xuXG4gICAgICAgIC8vIFRPRE86IG5vIGNvbnRlbnQgaWYuLi4gPz8/XG4gICAgICAgIC8vIG92ZXJyaWRlIGF0dGFjaFNoYWRvdyAgPz8/XG4gICAgICAgIHN0YXRpYyBvdmVycmlkZSByZWFkb25seSBTSEFET1dfTU9ERSAgICAgICA9IFwib3BlblwiO1xuICAgICAgICBzdGF0aWMgb3ZlcnJpZGUgcmVhZG9ubHkgQ09OVEVOVF9HRU5FUkFUT1IgPSBnZW5lcmF0b3I7XG5cbiAgICB9XG59IiwiaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIlYzL0NvbnRlbnRHZW5lcmF0b3JzL0NvbnRlbnRHZW5lcmF0b3JcIjtcblxuY29uc3QgV2FpdGluZ0RlZmluZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBkZWZpbmUodGFnbmFtZTogc3RyaW5nLCBLbGFzczogbmV3KC4uLmFyZ3M6YW55W10pID0+IEhUTUxFbGVtZW50KSB7XG5cbiAgICAvL1RPRE86IFB5dGhvbiBjbGFzcy4uLlxuXG4gICAgLy9UT0RPOiB0eXBlIHNhZmVcbiAgICBpZiggXCJDT05URU5UX0dFTkVSQVRPUlwiIGluIEtsYXNzICkge1xuICAgICAgICBjb25zdCBnZW5lcmF0b3IgPSBLbGFzcy5DT05URU5UX0dFTkVSQVRPUiBhcyBDb250ZW50R2VuZXJhdG9yO1xuXG4gICAgICAgIGlmKCAhIGdlbmVyYXRvci5pc1JlYWR5ICkge1xuICAgICAgICAgICAgV2FpdGluZ0RlZmluZS5hZGQodGFnbmFtZSk7XG4gICAgICAgICAgICBhd2FpdCBnZW5lcmF0b3Iud2hlblJlYWR5O1xuICAgICAgICAgICAgV2FpdGluZ0RlZmluZS5kZWxldGUodGFnbmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgS2xhc3MpO1xufSIsImNvbnN0IGNvbnZlcnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW5jb2RlSFRNTCh0ZXh0OiBzdHJpbmcpIHtcblx0Y29udmVydGVyLnRleHRDb250ZW50ID0gdGV4dDtcblx0cmV0dXJuIGNvbnZlcnRlci5pbm5lckhUTUw7XG59IiwiZXhwb3J0IHR5cGUgUmVzc291cmNlPFQ+ID1cbiAgICAgIFRcbiAgICB8IFByb21pc2U8VD5cbiAgICB8IChUIGV4dGVuZHMgc3RyaW5nICAgICAgICAgPyBQcm9taXNlPFJlc3BvbnNlPiB8IFJlc3BvbnNlIDogbmV2ZXIpXG4gICAgfCAoVCBleHRlbmRzIEFycmF5PGluZmVyIEU+ID8gUmVzc291cmNlPEU+W10gICAgICAgICAgICAgICA6IG5ldmVyKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVzc291cmNlUmVhZHk8VD4ocmVzOiBSZXNzb3VyY2U8VD58dW5kZWZpbmVkKTogcmVzIGlzIFR8dW5kZWZpbmVkIHtcblxuICAgIGlmKCBBcnJheS5pc0FycmF5KHJlcykgKVxuICAgICAgICByZXR1cm4gcmVzLmV2ZXJ5KCBlID0+IGlzUmVzc291cmNlUmVhZHkocmVzW2VdKSApO1xuXG4gICAgcmV0dXJuIHJlcyA9PT0gdW5kZWZpbmVkIHx8ICEocmVzIGluc3RhbmNlb2YgUHJvbWlzZSB8fCByZXMgaW5zdGFuY2VvZiBSZXNwb25zZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0UmVzc291cmNlPFQ+KHJlczogUmVzc291cmNlPFQ+KTogUHJvbWlzZTxUPiB7XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShyZXMpIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHJlcy5tYXAoIGUgPT4gd2FpdFJlc3NvdXJjZShlKSkpIGFzIFQ7XG5cbiAgICBpZiggcmVzIGluc3RhbmNlb2YgUHJvbWlzZSlcbiAgICAgICAgcmVzID0gYXdhaXQgcmVzO1xuXG4gICAgaWYoIHJlcyBpbnN0YW5jZW9mIFJlc3BvbnNlKVxuICAgICAgICByZXMgPSBhd2FpdCByZXMudGV4dCgpIGFzIFQ7XG5cbiAgICByZXR1cm4gcmVzIGFzIFQ7XG59IiwiZXhwb3J0IHR5cGUgQ1NTICAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHlsZShlbGVtOiBDU1MpICAgICAgICAgICAgICAgICAgIDogQ1NTU3R5bGVTaGVldFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3R5bGUoLi4ucmF3OiBUZW1wbGF0ZVN0cmluZ3NBcnJheSk6IENTU1N0eWxlU2hlZXRcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0eWxlKC4uLnJhdzogVGVtcGxhdGVTdHJpbmdzQXJyYXl8W0NTU10pOiBDU1NTdHlsZVNoZWV0IHtcblxuICAgIGxldCBlbGVtID0gcmF3WzBdO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0IClcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuICAgICAgICByZXR1cm4gZWxlbS5zaGVldCE7XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShlbGVtKSApIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0ciA9IChyYXcgYXMgVGVtcGxhdGVTdHJpbmdzQXJyYXkpWzBdO1xuXG4gICAgICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPCByYXcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSByYXdbaV07XG4gICAgICAgICAgICBzdHJpbmcgKz0gc3RyW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbSA9IHN0cmluZztcbiAgICB9XG5cbiAgICBpZiggdHlwZW9mIGVsZW0gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGVsZW0pO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJzXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICBzdHlsZS5yZXBsYWNlU3luYyhlbGVtKTtcbiAgICByZXR1cm4gc3R5bGU7XG59IiwiZXhwb3J0IHR5cGUgSFRNTCAgPSBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50fHN0cmluZztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUoIC4uLnJhdzogVGVtcGxhdGVTdHJpbmdzQXJyYXkgKTogRG9jdW1lbnRGcmFnbWVudFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUoIGVsZW06IEhUTUwgKTogRG9jdW1lbnRGcmFnbWVudFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUoIC4uLnJhdzogVGVtcGxhdGVTdHJpbmdzQXJyYXl8W0hUTUxdICk6IERvY3VtZW50RnJhZ21lbnQge1xuXG4gICAgbGV0IGVsZW0gPSByYXdbMF07XG5cbiAgICBpZiggQXJyYXkuaXNBcnJheShlbGVtKSApIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0ciA9IChyYXcgYXMgVGVtcGxhdGVTdHJpbmdzQXJyYXkpWzBdO1xuXG4gICAgICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPCByYXcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSByYXdbaV07XG4gICAgICAgICAgICBzdHJpbmcgKz0gc3RyW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbSA9IHN0cmluZztcbiAgICB9XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgICByZXR1cm4gZWxlbS5jbG9uZU5vZGUodHJ1ZSkgYXMgRG9jdW1lbnRGcmFnbWVudDtcblxuICAgIC8vIG11c3QgdXNlIHRlbXBsYXRlIGFzIERvY3VtZW50RnJhZ21lbnQgZG9lc24ndCBoYXZlIC5pbm5lckhUTUxcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgaWYodHlwZW9mIGVsZW0gPT09ICdzdHJpbmcnKVxuICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBlbGVtLnRyaW0oKTtcbiAgICBlbHNlIHtcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgICAgIC8vIHByZXZlbnRzIGlzc3VlIGlmIGVsZW0gaXMgbGF0dGVyIHVwZGF0ZWQuXG4gICAgICAgICAgICBlbGVtID0gZWxlbS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIFxuICAgICAgICB0ZW1wbGF0ZS5hcHBlbmQoIGVsZW0gKTtcbiAgICB9XG5cbiAgICAvL2lmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgIC8vICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkISBhcyB1bmtub3duIGFzIFQ7XG4gICAgXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHYyIGZyb20gXCIuL1YyXCI7XG5pbXBvcnQgdjMgZnJvbSBcIi4vVjNcIjtcblxuLy8gQHRzLWlnbm9yZVxudjIudjMgPSB2MztcblxuaW1wb3J0IHN0eWxlICAgICAgZnJvbSBcIi4vVjMvdXRpbHMvc3R5bGVcIjtcbmltcG9ydCB0ZW1wbGF0ZSAgIGZyb20gXCIuL1YzL3V0aWxzL3RlbXBsYXRlXCI7XG5pbXBvcnQgZ2VuZXJhdG9ycyBmcm9tIFwiLi9WMy9Db250ZW50R2VuZXJhdG9ycy9BdXRvQ29udGVudEdlbmVyYXRvclwiO1xuXG4vLyBAdHMtaWdub3JlXG52Mi50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuLy8gQHRzLWlnbm9yZVxudjIuc3R5bGUgICAgPSBzdHlsZTtcbi8vIEB0cy1pZ25vcmVcbnYyLmdlbmVyYXRvcnMgPSBnZW5lcmF0b3JzXG5cbmV4cG9ydCBkZWZhdWx0IHYyOyJdLCJuYW1lcyI6WyJnZXRTaGFyZWRDU1MiLCJTaGFkb3dDZmciLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNET01Db250ZW50TG9hZGVkIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsInNoYXJlZENTUyIsIkNvbnRlbnRHZW5lcmF0b3IiLCJkYXRhIiwiY29uc3RydWN0b3IiLCJodG1sIiwiY3NzIiwic2hhZG93IiwicHJlcGFyZUhUTUwiLCJwcmVwYXJlQ1NTIiwic2V0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsImlzUmVhZHkiLCJ3aGVuUmVhZHkiLCJmaWxsQ29udGVudCIsImluamVjdENTUyIsImFwcGVuZCIsImNvbnRlbnQiLCJjbG9uZU5vZGUiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJnZW5lcmF0ZSIsImhvc3QiLCJ0YXJnZXQiLCJpbml0U2hhZG93Iiwic2hhZG93TW9kZSIsIk5PTkUiLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwicmVwbGFjZUNoaWxkcmVuIiwiY2FuSGF2ZVNoYWRvdyIsIkVycm9yIiwibW9kZSIsIk9QRU4iLCJhdHRhY2hTaGFkb3ciLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJlIiwicHJvY2Vzc0NTUyIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidW5kZWZpbmVkIiwic3RyIiwidHJpbSIsImlubmVySFRNTCIsIkhUTUxFbGVtZW50Iiwic3R5bGVzaGVldHMiLCJTaGFkb3dSb290IiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwicHVzaCIsImNzc3NlbGVjdG9yIiwiQ1NTU2VsZWN0b3IiLCJoYXMiLCJzZXRBdHRyaWJ1dGUiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsInJlcGxhY2UiLCJoZWFkIiwiYWRkIiwiYnVpbGRMSVNTSG9zdCIsInNldENzdHJDb250cm9sZXIiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkxJU1MiLCJhcmdzIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwiY29udGVudF9nZW5lcmF0b3IiLCJMSVNTQ29udHJvbGVyIiwiSG9zdCIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsIm5hbWUiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImlzQ29ubmVjdGVkIiwiX0hvc3QiLCJpZCIsIl9fY3N0cl9jb250cm9sZXIiLCJMaXNzIiwiaG9zdENzdHIiLCJjb250ZW50X2dlbmVyYXRvcl9jc3RyIiwiTElTU0hvc3QiLCJDZmciLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJDb250cm9sZXIiLCJjb250cm9sZXIiLCJpc0luaXRpYWxpemVkIiwid2hlbkluaXRpYWxpemVkIiwiaW5pdGlhbGl6ZSIsInBhcmFtcyIsImluaXQiLCJnZXRQYXJ0IiwiaGFzU2hhZG93IiwicXVlcnlTZWxlY3RvciIsImdldFBhcnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImhhc0F0dHJpYnV0ZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJ0aGVuIiwicHJvbWlzZSIsInJlc29sdmUiLCJQcm9taXNlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiZGVmaW5lIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiYnJ5X2NsYXNzIiwiX19iYXNlc19fIiwiZmlsdGVyIiwiX19uYW1lX18iLCJfanNfa2xhc3MiLCIkanNfZnVuYyIsIl9fQlJZVEhPTl9fIiwiJGNhbGwiLCIkZ2V0YXR0cl9wZXA2NTciLCJodG1sdGFnIiwiQ2xhc3MiLCJvcHRzIiwiZ2V0TmFtZSIsImVsZW1lbnQiLCJFbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImlzRGVmaW5lZCIsImVsZW0iLCJnZXQiLCJ3aGVuRGVmaW5lZCIsImdldEhvc3RDc3RyIiwiZ2V0SG9zdENzdHJTeW5jIiwiaXNVcGdyYWRlZCIsInVwZ3JhZGVTeW5jIiwid2hlblVwZ3JhZGVkIiwiZ2V0Q29udHJvbGVyIiwiZ2V0Q29udHJvbGVyU3luYyIsImluaXRpYWxpemVTeW5jIiwiZ2V0Q29udHJvbGVyQ3N0ciIsImdldENvbnRyb2xlckNzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsImdldEhvc3QiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZ2V0SG9zdFN5bmMiLCJTdGF0ZXMiLCJfTElTUyIsIklMSVNTIiwiY2ZnIiwiYXNzaWduIiwiRXh0ZW5kZWRMSVNTIiwiTElTU3YzIiwiaW1wb3J0Q29tcG9uZW50VjMiLCJLbm93blRhZ3MiLCJzY3JpcHQiLCJERUZBVUxUX0NESVIiLCJhdXRvbG9hZCIsImNkaXIiLCJTVyIsInN3X3BhdGgiLCJjb25zb2xlIiwid2FybiIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInNjb3BlIiwiZXJyb3IiLCJjb250cm9sbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZFRhZyIsImFkZFRhZ1YyIiwiYWRkVGFnVjMiLCJicnl0aG9uIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkaXRpb24iLCJhZGRlZE5vZGVzIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJ0YWciLCJpbXBvcnRDb21wb25lbnQiLCJkZWZpbmVXZWJDb21wb25lbnRWMyIsImZpbGVzIiwia2xhc3MiLCJMSVNTQXV0b19Db250ZW50R2VuZXJhdG9yIiwiZGVmaW5lV2ViQ29tcG9uZW50IiwiY19qcyIsImZpbGUiLCJCbG9iIiwidHlwZSIsInVybCIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsIm9sZHJlcSIsInJlcXVpcmUiLCJzdGFydHNXaXRoIiwiZmlsZW5hbWUiLCJzbGljZSIsImRlZmF1bHQiLCJfZmV0Y2hUZXh0IiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImFuc3dlciIsInRleHQiLCJfaW1wb3J0IiwibG9nIiwiY29udmVydGVyIiwiZW5jb2RlSFRNTCIsInRleHRDb250ZW50IiwibWF0Y2giLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImNzc19hdHRyIiwic2V0UHJvcGVydHkiLCJpbXBvcnRDb21wb25lbnRzIiwiY29tcG9uZW50cyIsInJlc3VsdHMiLCJicnlfd3JhcHBlciIsImNvbXBvX2RpciIsImNvZGUiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsImlkeCIsInByb21pc2VzIiwiYWxsIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwiZ2xvYmFsVGhpcyIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJjdXJzb3IiLCJfX3Byb3RvX18iLCJlbmRzV2l0aCIsIkNBTl9IQVZFX1NIQURPVyIsInJlYWR5U3RhdGUiLCJzdHJpbmciLCJpIiwiZmlyc3RDaGlsZCIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsInJlZ2V4IiwiQXV0b0NvbnRlbnRHZW5lcmF0b3IiLCJwcmVwYXJlVGVtcGxhdGUiLCJ2YWx1ZSIsImlzUmVzc291cmNlUmVhZHkiLCJ3YWl0UmVzc291cmNlIiwicHJlcGFyZSIsInByZXBhcmVTdHlsZSIsImluaXRDb250ZW50IiwiY3JlYXRlQ29udGVudCIsImV4ZWN1dGUiLCJyZXZva2VPYmplY3RVUkwiLCJoaWRlNDA0IiwiZmV0Y2hDb250ZXh0IiwiTElTU0NvbnRleHQiLCJwYXRoIiwiY3dkIiwidG9TdHJpbmciLCJMSVNTQmFzZSIsIlNIQURPV19NT0RFIiwiQ09OVEVOVF9HRU5FUkFUT1IiLCJMSVNTRnVsbCIsImdldEluaXRpYWxWYWx1ZSIsImRlZmF1bHRWYWx1ZSIsImhhc093biIsImdlbmVyYXRvciIsIldhaXRpbmdEZWZpbmUiLCJLbGFzcyIsImRlbGV0ZSIsImV2ZXJ5IiwiUmVzcG9uc2UiLCJyYXciLCJ0cmFjZSIsInYyIiwidjMiLCJnZW5lcmF0b3JzIl0sInNvdXJjZVJvb3QiOiIifQ==