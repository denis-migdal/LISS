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
    fillContent(shadow) {
        this.injectCSS(shadow, this.#stylesheets);
        const content = this.#template.content.cloneNode(true);
        shadow.append(content);
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

/***/ "./src/V3.ts":
/*!*******************!*\
  !*** ./src/V3.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LISSv3: () => (/* binding */ LISSv3)
/* harmony export */ });
/* harmony import */ var ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ContentGenerator */ "./src/ContentGenerator.ts");
// from auto.md
// + ajouter menu doc...
// example : playground v3 (?)
// liss-version="v3"
// liss-v3="auto" (c'est la v3 qu'il faut utiliser)
// unit test de l'exemple ajouté
// => continue other examples
// DOCS
// doc/fr/auto.md
// Ctrler/LifeCycle
// doc/en (obs ?)
// README.md
// TODO: auto-mode (all with auto...)
// TODO: true auto-mode in tests (change Brython...)
// testv3
// option for v3
// default HTML in test if (null)...
// like playground (?) => different file for cleaner code ?
// use V3 in auto-mode...
// LISS="auto"
// cdir=""
// files="js,ts,bry,html" - default (html+css+js) ?
// override fetch (ofc) [sw override ?]
// build default js (with ${}) support
// TODO: true auto-mode in playground (override fetch ?)
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
// TODO: show error...
// TODO: debounce/throttle editor...
// TODO: facultative HTML in editor/playground
// TODO: auto mode if (?)

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
        console.warn("cstr");
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
    const content_generator = opts.content_generator ?? ContentGenerator__WEBPACK_IMPORTED_MODULE_0__["default"];
    // @ts-ignore
    const _generator = new content_generator(opts);
    return class _LISS extends LISSBase {
        constructor(generator = _generator){
            super(generator);
        }
    };
}


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
async function importComponent(tagname, { cdir = _cdir, brython = null, // @ts-ignore
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
/* harmony import */ var _V3__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./V3 */ "./src/V3.ts");



//TODO: events.ts
//TODO: globalCSSRules






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_extends__WEBPACK_IMPORTED_MODULE_0__["default"]);

// @ts-ignore
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].LISSv3 = _V3__WEBPACK_IMPORTED_MODULE_9__.LISSv3;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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elIsU0FBU0ssT0FBTyxDQUFDaVIsVUFBVTtJQUVwQyxPQUFPdFIsU0FBU0ssT0FBTztBQUMzQjs7Ozs7OztTQ3hIQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFFSDtBQUVxQztBQUUvRCxpQkFBaUI7QUFDakIsc0JBQXNCO0FBQ3VDO0FBQzNCO0FBRUE7QUFFYTtBQUN1QztBQUN6RDtBQUM3QixpRUFBZXdELGdEQUFJQSxFQUFDO0FBRVE7QUFDNUIsYUFBYTtBQUNiQSxnREFBSUEsQ0FBQzJGLE1BQU0sR0FBR0EsdUNBQU1BO0FBR3BCLGFBQWE7QUFDc0I7QUFFbkMsbUNBQW1DO0FBQ25DLGFBQWE7QUFDYmtJLFdBQVc3TixJQUFJLEdBQUdBLGdEQUFJQSIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvQ29udGVudEdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NDb250cm9sZXIudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xpZmVDeWNsZS9ERUZJTkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTGlmZUN5Y2xlL0lOSVRJQUxJWkVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTGlmZUN5Y2xlL1JFQURZLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTGlmZUN5Y2xlL1VQR1JBREVELnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTGlmZUN5Y2xlL3N0YXRlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL1YzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY29yZS9MaWZlQ3ljbGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9leHRlbmRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9MSVNTQXV0by50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvYnVpbGQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2V2ZW50cy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFNoYXJlZENTUyB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSG9zdCwgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgaXNTaGFkb3dTdXBwb3J0ZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxudHlwZSBIVE1MID0gRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudHxzdHJpbmc7XG50eXBlIENTUyAgPSBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50O1xuXG5leHBvcnQgdHlwZSBDb250ZW50R2VuZXJhdG9yX09wdHMgPSB7XG4gICAgaHRtbCAgID86IERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnR8c3RyaW5nLFxuICAgIGNzcyAgICA/OiBDU1MgfCByZWFkb25seSBDU1NbXSxcbiAgICBzaGFkb3cgPzogU2hhZG93Q2ZnfG51bGxcbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEdlbmVyYXRvckNzdHIgPSB7IG5ldyhvcHRzOiBDb250ZW50R2VuZXJhdG9yX09wdHMpOiBDb250ZW50R2VuZXJhdG9yIH07XG5cbmNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcbmNvbnN0IHNoYXJlZENTUyA9IGdldFNoYXJlZENTUygpOyAvLyBmcm9tIExJU1NIb3N0Li4uXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG4gICAgI3N0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W107XG4gICAgI3RlbXBsYXRlICAgOiBIVE1MVGVtcGxhdGVFbGVtZW50fG51bGw7XG4gICAgI3NoYWRvdyAgICAgOiBTaGFkb3dDZmd8bnVsbDtcblxuICAgIHByb3RlY3RlZCBkYXRhOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGh0bWwsXG4gICAgICAgIGNzcyAgICA9IFtdLFxuICAgICAgICBzaGFkb3cgPSBudWxsLFxuICAgIH06IENvbnRlbnRHZW5lcmF0b3JfT3B0cyA9IHt9KSB7XG5cbiAgICAgICAgdGhpcy4jc2hhZG93ICAgPSBzaGFkb3c7XG4gICAgICAgIHRoaXMuI3RlbXBsYXRlID0gdGhpcy5wcmVwYXJlSFRNTChodG1sKTtcbiAgICBcbiAgICAgICAgdGhpcy4jc3R5bGVzaGVldHMgPSB0aGlzLnByZXBhcmVDU1MoY3NzKTtcblxuICAgICAgICB0aGlzLiNpc1JlYWR5ICAgPSBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgdGhpcy4jd2hlblJlYWR5ID0gd2hlbkRPTUNvbnRlbnRMb2FkZWQoKTtcblxuICAgICAgICAvL1RPRE86IG90aGVyIGRlcHMuLi5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0VGVtcGxhdGUodGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jdGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAjd2hlblJlYWR5OiBQcm9taXNlPHVua25vd24+O1xuICAgICNpc1JlYWR5ICA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jaXNSZWFkeTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuI2lzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiN3aGVuUmVhZHk7XG4gICAgICAgIC8vVE9ETzogZGVwcy5cbiAgICAgICAgLy9UT0RPOiBDU1MvSFRNTCByZXNvdXJjZXMuLi5cblxuICAgICAgICAvLyBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuICAgICAgICAvLyBfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcbiAgICAgICAgLy8gKyBjZiBhdCB0aGUgZW5kLi4uXG4gICAgfVxuXG4gICAgZmlsbENvbnRlbnQoc2hhZG93OiBTaGFkb3dSb290KSB7XG4gICAgICAgIHRoaXMuaW5qZWN0Q1NTKHNoYWRvdywgdGhpcy4jc3R5bGVzaGVldHMpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLiN0ZW1wbGF0ZSEuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIHNoYWRvdy5hcHBlbmQoY29udGVudCk7XG5cbiAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShzaGFkb3cpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50fFNoYWRvd1Jvb3Qge1xuXG4gICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi4gICAgIFxuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaW5pdFNoYWRvdyhob3N0KTtcblxuICAgICAgICB0aGlzLmluamVjdENTUyh0YXJnZXQsIHRoaXMuI3N0eWxlc2hlZXRzKTtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy4jdGVtcGxhdGUhLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBpZiggaG9zdC5zaGFkb3dNb2RlICE9PSBTaGFkb3dDZmcuTk9ORSB8fCB0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuICAgICAgICAgICAgdGFyZ2V0LnJlcGxhY2VDaGlsZHJlbihjb250ZW50KTtcblxuICAgICAgICAvL2lmKCB0YXJnZXQgaW5zdGFuY2VvZiBTaGFkb3dSb290ICYmIHRhcmdldC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMClcblx0XHQvL1x0dGFyZ2V0LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cbiAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShob3N0KTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0U2hhZG93PEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCkge1xuXG4gICAgICAgIGNvbnN0IGNhbkhhdmVTaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KTtcbiAgICAgICAgaWYoIHRoaXMuI3NoYWRvdyAhPT0gbnVsbCAmJiB0aGlzLiNzaGFkb3cgIT09IFNoYWRvd0NmZy5OT05FICYmICEgY2FuSGF2ZVNoYWRvdyApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgICAgIGxldCBtb2RlID0gdGhpcy4jc2hhZG93O1xuICAgICAgICBpZiggbW9kZSA9PT0gbnVsbCApXG4gICAgICAgICAgICBtb2RlID0gY2FuSGF2ZVNoYWRvdyA/IFNoYWRvd0NmZy5PUEVOIDogU2hhZG93Q2ZnLk5PTkU7XG5cbiAgICAgICAgaG9zdC5zaGFkb3dNb2RlID0gbW9kZTtcblxuICAgICAgICBsZXQgdGFyZ2V0OiBIb3N0fFNoYWRvd1Jvb3QgPSBob3N0O1xuICAgICAgICBpZiggbW9kZSAhPT0gU2hhZG93Q2ZnLk5PTkUpXG4gICAgICAgICAgICB0YXJnZXQgPSBob3N0LmF0dGFjaFNoYWRvdyh7bW9kZX0pO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVDU1MoY3NzOiBDU1N8cmVhZG9ubHkgQ1NTW10pIHtcbiAgICAgICAgaWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcbiAgICAgICAgICAgIGNzcyA9IFtjc3NdO1xuXG4gICAgICAgIHJldHVybiBjc3MubWFwKGUgPT4gdGhpcy5wcm9jZXNzQ1NTKGUpICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NDU1MoY3NzOiBDU1MpIHtcblxuICAgICAgICBpZihjc3MgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KVxuICAgICAgICAgICAgcmV0dXJuIGNzcztcbiAgICAgICAgaWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG4gICAgICAgICAgICByZXR1cm4gY3NzLnNoZWV0ITtcbiAgICBcbiAgICAgICAgaWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICAgICAgICAgICAgc3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJcIik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByZXBhcmVIVE1MKGh0bWw/OiBIVE1MKTogSFRNTFRlbXBsYXRlRWxlbWVudHxudWxsIHtcbiAgICBcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gICAgICAgIGlmKGh0bWwgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcblxuICAgICAgICAvLyBzdHIyaHRtbFxuICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGh0bWwudHJpbSgpO1xuXG4gICAgICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggaHRtbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IClcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICB0ZW1wbGF0ZS5hcHBlbmQoaHRtbCk7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBpbmplY3RDU1M8SG9zdCBleHRlbmRzIExIb3N0Pih0YXJnZXQ6IFNoYWRvd1Jvb3R8SG9zdCwgc3R5bGVzaGVldHM6IGFueVtdKSB7XG5cbiAgICAgICAgaWYoIHRhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTLCAuLi5zdHlsZXNoZWV0cyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjc3NzZWxlY3RvciA9IHRhcmdldC5DU1NTZWxlY3RvcjsgLy9UT0RPLi4uXG5cbiAgICAgICAgaWYoIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpIClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuICAgICAgICBsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG4gICAgICAgIGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG4gICAgICAgICAgICBmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG4gICAgICAgICAgICAgICAgaHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG4gICAgICAgIGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuICAgIH1cbn1cblxuLy8gaWRlbSBIVE1MLi4uXG4vKiBpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgYyA9IGF3YWl0IGM7XG4gICAgICAgICAgICBpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcbiAgICAgICAgICAgICAgICBjID0gYXdhaXQgYy50ZXh0KCk7XG5cbiAgICAgICAgICAgIHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuICAgICAgICB9KSgpKTtcblxuICAgICAgICByZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG4gICAgfVxuKi8iLCJpbXBvcnQgeyBMSG9zdENzdHIsIHR5cGUgQ2xhc3MsIHR5cGUgQ29uc3RydWN0b3IsIHR5cGUgTElTU19PcHRzIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCwgc2V0Q3N0ckNvbnRyb2xlciB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuXG4vKioqKi9cblxuaW50ZXJmYWNlIElDb250cm9sZXI8XG5cdEV4dGVuZHNDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRIb3N0Q3N0ciAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuPiB7XG5cdC8vIG5vbi12YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgaG9zdDogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuXHQvLyB2YW5pbGxhIEpTXG5cdFx0cmVhZG9ubHkgaXNDb25uZWN0ZWQgIDpib29sZWFuO1xufTtcblx0Ly8gKyBwcm90ZWN0ZWRcblx0XHQvLyByZWFkb25seSAuY29udGVudDogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290O1xuXHQvLyB2YW5pbGxhIEpTXG5cdFx0Ly8gYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpOiB2b2lkO1xuXHRcdC8vIGNvbm5lY3RlZENhbGxiYWNrICAgKCk6IHZvaWQ7XG5cdFx0Ly8gZGlzY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZDtcblxuaW50ZXJmYWNlIElDb250cm9sZXJDc3RyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4ge1xuXHRuZXcoKTogSUNvbnRyb2xlcjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+O1xuXG5cdC8vIHZhbmlsbGEgSlNcblx0XHRyZWFkb25seSBvYnNlcnZlZEF0dHJpYnV0ZXM6IHN0cmluZ1tdO1xufVxuXHQvLyArIFwicHJpdmF0ZVwiXG5cdFx0Ly8gcmVhZG9ubHkgSG9zdDogSG9zdENzdHJcblxuZXhwb3J0IHR5cGUgQ29udHJvbGVyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4gPSBJQ29udHJvbGVyPEV4dGVuZHNDc3RyLCBIb3N0Q3N0cj4gJiBJbnN0YW5jZVR5cGU8RXh0ZW5kc0NzdHI+O1xuXG5leHBvcnQgdHlwZSBDb250cm9sZXJDc3RyPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4gPSBJQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+ICYgRXh0ZW5kc0NzdHI7XG5cbi8qKioqL1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0SG9zdENzdHIgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbj4oYXJnczogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPj4gPSB7fSkge1xuXG5cdGxldCB7XG5cdFx0LyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG5cdFx0ZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgICAgICBhcyB1bmtub3duIGFzIEV4dGVuZHNDc3RyLFxuXHRcdGhvc3QgICAgICAgICAgICAgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0XG5cdFx0Y29udGVudF9nZW5lcmF0b3IgPSBDb250ZW50R2VuZXJhdG9yLFxuXHR9ID0gYXJncztcblx0XG5cdGNsYXNzIExJU1NDb250cm9sZXIgZXh0ZW5kcyBfZXh0ZW5kcyBpbXBsZW1lbnRzIElDb250cm9sZXI8RXh0ZW5kc0NzdHIsIEhvc3RDc3RyPntcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKSB7XG5cdFx0XHRcdHNldENzdHJDb250cm9sZXIodGhpcyk7XG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCguLi5hcmdzKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHQvL1RPRE86IGdldCB0aGUgcmVhbCB0eXBlID9cblx0XHRwcm90ZWN0ZWQgZ2V0IGNvbnRlbnQoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0LmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXM6IHN0cmluZ1tdID0gW107XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZ3xudWxsLCBuZXdWYWx1ZTogc3RyaW5nfG51bGwpIHt9XG5cblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmhvc3QuaXNDb25uZWN0ZWQ7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IEluc3RhbmNlVHlwZTxMSG9zdENzdHI8SG9zdENzdHI+Pjtcblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgc3RhdGljIF9Ib3N0OiBMSG9zdENzdHI8SG9zdENzdHI+O1xuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZTogZnVjayBvZmYuXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KCB0aGlzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhvc3QsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udGVudF9nZW5lcmF0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJncyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gTElTU0NvbnRyb2xlciBzYXRpc2ZpZXMgQ29udHJvbGVyQ3N0cjxFeHRlbmRzQ3N0ciwgSG9zdENzdHI+O1xufSIsImltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgU2hhZG93Q2ZnLCB0eXBlIExJU1NDb250cm9sZXJDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBDb250ZW50R2VuZXJhdG9yX09wdHMsIENvbnRlbnRHZW5lcmF0b3JDc3RyIH0gZnJvbSBcIi4vQ29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSBcIi4vTGlmZUN5Y2xlL3N0YXRlc1wiO1xuXG4vLyBMSVNTSG9zdCBtdXN0IGJlIGJ1aWxkIGluIGRlZmluZSBhcyBpdCBuZWVkIHRvIGJlIGFibGUgdG8gYnVpbGRcbi8vIHRoZSBkZWZpbmVkIHN1YmNsYXNzLlxuXG5sZXQgaWQgPSAwO1xuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZENTUygpIHtcblx0cmV0dXJuIHNoYXJlZENTUztcbn1cblxubGV0IF9fY3N0cl9jb250cm9sZXIgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJDb250cm9sZXIoXzogYW55KSB7XG5cdF9fY3N0cl9jb250cm9sZXIgPSBfO1xufVxuXG50eXBlIGluZmVySG9zdENzdHI8VD4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI8aW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiwgaW5mZXIgQiBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pj4gPyBCIDogbmV2ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFx0VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLCBVIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gaW5mZXJIb3N0Q3N0cjxUPiA+KFxuXHRcdFx0XHRcdFx0XHRMaXNzOiBULFxuXHRcdFx0XHRcdFx0XHQvLyBjYW4ndCBkZWR1Y2UgOiBjYXVzZSB0eXBlIGRlZHVjdGlvbiBpc3N1ZXMuLi5cblx0XHRcdFx0XHRcdFx0aG9zdENzdHI6IFUsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yX2NzdHI6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuXHRcdFx0XHRcdFx0XHRhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG5cdFx0XHRcdFx0XHQpIHtcblxuXHRjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcl9jc3RyKGFyZ3MpO1xuXG5cdHR5cGUgSG9zdENzdHIgPSBVO1xuICAgIHR5cGUgSG9zdCAgICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG5cdGNsYXNzIExJU1NIb3N0IGV4dGVuZHMgaG9zdENzdHIge1xuXG5cdFx0c3RhdGljIHJlYWRvbmx5IENmZyA9IHtcblx0XHRcdGhvc3QgICAgICAgICAgICAgOiBob3N0Q3N0cixcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yOiBjb250ZW50X2dlbmVyYXRvcl9jc3RyLFxuXHRcdFx0YXJnc1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSBjb250ZW50X2dlbmVyYXRvci53aGVuUmVhZHkoKTtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQ29udHJvbGVyID0gTGlzcztcblxuXHRcdCNjb250cm9sZXI6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgY29udHJvbGVyKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRyb2xlcjtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXIgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHQvL1RPRE86IGdldCByZWFsIFRTIHR5cGUgP1xuXHRcdCNwYXJhbXM6IGFueVtdO1xuXHRcdGluaXRpYWxpemUoLi4ucGFyYW1zOiBhbnlbXSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRpZiggcGFyYW1zLmxlbmd0aCAhPT0gMCApIHtcblx0XHRcdFx0aWYoIHRoaXMuI3BhcmFtcy5sZW5ndGggIT09IDAgKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ3N0ciBwYXJhbXMgaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZCAhJyk7XG5cdFx0XHRcdHRoaXMuI3BhcmFtcyA9IHBhcmFtcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jY29udHJvbGVyID0gdGhpcy5pbml0KCk7XG5cblx0XHRcdGlmKCB0aGlzLmlzQ29ubmVjdGVkIClcblx0XHRcdFx0dGhpcy4jY29udHJvbGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNjb250cm9sZXI7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQvLyNpbnRlcm5hbHMgPSB0aGlzLmF0dGFjaEludGVybmFscygpO1xuXHRcdC8vI3N0YXRlcyAgICA9IHRoaXMuI2ludGVybmFscy5zdGF0ZXM7XG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdCA9IHRoaXMgYXMgSG9zdDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdG92ZXJyaWRlIGF0dGFjaFNoYWRvdyhpbml0OiBTaGFkb3dSb290SW5pdCk6IFNoYWRvd1Jvb3Qge1xuXHRcdFx0Y29uc3Qgc2hhZG93ID0gc3VwZXIuYXR0YWNoU2hhZG93KGluaXQpO1xuXG5cdFx0XHQvLyBAdHMtaWdub3JlIGNsb3NlZCBJUyBhc3NpZ25hYmxlIHRvIHNoYWRvd01vZGUuLi5cblx0XHRcdHRoaXMuc2hhZG93TW9kZSA9IGluaXQubW9kZTtcblxuXHRcdFx0dGhpcy4jY29udGVudCA9IHNoYWRvdztcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHNoYWRvdztcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0IGhhc1NoYWRvdygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLnNoYWRvd01vZGUgIT09ICdub25lJztcblx0XHR9XG5cblx0XHQvKioqIENTUyAqKiovXG5cblx0XHRnZXQgQ1NTU2VsZWN0b3IoKSB7XG5cblx0XHRcdGlmKHRoaXMuaGFzU2hhZG93IHx8ICEgdGhpcy5oYXNBdHRyaWJ1dGUoXCJpc1wiKSApXG5cdFx0XHRcdHJldHVybiB0aGlzLnRhZ05hbWU7XG5cblx0XHRcdHJldHVybiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gSW1wbCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHRjb25zdHJ1Y3RvciguLi5wYXJhbXM6IGFueVtdKSB7XG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHQvL3RoaXMuI3N0YXRlcy5hZGQoU3RhdGVzLkxJU1NfVVBHUkFERUQpO1xuXHRcdFx0Y29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19SRUFEWSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy4jcGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0Y29uc3QgY29udHJvbGVyID0gX19jc3RyX2NvbnRyb2xlcjtcblx0XHRcdF9fY3N0cl9jb250cm9sZXIgPSBudWxsO1xuXG5cdFx0XHRpZiggY29udHJvbGVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IGNvbnRyb2xlcjtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0aWYodGhpcy5jb250cm9sZXIgIT09IG51bGwpXG5cdFx0XHRcdHRoaXMuY29udHJvbGVyLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApIHtcblx0XHRcdFx0dGhpcy5jb250cm9sZXIhLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogaW5zdGFuY2UgZGVwc1xuXHRcdFx0aWYoIGNvbnRlbnRfZ2VuZXJhdG9yLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgY29udGVudF9nZW5lcmF0b3Iud2hlblJlYWR5KCk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiBMSVNTSG9zdC5Db250cm9sZXIub2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuXHRcdH1cblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nfG51bGwsIG5ld1ZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYodGhpcy4jY29udHJvbGVyKVxuXHRcdFx0XHR0aGlzLiNjb250cm9sZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0c2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGwgPSBudWxsO1xuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXG5cdFx0XHQvLyBubyBuZWVkcyB0byBzZXQgdGhpcy4jY29udGVudCAoYWxyZWFkeSBob3N0IG9yIHNldCB3aGVuIGF0dGFjaFNoYWRvdylcblx0XHRcdGNvbnRlbnRfZ2VuZXJhdG9yLmdlbmVyYXRlKHRoaXMpO1xuXG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cblx0XHRcdGlmKCB0aGlzLiNjb250cm9sZXIgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdFx0XHRcdHRoaXMuI2NvbnRyb2xlciA9IG5ldyBMSVNTSG9zdC5Db250cm9sZXIoLi4udGhpcy4jcGFyYW1zKSBhcyBJbnN0YW5jZVR5cGU8VD47XG5cdFx0XHR9XG5cblx0XHRcdC8vdGhpcy4jc3RhdGVzLmFkZChTdGF0ZXMuTElTU19JTklUSUFMSVpFRCk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmNvbnRyb2xlcik7XG5cblx0XHRcdHJldHVybiB0aGlzLmNvbnRyb2xlcjtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0O1xufVxuXG5cbiIsImltcG9ydCB7IExJU1NDb250cm9sZXIsIExJU1NDb250cm9sZXJDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlckNzdHI+ID0gc3RyaW5nfFR8TElTU0hvc3RDc3RyPFQ+fEhUTUxFbGVtZW50O1xuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD4pIHtcblxuXHRsZXQgSG9zdDogTElTU0hvc3RDc3RyPFQ+ID0gQ29tcG9uZW50Q2xhc3MgYXMgYW55O1xuXG5cdC8vIEJyeXRob24gY2xhc3Ncblx0bGV0IGJyeV9jbGFzczogYW55ID0gbnVsbDtcblx0aWYoIFwiJGlzX2NsYXNzXCIgaW4gQ29tcG9uZW50Q2xhc3MgKSB7XG5cblx0XHRicnlfY2xhc3MgPSBDb21wb25lbnRDbGFzcztcblxuXHRcdENvbXBvbmVudENsYXNzID0gYnJ5X2NsYXNzLl9fYmFzZXNfXy5maWx0ZXIoIChlOiBhbnkpID0+IGUuX19uYW1lX18gPT09IFwiV3JhcHBlclwiKVswXS5fanNfa2xhc3MuJGpzX2Z1bmM7XG5cdFx0KENvbXBvbmVudENsYXNzIGFzIGFueSkuSG9zdC5Db250cm9sZXIgPSBjbGFzcyB7XG5cblx0XHRcdCNicnk6IGFueTtcblxuXHRcdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHR0aGlzLiNicnkgPSBfX0JSWVRIT05fXy4kY2FsbChicnlfY2xhc3MsIFswLDAsMF0pKC4uLmFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHQjY2FsbChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIF9fQlJZVEhPTl9fLiRjYWxsKF9fQlJZVEhPTl9fLiRnZXRhdHRyX3BlcDY1Nyh0aGlzLiNicnksIG5hbWUsIFswLDAsMF0pLCBbMCwwLDBdKSguLi5hcmdzKVxuXHRcdFx0fVxuXG5cdFx0XHRnZXQgaG9zdCgpIHtcblx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gX19CUllUSE9OX18uJGdldGF0dHJfcGVwNjU3KHRoaXMuI2JyeSwgXCJob3N0XCIsIFswLDAsMF0pXG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBicnlfY2xhc3NbXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIl07XG5cblx0XHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jY2FsbChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0Y29ubmVjdGVkQ2FsbGJhY2soLi4uYXJnczogYW55W10pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuI2NhbGwoXCJjb25uZWN0ZWRDYWxsYmFja1wiLCBhcmdzKTtcblx0XHRcdH1cblx0XHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNjYWxsKFwiZGlzY29ubmVjdGVkQ2FsbGJhY2tcIiwgYXJncyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYoIFwiSG9zdFwiIGluIENvbXBvbmVudENsYXNzIClcblx0XHRIb3N0ID0gQ29tcG9uZW50Q2xhc3MuSG9zdCBhcyBhbnk7XG5cbiAgICBsZXQgaHRtbHRhZyA9IHVuZGVmaW5lZDtcbiAgICBpZiggXCJDZmdcIiBpbiBIb3N0KSB7XG4gICAgICAgIGNvbnN0IENsYXNzICA9IEhvc3QuQ2ZnLmhvc3Q7XG4gICAgICAgIGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBIb3N0LCBvcHRzKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHJ8TElTU0hvc3Q8TElTU0NvbnRyb2xlcj58TElTU0hvc3RDc3RyPExJU1NDb250cm9sZXI+ICk6IHN0cmluZyB7XG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIGlmKCBcImhvc3RcIiBpbiBlbGVtZW50KVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5ob3N0O1xuICAgIGlmKCBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICBjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICBpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8vIGNzdHJcblxuXHRpZiggXCJIb3N0XCIgaW4gZWxlbWVudClcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuSG9zdCBhcyB1bmtub3duIGFzIExJU1NIb3N0Q3N0cjxMSVNTQ29udHJvbGVyPjtcblxuICAgIGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG4gICAgaWYobmFtZSA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBpcyBub3QgZGVmaW5lZCFcIik7XG5cbiAgICByZXR1cm4gbmFtZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICBlbGVtID0gZ2V0TmFtZShlbGVtKTtcbiAgICBpZiggdHlwZW9mIGVsZW0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoZWxlbSkgIT09IHVuZGVmaW5lZDtcblxuICAgIGlmKCBcIkhvc3RcIiBpbiBlbGVtKVxuICAgICAgICBlbGVtID0gZWxlbS5Ib3N0IGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXROYW1lKGVsZW0gYXMgYW55KSAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0Q3N0cjxUPj4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlbGVtKTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChlbGVtKSBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbGlzdGVuIGRlZmluZS4uLlxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59XG5cbi8qXG4vLyBUT0RPOiBpbXBsZW1lbnRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10pIDogUHJvbWlzZTx2b2lkPiB7XG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG59XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8TElTU0hvc3RDc3RyPFQ+PiB7XG4gICAgLy8gd2UgY2FuJ3QgZm9yY2UgYSBkZWZpbmUuXG4gICAgcmV0dXJuIHdoZW5EZWZpbmVkKGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdENzdHI8VD4ge1xuICAgIFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGVsZW0gPSBnZXROYW1lKGVsZW0pO1xuICAgIGlmKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIikge1xuXG4gICAgICAgIGxldCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KGVsZW0pO1xuICAgICAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlbGVtfSBub3QgZGVmaW5lZCB5ZXQhYCk7XG5cbiAgICAgICAgcmV0dXJuIGhvc3QgYXMgdW5rbm93biBhcyBMSVNTSG9zdENzdHI8VD47XG4gICAgfVxuXG4gICAgaWYoIFwiSG9zdFwiIGluIGVsZW0pXG4gICAgICAgIGVsZW0gPSBlbGVtLkhvc3QgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgaWYoIGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoZWxlbSBhcyBhbnkpID09PSBudWxsIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2VsZW19IG5vdCBkZWZpbmVkIHlldCFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0Q3N0cjxUPjtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCB3aGVuVXBncmFkZWQgfSBmcm9tIFwiLi9VUEdSQURFRFwiO1xuaW1wb3J0IHsgaXNSZWFkeSwgd2hlblJlYWR5IH0gZnJvbSBcIi4vUkVBRFlcIjtcblxudHlwZSBQYXJhbTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBMSVNTSG9zdDxUPnxIVE1MRWxlbWVudDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogYm9vbGVhbiB7XG4gICAgXG4gICAgaWYoICEgaXNVcGdyYWRlZChlbGVtKSApXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KGVsZW06IFBhcmFtPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHdoZW5VcGdyYWRlZChlbGVtKTtcblxuICAgIHJldHVybiBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZCBhcyBUO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29udHJvbGVyPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG4gICAgYXdhaXQgd2hlblJlYWR5KGhvc3QpO1xuXG4gICAgLy9UT0RPOiBpbml0aWFsaXplU3luYyB2cyBpbml0aWFsaXplID9cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sZXJTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcbiAgICBpZiggISBpc1JlYWR5KGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kYW5jaWVzIG5vdCByZWFkeSAhXCIpXG5cbiAgICBpZiggISBob3N0LmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICByZXR1cm4gaG9zdC5pbml0aWFsaXplKCk7XG5cbiAgICByZXR1cm4gaG9zdC5jb250cm9sZXI7XG59XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplICAgICA9IGdldENvbnRyb2xlcjtcbmV4cG9ydCBjb25zdCBpbml0aWFsaXplU3luYyA9IGdldENvbnRyb2xlclN5bmM7IiwiaW1wb3J0IHsgTElTU0NvbnRyb2xlckNzdHIsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4gPSBzdHJpbmd8VHxMSVNTSG9zdENzdHI8VD58SW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj58SFRNTEVsZW1lbnQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlYWR5PFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cj4oZWxlbTogUGFyYW08VD4pOiBib29sZWFuIHtcbiAgICBcbiAgICBpZiggISBpc0RlZmluZWQoZWxlbSkgKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgY29uc3QgaG9zdENzdHIgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICByZXR1cm4gaG9zdENzdHIuaXNEZXBzUmVzb2x2ZWQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuUmVhZHk8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IGhvc3RDc3RyID0gYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG4gICAgYXdhaXQgaG9zdENzdHIud2hlbkRlcHNSZXNvbHZlZDtcblxuICAgIHJldHVybiBob3N0Q3N0ci5Db250cm9sZXIgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xlckNzdHI8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFByb21pc2U8VD4ge1xuICAgIC8vIHdlIGNhbid0IGZvcmNlIGEgcmVhZHkuXG4gICAgcmV0dXJuIHdoZW5SZWFkeShlbGVtKSBhcyBQcm9taXNlPFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udHJvbGVyQ3N0clN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyPihlbGVtOiBQYXJhbTxUPik6IFQge1xuICAgIFxuICAgIGlmKCAhIGlzUmVhZHkoZWxlbSkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgcmV0dXJuIGdldEhvc3RDc3RyU3luYyhlbGVtKS5Db250cm9sZXIgYXMgVDtcbn0iLCJpbXBvcnQgeyBMSVNTQ29udHJvbGVyLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SG9zdENzdHJTeW5jLCBpc0RlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcIi4vREVGSU5FRFwiO1xuXG50eXBlIFBhcmFtPF9UIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBIVE1MRWxlbWVudDtcblxuLy9UT0RPOiB1cGdyYWRlIGZ1bmN0aW9uLi4uXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihlbGVtOiBQYXJhbTxUPnxMSVNTSG9zdDxUPik6IGVsZW0gaXMgTElTU0hvc3Q8VD4ge1xuXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgSG9zdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgY29uc3QgSG9zdCA9IGF3YWl0IHdoZW5EZWZpbmVkKGVsZW0pO1xuXG4gICAgLy8gYWxyZWFkeSB1cGdyYWRlZFxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgSG9zdClcbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG5cbiAgICAvLyBoNGNrXG5cbiAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xuICAgIH1cblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgIFxuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBQcm9taXNlPExJU1NIb3N0PFQ+PiB7XG4gICAgXG4gICAgYXdhaXQgd2hlbkRlZmluZWQoZWxlbSk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgTElTU0hvc3Q8VD47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0U3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oZWxlbTogUGFyYW08VD4pOiBMSVNTSG9zdDxUPiB7XG4gICAgXG4gICAgaWYoICEgaXNEZWZpbmVkKGVsZW0pIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgZGVmaW5lZCAhXCIpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIHJldHVybiBlbGVtIGFzIExJU1NIb3N0PFQ+O1xufVxuXG5leHBvcnQgY29uc3QgdXBncmFkZSAgICAgPSBnZXRIb3N0O1xuZXhwb3J0IGNvbnN0IHVwZ3JhZGVTeW5jID0gZ2V0SG9zdFN5bmMiLCJleHBvcnQgZW51bSBTdGF0ZXMge1xuICAgIExJU1NfREVGSU5FRCAgICAgPSBcIkxJU1NfREVGSU5FRFwiLFxuICAgIExJU1NfVVBHUkFERUQgICAgPSBcIkxJU1NfVVBHUkFERURcIixcbiAgICBMSVNTX1JFQURZICAgICAgID0gXCJMSVNTX1JFQURZXCIsXG4gICAgTElTU19JTklUSUFMSVpFRCA9IFwiTElTU19JTklUSUFMSVpFRFwiXG59IiwiLy8gZnJvbSBhdXRvLm1kXG4gICAgLy8gKyBham91dGVyIG1lbnUgZG9jLi4uXG4gICAgLy8gZXhhbXBsZSA6IHBsYXlncm91bmQgdjMgKD8pXG4gICAgICAgIC8vIGxpc3MtdmVyc2lvbj1cInYzXCJcbiAgICAgICAgLy8gbGlzcy12Mz1cImF1dG9cIiAoYydlc3QgbGEgdjMgcXUnaWwgZmF1dCB1dGlsaXNlcilcbiAgICAvLyB1bml0IHRlc3QgZGUgbCdleGVtcGxlIGFqb3V0w6lcbiAgICAvLyA9PiBjb250aW51ZSBvdGhlciBleGFtcGxlc1xuXG4vLyBET0NTXG4gICAgLy8gZG9jL2ZyL2F1dG8ubWRcbiAgICAvLyBDdHJsZXIvTGlmZUN5Y2xlXG4gICAgLy8gZG9jL2VuIChvYnMgPylcbiAgICAvLyBSRUFETUUubWRcblxuLy8gVE9ETzogYXV0by1tb2RlIChhbGwgd2l0aCBhdXRvLi4uKVxuICAgIC8vIFRPRE86IHRydWUgYXV0by1tb2RlIGluIHRlc3RzIChjaGFuZ2UgQnJ5dGhvbi4uLilcbiAgICAgICAgLy8gdGVzdHYzXG4gICAgICAgIC8vIG9wdGlvbiBmb3IgdjNcbiAgICAgICAgLy8gZGVmYXVsdCBIVE1MIGluIHRlc3QgaWYgKG51bGwpLi4uXG4gICAgICAgIC8vIGxpa2UgcGxheWdyb3VuZCAoPykgPT4gZGlmZmVyZW50IGZpbGUgZm9yIGNsZWFuZXIgY29kZSA/XG4gICAgICAgIC8vIHVzZSBWMyBpbiBhdXRvLW1vZGUuLi5cbiAgICAgICAgICAgIC8vIExJU1M9XCJhdXRvXCJcbiAgICAgICAgLy8gY2Rpcj1cIlwiXG4gICAgICAgIC8vIGZpbGVzPVwianMsdHMsYnJ5LGh0bWxcIiAtIGRlZmF1bHQgKGh0bWwrY3NzK2pzKSA/XG4gICAgICAgICAgICAvLyBvdmVycmlkZSBmZXRjaCAob2ZjKSBbc3cgb3ZlcnJpZGUgP11cbiAgICAgICAgICAgIC8vIGJ1aWxkIGRlZmF1bHQganMgKHdpdGggJHt9KSBzdXBwb3J0XG4gICAgLy8gVE9ETzogdHJ1ZSBhdXRvLW1vZGUgaW4gcGxheWdyb3VuZCAob3ZlcnJpZGUgZmV0Y2ggPylcblxuLy8gZG9jcyAoKyBleGFtcGxlcyBwbGF5Z3JvdW5kL3Rlc3RzIC8vIEJyeS9KUykuXG4gICAgLy8gbm9uLWF1dG8gZmlyc3QuXG4gICAgICAgIC8vIGV4dGVuZHMgKExJU1MgQmFzZSlcbiAgICAgICAgLy8gTElTUyh7fSkgb3B0cy5cbiAgICAgICAgLy8gZGVmaW5lLlxuICAgICAgICAvLyBBUEkuLi4gZm9yIGJldHRlciBzdWdnZXN0aW9ucy5cbiAgICAgICAgLy8gcnVsZXMuLi5cblxuLy8gVE9ETzogY29udGVudEdlbmVyYXRvclxuLy8gVE9ETzogZG9jcyAob2ZjKVxuXG4vLyBUT0RPOiB1dGlscyArIHNpZ25hbHMgKyBET01Db250ZW50TG9hZGVkIGJlZm9yZS4uLiArIHVwZ3JhZGUgY2hpbGRyZW4gaW4gY3N0ciA/XG4gICAgLy8gYnVpbGRcbiAgICAvLyByZW1vdmUgZXZlbnRzICsgcXMgP1xuICAgIC8vIFRPRE86IHN0YXRlIChpbnRlcm5hbCBzdGF0ZSlcbiAgICAvLyBUT0RPOiBibGlzc1xuICAgIC8vIFRPRE86IGNzcy0tW3Byb3BfbmFtZV0uXG4gICAgLy8gVE9ETzogc2hhcmVkQ1NTXG4vLyBUT0RPOiB1cGdyYWRlXG4gICAgLy8gVE9ETzogZ2V0IHVwZ3JhZGVkID9cbiAgICAvLyBUT0RPOiB1cGdyYWRlICsrID4gZGVmaW5pdGlvbiBvcmRlciBpZiBpbnNpZGUgY2hpbGQgYW5kIGF2YWlsYWJsZS5cbiAgICAvLyBUT0RPOiBkZWZpbmVkIDogdmlzaWJpbGl0eTogaGlkZGVuIHVudGlsIGRlZmluZWQgP1xuICAgICAgICAvLyBUT0RPOiBsb2FkZXIgY3VzdG9tRWxlbWVudCAocmVwbGFjZVdpdGggPylcbi8vIFRPRE86IHBsYXlncm91bmRcbiAgICAvLyBUT0RPOiBzaG93IGVycm9yLi4uXG4gICAgLy8gVE9ETzogZGVib3VuY2UvdGhyb3R0bGUgZWRpdG9yLi4uXG4gICAgLy8gVE9ETzogZmFjdWx0YXRpdmUgSFRNTCBpbiBlZGl0b3IvcGxheWdyb3VuZFxuICAgIC8vIFRPRE86IGF1dG8gbW9kZSBpZiAoPylcblxuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIkNvbnRlbnRHZW5lcmF0b3JcIjtcblxuLy8gT25seSBleHRlbmRzIEhUTUxFbGVtZW50LCBlbHNlIGlzc3VlcyA6XG4gICAgLy8gbm90IHN1cHBvcnRlZCBieSBhbGwgYnJvd3NlcnMuXG4gICAgLy8gbWF5IG5vdCBzdXBwb3J0IHNoYWRvd1Jvb3QgLT4gdGhlbiBpbml0IGNhbiBiZSB0cm91Ymxlc29tZS5cbiAgICAvLyBiZSBjYXJlZnVsIHdoZW4gdHJ5aW5nIHRvIGJ1aWxkIDogY3JlYXRlRWxlbWVudCBjYWxsIGNzdHIuXG4gICAgLy8gaWYgcG9zc2libGUsIGRvIG5vdCBleHBlY3QgY29udGVudCAoYXR0ciBnb29kID8gbm8gY2hpbGRyZW4gPylcblxuLy8gV2FpdCBET00gQ29udGVudExvYWRlZCwgZWxzZSB3aWxsIGxhY2sgY2hpbGRyZW4gKGUuZy4gYmxvY2tpbmcgc2NyaXB0KVxuLy8gVXBncmFkZSBvcmRlciBpcyBkZWYgb3JkZXIgPT4gZG8gbm90IGRlcGVuZCBmYXRoZXIvY2hpbGRyZW4uXG4gICAgLy8gZmF0aGVyIHNob3VsZCB1cGdyYWRlIGNoaWxkcmVuID8gKGFzIGl0IGxpc3RlbiBpdHMgY2hpbGRyZW4pID9cbiAgICAgICAgLy8gKGNhbid0IGxpc3RlbiBjaGlsZHJlbiBmYXRoZXIpXG4gICAgICAgIC8vIHVwZ3JhZGUgZmN0XG4gICAgICAgIC8vIGNoaWxkcmVuIGNhbid0IGFzc3VtZSBoZSBpcyBpbiBhIChjb21wYXRpYmxlKSBmYXRoZXIuXG4gICAgICAgICAgICAvLyBhdHRhY2goKS9kZXRhY2goKSAvLyBvbkF0dGFjaCgpIC8gb25EZXRhY2goKVxuICAgICAgICAgICAgICAgIC8vIGFkZCA/XG5cbi8vIGRlZmVyL2FmdGVyIERPTUNvbnRlbnRMb2FkZWQgZm9yIHF1ZXJ5aW5nIERPTVxuLy8gV1RGIGZvciBjdXN0b20gZWxlbWVudHM/Pz9cblxuY2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGVudDogU2hhZG93Um9vdDtcblxuICAgIGNvbnN0cnVjdG9yKGdlbmVyYXRvcj86IENvbnRlbnRHZW5lcmF0b3IpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zb2xlLndhcm4oXCJjc3RyXCIpO1xuXG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiBcIm9wZW5cIn0pO1xuICAgICAgICBpZihnZW5lcmF0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGdlbmVyYXRvci5maWxsQ29udGVudCh0aGlzLmNvbnRlbnQpO1xuICAgIH1cblxuICAgIC8vIGZvciBiZXR0ZXIgc3VnZ2VzdGlvbnNcbiAgICBnZXQgY29udHJvbGVyKCk6IE9taXQ8dGhpcywga2V5b2YgSFRNTEVsZW1lbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IGhvc3QoKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbnR5cGUgQ3N0cjxUPiA9IG5ldyguLi5hcmdzOmFueVtdKSA9PiBUXG50eXBlIExJU1N2M19PcHRzPFQgZXh0ZW5kcyBDc3RyPENvbnRlbnRHZW5lcmF0b3I+ID4gPSB7XG4gICAgY29udGVudF9nZW5lcmF0b3I6IFQsXG59ICYgQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+WzBdO1xuXG4vLyAgYnVpbGRlclxuZXhwb3J0IGZ1bmN0aW9uIExJU1N2MzxUIGV4dGVuZHMgQ3N0cjxDb250ZW50R2VuZXJhdG9yPiA9IENzdHI8Q29udGVudEdlbmVyYXRvcj4+KG9wdHM6IFBhcnRpYWw8TElTU3YzX09wdHM8VD4+ID0ge30pIHtcbiAgICBcbiAgICBjb25zdCBjb250ZW50X2dlbmVyYXRvciA9IG9wdHMuY29udGVudF9nZW5lcmF0b3IgPz8gQ29udGVudEdlbmVyYXRvcjtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgX2dlbmVyYXRvcjogQ29udGVudEdlbmVyYXRvciA9IG5ldyBjb250ZW50X2dlbmVyYXRvcihvcHRzKTtcbiAgICBcbiAgICByZXR1cm4gY2xhc3MgX0xJU1MgZXh0ZW5kcyBMSVNTQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGdlbmVyYXRvciA9IF9nZW5lcmF0b3IpIHtcbiAgICAgICAgICAgIHN1cGVyKGdlbmVyYXRvcik7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuXG5pbXBvcnQge1N0YXRlc30gZnJvbSBcIi4uL0xpZmVDeWNsZS9zdGF0ZXMudHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIFN0YXRlcyAgICAgICAgIDogdHlwZW9mIFN0YXRlc1xuXHRcdC8vIHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuICAgIH1cbn1cblxuTElTUy5TdGF0ZXMgPSBTdGF0ZXM7XG5cblxuaW1wb3J0IHtkZWZpbmUsIGdldE5hbWUsIGlzRGVmaW5lZCwgd2hlbkRlZmluZWQsIGdldEhvc3RDc3RyLCBnZXRIb3N0Q3N0clN5bmN9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdGdldEhvc3RDc3RyICAgIDogdHlwZW9mIGdldEhvc3RDc3RyO1xuXHRcdGdldEhvc3RDc3RyU3luYzogdHlwZW9mIGdldEhvc3RDc3RyU3luYztcblx0XHQvLyB3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldEhvc3RDc3RyU3luYz0gZ2V0SG9zdENzdHJTeW5jO1xuXG4vL0xJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcblxuaW1wb3J0IHtpc1JlYWR5LCB3aGVuUmVhZHksIGdldENvbnRyb2xlckNzdHIsIGdldENvbnRyb2xlckNzdHJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL1JFQURZXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzUmVhZHkgICAgICA6IHR5cGVvZiBpc1JlYWR5O1xuXHRcdHdoZW5SZWFkeSAgICA6IHR5cGVvZiB3aGVuUmVhZHk7XG5cdFx0Z2V0Q29udHJvbGVyQ3N0ciAgICA6IHR5cGVvZiBnZXRDb250cm9sZXJDc3RyO1xuXHRcdGdldENvbnRyb2xlckNzdHJTeW5jOiB0eXBlb2YgZ2V0Q29udHJvbGVyQ3N0clN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzUmVhZHkgICAgICAgICAgICAgPSBpc1JlYWR5O1xuTElTUy53aGVuUmVhZHkgICAgICAgICAgID0gd2hlblJlYWR5O1xuTElTUy5nZXRDb250cm9sZXJDc3RyICAgID0gZ2V0Q29udHJvbGVyQ3N0cjtcbkxJU1MuZ2V0Q29udHJvbGVyQ3N0clN5bmM9IGdldENvbnRyb2xlckNzdHJTeW5jO1xuXG5cblxuaW1wb3J0IHtpc1VwZ3JhZGVkLCB3aGVuVXBncmFkZWQsIHVwZ3JhZGUsIHVwZ3JhZGVTeW5jLCBnZXRIb3N0LCBnZXRIb3N0U3luY30gZnJvbSBcIi4uL0xpZmVDeWNsZS9VUEdSQURFRFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcblx0XHRpc1VwZ3JhZGVkICA6IHR5cGVvZiBpc1VwZ3JhZGVkO1xuXHRcdHdoZW5VcGdyYWRlZDogdHlwZW9mIHdoZW5VcGdyYWRlZDtcblx0XHR1cGdyYWRlICAgICA6IHR5cGVvZiB1cGdyYWRlO1xuXHRcdHVwZ3JhZGVTeW5jIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuXHRcdGdldEhvc3QgICAgIDogdHlwZW9mIGdldEhvc3Q7XG5cdFx0Z2V0SG9zdFN5bmMgOiB0eXBlb2YgZ2V0SG9zdFN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzVXBncmFkZWQgID0gaXNVcGdyYWRlZDtcbkxJU1Mud2hlblVwZ3JhZGVkPSB3aGVuVXBncmFkZWQ7XG5MSVNTLnVwZ3JhZGUgICAgID0gdXBncmFkZTtcbkxJU1MudXBncmFkZVN5bmMgPSB1cGdyYWRlU3luYztcbkxJU1MuZ2V0SG9zdCAgICAgPSBnZXRIb3N0O1xuTElTUy5nZXRIb3N0U3luYyA9IGdldEhvc3RTeW5jO1xuXG5cbmltcG9ydCB7aXNJbml0aWFsaXplZCwgd2hlbkluaXRpYWxpemVkLCBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYywgZ2V0Q29udHJvbGVyLCBnZXRDb250cm9sZXJTeW5jfSBmcm9tIFwiLi4vTGlmZUN5Y2xlL0lOSVRJQUxJWkVEXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuXHRcdGlzSW5pdGlhbGl6ZWQgICAgOiB0eXBlb2YgaXNJbml0aWFsaXplZDtcblx0XHR3aGVuSW5pdGlhbGl6ZWQgIDogdHlwZW9mIHdoZW5Jbml0aWFsaXplZDtcblx0XHRpbml0aWFsaXplICAgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG5cdFx0aW5pdGlhbGl6ZVN5bmMgICA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcblx0XHRnZXRDb250cm9sZXIgICAgIDogdHlwZW9mIGdldENvbnRyb2xlcjtcblx0XHRnZXRDb250cm9sZXJTeW5jIDogdHlwZW9mIGdldENvbnRyb2xlclN5bmM7XG4gICAgfVxufVxuXG5MSVNTLmlzSW5pdGlhbGl6ZWQgICAgPSBpc0luaXRpYWxpemVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQgID0gd2hlbkluaXRpYWxpemVkO1xuTElTUy5pbml0aWFsaXplICAgICAgID0gaW5pdGlhbGl6ZTtcbkxJU1MuaW5pdGlhbGl6ZVN5bmMgICA9IGluaXRpYWxpemVTeW5jO1xuTElTUy5nZXRDb250cm9sZXIgICAgID0gZ2V0Q29udHJvbGVyO1xuTElTUy5nZXRDb250cm9sZXJTeW5jID0gZ2V0Q29udHJvbGVyU3luYzsiLCJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQ29udHJvbGVyQ3N0ciwgTElTU0hvc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQ29udHJvbGVyXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcblxuLy8gdXNlZCBmb3IgcGx1Z2lucy5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgRXh0ZW5kc0NzdHIgZXh0ZW5kcyBMSVNTQ29udHJvbGVyQ3N0cixcbiAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICBPcHRzIGV4dGVuZHMgTElTU19PcHRzPEV4dGVuZHNDc3RyLCBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+XG4gICAgPihvcHRzOiB7ZXh0ZW5kczogRXh0ZW5kc0NzdHJ9ICYgUGFydGlhbDxPcHRzPik6IFJldHVyblR5cGU8dHlwZW9mIF9leHRlbmRzPEV4dGVuZHNDc3RyLCBPcHRzPj5cbi8vIExJU1NDb250cm9sZXIgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgSG9zdENzdHI+Pik6IExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPlxuZXhwb3J0IGZ1bmN0aW9uIExJU1Mob3B0czogYW55ID0ge30pOiBMSVNTQ29udHJvbGVyQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NDb250cm9sZXJDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRlbmRzPFxuICAgICAgICBFeHRlbmRzQ3N0ciBleHRlbmRzIExJU1NDb250cm9sZXJDc3RyLFxuICAgICAgICAvL3RvZG86IGNvbnN0cmFpbnN0cyBvbiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICAgICAgT3B0cyBleHRlbmRzIExJU1NfT3B0czxFeHRlbmRzQ3N0ciwgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PlxuICAgID4ob3B0czoge2V4dGVuZHM6IEV4dGVuZHNDc3RyfSAmIFBhcnRpYWw8T3B0cz4pIHtcblxuICAgIGlmKCBvcHRzLmV4dGVuZHMgPT09IHVuZGVmaW5lZCkgLy8gaDRja1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGEgTElTU0NvbnRyb2xlciEnKTtcblxuICAgIGNvbnN0IGNmZyA9IG9wdHMuZXh0ZW5kcy5Ib3N0LkNmZztcbiAgICBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgY2ZnLCBjZmcuYXJncywgb3B0cyk7XG5cbiAgICBjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBvcHRzLmV4dGVuZHMhIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIH1cblxuXHRcdHByb3RlY3RlZCBzdGF0aWMgb3ZlcnJpZGUgX0hvc3Q6IExJU1NIb3N0PEV4dGVuZGVkTElTUz47XG5cbiAgICAgICAgLy8gVFMgaXMgc3R1cGlkLCByZXF1aXJlcyBleHBsaWNpdCByZXR1cm4gdHlwZVxuXHRcdHN0YXRpYyBvdmVycmlkZSBnZXQgSG9zdCgpOiBMSVNTSG9zdDxFeHRlbmRlZExJU1M+IHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBmdWNrIG9mZlxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuaG9zdCEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250ZW50X2dlbmVyYXRvciEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59IiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIExIb3N0LCBMSVNTQ29udHJvbGVyQ3N0ciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuaW1wb3J0IENvbnRlbnRHZW5lcmF0b3IgZnJvbSBcIi4uL0NvbnRlbnRHZW5lcmF0b3JcIjtcbmltcG9ydCB7IGRlZmluZSB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvREVGSU5FRFwiO1xuXG4vLyBzaG91bGQgYmUgaW1wcm92ZWQgKGJ1dCBob3cgPylcbmNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFthdXRvZGlyXScpO1xuXG5jb25zdCBSRVNTT1VSQ0VTID0gW1xuXHRcImluZGV4LmpzXCIsXG5cdFwiaW5kZXguYnJ5XCIsXG5cdFwiaW5kZXguaHRtbFwiLFxuXHRcImluZGV4LmNzc1wiXG5dO1xuXG5jb25zdCBLbm93blRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxubGV0IF9jZGlyOiBudWxsfHN0cmluZztcblxuaWYoIHNjcmlwdCAhPT0gbnVsbCApIHtcblxuXHRjb25zdCBTVzogUHJvbWlzZTx2b2lkPiA9IG5ldyBQcm9taXNlKCBhc3luYyAocmVzb2x2ZSkgPT4ge1xuXG5cdFx0Y29uc3Qgc3dfcGF0aCA9IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ3N3Jyk7XG5cblx0XHRpZiggc3dfcGF0aCA9PT0gbnVsbCApIHtcblx0XHRcdGNvbnNvbGUud2FybihcIllvdSBhcmUgdXNpbmcgTElTUyBBdXRvIG1vZGUgd2l0aG91dCBzdy5qcy5cIik7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdHRyeSB7XG5cdFx0XHRhd2FpdCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3Rlcihzd19wYXRoLCB7c2NvcGU6IFwiL1wifSk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJSZWdpc3RyYXRpb24gb2YgU2VydmljZVdvcmtlciBmYWlsZWRcIik7XG5cdFx0XHRjb25zb2xlLmVycm9yKGUpO1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH1cblxuXHRcdGlmKCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICkge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdF9jZGlyID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnYXV0b2RpcicpITtcblx0Y29uc29sZS53YXJuKF9jZGlyKTtcblx0aWYoIF9jZGlyW19jZGlyLmxlbmd0aC0xXSAhPT0gJy8nKVxuXHRcdF9jZGlyICs9ICcvJztcblxuXHRjb25zdCBicnl0aG9uID0gc2NyaXB0LmdldEF0dHJpYnV0ZShcImJyeXRob25cIik7XG5cblx0Ly8gb2JzZXJ2ZSBmb3IgbmV3IGluamVjdGVkIHRhZ3MuXG5cdG5ldyBNdXRhdGlvbk9ic2VydmVyKCAobXV0YXRpb25zKSA9PiB7XG5cblx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcblx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0aWYoYWRkaXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcblx0XHRcdFx0XHRhZGRUYWcoYWRkaXRpb24pXG5cblx0fSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuXHRmb3IoIGxldCBlbGVtIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiKlwiKSApXG5cdFx0YWRkVGFnKCBlbGVtICk7XG5cblxuXHRhc3luYyBmdW5jdGlvbiBhZGRUYWcodGFnOiBIVE1MRWxlbWVudCkge1xuXG5cdFx0YXdhaXQgU1c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cblx0XHRjb25zdCB0YWduYW1lID0gKCB0YWcuZ2V0QXR0cmlidXRlKCdpcycpID8/IHRhZy50YWdOYW1lICkudG9Mb3dlckNhc2UoKTtcblxuXHRcdGxldCBob3N0ID0gSFRNTEVsZW1lbnQ7XG5cdFx0aWYoIHRhZy5oYXNBdHRyaWJ1dGUoJ2lzJykgKVxuXHRcdFx0aG9zdCA9IHRhZy5jb25zdHJ1Y3RvciBhcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cblxuXHRcdGlmKCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCBLbm93blRhZ3MuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aW1wb3J0Q29tcG9uZW50KHRhZ25hbWUsIHtcblx0XHRcdGJyeXRob24sXG5cdFx0XHRjZGlyOiBfY2Rpcixcblx0XHRcdGhvc3Rcblx0XHR9KTtcdFx0XG5cdH1cbn1cblxuXG5hc3luYyBmdW5jdGlvbiBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZTogc3RyaW5nLCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55Piwgb3B0czoge2h0bWw6IHN0cmluZywgY3NzOiBzdHJpbmcsIGhvc3Q6IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pn0pIHtcblxuXHRjb25zdCBjX2pzICAgICAgPSBmaWxlc1tcImluZGV4LmpzXCJdO1xuXHRvcHRzLmh0bWwgICAgID8/PSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cblx0Y29uc29sZS53YXJuKG9wdHMsIGZpbGVzKTtcblxuXHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0aWYoIGNfanMgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGNvbnN0IGZpbGUgPSBuZXcgQmxvYihbY19qc10sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pO1xuXHRcdGNvbnN0IHVybCAgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuXG5cdFx0Y29uc3Qgb2xkcmVxID0gTElTUy5yZXF1aXJlO1xuXG5cdFx0TElTUy5yZXF1aXJlID0gZnVuY3Rpb24odXJsOiBVUkx8c3RyaW5nKSB7XG5cblx0XHRcdGlmKCB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiICYmIHVybC5zdGFydHNXaXRoKCcuLycpICkge1xuXHRcdFx0XHRjb25zdCBmaWxlbmFtZSA9IHVybC5zbGljZSgyKTtcblx0XHRcdFx0aWYoIGZpbGVuYW1lIGluIGZpbGVzKVxuXHRcdFx0XHRcdHJldHVybiBmaWxlc1tmaWxlbmFtZV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvbGRyZXEodXJsKTtcblx0XHR9XG5cblx0XHRrbGFzcyA9IChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmwpKS5kZWZhdWx0O1xuXG5cdFx0TElTUy5yZXF1aXJlID0gb2xkcmVxO1xuXHR9XG5cdGVsc2UgaWYoIG9wdHMuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0a2xhc3MgPSBMSVNTKHtcblx0XHRcdC4uLm9wdHMsXG5cdFx0XHRjb250ZW50X2dlbmVyYXRvcjogTElTU0F1dG9fQ29udGVudEdlbmVyYXRvclxuXHRcdH0pO1xuXHR9XG5cblx0aWYoa2xhc3MgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGZpbGVzIGZvciBXZWJDb21wb25lbnQgJHt0YWduYW1lfS5gKTtcblxuXHRkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXG5cdHJldHVybiBrbGFzcztcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBpbnRlcm5hbCB0b29scyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRjb25zdCBhbnN3ZXIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cblx0aWYoYW5zd2VyID09PSBcIlwiKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIGFuc3dlclxufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn1cblxuXG5jb25zdCBjb252ZXJ0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbmZ1bmN0aW9uIGVuY29kZUhUTUwodGV4dDogc3RyaW5nKSB7XG5cdGNvbnZlcnRlci50ZXh0Q29udGVudCA9IHRleHQ7XG5cdHJldHVybiBjb252ZXJ0ZXIuaW5uZXJIVE1MO1xufVxuXG5leHBvcnQgY2xhc3MgTElTU0F1dG9fQ29udGVudEdlbmVyYXRvciBleHRlbmRzIENvbnRlbnRHZW5lcmF0b3Ige1xuXG5cdHByb3RlY3RlZCBvdmVycmlkZSBwcmVwYXJlSFRNTChodG1sPzogRG9jdW1lbnRGcmFnbWVudCB8IEhUTUxFbGVtZW50IHwgc3RyaW5nKSB7XG5cdFx0XG5cdFx0dGhpcy5kYXRhID0gbnVsbDtcblxuXHRcdGlmKCB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycgKSB7XG5cblx0XHRcdHRoaXMuZGF0YSA9IGh0bWw7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdC8qXG5cdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlQWxsKC9cXCRcXHsoW1xcd10rKVxcfS9nLCAoXywgbmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHJldHVybiBgPGxpc3MgdmFsdWU9XCIke25hbWV9XCI+PC9saXNzPmA7XG5cdFx0XHR9KTsqL1xuXG5cdFx0XHQvL1RPRE86ICR7fSBpbiBhdHRyXG5cdFx0XHRcdC8vIC0gZGV0ZWN0IHN0YXJ0ICR7ICsgZW5kIH1cblx0XHRcdFx0Ly8gLSByZWdpc3RlciBlbGVtICsgYXR0ciBuYW1lXG5cdFx0XHRcdC8vIC0gcmVwbGFjZS4gXG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBzdXBlci5wcmVwYXJlSFRNTChodG1sKTtcblx0fVxuXG5cdG92ZXJyaWRlIGdlbmVyYXRlPEhvc3QgZXh0ZW5kcyBMSG9zdD4oaG9zdDogSG9zdCk6IEhUTUxFbGVtZW50IHwgU2hhZG93Um9vdCB7XG5cdFx0XG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdGlmKCB0aGlzLmRhdGEgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IHN0ciA9ICh0aGlzLmRhdGEgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IGVuY29kZUhUTUwoaG9zdC5nZXRBdHRyaWJ1dGUobWF0Y2gpID8/ICcnICkpO1xuXHRcdFx0c3VwZXIuc2V0VGVtcGxhdGUoIHN1cGVyLnByZXBhcmVIVE1MKHN0cikhICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29udGVudCA9IHN1cGVyLmdlbmVyYXRlKGhvc3QpO1xuXG5cdFx0Lypcblx0XHQvLyBodG1sIG1hZ2ljIHZhbHVlcy5cblx0XHQvLyBjYW4gYmUgb3B0aW1pemVkLi4uXG5cdFx0Y29uc3QgdmFsdWVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXHRcdGZvcihsZXQgdmFsdWUgb2YgdmFsdWVzKVxuXHRcdFx0dmFsdWUudGV4dENvbnRlbnQgPSBob3N0LmdldEF0dHJpYnV0ZSh2YWx1ZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXHRcdCovXG5cblx0XHQvLyBjc3MgcHJvcC5cblx0XHRjb25zdCBjc3NfYXR0cnMgPSBob3N0LmdldEF0dHJpYnV0ZU5hbWVzKCkuZmlsdGVyKCBlID0+IGUuc3RhcnRzV2l0aCgnY3NzLScpKTtcblx0XHRmb3IobGV0IGNzc19hdHRyIG9mIGNzc19hdHRycylcblx0XHRcdGhvc3Quc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtjc3NfYXR0ci5zbGljZSgnY3NzLScubGVuZ3RoKX1gLCBob3N0LmdldEF0dHJpYnV0ZShjc3NfYXR0cikpO1xuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cbn1cblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGltcG9ydENvbXBvbmVudHMgOiB0eXBlb2YgaW1wb3J0Q29tcG9uZW50cztcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50ICA6IHR5cGVvZiBpbXBvcnRDb21wb25lbnQ7XG4gICAgICAgIHJlcXVpcmUgICAgICAgICAgOiB0eXBlb2YgcmVxdWlyZTtcbiAgICB9XG59XG5cbnR5cGUgaW1wb3J0Q29tcG9uZW50c19PcHRzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSB7XG5cdGNkaXIgICA/OiBzdHJpbmd8bnVsbCxcblx0YnJ5dGhvbj86IHN0cmluZ3xudWxsLFxuXHRob3N0ICAgPzogQ29uc3RydWN0b3I8VD5cbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudHM8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuXHRcdFx0XHRcdFx0Y29tcG9uZW50czogc3RyaW5nW10sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNkaXIgICAgPSBfY2Rpcixcblx0XHRcdFx0XHRcdFx0YnJ5dGhvbiA9IG51bGwsXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0aG9zdCAgICA9IEhUTUxFbGVtZW50XG5cdFx0XHRcdFx0XHR9OiBpbXBvcnRDb21wb25lbnRzX09wdHM8VD4pIHtcblxuXHRjb25zdCByZXN1bHRzOiBSZWNvcmQ8c3RyaW5nLCBMSVNTQ29udHJvbGVyQ3N0cj4gPSB7fTtcblxuXHRmb3IobGV0IHRhZ25hbWUgb2YgY29tcG9uZW50cykge1xuXG5cdFx0cmVzdWx0c1t0YWduYW1lXSA9IGF3YWl0IGltcG9ydENvbXBvbmVudCh0YWduYW1lLCB7XG5cdFx0XHRjZGlyLFxuXHRcdFx0YnJ5dGhvbixcblx0XHRcdGhvc3Rcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiByZXN1bHRzO1xufVxuXG5jb25zdCBicnlfd3JhcHBlciA9IGBmcm9tIGJyb3dzZXIgaW1wb3J0IHNlbGZcblxuZGVmIHdyYXBqcyhqc19rbGFzcyk6XG5cblx0Y2xhc3MgV3JhcHBlcjpcblxuXHRcdF9qc19rbGFzcyA9IGpzX2tsYXNzXG5cdFx0X2pzID0gTm9uZVxuXG5cdFx0ZGVmIF9faW5pdF9fKHRoaXMsICphcmdzKTpcblx0XHRcdHRoaXMuX2pzID0ganNfa2xhc3MubmV3KCphcmdzKVxuXG5cdFx0ZGVmIF9fZ2V0YXR0cl9fKHRoaXMsIG5hbWU6IHN0cik6XG5cdFx0XHRyZXR1cm4gdGhpcy5fanNbbmFtZV07XG5cblx0XHRkZWYgX19zZXRhdHRyX18odGhpcywgbmFtZTogc3RyLCB2YWx1ZSk6XG5cdFx0XHRpZiBuYW1lID09IFwiX2pzXCI6XG5cdFx0XHRcdHN1cGVyKCkuX19zZXRhdHRyX18obmFtZSwgdmFsdWUpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0dGhpcy5fanNbbmFtZV0gPSB2YWx1ZVxuXHRcblx0cmV0dXJuIFdyYXBwZXJcblxuc2VsZi53cmFwanMgPSB3cmFwanNcbmA7XG5cbmFzeW5jIGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG5cdHRhZ25hbWU6IHN0cmluZyxcblx0e1xuXHRcdGNkaXIgICAgPSBfY2Rpcixcblx0XHRicnl0aG9uID0gbnVsbCxcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0aG9zdCAgICA9IEhUTUxFbGVtZW50LFxuXHRcdGZpbGVzICAgPSBudWxsXG5cdH06IGltcG9ydENvbXBvbmVudHNfT3B0czxUPiAmIHtmaWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz58bnVsbH0gPSB7fVxuKSB7XG5cblx0S25vd25UYWdzLmFkZCh0YWduYW1lKTtcblxuXHRjb25zdCBjb21wb19kaXIgPSBgJHtjZGlyfSR7dGFnbmFtZX0vYDtcblxuXHRpZiggZmlsZXMgPT09IG51bGwgKSB7XG5cdFx0ZmlsZXMgPSB7fTtcblxuXHRcdGNvbnN0IGZpbGUgPSBicnl0aG9uID09PSBcInRydWVcIiA/ICdpbmRleC5icnknIDogJ2luZGV4LmpzJztcblxuXHRcdGZpbGVzW2ZpbGVdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfSR7ZmlsZX1gLCB0cnVlKSkhO1xuXG5cdFx0Ly9UT0RPISEhXG5cdFx0dHJ5IHtcblx0XHRcdGZpbGVzW1wiaW5kZXguaHRtbFwiXSA9IChhd2FpdCBfZmV0Y2hUZXh0KGAke2NvbXBvX2Rpcn1pbmRleC5odG1sYCwgdHJ1ZSkpITtcblx0XHR9IGNhdGNoKGUpIHtcblxuXHRcdH1cblx0XHR0cnkge1xuXHRcdFx0ZmlsZXNbXCJpbmRleC5jc3NcIiBdID0gKGF3YWl0IF9mZXRjaFRleHQoYCR7Y29tcG9fZGlyfWluZGV4LmNzc2AgLCB0cnVlKSkhO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XG5cdFx0fVxuXHR9XG5cblx0aWYoIGJyeXRob24gPT09IFwidHJ1ZVwiICYmIGZpbGVzWydpbmRleC5icnknXSAhPT0gdW5kZWZpbmVkKSB7XG5cblx0XHRjb25zdCBjb2RlID0gZmlsZXNbXCJpbmRleC5icnlcIl07XG5cblx0XHRmaWxlc1snaW5kZXguanMnXSA9XG5gY29uc3QgJEIgPSBnbG9iYWxUaGlzLl9fQlJZVEhPTl9fO1xuXG4kQi5ydW5QeXRob25Tb3VyY2UoXFxgJHticnlfd3JhcHBlcn1cXGAsIFwiX1wiKTtcbiRCLnJ1blB5dGhvblNvdXJjZShcXGAke2NvZGV9XFxgLCBcIl9cIik7XG5cbmNvbnN0IG1vZHVsZSA9ICRCLmltcG9ydGVkW1wiX1wiXTtcbmV4cG9ydCBkZWZhdWx0IG1vZHVsZS5XZWJDb21wb25lbnQ7XG5cbmA7XG5cdH1cblxuXHRjb25zdCBodG1sID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXHRjb25zdCBjc3MgID0gZmlsZXNbXCJpbmRleC5jc3NcIl07XG5cblx0cmV0dXJuIGF3YWl0IGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcywge2h0bWwsIGNzcywgaG9zdH0pO1xufVxuXG5mdW5jdGlvbiByZXF1aXJlKHVybDogVVJMfHN0cmluZyk6IFByb21pc2U8UmVzcG9uc2U+fHN0cmluZyB7XG5cdHJldHVybiBmZXRjaCh1cmwpO1xufVxuXG5cbkxJU1MuaW1wb3J0Q29tcG9uZW50cyA9IGltcG9ydENvbXBvbmVudHM7XG5MSVNTLmltcG9ydENvbXBvbmVudCAgPSBpbXBvcnRDb21wb25lbnQ7XG5MSVNTLnJlcXVpcmUgID0gcmVxdWlyZTsiLCJpbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCIuLi9MaWZlQ3ljbGUvSU5JVElBTElaRURcIjtcbmltcG9ydCB0eXBlIHsgTElTU0NvbnRyb2xlciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufSIsIlxuaW1wb3J0IHsgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxudHlwZSBMaXN0ZW5lckZjdDxUIGV4dGVuZHMgRXZlbnQ+ID0gKGV2OiBUKSA9PiB2b2lkO1xudHlwZSBMaXN0ZW5lck9iajxUIGV4dGVuZHMgRXZlbnQ+ID0geyBoYW5kbGVFdmVudDogTGlzdGVuZXJGY3Q8VD4gfTtcbnR5cGUgTGlzdGVuZXI8VCBleHRlbmRzIEV2ZW50PiA9IExpc3RlbmVyRmN0PFQ+fExpc3RlbmVyT2JqPFQ+O1xuXG5leHBvcnQgY2xhc3MgRXZlbnRUYXJnZXQyPEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEV2ZW50Pj4gZXh0ZW5kcyBFdmVudFRhcmdldCB7XG5cblx0b3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGNhbGxiYWNrOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBvcHRpb25zPzogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuKTogdm9pZCB7XG5cdFx0XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0cmV0dXJuIHN1cGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZGlzcGF0Y2hFdmVudDxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+PihldmVudDogRXZlbnRzW1RdKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHN1cGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG5cblx0b3ZlcnJpZGUgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsaXN0ZW5lcjogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG9wdGlvbnM/OiBib29sZWFufEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZCB7XG5cblx0XHQvL0B0cy1pZ25vcmVcblx0XHRzdXBlci5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXZlbnQyPFQgZXh0ZW5kcyBzdHJpbmcsIEFyZ3M+IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8QXJncz4ge1xuXG5cdGNvbnN0cnVjdG9yKHR5cGU6IFQsIGFyZ3M6IEFyZ3MpIHtcblx0XHRzdXBlcih0eXBlLCB7ZGV0YWlsOiBhcmdzfSk7XG5cdH1cblxuXHRvdmVycmlkZSBnZXQgdHlwZSgpOiBUIHsgcmV0dXJuIHN1cGVyLnR5cGUgYXMgVDsgfVxufVxuXG50eXBlIEluc3RhbmNlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+Pj4gPSB7XG5cdFtLIGluIGtleW9mIFRdOiBJbnN0YW5jZVR5cGU8VFtLXT5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdpdGhFdmVudHM8VCBleHRlbmRzIG9iamVjdCwgRXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+PiA+KGV2OiBDb25zdHJ1Y3RvcjxUPiwgX2V2ZW50czogRXZlbnRzKSB7XG5cblx0dHlwZSBFdnRzID0gSW5zdGFuY2VzPEV2ZW50cz47XG5cblx0aWYoICEgKGV2IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQpIClcblx0XHRyZXR1cm4gZXYgYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xuXG5cdC8vIGlzIGFsc28gYSBtaXhpblxuXHQvLyBAdHMtaWdub3JlXG5cdGNsYXNzIEV2ZW50VGFyZ2V0TWl4aW5zIGV4dGVuZHMgZXYge1xuXG5cdFx0I2V2ID0gbmV3IEV2ZW50VGFyZ2V0MjxFdnRzPigpO1xuXG5cdFx0YWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hFdmVudCguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuZGlzcGF0Y2hFdmVudCguLi5hcmdzKTtcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiBFdmVudFRhcmdldE1peGlucyBhcyB1bmtub3duIGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+Pjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBTaGFkb3dSb290IHRvb2xzID09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBldmVudE1hdGNoZXMoZXY6IEV2ZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cblx0bGV0IGVsZW1lbnRzID0gZXYuY29tcG9zZWRQYXRoKCkuc2xpY2UoMCwtMikuZmlsdGVyKGUgPT4gISAoZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpICkucmV2ZXJzZSgpIGFzIEhUTUxFbGVtZW50W107XG5cblx0Zm9yKGxldCBlbGVtIG9mIGVsZW1lbnRzIClcblx0XHRpZihlbGVtLm1hdGNoZXMoc2VsZWN0b3IpIClcblx0XHRcdHJldHVybiBlbGVtOyBcblxuXHRyZXR1cm4gbnVsbDtcbn0iLCJcbmltcG9ydCB0eXBlIHsgTElTU0NvbnRyb2xlciwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudHMge307XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplU3luYywgd2hlbkluaXRpYWxpemVkIH0gZnJvbSBcIi4uL0xpZmVDeWNsZS9JTklUSUFMSVpFRFwiO1xuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIC8vIGFzeW5jXG4gICAgICAgIHFzIDogdHlwZW9mIHFzO1xuICAgICAgICBxc286IHR5cGVvZiBxc287XG4gICAgICAgIHFzYTogdHlwZW9mIHFzYTtcbiAgICAgICAgcXNjOiB0eXBlb2YgcXNjO1xuXG4gICAgICAgIC8vIHN5bmNcbiAgICAgICAgcXNTeW5jIDogdHlwZW9mIHFzU3luYztcbiAgICAgICAgcXNhU3luYzogdHlwZW9mIHFzYVN5bmM7XG4gICAgICAgIHFzY1N5bmM6IHR5cGVvZiBxc2NTeW5jO1xuXG5cdFx0Y2xvc2VzdDogdHlwZW9mIGNsb3Nlc3Q7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsaXNzX3NlbGVjdG9yKG5hbWU/OiBzdHJpbmcpIHtcblx0aWYobmFtZSA9PT0gdW5kZWZpbmVkKSAvLyBqdXN0IGFuIGg0Y2tcblx0XHRyZXR1cm4gXCJcIjtcblx0cmV0dXJuIGA6aXMoJHtuYW1lfSwgW2lzPVwiJHtuYW1lfVwiXSlgO1xufVxuXG5mdW5jdGlvbiBfYnVpbGRRUyhzZWxlY3Rvcjogc3RyaW5nLCB0YWduYW1lX29yX3BhcmVudD86IHN0cmluZyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCwgcGFyZW50OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXHRcblx0aWYoIHRhZ25hbWVfb3JfcGFyZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRhZ25hbWVfb3JfcGFyZW50ICE9PSAnc3RyaW5nJykge1xuXHRcdHBhcmVudCA9IHRhZ25hbWVfb3JfcGFyZW50O1xuXHRcdHRhZ25hbWVfb3JfcGFyZW50ID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cmV0dXJuIFtgJHtzZWxlY3Rvcn0ke2xpc3Nfc2VsZWN0b3IodGFnbmFtZV9vcl9wYXJlbnQgYXMgc3RyaW5nfHVuZGVmaW5lZCl9YCwgcGFyZW50XSBhcyBjb25zdDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxczxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRsZXQgcmVzdWx0ID0gYXdhaXQgcXNvPFQ+KHNlbGVjdG9yLCBwYXJlbnQpO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiByZXN1bHQhXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUW10+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dW10gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxUPj4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cHJvbWlzZXNbaWR4KytdID0gd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVDtcbmZ1bmN0aW9uIHFzU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG59XG5cbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFRbXTtcbmZ1bmN0aW9uIHFzYVN5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl1bXTtcbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NDb250cm9sZXI+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTxUPiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRyZXN1bHRbaWR4KytdID0gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQ29udHJvbGVyPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogVDtcbmZ1bmN0aW9uIHFzY1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4ocmVzdWx0KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNsb3Nlc3Q8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcblxuXHR3aGlsZSh0cnVlKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGVsZW1lbnQuY2xvc2VzdDxFPihzZWxlY3Rvcik7XG5cblx0XHRpZiggcmVzdWx0ICE9PSBudWxsKVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblxuXHRcdGNvbnN0IHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG5cdFx0aWYoICEgKFwiaG9zdFwiIGluIHJvb3QpIClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0ZWxlbWVudCA9IChyb290IGFzIFNoYWRvd1Jvb3QpLmhvc3Q7XG5cdH1cbn1cblxuXG4vLyBhc3luY1xuTElTUy5xcyAgPSBxcztcbkxJU1MucXNvID0gcXNvO1xuTElTUy5xc2EgPSBxc2E7XG5MSVNTLnFzYyA9IHFzYztcblxuLy8gc3luY1xuTElTUy5xc1N5bmMgID0gcXNTeW5jO1xuTElTUy5xc2FTeW5jID0gcXNhU3luYztcbkxJU1MucXNjU3luYyA9IHFzY1N5bmM7XG5cbkxJU1MuY2xvc2VzdCA9IGNsb3Nlc3Q7IiwiaW1wb3J0IHR5cGUgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB0eXBlIHsgTElTUyB9IGZyb20gXCIuL0xJU1NDb250cm9sZXJcIjtcbmltcG9ydCB7IENvbnRlbnRHZW5lcmF0b3JfT3B0cywgQ29udGVudEdlbmVyYXRvckNzdHIgfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3Mge31cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7IG5ldyguLi5hcmdzOmFueVtdKTogVH07XG5cbmV4cG9ydCB0eXBlIENTU19SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MU3R5bGVFbGVtZW50fENTU1N0eWxlU2hlZXQ7XG5leHBvcnQgdHlwZSBDU1NfU291cmNlICAgPSBDU1NfUmVzb3VyY2UgfCBQcm9taXNlPENTU19SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIEhUTUxfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFRlbXBsYXRlRWxlbWVudHxOb2RlO1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnXG59O1xuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSB7XG4gICAgICAgIGV4dGVuZHM6IEV4dGVuZHNDdHIsIC8vIEpTIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsICAgLy8gSFRNTCBIb3N0XG4gICAgICAgIGNvbnRlbnRfZ2VuZXJhdG9yOiBDb250ZW50R2VuZXJhdG9yQ3N0cixcbn0gJiBDb250ZW50R2VuZXJhdG9yX09wdHM7XG5cbi8vVE9ETzogcmV3cml0ZS4uLlxuLy8gTElTU0NvbnRyb2xlclxuXG5leHBvcnQgdHlwZSBMSVNTQ29udHJvbGVyQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PlxuICAgID4gPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cbmV4cG9ydCB0eXBlIExJU1NDb250cm9sZXI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD5cbiAgICA+ID0gSW5zdGFuY2VUeXBlPExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsIEhvc3RDc3RyPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0NvbnRyb2xlcjJMSVNTQ29udHJvbGVyQ3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcj4gPSBUIGV4dGVuZHMgTElTU0NvbnRyb2xlcjxcbiAgICAgICAgICAgIGluZmVyIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG4gICAgICAgID4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NDb250cm9sZXJDc3RyPEV4dGVuZHNDdHIsSG9zdENzdHI+IDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0NvbnRyb2xlcnxMSVNTQ29udHJvbGVyQ3N0ciA9IExJU1NDb250cm9sZXI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0NvbnRyb2xlciA/IExJU1NDb250cm9sZXIyTElTU0NvbnRyb2xlckNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NDb250cm9sZXJ8TElTU0NvbnRyb2xlckNzdHIgPSBMSVNTQ29udHJvbGVyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+O1xuXG4vLyBsaWdodGVyIExJU1NIb3N0IGRlZiB0byBhdm9pZCB0eXBlIGlzc3Vlcy4uLlxuZXhwb3J0IHR5cGUgTEhvc3Q8SG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4+ID0ge1xuXG4gICAgY29udGVudDogU2hhZG93Um9vdHxJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG4gICAgc2hhZG93TW9kZTogU2hhZG93Q2ZnfG51bGw7XG5cbiAgICBDU1NTZWxlY3Rvcjogc3RyaW5nO1xuXG59ICYgSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuZXhwb3J0IHR5cGUgTEhvc3RDc3RyPEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+PiA9IHtcbiAgICBuZXcoLi4uYXJnczogYW55KTogTEhvc3Q8SG9zdENzdHI+O1xuXG4gICAgQ2ZnOiB7XG4gICAgICAgIGhvc3QgICAgICAgICAgICAgOiBIb3N0Q3N0cixcbiAgICAgICAgY29udGVudF9nZW5lcmF0b3I6IENvbnRlbnRHZW5lcmF0b3JDc3RyLFxuICAgICAgICBhcmdzICAgICAgICAgICAgIDogQ29udGVudEdlbmVyYXRvcl9PcHRzXG4gICAgfVxuXG59ICYgSG9zdENzdHI7IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IEhUTUxFbGVtZW50IHwgdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG4gICAgaWYoIENsYXNzIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIENsYXNzID0gQ2xhc3MuY29uc3RydWN0b3IgYXMgdHlwZW9mIEhUTUxFbGVtZW50O1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXG4gICAgbGV0IGN1cnNvciA9IENsYXNzO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB3aGlsZSAoY3Vyc29yLl9fcHJvdG9fXyAhPT0gSFRNTEVsZW1lbnQpXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY3Vyc29yID0gY3Vyc29yLl9fcHJvdG9fXztcblxuICAgIC8vIGRpcmVjdGx5IGluaGVyaXQgSFRNTEVsZW1lbnRcbiAgICBpZiggISBjdXJzb3IubmFtZS5zdGFydHNXaXRoKCdIVE1MJykgJiYgISBjdXJzb3IubmFtZS5lbmRzV2l0aCgnRWxlbWVudCcpIClcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBodG1sdGFnID0gY3Vyc29yLm5hbWUuc2xpY2UoNCwgLTcpO1xuXG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiBIVE1MRWxlbWVudCB8IHR5cGVvZiBIVE1MRWxlbWVudCkge1xuXHRyZXR1cm4gQ0FOX0hBVkVfU0hBRE9XLmluY2x1ZGVzKCBfZWxlbWVudDJ0YWduYW1lKHRhZykgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5ET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn1cblxuLy8gZm9yIG1peGlucy5cbi8qXG5leHBvcnQgdHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXJcbiovXG5cbi8vIG1vdmVkIGhlcmUgaW5zdGVhZCBvZiBidWlsZCB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHMuXG5leHBvcnQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudD4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiBUIHtcbiAgICBcbiAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN0cmluZyArPSBgJHthcmdzW2ldfWA7XG4gICAgICAgIHN0cmluZyArPSBgJHtzdHJbaSsxXX1gO1xuICAgICAgICAvL1RPRE86IG1vcmUgcHJlLXByb2Nlc3Nlc1xuICAgIH1cblxuICAgIC8vIHVzaW5nIHRlbXBsYXRlIHByZXZlbnRzIEN1c3RvbUVsZW1lbnRzIHVwZ3JhZGUuLi5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHJpbmcudHJpbSgpO1xuXG4gICAgaWYoIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEgJiYgdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpXG4gICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkISBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudCEgYXMgdW5rbm93biBhcyBUO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgXCIuL2NvcmUvTGlmZUN5Y2xlXCI7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb250ZW50R2VuZXJhdG9yfSBmcm9tIFwiLi9Db250ZW50R2VuZXJhdG9yXCI7XG5cbi8vVE9ETzogZXZlbnRzLnRzXG4vL1RPRE86IGdsb2JhbENTU1J1bGVzXG5leHBvcnQge0xJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3J9IGZyb20gXCIuL2hlbHBlcnMvTElTU0F1dG9cIjtcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge1NoYWRvd0NmZ30gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IHtsaXNzLCBsaXNzU3luY30gZnJvbSBcIi4vaGVscGVycy9idWlsZFwiO1xuZXhwb3J0IHtldmVudE1hdGNoZXMsIFdpdGhFdmVudHMsIEV2ZW50VGFyZ2V0MiwgQ3VzdG9tRXZlbnQyfSBmcm9tICcuL2hlbHBlcnMvZXZlbnRzJztcbmV4cG9ydCB7aHRtbH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7XG5cbmltcG9ydCB7TElTU3YzfSBmcm9tIFwiLi9WM1wiO1xuLy8gQHRzLWlnbm9yZVxuTElTUy5MSVNTdjMgPSBMSVNTdjM7XG5cblxuLy8gZm9yIGRlYnVnLlxuZXhwb3J0IHtfZXh0ZW5kc30gZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG4vLyByZXF1aXJlZCBmb3IgYXV0byBtb2RlIGl0IHNlZW1zLlxuLy8gQHRzLWlnbm9yZVxuZ2xvYmFsVGhpcy5MSVNTID0gTElTUzsiXSwibmFtZXMiOlsiZ2V0U2hhcmVkQ1NTIiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzRE9NQ29udGVudExvYWRlZCIsImlzU2hhZG93U3VwcG9ydGVkIiwid2hlbkRPTUNvbnRlbnRMb2FkZWQiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJzaGFyZWRDU1MiLCJDb250ZW50R2VuZXJhdG9yIiwiZGF0YSIsImNvbnN0cnVjdG9yIiwiaHRtbCIsImNzcyIsInNoYWRvdyIsInByZXBhcmVIVE1MIiwicHJlcGFyZUNTUyIsInNldFRlbXBsYXRlIiwidGVtcGxhdGUiLCJpc1JlYWR5Iiwid2hlblJlYWR5IiwiZmlsbENvbnRlbnQiLCJpbmplY3RDU1MiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwiYXBwZW5kIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwiZ2VuZXJhdGUiLCJob3N0IiwidGFyZ2V0IiwiaW5pdFNoYWRvdyIsInNoYWRvd01vZGUiLCJOT05FIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsInJlcGxhY2VDaGlsZHJlbiIsImNhbkhhdmVTaGFkb3ciLCJFcnJvciIsIm1vZGUiLCJPUEVOIiwiYXR0YWNoU2hhZG93IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZSIsInByb2Nlc3NDU1MiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInVuZGVmaW5lZCIsInN0ciIsInRyaW0iLCJpbm5lckhUTUwiLCJIVE1MRWxlbWVudCIsInN0eWxlc2hlZXRzIiwiU2hhZG93Um9vdCIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsInB1c2giLCJjc3NzZWxlY3RvciIsIkNTU1NlbGVjdG9yIiwiaGFzIiwic2V0QXR0cmlidXRlIiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJyZXBsYWNlIiwiaGVhZCIsImFkZCIsImJ1aWxkTElTU0hvc3QiLCJzZXRDc3RyQ29udHJvbGVyIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJMSVNTIiwiYXJncyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsImNvbnRlbnRfZ2VuZXJhdG9yIiwiTElTU0NvbnRyb2xlciIsIkhvc3QiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJuYW1lIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImNvbm5lY3RlZENhbGxiYWNrIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJpc0Nvbm5lY3RlZCIsIl9Ib3N0IiwiaWQiLCJfX2NzdHJfY29udHJvbGVyIiwiTGlzcyIsImhvc3RDc3RyIiwiY29udGVudF9nZW5lcmF0b3JfY3N0ciIsIkxJU1NIb3N0IiwiQ2ZnIiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiQ29udHJvbGVyIiwiY29udHJvbGVyIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJwYXJhbXMiLCJpbml0IiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwidGhlbiIsInByb21pc2UiLCJyZXNvbHZlIiwiUHJvbWlzZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsImRlZmluZSIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsImJyeV9jbGFzcyIsIl9fYmFzZXNfXyIsImZpbHRlciIsIl9fbmFtZV9fIiwiX2pzX2tsYXNzIiwiJGpzX2Z1bmMiLCJfX0JSWVRIT05fXyIsIiRjYWxsIiwiJGdldGF0dHJfcGVwNjU3IiwiaHRtbHRhZyIsIkNsYXNzIiwib3B0cyIsImdldE5hbWUiLCJlbGVtZW50IiwiRWxlbWVudCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJpc0RlZmluZWQiLCJlbGVtIiwiZ2V0Iiwid2hlbkRlZmluZWQiLCJnZXRIb3N0Q3N0ciIsImdldEhvc3RDc3RyU3luYyIsImlzVXBncmFkZWQiLCJ1cGdyYWRlU3luYyIsIndoZW5VcGdyYWRlZCIsImdldENvbnRyb2xlciIsImdldENvbnRyb2xlclN5bmMiLCJpbml0aWFsaXplU3luYyIsImdldENvbnRyb2xlckNzdHIiLCJnZXRDb250cm9sZXJDc3RyU3luYyIsIl93aGVuVXBncmFkZWQiLCJnZXRIb3N0Iiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImdldEhvc3RTeW5jIiwiU3RhdGVzIiwiTElTU0Jhc2UiLCJnZW5lcmF0b3IiLCJjb25zb2xlIiwid2FybiIsIkxJU1N2MyIsIl9nZW5lcmF0b3IiLCJfTElTUyIsIklMSVNTIiwiY2ZnIiwiYXNzaWduIiwiRXh0ZW5kZWRMSVNTIiwic2NyaXB0IiwiUkVTU09VUkNFUyIsIktub3duVGFncyIsIl9jZGlyIiwiU1ciLCJzd19wYXRoIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic2NvcGUiLCJlcnJvciIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiYnJ5dGhvbiIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtdXRhdGlvbiIsImFkZGl0aW9uIiwiYWRkZWROb2RlcyIsImFkZFRhZyIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwidGFnIiwiaW1wb3J0Q29tcG9uZW50IiwiY2RpciIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwiY19qcyIsImtsYXNzIiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwib2xkcmVxIiwicmVxdWlyZSIsInN0YXJ0c1dpdGgiLCJmaWxlbmFtZSIsInNsaWNlIiwiZGVmYXVsdCIsIkxJU1NBdXRvX0NvbnRlbnRHZW5lcmF0b3IiLCJfZmV0Y2hUZXh0IiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImFuc3dlciIsInRleHQiLCJfaW1wb3J0IiwibG9nIiwiY29udmVydGVyIiwiZW5jb2RlSFRNTCIsInRleHRDb250ZW50IiwibWF0Y2giLCJjc3NfYXR0cnMiLCJnZXRBdHRyaWJ1dGVOYW1lcyIsImNzc19hdHRyIiwic2V0UHJvcGVydHkiLCJpbXBvcnRDb21wb25lbnRzIiwiY29tcG9uZW50cyIsInJlc3VsdHMiLCJicnlfd3JhcHBlciIsImNvbXBvX2RpciIsImNvZGUiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsImlkeCIsInByb21pc2VzIiwiYWxsIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImN1cnNvciIsIl9fcHJvdG9fXyIsImVuZHNXaXRoIiwiQ0FOX0hBVkVfU0hBRE9XIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsImkiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwiZ2xvYmFsVGhpcyJdLCJzb3VyY2VSb290IjoiIn0=