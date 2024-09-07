import { $, run } from './_test-utils'
import { hoistRegExp as command } from './hoist-regexp'

run(
  command,
  // basic
  {
    code: $`
      function foo(msg: string): void {
        /// hoist-regexp
        console.log(/foo/.test(msg))
      }
    `,
    output: $`
      const reFoo = /foo/
      function foo(msg: string): void {
        console.log(reFoo.test(msg))
      }
    `,
    errors: ['command-fix'],
  },
  // custom name
  {
    code: $`
      function foo(msg: string): void {
        /// hoist-regex customName
        console.log(/foo/.test(msg))
      }
    `,
    output: $`
      const customName = /foo/
      function foo(msg: string): void {
        console.log(customName.test(msg))
      }
    `,
    errors: ['command-fix'],
  },
  // nested functions
  {
    code: $`
      const bar = 1
      function bar(msg: string): void {
      }
      
      function foo(msg: string): void {
        const bar = () => {
          for (let i = 0; i < 10; i++) {
            /// hreg
            console.log(/foo|bar*([^a])/.test(msg))
          }
        }
      }
    `,
    output: $`
      const bar = 1
      function bar(msg: string): void {
      }
      
      const reFoo_bar_a = /foo|bar*([^a])/
      function foo(msg: string): void {
        const bar = () => {
          for (let i = 0; i < 10; i++) {
            console.log(reFoo_bar_a.test(msg))
          }
        }
      }
    `,
    errors: ['command-fix'],
  },
  // throw error if variable already exists
  {
    code: $`
      function foo(msg: string): void {
        const customName = 42
        /// hoist-regex customName
        console.log(/foo/.test(msg))
      }
    `,
    errors: ['command-error'],
  },
  // throw error if it's already top-level
  {
    code: $`
      /// hoist-regex
      const customName = /foo/
      function foo(msg: string): void {
        console.log(/foo/.test(msg))
      }
    `,
    errors: ['command-error'],
  },
)
