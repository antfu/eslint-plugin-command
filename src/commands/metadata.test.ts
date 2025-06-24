import { describe, expect, it } from 'vitest'
import { builtinCommands } from '.'
import { defineCommand } from '../types'

describe('metadata', () => {
  it('test', async () => {
    await expect(Object.fromEntries(
      builtinCommands.map((i) => {
        const { name, alias } = defineCommand(i)
        return [name, {
          alias,
          commentType: i?.commentType || 'line',
        }]
      }),
    )).toMatchFileSnapshot('../../metadata.json')
  })
})
