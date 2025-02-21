// @ts-nocheck

const bry_wrapper = `from browser import self

def wrapjs(js_klass):

	class Wrapper:

		_js_klass = js_klass
		_js = None

		def __init__(this, *args):
			this._js = js_klass.new(*args)

		def __getattr__(this, name: str):
			return this._js[name];

		def __setattr__(this, name: str, value):
			if name == "_js":
				super().__setattr__(name, value)
				return
			this._js[name] = value
	
	return Wrapper

self.wrapjs = wrapjs
`;


async function importComponent<T extends HTMLElement = HTMLElement>(
	tagname: string,
	{
		cdir    = DEFAULT_CDIR,
		brython = null,
		// @ts-ignore
		host    = HTMLElement,
		files   = null
	}: importComponents_Opts<T> & {files?: Record<string, string>|null} = {}
) {

	KnownTags.add(tagname);

	const compo_dir = `${cdir}${tagname}/`;

	if( files === null ) {
		files = {};

		const file = brython === "true" ? 'index.bry' : 'index.js';

		files[file] = (await _fetchText(`${compo_dir}${file}`, true))!;

		//TODO!!!
		try {
			files["index.html"] = (await _fetchText(`${compo_dir}index.html`, true))!;
		} catch(e) {

		}
		try {
			files["index.css" ] = (await _fetchText(`${compo_dir}index.css` , true))!;
		} catch(e) {
			
		}
	}

	if( brython === "true" && files['index.bry'] !== undefined) {

		const code = files["index.bry"];

		files['index.js'] =
`const $B = globalThis.__BRYTHON__;

$B.runPythonSource(\`${bry_wrapper}\`, "_");
$B.runPythonSource(\`${code}\`, "_");

const module = $B.imported["_"];
export default module.WebComponent;

`;
	}

	const html = files["index.html"];
	const css  = files["index.css"];

	return await defineWebComponent(tagname, files, {html, css, host});
}