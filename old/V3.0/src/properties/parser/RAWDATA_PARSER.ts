export default function RAWDATA_PARSER(value: string) {

    /*
    if( value.includes('%') )
        return generateSignal<any>(value);
    */

    return new Function(`return ${value};`)();
};