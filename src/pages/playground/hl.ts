const hljs = require('highlight.js');

export function hl(code: string, lang: string): string {
    return hljs.highlight(code, { language: lang }).value;
}

export function initContentEditableCode(target: HTMLElement, enter_lose_focus = true) {
    const language = target.getAttribute('lang')!;

    target.setAttribute("spellcheck", "false");

    target.innerHTML = hljs.highlight(target.textContent, { language }).value;
    target.addEventListener("input", (ev) => {
        
        let p = ev.target as HTMLElement;

        if( document.activeElement !== p ) {
            p.innerHTML = hljs.highlight(p.textContent, { language }).value;
            return;
        }

        // https://stackoverflow.com/questions/21234741/place-caret-back-where-it-was-after-changing-innerhtml-of-a-contenteditable-elem

        let rrange = window.getSelection()!.getRangeAt(0);

        let path = [];
        let cur  = rrange.startContainer;

        while(cur !== p) {
            path.push(cur); 
            cur = cur.parentNode!;
        }

        let length = 0;

        let children = p.childNodes;
        for(let i = path.length-1; i >= 0; --i) {
            for(let j = 0; j < children.length; ++j) {
                if( children[j] === path[i])
                    break;
                length += children[j].textContent!.length;
            }
            children = path[i].childNodes;
        }

        let offset = rrange.startOffset;

        // https://developer.mozilla.org/en-US/docs/Web/API/Range/startOffset
        if( rrange.startContainer.nodeType === Node.TEXT_NODE)
            length += offset;
        else {
            for(let i = 0; i < offset ; ++i)
                length += rrange.startContainer.childNodes[i].textContent!.length;
        }

        // Update innerHTML
        p.innerHTML = hljs.highlight(p.textContent, { language }).value;

        cur = p;
        while(cur.nodeType !== Node.TEXT_NODE) {
            for( let i = 0; i < cur.childNodes.length; ++i ) {
                const clen = cur.childNodes[i].textContent!.length;
                if( length <= clen ) {
                    cur = cur.childNodes[i];
                    break;
                }
                length -= clen;
            }
        }
        
        var range = document.createRange();
        var sel = window.getSelection()!;
        range.setStart(cur, length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
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

    // Enter Key
    if( enter_lose_focus ) {
        // @ts-ignore
        target.addEventListener("keypress", (ev: KeyboardEvent) => {
            
            if( ev.code === "Enter" && ! ev.shiftKey ) {

                ev.preventDefault();
                (ev.target as HTMLElement)!.blur();
            }
        });
    }
}