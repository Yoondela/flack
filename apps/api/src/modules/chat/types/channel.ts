export interface Channel {
  id: string
  type: 'public' | 'dm'
  members: string[]
  createdAt: Date
}
