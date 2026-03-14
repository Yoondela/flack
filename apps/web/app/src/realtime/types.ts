export type ClientEvent =
  | {
      type: 'JOIN_CHANNEL'
      payload: { channelId: string }
    }
  | {
      type: 'LEAVE_CHANNEL'
      payload: { channelId: string }
    }
  | {
      type: 'SEND_MESSAGE'
      payload: { channelId: string; content: string }
    }

export type Message = {
  id: string
  channelId: string
  senderId: string
  content: string
  createdAt: string
}

export type ServerEvent =
  | {
      type: 'MESSAGE_CREATED'
      payload: Message
    }
  | {
      type: 'CHANNEL_JOINED'
      payload: Message[]
    }
  | {
      type: 'USER_JOINED'
      payload: { channelId: string; userId: string }
    }
  | {
      type: 'ERROR'
      payload: { message: string }
    }

export type ConnectionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'
