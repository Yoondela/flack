import { UserModel } from '../db/models/UserModel.js'
import type { User } from '@/shared/schemas/user.schema.js'
import type { UserRepository } from '@/domain/user/user.repository.js'

export class MongoUserRepo
  implements UserRepository
{
  async create(user: User) {
    await UserModel.findOneAndUpdate(
      { id: user.id },
      user,
      {
        upsert: true,
        new: true,
      },
    )

    return user
  }

  async findById(id: string) {
    const user = await UserModel.findOne({
      id,
    }).lean()

    return user
  }

  async findByEmail(email: string) {
    const user = await UserModel.findOne({
      email,
    }).lean()

    return user
  }

  async findMyProfile(userId: string) {
    const user = await UserModel.findOne({
      id: userId,
    }).lean()

    return user
  }
}