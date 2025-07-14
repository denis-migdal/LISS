export const WaitingDefine = new Set<string>();

export default async function define(tagname: string, Klass: new(...args:any[]) => HTMLElement) {

    //TODO: type safe
    /*if( "CONTENT_GENERATOR" in Klass ) {
        const generator = Klass.CONTENT_GENERATOR as ContentGenerator;

        if( ! generator.isReady ) {
            WaitingDefine.add(tagname);
            await generator.whenReady;
        }
    }*/

    WaitingDefine.delete(tagname);
    customElements.define(tagname, Klass);

    const p = _whenDefinedPromises.get(Klass);
    if( p !== undefined )
        p.resolve();
}


export default function isDefined(elem: string|(new(...args:any[])=>HTMLElement)): boolean {
    
    if( typeof elem === "string")
        return customElements.get(elem) !== undefined;

    return customElements.getName(elem) !== null;
}

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