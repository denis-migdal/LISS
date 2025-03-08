import FSTRING_PARSER from "./FSTRING_PARSER";

export default function FSTRING_ARRAY_PARSER(value: string) {
    
    if( value === "")
        return null;

    let raw_array = [value];
    if( value[0] === "[" && value[value.length-1] === "]")
        raw_array = new Function("return " + value)() as string[];

    //TODO: opti ?
    const array = raw_array.map( raw => FSTRING_PARSER(raw) );

    return (idx: number, ctx: Record<string, any>) => array[idx%array.length]?.(ctx) ?? null;
};