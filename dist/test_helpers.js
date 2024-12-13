// https://x.com/deno_land/status/1684616962553634816
import puppeteer from 'https://deno.land/x/puppeteer_plus/mod.ts';
const LISSScript = await Deno.readTextFile("./dist/dev/index.js");
let files = {};
export async function test(test_name, callback) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => {
        req.respond(files[req.url]);
    });
    files["http://localhost/dist/dev/index.js"] = {
        body: LISSScript,
        contentType: "text/javascript"
    };
    for (let use_brython of ["true", "false"]) {
        //TODO: set data/page...
        const lang = use_brython === "true" ? "bry" : "js";
        Deno.test(`${test_name} (${lang})`, { sanitizeResources: false }, async () => {
            await page.goto("http://localhost/", { waitUntil: "domcontentloaded" });
            await page.evaluate(callback);
            // https://pptr.dev/api/puppeteer.page.evaluate
        });
        //await page.screenshot({ path: "/tmp/example.png" });
    }
    browser.close();
}
//# sourceMappingURL=test_helpers.js.map