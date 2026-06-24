import AbstractSignal from "./AbstractSignal";
import SignalListener from "./SignalListener";
export default class SignalWithSource extends AbstractSignal {
    _listener = new SignalListener(null, () => this.trigger(), { ack: false });
    // listener
    set source(source) {
        this._listener.source = source;
    }
    get source() {
        return this._listener.source;
    }
}
//# sourceMappingURL=SignalWithSource.js.map