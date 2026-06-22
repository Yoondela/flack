import mongoose from 'mongoose'

export async function connectDatabase() {
    console.log('Connecting to MongoDB...', process.env.MONGO_URI)
  await mongoose.connect(
    process.env.MONGO_URI ??
      'mongodb://localhost:27017/flack',
  )

  console.log('MongoDB connected')
}