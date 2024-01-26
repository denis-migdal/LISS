# LISS: Light, Intuitive, Simplier, and Safer Web Components.

## Why LISS ?

Web Components are simple to use... but, due to a multitude of non-intuitives behaviors and rules, **hard to use *correctly***. Most of examples and documentation found on the Internet are **unsafe** (cf [List of issues solved by LISS](#list-of-issues-solved-by-liss)).

**LISS enables you to easily use Web Compoments without worrying about all of that.**

## Install LISS

In order to use LISS in your project, copy either the `/index.ts` or `/index.js` file into your project.

💡 If you need to rebuild the JS file, use the command: `tsc index.ts --target esnext --module esnext`.


## LISS (standard usage)

To create a new components, simply create a class extending `LISS()` and register it using `LISS.define()`:

```html
<!-- $LISS/examples/basic.html -->
<script type="module">
  import LISS from '$LISS';

  class MyComponent extends LISS() {

    // Initialize your WebComponent
    constructor(htmltag) {
      super(htmltag);

      // Use this.content to initialize the content
      // of your WebComponent
      this.content.append('Hello World ;)');
    }
  }

  // Define your WebComponent
  LISS.define('my-component', MyComponent); // define the "my-component" component.
</script>
<my-component></my-component> <!-- Prints "Hello World ;)" -->
```

[📖 And a lot more features and examples below.](#features-and-examples)

## LISS (auto mode)

LISS can now automatically build and import your components, making them even easier to use.
This feature is enabled simply by adding a `<liss-auto src='$COMPONENTS_DIR'></liss-auto>` HTML tag into your webpage:
```html
<!-- $LISS/examples/liss-auto/ -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LISS Auto</title>
    <script type="module" src='$LISS' defer></script>
  </head>
  <body>
    <liss-auto src="./components/"></liss-auto>

    <!-- some components -->
    <liss-html></liss-html>
    <liss-css></liss-css>
    <liss-js></liss-js>
  </body>
</html>
```

In auto-mode, a component `<$name></$name>` must be defined in the `$COMPONENTS_DIR/$name` directory.
For example, the component `<liss-html></liss-html>` will be defined in the `./components/liss-html/` directory.

The component directory must at least include either an `index.js` or an `index.html` file.
An optionnal `index.css` file can also be provided.

### LISS auto-mode with an HTML file

Defining a component with only an HTML file is very easy with LISS: simply create a `$COMPONENTS_DIR/$name/index.html` file with the component's HTML content:

```html
<!-- cf $LISS/examples/liss-auto/components/liss-html/index.html -->
Hello World
```
Will define the component `<liss-html></liss-html>` containing `Hello World`:
```html
<liss-html></liss-html> <!-- will print "Hello World" -->
```

You can also add a CSS file to your component, simple by adding a `$COMPONENTS_DIR/$name/index.css` file containing rules starting with `:host`:
```css
:host {
  color: blue;
}
```

### LISS auto-mode with an JS file

You can also define a component with only a JS file, by creating a `$COMPONENTS_DIR/$name/index.js` file default exporting a function returning a class extending `LISS()`:
```javascript
// cf $LISS/examples/liss-auto/components/liss-js/index.js
import LISS from "$LISS";

export default function(options) {

  return class LISSComponent extends LISS(options) {

    constructor(htmltag) {
      super(htmltag);

      //do stuff here (cf LISS features)
    }
  }
}
```

You can also add an `index.html` and a `index.css` files to your component. LISS will then automatically use them to define your component's initial content. Their content are given by the `options` parameter.


## Features and examples

You can see all examples inside the [`LISS/examples/` directory](./examples/).

- **Inherit a builtin HTML element easily**, without worrying about [`customElements.define()` third parameter](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define), or whether [`attachShadow` is supported by this HTML element](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).
  - [*📖 Learn more about this feature.*](#easily-inherit-a-builtin-html-element)
- **Better management of observed attributes**, callback is only called *after* initialization, value of all observed attribute is cached to prevent useless DOM access, also enabling easier data validation.
  - [*📖 Learn more about this feature.*](#observe-attributes)
- **Enable to give parameters to WebComponents' constructors**, because there is not reasons not to ;).
  - [*📖 Learn more about this feature.*](#constructor-parameters)
- **Provide better interface to dynamically build WebComponents instances.**
  - [*📖 Learn more about this feature.*](#dynamically-build-instances)
- **Easily fill the WebComponent from an HTML/CSS string.**
  - [*📖 Learn more about this feature.*](#fill-html-css-from-strings)
- **Easily get WebComponent's part in a consistant way.**
  - [*📖 Learn more about this feature.*](#parts)

### Easily inherit a builtin HTML element

```html
<!-- LISS/examples/inherit.html -->
<script type="module">
  import LISS from './LISS/index.js';

  // Give the inherited HTML element as the first parameter of LISS
  class MyComponent extends LISS(HTMLTableRowElement) {

    // Initialize your WebComponent
    constructor(htmltag) {
      super(htmltag);

      // Use this.content to initialize the content
      // of your WebComponent
      document.createElement('td');
      td.textContent = 'Hello World ;)';
      this.content.append(td);
    }
  }

  // Define your WebComponent
  LISS.define('my-component', MyComponent);
</script>
<table>
  <tr is="my-component"></tr>
</table>
```

### Observe Attributes

```html
<!-- LISS/examples/attributes.html -->
<script type="module">
  import LISS from './LISS/index.js';

  const OPTIONS = {
    // declare the attributes to observe.
    observedAttributes: ["content"]
  };

  class MyComponent extends LISS(null, OPTIONS) {

    constructor(htmltag) {
      super(htmltag);

      // this.attrs contains the current values of the observed attributes.
      console.log("Attributes (init)", this.attrs);
      // you can validate this.attrs here.

      this.content.textContent = this.attrs.content;

      setInterval( () => {

        this.host.setAttribute("content", +this.attrs.content + 1);

      }, 1000);
    }

    onAttrChanged(name, oldValue, newValue) {
      console.log("AttrChanged", name, oldValue, newValue);
      console.log(this.attrs);
      // you can validate this.attrs here.

      this.content.textContent = this.attrs.content;
    }
  }

  // Define your WebComponent
  LISS.define('my-component', MyComponent);
</script>
<my-component></my-component>
```

### Constructor parameters

```html
<!-- LISS/examples/parameters.html -->
<script type="module">
  import LISS from './LISS/index.js';

  class MyComponent extends LISS() {

    constructor({a, b} = {}) {
      super();

      this.a = a ?? 0;
      this.b = b ?? 0;

      this.content.textContent = `${this.a} - ${this.b}`;
    }
  }

  LISS.define('my-component-b1', MyComponent, {withCstrParams: {b: 1}});
  LISS.define('my-component-b2', MyComponent, {withCstrParams: {b: 2}});

  const elem = await LISS.buildElement( 'my-component-b2', {
                      withCstrParams: {a: 3}
                    });
  document.body.append( elem );
</script>
<my-component-b1></my-component-b1>
<my-component-b2></my-component-b2>
```

### Dynamically build instances


```html
<!-- LISS/examples/dynamic-build.html -->
<script type="module">
  import LISS from './LISS/index.js';

  class MyComponent extends LISS() {

    constructor(htmltag) {
      super(htmltag);

      this.content.append('Hello World ;)');
    }
  }

  LISS.define('my-component', MyComponent);


  const elem = await LISS.buildElement('my-component', {
    // withCstrParams: {}       // constructor parameters
    // init: true,            // force initialization of element before insertion.
    
    content: "Hello ;)",        // set element children
    // or
    content: ["Hello", "World"],
    parent : document.body,     // add element to the parent

    id     : "myWebComponent",    // set element ID.
    classes: ["c1", "c2"],      // set element classes
    cssvars: {"toto": "42"},    // set element CSS variables

    attrs: {attrname: "value"},   // set element attributes
    data : {name    : "value"},

    listeners: {          // set element listeners
      "click": () => { console.log('click!') }
    }
  });
</script>
```

### Fill HTML/CSS from strings

```html
<!-- LISS/examples/fill-from-strings.html -->
<script type="module">
  import LISS from './LISS/index.js';

  // const htmlstr = require(!raw!$FILEPATH) // for WebPack
  // const htmlstr = await (await fetch($FILEPATH)).text();
  const htmlstr = "X = <span>${a}</span>";
  const cssstr  = `
    :host span {
      background-color: yellow;
    }
  `;

  class MyComponentA extends LISS(null, {
    template: htmlstr,// accepts string, or HTMLTemplateElement,
    css   : cssstr  // accepts string, HTMLStyleElement, or CSSStyleSheet or an array of it.
  }) {}

  const htmlstr2 = "<td>X = <span>${b}</span></td>";

  class MyComponentB extends LISS(HTMLTableRowElement, {
    template: htmlstr2,// accepts string, or HTMLTemplateElement,
    css   : cssstr   // accepts string, HTMLStyleElement, or CSSStyleSheet or an array of it.
  }) {}

  LISS.define('my-component-a', MyComponentA);
  LISS.define('my-component-b', MyComponentB);
</script>
<my-component-a a="A"></my-component-a>
<table>
  <tr is="my-component-b" b="B"></tr>
</table>
<span>C</span>
```

### Parts

```html
<!-- LISS/examples/parts.html -->
<script type="module">
  import LISS from './LISS/index.js';

  class MyComponentA extends LISS() {

    constructor(htmltag) {

      super(htmltag);

      const span = document.createElement('span');
      span.setAttribute('part', 'foo');

      this.content.append(span);
    }
  }
  class MyComponentB extends LISS(HTMLTableRowElement) {

    constructor(htmltag) {
      super(htmltag);

      const td = document.createElement('td');
      td.setAttribute('part', 'foo');

      this.content.append( td );
    }
  }

  LISS.define('my-component-a', MyComponentA);
  LISS.define('my-component-b', MyComponentB);

  await LISS.whenDefined('my-component-a');
  let elem = document.querySelector(`my-component-a`);
  let part = elem.getPart("foo");
  part.textContent = "Hello";
  console.log("A", elem.getParts("foo"));

  await LISS.whenDefined('my-component-b');
  elem = document.querySelector(`tr[is="my-component-b"]`);
  part = elem.getPart("foo");
  part.textContent = "World";
  console.log("B", elem.getParts("foo"));
</script>
<my-component-a></my-component-a>
<table>
  <tr is="my-component-b"></tr>
</table>
```

## List of issues solved by LISS

- `customElements.define()` third argument must match the class inherited by the Web Component ([more info](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)).
  - ***Solution :*** We provide `LISS.define()`, that takes care of the third argument for you.
- `customElements.define()` should be called only once the DOM has finished to load in order to prevent issues of childs not being present when custom elements are being initialized.
  - ***Solution :*** `LISS.define()`, takes care of that for you, calling `customElements.define()` once the DOM is loaded or immediately if the DOM is already loaded.
- For some reasons, some of your Web Components might be requires some other Web Components to be defined.
  - ***Solution :*** The third parameter of `LISS()` and `LISS.define()` allow you to define a list of dependancies when defining a component.
- `document.createElement()` doesn't allow you to pass parameters to your Web Component ([more info](https://github.com/WICG/webcomponents/issues/605))
  - ***Solution :*** `LISS.createElement()` enables you to give parameters to your WebComponent, and `LISS.define()` third argument to set values to be given to the WebComponent constructor.
- WebComponent's DOM should not be accessed/modified until the first call of `connectedCallback()`.
  - ***Solution 1:*** Use `this.self` (protected) instead of `this` to access the WebComponent attribute/children. Throws an exception if the Web Component still hasn't be initialized.
  - ***Solution 2:*** Use `this.content` (protected) to access the Web Component's content.
  - ***Solution 3:*** You may also use `this.assertInit()` (protected) at the start of your methods, to throw an exception if called while the WebComponent still hasn't be initialized.
- WebComponent should be initialized at the first call of `connectedCallback()` (can be called several times).
  - ***Solution:*** Redefine `this.init()` (protected) to initialize your Web Component. LISS will call it only once, at the first call of `connectedCallback()`.
- Web Component's children might not be yet upgraded when `connectedCallback()` is called. Then, `customElements.upgrade(this)` need to be called.
  - ***Solution:*** LISS automatically calls it before calling `this.init()`.
- Web Components should use `ShadowRoot` for its content. However some custom elements inheriting builtin elements doesn't support having one. ([more info](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)).
  - ***Solution:*** Use `this.content` to set the Web Component content. LISS attaches a `ShadowRoot` if supported, else `this` is used. In your webcomponent, use `super(true/false)` to indicate whether you want the `ShadowRoot` to be open (true) or closed (false).
- `attributeChangedCallback()` is called each time an attribute is modified, even when the Web Component hasn't been initialized yet !
  - ***Solution:*** Use `onAttrChanged()` instead, it won't be called if an attribute is modified before the Web Component has finished its initialization. Set the list of listened attributes in the second argument of `LISS()`.
- building a tag with its attribute, children, etc. takes too many lines.
  - ***Solution:*** Use `LISS.buildElement()` to build a WebComponent, insert attributes, classes, datasets values, children, etc. before its initialization. The option `init` will force the element initialization before returning it.
- Accessing to the HTML attributes in order to get their values is costly. Even more when we want to gather all values to validate them altogether.
  - ***Solution:*** Use `this.attrs` to access the values of the observed attributes. LISS only access them once before the Web Component intialization, and update their values thanks to `attributeChangedCallback()`.
- With TS, when using the WebComponent, all properties of `HTMLElement` are listed.
  - ***Solution:*** With LISS, `this.API` will remove all `HTMLElement` members from the suggestions.
- Filling the Web Component can be cumbersome
  - ***Solution 1:*** `LISS()` accept a string, a `HTMLTemplateElement`, or an identifer to a `HTMLTemplateElement` that will be used to fill the Web Component.
  - ***Solution 2:*** `LISS()` accept a string, a `CSSStyleSheet`, a `HTMLStyleElement`, or an identifer to a `HTMLStyleElement` that will be used to fill the Web Component CSS.
- Depending whether the Web Component uses a ShadowRoot or not, they way to declare and add the CSS rules differs.
  - ***Solution:*** If the element doesn't support `ShadowRoot`, LISS creates `HTMLStyleElement` that are appened to the `HTMLHeadElement`. Rules are modified to replace ":host" by the Web Component tagname.
- `::part()` is chaotic. It can only be used on open `ShadowRoot`.
  - ***Solution:*** LISS provides `.getPart(name)` and `.getParts(name)` to offer a more consistant usage.

## TODO

- [ ] Explain better the principles.
- [ ] LISS.qs and LISS.qsa for TS.
- [ ] now inherit and htmlclass.
- [ ] dataset.delayLISSInit + force_init
- [ ] new Shadow opts : None.
- [ ] delayedInit opts.
- [ ] qs vs qso

- [ ] whenInit promise.
- [ ] Documentation/usage
  - [ ] this.API
  - [ ] ShadowRoot (open/close)

- [ ] npm package

- [ ] ShadowRoot
  - [ ] Slots
    - [ ] createSlot(name), if no shadow : returns this.#content, if name = throw an exception.
    - [ ] getSlot(name) : if not found : throws.
    - [ ] observeSlot(name, options) ? : if not found : throws.
      - [ ] added/removed (events)

- [ ] LISS parameter Custom Element (mutation observer + event parents)
- [ ] Ressources : finalize+destroy (?)
  - [ ] declare ressource