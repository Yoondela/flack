import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import type { WebSocket } from 'ws'
import websocketPlugin from '@fastify/websocket'
import type { FastifyRequest } from 'fastify'
import { z } from 'zod'

import { connectDatabase } from '@/infrastructure/db/mongoose.js'

import { EventDispatcher } from '@/application/events/eventDispatcher.js'
import { SocketGateway } from '@/interface/websocket/socketGateway.js'
import { registerEventHandlers } from '@/interface/websocket/registerEventHandlers.js'

import { ProfilerClient } from '@/infrastructure/services/profilerClient.js'
import { MongoUserRepo } from './infrastructure/repositories/MongoUserRepo.js'
import { MongoChannelRepo } from './infrastructure/repositories/MongoChannelRepo.js'
import { MongoMessageRepo } from './infrastructure/repositories/MongoMessageRepo.js'

import { makeSyncUser } from '@/application/use-cases/syncUser.js'
import { makeSendMessage } from '@/application/use-cases/sendMessage.js'
import { makeCreateChannel } from '@/application/use-cases/createChannel.js'
import { makeStartDM } from '@/application/use-cases/startDm.js'
import { makeEnsureDMChannel } from '@/application/use-cases/ensureDMChannel.js'
import { makeGetChannels } from '@/application/use-cases/getUserChannels.js'
import { makeGetChannelMessages } from './application/use-cases/getMessages.js'
import { makeGetChatData } from '@/application/use-cases/getChatData.js'
import { createEventRouter } from '@/interface/websocket/evenRouter.js'
import { appContext } from '@/context/app.context.js'


const app = Fastify()

await app.register(cors, {
  origin: true,
})

await app.register(websocketPlugin)
await connectDatabase()

// --- Core systems ---
const dispatcher = new EventDispatcher()
const gateway = new SocketGateway()
const profilerClient = new ProfilerClient()

// --- Repos ---
// const channelRepo = new InMemoryChannelRepo()
const channelRepo = new MongoChannelRepo()

const messageRepo = new MongoMessageRepo()
const userRepo = new MongoUserRepo()


// wire events → sockets
registerEventHandlers(dispatcher, gateway, channelRepo, userRepo)

// --- Use cases ---
const syncUser = makeSyncUser(userRepo, profilerClient)
const sendMessage = makeSendMessage(channelRepo, messageRepo, userRepo, dispatcher)
const createChannel = makeCreateChannel(channelRepo, dispatcher)
const ensureDMChannel = makeEnsureDMChannel(channelRepo, dispatcher, userRepo, syncUser)
const startDM = makeStartDM(ensureDMChannel)
const getChannels = makeGetChannels(channelRepo)
const getChannelMessages = makeGetChannelMessages(messageRepo, userRepo)
const getChatData = makeGetChatData(
  getChannels,
  getChannelMessages,
)

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
  async (socket: WebSocket, req: FastifyRequest) => {

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

  appContext.setFlackUserId(userId)
  await syncUser(userId) // ensure user exists FIRST
  gateway.addClient(userId, socket)

  socket.on('message', async (raw: Buffer) => {
        console.log('CP-1')
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

    console.log("Ensured DM channel: ", channel)
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

app.get(
  '/channels/:channelId/messages',
  async (req, reply) => {
    const { channelId } =
      req.params as {
        channelId: string
      }

    const messages =
      await getChannelMessages(
        channelId,
      )

    return reply.send(messages)
  },
)

app.get(
  '/channels/:userId',
  async (req, reply) => {
    try {
      const { userId } = req.params as {
        userId: string
      }

      const data =
        await getChatData(userId)

      return reply.send(data)
    } catch (err) {
      console.error(err)

      return reply.code(500).send({
        error:
          'Failed to load chat data',
      })
    }
  },
)

// --- start server ---
app.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server running at ${address}`)
})
