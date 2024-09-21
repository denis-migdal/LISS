// ================================================
// =============== LISS exported types ============
// ================================================
export var ShadowCfg;
(function (ShadowCfg) {
    ShadowCfg["NONE"] = "none";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
})(ShadowCfg || (ShadowCfg = {}));
;
// ================================================
// =============== LISS Class =====================
// ================================================
let __cstr_host = null;
// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
    null, 'article', 'aside', 'blockquote', 'body', 'div',
    'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
    'nav', 'p', 'section', 'span'
];
function _canHasShadow(tag) {
    return CAN_HAVE_SHADOW.includes(_element2tagname(tag));
}
export default function LISS({ extends: p_extends, host: p_host, dependancies: p_deps, attributes: p_attrs, params, content, css, shadow: p_shadow, } = {}) {
    //TODO merge prop if extends LISS...
    const host = p_host ?? HTMLElement;
    const _extends = p_extends ?? Object;
    const attributes = p_attrs ?? [];
    const dependancies = p_deps ? [...p_deps] : [];
    const canHasShadow = _canHasShadow(host);
    const shadow = p_shadow ?? (canHasShadow ? ShadowCfg.CLOSE : ShadowCfg.NONE);
    if (!canHasShadow && shadow !== ShadowCfg.NONE)
        throw new Error(`Host element ${_element2tagname(host)} does not support ShadowRoot`);
    // CONTENT processing
    if (content !== undefined) {
        dependancies.push((async () => {
            content = await content;
            if (content instanceof HTMLTemplateElement)
                content = content.innerHTML;
            if (typeof content === "string") {
                content = content.trim(); // Never return a text node of whitespace as the result
                if (content === '')
                    content = undefined;
            }
            if (content instanceof Response)
                content = await content.text();
            return LISSBase.Parameters.content = content;
        })());
    }
    // CSS processing
    let stylesheets = [];
    if (css !== undefined) {
        if (!Array.isArray(css))
            css = [css];
        stylesheets = new Array(css.length);
        const fetch_css = (async (css) => {
            css = await css;
            if (css instanceof CSSStyleSheet)
                return css;
            if (css instanceof HTMLStyleElement)
                return css.sheet;
            let style = new CSSStyleSheet();
            if (typeof css === "string") {
                style.replace(css);
                return style;
            }
            //if( css instanceof Response )
            style.replace(await css.text());
            return style;
        });
        dependancies.push(...css.map(async (css, idx) => stylesheets[idx] = await fetch_css(css)));
    }
    // @ts-ignore
    class LISSBase extends _extends {
        #host; // prevents issue #1...
        constructor() {
            super();
            // h4ck, okay because JS is monothreaded.
            if (__cstr_host === null)
                throw new Error("Please do not directly call this constructor");
            this.#host = __cstr_host;
            __cstr_host = null;
        }
        get host() {
            return this.#host;
        }
        get attrs() {
            return this.#host.attrs;
        }
        setAttrDefault(attr, value) {
            return this.#host.setAttrDefault(attr, value);
        }
        get params() {
            return this.#host.params;
        }
        get content() {
            return this.#host.content;
        }
        static Parameters = {
            host,
            dependancies,
            attributes,
            params,
            content,
            stylesheets,
            shadow,
        };
        onAttrChanged(_name, _oldValue, _newValue) { }
        get isInDOM() {
            return this.#host.isInDOM;
        }
        onDOMConnected() { }
        onDOMDisconnected() { }
    }
    return LISSBase;
}
//TODO: other options...
function extendsLISS(Liss, parameters) {
    // TODO: other options...
    const attrs = [...Liss.Parameters.attributes, ...parameters.attributes];
    const params = Object.assign({}, Liss.Parameters, { attributes: attrs });
    // @ts-ignore : because TS stupid
    class ExtendedLISS extends Liss {
        constructor(...t) {
            // @ts-ignore : because TS stupid
            super(...t);
        }
        get attrs() {
            return super.attrs;
        }
        static Parameters = params;
    }
    return ExtendedLISS;
}
LISS.extendsLISS = extendsLISS;
// ================================================
// =============== LISSHost class =================
// ================================================
function buildLISSHost(Liss, _params = {}) {
    const { host, attributes, content, stylesheets, shadow, } = Liss.Parameters;
    const alreadyDeclaredCSS = new Set();
    const GET = Symbol('get');
    const SET = Symbol('set');
    const properties = Object.fromEntries(attributes.map(n => [n, {
            enumerable: true,
            get: function () { return this[GET](n); },
            set: function (value) { return this[SET](n, value); }
        }]));
    class Attributes {
        #data;
        #defaults;
        #setter;
        [GET](name) {
            return this.#data[name] ?? this.#defaults[name] ?? null;
        }
        ;
        [SET](name, value) {
            return this.#setter(name, value); // required to get a clean object when doing {...attrs}
        }
        constructor(data, defaults, setter) {
            this.#data = data;
            this.#defaults = defaults;
            this.#setter = setter;
            Object.defineProperties(this, properties);
        }
    }
    // @ts-ignore : because TS is stupid.
    class LISSHostBase extends host {
        #params;
        constructor(params = {}) {
            super();
            this.#params = Object.assign({}, Liss.Parameters.params, _params, params);
            this.#waitInit = new Promise((resolve) => {
                if (this.isInit)
                    return resolve(this.#API);
                this.#resolve = resolve;
            });
        }
        /**** public API *************/
        get isInit() {
            return this.#API !== null;
        }
        async initialize(params = {}) {
            if (this.isInit)
                throw new Error('Element already initialized!');
            Object.assign(this.#params, params);
            const api = await this.init();
            if (this.#isInDOM)
                api.onDOMConnected();
            return api;
        }
        get LISSSync() {
            if (!this.isInit)
                throw new Error('Accessing API before WebComponent initialization!');
            return this.#API;
        }
        get LISS() {
            return this.#waitInit;
        }
        /*** init ***/
        #waitInit;
        #resolve = null;
        #API = null;
        #isInDOM = false;
        get isInDOM() {
            return this.#isInDOM;
        }
        disconnectedCallback() {
            this.#isInDOM = false;
            this.#API.onDOMDisconnected();
        }
        connectedCallback() {
            this.#isInDOM = true;
            if (!this.isInit) {
                this.init();
                return;
            }
            this.#API.onDOMConnected();
        }
        async init() {
            customElements.upgrade(this);
            // shadow
            this.#content = this;
            if (shadow !== 'none') {
                this.#content = this.attachShadow({ mode: shadow });
                //@ts-ignore
                this.#content.addEventListener('click', onClickEvent);
                //@ts-ignore
                this.#content.addEventListener('dblclick', onClickEvent);
            }
            // attrs
            for (let obs of attributes)
                this.#attributes[obs] = this.getAttribute(obs);
            // css
            if (shadow !== 'none')
                this.#content.adoptedStyleSheets.push(sharedCSS);
            if (stylesheets.length) {
                if (shadow !== 'none')
                    this.#content.adoptedStyleSheets.push(...stylesheets);
                else {
                    const cssselector = this.CSSSelector;
                    // if not yet inserted :
                    if (!alreadyDeclaredCSS.has(cssselector)) {
                        let style = document.createElement('style');
                        style.setAttribute('for', cssselector);
                        let html_stylesheets = "";
                        for (let style of stylesheets)
                            for (let rule of style.cssRules)
                                html_stylesheets += rule.cssText + '\n';
                        style.innerHTML = html_stylesheets.replace(':host', `:is(${cssselector})`);
                        document.head.append(style);
                        alreadyDeclaredCSS.add(cssselector);
                    }
                }
            }
            // content
            if (content !== undefined) {
                let template_elem = document.createElement('template');
                let str = content.replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match) ?? '');
                template_elem.innerHTML = str;
                this.#content.append(...template_elem.content.childNodes);
            }
            // build
            // h4ck, okay because JS is monothreaded.
            __cstr_host = this;
            let obj = new Liss();
            if (obj instanceof Promise)
                obj = await obj;
            this.#API = obj;
            // default slot
            if (this.hasShadow && this.#content.childNodes.length === 0)
                this.#content.append(document.createElement('slot'));
            if (this.#resolve !== null)
                this.#resolve(this.#API);
            return this.#API;
        }
        get params() {
            return this.#params;
        }
        /*** content ***/
        #content = null;
        get content() {
            return this.#content;
        }
        getPart(name) {
            return this.hasShadow
                ? this.#content?.querySelector(`::part(${name})`)
                : this.#content?.querySelector(`[part="${name}"]`);
        }
        getParts(name) {
            return this.hasShadow
                ? this.#content?.querySelectorAll(`::part(${name})`)
                : this.#content?.querySelectorAll(`[part="${name}"]`);
        }
        get hasShadow() {
            return shadow !== 'none';
        }
        /*** CSS ***/
        get CSSSelector() {
            return this.hasShadow
                ? this.tagName
                : `${this.tagName}[is="${this.getAttribute("is")}"]`;
        }
        /*** attrs ***/
        #attrs_flag = false;
        #attributes = {};
        #attributesDefaults = {};
        #attrs = new Attributes(this.#attributes, this.#attributesDefaults, (name, value) => {
            this.#attributes[name] = value;
            this.#attrs_flag = true; // do not trigger onAttrsChanged.
            if (value === null)
                this.removeAttribute(name);
            else
                this.setAttribute(name, value);
        });
        setAttrDefault(name, value) {
            if (value === null)
                delete this.#attributesDefaults[name];
            else
                this.#attributesDefaults[name] = value;
        }
        get attrs() {
            return this.#attrs;
        }
        static observedAttributes = attributes;
        attributeChangedCallback(name, oldValue, newValue) {
            if (this.#attrs_flag) {
                this.#attrs_flag = false;
                return;
            }
            this.#attributes[name] = newValue;
            if (!this.isInit)
                return;
            if (this.#API.onAttrChanged(name, oldValue, newValue) === false) {
                this.#attrs[name] = oldValue; // revert the change.
            }
        }
    }
    ;
    return LISSHostBase;
}
// ================================================
// =============== LISS define ====================
// ================================================
const _DOMContentLoaded = new Promise((resolve) => {
    if (document.readyState === "interactive" || document.readyState === "complete")
        return resolve();
    document.addEventListener('DOMContentLoaded', () => {
        resolve();
    }, true);
});
LISS.define = async function (tagname, ComponentClass, { dependancies, params } = {}) {
    dependancies ??= [];
    params ??= {};
    const Class = ComponentClass.Parameters.host;
    let LISSBase = ComponentClass;
    let htmltag = _element2tagname(Class) ?? undefined;
    await Promise.all([_DOMContentLoaded, ...dependancies, ...LISSBase.Parameters.dependancies]);
    const LISSclass = buildLISSHost(ComponentClass, params);
    const opts = htmltag === undefined ? {}
        : { extends: htmltag };
    customElements.define(tagname, LISSclass, opts);
};
// ================================================
// =============== LISS ShadowRoot tools ==========
// ================================================
const sharedCSS = new CSSStyleSheet();
document.adoptedStyleSheets.push(sharedCSS);
LISS.insertGlobalCSSRules = function (css) {
    let css_style;
    if (css instanceof HTMLStyleElement)
        css_style = css.sheet;
    if (typeof css === "string") {
        css_style = new CSSStyleSheet();
        css_style.replaceSync(css);
    }
    for (let rule of css_style.cssRules)
        sharedCSS.insertRule(rule.cssText);
};
const DELEGATED_EVENTS = {
    "click": [],
    "dblclick": []
};
const ALREADY_PROCESSED = Symbol();
function onClickEvent(ev) {
    if (ev[ALREADY_PROCESSED] === true)
        return;
    ev[ALREADY_PROCESSED] = true;
    const handlers = DELEGATED_EVENTS[ev.type];
    for (let elem of ev.composedPath()) {
        if (elem instanceof ShadowRoot || elem === document || elem === window)
            continue;
        var target = elem;
        for (let [selector, handler] of handlers) {
            if (target.matches(selector))
                handler(ev);
        }
    }
}
LISS.insertGlobalDelegatedListener = function (event_name, selector, handler) {
    DELEGATED_EVENTS[event_name].push([selector, handler]);
};
document.addEventListener('click', onClickEvent);
document.addEventListener('dblclick', onClickEvent);
LISS.closest = function closest(selector, element) {
    while (true) {
        var result = element.closest(selector);
        if (result !== null)
            return result;
        const root = element.getRootNode();
        if (!("host" in root))
            return null;
        element = root.host;
    }
};
async function build(tagname, { params = {}, initialize = true, content = [], parent = undefined, id = undefined, classes = [], cssvars = {}, attrs = {}, data = {}, listeners = {} } = {}) {
    if (!initialize && parent === null)
        throw new Error("A parent must be given if initialize is false");
    let CustomClass = await customElements.whenDefined(tagname);
    let elem = new CustomClass(params);
    // Fix issue #2
    if (elem.tagName.toLowerCase() !== tagname)
        elem.setAttribute("is", tagname);
    if (id !== undefined)
        elem.id = id;
    if (classes.length > 0)
        elem.classList.add(...classes);
    for (let name in cssvars)
        elem.style.setProperty(`--${name}`, cssvars[name]);
    for (let name in attrs) {
        let value = attrs[name];
        if (typeof value === "boolean")
            elem.toggleAttribute(name, value);
        else
            elem.setAttribute(name, value);
    }
    for (let name in data) {
        let value = data[name];
        if (value === false)
            delete elem.dataset[name];
        else if (value === true)
            elem.dataset[name] = "";
        else
            elem.dataset[name] = value;
    }
    if (!Array.isArray(content))
        content = [content];
    elem.replaceChildren(...content);
    for (let name in listeners)
        elem.addEventListener(name, listeners[name]);
    if (parent !== undefined)
        parent.append(elem);
    if (!elem.isInit && initialize)
        return await LISS.initialize(elem);
    return await LISS.getLISS(elem);
}
LISS.build = build;
LISS.whenDefined = async function (tagname, callback) {
    await customElements.whenDefined(tagname);
    if (callback !== undefined)
        callback();
    return;
};
LISS.whenAllDefined = async function (tagnames, callback) {
    await Promise.all(tagnames.map(t => customElements.whenDefined(t)));
    if (callback !== undefined)
        callback();
};
LISS.isDefined = function (name) {
    return customElements.get(name);
};
LISS.selector = function (name) {
    if (name === undefined) // just an h4ck
        return "";
    return `:is(${name}, [is="${name}"])`;
};
LISS.getLISS = async function (element) {
    await LISS.whenDefined(LISS.getName(element));
    return element.LISS; // ensure initialized.
};
LISS.getLISSSync = function (element) {
    if (!LISS.isDefined(LISS.getName(element)))
        throw new Error(`${name} hasn't been defined yet.`);
    let host = element;
    if (!host.isInit)
        throw new Error("Instance hasn't been initialized yet.");
    return host.LISSSync;
};
LISS.initialize = async function (element) {
    await LISS.whenDefined(LISS.getName(element));
    return await element.initialize(); // ensure initialization.
};
LISS.getName = function (element) {
    const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name.includes('-'))
        throw new Error(`Element ${name} is not a WebComponent`);
    return name;
};
function _buildQS(selector, tagname_or_parent, parent = document) {
    if (tagname_or_parent !== undefined && typeof tagname_or_parent !== 'string') {
        parent = tagname_or_parent;
        tagname_or_parent = undefined;
    }
    return [`${selector}${LISS.selector(tagname_or_parent)}`, parent];
}
async function qs(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    let result = await LISS.qso(selector, parent);
    if (result === null)
        throw new Error(`Element ${selector} not found`);
    return result;
}
LISS.qs = qs;
async function qso(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null)
        return null;
    return await LISS.getLISS(element);
}
LISS.qso = qso;
async function qsa(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const promises = new Array(elements.length);
    for (let element of elements)
        promises[idx++] = LISS.getLISS(element);
    return await Promise.all(promises);
}
LISS.qsa = qsa;
async function qsc(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null)
        return null;
    return await LISS.getLISS(result);
}
LISS.qsc = qsc;
function qsSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null)
        throw new Error(`Element ${selector} not found`);
    return LISS.getLISSSync(element);
}
LISS.qsSync = qsSync;
function qsaSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const result = new Array(elements.length);
    for (let element of elements)
        result[idx++] = LISS.getLISSSync(element);
    return result;
}
LISS.qsaSync = qsaSync;
function qscSync(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null)
        return null;
    return LISS.getLISSSync(result);
}
LISS.qscSync = qscSync;
// ================================================
// =============== LISS Auto ======================
// ================================================
export class LISS_Auto extends LISS({ attributes: ["src"] }) {
    #known_tag = new Set();
    #directory;
    #sw;
    constructor() {
        super();
        this.#sw = new Promise(async (resolve) => {
            await navigator.serviceWorker.register(`./sw.js`);
            if (navigator.serviceWorker.controller)
                resolve();
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                resolve();
            });
        });
        const src = this.attrs.src;
        if (src === null)
            throw new Error("src attribute is missing.");
        this.#directory = src[0] === '.'
            ? `${window.location.pathname}/${src}`
            : src;
        new MutationObserver((mutations) => {
            for (let mutation of mutations)
                for (let addition of mutation.addedNodes)
                    if (addition instanceof Element)
                        this.#addTag(addition.tagName);
        }).observe(document, { childList: true, subtree: true });
        for (let elem of document.querySelectorAll("*"))
            this.#addTag(elem.tagName);
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
        if (js !== undefined)
            klass = js(opts);
        else if (content !== undefined)
            klass = class WebComponent extends LISS(opts) {
            };
        if (klass === null)
            throw new Error(`Missing files for WebComponent ${tagname}.`);
        return LISS.define(tagname, klass);
    }
    async #addTag(tagname) {
        tagname = tagname.toLowerCase();
        if (tagname === 'liss-auto' || tagname === 'bliss-auto' || !tagname.includes('-') || this.#known_tag.has(tagname))
            return;
        this.#known_tag.add(tagname);
        await this.#sw; // ensure SW is installed.
        const filenames = this.resources();
        const resources = await Promise.all(filenames.map(file => file.endsWith('.js')
            ? _import(`${this.#directory}/${tagname}/${file}`, true)
            : _fetchText(`${this.#directory}/${tagname}/${file}`, true)));
        const files = {};
        for (let i = 0; i < filenames.length; ++i)
            if (resources[i] !== undefined)
                files[filenames[i]] = resources[i];
        const content = files["index.html"];
        const css = files["index.css"];
        const opts = {
            ...content !== undefined && { content },
            ...css !== undefined && { css },
        };
        return this.defineWebComponent(tagname, files, opts);
    }
}
LISS.define("liss-auto", LISS_Auto);
;
export class CstmEvent extends CustomEvent {
    get type() { return super.type; }
    constructor(type, args) {
        super(type, { detail: args });
    }
}
// ================================================
// =============== LISS internal tools ============
// ================================================
async function fetchResource(resource) {
    resource = await resource;
    if (!(resource instanceof Response))
        resource = await fetch(resource);
    return await resource.text();
}
async function _fetchText(uri, isLissAuto = false) {
    const options = isLissAuto
        ? { headers: { "liss-auto": "true" } }
        : {};
    const response = await fetch(uri, options);
    if (response.status !== 200)
        return undefined;
    if (isLissAuto && response.headers.get("status") === "404")
        return undefined;
    return await response.text();
}
async function _import(uri, isLissAuto = false) {
    // test for the module existance.
    if (isLissAuto && await _fetchText(uri, isLissAuto) === undefined)
        return undefined;
    try {
        return (await import(/* webpackIgnore: true */ uri)).default;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}
// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
const HTMLCLASS_REGEX = /HTML(\w+)Element/;
const elementNameLookupTable = {
    'UList': 'ul',
    'TableCaption': 'caption',
    'TableCell': 'td', // th
    'TableCol': 'col', //'colgroup',
    'TableRow': 'tr',
    'TableSection': 'tbody', //['thead', 'tbody', 'tfoot'],
    'Quote': 'q',
    'Paragraph': 'p',
    'OList': 'ol',
    'Mod': 'ins', //, 'del'],
    'Media': 'video', // 'audio'],
    'Image': 'img',
    'Heading': 'h1', //, 'h2', 'h3', 'h4', 'h5', 'h6'],
    'Directory': 'dir',
    'DList': 'dl',
    'Anchor': 'a'
};
function _element2tagname(Class) {
    if (Class === HTMLElement)
        return null;
    let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
    return elementNameLookupTable[htmltag] ?? htmltag.toLowerCase();
}
