import LISSBase from "./LISSBase";

export default class LISSUpdate extends LISSBase {

    constructor() {
        super();

        observer.observe(this);
    }

    #requestID: null|number = null;
    #updateRequested = false;
    #isVisible       = false;

    static processIntersectionObserver(entries: IntersectionObserverEntry[]) {

        for(let i = 0; i < entries.length; ++i) {

            const target     = entries[i].target as LISSUpdate;
            const isVisible  = entries[i].isIntersecting;

            target.#isVisible = isVisible;

            if( ! isVisible && target.#requestID !== null)
                cancelAnimationFrame(target.#requestID);

            if( isVisible && target.#updateRequested && target.#requestID === null )
                target.#scheduleUpdate();
        }
    }

    #scheduleUpdate() {
        this.#requestID = requestAnimationFrame( () => {
            this.#requestID       = null;
            this.#updateRequested = false;
            this.onUpdate();
        });
    }

    requestUpdate() {

        if( this.#updateRequested )
            return;

        this.#updateRequested = true;

        if( ! this.#isVisible )
            return;

        this.#scheduleUpdate();
    }

    protected onUpdate() {

    }
}

const observer = new IntersectionObserver( LISSUpdate.processIntersectionObserver );