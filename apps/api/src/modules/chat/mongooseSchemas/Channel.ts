import mongoose from 'mongoose'

const channelSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['public', 'dm'],
    required: true,
  },

  members: {
    type: [String],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

channelSchema.index({ members: 1 })

export const ChannelModel = mongoose.model(
  'Channel',
  channelSchema
)
