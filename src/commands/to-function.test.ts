import { toFunction as command } from './to-function'
import { d, run } from './_test-utils'

run(
  command,
  {
    code: d`
    ///to-fn
    const a = 1`,
    output: null,
    errors: 'command-error',
  },
  {
    code: d`
    /// to-function
    export const foo = <T = 1>(arg: Z): Bar => {
      const bar = () => {}
    }`,
    output: d`
    export function foo <T = 1>(arg: Z): Bar {
      const bar = () => {}
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Arrow function without name
  {
    code: d`
    // /2f
    export default <T = 1>(arg: Z): Bar => {
      const bar = () => {}
    }`,
    output: d`
    export default function <T = 1>(arg: Z): Bar {
      const bar = () => {}
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Object method
  {
    code: d`
    const bar = {
      /// to-fn
      bar: (a: number, b: number): number => a + b,
      foo: () => { return 1 }
    }`,
    output: d`
    const bar = {
      bar (a: number, b: number): number {
      return a + b
    },
      foo: () => { return 1 }
    }`,
    errors: ['command-removal', 'command-fix'],
  },
)
