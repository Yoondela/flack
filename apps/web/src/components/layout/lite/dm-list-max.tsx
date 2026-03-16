"use client"

import { sendWS } from "@/lib/socket"
import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetFooter } from "@/components/ui/sheet";

type Props = {
  listDMs : boolean
  setListDMs : React.Dispatch<React.SetStateAction<boolean>>
  setOpenChatPanel : React.Dispatch<React.SetStateAction<boolean>>
} 

export default function DMListMax({ listDMs, setListDMs, setOpenChatPanel } : Props) {

  const users = [
    { id: "yondela", name: "yondela" },
    { id: "amber", name: "amber" },
  ];

  function startDM(userId: string) {

    sendWS("START_DM", {
      targetUserId: userId
    })

    setOpenChatPanel(true)
    setListDMs(false)

  }

  return (
   <div className="flex flex-wrap gap-2">
    
        <Sheet open={listDMs} onOpenChange={setListDMs}>
          <SheetContent
            side={"right"}
            className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
          >
            <SheetHeader>
              <div className="flex w-[13px] h-3 bg-red-400 gap-5 items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 backdrop-blur">
                <SheetTitle>Messages</SheetTitle>
              </div>
            </SheetHeader>
            <div className="no-scrollbar overflow-y-auto p-4">
              {users?.map((user) => (
                <div key={user.id}>
                    <div onClick={() => startDM(`${user.id}`)}> {user.name} </div>
                </div>
              ))}
            </div>
            <SheetFooter>
              <p className="text-sm">Powered by Flack</p>
            </SheetFooter>
          </SheetContent>
        </Sheet>
    </div> 
  )
}
