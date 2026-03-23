'use client'

import { useEffect } from 'react'
import { initChat } from './init'
import { FlackApp } from '../flack/FlackApp'
import { LiteChat } from '../lite-chat/LiteChat'
import { useChatStore } from './store/chatStore'

type Props = {
  userId: string
  role: 'client' | 'provider'
}

export function ChatRoot({ userId, role }: Props) {
  const connect = useChatStore((s) => s.connect)
  
  useEffect(() => {
    connect(userId)
    // initChat(userId)
  }, [userId])

  if (role === 'provider') {
    return <FlackApp />
  }

  return <LiteChat />
}
