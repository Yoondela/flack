import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryChannelRepo } from '@/infrastructure/repositories/inMemoryChannelRepo.js'
import { makeEnsureDMChannel } from '@/application/use-cases/ensureDMChannel.js'

describe('ensureDMChannel', () => {
  let repo: InMemoryChannelRepo
  let dispatcher: any
  let ensureDMChannel: any

  beforeEach(() => {
    repo = new InMemoryChannelRepo()

    dispatcher = {
      emit: vi.fn(),
    }

    ensureDMChannel = makeEnsureDMChannel(repo, dispatcher)
  })

  it('creates a DM channel if none exists', async () => {
    const channel = await ensureDMChannel({
      userA: 'user-1',
      userB: 'user-2',
    })

    expect(channel).toBeDefined()

    const members = await repo.getMembers(channel.id)
    expect(members.map(m => m.userId)).toEqual(
      expect.arrayContaining(['user-1', 'user-2'])
    )

    expect(dispatcher.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CHANNEL_CREATED' })
    )

    expect(dispatcher.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CHANNEL_AVAILABLE' })
    )
  })

  it('reuses existing DM channel', async () => {
    const first = await ensureDMChannel({
      userA: 'user-1',
      userB: 'user-2',
    })

    dispatcher.emit.mockClear()

    const second = await ensureDMChannel({
      userA: 'user-2',
      userB: 'user-1',
    })

    expect(second.id).toBe(first.id)

    // should NOT create again
    expect(dispatcher.emit).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CHANNEL_CREATED' })
    )

    // but should still emit available
    expect(dispatcher.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CHANNEL_AVAILABLE' })
    )
  })

  it('does not create duplicate DM channels', async () => {
    const repo = new InMemoryChannelRepo()
  
    const first = await repo.createDMChannel('A', 'B')
    const second = await repo.createDMChannel('B', 'A')
  
    expect(first.id).toBe(second.id)
  })

})
