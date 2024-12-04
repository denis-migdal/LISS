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