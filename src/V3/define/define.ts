import ContentGenerator from "V3/ContentGenerators/ContentGenerator";
import { _whenDefinedPromises } from "./whenDefined";

export const WaitingDefine = new Set<string>();

export default async function define(tagname: string, Klass: new(...args:any[]) => HTMLElement) {

    //TODO: Python class...

    //TODO: type safe
    if( "CONTENT_GENERATOR" in Klass ) {
        const generator = Klass.CONTENT_GENERATOR as ContentGenerator;

        if( ! generator.isReady ) {
            WaitingDefine.add(tagname);
            await generator.whenReady;
        }
    }

    WaitingDefine.delete(tagname);
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