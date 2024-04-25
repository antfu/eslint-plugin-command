import { createEslintRule } from './utils'
import type { Command, MessageIds, RuleOptions } from './types'
import { commands } from './commands'
import { CommandContext } from './context'

export function createRuleWithCommands(commands: Command[]) {
  return createEslintRule<RuleOptions, MessageIds>({
    name: 'command',
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce top-level functions to be declared with function keyword',
        recommended: 'stylistic',
      },
      fixable: 'code',
      schema: [],
      messages: {
        'command-error': '[{{command}}] error: {{message}}',
        'command-error-cause': '[{{command}}] error cause: {{message}}',
        'command-fix': '[{{command}}] fix: {{message}}',
        'command-removal': '[{{command}}] remove comment after use',
      },
    },
    defaultOptions: [],
    create: (context) => {
      const sc = context.sourceCode
      const comments = sc.getAllComments()

      for (const comment of comments) {
        if (comment.type !== 'Line')
          continue

        const commandRaw = comment.value.trim()
        for (const command of commands) {
          if (command.match.test(commandRaw)) {
            command.action(new CommandContext(context, comment, command))
            continue
          }
        }
      }
      return {}
    },
  })
}

export default createRuleWithCommands(Object.values(commands))
