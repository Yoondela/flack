import MessageList from "src/features/messages/components/message-list"
import MessageInput from "src/features/messages/components/message-input"
import { MoveLeft } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetTitle, SheetHeader } from "@/components/ui/sheet"

type Props = {
  viewChat : boolean
  setViewChat : React.Dispatch<React.SetStateAction<boolean>>
} 

export default function ChatPanelMax({ viewChat, setViewChat }: Props) {
  const handleBack = () => {
    setViewChat(false)
  }

  return (
    <div className="flex flex-wrap gap-2">
    
        <Sheet open={viewChat} onOpenChange={setViewChat}>
          <SheetContent
            side={"right"}
            className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
          >
            <SheetHeader>
              <div className="flex w-[13px] h-3 bg-red-400 gap-5 items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 backdrop-blur">
                <SheetTitle>Chanel Name</SheetTitle>
                <div onClick={() => handleBack()}>
                  <MoveLeft />
                </div>
              </div>
              <SheetDescription>
                Chats are incrypted
              </SheetDescription>
            </SheetHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              <MessageList />
            </div>
            <SheetFooter>
              <MessageInput />
            </SheetFooter>
          </SheetContent>
        </Sheet>
    </div>
  )
}
