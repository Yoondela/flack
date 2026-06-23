import { z } from 'zod'
// todo: if channel type is dm, then there must be a field called otherMember{ userId, username, avatar?}
export const ChannelSchema = z.object({
  id: z.string(), //uuid
  type: z.enum(['public', 'dm']),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  avatar: z.string().optional(),
  lastMessage: z
    .object({
      content: z.string(),
      senderId: z.string(),
      senderName: z.string(),
      createdAt: z.date(),
    })
    .optional(),
  createdBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export type Channel = z.infer<typeof ChannelSchema>
