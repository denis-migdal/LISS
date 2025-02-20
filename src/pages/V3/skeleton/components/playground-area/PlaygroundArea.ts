import LISS from "V3";
import CodeBlock from "../code-block/CodeBlock";
import html from "V3/utils/parsers/html";
import getPropertyInitialValue from "V3/utils/DOM/getPropertyInitialValue";

export type Resource = {
    title: string,
    file : string,
}

const VERSION = "V3";

export const rootdir = location.host === "denis-migdal.github.io"
                            ? `/${location.pathname.split("/")[1]}`
                            : "";

// @ts-ignore
import css  from "!!raw-loader!./PlaygroundArea.css";
import LISSUpdate from "V3/LISS/LISSUpdate";
import ContentGenerator from "V3/ContentGenerators/ContentGenerator";

export default class PlaygroundArea extends LISSUpdate {

    static override readonly SHADOW_MODE       = "open";
    static override CONTENT_GENERATOR = new ContentGenerator({css});

    protected resources: Record<string, HTMLElement> = {};
    protected codes    : Record<string, CodeBlock>   = {};

    constructor() {
        super();

        const card2 =
html`<div class="card"><div class="header"><strong>Result</strong></div></div>`;

        this.#iframe = document.createElement('iframe');
        card2.append(this.#iframe);

        this.resources['output'] = card2;

        for(let res of this.klass.RESSOURCES) {

            let codeLang = res.file.slice(res.file.indexOf('.') + 1);
            if( codeLang === "bry")
                codeLang = "py";

            const code = this.codes[res.file] = new CodeBlock({codeLang})

            const card =
html`<div class="card"><div class="header"><strong>${res.title}</strong></div></div>`;

            card.append( code );

            this.resources[res.file] =  card;

        }

        const lang    = document.body.getAttribute("code-lang");
        this.#codeLang = lang ?? "js";

        this.#blocks = getPropertyInitialValue(this, "blocks")
                        ?? this.getAttribute('show')?.split(",")
                        ?? null;

        document.body.addEventListener('code-lang_changed', () => {
            const lang = document.body.getAttribute("code-lang");
            this.codeLang = lang ?? "js";
        });

        // triggers
        this.name = getPropertyInitialValue(this, "name")
                 ?? this.getAttribute('name');

        // TODO: first content load...
        for( let code in this.codes )
            this.codes[code].addEventListener('change', () => this.requestUpdate() );
    }

    override requestUpdate(): void {
        super.requestUpdate();
    }

    #codeLang: string = "js";
    get codeLang() {
        return this.#codeLang;
    }

    set codeLang(codeLang: string) {

        if( codeLang === this.#codeLang)
            return;

        this.#codeLang = codeLang;

        this.updateLayout();
        this.requestUpdate();
    }

    #iframe: HTMLIFrameElement;

    generateIFrameContent(): string {
        return "";
    }

    generateIFrameContext(): any {
        return {};
    }

    override attributeChangedCallback(name: string, _:string|null, value: string|null) {
        
        if(name === "show") {

            this.blocks = value?.split(',') ?? null;
            return;
        }

        if(name === "name") {
            this.name = value;
            return;
        }
    }

    static override observedAttributes = ["show", "name"];

    protected static ASSETS_DIR = `${rootdir}/dist/dev/assets/${VERSION}/`;
    protected static RESSOURCES = new Array<Resource>();
    
    #name: string|null = null;
    protected files: Record<string, string> = {};

    protected override onUpdate(): void {

        // required to properly reset the frame...
        // lose its state when moving in the DOM
        this.#iframe.replaceWith(this.#iframe);
        // this.#iframe.src = "about:config"

        const content = this.generateIFrameContent();

        const doc = this.#iframe.contentDocument;

        if(doc !== null) { // is null if not added to the DOM...

            /*doc.open();
            doc.write( content );
            doc.close();*/

            (this.#iframe.contentWindow as any).LISSContext = this.generateIFrameContext();
            
            this.#iframe.srcdoc = content;
        }
    }

    #blocks: string[]|null = null;

    set blocks(names: string[]|null) {
        this.#blocks = names;
        this.updateLayout();
    }

    get blocks() {
        return this.#blocks;
    }

    protected get klass() {
        return this.constructor as typeof PlaygroundArea;
    }

    get name() {
        return this.#name;
    }

    set name(name: string|null) {
        
        if( name === this.#name)
            return;

        this.#name = name;

        this.onNameChange();
    }

    async onNameChange() {

        if( this.#name !== null)
            this.files = await this.klass.loadComponentFiles(this.#name);
        else
            for(let res of this.klass.RESSOURCES)
                this.files[res.file] = "";

        this.updateLayout();

        this.fillBlocks();
    }

    protected fillBlocks() {

        for(let name in this.codes)
            this.codes[name].setCode( this.files[name] );
    }

    protected updateLayout() {

        const blocks = this.getBlocks();
        this.updateGridLayout(blocks);

        const output     = this.resources["output"];
        const output_idx = blocks.indexOf("output");

        if( output_idx === -1 || ! output.isConnected )
            return this.content.replaceChildren(...blocks.map( e => this.resources[e]));

        // do NOT move iframe, else state will be rested too soon.
        for(let child of [...this.content.children])
            if( child !== output )
                child.remove();
        
        for(let i = 0; i < output_idx; ++i)
            output.before(this.resources[blocks[i]]);

        for(let i = output_idx + 1 ; i < blocks.length; ++i)
            this.content.append( this.resources[blocks[i]] );
    }

    updateGridLayout(blocks: readonly string[]) {

        if( blocks.length == 1 )
            this.host.style.setProperty('grid', '1fr / 1fr');
        if( blocks.length >= 2  && blocks.length <= 4)
            this.host.style.setProperty('grid', 'auto / 1fr 1fr');
        if( blocks.length > 4 )
            this.host.style.setProperty('grid', 'auto / 1fr 1fr 1fr');
    }

    protected getBlocks() {

        const lang  = this.codeLang;
        const langs = this.klass.CodeLangs;

        let blocks = this.blocks;

        if( blocks === null ) {
            blocks = Object.keys(this.files).filter( e => {
                const ext = e.slice(e.indexOf(".")+1);

                return this.files[e] !== "" && (ext === lang || ! langs.includes(ext));
                
            });

            blocks.push('output')
        } else
            blocks = blocks.map( e => e.endsWith('.code') ? e.slice(0, -4) + lang : e);
        
        return blocks;
    }

    private static loadedComponentsFiles: Record<string, Record<string,string> > = {};

    private static get CodeLangs() {
        return document.body.getAttribute("code-langs")?.split(",") ?? [];
    }

    private static async loadComponentFiles(name: string) {

        let compos = this.loadedComponentsFiles[name];
        if( compos !== undefined)
            return compos;

        const compo_dir = this.ASSETS_DIR + name;

        let files: Record<string, string> = {};

        await Promise.all(this.RESSOURCES.map( async (ressource) => {

            //TODO: remove 404 (sw.js)
            const resp = await fetch(`${compo_dir}/${ressource.file}`);

            let text = "";
            if( resp.ok )
                text = await resp.text();

            files[ressource.file] = text;

        }));

        return this.loadedComponentsFiles[name] = files;
    }
}

LISS.define('playground-area', PlaygroundArea);