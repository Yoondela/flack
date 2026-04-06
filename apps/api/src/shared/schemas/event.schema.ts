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

export const MessageSentEventSchema = z.object({
  type: z.literal('MESSAGE_SENT'),
  payload: z.object({
    id: z.string(),
    channelId: z.string(),
    senderId: z.string(),
    content: z.string(),
    createdAt: z.string(),
  }),
})

export const MessageReceivedEventSchema = z.object({
  type: z.literal('MESSAGE_RECEIVED'),
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

export const ChannelAvailableEventSchema = z.object({
  type: z.literal('CHANNEL_AVAILABLE'),
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
  MessageReceivedEventSchema,
  MessageSentEventSchema,
  MessageCreatedEventSchema,
  ChannelCreatedEventSchema,
  ChannelAvailableEventSchema,
  ErrorEventSchema,
])

export type ServerEvent = z.infer<typeof ServerEventSchema>
