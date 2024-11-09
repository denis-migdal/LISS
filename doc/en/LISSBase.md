# LISSBase

Attributes:
- `attrs         -> observedAttributes`
- `onAttrChanged -> attributeChangedCallback`
- `setAttrDefault` : [TODO] merge with attrs declaration.

Params:
- `params`
- `updateParams(Params)`

DOM:
- `isInDOM           -> isConnected`
- `onDOMConnected    -> connectedCallback`
- `onDOMDisconnected -> disconnectedCallback`

Content:
- `state: LISSState`
- `host: HTMLElement`
- `content: HTMLElement|ShadowRoot`

Static properties:
- `Host: LISSHostCstr`