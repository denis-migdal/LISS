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

# Mode automatique

Le mode automatique de LISS permet d'importer automatiquement les composants Web utilisés par la page Web.\
*⚠ Ce mode est principalement conçu pour être utilisé lors la phase de prototypage/conception d'une page Web.*

Il s'utilise en ajoutant une balise <script type="c-html"><script></script> à la page web :
<script type="c-html">
    <!DOCTYPE html>
    <html>
        <head>
            ...
            <script type="module" src="<h>$LISS</h>"
                liss-cdir="<h>$CDIR</h>"
                liss-mode="auto-load"
            ><xscript>
        </head>
        <body>...<xbody>
    </html>
</script>

Chaque composant Web <script type="c-text"><h>$NAME</h></script> est alors défini par un ensemble de fichiers contenus dans le dossier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/</script>.\
Concrètement, votre projet pourra avoir l'arborescence suivante (avec <script type="c-text"><h>$CDIR</h></script> = <script type="c-text">/components/</script>) :

<script type="c-bash">
├── index.html # votre page web.
├── LISS.js    # la bibliothèque LISS
└── components # <h>$CDIR</h>, le répertoire contenant vos composants Web.
    └── hello-world    # défini le composant Web "hello-world".
        ├── index.html # le contenu  du composant Web "hello-world".
        └── index.css  # l'affichage du composant Web "hello-world".
</script>

La page Web pourra alors afficher une instance du composant Web via la balise HTML <script type="c-text"><<h>$NAME</h>></script> :

<liss-playground name="hello-world" show="page.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

## Définir le contenu

Par défaut, le contenu d'un composant Web <script type="c-text"><h>$NAME</h></script> est défini par le fichier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.html</script> :

<liss-playground name="hello-world" show="index.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

## Définir l'affichage

Par défaut, l'affichage d'un composant Web <script type="c-text"><h>$NAME</h></script> est défini par le fichier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.css</script> :

<liss-playground name="hello-world" show="index.css,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

## Définir le comportement

## Contenu en fonction des attributs


-> HTML possible
-> quelques fonctionnalités avancées en mode automatique si pas de JS/Brython pour faciliter le prototypage

Le contenu du composant Web peut être dynamique, i.e. dépendre de l'élément hôte.

Le contenu de votre composant Web peut dépendre des attributs de l'élément hôte.
Pour indiquer cela, il suffit d'ajouter à votre composant Web des valeurs "magiques" avec `${}` :
```html
Hello ${name}
```

À l'initialisation du composant Web, LISS remplace les `${ATTR_NAME}` par la valeur de l'attribut `ATTR_NAME` de l'hôte, e.g. :
```html
<hello-world name="user"></hello-world>
<!-- affiche "Hello user" -->
```

💡 Ce comportement "magique" est une fonctionnalité du mode automatique de LISS permettant de définir du contenu dynamique sans nécessiter de JS/Brython.

⚠ Par défaut, `${ATTR_NAME}` n'est fixé qu'à l'initialisé du composant Web, il n'est ainsi pas mis à jour si l'attribut correspondant est modifié par la suite.

⚠ Pour le moment, `${ATTR_NAME}` ne fonctionne que pour du texte. Il ne fonctionne pas à l'intérieur des attributs HTML.

## Fonctionnement interne (pour les développeurs)

1. si script liss-mode=auto-load + liss-cdir
1. detect all tags
1. addTag if not defined (check if already defined)
1. importComponentV3 (fetch files from cdir)
1. defineWebComponentV3 (build class + define it)


-> fetch
-> donc requêtes/certaines inutile, pas perfs, proto/dev.

Le mode automatique de LISS est principalement conçu pour la conception de prototypes. Il n'est ainsi pas conçu pour être performant.

Si vous souhaitez plus de performances, il vous faudra alors utiliser le mode non-automatique.

</main>
    </body>
</html>