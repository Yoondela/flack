import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryChannelRepo } from '@/infrastructure/repositories/inMemoryChannelRepo.js'
import { makeCreateChannel } from '@/application/use-cases/createChannel.js'

import { EventDispatcher } from '@/application/events/eventDispatcher.js'

describe('Create Channel', () => {
  let repo: InMemoryChannelRepo
  let dispatcher: EventDispatcher


  beforeEach(() => {
    repo = new InMemoryChannelRepo()
    dispatcher = new EventDispatcher()
  })

  it('should create a public channel', async () => {
    const createChannel = makeCreateChannel(
      repo,
      dispatcher,
    )

    const channel = await createChannel({
      type: 'public',
      name: 'Project Alpha',
      creatorId: 'user-1',
      memberIds: ['user-2'],
    })

    expect(channel.id).toBeDefined()
    expect(channel.type).toBe('public')
    expect(channel.name).toBe('Project Alpha')
  })

  it('should add creator as admin', async () => {
    const createChannel = makeCreateChannel(
      repo,
      dispatcher,
    )

    const channel = await createChannel({
      type: 'public',
      name: 'Project Alpha',
      creatorId: 'user-1',
      memberIds: ['user-2'],
    })

    const members = await repo.getMembers(channel.id)

    const creator = members.find(
      m => m.userId === 'user-1',
    )

    expect(creator?.role).toBe('admin')
  })

  it('should add selected members as members', async () => {
    const createChannel = makeCreateChannel(
      repo,
      dispatcher,
    )

    const channel = await createChannel({
      type: 'public',
      name: 'Project Alpha',
      creatorId: 'user-1',
      memberIds: ['user-2', 'user-3'],
    })

    const members = await repo.getMembers(channel.id)

    expect(members).toHaveLength(3)
  })

  it('should not add duplicate members', async () => {
    const createChannel = makeCreateChannel(
      repo,
      dispatcher,
    )

    const channel = await createChannel({
      type: 'public',
      name: 'Project Alpha',
      creatorId: 'user-1',
      memberIds: [
        'user-1',
        'user-2',
        'user-2',
      ],
    })

    const members = await repo.getMembers(channel.id)

    expect(members).toHaveLength(2)
  })
})