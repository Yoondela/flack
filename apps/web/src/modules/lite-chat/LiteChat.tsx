'use client'

import { useState } from 'react'
import { ChatSheet } from './components/ChatSheet'
import { ChatButton } from './components/ChatButton'

export function LiteChat() {
  const [open, setOpen] = useState(true)

  return (
    <>
      {/* <ChatButton onClick={() => setOpen(true)} /> */}
      <ChatSheet open={open} onOpenChange={setOpen} />
    </>
  )
}
