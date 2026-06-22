import type { ChannelRepository } from '@/domain/channel/channel.repository.js'

export function makeGetChannels(
  repository: ChannelRepository,
) {
  return async function getChannels(
    userId: string,
  ) {
    const channels =
      await repository.findChannelsForUser(
        userId,
      )

    return Promise.all(
      channels.map(async (channel) => ({
        id: channel.id,
        type: channel.type,
        name: channel.name,
        avatar: channel.avatar,
        createdAt: channel.createdAt,

        members:
          await repository.getMembers(
            channel.id,
          ),
      })),
    )
  }
}