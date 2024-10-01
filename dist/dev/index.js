/******/ var __webpack_modules__ = ({

/***/ "./src/LISSBase.ts":
/*!*************************!*\
  !*** ./src/LISSBase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CONTENT_FACTORY: () => (/* binding */ DEFAULT_CONTENT_FACTORY),
/* harmony export */   LISS: () => (/* binding */ LISS),
/* harmony export */   setCstrHost: () => (/* binding */ setCstrHost)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSHost */ "./src/LISSHost.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



let __cstr_host = null;
function setCstrHost(_) {
    __cstr_host = _;
}
function DEFAULT_CONTENT_FACTORY(content) {
    if (typeof content === "string") {
        content = content.trim();
        if (content.length === 0) content = undefined;
        if (content !== undefined) content = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.html)`${content}`;
    // TODO LISSAuto parser...
    // only if no JS...
    // tolerate non-opti (easier ?) or span[value] ?
    // => record element with target...
    // => clone(attrs, params) => for each span replace then clone.
    // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
    //let str = (content as string).replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match)??'')
    }
    if (content instanceof HTMLTemplateElement) content = content.content;
    return ()=>content?.cloneNode(true);
}
function LISS({ // JS Base
extends: _extends = Object, /* extends is a JS reserved keyword. */ params = {}, // non-generic
deps = [], // HTML Base
host = HTMLElement, observedAttributes = [], attrs = observedAttributes, // non-generic
content, content_factory: _content_factory = DEFAULT_CONTENT_FACTORY, css, shadow = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host) ? _types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.SEMIOPEN : _types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.NONE } = {}) {
    if (shadow !== _types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.OPEN && !(0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host)) throw new Error(`Host element ${(0,_utils__WEBPACK_IMPORTED_MODULE_2__._element2tagname)(host)} does not support ShadowRoot`);
    const all_deps = [
        ...deps
    ];
    let content_factory;
    // content processing
    if (content instanceof Promise || content instanceof Response) {
        let _content = content;
        content = null;
        all_deps.push((async ()=>{
            _content = await _content;
            if (_content instanceof Response) _content = await _content.text();
            LISSBase.LISSCfg.content_factory = _content_factory(_content);
        })());
    } else {
        content_factory = _content_factory(content);
    }
    // CSS processing
    let stylesheets = [];
    if (css !== undefined) {
        if (!Array.isArray(css)) // @ts-ignore : todo: LISSOpts => should not be a generic ?
        css = [
            css
        ];
        // @ts-ignore
        stylesheets = css.map((c, idx)=>{
            if (c instanceof Promise || c instanceof Response) {
                all_deps.push((async ()=>{
                    c = await c;
                    if (c instanceof Response) c = await c.text();
                    stylesheets[idx] = process_css(c);
                })());
                return null;
            }
            return process_css(c);
        });
    }
    class LISSBase extends _extends {
        constructor(...args){
            super(...args);
            // h4ck, okay because JS is monothreaded.
            if (__cstr_host === null) __cstr_host = new this.constructor.Host({}, this);
            this.#host = __cstr_host;
            __cstr_host = null;
        }
        #host;
        // LISS Configs
        static LISSCfg = {
            host,
            deps,
            attrs,
            params,
            content_factory,
            stylesheets,
            shadow
        };
        get state() {
            return this.#host.state;
        }
        get host() {
            return this.#host;
        }
        //TODO: get the real type ?
        get content() {
            return this.#host.content;
        }
        // attrs
        get attrs() {
            return this.#host.attrs;
        }
        setAttrDefault(attr, value) {
            return this.#host.setAttrDefault(attr, value);
        }
        onAttrChanged(_name, _oldValue, _newValue) {}
        // for vanilla compat.
        get observedAttributes() {
            return this.attrs;
        }
        attributeChangedCallback(...args) {
            this.onAttrChanged(...args);
        }
        // parameters
        get params() {
            return this.#host.params;
        }
        updateParams(params) {
            Object.assign(this.#host.params, params);
        }
        // DOM
        get isInDOM() {
            return this.#host.isConnected;
        }
        onDOMConnected() {
            this.connectedCallback();
        }
        onDOMDisconnected() {
            this.disconnectedCallback();
        }
        // for vanilla compat
        connectedCallback() {}
        disconnectedCallback() {}
        get isConnected() {
            return this.isInDOM;
        }
        static _Host;
        static get Host() {
            if (this._Host === undefined) this._Host = (0,_LISSHost__WEBPACK_IMPORTED_MODULE_1__.buildLISSHost)(this); //TODO: fix type error (why???)
            return this._Host;
        }
    }
    return LISSBase;
}
function process_css(css) {
    if (css instanceof CSSStyleSheet) return css;
    if (css instanceof HTMLStyleElement) return css.sheet;
    let style = new CSSStyleSheet();
    if (typeof css === "string") {
        style.replaceSync(css); // replace() if issues
        return style;
    }
    throw new Error("Should not occurs");
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
/* harmony export */   getSharedCSS: () => (/* binding */ getSharedCSS)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/state.ts");
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");




let id = 0;
const sharedCSS = new CSSStyleSheet();
function getSharedCSS() {
    return sharedCSS;
}
function buildLISSHost(Liss) {
    const { host, attrs, content_factory, stylesheets, shadow } = Liss.LISSCfg;
    // attrs proxy
    const GET = Symbol('get');
    const SET = Symbol('set');
    const properties = Object.fromEntries(attrs.map((n)=>[
            n,
            {
                enumerable: true,
                get: function() {
                    return this[GET](n);
                },
                set: function(value) {
                    return this[SET](n, value);
                }
            }
        ]));
    class Attributes {
        #data;
        #defaults;
        #setter;
        [GET](name) {
            return this.#data[name] ?? this.#defaults[name] ?? null;
        }
        [SET](name, value) {
            return this.#setter(name, value); // required to get a clean object when doing {...attrs}
        }
        constructor(data, defaults, setter){
            this.#data = data;
            this.#defaults = defaults;
            this.#setter = setter;
            Object.defineProperties(this, properties);
        }
    }
    const alreadyDeclaredCSS = new Set();
    const waitReady = new Promise(async (r)=>{
        await (0,_utils__WEBPACK_IMPORTED_MODULE_3__.waitDOMContentLoaded)();
        await Promise.all(Liss.LISSCfg.deps);
        isReady = true;
        r();
    });
    // No deps and DOM already loaded.
    let isReady = Liss.LISSCfg.deps.length == 0 && (0,_utils__WEBPACK_IMPORTED_MODULE_3__.isDOMContentLoaded)();
    const params = Liss.LISSCfg.params; //Object.assign({}, Liss.LISSCfg.params, _params);
    //
    const whenDepsResolved = Promise.all(Liss.LISSCfg.deps);
    let isDepsResolved = false;
    (async ()=>{
        await whenDepsResolved;
        isDepsResolved = true;
    })();
    class LISSHostBase extends host {
        // adopt state if already created.
        state = this.state ?? new _state__WEBPACK_IMPORTED_MODULE_1__.LISSState(this);
        // ============ DEPENDENCIES ==================================
        static whenDepsResolved = whenDepsResolved;
        static get isDepsResolved() {
            return isDepsResolved;
        }
        // ============ INITIALIZATION ==================================
        static Base = Liss;
        #base = null;
        get base() {
            return this.#base;
        }
        get isInitialized() {
            return this.#base !== null;
        }
        whenInitialized;
        #whenInitialized_resolver;
        initialize(params = {}) {
            if (this.isInitialized) throw new Error('Element already initialized!');
            if (!this.constructor.isDepsResolved) throw new Error("Dependencies hasn't been loaded !");
            Object.assign(this.#params, params);
            this.#base = this.init();
            if (this.isConnected) this.#base.onDOMConnected();
            return this.#base;
        }
        // =================================
        #params = params;
        get params() {
            return this.#params;
        }
        updateParams(params) {
            if (this.isInitialized) // @ts-ignore
            return this.base.updateParams(params);
            // wil be given to constructor...
            Object.assign(this.#params, params);
        }
        // ============== Attributes ===================
        #attrs_flag = false;
        #attributes = {};
        #attributesDefaults = {};
        #attrs = new Attributes(this.#attributes, this.#attributesDefaults, (name, value)=>{
            this.#attributes[name] = value;
            this.#attrs_flag = true; // do not trigger onAttrsChanged.
            if (value === null) this.removeAttribute(name);
            else this.setAttribute(name, value);
        });
        setAttrDefault(name, value) {
            if (value === null) delete this.#attributesDefaults[name];
            else this.#attributesDefaults[name] = value;
        }
        get attrs() {
            return this.#attrs;
        }
        // ============== Content ===================
        #content = null;
        get content() {
            return this.#content;
        }
        getPart(name) {
            return this.hasShadow ? this.#content?.querySelector(`::part(${name})`) : this.#content?.querySelector(`[part="${name}"]`);
        }
        getParts(name) {
            return this.hasShadow ? this.#content?.querySelectorAll(`::part(${name})`) : this.#content?.querySelectorAll(`[part="${name}"]`);
        }
        get hasShadow() {
            return shadow !== 'none';
        }
        /*** CSS ***/ get CSSSelector() {
            if (this.hasShadow || !this.hasAttribute("is")) return this.tagName;
            return `${this.tagName}[is="${this.getAttribute("is")}"]`;
        }
        // ============== Impl ===================
        constructor(params, base){
            super();
            Object.assign(this.#params, params);
            let { promise, resolve } = Promise.withResolvers();
            this.whenInitialized = promise;
            this.#whenInitialized_resolver = resolve;
            if (base !== undefined) {
                this.#base = base;
                this.init(); // call the resolver
            }
            if ("_whenUpgradedResolve" in this) this._whenUpgradedResolve();
        }
        // ====================== DOM ===========================		
        disconnectedCallback() {
            this.base.onDOMDisconnected();
        }
        connectedCallback() {
            // TODO: life cycle options
            if (this.isInitialized) {
                this.base.onDOMConnected();
                return;
            }
            // TODO: life cycle options
            if (this.state.isReady) {
                this.initialize(); // automatically calls onDOMConnected
                return;
            }
            (async ()=>{
                await this.state.isReady;
                if (!this.isInitialized) this.initialize();
            })();
        }
        get shadowRoot() {
            console.warn("called");
            if (shadow === _types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.SEMIOPEN) return null;
            return super.shadowRoot;
        }
        init() {
            customElements.upgrade(this);
            //TODO: wait parents/children depending on option...
            // shadow
            this.#content = this;
            if (shadow !== 'none') {
                const mode = shadow === _types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.SEMIOPEN ? 'open' : shadow;
                this.#content = this.attachShadow({
                    mode
                });
            //@ts-ignore
            //this.#content.addEventListener('click', onClickEvent);
            //@ts-ignore
            //this.#content.addEventListener('dblclick', onClickEvent);
            }
            // attrs
            for (let obs of attrs)this.#attributes[obs] = this.getAttribute(obs);
            // css
            if (shadow !== 'none') this.#content.adoptedStyleSheets.push(sharedCSS);
            if (stylesheets.length) {
                if (shadow !== 'none') this.#content.adoptedStyleSheets.push(...stylesheets);
                else {
                    const cssselector = this.CSSSelector;
                    // if not yet inserted :
                    if (!alreadyDeclaredCSS.has(cssselector)) {
                        let style = document.createElement('style');
                        style.setAttribute('for', cssselector);
                        let html_stylesheets = "";
                        for (let style of stylesheets)for (let rule of style.cssRules)html_stylesheets += rule.cssText + '\n';
                        style.innerHTML = html_stylesheets.replace(':host', `:is(${cssselector})`);
                        document.head.append(style);
                        alreadyDeclaredCSS.add(cssselector);
                    }
                }
            }
            // content
            const content = content_factory(this.attrs, this.params, this);
            if (content !== undefined) this.#content.append(content);
            // build
            // h4ck, okay because JS is monothreaded.
            (0,_LISSBase__WEBPACK_IMPORTED_MODULE_2__.setCstrHost)(this);
            let obj = this.base === null ? new Liss() : this.base;
            this.#base = obj;
            // default slot
            if (this.hasShadow && this.#content.childNodes.length === 0) this.#content.append(document.createElement('slot'));
            this.#whenInitialized_resolver(this.base);
            return this.base;
        }
        // attrs
        static observedAttributes = attrs;
        attributeChangedCallback(name, oldValue, newValue) {
            if (this.#attrs_flag) {
                this.#attrs_flag = false;
                return;
            }
            this.#attributes[name] = newValue;
            if (!this.isInitialized) return;
            if (this.base.onAttrChanged(name, oldValue, newValue) === false) {
                this.#attrs[name] = oldValue; // revert the change.
            }
        }
    }
    ;
    return LISSHostBase;
}


/***/ }),

/***/ "./src/core/customRegistery.ts":
/*!*************************************!*\
  !*** ./src/core/customRegistery.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var customRegistery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");


_extends__WEBPACK_IMPORTED_MODULE_1__["default"].define = customRegistery__WEBPACK_IMPORTED_MODULE_0__.define;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenDefined = customRegistery__WEBPACK_IMPORTED_MODULE_0__.whenDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenAllDefined = customRegistery__WEBPACK_IMPORTED_MODULE_0__.whenAllDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].isDefined = customRegistery__WEBPACK_IMPORTED_MODULE_0__.isDefined;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getName = customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getHostCstr = customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getBaseCstr = customRegistery__WEBPACK_IMPORTED_MODULE_0__.getBaseCstr;


/***/ }),

/***/ "./src/core/state.ts":
/*!***************************!*\
  !*** ./src/core/state.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! state */ "./src/state.ts");
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");


_extends__WEBPACK_IMPORTED_MODULE_1__["default"].DEFINED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].DEFINED, _extends__WEBPACK_IMPORTED_MODULE_1__["default"].READY = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].READY;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].UPGRADED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].UPGRADED;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].INITIALIZED = _extends__WEBPACK_IMPORTED_MODULE_1__["default"].INITIALIZED;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].getState = state__WEBPACK_IMPORTED_MODULE_0__.getState;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].upgrade = state__WEBPACK_IMPORTED_MODULE_0__.upgrade;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].initialize = state__WEBPACK_IMPORTED_MODULE_0__.initialize;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].upgradeSync = state__WEBPACK_IMPORTED_MODULE_0__.upgradeSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].initializeSync = state__WEBPACK_IMPORTED_MODULE_0__.initializeSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenUpgraded = state__WEBPACK_IMPORTED_MODULE_0__.whenUpgraded;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].whenInitialized = state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized;


/***/ }),

/***/ "./src/customRegistery.ts":
/*!********************************!*\
  !*** ./src/customRegistery.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   define: () => (/* binding */ define),
/* harmony export */   getBaseCstr: () => (/* binding */ getBaseCstr),
/* harmony export */   getHostCstr: () => (/* binding */ getHostCstr),
/* harmony export */   getName: () => (/* binding */ getName),
/* harmony export */   isDefined: () => (/* binding */ isDefined),
/* harmony export */   whenAllDefined: () => (/* binding */ whenAllDefined),
/* harmony export */   whenDefined: () => (/* binding */ whenDefined)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

// Go to state DEFINED
function define(tagname, ComponentClass) {
    // could be better.
    if ("Base" in ComponentClass) {
        ComponentClass = ComponentClass.Base;
    }
    const Class = ComponentClass.LISSCfg.host;
    let htmltag = (0,_utils__WEBPACK_IMPORTED_MODULE_0__._element2tagname)(Class) ?? undefined;
    const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
    customElements.define(tagname, LISSclass, opts);
}
async function whenDefined(tagname) {
    return await customElements.whenDefined(tagname);
}
async function whenAllDefined(tagnames) {
    await Promise.all(tagnames.map((t)=>customElements.whenDefined(t)));
}
function isDefined(name) {
    return customElements.get(name) !== undefined;
}
function getName(element) {
    if ("Host" in element.constructor) element = element.constructor.Host;
    if ("Host" in element) element = element.Host;
    if ("Base" in element.constructor) element = element.constructor;
    if ("Base" in element) {
        const name = customElements.getName(element);
        if (name === null) throw new Error("not defined!");
        return name;
    }
    if (!(element instanceof Element)) throw new Error('???');
    const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name.includes('-')) throw new Error(`Element ${name} is not a WebComponent`);
    return name;
}
function getHostCstr(name) {
    return customElements.get(name);
}
function getBaseCstr(name) {
    return getHostCstr(name).Base;
}


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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");

class ILISS {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LISS);
function LISS(opts) {
    if (opts.extends !== undefined && "Host" in opts.extends) return _extends(opts);
    return (0,_LISSBase__WEBPACK_IMPORTED_MODULE_0__.LISS)(opts);
}
function _extends(opts) {
    if (opts.extends === undefined) throw new Error('please provide a LISSBase!');
    const base = opts.extends.LISSCfg;
    const host = opts.host ?? base.host;
    let deps = base.deps;
    if (opts.deps !== undefined) deps = [
        ...deps,
        ...opts.deps
    ];
    let attrs = base.attrs;
    if (opts.attrs !== undefined) attrs = [
        ...attrs,
        ...opts.attrs
    ];
    let params = base.params;
    if (opts.params !== undefined) params = Object.assign(params, opts.params);
    //TODO: issues with async content/CSS + some edge cases...
    let content_factory = base.content_factory;
    if (opts.content !== undefined) // @ts-ignore
    content_factory = opts.content_factory(opts.content);
    let stylesheets = base.stylesheets;
    if (opts.css !== undefined) // @ts-ignore
    stylesheets = [
        ...stylesheets,
        ...opts.css
    ];
    const shadow = opts.shadow ?? base.shadow;
    class ExtendedLISS extends opts.extends {
        static LISSCfg = {
            host,
            deps,
            attrs,
            params,
            content_factory,
            stylesheets,
            shadow
        };
    }
    return ExtendedLISS;
} /*
function extendsLISS<Extends extends Class,
	Host    extends HTMLElement,
	Attrs1   extends string,
	Attrs2   extends string,
	Params  extends Record<string,any>,
	T extends LISSReturnType<Extends, Host, Attrs1, Params>>(Liss: T,
		parameters: {
			shadow      ?: ShadowCfg,
			attributes  ?: readonly Attrs2[],
			dependencies?: readonly Promise<any>[]
		}) {

	const attributes   = [...Liss.Parameters.attributes  , ...parameters.attributes  ??[]];
	const dependencies = [...Liss.Parameters.dependencies, ...parameters.dependencies??[]];

	const params = Object.assign({}, Liss.Parameters, {
		attributes,
		dependencies
	});
	if( parameters.shadow !== undefined)
		params.shadow = parameters.shadow;

	// @ts-ignore : because TS stupid
	class ExtendedLISS extends Liss {
		constructor(...t: any[]) {
			// @ts-ignore : because TS stupid
			super(...t);
		}

		protected override get attrs() {
			return super.attrs as Record<Attrs2|Attrs1, string|null>;
		}

		static override Parameters = params;
	}

	return ExtendedLISS;
}
LISS.extendsLISS = extendsLISS;
*/ 


/***/ }),

/***/ "./src/helpers/LISSAuto.ts":
/*!*********************************!*\
  !*** ./src/helpers/LISSAuto.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LISS_Auto: () => (/* binding */ LISS_Auto)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _customRegistery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");




class LISS_Auto extends (0,_LISSBase__WEBPACK_IMPORTED_MODULE_1__.LISS)({
    attrs: [
        "src",
        "sw"
    ],
    shadow: _types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.NONE,
    css: `:host { display: none; }`
}) {
    #known_tag = new Set();
    #directory;
    #sw;
    constructor(){
        super();
        this.#sw = new Promise(async (resolve)=>{
            await navigator.serviceWorker.register(this.attrs.sw ?? "/sw.js", {
                scope: "/"
            });
            if (navigator.serviceWorker.controller) {
                resolve();
                return;
            }
            navigator.serviceWorker.addEventListener('controllerchange', ()=>{
                resolve();
            });
        });
        const src = this.attrs.src;
        if (src === null) throw new Error("src attribute is missing.");
        this.#directory = src[0] === '.' ? `${window.location.pathname}${src}` : src;
        new MutationObserver((mutations)=>{
            for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition instanceof Element) this.#addTag(addition.tagName);
        }).observe(document, {
            childList: true,
            subtree: true
        });
        for (let elem of document.querySelectorAll("*"))this.#addTag(elem.tagName);
    }
    resources() {
        return [
            "index.js",
            "index.html",
            "index.css"
        ];
    }
    defineWebComponent(tagname, files, opts) {
        const js = files["index.js"];
        const content = files["index.html"];
        let klass = null;
        if (js !== undefined) klass = js(opts);
        else if (content !== undefined) {
            opts.content_factory = (str)=>{
                const content = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.html)`${str}`;
                let spans = content.querySelectorAll('liss[value]');
                return (_a, _b, elem)=>{
                    // can be optimized...
                    for (let span of spans)span.textContent = elem.getAttribute(span.getAttribute('value'));
                    return content.cloneNode(true);
                };
            };
            klass = class WebComponent extends (0,_LISSBase__WEBPACK_IMPORTED_MODULE_1__.LISS)(opts) {
            };
        }
        if (klass === null) throw new Error(`Missing files for WebComponent ${tagname}.`);
        return (0,_customRegistery__WEBPACK_IMPORTED_MODULE_2__.define)(tagname, klass);
    }
    async #addTag(tagname) {
        tagname = tagname.toLowerCase();
        if (tagname === 'liss-auto' || tagname === 'bliss-auto' || !tagname.includes('-') || this.#known_tag.has(tagname)) return;
        this.#known_tag.add(tagname);
        await this.#sw; // ensure SW is installed.
        const filenames = this.resources();
        const resources = await Promise.all(filenames.map((file)=>file.endsWith('.js') ? _import(`${this.#directory}/${tagname}/${file}`, true) : _fetchText(`${this.#directory}/${tagname}/${file}`, true)));
        const files = {};
        for(let i = 0; i < filenames.length; ++i)if (resources[i] !== undefined) files[filenames[i]] = resources[i];
        const content = files["index.html"];
        const css = files["index.css"];
        const opts = {
            ...content !== undefined && {
                content
            },
            ...css !== undefined && {
                css
            }
        };
        return this.defineWebComponent(tagname, files, opts);
    }
}
// prevents multi-declarations...
if (customElements.get("liss-auto") === undefined) (0,_customRegistery__WEBPACK_IMPORTED_MODULE_2__.define)("liss-auto", LISS_Auto);
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
    return await response.text();
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


/***/ }),

/***/ "./src/helpers/LISSParams.ts":
/*!***********************************!*\
  !*** ./src/helpers/LISSParams.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LISSParams: () => (/* binding */ LISSParams)
/* harmony export */ });
/* harmony import */ var customRegistery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var LISSBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! types */ "./src/types.ts");



// Normally :
// Parent upgrade -> children upgrade -> children init -> manipulate parent host -> parent init.
// If deps -> need a tool for "waitChildrenInit" or "waitParentInit".
class LISSParams extends (0,LISSBase__WEBPACK_IMPORTED_MODULE_1__.LISS)({
    shadow: types__WEBPACK_IMPORTED_MODULE_2__.ShadowCfg.NONE,
    css: [
        `:host {display: none}`
    ],
    attrs: [
        "type"
    ]
}) {
    #name;
    #value;
    #parent;
    // dirty h4ck...
    constructor(p = {}, init = true){
        super();
        this.#name = this.host.getAttribute("name");
        this.#parent = this.host.parentElement;
        if (init) this.init();
    }
    init() {
        // TODO: observe content...
        this.onValueChanged(this.host.textContent);
    }
    //TODO
    get type() {
        return this.attrs.type ?? "JSON";
    }
    _parseContent(value) {
        const type = this.type;
        if (type === "JSON") return JSON.parse(value);
        if (type === "JS") {
            //TODO: may be improved ?
            const args = Object.keys(this.getArgs());
            this.#fct = new Function(...args, `return ${value}`);
            return this.call(...Object.values(args));
        }
        throw new Error("not implemented!");
    }
    #fct = null;
    call(...args) {
        return this.#fct(...args);
    }
    onValueChanged(value) {
        this.#value = this._parseContent(value);
        /*
        // do not updated if not in DOM.
        if( ! this.#parent?.isInDOM)
            return;*/ this.#parent.updateParams(this.#value);
    }
    getArgs() {
        return {};
    }
}
if (customElements.get("liss-params") === undefined) (0,customRegistery__WEBPACK_IMPORTED_MODULE_0__.define)("liss-params", LISSParams);


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
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./src/state.ts");
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! utils */ "./src/utils.ts");


async function liss(str, ...args) {
    const elem = (0,utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return await (0,_state__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
}
function lissSync(str, ...args) {
    const elem = (0,utils__WEBPACK_IMPORTED_MODULE_1__.html)(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
} /*
type BUILD_OPTIONS<T extends LISSBase> = Partial<{
    params    : Partial<T["params"]>,
    content	  : string|Node|readonly Node[],
    id 		    : string,
    classes	  : readonly string[],
    cssvars   : Readonly<Record<string, string>>,
    attrs 	  : Readonly<Record<string, string|boolean>>,
    data 	    : Readonly<Record<string, string|boolean>>,
    listeners : Readonly<Record<string, (ev: Event) => void>>
}> & ({
  initialize: false,
  parent: Element
}|{
  initialize?: true,
  parent?: Element
});

//async function build<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Promise<Components[T]>;

async function build<T extends LISSBase>(tagname: string, options?: BUILD_OPTIONS<T>): Promise<T>;
async function build<T extends LISSBase>(tagname: string, {
              params    = {},
              initialize= true,
              content   = [],
              parent    = undefined,
              id 		  = undefined,
              classes   = [],
              cssvars   = {},
              attrs     = {},
              data 	  = {},
              listeners = {}
              }: BUILD_OPTIONS<T> = {}): Promise<T> {

  if( ! initialize && parent === null)
    throw new Error("A parent must be given if initialize is false");

  let CustomClass = await customElements.whenDefined(tagname);
  let elem = new CustomClass(params) as LISSHost<T>;

  // Fix issue #2
  if( elem.tagName.toLowerCase() !== tagname )
  elem.setAttribute("is", tagname);

  if( id !== undefined )
  elem.id = id;

  if( classes.length > 0)
  elem.classList.add(...classes);

  for(let name in cssvars)
  elem.style.setProperty(`--${name}`, cssvars[name]);

  for(let name in attrs) {

  let value = attrs[name];
  if( typeof value === "boolean")
  elem.toggleAttribute(name, value);
  else
  elem.setAttribute(name, value);
  }

  for(let name in data) {

  let value = data[name];
  if( value === false)
  delete elem.dataset[name];
  else if(value === true)
  elem.dataset[name] = "";
  else
  elem.dataset[name] = value;
  }

  if( ! Array.isArray(content) )
  content = [content as any];
  elem.replaceChildren(...content);

  for(let name in listeners)
  elem.addEventListener(name, listeners[name]);

  if( parent !== undefined )
  parent.append(elem);

  if( ! elem.isInit && initialize )
  return await LISS.initialize(elem);

  return await LISS.getLISS(elem);
}
LISS.build = build;


function buildSync<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Components[T];
function buildSync<T extends LISSBase<any,any,any,any>>(tagname: string, options?: BUILD_OPTIONS<T>): T;
function buildSync<T extends LISSBase<any,any,any,any>>(tagname: string, {
params    = {},
initialize= true,
content   = [],
parent    = undefined,
id 		  = undefined,
classes   = [],
cssvars   = {},
attrs     = {},
data 	  = {},
listeners = {}
}: BUILD_OPTIONS<T> = {}): T {

if( ! initialize && parent === null)
throw new Error("A parent must be given if initialize is false");

let CustomClass = customElements.get(tagname);
if(CustomClass === undefined)
throw new Error(`${tagname} not defined`);
let elem = new CustomClass(params) as LISSHost<T>;

//TODO: factorize...

// Fix issue #2
if( elem.tagName.toLowerCase() !== tagname )
elem.setAttribute("is", tagname);

if( id !== undefined )
elem.id = id;

if( classes.length > 0)
elem.classList.add(...classes);

for(let name in cssvars)
elem.style.setProperty(`--${name}`, cssvars[name]);

for(let name in attrs) {

let value = attrs[name];
if( typeof value === "boolean")
elem.toggleAttribute(name, value);
else
elem.setAttribute(name, value);
}

for(let name in data) {

let value = data[name];
if( value === false)
delete elem.dataset[name];
else if(value === true)
elem.dataset[name] = "";
else
elem.dataset[name] = value;
}

if( ! Array.isArray(content) )
content = [content as any];
elem.replaceChildren(...content);

for(let name in listeners)
elem.addEventListener(name, listeners[name]);

if( parent !== undefined )
parent.append(elem);

if( ! elem.isInit && initialize )
LISS.initializeSync(elem);

return LISS.getLISSSync(elem);
}
LISS.buildSync = buildSync;
*/ 


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
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./src/state.ts");
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");


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
    return await (0,_state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized)(element);
}
async function qsa(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const promises = new Array(elements.length);
    for (let element of elements)promises[idx++] = (0,_state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized)(element);
    return await Promise.all(promises);
}
async function qsc(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return await (0,_state__WEBPACK_IMPORTED_MODULE_0__.whenInitialized)(result);
}
function qsSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null) throw new Error(`Element ${selector} not found`);
    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(element);
}
function qsaSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const result = new Array(elements.length);
    for (let element of elements)result[idx++] = (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(element);
    return result;
}
function qscSync(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(result);
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
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qs = qs;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qso = qso;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qsa = qsa;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qsc = qsc;
// sync
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qsSync = qsSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qsaSync = qsaSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].qscSync = qscSync;
_extends__WEBPACK_IMPORTED_MODULE_1__["default"].closest = closest;


/***/ }),

/***/ "./src/state.ts":
/*!**********************!*\
  !*** ./src/state.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFINED: () => (/* binding */ DEFINED),
/* harmony export */   INITIALIZED: () => (/* binding */ INITIALIZED),
/* harmony export */   LISSState: () => (/* binding */ LISSState),
/* harmony export */   READY: () => (/* binding */ READY),
/* harmony export */   UPGRADED: () => (/* binding */ UPGRADED),
/* harmony export */   getState: () => (/* binding */ getState),
/* harmony export */   initialize: () => (/* binding */ initialize),
/* harmony export */   initializeSync: () => (/* binding */ initializeSync),
/* harmony export */   upgrade: () => (/* binding */ upgrade),
/* harmony export */   upgradeSync: () => (/* binding */ upgradeSync),
/* harmony export */   whenInitialized: () => (/* binding */ whenInitialized),
/* harmony export */   whenUpgraded: () => (/* binding */ whenUpgraded)
/* harmony export */ });
/* harmony import */ var _customRegistery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


var State;
(function(State) {
    State[State["NONE"] = 0] = "NONE";
    // class
    State[State["DEFINED"] = 1] = "DEFINED";
    State[State["READY"] = 2] = "READY";
    // instance
    State[State["UPGRADED"] = 4] = "UPGRADED";
    State[State["INITIALIZED"] = 8] = "INITIALIZED";
})(State || (State = {}));
const DEFINED = 1;
const READY = 2;
const UPGRADED = 4;
const INITIALIZED = 8;
class LISSState {
    #elem;
    // if null : class state, else instance state
    constructor(elem = null){
        this.#elem = elem;
    }
    static DEFINED = DEFINED;
    static READY = READY;
    static UPGRADED = UPGRADED;
    static INITIALIZED = INITIALIZED;
    is(state) {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        if (state & DEFINED && !this.isDefined) return false;
        if (state & READY && !this.isReady) return false;
        if (state & UPGRADED && !this.isUpgraded) return false;
        if (state & INITIALIZED && !this.isInitialized) return false;
        return true;
    }
    async when(state) {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        let promises = new Array();
        if (state & DEFINED) promises.push(this.whenDefined());
        if (state & READY) promises.push(this.whenReady());
        if (state & UPGRADED) promises.push(this.whenUpgraded());
        if (state & INITIALIZED) promises.push(this.whenInitialized());
        await Promise.all(promises);
    }
    // ================== DEFINED ==============================
    get isDefined() {
        if (this.#elem === null) throw new Error('not implemented');
        return customElements.get((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(this.#elem)) !== undefined;
    }
    async whenDefined() {
        if (this.#elem === null) throw new Error('not implemented');
        return await customElements.whenDefined((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(this.#elem));
    }
    // ================== READY ==============================
    get isReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const Host = (0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr)((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(elem));
        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.isDOMContentLoaded)()) return false;
        return Host.isDepsResolved;
    }
    async whenReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        const host = await this.whenDefined(); // could be ready before defined, but well...
        await _utils__WEBPACK_IMPORTED_MODULE_1__.whenDOMContentLoaded;
        await host.whenDepsResolved;
    }
    // ================== UPGRADED ==============================
    get isUpgraded() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const host = (0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr)((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(elem));
        return elem instanceof host;
    }
    async whenUpgraded() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        const host = await this.whenDefined();
        if (elem instanceof host) return elem;
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
    // ================== INITIALIZED ==============================
    get isInitialized() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        if (!this.isUpgraded) return false;
        return "isInitialized" in elem && elem.isInitialized;
    }
    async whenInitialized() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        const host = await this.whenUpgraded();
        await host.whenInitialized;
        return elem.base;
    }
    // ================== CONVERSIONS ==============================
    valueOf() {
        if (this.#elem === null) throw new Error("not supported yet");
        let state = 0;
        if (this.isDefined) state |= DEFINED;
        if (this.isReady) state |= READY;
        if (this.isUpgraded) state |= UPGRADED;
        if (this.isInitialized) state |= INITIALIZED;
        return state;
    }
    toString() {
        const state = this.valueOf();
        let is = new Array();
        if (state & DEFINED) is.push("DEFINED");
        if (state & READY) is.push("READY");
        if (state & UPGRADED) is.push("UPGRADED");
        if (state & INITIALIZED) is.push("INITIALIZED");
        return is.join('|');
    }
}
function getState(elem) {
    if ("state" in elem) return elem.state;
    return elem.state = new LISSState(elem);
}
// ================== State modifiers (move?) ==============================
// Go to state UPGRADED
async function upgrade(elem, strict = false) {
    const state = getState(elem);
    if (state.isUpgraded && strict) throw new Error(`Already upgraded!`);
    await state.whenDefined();
    return upgradeSync(elem);
}
function upgradeSync(elem, strict = false) {
    const state = getState(elem);
    if (state.isUpgraded && strict) throw new Error(`Already upgraded!`);
    if (!state.isDefined) throw new Error('Element not defined!');
    if (elem.ownerDocument !== document) document.adoptNode(elem);
    customElements.upgrade(elem);
    const Host = (0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getHostCstr)((0,_customRegistery__WEBPACK_IMPORTED_MODULE_0__.getName)(elem));
    if (!(elem instanceof Host)) throw new Error(`Element didn't upgrade!`);
    return elem;
}
// Go to state INITIALIZED
async function initialize(elem, strict = false) {
    const state = getState(elem);
    if (state.isInitialized) {
        if (strict === false) return elem.base;
        throw new Error(`Already initialized!`);
    }
    const host = await upgrade(elem);
    await state.whenReady();
    let params = typeof strict === "boolean" ? {} : strict;
    host.initialize(params);
    return host.base;
}
function initializeSync(elem, strict = false) {
    const state = getState(elem);
    if (state.isInitialized) {
        if (strict === false) return elem.base;
        throw new Error(`Already initialized!`);
    }
    const host = upgradeSync(elem);
    if (!state.isReady) throw new Error("Element not ready !");
    let params = typeof strict === "boolean" ? {} : strict;
    host.initialize(params);
    return host.base;
}
// ====================== external WHEN ======================================
async function whenUpgraded(elem, force = false, strict = false) {
    const state = getState(elem);
    if (force) return await upgrade(elem, strict);
    return await state.whenUpgraded();
}
async function whenInitialized(elem, force = false, strict = false) {
    const state = getState(elem);
    if (force) return await initialize(elem, strict);
    return await state.whenInitialized();
}


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LifeCycle: () => (/* binding */ LifeCycle),
/* harmony export */   ShadowCfg: () => (/* binding */ ShadowCfg)
/* harmony export */ });
var ShadowCfg;
(function(ShadowCfg) {
    ShadowCfg["NONE"] = "none";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
    ShadowCfg["SEMIOPEN"] = "semi-open";
})(ShadowCfg || (ShadowCfg = {}));
var LifeCycle;
(function(LifeCycle) {
    LifeCycle[LifeCycle["DEFAULT"] = 0] = "DEFAULT";
    // not implemented yet
    LifeCycle[LifeCycle["INIT_AFTER_CHILDREN"] = 2] = "INIT_AFTER_CHILDREN";
    LifeCycle[LifeCycle["INIT_AFTER_PARENT"] = 4] = "INIT_AFTER_PARENT";
    // quid params/attrs ?
    LifeCycle[LifeCycle["RECREATE_AFTER_CONNECTION"] = 8] = "RECREATE_AFTER_CONNECTION";
})(LifeCycle || (LifeCycle = {}));


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
/* harmony export */   waitDOMContentLoaded: () => (/* binding */ waitDOMContentLoaded),
/* harmony export */   whenDOMContentLoaded: () => (/* binding */ whenDOMContentLoaded)
/* harmony export */ });
// functions required by LISS.
// fix Array.isArray
// cf https://github.com/microsoft/TypeScript/issues/17002#issuecomment-2366749050
// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
const HTMLCLASS_REGEX = /HTML(\w+)Element/;
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
    if (Class === HTMLElement) return null;
    let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
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
const whenDOMContentLoaded = waitDOMContentLoaded();
async function waitDOMContentLoaded() {
    if (isDOMContentLoaded()) return;
    const { promise, resolve } = Promise.withResolvers();
    document.addEventListener('DOMContentLoaded', ()=>{
        resolve();
    }, true);
    await promise;
}
// moved here instead of build to prevent circular deps.
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
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomEvent2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_6__.CustomEvent2),
/* harmony export */   EventTarget2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_6__.EventTarget2),
/* harmony export */   LISSParams: () => (/* reexport safe */ _helpers_LISSParams__WEBPACK_IMPORTED_MODULE_7__.LISSParams),
/* harmony export */   WithEvents: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_6__.WithEvents),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   eventMatches: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_6__.eventMatches),
/* harmony export */   html: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_8__.html),
/* harmony export */   liss: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_5__.liss),
/* harmony export */   lissSync: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_5__.lissSync)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extends */ "./src/extends.ts");
/* harmony import */ var _core_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/state */ "./src/core/state.ts");
/* harmony import */ var _core_customRegistery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/customRegistery */ "./src/core/customRegistery.ts");
/* harmony import */ var _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/LISSAuto */ "./src/helpers/LISSAuto.ts");
/* harmony import */ var _helpers_querySelectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/querySelectors */ "./src/helpers/querySelectors.ts");
/* harmony import */ var _helpers_build__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers/build */ "./src/helpers/build.ts");
/* harmony import */ var _helpers_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/events */ "./src/helpers/events.ts");
/* harmony import */ var _helpers_LISSParams__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers/LISSParams */ "./src/helpers/LISSParams.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



//TODO: BLISS
//TODO: events.ts
//TODO: globalCSSRules






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_extends__WEBPACK_IMPORTED_MODULE_0__["default"]);

var __webpack_exports__CustomEvent2 = __webpack_exports__.CustomEvent2;
var __webpack_exports__EventTarget2 = __webpack_exports__.EventTarget2;
var __webpack_exports__LISSParams = __webpack_exports__.LISSParams;
var __webpack_exports__WithEvents = __webpack_exports__.WithEvents;
var __webpack_exports__default = __webpack_exports__["default"];
var __webpack_exports__eventMatches = __webpack_exports__.eventMatches;
var __webpack_exports__html = __webpack_exports__.html;
var __webpack_exports__liss = __webpack_exports__.liss;
var __webpack_exports__lissSync = __webpack_exports__.lissSync;
export { __webpack_exports__CustomEvent2 as CustomEvent2, __webpack_exports__EventTarget2 as EventTarget2, __webpack_exports__LISSParams as LISSParams, __webpack_exports__WithEvents as WithEvents, __webpack_exports__default as default, __webpack_exports__eventMatches as eventMatches, __webpack_exports__html as html, __webpack_exports__liss as liss, __webpack_exports__lissSync as lissSync };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU0sS0FBSyxLQUFLMFMsU0FBUzVTLE9BQU8sQ0FBQzZTLFVBQVUsQ0FBRUMsUUFBUSxLQUFLQyxLQUFLQyxTQUFTLEVBQ3RHLE9BQU9KLFNBQVM1UyxPQUFPLENBQUM2UyxVQUFVO0lBRXBDLE9BQU9ELFNBQVM1UyxPQUFPO0FBQzNCOzs7Ozs7O1NDNUdBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QjtBQUVQO0FBQ1U7QUFFaEMsYUFBYTtBQUViLGlCQUFpQjtBQUNqQixzQkFBc0I7QUFDTTtBQUNNO0FBRWE7QUFDdUM7QUFDdEM7QUFDbkI7QUFDN0IsaUVBQWVNLGdEQUFJQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY29yZS9jdXN0b21SZWdpc3RlcnkudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9jb3JlL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY3VzdG9tUmVnaXN0ZXJ5LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL0xJU1NQYXJhbXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL3F1ZXJ5U2VsZWN0b3JzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBDb250ZW50RmFjdG9yeSwgQ1NTX1NvdXJjZSwgSFRNTF9SZXNvdXJjZSwgSFRNTF9Tb3VyY2UsIExJU1NfT3B0cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IExJU1NTdGF0ZSB9IGZyb20gXCJzdGF0ZVwiO1xuXG5pbXBvcnQge1NoYWRvd0NmZ30gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNTaGFkb3dTdXBwb3J0ZWQsIGh0bWwgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBERUZBVUxUX0NPTlRFTlRfRkFDVE9SWShjb250ZW50PzogRXhjbHVkZTxIVE1MX1Jlc291cmNlLCBSZXNwb25zZT4pIHtcblxuXHRpZiggdHlwZW9mIGNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcblxuXHRcdGNvbnRlbnQgPSBjb250ZW50LnRyaW0oKTtcblx0XHRpZiggY29udGVudC5sZW5ndGggPT09IDAgKVxuXHRcdFx0Y29udGVudCA9IHVuZGVmaW5lZDtcblxuXHRcdGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHRjb250ZW50ID0gaHRtbGAke2NvbnRlbnR9YDtcblxuXHRcdC8vIFRPRE8gTElTU0F1dG8gcGFyc2VyLi4uXG5cdFx0Ly8gb25seSBpZiBubyBKUy4uLlxuXHRcdC8vIHRvbGVyYXRlIG5vbi1vcHRpIChlYXNpZXIgPykgb3Igc3Bhblt2YWx1ZV0gP1xuXHRcdFx0Ly8gPT4gcmVjb3JkIGVsZW1lbnQgd2l0aCB0YXJnZXQuLi5cblx0XHRcdC8vID0+IGNsb25lKGF0dHJzLCBwYXJhbXMpID0+IGZvciBlYWNoIHNwYW4gcmVwbGFjZSB0aGVuIGNsb25lLlxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHQvL2xldCBzdHIgPSAoY29udGVudCBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gdGhpcy5nZXRBdHRyaWJ1dGUobWF0Y2gpPz8nJylcblx0fVxuXG5cdGlmKCBjb250ZW50IGluc3RhbmNlb2YgSFRNTFRlbXBsYXRlRWxlbWVudClcblx0XHRjb250ZW50ID0gY29udGVudC5jb250ZW50O1xuXG5cdHJldHVybiAoKSA9PiBjb250ZW50Py5jbG9uZU5vZGUodHJ1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4oe1xuXG4gICAgLy8gSlMgQmFzZVxuICAgIGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0IGFzIHVua25vd24gYXMgRXh0ZW5kc0N0ciwgLyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG4gICAgcGFyYW1zICAgICAgICAgICAgPSB7fSAgICAgYXMgdW5rbm93biBhcyBQYXJhbXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBkZXBzICAgPSBbXSxcblxuICAgIC8vIEhUTUwgQmFzZVxuICAgIGhvc3QgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0b2JzZXJ2ZWRBdHRyaWJ1dGVzID0gW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cbiAgICBhdHRycyA9IG9ic2VydmVkQXR0cmlidXRlcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGNvbnRlbnQsXG5cdGNvbnRlbnRfZmFjdG9yeTogX2NvbnRlbnRfZmFjdG9yeSA9IERFRkFVTFRfQ09OVEVOVF9GQUNUT1JZLFxuICAgIGNzcyxcbiAgICBzaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSA/IFNoYWRvd0NmZy5TRU1JT1BFTiA6IFNoYWRvd0NmZy5OT05FXG59OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+ID0ge30pIHtcblxuICAgIGlmKCBzaGFkb3cgIT09IFNoYWRvd0NmZy5PUEVOICYmICEgaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgY29uc3QgYWxsX2RlcHMgPSBbLi4uZGVwc107XG5cblx0bGV0IGNvbnRlbnRfZmFjdG9yeTogQ29udGVudEZhY3Rvcnk8QXR0cnMsIFBhcmFtcz47XG5cbiAgICAvLyBjb250ZW50IHByb2Nlc3NpbmdcbiAgICBpZiggY29udGVudCBpbnN0YW5jZW9mIFByb21pc2UgfHwgY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkge1xuICAgICAgICBcblx0XHRsZXQgX2NvbnRlbnQ6IEhUTUxfU291cmNlfHVuZGVmaW5lZCA9IGNvbnRlbnQ7XG5cdFx0Y29udGVudCA9IG51bGwgYXMgdW5rbm93biBhcyBzdHJpbmc7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudDtcbiAgICAgICAgICAgIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG5cdFx0XHRcdF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuXG4gICAgICAgICAgICBMSVNTQmFzZS5MSVNTQ2ZnLmNvbnRlbnRfZmFjdG9yeSA9IF9jb250ZW50X2ZhY3RvcnkoX2NvbnRlbnQpO1xuICAgICAgICB9KSgpICk7XG5cbiAgICB9IGVsc2Uge1xuXHRcdGNvbnRlbnRfZmFjdG9yeSA9IF9jb250ZW50X2ZhY3RvcnkoY29udGVudCk7XG5cdH1cblxuXHQvLyBDU1MgcHJvY2Vzc2luZ1xuXHRsZXQgc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXSA9IFtdO1xuXHRpZiggY3NzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuXHRcdFx0Ly8gQHRzLWlnbm9yZSA6IHRvZG86IExJU1NPcHRzID0+IHNob3VsZCBub3QgYmUgYSBnZW5lcmljID9cblx0XHRcdGNzcyA9IFtjc3NdO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHN0eWxlc2hlZXRzID0gY3NzLm1hcCggKGM6IENTU19Tb3VyY2UsIGlkeDogbnVtYmVyKSA9PiB7XG5cblx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuXHRcdFx0XHRhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdFx0YyA9IGF3YWl0IGM7XG5cdFx0XHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG5cdFx0XHRcdFx0XHRjID0gYXdhaXQgYy50ZXh0KCk7XG5cblx0XHRcdFx0XHRzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cblx0XHRcdFx0fSkoKSk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvY2Vzc19jc3MoYyk7XG5cdFx0fSk7XG5cdH1cblxuXHR0eXBlIExJU1NIb3N0PFQ+ID0gYW55OyAvL1RPRE8uLi5cblx0dHlwZSBMSG9zdCA9IExJU1NIb3N0PExJU1NCYXNlPjsgLy88LSBjb25maWcgaW5zdGVhZCBvZiBMSVNTQmFzZSA/XG5cblx0Y2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBfZXh0ZW5kcyB7XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsIClcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KHt9LCB0aGlzKTtcblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogYW55OyAvLyBwcmV2ZW50cyBpc3N1ZSAjMS4uLlxuXG5cdFx0Ly8gTElTUyBDb25maWdzXG5cdFx0c3RhdGljIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5jb250ZW50ITtcblx0XHR9XG5cblx0XHQvLyBhdHRyc1xuXHRcdHByb3RlY3RlZCBnZXQgYXR0cnMoKTogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIHNldEF0dHJEZWZhdWx0KCBhdHRyOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnNldEF0dHJEZWZhdWx0KGF0dHIsIHZhbHVlKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uQXR0ckNoYW5nZWQoX25hbWU6IEF0dHJzLFxuXHRcdFx0X29sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRfbmV3VmFsdWU6IHN0cmluZyk6IHZvaWR8ZmFsc2Uge31cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cblx0XHRwcm90ZWN0ZWQgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IFtBdHRycywgc3RyaW5nLCBzdHJpbmddKSB7XG5cdFx0XHR0aGlzLm9uQXR0ckNoYW5nZWQoLi4uYXJncyk7XG5cdFx0fVxuXG5cdFx0Ly8gcGFyYW1ldGVyc1xuXHRcdHB1YmxpYyBnZXQgcGFyYW1zKCk6IFJlYWRvbmx5PFBhcmFtcz4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXM7XG5cdFx0fVxuXHRcdHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4pIHtcblx0XHRcdE9iamVjdC5hc3NpZ24oICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblxuXHRcdC8vIERPTVxuXHRcdHB1YmxpYyBnZXQgaXNJbkRPTSgpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuaXNDb25uZWN0ZWQ7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTUNvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NRGlzY29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaXNJbkRPTTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHN0YXRpYyBfSG9zdDogTElTU0hvc3Q8TElTU0Jhc2U+O1xuXG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QodGhpcyBhcyBhbnkpOyAvL1RPRE86IGZpeCB0eXBlIGVycm9yICh3aHk/Pz8pXG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gTElTU0Jhc2U7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY3NzKGNzczogc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudCkge1xuXG5cdGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG5cdFx0cmV0dXJuIGNzcztcblx0aWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG5cdFx0cmV0dXJuIGNzcy5zaGVldCE7XG5cblx0bGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0aWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0c3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuXHRcdHJldHVybiBzdHlsZTtcblx0fVxuXG5cdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJzXCIpO1xufSIsImltcG9ydCB7IFNoYWRvd0NmZywgdHlwZSBMSVNTX09wdHMsIHR5cGUgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgTElTU1N0YXRlIH0gZnJvbSBcIi4vc3RhdGVcIjtcbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IENvbXBvc2VDb25zdHJ1Y3RvciwgaXNET01Db250ZW50TG9hZGVkLCB3YWl0RE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCBpZCA9IDA7XG5cbnR5cGUgaW5mZXJMSVNTPFQ+ID0gVCBleHRlbmRzIExJU1NCYXNlQ3N0cjxpbmZlciBBLCBpbmZlciBCLCBpbmZlciBDLCBpbmZlciBEPiA/IFtBLEIsQyxEXSA6IG5ldmVyO1xuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZENTUygpIHtcblx0cmV0dXJuIHNoYXJlZENTUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XG4gICAgICAgICAgICAgICAgICAgICAgICBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihMaXNzOiBUKSB7XG5cdGNvbnN0IHtcblx0XHRob3N0LFxuXHRcdGF0dHJzLFxuXHRcdGNvbnRlbnRfZmFjdG9yeSxcblx0XHRzdHlsZXNoZWV0cyxcblx0XHRzaGFkb3csXG5cdH0gPSBMaXNzLkxJU1NDZmc7XG5cblx0dHlwZSBQID0gaW5mZXJMSVNTPFQ+O1xuXHQvL3R5cGUgRXh0ZW5kc0NzdHIgPSBQWzBdO1xuXHR0eXBlIFBhcmFtcyAgICAgID0gUFsxXTtcblx0dHlwZSBIb3N0Q3N0ciAgICA9IFBbMl07XG5cdHR5cGUgQXR0cnMgICAgICAgPSBQWzNdO1xuXG4gICAgdHlwZSBIb3N0ICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG4gICAgLy8gYXR0cnMgcHJveHlcblx0Y29uc3QgR0VUID0gU3ltYm9sKCdnZXQnKTtcblx0Y29uc3QgU0VUID0gU3ltYm9sKCdzZXQnKTtcblxuXHRjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmZyb21FbnRyaWVzKCBhdHRycy5tYXAobiA9PiBbbiwge1xuXG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCk6IHN0cmluZ3xudWxsICAgICAgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtHRVRdKG4pOyB9LFxuXHRcdHNldDogZnVuY3Rpb24odmFsdWU6IHN0cmluZ3xudWxsKSB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW1NFVF0obiwgdmFsdWUpOyB9XG5cdH1dKSApO1xuXG5cdGNsYXNzIEF0dHJpYnV0ZXMge1xuICAgICAgICBbeDogc3RyaW5nXTogc3RyaW5nfG51bGw7XG5cbiAgICAgICAgI2RhdGEgICAgIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNkZWZhdWx0cyA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjc2V0dGVyICAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZDtcblxuICAgICAgICBbR0VUXShuYW1lOiBBdHRycykge1xuICAgICAgICBcdHJldHVybiB0aGlzLiNkYXRhW25hbWVdID8/IHRoaXMuI2RlZmF1bHRzW25hbWVdID8/IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIFtTRVRdKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpe1xuICAgICAgICBcdHJldHVybiB0aGlzLiNzZXR0ZXIobmFtZSwgdmFsdWUpOyAvLyByZXF1aXJlZCB0byBnZXQgYSBjbGVhbiBvYmplY3Qgd2hlbiBkb2luZyB7Li4uYXR0cnN9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihkYXRhICAgIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG5cdFx0XHRcdFx0ZGVmYXVsdHM6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuICAgICAgICBcdFx0XHRzZXR0ZXIgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQpIHtcblxuICAgICAgICBcdHRoaXMuI2RhdGEgICAgID0gZGF0YTtcblx0XHRcdHRoaXMuI2RlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgICAgIFx0dGhpcy4jc2V0dGVyID0gc2V0dGVyO1xuXG4gICAgICAgIFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblx0fVxuXG5cdGNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcblxuICAgIGNvbnN0IHdhaXRSZWFkeSA9IG5ldyBQcm9taXNlPHZvaWQ+KCBhc3luYyAocikgPT4ge1xuXG4gICAgICAgIGF3YWl0IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKExpc3MuTElTU0NmZy5kZXBzKTtcblxuICAgICAgICBpc1JlYWR5ID0gdHJ1ZTtcblxuICAgICAgICByKCk7XG4gICAgfSk7XG5cbiAgICAvLyBObyBkZXBzIGFuZCBET00gYWxyZWFkeSBsb2FkZWQuXG4gICAgbGV0IGlzUmVhZHkgPSBMaXNzLkxJU1NDZmcuZGVwcy5sZW5ndGggPT0gMCAmJiBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcblxuXHRjb25zdCBwYXJhbXMgPSBMaXNzLkxJU1NDZmcucGFyYW1zOyAvL09iamVjdC5hc3NpZ24oe30sIExpc3MuTElTU0NmZy5wYXJhbXMsIF9wYXJhbXMpO1xuXG5cdC8vXG5cblx0Y29uc3Qgd2hlbkRlcHNSZXNvbHZlZCA9IFByb21pc2UuYWxsKExpc3MuTElTU0NmZy5kZXBzKTtcblx0bGV0IGlzRGVwc1Jlc29sdmVkID0gZmFsc2U7XG5cdCggYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IHdoZW5EZXBzUmVzb2x2ZWQ7XG5cdFx0aXNEZXBzUmVzb2x2ZWQgPSB0cnVlO1xuXHR9KSgpO1xuXG5cdGNsYXNzIExJU1NIb3N0QmFzZSBleHRlbmRzIChob3N0IGFzIG5ldyAoKSA9PiBIVE1MRWxlbWVudCkge1xuXG5cdFx0Ly8gYWRvcHQgc3RhdGUgaWYgYWxyZWFkeSBjcmVhdGVkLlxuXHRcdHJlYWRvbmx5IHN0YXRlID0gKHRoaXMgYXMgYW55KS5zdGF0ZSA/PyBuZXcgTElTU1N0YXRlKHRoaXMpO1xuXG5cdFx0Ly8gPT09PT09PT09PT09IERFUEVOREVOQ0lFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IHdoZW5EZXBzUmVzb2x2ZWQ7XG5cdFx0c3RhdGljIGdldCBpc0RlcHNSZXNvbHZlZCgpIHtcblx0XHRcdHJldHVybiBpc0RlcHNSZXNvbHZlZDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHN0YXRpYyBCYXNlID0gTGlzcztcblxuXHRcdCNiYXNlOiBhbnl8bnVsbCA9IG51bGw7XG5cdFx0Z2V0IGJhc2UoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZTtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNiYXNlICE9PSBudWxsO1xuXHRcdH1cblx0XHRyZWFkb25seSB3aGVuSW5pdGlhbGl6ZWQ6IFByb21pc2U8SW5zdGFuY2VUeXBlPFQ+Pjtcblx0XHQjd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyO1xuXG5cdFx0aW5pdGlhbGl6ZShwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPiA9IHt9KSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgYWxyZWFkeSBpbml0aWFsaXplZCEnKTtcbiAgICAgICAgICAgIGlmKCAhICggdGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzRGVwc1Jlc29sdmVkIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHR0aGlzLiNiYXNlID0gdGhpcy5pbml0KCk7XG5cblx0XHRcdGlmKCB0aGlzLmlzQ29ubmVjdGVkIClcblx0XHRcdFx0KHRoaXMuI2Jhc2UgYXMgYW55KS5vbkRPTUNvbm5lY3RlZCgpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRyZWFkb25seSAjcGFyYW1zOiBQYXJhbXMgPSBwYXJhbXM7XG5cblx0XHRnZXQgcGFyYW1zKCk6IFBhcmFtcyB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jcGFyYW1zO1xuXHRcdH1cblxuICAgICAgICBwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxMSVNTX09wdHNbXCJwYXJhbXNcIl0+KSB7XG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiB0aGlzLmJhc2UhLnVwZGF0ZVBhcmFtcyhwYXJhbXMpO1xuXG4gICAgICAgICAgICAvLyB3aWwgYmUgZ2l2ZW4gdG8gY29uc3RydWN0b3IuLi5cblx0XHRcdE9iamVjdC5hc3NpZ24oIHRoaXMuI3BhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXHRcdC8vID09PT09PT09PT09PT09IEF0dHJpYnV0ZXMgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2F0dHJzX2ZsYWcgPSBmYWxzZTtcblxuXHRcdCNhdHRyaWJ1dGVzICAgICAgICAgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cmlidXRlc0RlZmF1bHRzID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJzID0gbmV3IEF0dHJpYnV0ZXMoXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzLFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzLFxuXHRcdFx0KG5hbWU6IEF0dHJzLCB2YWx1ZTpzdHJpbmd8bnVsbCkgPT4ge1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gdHJ1ZTsgLy8gZG8gbm90IHRyaWdnZXIgb25BdHRyc0NoYW5nZWQuXG5cdFx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHQpIGFzIHVua25vd24gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cblx0XHRzZXRBdHRyRGVmYXVsdChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV07XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdGdldCBhdHRycygpOiBSZWFkb25seTxSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPj4ge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jYXR0cnM7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290fG51bGwgPSBudWxsO1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldCBoYXNTaGFkb3coKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gc2hhZG93ICE9PSAnbm9uZSc7XG5cdFx0fVxuXG5cdFx0LyoqKiBDU1MgKioqL1xuXG5cdFx0Z2V0IENTU1NlbGVjdG9yKCkge1xuXG5cdFx0XHRpZih0aGlzLmhhc1NoYWRvdyB8fCAhIHRoaXMuaGFzQXR0cmlidXRlKFwiaXNcIikgKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdOYW1lO1xuXG5cdFx0XHRyZXR1cm4gYCR7dGhpcy50YWdOYW1lfVtpcz1cIiR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJpc1wiKX1cIl1gO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IEltcGwgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Y29uc3RydWN0b3IocGFyYW1zOiB7fSwgYmFzZT86IEluc3RhbmNlVHlwZTxUPikge1xuXHRcdFx0c3VwZXIoKTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLiNwYXJhbXMsIHBhcmFtcyk7XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRpZiggYmFzZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuI2Jhc2UgPSBiYXNlO1xuXHRcdFx0XHR0aGlzLmluaXQoKTsgLy8gY2FsbCB0aGUgcmVzb2x2ZXJcblx0XHRcdH1cblxuXHRcdFx0aWYoIFwiX3doZW5VcGdyYWRlZFJlc29sdmVcIiBpbiB0aGlzKVxuXHRcdFx0XHQodGhpcy5fd2hlblVwZ3JhZGVkUmVzb2x2ZSBhcyBhbnkpKCk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PSBET00gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHRcdFxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHQodGhpcy5iYXNlISBhcyBhbnkpLm9uRE9NRGlzY29ubmVjdGVkKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApIHtcblx0XHRcdFx0dGhpcy5iYXNlIS5vbkRPTUNvbm5lY3RlZCgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuc3RhdGUuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCB0aGlzLnN0YXRlLmlzUmVhZHk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRvdmVycmlkZSBnZXQgc2hhZG93Um9vdCgpIHtcblx0XHRcdGNvbnNvbGUud2FybihcImNhbGxlZFwiKTtcblx0XHRcdGlmKHNoYWRvdyA9PT0gU2hhZG93Q2ZnLlNFTUlPUEVOKVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdHJldHVybiBzdXBlci5zaGFkb3dSb290O1xuXHRcdH1cblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblx0XHRcdFxuXHRcdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzKTtcblxuICAgICAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLlxuXHRcdFx0XG5cdFx0XHQvLyBzaGFkb3dcblx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9zdDtcblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJykge1xuXHRcdFx0XHRjb25zdCBtb2RlID0gc2hhZG93ID09PSBTaGFkb3dDZmcuU0VNSU9QRU4gPyAnb3BlbicgOiBzaGFkb3c7XG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZX0pO1xuXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYXR0cnNcblx0XHRcdGZvcihsZXQgb2JzIG9mIGF0dHJzISlcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tvYnMgYXMgQXR0cnNdID0gdGhpcy5nZXRBdHRyaWJ1dGUob2JzKTtcblxuXHRcdFx0Ly8gY3NzXG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUyk7XG5cdFx0XHRpZiggc3R5bGVzaGVldHMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaCguLi5zdHlsZXNoZWV0cyk7XG5cdFx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdFx0Y29uc3QgY3Nzc2VsZWN0b3IgPSB0aGlzLkNTU1NlbGVjdG9yO1xuXG5cdFx0XHRcdFx0Ly8gaWYgbm90IHlldCBpbnNlcnRlZCA6XG5cdFx0XHRcdFx0aWYoICEgYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cblx0XHRcdFx0XHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG5cdFx0XHRcdFx0XHRsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcblx0XHRcdFx0XHRcdFx0XHRodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuXG5cdFx0XHRcdFx0XHRhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY29udGVudFxuXHRcdFx0Y29uc3QgY29udGVudCA9IGNvbnRlbnRfZmFjdG9yeSh0aGlzLmF0dHJzLCB0aGlzLnBhcmFtcywgdGhpcyk7XG5cdFx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggY29udGVudCApO1xuXG5cdCAgICBcdC8vIGJ1aWxkXG5cblx0ICAgIFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHQgICAgXHRsZXQgb2JqID0gdGhpcy5iYXNlID09PSBudWxsID8gbmV3IExpc3MoKSA6IHRoaXMuYmFzZTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmJhc2UpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlO1xuXHRcdH1cblxuXG5cblx0XHQvLyBhdHRyc1xuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGF0dHJzO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lICAgIDogQXR0cnMsXG5cdFx0XHRcdFx0XHRcdFx0IG9sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdFx0IG5ld1ZhbHVlOiBzdHJpbmcpIHtcblxuXHRcdFx0aWYodGhpcy4jYXR0cnNfZmxhZykge1xuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IG5ld1ZhbHVlO1xuXHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRpZiggKHRoaXMuYmFzZSEgYXMgYW55KS5vbkF0dHJDaGFuZ2VkKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzW25hbWVdID0gb2xkVmFsdWU7IC8vIHJldmVydCB0aGUgY2hhbmdlLlxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3RCYXNlIGFzIENvbXBvc2VDb25zdHJ1Y3Rvcjx0eXBlb2YgTElTU0hvc3RCYXNlLCB0eXBlb2YgaG9zdD47XG59XG5cblxuIiwiXG5pbXBvcnQgeyBkZWZpbmUsIGdldEJhc2VDc3RyLCBnZXRIb3N0Q3N0ciwgZ2V0TmFtZSwgaXNEZWZpbmVkLCB3aGVuQWxsRGVmaW5lZCwgd2hlbkRlZmluZWQgfSBmcm9tIFwiY3VzdG9tUmVnaXN0ZXJ5XCI7XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuXHRcdGlzRGVmaW5lZCAgICAgIDogdHlwZW9mIGlzRGVmaW5lZDtcblx0XHRnZXROYW1lICAgICAgICA6IHR5cGVvZiBnZXROYW1lO1xuXHRcdGdldEhvc3RDc3RyICAgIDogdHlwZW9mIGdldEhvc3RDc3RyO1xuXHRcdGdldEJhc2VDc3RyICAgIDogdHlwZW9mIGdldEJhc2VDc3RyO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUgICAgICAgICA9IGRlZmluZTtcbkxJU1Mud2hlbkRlZmluZWQgICAgPSB3aGVuRGVmaW5lZDtcbkxJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTtcbkxJU1MuZ2V0SG9zdENzdHIgICAgPSBnZXRIb3N0Q3N0cjtcbkxJU1MuZ2V0QmFzZUNzdHIgICAgPSBnZXRCYXNlQ3N0cjsiLCJcbmltcG9ydCB7IERFRklORUQsIGdldFN0YXRlLCBpbml0aWFsaXplLCBJTklUSUFMSVpFRCwgaW5pdGlhbGl6ZVN5bmMsIFJFQURZLCB1cGdyYWRlLCBVUEdSQURFRCwgdXBncmFkZVN5bmMsIHdoZW5Jbml0aWFsaXplZCwgd2hlblVwZ3JhZGVkIH0gZnJvbSBcInN0YXRlXCI7XG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgREVGSU5FRCAgICA6IHR5cGVvZiBERUZJTkVELFxuICAgICAgICBSRUFEWSAgICAgIDogdHlwZW9mIFJFQURZO1xuICAgICAgICBVUEdSQURFRCAgIDogdHlwZW9mIFVQR1JBREVEO1xuICAgICAgICBJTklUSUFMSVpFRDogdHlwZW9mIElOSVRJQUxJWkVEO1xuICAgICAgICBnZXRTdGF0ZSAgICAgICA6IHR5cGVvZiBnZXRTdGF0ZTtcbiAgICAgICAgdXBncmFkZSAgICAgICAgOiB0eXBlb2YgdXBncmFkZTtcbiAgICAgICAgaW5pdGlhbGl6ZSAgICAgOiB0eXBlb2YgaW5pdGlhbGl6ZTtcbiAgICAgICAgdXBncmFkZVN5bmMgICAgOiB0eXBlb2YgdXBncmFkZVN5bmM7XG4gICAgICAgIGluaXRpYWxpemVTeW5jIDogdHlwZW9mIGluaXRpYWxpemVTeW5jO1xuICAgICAgICB3aGVuVXBncmFkZWQgICA6IHR5cGVvZiB3aGVuVXBncmFkZWQ7XG4gICAgICAgIHdoZW5Jbml0aWFsaXplZDogdHlwZW9mIHdoZW5Jbml0aWFsaXplZDtcbiAgICB9XG59XG5cbkxJU1MuREVGSU5FRCAgICA9IExJU1MuREVGSU5FRCxcbkxJU1MuUkVBRFkgICAgICA9IExJU1MuUkVBRFk7XG5MSVNTLlVQR1JBREVEICAgPSBMSVNTLlVQR1JBREVEO1xuTElTUy5JTklUSUFMSVpFRD0gTElTUy5JTklUSUFMSVpFRDtcblxuTElTUy5nZXRTdGF0ZSAgICAgICA9IGdldFN0YXRlO1xuTElTUy51cGdyYWRlICAgICAgICA9IHVwZ3JhZGU7XG5MSVNTLmluaXRpYWxpemUgICAgID0gaW5pdGlhbGl6ZTtcbkxJU1MudXBncmFkZVN5bmMgICAgPSB1cGdyYWRlU3luYztcbkxJU1MuaW5pdGlhbGl6ZVN5bmMgPSBpbml0aWFsaXplU3luYztcbkxJU1Mud2hlblVwZ3JhZGVkICAgPSB3aGVuVXBncmFkZWQ7XG5MSVNTLndoZW5Jbml0aWFsaXplZD0gd2hlbkluaXRpYWxpemVkOyIsImltcG9ydCB0eXBlIHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG4vLyBHbyB0byBzdGF0ZSBERUZJTkVEXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+KSB7XG5cbiAgICAvLyBjb3VsZCBiZSBiZXR0ZXIuXG4gICAgaWYoIFwiQmFzZVwiIGluIENvbXBvbmVudENsYXNzKSB7XG4gICAgICAgIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQmFzZSBhcyBUO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7IC8vYnVpbGRMSVNTSG9zdDxUPihDb21wb25lbnRDbGFzcywgcGFyYW1zKTtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkRlZmluZWQodGFnbmFtZTogc3RyaW5nICkge1xuXHRyZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10pIDogUHJvbWlzZTx2b2lkPiB7XG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQobmFtZTogc3RyaW5nKSB7XG5cdHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQobmFtZSkgIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnR8TElTU0Jhc2V8TElTU0Jhc2VDc3RyfExJU1NIb3N0PExJU1NCYXNlPnxMSVNTSG9zdENzdHI8TElTU0Jhc2U+ICk6IHN0cmluZyB7XG5cblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQuY29uc3RydWN0b3IpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuY29uc3RydWN0b3IuSG9zdCBhcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+O1xuXHRpZiggXCJIb3N0XCIgaW4gZWxlbWVudClcblx0XHRlbGVtZW50ID0gZWxlbWVudC5Ib3N0O1xuXHRpZiggXCJCYXNlXCIgaW4gZWxlbWVudC5jb25zdHJ1Y3Rvcilcblx0XHRlbGVtZW50ID0gZWxlbWVudC5jb25zdHJ1Y3RvciBhcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+O1xuXG5cdGlmKCBcIkJhc2VcIiBpbiBlbGVtZW50KSB7XG5cdFx0Y29uc3QgbmFtZSA9IGN1c3RvbUVsZW1lbnRzLmdldE5hbWUoIGVsZW1lbnQgKTtcblx0XHRpZihuYW1lID09PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwibm90IGRlZmluZWQhXCIpO1xuXG5cdFx0cmV0dXJuIG5hbWU7XG5cdH1cblxuXHRpZiggISAoZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoJz8/PycpO1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlPj4obmFtZTogc3RyaW5nKTogVCB7XG5cdHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQobmFtZSkgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhc2VDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KG5hbWU6IHN0cmluZyk6IFQge1xuXHRyZXR1cm4gZ2V0SG9zdENzdHI8TElTU0hvc3RDc3RyPFQ+PihuYW1lKS5CYXNlIGFzIFQ7XG59IiwiaW1wb3J0IHR5cGUgeyBDbGFzcywgQ29uc3RydWN0b3IsIExJU1NfT3B0cywgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7TElTUyBhcyBfTElTU30gZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUztcblxuLy8gZXh0ZW5kcyBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgIEV4dGVuZHNDc3RyX0Jhc2UgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zX0Jhc2UgICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgSG9zdENzdHJfQmFzZSAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRyc19CYXNlICAgICAgIGV4dGVuZHMgc3RyaW5nLFxuXG4gICAgQmFzZUNzdHIgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8RXh0ZW5kc0NzdHJfQmFzZSwgUGFyYW1zX0Jhc2UsIEhvc3RDc3RyX0Jhc2UsIEF0dHJzX0Jhc2U+LFxuXG4gICAgLy8gVE9ETzogYWRkIGNvbnN0cmFpbnRzLi4uXG4gICAgUGFyYW1zICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sXG4gICAgSG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnMgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlcj4ob3B0czogUGFydGlhbDxMSVNTX09wdHM8QmFzZUNzdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4pOiBMSVNTQmFzZUNzdHJcbi8vIExJU1NCYXNlIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG5cdC8vIEhUTUwgQmFzZVxuXHRIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuXHRBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXIsIC8vc3RyaW5nLFxuPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+Pik6IExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTKG9wdHM6IGFueSk6IExJU1NCYXNlQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NCYXNlQ3N0clxuICAgICAgICByZXR1cm4gX2V4dGVuZHMob3B0cyk7XG5cbiAgICByZXR1cm4gX0xJU1Mob3B0cyk7XG59XG5cbmZ1bmN0aW9uIF9leHRlbmRzPFxuICAgIEV4dGVuZHNDc3RyX0Jhc2UgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zX0Jhc2UgICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgSG9zdENzdHJfQmFzZSAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRyc19CYXNlICAgICAgIGV4dGVuZHMgc3RyaW5nLFxuXG4gICAgQmFzZUNzdHIgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8RXh0ZW5kc0NzdHJfQmFzZSwgUGFyYW1zX0Jhc2UsIEhvc3RDc3RyX0Jhc2UsIEF0dHJzX0Jhc2U+LFxuICAgIFxuICAgIC8vIFRPRE86IGFkZCBjb25zdHJhaW50cy4uLlxuICAgIFBhcmFtcyAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxuICAgIEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXI+KG9wdHM6IFBhcnRpYWw8TElTU19PcHRzPEJhc2VDc3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+KSB7XG5cbiAgICBpZiggb3B0cy5leHRlbmRzID09PSB1bmRlZmluZWQpIC8vIGg0Y2tcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBhIExJU1NCYXNlIScpO1xuXG4gICAgY29uc3QgYmFzZSA9IG9wdHMuZXh0ZW5kcy5MSVNTQ2ZnO1xuXG4gICAgY29uc3QgaG9zdCA9IG9wdHMuaG9zdCA/PyBiYXNlLmhvc3Q7XG5cbiAgICBsZXQgZGVwcyA9IGJhc2UuZGVwcztcbiAgICBpZiggb3B0cy5kZXBzICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGRlcHMgPSBbLi4uZGVwcywgLi4ub3B0cy5kZXBzXTtcblxuICAgIGxldCBhdHRycyA9IGJhc2UuYXR0cnMgYXMgcmVhZG9ubHkgKEF0dHJzfEF0dHJzX0Jhc2UpW107XG4gICAgaWYoIG9wdHMuYXR0cnMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgYXR0cnMgPSBbLi4uYXR0cnMsIC4uLm9wdHMuYXR0cnNdO1xuXG4gICAgbGV0IHBhcmFtcyA9IGJhc2UucGFyYW1zO1xuICAgIGlmKCBvcHRzLnBhcmFtcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHBhcmFtcywgb3B0cy5wYXJhbXMpO1xuXG4gICAgLy9UT0RPOiBpc3N1ZXMgd2l0aCBhc3luYyBjb250ZW50L0NTUyArIHNvbWUgZWRnZSBjYXNlcy4uLlxuICAgIGxldCBjb250ZW50X2ZhY3RvcnkgPSBiYXNlLmNvbnRlbnRfZmFjdG9yeSBhcyBhbnk7XG4gICAgaWYoIG9wdHMuY29udGVudCAhPT0gdW5kZWZpbmVkIClcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb250ZW50X2ZhY3RvcnkgPSBvcHRzLmNvbnRlbnRfZmFjdG9yeSEoIG9wdHMuY29udGVudCApO1xuXG4gICAgbGV0IHN0eWxlc2hlZXRzID0gYmFzZS5zdHlsZXNoZWV0cztcbiAgICBpZiggb3B0cy5jc3MgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc3R5bGVzaGVldHMgPSBbLi4uc3R5bGVzaGVldHMsIC4uLm9wdHMuY3NzXTtcblxuICAgIGNvbnN0IHNoYWRvdyA9IG9wdHMuc2hhZG93ID8/IGJhc2Uuc2hhZG93O1xuXG4gICAgY2xhc3MgRXh0ZW5kZWRMSVNTIGV4dGVuZHMgb3B0cy5leHRlbmRzIHtcblxuICAgICAgICBzdGF0aWMgb3ZlcnJpZGUgcmVhZG9ubHkgTElTU0NmZyA9IHtcblx0XHRcdGhvc3QsXG5cdFx0XHRkZXBzLFxuXHRcdFx0YXR0cnMsXG5cdFx0XHRwYXJhbXMsXG5cdFx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG4gICAgICAgIC8vVE9ETzogZml4IHR5cGVzLi4uXG4gICAgfVxuXG4gICAgcmV0dXJuIEV4dGVuZGVkTElTUztcbn1cblxuLypcbmZ1bmN0aW9uIGV4dGVuZHNMSVNTPEV4dGVuZHMgZXh0ZW5kcyBDbGFzcyxcblx0SG9zdCAgICBleHRlbmRzIEhUTUxFbGVtZW50LFxuXHRBdHRyczEgICBleHRlbmRzIHN0cmluZyxcblx0QXR0cnMyICAgZXh0ZW5kcyBzdHJpbmcsXG5cdFBhcmFtcyAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4sXG5cdFQgZXh0ZW5kcyBMSVNTUmV0dXJuVHlwZTxFeHRlbmRzLCBIb3N0LCBBdHRyczEsIFBhcmFtcz4+KExpc3M6IFQsXG5cdFx0cGFyYW1ldGVyczoge1xuXHRcdFx0c2hhZG93ICAgICAgPzogU2hhZG93Q2ZnLFxuXHRcdFx0YXR0cmlidXRlcyAgPzogcmVhZG9ubHkgQXR0cnMyW10sXG5cdFx0XHRkZXBlbmRlbmNpZXM/OiByZWFkb25seSBQcm9taXNlPGFueT5bXVxuXHRcdH0pIHtcblxuXHRjb25zdCBhdHRyaWJ1dGVzICAgPSBbLi4uTGlzcy5QYXJhbWV0ZXJzLmF0dHJpYnV0ZXMgICwgLi4ucGFyYW1ldGVycy5hdHRyaWJ1dGVzICA/P1tdXTtcblx0Y29uc3QgZGVwZW5kZW5jaWVzID0gWy4uLkxpc3MuUGFyYW1ldGVycy5kZXBlbmRlbmNpZXMsIC4uLnBhcmFtZXRlcnMuZGVwZW5kZW5jaWVzPz9bXV07XG5cblx0Y29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5QYXJhbWV0ZXJzLCB7XG5cdFx0YXR0cmlidXRlcyxcblx0XHRkZXBlbmRlbmNpZXNcblx0fSk7XG5cdGlmKCBwYXJhbWV0ZXJzLnNoYWRvdyAhPT0gdW5kZWZpbmVkKVxuXHRcdHBhcmFtcy5zaGFkb3cgPSBwYXJhbWV0ZXJzLnNoYWRvdztcblxuXHQvLyBAdHMtaWdub3JlIDogYmVjYXVzZSBUUyBzdHVwaWRcblx0Y2xhc3MgRXh0ZW5kZWRMSVNTIGV4dGVuZHMgTGlzcyB7XG5cdFx0Y29uc3RydWN0b3IoLi4udDogYW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiBiZWNhdXNlIFRTIHN0dXBpZFxuXHRcdFx0c3VwZXIoLi4udCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIG92ZXJyaWRlIGdldCBhdHRycygpIHtcblx0XHRcdHJldHVybiBzdXBlci5hdHRycyBhcyBSZWNvcmQ8QXR0cnMyfEF0dHJzMSwgc3RyaW5nfG51bGw+O1xuXHRcdH1cblxuXHRcdHN0YXRpYyBvdmVycmlkZSBQYXJhbWV0ZXJzID0gcGFyYW1zO1xuXHR9XG5cblx0cmV0dXJuIEV4dGVuZGVkTElTUztcbn1cbkxJU1MuZXh0ZW5kc0xJU1MgPSBleHRlbmRzTElTUztcbiovIiwiaW1wb3J0IHsgU2hhZG93Q2ZnIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQge0xJU1N9IGZyb20gXCIuLi9MSVNTQmFzZVwiO1xuXG5pbXBvcnQge2RlZmluZX0gZnJvbSBcIi4uL2N1c3RvbVJlZ2lzdGVyeVwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgTElTU19BdXRvIGV4dGVuZHMgTElTUyh7XG5cdGF0dHJzOiBbXCJzcmNcIiwgXCJzd1wiXSxcblx0c2hhZG93OiBTaGFkb3dDZmcuTk9ORSxcblx0Y3NzOiBgOmhvc3QgeyBkaXNwbGF5OiBub25lOyB9YFxufSkge1xuXG5cdHJlYWRvbmx5ICNrbm93bl90YWcgPSBuZXcgU2V0PHN0cmluZz4oKTtcblx0cmVhZG9ubHkgI2RpcmVjdG9yeTogc3RyaW5nO1xuXHRyZWFkb25seSAjc3c6IFByb21pc2U8dm9pZD47XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy4jc3cgPSBuZXcgUHJvbWlzZSggYXN5bmMgKHJlc29sdmUpID0+IHtcblx0XHRcdFxuXHRcdFx0YXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIodGhpcy5hdHRycy5zdyA/PyBcIi9zdy5qc1wiLCB7c2NvcGU6IFwiL1wifSk7XG5cblx0XHRcdGlmKCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICkge1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblxuXHRcdGNvbnN0IHNyYyA9IHRoaXMuYXR0cnMuc3JjO1xuXHRcdGlmKHNyYyA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInNyYyBhdHRyaWJ1dGUgaXMgbWlzc2luZy5cIik7XG5cdFx0dGhpcy4jZGlyZWN0b3J5ID0gc3JjWzBdID09PSAnLidcblx0XHRcdFx0XHRcdFx0XHQ/IGAke3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX0ke3NyY31gXG5cdFx0XHRcdFx0XHRcdFx0OiBzcmM7XG5cblx0XHRuZXcgTXV0YXRpb25PYnNlcnZlciggKG11dGF0aW9ucykgPT4ge1xuXG5cdFx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcblx0XHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRcdGlmKGFkZGl0aW9uIGluc3RhbmNlb2YgRWxlbWVudClcblx0XHRcdFx0XHRcdHRoaXMuI2FkZFRhZyhhZGRpdGlvbi50YWdOYW1lKVxuXG5cdFx0fSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuXG5cdFx0Zm9yKCBsZXQgZWxlbSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiKlwiKSApXG5cdFx0XHR0aGlzLiNhZGRUYWcoZWxlbS50YWdOYW1lKTtcblx0fVxuXG5cbiAgICBwcm90ZWN0ZWQgcmVzb3VyY2VzKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHRcImluZGV4LmpzXCIsXG5cdFx0XHRcImluZGV4Lmh0bWxcIixcblx0XHRcdFwiaW5kZXguY3NzXCJcblx0XHRdO1xuICAgIH1cblxuXHRwcm90ZWN0ZWQgZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZywgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9wdHM6IFBhcnRpYWw8e2NvbnRlbnQ6IHN0cmluZywgY3NzOiBzdHJpbmd9Pikge1xuXG5cdFx0Y29uc3QganMgPSBmaWxlc1tcImluZGV4LmpzXCJdO1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cblx0XHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0XHRpZigganMgIT09IHVuZGVmaW5lZCApXG5cdFx0XHRrbGFzcyA9IGpzKG9wdHMpO1xuXHRcdGVsc2UgaWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0KG9wdHMgYXMgYW55KS5jb250ZW50X2ZhY3RvcnkgPSAoc3RyOiBzdHJpbmcpID0+IHtcblxuXHRcdFx0XHRjb25zdCBjb250ZW50ID0gaHRtbGAke3N0cn1gO1xuXG5cdFx0XHRcdGxldCBzcGFucyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblxuXHRcdFx0XHRyZXR1cm4gKF9hOiB1bmtub3duLCBfYjp1bmtub3duLCBlbGVtOiBIVE1MRWxlbWVudCkgPT4ge1xuXG5cdFx0XHRcdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdFx0XHRcdGZvcihsZXQgc3BhbiBvZiBzcGFucylcblx0XHRcdFx0XHRcdHNwYW4udGV4dENvbnRlbnQgPSBlbGVtLmdldEF0dHJpYnV0ZShzcGFuLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cblx0XHRcdFx0XHRyZXR1cm4gY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdH07XG5cblx0XHRcdGtsYXNzID0gY2xhc3MgV2ViQ29tcG9uZW50IGV4dGVuZHMgTElTUyhvcHRzKSB7fTtcblx0XHR9XG5cblx0XHRpZihrbGFzcyA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0XHRyZXR1cm4gZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblx0fVxuXG5cdGFzeW5jICNhZGRUYWcodGFnbmFtZTogc3RyaW5nKSB7XG5cblx0XHR0YWduYW1lID0gdGFnbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYoIHRhZ25hbWUgPT09ICdsaXNzLWF1dG8nIHx8IHRhZ25hbWUgPT09ICdibGlzcy1hdXRvJyB8fCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCB0aGlzLiNrbm93bl90YWcuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy4ja25vd25fdGFnLmFkZCh0YWduYW1lKTtcblxuXHRcdGF3YWl0IHRoaXMuI3N3OyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG5cdFx0Y29uc3QgZmlsZW5hbWVzID0gdGhpcy5yZXNvdXJjZXMoKTtcblx0XHRjb25zdCByZXNvdXJjZXMgPSBhd2FpdCBQcm9taXNlLmFsbCggZmlsZW5hbWVzLm1hcCggZmlsZSA9PiBmaWxlLmVuZHNXaXRoKCcuanMnKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ/IF9pbXBvcnQgICAoYCR7dGhpcy4jZGlyZWN0b3J5fS8ke3RhZ25hbWV9LyR7ZmlsZX1gLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ6IF9mZXRjaFRleHQoYCR7dGhpcy4jZGlyZWN0b3J5fS8ke3RhZ25hbWV9LyR7ZmlsZX1gLCB0cnVlKSApICk7XG5cblx0XHRjb25zdCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlbmFtZXMubGVuZ3RoOyArK2kpXG5cdFx0XHRpZiggcmVzb3VyY2VzW2ldICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdGZpbGVzW2ZpbGVuYW1lc1tpXV0gPSByZXNvdXJjZXNbaV07XG5cblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXHRcdGNvbnN0IGNzcyAgICAgPSBmaWxlc1tcImluZGV4LmNzc1wiXTtcblxuXHRcdGNvbnN0IG9wdHM6IFBhcnRpYWw8e2NvbnRlbnQ6IHN0cmluZywgY3NzOiBzdHJpbmd9PiA9IHtcblx0XHRcdC4uLmNvbnRlbnQgIT09IHVuZGVmaW5lZCAmJiB7Y29udGVudH0sXG5cdFx0XHQuLi5jc3MgICAgICE9PSB1bmRlZmluZWQgJiYge2Nzc30sXG5cdFx0fTtcblxuXHRcdHJldHVybiB0aGlzLmRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcywgb3B0cyk7XG5cdFx0XG5cdH1cbn1cblxuLy8gcHJldmVudHMgbXVsdGktZGVjbGFyYXRpb25zLi4uXG5pZiggY3VzdG9tRWxlbWVudHMuZ2V0KFwibGlzcy1hdXRvXCIpID09PSB1bmRlZmluZWQpXG5cdGRlZmluZShcImxpc3MtYXV0b1wiLCBMSVNTX0F1dG8pO1xuXG4vL1RPRE86IGZpeC4uLlxuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRzIHtcblx0XCJsaXNzLWF1dG9cIjogTElTU19BdXRvXG59O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIGludGVybmFsIHRvb2xzID09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaFRleHQodXJpOiBzdHJpbmd8VVJMLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHRjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuXHRcdFx0XHRcdFx0PyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuXHRcdFx0XHRcdFx0OiB7fTtcblxuXG5cdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcblx0aWYocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0aWYoIGlzTGlzc0F1dG8gJiYgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJzdGF0dXNcIikhID09PSBcIjQwNFwiIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG59XG5hc3luYyBmdW5jdGlvbiBfaW1wb3J0KHVyaTogc3RyaW5nLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHQvLyB0ZXN0IGZvciB0aGUgbW9kdWxlIGV4aXN0YW5jZS5cblx0aWYoaXNMaXNzQXV0byAmJiBhd2FpdCBfZmV0Y2hUZXh0KHVyaSwgaXNMaXNzQXV0bykgPT09IHVuZGVmaW5lZCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHR0cnkge1xuXHRcdHJldHVybiAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJpKSkuZGVmYXVsdDtcblx0fSBjYXRjaChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxufSIsImltcG9ydCB7IGRlZmluZSB9IGZyb20gXCJjdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCB7IExJU1MgfSBmcm9tIFwiTElTU0Jhc2VcIjtcbmltcG9ydCB7IExJU1NIb3N0LCBTaGFkb3dDZmcgfSBmcm9tIFwidHlwZXNcIjtcblxuLy8gTm9ybWFsbHkgOlxuLy8gUGFyZW50IHVwZ3JhZGUgLT4gY2hpbGRyZW4gdXBncmFkZSAtPiBjaGlsZHJlbiBpbml0IC0+IG1hbmlwdWxhdGUgcGFyZW50IGhvc3QgLT4gcGFyZW50IGluaXQuXG4vLyBJZiBkZXBzIC0+IG5lZWQgYSB0b29sIGZvciBcIndhaXRDaGlsZHJlbkluaXRcIiBvciBcIndhaXRQYXJlbnRJbml0XCIuXG5cbmV4cG9ydCBjbGFzcyBMSVNTUGFyYW1zPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+PiBleHRlbmRzIExJU1Moe1xuICAgIHNoYWRvdzogU2hhZG93Q2ZnLk5PTkUsXG4gICAgY3NzOiBbYDpob3N0IHtkaXNwbGF5OiBub25lfWBdLFxuICAgIGF0dHJzOiBbXCJ0eXBlXCJdXG59KSB7XG5cbiAgICAjbmFtZSAgOiBzdHJpbmc7XG4gICAgI3ZhbHVlPzogVDtcblxuICAgICNwYXJlbnQ6IExJU1NIb3N0O1xuXG4gICAgLy8gZGlydHkgaDRjay4uLlxuICAgIGNvbnN0cnVjdG9yKHAgPSB7fSwgaW5pdCA9IHRydWUpIHsgLy8gd2h5IGluaXQgP1xuXG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy4jbmFtZSA9IHRoaXMuaG9zdC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpITtcblxuICAgICAgICB0aGlzLiNwYXJlbnQgPSB0aGlzLmhvc3QucGFyZW50RWxlbWVudCEgYXMgTElTU0hvc3Q7XG5cbiAgICAgICAgaWYoaW5pdClcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0KCkge1xuXG4gICAgICAgIC8vIFRPRE86IG9ic2VydmUgY29udGVudC4uLlxuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKHRoaXMuaG9zdC50ZXh0Q29udGVudCEpO1xuICAgIH1cblxuICAgIC8vVE9ET1xuICAgIHByb3RlY3RlZCBnZXQgdHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cnMudHlwZSA/PyBcIkpTT05cIjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX3BhcnNlQ29udGVudCh2YWx1ZTogc3RyaW5nKTogVCB7XG5cbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHlwZTtcblxuICAgICAgICBpZiggdHlwZSA9PT0gXCJKU09OXCIpXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgIGlmKCB0eXBlID09PSBcIkpTXCIpIHtcbiAgICAgICAgICAgIC8vVE9ETzogbWF5IGJlIGltcHJvdmVkID9cbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBPYmplY3Qua2V5cyggdGhpcy5nZXRBcmdzKCkgKTtcbiAgICAgICAgICAgIHRoaXMuI2ZjdCA9IG5ldyBGdW5jdGlvbiguLi5hcmdzLCBgcmV0dXJuICR7dmFsdWV9YCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsKCAuLi5PYmplY3QudmFsdWVzKGFyZ3MpICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGltcGxlbWVudGVkIVwiKTtcbiAgICB9XG5cbiAgICAjZmN0OiAoIEZ1bmN0aW9uKXxudWxsID0gbnVsbDtcblxuICAgIHByb3RlY3RlZCBjYWxsKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNmY3QhKC4uLmFyZ3MpIGFzIFQ7XG4gICAgfVxuICAgIFxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiN2YWx1ZSA9IHRoaXMuX3BhcnNlQ29udGVudCh2YWx1ZSk7XG4gICAgICAgIC8qXG4gICAgICAgIC8vIGRvIG5vdCB1cGRhdGVkIGlmIG5vdCBpbiBET00uXG4gICAgICAgIGlmKCAhIHRoaXMuI3BhcmVudD8uaXNJbkRPTSlcbiAgICAgICAgICAgIHJldHVybjsqL1xuXG4gICAgICAgIHRoaXMuI3BhcmVudC51cGRhdGVQYXJhbXModGhpcy4jdmFsdWUpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRBcmdzKCk6IFJlY29yZDxzdHJpbmcsYW55PiB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvL1RPRE8uLi5cbiAgICAvKlxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBvbkF0dHJDaGFuZ2VkKF9uYW1lOiBzdHJpbmcsIF9vbGRWYWx1ZTogc3RyaW5nLCBfbmV3VmFsdWU6IHN0cmluZyk6IHZvaWQgfCBmYWxzZSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKHRoaXMuYXR0cnMudmFsdWUhKTtcbiAgICB9Ki9cbn1cblxuaWYoIGN1c3RvbUVsZW1lbnRzLmdldChcImxpc3MtcGFyYW1zXCIpID09PSB1bmRlZmluZWQpXG4gICAgZGVmaW5lKFwibGlzcy1wYXJhbXNcIiwgTElTU1BhcmFtcyk7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCIuLi9zdGF0ZVwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCJ1dGlsc1wiO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufVxuXG4vKlxudHlwZSBCVUlMRF9PUFRJT05TPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBQYXJ0aWFsPHtcbiAgICBwYXJhbXMgICAgOiBQYXJ0aWFsPFRbXCJwYXJhbXNcIl0+LFxuICAgIGNvbnRlbnRcdCAgOiBzdHJpbmd8Tm9kZXxyZWFkb25seSBOb2RlW10sXG4gICAgaWQgXHRcdCAgICA6IHN0cmluZyxcbiAgICBjbGFzc2VzXHQgIDogcmVhZG9ubHkgc3RyaW5nW10sXG4gICAgY3NzdmFycyAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4sXG4gICAgYXR0cnMgXHQgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBkYXRhIFx0ICAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBsaXN0ZW5lcnMgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCAoZXY6IEV2ZW50KSA9PiB2b2lkPj5cbn0+ICYgKHtcbiAgaW5pdGlhbGl6ZTogZmFsc2UsXG4gIHBhcmVudDogRWxlbWVudFxufXx7XG4gIGluaXRpYWxpemU/OiB0cnVlLFxuICBwYXJlbnQ/OiBFbGVtZW50XG59KTtcblxuLy9hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBQcm9taXNlPENvbXBvbmVudHNbVF0+O1xuXG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPih0YWduYW1lOiBzdHJpbmcsIHtcbiAgICAgICAgICAgICAgcGFyYW1zICAgID0ge30sXG4gICAgICAgICAgICAgIGluaXRpYWxpemU9IHRydWUsXG4gICAgICAgICAgICAgIGNvbnRlbnQgICA9IFtdLFxuICAgICAgICAgICAgICBwYXJlbnQgICAgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGlkIFx0XHQgID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBjbGFzc2VzICAgPSBbXSxcbiAgICAgICAgICAgICAgY3NzdmFycyAgID0ge30sXG4gICAgICAgICAgICAgIGF0dHJzICAgICA9IHt9LFxuICAgICAgICAgICAgICBkYXRhIFx0ICA9IHt9LFxuICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSB7fVxuICAgICAgICAgICAgICB9OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBQcm9taXNlPFQ+IHtcblxuICBpZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbiAgbGV0IEN1c3RvbUNsYXNzID0gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG4gIGxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbiAgLy8gRml4IGlzc3VlICMyXG4gIGlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG4gIGVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbiAgaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuICBlbGVtLmlkID0gaWQ7XG5cbiAgaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuICBlbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuICBmb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxuICBsZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbiAgaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG4gIGVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgZWxzZVxuICBlbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH1cblxuICBmb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG4gIGxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG4gIGlmKCB2YWx1ZSA9PT0gZmFsc2UpXG4gIGRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG4gIGVsc2UgaWYodmFsdWUgPT09IHRydWUpXG4gIGVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG4gIGVsc2VcbiAgZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBpZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbiAgY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG4gIGVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG4gIGlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG4gIHBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbiAgaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG4gIHJldHVybiBhd2FpdCBMSVNTLmluaXRpYWxpemUoZWxlbSk7XG5cbiAgcmV0dXJuIGF3YWl0IExJU1MuZ2V0TElTUyhlbGVtKTtcbn1cbkxJU1MuYnVpbGQgPSBidWlsZDtcblxuXG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogQ29tcG9uZW50c1tUXTtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFQ7XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywge1xucGFyYW1zICAgID0ge30sXG5pbml0aWFsaXplPSB0cnVlLFxuY29udGVudCAgID0gW10sXG5wYXJlbnQgICAgPSB1bmRlZmluZWQsXG5pZCBcdFx0ICA9IHVuZGVmaW5lZCxcbmNsYXNzZXMgICA9IFtdLFxuY3NzdmFycyAgID0ge30sXG5hdHRycyAgICAgPSB7fSxcbmRhdGEgXHQgID0ge30sXG5saXN0ZW5lcnMgPSB7fVxufTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogVCB7XG5cbmlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxudGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG5sZXQgQ3VzdG9tQ2xhc3MgPSBjdXN0b21FbGVtZW50cy5nZXQodGFnbmFtZSk7XG5pZihDdXN0b21DbGFzcyA9PT0gdW5kZWZpbmVkKVxudGhyb3cgbmV3IEVycm9yKGAke3RhZ25hbWV9IG5vdCBkZWZpbmVkYCk7XG5sZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4vL1RPRE86IGZhY3Rvcml6ZS4uLlxuXG4vLyBGaXggaXNzdWUgIzJcbmlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG5lbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG5pZiggaWQgIT09IHVuZGVmaW5lZCApXG5lbGVtLmlkID0gaWQ7XG5cbmlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG5lbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbmZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbmZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG5sZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbmlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuZWxzZVxuZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufVxuXG5mb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG5sZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuaWYoIHZhbHVlID09PSBmYWxzZSlcbmRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG5lbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbmVsc2VcbmVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xufVxuXG5pZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbmNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbmZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG5lbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbnBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbmlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxuTElTUy5pbml0aWFsaXplU3luYyhlbGVtKTtcblxucmV0dXJuIExJU1MuZ2V0TElTU1N5bmMoZWxlbSk7XG59XG5MSVNTLmJ1aWxkU3luYyA9IGJ1aWxkU3luYztcbiovIiwiXG5pbXBvcnQgeyBDb25zdHJ1Y3RvciB9IGZyb20gXCJ0eXBlc1wiO1xuXG50eXBlIExpc3RlbmVyRmN0PFQgZXh0ZW5kcyBFdmVudD4gPSAoZXY6IFQpID0+IHZvaWQ7XG50eXBlIExpc3RlbmVyT2JqPFQgZXh0ZW5kcyBFdmVudD4gPSB7IGhhbmRsZUV2ZW50OiBMaXN0ZW5lckZjdDxUPiB9O1xudHlwZSBMaXN0ZW5lcjxUIGV4dGVuZHMgRXZlbnQ+ID0gTGlzdGVuZXJGY3Q8VD58TGlzdGVuZXJPYmo8VD47XG5cbmV4cG9ydCBjbGFzcyBFdmVudFRhcmdldDI8RXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgRXZlbnQ+PiBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcblxuXHRvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgY2FsbGJhY2s6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIG9wdGlvbnM/OiBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyB8IGJvb2xlYW4pOiB2b2lkIHtcblx0XHRcblx0XHQvL0B0cy1pZ25vcmVcblx0XHRyZXR1cm4gc3VwZXIuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cdH1cblxuXHRvdmVycmlkZSBkaXNwYXRjaEV2ZW50PFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KGV2ZW50OiBFdmVudHNbVF0pOiBib29sZWFuIHtcblx0XHRyZXR1cm4gc3VwZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH1cblxuXHRvdmVycmlkZSByZW1vdmVFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IFQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IGxpc3RlbmVyOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgb3B0aW9ucz86IGJvb2xlYW58QWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkIHtcblxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHN1cGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21FdmVudDI8VCBleHRlbmRzIHN0cmluZywgQXJncz4gZXh0ZW5kcyBDdXN0b21FdmVudDxBcmdzPiB7XG5cblx0Y29uc3RydWN0b3IodHlwZTogVCwgYXJnczogQXJncykge1xuXHRcdHN1cGVyKHR5cGUsIHtkZXRhaWw6IGFyZ3N9KTtcblx0fVxuXG5cdG92ZXJyaWRlIGdldCB0eXBlKCk6IFQgeyByZXR1cm4gc3VwZXIudHlwZSBhcyBUOyB9XG59XG5cbnR5cGUgSW5zdGFuY2VzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+PiA9IHtcblx0W0sgaW4ga2V5b2YgVF06IEluc3RhbmNlVHlwZTxUW0tdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gV2l0aEV2ZW50czxUIGV4dGVuZHMgb2JqZWN0LCBFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBDb25zdHJ1Y3RvcjxFdmVudD4+ID4oZXY6IENvbnN0cnVjdG9yPFQ+LCBfZXZlbnRzOiBFdmVudHMpIHtcblxuXHR0eXBlIEV2dHMgPSBJbnN0YW5jZXM8RXZlbnRzPjtcblxuXHRpZiggISAoZXYgaW5zdGFuY2VvZiBFdmVudFRhcmdldCkgKVxuXHRcdHJldHVybiBldiBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG5cblx0Ly8gaXMgYWxzbyBhIG1peGluXG5cdC8vIEB0cy1pZ25vcmVcblx0Y2xhc3MgRXZlbnRUYXJnZXRNaXhpbnMgZXh0ZW5kcyBldiB7XG5cblx0XHQjZXYgPSBuZXcgRXZlbnRUYXJnZXQyPEV2dHM+KCk7XG5cblx0XHRhZGRFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5hZGRFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRyZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5yZW1vdmVFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXHRcdH1cblx0XHRkaXNwYXRjaEV2ZW50KC4uLmFyZ3M6YW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHJldHVybiB0aGlzLiNldi5kaXNwYXRjaEV2ZW50KC4uLmFyZ3MpO1xuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIEV2ZW50VGFyZ2V0TWl4aW5zIGFzIHVua25vd24gYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIFNoYWRvd1Jvb3QgdG9vbHMgPT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50TWF0Y2hlcyhldjogRXZlbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcblxuXHRsZXQgZWxlbWVudHMgPSBldi5jb21wb3NlZFBhdGgoKS5zbGljZSgwLC0yKS5maWx0ZXIoZSA9PiAhIChlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgKS5yZXZlcnNlKCkgYXMgSFRNTEVsZW1lbnRbXTtcblxuXHRmb3IobGV0IGVsZW0gb2YgZWxlbWVudHMgKVxuXHRcdGlmKGVsZW0ubWF0Y2hlcyhzZWxlY3RvcikgKVxuXHRcdFx0cmV0dXJuIGVsZW07IFxuXG5cdHJldHVybiBudWxsO1xufSIsIlxuaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGluaXRpYWxpemVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQgfSBmcm9tIFwiLi4vc3RhdGVcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudHMge307XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgLy8gYXN5bmNcbiAgICAgICAgcXMgOiB0eXBlb2YgcXM7XG4gICAgICAgIHFzbzogdHlwZW9mIHFzbztcbiAgICAgICAgcXNhOiB0eXBlb2YgcXNhO1xuICAgICAgICBxc2M6IHR5cGVvZiBxc2M7XG5cbiAgICAgICAgLy8gc3luY1xuICAgICAgICBxc1N5bmMgOiB0eXBlb2YgcXNTeW5jO1xuICAgICAgICBxc2FTeW5jOiB0eXBlb2YgcXNhU3luYztcbiAgICAgICAgcXNjU3luYzogdHlwZW9mIHFzY1N5bmM7XG5cblx0XHRjbG9zZXN0OiB0eXBlb2YgY2xvc2VzdDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3Nfc2VsZWN0b3IobmFtZT86IHN0cmluZykge1xuXHRpZihuYW1lID09PSB1bmRlZmluZWQpIC8vIGp1c3QgYW4gaDRja1xuXHRcdHJldHVybiBcIlwiO1xuXHRyZXR1cm4gYDppcygke25hbWV9LCBbaXM9XCIke25hbWV9XCJdKWA7XG59XG5cbmZ1bmN0aW9uIF9idWlsZFFTKHNlbGVjdG9yOiBzdHJpbmcsIHRhZ25hbWVfb3JfcGFyZW50Pzogc3RyaW5nIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LCBwYXJlbnQ6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cdFxuXHRpZiggdGFnbmFtZV9vcl9wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGFnbmFtZV9vcl9wYXJlbnQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cGFyZW50ID0gdGFnbmFtZV9vcl9wYXJlbnQ7XG5cdFx0dGFnbmFtZV9vcl9wYXJlbnQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRyZXR1cm4gW2Ake3NlbGVjdG9yfSR7bGlzc19zZWxlY3Rvcih0YWduYW1lX29yX3BhcmVudCBhcyBzdHJpbmd8dW5kZWZpbmVkKX1gLCBwYXJlbnRdIGFzIGNvbnN0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxczxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0bGV0IHJlc3VsdCA9IGF3YWl0IHFzbzxUPihzZWxlY3RvciwgcGFyZW50KTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gcmVzdWx0IVxufVxuXG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VFtdPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXVtdID47XG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPFQ+PiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRwcm9taXNlc1tpZHgrK10gPSB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPihyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG59XG5cbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUW107XG5mdW5jdGlvbiBxc2FTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dW107XG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogVDtcbmZ1bmN0aW9uIHFzY1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KHJlc3VsdCk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjbG9zZXN0PEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50KSB7XG5cblx0d2hpbGUodHJ1ZSkge1xuXHRcdHZhciByZXN1bHQgPSBlbGVtZW50LmNsb3Nlc3Q8RT4oc2VsZWN0b3IpO1xuXG5cdFx0aWYoIHJlc3VsdCAhPT0gbnVsbClcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuXHRcdGlmKCAhIChcImhvc3RcIiBpbiByb290KSApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGVsZW1lbnQgPSAocm9vdCBhcyBTaGFkb3dSb290KS5ob3N0O1xuXHR9XG59XG5cblxuLy8gYXN5bmNcbkxJU1MucXMgID0gcXM7XG5MSVNTLnFzbyA9IHFzbztcbkxJU1MucXNhID0gcXNhO1xuTElTUy5xc2MgPSBxc2M7XG5cbi8vIHN5bmNcbkxJU1MucXNTeW5jICA9IHFzU3luYztcbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG5MSVNTLmNsb3Nlc3QgPSBjbG9zZXN0OyIsImltcG9ydCB0eXBlIHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IGdldEhvc3RDc3RyLCBnZXROYW1lIH0gZnJvbSBcIi4vY3VzdG9tUmVnaXN0ZXJ5XCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZW51bSBTdGF0ZSB7XG4gICAgTk9ORSA9IDAsXG5cbiAgICAvLyBjbGFzc1xuICAgIERFRklORUQgPSAxIDw8IDAsXG4gICAgUkVBRFkgICA9IDEgPDwgMSxcblxuICAgIC8vIGluc3RhbmNlXG4gICAgVVBHUkFERUQgICAgPSAxIDw8IDIsXG4gICAgSU5JVElBTElaRUQgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCBjb25zdCBERUZJTkVEICAgICA9IFN0YXRlLkRFRklORUQ7XG5leHBvcnQgY29uc3QgUkVBRFkgICAgICAgPSBTdGF0ZS5SRUFEWTtcbmV4cG9ydCBjb25zdCBVUEdSQURFRCAgICA9IFN0YXRlLlVQR1JBREVEO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVEID0gU3RhdGUuSU5JVElBTElaRUQ7XG5cbmV4cG9ydCBjbGFzcyBMSVNTU3RhdGUge1xuXG4gICAgI2VsZW06IEhUTUxFbGVtZW50fG51bGw7XG5cbiAgICAvLyBpZiBudWxsIDogY2xhc3Mgc3RhdGUsIGVsc2UgaW5zdGFuY2Ugc3RhdGVcbiAgICBjb25zdHJ1Y3RvcihlbGVtOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbCkge1xuICAgICAgICB0aGlzLiNlbGVtID0gZWxlbTtcbiAgICB9XG5cbiAgICBzdGF0aWMgREVGSU5FRCAgICAgPSBERUZJTkVEO1xuICAgIHN0YXRpYyBSRUFEWSAgICAgICA9IFJFQURZO1xuICAgIHN0YXRpYyBVUEdSQURFRCAgICA9IFVQR1JBREVEO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFRCA9IElOSVRJQUxJWkVEO1xuXG4gICAgaXMoc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgICAgICYmICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSAgICAgICAmJiAhIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEICAgICYmICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgJiYgISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBsZXQgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxhbnk+PigpO1xuICAgIFxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkRlZmluZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5SZWFkeSgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblVwZ3JhZGVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuSW5pdGlhbGl6ZWQoKSApO1xuICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IERFRklORUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNEZWZpbmVkKCkge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KCBnZXROYW1lKHRoaXMuI2VsZW0pICkgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBSRUFEWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1JlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyKGdldE5hbWUoZWxlbSkpO1xuXG4gICAgICAgIGlmKCAhIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gSG9zdC5pc0RlcHNSZXNvbHZlZDtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTsgLy8gY291bGQgYmUgcmVhZHkgYmVmb3JlIGRlZmluZWQsIGJ1dCB3ZWxsLi4uXG5cbiAgICAgICAgYXdhaXQgd2hlbkRPTUNvbnRlbnRMb2FkZWQ7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuRGVwc1Jlc29sdmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gVVBHUkFERUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNVcGdyYWRlZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgY29uc3QgaG9zdCA9IGdldEhvc3RDc3RyKGdldE5hbWUoZWxlbSkpO1xuICAgICAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIGhvc3Q7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTtcbiAgICBcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBob3N0KVxuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICBcbiAgICAgICAgLy8gaDRja1xuICAgIFxuICAgICAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgXG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcblxuICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBJTklUSUFMSVpFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0luaXRpYWxpemVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIFwiaXNJbml0aWFsaXplZFwiIGluIGVsZW0gJiYgZWxlbS5pc0luaXRpYWxpemVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPigpIHtcbiAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuVXBncmFkZWQoKTtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZDtcblxuICAgICAgICByZXR1cm4gKGVsZW0gYXMgTElTU0hvc3Q8VD4pLmJhc2UgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gQ09OVkVSU0lPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICB2YWx1ZU9mKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBsZXQgc3RhdGU6IFN0YXRlID0gMDtcbiAgICBcbiAgICAgICAgaWYoIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IERFRklORUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgc3RhdGUgfD0gUkVBRFk7XG4gICAgICAgIGlmKCB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gVVBHUkFERUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gSU5JVElBTElaRUQ7XG4gICAgXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMudmFsdWVPZigpO1xuICAgICAgICBsZXQgaXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIkRFRklORURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJSRUFEWVwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIlVQR1JBREVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiSU5JVElBTElaRURcIik7XG4gICAgXG4gICAgICAgIHJldHVybiBpcy5qb2luKCd8Jyk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUoZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiggXCJzdGF0ZVwiIGluIGVsZW0pXG4gICAgICAgIHJldHVybiBlbGVtLnN0YXRlIGFzIExJU1NTdGF0ZTtcbiAgICBcbiAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5zdGF0ZSA9IG5ldyBMSVNTU3RhdGUoZWxlbSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PSBTdGF0ZSBtb2RpZmllcnMgKG1vdmU/KSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gR28gdG8gc3RhdGUgVVBHUkFERURcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGdyYWRlPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuRGVmaW5lZCgpO1xuXG4gICAgcmV0dXJuIHVwZ3JhZGVTeW5jPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBncmFkZVN5bmM8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFQge1xuICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcbiAgICBcbiAgICBpZiggISBzdGF0ZS5pc0RlZmluZWQgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IGRlZmluZWQhJyk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyKGdldE5hbWUoZWxlbSkpO1xuXG4gICAgaWYoICEgKGVsZW0gaW5zdGFuY2VvZiBIb3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBkaWRuJ3QgdXBncmFkZSFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIFQ7XG59XG5cbi8vIEdvIHRvIHN0YXRlIElOSVRJQUxJWkVEXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSApXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5SZWFkeSgpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBUIHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgc3RhdGUuaXNSZWFkeSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT0gZXh0ZXJuYWwgV0hFTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlbkluaXRpYWxpemVkPFQ+KCk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHR5cGUgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCcsXG4gICAgU0VNSU9QRU49ICdzZW1pLW9wZW4nXG59O1xuXG4vL1RPRE86IGltcGxlbWVudCA/XG5leHBvcnQgZW51bSBMaWZlQ3ljbGUge1xuICAgIERFRkFVTFQgICAgICAgICAgICAgICAgICAgPSAwLFxuXHQvLyBub3QgaW1wbGVtZW50ZWQgeWV0XG4gICAgSU5JVF9BRlRFUl9DSElMRFJFTiAgICAgICA9IDEgPDwgMSxcbiAgICBJTklUX0FGVEVSX1BBUkVOVCAgICAgICAgID0gMSA8PCAyLFxuICAgIC8vIHF1aWQgcGFyYW1zL2F0dHJzID9cbiAgICBSRUNSRUFURV9BRlRFUl9DT05ORUNUSU9OID0gMSA8PCAzLCAvKiByZXF1aXJlcyByZWJ1aWxkIGNvbnRlbnQgKyBkZXN0cm95L2Rpc3Bvc2Ugd2hlbiByZW1vdmVkIGZyb20gRE9NICovXG4gICAgLyogc2xlZXAgd2hlbiBkaXNjbyA6IHlvdSBuZWVkIHRvIGltcGxlbWVudCBpdCB5b3Vyc2VsZiAqL1xufVxuXG5leHBvcnQgdHlwZSBDb250ZW50RmFjdG9yeTxBdHRycyBleHRlbmRzIHN0cmluZywgUGFyYW1zIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+PiA9ICggKGF0dHJzOiBSZWNvcmQ8QXR0cnMsIG51bGx8c3RyaW5nPiwgcGFyYW1zOiBQYXJhbXMsIGVsZW06SFRNTEVsZW1lbnQpID0+IE5vZGV8dW5kZWZpbmVkICk7XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nLFxuICAgID4gPSB7XG4gICAgICAgIC8vIEpTIEJhc2VcbiAgICAgICAgZXh0ZW5kcyAgIDogRXh0ZW5kc0N0cixcbiAgICAgICAgcGFyYW1zICAgIDogUGFyYW1zLFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBkZXBzICAgICAgOiByZWFkb25seSBQcm9taXNlPGFueT5bXSxcblxuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsXG4gICAgICAgIGF0dHJzICA6IHJlYWRvbmx5IEF0dHJzW10sXG4gICAgICAgIG9ic2VydmVkQXR0cmlidXRlczogcmVhZG9ubHkgQXR0cnNbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0XG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGNvbnRlbnQ/OiBIVE1MX1NvdXJjZSxcbiAgICAgICAgY29udGVudF9mYWN0b3J5OiAoY29udGVudD86IEV4Y2x1ZGU8SFRNTF9SZXNvdXJjZSwgUmVzcG9uc2U+KSA9PiBDb250ZW50RmFjdG9yeTxBdHRycywgUGFyYW1zPixcbiAgICAgICAgY3NzICAgICA6IENTU19Tb3VyY2UgfCByZWFkb25seSBDU1NfU291cmNlW10sXG4gICAgICAgIHNoYWRvdyAgOiBTaGFkb3dDZmdcbn1cblxuLy8gTElTU0Jhc2VcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2VDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2U8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gSW5zdGFuY2VUeXBlPExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gVCBleHRlbmRzIExJU1NCYXNlPFxuICAgICAgICAgICAgaW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEIsXG4gICAgICAgICAgICBpbmZlciBDLFxuICAgICAgICAgICAgaW5mZXIgRD4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NCYXNlQ3N0cjxBLEIsQyxEPiA6IG5ldmVyO1xuXG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyID0gTElTU0Jhc2U+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0Jhc2UgPyBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0ciA9IExJU1NCYXNlPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+OyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBIVE1MQ0xBU1NfUkVHRVggPSAgL0hUTUwoXFx3KylFbGVtZW50LztcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblx0XG5cdGxldCBodG1sdGFnID0gSFRNTENMQVNTX1JFR0VYLmV4ZWMoQ2xhc3MubmFtZSkhWzFdO1xuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgY29uc3Qgd2hlbkRPTUNvbnRlbnRMb2FkZWQgPSB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdERPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG5cblxuLy8gbW92ZWQgaGVyZSBpbnN0ZWFkIG9mIGJ1aWxkIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwcy5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbmltcG9ydCBcIi4vY29yZS9zdGF0ZVwiO1xuaW1wb3J0IFwiLi9jb3JlL2N1c3RvbVJlZ2lzdGVyeVwiO1xuXG4vL1RPRE86IEJMSVNTXG5cbi8vVE9ETzogZXZlbnRzLnRzXG4vL1RPRE86IGdsb2JhbENTU1J1bGVzXG5pbXBvcnQgXCIuL2hlbHBlcnMvTElTU0F1dG9cIjtcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge2xpc3MsIGxpc3NTeW5jfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5leHBvcnQge2V2ZW50TWF0Y2hlcywgV2l0aEV2ZW50cywgRXZlbnRUYXJnZXQyLCBDdXN0b21FdmVudDJ9IGZyb20gJy4vaGVscGVycy9ldmVudHMnO1xuZXhwb3J0IHtMSVNTUGFyYW1zfSBmcm9tIFwiLi9oZWxwZXJzL0xJU1NQYXJhbXNcIjtcbmV4cG9ydCB7aHRtbH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7Il0sIm5hbWVzIjpbIlNoYWRvd0NmZyIsImJ1aWxkTElTU0hvc3QiLCJfZWxlbWVudDJ0YWduYW1lIiwiaXNTaGFkb3dTdXBwb3J0ZWQiLCJodG1sIiwiX19jc3RyX2hvc3QiLCJzZXRDc3RySG9zdCIsIl8iLCJERUZBVUxUX0NPTlRFTlRfRkFDVE9SWSIsImNvbnRlbnQiLCJ0cmltIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiSFRNTFRlbXBsYXRlRWxlbWVudCIsImNsb25lTm9kZSIsIkxJU1MiLCJleHRlbmRzIiwiX2V4dGVuZHMiLCJPYmplY3QiLCJwYXJhbXMiLCJkZXBzIiwiaG9zdCIsIkhUTUxFbGVtZW50Iiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cnMiLCJjb250ZW50X2ZhY3RvcnkiLCJfY29udGVudF9mYWN0b3J5IiwiY3NzIiwic2hhZG93IiwiU0VNSU9QRU4iLCJOT05FIiwiT1BFTiIsIkVycm9yIiwiYWxsX2RlcHMiLCJQcm9taXNlIiwiUmVzcG9uc2UiLCJfY29udGVudCIsInB1c2giLCJ0ZXh0IiwiTElTU0Jhc2UiLCJMSVNTQ2ZnIiwic3R5bGVzaGVldHMiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJjIiwiaWR4IiwicHJvY2Vzc19jc3MiLCJjb25zdHJ1Y3RvciIsImFyZ3MiLCJIb3N0Iiwic3RhdGUiLCJzZXRBdHRyRGVmYXVsdCIsImF0dHIiLCJ2YWx1ZSIsIm9uQXR0ckNoYW5nZWQiLCJfbmFtZSIsIl9vbGRWYWx1ZSIsIl9uZXdWYWx1ZSIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsInVwZGF0ZVBhcmFtcyIsImFzc2lnbiIsImlzSW5ET00iLCJpc0Nvbm5lY3RlZCIsIm9uRE9NQ29ubmVjdGVkIiwiY29ubmVjdGVkQ2FsbGJhY2siLCJvbkRPTURpc2Nvbm5lY3RlZCIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiX0hvc3QiLCJDU1NTdHlsZVNoZWV0IiwiSFRNTFN0eWxlRWxlbWVudCIsInNoZWV0Iiwic3R5bGUiLCJyZXBsYWNlU3luYyIsIkxJU1NTdGF0ZSIsImlzRE9NQ29udGVudExvYWRlZCIsIndhaXRET01Db250ZW50TG9hZGVkIiwiaWQiLCJzaGFyZWRDU1MiLCJnZXRTaGFyZWRDU1MiLCJMaXNzIiwiR0VUIiwiU3ltYm9sIiwiU0VUIiwicHJvcGVydGllcyIsImZyb21FbnRyaWVzIiwibiIsImVudW1lcmFibGUiLCJnZXQiLCJzZXQiLCJBdHRyaWJ1dGVzIiwibmFtZSIsImRhdGEiLCJkZWZhdWx0cyIsInNldHRlciIsImRlZmluZVByb3BlcnRpZXMiLCJhbHJlYWR5RGVjbGFyZWRDU1MiLCJTZXQiLCJ3YWl0UmVhZHkiLCJyIiwiYWxsIiwiaXNSZWFkeSIsIndoZW5EZXBzUmVzb2x2ZWQiLCJpc0RlcHNSZXNvbHZlZCIsIkxJU1NIb3N0QmFzZSIsIkJhc2UiLCJiYXNlIiwiaXNJbml0aWFsaXplZCIsIndoZW5Jbml0aWFsaXplZCIsImluaXRpYWxpemUiLCJpbml0IiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiZ2V0UGFydCIsImhhc1NoYWRvdyIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJDU1NTZWxlY3RvciIsImhhc0F0dHJpYnV0ZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJwcm9taXNlIiwicmVzb2x2ZSIsIndpdGhSZXNvbHZlcnMiLCJfd2hlblVwZ3JhZGVkUmVzb2x2ZSIsInNoYWRvd1Jvb3QiLCJjb25zb2xlIiwid2FybiIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsIm1vZGUiLCJhdHRhY2hTaGFkb3ciLCJvYnMiLCJhZG9wdGVkU3R5bGVTaGVldHMiLCJjc3NzZWxlY3RvciIsImhhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwiaW5uZXJIVE1MIiwicmVwbGFjZSIsImhlYWQiLCJhcHBlbmQiLCJhZGQiLCJvYmoiLCJjaGlsZE5vZGVzIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsImRlZmluZSIsImdldEJhc2VDc3RyIiwiZ2V0SG9zdENzdHIiLCJnZXROYW1lIiwiaXNEZWZpbmVkIiwid2hlbkFsbERlZmluZWQiLCJ3aGVuRGVmaW5lZCIsImdldFN0YXRlIiwiaW5pdGlhbGl6ZVN5bmMiLCJ1cGdyYWRlU3luYyIsIndoZW5VcGdyYWRlZCIsIkRFRklORUQiLCJSRUFEWSIsIlVQR1JBREVEIiwiSU5JVElBTElaRUQiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJDbGFzcyIsImh0bWx0YWciLCJMSVNTY2xhc3MiLCJvcHRzIiwidGFnbmFtZXMiLCJ0IiwiZWxlbWVudCIsIkVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiX0xJU1MiLCJJTElTUyIsIkV4dGVuZGVkTElTUyIsIkxJU1NfQXV0byIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInN3Iiwic2NvcGUiLCJjb250cm9sbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNyYyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImVsZW0iLCJyZXNvdXJjZXMiLCJkZWZpbmVXZWJDb21wb25lbnQiLCJmaWxlcyIsImpzIiwia2xhc3MiLCJzdHIiLCJzcGFucyIsIl9hIiwiX2IiLCJzcGFuIiwidGV4dENvbnRlbnQiLCJXZWJDb21wb25lbnQiLCJmaWxlbmFtZXMiLCJmaWxlIiwiZW5kc1dpdGgiLCJfaW1wb3J0IiwiX2ZldGNoVGV4dCIsImkiLCJ1cmkiLCJpc0xpc3NBdXRvIiwib3B0aW9ucyIsImhlYWRlcnMiLCJyZXNwb25zZSIsImZldGNoIiwic3RhdHVzIiwiZGVmYXVsdCIsImUiLCJsb2ciLCJMSVNTUGFyYW1zIiwicCIsInBhcmVudEVsZW1lbnQiLCJvblZhbHVlQ2hhbmdlZCIsInR5cGUiLCJfcGFyc2VDb250ZW50IiwiSlNPTiIsInBhcnNlIiwia2V5cyIsImdldEFyZ3MiLCJGdW5jdGlvbiIsImNhbGwiLCJ2YWx1ZXMiLCJsaXNzIiwiRG9jdW1lbnRGcmFnbWVudCIsImxpc3NTeW5jIiwiRXZlbnRUYXJnZXQyIiwiRXZlbnRUYXJnZXQiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInNsaWNlIiwiZmlsdGVyIiwiU2hhZG93Um9vdCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsInByb21pc2VzIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwid2hlbkRPTUNvbnRlbnRMb2FkZWQiLCJTdGF0ZSIsImlzIiwiaXNVcGdyYWRlZCIsIndoZW4iLCJ3aGVuUmVhZHkiLCJfd2hlblVwZ3JhZGVkIiwidmFsdWVPZiIsInRvU3RyaW5nIiwiam9pbiIsInN0cmljdCIsIm93bmVyRG9jdW1lbnQiLCJhZG9wdE5vZGUiLCJmb3JjZSIsIkxpZmVDeWNsZSIsIkhUTUxDTEFTU19SRUdFWCIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJleGVjIiwiQ0FOX0hBVkVfU0hBRE9XIiwidGFnIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsInRlbXBsYXRlIiwiZmlyc3RDaGlsZCIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSJdLCJzb3VyY2VSb290IjoiIn0=