import type { buildLISSHost } from "./LISSHost";
import type { LISS } from "./LISSBase";
import { ContentGenerator_Opts, ContentGeneratorCstr } from "./ContentGenerator";
import { LISSState } from "./state";

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

// Using Constructor<T> instead of T as generic parameter
// enables to fetch static member types.
export type LISS_Opts<
    // JS Base
    ExtendsCtr extends Constructor<Class>  = Constructor<Class>,
    // HTML Base
    HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>
    > = {
        extends: ExtendsCtr, // JS Base
        host   : HostCstr,   // HTML Host
        content_generator: ContentGeneratorCstr,
} & ContentGenerator_Opts;

// LISSBase

export type LISSBaseCstr<
        ExtendsCtr extends Constructor<Class>       = Constructor<Class>,
        HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>
    > = ReturnType<typeof LISS<ExtendsCtr, HostCstr>>;

export type LISSBase<
        ExtendsCtr extends Constructor<Class>       = Constructor<Class>,
        HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>
    > = InstanceType<LISSBaseCstr<ExtendsCtr, HostCstr>>;


export type LISSBase2LISSBaseCstr<T extends LISSBase> = T extends LISSBase<
            infer ExtendsCtr extends Constructor<Class>,
            infer HostCstr   extends Constructor<HTMLElement>
        > ? Constructor<T> & LISSBaseCstr<ExtendsCtr,HostCstr> : never;

export type LISSHostCstr<T extends LISSBase|LISSBaseCstr = LISSBase> = ReturnType<typeof buildLISSHost<T extends LISSBase ? LISSBase2LISSBaseCstr<T> : T>>;
export type LISSHost    <T extends LISSBase|LISSBaseCstr = LISSBase> = InstanceType<LISSHostCstr<T>>;

// lighter LISSHost def to avoid type issues...
export type LHost<HostCstr extends Constructor<HTMLElement> = Constructor<HTMLElement>> = {

    state  : LISSState;
    content: ShadowRoot|InstanceType<HostCstr>;

    shadowMode: ShadowCfg|null;

    CSSSelector: string;

} & InstanceType<HostCstr>;

export type LHostCstr<HostCstr extends Constructor<HTMLElement> = Constructor<HTMLElement>> = {
    new(...args: any): LHost<HostCstr>;

    Cfg: {
        host             : HostCstr,
        content_generator: ContentGeneratorCstr,
        args             : ContentGenerator_Opts
    }

    state  : LISSState;

} & HostCstr;