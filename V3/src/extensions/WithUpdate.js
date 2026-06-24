//TODO: init ?
class UpdateController {
    #target;
    #isVisible;
    constructor(target) {
        this.#target = target;
        this.#isVisible = false; //TODO...
        observer.observe(target);
    }
    #isPending = false;
    requestUpdate() {
        if (this.#isPending)
            return;
        this.#isPending = true;
        if (!this.#isVisible)
            return;
        this.#requestID = requestAnimationFrame(this.#afr_callback);
    }
    #requestID = null;
    #afr_callback = () => {
        this.#requestID = null;
        this.#isPending = false;
        this.#target.onUpdate();
    };
    onVisibilityChange(visibility) {
        this.#isVisible = visibility;
        // cancel current AFR
        if (!visibility && this.#requestID !== null) {
            cancelAnimationFrame(this.#requestID);
            this.#requestID = null;
        }
        if (visibility && this.#isPending && this.#requestID === null)
            this.#requestID = requestAnimationFrame(this.#afr_callback);
    }
}
function getUpdateController(elem) {
    return elem.updateController;
}
const observer = new IntersectionObserver((entries) => {
    for (let i = 0; i < entries.length; ++i) {
        const ctrler = getUpdateController(entries[i].target);
        ctrler.onVisibilityChange(entries[i].isIntersecting);
    }
}, { root: document.documentElement });
export default function WithUpdate(base, { update = UpdateController }) {
    // @ts-ignore
    return class LISSUpdate extends base {
        updateController = new update(this);
        requestUpdate() {
            this.updateController.requestUpdate();
        }
        onUpdate() {
        }
    };
}
//# sourceMappingURL=WithUpdate.js.map