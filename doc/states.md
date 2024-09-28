# States

- class
    - `DEFINED` : custom element is defined.
    - `READY`   : liss is ready to be initialized.
- instance
    - `UPGRADED`    : HTMLElement was upgraded into LISSHost.
    - `INITIALIZED` : LISSBase is created.

## States modifiers

- `define`
- `upgrade[Sync]`
- `initialize[Sync]` : raises error if already initialized
- `getLISS[Sync]`: like initialize, without raising errors if initialized. todo : options

## Getters (move ?)

- `getHostCstr[Sync]`
- `getHost[Sync]`
- `getLISS[Sync]`: todo : options

## ?

For one state:
- `is[State]`   : returns a boolean whether the element is in such a state
- `when[State]` : returns a promise

For many states:
- `getState`
- `isState`
- `whenState`
