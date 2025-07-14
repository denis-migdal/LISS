import FutureEvent from ".";

// promise

const {promise, resolve} = Promise.withResolvers<void>()

if( isDOMContentLoaded() )
    resolve();
else
    document.addEventListener('DOMContentLoaded', resolve as any, true);

// is

function isDOMContentLoaded() {
    return document.readyState === "interactive" || document.readyState === "complete"
}

// future

const DOMContentLoaded = new FutureEvent<void>(
                                promise,
                                isDOMContentLoaded
                            );

export default DOMContentLoaded;