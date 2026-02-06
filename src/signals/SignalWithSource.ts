import AbstractSignal from "./AbstractSignal";
import SignalListener from "./SignalListener";

export default abstract class SignalWithSource<IN, OUT=IN> extends AbstractSignal<OUT> {

    protected _listener = new SignalListener<IN>(
                                    null,
                                    () => this.trigger(),
                                    {ack: false}
                                );

    // listener

    set source(source: AbstractSignal<IN>|null) {
        this._listener.source = source;
    }
    get source() {
        return this._listener.source;
    }
}