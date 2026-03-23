import Fastify from 'fastify'
import type { WebSocket } from 'ws'
import websocketPlugin from '@fastify/websocket'
import type { FastifyRequest } from 'fastify'

import { EventDispatcher } from '@/application/events/eventDispatcher.js'
import { SocketGateway } from '@/interface/websocket/socketGateway.js'
import { registerEventHandlers } from '@/interface/websocket/registerEventHandlers.js'

import { InMemoryChannelRepo } from '@/infrastructure/repositories/inMemoryChannelRepo.js'
import { InMemoryMessageRepo } from '@/infrastructure/repositories/inMemoryMessageRepo.js'

import { makeSendMessage } from '@/application/use-cases/sendMessage.js'
import { makeCreateChannel } from '@/application/use-cases/createChannel.js'
import { makeStartDM } from '@/application/use-cases/startDm.js'
import { createEventRouter } from '@/interface/websocket/evenRouter.js'


const app = Fastify()

await app.register(websocketPlugin)

// --- Core systems ---
const dispatcher = new EventDispatcher()
const gateway = new SocketGateway()

// --- Repos ---
const channelRepo = new InMemoryChannelRepo()
const messageRepo = new InMemoryMessageRepo()

// wire events → sockets
registerEventHandlers(dispatcher, gateway, channelRepo)

// --- Use cases ---
const sendMessage = makeSendMessage(channelRepo, messageRepo, dispatcher)
const createChannel = makeCreateChannel(channelRepo, dispatcher)
const startDM = makeStartDM(channelRepo, dispatcher)

const routeEvent = createEventRouter({
  sendMessage,
  createChannel,
  startDM,
})


// --- WebSocket route ---
app.get(
  '/ws',
  { websocket: true },
  (socket: WebSocket, req: FastifyRequest) => {

    console.log('WS ROUTE HIT')
    
    const url = new URL(req.url!, `http://${req.headers.host}`)
    const userId = url.searchParams.get('userId')
    console.log('USER ID:', userId)
    console.log('CLIENT REGISTERED:', userId)

  if (!userId) {
    console.log("No ID, Closing..")
    socket.close()
    return
  }

  gateway.addClient(userId, socket)

  socket.on('message', async (raw: Buffer) => {
        console.log('message received:', raw)

      await routeEvent(raw, socket, userId)
    })


  socket.on('close', () => {
    console.log(`SOCKET CLOSED for user ${userId}`)
    gateway.removeClient(userId)
  })


    socket.on('error', (err: any) => {
  console.error('SOCKET LOW-LEVEL ERROR:', err)
})
})


// --- start server ---
app.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server running at ${address}`)
})
