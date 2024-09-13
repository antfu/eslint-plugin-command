import type { TestCase } from 'eslint-vitest-rule-tester'
import type { Command } from '../types'
import * as tsParser from '@typescript-eslint/parser'
import { run as _run } from 'eslint-vitest-rule-tester'
import { createRuleWithCommands } from '../rule'

export { unindent as $ } from 'eslint-vitest-rule-tester'

export function run(command: Command | Command[], ...cases: (TestCase | string)[]) {
  const commands = Array.isArray(command) ? command : [command]

  const validCases: (TestCase | string)[] = []
  const invalidCases: TestCase[] = []

  for (const c of cases) {
    if (typeof c === 'string')
      validCases.push(c)
    else
      invalidCases.push(c)
  }

  return _run({
    name: commands[0].name,
    rule: createRuleWithCommands(commands) as any,
    languageOptions: {
      parser: tsParser,
    },
    valid: validCases,
    invalid: invalidCases,
  })
}
