import LISSUpdate from "../LISSClasses/LISSUpdate";
import { ParserAlgo } from "../signals/ParsedSignal";
import ROSignal from "../signals/ROSignal";
import getPropertyInitialValue from "../utils/DOM/getPropertyInitialValue";
import Property, { PropertyFullDescription } from "./Property";

//TODO: move utils
export type PropertyName<T extends string> = T extends `${infer pre}-${infer post}`
            ? `${pre}${Capitalize<post>}`
            : T;

export function attrname2propname<T extends string>(attr_name: T): PropertyName<T> {

	let result: string = attr_name;

	let pos = -1;
	while( (pos = result.indexOf('-')) !== -1 ) {
		result = result.slice(0, pos) + result[pos+1].toUpperCase() + result.slice(pos+2);
	}

	return result as any;
}

export type PropertyDescriptor<T = any> = PropertyFullDescription<T>
                                            | ((raw: string) => T)
                                            | T;
export type PropertiesDescriptor = Record<string, PropertyDescriptor>;

export default class PropertiesManager {

    #properties: Record<string, Property> = {};
    
    // TODO: cstr params (x1) + data...
    constructor(target: LISSUpdate, source: null|Record<string, ROSignal<any>>, propertiesDesc: PropertiesDescriptor, cstrVals: Record<string, any>|null) {

        cstrVals ??= {};

        for( let name in propertiesDesc ) {

            let props = propertiesDesc[name];

            if( typeof props === "function" && props.constructor.name === "Function")
                props = { parser: props };
            else if( props === null || typeof props !== "object" || ! ("parser" in props) )
                props = { fixed: props };

            this.#properties[name] = new Property(source, props as PropertyFullDescription<unknown>);

            const vpropname  = attrname2propname(name);

            const val = cstrVals[vpropname];
            if( val !== undefined )
                this.#properties[name].JS_value = val;
        }

        const attrs = target.getAttributeNames();
        for(let i = 0; i < attrs.length; ++i)
            this.#onAttrChanged(attrs[i], target.getAttribute(attrs[i]) );

        if( "content" in propertiesDesc ) {

            this.#onAttrChanged("content", target.textContent );

            new MutationObserver( () => {
                this.#onAttrChanged("content", target.textContent);
            }).observe(target.host, {characterData: true, subtree: true});
        }

        // @ts-ignore
        target.attributeChangedCallback = ( name: string,
                                            oldV: string|null,
                                            newV: string|null) => {

            if( oldV === newV)
                return;

            this.#onAttrChanged(name, newV);
        }

        const callback = () => target.requestUpdate();
        for( let name in propertiesDesc )
            this.#properties[name].signal.listen( callback );        
    }

    getSignal(name: string) {
        return this.#properties[name].signal;
    }

    getValue(name: string) {
        return this.#properties[name].signal.value;
    }
    setJSValue(name: string, value: unknown) {
        this.#properties[name].JS_value = value;
    }
    setParser(name: string, parser: ParserAlgo<any>) {
        this.#properties[name].parser = parser;
    }

    #onAttrChanged(name: string, value: string|null) {

        let target = "HTML_value" as "HTML_value"|"HTML_default";
        if( name.startsWith('default-') ){
            name = name.slice(8);
            target = "HTML_default";
        }

        this.#properties[name][target] = value;
    }
}