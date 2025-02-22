<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf8"/>
        <title>LISS</title>
        <meta name="color-scheme" content="dark light">
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link   href="/V3/skeleton/liss/index.css"  rel="stylesheet">
        <script  src="/V3/skeleton/liss/index.js"  type="module"     blocking="render" async></script>
    </head>
    <body code-langs="js,bry">
        <main>

# Manipuler un composant Web

## Créer une instance d'un composant Web

### Via son constructeur

Il est possible de construire une instance du composant Web (donc déjà mis à niveau) via son constructeur. Cependant, il convient de s'assurer que :
- les arguments du constructeur sont facultatifs ;
- le composant Web est bien défini.

Pour cela, plusieurs fonctions sont utiles :
<script type="c-js">
// LISS
LISS.isDefined(<h>$TAGNAME_OR_KLASS</h>);
LISS.whenDefined(<h>$TAGNAME_OR_KLASS</h>);

// vanilla
customElements.getName(<h>$KLASS</h>);       // si non-défini, retourne null.
customElements.get(<h>$TAGNAME</h>);         // si non-défini, retourne undefined.

customElements.whenDefined(<h>$TAGNAME</h>); // retourne une promesse. 
</script>

### Via <script type="c-js">createElement(<h>$TAGNAME</h>)</script>

Les éléments HTML sont usuellement créés via <script type="c-js">document.createElement(<h>$TAGNAME</h>)</script>. Cependant, cela est source d'erreurs pour les composants Web :
- l'élément créé est potentiellement immédiatement mis à niveau, empêchant de lui ajouter des attributs ou des fils.
- une exception est lancée si le constructeur modifie les attributs, ou le contenu de l'hôte.

Il convient alors d'utiliser <script type="c-js">LISS.createElement(<h>$TAGNAME</h>)</script> afin de créer un élément HTML sans le mettre à niveau immédiatement. Il est ainsi possible de lui ajouter des attributs et des fils avant sa mise à niveau.

### Via une chaîne de caractères

Il est aussi possible de créer des éléments HTML via une chaîne de caractères :
<script type="c-js">
LISS.html`<h>$HTML</h>`;
</script>

💡 Si le résulat a vocation a être cloné, il est possible d'utiliser <script type="c-js">LISS.template\`<h>$HTML</h>\`</script> à la place.

## Interagir avec un composant Web

Comme vu dans la partie conception, il est nécessaire d'interragir avec les composant Web comme s'ils n'avaient pas encore été mis à niveau, i.e. comme un <script type="c-html">HTMLElement</script>. Cependant, il existe quelques astuces pour aller plus loin.

### Setter

Il est possible de fixer la valeur d'une propriété avant la mise à niveau du composant Web. Il sera alors nécessaire, dans le constructeur, de récupérer cette valeur avant de la supprimer :

<script type="c-js">
class Klass extends HTMLElement {
    constructor() {
        super();
        
        let v = LISS.getInitialValue(this, "prop");
    }

    set prop(value) {
        /* ... */
    }
}
</script>

### Appels de méthodes

#### Asynchrone

Les appels de méthodes asynchrones sont les plus simples à gérer. Il suffit en effet d'appeler une function asynchrone qui prend en entrée le composant Web, attende qu'il se mette à niveau, puis appelle la méthode désirée :

<script type="c-js">
async function call(instance, method, ...args) {
    await ??;
    return instance[method](...args);
}
</script>

⚠ Il est cependant recommandé d'éviter cela autant que possible.

#### Synchrone

Pour un appel de méthode synchrone, il convient de forcer la mise à niveau du composant Web. En cas d'échec de la mise à niveau (e.g. pas encore défini), lancer une exception.

⚠ L'appel synchrone pouvant échoué, il est recommandé d'éviter d'utiliser cette méthode autant que possible.

#### Getter

Comme un appel de méthode, ou...
Pour un getter, la technique est un peu plus compliquée.

</main>
    </body>
</html>