// https://x.com/deno_land/status/1684616962553634816
// import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';
// import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import puppeteer, {Browser} from 'npm:puppeteer@23.10.4';
import { describe, it } from "jsr:@std/testing/bdd";
import buildTestPage from '../../src/V3/utils/tests/buildTestPage.ts';

// TODO: builder + move file...
const tests = {
    /**
    firefox : describe({
        name: "Firefox",
        beforeAll: async function () {
            this.browser = await puppeteer.launch({
                product: "firefox" as const,
                browser: "firefox" as const,
                executablePath: "/snap/bin/firefox",
                waitForInitialPage: true,
                args: [
                    "--wait-for-process",
                    "--wait-for-browser",
                    "--no-remote",
                    "--new-instance",
                    "--profile",
                    // rm -r it when issues...
                    "/home/demigda/snap/firefox/common/.mozilla/firefox/yqll5r1r.puppeteer",
                ]
            });
        },
        afterAll : async function () {
            await this.browser.close();
        }
    }),/**/
    chromium: describe({
        name: "Chromium",
        beforeAll: async function(this: any) {
            this.browser = await puppeteer.launch({
                //product: "chrome" as const,
                browser: "chrome" as const,
                executablePath: "/snap/bin/chromium"
            });
        },
        afterAll: async function(this: any) {
            await this.browser.close();
        }
    })
}

function generateHTMLPage(page_html: string) {
    files['http://localhost/dist/dev/'] = {
        body: buildTestPage({
            liss: "./index.js",
            cdir: "./assets/V3/",
            html: page_html,
            js  : ``
        }),
        contentType: "text/html"
    }
}

//TODO: files/move functions/etc.
const files: Record<string, {body: string, contentType: string}> = {};

files["http://localhost/dist/dev/index.js"] = {
    body       : await Deno.readTextFile("./dist/dev/index.js"),
    contentType: "text/javascript"
}

// todo : start page...

export function test( test_name: string,
                      page_html: string,
                      callback: () => Promise<void>) {

    for(const browser in tests) {

        for(const use_brython of /*["true", */["false"]) {
            const lang = use_brython === "true" ? "bry" : "js";

            it(tests[browser as keyof typeof tests], `${test_name} (${browser}-${lang})`, {
                sanitizeResources: false,
                sanitizeOps: false
            }, async function (this: any) {

                const page = await (this.browser as Browser).newPage();

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
        
                generateHTMLPage(page_html);

                await page.goto("http://localhost/dist/dev/", {waitUntil: "load"});
                
                await page.evaluate( callback );
                // https://pptr.dev/api/puppeteer.page.evaluate

                //await page.screenshot({ path: "/tmp/example.png" });
            });
        }
    }
}