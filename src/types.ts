import { LISS } from "./LISSBase";

interface Class {}

export type Constructor<T> = { new(...args:any[]): T};

export type CSS_Resource = string|Response|HTMLStyleElement|CSSStyleSheet;
export type CSS_Source   = CSS_Resource | Promise<CSS_Resource>;

export type HTML_Resource = string|Response|HTMLTemplateElement;
export type HTML_Source   = HTML_Resource | Promise<HTML_Resource>;

export enum ShadowCfg {
	NONE = 'none',
	OPEN = 'open', 
	CLOSE= 'closed'
};

//TODO: implement
export enum LifeCycle {
    DEFAULT                   = 0,
	// not implemented yet
    INIT_AFTER_CHILDREN       = 1 << 1,
    INIT_AFTER_PARENT         = 1 << 2,
    // quid params/attrs ?
    RECREATE_AFTER_CONNECTION = 1 << 3, /* requires rebuild content + destroy/dispose when removed from DOM */
    /* sleep when disco : you need to implement it yourself */
}

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
        life_cycle: LifeCycle, 

        // HTML Base
        host   : HostCstr,
        attrs  : readonly Attrs[],
        observedAttributes: readonly Attrs[], // for vanilla compat
        // non-generic
        content?: HTML_Source,
        css     : CSS_Source | readonly CSS_Source[],
        shadow  : ShadowCfg
}

// get the mixins return type.
export type LISSReturnType<Opts extends LISS_Opts> = ReturnType<typeof LISS<LISS_Opts>>;

/*
type buildLISSHostReturnType<T>  = T extends LISSReturnType<infer Extends extends Class,
															infer Host    extends HTMLElement,
															infer Attrs   extends string,
															infer Params  extends Record<string,any>>
															? ReturnType<typeof buildLISSHost<Extends, Host, Attrs, Params, T>> : never;


export type LISSBase<Extends extends Class,
					 Host    extends HTMLElement,
					 Attrs   extends string,
					 Params  extends Record<string,any>> = InstanceType<LISSReturnType<Extends, Host, Attrs, Params>>;
export type LISSHost<LISS extends LISSBase<any,any,any,any> > = InstanceType<buildLISSHostReturnType<Constructor<LISS> & {Parameters: any}>>;
*/