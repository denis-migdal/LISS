import { Cstr, UnionToIntersection } from "../utils/types";


export type Extension<T extends Cstr<HTMLElement> = any, U extends Cstr<HTMLElement> = any, V extends {} = any> = (base: T, args?: V) => U;

export type ExtensionArgs<T extends Extension> = T extends Extension<any, any, infer U>
                                            ? U
                                            : never

export type ExtensionsArgs<T extends Extension[], K extends keyof T & number = keyof T & number> = UnionToIntersection<ExtensionArgs<T[K]>>;

export type ExtensionReturn<T extends Extension> = T extends Extension<any, infer U, any>
                                                ? U
                                                : never

export type ExtensionsReturn<T extends Extension[], K extends keyof T & number = keyof T & number> = 
    // instance props
    Cstr<UnionToIntersection<InstanceType<ExtensionReturn<T[K]>>>>
    // static props
  & UnionToIntersection<Omit<ExtensionReturn<T[K]>, "new">>;