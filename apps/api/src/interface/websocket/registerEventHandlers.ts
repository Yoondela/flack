import type { EventDispatcher } from '@/application/events/eventDispatcher.js'
import type { SocketGateway } from './socketGateway.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { UserRepository } from '@/domain/user/user.repository.js'

export function registerEventHandlers(
  dispatcher: EventDispatcher,
  gateway: SocketGateway,
  channelRepo: ChannelRepository,
  userRepo: UserRepository,
) {
dispatcher.on('MESSAGE_CREATED', async (event) => {
  const { channelId } = event.payload

  const senderId = event.payload.sender
  
  const members = await channelRepo.getMembers(channelId)

  // 🔥 find sender as ChannelMember (already has username + avatar)
  const sender = members.find(m => m.userId === senderId)

  if (!sender) {
    console.error('Sender not found in members')
    return
  }

  for (const member of members) {
    const isSender = member.userId === senderId

    gateway.sendToUser(member.userId, {
      type: isSender ? 'MESSAGE_SENT' : 'MESSAGE_RECEIVED',
      payload: event.payload,
    })
  }
})


  dispatcher.on('CHANNEL_CREATED', async (event) => {

    for (const member of event.payload.members) {
      gateway.sendToUser(member.userId, {
        type: 'CHANNEL_CREATED',
        payload: event.payload,
      })
    }
  })

  dispatcher.on('CHANNEL_AVAILABLE', async (event) => {

    for (const member of event.payload.members) {
      gateway.sendToUser(member.userId, {
        type: 'CHANNEL_AVAILABLE',
        payload: event.payload,
      })
    }
  })



}
