// default config.
import WithBare from "./WithBare";
import WithContent from "./WithContent";
export { default as WithBare } from "./WithBare";
export { default as WithContent } from "./WithContent";
export { default as WithInput, getInput } from "./WithInput";
export { default as WithOutput, getOutput } from "./WithOutput";
export { default as WithRWValue, getValue } from "./WithRWValue";
export { default as WithMeta, getMeta } from "./WithMeta";
export { default as WithUpdate } from "./WithUpdate";
export const DEFAULT_EXTENSIONS = [
    WithBare,
    WithContent
];
// With
export function With(...extensions) {
    return function (base, args) {
        let cur = base;
        for (let i = 0; i < extensions.length; ++i)
            cur = extensions[i](cur, args);
        return cur;
    };
}
export function LISS(args, ...extensions) {
    if (extensions.length === 0)
        extensions = DEFAULT_EXTENSIONS;
    let cur = HTMLElement;
    for (let i = 0; i < extensions.length; ++i)
        cur = extensions[i](cur, args);
    return cur;
}
//# sourceMappingURL=index.js.map