// https://x.com/deno_land/status/1684616962553634816
// import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';
// import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import {it} from "jsr:@std/testing/bdd";
import buildTestPage from '../../src/V3/utils/tests/buildTestPage.ts';
import buildBrowsers from './browsers.ts';
import buildNewPage from "./buildNewPage.ts";
import { getComponentDir, getComponentName } from "./loadFile.ts";

const browsers = buildBrowsers({
                                    sanitizeResources: false,
                                    sanitizeOps: false
                                },
                                "chrome",
                                //"firefox"
                            )

const PAGE_URL = "http://localhost/dist/dev/";

import { exists } from "https://deno.land/std/fs/mod.ts";

type addTest_Opts = {
    test_suffix?: string,
    page_html  ?: string|null,
    test        : (tagname: string) => Promise<void>
}

export default async function addTest( {
                                            page_html,
                                            test_suffix = "",
                                            test
                                        }: addTest_Opts ) {

    const tagname   = getComponentName();
    const test_name = tagname + test_suffix;
    const callback  = test;

    if( page_html === undefined ) {

        page_html = null;
        const page_html_file = getComponentDir() + './page.html';
        if( await exists(page_html_file) )
            page_html = await Deno.readTextFile( page_html_file )
    }
    if( page_html === null )
        page_html = `<${tagname}></${tagname}>`;

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