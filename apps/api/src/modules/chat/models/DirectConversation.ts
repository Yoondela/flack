export interface Message {
  id: string
  channelId: string
  senderId: string
  content: string
  createdAt: Date
  editedAt?: Date
}
