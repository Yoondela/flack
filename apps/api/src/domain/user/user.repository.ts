import type { User } from '@/shared/schemas/user.schema.js'

export interface UserRepository {
  create(user: User): Promise<User>
  findMyProfile(userId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
