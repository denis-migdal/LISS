//TODO: inheritance on mixin (can be solved)
    // Add mixin one by one by inheritance.
//TODO: private members (language)
    // outside interface + (re)write class with ES notation (can't inherit)

type Mix<
            Base  extends          new(...args:any[])=>any,
            Mixin extends abstract new(...args:any[])=>any,
        > = Omit<Base & Mixin, "new"> & (new(...args:ConstructorParameters<Base>) => (InstanceType<Base> & InstanceType<Mixin>))

class Base {

    #a: number;

    constructor(a: number) {
        this.#a = a;
    }
    faa() {
        return this.#a;
    }
}

const MixSrc = Symbol();


abstract class Mixin {

    #b = 34;

    protected fii() {
        //return this.#b;
    }

    foo() {
        return 44;
    }
    static foo() {
        return 42;
    }
}

function mix<
                Base  extends          new(...args:any[]) => any,
                Mixin extends abstract new(...args:any[]) => any
            >(base: Base, mixin: Mixin): Mix<Base, Mixin> {

    class _ extends base {}

    const static_props = Object.getOwnPropertyDescriptors(mixin);
    delete static_props.prototype;
    delete static_props.name;
    Object.defineProperties( _, static_props );

    ((_ as any)[MixSrc] ??= []).push(mixin);

    const hasInstance = mixin[Symbol.hasInstance];
    Object.defineProperty(mixin, Symbol.hasInstance, {
        value: function (instance: any) {
            if( instance.constructor[MixSrc].includes(this) )
                return true;
            return hasInstance.call(this, instance);
        },
        writable: false,
    });

    const instance_props = Object.getOwnPropertyDescriptors(mixin.prototype);
    // @ts-ignore
    delete instance_props.constructor;
    Object.defineProperties( _.prototype, instance_props );


    Object.defineProperties( _.prototype, {
        "#b": { value: 42 }
    });

    return _ as any; // well...
}

export class K extends mix(Base, Mixin) {

    constructor() {
        super(3);

        this.fii();
    }

}

const k = new K();

console.warn( K.foo(), k.foo(), k.faa(), k instanceof Base, k instanceof Mixin );