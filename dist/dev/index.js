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
    if (shadow !== _types__WEBPACK_IMPORTED_MODULE_0__.ShadowCfg.NONE && !(0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host)) throw new Error(`Host element ${(0,_utils__WEBPACK_IMPORTED_MODULE_2__._element2tagname)(host)} does not support ShadowRoot`);
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
/* harmony export */   LISSAuto: () => (/* binding */ LISSAuto)
/* harmony export */ });
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _customRegistery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../customRegistery */ "./src/customRegistery.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



// should be improved (but how ?)
const script = document.querySelector('script[autodir]');
if (script !== null) {
    const RESSOURCES = [
        "index.js",
        "index.bry",
        "index.html",
        "index.css"
    ];
    const KnownTags = new Set();
    const SW = new Promise(async (resolve)=>{
        await navigator.serviceWorker.register(script.getAttribute('sw') ?? "/sw.js", {
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
    let components_dir = script.getAttribute('autodir');
    if (components_dir[0] === '.') components_dir = window.location.pathname + components_dir; // getting an absolute path.
    if (components_dir[components_dir.length - 1] !== '/') components_dir += '/';
    // observe for new injected tags.
    new MutationObserver((mutations)=>{
        for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition instanceof HTMLElement) addTag(addition);
    }).observe(document, {
        childList: true,
        subtree: true
    });
    for (let elem of document.querySelectorAll("*"))addTag(elem);
    async function addTag(tag) {
        const tagname = (tag.getAttribute('is') ?? tag.tagName).toLowerCase();
        if (!tagname.includes('-') || KnownTags.has(tagname)) return;
        KnownTags.add(tagname);
        await SW; // ensure SW is installed.
        const filenames = RESSOURCES;
        const resources = await Promise.all(filenames.map((file)=>{
            const file_path = `${components_dir}${tagname}/${file}`;
            return file.endsWith('.js') ? _import(file_path, true) : _fetchText(file_path, true);
        }));
        const files = {};
        for(let i = 0; i < filenames.length; ++i)if (resources[i] !== undefined) files[filenames[i]] = resources[i];
        const content = files["index.html"];
        const css = files["index.css"];
        let host = undefined;
        if (tag.hasAttribute('is')) host = tag.constructor;
        const opts = {
            ...content !== undefined && {
                content
            },
            ...css !== undefined && {
                css
            },
            ...host !== undefined && {
                host
            }
        };
        return defineWebComponent(tagname, files, opts);
    }
    function defineWebComponent(tagname, files, opts) {
        const js = files["index.js"];
        const content = files["index.html"];
        let klass = null;
        if (js !== undefined) klass = js(opts);
        else if (content !== undefined) {
            klass = LISSAuto(opts.content, opts.css, opts.host);
        }
        if (klass === null) throw new Error(`Missing files for WebComponent ${tagname}.`);
        return (0,_customRegistery__WEBPACK_IMPORTED_MODULE_1__.define)(tagname, klass);
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
}
//TODO: improve ?
function LISSAuto(content, css, host) {
    const opts = {
        content,
        css,
        host
    };
    //TODO: {}
    //TODO: CSS_factory too ??? ou css-toto="toto" (?)
    opts.content_factory = (str)=>{
        str = str.replaceAll(/\$\{([\w]+)\}/g, (_, name)=>{
            return `<liss value="${name}"></liss>`;
        });
        //TODO: ${} in attr
        // - detect start ${ + end }
        // - register elem + attr name
        // - replace. 
        const content = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.html)`${str}`;
        let spans = content.querySelectorAll('liss[value]');
        return (_a, _b, elem)=>{
            // can be optimized...
            for (let span of spans)span.textContent = elem.getAttribute(span.getAttribute('value'));
            return content.cloneNode(true);
        };
    };
    const klass = class WebComponent extends (0,_LISSBase__WEBPACK_IMPORTED_MODULE_0__.LISS)(opts) {
        constructor(...args){
            super(...args);
            const css_attrs = this.host.getAttributeNames().filter((e)=>e.startsWith('css-'));
            for (let css_attr of css_attrs)this.host.style.setProperty(`--${css_attr.slice('css-'.length)}`, this.host.getAttribute(css_attr));
        }
    };
    return klass;
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
    console.warn('C', Class);
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
/* harmony export */   CustomEvent2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_7__.CustomEvent2),
/* harmony export */   EventTarget2: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_7__.EventTarget2),
/* harmony export */   LISSAuto: () => (/* reexport safe */ _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_3__.LISSAuto),
/* harmony export */   LISSParams: () => (/* reexport safe */ _helpers_LISSParams__WEBPACK_IMPORTED_MODULE_8__.LISSParams),
/* harmony export */   ShadowCfg: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_5__.ShadowCfg),
/* harmony export */   WithEvents: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_7__.WithEvents),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   eventMatches: () => (/* reexport safe */ _helpers_events__WEBPACK_IMPORTED_MODULE_7__.eventMatches),
/* harmony export */   html: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_9__.html),
/* harmony export */   liss: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_6__.liss),
/* harmony export */   lissSync: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_6__.lissSync)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extends */ "./src/extends.ts");
/* harmony import */ var _core_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/state */ "./src/core/state.ts");
/* harmony import */ var _core_customRegistery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/customRegistery */ "./src/core/customRegistery.ts");
/* harmony import */ var _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/LISSAuto */ "./src/helpers/LISSAuto.ts");
/* harmony import */ var _helpers_querySelectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/querySelectors */ "./src/helpers/querySelectors.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _helpers_build__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/build */ "./src/helpers/build.ts");
/* harmony import */ var _helpers_events__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers/events */ "./src/helpers/events.ts");
/* harmony import */ var _helpers_LISSParams__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./helpers/LISSParams */ "./src/helpers/LISSParams.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



//TODO: BLISS
//TODO: events.ts
//TODO: globalCSSRules







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_extends__WEBPACK_IMPORTED_MODULE_0__["default"]);

var __webpack_exports__CustomEvent2 = __webpack_exports__.CustomEvent2;
var __webpack_exports__EventTarget2 = __webpack_exports__.EventTarget2;
var __webpack_exports__LISSAuto = __webpack_exports__.LISSAuto;
var __webpack_exports__LISSParams = __webpack_exports__.LISSParams;
var __webpack_exports__ShadowCfg = __webpack_exports__.ShadowCfg;
var __webpack_exports__WithEvents = __webpack_exports__.WithEvents;
var __webpack_exports__default = __webpack_exports__["default"];
var __webpack_exports__eventMatches = __webpack_exports__.eventMatches;
var __webpack_exports__html = __webpack_exports__.html;
var __webpack_exports__liss = __webpack_exports__.liss;
var __webpack_exports__lissSync = __webpack_exports__.lissSync;
export { __webpack_exports__CustomEvent2 as CustomEvent2, __webpack_exports__EventTarget2 as EventTarget2, __webpack_exports__LISSAuto as LISSAuto, __webpack_exports__LISSParams as LISSParams, __webpack_exports__ShadowCfg as ShadowCfg, __webpack_exports__WithEvents as WithEvents, __webpack_exports__default as default, __webpack_exports__eventMatches as eventMatches, __webpack_exports__html as html, __webpack_exports__liss as liss, __webpack_exports__lissSync as lissSync };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1Y7QUFFQTtBQUVhO0FBQ3VDO0FBQ3RDO0FBQ25CO0FBQzdCLGlFQUFlTSxnREFBSUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0xJU1MvLi9zcmMvTElTU0Jhc2UudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTSG9zdC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2NvcmUvY3VzdG9tUmVnaXN0ZXJ5LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvY29yZS9zdGF0ZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2N1c3RvbVJlZ2lzdGVyeS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2V4dGVuZHMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL0xJU1NBdXRvLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9MSVNTUGFyYW1zLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9idWlsZC50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvZXZlbnRzLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9xdWVyeVNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENsYXNzLCBDb25zdHJ1Y3RvciwgQ29udGVudEZhY3RvcnksIENTU19Tb3VyY2UsIEhUTUxfUmVzb3VyY2UsIEhUTUxfU291cmNlLCBMSVNTX09wdHMgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBMSVNTU3RhdGUgfSBmcm9tIFwic3RhdGVcIjtcblxuaW1wb3J0IHtTaGFkb3dDZmd9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkLCBodG1sIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gREVGQVVMVF9DT05URU5UX0ZBQ1RPUlkoY29udGVudD86IEV4Y2x1ZGU8SFRNTF9SZXNvdXJjZSwgUmVzcG9uc2U+KSB7XG5cblx0aWYoIHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XG5cblx0XHRjb250ZW50ID0gY29udGVudC50cmltKCk7XG5cdFx0aWYoIGNvbnRlbnQubGVuZ3RoID09PSAwIClcblx0XHRcdGNvbnRlbnQgPSB1bmRlZmluZWQ7XG5cblx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0Y29udGVudCA9IGh0bWxgJHtjb250ZW50fWA7XG5cblx0XHQvLyBUT0RPIExJU1NBdXRvIHBhcnNlci4uLlxuXHRcdC8vIG9ubHkgaWYgbm8gSlMuLi5cblx0XHQvLyB0b2xlcmF0ZSBub24tb3B0aSAoZWFzaWVyID8pIG9yIHNwYW5bdmFsdWVdID9cblx0XHRcdC8vID0+IHJlY29yZCBlbGVtZW50IHdpdGggdGFyZ2V0Li4uXG5cdFx0XHQvLyA9PiBjbG9uZShhdHRycywgcGFyYW1zKSA9PiBmb3IgZWFjaCBzcGFuIHJlcGxhY2UgdGhlbiBjbG9uZS5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0Ly9sZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IHRoaXMuZ2V0QXR0cmlidXRlKG1hdGNoKT8/JycpXG5cdH1cblxuXHRpZiggY29udGVudCBpbnN0YW5jZW9mIEhUTUxUZW1wbGF0ZUVsZW1lbnQpXG5cdFx0Y29udGVudCA9IGNvbnRlbnQuY29udGVudDtcblxuXHRyZXR1cm4gKCkgPT4gY29udGVudD8uY2xvbmVOb2RlKHRydWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cblx0Ly8gSFRNTCBCYXNlXG5cdEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG5cdEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlciwgLy9zdHJpbmcsXG4+KHtcblxuICAgIC8vIEpTIEJhc2VcbiAgICBleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCBhcyB1bmtub3duIGFzIEV4dGVuZHNDdHIsIC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuICAgIHBhcmFtcyAgICAgICAgICAgID0ge30gICAgIGFzIHVua25vd24gYXMgUGFyYW1zLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgZGVwcyAgID0gW10sXG5cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBob3N0ICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdG9ic2VydmVkQXR0cmlidXRlcyA9IFtdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG4gICAgYXR0cnMgPSBvYnNlcnZlZEF0dHJpYnV0ZXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBjb250ZW50LFxuXHRjb250ZW50X2ZhY3Rvcnk6IF9jb250ZW50X2ZhY3RvcnkgPSBERUZBVUxUX0NPTlRFTlRfRkFDVE9SWSxcbiAgICBjc3MsXG4gICAgc2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgPyBTaGFkb3dDZmcuU0VNSU9QRU4gOiBTaGFkb3dDZmcuTk9ORVxufTogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PiA9IHt9KSB7XG5cbiAgICBpZiggc2hhZG93ICE9PSBTaGFkb3dDZmcuTk9ORSAmJiAhIGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgIGNvbnN0IGFsbF9kZXBzID0gWy4uLmRlcHNdO1xuXG5cdGxldCBjb250ZW50X2ZhY3Rvcnk6IENvbnRlbnRGYWN0b3J5PEF0dHJzLCBQYXJhbXM+O1xuXG4gICAgLy8gY29udGVudCBwcm9jZXNzaW5nXG4gICAgaWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGNvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIHtcbiAgICAgICAgXG5cdFx0bGV0IF9jb250ZW50OiBIVE1MX1NvdXJjZXx1bmRlZmluZWQgPSBjb250ZW50O1xuXHRcdGNvbnRlbnQgPSBudWxsIGFzIHVua25vd24gYXMgc3RyaW5nO1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQ7XG4gICAgICAgICAgICBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuXHRcdFx0XHRfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcblxuICAgICAgICAgICAgTElTU0Jhc2UuTElTU0NmZy5jb250ZW50X2ZhY3RvcnkgPSBfY29udGVudF9mYWN0b3J5KF9jb250ZW50KTtcbiAgICAgICAgfSkoKSApO1xuXG4gICAgfSBlbHNlIHtcblx0XHRjb250ZW50X2ZhY3RvcnkgPSBfY29udGVudF9mYWN0b3J5KGNvbnRlbnQpO1xuXHR9XG5cblx0Ly8gQ1NTIHByb2Nlc3Npbmdcblx0bGV0IHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gPSBbXTtcblx0aWYoIGNzcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0aWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiB0b2RvOiBMSVNTT3B0cyA9PiBzaG91bGQgbm90IGJlIGEgZ2VuZXJpYyA/XG5cdFx0XHRjc3MgPSBbY3NzXTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRzdHlsZXNoZWV0cyA9IGNzcy5tYXAoIChjOiBDU1NfU291cmNlLCBpZHg6IG51bWJlcikgPT4ge1xuXG5cdFx0XHRpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cblx0XHRcdFx0YWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRcdGMgPSBhd2FpdCBjO1xuXHRcdFx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuXHRcdFx0XHRcdFx0YyA9IGF3YWl0IGMudGV4dCgpO1xuXG5cdFx0XHRcdFx0c3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG5cdFx0XHRcdH0pKCkpO1xuXG5cdFx0XHRcdHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb2Nlc3NfY3NzKGMpO1xuXHRcdH0pO1xuXHR9XG5cblx0dHlwZSBMSVNTSG9zdDxUPiA9IGFueTsgLy9UT0RPLi4uXG5cdHR5cGUgTEhvc3QgPSBMSVNTSG9zdDxMSVNTQmFzZT47IC8vPC0gY29uZmlnIGluc3RlYWQgb2YgTElTU0Jhc2UgP1xuXG5cdGNsYXNzIExJU1NCYXNlIGV4dGVuZHMgX2V4dGVuZHMge1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApXG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCh7fSwgdGhpcyk7XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IGFueTsgLy8gcHJldmVudHMgaXNzdWUgIzEuLi5cblxuXHRcdC8vIExJU1MgQ29uZmlnc1xuXHRcdHN0YXRpYyByZWFkb25seSBMSVNTQ2ZnID0ge1xuXHRcdFx0aG9zdCxcblx0XHRcdGRlcHMsXG5cdFx0XHRhdHRycyxcblx0XHRcdHBhcmFtcyxcblx0XHRcdGNvbnRlbnRfZmFjdG9yeSxcblx0XHRcdHN0eWxlc2hlZXRzLFxuXHRcdFx0c2hhZG93LFxuXHRcdH07XG5cblx0XHRnZXQgc3RhdGUoKTogTElTU1N0YXRlIHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0LnN0YXRlO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblx0XHQvL1RPRE86IGdldCB0aGUgcmVhbCB0eXBlID9cblx0XHRwcm90ZWN0ZWQgZ2V0IGNvbnRlbnQoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0Ly8gYXR0cnNcblx0XHRwcm90ZWN0ZWQgZ2V0IGF0dHJzKCk6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBzZXRBdHRyRGVmYXVsdCggYXR0cjogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5zZXRBdHRyRGVmYXVsdChhdHRyLCB2YWx1ZSk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkF0dHJDaGFuZ2VkKF9uYW1lOiBBdHRycyxcblx0XHRcdF9vbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0X25ld1ZhbHVlOiBzdHJpbmcpOiB2b2lkfGZhbHNlIHt9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG5cdFx0cHJvdGVjdGVkIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBbQXR0cnMsIHN0cmluZywgc3RyaW5nXSkge1xuXHRcdFx0dGhpcy5vbkF0dHJDaGFuZ2VkKC4uLmFyZ3MpO1xuXHRcdH1cblxuXHRcdC8vIHBhcmFtZXRlcnNcblx0XHRwdWJsaWMgZ2V0IHBhcmFtcygpOiBSZWFkb25seTxQYXJhbXM+IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkucGFyYW1zO1xuXHRcdH1cblx0XHRwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxQYXJhbXM+KSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKCAodGhpcy4jaG9zdCBhcyBMSG9zdCkucGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cblx0XHQvLyBET01cblx0XHRwdWJsaWMgZ2V0IGlzSW5ET00oKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmlzQ29ubmVjdGVkO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01Db25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTURpc2Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXRcblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmlzSW5ET007XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzdGF0aWMgX0hvc3Q6IExJU1NIb3N0PExJU1NCYXNlPjtcblxuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMgYXMgYW55KTsgLy9UT0RPOiBmaXggdHlwZSBlcnJvciAod2h5Pz8/KVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzX2Nzcyhjc3M6IHN0cmluZ3xDU1NTdHlsZVNoZWV0fEhUTUxTdHlsZUVsZW1lbnQpIHtcblxuXHRpZihjc3MgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KVxuXHRcdHJldHVybiBjc3M7XG5cdGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuXHRcdHJldHVybiBjc3Muc2hlZXQhO1xuXG5cdGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cdGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuXHRcdHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7IC8vIHJlcGxhY2UoKSBpZiBpc3N1ZXNcblx0XHRyZXR1cm4gc3R5bGU7XG5cdH1cblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3Vyc1wiKTtcbn0iLCJpbXBvcnQgeyBTaGFkb3dDZmcsIHR5cGUgTElTU19PcHRzLCB0eXBlIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5pbXBvcnQgeyBDb21wb3NlQ29uc3RydWN0b3IsIGlzRE9NQ29udGVudExvYWRlZCwgd2FpdERPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgaWQgPSAwO1xuXG50eXBlIGluZmVyTElTUzxUPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8aW5mZXIgQSwgaW5mZXIgQiwgaW5mZXIgQywgaW5mZXIgRD4gPyBbQSxCLEMsRF0gOiBuZXZlcjtcblxuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFyZWRDU1MoKSB7XG5cdHJldHVybiBzaGFyZWRDU1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFxuICAgICAgICAgICAgICAgICAgICAgICAgVCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oTGlzczogVCkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRycyxcblx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5MSVNTQ2ZnO1xuXG5cdHR5cGUgUCA9IGluZmVyTElTUzxUPjtcblx0Ly90eXBlIEV4dGVuZHNDc3RyID0gUFswXTtcblx0dHlwZSBQYXJhbXMgICAgICA9IFBbMV07XG5cdHR5cGUgSG9zdENzdHIgICAgPSBQWzJdO1xuXHR0eXBlIEF0dHJzICAgICAgID0gUFszXTtcblxuICAgIHR5cGUgSG9zdCAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIC8vIGF0dHJzIHByb3h5XG5cdGNvbnN0IEdFVCA9IFN5bWJvbCgnZ2V0Jyk7XG5cdGNvbnN0IFNFVCA9IFN5bWJvbCgnc2V0Jyk7XG5cblx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5mcm9tRW50cmllcyggYXR0cnMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHRjb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCB3YWl0UmVhZHkgPSBuZXcgUHJvbWlzZTx2b2lkPiggYXN5bmMgKHIpID0+IHtcblxuICAgICAgICBhd2FpdCB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG5cbiAgICAgICAgcigpO1xuICAgIH0pO1xuXG4gICAgLy8gTm8gZGVwcyBhbmQgRE9NIGFscmVhZHkgbG9hZGVkLlxuICAgIGxldCBpc1JlYWR5ID0gTGlzcy5MSVNTQ2ZnLmRlcHMubGVuZ3RoID09IDAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cblx0Y29uc3QgcGFyYW1zID0gTGlzcy5MSVNTQ2ZnLnBhcmFtczsgLy9PYmplY3QuYXNzaWduKHt9LCBMaXNzLkxJU1NDZmcucGFyYW1zLCBfcGFyYW1zKTtcblxuXHQvL1xuXG5cdGNvbnN0IHdoZW5EZXBzUmVzb2x2ZWQgPSBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cdGxldCBpc0RlcHNSZXNvbHZlZCA9IGZhbHNlO1xuXHQoIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdGlzRGVwc1Jlc29sdmVkID0gdHJ1ZTtcblx0fSkoKTtcblxuXHRjbGFzcyBMSVNTSG9zdEJhc2UgZXh0ZW5kcyAoaG9zdCBhcyBuZXcgKCkgPT4gSFRNTEVsZW1lbnQpIHtcblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gaXNEZXBzUmVzb2x2ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdCh0aGlzLiNiYXNlIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0Z2V0IHBhcmFtcygpOiBQYXJhbXMge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3BhcmFtcztcblx0XHR9XG5cbiAgICAgICAgcHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8TElTU19PcHRzW1wicGFyYW1zXCJdPikge1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5iYXNlIS51cGRhdGVQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgLy8gd2lsIGJlIGdpdmVuIHRvIGNvbnN0cnVjdG9yLi4uXG5cdFx0XHRPYmplY3QuYXNzaWduKCB0aGlzLiNwYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblx0XHQvLyA9PT09PT09PT09PT09PSBBdHRyaWJ1dGVzID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNhdHRyc19mbGFnID0gZmFsc2U7XG5cblx0XHQjYXR0cmlidXRlcyAgICAgICAgID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJpYnV0ZXNEZWZhdWx0cyA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRycyA9IG5ldyBBdHRyaWJ1dGVzKFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlcyxcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0cyxcblx0XHRcdChuYW1lOiBBdHRycywgdmFsdWU6c3RyaW5nfG51bGwpID0+IHtcblxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG5cblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IHRydWU7IC8vIGRvIG5vdCB0cmlnZ2VyIG9uQXR0cnNDaGFuZ2VkLlxuXHRcdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0KSBhcyB1bmtub3duIGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXG5cdFx0c2V0QXR0ckRlZmF1bHQobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRkZWxldGUgdGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRnZXQgYXR0cnMoKTogUmVhZG9ubHk8UmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4+IHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2F0dHJzO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKHBhcmFtczoge30sIGJhc2U/OiBJbnN0YW5jZVR5cGU8VD4pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0aWYoIGJhc2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLiNiYXNlID0gYmFzZTtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0KHRoaXMuYmFzZSEgYXMgYW55KS5vbkRPTURpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuYmFzZSEub25ET01Db25uZWN0ZWQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLnN0YXRlLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgdGhpcy5zdGF0ZS5pc1JlYWR5O1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0b3ZlcnJpZGUgZ2V0IHNoYWRvd1Jvb3QoKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJjYWxsZWRcIik7XG5cdFx0XHRpZihzaGFkb3cgPT09IFNoYWRvd0NmZy5TRU1JT1BFTilcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRyZXR1cm4gc3VwZXIuc2hhZG93Um9vdDtcblx0XHR9XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cdFx0XHRcblx0XHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGhpcyk7XG5cbiAgICAgICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi5cblx0XHRcdFxuXHRcdFx0Ly8gc2hhZG93XG5cdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcyBhcyB1bmtub3duIGFzIEhvc3Q7XG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpIHtcblx0XHRcdFx0Y29uc3QgbW9kZSA9IHNoYWRvdyA9PT0gU2hhZG93Q2ZnLlNFTUlPUEVOID8gJ29wZW4nIDogc2hhZG93O1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGV9KTtcblxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGF0dHJzXG5cdFx0XHRmb3IobGV0IG9icyBvZiBhdHRycyEpXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbb2JzIGFzIEF0dHJzXSA9IHRoaXMuZ2V0QXR0cmlidXRlKG9icyk7XG5cblx0XHRcdC8vIGNzc1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MpO1xuXHRcdFx0aWYoIHN0eWxlc2hlZXRzLmxlbmd0aCApIHtcblxuXHRcdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goLi4uc3R5bGVzaGVldHMpO1xuXHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdGNvbnN0IGNzc3NlbGVjdG9yID0gdGhpcy5DU1NTZWxlY3RvcjtcblxuXHRcdFx0XHRcdC8vIGlmIG5vdCB5ZXQgaW5zZXJ0ZWQgOlxuXHRcdFx0XHRcdGlmKCAhIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpICkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuXHRcdFx0XHRcdFx0bGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuXG5cdFx0XHRcdFx0XHRmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG5cdFx0XHRcdFx0XHRcdFx0aHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuXHRcdFx0XHRcdFx0c3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cblx0XHRcdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcblxuXHRcdFx0XHRcdFx0YWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbnRlbnRcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSBjb250ZW50X2ZhY3RvcnkodGhpcy5hdHRycywgdGhpcy5wYXJhbXMsIHRoaXMpO1xuXHRcdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGNvbnRlbnQgKTtcblxuXHQgICAgXHQvLyBidWlsZFxuXG5cdCAgICBcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0ICAgIFx0bGV0IG9iaiA9IHRoaXMuYmFzZSA9PT0gbnVsbCA/IG5ldyBMaXNzKCkgOiB0aGlzLmJhc2U7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSBvYmogYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXG5cdFx0XHQvLyBkZWZhdWx0IHNsb3Rcblx0XHRcdGlmKCB0aGlzLmhhc1NoYWRvdyAmJiB0aGlzLiNjb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwIClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIodGhpcy5iYXNlKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuYmFzZTtcblx0XHR9XG5cblxuXG5cdFx0Ly8gYXR0cnNcblxuXHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBhdHRycztcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSAgICA6IEF0dHJzLFxuXHRcdFx0XHRcdFx0XHRcdCBvbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRcdCBuZXdWYWx1ZTogc3RyaW5nKSB7XG5cblx0XHRcdGlmKHRoaXMuI2F0dHJzX2ZsYWcpIHtcblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSBuZXdWYWx1ZTtcblx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0aWYoICh0aGlzLmJhc2UhIGFzIGFueSkub25BdHRyQ2hhbmdlZChuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLiNhdHRyc1tuYW1lXSA9IG9sZFZhbHVlOyAvLyByZXZlcnQgdGhlIGNoYW5nZS5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0QmFzZSBhcyBDb21wb3NlQ29uc3RydWN0b3I8dHlwZW9mIExJU1NIb3N0QmFzZSwgdHlwZW9mIGhvc3Q+O1xufVxuXG5cbiIsIlxuaW1wb3J0IHsgZGVmaW5lLCBnZXRCYXNlQ3N0ciwgZ2V0SG9zdENzdHIsIGdldE5hbWUsIGlzRGVmaW5lZCwgd2hlbkFsbERlZmluZWQsIHdoZW5EZWZpbmVkIH0gZnJvbSBcImN1c3RvbVJlZ2lzdGVyeVwiO1xuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZSAgICAgICAgIDogdHlwZW9mIGRlZmluZTtcblx0XHR3aGVuRGVmaW5lZCAgICA6IHR5cGVvZiB3aGVuRGVmaW5lZDtcblx0XHR3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcblx0XHRnZXRIb3N0Q3N0ciAgICA6IHR5cGVvZiBnZXRIb3N0Q3N0cjtcblx0XHRnZXRCYXNlQ3N0ciAgICA6IHR5cGVvZiBnZXRCYXNlQ3N0cjtcbiAgICB9XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7XG5MSVNTLmdldEhvc3RDc3RyICAgID0gZ2V0SG9zdENzdHI7XG5MSVNTLmdldEJhc2VDc3RyICAgID0gZ2V0QmFzZUNzdHI7IiwiXG5pbXBvcnQgeyBERUZJTkVELCBnZXRTdGF0ZSwgaW5pdGlhbGl6ZSwgSU5JVElBTElaRUQsIGluaXRpYWxpemVTeW5jLCBSRUFEWSwgdXBncmFkZSwgVVBHUkFERUQsIHVwZ3JhZGVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQsIHdoZW5VcGdyYWRlZCB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIERFRklORUQgICAgOiB0eXBlb2YgREVGSU5FRCxcbiAgICAgICAgUkVBRFkgICAgICA6IHR5cGVvZiBSRUFEWTtcbiAgICAgICAgVVBHUkFERUQgICA6IHR5cGVvZiBVUEdSQURFRDtcbiAgICAgICAgSU5JVElBTElaRUQ6IHR5cGVvZiBJTklUSUFMSVpFRDtcbiAgICAgICAgZ2V0U3RhdGUgICAgICAgOiB0eXBlb2YgZ2V0U3RhdGU7XG4gICAgICAgIHVwZ3JhZGUgICAgICAgIDogdHlwZW9mIHVwZ3JhZGU7XG4gICAgICAgIGluaXRpYWxpemUgICAgIDogdHlwZW9mIGluaXRpYWxpemU7XG4gICAgICAgIHVwZ3JhZGVTeW5jICAgIDogdHlwZW9mIHVwZ3JhZGVTeW5jO1xuICAgICAgICBpbml0aWFsaXplU3luYyA6IHR5cGVvZiBpbml0aWFsaXplU3luYztcbiAgICAgICAgd2hlblVwZ3JhZGVkICAgOiB0eXBlb2Ygd2hlblVwZ3JhZGVkO1xuICAgICAgICB3aGVuSW5pdGlhbGl6ZWQ6IHR5cGVvZiB3aGVuSW5pdGlhbGl6ZWQ7XG4gICAgfVxufVxuXG5MSVNTLkRFRklORUQgICAgPSBMSVNTLkRFRklORUQsXG5MSVNTLlJFQURZICAgICAgPSBMSVNTLlJFQURZO1xuTElTUy5VUEdSQURFRCAgID0gTElTUy5VUEdSQURFRDtcbkxJU1MuSU5JVElBTElaRUQ9IExJU1MuSU5JVElBTElaRUQ7XG5cbkxJU1MuZ2V0U3RhdGUgICAgICAgPSBnZXRTdGF0ZTtcbkxJU1MudXBncmFkZSAgICAgICAgPSB1cGdyYWRlO1xuTElTUy5pbml0aWFsaXplICAgICA9IGluaXRpYWxpemU7XG5MSVNTLnVwZ3JhZGVTeW5jICAgID0gdXBncmFkZVN5bmM7XG5MSVNTLmluaXRpYWxpemVTeW5jID0gaW5pdGlhbGl6ZVN5bmM7XG5MSVNTLndoZW5VcGdyYWRlZCAgID0gd2hlblVwZ3JhZGVkO1xuTElTUy53aGVuSW5pdGlhbGl6ZWQ9IHdoZW5Jbml0aWFsaXplZDsiLCJpbXBvcnQgdHlwZSB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLy8gR28gdG8gc3RhdGUgREVGSU5FRFxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPikge1xuXG4gICAgLy8gY291bGQgYmUgYmV0dGVyLlxuICAgIGlmKCBcIkJhc2VcIiBpbiBDb21wb25lbnRDbGFzcykge1xuICAgICAgICBDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzLkJhc2UgYXMgVDtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgQ2xhc3MgID0gQ29tcG9uZW50Q2xhc3MuTElTU0NmZy5ob3N0O1xuICAgIGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cbiAgICBjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKHRhZ25hbWU6IHN0cmluZyApIHtcblx0cmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdKSA6IFByb21pc2U8dm9pZD4ge1xuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKG5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50fExJU1NCYXNlfExJU1NCYXNlQ3N0cnxMSVNTSG9zdDxMSVNTQmFzZT58TElTU0hvc3RDc3RyPExJU1NCYXNlPiApOiBzdHJpbmcge1xuXG5cdGlmKCBcIkhvc3RcIiBpbiBlbGVtZW50LmNvbnN0cnVjdG9yKVxuXHRcdGVsZW1lbnQgPSBlbGVtZW50LmNvbnN0cnVjdG9yLkhvc3QgYXMgTElTU0hvc3RDc3RyPExJU1NCYXNlPjtcblx0aWYoIFwiSG9zdFwiIGluIGVsZW1lbnQpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuSG9zdDtcblx0aWYoIFwiQmFzZVwiIGluIGVsZW1lbnQuY29uc3RydWN0b3IpXG5cdFx0ZWxlbWVudCA9IGVsZW1lbnQuY29uc3RydWN0b3IgYXMgTElTU0hvc3RDc3RyPExJU1NCYXNlPjtcblxuXHRpZiggXCJCYXNlXCIgaW4gZWxlbWVudCkge1xuXHRcdGNvbnN0IG5hbWUgPSBjdXN0b21FbGVtZW50cy5nZXROYW1lKCBlbGVtZW50ICk7XG5cdFx0aWYobmFtZSA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIm5vdCBkZWZpbmVkIVwiKTtcblxuXHRcdHJldHVybiBuYW1lO1xuXHR9XG5cblx0aWYoICEgKGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKCc/Pz8nKTtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdENzdHI8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KG5hbWU6IHN0cmluZyk6IFQge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihuYW1lOiBzdHJpbmcpOiBUIHtcblx0cmV0dXJuIGdldEhvc3RDc3RyPExJU1NIb3N0Q3N0cjxUPj4obmFtZSkuQmFzZSBhcyBUO1xufSIsImltcG9ydCB0eXBlIHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge0xJU1MgYXMgX0xJU1N9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuXG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbi8vIGV4dGVuZHMgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICBFeHRlbmRzQ3N0cl9CYXNlIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtc19CYXNlICAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIEhvc3RDc3RyX0Jhc2UgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnNfQmFzZSAgICAgICBleHRlbmRzIHN0cmluZyxcblxuICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyPEV4dGVuZHNDc3RyX0Jhc2UsIFBhcmFtc19CYXNlLCBIb3N0Q3N0cl9CYXNlLCBBdHRyc19CYXNlPixcblxuICAgIC8vIFRPRE86IGFkZCBjb25zdHJhaW50cy4uLlxuICAgIFBhcmFtcyAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxuICAgIEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXI+KG9wdHM6IFBhcnRpYWw8TElTU19PcHRzPEJhc2VDc3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+KTogTElTU0Jhc2VDc3RyXG4vLyBMSVNTQmFzZSBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4ob3B0cz86IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4pOiBMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+XG5leHBvcnQgZnVuY3Rpb24gTElTUyhvcHRzOiBhbnkpOiBMSVNTQmFzZUNzdHJcbntcbiAgICBpZiggb3B0cy5leHRlbmRzICE9PSB1bmRlZmluZWQgJiYgXCJIb3N0XCIgaW4gb3B0cy5leHRlbmRzICkgLy8gd2UgYXNzdW1lIHRoaXMgaXMgYSBMSVNTQmFzZUNzdHJcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKG9wdHMpO1xuXG4gICAgcmV0dXJuIF9MSVNTKG9wdHMpO1xufVxuXG5mdW5jdGlvbiBfZXh0ZW5kczxcbiAgICBFeHRlbmRzQ3N0cl9CYXNlIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtc19CYXNlICAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIEhvc3RDc3RyX0Jhc2UgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnNfQmFzZSAgICAgICBleHRlbmRzIHN0cmluZyxcblxuICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyPEV4dGVuZHNDc3RyX0Jhc2UsIFBhcmFtc19CYXNlLCBIb3N0Q3N0cl9CYXNlLCBBdHRyc19CYXNlPixcbiAgICBcbiAgICAvLyBUT0RPOiBhZGQgY29uc3RyYWludHMuLi5cbiAgICBQYXJhbXMgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSxcbiAgICBIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyPihvcHRzOiBQYXJ0aWFsPExJU1NfT3B0czxCYXNlQ3N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+Pikge1xuXG4gICAgaWYoIG9wdHMuZXh0ZW5kcyA9PT0gdW5kZWZpbmVkKSAvLyBoNGNrXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYSBMSVNTQmFzZSEnKTtcblxuICAgIGNvbnN0IGJhc2UgPSBvcHRzLmV4dGVuZHMuTElTU0NmZztcblxuICAgIGNvbnN0IGhvc3QgPSBvcHRzLmhvc3QgPz8gYmFzZS5ob3N0O1xuXG4gICAgbGV0IGRlcHMgPSBiYXNlLmRlcHM7XG4gICAgaWYoIG9wdHMuZGVwcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBkZXBzID0gWy4uLmRlcHMsIC4uLm9wdHMuZGVwc107XG5cbiAgICBsZXQgYXR0cnMgPSBiYXNlLmF0dHJzIGFzIHJlYWRvbmx5IChBdHRyc3xBdHRyc19CYXNlKVtdO1xuICAgIGlmKCBvcHRzLmF0dHJzICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGF0dHJzID0gWy4uLmF0dHJzLCAuLi5vcHRzLmF0dHJzXTtcblxuICAgIGxldCBwYXJhbXMgPSBiYXNlLnBhcmFtcztcbiAgICBpZiggb3B0cy5wYXJhbXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihwYXJhbXMsIG9wdHMucGFyYW1zKTtcblxuICAgIC8vVE9ETzogaXNzdWVzIHdpdGggYXN5bmMgY29udGVudC9DU1MgKyBzb21lIGVkZ2UgY2FzZXMuLi5cbiAgICBsZXQgY29udGVudF9mYWN0b3J5ID0gYmFzZS5jb250ZW50X2ZhY3RvcnkgYXMgYW55O1xuICAgIGlmKCBvcHRzLmNvbnRlbnQgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29udGVudF9mYWN0b3J5ID0gb3B0cy5jb250ZW50X2ZhY3RvcnkhKCBvcHRzLmNvbnRlbnQgKTtcblxuICAgIGxldCBzdHlsZXNoZWV0cyA9IGJhc2Uuc3R5bGVzaGVldHM7XG4gICAgaWYoIG9wdHMuY3NzICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHN0eWxlc2hlZXRzID0gWy4uLnN0eWxlc2hlZXRzLCAuLi5vcHRzLmNzc107XG5cbiAgICBjb25zdCBzaGFkb3cgPSBvcHRzLnNoYWRvdyA/PyBiYXNlLnNoYWRvdztcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyB7XG5cbiAgICAgICAgc3RhdGljIG92ZXJyaWRlIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuICAgICAgICAvL1RPRE86IGZpeCB0eXBlcy4uLlxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59XG5cbi8qXG5mdW5jdGlvbiBleHRlbmRzTElTUzxFeHRlbmRzIGV4dGVuZHMgQ2xhc3MsXG5cdEhvc3QgICAgZXh0ZW5kcyBIVE1MRWxlbWVudCxcblx0QXR0cnMxICAgZXh0ZW5kcyBzdHJpbmcsXG5cdEF0dHJzMiAgIGV4dGVuZHMgc3RyaW5nLFxuXHRQYXJhbXMgIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+LFxuXHRUIGV4dGVuZHMgTElTU1JldHVyblR5cGU8RXh0ZW5kcywgSG9zdCwgQXR0cnMxLCBQYXJhbXM+PihMaXNzOiBULFxuXHRcdHBhcmFtZXRlcnM6IHtcblx0XHRcdHNoYWRvdyAgICAgID86IFNoYWRvd0NmZyxcblx0XHRcdGF0dHJpYnV0ZXMgID86IHJlYWRvbmx5IEF0dHJzMltdLFxuXHRcdFx0ZGVwZW5kZW5jaWVzPzogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W11cblx0XHR9KSB7XG5cblx0Y29uc3QgYXR0cmlidXRlcyAgID0gWy4uLkxpc3MuUGFyYW1ldGVycy5hdHRyaWJ1dGVzICAsIC4uLnBhcmFtZXRlcnMuYXR0cmlidXRlcyAgPz9bXV07XG5cdGNvbnN0IGRlcGVuZGVuY2llcyA9IFsuLi5MaXNzLlBhcmFtZXRlcnMuZGVwZW5kZW5jaWVzLCAuLi5wYXJhbWV0ZXJzLmRlcGVuZGVuY2llcz8/W11dO1xuXG5cdGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIExpc3MuUGFyYW1ldGVycywge1xuXHRcdGF0dHJpYnV0ZXMsXG5cdFx0ZGVwZW5kZW5jaWVzXG5cdH0pO1xuXHRpZiggcGFyYW1ldGVycy5zaGFkb3cgIT09IHVuZGVmaW5lZClcblx0XHRwYXJhbXMuc2hhZG93ID0gcGFyYW1ldGVycy5zaGFkb3c7XG5cblx0Ly8gQHRzLWlnbm9yZSA6IGJlY2F1c2UgVFMgc3R1cGlkXG5cdGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIExpc3Mge1xuXHRcdGNvbnN0cnVjdG9yKC4uLnQ6IGFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlIDogYmVjYXVzZSBUUyBzdHVwaWRcblx0XHRcdHN1cGVyKC4uLnQpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBvdmVycmlkZSBnZXQgYXR0cnMoKSB7XG5cdFx0XHRyZXR1cm4gc3VwZXIuYXR0cnMgYXMgUmVjb3JkPEF0dHJzMnxBdHRyczEsIHN0cmluZ3xudWxsPjtcblx0XHR9XG5cblx0XHRzdGF0aWMgb3ZlcnJpZGUgUGFyYW1ldGVycyA9IHBhcmFtcztcblx0fVxuXG5cdHJldHVybiBFeHRlbmRlZExJU1M7XG59XG5MSVNTLmV4dGVuZHNMSVNTID0gZXh0ZW5kc0xJU1M7XG4qLyIsImltcG9ydCB7IENvbnN0cnVjdG9yLCBTaGFkb3dDZmcgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7TElTU30gZnJvbSBcIi4uL0xJU1NCYXNlXCI7XG5cbmltcG9ydCB7ZGVmaW5lfSBmcm9tIFwiLi4vY3VzdG9tUmVnaXN0ZXJ5XCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbi8vIHNob3VsZCBiZSBpbXByb3ZlZCAoYnV0IGhvdyA/KVxuY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2F1dG9kaXJdJyk7XG5pZiggc2NyaXB0ICE9PSBudWxsICkge1xuXG5cdGNvbnN0IFJFU1NPVVJDRVMgPSBbXG5cdFx0XCJpbmRleC5qc1wiLFxuXHRcdFwiaW5kZXguYnJ5XCIsXG5cdFx0XCJpbmRleC5odG1sXCIsXG5cdFx0XCJpbmRleC5jc3NcIlxuXHRdO1xuXG5cdGNvbnN0IEtub3duVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5cdGNvbnN0IFNXOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cdFx0XG5cdFx0YXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc2NyaXB0LmdldEF0dHJpYnV0ZSgnc3cnKSA/PyBcIi9zdy5qc1wiLCB7c2NvcGU6IFwiL1wifSk7XG5cblx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRsZXQgY29tcG9uZW50c19kaXIgPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdhdXRvZGlyJykhO1xuXHRpZiggY29tcG9uZW50c19kaXJbMF0gPT09ICcuJylcblx0XHRjb21wb25lbnRzX2RpciA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIGNvbXBvbmVudHNfZGlyOyAvLyBnZXR0aW5nIGFuIGFic29sdXRlIHBhdGguXG5cdGlmKCBjb21wb25lbnRzX2Rpcltjb21wb25lbnRzX2Rpci5sZW5ndGgtMV0gIT09ICcvJylcblx0XHRjb21wb25lbnRzX2RpciArPSAnLyc7XG5cblx0Ly8gb2JzZXJ2ZSBmb3IgbmV3IGluamVjdGVkIHRhZ3MuXG5cdG5ldyBNdXRhdGlvbk9ic2VydmVyKCAobXV0YXRpb25zKSA9PiB7XG5cblx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcblx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0aWYoYWRkaXRpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcblx0XHRcdFx0XHRhZGRUYWcoYWRkaXRpb24pXG5cblx0fSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuXHRmb3IoIGxldCBlbGVtIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiKlwiKSApXG5cdFx0YWRkVGFnKCBlbGVtICk7XG5cblxuXHRhc3luYyBmdW5jdGlvbiBhZGRUYWcodGFnOiBIVE1MRWxlbWVudCkge1xuXG5cdFx0Y29uc3QgdGFnbmFtZSA9ICggdGFnLmdldEF0dHJpYnV0ZSgnaXMnKSA/PyB0YWcudGFnTmFtZSApLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiggISB0YWduYW1lLmluY2x1ZGVzKCctJykgfHwgS25vd25UYWdzLmhhcyggdGFnbmFtZSApIClcblx0XHRcdHJldHVybjtcblxuXHRcdEtub3duVGFncy5hZGQodGFnbmFtZSk7XG5cblx0XHRhd2FpdCBTVzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IGZpbGVuYW1lcyA9IFJFU1NPVVJDRVM7XG5cdFx0Y29uc3QgcmVzb3VyY2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoIGZpbGVuYW1lcy5tYXAoIGZpbGUgPT4ge1xuXHRcdFx0Y29uc3QgZmlsZV9wYXRoID0gYCR7Y29tcG9uZW50c19kaXJ9JHt0YWduYW1lfS8ke2ZpbGV9YDtcblx0XHRcdHJldHVybiBmaWxlLmVuZHNXaXRoKCcuanMnKSA/IF9pbXBvcnQgICAoZmlsZV9wYXRoLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IF9mZXRjaFRleHQoZmlsZV9wYXRoLCB0cnVlKTtcblx0XHR9KSk7XG5cblx0XHRjb25zdCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlbmFtZXMubGVuZ3RoOyArK2kpXG5cdFx0XHRpZiggcmVzb3VyY2VzW2ldICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdGZpbGVzW2ZpbGVuYW1lc1tpXV0gPSByZXNvdXJjZXNbaV07XG5cblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXHRcdGNvbnN0IGNzcyAgICAgPSBmaWxlc1tcImluZGV4LmNzc1wiXTtcblxuXHRcdGxldCBob3N0ID0gdW5kZWZpbmVkO1xuXHRcdGlmKCB0YWcuaGFzQXR0cmlidXRlKCdpcycpIClcblx0XHRcdGhvc3QgPSB0YWcuY29uc3RydWN0b3IgYXMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+XG5cblx0XHRjb25zdCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nLCBob3N0OiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD59PiA9IHtcblx0XHRcdC4uLmNvbnRlbnQgIT09IHVuZGVmaW5lZCAmJiB7Y29udGVudH0sXG5cdFx0XHQuLi5jc3MgICAgICE9PSB1bmRlZmluZWQgJiYge2Nzc30sXG5cdFx0XHQuLi5ob3N0ICAgICE9PSB1bmRlZmluZWQgJiYge2hvc3R9LFxuXHRcdH07XG5cblx0XHRyZXR1cm4gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWUsIGZpbGVzLCBvcHRzKTtcblx0XHRcblx0fVxuXG5cblx0ZnVuY3Rpb24gZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZywgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9wdHM6IFBhcnRpYWw8e2NvbnRlbnQ6IHN0cmluZywgY3NzOiBzdHJpbmcsIGhvc3Q6IEhUTUxFbGVtZW50fT4pIHtcblxuXHRcdGNvbnN0IGpzICAgICAgPSBmaWxlc1tcImluZGV4LmpzXCJdO1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cblx0XHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0XHRpZigganMgIT09IHVuZGVmaW5lZCApXG5cdFx0XHRrbGFzcyA9IGpzKG9wdHMpO1xuXHRcdGVsc2UgaWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGtsYXNzID0gTElTU0F1dG8ob3B0cy5jb250ZW50LCBvcHRzLmNzcywgb3B0cy5ob3N0KTtcblx0XHR9XG5cblx0XHRpZihrbGFzcyA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0XHRyZXR1cm4gZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblx0fVxuXG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vID09PT09PT09PT09PT09PSBMSVNTIGludGVybmFsIHRvb2xzID09PT09PT09PT09PVxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRhc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0XHRjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuXHRcdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHRcdDoge307XG5cblxuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcblx0XHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdFx0aWYoIGlzTGlzc0F1dG8gJiYgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJzdGF0dXNcIikhID09PSBcIjQwNFwiIClcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0XHRyZXR1cm4gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXHR9XG5cdGFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdFx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdFx0aWYoaXNMaXNzQXV0byAmJiBhd2FpdCBfZmV0Y2hUZXh0KHVyaSwgaXNMaXNzQXV0bykgPT09IHVuZGVmaW5lZCApXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJpKSkuZGVmYXVsdDtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cbn1cblxuLy9UT0RPOiBpbXByb3ZlID9cbmV4cG9ydCBmdW5jdGlvbiBMSVNTQXV0byhjb250ZW50Pzogc3RyaW5nLCBjc3M/OiBzdHJpbmcsIGhvc3Q/OiBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4pIHtcblxuXHRjb25zdCBvcHRzID0ge2NvbnRlbnQsIGNzcywgaG9zdH07XG5cblx0Ly9UT0RPOiB7fVxuXHQvL1RPRE86IENTU19mYWN0b3J5IHRvbyA/Pz8gb3UgY3NzLXRvdG89XCJ0b3RvXCIgKD8pXG5cdChvcHRzIGFzIGFueSkuY29udGVudF9mYWN0b3J5ID0gKHN0cjogc3RyaW5nKSA9PiB7XG5cblx0XHRzdHIgPSBzdHIucmVwbGFjZUFsbCgvXFwkXFx7KFtcXHddKylcXH0vZywgKF8sIG5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0cmV0dXJuIGA8bGlzcyB2YWx1ZT1cIiR7bmFtZX1cIj48L2xpc3M+YDtcblx0XHR9KTtcblxuXHRcdC8vVE9ETzogJHt9IGluIGF0dHJcblx0XHRcdC8vIC0gZGV0ZWN0IHN0YXJ0ICR7ICsgZW5kIH1cblx0XHRcdC8vIC0gcmVnaXN0ZXIgZWxlbSArIGF0dHIgbmFtZVxuXHRcdFx0Ly8gLSByZXBsYWNlLiBcblx0XHRjb25zdCBjb250ZW50ID0gaHRtbGAke3N0cn1gO1xuXG5cdFx0bGV0IHNwYW5zID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXG5cdFx0cmV0dXJuIChfYTogdW5rbm93biwgX2I6dW5rbm93biwgZWxlbTogSFRNTEVsZW1lbnQpID0+IHtcblxuXHRcdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdFx0Zm9yKGxldCBzcGFuIG9mIHNwYW5zKVxuXHRcdFx0XHRzcGFuLnRleHRDb250ZW50ID0gZWxlbS5nZXRBdHRyaWJ1dGUoc3Bhbi5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXG5cdFx0XHRyZXR1cm4gY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0fTtcblxuXHR9O1xuXG5cdGNvbnN0IGtsYXNzID0gY2xhc3MgV2ViQ29tcG9uZW50IGV4dGVuZHMgTElTUyhvcHRzKSB7XG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXHRcdFx0XG5cdFx0XHRjb25zdCBjc3NfYXR0cnMgPSB0aGlzLmhvc3QuZ2V0QXR0cmlidXRlTmFtZXMoKS5maWx0ZXIoIGUgPT4gZS5zdGFydHNXaXRoKCdjc3MtJykpO1xuXG5cdFx0XHRmb3IobGV0IGNzc19hdHRyIG9mIGNzc19hdHRycylcblx0XHRcdFx0dGhpcy5ob3N0LnN0eWxlLnNldFByb3BlcnR5KGAtLSR7Y3NzX2F0dHIuc2xpY2UoJ2Nzcy0nLmxlbmd0aCl9YCwgdGhpcy5ob3N0LmdldEF0dHJpYnV0ZShjc3NfYXR0cikpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4ga2xhc3M7XG59IiwiaW1wb3J0IHsgZGVmaW5lIH0gZnJvbSBcImN1c3RvbVJlZ2lzdGVyeVwiO1xuaW1wb3J0IHsgTElTUyB9IGZyb20gXCJMSVNTQmFzZVwiO1xuaW1wb3J0IHsgTElTU0hvc3QsIFNoYWRvd0NmZyB9IGZyb20gXCJ0eXBlc1wiO1xuXG4vLyBOb3JtYWxseSA6XG4vLyBQYXJlbnQgdXBncmFkZSAtPiBjaGlsZHJlbiB1cGdyYWRlIC0+IGNoaWxkcmVuIGluaXQgLT4gbWFuaXB1bGF0ZSBwYXJlbnQgaG9zdCAtPiBwYXJlbnQgaW5pdC5cbi8vIElmIGRlcHMgLT4gbmVlZCBhIHRvb2wgZm9yIFwid2FpdENoaWxkcmVuSW5pdFwiIG9yIFwid2FpdFBhcmVudEluaXRcIi5cblxuZXhwb3J0IGNsYXNzIExJU1NQYXJhbXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4+IGV4dGVuZHMgTElTUyh7XG4gICAgc2hhZG93OiBTaGFkb3dDZmcuTk9ORSxcbiAgICBjc3M6IFtgOmhvc3Qge2Rpc3BsYXk6IG5vbmV9YF0sXG4gICAgYXR0cnM6IFtcInR5cGVcIl1cbn0pIHtcblxuICAgICNuYW1lICA6IHN0cmluZztcbiAgICAjdmFsdWU/OiBUO1xuXG4gICAgI3BhcmVudDogTElTU0hvc3Q7XG5cbiAgICAvLyBkaXJ0eSBoNGNrLi4uXG4gICAgY29uc3RydWN0b3IocCA9IHt9LCBpbml0ID0gdHJ1ZSkgeyAvLyB3aHkgaW5pdCA/XG5cbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLiNuYW1lID0gdGhpcy5ob3N0LmdldEF0dHJpYnV0ZShcIm5hbWVcIikhO1xuXG4gICAgICAgIHRoaXMuI3BhcmVudCA9IHRoaXMuaG9zdC5wYXJlbnRFbGVtZW50ISBhcyBMSVNTSG9zdDtcblxuICAgICAgICBpZihpbml0KVxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXQoKSB7XG5cbiAgICAgICAgLy8gVE9ETzogb2JzZXJ2ZSBjb250ZW50Li4uXG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy5ob3N0LnRleHRDb250ZW50ISk7XG4gICAgfVxuXG4gICAgLy9UT0RPXG4gICAgcHJvdGVjdGVkIGdldCB0eXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRycy50eXBlID8/IFwiSlNPTlwiO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfcGFyc2VDb250ZW50KHZhbHVlOiBzdHJpbmcpOiBUIHtcblxuICAgICAgICBjb25zdCB0eXBlID0gdGhpcy50eXBlO1xuXG4gICAgICAgIGlmKCB0eXBlID09PSBcIkpTT05cIilcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgICAgaWYoIHR5cGUgPT09IFwiSlNcIikge1xuICAgICAgICAgICAgLy9UT0RPOiBtYXkgYmUgaW1wcm92ZWQgP1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IE9iamVjdC5rZXlzKCB0aGlzLmdldEFyZ3MoKSApO1xuICAgICAgICAgICAgdGhpcy4jZmN0ID0gbmV3IEZ1bmN0aW9uKC4uLmFyZ3MsIGByZXR1cm4gJHt2YWx1ZX1gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGwoIC4uLk9iamVjdC52YWx1ZXMoYXJncykgKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgaW1wbGVtZW50ZWQhXCIpO1xuICAgIH1cblxuICAgICNmY3Q6ICggRnVuY3Rpb24pfG51bGwgPSBudWxsO1xuXG4gICAgcHJvdGVjdGVkIGNhbGwoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2ZjdCEoLi4uYXJncykgYXMgVDtcbiAgICB9XG4gICAgXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuI3ZhbHVlID0gdGhpcy5fcGFyc2VDb250ZW50KHZhbHVlKTtcbiAgICAgICAgLypcbiAgICAgICAgLy8gZG8gbm90IHVwZGF0ZWQgaWYgbm90IGluIERPTS5cbiAgICAgICAgaWYoICEgdGhpcy4jcGFyZW50Py5pc0luRE9NKVxuICAgICAgICAgICAgcmV0dXJuOyovXG5cbiAgICAgICAgdGhpcy4jcGFyZW50LnVwZGF0ZVBhcmFtcyh0aGlzLiN2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldEFyZ3MoKTogUmVjb3JkPHN0cmluZyxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIC8vVE9ETy4uLlxuICAgIC8qXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIG9uQXR0ckNoYW5nZWQoX25hbWU6IHN0cmluZywgX29sZFZhbHVlOiBzdHJpbmcsIF9uZXdWYWx1ZTogc3RyaW5nKTogdm9pZCB8IGZhbHNlIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy5hdHRycy52YWx1ZSEpO1xuICAgIH0qL1xufVxuXG5pZiggY3VzdG9tRWxlbWVudHMuZ2V0KFwibGlzcy1wYXJhbXNcIikgPT09IHVuZGVmaW5lZClcbiAgICBkZWZpbmUoXCJsaXNzLXBhcmFtc1wiLCBMSVNTUGFyYW1zKTsiLCJpbXBvcnQgdHlwZSB7IExJU1NCYXNlIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcIi4uL3N0YXRlXCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcInV0aWxzXCI7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oZWxlbSk7XG59XG5cbi8qXG50eXBlIEJVSUxEX09QVElPTlM8VCBleHRlbmRzIExJU1NCYXNlPiA9IFBhcnRpYWw8e1xuICAgIHBhcmFtcyAgICA6IFBhcnRpYWw8VFtcInBhcmFtc1wiXT4sXG4gICAgY29udGVudFx0ICA6IHN0cmluZ3xOb2RlfHJlYWRvbmx5IE5vZGVbXSxcbiAgICBpZCBcdFx0ICAgIDogc3RyaW5nLFxuICAgIGNsYXNzZXNcdCAgOiByZWFkb25seSBzdHJpbmdbXSxcbiAgICBjc3N2YXJzICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PixcbiAgICBhdHRycyBcdCAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGRhdGEgXHQgICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGxpc3RlbmVycyA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIChldjogRXZlbnQpID0+IHZvaWQ+PlxufT4gJiAoe1xuICBpbml0aWFsaXplOiBmYWxzZSxcbiAgcGFyZW50OiBFbGVtZW50XG59fHtcbiAgaW5pdGlhbGl6ZT86IHRydWUsXG4gIHBhcmVudD86IEVsZW1lbnRcbn0pO1xuXG4vL2FzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IFByb21pc2U8Q29tcG9uZW50c1tUXT47XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZT4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U+KHRhZ25hbWU6IHN0cmluZywge1xuICAgICAgICAgICAgICBwYXJhbXMgICAgPSB7fSxcbiAgICAgICAgICAgICAgaW5pdGlhbGl6ZT0gdHJ1ZSxcbiAgICAgICAgICAgICAgY29udGVudCAgID0gW10sXG4gICAgICAgICAgICAgIHBhcmVudCAgICA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgaWQgXHRcdCAgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGNsYXNzZXMgICA9IFtdLFxuICAgICAgICAgICAgICBjc3N2YXJzICAgPSB7fSxcbiAgICAgICAgICAgICAgYXR0cnMgICAgID0ge30sXG4gICAgICAgICAgICAgIGRhdGEgXHQgID0ge30sXG4gICAgICAgICAgICAgIGxpc3RlbmVycyA9IHt9XG4gICAgICAgICAgICAgIH06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFByb21pc2U8VD4ge1xuXG4gIGlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxuICBsZXQgQ3VzdG9tQ2xhc3MgPSBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcbiAgbGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuICAvLyBGaXggaXNzdWUgIzJcbiAgaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbiAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuICBpZiggaWQgIT09IHVuZGVmaW5lZCApXG4gIGVsZW0uaWQgPSBpZDtcblxuICBpZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuICBlbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG4gIGVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG4gIGxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuICBpZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbiAgZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICBlbHNlXG4gIGVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxuXG4gIGZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbiAgbGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbiAgaWYoIHZhbHVlID09PSBmYWxzZSlcbiAgZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbiAgZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbiAgZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbiAgZWxzZVxuICBlbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuICBjb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbiAgZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbiAgaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbiAgcGFyZW50LmFwcGVuZChlbGVtKTtcblxuICBpZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbiAgcmV0dXJuIGF3YWl0IExJU1MuaW5pdGlhbGl6ZShlbGVtKTtcblxuICByZXR1cm4gYXdhaXQgTElTUy5nZXRMSVNTKGVsZW0pO1xufVxuTElTUy5idWlsZCA9IGJ1aWxkO1xuXG5cbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBDb21wb25lbnRzW1RdO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogVDtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCB7XG5wYXJhbXMgICAgPSB7fSxcbmluaXRpYWxpemU9IHRydWUsXG5jb250ZW50ICAgPSBbXSxcbnBhcmVudCAgICA9IHVuZGVmaW5lZCxcbmlkIFx0XHQgID0gdW5kZWZpbmVkLFxuY2xhc3NlcyAgID0gW10sXG5jc3N2YXJzICAgPSB7fSxcbmF0dHJzICAgICA9IHt9LFxuZGF0YSBcdCAgPSB7fSxcbmxpc3RlbmVycyA9IHt9XG59OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBUIHtcblxuaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG50aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbmxldCBDdXN0b21DbGFzcyA9IGN1c3RvbUVsZW1lbnRzLmdldCh0YWduYW1lKTtcbmlmKEN1c3RvbUNsYXNzID09PSB1bmRlZmluZWQpXG50aHJvdyBuZXcgRXJyb3IoYCR7dGFnbmFtZX0gbm90IGRlZmluZWRgKTtcbmxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbi8vVE9ETzogZmFjdG9yaXplLi4uXG5cbi8vIEZpeCBpc3N1ZSAjMlxuaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbmVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbmlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbmVsZW0uaWQgPSBpZDtcblxuaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbmVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG5lbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbmxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG5lbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5lbHNlXG5lbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59XG5cbmZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbmxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG5pZiggdmFsdWUgPT09IGZhbHNlKVxuZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbmVsc2UgaWYodmFsdWUgPT09IHRydWUpXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuZWxzZVxuZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG59XG5cbmlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG5lbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG5pZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxucGFyZW50LmFwcGVuZChlbGVtKTtcblxuaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG5MSVNTLmluaXRpYWxpemVTeW5jKGVsZW0pO1xuXG5yZXR1cm4gTElTUy5nZXRMSVNTU3luYyhlbGVtKTtcbn1cbkxJU1MuYnVpbGRTeW5jID0gYnVpbGRTeW5jO1xuKi8iLCJcbmltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcInR5cGVzXCI7XG5cbnR5cGUgTGlzdGVuZXJGY3Q8VCBleHRlbmRzIEV2ZW50PiA9IChldjogVCkgPT4gdm9pZDtcbnR5cGUgTGlzdGVuZXJPYmo8VCBleHRlbmRzIEV2ZW50PiA9IHsgaGFuZGxlRXZlbnQ6IExpc3RlbmVyRmN0PFQ+IH07XG50eXBlIExpc3RlbmVyPFQgZXh0ZW5kcyBFdmVudD4gPSBMaXN0ZW5lckZjdDxUPnxMaXN0ZW5lck9iajxUPjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50VGFyZ2V0MjxFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBFdmVudD4+IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuXG5cdG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBjYWxsYmFjazogTGlzdGVuZXI8RXZlbnRzW1RdPiB8IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgb3B0aW9ucz86IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhbik6IHZvaWQge1xuXHRcdFxuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdHJldHVybiBzdXBlci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblx0fVxuXG5cdG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQ8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4oZXZlbnQ6IEV2ZW50c1tUXSk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBzdXBlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fVxuXG5cdG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXI8VCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogVCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGlzdGVuZXI6IExpc3RlbmVyPEV2ZW50c1tUXT4gfCBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBvcHRpb25zPzogYm9vbGVhbnxBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQge1xuXG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0c3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1c3RvbUV2ZW50MjxUIGV4dGVuZHMgc3RyaW5nLCBBcmdzPiBleHRlbmRzIEN1c3RvbUV2ZW50PEFyZ3M+IHtcblxuXHRjb25zdHJ1Y3Rvcih0eXBlOiBULCBhcmdzOiBBcmdzKSB7XG5cdFx0c3VwZXIodHlwZSwge2RldGFpbDogYXJnc30pO1xuXHR9XG5cblx0b3ZlcnJpZGUgZ2V0IHR5cGUoKTogVCB7IHJldHVybiBzdXBlci50eXBlIGFzIFQ7IH1cbn1cblxudHlwZSBJbnN0YW5jZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4+ID0ge1xuXHRbSyBpbiBrZXlvZiBUXTogSW5zdGFuY2VUeXBlPFRbS10+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXaXRoRXZlbnRzPFQgZXh0ZW5kcyBvYmplY3QsIEV2ZW50cyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIENvbnN0cnVjdG9yPEV2ZW50Pj4gPihldjogQ29uc3RydWN0b3I8VD4sIF9ldmVudHM6IEV2ZW50cykge1xuXG5cdHR5cGUgRXZ0cyA9IEluc3RhbmNlczxFdmVudHM+O1xuXG5cdGlmKCAhIChldiBpbnN0YW5jZW9mIEV2ZW50VGFyZ2V0KSApXG5cdFx0cmV0dXJuIGV2IGFzIENvbnN0cnVjdG9yPE9taXQ8VCwga2V5b2YgRXZlbnRUYXJnZXQ+ICYgRXZlbnRUYXJnZXQyPEV2dHM+PjtcblxuXHQvLyBpcyBhbHNvIGEgbWl4aW5cblx0Ly8gQHRzLWlnbm9yZVxuXHRjbGFzcyBFdmVudFRhcmdldE1peGlucyBleHRlbmRzIGV2IHtcblxuXHRcdCNldiA9IG5ldyBFdmVudFRhcmdldDI8RXZ0cz4oKTtcblxuXHRcdGFkZEV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmFkZEV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG5cdFx0fVxuXHRcdGRpc3BhdGNoRXZlbnQoLi4uYXJnczphbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0cmV0dXJuIHRoaXMuI2V2LmRpc3BhdGNoRXZlbnQoLi4uYXJncyk7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gRXZlbnRUYXJnZXRNaXhpbnMgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3RvcjxPbWl0PFQsIGtleW9mIEV2ZW50VGFyZ2V0PiAmIEV2ZW50VGFyZ2V0MjxFdnRzPj47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgU2hhZG93Um9vdCB0b29scyA9PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRNYXRjaGVzKGV2OiBFdmVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXG5cdGxldCBlbGVtZW50cyA9IGV2LmNvbXBvc2VkUGF0aCgpLnNsaWNlKDAsLTIpLmZpbHRlcihlID0+ICEgKGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSApLnJldmVyc2UoKSBhcyBIVE1MRWxlbWVudFtdO1xuXG5cdGZvcihsZXQgZWxlbSBvZiBlbGVtZW50cyApXG5cdFx0aWYoZWxlbS5tYXRjaGVzKHNlbGVjdG9yKSApXG5cdFx0XHRyZXR1cm4gZWxlbTsgXG5cblx0cmV0dXJuIG51bGw7XG59IiwiXG5pbXBvcnQgdHlwZSB7IExJU1NCYXNlLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN5bmMsIHdoZW5Jbml0aWFsaXplZCB9IGZyb20gXCIuLi9zdGF0ZVwiO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50cyB7fTtcblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICAvLyBhc3luY1xuICAgICAgICBxcyA6IHR5cGVvZiBxcztcbiAgICAgICAgcXNvOiB0eXBlb2YgcXNvO1xuICAgICAgICBxc2E6IHR5cGVvZiBxc2E7XG4gICAgICAgIHFzYzogdHlwZW9mIHFzYztcblxuICAgICAgICAvLyBzeW5jXG4gICAgICAgIHFzU3luYyA6IHR5cGVvZiBxc1N5bmM7XG4gICAgICAgIHFzYVN5bmM6IHR5cGVvZiBxc2FTeW5jO1xuICAgICAgICBxc2NTeW5jOiB0eXBlb2YgcXNjU3luYztcblxuXHRcdGNsb3Nlc3Q6IHR5cGVvZiBjbG9zZXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzc19zZWxlY3RvcihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtsaXNzX3NlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRsZXQgcmVzdWx0ID0gYXdhaXQgcXNvPFQ+KHNlbGVjdG9yLCBwYXJlbnQpO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiByZXN1bHQhXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc288TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUW10+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dW10gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8VD4+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHByb21pc2VzW2lkeCsrXSA9IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFRbXTtcbmZ1bmN0aW9uIHFzYVN5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl1bXTtcbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cmVzdWx0W2lkeCsrXSA9IGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4ocmVzdWx0KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNsb3Nlc3Q8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcblxuXHR3aGlsZSh0cnVlKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGVsZW1lbnQuY2xvc2VzdDxFPihzZWxlY3Rvcik7XG5cblx0XHRpZiggcmVzdWx0ICE9PSBudWxsKVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblxuXHRcdGNvbnN0IHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG5cdFx0aWYoICEgKFwiaG9zdFwiIGluIHJvb3QpIClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0ZWxlbWVudCA9IChyb290IGFzIFNoYWRvd1Jvb3QpLmhvc3Q7XG5cdH1cbn1cblxuXG4vLyBhc3luY1xuTElTUy5xcyAgPSBxcztcbkxJU1MucXNvID0gcXNvO1xuTElTUy5xc2EgPSBxc2E7XG5MSVNTLnFzYyA9IHFzYztcblxuLy8gc3luY1xuTElTUy5xc1N5bmMgID0gcXNTeW5jO1xuTElTUy5xc2FTeW5jID0gcXNhU3luYztcbkxJU1MucXNjU3luYyA9IHFzY1N5bmM7XG5cbkxJU1MuY2xvc2VzdCA9IGNsb3Nlc3Q7IiwiaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW1wb3J0IHsgZ2V0SG9zdENzdHIsIGdldE5hbWUgfSBmcm9tIFwiLi9jdXN0b21SZWdpc3RlcnlcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5lbnVtIFN0YXRlIHtcbiAgICBOT05FID0gMCxcblxuICAgIC8vIGNsYXNzXG4gICAgREVGSU5FRCA9IDEgPDwgMCxcbiAgICBSRUFEWSAgID0gMSA8PCAxLFxuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBVUEdSQURFRCAgICA9IDEgPDwgMixcbiAgICBJTklUSUFMSVpFRCA9IDEgPDwgMyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRklORUQgICAgID0gU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IFN0YXRlLlJFQURZO1xuZXhwb3J0IGNvbnN0IFVQR1JBREVEICAgID0gU3RhdGUuVVBHUkFERUQ7XG5leHBvcnQgY29uc3QgSU5JVElBTElaRUQgPSBTdGF0ZS5JTklUSUFMSVpFRDtcblxuZXhwb3J0IGNsYXNzIExJU1NTdGF0ZSB7XG5cbiAgICAjZWxlbTogSFRNTEVsZW1lbnR8bnVsbDtcblxuICAgIC8vIGlmIG51bGwgOiBjbGFzcyBzdGF0ZSwgZWxzZSBpbnN0YW5jZSBzdGF0ZVxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEhUTUxFbGVtZW50fG51bGwgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuI2VsZW0gPSBlbGVtO1xuICAgIH1cblxuICAgIHN0YXRpYyBERUZJTkVEICAgICA9IERFRklORUQ7XG4gICAgc3RhdGljIFJFQURZICAgICAgID0gUkVBRFk7XG4gICAgc3RhdGljIFVQR1JBREVEICAgID0gVVBHUkFERUQ7XG4gICAgc3RhdGljIElOSVRJQUxJWkVEID0gSU5JVElBTElaRUQ7XG5cbiAgICBpcyhzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCAgICAgJiYgISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZICAgICAgICYmICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgICAgJiYgISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCAmJiAhIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW4oc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGxldCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPGFueT4+KCk7XG4gICAgXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuRGVmaW5lZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblJlYWR5KCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuVXBncmFkZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5Jbml0aWFsaXplZCgpICk7XG4gICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gREVGSU5FRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0RlZmluZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFJFQURZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHIoZ2V0TmFtZShlbGVtKSk7XG5cbiAgICAgICAgaWYoICEgaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBIb3N0LmlzRGVwc1Jlc29sdmVkO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW5SZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpOyAvLyBjb3VsZCBiZSByZWFkeSBiZWZvcmUgZGVmaW5lZCwgYnV0IHdlbGwuLi5cblxuICAgICAgICBhd2FpdCB3aGVuRE9NQ29udGVudExvYWRlZDtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5EZXBzUmVzb2x2ZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vID09PT09PT09PT09PT09PT09PSBVUEdSQURFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1VwZ3JhZGVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICBjb25zdCBob3N0ID0gZ2V0SG9zdENzdHIoZ2V0TmFtZShlbGVtKSk7XG4gICAgICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgaG9zdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpO1xuICAgIFxuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIGhvc3QpXG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIFxuICAgICAgICAvLyBoNGNrXG4gICAgXG4gICAgICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgICAgICBcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuICAgIFxuICAgICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IElOSVRJQUxJWkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gXCJpc0luaXRpYWxpemVkXCIgaW4gZWxlbSAmJiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuYmFzZSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBDT05WRVJTSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhbHVlT2YoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZTogU3RhdGUgPSAwO1xuICAgIFxuICAgICAgICBpZiggdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gREVGSU5FRDtcbiAgICAgICAgaWYoIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICBzdGF0ZSB8PSBSRUFEWTtcbiAgICAgICAgaWYoIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBVUEdSQURFRDtcbiAgICAgICAgaWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcbiAgICBcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiREVGSU5FRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgaXMucHVzaChcIlJFQURZXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJJTklUSUFMSVpFRFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGlzLmpvaW4oJ3wnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmKCBcInN0YXRlXCIgaW4gZWxlbSlcbiAgICAgICAgcmV0dXJuIGVsZW0uc3RhdGUgYXMgTElTU1N0YXRlO1xuICAgIFxuICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLnN0YXRlID0gbmV3IExJU1NTdGF0ZShlbGVtKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IFN0YXRlIG1vZGlmaWVycyAobW92ZT8pID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHbyB0byBzdGF0ZSBVUEdSQURFRFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZ3JhZGU8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5EZWZpbmVkKCk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHIoZ2V0TmFtZShlbGVtKSk7XG5cbiAgICBpZiggISAoZWxlbSBpbnN0YW5jZW9mIEhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGRpZG4ndCB1cGdyYWRlIWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgVDtcbn1cblxuLy8gR28gdG8gc3RhdGUgSU5JVElBTElaRURcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemU8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlIClcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlblJlYWR5KCk7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufFRbXCJwYXJhbXNcIl0gPSBmYWxzZSk6IFQge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UpXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBzdGF0ZS5pc1JlYWR5IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IHt9IDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZShwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PSBleHRlcm5hbCBXSEVOID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCB1cGdyYWRlKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlblVwZ3JhZGVkPFQ+KCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgdHlwZSB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJyxcbiAgICBTRU1JT1BFTj0gJ3NlbWktb3Blbidcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50ID9cbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRGYWN0b3J5PEF0dHJzIGV4dGVuZHMgc3RyaW5nLCBQYXJhbXMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4+ID0gKCAoYXR0cnM6IFJlY29yZDxBdHRycywgbnVsbHxzdHJpbmc+LCBwYXJhbXM6IFBhcmFtcywgZWxlbTpIVE1MRWxlbWVudCkgPT4gTm9kZXx1bmRlZmluZWQgKTtcblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmcsXG4gICAgPiA9IHtcbiAgICAgICAgLy8gSlMgQmFzZVxuICAgICAgICBleHRlbmRzICAgOiBFeHRlbmRzQ3RyLFxuICAgICAgICBwYXJhbXMgICAgOiBQYXJhbXMsXG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGRlcHMgICAgICA6IHJlYWRvbmx5IFByb21pc2U8YW55PltdLFxuXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0cixcbiAgICAgICAgYXR0cnMgIDogcmVhZG9ubHkgQXR0cnNbXSxcbiAgICAgICAgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiByZWFkb25seSBBdHRyc1tdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXRcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgY29udGVudD86IEhUTUxfU291cmNlLFxuICAgICAgICBjb250ZW50X2ZhY3Rvcnk6IChjb250ZW50PzogRXhjbHVkZTxIVE1MX1Jlc291cmNlLCBSZXNwb25zZT4pID0+IENvbnRlbnRGYWN0b3J5PEF0dHJzLCBQYXJhbXM+LFxuICAgICAgICBjc3MgICAgIDogQ1NTX1NvdXJjZSB8IHJlYWRvbmx5IENTU19Tb3VyY2VbXSxcbiAgICAgICAgc2hhZG93ICA6IFNoYWRvd0NmZ1xufVxuXG4vLyBMSVNTQmFzZVxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZUNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBJbnN0YW5jZVR5cGU8TElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBUIGV4dGVuZHMgTElTU0Jhc2U8XG4gICAgICAgICAgICBpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgQixcbiAgICAgICAgICAgIGluZmVyIEMsXG4gICAgICAgICAgICBpbmZlciBEPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0Jhc2VDc3RyPEEsQixDLEQ+IDogbmV2ZXI7XG5cblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHIgPSBMSVNTQmFzZT4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQmFzZSA/IExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyID0gTElTU0Jhc2U+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IEhUTUxDTEFTU19SRUdFWCA9ICAvSFRNTChcXHcrKUVsZW1lbnQvO1xuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG4gICAgY29uc29sZS53YXJuKCdDJywgQ2xhc3MpO1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXHRcblx0bGV0IGh0bWx0YWcgPSBIVE1MQ0xBU1NfUkVHRVguZXhlYyhDbGFzcy5uYW1lKSFbMV07XG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG5leHBvcnQgdHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXJcblxuXG4vLyBtb3ZlZCBoZXJlIGluc3RlYWQgb2YgYnVpbGQgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzLlxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9jb3JlL3N0YXRlXCI7XG5pbXBvcnQgXCIuL2NvcmUvY3VzdG9tUmVnaXN0ZXJ5XCI7XG5cbi8vVE9ETzogQkxJU1NcblxuLy9UT0RPOiBldmVudHMudHNcbi8vVE9ETzogZ2xvYmFsQ1NTUnVsZXNcbmV4cG9ydCB7TElTU0F1dG99wqBmcm9tIFwiLi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5pbXBvcnQgXCIuL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnNcIjtcblxuZXhwb3J0IHtTaGFkb3dDZmd9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCB7bGlzcywgbGlzc1N5bmN9IGZyb20gXCIuL2hlbHBlcnMvYnVpbGRcIjtcbmV4cG9ydCB7ZXZlbnRNYXRjaGVzLCBXaXRoRXZlbnRzLCBFdmVudFRhcmdldDIsIEN1c3RvbUV2ZW50Mn0gZnJvbSAnLi9oZWxwZXJzL2V2ZW50cyc7XG5leHBvcnQge0xJU1NQYXJhbXN9IGZyb20gXCIuL2hlbHBlcnMvTElTU1BhcmFtc1wiO1xuZXhwb3J0IHtodG1sfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IGRlZmF1bHQgTElTUzsiXSwibmFtZXMiOlsiU2hhZG93Q2ZnIiwiYnVpbGRMSVNTSG9zdCIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc1NoYWRvd1N1cHBvcnRlZCIsImh0bWwiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkRFRkFVTFRfQ09OVEVOVF9GQUNUT1JZIiwiY29udGVudCIsInRyaW0iLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiY2xvbmVOb2RlIiwiTElTUyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsInBhcmFtcyIsImRlcHMiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnRfZmFjdG9yeSIsIl9jb250ZW50X2ZhY3RvcnkiLCJjc3MiLCJzaGFkb3ciLCJTRU1JT1BFTiIsIk5PTkUiLCJFcnJvciIsImFsbF9kZXBzIiwiUHJvbWlzZSIsIlJlc3BvbnNlIiwiX2NvbnRlbnQiLCJwdXNoIiwidGV4dCIsIkxJU1NCYXNlIiwiTElTU0NmZyIsInN0eWxlc2hlZXRzIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiYyIsImlkeCIsInByb2Nlc3NfY3NzIiwiY29uc3RydWN0b3IiLCJhcmdzIiwiSG9zdCIsInN0YXRlIiwic2V0QXR0ckRlZmF1bHQiLCJhdHRyIiwidmFsdWUiLCJvbkF0dHJDaGFuZ2VkIiwiX25hbWUiLCJfb2xkVmFsdWUiLCJfbmV3VmFsdWUiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJ1cGRhdGVQYXJhbXMiLCJhc3NpZ24iLCJpc0luRE9NIiwiaXNDb25uZWN0ZWQiLCJvbkRPTUNvbm5lY3RlZCIsImNvbm5lY3RlZENhbGxiYWNrIiwib25ET01EaXNjb25uZWN0ZWQiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsIl9Ib3N0IiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJMSVNTU3RhdGUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImlkIiwic2hhcmVkQ1NTIiwiZ2V0U2hhcmVkQ1NTIiwiTGlzcyIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwid2FpdFJlYWR5IiwiciIsImFsbCIsImlzUmVhZHkiLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJMSVNTSG9zdEJhc2UiLCJCYXNlIiwiYmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwiaW5pdCIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiQ1NTU2VsZWN0b3IiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicHJvbWlzZSIsInJlc29sdmUiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJzaGFkb3dSb290IiwiY29uc29sZSIsIndhcm4iLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJtb2RlIiwiYXR0YWNoU2hhZG93Iiwib2JzIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwiY3Nzc2VsZWN0b3IiLCJoYXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsImlubmVySFRNTCIsInJlcGxhY2UiLCJoZWFkIiwiYXBwZW5kIiwiYWRkIiwib2JqIiwiY2hpbGROb2RlcyIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJkZWZpbmUiLCJnZXRCYXNlQ3N0ciIsImdldEhvc3RDc3RyIiwiZ2V0TmFtZSIsImlzRGVmaW5lZCIsIndoZW5BbGxEZWZpbmVkIiwid2hlbkRlZmluZWQiLCJnZXRTdGF0ZSIsImluaXRpYWxpemVTeW5jIiwidXBncmFkZVN5bmMiLCJ3aGVuVXBncmFkZWQiLCJERUZJTkVEIiwiUkVBRFkiLCJVUEdSQURFRCIsIklOSVRJQUxJWkVEIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiQ2xhc3MiLCJodG1sdGFnIiwiTElTU2NsYXNzIiwib3B0cyIsInRhZ25hbWVzIiwidCIsImVsZW1lbnQiLCJFbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsIl9MSVNTIiwiSUxJU1MiLCJFeHRlbmRlZExJU1MiLCJzY3JpcHQiLCJSRVNTT1VSQ0VTIiwiS25vd25UYWdzIiwiU1ciLCJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwicmVnaXN0ZXIiLCJzY29wZSIsImNvbnRyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50c19kaXIiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkaXRpb24iLCJhZGRlZE5vZGVzIiwiYWRkVGFnIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtIiwidGFnIiwiZmlsZW5hbWVzIiwicmVzb3VyY2VzIiwiZmlsZSIsImZpbGVfcGF0aCIsImVuZHNXaXRoIiwiX2ltcG9ydCIsIl9mZXRjaFRleHQiLCJmaWxlcyIsImkiLCJkZWZpbmVXZWJDb21wb25lbnQiLCJqcyIsImtsYXNzIiwiTElTU0F1dG8iLCJ1cmkiLCJpc0xpc3NBdXRvIiwib3B0aW9ucyIsImhlYWRlcnMiLCJyZXNwb25zZSIsImZldGNoIiwic3RhdHVzIiwiZGVmYXVsdCIsImUiLCJsb2ciLCJzdHIiLCJyZXBsYWNlQWxsIiwic3BhbnMiLCJfYSIsIl9iIiwic3BhbiIsInRleHRDb250ZW50IiwiV2ViQ29tcG9uZW50IiwiY3NzX2F0dHJzIiwiZ2V0QXR0cmlidXRlTmFtZXMiLCJmaWx0ZXIiLCJzdGFydHNXaXRoIiwiY3NzX2F0dHIiLCJzZXRQcm9wZXJ0eSIsInNsaWNlIiwiTElTU1BhcmFtcyIsInAiLCJwYXJlbnRFbGVtZW50Iiwib25WYWx1ZUNoYW5nZWQiLCJ0eXBlIiwiX3BhcnNlQ29udGVudCIsIkpTT04iLCJwYXJzZSIsImtleXMiLCJnZXRBcmdzIiwiRnVuY3Rpb24iLCJjYWxsIiwidmFsdWVzIiwibGlzcyIsIkRvY3VtZW50RnJhZ21lbnQiLCJsaXNzU3luYyIsIkV2ZW50VGFyZ2V0MiIsIkV2ZW50VGFyZ2V0IiwiY2FsbGJhY2siLCJkaXNwYXRjaEV2ZW50IiwiZXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJDdXN0b21FdmVudDIiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIldpdGhFdmVudHMiLCJldiIsIl9ldmVudHMiLCJFdmVudFRhcmdldE1peGlucyIsImV2ZW50TWF0Y2hlcyIsInNlbGVjdG9yIiwiZWxlbWVudHMiLCJjb21wb3NlZFBhdGgiLCJTaGFkb3dSb290IiwicmV2ZXJzZSIsIm1hdGNoZXMiLCJsaXNzX3NlbGVjdG9yIiwiX2J1aWxkUVMiLCJ0YWduYW1lX29yX3BhcmVudCIsInBhcmVudCIsInFzIiwicmVzdWx0IiwicXNvIiwicXNhIiwicHJvbWlzZXMiLCJxc2MiLCJyZXMiLCJjbG9zZXN0IiwicXNTeW5jIiwicXNhU3luYyIsInFzY1N5bmMiLCJyb290IiwiZ2V0Um9vdE5vZGUiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsIlN0YXRlIiwiaXMiLCJpc1VwZ3JhZGVkIiwid2hlbiIsIndoZW5SZWFkeSIsIl93aGVuVXBncmFkZWQiLCJ2YWx1ZU9mIiwidG9TdHJpbmciLCJqb2luIiwic3RyaWN0Iiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImZvcmNlIiwiTGlmZUN5Y2xlIiwiSFRNTENMQVNTX1JFR0VYIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImV4ZWMiLCJDQU5fSEFWRV9TSEFET1ciLCJyZWFkeVN0YXRlIiwic3RyaW5nIiwidGVtcGxhdGUiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIl0sInNvdXJjZVJvb3QiOiIifQ==