"use client"

import { sendWS } from "@/lib/socket"
import { useChatStore } from "@/store/chat-store"

export default function ChannelList() {

  const setChannel = useChatStore((s) => s.setChannel)
  const clearMessages = useChatStore((s) => s.clearMessages)

  function joinChannel(channelId: string) {

    setChannel(channelId)
    clearMessages()

    sendWS("JOIN_CHANNEL", { channelId })

  }

  return (
    <div className="p-4 border-b border-[#2b0a2c]">

      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
        Channels
      </h2>

      <div
        className="cursor-pointer rounded px-2 py-1 text-sm text-slate-200/90 transition hover:bg-[#2b0a2c] hover:text-white"
        onClick={() => joinChannel("general")}
      >
        # general
      </div>

      <div
        className="mt-1 cursor-pointer rounded px-2 py-1 text-sm text-slate-200/90 transition hover:bg-[#2b0a2c] hover:text-white"
        onClick={() => joinChannel("yod")}
      >
        # yod
      </div>

    </div>
  )
}
