# **[IN PROGRESS]** LISS: Light, Intuitive, Simplier, and Safer Web Components.

## Why LISS ?

Web Components are simple to use... but **hard to use *correctly***, due to a multitude of non-intuitives behaviors and rules. Most of examples and documentation found on the Internet are **unsafe** (cf [List of issues solved by LISS](#list-of-issues-solved-by-liss)).

**LISS enables you to correctly use Web Compoments without worrying about all of that.**

## Install LISS

To rebuild the JS files, use : `tsc $FILE --target es2016`.

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
- WebComponent's DOM should not be accessed/modified until the first call of `connectedCallback()`.<br/>
***Solution 1:*** Use `this.self` (protected) instead of `this` to access the WebComponent attribute/children. Throws an exception if the Web Component still hasn't be initialized.
***Solution 2:*** Use `this.content` (protected) to access the Web Component's content. 
***Solution 3:*** You may also use `this.assertInit()` (protected) at the start of your methods, to throw an exception if called while the WebComponent still hasn't be initialized.
- WebComponent should be initialized at the first call of `connectedCallback()` (can be called several times).<br/>
**Solution:**
Redefine `this.init()` (protected) to initialize your Web Component. LISS will call it only once, at the first call of `connectedCallback()`.
- Web Component's children might not be yet upgraded when `connectedCallback()` is called. Then, `customElements.upgrade(this)` need to be called.<br/>
***Solution:*** LISS automatically calls it before calling `this.init()`.
- Web Components should use `ShadowRoot` for its content. However some custom elements inheriting builtin elements doesn't support having one. ([more info](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)).<br/>
***Solution:*** Use `this.content` to set the Web Component content. LISS attaches a `ShadowRoot` if supported, else `this` is used. In your webcomponent, use `super(true/false)` to indicate whether you want the `ShadowRoot` to be open (true) or closed (false).
- `attributeChangedCallback()` is called each time an attribute is modified, even when the Web Component hasn't been initialized yet !<br/>
***Solution:*** Use `onAttrChanged()` instead, it won't be called if an attribute is modified before the Web Component has finished its initialization. Set the list of listened attributes in the second argument of `LISS()`.

## TODO

- [ ] cache attributes

- [ ] Creade a `LISS.buildElement()`, a `LISS.createElement()` on steroid (set attributes, data, childs, class, + with upgrade argument).

- [ ] API TS type to remove HTMLElement suggestions in editors.
- [ ] Ressources : finalize+destroy
- [ ] Prefill WebComponent from a Template/string/queryselector + with basic interpolation.

- [ ] LISS parameter Custom Element (mutation observer + event parentS)
- [ ] get slots + pseudo slots for non-shadow

- [ ] In `connectedCallback()` optionnal verification of data structure.

- [ ] npm package
- [ ] Test
  - [ ] test with TR element