import { z } from 'zod'
import { randomUUID } from 'crypto'
import { ChannelSchema } from '@/shared/schemas/channel.schema.js'
import { ChannelMemberSchema } from '@/shared/schemas/channelMember.schema.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { EventDispatcher } from '@/application/events/eventDispatcher.js'
import type { UserRepository } from '@/domain/user/user.repository.js'

const CreateChannelInput = z.object({
  type: z.enum(['public', 'dm']),
  name: z.string().min(1).max(100).optional(),
  creatorId: z.string(),
  memberIds: z.array(z.string()).min(1),
  avatar: z.string().optional(),
  
})

export function makeCreateChannel(
  repo: ChannelRepository,
  dispatcher: EventDispatcher,
)
 {
  return async function createChannel(input: z.infer<typeof CreateChannelInput>) {
    console.log("Creating channel with input: ", input)
    const parsed = CreateChannelInput.parse(input)

    const channel = ChannelSchema.parse({
      id: randomUUID(),
      type: parsed.type,
      name: parsed.name,
      avatar: parsed.avatar,
      createdBy: parsed.creatorId,
      createdAt: new Date(),
    })

    await repo.createChannel(channel)

    
    const uniqueMembers = [
      parsed.creatorId,
      ...parsed.memberIds,
    ]

    const dedupedMembers = [...new Set(uniqueMembers)]

    for (const userId of dedupedMembers) {
      await repo.addMember(
        ChannelMemberSchema.parse({
          channelId: channel.id,
          userId,
          role: userId === parsed.creatorId ? 'admin' : 'member',
          joinedAt: new Date(),
        }),
      )
    }

    const members = await repo.getMembers(channel.id)
    console.log("Channel created with members: ", members)
    const notMe = members.filter(m => m.userId !== parsed.creatorId)
    console.log("Other members (excluding creator): ", notMe)
    dispatcher.emit({
      type: 'CHANNEL_CREATED',
      payload: {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        members,
        createdAt: channel.createdAt.toISOString(),
      },
    })

    return channel
  }
}
