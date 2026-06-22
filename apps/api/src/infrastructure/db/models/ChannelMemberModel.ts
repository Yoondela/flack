// ChannelMemberModel.ts

import mongoose from 'mongoose'
import type { ChannelMember } from '@/shared/schemas/channelMember.schema.js'

const ChannelMemberModelSchema =
  new mongoose.Schema<ChannelMember>({
    channelId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    username: String,
    avatar: String,
    email: String,

    role: {
      type: String,
      enum: ['admin', 'member'],
      required: true,
    },

    joinedAt: {
      type: Date,
      required: true,
    },
  })

ChannelMemberModelSchema.index(
  {
    channelId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
)

export const ChannelMemberModel =
  mongoose.model<ChannelMember>(
    'ChannelMember',
    ChannelMemberModelSchema,
  )