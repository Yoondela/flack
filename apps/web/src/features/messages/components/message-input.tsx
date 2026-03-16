"use client"

import { useState } from "react"
import { sendWS } from "@/lib/socket"
import { useChatStore } from "@/store/chat-store"

export default function MessageInput() {

  const [message, setMessage] = useState("")
  const channelId = useChatStore((s) => s.channelId)

  function sendMessage() {

    if (!channelId || !message.trim()) return

    sendWS("SEND_MESSAGE", {
      channelId,
      content: message
    })

    setMessage("")
  }

  return (
    <div className="border-t border-slate-200 bg-white p-3 flex gap-2">

      <input
        className="flex-1 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#36c5f0] focus:ring-2 focus:ring-[#36c5f0]/40"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="rounded-md bg-[#2eb67d] px-4 text-sm font-semibold text-white transition hover:bg-[#27a26f]"
      >
        Send
      </button>

    </div>
  )
}
