import type { EventDispatcher } from '@/application/events/eventDispatcher.js'
import type { SocketGateway } from './socketGateway.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'

export function registerEventHandlers(
  dispatcher: EventDispatcher,
  gateway: SocketGateway,
  channelRepo: ChannelRepository
) {
  dispatcher.on('MESSAGE_CREATED', async (event) => {
    const members = await channelRepo.getMembers(event.payload.channelId)

    for (const member of members) {
      gateway.sendToUser(member.userId, event)
    }
  })

  dispatcher.on('CHANNEL_CREATED', (event) => {
  for (const userId of event.payload.members) {
    gateway.sendToUser(userId, event)
  }
})
}
