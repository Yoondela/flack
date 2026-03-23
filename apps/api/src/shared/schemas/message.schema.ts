import { z } from 'zod'

export const MessageSchema = z.object({
  id: z.string(), //uuid
  channelId: z.string(), //uuid
  senderId: z.string(), //uuid
  content: z.string().min(1),
  createdAt: z.date(),
  editedAt: z.date().optional(),
})

export type Message = z.infer<typeof MessageSchema>
