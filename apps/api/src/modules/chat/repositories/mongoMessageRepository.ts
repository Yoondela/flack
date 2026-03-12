import type { MessageRepository } from './messageRepository.js'
import { MessageModel } from '../mongooseSchemas/Message.js'
import type { Message } from '../types/message.js'

export class MongoMessageRepository implements MessageRepository {
  async create(data: Omit<Message, 'id'>): Promise<Message> {
    const doc = await MessageModel.create(data)

    return {
      id: doc._id.toString(),
      channelId: doc.channelId,
      senderId: doc.senderId,
      content: doc.content,
      createdAt: doc.createdAt
    }
  }

  async findByChannel(channelId: string, limit = 50): Promise<Message[]> {
    const docs = await MessageModel
      .find({ channelId })
      .sort({ createdAt: -1 })
      .limit(limit)

    return docs.map(doc => ({
      id: doc._id.toString(),
      channelId: doc.channelId,
      senderId: doc.senderId,
      content: doc.content,
      createdAt: doc.createdAt
    }))
  }
}
