import type { TSESLint as Linter, TSESTree as Tree } from '@typescript-eslint/utils'
import type { TraverseVisitor } from './traverse'

export type { Tree, Linter }

export type NodeType = `${Tree.Node['type']}`

export type RuleOptions = []
export type MessageIds = 'command-error' | 'command-error-cause' | 'command-fix' | 'command-removal'

export interface Command {
  match: RegExp
  name: string
  action: (ctx: CommandContext) => void
}

export interface ESLintPluginCommandOptions {
  /**
   * Name of the plugin
   * @default 'command'
   */
  name?: string
  /**
   * Custom commands to use
   * If not provided, all the built-in commands will be used
   */
  commands?: Command[]
}

export type CommandReportDescriptor = Partial<Linter.ReportDescriptor<MessageIds>> & {
  message: string
}

export type CommandReportErrorCauseDescriptor = {
  /**
   * An override of the location of the report
   */
  loc: Readonly<Tree.Position> | Readonly<Tree.SourceLocation>
  /**
   * Reason of the cause
   */
  message: string
} | {
  /**
   * The Node or AST Token which the report is being attached to
   */
  node: Tree.Node | Tree.Token
  /**
   * An override of the location of the report
   */
  loc?: Readonly<Tree.Position> | Readonly<Tree.SourceLocation>
  /**
   * Reason of the cause
   */
  message: string
}

export interface CommandContext {
  /**
   * The ESLint RuleContext
   */
  readonly context: Linter.RuleContext<MessageIds, RuleOptions>
  /**
   * The comment node that triggered the command
   */
  readonly comment: Tree.Comment
  /**
   * Alias to `context.sourceCode`
   */
  readonly source: Linter.SourceCode
  /**
   * Report an ESLint error that removes the triggering comment
   */
  removeComment: () => void
  /**
   * Report an ESLint error on the triggering comment, without fix
   */
  reportError: (message: string, cause?: CommandReportErrorCauseDescriptor) => void
  /**
   * Report an ESLint error. Different from normal `context.report` as that it requires `message` instead of `messageId`.
   */
  report: (report: CommandReportDescriptor) => void
  /**
   * Utility to traverse the AST starting from a node
   */
  traverse: (node: Tree.Node, cb: TraverseVisitor) => boolean
  /**
   * Find specific node types (first match) in the line below the comment
   */
  findNodeBelow: (
    (filter: (node: Tree.Node) => boolean) => Tree.Node | undefined)
    & (<T extends Tree.Node['type']>(...types: (T | `${T}`)[]) => Extract<Tree.Node, { type: T }>
  )
}
