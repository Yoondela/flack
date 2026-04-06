import { randomUUID } from 'crypto'
import { ChannelSchema } from '@/shared/schemas/channel.schema.js'
import { ChannelMemberSchema } from '@/shared/schemas/channelMember.schema.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { EventDispatcher } from '@/application/events/eventDispatcher.js'

export function makeEnsureDMChannel(

  
  repo: ChannelRepository,
  dispatcher: EventDispatcher
) {
  return async function ensureDMChannel({
    userA,
    userB,
  }: {
    userA: string
    userB: string
  }) {
    // 1. find existing
    console.log("Making DM channel between ", userA, " and ", userB)

    let channel = await repo.findDMChannel(userA, userB)

    console.log("Existing channel found: ", channel)

    // 2. create if not found
    if (!channel) {
console.log("No existing channel found, creating new one...")

      channel = await repo.createDMChannel(userA, userB)

      console.log("Created new DM channel: ", channel)


      dispatcher.emit({
        type: 'CHANNEL_CREATED',
        payload: {
          id: channel.id,
          type: channel.type,
          members: [userA, userB],
          createdAt: channel.createdAt.toISOString(),
        },
      })
    }

    console.log("Ensured DM channel: ", channel)

    if (!channel) {
      throw new Error('Failed to ensure DM channel')
    }

    // 3. always emit available
    const members = await repo.getMembers(channel.id)

    dispatcher.emit({
      type: 'CHANNEL_AVAILABLE',
      payload: {
        id: channel.id,
        type: channel.type,
        members: members.map(m => m.userId),
        createdAt: channel.createdAt.toISOString(),
      },
    })

    return channel
  }
}
