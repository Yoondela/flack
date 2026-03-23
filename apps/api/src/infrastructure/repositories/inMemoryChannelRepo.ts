import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { Channel } from '@/shared/schemas/channel.schema.js'
import type { ChannelMember } from '@/shared/schemas/channelMember.schema.js'

export class InMemoryChannelRepo implements ChannelRepository {
  private channels: Channel[] = []
  private members: ChannelMember[] = []

  async createChannel(channel: Channel): Promise<Channel> {
    this.channels.push(channel)
    return channel
  }

  async findById(id: string): Promise<Channel | null> {
    return this.channels.find(c => c.id === id) || null
  }

  async addMember(member: ChannelMember): Promise<void> {
    this.members.push(member)
  }

  async getMembers(channelId: string): Promise<ChannelMember[]> {
    return this.members.filter(m => m.channelId === channelId)
  }

  async findDMChannel(userA: string, userB: string): Promise<Channel | null> {
    const dmChannels = this.channels.filter(c => c.type === 'dm')

    for (const channel of dmChannels) {
      const members = this.members.filter(m => m.channelId === channel.id)
      const userIds = members.map(m => m.userId)

      if (
        userIds.includes(userA) &&
        userIds.includes(userB) &&
        userIds.length === 2
      ) {
        return channel
      }
    }

    return null
  }
}
