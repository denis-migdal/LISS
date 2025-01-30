const body = document.body;

const codes = body.getAttribute("code-langs")?.split(",");

if(codes !== undefined) {

    const url = new URL(location as any);
    let code = url.searchParams.get("code-lang") ?? localStorage.getItem("LISS.code-lang") ?? "js";

    const code_switch = document.createElement('span');
    code_switch.classList.add('code-lang_switch');

    body.setAttribute("code-lang", code );

    let pos = codes.indexOf(code);

    code_switch.addEventListener('click', () => {

        pos = (++pos)%codes.length;
        code = codes[pos];

        const url = new URL(location as any);
        url.searchParams.set("code-lang", code );
        history.pushState({}, "", url);

        localStorage.setItem("LISS.code-lang", code);
        body.setAttribute("code-lang", code );

        body.dispatchEvent( new Event('code-lang_changed') );
    });

    body.append(code_switch);
}