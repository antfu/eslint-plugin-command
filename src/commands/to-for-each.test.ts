import { $, run } from './_test-utils'
import { toForEach as command } from './to-for-each'

run(
  command,
  // Basic for-of
  {
    code: $`
      /// to-for-each
      for (const foo of bar) {
        if (foo) {
          continue
        }
        else if (1 + 1 === 2) {
          continue
        }
      }
    `,
    output: $`
      bar.forEach((foo) => {
        if (foo) {
          return
        }
        else if (1 + 1 === 2) {
          return
        }
      })
    `,
    errors: ['command-fix'],
  },
  // One-line for-of
  {
    code: $`
      /// to-for-each
      for (const foo of bar) 
        count += 1
    `,
    output: $`
      bar.forEach((foo) => {
      count += 1
      })
    `,
    errors: ['command-fix'],
  },
  // Nested for
  {
    code: $`
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
      }
    `,
    output: $`
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
      })
    `,
    errors: ['command-fix'],
  },
  // Throw on return statement
  {
    code: $`
      /// to-for-each
      for (const foo of bar) {
        return foo
      }
    `,
    errors: ['command-error', 'command-error-cause'],
  },
  // Destructure
  {
    code: $`
      /// to-for-each
      for (const [key, value] of Object.entries(baz)) {
        console.log(foo, bar)
      }
    `,
    output: $`
      Object.entries(baz).forEach(([key, value]) => {
        console.log(foo, bar)
      })
    `,
    errors: ['command-fix'],
  },
  // Iterate over expressions
  {
    code: $`
      /// to-for-each
      for (const i of 'a' + 'b')
        console.log(i)
    `,
    output: $`
      ;('a' + 'b').forEach((i) => {
      console.log(i)
      })
    `,
    errors: ['command-fix'],
  },
  // Iterate over object
  {
    code: $`
      /// to-for-each
      for (const key of { a: 1, b: 2 })
        console.log(key)
    `,
    output: $`
      ;({ a: 1, b: 2 }).forEach((key) => {
      console.log(key)
      })
    `,
    errors: ['command-fix'],
  },
)
