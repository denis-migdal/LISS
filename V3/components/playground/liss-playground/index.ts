import LISS from "@LISS/src";
import buildTestPage from "@LISS/src/utils/tests/buildTestPage";
import PlaygroundArea from "@LISS/components/playground/playground-area/";

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

        let files: string = "";
        if( this.codeLang === "bry")
            files = "bry,html+css";
        if( this.codeLang === "js")
            files = "js,html+css";

        return buildTestPage({
            // liss config
            liss   : `/${LISS.VERSION}/libs/LISS/index.js`,
            cdir   : `${this.klass.ASSETS_DIR}/`,
            files,
            sw     : `/${LISS.VERSION}/assets/sw.js`,
            // page config
            html   : this.codes["page.html"].getCode(),
            js     : this.codes["page.js"  ].getCode(),
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