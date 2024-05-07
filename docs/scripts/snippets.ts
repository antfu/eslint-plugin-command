import { writeFileSync } from 'node:fs'
import { builtinCommands } from '../../src/commands'

const commandNames = builtinCommands.map(command => command.name)
const fullBody = `/// \$\{1|${commandNames.join(',')}|}`
const atBody = `// @\$\{1|${commandNames.join(',')}|}`

const snippets = {
  'eslint-plugin-command': {
    prefix: 'epc',
    body: fullBody,
    description: 'ESLint plugin command',
  },
  'eslint-plugin-command-at': {
    prefix: 'epc',
    body: atBody,
    description: 'ESLint plugin command (@)',
  },
}

writeFileSync('./guide/snippets.json', `${JSON.stringify(snippets, null, 2)}\n`)
