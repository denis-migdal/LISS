-> CodeBlock (cf .dia)
    -> changes => set value internally...
-> Python
-> Doc
-> Properties struct + getSignal<T>

-> dev
    -> python + TS code
        -> files="js,bry,html" - default (html+css+js) ?
        -> JS: replace imports or true import() when possible (?)
        -> TS code fill JS code (only accepted in playground)
        -> BRY brython script in playground only if brython
            -> .host (HTML) / .content (shadowRoot)
            -> emulate string prefix
                https://stackoverflow.com/questions/37203589/possible-to-make-custom-string-literal-prefixes-in-python

    -> LISS Signal/Properties
        -> Props
            -> .value dupl. {} to avoid sync issues (???)
            -> + attr parser... + getInitialValues + cstr + signals...
                -> decl getter/setter ??? (un peu enquiquinant....)
                -> setter throw except (unsupported value)
        -> test on chartsHTML

-> features
    -> shared css
    -> closest fct ?
    -> globalDelegated event listener (??? -> composedEvent? => matches ?)
    -> inherit (content_generator override...)

-> README.md update

-> doc
    -> home
        -> intro
        -> liens/features
            -> connected
            -> attributeObs
            -> parts
            -> slots
            -> composedEvent
        -> lister les pièges
	-> getting started
        -> DO/DON'T
        -> list features

=====================================

-> update VSHS + ChartsHTML (doc + LISS)

-> playground
    -> show error...
    -> debounce/throttle editor (?)

=====================================

TS2JS

https://stackoverflow.com/questions/12678716/transforming-typescript-into-javascript
https://github.com/niutech/typescript-compile/blob/gh-pages/js/typescript.compile.js

=====================================

// type in different dir
    // https://www.typescriptlang.org/tsconfig/#typeRoots

https://stackoverflow.com/questions/55318663/how-to-generate-d-ts-and-d-ts-map-files-using-webpack

-> CI/CD (build prod) => gitignore prod
    -> https://stackoverflow.com/questions/74727745/github-workflow-where-does-npm-ci-store-the-node-modules-folder

==================== [INFO] ==================== 

Repo: (493kB)
    - 24Mo  -> 4.3Mo (V2 -> V3)
    - 4.3Mo -> 1.3 Mo (use skeletons)

/dist/X :
    - 3.6Mo -> 3.1Mo (dev -> prod)
    - 3.6Mo -> 1.4Mio (use skeletons)

skeleton/liss.js (25.5kB)
    - 4.44Mo -> 73kB (V2 -> V3 + build highlight.js)

liss .js (4.5kB)
    - 173kB -> 12kB (V2 -> V3)

Highlight.js : https://highlightjs.org/download
    -> bash css javascript python shell typescript xml