# LISSHost<LISSBase|LISSBaseCstr>

Properties:
- `state: LISSState`
- `base: LISSBase|null`

Initialization:
- `isInitialized: boolean`
- `initialize(params): LISSBase`
- `whenInitialized: Promise<LISSBase>`

Parameters:
- `params`
- `updateParams(params)`

Attributes:
- `attrs`
- `setAttrDefault(name, value)` : [TODO] replace by attr: {key: default} ?

Others:
- `content`
- `hasShadow`
- `CSSSelector`

Static properties:
- `Base: LISSBaseCstr`
- `whenDepsResolved` : internal, required for `state`.
- `isDepsResolved`   : internal, required for `state`.