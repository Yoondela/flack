import { create } from "zustand"
import { Message } from "@/types/types"

interface MessageState {

  channelId: string | null
  messages: Message[]

  setChannel: (id: string) => void
  setMessages: (msgs: Message[]) => void
  addMessage: (msg: Message) => void
  clearMessages: () => void
}

export const useMessageStore = create<MessageState>((set) => ({

  channelId: null,
  messages: [],

  setChannel: (id) =>
    set({ channelId: id }),

  setMessages: (msgs) =>
    set({ messages: msgs }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg]
    })),

  clearMessages: () =>
    set({ messages: [] })

}))
