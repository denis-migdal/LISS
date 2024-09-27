# Query selectors

LISS provides several optional fonctions to get fully initialized LISS components from a query string.

They are a short way for writing: `LISS.getLISS( parent.querySelector(query) )`.

| Function                       | Return             | Remarks                                                         |
| ------------------------------ | ------------------ | --------------------------------------------------------------- |
| `LISS.qs<T>(query, parent?)`   | `Promise<T>`       | Throws an exception if not found.                               |
| `LISS.qso<T>(query, parent?)`  | `Promise<T>\|null` | `null` if not found.                                            |
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