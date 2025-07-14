import FutureEvent from "./utils/FutureEvents";
import { Cstr } from "./utils/types";

export default async function define(tagname: string, Klass: Cstr<HTMLElement>) {

    if( hasDefineAfter(Klass) && ! Klass.defineAfter.isDone )
        await Klass.defineAfter;
        
    customElements.define(tagname, Klass);
}

function hasDefineAfter<T extends Cstr<HTMLElement>>(Klass: T)
                                        : Klass is T & { defineAfter: FutureEvent } {
    return "defineAfter" in Klass;
}