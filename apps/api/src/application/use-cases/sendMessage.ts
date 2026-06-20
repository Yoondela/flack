import { z } from 'zod'
import { randomUUID } from 'crypto'
import { MessageSchema } from '@/shared/schemas/message.schema.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { MessageRepository } from '@/domain/message/message.repository.js'
import type { EventDispatcher } from '@/application/events/eventDispatcher.js'

const SendMessageInput = z.object({
  channelId: z.string(),
  senderId: z.string(),
  content: z.string().min(1),
})

export function makeSendMessage(
  channelRepo: ChannelRepository,
  messageRepo: MessageRepository,
  dispatcher: EventDispatcher
) {
  return async function sendMessage(input: z.infer<typeof SendMessageInput>) {
    console.log("saving message..")
    const parsed = SendMessageInput.parse(input)

    console.log("Parsed input:", parsed)

    const members = await channelRepo.getMembers(parsed.channelId)

    console.log("Channel members:", members)

    const isMember = members.some(m => m.userId === parsed.senderId)
    if (!isMember) {
      throw new Error('User is not a member of this channel')
    }

    console.log("User is a member of the channel, proceeding to save message...")

    const message = MessageSchema.parse({
      id: randomUUID(),
      channelId: parsed.channelId,
      sender: parsed.senderId,
      content: parsed.content,
      createdAt: new Date(),
    })

    console.log("messsage", message)

    const saved = await messageRepo.create(message)

    dispatcher.emit({
      type: 'MESSAGE_CREATED',
      payload: {
        id: saved.id,
        channelId: saved.channelId,
        sender: saved.sender,
        content: saved.content,
        createdAt: saved.createdAt.toISOString(),
      },
    })

    return saved
  }
}
