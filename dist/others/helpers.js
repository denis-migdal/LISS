// ================================================
// =============== LISS helpers ===================
// ================================================
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
function buildSync(tagname, { params = {}, initialize = true, content = [], parent = undefined, id = undefined, classes = [], cssvars = {}, attrs = {}, data = {}, listeners = {} } = {}) {
    if (!initialize && parent === null)
        throw new Error("A parent must be given if initialize is false");
    let CustomClass = customElements.get(tagname);
    if (CustomClass === undefined)
        throw new Error(`${tagname} not defined`);
    let elem = new CustomClass(params);
    //TODO: factorize...
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
        LISS.initializeSync(elem);
    return LISS.getLISSSync(elem);
}
LISS.buildSync = buildSync;
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
    const name = LISS.getName(element);
    if (!LISS.isDefined(name))
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
LISS.initializeSync = function (element) {
    const name = LISS.getName(element);
    if (!LISS.isDefined(name))
        throw new Error(`${name} not defined`);
    return element.initialize(); // ensure initialization.
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
//# sourceMappingURL=helpers.js.map