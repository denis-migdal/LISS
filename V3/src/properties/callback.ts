export const names = Symbol();

export default function CALLBACK( fct: (args: Record<string,any>) => any) {

    if( (fct as any)[names] === undefined ) {
        console.warn("set");
        const str = fct.toString();
        (fct as any)[names] = str.slice(2, str.indexOf("})") ).split(",").map(e => e.trim() );
    }

    return fct;
}