import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnv.js';

export async function initMongoConnection() {
  try {
    const username = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const dbName = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${username}:${password}@${url}/?retryWrites=true&w=majority&appName=${dbName}`,
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log(e);
  }
}
