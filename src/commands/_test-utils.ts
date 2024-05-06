import * as tsParser from '@typescript-eslint/parser'
import type { TestCase } from 'eslint-vitest-rule-tester'
import { createRuleTester } from 'eslint-vitest-rule-tester'
import { createRuleWithCommands } from '../rule'
import type { Command } from '../types'

export { unindent as $ } from 'eslint-vitest-rule-tester'

export function run(command: Command | Command[], ...cases: (TestCase | string)[]) {
  const commands = Array.isArray(command) ? command : [command]

  const ruleTester = createRuleTester({
    name: commands[0].name,
    rule: createRuleWithCommands(commands) as any,
    configs: {
      languageOptions: {
        parser: tsParser,
      },
      files: ['**/*.ts', '**/*.js'],
    },
  })

  const validCases: (TestCase | string)[] = []
  const invalidCases: TestCase[] = []

  for (const c of cases) {
    if (typeof c === 'string')
      validCases.push(c)
    else
      invalidCases.push(c)
  }

  ruleTester.run({
    valid: validCases,
    invalid: invalidCases,
  })
}
