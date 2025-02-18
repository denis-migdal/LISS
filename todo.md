-> unit tests
    -> use https://github.com/denoland/deno/issues/27681 bdd testing ?
        -> beforeAll / afterAll (to start/close the browser)
    -> v3 + autoload
        -> function to generate the page.
        -> + sw.js
    -> default HTML tag if not given

-> doc
	-> simple tuto + do/don't

-> dev+doc
    -> playground : if no pages => default tag
    -> LISS Update/Signal/Properties
    -> add shared css

-> dev
    -> python + TS code
        -> files="js,bry,html" - default (html+css+js) ?
        -> JS: replace imports or true import() when possible (?)
        -> TS code fill JS code (only accepted in playground)
        -> BRY brython script in playground only if brython
            -> emulate string prefix
                https://stackoverflow.com/questions/37203589/possible-to-make-custom-string-literal-prefixes-in-python

-> refactor
	-> SW in playground (+doc?)
	-> update VSHS + ChartsHTML (doc + LISS)

// TODO: playground
    // TODO: show error...
    // TODO: debounce/throttle editor...

-> doc vanilla DOM ?
    -> connected
    -> attributeObs
    -> parts
    -> slots
    -> composedEvent

-> closest fct ?
-> globalDelegated event listener (??? -> composedEvent? => matches ?)

-> README.md update