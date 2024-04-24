import type { ESLint } from 'eslint'
import { version } from '../package.json'
import command from './rule'

const plugin = {
  meta: {
    name: 'command',
    version,
  },
  rules: {
    command,
  },
} satisfies ESLint.Plugin

export default plugin
