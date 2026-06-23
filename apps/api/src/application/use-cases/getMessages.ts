import type { MessageRepository } from '@/domain/message/message.repository.js'
import type { UserRepository } from '@/domain/user/user.repository.js'

export function makeGetChannelMessages(
  messageRepo: MessageRepository,
  userRepo: UserRepository,
) {
  return async function getChannelMessages(
    channelId: string,
  ) {
    const messages =
      await messageRepo.getMessagesForChannel(
        channelId,
      )

    const senderIds = [
      ...new Set(
        messages.map(
          m => m.sender,
        ),
      ),
    ]

    const users =
      await userRepo.findManyByIds(
        senderIds,
      )

    const userMap = new Map(
      users.map(user => [
        user.id,
        user,
      ]),
    )

    return messages.map(message => {
      const sender =
        userMap.get(
          message.sender,
        )

      return {
        id: message.id,
        channelId:
          message.channelId,

        sender: {
          id: sender?.id,
          username:
            sender?.username ??
            'Unknown',
          avatar:
            sender?.avatar,
          email:
            sender?.email,
        },

        content:
          message.content,

        createdAt:
          message.createdAt,
      }
    })
  }
}