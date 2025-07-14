// black magic from https://www.geeksforgeeks.org/union-type-to-intersection-type-in-typescript/
export type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never;

export type Cstr<T, U extends any[] = any[]> = new(...args:U) => T;