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

    readonly #content?: ShadowRoot;

    static readonly SHADOW_MODE      : "open"|"closed"|null = null;
    static readonly CONTENT_GENERATOR: ContentGenerator|null = null;

    constructor() {
        super();

        const klass = this.constructor as typeof LISSBase;

        if( klass.SHADOW_MODE !== null) {
            this.#content = this.attachShadow({mode: klass.SHADOW_MODE});
            if(klass.CONTENT_GENERATOR !== null)
                klass.CONTENT_GENERATOR.fillContent(this.content);
        }
    }
 
    // for better suggestions + 2 layer webcomponent.
    get controler(): Omit<this, keyof HTMLElement> {
        return this;
    }

    get host(): HTMLElement {
        return this;
    }

    get content(): ShadowRoot {
        if( this.#content === undefined )
            throw new Error("This custom element doesn't have a ShadowRoot!");
        return this.#content;
    }
}