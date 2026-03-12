import type WebSocket from 'ws'
import type { ClientEvent } from '../schemas/clientEventsSchema.js'
import { joinChannelHandler } from '../handlers/joinChannelHandler.js'
import { leaveChannelHandler } from '../handlers/leaveChannelHandler.js'
import { sendMessageHandler } from '../handlers/sendMessageHandler.js'

export function routeEvent(event: ClientEvent, socket: WebSocket, userId: string) {
  switch (event.type) {
    case 'JOIN_CHANNEL':
      joinChannelHandler(event, socket, userId)
      break

    case 'LEAVE_CHANNEL':
      leaveChannelHandler(event, socket)
      break

    case 'SEND_MESSAGE':
      sendMessageHandler(event, socket, userId)
      break
  }
}
