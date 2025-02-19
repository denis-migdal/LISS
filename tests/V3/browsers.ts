import puppeteer, {Browser} from 'npm:puppeteer@23.10.4';
import { describe } from "jsr:@std/testing/bdd";

const browserOptions = {
    "chrome" : {
        executablePath: "/snap/bin/chromium"
    },
    "firefox": {
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
    },
}

type BrowserName = keyof typeof browserOptions;

// TestSuite<unknown>
type BrowserSuite = {
    symbol : symbol,
    browser: Browser
};

export default function buildBrowsers<T extends BrowserName>(
    opts    : Record<string, any>, 
    ...names: T[]
): Record<T, BrowserSuite> {
    let result = {} as Record<T, BrowserSuite>;

    for(let name of names)
        result[name] = describe({
            name,
            ...opts,
            beforeAll: async function(this: any) {
                this.browser = await puppeteer.launch({
                    browser: name,
                    ...browserOptions[name]
                });
            },
            afterAll: async function(this: any) {
                await this.browser.close();
            }
    }) as unknown as BrowserSuite;

    return result;
}