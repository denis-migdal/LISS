import WithInput, { getInput } from "./WithInput";
import WithOutput, { getOutput } from "./WithOutput";
import { With } from ".";
class InputOutputMerger {
    #input;
    #output;
    constructor(input, output) {
        this.#input = input;
        this.#output = output;
    }
    listen(callback) {
        this.#output.listen(callback);
    }
    unlisten(callback) {
        this.#output.unlisten(callback);
    }
    get source() {
        return this.#input.source;
    }
    set source(src) {
        this.#input.source = src;
    }
    set value(value) {
        this.#input.value = value;
    }
    get value() {
        return this.#output.value;
    }
}
export function getValue(target) {
    if (!("_value" in target)) {
        // @ts-ignore
        target.value = new InputOutputMerger(getInput(target), getOutput(target));
        // will shadow value getter
    }
    // @ts-ignore
    return target.value;
}
export default function WithRWValue(base) {
    // @ts-ignore
    return class LISSRWValue extends With((WithInput), (WithOutput))(base, {}) {
        _value;
        get value() {
            return this._value;
        }
        constructor() {
            super();
            if (this.value !== undefined) {
                // @ts-ignore
                this._value = this.value;
                // @ts-ignore
                delete this.value; // un-shadow getter.
            }
            else {
                this._value = new InputOutputMerger(this.input, this.output);
            }
        }
    };
}
//# sourceMappingURL=WithRWValue.js.map