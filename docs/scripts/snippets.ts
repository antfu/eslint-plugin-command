import { writeFileSync } from 'node:fs'
import { builtinCommands } from '../../src/commands'

const commandNames = builtinCommands.map(command => command.name)
const commandNamesAbbr = commandNames.map(name => name.split('-').map(word => word[0]).join(''))

const fullBody = `/// \$\{1|${commandNames.join(',')}|}`
const atBody = `// @\$\{1|${commandNames.join(',')}|}`
const abbrBody = `/// \$\{1|${commandNamesAbbr.join(',')}|}`

const snippets = {
  'eslint-plugin-command-full': {
    prefix: 'epc',
    body: fullBody,
    description: 'ESLint plugin command',
  },
  'eslint-plugin-command-abbr': {
    prefix: 'epc',
    body: abbrBody,
    description: 'ESLint plugin command (abbr)',
  },
  'eslint-plugin-command-at': {
    prefix: 'epc',
    body: atBody,
    description: 'ESLint plugin command (@)',
  },
}

writeFileSync('./guide/snippets.json', `${JSON.stringify(snippets, null, 2)}\n`)
