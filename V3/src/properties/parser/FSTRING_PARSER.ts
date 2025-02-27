const R1 = /@\{([\w_]+)\}/g;
const R2 = /@([\w_]+)/g;

export default function FSTRING_PARSER(value: string) {
    
    value = value.replaceAll(R1, (_, word) => "${ctx." + word + "}");
    value = value.replaceAll(R2, (_, word) => `ctx.${word}`);

    return new Function("ctx", "return `" + value + "`;");
};