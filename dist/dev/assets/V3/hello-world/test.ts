// @ts-ignore
import addTest from "TESTS";

await addTest(null,
    `<hello-world></hello-world>`,
    async (tagname: string) => {

        // @ts-ignore
        await LISS.assertElement(tagname, {
            shadow_html: "Hello <em>World</em>",
            css: {
                ":host em": {
                    "background-color": "rgb(255, 255, 0)"
                }
            }
        });
    }
)