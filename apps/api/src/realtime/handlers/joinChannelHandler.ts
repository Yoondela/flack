import type WebSocket from 'ws'
import type { ClientEvent } from '../schemas/clientEventsSchema.js'
import { services } from '../../container/services.js'
import { channelSubscriptionManager } from '../channelSubscriptionManager.js'

export async function joinChannelHandler(event: ClientEvent, socket: WebSocket, userId: String) {
  if (event.type !== 'JOIN_CHANNEL') return

  const { channelId } = event.payload

  channelSubscriptionManager.subscribe(
    channelId,
    socket
  )

  const history = await services.messageService.getChannelHistory(channelId)
  socket.send(
    JSON.stringify({
      type: 'CHANNEL_JOINED',
      payload: history.reverse(),
    })
  )
}
