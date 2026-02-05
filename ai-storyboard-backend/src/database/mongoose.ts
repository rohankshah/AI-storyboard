import mongoose from 'mongoose';

export const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Mongo connected');
};

export default mongoose;
