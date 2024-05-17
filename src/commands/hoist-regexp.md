# `hoist-regexp`

Hoist regular expressions to the top-level.

## Triggers

- `/// hoist-regexp`
- `/// hoist-regex`
- `/// hreg`

## Examples

```js
function foo(msg: string): void {
  /// hoist-regexp
  console.log(/foo/.test(msg))
}
```

Will be converted to:

```js
const re$0 = /foo/

function foo(msg: string): void {
  console.log(re$0.test(msg))
}
```

You can also provide a name for the hoisted regular expression:

```js
function foo(msg: string): void {
  /// hoist-regexp myRegex
  console.log(/foo/.test(msg))
}
```

Will be converted to:

```js
const myRegex = /foo/

function foo(msg: string): void {
  console.log(myRegex.test(msg))
}
```
