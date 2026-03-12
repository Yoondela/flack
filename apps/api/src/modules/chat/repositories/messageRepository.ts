import type { Message } from '../types/message.js'

export interface MessageRepository {
  create(message: Omit<Message, 'id'>): Promise<Message>
  findByChannel(channelId: string, limit?: number): Promise<Message[]>
}
