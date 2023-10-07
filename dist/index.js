var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default function LISS(inherit = null, _ = null, dependancies = []) {
    if (inherit === null)
        inherit = HTMLElement;
    //@ts-ignore cf https://github.com/microsoft/TypeScript/issues/37142
    class ImplLISS extends inherit {
        static dependancies() {
            return dependancies;
        }
    }
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
LISS.define = function (tagname, CustomClass, { dependancies, withCstrParams } = {}) {
    var _a;
    dependancies !== null && dependancies !== void 0 ? dependancies : (dependancies = []);
    let Class = CustomClass;
    while (Class.name !== 'ImplLISS')
        Class = Object.getPrototypeOf(Class);
    let ImplLISSClass = Class;
    Class = Object.getPrototypeOf(Class);
    let htmltag = undefined;
    if (Class !== HTMLElement) {
        let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
        htmltag = (_a = elementNameLookupTable[htmltag]) !== null && _a !== void 0 ? _a : htmltag.toLowerCase();
    }
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
        yield customElements.whenDefined(tagname);
        let CustomClass = customElements.get(tagname);
        //if(CustomClass === undefined)
        //	throw new Error(`Tag "${tagname}" is not defined (yet)!`)
        return new CustomClass(...args);
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
