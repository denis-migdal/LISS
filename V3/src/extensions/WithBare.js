import DOMContentLoaded from "../utils/FutureEvents/DOMContentLoaded";
export default function WithBare(base, { defineAfter = DOMContentLoaded } = {}) {
    // @ts-ignore
    return class LISSBare extends base {
        // required for define()
        static get defineAfter() {
            return defineAfter;
        }
        // small helper
        // @ts-ignore
        host = this;
        controler = this;
        // defined for auto-completion.
        static observedAttributes = [];
        attributeChangedCallback(name, oldval, newval) { }
    };
}
//# sourceMappingURL=WithBare.js.map