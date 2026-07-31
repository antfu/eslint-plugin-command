import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/config.ts',
    'src/types.ts',
    'src/commands.ts',
  ],
  exports: true,
})
