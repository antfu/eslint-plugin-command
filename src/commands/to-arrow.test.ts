import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import { createRuleWithCommands } from '../rule'
import command from './to-arrow'
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
    /// 2a
    const a = 1`,
    output: null,
    messageId: 'invalid-command',
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
    messageId: ['fix', 'fix'],
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
    messageId: ['fix', 'fix'],
  },
  // Object method
  {
    code: d`
    const bar = {
      /// to-arrow
      bar(a: number, b: number): number {
        return a + b
      },
      foo() {
        return 1
      },
    }`,
    output: d`
    const bar = {
      bar: (a: number, b: number): number => {
        return a + b
      },
      foo() {
        return 1
      },
    }`,
    messageId: ['fix', 'fix'],
  },
  // Class method
  {
    code: d`
    class Bar {
      /// to-arrow
      bar(a: number, b: number): number {
        return a + b
      }
      foo() {
        return 1
      }
    }`,
    output: d`
    class Bar {
      bar = (a: number, b: number): number => {
        return a + b
      }
      foo() {
        return 1
      }
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
