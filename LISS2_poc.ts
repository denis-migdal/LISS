// A new version of LISS

type Constructor<T> = new () => T;

type LISSClass<T extends HTMLElement> = {
	new(content: T): any;
	tagclass: Constructor<T>
}

export default function LISS<T extends HTMLElement = HTMLElement>(tagclass: Constructor<T>|null = null) {

	return class ImplLISS {

		private constructor() {}

		static readonly tagclass = tagclass;
	}
}

export function define<T extends HTMLElement>(tagname: string,
											  customClass: LISSClass<T>) {

	const inherit = customClass.tagclass ?? HTMLElement;
	// @ts-ignore
	class ImplLISSTag extends inherit {

		#api: LISSClass<T>|null = null;

		get api() {
			if( this.#api === null)
				throw new Error("Can't access API of an uninitialized element!");
			return this.#api;
		}

		init() {
			// @ts-ignore
			this.#api = new customClass(this);
		}
	}

	customElements.define(tagname, ImplLISSTag); //TODO ofc
}