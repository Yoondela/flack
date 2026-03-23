import { create } from 'zustand'
import { chatSocket } from '../socket/chatSocket'

type Message = {
  id: string
  channelId: string
  senderId: string
  content: string
  createdAt: string
}

type Channel = {
  id: string
  type: 'dm' | 'public'
  members: string[]
}


type ChatState = {
  userId: string | null
  channels: Channel[]
  activeChannelId: string | null
  messages: Record<string, Message[]>

  connect: (userId: string) => void
  sendMessage: (channelId: string, content: string) => void
  startDM: (targetUserId: string) => void

  addMessage: (msg: Message) => void
  addChannel: (channel: Channel) => void

  getDMChannel: (userId: string) => Channel | undefined
  setActiveChannel: (userId: string) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  userId: null,
  channels: [],
  activeChannelId: null,
  messages: {},

  connect: (userId) => {
    set({ userId })

    chatSocket.connect(userId)

    chatSocket.onMessage((event) => {
      if (event.type === 'MESSAGE_CREATED') {
        console.log('MESSAGE_CREATED received:', event.payload)

        get().addMessage(event.payload)
      }
      if (event.type === 'CHANNEL_CREATED') {
        console.log('CHANNEL_CREATED received:', event.payload)
        get().addChannel({
          id: event.payload.id,
          type: event.payload.type,
          members: event.payload.members,
        })
        get().setActiveChannel(event.payload.id)
      }
    })
  },

  setActiveChannel: (channelId: string) => {
    set({ activeChannelId: channelId })
  },


  sendMessage: (channelId, content) => {
    chatSocket.send({
      type: 'SEND_MESSAGE',
      payload: { channelId, content },
    })
  },

  startDM: (targetUserId) => {
    chatSocket.send({
      type: 'START_DM',
      payload: { targetUserId },
    })
  },

  addMessage: (msg) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [msg.channelId]: [
          ...(state.messages[msg.channelId] || []),
          msg,
        ],
      },
    }))
  },

  addChannel: (channel) => {
    set((state) => {
      const exists = state.channels.some((c) => c.id === channel.id)
      if (exists) return state
      return { channels: [...state.channels, channel] }
    })
  },

  getDMChannel: (userId: string) => {
    const { channels, userId: self } = get()

    return channels.find(
      (c) =>
        c.type === 'dm' &&
        c.members.includes(userId) &&
        c.members.includes(self!)
    )
  },

}))
