import html from "../parsers/html";

const doc = document.implementation.createDocument(
    "http://www.w3.org/1999/xhtml",
    "html",
    null,
);

export default function createElement(tagname: string): HTMLElement {
    return doc.createElement(tagname);
    // return html(`<${tagname}/>`);
}