// @ts-ignore
import {test} from "TEST_HELPER";

await test("cstr-params-ctrler",
    "",
    async () => {

        // @ts-ignore
        await LISS.importComponent('cstr-params-ctrler');

        // @ts-ignore
        const Controler = await LISS.getControlerCstr('cstr-params-ctrler')

        const ctrler = new Controler("Ctrler");
        document.body.append( ctrler.host );

        // @ts-ignore
        await assertElemEquals('cstr-params-ctrler', {
            shadow_html: "Ctrler"
        });
    }
)