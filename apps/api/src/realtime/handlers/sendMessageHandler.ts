import type WebSocket from 'ws'
import type { ClientEvent } from '../eventSchemas/clientEventsSchema.js'
import { services } from '../../container/services.js'
import { connectionRegistry } from '../connectionRegistry.js'
import { channelSubscriptionManager } from '../channelSubscriptionManager.js'

export async function sendMessageHandler(
  event: ClientEvent,
  socket: WebSocket,
  userId: string
) {
  if (event.type !== 'SEND_MESSAGE') return

  let { channelId, targetUserId, content } = event.payload

  // DM case
  if (!channelId && targetUserId) {

    const channel =
      await services.channelService.getOrCreateDM(
        userId,
        targetUserId
      )

    channelId = channel.id

    // subscribe sender
    channelSubscriptionManager.subscribe(channelId, socket)

    // subscribe receiver if online
    const targetSockets = connectionRegistry.get(targetUserId)

    if (targetSockets) {
      for (const s of targetSockets) {
        channelSubscriptionManager.subscribe(channelId, s)
      }
    }
  }

  const message =
    await services.messageService.createMessage(
      channelId!,
      userId,
      content
    )

  const payload = {
    id: message.id,
    channelId: message.channelId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  }

  socket.send(JSON.stringify({
    type: 'MESSAGE_SENT',
    payload,
  }))

  channelSubscriptionManager.broadcast(
    channelId!,
    { type: 'MESSAGE_RECEIVED', payload },
    socket
  )
}

