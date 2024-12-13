import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';

const browser = await puppeteer.launch();

const page = await browser.newPage();

page
.on('console', message =>
  console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
.on('pageerror', ({ message }) => console.log(message))
.on('response', response =>
  console.log(`${response.status()} ${response.url()}`))
.on('requestfailed', request =>
  console.log(`${request.failure().errorText} ${request.url()}`))

await page.setContent(`<!DOCTYPE html><html><script type="module">
	
	import LISS from "/dist/dev/index.js";

	class X extends LISS({}) {
		constructor() {
			super();
			this.content = "xx";
		}
	}

	LISS.define("x-x", X);

	</script><body>?<x-x>A</x-x></body></html>`, {waitUntil: "domcontentloaded"});

await page.screenshot({ path: "/tmp/example.png" });

console.warn( await page.$("body"));

browser.close();

// https://pptr.dev/api/puppeteer.page.evaluate

/*
//@ts-ignore
import { JSDOM } from "jsdom";

const {window} = new JSDOM(
  `<!DOCTYPE html>
  <html lang="en">
	<head></head>
    <body>
		<my-component></my-component>
    </body>
  </html>`,
)!;


globalThis.document       = window.document;
globalThis.customElements = window.customElements;
globalThis.CSSStyleSheet  = window.CSSStyleSheet;

globalThis.document.adoptedStyleSheets = []; // else bug.

for(let key of Object.getOwnPropertyNames(window))
	if(key.startsWith("HTML") )
		(globalThis as any)[key] = window[key];

//@ts-ignore
let {default: LISS, liss} = (await import(`../src/index.ts`));

console.warn(window.customElements);
console.warn(window.customElements.getName);

//@ts-ignore
Deno.test("Name", async () => {

	class MyComponent extends LISS({}) {}


	// define the "my-component" component.
	LISS.define('my-component', MyComponent);

	/*
	let elem = await liss`my-component`;

	if( elem.host.getAttribute("is") !== "my-component") {
		throw new Error("miss");
	}
	*//*
});*/