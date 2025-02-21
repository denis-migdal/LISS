import isPageLoaded from "./isPageLoaded";

export default async function whenDOMContentLoaded() {
    if( isPageLoaded() )
        return;

    const {promise, resolve} = Promise.withResolvers<void>()

	document.addEventListener('load', resolve as any, true);

    await promise;
}