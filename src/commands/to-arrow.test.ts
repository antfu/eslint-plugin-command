import { toArrow as command } from './to-arrow'
import { $, run } from './_test-utils'

run(
  command,
  'const foo = function () {}',
  `export const foo = <T = 1>(arg: Z): Bar => {
    const bar = () => {}
  }`,
  {
    code: $`
    /// 2a
    const a = 1`,
    errors: ['command-error'],
  },
  // Function declaration
  {
    code: $`
    /// to-arrow
    export async function foo <T = 1>(arg: T): Bar {
      const bar = () => {}
    }`,
    output: $`
    export const foo = async <T = 1>(arg: T): Bar => {
      const bar = () => {}
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Function expression
  {
    code: $`
    ///to-arrow
    const bar = async function foo <T = 1>(arg: T): Bar {
      function baz() {}
    }`,
    output: $`
    const bar = async <T = 1>(arg: T): Bar => {
      function baz() {}
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Object method
  {
    code: $`
    const bar = {
      /// to-arrow
      async [bar]?(a: number, b: number): number {
        return a + b
      },
      foo() {
        return 1
      },
    }`,
    output: $`
    const bar = {
      [bar]: async (a: number, b: number): number => {
        return a + b
      },
      foo() {
        return 1
      },
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Getter/setter
  {
    code: $`
    const bar = {
      /// to-arrow
      get id() {}
    }`,
    errors: ['command-error'],
  },
  // Class method
  {
    code: $`
    class Bar {
      /// to-arrow
      private static override async [bar]?(a: number, b: number): number {
        return a + b
      }
      foo() {
        return 1
      }
    }`,
    output: $`
    class Bar {
      private static override [bar] ? = async (a: number, b: number): number => {
        return a + b
      }
      foo() {
        return 1
      }
    }`,
    errors: ['command-removal', 'command-fix'],
  },
)
