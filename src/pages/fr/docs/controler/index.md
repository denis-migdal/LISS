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

# Contrôleur API

<script type="c-ts">
    class LISSControler<_, HostCstr> {

        // non-vanilla API
            public    readonly host   : InstanceType<HostCstr>;
            protected readonly content: InstanceType<HostCstr>|ShadowRoot;
            
            static    readonly Host   : HostCstr;

        // vanilla API
		    static    readonly observedAttributes: string[];
		    protected attributeChangedCallback( name    : string,
                                                oldValue: string|null,
                                                newValue: string|null): void;
            
            readonly  isConnected           :boolean;
            protected    connectedCallback(): void;
            protected disconnectedCallback(): void;

    }
</script>

- Rappel diff hôte/content
- Creation (LISS)/ContentGenerator
- Creation cstor (new WebComp)

+ internal state...

## [Non-vanilla] Manipulation du contenu

Le contenu du composant Web est manipulé via l'attribut <script type="c-js">.content</script>. Il correspond au <script type="c-js">shadowRoot</script> du composant Web (s'il en possède un), sinon à l'hôte. Il se manipule comme un élément HTML :

<liss-playground name="hello-world" show="index.code,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=hello-world"><i>Tester l'exemple dans le bac à sable</i></a></div>

## [Non-vanilla] Manipulation de l'hôte

L'hôte du composant Web est manipulé via l'attribut <script type="c-js">.host</script>. Il se manipule comme un élément HTML  :

<liss-playground name="host-attr" show="index.code,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=host-attr"><i>Tester l'exemple dans le bac à sable</i></a></div>


## [Vanilla] Écouter les attributs

LISS permet d'écouter les attributs via [l'API standard](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes) :
- <script type="c-js">static observedAttributes = [<h>$ATTR_NAME[,..]</h>]</script> liste les noms des attributs à écouter ;
- <script type="c-js">.attributeChangedCallback(name, oldVal, newVal)</script> est appelé lors de la modification d'un attribut écouté.

<liss-playground name="listen-attributes" show="index.code,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=listen-attributes"><i>Tester l'exemple dans le bac à sable</i></a></div>        

## [Vanilla] Écouter les connexions au DOM

LISS permet d'écouter l'ajout et le retrait du composant Web via [l'API standard](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks) :
- <script type="c-js">.isConnected</script> indique si l'élément personnalisé est actuellement dans le DOM ;
- <script type="c-js">.connectedCallback()</script> est appelé lorsque l'élément est ajouté au DOM ;
- <script type="c-js">.disconnectedCallback()</script> est appelé lorsque l'élément est retiré du DOM ;

<liss-playground name="listen-connect" show="index.code,output">
</liss-playground>
<div style="text-align:right"><a href="../../../playground/?example=listen-connect"><i>Tester l'exemple dans le bac à sable</i></a></div>

</main>
    </body>
</html>