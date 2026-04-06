import type { Channel } from '@/shared/schemas/channel.schema.js'
import type { ChannelMember } from '@/shared/schemas/channelMember.schema.js'

export interface ChannelRepository {
  createChannel(channel: Channel): Promise<Channel>
  findById(id: string): Promise<Channel | null>

  addMember(member: ChannelMember): Promise<void>
  getMembers(channelId: string): Promise<ChannelMember[]>

  createDMChannel(userA: string, userB: string): Promise<Channel>
  findDMChannel(userA: string, userB: string): Promise<Channel | null>
}
