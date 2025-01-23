import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MongoDB URI bulunamadı.');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  try {
    if (cached.conn) {
      console.log('Mevcut MongoDB bağlantısı kullanılıyor');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      console.log('Yeni MongoDB bağlantısı oluşturuluyor');
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    cached.conn = await cached.promise;
    console.log('MongoDB bağlantısı başarılı');
    return cached.conn;
  } catch (e) {
    console.error('MongoDB bağlantı hatası:', e);
    cached.promise = null;
    throw e;
  }
}

export default connectDB; 