// https://x.com/deno_land/status/1684616962553634816
import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';

let files: Record<string, {body: string, contentType: string}> = {};

files["http://localhost/dist/dev/index.js"] = {
    body       : await Deno.readTextFile("./dist/dev/index.js"),
    contentType: "text/javascript"
}

function generateHTMLPage(page_html: string, brython: string) {
    files['http://localhost/dist/dev/'] = {
        body: `<!DOCTYPE>
<html>
    <head>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.13.0/brython.min.js"></script>
        <script>
            //TODO: recursive compare ?
            async function assertElemEquals(elem, {
                tag,
                shadow_html = null,
                css = {}
            }) {

                if( typeof elem === "string" ) {
                    tag ??= elem;
                    elem = document.querySelector(elem);
                }

                if( elem === null )
                    throw new Error("Component not found");

                await LISS.whenInitialized(elem);

                if( elem.tagName.toLowerCase() !== tag )
                    throw new Error(\`Wrong tagname.\nExpected: \${tag}\nGot: \${elem.tagName.toLowerCase()}\`);

                if( shadow_html !== elem.shadowRoot ) {
                    if( shadow_html === null || elem.shadowRoot === null )
                        throw new Error(\`ShadowRoot missing or unexpected.\`);
                    if( shadow_html !== elem.shadowRoot.innerHTML )
                        throw new Error(\`HTML content mismatched.\nExpected: \${shadow_html}\nGot: \${elem.shadowRoot.innerHTML}\`)
                }

                for(let selector in css ) {
                    const expected = css[selector];
                    const sub_elems = elem.shadowRoot.querySelectorAll(selector);
                    for( let sub_elem of sub_elems ) {
                        const css = window.getComputedStyle(sub_elem).cssText;
                        if(css !== expected)
                            throw new Error(\`CSS mismatch\nExpected:\${expected}\nGot: \${css}\`);
                    }
                }

            }
        </script>
        <script src="./index.js" brython="${brython}" autodir="./assets/examples/" type="module"></script>
    </head>
    <body>
        ${page_html}
    </body>
</html>`,
        contentType: "text/html"
    }
}

const browsers = {
    "chrome" : "/snap/bin/chromium",
    //"firefox": "/snap/bin/firefox"
}

export async function test( test_name: string,
                            page_html: string,
                            callback: () => Promise<void>) {

        

    for(let browser in browsers) {
        // @ts-ignore
        const executablePath = browsers[browser];

        for(let use_brython of ["true", "false"]) {
            const lang = use_brython === "true" ? "bry" : "js";
            await Deno.test(`${test_name} (${browser}-${lang})`, {
                sanitizeResources: false,
                sanitizeOps: false
            }, async() => {

                // launch required inside each tests...
                // @ts-ignore
                const pupet = await puppeteer.launch({product: browser, executablePath});

                // @ts-ignore
                const page = await pupet.newPage();

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

                        try {
                            const body = await Deno.readTextFile("./"+path);

                            req.respond({
                                body
                            });
                            return;
                        } catch(e) {
                            console.warn('WARN', (e as Error).message);
                            req.respond({status: 404});
                            return;
                        }
                    }
                    req.respond(files[url]);
                });
        
                generateHTMLPage(page_html, use_brython);

                await page.goto("http://localhost/dist/dev/", {waitUntil: "domcontentloaded"});
                
                await page.evaluate( callback );
                // https://pptr.dev/api/puppeteer.page.evaluate

                //await page.screenshot({ path: "/tmp/example.png" });

                await pupet.close();
            });
        }
    }
}