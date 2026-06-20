import { randomUUID } from 'crypto'
import { ChannelSchema } from '@/shared/schemas/channel.schema.js'
import { ChannelMemberSchema } from '@/shared/schemas/channelMember.schema.js'
import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { EventDispatcher } from '@/application/events/eventDispatcher.js'
import type { UserRepository } from '@/domain/user/user.repository.js'

export function makeEnsureDMChannel(
  repo: ChannelRepository,
  dispatcher: EventDispatcher,
  userRepo: UserRepository,
) {
  return async function ensureDMChannel({
    userA,
    userB,
  }: {
    userA: string
    userB: string
  }) {

    try{

      console.log("Making DM channel between", userA, "and", userB)
      
    // 1. check existing
    let channel = await repo.findDMChannel(userA, userB)

    // 2. create if not found
    if (!channel) {
      console.log("No existing channel found, creating new one...")

      channel = ChannelSchema.parse({
        id: randomUUID(),
        type: 'dm',
        createdAt: new Date(),
      })

      await repo.createChannel(channel)

      console.log("DM channel created with ID:", channel.id)

      // 🔥 fetch users FIRST
      const [userAData, userBData] = await Promise.all([
        userRepo.findById(userA),
        userRepo.findById(userB),
      ])
      
      if (!userAData || !userBData) {
        throw new Error('Users not found when creating DM channel')
      }
      
      // 🔥 create enriched members
      await repo.addMember(
        ChannelMemberSchema.parse({
          channelId: channel.id,
          userId: userAData.id,
          // username: userAData.username,
          avatar: userAData.avatar,
          email: userAData.email,
          role: 'member',
          joinedAt: new Date(),
        })
      )

      await repo.addMember(
        ChannelMemberSchema.parse({
          channelId: channel.id,
          userId: userBData.id,
          // username: userBData.username,
          avatar: userBData.avatar,
          email: userBData.email,
          role: 'member',
          joinedAt: new Date(),
        })
      )
      
      console.log("Created new DM channel:", channel)

      // 🔥 get enriched members
      const members = await repo.getMembers(channel.id)

      dispatcher.emit({
        type: 'CHANNEL_CREATED',
        payload: {
          id: channel.id,
          type: channel.type,
          members,
          createdAt: channel.createdAt.toISOString(),
        },
      })
    }

    if (!channel) {
      throw new Error('Failed to ensure DM channel')
    }

    // 3. always emit available
    const members = await repo.getMembers(channel.id)
    
    dispatcher.emit({
      type: 'CHANNEL_AVAILABLE',
      payload: {
        id: channel.id,
        type: channel.type,
        members,
        createdAt: channel.createdAt.toISOString(),
      },
    })
    
    return channel
  } catch (err) {
    console.error("Error in ensureDMChannel:", err)
    throw err 
  }
}
}
