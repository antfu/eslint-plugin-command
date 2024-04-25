import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import { createRuleWithCommands } from '../rule'
import type { Command } from '../types'

export function d(str: TemplateStringsArray) {
  const lines = str[0].split('\n')
  const commonIndent = lines.slice(1).reduce((min, line) => {
    if (/^\s*$/.test(line))
      return min
    const indent = line.match(/^\s*/)?.[0].length
    return indent === undefined ? min : Math.min(min, indent)
  }, Number.POSITIVE_INFINITY)
  return lines.map(line => line.slice(commonIndent)).join('\n')
}

type Arrayable<T> = T | T[]

export interface TestCase extends RuleTester.ValidTestCase {
  output?: string | null
  errors?: Arrayable<string | RuleTester.TestCaseError>
}

export function run(command: Command, ...cases: (TestCase | string)[]) {
  const ruleTester: RuleTester = new RuleTester({
    languageOptions: {
      parser: tsParser,
    },
  })

  const validCases: (TestCase | string)[] = []
  const invalidCases: TestCase[] = []

  for (const c of cases) {
    if (typeof c === 'string')
      validCases.push(c)
    else if (c.errors)
      invalidCases.push(c)
    else
      validCases.push(c)
  }

  ruleTester.run(
    command.name,
    createRuleWithCommands([command]) as any,
    {
      valid: validCases,
      invalid: invalidCases.map(i => ({
        ...i,
        code: i.code,
        output: i.output ?? null,
        errors: (Array.isArray(i.errors) ? i.errors : [i.errors])
          .filter(notFalsy)
          .map(id => typeof id === 'string' ? ({ messageId: id }) : id),
      })),
    },
  )
}

function notFalsy<T>(value: T): value is Exclude<T, null | undefined | false> {
  return !!value
}
