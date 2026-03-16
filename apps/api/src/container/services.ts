import { channel } from 'node:diagnostics_channel'
import { MongoMessageRepository } from '../modules/chat/repositories/mongoMessageRepository.js'
import { MessageService } from '../modules/chat/services/messageService.js'
import { MongoChannelRepository } from '../modules/chat/repositories/mongoChannelRepository.js'
import { ChannelService } from '../modules/chat/services/channelService.js'

const messageRepository = new MongoMessageRepository()
const channelRepository = new MongoChannelRepository()

export const services = {
  messageService: new MessageService(messageRepository),
  channelService: new ChannelService(channelRepository)
}
