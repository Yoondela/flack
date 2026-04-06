import mongoose from 'mongoose'

export const ChannelModel = new mongoose.Schema({
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

ChannelModel.index(
  { type: 1, members: 1 },
  {
    unique: true,
    partialFilterExpression: { type: 'dm' },
  }
)
