import type { ChannelRepository } from "../repositories/channelRepository.js"

export class ChannelService {

  constructor(private repo : ChannelRepository) {}

  async getOrCreateDM(userA: string, userB: string) {

    let channel = await this.repo.findDM(userA, userB)

    if (!channel) {
      channel = await this.repo.createDM(userA, userB)
    }

    return channel
  }
}
