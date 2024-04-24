import type { ESLint } from 'eslint'
import { version } from '../package.json'
import type { ESLintPluginCommandOptions } from './types'
import command from './rule'

export function createPluginWithCommands(options: ESLintPluginCommandOptions = {}) {
  const {
    name = 'command',
  } = options
  return {
    meta: {
      name,
      version,
    },
    rules: {
      command,
    },
  } satisfies ESLint.Plugin
}
