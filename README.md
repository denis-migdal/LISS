<div align="center">
  <h1>LISS: Light, Intuitive, Simplier, and Safer Web Components.</h1>

  <p>Build safe and simple vanilla WebComponents</p>
</div>

## Documentation :

- V3: https://denis-migdal.github.io/LISS/dist/dev/pages/V3/fr/

## Build

- `npm run build`
- `npm run watch`

💡 (Un)comment lines in `./src/index.ts` to remove(/add) features.

## TODO

Add gotcha/Doc :
- content_factory()
- update if inside template : won't do anything...
  - adoptNode()
- upgrade doesn't throw even if didn't upgraded (e.g. not defined, template, etc)
- Base vs Host
- link to subpages
- build HTMLElement from string : multiple ways with gotchas
- events : Close more safe but delegated events doesn't enter -> by default / LISS.eventMatches


## Why LISS ?

Web Components are simple to use... but, due to a multitude of non-intuitives behaviors and rules, **hard to use *correctly***. Most of examples and documentation found on the Internet are **unsafe** (cf [List of issues solved by LISS](#list-of-issues-solved-by-liss)).

**LISS enables you to easily use Web Compoments without worrying about all of that.**

## Note : LISS v2 currently developed in V2 branch.

## Install LISS

In order to use LISS in your project, copy either the `/index.ts` or `/index.js` file into your project.

💡 If you need to rebuild the JS file, use the command: `tsc index.ts --strict --target esnext --module esnext`.

💡 To run the tests : `tsc --strict --noEmit --target esnext --module esnext $FILE`

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