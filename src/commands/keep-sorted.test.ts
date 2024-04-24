import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import { createRuleWithCommands } from '../rule'
import { keepSorted as command } from './keep-sorted'
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
  // Type interface members
  {
    code: d`
    // @keep-sorted
    export interface Path {
      parent: TSESTree.Node | null
      parentPath: Path | null
      parentKey: string | null
      node: TSESTree.Node
    }
    `,
    output: d`
    // @keep-sorted
    export interface Path {
      node: TSESTree.Node
      parent: TSESTree.Node | null
      parentKey: string | null
      parentPath: Path | null
    }
    `,
    messageId: ['fix'],
  },
  // Type type members
  {
    code: d`
    // @keep-sorted
    export type Path = {
      parent: TSESTree.Node | null
      parentPath: Path | null
      parentKey: string | null
      node: TSESTree.Node
    }
    `,
    output: d`
    // @keep-sorted
    export type Path = {
      node: TSESTree.Node
      parent: TSESTree.Node | null
      parentKey: string | null
      parentPath: Path | null
    }
    `,
    messageId: ['fix'],
  },
  {
    code: d`
    function foo() {
      // @keep-sorted
      queue.push({
        parent: null,
        node,
        parentPath: null,
        parentKey: null,
      })
    }`,
    output: d`
    function foo() {
      // @keep-sorted
      queue.push({
        node,
        parent: null,
        parentKey: null,
        parentPath: null,
      })
    }`,
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
