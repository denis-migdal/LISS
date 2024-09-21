# LISS: Light, Intuitive, Simplier, and Safer Web Components.

## Why LISS ?

Web Components are simple to use... but, due to a multitude of non-intuitives behaviors and rules, **hard to use *correctly***. Most of examples and documentation found on the Internet are **unsafe** (cf [List of issues solved by LISS](#list-of-issues-solved-by-liss)).

**LISS enables you to easily use Web Compoments without worrying about all of that.**

## Note : LISS v2 currently developed in V2 branch.

## Install LISS

In order to use LISS in your project, copy either the `/index.ts` or `/index.js` file into your project.

💡 If you need to rebuild the JS file, use the command: `tsc index.ts --strict --target esnext --module esnext`.

💡 To run the tests : `tsc --strict --noEmit --target esnext --module esnext $FILE`

## Basic usage

To create a new components, simply create a class extending `LISS()` and register it using `LISS.define()`:

```html
<!-- cf /examples/basic -->
<!DOCTYPE html>
<html>
  <head>
    <script type="importmap">
    {
        "imports": {
            "LISS": "$LISS/index.js"
        }
    }
    </script>
    <script type="module">
      import LISS from 'LISS';

      class MyComponent extends LISS() {

        // Initialize your WebComponent
        constructor() {
          super();

          // Use this.content to initialize your component's content
          this.content.append('Hello World ;)');

          console.log('State (initial)', {
               // Use this.content to access your component's content:
               Content: this.content, // ShadowRoot
               // Use this.host to access the component's host:
               Host   : this.host,    // <my-component></my-component>
               // Use this.attrs to efficiently access the component's host's attributes:
               Attributes: {...this.attrs}, // {}
               // Use this.params to access the component parameters.
               Parameters: this.params      // {}
          });
        }
      }

      // Define your WebComponent
      LISS.define('my-component', MyComponent); // define the "my-component" component.
    </script>
  </head>
  <body>
    <my-component></my-component> <!-- Prints "Hello World ;)" -->
  </body>
</html>
```

[📖 See the auto mode for easier usage.](#auto-mode)

[📖 And a lot more features and examples below.](#features-and-examples)

## List of issues solved by LISS

### Component initialization

In vanilla JavaScript, components shouldn't access the DOM before the first call of `connectedCallback()`. This often leads to the creation of an `init()` method which is a really bad practice and hampers TS type checking of attributes. Indeed, the component can have its method called *before* being initialized, requiring safe guards at the start of each methods. For example, `attributeChangedCallback()` can be called before initialization, even though attributes shouldn't be accessed before initialization.

Even with safeguards, and an `init()` method, errors can still occurs. If the component is defined before the DOM has finished loading, some children can be missing during initialization. `customElements.upgrade(this)` might also be required to ensure the children are upgraded. Also, `customElements.define()` third argument must match the class inherited by the Web Component ([more info](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)) which is redoundant information, can lead to errors, and may be in some cases troublesome to handle.

LISS tacles these issues by constructing the component only when it is fully ready and allows to declare dependancies. LISS also supports giving parameters to the component.

**Without LISS:**

```typescript
class Component extends HTMLTableRowElement {

    someAttrs?: string; // is undefined before initialization.

    #isInit = false;
    connectedCallback() {
        if(!this.#isInit)
            init();
    }

    attributeChangedCallback(...) {
        //...
        if( ! this.#isInit )
            return;
    }

    protected init() {
        customElements.upgrade(this);
        //...
        this.someAttrs = "ok";
        this.#isInit = true;
        //...
    }
}

function define() {
    customElements.define('my-component', Component, {extends: "tr"});
}

if(document.readyState === "interactive" || document.readyState === "complete")
    define();
else
    document.addEventListener('DOMContentLoaded', define);
```

**With LISS:**

```typescript
import LISS from "LISS";

class Component extends LISS({host: HTMLTableRowElement}) {

    someAttrs: string;

    constructor() {
        this.someAttrs = "ok";
    }

    onAttrChanged(...) {
        //...
    }
}

LISS.define('my-component', Component);
```

### Uniformization

In vanilla Javascript, use of `ShadowRoot` is recommanded, however, some custom element inheriting builtin elements doesn't support having one ([more info](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)). This leads to different ways of doing things whether the component supports or not `ShadowRoot`.

LISS uniformalizes usage independantly of the `ShadowRoot` support:

- By default, `shadowRoot` is created if the component supports it. `LISS({shadow:...})` enables to explicitly set the `ShadowRoot` mode (`NONE`, `OPEN`, or `CLOSE`).

- `this.content` enables to access the component content, i.e. the `ShadowRoot` if exists or the host.

- CSS rules are rewriten to enable usage of `:host` in components without `ShadowRoot`.

- LISS provides methods to simulate `part` and `slot` in components without `ShadowRoot` (WIP).

### Components and DOM manipulations

When manipulating the DOM, we manipulate `Element` instances that may or may not correspond to a component, which may or may not be defined or initialized. LISS offers some helpers to facilitate `Element` manipulation :

**Without LISS:**

```typescript
const element = querySelector('...');
if( element === undefined)
    throw new Error('...');
await customElement.whenDefined('....')
customElements.upgrade(element); // ensure it is upgraded.
if( element instanceof Component ) {
    if( ! element.isInit )
        await element.whenInit;
}
```

**With LISS:**

```typescript
const component = await LISS.qs<Component>('....');
// or
const component = await LISS.qs('....', 'my-component'); // for TS
```

### Building components

In vanilla JavaScript, building component is troublesome, doesn't allow for parameters, and might lead to errors:

**Without LISS:**

```typescript
const element = document.createElement<Component>('tr', {is: 'my-component'});
element.setAttribute('foo', "24");
// SHOULDN'T USE "element"" YET: STILL NOT INITIALIZED!
document.body.append(element); // will initialize it...
element.setAttribute('faa', "42"); // too late for parameters.
```

**With LISS:**

```typescript
const Element = await LISS.build('my-component', {
    params: {...},
    attrs: {
        foo: "24",
        faa: "42"
    },
    parent: document.body
});
```

## Features and examples

You can see all examples below in the [`LISS/examples/` directory](./examples/).

- [Management of HTML attributes](#manage-html-attributes)
- [Extend JS and HTML classes](#extend-js-and-html-classes)
- [Dynamically build component instances](#dynamically-build-component-instances)
- [Access components through the DOM](#access-components-through-the-dom)
- [Use HTML/CSS files/strings to fill the component](#use-htmlcss-filesstrings-to-fill-the-component)
- [Auto mode](#auto-mode)
- **Advanced features**
  - [ShadowRoot helpers](#shadowroot-helpers)
  - dependencies
- **[LISS full API](#liss-full-API)**

### Manage HTML attributes

LISS enables to observe the host HTML attributes, simply by specifying their names when building the component (`extends LISS({attributes:[...]})`).

Then, `this.onAttrChanged()` will be called at each modification of the observed attributes. If `this.onAttrChanged()` returns false, the changed attribute will be reverted to its previous value.

`this.attrs` enables to access them in an efficient way, i.e. without requiring multiples access to the DOM. Modification of an attribute through `this.attrs` will update the HTML attributes without firing `this.onAttrChanged()`.

```typescript
// cf /examples/attributes
import LISS from 'LISS';

class MyComponent extends LISS({
                                    attributes: ["counter"] // observed attributes.
                                }) {
    #interval = null;

    constructor() {
        super();

        // this.attrs contains the current values of the observed attributes.
        console.log("Attributes (initial)", {...this.attrs});
        // you can validate this.attrs here.

        this.#counter = setInterval( () => {
            // will trigger onAttrChanged
            this.host.setAttribute("counter", +this.attrs.counter+1);
        }, 1000);

        // will NOT trigger onAttrChanged.
        this.content.textContent = this.attrs.counter = 0;
    }

    onAttrChanged(name, oldValue, newValue) {

        console.log("AttrChanged", name, oldValue, "->", newValue);
        console.log("Attributes (now):", {...this.attrs});

        // you can validate this.attrs here.
        if( this.attrs.counter === "5" ) {
            clearInterval(this.#interval);
            return false; // cancel the change.
        }      

        this.content.textContent += this.attrs.counter;
    }
}

LISS.define('my-component', MyComponent);
```

```html
<my-component counter="null"></my-component><!-- prints 01234 -->
```

### Extend JS and HTML classes

`LISS()` allows you to extends existing classes thanks to the `extends` (JS classes) and `host` (HTMLElement classes) options.

💡 We also provide an interface `EventsTarget` to better ensure events types when using events and listeners.

```typescript
// cf /examples/extend
import LISS from 'LISS';

class MyComponent extends LISS({
    host   : HTMLTableRowElement,
    extends: EventTarget, // the component is able to send events.
    // in TS, to ensure events types, add: as EventsTargetCstr<{"event_name": detail_type}>
    content: "<td>Hello World ;)</td>"
}) {

    constructor() {
        super();

        this.host.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('click', {detail: null}));
        })
    }
}

// Define your WebComponent
LISS.define('my-component', MyComponent);

const component = await LISS.qs( LISS.selector("my-component") );

component.addEventListener('click', () => {
    alert('click');
});
```

```html
<table>
    <tr is="my-component"></tr>
</table>
```

### Dynamically build component instances

`LISS.build()` enables you to build new component instances through many options:

```typescript
// cf /examples/build
import LISS from 'LISS';

class MyComponent extends LISS({
    css: ":host{ color: var(--color) }",
    params: { // default values
        foo: 1, // in TS add: as number
        faa: 1,
        fuu: 1
    }
}) {

    constructor() {
        super();

        console.log('State (initial)', {
          Content: this.content, // ShadowRoot
          Host: this.host,       // <my-component></my-component>
          Attributes: {...this.attrs}, // {}
          Parameters: this.params      // {foo:1,faa:2,fuu:3}
        });
    }
}

LISS.define('my-component', MyComponent, {params: {faa: 2}});


const elem = await LISS.build('my-component', {
    params: {fuu: 3},                 // component parameters
    // initialize: true,           // force initialization of element before insertion.

    content: "Hello ;)",             // set host children
    // or
    // content: ["Hello", "World"],
    parent : document.body,          // add component to the parent

    id        : "myWebComponent",       // set host ID.
    classes: ["c1", "c2"],          // set host classes
    cssvars: {"color": "blue"},      // set host CSS variables

    attrs: {attrname: "value"},   // set host attributes
    data : {name    : "value"},

    listeners: {                  // set host listeners
        "click": () => { alert('click!') }
    }
});
```

💡 Parameters can also be specified in `LISS()` and `LISS.define()` options.

[📖 See also the full API documentation](#lissbuildttagname-options-promiset)

### Access components through the DOM

LISS provides several tools to securely manipulate components through the DOM:

- from an `HTMLElement`:
  
  ```typescript
  LISS.getLISS<T extends LISSBase<>>(elem: HTMLElement): Promise<T>
  ```
  
  [📖 See HTMLElement manipulations for more](#htmlelement-manipulations)

- from a query string:
  
  ```typescript
  LISS.qs<T extends LISSBase<>>('...'): Promise<T>
  ```
  
  💡 LISS also provide a function overload enabling better type checking in TS.
  
  [📖 See Query selectors for more](#query-selectors)

### Use HTML/CSS files/strings to fill the component

`LISS()` allows to inject HTML and CSS files/strings into your component thanks to the `content` and `css` options:

```javascript
// cf /examples/inject-html-css/
import LISS from "LISS"

const CSS_RULES = `
    :host {
      color: blue;
    }
`;

export default class Component extends LISS({
      content:  fetch("./component.html"),               // string|Response|HTMLTemplateElement or a Promise of it.
      css    : [fetch('./component.css'), CSS_RULES] // string|Response|HTMLStyleElement|CSSStyleSheet or a Promise of it, or an array of it.
  }) {
    //...
}

LISS.define("my-component", Component);
```

### Auto mode

LISS can also automatically build and import your components, making them even easier to use.
This feature is enabled simply by adding a `<liss-auto src='$COMPONENTS_DIR'></liss-auto>` HTML tag into your webpage:

```html
<!-- cf /examples/liss-auto/ -->
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

⚠ In order to suppress 404 errors in the console, auto-mode requires to put the file `$LISS/sw.js` in the same directory than your webpage.

#### LISS auto-mode with an HTML file

Defining a component with only an HTML file is very easy with LISS: simply create a `$COMPONENTS_DIR/$name/index.html` file with the component's HTML content:

```html
<!-- cf /examples/liss-auto/components/liss-html/index.html -->
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

#### LISS auto-mode with an JS file

You can also define a component with only a JS file, by creating a `$COMPONENTS_DIR/$name/index.js` file default exporting a function returning a class extending `LISS()`:

```javascript
// cf /examples/liss-auto/components/liss-js/index.js
import LISS from "LISS";

export default function(options) {

  return class LISSComponent extends LISS(options) {

    constructor() {
      super();
      //do stuff here (cf LISS features)
    }
  }
}
```

You can also add an `index.html` and a `index.css` files to your component. LISS will then automatically use them to define your component's initial content. Their content are given by the `options` parameter.

### ShadowRoot helpers

#### Global CSS rules and global delegated event listeners

When using a close `ShadowRoot`, we still might want to use global CSS rules or global delegated event listeners.

```html
<div class="fullscreen-onclick"></div>
```

```typescript
// applies tho CSS rules to all components and to the document.
LISS.insertGlobalCSSRules(`.fullscreen-onclick {
    //...
}`);

// listen to the click events inside all components and inside the document.
LISS.insertGlobalDelegatedListener("click", ".fullscreen-onclick", (ev) =>
                                   {
                                        //...
                                    }); 
```

#### LISS.closest()

When using `elem.closest(selector)` inside a `ShadowRoot`, the ancestors of the `ShadowRoot` aren't checked. We provide `LISS.closest<T>(selector, elem)` in order to check them.

```html
<div class="fullscreen_target">
    <my-toolbar>
        <fullscreen-btn></fullscreen-btn>
    </my-toolbar>
</div>
```

```typescript
function onFullscreenBtnClicked(ev) {
    ev.target.closest(".fullscreen_target"); // may not be found.
    LISS.closest(".fullscreen_target", ev.target); // found.
}
```

### LISS full API

#### LISS.define< *Extends, Host, Attrs, Params* >(tagname, ComponentClass, options)

This function awaits the component's dependancies, then declares a new custom element using `customElements(tagname, _host, ...)`.

Internally, `_host` is an instance of `LISSHost<>` which, once the custom element is ready to be initialized, instantiate a new instance of the given `ComponentClass`.

| Name                   | Type                                           | Description                                          |
| ---------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `tagname`              | `string`                                       |                                                      |
| `ComponentClass`       | `LISSReturnType<Extends, Host, Attrs, Params>` | A class extendings a class returned by `LISS()`.     |
| `options.dependancies` | `readonly Promise<string>[]`                   | Promises to wait before declaring the component.     |
| `options.params`       | `Partial<Params>`                              | Parameters to add to the component constructor call. |

LISS also provides functions to follow the component definition process/status:

```typescript
LISS.isDefined  (tagname: string): boolean;
LISS.whenDefined(tagname: string, 
callback ?: () => void): Promise<void>
LISS.whenAllDefined(tagnames: readonly string[], callback ?: () => void): Promise<void>
```

#### LISS< *Extends, Host, Attrs* >(options)

| Name      | Type                                           |
| --------- | ---------------------------------------------- |
| `options` | `LISSOptions<Extends, Host, Attrs, Params>`    |
| `return`  | `LISSReturnType<Extends, Host, Attrs, Params>` |

#### LISSOptions&lt; *Extends, Host, Attrs* &gt;

| Name            | Type                                                | Default            | Description                                       |
| --------------- | --------------------------------------------------- | ------------------ | ------------------------------------------------- |
| `Extends`       | `extends Class`                                     |                    |                                                   |
| `Host`          | `extends HTMLElement`                               |                    |                                                   |
| `Attrs`         | `extends string`                                    |                    |                                                   |
| `Params`        | `extends Record<string, any>`                       |                    |                                                   |
| `CSSSource`     | `string\|Response\|HTMLStyleElement\|CSSStyleSheet` |                    |                                                   |
| `extends?`      | `Constructor<Extends>`                              | `Object`           | The JS class the component extends.               |
| `host?`         | `Constructor<Host>`                                 | `HTMLElement`      | The host HTML Element class.                      |
| `attributes?`   | `readonly Attrs[]`                                  | `[]`               | The names of the host HTML attributes to observe. |
| `params?`       | `Params`                                            | `{}`               | Default values for the component parameters.      |
| `dependancies?` | `readonly Promise<any>[]`                           | `[]`               | Promises to wait before declaring the component.  |
| `content?`      | `string\|Response\|HTMLTemplateElement`             | `undefined`        | The component default HTML content.               |
| `css?`          | `readonly CSS_Source[] \| CSS_Source`               | `[]`               | CSS rules for the component.                      |
| `shadow?`       | `ShadowCfg`                                         | `closed` or `none` | ShadowRoot configuration (0 if none).             |

💡 `css` and `content` also accept a `Promise`.

#### LISSReturnType< *Extends, Host, Attrs* >

**`Methods:`**

| Name            | Parameters                                                   | Return                            | Description                                                                 |
| --------------- | ------------------------------------------------------------ | --------------------------------- | --------------------------------------------------------------------------- |
| `constructor`   |                                                              | `this`<br/>or<br/>`Promise<this>` | Async constructors are supported.                                           |
| `onAttrChanged` | `name: string`<br/>`oldValue: string`<br/>`newValue: string` | `void`<br/>or <br/>`false`        | Called when an attribute is changed.<br/>Return false to cancel the change. |

**`Properties:`**

| Modifiers            | Name      | Type                      | Description                        |
| -------------------- | --------- | ------------------------- | ---------------------------------- |
| `readonly public`    | `host`    | `Host`                    | The component HTML host.           |
| `protected readonly` | `content` | `HTMLElement\|ShadowRoot` | The component HTML content.        |
| `protected readonly` | `attrs`   | `Attrs`                   | The host observed HTML attributes. |
| `protected readonly` | `params`  | `Params`                  | The component parameters.          |

#### LISSBase< *Extends, Host, Attrs* >

```typescript
type LISSBase<E,I,A,P> = InstanceType<LISSReturnType<E,I,A,P>>
```

#### LISS.build&lt;*T*&gt;(tagname, options): Promise<*T*>

Build a new component instance.

| Name                 | Type                                            | Default     | Description                            |
| -------------------- | ----------------------------------------------- | ----------- | -------------------------------------- |
| `T`                  | `extends LISSBase<E,I,A,P>`                     |             |                                        |
| `tagname`            | `string`                                        |             |                                        |
| `options.initialize` | `boolean`                                       | `true`      | Force the component initialization.    |
| `options.params?`    | `Partial<Params>`                               | `{}`        | Component parameters.                  |
| `options.content?`   | `string\|Node\|readonly Node[]`                 | `undefined` | Host default content.                  |
| `options.id?`        | `string`                                        | `undefined` | Host id attribute                      |
| `options.classes?`   | `readonly string[]`                             | `[]`        | Host class list.                       |
| `options.cssvars?`   | `Readonly<Record<string, string>>`              | `{}`        | Host CSS variables.                    |
| `options.attrs?`     | `Readonly<Record<string, string\|boolean>>`     | `{}`        | Host HTML attributes.                  |
| `options.data?`      | `Readonly<Record<string, string\|boolean>>`     | `{}`        | Host dataset.                          |
| `options.listeners?` | `Readonly<Record<string, (ev: Event) => void>>` | `{}`        | Host events listeners.                 |
| `options.parent?`    | `HTMLElement`                                   | `undefined` | Element to which append the component. |

#### HTMLElement manipulations

| Function                               | Return       | Description                                                |
| -------------------------------------- | ------------ | ---------------------------------------------------------- |
| `LISS.getLISS<T>(element)`             | `Promise<T>` | Returns the LISS component associated to the HTML Element. |
| `LISS.getLISSSync<T>(element)`         | `T`          | Throws an exception if component not yet initialized.      |
| `LISS.initialize<T>(element, params?)` | `Promise<T>` | Force the component initialization.                        |
| `LISS.getName(element)`                | `string`     | Returns the component name.                                |
| `LISS.selector(name)`                  | `string`     | Returns the CSS selector for the given component name.     |

**`parameters`**

| Name      | Type                 | Description |
| --------- | -------------------- | ----------- |
| `T`       | `extends LISSBase<>` |             |
| `element` | `HTMLElement`        |             |
| `params?` | `Partial<Params>`    |             |

#### Query selectors

LISS provides several fonctions to get fully intialized LISS components from a query string:

| Function                       | Return             | Remarks                                                         |
| ------------------------------ | ------------------ | --------------------------------------------------------------- |
| `LISS.qs<T>(query, parent?)`   | `Promise<T>`       | Throws an exception if not found.                               |
| `LISS.qso<T>(query, parent?)`  | `Promise<T>\|null` | `null` if not found.                                            |
| `LISS.qsa<T>(query, parent?)`  | `Promise<T[]>`     |                                                                 |
| `LISS.qsc(query, element)`     | `Promise<T>\|null` |                                                                 |
| `LISS.qsSync(query, parent?)`  | `T`                | Throws an exception if component not yet initialized.           |
| `LISS.qsaSync(query, parent?)` | `T[]`              | Throws an exception if any found component not yet initialized. |
| `LISS.qscSync(query, element)` | `T`                | Throws an exception if component not yet initialized.           |

**`parameters`**

| Name      | Type                                  | Default    |
| --------- | ------------------------------------- | ---------- |
| `T`       | `T extends LISSBase<any,any,any>`     |            |
| `query`   | `string`                              |            |
| `parent?` | `Element\|Document\|DocumentFragment` | `document` |
| `element` | `Element`                             |            |

💡 For better type checking in TS, we provide an overload for each of these functions enabling to use a component name as a 2nd parameter:

```typescript
LISS.qs<T extends keyof Components>(selector: string,
                                    tagname: T,
                                    parent ?: ...): Promise<Components[T]>

// To use your own components, declare them:
 LISS.define('my-component', Component);
 declare module '$LISS' {
         interface Components {
              'my-component': Component
         }
 }
 // selector = `${selector}${LISS.selector('my-component')}`
 // selector = "body > :is(my-component,[is="my-component"])"
 LISS.qs('body > ', 'my-component'); // Promise<Component>
```

#### ShadowRoot helpers

| Function                                                     | Return | Description                                                    |
| ------------------------------------------------------------ | ------ | -------------------------------------------------------------- |
| `LISS.closest<T>(css_selector, elem)`                        | `T`    | Like `elem.closest()` but traverses `ShadowRoot`.              |
| `LISS.insertGlobalCSSRules(css)`                             |        | Add the `css` rules to all components and to the document.     |
| `LISS.insertGlobalDelegatedListener(evt, selector, handler)` |        | Add a delegated listener to all componets and to the document. |

## Features and examples [OLD]

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

## TODO

- [ ] Dependancies : after Host decl.
- [ ] Expect parents/children initialization options (2 incompatibles)
  -> expect Host ?
  -> DOM connect/disconnect => different life-cycle / upper life-cycle ?
  -> add doc for init/life cycle

- [ ] npm package / distribute

- [ ] Write doc for
   - [ ] onDOM(Dis)Connected
   - [ ] LISS.extends
    - [ ] attrs default value.
   - [ ] setAttrDefault
   - LISSParams

- [ ] ShadowRoot parts