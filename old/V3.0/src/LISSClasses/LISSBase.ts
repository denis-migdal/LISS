import ContentGenerator from "@LISS/src/ContentGenerators/ContentGenerator";

export default class LISSBase extends HTMLElement {

    static readonly SHADOW_MODE      : "open"|"closed"|null = null;
    // TODO: static cache getter + use static HTML/CSS.
    static readonly CONTENT_GENERATOR: ContentGenerator|null = null;

    readonly content  : ShadowRoot|HTMLElement        = this;
    readonly host     : HTMLElement                   = this;
    readonly controler: Omit<this, keyof HTMLElement> = this;

    constructor() {
        super();

        const klass = this.constructor as typeof LISSBase;

        if( klass.CONTENT_GENERATOR !== null )
            this.content = klass.CONTENT_GENERATOR.initContent(this, klass.SHADOW_MODE);
    }


    // define for auto-complete.
    static observedAttributes: string[] = [];
    attributeChangedCallback(name: string, oldval: string|null, newval: string|null){}
}