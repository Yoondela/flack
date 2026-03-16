import Sidebar from "src/components/layout/sidebar"
import ChatPanel from "src/components/layout/chat-panel"
import SideRibbon from "@/components/layout/side-ribbon"

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-[#edeaf0]">
      <SideRibbon />
      <Sidebar />
      <ChatPanel />
    </div>
  )
}
