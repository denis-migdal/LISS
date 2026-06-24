import template from "@LISS/src/utils/parsers/template";
import style from "@LISS/src/utils/parsers/style";
// TODO Ressource<>
// import { isRessourceReady, Ressource, waitRessource } from "@LISS/src/utils/network/ressource"
// + readyness
const sharedCSS = new CSSStyleSheet(); // TODO: static prop ?
export class ContentGenerator {
    // TODO: for now we assume this is ready... (cf Ressource)
    constructor({ html, css }) {
        this.prepare(html, css);
    }
    /** init content :
        - createContent : build the HTML
        - fillContent   : replace the HTML (uses createContent)
        - initContent   : initialize DOM (create shadow root + uses fillContent + CSS)
    **/
    initContent(target, mode) {
        let content = target;
        if (mode !== null) {
            content = target.attachShadow({ mode });
            content.adoptedStyleSheets.push(sharedCSS, ...this.stylesheets);
        }
        this.fillContent(content);
        return content;
    }
    fillContent(target) {
        if (this.template !== null)
            target.replaceChildren(this.createContent());
        //TODO...
        customElements.upgrade(target);
    }
    createContent() {
        return this.template.cloneNode(true);
    }
    /** process ressources **/
    stylesheets = [];
    template = null;
    prepare(html, css) {
        if (html !== undefined)
            this.prepareTemplate(html);
        if (css !== undefined)
            this.prepareStyle(css);
    }
    prepareTemplate(html) {
        this.template = template(html);
    }
    prepareStyle(css) {
        if (!Array.isArray(css))
            css = [css];
        this.stylesheets = css.map(e => style(e));
    }
}
export default function WithContent(base, { generator = ContentGenerator, mode = "open", ...generator_opts } = {}) {
    // @ts-ignore
    const gen = new generator(generator_opts);
    // @ts-ignore
    return class LISSContent extends base {
        generator = gen;
        content = gen.initContent(this, mode);
    };
}
//# sourceMappingURL=WithContent.js.map