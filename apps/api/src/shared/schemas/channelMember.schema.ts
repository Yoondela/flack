import { z } from 'zod'

export const ChannelMemberSchema = z.object({
  channelId: z.string(), //uuid
  userId: z.string(), //uuid
  role: z.enum(['member', 'admin']),
  joinedAt: z.date(),
})

export type ChannelMember = z.infer<typeof ChannelMemberSchema>
