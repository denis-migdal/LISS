import { Cstr } from "../utils/types";

type Updatable = HTMLElement & { onUpdate: () => void };

//TODO: init ?
class UpdateController {

    #target: Updatable;
    #isVisible: boolean;

    constructor( target: Updatable ) {
        this.#target = target;

        this.#isVisible = false; //TODO...
        observer.observe(target);
    }

    #isPending: boolean = false;

    requestUpdate() {

        if( this.#isPending )
            return;
        this.#isPending = true;

        if( ! this.#isVisible )
            return;

        this.#requestID = requestAnimationFrame( this.#afr_callback );
    }

    #requestID: number|null = null;

    #afr_callback = () => {
        this.#requestID = null;
        this.#isPending = false;

        this.#target.onUpdate();     
    }

    onVisibilityChange(visibility: boolean) {

        this.#isVisible = visibility;

        // cancel current AFR
        if( ! visibility && this.#requestID !== null ) {
            cancelAnimationFrame(this.#requestID);
            this.#requestID = null;
        }

        if( visibility && this.#isPending && this.#requestID === null)
            this.#requestID = requestAnimationFrame( this.#afr_callback );
    }
}

function getUpdateController(elem: Element): UpdateController {
    return (elem as any).updateController
}

const observer = new IntersectionObserver( (entries: IntersectionObserverEntry[]) => {

    for(let i = 0; i < entries.length; ++i) {
        const ctrler = getUpdateController(entries[i].target)
        ctrler.onVisibilityChange( entries[i].isIntersecting );
    }
}, {root: document.documentElement});

type WithUpdate_Opts = {
    update?: typeof UpdateController
};

export default function WithUpdate<T extends HTMLElement>(
                                        base : Cstr<T>,
                                        {
                                            update = UpdateController
                                        }: WithUpdate_Opts) {

    // @ts-ignore
    return class LISSUpdate extends base {

        private readonly updateController = new update( this as any );

        requestUpdate() {
            this.updateController.requestUpdate();
        }

        protected onUpdate() {

        }
    }
}