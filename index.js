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
// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
    null, 'article', 'aside', 'blockquote', 'body', 'div',
    'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
    'nav', 'p', 'section', 'span'
];
function _canHasShadow(tag) {
    return CAN_HAVE_SHADOW.includes(_element2tagname(tag));
}
export default function LISS({ attributes: p_attrs, extends: p_extends, host: p_host, dependancies: p_deps, content, css, shadow: p_shadow, } = {}) {
    const host = p_host ?? HTMLElement;
    const _extends = p_extends ?? Object;
    const attributes = p_attrs ?? [];
    const dependancies = p_deps ? [...p_deps] : [];
    const canHasShadow = _canHasShadow(host);
    const shadow = p_shadow ?? canHasShadow ? ShadowCfg.CLOSE : ShadowCfg.NONE;
    if (!canHasShadow && shadow !== ShadowCfg.NONE)
        throw new Error(`Host element ${_element2tagname(host)} does not support ShadowRoot`);
    const cwd = _getCallerDir();
    // CONTENT processing
    if (content !== undefined) {
        if (content instanceof HTMLTemplateElement) {
            content = content.innerHTML;
            content = content.trim(); // Never return a text node of whitespace as the result
            if (content === '')
                content = undefined;
        }
        else if (content instanceof URL || content.startsWith('./')) {
            if (typeof content === 'string')
                content = `${cwd}/${content}`;
            dependancies.push(new Promise(async (resolve) => {
                content = await _fetchText(content);
                resolve(LISSBase.Parameters.content = content);
            }));
        }
    }
    // CSS processing
    let stylesheets = [];
    if (css !== undefined) {
        if (!Array.isArray(css))
            css = [css];
        stylesheets = css.map((c, idx) => {
            if (c instanceof CSSStyleSheet)
                return c;
            if (c instanceof HTMLStyleElement)
                return c.sheet;
            let style = new CSSStyleSheet();
            if (!(c instanceof URL) && !c.startsWith('./')) {
                style.replace(c);
                return style;
            }
            if (typeof c === 'string')
                c = `${cwd}/${c}`;
            dependancies.push(new Promise(async (resolve) => {
                const text = await _fetchText(c);
                stylesheets[idx].replace(text);
                resolve();
            }));
            return style;
        });
    }
    // @ts-ignore
    class LISSBase extends _extends {
        #host;
        constructor(host, _params) {
            super();
            this.#host = host;
        }
        get host() {
            return this.#host; // because TS stupid.
        }
        get content() {
            return this.#host.content;
        }
        get attrs() {
            return this.#host.attrs;
        }
        static Parameters = {
            host,
            attributes,
            dependancies,
            shadow,
            stylesheets,
            content,
        };
        onAttrChanged(_name, _oldValue, _newValue) { }
    }
    return LISSBase;
}
// ================================================
// =============== LISSHost class =================
// ================================================
function buildLISSHost(Liss, withCstrParams = {}) {
    const { host, attributes, shadow, stylesheets, content } = Liss.Parameters;
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
        #setter;
        [GET](name) {
            return this.#data[name];
        }
        ;
        [SET](name, value) {
            return this.#setter(name, value); // required to get a clean object when doing {...attrs}
        }
        constructor(data, setter) {
            this.#data = data;
            this.#setter = setter;
            Object.defineProperties(this, properties);
        }
    }
    // @ts-ignore : because TS is stupid.
    class LISSHostBase extends host {
        #options;
        constructor(options) {
            super();
            this.#options = options;
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
        async initialize() {
            if (!this.isInit)
                await this.force_init();
            return this.#API;
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
        connectedCallback() {
            this.initialize();
        }
        async force_init(options = this.#options) {
            customElements.upgrade(this);
            // shadow
            this.#content = this;
            if (shadow !== 'none') {
                this.#content = this.attachShadow({ mode: shadow });
            }
            // attrs
            for (let obs of attributes)
                this.#attributes[obs] = this.getAttribute(obs);
            // css
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
                        style.innerHTML = html_stylesheets.replace(':host', cssselector);
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
            options = Object.assign({}, options, withCstrParams);
            let obj = new Liss(this, options);
            if (obj instanceof Promise)
                obj = await obj;
            this.#API = obj;
            // default slot
            if (this.hasShadow && this.#content.childNodes.length === 0)
                this.#content.append(document.createElement('slot'));
            if (this.#resolve !== null)
                this.#resolve(this.#API);
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
        #attrs = new Attributes(this.#attributes, (name, value) => {
            this.#attributes[name] = value;
            this.#attrs_flag = true; // do not trigger onAttrsChanged.
            if (value === null)
                this.removeAttribute(name);
            else
                this.setAttribute(name, value);
        });
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
LISS.define = async function (tagname, ComponentClass, { dependancies, withCstrParams } = {}) {
    dependancies ??= [];
    withCstrParams ??= {};
    const Class = ComponentClass.Parameters.host;
    let LISSBase = ComponentClass;
    let htmltag = _element2tagname(Class) ?? undefined;
    await Promise.all([_DOMContentLoaded, ...dependancies, ...LISSBase.Parameters.dependancies]);
    const LISSclass = buildLISSHost(ComponentClass, withCstrParams);
    customElements.define(tagname, LISSclass, { extends: htmltag });
};
LISS.build = async function (tagname, { withCstrParams = {}, initialize = true, content = [], parent = undefined, id = undefined, classes = [], cssvars = {}, attrs = {}, data = {}, listeners = {} } = {}) {
    if (!initialize && parent === null)
        throw new Error("A parent must be given if initialize is false");
    let CustomClass = await customElements.whenDefined(tagname);
    let elem = new CustomClass(withCstrParams);
    if (id !== undefined)
        elem.id = id;
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
    return initialize
        ? await LISS.initialize(elem)
        : await LISS.getLISS(elem); // will never be called...
};
LISS.getName = function (element) {
    const name = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name.includes('-'))
        throw new Error(`Element ${name} is not a WebComponent`);
    return name;
};
LISS.getLISS = async function (element) {
    await LISS.whenDefined(LISS.getName(element));
    return element.LISS; // ensure initialized.
};
LISS.initialize = async function (element) {
    await LISS.whenDefined(LISS.getName(element));
    return await element.initialize(); // ensure initialization.
};
LISS.qs = async function (selector, parent = document) {
    let result = await LISS.qso(selector, parent);
    if (result === null)
        throw new Error(`Element ${selector} not found`);
    return result;
};
LISS.qso = async function (selector, parent = document) {
    if (selector === '')
        return null;
    const element = parent.querySelector(selector);
    if (element === null)
        return null;
    return await LISS.getLISS(element);
};
LISS.qsa = async function (selector, parent = document) {
    if (selector === '')
        return [];
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const promises = new Array(elements.length);
    for (let element of elements)
        promises[idx++] = LISS.getLISS(element);
    return await Promise.all(promises);
};
LISS.closest = async function (selector, currentElement) {
    const element = currentElement.closest(selector);
    if (element === null)
        return null;
    return await LISS.getLISS(element);
};
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
LISS.getLISSSync = function (element) {
    if (!LISS.isDefined(LISS.getName(element)))
        throw new Error(`${name} hasn't been defined yet.`);
    let host = element;
    if (!host.isInit)
        throw new Error("Instance hasn't been initialized yet.");
    return host.LISSSync;
};
LISS.qsSync = function (selector, parent = document) {
    const element = parent.querySelector(selector);
    if (element === null)
        throw new Error(`Element ${selector} not found`);
    return LISS.getLISSSync(element);
};
LISS.qsaSync = function (selector, parent = document) {
    if (selector === '')
        return [];
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const result = new Array(elements.length);
    for (let element of elements)
        result[idx++] = LISS.getLISSSync(element);
    return result;
};
LISS.closestSync = async function (selector, currentElement) {
    const element = currentElement.closest(selector);
    if (element === null)
        return null;
    return LISS.getLISSSync(element);
};
// ================================================
// =============== LISS Auto ======================
// ================================================
class LISS_Auto extends LISS({ attributes: ["src"] }) {
    #known_tag = new Set();
    #directory;
    #sw;
    constructor(htmltag) {
        super(htmltag);
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
    async #addTag(tagname) {
        tagname = tagname.toLowerCase();
        if (tagname === 'liss-auto' || !tagname.includes('-') || this.#known_tag.has(tagname))
            return;
        this.#known_tag.add(tagname);
        await this.#sw; // ensure SW is installed.
        const results = await Promise.all([
            _import(`${this.#directory}/${tagname}/index.js`, true),
            _fetchText(`${this.#directory}/${tagname}/index.html`, true),
            _fetchText(`${this.#directory}/${tagname}/index.css`, true),
        ]);
        const js = results[0];
        const content = results[1];
        const css = results[2];
        if (js === undefined) { // no JS
            if (content === undefined)
                throw new Error(`No JS or HTML files found for WebComponent ${tagname}.`);
            class WebComponent extends LISS({
                content,
                css
            }) {
            }
            return LISS.define(tagname, WebComponent);
        }
        return LISS.define(tagname, js({ content, css }));
    }
}
LISS.define("liss-auto", LISS_Auto);
// ================================================
// =============== LISS internal tools ============
// ================================================
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
        return (await import(uri)).default;
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
    if (Class === HTMLElement)
        return null;
    let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
    return elementNameLookupTable[htmltag] ?? htmltag.toLowerCase();
}
// cf https://stackoverflow.com/questions/13227489/how-can-one-get-the-file-path-of-the-caller-function-in-node-js
function _getCallerDir(depth = 2) {
    const line = new Error().stack.split('\n')[depth];
    let beg = line.indexOf('@') + 1;
    let end = line.lastIndexOf('/') + 1;
    return line.slice(beg, end);
}
