import hljs from './highlight.min.js';
// https://highlightjs.org/download
// sql + plaintext + css + typescript + xml + bash + shell + python
// javascript (?)
// need to add "export default hljs;" at the end of the file

export function hl(code: string, language: string): string {
    return hljs.highlight(code, { language }).value;
}

type CursorPos = number|null;

export function getCursorBegPos(target: HTMLElement): CursorPos {
    return getCursorXPos(target, "start");
}

export function getCursorEndPos(target: HTMLElement): CursorPos {
    return getCursorXPos(target, "end");
}

export function getCursorXPos(target: HTMLElement, type: "start"|"end"): CursorPos {
    
    if( (target.getRootNode() as any).activeElement !== target )
        return null;

    // Chromium/FF compatibility
    const root = target.getRootNode();
    // @ts-ignore
    let selection = root.getSelection?.();
    if( selection === undefined )
        selection = window.getSelection();

    let rrange = selection!.getRangeAt(0);
    let path = [];
    let cur  = rrange[`${type}Container`];

    while(cur !== target) {
        path.push(cur); 
        cur = cur.parentNode!;
    }

    let cursor = 0;

    let children = target.childNodes;
    for(let i = path.length-1; i >= 0; --i) {
        for(let j = 0; j < children.length; ++j) {
            if( children[j] === path[i])
                break;
            cursor += children[j].textContent!.length;
        }
        children = path[i].childNodes;
    }

    let offset = rrange[`${type}Offset`];

    // https://developer.mozilla.org/en-US/docs/Web/API/Range/startOffset
    if( rrange[`${type}Container`].nodeType === Node.TEXT_NODE)
        cursor += offset;
    else {
        for(let i = 0; i < offset ; ++i)
            cursor += rrange[`${type}Container`].childNodes[i].textContent!.length;
    }

    return cursor;
}

// https://stackoverflow.com/questions/21234741/place-caret-back-where-it-was-after-changing-innerhtml-of-a-contenteditable-elem
export function getCursorPos(target: HTMLElement): CursorPos {

    return getCursorBegPos(target);
}
export function setCursorPos(target: HTMLElement, cursor: CursorPos) {

    if( cursor === null)
        return;

    let cur: Node = target;

    while(cur.nodeType !== Node.TEXT_NODE) {
        if( cur.childNodes.length === 0)
            break;

        for( let i = 0; i < cur.childNodes.length; ++i ) {
            const clen = cur.childNodes[i].textContent!.length;
            if( cursor <= clen ) {
                cur = cur.childNodes[i];
                break;
            }
            cursor -= clen;
        }
    }

    var range = document.createRange();
    var sel = window.getSelection()!;
    range.setStart(cur, cursor);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

}


export function initContentEditableCode(target: HTMLElement) {

    const lang = target.getAttribute('lang') ?? "plaintext";

    target.setAttribute("spellcheck", "false");
    target.innerHTML = hl(target.textContent!, lang);

    target.addEventListener("input", (ev) => {

        const lang = target.getAttribute('lang') ?? "plaintext";
        
        const ev_target = ev.target as HTMLElement;

        const cursor_pos = getCursorPos(ev_target);

        ev_target.innerHTML = hl(ev_target.textContent!, lang);

        setCursorPos(ev_target, cursor_pos);

    });

    // Tabulation key
    // @ts-ignore
    target.addEventListener("keydown", (ev: KeyboardEvent) => {
        if(ev.code === "Tab") {
            ev.preventDefault();

            // https://stackoverflow.com/questions/2237497/make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div-and-not-blur
            var doc = target.ownerDocument.defaultView!;
            var sel = doc.getSelection()!;
            var range = sel.getRangeAt(0);

            var tabNode = document.createTextNode("\t");
            range.insertNode(tabNode);

            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode); 
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });
}