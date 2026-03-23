import type { Message } from '@/shared/schemas/message.schema.js'

export interface MessageRepository {
  create(message: Message): Promise<Message>
  findByChannel(channelId: string): Promise<Message[]>
}
