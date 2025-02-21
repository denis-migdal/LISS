// @ts-ignore
import {test} from "TEST_HELPER";

await test("host-attr",
    `<host-attr></host-attr>`,
    async () => {

        // @ts-ignore
        await assertElemEquals('host-attr', {
            shadow_html: "42",
            css: {
                ":scope": ""
            }
        });
    }
)