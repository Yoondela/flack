import { create } from "zustand"
import { Message } from "@/types/types"

interface ChatState {

  channelId: string | null
  messages: Message[]

  setChannel: (id: string) => void
  setMessages: (msgs: Message[]) => void
  addMessage: (msg: Message) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({

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
