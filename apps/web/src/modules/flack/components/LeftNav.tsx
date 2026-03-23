'use client'

import { useUIStore } from '../store/uiStore'
import { Home, Hash, MessageCircle, Activity, Calendar } from 'lucide-react'

const tabs = [
  { id: 'home', icon: Home },
  { id: 'channels', icon: Hash },
  { id: 'dms', icon: MessageCircle },
  { id: 'activity', icon: Activity },
  { id: 'calendar', icon: Calendar },
]

export function LeftNav() {
  const { activeTab, setTab } = useUIStore()

  return (
    <div className="w-16 bg-zinc-900 text-white flex flex-col items-center py-4 gap-4">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id as any)}
            className={`p-3 rounded-xl ${
              activeTab === tab.id ? 'bg-zinc-700' : 'hover:bg-zinc-800'
            }`}
          >
            <Icon size={20} />
          </button>
        )
      })}
    </div>
  )
}
