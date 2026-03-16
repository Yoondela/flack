"use client"

import { sendWS } from "@/lib/socket"
import { useChatStore } from "@/store/chat-store"

export default function DMList() {

  const setChannel = useChatStore((s) => s.setChannel)

  function startDM(userId: string) {

    sendWS("START_DM", {
      targetUserId: userId
    })

  }

  return (
    <div className="p-4">

      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
        DMs__
      </h2>

      <div
        className="cursor-pointer rounded px-2 py-1 text-sm text-slate-200/90 transition hover:bg-[#2b0a2c] hover:text-white"
        onClick={() => startDM("yondela")}
      >
        Yondela
      </div>

      <div
        className="mt-1 cursor-pointer rounded px-2 py-1 text-sm text-slate-200/90 transition hover:bg-[#2b0a2c] hover:text-white"
        onClick={() => startDM("amber")}
      >
        Amber
      </div>

    </div>
  )
}
