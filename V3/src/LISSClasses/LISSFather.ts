import LISSChild from "./LISSChild";
import LISSUpdate from "./LISSUpdate";

export const WAITING_UPGRADE = Symbol();

const obsChildren = new MutationObserver( (records: MutationRecord[]) => {
			
    for(let i = 0; i < records.length; ++i) {
        const {addedNodes, removedNodes} = records[i];
        const target: LISSFather = records[i].target as any;

        for(let j = 0; j < addedNodes.length; ++j) {
            const node = addedNodes[j]
            if( node instanceof LISSChild )
                (target as any).onAttach( node );
            else
                (node as any)[WAITING_UPGRADE] = true;
        }

        for(let j = 0; j < removedNodes.length; ++j) {
            const node = removedNodes[j]
            if( node instanceof LISSChild )
                (target as any).onDetach( node );
            else
                (node as any)[WAITING_UPGRADE] = false;
        }
    }
});

// extends LISSSignal (?) Properties merger (?)
export default class LISSFather extends LISSUpdate {

    constructor() {
        super();

        obsChildren.observe(this, {childList: true});
    }

    protected onDetach(child: LISSChild) {
        (child as any).onDetach(this);
    }
    protected onAttach(child: LISSChild) {
        (child as any).onAttach(this);
    }
}