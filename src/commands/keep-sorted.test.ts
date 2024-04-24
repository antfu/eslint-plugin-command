import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import { createRuleWithCommands } from '../rule'
import command from './keep-sorted'
import { d } from './_test-utils'

const valids = [
  // Already sorted
  d`
  // @keep-sorted
  export const arr = [
    'apple',
    'bar',
    'foo',
  ]`,
]

const invalids = [
  // Object property
  {
    code: d`
    // @keep-sorted
    export const obj = {
      foo,
      bar: () => {},
      apple: 1,
    }`,
    output: d`
    // @keep-sorted
    export const obj = {
      apple: 1,
      bar: () => {},
      foo,
    }`,
    messageId: ['fix'],
  },
  // Array elements
  {
    code: d`
    // @keep-sorted
    export const arr = [
      'foo',
      'bar',
      'apple',
    ]`,
    output: d`
    // @keep-sorted
    export const arr = [
      'apple',
      'bar',
      'foo',
    ]`,
    messageId: ['fix'],
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
