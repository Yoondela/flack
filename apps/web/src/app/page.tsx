import { ChatRoot } from '@/modules/chat/ChatRoot'

export default function Page() {
  return (
    <div className="h-screen w-full">
      <ChatRoot
        userId="user-1"
        role="client" // change to 'client' to test LiteChat
      />
    </div>
  )
}
