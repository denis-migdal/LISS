-> Doc
-> Properties struct + getSignal<T> (for VSHS)
-> CodeBlock (cf .dia)
    -> changes => set value internally...

-> update VSHS + ChartsHTML (doc + LISS)

============= [Signal props] ================

-> LISS Signal/Properties
    -> Props
        -> .value dupl. {} to avoid sync issues (???)
        -> + attr parser... + getInitialValues + cstr + signals...
            -> decl getter/setter ??? (un peu enquiquinant....)
            -> setter throw except (unsupported value)
    -> test on chartsHTML

=============== [Features] ===================

-> BLISS: emulate string prefix
    https://stackoverflow.com/questions/37203589/possible-to-make-custom-string-literal-prefixes-in-python
-> features
    -> shared css
    -> closest fct ?
    -> globalDelegated event listener (??? -> composedEvent? => matches ?)
    -> inherit (content_generator override...)

-> playground: show errors...

============== [DOC] ===================

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


============= [TS] ================

-> dev
    -> playground: accept TS code (converted into JS) + unit test on TS.
    -> true import in JS/TS (rewrite them before executing...)

TS2JS

https://stackoverflow.com/questions/12678716/transforming-typescript-into-javascript
https://github.com/niutech/typescript-compile/blob/gh-pages/js/typescript.compile.js

================ [.d.ts] =================

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