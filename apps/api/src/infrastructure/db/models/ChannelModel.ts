// src/infrastructure/db/models/ChannelModel.ts

import mongoose from 'mongoose'
import type { Channel } from '@/shared/schemas/channel.schema.js'

const ChannelModelSchema = new mongoose.Schema<Channel>({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  type: {
    type: String,
    enum: ['public', 'dm'],
    required: true,
  },

  name: String,
  description: String,
  avatar: String,
  createdBy: String,

  createdAt: {
    type: Date,
    required: true,
  },

  updatedAt: Date,
})

export const ChannelModel = mongoose.model<Channel>(
  'Channel',
  ChannelModelSchema,
)