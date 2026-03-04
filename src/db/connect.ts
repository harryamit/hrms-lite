import mongoose from 'mongoose';
import { config } from '../config';

export async function connectDb(): Promise<void> {
  console.log('Connecting to MongoDB...', config.mongodbUri);
  await mongoose.connect(config.mongodbUri);
}

