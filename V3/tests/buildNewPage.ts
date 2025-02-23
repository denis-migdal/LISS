import { Browser } from "npm:puppeteer@23.10.4";

import mime from 'npm:mime';

function getMime(path: string) {

    const pos = path.lastIndexOf('.');
    const ext = path.slice(pos+1);

    return mime.getType(ext) ?? "text/plain"
}

export default async function buildNewPage(
    browser: Browser,
    url    : string,
    files  : Record<string, {body: string, contentType: string}> = {}
) {

    const page = await browser.newPage();

    page.on('console'      , message  => {
        const location = message.location();

        if(location.url === "http://localhost/favicon.ico")
            return;

        const location_text = `${location.url}:${location.lineNumber}`;
        console.log(`[${message.type().slice(0, 3).toUpperCase()}] ${message.text()}\n\t${location_text}`)
    })
    .on('pageerror'    , error    => console.log(error) )
    //.on('response'     , response => console.log(`${response.status()} ${response.url()}`))
    .on('requestfailed', request  => {
        if( new URL(request.url()).pathname === "/favicon.ico" )
            return;
        console.warn(new URL(request.url()).pathname);
        console.log(`${request.failure()!.errorText} ${request.url()}`)
    })

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
                const body = await Deno.readTextFile("./dist/dev/"+path);

                req.respond({
                    body,
                    contentType: getMime(path)
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


    await page.setRequestInterception(true);

    await page.goto("http://localhost/V3/", {waitUntil: "load"});    

    return page;
}