import { $, run } from './_test-utils'
import { keepSorted as command } from './keep-sorted'

run(
  command,
  // Already sorted
  $`
    // @keep-sorted
    export const arr = [
      'apple',
      'bar',
      'foo',
    ]
  `,
  // multi interfaces without export
  $`
    // @keep-sorted
    interface A {
      foo: number
    }
    // @keep-sorted
    interface B {
      foo: number
    }
  `,
  // multi declares without export
  $`
    // @keep-sorted
    const arr1 = [
      { index: 0, name: 'foo' },
    ]
    // @keep-sorted
    const arr2 = [
      { index: 0, name: 'foo' },
    ]
  `,
  // Object property
  {
    code: $`
      // @keep-sorted
      export const obj = {
        foo,
        bar: () => {},
        apple: 1,
      }
    `,
    output: $`
      // @keep-sorted
      export const obj = {
        apple: 1,
        bar: () => {},
        foo,
      }
    `,
    errors: ['command-fix'],
  },
  // Some object property keys are string
  {
    code: $`
      // @keep-sorted
      export const obj = {
        foo,
        'bar': () => {},
        apple: 1,
      }
    `,
    output: $`
      // @keep-sorted
      export const obj = {
        'bar': () => {},
        apple: 1,
        foo,
      }
    `,
    errors: ['command-fix'],
  },
  // All object property keys are string
  {
    code: $`
      // @keep-sorted
      export const rules = {
        'block-scoped-var': 'error',
        'array-callback-return': 'error',
        'constructor-super': 'error',
        'default-case-last': 'error',
      }
    `,
    output: $`
      // @keep-sorted
      export const rules = {
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'constructor-super': 'error',
        'default-case-last': 'error',
      }
    `,
    errors: ['command-fix'],
  },
  // Array elements
  {
    code: $`
      // @keep-sorted
      export const arr = [
        'foo',
        'bar',
        'apple',
      ]
    `,
    output: $`
      // @keep-sorted
      export const arr = [
        'apple',
        'bar',
        'foo',
      ]
    `,
    errors: ['command-fix'],
  },
  // Type interface members
  {
    code: $`
      // @keep-sorted
      export interface Path {
        parent: TSESTree.Node | null
        parentPath: Path | null
        parentKey: string | null
        node: TSESTree.Node
      }
    `,
    output: $`
      // @keep-sorted
      export interface Path {
        node: TSESTree.Node
        parent: TSESTree.Node | null
        parentKey: string | null
        parentPath: Path | null
      }
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Type members',
    code: $`
      // @keep-sorted
      export type Path = {
        parent: TSESTree.Node | null
        parentPath: Path | null
        parentKey: string | null
        node: TSESTree.Node
      }
    `,
    output: $`
      // @keep-sorted
      export type Path = {
        node: TSESTree.Node
        parent: TSESTree.Node | null
        parentKey: string | null
        parentPath: Path | null
      }
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Function arguments',
    code: $`
      function foo() {
        // @keep-sorted
        queue.push({
          parent: null,
          node,
          parentPath: null,
          parentKey: null,
        })
      }
    `,
    output: $`
      function foo() {
        // @keep-sorted
        queue.push({
          node,
          parent: null,
          parentKey: null,
          parentPath: null,
        })
      }
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Export statement',
    code: $`
      // @keep-sorted
      export {
        foo,
        bar,
        apple,
      }
    `,
    output: $`
      // @keep-sorted
      export {
        apple,
        bar,
        foo,
      }
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Export statement without trailing comma',
    code: $`
      // @keep-sorted
      export {
        foo,
        bar,
        apple
      }
    `,
    output: $`
      // @keep-sorted
      export {
        apple,
        bar,
        foo,
      }
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Sort array of objects',
    code: $`
      // @keep-sorted { "keys": ["index", "name"] }
      export default [
        { index: 4, name: 'foo' },
        { index: 2, name: 'bar' },
        { index: 2, name: 'apple' },
        { index: 0, name: 'zip' },
        'foo',
        { index: 6, name: 'bar' },
        { index: 3, name: 'foo' },
      ]
    `,
    output: $`
      // @keep-sorted { "keys": ["index", "name"] }
      export default [
        { index: 0, name: 'zip' },
        { index: 2, name: 'apple' },
        { index: 2, name: 'bar' },
        { index: 4, name: 'foo' },
        'foo',
        { index: 3, name: 'foo' },
        { index: 6, name: 'bar' },
      ]
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Error on invalid JSON',
    code: $`
      // @keep-sorted { keys: [1, 2, 3] }
      export default [
        { index: 4, name: 'foo' },
        { index: 2, name: 'bar' },
      ]
    `,
    errors: ['command-error'],
  },
  {
    description: 'Destructuring assignment',
    code: $`
      // @keep-sorted
      const { foo, bar, apple } = obj
    `,
    output: $`
      // @keep-sorted
      const { apple, bar, foo, } = obj
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Destructuring assignment multiple lines',
    code: $`
      // @keep-sorted
      const {
        foo,
        bar,
        apple,
      } = obj
    `,
    output: $`
      // @keep-sorted
      const {
        apple,
        bar,
        foo,
      } = obj
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Destructuring assignment multiple lines without trailing comma',
    code: $`
      // @keep-sorted
      const {
        foo,
        bar,
        apple
      } = obj
    `,
    output: $`
      // @keep-sorted
      const {
        apple,
        bar,
        foo,
      } = obj
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Block comment',
    code: $`
      /**
       * Some JSdocs
       *
       * @keep-sorted
       * @description
       */
      export const arr = [
        'foo',
        'bar',
        'apple',
      ]
    `,
    output: $`
      /**
       * Some JSdocs
       *
       * @keep-sorted
       * @description
       */
      export const arr = [
        'apple',
        'bar',
        'foo',
      ]
    `,
    errors: ['command-fix'],
  },
  {
    description: 'Inlined array',
    code: $`
      // @keep-sorted
      export const arr = [ 'foo', 'bar', 'apple' ]
    `,
    output: $`
      // @keep-sorted
      export const arr = [ 'apple', 'bar', 'foo', ]
    `,
  },
  {
    description: 'Array without trailing comma',
    code: $`
      // @keep-sorted
      export const arr = [ 
        'foo',
        'bar',
        'apple'
      ]
    `,
    output: $`
      // @keep-sorted
      export const arr = [ 
        'apple',
        'bar',
        'foo',
      ]
    `,
  },
  {
    description: 'With satisfies',
    code: $`
      // @keep-sorted
      const a = {
        foo,
        bar,
        apple
      } satisfies Record<string, any>
    `,
    output: $`
      // @keep-sorted
      const a = {
        apple,
        bar,
        foo,
      } satisfies Record<string, any>
    `,
    errors: ['command-fix'],
  },
  {
    description: 'With satisfies',
    code: $`
      // @keep-sorted
      const a = bar satisfies Record<string, any>
    `,
    errors: ['command-error'],
  },
  {
    description: 'Sort object of objects',
    code: $`
      /// keep-sorted { "keys": ["index","label"] }
      const obj = {
        a: { index: 3, label: 'banana' },
        b: { index: 2, label: 'cherry' },
        c: { index: 2, label: 'apple' },
        d: { index: 1, label: 'berry' }
      }
    `,
    output: $`
      /// keep-sorted { "keys": ["index","label"] }
      const obj = {
        d: { index: 1, label: 'berry' },
        c: { index: 2, label: 'apple' },
        b: { index: 2, label: 'cherry' },
        a: { index: 3, label: 'banana' },
      }
    `,
    errors: ['command-fix'],
  },
)
