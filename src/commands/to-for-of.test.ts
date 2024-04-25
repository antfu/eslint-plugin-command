import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import { createRuleWithCommands } from '../rule'
import { toForOf as command } from './to-for-of'
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
    /// to-for-of
    bar.forEach(b => {
      if (!b)
        return
      console.log(b)
    })`,
    output: d`
    for (const b of bar) {
      if (!b)
        continue
      console.log(b)
    }`,
    messageId: ['command-removal', 'command-fix'],
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
