// is

import FutureEvent from ".";

function isPageLoaded() {
    return document.readyState === "complete"
}

// promise

const {promise, resolve} = Promise.withResolvers<void>();

if( isPageLoaded() )
    resolve();
else
    document.addEventListener('load', resolve as any, true);

// future

const PageLoaded = new FutureEvent<void>(
                                promise,
                                isPageLoaded
                            );

export default PageLoaded;