import LISS from "../../../../../index";
import CodeBlock from "../code-block/CodeBlock";

type Resource = {
    lang : string,
    file : string,
    title: string,
}


export const rootdir = location.host === "denis-migdal.github.io" ? `/${location.pathname.split("/")[1]}` : "";

//TODO : path
export const ASSETS = `${rootdir}/dist/dev/assets/examples`;

// @ts-ignore
import css  from "!!raw-loader!./PlaygroundArea.css";

export default class PlaygroundArea extends LISS({
    css
}) {

    protected resources: Record<string, {
        html  : HTMLElement,
        ctrler: CodeBlock|null
    }> = {};

    constructor(resources: readonly Resource[] = []) {
        super();

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
            const code_api = new CodeBlock({lang});

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

        this.updateLayout();
        if( this.host.hasAttribute('name') )
            this.updateCodes();
    }

    protected _inUpdate = false;

    updateLayout() {
        const show = this.host.getAttribute('show');
        let codes: string[] = [];
        if( show === null )
            codes = Object.keys(this.resources);
        else
            codes = show.split(',');

        this.content.replaceChildren(...codes.map( e => this.resources[e].html ));

        if( codes.length == 1 )
            this.host.style.setProperty('grid', '1fr / 1fr');
        if( codes.length == 2 )
            this.host.style.setProperty('grid', '1fr / 1fr 1fr');
        if( codes.length == 3 )
            this.host.style.setProperty('grid', '1fr / 1fr 1fr 1fr');
        if( codes.length === 4 )
            this.host.style.setProperty('grid', 'auto / 1fr 1fr');
        if( codes.length > 4 )
            this.host.style.setProperty('grid', 'auto / 1fr 1fr 1fr');

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

        let promises: Promise<unknown>[] = [];

        let names = new Array<string>();

        for(let file in this.resources) {

            if(file === "output")
                continue;

            const code_api = this.resources[file].ctrler!;

            promises.push( (async() => {
                const resp = await fetch(`${ASSETS}/${example}/${file}`);
                let text = "";
                if( resp.status === 200 ) {
                    text = await resp.text();
                    if(text !== "") {
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

    async updateResult() {

        const iframe = document.createElement('iframe');
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
        iframe.src = "about:blank";
        // iframe.srcdoc also possible
        iframe.contentWindow!.document.open();
        iframe.contentWindow!.document.write( content );
        iframe.contentWindow!.document.close();
        /**/
    }

    override attributeChangedCallback(name: string) {
        if(name === "show")
            this.updateLayout();
        if(name === "name")
            this.updateCodes();
    }

    static override observedAttributes = ["show", "name"];
}

LISS.define('playground-area', PlaygroundArea);