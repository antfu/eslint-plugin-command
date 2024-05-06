# `keep-unique`

Keep array items unique, removing duplicates.

## Triggers

- `/// keep-unique`
- `/// uniq
- `// @keep-unique`

## Examples

```js
/// keep-unique
const array = [
  1,
  2,
  3,
  2,
  '3',
]
```

Will be converted to:

```js
/// keep-unique
const array = [
  1,
  2,
  3,
  '3',
]
```
