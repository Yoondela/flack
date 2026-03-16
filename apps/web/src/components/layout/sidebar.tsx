import ChannelList from "../../features/channels/components/channel-list"
import DMList from "../../features/DMs/components/dm-list"
// import DMList from "./dm-list"


export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[#2b0a2c] flex flex-col bg-[#3a0d3c] text-slate-100">
      <ChannelList />
      <DMList />
    </aside>
  )
}
