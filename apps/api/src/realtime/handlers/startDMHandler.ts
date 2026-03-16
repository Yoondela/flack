import type WebSocket from 'ws'
import { services } from '../../container/services.js'
import { connectionRegistry } from '../connectionRegistry.js'
import { channelSubscriptionManager } from '../channelSubscriptionManager.js'
import type { ClientEvent } from '../eventSchemas/clientEventsSchema.js'

export async function startDMHandler(
  event: ClientEvent,
  socket: WebSocket,
  userId: string
) {
  if (event.type !== 'START_DM') return

  const { targetUserId } = event.payload

  const channel =
    await services.channelService.getOrCreateDM(
      userId,
      targetUserId
    )

  const channelId = channel.id

  // auto subscribe initiator
  channelSubscriptionManager.subscribe(
    channelId,
    socket
  )

  // get history
  const history =
    await services.messageService.getChannelHistory(channelId)

  socket.send(
    JSON.stringify({
      type: 'DM_CHANNEL_READY',
      payload: {
        channelId,
        history: history.reverse(),
      },
    })
  )

  // subscribe target user if online
  const targetSockets =
    connectionRegistry.get(targetUserId)

  if (targetSockets) {
    for (const targetSocket of targetSockets) {
      channelSubscriptionManager.subscribe(
        channelId,
        targetSocket
      )

      targetSocket.send(
        JSON.stringify({
          type: 'DM_CHANNEL_READY',
          payload: {
            channelId,
            from: userId,
          },
        })
      )
    }
  }
}
