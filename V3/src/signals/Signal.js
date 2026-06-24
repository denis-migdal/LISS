import SignalWithSource from "./SignalWithSource";
export default class Signal extends SignalWithSource {
    get value() {
        return this._listener.value;
    }
    set value(value) {
        this._listener.value = value;
    }
}
//# sourceMappingURL=Signal.js.map