import { writeFileSync } from 'node:fs'
import { builtinCommands } from '../../src/commands'

const commandNames = builtinCommands.map(command => command.name)
const body = `/// \$\{1|${commandNames.join(',')}|}`
const snippets = {
  'eslint-plugin-command': {
    prefix: 'epc',
    body,
    description: 'ESLint plugin command',
  },
}

writeFileSync('./guide/snippets.json', `${JSON.stringify(snippets, null, 2)}\n`)
