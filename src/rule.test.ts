import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import rule, { RULE_NAME } from './rule'

function d(str: TemplateStringsArray) {
  const lines = str[0].split('\n')
  const commonIndent = lines.slice(1).reduce((min, line) => {
    if (/^\s*$/.test(line))
      return min
    const indent = line.match(/^\s*/)?.[0].length
    return indent === undefined ? min : Math.min(min, indent)
  }, Number.POSITIVE_INFINITY)
  return lines.map(line => line.slice(commonIndent)).join('\n')
}

const valids = [
  'const foo = function () {}',
  `export const foo = <T = 1>(arg: Z): Bar => {
    const bar = () => {}
  }`,
]

const invalids = [
  {
    code: d`
    // :to-fn
    const a = 1`,
    output: null,
    messageId: 'invalid-command',
  },
  {
    code: d`
    // :to-fn
    export const foo = <T = 1>(arg: Z): Bar => {
      const bar = () => {}
    }`,
    output: d`
    // :to-fn
    export function foo <T = 1>(arg: Z): Bar {
      const bar = () => {}
    }`,
    messageId: 'fix',
  },
]

const ruleTester: RuleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
  },
})

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids,
  invalid: invalids.map(i => ({
    code: i.code,
    output: i.output,
    errors: [{ messageId: i.messageId }],
  })),
})
