import ROSignal from "../signals/ROSignal";
import Signal from "../signals/Signal";
import LISSFather, { WAITING_UPGRADE } from "./LISSFather";
import LISSProperties from "./LISSProperties";

export default class LISSChild<T extends Record<string,any> = any> extends LISSProperties<T> {

    // if declared, shadow previous declaration...
    //private _fatherSignal!:Signal<LISSFather>;

    protected get father() {
        return this.fatherSignal.value ?? null;
    }

    protected get fatherSignal() {

        let signal = (this as any)._fatherSignal as Signal<LISSFather>;

        if( signal === undefined)
            signal = (this as any)._fatherSignal = new Signal<LISSFather>();

        return signal;
    }

    // called before constructor...
    protected override buildSignalStore() {
        return buildSignalStoreProxy(this.fatherSignal);
    }

    constructor(value: T|ROSignal<T>|null = null) {
        super(value);

        if( (this as any)[WAITING_UPGRADE] )
            (this.parentElement as any).attach(this);
    }

    override requestUpdate() {
        if( this.isAttached && this.father !== undefined)
            this.father!.requestUpdate();
    }

    get isAttached() {
        return this.father !== null;
    }

    private attach(father: LISSFather) {
        this.fatherSignal.value = father;
        this.onAttach();
    }
    private detach() {
        this.onDetach();
        this.fatherSignal.value = null;
    }

    protected onAttach(){}
    protected onDetach(){}
}

type Target = ROSignal<{signals: Record<string,ROSignal<any>>}>;
function buildSignalStoreProxy(target: Target) {

    const signals: Record<string, ROSignal<any>> = {};

    function get(name: string): Signal<any> {
        let signal = signals[name] as Signal<any>;
        if( signal === undefined) {
            signal = signals[name] = new Signal();
            if( curTarget !== null )
                signal.source = curTarget.signals[name];
        }
        return signal;
    }

    let curTarget: null|Target["value"] = null;

    target.listen( () => {

        let newTarget = target.value;

        if( curTarget === newTarget )
            return;

        if( newTarget !== null)
            for(let name in signals)
                (signals[name] as Signal<any>).source = newTarget.signals[name] ?? null;
        else
            for(let name in signals)
                (signals[name] as Signal<any>).source = null;

        curTarget = newTarget;

    });

    return new Proxy(signals, {
        get<U extends string>(_: any, prop: U): ROSignal<any> {
            return get(prop);
        },
        set(_, prop: string, value: ROSignal<any>) {
            get(prop).source = value;
            return true;
        },
        deleteProperty(_, prop: string) {
            get(prop).source = null;
            return true;
        }
    });
}