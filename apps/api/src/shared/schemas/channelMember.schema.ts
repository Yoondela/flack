import { email, z } from 'zod'

export const ChannelMemberSchema = z.object({
  channelId: z.string(), //uuid
  userId: z.string(), //uuid:
  username: z.string().min(3).optional(),
  avatar: z.string().optional(),
  email: email().optional(),
  role: z.enum(['member', 'admin']),
  joinedAt: z.date(),
})

export type ChannelMember = z.infer<typeof ChannelMemberSchema>
