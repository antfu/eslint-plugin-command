import type { ESLint } from 'eslint'
import { version } from '../package.json'
import command from './rule'
import type { ESLintPluginCommandOptions } from './types'

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
