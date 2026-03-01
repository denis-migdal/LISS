import define from "@LISS/impl/define";
import { getCursorBegPos, getCursorEndPos, getCursorPos, hl, setCursorPos } from "../hl";

import { LISSBase } from "@LISS/impl/extensions";
import template     from "@LISS/utils/parsers/template";
import style        from "@LISS/utils/parsers/style";

import History      from "@MWL/History";
import { setValue } from "@MWL/events/signals/Signal";
import link         from "@MWL/events/links/link";

// Browsers APIs are broken...

//TODO :
// - initial input (init issue...)
// - attrs
    // - lang...
    // - ro...

type CodeState = {
    code  : string;
    cursor: number|null;
}

const HTML  = require("!!raw-loader!./index.html").default;
const CSS   = require("!!raw-loader!./index.css").default;
const THEME = require("!!raw-loader!../Tomorrow.css").default;

const DEFAULTS = {
    value: ""
}

/*
    - input : original source code / can be filled through host textContent
    - output: current  source code (can be edited)

    - onCodeChange : save cursor position + print code + restore cursor position.

    Doesn't use WithUpdate (human events are slow) + not sure we gain much when invisible.
*/
export default class CodeEditor extends LISSBase
                                .WithContent( template(HTML) )
                                .WithStyle( style(CSS), style(THEME) )
                                .WithInput (DEFAULTS)
                                .WithOutput(DEFAULTS) {

    #codeLang!: string;
    readonly #history = new History<CodeState>();
    readonly #editor  = this.content.firstElementChild! as HTMLElement;

    constructor(codeLang: string|null = null) {
        super();

        this.#initEditor(codeLang);

        link(this.parsedInput, this.outputSignal);

        this.parsedInput.addListener( () => {
            this.#history.reset();
            this.updateState( this.input.value, null );
        });
        this.updateState( this.input.value, null );
    }

    protected onIuTriggered(      code: string,
                               cursor?: number|null,
                         updateHistory: boolean = false
                        ) {

        this.updateState(code, cursor, updateHistory);
        setValue(this.outputSignal, {value: code});
    }

    // handle cursor & history
    protected updateState(        code: string,
                               cursor?: number|null,
                         updateHistory: boolean = false) {

        if( cursor === undefined)
            cursor = getCursorPos(this.#editor);

        this.#editor.innerHTML = hl(code, this.#codeLang);

        if( cursor !== null )
            setCursorPos(this.#editor, cursor);

        if( updateHistory )
            this.#history.push({code, cursor});
    }

    // init events.

    #initEditor(codeLang: string|null) {

        let attrCodeLang = this.host.getAttribute("code-lang");
        if( attrCodeLang !== null)
            codeLang = attrCodeLang;
        
        this.#codeLang = codeLang ?? "text";

        // spellchecker enabled only if text.
        this.#editor.setAttribute("spellcheck", this.#codeLang === "text"
                                                        ? "true"
                                                        : "false");

        // code content has been changed
        this.#editor.addEventListener("input", () => {
            this.onIuTriggered(this.#editor.textContent);
        });

        // special keys
        this.#editor.addEventListener("keydown", (ev: KeyboardEvent) => {

            // Browsers API are broken...

            if(ev.ctrlKey === true ) {

                // undo/redo
                if( ev.key.toLowerCase() === "z") {

                    ev.preventDefault();

                    if( ! ev.shiftKey ) { // undo
                        if( ! this.#history.prev() )
                            return;
                    } else {              // redo
                        if( ! this.#history.next() )
                            return;
                    }
                    let {code, cursor} = this.#history.currentState;
                    this.onIuTriggered(code, cursor ?? code.length, false);
                }

                return;
            }

            if( ev.code === "Tab" || ev.code === "Enter") {

                ev.preventDefault();
    
                let char!: string;

                if( ev.code === "Tab" )
                    char = "\t";
                if( ev.code === "Enter" )
                    char = '\n';

                let text = this.#editor.textContent!;
                const start = getCursorBegPos(this.#editor)!;
                const end   = getCursorEndPos(this.#editor)!;

                if( "chrome" in window ) {
                    if( char === "\n" && end === text.length)
                        char = "\n\n";
                }

                text = text.slice(0, start) + char + text.slice(end);

                this.onIuTriggered(text, start+char.length);

            }
        });
    }

    // reactif...

    static override observedAttributes = ["code-lang"];

    override attributeChangedCallback(name: string, oldVal: null|string, newVal: null|string) {
        if( oldVal === newVal )
            return;
        
        if( name === "code-lang") {

            this.#codeLang = newVal ?? "text";

            this.#editor.setAttribute("spellcheck", this.#codeLang === "text"
                                                        ? "true"
                                                        : "false");
            
            const cursor = getCursorPos(this.#editor);
            this.#editor.innerHTML = hl(this.#editor.textContent!, this.#codeLang);
            setCursorPos(this.#editor, cursor);

            return;
        }
    }
}

define(CodeEditor);

/*
class X extends LISSBase.WithInput({foo: 34}) {}
const Y = WithInput(Object, {foo: 34});


const x = new X();
x.input.foo

const y = new Y();
y.input.foo
*/