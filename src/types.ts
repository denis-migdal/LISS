import type { buildLISSHost } from "./LISSHost";
import type { LISS } from "./LISSBase";

export interface Class {}

export type Constructor<T> = { new(...args:any[]): T};

export type CSS_Resource = string|Response|HTMLStyleElement|CSSStyleSheet;
export type CSS_Source   = CSS_Resource | Promise<CSS_Resource>;

export type HTML_Resource = string|Response|HTMLTemplateElement|Node;
export type HTML_Source   = HTML_Resource | Promise<HTML_Resource>;

export enum ShadowCfg {
	NONE = 'none',
	OPEN = 'open', 
	CLOSE= 'closed',
    SEMIOPEN= 'semi-open'
};

//TODO: implement ?
export enum LifeCycle {
    DEFAULT                   = 0,
	// not implemented yet
    INIT_AFTER_CHILDREN       = 1 << 1,
    INIT_AFTER_PARENT         = 1 << 2,
    // quid params/attrs ?
    RECREATE_AFTER_CONNECTION = 1 << 3, /* requires rebuild content + destroy/dispose when removed from DOM */
    /* sleep when disco : you need to implement it yourself */
}

export type ContentFactory<Attrs extends string, Params extends Record<string,any>> = ( (attrs: Record<Attrs, null|string>, params: Params, elem:HTMLElement) => Node|undefined );

// Using Constructor<T> instead of T as generic parameter
// enables to fetch static member types.
export type LISS_Opts<
    // JS Base
    ExtendsCtr extends Constructor<Class>  = Constructor<Class>,
    Params     extends Record<string, any> = Record<string, unknown>, /* RO ? */
    // HTML Base
    HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>,
    Attrs      extends string                   = string,
    > = {
        // JS Base
        extends   : ExtendsCtr,
        params    : Params,
        // non-generic
        deps      : readonly Promise<any>[],

        // HTML Base
        host   : HostCstr,
        attrs  : readonly Attrs[],
        observedAttributes: readonly Attrs[], // for vanilla compat
        // non-generic
        content?: HTML_Source,
        content_factory: (content?: Exclude<HTML_Resource, Response>) => ContentFactory<Attrs, Params>,
        css     : CSS_Source | readonly CSS_Source[],
        shadow  : ShadowCfg
}

// LISSBase

export type LISSBaseCstr<
        ExtendsCtr extends Constructor<Class>       = Constructor<Class>,
        Params     extends Record<string, any>      = Record<string, unknown>, /* RO ? */
        HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>,
        Attrs      extends string                   = string>
    = ReturnType<typeof LISS<ExtendsCtr, Params, HostCstr, Attrs>>;

export type LISSBase<
        ExtendsCtr extends Constructor<Class>       = Constructor<Class>,
        Params     extends Record<string, any>      = Record<string, unknown>, /* RO ? */
        HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>,
        Attrs      extends string                   = string>
    = InstanceType<LISSBaseCstr<ExtendsCtr, Params, HostCstr, Attrs>>;


export type LISSBase2LISSBaseCstr<T extends LISSBase> = T extends LISSBase<
            infer A extends Constructor<Class>,
            infer B,
            infer C,
            infer D> ? Constructor<T> & LISSBaseCstr<A,B,C,D> : never;


export type LISSHostCstr<T extends LISSBase|LISSBaseCstr = LISSBase> = ReturnType<typeof buildLISSHost<T extends LISSBase ? LISSBase2LISSBaseCstr<T> : T>>;
export type LISSHost    <T extends LISSBase|LISSBaseCstr = LISSBase> = InstanceType<LISSHostCstr<T>>;