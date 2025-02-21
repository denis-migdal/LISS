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

# Créer un composant Web

## Le dossier de composants

Dans LISS, chaque composant Web <script type="c-text"><h>$TAGNAME</h></script> est défini par un ensemble de fichiers contenus dans le dossier <script type="c-text"><h>$CDIR</h>/<h>$TAGNAME</h>/</script>.
Concrètement, votre projet pourra avoir l'arborescence suivante (avec <script type="c-text"><h>$CDIR</h></script> = <script type="c-text">/components/</script>) :

<script type="c-bash">
├── index.html # votre page web.
├── LISS.js    # la bibliothèque LISS
└── components # <h>$CDIR</h>, le répertoire contenant vos composants Web.
    └── hello-world    # défini le composant Web "hello-world".
        ├── index.html # le contenu  du composant Web "hello-world".
        └── index.css  # l'affichage du composant Web "hello-world".
</script>

💡 Par défaut, <script type="c-text"><h>$CDIR</h></script> est donné par l'attribut <script type="c-html">liss-cdir</script> de la balise <script type="c-html"><script></script> important LISS :
<script type="c-html">
    <!DOCTYPE html>
    <html>
        <head>
            ...
            <script type="module" src="<h>$LISS</h>" liss-cdir="<h>$CDIR</h>"><xscript>
        </head>
        <body>...<xbody>
    </html>
</script>

La page Web pourra alors afficher une instance du composant Web via la balise HTML <script type="c-text"><<h>$TAGNAME</h>></script> :

<liss-playground name="hello-world" show="page.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

## Les fichiers du composant Web


### Le contenu (HTML)

Par défaut, le contenu d'un composant Web <script type="c-text"><h>$NAME</h></script> est défini par le fichier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.html</script> :

<liss-playground name="hello-world" show="index.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>


### L'affichage (CSS)

Par défaut, l'affichage d'un composant Web <script type="c-text"><h>$NAME</h></script> est défini par le fichier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.css</script> :

<liss-playground name="hello-world" show="index.css,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

### Le comportement

Par défaut, le comportement d'un composant Web <script type="c-text"><h>$NAME</h></script> est défini par un fichier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.<h>js|ts|bry</h></script>.

⚠ Le contenu et l'affichage définis dans les fichiers <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.<h>html|css</h></script> devront être explicitement chargés.

#### Avec LISS

<liss-playground name="auto-liss" show="index.code,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=auto-liss"><i>Tester l'exemple dans le bac à sable</i></a></div>


#### Sans LISS

<liss-playground name="auto-vanilla" show="index.code,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=auto-vanilla"><i>Tester l'exemple dans le bac à sable</i></a></div>

## Définir le composant Web

### Avec le mode automatique

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

💡 Avec le mode automatique, vous n'avez pas besoin de spécifier le comportement du composant Web via un fichier <script type="c-text"><h>$CDIR</h>/<h>$NAME</h>/index.<h>js|ts|bry</h></script>.

#### Contenu en fonction des attributs

Ce mode permet d'indiquer des placeholders dans le contenu, qui prendront la valeur des attributs de l'hôte :
<liss-playground name="auto-attrs" show="index.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=auto-attrs"><i>Tester l'exemple dans le bac à sable</i></a></div>

Chaque <script type="c-text">${<h>$ATTR</h>}</script> est alors remplacé par la valeur de l'attribut <script type="c-text"><h>$ATTR</h></script> de l'hôte :

<liss-playground name="auto-attrs" show="page.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=auto-attrs"><i>Tester l'exemple dans le bac à sable</i></a></div>

💡 Permis par : AutoContentGenerator (cf content gen) (TODO)

⚠ Pour le moment, les valeurs ne sont pas mises à jour lors de la modification des attributs de l'hôte.

#### Fonctionnement interne (pour les développeurs) (TODO)

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

### Sans le mode automatique

#### En chargeant un composant Web

LISS.load(dst, {cdir, files}); //TODO

#### Manuellement

LISS.define(tagname, klass)

#### En Javascript Vanilla

customElements.define(tagname, klass);

⚠ DOMContentLoaded / document => interactive
    => ensure all children

## (TODO)

- import JS
    - rewrite imports
    - require() outside of playground
- import Py
- import TS
    - convert...

</main>
    </body>
</html>