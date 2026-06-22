import mongoose from 'mongoose'
import type { User } from '@/shared/schemas/user.schema.js'

const UserMongoSchema = new mongoose.Schema<User>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: String,
  createdAt: {
    type: Date,
    required: true,
  },
})

export const UserModel =
  mongoose.models.User ||
  mongoose.model<User>(
    'User',
    UserMongoSchema,
  )