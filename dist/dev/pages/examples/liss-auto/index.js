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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7O1VDTkE7Ozs7Ozs7Ozs7Ozs7QUNBbUI7Ozs7Ozs7Ozs7Ozs7QUNBbkIsaUVBQWUscUJBQXVCLHdDQUF3QyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9MSVNTQmFzZS50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL0xJU1NIb3N0LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZGVmaW5lLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2hlbHBlcnMvTElTU0F1dG8udHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy9oZWxwZXJzL2J1aWxkLnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvaGVscGVycy9xdWVyeVNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vTElTUy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly9MSVNTLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTElTUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xJU1Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MSVNTL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvbGlzcy1hdXRvL2luZGV4LnRzIiwid2VicGFjazovL0xJU1MvLi9zcmMvcGFnZXMvZXhhbXBsZXMvbGlzcy1hdXRvL2luZGV4Lmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnVpbGRMSVNTSG9zdCB9IGZyb20gXCIuL0xJU1NIb3N0XCI7XG5pbXBvcnQgeyBDbGFzcywgQ29uc3RydWN0b3IsIENvbnRlbnRGYWN0b3J5LCBDU1NfU291cmNlLCBIVE1MX1Jlc291cmNlLCBIVE1MX1NvdXJjZSwgTGlmZUN5Y2xlLCBMSVNTX09wdHMsIFNoYWRvd0NmZyB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc1NoYWRvd1N1cHBvcnRlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBMSVNTU3RhdGUgfSBmcm9tIFwic3RhdGVcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi9oZWxwZXJzL2J1aWxkXCI7XG5cbmxldCBfX2NzdHJfaG9zdCAgOiBhbnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3N0ckhvc3QoXzogYW55KSB7XG5cdF9fY3N0cl9ob3N0ID0gXztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERFRkFVTFRfQ09OVEVOVF9GQUNUT1JZKGNvbnRlbnQ/OiBFeGNsdWRlPEhUTUxfUmVzb3VyY2UsIFJlc3BvbnNlPikge1xuXG5cdGlmKCB0eXBlb2YgY29udGVudCA9PT0gXCJzdHJpbmdcIikge1xuXG5cdFx0Y29udGVudCA9IGNvbnRlbnQudHJpbSgpO1xuXHRcdGlmKCBjb250ZW50Lmxlbmd0aCA9PT0gMCApXG5cdFx0XHRjb250ZW50ID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdGNvbnRlbnQgPSBodG1sYCR7Y29udGVudH1gO1xuXG5cdFx0Ly8gVE9ETyBMSVNTQXV0byBwYXJzZXIuLi5cblx0XHQvLyBvbmx5IGlmIG5vIEpTLi4uXG5cdFx0Ly8gdG9sZXJhdGUgbm9uLW9wdGkgKGVhc2llciA/KSBvciBzcGFuW3ZhbHVlXSA/XG5cdFx0XHQvLyA9PiByZWNvcmQgZWxlbWVudCB3aXRoIHRhcmdldC4uLlxuXHRcdFx0Ly8gPT4gY2xvbmUoYXR0cnMsIHBhcmFtcykgPT4gZm9yIGVhY2ggc3BhbiByZXBsYWNlIHRoZW4gY2xvbmUuXG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkxODIyNDQvY29udmVydC1hLXN0cmluZy10by1hLXRlbXBsYXRlLXN0cmluZ1xuXHRcdC8vbGV0IHN0ciA9IChjb250ZW50IGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiB0aGlzLmdldEF0dHJpYnV0ZShtYXRjaCk/PycnKVxuXHR9XG5cblx0aWYoIGNvbnRlbnQgaW5zdGFuY2VvZiBIVE1MVGVtcGxhdGVFbGVtZW50KVxuXHRcdGNvbnRlbnQgPSBjb250ZW50LmNvbnRlbnQ7XG5cblx0cmV0dXJuICgpID0+IGNvbnRlbnQ/LmNsb25lTm9kZSh0cnVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG5cdEV4dGVuZHNDdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4gID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuXHRQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCAvL1JlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG5cdC8vIEhUTUwgQmFzZVxuXHRIb3N0Q3N0ciAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+ID0gQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuXHRBdHRycyAgICAgIGV4dGVuZHMgc3RyaW5nICAgICAgICAgICAgICAgICAgID0gbmV2ZXIsIC8vc3RyaW5nLFxuPih7XG5cbiAgICAvLyBKUyBCYXNlXG4gICAgZXh0ZW5kczogX2V4dGVuZHMgPSBPYmplY3QgYXMgdW5rbm93biBhcyBFeHRlbmRzQ3RyLCAvKiBleHRlbmRzIGlzIGEgSlMgcmVzZXJ2ZWQga2V5d29yZC4gKi9cbiAgICBwYXJhbXMgICAgICAgICAgICA9IHt9ICAgICBhcyB1bmtub3duIGFzIFBhcmFtcyxcbiAgICAvLyBub24tZ2VuZXJpY1xuICAgIGRlcHMgICA9IFtdLFxuXG4gICAgLy8gSFRNTCBCYXNlXG4gICAgaG9zdCAgPSBIVE1MRWxlbWVudCBhcyB1bmtub3duIGFzIEhvc3RDc3RyLFxuXHRvYnNlcnZlZEF0dHJpYnV0ZXMgPSBbXSwgLy8gZm9yIHZhbmlsbGEgY29tcGF0LlxuICAgIGF0dHJzID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzLFxuICAgIC8vIG5vbi1nZW5lcmljXG4gICAgY29udGVudCxcblx0Y29udGVudF9mYWN0b3J5OiBfY29udGVudF9mYWN0b3J5ID0gREVGQVVMVF9DT05URU5UX0ZBQ1RPUlksXG4gICAgY3NzLFxuICAgIHNoYWRvdyA9IGlzU2hhZG93U3VwcG9ydGVkKGhvc3QpID8gU2hhZG93Q2ZnLkNMT1NFIDogU2hhZG93Q2ZnLk5PTkVcbn06IFBhcnRpYWw8TElTU19PcHRzPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4gPSB7fSkge1xuXG4gICAgaWYoIHNoYWRvdyAhPT0gU2hhZG93Q2ZnLk9QRU4gJiYgISBpc1NoYWRvd1N1cHBvcnRlZChob3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cbiAgICBjb25zdCBhbGxfZGVwcyA9IFsuLi5kZXBzXTtcblxuXHRsZXQgY29udGVudF9mYWN0b3J5OiBDb250ZW50RmFjdG9yeTxBdHRycywgUGFyYW1zPjtcblxuICAgIC8vIGNvbnRlbnQgcHJvY2Vzc2luZ1xuICAgIGlmKCBjb250ZW50IGluc3RhbmNlb2YgUHJvbWlzZSB8fCBjb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSB7XG4gICAgICAgIFxuXHRcdGxldCBfY29udGVudDogSFRNTF9Tb3VyY2V8dW5kZWZpbmVkID0gY29udGVudDtcblx0XHRjb250ZW50ID0gbnVsbCBhcyB1bmtub3duIGFzIHN0cmluZztcblxuICAgICAgICBhbGxfZGVwcy5wdXNoKCAoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgICAgICBfY29udGVudCA9IGF3YWl0IF9jb250ZW50O1xuICAgICAgICAgICAgaWYoIF9jb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKSAvLyBmcm9tIGEgZmV0Y2guLi5cblx0XHRcdFx0X2NvbnRlbnQgPSBhd2FpdCBfY29udGVudC50ZXh0KCk7XG5cbiAgICAgICAgICAgIExJU1NCYXNlLkxJU1NDZmcuY29udGVudF9mYWN0b3J5ID0gX2NvbnRlbnRfZmFjdG9yeShfY29udGVudCk7XG4gICAgICAgIH0pKCkgKTtcblxuICAgIH0gZWxzZSB7XG5cdFx0Y29udGVudF9mYWN0b3J5ID0gX2NvbnRlbnRfZmFjdG9yeShjb250ZW50KTtcblx0fVxuXG5cdC8vIENTUyBwcm9jZXNzaW5nXG5cdGxldCBzdHlsZXNoZWV0czogQ1NTU3R5bGVTaGVldFtdID0gW107XG5cdGlmKCBjc3MgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG5cdFx0XHQvLyBAdHMtaWdub3JlIDogdG9kbzogTElTU09wdHMgPT4gc2hvdWxkIG5vdCBiZSBhIGdlbmVyaWMgP1xuXHRcdFx0Y3NzID0gW2Nzc107XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0c3R5bGVzaGVldHMgPSBjc3MubWFwKCAoYzogQ1NTX1NvdXJjZSwgaWR4OiBudW1iZXIpID0+IHtcblxuXHRcdFx0aWYoIGMgaW5zdGFuY2VvZiBQcm9taXNlIHx8IGMgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuXG5cdFx0XHRcdGFsbF9kZXBzLnB1c2goIChhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0XHRjID0gYXdhaXQgYztcblx0XHRcdFx0XHRpZiggYyBpbnN0YW5jZW9mIFJlc3BvbnNlIClcblx0XHRcdFx0XHRcdGMgPSBhd2FpdCBjLnRleHQoKTtcblxuXHRcdFx0XHRcdHN0eWxlc2hlZXRzW2lkeF0gPSBwcm9jZXNzX2NzcyhjKTtcblxuXHRcdFx0XHR9KSgpKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbCBhcyB1bmtub3duIGFzIENTU1N0eWxlU2hlZXQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcm9jZXNzX2NzcyhjKTtcblx0XHR9KTtcblx0fVxuXG5cdHR5cGUgTElTU0hvc3Q8VD4gPSBhbnk7IC8vVE9ETy4uLlxuXHR0eXBlIExIb3N0ID0gTElTU0hvc3Q8TElTU0Jhc2U+OyAvLzwtIGNvbmZpZyBpbnN0ZWFkIG9mIExJU1NCYXNlID9cblxuXHRjbGFzcyBMSVNTQmFzZSBleHRlbmRzIF9leHRlbmRzIHtcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7IC8vIHJlcXVpcmVkIGJ5IFRTLCB3ZSBkb24ndCB1c2UgaXQuLi5cblxuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRpZiggX19jc3RyX2hvc3QgPT09IG51bGwgKVxuXHRcdFx0XHRfX2NzdHJfaG9zdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLkhvc3Qoe30sIHRoaXMpO1xuXHRcdFx0dGhpcy4jaG9zdCA9IF9fY3N0cl9ob3N0O1xuXHRcdFx0X19jc3RyX2hvc3QgPSBudWxsO1xuXHRcdH1cblxuXHRcdHJlYWRvbmx5ICNob3N0OiBhbnk7IC8vIHByZXZlbnRzIGlzc3VlICMxLi4uXG5cblx0XHQvLyBMSVNTIENvbmZpZ3Ncblx0XHRzdGF0aWMgcmVhZG9ubHkgTElTU0NmZyA9IHtcblx0XHRcdGhvc3QsXG5cdFx0XHRkZXBzLFxuXHRcdFx0YXR0cnMsXG5cdFx0XHRwYXJhbXMsXG5cdFx0XHRjb250ZW50X2ZhY3RvcnksXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG5cdFx0Z2V0IHN0YXRlKCk6IExJU1NTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdC5zdGF0ZTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IGhvc3QoKTogSW5zdGFuY2VUeXBlPEhvc3RDc3RyPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jaG9zdDtcblx0XHR9XG5cdFx0Ly9UT0RPOiBnZXQgdGhlIHJlYWwgdHlwZSA/XG5cdFx0cHJvdGVjdGVkIGdldCBjb250ZW50KCk6IEluc3RhbmNlVHlwZTxIb3N0Q3N0cj58U2hhZG93Um9vdCB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmNvbnRlbnQhO1xuXHRcdH1cblxuXHRcdC8vIGF0dHJzXG5cdFx0cHJvdGVjdGVkIGdldCBhdHRycygpOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgc2V0QXR0ckRlZmF1bHQoIGF0dHI6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuc2V0QXR0ckRlZmF1bHQoYXR0ciwgdmFsdWUpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25BdHRyQ2hhbmdlZChfbmFtZTogQXR0cnMsXG5cdFx0XHRfb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdF9uZXdWYWx1ZTogc3RyaW5nKTogdm9pZHxmYWxzZSB7fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0LlxuXHRcdHByb3RlY3RlZCBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0cnM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJnczogW0F0dHJzLCBzdHJpbmcsIHN0cmluZ10pIHtcblx0XHRcdHRoaXMub25BdHRyQ2hhbmdlZCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHQvLyBwYXJhbWV0ZXJzXG5cdFx0cHVibGljIGdldCBwYXJhbXMoKTogUmVhZG9ubHk8UGFyYW1zPiB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcztcblx0XHR9XG5cdFx0cHVibGljIHVwZGF0ZVBhcmFtcyhwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPikge1xuXHRcdFx0T2JqZWN0LmFzc2lnbiggKHRoaXMuI2hvc3QgYXMgTEhvc3QpLnBhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXG5cdFx0Ly8gRE9NXG5cdFx0cHVibGljIGdldCBpc0luRE9NKCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5pc0Nvbm5lY3RlZDtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NQ29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5jb25uZWN0ZWRDYWxsYmFjaygpO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgb25ET01EaXNjb25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLmRpc2Nvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0Ly8gZm9yIHZhbmlsbGEgY29tcGF0XG5cdFx0cHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCkge31cblx0XHRwcm90ZWN0ZWQgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7fVxuXHRcdHB1YmxpYyBnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0luRE9NO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgc3RhdGljIF9Ib3N0OiBMSVNTSG9zdDxMSVNTQmFzZT47XG5cblx0XHRzdGF0aWMgZ2V0IEhvc3QoKSB7XG5cdFx0XHRpZiggdGhpcy5fSG9zdCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aGlzLl9Ib3N0ID0gYnVpbGRMSVNTSG9zdCh0aGlzIGFzIGFueSk7IC8vVE9ETzogZml4IHR5cGUgZXJyb3IgKHdoeT8/Pylcblx0XHRcdHJldHVybiB0aGlzLl9Ib3N0O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBMSVNTQmFzZTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19jc3MoY3NzOiBzdHJpbmd8Q1NTU3R5bGVTaGVldHxIVE1MU3R5bGVFbGVtZW50KSB7XG5cblx0aWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcblx0XHRyZXR1cm4gY3NzO1xuXHRpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudClcblx0XHRyZXR1cm4gY3NzLnNoZWV0ITtcblxuXHRsZXQgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXHRpZiggdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRzdHlsZS5yZXBsYWNlU3luYyhjc3MpOyAvLyByZXBsYWNlKCkgaWYgaXNzdWVzXG5cdFx0cmV0dXJuIHN0eWxlO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCBvY2N1cnNcIik7XG59IiwiaW1wb3J0IHsgTElTU1N0YXRlLCB1cGdyYWRlU3luYyB9IGZyb20gXCIuL3N0YXRlXCI7XG5pbXBvcnQgeyBzZXRDc3RySG9zdCB9IGZyb20gXCIuL0xJU1NCYXNlXCI7XG5pbXBvcnQgeyBMSVNTX09wdHMsIExJU1NCYXNlQ3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBDb21wb3NlQ29uc3RydWN0b3IsIGlzRE9NQ29udGVudExvYWRlZCwgd2FpdERPTUNvbnRlbnRMb2FkZWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgaWQgPSAwO1xuXG50eXBlIGluZmVyTElTUzxUPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI8aW5mZXIgQSwgaW5mZXIgQiwgaW5mZXIgQywgaW5mZXIgRD4gPyBbQSxCLEMsRF0gOiBuZXZlcjtcblxuLy9UT0RPOiBzaGFkb3cgdXRpbHMgP1xuY29uc3Qgc2hhcmVkQ1NTID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8XG4gICAgICAgICAgICAgICAgICAgICAgICBUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihMaXNzOiBUKSB7XG5cdGNvbnN0IHtcblx0XHRob3N0LFxuXHRcdGF0dHJzLFxuXHRcdGNvbnRlbnRfZmFjdG9yeSxcblx0XHRzdHlsZXNoZWV0cyxcblx0XHRzaGFkb3csXG5cdH0gPSBMaXNzLkxJU1NDZmc7XG5cblx0dHlwZSBQID0gaW5mZXJMSVNTPFQ+O1xuXHQvL3R5cGUgRXh0ZW5kc0NzdHIgPSBQWzBdO1xuXHR0eXBlIFBhcmFtcyAgICAgID0gUFsxXTtcblx0dHlwZSBIb3N0Q3N0ciAgICA9IFBbMl07XG5cdHR5cGUgQXR0cnMgICAgICAgPSBQWzNdO1xuXG4gICAgdHlwZSBIb3N0ICAgPSBJbnN0YW5jZVR5cGU8SG9zdENzdHI+O1xuXG4gICAgLy8gYXR0cnMgcHJveHlcblx0Y29uc3QgR0VUID0gU3ltYm9sKCdnZXQnKTtcblx0Y29uc3QgU0VUID0gU3ltYm9sKCdzZXQnKTtcblxuXHRjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmZyb21FbnRyaWVzKCBhdHRycy5tYXAobiA9PiBbbiwge1xuXG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCk6IHN0cmluZ3xudWxsICAgICAgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtHRVRdKG4pOyB9LFxuXHRcdHNldDogZnVuY3Rpb24odmFsdWU6IHN0cmluZ3xudWxsKSB7IHJldHVybiAodGhpcyBhcyB1bmtub3duIGFzIEF0dHJpYnV0ZXMpW1NFVF0obiwgdmFsdWUpOyB9XG5cdH1dKSApO1xuXG5cdGNsYXNzIEF0dHJpYnV0ZXMge1xuICAgICAgICBbeDogc3RyaW5nXTogc3RyaW5nfG51bGw7XG5cbiAgICAgICAgI2RhdGEgICAgIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG4gICAgICAgICNkZWZhdWx0cyA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjc2V0dGVyICAgOiAobmFtZTogQXR0cnMsIHZhbHVlOiBzdHJpbmd8bnVsbCkgPT4gdm9pZDtcblxuICAgICAgICBbR0VUXShuYW1lOiBBdHRycykge1xuICAgICAgICBcdHJldHVybiB0aGlzLiNkYXRhW25hbWVdID8/IHRoaXMuI2RlZmF1bHRzW25hbWVdID8/IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIFtTRVRdKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpe1xuICAgICAgICBcdHJldHVybiB0aGlzLiNzZXR0ZXIobmFtZSwgdmFsdWUpOyAvLyByZXF1aXJlZCB0byBnZXQgYSBjbGVhbiBvYmplY3Qgd2hlbiBkb2luZyB7Li4uYXR0cnN9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihkYXRhICAgIDogUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD4sXG5cdFx0XHRcdFx0ZGVmYXVsdHM6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuICAgICAgICBcdFx0XHRzZXR0ZXIgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQpIHtcblxuICAgICAgICBcdHRoaXMuI2RhdGEgICAgID0gZGF0YTtcblx0XHRcdHRoaXMuI2RlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgICAgIFx0dGhpcy4jc2V0dGVyID0gc2V0dGVyO1xuXG4gICAgICAgIFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblx0fVxuXG5cdGNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcblxuICAgIGNvbnN0IHdhaXRSZWFkeSA9IG5ldyBQcm9taXNlPHZvaWQ+KCBhc3luYyAocikgPT4ge1xuXG4gICAgICAgIGF3YWl0IHdhaXRET01Db250ZW50TG9hZGVkKCk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKExpc3MuTElTU0NmZy5kZXBzKTtcblxuICAgICAgICBpc1JlYWR5ID0gdHJ1ZTtcblxuICAgICAgICByKCk7XG4gICAgfSk7XG5cbiAgICAvLyBObyBkZXBzIGFuZCBET00gYWxyZWFkeSBsb2FkZWQuXG4gICAgbGV0IGlzUmVhZHkgPSBMaXNzLkxJU1NDZmcuZGVwcy5sZW5ndGggPT0gMCAmJiBpc0RPTUNvbnRlbnRMb2FkZWQoKTtcblxuXHRjb25zdCBwYXJhbXMgPSBMaXNzLkxJU1NDZmcucGFyYW1zOyAvL09iamVjdC5hc3NpZ24oe30sIExpc3MuTElTU0NmZy5wYXJhbXMsIF9wYXJhbXMpO1xuXG5cdC8vXG5cblx0Y29uc3Qgd2hlbkRlcHNSZXNvbHZlZCA9IFByb21pc2UuYWxsKExpc3MuTElTU0NmZy5kZXBzKTtcblx0bGV0IGlzRGVwc1Jlc29sdmVkID0gZmFsc2U7XG5cdCggYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IHdoZW5EZXBzUmVzb2x2ZWQ7XG5cdFx0aXNEZXBzUmVzb2x2ZWQgPSB0cnVlO1xuXHR9KSgpO1xuXG5cdGNsYXNzIExJU1NIb3N0QmFzZSBleHRlbmRzIChob3N0IGFzIG5ldyAoKSA9PiBIVE1MRWxlbWVudCkge1xuXG5cdFx0Ly8gYWRvcHQgc3RhdGUgaWYgYWxyZWFkeSBjcmVhdGVkLlxuXHRcdHJlYWRvbmx5IHN0YXRlID0gKHRoaXMgYXMgYW55KS5zdGF0ZSA/PyBuZXcgTElTU1N0YXRlKHRoaXMpO1xuXG5cdFx0Ly8gPT09PT09PT09PT09IERFUEVOREVOQ0lFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0XHRzdGF0aWMgcmVhZG9ubHkgd2hlbkRlcHNSZXNvbHZlZCA9IHdoZW5EZXBzUmVzb2x2ZWQ7XG5cdFx0c3RhdGljIGdldCBpc0RlcHNSZXNvbHZlZCgpIHtcblx0XHRcdHJldHVybiBpc0RlcHNSZXNvbHZlZDtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT0gSU5JVElBTElaQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHN0YXRpYyBCYXNlID0gTGlzcztcblxuXHRcdCNiYXNlOiBhbnl8bnVsbCA9IG51bGw7XG5cdFx0Z2V0IGJhc2UoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZTtcblx0XHR9XG5cblx0XHRnZXQgaXNJbml0aWFsaXplZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNiYXNlICE9PSBudWxsO1xuXHRcdH1cblx0XHRyZWFkb25seSB3aGVuSW5pdGlhbGl6ZWQ6IFByb21pc2U8SW5zdGFuY2VUeXBlPFQ+Pjtcblx0XHQjd2hlbkluaXRpYWxpemVkX3Jlc29sdmVyO1xuXG5cdFx0aW5pdGlhbGl6ZShwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPiA9IHt9KSB7XG5cblx0XHRcdGlmKCB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgYWxyZWFkeSBpbml0aWFsaXplZCEnKTtcbiAgICAgICAgICAgIGlmKCAhICggdGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmlzRGVwc1Jlc29sdmVkIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmNpZXMgaGFzbid0IGJlZW4gbG9hZGVkICFcIik7XG5cblx0XHRcdE9iamVjdC5hc3NpZ24odGhpcy4jcGFyYW1zLCBwYXJhbXMpO1xuXG5cdFx0XHR0aGlzLiNiYXNlID0gdGhpcy5pbml0KCk7XG5cblx0XHRcdGlmKCB0aGlzLmlzQ29ubmVjdGVkIClcblx0XHRcdFx0KHRoaXMuI2Jhc2UgYXMgYW55KS5vbkRPTUNvbm5lY3RlZCgpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jYmFzZTtcblx0XHR9XG5cblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRyZWFkb25seSAjcGFyYW1zOiBQYXJhbXMgPSBwYXJhbXM7XG5cblx0XHRnZXQgcGFyYW1zKCk6IFBhcmFtcyB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jcGFyYW1zO1xuXHRcdH1cblxuICAgICAgICBwdWJsaWMgdXBkYXRlUGFyYW1zKHBhcmFtczogUGFydGlhbDxMSVNTX09wdHNbXCJwYXJhbXNcIl0+KSB7XG5cdFx0XHRpZiggdGhpcy5pc0luaXRpYWxpemVkIClcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiB0aGlzLmJhc2UhLnVwZGF0ZVBhcmFtcyhwYXJhbXMpO1xuXG4gICAgICAgICAgICAvLyB3aWwgYmUgZ2l2ZW4gdG8gY29uc3RydWN0b3IuLi5cblx0XHRcdE9iamVjdC5hc3NpZ24oIHRoaXMuI3BhcmFtcywgcGFyYW1zICk7XG5cdFx0fVxuXHRcdC8vID09PT09PT09PT09PT09IEF0dHJpYnV0ZXMgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0I2F0dHJzX2ZsYWcgPSBmYWxzZTtcblxuXHRcdCNhdHRyaWJ1dGVzICAgICAgICAgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cmlidXRlc0RlZmF1bHRzID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJzID0gbmV3IEF0dHJpYnV0ZXMoXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzLFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzLFxuXHRcdFx0KG5hbWU6IEF0dHJzLCB2YWx1ZTpzdHJpbmd8bnVsbCkgPT4ge1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gdHJ1ZTsgLy8gZG8gbm90IHRyaWdnZXIgb25BdHRyc0NoYW5nZWQuXG5cdFx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHQpIGFzIHVua25vd24gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cblx0XHRzZXRBdHRyRGVmYXVsdChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV07XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdGdldCBhdHRycygpOiBSZWFkb25seTxSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPj4ge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jYXR0cnM7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT0gQ29udGVudCA9PT09PT09PT09PT09PT09PT09XG5cblx0XHQjY29udGVudDogSG9zdHxTaGFkb3dSb290fG51bGwgPSBudWxsO1xuXG5cdFx0Z2V0IGNvbnRlbnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jY29udGVudDtcblx0XHR9XG5cblx0XHRnZXRQYXJ0KG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXHRcdGdldFBhcnRzKG5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaGFzU2hhZG93XG5cdFx0XHRcdFx0PyB0aGlzLiNjb250ZW50Py5xdWVyeVNlbGVjdG9yQWxsKGA6OnBhcnQoJHtuYW1lfSlgKVxuXHRcdFx0XHRcdDogdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgW3BhcnQ9XCIke25hbWV9XCJdYCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldCBoYXNTaGFkb3coKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gc2hhZG93ICE9PSAnbm9uZSc7XG5cdFx0fVxuXG5cdFx0LyoqKiBDU1MgKioqL1xuXG5cdFx0Z2V0IENTU1NlbGVjdG9yKCkge1xuXG5cdFx0XHRpZih0aGlzLmhhc1NoYWRvdyB8fCAhIHRoaXMuaGFzQXR0cmlidXRlKFwiaXNcIikgKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy50YWdOYW1lO1xuXG5cdFx0XHRyZXR1cm4gYCR7dGhpcy50YWdOYW1lfVtpcz1cIiR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJpc1wiKX1cIl1gO1xuXHRcdH1cblxuXHRcdC8vID09PT09PT09PT09PT09IEltcGwgPT09PT09PT09PT09PT09PT09PVxuXG5cdFx0Y29uc3RydWN0b3IocGFyYW1zOiB7fSwgYmFzZT86IEluc3RhbmNlVHlwZTxUPikge1xuXHRcdFx0c3VwZXIoKTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLiNwYXJhbXMsIHBhcmFtcyk7XG5cblx0XHRcdGxldCB7cHJvbWlzZSwgcmVzb2x2ZX0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8SW5zdGFuY2VUeXBlPFQ+PigpO1xuXG5cdFx0XHR0aGlzLndoZW5Jbml0aWFsaXplZCA9IHByb21pc2U7XG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIgPSByZXNvbHZlO1xuXG5cdFx0XHRpZiggYmFzZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuI2Jhc2UgPSBiYXNlO1xuXHRcdFx0XHR0aGlzLmluaXQoKTsgLy8gY2FsbCB0aGUgcmVzb2x2ZXJcblx0XHRcdH1cblxuXHRcdFx0aWYoIFwiX3doZW5VcGdyYWRlZFJlc29sdmVcIiBpbiB0aGlzKVxuXHRcdFx0XHQodGhpcy5fd2hlblVwZ3JhZGVkUmVzb2x2ZSBhcyBhbnkpKCk7XG5cdFx0fVxuXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PSBET00gPT09PT09PT09PT09PT09PT09PT09PT09PT09XHRcdFxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHQodGhpcy5iYXNlISBhcyBhbnkpLm9uRE9NRGlzY29ubmVjdGVkKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuaXNJbml0aWFsaXplZCApIHtcblx0XHRcdFx0dGhpcy5iYXNlIS5vbkRPTUNvbm5lY3RlZCgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IGxpZmUgY3ljbGUgb3B0aW9uc1xuXHRcdFx0aWYoIHRoaXMuc3RhdGUuaXNSZWFkeSApIHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplKCk7IC8vIGF1dG9tYXRpY2FsbHkgY2FsbHMgb25ET01Db25uZWN0ZWRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQoIGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRhd2FpdCB0aGlzLnN0YXRlLmlzUmVhZHk7XG5cblx0XHRcdFx0aWYoICEgdGhpcy5pc0luaXRpYWxpemVkIClcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemUoKTtcblxuXHRcdFx0fSkoKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIGluaXQoKSB7XG5cdFx0XHRcblx0XHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGhpcyk7XG5cbiAgICAgICAgICAgIC8vVE9ETzogd2FpdCBwYXJlbnRzL2NoaWxkcmVuIGRlcGVuZGluZyBvbiBvcHRpb24uLi5cblx0XHRcdFxuXHRcdFx0Ly8gc2hhZG93XG5cdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcyBhcyB1bmtub3duIGFzIEhvc3Q7XG5cdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpIHtcblx0XHRcdFx0dGhpcy4jY29udGVudCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiBzaGFkb3d9KTtcblxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdFx0Ly90aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdC8vdGhpcy4jY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGF0dHJzXG5cdFx0XHRmb3IobGV0IG9icyBvZiBhdHRycyEpXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbb2JzIGFzIEF0dHJzXSA9IHRoaXMuZ2V0QXR0cmlidXRlKG9icyk7XG5cblx0XHRcdC8vIGNzc1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MpO1xuXHRcdFx0aWYoIHN0eWxlc2hlZXRzLmxlbmd0aCApIHtcblxuXHRcdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goLi4uc3R5bGVzaGVldHMpO1xuXHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdGNvbnN0IGNzc3NlbGVjdG9yID0gdGhpcy5DU1NTZWxlY3RvcjtcblxuXHRcdFx0XHRcdC8vIGlmIG5vdCB5ZXQgaW5zZXJ0ZWQgOlxuXHRcdFx0XHRcdGlmKCAhIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpICkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuXHRcdFx0XHRcdFx0bGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuXG5cdFx0XHRcdFx0XHRmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG5cdFx0XHRcdFx0XHRcdFx0aHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuXHRcdFx0XHRcdFx0c3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cblx0XHRcdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcblxuXHRcdFx0XHRcdFx0YWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbnRlbnRcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSBjb250ZW50X2ZhY3RvcnkodGhpcy5hdHRycywgdGhpcy5wYXJhbXMsIHRoaXMpO1xuXHRcdFx0aWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGNvbnRlbnQgKTtcblxuXHQgICAgXHQvLyBidWlsZFxuXG5cdCAgICBcdC8vIGg0Y2ssIG9rYXkgYmVjYXVzZSBKUyBpcyBtb25vdGhyZWFkZWQuXG5cdFx0XHRzZXRDc3RySG9zdCh0aGlzKTtcblx0ICAgIFx0bGV0IG9iaiA9IHRoaXMuYmFzZSA9PT0gbnVsbCA/IG5ldyBMaXNzKCkgOiB0aGlzLmJhc2U7XG5cblx0XHRcdHRoaXMuI2Jhc2UgPSBvYmogYXMgSW5zdGFuY2VUeXBlPFQ+O1xuXG5cdFx0XHQvLyBkZWZhdWx0IHNsb3Rcblx0XHRcdGlmKCB0aGlzLmhhc1NoYWRvdyAmJiB0aGlzLiNjb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwIClcblx0XHRcdFx0dGhpcy4jY29udGVudC5hcHBlbmQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Nsb3QnKSApO1xuXG5cdFx0XHR0aGlzLiN3aGVuSW5pdGlhbGl6ZWRfcmVzb2x2ZXIodGhpcy5iYXNlKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuYmFzZTtcblx0XHR9XG5cblxuXG5cdFx0Ly8gYXR0cnNcblxuXHRcdHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBhdHRycztcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSAgICA6IEF0dHJzLFxuXHRcdFx0XHRcdFx0XHRcdCBvbGRWYWx1ZTogc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRcdCBuZXdWYWx1ZTogc3RyaW5nKSB7XG5cblx0XHRcdGlmKHRoaXMuI2F0dHJzX2ZsYWcpIHtcblx0XHRcdFx0dGhpcy4jYXR0cnNfZmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSBuZXdWYWx1ZTtcblx0XHRcdGlmKCAhIHRoaXMuaXNJbml0aWFsaXplZCApXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0aWYoICh0aGlzLmJhc2UhIGFzIGFueSkub25BdHRyQ2hhbmdlZChuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLiNhdHRyc1tuYW1lXSA9IG9sZFZhbHVlOyAvLyByZXZlcnQgdGhlIGNoYW5nZS5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0QmFzZSBhcyBDb21wb3NlQ29uc3RydWN0b3I8dHlwZW9mIExJU1NIb3N0QmFzZSwgdHlwZW9mIGhvc3Q+O1xufVxuXG5cbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgZGVmaW5lID09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy9UT0RPOiBDdXN0b21SZWdpc3RlcnkgKyBzZWUgd2l0aCBzdGF0ZS4uLlxuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi9leHRlbmRzXCI7XG5pbXBvcnQgeyBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgX2VsZW1lbnQydGFnbmFtZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi9leHRlbmRzXCIge1xuICAgIGludGVyZmFjZSBJTElTUyB7XG4gICAgICAgIGRlZmluZSAgICAgOiB0eXBlb2YgZGVmaW5lO1xuXHRcdHdoZW5EZWZpbmVkICAgIDogdHlwZW9mIHdoZW5EZWZpbmVkO1xuXHRcdHdoZW5BbGxEZWZpbmVkIDogdHlwZW9mIHdoZW5BbGxEZWZpbmVkO1xuXHRcdGlzRGVmaW5lZCAgICAgIDogdHlwZW9mIGlzRGVmaW5lZDtcblx0XHRnZXROYW1lICAgICAgICA6IHR5cGVvZiBnZXROYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZTxUIGV4dGVuZHMgTElTU0Jhc2VDc3RyPihcblx0XHRcdFx0XHRcdFx0dGFnbmFtZSAgICAgICA6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0Q29tcG9uZW50Q2xhc3M6IFQpIHtcblx0Y29uc3QgQ2xhc3MgID0gQ29tcG9uZW50Q2xhc3MuTElTU0NmZy5ob3N0O1xuXHRsZXQgaHRtbHRhZyAgPSBfZWxlbWVudDJ0YWduYW1lKENsYXNzKT8/dW5kZWZpbmVkO1xuXG5cdGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7IC8vYnVpbGRMSVNTSG9zdDxUPihDb21wb25lbnRDbGFzcywgcGFyYW1zKTtcblx0XG5cdGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuXHRcdFx0XHRcdFx0XHRcdFx0ICAgOiB7ZXh0ZW5kczogaHRtbHRhZ307XG5cdFxuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnbmFtZSwgTElTU2NsYXNzLCBvcHRzKTtcbn07XG5cblxuYXN5bmMgZnVuY3Rpb24gd2hlbkRlZmluZWQodGFnbmFtZTogc3RyaW5nLCBjYWxsYmFjaz86ICgpID0+IHZvaWQgKSA6IFByb21pc2U8dm9pZD4ge1xuXG5cdGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xuXG5cdGlmKCBjYWxsYmFjayAhPT0gdW5kZWZpbmVkKVxuXHRcdGNhbGxiYWNrKCk7XG5cblx0cmV0dXJuO1xufVxuYXN5bmMgZnVuY3Rpb24gd2hlbkFsbERlZmluZWQodGFnbmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdLCBjYWxsYmFjaz86ICgpID0+IHZvaWQgKSA6IFByb21pc2U8dm9pZD4ge1xuXG5cdGF3YWl0IFByb21pc2UuYWxsKCB0YWduYW1lcy5tYXAoIHQgPT4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodCkgKSApXG5cblx0aWYoIGNhbGxiYWNrICE9PSB1bmRlZmluZWQpXG5cdFx0Y2FsbGJhY2soKTtcblxufVxuXG5mdW5jdGlvbiBpc0RlZmluZWQobmFtZTogc3RyaW5nKSB7XG5cdHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQobmFtZSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoIGVsZW1lbnQ6IEVsZW1lbnQgKTogc3RyaW5nIHtcblxuXHRjb25zdCBuYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lzJykgPz8gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRpZiggISBuYW1lLmluY2x1ZGVzKCctJykgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke25hbWV9IGlzIG5vdCBhIFdlYkNvbXBvbmVudGApO1xuXG5cdHJldHVybiBuYW1lO1xufVxuXG5MSVNTLmRlZmluZSAgICAgICAgID0gZGVmaW5lO1xuTElTUy53aGVuRGVmaW5lZCAgICA9IHdoZW5EZWZpbmVkO1xuTElTUy53aGVuQWxsRGVmaW5lZCA9IHdoZW5BbGxEZWZpbmVkO1xuTElTUy5pc0RlZmluZWQgICAgICA9IGlzRGVmaW5lZDtcbkxJU1MuZ2V0TmFtZSAgICAgICAgPSBnZXROYW1lOyIsImltcG9ydCB7IENsYXNzLCBDb25zdHJ1Y3RvciwgTElTU19PcHRzLCBMSVNTQmFzZUNzdHIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHtMSVNTIGFzIF9MSVNTfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgSUxJU1Mge31cblxuZXhwb3J0IGRlZmF1bHQgTElTUyBhcyB0eXBlb2YgTElTUyAmIElMSVNTO1xuXG4vLyBleHRlbmRzIHNpZ25hdHVyZVxuZXhwb3J0IGZ1bmN0aW9uIExJU1M8XG4gICAgRXh0ZW5kc0NzdHJfQmFzZSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICBQYXJhbXNfQmFzZSAgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PixcbiAgICBIb3N0Q3N0cl9CYXNlICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzX0Jhc2UgICAgICAgZXh0ZW5kcyBzdHJpbmcsXG5cbiAgICBCYXNlQ3N0ciBleHRlbmRzIExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3N0cl9CYXNlLCBQYXJhbXNfQmFzZSwgSG9zdENzdHJfQmFzZSwgQXR0cnNfQmFzZT4sXG5cbiAgICAvLyBUT0RPOiBhZGQgY29uc3RyYWludHMuLi5cbiAgICBQYXJhbXMgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSxcbiAgICBIb3N0Q3N0ciBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICBBdHRycyAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IG5ldmVyPihvcHRzOiBQYXJ0aWFsPExJU1NfT3B0czxCYXNlQ3N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+Pik6IExJU1NCYXNlQ3N0clxuLy8gTElTU0Jhc2Ugc2lnbmF0dXJlXG5leHBvcnQgZnVuY3Rpb24gTElTUzxcblx0RXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG5cdFBhcmFtcyAgICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIC8vUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cblx0Ly8gSFRNTCBCYXNlXG5cdEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG5cdEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlciwgLy9zdHJpbmcsXG4+KG9wdHM/OiBQYXJ0aWFsPExJU1NfT3B0czxFeHRlbmRzQ3RyLCBQYXJhbXMsIEhvc3RDc3RyLCBBdHRycz4+KTogTElTU0Jhc2VDc3RyPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPlxuZXhwb3J0IGZ1bmN0aW9uIExJU1Mob3B0czogYW55KTogTElTU0Jhc2VDc3RyXG57XG4gICAgaWYoIG9wdHMuZXh0ZW5kcyAhPT0gdW5kZWZpbmVkICYmIFwiSG9zdFwiIGluIG9wdHMuZXh0ZW5kcyApIC8vIHdlIGFzc3VtZSB0aGlzIGlzIGEgTElTU0Jhc2VDc3RyXG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyhvcHRzKTtcblxuICAgIHJldHVybiBfTElTUyhvcHRzKTtcbn1cblxuZnVuY3Rpb24gX2V4dGVuZHM8XG4gICAgRXh0ZW5kc0NzdHJfQmFzZSBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPixcbiAgICBQYXJhbXNfQmFzZSAgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PixcbiAgICBIb3N0Q3N0cl9CYXNlICAgIGV4dGVuZHMgQ29uc3RydWN0b3I8SFRNTEVsZW1lbnQ+LFxuICAgIEF0dHJzX0Jhc2UgICAgICAgZXh0ZW5kcyBzdHJpbmcsXG5cbiAgICBCYXNlQ3N0ciBleHRlbmRzIExJU1NCYXNlQ3N0cjxFeHRlbmRzQ3N0cl9CYXNlLCBQYXJhbXNfQmFzZSwgSG9zdENzdHJfQmFzZSwgQXR0cnNfQmFzZT4sXG4gICAgXG4gICAgLy8gVE9ETzogYWRkIGNvbnN0cmFpbnRzLi4uXG4gICAgUGFyYW1zICAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sXG4gICAgSG9zdENzdHIgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnMgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBuZXZlcj4ob3B0czogUGFydGlhbDxMSVNTX09wdHM8QmFzZUNzdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj4pIHtcblxuICAgIGlmKCBvcHRzLmV4dGVuZHMgPT09IHVuZGVmaW5lZCkgLy8gaDRja1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBwcm92aWRlIGEgTElTU0Jhc2UhJyk7XG5cbiAgICBjb25zdCBiYXNlID0gb3B0cy5leHRlbmRzLkxJU1NDZmc7XG5cbiAgICBjb25zdCBob3N0ID0gb3B0cy5ob3N0ID8/IGJhc2UuaG9zdDtcblxuICAgIGxldCBkZXBzID0gYmFzZS5kZXBzO1xuICAgIGlmKCBvcHRzLmRlcHMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVwcyA9IFsuLi5kZXBzLCAuLi5vcHRzLmRlcHNdO1xuXG4gICAgbGV0IGF0dHJzID0gYmFzZS5hdHRycyBhcyByZWFkb25seSAoQXR0cnN8QXR0cnNfQmFzZSlbXTtcbiAgICBpZiggb3B0cy5hdHRycyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBhdHRycyA9IFsuLi5hdHRycywgLi4ub3B0cy5hdHRyc107XG5cbiAgICBsZXQgcGFyYW1zID0gYmFzZS5wYXJhbXM7XG4gICAgaWYoIG9wdHMucGFyYW1zICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHBhcmFtcyA9IE9iamVjdC5hc3NpZ24ocGFyYW1zLCBvcHRzLnBhcmFtcyk7XG5cbiAgICAvL1RPRE86IGlzc3VlcyB3aXRoIGFzeW5jIGNvbnRlbnQvQ1NTICsgc29tZSBlZGdlIGNhc2VzLi4uXG4gICAgbGV0IGNvbnRlbnRfZmFjdG9yeSA9IGJhc2UuY29udGVudF9mYWN0b3J5IGFzIGFueTtcbiAgICBpZiggb3B0cy5jb250ZW50ICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnRlbnRfZmFjdG9yeSA9IG9wdHMuY29udGVudF9mYWN0b3J5ISggb3B0cy5jb250ZW50ICk7XG5cbiAgICBsZXQgc3R5bGVzaGVldHMgPSBiYXNlLnN0eWxlc2hlZXRzO1xuICAgIGlmKCBvcHRzLmNzcyAhPT0gdW5kZWZpbmVkIClcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBzdHlsZXNoZWV0cyA9IFsuLi5zdHlsZXNoZWV0cywgLi4ub3B0cy5jc3NdO1xuXG4gICAgY29uc3Qgc2hhZG93ID0gb3B0cy5zaGFkb3cgPz8gYmFzZS5zaGFkb3c7XG5cbiAgICBjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBvcHRzLmV4dGVuZHMge1xuXG4gICAgICAgIHN0YXRpYyBvdmVycmlkZSByZWFkb25seSBMSVNTQ2ZnID0ge1xuXHRcdFx0aG9zdCxcblx0XHRcdGRlcHMsXG5cdFx0XHRhdHRycyxcblx0XHRcdHBhcmFtcyxcblx0XHRcdGNvbnRlbnRfZmFjdG9yeSxcblx0XHRcdHN0eWxlc2hlZXRzLFxuXHRcdFx0c2hhZG93LFxuXHRcdH07XG5cbiAgICAgICAgLy9UT0RPOiBmaXggdHlwZXMuLi5cbiAgICB9XG5cbiAgICByZXR1cm4gRXh0ZW5kZWRMSVNTO1xufVxuXG4vKlxuZnVuY3Rpb24gZXh0ZW5kc0xJU1M8RXh0ZW5kcyBleHRlbmRzIENsYXNzLFxuXHRIb3N0ICAgIGV4dGVuZHMgSFRNTEVsZW1lbnQsXG5cdEF0dHJzMSAgIGV4dGVuZHMgc3RyaW5nLFxuXHRBdHRyczIgICBleHRlbmRzIHN0cmluZyxcblx0UGFyYW1zICBleHRlbmRzIFJlY29yZDxzdHJpbmcsYW55Pixcblx0VCBleHRlbmRzIExJU1NSZXR1cm5UeXBlPEV4dGVuZHMsIEhvc3QsIEF0dHJzMSwgUGFyYW1zPj4oTGlzczogVCxcblx0XHRwYXJhbWV0ZXJzOiB7XG5cdFx0XHRzaGFkb3cgICAgICA/OiBTaGFkb3dDZmcsXG5cdFx0XHRhdHRyaWJ1dGVzICA/OiByZWFkb25seSBBdHRyczJbXSxcblx0XHRcdGRlcGVuZGVuY2llcz86IHJlYWRvbmx5IFByb21pc2U8YW55PltdXG5cdFx0fSkge1xuXG5cdGNvbnN0IGF0dHJpYnV0ZXMgICA9IFsuLi5MaXNzLlBhcmFtZXRlcnMuYXR0cmlidXRlcyAgLCAuLi5wYXJhbWV0ZXJzLmF0dHJpYnV0ZXMgID8/W11dO1xuXHRjb25zdCBkZXBlbmRlbmNpZXMgPSBbLi4uTGlzcy5QYXJhbWV0ZXJzLmRlcGVuZGVuY2llcywgLi4ucGFyYW1ldGVycy5kZXBlbmRlbmNpZXM/P1tdXTtcblxuXHRjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBMaXNzLlBhcmFtZXRlcnMsIHtcblx0XHRhdHRyaWJ1dGVzLFxuXHRcdGRlcGVuZGVuY2llc1xuXHR9KTtcblx0aWYoIHBhcmFtZXRlcnMuc2hhZG93ICE9PSB1bmRlZmluZWQpXG5cdFx0cGFyYW1zLnNoYWRvdyA9IHBhcmFtZXRlcnMuc2hhZG93O1xuXG5cdC8vIEB0cy1pZ25vcmUgOiBiZWNhdXNlIFRTIHN0dXBpZFxuXHRjbGFzcyBFeHRlbmRlZExJU1MgZXh0ZW5kcyBMaXNzIHtcblx0XHRjb25zdHJ1Y3RvciguLi50OiBhbnlbXSkge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZSA6IGJlY2F1c2UgVFMgc3R1cGlkXG5cdFx0XHRzdXBlciguLi50KTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0IGF0dHJzKCkge1xuXHRcdFx0cmV0dXJuIHN1cGVyLmF0dHJzIGFzIFJlY29yZDxBdHRyczJ8QXR0cnMxLCBzdHJpbmd8bnVsbD47XG5cdFx0fVxuXG5cdFx0c3RhdGljIG92ZXJyaWRlIFBhcmFtZXRlcnMgPSBwYXJhbXM7XG5cdH1cblxuXHRyZXR1cm4gRXh0ZW5kZWRMSVNTO1xufVxuTElTUy5leHRlbmRzTElTUyA9IGV4dGVuZHNMSVNTO1xuKi8iLCJpbXBvcnQgeyBTaGFkb3dDZmcgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7TElTU30gZnJvbSBcIi4uL0xJU1NCYXNlXCI7XG5cbmltcG9ydCB7ZGVmaW5lfSBmcm9tIFwiLi4vc3RhdGVcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi9idWlsZFwiO1xuXG5leHBvcnQgY2xhc3MgTElTU19BdXRvIGV4dGVuZHMgTElTUyh7XG5cdGF0dHJzOiBbXCJzcmNcIiwgXCJzd1wiXSxcblx0c2hhZG93OiBTaGFkb3dDZmcuTk9ORSxcblx0Y3NzOiBgOmhvc3QgeyBkaXNwbGF5OiBub25lOyB9YFxufSkge1xuXG5cdHJlYWRvbmx5ICNrbm93bl90YWcgPSBuZXcgU2V0PHN0cmluZz4oKTtcblx0cmVhZG9ubHkgI2RpcmVjdG9yeTogc3RyaW5nO1xuXHRyZWFkb25seSAjc3c6IFByb21pc2U8dm9pZD47XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy4jc3cgPSBuZXcgUHJvbWlzZSggYXN5bmMgKHJlc29sdmUpID0+IHtcblx0XHRcdFxuXHRcdFx0YXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIodGhpcy5hdHRycy5zdyA/PyBcIi9zdy5qc1wiLCB7c2NvcGU6IFwiL1wifSk7XG5cblx0XHRcdGlmKCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICkge1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblxuXHRcdGNvbnN0IHNyYyA9IHRoaXMuYXR0cnMuc3JjO1xuXHRcdGlmKHNyYyA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInNyYyBhdHRyaWJ1dGUgaXMgbWlzc2luZy5cIik7XG5cdFx0dGhpcy4jZGlyZWN0b3J5ID0gc3JjWzBdID09PSAnLidcblx0XHRcdFx0XHRcdFx0XHQ/IGAke3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX0ke3NyY31gXG5cdFx0XHRcdFx0XHRcdFx0OiBzcmM7XG5cblx0XHRuZXcgTXV0YXRpb25PYnNlcnZlciggKG11dGF0aW9ucykgPT4ge1xuXG5cdFx0XHRmb3IobGV0IG11dGF0aW9uIG9mIG11dGF0aW9ucylcblx0XHRcdFx0Zm9yKGxldCBhZGRpdGlvbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuXHRcdFx0XHRcdGlmKGFkZGl0aW9uIGluc3RhbmNlb2YgRWxlbWVudClcblx0XHRcdFx0XHRcdHRoaXMuI2FkZFRhZyhhZGRpdGlvbi50YWdOYW1lKVxuXG5cdFx0fSkub2JzZXJ2ZSggZG9jdW1lbnQsIHsgY2hpbGRMaXN0OnRydWUsIHN1YnRyZWU6dHJ1ZSB9KTtcblxuXG5cdFx0Zm9yKCBsZXQgZWxlbSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiKlwiKSApXG5cdFx0XHR0aGlzLiNhZGRUYWcoZWxlbS50YWdOYW1lKTtcblx0fVxuXG5cbiAgICBwcm90ZWN0ZWQgcmVzb3VyY2VzKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHRcImluZGV4LmpzXCIsXG5cdFx0XHRcImluZGV4Lmh0bWxcIixcblx0XHRcdFwiaW5kZXguY3NzXCJcblx0XHRdO1xuICAgIH1cblxuXHRwcm90ZWN0ZWQgZGVmaW5lV2ViQ29tcG9uZW50KHRhZ25hbWU6IHN0cmluZywgZmlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG9wdHM6IFBhcnRpYWw8e2NvbnRlbnQ6IHN0cmluZywgY3NzOiBzdHJpbmd9Pikge1xuXG5cdFx0Y29uc3QganMgPSBmaWxlc1tcImluZGV4LmpzXCJdO1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBmaWxlc1tcImluZGV4Lmh0bWxcIl07XG5cblx0XHRsZXQga2xhc3M6IG51bGx8IFJldHVyblR5cGU8dHlwZW9mIExJU1M+ID0gbnVsbDtcblx0XHRpZigganMgIT09IHVuZGVmaW5lZCApXG5cdFx0XHRrbGFzcyA9IGpzKG9wdHMpO1xuXHRcdGVsc2UgaWYoIGNvbnRlbnQgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0KG9wdHMgYXMgYW55KS5jb250ZW50X2ZhY3RvcnkgPSAoc3RyOiBzdHJpbmcpID0+IHtcblxuXHRcdFx0XHRjb25zdCBjb250ZW50ID0gaHRtbGAke3N0cn1gO1xuXG5cdFx0XHRcdGxldCBzcGFucyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGlzc1t2YWx1ZV0nKTtcblxuXHRcdFx0XHRyZXR1cm4gKF9hOiB1bmtub3duLCBfYjp1bmtub3duLCBlbGVtOiBIVE1MRWxlbWVudCkgPT4ge1xuXG5cdFx0XHRcdFx0Ly8gY2FuIGJlIG9wdGltaXplZC4uLlxuXHRcdFx0XHRcdGZvcihsZXQgc3BhbiBvZiBzcGFucylcblx0XHRcdFx0XHRcdHNwYW4udGV4dENvbnRlbnQgPSBlbGVtLmdldEF0dHJpYnV0ZShzcGFuLmdldEF0dHJpYnV0ZSgndmFsdWUnKSEpXG5cblx0XHRcdFx0XHRyZXR1cm4gY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdH07XG5cblx0XHRcdGtsYXNzID0gY2xhc3MgV2ViQ29tcG9uZW50IGV4dGVuZHMgTElTUyhvcHRzKSB7fTtcblx0XHR9XG5cblx0XHRpZihrbGFzcyA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBmaWxlcyBmb3IgV2ViQ29tcG9uZW50ICR7dGFnbmFtZX0uYCk7XG5cblx0XHRyZXR1cm4gZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblx0fVxuXG5cdGFzeW5jICNhZGRUYWcodGFnbmFtZTogc3RyaW5nKSB7XG5cblx0XHR0YWduYW1lID0gdGFnbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYoIHRhZ25hbWUgPT09ICdsaXNzLWF1dG8nIHx8IHRhZ25hbWUgPT09ICdibGlzcy1hdXRvJyB8fCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCB0aGlzLiNrbm93bl90YWcuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy4ja25vd25fdGFnLmFkZCh0YWduYW1lKTtcblxuXHRcdGF3YWl0IHRoaXMuI3N3OyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG5cdFx0Y29uc3QgZmlsZW5hbWVzID0gdGhpcy5yZXNvdXJjZXMoKTtcblx0XHRjb25zdCByZXNvdXJjZXMgPSBhd2FpdCBQcm9taXNlLmFsbCggZmlsZW5hbWVzLm1hcCggZmlsZSA9PiBmaWxlLmVuZHNXaXRoKCcuanMnKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ/IF9pbXBvcnQgICAoYCR7dGhpcy4jZGlyZWN0b3J5fS8ke3RhZ25hbWV9LyR7ZmlsZX1gLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ6IF9mZXRjaFRleHQoYCR7dGhpcy4jZGlyZWN0b3J5fS8ke3RhZ25hbWV9LyR7ZmlsZX1gLCB0cnVlKSApICk7XG5cblx0XHRjb25zdCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlbmFtZXMubGVuZ3RoOyArK2kpXG5cdFx0XHRpZiggcmVzb3VyY2VzW2ldICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdGZpbGVzW2ZpbGVuYW1lc1tpXV0gPSByZXNvdXJjZXNbaV07XG5cblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXHRcdGNvbnN0IGNzcyAgICAgPSBmaWxlc1tcImluZGV4LmNzc1wiXTtcblxuXHRcdGNvbnN0IG9wdHM6IFBhcnRpYWw8e2NvbnRlbnQ6IHN0cmluZywgY3NzOiBzdHJpbmd9PiA9IHtcblx0XHRcdC4uLmNvbnRlbnQgIT09IHVuZGVmaW5lZCAmJiB7Y29udGVudH0sXG5cdFx0XHQuLi5jc3MgICAgICE9PSB1bmRlZmluZWQgJiYge2Nzc30sXG5cdFx0fTtcblxuXHRcdHJldHVybiB0aGlzLmRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcywgb3B0cyk7XG5cdFx0XG5cdH1cbn1cblxuLy8gcHJldmVudHMgbXVsdGktZGVjbGFyYXRpb25zLi4uXG5pZiggY3VzdG9tRWxlbWVudHMuZ2V0KFwibGlzcy1hdXRvXCIpID09PSB1bmRlZmluZWQpXG5cdGRlZmluZShcImxpc3MtYXV0b1wiLCBMSVNTX0F1dG8pO1xuXG4vL1RPRE86IGZpeC4uLlxuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRzIHtcblx0XCJsaXNzLWF1dG9cIjogTElTU19BdXRvXG59O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIGludGVybmFsIHRvb2xzID09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaFRleHQodXJpOiBzdHJpbmd8VVJMLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHRjb25zdCBvcHRpb25zID0gaXNMaXNzQXV0b1xuXHRcdFx0XHRcdFx0PyB7aGVhZGVyczp7XCJsaXNzLWF1dG9cIjogXCJ0cnVlXCJ9fVxuXHRcdFx0XHRcdFx0OiB7fTtcblxuXG5cdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJpLCBvcHRpb25zKTtcblx0aWYocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0aWYoIGlzTGlzc0F1dG8gJiYgcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJzdGF0dXNcIikhID09PSBcIjQwNFwiIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG59XG5hc3luYyBmdW5jdGlvbiBfaW1wb3J0KHVyaTogc3RyaW5nLCBpc0xpc3NBdXRvOiBib29sZWFuID0gZmFsc2UpIHtcblxuXHQvLyB0ZXN0IGZvciB0aGUgbW9kdWxlIGV4aXN0YW5jZS5cblx0aWYoaXNMaXNzQXV0byAmJiBhd2FpdCBfZmV0Y2hUZXh0KHVyaSwgaXNMaXNzQXV0bykgPT09IHVuZGVmaW5lZCApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHR0cnkge1xuXHRcdHJldHVybiAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gdXJpKSkuZGVmYXVsdDtcblx0fSBjYXRjaChlKSB7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxufSIsImltcG9ydCB7IGluaXRpYWxpemUsIGluaXRpYWxpemVTeW5jIH0gZnJvbSBcIi4uL3N0YXRlXCI7XG5pbXBvcnQgeyBMSVNTQmFzZSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgRG9jdW1lbnRGcmFnbWVudHxIVE1MRWxlbWVudD4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiBUIHtcbiAgICBcbiAgICBsZXQgc3RyaW5nID0gc3RyWzBdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN0cmluZyArPSBgJHthcmdzW2ldfWA7XG4gICAgICAgIHN0cmluZyArPSBgJHtzdHJbaSsxXX1gO1xuICAgICAgICAvL1RPRE86IG1vcmUgcHJlLXByb2Nlc3Nlc1xuICAgIH1cblxuICAgIC8vIHVzaW5nIHRlbXBsYXRlIHByZXZlbnRzIEN1c3RvbUVsZW1lbnRzIHVwZ3JhZGUuLi5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHJpbmcudHJpbSgpO1xuXG4gICAgaWYoIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEgJiYgdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIS5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUpXG4gICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkISBhcyB1bmtub3duIGFzIFQ7XG5cbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudCEgYXMgdW5rbm93biBhcyBUO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzczxUIGV4dGVuZHMgTElTU0Jhc2U+KHN0cjogcmVhZG9ubHkgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBlbGVtID0gaHRtbChzdHIsIC4uLmFyZ3MpO1xuXG4gICAgaWYoIGVsZW0gaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50IClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgSFRNTEVsZW1lbnQgZ2l2ZW4hYCk7XG5cbiAgICByZXR1cm4gYXdhaXQgaW5pdGlhbGl6ZTxUPihlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc3RyOiByZWFkb25seSBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGNvbnN0IGVsZW0gPSBodG1sKHN0ciwgLi4uYXJncyk7XG5cbiAgICBpZiggZWxlbSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBIVE1MRWxlbWVudCBnaXZlbiFgKTtcblxuICAgIHJldHVybiBpbml0aWFsaXplU3luYzxUPihlbGVtKTtcbn1cblxuXG50eXBlIEJVSUxEX09QVElPTlM8VCBleHRlbmRzIExJU1NCYXNlPiA9IFBhcnRpYWw8e1xuICAgIHBhcmFtcyAgICA6IFBhcnRpYWw8VFtcInBhcmFtc1wiXT4sXG4gICAgY29udGVudFx0ICA6IHN0cmluZ3xOb2RlfHJlYWRvbmx5IE5vZGVbXSxcbiAgICBpZCBcdFx0ICAgIDogc3RyaW5nLFxuICAgIGNsYXNzZXNcdCAgOiByZWFkb25seSBzdHJpbmdbXSxcbiAgICBjc3N2YXJzICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PixcbiAgICBhdHRycyBcdCAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGRhdGEgXHQgICAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuICAgIGxpc3RlbmVycyA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIChldjogRXZlbnQpID0+IHZvaWQ+PlxufT4gJiAoe1xuICBpbml0aWFsaXplOiBmYWxzZSxcbiAgcGFyZW50OiBFbGVtZW50XG59fHtcbiAgaW5pdGlhbGl6ZT86IHRydWUsXG4gIHBhcmVudD86IEVsZW1lbnRcbn0pO1xuXG4vL2FzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IFByb21pc2U8Q29tcG9uZW50c1tUXT47XG4vKlxuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIExJU1NCYXNlPih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZT4odGFnbmFtZTogc3RyaW5nLCB7XG4gICAgICAgICAgICAgIHBhcmFtcyAgICA9IHt9LFxuICAgICAgICAgICAgICBpbml0aWFsaXplPSB0cnVlLFxuICAgICAgICAgICAgICBjb250ZW50ICAgPSBbXSxcbiAgICAgICAgICAgICAgcGFyZW50ICAgID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBpZCBcdFx0ICA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgY2xhc3NlcyAgID0gW10sXG4gICAgICAgICAgICAgIGNzc3ZhcnMgICA9IHt9LFxuICAgICAgICAgICAgICBhdHRycyAgICAgPSB7fSxcbiAgICAgICAgICAgICAgZGF0YSBcdCAgPSB7fSxcbiAgICAgICAgICAgICAgbGlzdGVuZXJzID0ge31cbiAgICAgICAgICAgICAgfTogQlVJTERfT1BUSU9OUzxUPiA9IHt9KTogUHJvbWlzZTxUPiB7XG5cbiAgaWYoICEgaW5pdGlhbGl6ZSAmJiBwYXJlbnQgPT09IG51bGwpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBwYXJlbnQgbXVzdCBiZSBnaXZlbiBpZiBpbml0aWFsaXplIGlzIGZhbHNlXCIpO1xuXG4gIGxldCBDdXN0b21DbGFzcyA9IGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZ25hbWUpO1xuICBsZXQgZWxlbSA9IG5ldyBDdXN0b21DbGFzcyhwYXJhbXMpIGFzIExJU1NIb3N0PFQ+O1xuXG4gIC8vIEZpeCBpc3N1ZSAjMlxuICBpZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuICBlbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG4gIGlmKCBpZCAhPT0gdW5kZWZpbmVkIClcbiAgZWxlbS5pZCA9IGlkO1xuXG4gIGlmKCBjbGFzc2VzLmxlbmd0aCA+IDApXG4gIGVsZW0uY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcblxuICBmb3IobGV0IG5hbWUgaW4gY3NzdmFycylcbiAgZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cbiAgZm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cbiAgbGV0IHZhbHVlID0gYXR0cnNbbmFtZV07XG4gIGlmKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuICBlbGVtLnRvZ2dsZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIGVsc2VcbiAgZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgZm9yKGxldCBuYW1lIGluIGRhdGEpIHtcblxuICBsZXQgdmFsdWUgPSBkYXRhW25hbWVdO1xuICBpZiggdmFsdWUgPT09IGZhbHNlKVxuICBkZWxldGUgZWxlbS5kYXRhc2V0W25hbWVdO1xuICBlbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuICBlbGVtLmRhdGFzZXRbbmFtZV0gPSBcIlwiO1xuICBlbHNlXG4gIGVsZW0uZGF0YXNldFtuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgaWYoICEgQXJyYXkuaXNBcnJheShjb250ZW50KSApXG4gIGNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuICBlbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuICBmb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXJzW25hbWVdKTtcblxuICBpZiggcGFyZW50ICE9PSB1bmRlZmluZWQgKVxuICBwYXJlbnQuYXBwZW5kKGVsZW0pO1xuXG4gIGlmKCAhIGVsZW0uaXNJbml0ICYmIGluaXRpYWxpemUgKVxuICByZXR1cm4gYXdhaXQgTElTUy5pbml0aWFsaXplKGVsZW0pO1xuXG4gIHJldHVybiBhd2FpdCBMSVNTLmdldExJU1MoZWxlbSk7XG59XG5MSVNTLmJ1aWxkID0gYnVpbGQ7XG5cblxuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPih0YWduYW1lOiBULCBvcHRpb25zPzogQlVJTERfT1BUSU9OUzxDb21wb25lbnRzW1RdPik6IENvbXBvbmVudHNbVF07XG5mdW5jdGlvbiBidWlsZFN5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHRhZ25hbWU6IHN0cmluZywgb3B0aW9ucz86IEJVSUxEX09QVElPTlM8VD4pOiBUO1xuZnVuY3Rpb24gYnVpbGRTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIHtcbnBhcmFtcyAgICA9IHt9LFxuaW5pdGlhbGl6ZT0gdHJ1ZSxcbmNvbnRlbnQgICA9IFtdLFxucGFyZW50ICAgID0gdW5kZWZpbmVkLFxuaWQgXHRcdCAgPSB1bmRlZmluZWQsXG5jbGFzc2VzICAgPSBbXSxcbmNzc3ZhcnMgICA9IHt9LFxuYXR0cnMgICAgID0ge30sXG5kYXRhIFx0ICA9IHt9LFxubGlzdGVuZXJzID0ge31cbn06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFQge1xuXG5pZiggISBpbml0aWFsaXplICYmIHBhcmVudCA9PT0gbnVsbClcbnRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxubGV0IEN1c3RvbUNsYXNzID0gY3VzdG9tRWxlbWVudHMuZ2V0KHRhZ25hbWUpO1xuaWYoQ3VzdG9tQ2xhc3MgPT09IHVuZGVmaW5lZClcbnRocm93IG5ldyBFcnJvcihgJHt0YWduYW1lfSBub3QgZGVmaW5lZGApO1xubGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuLy9UT0RPOiBmYWN0b3JpemUuLi5cblxuLy8gRml4IGlzc3VlICMyXG5pZiggZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ25hbWUgKVxuZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc1wiLCB0YWduYW1lKTtcblxuaWYoIGlkICE9PSB1bmRlZmluZWQgKVxuZWxlbS5pZCA9IGlkO1xuXG5pZiggY2xhc3Nlcy5sZW5ndGggPiAwKVxuZWxlbS5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuXG5mb3IobGV0IG5hbWUgaW4gY3NzdmFycylcbmVsZW0uc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtuYW1lfWAsIGNzc3ZhcnNbbmFtZV0pO1xuXG5mb3IobGV0IG5hbWUgaW4gYXR0cnMpIHtcblxubGV0IHZhbHVlID0gYXR0cnNbbmFtZV07XG5pZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcbmVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbmVsc2VcbmVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbn1cblxuZm9yKGxldCBuYW1lIGluIGRhdGEpIHtcblxubGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcbmlmKCB2YWx1ZSA9PT0gZmFsc2UpXG5kZWxldGUgZWxlbS5kYXRhc2V0W25hbWVdO1xuZWxzZSBpZih2YWx1ZSA9PT0gdHJ1ZSlcbmVsZW0uZGF0YXNldFtuYW1lXSA9IFwiXCI7XG5lbHNlXG5lbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcbn1cblxuaWYoICEgQXJyYXkuaXNBcnJheShjb250ZW50KSApXG5jb250ZW50ID0gW2NvbnRlbnQgYXMgYW55XTtcbmVsZW0ucmVwbGFjZUNoaWxkcmVuKC4uLmNvbnRlbnQpO1xuXG5mb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuZWxlbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyc1tuYW1lXSk7XG5cbmlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG5wYXJlbnQuYXBwZW5kKGVsZW0pO1xuXG5pZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcbkxJU1MuaW5pdGlhbGl6ZVN5bmMoZWxlbSk7XG5cbnJldHVybiBMSVNTLmdldExJU1NTeW5jKGVsZW0pO1xufVxuTElTUy5idWlsZFN5bmMgPSBidWlsZFN5bmM7XG4qLyIsIlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBRdWVyeVNlbGVjdG9ycyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgTElTUyBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xuaW1wb3J0IHR5cGUgeyBMSVNTQmFzZSwgTElTU0hvc3QgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGluaXRpYWxpemVTeW5jLCB3aGVuSW5pdGlhbGl6ZWQgfSBmcm9tIFwiLi4vc3RhdGVcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudHMge307XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi4vZXh0ZW5kc1wiIHtcbiAgICBpbnRlcmZhY2UgSUxJU1Mge1xuICAgICAgICAvLyBhc3luY1xuICAgICAgICBxcyA6IHR5cGVvZiBxcztcbiAgICAgICAgcXNvOiB0eXBlb2YgcXNvO1xuICAgICAgICBxc2E6IHR5cGVvZiBxc2E7XG4gICAgICAgIHFzYzogdHlwZW9mIHFzYztcblxuICAgICAgICAvLyBzeW5jXG4gICAgICAgIHFzU3luYyA6IHR5cGVvZiBxc1N5bmM7XG4gICAgICAgIHFzYVN5bmM6IHR5cGVvZiBxc2FTeW5jO1xuICAgICAgICBxc2NTeW5jOiB0eXBlb2YgcXNjU3luYztcblxuXHRcdGNsb3Nlc3Q6IHR5cGVvZiBjbG9zZXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzc19zZWxlY3RvcihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtsaXNzX3NlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIHFzPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxczxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRsZXQgcmVzdWx0ID0gYXdhaXQgcXNvPFQ+KHNlbGVjdG9yLCBwYXJlbnQpO1xuXHRpZihyZXN1bHQgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiByZXN1bHQhXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxc288TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8IENvbXBvbmVudHNbTl0gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzbzxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCB3aGVuSW5pdGlhbGl6ZWQ8VD4oIGVsZW1lbnQgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcXNhPFQgZXh0ZW5kcyBMSVNTQmFzZT4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUW10+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dW10gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0Jhc2U+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0bGV0IGlkeCA9IDA7XG5cdGNvbnN0IHByb21pc2VzID0gbmV3IEFycmF5PFByb21pc2U8VD4+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHByb21pc2VzW2lkeCsrXSA9IHdoZW5Jbml0aWFsaXplZDxUPiggZWxlbWVudCApO1xuXG5cdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHFzYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gYXdhaXQgd2hlbkluaXRpYWxpemVkPFQ+KHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIHFzU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yPExJU1NIb3N0PFQ+PihzZWxlY3Rvcik7XG5cblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHRocm93IG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmRgKTtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4oIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFRbXTtcbmZ1bmN0aW9uIHFzYVN5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl1bXTtcbmZ1bmN0aW9uIHFzYVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsXG5cdFx0XHRcdFx0XHRwYXJlbnQgIDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblxuXHRbc2VsZWN0b3IsIHBhcmVudF0gPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIHBhcmVudCk7XG5cblx0Y29uc3QgZWxlbWVudHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbDxMSVNTSG9zdDxUPj4oc2VsZWN0b3IpO1xuXG5cdGxldCBpZHggPSAwO1xuXHRjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cmVzdWx0W2lkeCsrXSA9IGluaXRpYWxpemVTeW5jPFQ+KCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcXNjU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZT4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudCxcblx0XHRcdFx0XHRcdGVsZW1lbnQgID86IEVsZW1lbnQpIHtcblxuXHRjb25zdCByZXMgPSBfYnVpbGRRUyhzZWxlY3RvciwgdGFnbmFtZV9vcl9wYXJlbnQsIGVsZW1lbnQpO1xuXHRcblx0Y29uc3QgcmVzdWx0ID0gKHJlc1sxXSBhcyB1bmtub3duIGFzIEVsZW1lbnQpLmNsb3Nlc3Q8TElTU0hvc3Q8VD4+KHJlc1swXSk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHRyZXR1cm4gbnVsbDtcblxuXHRyZXR1cm4gaW5pdGlhbGl6ZVN5bmM8VD4ocmVzdWx0KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNsb3Nlc3Q8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcblxuXHR3aGlsZSh0cnVlKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGVsZW1lbnQuY2xvc2VzdDxFPihzZWxlY3Rvcik7XG5cblx0XHRpZiggcmVzdWx0ICE9PSBudWxsKVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblxuXHRcdGNvbnN0IHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG5cdFx0aWYoICEgKFwiaG9zdFwiIGluIHJvb3QpIClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0ZWxlbWVudCA9IChyb290IGFzIFNoYWRvd1Jvb3QpLmhvc3Q7XG5cdH1cbn1cblxuXG4vLyBhc3luY1xuTElTUy5xcyAgPSBxcztcbkxJU1MucXNvID0gcXNvO1xuTElTUy5xc2EgPSBxc2E7XG5MSVNTLnFzYyA9IHFzYztcblxuLy8gc3luY1xuTElTUy5xc1N5bmMgID0gcXNTeW5jO1xuTElTUy5xc2FTeW5jID0gcXNhU3luYztcbkxJU1MucXNjU3luYyA9IHFzY1N5bmM7XG5cbkxJU1MuY2xvc2VzdCA9IGNsb3Nlc3Q7IiwiaW1wb3J0IExJU1MgZnJvbSBcIi4vZXh0ZW5kc1wiO1xuXG5pbXBvcnQgXCIuL2RlZmluZVwiOyAvL1RPRE86IGN1c3RvbVJlZ2lzdGVyeVxuLy9UT0RPOiBnbG9iYWxDU1NSdWxlc1xuLy9UT0RPOiBCTElTU1xuLy9UT0RPOiBMSVNTUGFyYW1zXG4vL1RPRE86IG90aGVycy4uLlxuXG5cbmltcG9ydCBcIi4vaGVscGVycy9xdWVyeVNlbGVjdG9yc1wiO1xuaW1wb3J0IFwiLi9oZWxwZXJzL0xJU1NBdXRvXCI7XG5cbmV4cG9ydCB7bGlzcywgbGlzc1N5bmMsIGh0bWx9IGZyb20gXCIuL2hlbHBlcnMvYnVpbGRcIjtcbmV4cG9ydCBkZWZhdWx0IExJU1M7IiwiaW1wb3J0IHsgTElTU0Jhc2UsIExJU1NCYXNlQ3N0ciwgTElTU0hvc3QsIExJU1NIb3N0Q3N0ciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBfZWxlbWVudDJ0YWduYW1lLCBpc0RPTUNvbnRlbnRMb2FkZWQsIHdoZW5ET01Db250ZW50TG9hZGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZW51bSBTdGF0ZSB7XG4gICAgTk9ORSA9IDAsXG5cbiAgICAvLyBjbGFzc1xuICAgIERFRklORUQgPSAxIDw8IDAsXG4gICAgUkVBRFkgICA9IDEgPDwgMSxcblxuICAgIC8vIGluc3RhbmNlXG4gICAgVVBHUkFERUQgICAgPSAxIDw8IDIsXG4gICAgSU5JVElBTElaRUQgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCBjb25zdCBERUZJTkVEICAgICA9IFN0YXRlLkRFRklORUQ7XG5leHBvcnQgY29uc3QgUkVBRFkgICAgICAgPSBTdGF0ZS5SRUFEWTtcbmV4cG9ydCBjb25zdCBVUEdSQURFRCAgICA9IFN0YXRlLlVQR1JBREVEO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVEID0gU3RhdGUuSU5JVElBTElaRUQ7XG5cbmV4cG9ydCBjbGFzcyBMSVNTU3RhdGUge1xuXG4gICAgI2VsZW06IEhUTUxFbGVtZW50fG51bGw7XG5cbiAgICAvLyBpZiBudWxsIDogY2xhc3Mgc3RhdGUsIGVsc2UgaW5zdGFuY2Ugc3RhdGVcbiAgICBjb25zdHJ1Y3RvcihlbGVtOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbCkge1xuICAgICAgICB0aGlzLiNlbGVtID0gZWxlbTtcbiAgICB9XG5cbiAgICBzdGF0aWMgREVGSU5FRCAgICAgPSBERUZJTkVEO1xuICAgIHN0YXRpYyBSRUFEWSAgICAgICA9IFJFQURZO1xuICAgIHN0YXRpYyBVUEdSQURFRCAgICA9IFVQR1JBREVEO1xuICAgIHN0YXRpYyBJTklUSUFMSVpFRCA9IElOSVRJQUxJWkVEO1xuXG4gICAgaXMoc3RhdGU6IFN0YXRlKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGlmKCBzdGF0ZSAmIERFRklORUQgICAgICYmICEgdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSAgICAgICAmJiAhIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEICAgICYmICEgdGhpcy5pc1VwZ3JhZGVkIClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgJiYgISB0aGlzLmlzSW5pdGlhbGl6ZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyB3aGVuKHN0YXRlOiBTdGF0ZSkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBsZXQgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxhbnk+PigpO1xuICAgIFxuICAgICAgICBpZiggc3RhdGUgJiBERUZJTkVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlbkRlZmluZWQoKSApO1xuICAgICAgICBpZiggc3RhdGUgJiBSRUFEWSApXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKCB0aGlzLndoZW5SZWFkeSgpICk7XG4gICAgICAgIGlmKCBzdGF0ZSAmIFVQR1JBREVEIClcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2goIHRoaXMud2hlblVwZ3JhZGVkKCkgKTtcbiAgICAgICAgaWYoIHN0YXRlICYgSU5JVElBTElaRUQgKVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCggdGhpcy53aGVuSW5pdGlhbGl6ZWQoKSApO1xuICAgIFxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IERFRklORUQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBnZXQgaXNEZWZpbmVkKCkge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gY3VzdG9tRWxlbWVudHMuZ2V0KCBnZXROYW1lKHRoaXMuI2VsZW0pICkgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlbkRlZmluZWQ8VCBleHRlbmRzIExJU1NIb3N0Q3N0cjxMSVNTQmFzZT4+KCk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoIGdldE5hbWUodGhpcy4jZWxlbSkgKSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBSRUFEWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGdldCBpc1JlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgSG9zdCA9IGdldEhvc3RDc3RyU3luYyhlbGVtKTtcblxuICAgICAgICBpZiggISBpc0RPTUNvbnRlbnRMb2FkZWQoKSApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEhvc3QuaXNEZXBzUmVzb2x2ZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgd2hlblJlYWR5KCkge1xuXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5EZWZpbmVkKCk7IC8vIGNvdWxkIGJlIHJlYWR5IGJlZm9yZSBkZWZpbmVkLCBidXQgd2VsbC4uLlxuXG4gICAgICAgIGF3YWl0IHdoZW5ET01Db250ZW50TG9hZGVkO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkRlcHNSZXNvbHZlZDtcbiAgICB9XG4gICAgXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IFVQR1JBREVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzVXBncmFkZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzRGVmaW5lZCApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRIb3N0Q3N0clN5bmMoZWxlbSk7XG4gICAgICAgIHJldHVybiBlbGVtIGluc3RhbmNlb2YgaG9zdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PigpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuI2VsZW0gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3Qgc3VwcG9ydGVkIHlldFwiKTtcblxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy53aGVuRGVmaW5lZCgpO1xuICAgIFxuICAgICAgICBpZiggZWxlbSBpbnN0YW5jZW9mIGhvc3QpXG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgIFxuICAgICAgICAvLyBoNGNrXG4gICAgXG4gICAgICAgIGlmKCBcIl93aGVuVXBncmFkZWRcIiBpbiBlbGVtKSB7XG4gICAgICAgICAgICBhd2FpdCBlbGVtLl93aGVuVXBncmFkZWQ7XG4gICAgICAgICAgICByZXR1cm4gZWxlbSBhcyBUO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCByZXNvbHZlfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczx2b2lkPigpO1xuICAgICAgICBcbiAgICAgICAgKGVsZW0gYXMgYW55KS5fd2hlblVwZ3JhZGVkICAgICAgICA9IHByb21pc2U7XG4gICAgICAgIChlbGVtIGFzIGFueSkuX3doZW5VcGdyYWRlZFJlc29sdmUgPSByZXNvbHZlO1xuICAgIFxuICAgICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICAgIHJldHVybiBlbGVtIGFzIFQ7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09IElOSVRJQUxJWkVEID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZ2V0IGlzSW5pdGlhbGl6ZWQoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy4jZWxlbTtcblxuICAgICAgICBpZiggISB0aGlzLmlzVXBncmFkZWQgKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgICAgICByZXR1cm4gXCJpc0luaXRpYWxpemVkXCIgaW4gZWxlbSAmJiBlbGVtLmlzSW5pdGlhbGl6ZWQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHdoZW5Jbml0aWFsaXplZDxUIGV4dGVuZHMgTElTU0Jhc2U+KCkge1xuICAgIFxuICAgICAgICBpZih0aGlzLiNlbGVtID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHN1cHBvcnRlZCB5ZXRcIik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLiNlbGVtO1xuXG4gICAgICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLndoZW5VcGdyYWRlZCgpO1xuXG4gICAgICAgIGF3YWl0IGhvc3Qud2hlbkluaXRpYWxpemVkO1xuXG4gICAgICAgIHJldHVybiAoZWxlbSBhcyBMSVNTSG9zdDxUPikuYmFzZSBhcyBUO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PSBDT05WRVJTSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhbHVlT2YoKSB7XG5cbiAgICAgICAgaWYodGhpcy4jZWxlbSA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBzdXBwb3J0ZWQgeWV0XCIpO1xuXG4gICAgICAgIGxldCBzdGF0ZTogU3RhdGUgPSAwO1xuICAgIFxuICAgICAgICBpZiggdGhpcy5pc0RlZmluZWQgKVxuICAgICAgICAgICAgc3RhdGUgfD0gREVGSU5FRDtcbiAgICAgICAgaWYoIHRoaXMuaXNSZWFkeSApXG4gICAgICAgICAgICBzdGF0ZSB8PSBSRUFEWTtcbiAgICAgICAgaWYoIHRoaXMuaXNVcGdyYWRlZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBVUEdSQURFRDtcbiAgICAgICAgaWYoIHRoaXMuaXNJbml0aWFsaXplZCApXG4gICAgICAgICAgICBzdGF0ZSB8PSBJTklUSUFMSVpFRDtcbiAgICBcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgIGxldCBpcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgICAgaWYoIHN0YXRlICYgREVGSU5FRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiREVGSU5FRFwiKTtcbiAgICAgICAgaWYoIHN0YXRlICYgUkVBRFkgKVxuICAgICAgICAgICAgaXMucHVzaChcIlJFQURZXCIpO1xuICAgICAgICBpZiggc3RhdGUgJiBVUEdSQURFRCApXG4gICAgICAgICAgICBpcy5wdXNoKFwiVVBHUkFERURcIik7XG4gICAgICAgIGlmKCBzdGF0ZSAmIElOSVRJQUxJWkVEIClcbiAgICAgICAgICAgIGlzLnB1c2goXCJJTklUSUFMSVpFRFwiKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGlzLmpvaW4oJ3wnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGlmKCBcInN0YXRlXCIgaW4gZWxlbSlcbiAgICAgICAgcmV0dXJuIGVsZW0uc3RhdGUgYXMgTElTU1N0YXRlO1xuICAgIFxuICAgIHJldHVybiAoZWxlbSBhcyBhbnkpLnN0YXRlID0gbmV3IExJU1NTdGF0ZShlbGVtKTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09IFN0YXRlIG1vZGlmaWVycyAobW92ZT8pID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHbyB0byBzdGF0ZSBERUZJTkVEXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lPFQgZXh0ZW5kcyBMSVNTQmFzZUNzdHI+KFxuICAgIHRhZ25hbWUgICAgICAgOiBzdHJpbmcsXG4gICAgQ29tcG9uZW50Q2xhc3M6IFR8TElTU0hvc3RDc3RyPFQ+KSB7XG5cbiAgICAvLyBjb3VsZCBiZSBiZXR0ZXIuXG4gICAgaWYoIFwiQmFzZVwiIGluIENvbXBvbmVudENsYXNzKSB7XG4gICAgICAgIENvbXBvbmVudENsYXNzID0gQ29tcG9uZW50Q2xhc3MuQmFzZSBhcyBUO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBDbGFzcyAgPSBDb21wb25lbnRDbGFzcy5MSVNTQ2ZnLmhvc3Q7XG4gICAgbGV0IGh0bWx0YWcgID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuICAgIGNvbnN0IExJU1NjbGFzcyA9IENvbXBvbmVudENsYXNzLkhvc3Q7IC8vYnVpbGRMSVNTSG9zdDxUPihDb21wb25lbnRDbGFzcywgcGFyYW1zKTtcblxuICAgIGNvbnN0IG9wdHMgPSBodG1sdGFnID09PSB1bmRlZmluZWQgPyB7fVxuICAgICAgICAgICAgICAgIDoge2V4dGVuZHM6IGh0bWx0YWd9O1xuXG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ25hbWUsIExJU1NjbGFzcywgb3B0cyk7XG59O1xuXG4vLyBHbyB0byBzdGF0ZSBVUEdSQURFRFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZ3JhZGU8VCBleHRlbmRzIExJU1NIb3N0PExJU1NCYXNlQ3N0cj4+KGVsZW06IEhUTUxFbGVtZW50LCBzdHJpY3QgPSBmYWxzZSk6IFByb21pc2U8VD4ge1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc1VwZ3JhZGVkICYmIHN0cmljdCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSB1cGdyYWRlZCFgKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5EZWZpbmVkKCk7XG5cbiAgICByZXR1cm4gdXBncmFkZVN5bmM8VD4oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3luYzxUIGV4dGVuZHMgTElTU0hvc3Q8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQsIHN0cmljdCA9IGZhbHNlKTogVCB7XG4gICBcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKGVsZW0pO1xuXG4gICAgaWYoIHN0YXRlLmlzVXBncmFkZWQgJiYgc3RyaWN0IClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbHJlYWR5IHVwZ3JhZGVkIWApO1xuICAgIFxuICAgIGlmKCAhIHN0YXRlLmlzRGVmaW5lZCApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgZGVmaW5lZCEnKTtcblxuICAgIGlmKCBlbGVtLm93bmVyRG9jdW1lbnQgIT09IGRvY3VtZW50IClcbiAgICAgICAgZG9jdW1lbnQuYWRvcHROb2RlKGVsZW0pO1xuICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoZWxlbSk7XG5cbiAgICBjb25zdCBIb3N0ID0gZ2V0SG9zdENzdHJTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgKGVsZW0gaW5zdGFuY2VvZiBIb3N0KSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBkaWRuJ3QgdXBncmFkZSFgKTtcblxuICAgIHJldHVybiBlbGVtIGFzIFQ7XG59XG5cbi8vIEdvIHRvIHN0YXRlIElOSVRJQUxJWkVEXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBzdHJpY3Q6IGJvb2xlYW58VFtcInBhcmFtc1wiXSA9IGZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBzdGF0ZS5pc0luaXRpYWxpemVkICkge1xuICAgICAgICBpZiggc3RyaWN0ID09PSBmYWxzZSApXG4gICAgICAgICAgICByZXR1cm4gKGVsZW0gYXMgYW55KS5iYXNlIGFzIFQ7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxyZWFkeSBpbml0aWFsaXplZCFgKTtcbiAgICB9XG5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdXBncmFkZShlbGVtKTtcblxuICAgIGF3YWl0IHN0YXRlLndoZW5SZWFkeSgpO1xuXG4gICAgbGV0IHBhcmFtcyA9IHR5cGVvZiBzdHJpY3QgPT09IFwiYm9vbGVhblwiID8ge30gOiBzdHJpY3Q7XG4gICAgaG9zdC5pbml0aWFsaXplKHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaG9zdC5iYXNlIGFzIFQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVN5bmM8VCBleHRlbmRzIExJU1NCYXNlPihlbGVtIDogSFRNTEVsZW1lbnR8TElTU0hvc3Q8VD4sIHN0cmljdDogYm9vbGVhbnxUW1wicGFyYW1zXCJdID0gZmFsc2UpOiBUIHtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG4gICAgaWYoIHN0YXRlLmlzSW5pdGlhbGl6ZWQgKSB7XG4gICAgICAgIGlmKCBzdHJpY3QgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuIChlbGVtIGFzIGFueSkuYmFzZSBhcyBUO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaW5pdGlhbGl6ZWQhYCk7XG4gICAgfVxuXG4gICAgY29uc3QgaG9zdCA9IHVwZ3JhZGVTeW5jKGVsZW0pO1xuXG4gICAgaWYoICEgc3RhdGUuaXNSZWFkeSApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgbm90IHJlYWR5ICFcIik7XG5cbiAgICBsZXQgcGFyYW1zID0gdHlwZW9mIHN0cmljdCA9PT0gXCJib29sZWFuXCIgPyB7fSA6IHN0cmljdDtcbiAgICBob3N0LmluaXRpYWxpemUocGFyYW1zKTtcblxuICAgIHJldHVybiBob3N0LmJhc2UgYXMgVDtcbn1cbi8vID09PT09PT09PT09PT09PT09PT09PT0gZXh0ZXJuYWwgV0hFTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlblVwZ3JhZGVkPFQgZXh0ZW5kcyBMSVNTSG9zdDxMSVNTQmFzZUNzdHI+PihlbGVtOiBIVE1MRWxlbWVudCwgZm9yY2U9ZmFsc2UsIHN0cmljdD1mYWxzZSk6IFByb21pc2U8VD4ge1xuICAgIFxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGUoZWxlbSk7XG5cbiAgICBpZiggZm9yY2UgKVxuICAgICAgICByZXR1cm4gYXdhaXQgdXBncmFkZShlbGVtLCBzdHJpY3QpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHN0YXRlLndoZW5VcGdyYWRlZDxUPigpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2hlbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBMSVNTQmFzZT4oZWxlbSA6IEhUTUxFbGVtZW50fExJU1NIb3N0PFQ+LCBmb3JjZT1mYWxzZSwgc3RyaWN0PWZhbHNlKTogUHJvbWlzZTxUPiB7XG4gICAgXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZShlbGVtKTtcblxuICAgIGlmKCBmb3JjZSApXG4gICAgICAgIHJldHVybiBhd2FpdCBpbml0aWFsaXplKGVsZW0sIHN0cmljdCk7XG5cbiAgICByZXR1cm4gYXdhaXQgc3RhdGUud2hlbkluaXRpYWxpemVkPFQ+KCk7XG59XG5cbi8vIFByaXZhdGUgZm9yIG5vdy5cblxuZnVuY3Rpb24gZ2V0SG9zdENzdHJTeW5jPFQgZXh0ZW5kcyBMSVNTSG9zdENzdHI8TElTU0Jhc2VDc3RyPj4oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBcbiAgICBjb25zdCBuYW1lID0gZ2V0TmFtZShlbGVtKTtcbiAgICBjb25zdCBob3N0ID0gY3VzdG9tRWxlbWVudHMuZ2V0KCBuYW1lICk7XG4gICAgaWYoIGhvc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke25hbWV9IG5vdCB5ZXQgZGVmaW5lZCFgKTtcbiAgICByZXR1cm4gaG9zdCBhcyBUO1xufVxuXG4vL1RPRE86IG1vdmUgMiByZWdpc3RlcnkuLi5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKCBlbGVtZW50OiBFbGVtZW50ICk6IHN0cmluZyB7XG5cblx0Y29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcblx0aWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuXHRyZXR1cm4gbmFtZTtcbn0iLCJpbXBvcnQgeyBidWlsZExJU1NIb3N0IH0gZnJvbSBcIi4vTElTU0hvc3RcIjtcbmltcG9ydCB7IExJU1MgfSBmcm9tIFwiLi9MSVNTQmFzZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzIHt9XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0geyBuZXcoLi4uYXJnczphbnlbXSk6IFR9O1xuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnR8Tm9kZTtcbmV4cG9ydCB0eXBlIEhUTUxfU291cmNlICAgPSBIVE1MX1Jlc291cmNlIHwgUHJvbWlzZTxIVE1MX1Jlc291cmNlPjtcblxuZXhwb3J0IGVudW0gU2hhZG93Q2ZnIHtcblx0Tk9ORSA9ICdub25lJyxcblx0T1BFTiA9ICdvcGVuJywgXG5cdENMT1NFPSAnY2xvc2VkJ1xufTtcblxuLy9UT0RPOiBpbXBsZW1lbnQgP1xuZXhwb3J0IGVudW0gTGlmZUN5Y2xlIHtcbiAgICBERUZBVUxUICAgICAgICAgICAgICAgICAgID0gMCxcblx0Ly8gbm90IGltcGxlbWVudGVkIHlldFxuICAgIElOSVRfQUZURVJfQ0hJTERSRU4gICAgICAgPSAxIDw8IDEsXG4gICAgSU5JVF9BRlRFUl9QQVJFTlQgICAgICAgICA9IDEgPDwgMixcbiAgICAvLyBxdWlkIHBhcmFtcy9hdHRycyA/XG4gICAgUkVDUkVBVEVfQUZURVJfQ09OTkVDVElPTiA9IDEgPDwgMywgLyogcmVxdWlyZXMgcmVidWlsZCBjb250ZW50ICsgZGVzdHJveS9kaXNwb3NlIHdoZW4gcmVtb3ZlZCBmcm9tIERPTSAqL1xuICAgIC8qIHNsZWVwIHdoZW4gZGlzY28gOiB5b3UgbmVlZCB0byBpbXBsZW1lbnQgaXQgeW91cnNlbGYgKi9cbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudEZhY3Rvcnk8QXR0cnMgZXh0ZW5kcyBzdHJpbmcsIFBhcmFtcyBleHRlbmRzIFJlY29yZDxzdHJpbmcsYW55Pj4gPSAoIChhdHRyczogUmVjb3JkPEF0dHJzLCBudWxsfHN0cmluZz4sIHBhcmFtczogUGFyYW1zLCBlbGVtOkhUTUxFbGVtZW50KSA9PiBOb2RlfHVuZGVmaW5lZCApO1xuXG4vLyBVc2luZyBDb25zdHJ1Y3RvcjxUPiBpbnN0ZWFkIG9mIFQgYXMgZ2VuZXJpYyBwYXJhbWV0ZXJcbi8vIGVuYWJsZXMgdG8gZmV0Y2ggc3RhdGljIG1lbWJlciB0eXBlcy5cbmV4cG9ydCB0eXBlIExJU1NfT3B0czxcbiAgICAvLyBKUyBCYXNlXG4gICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgPSBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgLyogUk8gPyAqL1xuICAgIC8vIEhUTUwgQmFzZVxuICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZyxcbiAgICA+ID0ge1xuICAgICAgICAvLyBKUyBCYXNlXG4gICAgICAgIGV4dGVuZHMgICA6IEV4dGVuZHNDdHIsXG4gICAgICAgIHBhcmFtcyAgICA6IFBhcmFtcyxcbiAgICAgICAgLy8gbm9uLWdlbmVyaWNcbiAgICAgICAgZGVwcyAgICAgIDogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W10sXG5cbiAgICAgICAgLy8gSFRNTCBCYXNlXG4gICAgICAgIGhvc3QgICA6IEhvc3RDc3RyLFxuICAgICAgICBhdHRycyAgOiByZWFkb25seSBBdHRyc1tdLFxuICAgICAgICBvYnNlcnZlZEF0dHJpYnV0ZXM6IHJlYWRvbmx5IEF0dHJzW10sIC8vIGZvciB2YW5pbGxhIGNvbXBhdFxuICAgICAgICAvLyBub24tZ2VuZXJpY1xuICAgICAgICBjb250ZW50PzogSFRNTF9Tb3VyY2UsXG4gICAgICAgIGNvbnRlbnRfZmFjdG9yeTogKGNvbnRlbnQ/OiBFeGNsdWRlPEhUTUxfUmVzb3VyY2UsIFJlc3BvbnNlPikgPT4gQ29udGVudEZhY3Rvcnk8QXR0cnMsIFBhcmFtcz4sXG4gICAgICAgIGNzcyAgICAgOiBDU1NfU291cmNlIHwgcmVhZG9ubHkgQ1NTX1NvdXJjZVtdLFxuICAgICAgICBzaGFkb3cgIDogU2hhZG93Q2ZnXG59XG5cbi8vIExJU1NCYXNlXG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlQ3N0cjxcbiAgICAgICAgRXh0ZW5kc0N0ciBleHRlbmRzIENvbnN0cnVjdG9yPENsYXNzPiAgICAgICA9IENvbnN0cnVjdG9yPENsYXNzPixcbiAgICAgICAgUGFyYW1zICAgICBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gICAgICA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCAvKiBSTyA/ICovXG4gICAgICAgIEhvc3RDc3RyICAgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4gPSBDb25zdHJ1Y3RvcjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcgICAgICAgICAgICAgICAgICAgPSBzdHJpbmc+XG4gICAgPSBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPEV4dGVuZHNDdHIsIFBhcmFtcywgSG9zdENzdHIsIEF0dHJzPj47XG5cbmV4cG9ydCB0eXBlIExJU1NCYXNlPFxuICAgICAgICBFeHRlbmRzQ3RyIGV4dGVuZHMgQ29uc3RydWN0b3I8Q2xhc3M+ICAgICAgID0gQ29uc3RydWN0b3I8Q2xhc3M+LFxuICAgICAgICBQYXJhbXMgICAgIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiAgICAgID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIC8qIFJPID8gKi9cbiAgICAgICAgSG9zdENzdHIgICBleHRlbmRzIENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PiA9IENvbnN0cnVjdG9yPEhUTUxFbGVtZW50PixcbiAgICAgICAgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICAgICAgICA9IHN0cmluZz5cbiAgICA9IEluc3RhbmNlVHlwZTxMSVNTQmFzZUNzdHI8RXh0ZW5kc0N0ciwgUGFyYW1zLCBIb3N0Q3N0ciwgQXR0cnM+PjtcblxuXG5leHBvcnQgdHlwZSBMSVNTQmFzZTJMSVNTQmFzZUNzdHI8VCBleHRlbmRzIExJU1NCYXNlPiA9IFQgZXh0ZW5kcyBMSVNTQmFzZTxcbiAgICAgICAgICAgIGluZmVyIEEgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxDbGFzcz4sXG4gICAgICAgICAgICBpbmZlciBCLFxuICAgICAgICAgICAgaW5mZXIgQyxcbiAgICAgICAgICAgIGluZmVyIEQ+ID8gQ29uc3RydWN0b3I8VD4gJiBMSVNTQmFzZUNzdHI8QSxCLEMsRD4gOiBuZXZlcjtcblxuXG5leHBvcnQgdHlwZSBMSVNTSG9zdENzdHI8VCBleHRlbmRzIExJU1NCYXNlfExJU1NCYXNlQ3N0cj4gPSBSZXR1cm5UeXBlPHR5cGVvZiBidWlsZExJU1NIb3N0PFQgZXh0ZW5kcyBMSVNTQmFzZSA/IExJU1NCYXNlMkxJU1NCYXNlQ3N0cjxUPiA6IFQ+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0ICAgIDxUIGV4dGVuZHMgTElTU0Jhc2V8TElTU0Jhc2VDc3RyPiA9IEluc3RhbmNlVHlwZTxMSVNTSG9zdENzdHI8VD4+OyIsIi8vIGZ1bmN0aW9ucyByZXF1aXJlZCBieSBMSVNTLlxuXG4vLyBmaXggQXJyYXkuaXNBcnJheVxuLy8gY2YgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMiNpc3N1ZWNvbW1lbnQtMjM2Njc0OTA1MFxuXG50eXBlIFg8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciAgICA/IFRbXSAgICAgICAgICAgICAgICAgICAvLyBhbnkvdW5rbm93biA9PiBhbnlbXS91bmtub3duXG4gICAgICAgIDogVCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXSAgICAgICAgICA/IFQgICAgICAgICAgICAgICAgICAgICAvLyB1bmtub3duW10gLSBvYnZpb3VzIGNhc2VcbiAgICAgICAgOiBUIGV4dGVuZHMgSXRlcmFibGU8aW5mZXIgVT4gICAgICAgICAgID8gICAgICAgcmVhZG9ubHkgVVtdICAgIC8vIEl0ZXJhYmxlPFU+IG1pZ2h0IGJlIGFuIEFycmF5PFU+XG4gICAgICAgIDogICAgICAgICAgdW5rbm93bltdIGV4dGVuZHMgVCAgICAgICAgICA/ICAgICAgICAgIHVua25vd25bXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICA6IHJlYWRvbmx5IHVua25vd25bXSBleHRlbmRzIFQgICAgICAgICAgPyByZWFkb25seSB1bmtub3duW10gICAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgYmUgYW4gYXJyYXkgLSBubyB3YXlzIHRvIGdldCB0aGUgcmVhbCB0eXBlID9cbiAgICAgICAgOiAgICAgICAgICAgICAgYW55W10gZXh0ZW5kcyBUICAgICAgICAgID8gICAgICAgICAgICAgIGFueVtdICAgIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGJlIGFuIGFycmF5IC0gbm8gd2F5cyB0byBnZXQgdGhlIHJlYWwgdHlwZSA/XG4gICAgICAgIDogcmVhZG9ubHkgICAgIGFueVtdIGV4dGVuZHMgVCAgICAgICAgICA/IHJlYWRvbmx5ICAgICBhbnlbXSAgICAvLyBzb21ldGhpbmcgdGhhdCBjb3VsZCBiZSBhbiBhcnJheSAtIG5vIHdheXMgdG8gZ2V0IHRoZSByZWFsIHR5cGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLy8gcmVxdWlyZWQgZm9yIGFueS91bmtub3duICsgSXRlcmFibGU8VT5cbnR5cGUgWDI8VD4gPSBFeGNsdWRlPHVua25vd24sVD4gZXh0ZW5kcyBuZXZlciA/IHVua25vd24gOiB1bmtub3duO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEFycmF5Q29uc3RydWN0b3Ige1xuICAgICAgICBpc0FycmF5PFQ+KGE6IFR8WDI8VD4pOiBhIGlzIFg8VD47XG4gICAgfVxufVxuXG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxMDAwNDYxL2h0bWwtZWxlbWVudC10YWctbmFtZS1mcm9tLWNvbnN0cnVjdG9yXG5jb25zdCBIVE1MQ0xBU1NfUkVHRVggPSAgL0hUTUwoXFx3KylFbGVtZW50LztcbmNvbnN0IGVsZW1lbnROYW1lTG9va3VwVGFibGUgPSB7XG4gICAgJ1VMaXN0JzogJ3VsJyxcbiAgICAnVGFibGVDYXB0aW9uJzogJ2NhcHRpb24nLFxuICAgICdUYWJsZUNlbGwnOiAndGQnLCAvLyB0aFxuICAgICdUYWJsZUNvbCc6ICdjb2wnLCAgLy8nY29sZ3JvdXAnLFxuICAgICdUYWJsZVJvdyc6ICd0cicsXG4gICAgJ1RhYmxlU2VjdGlvbic6ICd0Ym9keScsIC8vWyd0aGVhZCcsICd0Ym9keScsICd0Zm9vdCddLFxuICAgICdRdW90ZSc6ICdxJyxcbiAgICAnUGFyYWdyYXBoJzogJ3AnLFxuICAgICdPTGlzdCc6ICdvbCcsXG4gICAgJ01vZCc6ICdpbnMnLCAvLywgJ2RlbCddLFxuICAgICdNZWRpYSc6ICd2aWRlbycsLy8gJ2F1ZGlvJ10sXG4gICAgJ0ltYWdlJzogJ2ltZycsXG4gICAgJ0hlYWRpbmcnOiAnaDEnLCAvLywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J10sXG4gICAgJ0RpcmVjdG9yeSc6ICdkaXInLFxuICAgICdETGlzdCc6ICdkbCcsXG4gICAgJ0FuY2hvcic6ICdhJ1xuICB9O1xuZXhwb3J0IGZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblx0XG5cdGxldCBodG1sdGFnID0gSFRNTENMQVNTX1JFR0VYLmV4ZWMoQ2xhc3MubmFtZSkhWzFdO1xuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn1cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93XG5jb25zdCBDQU5fSEFWRV9TSEFET1cgPSBbXG5cdG51bGwsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdkaXYnLFxuXHQnZm9vdGVyJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWRlcicsICdtYWluJyxcblx0J25hdicsICdwJywgJ3NlY3Rpb24nLCAnc3Bhbidcblx0XG5dO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2hhZG93U3VwcG9ydGVkKHRhZzogdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNET01Db250ZW50TG9hZGVkKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiO1xufVxuXG5leHBvcnQgY29uc3Qgd2hlbkRPTUNvbnRlbnRMb2FkZWQgPSB3YWl0RE9NQ29udGVudExvYWRlZCgpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdERPTUNvbnRlbnRMb2FkZWQoKSB7XG4gICAgaWYoIGlzRE9NQ29udGVudExvYWRlZCgpIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qge3Byb21pc2UsIHJlc29sdmV9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPHZvaWQ+KClcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG5cbiAgICBhd2FpdCBwcm9taXNlO1xufVxuXG4vLyBmb3IgbWl4aW5zLlxuZXhwb3J0IHR5cGUgQ29tcG9zZUNvbnN0cnVjdG9yPFQsIFU+ID0gXG4gICAgW1QsIFVdIGV4dGVuZHMgW25ldyAoYTogaW5mZXIgTzEpID0+IGluZmVyIFIxLG5ldyAoYTogaW5mZXIgTzIpID0+IGluZmVyIFIyXSA/IHtcbiAgICAgICAgbmV3IChvOiBPMSAmIE8yKTogUjEgJiBSMlxuICAgIH0gJiBQaWNrPFQsIGtleW9mIFQ+ICYgUGljazxVLCBrZXlvZiBVPiA6IG5ldmVyIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsImltcG9ydCAnLi4vLi4vLi4vJzsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwicGFnZXMvZXhhbXBsZXMvbGlzcy1hdXRvL2luZGV4Lmh0bWxcIjsiXSwibmFtZXMiOlsiYnVpbGRMSVNTSG9zdCIsIlNoYWRvd0NmZyIsIl9lbGVtZW50MnRhZ25hbWUiLCJpc1NoYWRvd1N1cHBvcnRlZCIsImh0bWwiLCJfX2NzdHJfaG9zdCIsInNldENzdHJIb3N0IiwiXyIsIkRFRkFVTFRfQ09OVEVOVF9GQUNUT1JZIiwiY29udGVudCIsInRyaW0iLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJIVE1MVGVtcGxhdGVFbGVtZW50IiwiY2xvbmVOb2RlIiwiTElTUyIsImV4dGVuZHMiLCJfZXh0ZW5kcyIsIk9iamVjdCIsInBhcmFtcyIsImRlcHMiLCJob3N0IiwiSFRNTEVsZW1lbnQiLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRycyIsImNvbnRlbnRfZmFjdG9yeSIsIl9jb250ZW50X2ZhY3RvcnkiLCJjc3MiLCJzaGFkb3ciLCJDTE9TRSIsIk5PTkUiLCJPUEVOIiwiRXJyb3IiLCJhbGxfZGVwcyIsIlByb21pc2UiLCJSZXNwb25zZSIsIl9jb250ZW50IiwicHVzaCIsInRleHQiLCJMSVNTQmFzZSIsIkxJU1NDZmciLCJzdHlsZXNoZWV0cyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImMiLCJpZHgiLCJwcm9jZXNzX2NzcyIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkhvc3QiLCJzdGF0ZSIsInNldEF0dHJEZWZhdWx0IiwiYXR0ciIsInZhbHVlIiwib25BdHRyQ2hhbmdlZCIsIl9uYW1lIiwiX29sZFZhbHVlIiwiX25ld1ZhbHVlIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwidXBkYXRlUGFyYW1zIiwiYXNzaWduIiwiaXNJbkRPTSIsImlzQ29ubmVjdGVkIiwib25ET01Db25uZWN0ZWQiLCJjb25uZWN0ZWRDYWxsYmFjayIsIm9uRE9NRGlzY29ubmVjdGVkIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJfSG9zdCIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2VTeW5jIiwiTElTU1N0YXRlIiwiaXNET01Db250ZW50TG9hZGVkIiwid2FpdERPTUNvbnRlbnRMb2FkZWQiLCJpZCIsInNoYXJlZENTUyIsIkxpc3MiLCJHRVQiLCJTeW1ib2wiLCJTRVQiLCJwcm9wZXJ0aWVzIiwiZnJvbUVudHJpZXMiLCJuIiwiZW51bWVyYWJsZSIsImdldCIsInNldCIsIkF0dHJpYnV0ZXMiLCJuYW1lIiwiZGF0YSIsImRlZmF1bHRzIiwic2V0dGVyIiwiZGVmaW5lUHJvcGVydGllcyIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsIndhaXRSZWFkeSIsInIiLCJhbGwiLCJpc1JlYWR5Iiwid2hlbkRlcHNSZXNvbHZlZCIsImlzRGVwc1Jlc29sdmVkIiwiTElTU0hvc3RCYXNlIiwiQmFzZSIsImJhc2UiLCJpc0luaXRpYWxpemVkIiwid2hlbkluaXRpYWxpemVkIiwiaW5pdGlhbGl6ZSIsImluaXQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJnZXRQYXJ0IiwiaGFzU2hhZG93IiwicXVlcnlTZWxlY3RvciIsImdldFBhcnRzIiwicXVlcnlTZWxlY3RvckFsbCIsIkNTU1NlbGVjdG9yIiwiaGFzQXR0cmlidXRlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInByb21pc2UiLCJyZXNvbHZlIiwid2l0aFJlc29sdmVycyIsIl93aGVuVXBncmFkZWRSZXNvbHZlIiwiY3VzdG9tRWxlbWVudHMiLCJ1cGdyYWRlIiwiYXR0YWNoU2hhZG93IiwibW9kZSIsIm9icyIsImFkb3B0ZWRTdHlsZVNoZWV0cyIsImNzc3NlbGVjdG9yIiwiaGFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHRtbF9zdHlsZXNoZWV0cyIsInJ1bGUiLCJjc3NSdWxlcyIsImNzc1RleHQiLCJpbm5lckhUTUwiLCJyZXBsYWNlIiwiaGVhZCIsImFwcGVuZCIsImFkZCIsIm9iaiIsImNoaWxkTm9kZXMiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiZGVmaW5lIiwidGFnbmFtZSIsIkNvbXBvbmVudENsYXNzIiwiQ2xhc3MiLCJodG1sdGFnIiwiTElTU2NsYXNzIiwib3B0cyIsIndoZW5EZWZpbmVkIiwiY2FsbGJhY2siLCJ3aGVuQWxsRGVmaW5lZCIsInRhZ25hbWVzIiwidCIsImlzRGVmaW5lZCIsImdldE5hbWUiLCJlbGVtZW50IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsIl9MSVNTIiwiSUxJU1MiLCJFeHRlbmRlZExJU1MiLCJMSVNTX0F1dG8iLCJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwicmVnaXN0ZXIiLCJzdyIsInNjb3BlIiwiY29udHJvbGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkaXRpb24iLCJhZGRlZE5vZGVzIiwiRWxlbWVudCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiZWxlbSIsInJlc291cmNlcyIsImRlZmluZVdlYkNvbXBvbmVudCIsImZpbGVzIiwianMiLCJrbGFzcyIsInN0ciIsInNwYW5zIiwiX2EiLCJfYiIsInNwYW4iLCJ0ZXh0Q29udGVudCIsIldlYkNvbXBvbmVudCIsImZpbGVuYW1lcyIsImZpbGUiLCJlbmRzV2l0aCIsIl9pbXBvcnQiLCJfZmV0Y2hUZXh0IiwiaSIsInVyaSIsImlzTGlzc0F1dG8iLCJvcHRpb25zIiwiaGVhZGVycyIsInJlc3BvbnNlIiwiZmV0Y2giLCJzdGF0dXMiLCJkZWZhdWx0IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJpbml0aWFsaXplU3luYyIsInN0cmluZyIsInRlbXBsYXRlIiwiZmlyc3RDaGlsZCIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsImxpc3MiLCJEb2N1bWVudEZyYWdtZW50IiwibGlzc1N5bmMiLCJsaXNzX3NlbGVjdG9yIiwiX2J1aWxkUVMiLCJzZWxlY3RvciIsInRhZ25hbWVfb3JfcGFyZW50IiwicGFyZW50IiwicXMiLCJyZXN1bHQiLCJxc28iLCJxc2EiLCJlbGVtZW50cyIsInByb21pc2VzIiwicXNjIiwicmVzIiwiY2xvc2VzdCIsInFzU3luYyIsInFzYVN5bmMiLCJxc2NTeW5jIiwicm9vdCIsImdldFJvb3ROb2RlIiwid2hlbkRPTUNvbnRlbnRMb2FkZWQiLCJTdGF0ZSIsIkRFRklORUQiLCJSRUFEWSIsIlVQR1JBREVEIiwiSU5JVElBTElaRUQiLCJpcyIsImlzVXBncmFkZWQiLCJ3aGVuIiwid2hlblJlYWR5Iiwid2hlblVwZ3JhZGVkIiwiZ2V0SG9zdENzdHJTeW5jIiwiX3doZW5VcGdyYWRlZCIsInZhbHVlT2YiLCJ0b1N0cmluZyIsImpvaW4iLCJnZXRTdGF0ZSIsInN0cmljdCIsInVwZ3JhZGVTeW5jIiwib3duZXJEb2N1bWVudCIsImFkb3B0Tm9kZSIsImZvcmNlIiwiTGlmZUN5Y2xlIiwiSFRNTENMQVNTX1JFR0VYIiwiZWxlbWVudE5hbWVMb29rdXBUYWJsZSIsImV4ZWMiLCJDQU5fSEFWRV9TSEFET1ciLCJ0YWciLCJyZWFkeVN0YXRlIl0sInNvdXJjZVJvb3QiOiIifQ==