// @ts-ignore

//TODO: redo

import {test} from "TEST_HELPER";

await test("auto-html",
    `<auto-html name="user"></auto-html>`,
    async () => {

        // @ts-ignore
        await assertElemEquals('auto-html', {
            shadow_html: "Hello user"
        });
    }
)