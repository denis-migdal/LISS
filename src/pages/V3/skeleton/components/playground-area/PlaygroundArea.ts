import LISS from "V3";
import CodeBlock from "../code-block/CodeBlock";

type Resource = {
    lang : string, //TODO: delete
    title: string,
    file : string,
}

export const rootdir = location.host === "denis-migdal.github.io" ? `/${location.pathname.split("/")[1]}` : "";

const VERSION = "V3";

// @ts-ignore
import css  from "!!raw-loader!./PlaygroundArea.css";
import html from "V3/utils/parsers/html";

export default class PlaygroundArea extends LISS({
    css
}) {

    protected resources2: Record<string, HTMLElement> = {};
    protected codes     : Record<string, CodeBlock>   = {};

    protected resources: Record<string, {
        html  : HTMLElement,
        ctrler: CodeBlock|null
    }> = {};

    constructor(resources: readonly Resource[] = []) {
        super();

        /****/

        const card2 =
html`<div class="card"><div class="header"><strong>Result</strong></div></div>`;

        this.#iframe = document.createElement('iframe');
        card2.append(this.#iframe);

        this.resources2['output'] = card2;

        for(let res of this.klass.RESSOURCES) {

            let codeLang = res.file.slice(res.file.indexOf('.') + 1);
            if( codeLang === "bry")
                codeLang = "py";

            const code = this.codes[res.file] = new CodeBlock({codeLang})

            const card =
html`<div class="card"><div class="header"><strong>${res.title}</strong></div></div>`;

            card.append( code );

            this.resources2[res.file] =  card;

            /*
            code_api.host.addEventListener('change', () => {
                if( ! this._inUpdate )
                    this.updateResult();
            });*/
        }

        // TODO: first content load...
        for( let code in this.codes )
            this.codes[code].addEventListener('change', () => this.requestUpdate() );
        

        /*****/

        //TODO...
        document.body.addEventListener('code-lang_changed', () => {
            const lang = document.body.getAttribute("code-lang");
            this.code_lang = lang ?? "js";
        });

        const output = this.#iframe = document.createElement('iframe');
        let card = document.createElement('div');
        card.classList.add('card');

        const header = document.createElement('div');
        header.classList.add('header');

        const name = document.createElement('strong');
        name.textContent = "Result";
        header.append(name);

        card.append(header);
        card.append(output);

        this.resources['output'] = {html: card, ctrler: null};

        for(const {lang, file, title} of resources) {

            //TODO lang
            const code_api = new CodeBlock({codeLang: lang});

            const card = document.createElement('div');
            card.classList.add('card');

            const header = document.createElement('div');
            header.classList.add('header');

            const name = document.createElement('strong');
            name.textContent = title;
            header.append(name);

            card.append(header);
            card.append(code_api.host);

            this.resources[file] = {
                html  : card,
                ctrler: code_api
            };

            code_api.host.addEventListener('change', () => {
                if( ! this._inUpdate )
                    this.updateResult();
            });
        }

        //TODO...
        const lang = document.body.getAttribute("code-lang");
        this.code_lang = lang ?? "js";

        if( this.host.hasAttribute('name') )
            this.updateCodes();

    }

    #lang: string = "js";
    get code_lang() {
        return this.#lang;
    }

    set code_lang(lang: string) {

        this.#lang = lang;
        //this.host.setAttribute('code-lang', lang);

        //TODO...
        const keys = Object.keys(this.resources).filter( n => n.endsWith('.js') );
        
        for(let key of keys) {
            const file = key.slice(0, -'.js'.length);
            this.resources[`${file}.code`] = this.resources[`${file}.${lang}`];
        }

        this.updateLayout();

    }

    protected _inUpdate = false;

    setGrid(codes: readonly string[]) {

        if( codes.length == 1 )
            this.host.style.setProperty('grid', '1fr / 1fr');
        if( codes.length >= 2  && codes.length <= 4)
            this.host.style.setProperty('grid', 'auto / 1fr 1fr');
        if( codes.length > 4 )
            this.host.style.setProperty('grid', 'auto / 1fr 1fr 1fr');
    }

    updateLayout() {
        const show = this.host.getAttribute('show');

        let codes: string[] = [];
        if( show === null ) {
            codes = Object.keys(this.resources);

            const cds = codes.filter(c => c.endsWith('.code') ).map( c => c.slice(0, -4) );
            codes = codes.filter( c => ! cds.some( n => (c.endsWith('.js') || c.endsWith('.bry') ) && c.startsWith(n) ) );

        } else
            codes = show.split(',');

        this.content.replaceChildren(...codes.map( e => this.resources[e].html ));

        this.setGrid(codes);

        // h4ck
        this.updateResult();
    }

    #iframe: HTMLIFrameElement;

    async generateIFrameContent(): Promise<string|Blob> {
        return "";
    }

    async updateCodes() {

        this._inUpdate = true;

        const example = this.host.getAttribute('name')!;

        // test
        this.onExampleChange(example);

        let promises: Promise<unknown>[] = [];

        let names = new Array<string>();

        for(let file in this.resources) {

            if(file === "output")
                continue;
            if(file.endsWith('.code'))
                continue;

            const code_api = this.resources[file].ctrler!;

            promises.push( (async() => {
                const resp = await fetch(`${this.ASSETS_DIR}/${example}/${file}`);
                let text = "";
                if( resp.status === 200 ) {
                    text = await resp.text();
                    if(text !== "") {

                        if( file.endsWith(".js") )
                            file = file.slice(0, -2) + "code";
                        else if( file.endsWith(".bry") )
                            file = file.slice(0, -3) + "code";
                        
                        names.push(file);
                    }
                }
                code_api.setCode( text );
            })() );
        }

        await Promise.all(promises);
        this.updateResult();

        this._inUpdate = false;

        if( ! this.host.hasAttribute("show") ) {

            names = [...new Set(names)]; // remove .code duplicates.

            names.push("output");
            this.host.setAttribute('show', names.join(','));
        }

        this.host.dispatchEvent(new Event("change") );
    }

    getAllCodes() {
        let result: Record<string, string> = {};

        for(let key in this.resources) {
            if(key === "output")
                continue;

            result[key] = this.resources[key].ctrler!.getCode();
        }

        return result;
    }

    #lastURL: string|null = null;

    generateIFrameContext(): any {
        return {};
    }

    async updateResult() {

        const iframe = document.createElement('iframe');
        iframe.src = "about:blank";

        this.#iframe.replaceWith(iframe);
        this.#iframe = iframe;

        let content = await this.generateIFrameContent();

        /* doesn't work
        if( ! (content instanceof Blob) ) {
            content = new Blob([content], {type: "text/html"});
        }
        */
        
        if( content instanceof Blob ) {
            if(this.#lastURL !== null)
                URL.revokeObjectURL(this.#lastURL);

            this.#lastURL = iframe.src = URL.createObjectURL(content);

            return;
        }

        /**/
        // iframe.srcdoc also possible

        const doc = iframe.contentDocument!;

        // called twice ?? -> update first when it shouldn't ???
        if(doc !== null) {
            (iframe.contentWindow as any).LISSContext = this.generateIFrameContext();
            doc.open();
            doc.write( content );
            doc.close();
        }
        /**/
    }

    override attributeChangedCallback(name: string) {
        if(name === "show") {
            this.updateLayout();
            return;
        }
        if(name === "name") {
            this.updateCodes();
            return;
        }
        
        this.updateResult();
    }

    static override observedAttributes = ["show", "name"];
    
    get ASSETS_DIR() {
        return `${rootdir}/dist/dev/assets/examples`;
    };

    /*************/

    protected static ASSETS_DIR = `${rootdir}/dist/dev/assets/${VERSION}/`;
    protected static RESSOURCES = new Array<Resource>();
    
    protected name: string|null = null;
    protected files: Record<string, string> = {};

    protected override onUpdate(): void {
        console.warn("update asked");
    }

    //TODO...
    protected get codeLang() {
        return this.getAttribute("code-lang") ?? document.body.getAttribute('code-lang');
    }

    //TODO...
    protected get blocks() {
        return this.getAttribute('show')?.split(',');
    }

    protected get klass() {
        return this.constructor as typeof PlaygroundArea;
    }

    protected async onExampleChange(name: string) {

        this.name = name;
        
        this.files = await this.klass.loadComponentFiles(name);

        this.updateLayout2();

        this.fillBlocks();
    }

    protected fillBlocks() {

        for(let name in this.codes)
            this.codes[name].setCode( this.files[name] );
    }

    protected updateLayout2() {

        const blocks = this.getBlocks();
        this.updateGridLayout(blocks);

        this.content.replaceChildren(... blocks.map( b => this.resources2[b] ) );

        console.warn("=== replaced ===", [...this.content.childNodes]);
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
        if( blocks === undefined ) {
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

    //TODO call cstr + attr changed + property changed (?)
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

    /*************/
}

LISS.define('playground-area', PlaygroundArea);