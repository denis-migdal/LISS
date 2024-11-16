class CstrParams extends LISS({html, css}) {
    constructor(value=42) {
        super();
        this.content.append(value);
    }
}

LISS.define('cstr-params', CstrParams);