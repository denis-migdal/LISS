-> dev+doc
    -> LISS Update/Signal/Properties
        -> setInterval (after a setAFR) + count / throttled update strat (count)
            -> force await finished.
            -> throttle signal or function call ?
                -> do not send event if not read yet...
                -> throttler-debouncer / enabler...
                (rester simple...)
        -> Signal<T>
            -> Signal extends IndirectSignal (?)
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

-> dev
    -> python + TS code
        -> files="js,bry,html" - default (html+css+js) ?
        -> JS: replace imports or true import() when possible (?)
        -> TS code fill JS code (only accepted in playground)
        -> BRY brython script in playground only if brython
            -> emulate string prefix
                https://stackoverflow.com/questions/37203589/possible-to-make-custom-string-literal-prefixes-in-python

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

-> auto-load/playground/unit test
    -> hide failed fetch

-> playground
    -> show error...
    -> debounce/throttle editor (?)
