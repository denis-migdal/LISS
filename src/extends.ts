import type { Class, Constructor, LISS_Opts, LISSBaseCstr, LISSHost } from "./types";
import {LISS as _LISS} from "./LISSBase";
import { buildLISSHost } from "LISSHost";

// used for plugins.
export class ILISS {}
export default LISS as typeof LISS & ILISS;

// extends signature
export function LISS<
        ExtendsCstr_Base extends Constructor<Class>,
        HostCstr_Base    extends Constructor<HTMLElement>,
        
        BaseCstr extends LISSBaseCstr<ExtendsCstr_Base, HostCstr_Base>,
        HostCstr extends Constructor<HTMLElement> = Constructor<HTMLElement>,
    >(opts: Partial<LISS_Opts<BaseCstr, HostCstr>>): LISSBaseCstr
// LISSBase signature
export function LISS<
        ExtendsCtr extends Constructor<Class>  = Constructor<Class>,
        Params     extends Record<string, any> = {}, //Record<string, unknown>, /* RO ? */
        // HTML Base
        HostCstr   extends Constructor<HTMLElement> = Constructor<HTMLElement>,
    >(opts?: Partial<LISS_Opts<ExtendsCtr, HostCstr>>): LISSBaseCstr<ExtendsCtr, HostCstr>
export function LISS(opts: any): LISSBaseCstr
{
    if( opts.extends !== undefined && "Host" in opts.extends ) // we assume this is a LISSBaseCstr
        return _extends(opts);

    return _LISS(opts);
}

function _extends<
        ExtendsCstr_Base extends Constructor<Class>,
        HostCstr_Base    extends Constructor<HTMLElement>,

        BaseCstr extends LISSBaseCstr<ExtendsCstr_Base, HostCstr_Base>,
        HostCstr extends Constructor<HTMLElement> = Constructor<HTMLElement>,
    >(opts: Partial<LISS_Opts<BaseCstr, HostCstr>>) {

    if( opts.extends === undefined) // h4ck
        throw new Error('please provide a LISSBase!');

    const cfg = opts.extends.Host.Cfg;
    opts = Object.assign({}, opts, cfg);

    class ExtendedLISS extends opts.extends! {

        constructor(...args: any[]) {
            super(...args);
        }

		protected static override _Host: LISSHost<ExtendedLISS>;

        // TS is stupid, requires explicit return type
		static override get Host(): LISSHost<ExtendedLISS> {
			if( this._Host === undefined)
                // @ts-ignore fuck off
				this._Host = buildLISSHost(this,
                                           opts.host!,
                                           opts.content_generator!,
                                           opts);
			return this._Host;
		}
    }

    return ExtendedLISS;
}