# `keep-sorted`

Keep the object keys or array items sorted.

## Triggers

- `/// keep-sorted`
- `// @keep-sorted`

## Examples

```js
/// keep-sorted
const obj = {
  b: 2,
  a: 1,
  c: 3,
}
```

Will be converted to:

```js
/// keep-sorted
const obj = {
  a: 1,
  b: 2,
  c: 3,
}
```

Different from the other commands, the comment will not be removed after transformation to keep the sorting.

#### Sort Array of Objects

This command takes an optional inline JSON configuration to specify the keys to sort.

```js
/// keep-sorted { "keys": ["index", "name"] }
const arr = [
  { index: 4, name: 'foo' },
  { index: 2, name: 'bar' },
  { index: 2, name: 'apple' },
  { index: 0, name: 'zip' },
]
```

Will be converted to:

```js
/// keep-sorted { "keys": ["index", "name"] }
const arr = [
  { index: 0, name: 'zip' },
  { index: 2, name: 'apple' },
  { index: 2, name: 'bar' },
  { index: 4, name: 'foo' },
]
```
