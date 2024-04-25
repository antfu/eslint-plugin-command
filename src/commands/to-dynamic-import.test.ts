import { toDynamicImport as command } from './to-dynamic-import'
import { d, run } from './_test-utils'

run(
  command,
  // Named import
  {
    code: d`
    /// to-dynamic-import
    import { foo } from 'bar'`,
    output: d`
    const { foo } = await import('bar')`,
    errors: ['command-removal', 'command-fix'],
  },
  // Default import
  {
    code: d`
    /// to-dynamic-import
    import foo from 'bar'`,
    output: d`
    const { default: foo } = await import('bar')`,
    errors: ['command-removal', 'command-fix'],
  },
  // Namespace
  {
    code: d`
    /// to-dynamic-import
    import * as foo from 'bar'`,
    output: d`
    const foo = await import('bar')`,
    errors: ['command-removal', 'command-fix'],
  },
  // Mixed
  {
    code: d`
    /// to-dynamic-import
    import foo, { bar, baz as tex } from 'bar'`,
    output: d`
    const { default: foo, bar, baz: tex } = await import('bar')`,
    errors: ['command-removal', 'command-fix'],
  },
  // Type import (error)
  {
    code: d`
    /// to-dynamic-import
    import type { Type } from 'baz'`,
    errors: ['command-error'],
  },
  // Mixed with type import
  {
    code: d`
    /// to-dynamic-import
    import foo, { bar, type Type } from 'bar'`,
    output: d`
    import { type Type } from 'bar'
    const { default: foo, bar } = await import('bar')`,
    errors: ['command-removal', 'command-fix'],
  },
)
