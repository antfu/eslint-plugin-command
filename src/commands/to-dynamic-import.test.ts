import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import { createRuleWithCommands } from '../rule'
import { toDynamicImport as command } from './to-dynamic-import'
import { d } from './_test-utils'

const valids = [
  'const foo = function () {}',
]

const invalids = [
  // Named import
  {
    code: d`
    /// to-dynamic-import
    import { foo } from 'bar'`,
    output: d`
    const { foo } = await import('bar')`,
    messageId: ['command-removal', 'command-fix'],
  },
  // Default import
  {
    code: d`
    /// to-dynamic-import
    import foo from 'bar'`,
    output: d`
    const { default: foo } = await import('bar')`,
    messageId: ['command-removal', 'command-fix'],
  },
  // Namespace
  {
    code: d`
    /// to-dynamic-import
    import * as foo from 'bar'`,
    output: d`
    const foo = await import('bar')`,
    messageId: ['command-removal', 'command-fix'],
  },
  // Mixed
  {
    code: d`
    /// to-dynamic-import
    import foo, { bar, baz as tex } from 'bar'`,
    output: d`
    const { default: foo, bar, baz: tex } = await import('bar')`,
    messageId: ['command-removal', 'command-fix'],
  },
  // Type import (error)
  {
    code: d`
    /// to-dynamic-import
    import type { Type } from 'baz'`,
    output: null,
    messageId: ['command-error'],
  },
  // Mixed with type import
  {
    code: d`
    /// to-dynamic-import
    import foo, { bar, type Type } from 'bar'`,
    output: d`
    import { type Type } from 'bar'
    const { default: foo, bar } = await import('bar')`,
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
