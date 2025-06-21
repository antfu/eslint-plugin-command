import type { ConfigKey, ConfigKeyTypeMap, NestedScopedConfigs } from './generated/meta'
import { defineConfigObject, useEvent } from 'reactive-vscode'
import { workspace } from 'vscode'
import { scopedConfigs } from './generated/meta'

export const config = defineConfigObject<NestedScopedConfigs>(
  scopedConfigs.scope,
  scopedConfigs.defaults,
)

export const onDidChangeConfig = useEvent(workspace.onDidChangeConfiguration)

export function watchConfig<T extends ConfigKey, K extends ConfigKeyTypeMap[T]>(
  configKey: T,
  listener: (val: K | undefined) => unknown,
  options?: { immediate?: boolean },
) {
  const getConfig = () => workspace.getConfiguration().get<K>(configKey)

  const {
    immediate = false,
  } = options || {}

  if (immediate)
    listener(getConfig())

  onDidChangeConfig(({ affectsConfiguration }) => {
    if (!affectsConfiguration(configKey))
      return

    const val = getConfig()
    listener(val)
  })
}
