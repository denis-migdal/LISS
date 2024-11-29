import LISS from "../../../../../index";
import PlaygroundArea from "../playground-area/PlaygroundArea";


const resources = [{
        file : 'index.js',
        lang : 'js',
        title: 'Rule JS'
    },{
        file : 'index.bry',
        lang : 'python',
        title: 'Rule Bry'
    },
]

class VSHSPlayground extends LISS({extends: PlaygroundArea}) {

    constructor() {
        super(resources);
    }

    override async generateIFrameContent() {

        const codes = this.getAllCodes();

        if( codes["index.js"] === "") {

            let code = codes["index.bry"];

            codes["index.js"] = `const $B = globalThis.__BRYTHON__;
            
const result = $B.runPythonSource(\`${code}\`);
const imported = [...Object.values(__BRYTHON__.imported)];
const last = imported[imported.length-1];

export default last.Rule;
`;

        }


        const blob = new Blob([codes["index.js"]], {type: "application/javascript"});
        const rule = (await import( /* webpackIgnore: true */ URL.createObjectURL(blob) )).default;

        console.warn("?", rule);

        let result = rule(); //TODO: args

        if( typeof result !== "string") {

            if( "$strings" in result)
                result = result.$strings;

            result = JSON.stringify(result, null, 4);
            result = new Blob([result], {type: "application/json"});
        }

        return result;
    }
}

LISS.define('vshs-playground', VSHSPlayground);