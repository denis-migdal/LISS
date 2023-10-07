var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
    null, 'article', 'aside', 'blockquote', 'body', 'div',
    'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
    'nav', 'p', 'section', 'span'
];
export default function LISS(inherit = null, observedAttributes = [], dependancies = []) {
    var _ImplLISS_instances, _ImplLISS_isShadowOpen, _ImplLISS_isInit, _ImplLISS_content, _ImplLISS_init;
    if (inherit === null)
        inherit = HTMLElement;
    let hasShadow = CAN_HAVE_SHADOW.includes(element2tagname(inherit));
    //@ts-ignore cf https://github.com/microsoft/TypeScript/issues/37142
    class ImplLISS extends inherit {
        constructor(isShadowOpen = false) {
            super();
            _ImplLISS_instances.add(this);
            _ImplLISS_isShadowOpen.set(this, void 0);
            _ImplLISS_isInit.set(this, false);
            _ImplLISS_content.set(this, null);
            __classPrivateFieldSet(this, _ImplLISS_isShadowOpen, isShadowOpen, "f");
        }
        get content() {
            if (__classPrivateFieldGet(this, _ImplLISS_content, "f") === null)
                throw new Error('Access to content before initialization !');
            return __classPrivateFieldGet(this, _ImplLISS_content, "f");
        }
        get hasShadow() {
            return hasShadow;
        }
        get self() {
            if (__classPrivateFieldGet(this, _ImplLISS_content, "f") === null)
                throw new Error('Access to self before initialization !');
            return this;
        }
        assertInit() {
            if (__classPrivateFieldGet(this, _ImplLISS_isInit, "f"))
                throw new Error('Web Component is not initialized !');
        }
        static dependancies() {
            return dependancies;
        }
        connectedCallback() {
            if (__classPrivateFieldGet(this, _ImplLISS_content, "f") === null)
                __classPrivateFieldGet(this, _ImplLISS_instances, "m", _ImplLISS_init).call(this);
        }
        init() { }
        attributeChangedCallback(name, oldValue, newValue) {
            if (!__classPrivateFieldGet(this, _ImplLISS_isInit, "f"))
                return;
            this.onAttrChanged(name, oldValue, newValue);
        }
        onAttrChanged(_name, _oldValue, _newValue) {
        }
    }
    _ImplLISS_isShadowOpen = new WeakMap(), _ImplLISS_isInit = new WeakMap(), _ImplLISS_content = new WeakMap(), _ImplLISS_instances = new WeakSet(), _ImplLISS_init = function _ImplLISS_init() {
        customElements.upgrade(this);
        __classPrivateFieldSet(this, _ImplLISS_content, this, "f");
        if (hasShadow)
            __classPrivateFieldSet(this, _ImplLISS_content, this.attachShadow({ mode: __classPrivateFieldGet(this, _ImplLISS_isShadowOpen, "f") ? 'open' : 'closed' }), "f");
        this.init();
        __classPrivateFieldSet(this, _ImplLISS_isInit, true, "f");
    };
    ImplLISS.observedAttributes = observedAttributes;
    return ImplLISS;
}
let TO_DEFINE = [];
document.addEventListener('DOMContentLoaded', () => {
    for (let args of TO_DEFINE)
        define(...args);
}, true);
function define(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let dep of args[3])
            yield customElements.whenDefined(dep);
        customElements.define(args[0], args[1], { extends: args[2] });
    });
}
const HTMLCLASS_REGEX = /HTML(\w+)Element/;
// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
const elementNameLookupTable = {
    'UList': ['ul'],
    'TableCaption': ['caption'],
    'TableCell': ['th', 'td'],
    'TableCol': ['col', 'colgroup'],
    'TableRow': ['tr'],
    'TableSection': ['thead', 'tbody', 'tfoot'],
    'Quote': ['q'],
    'Paragraph': ['p'],
    'OList': ['ol'],
    'Mod': ['ins', 'del'],
    'Media': ['video', 'audio'],
    'Image': ['img'],
    'Heading': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    'Directory': ['dir'],
    'DList': ['dl'],
    'Anchor': ['a']
};
function element2tagname(Class) {
    var _a;
    if (Class === HTMLElement)
        return null;
    let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
    return (_a = elementNameLookupTable[htmltag]) !== null && _a !== void 0 ? _a : htmltag.toLowerCase();
}
LISS.define = function (tagname, CustomClass, { dependancies, withCstrParams } = {}) {
    var _a;
    dependancies !== null && dependancies !== void 0 ? dependancies : (dependancies = []);
    let Class = CustomClass;
    while (Class.name !== 'ImplLISS')
        Class = Object.getPrototypeOf(Class);
    let ImplLISSClass = Class;
    Class = Object.getPrototypeOf(Class);
    let htmltag = (_a = element2tagname(Class)) !== null && _a !== void 0 ? _a : undefined;
    if (withCstrParams !== undefined) {
        class WithCstrParams extends CustomClass {
            constructor() {
                super(...withCstrParams);
            }
        }
        CustomClass = WithCstrParams;
    }
    let args = [tagname, CustomClass, htmltag, [...dependancies, ...ImplLISSClass.dependancies()]];
    if (document.readyState === "interactive")
        define(...args);
    else
        TO_DEFINE.push(args);
};
LISS.createElement = function (tagname, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        let CustomClass = yield customElements.whenDefined(tagname);
        //if(CustomClass === undefined)
        //	throw new Error(`Tag "${tagname}" is not defined (yet)!`)
        return new CustomClass(...args);
    });
};
LISS.buildElement = function (tagname, { withCstrParams, init, content, attrs, classes, data } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        withCstrParams !== null && withCstrParams !== void 0 ? withCstrParams : (withCstrParams = []);
        let elem = yield LISS.createElement(tagname, ...withCstrParams);
        if (attrs !== undefined)
            for (let name in attrs) {
                let value = attrs[name];
                if (typeof value === "boolean")
                    elem.toggleAttribute(name, value);
                else
                    elem.setAttribute(name, value);
            }
        if (classes !== undefined)
            elem.classList.add(...classes);
        if (data !== undefined) {
            for (let name in attrs) {
                let value = attrs[name];
                if (value === false)
                    delete elem.dataset[name];
                else if (value === true)
                    elem.dataset[name] = "";
                else
                    elem.dataset[name] = value;
            }
        }
        if (content !== undefined) {
            if (!Array.isArray(content))
                content = [content];
            elem.append(...content);
        }
        if (init)
            elem.connectedCallback(); //force init ?
        return elem;
    });
};
LISS.whenDefined = function (tagname, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let cstr = yield customElements.whenDefined(tagname);
        if (callback !== undefined)
            callback(cstr);
        return cstr;
    });
};
LISS.whenAllDefined = function (tagnames, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(tagnames.map(t => customElements.whenDefined(t)));
        if (callback !== undefined)
            callback();
    });
};
