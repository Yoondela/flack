// import { ChannelModel } from '../models/channel.model.js'
// import type { ChannelRepository } from '@/domain/channel/channel.repository.js'

// export class MongoChannelRepo implements ChannelRepository {

//   async createChannel(channel) {
//     const doc = await ChannelModel.create({
//       _id: channel.id,
//       type: channel.type,
//       members: channel.members || [],
//       createdAt: channel.createdAt,
//     })

//     return {
//       id: doc._id.toString(),
//       type: doc.type,
//       createdAt: doc.createdAt,
//     }
//   }

//   async findById(id) {
//     const doc = await ChannelModel.findById(id)
//     if (!doc) return null

//     return {
//       id: doc._id.toString(),
//       type: doc.type,
//       createdAt: doc.createdAt,
//     }
//   }

//   async findDMChannel(userA, userB) {
//     const members = [userA, userB].sort()

//     const doc = await ChannelModel.findOne({
//       type: 'dm',
//       members: members,
//     })

//     if (!doc) return null

//     return {
//       id: doc._id.toString(),
//       type: doc.type,
//       createdAt: doc.createdAt,
//     }
//   }

//   async createDMChannel(userA, userB) {
//     const members = [userA, userB].sort()

//     try {
//       const doc = await ChannelModel.create({
//         type: 'dm',
//         members,
//       })

//       return {
//         id: doc._id.toString(),
//         type: doc.type,
//         createdAt: doc.createdAt,
//       }
//     } catch (err) {
//       // 🔥 race condition fallback
//       const existing = await ChannelModel.findOne({
//         type: 'dm',
//         members,
//       })

//       if (!existing) throw err

//       return {
//         id: existing._id.toString(),
//         type: existing.type,
//         createdAt: existing.createdAt,
//       }
//     }
//   }

//   async getMembers(channelId) {
//     const doc = await ChannelModel.findById(channelId)
//     if (!doc) return []

//     return doc.members.map(userId => ({
//       channelId,
//       userId,
//       role: 'member',
//       joinedAt: doc.createdAt,
//     }))
//   }

//   async addMember() {
//     throw new Error('Not supported for DM in Mongo repo')
//   }
// }
