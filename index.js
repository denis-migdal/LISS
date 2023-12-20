// A better implementation of LISS, more secure.
// => Now initialization possible directly in constructor
// ==> Ensure no access before initialization is possible.
// ==> API() directly generated.
// ==> fixes TS "readonly" and unitialized members.
// => now host...
// TODO: whenInit promise.
// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
    null, 'article', 'aside', 'blockquote', 'body', 'div',
    'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
    'nav', 'p', 'section', 'span'
];
export default function LISS(inherit = null, { observedAttributes, dependancies, template, css, shadowOpen } = {}) {
    const inheritClass = inherit ?? HTMLElement;
    observedAttributes ??= [];
    dependancies ??= [];
    const hasShadow = CAN_HAVE_SHADOW.includes(element2tagname(inheritClass));
    const isShadowOpen = (shadowOpen ?? false) && hasShadow;
    if (template !== undefined) {
        if (typeof template === 'string' && template[0] === '#')
            template = document.querySelector(template);
        if (template instanceof HTMLTemplateElement)
            template = template.innerHTML;
        template = template.trim(); // Never return a text node of whitespace as the result
        if (template === '')
            template = undefined;
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
    if (!hasShadow && css !== undefined) {
        for (let style of shadow_stylesheets)
            for (let rule of style.cssRules)
                html_stylesheets += rule.cssText + '\n';
    }
    class ImplLISS {
        #htmltag;
        constructor(htmltag, _options) {
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
            hasShadow,
            isShadowOpen,
            html_stylesheets,
            shadow_stylesheets,
            template
        };
        onAttrChanged(_name, _oldValue, _newValue) { }
    }
    return ImplLISS;
}
function buildImplLISSTag(Liss, withCstrParams) {
    const tagclass = Liss.Parameters.tagclass;
    const observedAttributes = Liss.Parameters.observedAttributes;
    const hasShadow = Liss.Parameters.hasShadow;
    const html_stylesheets = Liss.Parameters.html_stylesheets;
    const shadow_stylesheets = Liss.Parameters.shadow_stylesheets;
    const template = Liss.Parameters.template;
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
            if (!this.isInit)
                this.#init();
        }
        #init() {
            customElements.upgrade(this);
            // shadow
            this.#content = this;
            if (hasShadow)
                this.#content = this.attachShadow({ mode: this.#isShadowOpen ? 'open' : 'closed' });
            // attrs
            for (let obs of observedAttributes)
                this.#attributes[obs] = this.getAttribute(obs);
            // css
            if (hasShadow && shadow_stylesheets.length)
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
            const options = Object.assign({}, withCstrParams, this.#options);
            this.#API = new Liss(this, options);
            // default slot
            if (this.hasShadow && this.#content.childNodes.length === 0)
                this.#content.append(document.createElement('slot'));
        }
        get isInit() {
            return this.#API !== null;
        }
        /*** content ***/
        #content = null;
        #isShadowOpen;
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
            return hasShadow;
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
