"use client"

import Link from "next/link"
import LiteChat from "@/components/layout/lite/lite-chat"
import { useState, useEffect } from "react"

export default function Home() {
  const [openLiteChat, setOpenLiteChat] = useState(false)

  useEffect(() => {
    console.log("openLiteChat:", openLiteChat)
  })
  const handleOpenChat = () => {
   setOpenLiteChat((prev)=> !prev)
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#3f0e40]">
      <Link
        href="/chat"
        className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#3f0e40] shadow-lg transition hover:bg-slate-100"
      >
        Open Flack
      </Link>

      <div 
        onClick={handleOpenChat}
        className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#3f0e40] shadow-lg transition hover:bg-slate-100"
      >
        Open Direct Messages
      </div>
      {openLiteChat && (
        <LiteChat />
      )}

    </div>
  )
}
