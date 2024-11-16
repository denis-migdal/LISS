
import { getSharedCSS } from "../LISSHost";

const sharedCSS = getSharedCSS();
document.adoptedStyleSheets.push(sharedCSS); //TODO prevent multi-calls ?

import LISS from "../extends";
declare module "../extends" {
    interface ILISS {
		addGlobalCSSRules: typeof addGlobalCSSRules
    }
}

function addGlobalCSSRules(css: string|HTMLStyleElement) {

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

LISS.addGlobalCSSRules = addGlobalCSSRules;