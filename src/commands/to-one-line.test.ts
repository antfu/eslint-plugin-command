import { $, run } from './_test-utils'
import { toOneLine as command } from './to-one-line'

run(
  command,
  {
    code: $`
      /// to-one-line
      const foo = {
        bar: 1,
        baz: 2,
      }
    `,
    output: $`
      const foo = { bar: 1, baz: 2 }
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-one-line
      const arr = [
        1,
        2,
        3,
        4,
      ]
    `,
    output: $`
      const arr = [1, 2, 3, 4]
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// tol
      obj = {
        x: 100,
        y: 200,
      }
    `,
    output: $`
      obj = { x: 100, y: 200 }
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-one-line
      const data = {
        user: {
          name: 'Alice',
          age: 30,
        },
        scores: [
          10,
          20,
          30,
        ],
      }
    `,
    output: $`
      const data = { user: { name: 'Alice', age: 30 }, scores: [10, 20, 30] }
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// 21l
      const alreadyOneLine = { a: 1, b: 2 }
    `,
    output: $`
      const alreadyOneLine = { a: 1, b: 2 }
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-one-line
      const fruits = [
        "apple",
        "banana",
        "cherry",
      ]
    `,
    output: $`
      const fruits = ["apple", "banana", "cherry"]
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-one-line
      whichFruitIsTheBest([
        "apple",
        "banana",
        "cherry",
      ])
    `,
    output: $`
      whichFruitIsTheBest(["apple", "banana", "cherry"])
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-one-line
      function whichFruitIsTheBest({
        apple,
        banana,
        cherry,
      }) {}
    `,
    output: $`
      function whichFruitIsTheBest({ apple, banana, cherry }) {}
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-one-line
      function f([
        a,
        b,
        c,
      ]) {}
    `,
    output: $`
      function f([a, b, c]) {}
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-one-line
      return {
        foo: 1,
        bar: 2,
      }
    `,
    output: $`
      return { foo: 1, bar: 2 }
    `,
    errors: ['command-fix'],
  },
)
