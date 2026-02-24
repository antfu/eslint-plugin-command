import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index',
    'src/config',
    'src/types',
    'src/commands.ts',
  ],
  exports: true,
  clean: true,
  dts: true,
})
