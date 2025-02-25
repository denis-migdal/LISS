export default async function executeJS<T>(code: string, origin?: string): Promise<T> {

    const file = new Blob([code], { type: 'application/javascript' });
    const url  = URL.createObjectURL(file);

    if( origin !== undefined) {
        const id = url.slice(url.lastIndexOf('/') + 1 );
        ((globalThis.LISSContext ??={}).execute ??= {url_map: {}}).url_map[id] = origin;
    }

    const result = (await import(/* webpackIgnore: true */ url));
    
    URL.revokeObjectURL(url);

    return result as unknown as T;
}


declare global {

    interface LISSContext {
        execute?: {
            url_map: Record<string, string>
        }
    }

    var LISSContext: LISSContext;
    
}