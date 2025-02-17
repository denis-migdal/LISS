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

# Concevoir un composant Web

Il est important de correctement concevoir ses composants Web. Une bonne conception permet de limiter le risque de bugs, et facilite leur développement, maintenance, débogage, et utilisation.

## Responsabilité unique

Un composant Web ne doit avoir qu'une, et une seule, responsabilité : usuellement celle d'afficher des données. Un tel composant Web ne doit alors pas être utilisé pour e.g. accéder, générer, récupérer, ou modifier des données. Il prend donc généralement en entrée des données, qu'il se contente d'afficher.

De cela en découle que les attributs et contenu de l'hôte, utilisés comme données d'entrées par le composant Web, ne doivent en aucun cas être modifiés par ce dernier. On peut alors voir un composant Web comme une fonction qui prend en entrée l'hôte, et qui écrit sa sortie dans un <script type="c-js">ShadowRoot</script>.

💡 Dans certains rares cas, le composant Web ne va pas écrire sa sortie dans <script type="c-js">ShadowRoot</script>, mais dans le contenu de l'hôte. Dans ce cas, le composant Web ne doit pas utiliser le contenu de l'hôte comme entrée.

💡 class => internals (TODO)

## Structure de données en entrée

Le composant Web peut aussi prendre en entrée une structure de données, permettant alors leur utilisation à différents endroits, pour différents usages (e.g. affichages, calculs, etc).

Les attributs de l'hôte peuvent alors être utilisés pour configurer l'affichage, ou pour surcharger des propriétés de la structure de données. Il convient d'éviter de tenter de synchroniser les attributs avec la structure de données, ce afin de respecter les principes précédemment énoncés.

💡 Pour détecter les changements dans la structure de données utilisée comme entrée, cf signaux (TODO) + modif + cste.

## Le problème de la mise à niveau

À sa création, le composant Web est un <script type="c-html">HTMLUnknownElement</script>. Ce n'est que lors de sa mise à niveau qu'il devient le composant Web "complet". Il est donc possible de manipuler le composant Web comme un <script type="c-html">HTMLElement</script> (i.e. changer ses attributs, le contenu de l'hôte, etc.) qu'il soit mis à niveau ou non.

En revanche, les propriétés ajoutées par le composant Web (e.g. méthodes) ne sont disponibles qu'une fois le composant Web mis à niveau. Il serait alors nécessaire de s'assurer que le composant Web est bien mis à niveau avant de l'utiliser en tant que tel. Cela peut donc être source d'erreurs.

Il n'est aussi pas aisé de s'en assurer de manière synchrone (e.g. dans un constructeur). Il faut alors contrôler l'ordre de mise à niveau (et donc de définition) des composants Web.

Il convient ainsi de manipuler le composant Web comme s'il ne sera jamais mis à niveau, i.e. de se contenter de le manipuler comme un <script type="c-html">HTMLElement</script> normal.

[todo: content for astuces]

## Héritage

Il est techniquement possible de créer un composant Web héritant  d'un élément HTML existant (e.g. <script type="c-html"><img/></script>). Cependant, cela est fortement déconseillé :
- ce n'est pas supporté par certains navigateurs ;
- certains éléments HTML ne supportent pas les <script type="c-js">ShadowRoot</script> ;
- ils ne supportent pas les <script type="c-js">ElementInternals</script>.

## Chargement...

Lorsque le composant Web n'est pas encore mis à niveau, le contenu de l'hôte s'affiche, entraînant potentiellement des effets de scintillements.

Il est possible de corriger cela via une simple règle CSS :
<script type="c-css">
:not(:defined) {
    visibility: hidden;

    &::after {
        /* loading */
    }
}
</script>

- blocking="render" (FF not implemented) (peut aider)

</main>
    </body>
</html>