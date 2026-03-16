import type { Channel } from '../types/channel.js'

export interface ChannelRepository {
  findDM(userA: string, userB: string): Promise<Channel | null>
  createDM(userA: string, userB: string): Promise<Channel>
}
