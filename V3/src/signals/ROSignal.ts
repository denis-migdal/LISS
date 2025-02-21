import SignalEvent from "./SignalEvent";

export default abstract class ROSignal<T> extends SignalEvent {

    override listen(callback: (pthis: SignalEvent) => void) {
        
        super.listen(callback);

        callback(this); // initial callback (when signal Data)

        return this;
    }

    abstract readonly value: T|null;
}