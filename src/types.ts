import type { TSESLint as Linter, TSESTree as Tree } from '@typescript-eslint/utils'
import type { CommandContext } from './context'

export type { Tree, Linter, CommandContext }

export type NodeType = `${Tree.Node['type']}`

export type RuleOptions = []
export type MessageIds = 'command-error' | 'command-error-cause' | 'command-fix' | 'command-removal'

export interface Command {
  /**
   * The name of the command
   * Used to identify the command in reported errors
   */
  name: string
  /**
   * RegExp to match the comment, without the leading `//` or `/*`
   */
  match: RegExp | ((comment: Tree.Comment) => RegExpMatchArray | boolean | undefined | null)
  /**
   * The type of the comment
   *
   * - `line` - `//`
   * - `block` - `/*`
   *
   * @default 'line'
   */
  commentType?: 'line' | 'block' | 'both'
  /**
   * Main action of the command
   *
   * @param ctx The context of the command (per-file, per matched comment)
   */
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

export function defineCommand(command: Command) {
  return command
}

export interface FindNodeOptions<Keys extends Tree.Node['type'], All extends boolean | undefined = false> {
  /**
   * The type of the node to search for
   */
  types?: (Keys | `${Keys}`)[]
  /**
   * Whether to search only the direct children of the node
   */
  shallow?: boolean
  /**
   * Return the first node found, or an array of all matches
   */
  findAll?: All
  /**
   * Custom filter function to further filter the nodes
   *
   * `types` is ignored when `filter` is provided
   */
  filter?: (node: Tree.Node) => boolean
}
