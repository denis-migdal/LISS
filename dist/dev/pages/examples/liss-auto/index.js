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
/* harmony export */   buildLISSHost: () => (/* binding */ buildLISSHost)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/state.ts");
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");




let id = 0;
//TODO: shadow utils ?
const sharedCSS = new CSSStyleSheet();
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
/* harmony export */   CustomEvent2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_5__.CustomEvent2),
/* harmony export */   EventTarget2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_5__.EventTarget2),
/* harmony export */   WithEvents: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_5__.WithEvents),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   eventMatches: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_5__.eventMatches),
/* harmony export */   html: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_7__.html),
/* harmony export */   liss: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_6__.liss),
/* harmony export */   lissSync: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_6__.lissSync)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extends */ "./src/extends.ts");
/* harmony import */ var _core_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/state */ "./src/core/state.ts");
/* harmony import */ var _core_customRegistery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/customRegistery */ "./src/core/customRegistery.ts");
/* harmony import */ var _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/LISSAuto */ "./src/helpers/LISSAuto.ts");
/* harmony import */ var _helpers_querySelectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/querySelectors */ "./src/helpers/querySelectors.ts");
/* harmony import */ var _helpers_events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers/events */ "./src/helpers/events.ts");
/* harmony import */ var _helpers_build__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/build */ "./src/helpers/build.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



//TODO: BLISS
//TODO: events.ts
//TODO: globalCSSRules

//TODO: LISSParams




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
/*!***********************************************!*\
  !*** ./src/pages/examples/liss-auto/index.ts ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../ */ "./src/index.ts");


})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./src/pages/examples/liss-auto/index.html ***!
  \*************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "pages/examples/liss-auto/index.html");
})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7OztVQ05BOzs7Ozs7Ozs7Ozs7O0FDQW1COzs7Ozs7Ozs7Ozs7O0FDQW5CLGlFQUFlLHFCQUF1Qix3Q0FBd0MsRSIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2NvcmUvY3VzdG9tUmVnaXN0ZXJ5LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY29yZS9zdGF0ZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2N1c3RvbVJlZ2lzdGVyeS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2V4dGVuZHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL0xJU1NBdXRvLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9idWlsZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvZXZlbnRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9xdWVyeVNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvbGlzcy1hdXRvL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvbGlzcy1hdXRvL2luZGV4Lmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDbGFzcywgQ29uc3RydWN0b3IsIENvbnRlbnRGYWN0b3J5LCBDU1NfU291cmNlLCBIVE1MX1Jlc291cmNlLCBIVE1MX1NvdXJjZSwgTElTU19PcHRzIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgTElTU1N0YXRlIH0gZnJvbSBcInN0YXRlXCI7XG5cbmltcG9ydCB7U2hhZG93Q2ZnfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc1NoYWRvd1N1cHBvcnRlZCwgaHRtbCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERFRkFVTFRfQ09OVEVOVF9GQUNUT1JZKGNvbnRlbnQ/OiBFeGNsdWRlPEhUTUxfUmVzb3VyY2UsIFJlc3BvbnNlPikge1xuXG5cdGlmKCB0eXBlb2YgY29udGVudCA9PT0gXCJzdHJpbmdcIikge1xuXG5cdFx0Y29udGVudCA9IGNvbnRlbnQudHJpbSgpO1xuXHRcdGlmKCBjb250ZW50Lmxlbmd0aCA9PT0gMCApXG5cdFx0XHRjb250ZW50ID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdGNvbnRlbnQgPSBodG1sYCR7Y29udGVudH1gO1xuXG5cdFx0Ly8gVE9ETyBMSVNTQXV0byBwYXJzZXIuLi5cblx0XHQvLyBvbmx5IGlmIG5vIEpTLi4uXG5cdFx0Ly8gdG9sZXJhdGUgbm9uLW9wdGkgKGVhc2llciA/KSBvciBzcGFuW3ZhbHVlXSA/XG5cdFx0XHQvLyA9PiByZWNvcmQgZWxlbWVudCB3aXRoIHRhcmdldC4uLlxuXHRcdFx0Ly8gPT4gY2xvbmUoYXR0cnMsIHBhcmFtcykgPT4gZm9yIGVhY2ggc3BhbiByZXBsYWNlIHRoZW4gY2xvbmUuXG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdC8vbGV0IHN0ciA9IChjb250ZW50IGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiB0aGlzLmdldEF0dHJpYnV0ZShtYXRjaCk/PycnKVxuXHR9XG5cblx0aWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KVxuXHRcdGNvbnRlbnQgPSBjb250ZW50LmNvbnRlbnQ7XG5cblx0cmV0dXJuICgpID0+IGNvbnRlbnQ/LmNsb25lTm9kZSh0cnVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG5cdC8vIEhUTUwgQmFzZVxuXHRIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuXHRBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXIsIC8vc3RyaW5nLFxuPih7XG5cbiAgICAvLyBKUyBCYXNlXG4gICAgZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3RyLCAvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cbiAgICBwYXJhbXMgICAgICAgICAgICA9IHt9ICAgICBhcyB1bmtub3duIGFzIFBhcmFtcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGRlcHMgICA9IFtdLFxuXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgaG9zdCAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRvYnNlcnZlZEF0dHJpYnV0ZXMgPSBbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0LlxuICAgIGF0dHJzID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgY29udGVudCxcblx0Y29udGVudF9mYWN0b3J5OiBfY29udGVudF9mYWN0b3J5ID0gREVGQVVMVF9DT05URU5UX0ZBQ1RPUlksXG4gICAgY3NzLFxuICAgIHNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpID8gU2hhZG93Q2ZnLlNFTUlPUEVOIDogU2hhZG93Q2ZnLk5PTkVcbn06IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4gPSB7fSkge1xuXG4gICAgaWYoIHNoYWRvdyAhPT0gU2hhZG93Q2ZnLk9QRU4gJiYgISBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICBjb25zdCBhbGxfZGVwcyA9IFsuLi5kZXBzXTtcblxuXHRsZXQgY29udGVudF9mYWN0b3J5OiBDb250ZW50RmFjdG9yeTxBdHRycywgUGFyYW1zPjtcblxuICAgIC8vIGNvbnRlbnQgcHJvY2Vzc2luZ1xuICAgIGlmKCBjb250ZW50IGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSB7XG4gICAgICAgIFxuXHRcdGxldCBfY29udGVudDogSFRNTF9Tb3VyY2V8dW5kZWZpbmVkID0gY29udGVudDtcblx0XHRjb250ZW50ID0gbnVsbCBhcyB1bmtub3duIGFzIHN0cmluZztcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBfY29udGVudCA9IGF3YWl0IF9jb250ZW50O1xuICAgICAgICAgICAgaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cblx0XHRcdFx0X2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG5cbiAgICAgICAgICAgIExJU1NCYXNlLkxJU1NDZmcuY29udGVudF9mYWN0b3J5ID0gX2NvbnRlbnRfZmFjdG9yeShfY29udGVudCk7XG4gICAgICAgIH0pKCkgKTtcblxuICAgIH0gZWxzZSB7XG5cdFx0Y29udGVudF9mYWN0b3J5ID0gX2NvbnRlbnRfZmFjdG9yeShjb250ZW50KTtcblx0fVxuXG5cdC8vIENTUyBwcm9jZXNzaW5nXG5cdGxldCBzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdID0gW107XG5cdGlmKCBjc3MgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG5cdFx0XHQvLyBAdHMtaWdub3JlIDogdG9kbzogTElTU09wdHMgPT4gc2hvdWxkIG5vdCBiZSBhIGdlbmVyaWMgP1xuXHRcdFx0Y3NzID0gW2Nzc107XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0c3R5bGVzaGVldHMgPSBjc3MubWFwKCAoYzogQ1NTX1NvdXJjZSwgaWR4OiBudW1iZXIpID0+IHtcblxuXHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG5cdFx0XHRcdGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0XHRjID0gYXdhaXQgYztcblx0XHRcdFx0XHRpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcblx0XHRcdFx0XHRcdGMgPSBhd2FpdCBjLnRleHQoKTtcblxuXHRcdFx0XHRcdHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuXHRcdFx0XHR9KSgpKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcm9jZXNzX2NzcyhjKTtcblx0XHR9KTtcblx0fVxuXG5cdHR5cGUgTElTU0hvc3Q8VD4gPSBhbnk7IC8vVE9ETy4uLlxuXHR0eXBlIExIb3N0ID0gTElTU0hvc3Q8TElTU0Jhc2U+OyAvLzwtIGNvbmZpZyBpbnN0ZWFkIG9mIExJU1NCYXNlID9cblxuXHRjbGFzcyBMSVNTQmFzZSBleHRlbmRzIF9leHRlbmRzIHtcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKVxuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3Qoe30sIHRoaXMpO1xuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBhbnk7IC8vIHByZXZlbnRzIGlzc3VlICMxLi4uXG5cblx0XHQvLyBMSVNTIENvbmZpZ3Ncblx0XHRzdGF0aWMgcmVhZG9ubHkgTElTU0NmZyA9IHtcblx0XHRcdGhvc3QsXG5cdFx0XHRkZXBzLFxuXHRcdFx0YXR0cnMsXG5cdFx0XHRwYXJhbXMsXG5cdFx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG5cdFx0Z2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5zdGF0ZTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdC8vIGF0dHJzXG5cdFx0cHJvdGVjdGVkIGdldCBhdHRycygpOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgc2V0QXR0ckRlZmF1bHQoIGF0dHI6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuc2V0QXR0ckRlZmF1bHQoYXR0ciwgdmFsdWUpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25BdHRyQ2hhbmdlZChfbmFtZTogQXR0cnMsXG5cdFx0XHRfb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdF9uZXdWYWx1ZTogc3RyaW5nKTogdm9pZHxmYWxzZSB7fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0LlxuXHRcdHByb3RlY3RlZCBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogW0F0dHJzLCBzdHJpbmcsIHN0cmluZ10pIHtcblx0XHRcdHRoaXMub25BdHRyQ2hhbmdlZCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHQvLyBwYXJhbWV0ZXJzXG5cdFx0cHVibGljIGdldCBwYXJhbXMoKTogUmVhZG9ubHk8UGFyYW1zPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcztcblx0XHR9XG5cdFx0cHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPikge1xuXHRcdFx0T2JqZWN0LmFzc2lnbiggKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXG5cdFx0Ly8gRE9NXG5cdFx0cHVibGljIGdldCBpc0luRE9NKCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NQ29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01EaXNjb25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0XG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0luRE9NO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgc3RhdGljIF9Ib3N0OiBMSVNTSG9zdDxMSVNTQmFzZT47XG5cblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzIGFzIGFueSk7IC8vVE9ETzogZml4IHR5cGUgZXJyb3IgKHdoeT8/Pylcblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQmFzZTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19jc3MoY3NzOiBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50KSB7XG5cblx0aWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcblx0XHRyZXR1cm4gY3NzO1xuXHRpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcblx0XHRyZXR1cm4gY3NzLnNoZWV0ITtcblxuXHRsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXHRpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG5cdFx0cmV0dXJuIHN0eWxlO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG59IiwiaW1wb3J0IHsgU2hhZG93Q2ZnLCB0eXBlIExJU1NfT3B0cywgdHlwZSBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwiLi9zdGF0ZVwiO1xuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuaW1wb3J0IHsgQ29tcG9zZUNvbnN0cnVjdG9yLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdhaXRET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IGlkID0gMDtcblxudHlwZSBpbmZlckxJU1M8VD4gPSBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPGluZmVyIEEsIGluZmVyIEIsIGluZmVyIEMsIGluZmVyIEQ+ID8gW0EsQixDLERdIDogbmV2ZXI7XG5cbi8vVE9ETzogc2hhZG93IHV0aWxzID9cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFxuICAgICAgICAgICAgICAgICAgICAgICAgVCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oTGlzczogVCkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRycyxcblx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5MSVNTQ2ZnO1xuXG5cdHR5cGUgUCA9IGluZmVyTElTUzxUPjtcblx0Ly90eXBlIEV4dGVuZHNDc3RyID0gUFswXTtcblx0dHlwZSBQYXJhbXMgICAgICA9IFBbMV07XG5cdHR5cGUgSG9zdENzdHIgICAgPSBQWzJdO1xuXHR0eXBlIEF0dHJzICAgICAgID0gUFszXTtcblxuICAgIHR5cGUgSG9zdCAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIC8vIGF0dHJzIHByb3h5XG5cdGNvbnN0IEdFVCA9IFN5bWJvbCgnZ2V0Jyk7XG5cdGNvbnN0IFNFVCA9IFN5bWJvbCgnc2V0Jyk7XG5cblx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5mcm9tRW50cmllcyggYXR0cnMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHRjb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCB3YWl0UmVhZHkgPSBuZXcgUHJvbWlzZTx2b2lkPiggYXN5bmMgKHIpID0+IHtcblxuICAgICAgICBhd2FpdCB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG5cbiAgICAgICAgcigpO1xuICAgIH0pO1xuXG4gICAgLy8gTm8gZGVwcyBhbmQgRE9NIGFscmVhZHkgbG9hZGVkLlxuICAgIGxldCBpc1JlYWR5ID0gTGlzcy5MSVNTQ2ZnLmRlcHMubGVuZ3RoID09IDAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cblx0Y29uc3QgcGFyYW1zID0gTGlzcy5MSVNTQ2ZnLnBhcmFtczsgLy9PYmplY3QuYXNzaWduKHt9LCBMaXNzLkxJU1NDZmcucGFyYW1zLCBfcGFyYW1zKTtcblxuXHQvL1xuXG5cdGNvbnN0IHdoZW5EZXBzUmVzb2x2ZWQgPSBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cdGxldCBpc0RlcHNSZXNvbHZlZCA9IGZhbHNlO1xuXHQoIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdGlzRGVwc1Jlc29sdmVkID0gdHJ1ZTtcblx0fSkoKTtcblxuXHRjbGFzcyBMSVNTSG9zdEJhc2UgZXh0ZW5kcyAoaG9zdCBhcyBuZXcgKCkgPT4gSFRNTEVsZW1lbnQpIHtcblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gaXNEZXBzUmVzb2x2ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdCh0aGlzLiNiYXNlIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0Z2V0IHBhcmFtcygpOiBQYXJhbXMge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3BhcmFtcztcblx0XHR9XG5cbiAgICAgICAgcHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8TElTU19PcHRzW1wicGFyYW1zXCJdPikge1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5iYXNlIS51cGRhdGVQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgLy8gd2lsIGJlIGdpdmVuIHRvIGNvbnN0cnVjdG9yLi4uXG5cdFx0XHRPYmplY3QuYXNzaWduKCB0aGlzLiNwYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblx0XHQvLyA9PT09PT09PT09PT09PSBBdHRyaWJ1dGVzID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNhdHRyc19mbGFnID0gZmFsc2U7XG5cblx0XHQjYXR0cmlidXRlcyAgICAgICAgID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJpYnV0ZXNEZWZhdWx0cyA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRycyA9IG5ldyBBdHRyaWJ1dGVzKFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlcyxcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0cyxcblx0XHRcdChuYW1lOiBBdHRycywgdmFsdWU6c3RyaW5nfG51bGwpID0+IHtcblxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG5cblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IHRydWU7IC8vIGRvIG5vdCB0cmlnZ2VyIG9uQXR0cnNDaGFuZ2VkLlxuXHRcdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0KSBhcyB1bmtub3duIGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXG5cdFx0c2V0QXR0ckRlZmF1bHQobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRkZWxldGUgdGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRnZXQgYXR0cnMoKTogUmVhZG9ubHk8UmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4+IHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2F0dHJzO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKHBhcmFtczoge30sIGJhc2U/OiBJbnN0YW5jZVR5cGU8VD4pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0aWYoIGJhc2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLiNiYXNlID0gYmFzZTtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0KHRoaXMuYmFzZSEgYXMgYW55KS5vbkRPTURpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuYmFzZSEub25ET01Db25uZWN0ZWQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLnN0YXRlLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgdGhpcy5zdGF0ZS5pc1JlYWR5O1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgZ2V0IHNoYWRvd1Jvb3QoKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJjYWxsZWRcIik7XG5cdFx0XHRpZihzaGFkb3cgPT09IFNoYWRvd0NmZy5TRU1JT1BFTilcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRyZXR1cm4gc3VwZXIuc2hhZG93Um9vdDtcblx0XHR9XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cdFx0XHRcblx0XHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGhpcyk7XG5cbiAgICAgICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi5cblx0XHRcdFxuXHRcdFx0Ly8gc2hhZG93XG5cdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcyBhcyB1bmtub3duIGFzIEhvc3Q7XG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpIHtcblx0XHRcdFx0Y29uc3QgbW9kZSA9IHNoYWRvdyA9PT0gU2hhZG93Q2ZnLlNFTUlPUEVOID8gJ29wZW4nIDogc2hhZG93O1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGV9KTtcblxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGF0dHJzXG5cdFx0XHRmb3IobGV0IG9icyBvZiBhdHRycyEpXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbb2JzIGFzIEF0dHJzXSA9IHRoaXMuZ2V0QXR0cmlidXRlKG9icyk7XG5cblx0XHRcdC8vIGNzc1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MpO1xuXHRcdFx0aWYoIHN0eWxlc2hlZXRzLmxlbmd0aCApIHtcblxuXHRcdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goLi4uc3R5bGVzaGVldHMpO1xuXHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdGNvbnN0IGNzc3NlbGVjdG9yID0gdGhpcy5DU1NTZWxlY3RvcjtcblxuXHRcdFx0XHRcdC8vIGlmIG5vdCB5ZXQgaW5zZXJ0ZWQgOlxuXHRcdFx0XHRcdGlmKCAhIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpICkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuXHRcdFx0XHRcdFx0bGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuXG5cdFx0XHRcdFx0XHRmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG5cdFx0XHRcdFx0XHRcdFx0aHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuXHRcdFx0XHRcdFx0c3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cblx0XHRcdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcblxuXHRcdFx0XHRcdFx0YWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbnRlbnRcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSBjb250ZW50X2ZhY3RvcnkodGhpcy5hdHRycywgdGhpcy5wYXJhbXMsIHRoaXMpO1xuXHRcdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGNvbnRlbnQgKTtcblxuXHQgICAgXHQvLyBidWlsZFxuXG5cdCAgICBcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0ICAgIFx0bGV0IG9iaiA9IHRoaXMuYmFzZSA9PT0gbnVsbCA/IG5ldyBMaXNzKCkgOiB0aGlzLmJhc2U7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSBvYmogYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXG5cdFx0XHQvLyBkZWZhdWx0IHNsb3Rcblx0XHRcdGlmKCB0aGlzLmhhc1NoYWRvdyAmJiB0aGlzLiNjb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwIClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIodGhpcy5iYXNlKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuYmFzZTtcblx0XHR9XG5cblxuXG5cdFx0Ly8gYXR0cnNcblxuXHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBhdHRycztcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSAgICA6IEF0dHJzLFxuXHRcdFx0XHRcdFx0XHRcdCBvbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRcdCBuZXdWYWx1ZTogc3RyaW5nKSB7XG5cblx0XHRcdGlmKHRoaXMuI2F0dHJzX2ZsYWcpIHtcblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSBuZXdWYWx1ZTtcblx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0aWYoICh0aGlzLmJhc2UhIGFzIGFueSkub25BdHRyQ2hhbmdlZChuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLiNhdHRyc1tuYW1lXSA9IG9sZFZhbHVlOyAvLyByZXZlcnQgdGhlIGNoYW5nZS5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0QmFzZSBhcyBDb21wb3NlQ29uc3RydWN0b3I8dHlwZW9mIExJU1NIb3N0QmFzZSwgdHlwZW9mIGhvc3Q+O1xufVxuXG5cbiIsIlxuaW1wb3J0IHsgZGVmaW5lLCBnZXRCYXNlQ3N0ciwgZ2V0SG9zdENzdHIsIGdldE5hbWUsIGlzRGVmaW5lZCwgd2hlbkFsbERlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcImN1c3RvbVJlZ2lzdGVyeVwiO1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZSAgICAgICAgIDogdHlwZW9mIGRlZmluZTtcblx0XHR3aGVuRGVmaW5lZCAgICA6IHR5cGVvZiB3aGVuRGVmaW5lZDtcblx0XHR3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcblx0XHRnZXRIb3N0Q3N0ciAgICA6IHR5cGVvZiBnZXRIb3N0Q3N0cjtcblx0XHRnZXRCYXNlQ3N0ciAgICA6IHR5cGVvZiBnZXRCYXNlQ3N0cjtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldEJhc2VDc3RyICAgID0gZ2V0QmFzZUNzdHI7IiwiXG5pbXBvcnQgeyBERUZJTkVELCBnZXRTdGF0ZSwgaW5pdGlhbGl6ZSwgSU5JVElBTElaRUQsIGluaXRpYWxpemVTeW5jLCBSRUFEWSwgdXBncmFkZSwgVVBHUkFERUQsIHVwZ3JhZGVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQsIHdoZW5VcGdyYWRlZCB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIERFRklORUQgICAgOiB0eXBlb2YgREVGSU5FRCxcbiAgICAgICAgUkVBRFkgICAgICA6IHR5cGVvZiBSRUFEWTtcbiAgICAgICAgVVBHUkFERUQgICA6IHR5cGVvZiBVUEdSQURFRDtcbiAgICAgICAgSU5JVElBTElaRUQ6IHR5cGVvZiBJTklUSUFMSVpFRDtcbiAgICAgICAgZ2V0U3RhdGUgICAgICAgOiB0eXBlb2YgZ2V0U3RhdGU7XG4gICAgICAgIHVwZ3JhZGUgICAgICAgIDogdHlwZW9mIHVwZ3JhZGU7XG4gICAgICAgIGluaXRpYWxpemUgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG4gICAgICAgIHVwZ3JhZGVTeW5jICAgIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuICAgICAgICBpbml0aWFsaXplU3luYyA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcbiAgICAgICAgd2hlblVwZ3JhZGVkICAgOiB0eXBlb2Ygd2hlblVwZ3JhZGVkO1xuICAgICAgICB3aGVuSW5pdGlhbGl6ZWQ6IHR5cGVvZiB3aGVuSW5pdGlhbGl6ZWQ7XG4gICAgfVxufVxuXG5MSVNTLkRFRklORUQgICAgPSBMSVNTLkRFRklORUQsXG5MSVNTLlJFQURZICAgICAgPSBMSVNTLlJFQURZO1xuTElTUy5VUEdSQURFRCAgID0gTElTUy5VUEdSQURFRDtcbkxJU1MuSU5JVElBTElaRUQ9IExJU1MuSU5JVElBTElaRUQ7XG5cbkxJU1MuZ2V0U3RhdGUgICAgICAgPSBnZXRTdGF0ZTtcbkxJU1MudXBncmFkZSAgICAgICAgPSB1cGdyYWRlO1xuTElTUy5pbml0aWFsaXplICAgICA9IGluaXRpYWxpemU7XG5MSVNTLnVwZ3JhZGVTeW5jICAgID0gdXBncmFkZVN5bmM7XG5MSVNTLmluaXRpYWxpemVTeW5jID0gaW5pdGlhbGl6ZVN5bmM7XG5MSVNTLndoZW5VcGdyYWRlZCAgID0gd2hlblVwZ3JhZGVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQ9IHdoZW5Jbml0aWFsaXplZDsiLCJpbXBvcnQgdHlwZSB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLy8gR28gdG8gc3RhdGUgREVGSU5FRFxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPikge1xuXG4gICAgLy8gY291bGQgYmUgYmV0dGVyLlxuICAgIGlmKCBcIkJhc2VcIiBpbiBDb21wb25lbnRDbGFzcykge1xuICAgICAgICBDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzLkJhc2UgYXMgVDtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgQ2xhc3MgID0gQ29tcG9uZW50Q2xhc3MuTElTU0NmZy5ob3N0O1xuICAgIGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cbiAgICBjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKHRhZ25hbWU6IHN0cmluZyApIHtcblx0cmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKG5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NCYXNlfExJU1NCYXNlQ3N0cnxMSVNTSG9zdDxMSVNTQmFzZT58TElTU0hvc3RDc3RyPExJU1NCYXNlPiApOiBzdHJpbmcge1xuXG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50LmNvbnN0cnVjdG9yKVxuXHRcdGVsZW1lbnQgPSBlbGVtZW50LmNvbnN0cnVjdG9yLkhvc3QgYXMgTElTU0hvc3RDc3RyPExJU1NCYXNlPjtcblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuSG9zdDtcblx0aWYoIFwiQmFzZVwiIGluIGVsZW1lbnQuY29uc3RydWN0b3IpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuY29uc3RydWN0b3IgYXMgTElTU0hvc3RDc3RyPExJU1NCYXNlPjtcblxuXHRpZiggXCJCYXNlXCIgaW4gZWxlbWVudCkge1xuXHRcdGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG5cdFx0aWYobmFtZSA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vdCBkZWZpbmVkIVwiKTtcblxuXHRcdHJldHVybiBuYW1lO1xuXHR9XG5cblx0aWYoICEgKGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKCc/Pz8nKTtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KG5hbWU6IHN0cmluZyk6IFQge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihuYW1lOiBzdHJpbmcpOiBUIHtcblx0cmV0dXJuIGdldEhvc3RDc3RyPExJU1NIb3N0Q3N0cjxUPj4obmFtZSkuQmFzZSBhcyBUO1xufSIsImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge0xJU1MgYXMgX0xJU1N9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuXG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbi8vIGV4dGVuZHMgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICBFeHRlbmRzQ3N0cl9CYXNlIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtc19CYXNlICAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIEhvc3RDc3RyX0Jhc2UgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnNfQmFzZSAgICAgICBleHRlbmRzIHN0cmluZyxcblxuICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyPEV4dGVuZHNDc3RyX0Jhc2UsIFBhcmFtc19CYXNlLCBIb3N0Q3N0cl9CYXNlLCBBdHRyc19CYXNlPixcblxuICAgIC8vIFRPRE86IGFkZCBjb25zdHJhaW50cy4uLlxuICAgIFBhcmFtcyAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxuICAgIEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXI+KG9wdHM6IFBhcnRpYWw8TElTU19PcHRzPEJhc2VDc3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+KTogTElTU0Jhc2VDc3RyXG4vLyBMSVNTQmFzZSBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4ob3B0cz86IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4pOiBMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+XG5leHBvcnQgZnVuY3Rpb24gTElTUyhvcHRzOiBhbnkpOiBMSVNTQmFzZUNzdHJcbntcbiAgICBpZiggb3B0cy5leHRlbmRzICE9PSB1bmRlZmluZWQgJiYgXCJIb3N0XCIgaW4gb3B0cy5leHRlbmRzICkgLy8gd2UgYXNzdW1lIHRoaXMgaXMgYSBMSVNTQmFzZUNzdHJcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKG9wdHMpO1xuXG4gICAgcmV0dXJuIF9MSVNTKG9wdHMpO1xufVxuXG5mdW5jdGlvbiBfZXh0ZW5kczxcbiAgICBFeHRlbmRzQ3N0cl9CYXNlIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtc19CYXNlICAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIEhvc3RDc3RyX0Jhc2UgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnNfQmFzZSAgICAgICBleHRlbmRzIHN0cmluZyxcblxuICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyPEV4dGVuZHNDc3RyX0Jhc2UsIFBhcmFtc19CYXNlLCBIb3N0Q3N0cl9CYXNlLCBBdHRyc19CYXNlPixcbiAgICBcbiAgICAvLyBUT0RPOiBhZGQgY29uc3RyYWludHMuLi5cbiAgICBQYXJhbXMgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSxcbiAgICBIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyPihvcHRzOiBQYXJ0aWFsPExJU1NfT3B0czxCYXNlQ3N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+Pikge1xuXG4gICAgaWYoIG9wdHMuZXh0ZW5kcyA9PT0gdW5kZWZpbmVkKSAvLyBoNGNrXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYSBMSVNTQmFzZSEnKTtcblxuICAgIGNvbnN0IGJhc2UgPSBvcHRzLmV4dGVuZHMuTElTU0NmZztcblxuICAgIGNvbnN0IGhvc3QgPSBvcHRzLmhvc3QgPz8gYmFzZS5ob3N0O1xuXG4gICAgbGV0IGRlcHMgPSBiYXNlLmRlcHM7XG4gICAgaWYoIG9wdHMuZGVwcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBkZXBzID0gWy4uLmRlcHMsIC4uLm9wdHMuZGVwc107XG5cbiAgICBsZXQgYXR0cnMgPSBiYXNlLmF0dHJzIGFzIHJlYWRvbmx5IChBdHRyc3xBdHRyc19CYXNlKVtdO1xuICAgIGlmKCBvcHRzLmF0dHJzICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGF0dHJzID0gWy4uLmF0dHJzLCAuLi5vcHRzLmF0dHJzXTtcblxuICAgIGxldCBwYXJhbXMgPSBiYXNlLnBhcmFtcztcbiAgICBpZiggb3B0cy5wYXJhbXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihwYXJhbXMsIG9wdHMucGFyYW1zKTtcblxuICAgIC8vVE9ETzogaXNzdWVzIHdpdGggYXN5bmMgY29udGVudC9DU1MgKyBzb21lIGVkZ2UgY2FzZXMuLi5cbiAgICBsZXQgY29udGVudF9mYWN0b3J5ID0gYmFzZS5jb250ZW50X2ZhY3RvcnkgYXMgYW55O1xuICAgIGlmKCBvcHRzLmNvbnRlbnQgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29udGVudF9mYWN0b3J5ID0gb3B0cy5jb250ZW50X2ZhY3RvcnkhKCBvcHRzLmNvbnRlbnQgKTtcblxuICAgIGxldCBzdHlsZXNoZWV0cyA9IGJhc2Uuc3R5bGVzaGVldHM7XG4gICAgaWYoIG9wdHMuY3NzICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHN0eWxlc2hlZXRzID0gWy4uLnN0eWxlc2hlZXRzLCAuLi5vcHRzLmNzc107XG5cbiAgICBjb25zdCBzaGFkb3cgPSBvcHRzLnNoYWRvdyA/PyBiYXNlLnNoYWRvdztcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyB7XG5cbiAgICAgICAgc3RhdGljIG92ZXJyaWRlIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuICAgICAgICAvL1RPRE86IGZpeCB0eXBlcy4uLlxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59XG5cbi8qXG5mdW5jdGlvbiBleHRlbmRzTElTUzxFeHRlbmRzIGV4dGVuZHMgQ2xhc3MsXG5cdEhvc3QgICAgZXh0ZW5kcyBIVE1MRWxlbWVudCxcblx0QXR0cnMxICAgZXh0ZW5kcyBzdHJpbmcsXG5cdEF0dHJzMiAgIGV4dGVuZHMgc3RyaW5nLFxuXHRQYXJhbXMgIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+LFxuXHRUIGV4dGVuZHMgTElTU1JldHVyblR5cGU8RXh0ZW5kcywgSG9zdCwgQXR0cnMxLCBQYXJhbXM+PihMaXNzOiBULFxuXHRcdHBhcmFtZXRlcnM6IHtcblx0XHRcdHNoYWRvdyAgICAgID86IFNoYWRvd0NmZyxcblx0XHRcdGF0dHJpYnV0ZXMgID86IHJlYWRvbmx5IEF0dHJzMltdLFxuXHRcdFx0ZGVwZW5kZW5jaWVzPzogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W11cblx0XHR9KSB7XG5cblx0Y29uc3QgYXR0cmlidXRlcyAgID0gWy4uLkxpc3MuUGFyYW1ldGVycy5hdHRyaWJ1dGVzICAsIC4uLnBhcmFtZXRlcnMuYXR0cmlidXRlcyAgPz9bXV07XG5cdGNvbnN0IGRlcGVuZGVuY2llcyA9IFsuLi5MaXNzLlBhcmFtZXRlcnMuZGVwZW5kZW5jaWVzLCAuLi5wYXJhbWV0ZXJzLmRlcGVuZGVuY2llcz8/W11dO1xuXG5cdGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIExpc3MuUGFyYW1ldGVycywge1xuXHRcdGF0dHJpYnV0ZXMsXG5cdFx0ZGVwZW5kZW5jaWVzXG5cdH0pO1xuXHRpZiggcGFyYW1ldGVycy5zaGFkb3cgIT09IHVuZGVmaW5lZClcblx0XHRwYXJhbXMuc2hhZG93ID0gcGFyYW1ldGVycy5zaGFkb3c7XG5cblx0Ly8gQHRzLWlnbm9yZSA6IGJlY2F1c2UgVFMgc3R1cGlkXG5cdGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIExpc3Mge1xuXHRcdGNvbnN0cnVjdG9yKC4uLnQ6IGFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlIDogYmVjYXVzZSBUUyBzdHVwaWRcblx0XHRcdHN1cGVyKC4uLnQpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBvdmVycmlkZSBnZXQgYXR0cnMoKSB7XG5cdFx0XHRyZXR1cm4gc3VwZXIuYXR0cnMgYXMgUmVjb3JkPEF0dHJzMnxBdHRyczEsIHN0cmluZ3xudWxsPjtcblx0XHR9XG5cblx0XHRzdGF0aWMgb3ZlcnJpZGUgUGFyYW1ldGVycyA9IHBhcmFtcztcblx0fVxuXG5cdHJldHVybiBFeHRlbmRlZExJU1M7XG59XG5MSVNTLmV4dGVuZHNMSVNTID0gZXh0ZW5kc0xJU1M7XG4qLyIsImltcG9ydCB7IFNoYWRvd0NmZyB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTfSBmcm9tIFwiLi4vTElTU0Jhc2VcIjtcblxuaW1wb3J0IHtkZWZpbmV9IGZyb20gXCIuLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIExJU1NfQXV0byBleHRlbmRzIExJU1Moe1xuXHRhdHRyczogW1wic3JjXCIsIFwic3dcIl0sXG5cdHNoYWRvdzogU2hhZG93Q2ZnLk5PTkUsXG5cdGNzczogYDpob3N0IHsgZGlzcGxheTogbm9uZTsgfWBcbn0pIHtcblxuXHRyZWFkb25seSAja25vd25fdGFnID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cdHJlYWRvbmx5ICNkaXJlY3Rvcnk6IHN0cmluZztcblx0cmVhZG9ubHkgI3N3OiBQcm9taXNlPHZvaWQ+O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuI3N3ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cdFx0XHRcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHRoaXMuYXR0cnMuc3cgPz8gXCIvc3cuanNcIiwge3Njb3BlOiBcIi9cIn0pO1xuXG5cdFx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cblx0XHRjb25zdCBzcmMgPSB0aGlzLmF0dHJzLnNyYztcblx0XHRpZihzcmMgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzcmMgYXR0cmlidXRlIGlzIG1pc3NpbmcuXCIpO1xuXHRcdHRoaXMuI2RpcmVjdG9yeSA9IHNyY1swXSA9PT0gJy4nXG5cdFx0XHRcdFx0XHRcdFx0PyBgJHt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9JHtzcmN9YFxuXHRcdFx0XHRcdFx0XHRcdDogc3JjO1xuXG5cdFx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXG5cdFx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEVsZW1lbnQpXG5cdFx0XHRcdFx0XHR0aGlzLiNhZGRUYWcoYWRkaXRpb24udGFnTmFtZSlcblxuXHRcdH0pLm9ic2VydmUoIGRvY3VtZW50LCB7IGNoaWxkTGlzdDp0cnVlLCBzdWJ0cmVlOnRydWUgfSk7XG5cblxuXHRcdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipcIikgKVxuXHRcdFx0dGhpcy4jYWRkVGFnKGVsZW0udGFnTmFtZSk7XG5cdH1cblxuXG4gICAgcHJvdGVjdGVkIHJlc291cmNlcygpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0XCJpbmRleC5qc1wiLFxuXHRcdFx0XCJpbmRleC5odG1sXCIsXG5cdFx0XHRcImluZGV4LmNzc1wiXG5cdFx0XTtcbiAgICB9XG5cblx0cHJvdGVjdGVkIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nfT4pIHtcblxuXHRcdGNvbnN0IGpzID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXG5cdFx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdFx0aWYoIGpzICE9PSB1bmRlZmluZWQgKVxuXHRcdFx0a2xhc3MgPSBqcyhvcHRzKTtcblx0XHRlbHNlIGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdChvcHRzIGFzIGFueSkuY29udGVudF9mYWN0b3J5ID0gKHN0cjogc3RyaW5nKSA9PiB7XG5cblx0XHRcdFx0Y29uc3QgY29udGVudCA9IGh0bWxgJHtzdHJ9YDtcblxuXHRcdFx0XHRsZXQgc3BhbnMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cblx0XHRcdFx0cmV0dXJuIChfYTogdW5rbm93biwgX2I6dW5rbm93biwgZWxlbTogSFRNTEVsZW1lbnQpID0+IHtcblxuXHRcdFx0XHRcdC8vIGNhbiBiZSBvcHRpbWl6ZWQuLi5cblx0XHRcdFx0XHRmb3IobGV0IHNwYW4gb2Ygc3BhbnMpXG5cdFx0XHRcdFx0XHRzcGFuLnRleHRDb250ZW50ID0gZWxlbS5nZXRBdHRyaWJ1dGUoc3Bhbi5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXG5cdFx0XHRcdFx0cmV0dXJuIGNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHR9O1xuXG5cdFx0XHRrbGFzcyA9IGNsYXNzIFdlYkNvbXBvbmVudCBleHRlbmRzIExJU1Mob3B0cykge307XG5cdFx0fVxuXG5cdFx0aWYoa2xhc3MgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuXG5cdFx0cmV0dXJuIGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cdH1cblxuXHRhc3luYyAjYWRkVGFnKHRhZ25hbWU6IHN0cmluZykge1xuXG5cdFx0dGFnbmFtZSA9IHRhZ25hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmKCB0YWduYW1lID09PSAnbGlzcy1hdXRvJyB8fCB0YWduYW1lID09PSAnYmxpc3MtYXV0bycgfHwgISB0YWduYW1lLmluY2x1ZGVzKCctJykgfHwgdGhpcy4ja25vd25fdGFnLmhhcyggdGFnbmFtZSApIClcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuI2tub3duX3RhZy5hZGQodGFnbmFtZSk7XG5cblx0XHRhd2FpdCB0aGlzLiNzdzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IGZpbGVuYW1lcyA9IHRoaXMucmVzb3VyY2VzKCk7XG5cdFx0Y29uc3QgcmVzb3VyY2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoIGZpbGVuYW1lcy5tYXAoIGZpbGUgPT4gZmlsZS5lbmRzV2l0aCgnLmpzJylcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PyBfaW1wb3J0ICAgKGAke3RoaXMuI2RpcmVjdG9yeX0vJHt0YWduYW1lfS8ke2ZpbGV9YCwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0OiBfZmV0Y2hUZXh0KGAke3RoaXMuI2RpcmVjdG9yeX0vJHt0YWduYW1lfS8ke2ZpbGV9YCwgdHJ1ZSkgKSApO1xuXG5cdFx0Y29uc3QgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZmlsZW5hbWVzLmxlbmd0aDsgKytpKVxuXHRcdFx0aWYoIHJlc291cmNlc1tpXSAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRmaWxlc1tmaWxlbmFtZXNbaV1dID0gcmVzb3VyY2VzW2ldO1xuXG5cdFx0Y29uc3QgY29udGVudCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0XHRjb25zdCBjc3MgICAgID0gZmlsZXNbXCJpbmRleC5jc3NcIl07XG5cblx0XHRjb25zdCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nfT4gPSB7XG5cdFx0XHQuLi5jb250ZW50ICE9PSB1bmRlZmluZWQgJiYge2NvbnRlbnR9LFxuXHRcdFx0Li4uY3NzICAgICAhPT0gdW5kZWZpbmVkICYmIHtjc3N9LFxuXHRcdH07XG5cblx0XHRyZXR1cm4gdGhpcy5kZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIG9wdHMpO1xuXHRcdFxuXHR9XG59XG5cbi8vIHByZXZlbnRzIG11bHRpLWRlY2xhcmF0aW9ucy4uLlxuaWYoIGN1c3RvbUVsZW1lbnRzLmdldChcImxpc3MtYXV0b1wiKSA9PT0gdW5kZWZpbmVkKVxuXHRkZWZpbmUoXCJsaXNzLWF1dG9cIiwgTElTU19BdXRvKTtcblxuLy9UT0RPOiBmaXguLi5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50cyB7XG5cdFwibGlzcy1hdXRvXCI6IExJU1NfQXV0b1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBpbnRlcm5hbCB0b29scyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn0iLCJpbXBvcnQgdHlwZSB7IExJU1NCYXNlIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcIi4uL3N0YXRlXCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcInV0aWxzXCI7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oZWxlbSk7XG59XG5cbi8qXG50eXBlIEJVSUxEX09QVElPTlM8VCBleHRlbmRzIExJU1NCYXNlPiA9IFBhcnRpYWw8e1xuICAgIHBhcmFtcyAgICA6IFBhcnRpYWw8VFtcInBhcmFtc1wiXT4sXG4gICAgY29udGVudFx0ICA6IHN0cmluZ3xOb2RlfHJlYWRvbmx5IE5vZGVbXSxcbiAgICBpZCBcdFx0ICAgIDogc3RyaW5nLFxuICAgIGNsYXNzZXNcdCAgOiByZWFkb25seSBzdHJpbmdbXSxcbiAgICBjc3N2YXJzICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PixcbiAgICBhdHRycyBcdCAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGRhdGEgXHQgICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGxpc3RlbmVycyA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIChldjogRXZlbnQpID0+IHZvaWQ+PlxufT4gJiAoe1xuICBpbml0aWFsaXplOiBmYWxzZSxcbiAgcGFyZW50OiBFbGVtZW50XG59fHtcbiAgaW5pdGlhbGl6ZT86IHRydWUsXG4gIHBhcmVudD86IEVsZW1lbnRcbn0pO1xuXG4vL2FzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IFByb21pc2U8Q29tcG9uZW50c1tUXT47XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZT4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U+KHRhZ25hbWU6IHN0cmluZywge1xuICAgICAgICAgICAgICBwYXJhbXMgICAgPSB7fSxcbiAgICAgICAgICAgICAgaW5pdGlhbGl6ZT0gdHJ1ZSxcbiAgICAgICAgICAgICAgY29udGVudCAgID0gW10sXG4gICAgICAgICAgICAgIHBhcmVudCAgICA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgaWQgXHRcdCAgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGNsYXNzZXMgICA9IFtdLFxuICAgICAgICAgICAgICBjc3N2YXJzICAgPSB7fSxcbiAgICAgICAgICAgICAgYXR0cnMgICAgID0ge30sXG4gICAgICAgICAgICAgIGRhdGEgXHQgID0ge30sXG4gICAgICAgICAgICAgIGxpc3RlbmVycyA9IHt9XG4gICAgICAgICAgICAgIH06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFByb21pc2U8VD4ge1xuXG4gIGlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxuICBsZXQgQ3VzdG9tQ2xhc3MgPSBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcbiAgbGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuICAvLyBGaXggaXNzdWUgIzJcbiAgaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbiAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuICBpZiggaWQgIT09IHVuZGVmaW5lZCApXG4gIGVsZW0uaWQgPSBpZDtcblxuICBpZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuICBlbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG4gIGVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG4gIGxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuICBpZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbiAgZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICBlbHNlXG4gIGVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxuXG4gIGZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbiAgbGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbiAgaWYoIHZhbHVlID09PSBmYWxzZSlcbiAgZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbiAgZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbiAgZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbiAgZWxzZVxuICBlbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuICBjb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbiAgZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbiAgaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbiAgcGFyZW50LmFwcGVuZChlbGVtKTtcblxuICBpZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbiAgcmV0dXJuIGF3YWl0IExJU1MuaW5pdGlhbGl6ZShlbGVtKTtcblxuICByZXR1cm4gYXdhaXQgTElTUy5nZXRMSVNTKGVsZW0pO1xufVxuTElTUy5idWlsZCA9IGJ1aWxkO1xuXG5cbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBDb21wb25lbnRzW1RdO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogVDtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCB7XG5wYXJhbXMgICAgPSB7fSxcbmluaXRpYWxpemU9IHRydWUsXG5jb250ZW50ICAgPSBbXSxcbnBhcmVudCAgICA9IHVuZGVmaW5lZCxcbmlkIFx0XHQgID0gdW5kZWZpbmVkLFxuY2xhc3NlcyAgID0gW10sXG5jc3N2YXJzICAgPSB7fSxcbmF0dHJzICAgICA9IHt9LFxuZGF0YSBcdCAgPSB7fSxcbmxpc3RlbmVycyA9IHt9XG59OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBUIHtcblxuaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG50aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbmxldCBDdXN0b21DbGFzcyA9IGN1c3RvbUVsZW1lbnRzLmdldCh0YWduYW1lKTtcbmlmKEN1c3RvbUNsYXNzID09PSB1bmRlZmluZWQpXG50aHJvdyBuZXcgRXJyb3IoYCR7dGFnbmFtZX0gbm90IGRlZmluZWRgKTtcbmxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbi8vVE9ETzogZmFjdG9yaXplLi4uXG5cbi8vIEZpeCBpc3N1ZSAjMlxuaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbmVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbmlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbmVsZW0uaWQgPSBpZDtcblxuaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbmVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG5lbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbmxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG5lbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5lbHNlXG5lbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59XG5cbmZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbmxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG5pZiggdmFsdWUgPT09IGZhbHNlKVxuZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbmVsc2UgaWYodmFsdWUgPT09IHRydWUpXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuZWxzZVxuZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG59XG5cbmlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG5lbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG5pZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxucGFyZW50LmFwcGVuZChlbGVtKTtcblxuaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG5MSVNTLmluaXRpYWxpemVTeW5jKGVsZW0pO1xuXG5yZXR1cm4gTElTUy5nZXRMSVNTU3luYyhlbGVtKTtcbn1cbkxJU1MuYnVpbGRTeW5jID0gYnVpbGRTeW5jO1xuKi8iLCJcbmltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcInR5cGVzXCI7XG5cbnR5cGUgTGlzdGVuZXJGY3Q8VCBleHRlbmRzIEV2ZW50PiA9IChldjogVCkgPT4gdm9pZDtcbnR5cGUgTGlzdGVuZXJPYmo8VCBleHRlbmRzIEV2ZW50PiA9IHsgaGFuZGxlRXZlbnQ6IExpc3RlbmVyRmN0PFQ+IH07XG50eXBlIExpc3RlbmVyPFQgZXh0ZW5kcyBFdmVudD4gPSBMaXN0ZW5lckZjdDxUPnxMaXN0ZW5lck9iajxUPjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50VGFyZ2V0MjxFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBFdmVudD4+IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuXG5cdG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBjYWxsYmFjazogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgb3B0aW9ucz86IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhbik6IHZvaWQge1xuXHRcdFxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblx0fVxuXG5cdG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQ8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4oZXZlbnQ6IEV2ZW50c1tUXSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBzdXBlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fVxuXG5cdG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGlzdGVuZXI6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQge1xuXG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0c3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbUV2ZW50MjxUIGV4dGVuZHMgc3RyaW5nLCBBcmdzPiBleHRlbmRzIEN1c3RvbUV2ZW50PEFyZ3M+IHtcblxuXHRjb25zdHJ1Y3Rvcih0eXBlOiBULCBhcmdzOiBBcmdzKSB7XG5cdFx0c3VwZXIodHlwZSwge2RldGFpbDogYXJnc30pO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2V0IHR5cGUoKTogVCB7IHJldHVybiBzdXBlci50eXBlIGFzIFQ7IH1cbn1cblxudHlwZSBJbnN0YW5jZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4+ID0ge1xuXHRbSyBpbiBrZXlvZiBUXTogSW5zdGFuY2VUeXBlPFRbS10+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXaXRoRXZlbnRzPFQgZXh0ZW5kcyBvYmplY3QsIEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4gPihldjogQ29uc3RydWN0b3I8VD4sIF9ldmVudHM6IEV2ZW50cykge1xuXG5cdHR5cGUgRXZ0cyA9IEluc3RhbmNlczxFdmVudHM+O1xuXG5cdGlmKCAhIChldiBpbnN0YW5jZW9mIEV2ZW50VGFyZ2V0KSApXG5cdFx0cmV0dXJuIGV2IGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+PjtcblxuXHQvLyBpcyBhbHNvIGEgbWl4aW5cblx0Ly8gQHRzLWlnbm9yZVxuXHRjbGFzcyBFdmVudFRhcmdldE1peGlucyBleHRlbmRzIGV2IHtcblxuXHRcdCNldiA9IG5ldyBFdmVudFRhcmdldDI8RXZ0cz4oKTtcblxuXHRcdGFkZEV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmFkZEV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdGRpc3BhdGNoRXZlbnQoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmRpc3BhdGNoRXZlbnQoLi4uYXJncyk7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gRXZlbnRUYXJnZXRNaXhpbnMgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgU2hhZG93Um9vdCB0b29scyA9PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRNYXRjaGVzKGV2OiBFdmVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXG5cdGxldCBlbGVtZW50cyA9IGV2LmNvbXBvc2VkUGF0aCgpLnNsaWNlKDAsLTIpLmZpbHRlcihlID0+ICEgKGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSApLnJldmVyc2UoKSBhcyBIVE1MRWxlbWVudFtdO1xuXG5cdGZvcihsZXQgZWxlbSBvZiBlbGVtZW50cyApXG5cdFx0aWYoZWxlbS5tYXRjaGVzKHNlbGVjdG9yKSApXG5cdFx0XHRyZXR1cm4gZWxlbTsgXG5cblx0cmV0dXJuIG51bGw7XG59IiwiXG5pbXBvcnQgdHlwZSB7IExJU1NCYXNlLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN5bmMsIHdoZW5Jbml0aWFsaXplZCB9IGZyb20gXCIuLi9zdGF0ZVwiO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50cyB7fTtcblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICAvLyBhc3luY1xuICAgICAgICBxcyA6IHR5cGVvZiBxcztcbiAgICAgICAgcXNvOiB0eXBlb2YgcXNvO1xuICAgICAgICBxc2E6IHR5cGVvZiBxc2E7XG4gICAgICAgIHFzYzogdHlwZW9mIHFzYztcblxuICAgICAgICAvLyBzeW5jXG4gICAgICAgIHFzU3luYyA6IHR5cGVvZiBxc1N5bmM7XG4gICAgICAgIHFzYVN5bmM6IHR5cGVvZiBxc2FTeW5jO1xuICAgICAgICBxc2NTeW5jOiB0eXBlb2YgcXNjU3luYztcblxuXHRcdGNsb3Nlc3Q6IHR5cGVvZiBjbG9zZXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzc19zZWxlY3RvcihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtsaXNzX3NlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRsZXQgcmVzdWx0ID0gYXdhaXQgcXNvPFQ+KHNlbGVjdG9yLCBwYXJlbnQpO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiByZXN1bHQhXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc288TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUW10+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dW10gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8VD4+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHByb21pc2VzW2lkeCsrXSA9IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFRbXTtcbmZ1bmN0aW9uIHFzYVN5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl1bXTtcbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cmVzdWx0W2lkeCsrXSA9IGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4ocmVzdWx0KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNsb3Nlc3Q8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcblxuXHR3aGlsZSh0cnVlKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGVsZW1lbnQuY2xvc2VzdDxFPihzZWxlY3Rvcik7XG5cblx0XHRpZiggcmVzdWx0ICE9PSBudWxsKVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblxuXHRcdGNvbnN0IHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG5cdFx0aWYoICEgKFwiaG9zdFwiIGluIHJvb3QpIClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0ZWxlbWVudCA9IChyb290IGFzIFNoYWRvd1Jvb3QpLmhvc3Q7XG5cdH1cbn1cblxuXG4vLyBhc3luY1xuTElTUy5xcyAgPSBxcztcbkxJU1MucXNvID0gcXNvO1xuTElTUy5xc2EgPSBxc2E7XG5MSVNTLnFzYyA9IHFzYztcblxuLy8gc3luY1xuTElTUy5xc1N5bmMgID0gcXNTeW5jO1xuTElTUy5xc2FTeW5jID0gcXNhU3luYztcbkxJU1MucXNjU3luYyA9IHFzY1N5bmM7XG5cbkxJU1MuY2xvc2VzdCA9IGNsb3Nlc3Q7IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgXCIuL2NvcmUvc3RhdGVcIjtcbmltcG9ydCBcIi4vY29yZS9jdXN0b21SZWdpc3RlcnlcIjtcblxuLy9UT0RPOiBCTElTU1xuXG4vL1RPRE86IGV2ZW50cy50c1xuLy9UT0RPOiBnbG9iYWxDU1NSdWxlc1xuaW1wb3J0IFwiLi9oZWxwZXJzL0xJU1NBdXRvXCI7XG4vL1RPRE86IExJU1NQYXJhbXNcbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuXG5leHBvcnQge2V2ZW50TWF0Y2hlcywgV2l0aEV2ZW50cywgRXZlbnRUYXJnZXQyLCBDdXN0b21FdmVudDJ9IGZyb20gJy4vaGVscGVycy9ldmVudHMnO1xuZXhwb3J0IHtsaXNzLCBsaXNzU3luY30gZnJvbSBcIi4vaGVscGVycy9idWlsZFwiO1xuZXhwb3J0IHtodG1sfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUzsiLCJpbXBvcnQgdHlwZSB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBnZXRIb3N0Q3N0ciwgZ2V0TmFtZSB9IGZyb20gXCIuL2N1c3RvbVJlZ2lzdGVyeVwiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmVudW0gU3RhdGUge1xuICAgIE5PTkUgPSAwLFxuXG4gICAgLy8gY2xhc3NcbiAgICBERUZJTkVEID0gMSA8PCAwLFxuICAgIFJFQURZICAgPSAxIDw8IDEsXG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIFVQR1JBREVEICAgID0gMSA8PCAyLFxuICAgIElOSVRJQUxJWkVEID0gMSA8PCAzLFxufVxuXG5leHBvcnQgY29uc3QgREVGSU5FRCAgICAgPSBTdGF0ZS5ERUZJTkVEO1xuZXhwb3J0IGNvbnN0IFJFQURZICAgICAgID0gU3RhdGUuUkVBRFk7XG5leHBvcnQgY29uc3QgVVBHUkFERUQgICAgPSBTdGF0ZS5VUEdSQURFRDtcbmV4cG9ydCBjb25zdCBJTklUSUFMSVpFRCA9IFN0YXRlLklOSVRJQUxJWkVEO1xuXG5leHBvcnQgY2xhc3MgTElTU1N0YXRlIHtcblxuICAgICNlbGVtOiBIVE1MRWxlbWVudHxudWxsO1xuXG4gICAgLy8gaWYgbnVsbCA6IGNsYXNzIHN0YXRlLCBlbHNlIGluc3RhbmNlIHN0YXRlXG4gICAgY29uc3RydWN0b3IoZWxlbTogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGwpIHtcbiAgICAgICAgdGhpcy4jZWxlbSA9IGVsZW07XG4gICAgfVxuXG4gICAgc3RhdGljIERFRklORUQgICAgID0gREVGSU5FRDtcbiAgICBzdGF0aWMgUkVBRFkgICAgICAgPSBSRUFEWTtcbiAgICBzdGF0aWMgVVBHUkFERUQgICAgPSBVUEdSQURFRDtcbiAgICBzdGF0aWMgSU5JVElBTElaRUQgPSBJTklUSUFMSVpFRDtcblxuICAgIGlzKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEICAgICAmJiAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgICAgICAgJiYgISB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCAgICAmJiAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEICYmICEgdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlbihzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgbGV0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8YW55Pj4oKTtcbiAgICBcbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5EZWZpbmVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuUmVhZHkoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5VcGdyYWRlZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkluaXRpYWxpemVkKCkgKTtcbiAgICBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBERUZJTkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzRGVmaW5lZCgpIHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKCBnZXROYW1lKHRoaXMuI2VsZW0pICkgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gUkVBRFkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcbiAgICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBob3N0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7XG4gICAgXG4gICAgICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgaG9zdClcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgXG4gICAgICAgIC8vIGg0Y2tcbiAgICBcbiAgICAgICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgICAgIFxuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWQgICAgICAgID0gcHJvbWlzZTtcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgXG4gICAgICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gSU5JVElBTElaRUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNJbml0aWFsaXplZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiBcImlzSW5pdGlhbGl6ZWRcIiBpbiBlbGVtICYmIGVsZW0uaXNJbml0aWFsaXplZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oKSB7XG4gICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlblVwZ3JhZGVkKCk7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQ7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtIGFzIExJU1NIb3N0PFQ+KS5iYXNlIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IENPTlZFUlNJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFsdWVPZigpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgbGV0IHN0YXRlOiBTdGF0ZSA9IDA7XG4gICAgXG4gICAgICAgIGlmKCB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBERUZJTkVEO1xuICAgICAgICBpZiggdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHN0YXRlIHw9IFJFQURZO1xuICAgICAgICBpZiggdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IFVQR1JBREVEO1xuICAgICAgICBpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IElOSVRJQUxJWkVEO1xuICAgIFxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IGlzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJERUZJTkVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBpcy5wdXNoKFwiUkVBRFlcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJVUEdSQURFRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIklOSVRJQUxJWkVEXCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gaXMuam9pbignfCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYoIFwic3RhdGVcIiBpbiBlbGVtKVxuICAgICAgICByZXR1cm4gZWxlbS5zdGF0ZSBhcyBMSVNTU3RhdGU7XG4gICAgXG4gICAgcmV0dXJuIChlbGVtIGFzIGFueSkuc3RhdGUgPSBuZXcgTElTU1N0YXRlKGVsZW0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gU3RhdGUgbW9kaWZpZXJzIChtb3ZlPykgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdvIHRvIHN0YXRlIFVQR1JBREVEXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBncmFkZTxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlbkRlZmluZWQoKTtcblxuICAgIHJldHVybiB1cGdyYWRlU3luYzxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZ3JhZGVTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBUIHtcbiAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG4gICAgXG4gICAgaWYoICEgc3RhdGUuaXNEZWZpbmVkIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IG5vdCBkZWZpbmVkIScpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0cihnZXROYW1lKGVsZW0pKTtcblxuICAgIGlmKCAhIChlbGVtIGluc3RhbmNlb2YgSG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgZGlkbid0IHVwZ3JhZGUhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBUO1xufVxuXG4vLyBHbyB0byBzdGF0ZSBJTklUSUFMSVpFRFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZTxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufFRbXCJwYXJhbXNcIl0gPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UgKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuUmVhZHkoKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IHt9IDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZShwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogVCB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSlcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIHN0YXRlLmlzUmVhZHkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09IGV4dGVybmFsIFdIRU4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVwZ3JhZGUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuVXBncmFkZWQ8VD4oKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5Jbml0aWFsaXplZDxUPigpO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB0eXBlIHsgTElTUyB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3Mge31cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7IG5ldyguLi5hcmdzOmFueVtdKTogVH07XG5cbmV4cG9ydCB0eXBlIENTU19SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MU3R5bGVFbGVtZW50fENTU1N0eWxlU2hlZXQ7XG5leHBvcnQgdHlwZSBDU1NfU291cmNlICAgPSBDU1NfUmVzb3VyY2UgfCBQcm9taXNlPENTU19SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIEhUTUxfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFRlbXBsYXRlRWxlbWVudHxOb2RlO1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnLFxuICAgIFNFTUlPUEVOPSAnc2VtaS1vcGVuJ1xufTtcblxuLy9UT0RPOiBpbXBsZW1lbnQgP1xuZXhwb3J0IGVudW0gTGlmZUN5Y2xlIHtcbiAgICBERUZBVUxUICAgICAgICAgICAgICAgICAgID0gMCxcblx0Ly8gbm90IGltcGxlbWVudGVkIHlldFxuICAgIElOSVRfQUZURVJfQ0hJTERSRU4gICAgICAgPSAxIDw8IDEsXG4gICAgSU5JVF9BRlRFUl9QQVJFTlQgICAgICAgICA9IDEgPDwgMixcbiAgICAvLyBxdWlkIHBhcmFtcy9hdHRycyA/XG4gICAgUkVDUkVBVEVfQUZURVJfQ09OTkVDVElPTiA9IDEgPDwgMywgLyogcmVxdWlyZXMgcmVidWlsZCBjb250ZW50ICsgZGVzdHJveS9kaXNwb3NlIHdoZW4gcmVtb3ZlZCBmcm9tIERPTSAqL1xuICAgIC8qIHNsZWVwIHdoZW4gZGlzY28gOiB5b3UgbmVlZCB0byBpbXBsZW1lbnQgaXQgeW91cnNlbGYgKi9cbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEZhY3Rvcnk8QXR0cnMgZXh0ZW5kcyBzdHJpbmcsIFBhcmFtcyBleHRlbmRzIFJlY29yZDxzdHJpbmcsYW55Pj4gPSAoIChhdHRyczogUmVjb3JkPEF0dHJzLCBudWxsfHN0cmluZz4sIHBhcmFtczogUGFyYW1zLCBlbGVtOkhUTUxFbGVtZW50KSA9PiBOb2RlfHVuZGVmaW5lZCApO1xuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZyxcbiAgICA+ID0ge1xuICAgICAgICAvLyBKUyBCYXNlXG4gICAgICAgIGV4dGVuZHMgICA6IEV4dGVuZHNDdHIsXG4gICAgICAgIHBhcmFtcyAgICA6IFBhcmFtcyxcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgZGVwcyAgICAgIDogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W10sXG5cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLFxuICAgICAgICBhdHRycyAgOiByZWFkb25seSBBdHRyc1tdLFxuICAgICAgICBvYnNlcnZlZEF0dHJpYnV0ZXM6IHJlYWRvbmx5IEF0dHJzW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBjb250ZW50PzogSFRNTF9Tb3VyY2UsXG4gICAgICAgIGNvbnRlbnRfZmFjdG9yeTogKGNvbnRlbnQ/OiBFeGNsdWRlPEhUTUxfUmVzb3VyY2UsIFJlc3BvbnNlPikgPT4gQ29udGVudEZhY3Rvcnk8QXR0cnMsIFBhcmFtcz4sXG4gICAgICAgIGNzcyAgICAgOiBDU1NfU291cmNlIHwgcmVhZG9ubHkgQ1NTX1NvdXJjZVtdLFxuICAgICAgICBzaGFkb3cgIDogU2hhZG93Q2ZnXG59XG5cbi8vIExJU1NCYXNlXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IEluc3RhbmNlVHlwZTxMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VCBleHRlbmRzIExJU1NCYXNlPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZTxcbiAgICAgICAgICAgIGluZmVyIEEgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBCLFxuICAgICAgICAgICAgaW5mZXIgQyxcbiAgICAgICAgICAgIGluZmVyIEQ+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQmFzZUNzdHI8QSxCLEMsRD4gOiBuZXZlcjtcblxuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQmFzZSA/IExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+OyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBIVE1MQ0xBU1NfUkVHRVggPSAgL0hUTUwoXFx3KylFbGVtZW50LztcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblx0XG5cdGxldCBodG1sdGFnID0gSFRNTENMQVNTX1JFR0VYLmV4ZWMoQ2xhc3MubmFtZSkhWzFdO1xuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgY29uc3Qgd2hlbkRPTUNvbnRlbnRMb2FkZWQgPSB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdERPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyXG5cblxuLy8gbW92ZWQgaGVyZSBpbnN0ZWFkIG9mIGJ1aWxkIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwcy5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsImltcG9ydCAnLi4vLi4vLi4vJzsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwicGFnZXMvZXhhbXBsZXMvbGlzcy1hdXRvL2luZGV4Lmh0bWxcIjsiXSwibmFtZXMiOlsiU2hhZG93Q2ZnIiwiYnVpbGRMSVNTSG9zdCIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc1NoYWRvd1N1cHBvcnRlZCIsImh0bWwiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkRFRkFVTFRfQ09OVEVOVF9GQUNUT1JZIiwiY29udGVudCIsInRyaW0iLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiY2xvbmVOb2RlIiwiTElTUyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsInBhcmFtcyIsImRlcHMiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnRfZmFjdG9yeSIsIl9jb250ZW50X2ZhY3RvcnkiLCJjc3MiLCJzaGFkb3ciLCJTRU1JT1BFTiIsIk5PTkUiLCJPUEVOIiwiRXJyb3IiLCJhbGxfZGVwcyIsIlByb21pc2UiLCJSZXNwb25zZSIsIl9jb250ZW50IiwicHVzaCIsInRleHQiLCJMSVNTQmFzZSIsIkxJU1NDZmciLCJzdHlsZXNoZWV0cyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImMiLCJpZHgiLCJwcm9jZXNzX2NzcyIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkhvc3QiLCJzdGF0ZSIsInNldEF0dHJEZWZhdWx0IiwiYXR0ciIsInZhbHVlIiwib25BdHRyQ2hhbmdlZCIsIl9uYW1lIiwiX29sZFZhbHVlIiwiX25ld1ZhbHVlIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwidXBkYXRlUGFyYW1zIiwiYXNzaWduIiwiaXNJbkRPTSIsImlzQ29ubmVjdGVkIiwib25ET01Db25uZWN0ZWQiLCJjb25uZWN0ZWRDYWxsYmFjayIsIm9uRE9NRGlzY29ubmVjdGVkIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJfSG9zdCIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiTElTU1N0YXRlIiwiaXNET01Db250ZW50TG9hZGVkIiwid2FpdERPTUNvbnRlbnRMb2FkZWQiLCJpZCIsInNoYXJlZENTUyIsIkxpc3MiLCJHRVQiLCJTeW1ib2wiLCJTRVQiLCJwcm9wZXJ0aWVzIiwiZnJvbUVudHJpZXMiLCJuIiwiZW51bWVyYWJsZSIsImdldCIsInNldCIsIkF0dHJpYnV0ZXMiLCJuYW1lIiwiZGF0YSIsImRlZmF1bHRzIiwic2V0dGVyIiwiZGVmaW5lUHJvcGVydGllcyIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsIndhaXRSZWFkeSIsInIiLCJhbGwiLCJpc1JlYWR5Iiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiTElTU0hvc3RCYXNlIiwiQmFzZSIsImJhc2UiLCJpc0luaXRpYWxpemVkIiwid2hlbkluaXRpYWxpemVkIiwiaW5pdGlhbGl6ZSIsImluaXQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJnZXRQYXJ0IiwiaGFzU2hhZG93IiwicXVlcnlTZWxlY3RvciIsImdldFBhcnRzIiwicXVlcnlTZWxlY3RvckFsbCIsIkNTU1NlbGVjdG9yIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInByb21pc2UiLCJyZXNvbHZlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwic2hhZG93Um9vdCIsImNvbnNvbGUiLCJ3YXJuIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwibW9kZSIsImF0dGFjaFNoYWRvdyIsIm9icyIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsImNzc3NlbGVjdG9yIiwiaGFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJpbm5lckhUTUwiLCJyZXBsYWNlIiwiaGVhZCIsImFwcGVuZCIsImFkZCIsIm9iaiIsImNoaWxkTm9kZXMiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiZGVmaW5lIiwiZ2V0QmFzZUNzdHIiLCJnZXRIb3N0Q3N0ciIsImdldE5hbWUiLCJpc0RlZmluZWQiLCJ3aGVuQWxsRGVmaW5lZCIsIndoZW5EZWZpbmVkIiwiZ2V0U3RhdGUiLCJpbml0aWFsaXplU3luYyIsInVwZ3JhZGVTeW5jIiwid2hlblVwZ3JhZGVkIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsIkNsYXNzIiwiaHRtbHRhZyIsIkxJU1NjbGFzcyIsIm9wdHMiLCJ0YWduYW1lcyIsInQiLCJlbGVtZW50IiwiRWxlbWVudCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJfTElTUyIsIklMSVNTIiwiRXh0ZW5kZWRMSVNTIiwiTElTU19BdXRvIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwic3ciLCJzY29wZSIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwic3JjIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtdXRhdGlvbiIsImFkZGl0aW9uIiwiYWRkZWROb2RlcyIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiZWxlbSIsInJlc291cmNlcyIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwianMiLCJrbGFzcyIsInN0ciIsInNwYW5zIiwiX2EiLCJfYiIsInNwYW4iLCJ0ZXh0Q29udGVudCIsIldlYkNvbXBvbmVudCIsImZpbGVuYW1lcyIsImZpbGUiLCJlbmRzV2l0aCIsIl9pbXBvcnQiLCJfZmV0Y2hUZXh0IiwiaSIsInVyaSIsImlzTGlzc0F1dG8iLCJvcHRpb25zIiwiaGVhZGVycyIsInJlc3BvbnNlIiwiZmV0Y2giLCJzdGF0dXMiLCJkZWZhdWx0IiwiZSIsImxvZyIsImxpc3MiLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJFdmVudFRhcmdldDIiLCJFdmVudFRhcmdldCIsInR5cGUiLCJjYWxsYmFjayIsImRpc3BhdGNoRXZlbnQiLCJldmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIkN1c3RvbUV2ZW50MiIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiV2l0aEV2ZW50cyIsImV2IiwiX2V2ZW50cyIsIkV2ZW50VGFyZ2V0TWl4aW5zIiwiZXZlbnRNYXRjaGVzIiwic2VsZWN0b3IiLCJlbGVtZW50cyIsImNvbXBvc2VkUGF0aCIsInNsaWNlIiwiZmlsdGVyIiwiU2hhZG93Um9vdCIsInJldmVyc2UiLCJtYXRjaGVzIiwibGlzc19zZWxlY3RvciIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsInByb21pc2VzIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwid2hlbkRPTUNvbnRlbnRMb2FkZWQiLCJTdGF0ZSIsImlzIiwiaXNVcGdyYWRlZCIsIndoZW4iLCJ3aGVuUmVhZHkiLCJfd2hlblVwZ3JhZGVkIiwidmFsdWVPZiIsInRvU3RyaW5nIiwiam9pbiIsInN0cmljdCIsIm93bmVyRG9jdW1lbnQiLCJhZG9wdE5vZGUiLCJmb3JjZSIsIkxpZmVDeWNsZSIsIkhUTUxDTEFTU19SRUdFWCIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJleGVjIiwiQ0FOX0hBVkVfU0hBRE9XIiwidGFnIiwicmVhZHlTdGF0ZSIsInN0cmluZyIsInRlbXBsYXRlIiwiZmlyc3RDaGlsZCIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSJdLCJzb3VyY2VSb290IjoiIn0=