# `to-ternary`

Convert an `if-else` statement to a [`ternary expression`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).

## Triggers

- `/// to-ternary`
- `/// to-3`
- `/// 2ternary`
- `/// 23`

## Examples

```js
/// to-ternary
if (condition)
  foo()
else
  bar = 1

// For conditional assignments to the same variable
/// to-ternary
if (condition1)
  foo = 1
else if (condition2)
  foo = bar
else
  foo = baz()
```

Will be converted to (the command comment will be removed along the way):

```js
condition ? foo() : bar = 1

foo = condition1 ? 1 : condition2 ? bar : baz()
```
