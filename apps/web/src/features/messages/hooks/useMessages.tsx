import { useEffect } from "react"
import { socket } from "@/lib/socket"
import { useChatStore } from "@/store/chat-store"

export function useMessages() {
  const addMessage = useChatStore((s) => s.addMessage)

  useEffect(() => {

    socket.on("message_received", (msg) => {
      addMessage(msg)
    })

    return () => {
      socket.off("message_received")
    }

  }, [])
}
