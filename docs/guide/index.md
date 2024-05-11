---
outline: deep
---

# Introduction

**ESLint Plugin Command** is a special kind of ESLint plugin, that by default, **does nothing**. Instead of checking for code quality, it serves as a micro-codemod tool triggers by special comments on-demand, resuse the infrastructure of ESLint.

For example, one of the built-in commands, `/// to-function` allows you to convert a single arrow function expression to a function declaration.

<!-- eslint-skip -->

```ts
/// to-function
const foo = async <T>(msg: T): void => {
  console.log(msg)
}
```

Will be transformed to this when you hit save with your editor or run `eslint . --fix`. After executing the command, the comment will also be removed along with the transformation:

```ts
async function foo<T>(msg: T): void {
  console.log(msg)
}
```

One more example that `/// to-promise-all` converts a sequence of `await` expressions to `await Promise.all()`:

<!-- eslint-skip -->

```ts
/// to-promise-all
const foo = await bar().then
const { get } = await import('lodash-es')
```

Will be transformed to:

```ts
const [
  foo,
  { get },
] = await Promise.all([
  bar(),
  import('lodash-es'),
] as const)
```

## Built-in Commands

There is a few list of built-in commands for quick references

- [`/// keep-sorted`](/commands/keep-sorted) - keep an object/array/interface always sorted
- [`/// to-function`](/commands/to-function) - converts an arrow function to a normal function
- [`/// to-arrow`](/commands/to-arrow) - converts a normal function to an arrow function
- [`/// to-for-each`](/commands/to-for-each) - converts a for-in/for-of loop to `.forEach()`
- [`/// to-for-of`](/commands/to-for-of) - converts a `.forEach()` to a for-of loop
- [`/// to-promise-all`](/commands/to-promise-all) - converts a sequence of `await` exps to `await Promise.all()`
- [`/// to-string-literal`](/commands/to-string-literal) - converts a template literal to a string concatenation
- [`/// to-template-literal`](/commands/to-template-literal) - converts a string concatenation to a template literal
- ... and more, check the sidebar for the full list
