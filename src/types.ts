import type { TSESLint, TSESTree } from '@typescript-eslint/utils'

export type RuleOptions = []
export type MessageIds = 'invalid-command' | 'fix'

export interface Command {
  match: RegExp
  name: string
  action: (ctx: CommandContext) => void
}

export type CommandReportDescriptor = Partial<TSESLint.ReportDescriptor<MessageIds>> & {
  message: string
}

export interface CommandContext {
  context: TSESLint.RuleContext<MessageIds, RuleOptions>
  comment: TSESTree.Comment
  reportError: (message: string) => void
  report: (report: CommandReportDescriptor) => void
}
