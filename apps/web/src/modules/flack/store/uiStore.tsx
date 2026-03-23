import { create } from 'zustand'

type Tab = 'home' | 'channels' | 'dms' | 'activity' | 'calendar'

type UIState = {
  activeTab: Tab
  setTab: (tab: Tab) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  setTab: (tab) => set({ activeTab: tab }),
}))
