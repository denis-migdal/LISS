import LISS from "../../../../../index";
import PlaygroundArea from "../playground-area/PlaygroundArea";


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

    generateAuto(codes: Record<string, string>) {

        const webcomp_name = this.host.getAttribute('example')!;

        const cmpjs = `const host = document.querySelector('[is]')?.constructor;
const content_generator = LISSAuto_ContentGenerator;
LISS.define('${webcomp_name}', LISS({host, html, css, content_generator}) );`;
    
        return this.generateJS(codes);
    }
    // TODO: register wrap + import wrap
    generateBry(codes: Record<string, string>) {

        let code = codes["index.bry"];

        code = `def wrap(js_klass):

    class Wrapper:

        _js_klass = js_klass
        _js = None

        def __init__(self, *args):
            self._js = js_klass.new(*args)

        def __getattr__(self, name: str):
            return self._js[name];

        def __setattr__(self, name: str, value):
            if name == "_js":
                super().__setattr__(name, value)
                return
            self._js[name] = value

    return Wrapper
    
${code}

${codes["page.bry"]}
`;

        const jscode = `
const $B = globalThis.__BRYTHON__;
const jscode = $B.pythonToJS(\`${code}\`);
const fct = new Function(jscode);
fct();
`;

        return this.generateJS(codes);
    }
    generateJS(codes: Record<string, string>) {

        const webcomp_name = this.host.getAttribute('name')!;

        let c_html = codes["index.html"].replaceAll('\n', '\\n').replaceAll('"', '\\"');
        let c_css  = codes["index.css" ].replaceAll('\n', '\\n').replaceAll('"', '\\"');
        let c_bry  = codes["index.bry" ].replaceAll('\n', '\\n').replaceAll('"', '\\"');

        const p_js    = "";//codes["page.js" ];
        const p_html  = codes["page.html" ];

        const result = `<!DOCTYPE html>
    <head>
        <style>
            body {
                margin: 0;
                background-color: white;
            }
        </style>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.13.0/brython.min.js"></script>
        <script type="module" defer>
            //TODO ?
            import LISS from '/dist/dev/index.js';

            window.LISS = LISS;

            const files = {
                "index.bry" : "${c_bry }",
                "index.html": "${c_html}",
                "index.css" : "${c_css }",
            }

            //TODO...
            window.require = async function(path) {
                console.warn("called");
            }

            await LISS.importComponent("${webcomp_name}", {
                cdir   : null, //TODO...
                brython: true, //TODO...
                host   : HTMLElement, //TODO...
                files
            } );

            //await LISS.whenAllDefined();

            ${p_js}
        </script>
    </head>
    <body>
${p_html}
    </body>
</html>
`;

        return result;
    }

    override async generateIFrameContent() {

        const codes = this.getAllCodes();

        if( codes['index.js' ] !== "" )
            return this.generateJS(codes);
        if( codes['index.bry'] !== "")
            return this.generateBry(codes);

        return this.generateAuto(codes);
    }
}

LISS.define('liss-playground', LISSPlayground);