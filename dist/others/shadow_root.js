"use strict";
// ================================================
// =============== LISS ShadowRoot tools ==========
// ================================================
const sharedCSS = new CSSStyleSheet();
document.adoptedStyleSheets.push(sharedCSS);
LISS.insertGlobalCSSRules = function (css) {
    let css_style;
    if (css instanceof HTMLStyleElement)
        css_style = css.sheet;
    if (typeof css === "string") {
        css_style = new CSSStyleSheet();
        css_style.replaceSync(css);
    }
    for (let rule of css_style.cssRules)
        sharedCSS.insertRule(rule.cssText);
};
const DELEGATED_EVENTS = {
    "click": [],
    "dblclick": []
};
const ALREADY_PROCESSED = Symbol();
function onClickEvent(ev) {
    if (ev[ALREADY_PROCESSED] === true)
        return;
    ev[ALREADY_PROCESSED] = true;
    const handlers = DELEGATED_EVENTS[ev.type];
    for (let elem of ev.composedPath()) {
        if (elem instanceof ShadowRoot || elem === document || elem === window)
            continue;
        var target = elem;
        for (let [selector, handler] of handlers) {
            if (target.matches(selector))
                handler(ev);
        }
    }
}
LISS.insertGlobalDelegatedListener = function (event_name, selector, handler) {
    DELEGATED_EVENTS[event_name].push([selector, handler]);
};
document.addEventListener('click', onClickEvent);
document.addEventListener('dblclick', onClickEvent);
LISS.closest = function closest(selector, element) {
    while (true) {
        var result = element.closest(selector);
        if (result !== null)
            return result;
        const root = element.getRootNode();
        if (!("host" in root))
            return null;
        element = root.host;
    }
};
//# sourceMappingURL=shadow_root.js.map