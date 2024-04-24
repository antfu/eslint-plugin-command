import { createEslintRule } from './utils'
import type { Command, MessageIds, RuleOptions } from './types'
import { commands } from './commands'
import { STOP, traverse } from './traverse'

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
              removeComment() {
                context.report({
                  loc: comment.loc,
                  messageId: 'fix',
                  data: {
                    command: command.name,
                    message: 'Remove comment after use',
                  },
                  fix(fixer) {
                    return fixer.removeRange([
                      comment.range[0],
                      sc.getTokenAfter(comment)?.range[0] ?? comment.range[1],
                    ])
                  },
                })
              },
              getNodeBelow(...keys) {
                const tokenBelow = sc.getTokenAfter(comment)
                if (!tokenBelow)
                  return
                const nodeBelow = sc.getNodeByRangeIndex(tokenBelow.range[1])
                if (!nodeBelow)
                  return

                let result: any
                traverse(context, nodeBelow, (path) => {
                  if (path.node.loc.start.line !== nodeBelow.loc.start.line)
                    return STOP
                  if (keys.includes(path.node.type as any)) {
                    result = path.node
                    return STOP
                  }
                })
                return result
              },
            })
          }
        }
      }
      return {}
    },
  })
}

export default createRuleWithCommands(commands)
