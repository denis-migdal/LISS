<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf8"/>
        <title>VSHS Playground</title>
        <!--
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
        -->
        <meta name="color-scheme" content="dark light">
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link   href="./index.css"  rel="stylesheet" blocking="render">
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.13.0/brython.min.js"></script>
        <script  src="./index.js"  type="module"     blocking="render" async></script>
    </head>
    <body>
        <main>
            0. AZERTYUIOP QSDFGHJKLM WXCVBN<br/>
            <code-block lang="js">console.log("ok");
console.log("nok");</code-block>
            <div class="grid">
            <vshs-playground
                             >
            </vshs-playground>
            <div>
                - route (with example ?)
                - server : if non-empty : use real server
                - URL (/xxx)
                - body
            </div>
            <div>
                - JS/Bry query
                - wget query
                - curl query
            </div>
            <div>C</div>
            </div>
            example="bry-params"
            show="page.bry,output,index.bry,page.html"
        </main>
    </body>
</html>