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
/* harmony import */ var _LISSHost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LISSHost */ "./src/LISSHost.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _helpers_build__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/build */ "./src/helpers/build.ts");




let __cstr_host = null;
function setCstrHost(_) {
    __cstr_host = _;
}
function DEFAULT_CONTENT_FACTORY(content) {
    if (typeof content === "string") {
        content = content.trim();
        if (content.length === 0) content = undefined;
        if (content !== undefined) content = (0,_helpers_build__WEBPACK_IMPORTED_MODULE_3__.html)`${content}`;
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
content, content_factory: _content_factory = DEFAULT_CONTENT_FACTORY, css, shadow = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host) ? _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.CLOSE : _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.NONE } = {}) {
    if (shadow !== _types__WEBPACK_IMPORTED_MODULE_1__.ShadowCfg.OPEN && !(0,_utils__WEBPACK_IMPORTED_MODULE_2__.isShadowSupported)(host)) throw new Error(`Host element ${(0,_utils__WEBPACK_IMPORTED_MODULE_2__._element2tagname)(host)} does not support ShadowRoot`);
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
            if (this._Host === undefined) this._Host = (0,_LISSHost__WEBPACK_IMPORTED_MODULE_0__.buildLISSHost)(this); //TODO: fix type error (why???)
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
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./src/state.ts");
/* harmony import */ var _LISSBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LISSBase */ "./src/LISSBase.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



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
        await (0,_utils__WEBPACK_IMPORTED_MODULE_2__.waitDOMContentLoaded)();
        await Promise.all(Liss.LISSCfg.deps);
        isReady = true;
        r();
    });
    // No deps and DOM already loaded.
    let isReady = Liss.LISSCfg.deps.length == 0 && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isDOMContentLoaded)();
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
        state = this.state ?? new _state__WEBPACK_IMPORTED_MODULE_0__.LISSState(this);
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
        init() {
            customElements.upgrade(this);
            //TODO: wait parents/children depending on option...
            // shadow
            this.#content = this;
            if (shadow !== 'none') {
                this.#content = this.attachShadow({
                    mode: shadow
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
            (0,_LISSBase__WEBPACK_IMPORTED_MODULE_1__.setCstrHost)(this);
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

/***/ "./src/define.ts":
/*!***********************!*\
  !*** ./src/define.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   define: () => (/* binding */ define),
/* harmony export */   getName: () => (/* binding */ getName)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extends */ "./src/extends.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
// ================================================
// =============== LISS define ====================
// ================================================
//TODO: CustomRegistery + see with state...


function define(tagname, ComponentClass) {
    const Class = ComponentClass.LISSCfg.host;
    let htmltag = (0,_utils__WEBPACK_IMPORTED_MODULE_1__._element2tagname)(Class) ?? undefined;
    const LISSclass = ComponentClass.Host; //buildLISSHost<T>(ComponentClass, params);
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
    customElements.define(tagname, LISSclass, opts);
}
async function whenDefined(tagname, callback) {
    await customElements.whenDefined(tagname);
    if (callback !== undefined) callback();
    return;
}
async function whenAllDefined(tagnames, callback) {
    await Promise.all(tagnames.map((t)=>customElements.whenDefined(t)));
    if (callback !== undefined) callback();
}
function isDefined(name) {
    return customElements.get(name);
}
function getName(element) {
    const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name.includes('-')) throw new Error(`Element ${name} is not a WebComponent`);
    return name;
}
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].define = define;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].whenDefined = whenDefined;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].whenAllDefined = whenAllDefined;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].isDefined = isDefined;
_extends__WEBPACK_IMPORTED_MODULE_0__["default"].getName = getName;


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
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state */ "./src/state.ts");
/* harmony import */ var _build__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./build */ "./src/helpers/build.ts");




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
                const content = (0,_build__WEBPACK_IMPORTED_MODULE_3__.html)`${str}`;
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
        return (0,_state__WEBPACK_IMPORTED_MODULE_2__.define)(tagname, klass);
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
if (customElements.get("liss-auto") === undefined) (0,_state__WEBPACK_IMPORTED_MODULE_2__.define)("liss-auto", LISS_Auto);
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
/* harmony export */   html: () => (/* binding */ html),
/* harmony export */   liss: () => (/* binding */ liss),
/* harmony export */   lissSync: () => (/* binding */ lissSync)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./src/state.ts");

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
async function liss(str, ...args) {
    const elem = html(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return await (0,_state__WEBPACK_IMPORTED_MODULE_0__.initialize)(elem);
}
function lissSync(str, ...args) {
    const elem = html(str, ...args);
    if (elem instanceof DocumentFragment) throw new Error(`Multiple HTMLElement given!`);
    return (0,_state__WEBPACK_IMPORTED_MODULE_0__.initializeSync)(elem);
}
 //async function build<T extends keyof Components>(tagname: T, options?: BUILD_OPTIONS<Components[T]>): Promise<Components[T]>;
 /*
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

/***/ "./src/helpers/querySelectors.ts":
/*!***************************************!*\
  !*** ./src/helpers/querySelectors.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../extends */ "./src/extends.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../state */ "./src/state.ts");
// ================================================
// =============== LISS QuerySelectors ============
// ================================================


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
    return await (0,_state__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(element);
}
async function qsa(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const promises = new Array(elements.length);
    for (let element of elements)promises[idx++] = (0,_state__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(element);
    return await Promise.all(promises);
}
async function qsc(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return await (0,_state__WEBPACK_IMPORTED_MODULE_1__.whenInitialized)(result);
}
function qsSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null) throw new Error(`Element ${selector} not found`);
    return (0,_state__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(element);
}
function qsaSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const result = new Array(elements.length);
    for (let element of elements)result[idx++] = (0,_state__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(element);
    return result;
}
function qscSync(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return (0,_state__WEBPACK_IMPORTED_MODULE_1__.initializeSync)(result);
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
/* harmony export */   define: () => (/* binding */ define),
/* harmony export */   getName: () => (/* binding */ getName),
/* harmony export */   getState: () => (/* binding */ getState),
/* harmony export */   initialize: () => (/* binding */ initialize),
/* harmony export */   initializeSync: () => (/* binding */ initializeSync),
/* harmony export */   upgrade: () => (/* binding */ upgrade),
/* harmony export */   upgradeSync: () => (/* binding */ upgradeSync),
/* harmony export */   whenInitialized: () => (/* binding */ whenInitialized),
/* harmony export */   whenUpgraded: () => (/* binding */ whenUpgraded)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

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
        return customElements.get(getName(this.#elem)) !== undefined;
    }
    async whenDefined() {
        if (this.#elem === null) throw new Error('not implemented');
        return await customElements.whenDefined(getName(this.#elem));
    }
    // ================== READY ==============================
    get isReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const Host = getHostCstrSync(elem);
        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isDOMContentLoaded)()) return false;
        return Host.isDepsResolved;
    }
    async whenReady() {
        if (this.#elem === null) throw new Error('not implemented');
        const elem = this.#elem;
        const host = await this.whenDefined(); // could be ready before defined, but well...
        await _utils__WEBPACK_IMPORTED_MODULE_0__.whenDOMContentLoaded;
        await host.whenDepsResolved;
    }
    // ================== UPGRADED ==============================
    get isUpgraded() {
        if (this.#elem === null) throw new Error("not supported yet");
        const elem = this.#elem;
        if (!this.isDefined) return false;
        const host = getHostCstrSync(elem);
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
    const Host = getHostCstrSync(elem);
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
// Private for now.
function getHostCstrSync(elem) {
    const name = getName(elem);
    const host = customElements.get(name);
    if (host === undefined) throw new Error(`${name} not yet defined!`);
    return host;
}
//TODO: move 2 registery...
function getName(element) {
    const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name.includes('-')) throw new Error(`Element ${name} is not a WebComponent`);
    return name;
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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   html: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_4__.html),
/* harmony export */   liss: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_4__.liss),
/* harmony export */   lissSync: () => (/* reexport safe */ _helpers_build__WEBPACK_IMPORTED_MODULE_4__.lissSync)
/* harmony export */ });
/* harmony import */ var _extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extends */ "./src/extends.ts");
/* harmony import */ var _define__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./define */ "./src/define.ts");
/* harmony import */ var _helpers_querySelectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers/querySelectors */ "./src/helpers/querySelectors.ts");
/* harmony import */ var _helpers_LISSAuto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/LISSAuto */ "./src/helpers/LISSAuto.ts");
/* harmony import */ var _helpers_build__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/build */ "./src/helpers/build.ts");

 //TODO: customRegistery
//TODO: globalCSSRules
//TODO: BLISS
//TODO: LISSParams
//TODO: others...



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_extends__WEBPACK_IMPORTED_MODULE_0__["default"]);

var __webpack_exports__default = __webpack_exports__["default"];
var __webpack_exports__html = __webpack_exports__.html;
var __webpack_exports__liss = __webpack_exports__.liss;
var __webpack_exports__lissSync = __webpack_exports__.lissSync;
export { __webpack_exports__default as default, __webpack_exports__html as html, __webpack_exports__liss as liss, __webpack_exports__lissSync as lissSync };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTJDO0FBQzJGO0FBQ3hFO0FBRXZCO0FBRXZDLElBQUlLLGNBQXFCO0FBRWxCLFNBQVNDLFlBQVlDLENBQU07SUFDakNGLGNBQWNFO0FBQ2Y7QUFFTyxTQUFTQyx3QkFBd0JDLE9BQTBDO0lBRWpGLElBQUksT0FBT0EsWUFBWSxVQUFVO1FBRWhDQSxVQUFVQSxRQUFRQyxJQUFJO1FBQ3RCLElBQUlELFFBQVFFLE1BQU0sS0FBSyxHQUN0QkYsVUFBVUc7UUFFWCxJQUFJSCxZQUFZRyxXQUNmSCxVQUFVTCxvREFBSSxDQUFDLEVBQUVLLFFBQVEsQ0FBQztJQUUzQiwwQkFBMEI7SUFDMUIsbUJBQW1CO0lBQ25CLGdEQUFnRDtJQUMvQyxtQ0FBbUM7SUFDbkMsK0RBQStEO0lBQ2hFLHFGQUFxRjtJQUNyRixtR0FBbUc7SUFDcEc7SUFFQSxJQUFJQSxtQkFBbUJJLHFCQUN0QkosVUFBVUEsUUFBUUEsT0FBTztJQUUxQixPQUFPLElBQU1BLFNBQVNLLFVBQVU7QUFDakM7QUFFTyxTQUFTQyxLQU1kLEVBRUUsVUFBVTtBQUNWQyxTQUFTQyxXQUFXQyxNQUErQixFQUFFLHFDQUFxQyxHQUMxRkMsU0FBb0IsQ0FBQyxDQUEwQixFQUMvQyxjQUFjO0FBQ2RDLE9BQVMsRUFBRSxFQUVYLFlBQVk7QUFDWkMsT0FBUUMsV0FBa0MsRUFDN0NDLHFCQUFxQixFQUFFLEVBQ3BCQyxRQUFRRCxrQkFBa0IsRUFDMUIsY0FBYztBQUNkZCxPQUFPLEVBQ1ZnQixpQkFBaUJDLG1CQUFtQmxCLHVCQUF1QixFQUN4RG1CLEdBQUcsRUFDSEMsU0FBU3pCLHlEQUFpQkEsQ0FBQ2tCLFFBQVFwQiw2Q0FBU0EsQ0FBQzRCLEtBQUssR0FBRzVCLDZDQUFTQSxDQUFDNkIsSUFBSSxFQUNiLEdBQUcsQ0FBQyxDQUFDO0lBRTNELElBQUlGLFdBQVczQiw2Q0FBU0EsQ0FBQzhCLElBQUksSUFBSSxDQUFFNUIseURBQWlCQSxDQUFDa0IsT0FDakQsTUFBTSxJQUFJVyxNQUFNLENBQUMsYUFBYSxFQUFFOUIsd0RBQWdCQSxDQUFDbUIsTUFBTSw0QkFBNEIsQ0FBQztJQUV4RixNQUFNWSxXQUFXO1dBQUliO0tBQUs7SUFFN0IsSUFBSUs7SUFFRCxxQkFBcUI7SUFDckIsSUFBSWhCLG1CQUFtQnlCLFdBQVd6QixtQkFBbUIwQixVQUFXO1FBRWxFLElBQUlDLFdBQWtDM0I7UUFDdENBLFVBQVU7UUFFSndCLFNBQVNJLElBQUksQ0FBRSxDQUFDO1lBRVpELFdBQVcsTUFBTUE7WUFDakIsSUFBSUEsb0JBQW9CRCxVQUNoQ0MsV0FBVyxNQUFNQSxTQUFTRSxJQUFJO1lBRXRCQyxTQUFTQyxPQUFPLENBQUNmLGVBQWUsR0FBR0MsaUJBQWlCVTtRQUN4RDtJQUVKLE9BQU87UUFDVFgsa0JBQWtCQyxpQkFBaUJqQjtJQUNwQztJQUVBLGlCQUFpQjtJQUNqQixJQUFJZ0MsY0FBK0IsRUFBRTtJQUNyQyxJQUFJZCxRQUFRZixXQUFZO1FBRXZCLElBQUksQ0FBRThCLE1BQU1DLE9BQU8sQ0FBQ2hCLE1BQ25CLDJEQUEyRDtRQUMzREEsTUFBTTtZQUFDQTtTQUFJO1FBRVosYUFBYTtRQUNiYyxjQUFjZCxJQUFJaUIsR0FBRyxDQUFFLENBQUNDLEdBQWVDO1lBRXRDLElBQUlELGFBQWFYLFdBQVdXLGFBQWFWLFVBQVU7Z0JBRWxERixTQUFTSSxJQUFJLENBQUUsQ0FBQztvQkFFZlEsSUFBSSxNQUFNQTtvQkFDVixJQUFJQSxhQUFhVixVQUNoQlUsSUFBSSxNQUFNQSxFQUFFUCxJQUFJO29CQUVqQkcsV0FBVyxDQUFDSyxJQUFJLEdBQUdDLFlBQVlGO2dCQUVoQztnQkFFQSxPQUFPO1lBQ1I7WUFFQSxPQUFPRSxZQUFZRjtRQUNwQjtJQUNEO0lBS0EsTUFBTU4saUJBQWlCdEI7UUFFdEIrQixZQUFZLEdBQUdDLElBQVcsQ0FBRTtZQUUzQixLQUFLLElBQUlBO1lBRVQseUNBQXlDO1lBQ3pDLElBQUk1QyxnQkFBZ0IsTUFDbkJBLGNBQWMsSUFBSSxJQUFLLENBQUMyQyxXQUFXLENBQVNFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSTtZQUMxRCxJQUFJLENBQUMsS0FBSyxHQUFHN0M7WUFDYkEsY0FBYztRQUNmO1FBRVMsS0FBSyxDQUFNO1FBRXBCLGVBQWU7UUFDZixPQUFnQm1DLFVBQVU7WUFDekJuQjtZQUNBRDtZQUNBSTtZQUNBTDtZQUNBTTtZQUNBZ0I7WUFDQWI7UUFDRCxFQUFFO1FBRUYsSUFBSXVCLFFBQW1CO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQ0EsS0FBSztRQUN4QjtRQUVBLElBQVc5QixPQUErQjtZQUN6QyxPQUFPLElBQUksQ0FBQyxLQUFLO1FBQ2xCO1FBQ0EsMkJBQTJCO1FBQzNCLElBQWNaLFVBQTZDO1lBQzFELE9BQU8sSUFBSyxDQUFDLEtBQUssQ0FBV0EsT0FBTztRQUNyQztRQUVBLFFBQVE7UUFDUixJQUFjZSxRQUFvQztZQUNqRCxPQUFPLElBQUssQ0FBQyxLQUFLLENBQVdBLEtBQUs7UUFDbkM7UUFDVTRCLGVBQWdCQyxJQUFXLEVBQUVDLEtBQWtCLEVBQUU7WUFDMUQsT0FBTyxJQUFLLENBQUMsS0FBSyxDQUFXRixjQUFjLENBQUNDLE1BQU1DO1FBQ25EO1FBQ1VDLGNBQWNDLEtBQVksRUFDbkNDLFNBQWlCLEVBQ2pCQyxTQUFpQixFQUFjLENBQUM7UUFFakMsc0JBQXNCO1FBQ3RCLElBQWNuQyxxQkFBcUI7WUFDbEMsT0FBTyxJQUFJLENBQUNDLEtBQUs7UUFDbEI7UUFDVW1DLHlCQUF5QixHQUFHVixJQUE2QixFQUFFO1lBQ3BFLElBQUksQ0FBQ00sYUFBYSxJQUFJTjtRQUN2QjtRQUVBLGFBQWE7UUFDYixJQUFXOUIsU0FBMkI7WUFDckMsT0FBTyxJQUFLLENBQUMsS0FBSyxDQUFXQSxNQUFNO1FBQ3BDO1FBQ095QyxhQUFhekMsTUFBdUIsRUFBRTtZQUM1Q0QsT0FBTzJDLE1BQU0sQ0FBRSxJQUFLLENBQUMsS0FBSyxDQUFXMUMsTUFBTSxFQUFFQTtRQUM5QztRQUVBLE1BQU07UUFDTixJQUFXMkMsVUFBbUI7WUFDN0IsT0FBTyxJQUFLLENBQUMsS0FBSyxDQUFXQyxXQUFXO1FBQ3pDO1FBQ1VDLGlCQUFpQjtZQUMxQixJQUFJLENBQUNDLGlCQUFpQjtRQUN2QjtRQUNVQyxvQkFBb0I7WUFDN0IsSUFBSSxDQUFDQyxvQkFBb0I7UUFDMUI7UUFFQSxxQkFBcUI7UUFDWEYsb0JBQW9CLENBQUM7UUFDckJFLHVCQUF1QixDQUFDO1FBQ2xDLElBQVdKLGNBQWM7WUFDeEIsT0FBTyxJQUFJLENBQUNELE9BQU87UUFDcEI7UUFFQSxPQUFlTSxNQUEwQjtRQUV6QyxXQUFXbEIsT0FBTztZQUNqQixJQUFJLElBQUksQ0FBQ2tCLEtBQUssS0FBS3hELFdBQ2xCLElBQUksQ0FBQ3dELEtBQUssR0FBR3BFLHdEQUFhQSxDQUFDLElBQUksR0FBVSwrQkFBK0I7WUFDekUsT0FBTyxJQUFJLENBQUNvRSxLQUFLO1FBQ2xCO0lBQ0Q7SUFFQSxPQUFPN0I7QUFDUjtBQUVBLFNBQVNRLFlBQVlwQixHQUEwQztJQUU5RCxJQUFHQSxlQUFlMEMsZUFDakIsT0FBTzFDO0lBQ1IsSUFBSUEsZUFBZTJDLGtCQUNsQixPQUFPM0MsSUFBSTRDLEtBQUs7SUFFakIsSUFBSUMsUUFBUSxJQUFJSDtJQUNoQixJQUFJLE9BQU8xQyxRQUFRLFVBQVc7UUFDN0I2QyxNQUFNQyxXQUFXLENBQUM5QyxNQUFNLHNCQUFzQjtRQUM5QyxPQUFPNkM7SUFDUjtJQUVBLE1BQU0sSUFBSXhDLE1BQU07QUFDakI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZPaUQ7QUFDUjtBQUU4QztBQUV2RixJQUFJNkMsS0FBSztBQUlULHNCQUFzQjtBQUN0QixNQUFNQyxZQUFZLElBQUlUO0FBRWYsU0FBU3JFLGNBQ2dDK0UsSUFBTztJQUN0RCxNQUFNLEVBQ0wxRCxJQUFJLEVBQ0pHLEtBQUssRUFDTEMsZUFBZSxFQUNmZ0IsV0FBVyxFQUNYYixNQUFNLEVBQ04sR0FBR21ELEtBQUt2QyxPQUFPO0lBVWIsY0FBYztJQUNqQixNQUFNd0MsTUFBTUMsT0FBTztJQUNuQixNQUFNQyxNQUFNRCxPQUFPO0lBRW5CLE1BQU1FLGFBQWFqRSxPQUFPa0UsV0FBVyxDQUFFNUQsTUFBTW9CLEdBQUcsQ0FBQ3lDLENBQUFBLElBQUs7WUFBQ0E7WUFBRztnQkFFekRDLFlBQVk7Z0JBQ1pDLEtBQUs7b0JBQStCLE9BQU8sSUFBSyxDQUEyQlAsSUFBSSxDQUFDSztnQkFBSTtnQkFDcEZHLEtBQUssU0FBU2xDLEtBQWtCO29CQUFJLE9BQU8sSUFBSyxDQUEyQjRCLElBQUksQ0FBQ0csR0FBRy9CO2dCQUFRO1lBQzVGO1NBQUU7SUFFRixNQUFNbUM7UUFHQyxLQUFLLENBQWtDO1FBQ3ZDLFNBQVMsQ0FBOEI7UUFDdkMsT0FBTyxDQUErQztRQUV0RCxDQUFDVCxJQUFJLENBQUNVLElBQVcsRUFBRTtZQUNsQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUNBLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDQSxLQUFLLElBQUk7UUFDcEQ7UUFDQSxDQUFDUixJQUFJLENBQUNRLElBQVcsRUFBRXBDLEtBQWtCLEVBQUM7WUFDckMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDb0MsTUFBTXBDLFFBQVEsdURBQXVEO1FBQzFGO1FBRUFOLFlBQVkyQyxJQUFvQyxFQUNuREMsUUFBb0MsRUFDOUJDLE1BQW1ELENBQUU7WUFFdkQsSUFBSSxDQUFDLEtBQUssR0FBT0Y7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBR0M7WUFDWCxJQUFJLENBQUMsT0FBTyxHQUFHQztZQUVmM0UsT0FBTzRFLGdCQUFnQixDQUFDLElBQUksRUFBRVg7UUFDL0I7SUFDUDtJQUVBLE1BQU1ZLHFCQUFxQixJQUFJQztJQUU1QixNQUFNQyxZQUFZLElBQUkvRCxRQUFlLE9BQU9nRTtRQUV4QyxNQUFNdEIsNERBQW9CQTtRQUMxQixNQUFNMUMsUUFBUWlFLEdBQUcsQ0FBQ3BCLEtBQUt2QyxPQUFPLENBQUNwQixJQUFJO1FBRW5DZ0YsVUFBVTtRQUVWRjtJQUNKO0lBRUEsa0NBQWtDO0lBQ2xDLElBQUlFLFVBQVVyQixLQUFLdkMsT0FBTyxDQUFDcEIsSUFBSSxDQUFDVCxNQUFNLElBQUksS0FBS2dFLDBEQUFrQkE7SUFFcEUsTUFBTXhELFNBQVM0RCxLQUFLdkMsT0FBTyxDQUFDckIsTUFBTSxFQUFFLGtEQUFrRDtJQUV0RixFQUFFO0lBRUYsTUFBTWtGLG1CQUFtQm5FLFFBQVFpRSxHQUFHLENBQUNwQixLQUFLdkMsT0FBTyxDQUFDcEIsSUFBSTtJQUN0RCxJQUFJa0YsaUJBQWlCO0lBQ25CO1FBQ0QsTUFBTUQ7UUFDTkMsaUJBQWlCO0lBQ2xCO0lBRUEsTUFBTUMscUJBQXNCbEY7UUFFM0Isa0NBQWtDO1FBQ3pCOEIsUUFBUSxJQUFLLENBQVNBLEtBQUssSUFBSSxJQUFJdUIsNkNBQVNBLENBQUMsSUFBSSxFQUFFO1FBRTVELCtEQUErRDtRQUUvRCxPQUFnQjJCLG1CQUFtQkEsaUJBQWlCO1FBQ3BELFdBQVdDLGlCQUFpQjtZQUMzQixPQUFPQTtRQUNSO1FBRUEsaUVBQWlFO1FBQ2pFLE9BQU9FLE9BQU96QixLQUFLO1FBRW5CLEtBQUssR0FBYSxLQUFLO1FBQ3ZCLElBQUkwQixPQUFPO1lBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSztRQUNsQjtRQUVBLElBQUlDLGdCQUFnQjtZQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUs7UUFDdkI7UUFDU0MsZ0JBQTBDO1FBQ25ELHlCQUF5QixDQUFDO1FBRTFCQyxXQUFXekYsU0FBMEIsQ0FBQyxDQUFDLEVBQUU7WUFFeEMsSUFBSSxJQUFJLENBQUN1RixhQUFhLEVBQ3JCLE1BQU0sSUFBSTFFLE1BQU07WUFDUixJQUFJLENBQUUsSUFBTSxDQUFDZ0IsV0FBVyxDQUFTc0QsY0FBYyxFQUMzQyxNQUFNLElBQUl0RSxNQUFNO1lBRTdCZCxPQUFPMkMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUxQztZQUU1QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzBGLElBQUk7WUFFdEIsSUFBSSxJQUFJLENBQUM5QyxXQUFXLEVBQ25CLElBQUssQ0FBQyxLQUFLLENBQVNDLGNBQWM7WUFFbkMsT0FBTyxJQUFJLENBQUMsS0FBSztRQUNsQjtRQUVBLG9DQUFvQztRQUMzQixPQUFPLEdBQVc3QyxPQUFPO1FBRWxDLElBQUlBLFNBQWlCO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLE9BQU87UUFDcEI7UUFFYXlDLGFBQWF6QyxNQUFvQyxFQUFFO1lBQy9ELElBQUksSUFBSSxDQUFDdUYsYUFBYSxFQUNULGFBQWE7WUFDekIsT0FBTyxJQUFJLENBQUNELElBQUksQ0FBRTdDLFlBQVksQ0FBQ3pDO1lBRXZCLGlDQUFpQztZQUMxQ0QsT0FBTzJDLE1BQU0sQ0FBRSxJQUFJLENBQUMsT0FBTyxFQUFFMUM7UUFDOUI7UUFDQSxnREFBZ0Q7UUFFaEQsV0FBVyxHQUFHLE1BQU07UUFFcEIsV0FBVyxHQUFXLENBQUMsRUFBZ0M7UUFDdkQsbUJBQW1CLEdBQUcsQ0FBQyxFQUFnQztRQUN2RCxNQUFNLEdBQUcsSUFBSXNFLFdBQ1osSUFBSSxDQUFDLFdBQVcsRUFDaEIsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixDQUFDQyxNQUFhcEM7WUFFYixJQUFJLENBQUMsV0FBVyxDQUFDb0MsS0FBSyxHQUFHcEM7WUFFekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLGlDQUFpQztZQUMxRCxJQUFJQSxVQUFVLE1BQ2IsSUFBSSxDQUFDd0QsZUFBZSxDQUFDcEI7aUJBRXJCLElBQUksQ0FBQ3FCLFlBQVksQ0FBQ3JCLE1BQU1wQztRQUMxQixHQUMwQztRQUUzQ0YsZUFBZXNDLElBQVcsRUFBRXBDLEtBQWtCLEVBQUU7WUFDL0MsSUFBSUEsVUFBVSxNQUNiLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDb0MsS0FBSztpQkFFckMsSUFBSSxDQUFDLG1CQUFtQixDQUFDQSxLQUFLLEdBQUdwQztRQUNuQztRQUVBLElBQUk5QixRQUE4QztZQUVqRCxPQUFPLElBQUksQ0FBQyxNQUFNO1FBQ25CO1FBRUEsNkNBQTZDO1FBRTdDLFFBQVEsR0FBeUIsS0FBSztRQUV0QyxJQUFJZixVQUFVO1lBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUTtRQUNyQjtRQUVBdUcsUUFBUXRCLElBQVksRUFBRTtZQUNyQixPQUFPLElBQUksQ0FBQ3VCLFNBQVMsR0FDakIsSUFBSSxDQUFDLFFBQVEsRUFBRUMsY0FBYyxDQUFDLE9BQU8sRUFBRXhCLEtBQUssQ0FBQyxDQUFDLElBQzlDLElBQUksQ0FBQyxRQUFRLEVBQUV3QixjQUFjLENBQUMsT0FBTyxFQUFFeEIsS0FBSyxFQUFFLENBQUM7UUFDcEQ7UUFDQXlCLFNBQVN6QixJQUFZLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUN1QixTQUFTLEdBQ2pCLElBQUksQ0FBQyxRQUFRLEVBQUVHLGlCQUFpQixDQUFDLE9BQU8sRUFBRTFCLEtBQUssQ0FBQyxDQUFDLElBQ2pELElBQUksQ0FBQyxRQUFRLEVBQUUwQixpQkFBaUIsQ0FBQyxPQUFPLEVBQUUxQixLQUFLLEVBQUUsQ0FBQztRQUN2RDtRQUVBLElBQWN1QixZQUFxQjtZQUNsQyxPQUFPckYsV0FBVztRQUNuQjtRQUVBLFdBQVcsR0FFWCxJQUFJeUYsY0FBYztZQUVqQixJQUFHLElBQUksQ0FBQ0osU0FBUyxJQUFJLENBQUUsSUFBSSxDQUFDSyxZQUFZLENBQUMsT0FDeEMsT0FBTyxJQUFJLENBQUNDLE9BQU87WUFFcEIsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDQSxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQ0MsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFEO1FBRUEsMENBQTBDO1FBRTFDeEUsWUFBWTdCLE1BQVUsRUFBRXNGLElBQXNCLENBQUU7WUFDL0MsS0FBSztZQUVMdkYsT0FBTzJDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFMUM7WUFFNUIsSUFBSSxFQUFDc0csT0FBTyxFQUFFQyxPQUFPLEVBQUMsR0FBR3hGLFFBQVF5RixhQUFhO1lBRTlDLElBQUksQ0FBQ2hCLGVBQWUsR0FBR2M7WUFDdkIsSUFBSSxDQUFDLHlCQUF5QixHQUFHQztZQUVqQyxJQUFJakIsU0FBUzdGLFdBQVc7Z0JBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUc2RjtnQkFDYixJQUFJLENBQUNJLElBQUksSUFBSSxvQkFBb0I7WUFDbEM7WUFFQSxJQUFJLDBCQUEwQixJQUFJLEVBQ2pDLElBQUssQ0FBQ2Usb0JBQW9CO1FBQzVCO1FBRUEsMkRBQTJEO1FBRTNEekQsdUJBQXVCO1lBQ3JCLElBQUksQ0FBQ3NDLElBQUksQ0FBVXZDLGlCQUFpQjtRQUN0QztRQUVBRCxvQkFBb0I7WUFFbkIsMkJBQTJCO1lBQzNCLElBQUksSUFBSSxDQUFDeUMsYUFBYSxFQUFHO2dCQUN4QixJQUFJLENBQUNELElBQUksQ0FBRXpDLGNBQWM7Z0JBQ3pCO1lBQ0Q7WUFFQSwyQkFBMkI7WUFDM0IsSUFBSSxJQUFJLENBQUNiLEtBQUssQ0FBQ2lELE9BQU8sRUFBRztnQkFDeEIsSUFBSSxDQUFDUSxVQUFVLElBQUkscUNBQXFDO2dCQUN4RDtZQUNEO1lBRUU7Z0JBRUQsTUFBTSxJQUFJLENBQUN6RCxLQUFLLENBQUNpRCxPQUFPO2dCQUV4QixJQUFJLENBQUUsSUFBSSxDQUFDTSxhQUFhLEVBQ3ZCLElBQUksQ0FBQ0UsVUFBVTtZQUVqQjtRQUNEO1FBRVFDLE9BQU87WUFFZGdCLGVBQWVDLE9BQU8sQ0FBQyxJQUFJO1lBRWxCLG9EQUFvRDtZQUU3RCxTQUFTO1lBQ1QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJO1lBQ3BCLElBQUlsRyxXQUFXLFFBQVE7Z0JBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDbUcsWUFBWSxDQUFDO29CQUFDQyxNQUFNcEc7Z0JBQU07WUFFL0MsWUFBWTtZQUNaLHdEQUF3RDtZQUN4RCxZQUFZO1lBQ1osMkRBQTJEO1lBQzVEO1lBRUEsUUFBUTtZQUNSLEtBQUksSUFBSXFHLE9BQU96RyxNQUNkLElBQUksQ0FBQyxXQUFXLENBQUN5RyxJQUFhLEdBQUcsSUFBSSxDQUFDVCxZQUFZLENBQUNTO1lBRXBELE1BQU07WUFDTixJQUFJckcsV0FBVyxRQUNkLElBQUssQ0FBQyxRQUFRLENBQWdCc0csa0JBQWtCLENBQUM3RixJQUFJLENBQUN5QztZQUN2RCxJQUFJckMsWUFBWTlCLE1BQU0sRUFBRztnQkFFeEIsSUFBSWlCLFdBQVcsUUFDZCxJQUFLLENBQUMsUUFBUSxDQUFnQnNHLGtCQUFrQixDQUFDN0YsSUFBSSxJQUFJSTtxQkFDckQ7b0JBRUosTUFBTTBGLGNBQWMsSUFBSSxDQUFDZCxXQUFXO29CQUVwQyx3QkFBd0I7b0JBQ3hCLElBQUksQ0FBRXRCLG1CQUFtQnFDLEdBQUcsQ0FBQ0QsY0FBZTt3QkFFM0MsSUFBSTNELFFBQVE2RCxTQUFTQyxhQUFhLENBQUM7d0JBRW5DOUQsTUFBTXVDLFlBQVksQ0FBQyxPQUFPb0I7d0JBRTFCLElBQUlJLG1CQUFtQjt3QkFFdkIsS0FBSSxJQUFJL0QsU0FBUy9CLFlBQ2hCLEtBQUksSUFBSStGLFFBQVFoRSxNQUFNaUUsUUFBUSxDQUM3QkYsb0JBQW9CQyxLQUFLRSxPQUFPLEdBQUc7d0JBRXJDbEUsTUFBTW1FLFNBQVMsR0FBR0osaUJBQWlCSyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRVQsWUFBWSxDQUFDLENBQUM7d0JBRXpFRSxTQUFTUSxJQUFJLENBQUNDLE1BQU0sQ0FBQ3RFO3dCQUVyQnVCLG1CQUFtQmdELEdBQUcsQ0FBQ1o7b0JBQ3hCO2dCQUNEO1lBQ0Q7WUFFQSxVQUFVO1lBQ1YsTUFBTTFILFVBQVVnQixnQkFBZ0IsSUFBSSxDQUFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDTCxNQUFNLEVBQUUsSUFBSTtZQUM3RCxJQUFJVixZQUFZRyxXQUNmLElBQUksQ0FBQyxRQUFRLENBQUNrSSxNQUFNLENBQUVySTtZQUVwQixRQUFRO1lBRVIseUNBQXlDO1lBQzVDSCxzREFBV0EsQ0FBQyxJQUFJO1lBQ2IsSUFBSTBJLE1BQU0sSUFBSSxDQUFDdkMsSUFBSSxLQUFLLE9BQU8sSUFBSTFCLFNBQVMsSUFBSSxDQUFDMEIsSUFBSTtZQUV4RCxJQUFJLENBQUMsS0FBSyxHQUFHdUM7WUFFYixlQUFlO1lBQ2YsSUFBSSxJQUFJLENBQUMvQixTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQ2dDLFVBQVUsQ0FBQ3RJLE1BQU0sS0FBSyxHQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDbUksTUFBTSxDQUFFVCxTQUFTQyxhQUFhLENBQUM7WUFFOUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQzdCLElBQUk7WUFFeEMsT0FBTyxJQUFJLENBQUNBLElBQUk7UUFDakI7UUFJQSxRQUFRO1FBRVIsT0FBT2xGLHFCQUFxQkMsTUFBTTtRQUNsQ21DLHlCQUF5QitCLElBQWUsRUFDakN3RCxRQUFnQixFQUNoQkMsUUFBZ0IsRUFBRTtZQUV4QixJQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUc7Z0JBQ25CO1lBQ0Q7WUFFQSxJQUFJLENBQUMsV0FBVyxDQUFDekQsS0FBSyxHQUFHeUQ7WUFDekIsSUFBSSxDQUFFLElBQUksQ0FBQ3pDLGFBQWEsRUFDdkI7WUFFRCxJQUFJLElBQUssQ0FBQ0QsSUFBSSxDQUFVbEQsYUFBYSxDQUFDbUMsTUFBTXdELFVBQVVDLGNBQWMsT0FBTztnQkFDMUUsSUFBSSxDQUFDLE1BQU0sQ0FBQ3pELEtBQUssR0FBR3dELFVBQVUscUJBQXFCO1lBQ3BEO1FBQ0Q7SUFDRDs7SUFFQSxPQUFPM0M7QUFDUjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDalhBLG1EQUFtRDtBQUNuRCxtREFBbUQ7QUFDbkQsbURBQW1EO0FBRW5ELDJDQUEyQztBQUVkO0FBRWM7QUFZcEMsU0FBUzZDLE9BQ1RDLE9BQXNCLEVBQ3RCQyxjQUFpQjtJQUN2QixNQUFNQyxRQUFTRCxlQUFlOUcsT0FBTyxDQUFDbkIsSUFBSTtJQUMxQyxJQUFJbUksVUFBV3RKLHdEQUFnQkEsQ0FBQ3FKLFVBQVEzSTtJQUV4QyxNQUFNNkksWUFBWUgsZUFBZXBHLElBQUksRUFBRSwyQ0FBMkM7SUFFbEYsTUFBTXdHLE9BQU9GLFlBQVk1SSxZQUFZLENBQUMsSUFDekI7UUFBQ0ksU0FBU3dJO0lBQU87SUFFOUIzQixlQUFldUIsTUFBTSxDQUFDQyxTQUFTSSxXQUFXQztBQUMzQztBQUdBLGVBQWVDLFlBQVlOLE9BQWUsRUFBRU8sUUFBcUI7SUFFaEUsTUFBTS9CLGVBQWU4QixXQUFXLENBQUNOO0lBRWpDLElBQUlPLGFBQWFoSixXQUNoQmdKO0lBRUQ7QUFDRDtBQUNBLGVBQWVDLGVBQWVDLFFBQTJCLEVBQUVGLFFBQXFCO0lBRS9FLE1BQU0xSCxRQUFRaUUsR0FBRyxDQUFFMkQsU0FBU2xILEdBQUcsQ0FBRW1ILENBQUFBLElBQUtsQyxlQUFlOEIsV0FBVyxDQUFDSTtJQUVqRSxJQUFJSCxhQUFhaEosV0FDaEJnSjtBQUVGO0FBRUEsU0FBU0ksVUFBVXRFLElBQVk7SUFDOUIsT0FBT21DLGVBQWV0QyxHQUFHLENBQUNHO0FBQzNCO0FBR08sU0FBU3VFLFFBQVNDLE9BQWdCO0lBRXhDLE1BQU14RSxPQUFPd0UsUUFBUTFDLFlBQVksQ0FBQyxTQUFTMEMsUUFBUTNDLE9BQU8sQ0FBQzRDLFdBQVc7SUFFdEUsSUFBSSxDQUFFekUsS0FBSzBFLFFBQVEsQ0FBQyxNQUNuQixNQUFNLElBQUlwSSxNQUFNLENBQUMsUUFBUSxFQUFFMEQsS0FBSyxzQkFBc0IsQ0FBQztJQUV4RCxPQUFPQTtBQUNSO0FBRUEzRSxnREFBSUEsQ0FBQ3FJLE1BQU0sR0FBV0E7QUFDdEJySSxnREFBSUEsQ0FBQzRJLFdBQVcsR0FBTUE7QUFDdEI1SSxnREFBSUEsQ0FBQzhJLGNBQWMsR0FBR0E7QUFDdEI5SSxnREFBSUEsQ0FBQ2lKLFNBQVMsR0FBUUE7QUFDdEJqSixnREFBSUEsQ0FBQ2tKLE9BQU8sR0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZFbUI7QUFFbEMsTUFBTUs7QUFBTztBQUVwQixpRUFBZXZKLElBQUlBLEVBQXdCO0FBdUJwQyxTQUFTQSxLQUFLMkksSUFBUztJQUUxQixJQUFJQSxLQUFLMUksT0FBTyxLQUFLSixhQUFhLFVBQVU4SSxLQUFLMUksT0FBTyxFQUNwRCxPQUFPQyxTQUFTeUk7SUFFcEIsT0FBT1csK0NBQUtBLENBQUNYO0FBQ2pCO0FBRUEsU0FBU3pJLFNBVzhDeUksSUFBMkQ7SUFFOUcsSUFBSUEsS0FBSzFJLE9BQU8sS0FBS0osV0FDakIsTUFBTSxJQUFJb0IsTUFBTTtJQUVwQixNQUFNeUUsT0FBT2lELEtBQUsxSSxPQUFPLENBQUN3QixPQUFPO0lBRWpDLE1BQU1uQixPQUFPcUksS0FBS3JJLElBQUksSUFBSW9GLEtBQUtwRixJQUFJO0lBRW5DLElBQUlELE9BQU9xRixLQUFLckYsSUFBSTtJQUNwQixJQUFJc0ksS0FBS3RJLElBQUksS0FBS1IsV0FDZFEsT0FBTztXQUFJQTtXQUFTc0ksS0FBS3RJLElBQUk7S0FBQztJQUVsQyxJQUFJSSxRQUFRaUYsS0FBS2pGLEtBQUs7SUFDdEIsSUFBSWtJLEtBQUtsSSxLQUFLLEtBQUtaLFdBQ2ZZLFFBQVE7V0FBSUE7V0FBVWtJLEtBQUtsSSxLQUFLO0tBQUM7SUFFckMsSUFBSUwsU0FBU3NGLEtBQUt0RixNQUFNO0lBQ3hCLElBQUl1SSxLQUFLdkksTUFBTSxLQUFLUCxXQUNoQk8sU0FBU0QsT0FBTzJDLE1BQU0sQ0FBQzFDLFFBQVF1SSxLQUFLdkksTUFBTTtJQUU5QywwREFBMEQ7SUFDMUQsSUFBSU0sa0JBQWtCZ0YsS0FBS2hGLGVBQWU7SUFDMUMsSUFBSWlJLEtBQUtqSixPQUFPLEtBQUtHLFdBQ2pCLGFBQWE7SUFDYmEsa0JBQWtCaUksS0FBS2pJLGVBQWUsQ0FBR2lJLEtBQUtqSixPQUFPO0lBRXpELElBQUlnQyxjQUFjZ0UsS0FBS2hFLFdBQVc7SUFDbEMsSUFBSWlILEtBQUsvSCxHQUFHLEtBQUtmLFdBQ2IsYUFBYTtJQUNiNkIsY0FBYztXQUFJQTtXQUFnQmlILEtBQUsvSCxHQUFHO0tBQUM7SUFFL0MsTUFBTUMsU0FBUzhILEtBQUs5SCxNQUFNLElBQUk2RSxLQUFLN0UsTUFBTTtJQUV6QyxNQUFNMkkscUJBQXFCYixLQUFLMUksT0FBTztRQUVuQyxPQUF5QndCLFVBQVU7WUFDeENuQjtZQUNBRDtZQUNBSTtZQUNBTDtZQUNBTTtZQUNBZ0I7WUFDQWI7UUFDRCxFQUFFO0lBR0E7SUFFQSxPQUFPMkk7QUFDWCxFQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0NBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0lxQztBQUNKO0FBRUQ7QUFDRDtBQUV4QixNQUFNQyxrQkFBa0J6SiwrQ0FBSUEsQ0FBQztJQUNuQ1MsT0FBTztRQUFDO1FBQU87S0FBSztJQUNwQkksUUFBUTNCLDZDQUFTQSxDQUFDNkIsSUFBSTtJQUN0QkgsS0FBSyxDQUFDLHdCQUF3QixDQUFDO0FBQ2hDO0lBRVUsVUFBVSxHQUFHLElBQUlxRSxNQUFjO0lBQy9CLFVBQVUsQ0FBUztJQUNuQixHQUFHLENBQWdCO0lBRTVCaEQsYUFBYztRQUViLEtBQUs7UUFFTCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUlkLFFBQVMsT0FBT3dGO1lBRTlCLE1BQU0rQyxVQUFVQyxhQUFhLENBQUNDLFFBQVEsQ0FBQyxJQUFJLENBQUNuSixLQUFLLENBQUNvSixFQUFFLElBQUksVUFBVTtnQkFBQ0MsT0FBTztZQUFHO1lBRTdFLElBQUlKLFVBQVVDLGFBQWEsQ0FBQ0ksVUFBVSxFQUFHO2dCQUN4Q3BEO2dCQUNBO1lBQ0Q7WUFFQStDLFVBQVVDLGFBQWEsQ0FBQ0ssZ0JBQWdCLENBQUMsb0JBQW9CO2dCQUM1RHJEO1lBQ0Q7UUFDRDtRQUdBLE1BQU1zRCxNQUFNLElBQUksQ0FBQ3hKLEtBQUssQ0FBQ3dKLEdBQUc7UUFDMUIsSUFBR0EsUUFBUSxNQUNWLE1BQU0sSUFBSWhKLE1BQU07UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBR2dKLEdBQUcsQ0FBQyxFQUFFLEtBQUssTUFDckIsQ0FBQyxFQUFFQyxPQUFPQyxRQUFRLENBQUNDLFFBQVEsQ0FBQyxFQUFFSCxJQUFJLENBQUMsR0FDbkNBO1FBRVIsSUFBSUksaUJBQWtCLENBQUNDO1lBRXRCLEtBQUksSUFBSUMsWUFBWUQsVUFDbkIsS0FBSSxJQUFJRSxZQUFZRCxTQUFTRSxVQUFVLENBQ3RDLElBQUdELG9CQUFvQkUsU0FDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQ0YsU0FBU2hFLE9BQU87UUFFakMsR0FBR21FLE9BQU8sQ0FBRXJELFVBQVU7WUFBRXNELFdBQVU7WUFBTUMsU0FBUTtRQUFLO1FBR3JELEtBQUssSUFBSUMsUUFBUXhELFNBQVNqQixnQkFBZ0IsQ0FBQyxLQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDeUUsS0FBS3RFLE9BQU87SUFDM0I7SUFHYXVFLFlBQVk7UUFDeEIsT0FBTztZQUNOO1lBQ0E7WUFDQTtTQUNBO0lBQ0M7SUFFT0MsbUJBQW1CMUMsT0FBZSxFQUFFMkMsS0FBMEIsRUFBRXRDLElBQTZDLEVBQUU7UUFFeEgsTUFBTXVDLEtBQUtELEtBQUssQ0FBQyxXQUFXO1FBQzVCLE1BQU12TCxVQUFVdUwsS0FBSyxDQUFDLGFBQWE7UUFFbkMsSUFBSUUsUUFBdUM7UUFDM0MsSUFBSUQsT0FBT3JMLFdBQ1ZzTCxRQUFRRCxHQUFHdkM7YUFDUCxJQUFJakosWUFBWUcsV0FBWTtZQUUvQjhJLEtBQWFqSSxlQUFlLEdBQUcsQ0FBQzBLO2dCQUVoQyxNQUFNMUwsVUFBVUwsNENBQUksQ0FBQyxFQUFFK0wsSUFBSSxDQUFDO2dCQUU1QixJQUFJQyxRQUFRM0wsUUFBUTJHLGdCQUFnQixDQUFDO2dCQUVyQyxPQUFPLENBQUNpRixJQUFhQyxJQUFZVDtvQkFFaEMsc0JBQXNCO29CQUN0QixLQUFJLElBQUlVLFFBQVFILE1BQ2ZHLEtBQUtDLFdBQVcsR0FBR1gsS0FBS3JFLFlBQVksQ0FBQytFLEtBQUsvRSxZQUFZLENBQUM7b0JBRXhELE9BQU8vRyxRQUFRSyxTQUFTLENBQUM7Z0JBQzFCO1lBRUQ7WUFFQW9MLFFBQVEsTUFBTU8scUJBQXFCMUwsK0NBQUlBLENBQUMySTtZQUFPO1FBQ2hEO1FBRUEsSUFBR3dDLFVBQVUsTUFDWixNQUFNLElBQUlsSyxNQUFNLENBQUMsK0JBQStCLEVBQUVxSCxRQUFRLENBQUMsQ0FBQztRQUU3RCxPQUFPRCw4Q0FBTUEsQ0FBQ0MsU0FBUzZDO0lBQ3hCO0lBRUEsTUFBTSxPQUFPLENBQUM3QyxPQUFlO1FBRTVCQSxVQUFVQSxRQUFRYyxXQUFXO1FBRTdCLElBQUlkLFlBQVksZUFBZUEsWUFBWSxnQkFBZ0IsQ0FBRUEsUUFBUWUsUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQ2hDLEdBQUcsQ0FBRWlCLFVBQzFHO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQ04sR0FBRyxDQUFDTTtRQUVwQixNQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsMEJBQTBCO1FBRTFDLE1BQU1xRCxZQUFZLElBQUksQ0FBQ1osU0FBUztRQUNoQyxNQUFNQSxZQUFZLE1BQU01SixRQUFRaUUsR0FBRyxDQUFFdUcsVUFBVTlKLEdBQUcsQ0FBRStKLENBQUFBLE9BQVFBLEtBQUtDLFFBQVEsQ0FBQyxTQUM3REMsUUFBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUV4RCxRQUFRLENBQUMsRUFBRXNELEtBQUssQ0FBQyxFQUFFLFFBQ3BERyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRXpELFFBQVEsQ0FBQyxFQUFFc0QsS0FBSyxDQUFDLEVBQUU7UUFFakUsTUFBTVgsUUFBNkIsQ0FBQztRQUNwQyxJQUFJLElBQUllLElBQUksR0FBR0EsSUFBSUwsVUFBVS9MLE1BQU0sRUFBRSxFQUFFb00sRUFDdEMsSUFBSWpCLFNBQVMsQ0FBQ2lCLEVBQUUsS0FBS25NLFdBQ3BCb0wsS0FBSyxDQUFDVSxTQUFTLENBQUNLLEVBQUUsQ0FBQyxHQUFHakIsU0FBUyxDQUFDaUIsRUFBRTtRQUVwQyxNQUFNdE0sVUFBVXVMLEtBQUssQ0FBQyxhQUFhO1FBQ25DLE1BQU1ySyxNQUFVcUssS0FBSyxDQUFDLFlBQVk7UUFFbEMsTUFBTXRDLE9BQWdEO1lBQ3JELEdBQUdqSixZQUFZRyxhQUFhO2dCQUFDSDtZQUFPLENBQUM7WUFDckMsR0FBR2tCLFFBQVlmLGFBQWE7Z0JBQUNlO1lBQUcsQ0FBQztRQUNsQztRQUVBLE9BQU8sSUFBSSxDQUFDb0ssa0JBQWtCLENBQUMxQyxTQUFTMkMsT0FBT3RDO0lBRWhEO0FBQ0Q7QUFFQSxpQ0FBaUM7QUFDakMsSUFBSTdCLGVBQWV0QyxHQUFHLENBQUMsaUJBQWlCM0UsV0FDdkN3SSw4Q0FBTUEsQ0FBQyxhQUFhb0I7QUFPckIsbURBQW1EO0FBQ25ELG1EQUFtRDtBQUNuRCxtREFBbUQ7QUFFbkQsZUFBZXNDLFdBQVdFLEdBQWUsRUFBRUMsYUFBc0IsS0FBSztJQUVyRSxNQUFNQyxVQUFVRCxhQUNUO1FBQUNFLFNBQVE7WUFBQyxhQUFhO1FBQU07SUFBQyxJQUM5QixDQUFDO0lBR1IsTUFBTUMsV0FBVyxNQUFNQyxNQUFNTCxLQUFLRTtJQUNsQyxJQUFHRSxTQUFTRSxNQUFNLEtBQUssS0FDdEIsT0FBTzFNO0lBRVIsSUFBSXFNLGNBQWNHLFNBQVNELE9BQU8sQ0FBQzVILEdBQUcsQ0FBQyxjQUFlLE9BQ3JELE9BQU8zRTtJQUVSLE9BQU8sTUFBTXdNLFNBQVM5SyxJQUFJO0FBQzNCO0FBQ0EsZUFBZXVLLFFBQVFHLEdBQVcsRUFBRUMsYUFBc0IsS0FBSztJQUU5RCxpQ0FBaUM7SUFDakMsSUFBR0EsY0FBYyxNQUFNSCxXQUFXRSxLQUFLQyxnQkFBZ0JyTSxXQUN0RCxPQUFPQTtJQUVSLElBQUk7UUFDSCxPQUFPLENBQUMsTUFBTSxNQUFNLENBQUMsdUJBQXVCLEdBQUdvTSxJQUFHLEVBQUdPLE9BQU87SUFDN0QsRUFBRSxPQUFNQyxHQUFHO1FBQ1ZDLFFBQVFDLEdBQUcsQ0FBQ0Y7UUFDWixPQUFPNU07SUFDUjtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoTHNEO0FBRy9DLFNBQVNSLEtBQTZDK0wsR0FBc0IsRUFBRSxHQUFHbEosSUFBVztJQUUvRixJQUFJMkssU0FBU3pCLEdBQUcsQ0FBQyxFQUFFO0lBQ25CLElBQUksSUFBSVksSUFBSSxHQUFHQSxJQUFJOUosS0FBS3RDLE1BQU0sRUFBRSxFQUFFb00sRUFBRztRQUNqQ2EsVUFBVSxDQUFDLEVBQUUzSyxJQUFJLENBQUM4SixFQUFFLENBQUMsQ0FBQztRQUN0QmEsVUFBVSxDQUFDLEVBQUV6QixHQUFHLENBQUNZLElBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkIsMEJBQTBCO0lBQzlCO0lBRUEsb0RBQW9EO0lBQ3BELElBQUljLFdBQVd4RixTQUFTQyxhQUFhLENBQUM7SUFDdEMsdURBQXVEO0lBQ3ZEdUYsU0FBU2xGLFNBQVMsR0FBR2lGLE9BQU9sTixJQUFJO0lBRWhDLElBQUltTixTQUFTcE4sT0FBTyxDQUFDd0ksVUFBVSxDQUFDdEksTUFBTSxLQUFLLEtBQUtrTixTQUFTcE4sT0FBTyxDQUFDcU4sVUFBVSxDQUFFQyxRQUFRLEtBQUtDLEtBQUtDLFNBQVMsRUFDdEcsT0FBT0osU0FBU3BOLE9BQU8sQ0FBQ3FOLFVBQVU7SUFFcEMsT0FBT0QsU0FBU3BOLE9BQU87QUFDM0I7QUFFTyxlQUFleU4sS0FBeUIvQixHQUFzQixFQUFFLEdBQUdsSixJQUFXO0lBRWpGLE1BQU00SSxPQUFPekwsS0FBSytMLFFBQVFsSjtJQUUxQixJQUFJNEksZ0JBQWdCc0Msa0JBQ2xCLE1BQU0sSUFBSW5NLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQztJQUUvQyxPQUFPLE1BQU00RSxrREFBVUEsQ0FBSWlGO0FBQy9CO0FBRU8sU0FBU3VDLFNBQTZCakMsR0FBc0IsRUFBRSxHQUFHbEosSUFBVztJQUUvRSxNQUFNNEksT0FBT3pMLEtBQUsrTCxRQUFRbEo7SUFFMUIsSUFBSTRJLGdCQUFnQnNDLGtCQUNsQixNQUFNLElBQUluTSxNQUFNLENBQUMsMkJBQTJCLENBQUM7SUFFL0MsT0FBTzJMLHNEQUFjQSxDQUFJOUI7QUFDN0I7Q0FvQkEsK0hBQStIO0NBQy9IOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtKQTs7Ozs7Ozs7Ozs7OztBQy9NQSxtREFBbUQ7QUFDbkQsbURBQW1EO0FBQ25ELG1EQUFtRDtBQUVyQjtBQUU2QjtBQXFCM0QsU0FBU3dDLGNBQWMzSSxJQUFhO0lBQ25DLElBQUdBLFNBQVM5RSxXQUNYLE9BQU87SUFDUixPQUFPLENBQUMsSUFBSSxFQUFFOEUsS0FBSyxPQUFPLEVBQUVBLEtBQUssR0FBRyxDQUFDO0FBQ3RDO0FBRUEsU0FBUzRJLFNBQVNDLFFBQWdCLEVBQUVDLGlCQUE4RCxFQUFFQyxTQUE0Q3BHLFFBQVE7SUFFdkosSUFBSW1HLHNCQUFzQjVOLGFBQWEsT0FBTzROLHNCQUFzQixVQUFVO1FBQzdFQyxTQUFTRDtRQUNUQSxvQkFBb0I1TjtJQUNyQjtJQUVBLE9BQU87UUFBQyxDQUFDLEVBQUUyTixTQUFTLEVBQUVGLGNBQWNHLG1CQUF1QyxDQUFDO1FBQUVDO0tBQU87QUFDdEY7QUFPQSxlQUFlQyxHQUF3QkgsUUFBZ0IsRUFDakRDLGlCQUF3RSxFQUN4RUMsU0FBOENwRyxRQUFRO0lBRTNELENBQUNrRyxVQUFVRSxPQUFPLEdBQUdILFNBQVNDLFVBQVVDLG1CQUFtQkM7SUFFM0QsSUFBSUUsU0FBUyxNQUFNQyxJQUFPTCxVQUFVRTtJQUNwQyxJQUFHRSxXQUFXLE1BQ2IsTUFBTSxJQUFJM00sTUFBTSxDQUFDLFFBQVEsRUFBRXVNLFNBQVMsVUFBVSxDQUFDO0lBRWhELE9BQU9JO0FBQ1I7QUFPQSxlQUFlQyxJQUF5QkwsUUFBZ0IsRUFDbERDLGlCQUF3RSxFQUN4RUMsU0FBOENwRyxRQUFRO0lBRTNELENBQUNrRyxVQUFVRSxPQUFPLEdBQUdILFNBQVNDLFVBQVVDLG1CQUFtQkM7SUFFM0QsTUFBTXZFLFVBQVV1RSxPQUFPdkgsYUFBYSxDQUFjcUg7SUFDbEQsSUFBSXJFLFlBQVksTUFDZixPQUFPO0lBRVIsT0FBTyxNQUFNdkQsdURBQWVBLENBQUt1RDtBQUNsQztBQU9BLGVBQWUyRSxJQUF5Qk4sUUFBZ0IsRUFDbERDLGlCQUF3RSxFQUN4RUMsU0FBOENwRyxRQUFRO0lBRTNELENBQUNrRyxVQUFVRSxPQUFPLEdBQUdILFNBQVNDLFVBQVVDLG1CQUFtQkM7SUFFM0QsTUFBTUssV0FBV0wsT0FBT3JILGdCQUFnQixDQUFjbUg7SUFFdEQsSUFBSXpMLE1BQU07SUFDVixNQUFNaU0sV0FBVyxJQUFJck0sTUFBbUJvTSxTQUFTbk8sTUFBTTtJQUN2RCxLQUFJLElBQUl1SixXQUFXNEUsU0FDbEJDLFFBQVEsQ0FBQ2pNLE1BQU0sR0FBRzZELHVEQUFlQSxDQUFLdUQ7SUFFdkMsT0FBTyxNQUFNaEksUUFBUWlFLEdBQUcsQ0FBQzRJO0FBQzFCO0FBT0EsZUFBZUMsSUFBeUJULFFBQWdCLEVBQ2xEQyxpQkFBOEMsRUFDOUN0RSxPQUFtQjtJQUV4QixNQUFNK0UsTUFBTVgsU0FBU0MsVUFBVUMsbUJBQW1CdEU7SUFFbEQsTUFBTXlFLFNBQVMsR0FBSSxDQUFDLEVBQUUsQ0FBd0JPLE9BQU8sQ0FBY0QsR0FBRyxDQUFDLEVBQUU7SUFDekUsSUFBR04sV0FBVyxNQUNiLE9BQU87SUFFUixPQUFPLE1BQU1oSSx1REFBZUEsQ0FBSWdJO0FBQ2pDO0FBT0EsU0FBU1EsT0FBNEJaLFFBQWdCLEVBQy9DQyxpQkFBd0UsRUFDeEVDLFNBQThDcEcsUUFBUTtJQUUzRCxDQUFDa0csVUFBVUUsT0FBTyxHQUFHSCxTQUFTQyxVQUFVQyxtQkFBbUJDO0lBRTNELE1BQU12RSxVQUFVdUUsT0FBT3ZILGFBQWEsQ0FBY3FIO0lBRWxELElBQUlyRSxZQUFZLE1BQ2YsTUFBTSxJQUFJbEksTUFBTSxDQUFDLFFBQVEsRUFBRXVNLFNBQVMsVUFBVSxDQUFDO0lBRWhELE9BQU9aLHNEQUFjQSxDQUFLekQ7QUFDM0I7QUFPQSxTQUFTa0YsUUFBNkJiLFFBQWdCLEVBQ2hEQyxpQkFBd0UsRUFDeEVDLFNBQThDcEcsUUFBUTtJQUUzRCxDQUFDa0csVUFBVUUsT0FBTyxHQUFHSCxTQUFTQyxVQUFVQyxtQkFBbUJDO0lBRTNELE1BQU1LLFdBQVdMLE9BQU9ySCxnQkFBZ0IsQ0FBY21IO0lBRXRELElBQUl6TCxNQUFNO0lBQ1YsTUFBTTZMLFNBQVMsSUFBSWpNLE1BQVVvTSxTQUFTbk8sTUFBTTtJQUM1QyxLQUFJLElBQUl1SixXQUFXNEUsU0FDbEJILE1BQU0sQ0FBQzdMLE1BQU0sR0FBRzZLLHNEQUFjQSxDQUFLekQ7SUFFcEMsT0FBT3lFO0FBQ1I7QUFPQSxTQUFTVSxRQUE2QmQsUUFBZ0IsRUFDaERDLGlCQUE4QyxFQUM5Q3RFLE9BQW1CO0lBRXhCLE1BQU0rRSxNQUFNWCxTQUFTQyxVQUFVQyxtQkFBbUJ0RTtJQUVsRCxNQUFNeUUsU0FBUyxHQUFJLENBQUMsRUFBRSxDQUF3Qk8sT0FBTyxDQUFjRCxHQUFHLENBQUMsRUFBRTtJQUN6RSxJQUFHTixXQUFXLE1BQ2IsT0FBTztJQUVSLE9BQU9oQixzREFBY0EsQ0FBSWdCO0FBQzFCO0FBRUEscUJBQXFCO0FBRXJCLFNBQVNPLFFBQTJCWCxRQUFnQixFQUFFckUsT0FBZ0I7SUFFckUsTUFBTSxLQUFNO1FBQ1gsSUFBSXlFLFNBQVN6RSxRQUFRZ0YsT0FBTyxDQUFJWDtRQUVoQyxJQUFJSSxXQUFXLE1BQ2QsT0FBT0E7UUFFUixNQUFNVyxPQUFPcEYsUUFBUXFGLFdBQVc7UUFDaEMsSUFBSSxDQUFHLFdBQVVELElBQUcsR0FDbkIsT0FBTztRQUVScEYsVUFBVSxLQUFxQjdJLElBQUk7SUFDcEM7QUFDRDtBQUdBLFFBQVE7QUFDUk4sZ0RBQUlBLENBQUMyTixFQUFFLEdBQUlBO0FBQ1gzTixnREFBSUEsQ0FBQzZOLEdBQUcsR0FBR0E7QUFDWDdOLGdEQUFJQSxDQUFDOE4sR0FBRyxHQUFHQTtBQUNYOU4sZ0RBQUlBLENBQUNpTyxHQUFHLEdBQUdBO0FBRVgsT0FBTztBQUNQak8sZ0RBQUlBLENBQUNvTyxNQUFNLEdBQUlBO0FBQ2ZwTyxnREFBSUEsQ0FBQ3FPLE9BQU8sR0FBR0E7QUFDZnJPLGdEQUFJQSxDQUFDc08sT0FBTyxHQUFHQTtBQUVmdE8sZ0RBQUlBLENBQUNtTyxPQUFPLEdBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlNc0U7O1VBRWhGTzs7SUFHRCxRQUFROzs7SUFJUixXQUFXOzs7R0FQVkEsVUFBQUE7QUFZRSxNQUFNQyxZQUE0QjtBQUNsQyxNQUFNQyxVQUEwQjtBQUNoQyxNQUFNQyxhQUE2QjtBQUNuQyxNQUFNQyxnQkFBZ0M7QUFFdEMsTUFBTW5MO0lBRVQsS0FBSyxDQUFtQjtJQUV4Qiw2Q0FBNkM7SUFDN0MxQixZQUFZNkksT0FBeUIsSUFBSSxDQUFFO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUdBO0lBQ2pCO0lBRUEsT0FBTzZELFVBQWNBLFFBQVE7SUFDN0IsT0FBT0MsUUFBY0EsTUFBTTtJQUMzQixPQUFPQyxXQUFjQSxTQUFTO0lBQzlCLE9BQU9DLGNBQWNBLFlBQVk7SUFFakNDLEdBQUczTSxLQUFZLEVBQUU7UUFFYixJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssTUFDZCxNQUFNLElBQUluQixNQUFNO1FBRXBCLE1BQU02SixPQUFPLElBQUksQ0FBQyxLQUFLO1FBRXZCLElBQUkxSSxRQUFRdU0sV0FBZSxDQUFFLElBQUksQ0FBQzFGLFNBQVMsRUFDdkMsT0FBTztRQUNYLElBQUk3RyxRQUFRd00sU0FBZSxDQUFFLElBQUksQ0FBQ3ZKLE9BQU8sRUFDckMsT0FBTztRQUNYLElBQUlqRCxRQUFReU0sWUFBZSxDQUFFLElBQUksQ0FBQ0csVUFBVSxFQUN4QyxPQUFPO1FBQ1gsSUFBSTVNLFFBQVEwTSxlQUFlLENBQUUsSUFBSSxDQUFDbkosYUFBYSxFQUMzQyxPQUFPO1FBRVgsT0FBTztJQUNYO0lBRUEsTUFBTXNKLEtBQUs3TSxLQUFZLEVBQUU7UUFFckIsSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJbkIsTUFBTTtRQUVwQixNQUFNNkosT0FBTyxJQUFJLENBQUMsS0FBSztRQUV2QixJQUFJa0QsV0FBVyxJQUFJck07UUFFbkIsSUFBSVMsUUFBUXVNLFNBQ1JYLFNBQVMxTSxJQUFJLENBQUUsSUFBSSxDQUFDc0gsV0FBVztRQUNuQyxJQUFJeEcsUUFBUXdNLE9BQ1JaLFNBQVMxTSxJQUFJLENBQUUsSUFBSSxDQUFDNE4sU0FBUztRQUNqQyxJQUFJOU0sUUFBUXlNLFVBQ1JiLFNBQVMxTSxJQUFJLENBQUUsSUFBSSxDQUFDNk4sWUFBWTtRQUNwQyxJQUFJL00sUUFBUTBNLGFBQ1JkLFNBQVMxTSxJQUFJLENBQUUsSUFBSSxDQUFDc0UsZUFBZTtRQUV2QyxNQUFNekUsUUFBUWlFLEdBQUcsQ0FBQzRJO0lBQ3RCO0lBRUEsNERBQTREO0lBRTVELElBQUkvRSxZQUFZO1FBQ1osSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJaEksTUFBTTtRQUVwQixPQUFPNkYsZUFBZXRDLEdBQUcsQ0FBRTBFLFFBQVEsSUFBSSxDQUFDLEtBQUssT0FBUXJKO0lBQ3pEO0lBRUEsTUFBTStJLGNBQTREO1FBQzlELElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSTNILE1BQU07UUFFcEIsT0FBTyxNQUFNNkYsZUFBZThCLFdBQVcsQ0FBRU0sUUFBUSxJQUFJLENBQUMsS0FBSztJQUMvRDtJQUVBLDBEQUEwRDtJQUUxRCxJQUFJN0QsVUFBVTtRQUVWLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSXBFLE1BQU07UUFDcEIsTUFBTTZKLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsSUFBSSxDQUFFLElBQUksQ0FBQzdCLFNBQVMsRUFDaEIsT0FBTztRQUVYLE1BQU05RyxPQUFPaU4sZ0JBQWdCdEU7UUFFN0IsSUFBSSxDQUFFbEgsMERBQWtCQSxJQUNwQixPQUFPO1FBRVgsT0FBT3pCLEtBQUtvRCxjQUFjO0lBQzlCO0lBRUEsTUFBTTJKLFlBQVk7UUFFZCxJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssTUFDZCxNQUFNLElBQUlqTyxNQUFNO1FBRXBCLE1BQU02SixPQUFPLElBQUksQ0FBQyxLQUFLO1FBRXZCLE1BQU14SyxPQUFPLE1BQU0sSUFBSSxDQUFDc0ksV0FBVyxJQUFJLDZDQUE2QztRQUVwRixNQUFNNkYsd0RBQW9CQTtRQUUxQixNQUFNbk8sS0FBS2dGLGdCQUFnQjtJQUMvQjtJQUVBLDZEQUE2RDtJQUU3RCxJQUFJMEosYUFBYTtRQUViLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSS9OLE1BQU07UUFDcEIsTUFBTTZKLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsSUFBSSxDQUFFLElBQUksQ0FBQzdCLFNBQVMsRUFDaEIsT0FBTztRQUVYLE1BQU0zSSxPQUFPOE8sZ0JBQWdCdEU7UUFDN0IsT0FBT0EsZ0JBQWdCeEs7SUFDM0I7SUFFQSxNQUFNNk8sZUFBNkQ7UUFFL0QsSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJbE8sTUFBTTtRQUVwQixNQUFNNkosT0FBTyxJQUFJLENBQUMsS0FBSztRQUV2QixNQUFNeEssT0FBTyxNQUFNLElBQUksQ0FBQ3NJLFdBQVc7UUFFbkMsSUFBSWtDLGdCQUFnQnhLLE1BQ2hCLE9BQU93SztRQUVYLE9BQU87UUFFUCxJQUFJLG1CQUFtQkEsTUFBTTtZQUN6QixNQUFNQSxLQUFLdUUsYUFBYTtZQUN4QixPQUFPdkU7UUFDWDtRQUVBLE1BQU0sRUFBQ3BFLE9BQU8sRUFBRUMsT0FBTyxFQUFDLEdBQUd4RixRQUFReUYsYUFBYTtRQUUvQ2tFLEtBQWF1RSxhQUFhLEdBQVUzSTtRQUNwQ29FLEtBQWFqRSxvQkFBb0IsR0FBR0Y7UUFFckMsTUFBTUQ7UUFFTixPQUFPb0U7SUFDWDtJQUVBLGdFQUFnRTtJQUVoRSxJQUFJbkYsZ0JBQWdCO1FBRWhCLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSTFFLE1BQU07UUFDcEIsTUFBTTZKLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsSUFBSSxDQUFFLElBQUksQ0FBQ2tFLFVBQVUsRUFDakIsT0FBTztRQUVYLE9BQU8sbUJBQW1CbEUsUUFBUUEsS0FBS25GLGFBQWE7SUFDeEQ7SUFFQSxNQUFNQyxrQkFBc0M7UUFFeEMsSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJM0UsTUFBTTtRQUNwQixNQUFNNkosT0FBTyxJQUFJLENBQUMsS0FBSztRQUV2QixNQUFNeEssT0FBTyxNQUFNLElBQUksQ0FBQzZPLFlBQVk7UUFFcEMsTUFBTTdPLEtBQUtzRixlQUFlO1FBRTFCLE9BQU8sS0FBc0JGLElBQUk7SUFDckM7SUFFQSxnRUFBZ0U7SUFFaEU0SixVQUFVO1FBRU4sSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJck8sTUFBTTtRQUVwQixJQUFJbUIsUUFBZTtRQUVuQixJQUFJLElBQUksQ0FBQzZHLFNBQVMsRUFDZDdHLFNBQVN1TTtRQUNiLElBQUksSUFBSSxDQUFDdEosT0FBTyxFQUNaakQsU0FBU3dNO1FBQ2IsSUFBSSxJQUFJLENBQUNJLFVBQVUsRUFDZjVNLFNBQVN5TTtRQUNiLElBQUksSUFBSSxDQUFDbEosYUFBYSxFQUNsQnZELFNBQVMwTTtRQUViLE9BQU8xTTtJQUNYO0lBRUFtTixXQUFXO1FBRVAsTUFBTW5OLFFBQVEsSUFBSSxDQUFDa04sT0FBTztRQUMxQixJQUFJUCxLQUFLLElBQUlwTjtRQUViLElBQUlTLFFBQVF1TSxTQUNSSSxHQUFHek4sSUFBSSxDQUFDO1FBQ1osSUFBSWMsUUFBUXdNLE9BQ1JHLEdBQUd6TixJQUFJLENBQUM7UUFDWixJQUFJYyxRQUFReU0sVUFDUkUsR0FBR3pOLElBQUksQ0FBQztRQUNaLElBQUljLFFBQVEwTSxhQUNSQyxHQUFHek4sSUFBSSxDQUFDO1FBRVosT0FBT3lOLEdBQUdTLElBQUksQ0FBQztJQUNuQjtBQUNKO0FBRU8sU0FBU0MsU0FBUzNFLElBQWlCO0lBQ3RDLElBQUksV0FBV0EsTUFDWCxPQUFPQSxLQUFLMUksS0FBSztJQUVyQixPQUFPLEtBQWNBLEtBQUssR0FBRyxJQUFJdUIsVUFBVW1IO0FBQy9DO0FBRUEsNEVBQTRFO0FBRTVFLHNCQUFzQjtBQUNmLFNBQVN6QyxPQUNaQyxPQUFzQixFQUN0QkMsY0FBaUM7SUFFakMsbUJBQW1CO0lBQ25CLElBQUksVUFBVUEsZ0JBQWdCO1FBQzFCQSxpQkFBaUJBLGVBQWU5QyxJQUFJO0lBQ3hDO0lBRUEsTUFBTStDLFFBQVNELGVBQWU5RyxPQUFPLENBQUNuQixJQUFJO0lBQzFDLElBQUltSSxVQUFXdEosd0RBQWdCQSxDQUFDcUosVUFBUTNJO0lBRXhDLE1BQU02SSxZQUFZSCxlQUFlcEcsSUFBSSxFQUFFLDJDQUEyQztJQUVsRixNQUFNd0csT0FBT0YsWUFBWTVJLFlBQVksQ0FBQyxJQUN4QjtRQUFDSSxTQUFTd0k7SUFBTztJQUUvQjNCLGVBQWV1QixNQUFNLENBQUNDLFNBQVNJLFdBQVdDO0FBQzlDO0FBRUEsdUJBQXVCO0FBQ2hCLGVBQWU1QixRQUEwQytELElBQWlCLEVBQUU0RSxTQUFTLEtBQUs7SUFFN0YsTUFBTXROLFFBQVFxTixTQUFTM0U7SUFFdkIsSUFBSTFJLE1BQU00TSxVQUFVLElBQUlVLFFBQ3BCLE1BQU0sSUFBSXpPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUV2QyxNQUFNbUIsTUFBTXdHLFdBQVc7SUFFdkIsT0FBTytHLFlBQWU3RTtBQUMxQjtBQUVPLFNBQVM2RSxZQUE4QzdFLElBQWlCLEVBQUU0RSxTQUFTLEtBQUs7SUFFM0YsTUFBTXROLFFBQVFxTixTQUFTM0U7SUFFdkIsSUFBSTFJLE1BQU00TSxVQUFVLElBQUlVLFFBQ3BCLE1BQU0sSUFBSXpPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUV2QyxJQUFJLENBQUVtQixNQUFNNkcsU0FBUyxFQUNqQixNQUFNLElBQUloSSxNQUFNO0lBRXBCLElBQUk2SixLQUFLOEUsYUFBYSxLQUFLdEksVUFDdkJBLFNBQVN1SSxTQUFTLENBQUMvRTtJQUN2QmhFLGVBQWVDLE9BQU8sQ0FBQytEO0lBRXZCLE1BQU0zSSxPQUFPaU4sZ0JBQWdCdEU7SUFFN0IsSUFBSSxDQUFHQSxDQUFBQSxnQkFBZ0IzSSxJQUFHLEdBQ3RCLE1BQU0sSUFBSWxCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQztJQUU3QyxPQUFPNko7QUFDWDtBQUVBLDBCQUEwQjtBQUVuQixlQUFlakYsV0FBK0JpRixJQUE4QixFQUFFNEUsU0FBOEIsS0FBSztJQUVwSCxNQUFNdE4sUUFBUXFOLFNBQVMzRTtJQUV2QixJQUFJMUksTUFBTXVELGFBQWEsRUFBRztRQUN0QixJQUFJK0osV0FBVyxPQUNYLE9BQU8sS0FBY2hLLElBQUk7UUFDN0IsTUFBTSxJQUFJekUsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQzFDO0lBRUEsTUFBTVgsT0FBTyxNQUFNeUcsUUFBUStEO0lBRTNCLE1BQU0xSSxNQUFNOE0sU0FBUztJQUVyQixJQUFJOU8sU0FBUyxPQUFPc1AsV0FBVyxZQUFZLENBQUMsSUFBSUE7SUFDaERwUCxLQUFLdUYsVUFBVSxDQUFDekY7SUFFaEIsT0FBT0UsS0FBS29GLElBQUk7QUFDcEI7QUFDTyxTQUFTa0gsZUFBbUM5QixJQUE4QixFQUFFNEUsU0FBOEIsS0FBSztJQUVsSCxNQUFNdE4sUUFBUXFOLFNBQVMzRTtJQUN2QixJQUFJMUksTUFBTXVELGFBQWEsRUFBRztRQUN0QixJQUFJK0osV0FBVyxPQUNYLE9BQU8sS0FBY2hLLElBQUk7UUFDN0IsTUFBTSxJQUFJekUsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQzFDO0lBRUEsTUFBTVgsT0FBT3FQLFlBQVk3RTtJQUV6QixJQUFJLENBQUUxSSxNQUFNaUQsT0FBTyxFQUNmLE1BQU0sSUFBSXBFLE1BQU07SUFFcEIsSUFBSWIsU0FBUyxPQUFPc1AsV0FBVyxZQUFZLENBQUMsSUFBSUE7SUFDaERwUCxLQUFLdUYsVUFBVSxDQUFDekY7SUFFaEIsT0FBT0UsS0FBS29GLElBQUk7QUFDcEI7QUFDQSw4RUFBOEU7QUFFdkUsZUFBZXlKLGFBQStDckUsSUFBaUIsRUFBRWdGLFFBQU0sS0FBSyxFQUFFSixTQUFPLEtBQUs7SUFFN0csTUFBTXROLFFBQVFxTixTQUFTM0U7SUFFdkIsSUFBSWdGLE9BQ0EsT0FBTyxNQUFNL0ksUUFBUStELE1BQU00RTtJQUUvQixPQUFPLE1BQU10TixNQUFNK00sWUFBWTtBQUNuQztBQUVPLGVBQWV2SixnQkFBb0NrRixJQUE4QixFQUFFZ0YsUUFBTSxLQUFLLEVBQUVKLFNBQU8sS0FBSztJQUUvRyxNQUFNdE4sUUFBUXFOLFNBQVMzRTtJQUV2QixJQUFJZ0YsT0FDQSxPQUFPLE1BQU1qSyxXQUFXaUYsTUFBTTRFO0lBRWxDLE9BQU8sTUFBTXROLE1BQU13RCxlQUFlO0FBQ3RDO0FBRUEsbUJBQW1CO0FBRW5CLFNBQVN3SixnQkFBc0R0RSxJQUFpQjtJQUU1RSxNQUFNbkcsT0FBT3VFLFFBQVE0QjtJQUNyQixNQUFNeEssT0FBT3dHLGVBQWV0QyxHQUFHLENBQUVHO0lBQ2pDLElBQUlyRSxTQUFTVCxXQUNULE1BQU0sSUFBSW9CLE1BQU0sQ0FBQyxFQUFFMEQsS0FBSyxpQkFBaUIsQ0FBQztJQUM5QyxPQUFPckU7QUFDWDtBQUVBLDJCQUEyQjtBQUNwQixTQUFTNEksUUFBU0MsT0FBZ0I7SUFFeEMsTUFBTXhFLE9BQU93RSxRQUFRMUMsWUFBWSxDQUFDLFNBQVMwQyxRQUFRM0MsT0FBTyxDQUFDNEMsV0FBVztJQUV0RSxJQUFJLENBQUV6RSxLQUFLMEUsUUFBUSxDQUFDLE1BQ25CLE1BQU0sSUFBSXBJLE1BQU0sQ0FBQyxRQUFRLEVBQUUwRCxLQUFLLHNCQUFzQixDQUFDO0lBRXhELE9BQU9BO0FBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDL1dZekY7Ozs7R0FBQUEsY0FBQUE7O1VBT0E2UTs7SUFFWCxzQkFBc0I7OztJQUduQixzQkFBc0I7O0dBTGRBLGNBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJaLDhCQUE4QjtBQUU5QixvQkFBb0I7QUFDcEIsa0ZBQWtGO0FBb0JsRiwyRkFBMkY7QUFDM0YsTUFBTUMsa0JBQW1CO0FBQ3pCLE1BQU1DLHlCQUF5QjtJQUMzQixTQUFTO0lBQ1QsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixZQUFZO0lBQ1osWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixTQUFTO0lBQ1QsYUFBYTtJQUNiLFNBQVM7SUFDVCxPQUFPO0lBQ1AsU0FBUztJQUNULFNBQVM7SUFDVCxXQUFXO0lBQ1gsYUFBYTtJQUNiLFNBQVM7SUFDVCxVQUFVO0FBQ1o7QUFDSyxTQUFTOVEsaUJBQWlCcUosS0FBeUI7SUFFekQsSUFBSUEsVUFBVWpJLGFBQ2IsT0FBTztJQUVSLElBQUlrSSxVQUFVdUgsZ0JBQWdCRSxJQUFJLENBQUMxSCxNQUFNN0QsSUFBSSxDQUFFLENBQUMsRUFBRTtJQUNsRCxPQUFPc0wsc0JBQXNCLENBQUN4SCxRQUErQyxJQUFJQSxRQUFRVyxXQUFXO0FBQ3JHO0FBRUEsd0VBQXdFO0FBQ3hFLE1BQU0rRyxrQkFBa0I7SUFDdkI7SUFBTTtJQUFXO0lBQVM7SUFBYztJQUFRO0lBQ2hEO0lBQVU7SUFBTTtJQUFNO0lBQU07SUFBTTtJQUFNO0lBQU07SUFBVTtJQUN4RDtJQUFPO0lBQUs7SUFBVztDQUV2QjtBQUNNLFNBQVMvUSxrQkFBa0JnUixHQUF1QjtJQUN4RCxPQUFPRCxnQkFBZ0I5RyxRQUFRLENBQUVsSyxpQkFBaUJpUjtBQUNuRDtBQUVPLFNBQVN4TTtJQUNaLE9BQU8wRCxTQUFTK0ksVUFBVSxLQUFLLGlCQUFpQi9JLFNBQVMrSSxVQUFVLEtBQUs7QUFDNUU7QUFFTyxNQUFNNUIsdUJBQXVCNUssdUJBQXVCO0FBRXBELGVBQWVBO0lBQ2xCLElBQUlELHNCQUNBO0lBRUosTUFBTSxFQUFDOEMsT0FBTyxFQUFFQyxPQUFPLEVBQUMsR0FBR3hGLFFBQVF5RixhQUFhO0lBRW5EVSxTQUFTMEMsZ0JBQWdCLENBQUMsb0JBQW9CO1FBQzdDckQ7SUFDRCxHQUFHO0lBRUEsTUFBTUQ7QUFDVjs7Ozs7OztTQ2hGQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFFWCxDQUFDLHVCQUF1QjtBQUMxQyxzQkFBc0I7QUFDdEIsYUFBYTtBQUNiLGtCQUFrQjtBQUNsQixpQkFBaUI7QUFHaUI7QUFDTjtBQUV5QjtBQUNyRCxpRUFBZTFHLGdEQUFJQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZGVmaW5lLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9xdWVyeVNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgQ29udGVudEZhY3RvcnksIENTU19Tb3VyY2UsIEhUTUxfUmVzb3VyY2UsIEhUTUxfU291cmNlLCBMaWZlQ3ljbGUsIExJU1NfT3B0cywgU2hhZG93Q2ZnIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzU2hhZG93U3VwcG9ydGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IExJU1NTdGF0ZSB9IGZyb20gXCJzdGF0ZVwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuL2hlbHBlcnMvYnVpbGRcIjtcblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDc3RySG9zdChfOiBhbnkpIHtcblx0X19jc3RyX2hvc3QgPSBfO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gREVGQVVMVF9DT05URU5UX0ZBQ1RPUlkoY29udGVudD86IEV4Y2x1ZGU8SFRNTF9SZXNvdXJjZSwgUmVzcG9uc2U+KSB7XG5cblx0aWYoIHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XG5cblx0XHRjb250ZW50ID0gY29udGVudC50cmltKCk7XG5cdFx0aWYoIGNvbnRlbnQubGVuZ3RoID09PSAwIClcblx0XHRcdGNvbnRlbnQgPSB1bmRlZmluZWQ7XG5cblx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0Y29udGVudCA9IGh0bWxgJHtjb250ZW50fWA7XG5cblx0XHQvLyBUT0RPIExJU1NBdXRvIHBhcnNlci4uLlxuXHRcdC8vIG9ubHkgaWYgbm8gSlMuLi5cblx0XHQvLyB0b2xlcmF0ZSBub24tb3B0aSAoZWFzaWVyID8pIG9yIHNwYW5bdmFsdWVdID9cblx0XHRcdC8vID0+IHJlY29yZCBlbGVtZW50IHdpdGggdGFyZ2V0Li4uXG5cdFx0XHQvLyA9PiBjbG9uZShhdHRycywgcGFyYW1zKSA9PiBmb3IgZWFjaCBzcGFuIHJlcGxhY2UgdGhlbiBjbG9uZS5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTE4MjI0NC9jb252ZXJ0LWEtc3RyaW5nLXRvLWEtdGVtcGxhdGUtc3RyaW5nXG5cdFx0Ly9sZXQgc3RyID0gKGNvbnRlbnQgYXMgc3RyaW5nKS5yZXBsYWNlKC9cXCRcXHsoLis/KVxcfS9nLCAoXywgbWF0Y2gpID0+IHRoaXMuZ2V0QXR0cmlidXRlKG1hdGNoKT8/JycpXG5cdH1cblxuXHRpZiggY29udGVudCBpbnN0YW5jZW9mIEhUTUxUZW1wbGF0ZUVsZW1lbnQpXG5cdFx0Y29udGVudCA9IGNvbnRlbnQuY29udGVudDtcblxuXHRyZXR1cm4gKCkgPT4gY29udGVudD8uY2xvbmVOb2RlKHRydWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cblx0Ly8gSFRNTCBCYXNlXG5cdEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG5cdEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlciwgLy9zdHJpbmcsXG4+KHtcblxuICAgIC8vIEpTIEJhc2VcbiAgICBleHRlbmRzOiBfZXh0ZW5kcyA9IE9iamVjdCBhcyB1bmtub3duIGFzIEV4dGVuZHNDdHIsIC8qIGV4dGVuZHMgaXMgYSBKUyByZXNlcnZlZCBrZXl3b3JkLiAqL1xuICAgIHBhcmFtcyAgICAgICAgICAgID0ge30gICAgIGFzIHVua25vd24gYXMgUGFyYW1zLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgZGVwcyAgID0gW10sXG5cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBob3N0ICA9IEhUTUxFbGVtZW50IGFzIHVua25vd24gYXMgSG9zdENzdHIsXG5cdG9ic2VydmVkQXR0cmlidXRlcyA9IFtdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG4gICAgYXR0cnMgPSBvYnNlcnZlZEF0dHJpYnV0ZXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBjb250ZW50LFxuXHRjb250ZW50X2ZhY3Rvcnk6IF9jb250ZW50X2ZhY3RvcnkgPSBERUZBVUxUX0NPTlRFTlRfRkFDVE9SWSxcbiAgICBjc3MsXG4gICAgc2hhZG93ID0gaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgPyBTaGFkb3dDZmcuQ0xPU0UgOiBTaGFkb3dDZmcuTk9ORVxufTogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PiA9IHt9KSB7XG5cbiAgICBpZiggc2hhZG93ICE9PSBTaGFkb3dDZmcuT1BFTiAmJiAhIGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0IGVsZW1lbnQgJHtfZWxlbWVudDJ0YWduYW1lKGhvc3QpfSBkb2VzIG5vdCBzdXBwb3J0IFNoYWRvd1Jvb3RgKTtcblxuICAgIGNvbnN0IGFsbF9kZXBzID0gWy4uLmRlcHNdO1xuXG5cdGxldCBjb250ZW50X2ZhY3Rvcnk6IENvbnRlbnRGYWN0b3J5PEF0dHJzLCBQYXJhbXM+O1xuXG4gICAgLy8gY29udGVudCBwcm9jZXNzaW5nXG4gICAgaWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGNvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIHtcbiAgICAgICAgXG5cdFx0bGV0IF9jb250ZW50OiBIVE1MX1NvdXJjZXx1bmRlZmluZWQgPSBjb250ZW50O1xuXHRcdGNvbnRlbnQgPSBudWxsIGFzIHVua25vd24gYXMgc3RyaW5nO1xuXG4gICAgICAgIGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgICAgIF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQ7XG4gICAgICAgICAgICBpZiggX2NvbnRlbnQgaW5zdGFuY2VvZiBSZXNwb25zZSApIC8vIGZyb20gYSBmZXRjaC4uLlxuXHRcdFx0XHRfY29udGVudCA9IGF3YWl0IF9jb250ZW50LnRleHQoKTtcblxuICAgICAgICAgICAgTElTU0Jhc2UuTElTU0NmZy5jb250ZW50X2ZhY3RvcnkgPSBfY29udGVudF9mYWN0b3J5KF9jb250ZW50KTtcbiAgICAgICAgfSkoKSApO1xuXG4gICAgfSBlbHNlIHtcblx0XHRjb250ZW50X2ZhY3RvcnkgPSBfY29udGVudF9mYWN0b3J5KGNvbnRlbnQpO1xuXHR9XG5cblx0Ly8gQ1NTIHByb2Nlc3Npbmdcblx0bGV0IHN0eWxlc2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gPSBbXTtcblx0aWYoIGNzcyAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0aWYoICEgQXJyYXkuaXNBcnJheShjc3MpIClcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiB0b2RvOiBMSVNTT3B0cyA9PiBzaG91bGQgbm90IGJlIGEgZ2VuZXJpYyA/XG5cdFx0XHRjc3MgPSBbY3NzXTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRzdHlsZXNoZWV0cyA9IGNzcy5tYXAoIChjOiBDU1NfU291cmNlLCBpZHg6IG51bWJlcikgPT4ge1xuXG5cdFx0XHRpZiggYyBpbnN0YW5jZW9mIFByb21pc2UgfHwgYyBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG5cblx0XHRcdFx0YWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRcdGMgPSBhd2FpdCBjO1xuXHRcdFx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuXHRcdFx0XHRcdFx0YyA9IGF3YWl0IGMudGV4dCgpO1xuXG5cdFx0XHRcdFx0c3R5bGVzaGVldHNbaWR4XSA9IHByb2Nlc3NfY3NzKGMpO1xuXG5cdFx0XHRcdH0pKCkpO1xuXG5cdFx0XHRcdHJldHVybiBudWxsIGFzIHVua25vd24gYXMgQ1NTU3R5bGVTaGVldDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb2Nlc3NfY3NzKGMpO1xuXHRcdH0pO1xuXHR9XG5cblx0dHlwZSBMSVNTSG9zdDxUPiA9IGFueTsgLy9UT0RPLi4uXG5cdHR5cGUgTEhvc3QgPSBMSVNTSG9zdDxMSVNTQmFzZT47IC8vPC0gY29uZmlnIGluc3RlYWQgb2YgTElTU0Jhc2UgP1xuXG5cdGNsYXNzIExJU1NCYXNlIGV4dGVuZHMgX2V4dGVuZHMge1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gcmVxdWlyZWQgYnkgVFMsIHdlIGRvbid0IHVzZSBpdC4uLlxuXG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdGlmKCBfX2NzdHJfaG9zdCA9PT0gbnVsbCApXG5cdFx0XHRcdF9fY3N0cl9ob3N0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuSG9zdCh7fSwgdGhpcyk7XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IGFueTsgLy8gcHJldmVudHMgaXNzdWUgIzEuLi5cblxuXHRcdC8vIExJU1MgQ29uZmlnc1xuXHRcdHN0YXRpYyByZWFkb25seSBMSVNTQ2ZnID0ge1xuXHRcdFx0aG9zdCxcblx0XHRcdGRlcHMsXG5cdFx0XHRhdHRycyxcblx0XHRcdHBhcmFtcyxcblx0XHRcdGNvbnRlbnRfZmFjdG9yeSxcblx0XHRcdHN0eWxlc2hlZXRzLFxuXHRcdFx0c2hhZG93LFxuXHRcdH07XG5cblx0XHRnZXQgc3RhdGUoKTogTElTU1N0YXRlIHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0LnN0YXRlO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQgaG9zdCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+IHtcblx0XHRcdHJldHVybiB0aGlzLiNob3N0O1xuXHRcdH1cblx0XHQvL1RPRE86IGdldCB0aGUgcmVhbCB0eXBlID9cblx0XHRwcm90ZWN0ZWQgZ2V0IGNvbnRlbnQoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPnxTaGFkb3dSb290IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0Ly8gYXR0cnNcblx0XHRwcm90ZWN0ZWQgZ2V0IGF0dHJzKCk6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBzZXRBdHRyRGVmYXVsdCggYXR0cjogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5zZXRBdHRyRGVmYXVsdChhdHRyLCB2YWx1ZSk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkF0dHJDaGFuZ2VkKF9uYW1lOiBBdHRycyxcblx0XHRcdF9vbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0X25ld1ZhbHVlOiBzdHJpbmcpOiB2b2lkfGZhbHNlIHt9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXQuXG5cdFx0cHJvdGVjdGVkIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzOiBbQXR0cnMsIHN0cmluZywgc3RyaW5nXSkge1xuXHRcdFx0dGhpcy5vbkF0dHJDaGFuZ2VkKC4uLmFyZ3MpO1xuXHRcdH1cblxuXHRcdC8vIHBhcmFtZXRlcnNcblx0XHRwdWJsaWMgZ2V0IHBhcmFtcygpOiBSZWFkb25seTxQYXJhbXM+IHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkucGFyYW1zO1xuXHRcdH1cblx0XHRwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxQYXJhbXM+KSB7XG5cdFx0XHRPYmplY3QuYXNzaWduKCAodGhpcy4jaG9zdCBhcyBMSG9zdCkucGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cblx0XHQvLyBET01cblx0XHRwdWJsaWMgZ2V0IGlzSW5ET00oKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmlzQ29ubmVjdGVkO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01Db25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTURpc2Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cblx0XHQvLyBmb3IgdmFuaWxsYSBjb21wYXRcblx0XHRwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHByb3RlY3RlZCBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHVibGljIGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmlzSW5ET007XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzdGF0aWMgX0hvc3Q6IExJU1NIb3N0PExJU1NCYXNlPjtcblxuXHRcdHN0YXRpYyBnZXQgSG9zdCgpIHtcblx0XHRcdGlmKCB0aGlzLl9Ib3N0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuX0hvc3QgPSBidWlsZExJU1NIb3N0KHRoaXMgYXMgYW55KTsgLy9UT0RPOiBmaXggdHlwZSBlcnJvciAod2h5Pz8/KVxuXHRcdFx0cmV0dXJuIHRoaXMuX0hvc3Q7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzX2Nzcyhjc3M6IHN0cmluZ3xDU1NTdHlsZVNoZWV0fEhUTUxTdHlsZUVsZW1lbnQpIHtcblxuXHRpZihjc3MgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KVxuXHRcdHJldHVybiBjc3M7XG5cdGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuXHRcdHJldHVybiBjc3Muc2hlZXQhO1xuXG5cdGxldCBzdHlsZSA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cdGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuXHRcdHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7IC8vIHJlcGxhY2UoKSBpZiBpc3N1ZXNcblx0XHRyZXR1cm4gc3R5bGU7XG5cdH1cblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IG9jY3Vyc1wiKTtcbn0iLCJpbXBvcnQgeyBMSVNTU3RhdGUsIHVwZ3JhZGVTeW5jIH0gZnJvbSBcIi4vc3RhdGVcIjtcbmltcG9ydCB7IHNldENzdHJIb3N0IH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcbmltcG9ydCB7IExJU1NfT3B0cywgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IENvbXBvc2VDb25zdHJ1Y3RvciwgaXNET01Db250ZW50TG9hZGVkLCB3YWl0RE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCBpZCA9IDA7XG5cbnR5cGUgaW5mZXJMSVNTPFQ+ID0gVCBleHRlbmRzIExJU1NCYXNlQ3N0cjxpbmZlciBBLCBpbmZlciBCLCBpbmZlciBDLCBpbmZlciBEPiA/IFtBLEIsQyxEXSA6IG5ldmVyO1xuXG4vL1RPRE86IHNoYWRvdyB1dGlscyA/XG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMSVNTSG9zdDxcbiAgICAgICAgICAgICAgICAgICAgICAgIFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KExpc3M6IFQpIHtcblx0Y29uc3Qge1xuXHRcdGhvc3QsXG5cdFx0YXR0cnMsXG5cdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdHN0eWxlc2hlZXRzLFxuXHRcdHNoYWRvdyxcblx0fSA9IExpc3MuTElTU0NmZztcblxuXHR0eXBlIFAgPSBpbmZlckxJU1M8VD47XG5cdC8vdHlwZSBFeHRlbmRzQ3N0ciA9IFBbMF07XG5cdHR5cGUgUGFyYW1zICAgICAgPSBQWzFdO1xuXHR0eXBlIEhvc3RDc3RyICAgID0gUFsyXTtcblx0dHlwZSBBdHRycyAgICAgICA9IFBbM107XG5cbiAgICB0eXBlIEhvc3QgICA9IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj47XG5cbiAgICAvLyBhdHRycyBwcm94eVxuXHRjb25zdCBHRVQgPSBTeW1ib2woJ2dldCcpO1xuXHRjb25zdCBTRVQgPSBTeW1ib2woJ3NldCcpO1xuXG5cdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoIGF0dHJzLm1hcChuID0+IFtuLCB7XG5cblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKTogc3RyaW5nfG51bGwgICAgICB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW0dFVF0obik7IH0sXG5cdFx0c2V0OiBmdW5jdGlvbih2YWx1ZTogc3RyaW5nfG51bGwpIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbU0VUXShuLCB2YWx1ZSk7IH1cblx0fV0pICk7XG5cblx0Y2xhc3MgQXR0cmlidXRlcyB7XG4gICAgICAgIFt4OiBzdHJpbmddOiBzdHJpbmd8bnVsbDtcblxuICAgICAgICAjZGF0YSAgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI2RlZmF1bHRzIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNzZXR0ZXIgICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkO1xuXG4gICAgICAgIFtHRVRdKG5hbWU6IEF0dHJzKSB7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI2RhdGFbbmFtZV0gPz8gdGhpcy4jZGVmYXVsdHNbbmFtZV0gPz8gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgW1NFVF0obmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCl7XG4gICAgICAgIFx0cmV0dXJuIHRoaXMuI3NldHRlcihuYW1lLCB2YWx1ZSk7IC8vIHJlcXVpcmVkIHRvIGdldCBhIGNsZWFuIG9iamVjdCB3aGVuIGRvaW5nIHsuLi5hdHRyc31cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGEgICAgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcblx0XHRcdFx0XHRkZWZhdWx0czogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG4gICAgICAgIFx0XHRcdHNldHRlciAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZCkge1xuXG4gICAgICAgIFx0dGhpcy4jZGF0YSAgICAgPSBkYXRhO1xuXHRcdFx0dGhpcy4jZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgXHR0aGlzLiNzZXR0ZXIgPSBzZXR0ZXI7XG5cbiAgICAgICAgXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXHR9XG5cblx0Y29uc3QgYWxyZWFkeURlY2xhcmVkQ1NTID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3Qgd2FpdFJlYWR5ID0gbmV3IFByb21pc2U8dm9pZD4oIGFzeW5jIChyKSA9PiB7XG5cbiAgICAgICAgYXdhaXQgd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXG4gICAgICAgIGlzUmVhZHkgPSB0cnVlO1xuXG4gICAgICAgIHIoKTtcbiAgICB9KTtcblxuICAgIC8vIE5vIGRlcHMgYW5kIERPTSBhbHJlYWR5IGxvYWRlZC5cbiAgICBsZXQgaXNSZWFkeSA9IExpc3MuTElTU0NmZy5kZXBzLmxlbmd0aCA9PSAwICYmIGlzRE9NQ29udGVudExvYWRlZCgpO1xuXG5cdGNvbnN0IHBhcmFtcyA9IExpc3MuTElTU0NmZy5wYXJhbXM7IC8vT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5MSVNTQ2ZnLnBhcmFtcywgX3BhcmFtcyk7XG5cblx0Ly9cblxuXHRjb25zdCB3aGVuRGVwc1Jlc29sdmVkID0gUHJvbWlzZS5hbGwoTGlzcy5MSVNTQ2ZnLmRlcHMpO1xuXHRsZXQgaXNEZXBzUmVzb2x2ZWQgPSBmYWxzZTtcblx0KCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRpc0RlcHNSZXNvbHZlZCA9IHRydWU7XG5cdH0pKCk7XG5cblx0Y2xhc3MgTElTU0hvc3RCYXNlIGV4dGVuZHMgKGhvc3QgYXMgbmV3ICgpID0+IEhUTUxFbGVtZW50KSB7XG5cblx0XHQvLyBhZG9wdCBzdGF0ZSBpZiBhbHJlYWR5IGNyZWF0ZWQuXG5cdFx0cmVhZG9ubHkgc3RhdGUgPSAodGhpcyBhcyBhbnkpLnN0YXRlID8/IG5ldyBMSVNTU3RhdGUodGhpcyk7XG5cblx0XHQvLyA9PT09PT09PT09PT0gREVQRU5ERU5DSUVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRcdHN0YXRpYyByZWFkb25seSB3aGVuRGVwc1Jlc29sdmVkID0gd2hlbkRlcHNSZXNvbHZlZDtcblx0XHRzdGF0aWMgZ2V0IGlzRGVwc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGlzRGVwc1Jlc29sdmVkO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0c3RhdGljIEJhc2UgPSBMaXNzO1xuXG5cdFx0I2Jhc2U6IGFueXxudWxsID0gbnVsbDtcblx0XHRnZXQgYmFzZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNiYXNlO1xuXHRcdH1cblxuXHRcdGdldCBpc0luaXRpYWxpemVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2UgIT09IG51bGw7XG5cdFx0fVxuXHRcdHJlYWRvbmx5IHdoZW5Jbml0aWFsaXplZDogUHJvbWlzZTxJbnN0YW5jZVR5cGU8VD4+O1xuXHRcdCN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXI7XG5cblx0XHRpbml0aWFsaXplKHBhcmFtczogUGFydGlhbDxQYXJhbXM+ID0ge30pIHtcblxuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBhbHJlYWR5IGluaXRpYWxpemVkIScpO1xuICAgICAgICAgICAgaWYoICEgKCB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueSkuaXNEZXBzUmVzb2x2ZWQgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY2llcyBoYXNuJ3QgYmVlbiBsb2FkZWQgIVwiKTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLiNwYXJhbXMsIHBhcmFtcyk7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSB0aGlzLmluaXQoKTtcblxuXHRcdFx0aWYoIHRoaXMuaXNDb25uZWN0ZWQgKVxuXHRcdFx0XHQodGhpcy4jYmFzZSBhcyBhbnkpLm9uRE9NQ29ubmVjdGVkKCk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNiYXNlO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHJlYWRvbmx5ICNwYXJhbXM6IFBhcmFtcyA9IHBhcmFtcztcblxuXHRcdGdldCBwYXJhbXMoKTogUGFyYW1zIHtcblx0XHRcdHJldHVybiB0aGlzLiNwYXJhbXM7XG5cdFx0fVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPExJU1NfT3B0c1tcInBhcmFtc1wiXT4pIHtcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIHRoaXMuYmFzZSEudXBkYXRlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIC8vIHdpbCBiZSBnaXZlbiB0byBjb25zdHJ1Y3Rvci4uLlxuXHRcdFx0T2JqZWN0LmFzc2lnbiggdGhpcy4jcGFyYW1zLCBwYXJhbXMgKTtcblx0XHR9XG5cdFx0Ly8gPT09PT09PT09PT09PT0gQXR0cmlidXRlcyA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjYXR0cnNfZmxhZyA9IGZhbHNlO1xuXG5cdFx0I2F0dHJpYnV0ZXMgICAgICAgICA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRyaWJ1dGVzRGVmYXVsdHMgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cnMgPSBuZXcgQXR0cmlidXRlcyhcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXMsXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHMsXG5cdFx0XHQobmFtZTogQXR0cnMsIHZhbHVlOnN0cmluZ3xudWxsKSA9PiB7XG5cblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSB0cnVlOyAvLyBkbyBub3QgdHJpZ2dlciBvbkF0dHJzQ2hhbmdlZC5cblx0XHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdCkgYXMgdW5rbm93biBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblxuXHRcdHNldEF0dHJEZWZhdWx0KG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0ZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Z2V0IGF0dHJzKCk6IFJlYWRvbmx5PFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+PiB7XG5cblx0XHRcdHJldHVybiB0aGlzLiNhdHRycztcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBDb250ZW50ID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNjb250ZW50OiBIb3N0fFNoYWRvd1Jvb3R8bnVsbCA9IG51bGw7XG5cblx0XHRnZXQgY29udGVudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNjb250ZW50O1xuXHRcdH1cblxuXHRcdGdldFBhcnQobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cdFx0Z2V0UGFydHMobmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5oYXNTaGFkb3dcblx0XHRcdFx0XHQ/IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYDo6cGFydCgke25hbWV9KWApXG5cdFx0XHRcdFx0OiB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGBbcGFydD1cIiR7bmFtZX1cIl1gKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0IGhhc1NoYWRvdygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBzaGFkb3cgIT09ICdub25lJztcblx0XHR9XG5cblx0XHQvKioqIENTUyAqKiovXG5cblx0XHRnZXQgQ1NTU2VsZWN0b3IoKSB7XG5cblx0XHRcdGlmKHRoaXMuaGFzU2hhZG93IHx8ICEgdGhpcy5oYXNBdHRyaWJ1dGUoXCJpc1wiKSApXG5cdFx0XHRcdHJldHVybiB0aGlzLnRhZ05hbWU7XG5cblx0XHRcdHJldHVybiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gSW1wbCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHRjb25zdHJ1Y3RvcihwYXJhbXM6IHt9LCBiYXNlPzogSW5zdGFuY2VUeXBlPFQ+KSB7XG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0bGV0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxJbnN0YW5jZVR5cGU8VD4+KCk7XG5cblx0XHRcdHRoaXMud2hlbkluaXRpYWxpemVkID0gcHJvbWlzZTtcblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlciA9IHJlc29sdmU7XG5cblx0XHRcdGlmKCBiYXNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy4jYmFzZSA9IGJhc2U7XG5cdFx0XHRcdHRoaXMuaW5pdCgpOyAvLyBjYWxsIHRoZSByZXNvbHZlclxuXHRcdFx0fVxuXG5cdFx0XHRpZiggXCJfd2hlblVwZ3JhZGVkUmVzb2x2ZVwiIGluIHRoaXMpXG5cdFx0XHRcdCh0aGlzLl93aGVuVXBncmFkZWRSZXNvbHZlIGFzIGFueSkoKTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09IERPTSA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFx0XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdCh0aGlzLmJhc2UhIGFzIGFueSkub25ET01EaXNjb25uZWN0ZWQoKTtcblx0XHR9XG5cblx0XHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkICkge1xuXHRcdFx0XHR0aGlzLmJhc2UhLm9uRE9NQ29ubmVjdGVkKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogbGlmZSBjeWNsZSBvcHRpb25zXG5cdFx0XHRpZiggdGhpcy5zdGF0ZS5pc1JlYWR5ICkge1xuXHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTsgLy8gYXV0b21hdGljYWxseSBjYWxscyBvbkRPTUNvbm5lY3RlZFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCggYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdGF3YWl0IHRoaXMuc3RhdGUuaXNSZWFkeTtcblxuXHRcdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHR9KSgpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgaW5pdCgpIHtcblx0XHRcdFxuXHRcdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzKTtcblxuICAgICAgICAgICAgLy9UT0RPOiB3YWl0IHBhcmVudHMvY2hpbGRyZW4gZGVwZW5kaW5nIG9uIG9wdGlvbi4uLlxuXHRcdFx0XG5cdFx0XHQvLyBzaGFkb3dcblx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9zdDtcblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJykge1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6IHNoYWRvd30pO1xuXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYXR0cnNcblx0XHRcdGZvcihsZXQgb2JzIG9mIGF0dHJzISlcblx0XHRcdFx0dGhpcy4jYXR0cmlidXRlc1tvYnMgYXMgQXR0cnNdID0gdGhpcy5nZXRBdHRyaWJ1dGUob2JzKTtcblxuXHRcdFx0Ly8gY3NzXG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKHNoYXJlZENTUyk7XG5cdFx0XHRpZiggc3R5bGVzaGVldHMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaCguLi5zdHlsZXNoZWV0cyk7XG5cdFx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdFx0Y29uc3QgY3Nzc2VsZWN0b3IgPSB0aGlzLkNTU1NlbGVjdG9yO1xuXG5cdFx0XHRcdFx0Ly8gaWYgbm90IHlldCBpbnNlcnRlZCA6XG5cdFx0XHRcdFx0aWYoICEgYWxyZWFkeURlY2xhcmVkQ1NTLmhhcyhjc3NzZWxlY3RvcikgKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cblx0XHRcdFx0XHRcdHN0eWxlLnNldEF0dHJpYnV0ZSgnZm9yJywgY3Nzc2VsZWN0b3IpO1xuXG5cdFx0XHRcdFx0XHRsZXQgaHRtbF9zdHlsZXNoZWV0cyA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdGZvcihsZXQgc3R5bGUgb2Ygc3R5bGVzaGVldHMpXG5cdFx0XHRcdFx0XHRcdGZvcihsZXQgcnVsZSBvZiBzdHlsZS5jc3NSdWxlcylcblx0XHRcdFx0XHRcdFx0XHRodG1sX3N0eWxlc2hlZXRzICs9IHJ1bGUuY3NzVGV4dCArICdcXG4nO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBodG1sX3N0eWxlc2hlZXRzLnJlcGxhY2UoJzpob3N0JywgYDppcygke2Nzc3NlbGVjdG9yfSlgKTtcblxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGUpO1xuXG5cdFx0XHRcdFx0XHRhbHJlYWR5RGVjbGFyZWRDU1MuYWRkKGNzc3NlbGVjdG9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY29udGVudFxuXHRcdFx0Y29uc3QgY29udGVudCA9IGNvbnRlbnRfZmFjdG9yeSh0aGlzLmF0dHJzLCB0aGlzLnBhcmFtcywgdGhpcyk7XG5cdFx0XHRpZiggY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggY29udGVudCApO1xuXG5cdCAgICBcdC8vIGJ1aWxkXG5cblx0ICAgIFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdHNldENzdHJIb3N0KHRoaXMpO1xuXHQgICAgXHRsZXQgb2JqID0gdGhpcy5iYXNlID09PSBudWxsID8gbmV3IExpc3MoKSA6IHRoaXMuYmFzZTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdHRoaXMuI3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcih0aGlzLmJhc2UpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlO1xuXHRcdH1cblxuXG5cblx0XHQvLyBhdHRyc1xuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGF0dHJzO1xuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lICAgIDogQXR0cnMsXG5cdFx0XHRcdFx0XHRcdFx0IG9sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdFx0IG5ld1ZhbHVlOiBzdHJpbmcpIHtcblxuXHRcdFx0aWYodGhpcy4jYXR0cnNfZmxhZykge1xuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IG5ld1ZhbHVlO1xuXHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRpZiggKHRoaXMuYmFzZSEgYXMgYW55KS5vbkF0dHJDaGFuZ2VkKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzW25hbWVdID0gb2xkVmFsdWU7IC8vIHJldmVydCB0aGUgY2hhbmdlLlxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gTElTU0hvc3RCYXNlIGFzIENvbXBvc2VDb25zdHJ1Y3Rvcjx0eXBlb2YgTElTU0hvc3RCYXNlLCB0eXBlb2YgaG9zdD47XG59XG5cblxuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBkZWZpbmUgPT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vL1RPRE86IEN1c3RvbVJlZ2lzdGVyeSArIHNlZSB3aXRoIHN0YXRlLi4uXG5cbmltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcbmltcG9ydCB7IExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgZGVmaW5lICAgICA6IHR5cGVvZiBkZWZpbmU7XG5cdFx0d2hlbkRlZmluZWQgICAgOiB0eXBlb2Ygd2hlbkRlZmluZWQ7XG5cdFx0d2hlbkFsbERlZmluZWQgOiB0eXBlb2Ygd2hlbkFsbERlZmluZWQ7XG5cdFx0aXNEZWZpbmVkICAgICAgOiB0eXBlb2YgaXNEZWZpbmVkO1xuXHRcdGdldE5hbWUgICAgICAgIDogdHlwZW9mIGdldE5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuXHRcdFx0XHRcdFx0XHR0YWduYW1lICAgICAgIDogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRDb21wb25lbnRDbGFzczogVCkge1xuXHRjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG5cdGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cblx0Y29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXHRcblx0Y29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG5cdFx0XHRcdFx0XHRcdFx0XHQgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblx0XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuXG5hc3luYyBmdW5jdGlvbiB3aGVuRGVmaW5lZCh0YWduYW1lOiBzdHJpbmcsIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG5cblx0aWYoIGNhbGxiYWNrICE9PSB1bmRlZmluZWQpXG5cdFx0Y2FsbGJhY2soKTtcblxuXHRyZXR1cm47XG59XG5hc3luYyBmdW5jdGlvbiB3aGVuQWxsRGVmaW5lZCh0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10sIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgUHJvbWlzZS5hbGwoIHRhZ25hbWVzLm1hcCggdCA9PiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0KSApIClcblxuXHRpZiggY2FsbGJhY2sgIT09IHVuZGVmaW5lZClcblx0XHRjYWxsYmFjaygpO1xuXG59XG5cbmZ1bmN0aW9uIGlzRGVmaW5lZChuYW1lOiBzdHJpbmcpIHtcblx0cmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldChuYW1lKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudCApOiBzdHJpbmcge1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59XG5cbkxJU1MuZGVmaW5lICAgICAgICAgPSBkZWZpbmU7XG5MSVNTLndoZW5EZWZpbmVkICAgID0gd2hlbkRlZmluZWQ7XG5MSVNTLndoZW5BbGxEZWZpbmVkID0gd2hlbkFsbERlZmluZWQ7XG5MSVNTLmlzRGVmaW5lZCAgICAgID0gaXNEZWZpbmVkO1xuTElTUy5nZXROYW1lICAgICAgICA9IGdldE5hbWU7IiwiaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQge0xJU1MgYXMgX0xJU1N9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBJTElTUyB7fVxuXG5leHBvcnQgZGVmYXVsdCBMSVNTIGFzIHR5cGVvZiBMSVNTICYgSUxJU1M7XG5cbi8vIGV4dGVuZHMgc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcbiAgICBFeHRlbmRzQ3N0cl9CYXNlIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtc19CYXNlICAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIEhvc3RDc3RyX0Jhc2UgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnNfQmFzZSAgICAgICBleHRlbmRzIHN0cmluZyxcblxuICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyPEV4dGVuZHNDc3RyX0Jhc2UsIFBhcmFtc19CYXNlLCBIb3N0Q3N0cl9CYXNlLCBBdHRyc19CYXNlPixcblxuICAgIC8vIFRPRE86IGFkZCBjb25zdHJhaW50cy4uLlxuICAgIFBhcmFtcyAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxuICAgIEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXI+KG9wdHM6IFBhcnRpYWw8TElTU19PcHRzPEJhc2VDc3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+KTogTElTU0Jhc2VDc3RyXG4vLyBMSVNTQmFzZSBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4ob3B0cz86IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4pOiBMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+XG5leHBvcnQgZnVuY3Rpb24gTElTUyhvcHRzOiBhbnkpOiBMSVNTQmFzZUNzdHJcbntcbiAgICBpZiggb3B0cy5leHRlbmRzICE9PSB1bmRlZmluZWQgJiYgXCJIb3N0XCIgaW4gb3B0cy5leHRlbmRzICkgLy8gd2UgYXNzdW1lIHRoaXMgaXMgYSBMSVNTQmFzZUNzdHJcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKG9wdHMpO1xuXG4gICAgcmV0dXJuIF9MSVNTKG9wdHMpO1xufVxuXG5mdW5jdGlvbiBfZXh0ZW5kczxcbiAgICBFeHRlbmRzQ3N0cl9CYXNlIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtc19CYXNlICAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIEhvc3RDc3RyX0Jhc2UgICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnNfQmFzZSAgICAgICBleHRlbmRzIHN0cmluZyxcblxuICAgIEJhc2VDc3RyIGV4dGVuZHMgTElTU0Jhc2VDc3RyPEV4dGVuZHNDc3RyX0Jhc2UsIFBhcmFtc19CYXNlLCBIb3N0Q3N0cl9CYXNlLCBBdHRyc19CYXNlPixcbiAgICBcbiAgICAvLyBUT0RPOiBhZGQgY29uc3RyYWludHMuLi5cbiAgICBQYXJhbXMgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSxcbiAgICBIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyPihvcHRzOiBQYXJ0aWFsPExJU1NfT3B0czxCYXNlQ3N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+Pikge1xuXG4gICAgaWYoIG9wdHMuZXh0ZW5kcyA9PT0gdW5kZWZpbmVkKSAvLyBoNGNrXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHByb3ZpZGUgYSBMSVNTQmFzZSEnKTtcblxuICAgIGNvbnN0IGJhc2UgPSBvcHRzLmV4dGVuZHMuTElTU0NmZztcblxuICAgIGNvbnN0IGhvc3QgPSBvcHRzLmhvc3QgPz8gYmFzZS5ob3N0O1xuXG4gICAgbGV0IGRlcHMgPSBiYXNlLmRlcHM7XG4gICAgaWYoIG9wdHMuZGVwcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBkZXBzID0gWy4uLmRlcHMsIC4uLm9wdHMuZGVwc107XG5cbiAgICBsZXQgYXR0cnMgPSBiYXNlLmF0dHJzIGFzIHJlYWRvbmx5IChBdHRyc3xBdHRyc19CYXNlKVtdO1xuICAgIGlmKCBvcHRzLmF0dHJzICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGF0dHJzID0gWy4uLmF0dHJzLCAuLi5vcHRzLmF0dHJzXTtcblxuICAgIGxldCBwYXJhbXMgPSBiYXNlLnBhcmFtcztcbiAgICBpZiggb3B0cy5wYXJhbXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihwYXJhbXMsIG9wdHMucGFyYW1zKTtcblxuICAgIC8vVE9ETzogaXNzdWVzIHdpdGggYXN5bmMgY29udGVudC9DU1MgKyBzb21lIGVkZ2UgY2FzZXMuLi5cbiAgICBsZXQgY29udGVudF9mYWN0b3J5ID0gYmFzZS5jb250ZW50X2ZhY3RvcnkgYXMgYW55O1xuICAgIGlmKCBvcHRzLmNvbnRlbnQgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29udGVudF9mYWN0b3J5ID0gb3B0cy5jb250ZW50X2ZhY3RvcnkhKCBvcHRzLmNvbnRlbnQgKTtcblxuICAgIGxldCBzdHlsZXNoZWV0cyA9IGJhc2Uuc3R5bGVzaGVldHM7XG4gICAgaWYoIG9wdHMuY3NzICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHN0eWxlc2hlZXRzID0gWy4uLnN0eWxlc2hlZXRzLCAuLi5vcHRzLmNzc107XG5cbiAgICBjb25zdCBzaGFkb3cgPSBvcHRzLnNoYWRvdyA/PyBiYXNlLnNoYWRvdztcblxuICAgIGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIG9wdHMuZXh0ZW5kcyB7XG5cbiAgICAgICAgc3RhdGljIG92ZXJyaWRlIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuICAgICAgICAvL1RPRE86IGZpeCB0eXBlcy4uLlxuICAgIH1cblxuICAgIHJldHVybiBFeHRlbmRlZExJU1M7XG59XG5cbi8qXG5mdW5jdGlvbiBleHRlbmRzTElTUzxFeHRlbmRzIGV4dGVuZHMgQ2xhc3MsXG5cdEhvc3QgICAgZXh0ZW5kcyBIVE1MRWxlbWVudCxcblx0QXR0cnMxICAgZXh0ZW5kcyBzdHJpbmcsXG5cdEF0dHJzMiAgIGV4dGVuZHMgc3RyaW5nLFxuXHRQYXJhbXMgIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+LFxuXHRUIGV4dGVuZHMgTElTU1JldHVyblR5cGU8RXh0ZW5kcywgSG9zdCwgQXR0cnMxLCBQYXJhbXM+PihMaXNzOiBULFxuXHRcdHBhcmFtZXRlcnM6IHtcblx0XHRcdHNoYWRvdyAgICAgID86IFNoYWRvd0NmZyxcblx0XHRcdGF0dHJpYnV0ZXMgID86IHJlYWRvbmx5IEF0dHJzMltdLFxuXHRcdFx0ZGVwZW5kZW5jaWVzPzogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W11cblx0XHR9KSB7XG5cblx0Y29uc3QgYXR0cmlidXRlcyAgID0gWy4uLkxpc3MuUGFyYW1ldGVycy5hdHRyaWJ1dGVzICAsIC4uLnBhcmFtZXRlcnMuYXR0cmlidXRlcyAgPz9bXV07XG5cdGNvbnN0IGRlcGVuZGVuY2llcyA9IFsuLi5MaXNzLlBhcmFtZXRlcnMuZGVwZW5kZW5jaWVzLCAuLi5wYXJhbWV0ZXJzLmRlcGVuZGVuY2llcz8/W11dO1xuXG5cdGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIExpc3MuUGFyYW1ldGVycywge1xuXHRcdGF0dHJpYnV0ZXMsXG5cdFx0ZGVwZW5kZW5jaWVzXG5cdH0pO1xuXHRpZiggcGFyYW1ldGVycy5zaGFkb3cgIT09IHVuZGVmaW5lZClcblx0XHRwYXJhbXMuc2hhZG93ID0gcGFyYW1ldGVycy5zaGFkb3c7XG5cblx0Ly8gQHRzLWlnbm9yZSA6IGJlY2F1c2UgVFMgc3R1cGlkXG5cdGNsYXNzIEV4dGVuZGVkTElTUyBleHRlbmRzIExpc3Mge1xuXHRcdGNvbnN0cnVjdG9yKC4uLnQ6IGFueVtdKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlIDogYmVjYXVzZSBUUyBzdHVwaWRcblx0XHRcdHN1cGVyKC4uLnQpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBvdmVycmlkZSBnZXQgYXR0cnMoKSB7XG5cdFx0XHRyZXR1cm4gc3VwZXIuYXR0cnMgYXMgUmVjb3JkPEF0dHJzMnxBdHRyczEsIHN0cmluZ3xudWxsPjtcblx0XHR9XG5cblx0XHRzdGF0aWMgb3ZlcnJpZGUgUGFyYW1ldGVycyA9IHBhcmFtcztcblx0fVxuXG5cdHJldHVybiBFeHRlbmRlZExJU1M7XG59XG5MSVNTLmV4dGVuZHNMSVNTID0gZXh0ZW5kc0xJU1M7XG4qLyIsImltcG9ydCB7IFNoYWRvd0NmZyB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTfSBmcm9tIFwiLi4vTElTU0Jhc2VcIjtcblxuaW1wb3J0IHtkZWZpbmV9IGZyb20gXCIuLi9zdGF0ZVwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuL2J1aWxkXCI7XG5cbmV4cG9ydCBjbGFzcyBMSVNTX0F1dG8gZXh0ZW5kcyBMSVNTKHtcblx0YXR0cnM6IFtcInNyY1wiLCBcInN3XCJdLFxuXHRzaGFkb3c6IFNoYWRvd0NmZy5OT05FLFxuXHRjc3M6IGA6aG9zdCB7IGRpc3BsYXk6IG5vbmU7IH1gXG59KSB7XG5cblx0cmVhZG9ubHkgI2tub3duX3RhZyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXHRyZWFkb25seSAjZGlyZWN0b3J5OiBzdHJpbmc7XG5cdHJlYWRvbmx5ICNzdzogUHJvbWlzZTx2b2lkPjtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLiNzdyA9IG5ldyBQcm9taXNlKCBhc3luYyAocmVzb2x2ZSkgPT4ge1xuXHRcdFx0XG5cdFx0XHRhd2FpdCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3Rlcih0aGlzLmF0dHJzLnN3ID8/IFwiL3N3LmpzXCIsIHtzY29wZTogXCIvXCJ9KTtcblxuXHRcdFx0aWYoIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgKSB7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXG5cdFx0Y29uc3Qgc3JjID0gdGhpcy5hdHRycy5zcmM7XG5cdFx0aWYoc3JjID09PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwic3JjIGF0dHJpYnV0ZSBpcyBtaXNzaW5nLlwiKTtcblx0XHR0aGlzLiNkaXJlY3RvcnkgPSBzcmNbMF0gPT09ICcuJ1xuXHRcdFx0XHRcdFx0XHRcdD8gYCR7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfSR7c3JjfWBcblx0XHRcdFx0XHRcdFx0XHQ6IHNyYztcblxuXHRcdG5ldyBNdXRhdGlvbk9ic2VydmVyKCAobXV0YXRpb25zKSA9PiB7XG5cblx0XHRcdGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKVxuXHRcdFx0XHRmb3IobGV0IGFkZGl0aW9uIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpXG5cdFx0XHRcdFx0aWYoYWRkaXRpb24gaW5zdGFuY2VvZiBFbGVtZW50KVxuXHRcdFx0XHRcdFx0dGhpcy4jYWRkVGFnKGFkZGl0aW9uLnRhZ05hbWUpXG5cblx0XHR9KS5vYnNlcnZlKCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6dHJ1ZSwgc3VidHJlZTp0cnVlIH0pO1xuXG5cblx0XHRmb3IoIGxldCBlbGVtIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIqXCIpIClcblx0XHRcdHRoaXMuI2FkZFRhZyhlbGVtLnRhZ05hbWUpO1xuXHR9XG5cblxuICAgIHByb3RlY3RlZCByZXNvdXJjZXMoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdFwiaW5kZXguanNcIixcblx0XHRcdFwiaW5kZXguaHRtbFwiLFxuXHRcdFx0XCJpbmRleC5jc3NcIlxuXHRcdF07XG4gICAgfVxuXG5cdHByb3RlY3RlZCBkZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZTogc3RyaW5nLCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55Piwgb3B0czogUGFydGlhbDx7Y29udGVudDogc3RyaW5nLCBjc3M6IHN0cmluZ30+KSB7XG5cblx0XHRjb25zdCBqcyA9IGZpbGVzW1wiaW5kZXguanNcIl07XG5cdFx0Y29uc3QgY29udGVudCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblxuXHRcdGxldCBrbGFzczogbnVsbHwgUmV0dXJuVHlwZTx0eXBlb2YgTElTUz4gPSBudWxsO1xuXHRcdGlmKCBqcyAhPT0gdW5kZWZpbmVkIClcblx0XHRcdGtsYXNzID0ganMob3B0cyk7XG5cdFx0ZWxzZSBpZiggY29udGVudCAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHQob3B0cyBhcyBhbnkpLmNvbnRlbnRfZmFjdG9yeSA9IChzdHI6IHN0cmluZykgPT4ge1xuXG5cdFx0XHRcdGNvbnN0IGNvbnRlbnQgPSBodG1sYCR7c3RyfWA7XG5cblx0XHRcdFx0bGV0IHNwYW5zID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaXNzW3ZhbHVlXScpO1xuXG5cdFx0XHRcdHJldHVybiAoX2E6IHVua25vd24sIF9iOnVua25vd24sIGVsZW06IEhUTUxFbGVtZW50KSA9PiB7XG5cblx0XHRcdFx0XHQvLyBjYW4gYmUgb3B0aW1pemVkLi4uXG5cdFx0XHRcdFx0Zm9yKGxldCBzcGFuIG9mIHNwYW5zKVxuXHRcdFx0XHRcdFx0c3Bhbi50ZXh0Q29udGVudCA9IGVsZW0uZ2V0QXR0cmlidXRlKHNwYW4uZ2V0QXR0cmlidXRlKCd2YWx1ZScpISlcblxuXHRcdFx0XHRcdHJldHVybiBjb250ZW50LmNsb25lTm9kZSh0cnVlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0fTtcblxuXHRcdFx0a2xhc3MgPSBjbGFzcyBXZWJDb21wb25lbnQgZXh0ZW5kcyBMSVNTKG9wdHMpIHt9O1xuXHRcdH1cblxuXHRcdGlmKGtsYXNzID09PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGZpbGVzIGZvciBXZWJDb21wb25lbnQgJHt0YWduYW1lfS5gKTtcblxuXHRcdHJldHVybiBkZWZpbmUodGFnbmFtZSwga2xhc3MpO1xuXHR9XG5cblx0YXN5bmMgI2FkZFRhZyh0YWduYW1lOiBzdHJpbmcpIHtcblxuXHRcdHRhZ25hbWUgPSB0YWduYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiggdGFnbmFtZSA9PT0gJ2xpc3MtYXV0bycgfHwgdGFnbmFtZSA9PT0gJ2JsaXNzLWF1dG8nIHx8ICEgdGFnbmFtZS5pbmNsdWRlcygnLScpIHx8IHRoaXMuI2tub3duX3RhZy5oYXMoIHRhZ25hbWUgKSApXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLiNrbm93bl90YWcuYWRkKHRhZ25hbWUpO1xuXG5cdFx0YXdhaXQgdGhpcy4jc3c7IC8vIGVuc3VyZSBTVyBpcyBpbnN0YWxsZWQuXG5cblx0XHRjb25zdCBmaWxlbmFtZXMgPSB0aGlzLnJlc291cmNlcygpO1xuXHRcdGNvbnN0IHJlc291cmNlcyA9IGF3YWl0IFByb21pc2UuYWxsKCBmaWxlbmFtZXMubWFwKCBmaWxlID0+IGZpbGUuZW5kc1dpdGgoJy5qcycpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdD8gX2ltcG9ydCAgIChgJHt0aGlzLiNkaXJlY3Rvcnl9LyR7dGFnbmFtZX0vJHtmaWxlfWAsIHRydWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDogX2ZldGNoVGV4dChgJHt0aGlzLiNkaXJlY3Rvcnl9LyR7dGFnbmFtZX0vJHtmaWxlfWAsIHRydWUpICkgKTtcblxuXHRcdGNvbnN0IGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGZpbGVuYW1lcy5sZW5ndGg7ICsraSlcblx0XHRcdGlmKCByZXNvdXJjZXNbaV0gIT09IHVuZGVmaW5lZClcblx0XHRcdFx0ZmlsZXNbZmlsZW5hbWVzW2ldXSA9IHJlc291cmNlc1tpXTtcblxuXHRcdGNvbnN0IGNvbnRlbnQgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cdFx0Y29uc3QgY3NzICAgICA9IGZpbGVzW1wiaW5kZXguY3NzXCJdO1xuXG5cdFx0Y29uc3Qgb3B0czogUGFydGlhbDx7Y29udGVudDogc3RyaW5nLCBjc3M6IHN0cmluZ30+ID0ge1xuXHRcdFx0Li4uY29udGVudCAhPT0gdW5kZWZpbmVkICYmIHtjb250ZW50fSxcblx0XHRcdC4uLmNzcyAgICAgIT09IHVuZGVmaW5lZCAmJiB7Y3NzfSxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoaXMuZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWUsIGZpbGVzLCBvcHRzKTtcblx0XHRcblx0fVxufVxuXG4vLyBwcmV2ZW50cyBtdWx0aS1kZWNsYXJhdGlvbnMuLi5cbmlmKCBjdXN0b21FbGVtZW50cy5nZXQoXCJsaXNzLWF1dG9cIikgPT09IHVuZGVmaW5lZClcblx0ZGVmaW5lKFwibGlzcy1hdXRvXCIsIExJU1NfQXV0byk7XG5cbi8vVE9ETzogZml4Li4uXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudHMge1xuXHRcImxpc3MtYXV0b1wiOiBMSVNTX0F1dG9cbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgaW50ZXJuYWwgdG9vbHMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoVGV4dCh1cmk6IHN0cmluZ3xVUkwsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdGNvbnN0IG9wdGlvbnMgPSBpc0xpc3NBdXRvXG5cdFx0XHRcdFx0XHQ/IHtoZWFkZXJzOntcImxpc3MtYXV0b1wiOiBcInRydWVcIn19XG5cdFx0XHRcdFx0XHQ6IHt9O1xuXG5cblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmksIG9wdGlvbnMpO1xuXHRpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRpZiggaXNMaXNzQXV0byAmJiByZXNwb25zZS5oZWFkZXJzLmdldChcInN0YXR1c1wiKSEgPT09IFwiNDA0XCIgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIF9pbXBvcnQodXJpOiBzdHJpbmcsIGlzTGlzc0F1dG86IGJvb2xlYW4gPSBmYWxzZSkge1xuXG5cdC8vIHRlc3QgZm9yIHRoZSBtb2R1bGUgZXhpc3RhbmNlLlxuXHRpZihpc0xpc3NBdXRvICYmIGF3YWl0IF9mZXRjaFRleHQodXJpLCBpc0xpc3NBdXRvKSA9PT0gdW5kZWZpbmVkIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIChhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyB1cmkpKS5kZWZhdWx0O1xuXHR9IGNhdGNoKGUpIHtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSwgaW5pdGlhbGl6ZVN5bmMgfSBmcm9tIFwiLi4vc3RhdGVcIjtcbmltcG9ydCB7IExJU1NCYXNlIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBEb2N1bWVudEZyYWdtZW50fEhUTUxFbGVtZW50PihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgIFxuICAgIGxldCBzdHJpbmcgPSBzdHJbMF07XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyaW5nICs9IGAke2FyZ3NbaV19YDtcbiAgICAgICAgc3RyaW5nICs9IGAke3N0cltpKzFdfWA7XG4gICAgICAgIC8vVE9ETzogbW9yZSBwcmUtcHJvY2Vzc2VzXG4gICAgfVxuXG4gICAgLy8gdXNpbmcgdGVtcGxhdGUgcHJldmVudHMgQ3VzdG9tRWxlbWVudHMgdXBncmFkZS4uLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cmluZy50cmltKCk7XG5cbiAgICBpZiggdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQhIGFzIHVua25vd24gYXMgVDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50ISBhcyB1bmtub3duIGFzIFQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXNzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KGVsZW0pO1xufVxuXG5cbnR5cGUgQlVJTERfT1BUSU9OUzxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gUGFydGlhbDx7XG4gICAgcGFyYW1zICAgIDogUGFydGlhbDxUW1wicGFyYW1zXCJdPixcbiAgICBjb250ZW50XHQgIDogc3RyaW5nfE5vZGV8cmVhZG9ubHkgTm9kZVtdLFxuICAgIGlkIFx0XHQgICAgOiBzdHJpbmcsXG4gICAgY2xhc3Nlc1x0ICA6IHJlYWRvbmx5IHN0cmluZ1tdLFxuICAgIGNzc3ZhcnMgICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+LFxuICAgIGF0dHJzIFx0ICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG4gICAgZGF0YSBcdCAgICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG4gICAgbGlzdGVuZXJzIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgKGV2OiBFdmVudCkgPT4gdm9pZD4+XG59PiAmICh7XG4gIGluaXRpYWxpemU6IGZhbHNlLFxuICBwYXJlbnQ6IEVsZW1lbnRcbn18e1xuICBpbml0aWFsaXplPzogdHJ1ZSxcbiAgcGFyZW50PzogRWxlbWVudFxufSk7XG5cbi8vYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogUHJvbWlzZTxDb21wb25lbnRzW1RdPjtcbi8qXG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPih0YWduYW1lOiBzdHJpbmcsIHtcbiAgICAgICAgICAgICAgcGFyYW1zICAgID0ge30sXG4gICAgICAgICAgICAgIGluaXRpYWxpemU9IHRydWUsXG4gICAgICAgICAgICAgIGNvbnRlbnQgICA9IFtdLFxuICAgICAgICAgICAgICBwYXJlbnQgICAgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGlkIFx0XHQgID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBjbGFzc2VzICAgPSBbXSxcbiAgICAgICAgICAgICAgY3NzdmFycyAgID0ge30sXG4gICAgICAgICAgICAgIGF0dHJzICAgICA9IHt9LFxuICAgICAgICAgICAgICBkYXRhIFx0ICA9IHt9LFxuICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSB7fVxuICAgICAgICAgICAgICB9OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBQcm9taXNlPFQ+IHtcblxuICBpZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbiAgbGV0IEN1c3RvbUNsYXNzID0gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnbmFtZSk7XG4gIGxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbiAgLy8gRml4IGlzc3VlICMyXG4gIGlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG4gIGVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbiAgaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuICBlbGVtLmlkID0gaWQ7XG5cbiAgaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuICBlbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuICBmb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxuICBsZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbiAgaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG4gIGVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgZWxzZVxuICBlbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH1cblxuICBmb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG4gIGxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG4gIGlmKCB2YWx1ZSA9PT0gZmFsc2UpXG4gIGRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG4gIGVsc2UgaWYodmFsdWUgPT09IHRydWUpXG4gIGVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG4gIGVsc2VcbiAgZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBpZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbiAgY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG4gIGVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG4gIGlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG4gIHBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbiAgaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG4gIHJldHVybiBhd2FpdCBMSVNTLmluaXRpYWxpemUoZWxlbSk7XG5cbiAgcmV0dXJuIGF3YWl0IExJU1MuZ2V0TElTUyhlbGVtKTtcbn1cbkxJU1MuYnVpbGQgPSBidWlsZDtcblxuXG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogQ29tcG9uZW50c1tUXTtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFQ7XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywge1xucGFyYW1zICAgID0ge30sXG5pbml0aWFsaXplPSB0cnVlLFxuY29udGVudCAgID0gW10sXG5wYXJlbnQgICAgPSB1bmRlZmluZWQsXG5pZCBcdFx0ICA9IHVuZGVmaW5lZCxcbmNsYXNzZXMgICA9IFtdLFxuY3NzdmFycyAgID0ge30sXG5hdHRycyAgICAgPSB7fSxcbmRhdGEgXHQgID0ge30sXG5saXN0ZW5lcnMgPSB7fVxufTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogVCB7XG5cbmlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxudGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG5sZXQgQ3VzdG9tQ2xhc3MgPSBjdXN0b21FbGVtZW50cy5nZXQodGFnbmFtZSk7XG5pZihDdXN0b21DbGFzcyA9PT0gdW5kZWZpbmVkKVxudGhyb3cgbmV3IEVycm9yKGAke3RhZ25hbWV9IG5vdCBkZWZpbmVkYCk7XG5sZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4vL1RPRE86IGZhY3Rvcml6ZS4uLlxuXG4vLyBGaXggaXNzdWUgIzJcbmlmKCBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnbmFtZSApXG5lbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG5pZiggaWQgIT09IHVuZGVmaW5lZCApXG5lbGVtLmlkID0gaWQ7XG5cbmlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG5lbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbmZvcihsZXQgbmFtZSBpbiBjc3N2YXJzKVxuZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbmZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG5sZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcbmlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuZWxzZVxuZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufVxuXG5mb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG5sZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuaWYoIHZhbHVlID09PSBmYWxzZSlcbmRlbGV0ZSBlbGVtLmRhdGFzZXRbbmFtZV07XG5lbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbmVsc2VcbmVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xufVxuXG5pZiggISBBcnJheS5pc0FycmF5KGNvbnRlbnQpIClcbmNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbmZvcihsZXQgbmFtZSBpbiBsaXN0ZW5lcnMpXG5lbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbnBhcmVudC5hcHBlbmQoZWxlbSk7XG5cbmlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxuTElTUy5pbml0aWFsaXplU3luYyhlbGVtKTtcblxucmV0dXJuIExJU1MuZ2V0TElTU1N5bmMoZWxlbSk7XG59XG5MSVNTLmJ1aWxkU3luYyA9IGJ1aWxkU3luYztcbiovIiwiXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIFF1ZXJ5U2VsZWN0b3JzID09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9leHRlbmRzXCI7XG5pbXBvcnQgdHlwZSB7IExJU1NCYXNlLCBMSVNTSG9zdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZVN5bmMsIHdoZW5Jbml0aWFsaXplZCB9IGZyb20gXCIuLi9zdGF0ZVwiO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50cyB7fTtcblxuZGVjbGFyZSBtb2R1bGUgXCIuLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIC8vIGFzeW5jXG4gICAgICAgIHFzIDogdHlwZW9mIHFzO1xuICAgICAgICBxc286IHR5cGVvZiBxc287XG4gICAgICAgIHFzYTogdHlwZW9mIHFzYTtcbiAgICAgICAgcXNjOiB0eXBlb2YgcXNjO1xuXG4gICAgICAgIC8vIHN5bmNcbiAgICAgICAgcXNTeW5jIDogdHlwZW9mIHFzU3luYztcbiAgICAgICAgcXNhU3luYzogdHlwZW9mIHFzYVN5bmM7XG4gICAgICAgIHFzY1N5bmM6IHR5cGVvZiBxc2NTeW5jO1xuXG5cdFx0Y2xvc2VzdDogdHlwZW9mIGNsb3Nlc3Q7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsaXNzX3NlbGVjdG9yKG5hbWU/OiBzdHJpbmcpIHtcblx0aWYobmFtZSA9PT0gdW5kZWZpbmVkKSAvLyBqdXN0IGFuIGg0Y2tcblx0XHRyZXR1cm4gXCJcIjtcblx0cmV0dXJuIGA6aXMoJHtuYW1lfSwgW2lzPVwiJHtuYW1lfVwiXSlgO1xufVxuXG5mdW5jdGlvbiBfYnVpbGRRUyhzZWxlY3Rvcjogc3RyaW5nLCB0YWduYW1lX29yX3BhcmVudD86IHN0cmluZyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCwgcGFyZW50OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXHRcblx0aWYoIHRhZ25hbWVfb3JfcGFyZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRhZ25hbWVfb3JfcGFyZW50ICE9PSAnc3RyaW5nJykge1xuXHRcdHBhcmVudCA9IHRhZ25hbWVfb3JfcGFyZW50O1xuXHRcdHRhZ25hbWVfb3JfcGFyZW50ID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cmV0dXJuIFtgJHtzZWxlY3Rvcn0ke2xpc3Nfc2VsZWN0b3IodGFnbmFtZV9vcl9wYXJlbnQgYXMgc3RyaW5nfHVuZGVmaW5lZCl9YCwgcGFyZW50XSBhcyBjb25zdDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGxldCByZXN1bHQgPSBhd2FpdCBxc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFRbXT47XG5hc3luYyBmdW5jdGlvbiBxc2E8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl1bXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxUPj4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cHJvbWlzZXNbaWR4KytdID0gd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc2M8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4ocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVDtcbmZ1bmN0aW9uIHFzU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTxUPiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRyZXN1bHRbaWR4KytdID0gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFQ7XG5mdW5jdGlvbiBxc2NTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogQ29tcG9uZW50c1tOXTtcbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBpbml0aWFsaXplU3luYzxUPihyZXN1bHQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2xvc2VzdDxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCkge1xuXG5cdHdoaWxlKHRydWUpIHtcblx0XHR2YXIgcmVzdWx0ID0gZWxlbWVudC5jbG9zZXN0PEU+KHNlbGVjdG9yKTtcblxuXHRcdGlmKCByZXN1bHQgIT09IG51bGwpXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0Y29uc3Qgcm9vdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcblx0XHRpZiggISAoXCJob3N0XCIgaW4gcm9vdCkgKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRlbGVtZW50ID0gKHJvb3QgYXMgU2hhZG93Um9vdCkuaG9zdDtcblx0fVxufVxuXG5cbi8vIGFzeW5jXG5MSVNTLnFzICA9IHFzO1xuTElTUy5xc28gPSBxc287XG5MSVNTLnFzYSA9IHFzYTtcbkxJU1MucXNjID0gcXNjO1xuXG4vLyBzeW5jXG5MSVNTLnFzU3luYyAgPSBxc1N5bmM7XG5MSVNTLnFzYVN5bmMgPSBxc2FTeW5jO1xuTElTUy5xc2NTeW5jID0gcXNjU3luYztcblxuTElTUy5jbG9zZXN0ID0gY2xvc2VzdDsiLCJpbXBvcnQgeyBMSVNTQmFzZSwgTElTU0Jhc2VDc3RyLCBMSVNTSG9zdCwgTElTU0hvc3RDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUsIGlzRE9NQ29udGVudExvYWRlZCwgd2hlbkRPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5lbnVtIFN0YXRlIHtcbiAgICBOT05FID0gMCxcblxuICAgIC8vIGNsYXNzXG4gICAgREVGSU5FRCA9IDEgPDwgMCxcbiAgICBSRUFEWSAgID0gMSA8PCAxLFxuXG4gICAgLy8gaW5zdGFuY2VcbiAgICBVUEdSQURFRCAgICA9IDEgPDwgMixcbiAgICBJTklUSUFMSVpFRCA9IDEgPDwgMyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRklORUQgICAgID0gU3RhdGUuREVGSU5FRDtcbmV4cG9ydCBjb25zdCBSRUFEWSAgICAgICA9IFN0YXRlLlJFQURZO1xuZXhwb3J0IGNvbnN0IFVQR1JBREVEICAgID0gU3RhdGUuVVBHUkFERUQ7XG5leHBvcnQgY29uc3QgSU5JVElBTElaRUQgPSBTdGF0ZS5JTklUSUFMSVpFRDtcblxuZXhwb3J0IGNsYXNzIExJU1NTdGF0ZSB7XG5cbiAgICAjZWxlbTogSFRNTEVsZW1lbnR8bnVsbDtcblxuICAgIC8vIGlmIG51bGwgOiBjbGFzcyBzdGF0ZSwgZWxzZSBpbnN0YW5jZSBzdGF0ZVxuICAgIGNvbnN0cnVjdG9yKGVsZW06IEhUTUxFbGVtZW50fG51bGwgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuI2VsZW0gPSBlbGVtO1xuICAgIH1cblxuICAgIHN0YXRpYyBERUZJTkVEICAgICA9IERFRklORUQ7XG4gICAgc3RhdGljIFJFQURZICAgICAgID0gUkVBRFk7XG4gICAgc3RhdGljIFVQR1JBREVEICAgID0gVVBHUkFERUQ7XG4gICAgc3RhdGljIElOSVRJQUxJWkVEID0gSU5JVElBTElaRUQ7XG5cbiAgICBpcyhzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCAgICAgJiYgISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZICAgICAgICYmICEgdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgICAgJiYgISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCAmJiAhIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW4oc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGxldCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPGFueT4+KCk7XG4gICAgXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuRGVmaW5lZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblJlYWR5KCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuVXBncmFkZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5Jbml0aWFsaXplZCgpICk7XG4gICAgXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gREVGSU5FRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0RlZmluZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuRGVmaW5lZDxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFJFQURZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgICAgIGlmKCAhIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gSG9zdC5pc0RlcHNSZXNvbHZlZDtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuUmVhZHkoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTsgLy8gY291bGQgYmUgcmVhZHkgYmVmb3JlIGRlZmluZWQsIGJ1dCB3ZWxsLi4uXG5cbiAgICAgICAgYXdhaXQgd2hlbkRPTUNvbnRlbnRMb2FkZWQ7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuRGVwc1Jlc29sdmVkO1xuICAgIH1cbiAgICBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gVVBHUkFERUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNVcGdyYWRlZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgY29uc3QgaG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcbiAgICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBob3N0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7XG4gICAgXG4gICAgICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgaG9zdClcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgXG4gICAgICAgIC8vIGg0Y2tcbiAgICBcbiAgICAgICAgaWYoIFwiX3doZW5VcGdyYWRlZFwiIGluIGVsZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IGVsZW0uX3doZW5VcGdyYWRlZDtcbiAgICAgICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KCk7XG4gICAgICAgIFxuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWQgICAgICAgID0gcHJvbWlzZTtcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgXG4gICAgICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gSU5JVElBTElaRUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNJbml0aWFsaXplZCgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIHJldHVybiBcImlzSW5pdGlhbGl6ZWRcIiBpbiBlbGVtICYmIGVsZW0uaXNJbml0aWFsaXplZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oKSB7XG4gICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlblVwZ3JhZGVkKCk7XG5cbiAgICAgICAgYXdhaXQgaG9zdC53aGVuSW5pdGlhbGl6ZWQ7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtIGFzIExJU1NIb3N0PFQ+KS5iYXNlIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IENPTlZFUlNJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgdmFsdWVPZigpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgbGV0IHN0YXRlOiBTdGF0ZSA9IDA7XG4gICAgXG4gICAgICAgIGlmKCB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBERUZJTkVEO1xuICAgICAgICBpZiggdGhpcy5pc1JlYWR5IClcbiAgICAgICAgICAgIHN0YXRlIHw9IFJFQURZO1xuICAgICAgICBpZiggdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IFVQR1JBREVEO1xuICAgICAgICBpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IElOSVRJQUxJWkVEO1xuICAgIFxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IGlzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJERUZJTkVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBpcy5wdXNoKFwiUkVBRFlcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJVUEdSQURFRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIklOSVRJQUxJWkVEXCIpO1xuICAgIFxuICAgICAgICByZXR1cm4gaXMuam9pbignfCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYoIFwic3RhdGVcIiBpbiBlbGVtKVxuICAgICAgICByZXR1cm4gZWxlbS5zdGF0ZSBhcyBMSVNTU3RhdGU7XG4gICAgXG4gICAgcmV0dXJuIChlbGVtIGFzIGFueSkuc3RhdGUgPSBuZXcgTElTU1N0YXRlKGVsZW0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT0gU3RhdGUgbW9kaWZpZXJzIChtb3ZlPykgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdvIHRvIHN0YXRlIERFRklORURcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oXG4gICAgdGFnbmFtZSAgICAgICA6IHN0cmluZyxcbiAgICBDb21wb25lbnRDbGFzczogVHxMSVNTSG9zdENzdHI8VD4pIHtcblxuICAgIC8vIGNvdWxkIGJlIGJldHRlci5cbiAgICBpZiggXCJCYXNlXCIgaW4gQ29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgQ29tcG9uZW50Q2xhc3MgPSBDb21wb25lbnRDbGFzcy5CYXNlIGFzIFQ7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IENsYXNzICA9IENvbXBvbmVudENsYXNzLkxJU1NDZmcuaG9zdDtcbiAgICBsZXQgaHRtbHRhZyAgPSBfZWxlbWVudDJ0YWduYW1lKENsYXNzKT8/dW5kZWZpbmVkO1xuXG4gICAgY29uc3QgTElTU2NsYXNzID0gQ29tcG9uZW50Q2xhc3MuSG9zdDsgLy9idWlsZExJU1NIb3N0PFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXG4gICAgY29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG4gICAgICAgICAgICAgICAgOiB7ZXh0ZW5kczogaHRtbHRhZ307XG5cbiAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgTElTU2NsYXNzLCBvcHRzKTtcbn07XG5cbi8vIEdvIHRvIHN0YXRlIFVQR1JBREVEXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBncmFkZTxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlbkRlZmluZWQoKTtcblxuICAgIHJldHVybiB1cGdyYWRlU3luYzxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZ3JhZGVTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBUIHtcbiAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG4gICAgXG4gICAgaWYoICEgc3RhdGUuaXNEZWZpbmVkIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IG5vdCBkZWZpbmVkIScpO1xuXG4gICAgaWYoIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKVxuICAgICAgICBkb2N1bWVudC5hZG9wdE5vZGUoZWxlbSk7XG4gICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShlbGVtKTtcblxuICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICBpZiggISAoZWxlbSBpbnN0YW5jZW9mIEhvc3QpIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGRpZG4ndCB1cGdyYWRlIWApO1xuXG4gICAgcmV0dXJuIGVsZW0gYXMgVDtcbn1cblxuLy8gR28gdG8gc3RhdGUgSU5JVElBTElaRURcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemU8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlIClcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB1cGdyYWRlKGVsZW0pO1xuXG4gICAgYXdhaXQgc3RhdGUud2hlblJlYWR5KCk7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufFRbXCJwYXJhbXNcIl0gPSBmYWxzZSk6IFQge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UpXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gdXBncmFkZVN5bmMoZWxlbSk7XG5cbiAgICBpZiggISBzdGF0ZS5pc1JlYWR5IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBub3QgcmVhZHkgIVwiKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IHt9IDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZShwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuLy8gPT09PT09PT09PT09PT09PT09PT09PSBleHRlcm5hbCBXSEVOID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuVXBncmFkZWQ8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCB1cGdyYWRlKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlblVwZ3JhZGVkPFQ+KCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuSW5pdGlhbGl6ZWQ8VD4oKTtcbn1cblxuLy8gUHJpdmF0ZSBmb3Igbm93LlxuXG5mdW5jdGlvbiBnZXRIb3N0Q3N0clN5bmM8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIFxuICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKGVsZW0pO1xuICAgIGNvbnN0IGhvc3QgPSBjdXN0b21FbGVtZW50cy5nZXQoIG5hbWUgKTtcbiAgICBpZiggaG9zdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bmFtZX0gbm90IHlldCBkZWZpbmVkIWApO1xuICAgIHJldHVybiBob3N0IGFzIFQ7XG59XG5cbi8vVE9ETzogbW92ZSAyIHJlZ2lzdGVyeS4uLlxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnQgKTogc3RyaW5nIHtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufSIsImltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgTElTUyB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3Mge31cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSB7IG5ldyguLi5hcmdzOmFueVtdKTogVH07XG5cbmV4cG9ydCB0eXBlIENTU19SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MU3R5bGVFbGVtZW50fENTU1N0eWxlU2hlZXQ7XG5leHBvcnQgdHlwZSBDU1NfU291cmNlICAgPSBDU1NfUmVzb3VyY2UgfCBQcm9taXNlPENTU19SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIEhUTUxfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFRlbXBsYXRlRWxlbWVudHxOb2RlO1xuZXhwb3J0IHR5cGUgSFRNTF9Tb3VyY2UgICA9IEhUTUxfUmVzb3VyY2UgfCBQcm9taXNlPEhUTUxfUmVzb3VyY2U+O1xuXG5leHBvcnQgZW51bSBTaGFkb3dDZmcge1xuXHROT05FID0gJ25vbmUnLFxuXHRPUEVOID0gJ29wZW4nLCBcblx0Q0xPU0U9ICdjbG9zZWQnXG59O1xuXG4vL1RPRE86IGltcGxlbWVudCA/XG5leHBvcnQgZW51bSBMaWZlQ3ljbGUge1xuICAgIERFRkFVTFQgICAgICAgICAgICAgICAgICAgPSAwLFxuXHQvLyBub3QgaW1wbGVtZW50ZWQgeWV0XG4gICAgSU5JVF9BRlRFUl9DSElMRFJFTiAgICAgICA9IDEgPDwgMSxcbiAgICBJTklUX0FGVEVSX1BBUkVOVCAgICAgICAgID0gMSA8PCAyLFxuICAgIC8vIHF1aWQgcGFyYW1zL2F0dHJzID9cbiAgICBSRUNSRUFURV9BRlRFUl9DT05ORUNUSU9OID0gMSA8PCAzLCAvKiByZXF1aXJlcyByZWJ1aWxkIGNvbnRlbnQgKyBkZXN0cm95L2Rpc3Bvc2Ugd2hlbiByZW1vdmVkIGZyb20gRE9NICovXG4gICAgLyogc2xlZXAgd2hlbiBkaXNjbyA6IHlvdSBuZWVkIHRvIGltcGxlbWVudCBpdCB5b3Vyc2VsZiAqL1xufVxuXG5leHBvcnQgdHlwZSBDb250ZW50RmFjdG9yeTxBdHRycyBleHRlbmRzIHN0cmluZywgUGFyYW1zIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+PiA9ICggKGF0dHJzOiBSZWNvcmQ8QXR0cnMsIG51bGx8c3RyaW5nPiwgcGFyYW1zOiBQYXJhbXMsIGVsZW06SFRNTEVsZW1lbnQpID0+IE5vZGV8dW5kZWZpbmVkICk7XG5cbi8vIFVzaW5nIENvbnN0cnVjdG9yPFQ+IGluc3RlYWQgb2YgVCBhcyBnZW5lcmljIHBhcmFtZXRlclxuLy8gZW5hYmxlcyB0byBmZXRjaCBzdGF0aWMgbWVtYmVyIHR5cGVzLlxuZXhwb3J0IHR5cGUgTElTU19PcHRzPFxuICAgIC8vIEpTIEJhc2VcbiAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nLFxuICAgID4gPSB7XG4gICAgICAgIC8vIEpTIEJhc2VcbiAgICAgICAgZXh0ZW5kcyAgIDogRXh0ZW5kc0N0cixcbiAgICAgICAgcGFyYW1zICAgIDogUGFyYW1zLFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBkZXBzICAgICAgOiByZWFkb25seSBQcm9taXNlPGFueT5bXSxcblxuICAgICAgICAvLyBIVE1MIEJhc2VcbiAgICAgICAgaG9zdCAgIDogSG9zdENzdHIsXG4gICAgICAgIGF0dHJzICA6IHJlYWRvbmx5IEF0dHJzW10sXG4gICAgICAgIG9ic2VydmVkQXR0cmlidXRlczogcmVhZG9ubHkgQXR0cnNbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0XG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGNvbnRlbnQ/OiBIVE1MX1NvdXJjZSxcbiAgICAgICAgY29udGVudF9mYWN0b3J5OiAoY29udGVudD86IEV4Y2x1ZGU8SFRNTF9SZXNvdXJjZSwgUmVzcG9uc2U+KSA9PiBDb250ZW50RmFjdG9yeTxBdHRycywgUGFyYW1zPixcbiAgICAgICAgY3NzICAgICA6IENTU19Tb3VyY2UgfCByZWFkb25seSBDU1NfU291cmNlW10sXG4gICAgICAgIHNoYWRvdyAgOiBTaGFkb3dDZmdcbn1cblxuLy8gTElTU0Jhc2VcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2VDc3RyPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuZXhwb3J0IHR5cGUgTElTU0Jhc2U8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gSW5zdGFuY2VUeXBlPExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUIGV4dGVuZHMgTElTU0Jhc2U+ID0gVCBleHRlbmRzIExJU1NCYXNlPFxuICAgICAgICAgICAgaW5mZXIgQSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgICAgIGluZmVyIEIsXG4gICAgICAgICAgICBpbmZlciBDLFxuICAgICAgICAgICAgaW5mZXIgRD4gPyBDb25zdHJ1Y3RvcjxUPiAmIExJU1NCYXNlQ3N0cjxBLEIsQyxEPiA6IG5ldmVyO1xuXG5cbmV4cG9ydCB0eXBlIExJU1NIb3N0Q3N0cjxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IFJldHVyblR5cGU8dHlwZW9mIGJ1aWxkTElTU0hvc3Q8VCBleHRlbmRzIExJU1NCYXNlID8gTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQ+IDogVD4+O1xuZXhwb3J0IHR5cGUgTElTU0hvc3QgICAgPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gSW5zdGFuY2VUeXBlPExJU1NIb3N0Q3N0cjxUPj47IiwiLy8gZnVuY3Rpb25zIHJlcXVpcmVkIGJ5IExJU1MuXG5cbi8vIGZpeCBBcnJheS5pc0FycmF5XG4vLyBjZiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3MDAyI2lzc3VlY29tbWVudC0yMzY2NzQ5MDUwXG5cbnR5cGUgWDxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyICAgID8gVFtdICAgICAgICAgICAgICAgICAgIC8vIGFueS91bmtub3duID0+IGFueVtdL3Vua25vd25cbiAgICAgICAgOiBUIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdICAgICAgICAgID8gVCAgICAgICAgICAgICAgICAgICAgIC8vIHVua25vd25bXSAtIG9idmlvdXMgY2FzZVxuICAgICAgICA6IFQgZXh0ZW5kcyBJdGVyYWJsZTxpbmZlciBVPiAgICAgICAgICAgPyAgICAgICByZWFkb25seSBVW10gICAgLy8gSXRlcmFibGU8VT4gbWlnaHQgYmUgYW4gQXJyYXk8VT5cbiAgICAgICAgOiAgICAgICAgICB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5IHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6ICAgICAgICAgICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vLyByZXF1aXJlZCBmb3IgYW55L3Vua25vd24gKyBJdGVyYWJsZTxVPlxudHlwZSBYMjxUPiA9IEV4Y2x1ZGU8dW5rbm93bixUPiBleHRlbmRzIG5ldmVyID8gdW5rbm93biA6IHVua25vd247XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgQXJyYXlDb25zdHJ1Y3RvciB7XG4gICAgICAgIGlzQXJyYXk8VD4oYTogVHxYMjxUPik6IGEgaXMgWDxUPjtcbiAgICB9XG59XG5cbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTEwMDA0NjEvaHRtbC1lbGVtZW50LXRhZy1uYW1lLWZyb20tY29uc3RydWN0b3JcbmNvbnN0IEhUTUxDTEFTU19SRUdFWCA9ICAvSFRNTChcXHcrKUVsZW1lbnQvO1xuY29uc3QgZWxlbWVudE5hbWVMb29rdXBUYWJsZSA9IHtcbiAgICAnVUxpc3QnOiAndWwnLFxuICAgICdUYWJsZUNhcHRpb24nOiAnY2FwdGlvbicsXG4gICAgJ1RhYmxlQ2VsbCc6ICd0ZCcsIC8vIHRoXG4gICAgJ1RhYmxlQ29sJzogJ2NvbCcsICAvLydjb2xncm91cCcsXG4gICAgJ1RhYmxlUm93JzogJ3RyJyxcbiAgICAnVGFibGVTZWN0aW9uJzogJ3Rib2R5JywgLy9bJ3RoZWFkJywgJ3Rib2R5JywgJ3Rmb290J10sXG4gICAgJ1F1b3RlJzogJ3EnLFxuICAgICdQYXJhZ3JhcGgnOiAncCcsXG4gICAgJ09MaXN0JzogJ29sJyxcbiAgICAnTW9kJzogJ2lucycsIC8vLCAnZGVsJ10sXG4gICAgJ01lZGlhJzogJ3ZpZGVvJywvLyAnYXVkaW8nXSxcbiAgICAnSW1hZ2UnOiAnaW1nJyxcbiAgICAnSGVhZGluZyc6ICdoMScsIC8vLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnXSxcbiAgICAnRGlyZWN0b3J5JzogJ2RpcicsXG4gICAgJ0RMaXN0JzogJ2RsJyxcbiAgICAnQW5jaG9yJzogJ2EnXG4gIH07XG5leHBvcnQgZnVuY3Rpb24gX2VsZW1lbnQydGFnbmFtZShDbGFzczogdHlwZW9mIEhUTUxFbGVtZW50KTogc3RyaW5nfG51bGwge1xuXG5cdGlmKCBDbGFzcyA9PT0gSFRNTEVsZW1lbnQgKVxuXHRcdHJldHVybiBudWxsO1xuXHRcblx0bGV0IGh0bWx0YWcgPSBIVE1MQ0xBU1NfUkVHRVguZXhlYyhDbGFzcy5uYW1lKSFbMV07XG5cdHJldHVybiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlW2h0bWx0YWcgYXMga2V5b2YgdHlwZW9mIGVsZW1lbnROYW1lTG9va3VwVGFibGVdID8/IGh0bWx0YWcudG9Mb3dlckNhc2UoKVxufVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5leHBvcnQgZnVuY3Rpb24gaXNTaGFkb3dTdXBwb3J0ZWQodGFnOiB0eXBlb2YgSFRNTEVsZW1lbnQpIHtcblx0cmV0dXJuIENBTl9IQVZFX1NIQURPVy5pbmNsdWRlcyggX2VsZW1lbnQydGFnbmFtZSh0YWcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCI7XG59XG5cbmV4cG9ydCBjb25zdCB3aGVuRE9NQ29udGVudExvYWRlZCA9IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0RE9NQ29udGVudExvYWRlZCgpIHtcbiAgICBpZiggaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9LCB0cnVlKTtcblxuICAgIGF3YWl0IHByb21pc2U7XG59XG5cbi8vIGZvciBtaXhpbnMuXG5leHBvcnQgdHlwZSBDb21wb3NlQ29uc3RydWN0b3I8VCwgVT4gPSBcbiAgICBbVCwgVV0gZXh0ZW5kcyBbbmV3IChhOiBpbmZlciBPMSkgPT4gaW5mZXIgUjEsbmV3IChhOiBpbmZlciBPMikgPT4gaW5mZXIgUjJdID8ge1xuICAgICAgICBuZXcgKG86IE8xICYgTzIpOiBSMSAmIFIyXG4gICAgfSAmIFBpY2s8VCwga2V5b2YgVD4gJiBQaWNrPFUsIGtleW9mIFU+IDogbmV2ZXIiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9kZWZpbmVcIjsgLy9UT0RPOiBjdXN0b21SZWdpc3Rlcnlcbi8vVE9ETzogZ2xvYmFsQ1NTUnVsZXNcbi8vVE9ETzogQkxJU1Ncbi8vVE9ETzogTElTU1BhcmFtc1xuLy9UT0RPOiBvdGhlcnMuLi5cblxuXG5pbXBvcnQgXCIuL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnNcIjtcbmltcG9ydCBcIi4vaGVscGVycy9MSVNTQXV0b1wiO1xuXG5leHBvcnQge2xpc3MsIGxpc3NTeW5jLCBodG1sfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5leHBvcnQgZGVmYXVsdCBMSVNTOyJdLCJuYW1lcyI6WyJidWlsZExJU1NIb3N0IiwiU2hhZG93Q2ZnIiwiX2VsZW1lbnQydGFnbmFtZSIsImlzU2hhZG93U3VwcG9ydGVkIiwiaHRtbCIsIl9fY3N0cl9ob3N0Iiwic2V0Q3N0ckhvc3QiLCJfIiwiREVGQVVMVF9DT05URU5UX0ZBQ1RPUlkiLCJjb250ZW50IiwidHJpbSIsImxlbmd0aCIsInVuZGVmaW5lZCIsIkhUTUxUZW1wbGF0ZUVsZW1lbnQiLCJjbG9uZU5vZGUiLCJMSVNTIiwiZXh0ZW5kcyIsIl9leHRlbmRzIiwiT2JqZWN0IiwicGFyYW1zIiwiZGVwcyIsImhvc3QiLCJIVE1MRWxlbWVudCIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJzIiwiY29udGVudF9mYWN0b3J5IiwiX2NvbnRlbnRfZmFjdG9yeSIsImNzcyIsInNoYWRvdyIsIkNMT1NFIiwiTk9ORSIsIk9QRU4iLCJFcnJvciIsImFsbF9kZXBzIiwiUHJvbWlzZSIsIlJlc3BvbnNlIiwiX2NvbnRlbnQiLCJwdXNoIiwidGV4dCIsIkxJU1NCYXNlIiwiTElTU0NmZyIsInN0eWxlc2hlZXRzIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiYyIsImlkeCIsInByb2Nlc3NfY3NzIiwiY29uc3RydWN0b3IiLCJhcmdzIiwiSG9zdCIsInN0YXRlIiwic2V0QXR0ckRlZmF1bHQiLCJhdHRyIiwidmFsdWUiLCJvbkF0dHJDaGFuZ2VkIiwiX25hbWUiLCJfb2xkVmFsdWUiLCJfbmV3VmFsdWUiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJ1cGRhdGVQYXJhbXMiLCJhc3NpZ24iLCJpc0luRE9NIiwiaXNDb25uZWN0ZWQiLCJvbkRPTUNvbm5lY3RlZCIsImNvbm5lY3RlZENhbGxiYWNrIiwib25ET01EaXNjb25uZWN0ZWQiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsIl9Ib3N0IiwiQ1NTU3R5bGVTaGVldCIsIkhUTUxTdHlsZUVsZW1lbnQiLCJzaGVldCIsInN0eWxlIiwicmVwbGFjZVN5bmMiLCJMSVNTU3RhdGUiLCJpc0RPTUNvbnRlbnRMb2FkZWQiLCJ3YWl0RE9NQ29udGVudExvYWRlZCIsImlkIiwic2hhcmVkQ1NTIiwiTGlzcyIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWxyZWFkeURlY2xhcmVkQ1NTIiwiU2V0Iiwid2FpdFJlYWR5IiwiciIsImFsbCIsImlzUmVhZHkiLCJ3aGVuRGVwc1Jlc29sdmVkIiwiaXNEZXBzUmVzb2x2ZWQiLCJMSVNTSG9zdEJhc2UiLCJCYXNlIiwiYmFzZSIsImlzSW5pdGlhbGl6ZWQiLCJ3aGVuSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplIiwiaW5pdCIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImdldFBhcnQiLCJoYXNTaGFkb3ciLCJxdWVyeVNlbGVjdG9yIiwiZ2V0UGFydHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiQ1NTU2VsZWN0b3IiLCJoYXNBdHRyaWJ1dGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicHJvbWlzZSIsInJlc29sdmUiLCJ3aXRoUmVzb2x2ZXJzIiwiX3doZW5VcGdyYWRlZFJlc29sdmUiLCJjdXN0b21FbGVtZW50cyIsInVwZ3JhZGUiLCJhdHRhY2hTaGFkb3ciLCJtb2RlIiwib2JzIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwiY3Nzc2VsZWN0b3IiLCJoYXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJodG1sX3N0eWxlc2hlZXRzIiwicnVsZSIsImNzc1J1bGVzIiwiY3NzVGV4dCIsImlubmVySFRNTCIsInJlcGxhY2UiLCJoZWFkIiwiYXBwZW5kIiwiYWRkIiwib2JqIiwiY2hpbGROb2RlcyIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJkZWZpbmUiLCJ0YWduYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJDbGFzcyIsImh0bWx0YWciLCJMSVNTY2xhc3MiLCJvcHRzIiwid2hlbkRlZmluZWQiLCJjYWxsYmFjayIsIndoZW5BbGxEZWZpbmVkIiwidGFnbmFtZXMiLCJ0IiwiaXNEZWZpbmVkIiwiZ2V0TmFtZSIsImVsZW1lbnQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiX0xJU1MiLCJJTElTUyIsIkV4dGVuZGVkTElTUyIsIkxJU1NfQXV0byIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInN3Iiwic2NvcGUiLCJjb250cm9sbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNyYyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRpdGlvbiIsImFkZGVkTm9kZXMiLCJFbGVtZW50Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtIiwicmVzb3VyY2VzIiwiZGVmaW5lV2ViQ29tcG9uZW50IiwiZmlsZXMiLCJqcyIsImtsYXNzIiwic3RyIiwic3BhbnMiLCJfYSIsIl9iIiwic3BhbiIsInRleHRDb250ZW50IiwiV2ViQ29tcG9uZW50IiwiZmlsZW5hbWVzIiwiZmlsZSIsImVuZHNXaXRoIiwiX2ltcG9ydCIsIl9mZXRjaFRleHQiLCJpIiwidXJpIiwiaXNMaXNzQXV0byIsIm9wdGlvbnMiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJmZXRjaCIsInN0YXR1cyIsImRlZmF1bHQiLCJlIiwiY29uc29sZSIsImxvZyIsImluaXRpYWxpemVTeW5jIiwic3RyaW5nIiwidGVtcGxhdGUiLCJmaXJzdENoaWxkIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibGlzcyIsIkRvY3VtZW50RnJhZ21lbnQiLCJsaXNzU3luYyIsImxpc3Nfc2VsZWN0b3IiLCJfYnVpbGRRUyIsInNlbGVjdG9yIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJwYXJlbnQiLCJxcyIsInJlc3VsdCIsInFzbyIsInFzYSIsImVsZW1lbnRzIiwicHJvbWlzZXMiLCJxc2MiLCJyZXMiLCJjbG9zZXN0IiwicXNTeW5jIiwicXNhU3luYyIsInFzY1N5bmMiLCJyb290IiwiZ2V0Um9vdE5vZGUiLCJ3aGVuRE9NQ29udGVudExvYWRlZCIsIlN0YXRlIiwiREVGSU5FRCIsIlJFQURZIiwiVVBHUkFERUQiLCJJTklUSUFMSVpFRCIsImlzIiwiaXNVcGdyYWRlZCIsIndoZW4iLCJ3aGVuUmVhZHkiLCJ3aGVuVXBncmFkZWQiLCJnZXRIb3N0Q3N0clN5bmMiLCJfd2hlblVwZ3JhZGVkIiwidmFsdWVPZiIsInRvU3RyaW5nIiwiam9pbiIsImdldFN0YXRlIiwic3RyaWN0IiwidXBncmFkZVN5bmMiLCJvd25lckRvY3VtZW50IiwiYWRvcHROb2RlIiwiZm9yY2UiLCJMaWZlQ3ljbGUiLCJIVE1MQ0xBU1NfUkVHRVgiLCJlbGVtZW50TmFtZUxvb2t1cFRhYmxlIiwiZXhlYyIsIkNBTl9IQVZFX1NIQURPVyIsInRhZyIsInJlYWR5U3RhdGUiXSwic291cmNlUm9vdCI6IiJ9