// @ts-ignore
import addTest from "TESTS";

await addTest("hello-world",
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