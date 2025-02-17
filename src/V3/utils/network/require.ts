import fetchText from "./fetchText";

// @ts-ignore
globalThis.require = async function(url: string) {
    //TODO: non playground...
    return await fetchText(url);
}