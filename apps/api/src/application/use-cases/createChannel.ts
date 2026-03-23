import { z } from 'zod'
import { randomUUID } from 'crypto'
import { ChannelSchema } from '@/shared/schemas/channel.schema.js'
import { ChannelMemberSchema } from '@/shared/schemas/channelMember.schema.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { EventDispatcher } from '@/application/events/eventDispatcher.js'

const CreateChannelInput = z.object({
  type: z.enum(['public', 'dm']),
  creatorId: z.string(),
})

export function makeCreateChannel(repo: ChannelRepository, dispatcher: EventDispatcher) {
  return async function createChannel(input: z.infer<typeof CreateChannelInput>) {
    const parsed = CreateChannelInput.parse(input)

    const channel = ChannelSchema.parse({
      id: randomUUID(),
      type: parsed.type,
      createdAt: new Date(),
    })

    await repo.createChannel(channel)

    await repo.addMember(
      ChannelMemberSchema.parse({
        channelId: channel.id,
        userId: parsed.creatorId,
        role: 'admin',
        joinedAt: new Date(),
      })
    )

    dispatcher.emit({
      type: 'CHANNEL_CREATED',
      payload: {
        id: channel.id,
        type: channel.type,
        members: [parsed.creatorId],
        createdAt: channel.createdAt.toISOString(),
      },
    })

    return channel
  }
}
