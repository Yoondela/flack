import type { WebSocket } from 'ws'
import { ClientEventSchema } from '@/shared/schemas/clientEvent.schema.js'

export function createEventRouter(deps: {
  sendMessage: any
  createChannel: any
  startDM: any
}) {
  return async function routeEvent(
    raw: Buffer,
    socket: WebSocket,
    userId: string
  ) {
    try {
      const parsed = JSON.parse(raw.toString())

      const event = ClientEventSchema.parse(parsed)

      switch (event.type) {
        case 'SEND_MESSAGE':
    console.log("In SEND_MESSAGE event")

          await deps.sendMessage({
            channelId: event.payload.channelId,
            senderId: userId,
            content: event.payload.content,
          })
          break

        case 'START_DM':
          await deps.startDM({
            userA: userId,
            userB: event.payload.targetUserId,
          })
          break

        case 'CREATE_CHANNEL':
          await deps.createChannel({
            type: event.payload.type,
            creatorId: userId,
          })
          break
      }
    } catch (err) {
      console.error('ROUTER ERROR:', err)

      socket.send(
        JSON.stringify({
          type: 'ERROR',
          payload: { message: 'Invalid event' },
        })
      )
    }
  }
}
