export type ID = string

export interface User {
  id: ID
  name: string
  avatar?: string
}

export interface Channel {
  id: ID
  name: string
  createdAt: string
}

export interface DirectMessageThread {
  id: ID
  participants: User[]
}

export interface Message {
  id: string
  channelId: string
  senderId: string
  content: string
  createdAt: string
}

