import { describe, expect, it } from 'vitest'
import { builtinCommands } from '.'

describe('metadata', () => {
  it('test', async () => {
    await expect(Object.fromEntries(
      builtinCommands.map(i => [i.name, {
        alias: i?.alias || [],
        commentType: i?.commentType || 'line',
      }]),
    )).toMatchFileSnapshot('../../metadata.json')
  })
})
