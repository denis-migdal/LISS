import { _fetchText, DEFAULT_CDIR, defineWebComponentV3, KnownTags } from "V2/helpers/LISSAuto";

type importComponents_OptsV3<T extends HTMLElement> = {
	cdir   ?: string|null
};

export async function importComponentV3<T extends HTMLElement = HTMLElement>(
	tagname: string,
	{
		cdir    = DEFAULT_CDIR,
		// brython = null
	}: importComponents_OptsV3<T> = {}
) {

	KnownTags.add(tagname);

	const compo_dir = `${cdir}${tagname}/`;

	const files: Record<string,string|undefined> = {};

	// strats : JS -> Bry -> HTML+CSS (cf script attr).

	// try/catch ?
    const promises = [
        _fetchText(`${compo_dir}index.html`, true)!,
        _fetchText(`${compo_dir}index.css` , true)!
    ];
	[files["html"], files["css" ]] = await Promise.all(promises);

	return await defineWebComponentV3(tagname, files);
}
