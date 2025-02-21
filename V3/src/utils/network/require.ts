import fetchText from "./fetchText";

// @ts-ignore
globalThis.require = async function(url: string) {

    const stack = new Error().stack!;

    let caller: string;
    if( stack.startsWith("Error") ) {   // Chrome ?
        caller = stack.split('\n')[1+1].slice(7);
    } else {                            // FF ?
        caller = stack.split('\n')[1].slice(1);
    }

    if( caller.startsWith('blob:') ) {

        caller = caller.slice(caller.lastIndexOf('/') + 1 );
        caller = caller.slice(0, caller.indexOf(':'));

        url = LISSContext.execute!.url_map[caller] + url;
        
        //TODO: rewrite URL...
    } else {
        console.warn( caller );
        throw new Error("require from non-blob import, unimplemented");
    }

    // TODO: reverify playground

    return await fetchText(url);
}