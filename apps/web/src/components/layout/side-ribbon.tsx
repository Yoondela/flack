import { Activity, Calendar, Hash, Home, MessageSquare } from "lucide-react"

const topItems = [
  { label: "Home", Icon: Home },
  { label: "Channels", Icon: Hash },
  { label: "DMs", Icon: MessageSquare },
  { label: "Activity", Icon: Activity },
]

const bottomItems = [{ label: "Callendar", Icon: Calendar }]

export default function SideRibbon() {
  return (
    <aside className="h-full w-20 flex flex-col gap-3 bg-[#3f0e40] px-2 py-3 text-slate-200">
      {topItems.map(({ label, Icon }) => (
        <div
          key={label}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 text-[10px] font-semibold tracking-wide text-slate-200/90 transition-colors hover:bg-[#2b0a2c] hover:text-white"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
      <hr className="border-[#2b0a2c]" />
      {bottomItems.map(({ label, Icon }) => (
        <div
          key={label}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 text-[10px] font-semibold tracking-wide text-slate-200/90 transition-colors hover:bg-[#2b0a2c] hover:text-white"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </aside>
  )
}
