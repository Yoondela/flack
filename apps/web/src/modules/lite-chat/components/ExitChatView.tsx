'use client'

export function ExitChatView({
  userId,
  onBack,
}: {
  userId: string
  onBack: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-2">
        <button onClick={onBack}>←</button>
        <span className="font-semibold">{userId}</span>
      </div>
    </div>
  )
}
