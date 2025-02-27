import ROSignal from "../signals/ROSignal";
import LISSFather, { WAITING_UPGRADE } from "./LISSFather";
import LISSProperties from "./LISSProperties";

export default class LISSChild<T extends Record<string,any> = any> extends LISSProperties<T> {

    protected father: LISSFather|null = null;

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
        this.father = father;
        this.onAttach();
    }
    private detach() {
        this.onDetach();
        this.father = null;
    }

    protected onAttach(){}
    protected onDetach(){}
}