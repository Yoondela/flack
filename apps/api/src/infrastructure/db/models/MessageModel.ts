import mongoose from 'mongoose'
import type { Message } from '@/shared/schemas/message.schema.js'

const MessageSchema = new mongoose.Schema<Message>({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  channelId: {
    type: String,
    required: true,
    index: true,
  },

  sender: {
    type: String,
    required: true,
    index: true,
  },

  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    index: true,
  },
})

export const MessageModel = mongoose.model<Message>(
  'Message',
  MessageSchema,
)