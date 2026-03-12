import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  channelId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

messageSchema.index({ channelId: 1, createdAt: -1 })


export const MessageModel = mongoose.model(
  'Message',
  messageSchema
)
