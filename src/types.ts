import type { TSESLint as Linter, TSESTree as Tree } from '@typescript-eslint/utils'
import type { CommandContext } from './context'

export type { Tree, Linter, CommandContext }

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
