import AbstractSignal from "./AbstractSignal";
import SignalEventListener from "./SignalEventListener";
export default class OutputMerger extends AbstractSignal {
    #listener = new SignalEventListener(null, () => this.trigger());
    #signals;
    constructor(...signals) {
        super();
        this.#signals = signals;
        for (let i = 0; i < signals.length; ++i)
            // @ts-ignore
            signals[i].listen(() => this.#listener.trigger());
    }
    #value = null;
    get value() {
        if (this.#listener.pending) {
            this.#value = this.#signals.map(s => s.value);
            this.#listener.ack();
        }
        return this.#value;
    }
}
//# sourceMappingURL=OutputMerger.js.map