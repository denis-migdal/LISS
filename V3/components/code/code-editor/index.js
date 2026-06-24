import { LISS, WithBare, WithContent, WithInput, WithOutput } from "@LISS/src/extensions";
import define from "@LISS/src/define";
import { getCursorPos, hl, setCursorPos } from "../hl";
const html = __LOAD_FILE__("./index.html");
const css = __LOAD_FILE__("./index.css");
const theme = __LOAD_FILE__("../Tomorrow.css");
class History {
    #states = new Array();
    #stateIDX = -1; // when using prev/next
    prev() {
        if (this.#stateIDX === 0)
            return false;
        --this.#stateIDX;
        return true;
    }
    next() {
        if (this.#stateIDX === this.#states.length - 1)
            return false;
        ++this.#stateIDX;
        return true;
    }
    reset() {
        this.#states.length = 0;
        this.#stateIDX = -1;
    }
    push(state) {
        this.#states[++this.#stateIDX] = state;
        this.#states.length = this.#stateIDX + 1;
    }
    get currentState() {
        return this.#states[this.#stateIDX];
    }
}
/*
    - input : original source code / can be filled through host textContent
    - output: current  source code (can be edited)

    Doesn't use WithUpdate (human events are slow) + not sure we gain much when invisible.
*/
class CodeEditor extends LISS({ html, css: [css, theme] }, WithBare, WithContent, (WithInput), (WithOutput)) {
    #history = new History();
    #output = this.content.firstElementChild;
    #codeLang = this.host.getAttribute("code-lang") ?? "text";
    constructor() {
        super();
        this.#initEditor();
        this._input.listen(() => {
            const text = this.input.value ?? "";
            this.#history.reset();
            this.onCodeChange(text, null);
        });
        this.onCodeChange(this._input.value, null);
    }
    // handle cursor & history
    onCodeChange(code, cursor) {
        code ??= "";
        if (cursor === undefined)
            cursor = getCursorPos(this.#output);
        this.printCode(code);
        if (cursor !== null)
            setCursorPos(this.#output, cursor);
        this.#history.push({ code, cursor });
    }
    // write + trigger output
    printCode(code) {
        this.#output.innerHTML = hl(code, this.#codeLang);
        this._output.value = code;
    }
    #initEditor() {
        // code content has been changed
        this.#output.addEventListener("input", () => {
            this.onCodeChange(this.#output.textContent);
        });
        // special keys
        this.#output.addEventListener("keydown", (ev) => {
            // Browsers API are broken...
            if (ev.ctrlKey === true) {
                // undo/redo
                if (ev.key.toLowerCase() === "z") {
                    ev.preventDefault();
                    if (!ev.shiftKey) { // undo
                        if (!this.#history.prev())
                            return;
                    }
                    else { // redo
                        if (!this.#history.next())
                            return;
                    }
                    let { code, cursor } = this.#history.currentState;
                    this.printCode(code);
                    setCursorPos(this.#output, cursor ?? code.length);
                }
                return;
            }
            if (ev.code === "Tab" || ev.code === "Enter") {
                ev.preventDefault();
                // https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur
                var doc = this.#output.ownerDocument.defaultView;
                var sel = doc.getSelection();
                var range = sel.getRangeAt(0);
                let char;
                if (ev.code === "Tab")
                    char = "\t";
                if (ev.code === "Enter")
                    char = '\n';
                const lastNode = document.createTextNode(char);
                range.insertNode(lastNode);
                range.setStartAfter(lastNode);
                range.setEndAfter(lastNode);
                sel.removeAllRanges();
                sel.addRange(range);
                this.onCodeChange(this.#output.textContent);
            }
        });
    }
    static observedAttributes = ["code-lang"];
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal)
            return;
        if (name === "code-lang") {
            this.#codeLang = newVal ?? "text";
            const cursor = getCursorPos(this.#output);
            this.#output.innerHTML = hl(this.#output.textContent, this.#codeLang);
            setCursorPos(this.#output, cursor);
            return;
        }
    }
}
define('code-editor', CodeEditor);
//# sourceMappingURL=index.js.map