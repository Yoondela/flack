import type {
  MessageCreatedPayload,
  UserJoinedPayload,
} from './payloads.js'

export type ServerEvent =
  | {
      type: 'MESSAGE_CREATED'
      payload: MessageCreatedPayload
    }
  | {
      type: 'USER_JOINED'
      payload: UserJoinedPayload
    }
  | {
      type: 'ERROR'
      payload: { message: string }
    }
