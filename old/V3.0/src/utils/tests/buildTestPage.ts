// <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.13.0/brython.min.js"></script>

export default function buildTestPage(args: {
        // liss config
        liss: string,
        cdir: string,
        files?: string,
        sw ?: string,
        // page config
        js  : string,
        html: string,
        tagname?: string
    }) {

    if( args.js === "" && args.html == "" && args.tagname !== undefined)
        args.html = `<${args.tagname}></${args.tagname}>`;

    return `<!DOCTYPE html>
        <head>
            <style>
                body {
                    margin: 0;
                    background-color: white;
                }
                :not(:defined) {
                    visibility: hidden;
                }
            </style>
            ${
                args.files === "" || args.files === undefined || args.files?.includes("bry")
                    ? `<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/brython@3/brython.min.js" defer></script>`
                    : ""
            }
            <script type="importmap">
            {
                "imports": {
                    "@LISS": "${args.liss}"
                }
            }
            </script>
            <script type="module" src='${args.liss}'
                    liss-sw="${args.sw ?? ""}"
                    liss-mode="auto-load"
                    liss-cdir="${args.cdir}"
                    liss-files="${args.files ?? ""}"
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