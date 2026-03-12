export interface SendMessagePayload {
  channelId: string
  content: string
}

export interface JoinChannelPayload {
  channelId: string
}

export interface LeaveChannelPayload {
  channelId: string
}

export interface MessageCreatedPayload {
  id: string
  channelId: string
  senderId: string
  content: string
  createdAt: string
}

export interface UserJoinedPayload {
  channelId: string
  userId: string
}
