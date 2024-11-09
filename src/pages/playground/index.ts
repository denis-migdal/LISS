import {hl, initContentEditableCode} from "./hl.ts";

let iframe = document.querySelector('iframe')!;

const examples = [
    "auto-html",
    "auto-html-tr",
    "auto-html-slots"
];

const resources = [
    'page.html',
    'index.html',
    'index.css',
    'index.js',
    'index.bry'
]

const searchParams = new URLSearchParams(location.search);
const example = searchParams.get('example');

const selector = document.querySelector<HTMLSelectElement>('select')!;
const webcomp_name = document.querySelector<HTMLInputElement>('input')!;

for(let example of examples)
    selector.append( new Option(example, example));

selector.addEventListener('change', () => {
    const url = new URL(location as any);
    url.searchParams.set("example", selector.value);
    history.pushState({}, "", url);

    setExample(selector.value);
});

webcomp_name.addEventListener('input', update);

if( example !== null)
    setExample(example);


async function fetchResources(name: string) {
    const result = await Promise.all( resources.map( async(file) => {

        const answer = await fetch(`../../assets/examples/${name}/${file}`);

        if( answer.status !== 200 )
            return [file, ""];

        return [file, await answer.text()];
    }) );

    return Object.fromEntries(result);
}

async function setExample(name: string) {

    selector.value = webcomp_name.value = name;

    const files = await fetchResources(name);

    inputs["page"].innerHTML = hl(values["page"] = files["page.html" ], "html");
    inputs["html"].innerHTML = hl(values["html"] = files["index.html"], "html");
    inputs["css" ].innerHTML = hl(values["css" ] = files["index.css" ], "css");

    if( files["index.js"] !== "")
        inputs["js"].innerHTML = hl(values["js"] = files["index.js"], "js");
    else if( files["index.bry"] !== "" )
        inputs["js"].innerHTML = hl(values["js"] = files["index.bry"], "python");
    else
        inputs["js"].innerHTML = values["js"] =  "";
 
    update();
}


function update() {

    const html =
`<!DOCTYPE html>
    <head>
        <style>
            body {
                margin: 0;
                background-color: white;
            }
        </style>
        <script type="module" defer>
            import LISS, {LISSAuto} from '../../index.js';

            const content = "${values.html.replaceAll('\n', '\\n').replaceAll('"', '\\"')}";
            const css     = "${values.css .replaceAll('\n', '\\n').replaceAll('"', '\\"')}";

            const host = document.querySelector('[is]')?.constructor;

            LISS.define('${webcomp_name.value}', LISSAuto(content, css, host) );
        </script>
    </head>
    <body>
${values.page}
    </body>
</html>
`;

    const new_iframe = document.createElement('iframe');
    iframe.replaceWith(new_iframe);
    iframe = new_iframe;

    iframe.src = "about:blank";
    // iframe.srcdoc also possible
    iframe.contentWindow!.document.open();
    iframe.contentWindow!.document.write( html );
    iframe.contentWindow!.document.close();
}

const inputs_names = ['page', 'html', 'css', 'js'];
const inputs: Record<string, HTMLElement> = {};
const values: Record<string, string> = {};

for(let name of inputs_names ) {

    const input = inputs[name] = document.querySelector<HTMLElement>(`#${name}`)!;

    input.addEventListener('input', () => {
        const value = values[name] = input.textContent!;
        localStorage.setItem(name, value);
        update();
    });

    values[name] = input.textContent = localStorage.getItem(name) ?? "";

    initContentEditableCode(input, false);
}

update();