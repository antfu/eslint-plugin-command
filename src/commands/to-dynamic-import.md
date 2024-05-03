# `to-dynamic-import`

Convert import statement to dynamic import.

## Triggers

- `/// to-dynamic-import`
- `/// to-dynamic`

## Examples

```js
/// to-dynamic-import
import bar, { foo } from './foo'
```

Will be converted to:

```js
const { default: bar, foo } = await import('./foo')
```
