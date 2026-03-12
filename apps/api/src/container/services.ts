import { MongoMessageRepository } from '../modules/chat/repositories/mongoMessageRepository.js'
import { MessageService } from '../modules/chat/services/messageService.js'

const messageRepository = new MongoMessageRepository()

export const services = {
  messageService: new MessageService(messageRepository)
}
