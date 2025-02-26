import LISSChild from "./LISSChild";
import LISSUpdate from "./LISSUpdate";

export const WAITING_UPGRADE = Symbol();

function observe( target: LISSFather, callback: (records: MutationRecord[]) => void ) {
    new MutationObserver(callback).observe(target, {childList: true});
}

// extends LISSSignal (?) Properties merger (?)
export default class LISSFather extends LISSUpdate {

    protected LISSChildren = new Array<LISSChild>();

    constructor() {
        super();

        observe(this, (records: MutationRecord[]) => {

            this.updateChildrenList();

            for(let i = 0; i < records.length; ++i) {
                this.processAddedNodes  (records[i].addedNodes);
                this.processRemovedNodes(records[i].removedNodes);                
            }
        });

        this.updateChildrenList();
        this.processAddedNodes(this.childNodes);
    }

    protected processAddedNodes(nodes: NodeList) {

        for(let j = 0; j < nodes.length; ++j) {
            const node = nodes[j]
            if( node instanceof LISSChild )
                this.onAttach( node );
            else
                (node as any)[WAITING_UPGRADE] = true;
        }
    }

    protected processRemovedNodes(nodes: NodeList) {

        for(let j = 0; j < nodes.length; ++j) {
            const node = nodes[j]
            if( node instanceof LISSChild )
                this.onDetach( node );
            else
                (node as any)[WAITING_UPGRADE] = false;
        }
    }

    protected updateChildrenList() {
        this.LISSChildren = [ ...this.children ].filter( (e) => {
            return e instanceof LISSChild
        })
    }

    protected onDetach(child: LISSChild) {
        (child as any).onDetach(this);
    }
    protected onAttach(child: LISSChild) {
        (child as any).onAttach(this);
    }
}