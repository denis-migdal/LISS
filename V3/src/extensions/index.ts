import { Cstr } from "../utils/types";
import { Extension, ExtensionsArgs, ExtensionsReturn } from "./types";

// default config.
import WithBare from "./WithBare";
import WithContent from "./WithContent";

export {default as WithBare   } from "./WithBare";
export {default as WithContent} from "./WithContent";
export {default as WithInput  , getInput  } from "./WithInput";
export {default as WithOutput , getOutput } from "./WithOutput";
export {default as WithRWValue, getValue  } from "./WithRWValue";
export {default as WithMeta   , getMeta   } from "./WithMeta";
export {default as WithUpdate } from "./WithUpdate";

export const DEFAULT_EXTENSIONS = [
    WithBare,
    WithContent
];

// With
export function With<T extends Extension[]>(...extensions: T) {

    type Ext = ExtensionsReturn<T>;

    return function <E extends Cstr<HTMLElement>>(base: E,
                                                  args: ExtensionsArgs<T>)
            :  Cstr<InstanceType<Ext> & InstanceType<E>> & Omit<Ext & E, "new">
    {
        
        let cur = base;
        for(let i = 0; i < extensions.length; ++i)
            cur = extensions[i](cur, args);

        return cur as any;
    }
}

// LISS
export function LISS(
                    args: NoInfer<ExtensionsArgs<typeof DEFAULT_EXTENSIONS>>
                ) : ExtensionsReturn<typeof DEFAULT_EXTENSIONS>
export function LISS<T extends [Extension, ...Extension[]]>(
                    args: NoInfer<ExtensionsArgs<T>>,
                    ...extensions: T
                ) : ExtensionsReturn<T>
export function LISS(
                    args: Record<string, unknown>,
                    ...extensions: Extension[]
                ) :  Cstr<unknown> {

    if( extensions.length === 0)
        extensions = DEFAULT_EXTENSIONS;

    let cur = HTMLElement;
    for(let i = 0; i < extensions.length; ++i)
        cur = extensions[i](cur, args);

    return cur;
}