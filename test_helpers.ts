// https://x.com/deno_land/status/1684616962553634816
import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';

const LISSScript = await Deno.readTextFile("./dist/dev/index.js");

let files: Record<string, {body: string, contentType: string}> = {};

files["http://localhost/dist/dev/index.js"] = {
    body: LISSScript,
    contentType: "text/javascript"
}

function generateHTMLPage(brython: string) {
    files['http://localhost/dist/dev/'] = {
        body: `<!DOCTYPE>
<html>
    <head>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.13.0/brython.min.js"></script>
        <script src="./index.js" brython="${brython}" autodir="./assets/examples/" type="module" defer></script>
    </head>
    <body>
        <!-- TODO -->
        <hello-world></hello-world>
    </body>
</html>`,
        contentType: "text/html"
    }
}

export async function test( test_name: string,
                            //...
                            callback: () => Promise<void>) {

    for(let use_brython of ["true", "false"]) {
		const lang = use_brython === "true" ? "bry" : "js";
		await Deno.test(`${test_name} (${lang})`, {
            sanitizeResources: false,
            sanitizeOps: false
        }, async() => {

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            page.on('console'      , message  => {
                    const location = message.location();

                    if(location.url === "http://localhost/favicon.ico")
                        return;

                    const location_text = `${location.url}:${location.lineNumber}`;
                    console.log(`[${message.type().substr(0, 3).toUpperCase()}] ${message.text()}\n\t${location_text}`)
                })
                .on('pageerror'    , error    => console.log(error) )
                //.on('response'     , response => console.log(`${response.status()} ${response.url()}`))
                .on('requestfailed', request  => {
                    if( new URL(request.url()).pathname === "/favicon.ico" )
                        return;
                    console.warn(new URL(request.url()).pathname);
                    console.log(`${request.failure()!.errorText} ${request.url()}`)
                })

            await page.setRequestInterception(true);
            page.on('request', async req => {
                const url = req.url();

                const path = new URL(url).pathname;
                const host = new URL(url).host;

                if( host !== "localhost" ) {
                    req.continue();
                    return;
                }

                if( path === "/favicon.ico") {
                    req.respond({
                        status: 404
                    });
                    return;
                }

                if( ! (url in files) ) {

                    const body = await Deno.readTextFile("./"+path);

                    req.respond({
                        body
                    });
                    return;
                }
                req.respond(files[url]);
            });
    
            generateHTMLPage(use_brython);

            await page.goto("http://localhost/dist/dev/", {waitUntil: "domcontentloaded"});
			
            await page.evaluate( callback );
            // https://pptr.dev/api/puppeteer.page.evaluate

            await page.screenshot({ path: "/tmp/example.png" });
            await browser.close();

		});
    }
}