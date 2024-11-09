# LISS auto mode

LISS possède un mode automatique permettant de très aisément créer des prototypes, sans vous soucier des détails techniques sous-jacents.

Son fonctionnement est très simple :
1. Créez un répertoire qui contiendra vos différents composants Web.
2. Dans ce répertoire, créez un nouveau composant Web en ajoutant un dossier du nom de votre composant.
3. Définissez le contenu, affichage, et/ou comportement de votre composant Web via des fichiers HTML, CSS, et/ou JS, Brython.

Concrètement, votre projet pourra contenir les fichiers suivants :

```
├── index.html // votre page web.
├── LISS.js    // la bibliothèse LISS
└── components // le répertoire contenant vos composants Web.
    └── hello-world // votre premier composant Web.
        ├── index.html // le contenu  de votre composant Web.
        └── index.css  // l'affichage de votre composant Web.
```

*Examples:*
- [auto-html](../../dist/dev/pages/playground/?example=auto-html)
- [auto-html-tr](../../dist/dev/pages/playground/?example=auto-html-tr)

## Utiliser LISS auto 

Pour utiliser LISS auto dans votre page Web, il vous suffit d'importer LISS dans votre page Web :

```html
<!DOCTYPE>
<html>
    <head>
        <!-- ... -->
        <script src="./LISS.js" autodir="./components" type="module" defer></script>
    </head>
    <body>
        <hello-world></hello-world> <!-- votre premier composant Web -->
    </body>
</html>
```

## Le contenu de votre composant Web

Pour définir le contenu de votre composant Web, il vous suffit d'indiquer son contenu dans un fichier `index.html` :

```html
Hello world
```

Le contenu du composant Web peut être dynamique, i.e. dépendre de l'élément hôte.

### Contenu dynamique en fonction des attributs de l'hôte

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

### Contenu dynamique en fonction du contenu de l'hôte

Le contenu de votre composant Web peut dépendre du contenu de l'élément hôte. Pour cela, il suffit d'indiquer des slots dans lesquels le contenu de l'hôte sera affiché.

```html
<slot name="invite"></slot>: <br/>
<slot></slot> <!-- slot par défaut -->
```

```html
<hello-world>
    <span slot="invite">Hello</span>
    <span>User</span> <!-- slot par défaut -->
</hello-world>
```

⚠ Les slots ne peuvent être utilisés sur les composants Web héritant de certains éléments HTML.

*Example:*
- [auto-html-slots](../../dist/dev/pages/playground/?example=auto-html-slots)

## L'affichage de votre composant Web

Pour définir l'affichage de votre composant Web, il vous suffit d'indiquer les règles CSS à appliquer dans un fichier `index.css` :

```css
:host {
    /* vos règles CSS */
    & .name {
        background-color: red;
    }
}
```

### Affichage dynamique via des variables CSS

L'affichage de votre composant Web peut dépendre des attributs de l'élément hôte.
Pour ce faire, les attributs `css-$NAME` de l'hôte sont transformés en une variable CSS `--$NAME`.

```html
<hello-world name="user" css-color="blue" ></hello-world>
```

```css
:host {
    background-color: var(--color, red);
}
```

💡 Ce comportement est une fonctionnalité du mode automatique de LISS permettant de définir des variables CSS sans nécessiter de JS/Brython.

## Le comportement de votre composant Web

[TODO] JS/Brython

## Performances

Le mode automatique de LISS est principalement conçu pour la conception de prototypes. Il n'est ainsi pas conçu pour être performant.

Si vous souhaitez plus de performances, il vous faudra alors utiliser le mode non-automatique.