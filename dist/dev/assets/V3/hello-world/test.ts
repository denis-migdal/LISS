// @ts-ignore
import {test} from "TEST_HELPER";

await test("hello-world",
    `<hello-world></hello-world>`,
    async () => {

        // @ts-ignore
        await LISS.assertElement('hello-world', {
            shadow_html: "Hello <em>World</em>",
            css: {
                ":scope": ""
            }
        });
    }
)