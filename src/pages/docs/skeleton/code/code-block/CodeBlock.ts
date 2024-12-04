import LISS from "../../../../../index";
import {getCursorEndPos, getCursorPos, hl, setCursorPos} from "../hl";

// @ts-ignore
import html from "!!raw-loader!./CodeBlock.html";
// @ts-ignore
import css  from "!!raw-loader!./CodeBlock.css";
// @ts-ignore
import theme from "!!raw-loader!../themes/Tomorrow.css";


type HistoryState = {
    code  : string;
    cursor: number|null;
}

export default class CodeBlock extends LISS({
    html,
    css: [css, theme]
}) {

    readonly #output = this.content.firstElementChild! as HTMLElement;

    #history_offset = 0;
    readonly #history = new Array<HistoryState>();

    constructor({lang}: {lang?: string} = {}) {
        super();

        if(lang !== undefined)
            this.host.setAttribute("lang", lang);

        this.#initOutput();

        this.update();
    }

    getCode() {
        return this.content.textContent!;
    }

    setCode(code: string) {
        this.#history.length = 0;
        this.#history_offset = 0;

        this.#history.push({
            code,
            cursor: null
        })

        this.host.textContent = code;
        this.update();
    }

    #initOutput() {

        this.#history.push({
            code  : this.host.textContent!,
            cursor: getCursorPos(this.#output)
        })

        this.#output.addEventListener('paste', ev => {
            ev.stopImmediatePropagation();
            ev.preventDefault();

            const copied = ev.clipboardData!.getData('Text');

            const beg = getCursorPos(this.#output)!;
            const end = getCursorEndPos(this.#output)!;

            let code = this.#output.textContent!;

            this.#output.textContent = code.slice(0, beg) + copied + code.slice(end);
            
            this.#output.dispatchEvent(new Event('input') );

            setCursorPos(this.#output, beg + copied.length);
        });

        this.#output.addEventListener("input", () => {

            const code = this.#output.textContent!;
            this.host.textContent = code;

            // reset history offset
            this.#history.length -= this.#history_offset; 
            this.#history_offset = 0;

            const cursor = getCursorPos(this.#output);

            this.update();

            setCursorPos(this.#output, cursor);

            this.#history.push({
                code,
                cursor
            });
        });
    
        // Tabulation key
        // @ts-ignore
        this.#output.addEventListener("keydown", (ev: KeyboardEvent) => {

            if(this.isRO)
                return;

            if(ev.ctrlKey === true ) {

                const key = ev.key.toLowerCase();

                if( key === "z") {

                    ev.preventDefault();

                    if( ! ev.shiftKey ) {

                        if( this.#history_offset === this.#history.length - 1 )
                            return;

                        ++this.#history_offset;
                    } else {
                        
                        if( this.#history_offset === 0 )
                            return;

                        --this.#history_offset;
                    }
                    let {code, cursor} = this.#history[this.#history.length-1-this.#history_offset];
                    
                    this.host.textContent = code;
                    this.update();

                    if( cursor === null)
                        cursor = code.length;
                    setCursorPos(this.#output, cursor);
                }

                return;
            }

            let char = null;
            if( ev.code === "Tab")
                char = "\t";
            if( ev.code === "Enter")
                char = "\n";

            if( char !== null) {
                ev.preventDefault();
    
                // https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur
                var doc = this.#output.ownerDocument.defaultView!;
                var sel = doc.getSelection()!;
                var range = sel.getRangeAt(0);
    
                var tabNode = document.createTextNode(char);
                range.insertNode(tabNode);
    
                range.setStartAfter(tabNode);
                range.setEndAfter(tabNode); 
                sel.removeAllRanges();
                sel.addRange(range);

                this.#output.dispatchEvent(new Event("input"));
            }
        });
    }

    get lang() {
        return this.host.getAttribute('lang') ?? "plaintext";
    }

    get isRO() {
        return this.host.hasAttribute('ro');
    }
    set isRO(ro: boolean) {
        this.host.toggleAttribute('ro', ro);
    }

    reset() {
        
        if( this.#history.length === 1)
            return;

        this.#history.length = 1;
        this.#history_offset = 0;

        // duplicated code...
        let {code, cursor} = this.#history[this.#history.length-1-this.#history_offset];
        
        this.host.textContent = code;
        this.update();

        if( cursor === null)
            cursor = code.length;
        setCursorPos(this.#output, cursor);
    }

    update(trigger_event = true) {

        this.#output.toggleAttribute("contenteditable", ! this.isRO );

        this.#output.innerHTML = hl(this.host.textContent!, this.lang);
        if( trigger_event )
            this.host.dispatchEvent(new Event('change'));
    }

    // TODO listen content.
    static override observedAttributes = ["lang", "ro"];

    override attributeChangedCallback() {
        this.update(); //TODO: request update.
    }
}

LISS.define('code-block', CodeBlock);