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

# Documentation LISS

[TODO] Intro

Why/motivation

Auto-mode

Controler vs Host

Life Cycle

- state :
    - https://developer.mozilla.org/en-US/docs/Web/API/CustomStateSet
    - https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals

## OLD


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

*Example :*
- [auto-html-slots](https://denis-migdal.github.io/LISS/dist/dev/pages/playground/?example=auto-html-slots)



</main>
    </body>
</html>