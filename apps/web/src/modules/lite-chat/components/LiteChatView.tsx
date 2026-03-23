'use client'

import { useChatStore } from '@/modules/chat/store/chatStore'

export function LiteChatView({
  userId,
  onBack,
}: {
  userId: string
  onBack: () => void
}) {

  const activeChannelId = useChatStore((s) => s.activeChannelId)
  const messages = useChatStore((s) => s.messages)


  // const messages = messagesMap[userId] ?? []

  const channelMessages = activeChannelId
  ? messages[activeChannelId] ?? []
  : []

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {channelMessages.map((m) => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>
    </div>
  )
}
