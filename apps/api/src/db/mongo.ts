import mongoose from 'mongoose'

export async function connectMongo() {
  console.log('MongoDB connecting..')

  const uri = process.env.MONGO_URI!
  console.log('MongoDB connectint to: ', uri)


  await mongoose.connect(uri)

  console.log('MongoDB connected')
}
