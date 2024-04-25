import { toForEach as command } from './to-for-each'
import { d, run } from './_test-utils'

run(
  command,
  // Basic for-of
  {
    code: d`
    /// to-for-each
    for (const foo of bar) {
      if (foo) {
        continue
      }
      else if (1 + 1 === 2) {
        continue
      }
    }`,
    output: d`
    bar.forEach((foo) => {
      if (foo) {
        return
      }
      else if (1 + 1 === 2) {
        return
      }
    })`,
    errors: ['command-removal', 'command-fix'],
  },
  // One-line for-of
  {
    code: d`
    /// to-for-each
    for (const foo of bar) 
      count += 1
    `,
    output: d`
    bar.forEach((foo) => {
    count += 1
    })
    `,
    errors: ['command-removal', 'command-fix'],
  },
  // Nested for
  {
    code: d`
    /// to-for-each
    for (const foo of bar) {
      for (const baz of foo) {
        if (foo) {
          continue
        }
      }
      const fn1 = () => {
        continue
      }
      function fn2() {
        continue
      }
    }`,
    output: d`
    bar.forEach((foo) => {
      for (const baz of foo) {
        if (foo) {
          continue
        }
      }
      const fn1 = () => {
        continue
      }
      function fn2() {
        continue
      }
    })`,
    errors: ['command-removal', 'command-fix'],
  },
  // Throw on return statement
  {
    code: d`
    /// to-for-each
    for (const foo of bar) {
      return foo
    }`,
    errors: ['command-error', 'command-error-cause'],
  },
  // Destructure
  {
    code: d`
    /// to-for-each
    for (const [key, value] of Object.entries(baz)) {
      console.log(foo, bar)
    }`,
    output: d`
    Object.entries(baz).forEach(([key, value]) => {
      console.log(foo, bar)
    })`,
    errors: ['command-removal', 'command-fix'],
  },
  // Iterate over expressions
  {
    code: d`
    /// to-for-each
    for (const i of 'a' + 'b')
      console.log(i)`,
    output: d`
    ;('a' + 'b').forEach((i) => {
    console.log(i)
    })`,
    errors: ['command-removal', 'command-fix'],
  },
  // Iterate over object
  {
    code: d`
    /// to-for-each
    for (const key of { a: 1, b: 2 })
      console.log(key)`,
    output: d`
    ;({ a: 1, b: 2 }).forEach((key) => {
    console.log(key)
    })`,
    errors: ['command-removal', 'command-fix'],
  },
)
