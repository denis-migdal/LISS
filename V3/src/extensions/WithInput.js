import { Signal } from "../signals";
export function getInput(target) {
    if (!("_input" in target))
        // @ts-ignore
        target.input = new Signal(); // will shadow input getter
    // @ts-ignore
    return target.input;
}
export default function WithInput(base) {
    // @ts-ignore
    return class LISSInput extends base {
        _input;
        get input() {
            return this._input;
        }
        constructor() {
            super();
            if (this.input !== undefined) {
                // @ts-ignore
                this._input = this.input;
                // @ts-ignore
                delete this.input; // un-shadow getter.
            }
            else {
                this._input = new Signal();
            }
        }
    };
}
//# sourceMappingURL=WithInput.js.map