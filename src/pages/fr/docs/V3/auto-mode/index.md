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


## Contenu en fonction des attributs

Le mode automatique de LISS permet d'*initialiser* le contenu du composant Web à partir des attributs de l'hôte :

<liss-playground name="auto-attrs" show="page.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=auto-attrs"><i>Tester l'exemple dans le bac à sable</i></a></div>

Dans le contenu du composant Web, chaque <script type="c-text">${<h>$ATTR</h>}</script> est remplacé par la valeur de l'attribut <script type="c-text"><h>$ATTR</h></script> de l'hôte :

<liss-playground name="auto-attrs" show="index.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=auto-attrs"><i>Tester l'exemple dans le bac à sable</i></a></div>

💡 Permis par : AutoContentGenerator (cf content gen)

⚠ Pour le moment, les valeurs ne sont pas mises à jour lors de la modification des attributs de l'hôte.

## Définir l'affichage

Par défaut, l'affichage d'un composant Web <script type="c-text"><h>$NAME</h></script> est défini par le fichier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.css</script> :

<liss-playground name="hello-world" show="index.css,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

## Définir le comportement

Par défaut, le comportement d'un composant Web <script type="c-text"><h>$NAME</h></script> est défini par un fichier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.<h>js|ts|bry</h></script>.

⚠ Le contenu et l'affichage définis dans les fichiers <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.<h>html|css</h></script> devront être explicitement chargés.

### Avec LISS

<liss-playground name="auto-liss" show="index.code,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=auto-liss"><i>Tester l'exemple dans le bac à sable</i></a></div>


### Sans LISS

<liss-playground name="auto-vanilla" show="index.code,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=auto-vanilla"><i>Tester l'exemple dans le bac à sable</i></a></div>

- import JS
    - rewrite imports
    - require() outside of playground
- import Py
- import TS
    - convert...

## Fonctionnement interne (pour les développeurs)

1. si script liss-mode=auto-load + liss-cdir
1. detect all tags
1. addTag if not defined (check if already defined)
1. importComponentV3 (fetch files from cdir)
    1. _fetchText() => override if playground.
1. defineWebComponentV3 (build class + define it)


-> fetch
-> donc requêtes/certaines inutile, pas perfs, proto/dev.

Le mode automatique de LISS est principalement conçu pour la conception de prototypes. Il n'est ainsi pas conçu pour être performant.

Si vous souhaitez plus de performances, il vous faudra alors utiliser le mode non-automatique.

</main>
    </body>
</html>