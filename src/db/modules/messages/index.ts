import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  time: {
    type: Number,
    default: Date.now,
  },
  content: String,
});

export const Message = mongoose.model('message', messageSchema);
