
export function makeGetChatData(
  getChannels: any,
  getChannelMessages: any,
) {
  return async function getChatData(
    userId: string,
  ) {
    const channels =
      await getChannels(userId)

    const messages: Record<
      string,
      any[]
    > = {}

    for (const channel of channels) {
      messages[channel.id] =
        await getChannelMessages(
          channel.id,
        )
    }

    return {
      channels,
      messages,
    }
  }
}