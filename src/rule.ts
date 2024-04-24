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
                    const lastToken = sc.getTokenBefore(comment, { includeComments: true })?.range[1]
                    let lineStart = context.sourceCode.getIndexFromLoc({
                      line: comment.loc.start.line,
                      column: 0,
                    }) - 1
                    if (lastToken != null)
                      lineStart = Math.max(lastToken, lineStart)
                    return fixer.removeRange([
                      lineStart,
                      comment.range[1],
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
                if (!result && nodeBelow.parent) {
                  traverse(context, nodeBelow.parent, (path) => {
                    if (path.node.loc.start.line !== nodeBelow.loc.start.line)
                      return STOP
                    if (keys.includes(path.node.type as any)) {
                      result = path.node
                      return STOP
                    }
                  })
                }
                return result
              },
            })
            continue
          }
        }
      }
      return {}
    },
  })
}

export default createRuleWithCommands(Object.values(commands))
