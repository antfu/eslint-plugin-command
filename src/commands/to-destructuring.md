# `to-destructuring`

Convert an assignment expression to destructuring assignment.

## Triggers

- `/// to-destructuring`
- `/// to-dest`
- `/// 2destructuring`
- `/// 2dest`

## Examples

```js
/// to-destructuring
const foo = bar.foo

/// to-dest
const baz = bar?.foo

/// 2destructuring
const foo = bar[0]

/// 2dest
const foo = bar?.[1]

let foo
/// to-destructuring
foo = bar().foo
```

Will be converted to:

```js
const { foo } = bar

const { foo: baz } = bar ?? {}

const [foo] = bar

const [,foo] = bar ?? []

let foo
;({ foo } = bar())
```
