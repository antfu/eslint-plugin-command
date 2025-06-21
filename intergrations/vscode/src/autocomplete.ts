import type { Command } from 'eslint-plugin-command/commands'
import type { CompletionItemProvider, Disposable } from 'vscode'
import { builtinCommands } from 'eslint-plugin-command/commands'
import { useDisposable } from 'reactive-vscode'
import { CompletionItem, CompletionItemKind, CompletionList, languages, MarkdownString, SnippetString } from 'vscode'
import { config } from './config'

const provider: CompletionItemProvider = {
  provideCompletionItems(document, position) {
    function createCompletion(command: Command): CompletionItem {
      const { name } = command
      // eslint-disable-next-line prefer-template
      const nameAsSnippet = ('${1:' + name + '}') // -> vscode snippet template: ${1: the-command-name}

      const completionItem = new CompletionItem(name)

      completionItem.kind = CompletionItemKind.Text
      // TODO
      completionItem.detail = ''
      // TODO: use eslint-plugin-command docs
      completionItem.documentation = new MarkdownString('')

      const line = document.getText(document.lineAt(position).range).trim()

      // TODO: support start with @ --> /^\s*[/:@](.*)/
      const anyESLintCommandRE = /^\s*\/(.*)/

      if (!line.match(anyESLintCommandRE))
        throw new Error('Not matched')

      const slashCount = getSlashCount(line)

      completionItem.insertText = new SnippetString(
        // is in comment
        slashCount > 2
          ? nameAsSnippet
          : `${'/'.repeat(2 - slashCount)}/${nameAsSnippet}`, // `/ to-function` -> `/// to-function`
      )

      if (config.autocomplete.autoFix)
        completionItem.command = { title: 'fix code', command: 'eslint.executeAutofix' }

      return completionItem
    }

    try {
      const list = builtinCommands.map(createCompletion)
      return new CompletionList(list, true)
    }
    catch {
      return new CompletionList()
    }
  },
}

let completionDisposable: Disposable | null = null
export function registerProvider() {
  if (completionDisposable) {
    completionDisposable.dispose()
    completionDisposable = null
  }

  completionDisposable = useDisposable(languages.registerCompletionItemProvider(
    config.languageIds,
    provider,
    '/',
  ))
}

function getSlashCount(text: string): number {
  const slashes = text.match(/(\/+)/)
  const count = slashes ? slashes[1].length : 0
  return count
}
