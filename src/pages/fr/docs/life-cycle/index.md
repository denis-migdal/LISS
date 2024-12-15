<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf8"/>
        <title>LISS</title>
        <!--
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
        -->
        <meta name="color-scheme" content="dark light">
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link   href="./index.css"  rel="stylesheet" blocking="render">
        <script  src="./index.js"  type="module"     blocking="render" async></script>
    </head>
    <body class="hide_h1">
        <main>

# Cycle de vie

LISS défini 4 états pour les composants Web :
- <script type="c-text">LISS_DEFINED</script> : le composant Web a été associé à un nom (de balise). L'hôte peut alors être construit.
- <script type="c-text">LISS_READY</script> : les dépendances du contrôleur ont été résolues. Le contrôleur peut alors être construit.
- <script type="c-text">LISS_UPGRADED</script> : l'élément HTML a été upgradé, l'hôte peut alors être récupéré.
- <script type="c-text">LISS_INITALIZED</script> : le contrôleur a été initialisé, le contrôleur peut alors être récupéré.

<script type="c-text">LISS</script> fournit de nombreuses fonctions permettant de manipuler l'état d'un composant Web :

<table>
    <thead>
        <tr><th>État</th><th>Type</th><th>Flag</th><th>Promise</th><th>Getter</th></tr>
    </thead>
    <tbody>
        <tr><td><script type="c-text">DEFINED</script></td><td>Cstr</td><td><script type="c-js">.isDefined(<h>$E</h>)</script></td><td><script type="c-js">.whenDefined(<h>$E</h>)</script></td><td><script type="c-js">.getHostCstr<h>[Sync]</h>(<h>$E</h>)</script></td></tr>
        <tr><td><script type="c-text">READY</script></td><td>Cstr</td><td><script type="c-js">.isReady(<h>$E</h>)</script></td><td><script type="c-js">.whenReady(<h>$E</h>)</script></td><td><script type="c-js">.getControlerCstr<h>[Sync]</h>(<h>$E</h>)</script></td></tr>
        <tr><td><script type="c-text">UPGRADED</script></td><td>Instance</td><td><script type="c-js">.isUpgraded(<h>$E</h>)</script></td><td><script type="c-js">.whenUpgraded(<h>$E</h>)</script></td><td><script type="c-js">.upgrade<h>[Sync]</h>(<h>$E</h>)</script></td></tr>
        <tr><td><script type="c-text">INITALIZED</script></td><td>Instance</td><td><script type="c-js">.isInitialized(<h>$E</h>)</script></td><td><script type="c-js">.whenInitialized(<h>$E</h>)</script></td><td><script type="c-js">.initialize<h>[Sync]</h>(<h>$E</h>)</script></td></tr>
    </tbody>
</table>

Ils prennent comme arguments :
- <script type="c-text">LISS_DEFINED</script> : un nom de balise, un constructeur d'hôte, un constructeur de contrôleur, ou un élément HTML ;
- <script type="c-text">LISS_READY</script> : un nom de balise, un constructeur d'hôte/de contrôleur, ou un hôte/élément HTML ;
- <script type="c-text">LISS_UPGRADED</script> : un élément HTML ;
- <script type="c-text">LISS_INITIALIZED</script> : un élément HTML, ou une instance d'hôte.

LISS défini aussi d'autres fonctions :
- <script type="c-js">.getHost<h>[Sync]</h>(<h>$E</h>)</script> : un alias de <script type="c-js">.upgrade<h>[Sync]</h>(<h>$E</h>)</script>
- <script type="c-js">.getControler<h>[Sync]</h>(<h>$E</h>)</script> : un alias de <script type="c-js">.initialize<h>[Sync]</h>(<h>$E</h>)</script>
- <script type="c-js">.getName(<h>$E</h>)</script> retourne le nom du composant Web à partir d'un hôte, contrôleur, ou d'un constructeur.
- <script type="c-js">.define(<h>$NAME</h>, <h>$E</h>)</script> associe un nom à un composant Web. Il accepte un constructeur de contrôleur ou d'hôte.<br/>
💡 En mode automatique (TODO: link), il est automatiquement appelé.

+ whenAllDefined

💡 :state
+ other states.
+ visible/active state ?

</main>
    </body>
</html>