export interface ChannelMember {
  channelId: string
  userId: string
  role: 'member' | 'admin'
  joinedAt: Date
}
