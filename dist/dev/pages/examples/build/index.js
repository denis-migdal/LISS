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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var helpers_build__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! helpers/build */ "./src/helpers/build.ts");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../ */ "./src/index.ts");
/* harmony import */ var state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! state */ "./src/state.ts");



// =============================================================
class MyComponentA extends (0,___WEBPACK_IMPORTED_MODULE_1__["default"])() {
    constructor(){
        super();
        this.content.replaceChildren((0,helpers_build__WEBPACK_IMPORTED_MODULE_0__.html)`<b>html\`\` : OK</b>`);
    }
}
(0,state__WEBPACK_IMPORTED_MODULE_2__.define)('my-component-a', MyComponentA);
// =============================================================
class MyComponentB extends (0,___WEBPACK_IMPORTED_MODULE_1__["default"])({
    content: "liss``"
}) {
    constructor(){
        console.log("init");
        super();
    }
}
(0,state__WEBPACK_IMPORTED_MODULE_2__.define)('my-component-b', MyComponentB);
async function foo() {
    const component = await (0,helpers_build__WEBPACK_IMPORTED_MODULE_0__.liss)`<my-component-b></my-component-b>`;
    document.body.append(component.host);
}
foo();
{
    let compo = new MyComponentB.Host();
    document.body.append(compo);
    console.warn("host", (0,state__WEBPACK_IMPORTED_MODULE_2__.getState)(compo));
}{
    let compo = new MyComponentB();
    document.body.append(compo.host);
    console.warn("base", (0,state__WEBPACK_IMPORTED_MODULE_2__.getState)(compo.host));
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXMvZXhhbXBsZXMvYnVpbGQvL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUEyQztBQUMyRjtBQUN4RTtBQUV2QjtBQUV2QyxJQUFJSyxjQUFxQjtBQUVsQixTQUFTQyxZQUFZQyxDQUFNO0lBQ2pDRixjQUFjRTtBQUNmO0FBRU8sU0FBU0Msd0JBQXdCQyxPQUEwQztJQUVqRixJQUFJLE9BQU9BLFlBQVksVUFBVTtRQUVoQ0EsVUFBVUEsUUFBUUMsSUFBSTtRQUN0QixJQUFJRCxRQUFRRSxNQUFNLEtBQUssR0FDdEJGLFVBQVVHO1FBRVgsSUFBSUgsWUFBWUcsV0FDZkgsVUFBVUwsb0RBQUksQ0FBQyxFQUFFSyxRQUFRLENBQUM7SUFFM0IsMEJBQTBCO0lBQzFCLG1CQUFtQjtJQUNuQixnREFBZ0Q7SUFDL0MsbUNBQW1DO0lBQ25DLCtEQUErRDtJQUNoRSxxRkFBcUY7SUFDckYsbUdBQW1HO0lBQ3BHO0lBRUEsSUFBSUEsbUJBQW1CSSxxQkFDdEJKLFVBQVVBLFFBQVFBLE9BQU87SUFFMUIsT0FBTyxJQUFNQSxTQUFTSyxVQUFVO0FBQ2pDO0FBRU8sU0FBU0MsS0FNZCxFQUVFLFVBQVU7QUFDVkMsU0FBU0MsV0FBV0MsTUFBK0IsRUFBRSxxQ0FBcUMsR0FDMUZDLFNBQW9CLENBQUMsQ0FBMEIsRUFDL0MsY0FBYztBQUNkQyxPQUFTLEVBQUUsRUFFWCxZQUFZO0FBQ1pDLE9BQVFDLFdBQWtDLEVBQzdDQyxxQkFBcUIsRUFBRSxFQUNwQkMsUUFBUUQsa0JBQWtCLEVBQzFCLGNBQWM7QUFDZGQsT0FBTyxFQUNWZ0IsaUJBQWlCQyxtQkFBbUJsQix1QkFBdUIsRUFDeERtQixHQUFHLEVBQ0hDLFNBQVN6Qix5REFBaUJBLENBQUNrQixRQUFRcEIsNkNBQVNBLENBQUM0QixLQUFLLEdBQUc1Qiw2Q0FBU0EsQ0FBQzZCLElBQUksRUFDYixHQUFHLENBQUMsQ0FBQztJQUUzRCxJQUFJRixXQUFXM0IsNkNBQVNBLENBQUM4QixJQUFJLElBQUksQ0FBRTVCLHlEQUFpQkEsQ0FBQ2tCLE9BQ2pELE1BQU0sSUFBSVcsTUFBTSxDQUFDLGFBQWEsRUFBRTlCLHdEQUFnQkEsQ0FBQ21CLE1BQU0sNEJBQTRCLENBQUM7SUFFeEYsTUFBTVksV0FBVztXQUFJYjtLQUFLO0lBRTdCLElBQUlLO0lBRUQscUJBQXFCO0lBQ3JCLElBQUloQixtQkFBbUJ5QixXQUFXekIsbUJBQW1CMEIsVUFBVztRQUVsRSxJQUFJQyxXQUFrQzNCO1FBQ3RDQSxVQUFVO1FBRUp3QixTQUFTSSxJQUFJLENBQUUsQ0FBQztZQUVaRCxXQUFXLE1BQU1BO1lBQ2pCLElBQUlBLG9CQUFvQkQsVUFDaENDLFdBQVcsTUFBTUEsU0FBU0UsSUFBSTtZQUV0QkMsU0FBU0MsT0FBTyxDQUFDZixlQUFlLEdBQUdDLGlCQUFpQlU7UUFDeEQ7SUFFSixPQUFPO1FBQ1RYLGtCQUFrQkMsaUJBQWlCakI7SUFDcEM7SUFFQSxpQkFBaUI7SUFDakIsSUFBSWdDLGNBQStCLEVBQUU7SUFDckMsSUFBSWQsUUFBUWYsV0FBWTtRQUV2QixJQUFJLENBQUU4QixNQUFNQyxPQUFPLENBQUNoQixNQUNuQiwyREFBMkQ7UUFDM0RBLE1BQU07WUFBQ0E7U0FBSTtRQUVaLGFBQWE7UUFDYmMsY0FBY2QsSUFBSWlCLEdBQUcsQ0FBRSxDQUFDQyxHQUFlQztZQUV0QyxJQUFJRCxhQUFhWCxXQUFXVyxhQUFhVixVQUFVO2dCQUVsREYsU0FBU0ksSUFBSSxDQUFFLENBQUM7b0JBRWZRLElBQUksTUFBTUE7b0JBQ1YsSUFBSUEsYUFBYVYsVUFDaEJVLElBQUksTUFBTUEsRUFBRVAsSUFBSTtvQkFFakJHLFdBQVcsQ0FBQ0ssSUFBSSxHQUFHQyxZQUFZRjtnQkFFaEM7Z0JBRUEsT0FBTztZQUNSO1lBRUEsT0FBT0UsWUFBWUY7UUFDcEI7SUFDRDtJQUtBLE1BQU1OLGlCQUFpQnRCO1FBRXRCK0IsWUFBWSxHQUFHQyxJQUFXLENBQUU7WUFFM0IsS0FBSyxJQUFJQTtZQUVULHlDQUF5QztZQUN6QyxJQUFJNUMsZ0JBQWdCLE1BQ25CQSxjQUFjLElBQUksSUFBSyxDQUFDMkMsV0FBVyxDQUFTRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUk7WUFDMUQsSUFBSSxDQUFDLEtBQUssR0FBRzdDO1lBQ2JBLGNBQWM7UUFDZjtRQUVTLEtBQUssQ0FBTTtRQUVwQixlQUFlO1FBQ2YsT0FBZ0JtQyxVQUFVO1lBQ3pCbkI7WUFDQUQ7WUFDQUk7WUFDQUw7WUFDQU07WUFDQWdCO1lBQ0FiO1FBQ0QsRUFBRTtRQUVGLElBQUl1QixRQUFtQjtZQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUNBLEtBQUs7UUFDeEI7UUFFQSxJQUFXOUIsT0FBK0I7WUFDekMsT0FBTyxJQUFJLENBQUMsS0FBSztRQUNsQjtRQUNBLDJCQUEyQjtRQUMzQixJQUFjWixVQUE2QztZQUMxRCxPQUFPLElBQUssQ0FBQyxLQUFLLENBQVdBLE9BQU87UUFDckM7UUFFQSxRQUFRO1FBQ1IsSUFBY2UsUUFBb0M7WUFDakQsT0FBTyxJQUFLLENBQUMsS0FBSyxDQUFXQSxLQUFLO1FBQ25DO1FBQ1U0QixlQUFnQkMsSUFBVyxFQUFFQyxLQUFrQixFQUFFO1lBQzFELE9BQU8sSUFBSyxDQUFDLEtBQUssQ0FBV0YsY0FBYyxDQUFDQyxNQUFNQztRQUNuRDtRQUNVQyxjQUFjQyxLQUFZLEVBQ25DQyxTQUFpQixFQUNqQkMsU0FBaUIsRUFBYyxDQUFDO1FBRWpDLHNCQUFzQjtRQUN0QixJQUFjbkMscUJBQXFCO1lBQ2xDLE9BQU8sSUFBSSxDQUFDQyxLQUFLO1FBQ2xCO1FBQ1VtQyx5QkFBeUIsR0FBR1YsSUFBNkIsRUFBRTtZQUNwRSxJQUFJLENBQUNNLGFBQWEsSUFBSU47UUFDdkI7UUFFQSxhQUFhO1FBQ2IsSUFBVzlCLFNBQTJCO1lBQ3JDLE9BQU8sSUFBSyxDQUFDLEtBQUssQ0FBV0EsTUFBTTtRQUNwQztRQUNPeUMsYUFBYXpDLE1BQXVCLEVBQUU7WUFDNUNELE9BQU8yQyxNQUFNLENBQUUsSUFBSyxDQUFDLEtBQUssQ0FBVzFDLE1BQU0sRUFBRUE7UUFDOUM7UUFFQSxNQUFNO1FBQ04sSUFBVzJDLFVBQW1CO1lBQzdCLE9BQU8sSUFBSyxDQUFDLEtBQUssQ0FBV0MsV0FBVztRQUN6QztRQUNVQyxpQkFBaUI7WUFDMUIsSUFBSSxDQUFDQyxpQkFBaUI7UUFDdkI7UUFDVUMsb0JBQW9CO1lBQzdCLElBQUksQ0FBQ0Msb0JBQW9CO1FBQzFCO1FBRUEscUJBQXFCO1FBQ1hGLG9CQUFvQixDQUFDO1FBQ3JCRSx1QkFBdUIsQ0FBQztRQUNsQyxJQUFXSixjQUFjO1lBQ3hCLE9BQU8sSUFBSSxDQUFDRCxPQUFPO1FBQ3BCO1FBRUEsT0FBZU0sTUFBMEI7UUFFekMsV0FBV2xCLE9BQU87WUFDakIsSUFBSSxJQUFJLENBQUNrQixLQUFLLEtBQUt4RCxXQUNsQixJQUFJLENBQUN3RCxLQUFLLEdBQUdwRSx3REFBYUEsQ0FBQyxJQUFJLEdBQVUsK0JBQStCO1lBQ3pFLE9BQU8sSUFBSSxDQUFDb0UsS0FBSztRQUNsQjtJQUNEO0lBRUEsT0FBTzdCO0FBQ1I7QUFFQSxTQUFTUSxZQUFZcEIsR0FBMEM7SUFFOUQsSUFBR0EsZUFBZTBDLGVBQ2pCLE9BQU8xQztJQUNSLElBQUlBLGVBQWUyQyxrQkFDbEIsT0FBTzNDLElBQUk0QyxLQUFLO0lBRWpCLElBQUlDLFFBQVEsSUFBSUg7SUFDaEIsSUFBSSxPQUFPMUMsUUFBUSxVQUFXO1FBQzdCNkMsTUFBTUMsV0FBVyxDQUFDOUMsTUFBTSxzQkFBc0I7UUFDOUMsT0FBTzZDO0lBQ1I7SUFFQSxNQUFNLElBQUl4QyxNQUFNO0FBQ2pCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2T2lEO0FBQ1I7QUFFOEM7QUFFdkYsSUFBSTZDLEtBQUs7QUFJVCxzQkFBc0I7QUFDdEIsTUFBTUMsWUFBWSxJQUFJVDtBQUVmLFNBQVNyRSxjQUNnQytFLElBQU87SUFDdEQsTUFBTSxFQUNMMUQsSUFBSSxFQUNKRyxLQUFLLEVBQ0xDLGVBQWUsRUFDZmdCLFdBQVcsRUFDWGIsTUFBTSxFQUNOLEdBQUdtRCxLQUFLdkMsT0FBTztJQVViLGNBQWM7SUFDakIsTUFBTXdDLE1BQU1DLE9BQU87SUFDbkIsTUFBTUMsTUFBTUQsT0FBTztJQUVuQixNQUFNRSxhQUFhakUsT0FBT2tFLFdBQVcsQ0FBRTVELE1BQU1vQixHQUFHLENBQUN5QyxDQUFBQSxJQUFLO1lBQUNBO1lBQUc7Z0JBRXpEQyxZQUFZO2dCQUNaQyxLQUFLO29CQUErQixPQUFPLElBQUssQ0FBMkJQLElBQUksQ0FBQ0s7Z0JBQUk7Z0JBQ3BGRyxLQUFLLFNBQVNsQyxLQUFrQjtvQkFBSSxPQUFPLElBQUssQ0FBMkI0QixJQUFJLENBQUNHLEdBQUcvQjtnQkFBUTtZQUM1RjtTQUFFO0lBRUYsTUFBTW1DO1FBR0MsS0FBSyxDQUFrQztRQUN2QyxTQUFTLENBQThCO1FBQ3ZDLE9BQU8sQ0FBK0M7UUFFdEQsQ0FBQ1QsSUFBSSxDQUFDVSxJQUFXLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDQSxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQ0EsS0FBSyxJQUFJO1FBQ3BEO1FBQ0EsQ0FBQ1IsSUFBSSxDQUFDUSxJQUFXLEVBQUVwQyxLQUFrQixFQUFDO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQ29DLE1BQU1wQyxRQUFRLHVEQUF1RDtRQUMxRjtRQUVBTixZQUFZMkMsSUFBb0MsRUFDbkRDLFFBQW9DLEVBQzlCQyxNQUFtRCxDQUFFO1lBRXZELElBQUksQ0FBQyxLQUFLLEdBQU9GO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUdDO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBR0M7WUFFZjNFLE9BQU80RSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUVYO1FBQy9CO0lBQ1A7SUFFQSxNQUFNWSxxQkFBcUIsSUFBSUM7SUFFNUIsTUFBTUMsWUFBWSxJQUFJL0QsUUFBZSxPQUFPZ0U7UUFFeEMsTUFBTXRCLDREQUFvQkE7UUFDMUIsTUFBTTFDLFFBQVFpRSxHQUFHLENBQUNwQixLQUFLdkMsT0FBTyxDQUFDcEIsSUFBSTtRQUVuQ2dGLFVBQVU7UUFFVkY7SUFDSjtJQUVBLGtDQUFrQztJQUNsQyxJQUFJRSxVQUFVckIsS0FBS3ZDLE9BQU8sQ0FBQ3BCLElBQUksQ0FBQ1QsTUFBTSxJQUFJLEtBQUtnRSwwREFBa0JBO0lBRXBFLE1BQU14RCxTQUFTNEQsS0FBS3ZDLE9BQU8sQ0FBQ3JCLE1BQU0sRUFBRSxrREFBa0Q7SUFFdEYsRUFBRTtJQUVGLE1BQU1rRixtQkFBbUJuRSxRQUFRaUUsR0FBRyxDQUFDcEIsS0FBS3ZDLE9BQU8sQ0FBQ3BCLElBQUk7SUFDdEQsSUFBSWtGLGlCQUFpQjtJQUNuQjtRQUNELE1BQU1EO1FBQ05DLGlCQUFpQjtJQUNsQjtJQUVBLE1BQU1DLHFCQUFzQmxGO1FBRTNCLGtDQUFrQztRQUN6QjhCLFFBQVEsSUFBSyxDQUFTQSxLQUFLLElBQUksSUFBSXVCLDZDQUFTQSxDQUFDLElBQUksRUFBRTtRQUU1RCwrREFBK0Q7UUFFL0QsT0FBZ0IyQixtQkFBbUJBLGlCQUFpQjtRQUNwRCxXQUFXQyxpQkFBaUI7WUFDM0IsT0FBT0E7UUFDUjtRQUVBLGlFQUFpRTtRQUNqRSxPQUFPRSxPQUFPekIsS0FBSztRQUVuQixLQUFLLEdBQWEsS0FBSztRQUN2QixJQUFJMEIsT0FBTztZQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFDbEI7UUFFQSxJQUFJQyxnQkFBZ0I7WUFDbkIsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLO1FBQ3ZCO1FBQ1NDLGdCQUEwQztRQUNuRCx5QkFBeUIsQ0FBQztRQUUxQkMsV0FBV3pGLFNBQTBCLENBQUMsQ0FBQyxFQUFFO1lBRXhDLElBQUksSUFBSSxDQUFDdUYsYUFBYSxFQUNyQixNQUFNLElBQUkxRSxNQUFNO1lBQ1IsSUFBSSxDQUFFLElBQU0sQ0FBQ2dCLFdBQVcsQ0FBU3NELGNBQWMsRUFDM0MsTUFBTSxJQUFJdEUsTUFBTTtZQUU3QmQsT0FBTzJDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFMUM7WUFFNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMwRixJQUFJO1lBRXRCLElBQUksSUFBSSxDQUFDOUMsV0FBVyxFQUNuQixJQUFLLENBQUMsS0FBSyxDQUFTQyxjQUFjO1lBRW5DLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFDbEI7UUFFQSxvQ0FBb0M7UUFDM0IsT0FBTyxHQUFXN0MsT0FBTztRQUVsQyxJQUFJQSxTQUFpQjtZQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPO1FBQ3BCO1FBRWF5QyxhQUFhekMsTUFBb0MsRUFBRTtZQUMvRCxJQUFJLElBQUksQ0FBQ3VGLGFBQWEsRUFDVCxhQUFhO1lBQ3pCLE9BQU8sSUFBSSxDQUFDRCxJQUFJLENBQUU3QyxZQUFZLENBQUN6QztZQUV2QixpQ0FBaUM7WUFDMUNELE9BQU8yQyxNQUFNLENBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTFDO1FBQzlCO1FBQ0EsZ0RBQWdEO1FBRWhELFdBQVcsR0FBRyxNQUFNO1FBRXBCLFdBQVcsR0FBVyxDQUFDLEVBQWdDO1FBQ3ZELG1CQUFtQixHQUFHLENBQUMsRUFBZ0M7UUFDdkQsTUFBTSxHQUFHLElBQUlzRSxXQUNaLElBQUksQ0FBQyxXQUFXLEVBQ2hCLElBQUksQ0FBQyxtQkFBbUIsRUFDeEIsQ0FBQ0MsTUFBYXBDO1lBRWIsSUFBSSxDQUFDLFdBQVcsQ0FBQ29DLEtBQUssR0FBR3BDO1lBRXpCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxpQ0FBaUM7WUFDMUQsSUFBSUEsVUFBVSxNQUNiLElBQUksQ0FBQ3dELGVBQWUsQ0FBQ3BCO2lCQUVyQixJQUFJLENBQUNxQixZQUFZLENBQUNyQixNQUFNcEM7UUFDMUIsR0FDMEM7UUFFM0NGLGVBQWVzQyxJQUFXLEVBQUVwQyxLQUFrQixFQUFFO1lBQy9DLElBQUlBLFVBQVUsTUFDYixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQ29DLEtBQUs7aUJBRXJDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQ0EsS0FBSyxHQUFHcEM7UUFDbkM7UUFFQSxJQUFJOUIsUUFBOEM7WUFFakQsT0FBTyxJQUFJLENBQUMsTUFBTTtRQUNuQjtRQUVBLDZDQUE2QztRQUU3QyxRQUFRLEdBQXlCLEtBQUs7UUFFdEMsSUFBSWYsVUFBVTtZQUNiLE9BQU8sSUFBSSxDQUFDLFFBQVE7UUFDckI7UUFFQXVHLFFBQVF0QixJQUFZLEVBQUU7WUFDckIsT0FBTyxJQUFJLENBQUN1QixTQUFTLEdBQ2pCLElBQUksQ0FBQyxRQUFRLEVBQUVDLGNBQWMsQ0FBQyxPQUFPLEVBQUV4QixLQUFLLENBQUMsQ0FBQyxJQUM5QyxJQUFJLENBQUMsUUFBUSxFQUFFd0IsY0FBYyxDQUFDLE9BQU8sRUFBRXhCLEtBQUssRUFBRSxDQUFDO1FBQ3BEO1FBQ0F5QixTQUFTekIsSUFBWSxFQUFFO1lBQ3RCLE9BQU8sSUFBSSxDQUFDdUIsU0FBUyxHQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFRyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUxQixLQUFLLENBQUMsQ0FBQyxJQUNqRCxJQUFJLENBQUMsUUFBUSxFQUFFMEIsaUJBQWlCLENBQUMsT0FBTyxFQUFFMUIsS0FBSyxFQUFFLENBQUM7UUFDdkQ7UUFFQSxJQUFjdUIsWUFBcUI7WUFDbEMsT0FBT3JGLFdBQVc7UUFDbkI7UUFFQSxXQUFXLEdBRVgsSUFBSXlGLGNBQWM7WUFFakIsSUFBRyxJQUFJLENBQUNKLFNBQVMsSUFBSSxDQUFFLElBQUksQ0FBQ0ssWUFBWSxDQUFDLE9BQ3hDLE9BQU8sSUFBSSxDQUFDQyxPQUFPO1lBRXBCLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQ0EsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUNDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMxRDtRQUVBLDBDQUEwQztRQUUxQ3hFLFlBQVk3QixNQUFVLEVBQUVzRixJQUFzQixDQUFFO1lBQy9DLEtBQUs7WUFFTHZGLE9BQU8yQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTFDO1lBRTVCLElBQUksRUFBQ3NHLE9BQU8sRUFBRUMsT0FBTyxFQUFDLEdBQUd4RixRQUFReUYsYUFBYTtZQUU5QyxJQUFJLENBQUNoQixlQUFlLEdBQUdjO1lBQ3ZCLElBQUksQ0FBQyx5QkFBeUIsR0FBR0M7WUFFakMsSUFBSWpCLFNBQVM3RixXQUFXO2dCQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHNkY7Z0JBQ2IsSUFBSSxDQUFDSSxJQUFJLElBQUksb0JBQW9CO1lBQ2xDO1lBRUEsSUFBSSwwQkFBMEIsSUFBSSxFQUNqQyxJQUFLLENBQUNlLG9CQUFvQjtRQUM1QjtRQUVBLDJEQUEyRDtRQUUzRHpELHVCQUF1QjtZQUNyQixJQUFJLENBQUNzQyxJQUFJLENBQVV2QyxpQkFBaUI7UUFDdEM7UUFFQUQsb0JBQW9CO1lBRW5CLDJCQUEyQjtZQUMzQixJQUFJLElBQUksQ0FBQ3lDLGFBQWEsRUFBRztnQkFDeEIsSUFBSSxDQUFDRCxJQUFJLENBQUV6QyxjQUFjO2dCQUN6QjtZQUNEO1lBRUEsMkJBQTJCO1lBQzNCLElBQUksSUFBSSxDQUFDYixLQUFLLENBQUNpRCxPQUFPLEVBQUc7Z0JBQ3hCLElBQUksQ0FBQ1EsVUFBVSxJQUFJLHFDQUFxQztnQkFDeEQ7WUFDRDtZQUVFO2dCQUVELE1BQU0sSUFBSSxDQUFDekQsS0FBSyxDQUFDaUQsT0FBTztnQkFFeEIsSUFBSSxDQUFFLElBQUksQ0FBQ00sYUFBYSxFQUN2QixJQUFJLENBQUNFLFVBQVU7WUFFakI7UUFDRDtRQUVRQyxPQUFPO1lBRWRnQixlQUFlQyxPQUFPLENBQUMsSUFBSTtZQUVsQixvREFBb0Q7WUFFN0QsU0FBUztZQUNULElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSTtZQUNwQixJQUFJbEcsV0FBVyxRQUFRO2dCQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQ21HLFlBQVksQ0FBQztvQkFBQ0MsTUFBTXBHO2dCQUFNO1lBRS9DLFlBQVk7WUFDWix3REFBd0Q7WUFDeEQsWUFBWTtZQUNaLDJEQUEyRDtZQUM1RDtZQUVBLFFBQVE7WUFDUixLQUFJLElBQUlxRyxPQUFPekcsTUFDZCxJQUFJLENBQUMsV0FBVyxDQUFDeUcsSUFBYSxHQUFHLElBQUksQ0FBQ1QsWUFBWSxDQUFDUztZQUVwRCxNQUFNO1lBQ04sSUFBSXJHLFdBQVcsUUFDZCxJQUFLLENBQUMsUUFBUSxDQUFnQnNHLGtCQUFrQixDQUFDN0YsSUFBSSxDQUFDeUM7WUFDdkQsSUFBSXJDLFlBQVk5QixNQUFNLEVBQUc7Z0JBRXhCLElBQUlpQixXQUFXLFFBQ2QsSUFBSyxDQUFDLFFBQVEsQ0FBZ0JzRyxrQkFBa0IsQ0FBQzdGLElBQUksSUFBSUk7cUJBQ3JEO29CQUVKLE1BQU0wRixjQUFjLElBQUksQ0FBQ2QsV0FBVztvQkFFcEMsd0JBQXdCO29CQUN4QixJQUFJLENBQUV0QixtQkFBbUJxQyxHQUFHLENBQUNELGNBQWU7d0JBRTNDLElBQUkzRCxRQUFRNkQsU0FBU0MsYUFBYSxDQUFDO3dCQUVuQzlELE1BQU11QyxZQUFZLENBQUMsT0FBT29CO3dCQUUxQixJQUFJSSxtQkFBbUI7d0JBRXZCLEtBQUksSUFBSS9ELFNBQVMvQixZQUNoQixLQUFJLElBQUkrRixRQUFRaEUsTUFBTWlFLFFBQVEsQ0FDN0JGLG9CQUFvQkMsS0FBS0UsT0FBTyxHQUFHO3dCQUVyQ2xFLE1BQU1tRSxTQUFTLEdBQUdKLGlCQUFpQkssT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUVULFlBQVksQ0FBQyxDQUFDO3dCQUV6RUUsU0FBU1EsSUFBSSxDQUFDQyxNQUFNLENBQUN0RTt3QkFFckJ1QixtQkFBbUJnRCxHQUFHLENBQUNaO29CQUN4QjtnQkFDRDtZQUNEO1lBRUEsVUFBVTtZQUNWLE1BQU0xSCxVQUFVZ0IsZ0JBQWdCLElBQUksQ0FBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQ0wsTUFBTSxFQUFFLElBQUk7WUFDN0QsSUFBSVYsWUFBWUcsV0FDZixJQUFJLENBQUMsUUFBUSxDQUFDa0ksTUFBTSxDQUFFckk7WUFFcEIsUUFBUTtZQUVSLHlDQUF5QztZQUM1Q0gsc0RBQVdBLENBQUMsSUFBSTtZQUNiLElBQUkwSSxNQUFNLElBQUksQ0FBQ3ZDLElBQUksS0FBSyxPQUFPLElBQUkxQixTQUFTLElBQUksQ0FBQzBCLElBQUk7WUFFeEQsSUFBSSxDQUFDLEtBQUssR0FBR3VDO1lBRWIsZUFBZTtZQUNmLElBQUksSUFBSSxDQUFDL0IsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUNnQyxVQUFVLENBQUN0SSxNQUFNLEtBQUssR0FDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQ21JLE1BQU0sQ0FBRVQsU0FBU0MsYUFBYSxDQUFDO1lBRTlDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUM3QixJQUFJO1lBRXhDLE9BQU8sSUFBSSxDQUFDQSxJQUFJO1FBQ2pCO1FBSUEsUUFBUTtRQUVSLE9BQU9sRixxQkFBcUJDLE1BQU07UUFDbENtQyx5QkFBeUIrQixJQUFlLEVBQ2pDd0QsUUFBZ0IsRUFDaEJDLFFBQWdCLEVBQUU7WUFFeEIsSUFBRyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHO2dCQUNuQjtZQUNEO1lBRUEsSUFBSSxDQUFDLFdBQVcsQ0FBQ3pELEtBQUssR0FBR3lEO1lBQ3pCLElBQUksQ0FBRSxJQUFJLENBQUN6QyxhQUFhLEVBQ3ZCO1lBRUQsSUFBSSxJQUFLLENBQUNELElBQUksQ0FBVWxELGFBQWEsQ0FBQ21DLE1BQU13RCxVQUFVQyxjQUFjLE9BQU87Z0JBQzFFLElBQUksQ0FBQyxNQUFNLENBQUN6RCxLQUFLLEdBQUd3RCxVQUFVLHFCQUFxQjtZQUNwRDtRQUNEO0lBQ0Q7O0lBRUEsT0FBTzNDO0FBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pYQSxtREFBbUQ7QUFDbkQsbURBQW1EO0FBQ25ELG1EQUFtRDtBQUVuRCwyQ0FBMkM7QUFFZDtBQUVjO0FBWXBDLFNBQVM2QyxPQUNUQyxPQUFzQixFQUN0QkMsY0FBaUI7SUFDdkIsTUFBTUMsUUFBU0QsZUFBZTlHLE9BQU8sQ0FBQ25CLElBQUk7SUFDMUMsSUFBSW1JLFVBQVd0Six3REFBZ0JBLENBQUNxSixVQUFRM0k7SUFFeEMsTUFBTTZJLFlBQVlILGVBQWVwRyxJQUFJLEVBQUUsMkNBQTJDO0lBRWxGLE1BQU13RyxPQUFPRixZQUFZNUksWUFBWSxDQUFDLElBQ3pCO1FBQUNJLFNBQVN3STtJQUFPO0lBRTlCM0IsZUFBZXVCLE1BQU0sQ0FBQ0MsU0FBU0ksV0FBV0M7QUFDM0M7QUFHQSxlQUFlQyxZQUFZTixPQUFlLEVBQUVPLFFBQXFCO0lBRWhFLE1BQU0vQixlQUFlOEIsV0FBVyxDQUFDTjtJQUVqQyxJQUFJTyxhQUFhaEosV0FDaEJnSjtJQUVEO0FBQ0Q7QUFDQSxlQUFlQyxlQUFlQyxRQUEyQixFQUFFRixRQUFxQjtJQUUvRSxNQUFNMUgsUUFBUWlFLEdBQUcsQ0FBRTJELFNBQVNsSCxHQUFHLENBQUVtSCxDQUFBQSxJQUFLbEMsZUFBZThCLFdBQVcsQ0FBQ0k7SUFFakUsSUFBSUgsYUFBYWhKLFdBQ2hCZ0o7QUFFRjtBQUVBLFNBQVNJLFVBQVV0RSxJQUFZO0lBQzlCLE9BQU9tQyxlQUFldEMsR0FBRyxDQUFDRztBQUMzQjtBQUdPLFNBQVN1RSxRQUFTQyxPQUFnQjtJQUV4QyxNQUFNeEUsT0FBT3dFLFFBQVExQyxZQUFZLENBQUMsU0FBUzBDLFFBQVEzQyxPQUFPLENBQUM0QyxXQUFXO0lBRXRFLElBQUksQ0FBRXpFLEtBQUswRSxRQUFRLENBQUMsTUFDbkIsTUFBTSxJQUFJcEksTUFBTSxDQUFDLFFBQVEsRUFBRTBELEtBQUssc0JBQXNCLENBQUM7SUFFeEQsT0FBT0E7QUFDUjtBQUVBM0UsZ0RBQUlBLENBQUNxSSxNQUFNLEdBQVdBO0FBQ3RCckksZ0RBQUlBLENBQUM0SSxXQUFXLEdBQU1BO0FBQ3RCNUksZ0RBQUlBLENBQUM4SSxjQUFjLEdBQUdBO0FBQ3RCOUksZ0RBQUlBLENBQUNpSixTQUFTLEdBQVFBO0FBQ3RCakosZ0RBQUlBLENBQUNrSixPQUFPLEdBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2RW1CO0FBRWxDLE1BQU1LO0FBQU87QUFFcEIsaUVBQWV2SixJQUFJQSxFQUF3QjtBQXVCcEMsU0FBU0EsS0FBSzJJLElBQVM7SUFFMUIsSUFBSUEsS0FBSzFJLE9BQU8sS0FBS0osYUFBYSxVQUFVOEksS0FBSzFJLE9BQU8sRUFDcEQsT0FBT0MsU0FBU3lJO0lBRXBCLE9BQU9XLCtDQUFLQSxDQUFDWDtBQUNqQjtBQUVBLFNBQVN6SSxTQVc4Q3lJLElBQTJEO0lBRTlHLElBQUlBLEtBQUsxSSxPQUFPLEtBQUtKLFdBQ2pCLE1BQU0sSUFBSW9CLE1BQU07SUFFcEIsTUFBTXlFLE9BQU9pRCxLQUFLMUksT0FBTyxDQUFDd0IsT0FBTztJQUVqQyxNQUFNbkIsT0FBT3FJLEtBQUtySSxJQUFJLElBQUlvRixLQUFLcEYsSUFBSTtJQUVuQyxJQUFJRCxPQUFPcUYsS0FBS3JGLElBQUk7SUFDcEIsSUFBSXNJLEtBQUt0SSxJQUFJLEtBQUtSLFdBQ2RRLE9BQU87V0FBSUE7V0FBU3NJLEtBQUt0SSxJQUFJO0tBQUM7SUFFbEMsSUFBSUksUUFBUWlGLEtBQUtqRixLQUFLO0lBQ3RCLElBQUlrSSxLQUFLbEksS0FBSyxLQUFLWixXQUNmWSxRQUFRO1dBQUlBO1dBQVVrSSxLQUFLbEksS0FBSztLQUFDO0lBRXJDLElBQUlMLFNBQVNzRixLQUFLdEYsTUFBTTtJQUN4QixJQUFJdUksS0FBS3ZJLE1BQU0sS0FBS1AsV0FDaEJPLFNBQVNELE9BQU8yQyxNQUFNLENBQUMxQyxRQUFRdUksS0FBS3ZJLE1BQU07SUFFOUMsMERBQTBEO0lBQzFELElBQUlNLGtCQUFrQmdGLEtBQUtoRixlQUFlO0lBQzFDLElBQUlpSSxLQUFLakosT0FBTyxLQUFLRyxXQUNqQixhQUFhO0lBQ2JhLGtCQUFrQmlJLEtBQUtqSSxlQUFlLENBQUdpSSxLQUFLakosT0FBTztJQUV6RCxJQUFJZ0MsY0FBY2dFLEtBQUtoRSxXQUFXO0lBQ2xDLElBQUlpSCxLQUFLL0gsR0FBRyxLQUFLZixXQUNiLGFBQWE7SUFDYjZCLGNBQWM7V0FBSUE7V0FBZ0JpSCxLQUFLL0gsR0FBRztLQUFDO0lBRS9DLE1BQU1DLFNBQVM4SCxLQUFLOUgsTUFBTSxJQUFJNkUsS0FBSzdFLE1BQU07SUFFekMsTUFBTTJJLHFCQUFxQmIsS0FBSzFJLE9BQU87UUFFbkMsT0FBeUJ3QixVQUFVO1lBQ3hDbkI7WUFDQUQ7WUFDQUk7WUFDQUw7WUFDQU07WUFDQWdCO1lBQ0FiO1FBQ0QsRUFBRTtJQUdBO0lBRUEsT0FBTzJJO0FBQ1gsRUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNJcUM7QUFDSjtBQUVEO0FBQ0Q7QUFFeEIsTUFBTUMsa0JBQWtCekosK0NBQUlBLENBQUM7SUFDbkNTLE9BQU87UUFBQztRQUFPO0tBQUs7SUFDcEJJLFFBQVEzQiw2Q0FBU0EsQ0FBQzZCLElBQUk7SUFDdEJILEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztBQUNoQztJQUVVLFVBQVUsR0FBRyxJQUFJcUUsTUFBYztJQUMvQixVQUFVLENBQVM7SUFDbkIsR0FBRyxDQUFnQjtJQUU1QmhELGFBQWM7UUFFYixLQUFLO1FBRUwsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJZCxRQUFTLE9BQU93RjtZQUU5QixNQUFNK0MsVUFBVUMsYUFBYSxDQUFDQyxRQUFRLENBQUMsSUFBSSxDQUFDbkosS0FBSyxDQUFDb0osRUFBRSxJQUFJLFVBQVU7Z0JBQUNDLE9BQU87WUFBRztZQUU3RSxJQUFJSixVQUFVQyxhQUFhLENBQUNJLFVBQVUsRUFBRztnQkFDeENwRDtnQkFDQTtZQUNEO1lBRUErQyxVQUFVQyxhQUFhLENBQUNLLGdCQUFnQixDQUFDLG9CQUFvQjtnQkFDNURyRDtZQUNEO1FBQ0Q7UUFHQSxNQUFNc0QsTUFBTSxJQUFJLENBQUN4SixLQUFLLENBQUN3SixHQUFHO1FBQzFCLElBQUdBLFFBQVEsTUFDVixNQUFNLElBQUloSixNQUFNO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUdnSixHQUFHLENBQUMsRUFBRSxLQUFLLE1BQ3JCLENBQUMsRUFBRUMsT0FBT0MsUUFBUSxDQUFDQyxRQUFRLENBQUMsRUFBRUgsSUFBSSxDQUFDLEdBQ25DQTtRQUVSLElBQUlJLGlCQUFrQixDQUFDQztZQUV0QixLQUFJLElBQUlDLFlBQVlELFVBQ25CLEtBQUksSUFBSUUsWUFBWUQsU0FBU0UsVUFBVSxDQUN0QyxJQUFHRCxvQkFBb0JFLFNBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUNGLFNBQVNoRSxPQUFPO1FBRWpDLEdBQUdtRSxPQUFPLENBQUVyRCxVQUFVO1lBQUVzRCxXQUFVO1lBQU1DLFNBQVE7UUFBSztRQUdyRCxLQUFLLElBQUlDLFFBQVF4RCxTQUFTakIsZ0JBQWdCLENBQUMsS0FDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQ3lFLEtBQUt0RSxPQUFPO0lBQzNCO0lBR2F1RSxZQUFZO1FBQ3hCLE9BQU87WUFDTjtZQUNBO1lBQ0E7U0FDQTtJQUNDO0lBRU9DLG1CQUFtQjFDLE9BQWUsRUFBRTJDLEtBQTBCLEVBQUV0QyxJQUE2QyxFQUFFO1FBRXhILE1BQU11QyxLQUFLRCxLQUFLLENBQUMsV0FBVztRQUM1QixNQUFNdkwsVUFBVXVMLEtBQUssQ0FBQyxhQUFhO1FBRW5DLElBQUlFLFFBQXVDO1FBQzNDLElBQUlELE9BQU9yTCxXQUNWc0wsUUFBUUQsR0FBR3ZDO2FBQ1AsSUFBSWpKLFlBQVlHLFdBQVk7WUFFL0I4SSxLQUFhakksZUFBZSxHQUFHLENBQUMwSztnQkFFaEMsTUFBTTFMLFVBQVVMLDRDQUFJLENBQUMsRUFBRStMLElBQUksQ0FBQztnQkFFNUIsSUFBSUMsUUFBUTNMLFFBQVEyRyxnQkFBZ0IsQ0FBQztnQkFFckMsT0FBTyxDQUFDaUYsSUFBYUMsSUFBWVQ7b0JBRWhDLHNCQUFzQjtvQkFDdEIsS0FBSSxJQUFJVSxRQUFRSCxNQUNmRyxLQUFLQyxXQUFXLEdBQUdYLEtBQUtyRSxZQUFZLENBQUMrRSxLQUFLL0UsWUFBWSxDQUFDO29CQUV4RCxPQUFPL0csUUFBUUssU0FBUyxDQUFDO2dCQUMxQjtZQUVEO1lBRUFvTCxRQUFRLE1BQU1PLHFCQUFxQjFMLCtDQUFJQSxDQUFDMkk7WUFBTztRQUNoRDtRQUVBLElBQUd3QyxVQUFVLE1BQ1osTUFBTSxJQUFJbEssTUFBTSxDQUFDLCtCQUErQixFQUFFcUgsUUFBUSxDQUFDLENBQUM7UUFFN0QsT0FBT0QsOENBQU1BLENBQUNDLFNBQVM2QztJQUN4QjtJQUVBLE1BQU0sT0FBTyxDQUFDN0MsT0FBZTtRQUU1QkEsVUFBVUEsUUFBUWMsV0FBVztRQUU3QixJQUFJZCxZQUFZLGVBQWVBLFlBQVksZ0JBQWdCLENBQUVBLFFBQVFlLFFBQVEsQ0FBQyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUNoQyxHQUFHLENBQUVpQixVQUMxRztRQUVELElBQUksQ0FBQyxVQUFVLENBQUNOLEdBQUcsQ0FBQ007UUFFcEIsTUFBTSxJQUFJLENBQUMsR0FBRyxFQUFFLDBCQUEwQjtRQUUxQyxNQUFNcUQsWUFBWSxJQUFJLENBQUNaLFNBQVM7UUFDaEMsTUFBTUEsWUFBWSxNQUFNNUosUUFBUWlFLEdBQUcsQ0FBRXVHLFVBQVU5SixHQUFHLENBQUUrSixDQUFBQSxPQUFRQSxLQUFLQyxRQUFRLENBQUMsU0FDN0RDLFFBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFeEQsUUFBUSxDQUFDLEVBQUVzRCxLQUFLLENBQUMsRUFBRSxRQUNwREcsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUV6RCxRQUFRLENBQUMsRUFBRXNELEtBQUssQ0FBQyxFQUFFO1FBRWpFLE1BQU1YLFFBQTZCLENBQUM7UUFDcEMsSUFBSSxJQUFJZSxJQUFJLEdBQUdBLElBQUlMLFVBQVUvTCxNQUFNLEVBQUUsRUFBRW9NLEVBQ3RDLElBQUlqQixTQUFTLENBQUNpQixFQUFFLEtBQUtuTSxXQUNwQm9MLEtBQUssQ0FBQ1UsU0FBUyxDQUFDSyxFQUFFLENBQUMsR0FBR2pCLFNBQVMsQ0FBQ2lCLEVBQUU7UUFFcEMsTUFBTXRNLFVBQVV1TCxLQUFLLENBQUMsYUFBYTtRQUNuQyxNQUFNckssTUFBVXFLLEtBQUssQ0FBQyxZQUFZO1FBRWxDLE1BQU10QyxPQUFnRDtZQUNyRCxHQUFHakosWUFBWUcsYUFBYTtnQkFBQ0g7WUFBTyxDQUFDO1lBQ3JDLEdBQUdrQixRQUFZZixhQUFhO2dCQUFDZTtZQUFHLENBQUM7UUFDbEM7UUFFQSxPQUFPLElBQUksQ0FBQ29LLGtCQUFrQixDQUFDMUMsU0FBUzJDLE9BQU90QztJQUVoRDtBQUNEO0FBRUEsaUNBQWlDO0FBQ2pDLElBQUk3QixlQUFldEMsR0FBRyxDQUFDLGlCQUFpQjNFLFdBQ3ZDd0ksOENBQU1BLENBQUMsYUFBYW9CO0FBT3JCLG1EQUFtRDtBQUNuRCxtREFBbUQ7QUFDbkQsbURBQW1EO0FBRW5ELGVBQWVzQyxXQUFXRSxHQUFlLEVBQUVDLGFBQXNCLEtBQUs7SUFFckUsTUFBTUMsVUFBVUQsYUFDVDtRQUFDRSxTQUFRO1lBQUMsYUFBYTtRQUFNO0lBQUMsSUFDOUIsQ0FBQztJQUdSLE1BQU1DLFdBQVcsTUFBTUMsTUFBTUwsS0FBS0U7SUFDbEMsSUFBR0UsU0FBU0UsTUFBTSxLQUFLLEtBQ3RCLE9BQU8xTTtJQUVSLElBQUlxTSxjQUFjRyxTQUFTRCxPQUFPLENBQUM1SCxHQUFHLENBQUMsY0FBZSxPQUNyRCxPQUFPM0U7SUFFUixPQUFPLE1BQU13TSxTQUFTOUssSUFBSTtBQUMzQjtBQUNBLGVBQWV1SyxRQUFRRyxHQUFXLEVBQUVDLGFBQXNCLEtBQUs7SUFFOUQsaUNBQWlDO0lBQ2pDLElBQUdBLGNBQWMsTUFBTUgsV0FBV0UsS0FBS0MsZ0JBQWdCck0sV0FDdEQsT0FBT0E7SUFFUixJQUFJO1FBQ0gsT0FBTyxDQUFDLE1BQU0sTUFBTSxDQUFDLHVCQUF1QixHQUFHb00sSUFBRyxFQUFHTyxPQUFPO0lBQzdELEVBQUUsT0FBTUMsR0FBRztRQUNWQyxRQUFRQyxHQUFHLENBQUNGO1FBQ1osT0FBTzVNO0lBQ1I7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaExzRDtBQUcvQyxTQUFTUixLQUE2QytMLEdBQXNCLEVBQUUsR0FBR2xKLElBQVc7SUFFL0YsSUFBSTJLLFNBQVN6QixHQUFHLENBQUMsRUFBRTtJQUNuQixJQUFJLElBQUlZLElBQUksR0FBR0EsSUFBSTlKLEtBQUt0QyxNQUFNLEVBQUUsRUFBRW9NLEVBQUc7UUFDakNhLFVBQVUsQ0FBQyxFQUFFM0ssSUFBSSxDQUFDOEosRUFBRSxDQUFDLENBQUM7UUFDdEJhLFVBQVUsQ0FBQyxFQUFFekIsR0FBRyxDQUFDWSxJQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZCLDBCQUEwQjtJQUM5QjtJQUVBLG9EQUFvRDtJQUNwRCxJQUFJYyxXQUFXeEYsU0FBU0MsYUFBYSxDQUFDO0lBQ3RDLHVEQUF1RDtJQUN2RHVGLFNBQVNsRixTQUFTLEdBQUdpRixPQUFPbE4sSUFBSTtJQUVoQyxJQUFJbU4sU0FBU3BOLE9BQU8sQ0FBQ3dJLFVBQVUsQ0FBQ3RJLE1BQU0sS0FBSyxLQUFLa04sU0FBU3BOLE9BQU8sQ0FBQ3FOLFVBQVUsQ0FBRUMsUUFBUSxLQUFLQyxLQUFLQyxTQUFTLEVBQ3RHLE9BQU9KLFNBQVNwTixPQUFPLENBQUNxTixVQUFVO0lBRXBDLE9BQU9ELFNBQVNwTixPQUFPO0FBQzNCO0FBRU8sZUFBZXlOLEtBQXlCL0IsR0FBc0IsRUFBRSxHQUFHbEosSUFBVztJQUVqRixNQUFNNEksT0FBT3pMLEtBQUsrTCxRQUFRbEo7SUFFMUIsSUFBSTRJLGdCQUFnQnNDLGtCQUNsQixNQUFNLElBQUluTSxNQUFNLENBQUMsMkJBQTJCLENBQUM7SUFFL0MsT0FBTyxNQUFNNEUsa0RBQVVBLENBQUlpRjtBQUMvQjtBQUVPLFNBQVN1QyxTQUE2QmpDLEdBQXNCLEVBQUUsR0FBR2xKLElBQVc7SUFFL0UsTUFBTTRJLE9BQU96TCxLQUFLK0wsUUFBUWxKO0lBRTFCLElBQUk0SSxnQkFBZ0JzQyxrQkFDbEIsTUFBTSxJQUFJbk0sTUFBTSxDQUFDLDJCQUEyQixDQUFDO0lBRS9DLE9BQU8yTCxzREFBY0EsQ0FBSTlCO0FBQzdCO0NBb0JBLCtIQUErSDtDQUMvSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrSkE7Ozs7Ozs7Ozs7Ozs7QUMvTUEsbURBQW1EO0FBQ25ELG1EQUFtRDtBQUNuRCxtREFBbUQ7QUFFckI7QUFFNkI7QUFxQjNELFNBQVN3QyxjQUFjM0ksSUFBYTtJQUNuQyxJQUFHQSxTQUFTOUUsV0FDWCxPQUFPO0lBQ1IsT0FBTyxDQUFDLElBQUksRUFBRThFLEtBQUssT0FBTyxFQUFFQSxLQUFLLEdBQUcsQ0FBQztBQUN0QztBQUVBLFNBQVM0SSxTQUFTQyxRQUFnQixFQUFFQyxpQkFBOEQsRUFBRUMsU0FBNENwRyxRQUFRO0lBRXZKLElBQUltRyxzQkFBc0I1TixhQUFhLE9BQU80TixzQkFBc0IsVUFBVTtRQUM3RUMsU0FBU0Q7UUFDVEEsb0JBQW9CNU47SUFDckI7SUFFQSxPQUFPO1FBQUMsQ0FBQyxFQUFFMk4sU0FBUyxFQUFFRixjQUFjRyxtQkFBdUMsQ0FBQztRQUFFQztLQUFPO0FBQ3RGO0FBT0EsZUFBZUMsR0FBd0JILFFBQWdCLEVBQ2pEQyxpQkFBd0UsRUFDeEVDLFNBQThDcEcsUUFBUTtJQUUzRCxDQUFDa0csVUFBVUUsT0FBTyxHQUFHSCxTQUFTQyxVQUFVQyxtQkFBbUJDO0lBRTNELElBQUlFLFNBQVMsTUFBTUMsSUFBT0wsVUFBVUU7SUFDcEMsSUFBR0UsV0FBVyxNQUNiLE1BQU0sSUFBSTNNLE1BQU0sQ0FBQyxRQUFRLEVBQUV1TSxTQUFTLFVBQVUsQ0FBQztJQUVoRCxPQUFPSTtBQUNSO0FBT0EsZUFBZUMsSUFBeUJMLFFBQWdCLEVBQ2xEQyxpQkFBd0UsRUFDeEVDLFNBQThDcEcsUUFBUTtJQUUzRCxDQUFDa0csVUFBVUUsT0FBTyxHQUFHSCxTQUFTQyxVQUFVQyxtQkFBbUJDO0lBRTNELE1BQU12RSxVQUFVdUUsT0FBT3ZILGFBQWEsQ0FBY3FIO0lBQ2xELElBQUlyRSxZQUFZLE1BQ2YsT0FBTztJQUVSLE9BQU8sTUFBTXZELHVEQUFlQSxDQUFLdUQ7QUFDbEM7QUFPQSxlQUFlMkUsSUFBeUJOLFFBQWdCLEVBQ2xEQyxpQkFBd0UsRUFDeEVDLFNBQThDcEcsUUFBUTtJQUUzRCxDQUFDa0csVUFBVUUsT0FBTyxHQUFHSCxTQUFTQyxVQUFVQyxtQkFBbUJDO0lBRTNELE1BQU1LLFdBQVdMLE9BQU9ySCxnQkFBZ0IsQ0FBY21IO0lBRXRELElBQUl6TCxNQUFNO0lBQ1YsTUFBTWlNLFdBQVcsSUFBSXJNLE1BQW1Cb00sU0FBU25PLE1BQU07SUFDdkQsS0FBSSxJQUFJdUosV0FBVzRFLFNBQ2xCQyxRQUFRLENBQUNqTSxNQUFNLEdBQUc2RCx1REFBZUEsQ0FBS3VEO0lBRXZDLE9BQU8sTUFBTWhJLFFBQVFpRSxHQUFHLENBQUM0STtBQUMxQjtBQU9BLGVBQWVDLElBQXlCVCxRQUFnQixFQUNsREMsaUJBQThDLEVBQzlDdEUsT0FBbUI7SUFFeEIsTUFBTStFLE1BQU1YLFNBQVNDLFVBQVVDLG1CQUFtQnRFO0lBRWxELE1BQU15RSxTQUFTLEdBQUksQ0FBQyxFQUFFLENBQXdCTyxPQUFPLENBQWNELEdBQUcsQ0FBQyxFQUFFO0lBQ3pFLElBQUdOLFdBQVcsTUFDYixPQUFPO0lBRVIsT0FBTyxNQUFNaEksdURBQWVBLENBQUlnSTtBQUNqQztBQU9BLFNBQVNRLE9BQTRCWixRQUFnQixFQUMvQ0MsaUJBQXdFLEVBQ3hFQyxTQUE4Q3BHLFFBQVE7SUFFM0QsQ0FBQ2tHLFVBQVVFLE9BQU8sR0FBR0gsU0FBU0MsVUFBVUMsbUJBQW1CQztJQUUzRCxNQUFNdkUsVUFBVXVFLE9BQU92SCxhQUFhLENBQWNxSDtJQUVsRCxJQUFJckUsWUFBWSxNQUNmLE1BQU0sSUFBSWxJLE1BQU0sQ0FBQyxRQUFRLEVBQUV1TSxTQUFTLFVBQVUsQ0FBQztJQUVoRCxPQUFPWixzREFBY0EsQ0FBS3pEO0FBQzNCO0FBT0EsU0FBU2tGLFFBQTZCYixRQUFnQixFQUNoREMsaUJBQXdFLEVBQ3hFQyxTQUE4Q3BHLFFBQVE7SUFFM0QsQ0FBQ2tHLFVBQVVFLE9BQU8sR0FBR0gsU0FBU0MsVUFBVUMsbUJBQW1CQztJQUUzRCxNQUFNSyxXQUFXTCxPQUFPckgsZ0JBQWdCLENBQWNtSDtJQUV0RCxJQUFJekwsTUFBTTtJQUNWLE1BQU02TCxTQUFTLElBQUlqTSxNQUFVb00sU0FBU25PLE1BQU07SUFDNUMsS0FBSSxJQUFJdUosV0FBVzRFLFNBQ2xCSCxNQUFNLENBQUM3TCxNQUFNLEdBQUc2SyxzREFBY0EsQ0FBS3pEO0lBRXBDLE9BQU95RTtBQUNSO0FBT0EsU0FBU1UsUUFBNkJkLFFBQWdCLEVBQ2hEQyxpQkFBOEMsRUFDOUN0RSxPQUFtQjtJQUV4QixNQUFNK0UsTUFBTVgsU0FBU0MsVUFBVUMsbUJBQW1CdEU7SUFFbEQsTUFBTXlFLFNBQVMsR0FBSSxDQUFDLEVBQUUsQ0FBd0JPLE9BQU8sQ0FBY0QsR0FBRyxDQUFDLEVBQUU7SUFDekUsSUFBR04sV0FBVyxNQUNiLE9BQU87SUFFUixPQUFPaEIsc0RBQWNBLENBQUlnQjtBQUMxQjtBQUVBLHFCQUFxQjtBQUVyQixTQUFTTyxRQUEyQlgsUUFBZ0IsRUFBRXJFLE9BQWdCO0lBRXJFLE1BQU0sS0FBTTtRQUNYLElBQUl5RSxTQUFTekUsUUFBUWdGLE9BQU8sQ0FBSVg7UUFFaEMsSUFBSUksV0FBVyxNQUNkLE9BQU9BO1FBRVIsTUFBTVcsT0FBT3BGLFFBQVFxRixXQUFXO1FBQ2hDLElBQUksQ0FBRyxXQUFVRCxJQUFHLEdBQ25CLE9BQU87UUFFUnBGLFVBQVUsS0FBcUI3SSxJQUFJO0lBQ3BDO0FBQ0Q7QUFHQSxRQUFRO0FBQ1JOLGdEQUFJQSxDQUFDMk4sRUFBRSxHQUFJQTtBQUNYM04sZ0RBQUlBLENBQUM2TixHQUFHLEdBQUdBO0FBQ1g3TixnREFBSUEsQ0FBQzhOLEdBQUcsR0FBR0E7QUFDWDlOLGdEQUFJQSxDQUFDaU8sR0FBRyxHQUFHQTtBQUVYLE9BQU87QUFDUGpPLGdEQUFJQSxDQUFDb08sTUFBTSxHQUFJQTtBQUNmcE8sZ0RBQUlBLENBQUNxTyxPQUFPLEdBQUdBO0FBQ2ZyTyxnREFBSUEsQ0FBQ3NPLE9BQU8sR0FBR0E7QUFFZnRPLGdEQUFJQSxDQUFDbU8sT0FBTyxHQUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvTWM7QUFFWCxDQUFDLHVCQUF1QjtBQUMxQyxzQkFBc0I7QUFDdEIsYUFBYTtBQUNiLGtCQUFrQjtBQUNsQixpQkFBaUI7QUFHaUI7QUFDTjtBQUV5QjtBQUNyRCxpRUFBZW5PLGdEQUFJQSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ppRTs7VUFFaEYwTzs7SUFHRCxRQUFROzs7SUFJUixXQUFXOzs7R0FQVkEsVUFBQUE7QUFZRSxNQUFNQyxZQUE0QjtBQUNsQyxNQUFNQyxVQUEwQjtBQUNoQyxNQUFNQyxhQUE2QjtBQUNuQyxNQUFNQyxnQkFBZ0M7QUFFdEMsTUFBTW5MO0lBRVQsS0FBSyxDQUFtQjtJQUV4Qiw2Q0FBNkM7SUFDN0MxQixZQUFZNkksT0FBeUIsSUFBSSxDQUFFO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUdBO0lBQ2pCO0lBRUEsT0FBTzZELFVBQWNBLFFBQVE7SUFDN0IsT0FBT0MsUUFBY0EsTUFBTTtJQUMzQixPQUFPQyxXQUFjQSxTQUFTO0lBQzlCLE9BQU9DLGNBQWNBLFlBQVk7SUFFakNDLEdBQUczTSxLQUFZLEVBQUU7UUFFYixJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssTUFDZCxNQUFNLElBQUluQixNQUFNO1FBRXBCLE1BQU02SixPQUFPLElBQUksQ0FBQyxLQUFLO1FBRXZCLElBQUkxSSxRQUFRdU0sV0FBZSxDQUFFLElBQUksQ0FBQzFGLFNBQVMsRUFDdkMsT0FBTztRQUNYLElBQUk3RyxRQUFRd00sU0FBZSxDQUFFLElBQUksQ0FBQ3ZKLE9BQU8sRUFDckMsT0FBTztRQUNYLElBQUlqRCxRQUFReU0sWUFBZSxDQUFFLElBQUksQ0FBQ0csVUFBVSxFQUN4QyxPQUFPO1FBQ1gsSUFBSTVNLFFBQVEwTSxlQUFlLENBQUUsSUFBSSxDQUFDbkosYUFBYSxFQUMzQyxPQUFPO1FBRVgsT0FBTztJQUNYO0lBRUEsTUFBTXNKLEtBQUs3TSxLQUFZLEVBQUU7UUFFckIsSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJbkIsTUFBTTtRQUVwQixNQUFNNkosT0FBTyxJQUFJLENBQUMsS0FBSztRQUV2QixJQUFJa0QsV0FBVyxJQUFJck07UUFFbkIsSUFBSVMsUUFBUXVNLFNBQ1JYLFNBQVMxTSxJQUFJLENBQUUsSUFBSSxDQUFDc0gsV0FBVztRQUNuQyxJQUFJeEcsUUFBUXdNLE9BQ1JaLFNBQVMxTSxJQUFJLENBQUUsSUFBSSxDQUFDNE4sU0FBUztRQUNqQyxJQUFJOU0sUUFBUXlNLFVBQ1JiLFNBQVMxTSxJQUFJLENBQUUsSUFBSSxDQUFDNk4sWUFBWTtRQUNwQyxJQUFJL00sUUFBUTBNLGFBQ1JkLFNBQVMxTSxJQUFJLENBQUUsSUFBSSxDQUFDc0UsZUFBZTtRQUV2QyxNQUFNekUsUUFBUWlFLEdBQUcsQ0FBQzRJO0lBQ3RCO0lBRUEsNERBQTREO0lBRTVELElBQUkvRSxZQUFZO1FBQ1osSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJaEksTUFBTTtRQUVwQixPQUFPNkYsZUFBZXRDLEdBQUcsQ0FBRTBFLFFBQVEsSUFBSSxDQUFDLEtBQUssT0FBUXJKO0lBQ3pEO0lBRUEsTUFBTStJLGNBQTREO1FBQzlELElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSTNILE1BQU07UUFFcEIsT0FBTyxNQUFNNkYsZUFBZThCLFdBQVcsQ0FBRU0sUUFBUSxJQUFJLENBQUMsS0FBSztJQUMvRDtJQUVBLDBEQUEwRDtJQUUxRCxJQUFJN0QsVUFBVTtRQUVWLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSXBFLE1BQU07UUFDcEIsTUFBTTZKLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsSUFBSSxDQUFFLElBQUksQ0FBQzdCLFNBQVMsRUFDaEIsT0FBTztRQUVYLE1BQU05RyxPQUFPaU4sZ0JBQWdCdEU7UUFFN0IsSUFBSSxDQUFFbEgsMERBQWtCQSxJQUNwQixPQUFPO1FBRVgsT0FBT3pCLEtBQUtvRCxjQUFjO0lBQzlCO0lBRUEsTUFBTTJKLFlBQVk7UUFFZCxJQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssTUFDZCxNQUFNLElBQUlqTyxNQUFNO1FBRXBCLE1BQU02SixPQUFPLElBQUksQ0FBQyxLQUFLO1FBRXZCLE1BQU14SyxPQUFPLE1BQU0sSUFBSSxDQUFDc0ksV0FBVyxJQUFJLDZDQUE2QztRQUVwRixNQUFNNkYsd0RBQW9CQTtRQUUxQixNQUFNbk8sS0FBS2dGLGdCQUFnQjtJQUMvQjtJQUVBLDZEQUE2RDtJQUU3RCxJQUFJMEosYUFBYTtRQUViLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSS9OLE1BQU07UUFDcEIsTUFBTTZKLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsSUFBSSxDQUFFLElBQUksQ0FBQzdCLFNBQVMsRUFDaEIsT0FBTztRQUVYLE1BQU0zSSxPQUFPOE8sZ0JBQWdCdEU7UUFDN0IsT0FBT0EsZ0JBQWdCeEs7SUFDM0I7SUFFQSxNQUFNNk8sZUFBNkQ7UUFFL0QsSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJbE8sTUFBTTtRQUVwQixNQUFNNkosT0FBTyxJQUFJLENBQUMsS0FBSztRQUV2QixNQUFNeEssT0FBTyxNQUFNLElBQUksQ0FBQ3NJLFdBQVc7UUFFbkMsSUFBSWtDLGdCQUFnQnhLLE1BQ2hCLE9BQU93SztRQUVYLE9BQU87UUFFUCxJQUFJLG1CQUFtQkEsTUFBTTtZQUN6QixNQUFNQSxLQUFLdUUsYUFBYTtZQUN4QixPQUFPdkU7UUFDWDtRQUVBLE1BQU0sRUFBQ3BFLE9BQU8sRUFBRUMsT0FBTyxFQUFDLEdBQUd4RixRQUFReUYsYUFBYTtRQUUvQ2tFLEtBQWF1RSxhQUFhLEdBQVUzSTtRQUNwQ29FLEtBQWFqRSxvQkFBb0IsR0FBR0Y7UUFFckMsTUFBTUQ7UUFFTixPQUFPb0U7SUFDWDtJQUVBLGdFQUFnRTtJQUVoRSxJQUFJbkYsZ0JBQWdCO1FBRWhCLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxNQUNkLE1BQU0sSUFBSTFFLE1BQU07UUFDcEIsTUFBTTZKLE9BQU8sSUFBSSxDQUFDLEtBQUs7UUFFdkIsSUFBSSxDQUFFLElBQUksQ0FBQ2tFLFVBQVUsRUFDakIsT0FBTztRQUVYLE9BQU8sbUJBQW1CbEUsUUFBUUEsS0FBS25GLGFBQWE7SUFDeEQ7SUFFQSxNQUFNQyxrQkFBc0M7UUFFeEMsSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJM0UsTUFBTTtRQUNwQixNQUFNNkosT0FBTyxJQUFJLENBQUMsS0FBSztRQUV2QixNQUFNeEssT0FBTyxNQUFNLElBQUksQ0FBQzZPLFlBQVk7UUFFcEMsTUFBTTdPLEtBQUtzRixlQUFlO1FBRTFCLE9BQU8sS0FBc0JGLElBQUk7SUFDckM7SUFFQSxnRUFBZ0U7SUFFaEU0SixVQUFVO1FBRU4sSUFBRyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQ2QsTUFBTSxJQUFJck8sTUFBTTtRQUVwQixJQUFJbUIsUUFBZTtRQUVuQixJQUFJLElBQUksQ0FBQzZHLFNBQVMsRUFDZDdHLFNBQVN1TTtRQUNiLElBQUksSUFBSSxDQUFDdEosT0FBTyxFQUNaakQsU0FBU3dNO1FBQ2IsSUFBSSxJQUFJLENBQUNJLFVBQVUsRUFDZjVNLFNBQVN5TTtRQUNiLElBQUksSUFBSSxDQUFDbEosYUFBYSxFQUNsQnZELFNBQVMwTTtRQUViLE9BQU8xTTtJQUNYO0lBRUFtTixXQUFXO1FBRVAsTUFBTW5OLFFBQVEsSUFBSSxDQUFDa04sT0FBTztRQUMxQixJQUFJUCxLQUFLLElBQUlwTjtRQUViLElBQUlTLFFBQVF1TSxTQUNSSSxHQUFHek4sSUFBSSxDQUFDO1FBQ1osSUFBSWMsUUFBUXdNLE9BQ1JHLEdBQUd6TixJQUFJLENBQUM7UUFDWixJQUFJYyxRQUFReU0sVUFDUkUsR0FBR3pOLElBQUksQ0FBQztRQUNaLElBQUljLFFBQVEwTSxhQUNSQyxHQUFHek4sSUFBSSxDQUFDO1FBRVosT0FBT3lOLEdBQUdTLElBQUksQ0FBQztJQUNuQjtBQUNKO0FBRU8sU0FBU0MsU0FBUzNFLElBQWlCO0lBQ3RDLElBQUksV0FBV0EsTUFDWCxPQUFPQSxLQUFLMUksS0FBSztJQUVyQixPQUFPLEtBQWNBLEtBQUssR0FBRyxJQUFJdUIsVUFBVW1IO0FBQy9DO0FBRUEsNEVBQTRFO0FBRTVFLHNCQUFzQjtBQUNmLFNBQVN6QyxPQUNaQyxPQUFzQixFQUN0QkMsY0FBaUM7SUFFakMsbUJBQW1CO0lBQ25CLElBQUksVUFBVUEsZ0JBQWdCO1FBQzFCQSxpQkFBaUJBLGVBQWU5QyxJQUFJO0lBQ3hDO0lBRUEsTUFBTStDLFFBQVNELGVBQWU5RyxPQUFPLENBQUNuQixJQUFJO0lBQzFDLElBQUltSSxVQUFXdEosd0RBQWdCQSxDQUFDcUosVUFBUTNJO0lBRXhDLE1BQU02SSxZQUFZSCxlQUFlcEcsSUFBSSxFQUFFLDJDQUEyQztJQUVsRixNQUFNd0csT0FBT0YsWUFBWTVJLFlBQVksQ0FBQyxJQUN4QjtRQUFDSSxTQUFTd0k7SUFBTztJQUUvQjNCLGVBQWV1QixNQUFNLENBQUNDLFNBQVNJLFdBQVdDO0FBQzlDO0FBRUEsdUJBQXVCO0FBQ2hCLGVBQWU1QixRQUEwQytELElBQWlCLEVBQUU0RSxTQUFTLEtBQUs7SUFFN0YsTUFBTXROLFFBQVFxTixTQUFTM0U7SUFFdkIsSUFBSTFJLE1BQU00TSxVQUFVLElBQUlVLFFBQ3BCLE1BQU0sSUFBSXpPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUV2QyxNQUFNbUIsTUFBTXdHLFdBQVc7SUFFdkIsT0FBTytHLFlBQWU3RTtBQUMxQjtBQUVPLFNBQVM2RSxZQUE4QzdFLElBQWlCLEVBQUU0RSxTQUFTLEtBQUs7SUFFM0YsTUFBTXROLFFBQVFxTixTQUFTM0U7SUFFdkIsSUFBSTFJLE1BQU00TSxVQUFVLElBQUlVLFFBQ3BCLE1BQU0sSUFBSXpPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUV2QyxJQUFJLENBQUVtQixNQUFNNkcsU0FBUyxFQUNqQixNQUFNLElBQUloSSxNQUFNO0lBRXBCLElBQUk2SixLQUFLOEUsYUFBYSxLQUFLdEksVUFDdkJBLFNBQVN1SSxTQUFTLENBQUMvRTtJQUN2QmhFLGVBQWVDLE9BQU8sQ0FBQytEO0lBRXZCLE1BQU0zSSxPQUFPaU4sZ0JBQWdCdEU7SUFFN0IsSUFBSSxDQUFHQSxDQUFBQSxnQkFBZ0IzSSxJQUFHLEdBQ3RCLE1BQU0sSUFBSWxCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQztJQUU3QyxPQUFPNko7QUFDWDtBQUVBLDBCQUEwQjtBQUVuQixlQUFlakYsV0FBK0JpRixJQUE4QixFQUFFNEUsU0FBOEIsS0FBSztJQUVwSCxNQUFNdE4sUUFBUXFOLFNBQVMzRTtJQUV2QixJQUFJMUksTUFBTXVELGFBQWEsRUFBRztRQUN0QixJQUFJK0osV0FBVyxPQUNYLE9BQU8sS0FBY2hLLElBQUk7UUFDN0IsTUFBTSxJQUFJekUsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQzFDO0lBRUEsTUFBTVgsT0FBTyxNQUFNeUcsUUFBUStEO0lBRTNCLE1BQU0xSSxNQUFNOE0sU0FBUztJQUVyQixJQUFJOU8sU0FBUyxPQUFPc1AsV0FBVyxZQUFZLENBQUMsSUFBSUE7SUFDaERwUCxLQUFLdUYsVUFBVSxDQUFDekY7SUFFaEIsT0FBT0UsS0FBS29GLElBQUk7QUFDcEI7QUFDTyxTQUFTa0gsZUFBbUM5QixJQUE4QixFQUFFNEUsU0FBOEIsS0FBSztJQUVsSCxNQUFNdE4sUUFBUXFOLFNBQVMzRTtJQUN2QixJQUFJMUksTUFBTXVELGFBQWEsRUFBRztRQUN0QixJQUFJK0osV0FBVyxPQUNYLE9BQU8sS0FBY2hLLElBQUk7UUFDN0IsTUFBTSxJQUFJekUsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQzFDO0lBRUEsTUFBTVgsT0FBT3FQLFlBQVk3RTtJQUV6QixJQUFJLENBQUUxSSxNQUFNaUQsT0FBTyxFQUNmLE1BQU0sSUFBSXBFLE1BQU07SUFFcEIsSUFBSWIsU0FBUyxPQUFPc1AsV0FBVyxZQUFZLENBQUMsSUFBSUE7SUFDaERwUCxLQUFLdUYsVUFBVSxDQUFDekY7SUFFaEIsT0FBT0UsS0FBS29GLElBQUk7QUFDcEI7QUFDQSw4RUFBOEU7QUFFdkUsZUFBZXlKLGFBQStDckUsSUFBaUIsRUFBRWdGLFFBQU0sS0FBSyxFQUFFSixTQUFPLEtBQUs7SUFFN0csTUFBTXROLFFBQVFxTixTQUFTM0U7SUFFdkIsSUFBSWdGLE9BQ0EsT0FBTyxNQUFNL0ksUUFBUStELE1BQU00RTtJQUUvQixPQUFPLE1BQU10TixNQUFNK00sWUFBWTtBQUNuQztBQUVPLGVBQWV2SixnQkFBb0NrRixJQUE4QixFQUFFZ0YsUUFBTSxLQUFLLEVBQUVKLFNBQU8sS0FBSztJQUUvRyxNQUFNdE4sUUFBUXFOLFNBQVMzRTtJQUV2QixJQUFJZ0YsT0FDQSxPQUFPLE1BQU1qSyxXQUFXaUYsTUFBTTRFO0lBRWxDLE9BQU8sTUFBTXROLE1BQU13RCxlQUFlO0FBQ3RDO0FBRUEsbUJBQW1CO0FBRW5CLFNBQVN3SixnQkFBc0R0RSxJQUFpQjtJQUU1RSxNQUFNbkcsT0FBT3VFLFFBQVE0QjtJQUNyQixNQUFNeEssT0FBT3dHLGVBQWV0QyxHQUFHLENBQUVHO0lBQ2pDLElBQUlyRSxTQUFTVCxXQUNULE1BQU0sSUFBSW9CLE1BQU0sQ0FBQyxFQUFFMEQsS0FBSyxpQkFBaUIsQ0FBQztJQUM5QyxPQUFPckU7QUFDWDtBQUVBLDJCQUEyQjtBQUNwQixTQUFTNEksUUFBU0MsT0FBZ0I7SUFFeEMsTUFBTXhFLE9BQU93RSxRQUFRMUMsWUFBWSxDQUFDLFNBQVMwQyxRQUFRM0MsT0FBTyxDQUFDNEMsV0FBVztJQUV0RSxJQUFJLENBQUV6RSxLQUFLMEUsUUFBUSxDQUFDLE1BQ25CLE1BQU0sSUFBSXBJLE1BQU0sQ0FBQyxRQUFRLEVBQUUwRCxLQUFLLHNCQUFzQixDQUFDO0lBRXhELE9BQU9BO0FBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDL1dZekY7Ozs7R0FBQUEsY0FBQUE7O1VBT0E2UTs7SUFFWCxzQkFBc0I7OztJQUduQixzQkFBc0I7O0dBTGRBLGNBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJaLDhCQUE4QjtBQUU5QixvQkFBb0I7QUFDcEIsa0ZBQWtGO0FBb0JsRiwyRkFBMkY7QUFDM0YsTUFBTUMsa0JBQW1CO0FBQ3pCLE1BQU1DLHlCQUF5QjtJQUMzQixTQUFTO0lBQ1QsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixZQUFZO0lBQ1osWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixTQUFTO0lBQ1QsYUFBYTtJQUNiLFNBQVM7SUFDVCxPQUFPO0lBQ1AsU0FBUztJQUNULFNBQVM7SUFDVCxXQUFXO0lBQ1gsYUFBYTtJQUNiLFNBQVM7SUFDVCxVQUFVO0FBQ1o7QUFDSyxTQUFTOVEsaUJBQWlCcUosS0FBeUI7SUFFekQsSUFBSUEsVUFBVWpJLGFBQ2IsT0FBTztJQUVSLElBQUlrSSxVQUFVdUgsZ0JBQWdCRSxJQUFJLENBQUMxSCxNQUFNN0QsSUFBSSxDQUFFLENBQUMsRUFBRTtJQUNsRCxPQUFPc0wsc0JBQXNCLENBQUN4SCxRQUErQyxJQUFJQSxRQUFRVyxXQUFXO0FBQ3JHO0FBRUEsd0VBQXdFO0FBQ3hFLE1BQU0rRyxrQkFBa0I7SUFDdkI7SUFBTTtJQUFXO0lBQVM7SUFBYztJQUFRO0lBQ2hEO0lBQVU7SUFBTTtJQUFNO0lBQU07SUFBTTtJQUFNO0lBQU07SUFBVTtJQUN4RDtJQUFPO0lBQUs7SUFBVztDQUV2QjtBQUNNLFNBQVMvUSxrQkFBa0JnUixHQUF1QjtJQUN4RCxPQUFPRCxnQkFBZ0I5RyxRQUFRLENBQUVsSyxpQkFBaUJpUjtBQUNuRDtBQUVPLFNBQVN4TTtJQUNaLE9BQU8wRCxTQUFTK0ksVUFBVSxLQUFLLGlCQUFpQi9JLFNBQVMrSSxVQUFVLEtBQUs7QUFDNUU7QUFFTyxNQUFNNUIsdUJBQXVCNUssdUJBQXVCO0FBRXBELGVBQWVBO0lBQ2xCLElBQUlELHNCQUNBO0lBRUosTUFBTSxFQUFDOEMsT0FBTyxFQUFFQyxPQUFPLEVBQUMsR0FBR3hGLFFBQVF5RixhQUFhO0lBRW5EVSxTQUFTMEMsZ0JBQWdCLENBQUMsb0JBQW9CO1FBQzdDckQ7SUFDRCxHQUFHO0lBRUEsTUFBTUQ7QUFDVjs7Ozs7OztTQ2hGQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7VUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQzJDO0FBQ2Q7QUFDWTtBQUV6QyxnRUFBZ0U7QUFFaEUsTUFBTTRKLHFCQUFxQnRRLDZDQUFJQTtJQUUzQmlDLGFBQWM7UUFDVixLQUFLO1FBRUwsSUFBSSxDQUFDdkMsT0FBTyxDQUFDNlEsZUFBZSxDQUFDbFIsbURBQUksQ0FBQyxvQkFBb0IsQ0FBQztJQUMzRDtBQUNKO0FBRUFnSiw2Q0FBTUEsQ0FBQyxrQkFBa0JpSTtBQUV6QixnRUFBZ0U7QUFFaEUsTUFBTUUscUJBQXFCeFEsNkNBQUlBLENBQUM7SUFDNUJOLFNBQVM7QUFDYjtJQUVJdUMsYUFBYztRQUNWeUssUUFBUUMsR0FBRyxDQUFDO1FBQ1osS0FBSztJQUNUO0FBQ0o7QUFFQXRFLDZDQUFNQSxDQUFDLGtCQUFrQm1JO0FBRXpCLGVBQWVDO0lBRVgsTUFBTUMsWUFBWSxNQUFNdkQsbURBQUksQ0FBQyxpQ0FBaUMsQ0FBQztJQUUvRDdGLFNBQVNxSixJQUFJLENBQUM1SSxNQUFNLENBQUMySSxVQUFVcFEsSUFBSTtBQUN2QztBQUVBbVE7QUFFQTtJQUNJLElBQUlHLFFBQVEsSUFBSUosYUFBYXJPLElBQUk7SUFDakNtRixTQUFTcUosSUFBSSxDQUFDNUksTUFBTSxDQUFDNkk7SUFFckJsRSxRQUFRbUUsSUFBSSxDQUFDLFFBQVFwQiwrQ0FBUUEsQ0FBQ21CO0FBQ2xDLENBQ0E7SUFDSSxJQUFJQSxRQUFRLElBQUlKO0lBQ2hCbEosU0FBU3FKLElBQUksQ0FBQzVJLE1BQU0sQ0FBQzZJLE1BQU10USxJQUFJO0lBRS9Cb00sUUFBUW1FLElBQUksQ0FBQyxRQUFRcEIsK0NBQVFBLENBQUNtQixNQUFNdFEsSUFBSTtBQUM1QyxDOzs7Ozs7Ozs7O0FDcERBOzs7Ozs7Ozs7Ozs7O0FDQUEsaUVBQWUscUJBQXVCLG9DQUFvQyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZGVmaW5lLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9xdWVyeVNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvYnVpbGQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9wYWdlcy9leGFtcGxlcy9idWlsZC9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9wYWdlcy9leGFtcGxlcy9idWlsZC9pbmRleC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1aWxkTElTU0hvc3QgfSBmcm9tIFwiLi9MSVNTSG9zdFwiO1xuaW1wb3J0IHsgQ2xhc3MsIENvbnN0cnVjdG9yLCBDb250ZW50RmFjdG9yeSwgQ1NTX1NvdXJjZSwgSFRNTF9SZXNvdXJjZSwgSFRNTF9Tb3VyY2UsIExpZmVDeWNsZSwgTElTU19PcHRzLCBTaGFkb3dDZmcgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNTaGFkb3dTdXBwb3J0ZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgTElTU1N0YXRlIH0gZnJvbSBcInN0YXRlXCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4vaGVscGVycy9idWlsZFwiO1xuXG5sZXQgX19jc3RyX2hvc3QgIDogYW55ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENzdHJIb3N0KF86IGFueSkge1xuXHRfX2NzdHJfaG9zdCA9IF87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBERUZBVUxUX0NPTlRFTlRfRkFDVE9SWShjb250ZW50PzogRXhjbHVkZTxIVE1MX1Jlc291cmNlLCBSZXNwb25zZT4pIHtcblxuXHRpZiggdHlwZW9mIGNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcblxuXHRcdGNvbnRlbnQgPSBjb250ZW50LnRyaW0oKTtcblx0XHRpZiggY29udGVudC5sZW5ndGggPT09IDAgKVxuXHRcdFx0Y29udGVudCA9IHVuZGVmaW5lZDtcblxuXHRcdGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHRjb250ZW50ID0gaHRtbGAke2NvbnRlbnR9YDtcblxuXHRcdC8vIFRPRE8gTElTU0F1dG8gcGFyc2VyLi4uXG5cdFx0Ly8gb25seSBpZiBubyBKUy4uLlxuXHRcdC8vIHRvbGVyYXRlIG5vbi1vcHRpIChlYXNpZXIgPykgb3Igc3Bhblt2YWx1ZV0gP1xuXHRcdFx0Ly8gPT4gcmVjb3JkIGVsZW1lbnQgd2l0aCB0YXJnZXQuLi5cblx0XHRcdC8vID0+IGNsb25lKGF0dHJzLCBwYXJhbXMpID0+IGZvciBlYWNoIHNwYW4gcmVwbGFjZSB0aGVuIGNsb25lLlxuXHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MTgyMjQ0L2NvbnZlcnQtYS1zdHJpbmctdG8tYS10ZW1wbGF0ZS1zdHJpbmdcblx0XHQvL2xldCBzdHIgPSAoY29udGVudCBhcyBzdHJpbmcpLnJlcGxhY2UoL1xcJFxceyguKz8pXFx9L2csIChfLCBtYXRjaCkgPT4gdGhpcy5nZXRBdHRyaWJ1dGUobWF0Y2gpPz8nJylcblx0fVxuXG5cdGlmKCBjb250ZW50IGluc3RhbmNlb2YgSFRNTFRlbXBsYXRlRWxlbWVudClcblx0XHRjb250ZW50ID0gY29udGVudC5jb250ZW50O1xuXG5cdHJldHVybiAoKSA9PiBjb250ZW50Py5jbG9uZU5vZGUodHJ1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuXHRFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICA9IENvbnN0cnVjdG9yPENsYXNzPixcblx0UGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSwgLy9SZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuXHQvLyBIVE1MIEJhc2Vcblx0SG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50Pixcblx0QXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyLCAvL3N0cmluZyxcbj4oe1xuXG4gICAgLy8gSlMgQmFzZVxuICAgIGV4dGVuZHM6IF9leHRlbmRzID0gT2JqZWN0IGFzIHVua25vd24gYXMgRXh0ZW5kc0N0ciwgLyogZXh0ZW5kcyBpcyBhIEpTIHJlc2VydmVkIGtleXdvcmQuICovXG4gICAgcGFyYW1zICAgICAgICAgICAgPSB7fSAgICAgYXMgdW5rbm93biBhcyBQYXJhbXMsXG4gICAgLy8gbm9uLWdlbmVyaWNcbiAgICBkZXBzICAgPSBbXSxcblxuICAgIC8vIEhUTUwgQmFzZVxuICAgIGhvc3QgID0gSFRNTEVsZW1lbnQgYXMgdW5rbm93biBhcyBIb3N0Q3N0cixcblx0b2JzZXJ2ZWRBdHRyaWJ1dGVzID0gW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cbiAgICBhdHRycyA9IG9ic2VydmVkQXR0cmlidXRlcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGNvbnRlbnQsXG5cdGNvbnRlbnRfZmFjdG9yeTogX2NvbnRlbnRfZmFjdG9yeSA9IERFRkFVTFRfQ09OVEVOVF9GQUNUT1JZLFxuICAgIGNzcyxcbiAgICBzaGFkb3cgPSBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSA/IFNoYWRvd0NmZy5DTE9TRSA6IFNoYWRvd0NmZy5OT05FXG59OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+ID0ge30pIHtcblxuICAgIGlmKCBzaGFkb3cgIT09IFNoYWRvd0NmZy5PUEVOICYmICEgaXNTaGFkb3dTdXBwb3J0ZWQoaG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgZWxlbWVudCAke19lbGVtZW50MnRhZ25hbWUoaG9zdCl9IGRvZXMgbm90IHN1cHBvcnQgU2hhZG93Um9vdGApO1xuXG4gICAgY29uc3QgYWxsX2RlcHMgPSBbLi4uZGVwc107XG5cblx0bGV0IGNvbnRlbnRfZmFjdG9yeTogQ29udGVudEZhY3Rvcnk8QXR0cnMsIFBhcmFtcz47XG5cbiAgICAvLyBjb250ZW50IHByb2Nlc3NpbmdcbiAgICBpZiggY29udGVudCBpbnN0YW5jZW9mIFByb21pc2UgfHwgY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkge1xuICAgICAgICBcblx0XHRsZXQgX2NvbnRlbnQ6IEhUTUxfU291cmNlfHVuZGVmaW5lZCA9IGNvbnRlbnQ7XG5cdFx0Y29udGVudCA9IG51bGwgYXMgdW5rbm93biBhcyBzdHJpbmc7XG5cbiAgICAgICAgYWxsX2RlcHMucHVzaCggKGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgX2NvbnRlbnQgPSBhd2FpdCBfY29udGVudDtcbiAgICAgICAgICAgIGlmKCBfY29udGVudCBpbnN0YW5jZW9mIFJlc3BvbnNlICkgLy8gZnJvbSBhIGZldGNoLi4uXG5cdFx0XHRcdF9jb250ZW50ID0gYXdhaXQgX2NvbnRlbnQudGV4dCgpO1xuXG4gICAgICAgICAgICBMSVNTQmFzZS5MSVNTQ2ZnLmNvbnRlbnRfZmFjdG9yeSA9IF9jb250ZW50X2ZhY3RvcnkoX2NvbnRlbnQpO1xuICAgICAgICB9KSgpICk7XG5cbiAgICB9IGVsc2Uge1xuXHRcdGNvbnRlbnRfZmFjdG9yeSA9IF9jb250ZW50X2ZhY3RvcnkoY29udGVudCk7XG5cdH1cblxuXHQvLyBDU1MgcHJvY2Vzc2luZ1xuXHRsZXQgc3R5bGVzaGVldHM6IENTU1N0eWxlU2hlZXRbXSA9IFtdO1xuXHRpZiggY3NzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRpZiggISBBcnJheS5pc0FycmF5KGNzcykgKVxuXHRcdFx0Ly8gQHRzLWlnbm9yZSA6IHRvZG86IExJU1NPcHRzID0+IHNob3VsZCBub3QgYmUgYSBnZW5lcmljID9cblx0XHRcdGNzcyA9IFtjc3NdO1xuXG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHN0eWxlc2hlZXRzID0gY3NzLm1hcCggKGM6IENTU19Tb3VyY2UsIGlkeDogbnVtYmVyKSA9PiB7XG5cblx0XHRcdGlmKCBjIGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcblxuXHRcdFx0XHRhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG5cdFx0XHRcdFx0YyA9IGF3YWl0IGM7XG5cdFx0XHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBSZXNwb25zZSApXG5cdFx0XHRcdFx0XHRjID0gYXdhaXQgYy50ZXh0KCk7XG5cblx0XHRcdFx0XHRzdHlsZXNoZWV0c1tpZHhdID0gcHJvY2Vzc19jc3MoYyk7XG5cblx0XHRcdFx0fSkoKSk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGwgYXMgdW5rbm93biBhcyBDU1NTdHlsZVNoZWV0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvY2Vzc19jc3MoYyk7XG5cdFx0fSk7XG5cdH1cblxuXHR0eXBlIExJU1NIb3N0PFQ+ID0gYW55OyAvL1RPRE8uLi5cblx0dHlwZSBMSG9zdCA9IExJU1NIb3N0PExJU1NCYXNlPjsgLy88LSBjb25maWcgaW5zdGVhZCBvZiBMSVNTQmFzZSA/XG5cblx0Y2xhc3MgTElTU0Jhc2UgZXh0ZW5kcyBfZXh0ZW5kcyB7XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyAvLyByZXF1aXJlZCBieSBUUywgd2UgZG9uJ3QgdXNlIGl0Li4uXG5cblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsIClcblx0XHRcdFx0X19jc3RyX2hvc3QgPSBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5Ib3N0KHt9LCB0aGlzKTtcblx0XHRcdHRoaXMuI2hvc3QgPSBfX2NzdHJfaG9zdDtcblx0XHRcdF9fY3N0cl9ob3N0ID0gbnVsbDtcblx0XHR9XG5cblx0XHRyZWFkb25seSAjaG9zdDogYW55OyAvLyBwcmV2ZW50cyBpc3N1ZSAjMS4uLlxuXG5cdFx0Ly8gTElTUyBDb25maWdzXG5cdFx0c3RhdGljIHJlYWRvbmx5IExJU1NDZmcgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwcyxcblx0XHRcdGF0dHJzLFxuXHRcdFx0cGFyYW1zLFxuXHRcdFx0Y29udGVudF9mYWN0b3J5LFxuXHRcdFx0c3R5bGVzaGVldHMsXG5cdFx0XHRzaGFkb3csXG5cdFx0fTtcblxuXHRcdGdldCBzdGF0ZSgpOiBMSVNTU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Quc3RhdGU7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBob3N0KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXHRcdC8vVE9ETzogZ2V0IHRoZSByZWFsIHR5cGUgP1xuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpOiBJbnN0YW5jZVR5cGU8SG9zdENzdHI+fFNoYWRvd1Jvb3Qge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5jb250ZW50ITtcblx0XHR9XG5cblx0XHQvLyBhdHRyc1xuXHRcdHByb3RlY3RlZCBnZXQgYXR0cnMoKTogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5hdHRycztcblx0XHR9XG5cdFx0cHJvdGVjdGVkIHNldEF0dHJEZWZhdWx0KCBhdHRyOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnNldEF0dHJEZWZhdWx0KGF0dHIsIHZhbHVlKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uQXR0ckNoYW5nZWQoX25hbWU6IEF0dHJzLFxuXHRcdFx0X29sZFZhbHVlOiBzdHJpbmcsXG5cdFx0XHRfbmV3VmFsdWU6IHN0cmluZyk6IHZvaWR8ZmFsc2Uge31cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdC5cblx0XHRwcm90ZWN0ZWQgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3M6IFtBdHRycywgc3RyaW5nLCBzdHJpbmddKSB7XG5cdFx0XHR0aGlzLm9uQXR0ckNoYW5nZWQoLi4uYXJncyk7XG5cdFx0fVxuXG5cdFx0Ly8gcGFyYW1ldGVyc1xuXHRcdHB1YmxpYyBnZXQgcGFyYW1zKCk6IFJlYWRvbmx5PFBhcmFtcz4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXM7XG5cdFx0fVxuXHRcdHB1YmxpYyB1cGRhdGVQYXJhbXMocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4pIHtcblx0XHRcdE9iamVjdC5hc3NpZ24oICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblxuXHRcdC8vIERPTVxuXHRcdHB1YmxpYyBnZXQgaXNJbkRPTSgpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuaXNDb25uZWN0ZWQ7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBvbkRPTUNvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuY29ubmVjdGVkQ2FsbGJhY2soKTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NRGlzY29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblxuXHRcdC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuXHRcdHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpIHt9XG5cdFx0cHJvdGVjdGVkIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwdWJsaWMgZ2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaXNJbkRPTTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHN0YXRpYyBfSG9zdDogTElTU0hvc3Q8TElTU0Jhc2U+O1xuXG5cdFx0c3RhdGljIGdldCBIb3N0KCkge1xuXHRcdFx0aWYoIHRoaXMuX0hvc3QgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy5fSG9zdCA9IGJ1aWxkTElTU0hvc3QodGhpcyBhcyBhbnkpOyAvL1RPRE86IGZpeCB0eXBlIGVycm9yICh3aHk/Pz8pXG5cdFx0XHRyZXR1cm4gdGhpcy5fSG9zdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gTElTU0Jhc2U7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NfY3NzKGNzczogc3RyaW5nfENTU1N0eWxlU2hlZXR8SFRNTFN0eWxlRWxlbWVudCkge1xuXG5cdGlmKGNzcyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpXG5cdFx0cmV0dXJuIGNzcztcblx0aWYoIGNzcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpXG5cdFx0cmV0dXJuIGNzcy5zaGVldCE7XG5cblx0bGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0aWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0c3R5bGUucmVwbGFjZVN5bmMoY3NzKTsgLy8gcmVwbGFjZSgpIGlmIGlzc3Vlc1xuXHRcdHJldHVybiBzdHlsZTtcblx0fVxuXG5cdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3Qgb2NjdXJzXCIpO1xufSIsImltcG9ydCB7IExJU1NTdGF0ZSwgdXBncmFkZVN5bmMgfSBmcm9tIFwiLi9zdGF0ZVwiO1xuaW1wb3J0IHsgc2V0Q3N0ckhvc3QgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuaW1wb3J0IHsgTElTU19PcHRzLCBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgQ29tcG9zZUNvbnN0cnVjdG9yLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdhaXRET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IGlkID0gMDtcblxudHlwZSBpbmZlckxJU1M8VD4gPSBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPGluZmVyIEEsIGluZmVyIEIsIGluZmVyIEMsIGluZmVyIEQ+ID8gW0EsQixDLERdIDogbmV2ZXI7XG5cbi8vVE9ETzogc2hhZG93IHV0aWxzID9cbmNvbnN0IHNoYXJlZENTUyA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExJU1NIb3N0PFxuICAgICAgICAgICAgICAgICAgICAgICAgVCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oTGlzczogVCkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRycyxcblx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5MSVNTQ2ZnO1xuXG5cdHR5cGUgUCA9IGluZmVyTElTUzxUPjtcblx0Ly90eXBlIEV4dGVuZHNDc3RyID0gUFswXTtcblx0dHlwZSBQYXJhbXMgICAgICA9IFBbMV07XG5cdHR5cGUgSG9zdENzdHIgICAgPSBQWzJdO1xuXHR0eXBlIEF0dHJzICAgICAgID0gUFszXTtcblxuICAgIHR5cGUgSG9zdCAgID0gSW5zdGFuY2VUeXBlPEhvc3RDc3RyPjtcblxuICAgIC8vIGF0dHJzIHByb3h5XG5cdGNvbnN0IEdFVCA9IFN5bWJvbCgnZ2V0Jyk7XG5cdGNvbnN0IFNFVCA9IFN5bWJvbCgnc2V0Jyk7XG5cblx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5mcm9tRW50cmllcyggYXR0cnMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHRjb25zdCBhbHJlYWR5RGVjbGFyZWRDU1MgPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdCB3YWl0UmVhZHkgPSBuZXcgUHJvbWlzZTx2b2lkPiggYXN5bmMgKHIpID0+IHtcblxuICAgICAgICBhd2FpdCB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG5cbiAgICAgICAgcigpO1xuICAgIH0pO1xuXG4gICAgLy8gTm8gZGVwcyBhbmQgRE9NIGFscmVhZHkgbG9hZGVkLlxuICAgIGxldCBpc1JlYWR5ID0gTGlzcy5MSVNTQ2ZnLmRlcHMubGVuZ3RoID09IDAgJiYgaXNET01Db250ZW50TG9hZGVkKCk7XG5cblx0Y29uc3QgcGFyYW1zID0gTGlzcy5MSVNTQ2ZnLnBhcmFtczsgLy9PYmplY3QuYXNzaWduKHt9LCBMaXNzLkxJU1NDZmcucGFyYW1zLCBfcGFyYW1zKTtcblxuXHQvL1xuXG5cdGNvbnN0IHdoZW5EZXBzUmVzb2x2ZWQgPSBQcm9taXNlLmFsbChMaXNzLkxJU1NDZmcuZGVwcyk7XG5cdGxldCBpc0RlcHNSZXNvbHZlZCA9IGZhbHNlO1xuXHQoIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdGlzRGVwc1Jlc29sdmVkID0gdHJ1ZTtcblx0fSkoKTtcblxuXHRjbGFzcyBMSVNTSG9zdEJhc2UgZXh0ZW5kcyAoaG9zdCBhcyBuZXcgKCkgPT4gSFRNTEVsZW1lbnQpIHtcblxuXHRcdC8vIGFkb3B0IHN0YXRlIGlmIGFscmVhZHkgY3JlYXRlZC5cblx0XHRyZWFkb25seSBzdGF0ZSA9ICh0aGlzIGFzIGFueSkuc3RhdGUgPz8gbmV3IExJU1NTdGF0ZSh0aGlzKTtcblxuXHRcdC8vID09PT09PT09PT09PSBERVBFTkRFTkNJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IHdoZW5EZXBzUmVzb2x2ZWQgPSB3aGVuRGVwc1Jlc29sdmVkO1xuXHRcdHN0YXRpYyBnZXQgaXNEZXBzUmVzb2x2ZWQoKSB7XG5cdFx0XHRyZXR1cm4gaXNEZXBzUmVzb2x2ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09IElOSVRJQUxJWkFUSU9OID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRzdGF0aWMgQmFzZSA9IExpc3M7XG5cblx0XHQjYmFzZTogYW55fG51bGwgPSBudWxsO1xuXHRcdGdldCBiYXNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0cmVhZG9ubHkgd2hlbkluaXRpYWxpemVkOiBQcm9taXNlPEluc3RhbmNlVHlwZTxUPj47XG5cdFx0I3doZW5Jbml0aWFsaXplZF9yZXNvbHZlcjtcblxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGFscmVhZHkgaW5pdGlhbGl6ZWQhJyk7XG4gICAgICAgICAgICBpZiggISAoIHRoaXMuY29uc3RydWN0b3IgYXMgYW55KS5pc0RlcHNSZXNvbHZlZCApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jaWVzIGhhc24ndCBiZWVuIGxvYWRlZCAhXCIpO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMuI3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0dGhpcy4jYmFzZSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy5pc0Nvbm5lY3RlZCApXG5cdFx0XHRcdCh0aGlzLiNiYXNlIGFzIGFueSkub25ET01Db25uZWN0ZWQoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2Jhc2U7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zID0gcGFyYW1zO1xuXG5cdFx0Z2V0IHBhcmFtcygpOiBQYXJhbXMge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3BhcmFtcztcblx0XHR9XG5cbiAgICAgICAgcHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8TElTU19PcHRzW1wicGFyYW1zXCJdPikge1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5iYXNlIS51cGRhdGVQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgLy8gd2lsIGJlIGdpdmVuIHRvIGNvbnN0cnVjdG9yLi4uXG5cdFx0XHRPYmplY3QuYXNzaWduKCB0aGlzLiNwYXJhbXMsIHBhcmFtcyApO1xuXHRcdH1cblx0XHQvLyA9PT09PT09PT09PT09PSBBdHRyaWJ1dGVzID09PT09PT09PT09PT09PT09PT1cblxuXHRcdCNhdHRyc19mbGFnID0gZmFsc2U7XG5cblx0XHQjYXR0cmlidXRlcyAgICAgICAgID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJpYnV0ZXNEZWZhdWx0cyA9IHt9IGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXHRcdCNhdHRycyA9IG5ldyBBdHRyaWJ1dGVzKFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlcyxcblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0cyxcblx0XHRcdChuYW1lOiBBdHRycywgdmFsdWU6c3RyaW5nfG51bGwpID0+IHtcblxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG5cblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IHRydWU7IC8vIGRvIG5vdCB0cmlnZ2VyIG9uQXR0cnNDaGFuZ2VkLlxuXHRcdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0KSBhcyB1bmtub3duIGFzIFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuXG5cdFx0c2V0QXR0ckRlZmF1bHQobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkge1xuXHRcdFx0aWYoIHZhbHVlID09PSBudWxsKVxuXHRcdFx0XHRkZWxldGUgdGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzW25hbWVdO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRnZXQgYXR0cnMoKTogUmVhZG9ubHk8UmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4+IHtcblxuXHRcdFx0cmV0dXJuIHRoaXMuI2F0dHJzO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IENvbnRlbnQgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblxuXHRcdFx0aWYodGhpcy5oYXNTaGFkb3cgfHwgISB0aGlzLmhhc0F0dHJpYnV0ZShcImlzXCIpIClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZTtcblxuXHRcdFx0cmV0dXJuIGAke3RoaXMudGFnTmFtZX1baXM9XCIke3RoaXMuZ2V0QXR0cmlidXRlKFwiaXNcIil9XCJdYDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PSBJbXBsID09PT09PT09PT09PT09PT09PT1cblxuXHRcdGNvbnN0cnVjdG9yKHBhcmFtczoge30sIGJhc2U/OiBJbnN0YW5jZVR5cGU8VD4pIHtcblx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHRsZXQge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEluc3RhbmNlVHlwZTxUPj4oKTtcblxuXHRcdFx0dGhpcy53aGVuSW5pdGlhbGl6ZWQgPSBwcm9taXNlO1xuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyID0gcmVzb2x2ZTtcblxuXHRcdFx0aWYoIGJhc2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLiNiYXNlID0gYmFzZTtcblx0XHRcdFx0dGhpcy5pbml0KCk7IC8vIGNhbGwgdGhlIHJlc29sdmVyXG5cdFx0XHR9XG5cblx0XHRcdGlmKCBcIl93aGVuVXBncmFkZWRSZXNvbHZlXCIgaW4gdGhpcylcblx0XHRcdFx0KHRoaXMuX3doZW5VcGdyYWRlZFJlc29sdmUgYXMgYW55KSgpO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT0gRE9NID09PT09PT09PT09PT09PT09PT09PT09PT09PVx0XHRcblxuXHRcdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0KHRoaXMuYmFzZSEgYXMgYW55KS5vbkRPTURpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblxuXHRcdGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKSB7XG5cdFx0XHRcdHRoaXMuYmFzZSEub25ET01Db25uZWN0ZWQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUT0RPOiBsaWZlIGN5Y2xlIG9wdGlvbnNcblx0XHRcdGlmKCB0aGlzLnN0YXRlLmlzUmVhZHkgKSB7XG5cdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpOyAvLyBhdXRvbWF0aWNhbGx5IGNhbGxzIG9uRE9NQ29ubmVjdGVkXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0KCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0YXdhaXQgdGhpcy5zdGF0ZS5pc1JlYWR5O1xuXG5cdFx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cblx0XHRcdH0pKCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXHRcdFx0XG5cdFx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHRoaXMpO1xuXG4gICAgICAgICAgICAvL1RPRE86IHdhaXQgcGFyZW50cy9jaGlsZHJlbiBkZXBlbmRpbmcgb24gb3B0aW9uLi4uXG5cdFx0XHRcblx0XHRcdC8vIHNoYWRvd1xuXHRcdFx0dGhpcy4jY29udGVudCA9IHRoaXMgYXMgdW5rbm93biBhcyBIb3N0O1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKSB7XG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogc2hhZG93fSk7XG5cblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHQvL3RoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhdHRyc1xuXHRcdFx0Zm9yKGxldCBvYnMgb2YgYXR0cnMhKVxuXHRcdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW29icyBhcyBBdHRyc10gPSB0aGlzLmdldEF0dHJpYnV0ZShvYnMpO1xuXG5cdFx0XHQvLyBjc3Ncblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJylcblx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTKTtcblx0XHRcdGlmKCBzdHlsZXNoZWV0cy5sZW5ndGggKSB7XG5cblx0XHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHRcdCh0aGlzLiNjb250ZW50IGFzIFNoYWRvd1Jvb3QpLmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKC4uLnN0eWxlc2hlZXRzKTtcblx0XHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0XHRjb25zdCBjc3NzZWxlY3RvciA9IHRoaXMuQ1NTU2VsZWN0b3I7XG5cblx0XHRcdFx0XHQvLyBpZiBub3QgeWV0IGluc2VydGVkIDpcblx0XHRcdFx0XHRpZiggISBhbHJlYWR5RGVjbGFyZWRDU1MuaGFzKGNzc3NlbGVjdG9yKSApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0bGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuXHRcdFx0XHRcdFx0c3R5bGUuc2V0QXR0cmlidXRlKCdmb3InLCBjc3NzZWxlY3Rvcik7XG5cblx0XHRcdFx0XHRcdGxldCBodG1sX3N0eWxlc2hlZXRzID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0Zm9yKGxldCBzdHlsZSBvZiBzdHlsZXNoZWV0cylcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBydWxlIG9mIHN0eWxlLmNzc1J1bGVzKVxuXHRcdFx0XHRcdFx0XHRcdGh0bWxfc3R5bGVzaGVldHMgKz0gcnVsZS5jc3NUZXh0ICsgJ1xcbic7XG5cblx0XHRcdFx0XHRcdHN0eWxlLmlubmVySFRNTCA9IGh0bWxfc3R5bGVzaGVldHMucmVwbGFjZSgnOmhvc3QnLCBgOmlzKCR7Y3Nzc2VsZWN0b3J9KWApO1xuXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG5cblx0XHRcdFx0XHRcdGFscmVhZHlEZWNsYXJlZENTUy5hZGQoY3Nzc2VsZWN0b3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb250ZW50XG5cdFx0XHRjb25zdCBjb250ZW50ID0gY29udGVudF9mYWN0b3J5KHRoaXMuYXR0cnMsIHRoaXMucGFyYW1zLCB0aGlzKTtcblx0XHRcdGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKCBjb250ZW50ICk7XG5cblx0ICAgIFx0Ly8gYnVpbGRcblxuXHQgICAgXHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0c2V0Q3N0ckhvc3QodGhpcyk7XG5cdCAgICBcdGxldCBvYmogPSB0aGlzLmJhc2UgPT09IG51bGwgPyBuZXcgTGlzcygpIDogdGhpcy5iYXNlO1xuXG5cdFx0XHR0aGlzLiNiYXNlID0gb2JqIGFzIEluc3RhbmNlVHlwZTxUPjtcblxuXHRcdFx0Ly8gZGVmYXVsdCBzbG90XG5cdFx0XHRpZiggdGhpcy5oYXNTaGFkb3cgJiYgdGhpcy4jY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCApXG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzbG90JykgKTtcblxuXHRcdFx0dGhpcy4jd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyKHRoaXMuYmFzZSk7XG5cblx0XHRcdHJldHVybiB0aGlzLmJhc2U7XG5cdFx0fVxuXG5cblxuXHRcdC8vIGF0dHJzXG5cblx0XHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYXR0cnM7XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUgICAgOiBBdHRycyxcblx0XHRcdFx0XHRcdFx0XHQgb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHQgbmV3VmFsdWU6IHN0cmluZykge1xuXG5cdFx0XHRpZih0aGlzLiNhdHRyc19mbGFnKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gbmV3VmFsdWU7XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdGlmKCAodGhpcy5iYXNlISBhcyBhbnkpLm9uQXR0ckNoYW5nZWQobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0dGhpcy4jYXR0cnNbbmFtZV0gPSBvbGRWYWx1ZTsgLy8gcmV2ZXJ0IHRoZSBjaGFuZ2UuXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBMSVNTSG9zdEJhc2UgYXMgQ29tcG9zZUNvbnN0cnVjdG9yPHR5cGVvZiBMSVNTSG9zdEJhc2UsIHR5cGVvZiBob3N0Pjtcbn1cblxuXG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIGRlZmluZSA9PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vVE9ETzogQ3VzdG9tUmVnaXN0ZXJ5ICsgc2VlIHdpdGggc3RhdGUuLi5cblxuaW1wb3J0IExJU1MgZnJvbSBcIi4vZXh0ZW5kc1wiO1xuaW1wb3J0IHsgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IF9lbGVtZW50MnRhZ25hbWUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICBkZWZpbmUgICAgIDogdHlwZW9mIGRlZmluZTtcblx0XHR3aGVuRGVmaW5lZCAgICA6IHR5cGVvZiB3aGVuRGVmaW5lZDtcblx0XHR3aGVuQWxsRGVmaW5lZCA6IHR5cGVvZiB3aGVuQWxsRGVmaW5lZDtcblx0XHRpc0RlZmluZWQgICAgICA6IHR5cGVvZiBpc0RlZmluZWQ7XG5cdFx0Z2V0TmFtZSAgICAgICAgOiB0eXBlb2YgZ2V0TmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmU8VCBleHRlbmRzIExJU1NCYXNlQ3N0cj4oXG5cdFx0XHRcdFx0XHRcdHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdENvbXBvbmVudENsYXNzOiBUKSB7XG5cdGNvbnN0IENsYXNzICA9IENvbXBvbmVudENsYXNzLkxJU1NDZmcuaG9zdDtcblx0bGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuXHRjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cdFxuXHRjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cblx0XHRcdFx0XHRcdFx0XHRcdCAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXHRcblx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG5cbmFzeW5jIGZ1bmN0aW9uIHdoZW5EZWZpbmVkKHRhZ25hbWU6IHN0cmluZywgY2FsbGJhY2s/OiAoKSA9PiB2b2lkICkgOiBQcm9taXNlPHZvaWQ+IHtcblxuXHRhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcblxuXHRpZiggY2FsbGJhY2sgIT09IHVuZGVmaW5lZClcblx0XHRjYWxsYmFjaygpO1xuXG5cdHJldHVybjtcbn1cbmFzeW5jIGZ1bmN0aW9uIHdoZW5BbGxEZWZpbmVkKHRhZ25hbWVzOiByZWFkb25seSBzdHJpbmdbXSwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkICkgOiBQcm9taXNlPHZvaWQ+IHtcblxuXHRhd2FpdCBQcm9taXNlLmFsbCggdGFnbmFtZXMubWFwKCB0ID0+IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHQpICkgKVxuXG5cdGlmKCBjYWxsYmFjayAhPT0gdW5kZWZpbmVkKVxuXHRcdGNhbGxiYWNrKCk7XG5cbn1cblxuZnVuY3Rpb24gaXNEZWZpbmVkKG5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50ICk6IHN0cmluZyB7XG5cblx0Y29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcblx0aWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuXHRyZXR1cm4gbmFtZTtcbn1cblxuTElTUy5kZWZpbmUgICAgICAgICA9IGRlZmluZTtcbkxJU1Mud2hlbkRlZmluZWQgICAgPSB3aGVuRGVmaW5lZDtcbkxJU1Mud2hlbkFsbERlZmluZWQgPSB3aGVuQWxsRGVmaW5lZDtcbkxJU1MuaXNEZWZpbmVkICAgICAgPSBpc0RlZmluZWQ7XG5MSVNTLmdldE5hbWUgICAgICAgID0gZ2V0TmFtZTsiLCJpbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIExJU1NfT3B0cywgTElTU0Jhc2VDc3RyIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7TElTUyBhcyBfTElTU30gZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGNsYXNzIElMSVNTIHt9XG5cbmV4cG9ydCBkZWZhdWx0IExJU1MgYXMgdHlwZW9mIExJU1MgJiBJTElTUztcblxuLy8gZXh0ZW5kcyBzaWduYXR1cmVcbmV4cG9ydCBmdW5jdGlvbiBMSVNTPFxuICAgIEV4dGVuZHNDc3RyX0Jhc2UgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zX0Jhc2UgICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgSG9zdENzdHJfQmFzZSAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRyc19CYXNlICAgICAgIGV4dGVuZHMgc3RyaW5nLFxuXG4gICAgQmFzZUNzdHIgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8RXh0ZW5kc0NzdHJfQmFzZSwgUGFyYW1zX0Jhc2UsIEhvc3RDc3RyX0Jhc2UsIEF0dHJzX0Jhc2U+LFxuXG4gICAgLy8gVE9ETzogYWRkIGNvbnN0cmFpbnRzLi4uXG4gICAgUGFyYW1zICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sXG4gICAgSG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnMgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlcj4ob3B0czogUGFydGlhbDxMSVNTX09wdHM8QmFzZUNzdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4pOiBMSVNTQmFzZUNzdHJcbi8vIExJU1NCYXNlIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG5cdC8vIEhUTUwgQmFzZVxuXHRIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuXHRBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXIsIC8vc3RyaW5nLFxuPihvcHRzPzogUGFydGlhbDxMSVNTX09wdHM8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+Pik6IExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz5cbmV4cG9ydCBmdW5jdGlvbiBMSVNTKG9wdHM6IGFueSk6IExJU1NCYXNlQ3N0clxue1xuICAgIGlmKCBvcHRzLmV4dGVuZHMgIT09IHVuZGVmaW5lZCAmJiBcIkhvc3RcIiBpbiBvcHRzLmV4dGVuZHMgKSAvLyB3ZSBhc3N1bWUgdGhpcyBpcyBhIExJU1NCYXNlQ3N0clxuICAgICAgICByZXR1cm4gX2V4dGVuZHMob3B0cyk7XG5cbiAgICByZXR1cm4gX0xJU1Mob3B0cyk7XG59XG5cbmZ1bmN0aW9uIF9leHRlbmRzPFxuICAgIEV4dGVuZHNDc3RyX0Jhc2UgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zX0Jhc2UgICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgSG9zdENzdHJfQmFzZSAgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRyc19CYXNlICAgICAgIGV4dGVuZHMgc3RyaW5nLFxuXG4gICAgQmFzZUNzdHIgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8RXh0ZW5kc0NzdHJfQmFzZSwgUGFyYW1zX0Jhc2UsIEhvc3RDc3RyX0Jhc2UsIEF0dHJzX0Jhc2U+LFxuICAgIFxuICAgIC8vIFRPRE86IGFkZCBjb25zdHJhaW50cy4uLlxuICAgIFBhcmFtcyAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxuICAgIEhvc3RDc3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXI+KG9wdHM6IFBhcnRpYWw8TElTU19PcHRzPEJhc2VDc3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+KSB7XG5cbiAgICBpZiggb3B0cy5leHRlbmRzID09PSB1bmRlZmluZWQpIC8vIGg0Y2tcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBhIExJU1NCYXNlIScpO1xuXG4gICAgY29uc3QgYmFzZSA9IG9wdHMuZXh0ZW5kcy5MSVNTQ2ZnO1xuXG4gICAgY29uc3QgaG9zdCA9IG9wdHMuaG9zdCA/PyBiYXNlLmhvc3Q7XG5cbiAgICBsZXQgZGVwcyA9IGJhc2UuZGVwcztcbiAgICBpZiggb3B0cy5kZXBzICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGRlcHMgPSBbLi4uZGVwcywgLi4ub3B0cy5kZXBzXTtcblxuICAgIGxldCBhdHRycyA9IGJhc2UuYXR0cnMgYXMgcmVhZG9ubHkgKEF0dHJzfEF0dHJzX0Jhc2UpW107XG4gICAgaWYoIG9wdHMuYXR0cnMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgYXR0cnMgPSBbLi4uYXR0cnMsIC4uLm9wdHMuYXR0cnNdO1xuXG4gICAgbGV0IHBhcmFtcyA9IGJhc2UucGFyYW1zO1xuICAgIGlmKCBvcHRzLnBhcmFtcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHBhcmFtcywgb3B0cy5wYXJhbXMpO1xuXG4gICAgLy9UT0RPOiBpc3N1ZXMgd2l0aCBhc3luYyBjb250ZW50L0NTUyArIHNvbWUgZWRnZSBjYXNlcy4uLlxuICAgIGxldCBjb250ZW50X2ZhY3RvcnkgPSBiYXNlLmNvbnRlbnRfZmFjdG9yeSBhcyBhbnk7XG4gICAgaWYoIG9wdHMuY29udGVudCAhPT0gdW5kZWZpbmVkIClcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb250ZW50X2ZhY3RvcnkgPSBvcHRzLmNvbnRlbnRfZmFjdG9yeSEoIG9wdHMuY29udGVudCApO1xuXG4gICAgbGV0IHN0eWxlc2hlZXRzID0gYmFzZS5zdHlsZXNoZWV0cztcbiAgICBpZiggb3B0cy5jc3MgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc3R5bGVzaGVldHMgPSBbLi4uc3R5bGVzaGVldHMsIC4uLm9wdHMuY3NzXTtcblxuICAgIGNvbnN0IHNoYWRvdyA9IG9wdHMuc2hhZG93ID8/IGJhc2Uuc2hhZG93O1xuXG4gICAgY2xhc3MgRXh0ZW5kZWRMSVNTIGV4dGVuZHMgb3B0cy5leHRlbmRzIHtcblxuICAgICAgICBzdGF0aWMgb3ZlcnJpZGUgcmVhZG9ubHkgTElTU0NmZyA9IHtcblx0XHRcdGhvc3QsXG5cdFx0XHRkZXBzLFxuXHRcdFx0YXR0cnMsXG5cdFx0XHRwYXJhbXMsXG5cdFx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG4gICAgICAgIC8vVE9ETzogZml4IHR5cGVzLi4uXG4gICAgfVxuXG4gICAgcmV0dXJuIEV4dGVuZGVkTElTUztcbn1cblxuLypcbmZ1bmN0aW9uIGV4dGVuZHNMSVNTPEV4dGVuZHMgZXh0ZW5kcyBDbGFzcyxcblx0SG9zdCAgICBleHRlbmRzIEhUTUxFbGVtZW50LFxuXHRBdHRyczEgICBleHRlbmRzIHN0cmluZyxcblx0QXR0cnMyICAgZXh0ZW5kcyBzdHJpbmcsXG5cdFBhcmFtcyAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4sXG5cdFQgZXh0ZW5kcyBMSVNTUmV0dXJuVHlwZTxFeHRlbmRzLCBIb3N0LCBBdHRyczEsIFBhcmFtcz4+KExpc3M6IFQsXG5cdFx0cGFyYW1ldGVyczoge1xuXHRcdFx0c2hhZG93ICAgICAgPzogU2hhZG93Q2ZnLFxuXHRcdFx0YXR0cmlidXRlcyAgPzogcmVhZG9ubHkgQXR0cnMyW10sXG5cdFx0XHRkZXBlbmRlbmNpZXM/OiByZWFkb25seSBQcm9taXNlPGFueT5bXVxuXHRcdH0pIHtcblxuXHRjb25zdCBhdHRyaWJ1dGVzICAgPSBbLi4uTGlzcy5QYXJhbWV0ZXJzLmF0dHJpYnV0ZXMgICwgLi4ucGFyYW1ldGVycy5hdHRyaWJ1dGVzICA/P1tdXTtcblx0Y29uc3QgZGVwZW5kZW5jaWVzID0gWy4uLkxpc3MuUGFyYW1ldGVycy5kZXBlbmRlbmNpZXMsIC4uLnBhcmFtZXRlcnMuZGVwZW5kZW5jaWVzPz9bXV07XG5cblx0Y29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5QYXJhbWV0ZXJzLCB7XG5cdFx0YXR0cmlidXRlcyxcblx0XHRkZXBlbmRlbmNpZXNcblx0fSk7XG5cdGlmKCBwYXJhbWV0ZXJzLnNoYWRvdyAhPT0gdW5kZWZpbmVkKVxuXHRcdHBhcmFtcy5zaGFkb3cgPSBwYXJhbWV0ZXJzLnNoYWRvdztcblxuXHQvLyBAdHMtaWdub3JlIDogYmVjYXVzZSBUUyBzdHVwaWRcblx0Y2xhc3MgRXh0ZW5kZWRMSVNTIGV4dGVuZHMgTGlzcyB7XG5cdFx0Y29uc3RydWN0b3IoLi4udDogYW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiBiZWNhdXNlIFRTIHN0dXBpZFxuXHRcdFx0c3VwZXIoLi4udCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIG92ZXJyaWRlIGdldCBhdHRycygpIHtcblx0XHRcdHJldHVybiBzdXBlci5hdHRycyBhcyBSZWNvcmQ8QXR0cnMyfEF0dHJzMSwgc3RyaW5nfG51bGw+O1xuXHRcdH1cblxuXHRcdHN0YXRpYyBvdmVycmlkZSBQYXJhbWV0ZXJzID0gcGFyYW1zO1xuXHR9XG5cblx0cmV0dXJuIEV4dGVuZGVkTElTUztcbn1cbkxJU1MuZXh0ZW5kc0xJU1MgPSBleHRlbmRzTElTUztcbiovIiwiaW1wb3J0IHsgU2hhZG93Q2ZnIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQge0xJU1N9IGZyb20gXCIuLi9MSVNTQmFzZVwiO1xuXG5pbXBvcnQge2RlZmluZX0gZnJvbSBcIi4uL3N0YXRlXCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4vYnVpbGRcIjtcblxuZXhwb3J0IGNsYXNzIExJU1NfQXV0byBleHRlbmRzIExJU1Moe1xuXHRhdHRyczogW1wic3JjXCIsIFwic3dcIl0sXG5cdHNoYWRvdzogU2hhZG93Q2ZnLk5PTkUsXG5cdGNzczogYDpob3N0IHsgZGlzcGxheTogbm9uZTsgfWBcbn0pIHtcblxuXHRyZWFkb25seSAja25vd25fdGFnID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cdHJlYWRvbmx5ICNkaXJlY3Rvcnk6IHN0cmluZztcblx0cmVhZG9ubHkgI3N3OiBQcm9taXNlPHZvaWQ+O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuI3N3ID0gbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlKSA9PiB7XG5cdFx0XHRcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHRoaXMuYXR0cnMuc3cgPz8gXCIvc3cuanNcIiwge3Njb3BlOiBcIi9cIn0pO1xuXG5cdFx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApIHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cblx0XHRjb25zdCBzcmMgPSB0aGlzLmF0dHJzLnNyYztcblx0XHRpZihzcmMgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzcmMgYXR0cmlidXRlIGlzIG1pc3NpbmcuXCIpO1xuXHRcdHRoaXMuI2RpcmVjdG9yeSA9IHNyY1swXSA9PT0gJy4nXG5cdFx0XHRcdFx0XHRcdFx0PyBgJHt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9JHtzcmN9YFxuXHRcdFx0XHRcdFx0XHRcdDogc3JjO1xuXG5cdFx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXG5cdFx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEVsZW1lbnQpXG5cdFx0XHRcdFx0XHR0aGlzLiNhZGRUYWcoYWRkaXRpb24udGFnTmFtZSlcblxuXHRcdH0pLm9ic2VydmUoIGRvY3VtZW50LCB7IGNoaWxkTGlzdDp0cnVlLCBzdWJ0cmVlOnRydWUgfSk7XG5cblxuXHRcdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipcIikgKVxuXHRcdFx0dGhpcy4jYWRkVGFnKGVsZW0udGFnTmFtZSk7XG5cdH1cblxuXG4gICAgcHJvdGVjdGVkIHJlc291cmNlcygpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0XCJpbmRleC5qc1wiLFxuXHRcdFx0XCJpbmRleC5odG1sXCIsXG5cdFx0XHRcImluZGV4LmNzc1wiXG5cdFx0XTtcbiAgICB9XG5cblx0cHJvdGVjdGVkIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nfT4pIHtcblxuXHRcdGNvbnN0IGpzID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXG5cdFx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdFx0aWYoIGpzICE9PSB1bmRlZmluZWQgKVxuXHRcdFx0a2xhc3MgPSBqcyhvcHRzKTtcblx0XHRlbHNlIGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdChvcHRzIGFzIGFueSkuY29udGVudF9mYWN0b3J5ID0gKHN0cjogc3RyaW5nKSA9PiB7XG5cblx0XHRcdFx0Y29uc3QgY29udGVudCA9IGh0bWxgJHtzdHJ9YDtcblxuXHRcdFx0XHRsZXQgc3BhbnMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpc3NbdmFsdWVdJyk7XG5cblx0XHRcdFx0cmV0dXJuIChfYTogdW5rbm93biwgX2I6dW5rbm93biwgZWxlbTogSFRNTEVsZW1lbnQpID0+IHtcblxuXHRcdFx0XHRcdC8vIGNhbiBiZSBvcHRpbWl6ZWQuLi5cblx0XHRcdFx0XHRmb3IobGV0IHNwYW4gb2Ygc3BhbnMpXG5cdFx0XHRcdFx0XHRzcGFuLnRleHRDb250ZW50ID0gZWxlbS5nZXRBdHRyaWJ1dGUoc3Bhbi5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykhKVxuXG5cdFx0XHRcdFx0cmV0dXJuIGNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHR9O1xuXG5cdFx0XHRrbGFzcyA9IGNsYXNzIFdlYkNvbXBvbmVudCBleHRlbmRzIExJU1Mob3B0cykge307XG5cdFx0fVxuXG5cdFx0aWYoa2xhc3MgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuXG5cdFx0cmV0dXJuIGRlZmluZSh0YWduYW1lLCBrbGFzcyk7XG5cdH1cblxuXHRhc3luYyAjYWRkVGFnKHRhZ25hbWU6IHN0cmluZykge1xuXG5cdFx0dGFnbmFtZSA9IHRhZ25hbWUudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmKCB0YWduYW1lID09PSAnbGlzcy1hdXRvJyB8fCB0YWduYW1lID09PSAnYmxpc3MtYXV0bycgfHwgISB0YWduYW1lLmluY2x1ZGVzKCctJykgfHwgdGhpcy4ja25vd25fdGFnLmhhcyggdGFnbmFtZSApIClcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuI2tub3duX3RhZy5hZGQodGFnbmFtZSk7XG5cblx0XHRhd2FpdCB0aGlzLiNzdzsgLy8gZW5zdXJlIFNXIGlzIGluc3RhbGxlZC5cblxuXHRcdGNvbnN0IGZpbGVuYW1lcyA9IHRoaXMucmVzb3VyY2VzKCk7XG5cdFx0Y29uc3QgcmVzb3VyY2VzID0gYXdhaXQgUHJvbWlzZS5hbGwoIGZpbGVuYW1lcy5tYXAoIGZpbGUgPT4gZmlsZS5lbmRzV2l0aCgnLmpzJylcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PyBfaW1wb3J0ICAgKGAke3RoaXMuI2RpcmVjdG9yeX0vJHt0YWduYW1lfS8ke2ZpbGV9YCwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0OiBfZmV0Y2hUZXh0KGAke3RoaXMuI2RpcmVjdG9yeX0vJHt0YWduYW1lfS8ke2ZpbGV9YCwgdHJ1ZSkgKSApO1xuXG5cdFx0Y29uc3QgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZmlsZW5hbWVzLmxlbmd0aDsgKytpKVxuXHRcdFx0aWYoIHJlc291cmNlc1tpXSAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRmaWxlc1tmaWxlbmFtZXNbaV1dID0gcmVzb3VyY2VzW2ldO1xuXG5cdFx0Y29uc3QgY29udGVudCA9IGZpbGVzW1wiaW5kZXguaHRtbFwiXTtcblx0XHRjb25zdCBjc3MgICAgID0gZmlsZXNbXCJpbmRleC5jc3NcIl07XG5cblx0XHRjb25zdCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nfT4gPSB7XG5cdFx0XHQuLi5jb250ZW50ICE9PSB1bmRlZmluZWQgJiYge2NvbnRlbnR9LFxuXHRcdFx0Li4uY3NzICAgICAhPT0gdW5kZWZpbmVkICYmIHtjc3N9LFxuXHRcdH07XG5cblx0XHRyZXR1cm4gdGhpcy5kZWZpbmVXZWJDb21wb25lbnQodGFnbmFtZSwgZmlsZXMsIG9wdHMpO1xuXHRcdFxuXHR9XG59XG5cbi8vIHByZXZlbnRzIG11bHRpLWRlY2xhcmF0aW9ucy4uLlxuaWYoIGN1c3RvbUVsZW1lbnRzLmdldChcImxpc3MtYXV0b1wiKSA9PT0gdW5kZWZpbmVkKVxuXHRkZWZpbmUoXCJsaXNzLWF1dG9cIiwgTElTU19BdXRvKTtcblxuLy9UT0RPOiBmaXguLi5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50cyB7XG5cdFwibGlzcy1hdXRvXCI6IExJU1NfQXV0b1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBpbnRlcm5hbCB0b29scyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn0iLCJpbXBvcnQgeyBpbml0aWFsaXplLCBpbml0aWFsaXplU3luYyB9IGZyb20gXCIuLi9zdGF0ZVwiO1xuaW1wb3J0IHsgTElTU0Jhc2UgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnR8SFRNTEVsZW1lbnQ+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG4gICAgXG4gICAgbGV0IHN0cmluZyA9IHN0clswXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgICBzdHJpbmcgKz0gYCR7YXJnc1tpXX1gO1xuICAgICAgICBzdHJpbmcgKz0gYCR7c3RyW2krMV19YDtcbiAgICAgICAgLy9UT0RPOiBtb3JlIHByZS1wcm9jZXNzZXNcbiAgICB9XG5cbiAgICAvLyB1c2luZyB0ZW1wbGF0ZSBwcmV2ZW50cyBDdXN0b21FbGVtZW50cyB1cGdyYWRlLi4uXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyaW5nLnRyaW0oKTtcblxuICAgIGlmKCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKVxuICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCEgYXMgdW5rbm93biBhcyBUO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQhIGFzIHVua25vd24gYXMgVDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3M8VCBleHRlbmRzIExJU1NCYXNlPihzdHI6IHJlYWRvbmx5IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3QgZWxlbSA9IGh0bWwoc3RyLCAuLi5hcmdzKTtcblxuICAgIGlmKCBlbGVtIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIEhUTUxFbGVtZW50IGdpdmVuIWApO1xuXG4gICAgcmV0dXJuIGF3YWl0IGluaXRpYWxpemU8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXNzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oZWxlbSk7XG59XG5cblxudHlwZSBCVUlMRF9PUFRJT05TPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBQYXJ0aWFsPHtcbiAgICBwYXJhbXMgICAgOiBQYXJ0aWFsPFRbXCJwYXJhbXNcIl0+LFxuICAgIGNvbnRlbnRcdCAgOiBzdHJpbmd8Tm9kZXxyZWFkb25seSBOb2RlW10sXG4gICAgaWQgXHRcdCAgICA6IHN0cmluZyxcbiAgICBjbGFzc2VzXHQgIDogcmVhZG9ubHkgc3RyaW5nW10sXG4gICAgY3NzdmFycyAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4sXG4gICAgYXR0cnMgXHQgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBkYXRhIFx0ICAgIDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgc3RyaW5nfGJvb2xlYW4+PixcbiAgICBsaXN0ZW5lcnMgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCAoZXY6IEV2ZW50KSA9PiB2b2lkPj5cbn0+ICYgKHtcbiAgaW5pdGlhbGl6ZTogZmFsc2UsXG4gIHBhcmVudDogRWxlbWVudFxufXx7XG4gIGluaXRpYWxpemU/OiB0cnVlLFxuICBwYXJlbnQ/OiBFbGVtZW50XG59KTtcblxuLy9hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBQcm9taXNlPENvbXBvbmVudHNbVF0+O1xuLypcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZT4odGFnbmFtZTogc3RyaW5nLCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxUPik6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBidWlsZDxUIGV4dGVuZHMgTElTU0Jhc2U+KHRhZ25hbWU6IHN0cmluZywge1xuICAgICAgICAgICAgICBwYXJhbXMgICAgPSB7fSxcbiAgICAgICAgICAgICAgaW5pdGlhbGl6ZT0gdHJ1ZSxcbiAgICAgICAgICAgICAgY29udGVudCAgID0gW10sXG4gICAgICAgICAgICAgIHBhcmVudCAgICA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgaWQgXHRcdCAgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGNsYXNzZXMgICA9IFtdLFxuICAgICAgICAgICAgICBjc3N2YXJzICAgPSB7fSxcbiAgICAgICAgICAgICAgYXR0cnMgICAgID0ge30sXG4gICAgICAgICAgICAgIGRhdGEgXHQgID0ge30sXG4gICAgICAgICAgICAgIGxpc3RlbmVycyA9IHt9XG4gICAgICAgICAgICAgIH06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFByb21pc2U8VD4ge1xuXG4gIGlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxuICBsZXQgQ3VzdG9tQ2xhc3MgPSBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcbiAgbGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuICAvLyBGaXggaXNzdWUgIzJcbiAgaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbiAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuICBpZiggaWQgIT09IHVuZGVmaW5lZCApXG4gIGVsZW0uaWQgPSBpZDtcblxuICBpZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuICBlbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG4gIGVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG4gIGZvcihsZXQgbmFtZSBpbiBhdHRycykge1xuXG4gIGxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuICBpZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbiAgZWxlbS50b2dnbGVBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICBlbHNlXG4gIGVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxuXG4gIGZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbiAgbGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbiAgaWYoIHZhbHVlID09PSBmYWxzZSlcbiAgZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbiAgZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbiAgZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcbiAgZWxzZVxuICBlbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuICBjb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbiAgZWxlbS5yZXBsYWNlQ2hpbGRyZW4oLi4uY29udGVudCk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbiAgaWYoIHBhcmVudCAhPT0gdW5kZWZpbmVkIClcbiAgcGFyZW50LmFwcGVuZChlbGVtKTtcblxuICBpZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbiAgcmV0dXJuIGF3YWl0IExJU1MuaW5pdGlhbGl6ZShlbGVtKTtcblxuICByZXR1cm4gYXdhaXQgTElTUy5nZXRMSVNTKGVsZW0pO1xufVxuTElTUy5idWlsZCA9IGJ1aWxkO1xuXG5cbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4odGFnbmFtZTogVCwgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8Q29tcG9uZW50c1tUXT4pOiBDb21wb25lbnRzW1RdO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogVDtcbmZ1bmN0aW9uIGJ1aWxkU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4odGFnbmFtZTogc3RyaW5nLCB7XG5wYXJhbXMgICAgPSB7fSxcbmluaXRpYWxpemU9IHRydWUsXG5jb250ZW50ICAgPSBbXSxcbnBhcmVudCAgICA9IHVuZGVmaW5lZCxcbmlkIFx0XHQgID0gdW5kZWZpbmVkLFxuY2xhc3NlcyAgID0gW10sXG5jc3N2YXJzICAgPSB7fSxcbmF0dHJzICAgICA9IHt9LFxuZGF0YSBcdCAgPSB7fSxcbmxpc3RlbmVycyA9IHt9XG59OiBCVUlMRF9PUFRJT05TPFQ+ID0ge30pOiBUIHtcblxuaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG50aHJvdyBuZXcgRXJyb3IoXCJBIHBhcmVudCBtdXN0IGJlIGdpdmVuIGlmIGluaXRpYWxpemUgaXMgZmFsc2VcIik7XG5cbmxldCBDdXN0b21DbGFzcyA9IGN1c3RvbUVsZW1lbnRzLmdldCh0YWduYW1lKTtcbmlmKEN1c3RvbUNsYXNzID09PSB1bmRlZmluZWQpXG50aHJvdyBuZXcgRXJyb3IoYCR7dGFnbmFtZX0gbm90IGRlZmluZWRgKTtcbmxldCBlbGVtID0gbmV3IEN1c3RvbUNsYXNzKHBhcmFtcykgYXMgTElTU0hvc3Q8VD47XG5cbi8vVE9ETzogZmFjdG9yaXplLi4uXG5cbi8vIEZpeCBpc3N1ZSAjMlxuaWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcbmVsZW0uc2V0QXR0cmlidXRlKFwiaXNcIiwgdGFnbmFtZSk7XG5cbmlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbmVsZW0uaWQgPSBpZDtcblxuaWYoIGNsYXNzZXMubGVuZ3RoID4gMClcbmVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuZm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG5lbGVtLnN0eWxlLnNldFByb3BlcnR5KGAtLSR7bmFtZX1gLCBjc3N2YXJzW25hbWVdKTtcblxuZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbmxldCB2YWx1ZSA9IGF0dHJzW25hbWVdO1xuaWYoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpXG5lbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5lbHNlXG5lbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59XG5cbmZvcihsZXQgbmFtZSBpbiBkYXRhKSB7XG5cbmxldCB2YWx1ZSA9IGRhdGFbbmFtZV07XG5pZiggdmFsdWUgPT09IGZhbHNlKVxuZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcbmVsc2UgaWYodmFsdWUgPT09IHRydWUpXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuZWxzZVxuZWxlbS5kYXRhc2V0W25hbWVdID0gdmFsdWU7XG59XG5cbmlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuY29udGVudCA9IFtjb250ZW50IGFzIGFueV07XG5lbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuZm9yKGxldCBuYW1lIGluIGxpc3RlbmVycylcbmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG5pZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxucGFyZW50LmFwcGVuZChlbGVtKTtcblxuaWYoICEgZWxlbS5pc0luaXQgJiYgaW5pdGlhbGl6ZSApXG5MSVNTLmluaXRpYWxpemVTeW5jKGVsZW0pO1xuXG5yZXR1cm4gTElTUy5nZXRMSVNTU3luYyhlbGVtKTtcbn1cbkxJU1MuYnVpbGRTeW5jID0gYnVpbGRTeW5jO1xuKi8iLCJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgUXVlcnlTZWxlY3RvcnMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IExJU1MgZnJvbSBcIi4uL2V4dGVuZHNcIjtcbmltcG9ydCB0eXBlIHsgTElTU0Jhc2UsIExJU1NIb3N0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplU3luYywgd2hlbkluaXRpYWxpemVkIH0gZnJvbSBcIi4uL3N0YXRlXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRzIHt9O1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2V4dGVuZHNcIiB7XG4gICAgaW50ZXJmYWNlIElMSVNTIHtcbiAgICAgICAgLy8gYXN5bmNcbiAgICAgICAgcXMgOiB0eXBlb2YgcXM7XG4gICAgICAgIHFzbzogdHlwZW9mIHFzbztcbiAgICAgICAgcXNhOiB0eXBlb2YgcXNhO1xuICAgICAgICBxc2M6IHR5cGVvZiBxc2M7XG5cbiAgICAgICAgLy8gc3luY1xuICAgICAgICBxc1N5bmMgOiB0eXBlb2YgcXNTeW5jO1xuICAgICAgICBxc2FTeW5jOiB0eXBlb2YgcXNhU3luYztcbiAgICAgICAgcXNjU3luYzogdHlwZW9mIHFzY1N5bmM7XG5cblx0XHRjbG9zZXN0OiB0eXBlb2YgY2xvc2VzdDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3Nfc2VsZWN0b3IobmFtZT86IHN0cmluZykge1xuXHRpZihuYW1lID09PSB1bmRlZmluZWQpIC8vIGp1c3QgYW4gaDRja1xuXHRcdHJldHVybiBcIlwiO1xuXHRyZXR1cm4gYDppcygke25hbWV9LCBbaXM9XCIke25hbWV9XCJdKWA7XG59XG5cbmZ1bmN0aW9uIF9idWlsZFFTKHNlbGVjdG9yOiBzdHJpbmcsIHRhZ25hbWVfb3JfcGFyZW50Pzogc3RyaW5nIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LCBwYXJlbnQ6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cdFxuXHRpZiggdGFnbmFtZV9vcl9wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGFnbmFtZV9vcl9wYXJlbnQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cGFyZW50ID0gdGFnbmFtZV9vcl9wYXJlbnQ7XG5cdFx0dGFnbmFtZV9vcl9wYXJlbnQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRyZXR1cm4gW2Ake3NlbGVjdG9yfSR7bGlzc19zZWxlY3Rvcih0YWduYW1lX29yX3BhcmVudCBhcyBzdHJpbmd8dW5kZWZpbmVkKX1gLCBwYXJlbnRdIGFzIGNvbnN0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxczxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0bGV0IHJlc3VsdCA9IGF3YWl0IHFzbzxUPihzZWxlY3RvciwgcGFyZW50KTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gcmVzdWx0IVxufVxuXG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KCBlbGVtZW50ICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VFtdPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXVtdID47XG5hc3luYyBmdW5jdGlvbiBxc2E8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCBwcm9taXNlcyA9IG5ldyBBcnJheTxQcm9taXNlPFQ+PiggZWxlbWVudHMubGVuZ3RoICk7XG5cdGZvcihsZXQgZWxlbWVudCBvZiBlbGVtZW50cylcblx0XHRwcm9taXNlc1tpZHgrK10gPSB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcblxuXHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGF3YWl0IHdoZW5Jbml0aWFsaXplZDxUPihyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcjxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGlmKCBlbGVtZW50ID09PSBudWxsIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG59XG5cbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBUW107XG5mdW5jdGlvbiBxc2FTeW5jPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBDb21wb25lbnRzW05dW107XG5mdW5jdGlvbiBxc2FTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBpbml0aWFsaXplU3luYzxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogVDtcbmZ1bmN0aW9uIHFzY1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBDb21wb25lbnRzW05dO1xuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA/OiBFbGVtZW50KSB7XG5cblx0Y29uc3QgcmVzID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBlbGVtZW50KTtcblx0XG5cdGNvbnN0IHJlc3VsdCA9IChyZXNbMV0gYXMgdW5rbm93biBhcyBFbGVtZW50KS5jbG9zZXN0PExJU1NIb3N0PFQ+PihyZXNbMF0pO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0cmV0dXJuIGluaXRpYWxpemVTeW5jPFQ+KHJlc3VsdCk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjbG9zZXN0PEUgZXh0ZW5kcyBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50KSB7XG5cblx0d2hpbGUodHJ1ZSkge1xuXHRcdHZhciByZXN1bHQgPSBlbGVtZW50LmNsb3Nlc3Q8RT4oc2VsZWN0b3IpO1xuXG5cdFx0aWYoIHJlc3VsdCAhPT0gbnVsbClcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuXHRcdGlmKCAhIChcImhvc3RcIiBpbiByb290KSApXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGVsZW1lbnQgPSAocm9vdCBhcyBTaGFkb3dSb290KS5ob3N0O1xuXHR9XG59XG5cblxuLy8gYXN5bmNcbkxJU1MucXMgID0gcXM7XG5MSVNTLnFzbyA9IHFzbztcbkxJU1MucXNhID0gcXNhO1xuTElTUy5xc2MgPSBxc2M7XG5cbi8vIHN5bmNcbkxJU1MucXNTeW5jICA9IHFzU3luYztcbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG5MSVNTLmNsb3Nlc3QgPSBjbG9zZXN0OyIsImltcG9ydCBMSVNTIGZyb20gXCIuL2V4dGVuZHNcIjtcblxuaW1wb3J0IFwiLi9kZWZpbmVcIjsgLy9UT0RPOiBjdXN0b21SZWdpc3Rlcnlcbi8vVE9ETzogZ2xvYmFsQ1NTUnVsZXNcbi8vVE9ETzogQkxJU1Ncbi8vVE9ETzogTElTU1BhcmFtc1xuLy9UT0RPOiBvdGhlcnMuLi5cblxuXG5pbXBvcnQgXCIuL2hlbHBlcnMvcXVlcnlTZWxlY3RvcnNcIjtcbmltcG9ydCBcIi4vaGVscGVycy9MSVNTQXV0b1wiO1xuXG5leHBvcnQge2xpc3MsIGxpc3NTeW5jLCBodG1sfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5leHBvcnQgZGVmYXVsdCBMSVNTOyIsImltcG9ydCB7IExJU1NCYXNlLCBMSVNTQmFzZUNzdHIsIExJU1NIb3N0LCBMSVNTSG9zdENzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSwgaXNET01Db250ZW50TG9hZGVkLCB3aGVuRE9NQ29udGVudExvYWRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmVudW0gU3RhdGUge1xuICAgIE5PTkUgPSAwLFxuXG4gICAgLy8gY2xhc3NcbiAgICBERUZJTkVEID0gMSA8PCAwLFxuICAgIFJFQURZICAgPSAxIDw8IDEsXG5cbiAgICAvLyBpbnN0YW5jZVxuICAgIFVQR1JBREVEICAgID0gMSA8PCAyLFxuICAgIElOSVRJQUxJWkVEID0gMSA8PCAzLFxufVxuXG5leHBvcnQgY29uc3QgREVGSU5FRCAgICAgPSBTdGF0ZS5ERUZJTkVEO1xuZXhwb3J0IGNvbnN0IFJFQURZICAgICAgID0gU3RhdGUuUkVBRFk7XG5leHBvcnQgY29uc3QgVVBHUkFERUQgICAgPSBTdGF0ZS5VUEdSQURFRDtcbmV4cG9ydCBjb25zdCBJTklUSUFMSVpFRCA9IFN0YXRlLklOSVRJQUxJWkVEO1xuXG5leHBvcnQgY2xhc3MgTElTU1N0YXRlIHtcblxuICAgICNlbGVtOiBIVE1MRWxlbWVudHxudWxsO1xuXG4gICAgLy8gaWYgbnVsbCA6IGNsYXNzIHN0YXRlLCBlbHNlIGluc3RhbmNlIHN0YXRlXG4gICAgY29uc3RydWN0b3IoZWxlbTogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGwpIHtcbiAgICAgICAgdGhpcy4jZWxlbSA9IGVsZW07XG4gICAgfVxuXG4gICAgc3RhdGljIERFRklORUQgICAgID0gREVGSU5FRDtcbiAgICBzdGF0aWMgUkVBRFkgICAgICAgPSBSRUFEWTtcbiAgICBzdGF0aWMgVVBHUkFERUQgICAgPSBVUEdSQURFRDtcbiAgICBzdGF0aWMgSU5JVElBTElaRUQgPSBJTklUSUFMSVpFRDtcblxuICAgIGlzKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEICAgICAmJiAhIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgICAgICAgJiYgISB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCAgICAmJiAhIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEICYmICEgdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlbihzdGF0ZTogU3RhdGUpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgbGV0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8YW55Pj4oKTtcbiAgICBcbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5EZWZpbmVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuUmVhZHkoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5VcGdyYWRlZCgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkluaXRpYWxpemVkKCkgKTtcbiAgICBcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBERUZJTkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzRGVmaW5lZCgpIHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGN1c3RvbUVsZW1lbnRzLmdldCggZ2V0TmFtZSh0aGlzLiNlbGVtKSApICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5EZWZpbmVkPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2U+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKCBnZXROYW1lKHRoaXMuI2VsZW0pICkgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gUkVBRFkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNSZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IEhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG5cbiAgICAgICAgaWYoICEgaXNET01Db250ZW50TG9hZGVkKCkgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBIb3N0LmlzRGVwc1Jlc29sdmVkO1xuICAgIH1cblxuICAgIGFzeW5jIHdoZW5SZWFkeSgpIHtcblxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpOyAvLyBjb3VsZCBiZSByZWFkeSBiZWZvcmUgZGVmaW5lZCwgYnV0IHdlbGwuLi5cblxuICAgICAgICBhd2FpdCB3aGVuRE9NQ29udGVudExvYWRlZDtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5EZXBzUmVzb2x2ZWQ7XG4gICAgfVxuICAgIFxuICAgIC8vID09PT09PT09PT09PT09PT09PSBVUEdSQURFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1VwZ3JhZGVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICBjb25zdCBob3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuICAgICAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIGhvc3Q7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG5cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMud2hlbkRlZmluZWQoKTtcbiAgICBcbiAgICAgICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBob3N0KVxuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICBcbiAgICAgICAgLy8gaDRja1xuICAgIFxuICAgICAgICBpZiggXCJfd2hlblVwZ3JhZGVkXCIgaW4gZWxlbSkge1xuICAgICAgICAgICAgYXdhaXQgZWxlbS5fd2hlblVwZ3JhZGVkO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0gYXMgVDtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICAgICAgXG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZCAgICAgICAgPSBwcm9taXNlO1xuICAgICAgICAoZWxlbSBhcyBhbnkpLl93aGVuVXBncmFkZWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcblxuICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBJTklUSUFMSVpFRCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc0luaXRpYWxpemVkKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuI2VsZW07XG5cbiAgICAgICAgaWYoICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAgICAgcmV0dXJuIFwiaXNJbml0aWFsaXplZFwiIGluIGVsZW0gJiYgZWxlbS5pc0luaXRpYWxpemVkO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyB3aGVuSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIExJU1NCYXNlPigpIHtcbiAgICBcbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuVXBncmFkZWQoKTtcblxuICAgICAgICBhd2FpdCBob3N0LndoZW5Jbml0aWFsaXplZDtcblxuICAgICAgICByZXR1cm4gKGVsZW0gYXMgTElTU0hvc3Q8VD4pLmJhc2UgYXMgVDtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT0gQ09OVkVSU0lPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICB2YWx1ZU9mKCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBsZXQgc3RhdGU6IFN0YXRlID0gMDtcbiAgICBcbiAgICAgICAgaWYoIHRoaXMuaXNEZWZpbmVkIClcbiAgICAgICAgICAgIHN0YXRlIHw9IERFRklORUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzUmVhZHkgKVxuICAgICAgICAgICAgc3RhdGUgfD0gUkVBRFk7XG4gICAgICAgIGlmKCB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gVVBHUkFERUQ7XG4gICAgICAgIGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gSU5JVElBTElaRUQ7XG4gICAgXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMudmFsdWVPZigpO1xuICAgICAgICBsZXQgaXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIkRFRklORURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFJFQURZIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJSRUFEWVwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgVVBHUkFERUQgKVxuICAgICAgICAgICAgaXMucHVzaChcIlVQR1JBREVEXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBJTklUSUFMSVpFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiSU5JVElBTElaRURcIik7XG4gICAgXG4gICAgICAgIHJldHVybiBpcy5qb2luKCd8Jyk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUoZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiggXCJzdGF0ZVwiIGluIGVsZW0pXG4gICAgICAgIHJldHVybiBlbGVtLnN0YXRlIGFzIExJU1NTdGF0ZTtcbiAgICBcbiAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5zdGF0ZSA9IG5ldyBMSVNTU3RhdGUoZWxlbSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PSBTdGF0ZSBtb2RpZmllcnMgKG1vdmU/KSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gR28gdG8gc3RhdGUgREVGSU5FRFxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihcbiAgICB0YWduYW1lICAgICAgIDogc3RyaW5nLFxuICAgIENvbXBvbmVudENsYXNzOiBUfExJU1NIb3N0Q3N0cjxUPikge1xuXG4gICAgLy8gY291bGQgYmUgYmV0dGVyLlxuICAgIGlmKCBcIkJhc2VcIiBpbiBDb21wb25lbnRDbGFzcykge1xuICAgICAgICBDb21wb25lbnRDbGFzcyA9IENvbXBvbmVudENsYXNzLkJhc2UgYXMgVDtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgQ2xhc3MgID0gQ29tcG9uZW50Q2xhc3MuTElTU0NmZy5ob3N0O1xuICAgIGxldCBodG1sdGFnICA9IF9lbGVtZW50MnRhZ25hbWUoQ2xhc3MpPz91bmRlZmluZWQ7XG5cbiAgICBjb25zdCBMSVNTY2xhc3MgPSBDb21wb25lbnRDbGFzcy5Ib3N0OyAvL2J1aWxkTElTU0hvc3Q8VD4oQ29tcG9uZW50Q2xhc3MsIHBhcmFtcyk7XG5cbiAgICBjb25zdCBvcHRzID0gaHRtbHRhZyA9PT0gdW5kZWZpbmVkID8ge31cbiAgICAgICAgICAgICAgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuLy8gR28gdG8gc3RhdGUgVVBHUkFERURcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGdyYWRlPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgc3RyaWN0ID0gZmFsc2UpOiBQcm9taXNlPFQ+IHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNVcGdyYWRlZCAmJiBzdHJpY3QgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgdXBncmFkZWQhYCk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuRGVmaW5lZCgpO1xuXG4gICAgcmV0dXJuIHVwZ3JhZGVTeW5jPFQ+KGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBncmFkZVN5bmM8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFQge1xuICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcbiAgICBcbiAgICBpZiggISBzdGF0ZS5pc0RlZmluZWQgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IGRlZmluZWQhJyk7XG5cbiAgICBpZiggZWxlbS5vd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCApXG4gICAgICAgIGRvY3VtZW50LmFkb3B0Tm9kZShlbGVtKTtcbiAgICBjdXN0b21FbGVtZW50cy51cGdyYWRlKGVsZW0pO1xuXG4gICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIChlbGVtIGluc3RhbmNlb2YgSG9zdCkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgZGlkbid0IHVwZ3JhZGUhYCk7XG5cbiAgICByZXR1cm4gZWxlbSBhcyBUO1xufVxuXG4vLyBHbyB0byBzdGF0ZSBJTklUSUFMSVpFRFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZTxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgc3RyaWN0OiBib29sZWFufFRbXCJwYXJhbXNcIl0gPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggc3RhdGUuaXNJbml0aWFsaXplZCApIHtcbiAgICAgICAgaWYoIHN0cmljdCA9PT0gZmFsc2UgKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHVwZ3JhZGUoZWxlbSk7XG5cbiAgICBhd2FpdCBzdGF0ZS53aGVuUmVhZHkoKTtcblxuICAgIGxldCBwYXJhbXMgPSB0eXBlb2Ygc3RyaWN0ID09PSBcImJvb2xlYW5cIiA/IHt9IDogc3RyaWN0O1xuICAgIGhvc3QuaW5pdGlhbGl6ZShwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGhvc3QuYmFzZSBhcyBUO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogVCB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSlcbiAgICAgICAgICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLmJhc2UgYXMgVDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IGluaXRpYWxpemVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGhvc3QgPSB1cGdyYWRlU3luYyhlbGVtKTtcblxuICAgIGlmKCAhIHN0YXRlLmlzUmVhZHkgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IG5vdCByZWFkeSAhXCIpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG4vLyA9PT09PT09PT09PT09PT09PT09PT09IGV4dGVybmFsIFdIRU4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5VcGdyYWRlZDxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIGZvcmNlPWZhbHNlLCBzdHJpY3Q9ZmFsc2UpOiBQcm9taXNlPFQ+IHtcbiAgICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIGZvcmNlIClcbiAgICAgICAgcmV0dXJuIGF3YWl0IHVwZ3JhZGUoZWxlbSwgc3RyaWN0KTtcblxuICAgIHJldHVybiBhd2FpdCBzdGF0ZS53aGVuVXBncmFkZWQ8VD4oKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KGVsZW0gOiBIVE1MRWxlbWVudHxMSVNTSG9zdDxUPiwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5Jbml0aWFsaXplZDxUPigpO1xufVxuXG4vLyBQcml2YXRlIGZvciBub3cuXG5cbmZ1bmN0aW9uIGdldEhvc3RDc3RyU3luYzxUIGV4dGVuZHMgTElTU0hvc3RDc3RyPExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgXG4gICAgY29uc3QgbmFtZSA9IGdldE5hbWUoZWxlbSk7XG4gICAgY29uc3QgaG9zdCA9IGN1c3RvbUVsZW1lbnRzLmdldCggbmFtZSApO1xuICAgIGlmKCBob3N0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfSBub3QgeWV0IGRlZmluZWQhYCk7XG4gICAgcmV0dXJuIGhvc3QgYXMgVDtcbn1cblxuLy9UT0RPOiBtb3ZlIDIgcmVnaXN0ZXJ5Li4uXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSggZWxlbWVudDogRWxlbWVudCApOiBzdHJpbmcge1xuXG5cdGNvbnN0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaXMnKSA/PyBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XG5cdGlmKCAhIG5hbWUuaW5jbHVkZXMoJy0nKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7bmFtZX0gaXMgbm90IGEgV2ViQ29tcG9uZW50YCk7XG5cblx0cmV0dXJuIG5hbWU7XG59IiwiaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBMSVNTIH0gZnJvbSBcIi4vTElTU0Jhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDbGFzcyB7fVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IHsgbmV3KC4uLmFyZ3M6YW55W10pOiBUfTtcblxuZXhwb3J0IHR5cGUgQ1NTX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxTdHlsZUVsZW1lbnR8Q1NTU3R5bGVTaGVldDtcbmV4cG9ydCB0eXBlIENTU19Tb3VyY2UgICA9IENTU19SZXNvdXJjZSB8IFByb21pc2U8Q1NTX1Jlc291cmNlPjtcblxuZXhwb3J0IHR5cGUgSFRNTF9SZXNvdXJjZSA9IHN0cmluZ3xSZXNwb25zZXxIVE1MVGVtcGxhdGVFbGVtZW50fE5vZGU7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vVE9ETzogaW1wbGVtZW50ID9cbmV4cG9ydCBlbnVtIExpZmVDeWNsZSB7XG4gICAgREVGQVVMVCAgICAgICAgICAgICAgICAgICA9IDAsXG5cdC8vIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAgICBJTklUX0FGVEVSX0NISUxEUkVOICAgICAgID0gMSA8PCAxLFxuICAgIElOSVRfQUZURVJfUEFSRU5UICAgICAgICAgPSAxIDw8IDIsXG4gICAgLy8gcXVpZCBwYXJhbXMvYXR0cnMgP1xuICAgIFJFQ1JFQVRFX0FGVEVSX0NPTk5FQ1RJT04gPSAxIDw8IDMsIC8qIHJlcXVpcmVzIHJlYnVpbGQgY29udGVudCArIGRlc3Ryb3kvZGlzcG9zZSB3aGVuIHJlbW92ZWQgZnJvbSBET00gKi9cbiAgICAvKiBzbGVlcCB3aGVuIGRpc2NvIDogeW91IG5lZWQgdG8gaW1wbGVtZW50IGl0IHlvdXJzZWxmICovXG59XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRGYWN0b3J5PEF0dHJzIGV4dGVuZHMgc3RyaW5nLCBQYXJhbXMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4+ID0gKCAoYXR0cnM6IFJlY29yZDxBdHRycywgbnVsbHxzdHJpbmc+LCBwYXJhbXM6IFBhcmFtcywgZWxlbTpIVE1MRWxlbWVudCkgPT4gTm9kZXx1bmRlZmluZWQgKTtcblxuLy8gVXNpbmcgQ29uc3RydWN0b3I8VD4gaW5zdGVhZCBvZiBUIGFzIGdlbmVyaWMgcGFyYW1ldGVyXG4vLyBlbmFibGVzIHRvIGZldGNoIHN0YXRpYyBtZW1iZXIgdHlwZXMuXG5leHBvcnQgdHlwZSBMSVNTX09wdHM8XG4gICAgLy8gSlMgQmFzZVxuICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAvLyBIVE1MIEJhc2VcbiAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmcsXG4gICAgPiA9IHtcbiAgICAgICAgLy8gSlMgQmFzZVxuICAgICAgICBleHRlbmRzICAgOiBFeHRlbmRzQ3RyLFxuICAgICAgICBwYXJhbXMgICAgOiBQYXJhbXMsXG4gICAgICAgIC8vIG5vbi1nZW5lcmljXG4gICAgICAgIGRlcHMgICAgICA6IHJlYWRvbmx5IFByb21pc2U8YW55PltdLFxuXG4gICAgICAgIC8vIEhUTUwgQmFzZVxuICAgICAgICBob3N0ICAgOiBIb3N0Q3N0cixcbiAgICAgICAgYXR0cnMgIDogcmVhZG9ubHkgQXR0cnNbXSxcbiAgICAgICAgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiByZWFkb25seSBBdHRyc1tdLCAvLyBmb3IgdmFuaWxsYSBjb21wYXRcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgY29udGVudD86IEhUTUxfU291cmNlLFxuICAgICAgICBjb250ZW50X2ZhY3Rvcnk6IChjb250ZW50PzogRXhjbHVkZTxIVE1MX1Jlc291cmNlLCBSZXNwb25zZT4pID0+IENvbnRlbnRGYWN0b3J5PEF0dHJzLCBQYXJhbXM+LFxuICAgICAgICBjc3MgICAgIDogQ1NTX1NvdXJjZSB8IHJlYWRvbmx5IENTU19Tb3VyY2VbXSxcbiAgICAgICAgc2hhZG93ICA6IFNoYWRvd0NmZ1xufVxuXG4vLyBMSVNTQmFzZVxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZUNzdHI8XG4gICAgICAgIEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gICAgICAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgIFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ICAgICAgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgICAgICBIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gc3RyaW5nPlxuICAgID0gUmV0dXJuVHlwZTx0eXBlb2YgTElTUzxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+O1xuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBJbnN0YW5jZVR5cGU8TElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cblxuZXhwb3J0IHR5cGUgTElTU0Jhc2UyTElTU0Jhc2VDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZT4gPSBUIGV4dGVuZHMgTElTU0Jhc2U8XG4gICAgICAgICAgICBpbmZlciBBIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICAgICAgaW5mZXIgQixcbiAgICAgICAgICAgIGluZmVyIEMsXG4gICAgICAgICAgICBpbmZlciBEPiA/IENvbnN0cnVjdG9yPFQ+ICYgTElTU0Jhc2VDc3RyPEEsQixDLEQ+IDogbmV2ZXI7XG5cblxuZXhwb3J0IHR5cGUgTElTU0hvc3RDc3RyPFQgZXh0ZW5kcyBMSVNTQmFzZXxMSVNTQmFzZUNzdHI+ID0gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxUIGV4dGVuZHMgTElTU0Jhc2UgPyBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VD4gOiBUPj47XG5leHBvcnQgdHlwZSBMSVNTSG9zdCAgICA8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBJbnN0YW5jZVR5cGU8TElTU0hvc3RDc3RyPFQ+PjsiLCIvLyBmdW5jdGlvbnMgcmVxdWlyZWQgYnkgTElTUy5cblxuLy8gZml4IEFycmF5LmlzQXJyYXlcbi8vIGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTcwMDIjaXNzdWVjb21tZW50LTIzNjY3NDkwNTBcblxudHlwZSBYPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgICAgPyBUW10gICAgICAgICAgICAgICAgICAgLy8gYW55L3Vua25vd24gPT4gYW55W10vdW5rbm93blxuICAgICAgICA6IFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gICAgICAgICAgPyBUICAgICAgICAgICAgICAgICAgICAgLy8gdW5rbm93bltdIC0gb2J2aW91cyBjYXNlXG4gICAgICAgIDogVCBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFU+ICAgICAgICAgICA/ICAgICAgIHJlYWRvbmx5IFVbXSAgICAvLyBJdGVyYWJsZTxVPiBtaWdodCBiZSBhbiBBcnJheTxVPlxuICAgICAgICA6ICAgICAgICAgIHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyAgICAgICAgICB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiByZWFkb25seSB1bmtub3duW10gZXh0ZW5kcyBUICAgICAgICAgID8gcmVhZG9ubHkgdW5rbm93bltdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogICAgICAgICAgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5ICAgICBhbnlbXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSAgICAgYW55W10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbi8vIHJlcXVpcmVkIGZvciBhbnkvdW5rbm93biArIEl0ZXJhYmxlPFU+XG50eXBlIFgyPFQ+ID0gRXhjbHVkZTx1bmtub3duLFQ+IGV4dGVuZHMgbmV2ZXIgPyB1bmtub3duIDogdW5rbm93bjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcbiAgICAgICAgaXNBcnJheTxUPihhOiBUfFgyPFQ+KTogYSBpcyBYPFQ+O1xuICAgIH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgSFRNTENMQVNTX1JFR0VYID0gIC9IVE1MKFxcdyspRWxlbWVudC87XG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmV4cG9ydCBmdW5jdGlvbiBfZWxlbWVudDJ0YWduYW1lKENsYXNzOiB0eXBlb2YgSFRNTEVsZW1lbnQpOiBzdHJpbmd8bnVsbCB7XG5cblx0aWYoIENsYXNzID09PSBIVE1MRWxlbWVudCApXG5cdFx0cmV0dXJuIG51bGw7XG5cdFxuXHRsZXQgaHRtbHRhZyA9IEhUTUxDTEFTU19SRUdFWC5leGVjKENsYXNzLm5hbWUpIVsxXTtcblx0cmV0dXJuIGVsZW1lbnROYW1lTG9va3VwVGFibGVbaHRtbHRhZyBhcyBrZXlvZiB0eXBlb2YgZWxlbWVudE5hbWVMb29rdXBUYWJsZV0gPz8gaHRtbHRhZy50b0xvd2VyQ2FzZSgpXG59XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvd1xuY29uc3QgQ0FOX0hBVkVfU0hBRE9XID0gW1xuXHRudWxsLCAnYXJ0aWNsZScsICdhc2lkZScsICdibG9ja3F1b3RlJywgJ2JvZHknLCAnZGl2Jyxcblx0J2Zvb3RlcicsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkZXInLCAnbWFpbicsXG5cdCduYXYnLCAncCcsICdzZWN0aW9uJywgJ3NwYW4nXG5cdFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NoYWRvd1N1cHBvcnRlZCh0YWc6IHR5cGVvZiBIVE1MRWxlbWVudCkge1xuXHRyZXR1cm4gQ0FOX0hBVkVfU0hBRE9XLmluY2x1ZGVzKCBfZWxlbWVudDJ0YWduYW1lKHRhZykgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIjtcbn1cblxuZXhwb3J0IGNvbnN0IHdoZW5ET01Db250ZW50TG9hZGVkID0gd2FpdERPTUNvbnRlbnRMb2FkZWQoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRET01Db250ZW50TG9hZGVkKCkge1xuICAgIGlmKCBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0XHRyZXNvbHZlKCk7XG5cdH0sIHRydWUpO1xuXG4gICAgYXdhaXQgcHJvbWlzZTtcbn1cblxuLy8gZm9yIG1peGlucy5cbmV4cG9ydCB0eXBlIENvbXBvc2VDb25zdHJ1Y3RvcjxULCBVPiA9IFxuICAgIFtULCBVXSBleHRlbmRzIFtuZXcgKGE6IGluZmVyIE8xKSA9PiBpbmZlciBSMSxuZXcgKGE6IGluZmVyIE8yKSA9PiBpbmZlciBSMl0gPyB7XG4gICAgICAgIG5ldyAobzogTzEgJiBPMik6IFIxICYgUjJcbiAgICB9ICYgUGljazxULCBrZXlvZiBUPiAmIFBpY2s8VSwga2V5b2YgVT4gOiBuZXZlciIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjsiLCJcbmltcG9ydCB7IGh0bWwsIGxpc3MgfSBmcm9tICdoZWxwZXJzL2J1aWxkJztcbmltcG9ydCBMSVNTIGZyb20gJy4uLy4uLy4uLyc7XG5pbXBvcnQgeyBkZWZpbmUsIGdldFN0YXRlIH0gZnJvbSAnc3RhdGUnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNsYXNzIE15Q29tcG9uZW50QSBleHRlbmRzIExJU1MoKSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQucmVwbGFjZUNoaWxkcmVuKGh0bWxgPGI+aHRtbFxcYFxcYCA6IE9LPC9iPmApO1xuICAgIH1cbn1cblxuZGVmaW5lKCdteS1jb21wb25lbnQtYScsIE15Q29tcG9uZW50QSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY2xhc3MgTXlDb21wb25lbnRCIGV4dGVuZHMgTElTUyh7XG4gICAgY29udGVudDogXCJsaXNzYGBcIlxufSkge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdFwiKTtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG59XG5cbmRlZmluZSgnbXktY29tcG9uZW50LWInLCBNeUNvbXBvbmVudEIpO1xuXG5hc3luYyBmdW5jdGlvbiBmb28oKSB7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBhd2FpdCBsaXNzYDxteS1jb21wb25lbnQtYj48L215LWNvbXBvbmVudC1iPmA7XG4gICAgXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoY29tcG9uZW50Lmhvc3QpO1xufVxuXG5mb28oKTtcblxue1xuICAgIGxldCBjb21wbyA9IG5ldyBNeUNvbXBvbmVudEIuSG9zdCgpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGNvbXBvKTtcblxuICAgIGNvbnNvbGUud2FybihcImhvc3RcIiwgZ2V0U3RhdGUoY29tcG8pICk7XG59XG57XG4gICAgbGV0IGNvbXBvID0gbmV3IE15Q29tcG9uZW50QigpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGNvbXBvLmhvc3QpO1xuXG4gICAgY29uc29sZS53YXJuKFwiYmFzZVwiLCBnZXRTdGF0ZShjb21wby5ob3N0KSApO1xufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcInBhZ2VzL2V4YW1wbGVzL2J1aWxkL2luZGV4Lmh0bWxcIjsiXSwibmFtZXMiOlsiYnVpbGRMSVNTSG9zdCIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc1NoYWRvd1N1cHBvcnRlZCIsImh0bWwiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkRFRkFVTFRfQ09OVEVOVF9GQUNUT1JZIiwiY29udGVudCIsInRyaW0iLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiY2xvbmVOb2RlIiwiTElTUyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsInBhcmFtcyIsImRlcHMiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnRfZmFjdG9yeSIsIl9jb250ZW50X2ZhY3RvcnkiLCJjc3MiLCJzaGFkb3ciLCJDTE9TRSIsIk5PTkUiLCJPUEVOIiwiRXJyb3IiLCJhbGxfZGVwcyIsIlByb21pc2UiLCJSZXNwb25zZSIsIl9jb250ZW50IiwicHVzaCIsInRleHQiLCJMSVNTQmFzZSIsIkxJU1NDZmciLCJzdHlsZXNoZWV0cyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImMiLCJpZHgiLCJwcm9jZXNzX2NzcyIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkhvc3QiLCJzdGF0ZSIsInNldEF0dHJEZWZhdWx0IiwiYXR0ciIsInZhbHVlIiwib25BdHRyQ2hhbmdlZCIsIl9uYW1lIiwiX29sZFZhbHVlIiwiX25ld1ZhbHVlIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwidXBkYXRlUGFyYW1zIiwiYXNzaWduIiwiaXNJbkRPTSIsImlzQ29ubmVjdGVkIiwib25ET01Db25uZWN0ZWQiLCJjb25uZWN0ZWRDYWxsYmFjayIsIm9uRE9NRGlzY29ubmVjdGVkIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJfSG9zdCIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiTElTU1N0YXRlIiwiaXNET01Db250ZW50TG9hZGVkIiwid2FpdERPTUNvbnRlbnRMb2FkZWQiLCJpZCIsInNoYXJlZENTUyIsIkxpc3MiLCJHRVQiLCJTeW1ib2wiLCJTRVQiLCJwcm9wZXJ0aWVzIiwiZnJvbUVudHJpZXMiLCJuIiwiZW51bWVyYWJsZSIsImdldCIsInNldCIsIkF0dHJpYnV0ZXMiLCJuYW1lIiwiZGF0YSIsImRlZmF1bHRzIiwic2V0dGVyIiwiZGVmaW5lUHJvcGVydGllcyIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsIndhaXRSZWFkeSIsInIiLCJhbGwiLCJpc1JlYWR5Iiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiTElTU0hvc3RCYXNlIiwiQmFzZSIsImJhc2UiLCJpc0luaXRpYWxpemVkIiwid2hlbkluaXRpYWxpemVkIiwiaW5pdGlhbGl6ZSIsImluaXQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJnZXRQYXJ0IiwiaGFzU2hhZG93IiwicXVlcnlTZWxlY3RvciIsImdldFBhcnRzIiwicXVlcnlTZWxlY3RvckFsbCIsIkNTU1NlbGVjdG9yIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInByb21pc2UiLCJyZXNvbHZlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwiYXR0YWNoU2hhZG93IiwibW9kZSIsIm9icyIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsImNzc3NlbGVjdG9yIiwiaGFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJpbm5lckhUTUwiLCJyZXBsYWNlIiwiaGVhZCIsImFwcGVuZCIsImFkZCIsIm9iaiIsImNoaWxkTm9kZXMiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiZGVmaW5lIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiQ2xhc3MiLCJodG1sdGFnIiwiTElTU2NsYXNzIiwib3B0cyIsIndoZW5EZWZpbmVkIiwiY2FsbGJhY2siLCJ3aGVuQWxsRGVmaW5lZCIsInRhZ25hbWVzIiwidCIsImlzRGVmaW5lZCIsImdldE5hbWUiLCJlbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsIl9MSVNTIiwiSUxJU1MiLCJFeHRlbmRlZExJU1MiLCJMSVNTX0F1dG8iLCJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwicmVnaXN0ZXIiLCJzdyIsInNjb3BlIiwiY29udHJvbGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkaXRpb24iLCJhZGRlZE5vZGVzIiwiRWxlbWVudCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiZWxlbSIsInJlc291cmNlcyIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwianMiLCJrbGFzcyIsInN0ciIsInNwYW5zIiwiX2EiLCJfYiIsInNwYW4iLCJ0ZXh0Q29udGVudCIsIldlYkNvbXBvbmVudCIsImZpbGVuYW1lcyIsImZpbGUiLCJlbmRzV2l0aCIsIl9pbXBvcnQiLCJfZmV0Y2hUZXh0IiwiaSIsInVyaSIsImlzTGlzc0F1dG8iLCJvcHRpb25zIiwiaGVhZGVycyIsInJlc3BvbnNlIiwiZmV0Y2giLCJzdGF0dXMiLCJkZWZhdWx0IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJpbml0aWFsaXplU3luYyIsInN0cmluZyIsInRlbXBsYXRlIiwiZmlyc3RDaGlsZCIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsImxpc3MiLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJsaXNzX3NlbGVjdG9yIiwiX2J1aWxkUVMiLCJzZWxlY3RvciIsInRhZ25hbWVfb3JfcGFyZW50IiwicGFyZW50IiwicXMiLCJyZXN1bHQiLCJxc28iLCJxc2EiLCJlbGVtZW50cyIsInByb21pc2VzIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwid2hlbkRPTUNvbnRlbnRMb2FkZWQiLCJTdGF0ZSIsIkRFRklORUQiLCJSRUFEWSIsIlVQR1JBREVEIiwiSU5JVElBTElaRUQiLCJpcyIsImlzVXBncmFkZWQiLCJ3aGVuIiwid2hlblJlYWR5Iiwid2hlblVwZ3JhZGVkIiwiZ2V0SG9zdENzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJnZXRTdGF0ZSIsInN0cmljdCIsInVwZ3JhZGVTeW5jIiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImZvcmNlIiwiTGlmZUN5Y2xlIiwiSFRNTENMQVNTX1JFR0VYIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImV4ZWMiLCJDQU5fSEFWRV9TSEFET1ciLCJ0YWciLCJyZWFkeVN0YXRlIiwiTXlDb21wb25lbnRBIiwicmVwbGFjZUNoaWxkcmVuIiwiTXlDb21wb25lbnRCIiwiZm9vIiwiY29tcG9uZW50IiwiYm9keSIsImNvbXBvIiwid2FybiJdLCJzb3VyY2VSb290IjoiIn0=