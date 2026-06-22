import type { Message } from '@/shared/schemas/message.schema.js'
import { MessageModel } from '@/infrastructure/db/models/MessageModel.js'
import type { MessageRepository } from '@/domain/message/message.repository.js'

export class MongoMessageRepo
  implements MessageRepository
{
  async create(
    message: Message,
  ): Promise<Message> {
    await MessageModel.create(message)

    return message
  }

  async findByChannel(
    channelId: string,
  ): Promise<Message[]> {
    return await MessageModel.find({
      channelId,
    })
      .sort({ createdAt: 1 })
      .lean()
  }

  async getMessagesForChannel(
    channelId: string,
  ): Promise<Message[]> {
    return await MessageModel.find({
      channelId,
    })
      .sort({ createdAt: 1 })
      .lean()
  }
}