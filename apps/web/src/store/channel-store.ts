import { create } from "zustand"

interface Channel {
  id: string
  name: string
}

interface ChannelState {

  channels: Channel[]
  activeChannel: string | null

  setChannels: (c: Channel[]) => void
  setActiveChannel: (id: string) => void
}

export const useChannelStore = create<ChannelState>((set) => ({

  channels: [],
  activeChannel: null,

  setChannels: (c) =>
    set({ channels: c }),

  setActiveChannel: (id) =>
    set({ activeChannel: id })

}))
