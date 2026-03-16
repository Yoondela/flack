import fp from 'fastify-plugin'
import websocket from '@fastify/websocket'
import type { FastifyInstance } from 'fastify'
import { connectionRegistry } from '../realtime/connectionRegistry.js'
import { routeEvent } from '../realtime/router/eventRouter.js'
import { ClientEventSchema } from '../realtime/eventSchemas/clientEventsSchema.js'
import { channelSubscriptionManager } from '../realtime/channelSubscriptionManager.js'
import type { ClientEvent } from '../realtime/events/clientEvents.js'
import type { RawData } from 'ws'

async function websocketPlugin(app: FastifyInstance) {
  await app.register(websocket)

  app.get('/ws', { websocket: true }, (socket, req) => {
    const user_Id = 'demo-user' // temporary until auth

    // temp setup
    const url = new URL(req.url!, `http://${req.headers.host}`)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      socket.close()
      return
    }

    connectionRegistry.add(userId, socket)

    socket.on('message', (message: RawData) => {

      let parsed: unknown  
      try {
        parsed = JSON.parse(message.toString())
      } catch {
        socket.send(
          JSON.stringify({
            type: 'ERROR',
            payload: { message: 'Message must be valid JSON' },
          })
        )
        return
      }      
      
      try { 
          // const event: ClientEvent = JSON.parse(message.toString()    )
          const event = ClientEventSchema.parse(parsed)
          routeEvent(event, socket, userId)
      } catch (err) {
        socket.send(
          JSON.stringify({
            type: 'ERROR',
            payload: { message: 'Invalid event format' },
          })
        )
      }

    socket.on('close', () => {
      channelSubscriptionManager.removeSocket(socket)
    })
  })
})}

export default fp(websocketPlugin)
