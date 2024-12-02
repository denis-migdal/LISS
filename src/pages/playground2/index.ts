import "../docs/skeleton/";

{
    const code_switch = document.createElement('span');
    code_switch.classList.add('code_switch');

    const body = document.body;

    const url = new URL(location as any);
    const is_bry = url.searchParams.get("bry") === "true";

    body.classList.toggle('code_js' , !is_bry);
    body.classList.toggle('code_bry',  is_bry);

    code_switch.addEventListener('click', () => {
        body.classList.toggle('code_js');
        body.classList.toggle('code_bry');

        const url = new URL(location as any);
        url.searchParams.set("bry", `${body.classList.contains('code_bry')}` );
        history.pushState({}, "", url);

        body.dispatchEvent( new Event('code_changed') );
    });

    body.append(code_switch);
}

const examples = [
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

            const isJS  = page.endsWith('.js');
            const isBry = page.endsWith('.bry');

            if( isJS || isBry ) {
                
                let  ext = isJS ? "js"  : "bry";
                let rext = isJS ? "bry" : "js";
                let rpage = page.slice(0, - ext.length - 1) + "." + rext;

                const rcheck = checks.find( c => c.value === rpage)!;
                rcheck.checked = false;
                
                const idx = layouts.indexOf(rpage);
                if(idx !== -1)
                    layouts.splice(idx, 1, page);
            }

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
if( example !== null)
    setExample(example);