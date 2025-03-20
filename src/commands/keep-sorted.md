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

#### Sort Object of Objects

Uses optional inline JSON configuration (like [Sort Array of Objects](#sort-array-of-objects)) to define sort keys.

```js
/// keep-sorted { "keys": ["index","label"] }
const obj = {
  a: { index: 3, label: 'banana' },
  b: { index: 2, label: 'cherry' },
  c: { index: 2, label: 'apple' },
  d: { index: 1, label: 'berry' }
}
```

Will be converted to:

```js
/// keep-sorted { "keys": ["index","label"] }
const obj = {
  d: { index: 1, label: 'berry' },
  c: { index: 2, label: 'apple' },
  b: { index: 2, label: 'cherry' },
  a: { index: 3, label: 'banana' },
}
```
