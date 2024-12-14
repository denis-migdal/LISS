// @ts-ignore
import {test} from "TEST_HELPER";

await test("cstr-params-ctrler",
    "",
    async () => {

        // @ts-ignore
        await LISS.importComponent('cstr-params-ctrler');

        // @ts-ignore
        await LISS.whenDefined('cstr-params-ctrler');
        // @ts-ignore
        const CstrParams = LISS.getControlerCstr('cstr-params-ctrler')

        const ctrler = new CstrParams("Ctrler");
        document.body.append( ctrler.host );

        // @ts-ignore
        await assertElemEquals('cstr-params-ctrler', {
            shadow_html: "Ctrler"
        });
    }
)