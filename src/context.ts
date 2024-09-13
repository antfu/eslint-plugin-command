import type { TraverseVisitor } from './traverse'
import type { Command, CommandReportDescriptor, CommandReportErrorCauseDescriptor, FindNodeOptions, Linter, MessageIds, RuleOptions, Tree } from './types'
import { SKIP, STOP, traverse } from './traverse'

export class CommandContext {
  /**
   * The ESLint RuleContext
   */
  readonly context: Linter.RuleContext<MessageIds, RuleOptions>
  /**
   * The comment node that triggered the command
   */
  readonly comment: Tree.Comment
  /**
   * Command that triggered the context
   */
  readonly command: Command
  /**
   * Alias for `this.context.sourceCode`
   */
  readonly source: Linter.SourceCode
  /**
   * Regexp matches
   */
  readonly matches: RegExpMatchArray

  constructor(
    context: Linter.RuleContext<MessageIds, RuleOptions>,
    comment: Tree.Comment,
    command: Command,
    matches: RegExpMatchArray,
  ) {
    this.context = context
    this.comment = comment
    this.command = command
    this.source = context.sourceCode
    this.matches = matches
  }

  /**
   * A shorthand of `this.context.sourceCode.getText(node)`
   *
   * When `node` is `null` or `undefined`, it returns an empty string
   */
  getTextOf(node?: Tree.Node | Tree.Token | Tree.Range | null) {
    if (!node)
      return ''
    if (Array.isArray(node))
      return this.context.sourceCode.text.slice(node[0], node[1])
    return this.context.sourceCode.getText(node)
  }

  /**
   * Report an ESLint error on the triggering comment, without fix
   */
  reportError(
    message: string,
    ...causes: CommandReportErrorCauseDescriptor[]
  ) {
    this.context.report({
      loc: this.comment.loc,
      messageId: 'command-error',
      data: {
        command: this.command.name,
        message,
      },
    })
    for (const cause of causes) {
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

  /**
   * Report an ESLint error.
   * Different from normal `context.report` as that it requires `message` instead of `messageId`.
   */
  report(descriptor: CommandReportDescriptor): void {
    const { message, ...report } = descriptor
    const { comment, source } = this

    if (report.nodes) {
      report.loc ||= {
        start: report.nodes[0].loc.start,
        end: report.nodes[report.nodes.length - 1].loc.end,
      }
    }

    this.context.report({
      ...report as any,
      messageId: 'command-fix',
      data: {
        command: this.command.name,
        message,
        ...report.data,
      },
      *fix(fixer) {
        if (report.fix) {
          const result = report.fix(fixer)
          // if is generator
          if (result && 'next' in result) {
            for (const fix of result)
              yield fix
          }
          else if (result) {
            yield result
          }
        }

        if (report.removeComment !== false) {
          const lastToken = source.getTokenBefore(
            comment,
            { includeComments: true },
          )?.range[1]
          let rangeStart = source.getIndexFromLoc({
            line: comment.loc.start.line,
            column: 0,
          }) - 1
          if (lastToken != null)
            rangeStart = Math.max(0, lastToken, rangeStart)
          let rangeEnd = comment.range[1]
          // The first line
          if (comment.loc.start.line === 1) {
            if (source.text[rangeEnd] === '\n')
              rangeEnd += 1
          }
          yield fixer.removeRange([rangeStart, rangeEnd])
        }
      },
    })
  }

  /**
   * Utility to traverse the AST starting from a node
   */
  traverse(node: Tree.Node, cb: TraverseVisitor): boolean {
    return traverse(this.context, node, cb)
  }

  /**
   * Find specific node within the line below the comment
   *
   * Override 1: Find the fist node of a specific type with rest parameters
   */
  findNodeBelow<T extends Tree.Node['type']>(...keys: (T | `${T}`)[]): Extract<Tree.Node, { type: T }> | undefined
  /**
   * Find specific node within the line below the comment
   *
   * Override 2: Find the first matched node with a custom filter function
   */
  findNodeBelow(filter: ((node: Tree.Node) => boolean)): Tree.Node | undefined
  /**
   * Find specific node within the line below the comment
   *
   * Override 3: Find all match with full options (returns an array)
   */
  findNodeBelow<T extends Tree.Node['type']>(options: FindNodeOptions<T, true>): Extract<Tree.Node, { type: T }>[] | undefined
  /**
   * Find specific node within the line below the comment
   *
   * Override 4: Find one match with full options
   */
  findNodeBelow<T extends Tree.Node['type']>(options: FindNodeOptions<T>): Extract<Tree.Node, { type: T }> | undefined
  // Implementation
  findNodeBelow(...args: any): any {
    let options: FindNodeOptions<Tree.Node['type']>

    if (typeof args[0] === 'string')
      options = { types: args as Tree.Node['type'][] }
    else if (typeof args[0] === 'function')
      options = { filter: args[0] }
    else
      options = args[0]

    const {
      shallow = false,
      findAll = false,
    } = options

    const tokenBelow = this.context.sourceCode.getTokenAfter(this.comment)
    if (!tokenBelow)
      return
    const nodeBelow = this.context.sourceCode.getNodeByRangeIndex(tokenBelow.range[1])
    if (!nodeBelow)
      return

    const result: any[] = []
    let target = nodeBelow
    while (target.parent && target.parent.loc.start.line === nodeBelow.loc.start.line)
      target = target.parent

    const filter = options.filter
      ? options.filter
      : (node: Tree.Node) => options.types!.includes(node.type)

    this.traverse(target, (path) => {
      if (path.node.loc.start.line !== nodeBelow.loc.start.line)
        return STOP
      if (filter(path.node)) {
        result.push(path.node)
        if (!findAll)
          return STOP
        if (shallow)
          return SKIP
      }
    })

    return findAll
      ? result
      : result[0]
  }

  /**
   * Get the parent block of the triggering comment
   */
  getParentBlock(): Tree.BlockStatement | Tree.Program {
    const node = this.source.getNodeByRangeIndex(this.comment.range[0])
    if (node?.type === 'BlockStatement') {
      if (this.source.getCommentsInside(node).includes(this.comment))
        return node
    }
    if (node)
      console.warn(`Expected BlockStatement, got ${node.type}. This is probably an internal bug.`)
    return this.source.ast
  }

  /**
   * Get indent string of a specific line
   */
  getIndentOfLine(line: number): string {
    const lineStr = this.source.getLines()[line - 1] || ''
    const match = lineStr.match(/^\s*/)
    return match ? match[0] : ''
  }
}
