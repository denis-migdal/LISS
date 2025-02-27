import ROSignal   from "@LISS/src/signals/ROSignal";
import LISSSignal from "./LISSSignal";
import PropertiesManager, { attrname2propname, PropertiesDescriptor } from "../properties/PropertiesManager";

type Properties<T extends Record<string, any>> = {
    new(propertiesManager: PropertiesManager): Properties<T>
    [K: string]: typeof K extends keyof T ? T[typeof K] : never
}

export default class LISSProperties<T extends Record<string, any>> extends LISSSignal<T> {

    #manager: PropertiesManager;

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
    protected static _DefaultPropertiesKlassCache: Properties<any>|null = null;
    static get DefaultPropertiesKlass() {
        if( this.klass._DefaultPropertiesKlassCache === null)
            this.klass._DefaultPropertiesKlassCache = buildPropertiesKlass(this.klass.PropertiesDescriptor, "Default");
        return this.klass._DefaultPropertiesKlassCache!;
    }
    static override get observedAttributes() { return Object.keys(this.klass.PropertiesDescriptor); }

    constructor(value : null|T = null,
                signal: null|ROSignal<T> = null,
                //TODO: params
            ) {

        super(value, signal);

        this.#manager = new PropertiesManager(this, this.klass.PropertiesDescriptor, {});

        this.properties        = new this.klass.PropertiesKlass(this.#manager);
        this.defaultProperties = new this.klass.DefaultPropertiesKlass(this.#manager);

        // getInitialPropertyValue => NON => setProperty() system...
        // listen properties changes => if attached => requestUpdate
    }

    readonly properties;
    readonly defaultProperties;
}

function buildPropertiesKlass<T extends Record<string, any>>(
                                descriptor: PropertiesDescriptor,
                                suffix: string = "Value"): Properties<T> {

    // build properties
    class Properties {
        private _propertiesManager: PropertiesManager;
        constructor(propertiesManager: PropertiesManager) {
            this._propertiesManager = propertiesManager;
        }
    }
    const propsnames = Object.keys(descriptor);
    const props: PropertyDescriptorMap = {};

    const get = `get${suffix}`;
    const set = `setJS${suffix}`;

    for(let name of ["content", ...propsnames]) {

        const key = attrname2propname(name);

        props[key] = {
            enumerable: true,
            get: function (this: Properties) {
                // @ts-ignore
                return this._propertiesManager[get](name);
            },
            set: function (this: Properties, value: any) {
                // @ts-ignore
                this._propertiesManager[set](name, value)
            }
        }
    }
    Object.defineProperties(Properties.prototype, props);
    
    return Properties as any;
}