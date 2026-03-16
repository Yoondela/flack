"use client"

import { useEffect } from "react"
import { connectSocket } from "@/lib/socket"

export default function WSProvider({
  children
}: {
  children: React.ReactNode
}) {

  useEffect(() => {

    const userId = process.env.NEXT_PUBLIC_USER_ID

    if (!userId) {
      console.error("Missing user id")
      return
    }

    connectSocket(userId)

  }, [])

  return <>{children}</>
}
