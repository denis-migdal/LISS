// https://x.com/deno_land/status/1684616962553634816
// import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';
// import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import {it} from "jsr:@std/testing/bdd";
import buildTestPage from '../src/utils/tests/buildTestPage.ts';
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

const PAGE_URL = "http://localhost/V3/";

import { exists } from "https://deno.land/std/fs/mod.ts";

type addTest_Opts = {
    test_suffix?: string,
    page_html  ?: string|null,
    test        : (tagname: string) => Promise<void>
}

async function getHTMLPage(page_html: undefined|null|string, component_dir: string, tagname: string) {

    if( page_html === undefined ) {

        page_html = null;
        const page_html_file = component_dir + './page.html';
        if( await exists(page_html_file) )
            page_html = await Deno.readTextFile( page_html_file )
    }
    if( page_html === null )
        page_html = `<${tagname}></${tagname}>`;

    return page_html as string;
}

export async function addCodeTest({
    page_html,
    test_suffix,
    files,
    tagname,
    component_dir,
    test
}: addTest_Opts & {tagname?: string, component_dir?: string, files: "bry"|"js"|"html"|"bry,html+css"|"js,html+css"}) {

    tagname       ??= getComponentName();
    component_dir ??= getComponentDir();

    const test_name = tagname + (test_suffix ?? "");
    const callback  = test;

    const html = await getHTMLPage(page_html, component_dir, tagname);

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
                                    liss: "./libs/LISS/index.js",
                                    cdir: "./assets/",
                                    files,
                                    html,
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

export default async function addTest( {
                                            page_html,
                                            test_suffix = "",
                                            test
                                        }: addTest_Opts ) {

    const tagname       = getComponentName();
    const component_dir = getComponentDir();

    page_html = await getHTMLPage(page_html, component_dir, tagname);

    for(let files of ["js,html+css", "bry,html+css"] as const) {
        await addCodeTest({
            page_html,
            files,
            test_suffix: test_suffix + ":" + files,
            test,
            tagname,
            component_dir,
        })
    }
}