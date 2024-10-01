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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/******/ /* webpack/runtime/publicPath */
/******/ (() => {
/******/ 	__webpack_require__.p = "";
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*******************************************!*\
  !*** ./src/pages/examples/build/index.ts ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../ */ "./src/index.ts");

// =============================================================
class MyComponentA extends (0,___WEBPACK_IMPORTED_MODULE_0__["default"])() {
    constructor(){
        super();
        this.content.replaceChildren((0,___WEBPACK_IMPORTED_MODULE_0__.html)`<b>html\`\` : OK</b>`);
    }
}
___WEBPACK_IMPORTED_MODULE_0__["default"].define('my-component-a', MyComponentA);
// =============================================================
class MyComponentB extends (0,___WEBPACK_IMPORTED_MODULE_0__["default"])({
    content: "liss``"
}) {
    constructor(){
        console.log("init");
        super();
    }
}
___WEBPACK_IMPORTED_MODULE_0__["default"].define('my-component-b', MyComponentB);
async function foo() {
    const component = await (0,___WEBPACK_IMPORTED_MODULE_0__.liss)`<my-component-b></my-component-b>`;
    document.body.append(component.host);
}
foo();
{
    let compo = new MyComponentB.Host();
    document.body.append(compo);
    console.warn("host", ___WEBPACK_IMPORTED_MODULE_0__["default"].getState(compo));
}{
    let compo = new MyComponentB();
    document.body.append(compo.host);
    console.warn("base", ___WEBPACK_IMPORTED_MODULE_0__["default"].getState(compo.host));
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!********************************************!*\
  !*** ./src/pages/examples/build/index.css ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************!*\
  !*** ./src/pages/examples/build/index.html ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "pages/examples/build/index.html");
})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXMvZXhhbXBsZXMvYnVpbGQvL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR2tDO0FBQ1M7QUFDeUI7QUFFcEUsSUFBSUssY0FBcUI7QUFFbEIsU0FBU0MsWUFBWUMsQ0FBTTtJQUNqQ0YsY0FBY0U7QUFDZjtBQUVPLFNBQVNDLHdCQUF3QkMsT0FBMEM7SUFFakYsSUFBSSxPQUFPQSxZQUFZLFVBQVU7UUFFaENBLFVBQVVBLFFBQVFDLElBQUk7UUFDdEIsSUFBSUQsUUFBUUUsTUFBTSxLQUFLLEdBQ3RCRixVQUFVRztRQUVYLElBQUlILFlBQVlHLFdBQ2ZILFVBQVVMLDRDQUFJLENBQUMsRUFBRUssUUFBUSxDQUFDO0lBRTNCLDBCQUEwQjtJQUMxQixtQkFBbUI7SUFDbkIsZ0RBQWdEO0lBQy9DLG1DQUFtQztJQUNuQywrREFBK0Q7SUFDaEUscUZBQXFGO0lBQ3JGLG1HQUFtRztJQUNwRztJQUVBLElBQUlBLG1CQUFtQkkscUJBQ3RCSixVQUFVQSxRQUFRQSxPQUFPO0lBRTFCLE9BQU8sSUFBTUEsU0FBU0ssVUFBVTtBQUNqQztBQUVPLFNBQVNDLEtBTWQsRUFFRSxVQUFVO0FBQ1ZDLFNBQVNDLFdBQVdDLE1BQStCLEVBQUUscUNBQXFDLEdBQzFGQyxTQUFvQixDQUFDLENBQTBCLEVBQy9DLGNBQWM7QUFDZEMsT0FBUyxFQUFFLEVBRVgsWUFBWTtBQUNaQyxPQUFRQyxXQUFrQyxFQUM3Q0MscUJBQXFCLEVBQUUsRUFDcEJDLFFBQVFELGtCQUFrQixFQUMxQixjQUFjO0FBQ2RkLE9BQU8sRUFDVmdCLGlCQUFpQkMsbUJBQW1CbEIsdUJBQXVCLEVBQ3hEbUIsR0FBRyxFQUNIQyxTQUFTekIseURBQWlCQSxDQUFDa0IsUUFBUXJCLDZDQUFTQSxDQUFDNkIsUUFBUSxHQUFHN0IsNkNBQVNBLENBQUM4QixJQUFJLEVBQ2hCLEdBQUcsQ0FBQyxDQUFDO0lBRTNELElBQUlGLFdBQVc1Qiw2Q0FBU0EsQ0FBQytCLElBQUksSUFBSSxDQUFFNUIseURBQWlCQSxDQUFDa0IsT0FDakQsTUFBTSxJQUFJVyxNQUFNLENBQUMsYUFBYSxFQUFFOUIsd0RBQWdCQSxDQUFDbUIsTUFBTSw0QkFBNEIsQ0FBQztJQUV4RixNQUFNWSxXQUFXO1dBQUliO0tBQUs7SUFFN0IsSUFBSUs7SUFFRCxxQkFBcUI7SUFDckIsSUFBSWhCLG1CQUFtQnlCLFdBQVd6QixtQkFBbUIwQixVQUFXO1FBRWxFLElBQUlDLFdBQWtDM0I7UUFDdENBLFVBQVU7UUFFSndCLFNBQVNJLElBQUksQ0FBRSxDQUFDO1lBRVpELFdBQVcsTUFBTUE7WUFDakIsSUFBSUEsb0JBQW9CRCxVQUNoQ0MsV0FBVyxNQUFNQSxTQUFTRSxJQUFJO1lBRXRCQyxTQUFTQyxPQUFPLENBQUNmLGVBQWUsR0FBR0MsaUJBQWlCVTtRQUN4RDtJQUVKLE9BQU87UUFDVFgsa0JBQWtCQyxpQkFBaUJqQjtJQUNwQztJQUVBLGlCQUFpQjtJQUNqQixJQUFJZ0MsY0FBK0IsRUFBRTtJQUNyQyxJQUFJZCxRQUFRZixXQUFZO1FBRXZCLElBQUksQ0FBRThCLE1BQU1DLE9BQU8sQ0FBQ2hCLE1BQ25CLDJEQUEyRDtRQUMzREEsTUFBTTtZQUFDQTtTQUFJO1FBRVosYUFBYTtRQUNiYyxjQUFjZCxJQUFJaUIsR0FBRyxDQUFFLENBQUNDLEdBQWVDO1lBRXRDLElBQUlELGFBQWFYLFdBQVdXLGFBQWFWLFVBQVU7Z0JBRWxERixTQUFTSSxJQUFJLENBQUUsQ0FBQztvQkFFZlEsSUFBSSxNQUFNQTtvQkFDVixJQUFJQSxhQUFhVixVQUNoQlUsSUFBSSxNQUFNQSxFQUFFUCxJQUFJO29CQUVqQkcsV0FBVyxDQUFDSyxJQUFJLEdBQUdDLFlBQVlGO2dCQUVoQztnQkFFQSxPQUFPO1lBQ1I7WUFFQSxPQUFPRSxZQUFZRjtRQUNwQjtJQUNEO0lBS0EsTUFBTU4saUJBQWlCdEI7UUFFdEIrQixZQUFZLEdBQUdDLElBQVcsQ0FBRTtZQUUzQixLQUFLLElBQUlBO1lBRVQseUNBQXlDO1lBQ3pDLElBQUk1QyxnQkFBZ0IsTUFDbkJBLGNBQWMsSUFBSSxJQUFLLENBQUMyQyxXQUFXLENBQVNFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSTtZQUMxRCxJQUFJLENBQUMsS0FBSyxHQUFHN0M7WUFDYkEsY0FBYztRQUNmO1FBRVMsS0FBSyxDQUFNO1FBRXBCLGVBQWU7UUFDZixPQUFnQm1DLFVBQVU7WUFDekJuQjtZQUNBRDtZQUNBSTtZQUNBTDtZQUNBTTtZQUNBZ0I7WUFDQWI7UUFDRCxFQUFFO1FBRUYsSUFBSXVCLFFBQW1CO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQ0EsS0FBSztRQUN4QjtRQUVBLElBQVc5QixPQUErQjtZQUN6QyxPQUFPLElBQUksQ0FBQyxLQUFLO1FBQ2xCO1FBQ0EsMkJBQTJCO1FBQzNCLElBQWNaLFVBQTZDO1lBQzFELE9BQU8sSUFBSyxDQUFDLEtBQUssQ0FBV0EsT0FBTztRQUNyQztRQUVBLFFBQVE7UUFDUixJQUFjZSxRQUFvQztZQUNqRCxPQUFPLElBQUssQ0FBQyxLQUFLLENBQVdBLEtBQUs7UUFDbkM7UUFDVTRCLGVBQWdCQyxJQUFXLEVBQUVDLEtBQWtCLEVBQUU7WUFDMUQsT0FBTyxJQUFLLENBQUMsS0FBSyxDQUFXRixjQUFjLENBQUNDLE1BQU1DO1FBQ25EO1FBQ1VDLGNBQWNDLEtBQVksRUFDbkNDLFNBQWlCLEVBQ2pCQyxTQUFpQixFQUFjLENBQUM7UUFFakMsc0JBQXNCO1FBQ3RCLElBQWNuQyxxQkFBcUI7WUFDbEMsT0FBTyxJQUFJLENBQUNDLEtBQUs7UUFDbEI7UUFDVW1DLHlCQUF5QixHQUFHVixJQUE2QixFQUFFO1lBQ3BFLElBQUksQ0FBQ00sYUFBYSxJQUFJTjtRQUN2QjtRQUVBLGFBQWE7UUFDYixJQUFXOUIsU0FBMkI7WUFDckMsT0FBTyxJQUFLLENBQUMsS0FBSyxDQUFXQSxNQUFNO1FBQ3BDO1FBQ095QyxhQUFhekMsTUFBdUIsRUFBRTtZQUM1Q0QsT0FBTzJDLE1BQU0sQ0FBRSxJQUFLLENBQUMsS0FBSyxDQUFXMUMsTUFBTSxFQUFFQTtRQUM5QztRQUVBLE1BQU07UUFDTixJQUFXMkMsVUFBbUI7WUFDN0IsT0FBTyxJQUFLLENBQUMsS0FBSyxDQUFXQyxXQUFXO1FBQ3pDO1FBQ1VDLGlCQUFpQjtZQUMxQixJQUFJLENBQUNDLGlCQUFpQjtRQUN2QjtRQUNVQyxvQkFBb0I7WUFDN0IsSUFBSSxDQUFDQyxvQkFBb0I7UUFDMUI7UUFFQSxxQkFBcUI7UUFDWEYsb0JBQW9CLENBQUM7UUFDckJFLHVCQUF1QixDQUFDO1FBQ2xDLElBQVdKLGNBQWM7WUFDeEIsT0FBTyxJQUFJLENBQUNELE9BQU87UUFDcEI7UUFFQSxPQUFlTSxNQUEwQjtRQUV6QyxXQUFXbEIsT0FBTztZQUNqQixJQUFJLElBQUksQ0FBQ2tCLEtBQUssS0FBS3hELFdBQ2xCLElBQUksQ0FBQ3dELEtBQUssR0FBR25FLHdEQUFhQSxDQUFDLElBQUksR0FBVSwrQkFBK0I7WUFDekUsT0FBTyxJQUFJLENBQUNtRSxLQUFLO1FBQ2xCO0lBQ0Q7SUFFQSxPQUFPN0I7QUFDUjtBQUVBLFNBQVNRLFlBQVlwQixHQUEwQztJQUU5RCxJQUFHQSxlQUFlMEMsZUFDakIsT0FBTzFDO0lBQ1IsSUFBSUEsZUFBZTJDLGtCQUNsQixPQUFPM0MsSUFBSTRDLEtBQUs7SUFFakIsSUFBSUMsUUFBUSxJQUFJSDtJQUNoQixJQUFJLE9BQU8xQyxRQUFRLFVBQVc7UUFDN0I2QyxNQUFNQyxXQUFXLENBQUM5QyxNQUFNLHNCQUFzQjtRQUM5QyxPQUFPNkM7SUFDUjtJQUVBLE1BQU0sSUFBSXhDLE1BQU07QUFDakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeE91RTtBQUVuQztBQUNLO0FBQzhDO0FBRXZGLElBQUk2QyxLQUFLO0FBSVQsTUFBTUMsWUFBWSxJQUFJVDtBQUNmLFNBQVNVO0lBQ2YsT0FBT0Q7QUFDUjtBQUVPLFNBQVM3RSxjQUNnQytFLElBQU87SUFDdEQsTUFBTSxFQUNMM0QsSUFBSSxFQUNKRyxLQUFLLEVBQ0xDLGVBQWUsRUFDZmdCLFdBQVcsRUFDWGIsTUFBTSxFQUNOLEdBQUdvRCxLQUFLeEMsT0FBTztJQVViLGNBQWM7SUFDakIsTUFBTXlDLE1BQU1DLE9BQU87SUFDbkIsTUFBTUMsTUFBTUQsT0FBTztJQUVuQixNQUFNRSxhQUFhbEUsT0FBT21FLFdBQVcsQ0FBRTdELE1BQU1vQixHQUFHLENBQUMwQyxDQUFBQSxJQUFLO1lBQUNBO1lBQUc7Z0JBRXpEQyxZQUFZO2dCQUNaQyxLQUFLO29CQUErQixPQUFPLElBQUssQ0FBMkJQLElBQUksQ0FBQ0s7Z0JBQUk7Z0JBQ3BGRyxLQUFLLFNBQVNuQyxLQUFrQjtvQkFBSSxPQUFPLElBQUssQ0FBMkI2QixJQUFJLENBQUNHLEdBQUdoQztnQkFBUTtZQUM1RjtTQUFFO0lBRUYsTUFBTW9DO1FBR0MsS0FBSyxDQUFrQztRQUN2QyxTQUFTLENBQThCO1FBQ3ZDLE9BQU8sQ0FBK0M7UUFFdEQsQ0FBQ1QsSUFBSSxDQUFDVSxJQUFXLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDQSxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQ0EsS0FBSyxJQUFJO1FBQ3BEO1FBQ0EsQ0FBQ1IsSUFBSSxDQUFDUSxJQUFXLEVBQUVyQyxLQUFrQixFQUFDO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQ3FDLE1BQU1yQyxRQUFRLHVEQUF1RDtRQUMxRjtRQUVBTixZQUFZNEMsSUFBb0MsRUFDbkRDLFFBQW9DLEVBQzlCQyxNQUFtRCxDQUFFO1lBRXZELElBQUksQ0FBQyxLQUFLLEdBQU9GO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUdDO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBR0M7WUFFZjVFLE9BQU82RSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUVYO1FBQy9CO0lBQ1A7SUFFQSxNQUFNWSxxQkFBcUIsSUFBSUM7SUFFNUIsTUFBTUMsWUFBWSxJQUFJaEUsUUFBZSxPQUFPaUU7UUFFeEMsTUFBTXZCLDREQUFvQkE7UUFDMUIsTUFBTTFDLFFBQVFrRSxHQUFHLENBQUNwQixLQUFLeEMsT0FBTyxDQUFDcEIsSUFBSTtRQUVuQ2lGLFVBQVU7UUFFVkY7SUFDSjtJQUVBLGtDQUFrQztJQUNsQyxJQUFJRSxVQUFVckIsS0FBS3hDLE9BQU8sQ0FBQ3BCLElBQUksQ0FBQ1QsTUFBTSxJQUFJLEtBQUtnRSwwREFBa0JBO0lBRXBFLE1BQU14RCxTQUFTNkQsS0FBS3hDLE9BQU8sQ0FBQ3JCLE1BQU0sRUFBRSxrREFBa0Q7SUFFdEYsRUFBRTtJQUVGLE1BQU1tRixtQkFBbUJwRSxRQUFRa0UsR0FBRyxDQUFDcEIsS0FBS3hDLE9BQU8sQ0FBQ3BCLElBQUk7SUFDdEQsSUFBSW1GLGlCQUFpQjtJQUNuQjtRQUNELE1BQU1EO1FBQ05DLGlCQUFpQjtJQUNsQjtJQUVBLE1BQU1DLHFCQUFzQm5GO1FBRTNCLGtDQUFrQztRQUN6QjhCLFFBQVEsSUFBSyxDQUFTQSxLQUFLLElBQUksSUFBSXVCLDZDQUFTQSxDQUFDLElBQUksRUFBRTtRQUU1RCwrREFBK0Q7UUFFL0QsT0FBZ0I0QixtQkFBbUJBLGlCQUFpQjtRQUNwRCxXQUFXQyxpQkFBaUI7WUFDM0IsT0FBT0E7UUFDUjtRQUVBLGlFQUFpRTtRQUNqRSxPQUFPRSxPQUFPekIsS0FBSztRQUVuQixLQUFLLEdBQWEsS0FBSztRQUN2QixJQUFJMEIsT0FBTztZQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFDbEI7UUFFQSxJQUFJQyxnQkFBZ0I7WUFDbkIsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLO1FBQ3ZCO1FBQ1NDLGdCQUEwQztRQUNuRCx5QkFBeUIsQ0FBQztRQUUxQkMsV0FBVzFGLFNBQTBCLENBQUMsQ0FBQyxFQUFFO1lBRXhDLElBQUksSUFBSSxDQUFDd0YsYUFBYSxFQUNyQixNQUFNLElBQUkzRSxNQUFNO1lBQ1IsSUFBSSxDQUFFLElBQU0sQ0FBQ2dCLFdBQVcsQ0FBU3VELGNBQWMsRUFDM0MsTUFBTSxJQUFJdkUsTUFBTTtZQUU3QmQsT0FBTzJDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFMUM7WUFFNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMyRixJQUFJO1lBRXRCLElBQUksSUFBSSxDQUFDL0MsV0FBVyxFQUNuQixJQUFLLENBQUMsS0FBSyxDQUFTQyxjQUFjO1lBRW5DLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFDbEI7UUFFQSxvQ0FBb0M7UUFDM0IsT0FBTyxHQUFXN0MsT0FBTztRQUVsQyxJQUFJQSxTQUFpQjtZQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPO1FBQ3BCO1FBRWF5QyxhQUFhekMsTUFBb0MsRUFBRTtZQUMvRCxJQUFJLElBQUksQ0FBQ3dGLGFBQWEsRUFDVCxhQUFhO1lBQ3pCLE9BQU8sSUFBSSxDQUFDRCxJQUFJLENBQUU5QyxZQUFZLENBQUN6QztZQUV2QixpQ0FBaUM7WUFDMUNELE9BQU8yQyxNQUFNLENBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTFDO1FBQzlCO1FBQ0EsZ0RBQWdEO1FBRWhELFdBQVcsR0FBRyxNQUFNO1FBRXBCLFdBQVcsR0FBVyxDQUFDLEVBQWdDO1FBQ3ZELG1CQUFtQixHQUFHLENBQUMsRUFBZ0M7UUFDdkQsTUFBTSxHQUFHLElBQUl1RSxXQUNaLElBQUksQ0FBQyxXQUFXLEVBQ2hCLElBQUksQ0FBQyxtQkFBbUIsRUFDeEIsQ0FBQ0MsTUFBYXJDO1lBRWIsSUFBSSxDQUFDLFdBQVcsQ0FBQ3FDLEtBQUssR0FBR3JDO1lBRXpCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxpQ0FBaUM7WUFDMUQsSUFBSUEsVUFBVSxNQUNiLElBQUksQ0FBQ3lELGVBQWUsQ0FBQ3BCO2lCQUVyQixJQUFJLENBQUNxQixZQUFZLENBQUNyQixNQUFNckM7UUFDMUIsR0FDMEM7UUFFM0NGLGVBQWV1QyxJQUFXLEVBQUVyQyxLQUFrQixFQUFFO1lBQy9DLElBQUlBLFVBQVUsTUFDYixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQ3FDLEtBQUs7aUJBRXJDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQ0EsS0FBSyxHQUFHckM7UUFDbkM7UUFFQSxJQUFJOUIsUUFBOEM7WUFFakQsT0FBTyxJQUFJLENBQUMsTUFBTTtRQUNuQjtRQUVBLDZDQUE2QztRQUU3QyxRQUFRLEdBQXlCLEtBQUs7UUFFdEMsSUFBSWYsVUFBVTtZQUNiLE9BQU8sSUFBSSxDQUFDLFFBQVE7UUFDckI7UUFFQXdHLFFBQVF0QixJQUFZLEVBQUU7WUFDckIsT0FBTyxJQUFJLENBQUN1QixTQUFTLEdBQ2pCLElBQUksQ0FBQyxRQUFRLEVBQUVDLGNBQWMsQ0FBQyxPQUFPLEVBQUV4QixLQUFLLENBQUMsQ0FBQyxJQUM5QyxJQUFJLENBQUMsUUFBUSxFQUFFd0IsY0FBYyxDQUFDLE9BQU8sRUFBRXhCLEtBQUssRUFBRSxDQUFDO1FBQ3BEO1FBQ0F5QixTQUFTekIsSUFBWSxFQUFFO1lBQ3RCLE9BQU8sSUFBSSxDQUFDdUIsU0FBUyxHQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUxQixLQUFLLENBQUMsQ0FBQyxJQUNqRCxJQUFJLENBQUMsUUFBUSxFQUFFMEIsaUJBQWlCLENBQUMsT0FBTyxFQUFFMUIsS0FBSyxFQUFFLENBQUM7UUFDdkQ7UUFFQSxJQUFjdUIsWUFBcUI7WUFDbEMsT0FBT3RGLFdBQVc7UUFDbkI7UUFFQSxXQUFXLEdBRVgsSUFBSTBGLGNBQWM7WUFFakIsSUFBRyxJQUFJLENBQUNKLFNBQVMsSUFBSSxDQUFFLElBQUksQ0FBQ0ssWUFBWSxDQUFDLE9BQ3hDLE9BQU8sSUFBSSxDQUFDQyxPQUFPO1lBRXBCLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQ0EsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUNDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMxRDtRQUVBLDBDQUEwQztRQUUxQ3pFLFlBQVk3QixNQUFVLEVBQUV1RixJQUFzQixDQUFFO1lBQy9DLEtBQUs7WUFFTHhGLE9BQU8yQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTFDO1lBRTVCLElBQUksRUFBQ3VHLE9BQU8sRUFBRUMsT0FBTyxFQUFDLEdBQUd6RixRQUFRMEYsYUFBYTtZQUU5QyxJQUFJLENBQUNoQixlQUFlLEdBQUdjO1lBQ3ZCLElBQUksQ0FBQyx5QkFBeUIsR0FBR0M7WUFFakMsSUFBSWpCLFNBQVM5RixXQUFXO2dCQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHOEY7Z0JBQ2IsSUFBSSxDQUFDSSxJQUFJLElBQUksb0JBQW9CO1lBQ2xDO1lBRUEsSUFBSSwwQkFBMEIsSUFBSSxFQUNqQyxJQUFLLENBQUNlLG9CQUFvQjtRQUM1QjtRQUVBLDJEQUEyRDtRQUUzRDFELHVCQUF1QjtZQUNyQixJQUFJLENBQUN1QyxJQUFJLENBQVV4QyxpQkFBaUI7UUFDdEM7UUFFQUQsb0JBQW9CO1lBRW5CLDJCQUEyQjtZQUMzQixJQUFJLElBQUksQ0FBQzBDLGFBQWEsRUFBRztnQkFDeEIsSUFBSSxDQUFDRCxJQUFJLENBQUUxQyxjQUFjO2dCQUN6QjtZQUNEO1lBRUEsMkJBQTJCO1lBQzNCLElBQUksSUFBSSxDQUFDYixLQUFLLENBQUNrRCxPQUFPLEVBQUc7Z0JBQ3hCLElBQUksQ0FBQ1EsVUFBVSxJQUFJLHFDQUFxQztnQkFDeEQ7WUFDRDtZQUVFO2dCQUVELE1BQU0sSUFBSSxDQUFDMUQsS0FBSyxDQUFDa0QsT0FBTztnQkFFeEIsSUFBSSxDQUFFLElBQUksQ0FBQ00sYUFBYSxFQUN2QixJQUFJLENBQUNFLFVBQVU7WUFFakI7UUFDRDtRQUVBLElBQWFpQixhQUFhO1lBQ3pCQyxRQUFRQyxJQUFJLENBQUM7WUFDYixJQUFHcEcsV0FBVzVCLDZDQUFTQSxDQUFDNkIsUUFBUSxFQUMvQixPQUFPO1lBQ1IsT0FBTyxLQUFLLENBQUNpRztRQUNkO1FBRVFoQixPQUFPO1lBRWRtQixlQUFlQyxPQUFPLENBQUMsSUFBSTtZQUVsQixvREFBb0Q7WUFFN0QsU0FBUztZQUNULElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSTtZQUNwQixJQUFJdEcsV0FBVyxRQUFRO2dCQUN0QixNQUFNdUcsT0FBT3ZHLFdBQVc1Qiw2Q0FBU0EsQ0FBQzZCLFFBQVEsR0FBRyxTQUFTRDtnQkFDdEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUN3RyxZQUFZLENBQUM7b0JBQUNEO2dCQUFJO1lBRXZDLFlBQVk7WUFDWix3REFBd0Q7WUFDeEQsWUFBWTtZQUNaLDJEQUEyRDtZQUM1RDtZQUVBLFFBQVE7WUFDUixLQUFJLElBQUlFLE9BQU83RyxNQUNkLElBQUksQ0FBQyxXQUFXLENBQUM2RyxJQUFhLEdBQUcsSUFBSSxDQUFDWixZQUFZLENBQUNZO1lBRXBELE1BQU07WUFDTixJQUFJekcsV0FBVyxRQUNkLElBQUssQ0FBQyxRQUFRLENBQWdCMEcsa0JBQWtCLENBQUNqRyxJQUFJLENBQUN5QztZQUN2RCxJQUFJckMsWUFBWTlCLE1BQU0sRUFBRztnQkFFeEIsSUFBSWlCLFdBQVcsUUFDZCxJQUFLLENBQUMsUUFBUSxDQUFnQjBHLGtCQUFrQixDQUFDakcsSUFBSSxJQUFJSTtxQkFDckQ7b0JBRUosTUFBTThGLGNBQWMsSUFBSSxDQUFDakIsV0FBVztvQkFFcEMsd0JBQXdCO29CQUN4QixJQUFJLENBQUV0QixtQkFBbUJ3QyxHQUFHLENBQUNELGNBQWU7d0JBRTNDLElBQUkvRCxRQUFRaUUsU0FBU0MsYUFBYSxDQUFDO3dCQUVuQ2xFLE1BQU13QyxZQUFZLENBQUMsT0FBT3VCO3dCQUUxQixJQUFJSSxtQkFBbUI7d0JBRXZCLEtBQUksSUFBSW5FLFNBQVMvQixZQUNoQixLQUFJLElBQUltRyxRQUFRcEUsTUFBTXFFLFFBQVEsQ0FDN0JGLG9CQUFvQkMsS0FBS0UsT0FBTyxHQUFHO3dCQUVyQ3RFLE1BQU11RSxTQUFTLEdBQUdKLGlCQUFpQkssT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUVULFlBQVksQ0FBQyxDQUFDO3dCQUV6RUUsU0FBU1EsSUFBSSxDQUFDQyxNQUFNLENBQUMxRTt3QkFFckJ3QixtQkFBbUJtRCxHQUFHLENBQUNaO29CQUN4QjtnQkFDRDtZQUNEO1lBRUEsVUFBVTtZQUNWLE1BQU05SCxVQUFVZ0IsZ0JBQWdCLElBQUksQ0FBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQ0wsTUFBTSxFQUFFLElBQUk7WUFDN0QsSUFBSVYsWUFBWUcsV0FDZixJQUFJLENBQUMsUUFBUSxDQUFDc0ksTUFBTSxDQUFFekk7WUFFcEIsUUFBUTtZQUVSLHlDQUF5QztZQUM1Q0gsc0RBQVdBLENBQUMsSUFBSTtZQUNiLElBQUk4SSxNQUFNLElBQUksQ0FBQzFDLElBQUksS0FBSyxPQUFPLElBQUkxQixTQUFTLElBQUksQ0FBQzBCLElBQUk7WUFFeEQsSUFBSSxDQUFDLEtBQUssR0FBRzBDO1lBRWIsZUFBZTtZQUNmLElBQUksSUFBSSxDQUFDbEMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUNtQyxVQUFVLENBQUMxSSxNQUFNLEtBQUssR0FDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQ3VJLE1BQU0sQ0FBRVQsU0FBU0MsYUFBYSxDQUFDO1lBRTlDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUNoQyxJQUFJO1lBRXhDLE9BQU8sSUFBSSxDQUFDQSxJQUFJO1FBQ2pCO1FBSUEsUUFBUTtRQUVSLE9BQU9uRixxQkFBcUJDLE1BQU07UUFDbENtQyx5QkFBeUJnQyxJQUFlLEVBQ2pDMkQsUUFBZ0IsRUFDaEJDLFFBQWdCLEVBQUU7WUFFeEIsSUFBRyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHO2dCQUNuQjtZQUNEO1lBRUEsSUFBSSxDQUFDLFdBQVcsQ0FBQzVELEtBQUssR0FBRzREO1lBQ3pCLElBQUksQ0FBRSxJQUFJLENBQUM1QyxhQUFhLEVBQ3ZCO1lBRUQsSUFBSSxJQUFLLENBQUNELElBQUksQ0FBVW5ELGFBQWEsQ0FBQ29DLE1BQU0yRCxVQUFVQyxjQUFjLE9BQU87Z0JBQzFFLElBQUksQ0FBQyxNQUFNLENBQUM1RCxLQUFLLEdBQUcyRCxVQUFVLHFCQUFxQjtZQUNwRDtRQUNEO0lBQ0Q7O0lBRUEsT0FBTzlDO0FBQ1I7Ozs7Ozs7Ozs7Ozs7O0FDM1hvSDtBQUV0RjtBQWE5QnpGLGdEQUFJQSxDQUFDeUksTUFBTSxHQUFXQSxtREFBTUE7QUFDNUJ6SSxnREFBSUEsQ0FBQytJLFdBQVcsR0FBTUEsd0RBQVdBO0FBQ2pDL0ksZ0RBQUlBLENBQUM4SSxjQUFjLEdBQUdBLDJEQUFjQTtBQUNwQzlJLGdEQUFJQSxDQUFDNkksU0FBUyxHQUFRQSxzREFBU0E7QUFDL0I3SSxnREFBSUEsQ0FBQzRJLE9BQU8sR0FBVUEsb0RBQU9BO0FBQzdCNUksZ0RBQUlBLENBQUMySSxXQUFXLEdBQU1BLHdEQUFXQTtBQUNqQzNJLGdEQUFJQSxDQUFDMEksV0FBVyxHQUFNQSx3REFBV0E7Ozs7Ozs7Ozs7Ozs7O0FDckJ3SDtBQUMzSDtBQWtCOUIxSSxnREFBSUEsQ0FBQ29KLE9BQU8sR0FBTXBKLGdEQUFJQSxDQUFDb0osT0FBTyxFQUM5QnBKLGdEQUFJQSxDQUFDcUosS0FBSyxHQUFRckosZ0RBQUlBLENBQUNxSixLQUFLO0FBQzVCckosZ0RBQUlBLENBQUNzSixRQUFRLEdBQUt0SixnREFBSUEsQ0FBQ3NKLFFBQVE7QUFDL0J0SixnREFBSUEsQ0FBQ3VKLFdBQVcsR0FBRXZKLGdEQUFJQSxDQUFDdUosV0FBVztBQUVsQ3ZKLGdEQUFJQSxDQUFDZ0osUUFBUSxHQUFTQSwyQ0FBUUE7QUFDOUJoSixnREFBSUEsQ0FBQ21ILE9BQU8sR0FBVUEsMENBQU9BO0FBQzdCbkgsZ0RBQUlBLENBQUM4RixVQUFVLEdBQU9BLDZDQUFVQTtBQUNoQzlGLGdEQUFJQSxDQUFDa0osV0FBVyxHQUFNQSw4Q0FBV0E7QUFDakNsSixnREFBSUEsQ0FBQ2lKLGNBQWMsR0FBR0EsaURBQWNBO0FBQ3BDakosZ0RBQUlBLENBQUNtSixZQUFZLEdBQUtBLCtDQUFZQTtBQUNsQ25KLGdEQUFJQSxDQUFDNkYsZUFBZSxHQUFFQSxrREFBZUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Qk07QUFFM0Msc0JBQXNCO0FBQ2YsU0FBUzRDLE9BQ1plLE9BQXNCLEVBQ3RCQyxjQUFpQztJQUVqQyxtQkFBbUI7SUFDbkIsSUFBSSxVQUFVQSxnQkFBZ0I7UUFDMUJBLGlCQUFpQkEsZUFBZS9ELElBQUk7SUFDeEM7SUFFQSxNQUFNZ0UsUUFBU0QsZUFBZWhJLE9BQU8sQ0FBQ25CLElBQUk7SUFDMUMsSUFBSXFKLFVBQVd4Syx3REFBZ0JBLENBQUN1SyxVQUFRN0o7SUFFeEMsTUFBTStKLFlBQVlILGVBQWV0SCxJQUFJLEVBQUUsMkNBQTJDO0lBRWxGLE1BQU0wSCxPQUFPRixZQUFZOUosWUFBWSxDQUFDLElBQ3hCO1FBQUNJLFNBQVMwSjtJQUFPO0lBRS9CekMsZUFBZXVCLE1BQU0sQ0FBQ2UsU0FBU0ksV0FBV0M7QUFDOUM7QUFFTyxlQUFlZCxZQUFZUyxPQUFlO0lBQ2hELE9BQU8sTUFBTXRDLGVBQWU2QixXQUFXLENBQUNTO0FBQ3pDO0FBRU8sZUFBZVYsZUFBZWdCLFFBQTJCO0lBQy9ELE1BQU0zSSxRQUFRa0UsR0FBRyxDQUFFeUUsU0FBU2pJLEdBQUcsQ0FBRWtJLENBQUFBLElBQUs3QyxlQUFlNkIsV0FBVyxDQUFDZ0I7QUFDbEU7QUFFTyxTQUFTbEIsVUFBVWpFLElBQVk7SUFDckMsT0FBT3NDLGVBQWV6QyxHQUFHLENBQUNHLFVBQVUvRTtBQUNyQztBQUVPLFNBQVMrSSxRQUFTb0IsT0FBZ0Y7SUFFeEcsSUFBSSxVQUFVQSxRQUFRL0gsV0FBVyxFQUNoQytILFVBQVVBLFFBQVEvSCxXQUFXLENBQUNFLElBQUk7SUFDbkMsSUFBSSxVQUFVNkgsU0FDYkEsVUFBVUEsUUFBUTdILElBQUk7SUFDdkIsSUFBSSxVQUFVNkgsUUFBUS9ILFdBQVcsRUFDaEMrSCxVQUFVQSxRQUFRL0gsV0FBVztJQUU5QixJQUFJLFVBQVUrSCxTQUFTO1FBQ3RCLE1BQU1wRixPQUFPc0MsZUFBZTBCLE9BQU8sQ0FBRW9CO1FBQ3JDLElBQUdwRixTQUFTLE1BQ1gsTUFBTSxJQUFJM0QsTUFBTTtRQUVqQixPQUFPMkQ7SUFDUjtJQUVBLElBQUksQ0FBR29GLENBQUFBLG1CQUFtQkMsT0FBTSxHQUMvQixNQUFNLElBQUloSixNQUFNO0lBRWpCLE1BQU0yRCxPQUFPb0YsUUFBUXRELFlBQVksQ0FBQyxTQUFTc0QsUUFBUXZELE9BQU8sQ0FBQ3lELFdBQVc7SUFFdEUsSUFBSSxDQUFFdEYsS0FBS3VGLFFBQVEsQ0FBQyxNQUNuQixNQUFNLElBQUlsSixNQUFNLENBQUMsUUFBUSxFQUFFMkQsS0FBSyxzQkFBc0IsQ0FBQztJQUV4RCxPQUFPQTtBQUNSO0FBRU8sU0FBUytELFlBQThDL0QsSUFBWTtJQUN6RSxPQUFPc0MsZUFBZXpDLEdBQUcsQ0FBQ0c7QUFDM0I7QUFFTyxTQUFTOEQsWUFBb0M5RCxJQUFZO0lBQy9ELE9BQU8rRCxZQUE2Qi9ELE1BQU1jLElBQUk7QUFDL0M7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RFeUM7QUFFbEMsTUFBTTJFO0FBQU87QUFFcEIsaUVBQWVySyxJQUFJQSxFQUF3QjtBQXVCcEMsU0FBU0EsS0FBSzZKLElBQVM7SUFFMUIsSUFBSUEsS0FBSzVKLE9BQU8sS0FBS0osYUFBYSxVQUFVZ0ssS0FBSzVKLE9BQU8sRUFDcEQsT0FBT0MsU0FBUzJKO0lBRXBCLE9BQU9PLCtDQUFLQSxDQUFDUDtBQUNqQjtBQUVBLFNBQVMzSixTQVc4QzJKLElBQTJEO0lBRTlHLElBQUlBLEtBQUs1SixPQUFPLEtBQUtKLFdBQ2pCLE1BQU0sSUFBSW9CLE1BQU07SUFFcEIsTUFBTTBFLE9BQU9rRSxLQUFLNUosT0FBTyxDQUFDd0IsT0FBTztJQUVqQyxNQUFNbkIsT0FBT3VKLEtBQUt2SixJQUFJLElBQUlxRixLQUFLckYsSUFBSTtJQUVuQyxJQUFJRCxPQUFPc0YsS0FBS3RGLElBQUk7SUFDcEIsSUFBSXdKLEtBQUt4SixJQUFJLEtBQUtSLFdBQ2RRLE9BQU87V0FBSUE7V0FBU3dKLEtBQUt4SixJQUFJO0tBQUM7SUFFbEMsSUFBSUksUUFBUWtGLEtBQUtsRixLQUFLO0lBQ3RCLElBQUlvSixLQUFLcEosS0FBSyxLQUFLWixXQUNmWSxRQUFRO1dBQUlBO1dBQVVvSixLQUFLcEosS0FBSztLQUFDO0lBRXJDLElBQUlMLFNBQVN1RixLQUFLdkYsTUFBTTtJQUN4QixJQUFJeUosS0FBS3pKLE1BQU0sS0FBS1AsV0FDaEJPLFNBQVNELE9BQU8yQyxNQUFNLENBQUMxQyxRQUFReUosS0FBS3pKLE1BQU07SUFFOUMsMERBQTBEO0lBQzFELElBQUlNLGtCQUFrQmlGLEtBQUtqRixlQUFlO0lBQzFDLElBQUltSixLQUFLbkssT0FBTyxLQUFLRyxXQUNqQixhQUFhO0lBQ2JhLGtCQUFrQm1KLEtBQUtuSixlQUFlLENBQUdtSixLQUFLbkssT0FBTztJQUV6RCxJQUFJZ0MsY0FBY2lFLEtBQUtqRSxXQUFXO0lBQ2xDLElBQUltSSxLQUFLakosR0FBRyxLQUFLZixXQUNiLGFBQWE7SUFDYjZCLGNBQWM7V0FBSUE7V0FBZ0JtSSxLQUFLakosR0FBRztLQUFDO0lBRS9DLE1BQU1DLFNBQVNnSixLQUFLaEosTUFBTSxJQUFJOEUsS0FBSzlFLE1BQU07SUFFekMsTUFBTXlKLHFCQUFxQlQsS0FBSzVKLE9BQU87UUFFbkMsT0FBeUJ3QixVQUFVO1lBQ3hDbkI7WUFDQUQ7WUFDQUk7WUFDQUw7WUFDQU07WUFDQWdCO1lBQ0FiO1FBQ0QsRUFBRTtJQUdBO0lBRUEsT0FBT3lKO0FBQ1gsRUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNJcUM7QUFDSjtBQUVTO0FBQ1Y7QUFFekIsTUFBTUMsa0JBQWtCdkssK0NBQUlBLENBQUM7SUFDbkNTLE9BQU87UUFBQztRQUFPO0tBQUs7SUFDcEJJLFFBQVE1Qiw2Q0FBU0EsQ0FBQzhCLElBQUk7SUFDdEJILEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztBQUNoQztJQUVVLFVBQVUsR0FBRyxJQUFJc0UsTUFBYztJQUMvQixVQUFVLENBQVM7SUFDbkIsR0FBRyxDQUFnQjtJQUU1QmpELGFBQWM7UUFFYixLQUFLO1FBRUwsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJZCxRQUFTLE9BQU95RjtZQUU5QixNQUFNNEQsVUFBVUMsYUFBYSxDQUFDQyxRQUFRLENBQUMsSUFBSSxDQUFDakssS0FBSyxDQUFDa0ssRUFBRSxJQUFJLFVBQVU7Z0JBQUNDLE9BQU87WUFBRztZQUU3RSxJQUFJSixVQUFVQyxhQUFhLENBQUNJLFVBQVUsRUFBRztnQkFDeENqRTtnQkFDQTtZQUNEO1lBRUE0RCxVQUFVQyxhQUFhLENBQUNLLGdCQUFnQixDQUFDLG9CQUFvQjtnQkFDNURsRTtZQUNEO1FBQ0Q7UUFHQSxNQUFNbUUsTUFBTSxJQUFJLENBQUN0SyxLQUFLLENBQUNzSyxHQUFHO1FBQzFCLElBQUdBLFFBQVEsTUFDVixNQUFNLElBQUk5SixNQUFNO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUc4SixHQUFHLENBQUMsRUFBRSxLQUFLLE1BQ3JCLENBQUMsRUFBRUMsT0FBT0MsUUFBUSxDQUFDQyxRQUFRLENBQUMsRUFBRUgsSUFBSSxDQUFDLEdBQ25DQTtRQUVSLElBQUlJLGlCQUFrQixDQUFDQztZQUV0QixLQUFJLElBQUlDLFlBQVlELFVBQ25CLEtBQUksSUFBSUUsWUFBWUQsU0FBU0UsVUFBVSxDQUN0QyxJQUFHRCxvQkFBb0JyQixTQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDcUIsU0FBUzdFLE9BQU87UUFFakMsR0FBRytFLE9BQU8sQ0FBRTlELFVBQVU7WUFBRStELFdBQVU7WUFBTUMsU0FBUTtRQUFLO1FBR3JELEtBQUssSUFBSUMsUUFBUWpFLFNBQVNwQixnQkFBZ0IsQ0FBQyxLQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDcUYsS0FBS2xGLE9BQU87SUFDM0I7SUFHYW1GLFlBQVk7UUFDeEIsT0FBTztZQUNOO1lBQ0E7WUFDQTtTQUNBO0lBQ0M7SUFFT0MsbUJBQW1CckMsT0FBZSxFQUFFc0MsS0FBMEIsRUFBRWpDLElBQTZDLEVBQUU7UUFFeEgsTUFBTWtDLEtBQUtELEtBQUssQ0FBQyxXQUFXO1FBQzVCLE1BQU1wTSxVQUFVb00sS0FBSyxDQUFDLGFBQWE7UUFFbkMsSUFBSUUsUUFBdUM7UUFDM0MsSUFBSUQsT0FBT2xNLFdBQ1ZtTSxRQUFRRCxHQUFHbEM7YUFDUCxJQUFJbkssWUFBWUcsV0FBWTtZQUUvQmdLLEtBQWFuSixlQUFlLEdBQUcsQ0FBQ3VMO2dCQUVoQyxNQUFNdk0sVUFBVUwsNENBQUksQ0FBQyxFQUFFNE0sSUFBSSxDQUFDO2dCQUU1QixJQUFJQyxRQUFReE0sUUFBUTRHLGdCQUFnQixDQUFDO2dCQUVyQyxPQUFPLENBQUM2RixJQUFhQyxJQUFZVDtvQkFFaEMsc0JBQXNCO29CQUN0QixLQUFJLElBQUlVLFFBQVFILE1BQ2ZHLEtBQUtDLFdBQVcsR0FBR1gsS0FBS2pGLFlBQVksQ0FBQzJGLEtBQUszRixZQUFZLENBQUM7b0JBRXhELE9BQU9oSCxRQUFRSyxTQUFTLENBQUM7Z0JBQzFCO1lBRUQ7WUFFQWlNLFFBQVEsTUFBTU8scUJBQXFCdk0sK0NBQUlBLENBQUM2SjtZQUFPO1FBQ2hEO1FBRUEsSUFBR21DLFVBQVUsTUFDWixNQUFNLElBQUkvSyxNQUFNLENBQUMsK0JBQStCLEVBQUV1SSxRQUFRLENBQUMsQ0FBQztRQUU3RCxPQUFPZix3REFBTUEsQ0FBQ2UsU0FBU3dDO0lBQ3hCO0lBRUEsTUFBTSxPQUFPLENBQUN4QyxPQUFlO1FBRTVCQSxVQUFVQSxRQUFRVSxXQUFXO1FBRTdCLElBQUlWLFlBQVksZUFBZUEsWUFBWSxnQkFBZ0IsQ0FBRUEsUUFBUVcsUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQzFDLEdBQUcsQ0FBRStCLFVBQzFHO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQ3BCLEdBQUcsQ0FBQ29CO1FBRXBCLE1BQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSwwQkFBMEI7UUFFMUMsTUFBTWdELFlBQVksSUFBSSxDQUFDWixTQUFTO1FBQ2hDLE1BQU1BLFlBQVksTUFBTXpLLFFBQVFrRSxHQUFHLENBQUVtSCxVQUFVM0ssR0FBRyxDQUFFNEssQ0FBQUEsT0FBUUEsS0FBS0MsUUFBUSxDQUFDLFNBQzdEQyxRQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRW5ELFFBQVEsQ0FBQyxFQUFFaUQsS0FBSyxDQUFDLEVBQUUsUUFDcERHLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFcEQsUUFBUSxDQUFDLEVBQUVpRCxLQUFLLENBQUMsRUFBRTtRQUVqRSxNQUFNWCxRQUE2QixDQUFDO1FBQ3BDLElBQUksSUFBSWUsSUFBSSxHQUFHQSxJQUFJTCxVQUFVNU0sTUFBTSxFQUFFLEVBQUVpTixFQUN0QyxJQUFJakIsU0FBUyxDQUFDaUIsRUFBRSxLQUFLaE4sV0FDcEJpTSxLQUFLLENBQUNVLFNBQVMsQ0FBQ0ssRUFBRSxDQUFDLEdBQUdqQixTQUFTLENBQUNpQixFQUFFO1FBRXBDLE1BQU1uTixVQUFVb00sS0FBSyxDQUFDLGFBQWE7UUFDbkMsTUFBTWxMLE1BQVVrTCxLQUFLLENBQUMsWUFBWTtRQUVsQyxNQUFNakMsT0FBZ0Q7WUFDckQsR0FBR25LLFlBQVlHLGFBQWE7Z0JBQUNIO1lBQU8sQ0FBQztZQUNyQyxHQUFHa0IsUUFBWWYsYUFBYTtnQkFBQ2U7WUFBRyxDQUFDO1FBQ2xDO1FBRUEsT0FBTyxJQUFJLENBQUNpTCxrQkFBa0IsQ0FBQ3JDLFNBQVNzQyxPQUFPakM7SUFFaEQ7QUFDRDtBQUVBLGlDQUFpQztBQUNqQyxJQUFJM0MsZUFBZXpDLEdBQUcsQ0FBQyxpQkFBaUI1RSxXQUN2QzRJLHdEQUFNQSxDQUFDLGFBQWE4QjtBQU9yQixtREFBbUQ7QUFDbkQsbURBQW1EO0FBQ25ELG1EQUFtRDtBQUVuRCxlQUFlcUMsV0FBV0UsR0FBZSxFQUFFQyxhQUFzQixLQUFLO0lBRXJFLE1BQU1DLFVBQVVELGFBQ1Q7UUFBQ0UsU0FBUTtZQUFDLGFBQWE7UUFBTTtJQUFDLElBQzlCLENBQUM7SUFHUixNQUFNQyxXQUFXLE1BQU1DLE1BQU1MLEtBQUtFO0lBQ2xDLElBQUdFLFNBQVNFLE1BQU0sS0FBSyxLQUN0QixPQUFPdk47SUFFUixJQUFJa04sY0FBY0csU0FBU0QsT0FBTyxDQUFDeEksR0FBRyxDQUFDLGNBQWUsT0FDckQsT0FBTzVFO0lBRVIsT0FBTyxNQUFNcU4sU0FBUzNMLElBQUk7QUFDM0I7QUFDQSxlQUFlb0wsUUFBUUcsR0FBVyxFQUFFQyxhQUFzQixLQUFLO0lBRTlELGlDQUFpQztJQUNqQyxJQUFHQSxjQUFjLE1BQU1ILFdBQVdFLEtBQUtDLGdCQUFnQmxOLFdBQ3RELE9BQU9BO0lBRVIsSUFBSTtRQUNILE9BQU8sQ0FBQyxNQUFNLE1BQU0sQ0FBQyx1QkFBdUIsR0FBR2lOLElBQUcsRUFBR08sT0FBTztJQUM3RCxFQUFFLE9BQU1DLEdBQUc7UUFDVnRHLFFBQVF1RyxHQUFHLENBQUNEO1FBQ1osT0FBT3pOO0lBQ1I7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEx5QztBQUNUO0FBQ1k7QUFFNUMsYUFBYTtBQUNiLGdHQUFnRztBQUNoRyxxRUFBcUU7QUFFOUQsTUFBTTJOLG1CQUFrRHhOLDhDQUFJQSxDQUFDO0lBQ2hFYSxRQUFRNUIsNENBQVNBLENBQUM4QixJQUFJO0lBQ3RCSCxLQUFLO1FBQUMsQ0FBQyxxQkFBcUIsQ0FBQztLQUFDO0lBQzlCSCxPQUFPO1FBQUM7S0FBTztBQUNuQjtJQUVJLEtBQUssQ0FBVztJQUNoQixNQUFNLENBQUs7SUFFWCxPQUFPLENBQVc7SUFFbEIsZ0JBQWdCO0lBQ2hCd0IsWUFBWXdMLElBQUksQ0FBQyxDQUFDLEVBQUUxSCxPQUFPLElBQUksQ0FBRTtRQUU3QixLQUFLO1FBRUwsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUN6RixJQUFJLENBQUNvRyxZQUFZLENBQUM7UUFFcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUNwRyxJQUFJLENBQUNvTixhQUFhO1FBRXRDLElBQUczSCxNQUNDLElBQUksQ0FBQ0EsSUFBSTtJQUNqQjtJQUVVQSxPQUFPO1FBRWIsMkJBQTJCO1FBQzNCLElBQUksQ0FBQzRILGNBQWMsQ0FBQyxJQUFJLENBQUNyTixJQUFJLENBQUNnTSxXQUFXO0lBQzdDO0lBRUEsTUFBTTtJQUNOLElBQWNzQixPQUFPO1FBQ2pCLE9BQU8sSUFBSSxDQUFDbk4sS0FBSyxDQUFDbU4sSUFBSSxJQUFJO0lBQzlCO0lBRVVDLGNBQWN0TCxLQUFhLEVBQUs7UUFFdEMsTUFBTXFMLE9BQU8sSUFBSSxDQUFDQSxJQUFJO1FBRXRCLElBQUlBLFNBQVMsUUFDVCxPQUFPRSxLQUFLQyxLQUFLLENBQUN4TDtRQUN0QixJQUFJcUwsU0FBUyxNQUFNO1lBQ2YseUJBQXlCO1lBQ3pCLE1BQU0xTCxPQUFPL0IsT0FBTzZOLElBQUksQ0FBRSxJQUFJLENBQUNDLE9BQU87WUFDdEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJQyxZQUFZaE0sTUFBTSxDQUFDLE9BQU8sRUFBRUssTUFBTSxDQUFDO1lBQ25ELE9BQU8sSUFBSSxDQUFDNEwsSUFBSSxJQUFLaE8sT0FBT2lPLE1BQU0sQ0FBQ2xNO1FBQ3ZDO1FBQ0EsTUFBTSxJQUFJakIsTUFBTTtJQUNwQjtJQUVBLElBQUksR0FBcUIsS0FBSztJQUVwQmtOLEtBQUssR0FBR2pNLElBQVcsRUFBRTtRQUMzQixPQUFPLElBQUksQ0FBQyxJQUFJLElBQUtBO0lBQ3pCO0lBRVV5TCxlQUFlcEwsS0FBYSxFQUFFO1FBRXBDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDc0wsYUFBYSxDQUFDdEw7UUFDakM7OzttQkFHVyxHQUVYLElBQUksQ0FBQyxPQUFPLENBQUNNLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTTtJQUN6QztJQUVVb0wsVUFBOEI7UUFDcEMsT0FBTyxDQUFDO0lBQ1o7QUFRSjtBQUVBLElBQUkvRyxlQUFlekMsR0FBRyxDQUFDLG1CQUFtQjVFLFdBQ3RDNEksdURBQU1BLENBQUMsZUFBZStFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RjRCO0FBQ3pCO0FBR3RCLGVBQWVhLEtBQXlCcEMsR0FBc0IsRUFBRSxHQUFHL0osSUFBVztJQUVqRixNQUFNeUosT0FBT3RNLDJDQUFJQSxDQUFDNE0sUUFBUS9KO0lBRTFCLElBQUl5SixnQkFBZ0IyQyxrQkFDbEIsTUFBTSxJQUFJck4sTUFBTSxDQUFDLDJCQUEyQixDQUFDO0lBRS9DLE9BQU8sTUFBTTZFLGtEQUFVQSxDQUFJNkY7QUFDL0I7QUFFTyxTQUFTNEMsU0FBNkJ0QyxHQUFzQixFQUFFLEdBQUcvSixJQUFXO0lBRS9FLE1BQU15SixPQUFPdE0sMkNBQUlBLENBQUM0TSxRQUFRL0o7SUFFMUIsSUFBSXlKLGdCQUFnQjJDLGtCQUNsQixNQUFNLElBQUlyTixNQUFNLENBQUMsMkJBQTJCLENBQUM7SUFFL0MsT0FBT2dJLHNEQUFjQSxDQUFJMEM7QUFDN0IsRUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4TE8sTUFBTTZDLHFCQUEyREM7SUFFOUQzRCxpQkFBaUU4QyxJQUFPLEVBQzdEYyxRQUFvQyxFQUNwQzFCLE9BQTJDLEVBQVE7UUFFdEUsWUFBWTtRQUNaLE9BQU8sS0FBSyxDQUFDbEMsaUJBQWlCOEMsTUFBTWMsVUFBVTFCO0lBQy9DO0lBRVMyQixjQUE4REMsS0FBZ0IsRUFBVztRQUNqRyxPQUFPLEtBQUssQ0FBQ0QsY0FBY0M7SUFDNUI7SUFFU0Msb0JBQW9FakIsSUFBTyxFQUNoRWtCLFFBQW9DLEVBQ3BDOUIsT0FBeUMsRUFBUTtRQUVwRSxZQUFZO1FBQ1osS0FBSyxDQUFDNkIsb0JBQW9CakIsTUFBTWtCLFVBQVU5QjtJQUMzQztBQUNEO0FBRU8sTUFBTStCLHFCQUE2Q0M7SUFFekQvTSxZQUFZMkwsSUFBTyxFQUFFMUwsSUFBVSxDQUFFO1FBQ2hDLEtBQUssQ0FBQzBMLE1BQU07WUFBQ3FCLFFBQVEvTTtRQUFJO0lBQzFCO0lBRUEsSUFBYTBMLE9BQVU7UUFBRSxPQUFPLEtBQUssQ0FBQ0E7SUFBVztBQUNsRDtBQU1PLFNBQVNzQixXQUFpRkMsRUFBa0IsRUFBRUMsT0FBZTtJQUluSSxJQUFJLENBQUdELENBQUFBLGNBQWNWLFdBQVUsR0FDOUIsT0FBT1U7SUFFUixrQkFBa0I7SUFDbEIsYUFBYTtJQUNiLE1BQU1FLDBCQUEwQkY7UUFFL0IsR0FBRyxHQUFHLElBQUlYLGVBQXFCO1FBRS9CMUQsaUJBQWlCLEdBQUc1SSxJQUFVLEVBQUU7WUFDL0IsYUFBYTtZQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQzRJLGdCQUFnQixJQUFJNUk7UUFDckM7UUFDQTJNLG9CQUFvQixHQUFHM00sSUFBVSxFQUFFO1lBQ2xDLGFBQWE7WUFDYixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMyTSxtQkFBbUIsSUFBSTNNO1FBQ3hDO1FBQ0F5TSxjQUFjLEdBQUd6TSxJQUFVLEVBQUU7WUFDNUIsYUFBYTtZQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQ3lNLGFBQWEsSUFBSXpNO1FBQ2xDO0lBQ0Q7SUFFQSxPQUFPbU47QUFDUjtBQUVBLG1EQUFtRDtBQUNuRCxtREFBbUQ7QUFDbkQsbURBQW1EO0FBRzVDLFNBQVNDLGFBQWFILEVBQVMsRUFBRUksUUFBZ0I7SUFFdkQsSUFBSUMsV0FBV0wsR0FBR00sWUFBWSxHQUFHQyxLQUFLLENBQUMsR0FBRSxDQUFDLEdBQUdDLE1BQU0sQ0FBQ3JDLENBQUFBLElBQUssQ0FBR0EsQ0FBQUEsYUFBYXNDLFVBQVMsR0FBS0MsT0FBTztJQUU5RixLQUFJLElBQUlsRSxRQUFRNkQsU0FDZixJQUFHN0QsS0FBS21FLE9BQU8sQ0FBQ1AsV0FDZixPQUFPNUQ7SUFFVCxPQUFPO0FBQ1I7Ozs7Ozs7Ozs7Ozs7O0FDckYyRDtBQUk3QjtBQWtCOUIsU0FBU29FLGNBQWNuTCxJQUFhO0lBQ25DLElBQUdBLFNBQVMvRSxXQUNYLE9BQU87SUFDUixPQUFPLENBQUMsSUFBSSxFQUFFK0UsS0FBSyxPQUFPLEVBQUVBLEtBQUssR0FBRyxDQUFDO0FBQ3RDO0FBRUEsU0FBU29MLFNBQVNULFFBQWdCLEVBQUVVLGlCQUE4RCxFQUFFQyxTQUE0Q3hJLFFBQVE7SUFFdkosSUFBSXVJLHNCQUFzQnBRLGFBQWEsT0FBT29RLHNCQUFzQixVQUFVO1FBQzdFQyxTQUFTRDtRQUNUQSxvQkFBb0JwUTtJQUNyQjtJQUVBLE9BQU87UUFBQyxDQUFDLEVBQUUwUCxTQUFTLEVBQUVRLGNBQWNFLG1CQUF1QyxDQUFDO1FBQUVDO0tBQU87QUFDdEY7QUFPQSxlQUFlQyxHQUF3QlosUUFBZ0IsRUFDakRVLGlCQUF3RSxFQUN4RUMsU0FBOEN4SSxRQUFRO0lBRTNELENBQUM2SCxVQUFVVyxPQUFPLEdBQUdGLFNBQVNULFVBQVVVLG1CQUFtQkM7SUFFM0QsSUFBSUUsU0FBUyxNQUFNQyxJQUFPZCxVQUFVVztJQUNwQyxJQUFHRSxXQUFXLE1BQ2IsTUFBTSxJQUFJblAsTUFBTSxDQUFDLFFBQVEsRUFBRXNPLFNBQVMsVUFBVSxDQUFDO0lBRWhELE9BQU9hO0FBQ1I7QUFPQSxlQUFlQyxJQUF5QmQsUUFBZ0IsRUFDbERVLGlCQUF3RSxFQUN4RUMsU0FBOEN4SSxRQUFRO0lBRTNELENBQUM2SCxVQUFVVyxPQUFPLEdBQUdGLFNBQVNULFVBQVVVLG1CQUFtQkM7SUFFM0QsTUFBTWxHLFVBQVVrRyxPQUFPOUosYUFBYSxDQUFjbUo7SUFDbEQsSUFBSXZGLFlBQVksTUFDZixPQUFPO0lBRVIsT0FBTyxNQUFNbkUsdURBQWVBLENBQUttRTtBQUNsQztBQU9BLGVBQWVzRyxJQUF5QmYsUUFBZ0IsRUFDbERVLGlCQUF3RSxFQUN4RUMsU0FBOEN4SSxRQUFRO0lBRTNELENBQUM2SCxVQUFVVyxPQUFPLEdBQUdGLFNBQVNULFVBQVVVLG1CQUFtQkM7SUFFM0QsTUFBTVYsV0FBV1UsT0FBTzVKLGdCQUFnQixDQUFjaUo7SUFFdEQsSUFBSXhOLE1BQU07SUFDVixNQUFNd08sV0FBVyxJQUFJNU8sTUFBbUI2TixTQUFTNVAsTUFBTTtJQUN2RCxLQUFJLElBQUlvSyxXQUFXd0YsU0FDbEJlLFFBQVEsQ0FBQ3hPLE1BQU0sR0FBRzhELHVEQUFlQSxDQUFLbUU7SUFFdkMsT0FBTyxNQUFNN0ksUUFBUWtFLEdBQUcsQ0FBQ2tMO0FBQzFCO0FBT0EsZUFBZUMsSUFBeUJqQixRQUFnQixFQUNsRFUsaUJBQThDLEVBQzlDakcsT0FBbUI7SUFFeEIsTUFBTXlHLE1BQU1ULFNBQVNULFVBQVVVLG1CQUFtQmpHO0lBRWxELE1BQU1vRyxTQUFTLEdBQUksQ0FBQyxFQUFFLENBQXdCTSxPQUFPLENBQWNELEdBQUcsQ0FBQyxFQUFFO0lBQ3pFLElBQUdMLFdBQVcsTUFDYixPQUFPO0lBRVIsT0FBTyxNQUFNdkssdURBQWVBLENBQUl1SztBQUNqQztBQU9BLFNBQVNPLE9BQTRCcEIsUUFBZ0IsRUFDL0NVLGlCQUF3RSxFQUN4RUMsU0FBOEN4SSxRQUFRO0lBRTNELENBQUM2SCxVQUFVVyxPQUFPLEdBQUdGLFNBQVNULFVBQVVVLG1CQUFtQkM7SUFFM0QsTUFBTWxHLFVBQVVrRyxPQUFPOUosYUFBYSxDQUFjbUo7SUFFbEQsSUFBSXZGLFlBQVksTUFDZixNQUFNLElBQUkvSSxNQUFNLENBQUMsUUFBUSxFQUFFc08sU0FBUyxVQUFVLENBQUM7SUFFaEQsT0FBT3RHLHNEQUFjQSxDQUFLZTtBQUMzQjtBQU9BLFNBQVM0RyxRQUE2QnJCLFFBQWdCLEVBQ2hEVSxpQkFBd0UsRUFDeEVDLFNBQThDeEksUUFBUTtJQUUzRCxDQUFDNkgsVUFBVVcsT0FBTyxHQUFHRixTQUFTVCxVQUFVVSxtQkFBbUJDO0lBRTNELE1BQU1WLFdBQVdVLE9BQU81SixnQkFBZ0IsQ0FBY2lKO0lBRXRELElBQUl4TixNQUFNO0lBQ1YsTUFBTXFPLFNBQVMsSUFBSXpPLE1BQVU2TixTQUFTNVAsTUFBTTtJQUM1QyxLQUFJLElBQUlvSyxXQUFXd0YsU0FDbEJZLE1BQU0sQ0FBQ3JPLE1BQU0sR0FBR2tILHNEQUFjQSxDQUFLZTtJQUVwQyxPQUFPb0c7QUFDUjtBQU9BLFNBQVNTLFFBQTZCdEIsUUFBZ0IsRUFDaERVLGlCQUE4QyxFQUM5Q2pHLE9BQW1CO0lBRXhCLE1BQU15RyxNQUFNVCxTQUFTVCxVQUFVVSxtQkFBbUJqRztJQUVsRCxNQUFNb0csU0FBUyxHQUFJLENBQUMsRUFBRSxDQUF3Qk0sT0FBTyxDQUFjRCxHQUFHLENBQUMsRUFBRTtJQUN6RSxJQUFHTCxXQUFXLE1BQ2IsT0FBTztJQUVSLE9BQU9uSCxzREFBY0EsQ0FBSW1IO0FBQzFCO0FBRUEscUJBQXFCO0FBRXJCLFNBQVNNLFFBQTJCbkIsUUFBZ0IsRUFBRXZGLE9BQWdCO0lBRXJFLE1BQU0sS0FBTTtRQUNYLElBQUlvRyxTQUFTcEcsUUFBUTBHLE9BQU8sQ0FBSW5CO1FBRWhDLElBQUlhLFdBQVcsTUFDZCxPQUFPQTtRQUVSLE1BQU1VLE9BQU85RyxRQUFRK0csV0FBVztRQUNoQyxJQUFJLENBQUcsV0FBVUQsSUFBRyxHQUNuQixPQUFPO1FBRVI5RyxVQUFVLEtBQXFCMUosSUFBSTtJQUNwQztBQUNEO0FBR0EsUUFBUTtBQUNSTixnREFBSUEsQ0FBQ21RLEVBQUUsR0FBSUE7QUFDWG5RLGdEQUFJQSxDQUFDcVEsR0FBRyxHQUFHQTtBQUNYclEsZ0RBQUlBLENBQUNzUSxHQUFHLEdBQUdBO0FBQ1h0USxnREFBSUEsQ0FBQ3dRLEdBQUcsR0FBR0E7QUFFWCxPQUFPO0FBQ1B4USxnREFBSUEsQ0FBQzJRLE1BQU0sR0FBSUE7QUFDZjNRLGdEQUFJQSxDQUFDNFEsT0FBTyxHQUFHQTtBQUNmNVEsZ0RBQUlBLENBQUM2USxPQUFPLEdBQUdBO0FBRWY3USxnREFBSUEsQ0FBQzBRLE9BQU8sR0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM01jO0FBRVA7QUFDVTtBQUVoQyxhQUFhO0FBRWIsaUJBQWlCO0FBQ2pCLHNCQUFzQjtBQUNNO0FBQ007QUFFYTtBQUN1QztBQUN0QztBQUNuQjtBQUM3QixpRUFBZTFRLGdEQUFJQSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZHFDO0FBQzRCOztVQUVoRmlSOztJQUdELFFBQVE7OztJQUlSLFdBQVc7OztHQVBWQSxVQUFBQTtBQVlFLE1BQU03SCxZQUE0QjtBQUNsQyxNQUFNQyxVQUEwQjtBQUNoQyxNQUFNQyxhQUE2QjtBQUNuQyxNQUFNQyxnQkFBZ0M7QUFFdEMsTUFBTTVGO0lBRVQsS0FBSyxDQUFtQjtJQUV4Qiw2Q0FBNkM7SUFDN0MxQixZQUFZMEosT0FBeUIsSUFBSSxDQUFFO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUdBO0lBQ2pCO0lBRUEsT0FBT3ZDLFVBQWNBLFFBQVE7SUFDN0IsT0FBT0MsUUFBY0EsTUFBTTtJQUMzQixPQUFPQyxXQUFjQSxTQUFTO0lBQzlCLE9BQU9DLGNBQWNBLFlBQVk7SUFFakMySCxHQUFHOU8sS0FBWSxFQUFFO1FBRWIsSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJbkIsTUFBTTtRQUVwQixNQUFNMEssT0FBTyxJQUFJLENBQUMsS0FBSztRQUV2QixJQUFJdkosUUFBUWdILFdBQWUsQ0FBRSxJQUFJLENBQUNQLFNBQVMsRUFDdkMsT0FBTztRQUNYLElBQUl6RyxRQUFRaUgsU0FBZSxDQUFFLElBQUksQ0FBQy9ELE9BQU8sRUFDckMsT0FBTztRQUNYLElBQUlsRCxRQUFRa0gsWUFBZSxDQUFFLElBQUksQ0FBQzZILFVBQVUsRUFDeEMsT0FBTztRQUNYLElBQUkvTyxRQUFRbUgsZUFBZSxDQUFFLElBQUksQ0FBQzNELGFBQWEsRUFDM0MsT0FBTztRQUVYLE9BQU87SUFDWDtJQUVBLE1BQU13TCxLQUFLaFAsS0FBWSxFQUFFO1FBRXJCLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSW5CLE1BQU07UUFFcEIsTUFBTTBLLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsSUFBSTRFLFdBQVcsSUFBSTVPO1FBRW5CLElBQUlTLFFBQVFnSCxTQUNSbUgsU0FBU2pQLElBQUksQ0FBRSxJQUFJLENBQUN5SCxXQUFXO1FBQ25DLElBQUkzRyxRQUFRaUgsT0FDUmtILFNBQVNqUCxJQUFJLENBQUUsSUFBSSxDQUFDK1AsU0FBUztRQUNqQyxJQUFJalAsUUFBUWtILFVBQ1JpSCxTQUFTalAsSUFBSSxDQUFFLElBQUksQ0FBQzZILFlBQVk7UUFDcEMsSUFBSS9HLFFBQVFtSCxhQUNSZ0gsU0FBU2pQLElBQUksQ0FBRSxJQUFJLENBQUN1RSxlQUFlO1FBRXZDLE1BQU0xRSxRQUFRa0UsR0FBRyxDQUFDa0w7SUFDdEI7SUFFQSw0REFBNEQ7SUFFNUQsSUFBSTFILFlBQVk7UUFDWixJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssTUFDZCxNQUFNLElBQUk1SCxNQUFNO1FBRXBCLE9BQU9pRyxlQUFlekMsR0FBRyxDQUFFbUUseURBQU9BLENBQUMsSUFBSSxDQUFDLEtBQUssT0FBUS9JO0lBQ3pEO0lBRUEsTUFBTWtKLGNBQTREO1FBQzlELElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSTlILE1BQU07UUFFcEIsT0FBTyxNQUFNaUcsZUFBZTZCLFdBQVcsQ0FBRUgseURBQU9BLENBQUMsSUFBSSxDQUFDLEtBQUs7SUFDL0Q7SUFFQSwwREFBMEQ7SUFFMUQsSUFBSXRELFVBQVU7UUFFVixJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssTUFDZCxNQUFNLElBQUlyRSxNQUFNO1FBQ3BCLE1BQU0wSyxPQUFPLElBQUksQ0FBQyxLQUFLO1FBRXZCLElBQUksQ0FBRSxJQUFJLENBQUM5QyxTQUFTLEVBQ2hCLE9BQU87UUFFWCxNQUFNMUcsT0FBT3dHLDZEQUFXQSxDQUFDQyx5REFBT0EsQ0FBQytDO1FBRWpDLElBQUksQ0FBRS9ILDBEQUFrQkEsSUFDcEIsT0FBTztRQUVYLE9BQU96QixLQUFLcUQsY0FBYztJQUM5QjtJQUVBLE1BQU02TCxZQUFZO1FBRWQsSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJcFEsTUFBTTtRQUVwQixNQUFNMEssT0FBTyxJQUFJLENBQUMsS0FBSztRQUV2QixNQUFNckwsT0FBTyxNQUFNLElBQUksQ0FBQ3lJLFdBQVcsSUFBSSw2Q0FBNkM7UUFFcEYsTUFBTWlJLHdEQUFvQkE7UUFFMUIsTUFBTTFRLEtBQUtpRixnQkFBZ0I7SUFDL0I7SUFFQSw2REFBNkQ7SUFFN0QsSUFBSTRMLGFBQWE7UUFFYixJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssTUFDZCxNQUFNLElBQUlsUSxNQUFNO1FBQ3BCLE1BQU0wSyxPQUFPLElBQUksQ0FBQyxLQUFLO1FBRXZCLElBQUksQ0FBRSxJQUFJLENBQUM5QyxTQUFTLEVBQ2hCLE9BQU87UUFFWCxNQUFNdkksT0FBT3FJLDZEQUFXQSxDQUFDQyx5REFBT0EsQ0FBQytDO1FBQ2pDLE9BQU9BLGdCQUFnQnJMO0lBQzNCO0lBRUEsTUFBTTZJLGVBQTZEO1FBRS9ELElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSWxJLE1BQU07UUFFcEIsTUFBTTBLLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsTUFBTXJMLE9BQU8sTUFBTSxJQUFJLENBQUN5SSxXQUFXO1FBRW5DLElBQUk0QyxnQkFBZ0JyTCxNQUNoQixPQUFPcUw7UUFFWCxPQUFPO1FBRVAsSUFBSSxtQkFBbUJBLE1BQU07WUFDekIsTUFBTUEsS0FBSzJGLGFBQWE7WUFDeEIsT0FBTzNGO1FBQ1g7UUFFQSxNQUFNLEVBQUNoRixPQUFPLEVBQUVDLE9BQU8sRUFBQyxHQUFHekYsUUFBUTBGLGFBQWE7UUFFL0M4RSxLQUFhMkYsYUFBYSxHQUFVM0s7UUFDcENnRixLQUFhN0Usb0JBQW9CLEdBQUdGO1FBRXJDLE1BQU1EO1FBRU4sT0FBT2dGO0lBQ1g7SUFFQSxnRUFBZ0U7SUFFaEUsSUFBSS9GLGdCQUFnQjtRQUVoQixJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssTUFDZCxNQUFNLElBQUkzRSxNQUFNO1FBQ3BCLE1BQU0wSyxPQUFPLElBQUksQ0FBQyxLQUFLO1FBRXZCLElBQUksQ0FBRSxJQUFJLENBQUN3RixVQUFVLEVBQ2pCLE9BQU87UUFFWCxPQUFPLG1CQUFtQnhGLFFBQVFBLEtBQUsvRixhQUFhO0lBQ3hEO0lBRUEsTUFBTUMsa0JBQXNDO1FBRXhDLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSTVFLE1BQU07UUFDcEIsTUFBTTBLLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsTUFBTXJMLE9BQU8sTUFBTSxJQUFJLENBQUM2SSxZQUFZO1FBRXBDLE1BQU03SSxLQUFLdUYsZUFBZTtRQUUxQixPQUFPLEtBQXNCRixJQUFJO0lBQ3JDO0lBRUEsZ0VBQWdFO0lBRWhFNEwsVUFBVTtRQUVOLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSXRRLE1BQU07UUFFcEIsSUFBSW1CLFFBQWU7UUFFbkIsSUFBSSxJQUFJLENBQUN5RyxTQUFTLEVBQ2R6RyxTQUFTZ0g7UUFDYixJQUFJLElBQUksQ0FBQzlELE9BQU8sRUFDWmxELFNBQVNpSDtRQUNiLElBQUksSUFBSSxDQUFDOEgsVUFBVSxFQUNmL08sU0FBU2tIO1FBQ2IsSUFBSSxJQUFJLENBQUMxRCxhQUFhLEVBQ2xCeEQsU0FBU21IO1FBRWIsT0FBT25IO0lBQ1g7SUFFQW9QLFdBQVc7UUFFUCxNQUFNcFAsUUFBUSxJQUFJLENBQUNtUCxPQUFPO1FBQzFCLElBQUlMLEtBQUssSUFBSXZQO1FBRWIsSUFBSVMsUUFBUWdILFNBQ1I4SCxHQUFHNVAsSUFBSSxDQUFDO1FBQ1osSUFBSWMsUUFBUWlILE9BQ1I2SCxHQUFHNVAsSUFBSSxDQUFDO1FBQ1osSUFBSWMsUUFBUWtILFVBQ1I0SCxHQUFHNVAsSUFBSSxDQUFDO1FBQ1osSUFBSWMsUUFBUW1ILGFBQ1IySCxHQUFHNVAsSUFBSSxDQUFDO1FBRVosT0FBTzRQLEdBQUdPLElBQUksQ0FBQztJQUNuQjtBQUNKO0FBRU8sU0FBU3pJLFNBQVMyQyxJQUFpQjtJQUN0QyxJQUFJLFdBQVdBLE1BQ1gsT0FBT0EsS0FBS3ZKLEtBQUs7SUFFckIsT0FBTyxLQUFjQSxLQUFLLEdBQUcsSUFBSXVCLFVBQVVnSTtBQUMvQztBQUVBLDRFQUE0RTtBQUU1RSx1QkFBdUI7QUFDaEIsZUFBZXhFLFFBQTBDd0UsSUFBaUIsRUFBRStGLFNBQVMsS0FBSztJQUU3RixNQUFNdFAsUUFBUTRHLFNBQVMyQztJQUV2QixJQUFJdkosTUFBTStPLFVBQVUsSUFBSU8sUUFDcEIsTUFBTSxJQUFJelEsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBRXZDLE1BQU1tQixNQUFNMkcsV0FBVztJQUV2QixPQUFPRyxZQUFleUM7QUFDMUI7QUFFTyxTQUFTekMsWUFBOEN5QyxJQUFpQixFQUFFK0YsU0FBUyxLQUFLO0lBRTNGLE1BQU10UCxRQUFRNEcsU0FBUzJDO0lBRXZCLElBQUl2SixNQUFNK08sVUFBVSxJQUFJTyxRQUNwQixNQUFNLElBQUl6USxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFFdkMsSUFBSSxDQUFFbUIsTUFBTXlHLFNBQVMsRUFDakIsTUFBTSxJQUFJNUgsTUFBTTtJQUVwQixJQUFJMEssS0FBS2dHLGFBQWEsS0FBS2pLLFVBQ3ZCQSxTQUFTa0ssU0FBUyxDQUFDakc7SUFDdkJ6RSxlQUFlQyxPQUFPLENBQUN3RTtJQUV2QixNQUFNeEosT0FBT3dHLDZEQUFXQSxDQUFDQyx5REFBT0EsQ0FBQytDO0lBRWpDLElBQUksQ0FBR0EsQ0FBQUEsZ0JBQWdCeEosSUFBRyxHQUN0QixNQUFNLElBQUlsQixNQUFNLENBQUMsdUJBQXVCLENBQUM7SUFFN0MsT0FBTzBLO0FBQ1g7QUFFQSwwQkFBMEI7QUFFbkIsZUFBZTdGLFdBQStCNkYsSUFBOEIsRUFBRStGLFNBQThCLEtBQUs7SUFFcEgsTUFBTXRQLFFBQVE0RyxTQUFTMkM7SUFFdkIsSUFBSXZKLE1BQU13RCxhQUFhLEVBQUc7UUFDdEIsSUFBSThMLFdBQVcsT0FDWCxPQUFPLEtBQWMvTCxJQUFJO1FBQzdCLE1BQU0sSUFBSTFFLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztJQUMxQztJQUVBLE1BQU1YLE9BQU8sTUFBTTZHLFFBQVF3RTtJQUUzQixNQUFNdkosTUFBTWlQLFNBQVM7SUFFckIsSUFBSWpSLFNBQVMsT0FBT3NSLFdBQVcsWUFBWSxDQUFDLElBQUlBO0lBQ2hEcFIsS0FBS3dGLFVBQVUsQ0FBQzFGO0lBRWhCLE9BQU9FLEtBQUtxRixJQUFJO0FBQ3BCO0FBQ08sU0FBU3NELGVBQW1DMEMsSUFBOEIsRUFBRStGLFNBQThCLEtBQUs7SUFFbEgsTUFBTXRQLFFBQVE0RyxTQUFTMkM7SUFDdkIsSUFBSXZKLE1BQU13RCxhQUFhLEVBQUc7UUFDdEIsSUFBSThMLFdBQVcsT0FDWCxPQUFPLEtBQWMvTCxJQUFJO1FBQzdCLE1BQU0sSUFBSTFFLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztJQUMxQztJQUVBLE1BQU1YLE9BQU80SSxZQUFZeUM7SUFFekIsSUFBSSxDQUFFdkosTUFBTWtELE9BQU8sRUFDZixNQUFNLElBQUlyRSxNQUFNO0lBRXBCLElBQUliLFNBQVMsT0FBT3NSLFdBQVcsWUFBWSxDQUFDLElBQUlBO0lBQ2hEcFIsS0FBS3dGLFVBQVUsQ0FBQzFGO0lBRWhCLE9BQU9FLEtBQUtxRixJQUFJO0FBQ3BCO0FBQ0EsOEVBQThFO0FBRXZFLGVBQWV3RCxhQUErQ3dDLElBQWlCLEVBQUVrRyxRQUFNLEtBQUssRUFBRUgsU0FBTyxLQUFLO0lBRTdHLE1BQU10UCxRQUFRNEcsU0FBUzJDO0lBRXZCLElBQUlrRyxPQUNBLE9BQU8sTUFBTTFLLFFBQVF3RSxNQUFNK0Y7SUFFL0IsT0FBTyxNQUFNdFAsTUFBTStHLFlBQVk7QUFDbkM7QUFFTyxlQUFldEQsZ0JBQW9DOEYsSUFBOEIsRUFBRWtHLFFBQU0sS0FBSyxFQUFFSCxTQUFPLEtBQUs7SUFFL0csTUFBTXRQLFFBQVE0RyxTQUFTMkM7SUFFdkIsSUFBSWtHLE9BQ0EsT0FBTyxNQUFNL0wsV0FBVzZGLE1BQU0rRjtJQUVsQyxPQUFPLE1BQU10UCxNQUFNeUQsZUFBZTtBQUN0Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7VUN0VVk1Rzs7Ozs7R0FBQUEsY0FBQUE7O1VBUUE2Uzs7SUFFWCxzQkFBc0I7OztJQUduQixzQkFBc0I7O0dBTGRBLGNBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCWiw4QkFBOEI7QUFFOUIsb0JBQW9CO0FBQ3BCLGtGQUFrRjtBQW9CbEYsMkZBQTJGO0FBQzNGLE1BQU1DLGtCQUFtQjtBQUN6QixNQUFNQyx5QkFBeUI7SUFDM0IsU0FBUztJQUNULGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsWUFBWTtJQUNaLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsU0FBUztJQUNULGFBQWE7SUFDYixTQUFTO0lBQ1QsT0FBTztJQUNQLFNBQVM7SUFDVCxTQUFTO0lBQ1QsV0FBVztJQUNYLGFBQWE7SUFDYixTQUFTO0lBQ1QsVUFBVTtBQUNaO0FBQ0ssU0FBUzdTLGlCQUFpQnVLLEtBQXlCO0lBRXpELElBQUlBLFVBQVVuSixhQUNiLE9BQU87SUFFUixJQUFJb0osVUFBVW9JLGdCQUFnQkUsSUFBSSxDQUFDdkksTUFBTTlFLElBQUksQ0FBRSxDQUFDLEVBQUU7SUFDbEQsT0FBT29OLHNCQUFzQixDQUFDckksUUFBK0MsSUFBSUEsUUFBUU8sV0FBVztBQUNyRztBQUVBLHdFQUF3RTtBQUN4RSxNQUFNZ0ksa0JBQWtCO0lBQ3ZCO0lBQU07SUFBVztJQUFTO0lBQWM7SUFBUTtJQUNoRDtJQUFVO0lBQU07SUFBTTtJQUFNO0lBQU07SUFBTTtJQUFNO0lBQVU7SUFDeEQ7SUFBTztJQUFLO0lBQVc7Q0FFdkI7QUFDTSxTQUFTOVMsa0JBQWtCK1MsR0FBdUI7SUFDeEQsT0FBT0QsZ0JBQWdCL0gsUUFBUSxDQUFFaEwsaUJBQWlCZ1Q7QUFDbkQ7QUFFTyxTQUFTdk87SUFDWixPQUFPOEQsU0FBUzBLLFVBQVUsS0FBSyxpQkFBaUIxSyxTQUFTMEssVUFBVSxLQUFLO0FBQzVFO0FBRU8sTUFBTXBCLHVCQUF1Qm5OLHVCQUF1QjtBQUVwRCxlQUFlQTtJQUNsQixJQUFJRCxzQkFDQTtJQUVKLE1BQU0sRUFBQytDLE9BQU8sRUFBRUMsT0FBTyxFQUFDLEdBQUd6RixRQUFRMEYsYUFBYTtJQUVuRGEsU0FBU29ELGdCQUFnQixDQUFDLG9CQUFvQjtRQUM3Q2xFO0lBQ0QsR0FBRztJQUVBLE1BQU1EO0FBQ1Y7QUFTQSx3REFBd0Q7QUFDakQsU0FBU3RILEtBQTZDNE0sR0FBc0IsRUFBRSxHQUFHL0osSUFBVztJQUUvRixJQUFJbVEsU0FBU3BHLEdBQUcsQ0FBQyxFQUFFO0lBQ25CLElBQUksSUFBSVksSUFBSSxHQUFHQSxJQUFJM0ssS0FBS3RDLE1BQU0sRUFBRSxFQUFFaU4sRUFBRztRQUNqQ3dGLFVBQVUsQ0FBQyxFQUFFblEsSUFBSSxDQUFDMkssRUFBRSxDQUFDLENBQUM7UUFDdEJ3RixVQUFVLENBQUMsRUFBRXBHLEdBQUcsQ0FBQ1ksSUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2QiwwQkFBMEI7SUFDOUI7SUFFQSxvREFBb0Q7SUFDcEQsSUFBSXlGLFdBQVc1SyxTQUFTQyxhQUFhLENBQUM7SUFDdEMsdURBQXVEO0lBQ3ZEMkssU0FBU3RLLFNBQVMsR0FBR3FLLE9BQU8xUyxJQUFJO0lBRWhDLElBQUkyUyxTQUFTNVMsT0FBTyxDQUFDNEksVUFBVSxDQUFDMUksTUFBTSxLQUFLLEtBQUswUyxTQUFTNVMsT0FBTyxDQUFDNlMsVUFBVSxDQUFFQyxRQUFRLEtBQUtDLEtBQUtDLFNBQVMsRUFDdEcsT0FBT0osU0FBUzVTLE9BQU8sQ0FBQzZTLFVBQVU7SUFFcEMsT0FBT0QsU0FBUzVTLE9BQU87QUFDM0I7Ozs7Ozs7U0M1R0E7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7O1VDTkE7Ozs7Ozs7Ozs7Ozs7QUNBMkM7QUFFM0MsZ0VBQWdFO0FBRWhFLE1BQU1pVCxxQkFBcUIzUyw2Q0FBSUE7SUFFM0JpQyxhQUFjO1FBQ1YsS0FBSztRQUVMLElBQUksQ0FBQ3ZDLE9BQU8sQ0FBQ2tULGVBQWUsQ0FBQ3ZULHVDQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDM0Q7QUFDSjtBQUVBVyx5Q0FBSUEsQ0FBQ3lJLE1BQU0sQ0FBQyxrQkFBa0JrSztBQUU5QixnRUFBZ0U7QUFFaEUsTUFBTUUscUJBQXFCN1MsNkNBQUlBLENBQUM7SUFDNUJOLFNBQVM7QUFDYjtJQUVJdUMsYUFBYztRQUNWK0UsUUFBUXVHLEdBQUcsQ0FBQztRQUNaLEtBQUs7SUFDVDtBQUNKO0FBRUF2Tix5Q0FBSUEsQ0FBQ3lJLE1BQU0sQ0FBQyxrQkFBa0JvSztBQUU5QixlQUFlQztJQUVYLE1BQU1DLFlBQVksTUFBTTFFLHVDQUFJLENBQUMsaUNBQWlDLENBQUM7SUFFL0QzRyxTQUFTc0wsSUFBSSxDQUFDN0ssTUFBTSxDQUFDNEssVUFBVXpTLElBQUk7QUFDdkM7QUFFQXdTO0FBRUE7SUFDSSxJQUFJRyxRQUFRLElBQUlKLGFBQWExUSxJQUFJO0lBQ2pDdUYsU0FBU3NMLElBQUksQ0FBQzdLLE1BQU0sQ0FBQzhLO0lBRXJCak0sUUFBUUMsSUFBSSxDQUFDLFFBQVFqSCx5Q0FBSUEsQ0FBQ2dKLFFBQVEsQ0FBQ2lLO0FBQ3ZDLENBQ0E7SUFDSSxJQUFJQSxRQUFRLElBQUlKO0lBQ2hCbkwsU0FBU3NMLElBQUksQ0FBQzdLLE1BQU0sQ0FBQzhLLE1BQU0zUyxJQUFJO0lBRS9CMEcsUUFBUUMsSUFBSSxDQUFDLFFBQVFqSCx5Q0FBSUEsQ0FBQ2dKLFFBQVEsQ0FBQ2lLLE1BQU0zUyxJQUFJO0FBQ2pELEM7Ozs7Ozs7Ozs7QUNqREE7Ozs7Ozs7Ozs7Ozs7QUNBQSxpRUFBZSxxQkFBdUIsb0NBQW9DLEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NCYXNlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0hvc3QudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9jb3JlL2N1c3RvbVJlZ2lzdGVyeS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2NvcmUvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9jdXN0b21SZWdpc3RlcnkudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9leHRlbmRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9MSVNTQXV0by50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU1BhcmFtcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvYnVpbGQudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2V2ZW50cy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3BhZ2VzL2V4YW1wbGVzL2J1aWxkL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguY3NzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgQ29udGVudEZhY3RvcnksIENTU19Tb3VyY2UsIEhUTUxfUmVzb3VyY2UsIEhUTUxfU291cmNlLCBMSVNTX09wdHMgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBMSVNTU3RhdGUgfSBmcm9tIFwic3RhdGVcIjtcblxuaW1wb3J0IHtTaGFkb3dDZmd9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkLCBodG1sIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gREVGQVVMVF9DT05URU5UX0ZBQ1RPUlkoY29udGVudD86IEV4Y2x1ZGU8SFRNTF9SZXNvdXJjZSwgUmVzcG9uc2U+KSB7XG5cblx0aWYoIHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XG5cblx0XHRjb250ZW50ID0gY29udGVudC50cmltKCk7XG5cdFx0aWYoIGNvbnRlbnQubGVuZ3RoID09PSAwIClcblx0XHRcdGNvbnRlbnQgPSB1bmRlZmluZWQ7XG5cblx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0Y29udGVudCA9IGh0bWxgJHtjb250ZW50fWA7XG5cblx0XHQvLyBUT0RPIExJU1NBdXRvIHBhcnNlci4uLlxuXHRcdC8vIG9ubHkgaWYgbm8gSlMuLi5cblx0XHQvLyB0b2xlcmF0ZSBub24tb3B0aSAoZWFzaWVyID8pIG9yIHNwYW5bdmFsdWVdID9cblx0XHRcdC8vID0+IHJlY29yZCBlbGVtZW50IHdpdGggdGFyZ2V0Li4uXG5cdFx0XHQvLyA9PiBjbG9uZShhdHRycywgcGFyYW1zKSA9PiBmb3IgZWFjaCBzcGFuIHJlcGxhY2UgdGhlbiBjbG9uZS5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0Ly9sZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IHRoaXMuZ2V0QXR0cmlidXRlKG1hdGNoKT8/JycpXG5cdH1cblxuXHRpZiggY29udGVudCBpbnN0YW5jZW9mIEhUTUxUZW1wbGF0ZUVsZW1lbnQpXG5cdFx0Y29udGVudCA9IGNvbnRlbnQuY29udGVudDtcblxuXHRyZXR1cm4gKCkgPT4gY29udGVudD8uY2xvbmVOb2RlKHRydWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cblx0Ly8gSFRNTCBCYXNlXG5cdEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG5cdEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlciwgLy9zdHJpbmcsXG4+KHtcblxuICAgIC8vIEpTIEJhc2VcbiAgICBleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCBhcyB1bmtub3duIGFzIEV4dGVuZHNDdHIsIC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuICAgIHBhcmFtcyAgICAgICAgICAgID0ge30gICAgIGFzIHVua25vd24gYXMgUGFyYW1zLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgZGVwcyAgID0gW10sXG5cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBob3N0ICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdG9ic2VydmVkQXR0cmlidXRlcyA9IFtdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG4gICAgYXR0cnMgPSBvYnNlcnZlZEF0dHJpYnV0ZXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBjb250ZW50LFxuXHRjb250ZW50X2ZhY3Rvcnk6IF9jb250ZW50X2ZhY3RvcnkgPSBERUZBVUxUX0NPTlRFTlRfRkFDVE9SWSxcbiAgICBjc3MsXG4gICAgc2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgPyBTaGFkb3dDZmcuU0VNSU9QRU4gOiBTaGFkb3dDZmcuTk9ORVxufTogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PiA9IHt9KSB7XG5cbiAgICBpZiggc2hhZG93ICE9PSBTaGFkb3dDZmcuT1BFTiAmJiAhIGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgIGNvbnN0IGFsbF9kZXBzID0gWy4uLmRlcHNdO1xuXG5cdGxldCBjb250ZW50X2ZhY3Rvcnk6IENvbnRlbnRGYWN0b3J5PEF0dHJzLCBQYXJhbXM+O1xuXG4gICAgLy8gY29udGVudCBwcm9jZXNzaW5nXG4gICAgaWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGNvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIHtcbiAgICAgICAgXG5cdFx0bGV0IF9jb250ZW50OiBIVE1MX1NvdXJjZXx1bmRlZmluZWQgPSBjb250ZW50O1xuXHRcdGNvbnRlbnQgPSBudWxsIGFzIHVua25vd24gYXMgc3RyaW5nO1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQ7XG4gICAgICAgICAgICBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuXHRcdFx0XHRfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcblxuICAgICAgICAgICAgTElTU0Jhc2UuTElTU0NmZy5jb250ZW50X2ZhY3RvcnkgPSBfY29udGVudF9mYWN0b3J5KF9jb250ZW50KTtcbiAgICAgICAgfSkoKSApO1xuXG4gICAgfSBlbHNlIHtcblx0XHRjb250ZW50X2ZhY3RvcnkgPSBfY29udGVudF9mYWN0b3J5KGNvbnRlbnQpO1xuXHR9XG5cblx0Ly8gQ1NTIHByb2Nlc3Npbmdcblx0bGV0IHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gPSBbXTtcblx0aWYoIGNzcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0aWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiB0b2RvOiBMSVNTT3B0cyA9PiBzaG91bGQgbm90IGJlIGEgZ2VuZXJpYyA/XG5cdFx0XHRjc3MgPSBbY3NzXTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRzdHlsZXNoZWV0cyA9IGNzcy5tYXAoIChjOiBDU1NfU291cmNlLCBpZHg6IG51bWJlcikgPT4ge1xuXG5cdFx0XHRpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cblx0XHRcdFx0YWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRcdGMgPSBhd2FpdCBjO1xuXHRcdFx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuXHRcdFx0XHRcdFx0YyA9IGF3YWl0IGMudGV4dCgpO1xuXG5cdFx0XHRcdFx0c3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG5cdFx0XHRcdH0pKCkpO1xuXG5cdFx0XHRcdHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb2Nlc3NfY3NzKGMpO1xuXHRcdH0pO1xuXHR9XG5cblx0dHlwZSBMSVNTSG9zdDxUPiA9IGFueTsgLy9UT0RPLi4uXG5cdHR5cGUgTEhvc3QgPSBMSVNTSG9zdDxMSVNTQmFzZT47IC8vPC0gY29uZmlnIGluc3RlYWQgb2YgTElTU0Jhc2UgP1xuXG5cdGNsYXNzIExJU1NCYXNlIGV4dGVuZHMgX2V4dGVuZHMge1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApXG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCh7fSwgdGhpcyk7XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IGFueTsgLy8gcHJldmVudHMgaXNzdWUgIzEuLi5cblxuXHRcdC8vIExJU1MgQ29uZmlnc1xuXHRcdHN0YXRpYyByZWFkb25seSBMSVNTQ2ZnID0ge1xuXHRcdFx0aG9zdCxcblx0XHRcdGRlcHMsXG5cdFx0XHRhdHRycyxcblx0XHRcdHBhcmFtcyxcblx0XHRcdGNvbnRlbnRfZmFjdG9yeSxcblx0XHRcdHN0eWxlc2hlZXRzLFxuXHRcdFx0c2hhZG93LFxuXHRcdH07XG5cblx0XHRnZXQgc3RhdGUoKTogTElTU1N0YXRlIHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0LnN0YXRlO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblx0XHQvL1RPRE86IGdldCB0aGUgcmVhbCB0eXBlID9cblx0XHRwcm90ZWN0ZWQgZ2V0IGNvbnRlbnQoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0Ly8gYXR0cnNcblx0XHRwcm90ZWN0ZWQgZ2V0IGF0dHJzKCk6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBzZXRBdHRyRGVmYXVsdCggYXR0cjogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5zZXRBdHRyRGVmYXVsdChhdHRyLCB2YWx1ZSk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkF0dHJDaGFuZ2VkKF9uYW1lOiBBdHRycyxcblx0XHRcdF9vbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0X25ld1ZhbHVlOiBzdHJpbmcpOiB2b2lkfGZhbHNlIHt9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG5cdFx0cHJvdGVjdGVkIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBbQXR0cnMsIHN0cmluZywgc3RyaW5nXSkge1xuXHRcdFx0dGhpcy5vbkF0dHJDaGFuZ2VkKC4uLmFyZ3MpO1xuXHRcdH1cblxuXHRcdC8vIHBhcmFtZXRlcnNcblx0XHRwdWJsaWMgZ2V0IHBhcmFtcygpOiBSZWFkb25seTxQYXJhbXM+IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkucGFyYW1zO1xuXHRcdH1cblx0XHRwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxQYXJhbXM+KSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKCAodGhpcy4jaG9zdCBhcyBMSG9zdCkucGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cblx0XHQvLyBET01cblx0XHRwdWJsaWMgZ2V0IGlzSW5ET00oKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmlzQ29ubmVjdGVkO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01Db25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTURpc2Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXRcblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmlzSW5ET007XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzdGF0aWMgX0hvc3Q6IExJU1NIb3N0PExJU1NCYXNlPjtcblxuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMgYXMgYW55KTsgLy9UT0RPOiBmaXggdHlwZSBlcnJvciAod2h5Pz8/KVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzX2Nzcyhjc3M6IHN0cmluZ3xDU1NTdHlsZVNoZWV0fEhUTUxTdHlsZUVsZW1lbnQpIHtcblxuXHRpZihjc3MgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KVxuXHRcdHJldHVybiBjc3M7XG5cdGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuXHRcdHJldHVybiBjc3Muc2hlZXQhO1xuXG5cdGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cdGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuXHRcdHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7IC8vIHJlcGxhY2UoKSBpZiBpc3N1ZXNcblx0XHRyZXR1cm4gc3R5bGU7XG5cdH1cblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3Vyc1wiKTtcbn0iLCJpbXBvcnQgeyBTaGFkb3dDZmcsIHR5cGUgTElTU19PcHRzLCB0eXBlIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5pbXBvcnQgeyBDb21wb3NlQ29uc3RydWN0b3IsIGlzRE9NQ29udGVudExvYWRlZCwgd2FpdERPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgaWQgPSAwO1xuXG50eXBlIGluZmVyTElTUzxUPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8aW5mZXIgQSwgaW5mZXIgQiwgaW5mZXIgQywgaW5mZXIgRD4gPyBbQSxCLEMsRF0gOiBuZXZlcjtcblxuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFyZWRDU1MoKSB7XG5cdHJldHVybiBzaGFyZWRDU1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFxuICAgICAgICAgICAgICAgICAgICAgICAgVCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oTGlzczogVCkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRycyxcblx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5MSVNTQ2ZnO1xuXG5cdHR5cGUgUCA9IGluZmVyTElTUzxUPjtcblx0Ly90eXBlIEV4dGVuZHNDc3RyID0gUFswXTtcblx0dHlwZSBQYXJhbXMgICAgICA9IFBbMV07XG5cdHR5cGUgSG9zdENzdHIgICAgPSBQWzJdO1xuXHR0eXBlIEF0dHJzICAgICAgID0gUFszXTtcblxuICAgIHR5cGUgSG9zdCAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIC8vIGF0dHJzIHByb3h5XG5cdGNvbnN0IEdFVCA9IFN5bWJvbCgnZ2V0Jyk7XG5cdGNvbnN0IFNFVCA9IFN5bWJvbCgnc2V0Jyk7XG5cblx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5mcm9tRW50cmllcyggYXR0cnMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHRjb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCB3YWl0UmVhZHkgPSBuZXcgUHJvbWlzZTx2b2lkPiggYXN5bmMgKHIpID0+IHtcblxuICAgICAgICBhd2FpdCB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG5cbiAgICAgICAgcigpO1xuICAgIH0pO1xuXG4gICAgLy8gTm8gZGVwcyBhbmQgRE9NIGFscmVhZHkgbG9hZGVkLlxuICAgIGxldCBpc1JlYWR5ID0gTGlzcy5MSVNTQ2ZnLmRlcHMubGVuZ3RoID09IDAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cblx0Y29uc3QgcGFyYW1zID0gTGlzcy5MSVNTQ2ZnLnBhcmFtczsgLy9PYmplY3QuYXNzaWduKHt9LCBMaXNzLkxJU1NDZmcucGFyYW1zLCBfcGFyYW1zKTtcblxuXHQvL1xuXG5cdGNvbnN0IHdoZW5EZXBzUmVzb2x2ZWQgPSBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cdGxldCBpc0RlcHNSZXNvbHZlZCA9IGZhbHNlO1xuXHQoIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdGlzRGVwc1Jlc29sdmVkID0gdHJ1ZTtcblx0fSkoKTtcblxuXHRjbGFzcyBMSVNTSG9zdEJhc2UgZXh0ZW5kcyAoaG9zdCBhcyBuZXcgKCkgPT4gSFRNTEVsZW1lbnQpIHtcblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gaXNEZXBzUmVzb2x2ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdCh0aGlzLiNiYXNlIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0Z2V0IHBhcmFtcygpOiBQYXJhbXMge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3BhcmFtcztcblx0XHR9XG5cbiAgICAgICAgcHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8TElTU19PcHRzW1wicGFyYW1zXCJdPikge1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5iYXNlIS51cGRhdGVQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgLy8gd2lsIGJlIGdpdmVuIHRvIGNvbnN0cnVjdG9yLi4uXG5cdFx0XHRPYmplY3QuYXNzaWduKCB0aGlzLiNwYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblx0XHQvLyA9PT09PT09PT09PT09PSBBdHRyaWJ1dGVzID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNhdHRyc19mbGFnID0gZmFsc2U7XG5cblx0XHQjYXR0cmlidXRlcyAgICAgICAgID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJpYnV0ZXNEZWZhdWx0cyA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRycyA9IG5ldyBBdHRyaWJ1dGVzKFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlcyxcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0cyxcblx0XHRcdChuYW1lOiBBdHRycywgdmFsdWU6c3RyaW5nfG51bGwpID0+IHtcblxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG5cblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IHRydWU7IC8vIGRvIG5vdCB0cmlnZ2VyIG9uQXR0cnNDaGFuZ2VkLlxuXHRcdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0KSBhcyB1bmtub3duIGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXG5cdFx0c2V0QXR0ckRlZmF1bHQobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRkZWxldGUgdGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRnZXQgYXR0cnMoKTogUmVhZG9ubHk8UmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4+IHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2F0dHJzO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKHBhcmFtczoge30sIGJhc2U/OiBJbnN0YW5jZVR5cGU8VD4pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0aWYoIGJhc2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLiNiYXNlID0gYmFzZTtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0KHRoaXMuYmFzZSEgYXMgYW55KS5vbkRPTURpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuYmFzZSEub25ET01Db25uZWN0ZWQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLnN0YXRlLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgdGhpcy5zdGF0ZS5pc1JlYWR5O1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgZ2V0IHNoYWRvd1Jvb3QoKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJjYWxsZWRcIik7XG5cdFx0XHRpZihzaGFkb3cgPT09IFNoYWRvd0NmZy5TRU1JT1BFTilcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRyZXR1cm4gc3VwZXIuc2hhZG93Um9vdDtcblx0XHR9XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cdFx0XHRcblx0XHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGhpcyk7XG5cbiAgICAgICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi5cblx0XHRcdFxuXHRcdFx0Ly8gc2hhZG93XG5cdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcyBhcyB1bmtub3duIGFzIEhvc3Q7XG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpIHtcblx0XHRcdFx0Y29uc3QgbW9kZSA9IHNoYWRvdyA9PT0gU2hhZG93Q2ZnLlNFTUlPUEVOID8gJ29wZW4nIDogc2hhZG93O1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGV9KTtcblxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGF0dHJzXG5cdFx0XHRmb3IobGV0IG9icyBvZiBhdHRycyEpXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbb2JzIGFzIEF0dHJzXSA9IHRoaXMuZ2V0QXR0cmlidXRlKG9icyk7XG5cblx0XHRcdC8vIGNzc1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MpO1xuXHRcdFx0aWYoIHN0eWxlc2hlZXRzLmxlbmd0aCApIHtcblxuXHRcdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goLi4uc3R5bGVzaGVldHMpO1xuXHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdGNvbnN0IGNzc3NlbGVjdG9yID0gdGhpcy5DU1NTZWxlY3RvcjtcblxuXHRcdFx0XHRcdC8vIGlmIG5vdCB5ZXQgaW5zZXJ0ZWQgOlxuXHRcdFx0XHRcdGlmKCAhIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpICkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuXHRcdFx0XHRcdFx0bGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuXG5cdFx0XHRcdFx0XHRmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG5cdFx0XHRcdFx0XHRcdFx0aHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuXHRcdFx0XHRcdFx0c3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cblx0XHRcdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcblxuXHRcdFx0XHRcdFx0YWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbnRlbnRcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSBjb250ZW50X2ZhY3RvcnkodGhpcy5hdHRycywgdGhpcy5wYXJhbXMsIHRoaXMpO1xuXHRcdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGNvbnRlbnQgKTtcblxuXHQgICAgXHQvLyBidWlsZFxuXG5cdCAgICBcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0ICAgIFx0bGV0IG9iaiA9IHRoaXMuYmFzZSA9PT0gbnVsbCA/IG5ldyBMaXNzKCkgOiB0aGlzLmJhc2U7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSBvYmogYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXG5cdFx0XHQvLyBkZWZhdWx0IHNsb3Rcblx0XHRcdGlmKCB0aGlzLmhhc1NoYWRvdyAmJiB0aGlzLiNjb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwIClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIodGhpcy5iYXNlKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuYmFzZTtcblx0XHR9XG5cblxuXG5cdFx0Ly8gYXR0cnNcblxuXHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBhdHRycztcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSAgICA6IEF0dHJzLFxuXHRcdFx0XHRcdFx0XHRcdCBvbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRcdCBuZXdWYWx1ZTogc3RyaW5nKSB7XG5cblx0XHRcdGlmKHRoaXMuI2F0dHJzX2ZsYWcpIHtcblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSBuZXdWYWx1ZTtcblx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0aWYoICh0aGlzLmJhc2UhIGFzIGFueSkub25BdHRyQ2hhbmdlZChuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLiNhdHRyc1tuYW1lXSA9IG9sZFZhbHVlOyAvLyByZXZlcnQgdGhlIGNoYW5nZS5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0QmFzZSBhcyBDb21wb3NlQ29uc3RydWN0b3I8dHlwZW9mIExJU1NIb3N0QmFzZSwgdHlwZW9mIGhvc3Q+O1xufVxuXG5cbiIsIlxuaW1wb3J0IHsgZGVmaW5lLCBnZXRCYXNlQ3N0ciwgZ2V0SG9zdENzdHIsIGdldE5hbWUsIGlzRGVmaW5lZCwgd2hlbkFsbERlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcImN1c3RvbVJlZ2lzdGVyeVwiO1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZSAgICAgICAgIDogdHlwZW9mIGRlZmluZTtcblx0XHR3aGVuRGVmaW5lZCAgICA6IHR5cGVvZiB3aGVuRGVmaW5lZDtcblx0XHR3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcblx0XHRnZXRIb3N0Q3N0ciAgICA6IHR5cGVvZiBnZXRIb3N0Q3N0cjtcblx0XHRnZXRCYXNlQ3N0ciAgICA6IHR5cGVvZiBnZXRCYXNlQ3N0cjtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldEJhc2VDc3RyICAgID0gZ2V0QmFzZUNzdHI7IiwiXG5pbXBvcnQgeyBERUZJTkVELCBnZXRTdGF0ZSwgaW5pdGlhbGl6ZSwgSU5JVElBTElaRUQsIGluaXRpYWxpemVTeW5jLCBSRUFEWSwgdXBncmFkZSwgVVBHUkFERUQsIHVwZ3JhZGVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQsIHdoZW5VcGdyYWRlZCB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIERFRklORUQgICAgOiB0eXBlb2YgREVGSU5FRCxcbiAgICAgICAgUkVBRFkgICAgICA6IHR5cGVvZiBSRUFEWTtcbiAgICAgICAgVVBHUkFERUQgICA6IHR5cGVvZiBVUEdSQURFRDtcbiAgICAgICAgSU5JVElBTElaRUQ6IHR5cGVvZiBJTklUSUFMSVpFRDtcbiAgICAgICAgZ2V0U3RhdGUgICAgICAgOiB0eXBlb2YgZ2V0U3RhdGU7XG4gICAgICAgIHVwZ3JhZGUgICAgICAgIDogdHlwZW9mIHVwZ3JhZGU7XG4gICAgICAgIGluaXRpYWxpemUgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG4gICAgICAgIHVwZ3JhZGVTeW5jICAgIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuICAgICAgICBpbml0aWFsaXplU3luYyA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcbiAgICAgICAgd2hlblVwZ3JhZGVkICAgOiB0eXBlb2Ygd2hlblVwZ3JhZGVkO1xuICAgICAgICB3aGVuSW5pdGlhbGl6ZWQ6IHR5cGVvZiB3aGVuSW5pdGlhbGl6ZWQ7XG4gICAgfVxufVxuXG5MSVNTLkRFRklORUQgICAgPSBMSVNTLkRFRklORUQsXG5MSVNTLlJFQURZICAgICAgPSBMSVNTLlJFQURZO1xuTElTUy5VUEdSQURFRCAgID0gTElTUy5VUEdSQURFRDtcbkxJU1MuSU5JVElBTElaRUQ9IExJU1MuSU5JVElBTElaRUQ7XG5cbkxJU1MuZ2V0U3RhdGUgICAgICAgPSBnZXRTdGF0ZTtcbkxJU1MudXBncmFkZSAgICAgICAgPSB1cGdyYWRlO1xuTElTUy5pbml0aWFsaXplICAgICA9IGluaXRpYWxpemU7XG5MSVNTLnVwZ3JhZGVTeW5jICAgID0gdXBncmFkZVN5bmM7XG5MSVNTLmluaXRpYWxpemVTeW5jID0gaW5pdGlhbGl6ZVN5bmM7XG5MSVNTLndoZW5VcGdyYWRlZCAgID0gd2hlblVwZ3JhZGVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQ9IHdoZW5Jbml0aWFsaXplZDsiLCJpbXBvcnQgdHlwZSB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLy8gR28gdG8gc3RhdGUgREVGSU5FRFxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPikge1xuXG4gICAgLy8gY291bGQgYmUgYmV0dGVyLlxuICAgIGlmKCBcIkJhc2VcIiBpbiBDb21wb25lbnRDbGFzcykge1xuICAgICAgICBDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzLkJhc2UgYXMgVDtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgQ2xhc3MgID0gQ29tcG9uZW50Q2xhc3MuTElTU0NmZy5ob3N0O1xuICAgIGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cbiAgICBjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKHRhZ25hbWU6IHN0cmluZyApIHtcblx0cmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKG5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NCYXNlfExJU1NCYXNlQ3N0cnxMSVNTSG9zdDxMSVNTQmFzZT58TElTU0hvc3RDc3RyPExJU1NCYXNlPiApOiBzdHJpbmcge1xuXG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50LmNvbnN0cnVjdG9yKVxuXHRcdGVsZW1lbnQgPSBlbGVtZW50LmNvbnN0cnVjdG9yLkhvc3QgYXMgTElTU0hvc3RDc3RyPExJU1NCYXNlPjtcblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuSG9zdDtcblx0aWYoIFwiQmFzZVwiIGluIGVsZW1lbnQuY29uc3RydWN0b3IpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuY29uc3RydWN0b3IgYXMgTElTU0hvc3RDc3RyPExJU1NCYXNlPjtcblxuXHRpZiggXCJCYXNlXCIgaW4gZWxlbWVudCkge1xuXHRcdGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG5cdFx0aWYobmFtZSA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vdCBkZWZpbmVkIVwiKTtcblxuXHRcdHJldHVybiBuYW1lO1xuXHR9XG5cblx0aWYoICEgKGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKCc/Pz8nKTtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KG5hbWU6IHN0cmluZyk6IFQge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihuYW1lOiBzdHJpbmcpOiBUIHtcblx0cmV0dXJuIGdldEhvc3RDc3RyPExJU1NIb3N0Q3N0cjxUPj4obmFtZSkuQmFzZSBhcyBUO1xufSIsImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge0xJU1MgYXMgX0xJU1N9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuXG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbi8vIGV4dGVuZHMgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICBFeHRlbmRzQ3N0cl9CYXNlIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtc19CYXNlICAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIEhvc3RDc3RyX0Jhc2UgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnNfQmFzZSAgICAgICBleHRlbmRzIHN0cmluZyxcblxuICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyPEV4dGVuZHNDc3RyX0Jhc2UsIFBhcmFtc19CYXNlLCBIb3N0Q3N0cl9CYXNlLCBBdHRyc19CYXNlPixcblxuICAgIC8vIFRPRE86IGFkZCBjb25zdHJhaW50cy4uLlxuICAgIFBhcmFtcyAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxuICAgIEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXI+KG9wdHM6IFBhcnRpYWw8TElTU19PcHRzPEJhc2VDc3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+KTogTElTU0Jhc2VDc3RyXG4vLyBMSVNTQmFzZSBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4ob3B0cz86IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4pOiBMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+XG5leHBvcnQgZnVuY3Rpb24gTElTUyhvcHRzOiBhbnkpOiBMSVNTQmFzZUNzdHJcbntcbiAgICBpZiggb3B0cy5leHRlbmRzICE9PSB1bmRlZmluZWQgJiYgXCJIb3N0XCIgaW4gb3B0cy5leHRlbmRzICkgLy8gd2UgYXNzdW1lIHRoaXMgaXMgYSBMSVNTQmFzZUNzdHJcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKG9wdHMpO1xuXG4gICAgcmV0dXJuIF9MSVNTKG9wdHMpO1xufVxuXG5mdW5jdGlvbiBfZXh0ZW5kczxcbiAgICBFeHRlbmRzQ3N0cl9CYXNlIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtc19CYXNlICAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIEhvc3RDc3RyX0Jhc2UgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnNfQmFzZSAgICAgICBleHRlbmRzIHN0cmluZyxcblxuICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyPEV4dGVuZHNDc3RyX0Jhc2UsIFBhcmFtc19CYXNlLCBIb3N0Q3N0cl9CYXNlLCBBdHRyc19CYXNlPixcbiAgICBcbiAgICAvLyBUT0RPOiBhZGQgY29uc3RyYWludHMuLi5cbiAgICBQYXJhbXMgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSxcbiAgICBIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyPihvcHRzOiBQYXJ0aWFsPExJU1NfT3B0czxCYXNlQ3N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+Pikge1xuXG4gICAgaWYoIG9wdHMuZXh0ZW5kcyA9PT0gdW5kZWZpbmVkKSAvLyBoNGNrXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYSBMSVNTQmFzZSEnKTtcblxuICAgIGNvbnN0IGJhc2UgPSBvcHRzLmV4dGVuZHMuTElTU0NmZztcblxuICAgIGNvbnN0IGhvc3QgPSBvcHRzLmhvc3QgPz8gYmFzZS5ob3N0O1xuXG4gICAgbGV0IGRlcHMgPSBiYXNlLmRlcHM7XG4gICAgaWYoIG9wdHMuZGVwcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBkZXBzID0gWy4uLmRlcHMsIC4uLm9wdHMuZGVwc107XG5cbiAgICBsZXQgYXR0cnMgPSBiYXNlLmF0dHJzIGFzIHJlYWRvbmx5IChBdHRyc3xBdHRyc19CYXNlKVtdO1xuICAgIGlmKCBvcHRzLmF0dHJzICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGF0dHJzID0gWy4uLmF0dHJzLCAuLi5vcHRzLmF0dHJzXTtcblxuICAgIGxldCBwYXJhbXMgPSBiYXNlLnBhcmFtcztcbiAgICBpZiggb3B0cy5wYXJhbXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihwYXJhbXMsIG9wdHMucGFyYW1zKTtcblxuICAgIC8vVE9ETzogaXNzdWVzIHdpdGggYXN5bmMgY29udGVudC9DU1MgKyBzb21lIGVkZ2UgY2FzZXMuLi5cbiAgICBsZXQgY29udGVudF9mYWN0b3J5ID0gYmFzZS5jb250ZW50X2ZhY3RvcnkgYXMgYW55O1xuICAgIGlmKCBvcHRzLmNvbnRlbnQgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29udGVudF9mYWN0b3J5ID0gb3B0cy5jb250ZW50X2ZhY3RvcnkhKCBvcHRzLmNvbnRlbnQgKTtcblxuICAgIGxldCBzdHlsZXNoZWV0cyA9IGJhc2Uuc3R5bGVzaGVldHM7XG4gICAgaWYoIG9wdHMuY3NzICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHN0eWxlc2hlZXRzID0gWy4uLnN0eWxlc2hlZXRzLCAuLi5vcHRzLmNzc107XG5cbiAgICBjb25zdCBzaGFkb3cgPSBvcHRzLnNoYWRvdyA/PyBiYXNlLnNoYWRvdztcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyB7XG5cbiAgICAgICAgc3RhdGljIG92ZXJyaWRlIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuICAgICAgICAvL1RPRE86IGZpeCB0eXBlcy4uLlxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59XG5cbi8qXG5mdW5jdGlvbiBleHRlbmRzTElTUzxFeHRlbmRzIGV4dGVuZHMgQ2xhc3MsXG5cdEhvc3QgICAgZXh0ZW5kcyBIVE1MRWxlbWVudCxcblx0QXR0cnMxICAgZXh0ZW5kcyBzdHJpbmcsXG5cdEF0dHJzMiAgIGV4dGVuZHMgc3RyaW5nLFxuXHRQYXJhbXMgIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+LFxuXHRUIGV4dGVuZHMgTElTU1JldHVyblR5cGU8RXh0ZW5kcywgSG9zdCwgQXR0cnMxLCBQYXJhbXM+PihMaXNzOiBULFxuXHRcdHBhcmFtZXRlcnM6IHtcblx0XHRcdHNoYWRvdyAgICAgID86IFNoYWRvd0NmZyxcblx0XHRcdGF0dHJpYnV0ZXMgID86IHJlYWRvbmx5IEF0dHJzMltdLFxuXHRcdFx0ZGVwZW5kZW5jaWVzPzogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W11cblx0XHR9KSB7XG5cblx0Y29uc3QgYXR0cmlidXRlcyAgID0gWy4uLkxpc3MuUGFyYW1ldGVycy5hdHRyaWJ1dGVzICAsIC4uLnBhcmFtZXRlcnMuYXR0cmlidXRlcyAgPz9bXV07XG5cdGNvbnN0IGRlcGVuZGVuY2llcyA9IFsuLi5MaXNzLlBhcmFtZXRlcnMuZGVwZW5kZW5jaWVzLCAuLi5wYXJhbWV0ZXJzLmRlcGVuZGVuY2llcz8/W11dO1xuXG5cdGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIExpc3MuUGFyYW1ldGVycywge1xuXHRcdGF0dHJpYnV0ZXMsXG5cdFx0ZGVwZW5kZW5jaWVzXG5cdH0pO1xuXHRpZiggcGFyYW1ldGVycy5zaGFkb3cgIT09IHVuZGVmaW5lZClcblx0XHRwYXJhbXMuc2hhZG93ID0gcGFyYW1ldGVycy5zaGFkb3c7XG5cblx0Ly8gQHRzLWlnbm9yZSA6IGJlY2F1c2UgVFMgc3R1cGlkXG5cdGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIExpc3Mge1xuXHRcdGNvbnN0cnVjdG9yKC4uLnQ6IGFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlIDogYmVjYXVzZSBUUyBzdHVwaWRcblx0XHRcdHN1cGVyKC4uLnQpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBvdmVycmlkZSBnZXQgYXR0cnMoKSB7XG5cdFx0XHRyZXR1cm4gc3VwZXIuYXR0cnMgYXMgUmVjb3JkPEF0dHJzMnxBdHRyczEsIHN0cmluZ3xudWxsPjtcblx0XHR9XG5cblx0XHRzdGF0aWMgb3ZlcnJpZGUgUGFyYW1ldGVycyA9IHBhcmFtcztcblx0fVxuXG5cdHJldHVybiBFeHRlbmRlZExJU1M7XG59XG5MSVNTLmV4dGVuZHNMSVNTID0gZXh0ZW5kc0xJU1M7XG4qLyIsImltcG9ydCB7IFNoYWRvd0NmZyB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTfSBmcm9tIFwiLi4vTElTU0Jhc2VcIjtcblxuaW1wb3J0IHtkZWZpbmV9IGZyb20gXCIuLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIExJU1NfQXV0byBleHRlbmRzIExJU1Moe1xuXHRhdHRyczogW1wic3JjXCIsIFwic3dcIl0sXG5cdHNoYWRvdzogU2hhZG93Q2ZnLk5PTkUsXG5cdGNzczogYDpob3N0IHsgZGlzcGxheTogbm9uZTsgfWBcbn0pIHtcblxuXHRyZWFkb25seSAja25vd25fdGFnID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cdHJlYWRvbmx5ICNkaXJlY3Rvcnk6IHN0cmluZztcblx0cmVhZG9ubHkgI3N3OiBQcm9taXNlPHZvaWQ+O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuI3N3ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cdFx0XHRcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHRoaXMuYXR0cnMuc3cgPz8gXCIvc3cuanNcIiwge3Njb3BlOiBcIi9cIn0pO1xuXG5cdFx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cblx0XHRjb25zdCBzcmMgPSB0aGlzLmF0dHJzLnNyYztcblx0XHRpZihzcmMgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzcmMgYXR0cmlidXRlIGlzIG1pc3NpbmcuXCIpO1xuXHRcdHRoaXMuI2RpcmVjdG9yeSA9IHNyY1swXSA9PT0gJy4nXG5cdFx0XHRcdFx0XHRcdFx0PyBgJHt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9JHtzcmN9YFxuXHRcdFx0XHRcdFx0XHRcdDogc3JjO1xuXG5cdFx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXG5cdFx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEVsZW1lbnQpXG5cdFx0XHRcdFx0XHR0aGlzLiNhZGRUYWcoYWRkaXRpb24udGFnTmFtZSlcblxuXHRcdH0pLm9ic2VydmUoIGRvY3VtZW50LCB7IGNoaWxkTGlzdDp0cnVlLCBzdWJ0cmVlOnRydWUgfSk7XG5cblxuXHRcdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipcIikgKVxuXHRcdFx0dGhpcy4jYWRkVGFnKGVsZW0udGFnTmFtZSk7XG5cdH1cblxuXG4gICAgcHJvdGVjdGVkIHJlc291cmNlcygpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0XCJpbmRleC5qc1wiLFxuXHRcdFx0XCJpbmRleC5odG1sXCIsXG5cdFx0XHRcImluZGV4LmNzc1wiXG5cdFx0XTtcbiAgICB9XG5cblx0cHJvdGVjdGVkIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nfT4pIHtcblxuXHRcdGNvbnN0IGpzID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXG5cdFx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdFx0aWYoIGpzICE9PSB1bmRlZmluZWQgKVxuXHRcdFx0a2xhc3MgPSBqcyhvcHRzKTtcblx0XHRlbHNlIGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdChvcHRzIGFzIGFueSkuY29udGVudF9mYWN0b3J5ID0gKHN0cjogc3RyaW5nKSA9PiB7XG5cblx0XHRcdFx0Y29uc3QgY29udGVudCA9IGh0bWxgJHtzdHJ9YDtcblxuXHRcdFx0XHRsZXQgc3BhbnMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cblx0XHRcdFx0cmV0dXJuIChfYTogdW5rbm93biwgX2I6dW5rbm93biwgZWxlbTogSFRNTEVsZW1lbnQpID0+IHtcblxuXHRcdFx0XHRcdC8vIGNhbiBiZSBvcHRpbWl6ZWQuLi5cblx0XHRcdFx0XHRmb3IobGV0IHNwYW4gb2Ygc3BhbnMpXG5cdFx0XHRcdFx0XHRzcGFuLnRleHRDb250ZW50ID0gZWxlbS5nZXRBdHRyaWJ1dGUoc3Bhbi5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXG5cdFx0XHRcdFx0cmV0dXJuIGNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHR9O1xuXG5cdFx0XHRrbGFzcyA9IGNsYXNzIFdlYkNvbXBvbmVudCBleHRlbmRzIExJU1Mob3B0cykge307XG5cdFx0fVxuXG5cdFx0aWYoa2xhc3MgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuXG5cdFx0cmV0dXJuIGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cdH1cblxuXHRhc3luYyAjYWRkVGFnKHRhZ25hbWU6IHN0cmluZykge1xuXG5cdFx0dGFnbmFtZSA9IHRhZ25hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmKCB0YWduYW1lID09PSAnbGlzcy1hdXRvJyB8fCB0YWduYW1lID09PSAnYmxpc3MtYXV0bycgfHwgISB0YWduYW1lLmluY2x1ZGVzKCctJykgfHwgdGhpcy4ja25vd25fdGFnLmhhcyggdGFnbmFtZSApIClcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuI2tub3duX3RhZy5hZGQodGFnbmFtZSk7XG5cblx0XHRhd2FpdCB0aGlzLiNzdzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IGZpbGVuYW1lcyA9IHRoaXMucmVzb3VyY2VzKCk7XG5cdFx0Y29uc3QgcmVzb3VyY2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoIGZpbGVuYW1lcy5tYXAoIGZpbGUgPT4gZmlsZS5lbmRzV2l0aCgnLmpzJylcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PyBfaW1wb3J0ICAgKGAke3RoaXMuI2RpcmVjdG9yeX0vJHt0YWduYW1lfS8ke2ZpbGV9YCwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0OiBfZmV0Y2hUZXh0KGAke3RoaXMuI2RpcmVjdG9yeX0vJHt0YWduYW1lfS8ke2ZpbGV9YCwgdHJ1ZSkgKSApO1xuXG5cdFx0Y29uc3QgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZmlsZW5hbWVzLmxlbmd0aDsgKytpKVxuXHRcdFx0aWYoIHJlc291cmNlc1tpXSAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRmaWxlc1tmaWxlbmFtZXNbaV1dID0gcmVzb3VyY2VzW2ldO1xuXG5cdFx0Y29uc3QgY29udGVudCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0XHRjb25zdCBjc3MgICAgID0gZmlsZXNbXCJpbmRleC5jc3NcIl07XG5cblx0XHRjb25zdCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nfT4gPSB7XG5cdFx0XHQuLi5jb250ZW50ICE9PSB1bmRlZmluZWQgJiYge2NvbnRlbnR9LFxuXHRcdFx0Li4uY3NzICAgICAhPT0gdW5kZWZpbmVkICYmIHtjc3N9LFxuXHRcdH07XG5cblx0XHRyZXR1cm4gdGhpcy5kZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIG9wdHMpO1xuXHRcdFxuXHR9XG59XG5cbi8vIHByZXZlbnRzIG11bHRpLWRlY2xhcmF0aW9ucy4uLlxuaWYoIGN1c3RvbUVsZW1lbnRzLmdldChcImxpc3MtYXV0b1wiKSA9PT0gdW5kZWZpbmVkKVxuXHRkZWZpbmUoXCJsaXNzLWF1dG9cIiwgTElTU19BdXRvKTtcblxuLy9UT0RPOiBmaXguLi5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50cyB7XG5cdFwibGlzcy1hdXRvXCI6IExJU1NfQXV0b1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBpbnRlcm5hbCB0b29scyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn0iLCJpbXBvcnQgeyBkZWZpbmUgfSBmcm9tIFwiY3VzdG9tUmVnaXN0ZXJ5XCI7XG5pbXBvcnQgeyBMSVNTIH0gZnJvbSBcIkxJU1NCYXNlXCI7XG5pbXBvcnQgeyBMSVNTSG9zdCwgU2hhZG93Q2ZnIH0gZnJvbSBcInR5cGVzXCI7XG5cbi8vIE5vcm1hbGx5IDpcbi8vIFBhcmVudCB1cGdyYWRlIC0+IGNoaWxkcmVuIHVwZ3JhZGUgLT4gY2hpbGRyZW4gaW5pdCAtPiBtYW5pcHVsYXRlIHBhcmVudCBob3N0IC0+IHBhcmVudCBpbml0LlxuLy8gSWYgZGVwcyAtPiBuZWVkIGEgdG9vbCBmb3IgXCJ3YWl0Q2hpbGRyZW5Jbml0XCIgb3IgXCJ3YWl0UGFyZW50SW5pdFwiLlxuXG5leHBvcnQgY2xhc3MgTElTU1BhcmFtczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55Pj4gZXh0ZW5kcyBMSVNTKHtcbiAgICBzaGFkb3c6IFNoYWRvd0NmZy5OT05FLFxuICAgIGNzczogW2A6aG9zdCB7ZGlzcGxheTogbm9uZX1gXSxcbiAgICBhdHRyczogW1widHlwZVwiXVxufSkge1xuXG4gICAgI25hbWUgIDogc3RyaW5nO1xuICAgICN2YWx1ZT86IFQ7XG5cbiAgICAjcGFyZW50OiBMSVNTSG9zdDtcblxuICAgIC8vIGRpcnR5IGg0Y2suLi5cbiAgICBjb25zdHJ1Y3RvcihwID0ge30sIGluaXQgPSB0cnVlKSB7IC8vIHdoeSBpbml0ID9cblxuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuI25hbWUgPSB0aGlzLmhvc3QuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSE7XG5cbiAgICAgICAgdGhpcy4jcGFyZW50ID0gdGhpcy5ob3N0LnBhcmVudEVsZW1lbnQhIGFzIExJU1NIb3N0O1xuXG4gICAgICAgIGlmKGluaXQpXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdCgpIHtcblxuICAgICAgICAvLyBUT0RPOiBvYnNlcnZlIGNvbnRlbnQuLi5cbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCh0aGlzLmhvc3QudGV4dENvbnRlbnQhKTtcbiAgICB9XG5cbiAgICAvL1RPRE9cbiAgICBwcm90ZWN0ZWQgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJzLnR5cGUgPz8gXCJKU09OXCI7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9wYXJzZUNvbnRlbnQodmFsdWU6IHN0cmluZyk6IFQge1xuXG4gICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLnR5cGU7XG5cbiAgICAgICAgaWYoIHR5cGUgPT09IFwiSlNPTlwiKVxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgICBpZiggdHlwZSA9PT0gXCJKU1wiKSB7XG4gICAgICAgICAgICAvL1RPRE86IG1heSBiZSBpbXByb3ZlZCA/XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gT2JqZWN0LmtleXMoIHRoaXMuZ2V0QXJncygpICk7XG4gICAgICAgICAgICB0aGlzLiNmY3QgPSBuZXcgRnVuY3Rpb24oLi4uYXJncywgYHJldHVybiAke3ZhbHVlfWApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCggLi4uT2JqZWN0LnZhbHVlcyhhcmdzKSApO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBpbXBsZW1lbnRlZCFcIik7XG4gICAgfVxuXG4gICAgI2ZjdDogKCBGdW5jdGlvbil8bnVsbCA9IG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgY2FsbCguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy4jZmN0ISguLi5hcmdzKSBhcyBUO1xuICAgIH1cbiAgICBcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICBcbiAgICAgICAgdGhpcy4jdmFsdWUgPSB0aGlzLl9wYXJzZUNvbnRlbnQodmFsdWUpO1xuICAgICAgICAvKlxuICAgICAgICAvLyBkbyBub3QgdXBkYXRlZCBpZiBub3QgaW4gRE9NLlxuICAgICAgICBpZiggISB0aGlzLiNwYXJlbnQ/LmlzSW5ET00pXG4gICAgICAgICAgICByZXR1cm47Ki9cblxuICAgICAgICB0aGlzLiNwYXJlbnQudXBkYXRlUGFyYW1zKHRoaXMuI3ZhbHVlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0QXJncygpOiBSZWNvcmQ8c3RyaW5nLGFueT4ge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgLy9UT0RPLi4uXG4gICAgLypcbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgb25BdHRyQ2hhbmdlZChfbmFtZTogc3RyaW5nLCBfb2xkVmFsdWU6IHN0cmluZywgX25ld1ZhbHVlOiBzdHJpbmcpOiB2b2lkIHwgZmFsc2Uge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCh0aGlzLmF0dHJzLnZhbHVlISk7XG4gICAgfSovXG59XG5cbmlmKCBjdXN0b21FbGVtZW50cy5nZXQoXCJsaXNzLXBhcmFtc1wiKSA9PT0gdW5kZWZpbmVkKVxuICAgIGRlZmluZShcImxpc3MtcGFyYW1zXCIsIExJU1NQYXJhbXMpOyIsImltcG9ydCB0eXBlIHsgTElTU0Jhc2UgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwiLi4vc3RhdGVcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwidXRpbHNcIjtcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzczxUIGV4dGVuZHMgTElTU0Jhc2U+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn1cblxuLypcbnR5cGUgQlVJTERfT1BUSU9OUzxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gUGFydGlhbDx7XG4gICAgcGFyYW1zICAgIDogUGFydGlhbDxUW1wicGFyYW1zXCJdPixcbiAgICBjb250ZW50XHQgIDogc3RyaW5nfE5vZGV8cmVhZG9ubHkgTm9kZVtdLFxuICAgIGlkIFx0XHQgICAgOiBzdHJpbmcsXG4gICAgY2xhc3Nlc1x0ICA6IHJlYWRvbmx5IHN0cmluZ1tdLFxuICAgIGNzc3ZhcnMgICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+LFxuICAgIGF0dHJzIFx0ICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG4gICAgZGF0YSBcdCAgICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG4gICAgbGlzdGVuZXJzIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgKGV2OiBFdmVudCkgPT4gdm9pZD4+XG59PiAmICh7XG4gIGluaXRpYWxpemU6IGZhbHNlLFxuICBwYXJlbnQ6IEVsZW1lbnRcbn18e1xuICBpbml0aWFsaXplPzogdHJ1ZSxcbiAgcGFyZW50PzogRWxlbWVudFxufSk7XG5cbi8vYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogUHJvbWlzZTxDb21wb25lbnRzW1RdPjtcblxuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZT4odGFnbmFtZTogc3RyaW5nLCB7XG4gICAgICAgICAgICAgIHBhcmFtcyAgICA9IHt9LFxuICAgICAgICAgICAgICBpbml0aWFsaXplPSB0cnVlLFxuICAgICAgICAgICAgICBjb250ZW50ICAgPSBbXSxcbiAgICAgICAgICAgICAgcGFyZW50ICAgID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBpZCBcdFx0ICA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgY2xhc3NlcyAgID0gW10sXG4gICAgICAgICAgICAgIGNzc3ZhcnMgICA9IHt9LFxuICAgICAgICAgICAgICBhdHRycyAgICAgPSB7fSxcbiAgICAgICAgICAgICAgZGF0YSBcdCAgPSB7fSxcbiAgICAgICAgICAgICAgbGlzdGVuZXJzID0ge31cbiAgICAgICAgICAgICAgfTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogUHJvbWlzZTxUPiB7XG5cbiAgaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG4gIGxldCBDdXN0b21DbGFzcyA9IGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xuICBsZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4gIC8vIEZpeCBpc3N1ZSAjMlxuICBpZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuICBlbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG4gIGlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbiAgZWxlbS5pZCA9IGlkO1xuXG4gIGlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG4gIGVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuICBmb3IobGV0IG5hbWUgaW4gY3NzdmFycylcbiAgZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbiAgbGV0IHZhbHVlID0gYXR0cnNbbmFtZV07XG4gIGlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuICBlbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIGVsc2VcbiAgZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgZm9yKGxldCBuYW1lIGluIGRhdGEpIHtcblxuICBsZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuICBpZiggdmFsdWUgPT09IGZhbHNlKVxuICBkZWxldGUgZWxlbS5kYXRhc2V0W25hbWVdO1xuICBlbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuICBlbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuICBlbHNlXG4gIGVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgaWYoICEgQXJyYXkuaXNBcnJheShjb250ZW50KSApXG4gIGNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuICBlbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuICBmb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuICBpZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxuICBwYXJlbnQuYXBwZW5kKGVsZW0pO1xuXG4gIGlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxuICByZXR1cm4gYXdhaXQgTElTUy5pbml0aWFsaXplKGVsZW0pO1xuXG4gIHJldHVybiBhd2FpdCBMSVNTLmdldExJU1MoZWxlbSk7XG59XG5MSVNTLmJ1aWxkID0gYnVpbGQ7XG5cblxuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IENvbXBvbmVudHNbVF07XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBUO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIHtcbnBhcmFtcyAgICA9IHt9LFxuaW5pdGlhbGl6ZT0gdHJ1ZSxcbmNvbnRlbnQgICA9IFtdLFxucGFyZW50ICAgID0gdW5kZWZpbmVkLFxuaWQgXHRcdCAgPSB1bmRlZmluZWQsXG5jbGFzc2VzICAgPSBbXSxcbmNzc3ZhcnMgICA9IHt9LFxuYXR0cnMgICAgID0ge30sXG5kYXRhIFx0ICA9IHt9LFxubGlzdGVuZXJzID0ge31cbn06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFQge1xuXG5pZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbnRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxubGV0IEN1c3RvbUNsYXNzID0gY3VzdG9tRWxlbWVudHMuZ2V0KHRhZ25hbWUpO1xuaWYoQ3VzdG9tQ2xhc3MgPT09IHVuZGVmaW5lZClcbnRocm93IG5ldyBFcnJvcihgJHt0YWduYW1lfSBub3QgZGVmaW5lZGApO1xubGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuLy9UT0RPOiBmYWN0b3JpemUuLi5cblxuLy8gRml4IGlzc3VlICMyXG5pZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuZWxlbS5pZCA9IGlkO1xuXG5pZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG5mb3IobGV0IG5hbWUgaW4gY3NzdmFycylcbmVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG5mb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxubGV0IHZhbHVlID0gYXR0cnNbbmFtZV07XG5pZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbmVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbmVsc2VcbmVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbn1cblxuZm9yKGxldCBuYW1lIGluIGRhdGEpIHtcblxubGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbmlmKCB2YWx1ZSA9PT0gZmFsc2UpXG5kZWxldGUgZWxlbS5kYXRhc2V0W25hbWVdO1xuZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbmVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG5lbHNlXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbn1cblxuaWYoICEgQXJyYXkuaXNBcnJheShjb250ZW50KSApXG5jb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbmVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG5mb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbmlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG5wYXJlbnQuYXBwZW5kKGVsZW0pO1xuXG5pZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbkxJU1MuaW5pdGlhbGl6ZVN5bmMoZWxlbSk7XG5cbnJldHVybiBMSVNTLmdldExJU1NTeW5jKGVsZW0pO1xufVxuTElTUy5idWlsZFN5bmMgPSBidWlsZFN5bmM7XG4qLyIsIlxuaW1wb3J0IHsgQ29uc3RydWN0b3IgfSBmcm9tIFwidHlwZXNcIjtcblxudHlwZSBMaXN0ZW5lckZjdDxUIGV4dGVuZHMgRXZlbnQ+ID0gKGV2OiBUKSA9PiB2b2lkO1xudHlwZSBMaXN0ZW5lck9iajxUIGV4dGVuZHMgRXZlbnQ+ID0geyBoYW5kbGVFdmVudDogTGlzdGVuZXJGY3Q8VD4gfTtcbnR5cGUgTGlzdGVuZXI8VCBleHRlbmRzIEV2ZW50PiA9IExpc3RlbmVyRmN0PFQ+fExpc3RlbmVyT2JqPFQ+O1xuXG5leHBvcnQgY2xhc3MgRXZlbnRUYXJnZXQyPEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIEV2ZW50Pj4gZXh0ZW5kcyBFdmVudFRhcmdldCB7XG5cblx0b3ZlcnJpZGUgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIGNhbGxiYWNrOiBMaXN0ZW5lcjxFdmVudHNbVF0+IHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBvcHRpb25zPzogQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuKTogdm9pZCB7XG5cdFx0XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0cmV0dXJuIHN1cGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9XG5cblx0b3ZlcnJpZGUgZGlzcGF0Y2hFdmVudDxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+PihldmVudDogRXZlbnRzW1RdKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHN1cGVyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG5cblx0b3ZlcnJpZGUgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgRXhjbHVkZTxrZXlvZiBFdmVudHMsIHN5bWJvbHxudW1iZXI+Pih0eXBlOiBULFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsaXN0ZW5lcjogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IG9wdGlvbnM/OiBib29sZWFufEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZCB7XG5cblx0XHQvL0B0cy1pZ25vcmVcblx0XHRzdXBlci5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXZlbnQyPFQgZXh0ZW5kcyBzdHJpbmcsIEFyZ3M+IGV4dGVuZHMgQ3VzdG9tRXZlbnQ8QXJncz4ge1xuXG5cdGNvbnN0cnVjdG9yKHR5cGU6IFQsIGFyZ3M6IEFyZ3MpIHtcblx0XHRzdXBlcih0eXBlLCB7ZGV0YWlsOiBhcmdzfSk7XG5cdH1cblxuXHRvdmVycmlkZSBnZXQgdHlwZSgpOiBUIHsgcmV0dXJuIHN1cGVyLnR5cGUgYXMgVDsgfVxufVxuXG50eXBlIEluc3RhbmNlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+Pj4gPSB7XG5cdFtLIGluIGtleW9mIFRdOiBJbnN0YW5jZVR5cGU8VFtLXT5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdpdGhFdmVudHM8VCBleHRlbmRzIG9iamVjdCwgRXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgQ29uc3RydWN0b3I8RXZlbnQ+PiA+KGV2OiBDb25zdHJ1Y3RvcjxUPiwgX2V2ZW50czogRXZlbnRzKSB7XG5cblx0dHlwZSBFdnRzID0gSW5zdGFuY2VzPEV2ZW50cz47XG5cblx0aWYoICEgKGV2IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQpIClcblx0XHRyZXR1cm4gZXYgYXMgQ29uc3RydWN0b3I8T21pdDxULCBrZXlvZiBFdmVudFRhcmdldD4gJiBFdmVudFRhcmdldDI8RXZ0cz4+O1xuXG5cdC8vIGlzIGFsc28gYSBtaXhpblxuXHQvLyBAdHMtaWdub3JlXG5cdGNsYXNzIEV2ZW50VGFyZ2V0TWl4aW5zIGV4dGVuZHMgZXYge1xuXG5cdFx0I2V2ID0gbmV3IEV2ZW50VGFyZ2V0MjxFdnRzPigpO1xuXG5cdFx0YWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hFdmVudCguLi5hcmdzOmFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRyZXR1cm4gdGhpcy4jZXYuZGlzcGF0Y2hFdmVudCguLi5hcmdzKTtcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiBFdmVudFRhcmdldE1peGlucyBhcyB1bmtub3duIGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+Pjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBTaGFkb3dSb290IHRvb2xzID09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBldmVudE1hdGNoZXMoZXY6IEV2ZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cblx0bGV0IGVsZW1lbnRzID0gZXYuY29tcG9zZWRQYXRoKCkuc2xpY2UoMCwtMikuZmlsdGVyKGUgPT4gISAoZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpICkucmV2ZXJzZSgpIGFzIEhUTUxFbGVtZW50W107XG5cblx0Zm9yKGxldCBlbGVtIG9mIGVsZW1lbnRzIClcblx0XHRpZihlbGVtLm1hdGNoZXMoc2VsZWN0b3IpIClcblx0XHRcdHJldHVybiBlbGVtOyBcblxuXHRyZXR1cm4gbnVsbDtcbn0iLCJcbmltcG9ydCB0eXBlIHsgTElTU0Jhc2UsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplU3luYywgd2hlbkluaXRpYWxpemVkIH0gZnJvbSBcIi4uL3N0YXRlXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRzIHt9O1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIC8vIGFzeW5jXG4gICAgICAgIHFzIDogdHlwZW9mIHFzO1xuICAgICAgICBxc286IHR5cGVvZiBxc287XG4gICAgICAgIHFzYTogdHlwZW9mIHFzYTtcbiAgICAgICAgcXNjOiB0eXBlb2YgcXNjO1xuXG4gICAgICAgIC8vIHN5bmNcbiAgICAgICAgcXNTeW5jIDogdHlwZW9mIHFzU3luYztcbiAgICAgICAgcXNhU3luYzogdHlwZW9mIHFzYVN5bmM7XG4gICAgICAgIHFzY1N5bmM6IHR5cGVvZiBxc2NTeW5jO1xuXG5cdFx0Y2xvc2VzdDogdHlwZW9mIGNsb3Nlc3Q7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsaXNzX3NlbGVjdG9yKG5hbWU/OiBzdHJpbmcpIHtcblx0aWYobmFtZSA9PT0gdW5kZWZpbmVkKSAvLyBqdXN0IGFuIGg0Y2tcblx0XHRyZXR1cm4gXCJcIjtcblx0cmV0dXJuIGA6aXMoJHtuYW1lfSwgW2lzPVwiJHtuYW1lfVwiXSlgO1xufVxuXG5mdW5jdGlvbiBfYnVpbGRRUyhzZWxlY3Rvcjogc3RyaW5nLCB0YWduYW1lX29yX3BhcmVudD86IHN0cmluZyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCwgcGFyZW50OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXHRcblx0aWYoIHRhZ25hbWVfb3JfcGFyZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRhZ25hbWVfb3JfcGFyZW50ICE9PSAnc3RyaW5nJykge1xuXHRcdHBhcmVudCA9IHRhZ25hbWVfb3JfcGFyZW50O1xuXHRcdHRhZ25hbWVfb3JfcGFyZW50ID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cmV0dXJuIFtgJHtzZWxlY3Rvcn0ke2xpc3Nfc2VsZWN0b3IodGFnbmFtZV9vcl9wYXJlbnQgYXMgc3RyaW5nfHVuZGVmaW5lZCl9YCwgcGFyZW50XSBhcyBjb25zdDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGxldCByZXN1bHQgPSBhd2FpdCBxc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFRbXT47XG5hc3luYyBmdW5jdGlvbiBxc2E8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl1bXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxUPj4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cHJvbWlzZXNbaWR4KytdID0gd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc2M8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4ocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVDtcbmZ1bmN0aW9uIHFzU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTxUPiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRyZXN1bHRbaWR4KytdID0gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFQ7XG5mdW5jdGlvbiBxc2NTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPihyZXN1bHQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2xvc2VzdDxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCkge1xuXG5cdHdoaWxlKHRydWUpIHtcblx0XHR2YXIgcmVzdWx0ID0gZWxlbWVudC5jbG9zZXN0PEU+KHNlbGVjdG9yKTtcblxuXHRcdGlmKCByZXN1bHQgIT09IG51bGwpXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcblx0XHRpZiggISAoXCJob3N0XCIgaW4gcm9vdCkgKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRlbGVtZW50ID0gKHJvb3QgYXMgU2hhZG93Um9vdCkuaG9zdDtcblx0fVxufVxuXG5cbi8vIGFzeW5jXG5MSVNTLnFzICA9IHFzO1xuTElTUy5xc28gPSBxc287XG5MSVNTLnFzYSA9IHFzYTtcbkxJU1MucXNjID0gcXNjO1xuXG4vLyBzeW5jXG5MSVNTLnFzU3luYyAgPSBxc1N5bmM7XG5MSVNTLnFzYVN5bmMgPSBxc2FTeW5jO1xuTElTUy5xc2NTeW5jID0gcXNjU3luYztcblxuTElTUy5jbG9zZXN0ID0gY2xvc2VzdDsiLCJpbXBvcnQgTElTUyBmcm9tIFwiLi9leHRlbmRzXCI7XG5cbmltcG9ydCBcIi4vY29yZS9zdGF0ZVwiO1xuaW1wb3J0IFwiLi9jb3JlL2N1c3RvbVJlZ2lzdGVyeVwiO1xuXG4vL1RPRE86IEJMSVNTXG5cbi8vVE9ETzogZXZlbnRzLnRzXG4vL1RPRE86IGdsb2JhbENTU1J1bGVzXG5pbXBvcnQgXCIuL2hlbHBlcnMvTElTU0F1dG9cIjtcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge2xpc3MsIGxpc3NTeW5jfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5leHBvcnQge2V2ZW50TWF0Y2hlcywgV2l0aEV2ZW50cywgRXZlbnRUYXJnZXQyLCBDdXN0b21FdmVudDJ9IGZyb20gJy4vaGVscGVycy9ldmVudHMnO1xuZXhwb3J0IHtMSVNTUGFyYW1zfSBmcm9tIFwiLi9oZWxwZXJzL0xJU1NQYXJhbXNcIjtcbmV4cG9ydCB7aHRtbH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgZ2V0SG9zdENzdHIsIGdldE5hbWUgfSBmcm9tIFwiLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5lbnVtIFN0YXRlIHtcbiAgICBOT05FID0gMCxcblxuICAgIC8vIGNsYXNzXG4gICAgREVGSU5FRCA9IDEgPDwgMCxcbiAgICBSRUFEWSAgID0gMSA8PCAxLFxuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBVUEdSQURFRCAgICA9IDEgPDwgMixcbiAgICBJTklUSUFMSVpFRCA9IDEgPDwgMyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRklORUQgICAgID0gU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IFN0YXRlLlJFQURZO1xuZXhwb3J0IGNvbnN0IFVQR1JBREVEICAgID0gU3RhdGUuVVBHUkFERUQ7XG5leHBvcnQgY29uc3QgSU5JVElBTElaRUQgPSBTdGF0ZS5JTklUSUFMSVpFRDtcblxuZXhwb3J0IGNsYXNzIExJU1NTdGF0ZSB7XG5cbiAgICAjZWxlbTogSFRNTEVsZW1lbnR8bnVsbDtcblxuICAgIC8vIGlmIG51bGwgOiBjbGFzcyBzdGF0ZSwgZWxzZSBpbnN0YW5jZSBzdGF0ZVxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEhUTUxFbGVtZW50fG51bGwgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuI2VsZW0gPSBlbGVtO1xuICAgIH1cblxuICAgIHN0YXRpYyBERUZJTkVEICAgICA9IERFRklORUQ7XG4gICAgc3RhdGljIFJFQURZICAgICAgID0gUkVBRFk7XG4gICAgc3RhdGljIFVQR1JBREVEICAgID0gVVBHUkFERUQ7XG4gICAgc3RhdGljIElOSVRJQUxJWkVEID0gSU5JVElBTElaRUQ7XG5cbiAgICBpcyhzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCAgICAgJiYgISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZICAgICAgICYmICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgICAgJiYgISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCAmJiAhIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW4oc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGxldCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPGFueT4+KCk7XG4gICAgXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuRGVmaW5lZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblJlYWR5KCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuVXBncmFkZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5Jbml0aWFsaXplZCgpICk7XG4gICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gREVGSU5FRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0RlZmluZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFJFQURZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHIoZ2V0TmFtZShlbGVtKSk7XG5cbiAgICAgICAgaWYoICEgaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBIb3N0LmlzRGVwc1Jlc29sdmVkO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW5SZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpOyAvLyBjb3VsZCBiZSByZWFkeSBiZWZvcmUgZGVmaW5lZCwgYnV0IHdlbGwuLi5cblxuICAgICAgICBhd2FpdCB3aGVuRE9NQ29udGVudExvYWRlZDtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5EZXBzUmVzb2x2ZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vID09PT09PT09PT09PT09PT09PSBVUEdSQURFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1VwZ3JhZGVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICBjb25zdCBob3N0ID0gZ2V0SG9zdENzdHIoZ2V0TmFtZShlbGVtKSk7XG4gICAgICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgaG9zdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpO1xuICAgIFxuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIGhvc3QpXG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIFxuICAgICAgICAvLyBoNGNrXG4gICAgXG4gICAgICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgICAgICBcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuICAgIFxuICAgICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IElOSVRJQUxJWkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gXCJpc0luaXRpYWxpemVkXCIgaW4gZWxlbSAmJiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuYmFzZSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBDT05WRVJTSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhbHVlT2YoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZTogU3RhdGUgPSAwO1xuICAgIFxuICAgICAgICBpZiggdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gREVGSU5FRDtcbiAgICAgICAgaWYoIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICBzdGF0ZSB8PSBSRUFEWTtcbiAgICAgICAgaWYoIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBVUEdSQURFRDtcbiAgICAgICAgaWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcbiAgICBcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiREVGSU5FRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgaXMucHVzaChcIlJFQURZXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJJTklUSUFMSVpFRFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGlzLmpvaW4oJ3wnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmKCBcInN0YXRlXCIgaW4gZWxlbSlcbiAgICAgICAgcmV0dXJuIGVsZW0uc3RhdGUgYXMgTElTU1N0YXRlO1xuICAgIFxuICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLnN0YXRlID0gbmV3IExJU1NTdGF0ZShlbGVtKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IFN0YXRlIG1vZGlmaWVycyAobW92ZT8pID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHbyB0byBzdGF0ZSBVUEdSQURFRFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZ3JhZGU8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5EZWZpbmVkKCk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHIoZ2V0TmFtZShlbGVtKSk7XG5cbiAgICBpZiggISAoZWxlbSBpbnN0YW5jZW9mIEhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGRpZG4ndCB1cGdyYWRlIWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgVDtcbn1cblxuLy8gR28gdG8gc3RhdGUgSU5JVElBTElaRURcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemU8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlIClcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlblJlYWR5KCk7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufFRbXCJwYXJhbXNcIl0gPSBmYWxzZSk6IFQge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UpXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBzdGF0ZS5pc1JlYWR5IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IHt9IDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZShwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PSBleHRlcm5hbCBXSEVOID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCB1cGdyYWRlKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlblVwZ3JhZGVkPFQ+KCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJyxcbiAgICBTRU1JT1BFTj0gJ3NlbWktb3Blbidcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50ID9cbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRGYWN0b3J5PEF0dHJzIGV4dGVuZHMgc3RyaW5nLCBQYXJhbXMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4+ID0gKCAoYXR0cnM6IFJlY29yZDxBdHRycywgbnVsbHxzdHJpbmc+LCBwYXJhbXM6IFBhcmFtcywgZWxlbTpIVE1MRWxlbWVudCkgPT4gTm9kZXx1bmRlZmluZWQgKTtcblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmcsXG4gICAgPiA9IHtcbiAgICAgICAgLy8gSlMgQmFzZVxuICAgICAgICBleHRlbmRzICAgOiBFeHRlbmRzQ3RyLFxuICAgICAgICBwYXJhbXMgICAgOiBQYXJhbXMsXG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGRlcHMgICAgICA6IHJlYWRvbmx5IFByb21pc2U8YW55PltdLFxuXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0cixcbiAgICAgICAgYXR0cnMgIDogcmVhZG9ubHkgQXR0cnNbXSxcbiAgICAgICAgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiByZWFkb25seSBBdHRyc1tdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXRcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgY29udGVudD86IEhUTUxfU291cmNlLFxuICAgICAgICBjb250ZW50X2ZhY3Rvcnk6IChjb250ZW50PzogRXhjbHVkZTxIVE1MX1Jlc291cmNlLCBSZXNwb25zZT4pID0+IENvbnRlbnRGYWN0b3J5PEF0dHJzLCBQYXJhbXM+LFxuICAgICAgICBjc3MgICAgIDogQ1NTX1NvdXJjZSB8IHJlYWRvbmx5IENTU19Tb3VyY2VbXSxcbiAgICAgICAgc2hhZG93ICA6IFNoYWRvd0NmZ1xufVxuXG4vLyBMSVNTQmFzZVxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZUNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBJbnN0YW5jZVR5cGU8TElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBUIGV4dGVuZHMgTElTU0Jhc2U8XG4gICAgICAgICAgICBpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgQixcbiAgICAgICAgICAgIGluZmVyIEMsXG4gICAgICAgICAgICBpbmZlciBEPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0Jhc2VDc3RyPEEsQixDLEQ+IDogbmV2ZXI7XG5cblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHIgPSBMSVNTQmFzZT4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQmFzZSA/IExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyID0gTElTU0Jhc2U+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IEhUTUxDTEFTU19SRUdFWCA9ICAvSFRNTChcXHcrKUVsZW1lbnQvO1xuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXHRcblx0bGV0IGh0bWx0YWcgPSBIVE1MQ0xBU1NfUkVHRVguZXhlYyhDbGFzcy5uYW1lKSFbMV07XG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG5leHBvcnQgdHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXJcblxuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7IiwiaW1wb3J0IExJU1MsIHtodG1sLCBsaXNzfSBmcm9tICcuLi8uLi8uLi8nO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNsYXNzIE15Q29tcG9uZW50QSBleHRlbmRzIExJU1MoKSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQucmVwbGFjZUNoaWxkcmVuKGh0bWxgPGI+aHRtbFxcYFxcYCA6IE9LPC9iPmApO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUoJ215LWNvbXBvbmVudC1hJywgTXlDb21wb25lbnRBKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBNeUNvbXBvbmVudEIgZXh0ZW5kcyBMSVNTKHtcbiAgICBjb250ZW50OiBcImxpc3NgYFwiXG59KSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbml0XCIpO1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUoJ215LWNvbXBvbmVudC1iJywgTXlDb21wb25lbnRCKTtcblxuYXN5bmMgZnVuY3Rpb24gZm9vKCkge1xuXG4gICAgY29uc3QgY29tcG9uZW50ID0gYXdhaXQgbGlzc2A8bXktY29tcG9uZW50LWI+PC9teS1jb21wb25lbnQtYj5gO1xuICAgIFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGNvbXBvbmVudC5ob3N0KTtcbn1cblxuZm9vKCk7XG5cbntcbiAgICBsZXQgY29tcG8gPSBuZXcgTXlDb21wb25lbnRCLkhvc3QoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChjb21wbyk7XG5cbiAgICBjb25zb2xlLndhcm4oXCJob3N0XCIsIExJU1MuZ2V0U3RhdGUoY29tcG8pICk7XG59XG57XG4gICAgbGV0IGNvbXBvID0gbmV3IE15Q29tcG9uZW50QigpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGNvbXBvLmhvc3QpO1xuXG4gICAgY29uc29sZS53YXJuKFwiYmFzZVwiLCBMSVNTLmdldFN0YXRlKGNvbXBvLmhvc3QpICk7XG59XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwicGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXguaHRtbFwiOyJdLCJuYW1lcyI6WyJTaGFkb3dDZmciLCJidWlsZExJU1NIb3N0IiwiX2VsZW1lbnQydGFnbmFtZSIsImlzU2hhZG93U3VwcG9ydGVkIiwiaHRtbCIsIl9fY3N0cl9ob3N0Iiwic2V0Q3N0ckhvc3QiLCJfIiwiREVGQVVMVF9DT05URU5UX0ZBQ1RPUlkiLCJjb250ZW50IiwidHJpbSIsImxlbmd0aCIsInVuZGVmaW5lZCIsIkhUTUxUZW1wbGF0ZUVsZW1lbnQiLCJjbG9uZU5vZGUiLCJMSVNTIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwicGFyYW1zIiwiZGVwcyIsImhvc3QiLCJIVE1MRWxlbWVudCIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJzIiwiY29udGVudF9mYWN0b3J5IiwiX2NvbnRlbnRfZmFjdG9yeSIsImNzcyIsInNoYWRvdyIsIlNFTUlPUEVOIiwiTk9ORSIsIk9QRU4iLCJFcnJvciIsImFsbF9kZXBzIiwiUHJvbWlzZSIsIlJlc3BvbnNlIiwiX2NvbnRlbnQiLCJwdXNoIiwidGV4dCIsIkxJU1NCYXNlIiwiTElTU0NmZyIsInN0eWxlc2hlZXRzIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiYyIsImlkeCIsInByb2Nlc3NfY3NzIiwiY29uc3RydWN0b3IiLCJhcmdzIiwiSG9zdCIsInN0YXRlIiwic2V0QXR0ckRlZmF1bHQiLCJhdHRyIiwidmFsdWUiLCJvbkF0dHJDaGFuZ2VkIiwiX25hbWUiLCJfb2xkVmFsdWUiLCJfbmV3VmFsdWUiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJ1cGRhdGVQYXJhbXMiLCJhc3NpZ24iLCJpc0luRE9NIiwiaXNDb25uZWN0ZWQiLCJvbkRPTUNvbm5lY3RlZCIsImNvbm5lY3RlZENhbGxiYWNrIiwib25ET01EaXNjb25uZWN0ZWQiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsIl9Ib3N0IiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJMSVNTU3RhdGUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImlkIiwic2hhcmVkQ1NTIiwiZ2V0U2hhcmVkQ1NTIiwiTGlzcyIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwid2FpdFJlYWR5IiwiciIsImFsbCIsImlzUmVhZHkiLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJMSVNTSG9zdEJhc2UiLCJCYXNlIiwiYmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwiaW5pdCIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiQ1NTU2VsZWN0b3IiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicHJvbWlzZSIsInJlc29sdmUiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJzaGFkb3dSb290IiwiY29uc29sZSIsIndhcm4iLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJtb2RlIiwiYXR0YWNoU2hhZG93Iiwib2JzIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwiY3Nzc2VsZWN0b3IiLCJoYXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsImlubmVySFRNTCIsInJlcGxhY2UiLCJoZWFkIiwiYXBwZW5kIiwiYWRkIiwib2JqIiwiY2hpbGROb2RlcyIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJkZWZpbmUiLCJnZXRCYXNlQ3N0ciIsImdldEhvc3RDc3RyIiwiZ2V0TmFtZSIsImlzRGVmaW5lZCIsIndoZW5BbGxEZWZpbmVkIiwid2hlbkRlZmluZWQiLCJnZXRTdGF0ZSIsImluaXRpYWxpemVTeW5jIiwidXBncmFkZVN5bmMiLCJ3aGVuVXBncmFkZWQiLCJERUZJTkVEIiwiUkVBRFkiLCJVUEdSQURFRCIsIklOSVRJQUxJWkVEIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiQ2xhc3MiLCJodG1sdGFnIiwiTElTU2NsYXNzIiwib3B0cyIsInRhZ25hbWVzIiwidCIsImVsZW1lbnQiLCJFbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsIl9MSVNTIiwiSUxJU1MiLCJFeHRlbmRlZExJU1MiLCJMSVNTX0F1dG8iLCJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwicmVnaXN0ZXIiLCJzdyIsInNjb3BlIiwiY29udHJvbGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkaXRpb24iLCJhZGRlZE5vZGVzIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtIiwicmVzb3VyY2VzIiwiZGVmaW5lV2ViQ29tcG9uZW50IiwiZmlsZXMiLCJqcyIsImtsYXNzIiwic3RyIiwic3BhbnMiLCJfYSIsIl9iIiwic3BhbiIsInRleHRDb250ZW50IiwiV2ViQ29tcG9uZW50IiwiZmlsZW5hbWVzIiwiZmlsZSIsImVuZHNXaXRoIiwiX2ltcG9ydCIsIl9mZXRjaFRleHQiLCJpIiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImRlZmF1bHQiLCJlIiwibG9nIiwiTElTU1BhcmFtcyIsInAiLCJwYXJlbnRFbGVtZW50Iiwib25WYWx1ZUNoYW5nZWQiLCJ0eXBlIiwiX3BhcnNlQ29udGVudCIsIkpTT04iLCJwYXJzZSIsImtleXMiLCJnZXRBcmdzIiwiRnVuY3Rpb24iLCJjYWxsIiwidmFsdWVzIiwibGlzcyIsIkRvY3VtZW50RnJhZ21lbnQiLCJsaXNzU3luYyIsIkV2ZW50VGFyZ2V0MiIsIkV2ZW50VGFyZ2V0IiwiY2FsbGJhY2siLCJkaXNwYXRjaEV2ZW50IiwiZXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJDdXN0b21FdmVudDIiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIldpdGhFdmVudHMiLCJldiIsIl9ldmVudHMiLCJFdmVudFRhcmdldE1peGlucyIsImV2ZW50TWF0Y2hlcyIsInNlbGVjdG9yIiwiZWxlbWVudHMiLCJjb21wb3NlZFBhdGgiLCJzbGljZSIsImZpbHRlciIsIlNoYWRvd1Jvb3QiLCJyZXZlcnNlIiwibWF0Y2hlcyIsImxpc3Nfc2VsZWN0b3IiLCJfYnVpbGRRUyIsInRhZ25hbWVfb3JfcGFyZW50IiwicGFyZW50IiwicXMiLCJyZXN1bHQiLCJxc28iLCJxc2EiLCJwcm9taXNlcyIsInFzYyIsInJlcyIsImNsb3Nlc3QiLCJxc1N5bmMiLCJxc2FTeW5jIiwicXNjU3luYyIsInJvb3QiLCJnZXRSb290Tm9kZSIsIndoZW5ET01Db250ZW50TG9hZGVkIiwiU3RhdGUiLCJpcyIsImlzVXBncmFkZWQiLCJ3aGVuIiwid2hlblJlYWR5IiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJzdHJpY3QiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZm9yY2UiLCJMaWZlQ3ljbGUiLCJIVE1MQ0xBU1NfUkVHRVgiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiZXhlYyIsIkNBTl9IQVZFX1NIQURPVyIsInRhZyIsInJlYWR5U3RhdGUiLCJzdHJpbmciLCJ0ZW1wbGF0ZSIsImZpcnN0Q2hpbGQiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJNeUNvbXBvbmVudEEiLCJyZXBsYWNlQ2hpbGRyZW4iLCJNeUNvbXBvbmVudEIiLCJmb28iLCJjb21wb25lbnQiLCJib2R5IiwiY29tcG8iXSwic291cmNlUm9vdCI6IiJ9