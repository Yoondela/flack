import type { MessageRepository } from '@/domain/message/message.repository.js'
import type { Message } from '@/shared/schemas/message.schema.js'

export class InMemoryMessageRepo implements MessageRepository {
  private messages: Message[] = []

  async create(message: Message): Promise<Message> {
    this.messages.push(message)
    return message
  }

  async findByChannel(channelId: string): Promise<Message[]> {
    return this.messages.filter(m => m.channelId === channelId)
  }
}
