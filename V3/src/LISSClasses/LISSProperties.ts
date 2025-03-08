import ROSignal   from "@LISS/src/signals/ROSignal";
import PropertiesManager, { attrname2propname, PropertiesDescriptor } from "../properties/PropertiesManager";
import LISSValue from "./LISSValue";

type Properties<T extends Record<string, any>> = {
    new(propertiesManager: PropertiesManager): Properties<T>
    [K: string]: typeof K extends keyof T ? T[typeof K] : never
}

export default class LISSProperties<T extends Record<string, any>> extends LISSValue<T> {

    protected readonly manager: PropertiesManager;

    static PropertiesDescriptor: PropertiesDescriptor = {};

    static get klass() {
        return this;
    }
    get klass(): typeof LISSProperties<T> {
        return this.constructor as any;
    }

    protected static _PropertiesKlassCache: Properties<any>|null = null;
    static get PropertiesKlass() {
        if( this.klass._PropertiesKlassCache === null)
            this.klass._PropertiesKlassCache = buildPropertiesKlass(this.klass.PropertiesDescriptor);
        return this.klass._PropertiesKlassCache!;
    }

    static override get observedAttributes() { return Object.keys(this.klass.PropertiesDescriptor); }

    protected buildSignalStore(): null|Record<string,ROSignal<any>> {
        return null;
    }

    constructor(value : null|T|ROSignal<T> = null,
                //TODO: params
            ) {

        super();

        this.manager = new PropertiesManager(this,
                                             this.buildSignalStore(),
                                             this.klass.PropertiesDescriptor,
                                             value);

        this.#properties = new this.klass.PropertiesKlass(this.manager);
        
        // getInitialPropertyValue => NON => setProperty() system...
        // listen properties changes => if attached => requestUpdate
    }

    #properties;

    // @ts-ignore
    override get value() {
        return this.#properties as unknown as Partial<T>;
    }
    // @ts-ignore
    override set value(val: Partial<T>) {
        Object.assign(this.#properties, val);
    }
}

function buildPropertiesKlass<T extends Record<string, any>>(
                                descriptor: PropertiesDescriptor): Properties<T> {

    // build properties
    class Properties {
        private _propertiesManager: PropertiesManager;
        constructor(propertiesManager: PropertiesManager) {
            this._propertiesManager = propertiesManager;
        }
    }
    const propsnames = Object.keys(descriptor);
    const props: PropertyDescriptorMap = {};

    for(let name of ["content", ...propsnames]) {

        const key = attrname2propname(name);

        props[key] = {
            enumerable: true,
            get: function (this: Properties) {
                // @ts-ignore
                return this._propertiesManager.getValue(name);
            },
            set: function (this: Properties, value: any) {
                // @ts-ignore
                this._propertiesManager.setJSValue(name, value)
            }
        }
    }
    Object.defineProperties(Properties.prototype, props);
    
    return Properties as any;
}