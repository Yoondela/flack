import type { UserRepository } from '@/domain/user/user-repository.js'
import type { User } from '@/shared/schemas/user.schema.js'

export class InMemoryUserRepo implements UserRepository {
  private users: User[] = []

  async create(user: User): Promise<User> {
    this.users.push(user)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null
  }
}
