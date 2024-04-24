import type { Linter } from 'eslint'
import command from './index'

export function config(): Linter.FlatConfig {
  return {
    name: 'command',
    plugins: {
      command,
    },
    rules: {
      'command/command': 'error',
    },
  }
}
