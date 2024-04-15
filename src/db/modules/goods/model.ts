import mongoose from 'mongoose';

const goodSchema = new mongoose.Schema({
  photos: [String],
  desc: String,
  price: String,
  longitude: Number,
  latitude: Number,
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
  },
  publish_date: {
    type: Number,
    default: Date.now,
  },
  /* 用户id */
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  /* 更新时间 */
  update_time: {
    type: Number,
    default: Date.now,
  },
});

export const Good = mongoose.model('good', goodSchema);
