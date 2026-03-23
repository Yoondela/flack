import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react'
import { DMList } from './DMList'
import { LiteChatView } from './LiteChatView'
import { MessageInput } from './MessageInput'
import { ExitChatView } from './ExitChatView'

export function ChatSheet({
    open,
    onOpenChange,
  }: {
    open: boolean
    onOpenChange: (v: boolean) => void
  }) {
    const [activeUserId, setActiveUserId] = useState<string | null>(null)
  return (
    <div className="flex flex-wrap gap-2">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              chatssssssssss
            </Button>
          </SheetTrigger>
          <SheetContent
            side={'right'}
            className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
          >
            <SheetHeader>
              {activeUserId ? (
                <ExitChatView
                  userId={activeUserId}
                  onBack={() => setActiveUserId(null)}
                />
              ) : (
                <>
                  <SheetTitle>Chats</SheetTitle>
                  <SheetDescription>
                    Direct messages
                  </SheetDescription>
                </>
              )}
            </SheetHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              {!activeUserId ? (
                <DMList onSelect={setActiveUserId} />
              ) : (
                <LiteChatView
                  userId={activeUserId}
                  onBack={() => setActiveUserId(null)}
                />
              )}
            </div>
            <SheetFooter>
              {activeUserId ? (
                <div className="w-full border-">
                  <MessageInput userId={activeUserId} />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center w-full"><p>Flack</p></div>
                </>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
    </div>
  )
}
