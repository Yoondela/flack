import { chatSocket } from './chatSocket'
import { useChatStore } from '../store/chatStore'

export function registerChatEvents() {
  // chatSocket.subscribe((event) => {
  //   const store = useChatStore.getState()

  //   switch (event.type) {
  //     case 'CHANNEL_CREATED':
  //       store.addChannel(event.payload)
  //       break

  //     case 'MESSAGE_CREATED':
  //       store.addMessage(event.payload)
  //       break

  //     case 'ERROR':
  //       console.error(event.payload.message)
  //       break
  //   }
  // })
}
