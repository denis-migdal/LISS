
// ================================================
// =============== LISS ShadowRoot tools ==========
// ================================================

const sharedCSS = new CSSStyleSheet();
document.adoptedStyleSheets.push(sharedCSS);

LISS.insertGlobalCSSRules = function(css: string|HTMLStyleElement) {

	let css_style!: CSSStyleSheet;

	if( css instanceof HTMLStyleElement )
		css_style = css.sheet!;
	if( typeof css === "string") {
		css_style = new CSSStyleSheet();
		css_style.replaceSync(css);
	}

	for(let rule of css_style.cssRules)
		sharedCSS.insertRule(rule.cssText);
}

type DelegatedHandler = [string, (ev: MouseEvent) => void];
const DELEGATED_EVENTS = {
	"click": [] as DelegatedHandler[],
	"dblclick": [] as DelegatedHandler[]
};

const ALREADY_PROCESSED = Symbol();

function onClickEvent(ev: MouseEvent) {

	if( (ev as any)[ALREADY_PROCESSED] === true )
		return;
	(ev as any)[ALREADY_PROCESSED] = true;

	const handlers = DELEGATED_EVENTS[ev.type as keyof typeof DELEGATED_EVENTS];

	for(let elem of ev.composedPath() ) {
	
		if( elem instanceof ShadowRoot || elem === document || elem === window )
			continue;

		var target = elem as Element;

		for(let [selector, handler] of handlers) {
			if( target.matches(selector) )
				handler(ev);
		}
	}
}

LISS.insertGlobalDelegatedListener = function(event_name: keyof typeof DELEGATED_EVENTS, selector: string, handler: (ev: MouseEvent) => void ) {
	DELEGATED_EVENTS[event_name].push([selector, handler])
}

document.addEventListener('click', onClickEvent);
document.addEventListener('dblclick', onClickEvent);

LISS.closest = function closest<E extends Element>(selector: string, element: Element) {

	while(true) {
		var result = element.closest<E>(selector);

		if( result !== null)
			return result;

		const root = element.getRootNode();
		if( ! ("host" in root) )
			return null;

		element = (root as ShadowRoot).host;
	}
}
