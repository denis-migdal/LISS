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

# Conseils d'utilisation

## Mise à niveau du composant Web

-> ElementHTML
-> defini => transforme les ElementHTML correspondant en X.
-> quand on manipule : des problèmes, peut être upgradé ou non.
=> querySelectorAll(x:defined) => peut en oublier...

=> DOMContentLoaded / document => interactive => ensure all children
    => can't ensure children upgraded : DO NOT DEPEND ON IT, NEVER.
=> could even load => remove body, define, put body back => then upgrade order ensured.

Cela implique qu'il faut le traiter comme un HTML normal.
-> attr/children (string/Nodes)
-> values avec astuce
-> sinon des fonctions externes (waitUpgrade()/upgrade()/etc.)
    -> async (promise) ou sync passif (erreur si pas) ou sync actif (pousse l'upgrade).

## Données

attrs / content => parser (garantir le type autant que possible).
    +> values.
=> attrs/content si def dans fichier HTML + modifié dans inspecteur.

Eviter de manipuler l'HTMLElement directement, problème de upgrade (+ perfs pour attrs/content => converted to Node/String).

Afficher et afficher seulement, pas de manipulation (autant que possible).
Le mieux est données séparées et compo se contente d'afficher
    => même données pour plusieurs compo.
    => récup les données d'un compo => une fois fait peut manipuler sans problèmes.
=> signal / indirectSignal + fonctions...
    => mergerKlass (?)

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

## Dépendances

- shadow child can depend parent (by construction)
- children can't assume he is in a (compatible) father.
- parent must not assume he has children.
- parent -> shadow child => must add as a content_generator deps if known.
- Parent/host child => attach/detach system.
- do NOT call upgrade(this) dans constructeur => appel connectedCallback too soon.
    => upgrade(des children) plutôt

## Heritage

// Only extends HTMLElement, else issues :
    // not supported by all browsers.
    // may not support shadowRoot -> then init can be troublesome.
    // be careful when trying to build : createElement call cstr.
    // if possible, do not expect content (attr good ? no children ?)

## Loading

- non Auto
- blocking="render" (FF not implemented)
- :not(:defined) => visibility: hidden + :not(:defined)::after => loading etc.

</main>
    </body>
</html>