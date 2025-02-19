// https://x.com/deno_land/status/1684616962553634816
// import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';
// import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import {it} from "jsr:@std/testing/bdd";
import buildTestPage from '../../src/V3/utils/tests/buildTestPage.ts';
import buildBrowsers from './browsers.ts';
import buildNewPage from "./buildNewPage.ts";
import loadFile, { getComponentDir, getComponentName } from "./loadFile.ts";

const browsers = buildBrowsers({
                                    sanitizeResources: false,
                                    sanitizeOps: false
                                },
                                "chrome",
                                //"firefox"
                            )

const PAGE_URL = "http://localhost/dist/dev/";

import { exists } from "https://deno.land/std/fs/mod.ts";

export default async function addTest(  test_name: string|null,
                                        page_html: string|null,
                                        callback: (tagname: string) => Promise<void>) {

    const tagname = getComponentName();

    test_name ??= tagname;

    const page_html_file = getComponentDir() + './page.html';

    page_html ??= await exists(page_html_file)
                        ? await Deno.readTextFile( page_html_file )
                        : `<${tagname}></${tagname}>`;

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
                await page.evaluate( callback, tagname );

                //await page.screenshot({ path: "/tmp/example.png" });
            });
        }
    }
}