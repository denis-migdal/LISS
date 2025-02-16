import ContentGenerator from "V3/ContentGenerators/ContentGenerator";

export default class LISSBase extends HTMLElement {


    /*protected getInitialValue<N extends keyof this>
                            (name: N): undefined|this[N]
    protected getInitialValue<N extends keyof this, D>
                            (name: N, defaultValue: D) : D|this[N]
    protected getInitialValue<N extends keyof this, D>
                            (name: N, defaultValue?: D): undefined|D|this[N] {
        return getInitialValue(this, name, defaultValue);
    }*/

    static readonly SHADOW_MODE      : "open"|"closed"|null = null;
    // TODO: static cache getter + use static HTML/CSS.
    static readonly CONTENT_GENERATOR: ContentGenerator|null = null;

    readonly content  : ShadowRoot|HTMLElement        = this;
    readonly host     : HTMLElement                   = this;
    readonly controler: Omit<this, keyof HTMLElement> = this;

    constructor() {
        super();

        const klass = this.constructor as typeof LISSBase;

        if( klass.CONTENT_GENERATOR !== null ) {
            this.content = klass.CONTENT_GENERATOR.initContent(this, klass.SHADOW_MODE);
            console.warn(this.tagName);
        }
    }
}