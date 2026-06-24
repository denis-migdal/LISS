import { Signal } from "../signals";
export function getOutput(target) {
    if (!("_output" in target))
        // @ts-ignore
        target.output = new Signal(); // will shadow output getter
    // @ts-ignore
    return target.output;
}
export default function WithOutput(base) {
    // @ts-ignore
    return class LISSOutput extends base {
        _output;
        constructor() {
            super();
            // @ts-ignore
            if (this.output !== undefined) {
                // @ts-ignore
                this._output = this.output;
                // @ts-ignore
                delete this.output; // un-shadow getter.
            }
            else {
                this._output = new Signal();
            }
        }
        get output() {
            return this._output;
        }
    };
}
//# sourceMappingURL=WithOutput.js.map