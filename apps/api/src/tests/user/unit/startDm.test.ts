import { describe, it, expect } from 'vitest'
import { InMemoryChannelRepo } from '@/infrastructure/repositories/inMemoryChannelRepo.js'
import { makeStartDM } from '@/application/use-cases/startDm.js'

describe('Start DM', () => {
  const repo = new InMemoryChannelRepo()
  const startDM = makeStartDM(repo)

  it('should create a DM channel between two users', async () => {
    const channel = await startDM({
      userA: 'user-1',
      userB: 'user-2',
    })

    expect(channel.type).toBe('dm')
  })

  it('should not create duplicate DM channels', async () => {
    const first = await startDM({
      userA: 'user-1',
      userB: 'user-2',
    })

    const second = await startDM({
      userA: 'user-1',
      userB: 'user-2',
    })

    expect(first.id).toBe(second.id)
  })
})
