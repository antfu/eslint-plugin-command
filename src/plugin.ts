import type { ESLint } from 'eslint'
import type { ESLintPluginCommandOptions } from './types'
import { version } from '../package.json'
import BuiltinRules, { createRuleWithCommands } from './rule'

export function createPluginWithCommands(options: ESLintPluginCommandOptions = {}) {
  const {
    name = 'command',
  } = options
  const plugin = options.commands
    ? createRuleWithCommands(options.commands)
    : BuiltinRules
  return {
    meta: {
      name,
      version,
    },
    rules: {
      command: plugin,
    },
  } satisfies ESLint.Plugin
}
