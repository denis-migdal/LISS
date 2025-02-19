// <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.13.0/brython.min.js"></script>

export default function buildTestPage(args: {liss: string, cdir: string, js: string, html: string}) {

    return `<!DOCTYPE html>
        <head>
            <style>
                body {
                    margin: 0;
                    background-color: white;
                }
            </style>
            <script type="module" src='${args.liss}'
                    liss-mode="auto-load"
                    liss-cdir="${args.cdir}"
            ></script>
            <script type="module">
                ${args.js}
            </script>
        </head>
        <body>
            ${args.html}
        </body>
    </html>`;

}