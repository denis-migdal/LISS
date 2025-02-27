import ContentGenerator from "@LISS/src/ContentGenerators/ContentGenerator";
import LISSFull         from "@LISS/src/LISSClasses/LISSFull";
import LISSBase from "./LISSClasses/LISSBase";

type Cstr<T> = new(...args:any[]) => T
type LISSv3_Opts<T extends Cstr<ContentGenerator> > = {
    content_generator: T,
    shadow           : "null"|"open"|"closed"
} & ConstructorParameters<T>[0];

//  builder
function LISS<
        T extends Cstr<ContentGenerator> = Cstr<ContentGenerator>,
        U extends typeof LISSBase        = typeof LISSFull
    >
    (opts: Partial<LISSv3_Opts<T>> = {}, base?: U): U {
    
    base ??= LISSFull as unknown as U;

    const content_generator = opts.content_generator ?? ContentGenerator;
    // @ts-ignore
    const generator: ContentGenerator = new content_generator(opts);
    
    let shadow = opts.shadow;
    if( shadow === undefined)
        shadow = "open"

    // @ts-ignore
    return class LISSBase extends base {

        // TODO: no content if... ???
        // override attachShadow  ???
        static override readonly SHADOW_MODE       = shadow;
        static override readonly CONTENT_GENERATOR = generator;

    }
}

// used for plugins.
export class ILISS {}
export default LISS as typeof LISS & ILISS;