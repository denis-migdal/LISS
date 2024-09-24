// ================================================
// =============== LISS define ====================
// ================================================

import { buildLISSHost } from "LISSHost";
import { LISS_Opts, LISSReturnType } from "types";
import { _element2tagname } from "utils";

const _DOMContentLoaded = new Promise<void>( (resolve) => {

	if(document.readyState === "interactive" || document.readyState === "complete")
		return resolve();

	document.addEventListener('DOMContentLoaded', () => {
		resolve();
	}, true);
});

export async function define<Opts extends LISS_Opts,
						   	 T extends LISSReturnType<Opts>>(
						   	tagname       : string,
							ComponentClass: T,
							{deps = [], params = {}}: {params?: Partial<Opts["params"]>, deps?: readonly Promise<string>[]} = {}) {

	const Class  = ComponentClass.LISSCfg.host;
	let LISSBase = ComponentClass;
	let htmltag  = _element2tagname(Class)??undefined;

    //TODO: move2host...
	await Promise.all([_DOMContentLoaded, ...deps, ...LISSBase.LISSCfg.deps]);

	const LISSclass = buildLISSHost<Opts, T>(ComponentClass, params);
	
	const opts = htmltag === undefined ? {}
									   : {extends: htmltag};
	
	customElements.define(tagname, LISSclass, opts);
};