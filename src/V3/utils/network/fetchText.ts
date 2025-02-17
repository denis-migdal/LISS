// in auto-mode use ServiceWorker to hide 404 error messages.
// if playground files, use them.
export default async function fetchText(uri: string|URL, hide404: boolean = false) {

    const fetchContext = globalThis.LISSContext.fetch;
    if( fetchContext !== undefined ) {
        const path = new URL(uri, fetchContext.cwd );
        const value = fetchContext.files[path.toString()];
        if( value === "" )
            return undefined;
        if( value !== undefined)
            return value;
    }

    const options = hide404
                        ? {headers:{"liss-auto": "true"}}
                        : {};


    const response = await fetch(uri, options);
    if(response.status !== 200 )
        return undefined;

    if( hide404 && response.headers.get("status")! === "404" )
        return undefined;

    const answer = await response.text();

    if(answer === "")
        return undefined;

    return answer
}



declare global {
    var LISSContext: {
        fetch?: {
            cwd  : string,
            files: Record<string, string>
        }
    }
}