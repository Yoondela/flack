import { z } from 'zod'
import { randomUUID } from 'crypto'
import { ChannelSchema } from '@/shared/schemas/channel.schema.js'
import { ChannelMemberSchema } from '@/shared/schemas/channelMember.schema.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import { EventDispatcher } from '../events/eventDispatcher.js'
import { makeEnsureDMChannel } from './ensureDMChannel.js'

const StartDMInput = z.object({
  userA: z.string(),
  userB: z.string(),
})

export function makeStartDM(repo: ChannelRepository, dispatcher: EventDispatcher) {
  return async function startDM(input: z.infer<typeof StartDMInput>) {
    const parsed = StartDMInput.parse(input)

    const existing = await repo.findDMChannel(parsed.userA, parsed.userB)
    if (existing) return existing

    const channel = ChannelSchema.parse({
      id: randomUUID(),
      type: 'dm',
      createdAt: new Date(),
    })

    await repo.createChannel(channel)

    await repo.addMember(
      ChannelMemberSchema.parse({
        channelId: channel.id,
        userId: parsed.userA,
        role: 'member',
        joinedAt: new Date(),
      })
    )

    await repo.addMember(
      ChannelMemberSchema.parse({
        channelId: channel.id,
        userId: parsed.userB,
        role: 'member',
        joinedAt: new Date(),
      })
    )

    dispatcher.emit({
      type: 'CHANNEL_CREATED',
      payload: {
        id: channel.id,
        type: 'dm',
        members: [parsed.userA, parsed.userB],
        createdAt: channel.createdAt.toISOString(),
      },
    })


    return channel
  }
}
