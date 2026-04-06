import type { EventDispatcher } from '@/application/events/eventDispatcher.js'
import type { SocketGateway } from './socketGateway.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'

export function registerEventHandlers(
  dispatcher: EventDispatcher,
  gateway: SocketGateway,
  channelRepo: ChannelRepository
) {
  dispatcher.on('MESSAGE_CREATED', async (event) => {
    const { channelId, senderId } = event.payload

    const members = await channelRepo.getMembers(channelId)

    for (const member of members) {
      const isSender = member.userId === senderId
      gateway.sendToUser(member.userId, {
        type: isSender ? 'MESSAGE_SENT' : 'MESSAGE_RECEIVED',
        payload: event.payload,
      })
    }
  })

  dispatcher.on('CHANNEL_CREATED', (event) => {
    for (const userId of event.payload.members) {
      console.log("Emitting channel created event to user: ", userId)
      gateway.sendToUser(userId, event)
    }
  })

  dispatcher.on('CHANNEL_AVAILABLE', (event) => {
    for (const userId of event.payload.members) {
      gateway.sendToUser(userId, {
        type: 'CHANNEL_AVAILABLE',
        payload: event.payload,
      })
    }
  })

}
