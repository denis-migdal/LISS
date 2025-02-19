// https://x.com/deno_land/status/1684616962553634816
// import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';
// import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import {it} from "jsr:@std/testing/bdd";
import buildTestPage from '../../src/V3/utils/tests/buildTestPage.ts';
import buildBrowsers from './browsers.ts';
import buildNewPage from "./buildNewPage.ts";

const browsers = buildBrowsers({
                                    sanitizeResources: false,
                                    sanitizeOps: false
                                },
                                "chrome",
                                //"firefox"
                            )

const PAGE_URL = "http://localhost/dist/dev/";

export default function addTest( test_name: string,
                      page_html: string,
                      callback: () => Promise<void>) {

    let browser: keyof typeof browsers;
    for( browser in browsers) {
        for(const use_brython of /*["true", */["false"]) {
            const lang = use_brython === "true" ? "bry" : "js";

            it( browsers[browser],
                `${test_name} (${browser}-${lang})`,
                async function (this: any) {

                    const page = await buildNewPage(
                        this.browser, PAGE_URL,
                        {
                            [PAGE_URL]: {
                                body: buildTestPage({
                                    liss: "./index.js",
                                    cdir: "./assets/V3/",
                                    html: page_html,
                                    js  : ``
                                }),
                                contentType: "text/html"
                            }
                        }
                    );
        
                // https://pptr.dev/api/puppeteer.page.evaluate
                await page.evaluate( callback );

                //await page.screenshot({ path: "/tmp/example.png" });
            });
        }
    }
}