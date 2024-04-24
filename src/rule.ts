import { createEslintRule } from './utils'
import type { MessageIds, RuleOptions } from './types'
import { commands } from './commands'

export const RULE_NAME = 'command'

export default createEslintRule<RuleOptions, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce top-level functions to be declared with function keyword',
      recommended: 'stylistic',
    },
    fixable: 'code',
    schema: [],
    messages: {
      'invalid-command': '[{{command}}] error: {{message}}',
      'fix': '[{{command}}] fix: {{message}}',
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
          command.action({
            comment,
            context,
            reportError(message) {
              context.report({
                loc: comment.loc,
                messageId: 'invalid-command',
                data: {
                  command: command.name,
                  message,
                },
              })
            },
            report({ message, ...report }) {
              context.report({
                ...report as any,
                messageId: 'fix',
                data: {
                  command: command.name,
                  message,
                  ...report.data,
                },
              })
            },
          })
        }
      }
    }
    return {}
  },
})
