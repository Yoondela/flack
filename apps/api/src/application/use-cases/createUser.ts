import { z } from 'zod'
import { randomUUID } from 'crypto'
import { UserSchema } from '@/shared/schemas/user.schema.js'
import type { UserRepository } from '@/domain/user/user-repository.js'

const CreateUserInput = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  avatar: z.string().url().optional(),
})

export function makeCreateUser(userRepo: UserRepository) {
  return async function createUser(input: z.infer<typeof CreateUserInput>) {
    const parsed = CreateUserInput.parse(input)

    const existing = await userRepo.findByEmail(parsed.email)
    if (existing) {
      throw new Error('Email already exists')
    }

    const user = UserSchema.parse({
      id: randomUUID(),
      email: parsed.email,
      username: parsed.username,
      avatar: parsed.avatar,
      createdAt: new Date(),
    })

    return userRepo.create(user)
  }
}
