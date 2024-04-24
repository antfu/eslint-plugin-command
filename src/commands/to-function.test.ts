import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import { createRuleWithCommands } from '../rule'
import command from './to-function'
import { d } from './_test-utils'

const valids = [
  'const foo = function () {}',
  `export const foo = <T = 1>(arg: Z): Bar => {
    const bar = () => {}
  }`,
]

const invalids = [
  {
    code: d`
    ///to-fn
    const a = 1`,
    output: null,
    messageId: 'invalid-command',
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
    messageId: ['fix', 'fix'],
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
    messageId: ['fix', 'fix'],
  },
]

const ruleTester: RuleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
  },
})

ruleTester.run(command.name, createRuleWithCommands([command]) as any, {
  valid: valids,
  invalid: invalids.map(i => ({
    code: i.code,
    output: i.output,
    errors: (Array.isArray(i.messageId) ? i.messageId : [i.messageId])
      .map(id => ({ messageId: id })),
  })),
})
