'use client'

import { useChatStore } from '@/modules/chat/store/chatStore'


export function DMList({
  onSelect,
}: {
  onSelect: (id: string) => void
}) {

  const startDM = useChatStore((s) => s.startDM)
  const getDMChannel = useChatStore((s) => s.getDMChannel)
  const setActiveChannel = useChatStore((s) => s.setActiveChannel)

  const users = ['amber', 'yondela'] // temp until API
  
  return (
    <div className='flex flex-col'>
      {users.map((id) => (
        <button
          key={id}
          
          onClick={() => {
            const existing = getDMChannel(id)

            console.log("existing:", existing, id)
          
            if (existing) {
              setActiveChannel(existing.id)
            } else {
              startDM(id)
            }

            onSelect(id)
          }}

          className="p-4 text-left hover:bg-zinc-100"
        >
          {id}
        </button>
      ))}
    </div>
  )
}
