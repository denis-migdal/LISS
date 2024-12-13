// deno run -A --unstable-sloppy-imports basic.test.ts
// https://x.com/deno_land/status/1684616962553634816
import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';

const LISSScript = await Deno.readTextFile("./dist/dev/index.js");

const browser = await puppeteer.launch();

const page = await browser.newPage();

await page.setRequestInterception(true);
page.on('request', req => {

	const url = req.url();

	console.warn("!", url);

	if( url === "http://localhost/") {
		
		req.respond({
			contentType: "text/html",
			body: `<!DOCTYPE html><html><script type="module">
	
	import LISS from "http://localhost/dist/dev/index.js";

	class X extends LISS({}) {
		constructor() {
			super();
			this.content.textContent = "xx";
			this.host.textContent = "xx";
		}
	}

	LISS.define("x-x", X);

	</script><body>?<x-x>A</x-x></body></html>`
		  });
		return;
	}

  req.respond({
	contentType: "text/javascript",
    body: LISSScript
  });
});


page
.on('console', message =>
  console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
.on('pageerror', ({ message }) => console.log(message))
.on('response', response =>
  console.log(`${response.status()} ${response.url()}`))
.on('requestfailed', request =>
  console.log(`${request.failure().errorText} ${request.url()}`))

await page.goto("http://localhost/", {waitUntil: "domcontentloaded"});

//await page.setContent(, {waitUntil: "domcontentloaded"});

await page.screenshot({ path: "/tmp/example.png" });

console.warn( await page.$("body"));

console.warn("C", await page.evaluate(`
    document.querySelector('x-x').textContent;
  `) );

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