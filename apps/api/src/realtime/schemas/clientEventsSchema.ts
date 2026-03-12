import { z } from 'zod'

export const SendMessageSchema = z.object({
  type: z.literal('SEND_MESSAGE'),
  payload: z.object({
    channelId: z.string(),
    content: z.string().min(1),
  }),
})

export const JoinChannelSchema = z.object({
  type: z.literal('JOIN_CHANNEL'),
  payload: z.object({
    channelId: z.string(),
  }),
})

export const LeaveChannelSchema = z.object({
  type: z.literal('LEAVE_CHANNEL'),
  payload: z.object({
    channelId: z.string(),
  }),
})

export const ClientEventSchema = z.discriminatedUnion('type', [
  SendMessageSchema,
  JoinChannelSchema,
  LeaveChannelSchema,
])

export type ClientEvent = z.infer<typeof ClientEventSchema>
