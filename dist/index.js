export default function LISS(inherit = HTMLElement) {
    class ImplLISS extends inherit {
    }
    return ImplLISS;
}
let TO_DEFINE = [];
document.addEventListener('DOMContentLoaded', () => {
    for (let args of TO_DEFINE) {
        customElements.define(args[0], args[1], { extends: args[2] });
    }
});
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
LISS.define = function (tagname, CustomClass) {
    var _a;
    let Class = CustomClass;
    while (Class.name !== 'ImplLISS')
        Class = Object.getPrototypeOf(Class);
    Class = Object.getPrototypeOf(Class);
    let htmltag = undefined;
    if (Class !== HTMLElement) {
        let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
        htmltag = (_a = elementNameLookupTable[htmltag]) !== null && _a !== void 0 ? _a : htmltag.toLowerCase();
    }
    if (document.readyState === "interactive")
        customElements.define(tagname, CustomClass, { extends: htmltag });
    else
        TO_DEFINE.push([tagname, CustomClass, htmltag]);
};
