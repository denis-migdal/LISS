// example : playground v3 (?)
    // liss-version="v3"
    // liss-v3="auto" (c'est la v3 qu'il faut utiliser)

// TODO: in playground brython src only if brython
// TODO: remove v2 (autodir) + v2 fcts

// DOCS
    // doc/fr/auto.md
    // Ctrler/LifeCycle
    // doc/en (obs ?)
    // README.md

// TODO: auto-mode (all with auto...)
    // TODO: true auto-mode in tests (change Brython...)
        // testv3
            // default HTML in test if (null)...
            // like playground (?) => different file for cleaner code ?
    // files="js,ts,bry,html" - default (html+css+js) ?

// docs (+ examples playground/tests // Bry/JS).
    // non-auto first.
        // extends (LISS Base)
        // LISS({}) opts.
        // define.
        // API... for better suggestions.
        // rules...

// TODO: contentGenerator
// TODO: docs (ofc)

// TODO: utils + signals + DOMContentLoaded before... + upgrade children in cstr ?
    // build
    // remove events + qs ?
    // TODO: state (internal state)
    // TODO: bliss
    // TODO: sharedCSS

// TODO: upgrade
    // TODO: get upgraded ?
    // TODO: upgrade ++ > definition order if inside child and available.
    // TODO: defined : visibility: hidden until defined ?
        // TODO: loader customElement (replaceWith ?)


// TODO: playground
    // TODO: facultative HTML in editor/playground
    // TODO: show error...
    // TODO: debounce/throttle editor...

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
export default function LISSv3<T extends Cstr<ContentGenerator> = Cstr<ContentGenerator>>(opts: Partial<LISSv3_Opts<T>> = {}) {
    
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