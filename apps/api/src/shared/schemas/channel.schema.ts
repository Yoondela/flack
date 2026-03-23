import { z } from 'zod'

export const ChannelSchema = z.object({
  id: z.string(), //uuid
  type: z.enum(['public', 'dm']),
  createdAt: z.date(),
})

export type Channel = z.infer<typeof ChannelSchema>
