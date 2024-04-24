import antfu from '@antfu/eslint-config'
// eslint-disable-next-line antfu/no-import-dist
import command from './dist/index.mjs'

export default antfu(
  {
    ignores: ['vendor'],
  },
  {
    plugins: {
      command,
    },
    rules: {
      'command/command': 'error',
    },
  },
)
