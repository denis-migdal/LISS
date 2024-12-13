// @ts-ignore
import {test} from "TEST_HELPER";

await test("hello-world",
    `<hello-world></hello-world>`,
    async () => {
        // @ts-ignore
        await assertElemEquals('hello-world', {
            shadow_html: "Hello World",
            css: {
                ":scope": ""
            }
        });
    }
)