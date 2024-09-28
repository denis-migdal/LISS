# LISSState

-> accessible from `LISSHost` and `LISSBase` instances (TODO: from class too).
-> accessible from `getState(HTMLElement)`

## States

- class
    - `DEFINED` : custom element is defined.
    - `READY`   : ready to be initialized.
- instance
    - `UPGRADED`    : HTMLElement was upgraded into LISSHost.
    - `INITIALIZED` : LISSBase is created.

## Properties

Properties:
- `is(state): boolean`
- `when(state): Promise`

For each state:
- `is[State]: boolean`
- `when[State](): Promise`.

- `whenDefined()    : LISSHostCstr`
- `whenReady()      : ?`
- `whenUpgraded()   : LISSHost`
- `whenInitialized(): LISSBase`

Implicit conversions:
- to number (the state) : enables to do e.g. `state & UPGRADED`.
- to string : e.g. `"UPGRADED|DEFINED"`.

## State modifiers

- `liss.define(LISSHost|LISSBase)`
- `liss.upgrade[Sync]<LISSHost>(HTMLElement, strict=false): LISSHost` : if `strict` raise an exception if already upgraded.
- `liss.initialize[Sync]<LISSBase>(HTMLElement|LISSHost, strict=false): LISSBase` : if `strict` raise an exception if already upgraded.

## Externals when

- + whenDefined + other customRegistery methods ?
- `whenUpgraded   (HTMLElement, force=false, strict=false): LISSHost`.
- `whenInitialized(HTMLElement, force=false, strict=false): LISSBase`.