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