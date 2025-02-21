/******/ var __webpack_modules__ = ({

/***/ "./V3/index.ts":
/*!*********************!*\
  !*** ./V3/index.ts ***!
  \*********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src */ "./V3/src/index.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src__WEBPACK_IMPORTED_MODULE_0__]);
src__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (src__WEBPACK_IMPORTED_MODULE_0__["default"]);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/src/ContentGenerators/AutoContentGenerator.ts":
/*!**********************************************************!*\
  !*** ./V3/src/ContentGenerators/AutoContentGenerator.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AutoContentGenerator)
/* harmony export */ });
/* harmony import */ var _ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContentGenerator */ "./V3/src/ContentGenerators/ContentGenerator.ts");
/* harmony import */ var src_utils_encode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/utils/encode */ "./V3/src/utils/encode.ts");


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
                return (0,src_utils_encode__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
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

/***/ "./V3/src/ContentGenerators/ContentGenerator.ts":
/*!******************************************************!*\
  !*** ./V3/src/ContentGenerators/ContentGenerator.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContentGenerator)
/* harmony export */ });
/* harmony import */ var src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/utils/network/ressource */ "./V3/src/utils/network/ressource.ts");
/* harmony import */ var src_utils_parsers_template__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/utils/parsers/template */ "./V3/src/utils/parsers/template.ts");
/* harmony import */ var src_utils_parsers_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/utils/parsers/style */ "./V3/src/utils/parsers/style.ts");
/* harmony import */ var src_utils_DOM_isDOMContentLoaded__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/utils/DOM/isDOMContentLoaded */ "./V3/src/utils/DOM/isDOMContentLoaded.ts");
/* harmony import */ var src_utils_DOM_whenDOMContentLoaded__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/utils/DOM/whenDOMContentLoaded */ "./V3/src/utils/DOM/whenDOMContentLoaded.ts");





const sharedCSS = new CSSStyleSheet();
//const sharedCSS = getSharedCSS(); // from LISSHost...
class ContentGenerator {
    data;
    constructor({ html, css = [] } = {}){
        const isReady = (0,src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(html) && (0,src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.isRessourceReady)(css) && (0,src_utils_DOM_isDOMContentLoaded__WEBPACK_IMPORTED_MODULE_3__["default"])();
        if (isReady) this.prepare(html, css);
        const whenReady = Promise.all([
            (0,src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(html),
            (0,src_utils_network_ressource__WEBPACK_IMPORTED_MODULE_0__.waitRessource)(css),
            (0,src_utils_DOM_whenDOMContentLoaded__WEBPACK_IMPORTED_MODULE_4__["default"])()
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
        this.template = (0,src_utils_parsers_template__WEBPACK_IMPORTED_MODULE_1__["default"])(html);
    }
    prepareStyle(css) {
        if (!Array.isArray(css)) css = [
            css
        ];
        this.stylesheets = css.map((e)=>(0,src_utils_parsers_style__WEBPACK_IMPORTED_MODULE_2__["default"])(e));
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

/***/ "./V3/src/LISS.ts":
/*!************************!*\
  !*** ./V3/src/LISS.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ILISS: () => (/* binding */ ILISS),
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/ContentGenerators/ContentGenerator */ "./V3/src/ContentGenerators/ContentGenerator.ts");
/* harmony import */ var src_LISSClasses_LISSFull__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/LISSClasses/LISSFull */ "./V3/src/LISSClasses/LISSFull.ts");


//  builder
function LISS(opts = {}) {
    const content_generator = opts.content_generator ?? src_ContentGenerators_ContentGenerator__WEBPACK_IMPORTED_MODULE_0__["default"];
    // @ts-ignore
    const generator = new content_generator(opts);
    return class _LISS extends src_LISSClasses_LISSFull__WEBPACK_IMPORTED_MODULE_1__["default"] {
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

/***/ "./V3/src/LISSClasses/LISSBase.ts":
/*!****************************************!*\
  !*** ./V3/src/LISSClasses/LISSBase.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSBase)
/* harmony export */ });
class LISSBase extends HTMLElement {
    static SHADOW_MODE = null;
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

/***/ "./V3/src/LISSClasses/LISSFull.ts":
/*!****************************************!*\
  !*** ./V3/src/LISSClasses/LISSFull.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _LISSSignal_ts__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _LISSSignal_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSSignal.ts */ "./V3/src/LISSClasses/LISSSignal.ts");



/***/ }),

/***/ "./V3/src/LISSClasses/LISSSignal.ts":
/*!******************************************!*\
  !*** ./V3/src/LISSClasses/LISSSignal.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSSignal)
/* harmony export */ });
/* harmony import */ var src_signals_Signal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/signals/Signal */ "./V3/src/signals/Signal.ts");
/* harmony import */ var _LISSUpdate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSUpdate */ "./V3/src/LISSClasses/LISSUpdate.ts");
/* harmony import */ var src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/utils/DOM/getPropertyInitialValue */ "./V3/src/utils/DOM/getPropertyInitialValue.ts");



//TODO: getter ?
class LISSSignal extends _LISSUpdate__WEBPACK_IMPORTED_MODULE_1__["default"] {
    #signal = new src_signals_Signal__WEBPACK_IMPORTED_MODULE_0__.Signal();
    #callback = ()=>this.requestUpdate();
    constructor(value = null, signal = null){
        super();
        value ??= (0,src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "value", null);
        signal ??= (0,src_utils_DOM_getPropertyInitialValue__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "source", null);
        if (value !== null) this.#signal.value = value;
        if (signal !== null) this.#signal.source = signal;
        this.#signal.listen(this.#callback);
    }
    set source(source) {
        this.#signal.source = source;
    }
    set value(value) {
        this.#signal.value = value;
    }
}


/***/ }),

/***/ "./V3/src/LISSClasses/LISSUpdate.ts":
/*!******************************************!*\
  !*** ./V3/src/LISSClasses/LISSUpdate.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LISSUpdate)
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./V3/src/LISSClasses/LISSBase.ts");

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

/***/ "./V3/src/define/autoload.ts":
/*!***********************************!*\
  !*** ./V3/src/define/autoload.ts ***!
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
/* harmony import */ var src_define_define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/define/define */ "./V3/src/define/define.ts");
/* harmony import */ var src__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src */ "./V3/src/index.ts");
/* harmony import */ var src_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/ContentGenerators/AutoContentGenerator */ "./V3/src/ContentGenerators/AutoContentGenerator.ts");
/* harmony import */ var src_utils_DOM_isPageLoaded__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/utils/DOM/isPageLoaded */ "./V3/src/utils/DOM/isPageLoaded.ts");
/* harmony import */ var src_utils_DOM_whenPageLoaded__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/utils/DOM/whenPageLoaded */ "./V3/src/utils/DOM/whenPageLoaded.ts");
/* harmony import */ var src_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/utils/network/fetchText */ "./V3/src/utils/network/fetchText.ts");
/* harmony import */ var src_utils_execute__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/utils/execute */ "./V3/src/utils/execute/index.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src__WEBPACK_IMPORTED_MODULE_1__]);
src__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







const script = document.querySelector('script:is([liss-auto],[liss-cdir],[liss-sw])');
const LISS_MODE = script?.getAttribute('liss-mode') ?? null;
const DEFAULT_CDIR = script?.getAttribute('liss-cdir') ?? null;
// TODO: default ?
const SW_PATH = script?.getAttribute('liss-sw') ?? null;
if (LISS_MODE === "auto-load" && DEFAULT_CDIR !== null) {
    if (!(0,src_utils_DOM_isPageLoaded__WEBPACK_IMPORTED_MODULE_3__["default"])()) await (0,src_utils_DOM_whenPageLoaded__WEBPACK_IMPORTED_MODULE_4__["default"])();
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
        if (src_define_define__WEBPACK_IMPORTED_MODULE_0__.WaitingDefine.has(tagname) || customElements.get(tagname) !== undefined) return;
        loadComponent(tagname, {
            //brython,
            cdir
        });
    }
}
async function loadComponent(tagname, { cdir = DEFAULT_CDIR } = {}) {
    src_define_define__WEBPACK_IMPORTED_MODULE_0__.WaitingDefine.add(tagname);
    let true_tagdir = LISSContext?.override_tags?.[tagname] ?? tagname;
    const compo_dir = `${cdir}${true_tagdir}/`;
    const files = {};
    // strats : JS -> Bry -> HTML+CSS (cf script attr).
    files["js"] = await (0,src_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.js`, true);
    if (files["js"] === undefined) {
        // try/catch ?
        const promises = [
            (0,src_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.html`, true),
            (0,src_utils_network_fetchText__WEBPACK_IMPORTED_MODULE_5__["default"])(`${compo_dir}index.css`, true)
        ];
        [files["html"], files["css"]] = await Promise.all(promises);
    }
    return await defineWebComponent(tagname, files, compo_dir);
}
//TODO: rename from files ?
async function defineWebComponent(tagname, files, origin) {
    let klass;
    if ("js" in files) klass = (await (0,src_utils_execute__WEBPACK_IMPORTED_MODULE_6__["default"])(files["js"], "js", origin)).default;
    if (klass === undefined) klass = (0,src__WEBPACK_IMPORTED_MODULE_1__["default"])({
        content_generator: src_ContentGenerators_AutoContentGenerator__WEBPACK_IMPORTED_MODULE_2__["default"],
        ...files
    });
    (0,src_define_define__WEBPACK_IMPORTED_MODULE_0__["default"])(tagname, klass);
    return klass;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./V3/src/define/define.ts":
/*!*********************************!*\
  !*** ./V3/src/define/define.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WaitingDefine: () => (/* binding */ WaitingDefine),
/* harmony export */   "default": () => (/* binding */ define)
/* harmony export */ });
/* harmony import */ var _whenDefined__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./whenDefined */ "./V3/src/define/whenDefined.ts");
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");

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

src_LISS__WEBPACK_IMPORTED_MODULE_1__["default"].define = define;


/***/ }),

/***/ "./V3/src/define/index.ts":
/*!********************************!*\
  !*** ./V3/src/define/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   define: () => (/* reexport safe */ _define__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   isDefined: () => (/* reexport safe */ _isDefined__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   whenDefined: () => (/* reexport safe */ _whenDefined__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _define__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./define */ "./V3/src/define/define.ts");
/* harmony import */ var _isDefined__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isDefined */ "./V3/src/define/isDefined.ts");
/* harmony import */ var _whenDefined__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./whenDefined */ "./V3/src/define/whenDefined.ts");
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");




src_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].define = _define__WEBPACK_IMPORTED_MODULE_0__["default"];
src_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].isDefined = _isDefined__WEBPACK_IMPORTED_MODULE_1__["default"];
src_LISS__WEBPACK_IMPORTED_MODULE_3__["default"].whenDefined = _whenDefined__WEBPACK_IMPORTED_MODULE_2__["default"];



/***/ }),

/***/ "./V3/src/define/isDefined.ts":
/*!************************************!*\
  !*** ./V3/src/define/isDefined.ts ***!
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

/***/ "./V3/src/define/whenDefined.ts":
/*!**************************************!*\
  !*** ./V3/src/define/whenDefined.ts ***!
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

/***/ "./V3/src/index.ts":
/*!*************************!*\
  !*** ./V3/src/index.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");
/* harmony import */ var src_define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/define */ "./V3/src/define/index.ts");
/* harmony import */ var src_define_autoload__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/define/autoload */ "./V3/src/define/autoload.ts");
/* harmony import */ var src_utils_parsers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/utils/parsers */ "./V3/src/utils/parsers/index.ts");
/* harmony import */ var src_utils_network_require__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/utils/network/require */ "./V3/src/utils/network/require.ts");
/* harmony import */ var src_utils_tests_assertElement__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/utils/tests/assertElement */ "./V3/src/utils/tests/assertElement.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([src_define_autoload__WEBPACK_IMPORTED_MODULE_2__]);
src_define_autoload__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].VERSION = "V3";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"]);
// @ts-ignore
globalThis.LISS = src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"];

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./V3/src/signals/IndirectSignal.ts":
/*!******************************************!*\
  !*** ./V3/src/signals/IndirectSignal.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IndirectSignal)
/* harmony export */ });
/* harmony import */ var _ROSignal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ROSignal */ "./V3/src/signals/ROSignal.ts");

class IndirectSignal extends _ROSignal__WEBPACK_IMPORTED_MODULE_0__["default"] {
    #source = null;
    _valueRead = false;
    constructor(source = null){
        super();
        this.#source = source;
        this.#source?.listen(this._callback);
    }
    trigger() {
        // no needs to trigger if previous value wasn't read.
        if (!this._valueRead) return this;
        this._valueRead = false;
        super.trigger();
        return this;
    }
    _callback = ()=>this.trigger();
    get source() {
        return this.#source;
    }
    set source(source) {
        if (this.#source === source) return;
        if (this.#source !== null) this.#source.unlisten(this._callback);
        this.#source = source;
        if (this.#source !== null) this.#source.listen(this._callback);
        else this._callback();
    }
    ack() {
        this._valueRead = true;
    }
    get value() {
        this.ack();
        if (this.#source === null) return null;
        return this.#source.value;
    }
}


/***/ }),

/***/ "./V3/src/signals/ROSignal.ts":
/*!************************************!*\
  !*** ./V3/src/signals/ROSignal.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ROSignal)
/* harmony export */ });
/* harmony import */ var _SignalEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignalEvent */ "./V3/src/signals/SignalEvent.ts");

class ROSignal extends _SignalEvent__WEBPACK_IMPORTED_MODULE_0__["default"] {
    listen(callback) {
        super.listen(callback);
        callback(this); // initial callback (when signal Data)
        return this;
    }
}


/***/ }),

/***/ "./V3/src/signals/Signal.ts":
/*!**********************************!*\
  !*** ./V3/src/signals/Signal.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Signal: () => (/* binding */ Signal)
/* harmony export */ });
/* harmony import */ var _IndirectSignal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IndirectSignal */ "./V3/src/signals/IndirectSignal.ts");

class Signal extends _IndirectSignal__WEBPACK_IMPORTED_MODULE_0__["default"] {
    _value = null;
    constructor(value = null, source = null){
        super(source);
        this._value = value;
    }
    set source(source) {
        if (source !== null) this._value = null;
        super.source = source; // may trigger if source change
    }
    get value() {
        if (this.source !== null) return super.value;
        this.ack();
        return this._value;
    }
    set value(value) {
        const oldValue = this._value;
        this._value = value;
        if (this.source !== null) {
            this.source = null; // will trigger
            return;
        }
        // trigger only if value changed
        if (value !== oldValue) this.trigger();
        return;
    }
}


/***/ }),

/***/ "./V3/src/signals/SignalEvent.ts":
/*!***************************************!*\
  !*** ./V3/src/signals/SignalEvent.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SignalEvent)
/* harmony export */ });
class SignalEvent {
    #callbacks = new Set();
    listen(callback) {
        this.#callbacks.add(callback);
        return this;
    }
    unlisten(callback) {
        this.#callbacks.delete(callback);
        return this;
    }
    trigger() {
        for (let callback of this.#callbacks)callback(this);
        return this;
    }
}


/***/ }),

/***/ "./V3/src/utils/DOM/getPropertyInitialValue.ts":
/*!*****************************************************!*\
  !*** ./V3/src/utils/DOM/getPropertyInitialValue.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getPropertyInitialValue)
/* harmony export */ });
function getPropertyInitialValue(e, name, defaultValue) {
    if (!Object.hasOwn(e, name)) return defaultValue;
    const _ = e[name];
    delete e[name];
    return _;
}


/***/ }),

/***/ "./V3/src/utils/DOM/isDOMContentLoaded.ts":
/*!************************************************!*\
  !*** ./V3/src/utils/DOM/isDOMContentLoaded.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isDOMContentLoaded)
/* harmony export */ });
function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete";
}


/***/ }),

/***/ "./V3/src/utils/DOM/isPageLoaded.ts":
/*!******************************************!*\
  !*** ./V3/src/utils/DOM/isPageLoaded.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isPageLoaded)
/* harmony export */ });
function isPageLoaded() {
    return document.readyState === "complete";
}


/***/ }),

/***/ "./V3/src/utils/DOM/whenDOMContentLoaded.ts":
/*!**************************************************!*\
  !*** ./V3/src/utils/DOM/whenDOMContentLoaded.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ whenDOMContentLoaded)
/* harmony export */ });
/* harmony import */ var _isDOMContentLoaded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isDOMContentLoaded */ "./V3/src/utils/DOM/isDOMContentLoaded.ts");

async function whenDOMContentLoaded() {
    if ((0,_isDOMContentLoaded__WEBPACK_IMPORTED_MODULE_0__["default"])()) return;
    const { promise, resolve } = Promise.withResolvers();
    document.addEventListener('DOMContentLoaded', ()=>{
        resolve();
    }, true);
    await promise;
}


/***/ }),

/***/ "./V3/src/utils/DOM/whenPageLoaded.ts":
/*!********************************************!*\
  !*** ./V3/src/utils/DOM/whenPageLoaded.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ whenDOMContentLoaded)
/* harmony export */ });
/* harmony import */ var _isPageLoaded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isPageLoaded */ "./V3/src/utils/DOM/isPageLoaded.ts");

async function whenDOMContentLoaded() {
    if ((0,_isPageLoaded__WEBPACK_IMPORTED_MODULE_0__["default"])()) return;
    const { promise, resolve } = Promise.withResolvers();
    document.addEventListener('load', resolve, true);
    await promise;
}


/***/ }),

/***/ "./V3/src/utils/encode.ts":
/*!********************************!*\
  !*** ./V3/src/utils/encode.ts ***!
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

/***/ "./V3/src/utils/execute/index.ts":
/*!***************************************!*\
  !*** ./V3/src/utils/execute/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ execute)
/* harmony export */ });
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js */ "./V3/src/utils/execute/js.ts");

async function execute(code, type, origin) {
    if (type === "js") return await (0,_js__WEBPACK_IMPORTED_MODULE_0__["default"])(code, origin);
    throw new Error('');
}


/***/ }),

/***/ "./V3/src/utils/execute/js.ts":
/*!************************************!*\
  !*** ./V3/src/utils/execute/js.ts ***!
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

/***/ "./V3/src/utils/network/fetchText.ts":
/*!*******************************************!*\
  !*** ./V3/src/utils/network/fetchText.ts ***!
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

/***/ "./V3/src/utils/network/require.ts":
/*!*****************************************!*\
  !*** ./V3/src/utils/network/require.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fetchText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetchText */ "./V3/src/utils/network/fetchText.ts");

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

/***/ "./V3/src/utils/network/ressource.ts":
/*!*******************************************!*\
  !*** ./V3/src/utils/network/ressource.ts ***!
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

/***/ "./V3/src/utils/parsers/html.ts":
/*!**************************************!*\
  !*** ./V3/src/utils/parsers/html.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ html)
/* harmony export */ });
/* harmony import */ var _isTemplateString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isTemplateString */ "./V3/src/utils/parsers/isTemplateString.ts");

const template = document.createElement("template");
const df = template.content;
function html(...raw) {
    let elem = raw[0];
    if ((0,_isTemplateString__WEBPACK_IMPORTED_MODULE_0__["default"])(raw)) {
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

/***/ "./V3/src/utils/parsers/index.ts":
/*!***************************************!*\
  !*** ./V3/src/utils/parsers/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   style: () => (/* reexport safe */ _style__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   template: () => (/* reexport safe */ _template__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./html */ "./V3/src/utils/parsers/html.ts");
/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./template */ "./V3/src/utils/parsers/template.ts");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style */ "./V3/src/utils/parsers/style.ts");




src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].style = _style__WEBPACK_IMPORTED_MODULE_3__["default"];
src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].template = _template__WEBPACK_IMPORTED_MODULE_2__["default"];
src_LISS__WEBPACK_IMPORTED_MODULE_0__["default"].html = _html__WEBPACK_IMPORTED_MODULE_1__["default"];



/***/ }),

/***/ "./V3/src/utils/parsers/isTemplateString.ts":
/*!**************************************************!*\
  !*** ./V3/src/utils/parsers/isTemplateString.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTemplateString)
/* harmony export */ });
function isTemplateString(raw) {
    return Array.isArray(raw[0]);
}


/***/ }),

/***/ "./V3/src/utils/parsers/style.ts":
/*!***************************************!*\
  !*** ./V3/src/utils/parsers/style.ts ***!
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

/***/ "./V3/src/utils/parsers/template.ts":
/*!******************************************!*\
  !*** ./V3/src/utils/parsers/template.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ template)
/* harmony export */ });
/* harmony import */ var _isTemplateString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isTemplateString */ "./V3/src/utils/parsers/isTemplateString.ts");

function template(...raw) {
    let elem = raw[0];
    if ((0,_isTemplateString__WEBPACK_IMPORTED_MODULE_0__["default"])(raw)) {
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

/***/ "./V3/src/utils/tests/assertElement.ts":
/*!*********************************************!*\
  !*** ./V3/src/utils/tests/assertElement.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ assertElement)
/* harmony export */ });
/* harmony import */ var src_define_whenDefined__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/define/whenDefined */ "./V3/src/define/whenDefined.ts");
/* harmony import */ var src_LISS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/LISS */ "./V3/src/LISS.ts");

function waitFrame() {
    const { promise, resolve } = Promise.withResolvers();
    requestAnimationFrame(()=>resolve());
    return promise;
}
async function assertElement(tagname, opts = {}) {
    const shadow_html = opts.shadow_html ?? null;
    const css = opts.css ?? {};
    await (0,src_define_whenDefined__WEBPACK_IMPORTED_MODULE_0__["default"])(tagname);
    //for(let i = 0; i < 1; ++i)
    //    await waitFrame();
    const elem = document.querySelector(tagname);
    if (elem === null) throw new Error("Component not found");
    //TODO: await LISS.whenInitialized(elem); ?
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

src_LISS__WEBPACK_IMPORTED_MODULE_1__["default"].assertElement = assertElement;


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
/******/ var __webpack_exports__ = __webpack_require__("./V3/index.ts");
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ var __webpack_exports__default = __webpack_exports__["default"];
/******/ export { __webpack_exports__default as default };
/******/ 

//# sourceMappingURL=index.js.map