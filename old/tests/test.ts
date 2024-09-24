//@ts-ignore : causes issues
import { JSDOM } from "jsdom";

const {window} = new JSDOM(
  `<!DOCTYPE html>
  <html lang="en">
    <body>
    </body>
  </html>`,
)!;

globalThis.document = window.document;
globalThis.customElements = window.customElements;
globalThis.CSSStyleSheet = window.CSSStyleSheet;

globalThis.document.adoptedStyleSheets = []; // else bug.

for(let key of Object.getOwnPropertyNames(window))
	if(key.startsWith("HTML") )
		(globalThis as any)[key] = window[key];

//@ts-ignore : causes issues
let LISS = (await import(`../index.ts`)).default;

//@ts-ignore : causes issues
Deno.test("Name", async () => {

	class MyComponent extends LISS({host: HTMLDivElement}) {}

	// define the "my-component" component.
	LISS.define('my-component', MyComponent);

	let elem = await LISS.build('my-component');

	if( elem.host.getAttribute("is") !== "my-component") {
		throw new Error("miss");
	}
})