import html from "./parsers/html";

export default function createElement(tagname: string): HTMLElement {
    return html(`<${tagname}/>`);
}