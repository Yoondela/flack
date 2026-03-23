'use client'

import { LeftNav } from './components/LeftNav'
import { InnerPanel } from './components/InnerPanel'
import { ChatView } from './components/ChatView'

export function FlackApp() {
  return (
    <div className="flex h-screen w-full">
      <LeftNav />
      <InnerPanel />
      <ChatView />
    </div>
  )
}
