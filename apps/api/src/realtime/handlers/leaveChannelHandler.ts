import type WebSocket from 'ws'
import type { ClientEvent } from '../eventSchemas/clientEventsSchema.js'
import { channelSubscriptionManager } from '../channelSubscriptionManager.js'

export function leaveChannelHandler(event: ClientEvent, socket: WebSocket) {
  if (event.type !== 'LEAVE_CHANNEL') return

  channelSubscriptionManager.unsubscribe(
    event.payload.channelId,
    socket
  )
}
