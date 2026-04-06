import Fastify from 'fastify'
import type { WebSocket } from 'ws'
import websocketPlugin from '@fastify/websocket'
import type { FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EventDispatcher } from '@/application/events/eventDispatcher.js'
import { SocketGateway } from '@/interface/websocket/socketGateway.js'
import { registerEventHandlers } from '@/interface/websocket/registerEventHandlers.js'

import { InMemoryChannelRepo } from '@/infrastructure/repositories/inMemoryChannelRepo.js'
import { InMemoryMessageRepo } from '@/infrastructure/repositories/inMemoryMessageRepo.js'

import { makeSendMessage } from '@/application/use-cases/sendMessage.js'
import { makeCreateChannel } from '@/application/use-cases/createChannel.js'
import { makeStartDM } from '@/application/use-cases/startDm.js'
import { makeEnsureDMChannel } from '@/application/use-cases/ensureDMChannel.js'
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
const ensureDMChannel = makeEnsureDMChannel(channelRepo, dispatcher)

const routeEvent = createEventRouter({
  sendMessage,
  createChannel,
  startDM,
})

const EnsureDMBody = z.object({
  userA: z.string(),
  userB: z.string(),
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

// --- HTTP route (internal service) ---
app.post('/ensure-dm', async (req, reply) => {
  console.log("Ensure DM route hit with body: ", req.body)
  try {
    const body = EnsureDMBody.parse(req.body)
    const channel = await ensureDMChannel(body)
    const members = await channelRepo.getMembers(channel.id)

    return reply.send({
      channel: {
        id: channel.id,
        type: channel.type,
        createdAt: channel.createdAt.toISOString(),
      },
      members: members.map(m => m.userId),
    })
  } catch (err: any) {
    return reply.code(400).send({
      error: 'Invalid ensure-dm request body',
    })
  }
})

// --- start server ---
app.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server running at ${address}`)
})
