// @ts-ignore
import {test} from "TEST_HELPER";

await test("cstr-params",
    `<cstr-params></cstr-params>`,
    async () => {

        // @ts-ignore
        await assertElemEquals('cstr-params', {
            shadow_html: "HTML"
        });
    }
)