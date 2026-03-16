import { ChannelModel } from '../mongooseSchemas/Channel.js'

export class MongoChannelRepository {

  async findDM(userA: string, userB: string) {

    const doc = await ChannelModel.findOne({
      type: 'dm',
      members: { $all: [userA, userB] },
    })

    if (!doc) return null

    return {
      id: doc._id.toString(),
      type: doc.type,
      members: doc.members,
      createdAt: doc.createdAt,
    }
  }

  async createDM(userA: string, userB: string) {

    const doc = await ChannelModel.create({
      type: 'dm',
      members: [userA, userB],
    })

    return {
      id: doc._id.toString(),
      type: doc.type,
      members: doc.members,
      createdAt: doc.createdAt,
    }
  }
}
