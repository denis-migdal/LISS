import LISS from "../../V2";
import PlaygroundArea, { rootdir } from "pages/docs/skeleton/code/playground-area/PlaygroundArea";

const VERSION = "V3";

const resources = [{
        file : 'index.html',
        lang : 'html',
        title: 'WebComponent HTML'
    },{
        file : 'index.js',
        lang : 'js',
        title: 'WebComponent JS'
    },{
        file : 'index.bry',
        lang : 'python',
        title: 'WebComponent Brython'
    },{
        file : 'index.css',
        lang : 'css',
        title: 'WebComponent CSS'
    },{
        file : 'page.html',
        lang : 'html',
        title: 'WebPage HTML'
    },{
        file : 'page.js',
        lang : 'js',
        title: 'WebPage JS'
    },{
        file : 'page.bry',
        lang : 'python',
        title: 'WebPage Brython'
    },
]

class LISSPlayground extends LISS({extends: PlaygroundArea}) {

    constructor() {
        super(resources);
    }

    override get ASSETS_DIR() {
        return `${rootdir}/dist/dev/assets/${VERSION}`;
    }; 
    
    override async generateIFrameContent() {

        const codes = this.getAllCodes();

        const webcomp_name = this.host.getAttribute('name')!;

        const brython = this.host.hasAttribute("brython");
        let file = brython ? "index.bry" : "index.js";
        let code = brython ? escapeStr(codes["index.bry" ])
                           : escapeStr(codes["index.js"  ]);

        let c_html = escapeStr(codes["index.html"])
        let c_css  = escapeStr(codes["index.css" ]);

        let p_js    = codes["page.js"   ];
        if( brython )
            p_js = `globalThis.__BRYTHON__.runPythonSource(\`${codes["page.bry"]}\`, "_");`;

        const p_html  = codes["page.html" ];

        return `<!DOCTYPE html>
    <head>
        <style>
            body {
                margin: 0;
                background-color: white;
            }
        </style>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.13.0/brython.min.js"></script>
        <script type="module" src='${rootdir}/dist/dev/index.js'
                liss-mode="auto-load"
                liss-cdir="${this.ASSETS_DIR}/"
        ></script>
        <script type="module">
            ${p_js}
        </script>
    </head>
    <body>
        ${p_html}
    </body>
</html>
`;
    }
}

function escapeStr(data: undefined|string) {
    if(data === undefined || data === "")
        return undefined;
    return '"' + data.replaceAll('\n', '\\n').replaceAll('"', '\\"') + '"';
}

LISS.define('liss-playground', LISSPlayground);