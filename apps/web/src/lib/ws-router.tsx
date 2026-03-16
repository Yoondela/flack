import { useMessageStore } from "@/store/message-store"

export function routeWSEvent(event: any) {

  const {
    addMessage,
    setMessages,
    setChannel,
    clearMessages
  } = useMessageStore.getState()

  switch (event.type) {

    case "CHANNEL_JOINED":

      console.log("chanel joined, setting messages")

      setMessages(event.payload)

      break

    case "DM_CHANNEL_READY":

      setChannel(event.payload.channelId)

      if (event.payload.history) {
        setMessages(event.payload.history)
      } else {
        clearMessages()
      }

      break

    case "MESSAGE_CREATED":
    case "MESSAGE_RECEIVED":
    case "MESSAGE_SENT":

      addMessage(event.payload)

      break

    default:

      console.warn("Unhandled event", event)

  }
}
