import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from './utils'
import type { Command, CommandContext, CommandReportDescriptor, CommandReportErrorCauseDescriptor, MessageIds, RuleOptions } from './types'
import { commands } from './commands'
import type { TraverseVisitor } from './traverse'
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
            command.action(new CommandContextImpl(context, comment, command))
            continue
          }
        }
      }
      return {}
    },
  })
}

class CommandContextImpl implements CommandContext {
  constructor(
    public context: TSESLint.RuleContext<MessageIds, RuleOptions>,
    public comment: TSESTree.Comment,
    public command: Command,
  ) {}

  get source() {
    return this.context.sourceCode
  }

  reportError(
    message: string,
    cause?: CommandReportErrorCauseDescriptor,
  ) {
    this.context.report({
      loc: this.comment.loc,
      messageId: 'command-error',
      data: {
        command: this.command.name,
        message,
      },
    })
    if (cause) {
      const { message, ...pos } = cause
      this.context.report({
        ...pos,
        messageId: 'command-error-cause',
        data: {
          command: this.command.name,
          message,
        },
      },
      )
    }
  }

  report({ message, ...report }: CommandReportDescriptor) {
    this.context.report({
      ...report as any,
      messageId: 'command-fix',
      data: {
        command: this.command.name,
        message,
        ...report.data,
      },
    })
  }

  traverse(node: TSESTree.Node, cb: TraverseVisitor) {
    return traverse(this.context, node, cb)
  }

  removeComment() {
    this.context.report({
      loc: this.comment.loc,
      messageId: 'command-removal',
      data: {
        command: this.command.name,
      },
      fix: (fixer) => {
        const lastToken = this.context.sourceCode.getTokenBefore(
          this.comment,
          { includeComments: true },
        )?.range[1]
        let lineStart = this.context.sourceCode.getIndexFromLoc({
          line: this.comment.loc.start.line,
          column: 0,
        }) - 1
        if (lastToken != null)
          lineStart = Math.max(lastToken, lineStart)
        return fixer.removeRange([
          lineStart,
          this.comment.range[1],
        ])
      },
    })
  }

  findNodeBelow(...keys: any[]) {
    const tokenBelow = this.context.sourceCode.getTokenAfter(this.comment)
    if (!tokenBelow)
      return
    const nodeBelow = this.context.sourceCode.getNodeByRangeIndex(tokenBelow.range[1])
    if (!nodeBelow)
      return

    let result: any
    let target = nodeBelow
    while (target.parent && target.parent.loc.start.line === nodeBelow.loc.start.line)
      target = target.parent

    const filter = typeof keys[0] === 'function'
      ? keys[0]
      : (node: TSESTree.Node) => keys.includes(node.type)

    this.traverse(target, (path) => {
      if (path.node.loc.start.line !== nodeBelow.loc.start.line)
        return STOP
      if (filter(path.node)) {
        result = path.node
        return STOP
      }
    })
    return result
  }
}

export default createRuleWithCommands(Object.values(commands))
