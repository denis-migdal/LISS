import ContentGenerator from "V3/ContentGenerators/ContentGenerator";
import { _whenDefinedPromises } from "./whenDefined";

const WaitingDefine = new Set<string>();

export default async function define(tagname: string, Klass: new(...args:any[]) => HTMLElement) {

    //TODO: Python class...

    console.warn("ask define", tagname, Klass);

    //TODO: type safe
    if( "CONTENT_GENERATOR" in Klass ) {
        const generator = Klass.CONTENT_GENERATOR as ContentGenerator;

        if( ! generator.isReady ) {
            WaitingDefine.add(tagname);
            await generator.whenReady;
            WaitingDefine.delete(tagname);
        }
    }

    console.warn("defined", tagname, Klass);

    customElements.define(tagname, Klass);

    const p = _whenDefinedPromises.get(Klass);
    if( p !== undefined )
        p.resolve();
}

import LISS from "V3/LISS";

declare module "V3/LISS" {
    interface ILISS {
        define: typeof define;
    }
}

LISS.define = define;