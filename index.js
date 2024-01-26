// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
    null, 'article', 'aside', 'blockquote', 'body', 'div',
    'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
    'nav', 'p', 'section', 'span'
];
export var ShadowCfg;
(function (ShadowCfg) {
    ShadowCfg[ShadowCfg["NONE"] = 0] = "NONE";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
})(ShadowCfg || (ShadowCfg = {}));
;
export default function LISS({ observedAttributes, htmlclass = null, inherit = null, dependancies, content, delayedInit = false, css, shadow } = {}) {
    const inheritClass = htmlclass ?? HTMLElement;
    const inheritObjClass = inherit ?? Object;
    observedAttributes ??= [];
    dependancies ??= [];
    const canHasShadow = CAN_HAVE_SHADOW.includes(element2tagname(inheritClass));
    shadow ??= canHasShadow ? ShadowCfg.CLOSE : ShadowCfg.NONE;
    if (!canHasShadow && shadow !== ShadowCfg.NONE) {
        console.warn('This element does not support ShadowRoot');
        shadow = ShadowCfg.NONE;
    }
    if (content !== undefined) {
        if (typeof content === 'string' && content[0] === '#')
            content = document.querySelector(content);
        if (content instanceof HTMLTemplateElement)
            content = content.innerHTML;
        content = content.trim(); // Never return a text node of whitespace as the result
        if (content === '')
            content = undefined;
    }
    let shadow_stylesheets = [];
    if (css !== undefined) {
        if (!Array.isArray(css))
            css = [css];
        shadow_stylesheets = css.map(c => {
            if (c instanceof CSSStyleSheet)
                return c;
            if (typeof c === 'string' && c[0] === '#')
                c = document.querySelector(c);
            if (c instanceof HTMLStyleElement)
                return c.sheet;
            let style = new CSSStyleSheet();
            style.replaceSync(c);
            return style;
        });
    }
    let html_stylesheets = "";
    if (!shadow && css !== undefined) {
        for (let style of shadow_stylesheets)
            for (let rule of style.cssRules)
                html_stylesheets += rule.cssText + '\n';
    }
    // @ts-ignore
    class ImplLISS extends inheritObjClass {
        #htmltag;
        constructor(htmltag, _options) {
            super();
            this.#htmltag = htmltag;
        }
        get host() {
            return this.#htmltag; // because TS stupid.
        }
        get content() {
            return this.#htmltag.content;
        }
        get attrs() {
            return this.#htmltag.attrs;
        }
        static Parameters = {
            tagclass: inheritClass,
            observedAttributes,
            dependancies,
            shadow,
            html_stylesheets,
            shadow_stylesheets,
            content,
            delayedInit,
        };
        onAttrChanged(_name, _oldValue, _newValue) { }
    }
    return ImplLISS;
}
LISS.qs = function (selector, parent = document) {
    let result = LISS.qso(selector, parent);
    if (result === null)
        throw new Error(`Element ${selector} not found`);
    return result;
};
LISS.qso = function (selector, parent = document) {
    if (selector === '')
        return null;
    return parent.querySelector(selector);
};
LISS.qsa = function (selector, parent = document) {
    if (selector === '')
        return [];
    return [...parent.querySelectorAll(selector)];
};
LISS.closest = function (selector, currentElement) {
    return currentElement.closest(selector);
};
function buildImplLISSTag(Liss, withCstrParams = {}) {
    const tagclass = Liss.Parameters.tagclass;
    const observedAttributes = Liss.Parameters.observedAttributes;
    const shadow = Liss.Parameters.shadow;
    const html_stylesheets = Liss.Parameters.html_stylesheets;
    const shadow_stylesheets = Liss.Parameters.shadow_stylesheets;
    const template = Liss.Parameters.content;
    const delayedInit = Liss.Parameters.delayedInit;
    const alreadyDeclaredCSS = new Set();
    // @ts-ignore : because TS is stupid.
    class ImplLISSTag extends tagclass {
        #options;
        constructor(options) {
            super();
            this.#options = options;
        }
        /*** init ***/
        #API = null;
        connectedCallback() {
            if (!this.isInit && !delayedInit && !this.hasAttribute('delay-liss-init'))
                this.force_init();
        }
        force_init(options = this.#options) {
            if (this.isInit)
                throw new Error('Webcomponent already initialized!');
            customElements.upgrade(this);
            // shadow
            this.#content = this;
            if (shadow) {
                this.#content = this.attachShadow({ mode: shadow });
            }
            // attrs
            for (let obs of observedAttributes)
                this.#attributes[obs] = this.getAttribute(obs);
            // css
            if (shadow && shadow_stylesheets.length)
                this.#content.adoptedStyleSheets.push(...shadow_stylesheets);
            if (html_stylesheets !== "") {
                const cssselector = this.CSSSelector;
                // if not yet inserted :
                if (!alreadyDeclaredCSS.has(cssselector)) {
                    let style = document.createElement('style');
                    style.setAttribute('for', cssselector);
                    style.innerHTML = html_stylesheets.replace(':host', cssselector);
                    document.head.append(style);
                    alreadyDeclaredCSS.add(cssselector);
                    //throw new Error('not yet implemented');
                }
            }
            // template
            if (template !== undefined) {
                let template_elem = document.createElement('template');
                let str = template.replace(/\$\{(.+?)\}/g, (_, match) => this.getAttribute(match) ?? '');
                template_elem.innerHTML = str;
                this.#content.append(...template_elem.content.childNodes);
            }
            // build
            options = Object.assign({}, options, withCstrParams);
            this.#API = new Liss(this, options);
            // default slot
            if (this.hasShadow && this.#content.childNodes.length === 0)
                this.#content.append(document.createElement('slot'));
        }
        get isInit() {
            return this.#API !== null;
        }
        get API() {
            if (!this.isInit)
                throw new Error('Accessing API before WebComponent initialization!');
            return this.#API;
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
            return !!shadow;
        }
        /*** CSS ***/
        get CSSSelector() {
            return this.hasShadow
                ? this.tagName
                : `${this.tagName}[is="${this.getAttribute("is")}"]`;
        }
        /*** attrs ***/
        #attributes = {};
        get attrs() {
            return this.#attributes;
        }
        static observedAttributes = observedAttributes;
        attributeChangedCallback(name, oldValue, newValue) {
            this.#attributes[name] = newValue;
            if (!this.isInit)
                return;
            this.#API.onAttrChanged(name, oldValue, newValue);
        }
    }
    ;
    return ImplLISSTag;
}
let TO_DEFINE = [];
document.addEventListener('DOMContentLoaded', () => {
    for (let args of TO_DEFINE)
        define(...args);
}, true);
async function define(...args) {
    for (let dep of args[3])
        await customElements.whenDefined(dep);
    const LISSclass = buildImplLISSTag(args[1], args[4]);
    customElements.define(args[0], LISSclass, { extends: args[2] });
}
const HTMLCLASS_REGEX = /HTML(\w+)Element/;
// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
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
function element2tagname(Class) {
    if (Class === HTMLElement)
        return null;
    let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
    return elementNameLookupTable[htmltag] ?? htmltag.toLowerCase();
}
LISS.define = function (tagname, CustomClass, { dependancies, withCstrParams } = {}) {
    dependancies ??= [];
    const Class = CustomClass.Parameters.tagclass;
    let ImplLISSClass = CustomClass;
    let htmltag = element2tagname(Class) ?? undefined;
    withCstrParams ??= {};
    let args = [tagname, CustomClass, htmltag, [...dependancies, ...ImplLISSClass.Parameters.dependancies], withCstrParams];
    if (document.readyState === "interactive" || document.readyState === "complete")
        define(...args);
    else
        TO_DEFINE.push(args);
};
LISS.createElement = async function (tagname, args) {
    let CustomClass = await customElements.whenDefined(tagname);
    //if(CustomClass === undefined)
    //	throw new Error(`Tag "${tagname}" is not defined (yet)!`)
    return new CustomClass(args);
};
LISS.buildElement = async function (tagname, { withCstrParams = {}, init = true, content = [], parent = undefined, id = undefined, classes = [], cssvars = {}, attrs = {}, data = {}, listeners = {} } = {}) {
    let elem = await LISS.createElement(tagname, withCstrParams);
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
    if (init)
        elem.connectedCallback(); //force init ?
    if (parent !== undefined)
        parent.append(elem);
    return elem;
};
LISS.whenDefined = async function (tagname, callback) {
    let cstr = await customElements.whenDefined(tagname);
    if (callback !== undefined)
        callback(cstr);
    return cstr;
};
LISS.whenAllDefined = async function (tagnames, callback) {
    await Promise.all(tagnames.map(t => customElements.whenDefined(t)));
    if (callback !== undefined)
        callback();
};
/**** LISS-auto ****/
class LISS_Auto extends LISS({ observedAttributes: ["src"] }) {
    #known_tag = new Set();
    #directory;
    constructor(htmltag) {
        super(htmltag);
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
        const results = await Promise.all([
            _import(`${this.#directory}/${tagname}/index.js`),
            _fetchText(`${this.#directory}/${tagname}/index.html`),
            _fetchText(`${this.#directory}/${tagname}/index.css`),
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
async function _fetchText(uri) {
    const response = await fetch(uri);
    if (response.status !== 200)
        return undefined;
    return await response.text();
}
async function _import(uri) {
    try {
        return (await import(uri)).default;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}
LISS.define("liss-auto", LISS_Auto);
