export default function getPropertyInitialValue<E extends HTMLElement,
                                                N extends keyof E,
                                                D = undefined>
                                (e: E, name: N, defaultValue?: D): D|E[N] {

    if( ! Object.hasOwn(e, name) )
        return defaultValue as D;

    const  _ = e[name];
    delete     e[name];
    return _;
}