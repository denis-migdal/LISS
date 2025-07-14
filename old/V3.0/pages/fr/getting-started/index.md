<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf8"/>
        <title>LISS</title>
        <meta name="color-scheme" content="dark light">
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link   href="/V3/skeleton/index.css"  rel="stylesheet">
        <script  src="/V3/skeleton/index.js"  type="module"     blocking="render" async></script>
    </head>
    <body code-langs="js,bry">
        <main>

# Prise en main

Créez votre premier composant Web LISS en 6 petites étapes.

## Création de votre page Web

La première étape est de créer votre première page Web en incluant la bibliothèque LISS *en mode automatique* :
<script type="c-html">
    <!DOCTYPE html>
    <html>
        <head>
            ...
            <script type="module" src="<h>/libs/LISS/</h>"
                liss-cdir="<h>/components/</h>"
                liss-mode="<h>auto-load</h>"
            <xscript>
        </head>
        <body>
        <xbody>
    </html>
</script>

Nous partirons du principe que votre projet aura l'arborescence suivante :
<script type="c-bash">
/
├── index.html  # votre page web.
├── libs/
|   └── LISS/   # la bibliothèque LISS
|       └── index.js
└── components/ # le répertoire qui contiendra vos composants Web.
</script>

## Remplir votre page Web

La seconde étape est tout simplement d'écrire le contenu de votre page Web :

<liss-playground name="hello-world:0" show="page.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

Comme vous pouvez le constater, rien ne s'affiche aux endroits où vous avez placé votre composant Web.\
Cela est normal, puisque vous ne l'avez pas encore défini.

## Créer votre composant Web

Nous allons donc définir la structure initial de notre composant Web via un fichier <script type="c-html">index.html</script> :

<liss-playground name="hello-world:1" show="index.html,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

Ce fichier devra alors être placé dans le dossier définissant <script type="c-html"><<h>hello-world</h>></script>, i.e. <script type="c-text">/components/<h>hello-world</h>/</script> :

<script type="c-bash">
/
├── index.html  # votre page web.
├── libs/
|   └── LISS/   # la bibliothèque LISS
|       └── index.js
└── components/ # le répertoire qui contiendra vos composants Web.
    └── <h>hello-world</h>/
        └── index.html
</script>

## Mettre en forme votre composant Web

Vous pouvez ensuite ajouter des règles CSS à votre composant Web via un fichier <script type="c-text">index.css</script> :

<liss-playground name="hello-world" show="index.css,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

Ce fichier devra alors être placé dans le dossier définissant <script type="c-html"><<h>hello-world</h>></script>, i.e. <script type="c-text">/components/<h>hello-world</h>/</script> :

<script type="c-bash">
/
├── index.html  # votre page web.
├── libs/
|   └── LISS/   # la bibliothèque LISS
|       └── index.js
└── components/ # le répertoire qui contiendra vos composants Web.
    └── <h>hello-world</h>/
        ├── index.css
        └── index.html
</script>


## Définir le comportement de votre composant Web

Vous pouvez ensuite définir le comportement de votre composant Web via un fichier <script type="c-text">index.<h>js|bry</h></script> :

<liss-playground name="hello-world:3" show="index.js,output">
</liss-playground>
<div style="text-align:right"><a href="../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

💡 Hériter de <script type="c-js">LISS()</script> vous permettra d'utiliser l'ensemble des fonctionnalités de LISS. En fonction des fonctionnalités que vous souhaitez utiliser, il vous est aussi possible d'hériter d'autres classes, e.g. d'hériter directement de <script type="c-js">HTMLElement</script>.

Ce fichier devra alors être placé dans le dossier définissant <script type="c-html"><<h>hello-world</h>></script>, i.e. <script type="c-text">/components/<h>hello-world</h>/</script> :

<script type="c-bash">
/
├── index.html  # votre page web.
├── libs/
|   └── LISS/   # la bibliothèque LISS
|       └── index.js
└── components/ # le répertoire qui contiendra vos composants Web.
    └── <h>hello-world</h>/
        ├── index.css
        ├── index.html
        └── index.<h>js|bry</h>
</script>

## Utiliser les fonctionnalités de LISS

- HTMLElement (standard)
    - doc

- feature LISS
    - load/define
    - require
    - this.content / this.host
    - ...

## <span style="color:green">DO</span>/<span style="color:red">DON'T</span>


<span style="color:red"><strong>DON'T :</strong></span>

- Hériter d'un élément HTML autre que <script type="c-html">HTMLElement</script>.
- Modifier les attributs et le contenu de l'hôte à partir du composant Web.
- Définir manuellement un composant Web avant que le DOM n'ai fini de se charger.
- Considérer qu'un composant Web a été mis à niveau.

<span style="color:green"><strong>DO :</strong></span>

- Attendre que le DOM ai fini de se charger avant de définir manuellement des composants Web.
- Manipuler un composant Web comme un <script type="c-html">HTMLElement</script> (i.e. comme s'il n'avait pas été mis à niveau).

</div>

</main>
    </body>
</html>