'use client'

import { MessageCircle } from 'lucide-react'

export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={() => {
  console.log('OPEN CLICKED')
  onClick()
}}

      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-500"
    >
      <MessageCircle />
    </button>
  )
}
