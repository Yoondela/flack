import type { MessageRepository } from '@/domain/message/message.repository.js'

export function makeGetChannelMessages(
  repository: MessageRepository,
) {
  return async function getChannelMessages(
    channelId: string,
  ) {
    return repository.getMessagesForChannel(
      channelId,
    )
  }
}