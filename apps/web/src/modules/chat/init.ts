import { chatSocket } from './socket/chatSocket'
import { registerChatEvents } from './socket/eventHandler'

export function initChat(userId: string) {
  chatSocket.connect(userId)
  registerChatEvents()
}
