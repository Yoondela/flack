import type WebSocket from 'ws'
import type { ClientEvent } from '../schemas/clientEventsSchema.js'
import { services } from '../../container/services.js'

import { channelSubscriptionManager } from '../channelSubscriptionManager.js'

export async function sendMessageHandler(
  event: ClientEvent,
  socket: WebSocket,
  userId: string
) {
  if (event.type !== 'SEND_MESSAGE') return

  const { channelId, content } = event.payload

  const message = await services.messageService.createMessage(
    channelId,
    userId,
    content
  )

  channelSubscriptionManager.broadcast(channelId, {
    type: 'MESSAGE_CREATED',
    payload: {
      id: message.id,
      channelId: message.channelId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    },
  })
}
