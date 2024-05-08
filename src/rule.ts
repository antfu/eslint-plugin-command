import { createEslintRule } from './utils'
import type { Command, MessageIds, RuleOptions } from './types'
import { builtinCommands } from './commands'
import { CommandContext } from './context'

export function createRuleWithCommands(commands: Command[]) {
  return createEslintRule<RuleOptions, MessageIds>({
    name: 'command',
    meta: {
      type: 'problem',
      docs: {
        description: 'Comment-as-command for one-off codemod with ESLint',
      },
      fixable: 'code',
      schema: [],
      messages: {
        'command-error': '[{{command}}] error: {{message}}',
        'command-error-cause': '[{{command}}] error cause: {{message}}',
        'command-fix': '[{{command}}] fix: {{message}}',
      },
    },
    defaultOptions: [],
    create: (context) => {
      const sc = context.sourceCode
      const comments = sc.getAllComments()

      for (const comment of comments) {
        const commandRaw = comment.value
        for (const command of commands) {
          const type = command.commentType ?? 'line'
          if (type === 'line' && comment.type !== 'Line')
            continue
          if (type === 'block' && comment.type !== 'Block')
            continue

          let matches = typeof command.match === 'function'
            ? command.match(comment)
            : commandRaw.match(command.match)

          if (!matches)
            continue

          // create a dummy match for user provided function that returns `true`
          if (matches === true)
            matches = '__dummy__'.match('__dummy__')!

          const result = command.action(new CommandContext(context, comment, command, matches))
          if (result !== false)
            break
        }
      }
      return {}
    },
  })
}

export default /* @__PURE__ */ createRuleWithCommands(builtinCommands)
