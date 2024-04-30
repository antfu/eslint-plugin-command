import { keepSorted as command } from './keep-sorted'
import { d, run } from './_test-utils'

run(
  command,
  // Already sorted
  d`
   // @keep-sorted
   export const arr = [
     'apple',
     'bar',
     'foo',
   ]`

  ,
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
    errors: ['command-fix'],
  },
  // Some object property keys are string
  {
    code: d`
    // @keep-sorted
    export const obj = {
      foo,
      'bar': () => {},
      apple: 1,
    }`,
    output: d`
    // @keep-sorted
    export const obj = {
      'bar': () => {},
      apple: 1,
      foo,
    }`,
    errors: ['command-fix'],
  },
  // All object property keys are string
  {
    code: d`
    // @keep-sorted
    export const rules = {
      'block-scoped-var': 'error',
      'array-callback-return': 'error',
      'constructor-super': 'error',
      'default-case-last': 'error',
    }`,
    output: d`
    // @keep-sorted
    export const rules = {
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'constructor-super': 'error',
      'default-case-last': 'error',
    }`,
    errors: ['command-fix'],
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
    errors: ['command-fix'],
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
    errors: ['command-fix'],
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
    errors: ['command-fix'],
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
    errors: ['command-fix'],
  },
  // Export statement
  {
    code: d`
    // @keep-sorted
    export {
      foo,
      bar,
      apple,
    }`,
    output: d`
    // @keep-sorted
    export {
      apple,
      bar,
      foo,
    }`,
    errors: ['command-fix'],
  },
)
