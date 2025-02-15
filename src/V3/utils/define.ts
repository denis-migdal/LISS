import ContentGenerator from "V3/ContentGenerators/ContentGenerator";

const WaitingDefine = new Set<string>();

export default async function define(tagname: string, Klass: new(...args:any[]) => HTMLElement) {

    //TODO: Python class...

    //TODO: type safe
    if( "CONTENT_GENERATOR" in Klass ) {
        const generator = Klass.CONTENT_GENERATOR as ContentGenerator;

        if( ! generator.isReady ) {
            WaitingDefine.add(tagname);
            await generator.whenReady;
            WaitingDefine.delete(tagname);
        }
    }

    customElements.define(tagname, Klass);
}