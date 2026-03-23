import { z } from 'zod'

export const SendMessageSchema = z.object({
  type: z.literal('SEND_MESSAGE'),
  payload: z.object({
    channelId: z.string(),
    content: z.string().min(1),
  }),
})

export const StartDMSchema = z.object({
  type: z.literal('START_DM'),
  payload: z.object({
    targetUserId: z.string(),
  }),
})

export const CreateChannelSchema = z.object({
  type: z.literal('CREATE_CHANNEL'),
  payload: z.object({
    type: z.enum(['public', 'dm']),
  }),
})


export const ClientEventSchema = z.discriminatedUnion('type', [
  SendMessageSchema,
  StartDMSchema,
  CreateChannelSchema,
])

export type ClientEvent = z.infer<typeof ClientEventSchema>
