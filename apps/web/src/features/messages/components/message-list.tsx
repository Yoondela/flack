"use client"

import { useEffect } from "react"
import { useMessageStore } from "@/store/message-store"


export default function MessageList() {

  const messages = useMessageStore((s) => s.messages)

  useEffect(() => {

  }, [])

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f8fb] p-4 space-y-3">

      {messages.length === 0 && (
        <div className="text-sm text-slate-400">
          No messages yet
        </div>
      )}

      {messages.map((m) => (
        <div
          key={m.id}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
        >
          <b className="text-slate-900">{m.senderId}</b>: {m.content}
        </div>
      ))}

    </div>
  )
}
