import LISS, { LISSBase, LISSHost, ShadowCfg } from "./";

// for now do not handle parent changes.

export default class LissParam<T> extends LISS({
    shadow: ShadowCfg.NONE,
    css: [`:host {display: none}`],
    attributes: [ "value", "type" ] /* for now only value to stay simple */
}) {

    #name  : string;
    #value?: T;

    #parent: LISSHost<any>;

    // dirty h4ck...
    constructor(p = {}, init = true) {

        super();

        this.#name = this.host.getAttribute("name")!;

        this.#parent = this.host.parentElement! as LISSHost<any>;

        if(init)
            this.init();
    }

    protected init() {

        if( this.host.hasAttribute("value") ) {
            this.onValueChanged(this.attrs.value!);
            return;
        }

        // TODO: observe content...
        this.onValueChanged(this.host.textContent!);
    }

    //TODO
    protected get type() {
        return this.attrs.type ?? "string";
    }

    protected _parseContent(value: string): T {

        const type = this.type;

        if( type === "string" )
            return value as T;
        if( type === "JSON")
            return JSON.parse(value);
        if( type === "JS") {
            const args = Object.keys( this.getArgs() );
            this.#fct = new Function(...args, `return ${value}`);
            return this.call( ...Object.values(args) );
        }
        throw new Error("not implemented!");
    }

    #fct: ( Function)|null = null;

    protected call(...args: any[]) {
        return this.#fct!(...args) as T;
    }
    
    protected onValueChanged(value: string) {
        
        this.#value = this._parseContent(value);
        /*
        // do not updated if not in DOM.
        if( ! this.#parent?.isInDOM)
            return;*/

        this.#parent.setParam(this.#name, this.#value);
    }

    protected getArgs(): Record<string,any> {
        return {};
    }

    protected setValue(val: T) {
        this.#parent.setParam(this.#name, val);
    }

    //TODO...
    /*
    protected override onAttrChanged(_name: string, _oldValue: string, _newValue: string): void | false {
        
        this.onValueChanged(this.attrs.value!);
    }*/
}

LISS.define("liss-param", LissParam);