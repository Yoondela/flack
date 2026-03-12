import type { MessageRepository } from '../repositories/messageRepository.js'
import type { Message } from '../types/message.js'

export class MessageService {
  constructor(private repo: MessageRepository) {}

  async createMessage(
    channelId: string,
    senderId: string,
    content: string
  ): Promise<Message> {
    return this.repo.create({
      channelId,
      senderId,
      content,
      createdAt: new Date()
    })
  }

  async getChannelHistory(channelId: string) {
    return this.repo.findByChannel(channelId)
  }
}

