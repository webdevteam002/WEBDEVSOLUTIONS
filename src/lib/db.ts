import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // Strip any accidental quotes that might have been pasted in Vercel
  const uri = MONGODB_URI ? MONGODB_URI.replace(/^["']|["']$/g, '') : '';

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    }).catch(err => {
      cached.promise = null; // reset so we can try again
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  
  return cached.conn;
}

export default connectToDatabase;
