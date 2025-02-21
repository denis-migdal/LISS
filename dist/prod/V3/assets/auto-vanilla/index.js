const template =
      LISS.template`Hello <em>World</em>`;

const style = LISS.style`:host {
    & em { background-color: yellow; }
}`;

export default class extends HTMLElement {
    constructor() {
        super();

		const sr = this.attachShadow({
                            mode:"open"});

        sr.adoptedStyleSheets.push(style);
        sr.replaceChildren(
               template.cloneNode(true) );
    }
}