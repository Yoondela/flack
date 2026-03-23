import { describe, it, expect } from 'vitest'
import { makeCreateUser } from '@/application/use-cases/createUser.js'
import { InMemoryUserRepo } from '@/infrastructure/repositories/inMemoryUserRepo.js'

describe('Create User', () => {
  const repo = new InMemoryUserRepo()
  const createUser = makeCreateUser(repo)

  it('should create a user', async () => {
    const user = await createUser({
      email: 'test@example.com',
      username: 'yondela',
    })

    expect(user.id).toBeDefined()
    expect(user.email).toBe('test@example.com')
  })

  it('should not allow duplicate emails', async () => {
    await createUser({
      email: 'dup@example.com',
      username: 'one',
    })

    await expect(
      createUser({
        email: 'dup@example.com',
        username: 'two',
      })
    ).rejects.toThrow()
  })
})
