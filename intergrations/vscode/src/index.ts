import { defineExtension, useCommands } from 'reactive-vscode'
import { registerProvider } from './autocomplete'
import { config, watchConfig } from './config'
import { commands, extensionId } from './generated/meta'
import { logger } from './utils'

const { activate, deactivate } = defineExtension(() => {
  logger.info(`${extensionId} activated`)

  watchConfig('eslintCommand.languageIds', () => {
    registerProvider()
  }, { immediate: true })

  useCommands({
    [commands.toggleAutoFix]() {
      config.$set('autocomplete', {
        autoFix: !config.autocomplete.autoFix,
      })
    },
  })
})

export { activate, deactivate }
