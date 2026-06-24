const doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
export default function createElement(tagname) {
    return doc.createElement(tagname);
}
export function cloneNode(node, deep = false) {
    return doc.importNode(node, deep);
}
//# sourceMappingURL=createElement.js.map