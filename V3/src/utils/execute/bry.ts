import executeJS from "./js";

// @ts-ignore
globalThis.getProp = function(target, name) {
    return target[name];
}

// can't use WebPack require() if we want to use it directly...
const bry_wrapper = `from browser import self

def wrapjs(js_klass):

	class Wrapper:

		_js_klass = js_klass # TODO: replace ?
		_js       = None

		def __new__(cls):
			this = super().__new__(cls)

			if "brython_wrapper_js" in self:
				this._js = self.brython_wrapper_js
			else:
				# TODO: set it during define...
				this._js = this._js_klass.new() # no args
			return this

		def __getattr__(this, name: str):
			print( name in this._js, var(this._js) )
			return self.getProp(this._js, name)
			#return this._js[name]

		def __setattr__(this, name: str, value):
			if name == "_js":
				super().__setattr__(name, value)
				return
			this._js[name] = value
	
	return Wrapper

self.wrapjs = wrapjs`;

let wrapper_loaded = false;

export default async function executeBry<T>(code: string, origin: string): Promise<T> {

    if( ! wrapper_loaded ) {
        await executeJS(`globalThis.__BRYTHON__.runPythonSource(\`${bry_wrapper}\`, "_")`);
        wrapper_loaded = true;
    }

    // Brython library needs to have been loaded.
    const jscode = `const $B = globalThis.__BRYTHON__;

$B.runPythonSource(\`${code}\`, "_");

const module = $B.imported["_"];
export default module.DefaultExport;`;

    return await executeJS(jscode, origin);
}