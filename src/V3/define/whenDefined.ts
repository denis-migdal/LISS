type Cstr<T> = new(...args:any[])=> T;

export const _whenDefinedPromises = new WeakMap<Cstr<HTMLElement>, PromiseWithResolvers<void>>();

export default async function whenDefined<T extends HTMLElement>(elem: string|Cstr<T>): Promise<Cstr<T>> {
    
    if( typeof elem === "string")
        return await customElements.whenDefined(elem) as Cstr<T>;

    if( customElements.getName(elem) !== null)
        return elem as Cstr<T>;

    let p = _whenDefinedPromises.get(elem);
    if( p === undefined ){
        p = Promise.withResolvers<void>();
        _whenDefinedPromises.set(elem, p);
    }

    await p.promise;
    return elem;
}