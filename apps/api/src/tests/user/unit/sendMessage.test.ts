import { describe, it, expect } from 'vitest'
import { InMemoryChannelRepo } from '@/infrastructure/repositories/inMemoryChannelRepo.js'
import { InMemoryMessageRepo } from '@/infrastructure/repositories/inMemoryMessageRepo.js'
import { makeSendMessage } from '@/application/use-cases/sendMessage.js'
import { makeCreateChannel } from '@/application/use-cases/createChannel.js'
import { EventDispatcher } from '@/application/events/eventDispatcher.js'



describe('Send Message', () => {
  const channelRepo = new InMemoryChannelRepo()
  const messageRepo = new InMemoryMessageRepo()
  const dispatcher = new EventDispatcher()


  const createChannel = makeCreateChannel(channelRepo)
  const sendMessage = makeSendMessage(channelRepo, messageRepo, dispatcher)


  it('should send a message in a channel', async () => {
    const channel = await createChannel({
      type: 'public',
      creatorId: 'user-1',
    })

    const message = await sendMessage({
      channelId: channel.id,
      senderId: 'user-1',
      content: 'Hello',
    })

    expect(message.content).toBe('Hello')
  })

  it('should not allow non-members to send messages', async () => {
    const channel = await createChannel({
      type: 'public',
      creatorId: 'user-1',
    })

    await expect(
      sendMessage({
        channelId: channel.id,
        senderId: 'user-2',
        content: 'Hack attempt',
      })
    ).rejects.toThrow()
  })

  it('should emit MESSAGE_CREATED event', async () => {
    const events: any[] = []
  
    dispatcher.on('MESSAGE_CREATED', (event) => {
      events.push(event)
    })
  
    const channel = await createChannel({
      type: 'public',
      creatorId: 'user-1',
    })
  
    await sendMessage({
      channelId: channel.id,
      senderId: 'user-1',
      content: 'Hello',
    })
  
    expect(events.length).toBe(1)
  })

})
