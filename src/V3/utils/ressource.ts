export type Ressource<T> =
      T
    | Promise<T>
    | (T extends string         ? Promise<Response> | Response : never)
    | (T extends Array<infer E> ? Ressource<E>[]               : never);

export function isRessourceReady<T>(res: Ressource<T>|undefined): res is T|undefined {

    if( Array.isArray(res) )
        return res.every( e => isRessourceReady(res[e]) );

    return res === undefined || !(res instanceof Promise || res instanceof Response);
}

export async function waitRessource<T>(res: Ressource<T>): Promise<T> {

    if( Array.isArray(res) )
        return await Promise.all(res.map( e => waitRessource(e))) as T;

    if( res instanceof Promise)
        res = await res;

    if( res instanceof Response)
        res = await res.text() as T;

    return res as T;
}