import LISSUpdate from "../LISSClasses/LISSUpdate";
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

export type PropertyDescriptor<T = unknown> = PropertyFullDescription<T>
                                            | ((raw: string) => T);
export type PropertiesDescriptor = Record<string, PropertyDescriptor<unknown>>;

export default class PropertiesManager {

    #properties: Record<string, Property> = {};
    
    // TODO: cstr params (x1) + data...
    constructor(target: LISSUpdate, propertiesDesc: PropertiesDescriptor, cstrVals: Record<string, any>) {

        for( let name in propertiesDesc ) {

            let props = propertiesDesc[name];

            if( typeof props === "function" && props.constructor.name === "Function")
                props = { parser: props };

            this.#properties[name] = new Property(props as PropertyFullDescription<unknown>);

            const vpropname  = attrname2propname(name);
            const dpropname = attrname2propname('default-' + name);
            const v = getPropertyInitialValue(target, vpropname as any, cstrVals[vpropname]  );
            const d = getPropertyInitialValue(target, dpropname as any, cstrVals[dpropname] );

            if( v !== null)
                this.#properties[name].JS_value   = v;
            if( d !== null)
                this.#properties[name].JS_default = d;

        }

        const attrs = target.getAttributeNames();
        for(let i = 0; i < attrs.length; ++i)
            this.#onAttrChanged(attrs[i], target.getAttribute(attrs[i]) );

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

    getValue(name: string) {
        console.warn(name, this.#properties);
        this.#properties[name].signal.value;
    }
    getDefault(name: string) {
        throw new Error("not implemented");
    }
    setJSValue(name: string, value: unknown) {
        this.#properties[name].JS_value = value;
    }
    setJSDefault(name: string, value: unknown) {
        this.#properties[name].JS_default = value;
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