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

Notamment, un composant Web ne doit avoir qu'une, et une seule, responsabilité : usuellement celle d'afficher des données. Un tel composant Web ne doit alors pas être utilisé pour e.g. accéder, générer, récupérer, ou modifier des données. Il prend donc généralement en entrée des données, qu'il se contente d'afficher.

De cela en découle que les attributs et contenu de l'hôte, utilisés comme données d'entrées par le composant Web, ne doivent en aucun cas être modifiés par ce dernier. On peut alors voir un composant Web comme une fonction qui prend en entrée l'hôte, et qui écrit sa sortie dans un <script type="c-js">ShadowRoot</script>.

💡 Dans certains rares cas, le composant Web ne va pas écrire sa sortie dans <script type="c-js">ShadowRoot</script>, mais dans le contenu de l'hôte. Dans ce cas, le composant Web ne doit pas utiliser le contenu de l'hôte comme entrée.

💡 class => internals (TODO)

## Structure de données en entrée

Le composant Web peut aussi prendre en entrée une structure de données, permettant alors leur utilisation à différents endroits, pour différents usages (e.g. affichages, calculs, etc).

Les attributs de l'hôte peuvent alors être utilisés pour configurer l'affichage, ou pour surcharger des propriétés de la structure de données. Il convient d'éviter de tenter de synchroniser les attributs avec la structure de données, ce afin de respecter les principes précédemment énoncés.

💡 Pour détecter les changements dans la structure de données utilisée comme entrée, cf signaux (TODO) + modif + cste.

</main>
    </body>
</html>