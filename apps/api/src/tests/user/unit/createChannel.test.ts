import { describe, it, expect } from 'vitest'
import { InMemoryChannelRepo } from '@/infrastructure/repositories/inMemoryChannelRepo.js'
import { makeCreateChannel } from '@/application/use-cases/createChannel.js'

describe('Create Channel', () => {
  const repo = new InMemoryChannelRepo()
  const createChannel = makeCreateChannel(repo)

  it('should create a public channel', async () => {
    const channel = await createChannel({
      type: 'public',
      creatorId: 'user-1',
    })

    expect(channel.id).toBeDefined()
    expect(channel.type).toBe('public')
  })

  it('should add creator as admin', async () => {
    const channel = await createChannel({
      type: 'public',
      creatorId: 'user-1',
    })

    const members = await repo.getMembers(channel.id)

    expect(members.length).toBe(1)
    expect(members[0]?.role).toBe('admin')
  })
})
