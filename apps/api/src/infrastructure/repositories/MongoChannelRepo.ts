import type { ChannelRepository } from '@/domain/channel/channel.repository.js'
import type { Channel } from '@/shared/schemas/channel.schema.js'
import type { ChannelMember } from '@/shared/schemas/channelMember.schema.js'

import { ChannelModel } from '../db/models/ChannelModel.js'
import { ChannelMemberModel } from '../db/models/ChannelMemberModel.js'

export class MongoChannelRepo
  implements ChannelRepository
{
  async createChannel(
    channel: Channel,
  ): Promise<Channel> {
    await ChannelModel.create(channel)

    return channel
  }

  async findById(
    id: string,
  ): Promise<Channel | null> {
    return await ChannelModel.findOne({
      id,
    }).lean()
  }

  async addMember(
    member: ChannelMember,
  ): Promise<void> {
    await ChannelMemberModel.create(member)
  }

  async getMembers(
    channelId: string,
  ): Promise<ChannelMember[]> {
    return await ChannelMemberModel.find({
      channelId,
    }).lean()
  }

  async findDMChannel(
    userA: string,
    userB: string,
  ): Promise<Channel | null> {
    const memberships =
      await ChannelMemberModel.find({
        userId: {
          $in: [userA, userB],
        },
      }).lean()

    const channelCounts = new Map<
      string,
      Set<string>
    >()

    for (const member of memberships) {
      if (
        !channelCounts.has(
          member.channelId,
        )
      ) {
        channelCounts.set(
          member.channelId,
          new Set(),
        )
      }

      channelCounts
        .get(member.channelId)!
        .add(member.userId)
    }

    for (const [
      channelId,
      users,
    ] of channelCounts) {
      if (users.size !== 2) {
        continue
      }

      const channel =
        await ChannelModel.findOne({
          id: channelId,
          type: 'dm',
        }).lean()

      if (channel) {
        const members =
          await ChannelMemberModel.find({
            channelId,
          }).lean()

        if (
          members.length === 2 &&
          members.some(
            m => m.userId === userA,
          ) &&
          members.some(
            m => m.userId === userB,
          )
        ) {
          return channel
        }
      }
    }

    return null
  }

  async findChannelsForUser(
    userId: string,
  ): Promise<Channel[]> {
    const memberships =
      await ChannelMemberModel.find({
        userId,
      }).lean()

    const channelIds = memberships.map(
      m => m.channelId,
    )

    return await ChannelModel.find({
      id: {
        $in: channelIds,
      },
    }).lean()
  }
}