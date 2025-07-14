// @ts-ignore
import {test} from "TEST_HELPER";

await test("cstr-params-host",
    "",
    async () => {

        // @ts-ignore
        await LISS.importComponent('cstr-params-host');

        // @ts-ignore
        const Host = await LISS.getHostCstr('cstr-params-host')

        const host = new Host("Host");
        document.body.append( host );

        // @ts-ignore
        await assertElemEquals('cstr-params-host', {
            shadow_html: "Host"
        });
    }
)