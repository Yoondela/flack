import { create } from "zustand"

interface DM {
  id: string
  username: string
}

interface DMState {

  dms: DM[]
  activeDM: string | null

  setDMs: (d: DM[]) => void
  setActiveDM: (id: string) => void
}

export const useDMStore = create<DMState>((set) => ({

  dms: [],
  activeDM: null,

  setDMs: (d) =>
    set({ dms: d }),

  setActiveDM: (id) =>
    set({ activeDM: id })

}))
