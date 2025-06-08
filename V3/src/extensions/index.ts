// helpers

// black magic from https://www.geeksforgeeks.org/union-type-to-intersection-type-in-typescript/
type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never;

export type Cstr<T, U extends unknown[] = unknown[]> = new(...args:U) => T;

// types

type Extension<T extends Cstr<HTMLElement> = any, U extends Cstr<HTMLElement> = any, V extends {} = any> = (base: T, args?: V) => U;

type ExtensionArgs<T extends Extension> = T extends Extension<any, any, infer U>
                                            ? U
                                            : never

type ExtensionsArgs<T extends Extension[], K extends keyof T & number = keyof T & number> = UnionToIntersection<ExtensionArgs<T[K]>>;

type ExtensionReturn<T extends Extension> = T extends Extension<any, infer U, any>
                                                ? U
                                                : never

type ExtensionsReturn<T extends Extension[], K extends keyof T & number = keyof T & number> = Cstr<UnionToIntersection<InstanceType<ExtensionReturn<T[K]>>>>;

// builder

function ExtensionsMerger<T extends Extension[]>(...extensions: T) {

    return function Extension<U extends HTMLElement>(
                    base: Cstr<U>,
                    args: ExtensionsArgs<T>)
                        : Cstr<U & InstanceType<ExtensionsReturn<T>>> {

        let cur = base;
        for(let i = 0; i < extensions.length; ++i)
            cur = extensions[i](cur, args);

        return cur as any;
    }
}

// default config.

import WithBare from "./WithBare";

const WithDefaultExtensions = ExtensionsMerger( WithBare );

// LISS

type _<T extends Extension[]> = T extends []
                                ? typeof WithDefaultExtensions[]
                                : T;

function LISS<T extends Extension[]>(
                                    args: ExtensionsArgs<_<T>>,
                                    ...extensions: T): ExtensionsReturn<_<T>> {

    let extension = extensions.length
                        ? ExtensionsMerger(...extensions)
                        : WithDefaultExtensions

    // @ts-ignore
    return extension(HTMLElement, args);
}

// tests

//TODO: compose functions...

class A extends LISS({}) {

    foo() {}
}

const a = new A();