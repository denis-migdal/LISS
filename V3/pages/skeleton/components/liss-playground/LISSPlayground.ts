import LISS from "src";
import buildTestPage from "src/utils/tests/buildTestPage";
import PlaygroundArea from "pages/skeleton/components/playground-area/PlaygroundArea";

class LISSPlayground extends PlaygroundArea {

    override generateIFrameContext() {
        
        const tagname = this.name;

        const cwd = `${location.origin}${this.klass.ASSETS_DIR}/${tagname}/`;

        let files: Record<string, string> = {};
        for(let ext of ["html", "css", "js"])
            files[`${cwd}index.${ext}`] = this.codes[`index.${ext}`].getCode();        

        return {
            override_tags: {
                [this.name!.split(':')[0]]: this.name
            },
            fetch: {
                cwd,
                files
            }
        }
    }
    
    override generateIFrameContent() {

        /*
        const brython = this.host.hasAttribute("brython");
        let p_js    = codes["page.js"   ];
        if( brython )
            p_js = `globalThis.__BRYTHON__.runPythonSource(\`${codes["page.bry"]}\`, "_");`;
        */

        return buildTestPage({
            liss   : `/${LISS.VERSION}/libs/LISS/index.js`,
            cdir   : `${this.klass.ASSETS_DIR}/`,
            js     : this.codes["page.js"  ].getCode(),
            html   : this.codes["page.html"].getCode(),
            tagname: this.name!.split(':')[0],
        })
    }

    protected static override RESSOURCES = [
        { title: 'WebComponent HTML',    file : 'index.html' },
        { title: 'WebComponent JS',      file : 'index.js'   },
        { title: 'WebComponent Brython', file : 'index.bry'  },
        { title: 'WebComponent CSS',     file : 'index.css'  },

        { title: 'WebPage HTML',         file : 'page.html'  },
        { title: 'WebPage JS',           file : 'page.js'    },
        { title: 'WebPage Brython',      file : 'page.bry'   },
    ];
}

LISS.define('liss-playground', LISSPlayground);

declare global {

    interface LISSContext {
        override_tags?: Record<string, string>
    }

    var LISSContext: LISSContext;
    
}