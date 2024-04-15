import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  avatar: String,
  name: String,
  openId: String,
});

export const User = mongoose.model('user', userSchema);
