import type { Linter } from 'eslint'
import type { ESLintPluginCommandOptions } from './types'
import { createPluginWithCommands } from './plugin'
import defaultPlugin from './index'

export default function config(options: ESLintPluginCommandOptions = {}): Linter.FlatConfig {
  const plugin = options.commands
    ? createPluginWithCommands(options)
    : defaultPlugin
  const {
    name = 'command',
  } = options

  return {
    name,
    plugins: {
      [name]: plugin,
    },
    rules: {
      [`${name}/command`]: 'error',
    },
  }
}
