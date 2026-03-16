"use client"

import { useState } from "react"
import ChannelList from "../../../features/channels/components/channel-list"
import DMList from "../../../features/DMs/components/dm-list"
import ChatPanelMax from "./chat-panel-max"
import DMListMax from "./dm-list-max"

export default function LiteChat() {
  const [openDMList, setOpenDMList] = useState(false)
  const [openChatPanel, setOpenChatPanel] = useState(false)

  return (
    <aside className="w-64 border-r flex flex-col h-screen">
      <p
        className="cursor-pointer px-3 py-2 text-sm font-semibold text-slate-700"
        onClick={() => setOpenDMList(true)}
      >
        These is DMs
      </p>
      {/* <ChannelList /> */}
      {!openChatPanel ? (
        <DMListMax 
          listDMs={openDMList}
          setListDMs={setOpenDMList}
          setOpenChatPanel={setOpenChatPanel}
        />
      ):
        <ChatPanelMax
          viewChat={openChatPanel}
          setViewChat={setOpenChatPanel}
        />
      }
    </aside>
  )
}
