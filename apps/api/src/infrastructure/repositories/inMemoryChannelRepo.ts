import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { Channel } from '@/shared/schemas/channel.schema.js'
import type { ChannelMember } from '@/shared/schemas/channelMember.schema.js'
import { randomUUID } from 'crypto'
import { ChannelSchema } from '@/shared/schemas/channel.schema.js'
import { ChannelMemberSchema } from '@/shared/schemas/channelMember.schema.js'

export class InMemoryChannelRepo implements ChannelRepository {

  private channels: Channel[] = []
  private members: ChannelMember[] = []


// a try block around the whole method is needed
async createDMChannel(userA: string, userB: string): Promise<Channel> {

  console.log("Attempting to create DM channel between ", userA, " and ", userB)
  // 🔒 safety: prevent duplicates even if caller forgets
  const existing = await this.findDMChannel(userA, userB)
  if (existing) return existing

  console.log("No existing DM channel found, proceeding to create new one...")

  const channel = ChannelSchema.parse({
    id: randomUUID().toString(),
    type: 'dm',
    createdAt: new Date(),
  })

  console.log("Parsed new channel schema: ", channel)

  this.channels.push(channel)

  const now = new Date()

  console.log("Adding members to the channel: ", userA, " and ", userB)
  
  this.members.push(
    ChannelMemberSchema.parse({
      channelId: channel.id,
      userId: userA,
      role: 'member',
      joinedAt: now,
    })
  )

  this.members.push(
    ChannelMemberSchema.parse({
      channelId: channel.id,
      userId: userB,
      role: 'member',
      joinedAt: now,
    })
  )

console.log("DM channel created with members: ", this.members.filter(m => m.channelId === channel.id))  

  return channel
}


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
