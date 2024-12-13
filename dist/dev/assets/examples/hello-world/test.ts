// @ts-ignore
import {test} from "TEST_HELPER";

await test("hello-world",
    `<hello-world></hello-world>`,
    async () => {
        const elem = document.querySelector('hello-world');
        if( elem === null )
            throw new Error("Component not found");

        // @ts-ignore
        await LISS.whenInitialized(elem);

        if( elem.shadowRoot!.innerHTML !== "Hello World")
            throw new Error("innerHTML mismatch");
    }
)