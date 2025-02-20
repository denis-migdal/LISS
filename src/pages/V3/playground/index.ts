import "pages/V3/skeleton";
import "pages/V3/skeleton/components/liss-playground/LISSPlayground";
import PlaygroundArea from "../skeleton/components/playground-area/PlaygroundArea";

const examples = [
    "hello-world",
    "auto-liss",
    "auto-vanilla",
    "auto-attrs"
];

const DEFAULT_EXAMPLE = "hello-world";

// liss-playground
const playground = document.querySelector<PlaygroundArea>('liss-playground')!;

// init checkboxes

const checks = [...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];

playground.addEventListener('change', () => {
    console.warn("called ???");
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

        playground.setAttribute('show', layouts.join(','));
    });

}

// init select

function setExample(name: string) {
    selector.value = name;
    //playground.removeAttribute('show'); // this is an issue...
    playground.name = name;
}

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
const example      = searchParams.get('example');

setExample(example ?? DEFAULT_EXAMPLE);