import { toArrow as command } from './to-arrow'
import { d, run } from './_test-utils'

run(
  command,
  'const foo = function () {}',
  `export const foo = <T = 1>(arg: Z): Bar => {
    const bar = () => {}
  }`,
  {
    code: d`
    /// 2a
    const a = 1`,
    output: null,
    errors: 'command-error',
  },
  // Function declaration
  {
    code: d`
    /// to-arrow
    export async function foo <T = 1>(arg: T): Bar {
      const bar = () => {}
    }`,
    output: d`
    export const foo = async <T = 1>(arg: T): Bar => {
      const bar = () => {}
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Function expression
  {
    code: d`
    ///to-arrow
    const bar = async function foo <T = 1>(arg: T): Bar {
      function baz() {}
    }`,
    output: d`
    const bar = async <T = 1>(arg: T): Bar => {
      function baz() {}
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Object method
  {
    code: d`
    const bar = {
      /// to-arrow
      async [bar]?(a: number, b: number): number {
        return a + b
      },
      foo() {
        return 1
      },
    }`,
    output: d`
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
    code: d`
    const bar = {
      /// to-arrow
      get id() {}
    }`,
    output: null,
    errors: 'command-error',
  },
  // Class method
  {
    code: d`
    class Bar {
      /// to-arrow
      private static override async [bar]?(a: number, b: number): number {
        return a + b
      }
      foo() {
        return 1
      }
    }`,
    output: d`
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
