import LISSFather, { WAITING_UPGRADE } from "./LISSFather";
import LISSProperties from "./LISSProperties";

export default class LISSChild<T extends Record<string,any> = any> extends LISSProperties<T> {

    protected father: LISSFather|null = null;

    constructor() {
        super();

        if( (this as any)[WAITING_UPGRADE] )
            (this.parentElement as any).onAttach(this);
    }

    override requestUpdate() {
        if( this.isAttached )
            this.father!.requestUpdate();
    }

    get isAttached() {
        return this.father == null;
    }

    protected onAttach(father: LISSFather) {
        this.father = father;
    }
    protected onDetach(father: LISSFather) {
        this.father = null;
    }
}