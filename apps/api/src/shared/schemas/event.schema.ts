import { z } from 'zod'

export const MessageCreatedEventSchema = z.object({
  type: z.literal('MESSAGE_CREATED'),
  payload: z.object({
    id: z.string(),
    channelId: z.string(),
    senderId: z.string(),
    content: z.string(),
    createdAt: z.string(),
  }),
})

export const ChannelCreatedEventSchema = z.object({
  type: z.literal('CHANNEL_CREATED'),
  payload: z.object({
    id: z.string(),
    type: z.enum(['public', 'dm']),
    members: z.array(z.string()),
    createdAt: z.string(),
  }),
})

export const ErrorEventSchema = z.object({
  type: z.literal('ERROR'),
  payload: z.object({
    message: z.string(),
  }),
})

export const ServerEventSchema = z.discriminatedUnion('type', [
  MessageCreatedEventSchema,
  ChannelCreatedEventSchema,
  ErrorEventSchema,
])

export type ServerEvent = z.infer<typeof ServerEventSchema>
