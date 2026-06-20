import type { UserRepository } from '@/domain/user/user.repository.js'
import type { User } from '@/shared/schemas/user.schema.js'

export class InMemoryUserRepo implements UserRepository {

  private usersById: Map<string, User> = new Map()
  private usersByEmail: Map<string, User> = new Map()

  async create(user: User): Promise<User> {
    this.usersById.set(user.id, user)
    this.usersByEmail.set(user.email, user)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersByEmail.get(email) || null
  }

  async findMyProfile(userId: string): Promise<User | null> {
    console.log("findMyProfile userId: ", userId)
    return this.usersById.get(userId) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.usersById.get(id) || null
  }
}
