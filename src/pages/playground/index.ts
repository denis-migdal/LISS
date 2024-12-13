import "../docs/skeleton";

const examples = [
    "hello-world",

    // old
    "auto-html",
    "auto-html-tr",
    "auto-html-slots",

    "bry-params"
];

// liss-playground
const playground = document.querySelector<HTMLElement>('liss-playground')!;
function setExample(name: string) {
    selector.value = name;
    playground.removeAttribute('show');
    playground.setAttribute('name', name);
}

// init checkboxes

const checks = [...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];

playground.addEventListener('change', () => {
    const codes = playground.getAttribute('show')!.split(',');
    for(let check of checks)
        check.checked = codes.includes(check.value);
})

for(let check of checks) {

    check.addEventListener('input', (ev) => {

        const target = ev.target! as HTMLInputElement;
        const checked = target.checked;
        const page    = target.value;

        const layouts = playground.getAttribute('show')!.split(',');
        
        if( checked ) {
            if( ! layouts.includes(page) )
                layouts.push(page);
        } else {
            const idx = layouts.indexOf(page );
            if(idx !== -1)
                layouts.splice(idx, 1);
        }

        console.warn("called ?");

        playground.setAttribute('show', layouts.join(','));
    });

}

// init select

const selector = document.querySelector<HTMLSelectElement>('select')!;
//const webcomp_name = document.querySelector<HTMLInputElement>('input')!;

for(let example of examples)
    selector.append( new Option(example, example));

selector.addEventListener('change', () => {
    const url = new URL(location as any);
    url.searchParams.set("example", selector.value);
    history.pushState({}, "", url);

    setExample(selector.value);
});

// init current example

const searchParams = new URLSearchParams(location.search);
const example = searchParams.get('example');

setExample(example ?? "auto-html");