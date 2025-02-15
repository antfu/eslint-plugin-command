import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/config',
    'src/types',
    'src/commands.ts',
  ],
  declaration: 'node16',
  clean: true,
  externals: [
    '@typescript-eslint/utils',
  ],
})
