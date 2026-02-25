import eslintMarkdown from '@eslint/markdown'
import { run } from 'eslint-vitest-rule-tester'
import { builtinCommands } from './commands'
import { createRuleWithCommands } from './rule'

// Do not throw error when `getAllComments` is not available (e.g. in markdown source code)
run({
  name: 'command',
  rule: createRuleWithCommands(builtinCommands),
  configs: {
    plugins: {
      markdown: eslintMarkdown as any,
    },
    language: 'markdown/gfm',
  },
  valid: [
    '',
  ],
})
