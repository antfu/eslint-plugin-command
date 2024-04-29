import type { Command, CommandReportDescriptor, CommandReportErrorCauseDescriptor, Linter, MessageIds, RuleOptions, Tree } from './types'
import type { TraverseVisitor } from './traverse'
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

  /**
   * Utility to traverse the AST starting from a node
   */
  traverse(node: Tree.Node, cb: TraverseVisitor): boolean {
    return traverse(this.context, node, cb)
  }

  /**
   * Report an ESLint error that removes the triggering comment
   */
  removeComment(): void {
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

  private _findNodeBelowImpl(filter: (node: Tree.Node) => boolean, shallow: boolean, first: boolean): Tree.Node[] | undefined
  private _findNodeBelowImpl<T extends Tree.Node['type']>(...types: [(T | `${T}`)[], boolean, boolean]): Extract<Tree.Node, { type: T }>[] | undefined
  private _findNodeBelowImpl(...keys: any[]): any {
    const first = keys.pop() as boolean
    const shallow = typeof keys.at(-1) === 'boolean' ? keys.pop() as boolean : false
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

    const filter = typeof keys[0] === 'function'
      ? keys[0]
      : (node: Tree.Node) => keys.includes(node.type)

    this.traverse(target, (path) => {
      if (path.node.loc.start.line !== nodeBelow.loc.start.line)
        return STOP
      if (filter(path.node)) {
        result.push(path.node)
        if (first)
          return STOP
        if (shallow)
          return SKIP
      }
    })
    return result
  }

  /**
   * Find specific node types (first match) in the line below the comment
   * @param shallow If true, will not traverse deeper than the first level, default false
   */
  findNodeBelow(filter: (node: Tree.Node) => boolean, shallow?: boolean): Tree.Node | undefined
  findNodeBelow<T extends Tree.Node['type']>(...types: (T | `${T}`)[] | [(T | `${T}`), boolean | undefined][]): Extract<Tree.Node, { type: T }> | undefined
  findNodeBelow(...keys: any[]): any {
    // @ts-expect-error - TS doesn't support pass generic to rest parameter
    return this._findNodeBelowImpl(...keys, true)?.[0]
  }

  /**
   * Find specific nodes in the line below the comment
   * @param shallow If true, will not traverse deeper than the first level, default false
   */
  findNodesBelow(filter: (node: Tree.Node) => boolean, shallow?: boolean): Tree.Node[] | undefined
  findNodesBelow<T extends Tree.Node['type']>(...types: (T | `${T}`)[] | ([...(T | `${T}`)[], boolean])): Extract<Tree.Node, { type: T }>[] | undefined
  findNodesBelow(...keys: any[]): any {
    // @ts-expect-error - TS doesn't support pass generic to rest parameter
    return this._findNodeBelowImpl(...keys, false)
  }
}
