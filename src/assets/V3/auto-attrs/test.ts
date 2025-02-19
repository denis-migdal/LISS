// @ts-ignore
import addTest from "TESTS";

await addTest(null,
    null,
    async (tagname: string) => {

        // @ts-ignore
        await LISS.assertElement(tagname, {
            shadow_html: `<ul>
    <li>a = 1</li>
    <li>b = 2</li>
    <li>c = 3</li>
</ul>`
        });
    }
)