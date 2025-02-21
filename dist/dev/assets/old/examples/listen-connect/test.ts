// @ts-ignore
import {test} from "TEST_HELPER";

await test("listen-connect",
    `<listen-connect></listen-connect>`,
    async () => {

        const {promise, resolve} = Promise.withResolvers();

        setTimeout( resolve, 500 );

        await promise;

        // @ts-ignore
        await assertElemEquals('listen-connect', {
            shadow_html: "+true,-false,+true,",
            css: {
                ":scope": ""
            }
        });
    }
)