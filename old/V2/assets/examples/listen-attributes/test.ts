// @ts-ignore
import {test} from "TEST_HELPER";

await test("listen-attributes",
    `<listen-attributes></listen-attributes>`,
    async () => {

        const {promise, resolve} = Promise.withResolvers();

        setTimeout( resolve, 500 );

        await promise;

        // @ts-ignore
        await assertElemEquals('listen-attributes', {
            shadow_html: "a=1,a=2,",
            css: {
                ":scope": ""
            }
        });
    }
)