<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf8"/>
        <title>LISS</title>
        <meta name="color-scheme" content="dark light">
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link   href="./index.css"  rel="stylesheet" blocking="render">
        <script  src="./index.js"  type="module"     blocking="render" async></script>
    </head>
    <body code-langs="js,bry">
        <main>

# Signaux / update / Sync / Events

    => properties : block/unblock...
        => lazy props ? (generate quand même when access ?)

requestUpdate
    - validate/require all valid (si each signals)
        -> onUpdate() [par defaut, rien]
        -> clear()    [par defaut, recreer le HTML de 0].
    - peut être throttle pour opti.

Constant instance ou special update (updateAll)
    => recréer ou set (pas garanti)
        => recréer : évite mises à jour struct non notifiées.
        => merger
            => key/value
            => another merger
            => lazy .get => si changements problèmes.
                => trigger event...
                => valeur peut-être changée, mais ok.
                    => merge ROSignal & indirect ?
                    => props is a signal.

</main>
    </body>
</html>