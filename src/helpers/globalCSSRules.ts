
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
