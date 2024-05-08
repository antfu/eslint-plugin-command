# `regex101`

Generate up-to-date [regex101](https://regex101.com/) links for your RegExp patterns in jsdoc comments. Helps you test and inspect the RegExp easily.

## Triggers

- `// @regex101`
- `/* @regex101 */`

## Examples

```js
/**
 * RegExp to match foo or bar, optionally wrapped in quotes.
 *
 * @regex101
 */
const foo = /(['"])?(foo|bar)\\1?/gi
```

Will be updated to:

```js
/**
 * RegExp to match foo or bar, optionally wrapped in quotes.
 *
 * @regex101 https://regex101.com/?regex=%28%5B%27%22%5D%29%3F%28foo%7Cbar%29%5C1%3F&flags=gi&flavor=javascript
 */
const foo = /(['"])?(foo|bar)\\1?/gi
```

An whenever you update the RegExp pattern, the link will be updated as well.

### Optional Test Strings

Test string can also be provided via an optional `@example` tag:

```js
/**
 * Some jsdoc
 *
 * @example str
 * \`\`\`js
 * if ('foo'.match(foo)) {
 *   const foo = bar
 * }
 * \`\`\`
 *
 * @regex101
 */
const foo = /(['"])?(foo|bar)\\1?/gi
```

Will be updated to:

```js
/**
 * Some jsdoc
 *
 * @example str
 * \`\`\`js
 * if ('foo'.match(foo)) {
 *   const foo = bar
 * }
 * \`\`\`
 *
 * @regex101 https://regex101.com/?regex=%28%5B%27%22%5D%29%3F%28foo%7Cbar%29%5C1%3F&flags=gi&flavor=javascript&testString=if+%28%27foo%27.match%28foo%29%29+%7B%0A++const+foo+%3D+bar%0A%7D
 */
const foo = /(['"])?(foo|bar)\\1?/gi
```
