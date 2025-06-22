import type { Command } from 'eslint-plugin-command/commands'
import type { CompletionItemProvider, Disposable } from 'vscode'
import { objectKeys } from '@antfu/utils'
import { builtinCommands } from 'eslint-plugin-command/commands'
import { useDisposable } from 'reactive-vscode'
import { CompletionItem, CompletionItemKind, CompletionList, languages, MarkdownString, SnippetString } from 'vscode'
import { config } from './config'

const triggerConditionMap = {
  '@': /\/\//,
  '/': /\/\/\//,
}

const triggerChars = objectKeys(triggerConditionMap)
type TriggerChar = keyof typeof triggerConditionMap

const provider: CompletionItemProvider = {
  provideCompletionItems(document, position, _, { triggerCharacter }) {
    function createCompletion(command: Command): CompletionItem[] {
      const {
        name,
        alias = [],
      } = command

      const genItem = (label: string) => {
        const line = document.lineAt(position.line).text.trim()

        const condition = triggerConditionMap?.[triggerCharacter as TriggerChar]
        if (!line.match(condition))
          throw new Error('Not matched')

        const item = new CompletionItem(label)
        item.filterText = label

        item.kind = CompletionItemKind.Snippet
        item.detail = [name, ...alias]
          .filter(i => i !== label)
          .sort((a, b) =>
            label === name
              ? a.length - b.length // prefer short alias
              : b.length - a.length, // prefer full name
          )
          .join(', ')
        // TODO: use eslint-plugin-command docs
        item.documentation = new MarkdownString('')

        // eslint-disable-next-line prefer-template
        const snippetLabel = ('${1:' + label + '}') // -> vscode snippet template: ${1: the-command-name}
        item.insertText = new SnippetString(snippetLabel)

        if (config.autocomplete.autoFix)
          item.command = { title: 'fix code', command: 'eslint.executeAutofix' }

        return item
      }

      return [name, ...alias].map(genItem)
    }

    try {
      const list = builtinCommands.flatMap(createCompletion)
      return new CompletionList(list, true)
    }
    catch {
      return new CompletionList()
    }
  },
}

let completionDisposable: Disposable | null = null
export function registerAutoComplete() {
  if (completionDisposable) {
    completionDisposable.dispose()
    completionDisposable = null
  }

  completionDisposable = useDisposable(languages.registerCompletionItemProvider(
    config.languageIds,
    provider,
    ...triggerChars,
  ))
}
