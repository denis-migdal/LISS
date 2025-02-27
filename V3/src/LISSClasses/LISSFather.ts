import LISSChild from "./LISSChild";
import LISSUpdate from "./LISSUpdate";

export const WAITING_UPGRADE = Symbol();

function observe( target: LISSFather, callback: (records: MutationRecord[]) => void ) {
    new MutationObserver(callback).observe(target, {childList: true});
}

// extends LISSSignal (?) Properties merger (?)
export default class LISSFather extends LISSUpdate {

    protected LISSChildren: LISSChild[]|null = null;

    constructor() {
        super();

        observe(this, (records: MutationRecord[]) => {

            this.LISSChildren = null;

            for(let i = 0; i < records.length; ++i)
                this.processRemovedNodes(records[i].removedNodes);
            
            this.requestUpdate();
        });
    }

    protected processRemovedNodes(nodes: NodeList) {

        for(let j = 0; j < nodes.length; ++j) {
            const node = nodes[j]
            if( node instanceof LISSChild && node.isAttached )
                this.detach( node );
            else
                (node as any)[WAITING_UPGRADE] = false;
        }
    }

    protected updateChildrenList() {

        // wasn't invalidated
        if( this.LISSChildren !== null )
            return;

        console.warn("UPDATE", ...this.children);

        const children = this.children;
        this.LISSChildren = new Array(children.length);

        let offset = 0;
        for(let i = 0; i < children.length; ++i) {

            const child = children[i];

            if( ! (child instanceof LISSChild) )
                continue;

            if( ! child.isAttached )
                this.attach( child );

            this.LISSChildren[offset++] = child;
        }
    }

    protected override onInit(): void {}

    protected override onUpdate(): void {  
        this.updateChildrenList();
    }

    private attach(child: LISSChild) {
        (child as any).attach(this);
        this.onAttach(child);
    }
    private detach(child: LISSChild) {
        this.onDetach(child);
        (child as any).detach(this);
    }

    protected onDetach(child: LISSChild) {}
    protected onAttach(child: LISSChild) {}
}