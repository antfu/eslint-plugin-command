import antfu from '@antfu/eslint-config'
// eslint-disable-next-line antfu/no-import-dist
import command from './dist/config.mjs'

export default antfu(
  {
    ignores: ['vendor'],
  },
  command(),
  {
    files: ['README.md/**/*'],
    rules: {
      'command/command': 'off',
      'antfu/top-level-function': 'off',
      'style/max-statements-per-line': 'off',
    },
  },
  {
    rules: {
      'antfu/top-level-function': 'off',
    },
  },
)
