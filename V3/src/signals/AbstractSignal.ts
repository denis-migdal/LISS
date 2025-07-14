import SignalEvent from "./SignalEvent";

export default abstract class AbstractSignal<T> extends SignalEvent {

    abstract readonly value: T|null;
}