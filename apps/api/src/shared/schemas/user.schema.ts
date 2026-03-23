import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(), //uuid
  email: z.string(), //uuid
  username: z.string().min(3),
  avatar: z.string().url().optional(),
  createdAt: z.date(),
})

export type User = z.infer<typeof UserSchema>
