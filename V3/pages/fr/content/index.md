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

# Manipuler le contenu d'un composant Web

## Content generators

- sharedCSS
- intensive DOM

## Update system

=> attrs/content si def dans fichier HTML + modifié dans inspecteur.
=> attrs / content => parser (garantir le type autant que possible).
    +> values.

- update (+signals)
    - properties

## Properties system

- parser (attr/contenu si string) [properties ]

## Dependancies ?

- shadow child can depend parent (by construction)
- children can't assume he is in a (compatible) father.
- parent -> shadow child
- Parent/host child => attach/detach system.
- do NOT call upgrade(this) dans constructeur => appel connectedCallback too soon.
    => upgrade(des children) plutôt

## Pere/fils system

- père/fils (attach/detach later)
    - fils is also input
- do not expect children upgraded (manipulation)

</main>
    </body>
</html>