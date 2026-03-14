import type { Message, ServerEvent } from './types'

type RecordLike = Record<string, unknown>

export function isRecord(value: unknown): value is RecordLike {
  return typeof value === 'object' && value !== null
}

export function isMessage(value: unknown): value is Message {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.channelId === 'string' &&
    typeof value.senderId === 'string' &&
    typeof value.content === 'string' &&
    typeof value.createdAt === 'string'
  )
}

export function parseServerEvent(raw: unknown): ServerEvent | null {
  if (!isRecord(raw) || typeof raw.type !== 'string') return null

  switch (raw.type) {
    case 'MESSAGE_CREATED':
      if (isMessage(raw.payload)) {
        return { type: 'MESSAGE_CREATED', payload: raw.payload }
      }
      return null

    case 'CHANNEL_JOINED':
      if (Array.isArray(raw.payload) && raw.payload.every(isMessage)) {
        return { type: 'CHANNEL_JOINED', payload: raw.payload }
      }
      return null

    case 'USER_JOINED':
      if (
        isRecord(raw.payload) &&
        typeof raw.payload.channelId === 'string' &&
        typeof raw.payload.userId === 'string'
      ) {
        return {
          type: 'USER_JOINED',
          payload: {
            channelId: raw.payload.channelId,
            userId: raw.payload.userId,
          },
        }
      }
      return null

    case 'ERROR':
      if (isRecord(raw.payload) && typeof raw.payload.message === 'string') {
        return {
          type: 'ERROR',
          payload: { message: raw.payload.message },
        }
      }
      return null

    default:
      return null
  }
}
