// ================================================
// =============== LISS define ====================
// ================================================

import { buildLISSHost } from "LISSHost";
import { LISS_Opts, LISSReturnType } from "types";
import { _element2tagname } from "utils";


export function define<Opts extends LISS_Opts,
		     		   T extends LISSReturnType<Opts>>(
						   	tagname       : string,
							ComponentClass: T,
							params        : Partial<Opts["params"]> = {}) {

	const Class  = ComponentClass.LISSCfg.host;
	let htmltag  = _element2tagname(Class)??undefined;

	const LISSclass = buildLISSHost<Opts, T>(ComponentClass, params);
	
	const opts = htmltag === undefined ? {}
									   : {extends: htmltag};
	
	customElements.define(tagname, LISSclass, opts);
};