import mongoose from 'mongoose';

// Mevcut modeli kaldır
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'music'],
    required: true
  },
  content: {
    type: String,
    required: function(this: { type: string }) {
      return this.type === 'text';
    }
  },
  spotifyTrackId: {
    type: String,
    required: function(this: { type: string }) {
      return this.type === 'music';
    }
  },
  caption: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  profileImage: String,
  bio: String,
  location: String,
  website: String,
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    github: String,
    youtube: String,
    twitch: String,
    discord: String
  },
  posts: [postSchema]
});

export default mongoose.model('User', userSchema); 