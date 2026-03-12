import type {
  SendMessagePayload,
  JoinChannelPayload,
  LeaveChannelPayload,
} from './payloads.js'

export type ClientEvent =
  | {
      type: 'SEND_MESSAGE'
      payload: SendMessagePayload
    }
  | {
      type: 'JOIN_CHANNEL'
      payload: JoinChannelPayload
    }
  | {
      type: 'LEAVE_CHANNEL'
      payload: LeaveChannelPayload
    }
