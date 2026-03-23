'use client'

import { useUIStore } from '../store/uiStore'

export function InnerPanel() {

  const { activeTab } = useUIStore()

  return (
    <div className="w-64 bg-zinc-800 text-white p-4">
      <h2 className="text-lg font-semibold mb-4 capitalize">
        {activeTab}
      </h2>

      {activeTab === 'home' && (
        <p className="text-sm text-zinc-400">Channels & DMs</p>
      )}

      {activeTab === 'channels' && (
        <p className="text-sm text-zinc-400">Channel list</p>
      )}

      {activeTab === 'dms' && (
        <p className="text-sm text-zinc-400">DM list</p>
      )}
    </div>
  )
}
