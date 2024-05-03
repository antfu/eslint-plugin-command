import { inlineArrow as command } from './inline-arrow'
import { d, run } from './_test-utils'

run(
  command,
  // no arrow function
  {
    code: d`
    ///inline-arrow
    const a = 1`,
    output: null,
    errors: 'command-error',
  },
  // multi statement
  {
    code: d`
    /// inline-arrow
    export const foo = arg => {
      const a = 1
      return a
    }`,
    output: null,
    errors: 'command-error',
  },
  {
    code: d`
    /// inline-arrow
    export const foo = <T = 1>(arg: Z): Bar => {
      return arg
    }`,
    output: d`
    export const foo = <T = 1>(arg: Z): Bar => arg`,
    errors: ['command-removal', 'command-fix'],
  },
  // no return statement
  {
    code: d`
    ///inline-arrow
    const foo = () => {}`,
    output: d`
    const foo = () => undefined`,
    errors: ['command-removal', 'command-fix'],
  },
  // without return argument
  {
    code: d`
    // /ia
    export default <T = 1>(arg: Z): Bar => { return }`,
    output: d`
    export default <T = 1>(arg: Z): Bar => undefined`,
    errors: ['command-removal', 'command-fix'],
  },
)
