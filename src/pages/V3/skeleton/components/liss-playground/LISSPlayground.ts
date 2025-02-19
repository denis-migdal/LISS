import LISS from "V3";
import buildTestPage from "V3/utils/tests/buildTestPage";
import PlaygroundArea, { rootdir } from "pages/V3/skeleton/components/playground-area/PlaygroundArea";

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

class LISSPlayground extends PlaygroundArea {

    constructor() {
        super(resources);
    }

    override get ASSETS_DIR() {
        return `${rootdir}/dist/dev/assets/${VERSION}`;
    };

    override generateIFrameContext() {
        
        const codes = this.getAllCodes(); // TODO select code...

        const tagname = this.host.getAttribute('name');

        const cwd = `${location.origin}${this.ASSETS_DIR}/${tagname}/`;

        let files: Record<string, string> = {};
        for(let ext of ["html", "css", "js"])
            files[`${cwd}index.${ext}`] = codes[`index.${ext}`];

        return {
            fetch: {
                cwd,
                files
            }
        }
    }
    
    override async generateIFrameContent() {

        const codes = this.getAllCodes();

        /*
        const brython = this.host.hasAttribute("brython");
        let p_js    = codes["page.js"   ];
        if( brython )
            p_js = `globalThis.__BRYTHON__.runPythonSource(\`${codes["page.bry"]}\`, "_");`;
        */

        return buildTestPage({
            liss: `${rootdir}/dist/dev/index.js`,
            cdir: `${this.ASSETS_DIR}/`,
            js  : codes["page.js"  ],
            html: codes["page.html"]
        })
    }
}

function escapeStr(data: undefined|string) {
    if(data === undefined || data === "")
        return undefined;
    return '"' + data.replaceAll('\n', '\\n').replaceAll('"', '\\"') + '"';
}

LISS.define('liss-playground', LISSPlayground);