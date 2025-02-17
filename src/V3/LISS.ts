import ContentGenerator from "V3/ContentGenerators/ContentGenerator";
import LISSFull from "./LISS/LISSFull";

export function getInitialValue<E extends HTMLElement, N extends keyof E>
                            (e: E, name: N): undefined|E[N]
export function getInitialValue<E extends HTMLElement, N extends keyof E, D>
                            (e: E, name: N, defaultValue: D) : D|E[N]
export function getInitialValue<E extends HTMLElement, N extends keyof E, D>
                            (e: E, name: N, defaultValue?: D): undefined|D|E[N] {

    if( ! Object.hasOwn(e, name) )
        return defaultValue;

    const  _ = e[name];
    delete     e[name];
    return _;
}

type Cstr<T> = new(...args:any[]) => T
type LISSv3_Opts<T extends Cstr<ContentGenerator> > = {
    content_generator: T,
} & ConstructorParameters<T>[0];

//  builder
export function LISS<T extends Cstr<ContentGenerator> = Cstr<ContentGenerator>>(opts: Partial<LISSv3_Opts<T>> = {}) {
    
    const content_generator = opts.content_generator ?? ContentGenerator;
    // @ts-ignore
    const generator: ContentGenerator = new content_generator(opts);
    
    return class _LISS extends LISSFull {

        // TODO: no content if... ???
        // override attachShadow  ???
        static override readonly SHADOW_MODE       = "open";
        static override readonly CONTENT_GENERATOR = generator;

    }
}

// used for plugins.
export class ILISS {}
export default LISS as typeof LISS & ILISS;