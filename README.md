# **[IN PROGRESS]** LISS: Light, Intuitive, Simplier, and Safer Web Components.

## Why LISS ?

Web Components are simple to use... but **hard to use *correctly***, due to a multitude of non-intuitives behaviors and rules. Most of examples and documentation found on the Internet are **unsafe** (cf [List of issues solved by LISS](#list-of-issues-solved-by-liss)).

**LISS enables you to correctly use Web Compoments without worrying about all of that.**

## Install LISS

To rebuild the JS files, use : `tsc $FILE --target es6`.

## Use LISS

## List of issues solved by LISS

- `customElements.define()` third argument must match the class inherited by the Web Component ([more info](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)).<br/>
***Solution :*** We provide `LISS.define()`, that takes care of the third argument for you.
- `customElements.define()` should be called only once the DOM has finished to load in order to prevent issues of childs not being present when custom elements are being initialized.<br/>
***Solution :*** `LISS.define()`, takes care of that for you, calling `customElements.define()` once the DOM is loaded or immediately if the DOM is already loaded.
- For some reasons, some of your Web Components might be requires some other Web Components to be defined.<br/>
***Solution :*** The third parameter of `LISS()` and `LISS.define()` allow you to define a list of dependancies when defining a component.
- `document.createElement()` doesn't allow you to pass parameters to your Web Component ([more info](https://github.com/WICG/webcomponents/issues/605))<br/>
***Solution :*** `LISS.createElement()` enables you to give parameters to your WebComponent, and `LISS.define()` third argument to set values to be given to the WebComponent constructor.  


## TODO

- [ ] abstract init
  - [ ] upgrade childs first
- [ ] shadowDom (closed by default : constructor option)
  - [ ] (content) Elements not compatible with shadow...
- [ ] listen attribute AFTER init : list in LISS() second argument
- [ ] get slots + pseudo slots for non-shadow

- [ ] In `connectedCallback()` optionnal verification of data structure.
- [ ] Creade a `LISS.initElement()`, a `LISS.createElement()` on steroid (set attributes, data, childs, class, + with upgrade argument).
- [ ] Prefill WebComponent from a Template/string + with basic interpolation.
- [ ] Ressources : finalize+destroy
- [ ] API TS type to remove HTMLElement suggestions in editors.
- [ ] LISS parameter Custom Element (mutation observer + event parentS)