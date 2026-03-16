import MessageList from "src/features/messages/components/message-list"
import MessageInput from "src/features/messages/components/message-input"

export default function ChatPanel() {
  return (
    <main className="flex-1 flex flex-col max-h-full bg-white">

      <div className="border-b border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 backdrop-blur">
        Channel Name
      </div>

      <MessageList />

      <MessageInput />

    </main>
  )
}
