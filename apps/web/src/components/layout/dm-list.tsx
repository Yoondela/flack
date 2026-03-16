"use client"

import { User } from "../../types/types.js"

interface Props {
  users?: User[]
}

export default function DMList({ users = [] }: Props) {
  return (
    <div className="p-3 border-t">
      <h2 className="text-sm font-semibold mb-2">Direct Messages</h2>

      <ul className="space-y-1">
        {users.map((user) => (
          <li
            key={user.id}
            className="px-2 py-1 rounded hover:bg-muted cursor-pointer"
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
