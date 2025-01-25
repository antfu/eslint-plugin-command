import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/config',
    'src/types',
    'src/commands.ts',
  ],
  declaration: true,
  clean: true,
  externals: [
    '@typescript-eslint/utils',
  ],
})
