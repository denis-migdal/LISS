import { define } from "customRegistery";
import { LISS } from "LISSBase";
import { LISSHost, ShadowCfg } from "types";

// Normally :
// Parent upgrade -> children upgrade -> children init -> manipulate parent host -> parent init.
// If deps -> need a tool for "waitChildrenInit" or "waitParentInit".

export class LISSParams<T extends Record<string, any>> extends LISS({
    shadow: ShadowCfg.NONE,
    css: [`:host {display: none}`],
    attrs: ["type"]
}) {

    #name  : string;
    #value?: T;

    #parent: LISSHost;

    // dirty h4ck...
    constructor(p = {}, init = true) { // why init ?

        super();

        this.#name = this.host.getAttribute("name")!;

        this.#parent = this.host.parentElement! as LISSHost;

        if(init)
            this.init();
    }

    protected init() {

        // TODO: observe content...
        this.onValueChanged(this.host.textContent!);
    }

    //TODO
    protected get type() {
        return this.attrs.type ?? "JSON";
    }

    protected _parseContent(value: string): T {

        const type = this.type;

        if( type === "JSON")
            return JSON.parse(value);
        if( type === "JS") {
            //TODO: may be improved ?
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

        this.#parent.updateParams(this.#value);
    }

    protected getArgs(): Record<string,any> {
        return {};
    }

    //TODO...
    /*
    protected override onAttrChanged(_name: string, _oldValue: string, _newValue: string): void | false {
        
        this.onValueChanged(this.attrs.value!);
    }*/
}

if( customElements.get("liss-params") === undefined)
    define("liss-params", LISSParams);