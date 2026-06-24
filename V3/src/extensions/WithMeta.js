import { Signal } from "../signals";
export function getMeta(target) {
    if (!("_meta" in target))
        // @ts-ignore
        target.meta = new Signal(); // will shadow input getter
    // @ts-ignore
    return target.meta;
}
export default function WithMeta(base) {
    // @ts-ignore
    return class LISSMeta extends base {
        _meta;
        get meta() {
            return this._meta;
        }
        constructor() {
            super();
            if (this.meta !== undefined) {
                // @ts-ignore
                this._meta = this.meta;
                // @ts-ignore
                delete this.meta; // un-shadow getter.
            }
            else {
                this._meta = new Signal();
            }
        }
    };
}
//# sourceMappingURL=WithMeta.js.map