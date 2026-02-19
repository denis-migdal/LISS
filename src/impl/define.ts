import FutureEvent from "../utils/FutureEvents";
import { Cstr }    from "@MWL/types/Cstr";

/**
 * @param Klass 
 * @param tagname_or_prefix ending with "-" => is a prefix.
 */
export default async function define(Klass            : Cstr<HTMLElement>,
                                     tagname_or_prefix: string|null = null) {

    const tagname = getFullTagname(Klass, tagname_or_prefix);
    customElements.define(tagname, Klass);
}

function hasDefineAfter<T extends Cstr<HTMLElement>>(Klass: T)
                                        : Klass is T & { defineAfter: FutureEvent } {
    return "defineAfter" in Klass;
}


function getFullTagname(Klass            : Cstr<HTMLElement>,
                        tagname_or_prefix: string|null = null) {

    let prefix: string|null  = null;
    if( tagname_or_prefix !== null && tagname_or_prefix.at(-1) === "-" )
        prefix = tagname_or_prefix;

    let tagname = tagname_or_prefix!;
    if( tagname_or_prefix === null || prefix !== null )
        tagname = Klass.name.replaceAll(/([A-Z])/g, (a) => "-" + a.toLowerCase())
                            .slice(1);

    if( prefix !== null )
        tagname = prefix + tagname;

    return tagname;
}