import { Class, Constructor, LISS_Opts, LISSBaseCstr } from "./types";
import {LISS as _LISS} from "./LISSBase";

export class ILISS {}

export default LISS as typeof LISS & ILISS;

// extends signature
export function LISS<
    ExtendsCstr_Base extends Constructor<Class>,
    Params_Base      extends Record<string, any>,
    HostCstr_Base    extends Constructor<HTMLElement>,
    Attrs_Base       extends string,

    BaseCstr extends LISSBaseCstr<ExtendsCstr_Base, Params_Base, HostCstr_Base, Attrs_Base>,

    // TODO: add constraints...
    Params   extends Record<string, any> = {},
    HostCstr extends Constructor<HTMLElement> = Constructor<HTMLElement>,
    Attrs    extends string                   = never>(opts: Partial<LISS_Opts<BaseCstr, Params, HostCstr, Attrs>>): LISSBaseCstr
// LISSBase signature
export function LISS<
	ExtendsCtr extends Constructor<Class>  = Constructor<Class>,
	Params     extends Record<string, any> = {}, //Record<string, unknown>, /* RO ? */
	// HTML Base
	HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>,
	Attrs      extends string                   = never, //string,
>(opts?: Partial<LISS_Opts<ExtendsCtr, Params, HostCstr, Attrs>>): LISSBaseCstr<ExtendsCtr, Params, HostCstr, Attrs>
export function LISS(opts: any): LISSBaseCstr
{
    if( opts.extends !== undefined && "Host" in opts.extends ) // we assume this is a LISSBaseCstr
        return _extends(opts);

    return _LISS(opts);
}

function _extends<
    ExtendsCstr_Base extends Constructor<Class>,
    Params_Base      extends Record<string, any>,
    HostCstr_Base    extends Constructor<HTMLElement>,
    Attrs_Base       extends string,

    BaseCstr extends LISSBaseCstr<ExtendsCstr_Base, Params_Base, HostCstr_Base, Attrs_Base>,
    
    // TODO: add constraints...
    Params   extends Record<string, any> = {},
    HostCstr extends Constructor<HTMLElement> = Constructor<HTMLElement>,
    Attrs    extends string                   = never>(opts: Partial<LISS_Opts<BaseCstr, Params, HostCstr, Attrs>>) {

    if( opts.extends === undefined) // h4ck
        throw new Error('please provide a LISSBase!');

    const base = opts.extends.LISSCfg;

    const host = opts.host ?? base.host;

    let deps = base.deps;
    if( opts.deps !== undefined)
        deps = [...deps, ...opts.deps];

    let attrs = base.attrs as readonly (Attrs|Attrs_Base)[];
    if( opts.attrs !== undefined)
        attrs = [...attrs, ...opts.attrs];

    let params = base.params;
    if( opts.params !== undefined)
        params = Object.assign(params, opts.params);

    //TODO: issues with async content/CSS + some edge cases...
    let content_factory = base.content_factory as any;
    if( opts.content !== undefined )
        // @ts-ignore
        content_factory = opts.content_factory!( opts.content );

    let stylesheets = base.stylesheets;
    if( opts.css !== undefined )
        // @ts-ignore
        stylesheets = [...stylesheets, ...opts.css];

    const shadow = opts.shadow ?? base.shadow;

    class ExtendedLISS extends opts.extends {

        static override readonly LISSCfg = {
			host,
			deps,
			attrs,
			params,
			content_factory,
			stylesheets,
			shadow,
		};

        //TODO: fix types...
    }

    return ExtendedLISS;
}

/*
function extendsLISS<Extends extends Class,
	Host    extends HTMLElement,
	Attrs1   extends string,
	Attrs2   extends string,
	Params  extends Record<string,any>,
	T extends LISSReturnType<Extends, Host, Attrs1, Params>>(Liss: T,
		parameters: {
			shadow      ?: ShadowCfg,
			attributes  ?: readonly Attrs2[],
			dependencies?: readonly Promise<any>[]
		}) {

	const attributes   = [...Liss.Parameters.attributes  , ...parameters.attributes  ??[]];
	const dependencies = [...Liss.Parameters.dependencies, ...parameters.dependencies??[]];

	const params = Object.assign({}, Liss.Parameters, {
		attributes,
		dependencies
	});
	if( parameters.shadow !== undefined)
		params.shadow = parameters.shadow;

	// @ts-ignore : because TS stupid
	class ExtendedLISS extends Liss {
		constructor(...t: any[]) {
			// @ts-ignore : because TS stupid
			super(...t);
		}

		protected override get attrs() {
			return super.attrs as Record<Attrs2|Attrs1, string|null>;
		}

		static override Parameters = params;
	}

	return ExtendedLISS;
}
LISS.extendsLISS = extendsLISS;
*/