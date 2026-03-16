import { z } from 'zod'

export const MessageCreatedSchema = z.object({
  type: z.literal('MESSAGE_CREATED'),
  payload: z.object({
    id: z.string(),
    channelId: z.string(),
    senderId: z.string(),
    content: z.string(),
    createdAt: z.string(),
  }),
})

export const ErrorEventSchema = z.object({
  type: z.literal('ERROR'),
  payload: z.object({
    message: z.string(),
  }),
})

export const ServerEventSchema = z.union([
  MessageCreatedSchema,
  ErrorEventSchema,
])

export type ServerEvent = z.infer<typeof ServerEventSchema>
